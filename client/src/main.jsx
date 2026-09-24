import React, {useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ShoppingBag, ArrowUpRight, ArrowRight, Search, X, Plus, Minus, UserRound, Package, LogOut, ShieldCheck, Truck, Leaf, Check, SlidersHorizontal} from 'lucide-react';
import './styles.css';

// Map the original catalog paths to bundled, local photographs.
// These also work for existing carts and historical orders.
// Copy the included client/public/products/photos folder along with this file.
const PRODUCT_PHOTOS = {
  "/products/studio-headphones.svg": "/products/photos/studio-headphones.jpg",
  "/products/pocket-speaker.svg": "/products/photos/pocket-speaker.jpg",
  "/products/wireless-keyboard.svg": "/products/photos/wireless-keyboard.jpg",
  "/products/everyday-mouse.svg": "/products/photos/everyday-mouse.jpg",
  "/products/desk-charger.svg": "/products/photos/desk-charger.jpg",
  "/products/focus-earbuds.svg": "/products/photos/focus-earbuds.jpg",
  "/products/portable-power-bank.svg": "/products/photos/portable-power-bank.jpg",
  "/products/smart-desk-clock.svg": "/products/photos/smart-desk-clock.jpg",
  "/products/usb-c-hub.svg": "/products/photos/usb-c-hub.jpg",
  "/products/arc-table-lamp.svg": "/products/photos/arc-table-lamp.jpg",
  "/products/stoneware-mug.svg": "/products/photos/stoneware-mug.jpg",
  "/products/cotton-cushion.svg": "/products/photos/cotton-cushion.jpg",
  "/products/minimal-wall-clock.svg": "/products/photos/minimal-wall-clock.jpg",
  "/products/ceramic-planter.svg": "/products/photos/ceramic-planter.jpg",
  "/products/glass-carafe.svg": "/products/photos/glass-carafe.jpg",
  "/products/linen-throw.svg": "/products/photos/linen-throw.jpg",
  "/products/oak-desk-tray.svg": "/products/photos/oak-desk-tray.jpg",
  "/products/scented-candle.svg": "/products/photos/scented-candle.jpg",
  "/products/canvas-daypack.svg": "/products/photos/canvas-daypack.jpg",
  "/products/classic-tote.svg": "/products/photos/classic-tote.jpg",
  "/products/everyday-watch.svg": "/products/photos/everyday-watch.jpg",
  "/products/slim-wallet.svg": "/products/photos/slim-wallet.jpg",
  "/products/round-sunglasses.svg": "/products/photos/round-sunglasses.jpg",
  "/products/travel-pouch.svg": "/products/photos/travel-pouch.jpg",
  "/products/laptop-sleeve.svg": "/products/photos/laptop-sleeve.jpg",
  "/products/weekend-duffel.svg": "/products/photos/weekend-duffel.jpg",
  "/products/key-organizer.svg": "/products/photos/key-organizer.jpg",
  "/products/insulated-bottle.svg": "/products/photos/insulated-bottle.jpg",
  "/products/daily-planner.svg": "/products/photos/daily-planner.jpg",
  "/products/yoga-mat.svg": "/products/photos/yoga-mat.jpg",
  "/products/resistance-bands.svg": "/products/photos/resistance-bands.jpg",
  "/products/sketch-notebook.svg": "/products/photos/sketch-notebook.jpg",
  "/products/stainless-lunchbox.svg": "/products/photos/stainless-lunchbox.jpg",
  "/products/travel-tumbler.svg": "/products/photos/travel-tumbler.jpg",
  "/products/classic-cap.svg": "/products/photos/classic-cap.jpg",
  "/products/desk-journal.svg": "/products/photos/desk-journal.jpg"
};
const PHOTO_SOURCES = {
  "/products/studio-headphones.svg": "https://unsplash.com/photos/gold-beats-wireless-headphones-6zqd6092B1c",
  "/products/pocket-speaker.svg": "https://unsplash.com/photos/a-portable-speaker-and-smartphone-on-a-wooden-surface-ixmugrIhy9A",
  "/products/wireless-keyboard.svg": "https://unsplash.com/photos/white-computer-keyboard-on-white-table-LsiVzQJ-xA4",
  "/products/everyday-mouse.svg": "https://unsplash.com/photos/black-logitech-cordless-computer-mouse-QWBZLsko6QY",
  "/products/desk-charger.svg": "https://unsplash.com/photos/white-usb-charger-and-cable-on-wooden-surface-jBm1x5hB4cQ",
  "/products/focus-earbuds.svg": "https://unsplash.com/photos/wireless-earbuds-with-charging-case-on-wooden-surface-NEr5Bp06I3k",
  "/products/portable-power-bank.svg": "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5",
  "/products/smart-desk-clock.svg": "https://unsplash.com/photos/square-black-analog-desk-clock-1205-oclock-5uTqKwFKFgI",
  "/products/usb-c-hub.svg": "https://unsplash.com/photos/black-usb-hub-with-multiple-ports-and-switches-b1UEh_5dKLY",
  "/products/arc-table-lamp.svg": "https://unsplash.com/photos/white-table-lamp-THVR0Ie-qgk",
  "/products/stoneware-mug.svg": "https://unsplash.com/photos/white-ceramic-mug-m6O6oXb-gBw",
  "/products/cotton-cushion.svg": "https://unsplash.com/photos/closeup-photo-of-gray-throw-pillow-on-tufted-sofa-chair-RnEAsp6XPCc",
  "/products/minimal-wall-clock.svg": "https://unsplash.com/photos/white-round-analog-wall-clock-at-10-00-Ki8zTDuIOqg",
  "/products/ceramic-planter.svg": "https://unsplash.com/photos/a-potted-plant-sitting-on-top-of-a-window-sill-8-wILpeFkPE",
  "/products/glass-carafe.svg": "https://unsplash.com/photos/glass-carafe-filled-with-roasted-coffee-beans-R-6aNqfmtv0",
  "/products/linen-throw.svg": "https://unsplash.com/photos/white-and-blue-knit-textile-53BjYSxca5g",
  "/products/oak-desk-tray.svg": "https://unsplash.com/photos/a-wooden-tray-with-a-plant-in-it-on-a-table-8vJtc6DuCRI",
  "/products/scented-candle.svg": "https://unsplash.com/photos/scented-candle-red-flowers-and-green-leaves-on-white-UywxN1ByYzo",
  "/products/canvas-daypack.svg": "https://unsplash.com/photos/black-canvas-back-pack-XJrBxQClrlM",
  "/products/classic-tote.svg": "https://unsplash.com/photos/a-canvas-tote-bag-hangs-on-a-pole-WR4Ev2iSMt4",
  "/products/everyday-watch.svg": "https://unsplash.com/photos/hand-holding-a-silver-wristwatch-on-a-white-surface-qkvq5vjf2PY",
  "/products/slim-wallet.svg": "https://unsplash.com/photos/photo-of-gray-leather-wallet-Dx3D4hdZU8I",
  "/products/round-sunglasses.svg": "https://unsplash.com/photos/sunglasses-on-white-surface--ru0KD7SwBA",
  "/products/travel-pouch.svg": "https://unsplash.com/photos/flawless-pouch-with-cosmetics-cjadYPpTpeE",
  "/products/laptop-sleeve.svg": "https://unsplash.com/photos/a-man-holding-a-laptop-in-his-hand-XhXzfLzsdrI",
  "/products/weekend-duffel.svg": "https://unsplash.com/photos/black-duffel-bag-on-white-surface-XNNsbcVy7V4",
  "/products/key-organizer.svg": "https://unsplash.com/photos/a-person-holding-a-bunch-of-keys-in-their-hand-TP_HtbuvhpQ",
  "/products/insulated-bottle.svg": "https://unsplash.com/photos/an-orange-water-bottle-and-an-orange-water-bottle-on-a-wooden-table-WPhWUbnZtpo",
  "/products/daily-planner.svg": "https://unsplash.com/photos/planner-with-calendar-and-grid-notebooks-qYZDTv0iUDY",
  "/products/yoga-mat.svg": "https://unsplash.com/photos/a-yoga-mat-with-two-blocks-on-top-of-it-b8Q5fHBsyik",
  "/products/resistance-bands.svg": "https://unsplash.com/photos/two-black-holders-with-pink-resistance-bands-3QwJ98CoXCE",
  "/products/sketch-notebook.svg": "https://unsplash.com/photos/a-notebook-with-a-planner-and-pen-on-top-of-it-3G9rmIuj3Hc",
  "/products/stainless-lunchbox.svg": "https://unsplash.com/photos/rWDHyEC7wjY",
  "/products/travel-tumbler.svg": "https://unsplash.com/photos/white-and-black-kinto-travel-tumbler-beside-red-covered-book-HbyCeRd8Q08",
  "/products/classic-cap.svg": "https://unsplash.com/photos/a-yellow-baseball-cap-on-a-white-background-8XZBP38QJFM",
  "/products/desk-journal.svg": "https://unsplash.com/photos/a-notebook-with-a-planner-and-pen-on-top-of-it-3G9rmIuj3Hc"
};
const PHOTO_UNAVAILABLE = 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 560"><rect width="600" height="560" fill="#eeece5"/><text x="300" y="280" text-anchor="middle" fill="#64715f" font-family="Arial,sans-serif" font-size="22">Photo unavailable</text></svg>'
);
function ProductPhoto({src, alt = '', ...props}) {
  const resolved = PRODUCT_PHOTOS[src] || src || PHOTO_UNAVAILABLE;
  const [failed, setFailed] = useState(false);
  useEffect(() => { setFailed(false); }, [resolved]);
  return <img {...props} src={failed ? PHOTO_UNAVAILABLE : resolved} alt={alt}
    decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} />;
}

const money=n=>new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n/100);
async function api(path,options={}) {
 const res=await fetch('/api'+path,{credentials:'same-origin',...options,headers:{'Content-Type':'application/json','X-Requested-With':'Shoplane',...options.headers}});
 const data=await res.json().catch(()=>({message:'Server is unavailable. Please try again.'}));
 if(!res.ok)throw new Error(data.message||'Something went wrong.');return data;
}
const categories=['All products','Electronics','Home & Living','Accessories','Lifestyle'];
function App(){
 const [products,setProducts]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState('');
 const [search,setSearch]=useState(''),[category,setCategory]=useState('All products'),[sort,setSort]=useState('featured');
 const [user,setUser]=useState(null),[view,setView]=useState('shop'),[authMode,setAuthMode]=useState(null),[drawer,setDrawer]=useState(false),[detail,setDetail]=useState(null);
 const [cart,setCart]=useState(()=>{try{const saved=JSON.parse(localStorage.getItem('shoplane-cart')||'[]');return Array.isArray(saved)?saved.filter(x=>typeof x._id==='string'&&Number.isInteger(x.quantity)&&x.quantity>0&&x.quantity<=10&&Number.isFinite(x.price)):[];}catch{return [];}});
 const [toast,setToast]=useState(''),[refresh,setRefresh]=useState(0);
 useEffect(()=>{api('/auth/me').then(setUser).catch(()=>{});},[]);
 useEffect(()=>{try{localStorage.setItem('shoplane-cart',JSON.stringify(cart));}catch{}},[cart]);
 useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),3200);return()=>clearTimeout(t);},[toast]);
 useEffect(()=>{const controller=new AbortController();setLoading(true);setError('');const t=setTimeout(()=>{
  const query=new URLSearchParams({sort,...(search?{search}:{}),...(category!=='All products'?{category}:{})});
  api('/products?'+query,{signal:controller.signal}).then(setProducts).catch(e=>{if(e.name!=='AbortError')setError(e.message);}).finally(()=>{if(!controller.signal.aborted)setLoading(false);});
 },180);return()=>{clearTimeout(t);controller.abort();};},[search,category,sort,refresh]);
 function add(p){setCart(previous=>{const found=previous.find(i=>i._id===p._id);if((found?.quantity||0)>=Math.min(10,p.stock)){setToast('Maximum available quantity reached.');return previous;}return found?previous.map(i=>i._id===p._id?{...i,quantity:i.quantity+1}:i):[...previous,{...p,quantity:1}];});setToast('Added to your bag');}
 function change(id,delta){setCart(c=>c.map(i=>i._id===id?{...i,quantity:Math.min(10,Math.max(0,i.quantity+delta))}:i).filter(i=>i.quantity>0));}
 const count=cart.reduce((s,i)=>s+i.quantity,0),subtotal=cart.reduce((s,i)=>s+i.price*i.quantity,0),shipping=subtotal>=199900?0:9900;
 function navigate(next){setView(next);setDrawer(false);window.scrollTo({top:0,behavior:'smooth'});}
 function checkout(){if(!user){setAuthMode('login');setToast('Sign in to place your order');return;}navigate('checkout');}
 async function logout(){try{await api('/auth/logout',{method:'POST'});setUser(null);navigate('shop');setToast('Signed out');}catch(e){setToast(e.message);}}
 return <>
  <div className="announcement">A little upgrade for your everyday. <span>Free shipping on orders ₹1,999+</span><ArrowUpRight size={13}/></div>
  <header><div className="nav wrap"><button className="brand" onClick={()=>navigate('shop')} aria-label="Shoplane home"><span className="brand-icon"><ShoppingBag size={21}/></span>shoplane<span className="brand-dot">.</span></button><nav aria-label="Main navigation"><button className={view==='shop'?'active':''} onClick={()=>navigate('shop')}>Shop all</button><button onClick={()=>{navigate('shop');setCategory('Home & Living');}}>Home & living</button><button onClick={()=>{navigate('shop');setCategory('Lifestyle');}}>Everyday essentials</button></nav><div className="nav-tools">{user?<><button title="My orders" aria-label="My orders" onClick={()=>navigate('orders')}><Package size={21}/></button>{user.role==='admin'&&<button onClick={()=>navigate('admin')}>Admin</button>}<button title="Sign out" aria-label="Sign out" onClick={logout}><LogOut size={20}/></button></>:<button className="account" onClick={()=>setAuthMode('login')}><UserRound size={20}/><span>Sign in</span></button>}<button className="bag-button" onClick={()=>setDrawer(true)} aria-label={`Shopping bag, ${count} items`}><ShoppingBag size={21}/><span>{count}</span></button></div></div></header>
  <main className="wrap">
  {view==='shop'&&<>
   <section className="hero"><div className="hero-copy"><p className="eyebrow"><span/> THE EVERYDAY EDIT · 2026</p><h1>Good things.<br/>For <em>every day.</em></h1><p>Thoughtfully chosen essentials for your space,<br className="desktop"/> your routine, and everything in between.</p><a className="button dark" href="#collection">Explore the collection <ArrowUpRight size={18}/></a><div className="hero-note"><span className="mini-icons">✦</span> Less clutter. More of what you love.</div></div><div className="hero-art"><div className="circle"/><ProductPhoto src="/products/studio-headphones.svg" className="hero-headphones" alt="Studio headphones"/><ProductPhoto src="/products/insulated-bottle.svg" className="hero-bottle" alt="Everyday insulated bottle"/><div className="floating-tag"><span>CURATED FOR YOU</span><strong>Simple. Useful. Beautiful.</strong></div><div className="edition">THE<br/>GOOD<br/>STUFF. <ArrowUpRight size={25}/></div></div></section>
   <div className="perks"><span><Truck size={19}/><strong>Delivered with care</strong> Across India</span><span><Leaf size={19}/><strong>Everyday essentials</strong> Considered design</span><span><ShieldCheck size={19}/><strong>Simple checkout</strong> Cash on delivery</span></div>
   <section id="collection" className="collection"><div className="section-top"><div><p className="eyebrow">FIND YOUR NEXT FAVORITE</p><h2>The everyday collection<span>.</span></h2></div><span className="muted">Small upgrades. Big difference.</span></div><div className="catalog-tools"><div className="tabs">{categories.map(c=><button className={category===c?'selected':''} onClick={()=>setCategory(c)} key={c}>{c}</button>)}</div><div className="search"><Search size={18}/><input aria-label="Search products" placeholder="Search the collection" value={search} onChange={e=>setSearch(e.target.value)}/>{search&&<button onClick={()=>setSearch('')} aria-label="Clear search"><X size={15}/></button>}</div></div><div className="results"><span>{loading?'Finding your essentials…':`${products.length} products`}</span><label><SlidersHorizontal size={15}/><select aria-label="Sort products" value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="name">Name: A–Z</option></select></label></div>
   {error?<div className="empty"><h3>Couldn't load the collection</h3><p>{error}</p><button className="button dark" onClick={()=>setRefresh(n=>n+1)}>Try again</button></div>:loading?<div className="grid">{Array.from({length:8},(_,i)=><div key={i} className="skeleton"/>)}</div>:products.length===0?<div className="empty"><Search size={32}/><h3>No products found</h3><p>Try another search or category.</p><button className="button" onClick={()=>{setSearch('');setCategory('All products');}}>Clear filters</button></div>:<div className="grid">{products.map((p,i)=><article className="product" key={p._id}><button className="product-image" onClick={()=>setDetail(p)} aria-label={`View ${p.name}`}><ProductPhoto src={p.image} alt={p.name} loading="lazy"/>{p.stock===0?<span className="tag">Sold out</span>:i<2&&sort==='featured'?<span className="tag">THE GOOD STUFF</span>:null}<span className="quick-view"><ArrowUpRight size={18}/></span></button><div className="product-info"><div><p className="product-category">{p.category}</p><button className="product-title" onClick={()=>setDetail(p)}>{p.name}</button><strong>{money(p.price)}</strong></div><button className="add" disabled={!p.stock} onClick={()=>add(p)} aria-label={`Add ${p.name} to bag`}><Plus size={20}/></button></div></article>)}</div>}
   </section><section className="closing"><p className="eyebrow">A MORE CONSIDERED EVERYDAY</p><h2>Buy less random.<br/>Find more <em>you.</em></h2><p>Discover useful little things that make ordinary days feel better.</p><a href="#collection">Back to the collection <ArrowRight size={17}/></a></section>
  </>}
  {view==='checkout'&&<Checkout cart={cart} subtotal={subtotal} shipping={shipping} user={user} onBack={()=>setDrawer(true)} onDone={()=>{setCart([]);setRefresh(n=>n+1);navigate('orders');setToast('Your order has been placed');}}/>}
  {view==='orders'&&<Orders/>}
  {view==='admin'&&user?.role==='admin'&&<Admin onChange={()=>setRefresh(n=>n+1)}/>}
  </main>
  <footer className="wrap"><div><span className="brand">shoplane.</span><p>Everyday, upgraded.</p></div><p>Built with React, Express & MongoDB.<br/><small>Internship demo · Illustrative products · No online payments</small></p><span>© 2026 Shoplane</span></footer>
  {toast&&<div className="toast" role="status"><Check size={18}/>{toast}</div>}
  {authMode&&<Modal onClose={()=>setAuthMode(null)} title={authMode==='login'?'Welcome back.':'Make yourself at home.'}><Auth mode={authMode} setMode={setAuthMode} onDone={u=>{setUser(u);setAuthMode(null);setToast(`Welcome, ${u.name}`);}}/></Modal>}
  {detail&&<Modal title={detail.name} onClose={()=>setDetail(null)}><ProductPhoto className="detail-image" src={detail.image} alt={detail.name}/><p className="eyebrow">{detail.category}</p><p>{detail.description}</p>{PHOTO_SOURCES[detail.image]&&<p className="muted">Representative demo photo · <a href={PHOTO_SOURCES[detail.image]} target="_blank" rel="noreferrer">Photo credit on Unsplash ↗</a></p>}<h3>{money(detail.price)}</h3><p className="muted">{detail.stock} available · Cash on delivery</p><button className="button dark full" disabled={!detail.stock} onClick={()=>{add(detail);setDetail(null);}}>Add to bag <Plus size={18}/></button></Modal>}
  {drawer&&<div className="overlay" onClick={()=>setDrawer(false)}><section className="drawer" role="dialog" aria-modal="true" aria-labelledby="bag-title" onClick={e=>e.stopPropagation()}><div className="modal-head"><h2 id="bag-title">Your bag <span className="muted">({count})</span></h2><button aria-label="Close bag" onClick={()=>setDrawer(false)}><X/></button></div>{!cart.length?<div className="empty"><ShoppingBag size={40}/><h3>A little room for something good.</h3><p>Your bag is empty.</p><button className="button dark" onClick={()=>setDrawer(false)}>Explore the collection</button></div>:<><div className="cart-items">{cart.map(i=><div className="cart-item" key={i._id}><ProductPhoto src={i.image} alt={i.name}/><div><strong>{i.name}</strong><p>{money(i.price)}</p><div className="quantity"><button aria-label={`Decrease ${i.name}`} onClick={()=>change(i._id,-1)}><Minus size={14}/></button><span>{i.quantity}</span><button aria-label={`Increase ${i.name}`} disabled={i.quantity>=10} onClick={()=>change(i._id,1)}><Plus size={14}/></button></div></div><button className="remove" aria-label={`Remove ${i.name}`} onClick={()=>setCart(c=>c.filter(x=>x._id!==i._id))}><X size={17}/></button></div>)}</div><div className="cart-total"><p><span>Subtotal</span><strong>{money(subtotal)}</strong></p><p><span>Shipping</span><span>{shipping?money(shipping):'On us'}</span></p><p className="grand"><span>Total estimate</span><strong>{money(subtotal+shipping)}</strong></p><small>Final prices and stock are checked at checkout.</small><button className="button dark full" onClick={checkout}>Continue to checkout <ArrowRight size={18}/></button></div></>}</section></div>}
 </>;
}
function Modal({title,onClose,children}){
 useEffect(()=>{const h=e=>{if(e.key==='Escape')onClose();};document.addEventListener('keydown',h);return()=>document.removeEventListener('keydown',h);},[onClose]);
 return <div className="overlay" onClick={onClose}><section className="modal" role="dialog" aria-modal="true" aria-label={title} onClick={e=>e.stopPropagation()}><div className="modal-head"><h2>{title}</h2><button onClick={onClose} aria-label="Close dialog"><X/></button></div>{children}</section></div>;
}
function Auth({mode,setMode,onDone}){
 const [error,setError]=useState(''),[busy,setBusy]=useState(false);
 async function submit(e){e.preventDefault();setError('');setBusy(true);try{const data=Object.fromEntries(new FormData(e.currentTarget));onDone(await api('/auth/'+(mode==='login'?'login':'register'),{method:'POST',body:JSON.stringify(data)}));}catch(e){setError(e.message);}finally{setBusy(false);}}
 return <><p className="muted">Your everyday favorites, all in one place.</p><form onSubmit={submit} className="form">{mode==='register'&&<label>Full name<input name="name" autoComplete="name" minLength={2} maxLength={70} required/></label>}<label>Email address<input name="email" type="email" autoComplete="email" required maxLength={254}/></label><label>Password<input name="password" type="password" autoComplete={mode==='login'?'current-password':'new-password'} minLength={8} maxLength={72} required/></label>{error&&<p className="error" role="alert">{error}</p>}<button className="button dark full" disabled={busy}>{busy?'Please wait…':mode==='login'?'Sign in':'Create account'}<ArrowRight size={18}/></button></form><p className="switch-auth">{mode==='login'?'New around here?':'Already have an account?'} <button onClick={()=>{setError('');setMode(mode==='login'?'register':'login');}}>{mode==='login'?'Create account':'Sign in'}</button></p></>;
}
function Checkout({cart,subtotal,shipping,user,onBack,onDone}){
 const [error,setError]=useState(''),[busy,setBusy]=useState(false),[requestId,setRequestId]=useState(()=>crypto.randomUUID());
 const cartKey=cart.map(i=>`${i._id}:${i.quantity}`).join(',');
 useEffect(()=>setRequestId(crypto.randomUUID()),[cartKey]);
 async function submit(e){e.preventDefault();if(busy)return;setBusy(true);setError('');const address=Object.fromEntries(new FormData(e.currentTarget));try{await api('/orders',{method:'POST',body:JSON.stringify({requestId,address,items:cart.map(i=>({product:i._id,quantity:i.quantity}))})});onDone();}catch(e){setError(e.message);}finally{setBusy(false);}}
 if(!cart.length)return <div className="empty"><h2>Your bag is empty.</h2><p>Add a product before checkout.</p></div>;
 return <section className="page"><p className="eyebrow">ONE LAST STEP</p><h1>Make it yours.</h1><div className="checkout-layout"><form className="panel form" onSubmit={submit}><h2>Delivery details</h2><label>Full name<input name="name" autoComplete="name" defaultValue={user?.name} minLength={2} maxLength={70} required/></label><label>Mobile number<input name="phone" type="tel" autoComplete="tel-national" pattern="[6-9][0-9]{9}" placeholder="10-digit Indian mobile number" required/></label><label>Street address<input name="line" autoComplete="street-address" minLength={5} maxLength={200} required/></label><div className="two-col"><label>City<input name="city" autoComplete="address-level2" minLength={2} maxLength={70} required/></label><label>PIN code<input name="pincode" autoComplete="postal-code" inputMode="numeric" pattern="[1-9][0-9]{5}" required/></label></div><div className="payment"><ShieldCheck size={22}/><div><strong>Cash on delivery</strong><p>Demo order only. No card details or real payment.</p></div></div>{error&&<p className="error" role="alert">{error}</p>}<button className="button dark full" disabled={busy}>{busy?'Placing your order…':`Place order · ${money(subtotal+shipping)}`}<ArrowRight size={18}/></button></form><aside className="panel summary"><h2>Order summary</h2>{cart.map(i=><div className="summary-item" key={i._id}><ProductPhoto src={i.image} alt=""/><div><strong>{i.name}</strong><p>Qty {i.quantity}</p></div><span>{money(i.price*i.quantity)}</span></div>)}<div className="cart-total"><p><span>Subtotal</span><strong>{money(subtotal)}</strong></p><p><span>Shipping</span><strong>{shipping?money(shipping):'Free'}</strong></p><p className="grand"><span>Total estimate</span><strong>{money(subtotal+shipping)}</strong></p><small>Current catalog prices apply when the order is placed.</small></div><button className="text-button" onClick={onBack}>Edit your bag</button></aside></div></section>;
}
function Orders(){
 const [orders,setOrders]=useState(null),[error,setError]=useState('');useEffect(()=>{api('/orders').then(setOrders).catch(e=>setError(e.message));},[]);
 return <section className="page"><p className="eyebrow">YOUR SHOPLANE</p><h1>My orders.</h1>{error&&<p className="error">{error}</p>}{!orders&&!error?<p>Loading orders…</p>:orders?.length?orders.map(o=><OrderCard order={o} key={o._id}/>):!error&&<div className="empty"><Package size={36}/><h2>No orders just yet.</h2><p>Your next everyday favorite is waiting in the collection.</p></div>}</section>;
}
function OrderCard({order:o,children}){return <article className="order panel"><div className="order-heading"><div><strong>Order #{o._id.slice(-8).toUpperCase()}</strong><p>{new Date(o.createdAt).toLocaleDateString('en-IN')} · {o.payment}</p></div><span className="status">{o.status}</span></div>{o.items.map(i=><div className="summary-item" key={i._id}><ProductPhoto src={i.image} alt=""/><div><strong>{i.name}</strong><p>Qty {i.quantity}</p></div><span>{money(i.price*i.quantity)}</span></div>)}<div className="order-bottom"><span>{o.address.name} · {o.address.city} {o.address.pincode}</span><strong>Total {money(o.total)}</strong></div>{children}</article>;}
const blank={sku:'',name:'',description:'',category:'Electronics',price:'',stock:'',image:'/products/studio-headphones.svg',active:true};
function Admin({onChange}){
 const [tab,setTab]=useState('products'),[products,setProducts]=useState([]),[orders,setOrders]=useState([]),[error,setError]=useState(''),[editing,setEditing]=useState(null),[busy,setBusy]=useState(false),[loading,setLoading]=useState(true);
 async function load(){setError('');setLoading(true);try{const [p,o]=await Promise.all([api('/admin/products'),api('/admin/orders')]);setProducts(p);setOrders(o);}catch(e){setError(e.message);}finally{setLoading(false);}}
 useEffect(()=>{load();},[]);
 async function save(e){e.preventDefault();setBusy(true);setError('');try{const {_id,price,...rest}=editing;await api('/admin/products'+(_id?'/'+_id:''),{method:_id?'PUT':'POST',body:JSON.stringify({...rest,price:Math.round(Number(price)*100),stock:Number(rest.stock)})});setEditing(null);await load();onChange();}catch(e){setError(e.message);}finally{setBusy(false);}}
 async function archive(p){if(!confirm(`Archive ${p.name}? Existing orders will be kept.`))return;try{await api('/admin/products/'+p._id,{method:'DELETE'});await load();onChange();}catch(e){setError(e.message);}}
 async function status(o){try{await api('/admin/orders/'+o._id,{method:'PATCH',body:JSON.stringify({status:{Placed:'Processing',Processing:'Shipped',Shipped:'Delivered'}[o.status]})});await load();}catch(e){setError(e.message);}}
 return <section className="page"><p className="eyebrow">STORE MANAGEMENT</p><h1>The control room.</h1><div className="stats"><div className="panel"><span>Products</span><strong>{products.filter(p=>p.active).length}</strong></div><div className="panel"><span>Recent orders (up to 200)</span><strong>{orders.length}</strong></div><div className="panel"><span>Recent order value · not collected revenue</span><strong>{money(orders.reduce((s,o)=>s+o.total,0))}</strong></div></div><div className="admin-nav"><div className="tabs"><button className={tab==='products'?'selected':''} onClick={()=>setTab('products')}>Products</button><button className={tab==='orders'?'selected':''} onClick={()=>setTab('orders')}>Orders</button></div>{tab==='products'&&<button className="button dark" onClick={()=>{setError('');setEditing({...blank});}}>New product <Plus size={17}/></button>}</div>{error&&!editing&&<p className="error" role="alert">{error}</p>}{loading?<p>Loading store data…</p>:tab==='products'?<div className="table-wrap"><table><thead><tr><th>Product</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th></tr></thead><tbody>{products.map(p=><tr key={p._id}><td><div className="table-product"><ProductPhoto src={p.image} alt=""/><div><strong>{p.name}</strong><small>{p.sku} · {p.category}</small></div></div></td><td>{money(p.price)}</td><td>{p.stock}</td><td>{p.active?'Active':'Archived'}</td><td><button className="text-button" onClick={()=>{setError('');setEditing({...p,price:p.price/100});}}>Edit</button>{p.active&&<button className="text-button danger" onClick={()=>archive(p)}>Archive</button>}</td></tr>)}</tbody></table></div>:orders.length?orders.map(o=><OrderCard key={o._id} order={o}><p>{o.user?.email} · {o.address.phone}<br/>{o.address.line}</p>{o.status!=='Delivered'&&<button className="button" onClick={()=>status(o)}>Mark {{Placed:'Processing',Processing:'Shipped',Shipped:'Delivered'}[o.status]} <ArrowRight size={16}/></button>}</OrderCard>):<div className="empty">No orders yet.</div>}
 {editing&&<Modal title={editing._id?'Edit product':'Add a product'} onClose={()=>{setEditing(null);setError('');}}><form className="form" onSubmit={save}>{['sku','name','description','price','stock','image'].map(k=><label key={k}>{({sku:'SKU',price:'Price (₹)',stock:'Stock quantity',image:'Local image path (/products/file.jpg, .png, .webp or .svg)'})[k]||k}<input name={k} value={editing[k]} required type={['price','stock'].includes(k)?'number':'text'} min={k==='price'?1:0} step={k==='price'?'0.01':'1'} onChange={e=>setEditing(v=>({...v,[k]:e.target.value}))}/></label>)}<label>Category<select value={editing.category} onChange={e=>setEditing(v=>({...v,category:e.target.value}))}>{categories.slice(1).map(c=><option key={c}>{c}</option>)}</select></label><label className="checkbox"><input type="checkbox" checked={editing.active} onChange={e=>setEditing(v=>({...v,active:e.target.checked}))}/>Visible in store</label>{error&&<p className="error" role="alert">{error}</p>}<button className="button dark full" disabled={busy}>{busy?'Saving…':'Save product'}</button></form></Modal>}
 </section>;
}
createRoot(document.getElementById('root')).render(<App/>);
