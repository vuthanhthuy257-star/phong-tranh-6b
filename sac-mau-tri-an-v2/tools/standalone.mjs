// Tạo bản xem thử duy nhất một tệp, mở trực tiếp không cần mạng hoặc máy chủ.
import fs from 'node:fs';
import path from 'node:path';
const root=new URL('../dist/',import.meta.url);
const read=name=>fs.readFileSync(new URL(name,root),'utf8');
const data=JSON.parse(read('data/artworks.json'));
const mime={'.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp'};
const embed=src=>`data:${mime[path.extname(src).toLowerCase()]||'application/octet-stream'};base64,${fs.readFileSync(new URL(src,root)).toString('base64')}`;
for(const item of [...data.paintings,...data.cards])for(const key of ['image','frontImage','insideImage','thumbnail'])if(item[key])item[key]=embed(item[key]);
const json=JSON.stringify(data).replace(/</g,'\\u003c');
const museum=read('museum.js').replace(/export /g,'');
let app=read('app.js').replace("import {Museum} from './museum.js';",'');
app=app.replace("const res=await fetch('data/artworks.json');if(!res.ok)throw new Error('Không tải được danh mục');state.data=await res.json();",()=>`state.data=${json};`);
// Dữ liệu và đường dẫn đã được kiểm tra trước khi nhúng thành data URI.
app=app.replace('validateData(state.data);','');
let html=read('index.html').replace('<link rel="stylesheet" href="style.css">',()=>`<style>${read('style.css')}</style>`);
html=html.replace('href="assets/favicon.svg"',`href="${embed('assets/favicon.svg')}"`);
html=html.replace('<script type="module" src="app.js"></script>',()=>`<script>\n${museum}\n${app}\n</script>`);
fs.writeFileSync(new URL('xem-thu.html',root),html);
console.log('Đã tạo dist/xem-thu.html – một tệp độc lập, mở trực tiếp bằng trình duyệt.');
