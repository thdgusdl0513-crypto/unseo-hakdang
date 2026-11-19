/* 운서학당 · sound mixer: nature layers, hourly temple bell, generative piano / jazz / waltz */
const SND=Object.assign({on:false,vol:.85,rain:0,wind:.35,snow:0,whistle:0,gayageum:.45,fire:0,bell:true,music:'piano',mvol:.55},LS.get('snd',{}));SND.on=false;
const LAYERS=[['rain','빗소리','🌧'],['wind','바람 소리','🍃'],['snow','눈 내리는 소리','❄️'],['whistle','휘파람','🎶'],['gayageum','가야금 풍경','🪕'],['fire','타닥타닥 장작','🔥']];
const MUSIC=[['none','없음'],['piano','피아노'],['jazz','재즈'],['waltz','왈츠']];
let actx=null,master=null,verb=null,nbuf=null,musicBus=null,bellBus=null,unlockEl=null;const bus={};
const saveSnd=()=>{const o=Object.assign({},SND);delete o.on;LS.set('snd',o);};
const mtof=m=>440*Math.pow(2,(m-69)/12);
function silentWavURL(){const sr=8000,n=sr/2,b=new ArrayBuffer(44+n*2),v=new DataView(b);const w=(o,s)=>{for(let i=0;i<s.length;i++)v.setUint8(o+i,s.charCodeAt(i));};w(0,'RIFF');v.setUint32(4,36+n*2,true);w(8,'WAVE');w(12,'fmt ');v.setUint32(16,16,true);v.setUint16(20,1,true);v.setUint16(22,1,true);v.setUint32(24,sr,true);v.setUint32(28,sr*2,true);v.setUint16(32,2,true);v.setUint16(34,16,true);w(36,'data');v.setUint32(40,n*2,true);return URL.createObjectURL(new Blob([b],{type:'audio/wav'}));}
function unlockIOS(){try{if(navigator.audioSession)navigator.audioSession.type='playback';}catch(e){}try{if(!unlockEl){unlockEl=new Audio(silentWavURL());unlockEl.loop=true;unlockEl.setAttribute('playsinline','');}unlockEl.play().catch(()=>{});}catch(e){}}
function initAudio(){if(actx)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;actx=new AC();
  const comp=actx.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;comp.connect(actx.destination);master=actx.createGain();master.gain.value=0;master.connect(comp);
  const len=actx.sampleRate*2.8,ir=actx.createBuffer(2,len,actx.sampleRate);for(let c=0;c<2;c++){const d=ir.getChannelData(c);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6);}verb=actx.createConvolver();verb.buffer=ir;const vg=actx.createGain();vg.gain.value=.32;verb.connect(vg);vg.connect(master);
  const n=actx.sampleRate*4;nbuf=actx.createBuffer(1,n,actx.sampleRate);const d=nbuf.getChannelData(0);let last=0;for(let i=0;i<n;i++){const wv=Math.random()*2-1;last=(last+.02*wv)/1.02;d[i]=wv*.6+last*3;}
  LAYERS.forEach(([k])=>{bus[k]=actx.createGain();bus[k].gain.value=0;bus[k].connect(master);});
  const loop=(type,f,q,g,dest)=>{const s=actx.createBufferSource();s.buffer=nbuf;s.loop=true;s.playbackRate.value=.9+Math.random()*.2;const fl=actx.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const gn=actx.createGain();gn.gain.value=g;s.connect(fl);fl.connect(gn);gn.connect(dest);s.start();return {fl,gn};};
  const r1=loop('highpass',1200,.5,.35,bus.rain);const r2=loop('lowpass',4200,.4,.16,bus.rain);r1.gn.disconnect();r1.gn.connect(r2.fl);
  const wd=loop('bandpass',380,.8,.5,bus.wind);const lfo=actx.createOscillator();lfo.frequency.value=.06;const lg=actx.createGain();lg.gain.value=220;lfo.connect(lg);lg.connect(wd.fl.frequency);const lfo2=actx.createOscillator();lfo2.frequency.value=.11;const lg2=actx.createGain();lg2.gain.value=.25;lfo2.connect(lg2);lg2.connect(wd.gn.gain);lfo.start();lfo2.start();
  loop('lowpass',420,.3,.22,bus.snow);loop('lowpass',700,.5,.18,bus.fire);
  musicBus=actx.createGain();musicBus.connect(master);musicBus.connect(verb);bellBus=actx.createGain();bellBus.gain.value=.7;bellBus.connect(master);bellBus.connect(verb);
  bus.gayageum.connect(verb);bus.whistle.connect(verb);applyMix();setInterval(tick,90);}
function applyMix(){if(!actx)return;const t=actx.currentTime;master.gain.setTargetAtTime(SND.on?SND.vol:0,t,.25);LAYERS.forEach(([k])=>bus[k].gain.setTargetAtTime(+SND[k]||0,t,.3));musicBus.gain.setTargetAtTime(SND.mvol,t,.3);}
function setSound(on){if(on){unlockIOS();initAudio();if(!actx)return;try{actx.resume();}catch(e){}}SND.on=on;LS.set('sndOn',on);applyMix();renderSoundUI();}
function soundForSpace(){}

/* ---------- instruments ---------- */
function envG(t,a,peak,dec){const g=actx.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(peak,t+a);g.gain.exponentialRampToValueAtTime(.0001,t+a+dec);return g;}
function piano(m,t,v,dest,dur){const f=mtof(m);dur=dur||2.4;const lp=actx.createBiquadFilter();lp.type='lowpass';lp.frequency.setValueAtTime(Math.min(9000,f*7),t);lp.frequency.exponentialRampToValueAtTime(Math.max(300,f*1.4),t+1.4);const g=envG(t,.006,v,dur);lp.connect(g);g.connect(dest||musicBus);
  [[1,'triangle',1],[2,'sine',.4],[3,'sine',.14],[4.02,'sine',.06]].forEach(([h,ty,a])=>{const o=actx.createOscillator();o.type=ty;o.frequency.value=f*h;o.detune.value=(Math.random()-.5)*5;const og=actx.createGain();og.gain.value=a;o.connect(og);og.connect(lp);o.start(t);o.stop(t+dur+.1);});}
function rhodes(m,t,v,dur){const f=mtof(m);const g=envG(t,.012,v,dur||1.6);const trem=actx.createOscillator();trem.frequency.value=4.5;const tg=actx.createGain();tg.gain.value=v*.25;trem.connect(tg);tg.connect(g.gain);trem.start(t);trem.stop(t+(dur||1.6)+.1);
  [[1,1],[2,.22],[3.01,.05]].forEach(([h,a])=>{const o=actx.createOscillator();o.type='sine';o.frequency.value=f*h;const og=actx.createGain();og.gain.value=a;o.connect(og);og.connect(g);o.start(t);o.stop(t+(dur||1.6)+.1);});g.connect(musicBus);}
function bassN(m,t,v,dur){const o=actx.createOscillator();o.type='triangle';o.frequency.value=mtof(m);const lp=actx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=700;const g=envG(t,.008,v,dur||.6);o.connect(lp);lp.connect(g);g.connect(musicBus);o.start(t);o.stop(t+(dur||.6)+.1);}
function brush(t,v){const s=actx.createBufferSource();s.buffer=nbuf;const hp=actx.createBiquadFilter();hp.type='highpass';hp.frequency.value=6500;const g=envG(t,.004,v,.12);s.connect(hp);hp.connect(g);g.connect(musicBus);s.start(t,Math.random()*3,.2);}
function pluck(f,t,v,dest){const o=actx.createOscillator(),o2=actx.createOscillator(),lp=actx.createBiquadFilter();o.type='triangle';o.frequency.value=f;o2.type='sine';o2.frequency.value=f*2.01;lp.type='lowpass';lp.frequency.setValueAtTime(2600,t);lp.frequency.exponentialRampToValueAtTime(500,t+1.5);const g=envG(t,.006,v,2.6);o.connect(lp);o2.connect(lp);lp.connect(g);g.connect(dest);o.start(t);o2.start(t);o.stop(t+2.7);o2.stop(t+2.7);if(Math.random()<.3){o.frequency.setValueAtTime(f,t+.25);o.frequency.linearRampToValueAtTime(f*1.06,t+.45);o.frequency.linearRampToValueAtTime(f,t+.75);}}
function tinkle(f,t,v,dest,dec){const o=actx.createOscillator();o.type='sine';o.frequency.value=f;const g=envG(t,.004,v,dec||.6);o.connect(g);g.connect(dest);o.start(t);o.stop(t+(dec||.6)+.05);}
function burst(t,v,hpF,len,dest){const s=actx.createBufferSource();s.buffer=nbuf;const hp=actx.createBiquadFilter();hp.type='highpass';hp.frequency.value=hpF;const g=envG(t,.002,v,len);s.connect(hp);hp.connect(g);g.connect(dest);s.start(t,Math.random()*3,len+.05);}
function whistlePhrase(t){const sc=[79,81,84,86,88,91];const o=actx.createOscillator();o.type='sine';const vib=actx.createOscillator();vib.frequency.value=5.6;const vg=actx.createGain();vg.gain.value=9;vib.connect(vg);vg.connect(o.detune);const g=actx.createGain();g.gain.value=0;o.connect(g);g.connect(bus.whistle);
  let tt=t,idx=Math.floor(Math.random()*sc.length);const n=4+Math.floor(Math.random()*4);o.frequency.setValueAtTime(mtof(sc[idx]),t);g.gain.setValueAtTime(0,t);
  for(let i=0;i<n;i++){idx=Math.max(0,Math.min(sc.length-1,idx+[-2,-1,1,1,2][Math.floor(Math.random()*5)]));const d=[.28,.38,.55][Math.floor(Math.random()*3)];o.frequency.setTargetAtTime(mtof(sc[idx]),tt,.035);g.gain.setTargetAtTime(.16,tt,.03);g.gain.setTargetAtTime(.1,tt+d*.6,.05);tt+=d;}
  g.gain.setTargetAtTime(0,tt,.08);o.start(t);vib.start(t);o.stop(tt+.6);vib.stop(tt+.6);return tt-t;}
function templeBell(t,v){const base=82.4;[[1,1,10],[1.006,.6,10],[2.0,.55,7],[2.76,.4,5.5],[4.07,.22,4],[5.4,.14,3],[8.9,.06,1.8]].forEach(([r,a,d])=>{const o=actx.createOscillator();o.type='sine';o.frequency.value=base*r;const g=envG(t,.02,a*v,d);o.connect(g);g.connect(bellBus);o.start(t);o.stop(t+d+.1);});burst(t,.12*v,200,.15,bellBus);}
function ringHour(n){if(!actx)return;const t=actx.currentTime+.1;for(let i=0;i<n;i++)templeBell(t+i*4.2,.9);}

/* rain: 톡톡 taps on eaves and window, 타닥 bursts, occasional drip */
function rainDrop(t){const r=Math.random();
  if(r<.55){const s=actx.createBufferSource();s.buffer=nbuf;const bp=actx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=1400+Math.random()*2600;bp.Q.value=5+Math.random()*4;const g=envG(t,.0015,.06+Math.random()*.1,.018+Math.random()*.02);s.connect(bp);bp.connect(g);g.connect(bus.rain);s.start(t,Math.random()*3,.06);}
  else if(r<.9){const o=actx.createOscillator();o.type='sine';const f=900+Math.random()*900;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*.62,t+.035);const g=envG(t,.001,.05+Math.random()*.07,.04);o.connect(g);g.connect(bus.rain);o.start(t);o.stop(t+.06);}
  else{for(let k=0;k<3;k++){const s=actx.createBufferSource();s.buffer=nbuf;const bp=actx.createBiquadFilter();bp.type='bandpass';bp.frequency.value=2200+Math.random()*1500;bp.Q.value=6;const tt=t+k*(.03+Math.random()*.03);const g=envG(tt,.001,.08,.015);s.connect(bp);bp.connect(g);g.connect(bus.rain);s.start(tt,Math.random()*3,.05);}}}
function drip(t){const o=actx.createOscillator();o.type='sine';const f=520+Math.random()*260;o.frequency.setValueAtTime(f,t);o.frequency.exponentialRampToValueAtTime(f*1.9,t+.05);const g=envG(t,.002,.12,.09);o.connect(g);g.connect(bus.rain);g.connect(verb);o.start(t);o.stop(t+.12);}

/* ---------- generative music ---------- */
const MUS={style:null,next:0,step:0,mel:76};
const PIANO_P=[[48,55,59,64],[45,52,55,60],[41,48,52,57],[43,50,53,59]];
const JAZZ=[{v:[55,58,62,65],w:[43,46,50,49]},{v:[55,58,60,64],w:[48,52,55,40]},{v:[53,57,60,64],w:[41,45,48,50]},{v:[54,57,60,62],w:[38,42,45,44]}];
const WALTZ=[[48,52,55],[43,47,50,53],[43,47,50,53],[48,52,55],[41,45,48],[48,52,55],[43,47,50,53],[48,52,55]];
const near=(m,set)=>set.reduce((a,b)=>Math.abs(b-m)<Math.abs(a-m)?b:a);
function stepDur(st,s){if(st==='piano')return 60/72/2;if(st==='jazz'){const b=60/112;return s%2===0?b*2/3:b/3;}return 60/138;}
function musicStep(st,s,t){
  if(st==='piano'){const bar=Math.floor(s/8)%4,i=s%8,ch=PIANO_P[bar];const pat=[0,1,2,3,2,1,2,3];piano(ch[pat[i]]+12,t,.09,null,1.8);if(i===0){piano(ch[0]-12,t,.16,null,3.2);piano(ch[0],t,.08,null,3);}
    if((i===0||i===3||i===6)&&Math.random()<.6){const sc=[72,74,76,79,81,84];MUS.mel=near(MUS.mel+[-3,-2,2,3,0][Math.floor(Math.random()*5)],sc);piano(MUS.mel,t+.01,.13,null,2.2);}}
  else if(st==='jazz'){const bar=Math.floor(s/8)%4,i=s%8,c=JAZZ[bar];if(i%2===0)bassN(c.w[i/2],t,.22,.5);
    if([0,2,3,4,6,7].includes(i))brush(t,i%2?.045:.07);if((i===3||(i===7&&Math.random()<.5)))c.v.forEach(m=>rhodes(m,t,.045,1.1));if(i===0&&Math.random()<.4)c.v.forEach(m=>rhodes(m,t,.04,1.4));
    if(Math.random()<.22){const sc=[65,67,68,69,72,74,77];rhodes(sc[Math.floor(Math.random()*sc.length)]+12,t,.06,.7);}}
  else{const bar=Math.floor(s/3)%8,i=s%3,ch=WALTZ[bar];if(i===0){piano(ch[0]-12,t,.17,null,1.4);const tones=ch.map(m=>m+24).concat(ch.map(m=>m+12)).filter(m=>m>=67&&m<=86);MUS.mel=near(MUS.mel+[-2,-1,1,2][Math.floor(Math.random()*4)],tones);piano(MUS.mel,t,.15,null,1.6);}
    else{ch.forEach(m=>piano(m+12,t,.045,null,.5));if(i===2&&Math.random()<.45){MUS.mel+=Math.random()<.5?1:-1;piano(MUS.mel,t,.09,null,.6);}}}}
function musicTick(){if(SND.music==='none'||!SND.mvol){MUS.style=null;return;}const now=actx.currentTime;if(MUS.style!==SND.music||MUS.next<now-.5){MUS.style=SND.music;MUS.step=0;MUS.next=now+.15;}
  while(MUS.next<now+.4){musicStep(MUS.style,MUS.step,MUS.next);MUS.next+=stepDur(MUS.style,MUS.step);MUS.step++;}}

/* ---------- scheduler ---------- */
let nextG=0,nextW=0,nextDrip=0,lastHourRung=-1;
function tick(){if(!actx||!SND.on)return;const t=actx.currentTime;
  if(SND.rain>0){const n=1+Math.floor(Math.random()*3);for(let i=0;i<n;i++)rainDrop(t+.02+Math.random()*.09);if(t>nextDrip){drip(t+.05);nextDrip=t+.9+Math.random()*1.6;}}
  if(SND.snow>0&&Math.random()<.035)tinkle([2093,2349,2637,3136,3520][Math.floor(Math.random()*5)],t,.035,bus.snow,1.4);
  if(SND.fire>0&&Math.random()<.18)burst(t+Math.random()*.08,.25*Math.random()+.05,1800,.02+Math.random()*.03,bus.fire);
  if(SND.gayageum>0&&t>nextG){const P=[293.66,329.63,392,440,493.88,587.33,659.25,783.99];pluck(P[Math.floor(Math.random()*P.length)],t,.12,bus.gayageum);nextG=t+1.6+Math.random()*3;}
  if(SND.whistle>0&&t>nextW){const len=whistlePhrase(t+.05);nextW=t+len+5+Math.random()*7;}
  musicTick();
  const d=new Date();if(SND.bell&&d.getMinutes()===0&&d.getSeconds()<6&&lastHourRung!==d.getHours()){lastHourRung=d.getHours();ringHour(d.getHours()%12||12);toast(`🔔 ${d.getHours()}시 정각이에요`);}}
function chime(){if(!actx||!SND.on)return;const t=actx.currentTime;[1568,1760,2093,2349].forEach((f,i)=>tinkle(f,t+i*.11,.04,master,2.2));}

/* ---------- UI ---------- */
function renderSoundUI(){const el=$('#sndBody');$('#sndState').textContent=SND.on?'소리 켜짐':'소리 꺼짐';$('#sndTile').classList.toggle('on',SND.on);if(!el)return;
  el.innerHTML=`<button class="bigSw ${SND.on?'on':''}" id="sMaster"><span>${SND.on?'🔊':'🔇'}</span>${SND.on?'소리 켜짐 · 누르면 꺼요':'소리 꺼짐 · 누르면 켜요'}</button>
  <div class="slRow"><span>전체 볼륨</span><input type="range" min="0" max="100" value="${Math.round(SND.vol*100)}" data-k="vol"></div>
  <div class="sec">음악</div><div class="seg">${MUSIC.map(m=>`<button data-music="${m[0]}" class="${SND.music===m[0]?'on':''}">${m[1]}</button>`).join('')}</div>
  <div class="slRow"><span>음악 볼륨</span><input type="range" min="0" max="100" value="${Math.round(SND.mvol*100)}" data-k="mvol"></div>
  <div class="sec">자연의 소리 · 섞어서 들을 수 있어요</div>
  ${LAYERS.map(([k,n,e])=>`<div class="slRow"><button class="mini ${SND[k]>0?'on':''}" data-tg="${k}">${e}</button><span>${n}</span><input type="range" min="0" max="100" value="${Math.round((+SND[k]||0)*100)}" data-k="${k}"></div>`).join('')}
  <div class="sec">정각 종소리</div><div class="slRow"><button class="mini ${SND.bell?'on':''}" data-bell="1">🔔</button><span>매시 정각, 시각만큼 범종이 울려요</span><button class="ghost" id="bellTry">들어보기</button></div>
  <div class="empty">iPhone 무음 모드에서도 들리도록 해 두었어요. 그래도 안 들리면 기기 볼륨을 올려 주세요.</div>`;}
document.addEventListener('click',e=>{const sheet=e.target.closest('#sndBody');if(!sheet)return;const b=e.target.closest('button');if(!b)return;
  if(b.id==='sMaster'){setSound(!SND.on);return;}
  if(b.dataset.music){SND.music=b.dataset.music;if(!SND.on)setSound(true);saveSnd();renderSoundUI();return;}
  if(b.dataset.tg){const k=b.dataset.tg;SND[k]=SND[k]>0?0:.5;if(!SND.on)setSound(true);saveSnd();applyMix();renderSoundUI();return;}
  if(b.dataset.bell){SND.bell=!SND.bell;saveSnd();renderSoundUI();return;}
  if(b.id==='bellTry'){if(!SND.on)setSound(true);ringHour(1);}});
document.addEventListener('input',e=>{const r=e.target.closest('#sndBody input[type=range]');if(!r)return;const k=r.dataset.k;SND[k]=r.value/100;saveSnd();applyMix();const mb=r.parentNode.querySelector('.mini');if(mb)mb.classList.toggle('on',SND[k]>0);});
const wantOn=LS.get('sndOn',false);if(wantOn){const once=()=>{document.removeEventListener('pointerdown',once,true);if(!SND.on)setSound(true);};document.addEventListener('pointerdown',once,true);}
