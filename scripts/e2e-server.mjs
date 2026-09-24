// Isolated ephemeral database: never connects to the user's MongoDB.
import {MongoMemoryReplSet} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {readFileSync} from 'node:fs';
import {createApp} from '../server/app.js';
import {Product,User,Order} from '../server/models.js';
process.env.JWT_SECRET='isolated-e2e-secret-at-least-32-characters';
process.env.NODE_ENV='test';
const db=await MongoMemoryReplSet.create({replSet:{count:1},binary:{version:'7.0.24'}});
await mongoose.connect(db.getUri());await Promise.all([Product.init(),User.init(),Order.init()]);
await Product.insertMany(JSON.parse(readFileSync(new URL('../server/catalog.json',import.meta.url))));
const server=createApp().listen(5001,'127.0.0.1',()=>console.log('E2E server on 5001'));
for(const s of ['SIGTERM','SIGINT'])process.on(s,()=>server.close(async()=>{await mongoose.disconnect();await db.stop();process.exit(0);}));
