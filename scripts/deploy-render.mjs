// Render deploy hooks accept ref=<commit SHA>. Secrets are never printed.
const hook=process.env.RENDER_DEPLOY_HOOK_URL;
const appUrl=process.env.APP_URL;
const sha=process.env.GITHUB_SHA;
if(!hook||!appUrl||!sha)throw Error('Set RENDER_DEPLOY_HOOK_URL, APP_URL and GITHUB_SHA.');
const target=new URL(hook);if(target.protocol!=='https:'||target.hostname!=='api.render.com')throw Error('Expected an HTTPS Render deploy hook.');
const health=new URL('/api/health',appUrl);if(health.protocol!=='https:')throw Error('APP_URL must use HTTPS.');
target.searchParams.set('ref',sha);
let response;
try{response=await fetch(target,{method:'POST',signal:AbortSignal.timeout(30000)});}catch{throw Error('Could not reach the deploy hook. Check connectivity and secret configuration.');}
if(!response.ok)throw Error(`Deployment trigger returned HTTP ${response.status}. Check the Render service and secret.`);
console.log('Deployment requested. Waiting for the verified commit to serve healthy traffic.');
const deadline=Date.now()+15*60*1000;
while(Date.now()<deadline){
 try{const r=await fetch(health,{signal:AbortSignal.timeout(15000),headers:{'Cache-Control':'no-cache'}});const data=await r.json();if(r.ok&&data.status==='ok'&&data.commit===sha){console.log('Deployment verified: healthy database and expected commit.');process.exit(0);}}catch{}
 await new Promise(resolve=>setTimeout(resolve,15000));
}
throw Error('Deployment did not become healthy at the expected commit within 15 minutes. Inspect Render deployment logs.');
