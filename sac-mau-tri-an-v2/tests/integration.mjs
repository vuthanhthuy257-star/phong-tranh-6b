// Kiểm thử JavaScript, hình học chọn đối tượng và sự kiện bằng DOM/WebGL mô phỏng.
// Không thay thế kiểm thử trình duyệt hoặc thiết bị cảm ứng thật.
import fs from 'node:fs';
import assert from 'node:assert/strict';
import vm from 'node:vm';
const ROOT=new URL('../dist/',import.meta.url);let data=JSON.parse(fs.readFileSync(new URL('data/artworks.json',ROOT)));
let drawCount=0,glError=0;const drawCalls=[];
const gl=new Proxy({getShaderParameter:()=>true,getProgramParameter:()=>true,createTexture:()=>({}),createBuffer:()=>({}),createProgram:()=>({}),createShader:()=>({}),getUniformLocation:()=>({}),getAttribLocation:()=>0,bufferData:(_,a)=>{gl.vertices=a;},drawArrays:()=>drawCount++,getError:()=>glError},{get:(o,k)=>k in o?o[k]:k.toUpperCase()===k?1:()=>{}});
const ctx=new Proxy({createRadialGradient:()=>({addColorStop(){}}),measureText:s=>({width:s.length*10})},{get:(o,k)=>k in o?o[k]:(...args)=>{drawCalls.push([k,args]);},set:(o,k,v)=>(o[k]=v,true)});
class El{
 constructor(tag='div'){this.tagName=tag;this.listeners={};this.attrs={};this.dataset={};this.style={};this.children=[];this.open=false;this.hidden=false;this.firstChild={textContent:''};this.rect={left:0,top:0,width:1440,height:900,right:1440,bottom:900};this.classList={add:()=>{},remove:()=>{}};}
 addEventListener(k,fn){(this.listeners[k]??=[]).push(fn);}
 emit(k,e={}){for(const fn of this.listeners[k]||[])fn({target:this,button:0,preventDefault(){},...e});}
 setAttribute(k,v){this.attrs[k]=String(v);}
 getAttribute(k){return this.attrs[k];}
 removeAttribute(k){delete this.attrs[k];if(k==='src')this._src='';}
 append(...els){this.children.push(...els);}
 replaceChildren(...els){this.children=els;}
 getBoundingClientRect(){return this.rect;}
 setPointerCapture(){}
 getContext(name){return name==='webgl'?(process.env.TEST_MODE==='fallback'?null:gl):ctx;}
 showModal(){this.open=true;}
 close(){this.open=false;this.emit('close');}
 set src(v){this._src=v;queueMicrotask(()=>this.onload?.());}
 get src(){return this._src;}
}
const els=new Map(),el=k=>{if(!els.has(k))els.set(k,new El());return els.get(k);};
const rooms=['paintings','cards'].map(room=>{const e=new El('button');e.dataset.room=room;return e;});
const lists=['paintings','cards'].map(room=>{const e=new El('button');e.dataset.list=room;return e;});
globalThis.document={querySelector:el,querySelectorAll:s=>s==='[data-room]'?rooms:s==='[data-list]'?lists:s==='dialog'?['#artDialog','#helpDialog','#catalogDialog'].map(el):[],createElement:t=>new El(t),createTextNode:t=>({textContent:t}),createDocumentFragment:()=>new El(),body:new El(),documentElement:new El()};
globalThis.window=new El();globalThis.devicePixelRatio=1;globalThis.location=new URL('https://test.invalid/');globalThis.matchMedia=()=>({matches:true});globalThis.requestAnimationFrame=fn=>{globalThis.frame=fn;return 1;};globalThis.fetch=async()=>({ok:true,json:async()=>structuredClone(data)});globalThis.sessionStorage={getItem:()=>true,setItem(){}};
globalThis.Image=class extends El{constructor(){super('img');this.naturalWidth=900;this.naturalHeight=1100;}};
if(process.env.TEST_MODE==='standalone'){const html=fs.readFileSync(new URL('xem-thu.html',ROOT),'utf8');vm.runInThisContext(html.match(/<script>([\s\S]*?)<\/script>/)[1]);}else await import('../dist/app.js');
const settle=()=>new Promise(r=>setTimeout(r,12));await settle();
const api=window.exhibition,m=api.museum;if(process.env.TEST_MODE==='standalone')data=api.data;
if(process.env.TEST_MODE==='fallback'){
 assert.equal(m,null);el('#start').emit('click');assert.ok(el('#catalogDialog').open);assert.equal(el('#fallbackNote').hidden,false);assert.equal(el('#catalogList').children[0].children.length,20);lists[1].emit('click');assert.equal(el('#catalogList').children[0].children.length,10);el('#catalogList').children[0].children[0].children[0].emit('click');await settle();assert.equal(api.selected,'thiep-01');el('#flipCard').emit('click');await settle();assert.equal(el('#detailImage').src,data.cards[0].insideImage);console.log('PASS: Không có WebGL vẫn xem đủ 20 tranh, 10 thiệp và hai mặt thiệp.');process.exit(0);
}
assert.ok(m,'WebGL engine initialized');
assert.equal(m.artSurfaces.size,30);assert.equal([...m.artSurfaces.values()].filter(a=>a.loaded).length,20,'Only first room textures loaded initially');assert.ok(drawCount>0);
assert.ok(drawCalls.some(([k,a])=>k==='fillText'&&String(a[0]).includes('Chưa cập nhật')),'Vietnamese labels are passed intact');
const click=id=>el(id).emit('click');
click('#start');await settle();assert.equal(m.home,false);
const centerOf=id=>{const a=m.artSurfaces.get(id);return m.project(a.surface.center);};
let paintings=0,cards=0;
for(const item of [...data.paintings,...data.cards]){
 await m.focusArtwork(item.id);const before=m.snapshot(),p=centerOf(item.id);assert.ok(p.visible&&p.x>0&&p.x<1440&&p.y>0&&p.y<900,item.id+' projects inside screen');
 const hit=m.pick(p.x,p.y);assert.equal(hit?.id,item.id,'Raycast correct: '+item.id);
 el('#museum').emit('pointerdown',{pointerId:1,clientX:p.x,clientY:p.y});el('#museum').emit('pointerup',{pointerId:1,clientX:p.x,clientY:p.y});await settle();
 assert.equal(api.selected,item.id,'3D tap opens '+item.id);assert.equal(el('#artTitle').textContent,item.title);assert.equal(el('#artAuthor').textContent,item.author);assert.ok(el('#artDialog').open);
 const first=el('#detailImage').src;
 if(item.insideImage){assert.equal(first,item.frontImage);click('#flipCard');await settle();assert.equal(el('#detailImage').src,item.insideImage);click('#flipCard');await settle();assert.equal(el('#detailImage').src,item.frontImage);cards++;}else{assert.equal(first,item.image);paintings++;}
 click('#closeArt');assert.deepEqual(m.snapshot(),before,'View preserved after closing '+item.id);
}
assert.equal(paintings,20);assert.equal(cards,10);
// Mọi tác phẩm cũng nhìn và chọn được từ một điểm quan sát cố định, bằng xoay camera.
for(const [room,cx]of [['paintings',0],['cards',24]])for(const item of data[room]){
 const a=m.artSurfaces.get(item.id);let chosen=0,best=Infinity;
 const {STATIONS}=await import('../dist/museum.js');STATIONS.forEach((st,i)=>{const x=cx+(room==='cards'&&i===7?-st.pos[0]:st.pos[0]);const d=Math.hypot(a.surface.center[0]-x,a.surface.center[2]-st.pos[2]);if(d<best){best=d;chosen=i;}});
 await m.go(room,chosen);const delta=a.surface.center.map((v,i)=>v-m.pos[i]);m.yaw=Math.atan2(delta[0],-delta[2]);m.pitch=Math.atan2(delta[1],Math.hypot(delta[0],delta[2]));const pp=m.project(a.surface.center);assert.equal(m.pick(pp.x,pp.y)?.id,item.id,'Reachable from fixed station: '+item.id);
}

await m.go('paintings',0);const pos=m.pos.slice(),yaw=m.yaw;
el('#museum').emit('pointerdown',{pointerId:2,clientX:720,clientY:400});el('#museum').emit('pointermove',{pointerId:2,clientX:850,clientY:440});el('#museum').emit('pointerup',{pointerId:2,clientX:850,clientY:440});assert.notEqual(m.yaw,yaw);assert.deepEqual(m.pos,pos);assert.equal(api.selected,null,'Drag does not open artwork');
// Dùng pointerType touch cho vuốt trong phòng.
el('#museum').emit('pointerdown',{pointerId:4,pointerType:'touch',clientX:600,clientY:400});el('#museum').emit('pointermove',{pointerId:4,pointerType:'touch',clientX:480,clientY:400});el('#museum').emit('pointerup',{pointerId:4,pointerType:'touch',clientX:480,clientY:400});assert.equal(api.selected,null);
await m.focusArtwork(data.cards[0].id);let p=centerOf(data.cards[0].id);el('#museum').emit('pointerdown',{pointerId:1,clientX:p.x,clientY:p.y});el('#museum').emit('pointerup',{pointerId:1,clientX:p.x,clientY:p.y});
const stage=el('#imageStage');stage.emit('pointerdown',{pointerId:21,pointerType:'touch',clientX:100,clientY:200});stage.emit('pointerdown',{pointerId:22,pointerType:'touch',clientX:200,clientY:200});stage.emit('pointermove',{pointerId:22,pointerType:'touch',clientX:300,clientY:200});assert.equal(api.zoom.scale,2,'Pinch doubles image size');stage.emit('pointerup',{pointerId:21});stage.emit('pointerup',{pointerId:22});click('#zoomReset');assert.equal(api.zoom.scale,1);click('#zoomIn');assert.ok(api.zoom.scale>1);click('#closeArt');
await m.go('paintings',0);const marker=m.surfaces.find(s=>s.meta?.type==='station'&&s.meta.room==='paintings'&&s.meta.index===2),mp=m.project(marker.center);assert.equal(m.pick(mp.x,mp.y)?.type,'station');el('#museum').emit('pointerdown',{pointerId:5,clientX:mp.x,clientY:mp.y});el('#museum').emit('pointerup',{pointerId:5,clientX:mp.x,clientY:mp.y});await settle();assert.equal(m.station,2,'Floor marker changes station');
rooms[1].emit('click');await settle();assert.equal(m.room,'cards');click('#nextStation');await settle();assert.equal(m.station,1);click('#prevStation');await settle();assert.equal(m.station,0);click('#home');assert.equal(m.home,true);
// Ba tỷ lệ khung nhìn đều có ma trận chiếu và tọa độ chọn hợp lệ.
for(const [w,h] of [[390,844],[844,390],[1440,900]]){el('#museum').rect={left:0,top:0,width:w,height:h,right:w,bottom:h};m.resize();m.home=false;await m.focusArtwork('tranh-20');p=centerOf('tranh-20');assert.equal(m.pick(p.x,p.y)?.id,'tranh-20');}
console.log('PASS: 30/30 tác phẩm chọn đúng từ tọa độ 3D; 20 ảnh tranh; 10 thiệp đổi hai mặt; giữ trạng thái khi đóng; kéo/vuốt khác chạm; pinch zoom; điểm sàn; chuyển khu; 3 tỷ lệ màn hình.');
console.log('Giới hạn: DOM và WebGL mô phỏng, chưa xác minh raster, trình duyệt và điện thoại thực tế.');
