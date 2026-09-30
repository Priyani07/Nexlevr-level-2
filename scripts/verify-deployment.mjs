import {readFileSync} from 'node:fs';
const url=readFileSync('deployment-url.txt','utf8').trim().split(/\r?\n/).at(-1);
const endpoint=new URL('/api/health',url);
if(endpoint.protocol!=='https:')throw Error('Expected HTTPS deployment URL.');
const headers={'Cache-Control':'no-cache'};
if(process.env.VERCEL_AUTOMATION_BYPASS_SECRET)headers['x-vercel-protection-bypass']=process.env.VERCEL_AUTOMATION_BYPASS_SECRET;
for(let attempt=0;attempt<12;attempt++){
 try{
  const response=await fetch(endpoint,{headers,signal:AbortSignal.timeout(20000)});
  const data=await response.json();
  if(response.ok&&data.status==='ok'&&data.commit===process.env.GITHUB_SHA){console.log('Verified live API and tested commit.');process.exit(0);}
 }catch{}
 await new Promise(resolve=>setTimeout(resolve,5000));
}
throw Error('Deployment API did not become healthy at the tested commit. Check Vercel env, Atlas and deployment protection.');
