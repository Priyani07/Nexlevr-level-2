import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',fullyParallel:false,workers:1,timeout:45000,use:{baseURL:'http://127.0.0.1:5001',headless:true,screenshot:'only-on-failure',trace:'retain-on-failure'},webServer:{command:'node scripts/e2e-server.mjs',url:'http://127.0.0.1:5001/api/health',timeout:180000,reuseExistingServer:false}});
