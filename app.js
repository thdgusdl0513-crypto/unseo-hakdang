/* 송현학당 · app: state, data, room, UI, loop */
const STUDY=['basics','potion','herbs','training','library'];
const ST={look:lookParse(LS.get('look','')),space:'campus',pet:LS.get('pet','none'),fx:LS.get('fx','base'),nick:LS.get('nick',''),avatar:LS.get('avatar',null),seasonPick:LS.get('seasonPick','auto'),todPick:LS.get('todPick','auto'),sitting:-1};
function curMonth(){return ST.seasonPick==='auto'?new Date().getMonth()+1:+ST.seasonPick;}
function curTod(){return ST.todPick==='auto'?autoTod():ST.todPick;}
if(ST.avatar==='shiba'){ST.avatar='sapsal';LS.set('avatar','sapsal');}
/* ---------- real weather (Open-Meteo, no key) ---------- */
const CITIES={'서울':[37.5665,126.978],'인천':[37.456,126.705],'수원':[37.263,127.029],'천안':[36.815,127.114],'아산':[36.79,127.002],'청양':[36.459,126.802],'대전':[36.351,127.385],'대구':[35.871,128.601],'광주':[35.16,126.851],'부산':[35.18,129.076],'강릉':[37.752,128.876],'제주':[33.499,126.531]};
let WX=LS.get('wxCache',null);ST.wxPick=LS.get('wxPick','auto');
function wxKind(c){if(c==null)return null;if(c===0||c===1)return 'clear';if(c===2||c===3)return 'cloudy';if(c===45||c===48)return 'fog';if(c>=95)return 'storm';if((c>=71&&c<=77)||c===85||c===86)return 'snow';if((c>=51&&c<=67)||(c>=80&&c<=82))return 'rain';return 'cloudy';}
const WX_LABEL={clear:['☀️','맑음'],cloudy:['☁️','흐림'],fog:['🌫️','안개'],rain:['🌧️','비'],snow:['🌨️','눈'],storm:['⛈️','뇌우']};
function applyWx(S){if(ST.wxPick==='off'||!WX||Date.now()-WX.t>3*3600e3)return S;const k=WX.kind;S.wx=k;S.temp=WX.temp;
  const sky=new THREE.Color(S.sky);
  if(k==='rain'||k==='storm'){S.rain=true;S.wxSnow=false;sky.lerp(new THREE.Color(S.night?0x0c1216:0x8a96a0),k==='storm'?.75:.55);S.fogD=.03;S.hemi*=.8;S.sun*=.45;}
  else if(k==='snow'){S.rain=false;S.wxSnow=true;sky.lerp(new THREE.Color(S.night?0x1a2230:0xd4dce4),.5);S.sun*=.6;}
  else if(k==='fog'){S.rain=false;sky.lerp(new THREE.Color(S.night?0x2a3034:0xd8dcd8),.7);S.fogD=.05;S.sun*=.5;}
  else if(k==='cloudy'){S.rain=false;sky.lerp(new THREE.Color(S.night?0x1a2026:0xb4bcc2),.4);S.sun*=.7;}
  else{S.rain=false;}
  S.sky=sky.getHex();return S;}
function curSeason(){return applyWx(makeSeason(curMonth(),curTod()));}
async function wxCoords(){const pick=ST.wxPick;if(CITIES[pick])return {lat:CITIES[pick][0],lon:CITIES[pick][1],name:pick};
  const geo=await new Promise(res=>{if(!navigator.geolocation)return res(null);let done=false;const to=setTimeout(()=>{if(!done){done=true;res(null);}},6000);try{navigator.geolocation.getCurrentPosition(p=>{if(!done){done=true;clearTimeout(to);res(p);}},()=>{if(!done){done=true;clearTimeout(to);res(null);}},{maximumAge:3600e3,timeout:6000});}catch(e){res(null);}});
  return geo?{lat:geo.coords.latitude,lon:geo.coords.longitude,name:'내 위치'}:{lat:CITIES['서울'][0],lon:CITIES['서울'][1],name:'서울'};}
async function fetchWx(force){if(ST.wxPick==='off'){renderWxState();return;}if(!force&&WX&&Date.now()-WX.t<30*60e3&&WX.pick===ST.wxPick){renderWxState();return;}
  try{const c=await wxCoords();const r=await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat.toFixed(3)}&longitude=${c.lon.toFixed(3)}&current=weather_code,temperature_2m&timezone=Asia%2FSeoul`);if(!r.ok)throw 0;const d=await r.json();const cur=d.current||{};
    const prev=WX&&WX.kind;WX={t:Date.now(),kind:wxKind(cur.weather_code),code:cur.weather_code,temp:Math.round(cur.temperature_2m),name:c.name,pick:ST.wxPick};LS.set('wxCache',WX);renderWxState();if(prev!==WX.kind||force)rebuildSeason();else updateSeasonChip();}
  catch(e){renderWxState('날씨를 불러오지 못했어요 · 계절 풍경만 보여요');}}
function renderWxState(msg){const el=$('#wxState');if(!el)return;if(ST.wxPick==='off'){el.textContent='날씨 연동 꺼짐 · 달력의 계절 풍경만 보여요';return;}if(msg){el.textContent=msg;return;}if(!WX){el.textContent='날씨를 불러오는 중…';return;}const L=WX_LABEL[WX.kind]||['',''];const tm=new Date(WX.t);el.textContent=`${WX.name} · ${L[0]} ${L[1]} · ${WX.temp}°C (${tm.getHours()}:${String(tm.getMinutes()).padStart(2,'0')} 기준)`;}
SEASON=curSeason();

/* ---------- player ---------- */
let me=makeAvatar(ST.avatar||'girl',ST.look);scene.add(me.root);
let myPet=null;function setPet(id,quiet){if(myPet){scene.remove(myPet.root);myPet=null;}ST.pet=PETMAP[id]?id:'none';LS.set('pet',ST.pet);myPet=makePet(ST.pet);if(myPet){const p=me.root.position;myPet.root.position.set(p.x+1,0,p.z+.7);scene.add(myPet.root);}if(!quiet){saveMember();pushPresence(true);}}
setPet(ST.pet,true);
/* ---------- 유리 시계 (집중 시간, 초 단위) ---------- */
const GC_FONT='600 150px ui-rounded, "SF Pro Rounded", "Arial Rounded MT Bold", "Apple SD Gothic Neo", system-ui, sans-serif';
const CLOCKC=[['유리',null],['벚꽃','#ff8fbd'],['하늘','#5ab8ff'],['민트','#3fd6a4'],['레몬','#ffcf2a'],['라벤더','#a07aff'],['주홍','#ff7a45'],['먹','#2e2e3a']];
function makeGlassClock(){const c=document.createElement('canvas');c.width=640;c.height=300;const t=new THREE.CanvasTexture(c);
  const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false,fog:false}));s.renderOrder=12;s.scale.set(2.18,1.02,1);s.visible=false;
  const G={sprite:s,key:null,set(tx,sub,cc){cc=+cc||0;const k=tx+'|'+sub+'|'+cc;if(k===G.key)return;const CC=CLOCKC[cc]&&CLOCKC[cc][1];G.key=k;const g=c.getContext('2d');const W=c.width,H=c.height;g.clearRect(0,0,W,H);
    // 숫자 (세로로 길쭉하게)
    const sx=.78;g.save();g.translate(W/2,150);sub='';g.scale(sx,1.08);g.font=GC_FONT;g.textAlign='center';g.textBaseline='middle';
    g.shadowColor='rgba(40,20,8,.55)';g.shadowBlur=18;g.shadowOffsetY=6;g.fillStyle='rgba(255,255,255,.6)';g.fillText(tx,0,0);g.shadowColor='transparent';
    const fg=g.createLinearGradient(0,-70,0,70);if(CC){const [r0,g0,b0]=[1,3,5].map(i=>parseInt(CC.slice(i,i+2),16));const L=(a,t)=>`rgba(${Math.round(r0+(255-r0)*t)},${Math.round(g0+(255-g0)*t)},${Math.round(b0+(255-b0)*t)},${a})`;fg.addColorStop(0,L(.98,.55));fg.addColorStop(.42,L(.92,.1));fg.addColorStop(.58,L(.88,0));fg.addColorStop(1,L(.96,.4));}else{fg.addColorStop(0,'rgba(255,255,255,.98)');fg.addColorStop(.42,'rgba(255,250,240,.72)');fg.addColorStop(.58,'rgba(240,236,232,.55)');fg.addColorStop(1,'rgba(255,255,255,.92)');}g.fillStyle=fg;g.fillText(tx,0,0);
    if(!CC){g.globalCompositeOperation='source-atop';}const ir=g.createLinearGradient(-260,0,260,0);ir.addColorStop(0,'rgba(255,170,190,.30)');ir.addColorStop(.35,'rgba(255,220,140,.30)');ir.addColorStop(.65,'rgba(160,230,255,.28)');ir.addColorStop(1,'rgba(220,180,255,.30)');if(!CC){g.fillStyle=ir;g.fillRect(-400,-120,800,240);}
    g.globalCompositeOperation='source-over';g.lineWidth=3.2;g.strokeStyle='rgba(255,255,255,.95)';g.strokeText(tx,0,0);g.lineWidth=1.4;g.strokeStyle='rgba(120,90,70,.35)';g.strokeText(tx,1.5,2.5);g.restore();
    if(sub){g.font='600 34px '+FS;g.textAlign='center';g.textBaseline='middle';g.fillStyle='rgba(70,40,20,.75)';g.shadowColor='rgba(255,255,255,.8)';g.shadowBlur=6;g.fillText(sub,W/2,252);}
    t.needsUpdate=true;}};return G;}
const fmtClock=ms=>{const s=Math.max(0,Math.floor(ms/1000)),h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return h?`${h}:${String(m).padStart(2,'0')}:${String(x).padStart(2,'0')}`:`${m}:${String(x).padStart(2,'0')}`;};
const myClock=makeGlassClock();scene.add(myClock.sprite);
const myLabel=makeLabel('나',{bg:'rgba(255,226,180,.95)',line:'rgba(200,120,60,.9)',fg:'#6a3010'});scene.add(myLabel.sprite);
const myBubble=makeBubble();scene.add(myBubble.sprite);
function setAvatar(id){const p=me.root.position.clone(),r=me.root.rotation.y;scene.remove(me.root);me=makeAvatar(id,ST.look);me.root.position.copy(p);me.root.rotation.y=r;scene.add(me.root);ST.avatar=id;LS.set('avatar',id);saveMember();updateMe();pushPresence(true);if(ST.sitting>=0)placeOnSeat();}

/* ---------- spaces ---------- */
let SP=null;const cache={};
function getSpace(id){if(!cache[id])cache[id]=id==='campus'?buildCampus(SEASON):buildRoom(id,SEASON);return cache[id];}
function applyEnv(){const indoor=ST.space!=='campus';const c=indoor?(ST.space==='herbs'?new THREE.Color(SEASON.sky).lerp(new THREE.Color(0x3a5a3a),.5).getHex():0x1c1612):SEASON.sky;scene.background=new THREE.Color(c);scene.fog.color.set(c);scene.fog.density=indoor?.012:SEASON.fogD;
  hemi.intensity=indoor?.62:SEASON.hemi;hemi.color.set(indoor?0xffe6c8:0x8aa6c0);sun.intensity=indoor?.35:SEASON.sun;sun.color.set(indoor?0xffe0c0:SEASON.sunColor);}
let doorCool=0;
/* ---------- 조명 켜고 끄기 ---------- */
const LIGHTS=Object.assign({yard:true,desk:true},LS.get('lights',{}));const LKIND={campus:'yard',library:'desk'};const lkOf=sp=>LKIND[sp]||(sp&&sp!=='campus'?'room_'+sp:null);
function applyLights(){if(typeof SP==='undefined'||!SP)return;const rk=lkOf(ST.space);const roomOff=rk&&rk.startsWith('room_')&&LIGHTS[rk]===false;if(rk&&rk.startsWith('room_')){hemi.intensity=roomOff?.26:.62;sun.intensity=roomOff?.1:.35;}SP.G.traverse(o=>{if(rk&&rk.startsWith('room_')&&o.isPointLight){if(o.userData.base==null)o.userData.base=o.intensity;o.intensity=roomOff?o.userData.base*.1:o.userData.base;return;}if(rk&&rk.startsWith('room_')&&o.userData&&o.userData.lamp){if(o.isSprite)o.visible=!roomOff;else if(o.material&&'emissiveIntensity' in o.material){if(o.userData.e0==null)o.userData.e0=o.material.emissiveIntensity;o.material.emissiveIntensity=roomOff?0:o.userData.e0;}return;}const k=o.userData&&o.userData.lamp;if(!k)return;const on=LIGHTS[k]!==false;
  if(o.isPointLight){if(o.userData.base==null)o.userData.base=o.intensity;o.intensity=on?o.userData.base:o.userData.base*(o.userData.dim||0);}
  else if(o.isSprite)o.visible=on;else if(o.material&&'emissiveIntensity' in o.material){if(o.userData.e0==null)o.userData.e0=o.material.emissiveIntensity;o.material.emissiveIntensity=on?o.userData.e0:0;}});
  const b=document.getElementById('lightBtn');if(b){const k=lkOf(ST.space);b.hidden=!k;if(k){const on=LIGHTS[k]!==false;b.classList.toggle('off',!on);b.textContent=k==='yard'?'🏮':'💡';b.setAttribute('aria-label',(k==='yard'?'마당 등불':k==='desk'?'책상 조명':'방 조명')+(on?' 끄기':' 켜기'));}}}
document.getElementById('lightBtn').addEventListener('click',()=>{const k=lkOf(ST.space);if(!k)return;LIGHTS[k]=LIGHTS[k]===false;LS.set('lights',LIGHTS);applyLights();
  try{if(actx&&SND.on){const t=actx.currentTime;tinkle(LIGHTS[k]?1320:660,t,.05,master,.12);tinkle(LIGHTS[k]?1760:440,t+.06,.04,master,.1);}}catch(e){}
  const nm=k==='yard'?'마당 등불':k==='desk'?'책상 조명':(ROOMS[ST.space]?ROOMS[ST.space].name.split('·')[0].trim():'방')+' 조명';toast(LIGHTS[k]?`${k==='yard'?'🏮':'💡'} ${nm}을 켰어요`:`🌙 ${nm}을 껐어요`);});
function enterSpace(id,at,instant){const go=()=>{unfadeAll();if(SP)scene.remove(SP.G);standUp(true);ST.space=id;SP=getSpace(id);SP.id=id;scene.add(SP.G);buildNav();const p=at||SP.spawn;me.root.position.set(p.x,0,p.z);me.root.rotation.y=0;if(myPet)myPet.root.position.set(p.x+1,0,p.z+.7);path=[];doorCool=1.2;applyEnv();updateZone();refreshRemotes();updateBoard3D();applyLights();pushPresence(true);updateCam(0,true);setFooter();soundForSpace();};
  if(instant){go();return;}const f=$('#fade');f.classList.add('on');setTimeout(()=>{go();setTimeout(()=>f.classList.remove('on'),60);},380);}
function rebuildSeason(){SEASON=curSeason();Object.keys(cache).forEach(k=>delete cache[k]);const p=me.root.position;enterSpace(ST.space,{x:p.x,z:p.z},true);updateSeasonChip();}

/* ---------- movement ---------- */
const keys={up:0,down:0,left:0,right:0};let path=[];
/* ---------- 길찾기 · 가구 충돌 ---------- */
function buildNav(){if(SP.nav)return;const b=SP.bounds,cs=.2;const W=Math.ceil((b[1]-b[0])/cs)+1,H=Math.ceil((b[3]-b[2])/cs)+1;const g=new Uint8Array(W*H);
  const mark=(x0,x1,z0,z1)=>{const i0=Math.max(0,Math.floor((x0-b[0])/cs)),i1=Math.min(W-1,Math.ceil((x1-b[0])/cs)),j0=Math.max(0,Math.floor((z0-b[2])/cs)),j1=Math.min(H-1,Math.ceil((z1-b[2])/cs));for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const x=b[0]+i*cs,z=b[2]+j*cs;if(x>=x0&&x<=x1&&z>=z0&&z<=z1)g[j*W+i]=1;}};
  const circ=(cx,cz,r,v)=>{const i0=Math.max(0,Math.floor((cx-r-b[0])/cs)),i1=Math.min(W-1,Math.ceil((cx+r-b[0])/cs)),j0=Math.max(0,Math.floor((cz-r-b[2])/cs)),j1=Math.min(H-1,Math.ceil((cz+r-b[2])/cs));for(let j=j0;j<=j1;j++)for(let i=i0;i<=i1;i++){const x=b[0]+i*cs,z=b[2]+j*cs;if((x-cx)**2+(z-cz)**2<=r*r)g[j*W+i]=v;}};
  const R=.22;
  if(SP.id!=='campus'&&ST.space!=='campus'){SP.G.updateMatrixWorld(true);const bx=new THREE.Box3();SP.G.traverse(o=>{if(!o.isMesh||!o.visible||(o.userData&&o.userData.walk))return;const m=o.material;if(m&&m.transparent&&m.opacity<.5)return;
    bx.setFromObject(o);if(bx.isEmpty())return;const sx=bx.max.x-bx.min.x,sz=bx.max.z-bx.min.z;if(bx.min.y>1.05||bx.max.y<.3)return;if(sx>5.5||sz>5.5||(sx<.05&&sz<.05))return;
    const cx=(bx.min.x+bx.max.x)/2,cz=(bx.min.z+bx.max.z)/2;if(cx<b[0]-.2||cx>b[1]+.2||cz<b[2]-.2||cz>b[3]+.2)return;if(SP.seats.some(s=>Math.hypot(s.x-cx,s.z-cz)<.5&&sx<1.1&&sz<1.1))return;
    mark(bx.min.x-R,bx.max.x+R,bx.min.z-R,bx.max.z+R);});}
  (SP.blocks||[]).forEach(r=>mark(r[0]-R,r[1]+R,r[2]-R,r[3]+R));SP.obs.forEach(o=>circ(o.x,o.z,o.r,1));
  SP.seats.forEach(s=>{if(!s.spa)circ(s.x,s.z,.42,0);});(SP.clears||[]).forEach(r=>{for(let j=0;j<H;j++)for(let i=0;i<W;i++){const x=b[0]+i*cs,z=b[2]+j*cs;if(x>=r[0]&&x<=r[1]&&z>=r[2]&&z<=r[3])g[j*W+i]=0;}});SP.doors.forEach(d=>circ(d.x,d.z,1.15,0));if(SP.spawn)circ(SP.spawn.x,SP.spawn.z,.5,0);
  SP.nav={g,W,H,cs,b};}
function blockedAt(x,z){const N=SP&&SP.nav;const b=SP.bounds;if(x<b[0]||x>b[1]||z<b[2]||z>b[3])return true;if(!N)return false;const i=Math.round((x-b[0])/N.cs),j=Math.round((z-b[2])/N.cs);return !!N.g[j*N.W+i];}
function valid(x,z){return !blockedAt(x,z);}
function validMove(px,pz,nx,nz){const b=SP.bounds;if(nx<b[0]||nx>b[1]||nz<b[2]||nz>b[3])return false;if(!blockedAt(nx,nz))return true;return blockedAt(px,pz);}
function losClear(ax,az,bx,bz){const d=Math.hypot(bx-ax,bz-az),n=Math.ceil(d/.08);for(let k=1;k<=n;k++){const t=k/n;if(blockedAt(ax+(bx-ax)*t,az+(bz-az)*t))return false;}return true;}
function navPath(sx,sz,tx,tz,forceNear){const N=SP&&SP.nav;if(!N)return [{x:tx,z:tz}];const {g,W,H,cs,b}=N;const ci=x=>Math.max(0,Math.min(W-1,Math.round((x-b[0])/cs))),cj=z=>Math.max(0,Math.min(H-1,Math.round((z-b[2])/cs)));
  const near=(k0,pref)=>{const i0=k0%W,j0=k0/W|0;let best=-1,bd=1e9;for(let r=1;r<30&&best<0;r++)for(let j=j0-r;j<=j0+r;j++)for(let i=i0-r;i<=i0+r;i++){if(i<0||j<0||i>=W||j>=H)continue;const k=j*W+i;if(g[k])continue;const d=(i-i0)**2+(j-j0)**2+(pref?((b[0]+i*cs-pref.x)**2+(b[2]+j*cs-pref.z)**2)*.15/(cs*cs):0);if(d<bd){bd=d;best=k;}}return best;};
  let s=cj(sz)*W+ci(sx),t=cj(tz)*W+ci(tx);const pre=[];let exact=true;
  if(g[s]){const k=near(s);if(k<0)return [{x:tx,z:tz}];s=k;pre.push({x:b[0]+(k%W)*cs,z:b[2]+(k/W|0)*cs});}
  if(g[t]||forceNear){g[t]=g[t]||2;const k=near(t,{x:sx,z:sz});if(g[t]===2)g[t]=0;if(k<0)return [];t=k;exact=false;}
  if(s===t)return pre.concat([{x:exact?tx:b[0]+(t%W)*cs,z:exact?tz:b[2]+(t/W|0)*cs}]);
  const G=new Float32Array(W*H).fill(1e9),from=new Int32Array(W*H).fill(-1),closed=new Uint8Array(W*H);const ti=t%W,tj=t/W|0;const hh=k=>{const i=k%W,j=k/W|0;const dx=Math.abs(i-ti),dz=Math.abs(j-tj);return Math.max(dx,dz)+.414*Math.min(dx,dz);};
  const heap=[];const push=(k,f)=>{heap.push([f,k]);let i=heap.length-1;while(i>0){const p=(i-1)>>1;if(heap[p][0]<=heap[i][0])break;[heap[p],heap[i]]=[heap[i],heap[p]];i=p;}};
  const pop=()=>{const top=heap[0],last=heap.pop();if(heap.length){heap[0]=last;let i=0;for(;;){const l=2*i+1,r=l+1;let m=i;if(l<heap.length&&heap[l][0]<heap[m][0])m=l;if(r<heap.length&&heap[r][0]<heap[m][0])m=r;if(m===i)break;[heap[m],heap[i]]=[heap[i],heap[m]];i=m;}}return top;};
  G[s]=0;push(s,hh(s));let found=false,it=0;
  while(heap.length&&it++<60000){const [,k]=pop();if(closed[k])continue;closed[k]=1;if(k===t){found=true;break;}const i=k%W,j=k/W|0;
    for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){if(!di&&!dj)continue;const ni=i+di,nj=j+dj;if(ni<0||nj<0||ni>=W||nj>=H)continue;const nk=nj*W+ni;if(g[nk]||closed[nk])continue;if(di&&dj&&(g[j*W+ni]||g[nj*W+i]))continue;const ng=G[k]+(di&&dj?1.414:1);if(ng<G[nk]){G[nk]=ng;from[nk]=k;push(nk,ng+hh(nk));}}}
  if(!found){const par=new Int32Array(W*H).fill(-2);par[s]=-1;const q=[s];let best=s,bd=1e9;const ti0=t%W,tj0=t/W|0;
    for(let qi=0;qi<q.length;qi++){const k=q[qi];const i=k%W,j=k/W|0;const dd=(i-ti0)**2+(j-tj0)**2;if(dd<bd){bd=dd;best=k;}
      for(let dj=-1;dj<=1;dj++)for(let di=-1;di<=1;di++){if(!di&&!dj)continue;const ni=i+di,nj=j+dj;if(ni<0||nj<0||ni>=W||nj>=H)continue;const nk=nj*W+ni;if(g[nk]||par[nk]!==-2)continue;if(di&&dj&&(g[j*W+ni]||g[nj*W+i]))continue;par[nk]=k;q.push(nk);}}
    if(best===s||bd>36)return [];for(let k=best;k!==-1;k=par[k])from[k]=par[k];t=best;exact=false;}
  const cells=[];for(let k=t;k>=0;k=from[k]){cells.push(k);if(k===s)break;}cells.reverse();
  const pts=cells.map(k=>({x:b[0]+(k%W)*cs,z:b[2]+(k/W|0)*cs}));if(exact)pts[pts.length-1]={x:tx,z:tz};
  const out=[];let a={x:sx,z:sz};if(pre.length)a=pre[0];let i=0;while(i<pts.length-1){let j=pts.length-1;while(j>i+1&&!losClear(a.x,a.z,pts[j].x,pts[j].z))j--;out.push(pts[j]);a=pts[j];i=j;}if(!out.length)out.push(pts[pts.length-1]);
  return pre.concat(out);}
let STEER=null;
const km={ArrowUp:'up',KeyW:'up',ArrowDown:'down',KeyS:'down',ArrowLeft:'left',KeyA:'left',ArrowRight:'right',KeyD:'right'};
addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;if(km[e.code]){keys[km[e.code]]=1;path=[];poseUntil=0;e.preventDefault();}});
addEventListener('keyup',e=>{if(km[e.code])keys[km[e.code]]=0;});
const ptrs=new Map();let pinch0=0,dist0=0,down=null;
function steerAt(cx,cy){const r=canvas.getBoundingClientRect();ndc.set((cx-r.left)/r.width*2-1,-(cy-r.top)/r.height*2+1);ray.setFromCamera(ndc,camera);if(!ray.ray.intersectPlane(gplane,hitP))return;const b=SP.bounds;STEER={x:Math.max(b[0],Math.min(b[1],hitP.x)),z:Math.max(b[2],Math.min(b[3],hitP.z))};path=[];autoSit=-1;poseUntil=0;tapRing.position.set(STEER.x,.05,STEER.z);tapT=.6;}
canvas.addEventListener('pointerdown',e=>{ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});if(ptrs.size===1){down={x:e.clientX,y:e.clientY,t:performance.now()};const dd=down;dd.hold=setTimeout(()=>{if(down===dd&&!dd.drag&&ptrs.size===1){dd.walk=true;steerAt(dd.x,dd.y);}},300);}else{STEER=null;}if(ptrs.size===2){const a=[...ptrs.values()];pinch0=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y);dist0=camDist;down=null;}});
canvas.addEventListener('pointermove',e=>{if(!ptrs.has(e.pointerId))return;const pv=ptrs.get(e.pointerId);if(ptrs.size===1&&down&&down.walk){steerAt(e.clientX,e.clientY);ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});return;}if(ptrs.size===1&&down){const tx=e.clientX-down.x,ty=e.clientY-down.y;if(down.drag||tx*tx+ty*ty>196){down.drag=true;camYaw-=(e.clientX-pv.x)*.007;pitch=Math.max(.08,Math.min(1.25,pitch+(e.clientY-pv.y)*.004));poseUntil=0;}}ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});if(ptrs.size===2&&pinch0){const a=[...ptrs.values()];camDist=clampD(dist0*pinch0/Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y));}});
canvas.addEventListener('pointerup',e=>{ptrs.delete(e.pointerId);if(ptrs.size<2)pinch0=0;if(down)clearTimeout(down.hold);if(down&&down.walk){STEER=null;down=null;return;}if(down&&ptrs.size===0&&!down.drag){const dx=e.clientX-down.x,dy=e.clientY-down.y;if(dx*dx+dy*dy<144&&performance.now()-down.t<450)onTap(e.clientX,e.clientY);}if(!ptrs.size)down=null;});
canvas.addEventListener('pointercancel',e=>{ptrs.delete(e.pointerId);if(down)clearTimeout(down.hold);down=null;STEER=null;});
canvas.addEventListener('wheel',e=>{e.preventDefault();camDist=clampD(camDist+e.deltaY*.01);},{passive:false});
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2(),gplane=new THREE.Plane(new THREE.Vector3(0,1,0),0),hitP=new THREE.Vector3();
const tapRing=new THREE.Mesh(new THREE.RingGeometry(.3,.4,32),new THREE.MeshBasicMaterial({color:0xf2dda2,transparent:true,opacity:0,depthWrite:false}));tapRing.rotation.x=-PI/2;scene.add(tapRing);let tapT=0,autoSit=-1;
function onTap(cx,cy){poseUntil=0;const r=canvas.getBoundingClientRect();ndc.set((cx-r.left)/r.width*2-1,-(cy-r.top)/r.height*2+1);ray.setFromCamera(ndc,camera);try{const ha=ray.intersectObject(SP.G,true).filter(h=>h.object.visible&&(h.object.isMesh||(h.object.isSprite&&h.object.userData.act)));if(ha.length&&ha[0].object.userData.act&&window.__campusAct&&window.__campusAct(ha[0].object.userData.act,ha[0]))return;}catch(e){}if(!ray.ray.intersectPlane(gplane,hitP))return;
  if(ST.sitting>=0){standUp();if(ST.sitting>=0)return;}
  let tx=hitP.x,tz=hitP.z;try{const hs=ray.intersectObject(SP.G,true).filter(h=>h.object.isMesh&&h.object.visible);if(hs.length&&hs[0].point.y>.03&&hs[0].distance<ray.ray.origin.distanceTo(hitP)+.01){tx=hs[0].point.x;tz=hs[0].point.z;}}catch(e){}
  autoSit=-1;let bd=.85;SP.seats.forEach((s,i)=>{const d=Math.hypot(s.x-tx,s.z-tz);if(d<bd&&!seatTaken(i)){bd=d;autoSit=i;}});if(autoSit>=0){tx=SP.seats[autoSit].x;tz=SP.seats[autoSit].z;}
  const b=SP.bounds;tx=Math.max(b[0],Math.min(b[1],tx));tz=Math.max(b[2],Math.min(b[3],tz));const P=me.root.position;let pp=navPath(P.x,P.z,tx,tz);if(!pp.length){if(autoSit>=0){pp=navPath(P.x,P.z,tx,tz,true);if(!pp.length)pp=[{x:tx,z:tz}];}else{toast('그쪽으로는 갈 수 없어요');return;}}
  path=pp;const L=path[path.length-1];tapRing.position.set(L.x,.05,L.z);tapT=1;}

/* ---------- seats & timer ---------- */
function seatTaken(i){return Object.values(REMOTES).some(r=>r.pr&&r.pr.sp===ST.space&&r.pr.st===i);}
function nearestSeat(maxD){let best=-1,bd=maxD;const p=me.root.position;SP.seats.forEach((s,i)=>{const d=Math.hypot(s.x-p.x,s.z-p.z);if(d<bd&&!seatTaken(i)){bd=d;best=i;}});return best;}
function sitDrop(A){const F=A&&A.fit;return F?Math.min(.32,(F.legTop||.22)*.82):.25;}
function petAnchor(root){const ry=root.rotation.y;return {position:{x:root.position.x-Math.sin(ry)*1.25,z:root.position.z-Math.cos(ry)*1.25},rotation:{y:ry}};}
function placeOnSeat(){const s=SP.seats[ST.sitting];me.root.position.set(s.x,Math.max(0,s.h-sitDrop(me)),s.z);me.root.rotation.y=s.ry;}
function sitDown(i){if(i<0)return;ST.sitting=i;path=[];placeOnSeat();try{camYaw=SP.seats[i].ry+PI+.45;}catch(e){}camDist=8;pitch=.3;const RD=!!((ROOMS[ST.space]&&ROOMS[ST.space].study)||(SP.seats[i]&&SP.seats[i].read));me.book&&(me.book.visible=RD);pushPresence(true);if(RD)showTimer(true);else if(SP.seats[i]&&SP.seats[i].spa)toast('♨️ 따끈따끈~ 온천에 몸을 담갔어요');setGuide(true);}
function standUp(force){if(ST.sitting<0)return;if(!force&&TM.run){toast('타이머가 돌아가는 중이에요<small>일시정지하거나 기록한 뒤 일어나 주세요</small>');return;}const s=SP&&SP.seats[ST.sitting];ST.sitting=-1;if(s){me.root.position.set(s.x-Math.sin(s.ry)*-.0,0,s.z);}me.root.position.y=0;if(me.book)me.book.visible=false;if(force){TM.run=false;TM.acc=0;TM.done=false;}showTimer(false);pushPresence(true);setGuide(true);}
const TM={mode:0,run:false,start:0,acc:0,done:false};let TMMINI=false;
/* 오늘 집중 시간 (캐릭터 이름표) */
let TODAY_MIN={},todayAt=0;
function calcToday(){const t0=new Date();t0.setHours(0,0,0,0);const o={};(DATA.logs||[]).forEach(l=>{if(l.ts>=t0.getTime()&&l.by)o[l.by]=(o[l.by]||0)+(+l.sec||0);});Object.keys(o).forEach(k=>o[k]=Math.round(o[k]/60));TODAY_MIN=o;todayAt=Date.now();}
function focusSub(id,live){if(Date.now()-todayAt>30000)calcToday();const tot=(TODAY_MIN[id]||0)+(live>0?live:0);if(live>=0)return '';return tot?`📖 오늘 ${tot}분`:'';}
function todayTot(id,live){if(Date.now()-todayAt>30000)calcToday();return (TODAY_MIN[id]||0)+(live>0?live:0);}
const elapsed=()=>TM.acc+(TM.run?Date.now()-TM.start:0);
const fmt=ms=>{const s=Math.max(0,Math.floor(ms/1000));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return (h?h+':':'')+String(m).padStart(h?2:1,'0')+':'+String(x).padStart(2,'0');};
function showTimer(on){if(!on)TMMINI=false;$('#timer').classList.toggle('show',on);document.body.classList.toggle('seated',on);if(on){const R0=ROOMS[ST.space]||{name:((SP.seats[ST.sitting]||{}).nm||'학당 마당'),tag:'마당 독서'};$('#tmSub').textContent=R0.name;$('#tmTag').textContent=R0.tag;$('#tmBook').value=LS.get('lastBook','');renderTimer();}}
function renderTimer(){const e=elapsed();$('#tmTime').textContent=TM.mode&&!TM.done?fmt(TM.mode*60000-e):fmt(e);$('#tmHint').textContent=TM.done?'집중 완료! 기록을 남겨 주세요':TM.run?(TM.mode?TM.mode+'분 집중 중 · 남은 시간':'흐르는 시간 · 자유 독서'):(e?'일시정지됨':'시간을 고르고 시작을 눌러요');
  document.body.classList.toggle('tmMini',TMMINI&&ST.sitting>=0&&$('#timer').classList.contains('show'));$('#sfTime').textContent=(TM.done?'✨ 완료 ':TM.run?'⏱ ':'⏸ ')+$('#tmTime').textContent;$('#sfUp').textContent=TM.done||elapsed()>=60000?'기록하고 일어나기':'일어나기';$('#tmGo').textContent=TM.run?'일시정지':(e?'이어서':'시작');$('#tmGo').disabled=TM.done;$('#tmSave').textContent=e>=1000?'기록하고 일어나기':'일어나기';$$('#tmModes button').forEach(b=>{b.classList.toggle('on',+b.dataset.m===TM.mode);b.disabled=!!e;});}
$$('#tmModes button').forEach(b=>b.addEventListener('click',()=>{TM.mode=+b.dataset.m;renderTimer();}));
(function(){const box=document.getElementById('tmCols');if(!box)return;const draw=()=>{const c=LS.get('clockCol',0);box.innerHTML='<span>시계 색</span>'+CLOCKC.map((x,i)=>`<button data-cc="${i}" title="${x[0]}" class="${i===c?'on':''}${x[1]?'':' glass'}" style="${x[1]?'background:'+x[1]:''}"></button>`).join('');};draw();box.addEventListener('click',e=>{const b=e.target.closest('[data-cc]');if(!b)return;LS.set('clockCol',+b.dataset.cc);draw();myClock.key=null;pushPresence(true);});})();
$('#tmGo').addEventListener('click',()=>{if(TM.run){TM.acc+=Date.now()-TM.start;TM.run=false;}else{TM.start=Date.now();TM.run=true;TMMINI=true;initAudio();}pushPresence(true);renderTimer();});
$('#tmSave').addEventListener('click',async()=>{const e=elapsed();const book=$('#tmBook').value.trim().slice(0,60);LS.set('lastBook',book);TM.run=false;
  if(e>=60000){await addDoc('logs',{sp:ST.space,sec:Math.round(e/1000),book});toast(`${(ROOMS[ST.space]||{name:'학당 마당'}).name} · ${Math.round(e/60000)}분 기록했어요<small>기록장(記)에서 볼 수 있어요</small>`);chime();if(book&&window.__qPrompt)setTimeout(()=>window.__qPrompt(book),1600);}
  else if(e>=1000)toast('1분 이상부터 기록돼요<small>이번 시간은 저장하지 않았어요</small>');
  TM.acc=0;TM.done=false;TM.mode=TM.mode;standUp(true);});
$('#sfUp').addEventListener('click',()=>$('#tmSave').click());
$('#sfTime').addEventListener('click',()=>{TMMINI=false;renderTimer();});
const _sfV=new THREE.Vector3();function placeSitFloat(){if(!document.body.classList.contains('tmMini'))return;const el=$('#sitFloat');_sfV.copy(me.root.position);_sfV.y+=1.1;_sfV.project(camera);if(_sfV.z>1){el.style.opacity=0;return;}el.style.opacity=1;const W=innerWidth,H=innerHeight;let x=(_sfV.x+1)/2*W+46,y=(1-_sfV.y)/2*H;x=Math.min(Math.max(x,8),W-el.offsetWidth-8);y=Math.min(Math.max(y,90),H-el.offsetHeight-90);el.style.left=x+'px';el.style.top=y+'px';}
$('#tmBook').addEventListener('change',()=>{LS.set('lastBook',$('#tmBook').value.trim());pushPresence(true);});

/* ---------- camera ---------- */
let camDist=8,pitch=.42,camYaw=0,yawCur=0,poseUntil=0;const clampD=d=>Math.max(2.5,Math.min(ST.space==='campus'?24:16,d));const camT=new THREE.Vector3(),want=new THREE.Vector3(),lookW=new THREE.Vector3();
function hold(id,fn){const b=$(id);let iv=null;const st=e=>{e.preventDefault();fn();iv=setInterval(fn,60);};const sp=()=>{clearInterval(iv);iv=null;};b.addEventListener('pointerdown',st);b.addEventListener('pointerup',sp);b.addEventListener('pointerleave',sp);b.addEventListener('pointercancel',sp);}
hold('#zin',()=>camDist=clampD(camDist-.35));hold('#zout',()=>camDist=clampD(camDist+.35));hold('#pup',()=>pitch=Math.min(1.25,pitch+.04));hold('#pdn',()=>pitch=Math.max(.08,pitch-.04));
$('#recenter').addEventListener('click',()=>{camDist=8;pitch=.42;camYaw=0;});
hold('#rotL',()=>{camYaw+=.08;poseUntil=0;});hold('#rotR',()=>{camYaw-=.08;poseUntil=0;});$('#lookFace').addEventListener('click',()=>{closeSheets();showFace(6000);});
function showFace(ms){path=[];poseUntil=performance.now()+(ms||4200);}
function updateCam(dt,snap){const p=me.root.position;const pose=performance.now()<poseUntil;let yaw=camYaw,d=ST.space==='campus'?camDist:Math.min(camDist,10),pt=pitch,ly=1.1,ahead=1.4;
  const seatedV=ST.sitting>=0&&document.body.classList.contains('seated');
  if(!pose&&ST.sitting>=0){if(seatedV){const top=p.y+me.h+(TM.run||elapsed()>0?1.9:.6),bot=p.y-.15,half=(top-bot)/2*1.3;const fit=half/Math.tan(camera.fov*Math.PI/360)/Math.max(.6,Math.min(1,camera.aspect*1.6));d=Math.max(2.2,fit*(camDist/8));pt=Math.max(.02,Math.min(1.1,pitch));ly=(top+bot)/2;}else{d=Math.min(d,5.5);pt=Math.min(pt,.32);ly=p.y+me.h*.5;}ahead=0;}
  if(pose){if(ST.sitting>=0){yaw=SP.seats[ST.sitting].ry+PI+.45;}d=ST.sitting>=0?(seatedV?6.2:4.8):3.3;pt=ST.sitting>=0?.3:.14;ly=ST.sitting>=0?(seatedV?p.y+.05:p.y+me.h*.45):p.y+me.h*.6;ahead=0;}
  let dy=yaw-yawCur;dy=Math.atan2(Math.sin(dy),Math.cos(dy));yawCur+=snap?dy:dy*Math.min(1,dt*(pose?3.5:8));
  want.set(p.x+Math.sin(yawCur)*Math.cos(pt)*d,(seatedV&&!pose?ly:p.y+.8)+Math.sin(pt)*d,p.z+Math.cos(yawCur)*Math.cos(pt)*d);
  if(ST.space!=='campus'){want.y=Math.min(want.y,4.1);want.x=Math.max(-7.4,Math.min(7.4,want.x));want.z=Math.max(-6.5,want.z);}
  lookW.set(p.x-Math.sin(yawCur)*ahead,ly,p.z-Math.cos(yawCur)*ahead);
  if(snap){camera.position.copy(want);camT.copy(lookW);}else{const k=pose?1-Math.pow(.02,dt):1-Math.pow(.002,dt);camera.position.lerp(want,k);camT.lerp(lookW,1-Math.pow(.0008,dt));}camera.lookAt(camT);try{fadeOcc(p);}catch(e){}}
const FADED=new Map(),occRay=new THREE.Raycaster(),occFrom=new THREE.Vector3(),occDir=new THREE.Vector3();let occAt=0;
function unfadeAll(){FADED.forEach((orig,o)=>{try{o.material.dispose();}catch(e){}o.material=orig;});FADED.clear();}
function fadeOcc(p){const now=performance.now();if(now-occAt<140||!SP)return;occAt=now;occFrom.set(p.x,p.y+(me.h||2)*.55,p.z);occDir.subVectors(camera.position,occFrom);const dist=occDir.length();if(dist<.3)return;occDir.normalize();occRay.set(occFrom,occDir);occRay.far=dist;occRay.camera=camera;const keep=new Set();occRay.intersectObject(SP.G,true).forEach(h=>{const o=h.object;if(!o.isMesh||!o.visible||(o.userData&&o.userData.walk)||!o.material||Array.isArray(o.material))return;keep.add(o);if(!FADED.has(o)){FADED.set(o,o.material);const m=o.material.clone();m.transparent=true;m.opacity=.18;m.depthWrite=false;o.material=m;}});FADED.forEach((orig,o)=>{if(!keep.has(o)){try{o.material.dispose();}catch(e){}o.material=orig;FADED.delete(o);}});}

/* ---------- zone & guide ---------- */
function updateZone(){const info=ST.space==='campus'?{en:'THE COURTYARD · SONGHYEON',title:SEASON.key==='xmas'?'눈 내리는 마당,<br>트리 아래 모여요.':SEASON.key==='halloween'?'호박등 켜진 밤,<br>학당 마당으로.':SEASON.key==='birthday'?'생일 축하의 달,<br>케이크 앞에서.':SEASON.blossom?'벚꽃 흩날리는<br>학당 마당.':SEASON.key==='autumn'?'단풍 물든<br>학당 마당.':SEASON.rain?'장맛비 내리는<br>학당 마당.':SEASON.snow?'눈 쌓인<br>학당 마당.':'햇살 머무는<br>학당 마당.',loc:'청도학당 · 강의동, 도서관, 기숙사'}:{en:ROOMS[ST.space].en,title:ROOMS[ST.space].title,loc:ROOMS[ST.space].name+' · '+ROOMS[ST.space].tag};
  $('#zName').textContent=ST.space==='campus'?`학당 마당 · ${SEASON.ico} ${SEASON.month}월`+(SEASON.wx?` · ${WX_LABEL[SEASON.wx][0]} ${SEASON.temp}°`:''):ROOMS[ST.space].name;$('#zEn').textContent=info.en;$('#zTitle').innerHTML=info.title;const bt=$('#bigTitle');bt.classList.add('show');clearTimeout(updateZone.t);updateZone.t=setTimeout(()=>bt.classList.remove('show'),3600);$('#chatWrap').classList.toggle('show',CHAT_SP.includes(ST.space));renderChat();}
function updateSeasonChip(){if(ST.space==='campus')$('#zName').textContent=`학당 마당 · ${SEASON.ico} ${SEASON.month}월`+(SEASON.wx?` · ${WX_LABEL[SEASON.wx][0]} ${SEASON.temp}°`:'');}
const NAMEOF={library:'도서관',basics:'마법학 기초 강의동',potion:'마법약 강의동',herbs:'약초학 온실',training:'기초체력 수련장',dorm:'기숙사'};
let gKey='',gAct=null;
function setGuide(force){let k='',t='',ico='',act=null;const p=me.root.position;
  if(ST.sitting>=0){if(ST.space==='dorm'){k='sit';ico='🪑';t='일어나기';act=()=>standUp();}}
  else if(!path.length){const tr=SP.triggers.find(o=>Math.hypot(o.x-p.x,o.z-p.z)<o.r);const dr=ST.space==='campus'?SP.doors.find(o=>Math.hypot(o.x-p.x,o.z-p.z)<o.r+2.2):null;const si=nearestSeat(1.6);
    if(tr){k='tr'+tr.act;ico=tr.act==='board'?'📌':tr.act==='playlist'?'🎵':'📖';t=tr.title;act=()=>openSheet(tr.act);}
    else if(dr){k='door'+dr.to;ico='🚪';t=NAMEOF[dr.to]+' 들어가기';act=()=>enterSpace(dr.to);}
    else if(si>=0){k='seat'+si;ico=ST.space==='training'?'🧘':'🪑';t=ST.space==='dorm'?'의자에 앉기':'자리에 앉아 타이머 켜기';act=()=>sitDown(si);}
    else if(ST.space!=='campus'&&ST.space!=='dorm'){k='findseat';ico='🪑';t='빈 자리 찾아 앉기';act=()=>{const i=nearestSeat(99);if(i>=0){const st=SP.seats[i];autoSit=i;path=[{x:st.x,z:st.z}];}};}}
  gAct=act;if(k===gKey&&!force)return;gKey=k;const a=$('#action');a.classList.toggle('show',!!k);$('#aIco').textContent=ico;$('#aTxt').textContent=t;}
$('#action').addEventListener('click',()=>gAct&&gAct());

/* ---------- data (shared via db, or local) ---------- */
const DATA={warns:[],board:LS.get('local.board',[]),logs:LS.get('local.logs',[]),books:LS.get('local.books',[]),playlist:LS.get('local.playlist',[]),quotes:LS.get('local.quotes',[]),gallery:LS.get('local.gallery',[])};
let CLOUD_DONE=false;let DB=null,USER=null,ROOM=null,MYID='me',CANWRITE=true,MODE='local',PEERS=[];const NAMES={};
const LIM={warns:500,board:150,logs:3000,books:600,playlist:200,quotes:300,gallery:60};
function onData(col){if(col==='warns'){try{renderSnack();renderTeacher(true);}catch(e){}}if(col==='playlist'){renderPlaylist();renderTicker();notifyNewSongs();}if(col==='board'){renderBoard();updateBoard3D();updateBdDot();}if(col==='logs'||col==='books')renderRecords();if(col==='logs')todayAt=0;if(col==='quotes'&&window.__qRender)window.__qRender();if(col==='gallery'&&window.__galRender)window.__galRender();resolveNames(DATA[col].map(d=>d.by));}
async function initCloud(){const C=window.claude;if(!C||!C.use){updateConn();return;}
  let db=null,user=null,room=null;try{[db,user,room]=await Promise.all([C.use('db').catch(()=>null),C.use('user').catch(()=>null),C.use('room').catch(()=>null)]);}catch(e){}
  USER=user;if(user){try{MYID=(await user.id())||'me';}catch(e){}try{const c=await user.can('data.write');CANWRITE=c!==false;}catch(e){}}
  if(db&&MYID!=='me'){DB=db;MODE='shared';['board','logs','books','playlist','quotes','gallery','warns'].forEach(sub);subMembers();subStamps();subLikes();}
  if(room){ROOM=room;setupRoom();}updateConn();}
function sub(col){let timer=setTimeout(()=>{CONN.slow=true;updateConn();},10000);
  DB.collection(col).orderBy('ts','desc').limit(LIM[col]).onSnapshot(s=>{if(!s.metadata.fromCache){clearTimeout(timer);CONN.slow=false;updateConn();}DATA[col]=s.docs.map(d=>Object.assign({id:d.id},d.data()));onData(col);},e=>{clearTimeout(timer);CONN.err=e.code;updateConn();});}
async function addDoc(col,obj){if(col!=='logs'&&col!=='warns'&&!ADMIN_ON){const txt=Object.values(obj||{}).filter(v=>typeof v==='string').join(' ');if(badBlock(txt))return false;}obj=Object.assign({},obj,{by:MYID,ts:Date.now()});
  if(DB&&CANWRITE){try{await DB.collection(col).add(obj);return true;}catch(e){if(e.code==='invalid_argument'){CANWRITE=false;updateConn();toast('이 계정은 읽기만 할 수 있어요<small>만든 사람에게 편집 권한을 받아야 기록할 수 있어요</small>');}else if(e.code==='quota_exceeded')toast('저장 공간이 가득 찼어요<small>오래된 기록을 지워 주세요</small>');else toast('저장하지 못했어요<small>잠시 뒤 다시 시도해 주세요</small>');return false;}}
  if(DB&&!CANWRITE){toast('읽기 전용이라 저장할 수 없어요');return false;}
  obj.id='l'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);DATA[col].unshift(obj);DATA[col]=DATA[col].slice(0,LIM[col]);LS.set('local.'+col,DATA[col]);onData(col);return true;}
async function delDoc(col,id){if(DB){try{await DB.collection(col).doc(id).delete();return true;}catch(e){toast('지우지 못했어요<small>'+(ADMIN_ON?'선생님만 지울 수 있어요':'내가 올린 것만 지울 수 있어요')+'</small>');return false;}}DATA[col]=DATA[col].filter(d=>d.id!==id);LS.set('local.'+col,DATA[col]);onData(col);}
const MEMBERS={};let membersReady=false;
function subMembers(){let done=false;const fin=()=>{if(!done){done=true;membersReady=true;}};setTimeout(fin,6000);DB.collection('members').limit(200).onSnapshot(s=>{s.docs.forEach(d=>{MEMBERS[d.id]=d.data();});if(!s.metadata.fromCache){const mine=MEMBERS[MYID];if(!done){if(mine){if(mine.nick){ST.nick=String(mine.nick).slice(0,12);LS.set('nick',ST.nick);pushPresence(true);}if(mine.av&&AVMAP[mine.av]&&mine.av!==ST.avatar){setAvatar(mine.av);}if(mine.pet&&PETMAP[mine.pet]&&mine.pet!==ST.pet)setPet(mine.pet,true);if(typeof mine.look==='string'&&mine.look!==lookStr(ST.look)){ST.look=lookParse(mine.look);LS.set('look',lookStr(ST.look));setAvatar(ST.avatar||'girl');}}else if(ST.nick)saveMember();}fin();}renderBoard();renderRecords();Object.values(REMOTES).forEach(r=>r.lastLabel='');updateMe();try{mergeSameNick();checkGifts();}catch(e){}},()=>fin());}
let memSaving=false,memAgain=false;async function saveMember(){if(!DB||MYID==='me')return;if(memSaving){memAgain=true;return;}memSaving=true;try{await DB.doc('members/'+MYID).set({nick:ST.nick||'',av:ST.avatar||'girl',pet:ST.pet||'none',look:lookStr(ST.look),ts:Date.now()});}catch(e){}memSaving=false;if(memAgain){memAgain=false;saveMember();}}
async function resolveNames(ids){if(!USER)return;const need=[...new Set(ids)].filter(i=>i&&i!=='me'&&!(i in NAMES));if(!need.length)return;need.forEach(i=>NAMES[i]='');try{const ps=await USER.profiles(need);need.forEach(i=>NAMES[i]=(ps&&ps[i]&&ps[i].name)||'');renderBoard();renderRecords();Object.values(REMOTES).forEach(r=>r.lastLabel='');}catch(e){}}
const nameOf=(id,fb)=>id===MYID||id==='me'?(ST.nick||'나'):((MEMBERS[id]&&MEMBERS[id].nick)||fb||NAMES[id]||'친구');
const CONN={slow:false,err:null};
const T0=Date.now();
function cloudProblem(){const S=window.__cloudState;if(!S)return '';if(S.err==='auth')return '연결 실패 · 익명 로그인이 꺼져 있어요';if(S.err==='join')return '연결 실패 · 데이터베이스 규칙을 확인해 주세요';if(S.err==='init')return '연결 실패 · firebase-config.js를 확인해 주세요';if(Date.now()-T0>12000)return S.stage==='needpw'?'암호를 다시 적으면 연결돼요':'연결이 늦어요 · 새로고침해 보세요';return '';}
setInterval(()=>{if(MODE!=='shared'&&!CLOUD_DONE)updateConn();},3000);
function updateConn(){const n=1+new Set(PEERS.filter(p=>p.kind==='viewer'&&!p.isMe&&p.presence&&p.presence.sp&&p.presence.nk&&p.presence.nk!==(ST.nick||'')).map(p=>p.presence.nk||p.by)).size;
  $('#online').textContent=window.__rulesOld?'⚠️ Firebase 규칙을 다시 붙여 넣어 주세요':ROOM&&n>1?`지금 학당에 ${n}명`:ROOM&&n===1?'접속한 친구 없음 · 나만 있어요':MODE==='shared'?'친구를 기다리는 중':CLOUD_DONE?'오프라인 · 이 기기에만 저장돼요':cloudProblem()||'학당에 연결하는 중…';$('#onDot').classList.toggle('off',!(ROOM&&n>0));
  const s=window.__rulesOld?'Firebase 규칙이 예전 버전이라 기록을 저장하지 못해요. 콘솔 → Realtime Database → 규칙에 database.rules.json을 다시 붙여 넣고 게시해 주세요.':MODE==='shared'?(CONN.err?'공유 저장소에 연결하지 못했어요 ('+CONN.err+')':CONN.slow?'공유 기록을 불러오는 중이에요…':CANWRITE?'공유 저장 · 게시판과 기록이 친구들과 함께 보여요':'읽기 전용 · 만든 사람에게 편집 권한을 받아야 글을 남길 수 있어요'):(cloudProblem()?cloudProblem()+((window.__cloudState||{}).msg?' ('+window.__cloudState.msg.slice(0,80)+')':''):CLOUD_DONE?'오프라인 · 이 기기에만 저장돼요':'학당에 연결하는 중…');
  $('#connState').textContent=s+(ROOM?' · 실시간 접속 켜짐':' · 실시간 접속 꺼짐');}

/* ---------- room: presence, chat ---------- */
const REMOTES={};let presT=0,presDirty=false;
function myPresence(){const p=me.root.position;return {sp:ST.space,x:+p.x.toFixed(2),z:+p.z.toFixed(2),ry:+me.root.rotation.y.toFixed(2),av:ST.avatar||'girl',st:ST.sitting,rd:TM.run?Date.now()-elapsed():0,bk:($('#tmBook').value||'').slice(0,24),pt:ST.pet||'none',lk:lookStr(ST.look),nk:(ST.nick||'').slice(0,12),fx:ST.fx,em:MY_EM,cl:MY_CL,cc:LS.get('clockCol',0),bk:window.__bike||0};}
function pushPresence(now){presDirty=true;if(now)flushPresence();}
function flushPresence(){if(!ROOM||!presDirty||!window.__entered)return;presDirty=false;presT=performance.now();ROOM.presence(myPresence()).catch(()=>{});}
function setupRoom(){ROOM.onPeers(ch=>{PEERS=ch.peers.slice();ch.left.forEach(p=>dropRemote(p.peer));ch.peers.forEach(p=>{if(!p.sameTab&&(p.isMe||(ST.nick&&p.presence&&p.presence.nk===ST.nick))){dropRemote(p.peer);return;}if(!p.sameTab&&p.kind==='viewer')upsertRemote(p);});resolveNames(PEERS.map(p=>p.by));updateConn();renderTogether();const sig=onlineFriends().map(r=>r.by+r.pr.sp+(r.pr.rd?1:0)).join();if(sig!==window.__frSig){window.__frSig=sig;if($('#friends').classList.contains('show'))renderFriends();}},()=>{PEERS=[];updateConn();});
  ROOM.on('chat',m=>{if(m.isMe&&m.sameTab)return;const d=m.data||{};if(typeof d.t!=='string')return;const r=REMOTES[m.peer];addChat(m.by,d.t.slice(0,200),m.peer,false,r&&r.pr&&typeof r.pr.nk==='string'?r.pr.nk.slice(0,12):'',typeof d.sp==='string'?d.sp:'dorm');});
  ROOM.onConnection(c=>{if(c)pushPresence(true);});pushPresence(true);renderChat();}
function dropRemote(peer){const r=REMOTES[peer];if(!r)return;scene.remove(r.A.root,r.L.sprite,r.B.sprite);if(r.C)scene.remove(r.C.sprite);if(r.pet)scene.remove(r.pet.root);delete REMOTES[peer];}
function upsertRemote(p){const pr=p.presence||{};let r=REMOTES[p.peer];if(!pr.sp||!pr.nk){if(r){r.A.root.visible=false;r.pr=pr;}return;}
  const lk=typeof pr.lk==='string'?pr.lk.slice(0,240):'';if(!r||r.av!==pr.av||r.lk!==lk){if(r)scene.remove(r.A.root);const A=makeAvatar(AVMAP[pr.av]||pr.av==='shiba'?pr.av:'girl',lookParse(lk));if(r)r.lk=lk;scene.add(A.root);A.root.position.set(+pr.x||0,0,+pr.z||0);if(!r){r={L:makeLabel('친구'),B:makeBubble(),ph:0,amt:0,lk};scene.add(r.L.sprite,r.B.sprite);}r.A=A;r.av=pr.av;}
  const pid=PETMAP[pr.pt]?pr.pt:'none';if(r.petId!==pid){if(r.pet)scene.remove(r.pet.root);r.pet=makePet(pid);r.petId=pid;if(r.pet){r.pet.root.position.copy(r.A.root.position);scene.add(r.pet.root);}}
  if(typeof pr.em==='string'&&pr.em!==r.emSeen){const first=r.emSeen===undefined;r.emSeen=pr.em;const k=pr.em.split(':')[0];if(!first&&pr.sp===ST.space){playEmote(r.A,k);if(k==='heart'||k==='wave'){const nm=nameOf(p.by,pr.nk);toast(k==='heart'?`${esc(nm)}님이 하트를 보냈어요 💗`:`${esc(nm)}님이 인사해요 👋`);}}}else if(r.emSeen===undefined)r.emSeen=pr.em||'';
  if(typeof pr.cl==='string'&&pr.cl!==r.clSeen){const first=r.clSeen===undefined;r.clSeen=pr.cl;const [to,ts]=pr.cl.split('|');if(!first&&(to===MYID||to==='*')&&p.by!==MYID&&Date.now()-(+ts||0)<120000)gotCall(p.by,pr);}else if(r.clSeen===undefined)r.clSeen=pr.cl||'';
  r.pr=pr;r.by=p.by;r.peer=p.peer;r.A.root.visible=r.L.sprite.visible=pr.sp===ST.space;if(r.C&&pr.sp!==ST.space)r.C.sprite.visible=false;if(r.pet)r.pet.root.visible=r.A.root.visible;REMOTES[p.peer]=r;}
function refreshRemotes(){Object.values(REMOTES).forEach(r=>{const v=r.pr&&r.pr.sp===ST.space;r.A.root.visible=r.L.sprite.visible=v;if(r.pet)r.pet.root.visible=v;if(!v){r.B.sprite.visible=false;if(r.C)r.C.sprite.visible=false;}else if(r.pr){r.A.root.position.set(+r.pr.x||0,0,+r.pr.z||0);}});}
const CHAT=[];
function addChat(by,text,peer,mine,nk,sp){sp=sp||'dorm';CHAT.push({by,text,mine,nk,sp,ts:Date.now()});if(CHAT.length>60)CHAT.shift();renderChat();if(mine){myBubble.set(text);}else{const r=REMOTES[peer];if(r&&r.A.root.visible)r.B.set(text);}}
function renderChat(){const el=$('#chatLog');if(!el)return;const LIST=CHAT.filter(c=>(c.sp||'dorm')===ST.space);el.innerHTML=LIST.length?LIST.map(c=>`<div class="${c.mine?'me':''}"><b>${esc(c.mine?(ST.nick||'나'):nameOf(c.by,c.nk))}</b>${esc(c.text)}</div>`).join(''):`<div class="sys">${ROOM?(ST.space==='campus'?'마당 대화방이에요. 지금 마당에 있는 친구들과 이야기해요.':'기숙사 대화방이에요. 지금 기숙사에 있는 친구들과 이야기해요.')+' (대화는 저장되지 않아요 · 남길 말은 게시판에)':'혼자 모드예요. 친구들과 함께 쓰는 학당에서는 여기 대화가 실시간으로 오가요.'}</div>`;el.scrollTop=el.scrollHeight;}
/* ---------- 고운 말 지킴이 ---------- */
function warnsOf(id){const ids=new Set([id]);try{if(id===MYID)sameNickIds().forEach(x=>ids.add(x));}catch(e){}return (DATA.warns||[]).filter(w=>ids.has(w.by));}
function badBlock(t){if(ADMIN_ON||!window.BadWords)return false;const r=BadWords.check(t);if(!r)return false;
  const pae=r.kind==='패드립';toast(`${pae?'🚫 가족을 욕하는 말(패드립)':'🚫 욕설'}은 쓸 수 없어요<small>고운 말 경고가 1번 쌓여서 간식 미션 도장이 1개 빠지고, 과자점 엽전도 5냥 줄어요</small>`);
  if(DB&&MYID!=='me'){try{DB.collection('warns').add({by:MYID,nick:(ST.nick||'').slice(0,12),kind:r.kind,t:String(t).slice(0,80),sp:ST.space||'',ts:Date.now()});}catch(e){}}
  else{DATA.warns.unshift({by:MYID,kind:r.kind,ts:Date.now()});}
  return true;}
window.__warnN=()=>{try{return warnsOf(MYID).length;}catch(e){return 0;}};
function sendChat(){const i=$('#chatIn');const t=i.value.trim().slice(0,200);if(!t)return;if(badBlock(t)){i.value='';return;}i.value='';addChat(MYID,t,null,true,'',ST.space);if(ROOM&&ROOM.connected())ROOM.emit('chat',{t,sp:ST.space}).catch(e=>{if(e&&e.code==='not_permitted')toast('대화를 보낼 권한이 없어요');});}
$('#chatSend').addEventListener('click',sendChat);$('#chatIn').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();sendChat();}});
const CHAT_SP=['dorm','campus'];
function setFooter(){$('#chatBar').classList.toggle('show',CHAT_SP.includes(ST.space));const ci=$('#chatIn');if(ci&&!ci.disabled)ci.placeholder=ST.space==='campus'?'마당에 있는 친구들에게 한마디':'기숙사 친구들에게 한마디';}

/* ---------- board ---------- */
const NOTE_COLORS=['#f6e08a','#f6b8c4','#b8e0c8','#bcd4f2','#f2c89a'];let noteColor=0;
function renderBoard(){const el=$('#bList');if(!el)return;const L=DATA.board;el.innerHTML=L.length?L.map(n=>`<div class="note" style="background:${NOTE_COLORS[n.c|0]||NOTE_COLORS[0]};transform:rotate(${((n.ts||0)%7-3)*.6}deg)"><p>${esc(n.text)}</p><span>${esc(nameOf(n.by))} · ${ago(n.ts)}</span>${n.by===MYID||ADMIN_ON?`<button data-del="${esc(n.id)}" aria-label="삭제">×</button>`:''}</div>`).join(''):'<div class="empty">아직 쪽지가 없어요. 첫 쪽지를 붙여 보세요!</div>';}
$('#bList').addEventListener('click',e=>{const b=e.target.closest('[data-del]');if(b)delDoc('board',b.dataset.del);});
$$('#bColors button').forEach((b,i)=>{b.style.background=NOTE_COLORS[i];b.addEventListener('click',()=>{noteColor=i;$$('#bColors button').forEach(x=>x.classList.toggle('on',x===b));});});
$('#bSave').addEventListener('click',async()=>{const t=$('#bText').value.trim().slice(0,300);if(!t){$('#bText').focus();return;}if(await addDoc('board',{text:t,c:noteColor})){$('#bText').value='';toast('게시판에 쪽지를 붙였어요');}});
function updateBoard3D(){const sp=cache.dorm;if(!sp||!sp.boardGroup)return;const g=sp.boardGroup;(g.userData.notes||[]).forEach(n=>g.remove(n));g.userData.notes=[];DATA.board.slice(0,12).forEach((n,i)=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(.55,.5),new THREE.MeshBasicMaterial({color:NOTE_COLORS[n.c|0]||NOTE_COLORS[0]}));m.position.set(-1.25+(i%5)*.62,.55-Math.floor(i/5)*.6,.02+i*.001);m.rotation.z=((n.ts||i)%7-3)*.05;g.add(m);g.userData.notes.push(m);});}
const ago=ts=>{const s=(Date.now()-ts)/1000;if(s<60)return '방금';if(s<3600)return Math.floor(s/60)+'분 전';if(s<86400)return Math.floor(s/3600)+'시간 전';const d=new Date(ts);return `${d.getMonth()+1}.${d.getDate()}`;};

/* ---------- records ---------- */
let recTab='me',stars=5;
const SUBJ={basics:['마법학 기초','전공 필수'],potion:['마법약 수업','전공 필수'],herbs:['약초학 수업','전공 선택'],training:['기초체력훈련','전공 선택'],library:['도서관 자유 독서','자유']};
const mins=s=>Math.round((s||0)/60);
function renderRecords(){if(!$('#records').classList.contains('show'))return;$$('#recTabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===recTab));const el=$('#recBody');
  if(recTab==='me'){const mine=DATA.logs.filter(l=>l.by===MYID);const now=new Date();const d0=new Date(now.getFullYear(),now.getMonth(),now.getDate()).getTime();const w0=d0-((now.getDay()+6)%7)*86400000;
    const sum=f=>mins(mine.filter(f).reduce((a,l)=>a+(l.sec||0),0));const per=STUDY.map(k=>[k,mine.filter(l=>l.sp===k).reduce((a,l)=>a+(l.sec||0),0)]);const mx=Math.max(1,...per.map(p=>p[1]));
    el.innerHTML=`<div class="stats"><div><small>오늘</small><b>${sum(l=>l.ts>=d0)}</b>분</div><div><small>이번 주</small><b>${sum(l=>l.ts>=w0)}</b>분</div><div><small>전체</small><b>${sum(()=>true)}</b>분</div></div>
    <div class="sec">과목별 공부·독서 시간</div>${per.map(([k,s])=>`<div class="bar"><span>${SUBJ[k][0]}<em>${SUBJ[k][1]}</em></span><i><u style="width:${s/mx*100}%"></u></i><b>${mins(s)}분</b></div>`).join('')}
    <div class="sec">최근 기록</div>${mine.length?mine.slice(0,20).map(l=>`<div class="row"><span>${esc(SUBJ[l.sp]?SUBJ[l.sp][0]:l.sp)} · <b>${mins(l.sec)}분</b>${l.book?`<small>${esc(l.book)}</small>`:''}</span><em>${ago(l.ts)}</em><button data-del="logs:${esc(l.id)}">×</button></div>`).join(''):'<div class="empty">강의실이나 도서관 자리에 앉아 타이머를 써 보세요.</div>'}`;}
  else if(recTab==='friends'){const others=DATA.logs.filter(l=>l.by!==MYID);const studying=Object.values(REMOTES).filter(r=>r.pr&&r.pr.rd);
    el.innerHTML=`<div class="sec">지금 공부 중인 친구</div>${studying.length?studying.map(r=>`<div class="row live"><span>📖 <b>${esc(nameOf(r.by))}</b> · ${esc(ROOMS[r.pr.sp]?ROOMS[r.pr.sp].name:'')}${r.pr.bk?`<small>${esc(r.pr.bk)}</small>`:''}</span><em>${Math.floor((Date.now()-r.pr.rd)/60000)}분째</em></div>`).join(''):`<div class="empty">${ROOM?'지금 타이머를 켠 친구가 없어요.':'친구와 함께 쓰는 학당에서 보여요.'}</div>`}
    <div class="sec">친구들의 최근 기록</div>${others.length?others.slice(0,40).map(l=>`<div class="row"><span><b>${esc(nameOf(l.by))}</b> · ${esc(SUBJ[l.sp]?SUBJ[l.sp][0]:'')} ${mins(l.sec)}분${l.book?`<small>${esc(l.book)}</small>`:''}</span><em>${ago(l.ts)}</em></div>`).join(''):`<div class="empty">${MODE==='shared'?'아직 친구들의 기록이 없어요.':'혼자 모드에서는 내 기록만 보여요.'}</div>`}`;}
  else{const L=DATA.books;el.innerHTML=`<div class="form"><input id="bkTitle" maxlength="60" placeholder="책 제목"><input id="bkAuthor" maxlength="40" placeholder="지은이 (선택)"><div class="stars" id="bkStars">${[1,2,3,4,5].map(i=>`<button data-s="${i}" class="${i<=stars?'on':''}">★</button>`).join('')}</div><textarea id="bkReview" maxlength="1500" placeholder="독후감 · 기억에 남는 문장, 느낀 점"></textarea><button class="primary" id="bkSave">서가에 꽂기</button></div>
    <div class="sec">학당 서가 · ${L.length}권</div>${L.length?L.map(b=>`<details class="book"><summary><span><b>${esc(b.title)}</b>${b.author?` · ${esc(b.author)}`:''}<small>${'★'.repeat(b.stars|0)}${'☆'.repeat(5-(b.stars|0))} · ${esc(nameOf(b.by))} · ${ago(b.ts)}</small></span>${b.by===MYID?`<button data-del="books:${esc(b.id)}">×</button>`:''}</summary>${b.review?`<p>${esc(b.review)}</p>`:'<p class="mute">독후감 없이 기록했어요.</p>'}</details>`).join(''):'<div class="empty">첫 책을 꽂아 보세요.</div>'}`;
    $$('#bkStars button').forEach(b=>b.addEventListener('click',()=>{stars=+b.dataset.s;$$('#bkStars button').forEach(x=>x.classList.toggle('on',+x.dataset.s<=stars));}));
    $('#bkSave').addEventListener('click',async()=>{const title=$('#bkTitle').value.trim();if(!title){$('#bkTitle').focus();return;}if(await addDoc('books',{title:title.slice(0,60),author:$('#bkAuthor').value.trim().slice(0,40),stars,review:$('#bkReview').value.trim().slice(0,1500)})){toast('『'+esc(title)+'』을 서가에 꽂았어요');chime();}});}}
$('#recBody').addEventListener('click',e=>{const b=e.target.closest('[data-del]');if(!b)return;e.preventDefault();const [c,id]=b.dataset.del.split(':');delDoc(c,id);});
$$('#recTabs button').forEach(b=>b.addEventListener('click',()=>{recTab=b.dataset.t;renderRecords();}));
function renderTogether(){if($('#records').classList.contains('show')&&recTab==='friends')renderRecords();}

/* ---------- sheets ---------- */
function openSheet(id){closeSheets();if(id==='books'){recTab='books';id='records';}const el=$('#'+id);if(!el)return;el.classList.add('show');
  if(id==='records')renderRecords();if(id==='conn')renderAdmin();if(id==='wardrobe')renderWardrobe();if(id==='friends')renderFriends();if(id==='teacher'&&typeof renderTeacher==='function')renderTeacher();if(id==='playlist'){LS.set('plSeen',Date.now());renderPlaylist();renderTicker();}if(id==='sound')renderSoundUI();if(id==='stamp'){calM=null;$('#stMemo').value='';renderStamp();}if(id==='board'){LS.set('bdSeen',Date.now());updateBdDot();renderBoard();$('#bWrite').style.display=(MODE==='shared'&&!CANWRITE)?'none':'';}if(id==='me'){$('#nickEdit').value=ST.nick||'';renderAvatars();}if(id==='map')$$('#mapList button').forEach(b=>b.classList.toggle('here',b.dataset.go===ST.space));if(id==='menu')updateMe();}
function closeSheets(){$$('.modal').forEach(m=>m.classList.remove('show'));}
$$('.modal').forEach(m=>m.addEventListener('click',e=>{if(e.target===m||e.target.closest('[data-close]'))closeSheets();else if(e.target.closest('[data-back]'))openSheet('menu');}));
$('#menuBtn').addEventListener('click',()=>openSheet('menu'));
$$('#menuGrid [data-open]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.open==='records')recTab='me';openSheet(b.dataset.open);}));
function updateMe(){const a=AVMAP[ST.avatar||'girl'];$('#meEmo').textContent=a.emo;$('#meNick').textContent=ST.nick||'이름 없는 학생';$('#meAv').textContent=a.name+' · 갓 착용';}
function avColorRow(key,label){const cur=(ST.look.c&&ST.look.c[key])||0;return `<div class="cRow"><span>${label}</span><div class="cSw">${PALETTE.map((p,i)=>`<button data-avc="${key}" data-ci="${i}" class="${i===cur?'on':''}${i?'':' def'}" title="${p[0]}" style="${i?`background:#${p[1].toString(16).padStart(6,'0')}`:''}"></button>`).join('')}</div></div>`;}
function dragonColorPanel(){const a=AVMAP[ST.avatar||'girl'];if(!a||!a.dragonColor)return '';const rows=a.dragonStyle==='west'?[['av','몸 색'],['av2','배 · 날개 색']]:[['av','몸 색'],['av2','배 · 뿔 색']];return `<div class="sec">용 색 고르기 <small>용 캐릭터에서만 보여요</small></div>${rows.map(r=>avColorRow(r[0],r[1])).join('')}`;}
function ensureAfter(anchorId,boxId){const a=document.getElementById(anchorId);if(!a)return null;let b=document.getElementById(boxId);if(!b){b=document.createElement('div');b.id=boxId;a.insertAdjacentElement('afterend',b);}return b;}
function renderAvatarColorBoxes(){const h=dragonColorPanel();const b1=ensureAfter('avGrid','avColorBox');if(b1)b1.innerHTML=h;const b2=ensureAfter('introAv','introAvColorBox');if(b2)b2.innerHTML=h;}
function renderAvatars(){const html=AVATARS.map(a=>{const im=thumbOf('av',a.id);return `<button data-av="${a.id}" class="${a.id===(ST.avatar||'girl')?'on':''}${a.god?' god':''}">${im?`<img src="${im}" alt="">`:`<span>${a.emo}</span>`}${a.name}</button>`;}).join('');const pg=$('#petGrid');if(pg)pg.innerHTML=PETS.map(p=>{const im=p.id==='none'?'':thumbOf('pet',p.id);return `<button data-pet="${p.id}" class="${p.id===(ST.pet||'none')?'on':''}">${im?`<img src="${im}" alt="">`:'<span>🚶</span>'}${p.name}${p.desc?`<small>${p.desc}</small>`:''}</button>`;}).join('');$('#avGrid').innerHTML=html;const ia=$('#introAv');if(ia)ia.innerHTML=html;renderAvatarColorBoxes();}
$('#nickSave').addEventListener('click',()=>{const v=$('#nickEdit').value.trim().slice(0,12);if(!v){$('#nickEdit').focus();return;}if(window.BadWords&&BadWords.check(v)){toast('고운 말로 된 닉네임을 써 주세요 🙂');return;}ST.nick=v;LS.set('nick',v);saveMember();pushPresence(true);updateMe();toast('닉네임을 「'+esc(v)+'」(으)로 바꿨어요');});
$('#avGrid').addEventListener('click',e=>{const b=e.target.closest('[data-av]');if(!b)return;setAvatar(b.dataset.av);renderAvatars();toast(AVMAP[b.dataset.av].name+'(으)로 변신했어요');});
$('#petGrid').addEventListener('click',e=>{const b=e.target.closest('[data-pet]');if(!b)return;setPet(b.dataset.pet);renderAvatars();toast(b.dataset.pet==='none'?'혼자 다니기로 했어요':PETMAP[b.dataset.pet].name+'이(가) 졸졸 따라와요');});
$('#introAv').addEventListener('click',e=>{const b=e.target.closest('[data-av]');if(!b)return;ST.avatar=b.dataset.av;setAvatar(b.dataset.av);renderAvatars();});
document.addEventListener('click',e=>{const b=e.target.closest('[data-avc]');if(!b)return;const L=Object.assign({},ST.look,{a:ST.look.a.slice(),c:Object.assign({},ST.look.c||{})});const i=+b.dataset.ci;if(i>0)L.c[b.dataset.avc]=i;else delete L.c[b.dataset.avc];setLook(L);renderAvatars();});
$('#mapList').addEventListener('click',e=>{const b=e.target.closest('[data-go]');if(!b)return;closeSheets();const id=b.dataset.go;if(id===ST.space)return;enterSpace(id);});
const mSel=$('#seasonSel');mSel.innerHTML='<option value="auto">자동 (오늘 날짜)</option>'+Object.entries(MONTHS).map(([m,v])=>`<option value="${m}">${m}월 · ${v[1]}</option>`).join('');mSel.value=ST.seasonPick;
mSel.addEventListener('change',()=>{ST.seasonPick=mSel.value;LS.set('seasonPick',ST.seasonPick);rebuildSeason();});
const wSel=$('#wxSel');wSel.innerHTML='<option value="auto">내 위치 (안 되면 서울)</option>'+Object.keys(CITIES).map(c=>`<option value="${c}">${c}</option>`).join('')+'<option value="off">연동 안 함</option>';wSel.value=ST.wxPick;wSel.addEventListener('change',()=>{ST.wxPick=wSel.value;LS.set('wxPick',ST.wxPick);WX=null;if(ST.wxPick==='off'){rebuildSeason();renderWxState();}else{renderWxState();fetchWx(true);}});
const tSel=$('#todSel');tSel.value=ST.todPick;tSel.addEventListener('change',()=>{ST.todPick=tSel.value;LS.set('todPick',ST.todPick);rebuildSeason();});
let toastT;function toast(h){const t=$('#toast');t.innerHTML=h;t.classList.add('show');clearTimeout(toastT);toastT=setTimeout(()=>t.classList.remove('show'),3000);}


/* ---------- faces ---------- */
var MY_EM='',MY_CL='';
/* ---------- 친구 부르기 ---------- */
const spName=sp=>sp==='campus'?'학당 마당':(ROOMS[sp]?ROOMS[sp].name:'학당');
function onlineFriends(){const seen=new Set([ST.nick||'']);return Object.values(REMOTES).filter(r=>{if(!r.pr||!r.pr.sp||!r.pr.nk||!r.by||r.by===MYID)return false;const k=r.pr.nk;if(seen.has(k))return false;seen.add(k);return true;});}
function renderFriends(){const el=$('#frList');if(!el)return;const fr=onlineFriends();
  el.innerHTML=fr.length?fr.map(r=>{const im=thumbOf('av',AVMAP[r.pr.av]?r.pr.av:'girl');const here=r.pr.sp===ST.space;return `<div class="frRow">${im?`<img src="${im}" alt="">`:''}<span><b>${esc(nameOf(r.by,r.pr.nk))}</b><small>${esc(spName(r.pr.sp))}${here?' · 같은 곳':''}${r.pr.rd?' · 공부 중':''}</small></span><button class="ghost" data-go="${r.peer}">찾아가기</button><button class="primary" data-call="${r.by}">부르기</button></div>${canKick()?`<div class="kickRow"><button class="kick" data-kick="${r.by}" data-nk="${esc(nameOf(r.by,r.pr.nk))}">🚪 ${esc(nameOf(r.by,r.pr.nk))}님 내보내기</button></div>`:''}`;}).join(''):`<div class="empty">${MODE==='shared'?'지금 접속한 친구가 없어요. 아래 \'학당 링크 보내기\'로 불러 보세요!':'학당이 연결되지 않아 친구를 볼 수 없어요. 왼쪽 위 연결 상태를 확인해 주세요.'}</div>`;}
let callCool=0;
function sendCall(to){if(MODE!=='shared'){toast('학당이 연결돼 있어야 친구를 부를 수 있어요');return;}if(Date.now()<callCool){toast('잠깐만요, 조금 뒤에 다시 불러 주세요');return;}callCool=Date.now()+8000;MY_CL=to+'|'+Date.now();pushPresence(true);
  toast(to==='*'?'모두에게 초대장을 보냈어요 📣':esc(nameOf(to))+'님에게 초대장을 보냈어요 📣');playEmote(me,'wave');}
let callFrom=null,callT;
function gotCall(by,pr){callFrom={by,sp:pr.sp,x:+pr.x||0,z:+pr.z||0};$('#callTxt').innerHTML=`📣 <b>${esc(nameOf(by,pr.nk))}</b>님이<br>${esc(spName(pr.sp))}(으)로 불러요!`;$('#callPop').classList.add('show');try{if(typeof chime==='function')chime();}catch(e){}if(navigator.vibrate)try{navigator.vibrate([60,40,60]);}catch(e){}clearTimeout(callT);callT=setTimeout(()=>$('#callPop').classList.remove('show'),20000);}
function goNear(sp,x,z){const a=Math.random()*Math.PI*2;const at={x:x+Math.cos(a)*1.2,z:z+Math.sin(a)*1.2};closeSheets();if(sp===ST.space&&SP){me.root.position.set(at.x,0,at.z);path=[];if(myPet)myPet.root.position.set(at.x+1,0,at.z+.7);pushPresence(true);}else enterSpace(sp,at);}
$('#callGo').addEventListener('click',()=>{$('#callPop').classList.remove('show');if(callFrom){goNear(callFrom.sp,callFrom.x,callFrom.z);const by=callFrom.by;setTimeout(()=>{doEmote('wave');},1100);toast(esc(nameOf(by))+'님 곁으로 왔어요');}});
$('#callNo').addEventListener('click',()=>$('#callPop').classList.remove('show'));
$('#frAll').addEventListener('click',()=>{sendCall('*');closeSheets();});
$('#frShare').addEventListener('click',async()=>{const url=location.href.split('#')[0];const text='송현학당에 들어와! 같이 공부하자 📚';try{if(navigator.share){await navigator.share({title:'청도학당',text,url});return;}}catch(e){if(e&&e.name==='AbortError')return;}try{await navigator.clipboard.writeText(text+'\n'+url);toast('링크를 복사했어요<small>카톡에 붙여 넣어 보내 주세요</small>');}catch(e){toast(esc(url));}});
$('#frList').addEventListener('click',e=>{const k=e.target.closest('[data-kick]');if(k){const id=k.dataset.kick;if(kickArm!==id){kickArm=id;k.textContent='정말 내보내기';k.classList.add('armed');clearTimeout(kickT);kickT=setTimeout(()=>{kickArm=null;renderFriends();},3000);return;}kickArm=null;kickFriend(id,k.dataset.nk||'친구');return;}const c=e.target.closest('[data-call]');if(c){sendCall(c.dataset.call);return;}const g=e.target.closest('[data-go]');if(g){const r=REMOTES[g.dataset.go];if(r&&r.pr){goNear(r.pr.sp,+r.pr.x||0,+r.pr.z||0);toast(esc(nameOf(r.by,r.pr.nk))+'님을 찾아왔어요');}}});
$('#chip').addEventListener('click',e=>{if(e.target.closest('#plTk'))return;openSheet('friends');});
function doEmote(k){MY_EM=k+':'+Date.now();playEmote(me,k);showFace((EM_DUR[k]||2)*1000+400);pushPresence(true);}
function renderFaces(){$('#facePop').innerHTML='<div class="fpSec">행동 · 친구들에게도 보여요</div>'+EMOTES.map(m=>`<button data-em="${m[0]}"><span>${m[1]}</span>${m[2]}</button>`).join('')+'<div class="fpSec">표정</div><button data-look="1"><span>🪞</span>얼굴 보기</button>'+FACES.map(f=>`<button data-fx="${f[0]}" class="${f[0]===ST.fx?'on':''}"><span>${f[1]}</span>${f[2]}</button>`).join('');$('#faceBtn').textContent=(FACES.find(f=>f[0]===ST.fx)||FACES[0])[1];}
function updateBdDot(){const seen=LS.get('bdSeen',0);const n=(DATA.board||[]).some(d=>d.ts>seen&&d.by!==MYID);$('#bdDot').hidden=!n;}
$('#boardBtn').addEventListener('click',()=>{$('#facePop').classList.remove('show');if(ST.space!=='dorm'){enterSpace('dorm',{x:-5.6,z:-0.8});setTimeout(()=>{me.root.rotation.y=Math.atan2(-1,-1);openSheet('board');},950);}else openSheet('board');});
new MutationObserver(()=>document.body.classList.toggle('fpOpen',$('#facePop').classList.contains('show'))).observe($('#facePop'),{attributes:true,attributeFilter:['class']});
$('#faceBtn').addEventListener('click',()=>{renderFaces();$('#facePop').classList.toggle('show');});
$('#facePop').addEventListener('click',e=>{const em=e.target.closest('[data-em]');if(em){doEmote(em.dataset.em);$('#facePop').classList.remove('show');return;}if(e.target.closest('[data-look]')){showFace(6000);$('#facePop').classList.remove('show');return;}const b=e.target.closest('[data-fx]');if(!b)return;ST.fx=b.dataset.fx;showFace(4200);LS.set('fx',ST.fx);renderFaces();pushPresence(true);setTimeout(()=>$('#facePop').classList.remove('show'),250);});
canvas.addEventListener('pointerdown',()=>$('#facePop').classList.remove('show'));renderFaces();

/* ---------- 출석 선물 ---------- */
function giftPop(list){if(!list.length)return;let el=document.getElementById('giftPop');if(el)el.remove();el=document.createElement('div');el.id='giftPop';
  const rows=list.map(r=>`<div class="gpR"><span class="gpI">${r.ico}</span><div><b>${r.d?`출석 ${r.d}일 달성!`:r.t}</b><small>${r.items.map(([k,id])=>giftName(k,id)).join(' · ')}</small></div></div>`).join('');
  el.innerHTML=`<div class="gpBox paper"><div class="gpConf">${'🎉✨🎊⭐'.repeat(3).split('').filter(c=>c.trim()).map((c,i)=>`<i style="left:${(i*37)%100}%;animation-delay:${(i%6)*.12}s">${c}</i>`).join('')}</div><div class="gpT">🎁 출석 선물이 도착했어요</div>${rows}<div class="gpB"><button class="primary" id="gpWear">옷장에서 입어 보기</button><button class="ghost" id="gpClose">닫기</button></div></div>`;
  document.body.appendChild(el);try{chime();}catch(e){}
  el.addEventListener('click',e=>{if(e.target.closest('#gpWear')){el.remove();const f=list[list.length-1].items[0];wTab=({t:'top',b:'bottom',h:'hat',a:'acc'})[f[0]]||'top';openSheet('wardrobe');}else if(e.target===el||e.target.closest('#gpClose'))el.remove();});}
function checkGifts(){if(!window.__entered)return;const d=attendDays();const seen=LS.get('giftsSeen',[]);const nw=REWARDS.filter(r=>r.d<=d&&!seen.includes(r.d));if(!nw.length)return;LS.set('giftsSeen',seen.concat(nw.map(r=>r.d)));setTimeout(()=>giftPop(nw),600);}
function missionsHTML(){const d=attendDays();return `<div class="sec">🎁 출석 미션 <small>도장을 모으면 옷장 선물이 열려요</small></div><div class="msList">${REWARDS.map(r=>{const ok=d>=r.d;const pct=r.d?Math.min(100,Math.round(d/r.d*100)):100;
  return `<div class="ms ${ok?'ok':''}"><span class="msI">${ok?r.ico:'🔒'}</span><div class="msM"><b>${r.d?`출석 ${r.d}일`:'첫 방문'}</b><small>${r.items.map(([k,id])=>giftName(k,id)).join(' · ')}</small>${ok?'':`<i class="msBar"><u style="width:${pct}%"></u></i>`}</div><em>${ok?'받음 ✓':`${d}/${r.d}`}</em></div>`;}).join('')}</div>`;}
/* ---------- wardrobe ---------- */
let wTab='top';
const HAT_ICO={gat:'🎩',none:'🙅',jobawi:'🧣',jokduri:'👑',hwagwan:'💐',beanie:'🧶',beret:'🎨',cap:'🧢',apprentice:'⭐',wizard:'🧙'},ACC_ICO={glasses:'👓',sunglasses:'🕶️',scarf:'🧣',norigae:'🎐',flowerpin:'🌸',headphones:'🎧',backpack:'🎒',crossbag:'👜',wand:'🪄',magicwand:'✨'};
const lkB=(k,id)=>giftLocked(k,id)?` lock" data-need="${giftNeed(k,id)}`:'';const lkT=(k,id)=>giftLocked(k,id)?`<em class="lk">🔒 ${giftNeed(k,id)}일</em>`:(giftNeed(k,id)||GIFTD[k+':'+id]===0?'<em class="gf">🎁</em>':'');
ACC_ICO.norigae='🪢';
function previewImg(){try{if(!thumbR){thumbOf('av','girl');}const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight(0xfff4e0,0x8a6a4a,1.05));const dl=new THREE.DirectionalLight(0xffffff,.7);dl.position.set(2,4,-5);sc.add(dl);
  const o=makeAvatar(ST.avatar||'girl',ST.look);sc.add(o.root);o.setFace('smile');const h=o.h||2;const cam=new THREE.PerspectiveCamera(30,1,.1,50);cam.position.set(-.6,h*.55,-h*1.6-.5);cam.lookAt(0,h*.45,0);thumbR.render(sc,cam);return thumbR.domElement.toDataURL('image/png');}catch(e){return '';}}
function renderWardrobe(){if(!$('#wardrobe').classList.contains('show'))return;$$('#wTabs button').forEach(b=>b.classList.toggle('on',b.dataset.t===wTab));const L=ST.look;const el=$('#wGrid');
  if(wTab==='hat')el.innerHTML=HATS.map(h=>`<button data-h="${h[0]}" class="${L.h===h[0]?'on':''}${lkB('h',h[0])}"><span>${HAT_ICO[h[0]]}</span>${h[1]}${lkT('h',h[0])}</button>`).join('');
  else if(wTab==='acc')el.innerHTML=ACCS.map(a=>`<button data-a="${a[0]}" class="${L.a.includes(a[0])?'on':''}${lkB('a',a[0])}"><span>${ACC_ICO[a[0]]}</span>${a[1]}${lkT('a',a[0])}</button>`).join('');
  else{const list=wTab==='top'?TOPS:BOTTOMS,key=wTab==='top'?'t':'b';el.innerHTML=[['gift','🎁 출석 선물'],['trad','전통'],['mhan','모던 한복'],['modern','현대']].map(([c,n])=>`<div class="wSec">${n}${c==='gift'?` <small>지금 출석 ${attendDays()}일</small>`:''}</div>`+list.filter(o=>o.cat===c).map(o=>`<button data-${key}="${o.id}" class="${L[key]===o.id?'on':''}${lkB(key,o.id)}"><i class="sw">${o.sw.map(x=>`<b style="background:${x}"></b>`).join('')}</i>${o.name}${lkT(key,o.id)}</button>`).join('')).join('');}
  renderColors();
  const im=previewImg();$('#wPrev').innerHTML=im?`<img src="${im}" alt="">`:'';$('#wNote').textContent=wTab==='acc'?`소품은 4개까지 · 지금 ${L.a.length}개`:wTab==='top'&&L.t==='cheollik'?'원피스라 치마는 가려지고, 바지는 함께 입을 수 있어요':'';}
function swRow(key,label){const L=ST.look;const cur=(L.c&&L.c[key])||0;return `<div class="cRow"><span>${label}</span><div class="cSw">${PALETTE.map((p,i)=>`<button data-ck="${key}" data-ci="${i}" class="${i===cur?'on':''}${i?'':' def'}" title="${p[0]}" style="${i?`background:#${p[1].toString(16).padStart(6,'0')}`:''}"></button>`).join('')}</div></div>`;}
function renderColors(){const el=$('#wCol');if(!el)return;const L=ST.look;let h='';
  if(wTab==='top')h=swRow('t','상의 색');else if(wTab==='bottom')h=swRow('b','하의 색');else if(wTab==='hat')h=L.h==='none'?'':swRow('h','모자 색');
  else if(wTab==='acc')h=L.a.length?L.a.map(a=>swRow(a,(ACCS.find(x=>x[0]===a)||['',''])[1])).join(''):'<div class="empty">소품을 고르면 여기서 색을 바꿀 수 있어요</div>';
  const av=AVMAP[ST.avatar||'girl']; if(av&&av.dragonColor){const extra=(av.dragonStyle==='west'?[['av','몸 색'],['av2','배 · 날개 색']]:[['av','몸 색'],['av2','배 · 뿔 색']]).map(r=>swRow(r[0],r[1])).join(''); h=(h?h:'<div class="empty">옷이나 소품을 고르지 않아도 용 색은 바꿀 수 있어요</div>') + extra;}
  el.innerHTML=h?`<div class="sec">색 고르기 <small>맨 앞 동그라미는 기본 색</small></div>${h}`:'';}
function setLook(L){ST.look=L;LS.set('look',lookStr(L));setAvatar(ST.avatar||'girl');renderWardrobe();renderAvatarColorBoxes();}
$('#wTabs').addEventListener('click',e=>{const b=e.target.closest('[data-t]');if(!b)return;wTab=b.dataset.t;renderWardrobe();});
$('#wGrid').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.classList.contains('lock')){toast(`🔒 출석 ${b.dataset.need}일이 되면 받을 수 있어요<small>지금 출석 ${attendDays()}일 · 출석도장을 찍어 모아요</small>`);return;}const L=Object.assign({},ST.look,{a:ST.look.a.slice()});
  if(b.dataset.t)L.t=b.dataset.t;else if(b.dataset.b)L.b=b.dataset.b;else if(b.dataset.h)L.h=b.dataset.h;else if(b.dataset.a){const i=L.a.indexOf(b.dataset.a);if(i>=0)L.a.splice(i,1);else{if(L.a.length>=4){toast('소품은 4개까지 착용할 수 있어요');return;}L.a.push(b.dataset.a);}}setLook(L);});
$('#wReset').addEventListener('click',()=>setLook(Object.assign({},DEFAULT_LOOK,{a:[],c:{}})));
$('#wCol').addEventListener('click',e=>{const b=e.target.closest('[data-ck]');if(!b)return;const L=Object.assign({},ST.look,{a:ST.look.a.slice(),c:Object.assign({},ST.look.c||{})});const i=+b.dataset.ci;if(i>0)L.c[b.dataset.ck]=i;else delete L.c[b.dataset.ck];setLook(L);});

/* ---------- playlist ---------- */
let LIKES=LS.get('local.likes',{}),plSort='hot',plOpen=null,armed=null,armT=null;let ADMIN_ON=!!LS.get('adminOn',false);document.body.classList.toggle('teacher',ADMIN_ON);
const MUSIC_APPS=[['멜론',q=>'https://www.melon.com/search/total/index.htm?q='+q],['지니',q=>'https://www.genie.co.kr/search/searchMain?query='+q],['Spotify',q=>'https://open.spotify.com/search/'+q],['Apple Music',q=>'https://music.apple.com/kr/search?term='+q],['YouTube Music',q=>'https://music.youtube.com/search?q='+q]];
const IS_IOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
const AM=Object.assign({},LS.get('amCache',{}));
function amLookup(p){const q=(p.title+' '+(p.artist||'')).trim();if(AM[q])return;if(AM[q]===null)return;AM[q]=null;
  const cb='__am'+Math.random().toString(36).slice(2);let s=null;const done=v=>{if(AM[q]!==null)return;AM[q]=v;if(v){const c=LS.get('amCache',{});c[q]=v;LS.set('amCache',c);}try{delete window[cb];}catch(e){}if(s)s.remove();renderPlaylist();};
  window[cb]=d=>{const r=d&&d.results&&d.results.find(x=>x.trackViewUrl);done(r?r.trackViewUrl:'');};
  s=document.createElement('script');s.src='https://itunes.apple.com/search?term='+encodeURIComponent(q)+'&country=kr&entity=song&limit=3&callback='+cb;s.onerror=()=>done('');document.head.appendChild(s);setTimeout(()=>done(''),7000);}
function appleLink(p){const q=(p.title+' '+(p.artist||'')).trim();const d=AM[q];
  if(d){const href=IS_IOS?d.replace(/^https:/,'music:'):d;return `<a class="am" href="${esc(href)}"${IS_IOS?'':' target="_blank" rel="noopener noreferrer"'}>Apple Music ▶ 바로 재생</a>`;}
  if(d===null)return `<a class="am wait">Apple Music · 곡 찾는 중…</a>`;
  return `<a href="${esc('https://music.apple.com/kr/search?term='+encodeURIComponent(q))}" target="_blank" rel="noopener noreferrer">Apple Music</a>`;}
function appLinks(p){const q=encodeURIComponent((p.title+' '+(p.artist||'')).trim());return `<div class="apps">${appleLink(p)}${MUSIC_APPS.filter(a=>a[0]!=='Apple Music').map(a=>`<a href="${esc(a[1](q))}" target="_blank" rel="noopener noreferrer">${a[0]}</a>`).join('')}<em>음악 앱에서 찾아 들으면 화면을 꺼도 계속 들을 수 있어요</em></div>`;}
const FB=()=>window.__cloudKind==='firebase';
function subLikes(){DB.collection('likes').limit(1000).onSnapshot(s=>{const o={};s.docs.forEach(d=>{if(FB())o[d.id]=d.data()||{};else{const [it,u]=d.id.split('~');if(it&&u){(o[it]=o[it]||{})[u]={v:1};}}});LIKES=o;renderPlaylist();},()=>{});}
const likeN=id=>Object.keys(LIKES[id]||{}).length,iLike=id=>!!(LIKES[id]&&LIKES[id][MYID]);
const safeUrl=u=>{try{const x=new URL(u);return /^https?:$/.test(x.protocol)?x.href:'';}catch(e){return '';}};
function renderPlaylist(){const el=$('#plList');if(!el||!$('#playlist').classList.contains('show'))return;$$('#plSort button').forEach(b=>b.classList.toggle('on',b.dataset.s===plSort));
  let L=DATA.playlist.slice();if(plSort==='hot')L.sort((a,b)=>likeN(b.id)-likeN(a.id)||b.ts-a.ts);
  $('#plCount').textContent=L.length?`모두 ${L.length}곡`:'';el.innerHTML=L.length?L.map(p=>{const u=safeUrl(p.url||'');return `<div class="pl"><div class="plMain"><b>${esc(p.title)}</b><span>${esc(p.artist||'')}</span>${p.note?`<p>“${esc(p.note)}”</p>`:''}<small>${esc(nameOf(p.by))} 추천 · ${ago(p.ts)}</small>${plOpen===p.id?appLinks(p):''}</div><div class="plSide">${u?`<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">링크 ↗</a>`:''}<button data-apps="${esc(p.id)}" class="app">🎧 앱으로</button><button data-like="${esc(p.id)}" class="${iLike(p.id)?'on':''}">♥ ${likeN(p.id)}</button>${p.by===MYID||ADMIN_ON?`<button data-pdel="${esc(p.id)}" class="del${armed===p.id?' armed':''}">${armed===p.id?'정말 삭제':'삭제'}</button>`:''}</div></div>`;}).join(''):'<div class="empty">아직 추천곡이 없어요. 첫 곡을 올려 보세요 🎶</div>';}
/* ticker at the top + new-song alerts */
let tkI=0,tkTimer=null;const plSeen=()=>LS.get('plSeen',0);const knownSongs=new Set();let songsPrimed=false;
function renderTicker(){const L=DATA.playlist.slice().sort((a,b)=>b.ts-a.ts).slice(0,6);const b=$('#plTk');document.body.classList.toggle('hasTk',!!L.length);if(!L.length){b.hidden=true;return;}b.hidden=false;
  const nNew=DATA.playlist.filter(p=>p.ts>plSeen()&&p.by!==MYID).length;const nb=$('#plNew');nb.hidden=!nNew;nb.textContent=nNew>9?'9+':nNew;
  const show=()=>{const p=L[tkI%L.length];const t=$('#plTkT');t.classList.add('fade');setTimeout(()=>{t.textContent=`${p.title}${p.artist?' · '+p.artist:''}  —  ${nameOf(p.by)} 추천`;t.classList.remove('fade');},300);};
  show();clearInterval(tkTimer);if(L.length>1)tkTimer=setInterval(()=>{tkI++;show();},5000);}
function notifyNewSongs(){DATA.playlist.forEach(p=>{if(!knownSongs.has(p.id)){knownSongs.add(p.id);if(songsPrimed&&p.by!==MYID)setTimeout(()=>toast(`🎵 ${esc(nameOf(p.by))}님이 「${esc(p.title)}」을 추천했어요<small>왼쪽 위 🎵를 누르면 모아 볼 수 있어요</small>`),900);}});songsPrimed=true;}
$('#plTk').addEventListener('click',e=>{e.stopPropagation();openSheet('playlist');});
$('#plAdd').addEventListener('click',()=>{const f=$('#plFormBox');f.hidden=!f.hidden;$('#plAdd').textContent=f.hidden?'＋ 곡 추천하기':'접기';if(!f.hidden)$('#plTitle').focus();});
$('#plSort').addEventListener('click',e=>{const b=e.target.closest('[data-s]');if(!b)return;plSort=b.dataset.s;renderPlaylist();});
$('#plList').addEventListener('click',async e=>{const lk=e.target.closest('[data-like]'),dl=e.target.closest('[data-pdel]');
  const ap=e.target.closest('[data-apps]');if(ap){plOpen=plOpen===ap.dataset.apps?null:ap.dataset.apps;const it=DATA.playlist.find(x=>x.id===plOpen);if(it)amLookup(it);renderPlaylist();return;}
  if(dl){const id=dl.dataset.pdel;if(armed!==id){armed=id;renderPlaylist();clearTimeout(armT);armT=setTimeout(()=>{armed=null;renderPlaylist();},3500);return;}armed=null;const ok=await delDoc('playlist',id);if(ok!==false)toast('곡을 삭제했어요');return;}
  if(lk){const id=lk.dataset.like,on=!iLike(id);LIKES[id]=Object.assign({},LIKES[id]);if(on)LIKES[id][MYID]={v:1};else delete LIKES[id][MYID];renderPlaylist();
    if(DB&&MYID!=='me'){try{const r=FB()?DB.doc('likes/'+id+'/'+MYID):DB.doc('likes/'+id+'~'+MYID);await(on?r.set({v:1}):r.delete());}catch(err){toast('좋아요를 남기지 못했어요');}}else LS.set('local.likes',LIKES);}});
$('#plSave').addEventListener('click',async()=>{const title=$('#plTitle').value.trim();if(!title){$('#plTitle').focus();return;}const url=$('#plUrl').value.trim();if(url&&!safeUrl(url)){toast('링크는 https:// 로 시작하는 주소만 넣을 수 있어요');return;}
  if(await addDoc('playlist',{title:title.slice(0,60),artist:$('#plArtist').value.trim().slice(0,40),url:url.slice(0,300),note:$('#plNote').value.trim().slice(0,80)})){['#plTitle','#plArtist','#plUrl','#plNote'].forEach(s=>$(s).value='');plSort='new';toast('🎵 추천곡을 올렸어요');chime();$('#plFormBox').hidden=true;$('#plAdd').textContent='＋ 곡 추천하기';}});

/* ---------- attendance stamps ---------- */
const GLYPHS=['讀','學','雲','月','花','福','갓','🐾','⭐','🌸','🍁','♥'],SHAPES=[['c','동그라미'],['s','네모'],['f','꽃잎']],INKS=['#c4584a','#3a2a22','#3f5a8a','#3f7f7a','#c9952a','#d87a9a'];
const STAMPS={};let myDays=LS.get('local.stamps',{});let myVisits=LS.get('local.visits',{});let calM=null;const pick=LS.get('stampPick',{g:'讀',s:'c',c:'#c4584a'});
const dkey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const stp=(o,cls)=>`<span class="stp s-${esc(o.s||'c')} ${cls||''}" style="--c:${/^#[0-9a-f]{6}$/i.test(o.c)?o.c:'#c4584a'}">${esc(GLYPHS.includes(o.g)?o.g:'讀')}</span>`;
function subStamps(){DB.collection('stamps').limit(200).onSnapshot(s=>{s.docs.forEach(d=>{STAMPS[d.id]=d.data();});if(!s.metadata.fromCache){mergeSameNick();}renderStamp();checkGifts();},()=>{});}
function streak(){let n=0;const d=new Date();if(!myDays[dkey(d)])d.setDate(d.getDate()-1);while(myDays[dkey(d)]){n++;d.setDate(d.getDate()-1);}return n;}
function renderStamp(){if(!$('#stamp').classList.contains('show'))return;const now=new Date();if(!calM)calM=new Date(now.getFullYear(),now.getMonth(),1);const y=calM.getFullYear(),m=calM.getMonth();
  $('#calTitle').textContent=`${y}. ${m+1}`;const pre=`${y}-${String(m+1).padStart(2,'0')}-`;const monthN=Object.keys(myDays).filter(k=>k.startsWith(pre)).length;
  {const ms=document.getElementById('stMissions');if(ms)ms.innerHTML=missionsHTML();}$('#stStats').innerHTML=`<div><small>이번 달</small><b>${monthN}</b>일</div><div><small>연속 출석</small><b>${streak()}</b>일</div><div><small>모은 도장</small><b>${Object.keys(myDays).length}</b>개</div>`;
  const first=new Date(y,m,1).getDay(),days=new Date(y,m+1,0).getDate(),tk=dkey(now);let html=['일','월','화','수','목','금','토'].map(d=>`<div class="dw">${d}</div>`).join('');for(let i=0;i<first;i++)html+='<div class="d empty"></div>';
  for(let d=1;d<=days;d++){const k=pre+String(d).padStart(2,'0');const v=myDays[k];html+=`<div class="d ${k===tk?'today':''}" ${v&&v.m?`title="${esc(v.m)}"`:''}><i>${d}</i>${v?stp(v,k===tk&&renderStamp.pop?'pop':''):''}</div>`;}
  $('#cal').innerHTML=html;renderStamp.pop=false;const done=!!myDays[tk];$('#stampGo').textContent=done?'오늘 도장 다시 찍기':'쾅! 도장 찍기';if(done&&!$('#stMemo').value)$('#stMemo').value=myDays[tk].m||'';
  $('#stPrev').outerHTML=stp(pick,'big').replace('class="stp','id="stPrev" class="stp');
  $('#pickGlyph').innerHTML=GLYPHS.map(g=>`<button data-g="${g}" class="${g===pick.g?'on':''}">${g}</button>`).join('');
  $('#pickShape').innerHTML=SHAPES.map(s=>`<button data-s="${s[0]}" class="${s[0]===pick.s?'on':''}" style="font-size:13px;font-family:inherit;font-weight:400">${s[1]}</button>`).join('');
  $('#pickColor').innerHTML=INKS.map(c=>`<button data-c="${c}" class="col ${c===pick.c?'on':''}" style="background:${c}"></button>`).join('');
  const fr=Object.entries(STAMPS).filter(([id,v])=>id!==MYID&&v&&v.days&&v.days[tk]);
  $('#stFriends').innerHTML=fr.length?fr.map(([id,v])=>`<div class="row"><span>${stp(v.days[tk])} <b>${esc(nameOf(id))}</b>${v.days[tk].m?`<small>“${esc(v.days[tk].m)}”</small>`:''}</span><em>연속 ${(()=>{let n=0;const d=new Date();while(v.days[dkey(d)]){n++;d.setDate(d.getDate()-1);}return n;})()}일</em></div>`).join(''):`<div class="empty">${MODE==='shared'?'아직 오늘 출석한 친구가 없어요.':'친구와 함께 쓰는 학당에서 보여요.'}</div>`;}
$('#todayBox').addEventListener('click',e=>{const b=e.target.closest('button');if(!b||b.id==='stampGo')return;if(b.dataset.g)pick.g=b.dataset.g;if(b.dataset.s)pick.s=b.dataset.s;if(b.dataset.c)pick.c=b.dataset.c;LS.set('stampPick',pick);renderStamp();});
$('#calPrev').addEventListener('click',()=>{calM.setMonth(calM.getMonth()-1);renderStamp();});$('#calNext').addEventListener('click',()=>{calM.setMonth(calM.getMonth()+1);renderStamp();});
$('#stampGo').addEventListener('click',async()=>{setTimeout(checkGifts,1400);const k=dkey(new Date());myDays[k]={g:pick.g,s:pick.s,c:pick.c,m:$('#stMemo').value.trim().slice(0,30)};const ks=Object.keys(myDays).sort();while(ks.length>800)delete myDays[ks.shift()];LS.set('local.stamps',myDays);calM=new Date(new Date().getFullYear(),new Date().getMonth(),1);renderStamp.pop=true;renderStamp();chime();toast(`출석 완료! 연속 ${streak()}일째예요 🔖`);
  if(DB&&CANWRITE&&MYID!=='me'){try{await DB.doc('stamps/'+MYID).set({days:myDays,visits:myVisits,ts:Date.now()});}catch(e){toast('도장을 공유 저장소에 남기지 못했어요<small>'+(window.__rulesOld?'Firebase 규칙을 다시 붙여 넣어 주세요':'이 기기에는 저장됐어요')+'</small>');}}});
/* 같은 닉네임 = 같은 사람 (기기·접속이 바뀌어도 출석 이어가기) */
function sameNickIds(){const n=(ST.nick||'').trim();const ids=new Set([MYID]);if(n)Object.keys(MEMBERS).forEach(id=>{const m=MEMBERS[id];if(m&&typeof m.nick==='string'&&m.nick.trim()===n)ids.add(id);});return [...ids];}
function mergeSameNick(){const ids=sameNickIds();const own=(STAMPS[MYID]&&STAMPS[MYID].days)||{};const D={};const V=Object.assign({},myVisits);
  ids.forEach(id=>{const v=STAMPS[id];if(!v)return;if(v.days)Object.keys(v.days).forEach(k=>{if(!D[k])D[k]=v.days[k];});if(v.visits)Object.keys(v.visits).forEach(k=>V[k]=1);});
  Object.keys(myDays).forEach(k=>{if(!D[k])D[k]=myDays[k];});Object.assign(D,own);myDays=D;myVisits=V;LS.set('local.stamps',myDays);LS.set('local.visits',myVisits);}
attendDays=function(){const K=new Set(Object.keys(myDays||{}).concat(Object.keys(myVisits||{})));try{const ids=new Set(sameNickIds());(DATA.logs||[]).forEach(l=>{if(l&&ids.has(l.by)&&l.ts)K.add(dkey(new Date(l.ts)));});}catch(e){}return K.size;};
let visitSaved='';async function markVisit(){const k=dkey(new Date());mergeSameNick();myVisits[k]=1;LS.set('local.visits',myVisits);if(visitSaved===k||!DB||!CANWRITE||MYID==='me')return;visitSaved=k;try{await DB.doc('stamps/'+MYID).set({days:myDays,visits:myVisits,ts:Date.now()});}catch(e){visitSaved='';}}
function askStamp(){const k=dkey(new Date());if(myDays[k]||LS.get('stampAsked','')===k)return;LS.set('stampAsked',k);setTimeout(()=>{if(!$$('.modal.show').length)openSheet('stamp');},1600);}
/* ---------- 친구 내보내기 (관리자) ---------- */
let BANS={},bansOff=null,kickArm=null,kickT;
window.__onKicked=(v)=>{const ts=+(v&&v.ts)||1;if(ts<=+LS.get('kickAck',0)||window.__kicked)return;window.__kicked=true;try{if(ROOM&&ROOM.presence)ROOM.presence({sp:null});}catch(e){}const el=document.createElement('div');el.id='kicked';el.innerHTML='<div class="paper"><div style="font-size:40px">🚪</div><b>잠시 학당 밖으로 나왔어요</b><small>선생님이 내보냈어요 · 언제든 다시 들어올 수 있어요</small><button class="primary" id="kickBack" style="margin-top:14px">다시 들어가기</button></div>';document.body.appendChild(el);el.querySelector('#kickBack').addEventListener('click',()=>{LS.set('kickAck',ts);location.reload();});};
function canKick(){return ADMIN_ON&&!!window.__cloudAdmin&&MODE==='shared';}
function watchBans(){if(bansOff||!canKick())return;bansOff=window.__cloudAdmin.watchBans(b=>{BANS=b||{};renderBans();});}
function renderBans(){const el=$('#banList');if(!el)return;const ids=Object.keys(BANS);el.innerHTML=!ADMIN_ON?'':ids.length?'<div class="sec">내보낸 친구</div>'+ids.map(id=>`<div class="frRow"><span><b>${esc((MEMBERS[id]&&MEMBERS[id].nick)||BANS[id].nick||'친구')}</b><small>${ago(BANS[id].ts||0)} 내보냄</small></span><button class="ghost" data-unkick="${id}">다시 들이기</button></div>`).join(''):'';}
async function kickFriend(id,nick){try{await window.__cloudAdmin.kick(id,nick);Object.values(REMOTES).forEach(r=>{if(r.by===id)dropRemote(r.peer);});toast(esc(nick)+'님을 학당 밖으로 내보냈어요<small>원하면 언제든 다시 들어올 수 있어요</small>');setTimeout(()=>{try{window.__cloudAdmin.unkick(id);}catch(e){}},20000);renderFriends();}catch(e){toast('내보내지 못했어요<small>선생님 암호로 들어왔는지 확인해 주세요</small>');}}
function renderAdmin(){watchBans();renderBans();const on=ADMIN_ON;document.body.classList.toggle('teacher',on);{const tt=$('#tTile');if(tt)tt.hidden=!on;}$('#adminState').textContent=on?'✅ 선생님 모드 켜짐 · 설정의 \'선생님 화면\'에서 학급을 관리하고, 모든 쪽지와 추천곡을 지울 수 있어요':'선생님만 쓰는 곳이에요. 암호를 넣으면 학급 관리 메뉴가 열려요.';$('#adminOff').hidden=!on;$('#adminIn').parentElement.hidden=on;}
$('#adminGo').addEventListener('click',async()=>{const v=$('#adminIn').value.trim();if(!v)return;const btn=$('#adminGo');btn.disabled=true;btn.textContent='확인 중…';const done=()=>{btn.disabled=false;btn.textContent='켜기';};
  if(DB&&MYID!=='me'){try{await DB.doc('members/'+MYID).set({admin:v});}catch(e){done();toast('저장하지 못했어요<small>연결 상태를 확인해 주세요</small>');return;}
    if(window.__cloudAdmin&&window.__cloudAdmin.verify){await new Promise(r=>setTimeout(r,400));const ok=await window.__cloudAdmin.verify();
      if(ok===false){done();try{await DB.doc('members/'+MYID).set({admin:''});}catch(e){}$('#adminMsg').textContent=window.__rulesOld?'❌ Firebase 규칙이 예전 것이에요. 규칙을 다시 붙여 넣고 게시해 주세요.':'❌ 코드가 맞지 않아요. 다시 확인해 주세요.';$('#adminMsg').className='adminMsg bad';$('#adminIn').select();return;}}}
  done();ADMIN_ON=true;LS.set('adminOn',true);$('#adminIn').value='';$('#adminMsg').textContent='✅ 코드가 맞아요! 관리자 모드가 켜졌어요.';$('#adminMsg').className='adminMsg ok';renderAdmin();renderPlaylist();renderBoard();});
$('#adminOff').addEventListener('click',async()=>{ADMIN_ON=false;document.body.classList.remove('teacher');LS.set('adminOn',false);if(DB&&MYID!=='me'){try{await DB.doc('members/'+MYID).set({admin:''});}catch(e){}}renderAdmin();renderPlaylist();renderBoard();});
$('#logoutBtn').addEventListener('click',()=>{if(!confirm('이 기기에서 닉네임과 캐릭터를 지우고 처음부터 다시 정할까요?'))return;['nick','avatar','look','pet','pwok','pwk','prologue'].forEach(k=>LS.set(k,''));location.reload();});

$('#sndTile').addEventListener('click',()=>{initAudio&&initAudio();setSound(!SND.on);renderSoundUI();toast(SND.on?'🔊 소리를 켰어요':'🔇 소리를 껐어요<small>소리 고르기에서 음악·자연의 소리를 바꿀 수 있어요</small>');});renderSoundUI();

/* ---------- start ---------- */
$('#loadTxt').textContent='';
function fnv(s){let x=2166136261;for(const ch of String(s)){x^=ch.codePointAt(0);x=Math.imul(x,16777619)>>>0;}return x.toString(16);}
const PWH=(window.CLASS&&CLASS.pwHash)||'-',TWH=(window.CLASS&&CLASS.tHash)||'-';
async function sha(s){try{const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');}catch(e){return '';}}
function setRole(isT){ADMIN_ON=!!isT;LS.set('adminOn',!!isT);document.body.classList.toggle('teacher',!!isT);try{renderAdmin();renderPlaylist();renderBoard();}catch(e){}}
const show=id=>['stepPw','stepNick','stepIn'].forEach(s=>$('#'+s).hidden=s!==id);
async function tryPw(){const v=$('#pwIn').value.trim().toLowerCase().replace(/\s+/g,'');if(!v){$('#pwIn').focus();return;}$('#pwGo').disabled=true;
  const hv=await sha(v);const isT=hv===TWH;if(!isT&&hv!==PWH){$('#pwMsg').textContent='암호가 맞지 않아요. 다시 적어 주세요.';$('#pwGo').disabled=false;$('#pwIn').select();return;}
  setRole(isT);LS.set('pwok',hv);LS.set('pwk',v);$('#pwMsg').textContent='';$('#pwGo').textContent='문이 열리는 중…';if(window.__cloudJoin)await Promise.race([window.__cloudJoin(v),new Promise(r=>setTimeout(r,5000))]);await afterGate();}
async function afterGate(){const t0=Date.now();while(MODE==='shared'&&!membersReady&&Date.now()-t0<6000)await new Promise(r=>setTimeout(r,150));if(cloudPending&&Date.now()-t0<4000)await Promise.race([cloudPending,new Promise(r=>setTimeout(r,4000-(Date.now()-t0)))]);while(MODE==='shared'&&!membersReady&&Date.now()-t0<6000)await new Promise(r=>setTimeout(r,150));
  if(ST.nick&&afterGate.auto){enter(false);toast(esc(ST.nick)+'님, 어서 오세요 🌙<small>자동으로 들어왔어요 · 소리는 설정에서 켜요</small>');return;}
  if(ST.nick){$('#welcome').textContent=ST.nick+'님, 다시 오셨네요!';show('stepIn');}else{renderAvatars();show('stepNick');setTimeout(()=>$('#nickIn').focus(),100);}}
$('#pwGo').addEventListener('click',tryPw);$('#pwIn').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing)tryPw();});
$('#nickGo').addEventListener('click',()=>{const v=$('#nickIn').value.trim().slice(0,12);if(!v){$('#nickMsg').textContent='닉네임을 적어 주세요.';$('#nickIn').focus();return;}if(window.BadWords&&BadWords.check(v)){$('#nickMsg').textContent='고운 말로 된 닉네임을 써 주세요 🙂';$('#nickIn').select();return;}ST.nick=v;LS.set('nick',v);{const old=Object.entries(MEMBERS).find(([id,m])=>id!==MYID&&m&&typeof m.nick==='string'&&m.nick.trim().toLowerCase()===v.toLowerCase());if(old){const m=old[1];if(m.look){ST.look=lookParse(m.look);LS.set('look',m.look);}if(m.pet&&PETMAP[m.pet]){ST.pet=m.pet;LS.set('pet',m.pet);try{setPet(m.pet);}catch(e){}}if(m.av&&AVMAP[m.av]){ST.avatar=m.av;LS.set('avatar',m.av);}try{setAvatar(ST.avatar||'girl');}catch(e){}toast('예전 캐릭터를 불러왔어요 🎉<small>'+esc(v)+'님, 다시 만나서 반가워요</small>');}}if(!ST.avatar){ST.avatar='girl';LS.set('avatar','girl');}saveMember();pushPresence(true);updateMe();$('#welcome').textContent=v+'님, 입학을 환영해요!';$('#welcomeSub').textContent='닉네임은 다음에 와도 그대로예요. 설정에서 바꿀 수 있어요.';show('stepIn');});
const enter=s=>{window.__entered=true;setTimeout(()=>{markVisit();checkGifts();},2500);setTimeout(()=>{markVisit();checkGifts();},9000);pushPresence(true);$('#intro').classList.add('hide');if(s)setSound(true);setTimeout(()=>{$('#intro').remove();updateZone();if(!LS.get('prologue',0)&&window.showPrologue)showPrologue(askStamp);else askStamp();},900);setTimeout(()=>{const hn=$('#hint');if(hn)hn.style.opacity=0;},9000);};
$('#goSound').addEventListener('click',()=>enter(true));$('#proAgain').addEventListener('click',()=>{closeSheets();if(window.showPrologue)showPrologue();});$('#goQuiet').addEventListener('click',()=>enter(false));
let cloudPending=null;enterSpace('campus',null,true);updateSeasonChip();renderChat();setGuide(true);updateConn();updateMe();cloudPending=initCloud();Promise.resolve(cloudPending).finally(()=>setTimeout(()=>{CLOUD_DONE=true;updateConn();},1500));fetchWx();setInterval(()=>fetchWx(),30*60e3);renderTicker();notifyNewSongs();

const clock=new THREE.Clock();let walkPh=0,speedNow=0,lastSec=0;let SPEED=4.4;
function frame(){requestAnimationFrame(frame);const dt=Math.min(clock.getDelta(),.05),t=clock.elapsedTime;
  let vx=keys.right-keys.left,vz=keys.down-keys.up;
  if((vx||vz)&&ST.sitting>=0){standUp();vx=vz=0;}
  if(!vx&&!vz&&STEER){if(ST.sitting>=0)standUp();if(ST.sitting<0){const dx=STEER.x-me.root.position.x,dz=STEER.z-me.root.position.z,d=Math.hypot(dx,dz);if(d>.35){vx=dx/d;vz=dz/d;}}}
  if(!vx&&!vz&&path.length&&ST.sitting<0){const w=path[0],dx=w.x-me.root.position.x,dz=w.z-me.root.position.z,d=Math.hypot(dx,dz);if(d<.2){path.shift();if(!path.length&&autoSit>=0){sitDown(autoSit);autoSit=-1;}}else{vx=dx/d;vz=dz/d;}}
  const len=Math.hypot(vx,vz),P=me.root.position;
  if(len>.001&&ST.sitting<0){vx/=len;vz/=len;const nx=P.x+vx*SPEED*dt,nz=P.z+vz*SPEED*dt;let moved=true;
    if(validMove(P.x,P.z,nx,nz)){P.x=nx;P.z=nz;}else if(validMove(P.x,P.z,nx,P.z))P.x=nx;else if(validMove(P.x,P.z,P.x,nz))P.z=nz;else{moved=false;if(path.length){path=[];if(autoSit>=0&&Math.hypot(SP.seats[autoSit].x-P.x,SP.seats[autoSit].z-P.z)<1.6){sitDown(autoSit);}autoSit=-1;}}
    const ang=Math.atan2(-vx,-vz);let da=ang-me.root.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));me.root.rotation.y+=da*Math.min(1,dt*12);pushPresence();
    doorCool-=dt;if(doorCool<=0)for(const d of SP.doors){if(Math.hypot(d.x-P.x,d.z-P.z)<(ST.space==='campus'?1.1:.8)){if(d.to==='campus')enterSpace('campus',DOORS[ST.space].back);else enterSpace(d.to);doorCool=9;break;}}}
  else{doorCool-=dt;if(performance.now()<poseUntil&&ST.sitting<0){let da=yawCur+PI-me.root.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));me.root.rotation.y+=da*Math.min(1,dt*6);}}
  speedNow+=((len>.001&&ST.sitting<0?1:0)-speedNow)*Math.min(1,dt*10);walkPh+=dt*12*speedNow;animateAvatar(me,walkPh,speedNow,t,ST.sitting>=0);emoteTick(me,dt);emoteFxTick(dt);const nowP=performance.now();faceTick(me,nowP,emoteFace(me)||(ST.fx==='base'&&TM.run?'focus':ST.fx));if(myPet){petFollow(myPet,ST.sitting>=0?petAnchor(me.root):me.root,dt,t,SP.bounds);faceTick(myPet,nowP,'base');}
  me.reading=ST.sitting>=0&&!!TM.run&&!!(me.book&&me.book.visible);if(ST.sitting<0){let py=0;(SP.plat||[]).forEach(q=>{if(P.x>q[0]&&P.x<q[1]&&P.z>q[2]&&P.z<q[3])py=q[4];});P.y+=(py-P.y)*Math.min(1,dt*12);}myLabel.sprite.position.set(P.x,P.y+me.h+.2,P.z);{const run=TM.run||(TM.acc>0&&ST.sitting>=0);myClock.sprite.visible=run;if(run){const e=elapsed();myClock.set(fmtClock(e),TM.run?`오늘 ${todayTot(MYID,Math.floor(e/60000))}분`:'일시정지',LS.get('clockCol',0));myClock.sprite.position.set(P.x,P.y+me.h+.98,P.z);}myBubble.sprite.position.set(P.x,P.y+me.h+(run?1.8:.75),P.z);}if(myBubble.sprite.visible&&performance.now()>myBubble.until)myBubble.sprite.visible=false;
  // remotes
  const seatUsed=new Set();if(ST.sitting>=0)seatUsed.add(ST.sitting);let bumpN=0;
  Object.values(REMOTES).sort((a,b)=>String(a.peer).localeCompare(String(b.peer))).forEach(r=>{if(!r.A.root.visible||!r.pr)return;const R0=r.A.root,pr=r.pr;let sit=pr.st>=0&&SP.seats[pr.st];let tx=sit?sit.x:+pr.x,tz=sit?sit.z:+pr.z,ty=sit?Math.max(0,sit.h-sitDrop(r.A)):0;
    if(sit&&seatUsed.has(pr.st)){/* 같은 자리에 겹치면 옆에 서 있게 */const s=sit;bumpN++;const a=(s.ry||0)+Math.PI/2*(bumpN%2?1:-1);tx=s.x+Math.sin(a)*.95;tz=s.z+Math.cos(a)*.95;ty=0;sit=false;}else if(sit)seatUsed.add(pr.st);const dx=tx-R0.position.x,dz=tz-R0.position.z,d=Math.hypot(dx,dz);
    if(d>6){R0.position.set(tx,ty,tz);}else{R0.position.x+=dx*Math.min(1,dt*8);R0.position.z+=dz*Math.min(1,dt*8);R0.position.y+=(ty-R0.position.y)*Math.min(1,dt*8);}
    let tr=sit?sit.ry:+pr.ry||0;let da=tr-R0.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));R0.rotation.y+=da*Math.min(1,dt*10);
    r.amt+=((d>.05&&!sit?1:0)-r.amt)*Math.min(1,dt*8);r.ph+=dt*12*r.amt;animateAvatar(r.A,r.ph,r.amt,t,!!sit);emoteTick(r.A,dt);const fx=FACES.some(f=>f[0]===pr.fx)?pr.fx:'base';faceTick(r.A,nowP,emoteFace(r.A)||(fx==='base'&&pr.rd?'focus':fx));if(r.A.book)r.A.book.visible=!!sit&&((!!ROOMS[pr.sp]&&ROOMS[pr.sp].study)||!!pr.rd);r.A.reading=!!pr.rd&&!!sit;
    const lab=focusSub(r.by,pr.rd?Math.max(0,Math.floor((Date.now()-pr.rd)/60000)):-1);const nm=nameOf(r.by,typeof pr.nk==='string'?pr.nk.slice(0,12):'');if(r.lastLabel!==nm+lab){r.L.set(nm,lab);r.lastLabel=nm+lab;}
    if(r.pet){petFollow(r.pet,(r.pr&&r.pr.st>=0)?petAnchor(R0):R0,dt,t,SP.bounds);faceTick(r.pet,nowP,'base');}
    r.L.sprite.position.set(R0.position.x,R0.position.y+r.A.h+.2,R0.position.z);{if(pr.bk&&!r.bike&&typeof bikeMesh==='function'){r.bike=bikeMesh(0xd8504a);r.A.root.add(r.bike);}if(r.bike)r.bike.visible=!!pr.bk;if(!r.C){r.C=makeGlassClock();scene.add(r.C.sprite);}const run=!!pr.rd;r.C.sprite.visible=run;if(run){const e=Date.now()-pr.rd;r.C.set(fmtClock(e),`오늘 ${todayTot(r.by,Math.floor(e/60000))}분`,pr.cc);r.C.sprite.position.set(R0.position.x,R0.position.y+r.A.h+.98,R0.position.z);}r.B.sprite.position.set(R0.position.x,R0.position.y+r.A.h+(run?1.8:.75),R0.position.z);}if(r.B.sprite.visible&&performance.now()>r.B.until)r.B.sprite.visible=false;});
  SP.tick.forEach(f=>f(t,dt));
  if(tapT>0){tapT=Math.max(0,tapT-dt*1.4);tapRing.material.opacity=tapT*.9;tapRing.scale.setScalar(1+(1-tapT)*1.2);}
  if(performance.now()-presT>150)flushPresence();
  const sec=Math.floor(Date.now()/1000);if(sec!==lastSec){lastSec=sec;if(ST.sitting>=0&&$('#timer').classList.contains('show')){if(TM.run&&TM.mode&&elapsed()>=TM.mode*60000){TM.acc=TM.mode*60000;TM.run=false;TM.done=true;chime();toast('집중 완료! 🎉<small>기록하고 일어나기를 눌러 남겨 두세요</small>');pushPresence(true);}renderTimer();}myLabel.set(ST.nick||'나',focusSub(MYID,TM.run?Math.floor(elapsed()/60000):-1));}
  setGuide();updateCam(dt,false);renderer.render(scene,camera);placeSitFloat();}
frame();
/* ---------- 작은 지도 ---------- */
const MM_LBL={library:'도',basics:'기',potion:'약',herbs:'초',training:'체',dorm:'숙'};
const MM_COL={library:'#4a6a9a',basics:'#7a5aa8',potion:'#3f8a5a',herbs:'#5a9a4a',training:'#b8583a',dorm:'#c4384a'};
function drawMini(){const c=$('#miniC');if(!c||!SP||!me)return;const g=c.getContext('2d');const W=c.width,R=W/2;
  const campus=ST.space==='campus';const view=campus?21:8.5;const sc=R/view;const y=camYaw,cs=Math.cos(y),sn=Math.sin(y);const P=me.root.position;
  const tr=(x,z)=>{const dx=x-P.x,dz=z-P.z;return [R+(dx*cs-dz*sn)*sc,R-(-dx*sn-dz*cs)*sc];};
  g.save();g.clearRect(0,0,W,W);g.beginPath();g.arc(R,R,R,0,Math.PI*2);g.clip();
  g.fillStyle=campus?(SEASON.snow||SEASON.wxSnow?'#e8eef2':'#d8c89a'):'#e8d4b0';g.fillRect(0,0,W,W);
  // bounds
  const b=SP.bounds;g.fillStyle=campus?'#e6dab8':'#f4e6c8';g.strokeStyle='rgba(110,70,40,.55)';g.lineWidth=3;g.beginPath();[[b[0],b[2]],[b[1],b[2]],[b[1],b[3]],[b[0],b[3]]].forEach((q,i)=>{const s=tr(q[0],q[1]);i?g.lineTo(s[0],s[1]):g.moveTo(s[0],s[1]);});g.closePath();g.fill();g.stroke();
  if(campus){g.strokeStyle='rgba(150,140,120,.6)';g.lineWidth=10;g.lineCap='round';[[[0,20],[0,-13]],[[-12,3],[19,3]]].forEach(l=>{const a=tr(l[0][0],l[0][1]),z=tr(l[1][0],l[1][1]);g.beginPath();g.moveTo(a[0],a[1]);g.lineTo(z[0],z[1]);g.stroke();});
    const pd=tr(-11,9);g.fillStyle='#5a8aa0';g.beginPath();g.arc(pd[0],pd[1],2.8*sc,0,Math.PI*2);g.fill();
    (SP.obs||[]).forEach(o=>{if(o.r>2)return;const s=tr(o.x,o.z);g.fillStyle='rgba(70,110,60,.75)';g.beginPath();g.arc(s[0],s[1],Math.max(3,o.r*sc*.8),0,Math.PI*2);g.fill();});
    const ct=tr(0,-3);g.fillStyle='#c86a3a';g.beginPath();g.arc(ct[0],ct[1],2.2*sc,0,Math.PI*2);g.fill();
    g.font='bold 22px sans-serif';g.textAlign='center';g.textBaseline='middle';
    Object.entries(DOORS).forEach(([id,d])=>{if(id==='sauna'&&!(SP&&SP.sauna))return;const s=tr(d.x,d.z);g.fillStyle=MM_COL[id]||'#8a5a3a';g.beginPath();g.arc(s[0],s[1],17,0,Math.PI*2);g.fill();g.strokeStyle='#fbf3e2';g.lineWidth=3;g.stroke();g.fillStyle='#fff';g.fillText(MM_LBL[id]||'',s[0],s[1]+1);});}
  else{(SP.obs||[]).forEach(o=>{const s=tr(o.x,o.z);g.fillStyle='rgba(120,80,45,.55)';g.beginPath();g.arc(s[0],s[1],Math.max(3,o.r*sc),0,Math.PI*2);g.fill();});
    (SP.triggers||[]).forEach(t=>{const s=tr(t.x,t.z);g.fillStyle='#e6b850';g.beginPath();g.arc(s[0],s[1],9,0,Math.PI*2);g.fill();g.strokeStyle='#fff';g.lineWidth=2;g.stroke();});
    (SP.doors||[]).forEach(d=>{const s=tr(d.x,d.z);g.fillStyle='#3f7f7a';g.beginPath();g.arc(s[0],s[1],11,0,Math.PI*2);g.fill();g.fillStyle='#fff';g.font='bold 16px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('문',s[0],s[1]+1);});}
  // friends
  Object.values(REMOTES).forEach(r=>{if(!r.pr||r.pr.sp!==ST.space||!r.A.root.visible)return;const q=r.A.root.position;const s=tr(q.x,q.z);g.fillStyle='#3f9a8a';g.strokeStyle='#fff';g.lineWidth=3;g.beginPath();g.arc(s[0],s[1],8,0,Math.PI*2);g.fill();g.stroke();});
  if(myPet){const q=myPet.root.position;const s=tr(q.x,q.z);g.fillStyle='rgba(200,120,60,.8)';g.beginPath();g.arc(s[0],s[1],5,0,Math.PI*2);g.fill();}
  // me
  const ry=me.root.rotation.y;const fx=-Math.sin(ry),fz=-Math.cos(ry);const ang=Math.atan2((fx*cs-fz*sn),(-fx*sn-fz*cs));
  g.translate(R,R);g.rotate(ang);g.fillStyle='#d8483a';g.strokeStyle='#fff';g.lineWidth=3;g.beginPath();g.moveTo(0,-15);g.lineTo(10,10);g.lineTo(0,5);g.lineTo(-10,10);g.closePath();g.fill();g.stroke();
  g.restore();
  g.strokeStyle='rgba(110,70,40,.5)';g.lineWidth=4;g.beginPath();g.arc(R,R,R-2,0,Math.PI*2);g.stroke();
  $('#miniN').textContent=campus?'학당 마당':(ROOMS[ST.space]?ROOMS[ST.space].name.split(' · ')[0]:'');}
function liftMini(){const mm=$('#mini');if(!mm)return;const r0=mm.getBoundingClientRect();const right=r0.right+6;let lift=0;const bot=$('#bottom').getBoundingClientRect().bottom;
  [...$('#bottom').children].forEach(ch=>{const r=ch.getBoundingClientRect();if(!r.width||!r.height||getComputedStyle(ch).display==='none'||getComputedStyle(ch).opacity==='0')return;if(r.left<right)lift=Math.max(lift,bot-r.top+8);});
  document.documentElement.style.setProperty('--mmLift',lift+'px');}
setInterval(()=>{if(document.hidden)return;try{drawMini();liftMini();}catch(e){}},120);
$('#mini').addEventListener('click',()=>openSheet('map'));
window.__dbg={me,enterSpace,get SP(){return SP;},sitDown,ST,TM};
{afterGate.auto=true;$('#stepPw').hidden=true;$('#loadTxt').textContent=ST.nick?'학당 문을 여는 중…':'';afterGate().then(()=>{$('#loadTxt').textContent='';});}

setInterval(()=>{if(ADMIN_ON)watchBans();if(window.__rulesOld!==window.__rulesShown){window.__rulesShown=window.__rulesOld;updateConn();}},3000);
$('#banList')&&$('#banList').addEventListener('click',async e=>{const b=e.target.closest('[data-unkick]');if(!b)return;try{await window.__cloudAdmin.unkick(b.dataset.unkick);toast('다시 들어올 수 있어요<small>친구가 암호를 한 번 더 적으면 돼요</small>');}catch(err){toast('바꾸지 못했어요');}});

/* ---------- 키보드가 올라와도 화면이 밀리지 않게 ---------- */
(function(){const vv=window.visualViewport;if(!vv)return;const st=document.getElementById('stage');let last='';
  const fit=()=>{const open=vv.height<innerHeight-120&&document.activeElement&&/INPUT|TEXTAREA/.test(document.activeElement.tagName)&&!document.activeElement.closest('.modal');
    const k=open?Math.round(vv.offsetTop)+'|'+Math.round(vv.height):'';if(k===last)return;last=k;
    if(open){st.style.top=vv.offsetTop+'px';st.style.height=vv.height+'px';st.style.bottom='auto';}else{st.style.top='';st.style.height='';st.style.bottom='';window.scrollTo(0,0);}
    document.body.classList.toggle('kbOpen',!!open);resize();};
  vv.addEventListener('resize',fit);vv.addEventListener('scroll',fit);
  document.addEventListener('focusin',()=>{setTimeout(fit,60);setTimeout(fit,350);});document.addEventListener('focusout',()=>setTimeout(fit,120));})();
/* ---------- 사진 찍기 ---------- */
let shotBlob=null,shotUrl='';
async function takeShot(){closeSheets();$('#facePop').classList.remove('show');await new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r)));
  try{renderer.render(scene,camera);const src=renderer.domElement;const W=src.width,H=src.height;const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.drawImage(src,0,0);
    const s=Math.max(1,W/700);const d=new Date();const txt=`송현학당 · ${d.getFullYear()}.${d.getMonth()+1}.${d.getDate()}`;g.font=`600 ${Math.round(15*s)}px 'Gowun Dodum',sans-serif`;const tw=g.measureText(txt).width;
    const px=W-tw-26*s,py=H-22*s;g.fillStyle='rgba(251,243,226,.82)';g.beginPath();g.roundRect?g.roundRect(px-12*s,py-20*s,tw+24*s,30*s,15*s):g.rect(px-12*s,py-20*s,tw+24*s,30*s);g.fill();g.fillStyle='#5a3a22';g.fillText(txt,px,py);
    const fl=$('#flash');fl.classList.add('on');setTimeout(()=>fl.classList.remove('on'),60);try{if(typeof chime==='function')chime();}catch(e){}
    shotBlob=await new Promise(r=>c.toBlob(r,'image/jpeg',.92));if(shotUrl)URL.revokeObjectURL(shotUrl);shotUrl=URL.createObjectURL(shotBlob);$('#shotImg').src=shotUrl;setTimeout(()=>openSheet('shotBox'),250);
  }catch(e){toast('사진을 찍지 못했어요');}}
const shotName=()=>{const d=new Date();return `송현학당_${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}_${String(d.getHours()).padStart(2,'0')}${String(d.getMinutes()).padStart(2,'0')}.jpg`;};
$('#shotBtn').addEventListener('click',takeShot);$('#camShot').addEventListener('click',takeShot);
$('#shotShare').addEventListener('click',async()=>{if(!shotBlob)return;const f=new File([shotBlob],shotName(),{type:'image/jpeg'});try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'송현학당'});return;}}catch(e){if(e&&e.name==='AbortError')return;}$('#shotDl').click();});
$('#shotDl').addEventListener('click',()=>{if(!shotUrl)return;const a=document.createElement('a');a.href=shotUrl;a.download=shotName();document.body.appendChild(a);a.click();a.remove();});

/* 🔍 화면 확대·축소 버튼 (앉아서 집중할 때도, 친구들과 사진 찍을 때도) */
(function(){const z=document.createElement('div');z.id='zoomCtl';z.innerHTML='<button id="zcIn" class="paper" aria-label="확대">＋</button><button id="zcOut" class="paper" aria-label="축소">－</button><button id="zcUp" class="paper" aria-label="위에서 보기">⤒</button><button id="zcDn" class="paper" aria-label="옆에서 보기">⤓</button>';
  const hud=document.getElementById('shotBtn');(hud&&hud.parentNode||document.body).appendChild(z);
  const st=document.createElement('style');st.textContent='#zoomCtl{position:absolute;right:72px;bottom:calc(14px + env(safe-area-inset-bottom) + var(--mmLift,0px));display:grid;grid-template-columns:40px 40px;gap:6px;pointer-events:auto;z-index:2;transition:bottom .3s}#zoomCtl button{width:40px;height:40px;border-radius:50%;font-size:20px;font-weight:800;display:grid;place-items:center;border:0;cursor:pointer;color:var(--ink);padding:0}@media (max-width:420px){#zoomCtl{right:62px;grid-template-columns:36px 36px;gap:5px}#zoomCtl button{width:36px;height:36px;font-size:18px}}body.kbOpen #zoomCtl{display:none}';document.head.appendChild(st);
  hold('#zcIn',()=>camDist=clampD(camDist-.3));hold('#zcOut',()=>camDist=clampD(camDist+.3));hold('#zcUp',()=>pitch=Math.min(1.25,pitch+.035));hold('#zcDn',()=>pitch=Math.max(.02,pitch-.035));})();
