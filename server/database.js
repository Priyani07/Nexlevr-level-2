import mongoose from 'mongoose';
import { readFileSync } from 'node:fs';
import { validateConfig } from './config.js';
import { User, Product, Order } from './models.js';

let initializing;
let initialized = false;
mongoose.connection.on('disconnected', () => { initialized = false; });

export async function ensureCatalog() {
 const products = JSON.parse(readFileSync(new URL('./catalog.json', import.meta.url), 'utf8'));
 // Insertion only: preserve admin edits, stock, archived products and orders.
 for (const product of products) {
  try { await Product.updateOne({sku:product.sku}, {$setOnInsert:product}, {upsert:true}); }
  catch (error) {
   // Another cold instance may have inserted this exact SKU concurrently.
   if (error.code !== 11000 || !await Product.exists({sku:product.sku})) throw error;
  }
 }
 return products.length;
}

export function connectDatabase() {
 if (initializing) return initializing;
 if (initialized && mongoose.connection.readyState === 1) return Promise.resolve();
 initializing = (async () => {
  validateConfig();
  if (mongoose.connection.readyState !== 1) {
   await mongoose.connect(process.env.MONGO_URI.trim(), {
    ...(process.env.MONGO_DB_NAME ? {dbName:process.env.MONGO_DB_NAME} : {}),
    serverSelectionTimeoutMS:10000, connectTimeoutMS:10000,
    maxPoolSize:5, minPoolSize:0, autoIndex:false
   });
  }
  // Explicit calls can retry after a failure, unlike a rejected Model.init cache.
  await Promise.all([User.createIndexes(), Product.createIndexes(), Order.createIndexes()]);
  if (process.env.AUTO_SEED !== 'false') await ensureCatalog();
  initialized = true;
 })().finally(() => { initializing = undefined; });
 return initializing;
}
