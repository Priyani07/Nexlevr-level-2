import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
const target = new URL('../.env', import.meta.url);
let content=readFileSync(existsSync(target)?target:new URL('../.env.example',import.meta.url),'utf8');
const placeholder='replace-with-a-random-secret-at-least-32-characters';
if(content.includes(placeholder)) {
 content=content.replace(placeholder,randomBytes(48).toString('hex'));
 writeFileSync(target,content,{mode:0o600});
 console.log('Root .env is ready with a unique JWT secret. Edit MONGO_URI, then run npm run doctor.');
} else console.log('Existing .env preserved. Edit MONGO_URI if needed.');
