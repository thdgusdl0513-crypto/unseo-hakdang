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
function faceTex(cfg,expr){if(cfg.dragonStyle)return dragonFaceArt(cfg,expr);const key=cfg.id+'|'+expr;if(FACE_CACHE[key])return FACE_CACHE[key];
  const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.lineCap=g.lineJoin='round';
  const K=cfg.type==='human'?'human':cfg.type==='beast'?cfg.sp:cfg.type==='pet'?cfg.k:cfg.type;
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
function dragonFaceArt(cfg,expr){
  const key='new-dragon:'+cfg.id+'|'+expr;
  if(FACE_CACHE[key])return FACE_CACHE[key];
  const c=document.createElement('canvas'); c.width=c.height=256;
  const g=c.getContext('2d');g.lineCap='round';g.lineJoin='round';
  const west=cfg.dragonStyle==='west', ey=115, ex=west?43:38;
  g.strokeStyle='#403038';g.fillStyle='#403038';g.lineWidth=6;
  const cheeks=(x)=>{g.save();g.globalAlpha=.72;g.fillStyle=west?'#f4a6a9':'#ffb4b7';g.beginPath();g.ellipse(x,148,16,9,0,0,Math.PI*2);g.fill();g.restore();};
  cheeks(128-72);cheeks(128+72);
  [-1,1].forEach(s=>{const x=128+s*ex;
    if(['smile','joy','blink'].includes(expr)){
      g.beginPath();g.moveTo(x-11,ey+2);g.quadraticCurveTo(x,ey-11,x+11,ey+2);g.stroke();
      if(expr==='joy'){g.beginPath();g.moveTo(x-7,ey+11);g.lineTo(x+7,ey+11);g.stroke();}
    }else if(expr==='sleepy'){
      g.beginPath();g.moveTo(x-9,ey+2);g.quadraticCurveTo(x,ey+7,x+9,ey+2);g.stroke();
    }else{
      // 둥글고 작지만 또렷한 점눈. 부리는 없음.
      g.beginPath();g.ellipse(x,ey,expr==='wow'?10:8,expr==='wow'?12:10,0,0,Math.PI*2);g.fill();
      g.fillStyle='#fff';g.beginPath();g.arc(x+3,ey-4,2.8,0,Math.PI*2);g.fill();g.fillStyle='#403038';
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
  const nose=std(0x5a5053),claw=std(0xfff4e6);
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
    A.face=faceDecal(head,.34,cfg,1.16,1.04,1.05);
    // 뾰족한 부리가 아니라 코끝이 둥글고 넓은 포유류형 주둥이.
    dragonSphere(head,.19,M,0,-.14,-.31,1.03,.68,1.25);
    dragonSphere(head,.155,P,0,-.18,-.43,1.08,.55,.82);
    [-1,1].forEach(s=>{
      dragonSphere(head,.028,nose,s*.082,-.14,-.555,.72,.75,.8);
      dragonSphere(head,.087,M,s*.29,-.12,-.17,1,.73,1);
      // 삐죽하지 않은 회색 뿔 2쌍
      const horn0=new THREE.Mesh(new THREE.ConeGeometry(.11,.32,12),horn);horn0.position.set(s*.21,.31,.06);horn0.rotation.z=-s*.35;horn0.rotation.x=-.12;head.add(horn0);
      const horn1=new THREE.Mesh(new THREE.ConeGeometry(.06,.18,10),hornLight);horn1.position.set(s*.3,.21,.13);horn1.rotation.z=-s*.65;head.add(horn1);
    });
    // 이빨 대신 작은 U자 미소.
    dragonLine(head,[[-.095,-.224,-.555],[-.045,-.25,-.58],[0,-.255,-.587],[.05,-.25,-.58],[.095,-.224,-.555]],.009,ink);
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
    A.face=faceDecal(head,.275,cfg,1.02,1.0,.94);
    dragonSphere(head,.14,M,0,-.13,-.24,1.05,.66,1.32);
    dragonSphere(head,.13,P,0,-.164,-.32,1.02,.54,.95);
    [-1,1].forEach(s=>{
      dragonSphere(head,.018,nose,s*.06,-.125,-.445,.9,.9,.85);
      dragonSphere(head,.065,M,s*.21,-.08,-.115,1,.75,1);
      // 짧고 가지 친 부드러운 뿔; 귀의 소용돌이.
      dragonLine(head,[[s*.17,.22,.04],[s*.22,.34,.06],[s*.29,.41,.07]],.021,horn);
      dragonLine(head,[[s*.22,.32,.06],[s*.14,.38,.08]],.015,hornLight);
      const spiral=new THREE.Group();spiral.position.set(s*.24,.06,.09);head.add(spiral);
      dragonLine(spiral,[[0,0,0],[s*.08,.05,-.005],[s*.11,.12,0],[s*.035,.13,.005],[s*.04,.07,.01]],.025,hornLight);
      // 꼬리털이 아니라 가늘고 둥글게 뻗는 용 수염.
      dragonLine(head,[[s*.13,-.16,-.27],[s*.28,-.22,-.27],[s*.4,-.19,-.24]],.012,hornLight);
    });
    dragonLine(head,[[-.075,-.21,-.445],[-.035,-.236,-.45],[0,-.24,-.46],[.036,-.236,-.45],[.075,-.21,-.445]],.008,ink);
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
  A.setFace=function(expr){if(!A.face||A.expr===expr)return;A.expr=expr;A.face.material.map=faceTex(cfg,expr);};
  return A;
}

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
  else if(cfg.dragonStyle){makeDragonAvatar(A,cfg,look);}
  else if(cfg.type==='beast'){const bodyHex=cfg.dragonColor?lookPick(look,'av',cfg.c):cfg.c, bellyHex=cfg.dragonColor?lookPick(look,'av2',cfg.b):cfg.b, vestHex=cfg.dragonColor?bodyHex:cfg.vest; const F=fur(bodyHex),Bl=fur(bellyHex);
    [-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.16,.3,0);B.add(g);sph(g,.12,F,0,-.1,0,1,1.25,1);sph(g,.12,Bl,0,-.24,-.05,1,.55,1.35);const pad=new THREE.Mesh(new THREE.CircleGeometry(.05,10),PINKPAD);pad.position.set(0,-.25,.06);pad.rotation.x=PI/2.2;g.add(pad);A.legs.push({g,ph:i?PI:0});});
    sph(B,.35,F,0,.56,0,1,1.05,.92);sph(B,.25,Bl,0,.54,-.15,1,1.15,.7);
    const n0=B.children.length;const vest=new THREE.Mesh(new THREE.CylinderGeometry(.31,.37,.34,24,1,true,PI+.55,PI*2-1.1),std(vestHex,{side:THREE.DoubleSide,emissive:new THREE.Color(vestHex).multiplyScalar(.15)}));vest.position.y=.68;B.add(vest);
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
    if(cfg.dragonStyle==='east'){const whisk=glowMat(0xf5e7cf),hornM=glowMat(0xe8c98a),mane=glowMat(0x7e1822);[-1,1].forEach(s=>{const w1=box(head,.012,.012,.34,whisk,s*.26,-.02,-.22);w1.rotation.y=-s*.55;w1.rotation.z=s*.18;const w2=box(head,.01,.01,.26,whisk,s*.24,.06,-.18);w2.rotation.y=-s*.85;w2.rotation.z=s*.3;const hb=new THREE.Mesh(new THREE.ConeGeometry(.07,.24,6),hornM);hb.position.set(s*.17,.28,-.02);hb.rotation.z=-s*.35;hb.rotation.x=.15;head.add(hb);});for(let i=0;i<6;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(.045,.16,5),mane);c.position.set(0,.28-i*.12,.18+i*.06);c.rotation.x=.9;head.add(c);}}
    else if(cfg.dragonStyle==='west'){const hornM=glowMat(0xd9c18a),wingM=fur(bodyHex),memM=fur(bellyHex),spk=glowMat(0xf0d4a8);[-1,1].forEach(s=>{const h1=new THREE.Mesh(new THREE.ConeGeometry(.08,.22,6),hornM);h1.position.set(s*.14,.24,.02);h1.rotation.z=-s*.25;head.add(h1);const h2=new THREE.Mesh(new THREE.ConeGeometry(.06,.16,6),hornM);h2.position.set(s*.23,.18,-.06);h2.rotation.z=-s*.55;head.add(h2);const wg=new THREE.Group();wg.position.set(s*.34,.92,.14);wg.rotation.set(.08,0,-s*.35);B.add(wg);sph(wg,.14,wingM,0,.08,0,1,.9,1.5);sph(wg,.12,wingM,s*.04,.34,.02,1,.75,1.2);const mem=box(wg,.2,.34,.03,memM,s*.02,.2,.02);mem.rotation.z=s*.2;});for(let i=0;i<5;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(.05,.16,5),spk);c.position.set(0,.2-i*.12,.2+i*.04);c.rotation.x=.9;head.add(c);}}
    if(cfg.tiger){const S=std(0x3a3036);[[.35,.68],[.33,.52],[.3,.36]].forEach((p,i)=>[-1,1].forEach(s=>{const m=sph(B,.06,S,s*p[0],p[1],.06,.35,.55,2.2);m.rotation.y=s*.4;}));[.68,.52].forEach(y=>{const m=sph(B,.05,S,0,y,.32,2.2,.4,.4);});}
    if(cfg.fluffy){for(let i=0;i<8;i++){const a=i/8*PI*2;sph(head,.12,F,Math.cos(a)*.32,.24+Math.sin(i)*.04,Math.sin(a)*.25);}for(let i=0;i<6;i++){const a=i/6*PI*2;sph(B,.12,F,Math.cos(a)*.3,.45,Math.sin(a)*.26);}sph(head,.07,std(0xff8fb0),.24,.32,-.12);}
    if(cfg.shaggy){const sf=fur(0xf6f3ec),sg=fur(0xe2ddd2);for(let i=0;i<22;i++){const a=i/22*PI*2;if(Math.sin(a)<-.55)continue;const m=sph(head,.1,i%3?sf:sg,Math.cos(a)*R(.34,.44),R(-.2,.2),Math.sin(a)*R(.3,.38),1,R(2,2.8),1);m.rotation.z=R(-.2,.2);}
      [-.2,-.07,.07,.2].forEach(x=>{const m=sph(head,.075,sf,x,.24,-.37,1,2.2,.7);m.rotation.x=.35;});
      for(let i=0;i<18;i++){const a=i/18*PI*2;sph(B,.11,i%3?sf:sg,Math.cos(a)*.3,R(.3,.6),Math.sin(a)*.27,1,2.6,1);}}
    if(cfg.dragonStyle){head.scale.set(1.12,1.04,1.06); const sn=sph(head,.14,Bl,0,-.02,-.28,1.18,.72,1.02); [-1,1].forEach(s=>{sph(head,.06,Bl,s*.17,.02,-.12,1,.72,.72);}); if(cfg.dragonStyle==='east'){const maneCol=glowMat(0xb43d52); for(let i=0;i<4;i++){const puff=sph(B,.08,maneCol,0,.92-i*.14,.18+i*.04,1,1.1,1);} } else {const bellyP=sph(B,.18,Bl,0,.54,-.16,1,1.05,.65); [-1,1].forEach(s=>{const ear=sph(head,.11,F,s*.24,.24,-.03,1,.9,1.1); ear.rotation.z=-s*.28;}); }}
    const tg=new THREE.Group();tg.position.set(0,.42,.3);B.add(tg);A.tails.push(tg);
    if(cfg.tail==='long'){tg.rotation.x=.4;sph(tg,.07,F,0,.12,.04,1,2.4,1);sph(tg,.065,F,0,.34,.02,1,1.4,1);}
    else if(cfg.tail==='curl'){const t=new THREE.Mesh(new THREE.TorusGeometry(.13,.07,8,16,PI*1.6),F);t.rotation.y=PI/2;t.position.set(0,.2,.04);tg.add(t);}
    else if(cfg.tail==='stub'){sph(tg,.1,F,0,.02,.04);}
    else if(cfg.tail==='dragon'){tg.rotation.x=.2;for(let i=0;i<7;i++){const r=.12-i*.012;sph(tg,r,i%2?F:fur(0x358aa2),0,.05+i*.08+Math.sin(i*.8)*.02,.06+i*.1-i*i*.008);}const tuft=std(0xe6b850,{emissive:0x3a2a08});for(let k=0;k<4;k++)sph(tg,.06,tuft,R(-.05,.05),.62+R(-.04,.04),.5+R(-.04,.04));}
    else sph(tg,.17,F,0,.1,.02);
    if(cfg.tiger&&cfg.tail==='long'){const S=std(0x3a3036);[.18,.3,.42].forEach(y=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.068,.016,6,14),S);r.rotation.x=PI/2;r.position.set(0,y,.03);tg.add(r);});}
    A.gat=cfg.noGat?null:makeGat(head,.37,.9,-.12);avatarBook(A,.78,-.4);A.h=2.0;A.waddle=.08;
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
  else{ // bird (오목눈이/학/오리/원앙/공작/주작)
    const ph=cfg.phoenix;const wh=ph?std(0xe4553c,{emissive:0x3a0c06}):cfg.bc!=null?std(cfg.bc,{emissive:new THREE.Color(cfg.bc).multiplyScalar(.14)}):std(0xfbf8f2,{emissive:0x4a4844}),br=ph?std(0xf2b040,{emissive:0x3a2406}):cfg.lc!=null?std(cfg.lc,{emissive:new THREE.Color(cfg.lc).multiplyScalar(.12)}):std(0x7a5a46,{emissive:0x140c08});
    [-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.14,.22,-.02);B.add(g);cyl(g,.022,.022,.2,5,br,0,-.08,0);[-.4,0,.4].forEach(a=>{const t=box(g,.02,.02,.09,br,Math.sin(a)*.04,-.18,-.04);t.rotation.y=a;});A.legs.push({g,ph:i?PI:0});});
    const body=sph(B,.38,wh,0,.52,0,1.05,1,.92); A.body=body; if(cfg.duck){body.scale.set(1.22,1.08,1.04);body.position.y=.48;} else if(cfg.crane){body.scale.set(.82,1.18,.82);body.position.y=.58;} else if(cfg.mandarin){body.scale.set(1.06,1.0,.95);body.position.y=.5;} else if(cfg.peacock){body.scale.set(.92,1.0,.86);body.position.y=.54;} else if(ph){body.scale.set(.96,1.08,.86);body.position.y=.54;}
    const head=new THREE.Group();head.position.y=.68;B.add(head);A.head=head;sph(head,.52,wh,0,0,0,1,.95,.95);A.face=faceDecal(head,.52,cfg,1,.95,.95,0);
    if(cfg.duck){head.position.y=.62; head.scale.set(.92,.92,.92);} else if(cfg.crane){head.position.y=.94; head.scale.set(.82,.82,.82);} else if(cfg.mandarin){head.position.y=.7; head.scale.set(.96,.96,.96);} else if(cfg.peacock){head.position.y=.78; head.scale.set(.9,.96,.92);} else if(ph){head.position.y=.8; head.scale.set(.92,.96,.92);}
    for(let i=0;i<14;i++){const a=rnd()*PI*2,y=R(-.35,.2);sph(head,.12,wh,Math.cos(a)*.42,y,Math.sin(a)*.4*(Math.sin(a)<0?.0:.9)+(Math.sin(a)<0?.1:0));}
    [-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.46,.78,.04);if(cfg.duck)g.position.set(s*.38,.62,.04); else if(cfg.crane)g.position.set(s*.42,.86,.02); else if(cfg.peacock)g.position.set(s*.4,.72,.02); B.add(g); const w1=sph(g,.2,wh,s*.12,-.04,0,1.2,.5,.85); w1.rotation.z=s*.5; const w2=sph(g,.1,br,s*.04,.02,.02,1.2,.5,.8); w2.rotation.z=s*.6; if(cfg.duck){w1.scale.set(1.15,.62,.95); w2.scale.set(1.05,.58,.85);} if(cfg.crane){w1.scale.set(1.35,.4,.85); w2.scale.set(1.3,.35,.8);} if(cfg.peacock){w1.scale.set(1.0,.55,.8);} A.arms.push({g,ph:0,s,wing:true});});
    if(cfg.crane){const neck=sph(B,.18,wh,0,.9,-.08,.75,1.9,.75);neck.rotation.x=.08;sph(head,.09,std(cfg.crest||0xcf2e2e,{emissive:0x4a0808}),0,.48,-.06,1,.42,1);}
    if(cfg.duck){sph(head,.06,wh,-.16,.16,-.02,1,1.15,.8);sph(head,.06,wh,.16,.16,-.02,1,1.15,.8);}
    if(cfg.mandarin){const pu=std(0x6b3d86,{emissive:0x1b0d25}),or=std(0xe7832b,{emissive:0x3a1406}),bl=std(0x1f3d87,{emissive:0x08102a});sph(B,.24,pu,0,.48,-.18,1.1,.7,.45);[-1,1].forEach(s=>{const sail=new THREE.Mesh(new THREE.ConeGeometry(.11,.27,4),or);sail.position.set(s*.34,.93,.18);sail.rotation.z=-s*.22;B.add(sail);});sph(head,.28,or,0,.22,.22,1,.55,1.1);sph(head,.18,bl,0,.04,.34,1,.5,1);}
    if(cfg.peacock){const crest=std(0x1d56a5,{emissive:0x081733});[-.1,0,.1].forEach((x,i)=>{cyl(head,.008,.008,.22,4,crest,x,.58,.02).rotation.z=-x*1.6;sph(head,.038,crest,x*1.6,.72,.02);});}
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
    if(cfg.crane){A.legs.forEach(l=>{l.g.position.y=.34; l.g.scale.y=1.45;});} else if(cfg.duck){A.legs.forEach(l=>{l.g.position.y=.18; l.g.scale.y=.82; l.g.scale.x=1.18;});} else if(cfg.mandarin){A.legs.forEach(l=>{l.g.position.y=.21;});} else if(cfg.peacock){A.legs.forEach(l=>{l.g.position.y=.24; l.g.scale.y=1.05;});} else if(ph){A.legs.forEach(l=>{l.g.position.y=.25; l.g.scale.y=1.12;});}
    const n0=B.children.length;const col=new THREE.Mesh(new THREE.TorusGeometry(.26,.04,6,20),IVORY);col.rotation.x=PI/2;col.position.y=.3;col.scale.set(1.3,1.3,1);B.add(col);
    A.garb=B.children.slice(n0);A.gat=makeGat(head,.42,.78,-.1); if(cfg.crane)A.gat.position.y=.34; if(cfg.duck)A.gat.position.y=.36; A.hop=true;avatarBook(A,.5,-.62);A.h=cfg.crane?2.08:(cfg.duck?1.82:(cfg.peacock?1.92:1.95));
    A.fit={y0:.24,y1:.66,r1:.55,r0:.4,neck:.62,bird:true,cy:.68,br:.54};A.headR=.52;A.headS=[1,.95,.95];}
  A.setFace=function(expr){if(!A.face||A.expr===expr)return;A.expr=expr;A.face.material.map=faceTex(cfg,expr);};
  if(typeof applyLook==='function'&&look)applyLook(A,look);
  return A;}
function animateAvatar(A,ph,amt,t,sit){const B=A.bob;
  if(sit){B.position.y=Math.sin(t*1.6)*.01;B.rotation.z=0;A.legs.forEach(l=>l.g.rotation.x=A.cfg.type==='bird'?0:PI/2.1);const rd=A.reading&&A.book&&A.book.visible;
    A.arms.forEach(a=>{if(a.wing){if(a.noFlap){a.g.rotation.order='YXZ';a.g.rotation.y=0;a.g.rotation.z=a.baseRot||0;a.g.rotation.x=.02;return;}a.g.rotation.order='YXZ';a.g.rotation.y=rd?a.s*1.2+Math.sin(t*.8+a.s)*.04:0;a.g.rotation.z=rd?-a.s*.35:0;a.g.rotation.x=rd?.25:0;return;}a.g.rotation.x=rd?1.32+Math.sin(t*.8+a.s)*.03:1.0;a.g.rotation.z=a.s*(rd?.08:.3);});if(A.head){A.head.rotation.x=rd?.34+Math.sin(t*.5)*.03:.12;A.head.rotation.y=rd?Math.sin(t*.35)*.12:0;}
    if(A.book){if(rd){A.book.position.y=A.bookY+.14;A.book.position.z=A.bookZ-.02;A.book.rotation.x=-1.0+Math.sin(t*.7)*.03;const k=(t%5)/5;if(A.page){A.pageM.visible=k<.22;A.page.rotation.z=k<.22?k/.22*PI:0;}}else{A.book.position.y=A.bookY;A.book.position.z=A.bookZ;A.book.rotation.x=-.5;if(A.pageM)A.pageM.visible=false;}}return;}
  if(A.head)A.head.rotation.y=0;
  const hopY=A.hop?Math.abs(Math.sin(ph))*.2*amt:Math.abs(Math.sin(ph))*.05*amt;B.position.y=hopY+Math.sin(t*2)*.012;B.rotation.z=Math.sin(ph)*A.waddle*amt;
  A.legs.forEach(l=>l.g.rotation.x=Math.sin(ph+l.ph)*.6*amt);
  A.arms.forEach(a=>{if(a.wing){if(a.noFlap){a.g.rotation.y=0;a.g.rotation.x=.02;a.g.rotation.z=a.baseRot||0;return;}a.g.rotation.y=0;a.g.rotation.x=0;a.g.rotation.z=a.s*(Math.abs(Math.sin(ph*1.6))*.8*amt+Math.sin(t*2.5)*.06);return;}a.g.rotation.x=Math.sin(ph+a.ph)*.6*amt;a.g.rotation.z=a.s*(A.cfg.type==='human'?.18:.18);});
  A.tails.forEach((tg,i)=>{tg.rotation.z=Math.sin(t*3+i)*.25;});
  if(A.skirt)A.skirt.rotation.z=Math.sin(ph)*.04*amt;
  if(A.head){A.head.rotation.x=Math.sin(t*1.3)*.03;A.head.rotation.z=Math.sin(t*.9)*.05*(1-amt);}}
function faceTick(A,now,want){if(!A.face)return;if(now>A.blinkAt){if(now<A.blinkAt+130){if(want==='base'||want==='wow'||want==='joy'){A.setFace('blink');return;}}else A.blinkAt=now+2500+Math.random()*3500;}A.setFace(want);}
