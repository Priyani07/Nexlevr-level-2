import mongoose from 'mongoose';
const { Schema, model }=mongoose;
const userSchema=new Schema({name:{type:String,required:true},email:{type:String,required:true,unique:true},passwordHash:{type:String,required:true,select:false},role:{type:String,enum:['customer','admin'],default:'customer'}},{timestamps:true});
const productSchema=new Schema({sku:{type:String,required:true,unique:true},name:{type:String,required:true},description:String,category:{type:String,required:true},price:{type:Number,required:true,min:1},stock:{type:Number,required:true,min:0},image:String,active:{type:Boolean,default:true}},{timestamps:true});
const orderSchema=new Schema({user:{type:Schema.Types.ObjectId,ref:'User',required:true},requestId:{type:String,required:true},items:[{product:Schema.Types.ObjectId,name:String,price:Number,quantity:Number,image:String}],address:{name:String,phone:String,line:String,city:String,pincode:String},subtotal:Number,shipping:Number,total:Number,payment:{type:String,default:'Cash on delivery'},status:{type:String,enum:['Placed','Processing','Shipped','Delivered'],default:'Placed'}},{timestamps:true});
orderSchema.index({user:1,requestId:1},{unique:true});
export const User=model('User',userSchema);
export const Product=model('Product',productSchema);
export const Order=model('Order',orderSchema);
