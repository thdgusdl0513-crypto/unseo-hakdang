/* 🎟️ 오늘의 부적 복권 · 하루 한 장 긁어서 힘이 나는 한마디 뽑기 (40종) */
(function(){
const $q=s=>document.querySelector(s);
const E=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const PAL=[
 {frame:'#f29a8e',bg:'#fbe9a6',line:'#d23a2a',acc:'#f5c542'},
 {frame:'#ffe08a',bg:'#fff3c4',line:'#e0503a',acc:'#ff9ec0'},
 {frame:'#f3a44a',bg:'#fbe8c8',line:'#c8662a',acc:'#e98a3a'},
 {frame:'#bcd98a',bg:'#eef6d8',line:'#5c8a3a',acc:'#8cc06a'},
 {frame:'#9cc8f0',bg:'#e8f3ff',line:'#3a6ab0',acc:'#f5c542'},
 {frame:'#c9b0f0',bg:'#f3ecff',line:'#7a52c0',acc:'#ffb6d9'},
 {frame:'#a8e6d0',bg:'#fff0f5',line:'#e0608a',acc:'#7ad0b0'},
 {frame:'#bfe3ff',bg:'#fffbe0',line:'#3a8ac0',acc:'#ffd84a'}];
/* [제목, 한마디, 동물, 소품, 장식, 색, 제목모양, 테두리, 도장, 모양] */
const C=[
 ['일등부적','오늘 너는 뭘 해도 일등이야!','cat','none','coin,ball,spark,bill',0,'pill','crown','좋음','p'],
 ['일확천금','노력은 절대 배신하지 않아. 이자까지 붙여서 돌아와!','cat','glasses','bill,bar,spark,coin',1,'burst','heart','대박','p'],
 ['무조건 잘됨','난 항상 최고! 오늘도 무조건 잘된다','seal','sprout','spark,clover',2,'plain','bracket','대박','p'],
 ['오늘의 운세','당신은 모든 일이 잘 풀립니다','hamster','paper','clover,spark',3,'line','none','','n'],
 ['합격부적','네가 원하는 그 결과, 이미 너한테 오는 중이야','rabbit','band','spark,star,clover',4,'pill','crown','합격','p'],
 ['만점부적','한 문제 더 풀면 만점에 한 걸음 더 가까워져','chick','pencil','star,spark,note100',7,'burst','heart','만점','p'],
 ['꿀잠부적','오늘은 푹 자기! 잘 자는 것도 실력이야','bear','nightcap','moon,star,spark',5,'pill','bracket','쿨쿨','p'],
 ['용기부적','떨려도 괜찮아. 떨리는 건 진심이라는 뜻이야','dog','cape','spark,heart,star',0,'band','crown','용기','p'],
 ['칭찬부적','오늘 여기까지 온 너, 진짜 잘하고 있어','penguin','flower','heart,spark,flower',6,'pill','heart','칭찬','p'],
 ['집중부적','딱 25분만 집중! 그다음엔 맛있는 간식','cat','band2','spark,clock,star',7,'plain','bracket','집중','p'],
 ['간식운 상승','오늘은 맛있는 게 생길 운세! 기대해도 좋아','hamster','snack','spark,candy,heart',1,'burst','heart','냠냠','p'],
 ['친구복 부적','좋은 친구가 곁에 있다는 건 최고의 행운이야','dog','heart','heart,spark,clover',6,'band','crown','우정','p'],
 ['멘탈 튼튼','실수해도 괜찮아. 다시 하면 되니까','seal','shield','spark,star,clover',3,'pill','bracket','튼튼','p'],
 ['성적 상승','어제보다 1점만 올라도 그건 성장이야','chick','arrow','arrow,star,spark',4,'plain','heart','상승','p'],
 ['대박기원','오늘 한 일이 내일의 대박이 돼','bear','coin','coin,bar,spark,ball',0,'burst','crown','대박','p'],
 ['웃음부적','하루에 한 번은 크게 웃기! 그게 오늘의 숙제','rabbit','none','heart,spark,note',1,'pill','heart','하하','p'],
 ['건강부적','물 많이 마시고, 밥 잘 먹고, 기지개 쭉!','penguin','band3','clover,spark,heart',3,'band','bracket','튼튼','p'],
 ['시험대박','아는 문제는 다 맞고 모르는 문제는 찍어도 맞기!','cat','pencil','star,spark,ball',5,'burst','crown','합격','p'],
 ['행운 가득','네잎클로버보다 더 큰 행운이 오늘 너한테!','hamster','clover','clover,spark,heart',3,'plain','heart','행운','p'],
 ['오늘의 한마디','너는 생각보다 훨씬 대단한 사람이야','seal','none','spark,star',7,'line','none','','n'],
 ['기분 최고','좋은 일은 생각보다 가까이 있어','chick','crown','spark,heart,flower',1,'pill','heart','최고','p'],
 ['출석부적','오늘 학당에 온 것만으로도 이미 멋져!','dog','backpack','star,spark,clover',2,'band','crown','출석','p'],
 ['꾸준함 부적','하루 한 줄씩이면 일 년에 365줄이야','bear','book','book,spark,star',4,'plain','bracket','꾸준','p'],
 ['무적부적','오늘의 너는 무적! 걱정은 내려놓기','cat','cape','star,spark,coin',0,'burst','crown','무적','p'],
 ['여유부적','천천히 가도 괜찮아. 멈추지만 않으면 돼','penguin','tea','spark,flower,clover',6,'pill','bracket','여유','p'],
 ['오늘의 운세','오늘 고른 선택이 가장 좋은 선택이야','rabbit','paper','clover,heart',6,'line','none','','n'],
 ['발표부적','목소리 크게! 네 생각은 들을 가치가 있어','chick','mic','note,spark,star',2,'band','heart','당당','p'],
 ['숙제 끝 부적','숙제 끝내고 노는 맛, 그게 진짜 꿀맛','hamster','pencil','star,spark,candy',7,'plain','crown','완료','p'],
 ['힐링부적','힘든 날엔 쉬어 가도 돼. 쉬는 것도 공부야','seal','flower','flower,heart,spark',5,'pill','heart','토닥','p'],
 ['자신감 부적','거울 속의 너한테 "오늘도 멋있다" 말해 주기','dog','glasses','star,spark,heart',4,'burst','bracket','멋짐','p'],
 ['우주최강','너의 가능성은 우주만큼 넓어','bear','helmet','planet,star,spark',5,'burst','crown','최강','p'],
 ['오늘의 한마디','작은 성공도 성공이야. 오늘도 하나 해내자','penguin','none','spark,clover',3,'line','none','','n'],
 ['기적부적','포기하지 않으면 기적은 진짜로 와','rabbit','star','star,spark,heart',7,'pill','crown','기적','p'],
 ['굿럭부적','Good Luck! 오늘은 행운이 네 편이야','cat','clover','clover,spark,coin',3,'band','heart','굿럭','p'],
 ['인싸부적','먼저 건넨 인사 한마디가 친구를 만들어','chick','heart','heart,note,spark',6,'plain','bracket','안녕','p'],
 ['꿈 이루기','적어 둔 꿈은 이루어질 확률이 훨씬 높대','hamster','star','star,spark,planet',4,'burst','crown','꿈','p'],
 ['오늘의 운세','기다리던 좋은 소식이 곧 도착합니다','dog','paper','clover,spark',1,'line','none','','n'],
 ['간절함 부적','간절히 원하고 꾸준히 하면 결국 닿아','seal','band','spark,star,heart',0,'pill','heart','간절','p'],
 ['방학부적','방학이 하루하루 다가오고 있어! 조금만 더','bear','sun','sun,spark,flower',2,'band','bracket','방학','p'],
 ['최고존엄','오늘 하루의 주인공은 바로 너야','penguin','crown','coin,star,spark,bar',1,'burst','crown','최고','p']];
const N=C.length;
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
function book(){const b=LS.get('charmBook',[]);return Array.isArray(b)?b:[];}
function pickToday(){let t=LS.get('charmToday',null);if(!t||t.d!==today()){const b=book();const left=[...Array(N).keys()].filter(i=>!b.includes(i));const pool=left.length?left:[...Array(N).keys()];t={d:today(),id:pool[Math.floor(Math.random()*pool.length)],open:false};LS.set('charmToday',t);}return t;}

/* ---------- 손그림 느낌 도구 ---------- */
const CW=720,CH=1000;
let rs=1;const rnd=()=>{rs=(rs*1103515245+12345)>>>0;return rs/4294967296;};
function draw(cv,id,PR){const c=cv.getContext('2d');cv.width=CW;cv.height=CH;const S=C[id];const P=PAL[S[5]];rs=7919*(id+1);
  const K=PR?'#000':'#3a2a22',F=col=>PR?'#fff':col,LN=PR?'#000':P.line;
  const HF='"Jua","Gowun Dodum",sans-serif',MF='"Gaegu","Gowun Dodum",sans-serif';
  c.lineJoin='round';c.lineCap='round';
  const blob=(x,y,rx,ry,fill,st,w,j)=>{c.beginPath();const n=36;for(let i=0;i<=n;i++){const a=i/n*Math.PI*2;const r=1+((j==null?.025:j)*(Math.sin(a*3+id)+Math.sin(a*5+id*2)*.6));const px=x+Math.cos(a)*rx*r,py=y+Math.sin(a)*ry*r;i?c.lineTo(px,py):c.moveTo(px,py);}c.closePath();if(fill){c.fillStyle=typeof fill==='object'?fill.raw:F(fill);c.fill();}if(st!==false){c.strokeStyle=st||K;c.lineWidth=w||6;c.stroke();}};
  const poly=(pts,fill,w)=>{c.beginPath();pts.forEach((p,i)=>i?c.lineTo(p[0],p[1]):c.moveTo(p[0],p[1]));c.closePath();if(fill){c.fillStyle=F(fill);c.fill();}c.strokeStyle=K;c.lineWidth=w||6;c.stroke();};
  const rrp=(x,y,w,h,r)=>{c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();};
  const line=(x1,y1,x2,y2,w,col)=>{c.beginPath();c.moveTo(x1,y1);c.quadraticCurveTo((x1+x2)/2+(rnd()-.5)*4,(y1+y2)/2+(rnd()-.5)*4,x2,y2);c.strokeStyle=col||K;c.lineWidth=w||6;c.stroke();};
  const txt=(t,x,y,font,fill,stroke,sw)=>{c.font=font;c.textAlign='center';c.textBaseline='middle';if(stroke){c.lineWidth=sw||10;c.strokeStyle=stroke;c.strokeText(t,x,y);}c.fillStyle=fill;c.fillText(t,x,y);};
  /* 장식들 */
  const D={
   spark:(x,y,s,cl)=>{const r=s,q=s*.28;poly([[x,y-r],[x+q,y-q],[x+r,y],[x+q,y+q],[x,y+r],[x-q,y+q],[x-r,y],[x-q,y-q]],cl||'#ffd84a',4);},
   coin:(x,y,s)=>{blob(x,y,s,s*.42,'#f5c542',K,5,.01);blob(x,y-s*.16,s,s*.42,'#ffd866',K,5,.01);},
   bill:(x,y,s)=>{c.save();c.translate(x,y);c.rotate((rnd()-.5)*1.2);rrp(-s,-s*.5,s*2,s,6);c.fillStyle=F('#9ad46a');c.fill();c.strokeStyle=K;c.lineWidth=5;c.stroke();blob(0,0,s*.26,s*.26,'#6fb44a',K,3,0);line(-s*.75,-s*.25,-s*.55,-s*.25,4);line(s*.55,s*.25,s*.75,s*.25,4);c.restore();},
   bar:(x,y,s)=>{poly([[x-s,y+s*.4],[x+s,y+s*.4],[x+s*.7,y-s*.35],[x-s*.7,y-s*.35]],'#f2b632',5);line(x-s*.5,y-s*.1,x-s*.2,y-s*.1,4,PR?'#000':'#fff3b0');},
   ball:(x,y,s)=>{const cols=['#f5a142','#4cb050','#3a86d8','#e84a4a'];blob(x,y,s,s,cols[Math.floor(rnd()*4)],K,5,.01);blob(x,y,s*.5,s*.5,'#fff',K,3,0);txt(String(1+Math.floor(rnd()*45)),x,y+1,`700 ${s*.55}px ${HF}`,K);},
   clover:(x,y,s)=>{[[0,-1],[1,0],[0,1],[-1,0]].forEach(([a,b])=>blob(x+a*s*.48,y+b*s*.48,s*.5,s*.5,'#5cc05a',K,4,.03));line(x+s*.3,y+s*.3,x+s*.9,y+s*1.1,5);},
   heart:(x,y,s,cl)=>{c.beginPath();c.moveTo(x,y+s*.9);c.bezierCurveTo(x-s*1.4,y-s*.1,x-s*.6,y-s*1.1,x,y-s*.35);c.bezierCurveTo(x+s*.6,y-s*1.1,x+s*1.4,y-s*.1,x,y+s*.9);c.closePath();c.fillStyle=F(cl||'#ff8fb0');c.fill();c.strokeStyle=K;c.lineWidth=5;c.stroke();},
   star:(x,y,s,cl)=>{const p=[];for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,r=i%2?s*.45:s;p.push([x+Math.cos(a)*r,y+Math.sin(a)*r]);}poly(p,cl||'#ffd84a',5);},
   flower:(x,y,s)=>{for(let i=0;i<5;i++){const a=i*Math.PI*2/5;blob(x+Math.cos(a)*s*.55,y+Math.sin(a)*s*.55,s*.42,s*.42,'#ffb6d9',K,4,.02);}blob(x,y,s*.35,s*.35,'#ffd84a',K,4,0);},
   note:(x,y,s)=>{line(x+s*.3,y+s*.5,x+s*.3,y-s*.8,5);line(x+s*.3,y-s*.8,x+s*.9,y-s*.6,5);blob(x,y+s*.5,s*.36,s*.28,{raw:K},K,4,0);},
   note100:(x,y,s)=>{c.save();c.translate(x,y);c.rotate(-.15);rrp(-s,-s*.7,s*2,s*1.4,8);c.fillStyle=F('#fff');c.fill();c.strokeStyle=K;c.lineWidth=5;c.stroke();txt('100',0,2,`700 ${s*.7}px ${HF}`,PR?'#000':'#e84a4a');c.restore();},
   moon:(x,y,s)=>{c.beginPath();c.arc(x,y,s,Math.PI*.35,Math.PI*1.65);c.arc(x+s*.45,y-s*.1,s*.78,Math.PI*1.5,Math.PI*.5,true);c.closePath();c.fillStyle=F('#ffe27a');c.fill();c.strokeStyle=K;c.lineWidth=5;c.stroke();},
   clock:(x,y,s)=>{blob(x,y,s,s,'#fff',K,5,0);line(x,y,x,y-s*.6,5);line(x,y,x+s*.45,y,5);},
   candy:(x,y,s)=>{blob(x,y,s*.6,s*.6,'#ff9ec0',K,5,0);poly([[x-s*.55,y],[x-s*1.1,y-s*.4],[x-s*1.1,y+s*.4]],'#ffd84a',4);poly([[x+s*.55,y],[x+s*1.1,y-s*.4],[x+s*1.1,y+s*.4]],'#ffd84a',4);},
   arrow:(x,y,s)=>{poly([[x-s*.3,y+s],[x+s*.3,y+s],[x+s*.3,y],[x+s*.7,y],[x,y-s],[x-s*.7,y],[x-s*.3,y]],'#ff7a6a',5);},
   book:(x,y,s)=>{poly([[x-s,y-s*.6],[x,y-s*.4],[x+s,y-s*.6],[x+s,y+s*.6],[x,y+s*.8],[x-s,y+s*.6]],'#9cc8f0',5);line(x,y-s*.4,x,y+s*.8,4);},
   planet:(x,y,s)=>{blob(x,y,s*.7,s*.7,'#c9b0f0',K,5,0);c.beginPath();c.ellipse(x,y,s*1.2,s*.35,-.3,0,Math.PI*2);c.strokeStyle=K;c.lineWidth=5;c.stroke();},
   sun:(x,y,s)=>{for(let i=0;i<8;i++){const a=i*Math.PI/4;line(x+Math.cos(a)*s*.8,y+Math.sin(a)*s*.8,x+Math.cos(a)*s*1.2,y+Math.sin(a)*s*1.2,5);}blob(x,y,s*.65,s*.65,'#ffcf4a',K,5,0);}};
  /* 동물 */
  function face(x,y,s,kind){const eyeY=y-s*.05;
    if(['cat','rabbit','chick','dog'].includes(kind)&&(id%3===0)){c.beginPath();c.arc(x-s*.32,eyeY+6,s*.1,Math.PI*1.1,Math.PI*1.9);c.moveTo(x+s*.42,eyeY+6);c.arc(x+s*.32,eyeY+6,s*.1,Math.PI*1.1,Math.PI*1.9);c.strokeStyle=K;c.lineWidth=6;c.stroke();}
    else{blob(x-s*.3,eyeY,s*.07,s*.09,{raw:PR?'#000':'#2a1e18'},false,0,0);blob(x+s*.3,eyeY,s*.07,s*.09,{raw:PR?'#000':'#2a1e18'},false,0,0);if(!PR){blob(x-s*.28,eyeY-s*.03,s*.025,s*.025,'#fff',false,0,0);blob(x+s*.32,eyeY-s*.03,s*.025,s*.025,'#fff',false,0,0);}else{blob(x-s*.3,eyeY,s*.07,s*.09,'#000',false,0,0);blob(x+s*.3,eyeY,s*.07,s*.09,'#000',false,0,0);}}
    if(!PR){blob(x-s*.5,y+s*.12,s*.11,s*.07,'#ffb3c1',false,0,0);blob(x+s*.5,y+s*.12,s*.11,s*.07,'#ffb3c1',false,0,0);}
    if(kind==='chick'||kind==='penguin'){poly([[x-s*.12,y+s*.08],[x+s*.12,y+s*.08],[x,y+s*.24]],'#ffa23a',4);return;}
    if(kind==='seal'){c.beginPath();c.arc(x-s*.08,y+s*.12,s*.08,0,Math.PI);c.arc(x+s*.08,y+s*.12,s*.08,0,Math.PI);c.strokeStyle=K;c.lineWidth=5;c.stroke();blob(x,y+s*.06,s*.06,s*.04,{raw:PR?'#000':'#2a1e18'},false,0,0);line(x-s*.2,y+s*.14,x-s*.42,y+s*.1,3);line(x+s*.2,y+s*.14,x+s*.42,y+s*.1,3);return;}
    blob(x,y+s*.08,s*.05,s*.035,{raw:PR?'#000':'#2a1e18'},false,0,0);
    if(id%2===0){c.beginPath();c.moveTo(x-s*.14,y+s*.15);c.quadraticCurveTo(x,y+s*.42,x+s*.14,y+s*.15);c.closePath();c.fillStyle=F('#e8606a');c.fill();c.strokeStyle=K;c.lineWidth=5;c.stroke();}
    else{c.beginPath();c.arc(x-s*.07,y+s*.13,s*.07,0,Math.PI);c.arc(x+s*.07,y+s*.13,s*.07,0,Math.PI);c.strokeStyle=K;c.lineWidth=5;c.stroke();}}
  function animal(kind,x,y,s,acc){const body={cat:'#ffffff',seal:'#efe2cf',hamster:'#fff4e2',chick:'#ffe066',rabbit:'#ffffff',bear:'#c99a6a',dog:'#fff0d6',penguin:'#4a5a78'}[kind];
    /* 팔 */
    const armUp=['coin','star','clover','heart','mic','pencil','paper','snack','arrow','book','tea','sun'].includes(acc);
    if(kind!=='seal'){blob(x-s*.78,y+s*(armUp?.55:.95),s*.16,s*.2,body,K,6,.02);}
    /* 몸 */
    if(kind==='seal'){c.beginPath();c.moveTo(x-s*1.05,y+s*1.25);c.bezierCurveTo(x-s*1.1,y-s*.95,x+s*1.1,y-s*.95,x+s*1.05,y+s*1.25);c.closePath();c.fillStyle=F(body);c.fill();c.strokeStyle=K;c.lineWidth=6;c.stroke();face(x,y+s*.05,s*1.1,'seal');blob(x+s*.82,y+s*.9,s*.2,s*.14,body,K,6,.02);accessory(acc,x,y-s*.55,s,kind);return;}
    blob(x,y+s*1.05,s*.62,s*.5,kind==='penguin'?'#4a5a78':body,K,6);if(kind==='penguin')blob(x,y+s*1.08,s*.4,s*.38,'#ffffff',false,0,.02);
    /* 귀 */
    if(kind==='cat'){poly([[x-s*.78,y-s*.2],[x-s*.6,y-s*.95],[x-s*.12,y-s*.6]],body);poly([[x+s*.78,y-s*.2],[x+s*.6,y-s*.95],[x+s*.12,y-s*.6]],body);}
    if(kind==='rabbit'){blob(x-s*.3,y-s*.95,s*.17,s*.48,body,K,6,.02);blob(x+s*.3,y-s*.95,s*.17,s*.48,body,K,6,.02);if(!PR){blob(x-s*.3,y-s*.9,s*.07,s*.32,'#ffc3d0',false,0,0);blob(x+s*.3,y-s*.9,s*.07,s*.32,'#ffc3d0',false,0,0);}}
    if(kind==='bear'||kind==='hamster'){blob(x-s*.6,y-s*.58,s*.2,s*.2,kind==='hamster'?'#f3b26a':body,K,6,.02);blob(x+s*.6,y-s*.58,s*.2,s*.2,kind==='hamster'?'#f3b26a':body,K,6,.02);}
    if(kind==='chick'){line(x,y-s*.82,x-s*.08,y-s*1.02,5);line(x,y-s*.82,x+s*.1,y-s*1.0,5);}
    /* 머리 */
    blob(x,y,s*.92,s*.8,kind==='penguin'?'#4a5a78':body,K,6);
    if(kind==='penguin')blob(x,y+s*.08,s*.68,s*.58,'#ffffff',false,0,.02);
    if(kind==='hamster'&&!PR){blob(x-s*.55,y-s*.3,s*.28,s*.22,'#f3b26a',false,0,.05);blob(x+s*.62,y-s*.1,s*.2,s*.26,'#f3b26a',false,0,.05);}
    if(kind==='bear')blob(x,y+s*.16,s*.3,s*.22,'#f1dcc0',K,4,.02);
    if(kind==='cat'){line(x-s*.1,y-s*.72,x-s*.1,y-s*.56,4,PR?'#000':'#b8b0a8');line(x+s*.02,y-s*.74,x+s*.02,y-s*.56,4,PR?'#000':'#b8b0a8');line(x+s*.14,y-s*.72,x+s*.14,y-s*.56,4,PR?'#000':'#b8b0a8');}
    if(kind==='dog'){blob(x-s*.86,y-s*.05,s*.2,s*.4,'#c98a52',K,6,.03);blob(x+s*.86,y-s*.05,s*.2,s*.4,'#c98a52',K,6,.03);}
    face(x,y,s,kind);
    /* 오른팔 */
    blob(x+s*.8,y+s*(armUp?.45:.95),s*.16,s*.2,kind==='penguin'?'#4a5a78':body,K,6,.02);
    accessory(acc,x,y,s,kind,armUp);}
  function accessory(a,x,y,s,kind,armUp){const hx=x+s*.95,hy=y+s*.2;
    switch(a){
     case 'glasses':{rrp(x-s*.62,y-s*.2,s*.5,s*.26,s*.1);c.fillStyle=PR?'#000':'#222';c.fill();rrp(x+s*.12,y-s*.2,s*.5,s*.26,s*.1);c.fill();line(x-s*.12,y-s*.12,x+s*.12,y-s*.12,6,PR?'#000':'#222');if(!PR){line(x-s*.5,y-s*.12,x-s*.38,y-s*.16,4,'#fff');line(x+s*.24,y-s*.12,x+s*.36,y-s*.16,4,'#fff');}break;}
     case 'sprout':{line(x,y-s*.75,x,y-s*1.05,6);D.clover(x,y-s*1.22,s*.26);break;}
     case 'clover':{D.clover(hx+s*.1,hy-s*.25,s*.3);break;}
     case 'band':case 'band2':case 'band3':{const t=a==='band'?'합격':a==='band2'?'집중':'튼튼';rrp(x-s*.82,y-s*.62,s*1.64,s*.26,s*.12);c.fillStyle=F(a==='band3'?'#7ad0b0':'#ff7a6a');c.fill();c.strokeStyle=K;c.lineWidth=5;c.stroke();txt(t,x,y-s*.49,`${s*.2}px ${HF}`,PR?'#000':'#fff');break;}
     case 'crown':{poly([[x-s*.4,y-s*.6],[x-s*.45,y-s*1.0],[x-s*.2,y-s*.8],[x,y-s*1.08],[x+s*.2,y-s*.8],[x+s*.45,y-s*1.0],[x+s*.4,y-s*.6]],'#ffd84a',5);break;}
     case 'nightcap':{poly([[x-s*.6,y-s*.55],[x+s*.5,y-s*.62],[x+s*.95,y-s*1.05]],'#9ab0ff',5);blob(x+s*.98,y-s*1.08,s*.12,s*.12,'#fff',K,4,0);break;}
     case 'cape':{poly([[x-s*.5,y+s*.6],[x+s*.5,y+s*.6],[x+s*.95,y+s*1.5],[x-s*.95,y+s*1.5]],'#ff7a6a',5);break;}
     case 'flower':{D.flower(x+s*.55,y-s*.6,s*.24);break;}
     case 'heart':{D.heart(hx+s*.1,hy-s*.2,s*.32);break;}
     case 'star':{D.star(hx+s*.1,hy-s*.3,s*.34);line(hx,hy+s*.1,hx+s*.1,hy-s*.05,6);break;}
     case 'coin':{D.coin(hx+s*.1,hy-s*.2,s*.3);break;}
     case 'pencil':{c.save();c.translate(hx+s*.05,hy-s*.2);c.rotate(.5);rrp(-s*.07,-s*.45,s*.14,s*.7,4);c.fillStyle=F('#ffd84a');c.fill();c.strokeStyle=K;c.lineWidth=5;c.stroke();poly([[-s*.07,s*.25],[s*.07,s*.25],[0,s*.4]],'#f1dcc0',4);c.restore();break;}
     case 'paper':{c.save();c.translate(hx+s*.08,hy-s*.25);c.rotate(.2);rrp(-s*.2,-s*.26,s*.4,s*.52,4);c.fillStyle=F('#fff');c.fill();c.strokeStyle=K;c.lineWidth=5;c.stroke();for(let i=0;i<3;i++)line(-s*.12,-s*.12+i*s*.12,s*.12,-s*.12+i*s*.12,3);c.restore();break;}
     case 'snack':{D.candy(hx+s*.1,hy-s*.25,s*.28);break;}
     case 'arrow':{D.arrow(hx+s*.1,hy-s*.35,s*.3);break;}
     case 'book':{D.book(hx+s*.05,hy-s*.25,s*.28);break;}
     case 'tea':{rrp(hx-s*.12,hy-s*.35,s*.3,s*.28,6);c.fillStyle=F('#fff');c.fill();c.strokeStyle=K;c.lineWidth=5;c.stroke();line(hx-s*.02,hy-s*.45,hx+s*.02,hy-s*.6,3);break;}
     case 'mic':{blob(hx+s*.1,hy-s*.4,s*.13,s*.13,'#c8c8d0',K,5,0);line(hx+s*.1,hy-s*.28,hx+s*.06,hy,7);break;}
     case 'backpack':{rrp(x-s*.6,y+s*.7,s*.25,s*.55,8);c.fillStyle=F('#ff9a5a');c.fill();c.strokeStyle=K;c.lineWidth=5;c.stroke();break;}
     case 'shield':{poly([[hx-s*.2,hy-s*.5],[hx+s*.35,hy-s*.5],[hx+s*.35,hy-s*.1],[hx+s*.07,hy+s*.12],[hx-s*.2,hy-s*.1]],'#9cc8f0',5);break;}
     case 'helmet':{c.beginPath();c.arc(x,y-s*.05,s*1.02,Math.PI,0);c.strokeStyle=K;c.lineWidth=5;c.stroke();if(!PR){c.fillStyle='rgba(180,220,255,.25)';c.fill();}break;}
     case 'sun':{D.sun(hx+s*.1,hy-s*.35,s*.24);break;}
    }}
  /* ===== 모양 1: 세로 부적 ===== */
  const t=S[0],msg=S[1],kind=S[2],acc=S[3],deco=S[4].split(','),ts=S[6],fr=S[7],seal=S[8];
  if(S[9]==='p'){
    c.fillStyle=PR?'#fff':'#ffffff';c.fillRect(0,0,CW,CH);
    rrp(24,24,CW-48,CH-48,18);c.fillStyle=F(P.frame);c.fill();c.strokeStyle=K;c.lineWidth=7;c.stroke();
    rrp(62,62,CW-124,CH-124,8);c.fillStyle=F(P.bg);c.fill();c.strokeStyle=LN;c.lineWidth=6;c.stroke();
    rrp(78,78,CW-156,CH-156,6);c.strokeStyle=PR?'#000':P.line;c.lineWidth=2.5;c.stroke();
    const corners=[[92,92],[CW-92,92],[92,CH-92],[CW-92,CH-92]];
    corners.forEach(([x,y],i)=>{if(fr==='crown')poly([[x-22,y+10],[x-24,y-12],[x-10,y],[x,y-16],[x+10,y],[x+24,y-12],[x+22,y+10]],P.acc,4);else if(fr==='heart')D.heart(x,y,18,P.acc);else if(fr==='bracket'){c.strokeStyle=PR?'#000':P.line;c.lineWidth=6;c.beginPath();const sx=i%2?-1:1,sy=i<2?1:-1;c.moveTo(x-sx*6,y+sy*30);c.lineTo(x-sx*6,y-sy*6);c.lineTo(x+sx*30,y-sy*6);c.stroke();c.strokeRect(x+sx*4-6,y+sy*4-6,12,12);}});
    /* 제목 */
    const tc=PR?'#000':P.line;
    if(ts==='pill'){c.font=`64px ${HF}`;const w=Math.min(500,c.measureText(t).width+90);rrp(CW/2-w/2,108,w,104,52);c.fillStyle=F('#ffe066');c.fill();c.strokeStyle=K;c.lineWidth=6;c.stroke();rrp(CW/2-w/2+12,120,w-24,80,40);c.strokeStyle=PR?'#000':P.line;c.lineWidth=3;c.stroke();txt(t,CW/2,163,`64px ${HF}`,PR?'#000':'#3a2a22',PR?null:'#fff',8);}
    else if(ts==='burst'){const ch=[...t.replace(/ /g,'')];const n=ch.length;const step=Math.min(120,(CW-200)/n);ch.forEach((h,i)=>{const x=CW/2-(n-1)*step/2+i*step,y=162+(i%2?10:-6);const p=[];for(let k=0;k<20;k++){const a=k*Math.PI/10,r=k%2?step*.38:step*.52;p.push([x+Math.cos(a)*r,y+Math.sin(a)*r]);}poly(p,'#ffcf4a',5);txt(h,x,y+3,`${Math.min(62,step*.55)}px ${HF}`,PR?'#000':'#3a2a22');});}
    else if(ts==='band'){poly([[110,120],[CW-110,120],[CW-140,166],[CW-110,212],[110,212],[140,166]],P.acc,6);txt(t,CW/2,168,`66px ${HF}`,PR?'#000':'#fff',PR?null:'#3a2a22',8);}
    else{txt('오늘도 난 최고',CW/2,118,`36px ${HF}`,tc);const ws=t.split(' ');const pr=ws.length>2?[ws.slice(0,2).join(' '),ws.slice(2).join(' ')]:ws;pr.forEach((w,i)=>txt(w,CW/2,186+i*86,`96px ${HF}`,PR?'#000':P.line,PR?null:'#fff',10));}
    const ty=ts==='plain'?330:250;
    /* 장식 */
    const slots=[[150,ty+20],[CW-150,ty+30],[120,ty+150],[CW-120,ty+140],[200,ty+250],[CW-200,ty+260],[130,ty+360],[CW-130,ty+350],[250,ty+60],[CW-250,ty+80]];
    slots.forEach(([x,y],i)=>{const k=deco[i%deco.length];const sz=k==='spark'?18+rnd()*14:k==='bill'?34:k==='note100'?42:24+rnd()*10;(D[k]||D.spark)(x+(rnd()-.5)*30,y+(rnd()-.5)*24,sz);});
    /* 동물 */
    const ay=ts==='plain'?560:530;animal(kind,CW/2,ay,ts==='plain'?110:128,acc);
    /* 한마디 */
    c.font=`700 42px ${MF}`;const words=msg.split(' ');const lines=[];let cur='';words.forEach(w=>{const tt=cur?cur+' '+w:w;if(c.measureText(tt).width>CW-220&&cur){lines.push(cur);cur=w;}else cur=tt;});if(cur)lines.push(cur);
    const bh=lines.length*50+44,by=CH-110-bh;rrp(104,by,CW-208,bh,24);c.fillStyle=PR?'#fff':'rgba(255,255,255,.9)';c.fill();c.strokeStyle=K;c.lineWidth=5;c.stroke();
    lines.forEach((l,i)=>txt(l,CW/2,by+42+i*50,`700 42px ${MF}`,PR?'#000':'#3a2a22'));
    if(seal){const sx=CW-150,sy=by-58;blob(sx,sy,40,46,PR?'#fff':'#fff',PR?'#000':'#d8322a',5,.04);const sc=PR?'#000':'#d8322a';const sch=[...seal];sch.length===1?txt(seal,sx,sy+2,`44px ${HF}`,sc):sch.forEach((h,i)=>txt(h,sx,sy-18+i*34*(2/sch.length),`${sch.length>2?22:30}px ${HF}`,sc));}
    txt(`오늘의 부적 No.${String(id+1).padStart(2,'0')}`,CW/2,CH-86,`22px ${HF}`,PR?'#000':'rgba(60,40,30,.55)');
  } else {
  /* ===== 모양 2: 운세 쪽지 ===== */
    c.fillStyle='#fff';c.fillRect(0,0,CW,CH);
    c.save();c.translate(CW/2,CH/2);c.rotate(-.06);
    const w=CW-90,h=CH-180;rrp(-w/2,-h/2,w,h,22);c.fillStyle=F(P.frame);c.fill();c.strokeStyle=K;c.lineWidth=7;c.stroke();
    if(!PR){for(let i=0;i<500;i++){c.fillStyle=`rgba(255,255,255,${rnd()*.25})`;c.fillRect(-w/2+rnd()*w,-h/2+rnd()*h,3,3);}}
    txt(t,0,-h/2+110,`76px ${HF}`,PR?'#000':'#2a1e18');
    line(-w/2+60,-h/2+180,w/2-60,-h/2+186,6);
    animal(kind,0,-h/2+380,120,acc);
    c.font=`700 52px ${MF}`;const words=msg.split(' ');const lines=[];let cur='';words.forEach(wd=>{const tt=cur?cur+' '+wd:wd;if(c.measureText(tt).width>w-120&&cur){lines.push(cur);cur=wd;}else cur=tt;});if(cur)lines.push(cur);
    line(-w/2+60,h/2-80-lines.length*64-40,w/2-60,h/2-80-lines.length*64-34,6);
    lines.forEach((l,i)=>txt(l,0,h/2-80-(lines.length-1-i)*64-10,`700 52px ${MF}`,PR?'#000':'#2a1e18'));
    D.clover(-w/2+90,-h/2+260,34);D.clover(w/2-90,h/2-60-lines.length*64-130,30);D.spark(w/2-110,-h/2+260,22);D.spark(-w/2+120,h/2-lines.length*64-170,16);
    c.restore();
    txt(`오늘의 부적 No.${String(id+1).padStart(2,'0')}`,CW/2,CH-40,`22px ${HF}`,PR?'#000':'rgba(60,40,30,.55)');
  }
}
/* ---------- 프린터 (Web Bluetooth) ---------- */
const BT={ch:null,kind:'',name:''};
const SVC=[0xff00,0x18f0,0xae30,0xffe0,0xfff0,'49535343-fe7d-4ae5-8fa9-9fafd205e455','e7810a71-73ae-499d-8c15-faa9aef0c3f2'];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function btConnect(){if(!navigator.bluetooth)throw new Error('nobt');const dev=await navigator.bluetooth.requestDevice({acceptAllDevices:true,optionalServices:SVC});const g=await dev.gatt.connect();let ch=null,kind='escpos';
  for(const sv of SVC){let s;try{s=await g.getPrimaryService(sv);}catch(e){continue;}const cs=await s.getCharacteristics();const w=cs.find(x=>x.properties.writeWithoutResponse)||cs.find(x=>x.properties.write);if(w){ch=w;if(sv===0xff00)kind='phomemo';break;}}
  if(!ch)throw new Error('nochar');BT.ch=ch;BT.kind=kind;BT.name=dev.name||'프린터';dev.addEventListener('gattserverdisconnected',()=>{BT.ch=null;});}
async function btWrite(b,on){const ch=BT.ch;const nr=ch.properties.writeWithoutResponse;const N=nr?120:180;for(let i=0;i<b.length;i+=N){const p=b.slice(i,i+N);if(nr&&ch.writeValueWithoutResponse)await ch.writeValueWithoutResponse(p);else await ch.writeValue(p);if(nr)await sleep(BT.kind==='phomemo'?18:12);if(on&&(i/N)%20===0)on(i/b.length);}if(on)on(1);}
function job(src,pw,kind){const h=Math.round(src.height*pw/src.width);const cv=document.createElement('canvas');cv.width=pw;cv.height=h;const c=cv.getContext('2d');c.fillStyle='#fff';c.fillRect(0,0,pw,h);c.drawImage(src,0,0,pw,h);const d=c.getImageData(0,0,pw,h).data;const bw=pw/8;const r=new Uint8Array(bw*h);
  for(let y=0;y<h;y++)for(let x=0;x<pw;x++){const k=(y*pw+x)*4;if(d[k]*.3+d[k+1]*.59+d[k+2]*.11<150)r[y*bw+(x>>3)]|=(0x80>>(x&7));}
  const o=[];const push=a=>o.push(...a);push([0x1b,0x40]);if(kind==='phomemo')push([0x1b,0x61,0x01,0x1f,0x11,0x02,0x04]);
  for(let y=0;y<h;y+=255){const n=Math.min(255,h-y);push([0x1d,0x76,0x30,0x00,bw&255,bw>>8,n&255,n>>8]);for(let i=y*bw;i<(y+n)*bw;i++)o.push(r[i]);}
  if(kind==='phomemo')push([0x1b,0x64,0x02,0x1b,0x64,0x02,0x1f,0x11,0x08,0x1f,0x11,0x0e,0x1f,0x11,0x07,0x1f,0x11,0x09]);else push([0x1b,0x64,0x04]);return new Uint8Array(o);}
const ALLTXT=C.map(x=>x[0]+x[1]+x[8]).join('')+'오늘도난최고오늘의부적No.0123456789긁어서확인!숨어있어요';let FR=null;
async function fontsReady(){if(!FR)FR=Promise.race([(async()=>{try{await Promise.all([document.fonts.load('40px "Jua"',ALLTXT),document.fonts.load('700 40px "Gaegu"',ALLTXT)]);}catch(e){}})(),new Promise(r=>setTimeout(r,2500))]);return FR;}
window.__charmJob=async(id,pw,kind)=>{await fontsReady();const cv=document.createElement('canvas');draw(cv,id,true);return Array.from(job(cv,pw,kind));};

/* ---------- 화면 ---------- */
const md=document.createElement('div');md.id='charm';md.className='modal';
md.innerHTML=`<div class="sheet paper"><div class="grip"></div><div class="sh"><button class="back" data-cback>‹ 뒤로</button><span>🎟️ 오늘의 부적 복권</span><button class="x" data-cclose>×</button></div><div id="chBody"></div></div>`;
document.body.appendChild(md);
const st=document.createElement('style');st.textContent=`#chBody .lotto{position:relative;margin:2px auto 10px;width:min(100%,340px);border-radius:16px;background:#fff;padding:10px 10px 8px;box-shadow:0 6px 18px rgba(80,50,20,.18);border:2px dashed #e0b070}
#chBody .lotto .lh{display:flex;justify-content:space-between;font-size:12px;color:#8a6a52;margin:0 2px 6px;font-weight:700}#chBody .lotto .lh b{color:#d24a2e}
#chBody .cWrap{position:relative;width:100%;aspect-ratio:720/1000;border-radius:10px;overflow:hidden}#chBody .cWrap img,#chBody .cWrap canvas{position:absolute;inset:0;width:100%;height:100%}#chBody #chScr{touch-action:none;cursor:pointer;transition:opacity .6s}
#chBody .cMsg{text-align:center;font-size:14px;color:#6a4a2a;margin:2px 0 10px;line-height:1.5}
#chBody .cBtns{display:flex;gap:8px;margin:6px 0}#chBody .cBtns button{flex:1;margin:0;padding:11px 6px;font-size:14px}
#chBody .cBook{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:8px}#chBody .cBook button{aspect-ratio:720/1000;padding:0;border-radius:8px;border:1px solid #e2cfb4;background:#f6ead4;overflow:hidden;font-size:18px;color:#b09070}#chBody .cBook img{width:100%;height:100%;object-fit:cover;display:block}
#chBody h4{margin:14px 0 4px;font-size:14px;color:#6a4a2a}`;document.head.appendChild(st);
let back='menu',view=null;const thumbs={};
function thumb(i){if(thumbs[i])return thumbs[i];const cv=document.createElement('canvas');draw(cv,i,false);const t=document.createElement('canvas');t.width=144;t.height=200;t.getContext('2d').drawImage(cv,0,0,144,200);return thumbs[i]=t.toDataURL('image/png');}
async function render(){await fontsReady();const T=pickToday();const id=view==null?T.id:view;const isToday=view==null;const b=book();const all=typeof ADMIN_ON!=='undefined'&&ADMIN_ON;
  const cv=document.createElement('canvas');draw(cv,id,false);const src=cv.toDataURL('image/png');const opened=!isToday||T.open;
  $q('#chBody').innerHTML=`<div class="lotto"><div class="lh"><span>🎟️ ${isToday?'오늘의 부적 복권':'부적 도감'}</span><span>${isToday?T.d.replace(/-/g,'.'):''} · <b>No.${String(id+1).padStart(2,'0')}</b></span></div>
   <div class="cWrap"><img id="chImg" src="${src}" alt="오늘의 부적">${opened?'':'<canvas id="chScr" width="360" height="500"></canvas>'}</div></div>
   <div class="cMsg">${opened?`<b>“${E(C[id][1])}”</b>`:'은박을 손가락으로 쓱쓱 긁어 보세요! 🪙<br><small>하루에 한 장 · 자정이 지나면 새 복권이 와요</small>'}</div>
   ${opened?`<div class="cBtns"><button class="ghost" data-csave>💾 이미지 저장</button><button class="primary" data-cprint>🖨️ 영수증 프린터</button></div>`:`<div class="cBtns"><button class="ghost" data-cpeel>✨ 한 번에 벗기기</button></div>`}
   ${!isToday?'<div class="cBtns"><button class="ghost" data-ctoday>🎟️ 오늘의 복권으로</button></div>':''}
   <h4>📖 부적 도감 ${b.length}/${N}${all?' <small style="font-weight:400">(선생님은 전체 미리보기)</small>':''}</h4><div class="cBook">${C.map((x,i)=>(b.includes(i)||all)?`<button data-cview="${i}" title="${E(x[0])}"><img src="${thumb(i)}" alt=""></button>`:`<button disabled>❔</button>`).join('')}</div>`;
  if(!opened)setupScratch();}
function reveal(){const T=pickToday();T.open=true;LS.set('charmToday',T);const b=book();if(!b.includes(T.id)){b.push(T.id);LS.set('charmBook',b);}const s=$q('#chScr');if(s){s.style.opacity='0';setTimeout(render,600);}else render();try{if(typeof chime==='function')chime();}catch(e){}toast('🎉 오늘의 부적: '+C[T.id][0]);}
function setupScratch(){const s=$q('#chScr');if(!s)return;const c=s.getContext('2d');const g=c.createLinearGradient(0,0,360,500);g.addColorStop(0,'#c9ccd3');g.addColorStop(.5,'#eef0f4');g.addColorStop(1,'#b8bcc6');c.fillStyle=g;c.fillRect(0,0,360,500);
  c.fillStyle='rgba(120,125,140,.35)';for(let y=20;y<500;y+=46)for(let x=(y/46)%2?30:6;x<360;x+=56){c.font='22px sans-serif';c.fillText('🍀',x,y);}
  c.fillStyle='#5a5e6a';c.font='700 30px "Jua",sans-serif';c.textAlign='center';c.fillText('긁어서 확인!',180,240);c.font='20px "Jua",sans-serif';c.fillText('오늘의 부적이 숨어 있어요',180,276);
  c.globalCompositeOperation='destination-out';let down=false,last=null,cnt=0;
  const pos=e=>{const r=s.getBoundingClientRect();return [(e.clientX-r.left)*360/r.width,(e.clientY-r.top)*500/r.height];};
  const scr=p=>{c.lineWidth=46;c.lineCap='round';c.beginPath();c.moveTo(...(last||p));c.lineTo(...p);c.stroke();c.beginPath();c.arc(p[0],p[1],23,0,7);c.fill();last=p;if(++cnt%12===0)check();};
  const check=()=>{const d=c.getImageData(0,0,360,500).data;let z=0,t=0;for(let i=3;i<d.length;i+=64){t++;if(d[i]===0)z++;}if(z/t>.45){down=false;reveal();}};
  s.addEventListener('pointerdown',e=>{down=true;last=null;s.setPointerCapture(e.pointerId);scr(pos(e));});s.addEventListener('pointermove',e=>{if(down)scr(pos(e));});s.addEventListener('pointerup',()=>{down=false;last=null;check();});}
const pm=document.createElement('div');pm.style.cssText='position:fixed;inset:0;z-index:90;background:rgba(40,22,10,.45);display:none;align-items:center;justify-content:center;padding:20px';document.body.appendChild(pm);
function openPrint(id){const S=LS.get('ytPrinter',{w:'auto'});const ios=/iPhone|iPad|iPod/i.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  pm.innerHTML=`<div class="tnCard" style="max-width:360px;text-align:left"><div class="tnIco" style="text-align:center">🖨️</div><b style="text-align:center">부적을 영수증 프린터로 뽑기</b>${navigator.bluetooth?`<p style="white-space:normal">프린터 전원을 켜고 <b>연결하고 출력</b>을 누른 뒤 목록에서 프린터를 골라요. 흑백 그림으로 나와요.</p>
   <label style="display:block;font-size:13px;margin:4px 0">용지 폭 · 해상도 <select id="chPw" style="width:100%;margin-top:4px;padding:8px;border-radius:10px;border:1px solid #d9c3a3;font:inherit"><option value="auto"${S.w==='auto'?' selected':''}>자동 (MEEMO·Phomemo M02S → 300dpi)</option><option value="576"${S.w==='576'?' selected':''}>58mm · 300dpi (576점)</option><option value="384"${S.w==='384'?' selected':''}>58mm · 203dpi (384점) — 일반 영수증 프린터</option></select></label>
   <div id="chPrMsg" style="font-size:13px;min-height:20px;margin:8px 0;color:#6a4a2a">${BT.ch?'✅ '+E(BT.name)+' 연결됨':''}</div><div class="tnBtns"><button class="ghost" data-px>닫기</button><button class="primary" data-pgo="${id}">${BT.ch?'🖨️ 출력하기':'🔗 연결하고 출력'}</button></div>`
   :`<p style="white-space:normal">${ios?'아이폰·아이패드의 브라우저는 블루투스 프린터에 바로 연결할 수 없어요.':'이 브라우저는 블루투스 프린터 연결을 지원하지 않아요. 안드로이드 크롬이나 PC 크롬·엣지에서 열어 주세요.'}<br><br>① <b>💾 이미지 저장</b>으로 부적을 저장하고<br>② 프린터 앱(MEEMO 앱 등)에서 그 사진을 골라 출력해요</p><div class="tnBtns"><button class="primary" data-px>알겠어요</button></div>`}</div>`;pm.style.display='flex';}
pm.addEventListener('click',async e=>{if(e.target===pm||e.target.closest('[data-px]')){pm.style.display='none';return;}const g=e.target.closest('[data-pgo]');if(!g)return;const msg=pm.querySelector('#chPrMsg');const S=LS.get('ytPrinter',{w:'auto'});S.w=pm.querySelector('#chPw').value;LS.set('ytPrinter',S);
  g.disabled=true;try{if(!BT.ch){msg.textContent='🔎 프린터를 찾는 중… 목록에서 골라 주세요';await btConnect();}msg.textContent='🎨 부적을 준비하는 중…';await fontsReady();const cv=document.createElement('canvas');draw(cv,+g.dataset.pgo,true);
    const pw=S.w==='auto'?(BT.kind==='phomemo'?576:384):+S.w;await btWrite(job(cv,pw,BT.kind),p=>{msg.textContent=`🖨️ ${E(BT.name)}로 보내는 중… ${Math.round(p*100)}%`;});msg.innerHTML='✅ 다 보냈어요! 종이가 다 나오면 뜯어 주세요.';g.textContent='🖨️ 한 장 더';}
  catch(err){const m=String(err&&err.message||err);BT.ch=null;msg.innerHTML=/cancel|chosen/i.test(m)?'프린터를 고르지 않았어요.':m==='nochar'?'⚠️ 이 기기에서 인쇄 통로를 찾지 못했어요. 이미지 저장 후 프린터 앱으로 출력해 주세요.':'⚠️ 연결이 끊겼거나 보내지 못했어요. 전원과 거리(1m 안)를 확인하고 다시 눌러 주세요.';g.textContent='🔗 다시 연결하고 출력';}
  g.disabled=false;});
md.addEventListener('click',async e=>{
  if(e.target===md||e.target.closest('[data-cclose]')){md.classList.remove('show');return;}
  if(e.target.closest('[data-cback]')){md.classList.remove('show');if(back&&typeof openSheet==='function')openSheet(back);return;}
  if(e.target.closest('[data-cpeel]')){reveal();return;}
  const v=e.target.closest('[data-cview]');if(v){view=+v.dataset.cview;render();md.querySelector('.sheet').scrollTop=0;return;}
  if(e.target.closest('[data-ctoday]')){view=null;render();return;}
  const id=view==null?pickToday().id:view;
  if(e.target.closest('[data-cprint]')){openPrint(id);return;}
  if(e.target.closest('[data-csave]')){await fontsReady();const cv=document.createElement('canvas');draw(cv,id,false);const name=`오늘의부적_${String(id+1).padStart(2,'0')}.png`;
    cv.toBlob(async blob=>{const file=new File([blob],name,{type:'image/png'});try{if(navigator.canShare&&navigator.canShare({files:[file]})&&/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)){await navigator.share({files:[file],title:'오늘의 부적'});return;}}catch(err){if(err&&err.name==='AbortError')return;}
      const u=URL.createObjectURL(blob);const a=document.createElement('a');a.href=u;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),4000);toast('💾 부적을 저장했어요');},'image/png');}
});
window.__charmDraw=(cv,id,PR)=>draw(cv,id,PR);window.__charmN=N;
window.openCharm=function(from){back=from||'menu';view=null;if(typeof closeSheets==='function')closeSheets();md.classList.add('show');render();};
})();
