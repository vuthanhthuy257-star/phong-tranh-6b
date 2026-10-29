import {Museum} from './museum.js';
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const state={data:null,museum:null,room:'paintings',listRoom:'paintings',selected:null,inside:false,home:true,fallback:false};
let toastTimer;
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),4000);}
function openDialog(el){if(!el.open)el.showModal();}
function closeDialog(el){if(el.open)el.close();}
$$('[data-close]').forEach(b=>b.addEventListener('click',()=>closeDialog(b.closest('dialog'))));
$$('dialog').forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}));
$('#help').addEventListener('click',()=>openDialog($('#helpDialog')));
function updateRoom(room,index=0,name='Toàn cảnh'){
 state.room=room;$$('[data-room]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.room===room));
 $('#roomNumber').textContent='KHÔNG GIAN '+(room==='paintings'?'01':'02')+' / 02';$('#roomTitle').textContent=room==='paintings'?'Phòng tranh':'Thiệp chúc mừng';$('#roomDesc').textContent=room==='paintings'?'20 vị trí trưng bày · Chạm vào khung để xem':'10 tấm thiệp · Chạm để mở những lời chúc';
 $('#stationLabel').textContent=String(index+1).padStart(2,'0')+' / 08';$('.station-control').title=name;
}
function leaveHome(){state.home=false;$('#app').classList.remove('at-home');$$('.in-room').forEach(e=>e.inert=false);$('#museum').tabIndex=0;}
function home(){state.home=true;$('#app').classList.add('at-home');$$('.in-room').forEach(e=>e.inert=true);$('#museum').tabIndex=-1;state.museum?.showHome();updateRoom('paintings');}
$('#start').addEventListener('click',()=>{if(state.fallback){showCatalog();return;}if(!state.museum){toast('Không gian đang được chuẩn bị.');return;}leaveHome();state.museum.start();if(!sessionStorage.getItem('6b-visited')){toast('Kéo để nhìn quanh. Chạm khung tranh để xem gần hơn.');sessionStorage.setItem('6b-visited','1');}});
$('#brandHome').addEventListener('click',home);$('#home').addEventListener('click',home);
$$('[data-room]').forEach(b=>b.addEventListener('click',()=>{if(state.fallback){showCatalog(b.dataset.room);return;}leaveHome();state.museum?.go(b.dataset.room,0);}));
$('#prevStation').addEventListener('click',()=>state.museum?.go(state.room,(state.museum.station+7)%8));
$('#nextStation').addEventListener('click',()=>state.museum?.go(state.room,(state.museum.station+1)%8));
$('#resetView').addEventListener('click',()=>state.museum?.go(state.room,state.museum.station));
$('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else toast('Trình duyệt này chưa hỗ trợ nút toàn màn hình.');}catch{toast('Bạn có thể dùng chế độ toàn màn hình của trình duyệt.');}});
function showCatalog(room=state.room){if(!state.data)return;state.listRoom=room;renderCatalog();openDialog($('#catalogDialog'));}
$('#catalog').addEventListener('click',()=>showCatalog());
$$('[data-list]').forEach(b=>b.addEventListener('click',()=>{state.listRoom=b.dataset.list;renderCatalog();}));
function renderCatalog(){const room=state.listRoom;$$('[data-list]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.list===room));const fragment=document.createDocumentFragment();
 for(const item of state.data[room]){const article=document.createElement('article');article.className='catalog-item';article.dataset.id=item.id;
 const button=document.createElement('button');button.className='thumb-button';button.setAttribute('aria-label','Xem '+item.title);button.addEventListener('click',()=>openArtwork(item.id));
 const img=new Image();img.loading='lazy';img.decoding='async';img.src=item.thumbnail||(room==='paintings'?item.image:item.frontImage);img.alt=item.title+(item.placeholder?' – Ảnh giữ chỗ':'');img.addEventListener('error',()=>{img.alt='Không tải được ảnh · '+item.title;});button.append(img);
 const title=document.createElement('h3');title.textContent=item.title;const author=document.createElement('p');author.textContent=item.author;article.append(button,title,author);
 if(!state.fallback){const visit=document.createElement('button');visit.className='visit';visit.textContent='ĐẾN VỊ TRÍ TRƯNG BÀY ↗';visit.addEventListener('click',()=>{closeDialog($('#catalogDialog'));leaveHome();state.museum?.focusArtwork(item.id);});article.append(visit);}fragment.append(article);}
 $('#catalogList').replaceChildren(fragment);
}
const zoom={scale:1,x:0,y:0,pointers:new Map(),distance:0,startScale:1,startX:0,startY:0,center:null};
function applyZoom(){const r=$('#imageStage').getBoundingClientRect();const mx=r.width*(zoom.scale-1)/2,my=r.height*(zoom.scale-1)/2;zoom.x=Math.max(-mx,Math.min(mx,zoom.x));zoom.y=Math.max(-my,Math.min(my,zoom.y));$('#detailImage').style.transform=`translate(${zoom.x}px,${zoom.y}px) scale(${zoom.scale})`;$('#zoomReset').textContent=Math.round(zoom.scale*100)+'%';$('#zoomOut').disabled=zoom.scale<=1;$('#zoomIn').disabled=zoom.scale>=5;$('#imageStage').style.cursor=zoom.scale>1?'grab':'zoom-in';}
function resetZoom(){zoom.scale=1;zoom.x=0;zoom.y=0;zoom.pointers.clear();zoom.center=null;applyZoom();}
function changeZoom(factor){zoom.scale=Math.max(1,Math.min(5,zoom.scale*factor));applyZoom();}
$('#zoomIn').addEventListener('click',()=>changeZoom(1.35));$('#zoomOut').addEventListener('click',()=>changeZoom(1/1.35));$('#zoomReset').addEventListener('click',resetZoom);
const stage=$('#imageStage');
stage.addEventListener('wheel',e=>{e.preventDefault();changeZoom(e.deltaY<0?1.12:1/1.12);},{passive:false});
stage.addEventListener('dblclick',()=>zoom.scale>1?resetZoom():changeZoom(2));
const distance=()=>{const a=[...zoom.pointers.values()];return a.length>=2?Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y):0;};
stage.addEventListener('pointerdown',e=>{if(e.button>0)return;stage.setPointerCapture(e.pointerId);zoom.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(zoom.pointers.size===2){zoom.distance=distance();zoom.startScale=zoom.scale;}});
stage.addEventListener('pointermove',e=>{const prev=zoom.pointers.get(e.pointerId);if(!prev)return;zoom.pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(zoom.pointers.size>=2){zoom.scale=Math.max(1,Math.min(5,zoom.startScale*distance()/Math.max(zoom.distance,1)));}else if(zoom.scale>1){zoom.x+=e.clientX-prev.x;zoom.y+=e.clientY-prev.y;}applyZoom();});
const clearPointer=e=>{zoom.pointers.delete(e.pointerId);};stage.addEventListener('pointerup',clearPointer);stage.addEventListener('pointercancel',clearPointer);stage.addEventListener('lostpointercapture',clearPointer);
function getItem(id){for(const room of ['paintings','cards']){const item=state.data[room].find(a=>a.id===id);if(item)return{item,room};}return null;}
function openArtwork(id){const found=getItem(id);if(!found)return;state.selected=found;state.inside=false;$('#artTitle').textContent=found.item.title;$('#artAuthor').textContent=found.item.author;$('#artType').textContent=found.room==='paintings'?'PHÒNG TRANH':'THIỆP CHÚC MỪNG';$('#artBadge').textContent=found.item.placeholder?'ẢNH GIỮ CHỖ · CHƯA CÓ TÁC PHẨM THẬT':'TÁC PHẨM LỚP 6B';$('#flipCard').hidden=found.room!=='cards';openDialog($('#artDialog'));loadDetail();}
function loadDetail(){const {item,room}=state.selected;const image=$('#detailImage');resetZoom();image.style.visibility='hidden';$('#imageStatus').textContent='Đang tải ảnh…';image.alt=item.title+' – '+item.author+(room==='cards'?(state.inside?' – Mặt trong':' – Mặt ngoài'):'')+(item.placeholder?' – Ảnh giữ chỗ':'');
 image.onload=()=>{image.style.visibility='visible';$('#imageStatus').textContent='';};image.onerror=()=>{$('#imageStatus').textContent='Chưa tải được ảnh. Vui lòng kiểm tra tệp ảnh hoặc kết nối rồi mở lại tác phẩm.';};
 image.src=room==='paintings'?item.image:state.inside?item.insideImage:item.frontImage;$('#flipCard').replaceChildren(document.createTextNode(state.inside?'XEM MẶT NGOÀI ':'XEM MẶT TRONG '),Object.assign(document.createElement('span'),{textContent:'↻'}));
}
$('#flipCard').addEventListener('click',()=>{state.inside=!state.inside;loadDetail();});$('#closeArt').addEventListener('click',()=>closeDialog($('#artDialog')));
$('#artDialog').addEventListener('close',()=>{zoom.pointers.clear();$('#detailImage').removeAttribute('src');$('#detailImage').onload=null;$('#detailImage').onerror=null;state.selected=null;});
function fallback(message){state.fallback=true;document.body.classList.add('no-webgl');$('#fallbackNote').hidden=false;$('#loading').hidden=true;$('#start').firstChild.textContent='XEM DANH MỤC TÁC PHẨM ';$('#catalog').disabled=false;if(message)toast(message);if(!state.home)showCatalog();}
function validateData(data){for(const [room,count]of [['paintings',20],['cards',10]]){if(!Array.isArray(data[room])||data[room].length!==count)throw new Error('Danh mục cần đủ '+count+' mục ở '+room);for(const a of data[room]){if(!a.id||!a.title||!a.author||!a.position)throw new Error('Thiếu thông tin tác phẩm');for(const key of room==='paintings'?['image']:['frontImage','insideImage']){const url=new URL(a[key],location.href);if(!a[key]||url.origin!==location.origin||!url.pathname.startsWith(new URL('.',location.href).pathname))throw new Error('Đường dẫn ảnh phải ở trong website: '+a.id);}}}const ids=[...data.paintings,...data.cards].map(a=>a.id);if(new Set(ids).size!==30)throw new Error('ID tác phẩm bị trùng');}
async function init(){try{const res=await fetch('data/artworks.json');if(!res.ok)throw new Error('Không tải được danh mục');state.data=await res.json();validateData(state.data);try{state.museum=new Museum($('#museum'),state.data,{open:openArtwork,change:updateRoom,assetError:id=>toast('Không tải được ảnh thu nhỏ '+id+'. Hãy kiểm tra đường dẫn.'),unavailable:fallback});$('#loading').hidden=true;}catch(error){fallback('Không mở được không gian 3D. Mời bạn xem danh mục tác phẩm.');}
 // API chỉ đọc thông tin điều hướng, hỗ trợ kiểm thử tích hợp và bảo trì.
 window.exhibition={get museum(){return state.museum;},get data(){return state.data;},get selected(){return state.selected?.item.id||null;},get zoom(){return{scale:zoom.scale,x:zoom.x,y:zoom.y};}};
 }catch(error){$('#loading').textContent='Không tải được dữ liệu triển lãm: '+error.message;$('#start').disabled=true;}}
$$('.in-room').forEach(e=>e.inert=true);$('#museum').tabIndex=-1;
init();
