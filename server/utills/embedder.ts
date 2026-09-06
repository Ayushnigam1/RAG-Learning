import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();
/*
    Embeds text using Hugging Face Inference API
*/

const client = new InferenceClient(process.env.HUGGINGFACE_TOKEN || "");
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
export const EMBEDDING_MODEL = "BAAI/bge-small-en-v1.5";
const QUERY_INSTRUCTION = "Represent this sentence for searching relevant passages: ";

const embedOne = async (text: string): Promise<number[]> => {
    const response = await client.featureExtraction({
        model: EMBEDDING_MODEL,
        inputs: text,
    });
    return Array.isArray(response[0])
        ? (response[0] as number[])
        : (response as unknown as number[]);
};

export const getEmbedding = async (texts:string[]):Promise<number[][]>=>{
    const concurrency = Math.max(1, Number(process.env.EMBEDDING_CONCURRENCY || 4));
    const embeddings: number[][] = new Array(texts.length);
    let nextIndex = 0;

    const worker = async () => {
        while (true) {
            const index = nextIndex++;
            if (index >= texts.length) return;
            embeddings[index] = await embedOne(texts[index]);
        }
    };

    await Promise.all(
        Array.from({ length: Math.min(concurrency, texts.length) }, worker),
    );
    return embeddings;
}

export const queryEmbedding = async (text:string):Promise<number[]>=>{
    return embedOne(`${QUERY_INSTRUCTION}${text}`);
}

export const TextGenerator = async(prompt:string):Promise<string>=>{
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
            systemInstruction:
                "You answer only from the supplied context. If the answer is not in the context, say you could not find it in the uploaded documents. Do not invent facts.",
        },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    return response.text ?? "No response generated";
}
