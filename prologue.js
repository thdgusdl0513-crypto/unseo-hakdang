/* 프롤로그 · 처음 들어온 친구를 위한 컷만화 이용 안내 (해태가 안내해요) */
(function(){
const CLS=!!window.CLASS;const NAME=CLS?(window.CLASS.name||'송현학당'):'몽원학당';
const css=`
#pro{position:fixed;inset:0;z-index:70;display:flex;flex-direction:column;align-items:center;justify-content:center;background:radial-gradient(ellipse at 50% 20%,#3a2a4a 0%,#1a1220 70%,#0c0810 100%);opacity:0;transition:opacity .45s;font-family:'Gowun Dodum',sans-serif;color:#2a1c14;-webkit-user-select:none;user-select:none;touch-action:pan-y}
#pro.on{opacity:1}
#pro .top{position:absolute;top:calc(12px + env(safe-area-inset-top));left:14px;right:14px;display:flex;justify-content:space-between;align-items:center;color:#f6e8d0;font-size:13px}
#pro .top b{font-family:'Nanum Myeongjo',serif;letter-spacing:.12em;font-size:14px}
#pro .skip{color:#f6e8d0;border:1px solid rgba(246,232,208,.45);border-radius:14px;padding:6px 12px;font-size:13px;background:rgba(255,255,255,.06)}
#pro .stage{position:relative;width:min(420px,92vw);height:min(600px,calc(100dvh - 170px));margin-top:30px}
#pro .page{position:absolute;inset:0;display:flex;flex-direction:column;gap:10px;opacity:0;pointer-events:none;transform:translateX(30px) rotate(1deg);transition:opacity .4s,transform .45s cubic-bezier(.2,.9,.3,1.2)}
#pro .page.cur{opacity:1;pointer-events:auto;transform:none}
#pro .page.prev{transform:translateX(-30px) rotate(-1deg)}
#pro .pn{position:relative;flex:1;border:4px solid #2a1c14;border-radius:14px;overflow:hidden;box-shadow:5px 6px 0 rgba(0,0,0,.45);background:#fbf3e2}
#pro .pn:nth-child(2){transform:rotate(-.8deg)}
#pro .cap{position:absolute;left:10px;top:10px;background:#f7d36a;border:3px solid #2a1c14;padding:5px 10px;font-size:13.5px;font-weight:700;border-radius:4px;box-shadow:2px 2px 0 #2a1c14;z-index:3;max-width:80%}
#pro .bub{position:absolute;background:#fff;border:3px solid #2a1c14;border-radius:18px;padding:8px 12px;font-size:15px;line-height:1.45;z-index:4;box-shadow:2px 3px 0 rgba(0,0,0,.25);opacity:0;transform:scale(.4);transform-origin:var(--o,20% 100%)}
#pro .bub:after{content:'';position:absolute;width:14px;height:14px;background:#fff;border-right:3px solid #2a1c14;border-bottom:3px solid #2a1c14;bottom:-9px;left:var(--tx,22px);transform:rotate(45deg)}
#pro .bub.up:after{bottom:auto;top:-9px;transform:rotate(-135deg)}
#pro .page.cur .bub{animation:pop .45s cubic-bezier(.2,1.6,.4,1) forwards;animation-delay:var(--d,.3s)}
#pro .bub.shout{font-weight:800;border-radius:6px;background:#fff3c8}
#pro .bub.shout:after{background:#fff3c8}
@keyframes pop{to{opacity:1;transform:scale(1)}}
#pro .chr{position:absolute;width:var(--w,130px);z-index:2;filter:drop-shadow(0 6px 6px rgba(0,0,0,.25))}
#pro .chr img{width:100%;display:block}
#pro .chr span{display:block;font-size:calc(var(--w,130px)*.6);text-align:center;line-height:1}
#pro .page.cur .bounce{animation:bnc 1.6s ease-in-out infinite}
@keyframes bnc{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
#pro .page.cur .walk{animation:walk 2.6s ease-in-out infinite}
@keyframes walk{0%{transform:translateX(0)}45%,55%{transform:translateX(120px) translateY(-6px)}100%{transform:translateX(0)}}
#pro .sky{position:absolute;inset:0;background:linear-gradient(#2a3a6a,#7a5a8a 55%,#e8a878)}
#pro .floor{position:absolute;left:0;right:0;bottom:0;height:34%;background:repeating-linear-gradient(90deg,#c87a46 0 34px,#b86a3a 34px 36px),#c87a46}
#pro .stone{position:absolute;left:0;right:0;bottom:0;height:30%;background:repeating-linear-gradient(90deg,#d8d2c4 0 40px,#bfb8aa 40px 42px),repeating-linear-gradient(0deg,transparent 0 22px,#bfb8aa 22px 24px);background-blend-mode:multiply}
#pro .wall{position:absolute;inset:0;background:linear-gradient(#f2e2bc,#e8cf9a)}
#pro .lan{position:absolute;top:-4px;width:26px;height:40px;border-radius:40%;background:radial-gradient(#ffe7a0,#e87a3a);box-shadow:0 0 22px #ffb860;transform-origin:50% -20px}
#pro .page.cur .lan{animation:sw 2.8s ease-in-out infinite}
@keyframes sw{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}
#pro .title{position:absolute;left:0;right:0;top:20%;text-align:center;color:#fff4e2;font-family:'Nanum Myeongjo',serif;font-weight:800;font-size:34px;letter-spacing:.2em;text-shadow:0 3px 14px rgba(40,10,0,.6)}
#pro .title small{display:block;font-size:13px;letter-spacing:.3em;font-weight:400;opacity:.85;margin-top:6px}
#pro .tap{position:absolute;width:56px;height:56px;border-radius:50%;border:4px solid #fff;opacity:0;z-index:3}
#pro .page.cur .tap{animation:rip 1.6s ease-out infinite}
@keyframes rip{0%{transform:scale(.3);opacity:.95}100%{transform:scale(1.6);opacity:0}}
#pro .fing{position:absolute;font-size:40px;z-index:4}
#pro .page.cur .fing{animation:fing 1.6s ease-in-out infinite}
@keyframes fing{0%,100%{transform:translateY(0)}20%{transform:translateY(8px)}}
#pro .rot{position:absolute;font-size:62px;z-index:3}
#pro .page.cur .rot{animation:spin 3s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
#pro .gclock{position:absolute;left:50%;transform:translateX(-50%);font:600 54px ui-rounded,"SF Pro Rounded",system-ui,sans-serif;letter-spacing:1px;color:rgba(255,255,255,.92);-webkit-text-stroke:1.5px rgba(255,255,255,.95);text-shadow:0 4px 14px rgba(60,20,0,.55),0 0 1px #fff;background:linear-gradient(100deg,#fff 10%,#ffd8e4 35%,#fff2c0 55%,#c8f0ff 75%,#fff 95%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;z-index:3}
#pro .desk{position:absolute;left:50%;transform:translateX(-50%);bottom:18%;width:62%;height:26px;background:#5a3420;border-radius:4px;box-shadow:0 30px 0 -10px #3a2214;z-index:3}
#pro .fly{position:absolute;font-size:24px;opacity:0;z-index:3}
#pro .page.cur .fly{animation:fly 2.2s ease-out infinite;animation-delay:var(--d,0s)}
@keyframes fly{0%{opacity:0;transform:translateY(10px) scale(.6)}20%{opacity:1}100%{opacity:0;transform:translateY(-90px) translateX(var(--x,0)) scale(1.1)}}
#pro .note{position:absolute;width:62px;height:56px;background:#ffe9a0;box-shadow:2px 3px 0 rgba(0,0,0,.2);font-size:11px;padding:6px;line-height:1.3;transform:rotate(-6deg);z-index:3}
#pro .ui{position:absolute;width:52px;height:52px;border-radius:50%;background:#fbf3e2;border:3px solid #2a1c14;display:grid;place-items:center;font-size:26px;z-index:3;box-shadow:2px 3px 0 rgba(0,0,0,.3)}
#pro .page.cur .glow{animation:glow 1.2s ease-in-out infinite}
@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(255,210,90,.0),2px 3px 0 rgba(0,0,0,.3)}50%{box-shadow:0 0 0 10px rgba(255,210,90,.55),2px 3px 0 rgba(0,0,0,.3)}}
#pro .seal{position:absolute;width:84px;height:84px;border-radius:50%;border:6px double #c4384a;color:#c4384a;font:800 40px 'Nanum Myeongjo',serif;display:grid;place-items:center;transform:scale(2.2) rotate(-12deg);opacity:0;z-index:4;background:rgba(255,255,255,.4)}
#pro .page.cur .seal{animation:stamp .5s cubic-bezier(.3,1.5,.5,1) forwards;animation-delay:1.1s}
@keyframes stamp{to{transform:scale(1) rotate(-12deg);opacity:1}}
#pro .conf{position:absolute;width:8px;height:14px;top:-20px;opacity:0;z-index:5}
#pro .page.cur .conf{animation:conf 2.6s linear infinite;animation-delay:var(--d,0s)}
@keyframes conf{0%{opacity:1;transform:translateY(0) rotate(0)}100%{opacity:1;transform:translateY(560px) rotate(720deg)}}
#pro .swap{position:absolute;z-index:2}
#pro .swap img{position:absolute;inset:0;width:100%;opacity:0}
#pro .page.cur .swap img{animation:swap 4.5s infinite}
#pro .swap img:nth-child(2){animation-delay:1.5s!important}#pro .swap img:nth-child(3){animation-delay:3s!important}
@keyframes swap{0%,30%{opacity:1}34%,100%{opacity:0}}
#pro .poof{position:absolute;font-size:36px;z-index:3;opacity:0}
#pro .page.cur .poof{animation:poof 1.5s ease-out infinite}
@keyframes poof{0%{opacity:0;transform:scale(.4)}10%{opacity:1}60%{opacity:0;transform:scale(1.4)}100%{opacity:0}}
#pro .nav{display:flex;align-items:center;gap:14px;margin-top:16px;color:#f6e8d0}
#pro .nav button{min-width:46px;height:46px;border-radius:23px;background:#f2d79a;border:3px solid #2a1c14;font-size:18px;font-weight:800;color:#2a1c14;box-shadow:2px 3px 0 rgba(0,0,0,.4);padding:0 16px}
#pro .nav button[disabled]{opacity:.3}
#pro .nav .go{background:#e07a4a;color:#fff}
#pro .dots{display:flex;gap:6px}#pro .dots i{width:8px;height:8px;border-radius:50%;background:rgba(246,232,208,.3)}#pro .dots i.on{background:#f6e8d0;transform:scale(1.25)}
`;
function img(kind,id){try{return (typeof thumbOf==='function'&&thumbOf(kind,id))||'';}catch(e){return '';}}
function chr(src,emo,st,cls){return `<div class="chr ${cls||''}" style="${st}">${src?`<img src="${src}" alt="">`:`<span>${emo}</span>`}</div>`;}
function pages(){const S=(typeof ST!=='undefined')?ST:{};const me=img('av',S.avatar||'girl'),hae=img('pet','haetae'),c1=img('av','cat-white'),c2=img('av','corgi'),c3=img('av','frog'),nick=S.nick||'새내기';
  const H=(st,cls)=>chr(hae,'🦁',st,cls),M=(st,cls)=>chr(me,'🧑‍🎓',st,cls);
  const conf=Array.from({length:18},(_,i)=>`<i class="conf" style="left:${(i*37)%96+2}%;background:${['#c4384a','#f2c84b','#3f9a6a','#4a8ac8','#e88a4a','#8a5ab8'][i%6]};--d:${(i*0.17)%2.6}s"></i>`).join('');
  return [
  // 1. 첫 등교
  `<div class="pn"><div class="sky"></div>${[12,38,62,86].map((x,i)=>`<i class="lan" style="left:${x}%;animation-delay:${i*.3}s"></i>`).join('')}
    <div class="title">${NAME}<small>입학 안내서 · 제1화</small></div><div class="stone"></div>
    ${H('--w:120px;left:8%;bottom:14%','bounce')}${M('--w:130px;right:8%;bottom:12%','bounce')}
    <div class="bub" style="left:6%;bottom:44%;--d:.5s;--tx:40px">${esc2(nick)}, 왔구나!<br>난 학당 문지기 <b>해태</b>야 🦁</div>
    <div class="bub" style="right:5%;bottom:46%;--d:1.4s;--tx:70%;--o:80% 100%">아직 아무것도<br>모르는데요…? 😳</div>
    <div class="cap" style="--d:0s">${CLS?'우리 반만의 비밀 학당에 온 걸 환영해!':'등불 아래, 책 읽는 마법사들의 학당'}</div></div>`,
  // 2. 걷기 & 시점
  `<div class="pn"><div class="wall" style="background:linear-gradient(#bfe0f0,#f2e2bc)"></div><div class="stone"></div>
    <div class="cap">걷는 법</div>${M('--w:96px;left:10%;bottom:16%','walk')}
    <i class="tap" style="left:62%;bottom:16%"></i><div class="fing" style="left:64%;bottom:10%">👆</div>
    <div class="bub" style="right:6%;top:18%;--d:.4s;--tx:60%;--o:60% 100%">가고 싶은 바닥을 <b>톡!</b><br>누르면 거기로 걸어가 🚶</div></div>
   <div class="pn"><div class="wall"></div><div class="floor"></div><div class="cap">둘러보는 법</div>
    <div class="rot" style="left:12%;top:32%">🔄</div>${H('--w:96px;right:8%;bottom:12%','bounce')}
    <div class="bub" style="left:30%;top:22%;--d:.6s;--tx:70%;--o:80% 100%">꾹 누르고 <b>끌면</b> 시점이 빙글~<br>두 손가락이면 확대·축소!</div></div>`,
  // 3. 공부 타이머
  `<div class="pn"><div class="wall" style="background:linear-gradient(#2a4a3a,#1f3a2e)"></div><div class="floor"></div>
    <div class="cap">강의실 · 도서관에서</div><div class="gclock" data-clock style="top:33%;left:29%;font-size:44px">0:00</div>
    ${M('--w:100px;left:14%;bottom:12%','')}<div class="desk" style="bottom:10%;left:28%;width:40%"></div>
    <div class="bub" style="left:4%;top:16%;--d:.5s">의자에 앉으면<br><b>집중 타이머</b> 시작!</div>
    <div class="bub up" style="right:3%;bottom:4%;--d:1.6s;--tx:30%;--o:30% 0">머리 위 유리 시계,<br>친구들도 같이 봐 👀</div></div>
   <div class="pn"><div class="wall"></div><div class="floor"></div><div class="cap">다 했으면</div>
    ${H('--w:100px;left:6%;bottom:12%','bounce')}<div class="ui glow" style="right:12%;top:30%">📒</div>
    <div class="bub" style="left:30%;top:16%;--d:.5s;--tx:20%">'기록하고 일어나기'를 누르면<br>오늘 공부가 <b>기록장</b>에 쏙!</div></div>`,
  // 4. 기숙사
  `<div class="pn"><div class="wall" style="background:linear-gradient(#ffcf9a,#e88a5a)"></div><div class="floor" style="background:repeating-linear-gradient(90deg,#c86a3a 0 30px,#b45a2e 30px 32px)"></div>
    <div class="cap">기숙사 · 수다 타임</div>
    ${chr(c1,'🐱','--w:92px;left:4%;bottom:14%','bounce')}${chr(c2,'🐶','--w:92px;left:36%;bottom:10%','bounce')}${chr(c3,'🐸','--w:92px;right:4%;bottom:14%','bounce')}
    <div class="bub" style="left:3%;top:20%;--d:.4s">오늘 뭐 읽어?</div>
    <div class="bub" style="left:34%;top:34%;--d:1.1s">데미안 📖</div>
    <div class="bub shout" style="right:3%;top:16%;--d:1.8s;--tx:70%;--o:80% 100%">개굴! 같이 하자!</div></div>
   <div class="pn"><div class="wall"></div><div class="cap">남기고 싶은 말은</div>
    <div class="note" style="left:10%;top:28%">시험 화이팅<br>♥</div><div class="note" style="left:30%;top:42%;transform:rotate(5deg);background:#cfe8ff">스터디<br>8시!</div>
    <div class="ui glow" style="right:28%;top:26%">📌</div><div class="ui glow" style="right:8%;top:46%;animation-delay:.6s">🎵</div>
    <div class="bub up" style="left:8%;bottom:10%;--d:.6s;--o:20% 0">게시판엔 쪽지, 레코드판엔 추천곡!<br>${CLS?'채팅 시간은 선생님이 정해요 🕗':'대화는 저장되지 않아요 🤫'}</div></div>`,
  // 5. 표정 · 행동 · 친구 부르기
  `<div class="pn"><div class="sky" style="background:linear-gradient(#ffd9e4,#fff1d6)"></div><div class="stone"></div>
    <div class="cap">🙂 버튼을 누르면</div><div class="ui glow" style="right:6%;top:14%">🙂</div>
    ${M('--w:130px;left:12%;bottom:12%','bounce')}${['💗','💗','✨','💗'].map((h,i)=>`<i class="fly" style="left:${22+i*9}%;bottom:40%;--d:${i*.45}s;--x:${(i%2?1:-1)*20}px">${h}</i>`).join('')}
    <div class="bub" style="right:6%;bottom:40%;--d:.6s;--tx:20%;--o:20% 100%">인사 👋 하트 💗<br>춤 💃 꾸벅잠 😴<br>행동이 다 있어!</div></div>
   <div class="pn"><div class="wall" style="background:linear-gradient(#e2f0d8,#f2e2bc)"></div><div class="floor"></div><div class="cap">심심할 땐</div>
    ${H('--w:96px;left:6%;bottom:12%','bounce')}<div class="ui glow" style="left:44%;top:22%">📣</div>
    <div class="bub shout" style="right:5%;top:36%;--d:.5s;--tx:20%;--o:20% 100%">"다들 도서관으로 모여~!"</div>
    <div class="bub up" style="left:28%;bottom:8%;--d:1.3s;--o:20% 0">왼쪽 위 이름표를 누르면 <b>친구 부르기</b>!</div></div>`,
  // 6. 옷장 · 출석
  `<div class="pn"><div class="wall" style="background:linear-gradient(#e8dcf8,#f6eedc)"></div><div class="floor" style="height:22%"></div><div class="cap">🧥 옷장에서 변신!</div>
    <div class="swap" style="width:120px;height:120px;left:50%;margin-left:-60px;bottom:16%">${[me,c1,c2].map(s=>s?`<img src="${s}" alt="">`:'').join('')}</div><i class="poof" style="left:42%;bottom:38%">💨</i>
    <div class="bub" style="left:5%;top:16%;--d:.5s">한복, 후드티, 갓, 비니…<br>색깔까지 내 맘대로 🎨</div></div>
   <div class="pn"><div class="wall"></div><div class="cap">매일 한 번</div>
    <div class="seal" style="left:50%;top:26%;margin-left:-42px">讀</div>
    <div class="bub up" style="left:8%;bottom:12%;--d:.4s;--o:20% 0">🔖 출석도장 <b>꾹!</b><br>달력에 차곡차곡 모여요</div></div>`,
  // 7. 입학 축하
  `<div class="pn"><div class="sky" style="background:linear-gradient(#3a2a6a,#9a5a8a 60%,#f2b878)"></div>${conf}
    <div class="title" style="top:14%">입학을 축하해!<small>${NAME} · 제1화 끝</small></div><div class="stone"></div>
    ${H('--w:110px;left:10%;bottom:12%','bounce')}${M('--w:130px;right:10%;bottom:10%','bounce')}
    <div class="bub" style="left:8%;bottom:42%;--d:.6s;--tx:40px">막히면 ☰ 설정 → 📜 이용 안내!<br>그럼, 즐거운 학당 생활 되길 🌙</div></div>`];}
function esc2(s){return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));}
let clockT=null;
window.showPrologue=function(done){if(document.getElementById('pro'))return;
  if(!document.getElementById('proCss')){const st=document.createElement('style');st.id='proCss';st.textContent=css;document.head.appendChild(st);}
  const P=pages();const el=document.createElement('div');el.id='pro';
  el.innerHTML=`<div class="top"><b>${NAME} 안내서</b><button class="skip">건너뛰기 ›</button></div><div class="stage">${P.map((p,i)=>`<div class="page" data-i="${i}">${p}</div>`).join('')}</div>
    <div class="nav"><button class="bk" aria-label="이전">‹</button><div class="dots">${P.map(()=>'<i></i>').join('')}</div><button class="nx">다음 ›</button></div>`;
  document.body.appendChild(el);requestAnimationFrame(()=>el.classList.add('on'));
  let cur=-1;const pg=[...el.querySelectorAll('.page')],dots=[...el.querySelectorAll('.dots i')],nx=el.querySelector('.nx'),bk=el.querySelector('.bk');
  const go=i=>{if(i<0)return;if(i>=pg.length){close();return;}pg.forEach((p,k)=>{p.classList.toggle('cur',k===i);p.classList.toggle('prev',k<i);});dots.forEach((d,k)=>d.classList.toggle('on',k===i));
    bk.disabled=i===0;nx.textContent=i===pg.length-1?'학당으로 출발! 🎉':'다음 ›';nx.classList.toggle('go',i===pg.length-1);cur=i;
    clearInterval(clockT);const ck=pg[i].querySelector('[data-clock]');if(ck){let s=0;ck.textContent='0:00';clockT=setInterval(()=>{s+=37;const m=Math.floor(s/60),x=s%60;ck.textContent=m+':'+String(x).padStart(2,'0');if(s>1500)s=0;},120);}};
  const close=()=>{clearInterval(clockT);try{LS.set('prologue',1);}catch(e){}el.classList.remove('on');setTimeout(()=>{el.remove();if(typeof done==='function')done();},450);};
  nx.addEventListener('click',e=>{e.stopPropagation();go(cur+1);});bk.addEventListener('click',e=>{e.stopPropagation();go(cur-1);});el.querySelector('.skip').addEventListener('click',e=>{e.stopPropagation();close();});
  el.querySelector('.stage').addEventListener('click',e=>{const r=el.getBoundingClientRect();go(e.clientX<r.width*.3?cur-1:cur+1);});
  let sx=null;el.addEventListener('touchstart',e=>{sx=e.touches[0].clientX;},{passive:true});el.addEventListener('touchend',e=>{if(sx==null)return;const dx=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(dx)>50){go(dx<0?cur+1:cur-1);}},{passive:true});
  go(0);};
})();
