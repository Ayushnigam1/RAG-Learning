import { qClient } from "./qdrantClient.ts";
import { chunkText } from "../utills/chunker.ts";
import { getEmbedding } from "../utills/embedder.ts";
import { extractTextFromFile } from "../utills/extractor.ts";


/*
    Main function to extract text from a file, chunk it, get embeddings, and store them in Qdrant.
*/


const COLLECTION_NAME="documents"

export const ingest =async(filepath:string)=>{
    // Step 1: Extract text from file
    const text =await extractTextFromFile(filepath);
    console.log("Extracted Text Length:",text.length);

    // Step 2: Chunk the text
    const chunks = chunkText(text,500); // chunk size of 50 tokens
    console.log("Number of Chunks:",chunks.length);

    // Step 3: Get embeddings for each chunk
    const embeddings =await getEmbedding(chunks);
    console.log("Embeddings Retrieved:",embeddings.length);

    // Step 4: Store embeddings in Qdrant
    const points = embeddings.map((embedding, index) => ({
        id: index,      
        vector: embedding,
        payload: { text: chunks[index] },
    }));    

    await qClient.deleteCollection(COLLECTION_NAME);
console.log("deleted old collection")
    await qClient.recreateCollection(COLLECTION_NAME, {
        vectors: {
            size: embeddings[0].length,
            distance: "Cosine",
        },
    });  
    await qClient.upsert(COLLECTION_NAME,{
        points: points,
    });
    
return Response.json({message:`Data of length ${chunks.length} upserted to Qdrant successfully. from file ${filepath}`});
}

// ingest("sample.pdf").catch((err)=>console.error("Error in main:",err));