(function(){
  document.title='کافه گیم دراگون | منوی دیجیتال';
  const IMG={
    hot:['https://images.unsplash.com/photo-1546123291-b784739f020f?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1564327367919-cb377ea6a88f?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1741321728571-e62467b671de?auto=format&fit=crop&w=1200&q=85'],
    cold:['https://images.unsplash.com/photo-1775717427643-2b0fc39a81f8?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1560536914-61692ef17082?auto=format&fit=crop&w=1200&q=85'],
    snacks:['https://images.unsplash.com/photo-1529259266118-cf22737f713f?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?auto=format&fit=crop&w=1200&q=85','https://images.unsplash.com/photo-1564849012987-56a988d14596?auto=format&fit=crop&w=1200&q=85'],
    ps5:'https://images.unsplash.com/photo-1752262526779-bd65a9b83c25?auto=format&fit=crop&w=1400&q=85',pc:'https://images.unsplash.com/photo-1783783197323-31f5291db6f7?auto=format&fit=crop&w=1400&q=85',xbox:'https://images.unsplash.com/photo-1543973277-5020ef836640?auto=format&fit=crop&w=1400&q=85',vr:'https://images.unsplash.com/photo-1745953129750-9c1874b4ffa1?auto=format&fit=crop&w=1400&q=85'
  };
  const ITEM={1:IMG.hot[0],2:IMG.hot[1],3:IMG.hot[2],4:IMG.hot[1],5:IMG.cold[0],6:IMG.cold[1],7:IMG.cold[1],8:IMG.cold[0],9:IMG.snacks[0],10:IMG.snacks[0],11:IMG.snacks[1],12:IMG.snacks[2],13:IMG.ps5,14:IMG.ps5,15:IMG.pc,16:IMG.pc,17:IMG.xbox,18:IMG.vr,19:IMG.ps5,20:IMG.pc};
  const CAT={featured:IMG.ps5,hot:IMG.hot[0],cold:IMG.cold[0],snacks:IMG.snacks[0],ps5:IMG.ps5,pc:IMG.pc,xbox:IMG.xbox,vr:IMG.vr,combo:IMG.ps5};
  function apply(){
    try{
      if(typeof ITEMS!=='undefined'&&Array.isArray(ITEMS)){
        ITEMS.forEach(i=>{if(!i.img||String(i.img).includes('dragon_logo')||String(i.img).includes('site-logo-fallback')) i.img=ITEM[i.id]||CAT[i.cat]||CAT.featured;});
        if(typeof saveData==='function') saveData();
      }
      if(typeof CUSTOM_CAT_IMAGES!=='undefined') Object.keys(CAT).forEach(k=>{if(!CUSTOM_CAT_IMAGES[k]) CUSTOM_CAT_IMAGES[k]=CAT[k];});
      document.querySelectorAll('.admin-section-nav').forEach(n=>n.remove());
      const footer=document.querySelector('#integrationBackdrop .modal-footer-actions');
      if(footer&&!footer.querySelector('.settings-exit-btn')){
        const b=document.createElement('button'); b.type='button'; b.className='modal-back-btn settings-exit-btn'; b.innerHTML='<i class="fas fa-sign-out-alt"></i> خروج از پنل مدیریت'; b.onclick=function(){if(typeof closeIntegrationSettings==='function')closeIntegrationSettings();if(typeof exitAdminMode==='function')exitAdminMode();}; footer.classList.add('settings-footer-actions'); footer.appendChild(b);
      }
      if(typeof renderAll==='function') renderAll();
    }catch(e){console.error('Dragon V8 patch:',e)}
  }
  document.addEventListener('error',function(e){
    const img=e.target;
    if(!(img instanceof HTMLImageElement)||!img.classList.contains('real-photo')) return;
    const card=img.closest('.item-card');
    const item=card&&typeof ITEMS!=='undefined'?ITEMS.find(x=>String(x.id)===String(card.dataset.id)):null;
    const src=CAT[item?.cat]||CAT.featured;
    if(src&&img.src!==src){img.onerror=null;img.src=src;}
  },true);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',()=>setTimeout(apply,80),{once:true}); else setTimeout(apply,80);
})();
