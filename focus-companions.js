/* 몽원학당: supplied 6 companion PNGs + state-driven CSS motion.
 * Independent from main AVATARS; uses the existing ST.pet/localStorage/Firebase selection.
 * Does not modify TM elapsed time, logging, rewards, or cloud synchronization.
 */
(function(){
  'use strict';
  const PREFIX='assets/companions/characters/';
  const OPTIONS=[
    {id:'haetae',pet:'haetae',name:'해태'},
    {id:'magpie',pet:'kkachi',name:'까치'},
    {id:'jangseung',pet:'jangseung',name:'장승'},
    {id:'phoenix',pet:'phoenix',name:'불사조'},
    {id:'cerberus',pet:'cerberus',name:'케르베로스'},
    {id:'gumiho',pet:'gumiho',name:'구미호'}
  ];
  const LOOKUP=Object.fromEntries(OPTIONS.map(x=>[x.pet,x]));
  LOOKUP['jangseung-m']=LOOKUP.jangseung;
  LOOKUP['jangseung-f']=LOOKUP.jangseung;
  const LABELS={idle:'기본',focus:'집중 중',rest:'쉬는 중',paused:'일시정지',success:'집중 완료!'};
  const image=document.getElementById('focusCompanionImage');
  const panel=document.getElementById('focusCompanion');
  const chooser=document.getElementById('focusCompanionChoices');
  const toggle=document.getElementById('focusCompanionChange');
  const portrait=document.getElementById('focusCompanionPortrait');
  const mini=document.getElementById('focusCompanionMini');
  const miniImage=document.getElementById('focusCompanionMiniImage');
  const name=document.getElementById('focusCompanionName');
  const status=document.getElementById('focusCompanionStatus');
  if(!image||!panel||!chooser||!toggle||!portrait||!name||!status)return;
  const pngUrl=id=>PREFIX+id+'.png';
  const thumbUrl=petId=>typeof window.thumbOf==='function'?window.thumbOf('pet',petId):'';
  window.focusCompanionAsset=petId=>LOOKUP[petId]?pngUrl(LOOKUP[petId].id):'';
  window.focusCompanionThumb=petId=>thumbUrl(petId);
  window.focusCompanionOptions=OPTIONS.map(({id,name})=>({id,name}));
  function applyImage(img,src,fallback,alt,state,charId){
    if(!img)return;
    img.onerror=null;
    img.dataset.failed='';
    img.alt=alt||'';
    if(charId)img.dataset.character=charId;
    if(state)img.dataset.state=state;
    img.onerror=()=>{
      if(fallback&&img.dataset.failed!=='1'&&img.getAttribute('src')!==fallback){
        img.dataset.failed='1';img.setAttribute('src',fallback);return;
      }
      img.closest('.fc-portrait,.fc-mini,.fc-choice-preview')?.setAttribute('data-missing','1');
    };
    img.closest('.fc-portrait,.fc-mini,.fc-choice-preview')?.removeAttribute('data-missing');
    if(img.getAttribute('src')!==src)img.setAttribute('src',src);
  }
  function stateOfTimer(){
    if(typeof TM==='undefined')return 'idle';
    if(TM.done&&TM.sessionId)return 'success';
    if(TM.run)return 'focus';
    if(TM.sessionId&&!TM.run)return 'paused';
    if(typeof ST!=='undefined'&&ST.sitting>=0)return 'rest';
    return 'idle';
  }
  function closePicker(){chooser.hidden=true;panel.closest('#timer')?.classList.remove('fc-open');toggle.setAttribute('aria-expanded','false');toggle.textContent='친구 선택';}
  function buildPicker(){
    const fragment=document.createDocumentFragment();
    const all=[{id:'none',pet:'none',name:'데리고 다니지 않기'},...OPTIONS];
    for(const option of all){
      const b=document.createElement('button');b.type='button';b.className='fc-choice';
      b.dataset.companion=option.id;b.title=option.name;
      const preview=document.createElement('span');preview.className='fc-choice-preview';
      if(option.id!=='none'){
        const img=document.createElement('img');img.alt='';img.loading='lazy';img.decoding='async';
        applyImage(img,pngUrl(option.id),thumbUrl(option.pet),option.name,'idle',option.id);
        preview.appendChild(img);
      }else preview.textContent='—';
      const label=document.createElement('span');label.textContent=option.name;
      b.append(preview,label);fragment.appendChild(b);
    }
    chooser.appendChild(fragment);
  }
  let previousKey='';
  function render(){
    const current=typeof ST==='undefined'?null:LOOKUP[ST.pet];
    const state=stateOfTimer();
    const key=(current?current.id:'none')+'|'+state;
    if(key===previousKey)return;
    previousKey=key;
    panel.dataset.state=state;
    status.textContent=current?LABELS[state]:'친구를 고르면 함께 집중해요';
    name.textContent=current?current.name:'반려 친구 없음';
    portrait.hidden=!current;
    if(mini)mini.hidden=!current;
    if(current){
      const src=pngUrl(current.id),fallback=thumbUrl(current.pet);
      applyImage(image,src,fallback,current.name,state,current.id);
      // Reapply CSS state so success/paused transitions do not reuse stale animations.
      image.dataset.state=state;
      if(miniImage){
        applyImage(miniImage,src,fallback,current.name,state,current.id);
        miniImage.dataset.character=current.id;miniImage.dataset.state=state;
      }
    }
    for(const b of chooser.querySelectorAll('[data-companion]')){
      const selected=(current?current.id:'none')===b.dataset.companion;
      b.classList.toggle('on',selected);
      b.setAttribute('aria-pressed',String(selected));
    }
  }
  chooser.addEventListener('click',event=>{
    const b=event.target.closest('[data-companion]');if(!b)return;
    const pick=b.dataset.companion;
    const option=OPTIONS.find(x=>x.id===pick);
    const id=option?option.pet:'none';
    if(typeof setPet==='function')setPet(id);
    previousKey='';render();closePicker();
    if(typeof renderAvatars==='function')renderAvatars();
  });
  toggle.addEventListener('click',()=>{
    const opening=chooser.hidden;
    chooser.hidden=!opening;
    panel.closest('#timer')?.classList.toggle('fc-open',opening);
    toggle.setAttribute('aria-expanded',String(opening));
    toggle.textContent=opening?'선택 닫기':'친구 선택';
  });
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!chooser.hidden)closePicker();});
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)render();});
  window.addEventListener('focus',render);
  window.addEventListener('pageshow',render);
  // Handle selection coming from other tabs using the already existing 'unseo.pet' key.
  window.addEventListener('storage',event=>{
    if(event.key==='unseo.pet'&&typeof LS!=='undefined'&&typeof ST!=='undefined'){
      const pet=LS.get('pet','none');
      if(pet!==ST.pet&&typeof setPet==='function')setPet(pet,true);
      previousKey='';render();
    }
  });
  // Per-image fallback is handled in applyImage(); do not hide the panel on the first load error.
  buildPicker();render();
  window.renderFocusCompanion=render;
})();
