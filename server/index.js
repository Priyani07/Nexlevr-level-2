import mongoose from 'mongoose';
import { connectDatabase } from './database.js';
import { logDatabaseError } from './database-errors.js';
import { createApp } from './app.js';
try {
 await connectDatabase();
 const port=Number(process.env.PORT||5000);
 const server=createApp().listen(port,()=>console.log(`Shoplane API: http://localhost:${port}`));
 server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`Port ${port} is already in use. Stop the previous server with Ctrl+C.`:error.message);process.exit(1);});
 for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(async()=>{await mongoose.disconnect();process.exit(0);}));
} catch(error) { logDatabaseError(error); await mongoose.disconnect(); process.exit(1); }
