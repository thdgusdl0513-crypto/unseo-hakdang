/* 💌 친구에게 편지 쓰기 (받는 친구가 나중에 들어와도 편지함에 남아 있어요) */
(function(){
const $q=s=>document.querySelector(s),$$q=s=>[...document.querySelectorAll(s)];
const PAPERS=[['hanji','📜 한지','#fbf3e2','#5a3a22'],['cherry','🌸 벚꽃','#fde8ee','#7a3a4a'],['night','🌙 밤하늘','#2a3358','#f3ead0'],['maple','🍁 단풍','#fbe6d0','#7a3a1a'],['mint','🌿 풀잎','#e6f3e6','#2f5a3a']];
const PM=Object.fromEntries(PAPERS.map(p=>[p[0],p]));
function myMb(){let m=LS.get('mb','');if(!/^[a-z0-9]{12}$/.test(m)){m=Array.from(crypto.getRandomValues(new Uint8Array(12)),x=>'abcdefghijklmnopqrstuvwxyz0123456789'[x%36]).join('');LS.set('mb',m);}return m;}
let INBOX=[],subMb='',offIn=null,tab='in',toMb='',paper='hanji',readMap=LS.get('lettersRead',{});
function publishMb(){if(!DB||MYID==='me')return;const m=myMb();const me=MEMBERS[MYID];if(!me||me.mb!==m){try{DB.doc('members/'+MYID).set({mb:m});}catch(e){}}}
function subscribe(){if(!DB||MYID==='me')return;const m=myMb();if(subMb===m)return;if(offIn)try{offIn();}catch(e){}subMb=m;
  publishMb();setTimeout(()=>{offIn=DB.collection('letters/'+m).orderBy('ts','desc').limit(100).onSnapshot(s=>{const old=new Set(INBOX.map(x=>x.id));const first=!subscribe.got;subscribe.got=true;INBOX=s.docs.map(d=>Object.assign({id:d.id},d.data())).sort((a,b)=>(b.ts||0)-(a.ts||0));
    const nw=INBOX.filter(x=>!old.has(x.id)&&!readMap[x.id]);if(first&&unread())toast(`📬 읽지 않은 편지가 ${unread()}통 있어요<small>메뉴의 💌 편지함에서 읽어요</small>`);if(!first&&nw.length)toast(`💌 ${esc(nw[0].from||'친구')}님에게서 편지가 왔어요<small>메뉴의 💌 편지함에서 읽어요</small>`);badge();if($q('#letters').classList.contains('show'))render();},()=>{});},900);}
setInterval(()=>{try{if(typeof DB!=='undefined'&&DB&&MODE==='shared'&&MYID!=='me'){subscribe();publishMb();}}catch(e){}},2500);
function unread(){return INBOX.filter(x=>!readMap[x.id]).length;}
function badge(){const n=unread();const t=$q('#ltTile');if(t){let b=t.querySelector('.ltB');if(!b){b=document.createElement('em');b.className='ltB';t.appendChild(b);}b.textContent=n||'';b.style.display=n?'':'none';}
  const mb=$q('#menuBtn')||document.querySelector('[data-open="menu"]');if(mb)mb.classList.toggle('ltDot',n>0);}
function friends(){const me=(ST.nick||'').trim().toLowerCase();const by={};Object.entries(MEMBERS||{}).forEach(([id,m])=>{if(!m||!m.mb||typeof m.nick!=='string'||!m.nick.trim()||id===MYID)return;const k=m.nick.trim().toLowerCase();if(k===me)return;if(!by[k]||(m.ts||0)>(by[k].ts||0))by[k]={nick:m.nick.trim(),mb:m.mb,ts:m.ts||0,av:m.av};});return Object.values(by).sort((a,b)=>a.nick.localeCompare(b.nick,'ko'));}
const when=ts=>{const d=new Date(ts||0);return `${d.getMonth()+1}/${d.getDate()} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;};
function letterHTML(x,open){const P=PM[x.paper]||PM.hanji;return `<div class="ltCard${open?' open':''}${!open&&!readMap[x.id]&&x.from?' new':''}" style="--bg:${P[2]};--ink:${P[3]}" ${x.id&&!open?`data-ltopen="${esc(x.id)}"`:''}>
  <div class="ltTo">${x.from?`From. <b>${esc(x.from)}</b>`:`To. <b>${esc(x.to||'')}</b>`}<span>${when(x.ts)}</span></div>
  <div class="ltBody">${open?esc(x.t||'').replace(/\n/g,'<br>'):esc((x.t||'').slice(0,40))+((x.t||'').length>40?'…':'')}</div>
  ${open&&x.from?`<div class="ltSign">— ${esc(x.from)}</div>`:''}</div>`;}
function render(){const el=$q('#ltBody');if(!el)return;$$q('#ltTabs button').forEach(b=>b.classList.toggle('on',b.dataset.lt===tab));
  if(!DB||MODE!=='shared'){el.innerHTML='<div class="empty">친구들과 함께 쓰는 학당에서 편지를 주고받을 수 있어요.</div>';return;}
  if(tab==='in'){el.innerHTML=INBOX.length?INBOX.map(x=>letterHTML(x,false)).join(''):'<div class="empty" style="padding:24px 0">아직 받은 편지가 없어요 📭<br><small>먼저 친구에게 편지를 써 볼까요?</small></div>';return;}
  if(tab==='sent'){const S=LS.get('lettersSent',[]);el.innerHTML=S.length?S.map(x=>letterHTML(x,false).replace('data-ltopen','data-ltsent')).join(''):'<div class="empty" style="padding:24px 0">아직 보낸 편지가 없어요 ✉️</div>';return;}
  const F=friends();const keep=($q('#ltText')||{}).value||'';
  el.innerHTML=`<div class="ltLbl">받는 친구</div>${F.length?`<input id="ltSearch" placeholder="🔍 친구 이름 찾기" autocomplete="off"><div class="ltFr">${F.map(f=>`<button data-ltto="${esc(f.mb)}" data-nk="${esc(f.nick)}" class="${toMb===f.mb?'on':''}">${esc(f.nick)}</button>`).join('')}</div>`:'<div class="empty">편지를 받을 수 있는 친구가 아직 없어요. 친구가 학당에 한 번 들어오면 여기에 보여요.</div>'}
  <div class="ltLbl">편지지</div><div class="ltPp">${PAPERS.map(p=>`<button data-ltpp="${p[0]}" class="${paper===p[0]?'on':''}" style="background:${p[2]};color:${p[3]}">${p[1]}</button>`).join('')}</div>
  <div class="ltCard open" style="--bg:${PM[paper][2]};--ink:${PM[paper][3]}"><div class="ltTo">To. <b id="ltToNk">${esc((F.find(f=>f.mb===toMb)||{}).nick||'친구를 골라 주세요')}</b></div><textarea id="ltText" maxlength="500" rows="7" placeholder="하고 싶은 말을 꾹꾹 눌러 써요 ✍️">${esc(keep)}</textarea><div class="ltSign">— ${esc(ST.nick||'')}</div></div>
  <button class="primary" id="ltSend" style="width:100%;margin-top:10px">💌 편지 보내기</button><div class="empty" id="ltMsg" style="margin-top:6px"></div>`;}
function openLetter(x,sent){const el=$q('#ltBody');if(!sent&&!readMap[x.id]){readMap[x.id]=1;LS.set('lettersRead',readMap);badge();}
  el.innerHTML=`<button class="ghost" id="ltBack" style="margin-bottom:8px">‹ 목록으로</button>${letterHTML(x,true)}${sent?'':`<div style="display:flex;gap:8px;margin-top:10px"><button class="primary" data-ltreply="${esc(x.id)}" style="flex:1">↩️ 답장 쓰기</button><button class="ghost" data-ltdel="${esc(x.id)}">🗑 버리기</button></div>`}`;}
async function send(){const t=($q('#ltText')||{}).value||'';const msg=$q('#ltMsg');const txt=t.trim();
  if(!toMb){msg.textContent='받는 친구를 골라 주세요';return;}if(!txt){msg.textContent='편지 내용을 써 주세요';return;}
  if(typeof badBlock==='function'&&badBlock(txt)){msg.textContent='고운 말로 다시 써 주세요 🙂';return;}
  const toNk=($q('#ltToNk')||{}).textContent||'';const o={by:MYID,from:(ST.nick||'').slice(0,12),to:toNk.slice(0,12),t:txt.slice(0,500),paper,ts:Date.now()};
  const b=$q('#ltSend');b.disabled=true;b.textContent='보내는 중…';
  try{await DB.collection('letters/'+toMb).add(o);const S=LS.get('lettersSent',[]);S.unshift(Object.assign({id:'s'+Date.now()},o));LS.set('lettersSent',S.slice(0,60));$q('#ltText').value='';toast(`💌 ${esc(toNk)}님에게 편지를 보냈어요`);try{chime();}catch(e){}tab='sent';render();}
  catch(e){b.disabled=false;b.textContent='💌 편지 보내기';msg.textContent='보내지 못했어요. Firebase 규칙을 새로 붙여 넣었는지 확인해 주세요.';}}
/* ---------- 화면 ---------- */
const st=document.createElement('style');st.textContent=`#ltTabs{display:flex;gap:6px;margin:4px 0 10px}#ltTabs button{flex:1;font:inherit;font-size:14px;border:1px solid #e2cfb4;background:#fffaf2;border-radius:12px;padding:8px 4px;cursor:pointer}#ltTabs button.on{background:#d98a4a;color:#fff;border-color:#d98a4a}
.ltCard{background:var(--bg);color:var(--ink);border-radius:14px;padding:12px 14px;margin:8px 0;box-shadow:0 3px 10px rgba(0,0,0,.12);cursor:pointer;position:relative;background-image:repeating-linear-gradient(transparent 0 27px,rgba(0,0,0,.06) 27px 28px)}.ltCard.open{cursor:default}.ltCard.new:after{content:'NEW';position:absolute;top:8px;right:10px;font-size:10px;font-weight:800;background:#e8443a;color:#fff;border-radius:6px;padding:1px 6px}
.ltTo{font-size:13px;display:flex;justify-content:space-between;gap:8px;opacity:.9}.ltTo span{font-size:11px;opacity:.7;margin-right:34px}.ltCard.open .ltTo span{margin-right:0}.ltBody{margin-top:6px;font-size:15px;line-height:28px;word-break:break-all;font-family:'Gowun Dodum','Gowun Dodum',serif}.ltSign{text-align:right;font-size:13px;margin-top:4px;opacity:.85}
.ltCard textarea{width:100%;box-sizing:border-box;margin-top:6px;border:0;background:transparent;color:inherit;font:15px/28px 'Gowun Dodum','Gowun Dodum',serif;resize:vertical;outline:none}.ltCard textarea::placeholder{color:inherit;opacity:.5}
.ltLbl{font-size:13px;font-weight:700;margin:10px 0 5px}.ltFr{display:flex;flex-wrap:wrap;gap:6px;max-height:120px;overflow:auto}.ltFr button,.ltPp button{font:inherit;font-size:13.5px;border:1px solid #e2cfb4;background:#fffaf2;border-radius:999px;padding:6px 11px;cursor:pointer}.ltFr button.on{background:#d98a4a;color:#fff;border-color:#d98a4a}.ltPp{display:flex;gap:6px;flex-wrap:wrap}.ltPp button.on{outline:3px solid #d98a4a}
#ltSearch{width:100%;box-sizing:border-box;margin-bottom:6px}#ltTile{position:relative}.ltB{position:absolute;top:4px;right:6px;background:#e8443a;color:#fff;font-style:normal;font-size:11px;font-weight:800;border-radius:9px;min-width:18px;height:18px;line-height:18px;text-align:center;padding:0 4px}
.ltDot{position:relative}.ltDot:after{content:'';position:absolute;top:2px;right:2px;width:10px;height:10px;border-radius:50%;background:#e8443a;border:2px solid #fff}`;document.head.appendChild(st);
const md=document.createElement('div');md.id='letters';md.className='modal';md.innerHTML=`<div class="sheet paper"><div class="grip"></div><div class="sh"><button class="back" data-back>‹ 설정</button><span>💌 편지함</span><button class="x" data-close>×</button></div>
  <div id="ltTabs"><button data-lt="in">📬 받은 편지</button><button data-lt="write">✍️ 편지 쓰기</button><button data-lt="sent">📤 보낸 편지</button></div><div id="ltBody"></div></div>`;document.body.appendChild(md);
md.addEventListener('click',e=>{if(e.target===md||e.target.closest('[data-close]')){closeSheets();return;}if(e.target.closest('[data-back]')){openSheet('menu');return;}
  const tb=e.target.closest('[data-lt]');if(tb){tab=tb.dataset.lt;render();return;}
  const op=e.target.closest('[data-ltopen]');if(op){const x=INBOX.find(y=>y.id===op.dataset.ltopen);if(x)openLetter(x,false);return;}
  const os=e.target.closest('[data-ltsent]');if(os){const x=LS.get('lettersSent',[]).find(y=>y.id===os.dataset.ltsent);if(x)openLetter(x,true);return;}
  if(e.target.closest('#ltBack')){render();return;}
  const to=e.target.closest('[data-ltto]');if(to){toMb=to.dataset.ltto;$$q('.ltFr button').forEach(b=>b.classList.toggle('on',b===to));const n=$q('#ltToNk');if(n)n.textContent=to.dataset.nk;return;}
  const pp=e.target.closest('[data-ltpp]');if(pp){paper=pp.dataset.ltpp;render();return;}
  if(e.target.closest('#ltSend')){send();return;}
  const rp=e.target.closest('[data-ltreply]');if(rp){const x=INBOX.find(y=>y.id===rp.dataset.ltreply);const f=x&&friends().find(f=>f.nick.toLowerCase()===String(x.from||'').toLowerCase());toMb=f?f.mb:'';tab='write';render();if(!f)$q('#ltMsg').textContent='이 친구에게는 지금 답장을 보낼 수 없어요';return;}
  const dl=e.target.closest('[data-ltdel]');if(dl){if(!confirm('이 편지를 버릴까요?'))return;DB.collection('letters/'+myMb()).doc(dl.dataset.ltdel).delete().then(()=>{tab='in';render();}).catch(()=>toast('버리지 못했어요'));}});
md.addEventListener('input',e=>{if(e.target.id==='ltSearch'){const q=e.target.value.trim().toLowerCase();$$q('.ltFr button').forEach(b=>b.style.display=!q||b.dataset.nk.toLowerCase().includes(q)?'':'none');}});
const grid=$q('#menuGrid');if(grid){const b=document.createElement('button');b.dataset.open='letters';b.id='ltTile';b.innerHTML='<span>💌</span>편지함';grid.appendChild(b);b.addEventListener('click',()=>{tab=unread()?'in':tab;openSheet('letters');render();});}
window.__openLetters=()=>{openSheet('letters');render();};
})();
