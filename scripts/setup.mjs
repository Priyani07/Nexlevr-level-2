import { existsSync, copyFileSync, readFileSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
if (!existsSync('server/.env')) {
 copyFileSync('server/.env.example', 'server/.env');
 writeFileSync('server/.env', readFileSync('server/.env','utf8').replace('replace-with-a-random-secret-at-least-32-characters',randomBytes(48).toString('hex')));
 console.log('Created server/.env with a random JWT secret. Set MONGO_URI before seeding.');
} else console.log('server/.env already exists; preserved.');
