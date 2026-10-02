/* DRAGON V35 JS — normalize price groups after every product preview render */
(function(){
'use strict';

function normalizePriceElement(el){
  if(!el) return;
  const unit=el.querySelector('.unit');
  if(!unit) return;
  const hasStructured=el.querySelector('.dg-price-number,.dg-price-unit');
  if(hasStructured) return;
  const numberText=Array.from(el.childNodes)
    .filter(n=>n.nodeType===Node.TEXT_NODE)
    .map(n=>n.textContent||'').join(' ')
    .replace(/\s+/g,' ').trim();
  const unitText=(unit.textContent||'').replace(/\s+/g,' ').trim();
  if(!numberText||!unitText)return;
  el.innerHTML='';
  const number=document.createElement('span');
  number.className='dg-price-number';
  number.textContent=numberText;
  const u=document.createElement('span');
  u.className='dg-price-unit';
  u.textContent=unitText;
  el.append(number,u);
}

function normalizeAll(){
  document.querySelectorAll('#modalBackdrop .price .price, #modalBackdrop .modal-foot .price, .item-card .item-foot .price')
    .forEach(normalizePriceElement);
}

/* The legacy openModal rewrites #modalPrice.innerHTML every time.
   Observe the modal subtree so normalization always happens after that rewrite. */
const root=document.getElementById('modalBackdrop');
if(root){
  const mo=new MutationObserver(function(){normalizeAll()});
  mo.observe(root,{subtree:true,childList:true,characterData:true});
}
document.addEventListener('click',function(e){
  if(e.target.closest('.item-card,.modal-close,.add-control,.modal-qty-control')){
    setTimeout(normalizeAll,0);
    setTimeout(normalizeAll,40);
  }
},true);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',normalizeAll);
else normalizeAll();

/* Guarantee one close button after legacy hero replacement. */
function enforceSingleModalClose(){
  const hero=document.querySelector('#modalBackdrop .modal-hero');
  if(!hero)return;
  const buttons=Array.from(hero.querySelectorAll('.modal-close'));
  if(buttons.length>1){
    buttons.slice(0,-1).forEach(b=>b.remove());
  }
  const close=hero.querySelector('#modalClose2,.modal-close');
  if(close){
    close.style.left='10px';
    close.style.right='auto';
    close.style.top='10px';
    close.style.display='flex';
    close.onclick=window.closeModal||close.onclick;
  }
}
const heroObserver=document.getElementById('modalBackdrop');
if(heroObserver){
  const mo2=new MutationObserver(function(){enforceSingleModalClose()});
  mo2.observe(heroObserver,{subtree:true,childList:true});
}
document.addEventListener('click',function(){
  setTimeout(enforceSingleModalClose,0);
  setTimeout(enforceSingleModalClose,40);
},true);
})();