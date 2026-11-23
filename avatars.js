/* 학당 공통 · characters: chibi hanbok + gat, bipedal animals, drawn faces with expressions */
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
 {id:'dino',name:'브라키오사우루스',emo:'🦕',type:'dino',species:'brachio',c:0x8acb99,b:0xe7f3cb,dinoColor:true},
 {id:'dino-triceratops',name:'트리케라톱스',emo:'🦕',type:'dino',species:'trike',c:0x76bca5,b:0xe5f3d2,dinoVariant:true,dinoColor:true},
 {id:'dino-stegosaurus',name:'스테고사우루스',emo:'🦕',type:'dino',species:'stego',c:0xe7ba78,b:0xffe5b8,dinoVariant:true,dinoColor:true},
 {id:'dino-tyrannosaurus',name:'티라노사우루스',emo:'🦕',type:'dino',species:'rex',c:0x82c3a1,b:0xe6e0b1,dinoVariant:true,dinoColor:true},
 {id:'dino-ankylosaurus',name:'안킬로사우루스',emo:'🦕',type:'dino',species:'anky',c:0xb6ca79,b:0xe5d6a6,dinoVariant:true,dinoColor:true},
 {id:'bird',name:'흰 오목눈이',emo:'🐦',type:'bird'},
 {id:'crane',name:'학',emo:'🪽',type:'bird',crane:true,bc:0xf9f7f2,lc:0x22252c,beak:'#2e2a24',crest:0xcf2e2e},
 {id:'duck',name:'오리',emo:'🦆',type:'bird',duck:true,bc:0xfcfbf5,lc:0xf28a2a,beak:'#ef8a2c'},
 {id:'mandarin',name:'원앙',emo:'🪿',type:'bird',mandarin:true,bc:0xf4e2b2,lc:0x2a7a66,beak:'#de4f33'},
 {id:'peacock',name:'공작',emo:'🦚',type:'bird',peacock:true,bc:0x1166c7,lc:0x12a18a,beak:'#80816a'},
 {id:'jujak',name:'주작',emo:'🔥',type:'bird',phoenix:true,bc:0xec5b3f,lc:0xf2b040,beak:'#f39a2f',god:true},
 {id:'eastern-dragon',name:'동양용',emo:'🐉',type:'beast',sp:'dragon',c:0x8fbde0,b:0xf1f7fe,ear:'none',horn:'antler',tail:'dragon',vest:0xd76860,dragonColor:true,dragonStyle:'east',noGat:true,god:true},
 {id:'western-dragon',name:'서양용',emo:'🐲',type:'beast',sp:'dragon',c:0xf3a0ad,b:0xffe5ce,ear:'none',tail:'dragon',vest:0xd76860,dragonColor:true,dragonStyle:'west',noGat:true,god:true},
 {id:'cheongryong',name:'청룡 · 사방신',emo:'🐉',type:'beast',sp:'dragon',c:0x3f93ad,b:0xf4e8bc,ear:'none',horn:'antler',tail:'dragon',vest:0x2a4a7a,god:true,noGat:true},
 {id:'baekho',name:'백호 · 사방신',emo:'🐯',type:'beast',sp:'cat',c:0xfbf8f2,b:0xffffff,ear:'round',eye:'#5aa0d8',tail:'long',mask:'tiger',tiger:true,vest:0x6a7a8a,god:true},
 {id:'hyeonmu',name:'현무 · 사방신',emo:'🐢',type:'turtle',dark:true,god:true}];
const AVMAP=Object.fromEntries(AVATARS.map(a=>[a.id,a]));
const FACES=[['base','🙂','기본'],['smile','😊','웃음'],['joy','🤩','신남'],['wow','😮','놀람'],['sleepy','😪','졸림'],['shy','😳','부끄'],['focus','📖','집중']];

/* ---------- drawn faces ---------- */
const FACE_CACHE={};
function faceTex(cfg,expr){
  if(cfg.dragonStyle||cfg.type==='dino'){
    const key='clean-face:'+cfg.id;
    if(!FACE_CACHE[key]){const c=document.createElement('canvas');c.width=c.height=4;FACE_CACHE[key]=new THREE.CanvasTexture(c);}
    return FACE_CACHE[key];
  }
  const key=cfg.id+'|'+expr;if(FACE_CACHE[key])return FACE_CACHE[key];
  const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.lineCap=g.lineJoin='round';
  const K=cfg.type==='dino'?'turtle':cfg.type==='human'?'human':cfg.type==='beast'?cfg.sp:cfg.type==='pet'?cfg.k:cfg.type;
  const ink=K==='human'?'#2a1c16':'#33241c';const big=K==='human';
  const bk=cfg.crane?'crane':cfg.duck?'duck':cfg.mandarin?'mandarin':cfg.peacock?'peacock':cfg.phoenix?'phoenix':'bird';
  let ex={human:40,cat:36,dog:36,frog:46,turtle:34,bird:24,dragon:30,totem:44,goblin:38}[K],ey={human:132,cat:122,dog:118,frog:104,turtle:124,bird:118,dragon:116,totem:108,goblin:124}[K],er;
  if(K==='bird'){const bdat={bird:[24,118,[8,9]],crane:[26,118,[6,7]],duck:[22,126,[8,9]],mandarin:[24,122,[8,9]],peacock:[26,116,[9,10]],phoenix:[25,118,[8,9]]}[bk]||[24,118,[8,9]]; ex=bdat[0]; ey=bdat[1]; er=bdat[2];}
  else er=K==='totem'?[13,15]:K==='goblin'?[12,14]:big?[14,18]:K==='dragon'?[12,14]:cfg.mask==='sapsal'?[8,10]:[10,12];
  // markings
  if(cfg.mask==='corgi'){g.fillStyle='#fff';g.beginPath();g.ellipse(128,182,72,52,0,0,PI*2);g.fill();g.beginPath();g.moveTo(118,60);g.quadraticCurveTo(128,40,138,60);g.lineTo(150,150);g.lineTo(106,150);g.closePath();g.fill();}
  if(cfg.mask==='shiba'){g.fillStyle='#fbefe0';g.beginPath();g.ellipse(128,178,66,44,0,0,PI*2);g.fill();[-1,1].forEach(s=>{g.beginPath();g.ellipse(128+s*ex,ey-26,9,6,0,0,PI*2);g.fill();});}
  if(cfg.mask==='jindo'){g.fillStyle='#ecd6b4';g.beginPath();g.ellipse(128,176,52,34,0,0,PI*2);g.fill();}
  if(cfg.stripe){g.strokeStyle='#d07a2a';g.lineWidth=6;[-16,0,16].forEach(dx=>{g.beginPath();g.moveTo(128+dx,40);g.lineTo(128+dx*.8,72);g.stroke();});}
  if(cfg.mask==='tuxedo'){g.fillStyle='#fff';g.beginPath();g.ellipse(128,186,70,50,0,0,PI*2);g.fill();g.beginPath();g.moveTo(122,70);g.quadraticCurveTo(128,58,134,70);g.lineTo(146,150);g.lineTo(110,150);g.closePath();g.fill();}
  if(cfg.mask==='tiger'){g.fillStyle='#3a3036';[[-14,40,6,26],[0,34,7,30],[14,40,6,26]].forEach(s=>{g.beginPath();g.ellipse(128+s[0],s[1]+s[3]/2,s[2],s[3]/2,0,0,PI*2);g.fill();});[-1,1].forEach(s=>[0,16].forEach(dy=>{g.beginPath();g.ellipse(128+s*96,150+dy,20,4.5,s*.25,0,PI*2);g.fill();}));}
  if(K==='totem'){g.fillStyle=cfg.blushC||'#f08a8a';[-1,1].forEach(s=>{g.beginPath();g.ellipse(128+s*84,150,18,11,0,0,PI*2);g.fill();});g.strokeStyle='#3a2416';g.lineWidth=7;[-1,1].forEach(s=>{g.beginPath();g.moveTo(128+s*20,ey-36);g.quadraticCurveTo(128+s*46,ey-50,128+s*72,ey-34);g.stroke();});}
  if(K==='goblin'){g.strokeStyle='#3a2416';g.lineWidth=8;[-1,1].forEach(s=>{g.beginPath();g.moveTo(128+s*18,ey-30);g.lineTo(128+s*58,ey-38);g.stroke();});}
  // blush
  const cuteFace=(K==='bird'||K==='dragon'||K==='cat'||K==='dog'||K==='frog'||K==='turtle'); const blushX=(K==='bird'||K==='dragon')?18:(big?26:22), blushY=(K==='bird'||K==='dragon')?20:(big?30:26), blushW=(K==='bird'||K==='dragon')?12:(big?20:16), blushH=(K==='bird'||K==='dragon')?8:(big?11:9); g.fillStyle=expr==='shy'?'#f3a2ad':'#f7c1c8';[-1,1].forEach(s=>{g.beginPath();g.ellipse(128+s*(ex+blushX),ey+blushY,blushW,blushH,0,0,PI*2);g.fill();});
  if(expr==='shy'){g.strokeStyle='#d8606e';g.lineWidth=2.5;[-1,1].forEach(s=>{for(let k=0;k<3;k++){const x=128+s*(ex+18)+k*8-8;g.beginPath();g.moveTo(x,ey+24);g.lineTo(x-5,ey+36);g.stroke();}});}
  // eyes
  g.fillStyle=ink;g.strokeStyle=ink;g.lineWidth=big?6:5;
  const dotEye=(x,scale)=>{scale=scale||1;const cute=(K==='bird'||K==='dragon');if(cfg.eye){g.fillStyle=cfg.eye;g.beginPath();g.ellipse(x,ey,er[0]*1.15*scale,er[1]*1.15*scale,0,0,PI*2);g.fill();g.fillStyle=ink;g.beginPath();g.ellipse(x,ey,er[0]*.45*scale,er[1]*.95*scale,0,0,PI*2);g.fill();}
    else if(cute){g.fillStyle='#fff';g.beginPath();g.ellipse(x,ey,er[0]*1.5*scale,er[1]*1.45*scale,0,0,PI*2);g.fill();g.fillStyle=ink;g.beginPath();g.ellipse(x,ey+er[1]*.1*scale,er[0]*.62*scale,er[1]*.88*scale,0,0,PI*2);g.fill();}
    else{if(cfg.eyeRing||K==='totem'){g.fillStyle='#fff';g.beginPath();g.ellipse(x,ey,er[0]*1.6*scale,er[1]*1.5*scale,0,0,PI*2);g.fill();}g.fillStyle=ink;g.beginPath();g.ellipse(x,ey,er[0]*scale,er[1]*scale,0,0,PI*2);g.fill();}
    g.fillStyle='#fff';g.beginPath();g.arc(x+er[0]*.28*scale,ey-er[1]*.42*scale,Math.max(2.8,er[0]*.34*scale),0,PI*2);g.fill();if(big||cute){g.beginPath();g.arc(x-er[0]*.18*scale,ey-er[1]*.06*scale,Math.max(1.8,er[0]*.14*scale),0,PI*2);g.fill();}g.fillStyle=ink;};
  [-1,1].forEach(s=>{const x=128+s*ex;
    if(expr==='base'){ if(cuteFace){dotEye(x,.92);} else dotEye(x); }
    else if(expr==='wow'){dotEye(x,cuteFace?1.18:1.3);}
    else if(expr==='joy'){ if(cuteFace){g.beginPath();g.arc(x,ey+2,er[0]*1.05,PI*1.08,PI*1.92);g.stroke();} else {dotEye(x,1.15);g.fillStyle='#fff8d0';star(g,x+er[0]*.1,ey-er[1]*.15,big?7:4.5);g.fillStyle=ink;} }
    else if(expr==='smile'){g.beginPath();g.arc(x,ey+(cuteFace?2:4),er[0]*.95,PI*1.08,PI*1.92);g.stroke();}
    else if(expr==='blink'){g.beginPath();g.arc(x,ey-er[1]*.55,er[0]*.95,PI*.15,PI*.85);g.stroke();}
    else if(expr==='sleepy'){g.beginPath();g.moveTo(x-er[0],ey+1);g.quadraticCurveTo(x,ey+6,x+er[0],ey+1);g.stroke(); if(cuteFace){g.beginPath();g.moveTo(x-er[0]*.7,ey-8);g.lineTo(x+er[0]*.7,ey-10);g.stroke();}}
    else if(expr==='shy'){ if(cuteFace){dotEye(x,.82);} else {g.beginPath();g.moveTo(x-s*er[0]*.9,ey-er[1]*.6);g.lineTo(x+s*er[0]*.7,ey);g.lineTo(x-s*er[0]*.9,ey+er[1]*.6);g.stroke();} }
    else if(expr==='focus'){ if(cuteFace){dotEye(x,.88);g.beginPath();g.moveTo(x-er[0]*.9,ey-8);g.lineTo(x+er[0]*.7,ey-10);g.stroke();} else {g.save();g.beginPath();g.rect(x-er[0]*1.5,ey,er[0]*3,er[1]*2);g.clip();dotEye(x);g.restore();g.beginPath();g.moveTo(x-er[0]*1.1,ey+1);g.lineTo(x+er[0]*1.1,ey+1);g.stroke();}}});
  if(expr==='sleepy'){g.font='bold 24px sans-serif';g.fillStyle='#8aa0c7';g.fillText('z',194,72);g.font='bold 16px sans-serif';g.fillText('z',210,54);}
  // nose / mouth
  const my={human:176,cat:160,dog:162,frog:150,turtle:166,bird:150,dragon:160,totem:178,goblin:178}[K];
  g.strokeStyle=ink;g.fillStyle=ink;g.lineWidth=4.5;
  const open=expr==='joy'||expr==='smile'&&K!=='human';
  if(K==='dog'){g.beginPath();g.ellipse(128,my-14,12,8,0,0,PI*2);g.fill();}
  if(K==='cat'){g.fillStyle='#e88a9a';g.beginPath();g.moveTo(121,my-14);g.lineTo(135,my-14);g.lineTo(128,my-6);g.closePath();g.fill();g.fillStyle=ink;g.strokeStyle='rgba(60,40,30,.55)';g.lineWidth=2.5;[-1,1].forEach(s=>[0,10].forEach(dy=>{g.beginPath();g.moveTo(128+s*34,my-8+dy);g.lineTo(128+s*70,my-14+dy*1.4);g.stroke();}));g.strokeStyle=ink;g.lineWidth=4.5;}
  if(K==='bird'){g.fillStyle=cfg.beak||'#3a2a20';g.beginPath();g.moveTo(118,my-16);g.lineTo(138,my-16);g.lineTo(128,my-3);g.closePath();g.fill(); if(expr==='base'||expr==='shy'||expr==='smile'){g.strokeStyle='rgba(40,28,20,.65)'; g.lineWidth=2.8; g.beginPath(); g.moveTo(124,my-7); g.quadraticCurveTo(128,my-2,132,my-7); g.stroke(); g.strokeStyle=ink; g.lineWidth=4.5;}}
  else if(expr==='wow'){g.beginPath();g.ellipse(128,my+2,8,10,0,0,PI*2);g.fill();}
  else if(K==='frog'){g.lineWidth=5;g.beginPath();g.moveTo(74,my-4);g.quadraticCurveTo(128,my+(open?34:18),182,my-4);g.stroke();if(open){g.fillStyle='#e86a7a';g.beginPath();g.moveTo(92,my+1);g.quadraticCurveTo(128,my+24,164,my+1);g.closePath();g.fill();}}
  else if(K==='cat'||K==='dog'){if(expr==='base'||expr==='shy'){g.beginPath();g.arc(122,my-1,6,PI*.05,PI*.95);g.stroke();g.beginPath();g.arc(134,my-1,6,PI*.05,PI*.95);g.stroke();} else if(open){g.fillStyle='#e86a7a';g.beginPath();g.arc(128,my+2,10,0,PI);g.fill();g.strokeStyle=ink;g.lineWidth=3.5;g.beginPath();g.arc(128,my-3,9,PI*.12,PI*.88);g.stroke();} else {g.beginPath();g.arc(118,my,8,PI*.05,PI*.95);g.stroke();g.beginPath();g.arc(138,my,8,PI*.05,PI*.95);g.stroke();}}
  else if(K==='totem'||K==='goblin'){g.fillStyle='#8a2a2a';g.beginPath();g.moveTo(84,my-8);g.quadraticCurveTo(128,my+(open?46:30),172,my-8);g.closePath();g.fill();g.fillStyle='#fff';[-1,1].forEach(s=>{g.beginPath();g.moveTo(128+s*20,my-6);g.lineTo(128+s*30,my-6);g.lineTo(128+s*25,my+8);g.closePath();g.fill();});}
  else if(K==='dragon'){const dm=my+4; if(expr==='wow'){g.beginPath();g.ellipse(128,dm+1,6,8,0,0,PI*2);g.fill();} else if(open){g.fillStyle='#e86a7a';g.beginPath();g.arc(128,dm+1,10,0,PI);g.fill();g.fillStyle='#fff8f6';[-1,1].forEach(s=>{g.beginPath();g.moveTo(128+s*5,dm-3);g.lineTo(128+s*9,dm+4);g.lineTo(128+s*3,dm+4);g.closePath();g.fill();});g.strokeStyle=ink;g.lineWidth=3.5;g.beginPath();g.arc(128,dm-3,9,PI*.12,PI*.88);g.stroke();} else if(expr==='shy'||expr==='base'||expr==='smile'){g.beginPath();g.arc(122,dm-1,5.5,PI*.1,PI*.92);g.stroke();g.beginPath();g.arc(134,dm-1,5.5,PI*.08,PI*.9);g.stroke();g.beginPath();g.moveTo(126,dm+1);g.quadraticCurveTo(128,dm+3,130,dm+1);g.stroke();} else {g.beginPath();g.arc(128,dm-5,14,PI*.16,PI*.84);g.stroke();}}
  else if(K==='turtle'){if(open){g.fillStyle='#e8707a';g.beginPath();g.ellipse(128,my,11,9,0,0,PI*2);g.fill();} else {g.strokeStyle=ink;g.lineWidth=3.8;g.beginPath();g.moveTo(121,my);g.quadraticCurveTo(128,my+5,135,my);g.stroke();}}
  else{ if(expr==='joy'){g.fillStyle='#d8606a';g.beginPath();g.arc(128,my-3,11,0,PI);g.fill();}else if(expr==='shy'){g.beginPath();g.moveTo(121,my);g.quadraticCurveTo(128,my+4,135,my);g.stroke();}else if(expr==='sleepy'||expr==='focus'){g.beginPath();g.moveTo(120,my);g.lineTo(136,my);g.stroke();}else{g.beginPath();g.arc(128,my-6,8,PI*.18,PI*.82);g.stroke();}}
  if(cfg.mask==='sapsal'){g.fillStyle='#ef9a86';g.beginPath();g.ellipse(128,my+16,11,15,0,0,PI*2);g.fill();g.strokeStyle='rgba(200,110,96,.7)';g.lineWidth=2;g.beginPath();g.moveTo(128,my+6);g.lineTo(128,my+20);g.stroke();}
  const t=new THREE.CanvasTexture(c);t.anisotropy=4;FACE_CACHE[key]=t;return t;}
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

function lookPick(look,key,def){try{const i=look&&look.c&&look.c[key];return i&&typeof PALETTE!=='undefined'&&PALETTE[i]?PALETTE[i][1]:def;}catch(e){return def;}}
function glowMat(hex){return std(hex,{emissive:new THREE.Color(hex).multiplyScalar(.22)});}
/* 용 캐릭터 전용 3D 모델러: 둥근 주둥이, 동양용의 S자 몸, 서양용의 네 발과 박쥐 날개 */
function dragonLine(parent,points,radius,mat){
  const crv=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
  const m=new THREE.Mesh(new THREE.TubeGeometry(crv,Math.max(20,points.length*9),radius,8,false),mat);
  parent.add(m);return m;
}
function dragonSphere(parent,r,mat,x,y,z,sx=1,sy=1,sz=1){return sph(parent,r,mat,x,y,z,sx,sy,sz);}

/* 검은 점눈 + 복숭아 볼 + 작은 ω 미소: 눈을 별도 3D 표면으로 만들어 프릴/얼굴에 가려지지 않게 한다. */
function addKawaiiFace(A,head,o){
  const r=o.r, sx=o.sx||1, sy=o.sy||1, sz=o.sz||1, shift=o.shift||0;
  const dark=new THREE.MeshBasicMaterial({color:0x30252a});
  const pink=new THREE.MeshBasicMaterial({color:o.pink||0xf4b1a2,transparent:true,opacity:.88,depthWrite:false});
  const white=new THREE.MeshBasicMaterial({color:0xffffff});
  // 원래 머리보다 전방(−Z)으로 배치: 2겹 얼굴인 트리케라톱스도 눈이 보이도록.
  const surface=(x,y)=>-shift-r*sz*Math.sqrt(Math.max(.10,1-(x/(r*sx))**2-(y/(r*sy))**2));
  const openEyes=new THREE.Group(),closedEyes=new THREE.Group(); head.add(openEyes,closedEyes);
  const ex=o.ex||r*.34,ey=o.ey==null?r*.12:o.ey,es=o.eyeSize||r*.087;
  [-1,1].forEach(s=>{
    const x=s*ex, z=surface(x,ey)-es*.18;
    const eye=sph(openEyes,es,dark,x,ey,z,.84,1.2,.50);
    eye.renderOrder=5;
    const lidZ=surface(x,ey)-.021;
    dragonLine(closedEyes,[[x-es*.83,ey,lidZ],[x,ey-es*.25,lidZ-.009],[x+es*.83,ey,lidZ]],es*.17,dark);
    const cx=s*(o.cheekX||r*.62),cy=o.cheekY==null?-r*.12:o.cheekY;
    const cheek=sph(head,r*.105,pink,cx,cy,surface(cx,cy)-.013,1.14,.72,.38);
    cheek.renderOrder=4;
  });
  const mouthY=o.mouthY==null?-r*.46:o.mouthY;
  const mz=o.mouthZ==null?surface(0,mouthY)-.019:o.mouthZ;
  const k=r*.24;
  const smile=new THREE.Group(),openMouth=new THREE.Group(),sleepMouth=new THREE.Group();
  head.add(smile,openMouth,sleepMouth);
  // 코/콧구멍을 전혀 그리지 않고, 입 하나만 선으로 만든다.
  dragonLine(smile,[[-k,mouthY,mz],[-k*.52,mouthY-k*.19,mz-.008],[0,mouthY+k*.03,mz-.013],[k*.52,mouthY-k*.19,mz-.008],[k,mouthY,mz]],.0065,dark);
  const oM=sph(openMouth,k*.27,dark,0,mouthY-.008,mz-.009,.78,1.08,.30);oM.renderOrder=5;
  dragonLine(sleepMouth,[[-k*.4,mouthY,mz],[k*.4,mouthY,mz]],.0058,dark);
  const face={set(expr){
    openEyes.visible=!['blink','sleepy','joy'].includes(expr);
    closedEyes.visible=!openEyes.visible;
    smile.visible=!['wow','joy','sleepy','focus'].includes(expr);
    openMouth.visible=['wow','joy'].includes(expr);
    sleepMouth.visible=['sleepy','focus'].includes(expr);
  }};
  A.kawaiiFace=face;face.set('base');
}
function dragonFaceArt(cfg,expr){
  const key='new-dragon:'+cfg.id+'|'+expr;
  if(FACE_CACHE[key])return FACE_CACHE[key];
  const c=document.createElement('canvas'); c.width=c.height=256;
  const g=c.getContext('2d');g.lineCap='round';g.lineJoin='round';
  const west=cfg.dragonStyle==='west', ey=108, ex=west?42:36;
  g.strokeStyle='#403038';g.fillStyle='#403038';g.lineWidth=6;
  const cheeks=(x)=>{g.save();g.globalAlpha=.72;g.fillStyle=west?'#f4a6a9':'#ffb4b7';g.beginPath();g.ellipse(x,148,15,8,0,0,Math.PI*2);g.fill();g.restore();};
  cheeks(128-70);cheeks(128+70);
  const dragonEye=(x,openMul)=>{const sx=openMul||1;g.fillStyle='#fff';g.beginPath();g.ellipse(x,ey,11*sx,13*sx,0,0,Math.PI*2);g.fill();g.fillStyle='#2b2328';g.beginPath();g.ellipse(x,ey+1,6.2*sx,8.4*sx,0,0,Math.PI*2);g.fill();g.fillStyle='#fff';g.beginPath();g.arc(x+2.8*sx,ey-4.2*sx,2.8*sx,0,Math.PI*2);g.fill();g.beginPath();g.arc(x-1.8*sx,ey-1.0*sx,1.2*sx,0,Math.PI*2);g.fill();g.fillStyle='#403038';};
  [-1,1].forEach(s=>{const x=128+s*ex;
    if(['smile','joy','blink'].includes(expr)){
      g.beginPath();g.moveTo(x-11,ey+2);g.quadraticCurveTo(x,ey-11,x+11,ey+2);g.stroke();
      if(expr==='joy'){g.beginPath();g.moveTo(x-7,ey+11);g.lineTo(x+7,ey+11);g.stroke();}
    }else if(expr==='sleepy'){
      g.beginPath();g.moveTo(x-9,ey+2);g.quadraticCurveTo(x,ey+7,x+9,ey+2);g.stroke();
    }else{
      dragonEye(x,expr==='wow'?1.12:1);
      if(expr==='focus'){g.beginPath();g.moveTo(x-11,ey-14);g.lineTo(x+7,ey-18);g.stroke();}
    }
  });
  // 실제 3D 주둥이에 입을 따로 그리므로 얼굴 텍스처에는 눈과 볼만 그림.
  const texture=new THREE.CanvasTexture(c);texture.anisotropy=4;FACE_CACHE[key]=texture;return texture;
}
function makeDragonAvatar(A,cfg,look){
  const west=cfg.dragonStyle==='west',B=A.bob;
  const main=lookPick(look,'av',cfg.c),light=lookPick(look,'av2',cfg.b);
  const M=fur(main),P=fur(light),ink=std(0x554451),blush=std(0xf3aaa8),white=std(0xfffaf1);
  const horn=std(west?0x777781:new THREE.Color(light).lerp(new THREE.Color(0xffffff),.3).getHex()),hornLight=std(west?0xaaaaaf:new THREE.Color(light).lerp(new THREE.Color(0xffffff),.65).getHex());
  const claw=std(0xfff4e6);
  // 용 전용 얼굴을 투명한 앞면으로 구현. 날카로운 삼각형 부리를 사용하지 않음.
  if(west){
    // 네 발 달린 새끼 서양용. 낮고 동글납작한 몸통.
    const torso=dragonSphere(B,.39,M,0,.57,.16,1.05,.85,1.38);
    dragonSphere(B,.26,P,0,.57,-.23,.98,1.02,.42);
    // 짧고 둥근 다리 네 개; 앞발과 뒷발 구분.
    [-1,1].forEach((s,i)=>[-1,1].forEach((fb,j)=>{
      const leg=new THREE.Group();leg.position.set(s*.28,.38,fb>0?.49:-.35);B.add(leg);
      dragonSphere(leg,.15,M,0,-.08,0,1.02,1.28,.95);
      dragonSphere(leg,.145,M,0,-.24,-.09,1.12,.52,1.24);
      [-1,0,1].forEach(k=>dragonSphere(leg,.03,claw,k*.075,-.25,-.23,.85,.7,1.3));
      A.legs.push({g:leg,ph:(i+j)%2?PI:0});
    }));
    // 날개는 평평한 단순 도형이 아닌 3개의 둥근 물결을 갖는 큰 박쥐 날개.
    [-1,1].forEach(s=>{
      const wg=new THREE.Group();wg.position.set(0,0,.43);B.add(wg);
      const sh=new THREE.Shape();
      sh.moveTo(s*.24,.83);
      sh.bezierCurveTo(s*.45,1.2,s*.56,1.87,s*.91,1.94);
      sh.bezierCurveTo(s*1.03,1.83,s*1.1,1.62,s*1.23,1.54);
      sh.bezierCurveTo(s*1.01,1.51,s*.94,1.41,s*.98,1.19);
      sh.bezierCurveTo(s*.83,1.23,s*.73,1.16,s*.72,1.01);
      sh.bezierCurveTo(s*.57,1.06,s*.42,.9,s*.24,.83);
      const wing=new THREE.Mesh(new THREE.ShapeGeometry(sh,20),new THREE.MeshToonMaterial({color:light,side:THREE.DoubleSide,gradientMap:GRAD}));
      wing.position.z=.01;wg.add(wing);
      const rim=std(main);
      dragonLine(wg,[[s*.24,.83,.04],[s*.44,1.33,.04],[s*.69,1.83,.04],[s*.91,1.94,.04]],.045,rim);
      dragonLine(wg,[[s*.24,.83,.05],[s*.49,1.24,.05],[s*.72,1.01,.05]],.024,rim);
      dragonLine(wg,[[s*.5,1.28,.06],[s*.83,1.55,.06],[s*1.23,1.54,.06]],.021,rim);
      A.arms.push({g:wg,ph:0,s,wing:true,noFlap:true,baseRot:s<0?0.35:-0.35});
    });
    // 부드러운 목과 큼직한 둥근 머리.
    dragonSphere(B,.23,M,0,.83,-.33,1,.92,1.2);
    const head=new THREE.Group();head.position.set(0,1.12,-.46);B.add(head);A.head=head;
    dragonSphere(head,.34,M,0,0,0,1.16,1.04,1.05);
    A.face=faceDecal(head,.34,cfg,1.16,1.04,1.05);A.face.visible=false;
    // 용 얼굴은 하나의 둥근 머리로만. 소처럼 돌출된 코와 볼, 콧구멍을 만들지 않음.
    [-1,1].forEach(s=>{
      // 삐죽하지 않은 회색 뿔 2쌍
      const horn0=new THREE.Mesh(new THREE.ConeGeometry(.11,.32,12),horn);horn0.position.set(s*.21,.31,.06);horn0.rotation.z=-s*.35;horn0.rotation.x=-.12;head.add(horn0);
      const horn1=new THREE.Mesh(new THREE.ConeGeometry(.06,.18,10),hornLight);horn1.position.set(s*.3,.21,.13);horn1.rotation.z=-s*.65;head.add(horn1);
    });
    addKawaiiFace(A,head,{r:.34,sx:1.16,sy:1.04,sz:1.05,ex:.135,ey:.045,eyeSize:.029,mouthY:-.175,pink:0xffb4ac});
    // 둥근 등 가시와 짧은 유연한 꼬리.
    for(let k=0;k<3;k++){
      const sp=new THREE.Mesh(new THREE.ConeGeometry(.072-k*.006,.14,9),horn);
      sp.position.set(0,.9-k*.08,.21+k*.22);sp.rotation.x=.4;B.add(sp);
    }
    const tailG=new THREE.Group();tailG.position.set(0,.54,.61);B.add(tailG);
    dragonLine(tailG,[[0,0,0],[.25,.03,.25],[.42,.12,.38],[.54,.26,.39]],.105,M);
    dragonSphere(tailG,.12,M,.53,.27,.39,1.18,.82,.68);
    A.tails.push(tailG);
    avatarBook(A,.66,-.83);A.h=1.96;A.waddle=.045;
    A.headR=.34;A.headS=[1.16,1.04,1.05];
  }else{
    // 동양용: 다리가 아닌 구불구불 말린 뱀처럼 긴 몸, 곧게 올라간 목, 구슬 두 개.
    const bend=[[-.91,.85,.22],[-1.09,.58,.31],[-1.04,.31,.35],[-.69,.22,.45],[-.18,.26,.56],[.37,.33,.55],[.49,.39,.2],[.21,.43,-.1],[-.11,.51,-.22],[-.12,.91,-.27],[-.08,1.29,-.3]];
    const c=dragonLine(B,bend,.185,M);
    // 몸 아랫부분의 부드러운 밝은색 복부 띠.
    const bellyPoints=[[-.89,.85,.06],[-1.09,.57,.14],[-1.04,.3,.18],[-.69,.23,.27],[-.19,.27,.39],[.36,.34,.4],[.49,.39,.03],[.2,.43,-.28],[-.1,.51,-.39],[-.12,.93,-.44],[-.08,1.27,-.46]];
    dragonLine(B,bellyPoints,.082,P);
    dragonSphere(B,.27,M,-.08,1.12,-.30,.84,1.5,.9);
    dragonSphere(B,.16,P,-.08,1.06,-.445,.66,1.75,.5);
    const head=new THREE.Group();head.position.set(-.08,1.53,-.30);B.add(head);A.head=head;
    dragonSphere(head,.275,M,0,0,0,1.02,1.0,.94);
    A.face=faceDecal(head,.275,cfg,1.02,1.0,.94);A.face.visible=false;
    // 주둥이를 벌크업하지 않고 머리 자체에 귀여운 표정만 얹음.
    [-1,1].forEach(s=>{
      // 짧고 가지 친 부드러운 뿔; 귀의 소용돌이.
      dragonLine(head,[[s*.17,.22,.04],[s*.22,.34,.06],[s*.29,.41,.07]],.021,horn);
      dragonLine(head,[[s*.22,.32,.06],[s*.14,.38,.08]],.015,hornLight);
      const spiral=new THREE.Group();spiral.position.set(s*.24,.06,.09);head.add(spiral);
      dragonLine(spiral,[[0,0,0],[s*.08,.05,-.005],[s*.11,.12,0],[s*.035,.13,.005],[s*.04,.07,.01]],.025,hornLight);
      // 꼬리털이 아니라 가늘고 둥글게 뻗는 용 수염.
      dragonLine(head,[[s*.13,-.16,-.27],[s*.28,-.22,-.27],[s*.4,-.19,-.24]],.012,hornLight);
    });
    addKawaiiFace(A,head,{r:.275,sx:1.02,sy:1,sz:.94,ex:.103,ey:.037,eyeSize:.025,mouthY:-.142,pink:0xffb6ab});
    // 작은 손 2개 (입체적인 앞발)
    [-1,1].forEach((s,i)=>{
      const arm=new THREE.Group();arm.position.set(s*.225,.79,-.26);B.add(arm);
      dragonSphere(arm,.09,M,s*.07,-.06,-.08,.93,1.25,.9);
      dragonSphere(arm,.075,M,s*.1,-.18,-.14,1.15,.62,1.15);
      A.arms.push({g:arm,ph:i?0:PI,s});
    });
    // 꼬리를 장식하는 동그란 푸른 구슬 두 개.
    const pearl=std(0x35a8de),pearlHi=std(0x9de9fa);
    [[-.92,.86,.21],[-.96,.67,.16]].forEach(([x,y,z],i)=>{
      dragonSphere(B,i===0?.095:.075,pearl,x,y,z,1,1,1);
      dragonSphere(B,.027,pearlHi,x-.025,y+.027,z-.075,1,1,1);
    });
    // 머리 뒤에 작은 갈기 장식
    for(let i=0;i<4;i++){
      const p=new THREE.Mesh(new THREE.ConeGeometry(.06-i*.004,.13,7),horn);
      p.position.set(-.08,1.21-i*.13,-.1+i*.01);p.rotation.x=.75;B.add(p);
    }
    avatarBook(A,.65,-.69);A.h=2.15;A.waddle=.03;
    A.headR=.275;A.headS=[1.02,1,.94];
  }
  // 기존 전체 캐릭터 공용 표정 기능에 연결.
  A.setFace=function(expr){if(!A.face||A.expr===expr)return;A.expr=expr;if(A.kawaiiFace)A.kawaiiFace.set(expr);else A.face.material.map=faceTex(cfg,expr);};
  return A;
}


/* 확장 가능한 공룡 종별 3D 모델. 첫 선택지는 목이 긴 브라키오사우루스. */
function makeDinoAvatar(A,cfg,look){
 const B=A.bob,kind=cfg.species||'brachio';
 const main=lookPick(look,'av',cfg.c), light=lookPick(look,'av2',cfg.b), accent=lookPick(look,'av2',kind==='stego'?0xbb7b44:kind==='trike'?0x549b82:kind==='anky'?0x88a86a:cfg.b);
 const M=fur(main),P=fur(light),spine=fur(accent);
 const bone=std(0xfff0c6),dark=std(0x4e6256);
 const round=(parent,r,mat,x,y,z,sx=1,sy=1,sz=1)=>sph(parent,r,mat,x,y,z,sx,sy,sz);
 // 앞뒤 구분이 있는 통통한 몸통과 네 발. 공룡마다 비율이 서로 다름.
 const brachio=kind==='brachio',rex=kind==='rex',trike=kind==='trike',stego=kind==='stego',anky=kind==='anky';
 const body=round(B,.36,M,0,.62,.12,brachio?1.08:1.21,brachio?.84:1.05,brachio?1.42:1.34);
 round(B,.27,P,0,.57,-.17,1,.86,.6);
 for(const s of [-1,1])for(const fb of [-1,1]){
   if(rex&&fb>0)continue;
   const leg=new THREE.Group(); leg.position.set(s*(brachio?.26:.29),.36,fb>0?.46:-.32);B.add(leg);
   round(leg,.125,M,0,-.10,0,1,1.45,.96);round(leg,.13,M,0,-.24,-.07,1.13,.54,1.22);
   [-1,0,1].forEach(i=>round(leg,.027,bone,i*.075,-.25,-.19,1,.65,1.5));
   A.legs.push({g:leg,ph:(s===fb?0:Math.PI)});
 }
 if(rex){ // 뒷다리가 크고 앞발이 조그만 티라노사우루스
   for(const s of [-1,1]){const arm=new THREE.Group();arm.position.set(s*.29,.83,-.34);B.add(arm);
    round(arm,.09,M,s*.05,-.09,-.07,.72,1.3,.85);round(arm,.065,M,s*.08,-.2,-.12); A.arms.push({g:arm,ph:0,s});}
 }
 // 뾰족한 입 대신 매끄러운 둥근 주둥이 + 한쪽으로 흐르는 미소
 if(brachio){
   const neck=new THREE.Group();neck.position.set(0,.84,-.05);B.add(neck);
   dragonLine(neck,[[0,0,0],[0,.16,-.06],[0,.46,-.2],[0,.84,-.42]],.148,M);
   dragonLine(neck,[[0,-.01,-.06],[0,.15,-.12],[0,.45,-.28],[0,.78,-.53]],.078,P);
   round(neck,.12,M,0,.62,-.31,.92,1.12,.86);
 }
 const head=new THREE.Group();head.position.set(0,brachio?1.97:(rex?1.17:1.1),brachio?-.58:-.45);B.add(head);A.head=head;
 const r=brachio?.26:(trike?.32:.29);
 round(head,r,M,0,0,0,1.09,brachio?1:1.02,1.02);
 A.face=faceDecal(head,r,cfg,1.09,brachio?1:1.02,1.02);A.face.visible=false;
 round(head,r*.4,P,0,-r*.23,-r*.88,1.45,.58,.75);
 if(trike){ // 부채형 프릴 + 세 개의 작은 아이보리 뿔
   round(head,.33,spine,0,.16,.15,1.35,1.12,.46);
   round(head,r,M,0,0,-.05,1.09,1.02,1.02); // 앞얼굴을 프릴보다 앞으로
   A.face=faceDecal(head,r,cfg,1.09,1.02,1.02,-.015);A.face.visible=false;
   for(const s of [-1,1]){const h=new THREE.Mesh(new THREE.ConeGeometry(.055,.2,8),bone);
     h.position.set(s*.19,.28,-.18);h.rotation.z=-s*.16;head.add(h);}
   const n=new THREE.Mesh(new THREE.ConeGeometry(.045,.16,8),bone);n.rotation.x=-.85;n.position.set(0,-.08,-.30);head.add(n);
 }
 if(stego){ // 등에 납작한 잎 모양 판
   for(let i=0;i<5;i++){
     const plate=new THREE.Mesh(new THREE.ConeGeometry(.12+.02*Math.sin(i),.28,4),spine);
     plate.scale.z=.44; plate.position.set(i%2?.05:-.05,.99+Math.sin(i/4*Math.PI)*.07,-.19+i*.24);
     plate.rotation.x=-.22;B.add(plate);
   }
 }
 if(anky){ // 낮은 등에 둥근 갑옷과 커다란 꼬리 몽둥이
   for(let i=0;i<12;i++){const x=(-1+i%3)*.23,z=-.15+Math.floor(i/3)*.24;
     round(B,.075,spine,x,.95+(i%3===1?.04:0),z,1,.44,1.1);}
 }
 // 꼬리는 종별로 다른 길이와 끝 모양을 갖는다. 몸통에서 뒤쪽(+)으로 뻗음.
 const tail=new THREE.Group();tail.position.set(0,.67,.56);B.add(tail);A.tails.push(tail);
 const bend=brachio?[[0,0,0],[.04,.06,.23],[.13,.15,.47],[.20,.28,.64]]:
                [[0,0,0],[.05,.04,.23],[.13,.14,.48],[.22,.23,.66]];
 dragonLine(tail,bend,brachio?.105:.13,M);
 if(anky)round(tail,.17,spine,.23,.23,.7,1.4,.9,.95);
 if(stego){ for(let i=0;i<3;i++){const tip=new THREE.Mesh(new THREE.ConeGeometry(.035,.2,7),bone);tip.rotation.z=.5;tip.position.set(.17+i*.05,.2,.54+i*.06);tail.add(tip);}}
 // 각 공룡의 얼굴은 정면에 따로 돌출된 검은 점눈으로 제작해 프릴에 가리지 않음.
 addKawaiiFace(A,head,{r,sx:1.09,sy:brachio?1:1.02,sz:1.02,shift:trike?.05:0,
   ex:r*(trike?.36:.35),ey:r*(trike?.18:.13),eyeSize:r*.089,
   mouthY:-r*.46,mouthZ:-(r*.88+r*.4*.75+.02),pink:0xf6b3a6});
 // 간단한 전통 책가방, 걷기/앉기/표정/프로필 썸네일과 공통 작동.
 A.h=brachio?2.48:1.75;A.waddle=.045;A.hop=false;A.headR=r;A.headS=[1.09,1.02,1.02];
 avatarBook(A,brachio?1.18:.7,-.68);
 // 옷장 색상이나 의상 기하가 공룡의 다리/목을 가리지 않도록 전용 모델 유지.
 A.fit=null;A.gat=null;
}


/* ====================== SD REFACTOR · PHASE 1 ======================
 * Stable external API: makeAvatar, animateAvatar, faceTick and the AVATARS IDs.
 * Coordinate convention: front = -Z; pivots in A.bob; shoulders/hips overlap torso.
 * A.head / A.arms / A.legs / A.tails / A.fit / A.garb remain wardrobe & emotes compatible.
 * This is an original, warm storybook-clay character system, not an asset copy.
 */
const SD_FACE_CACHE=Object.create(null),SD_SHIRT_CACHE=Object.create(null);
function sdMat(hex,extra){
  const c=new THREE.Color(hex==null?0xf5e8d8:hex);
  return new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.86,metalness:0},extra||{}));
}
function sdSoftColor(hex,amt=.10){const c=new THREE.Color(hex);c.lerp(new THREE.Color(0xe8ddcb),amt);return c.getHex();}
function sdBall(p,r,material,x=0,y=0,z=0,sx=1,sy=1,sz=1){
  const m=new THREE.Mesh(new THREE.SphereGeometry(r,32,24),material);
  m.position.set(x,y,z);m.scale.set(sx,sy,sz);p.add(m);return m;
}
function sdTube(p,pts,r,mat){
  const curve=new THREE.CatmullRomCurve3(pts.map(a=>new THREE.Vector3(...a)));
  const m=new THREE.Mesh(new THREE.TubeGeometry(curve,Math.max(18,pts.length*10),r,9,false),mat);
  p.add(m);return m;
}
function sdCone(p,r,h,mat,x,y,z,rz=0,rx=0){
  const m=new THREE.Mesh(new THREE.ConeGeometry(r,h,12),mat);
  m.position.set(x,y,z);m.rotation.set(rx,0,rz);p.add(m);return m;
}
function sdShirtTexture(cfg){
  const key=(cfg.type||'human')+':'+(cfg.sp||cfg.species||cfg.id);
  if(SD_SHIRT_CACHE[key])return SD_SHIRT_CACHE[key];
  const c=document.createElement('canvas');c.width=256;c.height=256;
  const g=c.getContext('2d');
  const a=cfg.type==='dino'?'#f4e9d3':cfg.type==='bird'?'#f3ecdb':cfg.sp==='dragon'?'#f6eadc':'#eee7d9';
  const b=cfg.type==='dino'?'#a7c4ac':cfg.type==='bird'?'#c6bb9d':cfg.sp==='dragon'?'#deb3ad':'#b2bcb2';
  g.fillStyle=a;g.fillRect(0,0,256,256);
  g.fillStyle=b;for(let y=10;y<256;y+=40){g.globalAlpha=.55;g.fillRect(0,y,256,12);}
  g.globalAlpha=1;g.strokeStyle='rgba(92,78,70,.07)';g.lineWidth=1;
  for(let x=0;x<256;x+=13){g.beginPath();g.moveTo(x,0);g.lineTo(x,256);g.stroke();}
  const tex=new THREE.CanvasTexture(c);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
  tex.repeat.set(1,1);tex.needsUpdate=true;
  SD_SHIRT_CACHE[key]=tex;return tex;
}
function sdPear(p,mat,location,scale){
  const points=[
    [0,0],[.11,.015],[.245,.075],[.31,.18],[.342,.32],[.35,.43],
    [.321,.60],[.27,.73],[.20,.82],[.12,.86],[0,.88]
  ].map(q=>new THREE.Vector2(q[0],q[1]));
  const mesh=new THREE.Mesh(new THREE.LatheGeometry(points,32),mat);
  mesh.position.set(...location);mesh.scale.set(...scale);p.add(mesh);return mesh;
}
function sdProfile(cfg){
  const bird=cfg.type==='bird', dino=cfg.type==='dino';
  return {headR:bird?.46:(cfg.species==='trike'?.48:.445),
    bodyWidth:cfg.species==='anky'?1.16:(cfg.duck?1.14:1),
    bodyHeight:cfg.crane?1.10:(cfg.species==='rex'?1.04:1),
    headLift:(cfg.species==='brachio'?.29:(cfg.crane?.15:(cfg.dragonStyle==='east'?.13:0))),
    headZ:cfg.species==='brachio'?-.15:0,
    isWing:bird};
}
function buildSDBase(A,cfg,look){
  const B=A.bob,profile=sdProfile(cfg);
  const skinBase=cfg.type==='human'?0xf4dcca:(cfg.bc!=null?cfg.bc:(cfg.dark?0x647e79:(cfg.c!=null?cfg.c:(cfg.type==='frog'?0x8abf81:(cfg.type==='bird'?0xf6f1e9:0xa5cb9a)))));
  const chosen=(cfg.dragonColor||cfg.type==='dino')?lookPick(look,'av',skinBase):skinBase;
  const skin=sdMat(sdSoftColor(chosen,.09));
  const body=new THREE.Group();body.name='body';B.add(body);
  const core=sdPear(body,skin,[0,.39,.015],[profile.bodyWidth,profile.bodyHeight,1]);
  // Default striped knit is its own mesh so applyLook() can hide it for custom outfits.
  const shirt=sdPear(body,sdMat(0xffffff,{map:sdShirtTexture(cfg),side:THREE.DoubleSide}),[0,.405,-.007],
    [profile.bodyWidth*1.025,profile.bodyHeight*.79,1.035]);
  shirt.name='defaultShirt';A.garb.push(shirt);
  const arms=[],legs=[];
  for(const s of [-1,1]){
    const arm=new THREE.Group();arm.name=s<0?'leftArm':'rightArm';arm.position.set(s*.32,.98,-.015);B.add(arm);
    sdBall(arm,.135,skin,s*.012,-.13,-.005,.92,1.38,.98);
    sdBall(arm,.105,skin,s*.03,-.28,-.01,1.05,.65,1.03);
    const sleeve=sdBall(arm,.129,sdMat(0xf1ebd9),0,-.105,0,1.02,.92,1.02);sleeve.name='sleeve';A.sleeves.push(sleeve);
    A.arms.push({g:arm,s,ph:s>0?0:PI,wing:false});arms.push(arm);
    const leg=new THREE.Group();leg.name=s<0?'leftLeg':'rightLeg';leg.position.set(s*.18,.40,0);B.add(leg);
    sdBall(leg,.145,skin,0,-.13,-.01,.96,1.28,1.06);
    sdBall(leg,.15,skin,0,-.30,-.095,1.13,.58,1.32);
    A.legs.push({g:leg,s,ph:s>0?PI:0});legs.push(leg);
  }
  const head=new THREE.Group();head.name='head';head.position.set(0,1.53+profile.headLift,-.055+profile.headZ);B.add(head);A.head=head;
  const r=profile.headR;
  const hm=sdBall(head,r,skin,0,0,0,1.035,.98,.995);hm.name='headSkin';
  A.headR=r;A.headS=[1.035,.98,.995];
  const tail=new THREE.Group();tail.name='tail';tail.position.set(0,.63,.30);B.add(tail);A.tail=tail;
  A.parts={body,head,leftArm:arms[0],rightArm:arms[1],leftLeg:legs[0],rightLeg:legs[1],tail};
  // Legacy clothing fit anchors remain present and aligned with this single SD silhouette.
  A.fit={y0:.43,y1:1.17,r0:.36*profile.bodyWidth,r1:.22,neck:1.23,
    legTop:.40,legLen:.26,legR:.13,sleeve:[.13,1.22,-.13],human:cfg.type==='human'};
  A.h=2.12+profile.headLift;A.waddle=.045;A.headRadius=r;
  A.sd={skin,skinColor:chosen,base:core,shirt,profile};
  return A;
}
/* CanvasTexture-only eyes/nose/mouth: no 3D face spheres or nostril dots. */
function createSDFaceTexture(cfg,expr){
  const key=(cfg.id||cfg.sp||cfg.type)+':'+expr;
  if(SD_FACE_CACHE[key])return SD_FACE_CACHE[key];
  const c=document.createElement('canvas');c.width=c.height=512;
  const g=c.getContext('2d');g.clearRect(0,0,512,512);g.lineCap='round';g.lineJoin='round';
  const bird=cfg.type==='bird',dog=cfg.sp==='dog',cat=cfg.sp==='cat',dragon=!!cfg.dragonStyle,
    dino=cfg.type==='dino',human=cfg.type==='human';
  const dark='#30272b',ex=dino?88:(bird?83:(human?91:87)),ey=218;
  const smile=expr==='smile'||expr==='joy',closed=expr==='blink'||expr==='sleepy'||expr==='joy';
  function eye(x){
    g.fillStyle=dark;
    if(closed){g.strokeStyle=dark;g.lineWidth=11;g.beginPath();g.moveTo(x-21,ey+2);g.quadraticCurveTo(x,ey-20,x+21,ey+2);g.stroke();}
    else{const w=human?13:15,h=human?18:21,sc=expr==='wow'?1.2:1;
      g.beginPath();g.ellipse(x,ey,w*sc,h*sc,0,0,PI*2);g.fill();
      g.fillStyle='#fffaf5';g.beginPath();g.arc(x+4,ey-6,5,0,PI*2);g.fill();
      g.fillStyle=dark;}
  }
  // Layered watercolor blush, with no circular protruding cheek meshes.
  for(const s of [-1,1]){
    const bx=256+s*148,by=278;
    const grd=g.createRadialGradient(bx,by,5,bx,by,49);
    grd.addColorStop(0,'rgba(244,155,151,.48)');grd.addColorStop(1,'rgba(244,155,151,0)');
    g.fillStyle=grd;g.beginPath();g.ellipse(bx,by,53,34,0,0,PI*2);g.fill();
    eye(256+s*ex);
  }
  const mx=256,my=304;
  g.strokeStyle=dark;g.fillStyle=dark;g.lineWidth=9;
  // Species-specific small noses are single illustrated marks, never twin nostrils.
  if(cat||dog){g.fillStyle=cat?'#d58d91':'#514448';g.beginPath();g.moveTo(mx-10,my-10);g.quadraticCurveTo(mx,my-18,mx+10,my-10);g.quadraticCurveTo(mx,my+1,mx-10,my-10);g.fill();}
  if(bird){const beak=cfg.duck?'#df8c56':cfg.mandarin?'#d85d4c':cfg.phoenix?'#e8a351':cfg.crane?'#6c6865':'#b7976d';
    g.fillStyle=beak;g.beginPath();g.moveTo(mx-14,my-10);g.quadraticCurveTo(mx,my-15,mx+14,my-10);g.quadraticCurveTo(mx,my+8,mx-14,my-10);g.fill();}
  else if(expr==='wow'){g.beginPath();g.ellipse(mx,my+12,10,13,0,0,PI*2);g.fill();}
  else if(expr==='sleepy'||expr==='focus'){
    g.beginPath();g.moveTo(mx-14,my+8);g.quadraticCurveTo(mx,my+12,mx+14,my+8);g.stroke();
  }
  else if(smile){g.beginPath();g.moveTo(mx-25,my);g.quadraticCurveTo(mx,my+32,mx+25,my);g.stroke();
    if(expr==='joy'){g.fillStyle='#ce8790';g.beginPath();g.ellipse(mx,my+23,11,7,0,0,PI*2);g.fill();}}
  else{g.beginPath();g.moveTo(mx-23,my+2);g.quadraticCurveTo(mx-11,my+21,mx,my+8);g.quadraticCurveTo(mx+11,my+21,mx+23,my+2);g.stroke();}
  if(dino&&cfg.species==='rex'&&['base','smile','joy'].includes(expr)){
    // Two tiny illustrated teeth, never separate plastic facial meshes.
    g.fillStyle='#fff9ef';for(const dx of [-15,15]){
      g.beginPath();g.moveTo(mx+dx-6,my+9);g.lineTo(mx+dx+6,my+9);
      g.lineTo(mx+dx,my+18);g.closePath();g.fill();
    }
  }
  if(cfg.mask==='tiger'){g.strokeStyle='#746865';g.lineWidth=8;for(let i=-1;i<=1;i++){g.beginPath();g.moveTo(256+i*23,135);g.lineTo(256+i*18,157);g.stroke();}}
  if(cfg.stripe){g.strokeStyle='#d69a62';g.lineWidth=8;for(let i=-1;i<=1;i++){g.beginPath();g.moveTo(256+i*27,134);g.lineTo(256+i*21,155);g.stroke();}}
  const tex=new THREE.CanvasTexture(c);tex.needsUpdate=true;
  if(THREE.sRGBEncoding)tex.encoding=THREE.sRGBEncoding;
  SD_FACE_CACHE[key]=tex;return tex;
}
function sdFaceGeometry(rx,ry,rz){
  // Curved UV patch follows the front ellipsoid (negative Z), preventing floating faces.
  const vertices=[],uvs=[],indices=[],nx=28,ny=22;
  for(let y=0;y<=ny;y++)for(let x=0;x<=nx;x++){
    const u=x/nx,v=y/ny,X=(u-.5)*rx*1.70,Y=(v-.5)*ry*1.45;
    const q=1-(X/rx)**2-(Y/ry)**2,Z=-rz*Math.sqrt(Math.max(.03,q))-.024;
    vertices.push(X,Y,Z);uvs.push(u,v);
  }
  for(let y=0;y<ny;y++)for(let x=0;x<nx;x++){
    const a=y*(nx+1)+x,b=a+1,c=a+(nx+1),d=c+1;
    indices.push(a,b,c,b,d,c);
  }
  const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));
  geom.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geom.setIndex(indices);geom.computeVertexNormals();
  return geom;
}
function attachSDFace(A,cfg){
  const [sx,sy,sz]=A.headS,r=A.headR;
  const geo=sdFaceGeometry(r*sx,r*sy,r*sz);
  const mat=new THREE.MeshBasicMaterial({map:createSDFaceTexture(cfg,'base'),transparent:true,
    depthWrite:false,side:THREE.DoubleSide,alphaTest:.02,opacity:1});
  const face=new THREE.Mesh(geo,mat);face.name='face';face.renderOrder=7;A.head.add(face);A.face=face;
  const next=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({map:mat.map,transparent:true,
    depthWrite:false,side:THREE.DoubleSide,opacity:0}));
  next.name='faceTransition';next.renderOrder=8;A.head.add(next);A.faceNext=next;
  A.faceBlend=1;A.faceAt=performance.now();
  A.setFace=function(expr){
    if(!A.face||A.expr===expr)return;
    A.expr=expr;A.faceAt=performance.now();A.faceBlend=0;
    A.faceNext.material.map=createSDFaceTexture(cfg,expr);
    A.faceNext.material.needsUpdate=true;A.faceNext.material.opacity=.60; // immediate readable state for thumbnails
  };
}

/* ====================== SD REFACTOR · PHASE 2 ======================
 * Every existing AVATARS entry routes through this builder; only non-face
 * characteristics are modeled as 3D meshes. Eyes/mouth remain CanvasTexture.
 */
function sdPartColors(cfg,look){
  const main=(cfg.dragonColor||cfg.type==='dino')?lookPick(look,'av',cfg.c):cfg.c;
  const secondary=(cfg.dragonColor||cfg.type==='dino')?lookPick(look,'av2',cfg.b):cfg.b;
  return {main:sdMat(sdSoftColor(main==null?0xb6c3a4:main,.1)),
    secondary:sdMat(sdSoftColor(secondary==null?0xf7ead0:secondary,.04)),
    ivory:sdMat(0xf6e7c9),dark:sdMat(0x7e706c)};
}
function sdTail(A,points,r,mat){const tail=A.tail;sdTube(tail,points,r,mat);A.tails.push(tail);return tail;}
function sdEar(p,x,y,z,r,h,mat,rz=0){
  const ear=new THREE.Mesh(new THREE.ConeGeometry(r,h,12),mat);
  ear.position.set(x,y,z);ear.rotation.z=rz;p.add(ear);return ear;
}
function sdBuildHuman(A,cfg,col){
  const hair=sdMat(cfg.fem?0x49352e:0x70503a);
  const cap=new THREE.Mesh(new THREE.SphereGeometry(A.headR*1.045,32,20,0,PI*2,0,PI*.54),hair);
  cap.position.y=.035;cap.scale.set(1.04,1,.99);A.head.add(cap);
  for(let i=0;i<5;i++)sdBall(A.head,.092,hair,(i-2)*.15,.27-(i%2)*.025,-.27,1.08,.58,.82);
  if(cfg.fem){for(const s of [-1,1]){
    sdBall(A.head,.16,hair,s*.38,-.13,.11,.55,1.6,.8);
  }}
  A.h=2.17;
}
function sdBuildCat(A,cfg,col){
  for(const s of [-1,1]){
    sdEar(A.head,s*.3,.39,.025,.165,.31,col.main,-s*.22);
    sdEar(A.head,s*.3,.41,-.095,.105,.20,sdMat(0xe6aca9),-s*.22);
  }
  sdTail(A,[[0,0,0],[.21,.08,.13],[.31,.24,.14],[.24,.40,.1]],.095,col.main);
  if(cfg.mask==='tuxedo')sdBall(A.head,.20,col.secondary,0,-.29,-.17,1.2,.47,.92);
}
function sdBuildDog(A,cfg,col){
  const upright=cfg.ear==='dog'||cfg.ear==='big';
  for(const s of [-1,1]){
    if(upright)sdEar(A.head,s*.31,.39,.05,cfg.ear==='big'?.155:.13,cfg.ear==='big'?.38:.30,col.main,-s*.25);
    else {const flap=sdBall(A.head,.165,col.main,s*.40,.05,.01,.64,1.40,.82);flap.rotation.z=s*.38;}
  }
  if(cfg.fluffy||cfg.shaggy){for(let i=0;i<5;i++)sdBall(A.head,.115,col.main,(i-2)*.14,.36+(i%2)*.025,-.11,1,.65,.8);}
  if(cfg.tail==='curl')sdTail(A,[[0,0,0],[.18,.1,.13],[.23,.28,.12],[.12,.36,.03]],.10,col.main);
  else sdTail(A,[[0,0,0],[.08,.08,.14],[.1,.23,.21]],.11,col.main);
}
function sdBuildFrog(A,cfg,col){
  for(const s of [-1,1])sdBall(A.head,.155,col.main,s*.29,.36,.02,.95,1.12,.94); // eye cushions, no 3D pupils
  A.hop=true;A.waddle=.075;
}
function sdBuildTurtle(A,cfg,col){
  const shell=sdMat(cfg.dark?0x5a7771:0x83ac82);
  const dome=new THREE.Mesh(new THREE.SphereGeometry(.44,32,20,0,PI*2,0,PI*.55),shell);
  dome.rotation.x=-PI/2;dome.position.set(0,.75,.37);dome.scale.set(1.01,.7,1);A.bob.add(dome);
  if(cfg.dark){sdBall(A.head,.12,col.ivory,0,.43,.17);}
  sdTail(A,[[0,0,0],[.05,.04,.10],[.1,.06,.24]],.08,col.main);
}
function sdBuildDinosaur(A,cfg,col){
  const species=cfg.species||'brachio';
  if(species==='brachio'){
    // A continuous, attached neck runs from the pear torso to the raised head.
    sdBall(A.bob,.20,col.main,0,1.29,-.14,.95,1.8,.89);
    sdTube(A.bob,[[0,1.06,-.09],[0,1.33,-.13],[0,1.62,-.2],[0,1.78,-.21]],.155,col.main);
    sdBall(A.bob,.14,col.secondary,0,1.44,-.278,.62,2.1,.48);
  }else if(species==='rex'){
    A.head.scale.set(1.11,1.00,1.15);A.headS=[1.13,.98,1.14];
    // The enlarged cranium itself forms a continuous rounded snout silhouette.
    A.sd.shirt.scale.x*=1.05;
    for(const s of [-1,1]){
      const small=A.parts[s<0?'leftArm':'rightArm'];small.scale.set(.72,.73,.76);
      small.position.set(s*.29,.94,-.17);
    }
    for(let k=0;k<3;k++)sdCone(A.bob,.08,.15,col.secondary,0,1.19-k*.15,.28+k*.10,-.40,.55);
  }else if(species==='trike'){
    sdBall(A.head,.43,col.secondary,0,.13,.23,1.35,1.03,.44); // frill BEHIND face
    for(const s of [-1,1])sdCone(A.head,.085,.22,col.ivory,s*.25,.30,-.16,-s*.16);
    sdCone(A.head,.052,.15,col.ivory,0,-.03,-.43,0,-1.0);
  }else if(species==='stego'){
    for(let i=0;i<5;i++){
      const scale=Math.sin((i+1)/6*PI);
      sdCone(A.bob,.09+scale*.04,.14+scale*.13,col.secondary,(i%2?.08:-.08),1.18,-.18+i*.19,0,.15);
    }
  }else if(species==='anky'){
    for(let j=0;j<3;j++)for(let k=-1;k<=1;k++)sdBall(A.bob,.095,col.secondary,k*.23,1.12-j*.09,.02+j*.21,1,.55,.85);
  }
  const tail=sdTail(A,[[0,0,0],[.12,.06,.2],[.25,.13,.45],[.29,.20,.66]],species==='anky'?.14:.11,col.main);
  if(species==='anky')sdBall(tail,.18,col.secondary,.29,.20,.66,1.10,.87,.9);
  if(species==='stego')for(let i=0;i<3;i++)sdCone(tail,.04,.17,col.secondary,.17+i*.06,.20,.5+i*.09,0,.5);
  // Creature parts all attach to the same rig and preserve the selected body colors.
}
function sdBuildBird(A,cfg,col){
  // Birds differ in head/body proportions while sharing the same shoulder joints.
  if(cfg.crane){
    sdBall(A.bob,.165,col.main,0,1.24,-.03,.78,1.35,.84);
    sdBall(A.head,.095,sdMat(0xcc4344),0,.42,-.05,1,.48,1);
    for(const s of [-1,1]){A.parts[s<0?'leftLeg':'rightLeg'].scale.y=1.1;}
  } else if(cfg.duck){A.head.scale.set(1.06,.95,.98);A.parts.body.scale.x*=1.12;}
  else if(cfg.mandarin){
    for(const s of [-1,1]){sdBall(A.bob,.15,sdMat(0xe39755),s*.34,.83,.10,.9,.8,.63);}
  }else if(cfg.peacock){
    const fan=new THREE.Group();fan.position.set(0,.86,.32);fan.name='peacockTail';A.bob.add(fan);
    for(let i=-4;i<=4;i++){
      const f=sdBall(fan,.12,sdMat(i%2?0x4bb196:0x79bc8f),i*.11,.47-Math.abs(i)*.037,.12,
        .89,2.9,.45);f.rotation.z=-i*.14;
      sdBall(fan,.061,sdMat(0x4d83a8),i*.118,.80-Math.abs(i)*.047,.035,1,.72,.47);
    }
    for(let i=-1;i<=1;i++)sdBall(A.head,.04,sdMat(0x3d7eac),i*.07,.48,.02,1,1.7,.95);
  }else if(cfg.phoenix){
    for(let i=-2;i<=2;i++)sdCone(A.head,.065,.24,sdMat(i%2?0xf3af61:0xdc705d),i*.12,.41,.07,i*.15);
    const tail=new THREE.Group();tail.name='phoenixPlumes';tail.position.set(0,.70,.34);A.bob.add(tail);A.tails.push(tail);
    for(let i=-2;i<=2;i++)sdTube(tail,[[i*.08,0,0],[i*.12,.20,.22],[i*.16,.32,.46]],.043,sdMat(i%2?0xedb16e:0xcf6c61));
  }
  if(!cfg.peacock&&!cfg.phoenix)sdTail(A,[[0,0,0],[0,.09,.18],[0,.18,.28]],.087,col.main);
  A.arms.forEach(a=>{a.wing=true;});
}
function sdBuildDragon(A,cfg,col){
  const east=cfg.dragonStyle==='east'||(!cfg.dragonStyle&&cfg.sp==='dragon');
  for(const s of [-1,1]){
    sdCone(A.head,.085,.24,col.ivory,s*.23,.38,.025,-s*.24);
    if(east){sdTube(A.head,[[s*.17,.30,.03],[s*.24,.39,.08],[s*.31,.43,.06]],.025,col.ivory);}
  }
  if(east){
    sdBall(A.bob,.15,col.main,0,1.24,.0,.8,1.20,.78);
    const tail=sdTail(A,[[0,0,0],[.20,.07,.16],[.39,.22,.30],[.22,.34,.46]],.095,col.main);
    sdBall(tail,.075,col.secondary,.22,.34,.46);
  }else{
    const wings=new THREE.Group();wings.name='staticWings';wings.position.set(0,0,.27);A.bob.add(wings);
    for(const s of [-1,1]){
      const shape=new THREE.Shape();shape.moveTo(s*.23,.89);
      shape.bezierCurveTo(s*.38,1.15,s*.56,1.49,s*.79,1.55);
      shape.bezierCurveTo(s*.91,1.36,s*.99,1.30,s*1.09,1.20);
      shape.bezierCurveTo(s*.86,1.15,s*.77,1.08,s*.69,.96);
      shape.bezierCurveTo(s*.52,1.03,s*.40,.95,s*.23,.89);
      const mesh=new THREE.Mesh(new THREE.ShapeGeometry(shape,16),sdMat(sdSoftColor((cfg.b||0xffe3cb),.05),{side:THREE.DoubleSide}));
      mesh.position.z=.08;wings.add(mesh);
    }
    A.staticWings=wings; // deliberately not in A.arms, so emotes cannot flap them.
    sdTail(A,[[0,0,0],[.18,.02,.17],[.32,.10,.32],[.42,.20,.46]],.12,col.main);
  }
}
function sdBuildSpecies(A,cfg,look){
  const col=sdPartColors(cfg,look);
  if(cfg.type==='human')sdBuildHuman(A,cfg,col);
  else if(cfg.sp==='cat')sdBuildCat(A,cfg,col);
  else if(cfg.sp==='dog')sdBuildDog(A,cfg,col);
  else if(cfg.type==='frog')sdBuildFrog(A,cfg,col);
  else if(cfg.type==='turtle')sdBuildTurtle(A,cfg,col);
  else if(cfg.type==='bird')sdBuildBird(A,cfg,col);
  else if(cfg.type==='dino')sdBuildDinosaur(A,cfg,col);
  else if(cfg.sp==='dragon')sdBuildDragon(A,cfg,col);
}

/* Keep the original exported/global makeAvatar signature and game-facing fields. */
function makeAvatar(id,look){
  if(id==='shiba')id='sapsal';
  const cfg=AVMAP[id]||AVMAP.girl||AVATARS[0];
  const A={id:cfg.id,cfg,garb:[],legWear:[],sleeves:[],
    root:new THREE.Group(),bob:new THREE.Group(),legs:[],arms:[],tails:[],
    hop:false,waddle:.04,h:2.15,face:null,expr:'base',
    blinkAt:performance.now()+2300+Math.random()*3500};
  A.root.name='avatar';A.bob.name='avatarRig';A.root.add(A.bob);
  const sh=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.2),
    new THREE.MeshBasicMaterial({map:TEX.shadow,transparent:true,depthWrite:false}));
  sh.rotation.x=-PI/2;sh.position.y=.03;sh.name='shadow';A.root.add(sh);
  buildSDBase(A,cfg,look||null);           // phase 1 - shared silhouette and rig
  sdBuildSpecies(A,cfg,look||null);         // phase 2 - species silhouettes
  attachSDFace(A,cfg);                    // phase 1 - all facial features are texture only
  // Keep hats, bag, and book anchors used in wardrobe/emotes.
  A.gat=makeGat(A.head,A.headR*.99,.8,-.10);
  if(cfg.noGat||cfg.type==='dino'||cfg.type==='bird')A.gat.visible=false;
  avatarBook(A,cfg.species==='brachio'?1.08:.91,-.45);
  if(typeof applyLook==='function'&&look)applyLook(A,look);
  return A;
}
/* Preserve movement and emotes-facing group semantics, with glued joints.
   Western dragon wings stay stationary, even while jumping/sitting. */
function animateAvatar(A,ph,amt,t,sit){
  const B=A.bob;if(!B)return;
  if(sit){
    B.position.y=Math.sin(t*1.5)*.012;B.rotation.z=0;
    A.legs.forEach(l=>{l.g.rotation.x=PI/2.3;});
    const reading=!!(A.reading&&A.book&&A.book.visible);
    A.arms.forEach(a=>{
      a.g.rotation.x=reading?1.25:.72;a.g.rotation.z=a.s*(reading?.08:.15);
    });
    if(A.head){A.head.rotation.x=reading?.30:.10;A.head.rotation.y=reading?Math.sin(t*.33)*.10:0;}
    if(A.book){if(reading){A.book.position.y=A.bookY+.12;A.book.position.z=A.bookZ-.02;A.book.rotation.x=-1+Math.sin(t*.6)*.02;
      if(A.pageM)A.pageM.visible=(t%5)/5<.15;}
      else{A.book.position.y=A.bookY;A.book.position.z=A.bookZ;A.book.rotation.x=-.5;if(A.pageM)A.pageM.visible=false;}}
    return;
  }
  B.position.y=Math.abs(Math.sin(ph))*(A.hop?.16:.042)*amt+Math.sin(t*2)*.009;
  B.rotation.z=Math.sin(ph)*(A.waddle||.04)*amt;
  A.legs.forEach(l=>{l.g.rotation.x=Math.sin(ph+l.ph)*.52*amt;});
  A.arms.forEach(a=>{
    a.g.rotation.x=Math.sin(ph+a.ph)*.35*amt;
    a.g.rotation.z=a.s*(a.wing?.23:.17)+a.s*Math.sin(t*2)*.025;
  });
  A.tails.forEach((g,i)=>{g.rotation.z=Math.sin(t*1.9+i)*.11;});
  if(A.head){A.head.rotation.x=Math.sin(t*1.2)*.025;A.head.rotation.z=Math.sin(t*.8)*.025;A.head.rotation.y=0;}
  if(A.skirt)A.skirt.rotation.z=Math.sin(ph)*.03*amt;
}
/* Dynamic texture fade is driven by the existing per-frame faceTick() entrypoint. */
function faceTick(A,now,want){
  if(!A||!A.face)return;
  if(now>A.blinkAt){if(now<A.blinkAt+120){if(['base','wow','joy'].includes(want))want='blink';}
    else A.blinkAt=now+2500+Math.random()*3300;}
  A.setFace(want||'base');
  if(A.faceNext&&A.faceBlend<1){
    A.faceBlend=Math.min(1,A.faceBlend+Math.min(.12,Math.max(.016,(now-(A.faceAt||now))/1000))*.85);
    A.faceNext.material.opacity=.6+.4*A.faceBlend;
    if(A.faceBlend>=1){A.face.material.map=A.faceNext.material.map;
      A.face.material.needsUpdate=true;A.faceNext.material.opacity=0;}
  }
}
