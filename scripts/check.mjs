import {readdirSync} from 'node:fs';
import {spawnSync} from 'node:child_process';
function scan(dir){return readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?e.name==='node_modules'?[]:scan(dir+'/'+e.name):/\.(js|mjs)$/.test(e.name)?[dir+'/'+e.name]:[]);}
for(const file of [...scan('server'),...scan('scripts')]){const r=spawnSync(process.execPath,['--check',file],{stdio:'inherit'});if(r.status)process.exit(r.status);}
console.log('Server and script syntax checks passed.');
