/* 🪜 사다리 타기 · 한 화면에서 다같이 (이름·결과 직접 쓰기, 접속한 친구 불러오기) */
(function(){
const $q=s=>document.querySelector(s),$$q=s=>[...document.querySelectorAll(s)];
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const COL=['#e0604f','#3f7fd0','#3aa66a','#e0a030','#9a5fd0','#2fa5b0','#d0569a','#7a8a3a','#c07a3a','#5a6ad0','#d04a4a','#3a9a8a','#b0a030','#8a5a9a','#4a8ad0'];
let L=LS.get('ladderSet',null)||{n:4,names:[],res:[]};let S=null,back='menu';
const md=document.createElement('div');md.id='ladder';md.className='modal';
md.innerHTML=`<div class="sheet paper"><div class="grip"></div><div class="sh"><button class="back" data-lback>‹ 뒤로</button><span>🪜 사다리 타기</span><button class="x" data-lclose>×</button></div><div id="ldBody"></div></div>`;
document.body.appendChild(md);
const st=document.createElement('style');st.textContent=`#ldBody .ldRow{display:flex;align-items:center;gap:8px;margin:6px 0}#ldBody .ldRow b{min-width:58px;font-size:14px}#ldBody .ldStep{display:flex;align-items:center;gap:6px}#ldBody .ldStep button{width:34px;height:34px;border-radius:50%;border:1px solid #e2cfb4;background:#fffaf2;font-size:18px;cursor:pointer}#ldBody .ldStep span{min-width:42px;text-align:center;font-weight:800;font-size:17px}
#ldBody .ldGrid{display:grid;grid-template-columns:1fr 1fr;gap:6px 8px;margin-top:6px}#ldBody .ldGrid input{width:100%;box-sizing:border-box;font:inherit;font-size:14px;padding:8px 9px;border-radius:10px;border:1px solid #e2cfb4;background:#fffaf2}#ldBody .ldGrid .h{font-size:12px;font-weight:700;opacity:.75}
#ldBody .ldQuick{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}#ldBody .ldQuick button{font:inherit;font-size:12.5px;border:1px solid #e2cfb4;background:#fffaf2;border-radius:999px;padding:5px 10px;cursor:pointer}
#ldBody .ldGo{width:100%;margin-top:12px;font-size:16px;padding:12px}#ldBody .ldWrap{overflow-x:auto;margin:4px -4px 0;padding:0 4px}#ldBody svg{display:block;margin:0 auto;touch-action:manipulation}
#ldBody .ldTop text,#ldBody .ldBot text{font-size:12px;font-weight:700}#ldBody .ldName{cursor:pointer}#ldBody .ldBar{display:flex;gap:6px;margin-top:10px}#ldBody .ldBar button{flex:1;font:inherit;font-size:13.5px;padding:9px 6px;border-radius:12px;border:1px solid #e2cfb4;background:#fffaf2;cursor:pointer}#ldBody .ldBar button.primary{background:#d98a4a;color:#fff;border-color:#d98a4a}
#ldBody .ldRes{margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:5px}#ldBody .ldRes div{background:rgba(255,255,255,.7);border-radius:10px;padding:6px 9px;font-size:13.5px;display:flex;justify-content:space-between;gap:6px;border-left:5px solid var(--c)}#ldBody .ldHint{font-size:12.5px;opacity:.75;text-align:center;margin:6px 0}
#ldBody label.ldChk{display:flex;align-items:center;gap:6px;font-size:13px;margin-top:8px}#ldBody label.ldChk input{width:auto}`;document.head.appendChild(st);
function friends(){try{return (typeof onlineFriends==='function'?onlineFriends():[]).map(r=>nameOf(r.by)).filter(Boolean);}catch(e){return [];}}
function setup(){const n=L.n;const names=L.names.slice(0,n),res=L.res.slice(0,n);while(names.length<n)names.push('');while(res.length<n)res.push('');
  $q('#ldBody').innerHTML=`<div class="ldRow"><b>몇 명?</b><div class="ldStep"><button data-ln="-1">−</button><span>${n}명</span><button data-ln="1">＋</button></div></div>
  <div class="ldQuick"><button data-lq="me">🙋 나 + 접속한 친구 넣기</button><button data-lq="num">1번·2번…로 채우기</button><button data-lq="clearN">이름 지우기</button></div>
  <div class="ldQuick"><button data-lq="win1">🍪 당첨 1개</button><button data-lq="win2">🍪 당첨 2개</button><button data-lq="win3">🍪 당첨 3개</button><button data-lq="order">순서 정하기 (1등~)</button><button data-lq="clearR">결과 지우기</button></div>
  <div class="ldGrid"><div class="h">참가자</div><div class="h">결과 (사다리 아래)</div>${names.map((v,i)=>`<input data-lnm="${i}" maxlength="10" placeholder="참가자 ${i+1}" value="${E(v)}"><input data-lrs="${i}" maxlength="12" placeholder="결과 ${i+1}" value="${E(res[i])}">`).join('')}</div>
  <label class="ldChk"><input type="checkbox" id="ldMix" ${L.mixNames!==false?'checked':''}> 참가자 자리도 무작위로 섞기</label>
  <label class="ldChk"><input type="checkbox" id="ldHide" ${L.hide!==false?'checked':''}> 결과를 가려 두었다가 한 명씩 열기</label>
  <button class="primary ldGo" id="ldStart">🪜 사다리 만들기</button>`;}
function readInputs(){if(!$q('[data-lnm="0"]'))return;const n=L.n;L.names=[...Array(n)].map((_,i)=>(($q(`[data-lnm="${i}"]`)||{}).value||'').trim());L.res=[...Array(n)].map((_,i)=>(($q(`[data-lrs="${i}"]`)||{}).value||'').trim());const h=$q('#ldHide');if(h)L.hide=h.checked;const mx=$q('#ldMix');if(mx)L.mixNames=mx.checked;LS.set('ladderSet',L);}
function build(){readInputs();const n=L.n;const names=L.names.map((v,i)=>v||`참가자 ${i+1}`),res=L.res.map((v,i)=>v||'꽝');
  if(typeof badBlock==='function'&&!ADMIN_ON&&badBlock(names.join(' ')+' '+res.join(' ')))return;
  const rows=Math.max(10,n*3);const rung=[];for(let r=0;r<rows;r++){rung.push([]);for(let c=0;c<n-1;c++){const prev=c>0&&rung[r][c-1];const above=r>0&&rung[r-1][c];rung[r].push(!prev&&!above&&Math.random()<.42);}}
  for(let c=0;c<n-1;c++){if(!rung.some(r=>r[c])){const r=1+Math.floor(Math.random()*(rows-2));if(!(c>0&&rung[r][c-1])&&!(rung[r][c+1]))rung[r][c]=true;}}
  const mix=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
  S={n,names:L.mixNames===false?names:mix(names),res:mix(res),rows,rung,open:[],hide:L.hide!==false};draw();}
function trace(i){const pts=[];let c=i;const W=S.gap,top=S.top;pts.push([S.x0+c*W,top-2]);for(let r=0;r<S.rows;r++){const y=top+(r+1)*S.rh;if(c<S.n-1&&S.rung[r][c]){pts.push([S.x0+c*W,y],[S.x0+(c+1)*W,y]);c++;}else if(c>0&&S.rung[r][c-1]){pts.push([S.x0+c*W,y],[S.x0+(c-1)*W,y]);c--;}}
  pts.push([S.x0+c*W,top+(S.rows+1)*S.rh+2]);return {pts,end:c};}
function draw(){const n=S.n;const wrap=Math.min(560,(md.querySelector('.sheet').clientWidth||360)-24);S.gap=Math.max(44,Math.min(110,(wrap-64)/Math.max(1,n-1)));S.x0=32;S.top=44;S.rh=Math.max(16,Math.min(26,330/S.rows));
  const W=S.x0*2+S.gap*(n-1),H=S.top+(S.rows+1)*S.rh+50;
  let g=`<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  for(let c=0;c<n;c++)g+=`<line x1="${S.x0+c*S.gap}" y1="${S.top}" x2="${S.x0+c*S.gap}" y2="${S.top+(S.rows+1)*S.rh}" stroke="#8a6a4a" stroke-width="4" stroke-linecap="round"/>`;
  S.rung.forEach((row,r)=>row.forEach((on,c)=>{if(on){const y=S.top+(r+1)*S.rh;g+=`<line x1="${S.x0+c*S.gap}" y1="${y}" x2="${S.x0+(c+1)*S.gap}" y2="${y}" stroke="#8a6a4a" stroke-width="4" stroke-linecap="round"/>`;}}));
  g+=`<g id="ldPaths"></g>`;
  for(let i=0;i<n;i++){const x=S.x0+i*S.gap,col=COL[i%COL.length];g+=`<g class="ldName" data-lgo="${i}"><rect x="${x-S.gap/2+3}" y="4" width="${S.gap-6}" height="30" rx="10" fill="${col}"/><text x="${x}" y="24" text-anchor="middle" fill="#fff">${E(S.names[i].slice(0,S.gap<60?4:6))}</text></g>`;}
  const by=S.top+(S.rows+1)*S.rh+8;for(let c=0;c<n;c++){const x=S.x0+c*S.gap;const who=S.open.map(i=>[i,trace(i).end]).find(([i,e])=>e===c);const show=!S.hide||who;g+=`<g><rect x="${x-S.gap/2+3}" y="${by}" width="${S.gap-6}" height="30" rx="10" fill="${who?COL[who[0]%COL.length]:'#fff8ec'}" stroke="#d9c3a3"/><text x="${x}" y="${by+20}" text-anchor="middle" fill="${who?'#fff':'#5a3a22'}">${show?E(S.res[c].slice(0,6)):'❔'}</text></g>`;}
  g+='</svg>';
  const done=S.open.length===n;
  $q('#ldBody').innerHTML=`<div class="ldHint">${done?'🎉 모두 확인했어요!':'위의 이름을 누르면 사다리를 타고 내려가요 👇'}</div><div class="ldWrap">${g}</div>
    <div class="ldBar"><button data-lall ${done?'disabled':''}>👀 모두 열기</button><button data-lre>🔀 다시 섞기</button><button data-lset>✏️ 고치기</button></div>
    ${S.open.length?`<div class="ldRes">${S.open.map(i=>`<div style="--c:${COL[i%COL.length]}"><b>${E(S.names[i])}</b><span>${E(S.res[trace(i).end])}</span></div>`).join('')}</div>`:''}`;
  const P=$q('#ldPaths');S.open.forEach(i=>P.insertAdjacentHTML('beforeend',pathSvg(i,false)));}
function pathSvg(i,anim){const t=trace(i).pts;const d=t.map((p,k)=>(k?'L':'M')+p[0]+' '+p[1]).join(' ');let len=0;for(let k=1;k<t.length;k++)len+=Math.abs(t[k][0]-t[k-1][0])+Math.abs(t[k][1]-t[k-1][1]);
  return `<path d="${d}" fill="none" stroke="${COL[i%COL.length]}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity=".9" ${anim?`stroke-dasharray="${len}" stroke-dashoffset="${len}" style="transition:stroke-dashoffset ${Math.min(3.2,len/260)}s linear"`:''} data-len="${len}"/>`;}
let busy=false;
function go(i){if(busy||S.open.includes(i))return;busy=true;const P=$q('#ldPaths');P.insertAdjacentHTML('beforeend',pathSvg(i,true));const p=P.lastElementChild;const dur=Math.min(3.2,(+p.dataset.len)/260)*1000;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{p.style.strokeDashoffset='0';}));try{if(typeof sfx==='function')sfx('tick');}catch(e){}
  setTimeout(()=>{busy=false;S.open.push(i);draw();const r=S.res[trace(i).end];toast(`🪜 ${E(S.names[i])} → <b>${E(r)}</b>`);try{if(/당첨|🍪|1등/.test(r)&&typeof chime==='function')chime();}catch(e){}},dur+150);}
window.openLadder=function(from){back=from||'menu';openSheet('ladder');if(S)draw();else setup();};
md.addEventListener('click',e=>{const t=e.target;
  if(t===md||t.closest('[data-lclose]')){closeSheets();return;}if(t.closest('[data-lback]')){if(back==='games'&&typeof openGames==='function')openGames();else openSheet('menu');return;}
  const ln=t.closest('[data-ln]');if(ln){readInputs();L.n=Math.max(2,Math.min(15,L.n+(+ln.dataset.ln)));setup();return;}
  const q=t.closest('[data-lq]');if(q){readInputs();const k=q.dataset.lq,n=L.n;
    if(k==='me'){const F=[(ST.nick||'나'),...friends()];L.n=Math.max(2,Math.min(15,Math.max(n,F.length)));L.names=F.slice(0,L.n);if(F.length<2)toast('지금 접속한 친구가 없어요<small>이름을 직접 적어 주세요</small>');}
    if(k==='num')L.names=[...Array(n)].map((_,i)=>`${i+1}번`);if(k==='clearN')L.names=[];
    if(/^win\d$/.test(k)){const w=+k.slice(3);L.res=[...Array(n)].map((_,i)=>i<w?'🍪 당첨':'꽝');}
    if(k==='order')L.res=[...Array(n)].map((_,i)=>`${i+1}등`);if(k==='clearR')L.res=[];
    setup();return;}
  if(t.closest('#ldStart')){build();return;}
  const gg=t.closest('[data-lgo]');if(gg){go(+gg.dataset.lgo);return;}
  if(t.closest('[data-lall]')){S.open=[...Array(S.n).keys()];draw();return;}
  if(t.closest('[data-lre]')){build();return;}
  if(t.closest('[data-lset]')){S=null;setup();return;}});
md.addEventListener('change',e=>{if(e.target.matches('[data-lnm],[data-lrs],#ldHide'))readInputs();});
})();
