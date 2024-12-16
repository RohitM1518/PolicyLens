import { MongoClient } from 'mongodb';

// Connect to your Atlas cluster
const client = new MongoClient(process.env.MONGODB_URI);
// console.log("Starting Index process."+process.env.MONGODB_URI);
async function run() {
    try {
      const database = client.db("capstone");
      const collection = database.collection("chatembeddings");
     
      // Define your Atlas Vector Search index
      const index = {
          name: "vector_index",
          type: "vectorSearch",
          definition: {
            "fields": [
              {
                "type": "vector",
                "numDimensions": 768,
                "path": "embedding",
                "similarity": "cosine"
              }
            ]
          }
      }
 
      // Call the method to create the index
      const result = await collection.createSearchIndex(index);
      console.log(result);
    } finally {
      await client.close();
    }
}
export default run;