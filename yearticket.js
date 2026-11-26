/* 🧾 올해 결산 영수증 · 보딩패스 모양으로 한 해 돌아보기 (이미지 저장은 11·12월에만) */
(function(){
const $q=s=>document.querySelector(s);
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const NOW=()=>new Date();
const YEAR=()=>NOW().getFullYear();
const isDec=()=>NOW().getMonth()>=10;
const DEF=[['올해의 노래',''],['올해의 책',''],['올해의 드라마·영화',''],['올해의 음식',''],['올해의 장소',''],['올해의 친구',''],['올해의 순간',''],['올해 잘한 일',''],['내년의 나에게','']];
const OPTS=['올해의 노래','올해의 앨범','올해의 가수','올해의 책','올해의 웹툰','올해의 웹소설','올해의 드라마·영화','올해의 드라마','올해의 영화','올해의 유튜브','올해의 게임','올해의 음식','올해의 간식','올해의 장소','올해의 여행','올해의 친구','올해의 선생님','올해의 과목','올해의 순간','올해의 사진','올해의 소비','올해의 취미','올해의 말버릇','올해의 노력','올해 잘한 일','올해 아쉬운 일','올해의 나에게','내년의 나에게','내년 목표'];
const T=(document.title||'').split(/[ ·]/)[0]||'학당';
const AIR={'송현학당':['SONGHYEON','SHY'],'몽원학당':['MONGWON','MGW'],'청도학당':['CHEONGDO','CHD'],'운서학당':['UNSEO','USH']}[T]||['HAKDANG','HDG'];
function load(){const v=LS.get('yearPicks',null);if(v&&v.y===YEAR()&&Array.isArray(v.items))return v;return {y:YEAR(),items:DEF.map(x=>x.slice())};}
let P=load();
function save(){LS.set('yearPicks',P);}
function stats(){const y=String(YEAR()),y0=new Date(YEAR(),0,1).getTime();let st=0,min=0,bk=0;
  try{st=Object.keys((typeof myDays!=='undefined'&&myDays)||{}).filter(k=>k.startsWith(y)).length;}catch(e){}
  try{const id=typeof MYID!=='undefined'?MYID:'me';min=Math.round((DATA.logs||[]).filter(l=>(l.by===id||l.by==='me')&&(l.ts||0)>=y0).reduce((a,l)=>a+(+l.sec||0),0)/60);}catch(e){}
  try{const id=typeof MYID!=='undefined'?MYID:'me';bk=(DATA.books||[]).filter(b=>(b.by===id||b.by==='me')&&(b.ts||0)>=y0).length;}catch(e){}
  return {st,min,bk};}
function nick(){try{return (ST&&ST.nick)||'나';}catch(e){return '나';}}
function hashN(s){let h=7;for(const c of String(s))h=(h*31+c.charCodeAt(0))>>>0;return h;}

/* ---------- 영수증 그리기 (캔버스) ---------- */
const W=1000;let H=1700;
function rr(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}
function wrap(c,t,maxW){const out=[];let line='';for(const ch of String(t)){const tt=line+ch;if(c.measureText(tt).width>maxW&&line){out.push(line);line=ch;}else line=tt;}if(line)out.push(line);return out;}
async function draw(cv,PR){
  try{await Promise.race([Promise.all(['40px "Nova Mono"','40px "Orbit"'].map(f=>document.fonts.load(f))),new Promise(r=>setTimeout(r,2500))]);}catch(e){}
  const MONO='"Nova Mono","Orbit","Courier New",monospace',KR='"Orbit","Gowun Dodum",sans-serif';
  const red=PR?'#000':'#d2232a',ink=PR?'#000':'#1d1b19',sub=PR?'#333':'rgba(29,27,25,.62)';const L=70,R=W-70;
  const items=P.items.filter(x=>String(x[1]||'').trim()).slice(0,9);
  const t0=document.createElement('canvas').getContext('2d');t0.font=`38px ${MONO}`;
  const rows=items.map((it,i)=>{const lab=String(it[0]||'올해의 것').slice(0,14),val=String(it[1]).trim().slice(0,40);t0.font=`38px ${MONO}`;const lines=wrap(t0,lab+'  '+val,R-L-90);return {i,lab,val,h:Math.max(1,Math.ceil((t0.measureText(lab).width+t0.measureText(val).width+60)/(R-L-90)))};});
  const rowH=rows.reduce((a,r)=>a+(r.h>1?96:56),0)||90;
  const paint=Hh=>{H=Hh;cv.width=W;cv.height=H;const c=cv.getContext('2d');c.clearRect(0,0,W,H);
  /* 종이 */
  if(PR){c.fillStyle='#fff';c.fillRect(0,0,W,H);}
  let sd=hashN(nick()+YEAR());const rnd=()=>{sd=(sd*1103515245+12345)>>>0;return sd/4294967296;};
  if(!PR){c.save();rr(c,14,14,W-28,H-28,22);c.clip();
  c.fillStyle='#efe6da';c.fillRect(0,0,W,H);
  for(let i=0;i<9000;i++){c.fillStyle=`rgba(60,45,30,${.03+rnd()*.07})`;c.fillRect(rnd()*W,rnd()*H,1.3,1.3);}
  for(let y=0;y<H;y+=7)for(let x=(y/7)%2?3.5:0;x<W;x+=7){c.fillStyle='rgba(90,70,50,.05)';c.beginPath();c.arc(x,y,1.1,0,6.3);c.fill();}
  /* 구김 자국 */
  for(let k=0;k<4;k++){const x1=rnd()*W,y1=rnd()*H;const gr=c.createLinearGradient(x1,y1,x1+300,y1+260);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(.5,'rgba(255,255,255,.28)');gr.addColorStop(.52,'rgba(120,100,80,.08)');gr.addColorStop(1,'rgba(255,255,255,0)');c.fillStyle=gr;c.fillRect(0,0,W,H);}
  /* 왼쪽 아래 하프톤 얼룩 */
  for(let y=H-330;y<H;y+=8)for(let x=0;x<W*.62;x+=8){const d=Math.hypot((x-60)/1.4,(y-H-20));const a=Math.max(0,1-d/420)*(.55+.45*Math.sin(x*.02+y*.013));if(a>.05){c.fillStyle=`rgba(40,36,32,${a*.7})`;c.beginPath();c.arc(x+(rnd()-.5)*2,y+(rnd()-.5)*2,1+a*2.6,0,6.3);c.fill();}}
  c.restore();}
  const dash=y=>{c.strokeStyle=ink;c.lineWidth=3;c.setLineDash([14,10]);c.beginPath();c.moveTo(L,y);c.lineTo(R,y);c.stroke();c.setLineDash([]);};
  const mono=(t,x,y,al,sz,col)=>{c.font=`${sz||38}px ${MONO}`;c.fillStyle=col||ink;c.textAlign=al||'left';c.fillText(t,x,y);c.textAlign='left';};
  /* 머리 */
  c.textAlign='right';c.fillStyle=ink;c.font=`38px ${MONO}`;c.fillText(`No. ${String(YEAR()).padStart(6,'0')}`,R,104);c.textAlign='left';
  c.fillStyle=red;c.textAlign='center';c.font=`110px ${MONO}`;c.fillText('The Receipt',W/2,316);c.textAlign='left';
  dash(388);
  mono(`ORDER #${YEAR()}`,L,446);
  const dd=NOW();const DW=['SUNDAY','MONDAY','TUESDAY','WEDNESDAY','THURSDAY','FRIDAY','SATURDAY'],MO=['JANUARY','FEBRUARY','MARCH','APRIL','MAY','JUNE','JULY','AUGUST','SEPTEMBER','OCTOBER','NOVEMBER','DECEMBER'];
  mono(`${DW[dd.getDay()]}, ${MO[dd.getMonth()]} ${dd.getDate()}, ${dd.getFullYear()}`,L,496);
  dash(530);mono('QTY',L,580);mono('ITEM',L+130,580);mono('PICK',R,580,'right');dash(606);
  /* 품목 */
  let y=666;
  if(!rows.length){mono('아래 칸에 올해의 픽을 적어 보세요',W/2,y+10,'center',36,sub);y+=90;}
  rows.forEach(r=>{mono(String(r.i+1).padStart(2,'0'),L,y);c.font=`38px ${MONO}`;c.fillStyle=ink;const lab=r.lab;c.fillText(lab,L+130,y);const lw=c.measureText(lab).width;
    const vw=c.measureText(r.val).width;
    if(L+130+lw+40+vw<=R){c.font=`38px ${MONO}`;c.fillStyle=sub;let dots='';const room=R-vw-(L+130+lw)-24;while(c.measureText(dots+'.').width<room)dots+='.';c.fillText(dots,L+130+lw+12,y);c.fillStyle=ink;c.textAlign='right';c.fillText(r.val,R,y);c.textAlign='left';y+=56;}
    else{c.fillStyle=ink;c.textAlign='right';const ln=wrap(c,r.val,R-L-160).slice(0,2);ln.forEach((l,j)=>c.fillText(l,R,y+40+j*40));c.textAlign='left';y+=96;}});
  y+=4;dash(y);y+=52;
  const s=stats();const hm=`${Math.floor(s.min/60)}:${String(s.min%60).padStart(2,'0')}`;
  c.font=`700 50px ${MONO}`;c.fillStyle=ink;c.fillText('TOTAL COST:',L,y+8);c.textAlign='right';c.fillText(hm,R,y+8);c.textAlign='left';y+=40;
  dash(y);y+=56;
  mono(`CARD #: **** **** **** ${YEAR()}`,L,y);y+=50;mono(`AUTH CODE: ${String(hashN(nick()+'auth')).slice(0,6).padStart(6,'0')}`,L,y);y+=60;
  /* 바코드 */
  let bx=W/2-300;const bh=110;c.fillStyle=ink;let s2=hashN(nick()+'bar'+YEAR());while(bx<W/2+300){s2=(s2*1664525+1013904223)>>>0;const w=1+(s2%4);c.fillRect(bx,y,w*2,bh);bx+=w*2+2+((s2>>>8)%3)*2;}
  y+=bh+36;mono(`${YEAR()} ${String(hashN(nick())).slice(0,4)} ${String(hashN(nick()+'x')).slice(0,4)}`,W/2,y,'center',32,sub);
  y+=20;
  mono(`tel. ${YEAR()} 1231`,L,H-52,'left',32);mono(`${AIR[0]}HAKDANG`,R,H-52,'right',32);
  /* 11월 전에는 미리보기 도장 */
  if(!isDec()&&!PR){c.save();c.translate(W/2,H*0.42);c.rotate(-.28);c.strokeStyle='rgba(210,35,42,.55)';c.lineWidth=8;rr(c,-330,-78,660,156,22);c.stroke();c.fillStyle='rgba(210,35,42,.6)';c.textAlign='center';c.font=`800 64px ${KR}`;c.fillText('미리보기',0,8);c.font=`30px ${KR}`;c.fillText('11월 1일부터 출력돼요',0,56);c.restore();}

  return y;};
  const need=paint(3400);paint(need+120);
}

/* ---------- 화면 ---------- */
const md=document.createElement('div');md.id='yearTk';md.className='modal';
md.innerHTML=`<div class="sheet paper"><div class="grip"></div><div class="sh"><button class="back" data-yback>‹ 뒤로</button><span>🧾 올해 결산 영수증</span><button class="x" data-yclose>×</button></div><div id="ytBody"></div></div>`;
document.body.appendChild(md);
const st=document.createElement('style');st.textContent=`#ytBody .ytPrev{display:flex;justify-content:center;margin:4px 0 12px}#ytBody .ytPrev img{width:min(100%,330px);height:auto;filter:drop-shadow(0 8px 14px rgba(40,30,20,.3))}
#ytBody .ytHint{font-size:13px;color:#8a6a52;line-height:1.5;margin:0 0 10px;text-align:center}
#ytBody .ytRow{display:grid;grid-template-columns:118px 1fr;gap:6px;margin:5px 0}#ytBody .ytRow input{width:100%;box-sizing:border-box;padding:9px 10px;border-radius:10px;border:1px solid #e2cfb4;background:#fffaf2;font:inherit;font-size:14px}#ytBody .ytRow .lab{position:relative;display:flex;align-items:center;gap:4px;padding:6px 8px 6px 10px;border-radius:10px;border:1px solid #e2cfb4;background:#f6ead4;font-size:13px;line-height:1.25;min-height:38px;box-sizing:border-box;cursor:pointer}#ytBody .ytRow .lab span{flex:1;word-break:keep-all;overflow-wrap:anywhere;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}#ytBody .ytRow .lab span b{font-weight:400;white-space:nowrap}#ytBody .ytRow .lab i{font-style:normal;color:#a07a5a;font-size:12px}#ytBody .ytRow .lab select{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer;font-size:16px}#ytBody .ytRow{align-items:stretch}
#ytBody .ytBtns{position:sticky;bottom:-22px;margin:12px -18px -22px;padding:10px 14px 14px;background:#fbefd9;border-top:2px solid #d8884a;display:flex;gap:8px}#ytBody .ytBtns button[data-yreset]{flex:.6}#ytBody .ytBtns button{flex:1;margin:0;padding:12px 6px;font-size:14px}#ytBody .ytBtns button[disabled]{opacity:.55}
#ytBody .ytLock{font-size:12px;color:#9a3a20;text-align:center;margin-top:6px}`;document.head.appendChild(st);
let back='menu',tm=0;
function dday(){const n=NOW();const d=new Date(n.getFullYear(),10,1);return Math.ceil((d-new Date(n.getFullYear(),n.getMonth(),n.getDate()))/864e5);}
async function refresh(){const cv=document.createElement('canvas');await draw(cv);const im=$q('#ytImg');if(im)im.src=cv.toDataURL('image/png');}
function render(){const b=$q('#ytBody');const dec=isDec();
  b.innerHTML=`<div class="ytPrev"><img id="ytImg" alt="올해 결산 영수증"></div>
  <p class="ytHint">올해를 떠올리며 칸을 채워요. 비워 둔 칸은 영수증에 안 나와요.<br>출석·공부·독서 기록은 학당 기록에서 저절로 들어가요.</p>
  ${P.items.map((it,i)=>`<div class="ytRow"><label class="lab"><span>${String(it[0]||'항목 고르기').split(' ').map(w=>`<b>${E(w)}</b>`).join(' ')}</span><i>▾</i><select data-ys="${i}">${(OPTS.includes(it[0])?OPTS:[it[0],...OPTS]).map(o=>`<option${o===it[0]?' selected':''}>${E(o)}</option>`).join('')}<option value="__own">✏️ 직접 쓰기…</option></select></label><input data-yv="${i}" maxlength="40" placeholder="${i===8?'한마디 남기기':'적어 보기'}" value="${E(it[1])}"></div>`).join('')}
  <div class="ytBtns"><button class="ghost" data-yreset>↺ 처음</button><button class="ghost" data-yprint ${dec?'':'disabled'}>🖨️ 영수증 프린터</button><button class="primary" data-ysave ${dec?'':'disabled'}>${dec?'🧾 이미지 저장':'🔒 11월부터'}</button></div>
  ${dec?'':`<div class="ytLock">이미지 저장·프린터 출력은 11월·12월에만 할 수 있어요 · D-${dday()} (적어 둔 내용은 그대로 남아요)</div>`}`;
  refresh();}
md.addEventListener('change',e=>{const sl=e.target.closest('[data-ys]');if(!sl)return;const i=+sl.dataset.ys;let v=sl.value;if(v==='__own'){v=(prompt('항목 이름을 적어 주세요 (14자까지)',P.items[i][0]||'올해의 ')||'').trim().slice(0,14);if(!v){render();return;}}P.items[i][0]=v;save();render();});
md.addEventListener('input',e=>{const l=e.target.closest('[data-yl]'),v=e.target.closest('[data-yv]');if(l)P.items[+l.dataset.yl][0]=l.value;if(v)P.items[+v.dataset.yv][1]=v.value;if(l||v){save();clearTimeout(tm);tm=setTimeout(refresh,350);}});
md.addEventListener('click',async e=>{
  if(e.target===md||e.target.closest('[data-yclose]')){md.classList.remove('show');return;}
  if(e.target.closest('[data-yback]')){md.classList.remove('show');if(back&&typeof openSheet==='function')openSheet(back);return;}
  if(e.target.closest('[data-yreset]')){if(!confirm('적어 둔 내용을 지우고 처음 칸으로 돌릴까요?'))return;P={y:YEAR(),items:DEF.map(x=>x.slice())};save();render();return;}
  if(e.target.closest('[data-yprint]')){if(!isDec()){toast('🔒 11월부터 출력할 수 있어요');return;}const all=P.items.map(x=>x.join(' ')).join(' ');if(typeof badBlock==='function'&&!(typeof ADMIN_ON!=='undefined'&&ADMIN_ON)&&badBlock(all))return;openPrint();return;}
  if(e.target.closest('[data-ysave]')){if(!isDec()){toast('🔒 11월부터 저장할 수 있어요');return;}
    const all=P.items.map(x=>x.join(' ')).join(' ');if(typeof badBlock==='function'&&!(typeof ADMIN_ON!=='undefined'&&ADMIN_ON)&&badBlock(all))return;
    const cv=document.createElement('canvas');await draw(cv);const name=`${T}_${YEAR()}_결산영수증.png`;
    cv.toBlob(async blob=>{if(!blob){toast('이미지를 만들지 못했어요');return;}const file=new File([blob],name,{type:'image/png'});
      try{if(navigator.canShare&&navigator.canShare({files:[file]})&&/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)){await navigator.share({files:[file],title:`${YEAR()} 결산 영수증`});return;}}catch(err){if(err&&err.name==='AbortError')return;}
      const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);toast('🧾 영수증을 저장했어요');},'image/png');}
});
/* ---------- 🖨️ 블루투스 영수증 프린터 (Web Bluetooth) ---------- */
const BT={dev:null,ch:null,kind:'',name:''};
const SVC=[0xff00,0xff10,0xff20,0xffe0,0xfff0,0xffd0,0xffb0,0xff80,0x18f0,0xae30,0xaf30,0xae00,0xfee7,0xe0ff,0xabf0,0x180a,'49535343-fe7d-4ae5-8fa9-9fafd205e455','e7810a71-73ae-499d-8c15-faa9aef0c3f2','6e400001-b5a3-f393-e0a9-e50e24dcca9e','0000ff00-0000-1000-8000-00805f9b34fb'];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function prSet(){return LS.get('ytPrinter',{w:'auto',dark:3});}
async function btConnect(){if(!navigator.bluetooth)throw new Error('nobt');
  const dev=await navigator.bluetooth.requestDevice({acceptAllDevices:true,optionalServices:SVC});
  const gatt=await dev.gatt.connect();let ch=null,kind='escpos';
  for(const sv of SVC){let s;try{s=await gatt.getPrimaryService(sv);}catch(e){continue;}const cs=await s.getCharacteristics();
    const w=cs.find(c=>c.properties.writeWithoutResponse)||cs.find(c=>c.properties.write);if(w){ch=w;if(sv===0xff00)kind='phomemo';break;}}
  if(!ch){let L=[];try{L=(await gatt.getPrimaryServices()).map(x=>x.uuid.replace(/^0000(....)-0000-1000-8000-00805f9b34fb$/,'0x$1'));}catch(e){}BT.diag=(dev.name||'이름 없음')+' · 통로: '+(L.join(', ')||'없음');try{dev.gatt.disconnect();}catch(e){}throw new Error('nochar');}
  BT.dev=dev;BT.ch=ch;BT.kind=kind;BT.name=dev.name||'프린터';dev.addEventListener('gattserverdisconnected',()=>{BT.ch=null;});return BT;}
async function btWrite(bytes,onProg){const ch=BT.ch;const N=ch.properties.writeWithoutResponse?120:180;
  for(let i=0;i<bytes.length;i+=N){const part=bytes.slice(i,i+N);if(ch.properties.writeWithoutResponse&&ch.writeValueWithoutResponse)await ch.writeValueWithoutResponse(part);else await ch.writeValue(part);
    if(ch.properties.writeWithoutResponse)await sleep(BT.kind==='phomemo'?18:12);if(onProg&&(i/N)%20===0)onProg(i/bytes.length);}if(onProg)onProg(1);}
function rasterOf(src,pw){const h=Math.round(src.height*pw/src.width);const cv=document.createElement('canvas');cv.width=pw;cv.height=h;const c=cv.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,pw,h);c.imageSmoothingQuality='high';c.drawImage(src,0,0,pw,h);
  const d=c.getImageData(0,0,pw,h).data;const bw=pw/8;const out=new Uint8Array(bw*h);
  for(let y=0;y<h;y++)for(let x=0;x<pw;x++){const k=(y*pw+x)*4;const g=d[k]*.3+d[k+1]*.59+d[k+2]*.11;if(g<150)out[y*bw+(x>>3)]|=(0x80>>(x&7));}
  return {bw,h,data:out};}
function buildJob(r,kind){const parts=[];const push=a=>parts.push(...a);
  push([0x1b,0x40]);if(kind==='phomemo')push([0x1b,0x61,0x01,0x1f,0x11,0x02,0x04]);
  for(let y=0;y<r.h;y+=255){const n=Math.min(255,r.h-y);push([0x1d,0x76,0x30,0x00,r.bw&255,r.bw>>8,n&255,n>>8]);for(let i=y*r.bw;i<(y+n)*r.bw;i++)parts.push(r.data[i]);}
  if(kind==='phomemo')push([0x1b,0x64,0x02,0x1b,0x64,0x02,0x1f,0x11,0x08,0x1f,0x11,0x0e,0x1f,0x11,0x07,0x1f,0x11,0x09]);else push([0x1b,0x64,0x04]);
  return new Uint8Array(parts);}
const pm=document.createElement('div');pm.id='ytPrPop';pm.className='tnWrap';pm.style.cssText='position:fixed;inset:0;z-index:90;background:rgba(40,22,10,.45);display:none;align-items:center;justify-content:center;padding:20px';
document.body.appendChild(pm);
function openPrint(){const S=prSet();const ios=/iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);const ok=!!navigator.bluetooth;
  pm.innerHTML=`<div class="tnCard" style="max-width:360px;text-align:left"><div class="tnIco" style="text-align:center">🖨️</div><b style="text-align:center">블루투스 영수증 프린터로 뽑기</b>
  ${ok?`<p style="white-space:normal">① 프린터 전원을 켜요 (휴대폰 설정의 블루투스에서 미리 연결할 필요는 없어요)<br>② 아래 <b>연결하고 출력</b>을 누르고 목록에서 프린터 이름을 골라요</p>
  <label style="display:block;font-size:13px;margin:4px 0">용지 폭 · 해상도 <select id="ytPw" style="width:100%;margin-top:4px;padding:8px;border-radius:10px;border:1px solid #d9c3a3;font:inherit"><option value="auto"${S.w==='auto'?' selected':''}>자동 (MEEMO·Phomemo M02S → 300dpi)</option><option value="576"${S.w==='576'?' selected':''}>58mm · 300dpi (576점) — M02S·M02 Pro</option><option value="384"${S.w==='384'?' selected':''}>58mm · 203dpi (384점) — 일반 영수증 프린터</option></select></label>
  <div id="ytPrMsg" style="font-size:13px;min-height:20px;margin:8px 0;color:#6a4a2a">${BT.ch?'✅ '+E(BT.name)+' 연결됨':''}</div>
  <div class="tnBtns"><button class="ghost" data-prx>닫기</button><button class="primary" data-prgo>${BT.ch?'🖨️ 출력하기':'🔗 연결하고 출력'}</button></div>`
  :`<p style="white-space:normal">${ios?'아이폰·아이패드의 브라우저는 블루투스 프린터에 바로 연결할 수 없어요.':'이 브라우저는 블루투스 프린터 연결을 지원하지 않아요. 안드로이드 휴대폰의 크롬이나 PC의 크롬·엣지에서 열어 주세요.'}<br><br><b>대신 이렇게 해요</b><br>① <b>🧾 이미지 저장</b>으로 영수증을 사진첩에 저장해요<br>② 프린터 앱(MEEMO 앱 등)에서 그 사진을 골라 출력해요</p><div class="tnBtns"><button class="primary" data-prx>알겠어요</button></div>`}</div>`;
  pm.style.display='flex';}
pm.addEventListener('click',async e=>{if(e.target===pm||e.target.closest('[data-prx]')){pm.style.display='none';return;}
  if(!e.target.closest('[data-prgo]'))return;const msg=pm.querySelector('#ytPrMsg');const btn=e.target.closest('[data-prgo]');const sel=pm.querySelector('#ytPw');const S=prSet();S.w=sel.value;LS.set('ytPrinter',S);
  btn.disabled=true;try{if(!BT.ch){msg.textContent='🔎 프린터를 찾는 중… 목록에서 골라 주세요';await btConnect();}
    msg.textContent='🧾 영수증을 준비하는 중…';const cv=document.createElement('canvas');await draw(cv,true);
    const pw=S.w==='auto'?(BT.kind==='phomemo'?576:384):+S.w;const job=buildJob(rasterOf(cv,pw),BT.kind);
    await btWrite(job,p=>{msg.textContent=`🖨️ ${E(BT.name)}로 보내는 중… ${Math.round(p*100)}%`;});
    msg.innerHTML=`✅ 다 보냈어요! 종이가 다 나오면 뜯어 주세요.<br><small>너무 크거나 작게 나오면 위의 ‘용지 폭’을 바꿔 다시 출력해 보세요.</small>`;btn.textContent='🖨️ 한 장 더';}
  catch(err){const m=String(err&&err.message||err);BT.ch=null;
    msg.innerHTML=/cancel|chosen/i.test(m)?'프린터를 고르지 않았어요.':m==='nochar'?'⚠️ 이 기기에서 인쇄 통로를 찾지 못했어요.<br><small style="word-break:break-all">고른 기기: '+E(BT.diag||'')+'</small><br>목록에서 <b>프린터 이름</b>(예: M02S, MEEMO)을 골랐는지 확인해 주세요. 그래도 같으면 이 화면을 캡처해서 보내 주세요. 프린터가 맞는지 확인하거나, 이미지 저장 후 프린터 앱으로 출력해 주세요.':'⚠️ 연결이 끊겼거나 보내지 못했어요. 프린터 전원과 거리(1m 안)를 확인하고 다시 눌러 주세요.';btn.textContent='🔗 다시 연결하고 출력';}
  btn.disabled=false;});
window.__ytJob=async(pw,kind)=>{const cv=document.createElement('canvas');await draw(cv,true);return Array.from(buildJob(rasterOf(cv,pw),kind));};
window.openYearTicket=function(from){back=from||'menu';P=load();if(typeof closeSheets==='function')closeSheets();md.classList.add('show');render();};
})();
