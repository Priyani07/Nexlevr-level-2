import mongoose from 'mongoose';
import { connectDatabase, ensureCatalog } from './database.js';
import { logDatabaseError } from './database-errors.js';
try { await connectDatabase(); console.log(`${await ensureCatalog()} catalog products ensured; existing edits, stock and orders preserved.`); }
catch(error) { logDatabaseError(error,'seed');process.exitCode=1; }
finally { await mongoose.disconnect(); }
