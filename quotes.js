/* ====================== 📜 오늘의 문장 ====================== */
(function(){
const q$=s=>document.querySelector(s);
const qe=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const dayKey=(t=Date.now())=>{const d=new Date(t);return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');};
const dayLabel=k=>{const [y,m,d]=k.split('-').map(Number);const w='일월화수목금토'[new Date(y,m-1,d).getDay()];return k===dayKey()?'오늘':k===dayKey(Date.now()-864e5)?'어제':`${m}월 ${d}일 (${w})`;};
let tab='today',draftBook=null;
const Q=()=>(typeof DATA==='object'&&DATA.quotes)||[];
const mine=()=>Q().filter(q=>q.by===MYID);
const isOpen=()=>{const el=q$('#quotes');return el&&el.classList.contains('show');};
const likeN=id=>{try{return Object.keys(LIKES[id]||{}).length;}catch(e){return 0;}};
const liked=id=>{try{return !!(LIKES[id]&&LIKES[id][MYID]);}catch(e){return false;}};
function bookList(){const s=new Set();try{(DATA.books||[]).filter(b=>b.by===MYID).forEach(b=>s.add(b.title));(DATA.logs||[]).filter(l=>l.by===MYID&&l.book).forEach(l=>s.add(l.book));mine().forEach(q=>q.book&&s.add(q.book));}catch(e){}const lb=LS.get('lastBook','');if(lb)s.add(lb);return [...s].filter(Boolean).slice(0,30);}
function card(q,opt={}){const me=q.by===MYID;const n=likeN(q.id);
  return `<div class="qCard ${me?'mine':''}"><div class="qSeal">文</div><p class="qText">${qe(q.text)}</p>
  ${q.book?`<div class="qBook">— 『${qe(q.book)}』${q.page?` ${qe(q.page)}쪽`:''}</div>`:''}
  ${q.note?`<div class="qNote">💭 ${qe(q.note)}</div>`:''}
  <div class="qFoot"><b>${qe(me?(ST.nick||'나'):nameOf(q.by))}</b><small>${opt.date?dayLabel(q.day||dayKey(q.ts))+' · ':''}${ago(q.ts)}</small>
  <span class="qAct"><button class="qLike ${liked(q.id)?'on':''}" data-qlike="${qe(q.id)}">${liked(q.id)?'❤️':'🤍'}${n?` ${n}`:''}</button><button data-qimg="${qe(q.id)}" title="카드로 저장">🖼️</button>${me||(typeof ADMIN_ON!=='undefined'&&ADMIN_ON)?`<button data-qdel="${qe(q.id)}" title="지우기">×</button>`:''}</span></div></div>`;}
function form(){const books=bookList();const b=draftBook!=null?draftBook:(LS.get('lastBook','')||'');
  return `<div class="qForm"><div class="qFormH">🖋️ 책에서 마음에 남은 문장을 옮겨 적어요</div>
  <div class="qRow"><input id="qBook" list="qBooks" maxlength="60" placeholder="책 제목" value="${qe(b)}"><input id="qPage" inputmode="numeric" maxlength="5" placeholder="쪽"></div>
  <datalist id="qBooks">${books.map(t=>`<option value="${qe(t)}">`).join('')}</datalist>
  <textarea id="qText" maxlength="300" rows="4" placeholder="오늘의 문장 (300자까지)"></textarea>
  <textarea id="qNote" maxlength="200" rows="2" placeholder="이 문장이 왜 좋았나요? (선택)"></textarea>
  <button class="primary" id="qSave">📜 오늘의 문장 남기기</button></div>`;}
function render(){const el=q$('#qBody');if(!el)return;
  q$$('#qTabs button').forEach(b=>b.classList.toggle('on',b.dataset.qt===tab));
  const today=dayKey();
  if(tab==='today'){const my=mine().filter(q=>(q.day||dayKey(q.ts))===today);const others=Q().filter(q=>q.by!==MYID&&(q.day||dayKey(q.ts))===today);
    el.innerHTML=(my.length?`<div class="qSec">나의 오늘의 문장</div>${my.map(q=>card(q)).join('')}<details class="qMore"><summary>＋ 한 문장 더 남기기</summary>${form()}</details>`:form())
      +`<div class="qSec">오늘 친구들의 문장 <small>${others.length}개</small></div>${others.length?others.map(q=>card(q)).join(''):`<div class="empty">${MODE==='shared'?'아직 오늘 문장을 남긴 친구가 없어요.<br>먼저 남겨 볼까요?':'혼자 모드에서는 내 문장만 보여요.'}</div>`}`;}
  else if(tab==='mine'){const L=mine();const days=[...new Set(L.map(q=>q.day||dayKey(q.ts)))];
    let streak=0;{const d=new Date();while(L.some(q=>(q.day||dayKey(q.ts))===dayKey(d.getTime()))){streak++;d.setDate(d.getDate()-1);}}
    el.innerHTML=`<div class="stats"><div><small>모은 문장</small><b>${L.length}</b>개</div><div><small>쓴 날</small><b>${days.length}</b>일</div><div><small>연속</small><b>${streak}</b>일</div></div>`
      +(L.length?days.map(k=>`<div class="qSec">${dayLabel(k)}</div>${L.filter(q=>(q.day||dayKey(q.ts))===k).map(q=>card(q)).join('')}`).join(''):'<div class="empty">아직 남긴 문장이 없어요.<br>책을 읽고 마음에 남은 한 문장을 적어 보세요.</div>');}
  else{const L=Q().slice(0,80);const sort=L.slice().sort((a,b)=>likeN(b.id)-likeN(a.id)||b.ts-a.ts);const top=sort.filter(q=>likeN(q.id)>0).slice(0,3);
    el.innerHTML=(top.length?`<div class="qSec">❤️ 공감을 많이 받은 문장</div>${top.map(q=>card(q,{date:1})).join('')}`:'')+`<div class="qSec">모두의 문장 <small>최근 ${L.length}개</small></div>${L.length?L.map(q=>card(q,{date:1})).join(''):'<div class="empty">아직 남겨진 문장이 없어요.</div>'}`;}}
function q$$(s){return [...document.querySelectorAll(s)];}
async function save(){const text=(q$('#qText')||{}).value||'';const t=text.trim();if(!t){toast('문장을 적어 주세요');q$('#qText').focus();return;}
  const book=(q$('#qBook').value||'').trim().slice(0,60);const page=(q$('#qPage').value||'').replace(/[^0-9\-~]/g,'').slice(0,5);const note=(q$('#qNote').value||'').trim().slice(0,200);
  if(book)LS.set('lastBook',book);const ok=await addDoc('quotes',{text:t.slice(0,300),book,page,note,day:dayKey()});
  if(ok){draftBook=null;toast('📜 오늘의 문장을 남겼어요');try{chime();}catch(e){}try{if(typeof doEmote==='function')doEmote('heart');}catch(e){}render();}}
/* 카드 이미지 */
function wrap(ctx,text,maxW){const out=[];String(text).split('\n').forEach(par=>{let line='';for(const ch of par){const t=line+ch;if(ctx.measureText(t).width>maxW&&line){out.push(line);line=ch;}else line=t;}out.push(line);});return out;}
async function cardImage(q){const W=1080,H=1350;const c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#fbf4e4');g.addColorStop(1,'#f1e2c2');x.fillStyle=g;x.fillRect(0,0,W,H);
  x.fillStyle='rgba(140,96,60,.06)';for(let i=0;i<500;i++){x.fillRect(Math.random()*W,Math.random()*H,2,2);}
  x.strokeStyle='#b0874a';x.lineWidth=4;x.strokeRect(50,50,W-100,H-100);x.lineWidth=1.5;x.strokeRect(66,66,W-132,H-132);
  x.fillStyle='#c4384a';x.beginPath();x.roundRect?x.roundRect(W-200,100,96,96,14):x.rect(W-200,100,96,96);x.fill();x.fillStyle='#fff';x.font='bold 60px serif';x.textAlign='center';x.textBaseline='middle';x.fillText('文',W-152,150);
  x.fillStyle='#8a6a4a';x.font='36px "Nanum Myeongjo",serif';x.textAlign='left';x.fillText('오늘의 문장',120,150);
  x.fillStyle='#2a2018';let fs=58;x.font=`${fs}px "Nanum Myeongjo","Gowun Batang",serif`;let lines=wrap(x,'「 '+q.text+' 」',W-260);
  while(lines.length*fs*1.65>700&&fs>34){fs-=4;x.font=`${fs}px "Nanum Myeongjo","Gowun Batang",serif`;lines=wrap(x,'「 '+q.text+' 」',W-260);}
  let y=Math.max(300,(H-lines.length*fs*1.65)/2-60);lines.forEach(l=>{x.fillText(l,130,y);y+=fs*1.65;});
  y+=30;x.fillStyle='#6a4a30';x.font='38px "Nanum Myeongjo",serif';if(q.book){x.fillText(`— 『${q.book}』${q.page?' '+q.page+'쪽':''}`,130,y);y+=70;}
  if(q.note){x.fillStyle='#7a6a5a';x.font='32px "Gowun Batang",serif';wrap(x,'💭 '+q.note,W-260).slice(0,4).forEach(l=>{x.fillText(l,130,y);y+=50;});}
  const nm=q.by===MYID?(ST.nick||'나'):nameOf(q.by);const acad=(document.title||'').split('·')[0].trim()||'학당';
  x.fillStyle='#8a6a4a';x.font='34px "Gowun Batang",serif';x.textAlign='right';x.fillText(`${nm} · ${dayLabel(q.day||dayKey(q.ts)).replace('오늘',dayKey(q.ts).replace(/-/g,'.'))}`,W-130,H-150);x.font='28px "Gowun Batang",serif';x.fillText(acad,W-130,H-105);
  return new Promise(r=>c.toBlob(r,'image/png'));}
async function shareCard(q){const blob=await cardImage(q);if(!blob)return;const f=new File([blob],`오늘의문장_${q.day||dayKey(q.ts)}.png`,{type:'image/png'});
  try{if(navigator.canShare&&navigator.canShare({files:[f]})){await navigator.share({files:[f],title:'오늘의 문장'});return;}}catch(e){if(e&&e.name==='AbortError')return;}
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=f.name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},1500);toast('🖼️ 문장 카드를 저장했어요');}
/* 동작 */
document.addEventListener('click',async e=>{const t=e.target;if(!t.closest)return;
  if(t.closest('#qTabs')){const b=t.closest('[data-qt]');if(b){tab=b.dataset.qt;render();}return;}
  if(!t.closest('#quotes')&&!t.closest('#qPrompt'))return;
  if(t.closest('#qSave')){save();return;}
  const lk=t.closest('[data-qlike]');if(lk){const id=lk.dataset.qlike;const on=!liked(id);try{LIKES[id]=LIKES[id]||{};if(on)LIKES[id][MYID]={v:1};else delete LIKES[id][MYID];}catch(err){}render();
    if(DB&&MYID!=='me'){try{const r=FB()?DB.doc('likes/'+id+'/'+MYID):DB.doc('likes/'+id+'~'+MYID);await(on?r.set({v:1}):r.delete());}catch(err){toast('공감을 남기지 못했어요');}}else{try{LS.set('local.likes',LIKES);}catch(err){}}return;}
  const im=t.closest('[data-qimg]');if(im){const q=Q().find(x=>x.id===im.dataset.qimg);if(q)shareCard(q);return;}
  const dl=t.closest('[data-qdel]');if(dl){if(confirm('이 문장을 지울까요?')){await delDoc('quotes',dl.dataset.qdel);render();}return;}
  if(t.closest('#qpGo')){const b=q$('#qPrompt');const bk=b&&b.dataset.book||'';if(b)b.remove();openQuotes(bk);return;}
  if(t.closest('#qpNo')){const b=q$('#qPrompt');if(b)b.remove();return;}});
function openQuotes(book){tab='today';if(book)draftBook=book;try{openSheet('quotes');}catch(e){}render();setTimeout(()=>{const ta=q$('#qText');if(ta&&book)ta.focus();},350);}
window.__qRender=()=>{if(isOpen())render();};
window.__qOpen=openQuotes;
/* 책 읽고 난 뒤 물어보기 */
window.__qPrompt=function(book){if(q$('#qPrompt'))return;const d=document.createElement('div');d.id='qPrompt';d.className='paper';d.dataset.book=book||'';
  d.innerHTML=`<div class="qpT">📜 ${book?`『${qe(book)}』에서 `:''}마음에 남은 문장이 있었나요?</div><div class="qpB"><button class="primary" id="qpGo">오늘의 문장 쓰기</button><button class="ghost" id="qpNo">나중에</button></div>`;
  document.body.appendChild(d);setTimeout(()=>{if(d.isConnected)d.remove();},20000);};
const prev=window.__socialOpen;window.__socialOpen=id=>{if(prev)prev(id);if(id==='quotes')render();};
})();
