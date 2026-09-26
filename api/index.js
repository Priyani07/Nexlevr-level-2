import mongoose from 'mongoose';
import { validateConfig } from '../server/config.js';
import { createApp } from '../server/app.js';
import { User, Product, Order } from '../server/models.js';

const app = createApp({ serveClient: false });
let ready;

// Share one connection pool and initialization promise across warm requests.
async function connectDatabase() {
  validateConfig();
  if (!ready || mongoose.connection.readyState === 0) {
    ready = (async () => {
      await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
        maxPoolSize: 5,
        minPoolSize: 0
      });
      // Wait for unique indexes before accepting registrations or orders.
      await Promise.all([User.init(), Product.init(), Order.init()]);
    })().catch(error => {
      ready = undefined;
      throw error;
    });
  }
  await ready;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    await connectDatabase();
  } catch (error) {
    // Never expose connection strings or credentials to the browser.
    console.error('Shoplane database initialization failed:', error.name);
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Database unavailable. Check Vercel environment variables and Atlas network access.' }));
    return;
  }
  return app(req, res);
}
