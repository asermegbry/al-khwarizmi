/* الخوارزمي 5.0 — الحساب والنقاط والعملات والإنجازات والمتصدرون (Firebase) */
(() => {
const FBC = { apiKey: "AIzaSyAyKYLerz0uFIAuK8ik5FN7Ni0lVvH9-HM", authDomain: "al-khwarizmi-41ee9.firebaseapp.com", projectId: "al-khwarizmi-41ee9", storageBucket: "al-khwarizmi-41ee9.firebasestorage.app", messagingSenderId: "558553076061", appId: "1:558553076061:web:7fcd540f59ae63e98b58b4" };
/* كل القيم هنا (غير نهائية). إن غيّرت PRICE غيّره أيضاً في firestore.rules */
const REW = { PTS: 10, COIN: 5, READ: [30, 15], BADGE: [50, 25], PRICE: 750, DAILY: 25, FIRE: [10, 5], CHAL: [25, 10], HON: [25, 15, 10], VER: '13.1.0' };
const TITLES = ['مبتدئ', 'طالب علم', 'متعلّم', 'باحث', 'دارس', 'مفكّر', 'عالم', 'حكيم'];
const lvOf = p => Math.floor(Math.sqrt(p / 50)) + 1, lvAt = l => 50 * (l - 1) * (l - 1);
const cnt = (d, p) => Object.keys(d).filter(k => k.startsWith(p)).length;
const BADGES = [
  ...SCHOLARS.map(s => ({ id: 'm-' + s.id, t: 'خبير ' + s.name, d: `احصل على ٥ من ٦ أو أكثر في اختبار ${s.name}.`, img: s.portrait, ok: m => (m.done['q:' + s.id] || 0) >= 5 })),
  { id: 'first', t: 'الخطوة الأولى', d: 'أنهِ أول اختبار أو لعبة.', art: 'inkwell', ok: m => cnt(m.done, 'q:') + cnt(m.done, 'g:') > 0 },
  { id: 'perfect', t: 'علامة كاملة', d: 'احصل على علامة كاملة في أي اختبار أو لعبة.', art: 'stars', ok: m => cnt(m.done, 'pf:') > 0 },
  { id: 'quizzes', t: 'طالب العلم', d: 'أنهِ اختبار كل العلماء الثمانية.', art: 'astrolabe', ok: m => cnt(m.done, 'q:') >= 8 },
  { id: 'read3', t: 'قارئ نهم', d: 'أنهِ قراءة ثلاثة علماء.', art: 'numerals', ok: m => cnt(m.done, 'r:') >= 3 },
  { id: 'readall', t: 'ابن المكتبة', d: 'أنهِ قراءة العلماء الثمانية.', art: 'arcade', ok: m => cnt(m.done, 'r:') >= 8 },
  { id: 'games', t: 'لاعب ماهر', d: 'العب خمس ألعاب مختلفة.', art: 'compass', ok: m => cnt(m.done, 'g:') >= 5 },
  { id: 'streak', t: 'نار المثابرة', d: 'أبقِ شعلتك مشتعلة سبعة أيام متتالية.', art: 'flame', ok: m => (m.fire || 0) >= 7 },
  { id: 'fire30', t: 'شعلة لا تنطفئ', d: 'أبقِ شعلتك مشتعلة ثلاثين يوماً متتالية.', art: 'lantern', ok: m => (m.fire || 0) >= 30 },
  { id: 'honor', t: 'وسام الشرف', d: 'كن من أوائل ثلاثة يجيبون صحيحاً في تحدي اليوم.', art: 'rosette', ok: m => (m.chWins || 0) >= 1 },
  { id: 'k1', t: 'ألف نقطة', d: 'اجمع ألف نقطة.', art: 'geometry', ok: m => m.points >= 1000 }
];
const ERR = { 'auth/invalid-credential': 'البريد أو كلمة المرور غير صحيحة.', 'auth/email-already-in-use': 'هذا البريد مسجّل من قبل.', 'auth/weak-password': 'كلمة المرور ضعيفة (٦ أحرف على الأقل).', 'auth/invalid-email': 'البريد غير صالح.', 'auth/network-request-failed': 'لا يوجد اتصال بالإنترنت.', 'auth/unauthorized-domain': 'هذا النطاق غير مضاف في Firebase → Authentication → Settings → Authorized domains.', 'auth/operation-not-supported-in-this-environment': 'افتح الموقع عبر http أو https وليس كملف محلي.', 'auth/popup-closed-by-user': '' };

let F = null, auth, db, AUTH, ME = null, FAIL = false, PEND = '', TAB = location.hash.slice(1) || 'board', PER = 'all', AM = 'in', RANK = null, RANKP = -1, unsub = null, nudged = false, making = false;
const LB = {}, FLD = { all: 'points', wk: 'wkP', mo: 'moP' };
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0'), ymd = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => ymd(new Date()), yest = () => { const d = new Date(); d.setDate(d.getDate() - 1); return ymd(d); };
const mo = () => today().slice(0, 7), wk = () => { const d = new Date(); d.setDate(d.getDate() - ((d.getDay() + 1) % 7)); return ymd(d); };
const uref = () => F.doc(db, 'users', AUTH.uid);
const av = (pf, nm, z = 40) => { const s = byId(pf); return s ? `<span class="av${s.id === 'khwarizmi' ? ' gold' : ''}" style="--z:${z}px"><img src="${s.portrait}" alt=""${s.wide ? ' class="wd"' : ''}></span>` : `<span class="av d" style="--z:${z}px">${esc([...nm][0] || '؟')}</span>`; };
const msg = t => `<p class="rm">${t}</p>`;

/* ===== Firebase ===== */
(async () => {
  try {
    const u = `https://www.gstatic.com/firebasejs/${REW.VER}/`, [a, au, fs] = await Promise.all(['app', 'auth', 'firestore'].map(m => import(`${u}firebase-${m}.js`)));
    const app = a.initializeApp(FBC); auth = au.getAuth(app); db = fs.getFirestore(app); F = { ...au, ...fs };
    F.onAuthStateChanged(auth, u => {
      AUTH = u; if (unsub) unsub(); unsub = null; ME = null; RANK = null; RANKP = -1;
      if (!u) return paint();
      unsub = F.onSnapshot(F.doc(db, 'users', u.uid), s => { if (s.exists()) { ME = s.data(); if (RANKP !== ME.points) rank(); paint(); } else mk(u); }, e => { console.error(e); toast('تعذّر قراءة بياناتك. تحقق من قواعد Firestore.'); });
    });
  } catch (e) { console.error(e); FAIL = true; paint(); }
})();
async function mk(u) {
  if (making) return; making = true;
  let n = (PEND || u.displayName || '').trim().slice(0, 20); if ([...n].length < 2) n = 'طالب' + Math.floor(1000 + Math.random() * 9000);
  try { await F.setDoc(uref(), { name: n, points: 0, coins: 0, pfp: 'default', owned: [], done: {}, ach: {}, bd: 0, wkKey: wk(), wkP: 0, moKey: mo(), moP: 0, streak: 0, lastDay: '', fire: 0, fireDay: '', chDay: '', chOk: false, chWins: 0, log: [], t: F.serverTimestamp() }); } catch (e) { console.error(e); toast('تعذّر إنشاء حسابك. تحقق من قواعد Firestore.'); }
  making = false;
}
function rank() { RANKP = ME.points; F.getCountFromServer(F.query(F.collection(db, 'users'), F.where('points', '>', ME.points))).then(s => { RANK = s.data().count + 1; const e = $('#rk'); if (e) e.textContent = '#' + AR(RANK); }).catch(() => { }); }

/* ===== منح النقاط (لا نقاط إلا على التحسّن في النتيجة، فلا فائدة من التكرار) ===== */
let LASTW = 0;
const sleep = ms => new Promise(r => setTimeout(r, ms));
/* extra: حقول إضافية تُكتب مع العملية (الشعلة وتحدي اليوم) — note: نص الإشعار بدل الافتراضي */
async function commit(done, p, c, what, extra = {}, note) {
  const gap = 2300 - (Date.now() - LASTW); if (gap > 0) await sleep(gap);  // قواعد Firestore تشترط فاصل ثانيتين بين العمليات
  const o = ME, day = today(), n = { ...o, done: done || o.done, ...extra };
  n.points = o.points + p; n.coins = o.coins + c;
  n.wkP = (o.wkKey === wk() ? o.wkP : 0) + p; n.wkKey = wk(); n.moP = (o.moKey === mo() ? o.moP : 0) + p; n.moKey = mo();
  if (o.lastDay !== day) { n.lastDay = day; n.coins += REW.DAILY; }
  const nb = BADGES.filter(b => !o.ach[b.id] && b.ok(n));
  if (nb.length) { n.ach = { ...o.ach }; nb.forEach(b => n.ach[b.id] = Date.now()); n.bd = Object.keys(n.ach).length; const bp = nb.length * REW.BADGE[0]; n.points += bp; n.wkP += bp; n.moP += bp; n.coins += nb.length * REW.BADGE[1]; }
  n.log = [{ t: Date.now(), x: what }, ...nb.map(b => ({ t: Date.now(), x: 'إنجاز جديد: ' + b.t })), ...(o.log || [])].slice(0, 8);
  n.t = F.serverTimestamp();
  try {
    await F.updateDoc(uref(), n); LASTW = Date.now();
    toast(note || `+${AR(n.points - o.points)} نقطة · +${AR(n.coins - o.coins)} عملة${nb.length ? ' · 🏅 ' + nb.map(b => b.t).join('، ') : ''}`);
    return true;
  } catch (e) { console.error(e); toast('تعذّر حفظ نقاطك الآن.'); return false; }
}
function nudge() { if (!nudged) { nudged = true; toast('سجّل دخولك من «حسابي» لتحفظ نقاطك وتدخل لوحة المتصدرين'); } }
function hit(id, sc, tot, label) {
  if (!ME) return nudge();
  sc = Math.min(sc, tot, 12); const prev = ME.done[id] || 0, g = Math.max(0, sc - prev), d = { ...ME.done };
  if (sc > prev) d[id] = sc; const pf = sc >= tot && !d['pf:' + id]; if (pf) d['pf:' + id] = 1;
  if (!g && !pf) return toast('تغلّب على أفضل نتيجة لك لتكسب نقاطاً جديدة');
  commit(d, g * REW.PTS, g * REW.COIN, label + ': ' + AR(sc) + ' من ' + AR(tot));
}
const param = k => new URLSearchParams(location.search).get(k);
{ const e0 = endScreen; endScreen = function (root, sc, tot, ...r) { e0(root, sc, tot, ...r); const g = GAMES.find(x => x.id === param('g')); hit('g:' + (g ? g.id : 'x'), sc, tot, g ? g.t : 'لعبة'); }; }
{ const f0 = fin; fin = function (root, sc, tot, ...r) { f0(root, sc, tot, ...r); const s = byId(param('s')); if (s) hit('q:' + s.id, sc, tot, 'اختبار ' + s.name); }; }
{ const r0 = onReadEnd; onReadEnd = function (id) { r0(id); if (!ME) return nudge(); if (ME.done['r:' + id]) return; commit({ ...ME.done, ['r:' + id]: 1 }, REW.READ[0], REW.READ[1], 'قراءة ' + byId(id).name); }; }

/* ===== الشريط العلوي ===== */
NAV.push(['account.html', 'حسابي', 'account'], ['account.html#board', 'المتصدرون', 'board']);
{ const s0 = shell; shell = function (p) { s0(p); const t = $('.tools'); if (t && !$('.rch')) { t.insertAdjacentHTML('afterbegin', '<a class="rch" href="account.html" aria-label="حسابي"></a>'); chip(); } }; }
const chip = () => { const c = $('.rch'); if (c) c.innerHTML = ME ? `${av(ME.pfp, ME.name, 26)}<b>${AR(ME.points)}</b>` : 'دخول'; };
const LIS = [];
function paint() { chip(); if (document.body.dataset.page === 'account') view(); LIS.forEach(f => { try { f(); } catch (e) { console.error(e); } }); }
/* واجهة تستعملها js/daily.js */
window.KHR = { me: () => ME, auth: () => AUTH, F: () => F, db: () => db, fail: () => FAIL, commit, av, esc, REW, on: f => LIS.push(f) };

/* ===== صفحة الحساب ===== */
PAGES.account = () => { shell('account'); document.title = 'حسابي — الخوارزمي'; $('#app').innerHTML = '<section class="sec"><div class="wrap" id="acc"></div></section>'; const el = $('#acc'); el.onclick = click; el.onsubmit = e => { e.preventDefault(); doAuth(e.target); }; view(); };
function view() {
  const el = $('#acc'); if (!el) return;
  if (FAIL) return el.innerHTML = `<div class="rc auth">${msg('تعذّر الاتصال بـ Firebase. تأكد من الإنترنت وافتح الموقع عبر http/https.')}</div>`;
  if (AUTH === undefined || (AUTH && !ME)) return el.innerHTML = msg('جارٍ التحميل…');
  if (!AUTH) return el.innerHTML = authHtml();
  const L = lvOf(ME.points), a = lvAt(L), b = lvAt(L + 1), nb = Object.keys(ME.ach).length;
  const card = (t, v, id) => `<div class="rc"><small>${t}</small><b${id ? ` id="${id}"` : ''}>${v}</b></div>`;
  el.innerHTML = `<div class="rh"><div><h1>أهلاً، ${esc(ME.name)}.</h1><p class="rl">أنت في المستوى ${AR(L)}: <b>${TITLES[Math.min(L - 1, 7)]}</b></p><p class="rs">${AR(b - ME.points)} نقطة تفصلك عن المستوى ${AR(L + 1)}.</p></div>
    <div class="rc prog"><div class="pl"><span>تقدّم المستوى ${AR(L + 1)}</span><b>${AR(ME.points - a)} / ${AR(b - a)}</b></div><div class="pb"><i style="width:${Math.round((ME.points - a) / (b - a) * 100)}%"></i></div><button class="lnk" data-out="1">تسجيل الخروج</button></div></div>
    <div class="rstats">${card('مجموع النقاط', AR(ME.points))}${card('العملات', AR(ME.coins))}${card('الترتيب العام', RANK ? '#' + AR(RANK) : '…', 'rk')}${card('شعلة المثابرة', window.KHD ? KHD.stat(ME) : AR(ME.fire || 0))}</div>
    <div class="rtabs">${[['board', 'المتصدرون'], ['badges', `الإنجازات ${AR(nb)}/${AR(BADGES.length)}`], ['shop', 'المتجر']].map(([k, t]) => `<button class="${k === TAB ? 'on' : ''}" data-tab="${k}">${t}</button>`).join('')}</div><div id="pane"></div>`;
  pane();
}
function pane() {
  const p = $('#pane'); if (!p || !ME) return;
  if (TAB === 'badges') return p.innerHTML = `<div class="bgs">${BADGES.map(b => `<div class="bg${ME.ach[b.id] ? '' : ' lk'}"><div class="hex"><i class="${b.img ? '' : 'ar'}" style="background-image:url(${b.img || ART(b.art)})"></i></div><h3>${b.t}</h3><p>${b.d}</p></div>`).join('')}</div><p class="rm">كل إنجاز يمنحك ${AR(REW.BADGE[0])} نقطة و${AR(REW.BADGE[1])} عملة مرة واحدة.</p>`;
  if (TAB === 'shop') {
    const sc = s => { const own = ME.owned.includes(s.id), g = s.id === 'khwarizmi'; return `<div class="rc sh${g ? ' gold' : ''}">${av(s.id, '', g ? 110 : 84)}<div class="shi">${g ? '<span class="rib">العالم الأول ★</span>' : ''}<h3>${s.name}</h3>${g ? '<p>صورة ذهبية خاصة لمؤسس علم الجبر.</p>' : ''}${ME.pfp === s.id ? '<span class="tag">مستخدمة</span>' : own ? `<button class="btn alt" data-use="${s.id}">استخدمها</button>` : `<button class="btn${g ? ' gl' : ''}" data-buy="${s.id}"${ME.coins < REW.PRICE ? ' disabled' : ''}>اشترِ · ${AR(REW.PRICE)}</button>`}</div></div>`; };
    return p.innerHTML = `<p class="rm">اشترِ صورة عالم لحسابك بـ ${AR(REW.PRICE)} عملة (السعر نفسه لكل الصور). عملاتك: <b>${AR(ME.coins)}</b>. تحصل أيضاً على ${AR(REW.DAILY)} عملة مكافأة عند أول نشاط كل يوم.</p><div class="shop">${sc(byId('khwarizmi'))}<div class="rc sh">${av('default', ME.name, 84)}<div class="shi"><h3>الصورة العادية</h3>${ME.pfp === 'default' ? '<span class="tag">مستخدمة</span>' : '<button class="btn alt" data-use="default">استخدمها</button>'}</div></div>${SCHOLARS.filter(x => x.id !== 'khwarizmi').map(sc).join('')}</div>`;
  }
  const rows = LB[PER] && LB[PER].rows, f = FLD[PER];
  const per = `<div class="pt">${[['all', 'كل الوقت'], ['wk', 'أسبوعي'], ['mo', 'شهري']].map(([k, t]) => `<button class="${k === PER ? 'on' : ''}" data-per="${k}">${t}</button>`).join('')}</div>`;
  const act = `<div class="rc"><h3>آخر نشاط</h3>${(ME.log || []).length ? ME.log.map(l => `<p class="lg">${esc(l.x)}<small>${new Date(l.t).toLocaleDateString('ar-EG')}</small></p>`).join('') : msg('ابدأ اختباراً أو لعبة وسيظهر نشاطك هنا.')}</div>`;
  if (!rows) { loadLB(PER).then(pane).catch(e => { console.error(e); $('#pane') && ($('#pane').innerHTML = msg('تعذّر تحميل المتصدرين.')); }); return p.innerHTML = msg('جارٍ تحميل المتصدرين…'); }
  const val = PER === 'all' ? ME.points : (ME[PER === 'wk' ? 'wkKey' : 'moKey'] === (PER === 'wk' ? wk() : mo()) ? ME[f] : 0);
  const row = (i, r, me) => `<div class="lbr${me ? ' me' : ''}"><span class="rk r${i}">${i ? AR(i) : '—'}</span><span class="who">${av(r.pfp, r.name, 34)}${esc(r.name)}${me ? ' (أنت)' : ''}</span><b>${AR(me ? val : r[f] || 0)}</b><span>${AR(r.bd || 0)}</span></div>`;
  const mi = rows.findIndex(r => r.id === AUTH.uid);
  p.innerHTML = `<div class="rgrid"><div class="rc"><div class="lbh"><h3>لوحة المتصدرين</h3>${per}</div><div class="lbr hd2"><span>الترتيب</span><span>الطالب</span><span>النقاط</span><span>الإنجازات</span></div>${rows.slice(0, 10).map((r, i) => row(i + 1, r, r.id === AUTH.uid)).join('') || msg('لا أحد بعد. كن الأول!')}${mi < 10 ? '' : row(mi < 0 ? 0 : mi + 1, ME, true)}</div>${act}</div>`;
}
async function loadLB(k) {
  if (LB[k] && Date.now() - LB[k].t < 30000) return; const f = FLD[k];
  const s = await F.getDocs(F.query(F.collection(db, 'users'), F.orderBy(f, 'desc'), F.limit(100)));
  let rows = s.docs.map(d => ({ id: d.id, ...d.data() }));
  if (k === 'wk') rows = rows.filter(r => r.wkKey === wk()); if (k === 'mo') rows = rows.filter(r => r.moKey === mo());
  LB[k] = { t: Date.now(), rows: rows.filter(r => (r[f] || 0) > 0) };
}
function click(e) {
  const b = e.target.closest('[data-tab],[data-per],[data-buy],[data-use],[data-out],[data-am],#gg,#fp'); if (!b) return;
  const d = b.dataset;
  if (d.tab) { TAB = d.tab; history.replaceState(null, '', '#' + TAB); view(); }
  else if (d.per) { PER = d.per; pane(); }
  else if (d.am) { AM = d.am; view(); }
  else if (d.out) F.signOut(auth);
  else if (d.buy) { if (ME.coins >= REW.PRICE && !ME.owned.includes(d.buy)) F.updateDoc(uref(), { coins: ME.coins - REW.PRICE, owned: [...ME.owned, d.buy], pfp: d.buy, t: F.serverTimestamp() }).then(() => toast('صورة جديدة: ' + byId(d.buy).name)).catch(() => toast('تعذّر الشراء')); }
  else if (d.use) F.updateDoc(uref(), { pfp: d.use, t: F.serverTimestamp() }).catch(() => toast('تعذّر التغيير'));
  else if (b.id === 'gg') F.signInWithPopup(auth, new F.GoogleAuthProvider()).catch(x => { const er = $('#er'); if (er) er.textContent = ERR[x.code] ?? ('تعذّر الأمر: ' + x.code); });
  else if (b.id === 'fp') { const m = $('[name=e]').value.trim(), er = $('#er'); if (!m) return er.textContent = 'اكتب بريدك أولاً.'; F.sendPasswordResetEmail(auth, m).then(() => er.textContent = 'أرسلنا رابط إعادة التعيين إلى بريدك.').catch(x => er.textContent = ERR[x.code] || 'تعذّر الإرسال.'); }
}
function authHtml() {
  const su = AM === 'su';
  return `<div class="rc auth"><div class="pt"><button class="${su ? '' : 'on'}" data-am="in">دخول</button><button class="${su ? 'on' : ''}" data-am="su">حساب جديد</button></div>
  <form>${su ? '<label>اسم العرض (يظهر في لوحة المتصدرين)<input name="n" maxlength="20" minlength="2" required autocomplete="nickname"></label>' : ''}<label>البريد الإلكتروني<input type="email" name="e" required dir="ltr" autocomplete="email"></label><label>كلمة المرور<input type="password" name="p" required minlength="6" dir="ltr" autocomplete="${su ? 'new-password' : 'current-password'}"></label><p class="er" id="er"></p><button class="btn">${su ? 'إنشاء الحساب' : 'دخول'}</button></form>
  <button class="btn alt" id="gg">المتابعة مع Google</button>${su ? '' : '<button class="lnk" id="fp">نسيت كلمة المرور؟</button>'}${msg('احفظ نقاطك وعملاتك وإنجازاتك وتنافس في لوحة المتصدرين.')}</div>`;
}
async function doAuth(f) {
  const v = Object.fromEntries(new FormData(f)), er = $('#er'); er.textContent = '';
  try { if (AM === 'su') { PEND = v.n; await F.createUserWithEmailAndPassword(auth, v.e, v.p); } else await F.signInWithEmailAndPassword(auth, v.e, v.p); }
  catch (x) { er.textContent = ERR[x.code] ?? ('تعذّر الأمر: ' + (x.code || x.message)); }
}
})();
