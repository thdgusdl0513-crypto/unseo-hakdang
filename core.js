/* 송현학당 · core: renderer, textures, helpers, avatars */
const LS={get(k,d){try{const v=localStorage.getItem('songhyeon.'+k);return v==null?d:JSON.parse(v);}catch(e){return d;}},set(k,v){try{localStorage.setItem('songhyeon.'+k,JSON.stringify(v));}catch(e){}}};
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const PI=Math.PI, $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
let seed=7; const rnd=()=>{seed=(seed*16807)%2147483647;return (seed-1)/2147483646;}; const R=(a,b)=>a+(b-a)*rnd();
const reseed=s=>{seed=s;};

const stage=$('#stage');
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));
stage.prepend(renderer.domElement);
const canvas=renderer.domElement;
const scene=new THREE.Scene();
scene.fog=new THREE.FogExp2(0x0d191d,.02);
scene.background=new THREE.Color(0x0d191d);
const camera=new THREE.PerspectiveCamera(55,1,.1,500);
function resize(){const w=stage.clientWidth,h=stage.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();}
addEventListener('resize',resize);resize();

const hemi=new THREE.HemisphereLight(0xa8b8c0,0x4a3020,.7);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffe2b8,.8);sun.position.set(-14,26,10);scene.add(sun);

/* ---------- textures ---------- */
const F='"Nanum Myeongjo",serif', FS='"Gowun Batang",serif';
function ctex(w,h,draw,rep){const c=document.createElement('canvas');c.width=w;c.height=h;const g=c.getContext('2d');draw(g,w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=4;if(rep){t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(rep[0],rep[1]);}return t;}
const TEX={};
TEX.glow=ctex(128,128,g=>{const r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.22,'rgba(255,255,255,.6)');r.addColorStop(.55,'rgba(255,255,255,.15)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,128,128);});
TEX.dot=ctex(32,32,g=>{g.fillStyle='#fff';g.beginPath();g.arc(16,16,14,0,PI*2);g.fill();});
TEX.petal=ctex(32,32,g=>{g.fillStyle='#fff';g.beginPath();g.ellipse(16,16,14,8,.6,0,PI*2);g.fill();});
TEX.streak=ctex(8,64,g=>{const gr=g.createLinearGradient(0,0,0,64);gr.addColorStop(0,'rgba(255,255,255,0)');gr.addColorStop(1,'rgba(255,255,255,.9)');g.fillStyle=gr;g.fillRect(3,0,2,64);});
TEX.shadow=ctex(64,64,g=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(0,0,0,.55)');r.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=r;g.fillRect(0,0,64,64);});
TEX.cloud=ctex(256,256,g=>{for(let i=0;i<14;i++){const x=128+(rnd()-.5)*130,y=128+(rnd()-.5)*60,r=40+rnd()*50;const gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(255,255,255,.35)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,256,256);}});
TEX.dan=ctex(256,64,(g,w,h)=>{g.fillStyle='#2e6a5c';g.fillRect(0,0,w,h);g.fillStyle='#1c2d4d';g.fillRect(0,0,w,7);g.fillRect(0,h-7,w,7);for(let i=0;i<4;i++){const cx=32+i*64;g.fillStyle='#efe4c6';g.fillRect(cx-31,7,3,h-14);g.fillRect(cx+28,7,3,h-14);['#b8352b','#efe4c6','#2b4f92','#e9b949'].forEach((c,k)=>{g.fillStyle=c;g.beginPath();g.arc(cx,h/2,[21,15,9,4][k],0,PI*2);g.fill();});}},[6,1]);
TEX.tile=ctex(64,64,(g,w,h)=>{g.fillStyle='#262c31';g.fillRect(0,0,w,h);g.fillStyle='#3a434a';g.fillRect(0,0,10,h);g.fillStyle='#1a1f23';g.fillRect(10,0,3,h);for(let y=0;y<h;y+=16){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,y,w,2);}},[22,3]);
TEX.tileRed=ctex(64,64,(g,w,h)=>{g.fillStyle='#6a2a22';g.fillRect(0,0,w,h);g.fillStyle='#8a3a2c';g.fillRect(0,0,10,h);g.fillStyle='#4a1a14';g.fillRect(10,0,3,h);for(let y=0;y<h;y+=16){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(0,y,w,2);}},[22,3]);
function panelTex(wall,frame,win){return ctex(256,200,(g,w,h)=>{g.fillStyle=wall;g.fillRect(0,0,w,h);g.strokeStyle=frame;g.lineWidth=10;g.strokeRect(5,5,w-10,h-10);const x0=58,y0=40,ww=140,hh=104;g.fillStyle=win;g.fillRect(x0,y0,ww,hh);g.strokeStyle=frame;g.lineWidth=3;for(let x=x0;x<=x0+ww;x+=14){g.beginPath();g.moveTo(x,y0);g.lineTo(x,y0+hh);g.stroke();}for(let y=y0;y<=y0+hh;y+=13){g.beginPath();g.moveTo(x0,y);g.lineTo(x0+ww,y);g.stroke();}g.lineWidth=7;g.strokeRect(x0,y0,ww,hh);});}
TEX.panel=panelTex('#d6cdb8','#4a3020','#f0d49a');
TEX.panelRed=panelTex('#a8342a','#3a1a10','#ffd98a');
function woodTex(h,s,l,rep){return ctex(256,256,(g,w,hh)=>{for(let i=0;i<8;i++){g.fillStyle=`hsl(${h},${s+rnd()*8}%,${l+rnd()*6}%)`;g.fillRect(i*32,0,32,hh);g.fillStyle='rgba(0,0,0,.4)';g.fillRect(i*32,0,2,hh);g.fillRect(i*32,rnd()*hh,32,2);}for(let i=0;i<300;i++){g.fillStyle='rgba(255,230,190,.04)';g.fillRect(rnd()*w,rnd()*hh,1,8+rnd()*20);}},rep||[3,3]);}
TEX.floorWarm=woodTex(26,40,30,[3,3]);
TEX.floorDark=woodTex(22,30,16,[3,3]);
TEX.floorLight=woodTex(34,35,42,[3,3]);
TEX.stoneFloor=ctex(256,256,(g,w,h)=>{g.fillStyle='#3d4442';g.fillRect(0,0,w,h);for(let y=0;y<4;y++)for(let x=0;x<4;x++){g.fillStyle=`hsl(160,5%,${24+rnd()*8}%)`;g.fillRect(x*64+2+(y%2)*16,y*64+2,60,60);}},[4,4]);
TEX.moss=ctex(256,256,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);for(let i=0;i<500;i++){g.fillStyle=`rgba(${rnd()<.5?'255,255,255':'0,0,0'},${.05+rnd()*.12})`;g.beginPath();g.arc(rnd()*w,rnd()*h,2+rnd()*10,0,PI*2);g.fill();}},[16,14]);
TEX.paving=ctex(256,256,(g,w,h)=>{g.fillStyle='#5b605c';g.fillRect(0,0,w,h);for(let y=0;y<8;y++)for(let x=0;x<8;x++){g.fillStyle=`hsl(40,6%,${42+rnd()*14}%)`;g.fillRect(x*32+1+(y%2)*8,y*32+1,30,30);}},[1,1]);
TEX.rug=ctex(256,256,(g,w,h)=>{g.fillStyle='#8e2424';g.fillRect(0,0,w,h);g.strokeStyle='#e6b84a';g.lineWidth=8;g.strokeRect(12,12,w-24,h-24);g.lineWidth=3;g.strokeRect(28,28,w-56,h-56);g.fillStyle='#e6b84a';for(let i=0;i<4;i++)for(let j=0;j<4;j++){const x=64+i*42,y=64+j*42;g.beginPath();g.moveTo(x,y-12);g.lineTo(x+12,y);g.lineTo(x,y+12);g.lineTo(x-12,y);g.fill();}g.fillStyle='#5a1414';g.beginPath();g.arc(128,128,30,0,PI*2);g.fill();g.fillStyle='#e6b84a';g.beginPath();g.arc(128,128,12,0,PI*2);g.fill();});
TEX.cork=ctex(256,160,(g,w,h)=>{g.fillStyle='#b98a55';g.fillRect(0,0,w,h);for(let i=0;i<900;i++){g.fillStyle=`rgba(${rnd()<.5?'90,55,25':'230,190,140'},.35)`;g.fillRect(rnd()*w,rnd()*h,2,2);}g.strokeStyle='#5a3418';g.lineWidth=10;g.strokeRect(5,5,w-10,h-10);});
TEX.shell=ctex(128,128,(g,w,h)=>{g.fillStyle='#4f7a3e';g.fillRect(0,0,w,h);g.strokeStyle='#2f4a24';g.lineWidth=4;for(let y=0;y<4;y++)for(let x=0;x<4;x++){const cx=x*36+(y%2)*18,cy=y*32+16;g.beginPath();for(let k=0;k<6;k++){const a=k/6*PI*2;g[k?'lineTo':'moveTo'](cx+Math.cos(a)*16,cy+Math.sin(a)*16);}g.closePath();g.stroke();}});
function textTex(lines,o){o=o||{};return ctex(o.w||512,o.h||256,(g,w,h)=>{g.fillStyle=o.bg||'#203a30';g.fillRect(0,0,w,h);if(o.border){g.strokeStyle=o.border;g.lineWidth=12;g.strokeRect(6,6,w-12,h-12);}g.fillStyle=o.fg||'#f0ead8';g.textAlign='center';g.textBaseline='middle';lines.forEach((l,i)=>{g.font=(l.f||'700 40px ')+(l.ff||F);g.fillText(l.t,w/2,l.y);});if(o.extra)o.extra(g,w,h);});}
function plaqueTex(text,bg,fg){return ctex(512,180,(g,w,h)=>{g.fillStyle=bg||'#15213a';g.fillRect(0,0,w,h);g.strokeStyle=fg||'#d6b46a';g.lineWidth=10;g.strokeRect(8,8,w-16,h-16);g.lineWidth=2;g.strokeRect(26,26,w-52,h-52);g.fillStyle=fg||'#efd492';g.font='800 '+(text.length>4?72:96)+'px '+F;g.textAlign='center';g.textBaseline='middle';g.fillText(text,w/2,h/2+6);});}
TEX.sigil=ctex(512,512,g=>{g.translate(256,256);g.strokeStyle=g.fillStyle='rgba(255,240,200,.95)';const ring=(r,w)=>{g.lineWidth=w;g.beginPath();g.arc(0,0,r,0,PI*2);g.stroke();};ring(250,3);ring(240,1.5);ring(192,2);ring(122,2);ring(60,1.5);ring(30,2);
  const txt='天地玄黃宇宙洪荒日月盈昃辰宿列張';g.font='700 25px '+F;g.textAlign='center';g.textBaseline='middle';for(let i=0;i<txt.length;i++){g.save();g.rotate(i/txt.length*PI*2);g.fillText(txt[i],0,-215);g.restore();}
  for(let i=0;i<8;i++){g.save();g.rotate(i/8*PI*2);for(let l=0;l<3;l++){const y=-174+l*15;if(((7-i)>>l)&1)g.fillRect(-24,y,48,7);else{g.fillRect(-24,y,20,7);g.fillRect(4,y,20,7);}}g.restore();}
  g.lineWidth=2;g.beginPath();for(let i=0;i<=8;i++){const a=i*3/8*PI*2;const x=Math.sin(a)*120,y=-Math.cos(a)*120;i?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();g.beginPath();g.arc(0,0,8,0,PI*2);g.fill();});
TEX.talisman=ctex(96,240,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#f4dc8f');gr.addColorStop(1,'#d8b058');g.fillStyle=gr;g.fillRect(0,0,w,h);g.strokeStyle='#a8231b';g.lineWidth=4;g.strokeRect(7,7,w-14,h-14);g.fillStyle='#a8231b';g.font='800 32px '+F;g.textAlign='center';g.textBaseline='middle';['勅','令','雲','符'].forEach((c,i)=>g.fillText(c,w/2,36+i*42));});
TEX.pumpkin=ctex(128,64,(g,w,h)=>{g.fillStyle='#d9661c';g.fillRect(0,0,w,h);g.fillStyle='#ffd34a';g.beginPath();g.moveTo(40,18);g.lineTo(50,30);g.lineTo(30,30);g.fill();g.beginPath();g.moveTo(88,18);g.lineTo(98,30);g.lineTo(78,30);g.fill();g.beginPath();g.moveTo(34,40);g.lineTo(94,40);g.lineTo(84,52);g.lineTo(74,46);g.lineTo(64,52);g.lineTo(54,46);g.lineTo(44,52);g.fill();});

/* ---------- materials & helpers ---------- */
const GRAD=(()=>{const d=new Uint8Array([90,90,90,170,170,170,235,235,235]);const t=new THREE.DataTexture(d,3,1,THREE.RGBFormat);t.minFilter=t.magFilter=THREE.NearestFilter;t.generateMipmaps=false;t.needsUpdate=true;return t;})();
const std=(c,o)=>{const p=Object.assign({color:c},o||{});delete p.roughness;delete p.metalness;p.gradientMap=GRAD;return new THREE.MeshToonMaterial(p);};
const emis=(c,i)=>std(c,{emissive:c,emissiveIntensity:i==null?1:i});
const MAT={red:std(0x9a2e26,{roughness:.55}),wood:std(0x4a2f1c),woodDark:std(0x2a1a11),woodLight:std(0x8a6440),plaster:std(0xe0d7c2),stone:std(0x8a908b),stoneDark:std(0x4a524f),gold:std(0xc9a65a,{metalness:.55,roughness:.35}),bark:std(0x3a2a22,{roughness:1}),
  dan:std(0xffffff,{map:TEX.dan,roughness:.7}),tile:std(0xffffff,{map:TEX.tile,roughness:.8}),tileRed:std(0xffffff,{map:TEX.tileRed,roughness:.8}),black:std(0x151515),white:std(0xffffff),pine:std(0x234a34,{roughness:1}),glass:new THREE.MeshStandardMaterial({color:0xcfeee6,transparent:true,opacity:.18,roughness:.1,metalness:.3,depthWrite:false,side:THREE.DoubleSide})};
const box=(p,w,h,d,m,x,y,z)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x||0,y||0,z||0);p.add(o);return o;};
const cyl=(p,rt,rb,h,seg,m,x,y,z)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg),m);o.position.set(x||0,y||0,z||0);p.add(o);return o;};
const sph=(p,r,m,x,y,z,sx,sy,sz)=>{const o=new THREE.Mesh(new THREE.SphereGeometry(r,18,12),m);o.position.set(x||0,y||0,z||0);o.scale.set(sx||1,sy||1,sz||1);p.add(o);return o;};
function glow(color,size,op){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:TEX.glow,color,transparent:true,opacity:op==null?1:op,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));s.scale.set(size,size,1);return s;}
const dummy=new THREE.Object3D(), tmpC=new THREE.Color();
function curvedRoof(w,d,lift,thick,slope,mat){const g=new THREE.BoxGeometry(w,thick,d,28,1,10);const p=g.attributes.position;for(let i=0;i<p.count;i++){const nx=p.getX(i)/(w/2),nz=p.getZ(i)/(d/2);p.setY(i,p.getY(i)-Math.abs(nz)*d*slope+nz*nz*d*slope*.42+Math.pow(Math.abs(nx),4)*lift*(.55+.45*Math.abs(nz)));}g.computeVertexNormals();return new THREE.Mesh(g,mat||MAT.tile);}
function chorong(p,x,y,z,warm){const g=new THREE.Group();g.position.set(x,y,z);p.add(g);
  const a=new THREE.Mesh(new THREE.CylinderGeometry(.22,.24,.3,12,1,true),std(warm?0xe8a43a:0xc23a33,{emissive:warm?0xffb040:0xff5030,emissiveIntensity:.9,side:THREE.DoubleSide}));a.position.y=.15;g.add(a);
  const b=new THREE.Mesh(new THREE.CylinderGeometry(.24,.22,.3,12,1,true),std(warm?0xc23a33:0x2c55a8,{emissive:warm?0xff6030:0x3a6cff,emissiveIntensity:.75,side:THREE.DoubleSide}));b.position.y=-.15;g.add(b);
  cyl(g,.25,.25,.04,12,MAT.gold,0,.31,0);cyl(g,.25,.25,.04,12,MAT.gold,0,-.31,0);cyl(g,.015,.015,.6,4,MAT.woodDark,0,.62,0);cyl(g,.04,.01,.35,6,std(0xb8352b),0,-.5,0);
  g.add(glow(0xffa070,1.8,.7));return g;}
function stoneLamp(p,x,z){const g=new THREE.Group();g.position.set(x,0,z);p.add(g);box(g,.6,.25,.6,MAT.stone,0,.12,0);cyl(g,.13,.16,.9,8,MAT.stone,0,.7,0);box(g,.6,.1,.6,MAT.stone,0,1.18,0);
  box(g,.42,.42,.42,emis(0xffd59a,1.1),0,1.44,0);const rf=cyl(g,0,.55,.35,4,MAT.stoneDark,0,1.83,0);rf.rotation.y=PI/4;const gl=glow(0xffb066,2.4,.7);gl.position.y=1.44;g.add(gl);return g;}
function makeLabel(text,opt){opt=opt||{};const c=document.createElement('canvas');c.width=512;c.height=96;const t=new THREE.CanvasTexture(c);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false,fog:false}));s.renderOrder=10;s.scale.set(2.2,.41,1);
  const L={sprite:s,text:null,set(tx,sub){if(tx===L.text&&sub===L.sub)return;L.text=tx;L.sub=sub;const g=c.getContext('2d');g.clearRect(0,0,512,96);g.font='700 34px '+FS;const full=tx+(sub?'  '+sub:'');const w=Math.min(500,g.measureText(full).width+44);g.fillStyle=opt.bg||'rgba(250,240,218,.92)';g.strokeStyle=opt.line||'rgba(160,110,60,.7)';g.lineWidth=3;const x0=256-w/2;g.beginPath();g.roundRect?g.roundRect(x0,14,w,64,32):g.rect(x0,14,w,64);g.fill();g.stroke();g.textAlign='center';g.textBaseline='middle';g.fillStyle=opt.fg||'#4a3022';g.fillText(full,256,48);t.needsUpdate=true;}};L.set(text);return L;}
function makeBubble(){const c=document.createElement('canvas');c.width=512;c.height=180;const t=new THREE.CanvasTexture(c);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:false,fog:false}));s.renderOrder=11;s.scale.set(2.8,.98,1);s.visible=false;
  return {sprite:s,until:0,set(text){const g=c.getContext('2d');g.clearRect(0,0,512,180);g.font='30px '+FS;const words=[...text];let lines=[''];for(const ch of words){if(g.measureText(lines[lines.length-1]+ch).width>440){if(lines.length===3){lines[2]=lines[2].slice(0,-1)+'…';break;}lines.push('');}lines[lines.length-1]+=ch;}
    const lh=40,h=lines.length*lh+30,w=Math.min(490,Math.max(...lines.map(l=>g.measureText(l).width))+40);const x0=256-w/2,y0=150-h;g.fillStyle='rgba(255,247,230,.97)';g.strokeStyle='#b5824e';g.lineWidth=3;g.beginPath();g.roundRect?g.roundRect(x0,y0,w,h,22):g.rect(x0,y0,w,h);g.fill();g.stroke();g.beginPath();g.moveTo(240,150);g.lineTo(256,172);g.lineTo(272,150);g.fill();
    g.fillStyle='#2a2018';g.textAlign='center';g.textBaseline='middle';lines.forEach((l,i)=>g.fillText(l,256,y0+15+lh/2+i*lh));t.needsUpdate=true;s.visible=true;this.until=performance.now()+6000;}};}

