/* 몽원학당 · 반려 친구 (해태, 도깨비, 까치, 천하대장군, 지하여장군) — 주인을 졸졸 따라다녀요 */
const PETS=[
 {id:'none',name:'데리고 다니지 않기'},
 {id:'haetae',name:'해태',type:'pet',k:'dog',desc:'불을 막아 주는 수호 동물'},
 {id:'dokkaebi',name:'도깨비',type:'pet',k:'goblin',desc:'방망이 든 장난꾸러기'},
 {id:'kkachi',name:'까치',type:'pet',k:'bird',eyeRing:true,desc:'반가운 소식을 물어 오는 새'},
 {id:'jangseung-m',name:'천하대장군',type:'pet',k:'totem',desc:'마을 어귀를 지키는 장승'},
 {id:'jangseung-f',name:'지하여장군',type:'pet',k:'totem',blushC:'#f27a8a',desc:'천하대장군의 짝꿍 장승'},
 {id:'samjogo',name:'삼족오',type:'pet',k:'bird',desc:'해 속에 사는 세 발 까마귀'},
 {id:'bonghwang',name:'봉황',type:'pet',k:'bird',desc:'태평성대에 나타나는 상서로운 새'},
 {id:'phoenix',name:'불사조',type:'pet',k:'bird',desc:'불꽃 속에서 다시 태어나는 새'},
 {id:'cerberus',name:'케르베로스',type:'pet',k:'dog',desc:'머리 셋 달린 듬직한 문지기'},
 {id:'gumiho',name:'구미호',type:'pet',k:'dog',blushC:'#f6a0b0',desc:'꼬리 아홉 개, 여우불을 띄우는 여우'}];
const PETMAP=Object.fromEntries(PETS.map(p=>[p.id,p]));
function jangText(t,col){return ctex(64,320,(g,w,h)=>{g.fillStyle='rgba(0,0,0,0)';g.clearRect(0,0,w,h);g.fillStyle=col;g.font='800 52px '+F;g.textAlign='center';g.textBaseline='middle';[...t].forEach((ch,i)=>g.fillText(ch,w/2,34+i*62));});}
function makePet(id){const cfg=PETMAP[id];if(!cfg||id==='none')return null;
  const P={id,cfg,root:new THREE.Group(),bob:new THREE.Group(),legs:[],arms:[],tails:[],hop:true,h:1.2,expr:'base',blinkAt:performance.now()+1500+Math.random()*3000,ph:0,amt:0,ticks:[]};P.root.add(P.bob);const B=P.bob;
  const sh=new THREE.Mesh(new THREE.PlaneGeometry(.9,.9),new THREE.MeshBasicMaterial({map:TEX.shadow,transparent:true,depthWrite:false}));sh.rotation.x=-PI/2;sh.position.y=.03;P.root.add(sh);
  if(id==='haetae'){const G=fur(0xf2d28a),Bl=fur(0xfbeccc),M=std(0x3f9a98,{emissive:0x0a2422}),Au=std(0xe6b850,{emissive:0x3a2a08});
    [[-.16,-.2],[.16,-.2],[-.16,.22],[.16,.22]].forEach((p,i)=>{const g=new THREE.Group();g.position.set(p[0],.26,p[1]);B.add(g);cyl(g,.07,.065,.24,8,G,0,-.12,0);sph(g,.075,Bl,0,-.24,-.02,1,.6,1.2);P.legs.push({g,ph:i===0||i===3?0:PI});});
    sph(B,.3,G,0,.38,0,1.05,.85,1.3);sph(B,.2,Bl,0,.34,-.26,1,1,.6);
    const col=new THREE.Mesh(new THREE.TorusGeometry(.17,.035,6,18),SCARF);col.rotation.x=PI/2.4;col.position.set(0,.52,-.3);B.add(col);sph(B,.06,Au,0,.44,-.44);
    const head=new THREE.Group();head.position.set(0,.68,-.36);B.add(head);P.head=head;sph(head,.3,G,0,0,0,1.08,.95,.95);P.face=faceDecal(head,.3,cfg,1.08,.95,.95);
    for(let i=0;i<12;i++){const a=i/12*PI*2;if(Math.sin(a)<-.6)continue;sph(head,.1,M,Math.cos(a)*.3,Math.sin(i*1.7)*.12+.02,Math.sin(a)*.24+.06);}for(let i=0;i<5;i++)sph(head,.09,M,-.2+i*.1,.26,.04);
    const horn=new THREE.Mesh(new THREE.ConeGeometry(.05,.18,8),Au);horn.position.set(0,.36,-.04);horn.rotation.x=-.2;head.add(horn);[-1,1].forEach(s=>sph(head,.07,G,s*.22,.22,.08,1,.7,.5));
    const tg=new THREE.Group();tg.position.set(0,.45,.36);B.add(tg);P.tails.push(tg);[0,1,2].forEach(i=>sph(tg,.09-i*.01,M,0,.06+i*.1,.03+i*.04));P.h=1.25;}
  else if(id==='dokkaebi'){const sk=std(0xf2c49a,{emissive:0x3a2414}),hair=std(0x3a2a22,{emissive:0x0c0806}),iv=IVORY,ind=std(0x3a4a7a,{emissive:0x0a0e1c}),wd=std(0x8a5a32,{emissive:0x1a0e06});
    [-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.1,.24,0);B.add(g);cyl(g,.08,.07,.2,8,ind,0,-.1,0);sph(g,.065,std(0x2a2422),0,-.21,-.03,1,.6,1.4);P.legs.push({g,ph:i?PI:0});});
    cyl(B,.17,.22,.34,16,iv,0,.42,0);const bt=new THREE.Mesh(new THREE.TorusGeometry(.2,.025,6,18),std(0xc4584a));bt.rotation.x=PI/2;bt.position.y=.32;B.add(bt);
    [-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.2,.55,0);g.rotation.z=s*.3;B.add(g);sph(g,.065,iv,0,-.1,0,1,1.7,1);sph(g,.05,sk,0,-.22,0);P.arms.push({g,ph:i?0:PI,s});
      if(s>0){const club=new THREE.Group();club.position.set(0,-.24,-.04);club.rotation.x=-.5;g.add(club);cyl(club,.025,.03,.18,8,wd,0,.02,0);cyl(club,.07,.04,.26,10,wd,0,.22,0);for(let k=0;k<6;k++){const a=k/6*PI*2;sph(club,.02,std(0xb8b0a0,{emissive:0x302c28}),Math.cos(a)*.06,.24+(k%2)*.06,Math.sin(a)*.06);}}});
    const head=new THREE.Group();head.position.y=.86;B.add(head);P.head=head;sph(head,.3,sk,0,0,0,1.05,.98,.98);P.face=faceDecal(head,.3,cfg,1.05,.98,.98);
    for(let i=0;i<16;i++){const a=i/16*PI*2;sph(head,.1,hair,Math.cos(a)*.24,.2+Math.sin(i*2.3)*.04,Math.sin(a)*.2+.04,1,1.2,1);}for(let i=0;i<4;i++)sph(head,.09,hair,-.15+i*.1,.3,-.06);
    const horn=new THREE.Mesh(new THREE.ConeGeometry(.045,.16,8),std(0xfbf2dc,{emissive:0x3a362c}));horn.position.set(.04,.42,-.02);horn.rotation.z=-.15;head.add(horn);
    const fl=[];for(let i=0;i<2;i++){const gl=glow(0x6ab8ff,.55,.9);B.add(gl);const core=glow(0xd8f0ff,.22,1);gl.add(core);fl.push({gl,p:i*PI});}
    P.ticks.push(t=>fl.forEach(o=>{o.gl.position.set(Math.cos(t*1.6+o.p)*.5,.9+Math.sin(t*2.4+o.p)*.12,Math.sin(t*1.6+o.p)*.5);const s=.5+Math.sin(t*9+o.p)*.08;o.gl.scale.set(s,s*1.25,1);}));P.h=1.35;}
  else if(id==='kkachi'){const bk=std(0x1e2028,{emissive:0x06080c}),wh=std(0xfbf8f2,{emissive:0x4a4844}),bl=std(0x2a4a7a,{emissive:0x080e1c});
    [-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.08,.14,0);B.add(g);cyl(g,.015,.015,.14,5,bk,0,-.06,0);P.legs.push({g,ph:i?PI:0});});
    sph(B,.2,bk,0,.3,.02,1,.95,1.15);sph(B,.15,wh,0,.27,-.1,1,1,.7);
    [-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.18,.34,.04);B.add(g);sph(g,.12,bk,s*.03,0,.02,.35,.7,1.2);sph(g,.06,wh,s*.06,.02,-.02,.3,.6,.9);sph(g,.05,bl,s*.05,-.04,.12,.3,.5,.8);P.arms.push({g,ph:0,s,wing:true});});
    const tl=new THREE.Group();tl.position.set(0,.32,.2);tl.rotation.x=-.9;B.add(tl);sph(tl,.06,bl,0,.22,0,1,4.2,.35);P.tails.push(tl);
    const head=new THREE.Group();head.position.set(0,.55,-.04);B.add(head);P.head=head;sph(head,.17,bk,0,0,0);P.face=faceDecal(head,.17,cfg,1,1,1);
    const bkk=new THREE.Mesh(new THREE.ConeGeometry(.04,.13,8),bk);bkk.rotation.x=-PI/2;bkk.position.set(0,-.02,-.2);head.add(bkk);P.h=.95;}
  else if(id==='samjogo'){const bk=std(0x1a1a22,{emissive:0x05050a}),gd=std(0xe8b030,{emissive:0x4a3008}),rd=std(0xd8402a,{emissive:0x4a0c06});
    const sun=new THREE.Mesh(new THREE.CircleGeometry(.34,30),new THREE.MeshBasicMaterial({color:0xe84a2a,side:THREE.DoubleSide}));sun.position.set(0,.62,.16);B.add(sun);const ring=new THREE.Mesh(new THREE.TorusGeometry(.35,.025,6,30),gd);ring.position.copy(sun.position);B.add(ring);const sg=glow(0xffb040,1.4,.45);sg.position.set(0,.62,.2);B.add(sg);
    [-1,0,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.09,.15,s?0:.05);B.add(g);cyl(g,.016,.016,.15,5,gd,0,-.07,0);P.legs.push({g,ph:i*2.1});});
    sph(B,.2,bk,0,.32,0,1,.95,1.15);[-1,1].forEach(s=>{const g=new THREE.Group();g.position.set(s*.18,.36,.04);B.add(g);sph(g,.13,bk,s*.03,0,.02,.35,.75,1.25);P.arms.push({g,ph:0,s,wing:true});});
    const tl=new THREE.Group();tl.position.set(0,.3,.2);tl.rotation.x=-.8;B.add(tl);[-.06,0,.06].forEach(x=>sph(tl,.05,bk,x,.15,0,1,3,.35));P.tails.push(tl);
    const head=new THREE.Group();head.position.set(0,.58,-.04);B.add(head);P.head=head;sph(head,.17,bk,0,0,0);P.face=faceDecal(head,.17,cfg,1,1,1);const bkk=new THREE.Mesh(new THREE.ConeGeometry(.04,.14,8),gd);bkk.rotation.x=-PI/2;bkk.position.set(0,-.02,-.2);head.add(bkk);
    sph(head,.05,rd,0,.17,.02,1,1.3,.6);P.fly=true;P.h=1.25;}
  else if(id==='bonghwang'||id==='phoenix'){const ph=id==='phoenix';const c1=ph?std(0xff6a1a,{emissive:0xa02a00}):std(0xd8303a,{emissive:0x3a0808}),c2=ph?std(0xffc23a,{emissive:0xa06a00}):std(0x2a6ac8,{emissive:0x081a3a}),c3=ph?std(0xffe680,{emissive:0xc09a20}):std(0x2a9a5a,{emissive:0x08281a}),gd=std(0xe8b850,{emissive:0x4a3a08});
    [-1,1].forEach((s,i)=>{const g=new THREE.Group();g.position.set(s*.07,.15,0);B.add(g);cyl(g,.014,.014,.14,5,gd,0,-.06,0);P.legs.push({g,ph:i?PI:0});});
    sph(B,.19,c1,0,.32,0,1,1,1.2);sph(B,.13,c2,0,.3,-.1,1,1,.7);
    [-1,1].forEach(s=>{const g=new THREE.Group();g.position.set(s*.17,.38,.04);B.add(g);sph(g,.14,c2,s*.03,0,.02,.32,.75,1.3);sph(g,.08,c3,s*.06,-.06,.12,.3,.6,1);P.arms.push({g,ph:0,s,wing:true});});
    const tl=new THREE.Group();tl.position.set(0,.32,.18);B.add(tl);P.tails.push(tl);const cols=[c1,c2,c3,gd,c2];for(let i=0;i<5;i++){const f=new THREE.Group();f.rotation.set(-.6-i*.08,0,(i-2)*.32);tl.add(f);sph(f,.04,cols[i],0,0,.22,1,.6,6);sph(f,.06,gd,0,0,.48,1,.4,1.4);}
    const head=new THREE.Group();head.position.set(0,.6,-.05);B.add(head);P.head=head;sph(head,.16,c1,0,0,0);P.face=faceDecal(head,.16,cfg,1,1,1);const bkk=new THREE.Mesh(new THREE.ConeGeometry(.035,.12,8),gd);bkk.rotation.x=-PI/2;bkk.position.set(0,-.02,-.18);head.add(bkk);
    [-.05,0,.05].forEach((x,i)=>{const c=cyl(head,.008,.008,.16,4,gd,x,.2,.03);c.rotation.z=-x*3;sph(head,.03,i===1?c3:c2,x*1.6,.28,.03);});
    if(ph){const gl=glow(0xff9030,.7,.45);gl.position.y=.4;B.add(gl);const fl=[];for(let i=0;i<6;i++){const s=glow([0xffb040,0xff6020,0xffe080][i%3],.32,.85);B.add(s);fl.push(s);}P.ticks.push(t=>{fl.forEach((s,i)=>{const k=(t*1.4+i/6)%1;s.position.set(Math.sin(i*2.3)*.12,.25+k*.7,.3-k*.2);s.material.opacity=.9*(1-k);s.scale.setScalar(.32*(1-k*.5));});});}
    P.fly=true;P.h=1.3;}
  else if(id==='cerberus'){const F0=fur(0x3a3440),Bl=fur(0x5a5260),Rd=std(0xd83a3a,{emissive:0x3a0a0a}),Sp=std(0xd8d8e0,{metalness:.4});
    [[-.16,-.2],[.16,-.2],[-.16,.22],[.16,.22]].forEach((p,i)=>{const g=new THREE.Group();g.position.set(p[0],.26,p[1]);B.add(g);cyl(g,.07,.065,.24,8,F0,0,-.12,0);sph(g,.075,Bl,0,-.24,-.02,1,.6,1.2);P.legs.push({g,ph:i===0||i===3?0:PI});});
    sph(B,.3,F0,0,.38,0,1.15,.85,1.3);
    const tg=new THREE.Group();tg.position.set(0,.45,.36);B.add(tg);P.tails.push(tg);[0,1,2].forEach(i=>sph(tg,.07-i*.01,F0,0,.06+i*.1,.03+i*.04));
    [-1,0,1].forEach(k=>{const head=new THREE.Group();head.position.set(k*.27,.66+(k?0:.06),-.32+(k?.06:0));head.rotation.y=-k*.35;B.add(head);const r=k?.19:.22;sph(head,r,F0,0,0,0,1.05,.95,.95);const fc=faceDecal(head,r,cfg,1.05,.95,.95);if(!k){P.head=head;P.face=fc;}
      [-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.ConeGeometry(.06,.14,6),F0);e.position.set(s*r*.6,r*.85,0);e.rotation.z=-s*.3;head.add(e);});const col=new THREE.Mesh(new THREE.TorusGeometry(r*.75,.03,6,16),Rd);col.rotation.x=PI/2;col.position.y=-r*.8;head.add(col);for(let i=0;i<5;i++){const a=i/5*PI*2;const sp=new THREE.Mesh(new THREE.ConeGeometry(.018,.05,5),Sp);sp.position.set(Math.cos(a)*r*.78,-r*.8,Math.sin(a)*r*.78);sp.rotation.set(0,0,Math.atan2(Math.sin(a),Math.cos(a))-PI/2);head.add(sp);}});
    P.h=1.2;}
  else if(id==='gumiho'){const Wf=fur(0xfbf4ea),Pk=std(0xf6c0c8),Tp=fur(0xffe6c8);
    [[-.13,-.18],[.13,-.18],[-.13,.18],[.13,.18]].forEach((p,i)=>{const g=new THREE.Group();g.position.set(p[0],.24,p[1]);B.add(g);cyl(g,.05,.045,.22,8,Wf,0,-.11,0);P.legs.push({g,ph:i===0||i===3?0:PI});});
    sph(B,.24,Wf,0,.36,0,1,.85,1.35);
    const tg=new THREE.Group();tg.position.set(0,.4,.3);B.add(tg);P.tails.push(tg);for(let i=0;i<9;i++){const f=new THREE.Group();f.rotation.set(-.35-Math.abs(i-4)*.05,0,(i-4)*.26);tg.add(f);sph(f,.09,Wf,0,.28,0,1,3.2,1);sph(f,.07,Tp,0,.55,0,1,1.4,1);}
    const head=new THREE.Group();head.position.set(0,.66,-.3);B.add(head);P.head=head;sph(head,.24,Wf,0,0,0,1.08,.95,.95);P.face=faceDecal(head,.24,cfg,1.08,.95,.95);
    [-1,1].forEach(s=>{const e=new THREE.Mesh(new THREE.ConeGeometry(.08,.2,8),Wf);e.position.set(s*.15,.25,0);e.rotation.z=-s*.25;head.add(e);const ei=new THREE.Mesh(new THREE.ConeGeometry(.045,.12,8),Pk);ei.position.set(s*.15,.24,-.03);ei.rotation.z=-s*.25;head.add(ei);});
    const sn=new THREE.Mesh(new THREE.ConeGeometry(.1,.16,10),Wf);sn.rotation.x=-PI/2;sn.position.set(0,-.06,-.25);head.add(sn);sph(head,.025,std(0x2a2020),0,-.05,-.33);
    const orb=new THREE.Group();B.add(orb);sph(orb,.06,std(0x9ae0ff,{emissive:0x4ab0ff,emissiveIntensity:1.2}),0,0,0);orb.add(glow(0x7ad0ff,.6,.8));P.ticks.push(t=>{orb.position.set(Math.cos(t*1.6)*.45,.9+Math.sin(t*2.4)*.1,Math.sin(t*1.6)*.45);});P.h=1.2;}
  else{const fem=id==='jangseung-f';const wd=std(0xc8a06a,{emissive:0x2a1c0c}),dk=std(0x7a5a3a);
    cyl(B,.21,.24,.95,14,wd,0,.5,0);for(let i=0;i<5;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.235,.008,4,20),dk);r.rotation.x=PI/2;r.position.y=.15+i*.2;r.scale.set(1,1,1);B.add(r);}
    const tx=new THREE.Mesh(new THREE.PlaneGeometry(.17,.85),new THREE.MeshBasicMaterial({map:jangText(fem?'地下女將軍':'天下大將軍',fem?'#2a4a8a':'#a8231b'),transparent:true}));tx.position.set(0,.5,-.236);tx.rotation.y=PI;B.add(tx);
    const head=new THREE.Group();head.position.y=1.15;B.add(head);P.head=head;sph(head,.3,wd,0,0,0,1,1.05,.95);P.face=faceDecal(head,.3,cfg,1,1.05,.95);
    if(!fem){const hat=std(0x1e1a18,{emissive:0x060504});cyl(head,.34,.34,.03,24,hat,0,.24,0);cyl(head,.2,.22,.26,20,hat,0,.38,0);[-1,1].forEach(s=>{const w=box(head,.16,.05,.02,hat,s*.28,.44,.08);w.rotation.z=s*.3;});sph(head,.04,std(0xc4584a),0,.25,-.33);}
    else{const hair=std(0x2a2422,{emissive:0x080606});const cap=new THREE.Mesh(new THREE.SphereGeometry(.315,22,12,0,PI*2,0,PI*.42),hair);cap.position.y=.03;head.add(cap);sph(head,.12,hair,0,.12,.28);cyl(head,.012,.012,.32,5,std(0xe6b850),0,.13,.3).rotation.z=PI/2;sph(head,.05,std(0xd8606e),-.2,.24,-.12);}
    P.totem=true;P.h=1.65;}
  P.setFace=function(expr){if(!P.face||P.expr===expr)return;P.expr=expr;P.face.material.map=faceTex(cfg,expr);};
  return P;}
/* follow the owner (owner = root Object3D); bounds clamp optional */
function petFollow(P,owner,dt,t,bounds){if(!P)return;const o=owner.position,ry=owner.rotation.y,c=Math.cos(ry),s=Math.sin(ry);
  let tx=o.x+c*1.05+s*.7,tz=o.z-s*1.05+c*.7;if(bounds){tx=Math.max(bounds[0],Math.min(bounds[1],tx));tz=Math.max(bounds[2],Math.min(bounds[3],tz));}
  const R0=P.root.position,dx=tx-R0.x,dz=tz-R0.z,d=Math.hypot(dx,dz);
  if(d>9){R0.set(tx,0,tz);}else if(d>.12){const sp=Math.min(d*3.2,6)*dt;R0.x+=dx/d*Math.min(sp,d);R0.z+=dz/d*Math.min(sp,d);const ang=Math.atan2(-dx,-dz);let da=ang-P.root.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));P.root.rotation.y+=da*Math.min(1,dt*10);}
  else{let da=ry-P.root.rotation.y;da=Math.atan2(Math.sin(da),Math.cos(da));P.root.rotation.y+=da*Math.min(1,dt*3);}
  R0.y=0;P.amt+=((d>.12?1:0)-P.amt)*Math.min(1,dt*8);P.ph+=dt*13*P.amt;const B=P.bob;
  B.position.y=(P.fly?.5+Math.sin(t*2)*.08:0)+Math.abs(Math.sin(P.ph))*(P.totem?.22:P.fly?.04:.14)*P.amt+Math.sin(t*2.2)*.012;B.rotation.z=P.totem?Math.sin(P.ph)*.1*P.amt+Math.sin(t*1.3)*.03:Math.sin(P.ph)*.06*P.amt;
  P.legs.forEach(l=>l.g.rotation.x=Math.sin(P.ph+l.ph)*.7*P.amt);P.arms.forEach(a=>{if(a.wing)a.g.rotation.z=a.s*(Math.abs(Math.sin(P.ph*1.5))*.9*P.amt+Math.sin(t*3)*.05);else a.g.rotation.x=Math.sin(P.ph+a.ph)*.6*P.amt;});
  P.tails.forEach((tg,i)=>tg.rotation.z=Math.sin(t*4+i)*.3);if(P.head)P.head.rotation.z=Math.sin(t*1.1)*.06*(1-P.amt);P.ticks.forEach(f=>f(t));}

/* small 3D thumbnails for the pickers */
const THUMBS={};let thumbR=null;
function thumbOf(kind,id){const key=kind+':'+id;if(THUMBS[key]!==undefined)return THUMBS[key];
  try{if(!thumbR){thumbR=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});thumbR.setPixelRatio(1);thumbR.setSize(160,160);}
    const sc=new THREE.Scene();sc.add(new THREE.HemisphereLight(0xfff4e0,0x8a6a4a,1.05));const dl=new THREE.DirectionalLight(0xffffff,.7);dl.position.set(2,4,-5);sc.add(dl);
    const obj=kind==='pet'?makePet(id):makeAvatar(id);if(!obj){THUMBS[key]='';return '';}sc.add(obj.root);if(obj.setFace)obj.setFace('smile');
    const h=obj.h||2;const cam=new THREE.PerspectiveCamera(30,1,.1,50);cam.position.set(0,h*.55,-h*1.55-.4);cam.lookAt(0,h*.47,0);thumbR.render(sc,cam);THUMBS[key]=thumbR.domElement.toDataURL('image/png');
  }catch(e){THUMBS[key]='';}return THUMBS[key];}
