import {readFileSync,existsSync} from 'node:fs';
const catalog=JSON.parse(readFileSync(new URL('../server/catalog.json',import.meta.url),'utf8'));
for(const product of catalog){
 const slug=product.image.split('/').pop().replace(/\.[^.]+$/,'');
 const path=new URL(`../client/public/products/photos/${slug}.jpg`,import.meta.url);
 if(!existsSync(path))throw Error(`Missing bundled photograph: ${slug}.jpg`);
 const bytes=readFileSync(path);
 if(bytes[0]!==255||bytes[1]!==216)throw Error(`Invalid JPEG: ${slug}.jpg`);
}
console.log(`All ${catalog.length} bundled product photographs are present.`);
