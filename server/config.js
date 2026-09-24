import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
dotenv.config({path:fileURLToPath(new URL('./.env',import.meta.url)),quiet:true});
export function validateConfig(){
 if(!process.env.MONGO_URI) throw new Error('MONGO_URI is missing. Run npm run setup and edit server/.env.');
 if(!process.env.JWT_SECRET || process.env.JWT_SECRET.length<32 || process.env.JWT_SECRET.startsWith('replace-')) throw new Error('JWT_SECRET must be a unique random string of at least 32 characters.');
}
