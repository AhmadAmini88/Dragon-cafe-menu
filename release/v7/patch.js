(function(){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 364"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#70efff"/><stop offset=".55" stop-color="#4fb3ff"/><stop offset="1" stop-color="#7c6cff"/></linearGradient></defs><rect width="400" height="364" rx="54" fill="#071225"/><circle cx="200" cy="150" r="108" fill="none" stroke="url(#g)" stroke-width="12" opacity=".9"/><path d="M112 205c-20-43-10-91 31-117 34-22 74-25 107-9 25 12 46 37 51 65-19-18-39-27-60-28 12 17 14 36 5 54-9-17-22-27-39-31 5 22-1 42-18 57-17-18-39-28-63-30-3 13-8 26-14 39z" fill="none" stroke="url(#g)" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="M245 130l25-18-5 28 25-3-18 18 20 13-28 2-12 25-11-25" fill="url(#g)"/><circle cx="259" cy="129" r="4" fill="#fff"/><rect x="139" y="176" width="122" height="62" rx="22" fill="#eaf6ff" opacity=".95"/><path d="M161 193h78M161 216h78" stroke="#2a4f87" stroke-width="7" stroke-linecap="round"/><text x="200" y="289" text-anchor="middle" font-family="Arial,sans-serif" font-size="43" font-weight="900" fill="#fff">DRAGON</text><text x="200" y="327" text-anchor="middle" font-family="Arial,sans-serif" font-size="21" font-weight="700" fill="#70efff">CAFE GAME</text></svg>`;
  const LOGO='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);
  function patchImages(root=document){
    root.querySelectorAll('img').forEach(img=>{
      const src=img.getAttribute('src')||'';
      if(!src || src==='data:,' || src.includes('dragon_logo.webp') || src.includes('./images/dragon_logo.svg')) img.src=LOGO;
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
