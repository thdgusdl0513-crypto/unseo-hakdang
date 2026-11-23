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
 {id:'dino',name:'브라키오사우루스',emo:'🦕',type:'dino',species:'brachio',c:0x6cc27c,b:0xe4f3b8,vest:0x6f9a7a},
 {id:'dino-triceratops',name:'트리케라톱스',emo:'🦕',type:'dino',species:'trike',c:0x5cb8a2,b:0xf2c46a,vest:0xc4584a},
 {id:'dino-stegosaurus',name:'스테고사우루스',emo:'🦕',type:'dino',species:'stego',c:0xe6a85a,b:0xd8603e,vest:0x5a7aa8},
 {id:'dino-tyrannosaurus',name:'티라노사우루스',emo:'🦖',type:'dino',species:'rex',c:0x62b27e,b:0xeee0a4,vest:0xb8625a},
 {id:'dino-ankylosaurus',name:'안킬로사우루스',emo:'🦕',type:'dino',species:'anky',c:0xa8bf5c,b:0x8a6a44,vest:0x8aa86a},
 {id:'western-dragon',name:'서양용',emo:'🐲',type:'beast',sp:'dragon',c:0xd98593,b:0xf6d2b8,ear:'none',horn:'smallAntler',tail:'chub',vest:0xe08a7a,dragonColor:true,dragonStyle:'west',god:true},
 {id:'cheongryong',name:'청룡 · 사방신',emo:'🐉',type:'beast',sp:'dragon',c:0x3f93ad,b:0xf4e8bc,ear:'none',horn:'antler',tail:'dragon',vest:0x2a4a7a,god:true},
 {id:'baekho',name:'백호 · 사방신',emo:'🐯',type:'beast',sp:'cat',c:0xfbf8f2,b:0xffffff,ear:'round',eye:'#5aa0d8',tail:'long',mask:'tiger',tiger:true,vest:0x6a7a8a,god:true},
 {id:'jujak',name:'주작 · 사방신',emo:'🐦‍🔥',type:'bird',phoenix:true,beak:'#d89a2a',god:true},
 {id:'hyeonmu',name:'현무 · 사방신',emo:'🐢',type:'turtle',dark:true,god:true}];
const AVMAP=Object.fromEntries(AVATARS.map(a=>[a.id,a]));
const FACES=[['base','🙂','기본'],['smile','😊','웃음'],['joy','🤩','신남'],['wow','😮','놀람'],['sleepy','😪','졸림'],['shy','😳','부끄'],['focus','📖','집중']];

/* ---------- drawn faces ---------- */
function lookPick(look,key,def){try{const i=look&&look.c&&look.c[key];return i&&typeof PALETTE!=='undefined'&&PALETTE[i]?PALETTE[i][1]:def;}catch(e){return def;}}
const AV_GRAD=(()=>{const v=[66,80,96,112,128,144,160,176,192,206,218,228];const d=new Uint8Array(v.length*3);v.forEach((x,i)=>d.set([x,x,x],i*3));const t=new THREE.DataTexture(d,v.length,1,THREE.RGBFormat);t.minFilter=t.magFilter=THREE.LinearFilter;t.generateMipmaps=false;t.needsUpdate=true;return t;})();
const AV_SOFT=new Map();
function softenAvatar(A){A.root.traverse(o=>{const m=o.material;if(!m||!m.isMeshToonMaterial||m.gradientMap===AV_GRAD||m===GATM||m.transparent&&m.opacity<.95)return;let c=AV_SOFT.get(m);if(!c){c=m.clone();c.gradientMap=AV_GRAD;c.needsUpdate=true;AV_SOFT.set(m,c);AV_SOFT.set(c,c);}o.material=c;});}
const FACE_CACHE={};
function faceTex(cfg,expr){const key=cfg.id+'|'+expr;if(FACE_CACHE[key])return FACE_CACHE[key];
  const c=document.createElement('canvas');c.width=c.height=256;const g=c.getContext('2d');g.lineCap=g.lineJoin='round';
  const K=cfg.type==='human'?'human':cfg.type==='dino'?'dragon':cfg.type==='beast'?cfg.sp:cfg.type==='pet'?cfg.k:cfg.type;
  const ink=K==='human'?'#2a1c16':'#33241c';const big=K==='human';
  const ex={human:40,cat:36,dog:36,frog:46,turtle:34,bird:24,dragon:38,totem:44,goblin:38}[K],ey={human:132,cat:122,dog:118,frog:104,turtle:124,bird:118,dragon:112,totem:108,goblin:124}[K];
  const er=K==='totem'?[13,15]:K==='goblin'?[12,14]:big?[14,18]:K==='bird'?[7,8]:cfg.mask==='sapsal'?[8,10]:[10,12];
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
  g.fillStyle=expr==='shy'?'#f08a96':'#f7b8bc';[-1,1].forEach(s=>{g.beginPath();g.ellipse(128+s*(ex+(big?26:22)),ey+(big?30:26),big?20:16,big?11:9,0,0,PI*2);g.fill();});
  if(expr==='shy'){g.strokeStyle='#d8606e';g.lineWidth=2.5;[-1,1].forEach(s=>{for(let k=0;k<3;k++){const x=128+s*(ex+18)+k*8-8;g.beginPath();g.moveTo(x,ey+24);g.lineTo(x-5,ey+36);g.stroke();}});}
  // eyes
  g.fillStyle=ink;g.strokeStyle=ink;g.lineWidth=big?6:5;
  const dotEye=(x,scale)=>{scale=scale||1;if(cfg.eye){g.fillStyle=cfg.eye;g.beginPath();g.ellipse(x,ey,er[0]*1.15*scale,er[1]*1.15*scale,0,0,PI*2);g.fill();g.fillStyle=ink;g.beginPath();g.ellipse(x,ey,er[0]*.45*scale,er[1]*.95*scale,0,0,PI*2);g.fill();}
    else{if(cfg.eyeRing||K==='totem'){g.fillStyle='#fff';g.beginPath();g.ellipse(x,ey,er[0]*1.6*scale,er[1]*1.5*scale,0,0,PI*2);g.fill();}g.fillStyle=ink;g.beginPath();g.ellipse(x,ey,er[0]*scale,er[1]*scale,0,0,PI*2);g.fill();}
    g.fillStyle='#fff';g.beginPath();g.arc(x+er[0]*.35*scale,ey-er[1]*.4*scale,Math.max(2.5,er[0]*.35*scale),0,PI*2);g.fill();if(big){g.beginPath();g.arc(x-er[0]*.35,ey+er[1]*.45,2.5,0,PI*2);g.fill();}g.fillStyle=ink;};
  [-1,1].forEach(s=>{const x=128+s*ex;
    if(expr==='base')dotEye(x);
    else if(expr==='wow')dotEye(x,1.3);
    else if(expr==='joy'){dotEye(x,1.15);g.fillStyle='#fff8d0';star(g,x+er[0]*.1,ey-er[1]*.15,big?7:4.5);g.fillStyle=ink;}
    else if(expr==='smile'||expr==='blink'&&false){g.beginPath();g.arc(x,ey+4,er[0]*.95,PI*1.1,PI*1.9);g.stroke();}
    else if(expr==='blink'){g.beginPath();g.arc(x,ey-er[1]*.6,er[0]*.95,PI*.15,PI*.85);g.stroke();}
    else if(expr==='sleepy'){g.beginPath();g.moveTo(x-er[0],ey+2);g.quadraticCurveTo(x,ey+8,x+er[0],ey+2);g.stroke();}
    else if(expr==='shy'){g.beginPath();g.moveTo(x-s*er[0]*.9,ey-er[1]*.6);g.lineTo(x+s*er[0]*.7,ey);g.lineTo(x-s*er[0]*.9,ey+er[1]*.6);g.stroke();}
    else if(expr==='focus'){g.save();g.beginPath();g.rect(x-er[0]*1.5,ey,er[0]*3,er[1]*2);g.clip();dotEye(x);g.restore();g.beginPath();g.moveTo(x-er[0]*1.1,ey+1);g.lineTo(x+er[0]*1.1,ey+1);g.stroke();}});
  if(expr==='sleepy'){g.font='bold 30px sans-serif';g.fillStyle='#5a6ea0';g.fillText('z',196,70);g.font='bold 20px sans-serif';g.fillText('z',214,48);}
  // nose / mouth
  const my={human:176,cat:160,dog:162,frog:150,turtle:166,bird:150,dragon:160,totem:178,goblin:178}[K];
  g.strokeStyle=ink;g.fillStyle=ink;g.lineWidth=4.5;
  const open=expr==='joy'||expr==='smile'&&K!=='human';
  if(K==='dog'){g.beginPath();g.ellipse(128,my-14,12,8,0,0,PI*2);g.fill();}
  if(K==='cat'){g.fillStyle='#e88a9a';g.beginPath();g.moveTo(121,my-14);g.lineTo(135,my-14);g.lineTo(128,my-6);g.closePath();g.fill();g.fillStyle=ink;g.strokeStyle='rgba(60,40,30,.55)';g.lineWidth=2.5;[-1,1].forEach(s=>[0,10].forEach(dy=>{g.beginPath();g.moveTo(128+s*34,my-8+dy);g.lineTo(128+s*70,my-14+dy*1.4);g.stroke();}));g.strokeStyle=ink;g.lineWidth=4.5;}
  if(K==='bird'){g.fillStyle=cfg.beak||'#3a2a20';g.beginPath();g.moveTo(118,my-16);g.lineTo(138,my-16);g.lineTo(128,my-2);g.closePath();g.fill();}
  else if(expr==='wow'){g.beginPath();g.ellipse(128,my+2,8,10,0,0,PI*2);g.fill();}
  else if(K==='frog'){g.lineWidth=6;g.beginPath();g.moveTo(60,my-6);g.quadraticCurveTo(128,my+(open?44:28),196,my-6);g.stroke();if(open){g.fillStyle='#e86a7a';g.beginPath();g.moveTo(80,my+2);g.quadraticCurveTo(128,my+38,176,my+2);g.closePath();g.fill();}}
  else if(K==='cat'||K==='dog'){if(open){g.fillStyle='#e86a7a';g.beginPath();g.arc(128,my+2,12,0,PI);g.fill();}g.beginPath();g.arc(118,my,10,PI*.05,PI*.95);g.stroke();g.beginPath();g.arc(138,my,10,PI*.05,PI*.95);g.stroke();}
  else if(K==='totem'||K==='goblin'){g.fillStyle='#8a2a2a';g.beginPath();g.moveTo(84,my-8);g.quadraticCurveTo(128,my+(open?46:30),172,my-8);g.closePath();g.fill();g.fillStyle='#fff';[-1,1].forEach(s=>{g.beginPath();g.moveTo(128+s*20,my-6);g.lineTo(128+s*30,my-6);g.lineTo(128+s*25,my+8);g.closePath();g.fill();});}
  else if(K==='dragon'){if(open){g.fillStyle='#e86a7a';g.beginPath();g.arc(128,my+2,14,0,PI);g.fill();}g.beginPath();g.arc(128,my-8,22,PI*.2,PI*.8);g.stroke();}
  else if(K==='turtle'){g.fillStyle='#e8707a';g.beginPath();g.ellipse(128,my,open?13:10,open?11:7,0,0,PI*2);g.fill();}
  else{ if(expr==='joy'){g.fillStyle='#d8606a';g.beginPath();g.arc(128,my-4,14,0,PI);g.fill();}else if(expr==='shy'||expr==='sleepy'||expr==='focus'){g.beginPath();g.moveTo(120,my);g.lineTo(136,my);g.stroke();}else{g.beginPath();g.arc(128,my-8,10,PI*.2,PI*.8);g.stroke();}}
  if(cfg.species==='rex'&&expr!=='wow'){g.fillStyle='#fffaf0';[-14,0,14].forEach(dx=>{g.beginPath();g.moveTo(128+dx-5,my-12);g.lineTo(128+dx+5,my-12);g.lineTo(128+dx,my-3);g.closePath();g.fill();});}
  if(cfg.species==='brachio'&&expr!=='blink'&&expr!=='sleepy'&&expr!=='joy'){g.strokeStyle=ink;g.lineWidth=3;[-1,1].forEach(s=>{const x=128+s*ex;[0,1].forEach(k=>{g.beginPath();g.moveTo(x+s*(8+k*5),ey-12+k*2);g.lineTo(x+s*(16+k*7),ey-22+k*4);g.stroke();});});}
  if(cfg.dragonStyle==='east'){g.strokeStyle='rgba(200,60,50,.85)';g.lineWidth=5;g.beginPath();g.moveTo(128,62);g.lineTo(128,80);g.stroke();}
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
/* 서양용: 네 발 아기 용 (예전 모델) */
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
    smile.visible=false;
    openMouth.visible=['wow','joy'].includes(expr);
    sleepMouth.visible=['sleepy','focus'].includes(expr);
  }};
  A.kawaiiFace=face;face.set('base');
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
    dragonSphere(head,.17,M,0,-.13,-.3,1.3,.82,.95);dragonSphere(head,.12,P,0,-.2,-.33,1.25,.55,.85);
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



function makeAvatar(id,look){if(id==='shiba')id='sapsal';const cfg=AVMAP[id]||AVATARS[0];const A={id,cfg,garb:[],legWear:[],sleeves:[],root:new THREE.Group(),bob:new THREE.Group(),legs:[],arms:[],tails:[],hop:false,waddle:0,h:2.2,face:null,expr:'base',blinkAt:performance.now()+2000+Math.random()*3000};A.root.add(A.bob);
  const sh=new THREE.Mesh(new THREE.PlaneGeometry(1.2,1.2),new THREE.MeshBasicMaterial({map:TEX.shadow,transparent:true,depthWrite:false}));sh.rotation.x=-PI/2;sh.position.y=.03;A.root.add(sh);
  const B=A.bob;
  if(cfg.dragonStyle==='west'){makeDragonAvatar(A,cfg,look);softenAvatar(A);return A;}
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
  else if(cfg.type==='beast'){const F=fur(cfg.dragonColor?lookPick(look,'av',cfg.c):cfg.c),Bl=fur(cfg.dragonColor?lookPick(look,'av2',cfg.b):cfg.b);const DK=fur(new THREE.Color(cfg.dragonColor?lookPick(look,'av',cfg.c):cfg.c).multiplyScalar(.72).getHex());
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
    if(cfg.horn==='antler'){const H=cfg.dragonStyle==='east'?std(0xd2553e,{emissive:0x3a0c08}):std(0xe6b850,{emissive:0x3a2a08});[-1,1].forEach(s=>{const a=new THREE.Group();a.position.set(s*.2,.3,.08);a.rotation.z=-s*.35;head.add(a);cyl(a,.03,.04,.42,6,H,0,.2,0);const b1=cyl(a,.02,.03,.18,6,H,s*.06,.25,0);b1.rotation.z=-s*.8;const b2=cyl(a,.02,.03,.14,6,H,-s*.03,.33,0);b2.rotation.z=s*.7;});
      const W=cfg.dragonStyle==='east'?std(0xffe9a8,{emissive:0x3a3008}):std(0xe6b850,{emissive:0x3a2a08});[-1,1].forEach(s=>{for(let i=0;i<5;i++){sph(head,.022,W,s*(.22+i*.06),-.1-i*.035-i*i*.006,-.36+i*.04);}});
      const M=cfg.dragonStyle==='east'?std(0xd2553e,{emissive:0x3a0c08}):std(0x2a6a80,{emissive:0x081a20});for(let i=0;i<5;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(.07,.2,6),M);c.position.set(0,.32-i*.12,.28+i*.05);c.rotation.x=.9;head.add(c);}
      for(let i=0;i<4;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(.06,.16,6),M);c.position.set(0,.85-i*.13,.3);c.rotation.x=.6;B.add(c);}}
    if(cfg.dragonStyle==='east'){const G=std(0xd2553e,{emissive:0x3a0c08});[-1,1].forEach(s=>{const pts=[[s*.12,-.16,-.42],[s*.24,-.17,-.44],[s*.34,-.21,-.41],[s*.4,-.28,-.37]].map(q=>new THREE.Vector3(...q));const w=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),20,.018,6,false),G);head.add(w);});
      const pg=A.arms[1]?A.arms[1].g:A.bob;sph(pg,.09,std(0xfff2c0,{emissive:0xc8902a}),0,-.36,-.08);}
    if(cfg.horn==='smallAntler'){const H=std(0xc98a4a,{emissive:0x2a1808});[-1,1].forEach(s=>{const a=new THREE.Group();a.position.set(s*.2,.3,.06);a.rotation.z=-s*.3;head.add(a);cyl(a,.035,.045,.26,8,H,0,.12,0);sph(a,.045,H,0,.25,0);const b=cyl(a,.028,.035,.13,8,H,s*.06,.15,0);b.rotation.z=-s*.9;sph(b,.035,H,0,.07,0);});
      sph(B,.24,Bl,0,.56,-.2,1,1.15,.55);
      const wings=new THREE.Group();wings.position.set(0,.8,.28);B.add(wings);A.westWings=wings;const memb=std(0xe2706c,{side:THREE.DoubleSide,emissive:0x3a1010});
      [-1,1].forEach(s=>{const wg=new THREE.Group();wg.scale.set(s*.62,.62,.62);wg.rotation.y=s*.45;wings.add(wg);const sh=new THREE.Shape();sh.moveTo(0,0);sh.lineTo(.5,.46);sh.lineTo(.6,.1);sh.quadraticCurveTo(.5,.06,.46,-.04);sh.quadraticCurveTo(.36,0,.3,-.1);sh.quadraticCurveTo(.18,-.04,.12,-.12);sh.quadraticCurveTo(.06,-.06,0,0);
        const m=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.03,bevelEnabled:true,bevelThickness:.015,bevelSize:.015,bevelSegments:2}),memb);wg.add(m);});}
    if(cfg.tiger){const S=std(0x3a3036);[[.35,.68],[.33,.52],[.3,.36]].forEach((p,i)=>[-1,1].forEach(s=>{const m=sph(B,.06,S,s*p[0],p[1],.06,.35,.55,2.2);m.rotation.y=s*.4;}));[.68,.52].forEach(y=>{const m=sph(B,.05,S,0,y,.32,2.2,.4,.4);});}
    if(cfg.fluffy){for(let i=0;i<8;i++){const a=i/8*PI*2;sph(head,.12,F,Math.cos(a)*.32,.24+Math.sin(i)*.04,Math.sin(a)*.25);}for(let i=0;i<6;i++){const a=i/6*PI*2;sph(B,.12,F,Math.cos(a)*.3,.45,Math.sin(a)*.26);}sph(head,.07,std(0xff8fb0),.24,.32,-.12);}
    if(cfg.shaggy){const sf=fur(0xf6f3ec),sg=fur(0xe2ddd2);for(let i=0;i<22;i++){const a=i/22*PI*2;if(Math.sin(a)<-.55)continue;const m=sph(head,.1,i%3?sf:sg,Math.cos(a)*R(.34,.44),R(-.2,.2),Math.sin(a)*R(.3,.38),1,R(2,2.8),1);m.rotation.z=R(-.2,.2);}
      [-.2,-.07,.07,.2].forEach(x=>{const m=sph(head,.075,sf,x,.24,-.37,1,2.2,.7);m.rotation.x=.35;});
      for(let i=0;i<18;i++){const a=i/18*PI*2;sph(B,.11,i%3?sf:sg,Math.cos(a)*.3,R(.3,.6),Math.sin(a)*.27,1,2.6,1);}}
    const tg=new THREE.Group();tg.position.set(0,.42,.3);B.add(tg);A.tails.push(tg);
    if(cfg.tail==='long'){tg.rotation.x=.4;sph(tg,.07,F,0,.12,.04,1,2.4,1);sph(tg,.065,F,0,.34,.02,1,1.4,1);}
    else if(cfg.tail==='curl'){const t=new THREE.Mesh(new THREE.TorusGeometry(.13,.07,8,16,PI*1.6),F);t.rotation.y=PI/2;t.position.set(0,.2,.04);tg.add(t);}
    else if(cfg.tail==='stub'){sph(tg,.1,F,0,.02,.04);}
    else if(cfg.tail==='chub'){tg.rotation.x=.35;for(let i=0;i<5;i++){const r=.15-i*.022;sph(tg,r,F,0,.02+i*.04,.06+i*.09);}}
    else if(cfg.tail==='arrow'){tg.rotation.x=.25;for(let i=0;i<6;i++){const r=.12-i*.014;sph(tg,r,F,0,.04+i*.06,.06+i*.1);}const tip=new THREE.Mesh(new THREE.ConeGeometry(.1,.2,4),Bl);tip.position.set(0,.4,.66);tip.rotation.x=1.3;tip.scale.set(1,1,.35);tg.add(tip);}
    else if(cfg.tail==='dragon'){tg.rotation.x=.2;for(let i=0;i<7;i++){const r=.12-i*.012;sph(tg,r,i%2?F:(cfg.dragonStyle?std(0xd2553e,{emissive:0x3a0c08}):fur(0x358aa2)),0,.05+i*.08+Math.sin(i*.8)*.02,.06+i*.1-i*i*.008);}const tuft=std(0xe6b850,{emissive:0x3a2a08});for(let k=0;k<4;k++)sph(tg,.06,tuft,R(-.05,.05),.62+R(-.04,.04),.5+R(-.04,.04));}
    else sph(tg,.17,F,0,.1,.02);
    if(cfg.tiger&&cfg.tail==='long'){const S=std(0x3a3036);[.18,.3,.42].forEach(y=>{const r=new THREE.Mesh(new THREE.TorusGeometry(.068,.016,6,14),S);r.rotation.x=PI/2;r.position.set(0,y,.03);tg.add(r);});}
    A.gat=makeGat(head,.37,.9,-.12);avatarBook(A,.78,-.4);A.h=2.0;A.waddle=.08;
    A.fit={y0:.28,y1:.88,r1:.33,r0:.4,neck:.86,legTop:.3,legLen:.2,legR:.135,sleeve:[.1,1.3,-.08]};A.headR=.42;A.headS=[1.1,.94,1];}
  else if(cfg.type==='dino'){const sp=cfg.species||'brachio';const mc=lookPick(look,'av',cfg.c),sc=lookPick(look,'av2',cfg.b);const F=fur(mc),Bl=fur(sc),Iv=std(0xfbf3dc,{emissive:0x3a3428});
    const legR=sp==='brachio'||sp==='anky'?.14:.13;
    [-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.17,.3,0);B.add(g);sph(g,legR,F,0,-.1,0,1,1.2,1);sph(g,legR,F,0,-.24,-.04,1.05,.55,1.25);[-1,0,1].forEach(k=>sph(g,.03,Iv,k*.05,-.26,-.17));A.legs.push({g,ph:i?PI:0});});
    sph(B,.37,F,0,.56,0,1.05,1.02,.95);sph(B,.26,Bl,0,.54,-.16,1,1.12,.68);
    const n0=B.children.length;const vest=new THREE.Mesh(new THREE.CylinderGeometry(.33,.39,.34,24,1,true,PI+.55,PI*2-1.1),std(cfg.vest,{side:THREE.DoubleSide,emissive:new THREE.Color(cfg.vest).multiplyScalar(.15)}));vest.position.y=.68;B.add(vest);
    const col=new THREE.Mesh(new THREE.TorusGeometry(.21,.04,6,20),IVORY);col.rotation.x=PI/2;col.position.y=.86;B.add(col);goreum(B,.8,-.28);A.garb=B.children.slice(n0);
    const small=sp==='rex';[-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*(small?.28:.33),small?.84:.76,small?-.1:0);g.rotation.z=s*.4;B.add(g);if(small)g.scale.setScalar(.6);sph(g,.09,F,0,-.13,0,1,1.7,1);sph(g,.075,Iv,0,-.27,0,1,.7,1);A.arms.push({g,ph:i?0:PI,s});});
    let hy=1.16,hr=.42,hs=[1.08,.94,1.05];if(sp==='brachio'){hy=1.62;hr=.34;hs=[1,.92,1.05];}if(sp==='rex'){hr=.47;hs=[1.15,.95,1.12];}
    if(sp==='brachio'){const nk=cyl(B,.15,.2,.7,16,F,0,1.22,-.02);nk.rotation.x=-.12;sph(B,.13,Bl,0,1.22,-.15,1,2.6,.6);}
    const head=new THREE.Group();head.position.y=hy;B.add(head);A.head=head;sph(head,hr,F,0,0,0,hs[0],hs[1],hs[2]);A.face=faceDecal(head,hr,cfg,hs[0],hs[1],hs[2]);
    if(sp==='trike'){const fr=new THREE.Mesh(new THREE.CircleGeometry(.5,24,0,PI),std(sc,{side:THREE.DoubleSide,emissive:new THREE.Color(sc).multiplyScalar(.15)}));fr.position.set(0,.02,.22);fr.rotation.x=-.2;fr.scale.setScalar(1.25);head.add(fr);for(let k=0;k<7;k++){const a=k/6*PI;sph(fr,.05,F,Math.cos(a)*.44,Math.sin(a)*.44,0,1,1,.5);}
      [-1,1].forEach(s=>{const h=new THREE.Mesh(new THREE.ConeGeometry(.055,.34,10),Iv);h.position.set(s*.17,.3,-.22);h.rotation.set(-.9,0,-s*.15);head.add(h);});const nh=new THREE.Mesh(new THREE.ConeGeometry(.045,.18,10),Iv);nh.position.set(0,-.02,-.5);nh.rotation.x=-1.1;head.add(nh);}
    if(sp==='stego'){for(let i=0;i<6;i++){const sz=.13+Math.sin((i+.5)/6*PI)*.09;const pl=new THREE.Mesh(new THREE.ConeGeometry(sz,sz*1.9,4),Bl);pl.scale.z=.25;pl.position.set(i%2?.06:-.06,1.02-i*.11,.12+i*.1);pl.rotation.x=.25+i*.18;B.add(pl);}
      [-1,1].forEach(s=>{const pl=new THREE.Mesh(new THREE.ConeGeometry(.08,.16,4),Bl);pl.scale.z=.25;pl.position.set(s*.08,.38,.22);head.add(pl);});}
    if(sp==='anky'){for(let j=0;j<3;j++)for(let k=-2;k<=2;k++){if(j===2&&Math.abs(k)===2)continue;sph(B,.08,Bl,k*.13,.86-j*.14,.22+j*.07,1,.55,.8);}
      [-1,1].forEach(s=>{for(let k=0;k<3;k++){const c=new THREE.Mesh(new THREE.ConeGeometry(.04,.13,6),Iv);c.position.set(s*.38,.68-k*.1,.05);c.rotation.z=-s*1.4;B.add(c);}});
      [-1,1].forEach(s=>{const c=new THREE.Mesh(new THREE.ConeGeometry(.05,.14,6),Iv);c.position.set(s*.36,.08,.12);c.rotation.z=-s*1.2;head.add(c);});}
    if(sp==='rex'){for(let i=0;i<4;i++)sph(B,.05-i*.006,Bl,0,1.02-i*.12,.28+i*.06,1,.7,.8);}
    if(sp==='brachio'){[-1,1].forEach(s=>sph(head,.05,Bl,s*.1,.3,.02,1,1,1));}
    const tg=new THREE.Group();tg.position.set(0,.42,.3);B.add(tg);A.tails.push(tg);tg.rotation.x=.25;
    const tl=sp==='brachio'?9:sp==='rex'?7:6;for(let i=0;i<tl;i++){const r=(sp==='rex'?.15:.13)-i*.013;sph(tg,Math.max(.03,r),F,0,.02+i*.03,.08+i*.1);}
    if(sp==='anky')sph(tg,.15,Bl,0,.2,.08+tl*.1,1.25,.85,1);
    if(sp==='stego')[-1,1].forEach(s=>[0,1].forEach(k=>{const c=new THREE.Mesh(new THREE.ConeGeometry(.035,.2,6),Iv);c.position.set(s*.08,.16+k*.02,.52+k*.12);c.rotation.z=-s*1.1;tg.add(c);}));
    A.gat=makeGat(head,hr*.88,sp==='brachio'?.78:.9,-.12);avatarBook(A,.78,-.42);A.h=sp==='brachio'?2.3:2.05;A.waddle=.09;
    A.fit={y0:.28,y1:.88,r1:.34,r0:.42,neck:.86,legTop:.3,legLen:.2,legR:.14,sleeve:[.1,1.3,-.08]};A.headR=hr;A.headS=hs;}
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
  softenAvatar(A);
  A.setFace=function(expr){if(!A.face||A.expr===expr)return;A.expr=expr;A.face.material.map=faceTex(cfg,expr);};
  if(typeof applyLook==='function'&&look)applyLook(A,look);
  return A;}
function animateAvatar(A,ph,amt,t,sit){const B=A.bob;
  if(sit){B.position.y=Math.sin(t*1.6)*.01;B.rotation.z=0;A.legs.forEach(l=>l.g.rotation.x=(A.cfg.type==='bird'||A.cfg.dragonStyle==='west')?0:PI/2.1);const rd=A.reading&&A.book&&A.book.visible;
    A.arms.forEach(a=>{if(a.noFlap)return;if(a.wing){a.g.rotation.order='YXZ';a.g.rotation.y=rd?a.s*1.2+Math.sin(t*.8+a.s)*.04:0;a.g.rotation.z=rd?-a.s*.35:0;a.g.rotation.x=rd?.25:0;return;}a.g.rotation.x=rd?1.32+Math.sin(t*.8+a.s)*.03:1.0;a.g.rotation.z=a.s*(rd?.08:.3);});if(A.head){A.head.rotation.x=rd?.34+Math.sin(t*.5)*.03:.12;A.head.rotation.y=rd?Math.sin(t*.35)*.12:0;}
    if(A.book){if(rd){A.book.position.y=A.bookY+.14;A.book.position.z=A.bookZ-.02;A.book.rotation.x=-1.0+Math.sin(t*.7)*.03;const k=(t%5)/5;if(A.page){A.pageM.visible=k<.22;A.page.rotation.z=k<.22?k/.22*PI:0;}}else{A.book.position.y=A.bookY;A.book.position.z=A.bookZ;A.book.rotation.x=-.5;if(A.pageM)A.pageM.visible=false;}}return;}
  if(A.head)A.head.rotation.y=0;
  const hopY=A.hop?Math.abs(Math.sin(ph))*.2*amt:Math.abs(Math.sin(ph))*.05*amt;B.position.y=hopY+Math.sin(t*2)*.012;B.rotation.z=Math.sin(ph)*A.waddle*amt;
  A.legs.forEach(l=>l.g.rotation.x=Math.sin(ph+l.ph)*.6*amt);
  A.arms.forEach(a=>{if(a.noFlap)return;if(a.wing){a.g.rotation.y=0;a.g.rotation.x=0;a.g.rotation.z=a.s*(Math.abs(Math.sin(ph*1.6))*.8*amt+Math.sin(t*2.5)*.06);return;}a.g.rotation.x=Math.sin(ph+a.ph)*.6*amt;a.g.rotation.z=a.s*(A.cfg.type==='human'?.18:.35);});
  A.tails.forEach((tg,i)=>{tg.rotation.z=Math.sin(t*3+i)*.25;});
  if(A.skirt)A.skirt.rotation.z=Math.sin(ph)*.04*amt;
  if(A.head){A.head.rotation.x=Math.sin(t*1.3)*.03;A.head.rotation.z=Math.sin(t*.9)*.05*(1-amt);}}
function faceTick(A,now,want){if(!A.face)return;if(now>A.blinkAt){if(now<A.blinkAt+130){if(want==='base'||want==='wow'||want==='joy'){A.setFace('blink');return;}}else A.blinkAt=now+2500+Math.random()*3500;}A.setFace(want);}
