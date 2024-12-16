import { pipeline } from '@xenova/transformers';

// Function to generate embeddings for a given data source
export async function getEmbeddings(data) {
    try {
        console.log("Generating embeddings for the given data.",data);
        const embedder = await pipeline(
            'feature-extraction', 
            'Xenova/nomic-embed-text-v1');
        console.log("Embedder: ",embedder);
        const results = await embedder(data, { pooling: 'mean', normalize: true });
        console.log("Results: ",results);
        return Array.from(results.data);
    } catch (error) {
        console.log(error)
        throw error
    }
}
