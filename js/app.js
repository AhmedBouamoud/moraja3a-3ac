
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
/* تمت إزالة الوضع الليلي نهائيا لضمان خلفية فاتحة مناسبة للتلاميذ دائما */
try{ document.body.classList.remove('dark'); localStorage.removeItem('ref3acDark'); }catch(e){}
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

/* ===== طباعة احترافية عبر حاوية مخصصة ===== */
function openPrintMenu(){
  document.body.classList.remove('navopen');
  const mb=document.getElementById('menuBtn'); if(mb)mb.textContent='\u2630';
  document.getElementById('printOv').style.display='flex';
}
const PHEAD='<div class="print-head"><b>\ud83d\udcd6 \u0627\u0644\u0645\u0631\u062c\u0639 \u0627\u0644\u0634\u0627\u0645\u0644 \u2014 \u0627\u0644\u0627\u0645\u062a\u062d\u0627\u0646 \u0627\u0644\u062c\u0647\u0648\u064a \u0627\u0644\u0645\u0648\u062d\u062f (\u0627\u0644\u0627\u062c\u062a\u0645\u0627\u0639\u064a\u0627\u062a 3AC)</b><br><span>\u0625\u0639\u062f\u0627\u062f: \u0630. \u0623\u062d\u0645\u062f \u0628\u0648\u0639\u0645\u0648\u062f \u2014 \u0645\u0624\u0633\u0633\u0629 \u0627\u0644\u062d\u0646\u0627\u0646 \u0627\u0644\u062e\u0627\u0635\u0629 | 2025-2026</span></div>';
function printScope(scope){
  document.getElementById('printOv').style.display='none';
  let ids=[];
  if(scope==='all') ids=['home','hist','geo','civ','met','tips'];
  else if(scope==='cur'){ const c=document.querySelector('section.view.on'); ids=[c?c.id.replace('v-',''):'home']; }
  else ids=[scope];
  let pa=document.getElementById('printArea');
  if(!pa){ pa=document.createElement('div'); pa.id='printArea'; document.body.appendChild(pa); }
  let html=PHEAD;
  ids.forEach(id=>{
    const sec=document.getElementById('v-'+id);
    if(!sec) return;
    const clone=sec.cloneNode(true);
    clone.querySelectorAll('.hero, .welcome, .done-chk, .chev, .searchbox, .info-strip').forEach(e=>e.remove());
    clone.querySelectorAll('details').forEach(d=>d.setAttribute('open',''));
    const wrap=document.createElement('div'); wrap.className='psec';
    wrap.innerHTML=clone.innerHTML;
    html+=wrap.outerHTML;
  });
  html+='<div class="print-foot">المرجع الشامل للمراجعة العامة — ذ. أحمد بوعمود | moraja3a.netlify.app</div>';
  pa.innerHTML=html;
  setTimeout(()=>{ window.print(); }, 200);
}
