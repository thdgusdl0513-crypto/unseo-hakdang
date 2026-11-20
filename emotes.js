/* 운서학당 · 행동(이모트): 인사, 꾸벅, 하트, 박수, 신나, 춤, 화이팅, 꾸벅잠 */
const EMOTES=[['wave','👋','인사'],['bow','🙇','꾸벅'],['heart','💗','하트'],['clap','👏','박수'],['jump','🎉','신나'],['dance','💃','춤'],['cheer','💪','화이팅'],['sleep','😴','꾸벅잠']];
const EM_DUR={wave:2.4,bow:2.0,heart:2.8,clap:2.4,jump:2.2,dance:3.4,cheer:2.2,sleep:4.2};
const EM_FACE={wave:'smile',bow:'smile',heart:'shy',clap:'joy',jump:'joy',dance:'joy',cheer:'joy',sleep:'sleepy'};
const EM_FX={heart:['heart',.22],clap:['star',.3],jump:['confetti',.08],dance:['note',.35],cheer:['star',.4],sleep:['z',.7],wave:['star',.9]};

/* 떠오르는 작은 그림들 */
const EMTEX={};
function emTex(kind,v){const key=kind+(v||'');if(EMTEX[key])return EMTEX[key];const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');
  if(kind==='heart'){g.fillStyle=['#f2647e','#f78fa7','#e8486a'][v||0];g.beginPath();g.moveTo(32,54);g.bezierCurveTo(4,36,6,10,22,10);g.bezierCurveTo(28,10,32,15,32,20);g.bezierCurveTo(32,15,36,10,42,10);g.bezierCurveTo(58,10,60,36,32,54);g.fill();g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(21,20,5,3.5,-.6,0,Math.PI*2);g.fill();}
  else if(kind==='star'){g.fillStyle=['#f6c84a','#fbe39a','#f2a84a'][v||0];g.beginPath();for(let i=0;i<10;i++){const r=i%2?11:28,a=-Math.PI/2+i*Math.PI/5;g.lineTo(32+Math.cos(a)*r,32+Math.sin(a)*r);}g.closePath();g.fill();}
  else if(kind==='note'){g.fillStyle=['#7a5aa8','#4a8ac8','#c4384a'][v||0];g.font='bold 46px serif';g.textAlign='center';g.textBaseline='middle';g.fillText(['♪','♫','♬'][v||0],32,34);}
  else if(kind==='z'){g.fillStyle='#6a7aa8';g.font='bold 40px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText('Z',32,34);}
  else if(kind==='confetti'){g.fillStyle=['#c4384a','#f2c84b','#3f9a6a','#4a8ac8','#e88a4a','#8a4ab8'][v||0];g.fillRect(22,14,20,36);}
  const t=new THREE.CanvasTexture(c);EMTEX[key]=t;return t;}
const EMP=[];
function emSpawn(A,kind){const n=kind==='confetti'?3:1;for(let i=0;i<n;i++){const v=Math.floor(Math.random()*(kind==='confetti'?6:3));
  const m=new THREE.SpriteMaterial({map:emTex(kind,v),transparent:true,depthWrite:false});const s=new THREE.Sprite(m);
  const sz=kind==='confetti'?.13:kind==='z'?.26:.3;s.scale.set(sz,sz,1);const p=A.root.position,h=A.h||2;
  s.position.set(p.x+(Math.random()-.5)*.7,h*(kind==='confetti'?1.0:.85)+Math.random()*.2,p.z+(Math.random()-.5)*.5);
  scene.add(s);EMP.push({s,m,age:0,life:kind==='confetti'?1.2:1.6,vy:kind==='confetti'?1.6:.7,vx:(Math.random()-.5)*(kind==='confetti'?1.4:.3),sw:Math.random()*6,kind,sz,g:kind==='confetti'?3.2:0});}}
function emoteFxTick(dt){for(let i=EMP.length-1;i>=0;i--){const P=EMP[i];P.age+=dt;const k=P.age/P.life;
  P.vy-=P.g*dt;P.s.position.y+=P.vy*dt;P.s.position.x+=(P.vx+Math.sin(P.age*4+P.sw)*.25)*dt;
  const pop=Math.min(1,P.age*6);P.s.scale.set(P.sz*pop*(1+k*.25),P.sz*pop*(1+k*.25),1);P.m.rotation=P.kind==='confetti'?P.age*6+P.sw:Math.sin(P.age*3+P.sw)*.2;
  P.m.opacity=k>.6?Math.max(0,1-(k-.6)/.4):1;if(k>=1){scene.remove(P.s);P.m.dispose();EMP.splice(i,1);}}}

function playEmote(A,k){if(!EM_DUR[k])return;A.em={k,t0:performance.now()/1000,nx:0};}
function emoteFace(A){return A.em?EM_FACE[A.em.k]:null;}
function emoteTick(A,dt){const B=A.bob;if(!A.em){if(A.emWas){B.rotation.x=B.rotation.y=0;if(A.head)A.head.rotation.x=0;A.emWas=false;}return;}
  const now=performance.now()/1000,el=now-A.em.t0,k=A.em.k,D=EM_DUR[k];if(el>D){A.em=null;return;}A.emWas=true;
  const e=Math.min(1,el*5,(D-el)*5),bell=Math.sin(Math.PI*Math.min(1,el/D));
  const fx=EM_FX[k];if(fx&&el>=A.em.nx){emSpawn(A,fx[0]);A.em.nx=el+fx[1];}
  const arm=(a,x,z)=>{if(a.wing){a.g.rotation.z=a.s*(Math.abs(Math.sin(el*14))*1.1+.2)*e;return;}a.g.rotation.x=a.g.rotation.x*(1-e)+x*e;a.g.rotation.z=a.g.rotation.z*(1-e)+z*e;};
  const R=A.arms.find(a=>a.s>0)||A.arms[0];
  B.rotation.x=0;B.rotation.y=0;
  if(k==='wave'){if(R)arm(R,2.2,R.s*(.55+Math.sin(el*12)*.4));if(A.head)A.head.rotation.z=Math.sin(el*3)*.1*e;}
  else if(k==='bow'){const b=Math.sin(Math.PI*Math.min(1,el/1.4));B.rotation.x=-.55*Math.max(0,b);A.arms.forEach(a=>arm(a,.35,a.s*.1));}
  else if(k==='heart'){A.arms.forEach(a=>arm(a,2.75,-a.s*.35));B.position.y+=Math.abs(Math.sin(el*5))*.04;if(A.head)A.head.rotation.z=Math.sin(el*2.5)*.12*e;}
  else if(k==='clap'){const c=Math.abs(Math.sin(el*12));A.arms.forEach(a=>arm(a,1.25,-a.s*(.05+c*.4)));B.position.y+=c*.02;}
  else if(k==='jump'){B.position.y+=Math.abs(Math.sin(el*7))*.45*e;A.arms.forEach(a=>arm(a,.9,a.s*(1.9+Math.sin(el*14)*.25)));A.legs.forEach(l=>l.g.rotation.x=Math.abs(Math.sin(el*7))*-.4*e);}
  else if(k==='dance'){B.rotation.y=Math.sin(el*5)*.7*e;B.rotation.z=Math.sin(el*10)*.08*e;B.position.y+=Math.abs(Math.sin(el*10))*.08*e;A.arms.forEach(a=>arm(a,Math.sin(el*10+a.s)*.4,a.s*(1.3+Math.sin(el*10+a.s*1.5)*.8)));A.legs.forEach(l=>l.g.rotation.x=Math.sin(el*10+l.ph)*.35*e);}
  else if(k==='cheer'){const p=Math.abs(Math.sin(el*8));if(R)arm(R,2.4+p*.5,R.s*.25);A.arms.forEach(a=>{if(a!==R)arm(a,.3,a.s*.6);});B.position.y+=p*.06*e;}
  else if(k==='sleep'){if(A.head)A.head.rotation.x=(.32+Math.sin(el*2.2)*.08)*e;B.rotation.z=Math.sin(el*1.6)*.07*e;A.arms.forEach(a=>arm(a,.2,a.s*.08));}
}
