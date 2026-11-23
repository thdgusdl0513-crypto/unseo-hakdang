/* ====================== 마당 즐길거리: 구름 한마디 · 과자점 · 갤러리 · 자전거 · 사우나 ====================== */
(function(){
const c$=s=>document.querySelector(s);
const ce=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dk=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();};
/* ☁️ 구름 한마디 */
const CLOUD=['오늘 읽은 한 쪽이 내일의 나를 조금 더 넓게 만들어요.','천천히 가도 괜찮아요. 멈추지만 않으면 돼요.','당신이 웃으면 학당이 조금 더 환해져요.','어제보다 한 줄 더 읽었다면, 오늘은 충분히 잘한 날이에요.','힘들 땐 하늘 한 번 보고, 숨 한 번 크게 쉬어요.','작은 습관이 큰 마법이 돼요. 오늘도 한 걸음!','좋아하는 문장 하나를 마음에 넣고 다녀 봐요.','당신은 생각보다 훨씬 단단한 사람이에요.','실수해도 괜찮아요. 마법사도 처음엔 주문을 틀려요.','오늘의 나에게 "수고했어"라고 말해 줘요.','책장을 넘기는 소리는 마음이 자라는 소리예요.','친구에게 따뜻한 한마디를 건네 보는 건 어때요?','비 오는 날도, 맑은 날도 다 읽기 좋은 날이에요.','지금 이 순간에 집중하는 당신이 멋져요.','물 한 잔 마시고, 어깨 한 번 쭉 펴요!','꿈은 도망가지 않아요. 우리가 천천히 다가가면 돼요.','오늘 하루도 무사히 여기까지 온 것, 대단해요.','모르는 걸 아는 순간이 가장 똑똑해지는 순간이에요.','당신의 속도는 당신이 정해요.','좋은 일은 생각보다 가까이 와 있어요.','구름도 쉬어 가는데, 우리도 잠깐 쉬어 가요.','한 권을 다 못 읽어도 한 문장은 남아요.','웃는 얼굴로 읽은 책은 더 오래 기억나요.','오늘의 노력은 꼭 어딘가에서 반짝일 거예요.','누군가는 당신 덕분에 오늘 웃었을 거예요.','잘하고 있어요. 정말로요.','마음이 복잡할 땐 좋아하는 책을 펼쳐 봐요.','별은 어두울 때 더 잘 보여요. 힘든 날의 당신도요.','내일의 나에게 선물을 주는 마음으로 오늘을 보내요.','당신이 있어서 이 학당이 완성돼요. ☁️'];
let msgEl=null;
function cloudMsg(ci){const day=Math.floor(Date.now()/864e5);const t=CLOUD[(day*7+ci*13)%CLOUD.length];if(msgEl)msgEl.remove();msgEl=document.createElement('div');msgEl.id='cloudMsg';msgEl.className='paper';
  msgEl.innerHTML=`<div class="cmT">☁️ 오늘의 한마디</div><div class="cmB">${ce(t)}</div><small>다른 구름도 눌러 봐요</small>`;document.body.appendChild(msgEl);const el=msgEl;el.addEventListener('click',()=>el.remove());setTimeout(()=>{if(el.isConnected){el.classList.add('out');setTimeout(()=>el.remove(),400);}},7000);try{tinkle(1568,actx.currentTime,.08,master,.12);tinkle(2093,actx.currentTime+.1,.08,master,.1);}catch(e){}}
/* 🍭 과자점 */
const SNACKS=[['frog','🐸','개구리 초콜릿','먹으면 폴짝 뛰고 싶어져요',5,'jump'],['beans','🫘','온갖 맛 젤리빈','무슨 맛이 나올지 몰라요!',3,'surprise'],['star','⭐','반짝 별사탕','입 안에서 별이 톡톡',2,'heart'],['ggul','🍡','꿀떡','쫀득쫀득 달콤한 한 입',3,'heart'],['yakgwa','🍪','약과','바삭하고 촉촉한 꿀과자',4,'heart'],['dalgona','🍯','달고나','모양 따기 성공할까요?',4,'clap'],['pie','🥧','호박 파이','따끈따끈 가을 맛',6,'heart'],['sikhye','🥤','식혜','시원하고 달콤한 전통 음료',3,'wave'],['cotton','🍭','구름 솜사탕','구름을 한 입 먹은 기분',4,'jump'],['bungeo','🐟','붕어빵','겨울엔 역시 팥 붕어빵',3,'heart']];
const BEANS=['딸기 맛! 🍓','레몬 맛! 🍋','바닐라 맛 🍦','시금치 맛…?! 🥬','양말 맛?! 🧦','팝콘 맛 🍿','풀 맛… 🌿','초코 맛! 🍫','비누 맛?! 🫧','수박 맛! 🍉'];
function coins(){let m=0;try{(DATA.logs||[]).forEach(l=>{if(l.by===MYID)m+=(+l.sec||0)/60;});}catch(e){}const earned=Math.floor(m/10)+5;let wn=0;try{wn=window.__warnN?window.__warnN():0;}catch(e){}return Math.max(0,earned-LS.get('coinSpent',0)-wn*5);}
function renderShop(){const el=c$('#shopBody');if(!el)return;const inv=LS.get('snacks',{});const c=coins();
  el.innerHTML=`<div class="shopTop"><div class="shopCoin">🪙 <b>${c}</b> 엽전</div><small>공부·독서 10분마다 엽전 1개가 생겨요 (처음엔 5개 선물!)</small></div>
  <div class="shopGrid">${SNACKS.map(([id,ic,nm,ds,pr])=>`<div class="snk"><div class="snkI">${ic}</div><b>${nm}</b><small>${ds}</small><div class="snkB"><button class="primary" data-buy="${id}" ${c<pr?'disabled':''}>🪙${pr}</button>${inv[id]?`<button class="ghost" data-eat="${id}">먹기 ×${inv[id]}</button>`:''}</div></div>`).join('')}</div>`;}
function eat(id){const s=SNACKS.find(x=>x[0]===id);const inv=LS.get('snacks',{});if(!s||!inv[id])return;inv[id]--;if(!inv[id])delete inv[id];LS.set('snacks',inv);
  let line=`${s[1]} ${s[2]} 냠냠!`;if(id==='beans')line=`🫘 ${BEANS[Math.floor(Math.random()*BEANS.length)]}`;if(id==='dalgona')line=Math.random()<.5?'🍯 달고나 모양 따기 성공! ⭐':'🍯 앗, 달고나가 깨졌어요 😆';
  try{myBubble.set(line);}catch(e){}try{doEmote(s[5]==='surprise'?'cheer':s[5]);}catch(e){}toast(line);renderShop();}
/* 🖼️ 갤러리 */
let gTab='wall',pen={c:'#3a2a20',w:6,er:false},drawn=false;
const GCOL=['#3a2a20','#e0384a','#f28a2a','#f3c21f','#4caf50','#2a8ad8','#7a4ac8','#f48fb1','#8a5a3a','#ffffff'];
function gList(){return ((typeof DATA==='object'&&DATA.gallery)||[]).filter(g=>g&&typeof g.img==='string'&&g.img.startsWith('data:image/'));}
function renderGallery(){const el=c$('#galBody');if(!el)return;c$$('#galTabs button').forEach(b=>b.classList.toggle('on',b.dataset.gt===gTab));
  if(gTab==='draw'){el.innerHTML=`<div class="drawWrap"><canvas id="drawCv" width="480" height="480"></canvas></div>
    <div class="drawTools"><div class="dCols">${GCOL.map(c=>`<button data-pc="${c}" style="background:${c}" class="${pen.c===c&&!pen.er?'on':''}"></button>`).join('')}</div>
    <div class="dRow"><button class="ghost ${pen.w===3?'on':''}" data-pw="3">가늘게</button><button class="ghost ${pen.w===6?'on':''}" data-pw="6">보통</button><button class="ghost ${pen.w===14?'on':''}" data-pw="14">굵게</button><button class="ghost ${pen.er?'on':''}" data-er>🧽 지우개</button><button class="ghost" data-clr>🗑️</button></div>
    <input id="drawTitle" maxlength="20" placeholder="그림 제목 (20자까지)"><button class="primary" id="drawSave" style="width:100%;margin-top:6px">🖼️ 갤러리에 걸기</button></div>`;initCanvas();return;}
  const L=gList();el.innerHTML=L.length?`<div class="galGrid">${L.map(g=>`<div class="galItem"><img src="${g.img}" alt=""><b>${ce(g.title||'무제')}</b><small>${ce(g.by===MYID?(ST.nick||'나'):nameOf(g.by))} · ${ago(g.ts)}</small>${g.by===MYID||(typeof ADMIN_ON!=='undefined'&&ADMIN_ON)?`<button class="galDel" data-gdel="${ce(g.id)}">×</button>`:''}</div>`).join('')}</div>`:'<div class="empty">아직 걸린 그림이 없어요.<br>‘그리기’에서 첫 그림을 걸어 봐요 🎨</div>';}
function c$$(s){return [...document.querySelectorAll(s)];}
function initCanvas(){const cv=c$('#drawCv');if(!cv)return;const x=cv.getContext('2d');x.fillStyle='#fffaf0';x.fillRect(0,0,cv.width,cv.height);drawn=false;x.lineCap='round';x.lineJoin='round';let dn=false,lx=0,ly=0;
  const pos=e=>{const r=cv.getBoundingClientRect();return [(e.clientX-r.left)/r.width*cv.width,(e.clientY-r.top)/r.height*cv.height];};
  cv.addEventListener('pointerdown',e=>{dn=true;cv.setPointerCapture(e.pointerId);[lx,ly]=pos(e);x.beginPath();x.fillStyle=pen.er?'#fffaf0':pen.c;x.arc(lx,ly,(pen.er?pen.w*2.5:pen.w)/2,0,Math.PI*2);x.fill();drawn=true;e.preventDefault();});
  cv.addEventListener('pointermove',e=>{if(!dn)return;const [nx,ny]=pos(e);x.strokeStyle=pen.er?'#fffaf0':pen.c;x.lineWidth=pen.er?pen.w*2.5:pen.w;x.beginPath();x.moveTo(lx,ly);x.lineTo(nx,ny);x.stroke();lx=nx;ly=ny;e.preventDefault();});
  const up=()=>{dn=false;};cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);cv.style.touchAction='none';}
async function saveDrawing(){const cv=c$('#drawCv');if(!cv||!drawn){toast('먼저 그림을 그려 주세요 🎨');return;}const s=document.createElement('canvas');s.width=s.height=240;s.getContext('2d').drawImage(cv,0,0,240,240);const img=s.toDataURL('image/jpeg',.72);
  const title=(c$('#drawTitle').value||'').trim().slice(0,20);const ok=await addDoc('gallery',{img,title});if(ok){toast('🖼️ 갤러리에 그림을 걸었어요!');try{chime();}catch(e){}gTab='wall';renderGallery();update3D();}}
const texCache={};
function update3D(){try{if(!SP||!SP.gallery)return;const L=gList().slice(0,6);SP.gallery.forEach((pic,i)=>{const g=L[i];if(!g){pic.material.map=null;pic.material.color.set(0xf6efe0);pic.material.needsUpdate=true;return;}
  if(!texCache[g.id]){const im=new Image();const t=new THREE.Texture(im);im.onload=()=>{t.needsUpdate=true;};im.src=g.img;texCache[g.id]=t;}pic.material.map=texCache[g.id];pic.material.color.set(0xffffff);pic.material.needsUpdate=true;});}catch(e){}}
/* 🚲 자전거 */
let BIKE=null;
function bikeAvail(){const day=dk();const used=LS.get('bikeDay','')===day?LS.get('bikeUsed',0):0;const mins=todayTot(MYID,0);return {mins,earned:Math.floor(mins/30),used,left:Math.floor(mins/30)-used};}
function startBike(){if(BIKE){toast('이미 자전거를 타고 있어요 🚲');return;}
  if(ST.sitting>=0)standUp(true);const m=bikeMesh(0x3a8ad8);me.root.add(m);BIKE={m,t0:Date.now()};SPEED=8.2;window.__bike=1;pushPresence(true);
  const hud=document.createElement('div');hud.id='bikeHud';hud.className='paper';document.body.appendChild(hud);toast('🚲 씽씽! 자전거를 타요<small>내리고 싶으면 위쪽 ‘내리기’를 눌러요</small>');tickBike();}
function stopBike(msg){if(!BIKE)return;me.root.remove(BIKE.m);BIKE=null;SPEED=4.4;window.__bike=0;pushPresence(true);const h=c$('#bikeHud');if(h)h.remove();if(msg)toast(msg);}
function tickBike(){if(!BIKE)return;if(ST.space!=='campus'){stopBike('🚲 자전거는 보관대에 두고 들어갔어요');return;}const e=Date.now()-BIKE.t0;const h=c$('#bikeHud');if(h)h.innerHTML=`🚲 ${Math.floor(e/60000)}:${String(Math.floor(e/1000)%60).padStart(2,'0')} <button id="bikeStop">내리기</button>`;setTimeout(tickBike,500);}
document.addEventListener('click',e=>{if(e.target.closest('#bikeStop'))stopBike('🚲 자전거에서 내렸어요');});
/* 동작 */
window.__campusAct=function(a,h){if(a==='cloud'){cloudMsg(h.object.userData.ci||0);return true;}
  if(a==='shop'){renderShop();openSheet('shop');return true;}
  if(a==='gallery'){gTab='wall';renderGallery();openSheet('gallery');return true;}
  if(a==='bike'){startBike();return true;}
  if(a==='fish'){goFish();return true;}
  if(a==='sauna'){const P=me.root.position;const pp=navPath(P.x,P.z,17.95,15.2);path=pp.length?pp:[{x:17.95,z:15.2}];autoSit=-1;toast('🧖 사우나로 들어가요~');return true;}
  return false;};
document.addEventListener('click',async e=>{const t=e.target;if(!t.closest)return;
  if(t.closest('#shop')){const b=t.closest('[data-buy]');if(b){const s=SNACKS.find(x=>x[0]===b.dataset.buy);if(!s)return;if(coins()<s[4]){toast('엽전이 모자라요 🪙');return;}LS.set('coinSpent',LS.get('coinSpent',0)+s[4]);const inv=LS.get('snacks',{});inv[s[0]]=(inv[s[0]]||0)+1;LS.set('snacks',inv);toast(`${s[1]} ${s[2]}을(를) 샀어요!`);try{tinkle(1320,actx.currentTime,.06,master,.12);}catch(e){}renderShop();return;}
    const ea=t.closest('[data-eat]');if(ea){closeSheets();setTimeout(()=>eat(ea.dataset.eat),250);return;}return;}
  if(t.closest('#galTabs')){const b=t.closest('[data-gt]');if(b){gTab=b.dataset.gt;renderGallery();}return;}
  if(t.closest('#gallery')){const pc=t.closest('[data-pc]');if(pc){pen.c=pc.dataset.pc;pen.er=false;c$$('.dCols button').forEach(x=>x.classList.toggle('on',x===pc));c$$('[data-er]').forEach(x=>x.classList.remove('on'));return;}
    const pw=t.closest('[data-pw]');if(pw){pen.w=+pw.dataset.pw;c$$('[data-pw]').forEach(x=>x.classList.toggle('on',x===pw));return;}
    if(t.closest('[data-er]')){pen.er=!pen.er;t.closest('[data-er]').classList.toggle('on',pen.er);return;}
    if(t.closest('[data-clr]')){if(confirm('그림을 모두 지울까요?'))initCanvas();return;}
    if(t.closest('#drawSave')){saveDrawing();return;}
    const dl=t.closest('[data-gdel]');if(dl){if(confirm('이 그림을 내릴까요?')){await delDoc('gallery',dl.dataset.gdel);renderGallery();update3D();}return;}}});
window.__galRender=()=>{update3D();const g=c$('#gallery');if(g&&g.classList.contains('show')&&gTab==='wall')renderGallery();};
setInterval(update3D,4000);

/* ---------- 🎣 연못 낚시 ---------- */
const FISH=[ // [id, 이름, 이모지, 무게(확률), 최소cm, 최대cm, 등급]
 ['bungeo','붕어','🐟',30,12,30,'흔함'],['songsari','송사리','🐟',18,3,6,'흔함'],['mikku','미꾸라지','🐍',14,8,18,'흔함'],
 ['ingeo','잉어','🐠',12,30,70,'보통'],['geumbung','금붕어','🐠',8,6,15,'보통'],['megi','메기','🐡',6,30,80,'보통'],
 ['gamulchi','가물치','🐊',4,40,90,'귀함'],['ssogari','쏘가리','🐯',3,20,50,'귀함'],['bing','빙어','🐟',0,8,15,'겨울'],
 ['boots','낡은 장화','👢',5,0,0,'꽝'],['leaf','연잎','🍃',5,0,0,'꽝'],
 ['gold','황금 잉어','✨',1.2,60,120,'전설'],['dragon','용의 비늘','🐉',.5,0,0,'전설']];
let FISHING=null;
function fishSpot(){return {x:-11,z:12.7};}
function goFish(){if(ST.space!=='campus')return;if(FISHING){toast('이미 낚시 중이에요 🎣');return;}if(BIKE)stopBike();if(ST.sitting>=0)standUp(true);if(ST.sitting>=0)return;
  const sp=fishSpot(),P=me.root.position;if(Math.hypot(P.x-sp.x,P.z-sp.z)<.6){startFish();return;}
  const pp=navPath(P.x,P.z,sp.x,sp.z,true);path=pp.length?pp:[{x:sp.x,z:sp.z}];toast('🎣 낚시터로 가요~');
  const t0=Date.now();const w=setInterval(()=>{const Q=me.root.position;if(ST.space!=='campus'||Date.now()-t0>20000){clearInterval(w);return;}const last=path[path.length-1];if(!path.length||Math.hypot(Q.x-sp.x,Q.z-sp.z)<.45||(path.length===1&&last&&Math.hypot(Q.x-last.x,Q.z-last.z)<.3)){clearInterval(w);if(Math.hypot(Q.x-sp.x,Q.z-sp.z)<1.4){path=[];startFish();}}},200);}
function startFish(){const sp=fishSpot();const P=me.root.position;P.x=sp.x;P.z=sp.z;me.root.rotation.y=0;path=[];
  const rod=new THREE.Group();const rm=new THREE.Mesh(new THREE.CylinderGeometry(.018,.03,2.2,6),std(0x6a4a2a));rm.position.set(0,1.0,0);rod.add(rm);rod.position.set(.28,(me.h||1.3)*.45,-.15);rod.rotation.x=-1.0;me.root.add(rod);
  const bob=new THREE.Group();const b1=new THREE.Mesh(new THREE.SphereGeometry(.09,10,8),std(0xe83a3a));const b2=new THREE.Mesh(new THREE.SphereGeometry(.09,10,8,0,PI*2,0,PI/2),std(0xffffff));b2.position.y=.0;b1.add(b2);bob.add(b1);bob.position.set(-11+R(-.6,.6),.08,10.3+R(-.3,.3));scene.add(bob);
  const lg=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]);const line=new THREE.Line(lg,new THREE.LineBasicMaterial({color:0xf0f0f0,transparent:true,opacity:.75}));scene.add(line);
  const hud=document.createElement('div');hud.id='fishHud';hud.className='paper';document.body.appendChild(hud);
  FISHING={rod,bob,line,hud,state:'wait',bite:Date.now()+R(3500,9000),until:0,t0:Date.now(),n:0,x:P.x,z:P.z,iv:null};
  window.__fishing=1;try{pushPresence(true);}catch(e){}
  hud.innerHTML=`<div id="fishMsg">🎣 찌를 던졌어요… 찌가 <b>쑥</b> 들어가면 눌러요!</div><div class="fRow"><button id="fishHook" class="primary">챔질!</button><button id="fishBook">📖 도감</button><button id="fishStop">그만</button></div>`;
  FISHING.iv=setInterval(fishTick,50);}
function fishTick(){const F=FISHING;if(!F)return;const now=Date.now();const P=me.root.position;
  if(ST.space!=='campus'||Math.hypot(P.x-F.x,P.z-F.z)>.5||ST.sitting>=0){stopFish();return;}
  const tip=new THREE.Vector3(0,2.1,0);F.rod.children[0].localToWorld(tip.set(0,1.1,0));const bp=F.bob.position;const a=F.line.geometry.attributes.position;a.setXYZ(0,tip.x,tip.y,tip.z);a.setXYZ(1,bp.x,bp.y+.05,bp.z);a.needsUpdate=true;
  const t=(now-F.t0)/1000;
  if(F.state==='wait'){bp.y=.08+Math.sin(t*2.4)*.015;if(now>F.bite-900&&now<F.bite)bp.y+=Math.sin(t*30)*.02;if(now>=F.bite){F.state='bite';F.until=now+1800;fishMsg('❗ 지금! <b>챔질!</b>');const b=c$('#fishHook');if(b)b.classList.add('hot');try{if(navigator.vibrate)navigator.vibrate(120);}catch(e){}}}
  else if(F.state==='bite'){bp.y=-.04+Math.sin(t*18)*.03;if(now>F.until){F.state='wait';F.bite=now+R(3000,8000);const b=c$('#fishHook');if(b)b.classList.remove('hot');fishMsg('앗, 놓쳤어요… 😅 다시 기다려 봐요');}}
  else if(F.state==='reel'){bp.y=.08;}}
function fishMsg(h){const m=c$('#fishMsg');if(m)m.innerHTML=h;}
function pickFish(){const winter=(()=>{const m=new Date().getMonth()+1;return m===12||m<=2;})();const L=FISH.map(f=>[f,f[0]==='bing'?(winter?28:0):f[3]]);const tot=L.reduce((a,x)=>a+x[1],0);let r=Math.random()*tot;for(const [f,w] of L){r-=w;if(r<=0)return f;}return L[0][0];}
function hook(){const F=FISHING;if(!F)return;const b=c$('#fishHook');if(b)b.classList.remove('hot');
  if(F.state!=='bite'){fishMsg('아직이에요! 찌가 쑥 들어갈 때 눌러요 🙂');F.bite=Math.max(F.bite,Date.now()+1500);return;}
  F.state='reel';const f=pickFish();const cm=f[5]?Math.round(R(f[4],f[5])):0;const book=LS.get('fishBook',{});const prev=book[f[0]]||{n:0,max:0};const first=!prev.n;book[f[0]]={n:prev.n+1,max:Math.max(prev.max,cm)};LS.set('fishBook',book);F.n++;
  const junk=f[6]==='꽝',leg=f[6]==='전설';
  fishMsg(`${junk?'🤭':leg?'🌟':'🎉'} <b>${f[1]}</b>${cm?` ${cm}cm`:''}${junk?' … 꽝이에요!':' 낚았다!'}${first&&!junk?' <small>도감에 새로 올렸어요</small>':''}`);
  try{chime();}catch(e){}if(leg){try{toast(`🌟 전설의 ${f[1]}을(를) 낚았어요!`);}catch(e){}}
  const pop=new THREE.Group();const lb=makeLabel(f[2]+' '+f[1]+(cm?` ${cm}cm`:''));lb.sprite.scale.set(2.4,.5,1);pop.add(lb.sprite);pop.position.set(F.bob.position.x,1.2,F.bob.position.z);scene.add(pop);
  let k=0;const up=setInterval(()=>{k++;pop.position.y+=.03;if(k>40){clearInterval(up);scene.remove(pop);}},30);
  setTimeout(()=>{if(FISHING!==F)return;F.state='wait';F.bite=Date.now()+R(3500,9000);F.bob.position.set(-11+R(-.6,.6),.08,10.3+R(-.3,.3));fishMsg('🎣 다시 던졌어요… 찌를 잘 봐요!');},1800);}
function stopFish(){const F=FISHING;if(!F)return;FISHING=null;clearInterval(F.iv);me.root.remove(F.rod);scene.remove(F.bob,F.line);F.hud.remove();window.__fishing=0;try{pushPresence(true);}catch(e){}if(F.n)toast(`🎣 오늘 ${F.n}번 낚았어요!<small>📖 도감은 낚시터에서 볼 수 있어요</small>`);}
function fishBookHTML(){const book=LS.get('fishBook',{});const got=FISH.filter(f=>book[f[0]]).length;
  return `<div class="fbHead">📖 학당 연못 도감 <small>${got}/${FISH.length}</small><button id="fbX">×</button></div><div class="fbGrid">${FISH.map(f=>{const b=book[f[0]];return `<div class="fb ${b?'':'no'}"><i>${b?f[2]:'❔'}</i><b>${b?f[1]:'???'}</b><small>${b?`${f[6]} · ${b.n}마리${b.max?` · 최대 ${b.max}cm`:''}`:f[6]}</small></div>`;}).join('')}</div>`;}
document.addEventListener('click',e=>{const t=e.target;if(t.closest('#fishHook')){hook();return;}if(t.closest('#fishStop')){stopFish();return;}
  if(t.closest('#fishBook')){let el=c$('#fishBk');if(!el){el=document.createElement('div');el.id='fishBk';el.className='paper';document.body.appendChild(el);}el.innerHTML=fishBookHTML();return;}
  if(t.closest('#fbX')){const el=c$('#fishBk');if(el)el.remove();}});
(function(){const st=document.createElement('style');st.textContent=`#fishHud{position:fixed;left:50%;transform:translateX(-50%);bottom:calc(86px + env(safe-area-inset-bottom));z-index:9;padding:10px 12px;border-radius:18px;width:min(360px,92vw);text-align:center;box-shadow:0 6px 20px rgba(0,0,0,.2)}#fishMsg{font-size:15px;margin-bottom:8px;line-height:1.4}#fishMsg small{display:block;font-size:12px;opacity:.75}
#fishHud .fRow{display:flex;gap:6px}#fishHud button{font:inherit;border:0;border-radius:12px;padding:9px 10px;cursor:pointer;background:#f3e6d0;font-size:14px}#fishHook{flex:1;font-size:17px!important;font-weight:800;background:#d98a4a!important;color:#fff}#fishHook.hot{background:#e8443a!important;animation:fh .35s ease-in-out infinite alternate}@keyframes fh{to{transform:scale(1.07)}}
#fishBk{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:12;width:min(380px,92vw);max-height:76vh;overflow:auto;border-radius:20px;padding:14px;box-shadow:0 10px 30px rgba(0,0,0,.3)}.fbHead{font-weight:800;font-size:17px;display:flex;align-items:center;gap:6px;margin-bottom:8px}.fbHead small{font-weight:400;opacity:.7}.fbHead button{margin-left:auto;border:0;background:none;font-size:22px;cursor:pointer}
.fbGrid{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}.fb{background:rgba(255,255,255,.6);border-radius:12px;padding:8px 4px;text-align:center;line-height:1.25}.fb i{font-style:normal;font-size:28px;display:block}.fb b{display:block;font-size:13px}.fb small{font-size:10.5px;opacity:.75}.fb.no{opacity:.55}`;document.head.appendChild(st);})();

})();
