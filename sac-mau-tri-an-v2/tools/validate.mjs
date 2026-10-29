import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
const root=new URL('../dist/',import.meta.url),data=JSON.parse(fs.readFileSync(new URL('data/artworks.json',root)));
let files=0;const ids=new Set();
for(const [room,n] of [['paintings',20],['cards',10]]){
 assert.equal(data[room].length,n);const places=new Set();
 for(const a of data[room]){assert.ok(a.id&&a.title&&a.author&&a.position);assert.ok(!ids.has(a.id));ids.add(a.id);assert.ok(['tay','dong','bac','nam'].includes(a.position.wall));const max=room==='paintings'?(['tay','dong'].includes(a.position.wall)?6:4):(['tay','dong'].includes(a.position.wall)?4:2);assert.ok(Number.isInteger(a.position.slot)&&a.position.slot>=1&&a.position.slot<=max);const slot=JSON.stringify(a.position);assert.ok(!places.has(slot));places.add(slot);
 for(const key of room==='paintings'?['image','thumbnail']:['frontImage','insideImage','thumbnail']){assert.ok(a[key]);assert.ok(!a[key].includes('..'));assert.ok(fs.statSync(new URL(a[key],root)).size>0);files++;}}
}
for(const name of ['index.html','style.css','app.js','museum.js'])assert.ok(fs.statSync(new URL(name,root)).size>0);
assert.ok(!/veo|<video/i.test(fs.readFileSync(new URL('index.html',root),'utf8')));
console.log(`PASS: 20 tranh, 10 thiệp, 30 ID và vị trí duy nhất; ${files} đường dẫn ảnh hợp lệ.`);
