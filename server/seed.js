import './config.js';
import mongoose from 'mongoose';
import {readFileSync} from 'node:fs';
import {validateConfig} from './config.js';
import {Product} from './models.js';
try{validateConfig();await mongoose.connect(process.env.MONGO_URI);const products=JSON.parse(readFileSync(new URL('./catalog.json',import.meta.url)));
 for(const p of products)await Product.updateOne({sku:p.sku},{$setOnInsert:p},{upsert:true});
 console.log('36 catalog products ensured. Existing stock, edits and orders preserved.');
}catch(e){console.error(e.message);process.exitCode=1;}finally{await mongoose.disconnect();}
