/* 몽원학당 · characters: chibi hanbok + gat, bipedal animals, drawn faces with expressions */
const EYE=std(0x1a1414),SCARF=std(0xc4584a,{emissive:0x3a1008}),IVORY=std(0xfbf6ec,{emissive:0x4a463c}),PINKPAD=std(0xf2a6ae,{emissive:0x401818});
const GATM=new THREE.MeshToonMaterial({color:0x1a1512,gradientMap:GRAD,transparent:true,opacity:.84,depthWrite:false}),BEAD=std(0xe0a64a,{emissive:0x3a2008});
const fur=c=>std(c,{emissive:new THREE.Color(c).multiplyScalar(.16)});
const AVATARS=[
 {id:'girl',name:'여학생 · 한복 치마',emo:'👧',type:'human',fem:true},
 {id:'boy',name:'남학생 · 한복 바지',emo:'👦',type:'human'},
 {id:'cat-black',name:'검은 고양이',emo:'🐈‍⬛',type:'beast',sp:'cat',c:0x2e2e36,b:0x4a4a54,ear:'cat',eye:'#f2c84b',tail:'long',vest:0xc4584a},
 {id:'cat-white',name:'흰 고양이',emo:'🐱',type:'beast',sp:'cat',c:0xf8f5ef,b:0xffffff,ear:'cat',eye:'#6fa8d8',tail:'long',vest:0x7f9cc0},
 {id:'cat-cheese',name:'치즈 고양이',emo:'🐈',type:'beast',sp:'cat',c:0xf2a650,b:0xfbecd0,ear:'cat',eye:'#7aa83a',tail:'long',stripe:true,vest:0x6f9a7a},
 {id:'cat-tuxedo',name:'턱시도 고양이',emo:'🐈‍⬛',type:'beast',sp:'cat',c:0x26262c,b:0xffffff,ear:'cat',eye:'#9bc34a',tail:'long',mask:'tuxedo',vest:0xc9952a},
 {id:'corgi',name:'웰시코기',emo:'🐶',type:'beast',sp:'dog',c:0xf0a64a,b:0xffffff,ear:'big',tail:'stub',mask:'corgi',vest:0x8aa86a},
 {id:'jindo',name:'진돗개',emo:'🐕',type:'beast',sp:'dog',c:0xfaf6ec,b:0xfffdf8,ear:'dog',tail:'curl',mask:'jindo',vest:0xb8625a},
 {id:'sapsal',name:'삽살개',emo:'🐕‍🦺',type:'beast',sp:'dog',c:0xf2eee6,b:0xfaf8f2,ear:'flop',tail:'puff',shaggy:true,mask:'sapsal',vest:0x5a7aa8},
 {id:'maltese',name:'말티즈',emo:'🐩',type:'beast',sp:'dog',c:0xffffff,b:0xffffff,ear:'flop',tail:'puff',fluffy:true,vest:0xe8a8b8},
 {id:'frog',name:'개구리',emo:'🐸',type:'frog'},
 {id:'turtle',name:'거북이',emo:'🐢',type:'turtle'},
 {id:'bird',name:'흰 오목눈이',emo:'🐦',type:'bird'},
 {id:'peacock',name:'공작',emo:'🦚',type:'bird',peacock:true,bc:0x2f6fc0,lc:0x2e8a6a,beak:'#4a4a52'},
 {id:'crane',name:'학',emo:'🕊️',type:'bird',crane:true,bc:0xfbfaf6,lc:0x26262c,beak:'#c8b46a'},
 {id:'duck',name:'오리',emo:'🦆',type:'bird',duck:true,bc:0xffe27a,lc:0xf28a2a,beak:'#f28a2a'},
 {id:'mandarin',name:'원앙',emo:'🦆',type:'bird',mandarin:true,bc:0xe89a4a,lc:0xe0702a,beak:'#d8402a'},
 {id:'cheongryong',name:'청룡 · 사방신',emo:'🐉',type:'beast',sp:'dragon',c:0x3f93ad,b:0xf4e8bc,ear:'none',horn:'antler',tail:'dragon',vest:0x2a4a7a,god:true},
 {id:'baekho',name:'백호 · 사방신',emo:'🐯',type:'beast',sp:'cat',c:0xfbf8f2,b:0xffffff,ear:'round',eye:'#5aa0d8',tail:'long',mask:'tiger',tiger:true,vest:0x6a7a8a,god:true},
 {id:'jujak',name:'주작 · 사방신',emo:'🐦‍🔥',type:'bird',phoenix:true,beak:'#d89a2a',god:true},
 {id:'hyeonmu',name:'현무 · 사방신',emo:'🐢',type:'turtle',dark:true,god:true}];
const AVMAP=Object.fromEntries(AVATARS.map(a=>[a.id,a]));
const FACES=[['base','🙂','기본'],['smile','😊','웃음'],['joy','🤩','신남'],['wow','😮','놀람'],['sleepy','😪','졸림'],['shy','😳','부끄'],['focus','📖','집중']];

/* ---------- drawn faces ---------- */
const FACE_CACHE={};
/* 손그림 거북이의 점눈·말랑한 볼·작은 고양이 미소를 공유하는 새로운 얼굴 질감 */
function faceTex(cfg,expr){
 const key='village-2026|'+cfg.id+'|'+expr;if(FACE_CACHE[key])return FACE_CACHE[key];
 const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.lineCap='round';g.lineJoin='round';
 const x0=128,ey=124,ex=42;const blush=expr==='shy'?'#ef9f9d':'#efb5a9';
 for(const s of [-1,1]){
  const cx=x0+s*78,cy=157;const rg=g.createRadialGradient(cx,cy,3,cx,cy,37);rg.addColorStop(0,expr==='shy'?'rgba(242,140,144,.67)':'rgba(246,172,157,.54)');rg.addColorStop(.58,'rgba(246,180,157,.33)');rg.addColorStop(1,'rgba(246,180,157,0)');g.fillStyle=rg;g.beginPath();g.arc(cx,cy,37,0,Math.PI*2);g.fill();
 }
 g.fillStyle='#292922';g.strokeStyle='#292922';g.lineWidth=7;
 for(const s of [-1,1]){
  const x=x0+s*ex;
  if(expr==='smile'||expr==='sleepy'||expr==='shy'){
   g.beginPath();g.arc(x,ey+2,10,Math.PI*1.1,Math.PI*1.9);g.stroke();
  }else if(expr==='blink'){g.beginPath();g.moveTo(x-9,ey+2);g.quadraticCurveTo(x,ey+7,x+9,ey+2);g.stroke();}
  else{g.beginPath();g.ellipse(x,ey,10,12,0,0,Math.PI*2);g.fill();g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.arc(x+3,ey-4,2.1,0,Math.PI*2);g.fill();g.fillStyle='#292922';}
 }
 g.lineWidth=7.5;g.strokeStyle='#292922';g.beginPath();
 if(expr==='wow'){g.fillStyle='#292922';g.ellipse(x0,168,9,11,0,0,Math.PI*2);g.fill();}
 else if(expr==='joy'){g.fillStyle='#8f5751';g.ellipse(x0,166,17,13,0,0,Math.PI);g.fill();g.stroke();}
 else{g.moveTo(100,166);g.bezierCurveTo(113,178,120,169,128,165);g.bezierCurveTo(137,176,146,175,156,162);g.stroke();}
 if(cfg.stripe||cfg.tiger){g.lineWidth=5;g.strokeStyle=cfg.tiger?'rgba(76,83,84,.5)':'rgba(187,121,65,.45)';for(const dx of [-16,0,16]){g.beginPath();g.moveTo(128+dx,63);g.lineTo(128+dx*.7,81);g.stroke();}}
 if(expr==='sleepy'){g.font='bold 25px sans-serif';g.fillStyle='#90a5b1';g.fillText('z',192,73);}
 const t=new THREE.CanvasTexture(c);t.anisotropy=4;FACE_CACHE[key]=t;return t;
}
function star(g,x,y,r){g.beginPath();for(let i=0;i<10;i++){const a=i/10*PI*2-PI/2,rr=i%2?r*.45:r;g[i?'lineTo':'moveTo'](x+Math.cos(a)*rr,y+Math.sin(a)*rr);}g.closePath();g.fill();}
function faceDecal(head,r,cfg,sx,sy,sz,lift){const geo=new THREE.SphereGeometry(r*1.022,36,26,PI*1.5-PI*.42,PI*.84,PI*.5-PI*.34,PI*.66);
  const m=new THREE.MeshToonMaterial({map:faceTex(cfg,'base'),alphaTest:.3,gradientMap:GRAD,emissive:0x2a2420});
  const d=new THREE.Mesh(geo,m);d.scale.set(sx||1,sy||1,sz||1);d.position.y=lift||0;d.renderOrder=2;head.add(d);return d;}

/* ---------- gat & hanbok bits ---------- */
function makeGat(p,y,s,tilt){const g=new THREE.Group();g.position.y=y;g.scale.setScalar(s);g.rotation.x=tilt||-.08;p.add(g);
  const brim=new THREE.Mesh(new THREE.CylinderGeometry(.6,.6,.014,36),GATM);g.add(brim);const rim=new THREE.Mesh(new THREE.TorusGeometry(.6,.012,4,36),GATM);rim.rotation.x=PI/2;g.add(rim);
  const crown=new THREE.Mesh(new THREE.CylinderGeometry(.19,.21,.32,24),GATM);crown.position.y=.17;g.add(crown);const band=new THREE.Mesh(new THREE.TorusGeometry(.212,.018,6,24),std(0x3a2a1e));band.rotation.x=PI/2;band.position.y=.03;g.add(band);
  sph(g,.04,std(0x8fd3bd,{emissive:0x2a5a4a}),0,.06,-.21);
  [-1,1].forEach(sd=>{for(let i=0;i<9;i++){const t=i/8;sph(g,.026,BEAD,sd*.27*(1-t*.85),-.04-Math.sin(t*PI/2)*.55,-.05-t*.2);}});return g;}
function goreum(p,y,z,col){sph(p,.05,col||SCARF,.07,y,z);box(p,.05,.3,.02,col||SCARF,.06,y-.17,z-.005).rotation.z=.1;box(p,.05,.22,.02,col||SCARF,.11,y-.13,z).rotation.z=-.15;}
function avatarBook(A,y,z){const b=new THREE.Group();b.position.set(0,y,z);[-1,1].forEach(s=>{const h=new THREE.Group();h.rotation.z=s*.25;b.add(h);box(h,.22,.02,.3,std(0x3a5a8a),s*.12,-.012,0);box(h,.2,.03,.28,std(0xfbf4e2,{emissive:0x6a5a40}),s*.11,.008,0);});const pg=new THREE.Group();pg.position.set(0,.03,0);b.add(pg);const pm=box(pg,.19,.006,.26,std(0xffffff,{emissive:0x7a6a50}),.1,0,0);pm.visible=false;A.page=pg;A.pageM=pm;A.bookY=y;A.bookZ=z;b.rotation.x=-.5;b.visible=false;A.bob.add(b);A.book=b;}

/* ---------- builders ---------- */
function makeAvatar(id,look){if(id==='shiba')id='sapsal';const cfg=AVMAP[id]||AVATARS[0];const A={id,cfg,garb:[],legWear:[],sleeves:[],root:new THREE.Group(),bob:new THREE.Group(),legs:[],arms:[],tails:[],hop:false,waddle:0,h:2.2,face:null,expr:'base',blinkAt:performance.now()+2000+Math.random()*3000};A.root.add(A.bob);
  const sh=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.2),new THREE.MeshBasicMaterial({map:TEX.shadow,transparent:true,depthWrite:false}));sh.rotation.x=-PI/2;sh.position.y=.03;A.root.add(sh);
  const B=A.bob;
  if(cfg.type==='human'){const fem=cfg.fem;const skin=std(0xffe6d2,{emissive:0x4a3428});const shoe=std(0x2a2422);
    const main=fem?std(0x9fadc2,{emissive:0x1a1e26}):std(0xaebccc,{emissive:0x1c2026});
    [-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.1,.36,0);B.add(g);if(!fem){A.legWear.push(cyl(g,.1,.09,.28,10,std(0xe8e4dc,{emissive:0x302e2a}),0,-.14,0),cyl(g,.075,.075,.05,8,std(0x8a96aa),0,-.27,0));}sph(g,.08,shoe,0,-.33,-.03,1,.6,1.45);A.legs.push({g,ph:i?PI:0});});
    const n0=B.children.length;
    if(fem){const ch=new THREE.Mesh(new THREE.CylinderGeometry(.19,.42,.82,24),main);ch.position.y=.52;B.add(ch);A.skirt=ch;for(let k=0;k<10;k++){const a=k/10*PI*2;box(ch,.01,.8,.01,std(0x8090a8),Math.sin(a)*.31,0,Math.cos(a)*.31).rotation.x=Math.cos(a)*.27;}
      cyl(B,.18,.24,.24,18,IVORY,0,1.0,0);box(B,.045,.26,.02,std(0x8a9ab4),.04,1.01,-.22).rotation.z=.6;goreum(B,.96,-.22,std(0x8a9ab4));}
    else{const coat=new THREE.Mesh(new THREE.CylinderGeometry(.2,.34,.62,22),main);coat.position.y=.78;B.add(coat);A.skirt=coat;box(B,.045,.5,.02,std(0x8a96aa),.05,.86,-.23).rotation.z=.4;goreum(B,.9,-.25,std(0xf3efe6));const belt=new THREE.Mesh(new THREE.TorusGeometry(.27,.02,6,20),std(0x6a7488));belt.rotation.x=PI/2;belt.position.y=.82;B.add(belt);}
    const col=new THREE.Mesh(new THREE.TorusGeometry(.12,.03,6,18),IVORY);col.rotation.x=PI/2;col.position.y=fem?1.13:1.1;B.add(col);A.garb=B.children.slice(n0);A.skirt0=A.skirt;
    [-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.22,1.06,0);g.rotation.z=s*.2;B.add(g);A.sleeves.push(sph(g,.1,fem?IVORY:main,0,-.17,0,1,1.9,1));sph(g,.055,skin,0,-.36,0);A.arms.push({g,ph:i?0:PI,s});});
    const head=new THREE.Group();head.position.y=1.5;B.add(head);A.head=head;
    sph(head,.4,skin,0,0,0,1,.96,.95);A.face=faceDecal(head,.4,cfg,1,.96,.95);
    if(fem){const hair=std(0x1e1a1a,{emissive:0x0a0808});const cap=new THREE.Mesh(new THREE.SphereGeometry(.43,24,16,0,PI*2,0,PI*.5),hair);cap.position.set(0,.03,.03);cap.rotation.x=.32;head.add(cap);
      const side=new THREE.Mesh(new THREE.CylinderGeometry(.43,.45,.36,24,1,true,.9-PI,PI*2-1.8),hair);side.material.side=THREE.DoubleSide;side.position.y=-.12;head.add(side);
      const bang=new THREE.Mesh(new THREE.SphereGeometry(.42,24,10,PI*1.5-.95,1.9,PI*.22,PI*.2),hair);bang.material.side=THREE.DoubleSide;bang.scale.set(1.02,1,1.04);head.add(bang);}
    else{const hair=std(0x7a5a42,{emissive:0x1a120c});const cap=new THREE.Mesh(new THREE.SphereGeometry(.43,24,16,0,PI*2,0,PI*.52),hair);cap.position.set(0,.03,.03);cap.rotation.x=.34;head.add(cap);
      for(let k=0;k<5;k++){const a=-.6+k*.3;sph(head,.1,hair,Math.sin(a)*.3,.3+Math.cos(k*1.7)*.025,-Math.cos(a)*.27,1.1,.6,.8);}sph(head,.08,hair,.05,.42,-.05);}
    A.gat=makeGat(head,.33,1.02,-.1);avatarBook(A,.98,-.42);A.h=2.4;A.waddle=.03;
    A.fit={y0:.42,y1:1.17,r1:.2,r0:.25,neck:1.15,legTop:.36,legLen:.3,legR:.1,sleeve:[.1,1.9,-.17],human:true};A.headR=.4;A.headS=[1,.96,.95];}
  else if(cfg.type==='beast'){const F=fur(cfg.c),Bl=fur(cfg.b);
    [-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.16,.3,0);B.add(g);sph(g,.12,F,0,-.1,0,1,1.25,1);sph(g,.12,Bl,0,-.24,-.05,1,.55,1.35);const pad=new THREE.Mesh(new THREE.CircleGeometry(.05,10),PINKPAD);pad.position.set(0,-.25,.06);pad.rotation.x=PI/2.2;g.add(pad);A.legs.push({g,ph:i?PI:0});});
    sph(B,.35,F,0,.56,0,1,1.05,.92);sph(B,.25,Bl,0,.54,-.15,1,1.15,.7);
    const n0=B.children.length;const vest=new THREE.Mesh(new THREE.CylinderGeometry(.31,.37,.34,24,1,true,PI+.55,PI*2-1.1),std(cfg.vest,{side:THREE.DoubleSide,emissive:new THREE.Color(cfg.vest).multiplyScalar(.15)}));vest.position.y=.68;B.add(vest);
    const col=new THREE.Mesh(new THREE.TorusGeometry(.2,.04,6,20),IVORY);col.rotation.x=PI/2;col.position.y=.86;B.add(col);goreum(B,.8,-.26);A.garb=B.children.slice(n0);
    [-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.32,.76,0);g.rotation.z=s*.4;B.add(g);sph(g,.085,F,0,-.13,0,1,1.7,1);sph(g,.075,Bl,0,-.27,0);A.arms.push({g,ph:i?0:PI,s});});
    const head=new THREE.Group();head.position.y=1.18;B.add(head);A.head=head;
    sph(head,.42,F,0,0,0,1.1,.94,1);A.face=faceDecal(head,.42,cfg,1.1,.94,1);
    [-1,1].forEach(s=>{
      if(cfg.ear==='cat'){const e=new THREE.Mesh(new THREE.ConeGeometry(.14,.3,4),F);e.position.set(s*.27,.33,0);e.rotation.set(0,PI/4,-s*.3);head.add(e);const ei=new THREE.Mesh(new THREE.ConeGeometry(.08,.2,4),PINKPAD);ei.position.set(s*.27,.31,-.05);ei.rotation.set(0,PI/4,-s*.3);head.add(ei);}
      else if(cfg.ear==='dog'||cfg.ear==='big'){const big=cfg.ear==='big';const e=new THREE.Mesh(new THREE.ConeGeometry(big?.19:.14,big?.5:.32,big?12:6),F);e.scale.z=.55;e.position.set(s*(big?.26:.27),big?.42:.34,.02);e.rotation.z=-s*(big?.32:.28);head.add(e);const ei=new THREE.Mesh(new THREE.ConeGeometry(big?.11:.08,big?.36:.22,10),std(0xfbe0d8));ei.scale.z=.4;ei.position.set(s*(big?.26:.27),big?.4:.32,-.03);ei.rotation.z=-s*(big?.32:.28);head.add(ei);}
      else if(cfg.ear==='round'){sph(head,.12,F,s*.3,.3,.02,1,1,.6);sph(head,.07,std(0x3a3036),s*.3,.31,-.03,1,1,.4);}
      else if(cfg.ear==='none'){}
      else{const e=sph(head,.17,F,s*.4,-.04,.02,.55,1.15,.8);e.rotation.z=s*.3;sph(head,.12,F,s*.42,-.22,.02);}});
    if(cfg.horn==='antler'){const H=std(0xe6b850,{emissive:0x3a2a08});[-1,1].forEach(s=>{const a=new THREE.Group();a.position.set(s*.2,.3,.08);a.rotation.z=-s*.35;head.add(a);cyl(a,.03,.04,.42,6,H,0,.2,0);const b1=cyl(a,.02,.03,.18,6,H,s*.06,.25,0);b1.rotation.z=-s*.8;const b2=cyl(a,.02,.03,.14,6,H,-s*.03,.33,0);b2.rotation.z=s*.7;});
      const W=std(0xe6b850,{emissive:0x3a2a08});[-1,1].forEach(s=>{for(let i=0;i<5;i++){sph(head,.022,W,s*(.22+i*.06),-.1-i*.035-i*i*.006,-.36+i*.04);}});
      const M=std(0x2a6a80,{emissive:0x081a20});for(let i=0;i<5;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(.07,.2,6),M);c.position.set(0,.32-i*.12,.28+i*.05);c.rotation.x=.9;head.add(c);}
      for(let i=0;i<4;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(.06,.16,6),M);c.position.set(0,.85-i*.13,.3);c.rotation.x=.6;B.add(c);}}
    if(cfg.tiger){const S=std(0x3a3036);[[.35,.68],[.33,.52],[.3,.36]].forEach((p,i)=>[-1,1].forEach(s=>{const m=sph(B,.06,S,s*p[0],p[1],.06,.35,.55,2.2);m.rotation.y=s*.4;}));[.68,.52].forEach(y=>{const m=sph(B,.05,S,0,y,.32,2.2,.4,.4);});}
    if(cfg.fluffy){for(let i=0;i<8;i++){const a=i/8*PI*2;sph(head,.12,F,Math.cos(a)*.32,.24+Math.sin(i)*.04,Math.sin(a)*.25);}for(let i=0;i<6;i++){const a=i/6*PI*2;sph(B,.12,F,Math.cos(a)*.3,.45,Math.sin(a)*.26);}sph(head,.07,std(0xff8fb0),.24,.32,-.12);}
    if(cfg.shaggy){const sf=fur(0xf6f3ec),sg=fur(0xe2ddd2);for(let i=0;i<22;i++){const a=i/22*PI*2;if(Math.sin(a)<-.55)continue;const m=sph(head,.1,i%3?sf:sg,Math.cos(a)*R(.34,.44),R(-.2,.2),Math.sin(a)*R(.3,.38),1,R(2,2.8),1);m.rotation.z=R(-.2,.2);}
      [-.2,-.07,.07,.2].forEach(x=>{const m=sph(head,.075,sf,x,.24,-.37,1,2.2,.7);m.rotation.x=.35;});
      for(let i=0;i<18;i++){const a=i/18*PI*2;sph(B,.11,i%3?sf:sg,Math.cos(a)*.3,R(.3,.6),Math.sin(a)*.27,1,2.6,1);}}
    const tg=new THREE.Group();tg.position.set(0,.42,.3);B.add(tg);A.tails.push(tg);
    if(cfg.tail==='long'){tg.rotation.x=.4;sph(tg,.07,F,0,.12,.04,1,2.4,1);sph(tg,.065,F,0,.34,.02,1,1.4,1);}
    else if(cfg.tail==='curl'){const t=new THREE.Mesh(new THREE.TorusGeometry(.13,.07,8,16,PI*1.6),F);t.rotation.y=PI/2;t.position.set(0,.2,.04);tg.add(t);}
    else if(cfg.tail==='stub'){sph(tg,.1,F,0,.02,.04);}
    else if(cfg.tail==='dragon'){tg.rotation.x=.2;for(let i=0;i<7;i++){const r=.12-i*.012;sph(tg,r,i%2?F:fur(0x358aa2),0,.05+i*.08+Math.sin(i*.8)*.02,.06+i*.1-i*i*.008);}const tuft=std(0xe6b850,{emissive:0x3a2a08});for(let k=0;k<4;k++)sph(tg,.06,tuft,R(-.05,.05),.62+R(-.04,.04),.5+R(-.04,.04));}
    else sph(tg,.17,F,0,.1,.02);
    if(cfg.tiger&&cfg.tail==='long'){const S=std(0x3a3036);[.18,.3,.42].forEach(y=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.068,.016,6,14),S);r.rotation.x=PI/2;r.position.set(0,y,.03);tg.add(r);});}
    A.gat=makeGat(head,.37,.9,-.12);avatarBook(A,.78,-.4);A.h=2.0;A.waddle=.08;
    A.fit={y0:.28,y1:.88,r1:.33,r0:.4,neck:.86,legTop:.3,legLen:.2,legR:.135,sleeve:[.1,1.3,-.08]};A.headR=.42;A.headS=[1.1,.94,1];}
  else if(cfg.type==='frog'){const gr=std(0x8cc65a,{emissive:0x1a2810}),pale=std(0xd8eca0,{emissive:0x2a3018});
    [-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.2,.28,0);B.add(g);sph(g,.12,gr,0,-.08,0,1,1.2,1);sph(g,.13,gr,s*.04,-.24,-.07,1.2,.45,1.5);A.legs.push({g,ph:i?PI:0});});
    sph(B,.42,gr,0,.6,0,1.05,1.05,.92);sph(B,.3,pale,0,.56,-.16,1,1.05,.7);
    const head=new THREE.Group();head.position.y=1.08;B.add(head);A.head=head;sph(head,.44,gr,0,0,0,1.22,.82,1);A.face=faceDecal(head,.44,cfg,1.22,.82,1);
    [-1,1].forEach(s=>{sph(head,.13,gr,s*.26,.3,-.06);});
    [-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.38,.8,0);g.rotation.z=s*.45;B.add(g);sph(g,.08,gr,0,-.14,0,1,1.8,1);sph(g,.08,gr,0,-.3,0,1.2,.6,1.2);A.arms.push({g,ph:i?0:PI,s});});
    const n0=B.children.length;const col=new THREE.Mesh(new THREE.TorusGeometry(.26,.045,6,20),IVORY);col.rotation.x=PI/2;col.position.y=.86;B.add(col);goreum(B,.8,-.3);
    A.garb=B.children.slice(n0);A.gat=makeGat(head,.36,.82,-.08);avatarBook(A,.78,-.45);A.h=2.0;A.waddle=.09;
    A.fit={y0:.26,y1:.92,r1:.36,r0:.48,neck:.88,legTop:.28,legLen:.2,legR:.13,sleeve:[.095,1.4,-.1]};A.headR=.44;A.headS=[1.22,.82,1];}
  else if(cfg.type==='turtle'){const dk=cfg.dark;const gr=dk?std(0x5a7a7a,{emissive:0x0c1616}):std(0xa0c870,{emissive:0x1c2810}),bel=dk?std(0xe2cc94,{emissive:0x2a2410}):std(0xf2c66a,{emissive:0x3a2a10}),shell=std(dk?0x6a8a90:0xffffff,{map:TEX.shell,emissive:0x0c140a});
    [-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.16,.26,0);B.add(g);sph(g,.12,gr,0,-.1,0,1.1,1.15,1.1);A.legs.push({g,ph:i?PI:0});});
    sph(B,.33,gr,0,.55,0,1,1.05,.95);const plate=sph(B,.27,bel,0,.54,-.14,1,1.2,.55);[0,1,2].forEach(k=>box(B,.2-(k===1?0:.06),.02,.02,std(0xd89a3a),0,.42+k*.12,-.3));box(B,.02,.34,.02,std(0xd89a3a),0,.54,-.3);
    const dome=new THREE.Mesh(new THREE.SphereGeometry(.38,22,12,0,PI*2,0,PI/2),shell);dome.rotation.x=PI/2;dome.position.set(0,.58,.1);dome.scale.set(1,.7,1.05);B.add(dome);
    [-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.32,.72,0);g.rotation.z=s*.9;B.add(g);sph(g,.09,gr,0,-.13,0,1,1.6,1);A.arms.push({g,ph:i?0:PI,s});});
    const head=new THREE.Group();head.position.y=1.12;B.add(head);A.head=head;sph(head,.42,gr,0,0,0,1,.95,.98);A.face=faceDecal(head,.42,cfg,1,.95,.98);
    if(cfg.dark){const sk=std(0x6a8a4a,{emissive:0x101a08});const coil=new THREE.Mesh(new THREE.TorusGeometry(.42,.055,8,36,PI*1.6),sk);coil.rotation.set(PI/2,0,.6);coil.position.set(0,.62,.06);B.add(coil);
      const sh2=new THREE.Group();sh2.position.set(.3,.95,-.18);B.add(sh2);sph(sh2,.11,sk,0,0,0,1,.85,1.25);[-1,1].forEach(s=>sph(sh2,.022,EYE,s*.05,.04,-.11));const tg2=box(sh2,.02,.005,.08,std(0xd84a4a),0,-.02,-.17);
      const nk=sph(B,.06,sk,.38,.8,-.08,1,2,1);nk.rotation.z=-.4;}
    A.gat=makeGat(head,.36,.88,-.1);avatarBook(A,.78,-.42);A.h=2.0;A.waddle=.1;
    A.fit={y0:.3,y1:.84,r1:.31,r0:.37,neck:.84,legTop:.26,legLen:.18,legR:.13,sleeve:[.1,1.3,-.08],openBack:true};A.headR=.42;A.headS=[1,.95,.98];}
  else{ // bird (흰 오목눈이)
    const ph=cfg.phoenix;const wh=ph?std(0xe4553c,{emissive:0x3a0c06}):cfg.bc!=null?std(cfg.bc,{emissive:new THREE.Color(cfg.bc).multiplyScalar(.14)}):std(0xfbf8f2,{emissive:0x4a4844}),br=ph?std(0xf2b040,{emissive:0x3a2406}):cfg.lc!=null?std(cfg.lc,{emissive:new THREE.Color(cfg.lc).multiplyScalar(.12)}):std(0x7a5a46,{emissive:0x140c08});
    [-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.14,.22,-.02);B.add(g);cyl(g,.022,.022,.2,5,br,0,-.08,0);[-.4,0,.4].forEach(a=>{const t=box(g,.02,.02,.09,br,Math.sin(a)*.04,-.18,-.04);t.rotation.y=a;});A.legs.push({g,ph:i?PI:0});});
    const head=new THREE.Group();head.position.y=.68;B.add(head);A.head=head;sph(head,.52,wh,0,0,0,1,.95,.95);A.face=faceDecal(head,.52,cfg,1,.95,.95,0);
    for(let i=0;i<14;i++){const a=rnd()*PI*2,y=R(-.35,.2);sph(head,.12,wh,Math.cos(a)*.42,y,Math.sin(a)*.4*(Math.sin(a)<0?.0:.9)+(Math.sin(a)<0?.1:0));}
    [-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.46,.78,.04);B.add(g);sph(g,.2,wh,s*.12,-.04,0,1.2,.5,.85).rotation.z=s*.5;sph(g,.1,br,s*.04,.02,.02,1.2,.5,.8).rotation.z=s*.6;A.arms.push({g,ph:0,s,wing:true});});
    if(ph){const cols=[0xf2b040,0xe4553c,0xf08a30,0x3aa0a0,0xf2b040];cols.forEach((c,i)=>{const a=(i-2)*.28;const g=new THREE.Group();g.position.set(0,.5,.45);g.rotation.set(-1.1,a,0);B.add(g);sph(g,.08,std(c,{emissive:new THREE.Color(c).multiplyScalar(.2)}),0,.42,0,1,4.2,.35);sph(g,.06,std(0x2a7a8a,{emissive:0x0a2024}),0,.82,0,1,1,.4);});
      [-.12,0,.12].forEach((x,i)=>{const c=new THREE.Mesh(new THREE.ConeGeometry(.05,.28,6),i===1?br:wh);c.position.set(x,.5,.3);c.rotation.x=.7;head.add(c);sph(head,.04,br,x,.62,.42);});}
    else if(cfg.peacock){const fan=new THREE.Group();fan.position.set(0,.55,.42);fan.rotation.x=.28;B.add(fan);const fe=std(0x2e8a5a,{emissive:0x0a2a1a}),eg=std(0xe6c050,{emissive:0x3a2a08}),eb=std(0x1e4aa8,{emissive:0x081a3a}),ek=std(0x1a1a3a);
      for(let i=0;i<11;i++){const a=(i-5)*.27;const f=new THREE.Group();f.rotation.z=a;fan.add(f);sph(f,.075,fe,0,.5,0,1,6.2,.3);sph(f,.075,eg,0,.95,-.01,1,1.15,.3);sph(f,.055,eb,0,.95,-.025,1,1.1,.3);sph(f,.028,ek,0,.94,-.04,1,1.1,.3);}
      [-.09,0,.09].forEach(x=>{cyl(head,.008,.008,.24,4,br,x,.6,.02).rotation.z=-x*1.6;sph(head,.045,std(0x2f6fc0,{emissive:0x0a1a3a}),x*1.6,.73,.02);});}
    else if(cfg.duck){const o=std(0xf28a2a,{emissive:0x3a1a04});const bl=sph(head,.13,o,0,-.1,-.47,1.25,.42,1);const tl=box(B,.14,.04,.2,wh,0,.48,.56);tl.rotation.x=-.7;[-1,1].forEach(s=>sph(head,.06,wh,s*.08,.5,0,1,1.4,1));}
    else if(cfg.mandarin){const gr=std(0x2a7a5a,{emissive:0x08281a}),pu=std(0x6a3a8a,{emissive:0x1a0a2a}),wt=std(0xfbf8f2,{emissive:0x3a3a38}),or=std(0xf08a2a,{emissive:0x3a1a04});
      sph(head,.3,gr,0,.32,.14,1,.55,1.1);sph(head,.2,pu,0,.22,.36,1,.6,1);[-1,1].forEach(s=>{const w=sph(head,.16,wt,s*.43,.12,.02,.25,.35,1.3);w.rotation.y=s*.4;const sail=new THREE.Mesh(new THREE.ConeGeometry(.12,.3,4),or);sail.position.set(s*.32,.92,.18);sail.rotation.z=-s*.2;sail.scale.set(1,1,.25);B.add(sail);});
      sph(B,.3,pu,0,.42,-.3,1,.8,.35);const bl=sph(head,.07,std(0xd8402a,{emissive:0x3a0808}),0,-.08,-.5,1,.6,1.2);const tl=box(B,.14,.04,.24,gr,0,.48,.56);tl.rotation.x=-.6;}
    else if(cfg.crane){const bk=std(0x1e1e22,{emissive:0x050505});[-.12,0,.12].forEach((x,i)=>{const t=sph(B,.08,bk,x,.5,.58,1,.7,2.8);t.rotation.x=-.5+i*.05;});sph(head,.12,std(0xd8283a,{emissive:0x4a0808}),0,.5,-.04,1,.45,1);
      A.arms.forEach(a=>{sph(a.g,.09,bk,a.s*.22,-.08,0,1.2,.45,.8).rotation.z=a.s*.6;});}
    else{const tl=box(B,.16,.04,.42,br,0,.48,.56);tl.rotation.x=-.5;box(B,.1,.045,.2,wh,0,.42,.72).rotation.x=-.5;}
    const n0=B.children.length;const col=new THREE.Mesh(new THREE.TorusGeometry(.26,.04,6,20),IVORY);col.rotation.x=PI/2;col.position.y=.3;col.scale.set(1.3,1.3,1);B.add(col);
    A.garb=B.children.slice(n0);A.gat=makeGat(head,.42,.78,-.1);A.hop=true;avatarBook(A,.5,-.62);A.h=1.95;
    A.fit={y0:.24,y1:.66,r1:.55,r0:.4,neck:.62,bird:true,cy:.68,br:.54};A.headR=.52;A.headS=[1,.95,.95];}
  // 모든 종족을 말랑한 동글 얼굴의 같은 마을 친구처럼 표현해요.
  if(A.head){A.head.scale.multiplyScalar(cfg.type==='human'?1.05:1.075);}
  A.setFace=function(expr){if(!A.face||A.expr===expr)return;A.expr=expr;A.face.material.map=faceTex(cfg,expr);};
  if(typeof applyLook==='function'&&look)applyLook(A,look);
  return A;}
function animateAvatar(A,ph,amt,t,sit){const B=A.bob;
  if(sit){B.position.y=Math.sin(t*1.6)*.01;B.rotation.z=0;A.legs.forEach(l=>l.g.rotation.x=A.cfg.type==='bird'?0:PI/2.1);const rd=A.reading&&A.book&&A.book.visible;
    A.arms.forEach(a=>{if(a.wing){a.g.rotation.order='YXZ';a.g.rotation.y=rd?a.s*1.2+Math.sin(t*.8+a.s)*.04:0;a.g.rotation.z=rd?-a.s*.35:0;a.g.rotation.x=rd?.25:0;return;}a.g.rotation.x=rd?1.32+Math.sin(t*.8+a.s)*.03:1.0;a.g.rotation.z=a.s*(rd?.08:.3);});if(A.head){A.head.rotation.x=rd?.34+Math.sin(t*.5)*.03:.12;A.head.rotation.y=rd?Math.sin(t*.35)*.12:0;}
    if(A.book){if(rd){A.book.position.y=A.bookY+.14;A.book.position.z=A.bookZ-.02;A.book.rotation.x=-1.0+Math.sin(t*.7)*.03;const k=(t%5)/5;if(A.page){A.pageM.visible=k<.22;A.page.rotation.z=k<.22?k/.22*PI:0;}}else{A.book.position.y=A.bookY;A.book.position.z=A.bookZ;A.book.rotation.x=-.5;if(A.pageM)A.pageM.visible=false;}}return;}
  if(A.head)A.head.rotation.y=0;
  const hopY=A.hop?Math.abs(Math.sin(ph))*.2*amt:Math.abs(Math.sin(ph))*.05*amt;B.position.y=hopY+Math.sin(t*2)*.012;B.rotation.z=Math.sin(ph)*A.waddle*amt;
  A.legs.forEach(l=>l.g.rotation.x=Math.sin(ph+l.ph)*.6*amt);
  A.arms.forEach(a=>{if(a.wing){a.g.rotation.y=0;a.g.rotation.x=0;a.g.rotation.z=a.s*(Math.abs(Math.sin(ph*1.6))*.8*amt+Math.sin(t*2.5)*.06);return;}a.g.rotation.x=Math.sin(ph+a.ph)*.6*amt;a.g.rotation.z=a.s*(A.cfg.type==='human'?.18:.35);});
  A.tails.forEach((tg,i)=>{tg.rotation.z=Math.sin(t*3+i)*.25;});
  if(A.skirt)A.skirt.rotation.z=Math.sin(ph)*.04*amt;
  if(A.head){A.head.rotation.x=Math.sin(t*1.3)*.03;A.head.rotation.z=Math.sin(t*.9)*.05*(1-amt);}}
function faceTick(A,now,want){if(!A.face)return;if(now>A.blinkAt){if(now<A.blinkAt+130){if(want==='base'||want==='wow'||want==='joy'){A.setFace('blink');return;}}else A.blinkAt=now+2500+Math.random()*3500;}A.setFace(want);}
