/* الخوارزمي — محرك الدورات: صفحة المسار + مشغّل الدروس + ٧ أنواع ألغاز */
(() => {
const KEY = 'kh-course', LS = COURSE.lessons;
let P = {}; try { P = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(P)); } catch (e) { } };
const open = i => i === 0 || !!P[LS[i - 1].id];
const stars = n => '★'.repeat(n) + '☆'.repeat(3 - n);

/* ---------- اختيار العالم ---------- */
function picker() {
  shell('course');
  const all = [...SCHOLARS].sort((a, b) => (b.id === 'khwarizmi') - (a.id === 'khwarizmi'));
  $('#app').innerHTML = `<section class="sec"><div class="wrap">${title('الدورات', 'اختر العالم الذي تريد أن تتعلّم معه.')}<div class="k-sg k-pk">${all.map(s => s.id === 'khwarizmi' ? `<a class="k-cc k-sm k-main" href="course.html?c=khwarizmi"><img src="img/portraits/${s.id}.jpg" alt=""><b>${s.name}</b><span>علم الحاسوب</span><em>ابدأ</em></a>` : `<button class="k-cc k-sm" data-soon="${s.name}"><img src="img/portraits/${s.id}.jpg" alt=""><b>${s.name}</b><em>قريباً</em></button>`).join('')}</div></div></section>`;
  $$('[data-soon]').forEach(b => b.onclick = () => toast('دورة ' + b.dataset.soon + ' قريباً'));
}
/* ---------- مقدّمة: الخوارزمي والحاسوب ---------- */
function intro(done) {
  let n = 0; const I = COURSE.intro;
  const draw = () => {
    $('#app').innerHTML = `<section class="sec"><div class="wrap k-cw"><div class="k-ct"><a href="course.html">رجوع</a><div class="k-pb"><i style="width:${n / I.length * 100}%"></i></div></div><div class="k-lc"><h2>${I[n][0]}</h2><p>${I[n][1]}</p><button class="btn" id="nx">${n < I.length - 1 ? 'التالي' : 'ابدأ الدورة'}</button></div></div></section>`;
    $('#nx').onclick = () => { if (++n < I.length) draw(); else { P.intro = 1; save(); done(); } };
  };
  draw();
}
/* ---------- صفحة مسار الدورة ---------- */
function home() {
  shell('course');
  const done = LS.filter(l => P[l.id]).length, O = [0, 1, 2, 1, 0, -1, -2, -1];
  $('#app').innerHTML = `<section class="sec"><div class="wrap"><p><a href="course.html">كل الدورات</a></p>
  <div class="k-cc k-main"><img src="img/portraits/khwarizmi.jpg" alt=""><div><h3>علم الحاسوب</h3><p>من الخوارزمية الأولى إلى فهم الآلة.</p><b>${AR(done)} من ${AR(LS.length)} دروس</b></div></div>
  <p><button class="btn alt" id="in">مقدّمة: الخوارزمي والحاسوب</button></p>
  ${[1, 2].map(ch => `<h3 class="k-chh">${COURSE.chs[ch]}</h3><div class="k-path">${LS.map((l, i) => l.ch !== ch ? '' : open(i) ? `<a class="k-cn${P[l.id] ? ' k-dn' : ''}" href="course.html?l=${l.id}" style="--o:${O[i % 8]}"><span><b>${l.t}</b><em>${P[l.id] ? stars(P[l.id]) : 'ابدأ'}</em></span></a>` : `<div class="k-cn k-lk" style="--o:${O[i % 8]}"><span><b>${l.t}</b><em>مقفل</em></span></div>`).join('')}</div>`).join('')}</div></section>`;
  $('#in').onclick = () => intro(home);
}

/* ---------- مشغّل الدرس ---------- */
function play(id) {
  const i = LS.findIndex(x => x.id === id);
  if (i < 0 || !open(i)) return location.replace('course.html?c=khwarizmi');
  shell('course');
  const L = LS[i], root = $('#app'); let k = -1, mist = 0, hn = 0;
  const frame = h => root.innerHTML = `<section class="sec"><div class="wrap k-cw"><div class="k-ct"><a href="course.html?c=khwarizmi">رجوع</a><div class="k-pb"><i style="width:${Math.max(0, k) / L.puzzles.length * 100}%"></i></div></div>${h}</div></section>`;
  const next = () => {
    k++;
    if (k === 0) { frame(`<div class="k-lc"><div class="k-bg1">${L.ic}</div><h2>${L.learn[0]}</h2><p>${L.learn[1]}</p><button class="btn" id="nx">جرّب</button></div>`); return $('#nx').onclick = next; }
    if (k > L.puzzles.length) return fin();
    const p = L.puzzles[k - 1]; let h = 0;
    frame(`<h3 class="k-pq">${p.q}</h3><div id="ea"></div><div class="k-fb" id="fb" aria-live="polite"></div><div class="k-ac"><button class="btn alt" id="hb">تلميح</button><button class="btn" id="nx" hidden>التالي</button></div>`);
    $('#hb').onclick = () => { if (h < 3) { hn++; $('#fb').className = 'k-fb k-hn'; $('#fb').textContent = p.hints[h++]; $('#hb').textContent = `تلميح (${AR(h)} من ٣)`; } };
    const a = {
      ok(m) { $('#fb').className = 'k-fb k-ok'; $('#fb').textContent = m; $('#ea').classList.add('k-fz'); $('#hb').hidden = true; $('#nx').hidden = false; $('#nx').onclick = next; confetti($('#ea')); },
      bad(m) { mist++; $('#fb').className = 'k-fb k-no'; $('#fb').textContent = m; }
    };
    E[p.type]($('#ea'), p, a);
  };
  function fin() {
    const s = mist === 0 && hn === 0 ? 3 : mist <= 2 && hn <= 1 ? 2 : 1;
    P[L.id] = Math.max(P[L.id] || 0, s); save();
    const all = LS.filter(x => x.ch === L.ch).every(l => P[l.id]), nl = LS[i + 1], fn = all && L.finale;
    frame(`<div class="k-lc"><div class="k-bg1">${stars(s)}</div><h2>${fn ? L.finale[0] : 'أحسنت!'}</h2><p>${fn ? L.finale[1] : L.bridge}</p><a class="btn" href="${nl ? 'course.html?l=' + nl.id : 'course.html?c=khwarizmi'}">${nl ? 'الدرس التالي' : 'المسار'}</a> <a class="btn alt" href="course.html?c=khwarizmi">المسار</a></div>`);
    confetti($('.k-lc'));
    const K = window.KHR, me = K && K.me && K.me();
    if (!me) return toast('سجّل دخولك من «حسابي» لتحفظ نقاطك');
    const key = 'c:' + L.id; if (me.done && me.done[key]) return;
    const d = { ...me.done, [key]: s }; let pt = 20 + (s === 3 ? 10 : 0), co = 10 + (s === 3 ? 5 : 0);
    if (all && !d['c:ch' + L.ch]) { d['c:ch' + L.ch] = 1; pt += 100; co += 50; }
    K.commit(d, pt, co, 'درس: ' + L.t);
  }
  next();
}

/* ---------- الألغاز ---------- */
const E = {};
E.order = (el, p, a) => {
  let pool = shuf(p.cards.map(c => c.id)), seq = []; const C = id => p.cards.find(c => c.id === id);
  const draw = bad => {
    el.innerHTML = `<div class="k-ol">${seq.map((id, n) => `<button class="k-cd${bad == null ? '' : n < bad ? ' k-g' : n === bad ? ' k-r' : ''}" data-s="${id}"><b>${AR(n + 1)}</b>${C(id).t}</button>`).join('') || '<i class="k-em">اضغط البطاقات لتضعها هنا بالترتيب</i>'}</div><div class="k-pl">${pool.map(id => `<button class="k-cd k-pw" data-p="${id}">${C(id).t}</button>`).join('')}</div><button class="btn" id="go"${pool.length ? ' disabled' : ''}>اختبر</button>`;
    $$('[data-p]', el).forEach(b => b.onclick = () => { pool = pool.filter(x => x !== b.dataset.p); seq.push(b.dataset.p); draw(); });
    $$('[data-s]', el).forEach(b => b.onclick = () => { seq = seq.filter(x => x !== b.dataset.s); pool.push(b.dataset.s); draw(); });
    $('#go', el).onclick = () => { const seen = new Set(); for (let n = 0; n < seq.length; n++) { const c = C(seq[n]); if ((c.needs || []).some(x => !seen.has(x))) { draw(n); return a.bad(c.fail); } seen.add(c.id); } a.ok(p.win); };
  };
  draw();
};
E.group = (el, p, a) => {
  let sel = null, pl = {}, bad = [];
  const draw = () => {
    const rest = p.cards.filter((c, n) => pl[n] == null).length;
    el.innerHTML = `<div class="k-pl">${p.cards.map((c, n) => pl[n] == null ? `<button class="k-cd k-pw${sel === n ? ' k-sel' : ''}" data-c="${n}">${c.t}</button>` : '').join('')}</div><div class="k-bk">${p.buckets.map((b, j) => `<div class="k-bx" data-b="${j}"><h4>${b}</h4>${p.cards.map((c, n) => pl[n] === j ? `<button class="k-cd${bad.includes(n) ? ' k-r' : ''}" data-u="${n}">${c.t}</button>` : '').join('')}</div>`).join('')}</div><button class="btn" id="go"${rest ? ' disabled' : ''}>اختبر</button>`;
    $$('[data-c]', el).forEach(b => b.onclick = () => { sel = +b.dataset.c; bad = []; draw(); });
    $$('[data-u]', el).forEach(b => b.onclick = ev => { ev.stopPropagation(); delete pl[b.dataset.u]; bad = []; draw(); });
    $$('.k-bx', el).forEach(b => b.onclick = () => { if (sel != null) { pl[sel] = +b.dataset.b; sel = null; draw(); } });
    $('#go', el).onclick = () => { bad = p.cards.map((c, n) => n).filter(n => pl[n] !== p.cards[n].b); if (!bad.length) return a.ok(p.win); draw(); a.bad(p.fail); };
  };
  draw();
};
E.inspect = (el, p, a) => {
  let n = 0; const miss = p.kind === 'missing';
  const draw = () => {
    el.innerHTML = `<p class="k-gl">الهدف: ${p.goal}</p><ol class="k-sl">${p.steps.map((s, x) => `${miss ? `<li class="k-gp"><button data-g="${x}" aria-label="أضف خطوة هنا">أضف هنا</button></li>` : ''}<li><button class="k-cd${x < n ? ' k-g' : ''}" data-i="${x}"><b>${AR(x + 1)}</b>${s}</button></li>`).join('')}${miss ? `<li class="k-gp"><button data-g="${p.steps.length}" aria-label="أضف خطوة هنا">أضف هنا</button></li>` : ''}</ol><p class="k-tr">${n ? p.trace[n - 1] : ''}</p><button class="btn alt" id="tn">${n < p.steps.length ? 'الخطوة التالية' : 'أعد التتبّع'}</button>`;
    $('#tn', el).onclick = () => { n = n < p.steps.length ? n + 1 : 0; draw(); };
    $$('[data-i]', el).forEach(b => b.onclick = () => { const x = +b.dataset.i; if (!miss && x === p.bug) return a.ok(p.win); a.bad(miss ? 'الخطوات الموجودة تعمل. المشكلة في شيء ناقص بينها.' : 'هذه الخطوة سليمة: ' + p.trace[x]); });
    $$('[data-g]', el).forEach(b => b.onclick = () => +b.dataset.g === p.bug ? a.ok(p.win) : a.bad('لا ينقص شيء هنا. شغّل التتبّع وانظر أين تنقطع النتيجة.'));
  };
  draw();
};
E.prog = (el, p, a) => {
  const G = p.grid.map(r => [...r]); let S, T;
  G.forEach((r, y) => r.forEach((c, x) => { if (c === 'S') S = [y, x]; if (c === 'L') T = [y, x]; }));
  let main = [], lp = { n: 2, b: [] }, foc = 'm', busy = false;
  const AW = ['▶', '▼', '◀', '▲'], NM = { F: 'تقدّم', R: 'يمين', L: 'يسار' };
  const used = () => main.length + (main.includes('LOOP') ? lp.b.length : 0);
  const grid = (pos, dir, tr) => `<div class="k-gr" dir="ltr" style="grid-template-columns:repeat(${G[0].length},1fr)">${G.map((r, y) => r.map((c, x) => `<i class="${c === '#' ? 'k-w' : ''}${tr.some(t => t[0] === y && t[1] === x) ? ' k-t' : ''}">${pos[0] === y && pos[1] === x ? `<u>${AW[dir]}</u>` : c === 'L' ? '🏮' : ''}</i>`).join('')).join('')}</div>`;
  const draw = (pos = S, dir = 0, tr = []) => {
    el.innerHTML = `${grid(pos, dir, tr)}<div class="k-pg">${main.map((t, n) => t === 'LOOP' ? `<div class="k-lb${foc === 'l' ? ' k-f' : ''}" data-l><span>كرّر <button data-n="-1">-</button><b>${AR(lp.n)}</b><button data-n="1">+</button> مرات</span>${lp.b.map((x, m) => `<button class="k-ch" data-lb="${m}">${NM[x]}</button>`).join('')}</div>` : `<button class="k-ch" data-mb="${n}">${NM[t]}</button>`).join('') || '<i class="k-em">أضف كتلاً</i>'}</div>${p.max ? `<p class="k-bu${used() > p.max ? ' k-o' : ''}">الكتل: ${AR(used())} / ${AR(p.max)}</p>` : ''}<div class="k-pa">${['F', 'R', 'L'].map(t => `<button class="btn alt" data-a="${t}">${NM[t]}</button>`).join('')}${p.loop && !main.includes('LOOP') ? '<button class="btn alt" data-a="LOOP">كرّر</button>' : ''}</div><div class="k-ac"><button class="btn" id="go">ابدأ</button><button class="btn alt" id="cl">امسح</button></div>`;
    $$('[data-a]', el).forEach(b => b.onclick = () => { const t = b.dataset.a; if (t === 'LOOP') { main.push('LOOP'); foc = 'l'; } else (foc === 'l' && main.includes('LOOP') ? lp.b : main).push(t); draw(); });
    $$('[data-mb]', el).forEach(b => b.onclick = () => { main.splice(+b.dataset.mb, 1); if (!main.includes('LOOP')) { lp.b = []; foc = 'm'; } draw(); });
    $$('[data-lb]', el).forEach(b => b.onclick = ev => { ev.stopPropagation(); lp.b.splice(+b.dataset.lb, 1); draw(); });
    $$('[data-n]', el).forEach(b => b.onclick = ev => { ev.stopPropagation(); lp.n = Math.min(9, Math.max(1, lp.n + +b.dataset.n)); draw(); });
    $$('[data-l]', el).forEach(b => b.onclick = () => { foc = 'l'; draw(); });
    $('.k-pg', el).onclick = ev => { if (ev.target.classList.contains('k-pg')) { foc = 'm'; draw(); } };
    $('#cl', el).onclick = () => { main = []; lp.b = []; foc = 'm'; draw(); };
    $('#go', el).onclick = run;
  };
  async function run() {
    if (busy) return;
    if (p.max && used() > p.max) return a.bad('تجاوزت عدد الكتل المسموح. ابحث عن نمط يتكرّر واكتبه مرة واحدة.');
    const seq = main.flatMap(t => t === 'LOOP' ? Array(lp.n).fill(lp.b).flat() : [t]);
    if (!seq.length) return a.bad('أضف كتلاً أولاً.');
    busy = true; let pos = S, dir = 0, tr = [S], hit = 0;
    for (let n = 0; n < seq.length; n++) {
      const t = seq[n]; if (t === 'R') dir = (dir + 1) % 4; else if (t === 'L') dir = (dir + 3) % 4;
      else { const q = [pos[0] + [0, 1, 0, -1][dir], pos[1] + [1, 0, -1, 0][dir]]; if (!G[q[0]] || !G[q[0]][q[1]] || G[q[0]][q[1]] === '#') { hit = n + 1; break; } pos = q; tr.push(q); }
      el.firstElementChild.outerHTML = grid(pos, dir, tr); await wait(260);
    }
    busy = false;
    if (hit) { draw(pos, dir, tr); return a.bad(`اصطدم ترس بجدار (أو بحافة الساحة) عند الخطوة ${AR(hit)}. المسار الذي مشاه مظلّل.`); }
    draw(pos, dir, tr);
    if (pos[0] === T[0] && pos[1] === T[1]) a.ok('وصل ترس إلى المصباح.'); else a.bad('توقّف ترس بعيداً عن المصباح. عدّل التعليمات وجرّب ثانية.');
  }
  draw();
};
E.race = (el, p, a) => {
  el.innerHTML = `<p>الطريقة أ: يجرّب ١ ثم ٢ ثم ٣… بالترتيب.<br>الطريقة ب: يخمّن الرقم الأوسط دائماً، ويقول ترس «أعلى» أو «أدنى».</p><div class="k-ac"><button class="btn alt" data-w="A">أ</button><button class="btn alt" data-w="B">ب</button></div><div id="rs"></div>`;
  $$('[data-w]', el).forEach(b => b.onclick = () => {
    const s = rnd(60, 100); let lo = 1, hi = 100, c = 0; while (1) { const m = (lo + hi) >> 1; c++; if (m === s) break; m < s ? lo = m + 1 : hi = m - 1; }
    $('#rs', el).innerHTML = `<p>الرقم السري كان <b>${AR(s)}</b>.</p><div class="k-r2"><span>أ: ${AR(s)} خطوة</span><i style="width:${s}%"></i></div><div class="k-r2"><span>ب: ${AR(c)} خطوات</span><i style="width:${Math.max(c, 3)}%"></i></div>`;
    b.dataset.w === 'B' ? a.ok('الطريقة ب تنصّف الاحتمالات في كل خطوة، فلا تتجاوز ٧ خطوات لأي رقم من ١ إلى ١٠٠.') : a.bad('انظر إلى الأعمدة: أ احتاجت خطوات أكثر بكثير. اختر مرة أخرى.');
  });
};
E.choice = (el, p, a) => {
  el.innerHTML = `<div class="k-ch2">${shuf(p.opts).map((o, n) => `<button class="k-cd" data-o="${n}">${o.t}</button>`).join('')}</div>`;
  const O = $$('[data-o]', el); const sh = [...O];
  O.forEach((b, n) => b.onclick = () => { const o = p.opts.find(x => x.t === b.textContent); o.ok ? a.ok(p.win) : (b.classList.add('k-r'), a.bad(o.why)); });
};
E.rule = (el, p, a) => {
  const cfg = {}; p.fields.forEach(f => cfg[f.k] = f.o[0][0]);
  const L = ['⚫', '💡'], ap = (x, s) => x === 'on' ? 'l' : x === 'off' ? 'd' : s;
  const sim = (c) => p.sort ? (() => {
    const h = [...c]; for (let r = 0; r < +cfg.n; r++) for (let n = 0; n < h.length - 1; n++) { const t = cfg.cond === 't' ? h[n] > h[n + 1] : cfg.cond === 's' ? h[n] < h[n + 1] : true; if (t && cfg.a === 'sw') [h[n], h[n + 1]] = [h[n + 1], h[n]]; }
    return { ok: h.every((x, n) => !n || h[n - 1] <= x), v: h };
  })() : (() => { const r = c.map(s => { const t = cfg.cond === 'd' ? s === 'd' : s === 'l'; return ap(t ? cfg.a : cfg.b, s); }); return { ok: r.every(x => x === 'l'), v: r }; })();
  const show = (c, v) => p.sort ? `<span class="k-bk2">${[...c, '→', ...v].map(x => x === '→' ? '<em>→</em>' : `<s style="height:${x * 12 + 8}px"></s>`).join('')}</span>` : `<span class="k-bk3">${c.map(x => L[x === 'l' ? 1 : 0]).join('')} → ${v.map(x => L[x === 'l' ? 1 : 0]).join('')}</span>`;
  el.innerHTML = `<div class="k-rl">${p.fields.map(f => `<label>${f.l} <select data-k="${f.k}">${f.o.map(o => `<option value="${o[0]}">${o[1]}</option>`).join('')}</select></label>`).join('')}</div><button class="btn" id="go">اختبر القاعدة</button><div id="rs"></div>`;
  $$('select', el).forEach(s => s.onchange = () => cfg[s.dataset.k] = s.value);
  $('#go', el).onclick = () => {
    const R = p.cases.map(c => ({ c, ...(p.sim ? p.sim(cfg, c) : sim(c)) })); $('#rs', el).innerHTML = R.map((r, n) => `<div class="k-rr ${r.ok ? 'k-ok' : 'k-no'}"><b>${AR(n + 1)}</b> ${p.show ? `<span>${p.show(r.c, r.v)}</span>` : show(r.c, r.v)}<em>${r.ok ? 'صحيح' : 'خطأ'}</em></div>`).join('');
    const f = R.findIndex(r => !r.ok); f < 0 ? a.ok(p.win) : a.bad(`فشلت القاعدة في الحالة ${AR(f + 1)}. انظر ماذا فعل ترس.`);
  };
};

E.bits = (el, p, a) => {
  const W = [8, 4, 2, 1]; let on = [0, 0, 0, 0]; const val = () => on.reduce((s, x, n) => s + x * W[n], 0);
  const draw = () => {
    el.innerHTML = `<p class="k-gl">الرقم المطلوب: ${AR(p.target)}</p><div class="k-bits" dir="ltr">${W.map((w, n) => `<button class="k-bit${on[n] ? ' k-on' : ''}" data-i="${n}"><b>${on[n] ? 'يعمل' : 'متوقف'}</b><small>${AR(w)}</small></button>`).join('')}</div><p class="k-tr">القيمة الآن: ${AR(val())}</p><button class="btn" id="go">اختبر</button>`;
    $$('[data-i]', el).forEach(b => b.onclick = () => { on[+b.dataset.i] ^= 1; draw(); });
    $('#go', el).onclick = () => val() === p.target ? a.ok(p.win) : a.bad(`القيمة الآن ${AR(val())} وليست ${AR(p.target)}. اجمع قيم المفاتيح التي تعمل فقط.`);
  };
  draw();
};
E.tree = (el, p, a) => {
  let path = []; const node = () => path.reduce((n, k) => n[k], p.tree);
  const draw = () => {
    const n = node();
    el.innerHTML = `<p class="k-gl">أنت في: ${['الجذر', ...path].join(' ‹ ')}</p>${Object.keys(n).map(k => `<button class="k-cd" data-k="${k}">${typeof n[k] === 'object' ? 'مجلد: ' : 'ملف: '}${k}</button>`).join('')}${path.length ? '<button class="btn alt" id="bk">للخلف</button>' : ''}`;
    $$('[data-k]', el).forEach(b => b.onclick = () => { const k = b.dataset.k; if (typeof n[k] === 'object') { path.push(k); draw(); } else if ([...path, k].join('/') === p.target.join('/')) a.ok(p.win); else a.bad('هذا ليس الملف المطلوب. عُد وابحث في مجلد آخر.'); });
    const bk = $('#bk', el); if (bk) bk.onclick = () => { path.pop(); draw(); };
  };
  draw();
};

PAGES.course = () => { const q = new URLSearchParams(location.search), l = q.get('l'); if (l) return play(l); if (q.get('c') !== 'khwarizmi') return picker(); shell('course'); P.intro ? home() : intro(home); };
})();
