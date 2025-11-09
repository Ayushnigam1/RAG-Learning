import { QdrantClient } from "@qdrant/qdrant-js";
import dotenv from "dotenv";

dotenv.config();

// const client = new QdrantClient({
//     url: 'https://c0113190-8e6f-4922-af07-f2e09e24f319.eu-central-1-0.aws.cloud.qdrant.io:6333',
//     apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3MiOiJtIn0.-k33CHuQUWyrKW-hnf3QxVVo21Vx8ChWY5-qvJ3fIWM',
// });

const QDRANT_URL = process.env.QDRANT_HOST || "";
const QDRANT_API_KEY = process.env.QDRANT_API_KEY || "";
// console.log(QDRANT_URL,QDRANT_API_KEY);
export const qClient =new QdrantClient({
    url: QDRANT_URL,
    apiKey: QDRANT_API_KEY,
    checkCompatibility: false,
});