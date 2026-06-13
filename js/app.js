
function goView(v,btn){
  document.body.classList.remove('navopen');
  const mb=document.getElementById('menuBtn'); if(mb)mb.textContent='☰';
  document.querySelectorAll('section.view').forEach(s=>s.classList.toggle('on',s.id==='v-'+v));
  document.querySelectorAll('.navlink').forEach(b=>b.classList.toggle('on',b===btn));
  window.scrollTo({top:0,behavior:'smooth'});
}
let fs=1;
function fontStep(d){ fs=Math.min(1.35,Math.max(.85,fs+d*.07)); document.documentElement.style.setProperty('--fs',fs+'rem'); }
function openAll(){ document.querySelectorAll('.view.on details.lesson').forEach(d=>d.open=true); }
function closeAll(){ document.querySelectorAll('.view.on details.lesson').forEach(d=>d.open=false); }
/* progress checkmarks */
let done={};
try{ done=JSON.parse(localStorage.getItem('ref3acDone')||'{}'); }catch(e){}
function toggleDone(ev,key,el){
  ev.preventDefault(); ev.stopPropagation();
  done[key]=!done[key]; if(!done[key])delete done[key];
  try{ localStorage.setItem('ref3acDone',JSON.stringify(done)); }catch(e){}
  el.classList.toggle('ok',!!done[key]);
  el.innerHTML=done[key]?'✓ تمت مراجعته':'☐ للمراجعة';
}
document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.done-chk').forEach(el=>{
    const k=el.dataset.k;
    if(done[k]){ el.classList.add('ok'); el.innerHTML='✓ تمت مراجعته'; }
  });
});

/* ===== Professional site features ===== */
/* dark mode */
function toggleDark(){
  document.body.classList.toggle('dark');
  const on=document.body.classList.contains('dark');
  document.getElementById('btnDark').textContent=on?'☀️ وضع نهاري':'🌙 وضع ليلي';
  try{localStorage.setItem('ref3acDark',on?'1':'');}catch(e){}
}
try{ if(localStorage.getItem('ref3acDark')){ document.body.classList.add('dark');
  addEventListener('DOMContentLoaded',()=>{document.getElementById('btnDark').textContent='☀️ وضع نهاري';}); } }catch(e){}
/* back to top */
addEventListener('scroll',()=>document.body.classList.toggle('scrolled',scrollY>500));
/* search */
let sT=null;
function doSearch(q){
  clearTimeout(sT);
  sT=setTimeout(()=>{
    q=q.trim();
    const res=document.getElementById('sres');
    document.querySelectorAll('mark.sh').forEach(m=>{m.replaceWith(m.textContent);});
    if(q.length<2){ document.body.classList.remove('searching');
      document.querySelectorAll('details.lesson').forEach(d=>d.classList.remove('hit')); res.textContent=''; return; }
    document.body.classList.add('searching');
    let n=0;
    document.querySelectorAll('details.lesson').forEach(d=>{
      const hit=d.textContent.includes(q);
      d.classList.toggle('hit',hit);
      if(hit){ n++; d.open=true; highlight(d,q); }
    });
    res.textContent=n?('✔ '+n+' نتيجة'): '✘ لا نتائج — جرب كلمة أخرى';
  },250);
}
function highlight(root,q){
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes=[]; let nd;
  while(nd=walker.nextNode()){ if(nd.nodeValue.includes(q)&&nd.parentNode.tagName!=='MARK') nodes.push(nd); }
  nodes.slice(0,40).forEach(t=>{
    const i=t.nodeValue.indexOf(q); if(i<0)return;
    const after=t.splitText(i), rest=after.splitText(q.length);
    const m=document.createElement('mark'); m.className='sh'; m.textContent=q;
    after.replaceWith(m);
  });
}
/* PWA install */
let deferredPrompt=null;
addEventListener('beforeinstallprompt',e=>{ e.preventDefault(); deferredPrompt=e; });
function installApp(){
  if(deferredPrompt){ deferredPrompt.prompt(); deferredPrompt=null; }
  else alert('للتثبيت: افتح قائمة المتصفح (⋮) ثم اختر "إضافة إلى الشاشة الرئيسية" أو "تثبيت التطبيق".\nأو حمّل نسخة APK من الزر الأخضر.');
}
function apkClick(e){
  // graceful message if APK not yet uploaded
  fetch('apk/almarjaa-aljihawi.apk',{method:'HEAD'}).then(r=>{ if(!r.ok) throw 0; })
   .catch(()=>alert('نسخة APK ستتوفر قريبا — يمكنك الآن تثبيت التطبيق مباشرة عبر زر "📲 تثبيت التطبيق" (يعمل بدون متجر ودون إنترنت بعد التثبيت).'));
  return true;
}
/* service worker */
if('serviceWorker' in navigator){ addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{})); }

/* ===== طباعة احترافية انتقائية ===== */
function openPrintMenu(){
  document.body.classList.remove('navopen');
  const mb=document.getElementById('menuBtn'); if(mb)mb.textContent='☰';
  document.getElementById('printOv').style.display='flex';
}
function printScope(scope){
  document.getElementById('printOv').style.display='none';
  // نظّف أي تعليم سابق
  document.querySelectorAll('section.view.printme').forEach(s=>s.classList.remove('printme'));
  document.body.classList.remove('printing-all');
  if(scope==='all'){
    document.body.classList.add('printing-all');
  } else if(scope==='cur'){
    const cur=document.querySelector('section.view.on'); if(cur)cur.classList.add('printme');
  } else {
    const sec=document.getElementById('v-'+scope); if(sec)sec.classList.add('printme');
  }
  // افتح كل الدروس داخل النطاق المطبوع
  const open=document.querySelectorAll(document.body.classList.contains('printing-all')?'details.lesson':'section.view.printme details.lesson');
  open.forEach(d=>d.open=true);
  // اطبع ثم نظّف
  setTimeout(()=>{
    window.print();
    setTimeout(()=>{
      document.querySelectorAll('section.view.printme').forEach(s=>s.classList.remove('printme'));
      document.body.classList.remove('printing-all');
    },400);
  },250);
}
