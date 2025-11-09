import { InferenceClient } from "@huggingface/inference";
import ollama from "ollama";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
/*
    Embeds text using Hugging Face Inference API
*/

const client = new InferenceClient(process.env.HUGGINGFACE_TOKEN || "");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getEmbedding = async (texts:string[]):Promise<number[][]>=>{
    const embeddings: number[][] = [];
    for(const text of texts){
        const response = await client.featureExtraction({
            model: "sentence-transformers/all-MiniLM-L6-v2",
            inputs:text,
        })
        // response can be either a nested array or a flat array; normalize to number[]
        const vector = Array.isArray(response[0]) ? (response[0] as number[]) : (response as unknown as number[]);
        embeddings.push(vector);
    }
    return embeddings;
 
}

export const queryEmbedding = async (text:string):Promise<number[]>=>{  
    const response = await client.featureExtraction({
        model: "sentence-transformers/all-MiniLM-L6-v2",
        inputs :text,
    })
    const vector = Array.isArray(response[0]) ? (response[0] as number[]) : (response as unknown as number[]);
    return vector;
}   
  
export const TextGenerator = async(prompt:string):Promise<string>=>{
    // const response = await ollama.chat({
    //     model:"mistral",
    //    messages:[
    //     {role:"system",content:"You are a helpful assistant that provides accurate and concise informatio based on the context provided Only."},
    //     {role:"user",content:prompt}
    // ]  ,

    // })
    //  console.log("Ollama Responded");
    // return response.message.content??"No response generated";
    const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [
    {role:"model",parts:[{ text:"You are a helpful assistant that provides accurate and concise informatio based on the context provided Only."}]},
      { role: "user", parts: [{ text: prompt }] },
    ],
})
console.log(response.text)
   return response.text ?? "No response generated";
    }