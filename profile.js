/* 내 캐릭터 지키기 · 나만 아는 코드(학생) / 선생님 코드(선생님)로 어느 기기에서든 같은 캐릭터 */
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
  if(p.pet){const pet=cleanPetSelection(p.pet);ST.pet=pet;LS.set('pet',pet);try{setPet(pet,true);}catch(e){}}
  if(p.av){const avatar=cleanAvatarSelection(p.av);ST.avatar=avatar;LS.set('avatar',avatar);}
  if(p.fx){ST.fx=p.fx;LS.set('fx',p.fx);}
  if(p.ex&&typeof p.ex==='object')KEYS.forEach(k=>{if(p.ex[k]!=null)LS.set(k,p.ex[k]);});
  try{setAvatar(ST.avatar||'girl');}catch(e){}try{saveMember();}catch(e){}try{pushPresence(true);updateMe();}catch(e){}}
function markPw(){try{if(DB&&MYID!=='me')DB.doc('members/'+MYID).set({pw:1});}catch(e){}}
async function loadProfile(k){if(!DB)return null;try{const d=await DB.doc('profiles/'+k).get();return d&&d.exists?d.data():null;}catch(e){return null;}}
/* 캐릭터가 바뀔 때마다 함께 저장 */
const _sm=saveMember;saveMember=function(){const r=_sm.apply(this,arguments);saveProfile(false);return r;};
setInterval(()=>{if(window.__entered)saveProfile(false);},60000);
window.addEventListener('pagehide',()=>{try{saveProfile(true);}catch(e){}});

/* ---------- 첫 화면: [코드 입력] / [새 캐릭터 만들기] ---------- */
const codeKeyOf=code=>sha('hakdang-code|'+(window.CLOUD_BASE||'')+'|'+String(code).trim());
const intro=$q('#intro'),card=$q('#stepNick');
let chose=false;
if(intro&&card){
  const st=document.createElement('style');st.textContent=`#stepChoose .bigBtn{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:14px 16px;margin-top:10px;border-radius:16px;font:inherit;font-size:16px;cursor:pointer;border:1.5px solid rgba(140,96,60,.3);background:rgba(255,255,255,.7)}#stepChoose .bigBtn b{display:block;font-size:17px}#stepChoose .bigBtn small{display:block;font-size:12.5px;opacity:.75;margin-top:2px}#stepChoose .bigBtn i{font-style:normal;font-size:30px}#stepChoose .bigBtn.new{background:#d98a4a;color:#fff;border-color:#d98a4a}
.backLink{display:block;text-align:left;background:none;border:0;font:inherit;font-size:13px;opacity:.75;cursor:pointer;padding:0;margin-bottom:6px}#codeIn{letter-spacing:.12em}`;document.head.appendChild(st);
  const ch=document.createElement('div');ch.className='card paper';ch.id='stepChoose';ch.hidden=true;
  ch.innerHTML=`<h3>어서 와요! 🌱</h3><label>어떻게 들어갈까요?</label>
    <button type="button" class="bigBtn" id="chCode"><i>🔑</i><span><b>코드 입력하기</b><small>이미 캐릭터가 있어요 · 처음 만들 때 정한 코드로 불러와요</small></span></button>
    <button type="button" class="bigBtn new" id="chNew"><i>✨</i><span><b>새 캐릭터 만들기</b><small>처음 왔어요 · 닉네임과 나만 아는 코드를 정해요</small></span></button>`;
  const cd=document.createElement('div');cd.className='card paper';cd.id='stepCode';cd.hidden=true;
  cd.innerHTML=`<button type="button" class="backLink" data-back-choose>‹ 뒤로</button><h3>🔑 코드 입력하기</h3>
    <label>새 캐릭터를 만들 때 정한 코드</label><input id="codeIn" type="password" maxlength="20" autocomplete="off" placeholder="내 코드">
    <label style="display:flex;align-items:center;gap:6px;font-size:13px;margin-top:6px"><input type="checkbox" id="codeShow" style="width:auto"> 코드 보이기</label>
    <details style="margin-top:6px;font-size:13px"><summary style="cursor:pointer;opacity:.8">예전에 ‘닉네임 + 비밀번호’로 만들었어요</summary><input id="codeNick" maxlength="12" placeholder="그때 쓴 닉네임" style="margin-top:6px"></details>
    <div class="msg" id="codeMsg"></div><button class="primary" id="codeGo" style="margin-top:8px">내 캐릭터로 들어가기</button>`;
  card.parentNode.insertBefore(ch,card);card.parentNode.insertBefore(cd,card);
  const back=document.createElement('button');back.type='button';back.className='backLink';back.setAttribute('data-back-choose','');back.textContent='‹ 뒤로';card.insertBefore(back,card.firstChild);
  const only=id=>['stepChoose','stepCode','stepNick','stepIn','stepPw'].forEach(s=>{const e=$q('#'+s);if(e)e.hidden=s!==id;});
  /* 앱이 ‘처음 오셨군요’ 화면을 열면 먼저 두 갈래 선택 화면을 보여 줘요 */
  new MutationObserver(()=>{if(!card.hidden&&!chose){only('stepChoose');}}).observe(card,{attributes:true,attributeFilter:['hidden']});
  if(!card.hidden&&!chose)only('stepChoose');
  intro.addEventListener('click',e=>{if(e.target.closest('[data-back-choose]')){chose=false;only('stepChoose');return;}
    if(e.target.closest('#chNew')){chose=true;try{renderAvatars();}catch(_){}only('stepNick');setTimeout(()=>{const n=$q('#nickIn');if(n)n.focus();},100);return;}
    if(e.target.closest('#chCode')){only('stepCode');setTimeout(()=>$q('#codeIn').focus(),100);return;}});
  $q('#codeShow').addEventListener('change',e=>{$q('#codeIn').type=e.target.checked?'text':'password';});
  /* 새 캐릭터: 닉네임 아래에 ‘나만 아는 코드’ */
  const box=document.createElement('div');box.innerHTML=`<label>🔑 나만 아는 코드 <small style="opacity:.7">(4자 이상 · 다른 기기에서는 이 코드만 넣으면 내 캐릭터가 나와요)</small></label><input id="nickPw" type="text" maxlength="20" autocomplete="off" placeholder="예: haneul0412">
    <div class="msg" style="font-size:12px;opacity:.8;margin-top:2px">친구가 맞히기 어려운 코드로 정하고 꼭 기억해요. 선생님도 찾아 줄 수 없어요.</div>`;
  const ni=$q('#nickIn');ni.parentNode.insertBefore(box,ni.nextSibling);
  const go=$q('#nickGo');
  card.addEventListener('click',async e=>{if(!e.target.closest('#nickGo'))return;if(go.dataset.ok==='1'){go.dataset.ok='';return;}e.stopImmediatePropagation();e.stopPropagation();e.preventDefault();
    const nick=$q('#nickIn').value.trim().slice(0,12),code=$q('#nickPw').value.trim();const msg=$q('#nickMsg');
    if(!nick){msg.textContent='닉네임을 적어 주세요.';return;}if(code.length<4){msg.textContent='나만 아는 코드를 4자 이상 정해 주세요.';$q('#nickPw').focus();return;}
    if(window.BadWords&&BadWords.check(nick)){msg.textContent='고운 말로 된 닉네임을 써 주세요 🙂';return;}
    if(!DB||MYID==='me'){msg.textContent='학당에 연결하는 중이에요. 잠시 뒤 다시 눌러 주세요.';return;}
    go.disabled=true;go.textContent='확인 중…';const k=await codeKeyOf(code);const p=await loadProfile(k);go.disabled=false;go.textContent='입학하기';
    if(p){msg.textContent='이미 누군가 쓰고 있는 코드예요. 다른 코드를 정해 주세요. (내 코드라면 뒤로 가서 ‘코드 입력하기’를 눌러요)';$q('#nickPw').select();return;}
    const taken=Object.entries(MEMBERS||{}).some(([id,m])=>id!==MYID&&m&&m.pw&&typeof m.nick==='string'&&m.nick.trim().toLowerCase()===nick.toLowerCase());
    if(taken){msg.textContent='이미 다른 친구가 쓰는 닉네임이에요. 내 캐릭터라면 뒤로 가서 ‘코드 입력하기’로 들어와요.';$q('#nickIn').select();return;}
    LS.set('pkey',k);LS.set('pkeyT',0);go.dataset.ok='1';go.click();await saveProfile(true);markPw();
    const ws=$q('#welcomeSub');if(ws)ws.innerHTML=`내 코드는 <b>${esc(code)}</b> 예요. 다른 기기에서는 ‘코드 입력하기’에 이 코드를 넣어요.`;},true);
  /* 코드로 들어가기 */
  async function codeLogin(){const code=$q('#codeIn').value.trim(),nick=($q('#codeNick')||{}).value?$q('#codeNick').value.trim():'';const msg=$q('#codeMsg'),b=$q('#codeGo');
    if(code.length<4){msg.textContent='코드를 4자 이상 넣어 주세요.';return;}
    if(!DB||MYID==='me'){msg.textContent='학당에 연결하는 중이에요. 잠시 뒤 다시 눌러 주세요.';return;}
    b.disabled=true;b.textContent='찾는 중…';msg.textContent='';
    try{let k=await codeKeyOf(code),p=await loadProfile(k);
      if(!p&&nick){const k2=await keyOf(nick,code);const p2=await loadProfile(k2);if(p2){p=p2;try{await DB.doc('profiles/'+k).set(p2);}catch(_){k=k2;}}}
      if(p){LS.set('pkey',k);LS.set('pkeyT',0);applyProfile(p);markPw();chose=true;$q('#welcome').textContent=(ST.nick||'')+'님, 다시 오셨네요!';$q('#welcomeSub').textContent='저장해 둔 내 캐릭터를 불러왔어요 🎉';only('stepIn');return;}
      const t=await teacherIn(code,true);if(t){chose=true;only('stepIn');return;}
      msg.textContent='이 코드로 만든 캐릭터를 찾지 못했어요. 다시 확인하거나 ‘새 캐릭터 만들기’를 눌러요.';$q('#codeIn').select();}
    finally{b.disabled=false;b.textContent='내 캐릭터로 들어가기';}}
  $q('#codeGo').addEventListener('click',codeLogin);$q('#codeIn').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.isComposing)codeLogin();});
}
/* ---------- 선생님 코드 (코드 입력 칸에 선생님 코드를 넣어도 돼요) ---------- */
async function teacherIn(code,quiet){const ai=$q('#adminIn'),ag=$q('#adminGo');if(!ai||!ag){if(!quiet)toast('선생님 코드를 확인할 수 없어요');return false;}
  if(!DB||MYID==='me'){if(!quiet)toast('학당이 연결된 뒤 다시 눌러 주세요');return false;}
  window.__tcBusy=true;ai.value=code;ag.click();const t0=Date.now();
  while(Date.now()-t0<(quiet?4000:8000)&&!ADMIN_ON)await new Promise(r=>setTimeout(r,150));
  ai.value='';
  if(!ADMIN_ON){window.__tcBusy=false;if(!quiet)toast('❌ 선생님 코드가 맞지 않아요');return false;}
  const k=await tkeyOf(code);LS.set('pkey',k);LS.set('pkeyT',1);const p=await loadProfile(k);
  if(p){applyProfile(p);toast('🧑‍🏫 선생님 캐릭터를 불러왔어요');}
  else{if(!ST.nick){ST.nick='선생님';LS.set('nick',ST.nick);}if(!ST.avatar){ST.avatar='girl';LS.set('avatar','girl');}saveMember();await saveProfile(true);toast('🧑‍🏫 선생님 모드 · 지금 캐릭터를 저장했어요<small>다른 곳에서도 선생님 코드로 들어오면 이 캐릭터예요</small>');}
  const w=$q('#welcome');if(w)w.textContent=(ST.nick||'선생님')+'님, 어서 오세요!';const ws=$q('#welcomeSub');if(ws)ws.textContent='선생님 모드가 켜졌어요.';window.__tcBusy=false;return true;}
window.__teacherIn=teacherIn;
/* ‘다시 오셨네요’ 화면: 다른 코드로 들어가기 */
const sIn=$q('#stepIn');if(sIn&&!$q('#tcGo2')){const b=document.createElement('button');b.type='button';b.className='go2';b.id='tcGo2';b.textContent='🔑 다른 코드로 들어가기';b.style.marginTop='8px';sIn.appendChild(b);b.addEventListener('click',()=>{['stepChoose','stepNick','stepIn'].forEach(s=>{const e=$q('#'+s);if(e)e.hidden=true;});const c=$q('#stepCode');if(c){c.hidden=false;setTimeout(()=>$q('#codeIn').focus(),100);}});}
/* 설정의 관리자 코드로 켰을 때도 선생님 캐릭터 연결 */
const ag=$q('#adminGo');if(ag)ag.addEventListener('click',()=>{const code=($q('#adminIn')||{}).value||'';if(!code)return;const t0=Date.now();const iv=setInterval(async()=>{if(ADMIN_ON){clearInterval(iv);if(window.__tcBusy)return;if(!LS.get('pkey','')||LS.get('pkeyT',0)!==1){const k=await tkeyOf(code);LS.set('pkey',k);LS.set('pkeyT',1);const p=await loadProfile(k);if(p&&(!window.__entered||confirm('저장해 둔 선생님 캐릭터를 불러올까요?')))applyProfile(p);else saveProfile(true);}}else if(Date.now()-t0>8000)clearInterval(iv);},200);},true);
/* 설정 ‘닉네임·캐릭터’: 내 코드 정하기·바꾸기 */
window.__setMyPw=async function(){const code=(prompt('다른 기기에서 내 캐릭터를 불러올 코드를 정해요 (4자 이상)')||'').trim();if(!code)return;if(code.length<4){toast('4자 이상으로 정해 주세요');return;}
  if(!DB||MYID==='me'){toast('학당이 연결된 뒤 다시 해 주세요');return;}
  const k=await codeKeyOf(code);const p=await loadProfile(k);if(p&&LS.get('pkey','')!==k){toast('이미 누군가 쓰고 있는 코드예요<small>다른 코드로 정해 주세요</small>');return;}
  LS.set('pkey',k);LS.set('pkeyT',0);await saveProfile(true);markPw();toast('🔑 내 코드를 정했어요<small>다른 기기에서 ‘코드 입력하기’에 '+esc(code)+' 를 넣어요</small>');};
setTimeout(()=>{const ns=$q('#nickSave');if(ns&&!$q('#pwSet')){const b=document.createElement('button');b.type='button';b.className='ghost';b.id='pwSet';b.textContent='🔑 내 코드 정하기 · 바꾸기';b.style.cssText='width:100%;margin-top:8px';ns.parentNode.insertBefore(b,ns.nextSibling);b.addEventListener('click',()=>window.__setMyPw());}},500);
})();
