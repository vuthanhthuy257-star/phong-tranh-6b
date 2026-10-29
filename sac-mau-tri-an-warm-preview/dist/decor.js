// Mô hình thực bằng tam giác: chậu tròn, cành dạng ống, lá cong có độ dày, hoa có cánh.
// Không dùng billboard, tệp mô hình ngoài, animation hoặc bóng động.
export function buildDecor(){
 const vertices=[],triangles=[],objects=[],palette=[],paletteIndex=new Map();
 const add=(a,b)=>a.map((x,i)=>x+b[i]),sub=(a,b)=>a.map((x,i)=>x-b[i]),mul=(a,n)=>a.map(x=>x*n);
 const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0),unit=a=>mul(a,1/(Math.hypot(...a)||1));
 const light=unit([-.4,.85,.3]);let current=null;
 function tri(a,b,c,color){const n=unit(cross(sub(b,a),sub(c,a))),shade=.77+.23*Math.abs(dot(n,light));
  const rgb=color.map(v=>Math.round(v*shade*255)),key=rgb.join(',');let index=paletteIndex.get(key);if(index===undefined){index=palette.length;if(index>=4096)throw new Error('Bảng màu mô hình vượt giới hạn');palette.push(rgb);paletteIndex.set(key,index);}const uv=[(index%64+.5)/64,1-(Math.floor(index/64)+.5)/64];
  for(const p of [a,b,c]){vertices.push(...p,...uv);for(let i=0;i<3;i++){current.min[i]=Math.min(current.min[i],p[i]);current.max[i]=Math.max(current.max[i],p[i]);}}
  triangles.push({a,b,c,n,object:current.id});
 }
 function face(a,b,c,d,color){tri(a,b,c,color);tri(a,c,d,color);}
 function object(id,kind,room,fn){current={id,kind,room,min:[Infinity,Infinity,Infinity],max:[-Infinity,-Infinity,-Infinity],first:triangles.length};fn();current.triangles=triangles.length-current.first;objects.push(current);}
 function lathe(at,profile,color,sides=14){for(let i=0;i<sides;i++){const t=i*2*Math.PI/sides,q=(i+1)*2*Math.PI/sides;for(let j=0;j<profile.length-1;j++){const [y,r]=profile[j],[yy,rr]=profile[j+1];face(add(at,[Math.cos(t)*r,y,Math.sin(t)*r]),add(at,[Math.cos(q)*r,y,Math.sin(q)*r]),add(at,[Math.cos(q)*rr,yy,Math.sin(q)*rr]),add(at,[Math.cos(t)*rr,yy,Math.sin(t)*rr]),color);}}}
 function tube(a,b,r1,r2,color,sides=6){const dir=unit(sub(b,a)),u=unit(cross(dir,Math.abs(dir[1])>.95?[1,0,0]:[0,1,0])),v=cross(dir,u);for(let i=0;i<sides;i++){const point=(p,r,t)=>add(p,add(mul(u,Math.cos(t)*r),mul(v,Math.sin(t)*r)));const t=2*Math.PI*i/sides,q=2*Math.PI*(i+1)/sides;face(point(a,r1,t),point(a,r1,q),point(b,r2,q),point(b,r2,t),color);}}
 function leaf(base,angle,length,width,rise,color){const dir=[Math.cos(angle)*.88,rise,Math.sin(angle)*.88],side=[-Math.sin(angle),0,Math.cos(angle)];
  const p=(t,s,back)=>{const spread=Math.pow(Math.sin(Math.PI*t),.75)*width*s;return add(base,add(mul(dir,t*length),add(mul(side,spread),[0,Math.sin(Math.PI*t)*(.13+(.055*(1-Math.abs(s))))-(back?.014:0),0])));};
  for(let i=0;i<5;i++)for(let j=0;j<2;j++){const t=i/5,q=(i+1)/5,s=j-1,z=j;for(const back of [false,true])face(p(t,s,back),p(q,s,back),p(q,z,back),p(t,z,back),back?color.map(x=>x*.87):color);}
  // Hai mép nối mặt trên/dưới: lá là thể tích mỏng, không phải một tấm phẳng.
  for(let i=0;i<5;i++)for(const side of [-1,1])face(p(i/5,side,false),p((i+1)/5,side,false),p((i+1)/5,side,true),p(i/5,side,true),color);
 }
 function plant(id,room,x,z,scale=1){object(id,'plant',room,()=>{
  const at=[x,0,z],ceramic=[.81,.79,.71];lathe(at,[[0,.23*scale],[.06*scale,.25*scale],[.43*scale,.31*scale],[.49*scale,.31*scale],[.50*scale,.27*scale],[.46*scale,.26*scale]],ceramic,16);
  lathe(at,[[.458*scale,0],[.46*scale,.263*scale]],[.21,.22,.16],14);
  for(let branch=0;branch<3;branch++){const angle=branch*2.4+.3,h=(1.22+branch*.20)*scale;const stem=[x+Math.cos(angle)*.12*scale,h,z+Math.sin(angle)*.12*scale];tube([x,.46*scale,z],stem,.022*scale,.009*scale,[.34,.38,.22],7);
   for(let i=0;i<4;i++){const y=(.7+i*.17+branch*.09)*scale,t=(y-.46*scale)/(h-.46*scale),a=angle+i*2.35,b=[x+(stem[0]-x)*t,y,z+(stem[2]-z)*t];const tip=add(b,[Math.cos(a)*.10*scale,.055*scale,Math.sin(a)*.10*scale]);tube(b,tip,.008*scale,.005*scale,[.32,.39,.23],5);leaf(tip,a,(.34+(i%2)*.07)*scale,.105*scale,.22,[.24+branch*.018,.36+branch*.022,.25]);}
  }
 });}
 function flowers(id,room,x,z){object(id,'flowers',room,()=>{
  const at=[x,0,z]; // Bục nhỏ đặt sát vùng tường trống, mọi chân đỡ đều chạm sàn.
  lathe(at,[[0,.24],[.045,.26],[.74,.26],[.77,.24],[.77,0]],[.83,.81,.74],16);
  const vase=[x,.77,z];lathe(vase,[[0,.10],[.06,.16],[.20,.18],[.34,.09],[.40,.075],[.41,.06],[.37,.055]],[.67,.56,.47],16);
  const palette=[[.84,.72,.65],[.92,.88,.76],[.74,.58,.55]];
  for(let i=0;i<7;i++){const angle=i*2.4,r=i===0?0:.13+(i%2)*.035,tip=[x+Math.cos(angle)*r,1.42+(i%3)*.065,z+Math.sin(angle)*r];tube([x,1.12,z],tip,.009,.005,[.32,.41,.28],5);
   if(i<4)leaf([tip[0],1.24,tip[2]],angle+.5,.19,.045,.2,[.33,.43,.29]);
   const c=palette[i%palette.length];for(let petal=0;petal<6;petal++){const t=petal*Math.PI/3;const base=[tip[0],tip[1]-.025,tip[2]];const p=(u,v)=>[base[0]+Math.cos(t)*u-Math.sin(t)*v,base[1]+.4*u-.5*v*v,base[2]+Math.sin(t)*u+Math.cos(t)*v];
    face(p(0,0),p(.065,-.035),p(.12,0),p(.065,.035),c);tri(p(.065,-.035),p(.065,.035),p(.12,0),c.map(x=>x*.95));}
   lathe([tip[0],tip[1]-.01,tip[2]],[[0,.021],[.025,.022],[.034,0]],[.69,.55,.32],7);
  }
 });}
 plant('tranh-cay-tay-bac','paintings',-7.65,-12.65,1.05);
 plant('tranh-cay-dong-nam','paintings',7.65,12.65,1);
 plant('tranh-cay-loi-noi','paintings',7.7,4.4,.55);
 flowers('tranh-binh-hoa','paintings',-7.65,12.55);
 plant('thiep-cay-tay-bac','cards',24-7.55,-12.55,.88);
 plant('thiep-cay-dong-nam','cards',24+7.55,12.5,.82);
 flowers('thiep-binh-hoa','cards',24-5.3,11.7);
 return{vertices:new Float32Array(vertices),triangles,objects,palette};
}
