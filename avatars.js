/* 송현학당 · characters: chibi hanbok + gat, bipedal animals, drawn faces with expressions */
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
 {id:'eastern-dragon',name:'동양용',emo:'🐉',type:'beast',sp:'dragon',c:0x5fbf98,b:0xf6dc8c,ear:'none',horn:'antler',tail:'dragon',vest:0xd76860,dragonColor:true,dragonStyle:'east',noGat:true,god:true},
 {id:'western-dragon',name:'서양용',emo:'🐲',type:'beast',sp:'dragon',c:0xd9606a,b:0xffc98a,ear:'none',tail:'dragon',vest:0xd76860,dragonColor:true,dragonStyle:'west',noGat:true,god:true},
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
const SD_FELT_BUMP=(function(){
  const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');
  g.fillStyle='#808080';g.fillRect(0,0,256,256);
  for(let i=0;i<4200;i++){
    const x=rnd()*256,y=rnd()*256,r=.4+rnd()*2.8,a=.03+rnd()*.07;
    const tone=128+(rnd()-.5)*42;g.fillStyle=`rgba(${tone},${tone},${tone},${a})`;
    g.beginPath();g.arc(x,y,r,0,PI*2);g.fill();
  }
  for(let i=0;i<1200;i++){
    const x=rnd()*256,y=rnd()*256,len=2+rnd()*6;g.strokeStyle=`rgba(255,255,255,${.02+rnd()*.04})`;
    g.lineWidth=.8+rnd()*.8;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(rnd()*PI*2)*len,y+Math.sin(rnd()*PI*2)*len);g.stroke();
  }
  const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2,2);t.needsUpdate=true;return t;
})();
function sdWarmPastel(hex,satUp=.10,lightUp=.12){
  const c=new THREE.Color(hex==null?0xf5e8d8:hex),hsl={h:0,s:0,l:0};c.getHSL(hsl);
  c.setHSL(hsl.h,Math.min(.95,hsl.s*(1+satUp)+.03),Math.min(.92,hsl.l+lightUp));
  return c.getHex();
}
function sdMat(hex,extra){
  const col=new THREE.Color(hex==null?0xf5e8d8:hex);
  const emissive=col.clone().lerp(new THREE.Color(0xfff2e3),.22).multiplyScalar(.15);
  const material=new THREE.MeshPhysicalMaterial(Object.assign({
    color:col,
    roughness:.92,
    metalness:0,
    bumpMap:SD_FELT_BUMP,
    bumpScale:.015,
    emissive,
    emissiveIntensity:.15
  },extra||{}));
  // The existing site loads THREE r128: sheen is a Color in that release.
  // Newer releases use numeric sheen + sheenColor + sheenRoughness.
  // Keep both paths so old websites render instead of throwing in shaders.
  if('sheenRoughness' in material){
    material.sheen=.7;
    material.sheenColor=new THREE.Color(0xf8efe2);
    material.sheenRoughness=.85;
  }else if('sheen' in material){
    material.sheen=new THREE.Color(0xf8efe2).multiplyScalar(.7);
  }
  return material;
}
function sdSoftColor(hex,amt=.10){
  const warm=sdWarmPastel(hex,Math.max(.04,amt*.8),.11+amt*.09);
  return new THREE.Color(warm).lerp(new THREE.Color(0xfff3e3),amt*.18).getHex();
}
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
  const a=cfg.type==='dino'?'#fbf1df':cfg.type==='bird'?'#faf2e5':cfg.sp==='dragon'?'#fbe8dd':'#f7efe4';
  const b=cfg.type==='dino'?'#adcdb5':cfg.type==='bird'?'#d8c8ab':cfg.sp==='dragon'?'#e7beb8':'#c2cab9';
  g.fillStyle=a;g.fillRect(0,0,256,256);
  g.fillStyle=b;for(let y=14;y<256;y+=42){g.globalAlpha=.58;g.fillRect(0,y,256,11);}g.globalAlpha=1;
  g.strokeStyle='rgba(108,90,79,.06)';g.lineWidth=1;
  for(let x=0;x<256;x+=13){g.beginPath();g.moveTo(x,0);g.lineTo(x,256);g.stroke();}
  for(let y=0;y<256;y+=18){g.strokeStyle='rgba(255,255,255,.05)';g.beginPath();g.moveTo(0,y+.5);g.lineTo(256,y+.5);g.stroke();}
  const tex=new THREE.CanvasTexture(c);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;
  tex.repeat.set(1,1);tex.needsUpdate=true;
  SD_SHIRT_CACHE[key]=tex;return tex;
}
// Single source of truth: body and clothes share these same cross-sections.
const SD_PEAR_PROFILE=[
  [0,0],[.11,.015],[.245,.075],[.31,.18],[.342,.32],[.35,.43],
  [.321,.60],[.27,.73],[.20,.82],[.12,.86],[0,.88]
];
function sdPearRadiusAt(y){
  const P=SD_PEAR_PROFILE, yy=Math.max(P[0][1],Math.min(P[P.length-1][1],y));
  for(let i=1;i<P.length;i++)if(yy<=P[i][1]){
    const a=P[i-1],b=P[i],t=(yy-a[1])/(b[1]-a[1]);
    return a[0]+t*(b[0]-a[0]);
  }
  return 0;
}
function sdPear(p,mat,location,scale){
  const points=SD_PEAR_PROFILE.map(q=>new THREE.Vector2(q[0],q[1]));
  const mesh=new THREE.Mesh(new THREE.LatheGeometry(points,40),mat);
  mesh.position.set(...location);mesh.scale.set(...scale);p.add(mesh);return mesh;
}
function sdGarmentEdge(parent,mat,radiusX,radiusZ,y,z,name){
  const ring=new THREE.Mesh(new THREE.TorusGeometry(radiusX,.014,8,48),mat);
  ring.rotation.x=PI/2;ring.scale.y=radiusZ/radiusX;
  ring.position.set(0,y,z);ring.name=name;parent.add(ring);return ring;
}
function sdLathePart(p,points,mat,x=0,y=0,z=0,sx=1,sy=1,sz=1,rx=0,ry=0,rz=0){
  const geom=new THREE.LatheGeometry(points.map(q=>new THREE.Vector2(q[0],q[1])),26);
  const mesh=new THREE.Mesh(geom,mat);
  mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.rotation.set(rx,ry,rz);p.add(mesh);return mesh;
}
function sdFootShape(p,mat,x=0,y=0,z=0,flip=1){
  return sdLathePart(p,[[0,0],[.05,.02],[.10,.08],[.16,.16],[.17,.24],[.14,.31],[.07,.34],[0,.34]],mat,x,y,z,1.18,.88,1.55,PI/2,0,0);
}
function sdCollarRing(p,mat,x,y,z,rx=.22,ry=.07,rz=.18){
  const ring=sdLathePart(p,[[0,0],[.03,.01],[.045,.03],[.05,.05],[.045,.07],[.03,.09],[0,.10]],mat,x,y,z,rx,ry,rz,PI/2,0,0);ring.name='collar';return ring;
}

function sdProfile(cfg){
  const P={
    headR:.445,bodyWidth:1,bodyHeight:1,headLift:0,headZ:0,isWing:false,
    armX:.35,armY:.99,armZ:-.02,armRot:.31,legX:.18,legY:.43,tailY:.63,tailZ:.30,
    headScale:[1.05,1.0,1.0]
  };
  if(cfg.type==='human')return P;
  if(cfg.sp==='cat')return Object.assign(P,{headR:.47,bodyWidth:.96,bodyHeight:.95,headScale:[1.16,.97,1.0],armY:.95,legY:.41,tailY:.67});
  if(cfg.sp==='dog')return Object.assign(P,{headR:.485,bodyWidth:1.02,bodyHeight:.98,headScale:[1.08,.98,1.10],armX:.37,armY:.97,legX:.19,tailY:.68});
  if(cfg.type==='frog')return Object.assign(P,{headR:.48,bodyWidth:1.02,bodyHeight:.86,headScale:[1.18,.94,.98],armX:.33,armY:.90,legX:.19,legY:.39,tailY:.60});
  if(cfg.type==='turtle')return Object.assign(P,{headR:.40,bodyWidth:1.14,bodyHeight:.82,headLift:-.02,headScale:[1.04,.92,.96],armX:.39,armY:.86,legX:.22,legY:.37,tailY:.58,tailZ:.36});
  if(cfg.type==='bird'){
    if(cfg.crane)return Object.assign(P,{headR:.38,bodyWidth:.84,bodyHeight:.96,headLift:.24,headZ:-.02,headScale:[.98,1.02,.94],armX:.30,armY:.95,legX:.13,legY:.39,tailY:.66});
    if(cfg.duck)return Object.assign(P,{headR:.42,bodyWidth:1.10,bodyHeight:.88,headLift:.03,headScale:[1.12,.95,1.02],armX:.34,armY:.90,legX:.16,legY:.37,tailY:.63});
    if(cfg.mandarin)return Object.assign(P,{headR:.43,bodyWidth:1.08,bodyHeight:.92,headLift:.03,headScale:[1.06,.97,1.0],armX:.34,armY:.92,legX:.16,legY:.38,tailY:.65});
    if(cfg.peacock)return Object.assign(P,{headR:.44,bodyWidth:.98,bodyHeight:.96,headLift:.05,headScale:[1.0,1.0,.98],armX:.33,armY:.95,legX:.15,legY:.40,tailY:.75,tailZ:.36});
    if(cfg.phoenix)return Object.assign(P,{headR:.45,bodyWidth:1.0,bodyHeight:.98,headLift:.07,headScale:[1.02,1.0,.98],armX:.33,armY:.95,legX:.15,legY:.39,tailY:.74,tailZ:.34});
    return Object.assign(P,{headR:.44,bodyWidth:.90,bodyHeight:.84,headLift:.02,headScale:[1.02,.98,.96],armX:.30,armY:.88,legX:.14,legY:.36,tailY:.61});
  }
  if(cfg.type==='dino'){
    if(cfg.species==='brachio')return Object.assign(P,{headR:.39,bodyWidth:1.14,bodyHeight:.92,headLift:.34,headZ:-.18,headScale:[.94,.95,.96],armX:.34,armY:.87,legX:.21,legY:.38,tailY:.64,tailZ:.34});
    if(cfg.species==='rex')return Object.assign(P,{headR:.50,bodyWidth:1.08,bodyHeight:1.02,headLift:.08,headZ:-.08,headScale:[1.15,1.0,1.18],armX:.30,armY:.93,legX:.20,legY:.42,tailY:.69,tailZ:.34});
    if(cfg.species==='trike')return Object.assign(P,{headR:.47,bodyWidth:1.13,bodyHeight:.92,headLift:.02,headZ:-.10,headScale:[1.12,1.0,1.14],armX:.33,armY:.90,legX:.22,legY:.39,tailY:.64,tailZ:.34});
    if(cfg.species==='stego')return Object.assign(P,{headR:.43,bodyWidth:1.14,bodyHeight:.92,headLift:.02,headZ:-.07,headScale:[1.0,.98,1.08],armX:.34,armY:.91,legX:.22,legY:.39,tailY:.66,tailZ:.36});
    if(cfg.species==='anky')return Object.assign(P,{headR:.42,bodyWidth:1.18,bodyHeight:.88,headLift:-.01,headZ:-.06,headScale:[1.02,.95,1.06],armX:.34,armY:.88,legX:.23,legY:.36,tailY:.60,tailZ:.38});
    return Object.assign(P,{bodyWidth:1.12,bodyHeight:.94});
  }
  if(cfg.sp==='dragon'){
    if(cfg.dragonStyle==='west')return Object.assign(P,{headR:.47,bodyWidth:.97,bodyHeight:.98,headLift:.09,headZ:-.09,headScale:[1.12,1.0,1.12],armX:.34,armY:.95,legX:.18,legY:.41,tailY:.68,tailZ:.34});
    return Object.assign(P,{headR:.43,bodyWidth:1.02,bodyHeight:.92,headLift:.14,headZ:-.11,headScale:[1.03,.98,1.10],armX:.34,armY:.93,legX:.18,legY:.40,tailY:.69,tailZ:.34});
  }
  return P;
}

function buildSDBase(A,cfg,look){
  const B=A.bob,profile=sdProfile(cfg);
  const skinBase=cfg.type==='human'?0xf4dcca:(cfg.bc!=null?cfg.bc:(cfg.dark?0x647e79:(cfg.c!=null?cfg.c:(cfg.type==='frog'?0x8abf81:(cfg.type==='bird'?0xf6f1e9:0xa5cb9a)))));
  const chosen=(cfg.dragonColor||cfg.type==='dino')?lookPick(look,'av',skinBase):skinBase;
  const skin=sdMat(cfg.dragonStyle?sdWarmPastel(chosen,.12,.0):sdSoftColor(chosen,.11));
  const body=new THREE.Group();body.name='body';B.add(body);
  const baseY=.38,bodyH=profile.bodyHeight,core=sdPear(body,skin,[0,baseY,.015],[profile.bodyWidth,bodyH,1.02]);
  core.name='bodySkin';
  // The top is not an arbitrary constant: it comes from the same lathe cross-section.
  const bodyTopY=baseY+SD_PEAR_PROFILE[SD_PEAR_PROFILE.length-1][1]*bodyH;
  const shirtMat=sdMat(0xffffff,{map:sdShirtTexture(cfg),side:THREE.DoubleSide,
    emissive:new THREE.Color(0xfff5ea),emissiveIntensity:.16});
  // Matching lathe from shoulder line to upper hip. Every radial sample is >=1.10x skin.
  // Equal surfaces, copied offsets and a floating center-belly belt are prohibited.
  const shirtY0=.15,shirtY1=.79,shirtPoints=[];
  for(let i=0;i<=40;i++){
    const y=shirtY0+(shirtY1-shirtY0)*i/40;
    shirtPoints.push([sdPearRadiusAt(y)*1.10,y]);
  }
  const shirt=new THREE.Mesh(new THREE.LatheGeometry(
    shirtPoints.map(q=>new THREE.Vector2(q[0],q[1])),40),shirtMat);
  shirt.name='defaultShirt';shirt.position.set(0,baseY,.015);
  shirt.scale.set(profile.bodyWidth,bodyH,1.02*1.10);body.add(shirt);A.garb.push(shirt);
  // Thin knitted hems at the *actual* shirt openings, never across the stomach.
  const edgeMat=sdMat(0xf5e9d8,{emissiveIntensity:.14});
  const edge=(y,name)=>{
    const rad=sdPearRadiusAt(y)*1.10*profile.bodyWidth;
    const rZ=sdPearRadiusAt(y)*1.10*1.02;
    const rim=sdGarmentEdge(body,edgeMat,rad+.006,rZ+.006,baseY+y*bodyH,.015,name);
    A.garb.push(rim);
  };
  edge(shirtY0,'shirtHem');edge(shirtY1,'shirtCollar');
  const arms=[],legs=[];
  for(const s of [-1,1]){
    // Shoulder pivot and upper arm are inside the pear torso, and no arm geometry
    // can rise into the jaw: all arm stations are y<=0 in shoulder coordinates.
    const shoulderY=bodyTopY-.22;
    const yInPear=(shoulderY-baseY)/bodyH;
    const shoulderR=sdPearRadiusAt(yInPear)*profile.bodyWidth;
    const arm=new THREE.Group();arm.name=s<0?'leftArm':'rightArm';
    arm.position.set(s*shoulderR*.94,shoulderY,-.015);arm.rotation.z=s*.30;B.add(arm);
    const armOutline=[[0,0],[.080,-.015],[.125,-.09],[.135,-.18],
      [.130,-.30],[.122,-.40],[.125,-.47],[.100,-.54],[.060,-.565],[0,-.58]];
    const limb=sdLathePart(arm,armOutline.reverse(),skin,0,0,0,.97,1,.97);
    limb.name='feltArmAndHand';  // a continuous taper, NOT a separate glove sphere
    const sleeveOutline=[[0,0],[.09,-.015],[.145,-.085],[.148,-.17],
      [.145,-.24],[.140,-.285]];
    const sleeve=sdLathePart(arm,sleeveOutline.reverse(),shirtMat,0,.002,0,1,1,1);
    sleeve.name='sleeve';A.sleeves.push(sleeve);
    A.arms.push({g:arm,s,ph:s>0?0:PI,wing:false,restZ:.30});arms.push(arm);
    const leg=new THREE.Group();leg.name=s<0?'leftLeg':'rightLeg';leg.position.set(s*profile.legX,profile.legY,.01);B.add(leg);
    sdLathePart(leg,[[0,-.43],[.065,-.43],[.13,-.37],[.145,-.30],
      [.128,-.19],[.120,-.10],[.09,-.035],[0,0]],skin,0,0,-.01,.92,1.0,1.0);
    const foot=sdFootShape(leg,skin,0,-.34,-.11,s);foot.scale.set(1.10,.82,1.32);
    A.legs.push({g:leg,s,ph:s>0?PI:0});legs.push(leg);
  }
  const head=new THREE.Group();head.name='head';B.add(head);A.head=head;
  const r=profile.headR,halfY=r*profile.headScale[1];
  head.position.set(0,bodyTopY+halfY-.075,-.055+profile.headZ);
  const hm=sdBall(head,r,skin,0,0,0,...profile.headScale);hm.name='headSkin';
  A.headR=r;A.headS=profile.headScale.slice();
  const tail=new THREE.Group();tail.name='tail';tail.position.set(0,profile.tailY,profile.tailZ);B.add(tail);A.tail=tail;
  A.parts={body,head,leftArm:arms[0],rightArm:arms[1],leftLeg:legs[0],rightLeg:legs[1],tail};
  // Custom outfit radius uses a generous envelope of the pear: avoids tube clipping.
  A.fit={y0:baseY+shirtY0*bodyH,y1:baseY+shirtY1*bodyH,
    r0:.43*profile.bodyWidth,r1:.38*profile.bodyWidth,neck:bodyTopY-.07,
    legTop:profile.legY,legLen:.26,legR:.13,sleeve:[.13,1.02,-.15],
    human:cfg.type==='human'};
  A.h=2.12+profile.headLift;A.waddle=.045;A.headRadius=r;
  A.sd={skin,skinColor:chosen,base:core,shirt,shirtMat,profile,bodyTopY,
    shirtMinRadialRatio:1.10,armMinY:-.58,armMaxY:0};
  return A;
}
function sdReconcileRig(A,cfg){
  const body=A.parts.body,profile=A.sd.profile;
  const bodyTopY=body.scale.y*(.38+.88*profile.bodyHeight);
  const headSkin=A.head.children.find(x=>x.name==='headSkin');
  const headHalfY=A.headR*(headSkin?headSkin.scale.y:profile.headScale[1])*A.head.scale.y;
  const longNeck=cfg.species==='brachio'||!!cfg.crane;
  // Normal characters: strictly 0.075 overlap between head bottom and body top.
  // Long-neck species retain their silhouette, but receive a continuous felt bridge.
  if(!longNeck)A.head.position.y=bodyTopY+headHalfY-.075;
  const headBottomY=A.head.position.y-headHalfY;
  if(longNeck&&headBottomY>bodyTopY-.075){
    const start=bodyTopY-.10,end=headBottomY+.12,z1=A.head.position.z;
    sdTube(A.bob,[[0,start,.015],[0,start+(end-start)*.35,z1*.33],
      [0,start+(end-start)*.72,z1*.72],[0,end,z1]],cfg.crane?.11:.15,A.sd.skin);
  }
  // Use the measured pear cross-section at the real shoulder height.
  const shoulderY=bodyTopY-.22;
  const bodyLocalY=shoulderY/body.scale.y;
  const r=sdPearRadiusAt((bodyLocalY-.38)/profile.bodyHeight)*profile.bodyWidth*body.scale.x;
  A.arms.forEach(a=>{
    // Deliberate dinosaur mini-arms keep their species-specific scale; only pivot moves.
    a.g.position.y=shoulderY;
    a.g.position.x=a.s*r*.94;
    a.g.rotation.z=a.s*(a.restZ||.30);
  });
  const lo=body.scale.y*(.38+.15*profile.bodyHeight),
        hi=body.scale.y*(.38+.79*profile.bodyHeight);
  A.fit.y0=lo;A.fit.y1=hi;
  A.fit.r0=.43*profile.bodyWidth*body.scale.x;
  A.fit.r1=.38*profile.bodyWidth*body.scale.x;
  A.fit.neck=bodyTopY-.07;
  A.fit.legTop=profile.legY;
  A.fit.sleeve=[.13,1.02,-.15];
  A.sd.bodyTopY=bodyTopY;
  A.sd.rigMetrics={bodyTopY,headBottomY,headOverlap:bodyTopY-headBottomY,
    shoulderY,shoulderOffset:bodyTopY-shoulderY,shirtMinRadialRatio:1.10,
    handWidth:.125*.97,shirtBottomY:lo,shirtTopY:hi,longNeck,
    bridgeInstalled:longNeck&&headBottomY>bodyTopY-.075};
}
/* CanvasTexture-only eyes/nose/mouth: no 3D face spheres or nostril dots. */


/* 캐릭터마다 다른 얼굴: 눈 모양·눈동자 색·눈썹·입·무늬를 종류별로 따로 그려요 */
function sdFaceStyle(cfg){
  const id=cfg.id||'',sp=cfg.sp,t=cfg.type;
  const S={w:19,h:27,ex:88,ey:214,iris:null,pupil:'round',tilt:0,lash:0,brow:null,lid:0,shine:1,mouth:'cute',nose:null,marks:null,cheek:'rgba(248,168,164,.52)',my:308};
  if(t==='human'){Object.assign(S,{w:20,h:27,ex:92,iris:'#5a3b2c',mouth:'human'});if(cfg.fem)Object.assign(S,{lash:3,brow:{c:'#4a3329',th:6,dy:-46,ang:.08,len:30}});else Object.assign(S,{h:22,brow:{c:'#4a3226',th:11,dy:-44,ang:-.06,len:34}});return S;}
  if(sp==='cat'){Object.assign(S,{w:25,h:24,ex:90,iris:cfg.eye||'#9bc34a',pupil:'slit',tilt:.22,mouth:'cat',nose:'cat',marks:'whisker'});
    if(cfg.tiger)Object.assign(S,{iris:cfg.eye||'#5aa0d8',marks:'tiger',brow:{c:'#5a5052',th:9,dy:-42,ang:-.18,len:30}});return S;}
  if(sp==='dog'){Object.assign(S,{w:24,h:28,ex:88,iris:'#4a2c1c',shine:1.35,mouth:'dog',nose:'dog'});
    if(cfg.mask==='jindo')Object.assign(S,{w:20,h:22,tilt:.12,brow:{c:'#d9b88a',th:10,dy:-40,ang:0,len:16,dot:true}});
    if(cfg.mask==='corgi')Object.assign(S,{iris:'#6a3a1e',mouth:'dogTongue'});
    if(cfg.mask==='sapsal')Object.assign(S,{lid:.45,marks:'fringe'});
    if(cfg.fluffy)Object.assign(S,{w:26,h:30,iris:'#2a1a14',shine:1.5,marks:'tear'});return S;}
  if(t==='frog')return Object.assign(S,{w:23,h:23,ex:112,ey:196,iris:'#e7c24a',pupil:'bar',mouth:'frog',cheek:'rgba(240,150,150,.45)'});
  if(t==='turtle'){Object.assign(S,{w:18,h:22,iris:'#3d6a4a',lid:.32,mouth:'turtle'});if(cfg.dark)Object.assign(S,{iris:'#e2b544',pupil:'slit',lid:.25,brow:{c:'#2f3e3a',th:10,dy:-38,ang:-.2,len:30},mouth:'line',cheek:'rgba(200,160,150,.3)'});return S;}
  if(t==='dino'){const q=cfg.species;Object.assign(S,{w:19,h:25,ex:86,iris:'#3e4a2a',mouth:'cute'});
    if(q==='brachio')Object.assign(S,{lash:3,iris:'#4c6b3a',mouth:'smallSmile'});
    if(q==='rex')Object.assign(S,{w:20,h:21,iris:'#d9862a',pupil:'slit',brow:{c:'#3e5640',th:11,dy:-36,ang:-.32,len:32},mouth:'rex'});
    if(q==='trike')Object.assign(S,{w:21,h:26,iris:'#5b4630',mouth:'beakish'});
    if(q==='stego')Object.assign(S,{lid:.5,iris:'#6a5a2a',mouth:'line'});
    if(q==='anky')Object.assign(S,{w:18,h:20,iris:'#5a3a2a',brow:{c:'#5e5d33',th:12,dy:-34,ang:.25,len:30},mouth:'grump'});return S;}
  if(t==='bird'){Object.assign(S,{w:13,h:15,ex:80,iris:null,shine:.8,mouth:'none',cheek:'rgba(248,168,164,.42)'});
    if(cfg.crane)Object.assign(S,{w:11,h:13,marks:'craneMask'});
    if(cfg.duck)Object.assign(S,{w:16,h:19});
    if(cfg.mandarin)Object.assign(S,{marks:'mandarinStripe',iris:'#3a2a1a'});
    if(cfg.peacock)Object.assign(S,{marks:'peacockStripe'});
    if(cfg.phoenix)Object.assign(S,{iris:'#f2c14a',pupil:'slit',tilt:.25,marks:'flameLiner',cheek:'rgba(250,150,90,.5)'});
    if(id==='bird')Object.assign(S,{w:12,h:14,marks:'tit'});return S;}
  if(sp==='dragon'){const east=cfg.dragonStyle==='east'||(!cfg.dragonStyle);
    if(east)return Object.assign(S,{w:28,h:15,ex:86,ey:206,iris:id==='cheongryong'?'#ffd447':'#f2b632',pupil:'slit',tilt:.36,brow:{c:'#fff3c8',th:9,dy:-30,ang:-.38,len:40,curl:true},mouth:'east',marks:'eastMark',cheek:'rgba(240,150,150,.3)'});
    return Object.assign(S,{w:24,h:27,ex:90,iris:'#69c23a',pupil:'slit',tilt:-.05,brow:{c:'#7a2e34',th:11,dy:-42,ang:-.42,len:30,spiky:true},mouth:'fang',nose:'nostril',cheek:'rgba(250,170,150,.42)'});}
  return S;
}
function createSDFaceTexture(cfg,expr){
  const key='v3|'+(cfg.id||cfg.sp||cfg.type)+':'+expr;
  if(SD_FACE_CACHE[key])return SD_FACE_CACHE[key];
  const c=document.createElement('canvas');c.width=c.height=512;
  const g=c.getContext('2d');g.clearRect(0,0,512,512);g.lineCap='round';g.lineJoin='round';
  const S=sdFaceStyle(cfg),dark='#2c2326',ey=S.ey,mx=256,my=S.my;
  const closed=expr==='blink'||expr==='sleepy'||expr==='joy',wow=expr==='wow',focus=expr==='focus',shy=expr==='shy',smile=expr==='smile'||expr==='joy';
  /* 볼 */
  for(const s of [-1,1]){const bx=256+s*146,by=282,grd=g.createRadialGradient(bx,by,4,bx,by,56);const cc=shy?'rgba(242,128,140,.68)':S.cheek;
    grd.addColorStop(0,cc);grd.addColorStop(1,cc.replace(/[\d.]+\)$/,'0)'));g.fillStyle=grd;g.beginPath();g.ellipse(bx,by,58,36,0,0,PI*2);g.fill();}
  /* 무늬 (눈 아래 깔리는 것) */
  const M=S.marks;
  if(M==='craneMask'){g.fillStyle='rgba(40,36,34,.85)';for(const s of [-1,1]){g.beginPath();g.ellipse(256+s*S.ex,ey+4,30,22,s*.2,0,PI*2);g.fill();}}
  if(M==='mandarinStripe'){g.fillStyle='rgba(255,255,255,.95)';for(const s of [-1,1]){g.beginPath();g.moveTo(256+s*(S.ex-18),ey-14);g.quadraticCurveTo(256+s*(S.ex+40),ey-34,256+s*(S.ex+110),ey+8);g.quadraticCurveTo(256+s*(S.ex+40),ey-6,256+s*(S.ex-14),ey+6);g.closePath();g.fill();}}
  if(M==='peacockStripe'){g.fillStyle='rgba(255,255,255,.92)';for(const s of [-1,1]){g.beginPath();g.ellipse(256+s*(S.ex+6),ey+30,28,7,s*.25,0,PI*2);g.fill();g.beginPath();g.ellipse(256+s*(S.ex+4),ey-26,26,6,-s*.2,0,PI*2);g.fill();}}
  if(M==='tit'){g.fillStyle='rgba(40,34,32,.55)';for(const s of [-1,1]){g.beginPath();g.moveTo(256+s*(S.ex-24),ey-26);g.quadraticCurveTo(256+s*(S.ex+30),ey-30,256+s*(S.ex+70),ey-6);g.lineTo(256+s*(S.ex+66),ey+2);g.quadraticCurveTo(256+s*(S.ex+28),ey-18,256+s*(S.ex-20),ey-16);g.closePath();g.fill();}}
  if(M==='tiger'){g.fillStyle='rgba(70,62,66,.78)';[[-34,132,8,30],[0,122,9,36],[34,132,8,30]].forEach(([dx,y,w,h])=>{g.beginPath();g.ellipse(256+dx,y,w,h,0,0,PI*2);g.fill();});
    for(const s of [-1,1])for(const dy of [0,26]){g.beginPath();g.ellipse(256+s*205,262+dy,30,7,s*.28,0,PI*2);g.fill();}}
  if(M==='fringe'){g.fillStyle='rgba(236,230,218,1)';for(let i=0;i<9;i++){const x=110+i*36;g.beginPath();g.ellipse(x,ey-30+(i%2)*8,30,34,0,0,PI*2);g.fill();}}
  if(M==='eastMark'){g.fillStyle='rgba(214,74,66,.85)';g.beginPath();g.moveTo(256,120);g.quadraticCurveTo(272,150,256,176);g.quadraticCurveTo(240,150,256,120);g.fill();}
  /* 눈 */
  function eye(s){const x=256+s*S.ex;g.save();g.translate(x,ey);g.rotate(-s*S.tilt);
    const sc=wow?1.15:(shy?.9:1),w=S.w*sc,h=S.h*sc;
    if(closed){g.strokeStyle=dark;g.lineWidth=10;g.beginPath();
      if(expr==='sleepy'){g.moveTo(-w-2,2);g.quadraticCurveTo(0,12,w+2,2);}else{g.moveTo(-w-4,6);g.quadraticCurveTo(0,-22,w+4,6);}g.stroke();
      if(S.lash&&expr!=='sleepy'){g.lineWidth=5;g.beginPath();g.moveTo(s*(w+2),2);g.lineTo(s*(w+14),-8);g.stroke();}
      g.restore();return;}
    if(S.iris){g.fillStyle='#fffaf3';g.beginPath();g.ellipse(0,0,w+3,h+3,0,0,PI*2);g.fill();
      g.fillStyle=S.iris;g.beginPath();g.ellipse(0,0,w*(S.pupil==='bar'?1:.92),h*.96,0,0,PI*2);g.fill();
      const rg=g.createRadialGradient(0,h*.4,1,0,0,h);rg.addColorStop(0,'rgba(255,255,255,.25)');rg.addColorStop(1,'rgba(0,0,0,.18)');g.fillStyle=rg;g.beginPath();g.ellipse(0,0,w*.92,h*.96,0,0,PI*2);g.fill();
      g.fillStyle=dark;g.beginPath();
      if(S.pupil==='slit')g.ellipse(0,0,w*(wow?.42:.22),h*.86,0,0,PI*2);else if(S.pupil==='bar')g.ellipse(0,0,w*.7,h*.32,0,0,PI*2);else g.ellipse(0,h*.06,w*.55,h*.6,0,0,PI*2);g.fill();
      g.strokeStyle='rgba(44,35,38,.85)';g.lineWidth=4;g.beginPath();g.ellipse(0,0,w+3,h+3,0,0,PI*2);g.stroke();}
    else{g.fillStyle=dark;g.beginPath();g.ellipse(0,0,w,h,0,0,PI*2);g.fill();}
    g.fillStyle='#fffaf5';const sh=S.shine;g.beginPath();g.arc(w*.3,-h*.34,6.5*sh*Math.min(1,w/17),0,PI*2);g.fill();g.beginPath();g.arc(-w*.22,h*.18,2.6*sh,0,PI*2);g.fill();
    const lid=Math.max(S.lid,focus?.42:0);if(lid>0){g.fillStyle=S.lidC||dark;g.save();g.beginPath();g.ellipse(0,0,w+5,h+5,0,0,PI*2);g.clip();g.fillStyle=M==='fringe'?'rgba(236,230,218,1)':'rgba(70,58,54,.92)';g.fillRect(-w-6,-h-6,2*w+12,(2*h+12)*lid);g.restore();
      g.strokeStyle=dark;g.lineWidth=6;g.beginPath();g.moveTo(-w-3,-h-3+(2*h+6)*lid);g.lineTo(w+3,-h-3+(2*h+6)*lid);g.stroke();}
    if(S.lash){g.strokeStyle=dark;g.lineWidth=5;for(let k=0;k<S.lash;k++){const a=-.35-k*.32;g.beginPath();g.moveTo(s*(w*.8)*Math.cos(a+.3)*1.1,-h*.8);g.lineTo(s*(w+12-k*4),-h-6+k*9);g.stroke();}}
    g.restore();}
  eye(-1);eye(1);
  /* 눈썹 */
  if(S.brow||focus){const B=S.brow||{c:dark,th:7,dy:-40,ang:-.25,len:26};for(const s of [-1,1]){const x=256+s*S.ex,y=ey+B.dy-(wow?10:0)+(focus?6:0);const a=(B.ang+(focus?-.2:0)+(shy?.25:0))*s;
    g.strokeStyle=B.c;g.fillStyle=B.c;g.lineWidth=B.th;
    if(B.dot){g.beginPath();g.ellipse(x,y,B.len,B.th*.8,0,0,PI*2);g.fill();continue;}
    g.save();g.translate(x,y);g.rotate(a);g.beginPath();g.moveTo(-B.len,0);if(B.curl)g.quadraticCurveTo(0,-14,B.len,-4);else g.lineTo(B.len,0);g.stroke();
    if(B.spiky){g.beginPath();g.moveTo(s*B.len*.2,-2);g.lineTo(s*B.len*.55,-18);g.lineTo(s*B.len*.8,-2);g.fill();}
    if(B.curl){const ox=s*B.len;g.lineWidth=B.th*.7;g.beginPath();g.moveTo(ox,-4);g.quadraticCurveTo(ox+s*22,-30,ox+s*10,-44);g.stroke();}
    g.restore();}}
  if(M==='flameLiner'){g.strokeStyle='#d8452e';g.lineWidth=6;for(const s of [-1,1]){const x=256+s*S.ex;g.beginPath();g.moveTo(x+s*S.w,ey-6);g.quadraticCurveTo(x+s*(S.w+24),ey-14,x+s*(S.w+40),ey-36);g.stroke();}}
  /* 코 */
  g.strokeStyle=dark;g.fillStyle=dark;
  if(S.nose==='cat'){g.fillStyle='#e48a97';g.beginPath();g.moveTo(mx-12,my-22);g.quadraticCurveTo(mx,my-28,mx+12,my-22);g.quadraticCurveTo(mx,my-8,mx-12,my-22);g.fill();}
  if(S.nose==='dog'){g.fillStyle='#2b2224';g.beginPath();g.ellipse(mx,my-20,19,13,0,0,PI*2);g.fill();g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.ellipse(mx-6,my-25,6,3.5,0,0,PI*2);g.fill();}
  if(S.nose==='nostril'){g.fillStyle='rgba(60,30,34,.8)';for(const s of [-1,1]){g.beginPath();g.ellipse(mx+s*16,my-24,5,7,s*.4,0,PI*2);g.fill();}}
  /* 수염 */
  if(M==='whisker'||M==='tiger'){g.strokeStyle='rgba(70,58,58,.55)';g.lineWidth=4;for(const s of [-1,1])for(const k of [0,1,2]){g.beginPath();g.moveTo(mx+s*64,my-14+k*13);g.quadraticCurveTo(mx+s*120,my-24+k*16,mx+s*168,my-30+k*22);g.stroke();}}
  if(M==='tear'){g.fillStyle='rgba(210,170,150,.35)';for(const s of [-1,1]){g.beginPath();g.ellipse(256+s*(S.ex-8),ey+46,7,20,0,0,PI*2);g.fill();}}
  /* 입 */
  g.strokeStyle=dark;g.fillStyle=dark;g.lineWidth=9;const m=S.mouth;
  if(m==='none'){}
  else if(wow){g.beginPath();g.ellipse(mx,my+12,m==='frog'?18:12,m==='frog'?13:15,0,0,PI*2);g.fill();}
  else if(m==='cat'||m==='dog'||m==='dogTongue'){g.lineWidth=7;g.beginPath();g.moveTo(mx,my-8);g.lineTo(mx,my+2);g.stroke();
    g.beginPath();g.moveTo(mx-24,my-2);g.quadraticCurveTo(mx-12,my+16,mx,my+2);g.quadraticCurveTo(mx+12,my+16,mx+24,my-2);g.stroke();
    if(smile||m==='dogTongue'){g.fillStyle='#ef8a98';g.beginPath();g.ellipse(mx,my+16,11,smile?14:10,0,0,PI);g.fill();g.strokeStyle='rgba(200,90,110,.8)';g.lineWidth=3;g.beginPath();g.moveTo(mx,my+10);g.lineTo(mx,my+22);g.stroke();}}
  else if(m==='frog'){g.lineWidth=8;g.beginPath();g.moveTo(mx-110,my-26);g.quadraticCurveTo(mx,my+(smile?40:18),mx+110,my-26);g.stroke();if(smile){g.fillStyle='#e46f7d';g.beginPath();g.moveTo(mx-70,my-6);g.quadraticCurveTo(mx,my+34,mx+70,my-6);g.quadraticCurveTo(mx,my+10,mx-70,my-6);g.fill();}}
  else if(m==='turtle'||m==='smallSmile'){g.lineWidth=7;g.beginPath();g.moveTo(mx-16,my+2);g.quadraticCurveTo(mx,my+(smile?24:14),mx+16,my+2);g.stroke();}
  else if(m==='line'){g.lineWidth=7;g.beginPath();g.moveTo(mx-16,my+8);g.lineTo(mx+16,my+8);g.stroke();}
  else if(m==='grump'){g.lineWidth=7;g.beginPath();g.moveTo(mx-20,my+14);g.quadraticCurveTo(mx,my+(smile?24:2),mx+20,my+14);g.stroke();}
  else if(m==='beakish'){g.lineWidth=7;g.beginPath();g.moveTo(mx-26,my);g.quadraticCurveTo(mx,my+22,mx+26,my);g.stroke();}
  else if(m==='rex'){g.beginPath();g.moveTo(mx-44,my-4);g.quadraticCurveTo(mx,my+(smile?34:22),mx+44,my-4);g.closePath();g.fillStyle='#7d3b3b';g.fill();g.fillStyle='#fffaf0';for(let k=-3;k<=3;k++){g.beginPath();g.moveTo(mx+k*12-5,my-1+Math.abs(k));g.lineTo(mx+k*12+5,my-1+Math.abs(k));g.lineTo(mx+k*12,my+10);g.closePath();g.fill();}}
  else if(m==='fang'){g.lineWidth=8;g.beginPath();g.moveTo(mx-30,my-2);g.quadraticCurveTo(mx,my+(smile?30:18),mx+30,my-4);g.stroke();g.fillStyle='#fffaf0';g.strokeStyle=dark;g.lineWidth=3;g.beginPath();g.moveTo(mx+8,my+8);g.lineTo(mx+20,my+5);g.lineTo(mx+15,my+22);g.closePath();g.fill();g.stroke();}
  else if(m==='east'){g.lineWidth=6;g.beginPath();g.moveTo(mx-18,my+4);g.quadraticCurveTo(mx,my+(smile?20:12),mx+18,my+4);g.stroke();
    g.strokeStyle='rgba(120,70,40,.75)';g.lineWidth=7;for(const s of [-1,1]){g.beginPath();g.moveTo(mx+s*8,my-16);g.quadraticCurveTo(mx+s*70,my-30,mx+s*110,my+2);g.quadraticCurveTo(mx+s*130,my+24,mx+s*150,my+6);g.stroke();}}
  else if(m==='human'){g.lineWidth=7;if(smile){g.fillStyle='#c9616b';g.beginPath();g.moveTo(mx-22,my);g.quadraticCurveTo(mx,my+30,mx+22,my);g.closePath();g.fill();}else if(shy||expr==='sleepy'){g.beginPath();g.moveTo(mx-10,my+8);g.quadraticCurveTo(mx,my+12,mx+10,my+8);g.stroke();}else{g.beginPath();g.moveTo(mx-16,my+2);g.quadraticCurveTo(mx,my+16,mx+16,my+2);g.stroke();}}
  else if(smile){g.beginPath();g.moveTo(mx-27,my);g.quadraticCurveTo(mx,my+34,mx+27,my);g.stroke();}
  else{g.beginPath();g.moveTo(mx-24,my+2);g.quadraticCurveTo(mx-12,my+22,mx,my+9);g.quadraticCurveTo(mx+12,my+22,mx+24,my+2);g.stroke();}
  if(expr==='sleepy'){g.font='bold 44px sans-serif';g.fillStyle='#8aa0c7';g.fillText('z',372,120);g.font='bold 30px sans-serif';g.fillText('z',404,88);}
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
  const dz=!!cfg.dragonStyle;
  return {main:sdMat(dz?sdWarmPastel(main==null?0xb6c3a4:main,.12,0):sdSoftColor(main==null?0xb6c3a4:main,.1)),
    secondary:sdMat(dz?sdWarmPastel(secondary==null?0xf7ead0:secondary,.08,0):sdSoftColor(secondary==null?0xf7ead0:secondary,.04)),
    ivory:sdMat(0xf6e7c9),dark:sdMat(0x7e706c)};
}
function sdTail(A,points,r,mat){
  // Rounded plush tail: broad at the hip, gradually tapered at the end.
  // Keep A.tail / A.tails as the existing clothing and animation anchors.
  const group=A.tail;
  const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));
  const segments=30, sides=10, verts=[], uv=[], idx=[];
  for(let i=0;i<=segments;i++){
    const t=i/segments;
    const center=curve.getPoint(t), tangent=curve.getTangent(t).normalize();
    const fallback=Math.abs(tangent.y)>.90?new THREE.Vector3(1,0,0):new THREE.Vector3(0,1,0);
    const u=new THREE.Vector3().crossVectors(tangent,fallback).normalize();
    const v=new THREE.Vector3().crossVectors(tangent,u).normalize();
    const rad=r*(1.28-.94*t)*Math.pow(Math.max(.015,1-t*t),.20);
    for(let j=0;j<=sides;j++){
      const a=j/sides*PI*2;
      const pos=center.clone().addScaledVector(u,Math.cos(a)*rad).addScaledVector(v,Math.sin(a)*rad);
      verts.push(pos.x,pos.y,pos.z); uv.push(j/sides,t);
      if(i<segments&&j<sides){const n=i*(sides+1)+j;idx.push(n,n+1,n+sides+1,n+1,n+sides+2,n+sides+1);}
    }
  }
  const g=new THREE.BufferGeometry();
  g.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));
  g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));
  g.setIndex(idx);g.computeVertexNormals();
  group.add(new THREE.Mesh(g,mat));A.tails.push(group);return group;
}
function sdEar(p,x,y,z,r,h,mat,rz=0){
  const ear=new THREE.Mesh(new THREE.ConeGeometry(r,h,12),mat);
  ear.position.set(x,y,z);ear.rotation.z=rz;p.add(ear);return ear;
}
function sdSnout(p,main,under,x=0,y=-.06,z=-.30,sx=1.0,sy=.78,sz=.92){
  const g=new THREE.Group();g.position.set(x,y,z);p.add(g);
  sdBall(g,.17,main,0,.02,.02,1.2*sx,.88*sy,1.0*sz);
  sdBall(g,.14,under||main,0,-.08,-.02,1.12*sx,.62*sy,.86*sz);
  return g;
}
function sdMuzzleStitch(p,x,y,z,w=.04,h=.015,col=0x6b5f59){
  const m=sdBall(p,.028,sdMat(col),x,y,z,w/.028,h/.028,1.0);return m;
}
function sdPlushWing(p,mat,s,x,y,z,scale=1){
  const g=new THREE.Group();g.position.set(x,y,z);g.rotation.z=s*.22;p.add(g);
  sdBall(g,.17,mat,s*.02,0,0,.85*scale,1.25*scale,.40*scale);
  sdBall(g,.12,mat,s*.10,-.07,.03,.75*scale,1.0*scale,.32*scale);
  sdBall(g,.10,mat,s*.14,-.15,.04,.65*scale,.85*scale,.28*scale);
  return g;
}
function sdBeak3D(p,mat,type='small'){
  const g=new THREE.Group();g.position.set(0,-.03,-.37);p.add(g);
  if(type==='flat'){
    sdBall(g,.09,mat,0,0,0,1.55,.55,.88);sdBall(g,.07,mat,0,-.04,-.04,1.28,.34,.70);
  }else if(type==='long'){
    sdBall(g,.08,mat,0,0,0,1.55,.55,.74);
  }else if(type==='hook'){
    const b=sdBall(g,.085,mat,0,0,0,1.22,.62,.86);b.rotation.x=-.16;sdBall(g,.05,mat,0,-.04,-.08,1.0,.42,.72);
  }else{
    sdBall(g,.075,mat,0,0,0,1.12,.70,.78);
  }
  return g;
}
function sdDragonBelly(A,mat){
  for(let i=0;i<4;i++)sdBall(A.bob,.08,mat,0,.74+i*.12,-.26+i*.01,1.65,.28,.35);
}
function sdTailTip(tail,mat,kind='tuft'){
  if(kind==='arrow'){
    sdBall(tail,.08,mat,.46,.22,.48,1.0,.45,1.0);
    sdCone(tail,.07,.18,mat,.50,.22,.56,0,.72);
  }else{
    sdBall(tail,.08,mat,.34,.30,.46,.9,1.2,.85);
    sdBall(tail,.06,mat,.41,.36,.48,.7,1.0,.75);
  }
}
function sdDorsalBumps(A,mat,count=4,baseY=1.13,baseZ=.16){for(let i=0;i<count;i++)sdBall(A.bob,.06+Math.sin((i+1)/(count+1)*PI)*.02,mat,0,baseY-i*.09,baseZ+i*.10,1.0,.74,.8);}
function sdTuneAnchors(A,cfg){
  A.headAnchorLift=0;A.accAnchorLift=0;
  if(cfg.type==='bird'){A.fit.y1=cfg.crane?1.02:.98;A.fit.neck=cfg.crane?1.32:1.15;A.fit.sleeve=[.08,1.02,-.08];}
  else if(cfg.type==='dino'){A.fit.y1=1.00;A.fit.neck=1.15;A.fit.sleeve=[.12,1.00,-.10];}
  else if(cfg.sp==='dragon'){A.fit.y1=1.02;A.fit.neck=1.18;A.fit.sleeve=[.10,1.04,-.10];}
  else if(cfg.type==='turtle'){A.fit.y1=.92;A.fit.neck=1.05;A.fit.sleeve=[.16,.92,-.06];}
  else if(cfg.sp==='cat'){A.fit.y1=1.06;A.fit.neck=1.20;}
  else if(cfg.sp==='dog'){A.fit.y1=1.08;A.fit.neck=1.22;}
  if(A.gat){
    if(cfg.type==='human'){A.gat.position.y=(A.headR||.445)*.96;A.gat.scale.set(.88,.88,.88);A.gat.rotation.x=-.06;A.headAnchorLift=.08;A.accAnchorLift=.05;} 
    else if(cfg.sp==='cat'||cfg.sp==='dog'){A.gat.position.y=(A.headR||.45)*.98;A.gat.scale.set(.90,.90,.90);} 
    else A.gat.visible=false;
  }
  if(A.book){A.book.position.y=A.bookY=cfg.crane?.82:(cfg.type==='bird'||cfg.type==='dino'||cfg.sp==='dragon')?.86:.91;}
  // Species adjustments must not reinstate old tight clothing radii / clipping.
  if(A.sd&&A.sd.rigMetrics){
    const M=A.sd.rigMetrics,P=A.sd.profile,body=A.parts.body;
    A.fit.y0=M.shirtBottomY;A.fit.y1=M.shirtTopY;
    A.fit.r0=.43*P.bodyWidth*body.scale.x;
    A.fit.r1=.38*P.bodyWidth*body.scale.x;
    A.fit.neck=M.bodyTopY-.07;
    A.fit.sleeve=[.13,1.02,-.15];
  }
}
function sdBuildHuman(A,cfg,col){
  const hair=sdMat(cfg.fem?0x49352e:0x70503a);
  const cap=new THREE.Mesh(new THREE.SphereGeometry(A.headR*1.04,32,20,0,PI*2,0,PI*.50),hair);
  cap.position.y=.11;cap.scale.set(1.05,.98,.97);A.head.add(cap);
  const bangY=.40,bangZ=-.17;
  [[-.27,bangY-.01,-.17,.10],[ -.14,bangY+.01,-.19,.096],[0,bangY+.02,-.205,.094],[.14,bangY+.01,-.19,.096],[.27,bangY-.01,-.17,.10]].forEach(([x,y,z,r])=>{
    sdBall(A.head,r,hair,x,y,z,1.02,.54,.72);
  });
  if(cfg.fem){for(const s of [-1,1]){
    sdBall(A.head,.14,hair,s*.39,-.10,.11,.52,1.46,.78);
  }}
  A.h=2.17;
}
function sdBuildCat(A,cfg,col){
  A.head.scale.set(1.08,.98,1.0);A.headS=[1.13,.98,1.0];
  for(const s of [-1,1]){
    sdEar(A.head,s*.31,.39,.02,.17,.30,col.main,-s*.18);
    sdEar(A.head,s*.31,.40,-.10,.10,.18,sdMat(0xf0c2bf),-s*.18);
    sdBall(A.head,.12,col.main,s*.31,-.06,.12,.9,1.15,.82); // cheek fluff silhouette
  }
  sdSnout(A.head,col.main,col.secondary,0,-.09,-.28,1.02,.78,.92);
  sdBall(A.bob,.12,col.secondary,0,.97,-.19,1.0,.7,.9);
  const tail=sdTail(A,[[0,0,0],[.18,.07,.16],[.31,.24,.14],[.29,.41,.10]],.10,col.main);sdTailTip(tail,col.main,'tuft');
  if(cfg.mask==='tuxedo')sdBall(A.head,.20,col.secondary,0,-.29,-.17,1.2,.47,.92);
}
function sdBuildDog(A,cfg,col){
  A.parts.body.scale.set(1.02,1.0,1.0);A.headS=[1.08,.98,1.10];
  const upright=cfg.ear==='dog'||cfg.ear==='big';
  for(const s of [-1,1]){
    if(upright)sdEar(A.head,s*.31,.38,.02,cfg.ear==='big'?.16:.13,cfg.ear==='big'?.36:.28,col.main,-s*.18);
    else {const flap=sdBall(A.head,.17,col.main,s*.38,.06,.03,.62,1.48,.86);flap.rotation.z=s*.36;}
    sdBall(A.head,.11,col.main,s*.30,-.02,.10,.9,1.0,.84);
  }
  sdSnout(A.head,col.main,col.secondary,0,-.05,-.31,1.08,.82,.98);
  if(cfg.fluffy||cfg.shaggy){for(let i=0;i<5;i++)sdBall(A.head,.115,col.main,(i-2)*.14,.36+(i%2)*.025,-.11,1,.65,.8);}
  const kind=cfg.tail==='curl'?'arrow':'tuft';
  if(cfg.tail==='curl'){const tail=sdTail(A,[[0,0,0],[.17,.10,.13],[.24,.29,.11],[.13,.38,.02]],.10,col.main);sdTailTip(tail,col.main,kind);}
  else if(cfg.tail==='puff'){const tail=sdTail(A,[[0,0,0],[.10,.08,.14],[.13,.23,.22]],.11,col.main);sdBall(tail,.12,col.main,.12,.24,.23,.92,1.08,.92);}
  else sdTail(A,[[0,0,0],[.12,.05,.16],[.20,.10,.24]],.10,col.main);
}
function sdBuildFrog(A,cfg,col){
  A.parts.body.scale.set(1.03,.90,.98);A.head.scale.set(1.10,.92,.98);A.headS=[1.18,.94,.98];
  for(const s of [-1,1]){
    sdBall(A.head,.16,col.main,s*.28,.34,.02,.95,1.18,.96);
    sdBall(A.head,.08,col.secondary,s*.19,-.01,-.28,.62,.42,.6);
  }
  A.arms.forEach((a,i)=>{a.g.position.x+=(i? .02:-.02);a.g.position.y=.88;});
  A.hop=true;A.waddle=.075;
}
function sdBuildTurtle(A,cfg,col){
  A.parts.body.scale.set(1.12,.86,1.02);A.head.position.set(0,1.40,-.06);A.headS=[1.02,.92,.96];
  const shell=sdMat(cfg.dark?0x5a7771:0x83ac82);
  const dome=new THREE.Mesh(new THREE.SphereGeometry(.48,32,20,0,PI*2,0,PI*.55),shell);
  dome.rotation.x=-PI/2;dome.position.set(0,.73,.40);dome.scale.set(1.08,.78,1.04);A.bob.add(dome);
  sdBall(A.bob,.23,col.secondary,0,.69,.38,1.05,.44,.88);
  if(cfg.dark){sdBall(A.head,.12,col.ivory,0,.36,.16);}
  sdSnout(A.head,col.main,col.secondary,0,-.03,-.24,.80,.58,.76);
  sdTail(A,[[0,0,0],[.04,.04,.10],[.08,.05,.24]],.07,col.main);
}
function sdBuildDinosaur(A,cfg,col){
  const species=cfg.species||'brachio';
  A.parts.body.scale.x*=1.04;
  sdBall(A.bob,.18,col.main,0,.70,.22,1.45,.92,1.08); // hips / weighted rear
  sdSnout(A.head,col.main,col.secondary,0,-.16,-.30,species==='brachio'?.84:1.02,.72,.93);
  // Deliberately no 3D nose or nostril geometry: facial marks are CanvasTexture only.
  sdDorsalBumps(A,col.secondary,species==='stego'?2:4,1.15,.13);
  if(species==='brachio'){
    A.parts.body.scale.set(1.15,.95,1.08);A.head.position.set(0,1.83,-.27);A.head.scale.set(.92,.96,.96);A.headS=[.94,.95,.96];
    sdBall(A.bob,.22,col.main,0,1.18,-.12,.95,1.8,.90);
    sdTube(A.bob,[[0,1.02,-.09],[0,1.30,-.13],[0,1.58,-.20],[0,1.78,-.23]],.165,col.main);
    sdBall(A.bob,.14,col.secondary,0,1.48,-.28,.62,2.0,.48);
    const tail=sdTail(A,[[0,0,0],[.18,.06,.18],[.32,.14,.44],[.38,.22,.72]],.14,col.main);
  }else if(species==='rex'){
    A.head.scale.set(1.15,1.00,1.18);A.headS=[1.15,1.0,1.18];
    for(const s of [-1,1]){const small=A.parts[s<0?'leftArm':'rightArm'];small.scale.set(.62,.66,.68);small.position.set(s*.26,.91,-.17);small.rotation.z=-s*.10;}
    const tail=sdTail(A,[[0,0,0],[.18,.05,.22],[.34,.12,.48],[.46,.18,.72]],.14,col.main);
    for(let k=0;k<4;k++)sdBall(A.bob,.06-k*.007,col.secondary,0,1.16-k*.09,.24+k*.11,1,.76,.82);
  }else if(species==='trike'){
    A.parts.body.scale.set(1.16,.94,1.06);A.head.scale.set(1.08,.98,1.14);A.headS=[1.12,1.0,1.14];
    sdBall(A.head,.44,col.secondary,0,.12,.24,1.35,1.03,.46);
    for(const s of [-1,1])sdCone(A.head,.09,.24,col.ivory,s*.26,.28,-.16,-s*.16);
    sdCone(A.head,.055,.16,col.ivory,0,-.01,-.45,0,-1.0);
    const tail=sdTail(A,[[0,0,0],[.14,.05,.16],[.25,.10,.34],[.24,.13,.52]],.11,col.main);
  }else if(species==='stego'){
    A.parts.body.scale.set(1.16,.95,1.08);A.head.scale.set(.98,.95,1.08);A.headS=[1.0,.98,1.08];
    for(let i=0;i<6;i++){const sc=Math.sin((i+1)/7*PI);sdCone(A.bob,.09+sc*.04,.14+sc*.14,col.secondary,(i%2?.08:-.08),1.18,-.16+i*.17,0,.15);}
    const tail=sdTail(A,[[0,0,0],[.18,.06,.18],[.32,.15,.42],[.42,.22,.64]],.12,col.main);for(let i=0;i<4;i++)sdCone(tail,.04,.18,col.secondary,.18+i*.07,.20,.48+i*.09,0,.52);
  }else if(species==='anky'){
    A.parts.body.scale.set(1.18,.90,1.10);A.head.scale.set(1.00,.94,1.08);A.headS=[1.02,.95,1.06];
    for(let j=0;j<3;j++)for(let k=-1;k<=1;k++)sdBall(A.bob,.10,col.secondary,k*.23,1.10-j*.09,.02+j*.20,1,.55,.85);
    const tail=sdTail(A,[[0,0,0],[.18,.02,.20],[.34,.08,.40],[.47,.13,.62]],.13,col.main);sdBall(tail,.20,col.secondary,.47,.13,.62,1.12,.88,.94);
  }
}
function sdBuildBird(A,cfg,col){
  const wingMat=cfg.peacock?sdMat(0x2f9b87):cfg.phoenix?sdMat(0xe57254):col.main;
  A.arms.forEach((a,idx)=>{
    a.wing=true;a.restZ=.05;
    // Existing groups remain for emotes/accessories, but the bipedal arm mesh is hidden.
    a.g.children.forEach(piece=>piece.visible=false);
    a.g.position.set(a.s*(cfg.crane?.29:.31),cfg.crane?.98:.91,.03);
    a.g.scale.set(.90,.92,.70);a.g.rotation.z=-a.s*.04;a.g.rotation.x=.15;
    sdPlushWing(a.g,wingMat,a.s,0,-.08,.035,cfg.crane?.80:(cfg.duck?1.12:.98));
  });
  if(cfg.crane){
    A.parts.body.scale.set(.86,.98,.92);A.head.position.set(0,1.75,-.08);A.headS=[.98,1.02,.94];
    sdTube(A.bob,[[0,1.00,-.06],[0,1.25,-.08],[0,1.50,-.10],[0,1.67,-.10]],.095,col.main);sdBeak3D(A.head,sdMat(cfg.beak||0x4d4742),'long');sdBall(A.head,.095,sdMat(cfg.crest||0xcc4344),0,.38,-.05,1,.50,1);
    for(const s of [-1,1]){A.parts[s<0?'leftLeg':'rightLeg'].scale.y=1.18;A.parts[s<0?'leftLeg':'rightLeg'].position.y=.36;}
    sdTail(A,[[0,0,0],[0,.08,.18],[0,.18,.36]],.055,col.main);
  } else if(cfg.duck){
    A.parts.body.scale.set(1.10,.90,1.06);A.head.scale.set(1.08,.96,1.02);A.headS=[1.12,.95,1.02];sdBeak3D(A.head,sdMat(cfg.beak||0xef8a2c),'flat');
    for(const s of [-1,1])sdBall(A.parts[s<0?'leftLeg':'rightLeg'],.06,sdMat(cfg.lc||0xf28a2a),0,-.38,-.08,1.55,.28,1.10);
    sdTail(A,[[0,0,0],[0,.09,.16],[0,.14,.25]],.08,col.main);
  } else if(cfg.mandarin){
    A.parts.body.scale.set(1.08,.93,1.08);sdBeak3D(A.head,sdMat(cfg.beak||0xde4f33),'small');
    for(const s of [-1,1]){sdBall(A.bob,.15,sdMat(0xe39755),s*.34,.83,.10,.9,.8,.63);}sdTail(A,[[0,0,0],[0,.08,.16],[0,.17,.30]],.08,col.main);
  } else if(cfg.peacock){
    sdBeak3D(A.head,sdMat(cfg.beak||0x80816a),'small');
    const fan=new THREE.Group();fan.position.set(0,.86,.34);fan.name='peacockTail';A.bob.add(fan);
    for(let i=-4;i<=4;i++){const f=sdBall(fan,.12,sdMat(i%2?0x4bb196:0x79bc8f),i*.11,.47-Math.abs(i)*.037,.12,.89,2.9,.45);f.rotation.z=-i*.14;sdBall(fan,.061,sdMat(0x4d83a8),i*.118,.80-Math.abs(i)*.047,.035,1,.72,.47);}for(let i=-1;i<=1;i++)sdBall(A.head,.04,sdMat(0x3d7eac),i*.07,.48,.02,1,1.7,.95);
  } else if(cfg.phoenix){
    sdBeak3D(A.head,sdMat(cfg.beak||0xf39a2f),'hook');
    for(let i=-2;i<=2;i++)sdCone(A.head,.065,.24,sdMat(i%2?0xf3af61:0xdc705d),i*.12,.41,.07,i*.15);
    const tail=new THREE.Group();tail.name='phoenixPlumes';tail.position.set(0,.74,.34);A.bob.add(tail);A.tails.push(tail);for(let i=-2;i<=2;i++)sdTube(tail,[[i*.08,0,0],[i*.12,.20,.22],[i*.16,.32,.46]],.043,sdMat(i%2?0xedb16e:0xcf6c61));
  } else {
    A.parts.body.scale.set(.92,.84,.92);A.headS=[1.02,.98,.96];sdBeak3D(A.head,sdMat(0xc8b18a),'small');sdTail(A,[[0,0,0],[0,.07,.14],[0,.12,.22]],.06,col.main);
  }
}
function sdBuildDragon(A,cfg,col){
  const east=cfg.dragonStyle==='east'||(!cfg.dragonStyle&&cfg.sp==='dragon');
  const gold=sdMat(0xf2c64e),horn=sdMat(east?0xf7e7b4:0x6b5148),dark=sdMat(0x4a3a3a);
  A.parts.body.scale.set(east?.96:1.04,east?.98:.98,1.02);
  if(east){
    /* 동양용: 길쭉한 주둥이, 늘어진 긴 수염, 사슴뿔, 갈기, 여의주 */
    A.head.scale.set(1.0,.98,1.12);A.headS=[1.0,.98,1.12];
    sdSnout(A.head,col.main,col.secondary,0,-.13,-.33,.92,.66,1.22);
    for(const s of [-1,1]){
      sdTube(A.head,[[s*.13,-.07,-.50],[s*.24,-.12,-.54],[s*.38,-.08,-.50],[s*.52,-.20,-.40],[s*.58,-.42,-.30],[s*.54,-.60,-.24]],.02,gold);
      sdTube(A.head,[[s*.15,.30,.0],[s*.22,.50,.06],[s*.24,.72,.16]],.034,horn);
      sdTube(A.head,[[s*.21,.48,.05],[s*.36,.58,.08],[s*.42,.66,.04]],.024,horn);
      sdTube(A.head,[[s*.23,.64,.13],[s*.12,.76,.16]],.02,horn);
      sdBall(A.head,.035,sdMat(0x3a2a2a),s*.07,-.10,-.60,1,.8,1);
    }
    for(let i=0;i<7;i++){const a=(i-3)/3;const m=sdCone(A.head,.06,.26,col.secondary,a*.34,.24-Math.abs(a)*.08,.30+Math.abs(a)*.02,a*.6,-.9);m.scale.set(1,1,.6);}
    sdTube(A.bob,[[0,1.01,-.06],[0,1.20,-.08],[0,1.38,-.11],[0,1.54,-.12]],.11,col.main);
    for(let i=0;i<6;i++)sdCone(A.bob,.05,.16,col.secondary,0,1.30-i*.08,.10+i*.08,0,.9);
    const arm=A.arms&&A.arms[1]&&A.arms[1].g||A.bob;const pearl=sdBall(arm,.09,sdMat(0xfff4c8,{emissive:new THREE.Color(0xffd36a),emissiveIntensity:.55}),0,-.36,-.10);pearl.name='dragonPearl';A.pearl=pearl;
    const tail=sdTail(A,[[0,0,0],[.22,.08,.18],[.42,.24,.34],[.36,.40,.56],[.18,.48,.66]],.10,col.main);sdTailTip(tail,col.secondary,'tuft');
  }else{
    /* 서양용: 뒤로 휜 큰 뿔, 머리·등 가시, 콧구멍, 박쥐 날개 */
    A.head.scale.set(1.14,.98,1.08);A.headS=[1.14,.98,1.08];
    sdSnout(A.head,col.main,col.secondary,0,-.14,-.27,1.05,.74,.86);
    for(const s of [-1,1]){
      sdCone(A.head,.11,.5,horn,s*.27,.44,.12,-s*.42,.9);
      sdCone(A.head,.05,.18,horn,s*.40,.12,.06,-s*1.2,0);
    }
    for(let i=0;i<3;i++)sdCone(A.head,.05-i*.008,.16,col.secondary,0,.43-i*.07,.12+i*.13,0,.7);
    for(let i=0;i<5;i++)sdCone(A.bob,.06,.18-i*.015,col.secondary,0,1.22-i*.11,.18+i*.10,0,.8);
    sdDragonBelly(A,col.secondary);
    const wings=new THREE.Group();wings.name='staticWings';wings.position.set(0,1.02,.26);A.bob.add(wings);
    const memb=sdMat(new THREE.Color(cfg.b||0xffd9a8).getHex(),{side:THREE.DoubleSide});
    for(const s of [-1,1]){
      const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(.62,.52);sh.lineTo(.78,.08);sh.quadraticCurveTo(.66,.06,.6,-.06);sh.quadraticCurveTo(.48,-.02,.42,-.14);sh.quadraticCurveTo(.30,-.06,.22,-.18);sh.quadraticCurveTo(.12,-.08,0,0);
      const wg=new THREE.Group();wg.scale.set(s,1,1);wg.rotation.y=s*.55;wings.add(wg);
      wg.add(new THREE.Mesh(new THREE.ShapeGeometry(sh),memb));
      sdTube(wg,[[0,0,.01],[.32,.30,.01],[.62,.52,.01],[.78,.08,.01]],.028,col.main);
    }
    A.staticWings=wings;
    const tail=sdTail(A,[[0,0,0],[.18,.02,.17],[.32,.10,.34],[.46,.19,.56]],.12,col.main);sdTailTip(tail,col.secondary,'arrow');
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

/* Compatibility: same 28 AVATARS IDs, makeAvatar/animateAvatar/faceTick,
   A.head/A.parts/A.arms/A.legs/A.tail/A.fit and A.setFace. */
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
  sdReconcileRig(A,cfg);                   // joints, neck gap and outfit envelope
  attachSDFace(A,cfg);                    // phase 1 - all facial features are texture only
  // Keep hats, bag, and book anchors used in wardrobe/emotes.
  A.gat=makeGat(A.head,A.headR*.99,.8,-.10);
  if(cfg.noGat||cfg.type==='dino'||cfg.type==='bird')A.gat.visible=false;
  avatarBook(A,cfg.species==='brachio'?1.08:.91,-.45);
  sdTuneAnchors(A,cfg);
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
      a.g.rotation.x=reading?1.25:.72;a.g.rotation.z=a.s*(reading?.08:(a.restZ||.31));
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
    a.g.rotation.z=a.s*(a.wing?.055:(a.restZ||.31))+a.s*Math.sin(t*2)*(a.wing?.005:.025);
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
