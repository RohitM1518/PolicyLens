import { getEmbeddings } from './getEmbeddings.js';
import { ChatEmbedding } from '../models/chatEmbeddingModel.js';
import mongoose from 'mongoose';

export async function getQueryResults(query, messageId, chatId) {
    try {
        const queryEmbeddings = await getEmbeddings(query);

        // First pipeline: Search by messageId
        const messageIdPipeline = [
            {
                $vectorSearch: {
                    index: "vector_index",
                    queryVector: queryEmbeddings,
                    path: "embedding",
                    exact: false,
                    numCandidates: 100,
                    limit: 10
                }
            },
            {
                $match: { message: new mongoose.Types.ObjectId(messageId)}
            },
            {
                $project: {
                    _id: 0,
                    document: 1
                }
            }
        ];

        // Second pipeline: Search by chatId
        const chatIdPipeline = [
            {
                $vectorSearch: {
                    index: "vector_index",
                    queryVector: queryEmbeddings,
                    path: "embedding",
                    exact: false,
                    numCandidates: 100,
                    limit: 10
                }
            },
            {
                $match: { chat: new mongoose.Types.ObjectId(chatId) }
            },
            {
                $project: {
                    _id: 0,
                    document: 1
                }
            }
        ];

        const messageIdResults = await ChatEmbedding.aggregate(messageIdPipeline);
        console.log(messageIdResults);
        const chatIdResults = await ChatEmbedding.aggregate(chatIdPipeline);
        console.log(chatIdResults);

        const combinedResults = [...messageIdResults, ...chatIdResults].slice(0, 10);
        
        return combinedResults;

    } catch (err) {
        console.error('Error in getQueryResults:', err);
        throw err;
    }
}
