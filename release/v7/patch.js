(function(){
  const LOGO='./images/dragon_logo.svg';
  function patchImages(root=document){
    root.querySelectorAll('img').forEach(img=>{
      const src=img.getAttribute('src')||'';
      if(!src || src==='data:,' || src.includes('dragon_logo.webp')) img.src=LOGO;
      if(!img.dataset.logoFallbackBound){
        img.addEventListener('error',function(){
          if(this.dataset.logoFallback==='1') return;
          this.dataset.logoFallback='1'; this.onerror=null; this.src=LOGO;
        });
        img.dataset.logoFallbackBound='1';
      }
    });
  }
  document.title='کافه گیم دراگون | منوی دیجیتال';
  document.addEventListener('DOMContentLoaded',()=>setTimeout(patchImages,50));
  new MutationObserver(()=>patchImages()).observe(document.documentElement,{subtree:true,childList:true});
})();
