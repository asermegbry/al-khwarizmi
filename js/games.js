/* الخوارزمي 4.1.1 — الألعاب */
const shuf = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const wait = ms => new Promise(r => setTimeout(r, ms));
function confetti(root) {
  if (matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const cols = ['#b88a2e', '#1d5fbf', '#6aa5ff', '#e0b45a', '#2e9e5b'];
  for (let i = 0; i < 46; i++) { const s = document.createElement('i'); s.className = 'confetti'; s.style.cssText = `left:${Math.random() * 100}%;background:${cols[i % 5]};--t:${(1.8 + Math.random() * 1.6).toFixed(2)}s;--dl:${(Math.random() * .6).toFixed(2)}s;--dx:${Math.round(Math.random() * 120 - 60)}px;--rt:${Math.round(Math.random() * 900)}deg`; root.firstElementChild.appendChild(s); }
}
function endScreen(root, score, total, replay, msg) {
  const pct = score / total;
  const m = msg || (pct === 1 ? 'ممتاز! علامة كاملة.' : pct >= .6 ? 'أحسنت! نتيجة جيدة.' : 'حاول مرة أخرى، ستتحسن.');
  root.innerHTML = `<div class="end"><h2>انتهت اللعبة</h2><div class="big">${AR(score)} / ${AR(total)}</div><p>${m}</p>
    <p style="margin-top:18px"><button class="btn" id="again">العب مرة أخرى</button> <a class="btn alt" href="games.html">كل الألعاب</a></p></div>`;
  $('#again').onclick = replay;
  if (pct >= .6) confetti(root);
}
function bar(root, a, b) { return `<div class="bar"><span>${a}</span><span>${b}</span></div>`; }

/* ---- محرك الاختبارات ---- */
function runQuiz(root, qs, onEnd) {
  let i = 0, score = 0;
  const start = () => { i = 0; score = 0; show(); };
  function show() {
    if (i >= qs.length) return onEnd ? onEnd(score, qs.length, start) : endScreen(root, score, qs.length, start);
    const q = qs[i], mo = q.o.map((t, k) => ({ t, ok: k === (q.a || 0) })), opts = q.fix ? mo : shuf(mo);
    root.innerHTML = `${bar(root, `السؤال <b>${AR(i + 1)}</b> من ${AR(qs.length)}`, `النتيجة <b>${AR(score)}</b>`)}
      <div class="q">${q.q}</div><div class="opts">${opts.map((o, k) => `<button class="opt" data-k="${k}">${o.t}</button>`).join('')}</div><div class="fb"></div>`;
    $$('.opt', root).forEach(b => b.onclick = async () => {
      const o = opts[+b.dataset.k]; $$('.opt', root).forEach(x => { x.disabled = true; if (opts[+x.dataset.k].ok) x.classList.add('ok'); });
      if (o.ok) { score++; $('.fb', root).textContent = 'إجابة صحيحة!'; } else { b.classList.add('no'); $('.fb', root).textContent = 'ليست الإجابة الصحيحة. الصحيح: ' + opts.find(x => x.ok).t; }
      await wait(o.ok ? 1000 : 1900); i++; show();
    });
  }
  start();
}
const Q_BIRUNI = [
  { q: 'في أي سنة وُلد البيروني؟', o: ['٩٧٣م', '٨٧٣م', '١٠٧٣م', '٩٠٣م'] },
  { q: 'بماذا قاس البيروني نصف قطر الأرض؟', o: ['بارتفاع جبل وزاوية انخفاض الأفق', 'بسفينة حول العالم', 'بقياس ظل عصا فقط', 'بالنظر إلى القمر'] },
  { q: 'إلى أي بلد سافر البيروني وتعلّم لغته؟', o: ['الهند', 'الصين', 'مصر', 'الأندلس'] },
  { q: 'أي هذه الكتب من تأليف البيروني؟', o: ['الآثار الباقية عن القرون الخالية', 'كتاب المناظر', 'القانون في الطب', 'نزهة المشتاق'] },
  { q: 'في أي إقليم وُلد البيروني؟', o: ['خوارزم', 'مصر', 'الأندلس', 'الحجاز'] },
  { q: 'ما الأداة التي يستخدمها الفلكيون لقياس ارتفاع النجوم؟', o: ['الأسطرلاب', 'الميزان', 'المجهر', 'البوصلة فقط'] }
];
const Q_ALL = [
  { q: 'كلمة «الجبر» جاءت من كتاب أي عالم؟', o: ['الخوارزمي', 'الرازي', 'الفارابي', 'المقريزي'] },
  { q: 'من وضع «الكتاب الروجري» (نزهة المشتاق)؟', o: ['الإدريسي', 'ابن سينا', 'البيروني', 'ابن الهيثم'] },
  { q: 'من لُقّب بـ«المعلّم الثاني»؟', o: ['الفارابي', 'الإدريسي', 'الرازي', 'الخوارزمي'] },
  { q: 'من كتب «كتاب المناظر» في البصريات؟', o: ['ابن الهيثم', 'البيروني', 'ابن سينا', 'المقريزي'] },
  { q: 'مؤلف «القانون في الطب» هو:', o: ['ابن سينا', 'الرازي', 'الفارابي', 'الإدريسي'] },
  { q: 'مؤلف «المواعظ والاعتبار بذكر الخطط والآثار» هو:', o: ['المقريزي', 'البيروني', 'الخوارزمي', 'ابن سينا'] },
  { q: 'من وصف الجدري والحصبة وصفاً دقيقاً فرّق فيه بينهما؟', o: ['الرازي', 'ابن الهيثم', 'الفارابي', 'البيروني'] },
  { q: 'من اسم أي عالم جاءت كلمة Algorithm؟', o: ['الخوارزمي', 'ابن سينا', 'الإدريسي', 'الرازي'] },
  { q: 'من قاس نصف قطر الأرض بارتفاع جبل وزاوية الأفق؟', o: ['البيروني', 'الفارابي', 'المقريزي', 'الرازي'] },
  { q: 'في أي مدينة عاش الإدريسي في بلاط الملك روجر الثاني؟', o: ['باليرمو', 'دمشق', 'بغداد', 'قرطبة'] }
];

const IMPL = {};

/* ---- أسرار الحساب ---- */
IMPL.algebra = root => {
  const N = 10; let i, score, timer, left;
  const mk = k => {
    if (k < 3) { const x = rnd(2, 20), a = rnd(2, 15); return { q: `س + ${AR(a)} = ${AR(x + a)}`, a: x }; }
    if (k < 6) { const x = rnd(2, 12), a = rnd(2, 9); return { q: `${AR(a)} س = ${AR(a * x)}`, a: x }; }
    if (k < 9) { const x = rnd(2, 10), a = rnd(2, 6), b = rnd(1, 9); return { q: `${AR(a)} س + ${AR(b)} = ${AR(a * x + b)}`, a: x }; }
    return { q: 'س² + ١٠ س = ٣٩', a: 3, note: 'مثال الخوارزمي في كتاب الجبر والمقابلة' };
  };
  const start = () => { i = 0; score = 0; next(); };
  function next() {
    clearInterval(timer);
    if (i >= N) return endScreen(root, score, N, start);
    const q = mk(i); let o = new Set([q.a]); while (o.size < 4) { const d = q.a + rnd(-4, 4); if (d > 0 && d !== q.a) o.add(d); }
    const opts = shuf([...o]); left = 15;
    root.innerHTML = `${bar(root, `المسألة <b>${AR(i + 1)}</b> من ${AR(N)}`, `النتيجة <b>${AR(score)}</b>`)}<div class="timer"><i></i></div>
      <div class="q">أوجد قيمة س: <br><span dir="rtl">${q.q}</span></div><div class="opts">${opts.map(v => `<button class="opt" data-v="${v}">${AR(v)}</button>`).join('')}</div><div class="fb">${q.note || ''}</div>`;
    const t = $('.timer i', root); requestAnimationFrame(() => { t.style.transitionDuration = '15s'; t.style.width = '0'; });
    const done = async (v, btn) => {
      clearInterval(timer); $$('.opt', root).forEach(x => { x.disabled = true; if (+x.dataset.v === q.a) x.classList.add('ok'); });
      if (v === q.a) { score++; $('.fb', root).textContent = 'صحيح!'; } else { btn && btn.classList.add('no'); $('.fb', root).textContent = `الإجابة الصحيحة: ${AR(q.a)}`; }
      await wait(1200); i++; next();
    };
    $$('.opt', root).forEach(b => b.onclick = () => done(+b.dataset.v, b));
    timer = setInterval(() => { if (--left <= 0) done(null); }, 1000);
  }
  start();
};

/* ---- أين هذه الدولة ---- */
IMPL.countries = root => {
  const D = [['egypt', 'مصر'], ['brazil', 'البرازيل'], ['france', 'فرنسا'], ['hungary', 'المجر'], ['italy', 'إيطاليا'], ['morocco', 'المغرب']];
  const extra = ['إسبانيا', 'ألمانيا', 'السودان', 'الأرجنتين', 'بولندا', 'الجزائر', 'اليونان', 'كولومبيا'];
  let i, score, order;
  const start = () => { order = shuf(D); i = 0; score = 0; show(); };
  function show() {
    if (i >= order.length) return endScreen(root, score, order.length, start);
    const [f, name] = order[i], names = shuf([name, ...shuf(extra).slice(0, 3)]);
    root.innerHTML = `${bar(root, `الخريطة <b>${AR(i + 1)}</b> من ${AR(order.length)}`, `النتيجة <b>${AR(score)}</b>`)}
      <div class="q">أين تقع النقطة الحمراء؟ أي دولة هذه؟</div><div class="mapbox"><img src="img/${f}.jpg" alt="خريطة بها نقطة حمراء"></div>
      <div class="opts">${names.map(n => `<button class="opt">${n}</button>`).join('')}</div><div class="fb"></div>`;
    $$('.opt', root).forEach(b => b.onclick = async () => {
      $$('.opt', root).forEach(x => { x.disabled = true; if (x.textContent === name) x.classList.add('ok'); });
      if (b.textContent === name) { score++; $('.fb', root).textContent = 'صحيح!'; } else { b.classList.add('no'); $('.fb', root).textContent = `الإجابة: ${name}`; }
      await wait(1200); i++; show();
    });
  }
  start();
};

/* ---- نغمات الفارابي ---- */
IMPL.music = root => {
  const N = [['دو', 261.63, '#1d5fbf'], ['ري', 293.66, '#b88a2e'], ['مي', 329.63, '#0e2a55'], ['صول', 392, '#3d8bd9']];
  let ctx, seq, step, busy, goal = 8;
  const tone = f => { try { ctx = ctx || new (window.AudioContext || window.webkitAudioContext)(); const o = ctx.createOscillator(), g = ctx.createGain(); o.type = 'triangle'; o.frequency.value = f; g.gain.setValueAtTime(.001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(.4, ctx.currentTime + .02); g.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .6); o.connect(g).connect(ctx.destination); o.start(); o.stop(ctx.currentTime + .65); } catch (e) { } };
  const flash = async k => { const p = $$('.pad', root)[k]; p.classList.add('lit'); tone(N[k][1]); await wait(380); p.classList.remove('lit'); await wait(120); };
  const draw = (msg, score) => {
    root.innerHTML = `${bar(root, `الجولة <b>${AR(seq.length || 0)}</b> من ${AR(goal)}`, `استمع ثم كرّر`)}<div class="pads">${N.map((n, k) => `<button class="pad" style="background:${n[2]}" data-k="${k}" ${busy ? 'disabled' : ''}>${n[0]}</button>`).join('')}</div><div class="fb">${msg}</div>`;
    $$('.pad', root).forEach(p => p.onclick = () => press(+p.dataset.k));
  };
  async function play() {
    busy = true; step = 0; draw('استمع جيداً...'); await wait(600);
    for (const k of seq) await flash(k);
    busy = false; draw('دورك الآن'); $$('.pad', root).forEach(p => p.disabled = false);
  }
  async function press(k) {
    if (busy) return; busy = true; await flash(k);
    if (seq[step] !== k) { endScreen(root, seq.length - 1, goal, start, 'أخطأت في الترتيب. حاول مرة أخرى.'); return; }
    step++; busy = false;
    if (step === seq.length) { if (seq.length === goal) return endScreen(root, goal, goal, start, 'ما شاء الله! أتممت كل الجولات.'); seq.push(rnd(0, 3)); await wait(500); play(); }
  }
  function start() { seq = [rnd(0, 3)]; busy = false; root.innerHTML = `<div class="end"><h2>نغمات الفارابي</h2><p>ستسمع نغمات، وعليك تكرارها بالترتيب نفسه. كل جولة تضيف نغمة جديدة.</p><p style="margin-top:16px"><button class="btn" id="go">ابدأ</button></p></div>`; $('#go').onclick = play; }
  start();
};

/* ---- الغرفة المظلمة ---- */
IMPL.camera = root => {
  const L = [{ b: 4, br: 45 }, { b: 2.5, br: 50 }, { b: 1.5, br: 55 }]; let lv = 0, score = 0;
  const blur = (h, d) => h * d / 160, bright = (h, d) => Math.min(100, 100 * h * h / (h * h + d * d / 400));
  function level() {
    if (lv >= L.length) return endScreen(root, score, L.length, () => { lv = 0; score = 0; level(); }, 'أتممت كل المستويات!');
    const T = L[lv];
    root.innerHTML = `${bar(root, `المستوى <b>${AR(lv + 1)}</b> من ${AR(L.length)}`, `الهدف: وضوح عالٍ وإضاءة كافية`)}
    <div class="cam"><svg viewBox="0 0 560 260" aria-label="غرفة مظلمة بثقب صغير">
      <defs><filter id="bl"><feGaussianBlur id="gb" stdDeviation="0"/></filter></defs>
      <line x1="48" y1="170" x2="48" y2="100" stroke="#b88a2e" stroke-width="6" stroke-linecap="round"/><path d="M36 114 L48 94 L60 114" stroke="#b88a2e" stroke-width="6" fill="none" stroke-linecap="round"/>
      <rect id="bx" x="170" y="40" width="240" height="180" rx="4" fill="#ecd9a8" fill-opacity=".4" stroke="#0e2a55" stroke-width="5"/>
      <line id="hole" x1="170" y1="128" x2="170" y2="132" stroke="#fff" stroke-width="8"/>
      <g id="img" filter="url(#bl)"><line id="il" x1="410" y1="110" x2="410" y2="150" stroke="#b88a2e" stroke-width="6" stroke-linecap="round"/><path id="ih" d="" stroke="#b88a2e" stroke-width="6" fill="none" stroke-linecap="round"/></g></svg>
      <div class="rng"><label>حجم الثقب: <span id="hv"></span></label><input id="h" type="range" min="1" max="20" step=".5" value="14"></div>
      <div class="rng"><label>بُعد الجدار: <span id="dv"></span></label><input id="d" type="range" min="40" max="200" step="5" value="180"></div>
      <div class="meter"><span>التشويش: <b id="mb"></b> (المطلوب ≤ ${AR(T.b)})</span><span>الإضاءة: <b id="mr"></b>٪ (المطلوب ≥ ${AR(T.br)})</span></div><div class="fb" id="st">حرّك المنزلقين حتى تتحقق الشروط.</div></div>`;
    const h = $('#h'), d = $('#d'); let fin = false;
    const upd = () => {
      const hv = +h.value, dv = +d.value, bl = blur(hv, dv), br = bright(hv, dv), w = 100 + dv * 1.2, x2 = 170 + w;
      $('#bx').setAttribute('width', w); $('#hole').setAttribute('y1', 130 - hv); $('#hole').setAttribute('y2', 130 + hv);
      const hh = dv * .4; $('#il').setAttribute('x1', x2); $('#il').setAttribute('x2', x2); $('#il').setAttribute('y1', 130 - hh / 2); $('#il').setAttribute('y2', 130 + hh / 2);
      $('#ih').setAttribute('d', `M${x2 - 12} ${130 + hh / 2 - 16} L${x2} ${130 + hh / 2 + 4} L${x2 + 12} ${130 + hh / 2 - 16}`);
      $('#gb').setAttribute('stdDeviation', bl); $('#img').style.opacity = Math.max(.12, br / 100);
      $('#hv').textContent = AR(hv); $('#dv').textContent = AR(dv); $('#mb').textContent = AR(bl.toFixed(1)); $('#mr').textContent = AR(Math.round(br));
      if (!fin && bl <= T.b && br >= T.br) { fin = true; score++; $('#st').innerHTML = `ممتاز! صورة واضحة ومضيئة. <button class="btn" id="nx" style="margin-inline-start:10px;padding:6px 20px">${lv + 1 < L.length ? 'المستوى التالي' : 'إنهاء'}</button>`; $('#nx').onclick = () => { lv++; level(); }; }
    };
    h.oninput = d.oninput = upd; upd();
  }
  level();
};

/* ---- ذاكرة ابن سينا ---- */
IMPL.memory = root => {
  const P = [['القانون في الطب', 'مرجع طبي دُرّس قروناً'], ['الشفاء', 'موسوعة في الفلسفة والعلوم'], ['بخارى', 'مدينة نشأته'], ['همذان', 'مدينة وفاته'], ['٩٨٠م', 'سنة ولادته'], ['الإشارات والتنبيهات', 'كتاب في الفلسفة والمنطق']];
  let cards, open, found, moves, lock;
  const start = () => { cards = shuf(P.flatMap((p, k) => [{ k, t: p[0] }, { k, t: p[1] }])); open = []; found = 0; moves = 0; lock = false; draw(); };
  function draw() {
    root.innerHTML = `${bar(root, `المطابقات <b>${AR(found)}</b> من ${AR(P.length)}`, `المحاولات <b>${AR(moves)}</b>`)}<div class="mem">${cards.map((c, i) => `<button class="mc" data-i="${i}">${c.t}</button>`).join('')}</div><div class="fb">اقلب بطاقتين وطابق كل عنوان مع معناه.</div>`;
    $$('.mc', root).forEach(b => b.onclick = async () => {
      const i = +b.dataset.i; if (lock || b.classList.contains('up') || b.classList.contains('done')) return;
      b.classList.add('up'); open.push(i);
      if (open.length === 2) {
        lock = true; moves++; $('.bar span:last-child b', root).textContent = AR(moves); const [a, c] = open;
        if (cards[a].k === cards[c].k) { $$('.mc', root)[a].classList.add('done'); $$('.mc', root)[c].classList.add('done'); found++; $('.bar span b', root).textContent = AR(found); }
        else { await wait(900); $$('.mc', root)[a].classList.remove('up'); $$('.mc', root)[c].classList.remove('up'); }
        open = []; lock = false;
        if (found === P.length) { await wait(700); endScreen(root, Math.max(1, P.length * 2 - Math.max(0, moves - P.length)), P.length * 2, start, `أنهيت اللعبة في ${AR(moves)} محاولة.`); }
      }
    });
  }
  start();
};

/* ---- خطط القاهرة: ترتيب الأحداث ---- */
IMPL.timeline = root => {
  const E = [{ t: 'فتح عمرو بن العاص لمصر', y: 641 }, { t: 'تأسيس مدينة القاهرة', y: 969 }, { t: 'بناء الجامع الأزهر', y: 972 }, { t: 'قيام الدولة الأيوبية على يد صلاح الدين', y: 1171 }, { t: 'بداية حكم المماليك', y: 1250 }, { t: 'ولادة المقريزي', y: 1364 }];
  let pool, placed, miss;
  const start = () => { pool = shuf(E); placed = []; miss = 0; draw(''); };
  function draw(msg) {
    const sorted = [...E].sort((a, b) => a.y - b.y);
    root.innerHTML = `${bar(root, `رتّب الأحداث من الأقدم إلى الأحدث`, `الأخطاء <b>${AR(miss)}</b>`)}
      <div class="tl">${sorted.map((e, k) => { const p = placed[k]; return `<div class="slot ${p ? 'f' : ''}"><em>${AR(k + 1)}</em>${p ? `${p.t} <span style="margin-inline-start:auto;color:var(--gold-t)">${AR(p.y)}م</span>` : ''}</div>`; }).join('')}</div>
      <div class="pool">${pool.map((e, k) => `<button class="chip" data-k="${k}">${e.t}</button>`).join('')}</div><div class="fb">${msg}</div>`;
    $$('.chip', root).forEach(b => b.onclick = () => {
      const e = pool[+b.dataset.k], nextE = sorted[placed.length];
      if (e === nextE) { placed.push(e); pool.splice(+b.dataset.k, 1); if (placed.length === E.length) { endScreen(root, Math.max(0, E.length - miss), E.length, start, 'رتّبت تاريخ مصر كما رتّبه المؤرخون!'); return; } draw('صحيح!'); }
      else { miss++; draw('ليس الآن. فكّر: ما الحدث الأقدم بين الباقي؟'); }
    });
  }
  start();
};

/* ---- الشطرنج ---- */
IMPL.chess = root => { root.innerHTML = `<iframe class="frame" src="games/chess.html" title="شطرنج الرازي"></iframe>`; root.parentElement.style.maxWidth = '1000px'; root.style.padding = '0'; };
IMPL['quiz-biruni'] = root => runQuiz(root, Q_BIRUNI);
IMPL['quiz-all'] = root => runQuiz(root, Q_ALL);

function playPage() {
  const id = new URLSearchParams(location.search).get('g'), g = GAMES.find(x => x.id === id);
  if (!g) { location.replace('games.html'); return; }
  document.title = `${g.t} — الخوارزمي`; shell('games');
  const s = g.who ? byId(g.who) : null;
  $('#app').innerHTML = `<section class="ph2"><div class="wrap"><h1>${g.t}</h1><p>${g.d}</p></div><div class="band"></div></section>
    <section class="wrap"><div class="stage"><div id="game"></div></div>
    <p style="text-align:center;margin-bottom:50px"><a class="btn alt" href="games.html">كل الألعاب</a> ${s ? `<a class="btn alt" href="scholar.html?s=${s.id}">اقرأ عن ${s.name}</a>` : ''}</p></section>`;
  IMPL[id]($('#game'));
}
document.addEventListener('DOMContentLoaded', () => { if (document.body.dataset.page === 'play') playPage(); });
