import {encode, decode} from 'gpt-3-encoder';

/** 
 * Splits the given text into chunks of specified maximum token size.
 * @param text - The text to be chunked.
 * @param maxTokens - The maximum number of tokens per chunk.
 * @returns An array of text chunks.    

 */ 

export const chunkText =(text:string,maxTokens:number):string[]=>{
    const tokens =encode(text);
    console.log("Total Tokens:",tokens.length);
    const chunks:string[]=[];
    for(let i=0;i<tokens.length;i+=maxTokens){
        const chunkTokens=tokens.slice(i,i+maxTokens);
        const chunk= decode(chunkTokens)
        chunks.push(chunk);
    }
    return chunks
}
