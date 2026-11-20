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
 {id:'rps',ico:'✊',name:'가위바위보',desc:'해태랑은 세 판 두 승. 다같이 하면 지는 사람이 탈락, 끝까지 남으면 승리!',ai:true,pvp:true},
 {id:'yut',ico:'🎋',name:'윷놀이',desc:'말 두 개를 먼저 다 들여보내면 승리. 윷·모·잡기는 한 번 더! 여럿이 차례대로 던져요.',ai:true,pvp:true},
 {id:'cham',ico:'👉',name:'참참참',desc:'해태 손가락과 다른 쪽으로 피해요. 다섯 판, 적게 맞으면 승리!',ai:true,pvp:true},
 {id:'omok',ico:'⚫',name:'오목',desc:'돌 다섯 개를 한 줄로 먼저 놓으면 승리! 다같이 하면 여러 색 돌로 차례대로 둬요.',ai:true,pvp:true},
 {id:'rumi',ico:'🔢',name:'숫자패 놀이',desc:'루미큐브 방식! 같은 색 연속 숫자나 같은 숫자 다른 색으로 3장 이상 묶어 내려놓고, 손패를 먼저 다 털면 승리. (2~4명)',pvp:true},
 {id:'memo',ico:'🃏',name:'짝맞추기',desc:'같은 그림 두 장을 찾아요. 다같이 하면 차례대로, 짝을 많이 찾은 사람이 승리!',solo:true,pvp:true}];
let G=null; // 지금 하는 게임
function renderGames(){const fr=(typeof onlineFriends==='function')?onlineFriends():[];
  $('#gList').innerHTML=GAMES.map(g=>`<div class="gCard"><div class="gIco">${g.ico}</div><div class="gTx"><b>${g.name}</b><small>${g.desc}</small>
    <div class="gBtn">${g.solo?`<button class="primary" data-g="${g.id}" data-vs="solo">혼자 하기</button>`:''}${g.ai?`<button class="primary" data-g="${g.id}" data-vs="ai">🦁 해태랑</button>`:''}${g.pvp?`<button class="ghost" data-g="${g.id}" data-vs="pick">👥 다같이</button>`:''}</div></div></div>`).join('')
    +`<div class="gRec">🏆 내 전적 · ${Object.entries(LSg('gRec',{})).map(([k,v])=>`${(GAMES.find(g=>g.id===k)||{}).name||k} ${v.w||0}승 ${v.l||0}패`).join(' · ')||'아직 없어요'}</div>`;
  $('#gPick').hidden=true;}
function rec(id,win){const r=LSg('gRec',{});r[id]=r[id]||{w:0,l:0};if(win===true)r[id].w++;else if(win===false)r[id].l++;LSs('gRec',r);}
/* ====================== 다같이 놀기 (방장이 판을 관리해요) ====================== */
let pickFor=null,N=null,invQ=null;
window.openGames=function(withId){openSheet('games');renderGames();if(withId)pickFor=withId;};
function sendG(to,obj){return DM()?DM().send(to,{t:'',g:JSON.stringify(obj)}).catch(()=>{}):Promise.resolve();}
function pickFriend(game){const fr=(typeof onlineFriends==='function')?onlineFriends():[];const el=$('#gPick');el.hidden=false;const g=GAMES.find(x=>x.id===game);
  el.innerHTML=`<div class="sec">${g.ico} ${g.name} · 누구랑 할까요?</div>`+(DM()?(fr.length?`<label class="gChk all"><input type="checkbox" id="gAll" ${pickFor?'':'checked'}> 접속한 친구 모두 (${fr.length}명)</label>`+fr.map(r=>`<label class="gChk"><input type="checkbox" data-who="${r.by}" ${!pickFor||pickFor===r.by?'checked':''}> <b>${E(NM(r.by))}</b><small>${E(spName(r.pr.sp))}</small></label>`).join('')+`<button class="primary" id="gSendInv" data-game="${game}">📮 초대장 보내기</button>`:'<div class="empty">지금 접속한 친구가 없어요. 해태랑 먼저 연습해 볼까요?</div>'):'<div class="empty">친구랑 하는 놀이는 함께 쓰는 학당(Vercel 링크)에서만 돼요.</div>');
  el.scrollIntoView({behavior:'smooth',block:'nearest'});}
function hostInvite(game,ids){if(!ids.length){toast('함께할 친구를 골라 주세요');return;}const gid='g'+Date.now().toString(36)+rnd(999);
  N={gid,game,host:MYID,isHost:true,invited:ids,joined:[MYID],no:[],s:null};ids.forEach(id=>sendG(id,{k:'inv',game,gid,n:ids.length+1}));pickFor=null;
  openSheet('gPlay');$('#gPlayT').textContent=(GAMES.find(g=>g.id===game)||{}).name;lobby();}
function lobby(){if(!N)return;const g=GAMES.find(x=>x.id===N.game);
  if(N.isHost){const rows=[MYID,...N.invited].map(id=>{const st=id===MYID||N.joined.includes(id)?'✅ 참가':N.no.includes(id)?'🙅 다음에':'⏳ 기다리는 중';return `<div class="frRow"><span><b>${E(id===MYID?(ST.nick||'나')+' (방장)':NM(id))}</b></span><small>${st}</small></div>`;}).join('');
    PB().innerHTML=`<div class="gMsg">${g.ico} ${g.name} 대기실</div>${rows}<button class="primary" id="gStart" ${N.joined.length<2?'disabled':''} style="margin-top:12px">${N.joined.length<2?'친구가 들어오길 기다려요…':`🎉 ${N.joined.length}명이서 시작하기`}</button>`;}
  else PB().innerHTML=`<div class="gMsg">${g.ico} ${g.name}</div><div class="empty" style="text-align:center">✅ 참가했어요!<br><b>${E(NM(N.host))}</b>님이 시작하면 바로 놀이가 열려요.</div>`;}
function bcast(){if(!N||!N.isHost)return;N.s.v=(N.s.v||0)+1;N.s.pl.forEach(id=>{if(id===MYID||id==='AI')return;const msg={k:'st',gid:N.gid,game:N.game,s:N.s};if(N.priv)msg.hand=N.priv.hands[id]||[];sendG(id,msg);});if(N.priv)N.hand=N.priv.hands[MYID]||[];nRender();if(N.local)aiTurn();if(N.game==='rumi'&&!N.s.win){clearTimeout(rumiT);const s=N.s,v=s.v,cur=s.pl[s.turn];rumiT=setTimeout(()=>{if(N&&N.s===s&&s.v===v&&!s.win){s.msg=`${nm2(cur)} 시간 초과 · 자동으로 한 장`;hostAct(cur,{k:'draw'});}},150000);}}
let rumiT=null;
function act(a){if(!N||!N.s)return;if(N.isHost)hostAct(MYID,a);else sendG(N.host,{k:'act',gid:N.gid,a});}
function gotGame(v){let m;try{m=JSON.parse(v.g);}catch(e){return;}const from=v.by;
  if(m.k==='inv'){if(N&&N.s&&!N.s.win){sendG(from,{k:'no',gid:m.gid});return;}invQ={from,game:m.game,gid:m.gid};const g=GAMES.find(x=>x.id===m.game);$('#gInvTx').innerHTML=`${g?g.ico:'🎮'} <b>${E(NM(from))}</b>님이<br><b>${g?g.name:'놀이'}</b> 같이 하재요!${m.n>2?`<br><small>${m.n}명이 함께해요</small>`:''}`;$('#gInv').classList.add('show');try{chime();}catch(e){}return;}
  if(!N||N.gid!==m.gid)return;
  if(N.isHost){if(m.k==='join'&&!N.joined.includes(from)){N.joined.push(from);toast(`${E(NM(from))}님이 들어왔어요`);if(!N.s)lobby();return;}
    if(m.k==='no'){N.no.push(from);if(!N.s)lobby();return;}
    if(m.k==='act'&&N.s&&N.s.pl.includes(from)){hostAct(from,m.a);return;}
    if(m.k==='left'&&N.s){hostLeft(from);return;}}
  else{if(m.k==='err'){toast(String(m.t||'다시 확인해 주세요'));return;}if(m.k==='st'){if(!N.s||(m.s.v||0)>=(N.s.v||0)||m.s.v===1){N.s=m.s;if(m.hand)N.hand=m.hand;nRender();}return;}if(m.k==='end'){toast('방장이 놀이를 끝냈어요');N=null;closeSheets();}}}
function startGame(game,vs,gid,me){G={game,vs,gid,me,pvp:false};openSheet('gPlay');$('#gPlayT').textContent=(GAMES.find(g=>g.id===game)||{}).name||'';
  ({rps:rpsStart,yut:yutStart,cham:chamStart,memo:memoStart})[game]();}
const nm=id=>id===MYID?'나':NM(id);
const COL=['#c4384a','#2a5a9a','#3f8a5a','#c88a2a','#8a5ab8','#3a8a9a'];
/* --- 방장: 판 만들기 --- */
function newState(game,pl){const s={pl,win:null,msg:''};
  if(game==='rps')Object.assign(s,{r:1,alive:pl.slice(),pick:{},last:null});
  if(game==='yut')Object.assign(s,{P:Object.fromEntries(pl.map(id=>[id,[0,0]])),turn:0,phase:'throw',n:null,f:[0,0,0,0]});
  if(game==='cham')Object.assign(s,{r:1,max:5,pick:{},hits:Object.fromEntries(pl.map(id=>[id,0])),last:null});
  if(game==='omok')Object.assign(s,{n:15,b:'.'.repeat(225),turn:0,last:-1});
  if(game==='rumi'){const pool=[];['R','B','Y','K'].forEach(c=>{for(let k=1;k<=13;k++){pool.push(c+k,c+k);}});pool.push('J','J');pool.sort(()=>Math.random()-.5);
    const hands={};pl.forEach(id=>hands[id]=pool.splice(0,14));N.priv={hands,pool};Object.assign(s,{table:[],turn:0,cnt:Object.fromEntries(pl.map(id=>[id,14])),opened:{},pool:pool.length,passes:0});}
  if(game==='memo'){const d=[...Array(8).keys(),...Array(8).keys()].sort(()=>Math.random()-.5);Object.assign(s,{deck:d.join(''),own:'.'.repeat(16),open:[],turn:0,sc:Object.fromEntries(pl.map(id=>[id,0]))});}
  return s;}
let hostT=null;
function hostAct(u,a){const s=N.s;if(!s||s.win)return;const g=N.game;
  if(g==='rps'){if(!s.alive.includes(u)||s.pick[u]!=null)return;s.pick[u]=a.c;rpsCheck();return;}
  if(g==='cham'){if(s.pick[u]!=null)return;s.pick[u]=a.c;chamCheck();return;}
  if(g==='yut'){if(s.pl[s.turn]!==u)return;if(a.k==='throw'&&s.phase==='throw'){const t=throwYut();s.n=t.n;s.f=t.f;s.roll=(s.roll||0)+1;const mv=movableN(s,u,t.n);if(!mv.length){yutApplyN(s,u,t.n,-1);}else if(mv.length===1){yutApplyN(s,u,t.n,mv[0]);}else{s.phase='pick';s.msg=`${nm2(u)} · ${YN[t.n]}! 말을 골라요`;}bcast();return;}
    if(a.k==='pick'&&s.phase==='pick'){yutApplyN(s,u,s.n,a.pc);bcast();return;}return;}
  if(g==='omok'){if(s.pl[s.turn]!==u)return;const i=a.i;if(!(i>=0&&i<225)||s.b[i]!=='.')return;const me=String(s.turn);s.b=s.b.slice(0,i)+me+s.b.slice(i+1);s.last=i;
    if(five(s.b,i,me)){s.win=[u];s.msg=`${nm2(u)} 오목 완성! 🎉`;}else if(!s.b.includes('.')){s.win=[];s.msg='무승부!';}else{s.turn=(s.turn+1)%s.pl.length;s.msg=`${nm2(s.pl[s.turn])} 차례`;}bcast();return;}
  if(g==='rumi'){if(s.pl[s.turn]!==u)return;const H=N.priv.hands[u];
    if(a.k==='draw'){if(N.priv.pool.length){H.push(N.priv.pool.pop());s.msg=`${nm2(u)} 한 장 가져갔어요`;s.passes=0;}else{s.passes++;s.msg=`${nm2(u)} 넘김 (더미가 없어요)`;}rumiNext(s);bcast();return;}
    if(a.k==='commit'){const err=rumiCheck(s,u,a);if(err){if(u===MYID)toast(err);else sendG(u,{k:'err',gid:N.gid,t:err});return;}
      const used=[...(a.sets||[]).flat(),...(a.adds||[]).flatMap(x=>x.t)];used.forEach(t=>{H.splice(H.indexOf(t),1);});
      (a.adds||[]).forEach(x=>{s.table[x.i]=arrange(s.table[x.i].concat(x.t));});(a.sets||[]).forEach(t=>s.table.push(arrange(t)));s.opened[u]=1;s.passes=0;
      s.msg=`${nm2(u)} ${used.length}장 내려놓음`;if(!H.length){s.win=[u];s.msg=`${nm2(u)} 손패를 다 털었어요! 🎉`;}else rumiNext(s);bcast();return;}return;}
  if(g==='memo'){if(s.pl[s.turn]!==u||s.lock)return;const i=a.i;if(s.own[i]!=='.'||s.open.includes(i))return;s.open.push(i);
    if(s.open.length===2){const [x,y]=s.open;if(s.deck[x]===s.deck[y]){const oi=String(s.turn);s.own=s.own.split('').map((c,k)=>k===x||k===y?oi:c).join('');s.sc[u]++;s.open=[];s.msg=`${nm2(u)} 짝! 한 번 더 ✨`;
        if(!s.own.includes('.')){const mx=Math.max(...Object.values(s.sc));s.win=Object.keys(s.sc).filter(k=>s.sc[k]===mx);s.msg='끝!';}}
      else{s.lock=true;s.msg='아쉬워요…';bcast();setTimeout(()=>{if(!N||N.s!==s)return;s.open=[];s.lock=false;s.turn=(s.turn+1)%s.pl.length;s.msg=`${nm2(s.pl[s.turn])} 차례`;bcast();},1100);return;}}
    bcast();}}
function five(b,i,me){const n=15,x=i%n,y=Math.floor(i/n);return [[1,0],[0,1],[1,1],[1,-1]].some(([dx,dy])=>{let c=1;for(const sg of[1,-1]){let k=1;while(true){const xx=x+dx*k*sg,yy=y+dy*k*sg;if(xx<0||yy<0||xx>=n||yy>=n||b[yy*n+xx]!==me)break;c++;k++;}}return c>=5;});}
function omokAI(b,me){const n=15;let best=-1,bs=-1;const any=b.split('').some(c=>c!=='.');if(!any)return 112;
  const lineScore=(i,who)=>{const x=i%n,y=Math.floor(i/n);let tot=0;[[1,0],[0,1],[1,1],[1,-1]].forEach(([dx,dy])=>{let c=1,open=0;for(const sg of[1,-1]){let k=1;while(true){const xx=x+dx*k*sg,yy=y+dy*k*sg;if(xx<0||yy<0||xx>=n||yy>=n)break;const v=b[yy*n+xx];if(v===who){c++;k++;continue;}if(v==='.')open++;break;}}
    tot+=c>=5?1e6:c===4?(open===2?5e4:open?6e3:0):c===3?(open===2?3e3:open?300:0):c===2?(open===2?120:open?20:0):open;});return tot;};
  const opp=[...new Set(b.split('').filter(c=>c!=='.'&&c!==me))];
  for(let i=0;i<n*n;i++){if(b[i]!=='.')continue;const x=i%n,y=Math.floor(i/n);let near=false;for(let dy=-2;dy<=2&&!near;dy++)for(let dx=-2;dx<=2;dx++){const xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<n&&yy<n&&b[yy*n+xx]!=='.'){near=true;break;}}if(!near)continue;
    const sc=lineScore(i,me)*1.1+Math.max(0,...opp.map(o=>lineScore(i,o)))+Math.random();if(sc>bs){bs=sc;best=i;}}return best;}
function aiTurn(){const s=N&&N.s;if(!s||s.win||s.pl[s.turn]!=='AI')return;setTimeout(()=>{if(!N||N.s!==s||s.win)return;if(N.game==='omok')hostAct('AI',{i:omokAI(s.b,String(s.turn))});},700);}
function startLocalN(game){G=null;N={gid:'local'+Date.now(),game,host:MYID,isHost:true,local:true,joined:[MYID,'AI'],invited:[],no:[]};N.s=newState(game,[MYID,'AI']);N.celebrated=false;N.s.msg='내 차례 · 칸을 두 번 누르면 돌을 놓아요';openSheet('gPlay');bcast();}
/* 숫자패 (루미큐브 방식) */
const TC={R:'#c4384a',B:'#2a5aa8',Y:'#c8861a',K:'#2a2a30'};
const tNum=t=>t==='J'?0:+t.slice(1),tCol=t=>t==='J'?'J':t[0];
function arrangeRun(ts){const js=ts.filter(t=>t==='J'),o=ts.filter(t=>t!=='J');if(!o.length)return ts.length>=3?ts:null;const c=tCol(o[0]);if(o.some(t=>tCol(t)!==c))return null;const ns=o.map(tNum).sort((a,b)=>a-b);
  for(let k=1;k<ns.length;k++)if(ns[k]===ns[k-1])return null;let lo=ns[0],hi=ns[ns.length-1];let j=js.length-((hi-lo+1)-ns.length);if(j<0)return null;while(j>0&&hi<13){hi++;j--;}while(j>0&&lo>1){lo--;j--;}if(j>0||hi-lo+1<3)return null;
  const out=[];for(let v=lo;v<=hi;v++)out.push(ns.includes(v)?c+v:'J');return out;}
function arrangeGrp(ts){const o=ts.filter(t=>t!=='J');if(ts.length<3||ts.length>4||!o.length)return null;const n=tNum(o[0]);if(o.some(t=>tNum(t)!==n))return null;const cs=o.map(tCol);if(new Set(cs).size!==cs.length)return null;return [...o,...ts.filter(t=>t==='J')];}
function arrange(ts){return arrangeRun(ts)||arrangeGrp(ts);}
function setPts(ts){const r=arrangeRun(ts);if(r){let lo=null;const firstReal=r.findIndex(t=>t!=='J');const base=tNum(r[firstReal])-firstReal;return r.reduce((a,_,k)=>a+base+k,0);}const g=arrangeGrp(ts);if(g){const n=tNum(g.find(t=>t!=='J'));return n*g.length;}return 0;}
function rumiCheck(s,u,a){const H=N.priv.hands[u].slice();const sets=a.sets||[],adds=a.adds||[];const used=[...sets.flat(),...adds.flatMap(x=>x.t)];if(!used.length)return '내려놓을 패가 없어요';
  for(const t of used){const k=H.indexOf(t);if(k<0)return '손패에 없는 패가 있어요';H.splice(k,1);}
  for(const st of sets)if(!arrange(st))return '규칙에 맞지 않는 묶음이 있어요';
  for(const x of adds){if(!s.table[x.i]||!arrange(s.table[x.i].concat(x.t)))return '붙일 수 없는 패가 있어요';}
  if(!s.opened[u]){if(adds.length)return '처음엔 내 패로만 30점 이상 내려놔야 해요';const pts=sets.reduce((a,st)=>a+setPts(st),0);if(pts<30)return `처음 내려놓기는 30점 이상! (지금 ${pts}점)`;}
  return '';}
function rumiNext(s){s.turn=(s.turn+1)%s.pl.length;s.cnt=Object.fromEntries(s.pl.map(id=>[id,N.priv.hands[id].length]));s.pool=N.priv.pool.length;
  if(s.passes>=s.pl.length&&!N.priv.pool.length){let mn=1e9;const sum=id=>N.priv.hands[id].reduce((a,t)=>a+(t==='J'?30:tNum(t)),0);s.pl.forEach(id=>mn=Math.min(mn,sum(id)));s.win=s.pl.filter(id=>sum(id)===mn);s.msg='더미가 다 떨어졌어요 · 남은 점수가 가장 적은 사람 승리';return;}
  if(!s.win)s.msg+=` → ${nm2(s.pl[s.turn])} 차례`;RS=null;}
let RS=null; // 내 차례 준비 상태
function rsInit(){const s=N.s;const key=s.v+'|'+s.turn;if(!RS||RS.key!==key)RS={key,sel:new Set(),sets:[],adds:[],addMode:false,sort:RS?RS.sort:'c'};return RS;}
function rsHandLeft(){const H=(N.hand||[]).slice();RS.sets.flat().concat(RS.adds.flatMap(x=>x.t)).forEach(t=>{const k=H.indexOf(t);if(k>=0)H.splice(k,1);});return H;}
const tileH=(t,extra)=>`<b class="tile ${t==='J'?'jk':''} ${extra||''}" style="--tc:${TC[tCol(t)]||'#7a3ab8'}">${t==='J'?'★':tNum(t)}</b>`;
const nm2=id=>id===MYID?(ST.nick||'나'):id==='AI'?'해태':NM(id);
function armTimer(fn){clearTimeout(hostT);hostT=setTimeout(fn,20000);}
function rpsCheck(){const s=N.s;const wait=s.alive.filter(u=>s.pick[u]==null);if(wait.length){bcast();armTimer(()=>{if(!N||N.s!==s)return;wait.forEach(u=>{if(s.pick[u]==null)s.pick[u]=rnd(3);});rpsCheck();});return;}
  clearTimeout(hostT);const sh=[...new Set(s.alive.map(u=>s.pick[u]))];let msg;
  if(sh.length!==2)msg='비겼어요! 다시 🤝';else{const w=beats(sh[0],sh[1])?sh[0]:sh[1];const out=s.alive.filter(u=>s.pick[u]!==w);s.alive=s.alive.filter(u=>s.pick[u]===w);msg=`${RPS[w]} ${RPSN[w]} 승! · ${out.map(nm2).join(', ')} 탈락`;}
  s.last={pick:Object.assign({},s.pick),msg};s.pick={};s.r++;if(s.alive.length===1){s.win=[s.alive[0]];}bcast();}
function chamCheck(){const s=N.s;const wait=s.pl.filter(u=>s.pick[u]==null);if(wait.length){bcast();armTimer(()=>{if(!N||N.s!==s)return;wait.forEach(u=>{if(s.pick[u]==null)s.pick[u]=Math.random()<.5?'L':'R';});chamCheck();});return;}
  clearTimeout(hostT);const d=Math.random()<.5?'L':'R';const hit=s.pl.filter(u=>s.pick[u]===d);hit.forEach(u=>s.hits[u]++);s.last={d,pick:Object.assign({},s.pick),hit};s.pick={};s.r++;
  if(s.r>s.max){const mn=Math.min(...Object.values(s.hits));s.win=Object.keys(s.hits).filter(k=>s.hits[k]===mn);}bcast();}
function movableN(s,u,n){const P=s.P[u];const r=[],seen=new Set();P.forEach((p,i)=>{if(p>=20)return;if(n===-1&&p===0)return;if(seen.has(p))return;seen.add(p);r.push(i);});return r;}
function yutApplyN(s,u,n,pc){let extra=n===4||n===5;let msg=`${nm2(u)} · ${YN[n]}!`;
  if(pc>=0){const P=s.P[u],from=P[pc];let to=n===-1?Math.max(0,from-1):from+n;P.forEach((p,i)=>{if(p===from&&(from>0||i===pc))P[i]=to>=20?20:to;});
    if(to>0&&to<20){const caught=s.pl.filter(o=>o!==u&&s.P[o].some(p=>p===to));if(caught.length){caught.forEach(o=>s.P[o]=s.P[o].map(p=>p===to?0:p));extra=true;msg+=` ${caught.map(nm2).join(', ')} 잡았다! 🎉`;}}
    if(to>=20)msg+=' 골인! 🏁';}else msg+=' 움직일 말이 없어요';
  if(s.P[u].every(p=>p>=20)){s.win=[u];s.msg=msg;return;}
  if(!extra)s.turn=(s.turn+1)%s.pl.length;else msg+=' 한 번 더!';s.phase='throw';s.msg=msg+(extra?'':` → ${nm2(s.pl[s.turn])} 차례`);}
function hostLeft(u){const s=N.s;if(!s)return;toast(`${E(NM(u))}님이 나갔어요`);const ti=s.pl.indexOf(u);const cur=s.pl[s.turn];s.pl=s.pl.filter(x=>x!==u);
  if(s.alive)s.alive=s.alive.filter(x=>x!==u);if(s.P)delete s.P[u];if(s.pick)delete s.pick[u];if(s.hits)delete s.hits[u];if(s.sc)delete s.sc[u];
  if(s.turn!=null){const ni=s.pl.indexOf(cur);s.turn=ni>=0?ni:(ti%Math.max(1,s.pl.length));}
  if(s.pl.length<2&&!s.win)s.win=s.pl.slice();else if(N.game==='rps'){if(s.alive.length===1)s.win=[s.alive[0]];else rpsCheck();return;}else if(N.game==='cham'){chamCheck();return;}
  bcast();}
/* --- 모두: 화면 그리기 --- */
function winLine(s){if(!s.win)return '';if(!s.win.length){if(!N.celebrated){N.celebrated=true;}return `<div class="gWin">🤝 무승부!</div>${N.isHost?`<button class="primary" id="nAgain">한 판 더!</button>`:''}`;}const me=s.win.includes(MYID);if(!N.celebrated){N.celebrated=true;rec(N.game,me);celebrate(me);}
  return `<div class="gWin">${me?'👑 내가 이겼어요!':`👑 ${s.win.map(nm2).join(', ')} 승리!`}</div>${N.isHost?`<button class="primary" id="nAgain">${N.local?'한 판 더!':'같은 친구들과 한 판 더!'}</button>`:'<div class="empty" style="text-align:center">방장이 한 판 더 열 수 있어요</div>'}`;}
function chips(s,extra){return `<div class="nPl">${s.pl.map((id,i)=>`<span class="nChip ${extra?extra(id,i):''}" style="--c:${COL[i%COL.length]}">${E(nm2(id))}</span>`).join('')}</div>`;}
function nRender(){if(!N||!N.s)return;const s=N.s;const el=PB();if(!$('#gPlay').classList.contains('show'))openSheet('gPlay');$('#gPlayT').textContent=(GAMES.find(g=>g.id===N.game)||{}).name+` · ${s.pl.length}명`;
  if(N.game==='rps'){const alive=s.alive.includes(MYID),picked=s.pick[MYID]!=null;
    el.innerHTML=chips(s,id=>(s.alive.includes(id)?'':'out ')+(s.pick[id]!=null?'done':''))+(s.last?`<div class="nLast">${s.pl.map(id=>s.last.pick[id]!=null?`<span>${E(nm2(id))} ${RPS[s.last.pick[id]]}</span>`:'').join('')}</div><div class="gMsg">${s.last.msg}</div>`:'<div class="gMsg">모두 골라요! (20초 안에 안 고르면 자동으로 골라져요)</div>')
      +(s.win?winLine(s):alive?`<div class="gMsg sm">${s.r}판 · ${picked?'다른 친구들 기다리는 중…':'내 손은?'}</div><div class="rpsBtns">${RPS.map((h,i)=>`<button data-nrps="${i}" ${picked?'disabled':''} class="${s.pick[MYID]===i?'on':''}">${h}<small>${RPSN[i]}</small></button>`).join('')}</div>`:'<div class="gMsg sm">탈락했어요 😵 구경 중…</div>');}
  if(N.game==='cham'){const picked=s.pick[MYID]!=null;
    el.innerHTML=chips(s,id=>s.pick[id]!=null?'done':'')+`<div class="nScore">${s.pl.map(id=>`<span>${E(nm2(id))} <b>${s.hits[id]}</b>대</span>`).join('')}</div>`
      +(s.last?`<div class="chamStage"><div class="chamHand ${s.last.d}">${s.last.d==='L'?'👈':'👉'}</div></div><div class="gMsg">${s.last.hit.length?`${s.last.hit.map(nm2).join(', ')} 걸렸다! 😵`:'모두 피했어요! 😆'}</div>`:'<div class="chamStage"><div class="chamHand">☝️</div></div><div class="gMsg">해태 손가락을 피해요! 적게 맞은 사람이 승리</div>')
      +(s.win?winLine(s):`<div class="gMsg sm">${Math.min(s.r,s.max)}/${s.max}판 · ${picked?'다른 친구들 기다리는 중…':'어느 쪽으로 피할까?'}</div><div class="rpsBtns two"><button data-ncham="L" ${picked?'disabled':''}>⬅️<small>왼쪽</small></button><button data-ncham="R" ${picked?'disabled':''}>➡️<small>오른쪽</small></button></div>`);}
  if(N.game==='yut'){const my=s.pl[s.turn]===MYID;let cells='';for(let p=0;p<20;p++){const [x,y]=cellXY(p);cells+=`<i class="yc ${p%5===0?'big':''}" style="left:${8+x*84}%;top:${8+y*84}%">${p===0?'출':''}</i>`;}
    const tk=[];s.pl.forEach((id,pi)=>{const grp={};(s.P[id]||[]).forEach((p,i)=>{if(p>0&&p<20)(grp[p]=grp[p]||[]).push(i);});Object.entries(grp).forEach(([p,ids])=>{const [x,y]=cellXY(+p);const can=my&&s.phase==='pick'&&id===MYID;const off=(pi-(s.pl.length-1)/2)*22;
      tk.push(`<b class="yt ${can?'can':''}" ${can?`data-npc="${ids[0]}"`:''} style="background:${COL[pi%COL.length]};left:calc(${8+x*84}% + ${off}px);top:${8+y*84}%;transform:translate(-50%,-50%)">${E(nm2(id).slice(0,1))}${ids.length>1?'<sup>×2</sup>':''}</b>`);});});
    const homes=s.pl.map((id,pi)=>`<span class="nChip ${pi===s.turn?'cur':''}" style="--c:${COL[pi%COL.length]}">${E(nm2(id))} ${(s.P[id]||[]).map((p,i)=>p===0?`<b class="dotp ${my&&s.phase==='pick'&&id===MYID?'can':''}" ${my&&s.phase==='pick'&&id===MYID?`data-npc="${i}"`:''}>●</b>`:p>=20?'✓':'○').join('')}</span>`).join('');
    el.innerHTML=`<div class="nPl">${homes}</div><div class="yBoard">${cells}${tk.join('')}<div class="ySticks">${(s.f||[0,0,0,0]).map(v=>`<i class="${v?'f':'b'}"></i>`).join('')}</div>${s.n!=null?`<div class="yRes" data-k="${s.roll||0}">${YN[s.n]}!</div>`:''}</div><div class="gMsg sm">${E(s.msg||'')}</div>`
      +(s.win?winLine(s):`<button class="primary" id="nThrow" ${my&&s.phase==='throw'?'':'disabled'}>${my?(s.phase==='pick'?'👆 움직일 말을 눌러요':'🎋 윷 던지기'):`${E(nm2(s.pl[s.turn]))} 차례`}</button>`);}
  if(N.game==='omok'){const my=s.pl[s.turn]===MYID;const stc=d=>s.pl.length===2?(d==='0'?'#1a1a1e':'#fbfbf6'):COL[+d%COL.length];
    el.innerHTML=chips(s,(id,i)=>i===s.turn?'cur':'').replace(/<span class="nChip/g,'<span class="nChip')+`<div class="omok">${s.b.split('').map((c,i)=>`<i data-nomok="${i}" class="${c!=='.'?'st':''} ${i===s.last?'last':''} ${N.ghost===i?'gh':''}" ${c!=='.'?`style="--s:${stc(c)}"`:N.ghost===i?`style="--s:${stc(String(s.turn))}"`:''}></i>`).join('')}</div>`
      +`<div class="gMsg sm">${E(s.msg||'')}${my&&!s.win?' · 같은 칸을 한 번 더 누르면 놓여요':''}</div>`+(s.win?winLine(s):'');}
  if(N.game==='rumi'){const my=s.pl[s.turn]===MYID&&!s.win;rsInit();const left=rsHandLeft();const srt=left.map((t,i)=>({t,i})).sort((a,b)=>RS.sort==='c'?(tCol(a.t).localeCompare(tCol(b.t))||tNum(a.t)-tNum(b.t)):(tNum(a.t)-tNum(b.t)||tCol(a.t).localeCompare(tCol(b.t))));
    el.innerHTML=`<div class="nPl">${s.pl.map((id,i)=>`<span class="nChip ${i===s.turn?'cur':''}" style="--c:${COL[i%COL.length]}">${E(nm2(id))} ${s.cnt[id]}장${s.opened[id]?'':' · 시작 전'}</span>`).join('')}</div>
      <div class="rTable">${s.table.length||RS.sets.length?'':'<div class="empty">아직 내려놓은 패가 없어요</div>'}${s.table.map((st,i)=>{const ad=RS.adds.filter(x=>x.i===i).flatMap(x=>x.t);return `<div class="rSet ${RS.addMode&&my?'pick':''}" data-rset="${i}">${st.map(t=>tileH(t)).join('')}${ad.map(t=>tileH(t,'new')).join('')}</div>`;}).join('')}${RS.sets.map((st,i)=>`<div class="rSet staged" data-rstg="${i}">${st.map(t=>tileH(t,'new')).join('')}<small>✕</small></div>`).join('')}</div>
      <div class="gMsg sm">${E(s.msg||'')} · 더미 ${s.pool}장</div>
      <div class="rHandBar"><span>내 패 ${left.length}장</span><button class="ghost sm" id="rSort">${RS.sort==='c'?'숫자순':'색깔순'} 정렬</button></div>
      <div class="rHand">${srt.map(({t,i})=>`<span data-rh="${i}">${tileH(t,RS.sel.has(i)?'sel':'')}</span>`).join('')}</div>`
      +(s.win?winLine(s):my?`<div class="rBtns"><button class="ghost" id="rMake">묶어서 내기</button><button class="ghost" id="rAdd" ${s.opened[MYID]?'':'disabled'}>${RS.addMode?'붙일 묶음을 눌러요':'묶음에 붙이기'}</button><button class="ghost" id="rUndo">되돌리기</button></div>
        <div class="rBtns two"><button class="ghost" id="rDraw" ${RS.sets.length||RS.adds.length?'disabled':''}>🀫 한 장 가져오기</button><button class="primary" id="rCommit" ${RS.sets.length||RS.adds.length?'':'disabled'}>✔ 내려놓고 넘기기</button></div>${s.opened[MYID]?'':'<div class="empty">처음 내려놓을 땐 내 패로만 30점 이상이어야 해요. 차례마다 2분 30초 안에 안 하면 자동으로 한 장 가져가요.</div>'}`:`<div class="gMsg sm">${E(nm2(s.pl[s.turn]))} 차례를 기다려요…</div>`);}
  if(N.game==='memo'){const my=s.pl[s.turn]===MYID;
    el.innerHTML=chips(s,(id,i)=>i===s.turn?'cur':'')+`<div class="nScore">${s.pl.map(id=>`<span>${E(nm2(id))} <b>${s.sc[id]}</b>짝</span>`).join('')}</div>`
      +`<div class="memo">${s.deck.split('').map((v,i)=>{const o=s.own[i]!=='.',op=s.open.includes(i);return `<button data-nmemo="${i}" class="${o||op?'o':''} ${o?'m':''}" ${o?`style="border-color:${COL[+s.own[i]%COL.length]}"`:''}><span>${o||op?MEMO[+v]:'學'}</span></button>`;}).join('')}</div>`
      +`<div class="gMsg sm">${E(s.msg||(my?'내 차례! 두 장을 뒤집어요':`${nm2(s.pl[s.turn])} 차례`))}</div>`+(s.win?winLine(s):'');}}

function endPlay(){G=null;if(N){if(N.isHost){(N.s?N.s.pl:N.joined).forEach(id=>{if(id!==MYID)sendG(id,{k:'end',gid:N.gid});});}else sendG(N.host,{k:'left',gid:N.gid});N=null;}clearTimeout(hostT);closeSheets();}
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
  const g=t.closest('[data-g]');if(g){const vs=g.dataset.vs;if(vs==='pick')pickFriend(g.dataset.g);else if(g.dataset.g==='omok'){startLocalN('omok');}else{N=null;startGame(g.dataset.g,vs,'local',0);}return;}
  if(t.closest('#gAll')){const on=t.closest('#gAll').checked;$$('#gPick [data-who]').forEach(c=>c.checked=on);return;}
  const si=t.closest('#gSendInv');if(si){const ids=$$('#gPick [data-who]').filter(c=>c.checked).map(c=>c.dataset.who);G=null;hostInvite(si.dataset.game,ids);return;}
  if(t.closest('#gStart')&&N&&N.isHost&&N.joined.length>=2){N.s=newState(N.game,N.joined.slice());N.celebrated=false;N.s.msg=N.game==='yut'||N.game==='memo'?`${nm2(N.s.pl[0])} 차례`:'';bcast();return;}
  if(t.closest('#nAgain')&&N&&N.isHost){N.s=newState(N.game,N.s.pl.slice());N.celebrated=false;N.s.v=0;N.s.msg=N.game==='yut'||N.game==='memo'?`${nm2(N.s.pl[0])} 차례`:'';bcast();return;}
  if(N&&N.s&&N.game==='omok'){const o=t.closest('[data-nomok]');if(o){const i=+o.dataset.nomok;const s=N.s;if(s.win||s.pl[s.turn]!==MYID||s.b[i]!=='.')return;if(N.ghost===i){N.ghost=null;act({i});}else{N.ghost=i;nRender();}return;}}
  if(N&&N.s&&N.game==='rumi'&&RS){const s=N.s;const hi=t.closest('[data-rh]');if(hi){const i=+hi.dataset.rh;RS.sel.has(i)?RS.sel.delete(i):RS.sel.add(i);nRender();return;}
    if(t.closest('#rSort')){RS.sort=RS.sort==='c'?'n':'c';nRender();return;}
    const left=rsHandLeft();const pickSel=()=>{const ts=[...RS.sel].map(i=>left[i]);return ts;};
    if(t.closest('#rMake')){const ts=pickSel();if(ts.length<3){toast('3장 이상 골라 주세요');return;}const ar=arrange(ts);if(!ar){toast('같은 색 연속 숫자, 또는 같은 숫자 다른 색만 묶을 수 있어요');return;}RS.sets.push(ar);RS.sel.clear();RS.addMode=false;nRender();return;}
    if(t.closest('#rAdd')){if(!RS.sel.size){toast('붙일 패를 먼저 골라요');return;}RS.addMode=!RS.addMode;nRender();return;}
    const rs=t.closest('[data-rset]');if(rs&&RS.addMode){const i=+rs.dataset.rset;const ts=pickSel();const cur=s.table[i].concat(RS.adds.filter(x=>x.i===i).flatMap(x=>x.t));if(!arrange(cur.concat(ts))){toast('이 묶음에는 붙일 수 없어요');return;}RS.adds.push({i,t:ts});RS.sel.clear();RS.addMode=false;nRender();return;}
    const sg=t.closest('[data-rstg]');if(sg){RS.sets.splice(+sg.dataset.rstg,1);nRender();return;}
    if(t.closest('#rUndo')){if(RS.adds.length)RS.adds.pop();else RS.sets.pop();RS.sel.clear();nRender();return;}
    if(t.closest('#rDraw')){act({k:'draw'});return;}
    if(t.closest('#rCommit')){act({k:'commit',sets:RS.sets,adds:RS.adds});return;}}
  if(N&&N.s){const a=t.closest('[data-nrps]');if(a){act({c:+a.dataset.nrps});return;}const c=t.closest('[data-ncham]');if(c){act({c:c.dataset.ncham});return;}
    if(t.closest('#nThrow')){act({k:'throw'});return;}const pc=t.closest('[data-npc]');if(pc){act({k:'pick',pc:+pc.dataset.npc});return;}const mm=t.closest('[data-nmemo]');if(mm){act({i:+mm.dataset.nmemo});return;}}
  const dm=t.closest('[data-dm]');if(dm){openWhisper(dm.dataset.dm);return;}
  const pl=t.closest('[data-play]');if(pl){pickFor=pl.dataset.play;openSheet('games');renderGames();$('#gPick').hidden=false;$('#gPick').innerHTML=`<div class="empty">🎮 <b>${E(NM(pickFor))}</b>님과 할 놀이의 <b>👥 다같이</b>를 눌러요</div>`;return;}
  if(!G)return;
  const r=t.closest('[data-rps]');if(r){rpsPick(+r.dataset.rps);return;}
  const ch=t.closest('[data-cham]');if(ch){chamPick(ch.dataset.cham);return;}
  const mm=t.closest('[data-memo]');if(mm){memoPick(+mm.dataset.memo);return;}
  if(t.closest('#yThrow')){myThrow();return;}
  const pc=t.closest('[data-pc]');if(pc&&G.phase==='pick'){G.phase='wait';const tt=G.pendingN;finishMine(tt,+pc.dataset.pc);return;}
  if(t.closest('#gAgain')){if(G.pvp)sendG(G.vs,{k:'again',gid:G.gid});({rps:rpsStart,yut:yutStart,cham:chamStart,memo:memoStart})[G.game]();return;}});
$('#gInvOk').addEventListener('click',()=>{$('#gInv').classList.remove('show');if(!invQ)return;G=null;N={gid:invQ.gid,game:invQ.game,host:invQ.from,isHost:false,s:null};sendG(invQ.from,{k:'join',gid:invQ.gid});openSheet('gPlay');$('#gPlayT').textContent=(GAMES.find(g=>g.id===invQ.game)||{}).name;lobby();invQ=null;});
$('#gInvNo').addEventListener('click',()=>{$('#gInv').classList.remove('show');if(invQ)sendG(invQ.from,{k:'no',gid:invQ.gid});invQ=null;});
$('#gQuit').addEventListener('click',endPlay);
$('#dmSend').addEventListener('click',sendDM);$('#dmIn').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();sendDM();}});
window.__gameState=()=>N;
window.__socialOpen=id=>{if(id==='games')renderGames();if(id==='friends')dmInbox();};
/* 받은 편지함 연결 (Firebase 연결 후) */
let hooked=false;setInterval(()=>{if(!hooked&&DM()&&DM().ready()){hooked=true;DM().listen(gotDM);}dmBadge();},1000);
})();
