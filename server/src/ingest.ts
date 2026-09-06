import { qClient } from "./qdrantClient";
import { chunkText } from "../utills/chunker";
import { getEmbedding } from "../utills/embedder";
import { extractTextFromFile } from "../utills/extractor";
import { createHash } from "crypto";


/*
    Main function to extract text from a file, chunk it, get embeddings, and store them in Qdrant.
*/


export const COLLECTION_NAME = "documents_bge_small_v1";

const asUuid = (value: string) =>
    `${value.slice(0, 8)}-${value.slice(8, 12)}-${value.slice(12, 16)}-${value.slice(16, 20)}-${value.slice(20, 32)}`;

const ensureCollection = async (vectorSize: number) => {
    const collections = await qClient.getCollections();
    if (!collections.collections.some(collection => collection.name === COLLECTION_NAME)) {
        await qClient.createCollection(COLLECTION_NAME, {
            vectors: { size: vectorSize, distance: "Cosine" },
        });
    }
};

export const ingest = async (filepath: string, fileName: string) => {
    // Step 1: Extract text from file
    const text =await extractTextFromFile(filepath);
    console.log("Extracted Text Length:",text.length);

    // Step 2: Chunk the text
    if (!text.trim()) throw new Error("The uploaded document contains no readable text");
    const chunks = chunkText(text, 500, 75);
    console.log("Number of Chunks:",chunks.length);

    // Step 3: Get embeddings for each chunk
    const embeddings =await getEmbedding(chunks);
    console.log("Embeddings Retrieved:",embeddings.length);

    // Step 4: Store embeddings in Qdrant
    const fileId = createHash("sha256").update(text).digest("hex");
    const points = embeddings.map((embedding, index) => ({
        id: asUuid(createHash("sha256").update(`${fileId}:${index}`).digest("hex")),
        vector: embedding,
        payload: {
            text: chunks[index],
            fileId,
            fileName,
            chunkIndex: index,
        },
    }));

    await ensureCollection(embeddings[0].length);
    const batchSize = 64;
    for (let index = 0; index < points.length; index += batchSize) {
        await qClient.upsert(COLLECTION_NAME, {
            points: points.slice(index, index + batchSize),
        });
    }
    
    return { message: `Indexed ${chunks.length} chunks from ${fileName}` };
}

// ingest("sample.pdf").catch((err)=>console.error("Error in main:",err));
