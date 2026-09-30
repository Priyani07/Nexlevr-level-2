import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
// Platform variables always win. Root .env is the single supported setup file.
if (!process.env.VERCEL) {
  dotenv.config({path:fileURLToPath(new URL('../.env',import.meta.url)),quiet:true});
  dotenv.config({path:fileURLToPath(new URL('./.env',import.meta.url)),quiet:true});
}
export function validateConfig(){
 const uri = process.env.MONGO_URI?.trim();
 if(!uri || !/^mongodb(?:\+srv)?:\/\//.test(uri) || /USERNAME|PASSWORD|YOUR-CLUSTER|<[^>]+>/.test(uri)) {
   throw Object.assign(new Error('Set a complete Atlas MONGO_URI in root .env (locally) or Vercel Environment Variables.'), {code:'CONFIG_URI'});
 }
 if(!process.env.JWT_SECRET || process.env.JWT_SECRET.length<32 || process.env.JWT_SECRET.startsWith('replace-')) {
   throw Object.assign(new Error('JWT_SECRET must contain at least 32 characters. npm run setup generates it.'), {code:'CONFIG_SECRET'});
 }
 if(process.env.MONGO_DB_NAME && !/^[a-zA-Z0-9_-]+$/.test(process.env.MONGO_DB_NAME)) {
   throw Object.assign(new Error('MONGO_DB_NAME may contain letters, numbers, underscores and hyphens.'),{code:'CONFIG_DATABASE'});
 }
}
