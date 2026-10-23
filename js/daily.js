/* الخوارزمي 5.0 — تحدي اليوم، شعلة المثابرة، ولوحة الشرف
   - عالم اليوم وسؤاله العام يُحسبان من التاريخ فقط، فيحصل كل الزوار على السؤال نفسه بلا خادم.
   - اليوم يبدأ وينتهي عند ١٢ منتصف الليل بتوقيت القاهرة (TZ أدناه).
   - الشعلة: تشتعل بإجابة صحيحة عن سؤال عشوائي لعالم اليوم، وتنطفئ عند منتصف الليل، وتصير صفراً إن فاتك يوم.
   - لوحة الشرف: أول ثلاثة يجيبون صحيحاً عن السؤال العام (المجموعة daily/{التاريخ} في Firestore). */
(() => {
const K = window.KHR; if (!K) return;
const TZ = 'Africa/Cairo';
const PARTS = new Intl.DateTimeFormat('en-US', { timeZone: TZ, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
const cairo = () => { const o = {}; PARTS.formatToParts(new Date()).forEach(x => o[x.type] = x.value); return o; };
const todayKey = () => { const o = cairo(); return `${o.year}-${o.month}-${o.day}`; };
const dnum = k => { const [y, m, d] = k.split('-').map(Number); return Date.UTC(y, m - 1, d) / 864e5; };
const prevKey = k => new Date((dnum(k) - 1) * 864e5).toISOString().slice(0, 10);
const secsLeft = () => { const o = cairo(); return 86400 - (+o.hour * 3600 + +o.minute * 60 + +o.second); };
const clock = s => AR([Math.floor(s / 3600), Math.floor(s % 3600 / 60), s % 60].map(v => String(v).padStart(2, '0')).join(':'));
const dayWord = n => n === 0 ? 'صفر أيام' : n === 1 ? 'يوم واحد' : n === 2 ? 'يومان' : n <= 10 ? AR(n) + ' أيام' : AR(n) + ' يوماً';

/* ===== عشوائية ثابتة: نفس التاريخ يعطي نفس النتيجة عند الجميع ===== */
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const shuf = (arr, r) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const raw = c => shuf(SCHOLARS.map(s => s.id), rng(c * 7919 + 101));
const order = c => { const o = raw(c); if (c > 0 && o[0] === raw(c - 1)[o.length - 1]) [o[0], o[1]] = [o[1], o[0]]; return o; };  // لا يتكرر العالم يومين متتاليين
const CACHE = {};
function info(key) {
  if (CACHE[key]) return CACHE[key];
  const n = dnum(key), c = Math.floor(n / 8), sid = order(c)[n % 8], s = byId(sid), qs = quizOf(sid), gi = c % qs.length;
  return CACHE[key] = { key, n, s, qs, gi, q: qs[gi].q, opts: shuf(qs[gi].o.map((t, i) => ({ t, ok: i === 0 })), rng(n * 131 + 7)) };
}

/* ===== الشعلة ===== */
const FL_ON = '<svg class="fl on" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="khfa" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#c2410c"/><stop offset=".55" stop-color="#f97316"/><stop offset="1" stop-color="#fbbf24"/></linearGradient><linearGradient id="khfb" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#f59e0b"/><stop offset="1" stop-color="#fde68a"/></linearGradient></defs><path d="M33 2c1 10 6 14 11 21 5 6 8 12 8 20 0 11-8 19-20 19S12 54 12 43c0-7 3-12 7-17 1 5 3 8 6 9-2-9 1-19 8-33z" fill="url(#khfa)" stroke="#8a6416" stroke-width="1.6" stroke-linejoin="round"/><path d="M32 26c1 6 8 10 8 18 0 7-4 12-9 12s-9-4-9-10c0-5 3-8 5-11 0 3 1 5 3 6-1-6 0-10 2-15z" fill="url(#khfb)"/><path d="M31.5 42c1 3 4 5 4 8 0 3-2 5-4.5 5S27 53 27 50c0-3 3-5 4.5-8z" fill="#fff7d6"/></svg>';
const FL_OFF = '<svg class="fl off" viewBox="0 0 64 64" aria-hidden="true"><path d="M33 2c1 10 6 14 11 21 5 6 8 12 8 20 0 11-8 19-20 19S12 54 12 43c0-7 3-12 7-17 1 5 3 8 6 9-2-9 1-19 8-33z" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-opacity=".55" stroke-width="2" stroke-linejoin="round" stroke-dasharray="4 3.5"/><path d="M32 26c1 6 8 10 8 18 0 7-4 12-9 12s-9-4-9-10c0-5 3-8 5-11 0 3 1 5 3 6-1-6 0-10 2-15z" fill="currentColor" fill-opacity=".12"/><circle cx="31.5" cy="50" r="3.2" fill="currentColor" fill-opacity=".4"/></svg>';
const CROWN = '<svg class="crown" viewBox="0 0 48 32" aria-hidden="true"><defs><linearGradient id="khcr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1b8"/><stop offset="1" stop-color="#c8962c"/></linearGradient></defs><path d="M4 26L8 8l10 10L24 4l6 14L40 8l4 18z" fill="url(#khcr)" stroke="#6b4a0e" stroke-width="1.5" stroke-linejoin="round"/><rect x="4" y="26" width="40" height="4" rx="1.5" fill="#c8962c" stroke="#6b4a0e" stroke-width="1.5"/><circle cx="8" cy="8" r="2" fill="#fff1b8"/><circle cx="24" cy="4" r="2" fill="#fff1b8"/><circle cx="40" cy="8" r="2" fill="#fff1b8"/></svg>';

/* حالة شعلة هذا المستخدم الآن (تُحسب من آخر يوم أُشعلت فيه، فلا حاجة لكتابة عند الانطفاء) */
function fireNow(me) {
  const k = todayKey(), f = (me && me.fire) || 0, d = me && me.fireDay;
  if (!me || !f) return { lit: false, n: 0, risk: false };
  if (d === k) return { lit: true, n: f, risk: false };
  if (d === prevKey(k)) return { lit: false, n: f, risk: true };
  return { lit: false, n: 0, risk: false };
}

/* ===== لوحة الشرف: الاشتراك في وثيقة اليوم ===== */
let WIN = null, WINERR = false, SUB = null, SUBKEY = '';
function watch() {
  const db = K.db(), F = K.F(), k = todayKey();
  if (!db || !F || SUBKEY === k) return;
  if (SUB) SUB(); SUBKEY = k; WIN = null; WINERR = false;
  SUB = F.onSnapshot(F.doc(db, 'daily', k), s => { const d = s.exists() ? s.data() : {}; WIN = { key: k, u: d.u || [], n: d.n || [], p: d.p || [] }; WINERR = false; paintAll(); },
    e => { console.error(e); WINERR = true; paintAll(); });
}
const winnersOf = k => (WIN && WIN.key === k) ? WIN : { key: k, u: [], n: [], p: [] };

function honor(T, full) {
  const W = winnersOf(T.key), names = ['الأول', 'الثاني', 'الثالث'];
  const slot = i => {
    const w = W.u[i] ? { n: W.n[i], p: W.p[i] } : null, z = i === 0 ? 96 : 74;
    return `<div class="hs h${i + 1}${w ? '' : ' em'}"><div class="hs-top">${i === 0 ? CROWN : ''}</div>
      <div class="hs-av">${w ? K.av(w.p, w.n, z) : `<span class="av em" style="--z:${z}px">؟</span>`}<span class="hs-m">${AR(i + 1)}</span></div>
      <div class="hs-n">${w ? K.esc(w.n) : 'المقعد شاغر'}</div><small>${w ? names[i] + ' اليوم' : 'كن أنت'}</small></div>`;
  };
  return `<section class="hon${full ? ' full' : ''}" aria-label="لوحة الشرف"><div class="hon-pat" aria-hidden="true"></div>
    <i class="hc tl"></i><i class="hc tr"></i><i class="hc bl"></i><i class="hc br"></i>
    <div class="wrap"><p class="hon-k">لوحة الشرف · تحدي اليوم</p><h2>أوائل المجيبين</h2>
    <p class="hon-s">عالم اليوم: <b>${T.s.name}</b> · أول ثلاثة يجيبون صحيحاً يدخلون اللوحة · يتجدد بعد <span class="cd">${clock(secsLeft())}</span></p>
    <div class="hon-pod">${[1, 0, 2].map(slot).join('')}</div>
    ${WINERR ? '<p class="hon-e">تعذّر تحميل اللوحة الآن.</p>' : ''}
    ${full ? '' : '<a class="btn gl" href="daily.html">شارك في التحدي</a>'}</div></section>`;
}

/* ===== حالة الأسئلة ===== */
let SQ = null, GPICK = -1, BUSY = false;
function nextSQ(T) {
  const pool = T.qs.map((_, i) => i).filter(i => i !== T.gi);  // سؤال الشعلة غير سؤال التحدي العام حتى لا يكشف جوابه
  const seen = SQ && SQ.key === T.key ? SQ.seen : [];
  let left = pool.filter(i => !seen.includes(i)); if (!left.length) { seen.length = 0; left = pool; }
  const idx = left[Math.floor(Math.random() * left.length)], q = T.qs[idx];
  SQ = { key: T.key, idx, seen: [...seen, idx], q: q.q, opts: shuf(q.o.map((t, i) => ({ t, ok: i === 0 })), Math.random), pick: -1 };
}
const opts = (list, pick, done, attr) => list.map((o, i) => `<button class="dq${done ? (o.ok ? ' ok' : i === pick ? ' no' : '') : ''}" ${attr}="${i}"${done ? ' disabled' : ''}>${o.t}</button>`).join('');

function streakCard(T, me) {
  const f = fireNow(me), loggedIn = !!me;
  let body;
  if (K.fail()) body = '<p class="rm">تعذّر الاتصال بـ Firebase. تأكد من الإنترنت وافتح الموقع عبر http/https.</p>';
  else if (K.auth() === undefined || (K.auth() && !me)) body = '<p class="rm">جارٍ التحميل…</p>';
  else if (!loggedIn) body = '<p class="rm">سجّل دخولك لتُشعل شعلتك وتحفظ سلسلة أيامك.</p><a class="btn" href="account.html">تسجيل الدخول</a>';
  else if (f.lit) body = `<p class="dl-ok">اشتعلت شعلتك اليوم. عُد غداً لتزيد السلسلة.</p>`;
  else {
    if (!SQ || SQ.key !== T.key) nextSQ(T);
    const done = SQ.pick >= 0;
    body = `${f.risk ? `<p class="dl-warn">سلسلتك ${dayWord(f.n)} في خطر. أجب قبل منتصف الليل لتبقى.</p>` : ''}
      <p class="dq-t"><small>سؤال عشوائي عن ${T.s.name}</small>${SQ.q}</p><div class="dqs" id="sq">${opts(SQ.opts, SQ.pick, done, 'data-sq')}</div>
      ${done && !SQ.opts[SQ.pick].ok ? '<p class="dl-no">إجابة غير صحيحة. الشعلة تنتظرك، جرّب سؤالاً آخر.</p><button class="btn alt" data-nx="1">سؤال آخر</button>' : ''}`;
  }
  return `<div class="rc dcard"><div class="fire ${f.lit ? 'is-on' : 'is-off'}">${f.lit ? FL_ON : FL_OFF}<div><h3>شعلة المثابرة</h3><p class="fn">${f.n ? `<b>${AR(f.n)}</b> <span>${f.n === 1 ? 'يوم' : 'أيام'} متتالية</span>` : '<span class="z">ابدأ سلسلتك اليوم</span>'}</p><p class="fs">${f.lit ? 'مشتعلة' : 'مطفأة'} اليوم</p></div></div>${body}</div>`;
}

function globalCard(T, me) {
  const done = me && me.chDay === T.key, W = winnersOf(T.key), uid = K.auth() && K.auth().uid, rk = uid ? W.u.indexOf(uid) + 1 : 0;
  let body;
  if (K.fail()) body = '<p class="rm">تعذّر الاتصال بـ Firebase.</p>';
  else if (K.auth() === undefined || (K.auth() && !me)) body = '<p class="rm">جارٍ التحميل…</p>';
  else if (!me) body = '<p class="rm">سجّل دخولك لتجيب وتنافس على لوحة الشرف.</p><a class="btn" href="account.html">تسجيل الدخول</a>';
  else {
    const pick = done ? (me.chOk ? T.opts.findIndex(o => o.ok) : GPICK) : -1;
    body = `<p class="dq-t"><small>سؤال واحد لجميع الزوار · محاولة واحدة</small>${T.q}</p><div class="dqs" id="gq">${opts(T.opts, pick, done, 'data-gc')}</div>`;
    if (done) body += me.chOk
      ? (rk ? `<p class="dl-ok">أحسنت! أنت رقم ${AR(rk)} على لوحة الشرف اليوم.</p>` : '<p class="dl-ok">إجابة صحيحة! لكن المقاعد الثلاثة امتلأت، كن أسرع غداً.</p>')
      : '<p class="dl-no">إجابة غير صحيحة، والصحيحة موضّحة بالأخضر. يتجدد التحدي عند منتصف الليل.</p>';
    if (done) body += `<a class="lnk" href="scholar.html?s=${T.s.id}">اقرأ عن ${T.s.name}</a>`;
  }
  return `<div class="rc dcard"><div class="dh"><h3>سؤال اليوم للجميع</h3><span class="tag">للأوائل شرف</span></div>${body}</div>`;
}

function dayCard(T) {
  return `<div class="today"><span class="av gold" style="--z:84px"><img src="${T.s.portrait}" alt=""${T.s.wide ? ' class="wd"' : ''}></span>
    <div><small>عالم اليوم</small><h2>${T.s.name}</h2><p>${T.s.field}</p></div>
    <div class="reset"><small>يتجدد بعد</small><b class="cd">${clock(secsLeft())}</b><small>منتصف الليل بتوقيت القاهرة</small></div></div>`;
}

/* ===== الصفحة ===== */
function page() {
  shell('daily'); document.title = 'تحدي اليوم — الخوارزمي';
  $('#app').innerHTML = '<section class="sec dly"><div class="wrap"><div class="st"><h1>تحدي اليوم</h1><p>سؤال كل يوم عن عالم من علمائنا. أجب لتُشعل شعلتك، وكن من أوائل ثلاثة على لوحة الشرف.</p><div class="orn"></div></div><div id="dl"></div></div></section>';
  $('#dl').onclick = click; paintAll();
}
function renderPage() {
  const el = $('#dl'); if (!el) return;
  const T = info(todayKey()), me = K.me();
  el.innerHTML = `${dayCard(T)}${honor(T, true)}<div class="dgrid">${streakCard(T, me)}${globalCard(T, me)}</div>
    <p class="rm dnote">الشعلة تشتعل بإجابة صحيحة عن سؤال عشوائي، وتنطفئ عند منتصف الليل، وإن فاتك يوم تعود إلى الصفر. سؤال اليوم العام واحد للجميع، ومن يجب صحيحاً من الثلاثة الأوائل يدخل لوحة الشرف ويحصل على عملات إضافية.</p>`;
}

async function click(e) {
  const b = e.target.closest('[data-sq],[data-gc],[data-nx]'); if (!b || BUSY) return;
  const T = info(todayKey()), me = K.me(); if (!me) return;
  if (b.dataset.nx) { nextSQ(T); return paintAll(); }
  if (b.dataset.sq !== undefined) {
    if (!SQ || SQ.pick >= 0) return;
    const i = +b.dataset.sq; SQ.pick = i; paintAll();
    if (!SQ.opts[i].ok) return;
    BUSY = true; const f = fireNow(me), n = f.risk ? f.n + 1 : 1, k = T.key;
    const ok = await K.commit(null, K.REW.FIRE[0], K.REW.FIRE[1], 'أشعل شعلة اليوم', { fire: n, fireDay: k }, `اشتعلت شعلتك! ${dayWord(n)} متتالية · +${AR(K.REW.FIRE[0])} نقطة · +${AR(K.REW.FIRE[1])} عملة`);
    BUSY = false; if (!ok) { SQ.pick = -1; paintAll(); } else { const el = $('.fire'); el && el.classList.add('spark'); }
    return;
  }
  if (b.dataset.gc !== undefined) {
    if (me.chDay === T.key) return;
    const i = +b.dataset.gc, ok = T.opts[i].ok; GPICK = i; BUSY = true; paintAll();
    let rank = 0;
    if (ok) {
      try {
        const F = K.F(), db = K.db(), uid = K.auth().uid, r = F.doc(db, 'daily', T.key);
        await F.runTransaction(db, async tx => {
          const s = await tx.get(r), d = s.exists() ? s.data() : { u: [], n: [], p: [] };
          if (d.u.includes(uid) || d.u.length >= 3) return;
          const nd = { u: [...d.u, uid], n: [...d.n, me.name], p: [...d.p, me.pfp], t: F.serverTimestamp() };
          s.exists() ? tx.update(r, nd) : tx.set(r, nd); rank = nd.u.length;
        });
      } catch (x) { console.error(x); toast('تعذّر تسجيلك على لوحة الشرف الآن.'); }
    }
    const R = K.REW, bonus = rank ? R.HON[rank - 1] : 0;
    const note = !ok ? 'إجابة غير صحيحة. يتجدد التحدي عند منتصف الليل.' : rank ? `أنت رقم ${AR(rank)} على لوحة الشرف! +${AR(R.CHAL[0])} نقطة · +${AR(R.CHAL[1] + bonus)} عملة` : `إجابة صحيحة! +${AR(R.CHAL[0])} نقطة · +${AR(R.CHAL[1])} عملة`;
    await K.commit(null, ok ? R.CHAL[0] : 0, ok ? R.CHAL[1] + bonus : 0, ok ? 'تحدي اليوم: إجابة صحيحة' : 'تحدي اليوم', { chDay: T.key, chOk: ok, chWins: (me.chWins || 0) + (rank ? 1 : 0) }, note);
    BUSY = false; paintAll();
  }
}

/* ===== الشارة في الشريط العلوي وبانر الرئيسية ===== */
function chipHtml() { const f = fireNow(K.me()); return `<a class="fch ${f.lit ? 'is-on' : 'is-off'}" href="daily.html" aria-label="${f.lit ? 'شعلتك مشتعلة' : 'شعلتك مطفأة'}، تحدي اليوم" title="${f.lit ? 'شعلتك مشتعلة' : 'أشعل شعلتك اليوم'}">${f.lit ? FL_ON : FL_OFF}${f.n ? `<b>${AR(f.n)}</b>` : ''}</a>`; }
function paintChip() { const c = $('.fch'); if (c) c.outerHTML = chipHtml(); }
function paintHome() { const h = $('#hon-home'); if (h) h.innerHTML = honor(info(todayKey()), false); }
function paintAll() { watch(); paintChip(); paintHome(); renderPage(); }

{ const s0 = shell; shell = function (p) { s0(p); const t = $('.tools'); if (t && !$('.fch')) t.insertAdjacentHTML('afterbegin', chipHtml()); }; }
{ const h0 = PAGES.home; PAGES.home = () => { h0(); const a = $('#scholars'); if (a && !$('#hon-home')) { a.insertAdjacentHTML('beforebegin', '<div id="hon-home"></div>'); paintHome(); } }; }
PAGES.daily = page;
K.on(paintAll);

/* عدّاد منتصف الليل: يحدّث الأرقام كل ثانية، وعند تغيّر اليوم يعيد بناء كل شيء */
let LAST = todayKey();
setInterval(() => {
  const k = todayKey();
  if (k !== LAST) { LAST = k; SQ = null; GPICK = -1; paintAll(); return; }
  const t = clock(secsLeft()); $$('.cd').forEach(e => e.textContent = t);
}, 1000);

window.KHD = { fireNow, todayKey, info, stat: me => { const f = fireNow(me); return `<span class="fst">${f.lit ? FL_ON : FL_OFF}${AR(f.n)}</span>`; } };
})();
