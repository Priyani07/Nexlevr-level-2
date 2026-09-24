import {before,after,test} from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import mongoose from 'mongoose';
import {MongoMemoryReplSet} from 'mongodb-memory-server';
import request from 'supertest';
import {createApp} from '../app.js';
import {User,Product,Order} from '../models.js';
process.env.JWT_SECRET='test-only-secret-not-for-deployment-1234567890';
let db,app,customer,other,admin,p;
const header={'X-Requested-With':'Shoplane'};
const address={name:'Test Customer',phone:'9876543210',line:'12 Test Street',city:'Mandsaur',pincode:'458001'};
const product={sku:'TEST-1',name:'Test headphones',description:'Test product for integration tests',category:'Electronics',price:100000,stock:10,image:'/products/studio-headphones.svg'};
before(async()=>{
 db=await MongoMemoryReplSet.create({replSet:{count:1},binary:{version:'7.0.24'}});await mongoose.connect(db.getUri());await Promise.all([User.init(),Product.init(),Order.init()]);app=createApp();customer=request.agent(app);other=request.agent(app);admin=request.agent(app);
 for(const [agent,email]of [[customer,'customer@test.com'],[other,'other@test.com'],[admin,'admin@test.com']]){await agent.post('/api/auth/register').set(header).send({name:'Test User',email,password:'Testing123!'}).expect(201);}
 await User.updateOne({email:'admin@test.com'},{role:'admin'});p=await Product.create(product);
}, {timeout:180000});
after(async()=>{await mongoose.disconnect();if(db)await db.stop();});
test('registration strips role escalation; sessions use HttpOnly cookies',async()=>{
 const res=await request(app).post('/api/auth/register').set(header).send({name:'New User',email:'new@test.com',password:'Testing123!',role:'admin'}).expect(201);
 assert.equal(res.body.role,'customer');assert.match(res.headers['set-cookie'][0],/HttpOnly/);assert.equal(res.body.passwordHash,undefined);
 await request(app).post('/api/auth/register').set(header).send({name:'New User',email:'new@test.com',password:'Testing123!'}).expect(409);
});
test('bad credentials, missing session, missing request protection and invalid input rejected',async()=>{
 await request(app).post('/api/auth/login').set(header).send({email:'customer@test.com',password:'incorrect'}).expect(401);
 await request(app).get('/api/orders').expect(401);
 await request(app).post('/api/auth/login').send({}).expect(403);
 await request(app).post('/api/auth/register').set(header).send({email:'invalid',password:'123'}).expect(400);
 await request(app).get('/api/products/not-an-id').expect(400);
});
test('catalog searching escapes regular expressions and supports filters',async()=>{
 assert.equal((await request(app).get('/api/products?search=headphone').expect(200)).body.length,1);
 assert.equal((await request(app).get('/api/products?search=%5B').expect(200)).body.length,0);
 assert.equal((await request(app).get('/api/products?category=Lifestyle').expect(200)).body.length,0);
});
test('customer cannot write products or read admin orders',async()=>{
 await customer.post('/api/admin/products').set(header).send(product).expect(403);
 await customer.get('/api/admin/orders').expect(403);
});
test('checkout uses server price, decrements stock, is idempotent and isolates user orders',async()=>{
 const payload={requestId:randomUUID(),address,items:[{product:String(p._id),quantity:2}],total:1};
 const created=await customer.post('/api/orders').set(header).send(payload).expect(201);assert.equal(created.body.total,200000);assert.equal(created.body.shipping,0);
 const retry=await customer.post('/api/orders').set(header).send(payload).expect(200);assert.equal(created.body._id,retry.body._id);assert.equal((await Product.findById(p._id)).stock,8);
 assert.equal((await other.get('/api/orders').expect(200)).body.length,0);assert.equal((await customer.get('/api/orders').expect(200)).body.length,1);
});
test('failed multi-item order rolls back all stock changes',async()=>{
 const rare=await Product.create({...product,sku:'RARE',stock:0});
 await customer.post('/api/orders').set(header).send({requestId:randomUUID(),address,items:[{product:String(p._id),quantity:1},{product:String(rare._id),quantity:1}]}).expect(409);
 assert.equal((await Product.findById(p._id)).stock,8);assert.equal(await Order.countDocuments(),1);
});
test('concurrent checkout cannot oversell the last item',async()=>{
 const last=await Product.create({...product,sku:'LAST',stock:1});const payload={address,items:[{product:String(last._id),quantity:1}]};
 const responses=await Promise.all([customer.post('/api/orders').set(header).send({...payload,requestId:randomUUID()}),other.post('/api/orders').set(header).send({...payload,requestId:randomUUID()})]);
 assert.deepEqual(responses.map(r=>r.status).sort(),[201,409]);assert.equal((await Product.findById(last._id)).stock,0);
});
test('checkout rejects duplicate products, bad quantities and invalid address',async()=>{
 const item={product:String(p._id),quantity:1};
 await customer.post('/api/orders').set(header).send({requestId:randomUUID(),address,items:[item,item]}).expect(400);
 await customer.post('/api/orders').set(header).send({requestId:randomUUID(),address,items:[{...item,quantity:-1}]}).expect(400);
 await customer.post('/api/orders').set(header).send({requestId:randomUUID(),address:{...address,pincode:'12'},items:[item]}).expect(400);
});
test('admin can create, update, archive and progress orders only in sequence',async()=>{
 const created=await admin.post('/api/admin/products').set(header).send({...product,sku:'ADMIN'}).expect(201);
 await admin.put('/api/admin/products/'+created.body._id).set(header).send({...product,sku:'ADMIN',price:99900}).expect(200);
 await admin.delete('/api/admin/products/'+created.body._id).set(header).expect(200);
 await request(app).get('/api/products/'+created.body._id).expect(404);
 const o=(await admin.get('/api/admin/orders').expect(200)).body[0];
 await admin.patch('/api/admin/orders/'+o._id).set(header).send({status:'Delivered'}).expect(409);
 for(const status of ['Processing','Shipped','Delivered'])await admin.patch('/api/admin/orders/'+o._id).set(header).send({status}).expect(200);
});
test('logout removes access',async()=>{await other.post('/api/auth/logout').set(header).expect(200);await other.get('/api/auth/me').expect(401);});
