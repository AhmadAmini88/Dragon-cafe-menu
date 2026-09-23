
(function(){
'use strict';
function q(sel,root=document){return root.querySelector(sel)}
function qa(sel,root=document){return Array.from(root.querySelectorAll(sel))}
function fa(n){try{return Number(n).toLocaleString('fa-IR')}catch(e){return String(n)}}
function escx(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

document.addEventListener('click',function(e){
  const imgWrap=e.target.closest('.item-card .img-wrap');
  if(imgWrap && typeof window.openModal==='function'){
    if(e.target.closest('.admin-mini'))return;
    e.preventDefault();e.stopPropagation();
    const card=imgWrap.closest('.item-card'); if(card) window.openModal(Number(card.dataset.id));
  }
},true);

function recalc(o){
  const items=Array.isArray(o.items)?o.items:[];
  o.subtotal=items.reduce((s,i)=>s+Math.max(0,Number(i.qty)||0)*Math.max(0,Number(i.price)||0),0);
  o.total=Math.max(0,o.subtotal-Math.max(0,Number(o.discount)||0));
  o.updatedAt=new Date().toISOString();
  return o;
}
function persist(o,note){
  const os=typeof window.getOrders==='function'?window.getOrders():JSON.parse(localStorage.getItem('gamecafe_orders')||'[]');
  const ix=os.findIndex(x=>String(x.id)===String(o.id)); if(ix<0)return;
  recalc(o); o.history=Array.isArray(o.history)?o.history:[]; o.history.push({status:o.status,at:new Date().toISOString(),note:note||'ویرایش توسط مدیر'});
  os[ix]=o;
  if(typeof window.saveOrders==='function')window.saveOrders(os);else localStorage.setItem('gamecafe_orders',JSON.stringify(os.slice(0,200)));
  try{
    const c=typeof window.loadIntegrationSettings==='function'?window.loadIntegrationSettings():null;
    if(c&&c.enabled&&c.baseUrl)fetch(c.baseUrl.replace(/\/$/,'')+'/api/orders/'+encodeURIComponent(o.id),{method:'PATCH',headers:{'Content-Type':'application/json',...(c.token?{'Authorization':'Bearer '+c.token}:{})},body:JSON.stringify(o)}).catch(()=>{});
  }catch(_){}
}
window.editReceivedOrder=function(id){
  const os=window.getOrders?window.getOrders():JSON.parse(localStorage.getItem('gamecafe_orders')||'[]');
  const o=os.find(x=>String(x.id)===String(id)); if(!o)return;
  if(o.status==='cancelled'){window.showToast?.('سفارش لغوشده قابل ویرایش نیست.');return;}
  document.getElementById('receivedEditOverlay')?.remove();
  const rows=(o.items||[]).map((i,idx)=>'<div class="admin-edit-order-row"><div class="admin-edit-order-name">'+escx(i.name)+'</div><div class="admin-edit-qty"><button type="button" onclick="changeReceivedOrderQty(\''+escx(o.id)+'\','+idx+',-1)">−</button><strong>'+fa(i.qty)+'</strong><button type="button" onclick="changeReceivedOrderQty(\''+escx(o.id)+'\','+idx+',1)">+</button></div></div>').join('');
  const ov=document.createElement('div');ov.id='receivedEditOverlay';ov.className='dragon-inline-overlay';
  ov.innerHTML='<div class="dragon-inline-dialog" dir="rtl"><button class="dragon-inline-close" type="button">×</button><h3>ویرایش سفارش '+escx(o.id)+'</h3><div class="dragon-inline-order-list">'+(rows||'<div>آیتمی وجود ندارد.</div>')+'</div><div class="dragon-inline-total">مجموع: <strong>'+fa(o.total)+' تومان</strong></div><div class="dragon-inline-actions"><button type="button" onclick="closeReceivedEditOverlay();openOrderManager()">ذخیره و بستن</button><button type="button" onclick="closeReceivedEditOverlay()">انصراف</button></div></div>';
  document.body.appendChild(ov);q('.dragon-inline-close',ov).onclick=window.closeReceivedEditOverlay;
};
window.closeReceivedEditOverlay=function(){document.getElementById('receivedEditOverlay')?.remove()};
window.changeReceivedOrderQty=function(id,index,delta){
  const os=window.getOrders?window.getOrders():JSON.parse(localStorage.getItem('gamecafe_orders')||'[]');
  const o=os.find(x=>String(x.id)===String(id)); if(!o||!o.items?.[index])return;
  const next=Math.max(0,(Number(o.items[index].qty)||0)+delta);
  if(next===0)o.items.splice(index,1);else o.items[index].qty=next;
  if(!o.items.length)o.status='cancelled';
  persist(o,'ویرایش تعداد توسط مدیر');
  window.editReceivedOrder(id);
};
window.cancelReceivedOrder=function(id){
  const os=window.getOrders?window.getOrders():JSON.parse(localStorage.getItem('gamecafe_orders')||'[]');
  const o=os.find(x=>String(x.id)===String(id)); if(!o)return;
  if(o.status==='cancelled'){window.showToast?.('این سفارش قبلاً لغو شده است.');return;}
  if(!confirm('سفارش '+id+' لغو شود؟'))return;
  o.status='cancelled';o.cancelledAt=new Date().toISOString();persist(o,'لغو سفارش توسط مدیر');
  window.closeReceivedEditOverlay();window.openOrderManager?.();window.showToast?.('سفارش '+id+' لغو شد');
};

function enhanceOrders(){
  const list=q('#orderManagerList');if(!list)return;
  qa('.admin-order-card',list).forEach(card=>{
    if(card.dataset.v32Enhanced==='1')return;
    card.dataset.v32Enhanced='1';
    const idEl=q('.order-number-row-v19 strong',card);const id=idEl?.textContent?.trim();if(!id)return;
    const order=(window.getOrders?window.getOrders():[]).find(o=>String(o.id)===id);if(!order)return;
    const sum=q('.received-order-summary strong',card);const total=(order.items||[]).reduce((s,i)=>s+Math.max(0,Number(i.qty)||0),0);
    if(sum)sum.textContent='- '+fa(total)+' عدد';
    qa('.received-order-qty',card).forEach((el,idx)=>{const it=order.items?.[idx];if(it)el.textContent='تعداد - '+fa(it.qty)+' عدد'});
    let actions=q('.received-order-admin-actions',card);
    if(!actions){
      actions=document.createElement('div');actions.className='order-actions received-order-admin-actions';
      actions.innerHTML='<button type="button" onclick="advanceOrder(\''+escx(id)+'\')">تغییر وضعیت</button><button type="button" onclick="editReceivedOrder(\''+escx(id)+'\')">ویرایش سفارش</button><button type="button" class="danger-order-btn" onclick="cancelReceivedOrder(\''+escx(id)+'\')">لغو سفارش</button>';
      card.appendChild(actions);
    }
  });
}
const observer=new MutationObserver(enhanceOrders);
const boot=()=>{const list=q('#orderManagerList');if(list)observer.observe(list,{childList:true,subtree:true});enhanceOrders()};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
