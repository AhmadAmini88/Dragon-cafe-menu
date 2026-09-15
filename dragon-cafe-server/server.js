const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || '0.0.0.0';
const DATA_DIR = path.join(__dirname, 'data');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');
const PUBLIC_DIR = path.join(__dirname, 'public');
const MAX_ORDERS = 1000;
const VALID_STATUSES = new Set(['new','confirmed','preparing','ready','served','cancelled']);

fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(ORDERS_FILE)) fs.writeFileSync(ORDERS_FILE, '[]');
if (!fs.existsSync(SETTINGS_FILE)) fs.writeFileSync(SETTINGS_FILE, JSON.stringify({ zafaranBridgeUrl: '', zafaranToken: '' }, null, 2));

function readJson(file, fallback) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; } }
function writeJson(file, value) { const tmp=file+'.tmp'; fs.writeFileSync(tmp, JSON.stringify(value, null, 2)); fs.renameSync(tmp,file); }
function send(res, status, body, type='application/json; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Headers':'Content-Type, Authorization',
    'Access-Control-Allow-Methods':'GET,POST,PATCH,OPTIONS',
    'Cache-Control':'no-store'
  });
  res.end(type.startsWith('application/json') ? JSON.stringify(body) : body);
}
function readBody(req) {
  return new Promise((resolve,reject)=>{
    let s='';
    req.on('data',c=>{ s+=c; if(s.length>2_000_000){ req.destroy(); reject(new Error('body too large')); } });
    req.on('end',()=>{ try{ resolve(s?JSON.parse(s):{}); }catch(e){ reject(e); } });
    req.on('error',reject);
  });
}
function authOk(req) {
  const secret=process.env.ADMIN_API_KEY;
  if(!secret) return true;
  return req.headers.authorization === `Bearer ${secret}`;
}
function cleanOrder(input, preserveStatus=false) {
  const items = Array.isArray(input.items) ? input.items.slice(0,100).map(x => ({
    id:Number(x.id)||0,
    name:String(x.name||'').slice(0,120),
    qty:Math.min(999,Math.max(1,Number(x.qty)||1)),
    price:Math.max(0,Number(x.price)||0)
  })) : [];
  const subtotal = Math.max(0, Number(input.subtotal) || items.reduce((s,x)=>s+x.qty*x.price,0));
  const discount = Math.min(subtotal, Math.max(0, Number(input.discount)||0));
  const total = Math.max(0, Number(input.total) || (subtotal-discount));
  const status = preserveStatus && VALID_STATUSES.has(String(input.status)) ? String(input.status) : 'new';
  return {
    id:String(input.id||('D'+Date.now()+Math.random().toString(36).slice(2,7))),
    createdAt:String(input.createdAt||new Date().toISOString()),
    updatedAt:String(input.updatedAt||new Date().toISOString()),
    table:String(input.table||'بدون شماره میز').slice(0,50), status,
    source:String(input.source||'qr-menu').slice(0,40),
    deviceId:String(input.deviceId||'').slice(0,100),
    items, subtotal, discount,
    promoCode:String(input.promoCode||'').slice(0,50), total,
    history:Array.isArray(input.history)?input.history.slice(-20).map(h=>({
      status:VALID_STATUSES.has(String(h.status))?String(h.status):'new',
      at:String(h.at||new Date().toISOString())
    })): [{status,at:new Date().toISOString()}]
  };
}
async function pushZafaran(order) {
  const settings=readJson(SETTINGS_FILE,{});
  if(!settings.zafaranBridgeUrl) return { ok:false, skipped:true, reason:'NO_BRIDGE' };
  try {
    const headers={'Content-Type':'application/json'};
    if(settings.zafaranToken) headers.Authorization='Bearer '+settings.zafaranToken;
    const r=await fetch(settings.zafaranBridgeUrl,{method:'POST',headers,body:JSON.stringify(order)});
    const text=await r.text();
    return { ok:r.ok, status:r.status, response:text.slice(0,1000) };
  } catch(e) { return {ok:false,error:e.message}; }
}

const server=http.createServer(async (req,res)=>{
  if(req.method==='OPTIONS') return send(res,204,{});
  const url=new URL(req.url,`http://${req.headers.host}`);
  try {
    if(url.pathname==='/health') return send(res,200,{ok:true,service:'dragon-cafe-order-server',time:new Date().toISOString()});
    if(url.pathname==='/api/orders' && req.method==='GET') {
      if(!authOk(req)) return send(res,401,{error:'unauthorized'});
      const orders=readJson(ORDERS_FILE,[]).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt));
      return send(res,200,orders.slice(0,MAX_ORDERS));
    }
    const one=url.pathname.match(/^\/api\/orders\/([^/]+)$/);
    if(one && req.method==='GET') {
      const id=decodeURIComponent(one[1]);
      const orders=readJson(ORDERS_FILE,[]);
      const order=orders.find(x=>x.id===id);
      return order ? send(res,200,order) : send(res,404,{error:'not_found'});
    }
    if(url.pathname==='/api/orders' && req.method==='POST') {
      const incoming=cleanOrder(await readBody(req));
      if(!incoming.items.length) return send(res,422,{error:'empty_order'});
      const orders=readJson(ORDERS_FILE,[]);
      const existing=orders.findIndex(o=>o.id===incoming.id);
      if(existing>=0) {
        const current=orders[existing];
        orders[existing]={...current,...incoming,status:current.status||'new',history:current.history||incoming.history,updatedAt:new Date().toISOString()};
        writeJson(ORDERS_FILE,orders.slice(0,MAX_ORDERS));
        return send(res,200,{ok:true,duplicate:true,order:orders[existing]});
      }
      orders.unshift(incoming);
      writeJson(ORDERS_FILE,orders.slice(0,MAX_ORDERS));
      return send(res,201,{ok:true,order:incoming});
    }
    if(one && req.method==='PATCH') {
      if(!authOk(req)) return send(res,401,{error:'unauthorized'});
      const id=decodeURIComponent(one[1]); const patch=await readBody(req);
      const orders=readJson(ORDERS_FILE,[]); const o=orders.find(x=>x.id===id);
      if(!o) return send(res,404,{error:'not_found'});
      if(patch.status && VALID_STATUSES.has(String(patch.status)) && String(patch.status)!==o.status){
        o.status=String(patch.status);
        o.history=Array.isArray(patch.history)?patch.history.slice(-20):((o.history||[]).concat([{status:o.status,at:new Date().toISOString()}])).slice(-20);
      }
      if(patch.note!==undefined)o.note=String(patch.note).slice(0,500);
      o.updatedAt=new Date().toISOString(); writeJson(ORDERS_FILE,orders);
      return send(res,200,{ok:true,order:o});
    }
    if(url.pathname==='/api/zafaran/push' && req.method==='POST') {
      if(!authOk(req)) return send(res,401,{error:'unauthorized'});
      const order=cleanOrder(await readBody(req)); const result=await pushZafaran(order); return send(res,result.ok?200:502,{ok:result.ok,result});
    }
    if(url.pathname==='/api/settings' && req.method==='GET') {
      if(!authOk(req)) return send(res,401,{error:'unauthorized'});
      const s=readJson(SETTINGS_FILE,{}); return send(res,200,{zafaranBridgeUrl:s.zafaranBridgeUrl?'configured':'', zafaranToken:s.zafaranToken?'configured':''});
    }
    if(url.pathname==='/api/settings' && req.method==='POST') {
      if(!authOk(req)) return send(res,401,{error:'unauthorized'});
      const b=await readBody(req); writeJson(SETTINGS_FILE,{zafaranBridgeUrl:String(b.zafaranBridgeUrl||''),zafaranToken:String(b.zafaranToken||'')}); return send(res,200,{ok:true});
    }
    if(req.method==='GET') {
      let p=url.pathname==='/'?'/index.html':url.pathname; p=path.normalize(p).replace(/^\.\.+/,'');
      const fp=path.join(PUBLIC_DIR,p);
      if(fs.existsSync(fp)&&fs.statSync(fp).isFile()){
        const ext=path.extname(fp); const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webmanifest':'application/manifest+json'};
        return send(res,200,fs.readFileSync(fp),types[ext]||'application/octet-stream');
      }
    }
    return send(res,404,{error:'not_found'});
  } catch(e){ console.error(e); return send(res,400,{error:e.message}); }
});
server.listen(PORT,HOST,()=>console.log(`Dragon Cafe server running on http://${HOST}:${PORT}`));
