/* الخوارزمي — المجتمع: ١٣ مجالاً، لكل مجال دردشة عامة ومنشورات (نص + صور) ودردشة خاصة (قريباً)
   يعتمد على اتصال Firebase في js/rewards.js (window.KHR) فلا يضيف اتصالاً ثانياً. */
(() => {
const ADMIN = 'algorithmy5050@gmail.com';   // نفس البريد في firestore.rules (دالة isAdmin)
const T = [
  { id: 'coding', h: 215, n: 'البرمجة', d: 'اكتب الشيفرة التي تحرّك التطبيقات والمواقع والألعاب.', idols: [['الخوارزمي', 'وضع قواعد الحساب بخطوات منظّمة، ومن اسمه جاءت كلمة «خوارزمية» أساس كل برنامج.'], ['بنو موسى', 'صمّموا في «كتاب الحيل» نايًا يعزف تلقائيًا بأسطوانة ذات نتوءات، وتُعدّ من أقدم الآلات القابلة للبرمجة.'], ['الجزري', 'صمّم في القرن الثالث عشر «ساعة القلعة» التي تُضبط فيها مدة النهار والليل ببرمجة ميكانيكية، ويعدّها كثيرون من أوائل الحواسيب التناظرية القابلة للبرمجة.']] },
  { id: 'ai', h: 265, n: 'الذكاء الاصطناعي والبيانات', d: 'علّم الآلات أن تتعلّم، واجعل البيانات تتكلّم.', idols: [['الخوارزمي', 'من اسمه جاءت كلمة «خوارزمية»، وهي وصفة الخطوات التي تقوم عليها كل خوارزميات التعلّم الآلي.'], ['الكندي', 'حلّل تكرار الحروف في الرسائل المشفّرة ليكشف معناها، وهي فكرة إحصائية سبقت تحليل البيانات الحديث بقرون.'], ['رنا الكليوبي', 'عالمة حاسوب مصرية شاركت في تأسيس شركة «أفكتيفا» التي تعلّم الآلات قراءة المشاعر من تعابير الوجه.']] },
  { id: 'eng', h: 30, n: 'الهندسة', d: 'ميكانيكا وكهرباء ومدني: صمّم ما يحتاجه الناس وابنِه.', idols: [['الجزري', 'مهندس القرن الثالث عشر، صاحب «الجامع بين العلم والعمل النافع في صناعة الحيل» والآلات المتحرّكة.'], ['تقي الدين الشامي', 'عالم عثماني وصف توربينًا بخاريًا بدائيًا في القرن السادس عشر وبنى ساعات ميكانيكية دقيقة.'], ['فضل الرحمن خان', 'مهندس إنشائي بنغلاديشي ابتكر «نظام الأنبوب» الذي بُني به برج سيرز في شيكاغو.']] },
  { id: 'med', h: 350, n: 'الطب والصحة', d: 'من الطبيب إلى الباحث: أنقذ الأرواح وحسّن حياة الناس.', idols: [['ابن سينا', 'مؤلف «القانون في الطب» الذي دُرّس قرونًا في الشرق والغرب.'], ['الزهراوي', 'جرّاح أندلسي رسم في «التصريف» مئات الأدوات الجراحية وشرح استعمالها.'], ['ابن النفيس', 'وصف الدورة الدموية الرئوية قبل الغرب بقرون.']] },
  { id: 'bio', h: 150, n: 'الأحياء والوراثة', d: 'اكتشف أسرار الحياة والجينات وعلاجات المستقبل.', idols: [['ابن زهر', 'طبيب أندلسي جرّب العمليات الجراحية على الحيوان قبل الإنسان، ووصف الأمراض بدقة.'], ['الجاحظ', 'ألّف «كتاب الحيوان» ودرس سلوك الحيوان وأثر البيئة فيه، ولاحظ السلسلة الغذائية.'], ['عزيز سنجر', 'عالم تركي نال نوبل في الكيمياء عام ٢٠١٥ لدراسته كيف تُصلح الخلية حمضها النووي.']] },
  { id: 'plants', h: 125, n: 'النباتات والزراعة', d: 'أطعم العالم وازرع الأمل: علم النبات والزراعة الذكية.', idols: [['ابن العوام', 'عالم أندلسي ألّف «كتاب الفلاحة»، وهو من أهم كتب الزراعة في العصور الوسطى.'], ['ابن البيطار', 'عالم نبات وصيدلة جمع مئات النباتات والأدوية في موسوعته.'], ['الدينوري', 'ألّف «كتاب النبات» ووصف فيه نباتات كثيرة وأطوار نموّها.']] },
  { id: 'space', h: 235, n: 'الفضاء والفيزياء', d: 'افهم الضوء والجاذبية والنجوم، واصعد إلى الفضاء.', idols: [['ابن الهيثم', 'صاحب «كتاب المناظر» وأحد من أرسوا المنهج التجريبي.'], ['البيروني', 'حسب نصف قطر الأرض بطريقة ذكية انطلاقًا من قمة جبل، ودرس الفلك والجغرافيا.'], ['فاروق الباز', 'عالم جيولوجيا مصري شارك ناسا في اختيار مواقع الهبوط على القمر.']] },
  { id: 'chem', h: 300, n: 'الكيمياء والمواد', d: 'من الأدوية إلى البطاريات: اصنع مواد جديدة تغيّر الحياة.', idols: [['جابر بن حيان', 'ارتبط اسمه بتطوير التجربة المخبرية والتقطير في الكيمياء المبكرة.'], ['الرازي', 'صنّف المواد وأدخل التجربة المنظّمة في الكيمياء، وكتب «سر الأسرار».'], ['أحمد زويل', 'عالم مصري نال نوبل في الكيمياء عام ١٩٩٩ لتصويره حركة الجزيئات.']] },
  { id: 'env', h: 175, n: 'البيئة والطاقة النظيفة', d: 'حلول للمناخ والماء والطاقة المتجددة لكوكب أنظف.', idols: [['الكرجي', 'ألّف «إنباط المياه الخفيّة» في كيفية استخراج المياه الجوفية وإدارتها.'], ['الجاحظ', 'لاحظ في «كتاب الحيوان» كيف يعيش الكائن في بيئته وكيف يأكل بعضها بعضًا في سلسلة غذائية.'], ['إبراهيم أبو العيش', 'مصري أسّس مشروع «سيكم» الذي حوّل أرضًا صحراوية إلى مزارع عضوية، ونال جائزة «الحق في كسب العيش» عام ٢٠٠٣.']] },
  { id: 'math', h: 45, n: 'الرياضيات', d: 'لغة العلوم كلها: منطق وأنماط وحلول.', idols: [['الخوارزمي', 'مؤسس علم الجبر، ومنه اشتُقّت كلمة «خوارزمية».'], ['عمر الخيام', 'حلّ معادلات من الدرجة الثالثة هندسيًا قبل قرون.'], ['أبو الوفاء البوزجاني', 'طوّر علم المثلثات ووضع جداول دقيقة للجيب والظل.']] },
  { id: 'cyber', h: 200, n: 'الأمن السيبراني', d: 'احمِ الناس والمعلومات في عالم رقمي مفتوح.', idols: [['الكندي', 'وضع أساس تحليل الشيفرات بتحليل تكرار الحروف في القرن التاسع.'], ['ابن الدريهم', 'ألّف في القرن الرابع عشر في الشيفرات والرموز السرية وطرق كشفها.'], ['القلقشندي', 'خصّص في موسوعته «صبح الأعشى» فصلًا لعلم الشيفرة والكتابة المعمّاة.']] },
  { id: 'biz', h: 20, n: 'ريادة الأعمال', d: 'حوّل الفكرة إلى مشروع ينفع الناس ويكبر.', idols: [['خديجة بنت خويلد', 'تاجرة ناجحة قادت تجارتها بنفسها وكانت أول من آمن بالرسالة.'], ['فاطمة الفهرية', 'أنفقت إرثها على بناء مسجد القرويين في فاس عام ٨٥٩م الذي صار جامعة عريقة.'], ['محمد يونس', 'أسس بنك غرامين للإقراض الصغير فأعان ملايين الفقراء، ونال نوبل للسلام.']] },
  { id: 'psy', h: 330, n: 'علم النفس والعقل', d: 'افهم نفسك والآخرين، وابنِ عقلاً أقوى وأهدأ.', idols: [['أبو زيد البلخي', 'كتب في القرن التاسع عن «طب النفس» وعلاج القلق والحزن.'], ['الغزالي', 'كتب عن تهذيب النفس وكيف تتشكّل العادات والانفعالات وكيف تُضبط.'], ['ابن حزم', 'ألّف «مداواة النفوس» في تهذيب الأخلاق وعلاج الهموم.']] }
];
const ico = k => (window.TOPIC_ICONS && TOPIC_ICONS[k]) || '';
const topicOf = id => T.find(t => t.id === id);
const K = () => window.KHR, F = () => K().F(), DB = () => K().db(), AU = () => K().auth(), ME = () => K().me();
const esc = s => K().esc(s);
const param = k => new URLSearchParams(location.search).get(k);
const msg = t => `<p class="rm">${t}</p>`;
const tm = d => { try { if (d && d.toDate) d = d.toDate(); if (!(d instanceof Date)) return ''; return d.toLocaleString('ar-EG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };
const isAdmin = () => !!AU() && AU().email === ADMIN;
let CUR = null, SUB = null, MEM = '';
K().on(() => CUR && CUR());
const unlisten = () => { if (SUB) { try { SUB(); } catch (e) { } SUB = null; } };

/* حالة الاتصال: fail / load / out / ok */
function gate() {
  if (K().fail()) return 'fail';
  if (!F() || AU() === undefined) return 'load';
  if (!AU()) return 'out';
  if (!ME()) return 'load';
  return 'ok';
}
const gateHtml = g => g === 'fail' ? `<div class="gate">${msg('تعذّر الاتصال بـ Firebase. تأكد من الإنترنت وافتح الموقع عبر http/https.')}</div>`
  : g === 'out' ? `<div class="gate"><h3>سجّل دخولك لتشارك</h3><p>الدردشة والمنشورات متاحة للأعضاء فقط. الحساب مجاني ويحفظ نقاطك أيضاً.</p><a class="btn" href="account.html">دخول / حساب جديد</a></div>`
    : `<div class="gate">${msg('جارٍ التحميل…')}</div>`;

/* تسجيل بريد العضو واسمه والمجال الحالي (تقرؤه أنت فقط في صفحة admin.html) */
async function ensureMember(topic) {
  const u = AU(); if (!u || !F() || !ME()) return;
  const name = ME().name, key = u.uid + '|' + (topic || '') + '|' + name; if (MEM === key) return; MEM = key;
  try {
    const f = F(), ref = f.doc(DB(), 'members', u.uid), s = await f.getDoc(ref), d = s.exists() ? s.data() : null;
    if (d && d.email === (u.email || '') && d.name === name && (!topic || d.topic === topic)) return;
    await f.setDoc(ref, { email: u.email || '', name, topic: topic || (d && d.topic) || '', j: d ? d.j : f.serverTimestamp(), t: f.serverTimestamp() });
  } catch (e) { console.error(e); MEM = ''; }
}

/* ===== صفحة المجالات ===== */
function topicsPage() {
  shell('topics'); document.title = 'المجتمع — الخوارزمي';
  let last = ''; try { last = localStorage.getItem('kh-topic') || ''; } catch (e) { }
  const lt = topicOf(last);
  $('#app').innerHTML = `<section class="sec"><div class="wrap">
    <header class="tbn"><i class="tbn-c tl"></i><i class="tbn-c tr"></i><i class="tbn-c bl"></i><i class="tbn-c br"></i>
      <small class="tbn-k">قسم المجتمع</small><h2>المجتمع</h2>
      <p>اختر مجالاً يشبهك، وتعرّف على قدواته، وتحدّث مع من يشاركونك الاهتمام. يمكنك الانتقال إلى مجال آخر في أي وقت.</p>
      <nav class="tchips" aria-label="اختر مجالك">${T.map(t => `<a class="tch${t.id === last ? ' cur' : ''}" href="topic.html?t=${t.id}" style="--h:${t.h}"><span class="tci">${ico(t.id)}</span>${t.n}</a>`).join('')}</nav>
    </header>
    ${lt ? `<a class="tcont" href="topic.html?t=${lt.id}" style="--h:${lt.h}"><span class="ti sm">${ico(lt.id)}</span><div><small>تابع من حيث توقفت</small><b>${lt.n}</b></div><i>←</i></a>` : ''}
    <div class="tgrid">${T.map(t => `<a class="tcard${t.id === last ? ' cur' : ''}" href="topic.html?t=${t.id}" style="--h:${t.h}"><div class="ti">${ico(t.id)}</div><h3>${t.n}</h3><p>${t.d}</p><span class="tgo">ادخل المجال</span></a>`).join('')}</div>
    <p class="tfoot">نعمل معاً: نتبادل الخبرة، ونسأل ونجيب، ونصير علماء جدداً يكملون طريق من سبقونا.</p>
  </div></section>`;
  CUR = () => { if (gate() === 'ok') ensureMember(''); };
  CUR();
}

/* ===== غرفة المجال ===== */
function topicPage() {
  const t = topicOf(param('t')); if (!t) { location.replace('topics.html'); return; }
  try { localStorage.setItem('kh-topic', t.id); } catch (e) { }
  document.title = `${t.n} — الخوارزمي`; shell('topics');
  let tab = location.hash.slice(1); if (!['chat', 'posts', 'private'].includes(tab)) tab = 'chat';
  const TABS = [['chat', 'الدردشة العامة'], ['posts', 'المنشورات'], ['private', 'دردشة خاصة <em>قريباً</em>']];
  $('#app').innerHTML = `<section class="sec"><div class="wrap">
    <div class="troom" style="--h:${t.h}"><div class="ti big">${ico(t.id)}</div><div class="tt"><h1>${t.n}</h1><p>${t.d}</p></div>
      <label class="tsw">غيّر المجال<select id="tsel">${T.map(x => `<option value="${x.id}"${x.id === t.id ? ' selected' : ''}>${x.n}</option>`).join('')}</select></label></div>
    <div class="idols" style="--h:${t.h}"><h2>قدوات هذا المجال</h2><div class="ig">${t.idols.map(([n, w], i) => `<div class="idol"><span class="in">${i + 1}</span><b>${n}</b><p>${w}</p></div>`).join('')}</div></div>
    <div class="ttabs" role="tablist">${TABS.map(([k, l]) => `<button role="tab" data-tab="${k}" class="${k === tab ? 'on' : ''}">${l}</button>`).join('')}</div>
    <div id="tp"></div></div></section>`;
  let built = '';
  CUR = () => {
    const g = gate(); if (g === 'ok') ensureMember(t.id);
    const key = g + ':' + (AU() ? AU().uid : '') + ':' + tab; if (key === built) return; built = key; unlisten();
    const p = $('#tp'); if (!p) return;
    if (tab === 'private') return p.innerHTML = `<div class="gate soon"><div class="ti big">${ico('lock')}</div><h3>الدردشة الخاصة — قريباً</h3><p>سنفتح قريباً محادثات خاصة بين شخصين في ${t.n}. لحين ذلك، شاركوا في الدردشة العامة والمنشورات.</p></div>`;
    if (g !== 'ok') return p.innerHTML = gateHtml(g);
    tab === 'chat' ? chat(t, p) : posts(t, p);
  };
  $$('.ttabs button').forEach(b => b.onclick = () => { tab = b.dataset.tab; history.replaceState(null, '', '#' + tab); $$('.ttabs button').forEach(x => x.classList.toggle('on', x === b)); CUR(); });
  $('#tsel').onchange = e => { location.href = 'topic.html?t=' + e.target.value + '#' + tab; };
  CUR();
}

/* ===== الدردشة العامة ===== */
function chat(t, p) {
  p.innerHTML = `<div class="cbox" id="cb" aria-live="polite">${msg('جارٍ التحميل…')}</div>
    <form class="cform" id="cf"><input name="x" maxlength="500" autocomplete="off" placeholder="اكتب رسالة لأبناء مجال ${t.n}…" required><button class="btn">إرسال</button></form>`;
  const cb = $('#cb'), f = F(); let first = true, lastSend = 0;
  const row = m => { const mine = m.u === AU().uid, can = mine || isAdmin();
    return `<div class="m${mine ? ' me' : ''}">${K().av(m.p, m.n, 34)}<div class="mb"><b>${esc(m.n)}</b><span>${esc(m.x)}</span><small>${tm(m.t)}${can ? `<button class="dx" data-del="${m.id}" title="حذف" aria-label="حذف الرسالة">×</button>` : ''}</small></div></div>`; };
  SUB = f.onSnapshot(f.query(f.collection(DB(), 'topics', t.id, 'chat'), f.orderBy('t', 'desc'), f.limit(60)), s => {
    const rows = s.docs.map(d => ({ id: d.id, ...d.data({ serverTimestamps: 'estimate' }) })).reverse();
    const near = first || cb.scrollHeight - cb.scrollTop - cb.clientHeight < 90; first = false;
    cb.innerHTML = rows.length ? rows.map(row).join('') : msg('لا رسائل بعد. كن أول من يبدأ الحديث!');
    if (near) cb.scrollTop = cb.scrollHeight;
  }, e => { console.error(e); cb.innerHTML = msg('تعذّر تحميل الدردشة. تأكد من نشر قواعد Firestore الجديدة (ملف firestore.rules).'); });
  $('#cf').onsubmit = async e => {
    e.preventDefault(); const inp = e.target.x, x = inp.value.trim(); if (!x || !ME()) return;
    if (Date.now() - lastSend < 1500) return toast('ببطء قليلاً من فضلك');
    lastSend = Date.now(); inp.value = '';
    try { await f.addDoc(f.collection(DB(), 'topics', t.id, 'chat'), { u: AU().uid, n: ME().name, p: ME().pfp, x: x.slice(0, 500), t: f.serverTimestamp() }); }
    catch (er) { console.error(er); inp.value = x; toast('تعذّر الإرسال. تأكد من نشر القواعد الجديدة.'); }
  };
  cb.onclick = async e => { const b = e.target.closest('[data-del]'); if (!b || !confirm('حذف هذه الرسالة؟')) return; try { await f.deleteDoc(f.doc(DB(), 'topics', t.id, 'chat', b.dataset.del)); } catch (er) { toast('تعذّر الحذف'); } };
}

/* ===== تصغير الصورة في المتصفح لتُحفظ داخل Firestore مجاناً (بلا Storage) ===== */
async function shrink(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = url; });
    let s = Math.min(1, 960 / Math.max(img.width, img.height)), q = .74, out = '';
    for (let k = 0; k < 7; k++) {
      const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(img.width * s)); c.height = Math.max(1, Math.round(img.height * s));
      const x = c.getContext('2d'); x.fillStyle = '#fff'; x.fillRect(0, 0, c.width, c.height); x.drawImage(img, 0, 0, c.width, c.height);
      out = c.toDataURL('image/jpeg', q); if (out.length <= 200000) break; s *= .85; q = Math.max(.5, q - .04);
    }
    if (out.length > 330000) throw new Error('big'); return out;
  } finally { URL.revokeObjectURL(url); }
}
const okImg = s => typeof s === 'string' && s.startsWith('data:image/jpeg;base64,');

/* ===== المنشورات (نص وصور معاً) ===== */
function posts(t, p) {
  let imgs = [], busy = false; const f = F();
  p.innerHTML = `<form class="pcomp" id="pf"><textarea name="x" maxlength="2000" rows="3" placeholder="شارك فكرة أو سؤالاً أو إنجازاً في مجال ${t.n}…"></textarea><div class="pimgs" id="pi"></div>
    <div class="pact"><label class="btn alt pick"><span class="ci">${ico('camera')}</span>أضف صوراً<input type="file" id="pfile" accept="image/*" multiple hidden></label><small id="pmsg">حتى ٣ صور</small><button class="btn" id="pgo">نشر</button></div></form>
    <div id="pl">${msg('جارٍ التحميل…')}</div>`;
  const pl = $('#pl'), pi = $('#pi'), pm = $('#pmsg');
  const prev = () => { pi.innerHTML = imgs.map((s, i) => `<div class="pv"><img src="${esc(s)}" alt=""><button type="button" data-rm="${i}" aria-label="إزالة الصورة">×</button></div>`).join(''); pm.textContent = imgs.length ? `${AR(imgs.length)} من ٣ صور` : 'حتى ٣ صور'; };
  $('#pfile').onchange = async e => {
    const fs = [...e.target.files]; e.target.value = '';
    for (const fl of fs) { if (imgs.length >= 3) { toast('الحد الأقصى ٣ صور'); break; } try { imgs.push(await shrink(fl)); prev(); } catch (er) { console.error(er); toast('تعذّر استخدام الصورة ' + fl.name); } }
  };
  pi.onclick = e => { const b = e.target.closest('[data-rm]'); if (b) { imgs.splice(+b.dataset.rm, 1); prev(); } };
  $('#pf').onsubmit = async e => {
    e.preventDefault(); if (busy) return; const x = e.target.x.value.trim();
    if (!x && !imgs.length) return toast('اكتب نصاً أو أضف صورة');
    busy = true; $('#pgo').disabled = true; pm.textContent = 'جارٍ النشر…';
    try { await f.addDoc(f.collection(DB(), 'topics', t.id, 'posts'), { u: AU().uid, n: ME().name, p: ME().pfp, x, imgs, t: f.serverTimestamp() }); e.target.x.value = ''; imgs = []; prev(); toast('تم النشر'); }
    catch (er) { console.error(er); toast('تعذّر النشر. تأكد من نشر القواعد الجديدة.'); }
    busy = false; $('#pgo').disabled = false; if (!imgs.length) pm.textContent = 'حتى ٣ صور';
  };
  /* الإعجابات: وثيقة لكل إعجاب باسم postId_uid (إعجاب واحد لكل عضو)، والعدّاد يُحسب من عدد الوثائق */
  let LC = {}, MINE = new Set(); const busyLk = new Set();
  const HEART = '<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z\"/></svg>';
  const likeBtn = id => `<button type=\"button\" class=\"lk${MINE.has(id) ? ' on' : ''}\" data-lk=\"${id}\" aria-pressed=\"${MINE.has(id)}\" aria-label=\"إعجاب\" title=\"إعجاب\">${HEART}<b>${AR(LC[id] || 0)}</b></button>`;
  const paintLikes = () => $$('#pl [data-lk]').forEach(b => { const id = b.dataset.lk, on = MINE.has(id); b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); b.lastElementChild.textContent = AR(LC[id] || 0); });
  const toggleLike = async id => {
    if (busyLk.has(id) || !AU()) return; busyLk.add(id);
    const ref = f.doc(DB(), 'topics', t.id, 'likes', id + '_' + AU().uid);
    try { if (MINE.has(id)) await f.deleteDoc(ref); else await f.setDoc(ref, { p: id, u: AU().uid, t: f.serverTimestamp() }); }
    catch (er) { console.error(er); toast('تعذّر الإعجاب. تأكد من نشر القواعد الجديدة (ملف firestore.rules).'); }
    busyLk.delete(id);
  };
  const card = m => { const can = m.u === AU().uid || isAdmin(), im = (m.imgs || []).filter(okImg);
    return `<article class="post"><header>${K().av(m.p, m.n, 40)}<div><b>${esc(m.n)}</b><small>${tm(m.t)}</small></div>${can ? `<button class="dx" data-del="${m.id}" title="حذف" aria-label="حذف المنشور">×</button>` : ''}</header>
      ${m.x ? `<p>${esc(m.x)}</p>` : ''}${im.length ? `<div class="pim n${im.length}">${im.map(s => `<img src="${esc(s)}" alt="صورة من منشور ${esc(m.n)}" loading="lazy">`).join('')}</div>` : ''}<div class="pfoot">${likeBtn(m.id)}</div></article>`; };
  const u1 = f.onSnapshot(f.query(f.collection(DB(), 'topics', t.id, 'posts'), f.orderBy('t', 'desc'), f.limit(30)), s => {
    const rows = s.docs.map(d => ({ id: d.id, ...d.data({ serverTimestamps: 'estimate' }) }));
    pl.innerHTML = rows.length ? rows.map(card).join('') : msg('لا منشورات بعد. شاركنا أول منشور في هذا المجال!');
  }, e => { console.error(e); pl.innerHTML = msg('تعذّر تحميل المنشورات. تأكد من نشر قواعد Firestore الجديدة (ملف firestore.rules).'); });
  const u2 = f.onSnapshot(f.query(f.collection(DB(), 'topics', t.id, 'likes'), f.limit(3000)), s => {
    LC = {}; MINE = new Set(); const me = AU() && AU().uid;
    s.docs.forEach(d => { const x = d.data(); if (!x || !x.p) return; LC[x.p] = (LC[x.p] || 0) + 1; if (x.u === me) MINE.add(x.p); });
    paintLikes();
  }, e => console.error(e));
  SUB = () => { u1(); u2(); };
  pl.onclick = async e => {
    const lk = e.target.closest('[data-lk]'); if (lk) return toggleLike(lk.dataset.lk);
    const b = e.target.closest('[data-del]'); if (b) { if (confirm('حذف هذا المنشور؟')) try { await f.deleteDoc(f.doc(DB(), 'topics', t.id, 'posts', b.dataset.del)); } catch (er) { toast('تعذّر الحذف'); } return; }
    const im = e.target.closest('.pim img'); if (im) { const o = document.createElement('div'); o.className = 'lbx'; o.innerHTML = `<img src="${esc(im.src)}" alt="">`; o.onclick = () => o.remove(); document.body.appendChild(o); }
  };
}

/* ===== لوحة المشرف: من انضم (بريد، اسم، مجال) ===== */
function adminPage() {
  shell('admin'); document.title = 'المشرف — الخوارزمي';
  $('#app').innerHTML = `<section class="sec"><div class="wrap"><div class="st"><h2>لوحة المشرف</h2><p>الأعضاء الذين دخلوا قسم المجتمع.</p><div class="orn"></div></div><div id="adm">${msg('جارٍ التحميل…')}</div></div></section>`;
  let loaded = '';
  CUR = async () => {
    const g = gate(), el = $('#adm'); if (!el) return;
    if (g !== 'ok') { loaded = ''; return el.innerHTML = gateHtml(g); }
    if (!isAdmin()) return el.innerHTML = `<div class="gate">${msg('هذه الصفحة للمشرف فقط.')}</div>`;
    if (loaded === AU().uid) return; loaded = AU().uid;
    const f = F();
    try {
      const s = await f.getDocs(f.query(f.collection(DB(), 'members'), f.orderBy('t', 'desc'), f.limit(500)));
      const rows = s.docs.map(d => ({ id: d.id, ...d.data() }));
      const draw = q => {
        const r = rows.filter(m => !q || (m.email + ' ' + m.name).toLowerCase().includes(q.toLowerCase()));
        $('#atb').innerHTML = r.map(m => { const tp = topicOf(m.topic); return `<tr><td>${esc(m.name)}</td><td dir="ltr" class="em">${esc(m.email)}</td><td>${tp ? tp.n : '—'}</td><td>${m.j && m.j.toDate ? tm(m.j.toDate()) : '—'}</td><td><button class="btn alt sm" data-rs="${esc(m.email)}">إرسال رابط تغيير كلمة المرور</button></td></tr>`; }).join('') || `<tr><td colspan="5">${msg('لا نتائج.')}</td></tr>`;
      };
      el.innerHTML = `<div class="anote"><b>عن كلمات المرور:</b> هي مخزّنة مشفّرة داخل Firebase ولا يستطيع أحد قراءتها، حتى أنت. وهذا لحماية أعضائك. إن نسي أحدهم كلمته اضغط «إرسال رابط تغيير كلمة المرور» ليصله بريد يختار منه كلمة جديدة. القائمة هنا تضم من دخل المجتمع منذ تفعيله؛ وقائمة كل المسجّلين الكاملة في Firebase ← Authentication.</div>
        <div class="abar"><input id="aq" type="search" placeholder="ابحث بالاسم أو البريد…"><span>الإجمالي: <b>${AR(rows.length)}</b></span></div>
        <div class="atw"><table class="at"><thead><tr><th>الاسم</th><th>البريد</th><th>المجال الحالي</th><th>انضم</th><th></th></tr></thead><tbody id="atb"></tbody></table></div>`;
      draw(''); $('#aq').oninput = e => draw(e.target.value.trim());
      el.onclick = e => { const b = e.target.closest('[data-rs]'); if (!b) return; f.sendPasswordResetEmail(f.getAuth(), b.dataset.rs).then(() => toast('أُرسل الرابط')).catch(() => toast('تعذّر الإرسال')); };
    } catch (e) { console.error(e); loaded = ''; el.innerHTML = `<div class="gate">${msg('تعذّر تحميل الأعضاء. تأكد من نشر القواعد الجديدة، وأن بريدك هو بريد المشرف.')}</div>`; }
  };
  CUR();
}

PAGES.topics = topicsPage; PAGES.topic = topicPage; PAGES.admin = adminPage;
/* رابط «المجتمع» في الشريط العلوي (دون تعديل app.js) */
if (!NAV.some(x => x[0] === 'topics.html')) { const i = NAV.findIndex(x => x[0] === 'account.html'); NAV.splice(i < 0 ? NAV.length : i, 0, ['topics.html', 'المجتمع', 'topics']); }
})();
