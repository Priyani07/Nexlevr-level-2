import express from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import {rateLimit} from 'express-rate-limit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import {z} from 'zod';
import {fileURLToPath} from 'node:url';
import {existsSync} from 'node:fs';
import {User,Product,Order} from './models.js';
const id=z.string().regex(/^[a-f0-9]{24}$/i,'Invalid ID');
const email=z.email().max(254).transform(v=>v.toLowerCase());
const password=z.string().min(8).max(72);
const productInput=z.object({sku:z.string().trim().min(2).max(40),name:z.string().trim().min(2).max(100),description:z.string().trim().min(10).max(1500),category:z.enum(['Electronics','Home & Living','Accessories','Lifestyle']),price:z.number().int().min(100).max(100000000),stock:z.number().int().min(0).max(100000),image:z.string().regex(/^\/products\/[a-z0-9-]+\.(?:svg|jpg|jpeg|png|webp)$/i),active:z.boolean().optional()});
const fail=(status,message)=>Object.assign(new Error(message),{status});
const safeUser=u=>({id:u._id,name:u.name,email:u.email,role:u.role});
const cookieOptions=()=>({httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge:7*24*60*60*1000});
const signIn=(res,user)=>res.cookie('shoplane_session',jwt.sign({sub:String(user._id)},process.env.JWT_SECRET,{expiresIn:'7d',algorithm:'HS256'}),cookieOptions());
async function auth(req,res,next){
 try { const token=req.cookies.shoplane_session; if(!token) throw Error(); const data=jwt.verify(token,process.env.JWT_SECRET,{algorithms:['HS256']}); const user=await User.findById(data.sub); if(!user) throw Error(); req.user=user; next(); }
 catch {next(fail(401,'Please sign in to continue.'));}
}
function admin(req,res,next){return req.user.role==='admin'?next():next(fail(403,'Administrator access required.'));}
export function createApp(){
 const app=express();
 app.disable('x-powered-by');
 if(process.env.TRUST_PROXY==='1') app.set('trust proxy',1);
 app.use(helmet({contentSecurityPolicy:{directives:{imgSrc:["'self'",'data:','https://images.unsplash.com'],scriptSrc:["'self'"],upgradeInsecureRequests:process.env.NODE_ENV==='production'?[]:null}}}));
 app.use(express.json({limit:'30kb'}),cookieParser());
 app.get('/api/health',(_,res)=>res.status(mongoose.connection.readyState===1?200:503).json({status:mongoose.connection.readyState===1?'ok':'unavailable',commit:process.env.RENDER_GIT_COMMIT||'local'}));
 app.use('/api',rateLimit({windowMs:60000,limit:300,standardHeaders:'draft-8',legacyHeaders:false}));
 // Cross-site forms cannot send this header; no cross-origin CORS is enabled.
 app.use('/api',(req,res,next)=>{
  if(!['GET','HEAD','OPTIONS'].includes(req.method) && req.get('X-Requested-With')!=='Shoplane') return next(fail(403,'Missing request protection header.'));
  next();
 });
 const authLimit=rateLimit({windowMs:15*60*1000,limit:30,standardHeaders:'draft-8',legacyHeaders:false});
 app.post('/api/auth/register',authLimit,async(req,res)=>{
  const data=z.object({name:z.string().trim().min(2).max(70),email,password}).parse(req.body);
  const user=await User.create({...data,passwordHash:await bcrypt.hash(data.password,12)});
  signIn(res,user); res.status(201).json(safeUser(user));
 });
 app.post('/api/auth/login',authLimit,async(req,res)=>{
  const data=z.object({email,password:z.string().max(72)}).parse(req.body);
  const user=await User.findOne({email:data.email}).select('+passwordHash');
  if(!user || !await bcrypt.compare(data.password,user.passwordHash)) throw fail(401,'Email or password is incorrect.');
  signIn(res,user); res.json(safeUser(user));
 });
 app.post('/api/auth/logout',(_,res)=>{res.clearCookie('shoplane_session',{...cookieOptions(),maxAge:undefined});res.json({message:'Signed out'});});
 app.get('/api/auth/me',auth,(req,res)=>res.json(safeUser(req.user)));
 app.get('/api/products',async(req,res)=>{
  const q=z.object({search:z.string().max(100).optional(),category:z.enum(['Electronics','Home & Living','Accessories','Lifestyle']).optional(),sort:z.enum(['featured','price-asc','price-desc','name']).default('featured')}).parse(req.query);
  const filter={active:true};
  if(q.search) filter.name={$regex:q.search.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),$options:'i'};
  if(q.category)filter.category=q.category;
  const sort={'featured':{createdAt:-1,sku:1},'price-asc':{price:1},'price-desc':{price:-1},'name':{name:1}}[q.sort];
  res.json(await Product.find(filter).sort(sort).limit(200));
 });
 app.get('/api/products/:id',async(req,res)=>{const p=await Product.findOne({_id:id.parse(req.params.id),active:true});if(!p)throw fail(404,'Product not found.');res.json(p);});
 app.get('/api/orders',auth,async(req,res)=>res.json(await Order.find({user:req.user._id}).sort({createdAt:-1}).limit(100)));
 app.post('/api/orders',auth,async(req,res)=>{
  const data=z.object({requestId:z.uuid(),items:z.array(z.object({product:id,quantity:z.number().int().min(1).max(10)})).min(1).max(50),address:z.object({name:z.string().trim().min(2).max(70),phone:z.string().regex(/^[6-9]\d{9}$/,'Enter a valid 10-digit Indian mobile number'),line:z.string().trim().min(5).max(200),city:z.string().trim().min(2).max(70),pincode:z.string().regex(/^[1-9]\d{5}$/,'Enter a valid 6-digit PIN code')})}).parse(req.body);
  if(new Set(data.items.map(i=>i.product)).size!==data.items.length)throw fail(400,'Duplicate cart products.');
  const existing=await Order.findOne({user:req.user._id,requestId:data.requestId});if(existing)return res.json(existing);
  let order;
  try{await mongoose.connection.transaction(async session=>{
   const items=[];
   for(const item of data.items){
    const p=await Product.findOneAndUpdate({_id:item.product,active:true,stock:{$gte:item.quantity}},{$inc:{stock:-item.quantity}},{session,new:true});
    if(!p)throw fail(409,'A product is unavailable or has insufficient stock. Refresh your cart.');
    items.push({product:p._id,name:p.name,price:p.price,quantity:item.quantity,image:p.image});
   }
   const subtotal=items.reduce((sum,i)=>sum+i.price*i.quantity,0);const shipping=subtotal>=199900?0:9900;
   [order]=await Order.create([{user:req.user._id,requestId:data.requestId,items,address:data.address,subtotal,shipping,total:subtotal+shipping}],{session});
  });}catch(err){if(err.code===11000){const prior=await Order.findOne({user:req.user._id,requestId:data.requestId});if(prior)return res.json(prior);}throw err;}
  res.status(201).json(order);
 });
 app.use('/api/admin',auth,admin);
 app.get('/api/admin/products',async(_,res)=>res.json(await Product.find().sort({createdAt:-1}).limit(500)));
 app.post('/api/admin/products',async(req,res)=>res.status(201).json(await Product.create(productInput.parse(req.body))));
 app.put('/api/admin/products/:id',async(req,res)=>{const p=await Product.findByIdAndUpdate(id.parse(req.params.id),{$set:productInput.parse(req.body)},{new:true,runValidators:true});if(!p)throw fail(404,'Product not found.');res.json(p);});
 app.delete('/api/admin/products/:id',async(req,res)=>{const p=await Product.findByIdAndUpdate(id.parse(req.params.id),{active:false},{new:true});if(!p)throw fail(404,'Product not found.');res.json(p);});
 app.get('/api/admin/orders',async(_,res)=>res.json(await Order.find().populate('user','name email').sort({createdAt:-1}).limit(200)));
 app.patch('/api/admin/orders/:id',async(req,res)=>{
  const {status}=z.object({status:z.enum(['Processing','Shipped','Delivered'])}).parse(req.body);
  const previous={Processing:'Placed',Shipped:'Processing',Delivered:'Shipped'}[status];
  const order=await Order.findOneAndUpdate({_id:id.parse(req.params.id),status:previous},{status},{new:true});
  if(!order)throw fail(409,'Order status changed or transition is invalid. Refresh orders.');res.json(order);
 });
 app.use('/api',(_,res)=>res.status(404).json({message:'API route not found.'}));
 const dist=fileURLToPath(new URL('../client/dist/',import.meta.url));
 if(existsSync(dist)){app.use(express.static(dist));app.get('/{*path}',(_,res)=>res.sendFile(dist+'index.html'));}
 app.use((err,req,res,next)=>{
  if(err instanceof z.ZodError)return res.status(400).json({message:err.issues.map(i=>i.message).join('; ')});
  if(err.code===11000)return res.status(409).json({message:'Email or SKU already exists.'});
  const status=err.status||500;
  if(status>=500)console.error(err.message);
  res.status(status).json({message:status>=500?'Server error. Check the server log and MongoDB replica-set connection.':err.message});
 });
 return app;
}
