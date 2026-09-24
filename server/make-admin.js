import './config.js';
import mongoose from 'mongoose';
import {validateConfig} from './config.js';
import {User} from './models.js';
try{validateConfig();const email=process.argv[2]?.toLowerCase();if(!email)throw Error('Usage: npm run admin -- your@email.com (register this account first)');await mongoose.connect(process.env.MONGO_URI);const u=await User.findOneAndUpdate({email},{role:'admin'});if(!u)throw Error('Account not found. Register in the app first.');console.log('Admin access granted to '+email);}catch(e){console.error(e.message);process.exitCode=1;}finally{await mongoose.disconnect();}
