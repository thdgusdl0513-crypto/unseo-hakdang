/* 송현학당 · 학급 기능: 선생님 화면(출석·공부 시간), 강의실 이름, 채팅 시간, 입장 시간 */
const CLS_DEF={rooms:{},chat:'on',ch:[8,22],lock:'off',lk:[23,6]};
let CLS=JSON.parse(JSON.stringify(CLS_DEF)),clsSub=false;
const RKEYS=[['basics','강의실 1'],['potion','강의실 2'],['herbs','강의실 3'],['training','강의실 4'],['library','도서관'],['dorm','기숙사']];
const hh=h=>`${h}시`;
function inHours(a,b,h){return a<=b?(h>=a&&h<b):(h>=a||h<b);}
function chatOpen(){if(ADMIN_ON)return true;if(CLS.chat==='off')return false;if(CLS.chat==='hours')return inHours(+CLS.ch[0],+CLS.ch[1],new Date().getHours());return true;}
function isLocked(){if(ADMIN_ON||CLS.lock!=='on')return false;return inHours(+CLS.lk[0],+CLS.lk[1],new Date().getHours());}

function applyRooms(){let changed=false;RKEYS.forEach(([k])=>{const v=(CLS.rooms||{})[k];const D=ROOM_DEF[k];if(!D)return;const nm=(typeof v==='string'&&v.trim())?v.trim().slice(0,14):D.name;
    if(ROOMS[k].name!==nm){ROOMS[k].name=nm;changed=true;}if(SUBJ[k])SUBJ[k][0]=nm;const b=document.querySelector(`#mapList [data-go="${k}"] b`);if(b)b.textContent=nm;});
  if(changed&&typeof rebuildSeason==='function'&&SP)rebuildSeason();}
function applyChat(){const i=$('#chatIn');if(!i)return;const open=chatOpen();i.disabled=!open;$('#chatSend').disabled=!open;
  i.placeholder=open?'반 친구들에게 한마디':CLS.chat==='off'?'선생님이 채팅을 잠시 닫았어요':`채팅은 ${hh(CLS.ch[0])}~${hh(CLS.ch[1])}에 열려요`;}
function applyLock(){const el=$('#closed');if(!el)return;const L=isLocked();el.classList.toggle('show',L);if(L)$('#closedTxt').innerHTML=`지금은 학당 문이 닫혀 있어요<br><small>${hh(CLS.lk[1])}에 다시 열려요 · 푹 쉬고 내일 만나요 🌙</small>`;}
function applyCls(){applyRooms();applyChat();applyLock();}
setInterval(()=>{if(!clsSub&&typeof DB!=='undefined'&&DB&&MODE==='shared'){clsSub=true;DB.doc('settings/class').onSnapshot(d=>{const v=(d&&d.exists&&d.data())||{};CLS=Object.assign(JSON.parse(JSON.stringify(CLS_DEF)),v);const arr=(x,d)=>x&&typeof x==='object'&&x[0]!=null&&x[1]!=null?[+x[0],+x[1]]:d;CLS.ch=arr(CLS.ch,CLS_DEF.ch);CLS.lk=arr(CLS.lk,CLS_DEF.lk);applyCls();if($('#teacher').classList.contains('show'))renderTeacher(true);},()=>{});}
  applyChat();applyLock();const t=$('#tTile');if(t)t.hidden=!ADMIN_ON;},1500);

/* ---------- 선생님 화면 ---------- */
function weekStart(){const d=new Date();const wd=(d.getDay()+6)%7;d.setHours(0,0,0,0);d.setDate(d.getDate()-wd);return d.getTime();}
function classStats(){const now=new Date(),tk=dkey(now),mp=tk.slice(0,8);const w0=weekStart(),m0=new Date(now.getFullYear(),now.getMonth(),1).getTime();
  const ids=new Set([...Object.keys(MEMBERS||{}),...Object.keys(STAMPS||{})]);(DATA.logs||[]).forEach(l=>l.by&&ids.add(l.by));
  const rows=[...ids].filter(id=>id&&id!=='me').map(id=>{const days=(STAMPS[id]&&STAMPS[id].days)||{};const ks=Object.keys(days);
    const logs=(DATA.logs||[]).filter(l=>l.by===id);const sum=f=>Math.round(logs.filter(f).reduce((a,l)=>a+(+l.sec||0),0)/60);
    const books=(DATA.books||[]).filter(b=>b.by===id).length;const last=Math.max(0,...logs.map(l=>l.ts||0),(STAMPS[id]&&STAMPS[id].ts)||0,(MEMBERS[id]&&MEMBERS[id].ts)||0);
    return {id,nick:nameOf(id),today:!!days[tk],memo:days[tk]&&days[tk].m||'',mDays:ks.filter(k=>k.startsWith(mp)).length,aDays:ks.length,wMin:sum(l=>l.ts>=w0),mMin:sum(l=>l.ts>=m0),aMin:sum(()=>true),books,last,me:id===MYID};});
  rows.sort((a,b)=>a.nick.localeCompare(b.nick,'ko'));return rows;}
const fmtMin=m=>m>=60?`${Math.floor(m/60)}시간 ${m%60}분`:`${m}분`;
let tSort='name';
function renderTeacher(keepForm){const el=$('#tBody');if(!el)return;if(!ADMIN_ON){el.innerHTML='<div class="empty">설정 → 연결에서 선생님 코드를 넣으면 볼 수 있어요.</div>';return;}
  let R=classStats().filter(r=>!r.me);if(tSort==='att')R.sort((a,b)=>b.mDays-a.mDays);else if(tSort==='study')R.sort((a,b)=>b.wMin-a.wMin);
  const todayN=R.filter(r=>r.today).length,wSum=R.reduce((a,r)=>a+r.wMin,0);
  $('#tSum').innerHTML=`<div><small>학생</small><b>${R.length}</b>명</div><div><small>오늘 출석</small><b>${todayN}</b>명</div><div><small>이번 주 공부</small><b>${Math.round(wSum/60)}</b>시간</div>`;
  el.innerHTML=R.length?R.map(r=>`<div class="tRow"><div class="tName"><b>${esc(r.nick)}</b><span class="${r.today?'ok':'no'}">${r.today?'오늘 출석':'미출석'}</span></div>${r.memo?`<div class="tMemo">“${esc(r.memo)}”</div>`:''}
    <div class="tNums"><span>출석 <b>${r.mDays}</b>일<small>이번 달</small></span><span><b>${fmtMin(r.wMin)}</b><small>이번 주 공부</small></span><span><b>${fmtMin(r.aMin)}</b><small>누적 공부</small></span><span><b>${r.books}</b>편<small>독후감</small></span></div>
    <div class="tLast">${r.last?'마지막 활동 '+ago(r.last):'아직 활동 없음'}</div></div>`).join(''):'<div class="empty">아직 들어온 학생이 없어요. 학생들에게 링크와 암호를 알려 주세요.</div>';
  if(!keepForm||!$('#tForm').dataset.ready)fillTeacherForm();}
function fillTeacherForm(){const f=$('#tForm');f.dataset.ready='1';
  $('#tRooms').innerHTML=RKEYS.map(([k,lb])=>`<label class="tIn"><span>${lb}</span><input data-room="${k}" maxlength="14" placeholder="${esc(ROOM_DEF[k].name)}" value="${esc((CLS.rooms||{})[k]||'')}"></label>`).join('');
  const hrs=sel=>Array.from({length:24},(_,h)=>`<option value="${h}">${h}시</option>`).join('');
  $('#tChat').value=CLS.chat;$('#tCh0').innerHTML=$('#tCh1').innerHTML=$('#tLk0').innerHTML=$('#tLk1').innerHTML=hrs();
  $('#tCh0').value=CLS.ch[0];$('#tCh1').value=CLS.ch[1];$('#tLock').value=CLS.lock;$('#tLk0').value=CLS.lk[0];$('#tLk1').value=CLS.lk[1];tVis();}
function tVis(){$('#tChH').hidden=$('#tChat').value!=='hours';$('#tLkH').hidden=$('#tLock').value!=='on';}
function csvExport(){const R=classStats().filter(r=>!r.me);const head=['닉네임','오늘 출석','이번 달 출석일','누적 출석일','이번 주 공부(분)','이번 달 공부(분)','누적 공부(분)','독후감 수','마지막 활동'];
  const q=v=>`"${String(v).replace(/"/g,'""')}"`;const lines=[head.map(q).join(',')].concat(R.map(r=>[r.nick,r.today?'O':'',r.mDays,r.aDays,r.wMin,r.mMin,r.aMin,r.books,r.last?new Date(r.last).toLocaleString('ko-KR'):''].map(q).join(',')));
  const blob=new Blob(['﻿'+lines.join('\r\n')],{type:'text/csv;charset=utf-8'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`송현학당_${dkey(new Date())}.csv`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},800);toast('표 파일을 내려받았어요<small>엑셀에서 열 수 있어요</small>');}
document.addEventListener('DOMContentLoaded',()=>{});
(function bindTeacher(){const T=$('#teacher');if(!T)return;
  $('#tSortBar').addEventListener('click',e=>{const b=e.target.closest('[data-s]');if(!b)return;tSort=b.dataset.s;$$('#tSortBar button').forEach(x=>x.classList.toggle('on',x===b));renderTeacher(true);});
  $('#tCsv').addEventListener('click',csvExport);$('#tChat').addEventListener('change',tVis);$('#tLock').addEventListener('change',tVis);
  $('#tSave').addEventListener('click',async()=>{if(!DB||MODE!=='shared'){toast('학당이 연결돼 있어야 저장할 수 있어요');return;}
    const rooms={};$$('#tRooms [data-room]').forEach(i=>{const v=i.value.trim().slice(0,14);if(v)rooms[i.dataset.room]=v;});
    const v={rooms,chat:$('#tChat').value,ch:[+$('#tCh0').value,+$('#tCh1').value],lock:$('#tLock').value,lk:[+$('#tLk0').value,+$('#tLk1').value],ts:Date.now()};
    try{await DB.doc('settings/class').set(v);toast('학급 설정을 저장했어요<small>학생들 화면에도 바로 바뀌어요</small>');}catch(e){toast('저장하지 못했어요<small>선생님 코드가 맞는지 확인해 주세요</small>');}});})();
