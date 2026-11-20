/* 운서학당 · spaces & seasons */
const MONTHS={1:['snow','한겨울 눈','❄️'],2:['snow','겨울 끝자락','❄️'],3:['spring','이른 봄','🌱'],4:['spring','벚꽃','🌸'],5:['birthday','생일 축하의 달','🎂'],6:['summer','화창한 초여름','☀️'],7:['rain','장마','☔'],8:['summer','한여름 햇살','🌻'],9:['autumn','초가을','🍂'],10:['halloween','할로윈','🎃'],11:['autumn','단풍','🍁'],12:['xmas','크리스마스','🎄']};
let SEASON=null;
function makeSeason(month,tod){const [key,name,ico]=MONTHS[month];const S={month,key,name,ico,tod};
  const snowy=key==='snow'||key==='xmas';S.snow=snowy;S.rain=key==='rain';
  S.leaf={1:null,2:null,3:0xf6c6d2,4:0xf4b4c6,5:0x86c060,6:0x5c9c40,7:0x4c8a3a,8:0x4c8c36,9:0xa9b444,10:0xd9782a,11:0xc8452c,12:null}[month];
  S.leaf2={9:0xd8c048,10:0xe8a830,11:0xe8b438}[month]||null;S.blossom=month===3||month===4;S.someBlossom=month===5;
  S.ground={snow:0xe6edf2,xmas:0xe6edf2,spring:0x6c9a52,birthday:0x6aa04c,summer:0x4f8a3c,rain:0x46683a,autumn:month===9?0x7a8a44:0x8a7444,halloween:0x6a6440}[key];
  const day={snow:0xc9d6e2,xmas:0xc4d2e2,spring:0xc8dcea,birthday:0xbfe2f2,summer:0x8ec8ee,rain:0x8c99a3,autumn:0xd6d0b8,halloween:0xd0a07a}[key];
  const night={halloween:0x1d1030,xmas:0x0f1a33,rain:0x111a1f}[key]||0x0e1a24;
  S.sky=tod==='day'?day:tod==='dusk'?new THREE.Color(day).lerp(new THREE.Color(0xe08a5a),.55).getHex():night;
  S.fogD=S.rain?.03:tod==='night'?.022:.014;
  S.hemi=tod==='day'?(S.rain?.75:.95):tod==='dusk'?.65:.42;S.sun=tod==='day'?(S.rain?.4:1.05):tod==='dusk'?.55:.3;
  S.sunColor=tod==='day'?0xfff2dc:tod==='dusk'?0xffb37a:0x9fb6dc;S.night=tod!=='day';
  return S;}
function autoTod(){const h=new Date().getHours();return h>=6&&h<17?'day':h>=17&&h<19?'dusk':'night';}

function windowTex(S){return ctex(128,160,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);const c=new THREE.Color(S.sky);gr.addColorStop(0,'#'+c.clone().multiplyScalar(S.night?1.6:1).getHexString());gr.addColorStop(1,'#'+c.clone().lerp(new THREE.Color(S.night?0x223344:0xffffff),.35).getHexString());g.fillStyle=gr;g.fillRect(0,0,w,h);
  if(S.night){g.fillStyle='#f4ecd0';g.beginPath();g.arc(92,34,12,0,PI*2);g.fill();for(let i=0;i<20;i++){g.fillStyle='rgba(255,250,230,.8)';g.fillRect(rnd()*w,rnd()*h*.5,1.5,1.5);}}
  g.fillStyle=S.night?'#1a2a2a':'#4a6a5a';g.beginPath();g.moveTo(0,h);g.lineTo(0,h*.72);g.quadraticCurveTo(40,h*.55,70,h*.7);g.quadraticCurveTo(100,h*.58,w,h*.68);g.lineTo(w,h);g.fill();
  const lc=S.leaf||S.leaf2;if(lc){g.fillStyle='#'+new THREE.Color(lc).multiplyScalar(S.night?.5:1).getHexString();for(let i=0;i<14;i++){g.beginPath();g.arc(R(0,w),R(h*.6,h*.85),R(8,16),0,PI*2);g.fill();}}
  if(S.snow){g.fillStyle='#f4f8fb';g.fillRect(0,h*.86,w,h);for(let i=0;i<40;i++){g.beginPath();g.arc(rnd()*w,rnd()*h,1.5,0,PI*2);g.fill();}}
  if(S.rain){g.strokeStyle='rgba(220,235,245,.6)';for(let i=0;i<40;i++){const x=rnd()*w,y=rnd()*h;g.beginPath();g.moveTo(x,y);g.lineTo(x-2,y+10);g.stroke();}}});}

function cityWindowTex(S){return ctex(512,288,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);
  if(S.tod==='night'){gr.addColorStop(0,'#141c3a');gr.addColorStop(.7,'#3a2a5a');gr.addColorStop(1,'#5a3a5a');}else if(S.tod==='dusk'){gr.addColorStop(0,'#6a5aa8');gr.addColorStop(.45,'#c88ab8');gr.addColorStop(.8,'#f2a870');gr.addColorStop(1,'#f8c880');}
  else{const c=new THREE.Color(S.sky);gr.addColorStop(0,'#'+c.clone().multiplyScalar(.85).getHexString());gr.addColorStop(1,'#'+c.clone().lerp(new THREE.Color(0xfff0d8),.5).getHexString());}
  g.fillStyle=gr;g.fillRect(0,0,w,h);
  if(S.tod==='night'){g.fillStyle='#f6eed0';g.beginPath();g.arc(400,50,16,0,PI*2);g.fill();for(let i=0;i<50;i++){g.fillStyle='rgba(255,250,230,.8)';g.fillRect(rnd()*w,rnd()*h*.5,1.5,1.5);}}
  g.fillStyle=S.tod==='dusk'?'rgba(255,200,170,.5)':'rgba(255,255,255,.35)';for(let i=0;i<9;i++){const x=rnd()*w,y=R(20,120);g.beginPath();g.ellipse(x,y,R(30,70),R(6,12),0,0,PI*2);g.fill();}
  const bc=S.tod==='night'?'#2a2440':S.tod==='dusk'?'#7a6a9a':'#8a9aa8';for(let i=0;i<24;i++){const bw=R(18,40),bh=R(40,130),x=i*22+R(-6,6);g.fillStyle=bc;g.fillRect(x,h-bh-30,bw,bh+30);for(let yy=h-bh-22;yy<h-34;yy+=11)for(let xx=x+4;xx<x+bw-5;xx+=8)if(rnd()<(S.tod==='day'?.15:.55)){g.fillStyle=S.tod==='day'?'rgba(255,255,255,.5)':'#ffd88a';g.fillRect(xx,yy,4,5);}}
  const lc=S.leaf||S.leaf2||0x4a6a4a;g.fillStyle='#'+new THREE.Color(lc).multiplyScalar(S.night?.5:.85).getHexString();for(let i=0;i<26;i++){g.beginPath();g.arc(R(0,w),R(h-40,h),R(14,26),0,PI*2);g.fill();}
  if(S.snow){g.fillStyle='rgba(250,252,255,.9)';for(let i=0;i<80;i++){g.beginPath();g.arc(rnd()*w,rnd()*h,1.6,0,PI*2);g.fill();}g.fillRect(0,h-10,w,10);}
  if(S.rain){g.strokeStyle='rgba(220,235,245,.55)';for(let i=0;i<90;i++){const x=rnd()*w,y=rnd()*h;g.beginPath();g.moveTo(x,y);g.lineTo(x-3,y+14);g.stroke();}}
  if(S.blossom){g.fillStyle='#f6c0d0';for(let i=0;i<30;i++){g.beginPath();g.arc(R(0,w),R(h-50,h),R(8,16),0,PI*2);g.fill();}}});}
/* ---------- reusable builders ---------- */
function particles(G,n,o){const pos=new Float32Array(n*3),col=new Float32Array(n*3);const a=o.area;const V=[];
  for(let i=0;i<n;i++){pos[i*3]=R(a[0],a[1]);pos[i*3+1]=R(a[2],a[3]);pos[i*3+2]=R(a[4],a[5]);V.push({s:R(.6,1.4),p:rnd()*6});const c=new THREE.Color(o.colors?o.colors[i%o.colors.length]:0xffffff);col[i*3]=c.r;col[i*3+1]=c.g;col[i*3+2]=c.b;}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(pos,3));geo.setAttribute('color',new THREE.BufferAttribute(col,3));
  const m=new THREE.PointsMaterial({map:o.tex||TEX.dot,size:o.size||.15,transparent:true,opacity:o.op||.9,depthWrite:false,vertexColors:true,blending:o.add?THREE.AdditiveBlending:THREE.NormalBlending,fog:false,color:o.colors?0xffffff:o.color||0xffffff});
  const P=new THREE.Points(geo,m);P.frustumCulled=false;G.add(P);
  return {P,tick(t,dt){for(let i=0;i<n;i++){const v=V[i];let x=pos[i*3],y=pos[i*3+1],z=pos[i*3+2];
    y-=o.fall*v.s*dt;x+=(o.sway?Math.sin(t*1.3+v.p)*o.sway*dt:0)+(o.wind||0)*dt;z+=o.sway?Math.cos(t+v.p)*o.sway*.5*dt:0;
    if(o.wander){x=pos[i*3]+Math.sin(t*.7+v.p)*.01;y=pos[i*3+1]+Math.sin(t*1.1+v.p*2)*.008;}
    if(y<a[2]&&o.fall>0){y=a[3];x=R(a[0],a[1]);z=R(a[4],a[5]);}pos[i*3]=x;pos[i*3+1]=y;pos[i*3+2]=z;}geo.attributes.position.needsUpdate=true;}};}
function tree(G,x,z,s,S,kind){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);G.add(g);const tips=[];const up=new THREE.Vector3(0,1,0);
  function seg(a,b,r){const m=new THREE.Mesh(new THREE.CylinderGeometry(r*.68,r,a.distanceTo(b),6),MAT.bark);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(up,b.clone().sub(a).normalize());g.add(m);}
  (function br(p,dir,len,r,dep){const e=p.clone().add(dir.clone().multiplyScalar(len));seg(p,e,r);if(dep===0){tips.push(e);return;}if(dep<=2)tips.push(e);const k=dep===3?2:2+(rnd()<.5?1:0);for(let i=0;i<k;i++)br(e,dir.clone().add(new THREE.Vector3(R(-.8,.8),R(0,.5),R(-.8,.8))).normalize(),len*.72,r*.62,dep-1);})(new THREE.Vector3(),new THREE.Vector3(R(-.2,.2),1,R(-.2,.2)).normalize(),1.8,.26,3);
  if(S.leaf||S.leaf2){const per=S.blossom?13:16,geo=new THREE.IcosahedronGeometry(S.blossom?.11:.17,0);const im=new THREE.InstancedMesh(geo,std(0xffffff,{emissive:S.blossom?0x3a1520:0x101808,roughness:.8}),tips.length*per);let i=0;
    tips.forEach(t=>{for(let j=0;j<per;j++){dummy.position.set(t.x+R(-.5,.5),t.y+R(-.35,.4),t.z+R(-.5,.5));dummy.rotation.set(rnd()*3,rnd()*3,0);dummy.scale.setScalar(R(.6,1.4));dummy.updateMatrix();im.setMatrixAt(i,dummy.matrix);
      let c=S.leaf;if(S.leaf2&&rnd()<.4)c=S.leaf2;if(S.someBlossom&&rnd()<.25)c=0xf6c0d0;if(S.blossom&&rnd()<.15)c=0xfff4f2;im.setColorAt(i,tmpC.set(c).offsetHSL(R(-.015,.015),0,R(-.06,.06)));i++;}});g.add(im);}
  else if(S.snow){tips.forEach(t=>{if(rnd()<.5)sph(g,.12,MAT.white,t.x,t.y+.05,t.z,1.4,.4,1.4);});}
  return g;}
function pine(G,x,z,s,S){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);G.add(g);cyl(g,.12,.2,1.6,6,MAT.bark,0,.8,0);
  for(let i=0;i<4;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(1.5-i*.3,1.3,8),MAT.pine);c.position.y=1.6+i*.75;c.rotation.y=i;g.add(c);if(S.snow){const sn=new THREE.Mesh(new THREE.ConeGeometry(1.1-i*.25,.5,8),MAT.white);sn.position.y=2.05+i*.75;g.add(sn);}}return g;}
function xmasTree(G,x,z,s,tickers){const g=pine(G,x,z,s,{snow:false});const cols=[0xff4040,0xffd040,0x40a0ff,0xff80d0,0x60ff90];const lights=[];
  for(let i=0;i<46;i++){const h=R(1.4,4.2),r=(4.6-h)*.45+.15,a=rnd()*PI*2;const gl=glow(cols[i%5],.55,.9);gl.position.set(Math.cos(a)*r,h,Math.sin(a)*r);g.add(gl);lights.push(gl);if(i%3===0)sph(g,.08,emis(cols[i%5],.6),Math.cos(a)*r*.95,h-.1,Math.sin(a)*r*.95);}
  const star=new THREE.Mesh(new THREE.OctahedronGeometry(.28),emis(0xffe070,1.2));star.position.y=4.75;g.add(star);const sg=glow(0xffe070,2.4,.9);sg.position.y=4.75;g.add(sg);
  tickers.push((t)=>{lights.forEach((l,i)=>l.material.opacity=.5+.5*Math.sin(t*3+i));star.rotation.y=t;});return g;}
function bookshelf(G,x,z,ry,w,h){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry||0;G.add(g);w=w||3.6;h=h||4.2;
  box(g,w,h,.08,MAT.woodDark,0,h/2,-.36);box(g,.1,h,.72,MAT.wood,-w/2,h/2,0);box(g,.1,h,.72,MAT.wood,w/2,h/2,0);box(g,w+.2,.14,.8,MAT.wood,0,h,0);
  const pal=[0x2d3f6b,0x6b2a2a,0x2f5a4c,0x7a5a2a,0x3b2f4f,0x5c3a26,0x274a5a,0x8a7a5a,0x4a1f2a];const rows=Math.floor(h/.8),bk=[];
  for(let k=0;k<rows;k++){const by=.1+k*.8;box(g,w,.05,.7,MAT.wood,0,by,0);let xx=-w/2+.08;while(xx<w/2-.12){const bw=R(.07,.15),bh=R(.4,.64);if(rnd()<.05){xx+=.2;continue;}bk.push([xx+bw/2,by+.03+bh/2,R(-.05,.02),bw,bh,R(.42,.55)]);xx+=bw+.012;}}
  const papC=[0xf3e4c4,0xe9c48a,0xd98a4a,0xc9d8c8,0x9cc0b8,0xe8b8a0,0xf6efdc];for(let i=0;i<Math.round(w*h*.55);i++){const pw=R(.22,.42),ph=R(.26,.5);const pp=new THREE.Mesh(new THREE.PlaneGeometry(pw,ph),std(papC[i%papC.length],{emissive:new THREE.Color(papC[i%papC.length]).multiplyScalar(.12),side:THREE.DoubleSide}));pp.position.set(R(-w/2+.25,w/2-.25),R(.4,h-.3),.37+i*.0006);pp.rotation.z=R(-.12,.12);g.add(pp);}
  const im=new THREE.InstancedMesh(new THREE.BoxGeometry(1,1,1),std(0xffffff,{roughness:.8}),bk.length);bk.forEach((b,i)=>{dummy.position.set(b[0],b[1],b[2]);dummy.rotation.set(0,0,0);dummy.scale.set(b[3],b[4],b[5]);dummy.updateMatrix();im.setMatrixAt(i,dummy.matrix);im.setColorAt(i,tmpC.set(pal[Math.floor(rnd()*pal.length)]).multiplyScalar(R(.85,1.25)));});g.add(im);return g;}
function chair(G,x,z,ry,mat){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;G.add(g);box(g,.55,.06,.5,mat||MAT.wood,0,.45,0);[[-.22,-.2],[.22,-.2],[-.22,.2],[.22,.2]].forEach(p=>box(g,.05,.45,.05,MAT.woodDark,p[0],.22,p[1]));box(g,.55,.6,.05,mat||MAT.wood,0,.78,.24);return g;}
function cushion(G,x,z,c){const m=cyl(G,.34,.36,.12,14,std(c||0xa83a32),x,.06,z);return m;}
function pumpkin(G,x,y,z,s){const g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(s||1);G.add(g);const face=std(0xffffff,{map:TEX.pumpkin,emissive:0xffffff,emissiveMap:TEX.pumpkin,emissiveIntensity:.7});
  for(let i=0;i<6;i++){const m=sph(g,.3,i===0?face:std(0xd9661c,{emissive:0x401800}),Math.sin(i/6*PI*2)*.1,.28,Math.cos(i/6*PI*2)*.1-(i===0?.05:0),.7,.85,1);m.rotation.y=i/6*PI*2+PI;}
  cyl(g,.04,.05,.15,6,std(0x4a6a2a),0,.6,0);const gl=glow(0xff9030,1.4,.6);gl.position.set(0,.3,-.3);g.add(gl);return g;}
function cake(G,x,z,s,tickers){const g=new THREE.Group();g.position.set(x,0,z);g.scale.setScalar(s);G.add(g);
  const tiers=[[1.1,.6,0xfff4ec],[.8,.5,0xffc8d8],[.5,.45,0xfff4ec]];let y=0;tiers.forEach((t,i)=>{cyl(g,t[0],t[0],t[1],28,std(t[2],{emissive:0x302020}),0,y+t[1]/2,0);const fr=new THREE.Mesh(new THREE.TorusGeometry(t[0],.07,6,28),std(i%2?0xffffff:0xff9ab8));fr.rotation.x=PI/2;fr.position.y=y+t[1];g.add(fr);
    for(let k=0;k<8;k++){const a=k/8*PI*2;sph(g,.07,std([0xe23a4a,0x6ac0f0,0xf2c84b][k%3]),Math.cos(a)*t[0]*1.01,y+t[1]*.5,Math.sin(a)*t[0]*1.01);}y+=t[1];});
  const fl=[];for(let i=0;i<5;i++){const a=i/5*PI*2;const cx=Math.cos(a)*.28,cz=Math.sin(a)*.28;cyl(g,.035,.035,.32,6,std([0xff7aa0,0x7ac8ff,0xffd84a,0x9ae07a,0xc89aff][i]),cx,y+.16,cz);const f=glow(0xffb040,.5,.95);f.position.set(cx,y+.38,cz);g.add(f);fl.push(f);}
  tickers.push(t=>fl.forEach((f,i)=>{const s=.42+Math.sin(t*12+i*2)*.08;f.scale.set(s,s*1.3,1);}));return g;}
function balloons(G,list,tickers){const cols=[0xff6b8a,0x6ac0f0,0xffd84a,0x9ae07a,0xc89aff,0xff9a4a];const arr=[];list.forEach((p,i)=>{const g=new THREE.Group();g.position.set(p[0],p[1],p[2]);G.add(g);const b=sph(g,.32,std(cols[i%6],{emissive:new THREE.Color(cols[i%6]).multiplyScalar(.25),roughness:.3}),0,0,0,1,1.18,1);cyl(g,.005,.005,1.6,3,MAT.white,0,-1.1,0);arr.push({g,y:p[1],ph:i});});
  tickers.push(t=>arr.forEach(a=>{a.g.position.y=a.y+Math.sin(t*1.2+a.ph)*.15;a.g.rotation.z=Math.sin(t*.8+a.ph)*.08;}));}
function bunting(G,x1,z1,x2,z2,y){const n=12,cols=[0xff6b8a,0x6ac0f0,0xffd84a,0x9ae07a,0xc89aff];for(let i=0;i<n;i++){const t=(i+.5)/n,x=x1+(x2-x1)*t,z=z1+(z2-z1)*t,yy=y-Math.sin(t*PI)*.6;const f=new THREE.Mesh(new THREE.ConeGeometry(.16,.32,3),std(cols[i%5],{side:THREE.DoubleSide,emissive:new THREE.Color(cols[i%5]).multiplyScalar(.2)}));f.position.set(x,yy-.16,z);f.rotation.x=PI;f.rotation.y=Math.atan2(x2-x1,z2-z1)+PI/2;G.add(f);}}
function snowman(G,x,z){sph(G,.55,MAT.white,x,.5,z);sph(G,.38,MAT.white,x,1.25,z);sph(G,.27,MAT.white,x,1.82,z);const n=new THREE.Mesh(new THREE.ConeGeometry(.06,.3,8),std(0xf08030));n.rotation.x=-PI/2;n.position.set(x,1.82,z-.38);G.add(n);sph(G,.04,EYE,x-.1,1.9,z-.23);sph(G,.04,EYE,x+.1,1.9,z-.23);const sc=new THREE.Mesh(new THREE.TorusGeometry(.3,.07,8,20),SCARF);sc.rotation.x=PI/2;sc.position.set(x,1.58,z);G.add(sc);cyl(G,.2,.22,.3,12,EYE,x,2.12,z);cyl(G,.3,.3,.04,14,EYE,x,1.98,z);}
function bats(G,cx,cy,cz,n,tickers){const m=std(0x1a1020,{side:THREE.DoubleSide});const arr=[];for(let i=0;i<n;i++){const g=new THREE.Group();G.add(g);sph(g,.12,m,0,0,0,1,.8,1);const wl=new THREE.Mesh(new THREE.PlaneGeometry(.4,.2),m);wl.position.x=-.22;g.add(wl);const wr=wl.clone();wr.position.x=.22;g.add(wr);arr.push({g,wl,wr,r:R(3,8),a:rnd()*6,y:cy+R(-1,2),sp:R(.4,.8)});}
  tickers.push((t,dt)=>arr.forEach(b=>{b.a+=dt*b.sp;b.g.position.set(cx+Math.cos(b.a)*b.r,b.y+Math.sin(t*2+b.a)*.4,cz+Math.sin(b.a)*b.r);b.g.rotation.y=-b.a;const f=Math.sin(t*14+b.a)*.7;b.wl.rotation.y=f;b.wr.rotation.y=-f;}));}

/* ---------- building facades (campus) ---------- */
function hall(G,o){const g=new THREE.Group();g.position.set(o.x,0,o.z);g.rotation.y=o.rot||0;G.add(g);const w=o.w,d=o.d,h=o.h;
  box(g,w+1.2,.4,d+1.2,MAT.stone,0,.2,0);box(g,w,h,d,o.wallMat||MAT.plaster,0,.4+h/2,0);
  const pm=std(0xffffff,{map:o.panel||TEX.panel});const bays=Math.round(w/2.4);const bw=w/bays;
  for(let i=0;i<bays;i++){const cx=-w/2+bw*(i+.5);if(Math.abs(cx)<bw*.6)continue;const p=new THREE.Mesh(new THREE.PlaneGeometry(bw-.3,h-.5),pm);p.position.set(cx,.4+h/2-.1,d/2+.02);g.add(p);}
  for(let i=0;i<=bays;i++)cyl(g,.18,.2,h,10,o.pillar||MAT.red,-w/2+bw*i,.4+h/2,d/2+.2);
  box(g,w+.4,.36,.4,MAT.dan,0,.4+h+.05,d/2+.2);
  const door=new THREE.Mesh(new THREE.PlaneGeometry(1.7,2.5),new THREE.MeshBasicMaterial({color:o.doorColor||0xffc878}));door.position.set(0,1.65,d/2+.03);g.add(door);const dg=glow(o.doorColor||0xffb060,3.4,.6);dg.position.set(0,1.7,d/2+.4);g.add(dg);
  const roof=curvedRoof(w+3,d+3.2,1,.38,.2,o.roofMat);roof.position.y=.4+h+.75;g.add(roof);box(g,w-.5,.36,.4,MAT.stoneDark,0,.4+h+1.05,0);
  if(SEASON.snow){const sn=curvedRoof(w+2.6,d+2.8,1,.12,.2,MAT.white);sn.position.y=.4+h+1.0;g.add(sn);}
  if(o.two){box(g,w*.55,1.5,d*.55,o.wallMat||MAT.plaster,0,.4+h+1.6,0);const r2=curvedRoof(w*.55+2.4,d*.55+2.4,.8,.32,.22,o.roofMat);r2.position.y=.4+h+2.75;g.add(r2);if(SEASON.snow){const s2=curvedRoof(w*.55+2.1,d*.55+2.1,.8,.1,.22,MAT.white);s2.position.y=.4+h+2.95;g.add(s2);}}
  const pl=new THREE.Mesh(new THREE.PlaneGeometry(2.2,.78),new THREE.MeshBasicMaterial({map:plaqueTex(o.plaque,o.plaqueBg,o.plaqueFg)}));pl.position.set(0,.4+h-.45,d/2+.45);g.add(pl);
  const L=makeLabel(o.label,{bg:'rgba(12,20,22,.7)'});L.sprite.position.set(0,.4+h+(o.two?4.4:2.8),d/2);L.sprite.scale.set(3.2,.6,1);g.add(L.sprite);
  [-1,1].forEach(s=>chorong(g,s*1.4,.4+h-.9,d/2+.5,o.warm));return g;}

/* ---------- campus ---------- */
const DOORS={library:{x:0,z:-14.5,back:{x:0,z:-12.8}},basics:{x:-13,z:-14.5,back:{x:-13,z:-12.8}},potion:{x:13,z:-14.5,back:{x:13,z:-12.8}},herbs:{x:-20.5,z:-5,back:{x:-18.8,z:-5}},training:{x:-20.5,z:11,back:{x:-18.8,z:11}},dorm:{x:20.5,z:3,back:{x:18.8,z:3}}};
function buildCampus(S){reseed(21);const G=new THREE.Group();const T=[];const sp={id:'campus',G,tick:T,bounds:[-20.5,20.5,-14.5,22],obs:[],seats:[],triggers:[],doors:[],spawn:{x:0,z:15}};
  const gm=std(S.ground,{map:TEX.moss,roughness:1});const ground=new THREE.Mesh(new THREE.PlaneGeometry(120,110),gm);ground.rotation.x=-PI/2;G.add(ground);
  const pave=std(0xffffff,{map:TEX.paving,roughness:.95});const pm=new THREE.Mesh(new THREE.CircleGeometry(7.5,40),std(S.snow?0xdfe6ea:0xffffff,{map:ctex(256,256,(g)=>{g.drawImage(TEX.paving.image,0,0);},[4,4]),roughness:.95}));pm.rotation.x=-PI/2;pm.position.set(0,.02,-3);G.add(pm);
  const path=(x1,z1,x2,z2,w)=>{const dx=x2-x1,dz=z2-z1,L=Math.hypot(dx,dz);const t=ctex(64,256,(g)=>{g.drawImage(TEX.paving.image,0,0,64,256);},[1,Math.max(1,Math.round(L/3))]);const m=new THREE.Mesh(new THREE.PlaneGeometry(w,L),std(S.snow?0xdfe6ea:0xffffff,{map:t,roughness:.95}));m.rotation.x=-PI/2;m.rotation.z=-Math.atan2(dx,dz)+PI;m.position.set((x1+x2)/2,.015,(z1+z2)/2);G.add(m);};
  path(0,4,0,22,3);path(0,-10,0,-16,3);path(-5,-7,-13,-16,2.4);path(5,-7,13,-16,2.4);path(-7,-4,-22,-5,2.4);path(-6,0,-22,11,2.4);path(7,-2,22,3,2.6);
  // buildings
  hall(G,{x:0,z:-21.6,w:12,d:9,h:4.2,two:true,plaque:'雲書閣',label:'도서관 · 운서각',doorColor:0x9fe6ff});
  hall(G,{x:-13,z:-20.2,w:7.2,d:6,h:3.4,plaque:'基礎魔法堂',label:'마법학 기초 · 전공필수'});
  hall(G,{x:13,z:-20.2,w:7.2,d:6,h:3.4,plaque:'靈藥堂',label:'마법약 수업 · 전공필수',wallMat:std(0x5a5e58),doorColor:0x8affb0,plaqueBg:'#1a2a20',plaqueFg:'#9fe8b0'});
  hall(G,{x:25.2,z:3,rot:-PI/2,w:10,d:6.4,h:3.8,plaque:'溫和寮',label:'기숙사 · 온화료',panel:TEX.panelRed,wallMat:std(0xb03a2c),pillar:std(0x6a2018),roofMat:MAT.tileRed,warm:true,plaqueBg:'#5a1410',plaqueFg:'#ffd27a'});
  // greenhouse
  {const g=new THREE.Group();g.position.set(-25.5,0,-5);g.rotation.y=PI/2;G.add(g);box(g,9,.3,6.5,MAT.stone,0,.15,0);const gw=new THREE.Mesh(new THREE.BoxGeometry(8.4,3.4,6),MAT.glass);gw.position.y=2;g.add(gw);
    for(let i=0;i<=6;i++){box(g,.1,3.4,.1,MAT.woodDark,-4.2+i*1.4,2,3);box(g,.1,3.4,.1,MAT.woodDark,-4.2+i*1.4,2,-3);}box(g,8.6,.12,.12,MAT.woodDark,0,3.7,3);box(g,8.6,.12,.12,MAT.woodDark,0,3.7,-3);
    [-1,1].forEach(s=>{const r=new THREE.Mesh(new THREE.PlaneGeometry(8.6,3.5),MAT.glass);r.position.set(0,4.5,s*1.55);r.rotation.x=-PI/2+s*-.52;g.add(r);});box(g,8.6,.14,.14,MAT.woodDark,0,5.35,0);
    for(let i=0;i<14;i++){sph(g,R(.3,.6),std([0x4c8a3a,0x6aa84a,0x3a7a4a][i%3]),R(-3.6,3.6),R(.5,1.2),R(-2.4,2.4));}for(let i=0;i<6;i++){const gl=glow(0xffe8a0,1,.5);gl.position.set(R(-3,3),R(1,3),R(-2,2));g.add(gl);}
    const door=new THREE.Mesh(new THREE.PlaneGeometry(1.6,2.4),new THREE.MeshBasicMaterial({color:0xcff0c0}));door.position.set(0,1.5,3.04);g.add(door);const L=makeLabel('약초학 온실 · 전공선택');L.sprite.position.set(0,6.4,2);L.sprite.scale.set(3.2,.6,1);g.add(L.sprite);}
  // training pavilion
  {const g=new THREE.Group();g.position.set(-25.5,0,11);g.rotation.y=PI/2;G.add(g);box(g,9,.5,7,MAT.stone,0,.25,0);const fl=new THREE.Mesh(new THREE.PlaneGeometry(8.4,6.4),std(0xffffff,{map:TEX.floorLight}));fl.rotation.x=-PI/2;fl.position.y=.52;g.add(fl);
    [[-4,-3],[0,-3],[4,-3],[-4,3],[0,3],[4,3]].forEach(p=>cyl(g,.18,.2,3.4,10,MAT.red,p[0],2.2,p[1]));const rf=curvedRoof(11,9.4,1,.36,.2);rf.position.y=4.5;g.add(rf);if(S.snow){const sn=curvedRoof(10.6,9,1,.1,.2,MAT.white);sn.position.y=4.75;g.add(sn);}
    for(let i=0;i<3;i++){const dm=new THREE.Group();dm.position.set(-2.5+i*2.5,.5,-1);g.add(dm);cyl(dm,.1,.12,1.6,8,MAT.woodLight,0,.8,0);cyl(dm,.25,.25,.7,10,std(0xc8a070),0,1.2,0);box(dm,1,.08,.08,MAT.woodLight,0,1.3,0);sph(dm,.18,std(0xc8a070),0,1.75,0);}
    const L=makeLabel('기초체력 수련장 · 전공선택');L.sprite.position.set(0,6.2,2);L.sprite.scale.set(3.2,.6,1);g.add(L.sprite);}
  // pond
  {const p=new THREE.Mesh(new THREE.CircleGeometry(2.8,36),std(S.snow?0xcfe2ee:0x1c3a46,{metalness:S.snow?0:.5,roughness:S.snow?.4:.15}));p.rotation.x=-PI/2;p.position.set(-11,.03,9);G.add(p);const rim=new THREE.Mesh(new THREE.TorusGeometry(2.85,.18,6,36),MAT.stoneDark);rim.rotation.x=-PI/2;rim.position.set(-11,.05,9);G.add(rim);sp.obs.push({x:-11,z:9,r:3.1});
    if(!S.snow)for(let i=0;i<6;i++){const a=rnd()*6,r=R(.5,2.1);const pad=new THREE.Mesh(new THREE.CircleGeometry(R(.22,.34),12),std(0x3a6a40));pad.rotation.x=-PI/2;pad.position.set(-11+Math.cos(a)*r,.06,9+Math.sin(a)*r);G.add(pad);if((S.month>=6&&S.month<=8)&&i%2===0){cyl(G,.14,.04,.18,6,emis(0xf6b0c8,.5),pad.position.x,.15,pad.position.z);}}}
  // lanterns & trees
  [[-2.4,8],[2.4,8],[-2.4,14],[2.4,14],[-2.4,-12],[2.4,-12],[8.5,-4.5],[-8.5,-6.5]].forEach(p=>stoneLamp(G,p[0],p[1]));
  [[-18.5,-13.5,1.2],[18.5,-13.5,1.1],[-19,20,1.3],[19,20,1.2],[-7,21.5,1],[8,21.5,1.1],[-21,3,1],[21,-9,1.1],[21,13,1]].forEach(p=>{pine(G,p[0],p[1],p[2],S);sp.obs.push({x:p[0],z:p[1],r:.9});});
  [[-8,-12],[8,-12.5],[-15,1.5],[14,10],[-6,17],[6.5,17.5],[15,-8],[-16,16]].forEach((p,i)=>{tree(G,p[0],p[1],R(.9,1.15),S);sp.obs.push({x:p[0],z:p[1],r:.7});});
  // central feature
  if(S.key==='xmas'){xmasTree(G,0,-3,1.25,T);for(let i=0;i<7;i++){const a=i/7*PI*2;const c=[0xd83a3a,0x2a8a4a,0xf2c84b,0x3a6ad8][i%4];const b=box(G,R(.4,.6),R(.35,.55),R(.4,.6),std(c,{emissive:new THREE.Color(c).multiplyScalar(.15)}),Math.cos(a)*2.2,.22,-3+Math.sin(a)*2.2);b.rotation.y=a;box(G,.08,.6,.62,MAT.gold,b.position.x,.25,b.position.z).rotation.y=a;}}
  else{tree(G,0,-3,1.7,S);}
  sp.obs.push({x:0,z:-3,r:2.4});
  // mountains & sky objects
  const skyC=new THREE.Color(S.sky);[[-60,-95,40,28],[-20,-110,48,34],[30,-100,42,30],[70,-90,38,26],[-90,-60,40,24],[95,-55,40,26]].forEach((m,i)=>{const c=new THREE.Mesh(new THREE.ConeGeometry(m[2],m[3],7),new THREE.MeshBasicMaterial({color:skyC.clone().lerp(new THREE.Color(S.night?0x050a0e:0x2a4a50),.45+i%2*.15),fog:false}));c.position.set(m[0],m[3]/2-3,m[1]);G.add(c);if(S.snow){const cap=new THREE.Mesh(new THREE.ConeGeometry(m[2]*.3,m[3]*.3,7),new THREE.MeshBasicMaterial({color:0xf2f6f8,fog:false}));cap.position.set(m[0],m[3]-3-m[3]*.15,m[1]);G.add(cap);}});
  if(S.night){const mo=new THREE.Mesh(new THREE.SphereGeometry(4,24,12),new THREE.MeshBasicMaterial({color:0xf3ead0,fog:false}));mo.position.set(-34,40,-120);G.add(mo);const mg=glow(0xbcd2e8,34,.45);mg.position.copy(mo.position);G.add(mg);
    const n=500,pos=new Float32Array(n*3);for(let i=0;i<n;i++){const th=rnd()*PI*2,ph=rnd()*PI*.42;pos[i*3]=Math.cos(th)*Math.sin(ph)*160;pos[i*3+1]=Math.cos(ph)*160;pos[i*3+2]=Math.sin(th)*Math.sin(ph)*160;}const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(pos,3));G.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xf5ecd0,size:1.4,sizeAttenuation:false,fog:false,transparent:true,opacity:S.rain?.2:.85})));}
  else if(!S.rain){const su=glow(0xfff2c0,30,.6);su.position.set(40,50,-120);G.add(su);}
  for(let i=0;i<14;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:TEX.cloud,color:S.night?0x5a6a7a:S.rain?0x9aa6ae:0xffffff,transparent:true,opacity:S.rain?.6:.45,depthWrite:false,fog:false}));s.position.set(R(-90,90),R(22,40),R(-110,-60));const sc=R(24,40);s.scale.set(sc,sc*.45,1);G.add(s);T.push((t,dt)=>{s.position.x+=dt*.6;if(s.position.x>100)s.position.x=-100;});}
  // season particles & decor
  const A=[-22,22,0,9,-20,24];
  if(S.blossom||S.someBlossom){const p=particles(G,S.blossom?260:90,{tex:TEX.petal,size:.22,area:A,fall:.45,sway:.5,colors:[0xffc0d0,0xffd8e2,0xffffff]});T.push(p.tick);}
  if(S.key==='autumn'||S.key==='halloween'){const p=particles(G,S.month===9?80:200,{tex:TEX.petal,size:.3,area:A,fall:.6,sway:.8,wind:.3,colors:[0xd9482a,0xe8902a,0xe8c040,0xa83a20]});T.push(p.tick);}
  if(S.snow||S.wxSnow){const p=particles(G,S.wxSnow&&!S.snow?380:500,{tex:TEX.dot,size:.16,area:A,fall:.9,sway:.4,colors:[0xffffff]});T.push(p.tick);}
  if(S.rain){const p=particles(G,1100,{tex:TEX.streak,size:.9,area:[-22,22,0,12,-20,24],fall:16,colors:[0xe4eef6],op:.75});T.push(p.tick);
    for(let i=0;i<10;i++){const pd=new THREE.Mesh(new THREE.CircleGeometry(R(.4,1),18),std(0x2a3a44,{metalness:.6,roughness:.1}));pd.rotation.x=-PI/2;pd.position.set(R(-6,6),.03,R(-8,18));G.add(pd);}}
  if((S.month>=6&&S.month<=8)&&S.night){const p=particles(G,70,{tex:TEX.glow,size:.35,area:[-18,18,.3,3,-12,20],fall:0,wander:true,colors:[0xd8ff90],add:true});T.push((t,dt)=>{p.tick(t,dt);p.P.material.opacity=.5+Math.sin(t*2)*.4;});}
  if(S.month===6||S.month===7){[[-4,10],[4,10],[-4,5],[4,5]].forEach(p=>{for(let i=0;i<5;i++)sph(G,R(.25,.4),std([0x7a8ae8,0xa88ae8,0x8ab8f0][i%3],{emissive:0x101828}),p[0]+R(-.6,.6),R(.3,.6),p[1]+R(-.6,.6));});}
  if(S.key==='birthday'){cake(G,0,4.8,1.1,T);sp.obs.push({x:0,z:4.8,r:1.5});balloons(G,[[-2.6,3.4,3.6],[2.6,3.6,3.8],[-3.4,4,6],[3.2,3.3,6.2],[-1.6,4.4,7],[1.8,4.2,7.2],[-9,4,-9],[9,4.4,-9.5],[0,6,-8]],T);
    bunting(G,-2.4,8,2.4,8,2.6);bunting(G,-2.4,14,2.4,14,2.6);bunting(G,-2.4,-12,2.4,-12,2.6);const L=makeLabel('🎂 생일 축하의 달 🎂',{bg:'rgba(255,240,245,.9)',fg:'#c23a5a',line:'#ff9ab8'});L.sprite.position.set(0,3.4,4.8);L.sprite.scale.set(3.6,.68,1);G.add(L.sprite);
    const c=particles(G,180,{tex:TEX.petal,size:.18,area:[-8,8,0,7,-6,10],fall:.7,sway:1,colors:[0xff6b8a,0x6ac0f0,0xffd84a,0x9ae07a,0xc89aff]});T.push(c.tick);}
  if(S.key==='halloween'){[[-1.6,6],[1.6,6],[-1.6,11],[1.6,11],[-1.6,-11],[1.6,-11],[-3,-1],[3,-1],[-6,-9],[6,-9],[17,2],[17,4]].forEach((p,i)=>pumpkin(G,p[0],0,p[1],R(.8,1.2)));bats(G,0,6,-6,12,T);
    for(let i=0;i<4;i++){const gh=new THREE.Group();G.add(gh);sph(gh,.35,std(0xf4f4ff,{emissive:0x8080a0,transparent:true,opacity:.8}),0,0,0,1,1.3,1);sph(gh,.05,EYE,-.1,.1,-.3);sph(gh,.05,EYE,.1,.1,-.3);gh.add(glow(0xb0c0ff,1.6,.4));const ph=i*1.6,r=R(5,12);T.push(t=>{gh.position.set(Math.cos(t*.2+ph)*r,2.5+Math.sin(t*1.3+ph)*.5,-3+Math.sin(t*.2+ph)*r);});}}
  if(S.snow){snowman(G,-6.5,13.5);sp.obs.push({x:-6.5,z:13.5,r:.7});}
  if(S.key==='xmas'){[[-2.4,8],[2.4,8],[-2.4,14],[2.4,14]].forEach(p=>{const w=new THREE.Mesh(new THREE.TorusGeometry(.32,.1,8,20),std(0x2a6a3a));w.position.set(p[0],2.4,p[1]);G.add(w);sph(G,.08,emis(0xe23a3a,.6),p[0],2.12,p[1]);});}
  // doors
  Object.entries(DOORS).forEach(([k,d])=>sp.doors.push({x:d.x,z:d.z,r:1.4,to:k}));
  return sp;}

/* ---------- interiors ---------- */
const ROOMS={
 potion:{name:'마법약 수업',en:'II · POTIONS — 靈藥堂',tag:'전공 필수',title:'끓는 솥 앞에서,<br>집중의 물약을.',study:true},
 basics:{name:'마법학 기초',en:'I · FOUNDATIONS — 基礎魔法堂',tag:'전공 필수',title:'기(氣)의 흐름,<br>첫 주문을 익히다.',study:true},
 herbs:{name:'약초학 수업',en:'III · HERBOLOGY — 藥草園',tag:'전공 선택',title:'유리 온실 속,<br>약초가 자라는 시간.',study:true},
 training:{name:'기초체력훈련',en:'IV · TRAINING — 修鍊場',tag:'전공 선택',title:'몸이 단단해야<br>마법도 단단하다.',study:true},
 library:{name:'도서관 · 운서각',en:'V · LIBRARY — 雲書閣',tag:'자유 독서',title:'구름 위,<br>현자들의 서고.',study:true},
 dorm:{name:'기숙사 · 온화료',en:'DORMITORY — 溫和寮',tag:'자유 대화',title:'노을 지는 창가,<br>우리들의 공부방.',study:false}};
function roomShell(id,S,o){const G=new THREE.Group();const T=[];const sp={id,G,tick:T,bounds:[-7.2,7.2,-6.2,6.6],obs:[],seats:[],triggers:[],doors:[{x:0,z:6.6,r:.9,to:'campus'}],spawn:{x:0,z:5.2}};
  const fl=new THREE.Mesh(new THREE.PlaneGeometry(16,14),std(0xffffff,{map:o.floor,roughness:.8}));fl.rotation.x=-PI/2;G.add(fl);
  const H=o.wallH||5;const wm=o.wallMat||MAT.plaster;
  box(G,16.4,H,.3,wm,0,H/2,-7.15);[-1,1].forEach(s=>box(G,.3,H,14.3,wm,s*8.15,H/2,0));
  if(o.wains){box(G,16.2,1.1,.06,o.wains,0,.55,-6.98);[-1,1].forEach(s=>box(G,.06,1.1,14,o.wains,s*7.98,.55,0));}
  [-6.9,-3].forEach(z=>box(G,16.3,.3,.3,MAT.dan,0,H-.15,z));[-1,1].forEach(s=>box(G,.3,.3,14.3,MAT.wood,s*7.9,H-.15,0));
  const wt=windowTex(S),wmM=new THREE.MeshBasicMaterial({map:wt});(o.windows||[-5,5]).forEach(x=>{const w=new THREE.Mesh(new THREE.PlaneGeometry(1.8,2.2),wmM);w.position.set(x,2.8,-6.98);G.add(w);box(G,2,.12,.12,MAT.woodDark,x,3.95,-6.95);box(G,2,.12,.2,MAT.woodDark,x,1.65,-6.92);[-1,0,1].forEach(k=>box(G,.07,2.3,.08,MAT.woodDark,x+k*.95,2.8,-6.94));box(G,1.9,.06,.08,MAT.woodDark,x,2.8,-6.94);});
  [-1,1].forEach(s=>{const w=new THREE.Mesh(new THREE.PlaneGeometry(2.2,2),wmM);w.position.set(s*7.97,2.8,1);w.rotation.y=-s*PI/2;G.add(w);box(G,.1,.12,2.4,MAT.woodDark,s*7.94,3.85,1);box(G,.1,.12,2.4,MAT.woodDark,s*7.94,1.75,1);[-1.15,0,1.15].forEach(k=>box(G,.1,2.2,.08,MAT.woodDark,s*7.94,2.8,1+k));});
  const mat=new THREE.Mesh(new THREE.PlaneGeometry(2.4,1),new THREE.MeshBasicMaterial({color:0xd8bd7a,transparent:true,opacity:.35}));mat.rotation.x=-PI/2;mat.position.set(0,.02,6.3);G.add(mat);const ml=makeLabel('↓ 마당으로 나가기',{bg:'rgba(12,20,22,.6)'});ml.sprite.position.set(0,.6,6.4);ml.sprite.scale.set(1.9,.36,1);G.add(ml.sprite);
  (o.lights||[[0xffc890,1.2,0,4.2,0]]).forEach(l=>{const L=new THREE.PointLight(l[0],l[1],18);L.position.set(l[2],l[3],l[4]);G.add(L);});
  return sp;}
function addSeat(sp,x,z,ry,h){sp.seats.push({x,z,ry,h});}
function buildRoom(id,S){reseed(id.length*97+3);let sp;
 if(id==='potion'){sp=roomShell(id,S,{floor:TEX.stoneFloor,wallMat:std(0x4a4f4a),lights:[[0x8affb0,1.4,0,3.5,0],[0xffc070,.9,0,4,-5]]});const G=sp.G,T=sp.tick;
   const bub=[];[-4.2,0,4.2].forEach(x=>[-1.6,2.4].forEach(z=>{const c=new THREE.Group();c.position.set(x,0,z);G.add(c);[0,1,2].forEach(k=>{const l=cyl(c,.04,.04,.5,4,MAT.woodDark,Math.cos(k*2.1)*.4,.25,Math.sin(k*2.1)*.4);});
     const pot=new THREE.Mesh(new THREE.SphereGeometry(.48,20,12,0,PI*2,PI*.35,PI*.65),std(0x1e1e22,{metalness:.5,roughness:.4,side:THREE.DoubleSide}));pot.position.y=.75;c.add(pot);const liq=new THREE.Mesh(new THREE.CircleGeometry(.4,20),emis(0x58e08a,1));liq.rotation.x=-PI/2;liq.position.y=1.05;c.add(liq);const gl=glow(0x6affa0,1.6,.6);gl.position.y=1.15;c.add(gl);
     const fire=glow(0xff7a30,.9,.8);fire.position.y=.15;c.add(fire);for(let i=0;i<4;i++){const b=sph(c,.05,emis(0x9affc0,.8),R(-.2,.2),1.05,R(-.2,.2));bub.push({b,p:rnd()*3});}
     sp.obs.push({x,z,r:.65});const st=cyl(G,.2,.22,.45,10,MAT.wood,x,.22,z+1.05);addSeat(sp,x,z+1.05,0,.45);}));
   T.push((t,dt)=>bub.forEach(o=>{o.p+=dt;const k=o.p%1.4;o.b.position.y=1.02+k*.4;o.b.scale.setScalar(1-k*.6);}));
   box(G,4.4,.9,1.2,MAT.woodDark,0,.45,-4.9);sp.obs.push({x:-1.5,z:-4.9,r:.9},{x:1.5,z:-4.9,r:.9},{x:0,z:-4.9,r:.9});const big=new THREE.Mesh(new THREE.SphereGeometry(.6,20,12,0,PI*2,PI*.35,PI*.65),std(0x2a2a2e,{metalness:.5,roughness:.4,side:THREE.DoubleSide}));big.position.set(0,1.3,-4.9);G.add(big);const bl=new THREE.Mesh(new THREE.CircleGeometry(.5,20),emis(0xb07aff,1));bl.rotation.x=-PI/2;bl.position.set(0,1.68,-4.9);G.add(bl);const bg=glow(0xc090ff,2.2,.6);bg.position.set(0,1.8,-4.9);G.add(bg);
   [-1,1].forEach(s=>{const sh=new THREE.Group();sh.position.set(s*2.6,0,-6.75);G.add(sh);for(let k=0;k<4;k++){box(sh,3.4,.06,.5,MAT.wood,0,.9+k*.8,0);for(let i=0;i<9;i++){const c=[0x58e08a,0xe0587a,0x58a8e0,0xe0c058,0xb07aff][(i+k)%5];const b=cyl(sh,.08,.1,R(.2,.36),8,emis(c,.5),-1.5+i*.37,.93+k*.8+.15,0);}}});
   const bt=textTex([{t:'靈藥 · 마법약 수업',y:60,f:'800 46px '},{t:'오늘의 조제 — 집중의 물약',y:130,f:'34px ',ff:FS},{t:'솥 앞 의자에 앉아 타이머를 시작하세요',y:190,f:'26px ',ff:FS}],{bg:'#1c2a22',fg:'#cfeedd',border:'#4a3020'});const board=new THREE.Mesh(new THREE.PlaneGeometry(4.4,2.2),new THREE.MeshBasicMaterial({map:bt}));board.position.set(0,3.6,-6.98);G.add(board);
   for(let i=0;i<10;i++){const h=new THREE.Group();h.position.set(R(-7,7),4.55,R(-5,5));G.add(h);cyl(h,.01,.01,.4,3,MAT.woodDark,0,.2,0);for(let k=0;k<5;k++)sph(h,.07,std([0x5a7a3a,0x7a6a3a,0x8a4a3a][k%3]),R(-.08,.08),-.1-k*.06,R(-.08,.08),.6,1.6,.6);}
 }else if(id==='basics'){sp=roomShell(id,S,{floor:TEX.floorWarm,wains:MAT.wood,lights:[[0xffd0a0,1.3,0,4,0]]});const G=sp.G,T=sp.tick;
   const bt=textTex([{t:'第一講 · 마법학 기초',y:56,f:'800 44px '},{t:'기(氣)의 흐름과 주문의 첫걸음',y:120,f:'32px ',ff:FS},{t:'“서두르지 말고, 멈추지 말라.”',y:185,f:'30px ',ff:FS}],{bg:'#1f3a2e',fg:'#eef2e2',border:'#5a3a24',extra:(g)=>{g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=2;g.beginPath();g.arc(450,200,40,0,PI*2);g.stroke();g.beginPath();g.arc(450,200,22,0,PI*2);g.stroke();}});
   const board=new THREE.Mesh(new THREE.PlaneGeometry(5.6,2.8),new THREE.MeshBasicMaterial({map:bt}));board.position.set(0,2.9,-6.97);G.add(board);box(G,5.9,.12,.2,MAT.woodDark,0,1.45,-6.9);
   box(G,.9,1.1,.6,MAT.woodDark,2.8,.55,-5.3);sp.obs.push({x:2.8,z:-5.3,r:.7});
   const sg=new THREE.Mesh(new THREE.CircleGeometry(1.8,48),new THREE.MeshBasicMaterial({map:TEX.sigil,color:0xffd890,transparent:true,opacity:.7,blending:THREE.AdditiveBlending,depthWrite:false}));sg.rotation.x=-PI/2;sg.position.set(0,.03,-4.3);G.add(sg);T.push(t=>sg.rotation.z=t*.15);
   [-4,0,4].forEach(x=>[-1.6,1,3.6].forEach(z=>{box(G,1.5,.08,.65,MAT.woodDark,x,.42,z);[-.6,.6].forEach(dx=>box(G,.08,.38,.5,MAT.woodDark,x+dx,.2,z));box(G,.22,.03,.3,std(0xf0e6c8),x-.3,.47,z);sp.obs.push({x,z,r:.55},{x:x-.5,z,r:.4},{x:x+.5,z,r:.4});cushion(G,x,z+.75,0xa83a32);addSeat(sp,x,z+.75,0,.12);}));
   const cand=[];for(let i=0;i<14;i++){const c=new THREE.Group();c.position.set(R(-6.5,6.5),R(3,4.3),R(-6,4));G.add(c);cyl(c,.05,.05,.3,8,std(0xfff6e0),0,0,0);const f=glow(0xffc060,.6,.95);f.position.y=.22;c.add(f);cand.push({c,y:c.position.y,p:rnd()*6});}T.push(t=>cand.forEach(o=>o.c.position.y=o.y+Math.sin(t+o.p)*.12));
   bookshelf(G,-6.3,-6.5,0,2.6,3.6);bookshelf(G,6.3,-6.5,0,2.6,3.6);
 }else if(id==='herbs'){sp=roomShell(id,S,{floor:TEX.stoneFloor,wallMat:MAT.glass,lights:[[0xfff0c0,1.4,0,4.5,0]],windows:[]});const G=sp.G,T=sp.tick;
   for(let x=-7;x<=7;x+=1.75){box(G,.08,5,.08,MAT.woodDark,x,2.5,-6.95);}for(let z=-6;z<=6;z+=2){[-1,1].forEach(s=>box(G,.08,5,.08,MAT.woodDark,s*7.95,2.5,z));}
   
   [-1,1].forEach(s=>{box(G,1.2,.6,11,std(0x5a3a22),s*6.8,.3,-.5);const n=40;const im=new THREE.InstancedMesh(new THREE.ConeGeometry(.14,.5,5),std(0xffffff,{roughness:.9}),n);for(let i=0;i<n;i++){dummy.position.set(s*6.8+R(-.45,.45),.82,R(-5.8,4.8));dummy.rotation.set(R(-.4,.4),rnd()*3,R(-.4,.4));dummy.scale.setScalar(R(.7,1.4));dummy.updateMatrix();im.setMatrixAt(i,dummy.matrix);im.setColorAt(i,tmpC.set([0x4c9a3a,0x6ab84a,0x3a8a5a,0x8ac04a][i%4]));}G.add(im);sp.obs.push({x:s*6.8,z:-3,r:.8},{x:s*6.8,z:1,r:.8});
     for(let i=0;i<5;i++){const c=[0xe86a8a,0xf2c84b,0xb07ae8,0xffffff][i%4];sph(G,.09,emis(c,.3),s*6.8+R(-.3,.3),1.05,R(-5,4));}});
   [-1.4,2.2].forEach(z=>{box(G,6.4,.1,1,MAT.woodLight,0,.85,z);[-2.9,2.9].forEach(x=>box(G,.1,.8,.8,MAT.woodDark,x,.42,z));for(let i=0;i<5;i++){const x=-2.5+i*1.25;cyl(G,.16,.12,.26,10,std(0xb8643a),x,1.03,z-.1);sph(G,.2,std([0x5a9a3a,0x7ab84a][i%2]),x,1.3,z-.1,1,.8,1);}
     sp.obs.push({x:-2,z,r:.7},{x:0,z,r:.7},{x:2,z,r:.7},{x:-3,z,r:.6},{x:3,z,r:.6});[-2.4,0,2.4].forEach(x=>{cyl(G,.2,.22,.5,10,MAT.woodLight,x,.25,z+.95);addSeat(sp,x,z+.95,0,.5);});});
   for(let i=0;i<9;i++){const h=new THREE.Group();h.position.set(R(-6,6),4.6,R(-5.5,4));G.add(h);cyl(h,.2,.15,.25,10,std(0xb8643a),0,0,0);for(let k=0;k<6;k++){const v=sph(h,.07,std(0x4c9a3a),R(-.2,.2),-.1-k*.13,R(-.2,.2),.8,1.6,.8);}}
   const bf=[];for(let i=0;i<6;i++){const b=new THREE.Group();G.add(b);const wm=std([0xf2c84b,0xe8f0ff,0xe86a8a][i%3],{side:THREE.DoubleSide,emissive:0x302010});const l=new THREE.Mesh(new THREE.PlaneGeometry(.18,.14),wm);l.position.x=-.09;b.add(l);const r=l.clone();r.position.x=.09;b.add(r);bf.push({b,l,r,p:rnd()*6,c:[R(-5,5),R(1.5,3.5),R(-4,4)]});}
   T.push(t=>bf.forEach(o=>{o.b.position.set(o.c[0]+Math.sin(t*.4+o.p)*2,o.c[1]+Math.sin(t*1.3+o.p)*.4,o.c[2]+Math.cos(t*.3+o.p)*2);const f=Math.sin(t*16+o.p)*.9;o.l.rotation.y=f;o.r.rotation.y=-f;o.b.rotation.y=t*.4+o.p;}));
   const bt=textTex([{t:'藥草園 · 약초학',y:60,f:'800 44px '},{t:'오늘의 약초 — 월광초 기르기',y:130,f:'32px ',ff:FS}],{w:512,h:180,bg:'#2a3a22',fg:'#eef5d8',border:'#5a3a24'});const board=new THREE.Mesh(new THREE.PlaneGeometry(3.2,1.1),new THREE.MeshBasicMaterial({map:bt}));board.position.set(0,3.3,-6.9);G.add(board);
 }else if(id==='training'){sp=roomShell(id,S,{floor:TEX.floorLight,wains:MAT.woodDark,lights:[[0xfff0d8,1.4,0,4.4,0]]});const G=sp.G,T=sp.tick;
   const sc=textTex([{t:'體',y:150,f:'800 150px '},{t:'力',y:330,f:'800 150px '}],{w:256,h:460,bg:'#f2ead6',fg:'#1a1410',border:'#7a4a2a'});const scr=new THREE.Mesh(new THREE.PlaneGeometry(1.4,2.5),new THREE.MeshBasicMaterial({map:sc}));scr.position.set(0,2.8,-6.97);G.add(scr);cyl(G,.05,.05,1.6,6,MAT.woodDark,0,4.1,-6.92).rotation.z=PI/2;
   [-3.6,0,3.6].forEach(x=>[-1.4,2.6].forEach(z=>{const m=new THREE.Mesh(new THREE.BoxGeometry(2.2,.06,2.2),std(0x3a6a6a));m.position.set(x,.03,z);G.add(m);box(G,2.2,.07,.08,std(0xd8bd7a),x,.035,z+1.08);box(G,2.2,.07,.08,std(0xd8bd7a),x,.035,z-1.08);addSeat(sp,x,z,0,.07);}));
   [-1,1].forEach(s=>[-4,0,3.5].forEach(z=>{const dm=new THREE.Group();dm.position.set(s*6.6,0,z);G.add(dm);cyl(dm,.1,.12,1.8,8,MAT.woodLight,0,.9,0);cyl(dm,.26,.26,.8,10,std(0xc8a070),0,1.3,0);box(dm,1.1,.09,.09,MAT.woodLight,0,1.45,0).rotation.y=PI/2;sph(dm,.2,std(0xc8a070),0,1.9,0);sp.obs.push({x:s*6.6,z,r:.6});}));
   const drum=new THREE.Group();drum.position.set(5.8,0,-5.6);G.add(drum);cyl(drum,.7,.7,.9,20,std(0xa82a22),0,1.2,0).rotation.z=PI/2;[-1,1].forEach(s=>{const f=new THREE.Mesh(new THREE.CircleGeometry(.68,20),std(0xf0e0c0));f.position.set(s*.46,1.2,0);f.rotation.y=s*PI/2;drum.add(f);});box(drum,1.2,.1,.1,MAT.woodDark,0,.6,0);[-1,1].forEach(s=>box(drum,.1,1.2,.1,MAT.woodDark,s*.5,.6,0));sp.obs.push({x:5.8,z:-5.6,r:1});
   const rack=new THREE.Group();rack.position.set(-5.6,0,-6.5);G.add(rack);box(rack,2.4,.1,.3,MAT.woodDark,0,2.2,0);box(rack,2.4,.1,.3,MAT.woodDark,0,.4,0);for(let i=0;i<6;i++)cyl(rack,.035,.035,2.2,6,MAT.woodLight,-1+i*.4,1.3,.1);
   for(let i=0;i<5;i++){const b=new THREE.Group();b.position.set(-7.3+i*.25,0,4+i%2*.4);G.add(b);for(let k=0;k<3;k++)cyl(b,.05,.05,3,6,std(0x6a9a4a),R(-.2,.2),1.5,R(-.2,.2));}
 }else if(id==='library'){sp=roomShell(id,S,{floor:TEX.floorDark,wains:MAT.woodDark,wallH:5.5,lights:[[0xffc890,1.2,-4,4.2,0],[0xffc890,1.2,4,4.2,0],[0x7fe0ff,1.4,0,2.6,-4.6]],windows:[]});const G=sp.G,T=sp.tick;
   [-5.6,-1.9,1.9,5.6].forEach(x=>bookshelf(G,x,-6.6,0,3.6,4.8));[-1,1].forEach(s=>[-4.4,-.6,3.2].forEach(z=>bookshelf(G,s*7.6,z,-s*PI/2,3.6,4.4)));
   [[-3.4,-1],[3.4,-1],[-3.4,3],[3.4,3]].forEach(p=>{box(G,2.6,.1,1.3,MAT.wood,p[0],.78,p[1]);[[-1.15,-.5],[1.15,-.5],[-1.15,.5],[1.15,.5]].forEach(q=>box(G,.08,.76,.08,MAT.woodDark,p[0]+q[0],.38,p[1]+q[1]));
     const lamp=new THREE.Group();lamp.position.set(p[0],.83,p[1]);G.add(lamp);cyl(lamp,.04,.08,.4,8,MAT.gold,0,.2,0);const sh=new THREE.Mesh(new THREE.ConeGeometry(.2,.16,14,1,true),emis(0x2e7a4a,.5));sh.position.y=.45;sh.rotation.x=PI;lamp.add(sh);const lg=glow(0xffe0a0,1.5,.7);lg.position.y=.38;lamp.add(lg);
     sp.obs.push({x:p[0]-.8,z:p[1],r:.75},{x:p[0]+.8,z:p[1],r:.75});[-.7,.7].forEach(dx=>{chair(G,p[0]+dx,p[1]+1.05,0);addSeat(sp,p[0]+dx,p[1]+1.05,0,.48);chair(G,p[0]+dx,p[1]-1.05,PI);addSeat(sp,p[0]+dx,p[1]-1.05,PI,.48);});});
   const desk=new THREE.Group();desk.position.set(0,0,-4.4);G.add(desk);const sg=new THREE.Mesh(new THREE.CircleGeometry(1.6,48),new THREE.MeshBasicMaterial({map:TEX.sigil,color:0x9fe6ff,transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false}));sg.rotation.x=-PI/2;sg.position.y=.03;desk.add(sg);box(desk,1.6,.1,.8,MAT.wood,0,.62,0);[[-.7,-.32],[.7,-.32],[-.7,.32],[.7,.32]].forEach(q=>box(desk,.08,.6,.08,MAT.woodDark,q[0],.3,q[1]));
   const book=new THREE.Group();book.position.y=1.25;desk.add(book);[-1,1].forEach(s=>{const h=new THREE.Group();h.rotation.z=s*.2;book.add(h);box(h,.5,.03,.7,std(0x2a3f6e),s*.26,-.02,0);box(h,.46,.04,.64,emis(0xf6efdc,.6),s*.24,.01,0);});const bg=glow(0x9fe8ff,2.6,.7);bg.position.y=1.3;desk.add(bg);
   sp.obs.push({x:0,z:-4.4,r:1});sp.triggers.push({x:0,z:-3.1,r:1.3,act:'books',title:'독서 기록장 펼치기',sub:'읽은 책과 독후감을 남겨요'});T.push(t=>{sg.rotation.z=t*.12;book.position.y=1.25+Math.sin(t*1.6)*.06;});
   const orb=[];for(let i=0;i<8;i++){const g=new THREE.Group();box(g,.34,.07,.46,emis([0x2d3f6b,0x6b2a2a,0x2f5a4c,0x7a5a2a][i%4],.3),0,0,0);box(g,.3,.05,.42,std(0xefe6cc),.02,0,0);G.add(g);orb.push({g,a:i/8*PI*2,r:R(2,3),y:R(3.4,4.6)});}T.push((t,dt)=>orb.forEach(o=>{o.a+=dt*.2;o.g.position.set(Math.cos(o.a)*o.r,o.y+Math.sin(t+o.a*3)*.2,-1+Math.sin(o.a)*o.r*.8);o.g.rotation.set(Math.sin(t+o.a)*.4,-o.a,0);}));
   [-3,3].forEach(x=>chorong(G,x,4.4,1,true));
 }else{ // dorm — cozy study lounge
   sp=roomShell(id,S,{floor:TEX.floorWarm,wallMat:std(0xf2e2c4),wains:std(0x8a5a3a),wallH:5.6,lights:[[0xffd4a8,1.2,0,3.6,-.6],[0xffd0a0,.7,-6,2.2,-4.4],[S.night?0x8a7ac8:0xffa070,.7,3.5,3,-5.5]],windows:[]});const G=sp.G,T=sp.tick;
   // big window with city view
   const wt=cityWindowTex(S);const win=new THREE.Mesh(new THREE.PlaneGeometry(8,4.4),new THREE.MeshBasicMaterial({map:wt}));win.position.set(3.4,2.95,-6.98);G.add(win);
   for(let i=0;i<=5;i++)box(G,.09,4.6,.12,std(0x3a3a44),-.6+i*1.6,2.95,-6.93);[.75,2.95,5.15].forEach(y=>box(G,8.2,.09,.12,std(0x3a3a44),3.4,y,-6.93));box(G,8.4,.14,.5,MAT.wood,3.4,.75,-6.75);
   const fl=[];for(let i=0;i<22;i++){const gl=glow([0xffd890,0xffb070][i%2],.35,.9);gl.position.set(-.5+i*.37,5.05-Math.sin(i/21*PI)*.35,-6.8);G.add(gl);fl.push(gl);}T.push(t=>fl.forEach((g,i)=>g.material.opacity=.55+.4*Math.sin(t*2+i)));
   // mezzanine railing + ivy
   box(G,16,.12,.9,MAT.wood,0,4.75,-6.6);for(let x=-7.6;x<=7.6;x+=.45)box(G,.04,.6,.04,std(0x2a2a30),x,5.1,-6.2);box(G,16,.05,.05,std(0x2a2a30),0,5.4,-6.2);
   const ivyM=std(0x5a8a3a,{emissive:0x0e1a08}),ivyM2=std(0x7aa84a,{emissive:0x142008});const ivy=[];
   const vine=(x,y,z,len)=>{const g=new THREE.Group();g.position.set(x,y,z);G.add(g);for(let k=0;k<len;k++){const l=sph(g,.1,k%2?ivyM:ivyM2,Math.sin(k*1.7)*.12,-k*.17,Math.cos(k*1.3)*.06,1,.6,1);}ivy.push({g,p:rnd()*6});};
   [-7,-5.6,-4,-2.6,-1.2,7].forEach((x,i)=>{cyl(G,.2,.15,.3,10,std(0xe8dcc8),x,4.95,-6.6);sph(G,.22,ivyM,x,5.2,-6.6,1,.8,1);vine(x+.1,4.9,-6.35,6+(i%3)*4);});
   [[-3.5,1.5],[4.5,2.5],[-6,-2.6]].forEach(p=>{cyl(G,.01,.01,.8,3,std(0x2a2a30),p[0],5.2,p[1]);cyl(G,.24,.18,.28,10,std(0xe8dcc8),p[0],4.7,p[1]);sph(G,.25,ivyM,p[0],4.85,p[1],1,.7,1);vine(p[0]+.15,4.6,p[1],9);vine(p[0]-.15,4.6,p[1]+.1,7);});
   T.push(t=>ivy.forEach(v=>v.g.rotation.z=Math.sin(t*.7+v.p)*.04));
   // bookshelf + plants
   bookshelf(G,-5.4,-6.55,0,3.8,4.4);sp.obs.push({x:-5.4,z:-6.2,r:1.4},{x:-4,z:-6.2,r:.9},{x:-6.8,z:-6.2,r:.9});[-6.6,-5.4,-4.2].forEach(x=>{cyl(G,.14,.11,.2,8,std(0xe8dcc8),x,4.55,-6.4);sph(G,.18,ivyM2,x,4.75,-6.4);});
   // posters & photos (back wall, left wall)
   const poster=(lines,x,y,z,ry,w,h,bg)=>{const tx=textTex(lines,{w:256,h:Math.round(256*h/w),bg:bg||'#f6efe0',fg:'#3a2a20'});const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tx}));m.position.set(x,y,z);m.rotation.y=ry;G.add(m);};
   poster([{t:'함께 읽고',y:70,f:'34px ',ff:FS},{t:'함께 자라요',y:120,f:'34px ',ff:FS},{t:'♡',y:175,f:'34px ',ff:FS}],-1.6,3.1,-6.97,0,1,1.2);
   poster([{t:'계획',y:60,f:'30px ',ff:FS},{t:'공부',y:100,f:'30px ',ff:FS},{t:'성장',y:140,f:'30px ',ff:FS},{t:'함께 ♡',y:182,f:'30px ',ff:FS}],-7.96,3,3.1,PI/2,1,1.3);
   poster([{t:'좋은 친구',y:60,f:'28px ',ff:FS},{t:'더 큰 꿈',y:105,f:'28px ',ff:FS},{t:'♡',y:150,f:'28px ',ff:FS}],7.96,3.2,-2.4,-PI/2,.9,1,'#3a3430');
   for(let i=0;i<8;i++){const c=[0x8aa8c8,0xe8b888,0xc8a8d8,0x9ac8a8][i%4];const ph=new THREE.Mesh(new THREE.PlaneGeometry(.34,.4),std(0xfbf6ec,{emissive:0x3a3630}));ph.position.set(-7.95,1.55+(i%2)*.5,4.1+Math.floor(i/2)*.42);ph.rotation.y=PI/2;ph.rotation.z=R(-.1,.1);G.add(ph);const im=new THREE.Mesh(new THREE.PlaneGeometry(.28,.26),std(c,{emissive:new THREE.Color(c).multiplyScalar(.3)}));im.position.set(.0,.03,.001);ph.add(im);}
   // board on left wall
   const brd=new THREE.Group();brd.position.set(-7.95,2.4,-2);brd.rotation.y=PI/2;G.add(brd);const cork=new THREE.Mesh(new THREE.PlaneGeometry(3,1.9),std(0xffffff,{map:TEX.cork}));brd.add(cork);const bl=makeLabel('📌 기숙사 게시판');bl.sprite.position.set(0,1.25,.1);bl.sprite.scale.set(2.2,.42,1);brd.add(bl.sprite);sp.boardGroup=brd;
   sp.triggers.push({x:-6.6,z:-2,r:1.5,act:'board',title:'게시판 보기',sub:''});
   {const rp=new THREE.Group();rp.position.set(2.4,0,-6.15);G.add(rp);box(rp,1.3,.72,.62,std(0x7a4a2a),0,.36,0);box(rp,1.34,.05,.66,std(0x5a3418),0,.73,0);[-.35,.35].forEach(x=>box(rp,.5,.5,.02,std(0x9a6a3e),x,.36,.315));
    box(rp,.9,.1,.6,std(0xb8865a),0,.8,0);const disc=cyl(rp,.24,.24,.02,28,std(0x1a1616),-.12,.86,0);cyl(rp,.08,.08,.022,16,std(0xc4584a),-.12,.865,0);
    const arm=box(rp,.03,.03,.36,MAT.gold,.22,.88,.02);arm.rotation.y=.5;const notes=[];for(let i=0;i<3;i++){const n=glow(0xffd28a,.5,.8);rp.add(n);notes.push({n,p:i*1.3});}
    T.push((t,dt)=>{disc.rotation.y+=dt*3.5;notes.forEach(o=>{const k=((t*.35+o.p)%1.6)/1.6;o.n.position.set(-.1+Math.sin(t*1.5+o.p)*.25,.95+k*1.4,.05);o.n.material.opacity=.9*(1-k);});});
    const L=makeLabel('🎵 오늘의 플레이리스트');L.sprite.position.set(0,1.55,0);L.sprite.scale.set(2.3,.43,1);rp.add(L.sprite);}
   sp.obs.push({x:2.4,z:-6.1,r:.8});sp.triggers.push({x:2.4,z:-5,r:1.4,act:'playlist',title:'오늘의 플레이리스트',sub:''});
   // rug + low table
   const rug=new THREE.Mesh(new THREE.PlaneGeometry(7.4,5),std(0xffffff,{map:ctex(256,192,(g,w,hh)=>{g.fillStyle='#5a6a48';g.fillRect(0,0,w,hh);g.strokeStyle='#c8a46a';g.lineWidth=6;g.strokeRect(8,8,w-16,hh-16);for(let i=0;i<60;i++){g.fillStyle=['#7a8a5a','#8a6a4a','#c8b088','#4a5a3a'][i%4];g.beginPath();g.arc(R(20,w-20),R(20,hh-20),R(4,10),0,PI*2);g.fill();}})}));rug.rotation.x=-PI/2;rug.position.set(0,.02,-.4);G.add(rug);
   box(G,3.8,.1,1.9,std(0x9a6a3e),0,.45,-.5);[[-1.7,-1.3],[1.7,-1.3],[-1.7,.3],[1.7,.3]].forEach(q=>box(G,.1,.4,.1,MAT.woodDark,q[0],.2,q[1]));
   const lap=(x,z,ry)=>{const g=new THREE.Group();g.position.set(x,.5,z);g.rotation.y=ry;G.add(g);box(g,.56,.03,.4,std(0xa8a8b0),0,0,0);const sc=new THREE.Group();sc.position.set(0,.01,.2);sc.rotation.x=-1.85;g.add(sc);box(sc,.56,.02,.38,std(0xa8a8b0),0,-.01,.19);const scr=new THREE.Mesh(new THREE.PlaneGeometry(.5,.32),emis(0xcfe2f2,.8));scr.position.set(0,.002,.19);scr.rotation.x=-PI/2;sc.add(scr);};
   lap(-.6,-.9,0);lap(1.2,-.2,PI*.8);
   [[.3,-.2,0xa86a3a],[-1.3,-.1,0x2a2422],[.7,-1,0xf2d8d8]].forEach(c=>{cyl(G,.08,.065,.26,12,std(c[2]),c[0],.63,c[1]);cyl(G,.085,.085,.03,12,std(0xf6f0e6),c[0],.77,c[1]);});
   cyl(G,.08,.08,.36,12,std(0xf2b8c0,{emissive:0x301418}),.95,.68,.15);cyl(G,.06,.06,.06,10,std(0xf8f0f0),.95,.89,.15);
   box(G,.42,.12,.18,std(0xf2c8c8),-.2,.56,.15);[[-1.4,-1,3],[.1,-1.15,2]].forEach(b=>{for(let k=0;k<b[2];k++){const bb=box(G,.5,.07,.36,std([0x3a5a8a,0xe8dcc8,0x6a8a6a][k%3]),b[0],.54+k*.075,b[1]);bb.rotation.y=R(-.2,.2);}});
   for(let i=0;i<7;i++){const pp=new THREE.Mesh(new THREE.PlaneGeometry(.3,.4),std(0xfbf6ec,{emissive:0x3a3630}));pp.rotation.x=-PI/2;pp.rotation.z=R(-.6,.6);pp.position.set(R(-1.6,1.6),.505+i*.001,R(-1.2,.2));G.add(pp);}
   for(let i=-1;i<=1;i++)sp.obs.push({x:i*1.3,z:-.5,r:1});
   const cush=(x,z,c,ry,seat)=>{const m=sph(G,.42,std(c,{emissive:new THREE.Color(c).multiplyScalar(.12)}),x,.16,z,1.15,.38,1.1);m.rotation.y=ry;if(seat)addSeat(sp,x,z,ry,.24);};
   const CC=[0x6a7a52,0xf0e2c8,0x9aa8a0,0xe8b8b8,0x4a5a7a,0xd8c8a0,0x8a9a6a,0xf2d0c0];
   [-1.25,0,1.25].forEach((x,i)=>{cush(x,1.05,CC[i],0,true);cush(x,-2.05,CC[i+3],PI,true);});cush(-2.55,-.5,CC[6],-PI/2,true);cush(2.55,-.5,CC[7],PI/2,true);
   // pendant lamp
   cyl(G,.012,.012,1.3,4,std(0x2a2a30),0,4.95,-.5);const dome=new THREE.Mesh(new THREE.SphereGeometry(.5,24,12,0,PI*2,0,PI/2),std(0x2a2a30,{side:THREE.DoubleSide}));dome.position.set(0,4,-.5);G.add(dome);const lg=glow(0xffd8a0,2.6,.9);lg.position.set(0,3.85,-.5);G.add(lg);
   // floor lamp
   cyl(G,.03,.03,2,6,MAT.gold,-6.2,1,-4.4);const sh=new THREE.Mesh(new THREE.CylinderGeometry(.3,.42,.5,16,1,true),emis(0xf6d8a0,.8));sh.position.set(-6.2,2.15,-4.4);G.add(sh);const sg=glow(0xffd090,2.6,.6);sg.position.set(-6.2,2.1,-4.4);G.add(sg);sp.obs.push({x:-6.2,z:-4.4,r:.45});
   // sofa (right wall)
   const sofa=new THREE.Group();sofa.position.set(6.9,0,1.8);sofa.rotation.y=PI/2;G.add(sofa);box(sofa,3.4,.5,1.1,std(0x7a8aa0),0,.35,0);box(sofa,3.4,.85,.32,std(0x6a7a90),0,.85,.45);[-1,1].forEach(s=>box(sofa,.3,.7,1.1,std(0x6a7a90),s*1.7,.5,0));
   [[-1,0xf0e2c8],[0,0xe8b8b8],[1,0x9aa8a0]].forEach(c=>{const p=box(sofa,.6,.5,.18,std(c[1]),c[0],.85,.25);p.rotation.x=-.25;});const bl2=box(sofa,1.2,.06,1,std(0x6a7a52),.9,.62,-.05);bl2.rotation.z=.08;
   sp.obs.push({x:6.9,z:.6,r:.75},{x:6.9,z:1.8,r:.75},{x:6.9,z:3,r:.75});addSeat(sp,6.6,1.2,PI/2,.6);addSeat(sp,6.6,2.4,PI/2,.6);
   // beanbag by the window
   const bb=sph(G,.62,std(0xc8584a,{emissive:0x2a0c08}),5.3,.42,-4.4,1.1,.7,1.05);const bb2=sph(G,.45,std(0xc8584a),5.3,.7,-3.95,1.1,.9,.6);sp.obs.push({x:5.3,z:-4.4,r:.7});addSeat(sp,5.3,-4.2,0,.52);
   cyl(G,.3,.25,.6,12,std(0xe8dcc8),7,.3,-5.8);for(let i=0;i<7;i++){const lf=sph(G,.32,ivyM,7+R(-.4,.4),1+R(0,.8),-5.8+R(-.4,.4),1,.25,.7);lf.rotation.set(R(-.6,.6),rnd()*3,R(-.6,.6));}sp.obs.push({x:7,z:-5.8,r:.5});
   cyl(G,.26,.2,.5,12,std(0xd8c8a8),-2.6,.25,-6.3);for(let i=0;i<6;i++){const lf=sph(G,.3,ivyM2,-2.6+R(-.35,.35),.9+R(0,.6),-6.3+R(-.3,.3),1,.25,.7);lf.rotation.set(R(-.6,.6),rnd()*3,R(-.6,.6));}
   // foreground cushions & blanket
   const fb=sph(G,.9,std(0xf0e2c8),-5.4,.25,4.8,1.3,.35,.9);sph(G,.7,std(0x9aa8a0),-4.3,.3,5.4,1.2,.4,.8);sph(G,1.1,std(0x6a7a52),5.2,.22,5,1.4,.3,1);sph(G,.6,std(0xf0e2c8),4.6,.45,4.6,1.2,.45,.8);sp.obs.push({x:-5,z:5,r:1.1},{x:5,z:5,r:1.2});
   // seasonal decor
   if(S.key==='xmas'){xmasTree(G,-6.4,1.2,.45,T);sp.obs.push({x:-6.4,z:1.2,r:.8});}
   if(S.key==='halloween'){[-1.2,.6].forEach(x=>pumpkin(G,x,.5,-.4,.45));pumpkin(G,6.4,.8,-6.5,.6);bats(G,0,3.8,0,6,T);}
   if(S.key==='birthday'){cake(G,0,-.5,.38,T);G.children[G.children.length-1].position.y=.5;balloons(G,[[-6,3,4],[-5.4,3.4,4.6],[6,3.2,-5.8],[5.4,3.6,-5.2],[-2.8,3.6,-3.2],[2.8,3.4,-3.2]],T);bunting(G,-7.8,-5.6,0,-5.6,4.4);const L=makeLabel('🎉 이달의 생일 축하해요! 🎉',{bg:'rgba(255,240,245,.92)',fg:'#c23a5a',line:'#ff9ab8'});L.sprite.position.set(0,3.2,-3.5);L.sprite.scale.set(3.8,.72,1);G.add(L.sprite);}
   if(S.blossom){cyl(G,.1,.13,.34,10,std(0xf2ead8),1.5,.62,-1);for(let i=0;i<10;i++)sph(G,.07,std(0xf6c0d0),1.5+R(-.25,.25),.95+R(0,.4),-1+R(-.25,.25));}
   if(S.key==='autumn'){for(let i=0;i<5;i++)sph(G,.09,std(0xf07a2a),-.9+R(-.15,.15),.58,.1+R(-.15,.15));}
 }
 return sp;}
