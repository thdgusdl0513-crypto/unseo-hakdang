/* ⏰ 집중 끝 알림: 화면을 내려 두었을 때도 알려 주기 (가능한 기기에서만) */
(function(){
  let reg=null;if('serviceWorker' in navigator&&location.protocol!=='file:'){navigator.serviceWorker.register('sw.js').then(r=>{reg=r;}).catch(()=>{});}
  let notified='';
  const due=()=>{try{return TM.sessionId&&TM.run&&TM.targetDuration&&elapsed()>=TM.targetDuration;}catch(e){return false;}};
  async function notify(){if(notified===TM.sessionId)return;notified=TM.sessionId;window.__focusNotified=(window.__focusNotified||0)+1;
    try{if(navigator.vibrate)navigator.vibrate([300,150,300,150,300]);}catch(e){}
    try{if(typeof chime==='function')chime();}catch(e){}
    if(!('Notification' in window)||Notification.permission!=='granted')return;
    const title='⏰ 집중 시간이 끝났어요!',opt={body:'수고했어요 🎉 학당으로 돌아와 기록을 확인해요',tag:'hakdang-focus',renotify:true,icon:'icon-192.png',badge:'icon-192.png',vibrate:[300,150,300]};
    try{const r=reg||(navigator.serviceWorker&&await navigator.serviceWorker.getRegistration());if(r){await r.showNotification(title,opt);return;}}catch(e){}
    try{new Notification(title,opt);}catch(e){}}
  window.__focusNotify=notify;
  try{const _f=finishFocusIfDue;finishFocusIfDue=function(){const r=_f.apply(this,arguments);if(r&&document.hidden)notify();return r;};}catch(e){}
  setInterval(()=>{if(document.hidden&&due())notify();},4000);
  let tmo=null;
  document.addEventListener('visibilitychange',()=>{clearTimeout(tmo);if(document.hidden){try{if(TM.run&&TM.targetDuration){const left=TM.targetDuration-elapsed();if(left>0)tmo=setTimeout(()=>{if(document.hidden&&due())notify();},left+400);}}catch(e){}}});
  /* 처음 ‘시작’을 누를 때 한 번만 알림 허락을 물어봐요 */
  document.addEventListener('click',e=>{if(!e.target.closest('#tmGo'))return;if(!('Notification' in window)||Notification.permission!=='default')return;
    try{Notification.requestPermission().then(p=>{if(p==='granted')toast('🔔 집중이 끝나면 알림으로 알려 줄게요<small>화면을 내려 두어도 알려 줘요</small>');}).catch(()=>{});}catch(_){}},true);
})();
