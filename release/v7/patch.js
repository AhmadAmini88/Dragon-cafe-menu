(function(){
  document.title='کافه گیم دراگون | منوی دیجیتال';
  const I={hot:'https://cdn.pixabay.com/photo/2018/02/04/14/56/coffee-3129995_1280.jpg',cold:'https://cdn.pixabay.com/photo/2021/04/08/10/27/iced-coffee-6161260_1280.jpg',mojito:'https://cdn.pixabay.com/photo/2016/09/04/19/38/mojito-1645018_1280.jpg',fries:'https://cdn.pixabay.com/photo/2019/11/04/12/26/fries-4601057_1280.jpg',nachos:'https://cdn.pixabay.com/photo/2015/10/01/03/09/cheese-966423_1280.jpg',pizza:'https://cdn.pixabay.com/photo/2016/02/04/16/16/pizza-1179404_1280.jpg',chicken:'https://cdn.pixabay.com/photo/2026/05/21/15/36/15-36-50-66_1280.jpg',ps5:'https://blog.playstation.com/tachyon/2020/04/DualSense-Controller-for-PS5-1.jpg',pc:'https://cdn.pixabay.com/photo/2022/10/10/05/54/gaming-7510868_1280.jpg',xbox:'https://cms-assets.xboxservices.com/assets/bc/40/bc40fdf3-85a6-4c36-af92-dca2d36fc7e5.png?n=642227_Hero-Gallery-0_A1_857x676.png',vr:'https://cdn.pixabay.com/photo/2021/12/04/19/01/virtual-reality-6845814_1280.jpg'};
  const M={1:I.hot,2:I.hot,3:I.hot,4:I.hot,5:I.cold,6:I.mojito,7:I.cold,8:I.mojito,9:I.fries,10:I.nachos,11:I.pizza,12:I.chicken,13:I.ps5,14:I.ps5,15:I.pc,16:I.pc,17:I.xbox,18:I.vr,19:I.fries,20:I.pc};
  const C={featured:I.ps5,hot:I.hot,cold:I.cold,snacks:I.fries,ps5:I.ps5,pc:I.pc,xbox:I.xbox,vr:I.vr,combo:I.fries};
  const legacy=/dragon_logo|site-logo-fallback|images\.unsplash\.com|localhost(?::\d+)?/i;
  function repair(){try{
    if(typeof ITEMS!=='undefined'&&Array.isArray(ITEMS)){
      let changed=false;
      ITEMS.forEach(i=>{const v=String(i?.img||'');const n=M[i?.id]||C[i?.cat];if(i&&(!v||legacy.test(v))&&n&&i.img!==n){i.img=n;changed=true;}});
      if(typeof CUSTOM_CAT_IMAGES!=='undefined'&&CUSTOM_CAT_IMAGES&&typeof CUSTOM_CAT_IMAGES==='object')Object.keys(C).forEach(k=>{const v=String(CUSTOM_CAT_IMAGES[k]||'');if(!v||legacy.test(v)){CUSTOM_CAT_IMAGES[k]=C[k];changed=true;}});
      if(changed&&typeof saveData==='function')saveData();
    }
    document.querySelectorAll('.admin-section-nav').forEach(n=>n.remove());
    document.getElementById('modalBodyClose')?.remove();
    document.getElementById('modalClose')?.remove();
    const footer=document.querySelector('#integrationBackdrop .modal-footer-actions');
    if(footer&&!footer.querySelector('.settings-exit-btn')){const b=document.createElement('button');b.type='button';b.className='modal-back-btn settings-exit-btn';b.innerHTML='<i class="fas fa-sign-out-alt"></i> خروج از پنل مدیریت';b.onclick=function(){if(typeof closeIntegrationSettings==='function')closeIntegrationSettings();if(typeof exitAdminMode==='function')exitAdminMode();};footer.classList.add('settings-footer-actions');footer.appendChild(b);}
    if(typeof renderAll==='function')renderAll();
  }catch(e){console.error('Dragon V10 repair:',e)}}
  document.addEventListener('error',function(e){const img=e.target;if(!(img instanceof HTMLImageElement))return;if(!img.classList.contains('real-photo')&&!img.classList.contains('cat-real-photo'))return;const card=img.closest('.item-card');const id=card?Number(card.dataset.id):NaN;const src=M[id]||C.featured;if(src&&img.dataset.v10Fallback!=='1'&&img.src!==src){img.dataset.v10Fallback='1';img.onerror=null;img.src=src;}},true);
  function start(){setTimeout(repair,120);setTimeout(repair,800)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
})();
