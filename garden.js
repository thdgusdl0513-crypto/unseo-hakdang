/* ====================== 🪴 화분 가꾸기 ====================== */
(function(){
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const H=3600e3,COOL=4*H,THIRST=24*H,WILT=72*H,MAXP=6;
const STEP=[0,1,3,6,10];
const KINDS={
 tulip:{n:'튤립',i:'🌷',f:1,d:'봄을 알리는 컵 모양 꽃',cols:[['빨강','#e0384a'],['노랑','#f3c21f'],['분홍','#f48fb1'],['보라','#9a5fc8'],['하양','#fbf7ee']]},
 rose:{n:'장미',i:'🌹',f:1,d:'겹겹이 피어나는 꽃잎',cols:[['빨강','#c8102e'],['분홍','#f06292'],['노랑','#f9c74f'],['하양','#fff6ee'],['주황','#f4845f']]},
 gerbera:{n:'거베라',i:'🌼',f:1,d:'햇살처럼 활짝 웃는 꽃',cols:[['주황','#f77f00'],['분홍','#f15bb5'],['노랑','#fcbf49'],['빨강','#e63946'],['하양','#fdfcf5']]},
 pothos:{n:'스킨답서스',i:'🌿',d:'하트 잎이 주렁주렁 늘어져요'},
 rubber:{n:'고무나무',i:'🪴',d:'반질반질 커다란 잎'},
 monstera:{n:'몬스테라',i:'🍃',d:'자라면 잎에 구멍이 숭숭'},
 cactus:{n:'선인장',i:'🌵',d:'다 자라면 꽃이 피어요'},
 sansevieria:{n:'산세베리아',i:'🗡️',d:'쭉쭉 뻗는 칼 모양 잎'}};
const POTS={basic:'토분',ongi:'옹기',celadon:'청자',round:'동글 화분',square:'네모 화분',basket:'라탄 바구니'};
const POTFIX={ongi:1,celadon:1,basket:1};
const PCOL=[['청','#2a62a8'],['적','#c8392f'],['황','#e3b021'],['백','#f4f0e4'],['흑','#2c2c31'],['토','#c8743f'],['분홍','#f2b0c2'],['민트','#9fd4bd'],['라벤더','#b9a6e0'],['하늘','#8fc0e6']];
const DECO={saucer:'🍽️ 받침',ribbon:'🎀 리본',heart:'💗 하트',tag:'🏷️ 이름표',pebble:'🪨 조약돌',butterfly:'🦋 나비',ladybug:'🐞 무당벌레',lights:'✨ 꼬마전구',cat:'🐱 고양이'};
const MAXDECO=4;
const TALK=['고마워요! 💚','쑥쑥 자랄게요!','오늘도 같이 공부해요 📖','햇살이 좋아요 ☀️','간지러워요~ 😆','물맛 최고!','책 읽어 주면 더 잘 자라요','헤헤 🌱'];
/* ---------- 저장 ---------- */
let GD=LS.get('garden',null)||{p:[],ts:0};if(!Array.isArray(GD.p))GD.p=[];
let saveT=null;
function save(){GD.ts=Date.now();LS.set('garden',GD);clearTimeout(saveT);saveT=setTimeout(cloudSave,1500);updDot();}
function packed(){return JSON.stringify({ts:GD.ts,p:GD.p.map(p=>({id:p.id,k:p.k,n:p.n,fc:p.fc,pot:p.pot,pc:p.pc,d:p.d,w:p.w,lw:p.lw,t0:p.t0,fw:p.fw||''}))});}
function cloudSave(){try{if(typeof DB==='undefined'||!DB||typeof MYID==='undefined'||MYID==='me')return;DB.doc('members/'+MYID).set({gd:packed()}).catch(()=>{});}catch(e){}}
let synced=false;
function trySync(){if(synced)return;try{if(typeof membersReady==='undefined'||!membersReady)return;synced=true;const m=MEMBERS[MYID];if(m&&typeof m.gd==='string'){const o=JSON.parse(m.gd);if(o&&Array.isArray(o.p)&&(o.ts||0)>(GD.ts||0)){GD=o;LS.set('garden',GD);updDot();if(isOpen())render();return;}}if(GD.p.length)cloudSave();}catch(e){}}
setInterval(trySync,2000);
/* ---------- 상태 ---------- */
const now=()=>Date.now();
const stage=p=>{let s=0;STEP.forEach((t,i)=>{if(p.w>=t)s=i;});return s;};
const cond=p=>{if(!p.lw)return 'new';const d=now()-p.lw;if(p.w>0&&d>=WILT)return 'wilt';if(d>=THIRST)return 'thirsty';if(d>=COOL)return 'ok';return 'wet';};
const canWater=p=>cond(p)!=='wet';
const stName=p=>{const s=stage(p);return (KINDS[p.k].f?['씨앗','새싹','어린 잎','꽃봉오리','활짝 피었어요']:['모종','새싹','어린 잎','쑥쑥 자람','무성해요'])[s];};
const ago=t=>{const d=now()-t;if(d<60e3)return '방금';if(d<H)return Math.floor(d/60e3)+'분 전';if(d<24*H)return Math.floor(d/H)+'시간 전';return Math.floor(d/24/H)+'일 전';};
const left=p=>{const d=COOL-(now()-p.lw);if(d<=0)return '';const h=Math.floor(d/H),m=Math.ceil((d%H)/60e3);return (h?h+'시간 ':'')+(m?m+'분':'');};
function moist(p){if(!p.lw)return 0;return Math.max(0,Math.min(1,1-(now()-p.lw)/THIRST));}
/* ---------- 그림 ---------- */
function shade(hex,a){let c=hex.replace('#','');if(c.length===3)c=c.split('').map(x=>x+x).join('');const n=parseInt(c,16);let r=n>>16,g=n>>8&255,b=n&255;const f=v=>Math.max(0,Math.min(255,Math.round(a<0?v*(1+a):v+(255-v)*a)));return '#'+[f(r),f(g),f(b)].map(v=>v.toString(16).padStart(2,'0')).join('');}
function rng(seed){let x=0;for(const ch of String(seed))x=(x*31+ch.charCodeAt(0))>>>0;return ()=>{x=(x*1664525+1013904223)>>>0;return x/4294967296;};}
const leafD=(len,w)=>`M0 0C${w*.9} ${-len*.25} ${w*.6} ${-len*.8} 0 ${-len}C${-w*.6} ${-len*.8} ${-w*.9} ${-len*.25} 0 0Z`;
const leaf=(x,y,len,w,a,col,vein)=>`<g transform="translate(${x} ${y}) rotate(${a})"><path d="${leafD(len,w)}" fill="${col}"/>${vein?`<path d="M0 -1L0 ${-len*.85}" stroke="${vein}" stroke-width=".8" fill="none"/>`:''}</g>`;
const heartD=s=>`M0 0C${-s*.2} ${-s*.3} ${-s*.9} ${-s*.5} ${-s*.6} ${-s}C${-s*.4} ${-s*1.25} ${-s*.05} ${-s*1.15} 0 ${-s*.95}C${s*.05} ${-s*1.15} ${s*.4} ${-s*1.25} ${s*.6} ${-s}C${s*.9} ${-s*.5} ${s*.2} ${-s*.3} 0 0Z`;
const heart=(x,y,s,a,col,inner='')=>`<g transform="translate(${x} ${y}) rotate(${a}) translate(0 ${s*.95})"><path d="${heartD(s)}" fill="${col}"/>${inner}</g>`;
const stemL=(d,col='#4a8a3a',w=2.4)=>`<path d="${d}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
const SOILY=104;
function seedArt(){return `<ellipse cx="60" cy="${SOILY-1}" rx="9" ry="3" fill="#6b4a30"/><ellipse cx="60" cy="${SOILY-2.5}" rx="2.8" ry="1.8" fill="#d8b07a"/><path d="M60 ${SOILY-4}q1.5 -3 3.5 -3" stroke="#7cbf5a" stroke-width="1.2" fill="none" stroke-linecap="round"/>`;}
function plantArt(p,uid){const st=stage(p),k=p.k,R=rng(p.id),w=p.w||0;let back='',front='';const B=SOILY+2;
  if(st===0)return {back:seedArt(),front:''};
  const col=KINDS[k].f?KINDS[k].cols[p.fc||0][1]:'';
  if(k==='tulip'){const h=[0,14,30,44,54][st];back+=leaf(56,B,h*.72+8,9,-16,'#5f9e4a')+leaf(64,B,h*.66+7,9,19,'#6aaa52');if(st>=3)back+=leaf(60,B,h*.5,7,-4,'#579444');
    if(st>=2)back+=stemL(`M60 ${B}Q61 ${B-h*.5} 60 ${B-h}`);const y=B-h;
    if(st===3)back+=`<ellipse cx="60" cy="${y-7}" rx="5" ry="8.5" fill="${shade(col,.15)}"/><path d="M55 ${y-3}Q60 ${y+1} 65 ${y-3}" fill="#5f9e4a"/>`;
    if(st===4){back+=`<path d="M60 ${y}C50 ${y-4} 49 ${y-18} 53 ${y-25}C57 ${y-20} 63 ${y-20} 67 ${y-25}C71 ${y-18} 70 ${y-4} 60 ${y}Z" fill="${shade(col,-.18)}"/><path d="M60 ${y}C47 ${y-2} 45 ${y-17} 50 ${y-23}C55 ${y-15} 60 ${y-8} 60 ${y}Z" fill="${shade(col,-.06)}"/><path d="M60 ${y}C73 ${y-2} 75 ${y-17} 70 ${y-23}C65 ${y-15} 60 ${y-8} 60 ${y}Z" fill="${shade(col,-.06)}"/><path d="M60 ${y+1}C51 ${y-3} 52 ${y-18} 60 ${y-25}C68 ${y-18} 69 ${y-3} 60 ${y+1}Z" fill="${col}"/><path d="M57 ${y-6}Q56 ${y-15} 59 ${y-20}" stroke="rgba(255,255,255,.45)" stroke-width="1.4" fill="none"/>`;
      if(w>=15){back+=stemL(`M60 ${B}Q54 ${B-20} 48 ${B-34}`)+`<ellipse cx="48" cy="${B-40}" rx="4.5" ry="7" fill="${shade(col,.1)}"/>`;}}}
  if(k==='rose'){const h=[0,12,26,40,50][st];back+=stemL(`M60 ${B}Q57 ${B-h*.5} 60 ${B-h}`,'#3f7d3a',2.2);
    for(let i=1;i<=Math.max(1,st);i++){const y=B-h*i/(st+1.3),sd=i%2?1:-1;back+=stemL(`M60 ${y}l${sd*7} -4`,'#3f7d3a',1.2)+leaf(60+sd*7,y-4,9,6.5,sd*60,'#3f7d3a','#5f9a52')+leaf(60+sd*4,y-2,6,4.5,sd*20,'#4a8a44');back+=`<path d="M${60-sd} ${y+4}l${-sd*2.5} -1.2l${sd*2.5} -1.2Z" fill="#7a5a3a"/>`;}
    const y=B-h;if(st===3)back+=`<ellipse cx="60" cy="${y-5}" rx="4.2" ry="6.5" fill="${col}"/><path d="M55.5 ${y-1}L60 ${y-8}L64.5 ${y-1}Z" fill="#3f7d3a" opacity=".85"/>`;
    if(st===4){const cy=y-9;let s='';for(let i=0;i<6;i++){const a=i*60*Math.PI/180;s+=`<circle cx="${60+Math.cos(a)*6.5}" cy="${cy+Math.sin(a)*5.5}" r="7" fill="${shade(col,-.15)}"/>`;}for(let i=0;i<5;i++){const a=(i*72+20)*Math.PI/180;s+=`<circle cx="${60+Math.cos(a)*3.2}" cy="${cy+Math.sin(a)*2.8}" r="5" fill="${col}"/>`;}
      s+=`<path d="M60 ${cy}m-1 0a1.5 1.5 0 1 1 3 0a3 3 0 1 1 -6 0a4.5 4.5 0 1 1 9 0" stroke="${shade(col,-.4)}" stroke-width="1" fill="none"/>`;back+=s;
      if(w>=14){back+=stemL(`M60 ${B-h*.55}Q70 ${B-h*.7} 72 ${B-h*.85}`,'#3f7d3a',1.6)+`<ellipse cx="72" cy="${B-h*.85-4}" rx="3.2" ry="5" fill="${col}"/>`;}}}
  if(k==='gerbera'){const n=[0,2,3,4,5][st];for(let i=0;i<n;i++){const a=-62+124*(n===1?.5:i/(n-1));back+=leaf(60,B,14+st*3.5,8.5,a,i%2?'#4f8f3f':'#5a9a48','#7cb86a');}
    const h=[0,0,26,42,52][st];if(st>=2)back+=stemL(`M60 ${B}Q63 ${B-h*.5} 60 ${B-h}`,'#5a9a48',2);const y=B-h;
    if(st===3)back+=`<circle cx="60" cy="${y-3}" r="5" fill="#5a9a48"/><path d="M56 ${y-6}l2 -4l2 3l2 -3l2 4" fill="${col}"/>`;
    if(st===4){const cy=y-6;let s='';for(let i=0;i<20;i++)s+=`<ellipse cx="60" cy="${cy-11}" rx="2.7" ry="7.5" fill="${shade(col,-.12)}" transform="rotate(${i*18+9} 60 ${cy})"/>`;for(let i=0;i<20;i++)s+=`<ellipse cx="60" cy="${cy-10}" rx="2.4" ry="6.5" fill="${col}" transform="rotate(${i*18} 60 ${cy})"/>`;
      s+=`<circle cx="60" cy="${cy}" r="6.5" fill="#e8c840"/><circle cx="60" cy="${cy}" r="4.6" fill="#5a3a1a"/><circle cx="58.5" cy="${cy-1.5}" r="1.3" fill="rgba(255,255,255,.35)"/>`;back+=s;}}
  if(k==='pothos'){const vein=s=>`<path d="M0 1Q${s*.32} ${s*.45} ${s*.12} ${s*.85}" stroke="#f0e27a" stroke-width="1.2" fill="none" opacity=".85"/>`;
    const up=[0,2,3,3,4][st];for(let i=0;i<up;i++){const a=180+(-38+76*(up===1?.5:i/(up-1)));const len=[0,8,12,16,20][st]*(.8+R()*.3);const x=60+Math.sin(a*Math.PI/180)*-len*.0;
      back+=stemL(`M60 ${B}L${60-Math.sin((a-180)*Math.PI/180)*-len} ${B-len}`,'#5a9a3a',1.4)+heart(60+Math.sin((a-180)*Math.PI/180)*len,B-len,6+st*1.2,a,i%2?'#4caf50':'#43a047',vein(6+st*1.2));}
    const vines=[];if(st>=2)vines.push(-1);if(st>=3)vines.push(1);const ext=Math.min(4,Math.max(0,w-10));
    vines.forEach(sd=>{const len=[0,0,16,30,42][st]+ext*5;const x0=60+sd*14,x1=60+sd*31;front+=stemL(`M${x0} ${B-1}Q${60+sd*30} ${B-12} ${x1} ${B+2}L${x1+sd*1} ${B+2+len}`,'#5a9a3a',1.3);
      for(let y=B+4,j=0;y<B+2+len;y+=8.5,j++){const ss=j%2?1:-1;front+=heart(x1+sd*1+ss*1.5,y,5.4+R()*1.2,ss*28,j%3?'#4caf50':'#3e9a46',vein(5.6));}});}
  if(k==='rubber'){const h=[0,16,30,46,58][st];back+=stemL(`M60 ${B}L60 ${B-h}`,'#6b5a3a',3);const n=[0,2,3,4,6][st]+(w>=14?1:0);
    for(let i=0;i<n;i++){const t=(i+.6)/(n+.6),y=B-h*t*.92,sd=i%2?1:-1,len=(17+st*3)*(1.08-t*.3);back+=`<g>${leaf(60,y,len,13+st*1.6,sd*(62+R()*14),i%3?'#2d5a34':'#24502c','#d98a8a')}</g>`+`<ellipse cx="${60+sd*len*.45}" cy="${y-len*.35}" rx="2" ry="4" fill="rgba(255,255,255,.18)" transform="rotate(${sd*50} ${60+sd*len*.45} ${y-len*.35})"/>`;}
    back+=leaf(60,B-h,10,6,0,'#2f6238')+`<path d="M58.8 ${B-h-8}L60 ${B-h-15}L61.2 ${B-h-8}Z" fill="#b24a3a"/>`;}
  if(k==='monstera'){const n=[0,1,2,3,5][st]+(w>=14?1:0);for(let i=0;i<n;i++){const a=-55+110*(n===1?.5:i/(n-1))+(R()-.5)*10;const L=16+st*6*(.8+R()*.3);const ar=a*Math.PI/180;const px=60+Math.sin(ar)*L,py=B-Math.cos(ar)*L;const s=9+st*2.6;const mid=`m${uid}_${i}`;
      back+=stemL(`M60 ${B}Q${60+Math.sin(ar)*L*.3} ${B-L*.7} ${px} ${py}`,'#4f8a3a',1.6);
      if(st>=3){let sl='';[.3,.55,.78].forEach(t=>{[-1,1].forEach(sg=>{sl+=`<path d="M${sg*s*.12} ${s*t}L${sg*s*.95} ${s*t-s*.05}" stroke="#000" stroke-width="${s*.07}"/>`;});});
        back+=`<defs><mask id="${mid}" maskUnits="userSpaceOnUse" x="-40" y="-40" width="80" height="80"><rect x="-40" y="-40" width="80" height="80" fill="#fff"/>${sl}<circle cx="${s*.35}" cy="${s*.42}" r="${s*.06}" fill="#000"/><circle cx="${-s*.38}" cy="${s*.66}" r="${s*.06}" fill="#000"/></mask></defs>`;
        back+=`<g transform="translate(${px} ${py}) rotate(${a+180})"><g mask="url(#${mid})"><g transform="translate(0 ${s*.95})"><path d="${heartD(s)}" fill="#2e7d32"/></g></g><path d="M0 0L0 ${s*.9}" stroke="#66bb6a" stroke-width=".9"/></g>`;}
      else back+=heart(px,py,s,a+180,'#388e3c',`<path d="M0 0L0 ${s*.85}" stroke="#66bb6a" stroke-width=".8" transform="translate(0 ${-s*.95})"/>`);}}
  if(k==='cactus'){const h=[0,12,24,36,44][st],wd=[0,10,13,15,16][st];const x=60-wd/2,y=B-h;let s=`<rect x="${x}" y="${y}" width="${wd}" height="${h+2}" rx="${wd/2}" fill="#5a9a4a"/>`;
    if(st>=3){s=`<path d="M${60+wd/2-1} ${B-h*.45}h7a3.5 3.5 0 0 0 3.5 -3.5v-${8+st}" stroke="#5a9a4a" stroke-width="7" fill="none" stroke-linecap="round"/>`+s;if(st===4||w>=14)s=`<path d="M${60-wd/2+1} ${B-h*.3}h-5a3 3 0 0 1 -3 -3v-7" stroke="#62a352" stroke-width="6" fill="none" stroke-linecap="round"/>`+s;}
    [-.25,0,.25].forEach(o=>{s+=`<path d="M${60+o*wd*1.3} ${y+3}L${60+o*wd*1.3} ${B}" stroke="#3e7a36" stroke-width=".9"/>`;});
    for(let yy=y+4;yy<B-2;yy+=5)[-.25,.25].forEach(o=>{s+=`<path d="M${60+o*wd*1.3} ${yy}l${o>0?2:-2} -1.2" stroke="#fff8d8" stroke-width=".7"/>`;});
    if(st===4){let f='';for(let i=0;i<5;i++)f+=`<ellipse cx="60" cy="${y-4}" rx="2.6" ry="4.5" fill="#f48fb1" transform="rotate(${i*72} 60 ${y-1})"/>`;s+=f+`<circle cx="60" cy="${y-1}" r="2" fill="#fcd34d"/>`;}back+=s;}
  if(k==='sansevieria'){const n=[0,2,3,5,6][st]+(w>=14?1:0);for(let i=0;i<n;i++){const off=(n===1?0:-12+24*i/(n-1))+(R()-.5)*3;const Hh=(16+st*9)*(.7+R()*.35);const x=60+off,lean=off*.35;
      let s=`<path d="M${x-3.8} ${B}Q${x-4.2} ${B-Hh*.6} ${x+lean} ${B-Hh}Q${x+4.2} ${B-Hh*.6} ${x+3.8} ${B}Z" fill="${i%2?'#2f6b3a':'#2a6234'}" stroke="#d9c85a" stroke-width="1.1"/>`;
      for(let j=0;j<4;j++){const yy=B-Hh*(.15+.17*j);s+=`<path d="M${x-2.6+lean*(.15+.17*j)} ${yy}q2.6 -1.6 5.2 0" stroke="#8fbf7a" stroke-width=".9" fill="none" opacity=".55"/>`;}back+=s;}}
  return {back,front};}
function potArt(p){const pot=p.pot||'basic';const col=POTFIX[pot]?null:PCOL[p.pc!=null?p.pc:5][1];let soil='',body='';
  if(pot==='basic'){soil=`<ellipse cx="60" cy="${SOILY}" rx="30" ry="4.5" fill="#4e3322"/>`;body=`<path d="M30 109L90 109L82 150L38 150Z" fill="${col}"/><path d="M68 109L90 109L82 150L66 150Z" fill="rgba(0,0,0,.1)"/><rect x="26" y="100" width="68" height="10" rx="2.5" fill="${shade(col,-.08)}"/><rect x="26" y="100" width="68" height="3" rx="1.5" fill="rgba(255,255,255,.2)"/><path d="M36 113L40 146" stroke="rgba(255,255,255,.2)" stroke-width="3"/>`;}
  if(pot==='ongi'){soil=`<ellipse cx="60" cy="${SOILY-1}" rx="24" ry="4" fill="#4e3322"/>`;body=`<path d="M36 103C20 112 22 140 40 150L80 150C98 140 100 112 84 103Z" fill="#6e4127"/><path d="M70 104C92 114 92 140 78 150L80 150C98 140 100 112 84 103Z" fill="rgba(0,0,0,.15)"/><ellipse cx="60" cy="103" rx="25" ry="4" fill="none" stroke="#4e2d18" stroke-width="3"/><path d="M31 122q4 -3 8 0t8 0t8 0t8 0t8 0t8 0t8 0" stroke="#c9a07a" stroke-width="1.3" fill="none" opacity=".7"/><path d="M31 128q4 -3 8 0t8 0t8 0t8 0t8 0t8 0t8 0" stroke="#c9a07a" stroke-width="1" fill="none" opacity=".5"/><path d="M33 112Q28 128 38 144" stroke="rgba(255,255,255,.18)" stroke-width="3" fill="none"/>`;}
  if(pot==='celadon'){soil=`<ellipse cx="60" cy="${SOILY}" rx="27" ry="4" fill="#4e3322"/>`;body=`<path d="M32 104C27 122 36 146 52 150L68 150C84 146 93 122 88 104Z" fill="#9ec9b2"/><path d="M72 106C90 122 82 146 68 150C84 146 93 122 88 104Z" fill="rgba(0,60,40,.12)"/><ellipse cx="60" cy="104" rx="28" ry="4" fill="none" stroke="#7fae96" stroke-width="2.4"/><path d="M44 120c3 -4 7 -4 9 0c2 -3 5 -3 7 0" stroke="#eef7f0" stroke-width="1.1" fill="none"/><path d="M60 134l5 -3l5 3m-5 -3l2 -5" stroke="#eef7f0" stroke-width="1" fill="none"/><circle cx="74" cy="118" r="2.2" fill="none" stroke="#eef7f0" stroke-width=".9"/><path d="M37 110Q34 128 44 144" stroke="rgba(255,255,255,.3)" stroke-width="2.5" fill="none"/>`;}
  if(pot==='round'){soil=`<ellipse cx="60" cy="${SOILY}" rx="32" ry="5" fill="#4e3322"/>`;body=`<path d="M26 104C26 132 40 152 60 152C80 152 94 132 94 104Z" fill="${col}"/><path d="M66 104C86 120 80 150 60 152C80 152 94 132 94 104Z" fill="rgba(0,0,0,.1)"/><ellipse cx="60" cy="104" rx="34" ry="4.5" fill="none" stroke="${shade(col,-.12)}" stroke-width="2.5"/><path d="M33 112Q34 134 48 146" stroke="rgba(255,255,255,.25)" stroke-width="3" fill="none"/>`;}
  if(pot==='square'){soil=`<ellipse cx="60" cy="${SOILY}" rx="29" ry="4" fill="#4e3322"/>`;body=`<rect x="31" y="105" width="58" height="45" rx="4" fill="${col}"/><rect x="66" y="105" width="23" height="45" rx="3" fill="rgba(0,0,0,.09)"/><rect x="28" y="100" width="64" height="8" rx="2" fill="${shade(col,-.08)}"/><rect x="35" y="111" width="3" height="34" rx="1.5" fill="rgba(255,255,255,.22)"/>`;}
  if(pot==='basket'){soil=`<ellipse cx="60" cy="${SOILY}" rx="30" ry="4.5" fill="#4e3322"/>`;let wv='';for(let y=110;y<150;y+=6)wv+=`<path d="M${30+(y-104)*.17} ${y}L${90-(y-104)*.17} ${y}" stroke="#a47a42" stroke-width="1"/>`;for(let x=36;x<86;x+=7)wv+=`<path d="M${x} 108L${x+(60-x)*.12} 148" stroke="#b38a52" stroke-width="2.2" stroke-dasharray="3 3"/>`;
    body=`<path d="M29 104L91 104L83 150L37 150Z" fill="#c79a5e"/>${wv}<path d="M68 104L91 104L83 150L66 150Z" fill="rgba(0,0,0,.08)"/><rect x="26" y="100" width="68" height="7" rx="3.5" fill="#b3854a"/><path d="M28 103.5h64" stroke="#d8b07a" stroke-width="1.6" stroke-dasharray="4 2"/>`;}
  return {soil,body,col:col||({ongi:'#6e4127',celadon:'#9ec9b2',basket:'#c79a5e'})[pot]};}
function decoArt(p,layer){const d=p.d||[];let s='';const st=stage(p);const topY=SOILY-[6,16,32,46,56][st];
  if(layer==='under'&&d.includes('saucer'))s+=`<ellipse cx="60" cy="151" rx="37" ry="5.5" fill="${shade(potArt(p).col,-.2)}"/><ellipse cx="60" cy="150" rx="33" ry="3" fill="rgba(255,255,255,.18)"/>`;
  if(layer==='soil'){if(d.includes('pebble'))s+=`<ellipse cx="47" cy="${SOILY+.5}" rx="3.2" ry="2" fill="#b8b2a8"/><ellipse cx="54" cy="${SOILY+1.8}" rx="2.4" ry="1.6" fill="#d8d2c6"/><ellipse cx="71" cy="${SOILY+1}" rx="3" ry="1.9" fill="#9a958c"/><ellipse cx="66" cy="${SOILY+2.2}" rx="2" ry="1.3" fill="#e2ddd2"/>`;
    if(d.includes('tag'))s+=`<path d="M84 ${SOILY+1}L84 80" stroke="#a07a4a" stroke-width="1.6"/><rect x="72" y="71" width="25" height="12" rx="2" fill="#f6e6c4" stroke="#a07a4a" stroke-width=".9"/><text x="84.5" y="79.3" font-size="6.2" text-anchor="middle" fill="#5a3a20" font-family="Gowun Dodum,serif">${esc(String(p.n||'').slice(0,5))}</text>`;}
  if(layer==='front'){if(d.includes('ribbon'))s+=`<g transform="translate(60 ${p.pot==='square'?118:116})"><path d="M0 0C-6 -7 -15 -5 -13 1C-11 6 -5 3 0 0Z" fill="#e8556d"/><path d="M0 0C6 -7 15 -5 13 1C11 6 5 3 0 0Z" fill="#e8556d"/><path d="M-1 1L-6 11L-3 10L-1 13Z M1 1L6 11L3 10L1 13Z" fill="#d43f5a"/><circle r="2.6" fill="#c8304a"/></g>`;
    if(d.includes('heart'))s+=`<path d="M44 132c-2.5 -3.5 -7.5 -1 -5 2.5l5 5l5 -5c2.5 -3.5 -2.5 -6 -5 -2.5Z" fill="#ff7aa2" stroke="#fff" stroke-width="1.2"/>`;
    if(d.includes('ladybug')&&st>=1)s+=`<g transform="translate(${st>=3?50:55} ${SOILY-Math.max(6,(SOILY-topY)*.45)})"><circle r="3.2" fill="#d92e2e"/><circle cx="0" cy="-3" r="1.6" fill="#222"/><path d="M0 -2V3" stroke="#222" stroke-width=".6"/><circle cx="-1.4" cy="0" r=".7" fill="#222"/><circle cx="1.4" cy="1" r=".7" fill="#222"/></g>`;
    if(d.includes('lights'))s+=`<path d="M30 ${topY+16}Q60 ${topY+34} 90 ${topY+12}" stroke="#5a4a3a" stroke-width=".6" fill="none"/>`+[0,1,2,3,4,5].map(i=>{const t=(i+.5)/6;const x=(1-t)*(1-t)*30+2*(1-t)*t*60+t*t*90,y=(1-t)*(1-t)*(topY+16)+2*(1-t)*t*(topY+34)+t*t*(topY+12);return `<circle class="gdBlink" style="animation-delay:${i*.35}s" cx="${x}" cy="${y+2}" r="2.1" fill="${['#ffd65a','#ff8fb0','#8fe0ff','#b9ff8f'][i%4]}"/>`;}).join('');
    if(d.includes('butterfly'))s+=`<g class="gdFly"><g transform="translate(88 ${Math.max(18,topY-4)})"><g class="gdWing"><ellipse cx="-3.5" cy="-2" rx="4" ry="3" fill="#f6a6d0"/><ellipse cx="-2.6" cy="2" rx="2.6" ry="2" fill="#f9c3e0"/><ellipse cx="3.5" cy="-2" rx="4" ry="3" fill="#a6c8f6"/><ellipse cx="2.6" cy="2" rx="2.6" ry="2" fill="#c6dcfa"/></g><path d="M0 -4V4" stroke="#3a2a2a" stroke-width="1.2" stroke-linecap="round"/></g></g>`;
    if(d.includes('cat'))s+=`<g transform="translate(104 140)"><path d="M6 10Q14 8 11 0" stroke="#e8b070" stroke-width="2.4" fill="none" stroke-linecap="round"/><ellipse cx="0" cy="5" rx="7" ry="6.5" fill="#f2c48a"/><circle cx="0" cy="-5" r="6" fill="#f2c48a"/><path d="M-5.5 -8L-4.5 -14L-1 -10Z M5.5 -8L4.5 -14L1 -10Z" fill="#f2c48a"/><circle cx="-2.2" cy="-5" r=".9" fill="#3a2a20"/><circle cx="2.2" cy="-5" r=".9" fill="#3a2a20"/><path d="M-1 -2.6q1 .8 2 0" stroke="#3a2a20" stroke-width=".6" fill="none"/><circle cx="-4" cy="-3" r="1.2" fill="#f7a0a0" opacity=".6"/><circle cx="4" cy="-3" r="1.2" fill="#f7a0a0" opacity=".6"/></g>`;}
  return s;}
let UID=0;
function potSVG(p,cls=''){const c=cond(p);const uid='g'+(UID++);const pa=plantArt(p,uid),po=potArt(p);
  const pc=c==='wilt'?'pl-wilt':c==='thirsty'?'pl-thirsty':'';
  return `<svg viewBox="0 0 120 160" class="gdSvg ${cls}">${decoArt(p,'under')}${po.soil}${decoArt(p,'soil')}<g class="gdPlant ${pc}"><g class="gdSway">${pa.back}</g></g>${po.body}<g class="${pc}">${pa.front}</g>${decoArt(p,'front')}</svg>`;}
/* ---------- 화면 ---------- */
let view={tab:'mine',sel:null,mode:null,draft:null};
const isOpen=()=>{const el=document.getElementById('garden');return el&&el.classList.contains('show');};
const body=()=>document.getElementById('gdBody');
const drop=p=>{const c=cond(p);return c==='new'?'💧?':c==='wilt'?'🥀':c==='thirsty'?'😥':c==='ok'?'💧':'✨';};
function shelf(plants,owner){const cells=plants.map(p=>`<button class="gdPot" ${owner?`data-gdf="${owner}" data-gdp="${esc(p.id)}"`:`data-gdsel="${esc(p.id)}"`}>${potSVG(p,'sm')}<i class="gdPlank"></i><b>${esc(p.n||KINDS[p.k].n)}</b><small>${drop(p)} ${stName(p)}</small></button>`);
  if(!owner&&plants.length<MAXP)cells.push(`<button class="gdPot add" id="gdAdd"><span>＋</span><i class="gdPlank"></i><b>새 화분 심기</b><small>${plants.length}/${MAXP}</small></button>`);
  return `<div class="gdShelf"><div class="gdWin"></div><div class="gdGrid">${cells.join('')}</div></div>`;}
function friendList(){let out='';try{Object.entries(MEMBERS).forEach(([id,m])=>{if(id===MYID||!m||typeof m.gd!=='string')return;let o;try{o=JSON.parse(m.gd);}catch(e){return;}if(!o||!Array.isArray(o.p)||!o.p.length)return;const ps=o.p.filter(p=>p&&KINDS[p.k]).slice(0,MAXP);
  out+=`<div class="gdFr"><div class="gdFrH">🌱 <b>${esc(m.nick||'친구')}</b>님의 창가 <small>${ps.length}개</small></div>${shelf(ps,id)}</div>`;});}catch(e){}
  return out||'<div class="empty" style="text-align:center">아직 화분을 키우는 친구가 없어요.<br>친구들에게 화분 가꾸기를 알려 줘요 🌷</div>';}
function render(){const el=body();if(!el)return;
  if(view.mode==='new')return renderNew();
  if(view.mode==='deco')return renderDeco();
  if(view.sel){const p=GD.p.find(x=>x.id===view.sel);if(p)return renderOne(p);view.sel=null;}
  if(view.fr){return renderFriendPot();}
  const tabs=`<div class="gdTabs"><button class="${view.tab==='mine'?'on':''}" data-gdtab="mine">🪴 내 창가</button><button class="${view.tab==='fr'?'on':''}" data-gdtab="fr">🏡 친구 창가</button></div>`;
  if(view.tab==='fr'){el.innerHTML=tabs+`<div class="gdHint">친구 화분이 목말라 보이면 💧 물을 보내 줄 수 있어요</div>`+friendList();return;}
  const th=GD.p.filter(p=>['new','ok','thirsty','wilt'].includes(cond(p))).length;
  el.innerHTML=tabs+`<div class="gdHint">${GD.p.length?(th?`💧 물을 기다리는 화분이 <b>${th}</b>개 있어요`:'모두 촉촉해요 ✨ 4시간마다 물을 줄 수 있어요'):'창가가 비어 있어요. 첫 화분을 심어 볼까요?'}</div>`+shelf(GD.p);}
function bar(v,cls=''){return `<div class="gdBar ${cls}"><i style="width:${Math.round(v*100)}%"></i></div>`;}
function renderOne(p){const K=KINDS[p.k];const st=stage(p),c=cond(p);const nx=STEP[st+1];
  const status={new:'🌱 막 심었어요! 첫 물을 주세요',wet:`💧 흙이 촉촉해요 · ${left(p)} 뒤에 또 줄 수 있어요`,ok:'💧 물을 줄 수 있어요',thirsty:'😥 목말라요! 물을 주세요',wilt:'🥀 시들었어요… 물을 주면 다시 살아나요'}[c];
  body().innerHTML=`<button class="ghost sm" data-gdback>‹ 창가로</button>
  <div class="gdStage"><div class="gdBig" id="gdBig">${potSVG(p,'big')}<div id="gdFx"></div></div></div>
  <div class="gdName"><b>${esc(p.n||K.n)}</b><small>${K.i} ${K.n}${K.f?` · ${K.cols[p.fc||0][0]}`:''} · ${stName(p)}</small></div>
  <div class="gdStat"><span>🌱 자람</span>${bar(nx?(p.w-STEP[st])/(nx-STEP[st]):1,'grow')}<small>${nx?`다음 단계까지 물 ${nx-p.w}번`:`다 자랐어요! (물 ${p.w}번)`}</small></div>
  <div class="gdStat"><span>💧 촉촉</span>${bar(moist(p),'wet')}<small>${p.lw?`마지막 물 ${ago(p.lw)}`:'아직 물을 안 줬어요'}</small></div>
  <div class="gdMsg">${status}${p.fw?`<br><small>💌 ${esc(p.fw)}님이 물을 줬었어요</small>`:''}</div>
  <div class="gdBtns"><button class="primary" id="gdWater" ${canWater(p)?'':'disabled'}>💧 물 주기</button><button class="ghost" id="gdPet">🫶 쓰다듬기</button></div>
  <div class="gdBtns"><button class="ghost" id="gdDeco">🎨 꾸미기</button><button class="ghost" id="gdRename">✏️ 이름</button><button class="ghost" id="gdDel">🗑️ 비우기</button></div>
  <div class="gdTip">${K.d} · 4시간마다 물을 줄 수 있고, 하루 넘게 안 주면 목말라해요. 사흘이 지나면 시들어요.</div>`;}
function renderFriendPot(){const {owner,pid}=view.fr;let p=null,nick='친구';try{const m=MEMBERS[owner];nick=m.nick||'친구';p=JSON.parse(m.gd).p.find(x=>x.id===pid);}catch(e){}
  if(!p||!KINDS[p.k]){view.fr=null;return render();}const K=KINDS[p.k];const c=cond(p);const sent=SENT[owner+'/'+pid]&&now()-SENT[owner+'/'+pid]<COOL;
  body().innerHTML=`<button class="ghost sm" data-gdback>‹ 친구 창가로</button><div class="gdStage"><div class="gdBig" id="gdBig">${potSVG(p,'big')}<div id="gdFx"></div></div></div>
  <div class="gdName"><b>${esc(p.n||K.n)}</b><small>${esc(nick)}님의 ${K.i} ${K.n} · ${stName(p)}</small></div>
  <div class="gdStat"><span>💧 촉촉</span>${bar(moist(p),'wet')}<small>${p.lw?`마지막 물 ${ago(p.lw)}`:'아직 물을 안 받았어요'}</small></div>
  <div class="gdBtns"><button class="primary" id="gdFWater" ${canWater(p)&&!sent?'':'disabled'}>💧 ${sent?'물을 보냈어요':canWater(p)?'물 보내 주기':'촉촉해서 괜찮대요'}</button></div>
  <div class="gdTip">친구가 학당에 들어와 있으면 바로, 아니면 다음에 들어올 때 화분이 물을 마셔요.</div>`;}
function renderNew(){const d=view.draft;const K=KINDS[d.k];
  body().innerHTML=`<button class="ghost sm" data-gdback>‹ 창가로</button><div class="gdSec">1. 무엇을 심을까요?</div>
  <div class="gdKinds">${Object.entries(KINDS).map(([k,v])=>`<button class="${d.k===k?'on':''}" data-gdk="${k}"><span>${v.i}</span><b>${v.n}</b><small>${v.f?'꽃':'잎'}</small></button>`).join('')}</div>
  ${K.f?`<div class="gdSec">2. 꽃 색깔</div><div class="gdSw">${K.cols.map((c,i)=>`<button class="${d.fc===i?'on':''}" data-gdfc="${i}" style="--c:${c[1]}" title="${c[0]}"></button>`).join('')}</div>`:''}
  <div class="gdSec">${K.f?3:2}. 화분</div><div class="gdPots">${Object.entries(POTS).map(([k,v])=>`<button class="${d.pot===k?'on':''}" data-gdpot="${k}">${v}</button>`).join('')}</div>
  ${POTFIX[d.pot]?'':`<div class="gdSw">${PCOL.map((c,i)=>`<button class="${d.pc===i?'on':''}" data-gdpc="${i}" style="--c:${c[1]}" title="${c[0]}"><small>${c[0]}</small></button>`).join('')}</div>`}
  <div class="gdPrev">${potSVG(Object.assign({},d,{w:STEP[4],lw:now()}),'mid')}<small>다 자라면 이런 모습이에요</small></div>
  <div class="gdSec">이름</div><input id="gdNm" maxlength="8" value="${esc(d.n)}" placeholder="${K.n}">
  <button class="primary" id="gdPlant" style="width:100%;margin-top:10px">🌱 심기</button>`;}
function renderDeco(){const p=GD.p.find(x=>x.id===view.sel);if(!p){view.mode=null;return render();}const K=KINDS[p.k];
  body().innerHTML=`<button class="ghost sm" data-gdback>‹ 화분으로</button><div class="gdStage"><div class="gdBig mid">${potSVG(p,'big')}</div></div>
  ${K.f?`<div class="gdSec">꽃 색깔</div><div class="gdSw">${K.cols.map((c,i)=>`<button class="${(p.fc||0)===i?'on':''}" data-gdfc="${i}" style="--c:${c[1]}" title="${c[0]}"></button>`).join('')}</div>`:''}
  <div class="gdSec">화분 모양</div><div class="gdPots">${Object.entries(POTS).map(([k,v])=>`<button class="${p.pot===k?'on':''}" data-gdpot="${k}">${v}</button>`).join('')}</div>
  ${POTFIX[p.pot]?'':`<div class="gdSec">화분 색 <small>오방색 · 파스텔</small></div><div class="gdSw">${PCOL.map((c,i)=>`<button class="${p.pc===i?'on':''}" data-gdpc="${i}" style="--c:${c[1]}"><small>${c[0]}</small></button>`).join('')}</div>`}
  <div class="gdSec">장식 <small>${MAXDECO}개까지</small></div><div class="gdDecos">${Object.entries(DECO).map(([k,v])=>`<button class="${(p.d||[]).includes(k)?'on':''}" data-gdd="${k}">${v}</button>`).join('')}</div>`;}
/* ---------- 동작 ---------- */
function fx(kind){const f=document.getElementById('gdFx');if(!f)return;if(kind==='water'){f.innerHTML=`<span class="gdCan">🫖</span>`+Array.from({length:9},(_,i)=>`<i class="gdDrop" style="left:${38+i*3}%;animation-delay:${.25+i*.07}s"></i>`).join('');}
  else f.innerHTML=Array.from({length:5},(_,i)=>`<i class="gdHeart" style="left:${30+i*10}%;animation-delay:${i*.12}s">${['💚','💗','✨','💛','💚'][i]}</i>`).join('');
  const b=document.getElementById('gdBig');if(b){b.classList.remove('bounce');void b.offsetWidth;b.classList.add('bounce');}setTimeout(()=>{if(f)f.innerHTML='';},1900);}
function water(p,by){const c=cond(p);if(c==='wet')return false;const before=stage(p);if(c==='wilt'){p.lw=now();if(by)p.fw=by;return 'revive';}p.w=(p.w||0)+1;p.lw=now();if(by)p.fw=by;return stage(p)>before?'up':'ok';}
function afterWater(p,res){save();render();fx('water');try{chime();}catch(e){}
  const K=KINDS[p.k];setTimeout(()=>{if(res==='revive')toast(`🌿 ${esc(p.n||K.n)}가 다시 기운을 차렸어요!`);else if(res==='up'){const st=stage(p);toast(st===4?(K.f?`🎉 ${esc(p.n||K.n)} 꽃이 활짝 피었어요!`:`🎉 ${esc(p.n||K.n)}가 다 자랐어요!`):`🌱 ${esc(p.n||K.n)} · ${stName(p)}!`);try{if(st===4)doEmote('jump');}catch(e){}}else toast('💧 꿀꺽꿀꺽~ '+TALK[Math.floor(Math.random()*TALK.length)]);},700);}
const SENT={};
window.__gardenWater=function(from,m){const p=GD.p.find(x=>x.id===m.pid);if(!p)return;const who=String(m.nm||(typeof nameOf==='function'?nameOf(from):'친구')).slice(0,12);const r=water(p,who);if(!r)return;save();if(isOpen())render();toast(`💌 ${esc(who)}님이 ${esc(p.n||KINDS[p.k].n)}에 물을 줬어요 💧`);};
function updDot(){const d=document.getElementById('gdDot');if(!d)return;d.hidden=!GD.p.some(p=>['new','thirsty','wilt'].includes(cond(p)));}
setInterval(()=>{updDot();if(isOpen()&&!view.mode&&!document.activeElement.closest?.('#garden input'))render();},60e3);setTimeout(updDot,1500);
document.addEventListener('click',e=>{const t=e.target;if(!t.closest||!t.closest('#garden'))return;
  const tb=t.closest('[data-gdtab]');if(tb){view.tab=tb.dataset.gdtab;render();return;}
  if(t.closest('[data-gdback]')){if(view.mode==='deco'){view.mode=null;}else if(view.mode==='new'){view.mode=null;}else{view.sel=null;view.fr=null;}render();return;}
  const sl=t.closest('[data-gdsel]');if(sl){view.sel=sl.dataset.gdsel;render();return;}
  const fp=t.closest('[data-gdf]');if(fp){view.fr={owner:fp.dataset.gdf,pid:fp.dataset.gdp};render();return;}
  if(t.closest('#gdAdd')){if(GD.p.length>=MAXP){toast(`화분은 ${MAXP}개까지 둘 수 있어요`);return;}view.mode='new';view.draft={id:'p'+Date.now().toString(36)+Math.random().toString(36).slice(2,5),k:'tulip',fc:0,pot:'basic',pc:5,d:[],w:0,lw:0,n:''};render();return;}
  if(view.mode==='new'){const d=view.draft;const nmEl=document.getElementById('gdNm');if(nmEl)d.n=nmEl.value.slice(0,8);
    const k=t.closest('[data-gdk]');if(k){d.k=k.dataset.gdk;d.fc=0;render();return;}
    const fc=t.closest('[data-gdfc]');if(fc){d.fc=+fc.dataset.gdfc;render();return;}
    const po=t.closest('[data-gdpot]');if(po){d.pot=po.dataset.gdpot;render();return;}
    const pc=t.closest('[data-gdpc]');if(pc){d.pc=+pc.dataset.gdpc;render();return;}
    if(t.closest('#gdPlant')){const p=Object.assign({},d,{n:(d.n||'').trim().slice(0,8)||KINDS[d.k].n,t0:now(),w:0,lw:0});GD.p.push(p);save();view.mode=null;view.sel=p.id;render();setTimeout(()=>toast(`🌱 ${esc(p.n)}를 심었어요! 물을 주세요`),200);return;}return;}
  if(view.mode==='deco'){const p=GD.p.find(x=>x.id===view.sel);if(!p)return;
    const fc=t.closest('[data-gdfc]');if(fc){p.fc=+fc.dataset.gdfc;save();render();return;}
    const po=t.closest('[data-gdpot]');if(po){p.pot=po.dataset.gdpot;if(p.pc==null)p.pc=5;save();render();return;}
    const pc=t.closest('[data-gdpc]');if(pc){p.pc=+pc.dataset.gdpc;save();render();return;}
    const dd=t.closest('[data-gdd]');if(dd){const k=dd.dataset.gdd;p.d=p.d||[];if(p.d.includes(k))p.d=p.d.filter(x=>x!==k);else{if(p.d.length>=MAXDECO){toast(`장식은 ${MAXDECO}개까지 달 수 있어요`);return;}p.d.push(k);}save();render();return;}return;}
  if(view.fr&&t.closest('#gdFWater')){const {owner,pid}=view.fr;if(!window.__sendG){toast('친구 화분은 함께 쓰는 학당에서만 물을 줄 수 있어요');return;}window.__sendG(owner,{k:'pw',pid,nm:(typeof ST==='object'&&ST.nick)||'친구'});SENT[owner+'/'+pid]=now();render();fx('water');toast('💧 물을 보냈어요!');return;}
  const p=GD.p.find(x=>x.id===view.sel);if(!p)return;
  if(t.closest('#gdWater')){const r=water(p);if(!r){toast(`흙이 아직 촉촉해요 · ${left(p)} 뒤에 주세요`);return;}afterWater(p,r);return;}
  if(t.closest('#gdPet')||t.closest('#gdBig')){fx('pet');toast(esc(p.n||KINDS[p.k].n)+': '+TALK[Math.floor(Math.random()*TALK.length)]);return;}
  if(t.closest('#gdDeco')){view.mode='deco';render();return;}
  if(t.closest('#gdRename')){const n=prompt('화분 이름 (8자까지)',p.n||'');if(n!=null&&n.trim()){p.n=n.trim().slice(0,8);save();render();}return;}
  if(t.closest('#gdDel')){if(confirm(`${p.n||KINDS[p.k].n} 화분을 비울까요? 다시 되돌릴 수 없어요.`)){GD.p=GD.p.filter(x=>x!==p);save();view.sel=null;render();}return;}});
const prevOpen=window.__socialOpen;window.__socialOpen=id=>{if(prevOpen)prevOpen(id);if(id==='garden'){view={tab:'mine',sel:null,mode:null,draft:null};render();}};
window.__garden=()=>GD;
})();
