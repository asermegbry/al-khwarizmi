/* الخوارزمي 4.9 — شطرنج الرازي: قواعد كاملة (التبييت، الأخذ بالمرور، الترقية، كش مات، تعادل) + ذكاء بأربع درجات.
   بلا مكتبات خارجية. يعمل داخل صفحة اللعبة مباشرة، وعند انتهاء المباراة يمنح النقاط عبر endScreen. */
(() => {
const P = 1, N = 2, B = 3, R = 4, Q = 5, K = 6;
const VAL = [0, 100, 320, 330, 500, 900, 0];
const GL = { 1: '♟', 2: '♞', 3: '♝', 4: '♜', 5: '♛', 6: '♚' };
const LET = 'PNBRQK', FILES = 'abcdefgh';
const sqName = i => FILES[i & 7] + (8 - (i >> 3));
const DN = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];
const DK = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
const DB = [[-1, -1], [-1, 1], [1, -1], [1, 1]], DR = [[-1, 0], [1, 0], [0, -1], [0, 1]];

/* ---------- الحالة ---------- */
const newState = () => {
  const b = new Int8Array(64), back = [4, 2, 3, 5, 6, 3, 2, 4];
  for (let f = 0; f < 8; f++) { b[f] = -back[f]; b[8 + f] = -1; b[48 + f] = 1; b[56 + f] = back[f]; }
  return { b, turn: 1, cast: 15, ep: -1, hm: 0, fm: 1, ks: [60, 4], hist: [] };
};

function attacked(S, sq, by) {
  const b = S.b, r = sq >> 3, f = sq & 7, pr = r + (by > 0 ? 1 : -1);
  if (pr >= 0 && pr < 8) { if (f > 0 && b[pr * 8 + f - 1] === by * P) return true; if (f < 7 && b[pr * 8 + f + 1] === by * P) return true; }
  for (const [d, e] of DN) { const rr = r + d, ff = f + e; if (rr >= 0 && rr < 8 && ff >= 0 && ff < 8 && b[rr * 8 + ff] === by * N) return true; }
  for (const [d, e] of DK) { const rr = r + d, ff = f + e; if (rr >= 0 && rr < 8 && ff >= 0 && ff < 8 && b[rr * 8 + ff] === by * K) return true; }
  for (const [d, e] of DB) { let rr = r + d, ff = f + e; while (rr >= 0 && rr < 8 && ff >= 0 && ff < 8) { const p = b[rr * 8 + ff]; if (p) { if (p === by * B || p === by * Q) return true; break; } rr += d; ff += e; } }
  for (const [d, e] of DR) { let rr = r + d, ff = f + e; while (rr >= 0 && rr < 8 && ff >= 0 && ff < 8) { const p = b[rr * 8 + ff]; if (p) { if (p === by * R || p === by * Q) return true; break; } rr += d; ff += e; } }
  return false;
}
const inCheck = S => attacked(S, S.ks[S.turn > 0 ? 0 : 1], -S.turn);

function gen(S, caps) {
  const b = S.b, side = S.turn, out = [];
  const add = (f, t, fl) => {
    const tr = t >> 3;
    if (Math.abs(b[f]) === P && (tr === 0 || tr === 7)) { for (const pr of [Q, R, B, N]) out.push({ f, t, pr, fl: fl || '' }); }
    else out.push({ f, t, pr: 0, fl: fl || '' });
  };
  for (let i = 0; i < 64; i++) {
    const p = b[i]; if (!p || (p > 0) !== (side > 0)) continue;
    const t = Math.abs(p), r = i >> 3, f = i & 7;
    if (t === P) {
      const dir = side > 0 ? -1 : 1, sr = side > 0 ? 6 : 1, pr = side > 0 ? 0 : 7, r1 = r + dir;
      if (r1 < 0 || r1 > 7) continue;
      if ((!caps || r1 === pr) && b[r1 * 8 + f] === 0) {
        add(i, r1 * 8 + f);
        if (!caps && r === sr && b[(r + 2 * dir) * 8 + f] === 0) out.push({ f: i, t: (r + 2 * dir) * 8 + f, pr: 0, fl: 'd' });
      }
      for (const df of [-1, 1]) {
        const ff = f + df; if (ff < 0 || ff > 7) continue;
        const tt = r1 * 8 + ff, tg = b[tt];
        if (tg && (tg > 0) !== (side > 0)) add(i, tt);
        else if (!tg && tt === S.ep) out.push({ f: i, t: tt, pr: 0, fl: 'e' });
      }
    } else if (t === N || t === K) {
      for (const [d, e] of (t === N ? DN : DK)) {
        const rr = r + d, ff = f + e; if (rr < 0 || rr > 7 || ff < 0 || ff > 7) continue;
        const tt = rr * 8 + ff, tg = b[tt];
        if (tg === 0) { if (!caps) out.push({ f: i, t: tt, pr: 0, fl: '' }); }
        else if ((tg > 0) !== (side > 0)) out.push({ f: i, t: tt, pr: 0, fl: '' });
      }
      if (t === K && !caps) {
        const home = side > 0 ? 60 : 4, en = -side;
        if (i === home && !attacked(S, home, en)) {
          const ks = side > 0 ? 1 : 4, qs = side > 0 ? 2 : 8, rk = side * R;
          if ((S.cast & ks) && b[home + 3] === rk && !b[home + 1] && !b[home + 2] && !attacked(S, home + 1, en) && !attacked(S, home + 2, en)) out.push({ f: home, t: home + 2, pr: 0, fl: 'c' });
          if ((S.cast & qs) && b[home - 4] === rk && !b[home - 1] && !b[home - 2] && !b[home - 3] && !attacked(S, home - 1, en) && !attacked(S, home - 2, en)) out.push({ f: home, t: home - 2, pr: 0, fl: 'c' });
        }
      }
    } else {
      for (const [d, e] of (t === B ? DB : t === R ? DR : DK)) {
        let rr = r + d, ff = f + e;
        while (rr >= 0 && rr < 8 && ff >= 0 && ff < 8) {
          const tt = rr * 8 + ff, tg = b[tt];
          if (tg === 0) { if (!caps) out.push({ f: i, t: tt, pr: 0, fl: '' }); }
          else { if ((tg > 0) !== (side > 0)) out.push({ f: i, t: tt, pr: 0, fl: '' }); break; }
          rr += d; ff += e;
        }
      }
    }
  }
  return out;
}

function make(S, m) {
  const b = S.b, p = b[m.f], side = S.turn;
  const u = { m, p, cap: 0, capSq: m.t, cast: S.cast, ep: S.ep, hm: S.hm, k0: S.ks[0], k1: S.ks[1] };
  let cap = b[m.t];
  if (m.fl === 'e') { u.capSq = m.t + (side > 0 ? 8 : -8); cap = b[u.capSq]; b[u.capSq] = 0; }
  u.cap = cap;
  b[m.t] = m.pr ? side * m.pr : p; b[m.f] = 0;
  if (m.fl === 'c') { if (m.t > m.f) { b[m.t - 1] = b[m.t + 1]; b[m.t + 1] = 0; } else { b[m.t + 1] = b[m.t - 2]; b[m.t - 2] = 0; } }
  if (Math.abs(p) === K) { S.ks[side > 0 ? 0 : 1] = m.t; S.cast &= side > 0 ? ~3 : ~12; }
  if (m.f === 63 || m.t === 63) S.cast &= ~1;
  if (m.f === 56 || m.t === 56) S.cast &= ~2;
  if (m.f === 7 || m.t === 7) S.cast &= ~4;
  if (m.f === 0 || m.t === 0) S.cast &= ~8;
  S.ep = m.fl === 'd' ? (m.f + m.t) >> 1 : -1;
  S.hm = (Math.abs(p) === P || cap) ? 0 : S.hm + 1;
  if (side < 0) S.fm++;
  S.turn = -side; S.hist.push(u);
}
function unmake(S) {
  const u = S.hist.pop(), m = u.m, b = S.b; S.turn = -S.turn; if (S.turn < 0) S.fm--;
  b[m.f] = u.p;
  if (m.fl === 'e') { b[m.t] = 0; b[u.capSq] = u.cap; } else b[m.t] = u.cap;
  if (m.fl === 'c') { if (m.t > m.f) { b[m.t + 1] = b[m.t - 1]; b[m.t - 1] = 0; } else { b[m.t - 2] = b[m.t + 1]; b[m.t + 1] = 0; } }
  S.cast = u.cast; S.ep = u.ep; S.hm = u.hm; S.ks[0] = u.k0; S.ks[1] = u.k1;
}
function legal(S) {
  const out = [];
  for (const m of gen(S, false)) { make(S, m); if (!attacked(S, S.ks[-S.turn > 0 ? 0 : 1], S.turn)) out.push(m); unmake(S); }
  return out;
}

/* ---------- التقييم والبحث ---------- */
const PST = {
  1: [0,0,0,0,0,0,0,0, 50,50,50,50,50,50,50,50, 10,10,20,30,30,20,10,10, 5,5,10,25,25,10,5,5, 0,0,0,20,20,0,0,0, 5,-5,-10,0,0,-10,-5,5, 5,10,10,-20,-20,10,10,5, 0,0,0,0,0,0,0,0],
  2: [-50,-40,-30,-30,-30,-30,-40,-50, -40,-20,0,0,0,0,-20,-40, -30,0,10,15,15,10,0,-30, -30,5,15,20,20,15,5,-30, -30,0,15,20,20,15,0,-30, -30,5,10,15,15,10,5,-30, -40,-20,0,5,5,0,-20,-40, -50,-40,-30,-30,-30,-30,-40,-50],
  3: [-20,-10,-10,-10,-10,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,10,10,5,0,-10, -10,5,5,10,10,5,5,-10, -10,0,10,10,10,10,0,-10, -10,10,10,10,10,10,10,-10, -10,5,0,0,0,0,5,-10, -20,-10,-10,-10,-10,-10,-10,-20],
  4: [0,0,0,0,0,0,0,0, 5,10,10,10,10,10,10,5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, -5,0,0,0,0,0,0,-5, 0,0,0,5,5,0,0,0],
  5: [-20,-10,-10,-5,-5,-10,-10,-20, -10,0,0,0,0,0,0,-10, -10,0,5,5,5,5,0,-10, -5,0,5,5,5,5,0,-5, 0,0,5,5,5,5,0,-5, -10,5,5,5,5,5,0,-10, -10,0,5,0,0,0,0,-10, -20,-10,-10,-5,-5,-10,-10,-20],
  6: [-30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -30,-40,-40,-50,-50,-40,-40,-30, -20,-30,-30,-40,-40,-30,-30,-20, -10,-20,-20,-20,-20,-20,-20,-10, 20,20,0,0,0,0,20,20, 20,30,10,0,0,10,30,20]
};
function evaluate(S) {
  const b = S.b; let npm = 0;
  for (let i = 0; i < 64; i++) { const t = Math.abs(b[i]); if (t > 1 && t < 6) npm += VAL[t]; }
  const end = npm <= 2400; let s = 0;
  for (let i = 0; i < 64; i++) {
    const p = b[i]; if (!p) continue;
    const t = Math.abs(p), w = p > 0, r = i >> 3, f = i & 7, idx = w ? i : ((7 - r) << 3) | f;
    let v = VAL[t];
    if (t === K && end) v += 40 - (Math.abs(r - 3.5) + Math.abs(f - 3.5)) * 12; else v += PST[t][idx];
    s += w ? v : -v;
  }
  return S.turn > 0 ? s : -s;
}
let nodes = 0, deadline = 0, stopped = false;
const score = (S, m) => { const c = Math.abs(S.b[m.t]); return (c ? 1000 + 10 * VAL[c] - VAL[Math.abs(S.b[m.f])] / 10 : 0) + (m.pr ? 800 : 0); };
const order = (S, ms) => { for (const m of ms) m.sc = score(S, m); ms.sort((a, c) => c.sc - a.sc); };
function quiesce(S, alpha, beta, ply) {
  if ((++nodes & 2047) === 0 && Date.now() > deadline) stopped = true;
  if (stopped) return 0;
  const st = evaluate(S); if (ply >= 6) return st;
  if (st >= beta) return beta; if (st > alpha) alpha = st;
  const ms = gen(S, true); order(S, ms);
  for (const m of ms) {
    make(S, m);
    if (attacked(S, S.ks[-S.turn > 0 ? 0 : 1], S.turn)) { unmake(S); continue; }
    const sc = -quiesce(S, -beta, -alpha, ply + 1); unmake(S);
    if (stopped) return 0; if (sc >= beta) return beta; if (sc > alpha) alpha = sc;
  }
  return alpha;
}
function negamax(S, depth, alpha, beta, ply) {
  if ((++nodes & 2047) === 0 && Date.now() > deadline) stopped = true;
  if (stopped) return 0;
  const chk = inCheck(S); if (chk && ply < 8) depth++;
  if (depth <= 0) return quiesce(S, alpha, beta, 0);
  const ms = gen(S, false); order(S, ms); let n = 0;
  for (const m of ms) {
    make(S, m);
    if (attacked(S, S.ks[-S.turn > 0 ? 0 : 1], S.turn)) { unmake(S); continue; }
    n++; const sc = -negamax(S, depth - 1, -beta, -alpha, ply + 1); unmake(S);
    if (stopped) return 0; if (sc >= beta) return beta; if (sc > alpha) alpha = sc;
  }
  if (!n) return chk ? -30000 + ply : 0;
  return alpha;
}
function think(S, maxDepth, ms, randomPct) {
  const root = legal(S); if (!root.length) return null;
  if (randomPct && Math.random() < randomPct) return root[Math.floor(Math.random() * root.length)];
  order(S, root); deadline = Date.now() + ms; stopped = false; nodes = 0;
  let best = root[0];
  for (let d = 1; d <= maxDepth; d++) {
    let bs = -Infinity, bm = null, alpha = -Infinity;
    for (const m of root) {
      make(S, m); const sc = -negamax(S, d - 1, -Infinity, -alpha, 1); unmake(S);
      if (stopped) break;
      if (sc > bs) { bs = sc; bm = m; } if (sc > alpha) alpha = sc;
    }
    if (stopped && d > 1) break;
    if (bm) { best = bm; root.splice(root.indexOf(bm), 1); root.unshift(bm); }
    if (stopped || bs > 20000) break;
  }
  return best;
}

/* ---------- اللغة ---------- */
const LV = [
  { n: 'مبتدئ', d: 1, ms: 300, r: .35 },
  { n: 'متوسط', d: 2, ms: 600, r: .06 },
  { n: 'قوي', d: 3, ms: 1000, r: 0 },
  { n: 'خبير', d: 5, ms: 1800, r: 0 }
];
const SAY = {
  start: ['أهلاً بك! أنا الرازي. أحببت الشطرنج لأنه يعلّم الصبر والملاحظة كما يعلّمها الطب. ابدأ بنقلة تسيطر بها على المركز.', 'مرحباً! خذ وقتك في التفكير؛ لا أحد يستعجلك. جرّب أن تتحكم في المربعات الأربعة في الوسط.'],
  capMe: ['أحسنت، كسبتَ قطعة! لكن قبل أن تفرح، تأكد أن قطعتك التي أخذت بها غير مهددة.', 'أخذتَ قطعة. تذكّر: التبادل يفيدك حين تكون متقدماً في المادة.'],
  capAI: ['أخذتُ قطعة. لا بأس، الخطأ معلّم جيد؛ انظر ما الذي كان بلا حماية.', 'هذه القطعة صارت لي. تأمّل: أي قطعة من قطعك لا يحميها أحد؟'],
  lostMoved: ['خسرتَ القطعة التي حرّكتَها للتو. اسأل نفسك قبل كل نقلة: هل الخانة التي سأذهب إليها محمية؟', 'القطعة التي نقلتَها كانت مكشوفة. الفحص قبل العلاج: انظر إلى تهديدات الخصم قبل أن تنقل.'],
  chkMe: ['شاه! ملكي مهدَّد. نقلة جميلة.', 'شاه! أجبرتني على الدفاع.'],
  chkAI: ['شاه! ملكك مهدَّد. لديك ثلاث طرق: انقل الملك، أو احجب الهجوم، أو خذ القطعة المهاجمة.', 'شاه! احمِ ملكك أولاً.'],
  castle: ['التبييت يحمي الملك ويُدخل الرخ إلى اللعب. نقلة حكيمة.'],
  promo: ['ترقية! صبر البيدق في رحلته الطويلة أثمر وزيراً.'],
  tip: ['نصيحة: طوّر الأحصنة والفيلة قبل أن تحرّك الوزير مبكراً.', 'نصيحة: بيّت ملكك مبكراً، فهو أأمن في الزاوية.', 'نصيحة: لا تحرّك القطعة نفسها مرتين في الافتتاح بلا سبب.', 'نصيحة: البيادق في الوسط تمنح قطعك مساحة للحركة.', 'نصيحة: قبل كل نقلة اسأل: ماذا يريد خصمي أن يفعل؟', 'نصيحة: في النهايات يصبح الملك قطعة قوية، فاجعله يتقدم.'],
  hint: ['تلميح: القطعة المضيئة بالأخضر تستطيع أن تذهب إلى الخانة المضيئة. فكّر في السبب.'],
  undo: ['لا بأس، التراجع جزء من التعلّم. جرّب فكرة أخرى.'],
  win: ['مبروك، هزمتني! تعلّمتَ شيئاً اليوم، وهذا هو الانتصار الحقيقي.'],
  lose: ['فزتُ هذه المرة، لكن راجع نقلاتك وستفوز في المرة القادمة.'],
  draw: ['تعادل. توازن جميل بيننا.'],
  mateFail: ['انتبه، النقلة غير ممكنة: ملكك سيبقى مهدّداً.']
};
const pick = a => a[Math.floor(Math.random() * a.length)];

/* ---------- الواجهة ---------- */
function chessGame(root) {
  if (!document.getElementById('chess-css')) { const l = document.createElement('link'); l.id = 'chess-css'; l.rel = 'stylesheet'; l.href = 'css/chess.css'; document.head.appendChild(l); }
  if (root.parentElement) root.parentElement.style.maxWidth = '1000px';
  const razi = (typeof byId === 'function' && byId('razi')) || null, face = razi ? razi.portrait : '';
  let S, L, me = 1, orient = 1, level = +(localStorage.getItem('kh-chess-lvl') || 1), sel = null, last = null, hintM = null,
      busy = false, over = false, sans = [], keys = [], say = '', result = '', promoPick = null, prevMove = null, resultOnce = false;
  const key = () => S.b.join('') + S.turn + S.cast + S.ep;
  const mat = () => { const c = { 1: [8, 8], 2: [2, 2], 3: [2, 2], 4: [2, 2], 5: [1, 1] }, have = { 1: [0, 0], 2: [0, 0], 3: [0, 0], 4: [0, 0], 5: [0, 0] };
    for (let i = 0; i < 64; i++) { const p = S.b[i], t = Math.abs(p); if (t && t < 6) have[t][p > 0 ? 0 : 1]++; }
    const lost = [[], []]; let sc = 0;
    for (let t = 5; t >= 1; t--) for (let k = 0; k < 2; k++) { for (let n = have[t][k]; n < c[t][k]; n++) lost[k].push(t); }
    for (let i = 0; i < 64; i++) { const p = S.b[i]; if (p && Math.abs(p) < 6) sc += (p > 0 ? 1 : -1) * VAL[Math.abs(p)]; }
    return { lost, sc }; };
  function san(m) {
    const p = S.b[m.f], t = Math.abs(p); if (m.fl === 'c') return m.t > m.f ? 'O-O' : 'O-O-O';
    const cap = S.b[m.t] !== 0 || m.fl === 'e'; let s = '';
    if (t === P) { if (cap) s += FILES[m.f & 7] + 'x'; s += sqName(m.t); if (m.pr) s += '=' + LET[m.pr - 1]; }
    else {
      s += LET[t - 1];
      const o = L.filter(x => x.f !== m.f && x.t === m.t && S.b[x.f] === p);
      if (o.length) { if (!o.some(x => (x.f & 7) === (m.f & 7))) s += FILES[m.f & 7]; else if (!o.some(x => (x.f >> 3) === (m.f >> 3))) s += 8 - (m.f >> 3); else s += sqName(m.f); }
      if (cap) s += 'x'; s += sqName(m.t);
    }
    return s;
  }
  function endCheck() {
    if (!L.length) { over = true; if (inCheck(S)) { result = S.turn === me ? 'lose' : 'win'; return 'كش مات! ' + (S.turn === me ? 'فاز ابن الرازي.' : 'فزتَ أنت.'); } result = 'draw'; return 'تعادل بالجمود (لا نقلة قانونية).'; }
    if (S.hm >= 100) { over = true; result = 'draw'; return 'تعادل بقاعدة الخمسين نقلة.'; }
    if (keys.filter(k => k === keys[keys.length - 1]).length >= 3) { over = true; result = 'draw'; return 'تعادل بتكرار الوضع ثلاث مرات.'; }
    let minors = 0, others = 0; for (let i = 0; i < 64; i++) { const t = Math.abs(S.b[i]); if (t === N || t === B) minors++; else if (t && t !== K) others++; }
    if (!others && minors <= 1) { over = true; result = 'draw'; return 'تعادل: لا تكفي القطع للتمات.'; }
    return '';
  }
  function reward() {
    if (resultOnce) return; resultOnce = true;
    const sc = result === 'win' ? 3 : result === 'draw' ? 2 : 1;
    try { if (typeof endScreen === 'function') endScreen(document.createElement('div'), sc, 3, () => {}, ''); } catch (e) {}
    if (result === 'win') { try { confetti(root); } catch (e) {} }
  }
  function apply(m, byAI) {
    const cap = Math.abs(S.b[m.t]) || (m.fl === 'e' ? 1 : 0), s0 = san(m), mover = S.turn;
    const hadPrev = prevMove; make(S, m); keys.push(key()); last = [m.f, m.t]; sel = null; hintM = null; promoPick = null;
    L = legal(S); const chk = inCheck(S), fin = endCheck();
    sans.push(s0 + (chk ? (L.length ? '+' : '#') : '')); prevMove = { t: m.t, byAI };
    let line = '';
    if (over) { line = fin + ' ' + pick(SAY[result]); reward(); }
    else if (chk) line = pick(byAI ? SAY.chkAI : SAY.chkMe);
    else if (m.fl === 'c') line = pick(SAY.castle);
    else if (m.pr) line = pick(SAY.promo);
    else if (cap) line = byAI && hadPrev && !hadPrev.byAI && hadPrev.t === m.t ? pick(SAY.lostMoved) : pick(byAI ? SAY.capAI : SAY.capMe);
    else if (!byAI && sans.length % 4 === 0) line = pick(SAY.tip);
    if (line) say = line;
    render();
    if (!over && S.turn !== me) aiTurn();
  }
  function aiTurn() {
    busy = true; render();
    const t0 = Date.now(), lv = LV[level];
    setTimeout(() => {
      const m = think(S, lv.d, lv.ms, lv.r), wait = Math.max(0, 450 - (Date.now() - t0));
      setTimeout(() => { busy = false; if (m && !over) apply(m, true); }, wait);
    }, 40);
  }
  function newGame() {
    S = newState(); L = legal(S); sel = null; last = null; hintM = null; busy = false; over = false; sans = []; keys = [key()]; result = ''; resultOnce = false; promoPick = null; prevMove = null;
    orient = me; say = pick(SAY.start); render(); if (S.turn !== me) aiTurn();
  }
  function undo() {
    if (busy || S.hist.length < (me > 0 ? 2 : 3)) return;
    if (S.turn !== me && !over) return;
    const n = (S.turn === me) ? 2 : 1; // انتهت المباراة بعد نقلتي: أتراجع نقلة واحدة
    for (let i = 0; i < n && S.hist.length; i++) { unmake(S); sans.pop(); keys.pop(); }
    over = false; result = ''; resultOnce = false; L = legal(S); sel = null; hintM = null; last = null; prevMove = null; say = pick(SAY.undo); render();
    if (S.turn !== me) aiTurn();
  }
  function hint() { if (busy || over || S.turn !== me) return; hintM = think(S, 3, 700, 0); sel = null; say = pick(SAY.hint); render(); }
  function click(i) {
    if (busy || over || S.turn !== me || promoPick) return;
    const p = S.b[i];
    if (sel !== null) {
      const ms = L.filter(m => m.f === sel && m.t === i);
      if (ms.length) { if (ms.length > 1) { promoPick = ms; render(); return; } apply(ms[0], false); return; }
    }
    if (p && (p > 0) === (me > 0) && L.some(m => m.f === i)) { sel = sel === i ? null : i; hintM = null; }
    else if (sel !== null) { sel = null; }
    render();
  }
  function render() {
    const mt = mat(), chk = inCheck(S), ksq = chk ? S.ks[S.turn > 0 ? 0 : 1] : -1;
    const targets = sel !== null ? L.filter(m => m.f === sel).map(m => m.t) : [];
    const ev = evaluate(S) * S.turn, pct = Math.round(100 / (1 + Math.exp(-ev / 250)));
    const idxs = []; for (let k = 0; k < 64; k++) idxs.push(orient > 0 ? k : 63 - k);
    const sq = idxs.map((i, k) => {
      const r = i >> 3, f = i & 7, p = S.b[i], cls = ['sq', ((r + f) & 1) ? 'd' : 'l'];
      if (sel === i) cls.push('sel'); if (last && (last[0] === i || last[1] === i)) cls.push('last'); if (i === ksq) cls.push('chk');
      if (targets.includes(i)) cls.push(p ? 'cap' : 'mv');
      if (hintM && (hintM.f === i || hintM.t === i)) cls.push('hint');
      const col = (k & 7) === 0 ? `<i class="crk">${8 - r}</i>` : '', fl = k >= 56 ? `<i class="cfl">${FILES[f]}</i>` : '';
      return `<button class="${cls.join(' ')}" data-i="${i}" aria-label="${sqName(i)}${p ? ' ' + LET[Math.abs(p) - 1] : ''}">${col}${fl}${p ? `<span class="pc ${p > 0 ? 'w' : 'b'}">${GL[Math.abs(p)]}\uFE0E</span>` : ''}</button>`;
    }).join('');
    const cap = k => mt.lost[k].map(t => `<span class="cp ${k === 0 ? 'w' : 'b'}">${GL[t]}\uFE0E</span>`).join('');
    const myK = me > 0 ? 1 : 0, oppK = 1 - myK, diff = (me > 0 ? mt.sc : -mt.sc) / 100;
    const bar = (isMe) => {
      const k = isMe ? myK : oppK, side = (isMe ? me : -me) > 0 ? 'الأبيض' : 'الأسود', adv = isMe ? diff : -diff;
      return `<div class="ch-bar">${isMe ? '<span class="av me">أنت</span>' : `<span class="av">${face ? `<img src="${face}" alt="">` : ''}</span>`}<div class="nm"><b>${isMe ? 'أنت' : 'ابن الرازي'}</b><small>${side}${isMe ? '' : ' · ' + LV[level].n}</small></div><div class="cps">${cap(1 - k)}${adv > 0 ? `<em>+${adv}</em>` : ''}</div></div>`;
    };
    const status = over ? (result === 'win' ? '🏆 فزتَ!' : result === 'draw' ? '🤝 تعادل' : 'فاز الرازي') : busy ? 'ابن الرازي يفكّر…' : chk ? (S.turn === me ? 'شاه! احمِ ملكك' : 'شاه!') : S.turn === me ? 'دورك' : 'دور ابن الرازي';
    const pairs = []; for (let i = 0; i < sans.length; i += 2) pairs.push(`<li><span>${i / 2 + 1}.</span><b>${sans[i]}</b><b>${sans[i + 1] || ''}</b></li>`);
    root.innerHTML = `<div class="ch${over ? ' over' : ''}${busy ? ' busy' : ''}">
      <div class="ch-main">${bar(false)}<div class="ch-boardwrap"><div class="ch-board" id="chb">${sq}</div>${promoPick ? `<div class="ch-promo"><p>اختر القطعة</p>${[Q, R, B, N].map(t => `<button data-pr="${t}"><span class="pc ${me > 0 ? 'w' : 'b'}">${GL[t]}\uFE0E</span></button>`).join('')}</div>` : ''}</div>${bar(true)}
        <div class="ch-ctl"><button class="btn" id="ch-new">لعبة جديدة</button><button class="btn alt" id="ch-undo"${S.hist.length < (me > 0 ? 2 : 3) || busy ? ' disabled' : ''}>تراجع</button><button class="btn alt" id="ch-hint"${busy || over || S.turn !== me ? ' disabled' : ''}>تلميح</button><button class="btn alt" id="ch-flip">اقلب الرقعة</button></div></div>
      <aside class="ch-side">
        <div class="ch-card ch-status${over ? ' end' : ''}"><div class="st">${status}</div><div class="evb" title="الأفضلية"><span style="width:${me > 0 ? pct : 100 - pct}%"></span></div></div>
        <div class="ch-card ch-say"><span class="av">${face ? `<img src="${face}" alt="">` : ''}</span><p>${say}</p></div>
        <div class="ch-card"><h4>مستوى ابن الرازي</h4><div class="seg" id="ch-lv">${LV.map((l, k) => `<button data-lv="${k}" class="${k === level ? 'on' : ''}">${l.n}</button>`).join('')}</div>
          <h4>لونك</h4><div class="seg" id="ch-col"><button data-c="1" class="${me > 0 ? 'on' : ''}">الأبيض</button><button data-c="-1" class="${me < 0 ? 'on' : ''}">الأسود</button></div><small class="hintx">يُطبَّق اللون واللعبة الجديدة عند الضغط على «لعبة جديدة».</small></div>
        <div class="ch-card"><h4>النقلات</h4><ol class="mvs" id="ch-mv">${pairs.join('') || '<li class="empty">لم تبدأ بعد</li>'}</ol></div>
      </aside></div>`;
    const mv = root.querySelector('#ch-mv'); if (mv) mv.scrollTop = mv.scrollHeight;
  }
  root.onclick = e => {
    const t = e.target.closest('button'); if (!t) return;
    if (t.dataset.i !== undefined) return click(+t.dataset.i);
    if (t.dataset.pr) { const m = promoPick.find(x => x.pr === +t.dataset.pr); return apply(m, false); }
    if (t.id === 'ch-new') return newGame();
    if (t.id === 'ch-undo') return undo();
    if (t.id === 'ch-hint') return hint();
    if (t.id === 'ch-flip') { orient = -orient; return render(); }
    if (t.dataset.lv !== undefined) { level = +t.dataset.lv; try { localStorage.setItem('kh-chess-lvl', level); } catch (x) {} return render(); }
    if (t.dataset.c !== undefined) { me = +t.dataset.c; return render(); }
  };
  newGame();
}
IMPL.chess = chessGame;
chessGame.__t = { newState, gen, legal, make, unmake, attacked, think, evaluate, inCheck };
})();
