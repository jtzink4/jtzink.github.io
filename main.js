const pages=[['index.html','About Me'],['my-life.html','My Life'],['portfolio.html','Portfolio',[['coursework.html','Coursework'],['personal-projects.html','Personal Projects']]],['contact.html','Contact']];
const here=(location.pathname.split('/').pop()||'index.html');
const link=([h,t])=>`<a href="${h}"${h===here?' aria-current="page"':''}>${t}</a>`;
const nav=pages.map(p=>`<li${p[2]?' class="has-sub"':''}>${link(p)}${p[2]?`<ul class="sub">${p[2].map(s=>`<li>${link(s)}</li>`).join('')}</ul>`:''}</li>`).join('');
document.querySelector('header').innerHTML=`<div class="wrap"><a class="logo" href="index.html">JT Zink</a><button class="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button><nav id="nav"><ul>${nav}</ul></nav></div>`;
document.querySelector('footer').innerHTML=`<div class="wrap"><div><strong>John (JT) Zink</strong><br>Mechanical Engineering, Colorado State University</div><div><a href="tel:9707599800">970-759-9800</a><br><a href="mailto:J.zink@colostate.edu">J.zink@colostate.edu</a></div><div>&copy; ${new Date().getFullYear()} JT Zink</div></div>`;
const btn=document.querySelector('.menu-btn'),navEl=document.getElementById('nav');
btn.onclick=()=>btn.setAttribute('aria-expanded',navEl.classList.toggle('open'));
// contact form (opens the visitor's email app; swap for Formspree later, see README)
document.querySelectorAll('[data-contact]').forEach(el=>{
el.innerHTML=`<form><div class="row"><label>First name*<input name="first" required></label><label>Last name*<input name="last" required></label></div><label>Email*<input type="email" name="email" required></label><label>Phone<input type="tel" name="phone"></label><label>Message*<textarea name="message" required></textarea></label><button class="btn" type="submit">Send message</button><p class="note" role="status"></p></form>`;
el.querySelector('form').onsubmit=e=>{e.preventDefault();const f=Object.fromEntries(new FormData(e.target));
const body=`${f.message}\n\n${f.first} ${f.last}\n${f.email}${f.phone?'\n'+f.phone:''}`;
location.href=`mailto:J.zink@colostate.edu?subject=${encodeURIComponent('Website message from '+f.first+' '+f.last)}&body=${encodeURIComponent(body)}`;
e.target.querySelector('.note').textContent='Opening your email app to send the message.';}});
// reveal on scroll + fade in/out between pages
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
requestAnimationFrame(()=>document.body.classList.add('ready'));
addEventListener('pageshow',e=>e.persisted&&document.body.classList.add('ready'));
document.addEventListener('click',e=>{const a=e.target.closest('a[href]');
if(!a||a.target||e.metaKey||e.ctrlKey||a.origin!==location.origin||a.pathname===location.pathname&&a.hash)return;
e.preventDefault();document.body.classList.add('leaving');setTimeout(()=>location.href=a.href,300)});
