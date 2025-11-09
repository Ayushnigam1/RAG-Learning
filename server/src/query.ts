import { qClient } from "./qdrantClient";
import { getEmbedding, queryEmbedding, TextGenerator } from "../utills/embedder";
import readline from "readline";

export const query = async (query:string) => {
    console.log("User Query:", query);
    const collections = await qClient.getCollections();
    console.log("Existing Collections in Qdrant:", collections.collections[0].name);
    const EmbeddedQuery = await queryEmbedding(query);  
    const results = await qClient.search("documents", {
        vector: EmbeddedQuery,
        limit: 3,
    });
    // console.log("Search Results:", results);
    const context = results.map(res=>res?.payload?.text).join("\n");
    // console.log("Context from Qdrant:",context);
    const prompt = `Answer the question based on this context below:\n\nContext: ${context}\n\nQuestion: ${query}\n\nAnswer:`;
    console.log("Generating answer...");    
    const answer = await TextGenerator(prompt);
    return answer  


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