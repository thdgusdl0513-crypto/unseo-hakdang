/* 메뉴 아이콘과 프로필 초상화 보조 · 기존 학당 데이터는 바꾸지 않음 */
(function(){
 const portraitCache={};
 const colors={girl:'#f7dbc4',boy:'#f5d7bd','cat-black':'#55545e','cat-white':'#f9f7ef','cat-cheese':'#f5bd76','cat-tuxedo':'#54505c',corgi:'#f6c385',jindo:'#f6e9cb',sapsal:'#eae5d7',maltese:'#fffaf4',frog:'#aad397',turtle:'#b7d7a0',bird:'#fbf8ea',peacock:'#82b9b4',crane:'#f5efe2',duck:'#f6e49d',mandarin:'#ecc28d',cheongryong:'#75b6b4',baekho:'#e9e4d6',jujak:'#e99e85',hyeonmu:'#6c999a'};
 function fallback(id){const c=colors[id]||'#b7d7a0';let ears='';if(id.startsWith('cat')||id==='baekho'){ears='<path d="M26 27 18 6 41 19 M74 27 82 6 59 19" fill="'+c+'" stroke="#526451" stroke-width="3"/>';}else if(['corgi','jindo','sapsal','maltese'].includes(id)){ears='<ellipse cx="19" cy="48" rx="10" ry="23" fill="'+c+'" stroke="#526451" stroke-width="3"/><ellipse cx="81" cy="48" rx="10" ry="23" fill="'+c+'" stroke="#526451" stroke-width="3"/>';}
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="50" fill="#ebf1e2"/>'+ears+'<circle cx="50" cy="53" r="37" fill="'+c+'" stroke="#526451" stroke-width="3"/><ellipse cx="27" cy="63" rx="12" ry="9" fill="#f1b0a2" opacity=".68"/><ellipse cx="73" cy="63" rx="12" ry="9" fill="#f1b0a2" opacity=".68"/><circle cx="37" cy="49" r="3.5" fill="#2b3229"/><circle cx="63" cy="49" r="3.5" fill="#2b3229"/><path d="M42 63q5 7 8 1 6 5 10-2" stroke="#2b3229" stroke-width="4" stroke-linecap="round" fill="none"/></svg>';
 return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
 }
 window.HKDFallbackPortrait=fallback;
 window.HKDProfilePortrait=function(id,look){
  const cacheKey=id+'|'+(look?JSON.stringify(look):'');if(portraitCache[cacheKey])return portraitCache[cacheKey];
  try{
   if(typeof THREE==='undefined'||typeof makeAvatar!=='function')throw new Error('No 3D');
   const obj=makeAvatar(id,look);if(!obj.head)throw new Error('No head');
   const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight(0xfff6e3,0x9b8666,1.28));
   const lamp=new THREE.DirectionalLight(0xffffff,.95);lamp.position.set(3,5,-5);scene.add(lamp);
   // 머리만 따로 초상화로 촬영해 몸 전체가 아닌 캐릭터 얼굴을 보여 줘요.
   const head=obj.head;head.parent.remove(head);head.position.set(0,-.09,0);scene.add(head);
   const cam=new THREE.PerspectiveCamera(33,1,.1,30);cam.position.set(0,.02,-2.25);cam.lookAt(0,0,0);
   if(typeof thumbR==='undefined'||!thumbR)thumbOf('av',id);
   const renderer=thumbR;if(!renderer)throw new Error('No renderer');
   renderer.setSize(160,160,false);renderer.render(scene,cam);
   const url=renderer.domElement.toDataURL('image/png');
   portraitCache[cacheKey]=url;return url;
  }catch(e){portraitCache[cacheKey]=fallback(id);return portraitCache[cacheKey];}
 };
 // 편지함은 원본 기능이 동적으로 추가하기 때문에 그 아이콘만 후처리해요.
 const lettersIcon="<svg class=\"hkd-svg\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 40 40\" width=\"32\" height=\"32\" fill=\"none\" stroke=\"#534a3e\" stroke-width=\"1.85\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><rect x=\"5\" y=\"9\" width=\"30\" height=\"24\" rx=\"4\" fill=\"#fff4de\"/><path d=\"m6 13 14 11 14-11M6 30l12-10M34 30l-12-10\"/><path d=\"m23 12 3-3 3 3\" stroke=\"#d5989a\"/></svg>";
 const grid=document.getElementById('menuGrid');
 if(grid){const refresh=()=>{const b=grid.querySelector('#ltTile');if(b&&!b.querySelector('.menu-icon')){const sp=b.querySelector('span');if(sp){sp.className='menu-icon';sp.innerHTML=lettersIcon;}}};new MutationObserver(refresh).observe(grid,{childList:true});refresh();}
})();
