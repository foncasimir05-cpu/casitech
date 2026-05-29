'use client';
import React, { useState, useEffect, useRef } from "react";
import useAuthStore from '../../store/useAuthStore';
import { authAPI, productsAPI, ordersAPI } from '../../lib/api';

const C = {
  bg:"#0a0a0f", bg2:"#0e0e16", card:"#13131e", card2:"#1a1a28",
  green:"#00c853", greenL:"#69f0ae", greenD:"#007a32",
  text:"#e8fff0", muted:"#7a8a8f", border:"#1e2a2e",
  red:"#ff4444", gold:"#ffd700", cyan:"#00e5ff",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;800;900&family=Share+Tech+Mono&family=Exo+2:wght@300;400;500;600;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{background:${C.bg};color:${C.text};font-family:'Exo 2',sans-serif;min-height:100vh}
  ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:${C.bg2}}::-webkit-scrollbar-thumb{background:${C.green};border-radius:3px}
  .orb{font-family:'Orbitron',monospace}
  input,select,textarea{background:${C.card2};border:1px solid ${C.border};color:${C.text};padding:10px 14px;border-radius:6px;font-family:'Exo 2',sans-serif;font-size:14px;outline:none;width:100%}
  input:focus,select:focus,textarea:focus{border-color:${C.green};box-shadow:0 0 0 2px ${C.green}1a}
  select option{background:${C.card}}
  input[type=range]{-webkit-appearance:none;appearance:none;height:4px;background:${C.border};border:none;border-radius:2px;padding:0;accent-color:${C.green}}
  input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:14px;border-radius:50%;background:${C.green};cursor:pointer}
  input[type=radio],input[type=checkbox]{accent-color:${C.green}}
  @keyframes fadeIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
  @keyframes glowPulse{0%,100%{text-shadow:0 0 8px ${C.green}88,0 0 20px ${C.green}44}50%{text-shadow:0 0 20px ${C.green}cc,0 0 50px ${C.green}66}}
  @keyframes analyzePulse{0%{width:10%}50%{width:85%}100%{width:10%}}
  .fade-in{animation:fadeIn .35s ease both}
  .glow{animation:glowPulse 2.5s ease-in-out infinite}
  .card-hover{transition:transform .2s,box-shadow .2s,border-color .2s}
  .card-hover:hover{transform:translateY(-3px);box-shadow:0 0 24px ${C.green}28,0 8px 32px #00000066;border-color:${C.green}55!important}
  .btn{background:linear-gradient(135deg,${C.green},${C.greenD});color:#000;border:none;padding:10px 22px;border-radius:4px;font-weight:700;cursor:pointer;font-family:'Orbitron',monospace;font-size:11px;letter-spacing:1px;text-transform:uppercase;transition:all .15s;position:relative;overflow:hidden}
  .btn:hover{filter:brightness(1.15)}
  .btn:disabled{opacity:.4;cursor:not-allowed}
  .btn-o{background:transparent;color:${C.green};border:1px solid ${C.green}88;padding:9px 20px;border-radius:4px;font-weight:600;cursor:pointer;font-family:'Orbitron',monospace;font-size:10px;letter-spacing:1px;text-transform:uppercase;transition:all .15s}
  .btn-o:hover{background:${C.green}14;border-color:${C.green}}
  .tag{background:${C.green}1a;color:${C.green};font-size:10px;font-weight:700;padding:2px 7px;border-radius:3px;letter-spacing:1px;text-transform:uppercase;font-family:'Share Tech Mono',monospace;border:1px solid ${C.green}33}
  .hot{background:linear-gradient(135deg,#ff4a00,#ff0040);color:#fff;font-size:9px;font-weight:800;padding:2px 7px;border-radius:3px;letter-spacing:.5px;font-family:'Share Tech Mono',monospace}
  .sale{background:${C.green};color:#000;font-size:9px;font-weight:800;padding:2px 7px;border-radius:3px;font-family:'Share Tech Mono',monospace}
  .star{color:${C.gold};font-size:11px}
  .hr{height:1px;background:linear-gradient(90deg,transparent,${C.border},transparent);margin:18px 0}
  .scroll-x{display:flex;gap:14px;overflow-x:auto;padding-bottom:8px;scrollbar-width:thin;scrollbar-color:${C.green} transparent}
  .overlay{position:fixed;inset:0;background:#000000aa;backdrop-filter:blur(6px);z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px}
  .modal{background:${C.card};border:1px solid ${C.green}44;border-radius:8px;max-width:540px;width:100%;max-height:90vh;overflow-y:auto;padding:26px;box-shadow:0 0 40px ${C.green}22}
  .toast{position:fixed;top:72px;right:18px;background:${C.card};border:1px solid ${C.green}66;border-radius:6px;padding:11px 16px;z-index:2000;animation:fadeIn .25s ease;box-shadow:0 0 20px ${C.green}22;display:flex;align-items:center;gap:10px}
  .sec{font-family:'Orbitron',monospace;font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${C.green};display:flex;align-items:center;gap:10px;margin-bottom:16px}
  .sec::after{content:'';flex:1;height:1px;background:linear-gradient(90deg,${C.green}44,transparent)}
  /* ── Responsive ─────────────────────────────────────────────────────────── */
  .hamburger{display:none;flex-direction:column;gap:4px;background:none;border:1px solid ${C.border};cursor:pointer;padding:7px 8px;border-radius:5px;align-items:center;justify-content:center;flex-shrink:0}
  .hamburger span{display:block;width:18px;height:2px;background:${C.green};border-radius:1px}
  .nav-links{display:flex;align-items:center}
  .nav-links>button{display:flex;align-items:center;gap:6px}
  .nav-icon{font-size:15px;line-height:1}
  .nav-lbl{}
  .nav-auth-mobile{display:none}
  .auth-desktop{display:flex;align-items:center;gap:6px;margin-right:8px}
  .cat-grid{display:grid;gap:8px;margin-bottom:36px;grid-template-columns:repeat(10,1fr)}
  .prod-grid{display:grid;gap:14px;grid-template-columns:repeat(4,1fr)}
  .cart-grid{display:grid;gap:18px;align-items:start;grid-template-columns:1fr 290px}
  .filter-grid{display:grid;gap:10px;align-items:end;grid-template-columns:1fr 1fr 1fr auto}
  .admin-stats{display:grid;gap:10px;margin-bottom:24px;grid-template-columns:repeat(4,1fr)}
  .support-grid{display:grid;gap:24px;grid-template-columns:1fr 1fr}
  .uploader-grid{display:grid;gap:22px;align-items:start;grid-template-columns:1fr 1fr}
  @media(max-width:640px){
    .hamburger{display:flex}
    .auth-desktop{display:none}
    .nav-lbl{display:none}
    .nav-sep{display:none}
    .nav-links{display:none;position:fixed;top:60px;left:0;right:0;flex-direction:column;align-items:stretch;background:${C.bg2}f5;backdrop-filter:blur(16px);border-bottom:1px solid ${C.border};padding:8px 16px 16px;z-index:98;gap:2px}
    .nav-links.open{display:flex}
    .nav-links>button{height:auto!important;min-height:44px;padding:12px 14px!important;width:100%;border-bottom:none!important;font-size:12px!important;letter-spacing:1.5px!important;border-left:3px solid transparent}
    .nav-links>button.nav-active{background:${C.green}18!important;border-left:3px solid ${C.green}!important}
    .nav-icon{font-size:20px}
    .nav-auth-mobile{display:flex;flex-direction:column;gap:8px;padding-top:12px;border-top:1px solid ${C.border};margin-top:6px}
    .hero-banner{padding:24px 16px!important}
    .hero-title{font-size:20px!important;letter-spacing:0!important}
    .hero-sub{font-size:12px!important;margin-bottom:16px!important}
    .cat-grid{grid-template-columns:repeat(3,1fr)}
    .prod-grid{grid-template-columns:1fr}
    .cart-grid{grid-template-columns:1fr}
    .cart-sticky{position:static!important;top:auto!important}
    .filter-grid{grid-template-columns:1fr 1fr}
    .admin-stats{grid-template-columns:repeat(2,1fr)}
    .support-grid{grid-template-columns:1fr}
    .uploader-grid{grid-template-columns:1fr}
    .overlay{align-items:flex-end!important;padding:0!important}
    .modal{max-width:100%!important;border-radius:16px 16px 0 0!important;max-height:92dvh!important}
    .page-pad{padding:18px 14px 50px!important}
    .page-title{font-size:14px!important;letter-spacing:1px!important}
    .sec{font-size:10px!important;letter-spacing:1px!important}
  }
  @media(min-width:641px) and (max-width:1024px){
    .cat-grid{grid-template-columns:repeat(5,1fr)}
    .prod-grid{grid-template-columns:repeat(2,1fr)}
    .cart-grid{grid-template-columns:1fr}
    .cart-sticky{position:static!important;top:auto!important}
    .filter-grid{grid-template-columns:1fr 1fr}
  }
`;

// ─── Data ──────────────────────────────────────────────────────────────────────
const CATS = [
  {id:1,name:"Smartphones",icon:"📱"},{id:2,name:"Laptops & PCs",icon:"💻"},
  {id:3,name:"Audio",icon:"🎧"},{id:4,name:"Gaming",icon:"🎮"},
  {id:5,name:"Cameras",icon:"📸"},{id:6,name:"Smart Home",icon:"🏠"},
  {id:7,name:"Wearables",icon:"⌚"},{id:8,name:"Drones",icon:"🚁"},
  {id:9,name:"Networking",icon:"📡"},{id:10,name:"Power & Storage",icon:"🔋"},
];
const CAT_ICON = {1:"📱",2:"💻",3:"🎧",4:"🎮",5:"📸",6:"🏠",7:"⌚",8:"🚁",9:"📡",10:"🔋"};

// Maps a DB product row → the shape the UI components expect
const normalizeProduct = p => ({
  id: p.id,
  name: p.name,
  cat: p.category_id,
  price: parseFloat(p.price),
  disc: p.discount || 0,
  rating: parseFloat(p.rating) || 0,
  reviews: p.review_count || 0,
  stock: p.stock,
  icon: CAT_ICON[p.category_id] || '📦',
  seller: p.seller_name || 'Casitech Store',
  hot: p.is_hot,
  isNew: p.is_new,
  desc: p.description || '',
  imgSrc: p.images?.[0] || null,
  images: p.images || [],
});

const INIT_PRODUCTS = [
  {id:1,name:"ProMax Laptop 16 Ultra",cat:2,price:850000,disc:15,rating:4.8,reviews:342,stock:12,icon:"💻",seller:"TechHub",hot:true,isNew:false,desc:"Intel Core i9, 32GB DDR5, 1TB NVMe SSD, RTX 4070. 4K OLED. Thunderbolt 4."},
  {id:2,name:"Noise-Cancel Headphones X9",cat:3,price:165000,disc:30,rating:4.6,reviews:891,stock:45,icon:"🎧",seller:"SoundWave",hot:true,isNew:false,desc:"40h battery, 40mm drivers, active noise cancellation, foldable."},
  {id:3,name:"SmartWatch Series 5 Pro",cat:7,price:260000,disc:0,rating:4.7,reviews:213,stock:8,icon:"⌚",seller:"GadgetZone",hot:false,isNew:true,desc:"ECG tracking, GPS, 2-day battery. AMOLED. Water resistant 50m."},
  {id:4,name:"4K Drone Camera Pro",cat:8,price:390000,disc:20,rating:4.5,reviews:127,stock:3,icon:"🚁",seller:"AirTech",hot:true,isNew:false,desc:"30-min flight, 3-axis gimbal, 4K/60fps HDR, obstacle sensing, 10km range."},
  {id:5,name:"Galaxy Ultra S25",cat:1,price:720000,disc:10,rating:4.9,reviews:1204,stock:20,icon:"📱",seller:"MobileZone",hot:true,isNew:true,desc:"6.8\" Dynamic AMOLED, 200MP camera, Snapdragon 8 Gen 4, 5000mAh, 45W fast charge."},
  {id:6,name:"Portable Bluetooth Speaker",cat:3,price:45000,disc:22,rating:4.5,reviews:654,stock:80,icon:"🔊",seller:"SoundWave",hot:false,isNew:true,desc:"360° sound, 20h battery, IPX7 waterproof. Party mode links 100 speakers."},
  {id:7,name:"Gaming Console X Pro",cat:4,price:325000,disc:0,rating:4.8,reviews:3241,stock:7,icon:"🎮",seller:"GameVault",hot:true,isNew:false,desc:"8K gaming, 2TB SSD, ray tracing, 120fps, backward compatible."},
  {id:8,name:"Mirrorless Camera 45MP",cat:5,price:1240000,disc:8,rating:4.9,reviews:318,stock:5,icon:"📸",seller:"ProLens",hot:false,isNew:true,desc:"45MP full-frame, 4K/120fps, 10-stop IBIS, dual card slots, weather sealed."},
  {id:9,name:"Wi-Fi 7 Mesh Router Pro",cat:9,price:230000,disc:12,rating:4.6,reviews:209,stock:30,icon:"📡",seller:"NetCore",hot:false,isNew:true,desc:"Wi-Fi 7 BE19000, tri-band, 10Gbps WAN, covers 6000 sq ft, 200+ devices."},
  {id:10,name:"2TB NVMe SSD Gen5",cat:10,price:125000,disc:18,rating:4.7,reviews:876,stock:60,icon:"🔋",seller:"StorageKing",hot:false,isNew:false,desc:"14,000MB/s read, PCIe 5.0, M.2 2280, heatsink included. 5-year warranty."},
  {id:11,name:"True Wireless Earbuds Pro",cat:3,price:85000,disc:15,rating:4.7,reviews:2341,stock:150,icon:"🎵",seller:"SoundWave",hot:false,isNew:false,desc:"ANC + transparency, 36h total, spatial audio, IPX4, wireless charging case."},
  {id:12,name:"VR Headset Infinity 3",cat:7,price:390000,disc:25,rating:4.6,reviews:432,stock:15,icon:"🥽",seller:"VirtualEdge",hot:true,isNew:false,desc:"4K per eye, 120Hz, eye tracking, hand tracking, 3h battery. Standalone + PC VR."},
  {id:13,name:"Mechanical Gaming Keyboard",cat:4,price:98000,disc:0,rating:4.8,reviews:1876,stock:45,icon:"⌨️",seller:"GameVault",hot:false,isNew:true,desc:"Hall effect switches, per-key RGB, 8000Hz polling, gasket mount, aluminium."},
  {id:14,name:"Smart Home Security Hub",cat:6,price:59000,disc:0,rating:4.4,reviews:567,stock:50,icon:"🏠",seller:"SmartLiving",hot:false,isNew:true,desc:"Controls 200+ devices, Matter & Thread ready, local processing, works offline."},
];

const BANNERS = [
  {title:"MEGA TECH SALE",sub:"Up to 40% off premium electronics",tag:"HOT DEALS",col:C.green},
  {title:"NEW ARRIVALS",sub:"Cutting-edge tech drops every week",tag:"NEW IN",col:C.cyan},
  {title:"FLASH DEALS",sub:"Limited time — limited stock",tag:"⚡ FLASH",col:"#ff6600"},
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
const fp = p => p.disc ? Math.round(p.price*(1-p.disc/100)) : Math.round(p.price);
const fmtP = n => Math.round(n).toLocaleString('fr-FR') + ' FCFA';
const stars = r => "★".repeat(Math.floor(r))+"☆".repeat(5-Math.floor(r));

// ─── Toast ─────────────────────────────────────────────────────────────────────
function Toast({msg,onClose}){
  useEffect(()=>{const t=setTimeout(onClose,3000);return()=>clearTimeout(t);},[onClose]);
  return(
    <div className="toast">
      <span style={{color:C.green,fontFamily:"Share Tech Mono",fontSize:13}}>OK</span>
      <span style={{fontSize:13}}>{msg}</span>
      <button onClick={onClose} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",marginLeft:4}}>✕</button>
    </div>
  );
}

// ─── Product Card ──────────────────────────────────────────────────────────────
function PCard({p,onCart,onView,wish,onWish}){
  const price=fp(p);
  const wished=wish.includes(p.id);
  return(
    <div className="card-hover" onClick={()=>onView(p)}
      style={{background:C.card,borderRadius:6,overflow:"hidden",border:`1px solid ${C.border}`,minWidth:192,flex:"0 0 auto",cursor:"pointer"}}>
      <div style={{background:C.card2,height:136,display:"flex",alignItems:"center",justifyContent:"center",fontSize:56,position:"relative",borderBottom:`1px solid ${C.border}`}}>
        {p.imgSrc?<img src={p.imgSrc} alt="" style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute",inset:0}}/>:null}
        <span style={{position:"relative"}}>{p.icon}</span>
        {p.hot&&<span className="hot" style={{position:"absolute",top:7,left:7}}>▲ HOT</span>}
        {p.isNew&&!p.hot&&<span className="tag" style={{position:"absolute",top:7,left:7}}>// NEW</span>}
        {p.disc>0&&<span className="sale" style={{position:"absolute",top:7,right:7}}>-{p.disc}%</span>}
        <button onClick={e=>{e.stopPropagation();onWish(p.id);}}
          style={{position:"absolute",bottom:7,right:7,background:wished?`${C.green}33`:C.card,border:`1px solid ${wished?C.green:C.border}`,borderRadius:4,width:26,height:26,cursor:"pointer",fontSize:12,color:wished?C.green:C.muted,display:"flex",alignItems:"center",justifyContent:"center"}}>
          {wished?"❤":"♡"}
        </button>
      </div>
      <div style={{padding:"11px 12px"}}>
        <div style={{fontSize:12,fontWeight:600,marginBottom:3,lineHeight:1.35}}>{p.name}</div>
        <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,marginBottom:6}}>/ {p.seller}</div>
        <div style={{display:"flex",alignItems:"center",gap:4,marginBottom:6}}>
          <span className="star">{stars(p.rating)}</span>
          <span style={{fontSize:10,color:C.muted}}>({p.reviews})</span>
        </div>
        <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:8}}>
          <span className="orb" style={{fontWeight:700,fontSize:14,color:C.green}}>{fmtP(price)}</span>
          {p.disc>0&&<span style={{fontSize:11,color:C.muted,textDecoration:"line-through"}}>{fmtP(p.price)}</span>}
        </div>
        {p.stock<=10&&<div style={{fontFamily:"Share Tech Mono",fontSize:9,color:"#ff6600",marginBottom:7}}>⚠ {p.stock} LEFT</div>}
        <button className="btn" style={{width:"100%",padding:"7px 0",fontSize:9}}
          onClick={e=>{e.stopPropagation();onCart(p);}}>+ ADD TO CART</button>
      </div>
    </div>
  );
}

// ─── Home Page ─────────────────────────────────────────────────────────────────
function HomePage({products,onCart,onView,wish,onWish,onNav}){
  const [bi,setBi]=useState(0);
  const [timer,setTimer]=useState(7200);
  useEffect(()=>{
    const b=setInterval(()=>setBi(x=>(x+1)%BANNERS.length),4500);
    const t=setInterval(()=>setTimer(x=>x>0?x-1:7200),1000);
    return()=>{clearInterval(b);clearInterval(t);};
  },[]);
  const fmt=s=>`${String(Math.floor(s/3600)).padStart(2,"0")}:${String(Math.floor((s%3600)/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  const hot=products.filter(p=>p.hot);
  const isNew=products.filter(p=>p.isNew);
  const sale=products.filter(p=>p.disc>0);
  return(
    <div className="fade-in">
      {/* Hero */}
      <div className="hero-banner" style={{borderRadius:8,padding:"48px 40px",marginBottom:32,position:"relative",overflow:"hidden",border:`1px solid ${C.border}`,background:`linear-gradient(135deg,${C.card} 0%,#080810 100%)`}}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(ellipse at 65% 50%,${BANNERS[bi].col}12 0%,transparent 65%)`,transition:"background .6s"}}/>
        <div style={{position:"absolute",top:0,right:0,width:180,height:"100%",opacity:.05,background:`repeating-linear-gradient(90deg,${C.green} 0,${C.green} 1px,transparent 1px,transparent 38px),repeating-linear-gradient(0deg,${C.green} 0,${C.green} 1px,transparent 1px,transparent 38px)`}}/>
        <div style={{position:"relative"}}>
          <span style={{fontFamily:"Share Tech Mono",fontSize:10,letterSpacing:3,background:`${BANNERS[bi].col}1a`,color:BANNERS[bi].col,padding:"4px 12px",borderRadius:3,border:`1px solid ${BANNERS[bi].col}44`}}>{BANNERS[bi].tag}</span>
          <h1 className="orb glow hero-title" style={{fontSize:34,fontWeight:900,marginTop:14,marginBottom:10,letterSpacing:-0.5}}>{BANNERS[bi].title}</h1>
          <p className="hero-sub" style={{color:C.muted,fontSize:14,marginBottom:26}}>{BANNERS[bi].sub}</p>
          <button className="btn" style={{fontSize:12,padding:"12px 30px",letterSpacing:2}} onClick={()=>onNav("shop")}>SHOP NOW →</button>
        </div>
        <div style={{position:"absolute",bottom:18,right:24,display:"flex",gap:6}}>
          {BANNERS.map((_,i)=><div key={i} onClick={()=>setBi(i)} style={{width:i===bi?20:5,height:4,borderRadius:2,background:i===bi?C.green:C.border,cursor:"pointer",transition:"all .3s"}}/>)}
        </div>
      </div>

      {/* Categories */}
      <div className="sec">CATEGORIES</div>
      <div className="cat-grid">
        {CATS.map(c=>(
          <div key={c.id} onClick={()=>onNav("shop",{cat:c.id})} className="card-hover"
            style={{background:C.card,borderRadius:6,padding:"13px 8px",textAlign:"center",cursor:"pointer",border:`1px solid ${C.border}`}}>
            <div style={{fontSize:24,marginBottom:6}}>{c.icon}</div>
            <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted}}>{c.name}</div>
          </div>
        ))}
      </div>

      {/* Hot Sales */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
        <div className="sec" style={{margin:0}}>▲ HOT SALES</div>
        <div style={{background:C.card,borderRadius:4,padding:"5px 12px",display:"flex",gap:8,alignItems:"center",border:`1px solid ${C.border}`}}>
          <span style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted}}>ENDS IN</span>
          <span className="orb" style={{fontWeight:700,color:C.green,fontSize:12}}>{fmt(timer)}</span>
        </div>
      </div>
      <div className="scroll-x" style={{marginBottom:34}}>{hot.map(p=><PCard key={p.id} p={p} onCart={onCart} onView={onView} wish={wish} onWish={onWish}/>)}</div>

      <div className="sec">// BEST DEALS</div>
      <div className="scroll-x" style={{marginBottom:34}}>{sale.map(p=><PCard key={p.id} p={p} onCart={onCart} onView={onView} wish={wish} onWish={onWish}/>)}</div>

      <div className="sec">✦ NEW ARRIVALS</div>
      <div className="scroll-x">{isNew.map(p=><PCard key={p.id} p={p} onCart={onCart} onView={onView} wish={wish} onWish={onWish}/>)}</div>
    </div>
  );
}

// ─── Shop Page ─────────────────────────────────────────────────────────────────
function ShopPageContent({products,onCart,onView,wish,onWish,initFilters}){
  const [search,setSearch]=useState("");
  const [cat,setCat]=useState(initFilters?.cat||0);
  const [sort,setSort]=useState("popular");
  const [maxP,setMaxP]=useState(1500000);
  const filtered=products
    .filter(p=>(!cat||p.cat===cat)&&p.name.toLowerCase().includes(search.toLowerCase())&&fp(p)<=maxP)
    .sort((a,b)=>sort==="price-asc"?a.price-b.price:sort==="price-desc"?b.price-a.price:sort==="rating"?b.rating-a.rating:b.reviews-a.reviews);
  return(
    <div className="fade-in">
      <div className="orb page-title" style={{fontSize:18,fontWeight:800,letterSpacing:2,marginBottom:4}}>PRODUCT CATALOG</div>
      <div style={{fontFamily:"Share Tech Mono",fontSize:10,color:C.muted,marginBottom:20}}>// CASITECH ELECTRONICS</div>
      <div style={{background:C.card,borderRadius:8,padding:14,marginBottom:20,border:`1px solid ${C.border}`}}>
        <div className="filter-grid">
          <div>
            <label style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,display:"block",marginBottom:4,letterSpacing:1}}>SEARCH</label>
            <input placeholder="Search..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <div>
            <label style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,display:"block",marginBottom:4,letterSpacing:1}}>CATEGORY</label>
            <select value={cat} onChange={e=>setCat(Number(e.target.value))}>
              <option value={0}>All</option>
              {CATS.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div>
            <label style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,display:"block",marginBottom:4,letterSpacing:1}}>SORT</label>
            <select value={sort} onChange={e=>setSort(e.target.value)}>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
            </select>
          </div>
          <div style={{minWidth:110}}>
            <label style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,display:"block",marginBottom:4,letterSpacing:1}}>MAX {maxP.toLocaleString('fr-FR')} FCFA</label>
            <input type="range" min={10000} max={1500000} step={10000} value={maxP} onChange={e=>setMaxP(Number(e.target.value))} style={{width:"100%"}}/>
          </div>
        </div>
      </div>
      <div style={{fontFamily:"Share Tech Mono",fontSize:10,color:C.muted,marginBottom:14}}>// {filtered.length} PRODUCTS</div>
      <div className="prod-grid">
        {filtered.map(p=><PCard key={p.id} p={p} onCart={onCart} onView={onView} wish={wish} onWish={onWish}/>)}
      </div>
      {!filtered.length&&<div style={{textAlign:"center",padding:60,fontFamily:"Share Tech Mono",fontSize:11,color:C.muted}}>// NO PRODUCTS MATCH FILTERS</div>}
    </div>
  );
}

// ─── Product Modal ──────────────────────────────────────────────────────────────
function ProductModal({p,onClose,onCart,wish,onWish}){
  const [qty,setQty]=useState(1);
  const [tab,setTab]=useState("desc");
  const [imgIdx,setImgIdx]=useState(0);
  const [rev,setRev]=useState({rating:5,comment:""});
  const [reviews,setReviews]=useState([
    {name:"Alex M.",rating:5,comment:"Absolutely fantastic — performance exceeded expectations.",date:"2 days ago"},
    {name:"Sarah K.",rating:4,comment:"Great quality, fast shipping. Would recommend!",date:"1 week ago"},
  ]);
  const price=fp(p);
  const wished=wish.includes(p.id);
  const imgs=p.images?.length?p.images:(p.imgSrc?[p.imgSrc]:[]);
  return(
    <div className="overlay" onClick={onClose}>
      <div className="modal fade-in" onClick={e=>e.stopPropagation()}>
        {/* Image carousel */}
        <div style={{position:"relative",width:"100%",height:210,background:C.card2,borderRadius:8,overflow:"hidden",marginBottom:16,flexShrink:0}}>
          {imgs[imgIdx]
            ?<img src={imgs[imgIdx]} alt="" style={{width:"100%",height:"100%",objectFit:"cover",display:"block"}}/>
            :<div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100%",fontSize:64}}>{p.icon}</div>
          }
          {imgs.length>1&&<>
            <button onClick={e=>{e.stopPropagation();setImgIdx(i=>(i-1+imgs.length)%imgs.length);}}
              style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%)",background:"#000000aa",border:"none",color:"#fff",borderRadius:4,width:30,height:30,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
            <button onClick={e=>{e.stopPropagation();setImgIdx(i=>(i+1)%imgs.length);}}
              style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",background:"#000000aa",border:"none",color:"#fff",borderRadius:4,width:30,height:30,cursor:"pointer",fontSize:18,display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
            <div style={{position:"absolute",bottom:8,left:0,right:0,display:"flex",justifyContent:"center",gap:5}}>
              {imgs.map((_,i)=>(
                <div key={i} onClick={e=>{e.stopPropagation();setImgIdx(i);}}
                  style={{width:i===imgIdx?18:5,height:4,borderRadius:2,background:i===imgIdx?"#fff":"#ffffff55",cursor:"pointer",transition:"all .25s"}}/>
              ))}
            </div>
          </>}
          <div style={{position:"absolute",top:8,left:8,display:"flex",gap:4}}>
            {p.hot&&<span className="hot">▲ HOT</span>}
            {p.isNew&&<span className="tag">// NEW</span>}
          </div>
          <button onClick={onClose} style={{position:"absolute",top:8,right:8,background:"#000000bb",border:`1px solid ${C.border}55`,color:"#fff",cursor:"pointer",width:28,height:28,borderRadius:4,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
        </div>
        <div className="orb" style={{fontSize:16,fontWeight:700,marginBottom:4,letterSpacing:.5}}>{p.name}</div>
        <div style={{fontFamily:"Share Tech Mono",fontSize:10,color:C.muted,marginBottom:10}}>/ {p.seller} · {CATS.find(c=>c.id===p.cat)?.name}</div>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12}}>
          <span className="star">{stars(p.rating)}</span>
          <span style={{fontSize:11,color:C.muted}}>{p.rating} ({p.reviews} reviews)</span>
        </div>
        <div style={{display:"flex",alignItems:"baseline",gap:12,marginBottom:16}}>
          <span className="orb" style={{fontSize:24,fontWeight:800,color:C.green}}>{fmtP(price)}</span>
          {p.disc>0&&<><span style={{fontSize:14,color:C.muted,textDecoration:"line-through"}}>{fmtP(p.price)}</span><span className="sale">-{p.disc}%</span></>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
          <span style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted}}>QTY:</span>
          <div style={{display:"flex",border:`1px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
            <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{background:C.card2,border:"none",color:C.text,width:32,height:32,cursor:"pointer",fontSize:16}}>−</button>
            <span className="orb" style={{padding:"0 14px",background:C.card,display:"flex",alignItems:"center",fontSize:12}}>{qty}</span>
            <button onClick={()=>setQty(q=>Math.min(p.stock,q+1))} style={{background:C.card2,border:"none",color:C.text,width:32,height:32,cursor:"pointer",fontSize:16}}>+</button>
          </div>
          <span style={{fontFamily:"Share Tech Mono",fontSize:9,color:p.stock<=5?"#ff6600":C.muted}}>{p.stock} IN STOCK</span>
        </div>
        <div style={{display:"flex",gap:10,marginBottom:18}}>
          <button className="btn" style={{flex:1}} onClick={()=>{onCart(p,qty);onClose();}}>+ ADD {qty} TO CART</button>
          <button onClick={()=>onWish(p.id)} style={{background:wished?`${C.green}1a`:C.card2,border:`1px solid ${wished?C.green:C.border}`,borderRadius:4,width:38,height:38,cursor:"pointer",fontSize:15,color:wished?C.green:C.muted}}>♡</button>
        </div>
        <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:12}}>
          {["desc","reviews"].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{background:"none",border:"none",borderBottom:tab===t?`2px solid ${C.green}`:"2px solid transparent",color:tab===t?C.green:C.muted,padding:"7px 12px",cursor:"pointer",fontFamily:"Share Tech Mono",fontSize:10,letterSpacing:1,marginBottom:-1,textTransform:"uppercase"}}>
              {t==="desc"?"// SPECS":`// REVIEWS (${reviews.length})`}
            </button>
          ))}
        </div>
        {tab==="desc"&&<p style={{fontSize:13,color:C.muted,lineHeight:1.7}}>{p.desc}</p>}
        {tab==="reviews"&&(
          <div>
            {reviews.map((r,i)=>(
              <div key={i} style={{borderBottom:`1px solid ${C.border}`,paddingBottom:10,marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                  <span style={{fontFamily:"Share Tech Mono",fontSize:11,color:C.green}}>/ {r.name}</span>
                  <span style={{fontSize:10,color:C.muted,fontFamily:"Share Tech Mono"}}>{r.date}</span>
                </div>
                <div className="star" style={{marginBottom:4}}>{stars(r.rating)}</div>
                <p style={{fontSize:12,color:C.muted}}>{r.comment}</p>
              </div>
            ))}
            <div style={{marginTop:14}}>
              <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.green,marginBottom:8,letterSpacing:1}}>// WRITE REVIEW</div>
              <div style={{display:"flex",gap:4,marginBottom:8}}>
                {[1,2,3,4,5].map(s=><span key={s} onClick={()=>setRev(v=>({...v,rating:s}))} style={{cursor:"pointer",fontSize:20,color:s<=rev.rating?C.gold:C.border}}>★</span>)}
              </div>
              <textarea rows={3} style={{resize:"none"}} placeholder="Your experience..." value={rev.comment} onChange={e=>setRev(v=>({...v,comment:e.target.value}))}/>
              <button className="btn" style={{marginTop:8}} onClick={()=>{if(rev.comment.trim()){setReviews(r=>[...r,{name:"You",rating:rev.rating,comment:rev.comment,date:"Just now"}]);setRev({rating:5,comment:""});}}}>SUBMIT</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Cart Page ─────────────────────────────────────────────────────────────────
function CartPage({cart,onRemove,onQty,onCheckout}){
  const total=cart.reduce((s,i)=>s+fp(i.p)*i.qty,0);
  if(!cart.length) return(
    <div className="fade-in" style={{textAlign:"center",padding:"80px 0"}}>
      <div style={{fontSize:64,marginBottom:12}}>🛒</div>
      <div className="orb" style={{fontSize:18,letterSpacing:2,marginBottom:6}}>CART EMPTY</div>
      <div style={{fontFamily:"Share Tech Mono",fontSize:10,color:C.muted}}>// NO ITEMS YET</div>
    </div>
  );
  return(
    <div className="fade-in">
      <div className="orb page-title" style={{fontSize:18,fontWeight:800,letterSpacing:2,marginBottom:20}}>CART <span style={{color:C.green}}>({cart.length})</span></div>
      <div className="cart-grid">
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {cart.map(item=>(
            <div key={item.p.id} style={{background:C.card,borderRadius:6,padding:14,border:`1px solid ${C.border}`,display:"flex",gap:14,alignItems:"center"}}>
              <div style={{fontSize:40,width:48,height:48,background:C.card2,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",position:"relative",overflow:"hidden",flexShrink:0}}>
                {item.p.imgSrc?<img src={item.p.imgSrc} alt="" style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute"}}/>:null}
                <span style={{position:"relative"}}>{item.p.icon}</span>
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:13,marginBottom:3}}>{item.p.name}</div>
                <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,marginBottom:8}}>/ {item.p.seller}</div>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{display:"flex",border:`1px solid ${C.border}`,borderRadius:4,overflow:"hidden"}}>
                    <button onClick={()=>onQty(item.p.id,item.qty-1)} style={{background:C.card2,border:"none",color:C.text,width:26,height:26,cursor:"pointer"}}>−</button>
                    <span className="orb" style={{padding:"0 10px",background:C.card,display:"flex",alignItems:"center",fontSize:11}}>{item.qty}</span>
                    <button onClick={()=>onQty(item.p.id,item.qty+1)} style={{background:C.card2,border:"none",color:C.text,width:26,height:26,cursor:"pointer"}}>+</button>
                  </div>
                  <button onClick={()=>onRemove(item.p.id)} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontFamily:"Share Tech Mono",fontSize:9}}>✕ REMOVE</button>
                </div>
              </div>
              <span className="orb" style={{fontSize:14,fontWeight:700,color:C.green,flexShrink:0}}>{fmtP(fp(item.p)*item.qty)}</span>
            </div>
          ))}
        </div>
        <div className="cart-sticky" style={{background:C.card,borderRadius:8,padding:16,border:`1px solid ${C.border}`,position:"sticky",top:72}}>
          <div className="orb" style={{fontSize:12,fontWeight:700,marginBottom:12,letterSpacing:1}}>ORDER SUMMARY</div>
          {cart.map(i=><div key={i.p.id} style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.muted,marginBottom:5}}><span>{i.p.name} ×{i.qty}</span><span>{fmtP(fp(i.p)*i.qty)}</span></div>)}
          <div className="hr"/>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.muted,marginBottom:5}}><span>Shipping</span><span style={{color:C.green}}>FREE</span></div>
          <div className="hr"/>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
            <span className="orb" style={{fontSize:11}}>TOTAL</span>
            <span className="orb" style={{color:C.green,fontSize:16}}>{fmtP(total)}</span>
          </div>
          <button className="btn" style={{width:"100%",padding:12,fontSize:11,letterSpacing:2}} onClick={onCheckout}>CHECKOUT →</button>
          <div style={{marginTop:12,display:"flex",gap:6,justifyContent:"center"}}>
            <span style={{fontSize:9,background:C.card2,padding:"3px 8px",borderRadius:3,color:C.muted,fontFamily:"Share Tech Mono"}}>📱 MTN MOBILE MONEY</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Checkout Modal ────────────────────────────────────────────────────────────
function CheckoutModal({cart,onClose,onDone}){
  const [step,setStep]=useState(1);
  const [f,setF]=useState({name:"",email:"",phone:"",address:"",city:"",notes:"",momoPhone:"",momoRef:""});
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const total=cart.reduce((s,i)=>s+fp(i.p)*i.qty,0);
  const sf=k=>e=>setF(v=>({...v,[k]:e.target.value}));
  const steps=["CONTACT","SHIPPING","PAYMENT"];
  const ok=step===1?(f.name&&f.email&&f.phone):(step===2?(f.address&&f.city):(f.momoPhone&&f.momoRef));

  const advance=async()=>{
    setErr("");
    if(step<3){setStep(s=>s+1);return;}
    setLoading(true);
    try{
      const items=cart.map(i=>({product_id:i.p.id,name:i.p.name,price:fp(i.p),quantity:i.qty}));
      const {data}=await ordersAPI.create({
        items,
        shipping_address:{name:f.name,email:f.email,phone:f.phone,address:f.address,city:f.city},
        payment_method:"momo",
        momo_phone:f.momoPhone,
        momo_reference:f.momoRef,
        notes:f.notes,
      });
      onDone({...f,orderId:data.order.id});
    }catch(e){
      setErr(e.response?.data?.error||"Order failed. Please try again.");
    }finally{setLoading(false);}
  };

  return(
    <div className="overlay" onClick={onClose}>
      <div className="modal fade-in" onClick={e=>e.stopPropagation()} style={{maxWidth:460}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div className="orb" style={{fontSize:14,fontWeight:800,letterSpacing:2}}>CHECKOUT</div>
          <button onClick={onClose} style={{background:C.card2,border:`1px solid ${C.border}`,color:C.muted,cursor:"pointer",width:28,height:28,borderRadius:4}}>✕</button>
        </div>

        {/* Step indicator */}
        <div style={{display:"flex",gap:6,marginBottom:20}}>
          {steps.map((l,i)=>(
            <div key={l} style={{flex:1,textAlign:"center"}}>
              <div style={{height:3,borderRadius:2,background:step>i?C.green:C.border,marginBottom:4,transition:"background .3s"}}/>
              <span style={{fontFamily:"Share Tech Mono",fontSize:8,color:step>i?C.green:C.muted,letterSpacing:.5}}>{l}</span>
            </div>
          ))}
        </div>

        {/* Step 1: Contact */}
        {step===1&&<div style={{display:"flex",flexDirection:"column",gap:10}} className="fade-in">
          <input placeholder="Full Name *" value={f.name} onChange={sf("name")} autoFocus/>
          <input placeholder="Email *" type="email" value={f.email} onChange={sf("email")}/>
          <input placeholder="Phone *" value={f.phone} onChange={sf("phone")}/>
        </div>}

        {/* Step 2: Shipping */}
        {step===2&&<div style={{display:"flex",flexDirection:"column",gap:10}} className="fade-in">
          <input placeholder="Street Address *" value={f.address} onChange={sf("address")}/>
          <input placeholder="City / State *" value={f.city} onChange={sf("city")}/>
          <textarea rows={2} placeholder="Order notes (optional)" value={f.notes} onChange={sf("notes")} style={{resize:"none"}}/>
        </div>}

        {/* Step 3: MTN Mobile Money */}
        {step===3&&<div className="fade-in">
          <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.green,letterSpacing:1,marginBottom:12}}>// MTN MOBILE MONEY PAYMENT</div>
          <div style={{background:"#ffcc0010",border:"1px solid #ffcc0044",borderRadius:8,padding:14,marginBottom:14}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
              <span style={{fontSize:28}}>📱</span>
              <div>
                <div style={{fontFamily:"Share Tech Mono",fontSize:11,color:"#ffcc00",fontWeight:700,letterSpacing:1}}>MTN MOBILE MONEY</div>
                <div style={{fontSize:11,color:C.muted,marginTop:2}}>Send payment then enter your reference below</div>
              </div>
            </div>
            <div style={{fontFamily:"Share Tech Mono",fontSize:10,color:C.muted,lineHeight:2}}>
              1. Dial *165# on your MTN line<br/>
              2. Select Mobile Money → Pay Bill<br/>
              3. Enter amount: <span style={{color:"#ffcc00",fontWeight:700}}>{fmtP(total)}</span><br/>
              4. Copy your transaction reference number
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:14}}>
            <div>
              <label style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,display:"block",marginBottom:4,letterSpacing:1}}>MTN MOMO PHONE NUMBER *</label>
              <input placeholder="e.g. 077 000 0000" value={f.momoPhone} onChange={sf("momoPhone")}/>
            </div>
            <div>
              <label style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,display:"block",marginBottom:4,letterSpacing:1}}>MTN MOMO REFERENCE NUMBER *</label>
              <input placeholder="e.g. 1234567890" value={f.momoRef} onChange={sf("momoRef")}/>
            </div>
          </div>
          <div className="hr"/>
          <div style={{background:C.card2,borderRadius:6,padding:"10px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontFamily:"Share Tech Mono",fontSize:10,color:C.muted}}>TOTAL DUE</span>
            <span className="orb" style={{color:C.green,fontWeight:700,fontSize:15}}>{fmtP(total)}</span>
          </div>
        </div>}

        {err&&<div style={{fontFamily:"Share Tech Mono",fontSize:10,color:C.red,marginTop:8}}>⚠ {err}</div>}

        <div style={{display:"flex",gap:10,marginTop:18}}>
          {step>1&&<button className="btn-o" onClick={()=>setStep(s=>s-1)}>← BACK</button>}
          <button className="btn" style={{flex:1,opacity:loading?0.5:1}} disabled={!ok||loading} onClick={advance}>
            {loading?"⏳ PLACING ORDER...":(step<3?"CONTINUE →":"🔒 PLACE ORDER")}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Order Success ─────────────────────────────────────────────────────────────
function OrderSuccess({order,onClose}){
  return(
    <div className="overlay" onClick={onClose}>
      <div className="modal fade-in" onClick={e=>e.stopPropagation()} style={{textAlign:"center"}}>
        <div style={{fontSize:60,marginBottom:12}}>✅</div>
        <div className="orb glow" style={{fontSize:18,fontWeight:900,letterSpacing:2,marginBottom:6}}>ORDER CONFIRMED</div>
        <p style={{color:C.muted,marginBottom:18,fontSize:13}}>Thank you, <strong style={{color:C.text}}>{order.name}</strong>. Your order is being processed.</p>
        <div style={{background:C.card2,borderRadius:8,padding:14,marginBottom:18,textAlign:"left",border:`1px solid ${C.border}`}}>
          <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted}}>ORDER # {order.orderId?order.orderId.slice(0,8).toUpperCase():'CSTK-'+Math.random().toString(36).substr(2,8).toUpperCase()}</div>
          <div style={{fontSize:12,marginTop:8}}>📧 Confirmation → <span style={{color:C.green}}>{order.email}</span></div>
          <div style={{fontSize:12,marginTop:5}}>📦 Shipping to: {order.address}, {order.city}</div>
        </div>
        <button className="btn" style={{padding:"12px 30px"}} onClick={onClose}>CONTINUE SHOPPING</button>
      </div>
    </div>
  );
}

// ─── Auth Modal ────────────────────────────────────────────────────────────────
function AuthModal({onClose,initialTab='login'}){
  const [tab,setTab]=useState(initialTab);
  const [f,setF]=useState({name:'',email:'',password:'',phone:''});
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState('');
  const {login,register}=useAuthStore();
  const sf=k=>e=>setF(v=>({...v,[k]:e.target.value}));

  const submit=async()=>{
    setErr('');setLoading(true);
    try{
      if(tab==='login'){
        if(!f.email||!f.password){setErr('Email and password required');setLoading(false);return;}
        await login(f.email,f.password);
      }else{
        if(!f.name||!f.email||!f.password){setErr('Name, email and password required');setLoading(false);return;}
        await register(f.name,f.email,f.password,f.phone);
      }
      onClose();
    }catch(e){
      setErr(e.response?.data?.error||'Authentication failed');
    }finally{setLoading(false);}
  };

  return(
    <div className="overlay" onClick={onClose}>
      <div className="modal fade-in" onClick={e=>e.stopPropagation()} style={{maxWidth:400}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:18}}>
          <div style={{display:'flex',borderBottom:`1px solid ${C.border}`,flex:1,marginBottom:-1}}>
            {[['login','// LOGIN'],['register','// REGISTER']].map(([t,l])=>(
              <button key={t} onClick={()=>{setTab(t);setErr('');}} style={{background:'none',border:'none',borderBottom:tab===t?`2px solid ${C.green}`:'2px solid transparent',color:tab===t?C.green:C.muted,padding:'7px 14px',cursor:'pointer',fontFamily:'Share Tech Mono',fontSize:10,letterSpacing:1,marginBottom:-1}}>
                {l}
              </button>
            ))}
          </div>
          <button onClick={onClose} style={{background:C.card2,border:`1px solid ${C.border}`,color:C.muted,cursor:'pointer',width:28,height:28,borderRadius:4,marginLeft:12,flexShrink:0}}>✕</button>
        </div>
        <div className="fade-in" style={{display:'flex',flexDirection:'column',gap:10}}>
          {tab==='register'&&<input placeholder="Full Name *" value={f.name} onChange={sf('name')} autoFocus/>}
          <input placeholder="Email *" type="email" value={f.email} onChange={sf('email')} autoFocus={tab==='login'} onKeyDown={e=>e.key==='Enter'&&submit()}/>
          <input placeholder="Password *" type="password" value={f.password} onChange={sf('password')} onKeyDown={e=>e.key==='Enter'&&submit()}/>
          {tab==='register'&&<input placeholder="Phone (optional)" value={f.phone} onChange={sf('phone')}/>}
          {err&&<div style={{fontFamily:'Share Tech Mono',fontSize:10,color:C.red}}>⚠ {err}</div>}
          <button className="btn" style={{marginTop:4,opacity:loading?.5:1}} disabled={loading} onClick={submit}>
            {loading?'...':(tab==='login'?'AUTHENTICATE →':'CREATE ACCOUNT →')}
          </button>
          <div style={{fontFamily:'Share Tech Mono',fontSize:9,color:C.muted,textAlign:'center',marginTop:2}}>
            {tab==='login'?'No account? ':'Have an account? '}
            <span onClick={()=>{setTab(tab==='login'?'register':'login');setErr('');}} style={{color:C.green,cursor:'pointer',textDecoration:'underline'}}>
              {tab==='login'?'Register here':'Login here'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Wishlist Page ─────────────────────────────────────────────────────────────
function WishlistPage({wish,products,onCart,onView,onWish}){
  const wished=products.filter(p=>wish.includes(p.id));
  if(!wished.length) return(
    <div className="fade-in" style={{textAlign:"center",padding:"80px 0"}}>
      <div style={{fontSize:60,marginBottom:12}}>♡</div>
      <div className="orb" style={{fontSize:18,letterSpacing:2,marginBottom:6}}>WISHLIST EMPTY</div>
      <div style={{fontFamily:"Share Tech Mono",fontSize:10,color:C.muted}}>// SAVE PRODUCTS YOU LOVE</div>
    </div>
  );
  return(
    <div className="fade-in">
      <div className="orb page-title" style={{fontSize:18,fontWeight:800,letterSpacing:2,marginBottom:20}}>WISHLIST <span style={{color:C.green}}>({wished.length})</span></div>
      <div className="prod-grid">
        {wished.map(p=><PCard key={p.id} p={p} onCart={onCart} onView={onView} wish={wish} onWish={onWish}/>)}
      </div>
    </div>
  );
}

// ─── Support Page ──────────────────────────────────────────────────────────────
function SupportPage(){
  const [f,setF]=useState({name:"",email:"",subject:"",message:""});
  const [sent,setSent]=useState(false);
  const [open,setOpen]=useState(null);
  const s=k=>e=>setF(v=>({...v,[k]:e.target.value}));
  const FAQS=[
    ["How do I track my order?","After shipping you'll receive an email with a real-time tracking link."],
    ["Can I return a product?","Returns accepted within 30 days in original condition and packaging."],
    ["What payment methods are accepted?","MTN Mobile Money. Dial *165# and follow the prompts to complete your payment."],
    ["How long does shipping take?","Standard 3–7 business days. Express available at checkout."],
    ["Do products include warranty?","All items include manufacturer warranty. Extended plans available."],
  ];
  return(
    <div className="fade-in">
      <div className="orb" style={{fontSize:18,fontWeight:800,letterSpacing:2,marginBottom:4}}>SUPPORT CENTER</div>
      <div style={{fontFamily:"Share Tech Mono",fontSize:10,color:C.muted,marginBottom:24}}>// 24/7 TECHNICAL SUPPORT</div>
      <div className="support-grid">
        <div>
          <div className="sec">FAQ</div>
          {FAQS.map(([q,a],i)=>(
            <div key={i} style={{background:C.card,borderRadius:6,marginBottom:8,border:`1px solid ${C.border}`,overflow:"hidden"}}>
              <button onClick={()=>setOpen(open===i?null:i)} style={{width:"100%",background:"none",border:"none",color:C.text,padding:"12px 14px",textAlign:"left",cursor:"pointer",display:"flex",justifyContent:"space-between",fontFamily:"'Exo 2'",fontWeight:600,fontSize:13}}>
                {q}<span style={{color:C.green,fontFamily:"Share Tech Mono"}}>{open===i?"−":"+"}</span>
              </button>
              {open===i&&<div style={{padding:"0 14px 12px",fontSize:12,color:C.muted,lineHeight:1.7}}>{a}</div>}
            </div>
          ))}
        </div>
        <div>
          <div className="sec">CONTACT</div>
          {sent?(
            <div style={{background:`${C.green}0d`,border:`1px solid ${C.green}33`,borderRadius:8,padding:24,textAlign:"center"}}>
              <div style={{fontSize:40,marginBottom:10}}>✅</div>
              <div className="orb" style={{color:C.green,fontSize:12,letterSpacing:1,marginBottom:6}}>MESSAGE SENT</div>
              <div style={{color:C.muted,fontSize:12}}>We'll respond within 24 hours.</div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input placeholder="Full Name" value={f.name} onChange={s("name")}/>
              <input placeholder="Email" type="email" value={f.email} onChange={s("email")}/>
              <input placeholder="Subject" value={f.subject} onChange={s("subject")}/>
              <textarea rows={5} placeholder="Describe your issue..." value={f.message} onChange={s("message")} style={{resize:"none"}}/>
              <button className="btn" onClick={()=>f.name&&f.email&&f.message&&setSent(true)}>SEND MESSAGE</button>
            </div>
          )}
          <div style={{marginTop:18,background:C.card,borderRadius:8,padding:14,border:`1px solid ${C.border}`}}>
            <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.green,letterSpacing:1,marginBottom:8}}>// GET IN TOUCH</div>
            <div style={{fontSize:12,color:C.muted,lineHeight:2.2}}>
              📧 <a href="mailto:foncasimir05@gmail.com" style={{color:C.muted,textDecoration:"none"}}>foncasimir05@gmail.com</a><br/>
              📞 <a href="tel:+237681735778" style={{color:C.muted,textDecoration:"none"}}>+237 681 735 778</a><br/>
              💬 <a href="https://wa.me/237681735778" target="_blank" rel="noopener noreferrer" style={{color:C.green,textDecoration:"none"}}>WhatsApp us</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Admin Login ───────────────────────────────────────────────────────────────
function AdminLogin({onLogin}){
  const [creds,setCreds]=useState({user:"",pass:""});
  const [err,setErr]=useState(false);
  const attempt=()=>{
    if(creds.user==="admin"&&creds.pass==="casitech123"){onLogin();setErr(false);}
    else setErr(true);
  };
  return(
    <div className="fade-in" style={{maxWidth:360,margin:"60px auto"}}>
      <div style={{textAlign:"center",marginBottom:28}}>
        <div className="orb glow" style={{fontSize:24,fontWeight:900,letterSpacing:3,marginBottom:6}}>
          <span style={{color:C.green}}>CASI</span><span style={{color:C.text}}>TECH</span>
        </div>
        <div style={{fontFamily:"Share Tech Mono",fontSize:10,color:C.muted,letterSpacing:2}}>// ADMIN ACCESS PORTAL</div>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:26}}>
        <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.green,letterSpacing:2,marginBottom:16}}>// CREDENTIALS REQUIRED</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <input placeholder="Username" value={creds.user} onChange={e=>setCreds(c=>({...c,user:e.target.value}))}/>
          <input placeholder="Password" type="password" value={creds.pass} onChange={e=>setCreds(c=>({...c,pass:e.target.value}))} onKeyDown={e=>e.key==="Enter"&&attempt()}/>
          {err&&<div style={{fontFamily:"Share Tech Mono",fontSize:10,color:C.red}}>⚠ INVALID CREDENTIALS</div>}
          <button className="btn" style={{marginTop:4}} onClick={attempt}>AUTHENTICATE →</button>
        </div>
        <div style={{marginTop:14,fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,textAlign:"center"}}>demo: admin / casitech123</div>
      </div>
    </div>
  );
}

// ─── Product Uploader ──────────────────────────────────────────────────────────
function Uploader({products,setProducts,onRefresh}){
  const [imgData,setImgData]=useState(null);
  const [imgFile,setImgFile]=useState(null);
  const [extraImgs,setExtraImgs]=useState([{data:null,file:null},{data:null,file:null}]);
  const [publishErr,setPublishErr]=useState("");
  const [form,setForm]=useState({name:"",cat:1,price:"",disc:0,stock:"",desc:"",seller:"Casitech Store",hot:false,isNew:true});
  const [stage,setStage]=useState("idle"); // idle|preview|analyzing|ready|saving|done
  const [drag,setDrag]=useState(false);
  const [urlInput,setUrlInput]=useState("");
  const [urlErr,setUrlErr]=useState("");
  const [inputMode,setInputMode]=useState("drop"); // drop|url|paste
  const fileRef=useRef();
  const camRef=useRef();
  const dropRef=useRef();

  // ── Load from File object ──
  const loadFile=file=>{
    if(!file||!file.type.startsWith("image/"))return;
    setImgFile(file);
    const r=new FileReader();
    r.onload=e=>{setImgData(e.target.result);setStage("preview");setUrlErr("");};
    r.readAsDataURL(file);
  };

  // ── Load from URL ──
  const loadUrl=async()=>{
    const url=urlInput.trim();
    if(!url)return;
    setUrlErr("");
    try{
      const res=await fetch(url);
      if(!res.ok)throw new Error("fetch failed");
      const blob=await res.blob();
      if(!blob.type.startsWith("image/"))throw new Error("not an image");
      loadFile(new File([blob],"product.jpg",{type:blob.type}));
    }catch{
      // CORS often blocks direct fetch — fall back to just using URL as src
      setImgData(url);setStage("preview");setUrlErr("");
    }
  };

  // ── Paste from clipboard ──
  const handlePaste=async()=>{
    try{
      const items=await navigator.clipboard.read();
      for(const item of items){
        const imgType=item.types.find(t=>t.startsWith("image/"));
        if(imgType){
          const blob=await item.getType(imgType);
          loadFile(new File([blob],"paste.png",{type:imgType}));
          return;
        }
      }
      setUrlErr("No image found in clipboard. Copy an image first.");
    }catch{
      setUrlErr("Paste failed — try the URL or drag & drop method instead.");
    }
  };

  // ── Global paste listener ──
  useEffect(()=>{
    const onPaste=e=>{
      const item=[...e.clipboardData.items].find(i=>i.type.startsWith("image/"));
      if(item){const blob=item.getAsFile();loadFile(blob);}
    };
    window.addEventListener("paste",onPaste);
    return()=>window.removeEventListener("paste",onPaste);
  },[]);

  // ── AI analyze ──
  const analyze=async()=>{
    setStage("analyzing");
    try{
      let base64,mt;
      if(imgData.startsWith("data:")){
        base64=imgData.split(",")[1];
        mt=imgData.split(";")[0].split(":")[1];
      } else {
        // It's a URL — fetch and convert
        const res=await fetch(imgData);
        const blob=await res.blob();
        mt=blob.type||"image/jpeg";
        base64=await new Promise(r=>{const fr=new FileReader();fr.onload=e=>r(e.target.result.split(",")[1]);fr.readAsDataURL(blob);});
      }
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-20250514",max_tokens:1000,
          messages:[{role:"user",content:[
            {type:"image",source:{type:"base64",media_type:mt,data:base64}},
            {type:"text",text:`Analyze this electronics product image. Return ONLY a JSON object, no markdown, no explanation:\n{"name":"specific product name","cat":<number 1-10: 1=Smartphones,2=Laptops,3=Audio,4=Gaming,5=Cameras,6=SmartHome,7=Wearables,8=Drones,9=Networking,10=PowerStorage>,"price":<realistic USD retail price as number>,"disc":<0-30>,"stock":<20-100>,"desc":"2-3 sentences with key specs","seller":"Casitech Store"}`}
          ]}]
        })
      });
      const data=await res.json();
      const txt=data.content.map(b=>b.text||"").join("");
      const parsed=JSON.parse(txt.replace(/```json|```/g,"").trim());
      setForm(f=>({...f,...parsed}));
      setStage("ready");
    }catch(e){console.error(e);setStage("preview");}
  };

  const publish=async()=>{
    if(!form.name||!form.price||!form.stock)return;
    setStage("saving");
    setPublishErr("");
    try{
      const fd=new FormData();
      fd.append('name',form.name);fd.append('description',form.desc);
      fd.append('price',form.price);fd.append('discount',form.disc||0);
      fd.append('category_id',form.cat);fd.append('stock',form.stock);
      fd.append('is_hot',form.hot);fd.append('is_new',form.isNew);
      if(imgFile)fd.append('images',imgFile);
      // URL fallback: CORS blocked fetch so imgFile is null but imgData holds an http URL
      else if(imgData&&!imgData.startsWith('data:'))fd.append('imageUrl',imgData);
      extraImgs.forEach(e=>{if(e.file)fd.append('images',e.file);});
      const {data}=await productsAPI.create(fd);
      if(data.warning)setPublishErr('⚠ '+data.warning);
      if(onRefresh)await onRefresh();
      setStage("done");
    }catch(e){
      setPublishErr(e.response?.data?.error||'Save failed — check your connection and try again.');
      setStage("ready");
    }
  };

  const reset=()=>{setImgData(null);setImgFile(null);setExtraImgs([{data:null,file:null},{data:null,file:null}]);setPublishErr("");setStage("idle");setUrlInput("");setUrlErr("");setForm({name:"",cat:1,price:"",disc:0,stock:"",desc:"",seller:"Casitech Store",hot:false,isNew:true});};
  const sf=k=>e=>setForm(f=>({...f,[k]:e.target.type==="checkbox"?e.target.checked:e.target.value}));

  if(stage==="done") return(
    <div className="fade-in" style={{textAlign:"center",padding:"60px 0"}}>
      <div style={{fontSize:60,marginBottom:12}}>🚀</div>
      <div className="orb glow" style={{fontSize:18,fontWeight:800,letterSpacing:2,marginBottom:6}}>PRODUCT LIVE!</div>
      <div style={{fontFamily:"Share Tech Mono",fontSize:11,color:C.muted,marginBottom:24}}>// {form.name} IS NOW IN THE STORE</div>
      <button className="btn" onClick={reset}>+ ADD ANOTHER</button>
    </div>
  );

  return(
    <div className="uploader-grid">
      {/* Left: image */}
      <div>
        <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.green,letterSpacing:2,marginBottom:12}}>// STEP 1 — LOAD PRODUCT IMAGE</div>

        {/* Mode tabs */}
        {!imgData&&(
          <div style={{display:"flex",gap:0,marginBottom:10,borderRadius:6,overflow:"hidden",border:`1px solid ${C.border}`}}>
            {[["drop","📁 FILE"],["url","🔗 URL"],["paste","📋 PASTE"]].map(([m,l])=>(
              <button key={m} onClick={()=>setInputMode(m)} style={{flex:1,background:inputMode===m?C.green:C.card2,border:"none",color:inputMode===m?"#000":C.muted,cursor:"pointer",fontFamily:"Share Tech Mono",fontSize:9,letterSpacing:1,padding:"8px 0",fontWeight:inputMode===m?700:400}}>
                {l}
              </button>
            ))}
          </div>
        )}

        {/* Image preview */}
        {imgData?(
          <div style={{position:"relative",borderRadius:8,overflow:"hidden",border:`1px solid ${C.border}`}}>
            <img src={imgData} alt="product" style={{width:"100%",height:240,objectFit:"cover",display:"block"}}
              onError={()=>{setUrlErr("Could not load image from that URL.");setImgData(null);setStage("idle");}}/>
            {stage==="analyzing"&&(
              <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#000000cc",gap:12}}>
                <div style={{fontFamily:"Share Tech Mono",fontSize:10,color:C.green,letterSpacing:2}}>// AI ANALYZING...</div>
                <div style={{width:180,height:3,background:C.border,borderRadius:2,overflow:"hidden"}}>
                  <div style={{height:"100%",background:C.green,animation:"analyzePulse 1.2s ease-in-out infinite"}}/>
                </div>
              </div>
            )}
            <button onClick={reset} style={{position:"absolute",top:8,right:8,background:"#000000bb",border:`1px solid ${C.border}`,borderRadius:4,color:C.muted,cursor:"pointer",width:26,height:26,fontSize:12}}>✕</button>
          </div>
        ):(
          <>
            {/* DROP mode */}
            {inputMode==="drop"&&(
              <div ref={dropRef}
                onDragOver={e=>{e.preventDefault();setDrag(true);}}
                onDragLeave={()=>setDrag(false)}
                onDrop={e=>{e.preventDefault();setDrag(false);loadFile(e.dataTransfer.files[0]);}}
                onClick={()=>fileRef.current.click()}
                style={{border:`2px dashed ${drag?C.green:C.border}`,borderRadius:8,height:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:drag?`${C.green}08`:C.card,transition:"all .2s",gap:8}}>
                <div style={{fontSize:44}}>{drag?"✅":"📂"}</div>
                <div className="orb" style={{fontSize:10,letterSpacing:2,color:drag?C.green:C.muted}}>{drag?"DROP IT!":"DRAG & DROP"}</div>
                <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted}}>or click to open file picker</div>
                <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>loadFile(e.target.files[0])}/>
              </div>
            )}
            {/* Also show camera button in drop mode */}
            {inputMode==="drop"&&(
              <div style={{display:"flex",gap:8,marginTop:8}}>
                <button className="btn-o" style={{flex:1,fontSize:9}} onClick={()=>fileRef.current.click()}>📁 BROWSE FILES</button>
                <label style={{flex:1}}>
                  <input ref={camRef} type="file" accept="image/*" capture="environment" style={{display:"none"}} onChange={e=>loadFile(e.target.files[0])}/>
                  <span onClick={()=>camRef.current.click()} className="btn-o" style={{display:"block",textAlign:"center",cursor:"pointer",fontSize:9,padding:"9px 0",borderRadius:4}}>📷 CAMERA</span>
                </label>
              </div>
            )}

            {/* URL mode */}
            {inputMode==="url"&&(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:16,display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,letterSpacing:1}}>// PASTE AN IMAGE URL</div>
                  <input placeholder="https://example.com/product.jpg" value={urlInput} onChange={e=>setUrlInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&loadUrl()}/>
                  {urlErr&&<div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.red}}>⚠ {urlErr}</div>}
                  <button className="btn" style={{fontSize:9,padding:"9px 0"}} onClick={loadUrl}>LOAD IMAGE →</button>
                </div>
                <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,lineHeight:1.7}}>
                  Tip: Right-click any product image online → "Copy image address" → paste here.
                </div>
              </div>
            )}

            {/* PASTE mode */}
            {inputMode==="paste"&&(
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                <div
                  onClick={handlePaste}
                  style={{border:`2px dashed ${C.border}`,borderRadius:8,height:200,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",background:C.card,gap:8}}
                  onPaste={e=>{const item=[...e.clipboardData.items].find(i=>i.type.startsWith("image/"));if(item)loadFile(item.getAsFile());}}>
                  <div style={{fontSize:44}}>📋</div>
                  <div className="orb" style={{fontSize:10,letterSpacing:2,color:C.muted}}>CLICK TO PASTE</div>
                  <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,textAlign:"center",padding:"0 20px"}}>Copy an image (Ctrl+C on an image), then click here or press Ctrl+V anywhere</div>
                </div>
                {urlErr&&<div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.red}}>⚠ {urlErr}</div>}
              </div>
            )}
          </>
        )}

        {/* Analyze / status */}
        {/* Extra image slots — shown once main image is loaded */}
        {imgData&&(
          <div style={{marginTop:10}}>
            <div style={{fontFamily:"Share Tech Mono",fontSize:8,color:C.muted,letterSpacing:1,marginBottom:6}}>// ADDITIONAL IMAGES (optional)</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {extraImgs.map((ex,i)=>(
                <div key={i}>
                  {ex.data?(
                    <div style={{position:"relative",borderRadius:6,overflow:"hidden",height:76,border:`1px solid ${C.border}`}}>
                      <img src={ex.data} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      <button onClick={()=>setExtraImgs(s=>s.map((x,j)=>j===i?{data:null,file:null}:x))}
                        style={{position:"absolute",top:3,right:3,background:"#000000cc",border:"none",borderRadius:3,color:"#fff",cursor:"pointer",width:18,height:18,fontSize:10,display:"flex",alignItems:"center",justifyContent:"center"}}>✕</button>
                    </div>
                  ):(
                    <label style={{display:"block",cursor:"pointer"}}>
                      <input type="file" accept="image/*" style={{display:"none"}} onChange={e=>{
                        const file=e.target.files[0];
                        if(!file||!file.type.startsWith("image/"))return;
                        const r=new FileReader();
                        r.onload=ev=>setExtraImgs(s=>s.map((x,j)=>j===i?{data:ev.target.result,file}:x));
                        r.readAsDataURL(file);
                      }}/>
                      <div style={{border:`2px dashed ${C.border}`,borderRadius:6,height:76,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,background:C.card}}>
                        <div style={{fontSize:18}}>📷</div>
                        <div style={{fontFamily:"Share Tech Mono",fontSize:8,color:C.muted}}>IMG {i+2}</div>
                      </div>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {stage==="preview"&&(
          <div style={{marginTop:10,background:`${C.cyan}0d`,border:`1px solid ${C.cyan}33`,borderRadius:5,padding:"10px 12px",fontFamily:"Share Tech Mono",fontSize:10,color:C.cyan,textAlign:"center",letterSpacing:1}}>
            ⚙ AI Analysis coming soon — fill in details manually
          </div>
        )}
        <div style={{marginTop:14,background:C.card2,border:`1px solid ${C.border}`,borderRadius:6,padding:12}}>
          <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.cyan,letterSpacing:1,marginBottom:6}}>// HOW IT WORKS</div>
          <div style={{fontSize:11,color:C.muted,lineHeight:1.7}}>Load a product photo via drag & drop, file picker, camera, URL, or clipboard paste. Then fill in the product details manually and hit Publish.</div>
        </div>
      </div>

      {/* Right: form */}
      <div>
        <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.green,letterSpacing:2,marginBottom:12}}>// STEP 2 — REVIEW & PUBLISH</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div>
            <label style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,display:"block",marginBottom:4,letterSpacing:1}}>PRODUCT NAME *</label>
            <input placeholder="e.g. Sony WH-1000XM6" value={form.name} onChange={sf("name")}/>
          </div>
          <div>
            <label style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,display:"block",marginBottom:4,letterSpacing:1}}>CATEGORY *</label>
            <select value={form.cat} onChange={sf("cat")}>{CATS.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            <div>
              <label style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,display:"block",marginBottom:4,letterSpacing:1}}>PRICE (FCFA) *</label>
              <input type="number" placeholder="299" value={form.price} onChange={sf("price")}/>
            </div>
            <div>
              <label style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,display:"block",marginBottom:4,letterSpacing:1}}>DISC %</label>
              <input type="number" placeholder="0" min="0" max="80" value={form.disc} onChange={sf("disc")}/>
            </div>
            <div>
              <label style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,display:"block",marginBottom:4,letterSpacing:1}}>STOCK *</label>
              <input type="number" placeholder="50" value={form.stock} onChange={sf("stock")}/>
            </div>
          </div>
          <div>
            <label style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,display:"block",marginBottom:4,letterSpacing:1}}>SELLER</label>
            <input placeholder="Casitech Store" value={form.seller} onChange={sf("seller")}/>
          </div>
          <div>
            <label style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,display:"block",marginBottom:4,letterSpacing:1}}>DESCRIPTION</label>
            <textarea rows={3} placeholder="Key specs and features..." value={form.desc} onChange={sf("desc")} style={{resize:"none"}}/>
          </div>
          <div style={{display:"flex",gap:20}}>
            <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer"}}>
              <input type="checkbox" checked={form.hot} onChange={sf("hot")}/>
              <span style={{fontFamily:"Share Tech Mono",fontSize:9,letterSpacing:1}}>▲ HOT</span>
            </label>
            <label style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer"}}>
              <input type="checkbox" checked={form.isNew} onChange={sf("isNew")}/>
              <span style={{fontFamily:"Share Tech Mono",fontSize:9,letterSpacing:1}}>✦ NEW</span>
            </label>
          </div>
          {form.name&&form.price&&(
            <div style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:6,padding:"9px 12px",display:"flex",alignItems:"center",gap:10}}>
              <div style={{fontSize:24}}>{CAT_ICON[Number(form.cat)]||"📦"}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600}}>{form.name}</div>
                <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted}}>/ {form.seller}</div>
              </div>
              <span className="orb" style={{color:C.green,fontWeight:700,fontSize:13}}>
                {fmtP(form.disc>0?Math.round(form.price*(1-form.disc/100)):Math.round(parseFloat(form.price||0)))}
              </span>
            </div>
          )}
          {publishErr&&<div style={{fontFamily:"Share Tech Mono",fontSize:10,color:C.red,padding:"6px 0"}}>⚠ {publishErr}</div>}
          <button className="btn" style={{padding:13,fontSize:11,letterSpacing:2,marginTop:4}}
            disabled={!form.name||!form.price||!form.stock||stage==="saving"} onClick={publish}>
            {stage==="saving"?"⏳ SAVING...":"🚀 PUBLISH PRODUCT"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Product Manager ───────────────────────────────────────────────────────────
function Manager({products,setProducts,onRefresh}){
  const [search,setSearch]=useState("");
  const [editing,setEditing]=useState(null);
  const filtered=products.filter(p=>p.name.toLowerCase().includes(search.toLowerCase()));
  const remove=async id=>{
    setProducts(p=>p.filter(x=>x.id!==id));
    try{await productsAPI.remove(id);}catch(e){console.warn('Delete failed:',e.message);}
  };
  const toggleHot=async id=>{
    const cur=products.find(x=>x.id===id);
    setProducts(p=>p.map(x=>x.id===id?{...x,hot:!x.hot}:x));
    try{await productsAPI.update(id,{is_hot:!cur?.hot});}catch(e){console.warn('Update failed:',e.message);}
  };
  const toggleHide=id=>setProducts(p=>p.map(x=>x.id===id?{...x,hidden:!x.hidden}:x));
  const saveEdit=u=>{setProducts(p=>p.map(x=>x.id===u.id?u:x));setEditing(null);};
  return(
    <div>
      <div style={{marginBottom:14}}><input placeholder="Search products..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filtered.map(p=>(
          <div key={p.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"11px 14px",display:"flex",alignItems:"center",gap:12,opacity:p.hidden?.5:1}}>
            <div style={{width:44,height:44,background:C.card2,borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,position:"relative",overflow:"hidden",flexShrink:0}}>
              {p.imgSrc?<img src={p.imgSrc} alt="" style={{width:"100%",height:"100%",objectFit:"cover",position:"absolute"}}/>:null}
              <span style={{position:"relative"}}>{p.icon}</span>
            </div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:13,fontWeight:600,marginBottom:2}}>{p.name}</div>
              <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted}}>
                {CATS.find(c=>c.id===p.cat)?.name} · {fmtP(p.price)} · {p.stock} units
                {p.hot&&<span style={{color:C.green,marginLeft:8}}>▲HOT</span>}
                {p.isNew&&<span style={{color:C.cyan,marginLeft:6}}>✦NEW</span>}
                {p.hidden&&<span style={{color:C.red,marginLeft:6}}>⊘ HIDDEN</span>}
              </div>
            </div>
            <div style={{display:"flex",gap:5}}>
              <button onClick={()=>toggleHot(p.id)} title="Toggle Hot" style={{background:p.hot?`${C.green}22`:C.card2,border:`1px solid ${p.hot?C.green:C.border}`,borderRadius:4,color:p.hot?C.green:C.muted,cursor:"pointer",width:28,height:28,fontSize:11}}>▲</button>
              <button onClick={()=>toggleHide(p.id)} title="Toggle Visibility" style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:4,color:C.muted,cursor:"pointer",width:28,height:28,fontSize:11}}>{p.hidden?"👁":"🙈"}</button>
              <button onClick={()=>setEditing({...p})} title="Edit" style={{background:C.card2,border:`1px solid ${C.border}`,borderRadius:4,color:C.muted,cursor:"pointer",width:28,height:28,fontSize:11}}>✏</button>
              <button onClick={()=>remove(p.id)} title="Delete" style={{background:`${C.red}11`,border:`1px solid ${C.red}44`,borderRadius:4,color:C.red,cursor:"pointer",width:28,height:28,fontSize:11}}>✕</button>
            </div>
          </div>
        ))}
        {!filtered.length&&<div style={{textAlign:"center",padding:40,fontFamily:"Share Tech Mono",fontSize:10,color:C.muted}}>// NO PRODUCTS FOUND</div>}
      </div>
      {editing&&(
        <div className="overlay" onClick={()=>setEditing(null)}>
          <div className="modal fade-in" onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div className="orb" style={{fontSize:13,fontWeight:700,letterSpacing:2}}>EDIT PRODUCT</div>
              <button onClick={()=>setEditing(null)} style={{background:C.card2,border:`1px solid ${C.border}`,color:C.muted,cursor:"pointer",width:28,height:28,borderRadius:4}}>✕</button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input value={editing.name} onChange={e=>setEditing(v=>({...v,name:e.target.value}))}/>
              <select value={editing.cat} onChange={e=>setEditing(v=>({...v,cat:Number(e.target.value)}))}>
                {CATS.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
                <input type="number" value={editing.price} onChange={e=>setEditing(v=>({...v,price:e.target.value}))} placeholder="Price"/>
                <input type="number" value={editing.disc} onChange={e=>setEditing(v=>({...v,disc:e.target.value}))} placeholder="Disc %"/>
                <input type="number" value={editing.stock} onChange={e=>setEditing(v=>({...v,stock:e.target.value}))} placeholder="Stock"/>
              </div>
              <textarea rows={3} value={editing.desc} onChange={e=>setEditing(v=>({...v,desc:e.target.value}))} style={{resize:"none"}}/>
              <div style={{display:"flex",gap:16}}>
                <label style={{display:"flex",gap:7,alignItems:"center",cursor:"pointer"}}>
                  <input type="checkbox" checked={editing.hot} onChange={e=>setEditing(v=>({...v,hot:e.target.checked}))}/> HOT
                </label>
                <label style={{display:"flex",gap:7,alignItems:"center",cursor:"pointer"}}>
                  <input type="checkbox" checked={editing.isNew} onChange={e=>setEditing(v=>({...v,isNew:e.target.checked}))}/> NEW
                </label>
              </div>
              <div style={{display:"flex",gap:10,marginTop:4}}>
                <button className="btn-o" onClick={()=>setEditing(null)}>CANCEL</button>
                <button className="btn" style={{flex:1}} onClick={()=>saveEdit({...editing,price:parseFloat(editing.price),disc:Number(editing.disc),stock:Number(editing.stock)})}>SAVE CHANGES</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Admin Page ────────────────────────────────────────────────────────────────
function AdminPage({products,setProducts,onRefresh,user}){
  const [tab,setTab]=useState("upload");
  if(!user||user.role!=='admin') return(
    <div className="fade-in" style={{textAlign:"center",padding:"80px 0"}}>
      <div style={{fontSize:60,marginBottom:12}}>🔒</div>
      <div className="orb" style={{fontSize:18,letterSpacing:2,marginBottom:6}}>ADMIN ACCESS REQUIRED</div>
      <div style={{fontFamily:"Share Tech Mono",fontSize:10,color:C.muted}}>// LOGIN WITH AN ADMIN ACCOUNT</div>
    </div>
  );
  return(
    <div className="fade-in">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:22}}>
        <div>
          <div className="orb" style={{fontSize:17,fontWeight:800,letterSpacing:2}}>ADMIN <span style={{color:C.green}}>DASHBOARD</span></div>
          <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,marginTop:3}}>// CASITECH CONTROL PANEL · {user.email}</div>
        </div>
      </div>
      <div className="admin-stats">
        {[
          {label:"TOTAL",value:products.length,icon:"📦"},
          {label:"IN STOCK",value:products.filter(p=>p.stock>0).length,icon:"✅"},
          {label:"LOW STOCK",value:products.filter(p=>p.stock>0&&p.stock<=10).length,icon:"⚠️"},
          {label:"ON SALE",value:products.filter(p=>p.disc>0).length,icon:"🏷"},
        ].map(s=>(
          <div key={s.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"14px 16px"}}>
            <div style={{fontSize:20,marginBottom:5}}>{s.icon}</div>
            <div className="orb" style={{fontSize:20,fontWeight:800,color:C.green}}>{s.value}</div>
            <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,marginTop:3,letterSpacing:1}}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:22}}>
        {[["upload","📷 ADD PRODUCT"],["manage","⚙ MANAGE"]].map(([t,l])=>(
          <button key={t} onClick={()=>setTab(t)} style={{background:"none",border:"none",borderBottom:tab===t?`2px solid ${C.green}`:"2px solid transparent",color:tab===t?C.green:C.muted,padding:"9px 18px",cursor:"pointer",fontFamily:"Share Tech Mono",fontSize:10,letterSpacing:1,marginBottom:-1}}>
            {l}
          </button>
        ))}
      </div>
      {tab==="upload"&&<Uploader products={products} setProducts={setProducts} onRefresh={onRefresh}/>}
      {tab==="manage"&&<Manager products={products} setProducts={setProducts} onRefresh={onRefresh}/>}
    </div>
  );
}

// ─── App ───────────────────────────────────────────────────────────────────────
export default function ShopPage(){
  const [page,setPage]=useState("home");
  const [pageProps,setPageProps]=useState({});
  const [cart,setCart]=useState([]);
  const [wish,setWish]=useState([]);
  const [viewP,setViewP]=useState(null);
  const [checkout,setCheckout]=useState(false);
  const [orderDone,setOrderDone]=useState(null);
  const [toast,setToast]=useState(null);
  const [products,setProducts]=useState(INIT_PRODUCTS);
  const [authModal,setAuthModal]=useState(null); // null | 'login' | 'register'
  const [productsLoading,setProductsLoading]=useState(true);
  const [menuOpen,setMenuOpen]=useState(false);

  const {user,logout}=useAuthStore();

  const fetchProducts=async()=>{
    try{
      const {data}=await productsAPI.getAll({limit:100});
      setProducts(data.products.map(normalizeProduct));
    }catch{
      // Backend unreachable — keep whatever is in state (INIT_PRODUCTS fallback set below)
    }
  };

  // On mount: verify token + load products from DB
  useEffect(()=>{
    if(user) authAPI.me().catch(()=>logout());
    setProducts(INIT_PRODUCTS); // show demo data immediately while API loads
    fetchProducts().finally(()=>setProductsLoading(false));
  },[]);

  const notify=msg=>setToast(msg);
  const nav=(p,props={})=>{setPage(p);setPageProps(props);};

  const addCart=(p,qty=1)=>{
    setCart(c=>{
      const ex=c.find(i=>i.p.id===p.id);
      return ex?c.map(i=>i.p.id===p.id?{...i,qty:i.qty+qty}:i):[...c,{p,qty}];
    });
    notify(`${p.name} added to cart`);
  };
  const removeCart=id=>setCart(c=>c.filter(i=>i.p.id!==id));
  const qtyChange=(id,qty)=>qty<1?removeCart(id):setCart(c=>c.map(i=>i.p.id===id?{...i,qty}:i));
  const toggleWish=id=>{
    if(!user){setAuthModal('login');return;}
    const has=wish.includes(id);
    setWish(w=>has?w.filter(x=>x!==id):[...w,id]);
    notify(has?"Removed from wishlist":"Added to wishlist ♡");
  };
  const handleCheckout=()=>{
    if(!user){setAuthModal('login');return;}
    setCheckout(true);
  };
  const placeOrder=(orderData)=>{setCheckout(false);setCart([]);setOrderDone(orderData);};

  const visible=products.filter(p=>!p.hidden);
  const cartCount=cart.reduce((s,i)=>s+i.qty,0);

  return(
    <div style={{minHeight:"100vh",background:C.bg}}>
      <style>{css}</style>

      {/* ── Navbar ── */}
      <nav style={{position:"sticky",top:0,zIndex:100,background:`${C.bg2}f0`,backdropFilter:"blur(12px)",borderBottom:`1px solid ${C.border}`,padding:"0 16px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",alignItems:"center",height:60,gap:0}}>
          {/* Logo */}
          <div onClick={()=>{nav("home");setMenuOpen(false);}} style={{cursor:"pointer",display:"flex",alignItems:"center",marginRight:12,flexShrink:0}}>
            <span className="orb" style={{fontWeight:900,fontSize:17,color:C.green,letterSpacing:1,textShadow:`0 0 12px ${C.green}66`}}>CASI</span>
            <span className="orb" style={{fontWeight:900,fontSize:17,color:C.text,letterSpacing:1}}>TECH</span>
          </div>
          <div className="nav-sep" style={{width:1,height:22,background:C.border,marginRight:14}}/>
          {/* Nav links — desktop row / mobile dropdown */}
          <div className={`nav-links${menuOpen?" open":""}`}>
            {[["home","🏠","HOME"],["shop","🛍","SHOP"],["wishlist","♡","WISH"],["support","❓","HELP"]].map(([p,icon,l])=>(
              <button key={p} onClick={()=>{nav(p);setMenuOpen(false);}} className={page===p?"nav-active":""} style={{background:"none",border:"none",color:page===p?C.green:C.muted,cursor:"pointer",fontFamily:"Orbitron",fontWeight:600,fontSize:9,letterSpacing:1.5,padding:"4px 10px",borderBottom:page===p?`2px solid ${C.green}`:"2px solid transparent",transition:"all .15s",height:60,whiteSpace:"nowrap"}}>
                <span className="nav-icon">{icon}</span><span className="nav-lbl">{l}</span>
              </button>
            ))}
            {/* Auth — shown only inside mobile dropdown */}
            <div className="nav-auth-mobile">
              {user?(
                <>
                  {user.role==="admin"&&<button onClick={()=>{nav("admin");setMenuOpen(false);}} style={{background:"#ff990018",border:"1px solid #ff9900aa",borderRadius:5,padding:"9px 12px",cursor:"pointer",color:"#ff9900",fontFamily:"Orbitron",fontWeight:700,fontSize:9,letterSpacing:1.5,textAlign:"left"}}>⚙ ADMIN</button>}
                  <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:5,padding:"9px 12px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <span style={{fontFamily:"Share Tech Mono",fontSize:10,color:C.green}}>/ {user.name}</span>
                    <button onClick={()=>{logout();nav("home");setMenuOpen(false);}} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontFamily:"Orbitron",fontSize:8,letterSpacing:1}}>⏻ LOGOUT</button>
                  </div>
                </>
              ):(
                <button onClick={()=>{setAuthModal('login');setMenuOpen(false);}} style={{background:C.card,border:`1px solid ${C.green}66`,borderRadius:5,padding:"10px 12px",cursor:"pointer",color:C.green,fontFamily:"Orbitron",fontWeight:700,fontSize:9,letterSpacing:1.5}}>
                  LOGIN
                </button>
              )}
            </div>
          </div>
          <div style={{flex:1}}/>
          {/* Auth — desktop only */}
          <div className="auth-desktop">
            {user?(
              <>
                {user.role==="admin"&&(
                  <button onClick={()=>nav("admin")} style={{background:page==="admin"?`${C.green}22`:"#ff990018",border:`1px solid ${page==="admin"?C.green:"#ff9900aa"}`,borderRadius:5,padding:"6px 11px",cursor:"pointer",color:page==="admin"?C.green:"#ff9900",fontFamily:"Orbitron",fontWeight:700,fontSize:9,letterSpacing:1.5,whiteSpace:"nowrap"}}>
                    ⚙ ADMIN
                  </button>
                )}
                <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:5,padding:"6px 11px",display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.green,maxWidth:100,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>/ {user.name}</span>
                  <button onClick={()=>{logout();nav("home");}} style={{background:"none",border:"none",color:C.muted,cursor:"pointer",fontFamily:"Orbitron",fontSize:8,letterSpacing:1,padding:0}}>⏻</button>
                </div>
              </>
            ):(
              <button onClick={()=>setAuthModal('login')} style={{background:C.card,border:`1px solid ${C.green}66`,borderRadius:5,padding:"6px 13px",cursor:"pointer",color:C.green,fontFamily:"Orbitron",fontWeight:700,fontSize:9,letterSpacing:1.5,whiteSpace:"nowrap"}}>
                LOGIN
              </button>
            )}
          </div>
          {/* Cart */}
          <button onClick={()=>{nav("cart");setMenuOpen(false);}} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:5,padding:"6px 10px",cursor:"pointer",color:C.text,display:"flex",alignItems:"center",gap:6,fontFamily:"Orbitron",fontSize:9,letterSpacing:1,whiteSpace:"nowrap",marginLeft:6}}>
            🛒<span className="nav-lbl"> CART</span>
            {cartCount>0&&<span style={{background:C.green,color:"#000",borderRadius:3,padding:"1px 6px",fontSize:9,fontFamily:"Orbitron",fontWeight:700}}>{cartCount}</span>}
          </button>
          {/* Hamburger */}
          <button className="hamburger" onClick={()=>setMenuOpen(m=>!m)} style={{marginLeft:8}} aria-label="Menu">
            <span/><span/><span/>
          </button>
        </div>
        {menuOpen&&<div onClick={()=>setMenuOpen(false)} style={{position:"fixed",inset:0,top:60,zIndex:97}}/>}
      </nav>

      {/* ── Pages ── */}
      <main className="page-pad" style={{maxWidth:1200,margin:"0 auto",padding:"26px 20px 60px"}}>
        {productsLoading&&(page==="home"||page==="shop")&&(
          <div style={{textAlign:"center",padding:"60px 0",fontFamily:"Share Tech Mono",fontSize:11,color:C.muted}}>
            <div style={{width:40,height:40,border:`3px solid ${C.border}`,borderTopColor:C.green,borderRadius:"50%",animation:"spin 0.8s linear infinite",margin:"0 auto 16px"}}/>
            // LOADING PRODUCTS...
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        )}
        {(!productsLoading||page==="cart"||page==="wishlist"||page==="support"||page==="admin")&&(
          <>
            {page==="home"     && <HomePage    products={visible} onCart={addCart} onView={setViewP} wish={wish} onWish={toggleWish} onNav={nav}/>}
            {page==="shop"     && <ShopPageContent    products={visible} onCart={addCart} onView={setViewP} wish={wish} onWish={toggleWish} initFilters={pageProps}/>}
            {page==="cart"     && <CartPage    cart={cart} onRemove={removeCart} onQty={qtyChange} onCheckout={handleCheckout}/>}
            {page==="wishlist" && <WishlistPage wish={wish} products={visible} onCart={addCart} onView={setViewP} onWish={toggleWish}/>}
            {page==="support"  && <SupportPage/>}
            {page==="admin"    && <AdminPage   products={products} setProducts={setProducts} onRefresh={fetchProducts} user={user}/>}
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <footer style={{borderTop:`1px solid ${C.border}`,padding:"24px 20px",textAlign:"center"}}>
        <div className="orb" style={{fontWeight:900,fontSize:15,letterSpacing:3,marginBottom:5}}>
          <span style={{color:C.green}}>CASI</span><span style={{color:C.text}}>TECH</span>
        </div>
        <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,marginBottom:6}}>// ELECTRONICS MARKETPLACE © 2026</div>
        <div style={{fontFamily:"Share Tech Mono",fontSize:9,color:C.muted,marginBottom:10,lineHeight:1.9}}>
          <a href="mailto:foncasimir05@gmail.com" style={{color:C.muted,textDecoration:"none"}}>📧 foncasimir05@gmail.com</a>
          {"  ·  "}
          <a href="tel:+237681735778" style={{color:C.muted,textDecoration:"none"}}>📞 +237 681 735 778</a>
        </div>
        <div style={{display:"flex",gap:14,justifyContent:"center"}}>
          {["Privacy","Terms","Cookies"].map(l=><span key={l} style={{cursor:"pointer",color:C.muted,fontSize:10,fontFamily:"Share Tech Mono"}}>{l}</span>)}
        </div>
      </footer>

      {/* Floating WhatsApp button */}
      <a href="https://wa.me/237681735778" target="_blank" rel="noopener noreferrer"
        style={{position:"fixed",bottom:22,right:22,background:"#25D366",borderRadius:"50%",width:52,height:52,cursor:"pointer",fontSize:26,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 20px #25D36666",zIndex:50,textDecoration:"none",lineHeight:1}}>
        💬
      </a>

      {/* Modals */}
      {authModal && <AuthModal onClose={()=>setAuthModal(null)} initialTab={authModal}/>}
      {viewP     && <ProductModal  p={viewP} onClose={()=>setViewP(null)} onCart={addCart} wish={wish} onWish={toggleWish}/>}
      {checkout  && <CheckoutModal cart={cart} onClose={()=>setCheckout(false)} onDone={placeOrder}/>}
      {orderDone && <OrderSuccess  order={orderDone} onClose={()=>{setOrderDone(null);nav("home");}}/>}
      {toast     && <Toast msg={toast} onClose={()=>setToast(null)}/>}
    </div>
  );
}
