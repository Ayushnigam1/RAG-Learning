import {encode, decode} from 'gpt-3-encoder';

/** 
 * Splits the given text into chunks of specified maximum token size.
 * @param text - The text to be chunked.
 * @param maxTokens - The maximum number of tokens per chunk.
 * @returns An array of text chunks    

 */ 

export const chunkText = (text: string, maxTokens: number, overlap = 75): string[] => {
    if (maxTokens <= 0) throw new Error("maxTokens must be greater than zero");
    if (overlap < 0 || overlap >= maxTokens) {
        throw new Error("overlap must be between zero and maxTokens - 1");
    }

    const tokens =encode(text);
    console.log("Total Tokens:",tokens.length);
    const chunks:string[]=[];
    const step = maxTokens - overlap;
    for(let i=0;i<tokens.length;i+=step){
        const chunkTokens=tokens.slice(i,i+maxTokens);
        const chunk= decode(chunkTokens)
        chunks.push(chunk);
        if (i + maxTokens >= tokens.length) break;
    }
    return chunks
}
