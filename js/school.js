/* الخوارزمي 4.4 — وضع المدرسة
   TCH: أنشطة المعلّم مع الطالب لكل عالم (مقابلة تمثيلية + مشروع). أما الأسئلة الشفهية فتأتي من اختبار العالم (QZ في modes.js).
   REC: سجلّ الطالب، يُحفظ في المتصفح (localStorage) لكل عالم على حدة: ما قرأه، نتائج الأنشطة، إجاباته، ملاحظات المعلّم.
   الصفحات: الرئيسية للمدرسة، lessons.html (الدروس)، teacher.html (دليل المعلّم)، record.html (سجلّ الطالب). */

const TCH = {
  khwarizmi: { iv: [['أين عملتَ في بغداد، وما هو بيت الحكمة؟', 'عملتُ في بيت الحكمة، وهو مركز للترجمة والعلم رعاه الخليفة المأمون.'], ['ماذا تعني كلمة «الجبر» في عنوان كتابك؟', 'تعني إكمال النقص في المعادلة.']],
    proj: 'اختر مسألة بسيطة (مثل توزيع ٢٠ قطعة حلوى على ٤ أصدقاء) واكتب خطوات حلّها مرتّبة، كما تفعل الخوارزمية.' },
  idrisi: { iv: [['كيف جمعتَ أخبار بلاد لم تزرها؟', 'سألتُ الرحالة والتجار والبحارة وقارنتُ أخبارهم ببعضها نحو خمسة عشر عاماً.'], ['كيف قسّمتَ الأرض في خريطتك؟', 'إلى سبعة أقاليم، وكل إقليم إلى عشرة أجزاء.']],
    proj: 'ارسم خريطة بسيطة لمدرستك أو حيّك، وقسّمها إلى أجزاء مرقّمة كما فعل الإدريسي.' },
  farabi: { iv: [['لماذا لقّبوك بالمعلّم الثاني؟', 'لأنني شرحتُ كتب أرسطو وفتحتُ بابها للقرّاء العرب.'], ['ما المدينة الفاضلة التي كتبتَ عنها؟', 'مجتمع يقوم على العلم والعدل والتعاون بين الناس.']],
    proj: 'اكتب فقرة قصيرة تصف «فصلاً فاضلاً» تتخيّله: ما القواعد التي تجعله عادلاً ومتعاوناً؟' },
  biruni: { iv: [['كيف قستَ نصف قطر الأرض؟', 'قستُ ارتفاع جبل ثم زاوية انخفاض الأفق من قمته، وحسبتُ بعلم المثلثات.'], ['لماذا تعلّمتَ لغة الهند؟', 'لأكتب عن علومها وعاداتها بدقة وإنصاف.']],
    proj: 'راقب القمر ثلاث ليالٍ متتالية، وارسم شكله كل ليلة ودوّن ملاحظاتك.' },
  haithm: { iv: [['ماذا أثبتَّ عن الرؤية؟', 'أن الضوء ينعكس من الأجسام ثم يدخل العين، فنراها.'], ['كيف تعمل غرفتك المظلمة؟', 'ثقب صغير في غرفة مظلمة يُظهر صورة المشهد الخارجي مقلوبة على الجدار.']],
    proj: 'اصنع كاميرا ثقب من علبة كرتون وورقة شفافة، ثم صِف ما رأيته على الورقة.' },
  sina: { iv: [['ما أشهر كتبك في الطب؟', '«القانون في الطب»، وقد ظلّ مرجعاً قروناً.'], ['ماذا في كتاب «الشفاء»؟', 'موسوعة في المنطق والطبيعيات والرياضيات والإلهيات.']],
    proj: 'اصنع بطاقة تعريف بكتاب «القانون في الطب»: من ألّفه، وماذا فيه، ولماذا بقي مرجعاً.' },
  maqrizi: { iv: [['ماذا وصفتَ في كتاب «المواعظ والاعتبار»؟', 'أحياء القاهرة وأسواقها ومساجدها وقصورها وكيف تغيّرت.'], ['ماذا تناولتَ في «إغاثة الأمة»؟', 'أسباب الغلاء والمجاعات في مصر.']],
    proj: 'ابحث عن شارع أو سوق قديم في مدينتك، واكتب عنه «خِطّة» صغيرة: متى نشأ وماذا كان فيه.' },
  razi: { iv: [['كيف كنتَ تفرّق بين الجدري والحصبة؟', 'بالملاحظة الدقيقة للأعراض وتدوينها ومقارنتها.'], ['من كنتَ تعالج؟', 'الفقراء والأغنياء على السواء.']],
    proj: 'راقب نبتة أو حالة الطقس ثلاثة أيام، ودوّن ملاحظاتك يومياً ثم قارن بينها كما كان يفعل الرازي.' }
};

const ITEMS = [['read', 'قراءة الكتاب'], ['oral', 'الأسئلة الشفهية'], ['iv', 'المقابلة'], ['share', 'فكّر–زاوج–شارك'], ['proj', 'المشروع'], ['fill', 'أكمل الجمل'], ['terms', 'المصطلحات'], ['quiz', 'الاختبار']];
const GRADES = ['', 'ممتاز', 'جيد', 'يحتاج متابعة'];

const REC = {
  KEY: 'kh-school',
  all() { try { const d = JSON.parse(localStorage.getItem(this.KEY)); if (d && d.s) return d; } catch (e) { } return { student: { name: '', grade: '' }, s: {} }; },
  save(d) { try { localStorage.setItem(this.KEY, JSON.stringify(d)); } catch (e) { } },
  get(id) { return this.all().s[id] || {}; },
  set(id, p) { const d = this.all(); d.s[id] = Object.assign({}, d.s[id], p, { at: Date.now() }); this.save(d); },
  best(id, k, sc, t) { const o = this.get(id)[k]; if (!o || sc / t >= o.b / o.t) this.set(id, { [k]: { b: sc, t } }); },
  quiz(id, sc, t) { this.best(id, 'quiz', sc, t); },
  student() { return this.all().student; },
  setStudent(p) { const d = this.all(); d.student = Object.assign({}, d.student, p); this.save(d); },
  ok(r, k) { switch (k) { case 'read': return !!r.read; case 'oral': return !!(r.oral && r.oral.t); case 'iv': return !!r.iv; case 'share': return !!(r.share && r.share.trim()); case 'proj': return !!r.proj; default: return !!(r[k] && r[k].b / r[k].t >= .6); } },
  n(id) { const r = this.get(id); return ITEMS.filter(([k]) => this.ok(r, k)).length; },
  pct(id) { return Math.round(this.n(id) / ITEMS.length * 100); }
};
const deb = (f, ms = 500) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => f(...a), ms); }; };
const sc2 = o => o && o.t ? `${AR(o.b)} / ${AR(o.t)}` : '—';
const pbar = p => `<div class="pbar2"><i style="width:${p}%"></i></div>`;
const schoolChip = id => `<div class="schip">${pbar(REC.pct(id))}<span>تقدّم الدرس: ${AR(REC.n(id))} من ${AR(ITEMS.length)}</span></div>`;

/* ===== الرئيسية للمدرسة ===== */
function homeSchool() {
  shell('home'); setTimeout(reveal, 0);
  const done = SCHOLARS.filter(s => REC.pct(s.id) === 100).length, acts = SCHOLARS.reduce((a, s) => a + REC.n(s.id), 0), st = REC.student();
  const PAIR = [['الأسئلة الشفهية', 'المعلّم يسأل والطالب يجيب، والمعلّم يضغط ✔ أو ✘.', 'inkwell'], ['المقابلة التمثيلية', 'الطالب يصبح العالم ويجيب عن أسئلة المعلّم.', 'oud'], ['فكّر – زاوج – شارك', 'يكتب الطالب رأيه ثم يناقشه مع المعلّم.', 'stars'], ['مشروع صغير', 'نشاط عملي لكل عالم، ويضع المعلّم تقديره.', 'compass']];
  $('#app').innerHTML = `
  <section class="sch-hero"><div class="wrap"><div class="board"><h1>${st.name ? `أهلاً ${st.name}` : 'أهلاً بالمعلّم والطالب'}</h1>
    <p>درس لكل عالم، وأنشطة يقوم بها المعلّم مع الطالب، وسجلّ يحفظ كل شيء.</p>
    <div class="cta"><a class="btn gold" href="lessons.html">ابدأ درساً</a><a class="btn alt" href="teacher.html">دليل المعلّم</a><a class="btn alt" href="record.html">سجلّ الطالب</a></div></div></div></section>
  <section class="sec"><div class="wrap"><div class="stats"><div><b>${AR(done)}</b><span>من ${AR(SCHOLARS.length)} دروس مكتملة</span></div><div><b>${AR(acts)}</b><span>من ${AR(SCHOLARS.length * ITEMS.length)} نشاطاً منجزاً</span></div><div><b>${AR(ITEMS.length)}</b><span>أنشطة في كل درس</span></div></div></div></section>
  <section class="sec white"><div class="wrap">${title('الدروس', 'ثمانية دروس، درس لكل عالم.')}<div class="grid4">${SCHOLARS.map(lessonCard).join('')}</div></div></section>
  <section class="sec"><div class="wrap">${title('أنشطة المعلّم مع الطالب', 'في كل درس أربعة أنشطة يقوم بها الاثنان معاً.')}
    <div class="grid4">${PAIR.map(([t, d, a]) => `<div class="gt"><div class="pic">${pic(ART(a))}</div><div class="tx"><h3>${t}</h3><p>${d}</p></div></div>`).join('')}</div></div></section>`;
}
function lessonCard(s) {
  const n = REC.n(s.id);
  return `<a class="sc lc" href="lessons.html?s=${s.id}">${archBox(s)}<h3>${s.name}</h3><div class="f">${s.field}</div>${pbar(REC.pct(s.id))}<div class="go">${n ? `${AR(n)} من ${AR(ITEMS.length)} — تابع الدرس` : 'ابدأ الدرس'}</div></a>`;
}

/* ===== الدروس ===== */
function lessonsPage() {
  shell('lessons');
  const q = new URLSearchParams(location.search), a = q.get('a'), s = byId(q.get('s')), B = 'الدروس', H = 'lessons.html';
  if (a === 'order') { const r = actShell('رتّب العلماء زمنياً', 'تواريخ الميلاد تقريبية.', H, B); return orderGame(r, SCHOLARS.map(x => ({ t: x.name, y: BORN[x.id] })), (sc, t, again) => fin(r, sc, t, again, H, B)); }
  if (a === 'terms') { const r = actShell('مصطلحات الدروس', 'طابق المصطلح مع تعريفه.', H, B); return matchGame(r, () => shuf(SCHOLARS.flatMap(x => SCH[x.id].vocab.map(([t, d]) => ({ k: t, a: t, b: d })))).slice(0, 6), (sc, t, again) => fin(r, sc, t, again, H, B)); }
  if (s) return lessonPage(s);
  setTimeout(reveal, 0);
  const st = REC.student();
  $('#app').innerHTML = `<section class="ph2"><div class="wrap"><h1>الدروس</h1><p>ثمانية دروس، وكل ما يفعله الطالب في كل درس يُحفظ في سجلّه.</p></div><div class="band"></div></section>
  <section class="sec"><div class="wrap"><div class="stcard"><label>اسم الطالب <input id="stn" value="${st.name || ''}" placeholder="اكتب الاسم"></label><label>الصف <input id="stg" value="${st.grade || ''}" placeholder="مثال: الخامس"></label><a class="btn alt" href="record.html">سجلّ الطالب</a></div>
    <div class="grid4">${SCHOLARS.map(lessonCard).join('')}</div>
    <p style="text-align:center;margin-top:30px"><a class="btn alt" href="lessons.html?a=order">رتّب العلماء زمنياً</a> <a class="btn alt" href="lessons.html?a=terms">مصطلحات الدروس</a> <a class="btn alt" href="play.html?g=quiz-all">اختبار الصف</a></p></div></section>`;
  const sv = deb(() => REC.setStudent({ name: $('#stn').value.trim(), grade: $('#stg').value.trim() }), 300);
  $('#stn').oninput = sv; $('#stg').oninput = sv;
}

/* ===== درس عالم: أنشطة المعلّم مع الطالب، وكل شيء يُحفظ ===== */
function lessonPage(s) {
  const D = SCH[s.id], T = TCH[s.id], Q = quizOf(s.id).map(x => ({ q: x.q, a: x.o[0] })), H = `lessons.html?s=${s.id}`, L = ['أ', 'ب', 'ج'], defs = shuf(D.vocab.map(v => v[1])), r0 = REC.get(s.id);
  const nx = SCHOLARS[(SCHOLARS.indexOf(s) + 1) % SCHOLARS.length];
  document.title = `درس ${s.name} — الخوارزمي`;
  $('#app').innerHTML = `<section class="ph2"><div class="wrap"><h1>درس: ${s.name}</h1><p>${s.field} — ${s.years}</p></div><div class="band"></div></section>
  <div class="lprog"><div class="wrap"><span>تقدّم الدرس: <b id="pn"></b> من ${AR(ITEMS.length)}</span>${pbar(0)}<small id="svd">يُحفظ تلقائياً على هذا الجهاز</small></div></div>
  <section class="sec"><div class="wrap lesson">
    <div class="lcard"><h3>أهداف الدرس <em class="tm">٤٥ دقيقة</em></h3><p>في نهاية الدرس يستطيع الطالب أن:</p><ul>${D.goals.map(g => `<li>${g}</li>`).join('')}</ul></div>
    <div class="lcard"><h3>ملخّص الدرس</h3><p>${s.intro}</p><div class="row" style="margin-top:12px"><button class="btn" id="openbook">اقرأ كتاب ${s.name}</button><a class="btn alt" href="scholar.html?s=${s.id}">صفحة العالم</a></div></div>
    <div class="lcard"><h3>مفردات الدرس</h3><dl>${D.vocab.map(([t, d]) => `<dt>${t}</dt><dd>${d}</dd>`).join('')}</dl></div>
    <div class="lcard act"><h3><i>١</i> أسئلة شفهية <em class="tm">المعلّم يسأل والطالب يجيب</em></h3><p>اقرأ السؤال للطالب. بعد إجابته أظهر الإجابة الصحيحة، ثم سجّل ✔ أو ✘.</p><div class="stage" id="oral"></div></div>
    <div class="lcard act"><h3><i>٢</i> المقابلة: الطالب هو ${s.name} <em class="tm">تمثيل أدوار</em></h3><p>يتقمّص الطالب شخصية العالم ويجيب بصيغة «أنا». المعلّم يسأل:</p>
      ${T.iv.map(([q, a]) => `<div class="iv"><p><b>المعلّم:</b> ${q}</p><button class="btn alt sm" data-rv>إجابة نموذجية</button><p class="ans" hidden>${a}</p></div>`).join('')}
      <label class="chk"><input type="checkbox" id="ivd" ${r0.iv ? 'checked' : ''}> أنجزنا المقابلة</label></div>
    <div class="lcard act"><h3><i>٣</i> فكّر – زاوج – شارك <em class="tm">نقاش</em></h3><p><b>${D.disc[0]}</b></p>
      <label class="fl">إجابة الطالب<textarea id="shr" rows="3" placeholder="يكتب الطالب إجابته هنا">${r0.share || ''}</textarea></label>
      <div class="row"><button class="btn alt sm" data-rv>إجابة نموذجية للمعلّم</button></div><p class="ans" hidden>${D.disc[1]}</p>
      <label class="fl">تعليق المعلّم<textarea id="fbk" rows="2" placeholder="تعليق المعلّم على الإجابة">${r0.fb || ''}</textarea></label></div>
    <div class="lcard act"><h3><i>٤</i> مشروع صغير <em class="tm">واجب أو نشاط صفّي</em></h3><p>${T.proj}</p>
      <div class="row"><label class="chk"><input type="checkbox" id="pjd" ${r0.proj ? 'checked' : ''}> أنجز الطالب المشروع</label>
      <label class="fl in">تقدير المعلّم <select id="grd">${GRADES.map(g => `<option ${g === (r0.grade || '') ? 'selected' : ''}>${g}</option>`).join('')}</select></label></div></div>
    <div class="lcard act"><h3><i>٥</i> تمارين فردية</h3><div class="row"><button class="btn" id="a-fill">أكمل الجمل</button><button class="btn" id="a-terms">طابق المصطلحات</button><a class="btn alt" href="quiz.html?s=${s.id}">اختبار الدرس</a><button class="btn alt" id="prn">اطبع ورقة العمل</button></div>
      <p class="best" id="best"></p><div class="stage" id="stg" hidden><div id="game"></div></div></div>
    <div class="lcard"><h3>ملاحظات</h3><label class="fl">ملاحظات الطالب<textarea id="nsd" rows="2" placeholder="ماذا تعلّمتُ اليوم؟">${r0.ns || ''}</textarea></label>
      <label class="fl">ملاحظات المعلّم<textarea id="ntc" rows="2" placeholder="ملاحظات المعلّم عن الطالب في هذا الدرس">${r0.nt || ''}</textarea></label></div>
    <div class="nextprev"><a href="lessons.html"><span>→</span><div><small>الدروس</small>كل الدروس</div></a><a href="lessons.html?s=${nx.id}"><div><small>الدرس التالي</small>${nx.name}</div><span>←</span></a></div>
  </div></section>
  <div class="ws"><h2>ورقة عمل: ${s.name}</h2><p>الاسم: ${REC.student().name || '______________'} &nbsp; الصف: ${REC.student().grade || '________'} &nbsp; التاريخ: ________</p>
    <h3>١) أكمل الفراغ بالكلمة المناسبة</h3><ol>${D.blanks.map(([t, ...o]) => `<li>${t}<br><small>(${shuf(o).join(' / ')})</small></li>`).join('')}</ol>
    <h3>٢) صِل كل مصطلح بتعريفه (اكتب حرف التعريف)</h3><div class="cols"><ol>${D.vocab.map(v => `<li>${v[0]} : ______</li>`).join('')}</ol><ol type="1" style="list-style:none">${defs.map((d, k) => `<li>${L[k]}) ${d}</li>`).join('')}</ol></div>
    <h3>٣) سؤال</h3><p>${D.disc[0]}</p><div class="ln"></div><div class="ln"></div><div class="ln"></div></div>`;

  /* الحفظ والتقدّم */
  const refresh = () => {
    const r = REC.get(s.id), n = REC.n(s.id);
    $('#pn').textContent = AR(n); $('.lprog .pbar2 i').style.width = REC.pct(s.id) + '%';
    $('#best').innerHTML = `أفضل نتيجة — أكمل الجمل: <b>${sc2(r.fill)}</b> · المصطلحات: <b>${sc2(r.terms)}</b> · الاختبار: <b>${sc2(r.quiz)}</b>`;
  };
  const flash = () => { const e = $('#svd'); e.textContent = 'تم الحفظ ✔'; e.classList.add('ok'); setTimeout(() => { e.textContent = 'يُحفظ تلقائياً على هذا الجهاز'; e.classList.remove('ok'); }, 1400); };
  const save = p => { REC.set(s.id, p); flash(); refresh(); };
  const text = (id, key) => { $(id).oninput = deb(() => save({ [key]: $(id).value })); };
  text('#shr', 'share'); text('#fbk', 'fb'); text('#nsd', 'ns'); text('#ntc', 'nt');
  $('#ivd').onchange = e => save({ iv: e.target.checked ? 1 : 0 });
  $('#pjd').onchange = e => save({ proj: e.target.checked ? 1 : 0 });
  $('#grd').onchange = e => save({ grade: e.target.value });
  $$('[data-rv]').forEach(b => b.onclick = () => { const a = b.closest('.iv') ? b.nextElementSibling : b.closest('.row').nextElementSibling; a.hidden = !a.hidden; });

  /* الأسئلة الشفهية */
  let qs = shuf(Q), i = 0, c = 0;
  const oral = () => {
    const el = $('#oral');
    if (i >= qs.length) {
      REC.best(s.id, 'oral', c, qs.length); flash(); refresh();
      el.innerHTML = `<div class="end"><div class="big">${AR(c)} / ${AR(qs.length)}</div><p>حُفظت النتيجة في سجلّ الطالب.</p><button class="btn alt" id="oagain">أعد الأسئلة</button></div>`;
      $('#oagain').onclick = () => { qs = shuf(Q); i = 0; c = 0; oral(); }; return;
    }
    el.innerHTML = `${bar(el, `السؤال <b>${AR(i + 1)}</b> من ${AR(qs.length)}`, `الصحيح <b>${AR(c)}</b>`)}<div class="q">${qs[i].q}</div><p class="ans" hidden>إجابة المعلّم: <b>${qs[i].a}</b></p>
      <div class="row" style="justify-content:center"><button class="btn alt" id="osh">أظهر الإجابة (للمعلّم)</button><button class="btn" id="ook" hidden>✔ أجاب صحيحاً</button><button class="btn alt" id="ono" hidden>✘ يحتاج مراجعة</button></div>`;
    $('#osh').onclick = () => { $('.ans', el).hidden = false; $('#osh').hidden = true; $('#ook').hidden = false; $('#ono').hidden = false; };
    $('#ook').onclick = () => { c++; i++; oral(); }; $('#ono').onclick = () => { i++; oral(); };
  };
  oral();

  /* التمارين الفردية */
  const st = $('#stg'), g = $('#game'), run = fn => { st.hidden = false; fn(); st.scrollIntoView({ behavior: 'smooth', block: 'center' }); };
  const done = key => (sc, t, again) => fin(g, sc, t, again, H, 'العودة للدرس', false, { save: (a, b) => { REC.best(s.id, key, a, b); flash(); refresh(); } });
  $('#a-fill').onclick = () => run(() => runQuiz(g, shuf(D.blanks).map(([q, ...o]) => ({ q, o })), done('fill')));
  $('#a-terms').onclick = () => run(() => matchGame(g, () => D.vocab.map(([t, d]) => ({ k: t, a: t, b: d })), done('terms')));
  $('#prn').onclick = () => print();
  reader(s, nx); $('#openbook').onclick = () => openReader();
  refresh();
}

/* ===== دليل المعلّم ===== */
function teacherPage() {
  shell('teacher'); setTimeout(reveal, 0);
  const PLAN = [['٥ د', 'تمهيد', 'اقرأ أهداف الدرس مع الطالب واسأله عمّا يعرفه عن العالم.'], ['١٠ د', 'قراءة', 'يقرأ الطالب كتاب العالم، ثم تراجعان مفردات الدرس.'], ['٨ د', 'أسئلة شفهية', 'تسأل ويجيب الطالب، وتضغط ✔ أو ✘ بعد كل إجابة.'], ['٨ د', 'مقابلة تمثيلية', 'الطالب يتقمّص العالم ويجيب بصيغة «أنا».'], ['٧ د', 'فكّر – زاوج – شارك', 'يكتب الطالب رأيه ثم تناقشانه، وتكتب تعليقك.'], ['٧ د', 'ختام', 'تمرين فردي أو اختبار، وملاحظاتك، ثم المشروع واجباً.']];
  const ACTS = [['أسئلة شفهية', 'يقرأ السؤال ويسجّل ✔ أو ✘', 'يجيب شفهياً', 'عدد الإجابات الصحيحة'], ['المقابلة', 'يسأل ويقارن بالإجابة النموذجية', 'يجيب بدور العالم', 'إنجاز المقابلة'], ['فكّر – زاوج – شارك', 'يناقش ويكتب تعليقاً', 'يكتب إجابته', 'إجابة الطالب وتعليق المعلّم'], ['مشروع صغير', 'يضع التقدير', 'ينفّذ المشروع', 'الإنجاز والتقدير']];
  $('#app').innerHTML = `<section class="ph2"><div class="wrap"><h1>دليل المعلّم</h1><p>كل ما تحتاجه لتدير حصة عن عالم مع الطالب.</p></div><div class="band"></div></section>
  <section class="sec"><div class="wrap">${title('كيف تستخدم الدروس', 'ثلاث خطوات.')}
    <div class="grid3"><div class="gt"><div class="tx"><h3>١) اختر العالم</h3><p>من صفحة الدروس. لكل عالم درس كامل بالأنشطة.</p></div></div><div class="gt"><div class="tx"><h3>٢) اعملا معاً</h3><p>نفّذا الأنشطة الأربعة واحداً بعد الآخر بين المعلّم والطالب.</p></div></div><div class="gt"><div class="tx"><h3>٣) راجع السجلّ</h3><p>كل شيء يُحفظ تلقائياً، ويمكنك طباعة تقرير من سجلّ الطالب.</p></div></div></div></div></section>
  <section class="sec white"><div class="wrap">${title('خطة حصة من ٤٥ دقيقة')}<div class="tbl"><table><thead><tr><th>الوقت</th><th>الخطوة</th><th>ماذا تفعل؟</th></tr></thead><tbody>${PLAN.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div></section>
  <section class="sec"><div class="wrap">${title('الأنشطة بين المعلّم والطالب')}<div class="tbl"><table><thead><tr><th>النشاط</th><th>المعلّم</th><th>الطالب</th><th>ما يُحفظ</th></tr></thead><tbody>${ACTS.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div></section>
  <section class="sec white"><div class="wrap">${title('أنشطة للصف كله')}<div class="grid3">
    <a class="gt" href="lessons.html?a=order"><div class="pic">${pic(ART('astrolabe'))}</div><div class="tx"><h3>رتّب العلماء زمنياً</h3><p>رتّبوا العلماء حسب سنة الميلاد.</p></div></a>
    <a class="gt" href="lessons.html?a=terms"><div class="pic">${pic(ART('inkwell'))}</div><div class="tx"><h3>مصطلحات الدروس</h3><p>طابقوا كل مصطلح مع تعريفه.</p></div></a>
    <a class="gt" href="play.html?g=quiz-all"><div class="pic">${pic(ART('stars'))}</div><div class="tx"><h3>اختبار الصف</h3><p>عشرة أسئلة عن كل العلماء.</p></div></a></div></div></section>
  <section class="sec"><div class="wrap">${title('اذهب إلى الدرس')}<div class="grid4">${SCHOLARS.map(lessonCard).join('')}</div></div></section>`;
}

/* ===== سجلّ الطالب ===== */
function recordPage() {
  shell('record'); setTimeout(reveal, 0);
  const st = REC.student(), total = SCHOLARS.length * ITEMS.length, got = SCHOLARS.reduce((a, s) => a + REC.n(s.id), 0), pct = Math.round(got / total * 100);
  const qs = SCHOLARS.map(s => REC.get(s.id).quiz).filter(Boolean), avg = qs.length ? Math.round(qs.reduce((a, o) => a + o.b / o.t, 0) / qs.length * 100) : null;
  const card = s => {
    const r = REC.get(s.id);
    return `<div class="rec"><div class="rh"><h3>${s.name}</h3><span>${AR(REC.n(s.id))} من ${AR(ITEMS.length)}</span></div>${pbar(REC.pct(s.id))}
      <ul class="chips">${ITEMS.map(([k, t]) => `<li class="${REC.ok(r, k) ? 'y' : ''}">${REC.ok(r, k) ? '✔' : '○'} ${t}</li>`).join('')}</ul>
      <p class="sc3">شفهي: <b>${sc2(r.oral)}</b> · أكمل الجمل: <b>${sc2(r.fill)}</b> · المصطلحات: <b>${sc2(r.terms)}</b> · الاختبار: <b>${sc2(r.quiz)}</b>${r.grade ? ` · تقدير المشروع: <b>${r.grade}</b>` : ''}</p>
      ${r.share ? `<p class="nt"><b>إجابة الطالب:</b> ${esc(r.share)}</p>` : ''}${r.fb ? `<p class="nt"><b>تعليق المعلّم:</b> ${esc(r.fb)}</p>` : ''}${r.ns ? `<p class="nt"><b>ملاحظات الطالب:</b> ${esc(r.ns)}</p>` : ''}${r.nt ? `<p class="nt"><b>ملاحظات المعلّم:</b> ${esc(r.nt)}</p>` : ''}
      <a class="btn alt sm noprint" href="lessons.html?s=${s.id}">افتح الدرس</a></div>`;
  };
  $('#app').innerHTML = `<section class="ph2"><div class="wrap"><h1>سجلّ الطالب</h1><p>كل ما فعله الطالب مع كل عالم، محفوظ هنا.</p></div><div class="band"></div></section>
  <section class="sec"><div class="wrap"><div class="stcard"><label>اسم الطالب <input id="stn" value="${esc(st.name || '')}" placeholder="اكتب الاسم"></label><label>الصف <input id="stg" value="${esc(st.grade || '')}" placeholder="مثال: الخامس"></label><span class="dt">${new Date().toLocaleDateString('ar-EG')}</span></div>
    <div class="stats"><div><b>${AR(pct)}٪</b><span>الإنجاز الكلي (${AR(got)} من ${AR(total)})</span></div><div><b>${avg == null ? '—' : AR(avg) + '٪'}</b><span>متوسط الاختبارات</span></div><div><b>${AR(SCHOLARS.filter(s => REC.pct(s.id) === 100).length)}</b><span>دروس مكتملة</span></div></div>
    <div class="recs">${SCHOLARS.map(card).join('')}</div>
    <p class="noprint" style="text-align:center;margin-top:30px"><button class="btn" id="prt">اطبع التقرير</button> <button class="btn alt" id="exp">حفظ نسخة احتياطية</button> <label class="btn alt" style="cursor:pointer">استرجاع نسخة<input type="file" id="imp" accept=".json,application/json" hidden></label> <button class="btn alt" id="clr">مسح السجلّ</button></p>
    <p class="noprint" style="text-align:center;color:var(--muted);font-size:.9rem">السجلّ محفوظ في هذا المتصفح على هذا الجهاز فقط. احفظ نسخة احتياطية إن أردت نقله.</p></div></section>`;
  const sv = deb(() => REC.setStudent({ name: $('#stn').value.trim(), grade: $('#stg').value.trim() }), 300);
  $('#stn').oninput = sv; $('#stg').oninput = sv;
  $('#prt').onclick = () => print();
  $('#exp').onclick = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(REC.all(), null, 1)], { type: 'application/json' })); a.download = 'khwarizmi-record.json'; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); };
  $('#imp').onchange = e => { const f = e.target.files[0]; if (!f) return; const rd = new FileReader(); rd.onload = () => { try { const d = JSON.parse(rd.result); if (!d || !d.s) throw 0; REC.save(d); location.reload(); } catch (x) { toast('الملف غير صالح'); } }; rd.readAsText(f); };
  $('#clr').onclick = () => { if (confirm('هل تريد مسح كل سجلّ الطالب؟ لا يمكن التراجع.')) { try { localStorage.removeItem(REC.KEY); } catch (x) { } location.reload(); } };
}
const esc = t => String(t).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

if (SCHOOL_ON) { PAGES.lessons = lessonsPage; PAGES.teacher = teacherPage; PAGES.record = recordPage; }
