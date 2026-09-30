import { createApp } from '../server/app.js';
import { connectDatabase } from '../server/database.js';
import { logDatabaseError } from '../server/database-errors.js';

const app = createApp({serveClient:false});
export default async function handler(req,res) {
 res.setHeader('Cache-Control','no-store');
 try { await connectDatabase(); }
 catch(error) {
  const issue = logDatabaseError(error, 'vercel');
  res.statusCode=503;
  res.setHeader('Content-Type','application/json');
  res.end(JSON.stringify({message:`Store temporarily unavailable (${issue.code}). Please try again later.`,code:issue.code}));
  return;
 }
 return app(req,res);
}
