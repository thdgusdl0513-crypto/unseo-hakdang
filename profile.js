/* 내 캐릭터 지키기 · 닉네임+비밀번호(학생) / 선생님 코드(선생님)로 어느 기기에서든 같은 캐릭터 */
(function(){
const $q=s=>document.querySelector(s);
const KEYS=['mb','lettersRead','lettersSent','fishBook','coinSpent','snacks','giftsSeen','clockCol','stampPick','csMe'];
async function sha(t){const b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(t));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');}
const keyOf=(nick,pw)=>sha('hakdang|'+(window.CLOUD_BASE||'')+'|'+String(nick).trim().toLowerCase()+'|'+String(pw));
const tkeyOf=code=>sha('hakdang-teacher|'+(window.CLOUD_BASE||'')+'|'+String(code));
function snap(){const o={nick:ST.nick||'',av:ST.avatar||'girl',pet:ST.pet||'none',look:lookStr(ST.look),fx:ST.fx||'base',ts:Date.now(),ex:{}};KEYS.forEach(k=>{const v=LS.get(k,null);if(v!=null)o.ex[k]=v;});return o;}
let saveT=null;
async function saveProfile(now){const k=LS.get('pkey','');if(!k||!DB||MYID==='me')return;clearTimeout(saveT);const go=async()=>{try{await DB.doc('profiles/'+k).set(snap());}catch(e){}};if(now)await go();else saveT=setTimeout(go,1500);}
function applyProfile(p){if(!p)return;if(p.nick){ST.nick=String(p.nick).slice(0,12);LS.set('nick',ST.nick);}
  if(typeof p.look==='string'){ST.look=lookParse(p.look);LS.set('look',p.look);}
  if(p.pet&&PETMAP[p.pet]){ST.pet=p.pet;LS.set('pet',p.pet);try{setPet(p.pet,true);}catch(e){}}
  if(p.av&&AVMAP[p.av]){ST.avatar=p.av;LS.set('avatar',p.av);}
  if(p.fx){ST.fx=p.fx;LS.set('fx',p.fx);}
  if(p.ex&&typeof p.ex==='object')KEYS.forEach(k=>{if(p.ex[k]!=null)LS.set(k,p.ex[k]);});
  try{setAvatar(ST.avatar||'girl');}catch(e){}try{saveMember();}catch(e){}try{pushPresence(true);updateMe();}catch(e){}}
function markPw(){try{if(DB&&MYID!=='me')DB.doc('members/'+MYID).set({pw:1});}catch(e){}}
async function loadProfile(k){if(!DB)return null;try{const d=await DB.doc('profiles/'+k).get();return d&&d.exists?d.data():null;}catch(e){return null;}}
/* 캐릭터가 바뀔 때마다 함께 저장 */
const _sm=saveMember;saveMember=function(){const r=_sm.apply(this,arguments);saveProfile(false);return r;};
setInterval(()=>{if(window.__entered)saveProfile(false);},60000);
window.addEventListener('pagehide',()=>{try{saveProfile(true);}catch(e){}});

/* ---------- 입학 화면: 비밀번호 칸 ---------- */
const card=$q('#stepNick');if(card){const go=$q('#nickGo');
  const box=document.createElement('div');box.innerHTML=`<label>🔒 나만 아는 비밀번호 <small style="opacity:.7">(4자 이상 · 다른 기기에서 내 캐릭터를 불러올 때 써요)</small></label><input id="nickPw" type="password" maxlength="20" autocomplete="off" placeholder="예: 숫자 4자리">
    <div class="msg" style="font-size:12px;opacity:.8;margin-top:2px">이미 캐릭터가 있다면 <b>같은 닉네임 + 비밀번호</b>를 넣으면 그대로 불러와요.</div>`;
  const ni=$q('#nickIn');ni.parentNode.insertBefore(box,ni.nextSibling);
  const tb=document.createElement('button');tb.type='button';tb.className='go2';tb.id='tcGo';tb.textContent='🧑‍🏫 선생님 코드로 들어가기';tb.style.marginTop='8px';card.appendChild(tb);
  card.addEventListener('click',async e=>{if(!e.target.closest('#nickGo'))return;if(go.dataset.ok==='1'){go.dataset.ok='';return;}e.stopImmediatePropagation();e.stopPropagation();e.preventDefault();
    const nick=$q('#nickIn').value.trim().slice(0,12),pw=$q('#nickPw').value;const msg=$q('#nickMsg');
    if(!nick){msg.textContent='닉네임을 적어 주세요.';return;}if(String(pw).length<4){msg.textContent='비밀번호를 4자 이상 정해 주세요. (내 캐릭터를 지켜 줘요)';$q('#nickPw').focus();return;}
    if(window.BadWords&&BadWords.check(nick)){msg.textContent='고운 말로 된 닉네임을 써 주세요 🙂';return;}
    go.disabled=true;go.textContent='확인 중…';const k=await keyOf(nick,pw);LS.set('pkey',k);const p=await loadProfile(k);go.disabled=false;go.textContent='입학하기';
    if(p){applyProfile(p);markPw();$q('#welcome').textContent=(ST.nick||nick)+'님, 다시 오셨네요!';$q('#welcomeSub').textContent='저장해 둔 내 캐릭터를 불러왔어요 🎉';show('stepIn');return;}
    const taken=Object.entries(MEMBERS||{}).some(([id,m])=>id!==MYID&&m&&m.pw&&typeof m.nick==='string'&&m.nick.trim().toLowerCase()===nick.toLowerCase());
    if(taken){msg.textContent='이미 다른 친구가 쓰는 닉네임이에요. 내 캐릭터라면 비밀번호를 다시 확인해 주세요.';$q('#nickPw').select();return;}
    go.dataset.ok='1';go.click();await saveProfile(true);markPw();},true);
  tb.addEventListener('click',()=>{const c=prompt('선생님 코드를 넣어 주세요');if(c)teacherIn(c.trim());});}
/* ---------- 선생님 코드 ---------- */
async function teacherIn(code){const ai=$q('#adminIn'),ag=$q('#adminGo');if(!ai||!ag){toast('선생님 코드를 확인할 수 없어요');return;}
  if(!DB||MYID==='me'){toast('학당이 연결된 뒤 다시 눌러 주세요');return;}
  window.__tcBusy=true;ai.value=code;ag.click();const t0=Date.now();while(Date.now()-t0<6000&&!ADMIN_ON&&ag.disabled!==true)await new Promise(r=>setTimeout(r,150));
  while(Date.now()-t0<8000&&!ADMIN_ON)await new Promise(r=>setTimeout(r,150));
  if(!ADMIN_ON){window.__tcBusy=false;toast('❌ 선생님 코드가 맞지 않아요');return;}
  const k=await tkeyOf(code);LS.set('pkey',k);LS.set('pkeyT',1);const p=await loadProfile(k);
  if(p){applyProfile(p);toast('🧑‍🏫 선생님 캐릭터를 불러왔어요');}
  else{if(!ST.nick){ST.nick='선생님';LS.set('nick',ST.nick);}if(!ST.avatar){ST.avatar='girl';LS.set('avatar','girl');}saveMember();await saveProfile(true);toast('🧑‍🏫 선생님 모드 · 지금 캐릭터를 저장했어요<small>다른 곳에서도 선생님 코드로 들어오면 이 캐릭터예요</small>');}
  const w=$q('#welcome');if(w)w.textContent=(ST.nick||'선생님')+'님, 어서 오세요!';const ws=$q('#welcomeSub');if(ws)ws.textContent='선생님 모드가 켜졌어요.';if($q('#intro'))show('stepIn');window.__tcBusy=false;}
window.__teacherIn=teacherIn;
/* 이미 들어와 있는 화면(다시 오셨네요)에도 선생님 코드 버튼 */
const sIn=$q('#stepIn');if(sIn&&!$q('#tcGo2')){const b=document.createElement('button');b.type='button';b.className='go2';b.id='tcGo2';b.textContent='🧑‍🏫 선생님 코드로 내 캐릭터 불러오기';b.style.marginTop='8px';sIn.appendChild(b);b.addEventListener('click',()=>{const c=prompt('선생님 코드를 넣어 주세요');if(c)teacherIn(c.trim());});}
/* 설정의 관리자 코드로 켰을 때도 선생님 캐릭터 연결 */
const ag=$q('#adminGo');if(ag)ag.addEventListener('click',()=>{const code=($q('#adminIn')||{}).value||'';if(!code)return;const t0=Date.now();const iv=setInterval(async()=>{if(ADMIN_ON){clearInterval(iv);if(window.__tcBusy)return;if(!LS.get('pkey','')||LS.get('pkeyT',0)!==1){const k=await tkeyOf(code);LS.set('pkey',k);LS.set('pkeyT',1);const p=await loadProfile(k);if(p&&(!window.__entered||confirm('저장해 둔 선생님 캐릭터를 불러올까요?')))applyProfile(p);else saveProfile(true);}}else if(Date.now()-t0>8000)clearInterval(iv);},200);},true);
/* 설정 '닉네임·캐릭터'에 비밀번호 정하기 (예전부터 쓰던 학생용) */
window.__setMyPw=async function(){const pw=prompt('다른 기기에서 내 캐릭터를 불러올 비밀번호를 정해요 (4자 이상)');if(!pw)return;if(pw.length<4){toast('4자 이상으로 정해 주세요');return;}const k=await keyOf(ST.nick||'',pw);LS.set('pkey',k);await saveProfile(true);markPw();toast('🔒 비밀번호를 정했어요<small>다른 기기에서 “'+esc(ST.nick||'')+'” + 비밀번호로 불러올 수 있어요</small>');};
setTimeout(()=>{const ns=$q('#nickSave');if(ns&&!$q('#pwSet')){const b=document.createElement('button');b.type='button';b.className='ghost';b.id='pwSet';b.textContent='🔒 내 캐릭터 비밀번호 정하기';b.style.cssText='width:100%;margin-top:8px';ns.parentNode.insertBefore(b,ns.nextSibling);b.addEventListener('click',()=>window.__setMyPw());}},500);
})();
