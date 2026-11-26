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
 {id:'yut',ico:'🎋',name:'윷놀이',desc:'말 4개를 먼저 다 완주하면 승리! 윷·모·잡기는 한 번 더, 모서리에 딱 멈추면 지름길. 다같이 하면 개인전·팀전(청팀/홍팀)을 골라요.',ai:true,pvp:true},
 {id:'cham',ico:'👉',name:'참참참',desc:'해태 손가락과 다른 쪽으로 피해요. 다섯 판, 적게 맞으면 승리!',ai:true,pvp:true},
 {id:'omok',ico:'⚫',name:'오목',desc:'돌 다섯 개를 한 줄로 먼저 놓으면 승리! 3·3은 금지. 다같이 하면 여러 색 돌로 차례대로 둬요.',ai:true,pvp:true},
 {id:'rumi',ico:'🔢',name:'숫자패 놀이',desc:'루미큐브 방식! 같은 색 연속 숫자나 같은 숫자 다른 색으로 3장 이상 묶어 내려놓고, 손패를 먼저 다 털면 승리. (2~4명)',pvp:true},
 {id:'clock',ico:'⏱️',name:'초 맞추기',desc:'10초·20초·30초! 시계를 안 보고 감으로 멈춰요. 세 판 동안 오차가 가장 적은 사람이 승리.',ai:true,pvp:true},
 {id:'yeop',ico:'🪙',name:'엽전 거상',desc:'스플렌더 방식! 오방색 엽전을 모아 물건 카드를 사고, 세종대왕·이순신 같은 조선의 위인을 모셔 와요. 15점을 먼저! (2~4명)',ai:true,pvp:true},
 {id:'ladder',ico:'🪜',name:'사다리 타기',desc:'이름과 결과를 적고 사다리를 만들어요. 한 화면에서 친구들과 함께 이름을 하나씩 눌러 결과를 확인해요. (간식 당첨·순서 정하기)',solo:true},
 {id:'memo',ico:'🃏',name:'짝맞추기',desc:'같은 그림 두 장을 찾아요. 다같이 하면 차례대로, 짝을 많이 찾은 사람이 승리!',solo:true,pvp:true}];
let G=null; // 지금 하는 게임
function liveGames(){const out=[],seen=new Set();Object.values(typeof REMOTES==='object'?REMOTES:{}).forEach(r=>{const g=r.pr&&r.pr.gm;if(!g||typeof g!=='string')return;const [gid,game,n]=g.split('|');if(!gid||seen.has(gid))return;seen.add(gid);if(N&&N.gid===gid)return;out.push({gid,game,n:+n||2,host:r.by});});return out;}
function renderGames(){const fr=(typeof onlineFriends==='function')?onlineFriends():[];const live=liveGames();
  $('#gList').innerHTML=(live.length?`<div class="sec">👀 지금 친구들이 하는 놀이</div>`+live.map(l=>{const g=GAMES.find(x=>x.id===l.game)||{};return `<div class="frRow"><span><b>${g.ico||'🎮'} ${E(g.name||'놀이')}</b><small>${E(NM(l.host))}님 방 · ${l.n}명</small></span><button class="ghost" data-watch="${l.gid}" data-host="${l.host}" data-game="${l.game}">👀 구경하기</button></div>`;}).join('')+'<div class="sec">놀이 고르기</div>':'')+GAMES.map(g=>`<div class="gCard"><div class="gIco">${g.ico}</div><div class="gTx"><b>${g.name}</b><small>${g.desc}</small>
    <div class="gBtn">${g.solo?`<button class="primary" data-g="${g.id}" data-vs="solo">${g.id==='ladder'?'🪜 사다리 만들기':'혼자 하기'}</button>`:''}${g.ai?`<button class="primary" data-g="${g.id}" data-vs="ai">🦁 해태랑</button>`:''}${g.pvp?`<button class="ghost" data-g="${g.id}" data-vs="pick">👥 다같이</button>`:''}</div></div></div>`).join('')
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
    PB().innerHTML=`<div class="gMsg">${g.ico} ${g.name} 대기실</div>${N.game==='yut'?yLobby():rows}<button class="primary" id="gStart" ${N.joined.length<2?'disabled':''} style="margin-top:12px">${N.joined.length<2?'친구가 들어오길 기다려요…':`🎉 ${N.joined.length}명이서 시작하기`}</button>`;}
  else PB().innerHTML=`<div class="gMsg">${g.ico} ${g.name}</div><div class="empty" style="text-align:center">✅ 참가했어요!<br><b>${E(NM(N.host))}</b>님이 시작하면 바로 놀이가 열려요.</div>`;}
function announce(){const v=N&&N.isHost&&!N.local&&N.s&&!N.s.win?`${N.gid}|${N.game}|${N.s.pl.length}`:'';if(window.__myGame!==v){window.__myGame=v;try{pushPresence(true);}catch(e){}}}
function bcast(){if(!N||!N.isHost)return;N.s.v=(N.s.v||0)+1;N.s.pl.forEach(id=>{if(id===MYID||id==='AI')return;const msg={k:'st',gid:N.gid,game:N.game,s:N.s};if(N.priv)msg.hand=N.priv.hands[id]||[];sendG(id,msg);});(N.watchers||[]).forEach(id=>sendG(id,{k:'st',gid:N.gid,game:N.game,s:N.s,spec:1}));if(N.priv)N.hand=N.priv.hands[MYID]||[];nRender();announce();if(N.local)aiTurn();if(N.game==='rumi'&&!N.s.win){clearTimeout(rumiT);const s=N.s,v=s.v,cur=s.pl[s.turn];rumiT=setTimeout(()=>{if(N&&N.s===s&&s.v===v&&!s.win){s.msg=`${nm2(cur)} 시간 초과 · 자동으로 한 장`;hostAct(cur,{k:'draw'});}},150000);}}
let rumiT=null;
function act(a){if(!N||!N.s)return;if(N.isHost)hostAct(MYID,a);else sendG(N.host,{k:'act',gid:N.gid,a});}
function gotGame(v){let m;try{m=JSON.parse(v.g);}catch(e){return;}const from=v.by;
  if(m.k==='inv'){if(N&&N.s&&!N.s.win){sendG(from,{k:'no',gid:m.gid});return;}invQ={from,game:m.game,gid:m.gid};const g=GAMES.find(x=>x.id===m.game);$('#gInvTx').innerHTML=`${g?g.ico:'🎮'} <b>${E(NM(from))}</b>님이<br><b>${g?g.name:'놀이'}</b> 같이 하재요!${m.n>2?`<br><small>${m.n}명이 함께해요</small>`:''}`;$('#gInv').classList.add('show');try{chime();}catch(e){}return;}
  if(m.k==='pw'){if(window.__gardenWater)window.__gardenWater(from,m);return;}
  if(!N||N.gid!==m.gid)return;
  if(m.k==='gc'){const by=m.by||from;gcAdd(by,String(m.t||'').slice(0,120));if(N.isHost){const to=[...(N.s?N.s.pl:N.joined||[]),...(N.watchers||[])].filter(x=>x!==MYID&&x!=='AI'&&x!==from&&x!==by);[...new Set(to)].forEach(x=>sendG(x,{k:'gc',gid:N.gid,by,t:m.t}));}return;}
  if(N.isHost){if(m.k==='join'&&!N.joined.includes(from)){N.joined.push(from);toast(`${E(NM(from))}님이 들어왔어요`);if(!N.s)lobby();return;}
    if(m.k==='no'){N.no.push(from);if(!N.s)lobby();return;}
    if(m.k==='act'&&N.s&&N.s.pl.includes(from)){hostAct(from,m.a);return;}
    if(m.k==='watch'){N.watchers=N.watchers||[];if(!N.watchers.includes(from))N.watchers.push(from);if(N.s)sendG(from,{k:'st',gid:N.gid,game:N.game,s:N.s,spec:1});toast(`👀 ${E(NM(from))}님이 구경 와요`);if(N.s)nRender();return;}
    if(m.k==='left'&&N.watchers&&N.watchers.includes(from)&&!(N.s&&N.s.pl.includes(from))){N.watchers=N.watchers.filter(x=>x!==from);if(N.s)nRender();return;}
    if(m.k==='left'&&N.s){hostLeft(from);return;}}
  else{if(m.k==='err'){toast(String(m.t||'다시 확인해 주세요'));return;}if(m.k==='st'){if(!N.s||(m.s.v||0)>=(N.s.v||0)||m.s.v===1){N.s=m.s;if(m.hand)N.hand=m.hand;if(N.spec&&N.s.pl.includes(MYID))N.spec=false;nRender();}return;}if(m.k==='end'){toast('방장이 놀이를 끝냈어요');N=null;closeSheets();}}}
function startGame(game,vs,gid,me){G={game,vs,gid,me,pvp:false};openSheet('gPlay');$('#gPlayT').textContent=(GAMES.find(g=>g.id===game)||{}).name||'';
  ({rps:rpsStart,yut:yutStart,cham:chamStart,memo:memoStart})[game]();}
const nm=id=>id===MYID?'나':NM(id);
const COL=['#c4384a','#2a5a9a','#3f8a5a','#c88a2a','#8a5ab8','#3a8a9a'];
/* --- 방장: 판 만들기 --- */
function newState(game,pl){const s={pl,win:null,msg:''};
  if(game==='rps')Object.assign(s,{r:1,alive:pl.slice(),pick:{},last:null});
  if(game==='yut')yNew(s,pl);
  if(game==='cham')Object.assign(s,{r:1,max:5,pick:{},hits:Object.fromEntries(pl.map(id=>[id,0])),last:null});
  if(game==='clock')Object.assign(s,{tg:[10,20,30],rd:0,phase:'ready',go:0,sub:{},tot:Object.fromEntries(pl.map(id=>[id,0])),hist:[]});
  if(game==='omok')Object.assign(s,{n:15,b:'.'.repeat(225),turn:0,last:-1});
  if(game==='rumi'){const pool=[];['R','B','Y','K'].forEach(c=>{for(let k=1;k<=13;k++){pool.push(c+k,c+k);}});pool.push('J','J');pool.sort(()=>Math.random()-.5);
    const hands={};pl.forEach(id=>hands[id]=pool.splice(0,14));N.priv={hands,pool};Object.assign(s,{table:[],turn:0,cnt:Object.fromEntries(pl.map(id=>[id,14])),opened:{},pool:pool.length,passes:0});}
  if(game==='yeop')ypNew(s,pl);
  if(game==='memo'){const d=[...Array(8).keys(),...Array(8).keys()].sort(()=>Math.random()-.5);Object.assign(s,{deck:d.join(''),own:'.'.repeat(16),open:[],turn:0,sc:Object.fromEntries(pl.map(id=>[id,0]))});}
  return s;}
let hostT=null;
function hostAct(u,a){const s=N.s;if(!s||s.win)return;const g=N.game;
  if(g==='rps'){if(!s.alive.includes(u)||s.pick[u]!=null)return;s.pick[u]=a.c;rpsCheck();return;}
  if(g==='cham'){if(s.pick[u]!=null)return;s.pick[u]=a.c;chamCheck();return;}
  if(g==='yut'){yAct(u,a);return;}
  if(g==='clock'){if(a.k==='start'&&u===MYID&&s.phase!=='run'){clockGo(s);return;}if(a.k==='stop'&&s.phase==='run'&&a.go===s.go&&s.sub[u]==null){s.sub[u]=Math.max(0,+a.t||0);clockCheck(s);}return;}
  if(g==='omok'){if(s.pl[s.turn]!==u)return;const i=a.i;if(!(i>=0&&i<225)||s.b[i]!=='.')return;const me=String(s.turn);if(isDoubleThree(s.b,i,me)){if(u===MYID)toast('3·3은 둘 수 없어요 🙅');else if(u!=='AI')sendG(u,{k:'err',gid:N.gid,t:'3·3은 둘 수 없어요 🙅'});return;}s.b=s.b.slice(0,i)+me+s.b.slice(i+1);s.last=i;
    if(five(s.b,i,me)){s.win=[u];s.msg=`${nm2(u)} 오목 완성! 🎉`;}else if(!s.b.includes('.')){s.win=[];s.msg='무승부!';}else{s.turn=(s.turn+1)%s.pl.length;s.msg=`${nm2(s.pl[s.turn])} 차례`;}bcast();return;}
  if(g==='rumi'){if(s.pl[s.turn]!==u)return;const H=N.priv.hands[u];
    if(a.k==='draw'){if(N.priv.pool.length){H.push(N.priv.pool.pop());s.msg=`${nm2(u)} 한 장 가져갔어요`;s.passes=0;}else{s.passes++;s.msg=`${nm2(u)} 넘김 (더미가 없어요)`;}rumiNext(s);bcast();return;}
    if(a.k==='commit'){const r=rumiCheck(s,u,a);if(r.e){if(u===MYID)toast(r.e);else sendG(u,{k:'err',gid:N.gid,t:r.e});return;}
      const used=r.used;used.forEach(t=>{H.splice(H.indexOf(t),1);});
      s.table=a.table.map(st=>arrange(st.map(String)));s.opened[u]=1;s.passes=0;
      s.msg=`${nm2(u)} ${used.length}장 내려놓음`;if(!H.length){s.win=[u];s.msg=`${nm2(u)} 손패를 다 털었어요! 🎉`;}else rumiNext(s);bcast();return;}return;}
  if(g==='yeop'){ypAct(u,a);return;}
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
  for(let i=0;i<n*n;i++){if(b[i]!=='.')continue;const x=i%n,y=Math.floor(i/n);let near=false;for(let dy=-2;dy<=2&&!near;dy++)for(let dx=-2;dx<=2;dx++){const xx=x+dx,yy=y+dy;if(xx>=0&&yy>=0&&xx<n&&yy<n&&b[yy*n+xx]!=='.'){near=true;break;}}if(!near)continue;if(isDoubleThree(b,i,me))continue;
    const sc=lineScore(i,me)*1.1+Math.max(0,...opp.map(o=>lineScore(i,o)))+Math.random();if(sc>bs){bs=sc;best=i;}}return best;}
function clockGo(s){s.phase='run';s.go++;s.sub={};s.msg='';bcast();clearTimeout(hostT);const go=s.go,tg=s.tg[s.rd];hostT=setTimeout(()=>{if(!N||N.s!==s||s.go!==go||s.phase!=='run')return;s.pl.forEach(u=>{if(s.sub[u]==null)s.sub[u]=-1;});clockCheck(s);},(tg+15)*1000);
  if(s.pl.includes('AI'))setTimeout(()=>{if(N&&N.s===s&&s.go===go&&s.phase==='run'&&s.sub.AI==null){s.sub.AI=Math.max(0,Math.round(tg*1000+(Math.random()-.5)*2*(300+Math.random()*1400)));clockCheck(s);}},Math.max(500,tg*1000+(Math.random()-.3)*1500));}
function clockCheck(s){if(s.pl.some(u=>s.sub[u]==null)){bcast();return;}clearTimeout(hostT);const tg=s.tg[s.rd]*1000;const row={tg:s.tg[s.rd],r:{}};
  s.pl.forEach(u=>{const t=s.sub[u];const err=t<0?10000:Math.abs(t-tg);s.tot[u]+=err;row.r[u]=t;});s.hist.push(row);s.phase='res';s.rd++;
  if(s.rd>=s.tg.length){const mn=Math.min(...Object.values(s.tot));s.win=Object.keys(s.tot).filter(k=>s.tot[k]===mn);}bcast();}
function lineAt(b,i,dx,dy,me){const n=15,x=i%n,y=Math.floor(i/n);let s='';for(let k=-5;k<=5;k++){const xx=x+dx*k,yy=y+dy*k;if(xx<0||yy<0||xx>=n||yy>=n){s+='#';continue;}const v=k===0?me:b[yy*n+xx];s+=v===me?'X':v==='.'?'.':'#';}return s;}
function openThree(line){const pats=['..XXX.','.XXX..','.XX.X.','.X.XX.'];for(const p of pats){for(let st=0;st+p.length<=11;st++){if(st>5||st+p.length<=5)continue;if(line.slice(st,st+p.length)!==p)continue;if(p[5-st]==='X')return true;}}return false;}
function isDoubleThree(b,i,me){const nb=b.slice(0,i)+me+b.slice(i+1);if(five(nb,i,me))return false;let c=0;[[1,0],[0,1],[1,1],[1,-1]].forEach(([dx,dy])=>{if(openThree(lineAt(b,i,dx,dy,me)))c++;});return c>=2;}
let clk=null;
function aiTurn(){const s=N&&N.s;if(!s||s.win||s.pl[s.turn]!=='AI')return;setTimeout(()=>{if(!N||N.s!==s||s.win)return;if(N.game==='omok')hostAct('AI',{i:omokAI(s.b,String(s.turn))});if(N.game==='yeop')ypAI();if(N.game==='yut'){if(s.phase==='throw')hostAct('AI',{k:'throw'});else if(s.phase==='pick')hostAct('AI',{k:'pick',pc:yAIpick(s,'AI')});}},N.game==='yeop'?900:N.game==='yut'?900:700);}
function startLocalN(game){G=null;N={gid:'local'+Date.now(),game,host:MYID,isHost:true,local:true,joined:[MYID,'AI'],invited:[],no:[]};N.s=newState(game,[MYID,'AI']);N.celebrated=false;if(game!=='yeop'&&game!=='yut')N.s.msg=game==='omok'?'내 차례 · 칸을 두 번 누르면 돌을 놓아요':'';openSheet('gPlay');bcast();}
/* ====================== 엽전 거상 (스플렌더 방식) ====================== */
const YPC=['#1f5fa8','#c8322c','#e3b021','#f2eee2','#2a2a2f','#d4a62a'];
const YPN=['청','적','황','백','흑','금'];
const YPT=['#fff','#fff','#3a2a10','#3a2a20','#fff','#3a2a10'];
const YPART=[['🧺','🥢','🪭','🍶','🧵','🎐','🪡','🏺'],['📜','🖌️','🪕','🥁','🏮','🎎'],['👑','🐉','🏯','⚱️']];
const YPTN=['장터','공방','궁궐'];
const YPPAT=[
 [[[0,1,1,1,1],0],[[0,1,1,2,1],0],[[0,2,2,0,1],0],[[1,3,0,0,1],0],[[0,0,2,1,0],0],[[0,2,0,2,0],0],[[0,3,0,0,0],0],[[0,0,0,0,4],1]],
 [[[0,3,0,2,2],1],[[2,0,3,0,3],1],[[0,1,4,2,0],2],[[0,5,3,0,0],2],[[0,0,5,0,0],2],[[6,0,0,0,0],3]],
 [[[0,3,3,5,3],3],[[0,0,0,0,7],4],[[3,0,0,3,6],4],[[3,0,0,0,7],5]]];
const YCARDS=[];YPPAT.forEach((pats,t)=>{for(let c=0;c<5;c++)pats.forEach(([rel,p],k)=>{const cost=[0,0,0,0,0];rel.forEach((n,o)=>{cost[(c+o)%5]+=n;});YCARDS.push({t,c,p,k:cost,a:YPART[t][k]});});});
const YW=[
 {n:'세종대왕',i:'📖',d:'훈민정음을 만든 임금',r:[3,0,3,3,0]},
 {n:'이순신',i:'⚓',d:'거북선 · 한산도 대첩',r:[4,0,0,0,4]},
 {n:'이성계',i:'🏹',d:'조선을 세운 태조',r:[0,4,0,0,4]},
 {n:'김정호',i:'🗺️',d:'대동여지도를 그림',r:[3,0,3,0,3]},
 {n:'장영실',i:'🌧️',d:'측우기 · 자격루',r:[0,0,4,4,0]},
 {n:'정약용',i:'🏗️',d:'거중기 · 목민심서',r:[0,3,3,3,0]},
 {n:'신사임당',i:'🦋',d:'초충도를 그린 화가',r:[0,4,0,4,0]},
 {n:'허준',i:'🌿',d:'동의보감을 엮음',r:[3,3,0,0,3]},
 {n:'정조',i:'🏯',d:'수원 화성을 쌓음',r:[4,4,0,0,0]},
 {n:'김홍도',i:'🎨',d:'씨름 · 서당 풍속화',r:[0,3,0,3,3]},
 {n:'황희',i:'⚖️',d:'청렴한 명재상',r:[3,0,0,3,3]},
 {n:'이황',i:'📚',d:'퇴계 · 도산서원',r:[0,0,4,0,4]}];
const ypShuf=a=>{for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const ypBon=P=>{const b=[0,0,0,0,0];P.o.forEach(id=>b[YCARDS[id].c]++);return b;};
const ypPts=P=>P.o.reduce((a,id)=>a+YCARDS[id].p,0)+P.w.length*3;
const ypTot=P=>P.t.reduce((a,b)=>a+b,0);
function ypPay(P,card){const b=ypBon(P);const pay=[0,0,0,0,0,0];let gold=0;for(let c=0;c<5;c++){const need=Math.max(0,card.k[c]-b[c]);const use=Math.min(need,P.t[c]);pay[c]=use;gold+=need-use;}if(gold>P.t[5])return null;pay[5]=gold;return pay;}
function ypNew(s,pl){const n=pl.length;const per=n<=2?4:n===3?5:7;const dk=[0,1,2].map(t=>ypShuf(YCARDS.map((c,i)=>i).filter(i=>YCARDS[i].t===t)));N.yd=dk;
  Object.assign(s,{bank:[per,per,per,per,per,5],bd:dk.map(d=>d.splice(0,4)),dk:dk.map(d=>d.length),wi:ypShuf([...YW.keys()]).slice(0,n+1),Y:pl.map(()=>({t:[0,0,0,0,0,0],o:[],r:[],w:[]})),turn:0,phase:'act',fin:false,msg:`${nm2(pl[0])} 차례 · 엽전을 고르거나 물건 카드를 눌러요`});}
function ypRefill(s,t,i){const d=N.yd[t];s.bd[t][i]=d.length?d.pop():-1;s.dk[t]=d.length;}
function ypErr(u,t){if(u===MYID)toast(t);else if(u!=='AI')sendG(u,{k:'err',gid:N.gid,t});}
function ypAct(u,a){const s=N.s;const pi=s.pl.indexOf(u);if(pi<0||pi!==s.turn)return;const P=s.Y[pi];const who=nm2(u);
  if(s.phase==='ret'){if(a.k!=='ret')return;const c=+a.c;if(!(c>=0&&c<6)||!(P.t[c]>0))return;P.t[c]--;s.bank[c]++;if(ypTot(P)<=10)ypEnd(s,pi);else{s.msg=`${who} · 엽전이 10개를 넘어요! ${ypTot(P)-10}개 더 돌려줘요`;bcast();}return;}
  if(a.k==='pass'){s.msg=`${who} 쉬어 가요`;ypEnd(s,pi);return;}
  if(a.k==='take'){const cs=(a.c||[]).map(Number);if(!cs.length||cs.some(c=>!(c>=0&&c<5)))return;
    if(cs.length===2&&cs[0]===cs[1]){if(s.bank[cs[0]]<4){ypErr(u,'같은 색 두 개는 4개 이상 남아 있을 때만 가져올 수 있어요');return;}}
    else{const avail=[0,1,2,3,4].filter(c=>s.bank[c]>0).length;if(new Set(cs).size!==cs.length||cs.length>3||cs.some(c=>s.bank[c]<1)){ypErr(u,'서로 다른 색으로 3개까지 골라요');return;}if(cs.length<Math.min(3,avail)){ypErr(u,`서로 다른 색 ${Math.min(3,avail)}개를 골라요 (같은 색 2개도 돼요)`);return;}}
    cs.forEach(c=>{s.bank[c]--;P.t[c]++;});s.msg=`${who} · ${cs.map(c=>YPN[c]).join('·')} 엽전을 가져갔어요`;
    if(ypTot(P)>10){s.phase='ret';s.msg+=` · 10개가 넘어서 ${ypTot(P)-10}개를 돌려줘요`;bcast();return;}ypEnd(s,pi);return;}
  if(a.k==='res'){if(P.r.length>=3){ypErr(u,'찜은 3장까지만 할 수 있어요');return;}const t=+a.t,i=+a.i;if(!(t>=0&&t<3))return;let id;
    if(i===-1){if(!N.yd[t].length)return;id=N.yd[t].pop();s.dk[t]=N.yd[t].length;}else{id=s.bd[t]&&s.bd[t][i];if(!(id>=0))return;ypRefill(s,t,i);}
    P.r.push(id);let g='';if(s.bank[5]>0){s.bank[5]--;P.t[5]++;g=' · 금엽전 1개';}s.msg=`${who} · ${YPTN[t]} 카드를 찜했어요${g}`;
    if(ypTot(P)>10){s.phase='ret';s.msg+=` · ${ypTot(P)-10}개를 돌려줘요`;bcast();return;}ypEnd(s,pi);return;}
  if(a.k==='buy'){let id;if(a.src==='r'){id=P.r[+a.i];}else{id=s.bd[+a.t]&&s.bd[+a.t][+a.i];}if(!(id>=0))return;const card=YCARDS[id];const pay=ypPay(P,card);if(!pay){ypErr(u,'엽전이 모자라요');return;}
    pay.forEach((n,c)=>{P.t[c]-=n;s.bank[c]+=n;});if(a.src==='r')P.r.splice(+a.i,1);else ypRefill(s,+a.t,+a.i);P.o.push(id);
    s.msg=`${who} · ${card.a} ${YPN[card.c]}색 ${YPTN[card.t]} 물건을 샀어요${card.p?` (+${card.p}점)`:''}`;ypEnd(s,pi);return;}}
function ypEnd(s,pi){s.phase='act';const P=s.Y[pi];const b=ypBon(P);const k=s.wi.findIndex(w=>YW[w].r.every((n,c)=>b[c]>=n));
  if(k>=0){const w=s.wi.splice(k,1)[0];P.w.push(w);s.msg+=` · ✨ ${YW[w].n} 님을 모셔 왔어요!`;}
  if(ypPts(P)>=15&&!s.fin){s.fin=true;s.msg+=' · 15점! 이번 바퀴까지만 해요';}
  s.turn=(s.turn+1)%s.pl.length;
  if(s.fin&&s.turn===0){const sc=s.Y.map(ypPts);const mx=Math.max(...sc);const cand=s.pl.filter((id,i)=>sc[i]===mx);const fewest=Math.min(...cand.map(id=>s.Y[s.pl.indexOf(id)].o.length));s.win=cand.filter(id=>s.Y[s.pl.indexOf(id)].o.length===fewest);s.msg=`끝! ${s.win.map(nm2).join(', ')} ${mx}점`;}
  bcast();}
function ypAI(){const s=N.s;const u=s.pl[s.turn];const P=s.Y[s.turn];
  if(s.phase==='ret'){let c=0;for(let k=0;k<5;k++)if(P.t[k]>P.t[c])c=k;if(!P.t[c])c=5;hostAct(u,{k:'ret',c});return;}
  const b=ypBon(P);const val=id=>{const c=YCARDS[id];let v=c.p*3+1.2-c.t*.2;s.wi.forEach(w=>{if(YW[w].r[c.c]>b[c.c])v+=.7;});return v;};
  const cands=[];s.bd.forEach((row,t)=>row.forEach((id,i)=>{if(id>=0)cands.push({src:'b',t,i,id});}));P.r.forEach((id,i)=>cands.push({src:'r',i,id}));
  const buy=cands.filter(x=>ypPay(P,YCARDS[x.id]));if(buy.length){buy.sort((x,y)=>val(y.id)-val(x.id));const x=buy[0];hostAct(u,{k:'buy',src:x.src,t:x.t,i:x.i});return;}
  const miss=id=>{const c=YCARDS[id];let m=0;for(let k=0;k<5;k++)m+=Math.max(0,c.k[k]-b[k]-P.t[k]);return Math.max(0,m-P.t[5]);};
  cands.sort((x,y)=>(miss(x.id)+1)/val(x.id)-(miss(y.id)+1)/val(y.id));const tg=cands[0];
  const short=[0,1,2,3,4].map(k=>tg?Math.max(0,YCARDS[tg.id].k[k]-b[k]-P.t[k]):0);
  const avail=[0,1,2,3,4].filter(k=>s.bank[k]>0);
  if(avail.length&&ypTot(P)<=8){const need=avail.filter(k=>short[k]>0).sort((x,y)=>short[y]-short[x]);
    if(need.length===1&&short[need[0]]>=2&&s.bank[need[0]]>=4){hostAct(u,{k:'take',c:[need[0],need[0]]});return;}
    const pick=need.slice(0,3);ypShuf(avail.filter(k=>!pick.includes(k))).forEach(k=>{if(pick.length<Math.min(3,avail.length))pick.push(k);});hostAct(u,{k:'take',c:pick});return;}
  if(P.r.length<3&&tg&&tg.src==='b'){hostAct(u,{k:'res',t:tg.t,i:tg.i});return;}
  if(avail.length){const pick=ypShuf(avail.slice()).slice(0,Math.min(3,avail.length));hostAct(u,{k:'take',c:pick});return;}
  hostAct(u,{k:'pass'});}
let YS={sel:[],card:null,v:-1,rules:false};
const ypCoin=(c,n,attr='',cls='')=>`<span class="ypCoinW ${cls}" ${attr}><i class="yeop" style="--c:${YPC[c]}"></i>${n!=null?`<b>${n}</b>`:''}</span>`;
function ypCardH(id,attr,cls=''){if(!(id>=0))return `<div class="ypCard empty"></div>`;const c=YCARDS[id];
  return `<div class="ypCard t${c.t} ${cls}" ${attr} style="--c:${YPC[c.c]};--tx:${YPT[c.c]}"><div class="ypTop"><b>${c.p||''}</b><i class="yeop sm" style="--c:${YPC[c.c]}"></i></div><div class="ypArt">${c.a}</div><div class="ypCost">${c.k.map((n,k)=>n?`<span style="--c:${YPC[k]};--tx:${YPT[k]}">${n}</span>`:'').join('')}</div></div>`;}
function ypWiH(w){const W=YW[w];return `<div class="ypWi"><div class="ypWiHd">${W.r.map((n,k)=>n?`<span style="--c:${YPC[k]};--tx:${YPT[k]}">${n}</span>`:'').join('')}<b>3</b></div><div class="ypWiI">${W.i}</div><div class="ypWiN">${W.n}</div><small>${W.d}</small></div>`;}
function ypView(s){const pi=s.pl.indexOf(MYID);const me=pi>=0&&!N.spec?s.Y[pi]:null;const my=me&&s.turn===pi&&!s.win;
  if(YS.v!==s.v){YS.v=s.v;if(!my){YS.sel=[];YS.card=null;}}
  const players=`<div class="ypPls">${s.pl.map((id,i)=>{const P=s.Y[i];const b=ypBon(P);return `<div class="ypPl ${i===s.turn&&!s.win?'cur':''}" style="--pc:${COL[i%COL.length]}"><div class="ypPlH"><b>${E(nm2(id))}</b><span>⭐ ${ypPts(P)}</span></div><div class="ypPlB">${b.map((n,k)=>`<i style="--c:${YPC[k]};--tx:${YPT[k]}">${n}</i>`).join('')}</div><small>🪙 ${ypTot(P)}${P.t[5]?` (금 ${P.t[5]})`:''} · 찜 ${P.r.length}${P.w.length?` · 위인 ${P.w.map(w=>YW[w].i).join('')}`:''}</small></div>`;}).join('')}</div>`;
  const wi=`<div class="ypSec">🏛️ 조선의 위인 <small>(카드 색깔 모으면 저절로 모셔 와요 · 3점)</small></div><div class="ypWis">${s.wi.map(ypWiH).join('')||'<div class="empty">모든 위인을 모셔 갔어요</div>'}</div>`;
  const rows=[2,1,0].map(t=>`<div class="ypRow"><div class="ypDeck t${t} ${my&&YS.card&&YS.card.t===t&&YS.card.i===-1?'sel':''}" ${my&&s.dk[t]?`data-ypc="d,${t},-1"`:''}><b>${YPTN[t]}</b><small>${s.dk[t]}장</small></div>${s.bd[t].map((id,i)=>ypCardH(id,id>=0&&my?`data-ypc="b,${t},${i}"`:'',YS.card&&YS.card.src==='b'&&YS.card.t===t&&YS.card.i===i?'sel':'')).join('')}</div>`).join('');
  const bank=`<div class="ypSec">🪙 엽전 꾸러미 ${my&&s.phase==='act'?'<small>(다른 색 3개 · 또는 같은 색 2개)</small>':''}</div><div class="ypBank">${s.bank.map((n,c)=>ypCoin(c,n,my&&c<5&&s.phase==='act'?`data-ypk="${c}"`:'',YS.sel.filter(x=>x===c).length?'sel n'+YS.sel.filter(x=>x===c).length:'')).join('')}</div>`;
  let bar='';
  if(my&&s.phase==='ret')bar=`<div class="gMsg">엽전은 10개까지! 내 엽전을 눌러 ${ypTot(me)-10}개 돌려줘요</div>`;
  else if(my&&YS.card){const card=YS.card.src==='d'?null:YCARDS[YS.card.src==='r'?me.r[YS.card.i]:s.bd[YS.card.t][YS.card.i]];const pay=card?ypPay(me,card):null;
    bar=`<div class="ypBar">${card?`<button class="primary" id="ypBuy" ${pay?'':'disabled'}>🛒 사기${pay?` <small>${pay.map((n,c)=>n?`${YPN[c]}${n}`:'').filter(Boolean).join(' ')||'공짜!'}</small>`:' <small>엽전 부족</small>'}</button>`:''}${YS.card.src!=='r'?`<button class="ghost" id="ypRes" ${me.r.length<3?'':'disabled'}>📌 찜하기${s.bank[5]?' +금':''}</button>`:''}<button class="ghost" id="ypCancel">취소</button></div>`;}
  else if(my&&YS.sel.length)bar=`<div class="ypBar"><button class="primary" id="ypTake">🪙 ${YS.sel.map(c=>YPN[c]).join('·')} 가져가기</button><button class="ghost" id="ypCancel">다시 고르기</button></div>`;
  const mine=me?`<div class="ypSec">🎒 내 보따리</div><div class="ypMine">${me.t.map((n,c)=>n?ypCoin(c,n,my&&s.phase==='ret'?`data-ypr="${c}"`:'',my&&s.phase==='ret'?'ret':''):'').join('')||'<small>아직 엽전이 없어요</small>'}</div>${me.r.length?`<div class="ypSec sm">📌 찜한 카드 <small>(눌러서 사기)</small></div><div class="ypRow res">${me.r.map((id,i)=>ypCardH(id,my?`data-ypc="r,0,${i}"`:'',YS.card&&YS.card.src==='r'&&YS.card.i===i?'sel':'')).join('')}</div>`:''}`:'';
  const rules=YS.rules?`<div class="ypRules"><b>📜 엽전 거상 규칙</b><br>내 차례에 하나만 해요.<br>① 서로 다른 색 엽전 3개 가져오기<br>② 같은 색 엽전 2개 가져오기 (4개 이상 남았을 때)<br>③ 카드 찜하기 · 금엽전(아무 색) 1개 받기, 찜은 3장까지<br>④ 엽전을 내고 물건 카드 사기 · 산 카드는 그 색 엽전 1개 할인!<br>위인 카드가 원하는 색 카드를 모으면 위인을 저절로 모셔 와요(+3점). 15점을 먼저 넘기면 그 바퀴까지 하고 점수가 높은 사람이 이겨요. 엽전은 10개까지만 가질 수 있어요.</div>`:'';
  return players+`<div class="gMsg sm">${E(s.msg||'')}</div>`+(s.win?winLine(s):'')+wi+`<div class="ypBoard">${rows}</div>`+bank+bar+mine+rules+`<div class="ypFoot"><button class="ghost sm" id="ypRule">📜 규칙 ${YS.rules?'접기':'보기'}</button>${my&&s.phase==='act'?'<button class="ghost sm" id="ypPass">쉬어 가기</button>':''}</div>`;}
function ypClick(t){const s=N.s;if(!s)return false;
  if(t.closest('#ypRule')){YS.rules=!YS.rules;nRender();return true;}
  const pi=s.pl.indexOf(MYID);if(pi<0||N.spec||s.turn!==pi||s.win)return false;
  const r=t.closest('[data-ypr]');if(r){act({k:'ret',c:+r.dataset.ypr});return true;}
  const k=t.closest('[data-ypk]');if(k){const c=+k.dataset.ypk;YS.card=null;const sel=YS.sel;const cnt=sel.filter(x=>x===c).length;
    if(cnt===2){YS.sel=sel.filter(x=>x!==c);}
    else if(cnt===1){if(sel.length===1&&s.bank[c]>=4)sel.push(c);else YS.sel=sel.filter(x=>x!==c);}
    else{if(sel.length===2&&sel[0]===sel[1])YS.sel=[c];else if(sel.length>=3)toast('3개까지 고를 수 있어요');else sel.push(c);}
    nRender();return true;}
  const cd=t.closest('[data-ypc]');if(cd){const [src,tt,ii]=cd.dataset.ypc.split(',');YS.sel=[];const c={src,t:+tt,i:+ii};YS.card=YS.card&&YS.card.src===c.src&&YS.card.t===c.t&&YS.card.i===c.i?null:c;nRender();return true;}
  if(t.closest('#ypCancel')){YS.sel=[];YS.card=null;nRender();return true;}
  if(t.closest('#ypTake')){const c=YS.sel.slice();YS.sel=[];act({k:'take',c});return true;}
  if(t.closest('#ypBuy')&&YS.card){const c=YS.card;YS.card=null;act({k:'buy',src:c.src,t:c.t,i:c.i});return true;}
  if(t.closest('#ypRes')&&YS.card){const c=YS.card;YS.card=null;act({k:'res',t:c.t,i:c.src==='d'?-1:c.i});return true;}
  if(t.closest('#ypPass')){act({k:'pass'});return true;}
  return false;}
/* 숫자패 (루미큐브 방식) */
const TC={R:'#c4384a',B:'#2a5aa8',Y:'#c8861a',K:'#2a2a30'};
const tNum=t=>t==='J'?0:+t.slice(1),tCol=t=>t==='J'?'J':t[0];
function arrangeRun(ts){const js=ts.filter(t=>t==='J'),o=ts.filter(t=>t!=='J');if(!o.length)return ts.length>=3?ts:null;const c=tCol(o[0]);if(o.some(t=>tCol(t)!==c))return null;const ns=o.map(tNum).sort((a,b)=>a-b);
  for(let k=1;k<ns.length;k++)if(ns[k]===ns[k-1])return null;let lo=ns[0],hi=ns[ns.length-1];let j=js.length-((hi-lo+1)-ns.length);if(j<0)return null;while(j>0&&hi<13){hi++;j--;}while(j>0&&lo>1){lo--;j--;}if(j>0||hi-lo+1<3)return null;
  const out=[];for(let v=lo;v<=hi;v++)out.push(ns.includes(v)?c+v:'J');return out;}
function arrangeGrp(ts){const o=ts.filter(t=>t!=='J');if(ts.length<3||ts.length>4||!o.length)return null;const n=tNum(o[0]);if(o.some(t=>tNum(t)!==n))return null;const cs=o.map(tCol);if(new Set(cs).size!==cs.length)return null;return [...o,...ts.filter(t=>t==='J')];}
function arrange(ts){return arrangeRun(ts)||arrangeGrp(ts);}
function setPts(ts){const r=arrangeRun(ts);if(r){let lo=null;const firstReal=r.findIndex(t=>t!=='J');const base=tNum(r[firstReal])-firstReal;return r.reduce((a,_,k)=>a+base+k,0);}const g=arrangeGrp(ts);if(g){const n=tNum(g.find(t=>t!=='J'));return n*g.length;}return 0;}
function rumiCheck(s,u,a){const H=N.priv.hands[u].slice();const nt=a.table;if(!Array.isArray(nt)||nt.some(x=>!Array.isArray(x)))return {e:'다시 해 주세요'};
  const rem=nt.flat().map(String);for(const t of s.table.flat()){const k=rem.indexOf(t);if(k<0)return {e:'바닥에 있던 패는 모두 바닥에 남아 있어야 해요'};rem.splice(k,1);}
  if(!rem.length)return {e:'손패에서 한 장 이상 내려놓아야 해요'};
  for(const t of rem){const k=H.indexOf(t);if(k<0)return {e:'손패에 없는 패가 있어요'};H.splice(k,1);}
  for(const st of nt)if(!arrange(st))return {e:'규칙에 맞지 않는 묶음이 있어요'};
  if(!s.opened[u]){const key=x=>x.slice().sort().join(',');for(let i=0;i<s.table.length;i++){if(!nt[i]||key(nt[i])!==key(s.table[i]))return {e:'처음 내려놓을 땐 바닥 패를 건드릴 수 없어요'};}
    const pts=nt.slice(s.table.length).reduce((a,st)=>a+setPts(st),0);if(pts<30)return {e:`처음 내려놓기는 내 패로만 30점 이상! (지금 ${pts}점)`};}
  return {used:rem};}
function rumiNext(s){s.turn=(s.turn+1)%s.pl.length;s.cnt=Object.fromEntries(s.pl.map(id=>[id,N.priv.hands[id].length]));s.pool=N.priv.pool.length;
  if(s.passes>=s.pl.length&&!N.priv.pool.length){let mn=1e9;const sum=id=>N.priv.hands[id].reduce((a,t)=>a+(t==='J'?30:tNum(t)),0);s.pl.forEach(id=>mn=Math.min(mn,sum(id)));s.win=s.pl.filter(id=>sum(id)===mn);s.msg='더미가 다 떨어졌어요 · 남은 점수가 가장 적은 사람 승리';return;}
  if(!s.win)s.msg+=` → ${nm2(s.pl[s.turn])} 차례`;RS=null;}
let RS=null; // 내 차례 준비 상태 (바닥 패 옮기기 포함)
function rsOrder(h,ord){if(!ord||!ord.length)return h.slice();const rest=h.slice(),out=[];ord.forEach(t=>{const k=rest.indexOf(t);if(k>=0){out.push(t);rest.splice(k,1);}});return out.concat(rest);}
function rsInit(){const s=N.s;const key=s.v+'|'+s.turn;if(!RS||RS.key!==key){const ord=RS?RS.ord:null,srt=RS?RS.sort:'c';RS={key,sel:new Set(),tbl:s.table.map(st=>st.map(t=>({t,o:'t'}))),loose:[],hl:rsOrder(N.hand||[],ord),addMode:false,moved:false,sort:srt,ord};}return RS;}
function rsHandLeft(){return RS.hl;}
const rsOk=st=>st.length>=3&&!!arrange(st.map(x=>x.t));
function rsSort(st){const ar=arrange(st.map(x=>x.t));if(!ar)return st;const pool=st.slice();const out=ar.map(t=>{const k=pool.findIndex(x=>x.t===t);return pool.splice(k,1)[0];});return out.concat(pool);}
function rsTake(){const out=[],ks=[...RS.sel];
  ks.filter(k=>k[0]==='h').map(k=>+k.slice(2)).sort((a,b)=>b-a).forEach(i=>{out.push({t:RS.hl[i],o:'h'});RS.hl.splice(i,1);});
  ks.filter(k=>k[0]==='l').map(k=>+k.slice(2)).sort((a,b)=>b-a).forEach(i=>{out.push(RS.loose[i]);RS.loose.splice(i,1);});
  ks.filter(k=>k[0]==='t').map(k=>k.slice(2).split('_').map(Number)).sort((a,b)=>b[0]-a[0]||b[1]-a[1]).forEach(([si,ti])=>{out.push(RS.tbl[si][ti]);RS.tbl[si].splice(ti,1);});
  RS.sel.clear();RS.moved=true;return out.filter(Boolean);}
function rsTidy(){RS.tbl=RS.tbl.filter(x=>x.length).map(rsSort);}
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
const YA={'-1':'🔙',1:'🐷',2:'🐶',3:'🐑',4:'🐮',5:'🐴'};
const YTN=['청팀','홍팀'],YTC=['#2a62a8','#c8392f'];
function yNew(s,pl){const o=N.opt||{};const team=!!o.team&&pl.length>=3;let sides;
  if(team){const tm=o.tm||{};let a=pl.filter((id,i)=>(tm[id]!=null?tm[id]:i%2)===0),b=pl.filter((id,i)=>(tm[id]!=null?tm[id]:i%2)===1);if(!a.length||!b.length){a=pl.filter((x,i)=>i%2===0);b=pl.filter((x,i)=>i%2===1);}sides=[a,b];}
  else sides=pl.map(id=>[id]);
  Object.assign(s,{team,sides,P:sides.map(()=>[0,0,0,0]),Q:sides.map(()=>[0,0,0,0]),side:0,ptr:sides.map(()=>0),turn:pl.indexOf(sides[0][0]),phase:'throw',n:null,f:[0,0,0,0],roll:0,fx:'',fxk:0,mv:-1,mvk:0,msg:`${nm2(sides[0][0])} 차례 · 윷을 던져요!`});}
const ySide=(s,u)=>s.sides.findIndex(t=>t.includes(u));
const yName=(s,sd)=>s.team?YTN[sd]:nm2(s.sides[sd][0]);
const yCol=(s,sd)=>s.team?YTC[sd]:COL[sd%COL.length];
function yCurFix(s){const t=s.sides[s.side];if(!t||!t.length)return;s.ptr[s.side]%=t.length;s.turn=s.pl.indexOf(t[s.ptr[s.side]]);}
function yNext(s){const t=s.sides[s.side];if(t&&t.length)s.ptr[s.side]=(s.ptr[s.side]+1)%t.length;const n=s.sides.length;for(let k=1;k<=n;k++){const sd=(s.side+k)%n;if(s.sides[sd].length&&s.P[sd].some(p=>p<YEND)){s.side=sd;break;}}yCurFix(s);}
function yMovable(s,sd,n){const P=s.P[sd];const r=[],seen=new Set();P.forEach((p,i)=>{if(p>=YEND)return;if(n===-1&&p===0)return;if(seen.has(p))return;seen.add(p);r.push(i);});return r;}
function yAct(u,a){const s=N.s;if(s.pl[s.turn]!==u)return;const sd=ySide(s,u);if(sd<0)return;
  if(a.k==='throw'&&s.phase==='throw'){const t=throwYut();s.n=t.n;s.f=t.f;s.roll=(s.roll||0)+1;s.phase='toss';s.fx='';s.msg=`${nm2(u)} 윷을 던졌어요!`;bcast();const r=s.roll;
    clearTimeout(hostT);hostT=setTimeout(()=>{if(!N||N.s!==s||s.roll!==r||s.win||s.phase!=='toss')return;const mv=yMovable(s,sd,s.n);if(mv.length<=1)yApply(s,u,mv.length?mv[0]:-1);else{s.phase='pick';s.msg=`${nm2(u)} · ${YN[s.n]}! 움직일 말을 골라요`;}bcast();},1250);return;}
  if(a.k==='pick'&&s.phase==='pick'){const i=+a.pc;if(!yMovable(s,sd,s.n).some(k=>s.P[sd][k]===s.P[sd][i]))return;yApply(s,u,i);bcast();}}
function yApply(s,u,pc){const sd=ySide(s,u),n=s.n;let extra=n===4||n===5;let msg=`${nm2(u)} · ${YN[n]}!`;s.fx=n===5?'mo':n===4?'yut':n===-1?'back':'';
  if(pc>=0){const P=s.P[sd],Q=s.Q[sd],from=P[pc];const m=yMv(from,n,Q[pc]);const grp=[];P.forEach((p,i)=>{if(i===pc||(from>0&&p===from))grp.push(i);});grp.forEach(i=>{P[i]=m.to;Q[i]=m.prev;});s.mv=m.to;s.mvk=(s.mvk||0)+1;
    if(m.to>0&&m.to<YEND){const caught=new Set();let cn=0;s.P.forEach((OP,os)=>{if(os===sd)return;OP.forEach((p,i)=>{if(p===m.to){OP[i]=0;s.Q[os][i]=0;caught.add(os);cn++;}});});
      if(caught.size){extra=true;s.fx='catch';msg+=` ${[...caught].map(os=>yName(s,os)).join(', ')} 말 ${cn}개를 잡았다! 🎉`;}
      else{const st=P.filter(p=>p===m.to).length;if(st>1)msg+=` 업었다! 🐎×${st}`;}
      if(m.to===22)msg+=' · 방에 쏙! 🎯';else if((m.to===5||m.to===10)&&n!==-1)msg+=' · 모서리에 딱! 다음엔 지름길';else if(m.to===YJ)msg+=' · 참먹이! 한 번만 더 가면 골인';}
    if(m.to>=YEND){msg+=` ${grp.length>1?grp.length+'개 ':''}골인! 🏁`;if(s.fx!=='catch')s.fx=extra?s.fx:'goal';}}
  else msg+=n===-1?' 판 위에 말이 없어서 그냥 넘어가요':' 움직일 말이 없어요';
  s.fxk=(s.fxk||0)+1;
  if(s.P[sd].every(p=>p>=YEND)){s.win=s.sides[sd].slice();s.phase='end';s.msg=msg+` · ${s.team?YTN[sd]+' ':''}말 4개 모두 완주!`;return;}
  if(extra)msg+=' 한 번 더!';else yNext(s);
  s.phase='throw';s.msg=msg+(extra?'':` → ${nm2(s.pl[s.turn])} 차례`);}
function yAIpick(s,u){const sd=ySide(s,u),P=s.P[sd],Q=s.Q[sd];let best=-1,bs=-1e9;
  yMovable(s,sd,s.n).forEach(i=>{const from=P[i];const to=yMv(from,s.n,Q[i]).to;let v=yLeft(from)-yLeft(to);
    if(to>0&&to<YEND&&s.P.some((OP,os)=>os!==sd&&OP.includes(to)))v+=40;if(to>=YEND)v+=25;if(to===22||to===5||to===10)v+=6;if(to>0&&to<YEND&&P.some((q,k)=>k!==i&&q===to))v+=3;
    if(to>0&&to<YEND&&s.P.some((OP,os)=>os!==sd&&OP.some((q,k)=>q>0&&q<YEND&&[1,2,3,4,5].some(t=>yMv(q,t,s.Q[os][k]).to===to))))v-=8;
    if(v>bs){bs=v;best=i;}});return best;}
function yLeftOut(u){const s=N.s;s.sides.forEach(t=>{const k=t.indexOf(u);if(k>=0)t.splice(k,1);});const alive=s.sides.map((t,i)=>t.length?i:-1).filter(i=>i>=0);
  if(alive.length<2&&!s.win){s.win=alive.length?s.sides[alive[0]].slice():[];s.msg='상대가 모두 나가서 놀이가 끝났어요';return;}
  if(!s.sides[s.side].length){yNext(s);if(s.phase!=='throw'&&s.phase!=='end'){s.phase='throw';}}else yCurFix(s);}
function yTeamOf(id){const tm=(N.opt&&N.opt.tm)||{};if(tm[id]!=null)return tm[id];const i=N.joined.indexOf(id);return i<0?-1:i%2;}
function yLobby(){const o=N.opt||{};const can=N.joined.length>=3;const team=!!o.team&&can;const ids=[MYID,...N.invited];
  let h=`<div class="yMode"><button class="${team?'':'on'}" data-ymode="solo">🙋 개인전</button><button class="${team?'on':''}" data-ymode="team" ${can?'':'disabled'}>🤝 팀전${can?'':' · 3명부터'}</button></div>`;
  if(team)h+=`<div class="yTeams">${[0,1].map(k=>`<div class="yTeamCol" style="--c:${YTC[k]}"><b>${YTN[k]}</b>${N.joined.filter(id=>yTeamOf(id)===k).map(id=>`<button class="yTm" data-ytm="${id}">${E(id===MYID?(ST.nick||'나'):NM(id))} ⇄</button>`).join('')||'<small>비었어요</small>'}</div>`).join('')}</div><div class="gMsg sm">이름을 누르면 팀을 바꿔요 · 팀끼리 말 4개를 함께 써요</div>`;
  return h+ids.map(id=>`<div class="frRow"><span><b>${E(id===MYID?(ST.nick||'나')+' (방장)':NM(id))}</b></span><small>${id===MYID||N.joined.includes(id)?'✅ 참가':N.no.includes(id)?'🙅 다음에':'⏳ 기다리는 중'}</small></div>`).join('');}
function yStickH(s,toss){const k=s.roll||0;const sticks=(s.f||[0,0,0,0]).map((v,i)=>{const r=((k*37+i*71)%9-4)*7;const x=((k*13+i*29)%7-3)*5;return `<i class="${v?'f':'b'} ${i===0?'mk':''}" style="--d:${(i*.07).toFixed(2)}s;--r:${r+(i%2?1080:-1080)}deg;--rf:${r}deg;--x:${x}px;--h:${150+((k+i*3)%4)*25}px"></i>`;}).join('');
  const showRes=s.n!=null&&s.phase!=='toss';const pop=showRes&&N.yRes!==s.roll;
  return `<div class="yThrowRow"><div class="ySticks ${toss?'toss':''} ${s.n==null?'idle':''}">${sticks}</div><div class="yRes ${s.n===-1?'bk':''} ${s.n>=4?'big':''} ${pop?'pop':''} ${showRes?'':'dim'}">${showRes?`<span class="yAni">${YA[s.n]}</span>${YN[s.n]}!`:'　'}</div></div>`;}
function yView(s){const msd=ySide(s,MYID);const my=s.pl[s.turn]===MYID&&!N.spec&&!s.win;const pick=my&&s.phase==='pick';const mv=pick?yMovable(s,msd,s.n):[];
  if(!pick||N.ysel==null||!mv.some(k=>s.P[msd][k]===s.P[msd][N.ysel]))N.ysel=pick&&N.ysel!=null&&mv.some(k=>s.P[msd][k]===s.P[msd][N.ysel])?N.ysel:null;
  const hop=N.yHop!==s.mvk;const selP=N.ysel!=null?s.P[msd][N.ysel]:null;
  const tk=[];s.P.forEach((P,sd)=>{const grp={};P.forEach((p,i)=>{if(p>0&&p<YEND)(grp[p]=grp[p]||[]).push(i);});Object.entries(grp).forEach(([p,ids])=>{p=+p;const [x,y]=yXY(p);const can=pick&&sd===msd&&mv.some(k=>s.P[sd][k]===p);const off=(sd-(s.P.length-1)/2)*7;
    tk.push(`<b class="yt ${can?'can':''} ${sd===msd&&selP===p?'sel':''} ${hop&&p===s.mv?'hop':''}" ${can?`data-ysel="${ids[0]}"`:''} style="background:${yCol(s,sd)};left:calc(${8+x*84}% + ${off}px);top:calc(${8+y*84}% + ${off}px)">${s.team?YTN[sd][0]:E(nm2(s.sides[sd][0]||'').slice(0,1))}${ids.length>1?`<sup>×${ids.length}</sup>`:''}</b>`);});});
  let dest='';if(pick&&N.ysel!=null){const m=yMv(selP,s.n,s.Q[msd][N.ysel]);const [x,y]=m.to>=YEND?cellXY(0):yXY(m.to);dest=`<i class="ydest" data-ydest="1" style="left:${8+x*84}%;top:${8+y*84}%">${m.to>=YEND?'골인':m.to===0?'출발':'여기'}</i>`;}
  const sidesH=s.sides.map((t,sd)=>{const P=s.P[sd];const home=P.map((p,i)=>({p,i})).filter(o=>o.p===0);const done=P.filter(p=>p>=YEND).length;const on=P.filter(p=>p>0&&p<YEND).length;const canHome=pick&&sd===msd&&s.n!==-1&&home.length>0;
    return `<div class="ySide ${sd===s.side&&!s.win?'cur':''} ${!t.length?'gone':''}" style="--c:${yCol(s,sd)}"><div class="ySideH"><b>${s.team?YTN[sd]:E(nm2(t[0]||''))}${sd===msd?' (나)':''}</b>${s.team?`<small>${t.map(id=>E(nm2(id))).join(' · ')}</small>`:''}</div><div class="ySideP">${home.map((o,k)=>`<b class="yp ${canHome&&k===0?'can':''} ${canHome&&k===0&&N.ysel===o.i?'sel':''}" ${canHome&&k===0?`data-ysel="${o.i}"`:''}></b>`).join('')}${'<b class="yp on"></b>'.repeat(on)}${'<b class="yp done">✓</b>'.repeat(done)}</div></div>`;}).join('');
  const cur=s.pl[s.turn];const tossNow=s.phase==='toss'&&N.yToss!==s.roll;const fxNow=!!s.fx&&s.phase!=='toss'&&N.yFx!==s.fxk;
  const fxT={mo:'모다! 🐴',yut:'윷이야! 🐮',catch:'잡았다! 💥',goal:'골인! 🏁',back:'빽도! 🔙'}[s.fx]||'';
  const btn=s.win?winLine(s):`<button class="primary" id="nThrow" ${my&&s.phase==='throw'?'':'disabled'}>${my?(s.phase==='pick'?(N.ysel!=null?'👆 한 번 더 누르면 움직여요':'👆 움직일 말을 눌러요'):s.phase==='toss'?'🎋 휘리릭…':'🎋 윷 던지기'):`${E(nm2(cur))}${s.team?` (${YTN[ySide(s,cur)]})`:''} 차례`}</button>`;
  return `<div class="ySides">${sidesH}</div><div class="yBoard ${fxNow&&['mo','yut','catch'].includes(s.fx)?'shake':''}">${yCells()}${tk.join('')}${dest}${fxNow?`<div class="yFx f-${s.fx}">${fxT}</div>`:''}</div>`
    +yStickH(s,tossNow)+`<div class="gMsg sm">${E(s.msg||'')}</div>`+btn+`<div class="yRule">윷·모·잡기는 한 번 더 · 모서리나 방에 딱 멈추면 지름길 · 참먹이를 지나야 골인 · 빽도는 지나온 길로 한 칸 (판에 말이 없으면 넘어가요)</div>`;}
function yClack(){if(typeof actx==='undefined'||!actx||!SND.on)return;const t=actx.currentTime;tinkle(520,t,.04,master,.12);[.78,.86,.93,1.01].forEach((d,i)=>tinkle(260+i*55,t+d,.06,master,.09));}
function yAfterRender(s){if(s.phase==='toss'&&N.yToss!==s.roll){N.yToss=s.roll;try{yClack();}catch(e){}}if(s.n!=null&&s.phase!=='toss')N.yRes=s.roll;
  if(s.fx&&s.phase!=='toss'&&N.yFx!==s.fxk){N.yFx=s.fxk;if(['mo','yut','catch','goal'].includes(s.fx)){try{chime();}catch(e){}try{navigator.vibrate&&navigator.vibrate(s.fx==='catch'?[60,40,60]:70);}catch(e){}}}N.yHop=s.mvk;}
function hostLeft(u){const s=N.s;if(!s)return;toast(`${E(NM(u))}님이 나갔어요`);if(N.game==='yut'&&s.sides){s.pl=s.pl.filter(x=>x!==u);yLeftOut(u);bcast();return;}const ti=s.pl.indexOf(u);const cur=s.pl[s.turn];s.pl=s.pl.filter(x=>x!==u);if(s.Y&&ti>=0)s.Y.splice(ti,1);
  if(s.alive)s.alive=s.alive.filter(x=>x!==u);if(s.P)delete s.P[u];if(s.pick)delete s.pick[u];if(s.hits)delete s.hits[u];if(s.sc)delete s.sc[u];
  if(s.turn!=null){const ni=s.pl.indexOf(cur);s.turn=ni>=0?ni:(ti%Math.max(1,s.pl.length));}
  if(s.pl.length<2&&!s.win)s.win=s.pl.slice();else if(N.game==='rps'){if(s.alive.length===1)s.win=[s.alive[0]];else rpsCheck();return;}else if(N.game==='cham'){chamCheck();return;}
  bcast();}
/* --- 모두: 화면 그리기 --- */
function winLine(s){if(!s.win)return '';if(N.spec)return `<div class="gWin">${s.win.length?`👑 ${s.win.map(nm2).join(', ')} 승리!`:'🤝 무승부!'}</div><div class="empty" style="text-align:center">👀 구경 중이에요</div>`;if(!s.win.length){if(!N.celebrated){N.celebrated=true;}return `<div class="gWin">🤝 무승부!</div>${N.isHost?`<button class="primary" id="nAgain">한 판 더!</button>`:''}`;}const me=s.win.includes(MYID);if(!N.celebrated){N.celebrated=true;rec(N.game,me);celebrate(me);}
  return `<div class="gWin">${me?'👑 내가 이겼어요!':`👑 ${s.win.map(nm2).join(', ')} 승리!`}</div>${N.isHost?`<button class="primary" id="nAgain">${N.local?'한 판 더!':'같은 친구들과 한 판 더!'}</button>`:'<div class="empty" style="text-align:center">방장이 한 판 더 열 수 있어요</div>'}`;}
function chips(s,extra){return `<div class="nPl">${s.pl.map((id,i)=>`<span class="nChip ${extra?extra(id,i):''}" style="--c:${COL[i%COL.length]}">${E(nm2(id))}</span>`).join('')}</div>`;}
function nRender(){if(!N||!N.s)return;const s=N.s;const el=PB();if(!$('#gPlay').classList.contains('show'))openSheet('gPlay');if(N.isHost)s.wn=(N.watchers||[]).length;$('#gPlayT').textContent=(N.spec?'👀 ':'')+(GAMES.find(g=>g.id===N.game)||{}).name+` · ${s.pl.length}명`+(s.wn?` · 구경 ${s.wn}`:'');
  if(N.game==='yeop'){el.innerHTML=ypView(s);return;}
  if(N.game==='rps'){const alive=s.alive.includes(MYID),picked=s.pick[MYID]!=null;
    el.innerHTML=chips(s,id=>(s.alive.includes(id)?'':'out ')+(s.pick[id]!=null?'done':''))+(s.last?`<div class="nLast">${s.pl.map(id=>s.last.pick[id]!=null?`<span>${E(nm2(id))} ${RPS[s.last.pick[id]]}</span>`:'').join('')}</div><div class="gMsg">${s.last.msg}</div>`:'<div class="gMsg">모두 골라요! (20초 안에 안 고르면 자동으로 골라져요)</div>')
      +(s.win?winLine(s):N.spec?'<div class="gMsg sm">👀 구경 중이에요</div>':alive?`<div class="gMsg sm">${s.r}판 · ${picked?'다른 친구들 기다리는 중…':'내 손은?'}</div><div class="rpsBtns">${RPS.map((h,i)=>`<button data-nrps="${i}" ${picked?'disabled':''} class="${s.pick[MYID]===i?'on':''}">${h}<small>${RPSN[i]}</small></button>`).join('')}</div>`:'<div class="gMsg sm">탈락했어요 😵 구경 중…</div>');}
  if(N.game==='cham'){const picked=s.pick[MYID]!=null;
    el.innerHTML=chips(s,id=>s.pick[id]!=null?'done':'')+`<div class="nScore">${s.pl.map(id=>`<span>${E(nm2(id))} <b>${s.hits[id]}</b>대</span>`).join('')}</div>`
      +(s.last?`<div class="chamStage"><div class="chamHand ${s.last.d}">${s.last.d==='L'?'👈':'👉'}</div></div><div class="gMsg">${s.last.hit.length?`${s.last.hit.map(nm2).join(', ')} 걸렸다! 😵`:'모두 피했어요! 😆'}</div>`:'<div class="chamStage"><div class="chamHand">☝️</div></div><div class="gMsg">해태 손가락을 피해요! 적게 맞은 사람이 승리</div>')
      +(s.win?winLine(s):N.spec?`<div class="gMsg sm">${Math.min(s.r,s.max)}/${s.max}판 · 👀 구경 중</div>`:`<div class="gMsg sm">${Math.min(s.r,s.max)}/${s.max}판 · ${picked?'다른 친구들 기다리는 중…':'어느 쪽으로 피할까?'}</div><div class="rpsBtns two"><button data-ncham="L" ${picked?'disabled':''}>⬅️<small>왼쪽</small></button><button data-ncham="R" ${picked?'disabled':''}>➡️<small>오른쪽</small></button></div>`);}
  if(N.game==='yut'){el.innerHTML=yView(s);yAfterRender(s);return;}
  if(N.game==='clock'){const inP=s.pl.includes(MYID)&&!N.spec;const tg=s.tg[Math.min(s.rd,s.tg.length-1)];
    if(s.phase==='run'&&(!clk||clk.go!==s.go||clk.gid!==N.gid)){if(clk)clearInterval(clk.iv);clk={go:s.go,gid:N.gid,t0:performance.now(),stopped:null};}
    const sec=v=>v<0?'시간초과':(v/1000).toFixed(2)+'초';let body='';
    if(s.phase==='run'){const done=clk.stopped!=null;body=`<div class="clockBig" id="clkNum">0.00</div><div class="gMsg">⏱️ <b>${tg}초</b>에 멈춰요!</div>`+(inP?(done?`<div class="gMsg sm">내 기록 ${sec(clk.stopped)} · 다른 사람 기다리는 중…</div>`:`<button class="clockBtn" id="clkStop">멈춰!</button>`):'<div class="gMsg sm">👀 구경 중</div>')+chips(s,id=>s.sub[id]!=null?'done':'');}
    else{const last=s.hist[s.hist.length-1];const err=(id)=>last.r[id]<0?1e9:Math.abs(last.r[id]-last.tg*1000);
      body=chips(s)+(last?`<div class="gMsg">${last.tg}초 결과</div><div class="clockRes">${s.pl.slice().sort((a,b)=>err(a)-err(b)).map((id,k)=>`<div><span>${['🥇','🥈','🥉'][k]||'·'} ${E(nm2(id))}</span><b>${sec(last.r[id])}</b><small>${last.r[id]<0?'':(last.r[id]>=last.tg*1000?'+':'-')+(Math.abs(last.r[id]-last.tg*1000)/1000).toFixed(2)}</small></div>`).join('')}</div>`:'<div class="gMsg">10초 · 20초 · 30초, 세 판!</div><div class="empty" style="text-align:center">시작하면 3초 동안만 시계가 보이고, 그다음은 감으로!<br>목표 시간이라고 생각될 때 <b>멈춰!</b>를 눌러요.</div>')
      +`<div class="nScore">${s.pl.map(id=>`<span>${E(nm2(id))} 오차 <b>${(s.tot[id]/1000).toFixed(2)}</b>초</span>`).join('')}</div>`
      +(s.win?winLine(s):N.isHost?`<button class="primary" id="clkGo">${s.rd===0?'▶ 10초 도전 시작!':`▶ ${tg}초 도전 시작`}</button>`:`<div class="gMsg sm">방장이 시작하면 바로 시작돼요 · 다음은 ${tg}초</div>`);}
    el.innerHTML=body;
    if(clk)clearInterval(clk.iv);if(s.phase==='run'&&clk){const upd=()=>{const e=document.getElementById('clkNum');if(!e){clearInterval(clk.iv);return;}const t=(clk.stopped!=null?clk.stopped:performance.now()-clk.t0)/1000;const bl=t>=3&&clk.stopped==null;e.textContent=bl?'? ? ?':t.toFixed(2);e.classList.toggle('blind',bl);};upd();clk.iv=setInterval(upd,50);}
    return;}
  if(N.game==='omok'){const my=s.pl[s.turn]===MYID;const stc=d=>s.pl.length===2?(d==='0'?'#1a1a1e':'#fbfbf6'):COL[+d%COL.length];
    el.innerHTML=chips(s,(id,i)=>i===s.turn?'cur':'').replace(/<span class="nChip/g,'<span class="nChip')+`<div class="omok">${s.b.split('').map((c,i)=>`<i data-nomok="${i}" class="${c!=='.'?'st':''} ${i===s.last?'last':''} ${N.ghost===i?'gh':''}" ${c!=='.'?`style="--s:${stc(c)}"`:N.ghost===i?`style="--s:${stc(String(s.turn))}"`:''}></i>`).join('')}</div>`
      +`<div class="gMsg sm">${E(s.msg||'')}${my&&!s.win?' · 같은 칸을 한 번 더 누르면 놓여요':''}</div>`+(s.win?winLine(s):'');}
  if(N.game==='rumi'){const my=s.pl[s.turn]===MYID&&!s.win&&!N.spec;rsInit();const left=RS.hl;const op=!!s.opened[MYID];const srt=RS.sort==='f'?left.map((t,i)=>({t,i})):left.map((t,i)=>({t,i})).sort((a,b)=>RS.sort==='c'?(tCol(a.t).localeCompare(tCol(b.t))||tNum(a.t)-tNum(b.t)):(tNum(a.t)-tNum(b.t)||tCol(a.t).localeCompare(tCol(b.t))));
    const bad=RS.tbl.filter(st=>!rsOk(st)).length,placed=(N.hand||[]).length-left.length;
    const why=!my?'':RS.loose.length?'꺼낸 패를 모두 묶음에 넣어야 해요':bad?`규칙에 안 맞는 묶음이 ${bad}개 있어요 (빨간 테두리)`:placed<=0?'손패에서 한 장 이상 내려놓아요':'';
    el.innerHTML=`<div class="nPl">${s.pl.map((id,i)=>`<span class="nChip ${i===s.turn?'cur':''}" style="--c:${COL[i%COL.length]}">${E(nm2(id))} ${s.cnt[id]}장${s.opened[id]?'':' · 시작 전'}</span>`).join('')}</div>
      <div class="rTable">${RS.tbl.length?'':'<div class="empty">아직 내려놓은 패가 없어요</div>'}${RS.tbl.map((st,si)=>`<div class="rSet ${RS.addMode&&my?'pick':''} ${my&&!rsOk(st)?'bad':''}" data-rset="${si}">${st.map((x,ti)=>`<span data-rt="${si}_${ti}">${tileH(x.t,(x.o==='h'?'new ':'')+(RS.sel.has('t:'+si+'_'+ti)?'sel':''))}</span>`).join('')}</div>`).join('')}</div>
      ${RS.loose.length?`<div class="rLoose"><small>✋ 바닥에서 꺼낸 패 · 다시 묶음에 넣어야 해요</small><div>${RS.loose.map((x,i)=>`<span data-rl="${i}">${tileH(x.t,(x.o==='h'?'new ':'')+(RS.sel.has('l:'+i)?'sel':''))}</span>`).join('')}</div></div>`:''}
      <div class="gMsg sm">${E(s.msg||'')} · 더미 ${s.pool}장</div>
      ${N.spec?'<div class="empty" style="text-align:center">👀 구경 중이라 손패는 보이지 않아요</div>':`<div class="rHandBar"><span>내 패 ${left.length}장</span><span class="rSortG">${[['c','색깔순'],['n','숫자순'],['f','✋ 내 마음대로']].map(([k,l])=>`<button class="ghost sm ${RS.sort===k?'on':''}" data-rsort="${k}">${l}</button>`).join('')}</span></div><div class="rTip">패를 꾹 눌러 끌면 원하는 자리로 옮길 수 있어요</div>
      <div class="rHand" id="rHandBox">${srt.map(({t,i})=>`<span data-rh="${i}">${tileH(t,RS.sel.has('h:'+i)?'sel':'')}</span>`).join('')}</div>`}`
      +(s.win?winLine(s):my?`<div class="rBtns"><button class="ghost" id="rMake" ${RS.sel.size?'':'disabled'}>➕ 새 묶음</button><button class="ghost" id="rAdd" ${RS.sel.size?'':'disabled'}>${RS.addMode?'👆 묶음을 눌러요':'📎 묶음에 붙이기'}</button><button class="ghost" id="rPull" ${op&&[...RS.sel].some(k=>k[0]==='t')?'':'disabled'}>✋ 바닥에서 꺼내기</button></div>
        <div class="rBtns two"><button class="ghost" id="rBack" ${[...RS.sel].some(k=>k[0]!=='h')?'':'disabled'}>↩ 내 손으로</button><button class="ghost" id="rReset" ${RS.moved?'':'disabled'}>⟲ 처음 바닥으로</button></div>
        <div class="rBtns two"><button class="ghost" id="rDraw" ${RS.moved?'disabled':''}>🀫 한 장 가져오기</button><button class="primary" id="rCommit" ${RS.moved&&!why?'':'disabled'}>✔ 내려놓고 넘기기</button></div>
        <div class="empty">${why?'⚠️ '+why+'<br>':''}${op?'바닥 패를 눌러 골라 <b>꺼내기</b>로 옮기거나, 손패와 섞어 <b>새 묶음</b>을 만들 수 있어요. 끝날 때 모든 묶음이 맞아야 해요.':'처음 내려놓을 땐 내 패로만 30점 이상! 그다음 차례부터 바닥 패를 옮길 수 있어요.'} 차례마다 2분 30초 안에 안 하면 자동으로 한 장 가져가요.</div>`:`<div class="gMsg sm">${E(nm2(s.pl[s.turn]))} 차례를 기다려요…</div>`);}
  if(N.game==='memo'){const my=s.pl[s.turn]===MYID;
    el.innerHTML=chips(s,(id,i)=>i===s.turn?'cur':'')+`<div class="nScore">${s.pl.map(id=>`<span>${E(nm2(id))} <b>${s.sc[id]}</b>짝</span>`).join('')}</div>`
      +`<div class="memo">${s.deck.split('').map((v,i)=>{const o=s.own[i]!=='.',op=s.open.includes(i);return `<button data-nmemo="${i}" class="${o||op?'o':''} ${o?'m':''}" ${o?`style="border-color:${COL[+s.own[i]%COL.length]}"`:''}><span>${o||op?MEMO[+v]:'學'}</span></button>`;}).join('')}</div>`
      +`<div class="gMsg sm">${E(s.msg||(my?'내 차례! 두 장을 뒤집어요':`${nm2(s.pl[s.turn])} 차례`))}</div>`+(s.win?winLine(s):'');}}

function endPlay(){G=null;if(N){if(N.isHost){(N.s?N.s.pl:N.joined).concat(N.watchers||[]).forEach(id=>{if(id!==MYID&&id!=='AI')sendG(id,{k:'end',gid:N.gid});});N.s=null;announce();}else sendG(N.host,{k:'left',gid:N.gid});N=null;}clearTimeout(hostT);closeSheets();}
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
const YEND=30;
function throwYut(){const r=Math.random();const W=[[-1,.12],[1,.2],[2,.25],[3,.21],[4,.12],[5,.1]];let a=0,n=2;for(const [k,w] of W){a+=w;if(r<a){n=k;break;}}
  let f;if(n===-1)f=[1,0,0,0];else if(n===5)f=[0,0,0,0];else if(n===4)f=[1,1,1,1];else{const pos=n===1?[1,2,3]:[0,1,2,3];f=[0,0,0,0];ypShuf(pos).slice(0,n).forEach(i=>f[i]=1);}return {n,f};}
const YJ=29;
function yRoute(f){const O=k=>{const r=[];for(let x=k;x<=19;x++)r.push(x);r.push(YJ,YEND);return r;};const IN=[27,28,YJ,YEND];
  if(f===YJ)return [YEND];if(f===5)return [20,21,22,23,24,...O(15)];if(f===10)return [25,26,22,...IN];if(f===22)return IN.slice();
  if(f===20)return [21,22,23,24,...O(15)];if(f===21)return [22,23,24,...O(15)];if(f===23)return [24,...O(15)];if(f===24)return O(15);
  if(f===25)return [26,22,...IN];if(f===26)return [22,...IN];if(f===27)return [28,YJ,YEND];if(f===28)return [YJ,YEND];
  return O(f+1);}
const YBACK={1:YJ,20:5,21:20,22:21,23:22,24:23,25:10,26:25,27:22,28:27,[YJ]:19};
function yMv(from,n,prev){if(n===-1){const to=prev>0&&prev<YEND?prev:(from in YBACK?YBACK[from]:Math.max(0,from-1));return {to,prev:0};}
  const r=yRoute(from);const to=n-1<r.length?r[n-1]:YEND;const pv=n>=2?r[n-2]:(from>0?from:0);return {to,prev:pv};}
function yMove(from,n){return yMv(from,n).to;}
function yLeft(p){return p>=YEND?0:p===0?31:yRoute(p).length;}
function yXY(p){if(p===YJ)return cellXY(0);if(p<20)return cellXY(p);const L=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];const C=[.5,.5];
  return {20:L([1,0],C,1/3),21:L([1,0],C,2/3),22:C,23:L(C,[0,1],1/3),24:L(C,[0,1],2/3),25:L([0,0],C,1/3),26:L([0,0],C,2/3),27:L(C,[1,1],1/3),28:L(C,[1,1],2/3)}[p];}
function yCells(){let c=`<svg class="yLines" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M8 8H92V92H8Z M8 8L92 92 M92 8L8 92" stroke="#b8946a" stroke-width=".8" fill="none" stroke-dasharray="2 1.5"/></svg>`;
  for(let p=0;p<29;p++){const [x,y]=yXY(p);const big=p%5===0&&p<20||p===22;c+=`<i class="yc ${big?'big':''}" style="left:${8+x*84}%;top:${8+y*84}%">${p===0?'출':p===22?'방':''}</i>`;}return c;}
function ySticksH(f,flip,n,k){return `<div class="yThrowRow"><div class="ySticks ${flip?'flip':''}">${(f||[0,0,0,0]).map((v,i)=>`<i class="${v?'f':'b'} ${i===0?'mk':''}"></i>`).join('')}</div>${n!=null?`<div class="yRes ${n===-1?'bk':''}" data-k="${k||0}">${YN[n]}!</div>`:'<div class="yRes dim">　</div>'}</div>`;}
function yutStart(){Object.assign(G,{P:[[0,0],[0,0]],turn:0,phase:'throw',last:null,sticks:[0,0,0,0],log:'',over:false});
  G.my=G.pvp?G.me:0;yutDraw(G.turn===G.my?'윷을 던져요!':(G.pvp?`${NM(G.vs)}님 차례`:'해태 차례'));if(!G.pvp&&G.turn!==G.my)setTimeout(yutAI,900);}
function cellXY(p){const S=4,step=1/S;let x,y;const q=Math.floor(p/5),r=p%5;if(q===0){x=1;y=1-r*step;}else if(q===1){x=1-r*step;y=0;}else if(q===2){x=0;y=r*step;}else{x=r*step;y=1;}return [x,y];}
function yutDraw(msg,pick){const me=G.my,opp=1-me,nm=[G.pvp?'':'',''];const oppName=G.pvp?NM(G.vs):'해태';
  const cells=yCells();
  const tokens=[];[0,1].forEach(pl=>{const grp={};G.P[pl].forEach((p,i)=>{if(p>0&&p<YEND){(grp[p]=grp[p]||[]).push(i);}});Object.entries(grp).forEach(([p,ids])=>{const [x,y]=yXY(+p);
    const can=pick&&pl===me;tokens.push(`<b class="yt p${pl===me?0:1} ${can?'can':''}" ${can?`data-pc="${ids[0]}"`:''} style="left:${8+x*84}%;top:${8+y*84}%;transform:translate(${pl?'-20%':'-80%'},-50%)">${pl===me?'나':'상'}${ids.length>1?'<sup>×2</sup>':''}</b>`);});});
  const home=pl=>G.P[pl].map((p,i)=>p===0?`<b class="yt in p${pl===me?0:1} ${pick&&pl===me?'can':''}" ${pick&&pl===me?`data-pc="${i}"`:''}>${pl===me?'나':'상'}</b>`:p>=YEND?'<b class="yt in done">✓</b>':'').join('');
  PB().innerHTML=`<div class="yTop"><div><small>나</small>${home(me)||'<i class="dim">모두 출발</i>'}</div><div class="${G.turn===me?'turn':''}">${G.turn===me?'내 차례':''}</div><div style="text-align:right"><small>${E(oppName)}</small>${home(opp)||'<i class="dim">모두 출발</i>'}</div></div>
   <div class="yBoard">${cells}${tokens.join('')}</div>${ySticksH(G.sticks,G.flip,G.last)}
   <div class="gMsg">${msg}</div>
   ${G.over?`<button class="primary" id="gAgain">한 판 더!</button>`:`<button class="primary" id="yThrow" ${G.turn===me&&G.phase==='throw'?'':'disabled'}>🎋 윷 던지기</button>`}`;}
function movable(pl,n){const r=[];G.P[pl].forEach((p,i)=>{if(p>=YEND)return;if(n===-1){if(p>0)r.push(i);}else r.push(i);});const seen=new Set();return r.filter(i=>{const k=G.P[pl][i];if(seen.has(k))return false;seen.add(k);return true;});}
function applyYut(n,pc){if(!G||G.game!=='yut'||G.over)return;const pl=G.turn,opp=1-pl;let extra=n===4||n===5,msg='';
  if(pc>=0){const from=G.P[pl][pc];const to=yMove(from,n);
    G.P[pl].forEach((p,i)=>{if(p===from&&(from>0||i===pc))G.P[pl][i]=to;});
    if(to>0&&to<YEND&&G.P[opp].some(p=>p===to)){G.P[opp]=G.P[opp].map(p=>p===to?0:p);extra=true;msg='잡았다! 한 번 더 🎉';}
    else if(to>=YEND)msg='한 마리 골인! 🏁';else if(to===22)msg='방에 쏙! 지름길 🎯';else if(G.P[pl].filter(p=>p===to&&to>0).length>1)msg='업었다! 🐎🐎';}
  else msg='움직일 말이 없어요';
  if(G.P[pl].every(p=>p>=YEND)){G.over=true;const w=pl===G.my;rec('yut',w);celebrate(w);yutDraw(w?'내가 이겼어요! 👑':(G.pvp?NM(G.vs):'해태')+' 승리… 다음엔 꼭!');return;}
  if(!extra)G.turn=opp;G.phase='throw';G.last=n;
  const who=G.turn===G.my?'내 차례':(G.pvp?NM(G.vs)+'님 차례':'해태 차례');yutDraw((msg?msg+' · ':'')+(extra&&pl===G.my?'한 번 더 던져요!':who));
  if(!G.pvp&&G.turn!==G.my&&!G.over)setTimeout(yutAI,1100);}
function animThrow(t,cb){if(!G||G.game!=='yut')return;G.flip=true;G.sticks=t.f;G.last=null;yutDraw('던지는 중…');setTimeout(()=>{if(!G||G.game!=='yut')return;G.flip=false;G.last=t.n;cb();},700);}
function myThrow(){if(!G||G.turn!==G.my||G.phase!=='throw')return;G.phase='wait';const t=throwYut();animThrow(t,()=>{const mv=movable(G.my,t.n);
  if(!mv.length){finishMine(t,-1);return;}if(mv.length===1){finishMine(t,mv[0]);return;}G.pendingN=t;G.phase='pick';yutDraw(`${YN[t.n]}! 움직일 말을 눌러요`,true);});}
function finishMine(t,pc){if(G.pvp)sendG(G.vs,{k:'yut',gid:G.gid,n:t.n,f:t.f,pc});setTimeout(()=>applyYut(t.n,pc),pc<0?600:250);}
function yutAI(){if(!G||G.game!=='yut'||G.over||G.turn===G.my)return;const t=throwYut();animThrow(t,()=>{const pl=G.turn,mv=movable(pl,t.n);let best=-1,bs=-1e9;
  mv.forEach(i=>{const from=G.P[pl][i];const to=yMove(from,t.n);let s=yLeft(from)-yLeft(to);if(to>0&&to<YEND&&G.P[1-pl].includes(to))s+=40;if(to>=YEND)s+=30;if(from===0)s-=3;if(G.P[1-pl].some(q=>q>0&&q<YEND&&[1,2,3,4,5].some(k=>yMove(q,k)===to)))s-=6;if(s>bs){bs=s;best=i;}});
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
  if(t.closest('[data-g="ladder"]')){if(window.openLadder)openLadder('games');return;}
  const g=t.closest('[data-g]');if(g){const vs=g.dataset.vs;if(vs==='pick')pickFriend(g.dataset.g);else if(g.dataset.g==='omok'||g.dataset.g==='clock'||g.dataset.g==='yeop'||g.dataset.g==='yut'){startLocalN(g.dataset.g);}else{N=null;startGame(g.dataset.g,vs,'local',0);}return;}
  if(t.closest('#gAll')){const on=t.closest('#gAll').checked;$$('#gPick [data-who]').forEach(c=>c.checked=on);return;}
  const si=t.closest('#gSendInv');if(si){const ids=$$('#gPick [data-who]').filter(c=>c.checked).map(c=>c.dataset.who);G=null;hostInvite(si.dataset.game,ids);return;}
  if(t.closest('#gStart')&&N&&N.isHost&&N.joined.length>=2){N.s=newState(N.game,N.joined.slice());N.celebrated=false;if(N.game!=='yeop'&&N.game!=='yut')N.s.msg=N.game==='memo'?`${nm2(N.s.pl[0])} 차례`:'';bcast();return;}
  if(t.closest('#nAgain')&&N&&N.isHost){N.s=newState(N.game,N.s.pl.slice());N.celebrated=false;N.s.v=0;if(N.game!=='yeop'&&N.game!=='yut')N.s.msg=N.game==='memo'?`${nm2(N.s.pl[0])} 차례`:'';bcast();return;}
  if(N&&N.s&&N.game==='clock'){if(t.closest('#clkGo')){act({k:'start'});return;}if(t.closest('#clkStop')&&clk&&clk.stopped==null){clk.stopped=Math.round(performance.now()-clk.t0);act({k:'stop',go:N.s.go,t:clk.stopped});nRender();return;}}
  if(N&&N.s&&N.game==='omok'){const o=t.closest('[data-nomok]');if(o){const i=+o.dataset.nomok;const s=N.s;if(s.win||s.pl[s.turn]!==MYID||s.b[i]!=='.')return;if(isDoubleThree(s.b,i,String(s.turn))){toast('3·3은 둘 수 없어요 🙅');return;}if(N.ghost===i){N.ghost=null;act({i});}else{N.ghost=i;nRender();}return;}}
  if(N&&N.game==='yut'&&N.isHost&&!N.s){const md=t.closest('[data-ymode]');if(md){N.opt=N.opt||{};N.opt.team=md.dataset.ymode==='team';lobby();return;}const tm=t.closest('[data-ytm]');if(tm){N.opt=N.opt||{team:true};N.opt.tm=N.opt.tm||{};const id=tm.dataset.ytm;const cur=yTeamOf(id);N.opt.tm[id]=1-cur;lobby();return;}}
  if(N&&N.s&&N.game==='yut'){const ys=t.closest('[data-ysel]');if(ys){const s=N.s;if(s.phase!=='pick'||s.pl[s.turn]!==MYID)return;const i=+ys.dataset.ysel;if(N.ysel===i){N.ysel=null;act({k:'pick',pc:i});}else{N.ysel=i;nRender();}return;}
    const yd=t.closest('[data-ydest]');if(yd&&N.ysel!=null){const i=N.ysel;N.ysel=null;act({k:'pick',pc:i});return;}}
  if(N&&N.s&&N.game==='yeop'&&ypClick(t))return;
  if(N&&N.s&&N.game==='rumi'&&RS){const s=N.s;const my=s.pl[s.turn]===MYID&&!s.win&&!N.spec;const op=!!s.opened[MYID];
    if(window.__rNoClick&&Date.now()-window.__rNoClick<450)return;
    const so=t.closest('[data-rsort]');if(so){const k=so.dataset.rsort;if(k==='f'&&RS.sort!=='f'){const box=document.getElementById('rHandBox');if(box){const vis=[...box.querySelectorAll('[data-rh]')].map(x=>+x.dataset.rh);rsApply(vis);}}RS.sort=k;nRender();return;}
    if(!my){if(t.closest('[data-rh]'))toast('내 차례에 고를 수 있어요');return;}
    const rset=t.closest('[data-rset]');
    if(RS.addMode&&rset){const tgt=RS.tbl[+rset.dataset.rset];if(!op&&tgt.some(x=>x.o==='t')){toast('처음 내려놓기 전에는 바닥 묶음에 붙일 수 없어요');return;}const objs=rsTake();tgt.push(...objs);RS.addMode=false;rsTidy();nRender();return;}
    const hi=t.closest('[data-rh]');if(hi){const k='h:'+hi.dataset.rh;RS.sel.has(k)?RS.sel.delete(k):RS.sel.add(k);nRender();return;}
    const li=t.closest('[data-rl]');if(li){const k='l:'+li.dataset.rl;RS.sel.has(k)?RS.sel.delete(k):RS.sel.add(k);nRender();return;}
    const ti=t.closest('[data-rt]');if(ti){const [a,b]=ti.dataset.rt.split('_').map(Number);const x=RS.tbl[a][b];if(!op&&x.o==='t'){toast('처음 내려놓기(30점) 전에는 바닥 패를 옮길 수 없어요');return;}const k='t:'+a+'_'+b;RS.sel.has(k)?RS.sel.delete(k):RS.sel.add(k);nRender();return;}
    if(t.closest('#rMake')){const objs=rsTake();if(objs.length)RS.tbl.push(objs);RS.addMode=false;rsTidy();nRender();return;}
    if(t.closest('#rAdd')){if(!RS.sel.size){toast('붙일 패를 먼저 골라요');return;}RS.addMode=!RS.addMode;nRender();return;}
    if(t.closest('#rPull')){[...RS.sel].forEach(k=>{if(k[0]!=='t')RS.sel.delete(k);});const objs=rsTake();RS.loose.push(...objs);rsTidy();nRender();return;}
    if(t.closest('#rBack')){const ks=[...RS.sel].filter(k=>k[0]!=='h');let warn=false;RS.sel=new Set(ks.filter(k=>{const o=k[0]==='l'?RS.loose[+k.slice(2)]:RS.tbl[+k.slice(2).split('_')[0]][+k.slice(2).split('_')[1]];if(o.o!=='h'){warn=true;return false;}return true;}));const objs=rsTake();objs.forEach(x=>RS.hl.push(x.t));rsTidy();if(warn)toast('바닥에 있던 패는 손으로 가져올 수 없어요');nRender();return;}
    if(t.closest('#rReset')){RS.key=null;rsInit();nRender();return;}
    if(t.closest('#rDraw')){act({k:'draw'});return;}
    if(t.closest('#rCommit')){act({k:'commit',table:RS.tbl.map(st=>st.map(x=>x.t))});return;}
    return;}
  if(N&&N.s){const a=t.closest('[data-nrps]');if(a){act({c:+a.dataset.nrps});return;}const c=t.closest('[data-ncham]');if(c){act({c:c.dataset.ncham});return;}
    if(t.closest('#nThrow')){act({k:'throw'});return;}const pc=t.closest('[data-npc]');if(pc){act({k:'pick',pc:+pc.dataset.npc});return;}const mm=t.closest('[data-nmemo]');if(mm){act({i:+mm.dataset.nmemo});return;}}
  const wt=t.closest('[data-watch]');if(wt){G=null;N={gid:wt.dataset.watch,game:wt.dataset.game,host:wt.dataset.host,isHost:false,spec:true,s:null};sendG(N.host,{k:'watch',gid:N.gid});openSheet('gPlay');$('#gPlayT').textContent='👀 '+((GAMES.find(g=>g.id===N.game)||{}).name||'');PB().innerHTML='<div class="empty" style="text-align:center">👀 놀이판을 불러오는 중…</div>';return;}
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
window.__gameState=()=>N;window.__sendG=sendG;window.__ypAI=()=>ypAI();
window.__socialOpen=id=>{if(id==='games')renderGames();if(id==='friends')dmInbox();};
/* 받은 편지함 연결 (Firebase 연결 후) */
let hooked=false;setInterval(()=>{if(!hooked&&DM()&&DM().ready()){hooked=true;DM().listen(gotDM);}dmBadge();},1000);
/* ✋ 숫자패: 손패를 끌어서 내 마음대로 배치 */
function rsApply(visIdx){const old=RS.hl.slice();const map={};visIdx.forEach((oi,ni)=>map[oi]=ni);RS.hl=visIdx.map(i=>old[i]);RS.ord=RS.hl.slice();
  RS.sel=new Set([...RS.sel].map(k=>k[0]==='h'&&map[+k.slice(2)]!=null?'h:'+map[+k.slice(2)]:k));}
(function(){let D=null;
  const end=()=>{if(D&&D.ghost)D.ghost.remove();if(D&&D.src)D.src.classList.remove('dragSrc');document.querySelectorAll('.rHand .dropL,.rHand .dropR').forEach(x=>x.classList.remove('dropL','dropR'));D=null;};
  const target=(x,y)=>{const box=document.getElementById('rHandBox');if(!box)return null;const els=[...box.querySelectorAll('[data-rh]')];let best=null,bd=1e9;els.forEach((el,k)=>{const r=el.getBoundingClientRect();const cx=r.left+r.width/2,cy=r.top+r.height/2;const d=Math.hypot((x-cx)*1,(y-cy)*1.6);if(d<bd){bd=d;best={el,k,after:x>cx};}});return best;};
  document.addEventListener('pointerdown',e=>{const el=e.target.closest('#rHandBox [data-rh]');if(!el||!N||N.game!=='rumi'||!RS)return;D={src:el,x:e.clientX,y:e.clientY,id:e.pointerId,on:false};},true);
  document.addEventListener('pointermove',e=>{if(!D||e.pointerId!==D.id)return;if(!D.on){if(Math.hypot(e.clientX-D.x,e.clientY-D.y)<9)return;D.on=true;const r=D.src.getBoundingClientRect();D.ox=e.clientX-r.left;D.oy=e.clientY-r.top;D.ghost=D.src.cloneNode(true);D.ghost.className='rGhost';D.ghost.style.width=r.width+'px';document.body.appendChild(D.ghost);D.src.classList.add('dragSrc');}
    e.preventDefault();D.ghost.style.left=(e.clientX-D.ox)+'px';D.ghost.style.top=(e.clientY-D.oy-14)+'px';
    document.querySelectorAll('.rHand .dropL,.rHand .dropR').forEach(x=>x.classList.remove('dropL','dropR'));const t=target(e.clientX,e.clientY);if(t&&t.el!==D.src)t.el.classList.add(t.after?'dropR':'dropL');},{passive:false});
  document.addEventListener('pointerup',e=>{if(!D||e.pointerId!==D.id)return;if(!D.on){D=null;return;}const t=target(e.clientX,e.clientY);const box=document.getElementById('rHandBox');
    if(t&&box){const vis=[...box.querySelectorAll('[data-rh]')].map(x=>+x.dataset.rh);const from=vis.indexOf(+D.src.dataset.rh);let to=t.k+(t.after?1:0);const v=vis.splice(from,1)[0];if(to>from)to--;vis.splice(to,0,v);rsApply(vis);RS.sort='f';}
    window.__rNoClick=Date.now();end();nRender();});
  document.addEventListener('pointercancel',end);
})();
/* 💬 놀이하면서 채팅 */
let GC=[],GCID=null;
function gcAdd(by,t){if(!N)return;if(GCID!==N.gid){GC=[];GCID=N.gid;}GC.push({by,t,ts:Date.now()});if(GC.length>40)GC.shift();gcRender();if(by!==MYID){try{if(typeof chime==='function'&&!$('#gPlay').classList.contains('show'))chime();}catch(e){}}}
function gcRender(){const box=document.getElementById('gcLog');if(!box)return;if(!N||GCID!==N.gid){box.innerHTML='<div class="gcSys">놀이하면서 같이 이야기해요 💬</div>';return;}
  box.innerHTML=GC.slice(-30).map(c=>`<div class="${c.by===MYID?'me':''}"><b>${E(nm2(c.by))}</b>${E(c.t)}</div>`).join('');box.scrollTop=box.scrollHeight;}
function gcSend(){const i=document.getElementById('gcIn');if(!i||!N)return;const t=i.value.trim().slice(0,120);if(!t)return;if(typeof badBlock==='function'&&!(typeof ADMIN_ON!=='undefined'&&ADMIN_ON)&&badBlock(t))return;i.value='';gcAdd(MYID,t);
  if(N.isHost){const to=[...(N.s?N.s.pl:N.joined||[]),...(N.watchers||[])].filter(x=>x!==MYID&&x!=='AI');[...new Set(to)].forEach(x=>sendG(x,{k:'gc',gid:N.gid,by:MYID,t}));}else sendG(N.host,{k:'gc',gid:N.gid,by:MYID,t});
  try{if(typeof myBubble!=='undefined'&&myBubble)myBubble.set(t);}catch(e){}}
(function(){const sh=document.querySelector('#gPlay .sheet');if(!sh||document.getElementById('gChat'))return;const w=document.createElement('div');w.id='gChat';
  w.innerHTML='<div id="gcLog"></div><div class="gcBar"><input id="gcIn" maxlength="120" placeholder="같이 노는 친구들에게 한마디" enterkeyhint="send" autocomplete="off"><button id="gcSend" class="primary">보내기</button></div>';sh.appendChild(w);
  document.getElementById('gcSend').addEventListener('click',gcSend);document.getElementById('gcIn').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing){e.preventDefault();gcSend();}});
  document.getElementById('gcIn').addEventListener('focus',()=>setTimeout(()=>{try{w.scrollIntoView({block:'end',behavior:'smooth'});}catch(e){}},350));
  const md=document.getElementById('gPlay');new MutationObserver(()=>{const on=md.classList.contains('show');w.style.display=on&&N?'':'none';if(on)gcRender();}).observe(md,{attributes:true,attributeFilter:['class']});w.style.display='none';})();
})();

