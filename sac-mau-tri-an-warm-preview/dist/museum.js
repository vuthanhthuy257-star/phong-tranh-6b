import {buildDecor} from './decor.js';
// Bộ dựng WebGL độc lập, không phụ thuộc CDN. Đơn vị không gian: mét.
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,n)=>a.map(v=>v*n);
const dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>mul(a,1/Math.hypot(...a));
const clamp=(n,a,b)=>Math.min(b,Math.max(a,n));
function canvasTexture(w,h,fn){const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return c;}
function titleTexture(title,subline){return canvasTexture(1024,128,(c,w,h)=>{c.scale(.5,.5);w*=2;h*=2;c.fillStyle='#eae7dc';c.fillRect(0,0,w,h);c.textAlign='center';c.fillStyle='#394a3f';c.font='56px Georgia';c.fillText(title,w/2,106);c.font='19px Arial';c.fillStyle='#827b68';c.fillText(subline,w/2,166);});}
export function placement(item,room){const p=item.position,cx=room==='paintings'?0:24;
 const side=room==='paintings'?[-11,-6.6,-2.2,2.2,6.6,11]:[-10,-5,5,10];
 const ends=room==='paintings'?[-6,-2,2,6]:[-4,4];let center,u;
 if(p.wall==='tay'){center=[cx-8.88,2.35,side[p.slot-1]];u=[0,0,-1];}
 if(p.wall==='dong'){center=[cx+8.88,2.35,side[p.slot-1]];u=[0,0,1];}
 if(p.wall==='bac'){center=[cx+ends[p.slot-1],2.35,-13.88];u=[1,0,0];}
 if(p.wall==='nam'){center=[cx+ends[p.slot-1],2.35,13.88];u=[-1,0,0];}
 if(!center||!Number.isFinite(center[0])||!Number.isFinite(center[2]))throw new Error('Vị trí không hợp lệ: '+item.id);
 return {center,u,v:[0,1,0],normal:cross(u,[0,1,0])};
}
export const CAMERA_LIMITS={minPitch:-.38,maxPitch:.38};
export const STATIONS=[
 {pos:[-1.2,1.7,7.4],yaw:-1.47,pitch:.06,name:'Mở đầu · tác phẩm ở tầm mắt'},
 {pos:[-4.7,1.7,6.7],yaw:-Math.PI/2,name:'Tường Tây · phía trước'},
 {pos:[-3.5,1.7,-6.5],yaw:-Math.PI/2,name:'Tường Tây · phía sau'},
 {pos:[0,1.7,-8.5],yaw:0,name:'Tường Bắc'},
 {pos:[3.5,1.7,-6.5],yaw:Math.PI/2,name:'Tường Đông · phía sau'},
 {pos:[3.5,1.7,7.5],yaw:Math.PI/2,name:'Tường Đông · phía trước'},
 {pos:[0,1.7,8.5],yaw:Math.PI,name:'Tường Nam'},
 {pos:[5.5,1.7,0],yaw:Math.PI/2,name:'Lối sang khu liền kề'}
];
export function stationFor(room,index){const st=STATIONS[index],mirror=room==='cards'&&index===7;return{...st,pos:[(mirror?-st.pos[0]:st.pos[0])+(room==='cards'?24:0),st.pos[1],st.pos[2]],yaw:mirror?-st.yaw:st.yaw};}
export class Museum{
 constructor(canvas,data,callbacks){this.canvas=canvas;this.data=data;this.cb=callbacks;this.room='paintings';this.station=0;this.pos=[0,1.7,9];this.yaw=-.31;this.pitch=.015;this.fov=72;this.surfaces=[];this.artSurfaces=new Map();this.queue=[];this.activeLoads=0;this.home=true;this.dirty=true;this.disposed=false;
 const gl=canvas.getContext('webgl',{alpha:false,antialias:true,powerPreference:'low-power'});if(!gl)throw new Error('WebGL không khả dụng');this.gl=gl;
 const vs='attribute vec3 a_pos;attribute vec2 a_uv;uniform mat4 u_proj;uniform mat4 u_view;varying vec2 v_uv;void main(){v_uv=a_uv;gl_Position=u_proj*u_view*vec4(a_pos,1.0);}';
 const fs='precision mediump float;uniform sampler2D u_tex;uniform vec4 u_color;varying vec2 v_uv;void main(){vec4 c=texture2D(u_tex,v_uv)*u_color;if(c.a<0.025)discard;gl_FragColor=c;}';
 const compile=(t,s)=>{const sh=gl.createShader(t);gl.shaderSource(sh,s);gl.compileShader(sh);if(!gl.getShaderParameter(sh,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(sh));return sh;};
 this.program=gl.createProgram();gl.attachShader(this.program,compile(gl.VERTEX_SHADER,vs));gl.attachShader(this.program,compile(gl.FRAGMENT_SHADER,fs));gl.linkProgram(this.program);if(!gl.getProgramParameter(this.program,gl.LINK_STATUS))throw new Error('Không khởi tạo được bộ dựng 3D');gl.useProgram(this.program);
 this.loc={};for(const k of ['u_proj','u_view','u_tex','u_color'])this.loc[k]=gl.getUniformLocation(this.program,k);this.loc.a_pos=gl.getAttribLocation(this.program,'a_pos');this.loc.a_uv=gl.getAttribLocation(this.program,'a_uv');
 gl.enable(gl.DEPTH_TEST);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.clearColor(.93,.92,.87,1);
 this.white=this.texture(canvasTexture(1,1,c=>{c.fillStyle='white';c.fillRect(0,0,1,1);}));
 this.wood=this.texture(canvasTexture(512,512,(c,w,h)=>{c.fillStyle='#c7b593';c.fillRect(0,0,w,h);let seed=31;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};for(let x=0;x<w;x+=64){c.fillStyle=`rgba(143,111,70,${.03+rand()*.1})`;c.fillRect(x,0,63,h);c.fillStyle='#a89779';c.fillRect(x,0,1,h);for(let i=0;i<85;i++){c.strokeStyle=`rgba(117,88,54,${rand()*.14})`;c.beginPath();let gx=x+rand()*62;c.moveTo(gx,0);c.bezierCurveTo(gx+rand()*3,130,gx-rand()*4,350,gx+rand()*2,512);c.stroke();}for(let y=(x*3)%250;y<h;y+=256){c.fillStyle='#b2a182';c.fillRect(x,y,64,1);}}}),true);
 this.ring=this.texture(canvasTexture(128,128,(c)=>{c.strokeStyle='#f8f5e4';c.lineWidth=4;c.beginPath();c.arc(64,64,45,0,Math.PI*2);c.stroke();c.fillStyle='#faf8ef';c.beginPath();c.arc(64,64,7,0,Math.PI*2);c.fill();}));
 this.build();this.decor=buildDecor();this.decorTexture=this.texture(canvasTexture(64,64,ctx=>{this.decor.palette.forEach((rgb,i)=>{ctx.fillStyle=`rgb(${rgb.join(',')})`;ctx.fillRect(i%64,Math.floor(i/64),1,1);});}));this.buffer=gl.createBuffer();this.upload();this.resize();this.events();this.loadRoom('paintings');this.render();
 canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();this.disposed=true;this.cb.unavailable('Mất kết nối WebGL. Bạn vẫn có thể xem danh mục.');});
 }
 texture(source,repeat=false){const g=this.gl,t=g.createTexture();g.bindTexture(g.TEXTURE_2D,t);g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL,true);g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,source);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MAG_FILTER,g.LINEAR);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_S,repeat?g.REPEAT:g.CLAMP_TO_EDGE);g.texParameteri(g.TEXTURE_2D,g.TEXTURE_WRAP_T,repeat?g.REPEAT:g.CLAMP_TO_EDGE);return t;}
 quad(center,u,v,w,h,color=[1,1,1,1],texture=this.white,meta=null,uvScale=[1,1]){const n=cross(u,v);const s={center,u,v,w,h,n,color,texture,meta,uvScale,skipPick:false};this.surfaces.push(s);return s;}
 planeAt(c,u,v,w,h,color,tex,meta){return this.quad(c,u,v,w,h,color,tex,meta);}
 box(c,w,h,d,color){const Q=(o,u,v,a,b,shade)=>this.quad(add(c,o),u,v,a,b,[...color.map(n=>n*shade),1]);Q([0,0,d/2],[1,0,0],[0,1,0],w,h,.84);Q([0,0,-d/2],[-1,0,0],[0,1,0],w,h,.9);Q([-w/2,0,0],[0,0,-1],[0,1,0],d,h,.76);Q([w/2,0,0],[0,0,1],[0,1,0],d,h,.92);Q([0,h/2,0],[1,0,0],[0,0,-1],w,d,1);Q([0,-h/2,0],[1,0,0],[0,0,1],w,d,.65);}
 build(){for(const [room,cx] of [['paintings',0],['cards',24]]){
  const wall=room==='paintings'?[.94,.93,.89,1]:[.87,.9,.86,1];
  this.quad([cx,0,0],[1,0,0],[0,0,-1],18,28,[1,1,1,1],this.wood,null,[4.5,7]);
  this.quad([cx,5,0],[1,0,0],[0,0,1],18,28,[.95,.95,.92,1]);
  this.quad([cx,2.5,-14],[1,0,0],[0,1,0],18,5,wall);
  this.quad([cx,2.5,14],[-1,0,0],[0,1,0],18,5,wall);
  for(const side of [-1,1]){const x=cx+side*9,u=[0,0,side],sideColor=wall.map((v,i)=>i<3?v*(side===-1?.96:1):v);const isDoor=(room==='paintings'&&side===1)||(room==='cards'&&side===-1);
   if(isDoor){for(const z of [-7.65,7.65])this.quad([x,2.5,z],u,[0,1,0],12.7,5,sideColor);this.quad([x,4.25,0],u,[0,1,0],2.6,1.5,sideColor);
    for(const z of [-1.36,1.36])this.box([x-side*.035,1.65,z],.16,3.3,.12,[.62,.6,.51]);this.box([x-side*.035,3.3,0],.16,.12,2.85,[.62,.6,.51]);
    const label=this.texture(titleTexture(room==='paintings'?'THIỆP CHÚC MỪNG →':'← PHÒNG TRANH','KHÔNG GIAN '+(room==='paintings'?'02':'01')));
    this.quad([x-side*.045,3.95,0],u,[0,1,0],2.5,.32,[1,1,1,1],label);
    const door=this.quad([x-side*.06,1.65,0],u,[0,1,0],2.5,3.2,[1,1,1,0],this.white,{type:'room',room:room==='paintings'?'cards':'paintings'});door.invisible=true;
   }else this.quad([x,2.5,0],u,[0,1,0],28,5,sideColor);
   // Plinths stay clear of the doorway.
   for(const z of [-7.7,7.7])this.box([x-side*.025,.085,z],.06,.17,12.6,[.72,.71,.65]);
  }
  for(const z of [-13.96,13.96])this.box([cx,.08,z],18,.16,.06,[.72,.71,.65]);
  const sign=this.texture(titleTexture(room==='paintings'?'PHÒNG TRANH':'THIỆP CHÚC MỪNG',room==='paintings'?'Những nét vẽ gửi ngàn lời tri ân':'Trao yêu thương qua từng cánh thiệp'));
  this.quad([cx,4.05,-13.97],[1,0,0],[0,1,0],6.8,.85,[1,1,1,1],sign);
  if(room==='cards')this.quad([cx,2.9,13.96],[-1,0,0],[0,1,0],7,.9,[1,1,1,1],this.texture(titleTexture('GỬI NGÀN LỜI TRI ÂN','LỚP 6B – TRƯỜNG THCS HÒA CHUNG')));
  for(const x of [-5,5]){this.box([cx+x,4.85,0],.08,.08,25,[.3,.33,.29]);for(const z of [-10,-5,0,5,10]){this.box([cx+x,4.68,z],.25,.22,.35,[.32,.34,.3]);this.quad([cx+x,4.56,z],[1,0,0],[0,0,1],.19,.28,[1,.98,.85,1]);}}
  if(room==='paintings'){const bx=-1.7,bz=1.5;this.box([bx,.43,bz],2,.12,.48,[.58,.46,.31]);for(const x of [-.72,.72])this.box([bx+x,.185,bz],.075,.37,.35,[.28,.3,.26]);}
  const list=this.data[room];for(const item of list)this.artwork(item,room);
  STATIONS.forEach((_,i)=>{const st=stationFor(room,i);const s=this.quad([st.pos[0],.018,st.pos[2]],[1,0,0],[0,0,-1],.82,.82,[1,1,1,.82],this.ring,{type:'station',room,index:i});s.translucent=true;});
 }
 // A real opening connects the two rooms; camera follows a safe path through it.
 this.quad([12,0,0],[1,0,0],[0,0,-1],6,2.6,[1,1,1,1],this.wood,null,[1.5,.65]);
 this.quad([12,3.3,0],[1,0,0],[0,0,1],6,2.6,[.91,.91,.86,1]);for(const z of [-1.3,1.3])this.quad([12,1.65,z],[1,0,0],[0,1,0],6,3.3,[.9,.9,.85,1]);
 }
 artwork(item,room){const p=placement(item,room),normal=p.normal;const c=p.center,dim=room==='paintings'?[1.86,2.07]:[1.65,1.86];const move=(v,n)=>add(v,mul(normal,n));const meta={type:'art',id:item.id,room};
  this.quad(move(c,.002),p.u,p.v,dim[0]+.12,dim[1]+.12,[.32,.30,.24,1],this.white,meta);
  this.quad(move(c,.014),p.u,p.v,dim[0],dim[1],[.98,.97,.94,1],this.white,meta);
  const imageSurface=this.quad(move(c,.025),p.u,p.v,dim[0]-.26,dim[1]-.26,[.9,.89,.84,1],this.white,meta);this.artSurfaces.set(item.id,{surface:imageSurface,item,room,max:[dim[0]-.26,dim[1]-.26],loaded:false});
  const label=this.texture(canvasTexture(512,96,(ctx,w,h)=>{ctx.scale(.5,.5);w*=2;h*=2;ctx.fillStyle='#f4f1e7';ctx.fillRect(0,0,w,h);ctx.fillStyle='#3c483c';ctx.font='39px Georgia';ctx.fillText(item.title||item.id,40,65);ctx.fillStyle='#7a7e6f';ctx.font='25px Arial';const author=item.author;ctx.fillText(author.length>48?author.slice(0,46)+'…':author,40,111);ctx.fillStyle='#9c8c72';ctx.font='19px Arial';ctx.fillText(item.placeholder?'ẢNH GIỮ CHỖ · CHẠM ĐỂ XEM':'CHẠM ĐỂ XEM TÁC PHẨM',40,156);}));
  this.quad(move([c[0],c[1]-dim[1]/2-.26,c[2]],.035),p.u,p.v,1.7,.32,[1,1,1,1],label,meta);
  // Baked light pool, no expensive real-time shadows.
  const light=this.glowTexture??=this.texture(canvasTexture(128,256,(ctx,w,h)=>{let g=ctx.createRadialGradient(64,20,5,64,95,140);g.addColorStop(0,'rgba(255,250,222,.30)');g.addColorStop(1,'rgba(255,250,222,0)');ctx.fillStyle=g;ctx.fillRect(0,0,w,h);}));
  const glow=this.quad(move([c[0],3.75,c[2]],.005),p.u,p.v,2.5,2,[1,1,1,1],light);glow.skipPick=true;
 }
 upload(){const out=[];for(const s of this.surfaces){s.offset=out.length/5;const {center:c,u,v,w,h,uvScale:uv}=s;for(const [a,b,tx,ty]of [[-1,-1,0,0],[1,-1,1,0],[1,1,1,1],[-1,-1,0,0],[1,1,1,1],[-1,1,0,1]]){const p=add(c,add(mul(u,a*w/2),mul(v,b*h/2)));out.push(...p,tx*uv[0],ty*uv[1]);}}
  this.decorOffset=out.length/5;for(const v of this.decor.vertices)out.push(v);const g=this.gl;g.bindBuffer(g.ARRAY_BUFFER,this.buffer);g.bufferData(g.ARRAY_BUFFER,new Float32Array(out),g.STATIC_DRAW);this.dirty=true;
 }
 loadRoom(room){for(const a of this.artSurfaces.values())if(a.room===room&&!a.loaded&&!a.queued){a.queued=true;this.queue.push(a);}this.drain();}
 drain(){while(this.activeLoads<3&&this.queue.length){const a=this.queue.shift();this.activeLoads++;const img=new Image();img.decoding='async';img.onload=()=>{if(!this.disposed){const ratio=img.naturalWidth/img.naturalHeight;let [w,h]=a.max;if(w/h>ratio)w=h*ratio;else h=w/ratio;a.surface.w=w;a.surface.h=h;
  // Cap GPU preview size even when the source thumbnail is too large.
  const max=768,scale=Math.min(1,max/Math.max(img.naturalWidth,img.naturalHeight));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.naturalWidth*scale));c.height=Math.max(1,Math.round(img.naturalHeight*scale));c.getContext('2d').drawImage(img,0,0,c.width,c.height);a.surface.texture=this.texture(c);a.surface.color=[1,1,1,1];a.loaded=true;this.upload();}done();};img.onerror=()=>{this.cb.assetError(a.item.id);done();};const done=()=>{this.activeLoads--;this.drain();};img.src=a.item.thumbnail||(a.room==='paintings'?a.item.image:a.item.frontImage);}}
 resize(){const r=this.canvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,1.6);this.canvas.width=Math.round(r.width*d);this.canvas.height=Math.round(r.height*d);this.aspect=r.width/r.height;this.gl.viewport(0,0,this.canvas.width,this.canvas.height);this.dirty=true;}
 basis(){const d=[Math.sin(this.yaw)*Math.cos(this.pitch),Math.sin(this.pitch),-Math.cos(this.yaw)*Math.cos(this.pitch)];const r=norm(cross(d,[0,1,0]));return{d,r,u:cross(r,d)};}
 render(){if(this.disposed)return;if(this.dirty){this.dirty=false;const g=this.gl;g.clear(g.COLOR_BUFFER_BIT|g.DEPTH_BUFFER_BIT);const f=1/Math.tan(this.fov*Math.PI/360),a=this.aspect,n=.05,far=100;const proj=new Float32Array([f/a,0,0,0,0,f,0,0,0,0,-(far+n)/(far-n),-1,0,0,-2*far*n/(far-n),0]);const{d,r,u}=this.basis(),p=this.pos;const view=new Float32Array([r[0],u[0],-d[0],0,r[1],u[1],-d[1],0,r[2],u[2],-d[2],0,-dot(r,p),-dot(u,p),dot(d,p),1]);g.useProgram(this.program);g.uniformMatrix4fv(this.loc.u_proj,false,proj);g.uniformMatrix4fv(this.loc.u_view,false,view);g.bindBuffer(g.ARRAY_BUFFER,this.buffer);g.enableVertexAttribArray(this.loc.a_pos);g.enableVertexAttribArray(this.loc.a_uv);g.vertexAttribPointer(this.loc.a_pos,3,g.FLOAT,false,20,0);g.vertexAttribPointer(this.loc.a_uv,2,g.FLOAT,false,20,12);g.uniform1i(this.loc.u_tex,0);for(const s of this.surfaces){if(s.invisible)continue;g.bindTexture(g.TEXTURE_2D,s.texture);g.uniform4fv(this.loc.u_color,s.color);if(s.skipPick||s.translucent)g.depthMask(false);g.drawArrays(g.TRIANGLES,s.offset,6);g.depthMask(true);}g.bindTexture(g.TEXTURE_2D,this.decorTexture);g.uniform4fv(this.loc.u_color,[1,1,1,1]);g.drawArrays(g.TRIANGLES,this.decorOffset,this.decor.vertices.length/5);}
 this.raf=requestAnimationFrame(()=>this.render());}
 pick(clientX,clientY){const rect=this.canvas.getBoundingClientRect(),x=(clientX-rect.left)/rect.width*2-1,y=1-(clientY-rect.top)/rect.height*2;const{d,r,u}=this.basis(),t=Math.tan(this.fov*Math.PI/360);const ray=norm(add(d,add(mul(r,x*t*this.aspect),mul(u,y*t))));let nearest=Infinity,result=null;
 for(const s of this.surfaces){if(s.skipPick)continue;const den=dot(ray,s.n);if(Math.abs(den)<1e-6)continue;const dist=dot(sub(s.center,this.pos),s.n)/den;if(dist<.02||dist>=nearest)continue;const local=sub(add(this.pos,mul(ray,dist)),s.center);if(Math.abs(dot(local,s.u))<=s.w/2&&Math.abs(dot(local,s.v))<=s.h/2){nearest=dist;result=s.meta;}}
 // Các vật trang trí cũng che tia chọn theo đúng hình học, không xuyên qua lá/chậu.
 for(const tri of this.decor.triangles){const e1=sub(tri.b,tri.a),e2=sub(tri.c,tri.a),p=cross(ray,e2),det=dot(e1,p);if(Math.abs(det)<1e-8)continue;const inv=1/det,t=sub(this.pos,tri.a),u=dot(t,p)*inv;if(u<0||u>1)continue;const q=cross(t,e1),v=dot(ray,q)*inv;if(v<0||u+v>1)continue;const dist=dot(e2,q)*inv;if(dist>.02&&dist<nearest){nearest=dist;result=null;}}
 return result;
 }
 events(){let pointer=null;const c=this.canvas;
 c.addEventListener('pointerdown',e=>{if(this.home||this.moving||e.button>0)return;if(pointer){pointer.cancelled=true;return;}pointer={id:e.pointerId,x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:0,cancelled:false};c.setPointerCapture(e.pointerId);});
 c.addEventListener('pointermove',e=>{if(!pointer||pointer.id!==e.pointerId)return;const dx=e.clientX-pointer.lastX,dy=e.clientY-pointer.lastY;pointer.moved=Math.max(pointer.moved,Math.hypot(e.clientX-pointer.x,e.clientY-pointer.y));if(pointer.moved>7){this.yaw-=dx*.004;this.pitch=clamp(this.pitch+dy*.003,CAMERA_LIMITS.minPitch,CAMERA_LIMITS.maxPitch);this.dirty=true;}pointer.lastX=e.clientX;pointer.lastY=e.clientY;});
 const clear=()=>pointer=null;c.addEventListener('pointercancel',clear);c.addEventListener('lostpointercapture',clear);
 c.addEventListener('pointerup',e=>{if(!pointer||pointer.id!==e.pointerId)return;const tap=pointer.moved<=7&&!pointer.cancelled;pointer=null;if(tap){const hit=this.pick(e.clientX,e.clientY);if(hit?.type==='art')this.cb.open(hit.id);if(hit?.type==='station')this.go(hit.room,hit.index);if(hit?.type==='room')this.go(hit.room,7);}});
 c.addEventListener('keydown',e=>{const changes={ArrowLeft:[-.13,0],ArrowRight:[.13,0],ArrowUp:[0,.1],ArrowDown:[0,-.1]};if(changes[e.key]&&!this.home){e.preventDefault();this.yaw+=changes[e.key][0];this.pitch=clamp(this.pitch+changes[e.key][1],CAMERA_LIMITS.minPitch,CAMERA_LIMITS.maxPitch);this.dirty=true;}});
 window.addEventListener('resize',()=>this.resize());
 }
 async go(room,index=0,custom=null){if(this.moving||this.disposed)return;this.moving=true;const switched=room!==this.room;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const wait=ms=>new Promise(r=>setTimeout(r,reduced?0:ms));const fade=document.querySelector('#fade');fade.classList.add('active');await wait(220);
 this.room=room;this.station=index;const st=stationFor(room,index);this.pos=custom?.pos||[...st.pos];this.yaw=custom?.yaw??st.yaw;this.pitch=st.pitch??.06;this.dirty=true;this.loadRoom(room);this.cb.change(room,index,custom?.name||st.name);await wait(70);fade.classList.remove('active');await wait(220);this.moving=false;return switched;
 }
 start(){this.home=false;return this.go('paintings',0);}
 showHome(){this.home=true;this.room='paintings';this.pos=[0,1.7,9];this.yaw=-.31;this.pitch=.015;this.dirty=true;}
 focusArtwork(id){const a=this.artSurfaces.get(id),p=placement(a.item,a.room);let pos=add(p.center,mul(p.normal,4.5));pos[1]=1.7;const d=mul(p.normal,-1),yaw=Math.atan2(d[0],-d[2]);return this.go(a.room,0,{pos,yaw,name:a.item.title});}
 snapshot(){return{room:this.room,station:this.station,pos:[...this.pos],yaw:this.yaw,pitch:this.pitch};}
 // Chiếu tọa độ 3D ra màn hình để kiểm thử khả năng chọn tác phẩm.
 project(point){const {d,r,u}=this.basis(),p=sub(point,this.pos),z=dot(p,d),t=Math.tan(this.fov*Math.PI/360),rect=this.canvas.getBoundingClientRect();return{x:rect.left+rect.width*(.5+dot(p,r)/z/t/this.aspect/2),y:rect.top+rect.height*(.5-dot(p,u)/z/t/2),visible:z>0};}
}
