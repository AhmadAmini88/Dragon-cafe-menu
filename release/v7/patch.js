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

/* DRAGON V32.1 — product image preview + received-order editor */
(function(){
  function fa(v){ return typeof window.toFa==='function' ? window.toFa(v) : String(v); }

  function bindProductImageOpen(){
    document.querySelectorAll('#itemsWrap .item-card .img-wrap').forEach(wrap=>{
      if(wrap.dataset.dragonV321==='1') return;
      wrap.dataset.dragonV321='1';
      wrap.addEventListener('click',function(e){
        if(e.target.closest('.admin-mini,.admin-row')) return;
        const card=wrap.closest('.item-card');
        if(!card) return;
        e.stopPropagation();
        if(typeof window.openModal==='function') window.openModal(Number(card.dataset.id));
      });
    });
  }

  function quantityText(v){ return 'تعداد - ' + fa(v) + ' عدد'; }

  window.dragonV321AdjustOrderItem=function(orderId,index,delta){
    try{
      const os=typeof window.getOrders==='function'?window.getOrders():[];
      const o=os.find(x=>String(x.id)===String(orderId));
      if(!o || o.status==='cancelled') return;
      if(!Array.isArray(o.items) || !o.items[index]) return;
      const item=o.items[index];
      const next=Math.max(0,(Number(item.qty)||0)+Number(delta||0));
      if(next===0) o.items.splice(index,1); else item.qty=next;
      if(!o.items.length){
        o.status='cancelled';
        o.cancelledAt=new Date().toISOString();
        o.updatedAt=o.cancelledAt;
        o.history=Array.isArray(o.history)?o.history:[];
        o.history.push({status:'cancelled',at:o.cancelledAt,note:'لغو توسط مدیر به‌دلیل حذف همه اقلام'});
      }
      const subtotal=(o.items||[]).reduce((sum,i)=>sum+Math.max(0,Number(i.qty)||0)*Math.max(0,Number(i.price)||0),0);
      const discount=Math.min(Math.max(0,Number(o.discount)||0),subtotal);
      o.subtotal=subtotal;
      o.discount=discount;
      o.total=Math.max(0,subtotal-discount);
      o.updatedAt=new Date().toISOString();
      if(typeof window.saveOrders==='function') window.saveOrders(os);
      if(typeof window.openOrderManager==='function') window.openOrderManager();
    }catch(err){console.error('Dragon V32.1 order quantity',err);}
  };

  window.dragonV321CancelOrder=function(orderId){
    try{
      const os=typeof window.getOrders==='function'?window.getOrders():[];
      const o=os.find(x=>String(x.id)===String(orderId));
      if(!o || o.status==='cancelled') return;
      if(!window.confirm('سفارش لغو شود؟')) return;
      o.status='cancelled';
      o.cancelledAt=new Date().toISOString();
      o.updatedAt=o.cancelledAt;
      o.history=Array.isArray(o.history)?o.history:[];
      o.history.push({status:'cancelled',at:o.cancelledAt,note:'لغو توسط مدیر'});
      if(typeof window.saveOrders==='function') window.saveOrders(os);
      if(typeof window.openOrderManager==='function') window.openOrderManager();
    }catch(err){console.error('Dragon V32.1 cancel order',err);}
  };

  function decorateReceivedOrders(){
    try{
      const list=document.getElementById('orderManagerList');
      if(!list) return;
      const os=typeof window.getOrders==='function'?window.getOrders():[];
      const cards=[...list.querySelectorAll('.admin-order-card')];
      cards.forEach((card,cardIndex)=>{
        const o=os[cardIndex];
        if(!o) return;
        card.dataset.orderId=String(o.id);
        const chip=card.querySelector('.order-status-chip-v19');
        if(chip && o.status==='cancelled'){ chip.textContent='لغو شد'; card.classList.add('order-cancelled'); }
        const rows=[...card.querySelectorAll('.received-order-item')];
        rows.forEach((row,idx)=>{
          const item=o.items?.[idx];
          if(!item) return;
          const q=row.querySelector('.received-order-qty');
          if(q) q.textContent=quantityText(item.qty);
          if(o.status==='cancelled' || row.querySelector('.received-order-admin-tools')) return;
          const info=row.querySelector('.received-order-info');
          if(!info) return;
          const tools=document.createElement('div');
          tools.className='received-order-admin-tools';
          const minus=document.createElement('button');
          minus.type='button'; minus.title='کم کردن تعداد'; minus.innerHTML='<i class="fas fa-minus"></i>';
          const number=document.createElement('span');
          number.className='admin-order-qty-number'; number.textContent=fa(item.qty);
          const plus=document.createElement('button');
          plus.type='button'; plus.title='زیاد کردن تعداد'; plus.innerHTML='<i class="fas fa-plus"></i>';
          minus.onclick=()=>window.dragonV321AdjustOrderItem(o.id,idx,-1);
          plus.onclick=()=>window.dragonV321AdjustOrderItem(o.id,idx,1);
          tools.append(minus,number,plus);
          info.appendChild(tools);
        });
        let footer=card.querySelector('.received-order-admin-footer');
        if(!footer){
          footer=document.createElement('div');
          footer.className='received-order-admin-footer';
          card.querySelector('.received-order-total')?.insertAdjacentElement('afterend',footer);
        }
        if(o.status==='cancelled'){
          footer.innerHTML='<button type="button" class="admin-save-order" disabled><i class="fas fa-ban"></i> سفارش لغو شده</button>';
        }else if(!footer.dataset.ready){
          footer.dataset.ready='1';
          footer.innerHTML='<button type="button" class="admin-save-order"><i class="fas fa-save"></i> ذخیره تغییرات</button><button type="button" class="admin-cancel-order"><i class="fas fa-times-circle"></i> لغو سفارش</button>';
          footer.querySelector('.admin-save-order').onclick=()=>{ if(typeof window.showToast==='function') window.showToast('تغییرات تعداد ذخیره شد'); };
          footer.querySelector('.admin-cancel-order').onclick=()=>window.dragonV321CancelOrder(o.id);
        }
      });
    }catch(err){console.error('Dragon V32.1 received order UI',err);}
  }

  function wrapRenderItems(){
    const fn=window.renderItems;
    if(typeof fn!=='function' || fn.__dragonV321) return;
    const wrapped=function(){
      const r=fn.apply(this,arguments);
      setTimeout(bindProductImageOpen,0);
      return r;
    };
    wrapped.__dragonV321=true;
    window.renderItems=wrapped;
    bindProductImageOpen();
  }

  function wrapOpenOrders(){
    const fn=window.openOrderManager;
    if(typeof fn!=='function' || fn.__dragonV321) return;
    const wrapped=function(){
      const r=fn.apply(this,arguments);
      setTimeout(decorateReceivedOrders,0);
      return r;
    };
    wrapped.__dragonV321=true;
    window.openOrderManager=wrapped;
  }

  function cleanProductModal(){
    document.getElementById('modalBodyClose')?.remove();
    const initial=document.getElementById('modalClose');
    if(initial) initial.remove();
    document.querySelectorAll('#modalBackdrop .modal-hero #modalClose2').forEach((b,i)=>{if(i>0)b.remove();});
    const hero=document.querySelector('#modalBackdrop .modal-hero');
    const close=hero?.querySelector('#modalClose2');
    if(close){
      close.style.left='12px'; close.style.right='auto'; close.style.top='12px';
      close.style.display='flex'; close.style.alignItems='center'; close.style.justifyContent='center';
    }
  }

  function boot(){
    wrapRenderItems();
    wrapOpenOrders();
    bindProductImageOpen();
    cleanProductModal();
    setTimeout(()=>{wrapRenderItems();wrapOpenOrders();bindProductImageOpen();decorateReceivedOrders();cleanProductModal();},150);
    setTimeout(()=>{decorateReceivedOrders();cleanProductModal();},700);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true}); else boot();
})();



/* DRAGON V33.2 — received-order manager + product image click */
(function(){
  window.dragonV332AdjustOrderItem=function(orderId,index,delta){
    const os=typeof getOrders==='function'?getOrders():[],o=os.find(x=>String(x.id)===String(orderId));
    if(!o||o.status==='cancelled'||!o.items?.[index])return;
    const it=o.items[index]; const next=Math.max(0,(Number(it.qty)||0)+Number(delta||0));
    if(next===0)o.items.splice(index,1);else it.qty=next;
    if(!o.items.length)o.status='cancelled';
    o.subtotal=(o.items||[]).reduce((s,x)=>s+(Number(x.price)||0)*(Number(x.qty)||0),0);
    o.total=Math.max(0,o.subtotal-Math.max(0,Number(o.discount)||0)); o.updatedAt=new Date().toISOString();
    saveOrders(os);openOrderManager();
  };
  window.dragonV332CancelOrder=function(orderId){
    const os=getOrders(),o=os.find(x=>String(x.id)===String(orderId));if(!o||o.status==='cancelled')return;
    if(!confirm('سفارش لغو شود؟'))return;o.status='cancelled';o.cancelledAt=new Date().toISOString();o.updatedAt=o.cancelledAt;saveOrders(os);openOrderManager();
  };
  function bind(){
    document.querySelectorAll('#itemsWrap .item-card .img-wrap').forEach(w=>{
      if(w.dataset.v332)return;w.dataset.v332='1';w.addEventListener('click',e=>{if(e.target.closest('.admin-mini,.admin-row'))return;const c=w.closest('.item-card');if(c)openModal(Number(c.dataset.id));});
    });
    document.querySelectorAll('#orderManagerList .admin-order-card').forEach(card=>{
      const id=card.dataset.orderId||card.querySelector('.order-number-row-v19 strong')?.textContent?.trim();if(!id)return;
      const o=getOrders().find(x=>String(x.id)===String(id));if(!o)return;
      card.querySelectorAll('.received-order-item').forEach((row,i)=>{
        const q=row.querySelector('.received-order-qty');if(q&&o.items?.[i])q.textContent='تعداد - '+toFa(o.items[i].qty)+' عدد';
        if(row.querySelector('.received-order-admin-tools')||!o.items?.[i]||o.status==='cancelled')return;
        const tools=document.createElement('div');tools.className='received-order-admin-tools';
        const minus=document.createElement('button');minus.innerHTML='<i class="fas fa-minus"></i>';minus.onclick=()=>dragonV332AdjustOrderItem(o.id,i,-1);
        const plus=document.createElement('button');plus.innerHTML='<i class="fas fa-plus"></i>';plus.onclick=()=>dragonV332AdjustOrderItem(o.id,i,1);
        tools.append(minus,plus);row.querySelector('.received-order-info')?.appendChild(tools);
      });
      if(!card.querySelector('.received-order-admin-footer')){
        const f=document.createElement('div');f.className='received-order-admin-footer';
        f.innerHTML='<button type="button">حفظ تغییرات</button><button type="button" class="danger-edit">لغو سفارش</button>';
        f.children[0].onclick=()=>openOrderManager();f.children[1].onclick=()=>dragonV332CancelOrder(o.id);
        card.appendChild(f);
      }
    });
  }
  const old=window.openOrderManager;if(old&&!old.__v332){const w=function(){const r=old.apply(this,arguments);setTimeout(bind,0);return r};w.__v332=true;window.openOrderManager=w;}
  const oldR=window.renderItems;if(oldR&&!oldR.__v332){const w=function(){const r=oldR.apply(this,arguments);setTimeout(bind,0);return r};w.__v332=true;window.renderItems=w;}
  setTimeout(bind,300);setTimeout(bind,1000);
})();
