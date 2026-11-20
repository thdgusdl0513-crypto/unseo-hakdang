/* 운서학당 · Firebase 연결 (claude.ai 밖에서 친구들과 함께 쓰기)
   Firebase Realtime Database + 익명 로그인으로 학당의 공유 저장소·실시간 접속을 대신합니다.
   firebase-config.js 가 비어 있으면 아무것도 하지 않고, 학당은 혼자 모드(이 기기 저장)로 동작합니다. */
(function(){
  const CFG=window.FIREBASE_CONFIG;
  if(window.claude||!window.firebase||!CFG||!CFG.apiKey||!CFG.databaseURL)return;
  let app,auth,fdb;const CS=window.__cloudState={stage:'start',err:''};
  try{app=firebase.initializeApp(CFG);auth=firebase.auth();fdb=firebase.database();}catch(e){CS.stage='fail';CS.err='init';console.warn('Firebase 초기화 실패',e);return;}
  const TS=firebase.database.ServerValue.TIMESTAMP;
  const lsGet=k=>{try{const v=localStorage.getItem('unseo.'+k);return v==null?null:JSON.parse(v);}catch(e){return null;}};
  let uid=null,joined=false,joinWaiters=[];
  const readyP=new Promise(res=>joinWaiters.push(res));
  const markJoined=()=>{if(joined)return;joined=true;CS.stage='ok';CS.err='';joinWaiters.forEach(f=>f());joinWaiters=[];};
  async function join(pw){if(!uid)await authP;if(!uid)throw new Error('no-auth');CS.stage='join';try{await fdb.ref('members/'+uid).update({key:pw,ts:Date.now()});}catch(e){CS.err='join';CS.msg=String(e&&e.message||e);throw e;}markJoined();}
  window.__cloudJoin=pw=>join(pw).catch(e=>{console.warn('입장 기록 실패',e);});
  CS.stage='auth';const authP=auth.signInAnonymously().then(async c=>{uid=c.user.uid;CS.stage='member';
    try{const s=await fdb.ref('members/'+uid+'/key').get();if(s.exists()){markJoined();return;}}catch(e){}
    const saved=lsGet('pwk');if(saved){try{await join(saved);}catch(e){}}else CS.stage='needpw';
  }).catch(e=>{CS.err='auth';CS.msg=String(e&&(e.code||e.message)||e);console.warn('익명 로그인 실패 — Firebase 콘솔에서 익명 로그인을 켰는지 확인해 주세요',e);});

  /* ---------- db (Firestore 비슷한 모양으로 감싸기) ---------- */
  const ROOTS={members:'members',stamps:'stamps',likes:'likes'};
  const pathOf=col=>ROOTS[col]||('data/'+col);
  const mkDoc=(id,v)=>({id,exists:v!=null,data:()=>v==null?undefined:v,metadata:{fromCache:false,hasPendingWrites:false}});
  const errOf=e=>({code:/permission/i.test(String(e&&e.message||e))?'invalid_argument':'unavailable',message:String(e&&e.message||e)});
  function docRef(path){const parts=path.split('/');const top=parts[0];const ref=fdb.ref(top==='members'||top==='stamps'||top==='likes'?path:'data/'+path);
    return {id:parts[parts.length-1],path,
      set:o=>(top==='members'?ref.update(o):ref.set(o)).catch(e=>{throw errOf(e);}),
      update:o=>ref.update(o).catch(e=>{throw errOf(e);}),
      delete:()=>ref.remove().catch(e=>{throw errOf(e);}),
      get:()=>ref.get().then(s=>mkDoc(s.key,s.val())),
      onSnapshot(next,err){const h=ref.on('value',s=>next(mkDoc(s.key,s.val())),e=>err&&err(errOf(e)));return ()=>ref.off('value',h);}};}
  function query(col,order,lim){const base=fdb.ref(pathOf(col));
    return {path:col,
      orderBy:(f,dir)=>query(col,[f,dir||'asc'],lim),limit:n=>query(col,order,n),where:()=>query(col,order,lim),
      doc:id=>docRef(col+'/'+(id||base.push().key)),
      add:o=>{const r=base.push();return r.set(o).then(()=>docRef(col+'/'+r.key)).catch(e=>{throw errOf(e);});},
      _q(){let q=base;if(order)q=q.orderByChild(order[0]);if(lim)q=order&&order[1]==='desc'?q.limitToLast(lim):q.limitToFirst(lim);return q;},
      onSnapshot(next,err){const q=this._q();const h=q.on('value',s=>{const docs=[];s.forEach(c=>{docs.push(mkDoc(c.key,c.val()));});if(order&&order[1]==='desc')docs.reverse();next({docs,size:docs.length,empty:!docs.length,metadata:{fromCache:false,hasPendingWrites:false},docChanges:()=>[]});},e=>err&&err(errOf(e)));return ()=>q.off('value',h);},
      get(){return this._q().get().then(s=>{const docs=[];s.forEach(c=>{docs.push(mkDoc(c.key,c.val()));});if(order&&order[1]==='desc')docs.reverse();return {docs,size:docs.length,empty:!docs.length,metadata:{fromCache:false}};});}};}
  const DB={collection:col=>query(col,null,null),doc:docRef};

  /* ---------- user ---------- */
  const USER={id:async()=>{await readyP;return uid;},me:async()=>({id:uid}),can:async()=>true,canEdit:async()=>false,isOwner:async()=>false,profiles:async()=>({}),search:async()=>[]};

  /* ---------- room (실시간 접속·대화) ---------- */
  let ROOM=null;
  function makeRoom(){const PEER=(uid||'x').slice(0,6)+Math.random().toString(36).slice(2,8);const presRef=fdb.ref('presence/'+PEER);
    let mine={},conn=false,wT=null,lastW=0;const connCbs=[];
    const write=()=>{wT=null;lastW=Date.now();presRef.set({by:uid,p:mine,t:TS}).catch(()=>{});};
    fdb.ref('.info/connected').on('value',s=>{conn=!!s.val();if(conn){presRef.onDisconnect().remove();write();}connCbs.forEach(f=>{try{f(conn);}catch(e){}});});
    window.addEventListener('pagehide',()=>{presRef.remove();});
    let prev=new Map();
    return {
      presence(patch){Object.assign(mine,patch);Object.keys(mine).forEach(k=>{if(mine[k]===null||mine[k]===undefined)delete mine[k];});
        if(!wT){const wait=Math.max(0,220-(Date.now()-lastW));wT=setTimeout(write,wait);}return Promise.resolve();},
      onPeers(cb,err){const ref=fdb.ref('presence');const h=ref.on('value',s=>{const now=Date.now();const list=[];const cur=new Map();
          s.forEach(c=>{const v=c.val()||{};const p={peer:c.key,by:v.by||null,isMe:v.by===uid,sameTab:c.key===PEER,kind:'viewer',guest:false,presence:v.p||{},updatedAt:now};list.push(p);cur.set(c.key,p);});
          if(!cur.has(PEER))list.push({peer:PEER,by:uid,isMe:true,sameTab:true,kind:'viewer',guest:false,presence:mine,updatedAt:now});
          const left=[...prev.values()].filter(p=>!cur.has(p.peer));prev=cur;cb({peers:list,joined:[],left,updated:[]});},e=>err&&err(errOf(e)));return ()=>ref.off('value',h);},
      peers:()=>[...prev.values()],
      on(topic,cb){if(topic!=='chat')return ()=>{};const q=fdb.ref('chat').orderByChild('t').startAt(Date.now()-5000);const h=q.on('child_added',s=>{const v=s.val()||{};cb({topic,data:v.d,by:v.by||null,peer:v.peer,isMe:v.by===uid,sameTab:v.peer===PEER,kind:'viewer',guest:false});});return ()=>q.off('child_added',h);},
      emit(topic,data){if(topic!=='chat')return Promise.resolve();return fdb.ref('chat').push({by:uid,peer:PEER,d:data,t:TS}).then(()=>{}).catch(e=>{throw errOf(e);});},
      connected:()=>conn,
      onConnection(cb){connCbs.push(cb);setTimeout(()=>cb(conn),0);return ()=>{};},
      join:()=>Promise.reject({code:'not_permitted'}),
      canSendToClaudeSession:async()=>'off'};}

  window.claude={use:async name=>{await authP;await readyP;
    if(name==='db')return DB;if(name==='user')return USER;if(name==='room'){if(!ROOM)ROOM=makeRoom();return ROOM;}return null;}};
  window.__cloudKind='firebase';
})();
