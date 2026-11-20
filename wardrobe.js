/* 운서학당 · 옷장: 옷(현대·전통·모던 한복), 모자, 소품 */
const TOPS=[
 {id:'school',cat:'trad',name:'교복 저고리',sw:['#fbf6ec','#9fadc2']},
 {id:'saekdong',cat:'trad',name:'색동저고리',sw:['#c4384a','#f2c84b','#4a8ac8'],st:'jeogori',c:0xfbf4e6,sleeve:{tex:'saekdong'},tie:0x6a3aa8},
 {id:'dopo',cat:'trad',name:'선비 도포',sw:['#f4f0e6','#2a2a3a'],st:'robe',c:0xf4f0e6,sleeve:{c:0xf4f0e6,wide:true},belt:0x2a2a3a},
 {id:'dangui',cat:'trad',name:'궁중 당의',sw:['#3f8a5a','#e6b850'],st:'dangui',c:0x3f8a5a,tex:'gold',sleeve:{c:0x3f8a5a},tie:0xb8283a},
 {id:'baeja',cat:'trad',name:'누빔 배자 저고리',sw:['#e8d8b8','#8a4a3a'],st:'jeogori',c:0xe8d8b8,sleeve:{c:0xfbf6ec},tie:0x8a4a3a,vest:0x8a4a3a},
 {id:'cheollik',cat:'mhan',name:'철릭 원피스',sw:['#e8b8b4','#8a4a5a'],st:'dress',c:0xe8b8b4,sleeve:{c:0xe8b8b4},tie:0x8a4a5a},
 {id:'saenghwal',cat:'mhan',name:'생활한복 셔츠',sw:['#f2ead8','#3a4a6a'],st:'jeoLong',c:0xf2ead8,sleeve:{c:0xf2ead8},tie:0x3a4a6a},
 {id:'crop',cat:'mhan',name:'하늘빛 크롭 저고리',sw:['#a8c8e0','#fbf6ec'],st:'jeogori',c:0xa8c8e0,sleeve:{c:0xa8c8e0},tie:0xfbf6ec},
 {id:'durucoat',cat:'mhan',name:'모던 두루마기 코트',sw:['#8a6a4a','#e8d8b8'],st:'robe',c:0x8a6a4a,sleeve:{c:0x8a6a4a},tie:0xe8d8b8},
 {id:'hoodie',cat:'modern',name:'후드티',sw:['#9ab89a'],st:'hoodie',c:0x9ab89a},
 {id:'knit',cat:'modern',name:'꽈배기 니트',sw:['#f2e2c4'],st:'knit',c:0xf2e2c4,tex:'knit',sleeve:{c:0xf2e2c4,tex:'knit'}},
 {id:'blazer',cat:'modern',name:'블레이저',sw:['#2a3a5a','#b8283a'],st:'blazer',c:0x2a3a5a,inner:0xffffff,tie:0xb8283a},
 {id:'tee',cat:'modern',name:'흰 티셔츠',sw:['#f6f0e4'],st:'tee',c:0xf6f0e4},
 {id:'pjtop',cat:'modern',name:'체크 파자마 상의',sw:['#f2c8c8','#ffffff'],st:'long',c:0xffffff,tex:'check',sleeve:{c:0xffffff,tex:'check'}},
 {id:'trench',cat:'modern',name:'트렌치코트',sw:['#c8a878','#9a7a50'],st:'robe',c:0xc8a878,sleeve:{c:0xc8a878},belt:0x9a7a50}];
const BOTTOMS=[
 {id:'school',cat:'trad',name:'교복 치마·바지',sw:['#9fadc2','#e8e4dc']},
 {id:'chimared',cat:'trad',name:'다홍 치마',sw:['#c4384a'],st:'skirt',c:0xc4384a,len:'long'},
 {id:'chimanavy',cat:'trad',name:'쪽빛 치마',sw:['#2a3a6a'],st:'skirt',c:0x2a3a6a,len:'long'},
 {id:'baji',cat:'trad',name:'흰 한복 바지',sw:['#e8e2d6'],st:'pants',c:0xe8e2d6},
 {id:'floral',cat:'mhan',name:'꽃 허리치마',sw:['#2a3a6a','#f2a8b8'],st:'skirt',c:0x2a3a6a,len:'mid',tex:'floral'},
 {id:'pinkmid',cat:'mhan',name:'분홍 랩치마',sw:['#e8b8b4'],st:'skirt',c:0xe8b8b4,len:'mid'},
 {id:'wide',cat:'mhan',name:'와이드 한복 바지',sw:['#3a4a6a'],st:'wide',c:0x3a4a6a},
 {id:'pleat',cat:'modern',name:'체크 플리츠 치마',sw:['#5a6a8a','#b8283a'],st:'skirt',c:0xffffff,len:'short',tex:'plaid'},
 {id:'jeans',cat:'modern',name:'청바지',sw:['#4a6a9a'],st:'pants',c:0xffffff,tex:'denim'},
 {id:'jogger',cat:'modern',name:'회색 조거',sw:['#5a5a64'],st:'pants',c:0x5a5a64},
 {id:'slacks',cat:'modern',name:'검정 슬랙스',sw:['#2a2a30'],st:'pants',c:0x2a2a30},
 {id:'overall',cat:'modern',name:'멜빵바지',sw:['#6a8ab8'],st:'overall',c:0xffffff,tex:'denim'},
 {id:'pjpants',cat:'modern',name:'체크 파자마 바지',sw:['#f2c8c8'],st:'pants',c:0xffffff,tex:'check'}];
const HATS=[['gat','갓'],['none','쓰지 않기'],['jobawi','조바위'],['jokduri','족두리'],['hwagwan','꽃화관'],['beanie','비니'],['beret','베레모'],['cap','야구모자']];
const ACCS=[['glasses','동그란 안경'],['sunglasses','선글라스'],['scarf','목도리'],['norigae','노리개'],['flowerpin','꽃핀'],['headphones','헤드폰'],['backpack','책가방'],['crossbag','에코백']];
const TOPMAP=Object.fromEntries(TOPS.map(o=>[o.id,o])),BOTMAP=Object.fromEntries(BOTTOMS.map(o=>[o.id,o]));
const OLDSET={saekdong:['saekdong','chimared'],dopo:['dopo','baji'],dangui:['dangui','chimared'],cheollik:['cheollik','school'],saenghwal:['saenghwal','wide'],crop:['crop','floral'],durucoat:['durucoat','slacks'],hoodie:['hoodie','jogger'],knit:['knit','jeans'],blazer:['blazer','pleat'],overall:['tee','overall'],pajama:['pjtop','pjpants'],trench:['trench','slacks']};
const DEFAULT_LOOK={t:'school',b:'school',h:'gat',a:[]};
const lookStr=L=>`${L.t||'school'}|${L.b||'school'}|${L.h||'gat'}|${(L.a||[]).join(',')}`;
const lookParse=s=>{if(typeof s!=='string'||!s)return Object.assign({},DEFAULT_LOOK,{a:[]});let P=s.split('|');
  if(P.length===3){const m=OLDSET[P[0]]||['school','school'];P=[m[0],m[1],P[1],P[2]];}
  const [t,b,h,a]=P;return {t:TOPMAP[t]?t:'school',b:BOTMAP[b]?b:'school',h:HATS.some(x=>x[0]===h)?h:'gat',a:(a||'').split(',').filter(x=>ACCS.some(y=>y[0]===x)).slice(0,4)};};

/* fabric textures */
const FAB={};
function fab(name){if(FAB[name])return FAB[name];let t;
  if(name==='saekdong')t=ctex(64,128,(g,w,h)=>{['#c4384a','#f2c84b','#3f9a6a','#4a8ac8','#f2f0ea','#8a4ab8','#e88a4a'].forEach((c,i)=>{g.fillStyle=c;g.fillRect(0,i*h/7,w,h/7+1);});},[1,1]);
  else if(name==='gold')t=ctex(128,128,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);g.strokeStyle='#e6c060';g.fillStyle='#e6c060';g.lineWidth=3;for(let y=16;y<h;y+=32)for(let x=16+(y%64?16:0);x<w;x+=32){g.beginPath();g.arc(x,y,7,0,PI*2);g.stroke();g.beginPath();g.arc(x,y,2.5,0,PI*2);g.fill();}},[3,2]);
  else if(name==='floral')t=ctex(128,128,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);for(let i=0;i<14;i++){const x=rnd()*w,y=rnd()*h,c=['#f2a8b8','#f2d070','#fbf6ec'][i%3];g.fillStyle=c;for(let k=0;k<5;k++){const a=k/5*PI*2;g.beginPath();g.arc(x+Math.cos(a)*5,y+Math.sin(a)*5,4,0,PI*2);g.fill();}g.fillStyle='#f2c84b';g.beginPath();g.arc(x,y,2.5,0,PI*2);g.fill();}},[3,2]);
  else if(name==='knit')t=ctex(64,64,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);g.strokeStyle='rgba(120,90,60,.22)';g.lineWidth=3;for(let x=8;x<w;x+=16){for(let y=0;y<h;y+=10){g.beginPath();g.moveTo(x-5,y);g.lineTo(x,y+6);g.lineTo(x+5,y);g.stroke();}}},[6,3]);
  else if(name==='denim')t=ctex(64,64,(g,w,h)=>{g.fillStyle='#4a6a9a';g.fillRect(0,0,w,h);for(let i=0;i<400;i++){g.fillStyle=`rgba(${rnd()<.5?'255,255,255':'20,30,60'},.12)`;g.fillRect(rnd()*w,rnd()*h,2,1);}g.strokeStyle='#e6b850';g.setLineDash([3,3]);g.beginPath();g.moveTo(0,4);g.lineTo(w,4);g.stroke();},[3,3]);
  else if(name==='plaid')t=ctex(64,64,(g,w,h)=>{g.fillStyle='#5a6a8a';g.fillRect(0,0,w,h);g.fillStyle='rgba(30,40,70,.5)';g.fillRect(0,20,w,14);g.fillRect(20,0,14,h);g.fillStyle='rgba(190,60,60,.6)';g.fillRect(0,46,w,3);g.fillRect(46,0,3,h);},[6,3]);
  else if(name==='check')t=ctex(64,64,(g,w,h)=>{g.fillStyle='#f6dcdc';g.fillRect(0,0,w,h);g.fillStyle='rgba(220,120,140,.45)';g.fillRect(0,0,w,16);g.fillRect(0,32,w,16);g.fillRect(0,0,16,h);g.fillRect(32,0,16,h);},[6,3]);
  FAB[name]=t;return t;}
const cloth=(c,tex,o)=>std(c==null?0xffffff:c,Object.assign({map:tex?fab(tex):null,emissive:new THREE.Color(c==null?0xffffff:c).multiplyScalar(.12),side:THREE.DoubleSide},o||{}));
const tube=(p,rt,rb,y0,y1,m,open)=>{const h=Math.max(.02,y1-y0);const geo=open?new THREE.CylinderGeometry(rt,rb,h,26,1,true,PI+open/2,PI*2-open):new THREE.CylinderGeometry(rt,rb,h,26,1,true);const me=new THREE.Mesh(geo,m);me.position.y=(y0+y1)/2;p.add(me);return me;};
const disc=(p,r,y,m)=>{const d=new THREE.Mesh(new THREE.CircleGeometry(r,26),m);d.rotation.x=-PI/2;d.position.y=y;p.add(d);return d;};

function applyLook(A,look){look=look||DEFAULT_LOOK;A.look=look;const F=A.fit;if(!F)return;const B=A.bob;const fem=!!(A.cfg&&A.cfg.fem);
  /* ----- clothes ----- */
  if(look.t!=='school'||look.b!=='school'){A.garb.forEach(m=>m.visible=false);A.legWear.forEach(m=>m.visible=false);A.skirt=null;
    let T=TOPMAP[look.t]||TOPS[0],Bt=BOTMAP[look.b]||BOTTOMS[0];
    if(T.id==='school')T=fem?{st:'jeogori',c:0xfbf6ec,sleeve:{c:0xfbf6ec},tie:0x8a9ab4,cat:'trad'}:{st:'jeoLong',c:0xaebccc,sleeve:{c:0xaebccc},tie:0xf3efe6,belt:0x6a7488,cat:'trad'};
    if(Bt.id==='school')Bt=fem?{st:'skirt',c:0x9fadc2,len:'long'}:{st:'pants',c:0xe8e4dc};
    const tm=cloth(T.c,T.tex);const ob=F.openBack?1.9:0;
    const y0=F.y0,y1=F.y1,span=y1-y0;let topBot=y0-.02;
    const rAt=k=>F.r0+(F.r1-F.r0)*k;const H=!!F.human;
    if(F.bird){const w=tube(B,F.r1,F.r0,y0,y1,tm);const tie=T.tie||T.belt;if(tie)goreum(B,y1-.08,-F.r1-.02,std(tie));
      if(Bt.st==='skirt'){const sk=tube(B,F.r0*.95,F.r0*1.12,y0-.1,y0+.06,cloth(Bt.c,Bt.tex));A.skirt=sk;}}
    else{
      if(T.st==='jeogori'){topBot=y1-span*.42;tube(B,F.r1*1.02,rAt(.58)*1.12,topBot,y1,tm,ob);if(!H)tube(B,F.r1*1.01,F.r0*1.03,y0,topBot+.02,cloth(T.c,T.tex),ob);}
      else if(T.st==='robe'){const rb=H?Math.max(F.r0*1.5,.38):F.r0*1.16;const yb=H?Math.max(.1,F.legTop-F.legLen*.6):Math.max(.12,F.legTop-F.legLen*.35);tube(B,F.r1*1.04,rb,yb,y1,tm,.5+ob);if(!H)tube(B,F.r1*1.02,F.r0*1.05,y0,y1,tm,ob);topBot=y0;}
      else if(T.st==='dangui'){tube(B,F.r1*1.04,F.r0*(H?1.3:1.1),y0-.12,y1,tm,.25+ob);topBot=y0-.12;}
      else if(T.st==='dress'){const rb=H?Math.max(F.r0*1.6,.44):F.r0*1.25;tube(B,F.r1*1.03,rb,Math.max(.12,F.legTop-F.legLen*(H?.4:.2)),y1,tm,ob);topBot=null;}
      else{tube(B,F.r1*1.03,F.r0*1.07,y0-.03,y1,tm,ob);topBot=y0;}
      disc(B,F.r1*1.03,y1,tm);
      const front=-(F.r1*1.03)-.005;
      if(T.st==='jeogori'||T.st==='jeoLong'||T.st==='dangui'||T.st==='robe'&&T.cat!=='modern'){const git=box(B,.05,span*.5,.02,std(T.tie||0x3a4a6a),.04,y1-span*.22,front-.01);git.rotation.z=.55;}
      if(T.tie&&T.st!=='blazer')goreum(B,y1-span*.32,front-.02,std(T.tie));
      if(T.vest){const vm=cloth(T.vest,'knit');tube(B,F.r1*1.07,rAt(.5)*1.16,y1-span*.48,y1-.01,vm,.55+ob);}
      if(T.st==='hoodie'){const hood=new THREE.Mesh(new THREE.TorusGeometry(F.r1*.85,.07,8,20,PI*1.3),tm);hood.rotation.set(PI/2-.3,0,PI*.85);hood.position.set(0,y1+.02,.05);B.add(hood);box(B,F.r1*1.1,span*.22,.04,cloth(T.c),0,y0+span*.3,-F.r0*1.04).material.color.multiplyScalar(.9);[-1,1].forEach(s=>cyl(B,.008,.008,.16,4,MAT.white,s*.06,y1-.1,front-.01));}
      if(T.st==='blazer'){tube(B,F.r1*.98,F.r0*1.02,y0,y1,cloth(T.inner),0);box(B,.07,span*.45,.02,std(T.tie),0,y1-span*.25,front-.008);[-1,1].forEach(s=>{const l=box(B,.09,span*.35,.02,cloth(T.c),s*.09,y1-span*.2,front-.02);l.rotation.z=s*.3;});tube(B,F.r1*1.05,F.r0*1.09,y0-.02,y1,tm,.7);}
      if(T.st==='knit'){const rib=new THREE.Mesh(new THREE.TorusGeometry(F.r0*1.07,.03,6,24),tm);rib.rotation.x=PI/2;rib.position.y=y0-.02;B.add(rib);const nk=new THREE.Mesh(new THREE.TorusGeometry(F.r1*.7,.035,6,20),tm);nk.rotation.x=PI/2;nk.position.y=y1;B.add(nk);}
      if(T.belt){const bt=new THREE.Mesh(new THREE.TorusGeometry(rAt(.35)*1.12,.025,6,24),std(T.belt));bt.rotation.x=PI/2;bt.position.y=y0+span*.35;B.add(bt);}
      const bm=cloth(Bt.c,Bt.tex);
      if(Bt.st==='skirt'&&topBot!=null){const lenTo={long:.07,mid:Math.max(.12,F.legTop-F.legLen*.5),short:Math.max(.18,F.legTop-F.legLen*.1)}[Bt.len||'long'];const rTop=H?rAt(.58)*1.1:F.r0*1.08;const rBot=H?Math.max(F.r0*1.5,Bt.len==='long'?.46:.38):F.r0*(Bt.len==='long'?1.3:1.22);const sk=tube(B,Bt.len==='long'&&H?rTop*.92:rTop,rBot,lenTo,topBot+.01,bm,ob);A.skirt=sk;}
      if(Bt.st==='pants'||Bt.st==='wide'||Bt.st==='overall'||(Bt.st==='skirt'&&topBot==null&&false)){const wide=Bt.st==='wide'?1.45:1;A.legs.forEach(l=>{cyl(l.g,F.legR*1.08,F.legR*1.08*wide,F.legLen*.92,10,bm,0,-F.legLen*.46,0);});
        tube(B,F.r0*1.06,F.r0*1.06,F.legTop-.04,Math.max(F.legTop+.02,topBot!=null?topBot+.02:y0),bm,ob);
        if(Bt.st==='overall'){box(B,F.r1*1.1,span*.45,.03,bm,0,y0+span*.3,-F.r0*1.06);[-1,1].forEach(s=>{const st=box(B,.04,span*.75,.02,bm,s*F.r1*.55,y0+span*.6,-F.r1*1.05);st.rotation.x=.08;});[-1,1].forEach(s=>sph(B,.025,MAT.gold,s*F.r1*.55,y0+span*.52,-F.r0*1.08));}}
    }
    const S=T.sleeve||{c:T.c};const sm=cloth(S.c,S.tex);
    if(H){A.sleeves.forEach(m=>{m.material=sm;if(S.wide)m.scale.set(1.45,1.9,1.45);});}
    else if(F.sleeve){A.arms.forEach(a=>{if(a.wing)return;const s=sph(a.g,F.sleeve[0],sm,0,F.sleeve[2],0,1,F.sleeve[1],1);if(S.wide)s.scale.x=s.scale.z=1.3;});}
  }
  /* ----- hat ----- */
  const gat=A.gat;if(gat&&look.h!=='gat'){gat.visible=false;if(look.h!=='none')buildHat(A,look.h);}
  /* ----- accessories ----- */
  (look.a||[]).forEach(id=>buildAcc(A,id));}

function headAnchor(A){const g=new THREE.Group();const S=A.headS||[1,1,1];g.scale.set(S[0],S[1],S[2]);A.head.add(g);return {g,r:A.headR||.4};}
function buildHat(A,id){const {g,r}=headAnchor(A);const blk=std(0x1e1a18,{emissive:0x060504});
  if(id==='beanie'){const m=cloth(0xe0a84a,'knit');const cap=new THREE.Mesh(new THREE.SphereGeometry(r*1.08,24,12,0,PI*2,0,PI*.48),m);cap.position.y=r*.08;g.add(cap);const rim=new THREE.Mesh(new THREE.TorusGeometry(r*1.03,r*.09,8,28),m);rim.rotation.x=PI/2;rim.position.y=r*.12;g.add(rim);sph(g,r*.2,cloth(0xfbf6ec),0,r*1.12,0);}
  else if(id==='beret'){const m=cloth(0xb8283a);const b=sph(g,r*1.05,m,r*.15,r*.62,.02,1.12,.36,1.1);b.rotation.z=-.25;cyl(g,.02,.02,.06,6,m,r*.1,r*.92,0);}
  else if(id==='cap'){const m=cloth(0x2a3a6a);const cap=new THREE.Mesh(new THREE.SphereGeometry(r*1.06,24,12,0,PI*2,0,PI*.47),m);cap.position.y=r*.06;g.add(cap);const br=box(g,r*1.1,.03,r*.8,m,0,r*.18,-r*1.15);br.rotation.x=-.12;sph(g,r*.08,m,0,r*1.12,0);}
  else if(id==='jobawi'){const silk=std(0x1e1a24,{emissive:0x080608,side:THREE.DoubleSide});const band=new THREE.Mesh(new THREE.CylinderGeometry(r*1.02,r*1.08,r*.5,26,1,true),silk);band.position.y=r*.62;g.add(band);
    [-1,1].forEach(s=>sph(g,r*.3,silk,s*r*.95,r*.15,r*.12,.4,1.2,.9));for(let k=0;k<3;k++){const t=cyl(g,.012,.012,r*.7,4,std([0xc4384a,0xe6b850,0x3f8a5a][k]),-r*.15+k*r*.15,r*.35,-r*1.13);}sph(g,r*.1,std(0xe6b850,{emissive:0x3a2a08}),0,r*.78,-r*1.1);sph(g,r*.08,std(0xc4384a),0,r*.55,-r*1.13);}
  else if(id==='jokduri'){const m=std(0x1e1a24,{emissive:0x080608});const c=cyl(g,r*.42,r*.32,r*.38,6,m,0,r*1.02,0);[0,1,2,3,4,5].forEach(k=>{const a=k/6*PI*2;sph(g,r*.06,std([0xc4384a,0x3f8a9a,0xe6b850][k%3],{emissive:0x2a1a08}),Math.cos(a)*r*.38,r*1.05,Math.sin(a)*r*.38);});sph(g,r*.1,std(0xe6b850,{emissive:0x3a2a08}),0,r*1.28,0);}
  else if(id==='hwagwan'){const ring=new THREE.Mesh(new THREE.TorusGeometry(r*.92,r*.05,6,28),std(0x5a8a4a));ring.rotation.x=PI/2-.12;ring.position.y=r*.72;g.add(ring);for(let k=0;k<10;k++){const a=k/10*PI*2;const c=[0xf2a8b8,0xf2d070,0xfbf6ec,0xb8a8e8][k%4];sph(g,r*.13,std(c,{emissive:new THREE.Color(c).multiplyScalar(.2)}),Math.cos(a)*r*.92,r*.72+Math.sin(a)*r*.11,Math.sin(a)*r*.92,1,.6,1);}}
}
function buildAcc(A,id){const F=A.fit||{};const B=A.bob;
  if(id==='glasses'||id==='sunglasses'){const {g,r}=headAnchor(A);const fr=std(id==='glasses'?0x5a3a24:0x1a1a1e);const lens=id==='sunglasses'?new THREE.MeshToonMaterial({color:0x1a1a24,gradientMap:GRAD,transparent:true,opacity:.85}):null;
    [-1,1].forEach(s=>{const x=s*r*.4,y=r*.05,z=-r*.93;const ring=new THREE.Mesh(new THREE.TorusGeometry(r*.17,r*.022,6,20),fr);ring.position.set(x,y,z-.02);ring.rotation.y=s*.3;g.add(ring);if(lens){const d=new THREE.Mesh(new THREE.CircleGeometry(r*.16,18),lens);d.position.set(x,y,z-.025);d.rotation.y=s*.3+PI;g.add(d);}const arm=box(g,.012,.012,r*.7,fr,s*r*.62,y,-r*.6);arm.rotation.y=-s*.35;});box(g,r*.22,.012,.012,fr,0,r*.08,-r*.99);}
  else if(id==='flowerpin'){const {g,r}=headAnchor(A);for(let k=0;k<5;k++){const a=k/5*PI*2;sph(g,r*.07,std(0xf2a8b8,{emissive:0x401820}),r*.62+Math.cos(a)*r*.07,r*.5+Math.sin(a)*r*.07,-r*.42);}sph(g,r*.05,std(0xf2d070),r*.62,r*.5,-r*.45);}
  else if(id==='headphones'){const {g,r}=headAnchor(A);const m=std(0xf2ead8,{emissive:0x3a362c});const band=new THREE.Mesh(new THREE.TorusGeometry(r*1.06,r*.06,8,24,PI),m);band.position.y=r*.1;g.add(band);[-1,1].forEach(s=>{const cup=cyl(g,r*.22,r*.22,r*.14,18,std(0xd88a7a),s*r*1.04,r*.02,0);cup.rotation.z=PI/2;});}
  else if(id==='scarf'){if(!F.neck)return;const m=cloth(0xc4384a,'knit');const t=new THREE.Mesh(new THREE.TorusGeometry((F.r1||.3)*.85,.07,8,22),m);t.rotation.x=PI/2;t.position.y=F.neck;B.add(t);box(B,.1,.32,.05,m,.1,F.neck-.18,-(F.r1||.3)*.95).rotation.z=.1;}
  else if(id==='norigae'){if(!F.y0)return;const y=F.y0+(F.y1-F.y0)*.35,z=-(F.r0||.3)*1.1;const knot=sph(B,.05,std(0xc4384a),(F.r0||.3)*.5,y,z);const jade=sph(B,.045,std(0x8fd3bd,{emissive:0x2a5a4a}),(F.r0||.3)*.5,y-.08,z,1,1.2,.6);for(let k=0;k<5;k++)cyl(B,.008,.008,.2,4,std([0xc4384a,0x3f8a9a,0xe6b850][k%3]),(F.r0||.3)*.5-.03+k*.015,y-.22,z);}
  else if(id==='backpack'){if(!F.y0)return;const m=cloth(0xe0a84a);const z=(F.r0||.3)+.1;const bp=box(B,(F.r1||.3)*1.2,(F.y1-F.y0)*.7,.18,m,0,F.y0+(F.y1-F.y0)*.48,z);box(B,(F.r1||.3)*.9,(F.y1-F.y0)*.25,.06,cloth(0xc8903a),0,F.y0+(F.y1-F.y0)*.3,z+.11);[-1,1].forEach(s=>box(B,.04,(F.y1-F.y0)*.7,.03,cloth(0x8a5a2a),s*(F.r1||.3)*.5,F.y0+(F.y1-F.y0)*.55,-(F.r1||.3)*1.0));}
  else if(id==='crossbag'){if(!F.y0)return;const m=cloth(0xf2ead8);const st=new THREE.Mesh(new THREE.TorusGeometry((F.r1||.3)*1.12,.018,6,28),cloth(0x8a6a4a));st.rotation.set(PI/2,.7,0);st.position.y=F.y0+(F.y1-F.y0)*.55;B.add(st);box(B,.26,.28,.06,m,(F.r0||.3)*.95,F.y0+(F.y1-F.y0)*.15,-.05).rotation.y=-.6;}}
