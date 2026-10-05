/* DRAGON V36 JS — activate latest patch + robust product preview/order controls */
(function(){
'use strict';
const q=(s,r=document)=>r.querySelector(s),qa=(s,r=document)=>Array.from(r.querySelectorAll(s));
const fa=n=>{try{return Number(n).toLocaleString('fa-IR')}catch(e){return String(n)}};
function normalizePrice(el){
 if(!el)return; const unit=el.querySelector('.unit'); if(!unit||el.dataset.v36==='1')return;
 if(el.querySelector('.dg-price-number,.dg-price-unit')){el.dataset.v36='1';return}
 const number=Array.from(el.childNodes).filter(n=>n.nodeType===3).map(n=>n.textContent||'').join(' ').replace(/\s+/g,' ').trim();
 const u=(unit.textContent||'').replace(/\s+/g,' ').trim(); if(!number||!u)return;
 el.innerHTML=''; const n=document.createElement('span');n.className='dg-price-number';n.textContent=number;
 const us=document.createElement('span');us.className='dg-price-unit';us.textContent=u;el.append(us,n);el.dataset.v36='1';
}
function normalizePrices(){qa('#modalBackdrop .price,.item-card .item-foot .price').forEach(normalizePrice)}
function enforceClose(){
 const hero=q('#modalBackdrop .modal-hero');if(!hero)return;
 const bs=qa('.modal-close',hero);if(bs.length>1)bs.slice(0,-1).forEach(b=>b.remove());
 const b=q('#modalClose2,.modal-close',hero);if(b){b.style.left='10px';b.style.right='auto';b.style.top='10px';b.style.display='flex'}
}
function enhanceReceivedOrders(){
 const list=q('#orderManagerList');if(!list)return;let os=[];
 try{os=typeof window.getOrders==='function'?window.getOrders():JSON.parse(localStorage.getItem('gamecafe_orders')||'[]')}catch(e){}
 qa('.admin-order-card',list).forEach(card=>{
  const id=q('.order-number-row-v19 strong',card)?.textContent?.trim();if(!id)return;
  const o=os.find(x=>String(x.id)===String(id));if(!o)return;
  const total=(o.items||[]).reduce((s,i)=>s+Math.max(0,Number(i.qty)||0),0);
  const sum=q('.received-order-summary strong',card);if(sum)sum.textContent='تعداد - '+fa(total)+' عدد';
  qa('.received-order-qty',card).forEach((el,i)=>{if(o.items?.[i])el.textContent='تعداد - '+fa(o.items[i].qty)+' عدد'})
 })
}
document.addEventListener('click',function(e){
 const image=e.target.closest('.item-card .img-wrap img,.item-card .img-wrap picture,.item-card .img-wrap');
 if(image&&typeof window.openModal==='function'&&!e.target.closest('.admin-mini')){e.preventDefault();e.stopPropagation();const card=image.closest('.item-card');if(card)window.openModal(Number(card.dataset.id))}
 if(e.target.closest('.item-card,.modal-close,.add-control,.modal-qty-control'))setTimeout(normalizePrices,20);
 if(e.target.closest('#modalBackdrop'))setTimeout(enforceClose,20)
},true);
const root=q('#modalBackdrop');if(root)new MutationObserver(()=>{normalizePrices();enforceClose()}).observe(root,{subtree:true,childList:true,characterData:true});
const list=q('#orderManagerList');if(list)new MutationObserver(enhanceReceivedOrders).observe(list,{subtree:true,childList:true});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>{normalizePrices();enforceClose();enhanceReceivedOrders()});else{normalizePrices();enforceClose();enhanceReceivedOrders()}
})();