import './config.js';
import mongoose from 'mongoose';
import {validateConfig} from './config.js';
import {createApp} from './app.js';
try{
 validateConfig();await mongoose.connect(process.env.MONGO_URI,{serverSelectionTimeoutMS:90000});
 const server=createApp().listen(process.env.PORT||5000,()=>console.log(`Shoplane API: http://localhost:${process.env.PORT||5000}`));
 for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.close(async()=>{await mongoose.disconnect();process.exit(0);}));
}catch(err){console.error('Startup failed:',err.message);process.exit(1);}
