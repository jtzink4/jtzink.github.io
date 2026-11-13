const pages = [['index.html', 'About Me'], ['my-life.html', 'My Life'], ['portfolio.html', 'Portfolio', [['coursework.html', 'Coursework'], ['personal-projects.html', 'Personal Projects']]], ['contact.html', 'Contact']];
const here = (location.pathname.split('/').pop() || 'index.html');
const link = ([h, t]) => `<a href="${h}"${h === here ? ' aria-current="page"' : ''}>${t}</a>`;
const nav = pages.map(p => `<li${p[2] ? ' class="has-sub"' : ''}>${link(p)}${p[2] ? `<ul class="sub">${p[2].map(s => `<li>${link(s)}</li>`).join('')}</ul>` : ''}</li>`).join('');
document.querySelector('header').innerHTML = `<div class="wrap"><a class="logo" href="index.html">JT Zink</a><button class="menu-btn" aria-expanded="false" aria-controls="nav">Menu</button><nav id="nav"><ul>${nav}</ul></nav></div>`;
document.querySelector('footer').innerHTML = `<div class="wrap"><div><strong>John (JT) Zink</strong><br>Mechanical Engineering, Colorado State University</div><div><a href="tel:9707599800">970-759-9800</a><br><a href="mailto:jtzink@outlook.com">jtzink@outlook.com</a></div><div>&copy; ${new Date().getFullYear()} JT Zink</div></div>`;
const btn = document.querySelector('.menu-btn'), navEl = document.getElementById('nav');
btn.onclick = () => btn.setAttribute('aria-expanded', navEl.classList.toggle('open'));
// contact form (sends through Web3Forms; messages arrive at the email the access key was created with)
document.querySelectorAll('[data-contact]').forEach(el => {
    el.innerHTML = `<form><div class="row"><label>First name*<input name="first" required></label><label>Last name*<input name="last" required></label></div><label>Email*<input type="email" name="email" required pattern="[^@ ]+@[^@ ]+[.][^@ ]{2,}" title="Enter a full email address, like name@example.com"></label><label>Phone<input type="tel" name="phone"></label><label>Message*<textarea name="message" required></textarea></label><input type="checkbox" name="botcheck" style="display:none" tabindex="-1" autocomplete="off"><button class="btn" type="submit">Send message</button><p class="note" role="status"></p></form>`;
    const form = el.querySelector('form');
    const note = form.querySelector('.note');
    const sendBtn = form.querySelector('button');
    form.onsubmit = async e => {
        e.preventDefault();
        const data = new FormData(form);
        data.append('access_key', '390ecd6e-e0f1-49aa-a397-0c5cb83a3e70');
        data.append('subject', 'Website Message');
        data.append('from_name', 'JTZ Website');
        data.append('name', data.get('first') + ' ' + data.get('last'));
        sendBtn.disabled = true;
        note.textContent = 'Sending...';
        try {
            const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: data });
            const j = await r.json();
            if (j.success) {
                note.textContent = 'Message sent. Thank you!';
                form.reset();
            } else {
                note.textContent = 'Something went wrong. Please email me directly at jtzink@outlook.com.';
            }
        } catch (err) {
            note.textContent = 'Could not send. Please email me directly at jtzink@outlook.com.';
        }
        sendBtn.disabled = false;
    };
});
// reveal on scroll + fade in/out between pages
const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target) } }), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
requestAnimationFrame(() => document.body.classList.add('ready'));
addEventListener('pageshow', e => e.persisted && document.body.classList.add('ready'));
document.addEventListener('click', e => {
    const a = e.target.closest('a[href]');
    if (!a || a.target || e.metaKey || e.ctrlKey || a.origin !== location.origin || a.pathname === location.pathname && a.hash) return;
    e.preventDefault(); document.body.classList.add('leaving'); setTimeout(() => location.href = a.href, 300)
});
document.querySelectorAll('.slides').forEach(box => {
    const imgs = [...box.querySelectorAll('img')], dots = box.querySelector('.dots');
    let i = 0, t;
    imgs.forEach((_, n) => { const b = document.createElement('button'); b.setAttribute('aria-label', 'Show photo ' + (n + 1)); b.onclick = () => { show(n); restart() }; dots.append(b) });
    const bs = [...dots.children];
    function show(n) { i = n; imgs.forEach((im, k) => im.classList.toggle('on', k === n)); bs.forEach((b, k) => b.classList.toggle('on', k === n)) }
    function restart() { clearInterval(t); if (!matchMedia('(prefers-reduced-motion:reduce)').matches) t = setInterval(() => show((i + 1) % imgs.length), 3500) }
    show(0); restart();
    box.onmouseenter = () => clearInterval(t); box.onmouseleave = restart;
});