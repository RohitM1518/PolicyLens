import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import { getEmbeddings } from "./getEmbeddings.js";
import { ChatEmbedding } from "../models/chatEmbeddingModel.js";

async function run(attachedFileURL,chatid,messageid,userid) {
    const client = new MongoClient(process.env.MONGODB_URI);
    // console.log("Starting ingestion process."+process.env.MONGODB_URI);
    try {
        // Save online PDF as a file
        const rawData = await fetch(attachedFileURL);
        const pdfBuffer = await rawData.arrayBuffer();
        const pdfData = Buffer.from(pdfBuffer);
        fs.writeFileSync("investor-report.pdf", pdfData);

        const loader = new PDFLoader(`investor-report.pdf`);
        const data = await loader.load();

        // Chunk the text from the PDF
        const textSplitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 20,
          });
        const docs = await textSplitter.splitDocuments(data);
        console.log(`Successfully chunked the PDF into ${docs.length} documents.`);
        console.log(docs)
        // Connect to your Atlas cluster
        // await client.connect();
        // const db = client.db("capstone");
        // const collection = db.collection("test");

        console.log("Generating embeddings and inserting documents.");
        let docCount = 0;
        await Promise.all(docs.map(async doc => {
            const embeddings = await getEmbeddings(doc.pageContent);
            
            // Insert the embeddings and the chunked PDF data into Atlas
            await ChatEmbedding.create({
                chat: chatid,
                message: messageid,
                user:userid,
                document:doc,
                embedding: embeddings,
            })

            // await collection.insertOne({
            //     document: doc,
            //     embedding: embeddings,
            // });
            docCount += 1;
        }))
        console.log(`Successfully inserted ${docCount} documents.`);
    } catch (err) {
        console.log(err.stack);
    }
    finally {
        await client.close();
    }
}
export default run ;
