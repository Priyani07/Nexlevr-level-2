import {test,after} from 'node:test';
import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import {User,Product,Order} from '../models.js';
import {connectDatabase} from '../database.js';
import {databaseIssue} from '../database-errors.js';
process.env.MONGO_URI='mongodb://127.0.0.1:27017/isolated-test';
process.env.JWT_SECRET='unit-test-only-secret-with-at-least-32-characters';
process.env.AUTO_SEED='true';
let connects=0, inserts=0, failOnce=true;
const originalConnect=mongoose.connect;
const originals=[User.createIndexes,Product.createIndexes,Order.createIndexes,Product.updateOne,Product.exists];
const originalState=mongoose.connection.readyState;
mongoose.connect=async()=>{connects++;if(failOnce){failOnce=false;throw Object.assign(new Error('test failure'),{code:18});}mongoose.connection.readyState=1;};
for(const model of [User,Product,Order]) model.createIndexes=async()=>{};
Product.updateOne=async(filter,update,options)=>{assert.ok(filter.sku);assert.ok(update.$setOnInsert);assert.equal(update.$set,undefined);assert.equal(options.upsert,true);inserts++;};
after(()=>{mongoose.connect=originalConnect;[User.createIndexes,Product.createIndexes,Order.createIndexes,Product.updateOne,Product.exists]=originals;mongoose.connection.readyState=originalState;});
test('initialization retries failures, shares concurrent requests and seeds only on initialization',async()=>{
 await assert.rejects(connectDatabase(),{code:18});
 await Promise.all([connectDatabase(),connectDatabase(),connectDatabase()]);
 assert.equal(connects,2);assert.equal(inserts,36);
 await connectDatabase();assert.equal(inserts,36);
});
test('diagnostics distinguish auth, permissions, duplicate data and network without leaking credentials',()=>{
 for(const [input,expected] of [[{code:18},'DB_AUTH'],[{code:13},'DB_PERMISSION'],[{code:11000},'DB_DUPLICATE'],[{name:'MongoServerSelectionError'},'DB_NETWORK']]) {
  assert.equal(databaseIssue({...input,message:'mongodb://secret:password@example.com'}).code,expected);
  assert.ok(!JSON.stringify(databaseIssue(input)).includes('password@example'));
 }
});
