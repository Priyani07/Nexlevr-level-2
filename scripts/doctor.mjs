import mongoose from 'mongoose';
import { connectDatabase } from '../server/database.js';
import { logDatabaseError } from '../server/database-errors.js';
import { Product } from '../server/models.js';
try {
 await connectDatabase();
 const hello=await mongoose.connection.db.admin().command({hello:1});
 if(!hello.setName && hello.msg !== 'isdbgrid') throw Object.assign(new Error('Checkout needs Atlas or a MongoDB replica set.'),{code:'CONFIG_DATABASE'});
 console.log(`Database, unique indexes and transaction-capable topology: OK. Active products: ${await Product.countDocuments({active:true})}`);
 console.log('Ready for local use. Import this root .env into Vercel for deployment.');
} catch(error) { logDatabaseError(error,'doctor');process.exitCode=1; }
finally { await mongoose.disconnect(); }
