/* 몽원학당 · 놀이마당(미니게임) + 귓속말 */
(function(){
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const NM=id=>{try{return nameOf(id);}catch(e){return '친구';}};
const DM=()=>window.__cloudDM;
const LSg=(k,d)=>{try{return LS.get(k,d);}catch(e){return d;}},LSs=(k,v)=>{try{LS.set(k,v);}catch(e){}};
const rnd=n=>Math.floor(Math.random()*n);
const celebrate=win=>{try{if(win)doEmote('jump');}catch(e){}};

/* ====================== 귓속말 ====================== */
let dmWith=null,dmUnread=LSg('dmUnread',{});
const dmKey=id=>'dm.'+id;
function dmHist(id){return LSg(dmKey(id),[]);}
function dmPush(id,m){const h=dmHist(id);h.push(m);while(h.length>80)h.shift();LSs(dmKey(id),h);}
function renderDM(){if(!dmWith)return;$('#dmName').textContent=NM(dmWith);const h=dmHist(dmWith);const el=$('#dmLog');
  el.innerHTML=h.length?h.map(m=>`<div class="dmM ${m.me?'me':''}"><span>${E(m.t)}</span><small>${new Date(m.ts).toLocaleTimeString('ko-KR',{hour:'numeric',minute:'2-digit'})}</small></div>`).join(''):'<div class="empty">🤫 여기서 나눈 말은 두 사람에게만 보여요.<br>다른 친구들은 볼 수 없어요.</div>';
  el.scrollTop=el.scrollHeight;dmUnread[dmWith]=0;LSs('dmUnread',dmUnread);dmBadge();}
function dmBadge(){const n=Object.values(dmUnread).reduce((a,b)=>a+(b||0),0);const b=$('#dmDot');if(b)b.hidden=!n;}
window.openWhisper=function(id){if(!DM()){toast('귓속말은 친구들과 함께 쓰는 학당(Vercel 링크)에서만 돼요');return;}dmWith=id;openSheet('dm');renderDM();setTimeout(()=>$('#dmIn').focus(),200);};
async function sendDM(){const v=$('#dmIn').value.trim().slice(0,200);if(!v||!dmWith)return;$('#dmIn').value='';const m={t:v,ts:Date.now(),me:1};dmPush(dmWith,m);renderDM();
  try{await DM().send(dmWith,{t:v,g:''});}catch(e){toast('귓속말을 보내지 못했어요<small>Firebase 규칙을 최신으로 붙여 넣었는지 확인해 주세요</small>');}}
function gotDM(v){if(v.g){gotGame(v);return;}if(!v.t)return;const id=v.by;dmPush(id,{t:String(v.t).slice(0,200),ts:v.ts||Date.now()});
  const open=$('#dm').classList.contains('show')&&dmWith===id;if(open)renderDM();else{dmUnread[id]=(dmUnread[id]||0)+1;LSs('dmUnread',dmUnread);dmBadge();
    toast(`🤫 ${E(NM(id))}님의 귓속말<small>${E(String(v.t).slice(0,40))}</small>`);const t=$('#toast');if(t){t.onclick=()=>{t.onclick=null;openWhisper(id);};}}}
function dmInbox(){const el=$('#dmInbox');if(!el)return;const ids=Object.keys(localStorage).filter(k=>/\.dm\./.test(k)).map(k=>k.split('.dm.')[1]).filter(Boolean);
  el.innerHTML=ids.length?'<div class="sec">귓속말 나눈 친구</div>'+ids.map(id=>{const h=dmHist(id),l=h[h.length-1]||{};return `<div class="frRow"><span><b>${E(NM(id))}</b>${dmUnread[id]?` <i class="dmN">${dmUnread[id]}</i>`:''}<small>${E((l.me?'나: ':'')+(l.t||''))}</small></span><button class="ghost" data-dm="${id}">💬 열기</button></div>`;}).join(''):'';}

/* ====================== 놀이마당 ====================== */
const GAMES=[
 {id:'rps',ico:'✊',name:'가위바위보',desc:'세 판 두 번 이기면 승리!',ai:true,pvp:true},
 {id:'yut',ico:'🎋',name:'윷놀이',desc:'말 두 개를 먼저 다 들여보내면 승리. 윷·모·잡기는 한 번 더!',ai:true,pvp:true},
 {id:'cham',ico:'👉',name:'참참참',desc:'해태 손가락과 다른 쪽으로 고개를 돌려요. 다섯 판!',ai:true},
 {id:'memo',ico:'🃏',name:'짝맞추기',desc:'같은 그림 두 장을 찾아요. 적게 뒤집을수록 좋아요.',solo:true}];
let G=null; // 지금 하는 게임
function renderGames(){const fr=(typeof onlineFriends==='function')?onlineFriends():[];
  $('#gList').innerHTML=GAMES.map(g=>`<div class="gCard"><div class="gIco">${g.ico}</div><div class="gTx"><b>${g.name}</b><small>${g.desc}</small>
    <div class="gBtn">${g.solo?`<button class="primary" data-g="${g.id}" data-vs="solo">혼자 하기</button>`:''}${g.ai?`<button class="primary" data-g="${g.id}" data-vs="ai">🦁 해태랑</button>`:''}${g.pvp?`<button class="ghost" data-g="${g.id}" data-vs="pick">👥 친구랑</button>`:''}</div></div></div>`).join('')
    +`<div class="gRec">🏆 내 전적 · ${Object.entries(LSg('gRec',{})).map(([k,v])=>`${(GAMES.find(g=>g.id===k)||{}).name||k} ${v.w||0}승 ${v.l||0}패`).join(' · ')||'아직 없어요'}</div>`;
  $('#gPick').hidden=true;}
function rec(id,win){const r=LSg('gRec',{});r[id]=r[id]||{w:0,l:0};if(win===true)r[id].w++;else if(win===false)r[id].l++;LSs('gRec',r);}
function pickFriend(game){const fr=(typeof onlineFriends==='function')?onlineFriends():[];const el=$('#gPick');el.hidden=false;
  el.innerHTML=`<div class="sec">누구랑 할까요?</div>`+(DM()?(fr.length?fr.map(r=>`<div class="frRow"><span><b>${E(NM(r.by))}</b><small>${E(spName?spName(r.pr.sp):'')}</small></span><button class="primary" data-inv="${r.by}" data-game="${game}">도전장 보내기</button></div>`).join(''):'<div class="empty">지금 접속한 친구가 없어요. 해태랑 먼저 연습해 볼까요?</div>'):'<div class="empty">친구랑 하는 놀이는 함께 쓰는 학당(Vercel 링크)에서만 돼요.</div>');
  el.scrollIntoView({behavior:'smooth',block:'nearest'});}
window.openGames=function(withId){openSheet('games');renderGames();if(withId){pickFor=withId;}};
let pickFor=null;
function sendG(to,obj){return DM()?DM().send(to,{t:'',g:JSON.stringify(obj)}).catch(()=>toast('보내지 못했어요')):Promise.resolve();}
function invite(to,game){const gid='g'+Date.now().toString(36)+rnd(999);sendG(to,{k:'inv',game,gid});G={pending:true,game,gid,vs:to};toast(`📮 ${E(NM(to))}님에게 도전장을 보냈어요<small>대답을 기다리는 중…</small>`);closeSheets();}
let invQ=null;
function gotGame(v){let m;try{m=JSON.parse(v.g);}catch(e){return;}const from=v.by;
  if(m.k==='inv'){invQ={from,game:m.game,gid:m.gid};const g=GAMES.find(x=>x.id===m.game);$('#gInvTx').innerHTML=`${g?g.ico:'🎮'} <b>${E(NM(from))}</b>님이<br><b>${g?g.name:'놀이'}</b> 한 판 하재요!`;$('#gInv').classList.add('show');try{chime();}catch(e){}return;}
  if(m.k==='no'){if(G&&G.gid===m.gid){toast(`${E(NM(from))}님이 다음에 하재요 🙏`);G=null;}return;}
  if(m.k==='ok'){if(G&&G.gid===m.gid&&G.pending){startGame(m.game,from,m.gid,0);}return;}
  if(!G||G.gid!==m.gid)return;
  if(m.k==='quit'){toast(`${E(NM(from))}님이 놀이를 그만뒀어요`);endPlay();return;}
  if(G.game==='rps')rpsRemote(m);else if(G.game==='yut')yutRemote(m);}
$('#gInvOk')&&0;
function startGame(game,vs,gid,me){G={game,vs,gid,me,pvp:vs!=='ai'&&vs!=='solo'};openSheet('gPlay');$('#gPlayT').textContent=(GAMES.find(g=>g.id===game)||{}).name||'';
  ({rps:rpsStart,yut:yutStart,cham:chamStart,memo:memoStart})[game]();}
function endPlay(){G=null;closeSheets();}
const PB=()=>$('#gBody');

/* ---------- 가위바위보 ---------- */
const RPS=['✊','✌️','🖐'],RPSN=['바위','가위','보'];
const beats=(a,b)=>(a===0&&b===1)||(a===1&&b===2)||(a===2&&b===0);
function rpsStart(){Object.assign(G,{sc:[0,0],round:1,mine:null,theirs:null});rpsDraw('고르세요!');}
function rpsDraw(msg,reveal){const opp=G.pvp?NM(G.vs):'해태';
  PB().innerHTML=`<div class="rpsTop"><div><small>나</small><b>${G.sc[0]}</b></div><div class="vs">${G.round}판</div><div><small>${E(opp)}</small><b>${G.sc[1]}</b></div></div>
   <div class="rpsShow"><div class="hand ${reveal?'pop':''}">${G.mine!=null&&reveal?RPS[G.mine]:'❔'}</div><div class="hand op ${reveal?'pop':''}">${reveal&&G.theirs!=null?RPS[G.theirs]:(G.pvp&&G.theirs!=null?'✅':'❔')}</div></div>
   <div class="gMsg">${msg}</div>
   <div class="rpsBtns">${RPS.map((h,i)=>`<button data-rps="${i}" ${G.mine!=null||G.over?'disabled':''} class="${G.mine===i?'on':''}">${h}<small>${RPSN[i]}</small></button>`).join('')}</div>
   ${G.over?`<button class="primary" id="gAgain">한 판 더!</button>`:''}`;}
function rpsPick(i){if(G.mine!=null||G.over)return;G.mine=i;if(G.pvp){sendG(G.vs,{k:'rps',gid:G.gid,r:G.round,c:i});rpsDraw(G.theirs!=null?'두근두근…':'친구가 고르는 중…');if(G.theirs!=null)setTimeout(rpsResolve,500);}
  else{G.theirs=rnd(3);let n=0;const say=['가위!','바위!','보!'];const t=setInterval(()=>{if(!G||G.game!=='rps'){clearInterval(t);return;}rpsDraw(say[n]);n++;if(n>2){clearInterval(t);setTimeout(rpsResolve,350);}},380);}}
function rpsRemote(m){if(m.k==='rps'&&m.r===G.round){G.theirs=m.c;if(G.mine!=null)setTimeout(rpsResolve,300);else rpsDraw('친구는 골랐어요! 얼른 골라요');}
  if(m.k==='again'){rpsStart();}}
function rpsResolve(){if(!G||G.game!=='rps')return;const a=G.mine,b=G.theirs;let msg;if(a===b)msg='비겼어요! 다시 한 번 🤝';else if(beats(a,b)){G.sc[0]++;msg='이겼어요! 🎉';}else{G.sc[1]++;msg='졌어요… 😵';}
  const done=G.sc[0]>=2||G.sc[1]>=2;if(done){G.over=true;const w=G.sc[0]>G.sc[1];msg=w?'최종 승리! 👑':'아쉽게 졌어요… 다음엔 꼭!';rec('rps',w);celebrate(w);}
  rpsDraw(msg,true);if(!done){setTimeout(()=>{if(!G||G.game!=='rps')return;if(a!==b)G.round++;G.mine=null;G.theirs=null;rpsDraw('고르세요!');},1500);}}

/* ---------- 윷놀이 (말 두 개 · 바깥길) ---------- */
const YN={'-1':'빽도',1:'도',2:'개',3:'걸',4:'윷',5:'모'};
function throwYut(){const f=[0,0,0,0].map(()=>Math.random()<.5?1:0);const n=f.reduce((a,b)=>a+b,0);const back=n===1&&f[0]===1;return {n:n===0?5:back?-1:n,f};}
function yutStart(){Object.assign(G,{P:[[0,0],[0,0]],turn:0,phase:'throw',last:null,sticks:[0,0,0,0],log:'',over:false});
  G.my=G.pvp?G.me:0;yutDraw(G.turn===G.my?'윷을 던져요!':(G.pvp?`${NM(G.vs)}님 차례`:'해태 차례'));if(!G.pvp&&G.turn!==G.my)setTimeout(yutAI,900);}
function cellXY(p){const S=4,step=1/S;let x,y;const q=Math.floor(p/5),r=p%5;if(q===0){x=1;y=1-r*step;}else if(q===1){x=1-r*step;y=0;}else if(q===2){x=0;y=r*step;}else{x=r*step;y=1;}return [x,y];}
function yutDraw(msg,pick){const me=G.my,opp=1-me,nm=[G.pvp?'':'',''];const oppName=G.pvp?NM(G.vs):'해태';
  let cells='';for(let p=0;p<20;p++){const [x,y]=cellXY(p);const big=p%5===0;cells+=`<i class="yc ${big?'big':''}" style="left:${8+x*84}%;top:${8+y*84}%">${p===0?'출':''}</i>`;}
  const tokens=[];[0,1].forEach(pl=>{const grp={};G.P[pl].forEach((p,i)=>{if(p>0&&p<20){(grp[p]=grp[p]||[]).push(i);}});Object.entries(grp).forEach(([p,ids])=>{const [x,y]=cellXY(+p);
    const can=pick&&pl===me;tokens.push(`<b class="yt p${pl===me?0:1} ${can?'can':''}" ${can?`data-pc="${ids[0]}"`:''} style="left:${8+x*84}%;top:${8+y*84}%;transform:translate(${pl?'-20%':'-80%'},-50%)">${pl===me?'나':'상'}${ids.length>1?'<sup>×2</sup>':''}</b>`);});});
  const home=pl=>G.P[pl].map((p,i)=>p===0?`<b class="yt in p${pl===me?0:1} ${pick&&pl===me?'can':''}" ${pick&&pl===me?`data-pc="${i}"`:''}>${pl===me?'나':'상'}</b>`:p>=20?'<b class="yt in done">✓</b>':'').join('');
  PB().innerHTML=`<div class="yTop"><div><small>나</small>${home(me)||'<i class="dim">모두 출발</i>'}</div><div class="${G.turn===me?'turn':''}">${G.turn===me?'내 차례':''}</div><div style="text-align:right"><small>${E(oppName)}</small>${home(opp)||'<i class="dim">모두 출발</i>'}</div></div>
   <div class="yBoard">${cells}${tokens.join('')}<div class="ySticks ${G.flip?'flip':''}">${G.sticks.map(s=>`<i class="${s?'f':'b'}"></i>`).join('')}</div>${G.last!=null?`<div class="yRes">${YN[G.last]}!</div>`:''}</div>
   <div class="gMsg">${msg}</div>
   ${G.over?`<button class="primary" id="gAgain">한 판 더!</button>`:`<button class="primary" id="yThrow" ${G.turn===me&&G.phase==='throw'?'':'disabled'}>🎋 윷 던지기</button>`}`;}
function movable(pl,n){const r=[];G.P[pl].forEach((p,i)=>{if(p>=20)return;if(n===-1){if(p>0)r.push(i);}else r.push(i);});const seen=new Set();return r.filter(i=>{const k=G.P[pl][i];if(seen.has(k))return false;seen.add(k);return true;});}
function applyYut(n,pc){if(!G||G.game!=='yut'||G.over)return;const pl=G.turn,opp=1-pl;let extra=n===4||n===5,msg='';
  if(pc>=0){const from=G.P[pl][pc];let to=from+n;if(n===-1)to=Math.max(0,from-1);
    G.P[pl].forEach((p,i)=>{if(p===from&&(from>0||i===pc))G.P[pl][i]=to>=20?20:to;});
    if(to>0&&to<20&&G.P[opp].some(p=>p===to)){G.P[opp]=G.P[opp].map(p=>p===to?0:p);extra=true;msg='잡았다! 한 번 더 🎉';}
    else if(to>=20)msg='한 마리 골인! 🏁';else if(G.P[pl].filter(p=>p===to&&to>0).length>1)msg='업었다! 🐎🐎';}
  else msg='움직일 말이 없어요';
  if(G.P[pl].every(p=>p>=20)){G.over=true;const w=pl===G.my;rec('yut',w);celebrate(w);yutDraw(w?'내가 이겼어요! 👑':(G.pvp?NM(G.vs):'해태')+' 승리… 다음엔 꼭!');return;}
  if(!extra)G.turn=opp;G.phase='throw';G.last=n;
  const who=G.turn===G.my?'내 차례':(G.pvp?NM(G.vs)+'님 차례':'해태 차례');yutDraw((msg?msg+' · ':'')+(extra&&pl===G.my?'한 번 더 던져요!':who));
  if(!G.pvp&&G.turn!==G.my&&!G.over)setTimeout(yutAI,1100);}
function animThrow(t,cb){if(!G||G.game!=='yut')return;G.flip=true;G.sticks=t.f;G.last=null;yutDraw('던지는 중…');setTimeout(()=>{if(!G||G.game!=='yut')return;G.flip=false;G.last=t.n;cb();},700);}
function myThrow(){if(!G||G.turn!==G.my||G.phase!=='throw')return;G.phase='wait';const t=throwYut();animThrow(t,()=>{const mv=movable(G.my,t.n);
  if(!mv.length){finishMine(t,-1);return;}if(mv.length===1){finishMine(t,mv[0]);return;}G.pendingN=t;G.phase='pick';yutDraw(`${YN[t.n]}! 움직일 말을 눌러요`,true);});}
function finishMine(t,pc){if(G.pvp)sendG(G.vs,{k:'yut',gid:G.gid,n:t.n,f:t.f,pc});setTimeout(()=>applyYut(t.n,pc),pc<0?600:250);}
function yutAI(){if(!G||G.game!=='yut'||G.over||G.turn===G.my)return;const t=throwYut();animThrow(t,()=>{const pl=G.turn,mv=movable(pl,t.n);let best=-1,bs=-1e9;
  mv.forEach(i=>{const from=G.P[pl][i];const to=t.n===-1?from-1:from+t.n;let s=to;if(to>0&&to<20&&G.P[1-pl].includes(to))s+=40;if(to>=20)s+=30;if(from===0)s-=3;if(s>bs){bs=s;best=i;}});
  setTimeout(()=>{if(G&&G.game==='yut')applyYut(t.n,best);},500);});}
function yutRemote(m){if(m.k==='yut'&&G.turn!==G.my){animThrow({n:m.n,f:m.f||[1,0,0,0]},()=>setTimeout(()=>applyYut(m.n,m.pc),350));}if(m.k==='again'){yutStart();}}

/* ---------- 참참참 ---------- */
function chamStart(){Object.assign(G,{sc:[0,0],round:1,busy:false,over:false});chamDraw('왼쪽? 오른쪽? 해태 손가락을 피해요!');}
function chamDraw(msg,face,dir){PB().innerHTML=`<div class="rpsTop"><div><small>나</small><b>${G.sc[0]}</b></div><div class="vs">${Math.min(G.round,5)}/5</div><div><small>해태</small><b>${G.sc[1]}</b></div></div>
  <div class="chamStage"><div class="chamFace" style="transform:rotate(${face==='L'?-28:face==='R'?28:0}deg)">${typeof thumbOf==='function'&&thumbOf('av',ST.avatar||'girl')?`<img src="${thumbOf('av',ST.avatar||'girl')}">`:'🙂'}</div><div class="chamHand ${dir||''}">${dir==='L'?'👈':dir==='R'?'👉':'☝️'}</div></div>
  <div class="gMsg">${msg}</div>${G.over?`<button class="primary" id="gAgain">한 판 더!</button>`:`<div class="rpsBtns two"><button data-cham="L" ${G.busy?'disabled':''}>⬅️<small>왼쪽</small></button><button data-cham="R" ${G.busy?'disabled':''}>➡️<small>오른쪽</small></button></div>`}`;}
function chamPick(d){if(G.busy||G.over)return;G.busy=true;const say=['참!','참!','참!'];let n=0;const t=setInterval(()=>{if(!G||G.game!=='cham'){clearInterval(t);return;}chamDraw(say[n]);n++;if(n>2){clearInterval(t);const h=Math.random()<.5?'L':'R';
  const hit=h===d;if(hit)G.sc[1]++;else G.sc[0]++;chamDraw(hit?'앗, 걸렸어요! 😵':'피했어요! 😆',d,h);G.round++;
  setTimeout(()=>{if(!G||G.game!=='cham')return;G.busy=false;if(G.round>5){G.over=true;const w=G.sc[0]>G.sc[1];rec('cham',w);celebrate(w);chamDraw(w?'해태를 이겼어요! 👑':'해태 승리! 다음엔 꼭!');}else chamDraw('다음 판! 어느 쪽으로?');},1300);}},420);}

/* ---------- 짝맞추기 ---------- */
const MEMO=['🌕','🍂','📜','🐯','🪷','🌿','🍵','🏮'];
function memoStart(){const d=[...MEMO,...MEMO].map(v=>({v,o:false,m:false})).sort(()=>Math.random()-.5);Object.assign(G,{deck:d,open:[],flips:0,t0:Date.now(),over:false,lock:false});memoDraw('같은 그림 두 장을 찾아요!');}
function memoDraw(msg){const best=LSg('memoBest',0);PB().innerHTML=`<div class="rpsTop"><div><small>뒤집은 수</small><b>${G.flips}</b></div><div class="vs">🃏</div><div><small>최고 기록</small><b>${best||'-'}</b></div></div>
  <div class="memo">${G.deck.map((c,i)=>`<button data-memo="${i}" class="${c.o||c.m?'o':''} ${c.m?'m':''}"><span>${c.o||c.m?c.v:'學'}</span></button>`).join('')}</div><div class="gMsg">${msg}</div>${G.over?`<button class="primary" id="gAgain">다시 하기</button>`:''}`;}
function memoPick(i){const c=G.deck[i];if(G.lock||c.o||c.m||G.over)return;c.o=true;G.open.push(i);G.flips++;
  if(G.open.length===2){const [a,b]=G.open;if(G.deck[a].v===G.deck[b].v){G.deck[a].m=G.deck[b].m=true;G.open=[];if(G.deck.every(x=>x.m)){G.over=true;const best=LSg('memoBest',0);const nb=!best||G.flips<best;if(nb)LSs('memoBest',G.flips);celebrate(true);memoDraw(`다 찾았어요! ${G.flips}번 · ${Math.round((Date.now()-G.t0)/1000)}초${nb?' · 🏆 최고 기록!':''}`);return;}memoDraw('짝! 좋아요 ✨');}
    else{G.lock=true;memoDraw('아쉬워요…');setTimeout(()=>{if(!G||G.game!=='memo')return;G.deck[a].o=G.deck[b].o=false;G.open=[];G.lock=false;memoDraw('다시 찾아봐요');},800);}}else memoDraw('하나 더!');}

/* ---------- 이벤트 ---------- */
document.addEventListener('click',e=>{const t=e.target;
  const g=t.closest('[data-g]');if(g){const vs=g.dataset.vs;if(vs==='pick'){if(pickFor){invite(pickFor,g.dataset.g);pickFor=null;}else pickFriend(g.dataset.g);}else startGame(g.dataset.g,vs,'local',0);return;}
  const inv=t.closest('[data-inv]');if(inv){invite(inv.dataset.inv,inv.dataset.game);return;}
  const dm=t.closest('[data-dm]');if(dm){openWhisper(dm.dataset.dm);return;}
  const pl=t.closest('[data-play]');if(pl){pickFor=pl.dataset.play;openSheet('games');renderGames();$('#gPick').hidden=false;$('#gPick').innerHTML=`<div class="empty">🎮 <b>${E(NM(pickFor))}</b>님과 할 놀이의 <b>👥 친구랑</b>을 눌러요</div>`;return;}
  if(!G)return;
  const r=t.closest('[data-rps]');if(r){rpsPick(+r.dataset.rps);return;}
  const ch=t.closest('[data-cham]');if(ch){chamPick(ch.dataset.cham);return;}
  const mm=t.closest('[data-memo]');if(mm){memoPick(+mm.dataset.memo);return;}
  if(t.closest('#yThrow')){myThrow();return;}
  const pc=t.closest('[data-pc]');if(pc&&G.phase==='pick'){G.phase='wait';const tt=G.pendingN;finishMine(tt,+pc.dataset.pc);return;}
  if(t.closest('#gAgain')){if(G.pvp)sendG(G.vs,{k:'again',gid:G.gid});({rps:rpsStart,yut:yutStart,cham:chamStart,memo:memoStart})[G.game]();return;}});
$('#gInvOk').addEventListener('click',()=>{$('#gInv').classList.remove('show');if(!invQ)return;sendG(invQ.from,{k:'ok',gid:invQ.gid,game:invQ.game});startGame(invQ.game,invQ.from,invQ.gid,1);invQ=null;});
$('#gInvNo').addEventListener('click',()=>{$('#gInv').classList.remove('show');if(invQ)sendG(invQ.from,{k:'no',gid:invQ.gid});invQ=null;});
$('#gQuit').addEventListener('click',()=>{if(G&&G.pvp)sendG(G.vs,{k:'quit',gid:G.gid});endPlay();});
$('#dmSend').addEventListener('click',sendDM);$('#dmIn').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();sendDM();}});
window.__socialOpen=id=>{if(id==='games')renderGames();if(id==='friends')dmInbox();};
/* 받은 편지함 연결 (Firebase 연결 후) */
let hooked=false;setInterval(()=>{if(!hooked&&DM()&&DM().ready()){hooked=true;DM().listen(gotDM);}dmBadge();},1000);
})();
