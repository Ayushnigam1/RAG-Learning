import { qClient } from "./qdrantClient";
import { queryEmbedding, TextGenerator } from "../utills/embedder";
import { COLLECTION_NAME } from "./ingest";

export const query = async (queryText: string) => {
    if (!queryText?.trim()) throw new Error("Question cannot be empty");
    if (queryText.length > 2000) throw new Error("Question is too long");
    console.log("User Query:", queryText);
    const EmbeddedQuery = await queryEmbedding(queryText);
    const results = await qClient.search(COLLECTION_NAME, {
        vector: EmbeddedQuery,
        limit: 5,
        score_threshold: 0.35,
    });
    const sources = results.map((res) => ({
        fileName: res.payload?.fileName,
        fileId: res.payload?.fileId,
        chunkIndex: res.payload?.chunkIndex,
        score: res.score,
    }));
    const context = results.map((res, index) =>
        `[Source ${index + 1}: ${String(res.payload?.fileName || "unknown")}]
${String(res.payload?.text || "")}`,
    ).join("\n\n");
    const prompt = `Answer the question based only on this context. If the answer is not present, say you could not find it in the uploaded documents.

Context:
${context || "No relevant context was found."}

Question: ${queryText}

Answer:`;
    console.log("Generating answer...");    
    const answer = await TextGenerator(prompt);
    return { answer, sources };
};  

// query("What technologies do I have experience with").then((ans)=>{
//     console.log("Generated Answer:",ans);
// }).catch((err)=>console.error("Error in query:",err));
// for terminal input
// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout

// });
// console.log("Enter your query (type 'exit' to quit):\n");
//  rl.question("You > ", (userQuery) => {
//     if (userQuery.toLowerCase() === "exit") {
//         rl.close();
//         return;
//       }
//     main(userQuery).catch((err) => console.error("Error fetching collections:", err));
//     // rl.close();
// });







// main("What technologies do I have experience with").catch((err) => console.error("Error fetching collections:", err));
