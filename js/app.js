/* الخوارزمي 5.0 — الهيكل العام وصفحات الموقع */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
/* ===== الأوضاع الثلاثة: normal / kids / school — كل وضع يغيّر الموقع كله ===== */
/* وضع المدرسة مخفي في 4.4. لإرجاعه: غيّر SCHOOL_ON إلى true (والخطوات في README). */
const SCHOOL_ON = false;
const SCHOOL_PAGES = ['lessons', 'teacher', 'record'];
const PAGE_MODE = { activities: 'kids', stickers: 'kids' };
if (SCHOOL_ON) SCHOOL_PAGES.forEach(k => PAGE_MODE[k] = 'school');
let MODE = 'normal';
try { MODE = localStorage.getItem('kh-mode') || 'normal'; } catch (e) { }
if (!SCHOOL_ON && MODE === 'school') { MODE = 'normal'; try { localStorage.setItem('kh-mode', 'normal'); } catch (e) { } }
if (!SCHOOL_ON && SCHOOL_PAGES.includes(document.body.dataset.page)) location.replace('index.html');
{ const pm = PAGE_MODE[document.body.dataset.page]; if (pm && pm !== MODE) { MODE = pm; try { localStorage.setItem('kh-mode', pm); } catch (e) { } } }
document.documentElement.dataset.mode = MODE;
const byMode = (n, k, s) => MODE === 'kids' ? k : MODE === 'school' ? s : n;
const MODES = [['normal', 'عادي', '◆', 'الموقع كما هو: نبذة وقراءة وألعاب.'], ['kids', 'أطفال', '★', 'تصميم مرح، وشرح بلغة بسيطة، ونجوم وملصقات.'], ['school', 'مدرسة', '✎', 'دروس وأنشطة للمعلّم مع الطالب وسجلّ محفوظ.']].filter(m => SCHOOL_ON || m[0] !== 'school');
const NAVS = {
  normal: [['index.html', 'الرئيسية', 'home'], ['index.html#scholars', 'العلماء', 'scholars'], ['games.html', 'الألعاب', 'games'], ['daily.html', 'تحدي اليوم', 'daily'], ['topics.html', 'المجتمع', 'topics'], ['library.html', 'المكتبة', 'library'], ['story.html', 'القصة', 'story']],
  kids: [['index.html', 'الرئيسية', 'home'], ['index.html#scholars', 'العلماء', 'scholars'], ['activities.html', 'أنشطتي', 'activities'], ['games.html', 'ألعابي', 'games'], ['daily.html', 'تحدي اليوم', 'daily'], ['stickers.html', 'ملصقاتي', 'stickers'], ['library.html', 'المكتبة', 'library'], ['story.html', 'القصة', 'story']],
  school: [['index.html', 'الرئيسية', 'home'], ['lessons.html', 'الدروس', 'lessons'], ['teacher.html', 'دليل المعلّم', 'teacher'], ['record.html', 'سجلّ الطالب', 'record'], ['games.html', 'الألعاب', 'games'], ['library.html', 'المكتبة', 'library'], ['story.html', 'القصة', 'story']]
};
const NAV = NAVS[MODE];
if (MODE === 'kids') { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = 'https://fonts.googleapis.com/css2?family=Baloo+Bhaijaan+2:wght@600;700;800&display=swap'; document.head.appendChild(l); }

/* تبديل الوضع: شاشة انتقال قصيرة ثم إعادة تحميل الصفحة بالوضع الجديد */
function setMode(m) {
  if (m === MODE) return;
  try { localStorage.setItem('kh-mode', m); sessionStorage.setItem('kh-swap', m); } catch (e) { }
  const info = MODES.find(x => x[0] === m), here = document.body.dataset.page;
  const go = () => { const bad = PAGE_MODE[here] && PAGE_MODE[here] !== m; if (bad) location.href = 'index.html'; else location.reload(); };
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return go();
  document.documentElement.dataset.mode = m;
  document.body.insertAdjacentHTML('beforeend', `<div class="swap in" data-m="${m}"><div><i>${info[2]}</i><b>${info[1] === 'عادي' ? 'الوضع العادي' : 'وضع ' + info[1]}</b></div></div>`);
  setTimeout(go, 620);
}
function swapReveal() {
  let m = null; try { m = sessionStorage.getItem('kh-swap'); sessionStorage.removeItem('kh-swap'); } catch (e) { }
  if (!m) return;
  const info = MODES.find(x => x[0] === m); if (!info) return;
  document.body.insertAdjacentHTML('beforeend', `<div class="swap out" data-m="${m}"><div><i>${info[2]}</i><b>${info[1] === 'عادي' ? 'الوضع العادي' : 'وضع ' + info[1]}</b></div></div>`);
  setTimeout(() => $('.swap.out')?.remove(), 900);
}
const modeSwitch = () => `<div class="msw" role="group" aria-label="اختيار الوضع">${MODES.map(([k, t, i]) => `<button class="${k === MODE ? 'on' : ''}" data-m="${k}" aria-pressed="${k === MODE}" title="${t}"><i>${i}</i><span>${t}</span></button>`).join('')}</div>`;

/* نجوم متحركة في وضع الأطفال */
function kidSky() {
  if (MODE !== 'kids' || $('.ksky')) return;
  document.body.insertAdjacentHTML('afterbegin', `<div class="ksky" aria-hidden="true">${Array.from({ length: 16 }, (_, i) => `<i style="--x:${(i * 37 + 8) % 100}%;--s:${14 + (i * 7) % 22}px;--d:${(i % 6) * .7}s;--t:${5 + (i % 5)}s">${['★', '✦', '●', '★'][i % 4]}</i>`).join('')}</div>`);
}
const MASCOT = '<svg class="mascot" viewBox="0 0 120 120" aria-hidden="true"><path d="M60 6l16 33 36 5-26 25 6 36-32-17-32 17 6-36L8 44l36-5z" fill="#ffc21a" stroke="#f59a00" stroke-width="4" stroke-linejoin="round"/><circle cx="48" cy="58" r="6" fill="#2b2350"/><circle cx="72" cy="58" r="6" fill="#2b2350"/><circle cx="50" cy="56" r="2" fill="#fff"/><circle cx="74" cy="56" r="2" fill="#fff"/><path d="M48 73q12 12 24 0" fill="none" stroke="#2b2350" stroke-width="4" stroke-linecap="round"/><circle cx="38" cy="70" r="5" fill="#ff8fa3" opacity=".7"/><circle cx="82" cy="70" r="5" fill="#ff8fa3" opacity=".7"/></svg>';

/* صورة: تجرّب صورة حقيقية في img/real/ أولاً ثم ترجع للافتراضية */
const REAL_IMAGES = [];  // أضف هنا اسم أي صورة حقيقية وضعتها في img/real (بلا .jpg) ليستخدمها الموقع بدل الافتراضية
function pic(def, realName, alt = '', cls = '') {
  const mb = /\.svg$|alg2\.png|book1/.test(def) ? 'mb' : '';
  const c = [cls, mb].filter(Boolean).join(' ');
  if (!realName || !REAL_IMAGES.includes(realName)) return `<img class="${c}" src="${def}" alt="${alt}" loading="lazy">`;
  return `<img class="${c}" src="img/real/${realName}.jpg" alt="${alt}" loading="lazy" onerror="this.onerror=null;this.src='${def}';${mb ? "this.classList.add('mb')" : "this.classList.remove('mb')"}">`;
}

/* إطار الصورة الشخصية: الصور العريضة (الإدريسي) تُعرض كاملة دون تكبير */
function archBox(s, real) {
  const bg = s.wide ? `<img class="bgf" src="${s.portrait}" alt="">` : '';
  return `<div class="arch${s.wide ? ' wide' : ''}">${bg}${pic(s.portrait, real || null, s.name)}</div>`;
}

const SUN = '<svg class="su" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>';
const MOON = '<svg class="mo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7z"/></svg>';
const logoImg = '<img class="lt" src="img/art/rosette.svg" alt=""><img class="dk" src="img/art/rosette-dark.svg" alt="">';

function setTheme(t, btn) {
  const apply = () => { document.documentElement.dataset.theme = t; try { localStorage.setItem('kh-theme', t); } catch (e) { } };
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion:reduce)').matches) return apply();
  const r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
  const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const vt = document.startViewTransition(apply);
  vt.ready.then(() => document.documentElement.animate({ clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] }, { duration: 650, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }));
}

function shell(page) {
  const hd = `<header class="hd"><div class="wrap">
    <a class="logo" href="index.html">${logoImg}الخوارزمي</a>
    <button class="mbtn" type="button" aria-label="القائمة" aria-expanded="false" aria-controls="mnu"><span class="mbi" aria-hidden="true"><i></i><i></i><i></i></span><span class="mbt">القائمة</span></button>
  </div></header>`;
  /* القائمة الجانبية: فيها كل شيء (الحساب والشعلة والتنقل والوضع والمظهر). الشارتان تُضافان إلى .tools من rewards.js و daily.js */
  const menu = `<div class="mov"></div>
  <aside class="mnu" id="mnu" aria-label="القائمة الرئيسية" aria-hidden="true" inert>
    <div class="mh"><a class="logo" href="index.html">${logoImg}الخوارزمي</a><button class="mx" type="button" aria-label="إغلاق القائمة">×</button></div>
    <div class="mbd">
      <div class="tools"></div>
      <nav class="mnav" aria-label="التنقل الرئيسي">${NAV.map(([h, t, k]) => `<a href="${h}" class="${k === page ? 'on' : ''}"${k === page ? ' aria-current="page"' : ''}><span>${t}</span><i aria-hidden="true">‹</i></a>`).join('')}</nav>
      <div class="mset">
        <div class="mrow"><b>الوضع</b>${modeSwitch()}</div>
        <div class="mrow"><b>المظهر</b><button class="tg" type="button" aria-label="تبديل الوضع الفاتح والداكن" title="الوضع الفاتح / الداكن">${SUN}${MOON}</button></div>
      </div>
    </div>
  </aside>`;
  const ft = `<footer class="ft"><div class="band sm"></div><div class="wrap">
    <a class="logo" href="index.html"><img src="img/art/rosette-dark.svg" alt="">الخوارزمي</a>
    <nav>${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</nav>
    <small>الخوارزمي ٥.٢ — إحياء للعصر الذهبي لعلماء المسلمين</small></div></footer>`;
  document.body.insertAdjacentHTML('afterbegin', hd + menu);
  document.body.insertAdjacentHTML('beforeend', ft);
  const mb = $('.mbtn'), mn = $('#mnu'), mv = $('.mov'); let back = null;
  const setM = o => {
    mn.classList.toggle('open', o); mv.classList.toggle('open', o); mn.inert = !o;
    mn.setAttribute('aria-hidden', !o); mb.setAttribute('aria-expanded', o);
    document.documentElement.classList.toggle('mlock', o);
    if (o) { back = document.activeElement; $('.mx').focus(); } else if (back) { try { back.focus(); } catch (e) { } back = null; }
  };
  mb.onclick = () => setM(!mn.classList.contains('open'));
  mv.onclick = $('.mx').onclick = () => setM(false);
  addEventListener('keydown', e => { if (e.key === 'Escape' && mn.classList.contains('open')) setM(false); });
  mn.addEventListener('click', e => { if (e.target.closest('.mnav a')) setM(false); });
  $$('.msw button').forEach(b => b.onclick = () => setMode(b.dataset.m));
  kidSky(); swapReveal();
  const tg = $('.tg'); tg.onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark', tg);
  const hdr = $('.hd'); const sc = () => hdr.classList.toggle('scrolled', scrollY > 8); sc(); addEventListener('scroll', sc, { passive: true });
}

/* كشف العناصر عند التمرير */
function reveal() {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; io.unobserve(e.target); const t = e.target;
    requestAnimationFrame(() => t.classList.add('in')); setTimeout(() => t.classList.remove('rv', 'in'), 1500);
  }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  $$('.st, .grid4 > *, .grid3 > *, .mission > *, .ach > *, .nextprev > *, .about > *, .libgrid > *, .shelf, .vid').forEach((e, i) => {
    const sib = e.parentElement ? [...e.parentElement.children].indexOf(e) : 0;
    e.classList.add('rv'); e.style.setProperty('--d', (e.classList.contains('st') ? 0 : (sib % 4) * 90) + 'ms'); io.observe(e);
  });
}
const REAL_BANNERS = [];  // أضف هنا اسم أي بانر وضعته في img/real (مثل 'banner-home') ليستخدمه الموقع بلا طلبات فاشلة
function banner(el, file) {  // يستخدم صورة حقيقية إن وُجدت في img/real
  if (!REAL_BANNERS.includes(file)) return;
  const im = new Image(); im.onload = () => { el.style.backgroundImage = `url(img/real/${file}.jpg)`; el.classList.remove('def'); el.classList.add('photo'); };
  im.src = `img/real/${file}.jpg`;
}

const title = (h, p) => `<div class="st"><h2>${h}</h2>${p ? `<p>${p}</p>` : ''}<div class="orn"></div></div>`;

function scholarCard(s, href, go = 'نبذة وقراءة') {
  return `<a class="sc" href="${href || 'scholar.html?s=' + s.id}">${archBox(s)}
    <h3>${s.name}</h3><div class="f">${s.field}</div><div class="y">${s.years}</div><div class="go">${go}</div></a>`;
}
function gameTile(g) {
  const w = g.who ? byId(g.who).name : 'كل العلماء';
  return `<a class="gt" href="play.html?g=${g.id}"><div class="pic">${pic(ART(g.art))}</div>
    <div class="tx"><h3>${g.t}</h3><p>${g.d}</p><span class="by">${w}</span></div></a>`;
}

/* بطاقات اختيار الوضع (الرئيسية وصفحة modes.html) */
const MODE_ART = { normal: 'rosette', kids: 'stars', school: 'inkwell' };
const MODE_NAME = { normal: 'الوضع العادي', kids: 'وضع الأطفال', school: 'وضع المدرسة' };
const modeCards = () => `<div class="modes3" style="--n:${MODES.length}">${MODES.map(([k, , i, d]) => `<button class="mcard ${k === MODE ? 'cur' : ''}" data-pick="${k}"><div class="pic">${pic(ART(MODE_ART[k]))}</div><div class="tx"><h3><i>${i}</i> ${MODE_NAME[k]}</h3><p>${d}</p><span class="by">${k === MODE ? 'أنت هنا الآن' : 'جرّب هذا الوضع'}</span></div></button>`).join('')}</div>`;
const bindPick = () => $$('[data-pick]').forEach(b => b.onclick = () => setMode(b.dataset.pick));
function modesPage() {
  shell('modes'); setTimeout(reveal, 0);
  $('#app').innerHTML = `<section class="sec"><div class="wrap">${title('اختر طريقتك', 'اضغط على وضع ليتغيّر الموقع كله. يمكنك التبديل في أي وقت من أعلى الصفحة.')}${modeCards()}</div></section>`;
  bindPick();
}

/* ===== الرئيسية ===== */
function homeNormal() {
  shell('home');
  setTimeout(reveal, 0);
  $('#app').innerHTML = `
  <section class="hero"><div class="lanterns" aria-hidden="true">${'<div class="lantern"><img src="img/art/lantern.svg" alt=""></div>'.repeat(4)}</div><div class="bn" id="hbn"></div><div class="wrap">
    <div><h1>الخوارزمي</h1>
      <p class="lead">مكتبة تفاعلية لعلماء الحضارة الإسلامية، مكتوبة للجيل الجديد.</p>
      <div class="cta"><a class="btn" href="#scholars">تعرّف على العلماء</a><a class="btn alt" href="games.html">العب وتعلّم</a></div></div>
    <div class="art" aria-hidden="true"><img class="lt" src="img/art/hero-rosette.svg" alt=""><img class="dk" src="img/art/hero-rosette-dark.svg" alt=""><div class="arc"></div><div class="portraits"><div class="medal">${pic('img/khwarizmi-hero.jpg')}</div></div></div>
  </div><div class="band"></div></section>
  <section class="verse"><div class="wrap"><p>﴿قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ﴾<small>سورة الزمر، الآية ٩</small></p></div></section>
  <section class="sec" id="scholars"><div class="wrap">${title('علماء صنعوا العصر الذهبي', 'ثمانية علماء، لكل عالم نبذة قصيرة وكتاب مصوّر يمكنك تصفّحه صفحة صفحة.')}
    <div class="grid4">${SCHOLARS.map(x => scholarCard(x)).join('')}</div></div></section>
  <section class="sec white vibe-night"><div class="wrap">${title('اختر طريقتك في التعلّم', (MODES.length === 3 ? 'ثلاثة أوضاع' : 'وضعان') + '، وكل وضع يغيّر الموقع كله: التصميم والشرح والأنشطة.')}${modeCards()}</div></section>
  <section class="sec"><div class="wrap">${title('لماذا هذا الموقع؟')}
    <div class="mission">
      <div class="ms">${pic(ART('rosette'))}<h3>العلماء في مكان واحد</h3><p>معلومات مرتبة وواضحة بدل البحث في عشرات الصفحات.</p></div>
      <div class="ms">${pic(ART('inkwell'))}<h3>قراءة بروح المخطوطات</h3><p>كل عالم له كتاب مصوّر بصفحات ورقية قديمة وصور ونصوص.</p></div>
      <div class="ms">${pic(ART('chess'))}<h3>ألعاب تُرسّخ المعلومة</h3><p>تسع ألعاب قصيرة تجعل التعلّم أسهل وأمتع.</p></div>
    </div></div></section>
  <section class="sec"><div class="wrap">${title('الألعاب', 'لكل عالم لعبة مرتبطة بما قدّمه، ومعها اختبار عام.')}
    <div class="grid3">${GAMES.map(gameTile).join('')}</div></div></section>`;
  banner($('#hbn'), 'banner-home'); bindPick();
}

/* ===== صفحة العالم ===== */
function scholarPage() {
  const id = new URLSearchParams(location.search).get('s');
  const i = SCHOLARS.findIndex(s => s.id === id);
  if (i < 0) { location.replace('index.html'); return; }
  const s = SCHOLARS[i], prev = SCHOLARS[(i + SCHOLARS.length - 1) % SCHOLARS.length], next = SCHOLARS[(i + 1) % SCHOLARS.length];
  const g = GAMES.find(x => x.id === s.game);
  document.title = `${s.name} — الخوارزمي`;
  shell('scholars');
  if (MODE === 'kids') return scholarKids(s, prev, next, g);
  $('#app').innerHTML = `
  <section class="sh"><div class="bn def" style="background-image:url(${ART(s.achievements[0].art)})"></div><div class="wrap">
    ${archBox(s, s.id + '-portrait')}
    <div><h1>${s.name}</h1><div class="full">${s.full}</div><span class="tag">${s.field}</span>
      <div class="facts">${s.facts.map(([k, v]) => `<div class="fact"><b>${k}</b><span>${v}</span></div>`).join('')}</div>
      ${MODE === 'school' ? schoolChip(s.id) : ''}<div class="cta"><button class="btn" id="openbook">قراءة</button>${MODE === 'school' ? `<a class="btn gold" href="lessons.html?s=${s.id}">ابدأ الدرس</a>` : ''}<a class="btn alt" href="play.html?g=${s.game}">العب: ${g.t}</a><a class="btn alt" href="quiz.html?s=${s.id}">اختبر نفسك</a></div></div>
  </div><div class="band"></div></section>
  <section class="sec"><div class="wrap">${title('نبذة')}
    <div class="about"><p>${s.intro}</p>
      <button class="bookbtn" id="openbook2" aria-label="افتح كتاب ${s.name}"><div class="cover"><img src="img/art/rosette.svg" alt=""><b>${s.name}</b><span>${s.years}</span></div><span class="lbl">قراءة</span></button></div></div></section>
  <section class="sec white"><div class="wrap">${title('أبرز ما قدّمه')}
    <div class="ach">${s.achievements.map(a => `<div class="ac">${pic(ART(a.art))}<h3>${a.t}</h3><p>${a.d}</p></div>`).join('')}</div></div></section>
  <section class="sec"><div class="wrap"><div class="nextprev">
    <a href="scholar.html?s=${prev.id}"><span>→</span><div><small>العالم السابق</small>${prev.name}</div></a>
    <a href="scholar.html?s=${next.id}"><div><small>العالم التالي</small>${next.name}</div><span>←</span></a></div></div></section>`;
  reader(s, next);
  banner($('.sh .bn'), 'banner-' + s.id);
  $('#openbook').onclick = () => openReader();
  $('#openbook2').onclick = () => { const cv = $('.cover'); if (matchMedia('(prefers-reduced-motion:reduce)').matches) return openReader(); cv.classList.add('opening'); setTimeout(() => { openReader(); cv.classList.remove('opening'); }, 650); };
  reveal();
}

/* ===== القارئ: كتاب بورق قديم ===== */
let RD = null;
function reader(s, next) {
  const g = GAMES.find(x => x.id === s.game);
  const P = [];
  P.push(`<div class="cvp">${'<small>كتاب</small>'}${archBox(s, s.id + '-portrait')}<h2>${s.name}</h2><small>${s.full}</small><small>${s.years}</small></div>`);
  P.push(`<div class="idx"><h3>الفهرس</h3><div class="rule"></div><ol>${(MODE === 'kids' ? s.chapters.map((c, k) => ({ t: KC[s.id].ch[k].t })) : s.chapters).map((c, k) => `<li><button data-go="${2 + k * 2}"><span>${c.t}</span><span>${AR(3 + k * 2)}</span></button></li>`).join('')}<li><button data-go="8"><span>ألبوم الصور</span><span>${AR(9)}</span></button></li></ol></div>`);
  const chs = MODE === 'kids' ? s.chapters.map((c, k) => ({ ...c, t: KC[s.id].ch[k].t, p: KC[s.id].ch[k].p })) : s.chapters;
  chs.forEach((c, k) => {
    P.push(`<h3>${c.t}</h3><div class="rule"></div>${c.p.map(t => `<p>${t}</p>`).join('')}`);
    P.push(`<figure class="fig"><div class="ph">${pic(c.img.src, `${s.id}-c${k + 1}`, c.img.cap)}</div><figcaption>${c.img.cap}</figcaption></figure>`);
  });
  P.push(`<h3>ألبوم الصور</h3><div class="rule"></div><div class="alb">${s.album.map((a, k) => `<figure><div class="ph">${pic(a.src, `${s.id}-a${k + 1}`, a.cap)}</div><figcaption>${a.cap}</figcaption></figure>`).join('')}</div>`);
  P.push(`<div class="endp"><h3>إلى اللقاء</h3><div class="rule"></div><p style="text-align:center">هل تذكر ما قرأته عن ${s.name}؟ جرّب اللعبة، أو انتقل إلى العالم التالي.</p><a class="btn" href="play.html?g=${s.game}">العب: ${g.t}</a><a class="btn alt" href="scholar.html?s=${next.id}">${next.name}</a></div>`);
  const el = document.createElement('div');
  el.className = 'rd'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', `كتاب ${s.name}`);
  el.innerHTML = `<button class="x" aria-label="إغلاق">×</button><div class="book"></div>
    <button class="arrow nx" aria-label="الصفحة التالية">←</button><button class="arrow pv" aria-label="الصفحة السابقة">→</button><div class="cnt"></div>`;
  document.body.appendChild(el);
  RD = { el, P, id: s.id, cur: 0, last: null, book: $('.book', el) };
  $('.x', el).onclick = closeReader;
  $('.nx', el).onclick = () => turn(1); $('.pv', el).onclick = () => turn(-1);
  el.addEventListener('click', e => { const b = e.target.closest('[data-go]'); if (b) go(+b.dataset.go); if (e.target === el) closeReader(); });
  let x0 = null;
  el.addEventListener('touchstart', e => x0 = e.touches[0].clientX, { passive: true });
  el.addEventListener('touchend', e => { if (x0 == null) return; const d = e.changedTouches[0].clientX - x0; if (Math.abs(d) > 50) turn(d < 0 ? 1 : -1); x0 = null; });
  document.addEventListener('keydown', e => {
    if (!el.classList.contains('open')) return;
    if (e.key === 'Escape') closeReader();
    if (e.key === 'ArrowLeft') turn(1);
    if (e.key === 'ArrowRight') turn(-1);
  });
  window.addEventListener('resize', () => { if (el.classList.contains('open')) draw(0); });
}
const single = () => matchMedia('(max-width:760px)').matches;
function go(p) { RD.cur = single() ? p : p - (p % 2); draw(p >= RD.last ? 1 : -1); RD.last = RD.cur; }
function turn(d) {
  const step = single() ? 1 : 2, n = RD.cur + d * step;
  if (n < 0 || n >= RD.P.length) return;
  RD.cur = n; draw(d);
}
function draw(dir) {
  const { P, cur, book, el } = RD, one = single();
  if (!one && cur % 2) RD.cur = cur - 1;
  const c = RD.cur;
  const page = (i, side) => {
    if (i >= P.length) return `<div class="pg ${side}"></div>`;
    const cover = i === 0, num = cover ? '' : `<div class="num">${AR(i + 1)}</div>`;
    return `<div class="pg ${side}${i === 0 ? ' cvpg' : ''}">${P[i]}${num}</div>`;
  };
  book.innerHTML = one ? page(c, 'r') : page(c, 'r') + page(c + 1, 'l');
  if (dir) { const t = $(dir > 0 && !one ? '.pg.l' : '.pg.r', book); if (t) t.classList.add('t'); }
  const total = P.length, shown = one ? AR(c + 1) : `${AR(c + 1)}–${AR(Math.min(c + 2, total))}`;
  $('.cnt', el).textContent = `الصفحات ${shown} من ${AR(total)}`;
  $('.nx', el).disabled = c + (one ? 1 : 2) >= total; $('.pv', el).disabled = c === 0;
  $$('.pg', book).forEach(p => p.scrollTop = 0);
  if (c + (one ? 1 : 2) >= total && typeof onReadEnd === 'function') onReadEnd(RD.id);
}
let lastFocus = null;
function openReader() { lastFocus = document.activeElement; RD.cur = 0; RD.last = 0; RD.el.classList.add('open'); document.body.style.overflow = 'hidden'; draw(0); $('.x', RD.el).focus(); }
function closeReader() { RD.el.classList.remove('open'); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }

/* ===== الألعاب (القائمة) ===== */
function gamesHub() {
  shell('games');
  setTimeout(reveal, 0);
  $('#app').innerHTML = `<section class="sec"><div class="wrap">${title(byMode('الألعاب', 'ألعابي', 'ألعاب الفصل'), byMode('تسع ألعاب قصيرة: واحدة لكل عالم، وأخرى تختبر معلوماتك عن الجميع.', 'العب واجمع النجوم!', 'ألعاب قصيرة تصلح نشاطاً جماعياً في نهاية الدرس.'))}<div class="grid3">${GAMES.map(gameTile).join('')}</div></div></section>
    <section class="sec white"><div class="wrap">${title('اختبار لكل عالم', 'ستة أسئلة قصيرة عن كل عالم.')}<div class="grid4">${SCHOLARS.map(x => scholarCard(x, 'quiz.html?s=' + x.id, 'ابدأ الاختبار')).join('')}</div></div></section>`;
}

/* ===== المكتبة ===== */
function library() {
  shell('library');
  setTimeout(reveal, 0);
  const cols = ['#0e2a55', '#1d5fbf', '#164a96', '#12376f'];
  const hs = [250, 290, 270, 300, 260, 285, 245, 275];
  $('#app').innerHTML = `
  <section class="sec"><div class="wrap">${title('رفّ الكتب', 'كتاب شهير لكل عالم. اضغط على الكتاب لتفتح صفحة صاحبه.')}
    <div class="shelf">${SCHOLARS.map((s, i) => `<a class="spine" href="scholar.html?s=${s.id}" style="background:${cols[i % 4]};height:${hs[i]}px" title="${s.name}">${s.book}<small>${s.name}</small></a>`).join('')}</div></div></section>
  <section class="sec white"><div class="wrap">${title('كتاب الموقع')}
    <div class="libgrid">${pic('img/poster.jpg', null, 'غلاف كتاب الإرث العلمي للمسلمين في العصور الذهبية')}
      <div><h3>الإرث العلمي للمسلمين في العصور الذهبية</h3><p>تأليف: أسر محمد مجبري. كتاب يلخّص جهود العلماء المسلمين في العلوم المختلفة.</p>
      <div class="bkact"><span class="btn alt buy" aria-disabled="true">الشراء قريباً</span><button class="btn gold" id="peek">ألقِ نظرة</button></div></div></div></div></section>`;
  $('#peek').onclick = openPeek;
}

/* معاينة الكتاب: صفحات الـPDF كصور داخل الصفحة */
const PEEK = ['img/book/p-1.jpg', 'img/book/p-2.jpg', 'img/book/p-3.jpg', 'img/book/p-4.jpg'];
function openPeek() {
  let i = 0;
  const el = document.createElement('div'); el.className = 'peek'; el.setAttribute('role', 'dialog'); el.setAttribute('aria-modal', 'true'); el.setAttribute('aria-label', 'معاينة الكتاب');
  el.innerHTML = `<button class="x" aria-label="إغلاق">×</button><div class="pv"><img alt=""></div><div class="pbar"><button class="btn alt" data-d="1">التالية ←</button><span></span><button class="btn alt" data-d="-1">→ السابقة</button></div>`;
  document.body.appendChild(el); document.body.style.overflow = 'hidden';
  const show = () => { $('img', el).src = PEEK[i]; $('.pbar span', el).textContent = `صفحة ${AR(i + 1)} من ${AR(PEEK.length)}`; $('[data-d="1"]', el).disabled = i >= PEEK.length - 1; $('[data-d="-1"]', el).disabled = i <= 0; $('.pv', el).scrollTop = 0; };
  const close = () => { el.remove(); document.body.style.overflow = ''; document.removeEventListener('keydown', key); };
  const key = e => { if (e.key === 'Escape') close(); if (e.key === 'ArrowLeft' && i < PEEK.length - 1) { i++; show(); } if (e.key === 'ArrowRight' && i > 0) { i--; show(); } };
  document.addEventListener('keydown', key);
  $('.x', el).onclick = close; el.addEventListener('click', e => { if (e.target === el) close(); });
  $$('[data-d]', el).forEach(b => b.onclick = () => { i += +b.dataset.d; show(); });
  show(); $('.x', el).focus();
}

/* ===== القصة ===== */
function story() {
  shell('story');
  setTimeout(reveal, 0);
  $('#app').innerHTML = `<section class="sec"><div class="wrap">${title('الخوارزمي يتحدث', 'مقطع قصير يقدّم فيه محمد بن موسى الخوارزمي نفسه بصوت مدعوم بالذكاء الاصطناعي.')}
    <div class="vid"><video controls playsinline preload="metadata" poster="img/portraits/khwarizmi.jpg"><source src="videos/khwarizmi.mp4" type="video/mp4">متصفحك لا يدعم تشغيل الفيديو. <a href="videos/khwarizmi.mp4">حمّل الفيديو</a></video></div>
    <p style="text-align:center;margin-top:22px"><a class="btn" href="scholar.html?s=khwarizmi">اقرأ عن الخوارزمي</a></p></div></section>`;
}

const PAGES = { home: () => ({ normal: homeNormal, kids: homeKids, school: homeSchool })[MODE](), modes: modesPage, scholar: scholarPage, games: gamesHub, library, story };
document.addEventListener('DOMContentLoaded', () => PAGES[document.body.dataset.page]?.());
