// Coco Tech Lab & Le Club Français dashboards: one engine, two personalities.
// The page sets <body data-track="tech|french">. Same accounts as Code Cademy (phone sign-in).
(function(){
  'use strict';
  const TRACK = document.body.dataset.track === 'french' ? 'french' : 'tech';
  const FR = TRACK === 'french';
  const html = document.documentElement;
  const ar = function(){ return html.lang === 'ar'; };
  const T = function(en, a){ return ar() ? a : en; };
  const L = function(x){ return Array.isArray(x) ? T(x[0], x[1]) : x; };
  const esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  const $ = function(id){ return document.getElementById(id); };
  const WA = '966538840330';
  const SB_URL = 'https://orpknmkgfwmtroiqljzp.supabase.co';
  const SB_KEY = 'sb_publishable_x7AQ0xQl8qqOH3iDKqxddg_-7fbStUh';
  const main = $('main');
  if(typeof supabase === 'undefined'){ main.innerHTML = '<div class="card"><p>' + esc(T('Could not connect. Check your internet and reload the page.', 'مفيش اتصال. اتأكد من الإنترنت وحدّث الصفحة.')) + '</p></div>'; return; }
  const sb = supabase.createClient(SB_URL, SB_KEY);

  // ---------- course data ----------
  const TECH_CATS = [["kids", "🧸", "Coding for kids", "برمجة الأطفال"], ["lang", "💻", "Programming languages", "لغات البرمجة"], ["web", "🌐", "Web development", "برمجة المواقع"], ["iot", "📡", "IoT & electronics", "إنترنت الأشياء IoT"], ["it", "🛡️", "IT fields", "مجالات الـIT"], ["office", "📊", "Microsoft Office", "كورسات Office"]];
  const TECH_COURSES = [
    ["scratchjr", "kids", "🐱", "ScratchJr", "ScratchJr"],
    ["scratch", "kids", "🎮", "Scratch: game design", "Scratch: تصميم الألعاب"],
    ["logic", "kids", "🧩", "Logic & algorithms", "المنطق والخوارزميات"],
    ["minecraft", "kids", "⛏️", "Minecraft coding", "البرمجة في Minecraft"],
    ["appkids", "kids", "📱", "My first app", "أول تطبيق ليا"],
    ["robotkids", "kids", "🤖", "Robots for kids", "روبوتات للأطفال"],
    ["python", "lang", "🐍", "Python", "Python"],
    ["javascript", "lang", "⚡", "JavaScript", "JavaScript"],
    ["java", "lang", "☕", "Java", "Java"],
    ["cpp", "lang", "🧮", "C++", "C++"],
    ["csharp", "lang", "🎯", "C#", "C#"],
    ["flutter", "lang", "📲", "Mobile apps with Flutter", "تطبيقات الموبايل بـFlutter"],
    ["sql", "lang", "🗄️", "SQL & databases", "SQL وقواعد البيانات"],
    ["htmlcss", "web", "🎨", "HTML & CSS", "HTML وCSS"],
    ["webjs", "web", "🖱️", "Interactive websites", "مواقع تفاعلية"],
    ["react", "web", "⚛️", "React", "React"],
    ["backend", "web", "🔧", "Back-end with Node.js", "الباك إند بـNode.js"],
    ["wordpress", "web", "📰", "WordPress", "WordPress"],
    ["fullstack", "web", "🏗️", "Full-stack project", "مشروع فول ستاك"],
    ["arduino", "iot", "🔌", "Arduino", "Arduino"],
    ["microbit", "iot", "🟩", "micro:bit", "micro:bit"],
    ["smarthome", "iot", "🏠", "Smart home (ESP32)", "البيت الذكي (ESP32)"],
    ["raspberry", "iot", "🍓", "Raspberry Pi", "Raspberry Pi"],
    ["robotics", "iot", "🦾", "Robotics", "الروبوتات"],
    ["itsupport", "it", "🖥️", "Computer basics & IT support", "أساسيات الكمبيوتر والدعم الفني"],
    ["networks", "it", "🌍", "Networking", "الشبكات"],
    ["cyber", "it", "🛡️", "Cybersecurity", "الأمن السيبراني"],
    ["cloud", "it", "☁️", "Cloud computing", "الحوسبة السحابية"],
    ["ai", "it", "🧠", "Artificial intelligence", "الذكاء الاصطناعي"],
    ["aitools", "it", "✨", "AI tools for work", "أدوات الذكاء الاصطناعي للشغل"],
    ["data", "it", "📈", "Data analysis (Power BI)", "تحليل البيانات (Power BI)"],
    ["uiux", "it", "🎨", "UI/UX design (Figma)", "تصميم الواجهات UI/UX (Figma)"],
    ["linux", "it", "🐧", "Linux", "Linux"],
    ["word", "office", "📝", "Microsoft Word", "Microsoft Word"],
    ["excel", "office", "📊", "Microsoft Excel", "Microsoft Excel"],
    ["excelpro", "office", "🧾", "Advanced Excel", "Excel متقدم"],
    ["powerpoint", "office", "🎞️", "PowerPoint", "PowerPoint"],
    ["outlook", "office", "📧", "Outlook & Teams", "Outlook وTeams"],
    ["icdl", "office", "🏅", "ICDL preparation", "تحضير ICDL"]
  ];
  TECH_CATS.push(['ai', '🤖', 'AI & data', 'الذكاء الاصطناعي والبيانات']);
  const FR_COURSES = [['kids', '🧸', 'Kids · 6–12', 'الأطفال · ٦–١٢'], ['teens', '🎒', 'Teens · 13–17', 'الشباب · ١٣–١٧'], ['adults', '☕', 'Adults', 'الكبار'], ['delf', '🎓', 'DELF prep', 'تحضير DELF']];
  // the passport: one city stamp per level
  const FR_LEVELS = [
    ['Paris', '🗼', 'Beginner', 'المبتدئ', 'A1', 'Greet, introduce yourself, count', 'تسلّم وتعرّف نفسك وتعدّ'],
    ['Lyon', '🦁', 'Elementary', 'الأساسي', 'A2', 'Order food, ask the way', 'تطلب أكل وتسأل عن الطريق'],
    ['Marseille', '⛵', 'Pre-intermediate', 'قبل المتوسط', 'A2+', 'Talk about your day and your past', 'تحكي عن يومك واللي فات'],
    ['Bordeaux', '🍇', 'Intermediate', 'المتوسط', 'B1', 'Share opinions, plan a trip', 'تقول رأيك وتخطط لرحلة'],
    ['Nice', '🌴', 'Upper-intermediate', 'فوق المتوسط', 'B2', 'Debate, write emails, films', 'تناقش وتكتب إيميلات وتفهم الأفلام'],
    ['Strasbourg', '🏰', 'Advanced', 'المتقدم', 'C1', 'Speak naturally and get ready for DELF', 'تتكلم بطلاقة وتستعد لـDELF']];
  const COURSES = FR ? FR_COURSES.map(function(c){ return [c[0], 'fr', c[1], c[2], c[3]]; }) : TECH_COURSES;
  function courseName(id){ const c = COURSES.find(function(x){ return x[0] === id; }); return c ? c[2] + ' ' + T(c[3], c[4]) : (id || T('All courses', 'كل الكورسات')); }
  // the teacher's course manager: open (default) / soon / hidden, plus "announce"
  const cstat = function(id){ return ((D.cfg || {})[id] || {}).status || 'open'; };
  function courseOptions(sel, withAll, forJoin){
    const opt = function(id, label){
      const st = cstat(id); if(forJoin && st === 'hidden') return '';
      return '<option value="' + id + '"' + (sel === id ? ' selected' : '') + (forJoin && st === 'soon' ? ' disabled' : '') + '>' + label + (forJoin && st === 'soon' ? ' · ' + esc(T('coming soon', 'قريباً')) : '') + (!forJoin && st !== 'open' ? ' (' + esc(st === 'soon' ? T('soon', 'قريباً') : T('hidden', 'مخفي')) + ')' : '') + '</option>';
    };
    let h = withAll ? '<option value="">' + esc(T('All courses', 'كل الكورسات')) + '</option>' : '';
    if(FR) return h + FR_COURSES.map(function(c){ return opt(c[0], c[1] + ' ' + esc(T(c[2], c[3]))); }).join('');
    return h + TECH_CATS.map(function(cat){
      const inner = TECH_COURSES.filter(function(c){ return c[1] === cat[0]; }).map(function(c){ return opt(c[0], esc(T(c[3], c[4]))); }).join('');
      return inner ? '<optgroup label="' + esc(cat[1] + ' ' + T(cat[2], cat[3])) + '">' + inner + '</optgroup>' : '';
    }).join('');
  }
  const KINDS = {
    project: ['🛠️', 'Project', 'مشروع'], code: ['💻', 'Code exercise', 'تمرين كود'], quiz: FR ? ['🧪', 'Quiz / DELF mock', 'اختبار / DELF تجريبي'] : ['🧪', 'Quiz', 'اختبار'],
    voice: ['🎙️', 'Voice task', 'تسجيل صوتي'], live: ['📡', 'Live class', 'حصة لايف']
  };
  const kindLabel = function(k){ const x = KINDS[k] || ['📄', k, k]; return x[0] + ' ' + T(x[1], x[2]); };
  const SKILLS = [['logic', 'Logic', 'المنطق'], ['design', 'Design', 'التصميم'], ['security', 'Security', 'الأمان'], ['speed', 'Speed', 'السرعة']];

  // ---------- small helpers ----------
  function todayStr(){ try{ return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh' }).format(new Date()); }catch(e){ return new Date().toISOString().slice(0, 10); } }
  function addDays(s, n){ const d = new Date(s + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function streakOf(days){ const set = new Set(days); let d = todayStr(); if(!set.has(d)) d = addDays(d, -1); let n = 0; while(set.has(d)){ n++; d = addDays(d, -1); } return n; }
  function fmtDate(s, withTime){ if(!s) return ''; try{ return new Date(s).toLocaleString(ar() ? 'ar-EG' : 'en-GB', withTime ? { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' } : { day: 'numeric', month: 'short', year: 'numeric' }); }catch(e){ return String(s).slice(0, 10); } }
  const avg = function(a){ a = a.filter(function(x){ return typeof x === 'number' && !isNaN(x); }); return a.length ? Math.round(a.reduce(function(x, y){ return x + y; }, 0) / a.length) : null; };
  const firstName = function(n){ return String(n || '').trim().split(/\s+/)[0] || T('Student', 'طالب'); };
  function toast(msg, bad){
    const t = $('toast'); t.textContent = msg; t.className = 'show' + (bad ? ' bad' : '');
    clearTimeout(toast.h); toast.h = setTimeout(function(){ t.className = ''; }, 3200);
  }
  function errText(e){
    const m = String((e && (e.message || e.error_description)) || e || '');
    if(/Invalid login|invalid_credentials/i.test(m)) return T('Wrong phone number or password.', 'رقم الموبايل أو الباسورد غلط.');
    if(/already has an account/i.test(m)) return T('This phone number already has an account. Sign in instead.', 'الرقم ده عليه حساب بالفعل — سجّل دخول.');
    if(/Failed to fetch|NetworkError/i.test(m)) return T('No connection. Check your internet.', 'مفيش اتصال بالإنترنت.');
    return m || T('Something went wrong. Please try again.', 'حصلت مشكلة. حاول تاني.');
  }
  function normPhone(v){
    let d = String(v || '').replace(/\D/g, ''); if(!d) return '';
    if(d.indexOf('00') === 0) d = d.slice(2);
    if(/^05\d{8}$/.test(d)) d = '966' + d.slice(1); else if(/^01\d{9}$/.test(d)) d = '20' + d.slice(1);
    return d.length >= 8 ? d : '';
  }
  function speak(text, lang){ try{ if(!window.speechSynthesis) return; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = lang || 'fr-FR'; u.rate = .9; speechSynthesis.speak(u); }catch(e){} }
  const isUrl = function(s){ return /^https?:\/\/\S+$/i.test(String(s || '').trim()); };
  function loadScript(src){ return new Promise(function(res, rej){ const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); }
  function openModal(h, wide){ $('modalBody').innerHTML = h; $('modal').classList.toggle('wide', !!wide); if(!$('modal').open) $('modal').showModal(); }
  function closeModal(){ if($('modal').open) $('modal').close(); }
  $('modal').addEventListener('click', function(e){ if(e.target === $('modal') || e.target.closest('[data-close]')) closeModal(); });

  // ---------- state ----------
  let me = null, view = null, D = {}, cur = null;
  const ROLE = function(){ return !me ? 'guest' : (me.role === 'teacher' || me.role === 'admin') ? 'teacher' : me.role === 'parent' ? 'parent' : 'student'; };
  const activeEnrolls = function(){ return (D.enrolls || []).filter(function(e){ return e.status !== 'pending'; }); };
  const subFor = function(taskId, uid){ return (D.subs || []).find(function(s){ return s.task_id === taskId && (!uid || s.student_id === uid); }); };
  const isDone = function(s){ return !!(s && (s.status === 'graded' || s.auto_passed)); };
  function monthPoints(act, subs){
    const m = todayStr().slice(0, 7);
    let p = act.filter(function(a){ return String(a.day).slice(0, 7) === m; }).reduce(function(x, a){ return x + (a.points || 0); }, 0);
    subs.forEach(function(s){ if(String(s.updated_at || '').slice(0, 7) === m) p += Math.floor((s.score != null ? s.score : (s.auto_score || 0)) / 10) + (s.auto_passed ? 5 : 0); });
    return p;
  }
  function skillAvg(subs){
    const out = {};
    SKILLS.forEach(function(k){ out[k[0]] = avg(subs.map(function(s){ return s.skills && typeof s.skills[k[0]] === 'number' ? s.skills[k[0]] : NaN; })); });
    return out;
  }
  function radarSvg(v, size){
    size = size || 220; const c = size / 2, r = size / 2 - 42, n = SKILLS.length;
    const pt = function(i, val){ const a = -Math.PI / 2 + i * 2 * Math.PI / n; return [c + Math.cos(a) * r * val, c + Math.sin(a) * r * val]; };
    let g = '';
    [.25, .5, .75, 1].forEach(function(f){ g += '<polygon points="' + SKILLS.map(function(_, i){ return pt(i, f).join(','); }).join(' ') + '" fill="none" stroke="var(--line2)"/>'; });
    SKILLS.forEach(function(k, i){ const p = pt(i, 1), q = pt(i, 1.24); g += '<line x1="' + c + '" y1="' + c + '" x2="' + p[0] + '" y2="' + p[1] + '" stroke="var(--line2)"/><text x="' + q[0] + '" y="' + (q[1] + 4) + '" text-anchor="middle" font-size="11" font-weight="700" fill="currentColor">' + esc(T(k[1], k[2])) + '</text>'; });
    const poly = SKILLS.map(function(k, i){ return pt(i, Math.max(.04, (v[k[0]] || 0) / 5)).join(','); }).join(' ');
    return '<svg class="radar" viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size + '" role="img" aria-label="' + esc(T('Skills radar', 'رادار المهارات')) + '">' + g +
      '<polygon points="' + poly + '" fill="var(--accent)" fill-opacity=".28" stroke="var(--accent)" stroke-width="2.5"/></svg>';
  }
  const emptyCard = function(icon, msg, extra){ return '<div class="empty"><span>' + icon + '</span><p>' + esc(msg) + '</p>' + (extra || '') + '</div>'; };

  // ---------- built-in practice content (free, no AI) ----------
  // daily tech challenge: [question en, ar, code, options, right index, why en, ar]
  const DAILY = [
    ['What does this print?', 'الكود ده هيطبع إيه؟', 'x = 4\nprint(x * 2 + 1)', ['9', '10', '12', '8'], 0, '4 × 2 = 8, plus 1 = 9.', '٤ × ٢ = ٨ + ١ = ٩.'],
    ['Which tag makes a link in HTML?', 'أنهي تاج بيعمل لينك في HTML؟', '', ['<a>', '<p>', '<img>', '<link-me>'], 0, '<a href="..."> is the link tag.', '<a href="..."> هو تاج اللينك.'],
    ['What does this print?', 'الكود ده هيطبع إيه؟', 'for i in range(4):\n    print("*", end="")', ['****', '***', '*', '4'], 0, 'range(4) runs 4 times: ****.', 'range(4) بيلف ٤ مرات: ****.'],
    ['Which one is the strongest password?', 'أنهي باسورد أقوى؟', '', ['Blue-Camel-42-Rain!', 'password123', 'Sara2010', '12345678'], 0, 'Long, mixed and not about you.', 'طويل ومتنوع ومش عن معلوماتك.'],
    ['What is 1010 in binary as a decimal number?', 'الرقم الباينري 1010 يساوي كام؟', '', ['10', '8', '12', '1010'], 0, '8 + 0 + 2 + 0 = 10.', '٨ + ٠ + ٢ + ٠ = ١٠.'],
    ['What does the console show?', 'الكونسول هيطلّع إيه؟', 'let a = 5;\nlet b = "5";\nconsole.log(a === b);', ['false', 'true', '10', '55'], 0, '=== also checks the type: number vs text.', '=== بتقارن النوع كمان: رقم مش زي نص.'],
    ['In Excel, which formula finds the biggest number?', 'في Excel، أنهي معادلة بتجيب أكبر رقم؟', '', ['=MAX(A1:A9)', '=BIG(A1:A9)', '=TOP(A1:A9)', '=SUM(A1:A9)'], 0, 'MAX returns the largest value.', 'MAX بتطلّع أكبر قيمة.'],
    ['What does CSS change?', 'الـCSS بيغيّر إيه؟', '', [['How the page looks', 'شكل الصفحة'], ['The Wi-Fi password', 'باسورد الواي فاي'], ['The database', 'قاعدة البيانات'], ['The battery', 'البطارية']], 0, 'Colours, fonts, spacing and layout.', 'الألوان والخطوط والمسافات وترتيب الصفحة.'],
    ['What does this print?', 'الكود ده هيطبع إيه؟', 'name = "Coco"\nprint(name[0])', ['C', 'Coco', 'o', '0'], 0, 'Counting starts at 0, so name[0] is the first letter.', 'العدّ بيبدأ من صفر، فـname[0] أول حرف.'],
    ['Which device sends data between networks?', 'أنهي جهاز بيوصّل البيانات بين الشبكات؟', '', [['Router', 'الراوتر'], ['Keyboard', 'الكيبورد'], ['Printer', 'الطابعة'], ['Speaker', 'السماعة']], 0, 'The router connects your home to the internet.', 'الراوتر بيوصّل بيتك بالإنترنت.'],
    ['What does this print?', 'الكود ده هيطبع إيه؟', 'nums = [3, 1, 2]\nnums.sort()\nprint(nums)', ['[1, 2, 3]', '[3, 2, 1]', '[3, 1, 2]', '6'], 0, 'sort() puts them from small to big.', 'sort() بترتبهم من الصغير للكبير.'],
    ['A sensor in an IoT project is used to…', 'الحساس في مشروع IoT بيستخدم عشان…', '', [['Measure the world (heat, light…)', 'يقيس اللي حواليه (حرارة، نور…)'], ['Print paper', 'يطبع ورق'], ['Store photos', 'يخزن صور'], ['Play music', 'يشغّل مزيكا']], 0, 'Sensors read the world; the code decides what to do.', 'الحساس بيقرا اللي حواليه، والكود بيقرر يعمل إيه.'],
    ['What does this print?', 'الكود ده هيطبع إيه؟', 'age = 12\nif age >= 13:\n    print("Teen")\nelse:\n    print("Kid")', ['Kid', 'Teen', '12', 'Error'], 0, '12 is not ≥ 13, so else runs.', '١٢ مش أكبر من أو يساوي ١٣، فالـelse هي اللي تشتغل.'],
    ['Which shortcut undoes your last step?', 'أنهي اختصار بيرجّع آخر خطوة؟', '', ['Ctrl + Z', 'Ctrl + U', 'Ctrl + Y', 'Alt + F4'], 0, 'Ctrl + Z: the programmer’s best friend.', 'Ctrl + Z — صاحب كل مبرمج.']
  ];
  // French phrases for pronunciation: [fr, en, ar, sounds]
  const PHRASES = [
    ['Bonjour, je m’appelle Coco.', 'Hello, my name is Coco.', 'صباح الخير، اسمي كوكو.', ['ON/AN', 'silent']],
    ['Un croissant, s’il vous plaît.', 'A croissant, please.', 'كرواسون من فضلك.', ['R', 'ON/AN']],
    ['La rue est très jolie.', 'The street is very pretty.', 'الشارع حلو جداً.', ['U', 'R', 'É/È']],
    ['Je voudrais un café au lait.', 'I would like a milky coffee.', 'عايز قهوة باللبن.', ['OU', 'É/È', 'R']],
    ['Où est la gare, s’il vous plaît ?', 'Where is the station, please?', 'المحطة فين من فضلك؟', ['OU', 'R']],
    ['Il fait beau aujourd’hui.', 'The weather is nice today.', 'الجو حلو النهارده.', ['OU', 'silent']],
    ['J’aime le pain et le fromage.', 'I like bread and cheese.', 'بحب العيش والجبنة.', ['ON/AN', 'R', 'É/È']],
    ['Nous habitons en France.', 'We live in France.', 'إحنا ساكنين في فرنسا.', ['ON/AN', 'silent', 'R']],
    ['Tu as vu la lune ?', 'Did you see the moon?', 'شفت القمر؟', ['U']],
    ['Le petit déjeuner est prêt.', 'Breakfast is ready.', 'الفطار جاهز.', ['EU', 'É/È', 'R']],
    ['Deux euros, c’est peu.', 'Two euros is not much.', 'يورو اتنين — حاجة بسيطة.', ['EU']],
    ['La montagne est magnifique.', 'The mountain is magnificent.', 'الجبل رائع.', ['GN', 'ON/AN']],
    ['Mon frère travaille à Bordeaux.', 'My brother works in Bordeaux.', 'أخويا بيشتغل في بوردو.', ['R', 'É/È', 'ON/AN']],
    ['Elle est vraiment heureuse.', 'She is really happy.', 'هي مبسوطة جداً.', ['EU', 'R', 'ON/AN']],
    ['Merci beaucoup, à bientôt !', 'Thank you very much, see you soon!', 'شكراً جزيلاً، أشوفك قريب!', ['R', 'OU', 'ON/AN']],
    ['Le train part à huit heures.', 'The train leaves at eight.', 'القطر بيتحرك الساعة ٨.', ['R', 'U', 'EU', 'ON/AN']]
  ];
  const SOUND_TIPS = { 'R': ['Say it at the back of the throat, like a soft gargle.', 'من آخر الزور، زي الغرغرة الخفيفة.'], 'U': ['Say “ee” with lips rounded like “oo”.', 'قول «إي» وشفايفك مدوّرة كأنك بتقول «أو».'],
    'OU': ['Like “oo” in “food”.', 'زي «أو» في كلمة «فود».'], 'ON/AN': ['Nasal: let the air go through your nose, no “n” at the end.', 'صوت أنفي: الهوا يطلع من مناخيرك من غير «ن» في الآخر.'],
    'É/È': ['É is closed like “ay”, È is open like “e” in “bed”.', 'É مقفولة زي «اي»، وÈ مفتوحة زي «إ» في bed.'], 'EU': ['Round your lips and say “e”.', 'دوّر شفايفك وقول «إ».'],
    'GN': ['Like “ny” in “canyon”.', 'زي «ني» في canyon.'], 'silent': ['Most final letters are silent: “petit” → “peti”.', 'أغلب الحروف الأخيرة مش بتتنطق: petit ← «بتي».'] };
  const STARTER_WORDS = [['bonjour', 'hello · صباح الخير'], ['merci', 'thank you · شكراً'], ['s’il vous plaît', 'please · من فضلك'], ['au revoir', 'goodbye · مع السلامة'],
    ['oui / non', 'yes / no · أيوه / لأ'], ['le pain', 'bread · العيش'], ['l’eau', 'water · المية'], ['la maison', 'house · البيت'], ['l’école', 'school · المدرسة'],
    ['le livre', 'book · الكتاب'], ['manger', 'to eat · ياكل'], ['parler', 'to speak · يتكلم']];
  const BOX_DAYS = [0, 1, 2, 4, 8, 16];

  // ---------- data ----------
  const sel = async function(q){ const r = await q; if(r.error) console.warn(r.error); return r.data || []; };
  async function loadAll(){
    D = {};
    const r = ROLE(), uid = me.id;
    if(r === 'student'){
      const res = await Promise.all([
        sel(sb.from('track_enrollments').select('*').eq('track', TRACK).eq('student_id', uid).order('created_at')),
        sel(sb.from('track_tasks').select('*').eq('track', TRACK).order('created_at')),
        sel(sb.from('track_submissions').select('*').eq('student_id', uid)),
        sel(sb.from('track_activity').select('day, points').eq('track', TRACK).eq('student_id', uid)),
        sel(sb.from('track_certificates').select('*').eq('track', TRACK).eq('student_id', uid)),
        FR ? sel(sb.from('fr_stamps').select('*').eq('student_id', uid)) : [],
        FR ? sel(sb.from('fr_words').select('*').eq('student_id', uid).order('created_at', { ascending: false })) : [],
        FR ? sel(sb.from('fr_pron').select('*').eq('student_id', uid).order('created_at', { ascending: false }).limit(60)) : []]);
      D.enrolls = res[0]; D.tasks = res[1]; D.act = res[3]; D.certs = res[4]; D.stamps = res[5]; D.words = res[6]; D.pron = res[7];
      const ids = new Set(D.tasks.map(function(t){ return t.id; }));
      D.subs = res[2].filter(function(s){ return ids.has(s.task_id); });
    } else if(r === 'teacher'){
      const since = addDays(todayStr(), -60);
      const res = await Promise.all([
        sel(sb.from('track_enrollments').select('*').eq('track', TRACK).order('created_at', { ascending: false })),
        sel(sb.from('track_tasks').select('*').eq('track', TRACK).order('created_at')),
        sel(sb.from('track_activity').select('*').eq('track', TRACK).gte('day', since)),
        sel(sb.from('track_certificates').select('*').eq('track', TRACK)),
        FR ? sel(sb.from('fr_pron').select('*').gte('created_at', addDays(todayStr(), -30)).order('created_at', { ascending: false }).limit(2000)) : []]);
      D.enrolls = res[0]; D.tasks = res[1]; D.act = res[2]; D.certs = res[3]; D.pron = res[4];
      const sids = Array.from(new Set(D.enrolls.map(function(e){ return e.student_id; })));
      const tids = D.tasks.map(function(t){ return t.id; });
      const res2 = await Promise.all([
        sids.length ? sel(sb.from('profiles').select('id, full_name, phone').in('id', sids)) : [],
        tids.length ? sel(sb.from('track_submissions').select('*').in('task_id', tids).order('updated_at', { ascending: false })) : [],
        tids.length ? sel(sb.from('track_task_keys').select('*').in('task_id', tids)) : [],
        FR && sids.length ? sel(sb.from('fr_stamps').select('*').in('student_id', sids)) : []]);
      D.people = {}; res2[0].forEach(function(p){ D.people[p.id] = p; });
      D.subs = res2[1]; D.keys = {}; res2[2].forEach(function(k){ D.keys[k.task_id] = k; }); D.stamps = res2[3];
    } else if(r === 'parent'){
      const links = await sel(sb.from('parent_links').select('student_id').eq('parent_id', uid));
      const ids = links.map(function(l){ return l.student_id; });
      D.kids = ids.length ? await sel(sb.from('profiles').select('id, full_name').in('id', ids)) : [];
      if(ids.length){
        const res = await Promise.all([
          sel(sb.from('track_enrollments').select('*').eq('track', TRACK).in('student_id', ids)),
          sel(sb.from('track_tasks').select('*').eq('track', TRACK).order('created_at')),
          sel(sb.from('track_submissions').select('*').in('student_id', ids)),
          sel(sb.from('track_activity').select('*').eq('track', TRACK).in('student_id', ids)),
          FR ? sel(sb.from('fr_stamps').select('*').in('student_id', ids)) : [],
          FR ? sel(sb.from('fr_pron').select('student_id, score, sounds, created_at').in('student_id', ids).order('created_at', { ascending: false }).limit(500)) : [],
          FR ? sel(sb.from('fr_words').select('student_id, box').in('student_id', ids)) : []]);
        D.enrolls = res[0]; D.tasks = res[1]; D.act = res[3]; D.stamps = res[4]; D.pron = res[5]; D.words = res[6];
        const tids = new Set(D.tasks.map(function(t){ return t.id; }));
        D.subs = res[2].filter(function(s){ return tids.has(s.task_id); });
      }
    }
  }
  async function loadShared(){
    const cfg = await sel(sb.from('track_courses').select('*').eq('track', TRACK));
    D.cfg = {}; cfg.forEach(function(c){ D.cfg[c.course] = c; });
    mergeCustom();
    let q = sb.from('track_messages').select('*').eq('track', TRACK).order('created_at', { ascending: false }).limit(1500);
    const r = ROLE();
    if(r === 'student') q = q.eq('student_id', me.id);
    if(r === 'parent'){ const ids = (D.kids || []).map(function(k){ return k.id; }); if(!ids.length){ D.msgs = []; D.reads = {}; return; } q = q.in('student_id', ids); }
    D.msgs = (await sel(q)).reverse();
    D.reads = {}; (await sel(sb.from('track_chat_reads').select('*').eq('user_id', me.id).eq('track', TRACK))).forEach(function(x){ D.reads[x.student_id] = x.last_read_at; });
  }
  // courses a teacher added (track_courses.custom) sit next to the built-in ones everywhere
  function mergeCustom(){
    if(FR) return;
    for(let i = TECH_COURSES.length - 1; i >= 0; i--) if(TECH_COURSES[i][5]) TECH_COURSES.splice(i, 1);
    Object.keys(D.cfg || {}).forEach(function(k){ const c = D.cfg[k]; if(c.custom) TECH_COURSES.push([c.course, c.cat || 'it', c.icon || '✨', c.name_en || c.name_ar, c.name_ar || c.name_en, true]); });
  }
  const unreadIn = function(sid){ const t = D.reads && D.reads[sid]; return (D.msgs || []).filter(function(m){ return m.student_id === sid && m.sender_id !== me.id && (!t || m.created_at > t); }).length; };
  const unreadAll = function(){ const ids = new Set((D.msgs || []).map(function(m){ return m.student_id; })); let n = 0; ids.forEach(function(id){ n += unreadIn(id); }); return n; };
  async function refreshActivity(){ D.act = await sel(sb.from('track_activity').select('day, points').eq('track', TRACK).eq('student_id', me.id)); }

  // ---------- chrome: header, tabs ----------
  const TABS = {
    student: FR ? [['home', '🏠', 'Home', 'الرئيسية'], ['passport', '🛂', 'Passport', 'الباسبور'], ['tasks', '📝', 'Tasks', 'المهام'], ['words', '📒', 'My words', 'كشكول الكلمات'],
      ['speak', '🎙️', 'Pronunciation', 'النطق'], ['delf', '📈', 'DELF meter', 'مؤشر DELF'], ['msgs', '💬', 'Messages', 'الرسايل'], ['rank', '🏆', 'Ranking', 'الترتيب'], ['certs', '🎓', 'Certificates', 'الشهادات'], ['join', '➕', 'Courses & payment', 'الكورسات والدفع']]
      : [['home', '🏠', 'Home', 'الرئيسية'], ['map', '🗺️', 'Skill map', 'خريطة المهارات'], ['tasks', '📝', 'Tasks', 'المهام'], ['portfolio', '🗂️', 'Portfolio', 'معرض المشاريع'], ['msgs', '💬', 'Messages', 'الرسايل'],
      ['rank', '🏆', 'Ranking', 'الترتيب'], ['certs', '🎓', 'Certificates', 'الشهادات'], ['join', '➕', 'Courses & payment', 'الكورسات والدفع']],
    teacher: [['students', '👥', 'Students', 'الطلاب'], ['msgs', '💬', 'Messages', 'الرسايل'], ['ttasks', '📝', 'Tasks', 'المهام'], ['board', '🗂️', 'Board', 'لوحة التسليمات'], ['courses', '📣', 'Courses', 'الكورسات']].concat(FR ? [['books', '📘', 'Level books', 'كتب المستويات']] : [['faq', '❓', 'Coco questions', 'أسئلة كوكو']]).concat(FR ? [['sounds', '🔥', 'Sounds map', 'خريطة الأصوات']] : [['skills', '🕸️', 'Skills radar', 'رادار المهارات']])
      .concat([['rank', '🏆', 'Ranking', 'الترتيب']]),
    parent: [['children', '👨‍👩‍👧', 'My children', 'أولادي'], ['msgs', '💬', 'Messages', 'الرسايل']]
  };
  function tabsFor(){
    const r = ROLE(); let t = (TABS[r] || []).slice();
    if(r === 'student' && !activeEnrolls().length) t = t.filter(function(x){ return x[0] === 'home' || x[0] === 'join' || (x[0] === 'msgs' && (D.enrolls || []).length); });
    if(r === 'teacher' && me.role === 'admin') t.push(['settings', '⚙️', 'Settings', 'الإعدادات']);
    return t;
  }
  function renderChrome(){
    const r = ROLE();
    $('who').innerHTML = me ? '<b>' + esc(firstName(me.full_name)) + '</b><small>' + esc({ student: T('Student', 'طالب'), teacher: me.role === 'admin' ? T('Admin', 'المدير') : T('Teacher', 'معلم'), parent: T('Parent', 'ولي أمر') }[r] || '') + '</small>' : '';
    $('signOut').hidden = !me; $('signOut').textContent = T('Sign out', 'خروج');
    $('langBtn').textContent = ar() ? 'English' : 'عربي';
    $('backLink').textContent = T('← Course page', 'صفحة الكورسات ←');
    const tabs = me ? tabsFor() : [];
    $('tabs').hidden = !tabs.length;
    document.querySelector('.app').classList.toggle('solo', !tabs.length);
    const badge = { msgs: me ? unreadAll() : 0, tasks: me ? newTasks().length : 0 };
    $('tabs').innerHTML = tabs.map(function(t){ return '<button type="button" data-view="' + t[0] + '" class="' + (view === t[0] || (view === 'task' && t[0] === 'tasks') ? 'on' : '') + '"><span>' + t[1] + '</span>' + esc(T(t[2], t[3])) + (badge[t[0]] ? '<i class="nb">' + badge[t[0]] + '</i>' : '') + '</button>'; }).join('');
    const bell = $('bell'); if(bell){ const n = me ? badge.msgs + badge.tasks : 0; bell.hidden = !me; bell.innerHTML = '🔔' + (n ? '<i class="nb">' + n + '</i>' : ''); bell.setAttribute('aria-label', T('Notifications', 'الإشعارات') + (n ? ' (' + n + ')' : '')); }
    document.title = (FR ? 'Le Club Français' : 'Coco Tech Lab') + ' — ' + T('Dashboard', 'لوحة التحكم');
  }
  $('tabs').addEventListener('click', function(e){ const b = e.target.closest('[data-view]'); if(b) go(b.dataset.view); });
  $('langBtn').addEventListener('click', function(){
    const toAr = !ar(); html.lang = toAr ? 'ar' : 'en'; html.dir = toAr ? 'rtl' : 'ltr';
    try{ localStorage.setItem('cc_ui_lang', toAr ? 'ar' : 'en'); }catch(e){}
    renderChrome(); if(view) render(); else if(guestView) guestView();
  });
  $('signOut').addEventListener('click', async function(){ await sb.auth.signOut(); me = null; view = null; D = {}; renderChrome(); showAuth(); });
  let guestView = null;
  function go(v){ view = v; try{ history.replaceState(null, '', '#' + v); }catch(e){} renderChrome(); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  function render(){
    const f = VIEWS[view]; main.innerHTML = '';
    if(view === 'tasks' || view === 'map') markTasksSeen();
    if(f) Promise.resolve(f()).then(function(){ main.classList.remove('enter'); void main.offsetWidth; main.classList.add('enter'); if(window.ccFx) ccFx.countUp(main); });
  }
  const party = function(el, o){ if(window.ccFx){ if(el) ccFx.burstFrom(el, o); else ccFx.confetti(o); } };
  const VIEWS = {};
  const ACT = {};
  main.addEventListener('click', function(e){ const b = e.target.closest('[data-act]'); if(b && ACT[b.dataset.act]){ e.preventDefault(); ACT[b.dataset.act](b, e); } });
  $('modal').addEventListener('click', function(e){ const b = e.target.closest('[data-act]'); if(b && ACT[b.dataset.act]){ e.preventDefault(); ACT[b.dataset.act](b, e); } });
  const FORMS = {};
  document.addEventListener('submit', function(e){ const f = e.target; if(f.dataset && FORMS[f.dataset.form]){ e.preventDefault(); FORMS[f.dataset.form](f); } });
  async function busy(btn, fn){ if(btn){ btn.disabled = true; btn.dataset.t = btn.textContent; btn.textContent = '…'; } try{ return await fn(); } catch(err){ toast(errText(err), true); } finally { if(btn && btn.isConnected){ btn.disabled = false; btn.textContent = btn.dataset.t; } } }

  // ---------- sign in / sign up (same accounts as Code Cademy) ----------
  let authMode = 'login';
  function showAuth(note){
    guestView = function(){ showAuth(note); };
    view = null; renderChrome();
    const login = authMode === 'login';
    main.innerHTML = '<div class="auth">' +
      '<div class="auth-side">' + (FR ? '<span class="mascot">🥐</span>' : '<div class="auth-vid"><video src="assets/video/tech-class.mp4" poster="assets/img/tech-class-poster.jpg" autoplay muted loop playsinline aria-label="' + esc(T('A Coco Tech Lab class', 'حصة في Coco Tech Lab')) + '"></video><span><i></i> LIVE</span></div>') + '<h1>' + esc(FR ? T('Your French journey, in one place', 'رحلتك في الفرنساوي في مكان واحد') : T('Your tech journey, in one place', 'رحلتك في التقنية في مكان واحد')) + '</h1>' +
        '<ul>' + (FR ? [['🛂', 'A passport with a stamp for every level', 'باسبور فيه ختم لكل مستوى'], ['🎙️', 'Pronunciation score with your voice', 'درجة نطق بصوتك'], ['📒', 'A smart word notebook', 'كشكول كلمات ذكي'], ['📈', 'Your DELF readiness meter', 'مؤشر جاهزيتك لـDELF']]
          : [['🗺️', 'A skill map that lights up as you learn', 'خريطة مهارات بتنوّر وإنت بتتعلم'], ['💻', 'Code exercises checked instantly', 'تمارين كود بتتصحح فوراً'], ['🗂️', 'A portfolio you can share', 'معرض مشاريع تشاركه مع الناس'], ['🔥', 'Daily challenge & streaks', 'تحدي يومي وسلسلة أيام']])
          .map(function(x){ return '<li><span>' + x[0] + '</span>' + esc(T(x[1], x[2])) + '</li>'; }).join('') + '</ul>' +
        '<p class="muted small">' + esc(T('Already have a Code Cademy account (English, French or Tech)? Sign in with the same phone number or email and password.', 'عندك حساب في Code Cademy (إنجليزي أو فرنساوي أو برمجة)؟ ادخل بنفس الرقم أو الإيميل والباسورد.')) + '</p></div>' +
      '<div class="card auth-card"><div class="seg"><button type="button" data-act="authMode" data-m="login" class="' + (login ? 'on' : '') + '">' + esc(T('Sign in', 'تسجيل الدخول')) + '</button><button type="button" data-act="authMode" data-m="signup" class="' + (!login ? 'on' : '') + '">' + esc(T('New account', 'حساب جديد')) + '</button></div>' +
        (note ? '<p class="note">' + esc(note) + '</p>' : '') +
        '<form data-form="' + (login ? 'login' : 'signup') + '" class="form">' +
          (login ? '' : '<label>' + esc(T('Full name', 'الاسم بالكامل')) + '<input name="name" required maxlength="80" autocomplete="name"></label>' +
            '<label>' + esc(T('I am', 'أنا')) + '<select name="role"><option value="student">' + esc(T('A student', 'طالب')) + '</option><option value="parent">' + esc(T('A parent', 'ولي أمر')) + '</option><option value="teacher">' + esc(T('A teacher', 'معلم')) + '</option></select></label>') +
          (login ? '<label>' + esc(T('Phone number or email', 'رقم الموبايل أو الإيميل')) + '<input name="phone" type="text" inputmode="email" required autocomplete="username" placeholder="05xxxxxxxx / name@email.com" dir="ltr"></label>'
            : '<label>' + esc(T('Phone number', 'رقم الموبايل')) + '<input name="phone" type="tel" inputmode="tel" required autocomplete="tel" placeholder="05xxxxxxxx" dir="ltr"></label>') +
          '<label>' + esc(T('Password', 'الباسورد')) + '<input name="password" type="password" required minlength="6" autocomplete="' + (login ? 'current-password' : 'new-password') + '" dir="ltr"></label>' +
          '<p class="err" id="authErr"></p><button class="btn main wide" type="submit">' + esc(login ? T('Sign in', 'دخول') : T('Create my account', 'اعمل حسابي')) + '</button>' +
          (login ? '<a class="muted small center" target="_blank" rel="noopener" href="https://wa.me/' + WA + '?text=' + encodeURIComponent(T('Hello, I forgot my password. My phone number is: ', 'السلام عليكم، نسيت الباسورد. رقمي: ')) + '">' + esc(T('Forgot your password? Message us', 'نسيت الباسورد؟ كلّمنا')) + '</a>'
            : '<p class="muted small">' + esc(T('Teachers: choose “A teacher”. The admin approves your account, then your teacher tools open here.', 'المعلمين: اختاروا «معلم». المدير بيوافق على الحساب، وبعدها أدوات المعلم بتفتح هنا.')) + '</p>') +
        '</form></div></div>';
  }
  ACT.authMode = function(b){ authMode = b.dataset.m; showAuth(); };
  FORMS.login = async function(f){
    const err = $('authErr'); err.textContent = '';
    const btn = f.querySelector('button[type=submit]');
    await busy(btn, async function(){
      const ident = f.phone.value.trim();
      let email = ident;
      if(ident.indexOf('@') === -1){ // a phone number: the database checks the password, then gives the account's email
        const r = await sb.rpc('phone_login_email', { p_phone: normPhone(ident) || ident, p_password: f.password.value });
        if(r.error) throw r.error;
        if(!r.data){ err.textContent = T('Wrong phone number or password.', 'رقم الموبايل أو الباسورد غلط.'); return; }
        email = r.data;
      }
      const s = await sb.auth.signInWithPassword({ email: email.toLowerCase(), password: f.password.value });
      if(s.error && /invalid/i.test(s.error.message || '')){ err.textContent = T('Wrong email, phone number or password.', 'الإيميل أو الرقم أو الباسورد غلط.'); return; }
      if(s.error) throw s.error;
      await start();
    });
  };
  FORMS.signup = async function(f){
    const err = $('authErr'); err.textContent = '';
    const phone = normPhone(f.phone.value);
    if(!phone){ err.textContent = T('Please enter a valid phone number.', 'اكتب رقم موبايل صحيح.'); return; }
    await busy(f.querySelector('button[type=submit]'), async function(){
      const r = await sb.rpc('phone_signup', { p_phone: phone, p_password: f.password.value, p_full_name: f.name.value.trim(), p_role: f.role.value, p_club: null });
      if(r.error) throw r.error;
      const s = await sb.auth.signInWithPassword({ email: r.data, password: f.password.value });
      if(s.error) throw s.error;
      await start(true);
    });
  };

  // ---------- public pages: certificate check and portfolio ----------
  async function showVerify(id){
    guestView = function(){ showVerify(id); }; renderChrome();
    let row = null;
    if(/^[0-9a-f-]{36}$/i.test(id)){ const r = await sb.rpc('verify_track_certificate', { p_id: id }); row = (r.data || [])[0]; }
    main.innerHTML = '<div class="card verify ' + (row ? 'ok' : 'bad') + '"><span class="big">' + (row ? '✅' : '❌') + '</span>' + (row
      ? '<h1>' + esc(T('Valid certificate', 'شهادة صحيحة')) + '</h1><p><b>' + esc(row.student_name) + '</b></p><p>' + esc(T('completed', 'أتمّ')) + ' <b>' + esc(courseName(row.course)) + '</b></p><p class="muted">' + esc((row.track === 'french' ? 'Le Club Français' : 'Coco Tech Lab') + ' · Code Cademy · ' + fmtDate(row.issued_at)) + '</p>'
      : '<h1>' + esc(T('Certificate not found', 'الشهادة دي مش موجودة')) + '</h1><p class="muted">' + esc(T('Check the link or the QR code again.', 'راجع اللينك أو الـQR تاني.')) + '</p>') + '</div>';
  }
  async function showPortfolio(id){
    guestView = function(){ showPortfolio(id); }; renderChrome();
    const r = /^[0-9a-f-]{36}$/i.test(id) ? await sb.rpc('track_portfolio', { p_student: id }) : { data: [] };
    const rows = r.data || [];
    main.innerHTML = '<div class="pf-hero"><span class="mascot">🗂️</span><h1>' + esc(rows.length ? T(firstName(rows[0].student_name) + '’s projects', 'مشاريع ' + firstName(rows[0].student_name)) : T('Portfolio', 'معرض المشاريع')) + '</h1><p>' + esc(T('Made at Coco Tech Lab · Code Cademy', 'اتعملت في Coco Tech Lab · Code Cademy')) + '</p></div>' +
      (rows.length ? '<div class="grid2">' + rows.map(pfCard).join('') + '</div>' : emptyCard('🫥', T('Nothing shared here yet.', 'لسه مفيش مشاريع متشاركة هنا.')));
  }
  function pfCard(p){
    return '<article class="card pf"><div class="row between"><b>' + esc(p.title) + '</b>' + (p.score != null ? '<span class="pill good">' + p.score + '/100</span>' : '') + '</div><p class="muted small">' + esc(kindLabel(p.kind) + (p.lang ? ' · ' + (p.lang === 'js' ? 'JavaScript' : 'Python') : '') + ' · ' + fmtDate(p.updated_at)) + '</p>' +
      (isUrl(p.content) ? '<a class="btn ghost" href="' + esc(p.content.trim()) + '" target="_blank" rel="noopener nofollow">🔗 ' + esc(T('Open the project', 'افتح المشروع')) + '</a>' : p.content ? '<pre class="code">' + esc(p.content) + '</pre>' : '') + '</article>';
  }

  // ---------- start ----------
  async function start(fresh){
    const s = await sb.auth.getSession();
    const session = s.data && s.data.session;
    if(!session){ showAuth(); return; }
    main.innerHTML = '<div class="loading">' + (FR ? '🥐' : '🤖') + '</div>';
    let prof = null;
    for(let i = 0; i < 3 && !prof; i++){ // a brand-new account's profile row can take a moment
      const r = await sb.from('profiles').select('id, full_name, role, phone, teacher_request').eq('id', session.user.id).maybeSingle();
      prof = r.data; if(!prof) await new Promise(function(res){ setTimeout(res, 600); });
    }
    if(!prof){ showAuth(T('We could not open your account. Please try again.', 'مقدرناش نفتح حسابك. حاول تاني.')); return; }
    me = prof; guestView = null;
    if(prof.teacher_request && prof.role !== 'teacher' && prof.role !== 'admin'){
      renderChrome(); document.querySelector('.app').classList.add('solo');
      main.innerHTML = '<div class="card verify"><span class="big">⏳</span><h1>' + esc(T('Waiting for approval', 'بانتظار الموافقة')) + '</h1><p>' + esc(T('Your teacher account is with the admin. Once it is approved, sign in again and your teacher tools open here.', 'طلب حساب المعلم عند المدير. أول ما يوافق، ادخل تاني وأدوات المعلم هتفتح هنا.')) + '</p><a class="btn ghost" target="_blank" rel="noopener" href="https://wa.me/' + WA + '">💬 WhatsApp</a></div>';
      return;
    }
    await loadAll(); await loadShared(); startLive();
    try{ if(ROLE() === 'student' && !localStorage.getItem(seenKey())) localStorage.setItem(seenKey(), new Date().toISOString()); }catch(e){}
    const tabs = tabsFor().map(function(t){ return t[0]; });
    const want = (location.hash || '').slice(1);
    go(tabs.indexOf(want) !== -1 ? want : (fresh && ROLE() === 'student' ? 'join' : tabs[0]));
  }

  // =====================================================================
  // STUDENT
  // =====================================================================
  const myTasks = function(){ return (D.tasks || []).filter(function(t){ return t.kind !== 'live'; }); };
  function nextLive(tasks){
    const now = Date.now() - 2 * 3600e3;
    return (tasks || []).filter(function(t){ return t.kind === 'live' && t.starts_at && new Date(t.starts_at).getTime() > now; })
      .sort(function(a, b){ return new Date(a.starts_at) - new Date(b.starts_at); })[0];
  }
  function liveCard(t){
    if(!t) return '';
    return '<div class="card live"><span class="big">📡</span><div class="grow"><b>' + esc(t.title) + '</b><p class="muted small">' + esc(fmtDate(t.starts_at, true)) + (t.body ? ' · ' + esc(t.body) : '') + '</p></div>' +
      (isUrl(t.link) ? '<a class="btn main" href="' + esc(t.link) + '" target="_blank" rel="noopener">' + esc(T('Join the class', 'ادخل الحصة')) + '</a>' : '') + '</div>';
  }
  function badgesFor(ctx){
    const B = FR ? [
      ['🥐', 'First day', 'أول يوم', ctx.days >= 1], ['🔥', '7-day streak', '٧ أيام ورا بعض', ctx.best >= 7], ['📒', '25 words', '٢٥ كلمة', ctx.words >= 25],
      ['🎯', 'Perfect accent (90+)', 'نطق ممتاز (٩٠+)', ctx.bestPron >= 90], ['🛂', 'First stamp', 'أول ختم', ctx.stamps >= 1], ['🏅', '5 tasks done', '٥ مهام', ctx.done >= 5]]
      : [['🚀', 'First task', 'أول مهمة', ctx.submitted >= 1], ['✅', 'Code passed', 'كود صح', ctx.codePass >= 1], ['🔥', '7-day streak', '٧ أيام ورا بعض', ctx.best >= 7],
      ['🏅', '5 tasks done', '٥ مهام', ctx.done >= 5], ['🌟', 'Score 90+', 'درجة ٩٠+', ctx.top >= 90], ['🗂️', 'Shared a project', 'شارك مشروع', ctx.shared >= 1]];
    return '<div class="badges">' + B.map(function(b){ return '<span class="badge' + (b[3] ? ' got' : '') + '" title="' + esc(T(b[1], b[2])) + '"><i>' + b[0] + '</i>' + esc(T(b[1], b[2])) + '</span>'; }).join('') + '</div>';
  }
  function bestStreak(days){
    const s = Array.from(new Set(days)).sort(); let best = 0, run = 0, prev = null;
    s.forEach(function(d){ run = prev && addDays(prev, 1) === d ? run + 1 : 1; best = Math.max(best, run); prev = d; });
    return best;
  }
  function wordsMastered(words){ return (words || []).filter(function(w){ return w.box >= 4; }).length; }
  function frLevel(){ const e = activeEnrolls(); return e.length ? Math.max.apply(null, e.map(function(x){ return x.level || 1; })) : 1; }
  function delfParts(ctx){
    const quiz = avg(ctx.subs.filter(function(s){ const t = ctx.taskOf(s.task_id); return t && t.kind === 'quiz'; }).map(function(s){ return s.auto_score; }));
    const pron = avg(ctx.pron.slice(0, 20).map(function(p){ return p.score; }));
    const vocabN = ctx.words.filter(function(w){ return w.box >= 4; }).length, vocabGoal = 25 * ctx.level;
    const vocab = ctx.words.length ? Math.min(100, Math.round(100 * vocabN / vocabGoal)) : null;
    const grades = avg(ctx.subs.filter(function(s){ return s.score != null; }).map(function(s){ return s.score; }));
    const parts = [['🧪', 'Mock exams', 'الامتحانات التجريبية', quiz, .3], ['🎙️', 'Pronunciation', 'النطق', pron, .25], ['📒', 'Vocabulary', 'الكلمات', vocab, .2], ['📝', 'Teacher marks', 'درجات المعلم', grades, .25]];
    const total = Math.round(parts.reduce(function(x, p){ return x + (p[3] || 0) * p[4]; }, 0));
    return { parts: parts, total: total, vocabN: vocabN, vocabGoal: vocabGoal };
  }
  function gaugeSvg(pct, label){
    const a = Math.PI * (1 - pct / 100), x = 100 + 80 * Math.cos(a), y = 100 - 80 * Math.sin(a);
    return '<svg class="gauge" viewBox="0 0 200 120" role="img" aria-label="' + esc(label + ' ' + pct + '%') + '"><path d="M20 100 A80 80 0 0 1 180 100" fill="none" stroke="var(--line2)" stroke-width="16" stroke-linecap="round"/>' +
      (pct > 0 ? '<path d="M20 100 A80 80 0 0 1 ' + x.toFixed(1) + ' ' + y.toFixed(1) + '" fill="none" stroke="var(--accent)" stroke-width="16" stroke-linecap="round"/>' : '') +
      '<text x="100" y="92" text-anchor="middle" font-size="30" font-weight="800" fill="currentColor">' + pct + '%</text><text x="100" y="114" text-anchor="middle" font-size="11" fill="currentColor" opacity=".7">' + esc(label) + '</text></svg>';
  }
  const taskOf = function(id){ return (D.tasks || []).find(function(t){ return t.id === id; }); };

  // ----- the fun layer: XP levels, Coco's tips, the activity strip, announcements, new-task alerts -----
  const RANKS = FR ? [['Tourist', 'سائح', '🧳'], ['Traveller', 'مسافر', '🚆'], ['Explorer', 'مستكشف', '🧭'], ['Café regular', 'زبون الكافيه', '☕'], ['Parisian', 'باريسي', '🗼'], ['Francophone', 'فرانكوفوني', '🎩'], ['Maître', 'الأستاذ', '👑']]
    : [['Rookie', 'مبتدئ', '🐣'], ['Explorer', 'مستكشف', '🧭'], ['Builder', 'بنّاء', '🧱'], ['Coder', 'مبرمج', '💻'], ['Hacker (the good kind)', 'هاكر أخلاقي', '🕶️'], ['Engineer', 'مهندس', '⚙️'], ['Architect', 'معماري', '🏗️'], ['Legend', 'أسطورة', '🏆']];
  function xpOf(act, subs){ return act.reduce(function(x, a){ return x + (a.points || 0); }, 0) + subs.reduce(function(x, s){ return x + Math.floor((s.score != null ? s.score : (s.auto_score || 0)) / 10) + (s.auto_passed ? 5 : 0); }, 0); }
  function levelOf(xp){ const n = Math.floor(xp / 100); return { n: n + 1, into: xp % 100, xp: xp, rank: RANKS[Math.min(n, RANKS.length - 1)] }; }
  function xpRing(lv){
    const C = 2 * Math.PI * 34, off = C * (1 - lv.into / 100);
    return '<div class="xp" title="' + esc(lv.xp + ' XP') + '"><svg viewBox="0 0 80 80" aria-hidden="true"><circle cx="40" cy="40" r="34" class="xp-bg"/><circle cx="40" cy="40" r="34" class="xp-fg" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '"/></svg>' +
      '<div class="xp-in"><small>' + esc(T('Level', 'مستوى')) + '</small><b>' + lv.n + '</b></div><div class="xp-cap">' + lv.rank[2] + ' ' + esc(T(lv.rank[0], lv.rank[1])) + '<small>' + (100 - lv.into) + ' XP ' + esc(T('to the next level', 'للمستوى الجاي')) + '</small></div></div>';
  }
  const TIPS = FR ? [['Say one French sentence out loud today. Your mouth learns too!', 'قول جملة فرنساوي بصوت عالي النهارده — بُقّك بيتعلم كمان!'], ['Stick sticky notes with French names on things at home.', 'الزق ورق عليه أسامي الحاجات بالفرنساوي في البيت.'],
      ['Watch 5 minutes of a French cartoon with subtitles.', 'اتفرج ٥ دقايق كرتون فرنساوي بالترجمة.'], ['Words you review just before forgetting stay forever. Open your notebook!', 'الكلمة اللي بتراجعها قبل ما تنساها بتفضل معاك — افتح كشكولك!'], ['Bonjour + merci + s’il vous plaît = instant good impression 😉', 'Bonjour + merci + s’il vous plaît = انطباع حلو على طول 😉']]
    : [['Stuck? Explain your code to a teddy bear. It really works (rubber-duck debugging)!', 'واقف؟ اشرح الكود لدبدوب — دي طريقة حقيقية اسمها Rubber duck!'], ['Small steps: make it work, then make it pretty.', 'خطوة خطوة: خليه يشتغل الأول، وبعدين حلّيه.'],
      ['Ctrl + Z is every programmer’s best friend.', 'Ctrl + Z صاحب كل مبرمج.'], ['Read the error message slowly. It usually tells you the line!', 'اقرا رسالة الخطأ بهدوء — غالباً بتقولك رقم السطر!'], ['Share a project on your portfolio. Your family will be proud!', 'شارك مشروع في معرضك — أهلك هيفرحوا بيك!']];
  let tipI = Math.floor(Math.random() * 5);
  function cocoBubble(){ const t = TIPS[tipI % TIPS.length]; return '<button type="button" class="coco-tip" data-act="tip" title="' + esc(T('Another tip', 'نصيحة تانية')) + '"><span class="coco-face">' + (FR ? '🥐' : '🤖') + '</span><span class="bub">' + esc(T(t[0], t[1])) + '</span></button>'; }
  ACT.tip = function(b){ tipI++; const t = TIPS[tipI % TIPS.length]; const bub = b.querySelector('.bub'); b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); bub.textContent = T(t[0], t[1]); };
  function activityStrip(days){
    const set = {}; (D.act || []).forEach(function(a){ set[a.day] = (set[a.day] || 0) + (a.points || 0); });
    let cells = ''; for(let i = 20; i >= 0; i--){ const d = addDays(todayStr(), -i), v = set[d] || 0; cells += '<i class="lv' + (v ? Math.min(3, 1 + Math.floor(v / 4)) : 0) + (i === 0 ? ' today' : '') + '" title="' + esc(d + ' · ' + v + ' ⭐') + '"></i>'; }
    return '<div class="card strip"><div class="row between"><b>' + esc(T('Your last 3 weeks', 'آخر ٣ أسابيع')) + '</b><small class="muted">' + esc(T('best streak: ', 'أطول سلسلة: ') + bestStreak(days)) + '</small></div><div class="cells">' + cells + '</div></div>';
  }
  function announceStrip(){
    const list = Object.keys(D.cfg || {}).map(function(k){ return D.cfg[k]; }).filter(function(c){ return c.announce && c.status !== 'hidden'; });
    if(!list.length) return '';
    return '<div class="announce" role="region" aria-label="' + esc(T('New courses', 'كورسات جديدة')) + '"><span class="ann-k">📣 ' + esc(T('New', 'جديد')) + '</span><div class="ann-list">' + list.map(function(c){
      return '<button type="button" class="ann" data-act="go" data-v="join" data-c="' + esc(c.course) + '"><b>' + esc(courseName(c.course)) + '</b>' + (c.status === 'soon' ? '<span class="pill warn">' + esc(T('coming soon', 'قريباً')) + '</span>' : '') + (c.note ? '<small>' + esc(c.note) + '</small>' : '') + '</button>'; }).join('') + '</div></div>';
  }
  const seenKey = function(){ return 'cc_seen_' + TRACK + '_' + (me && me.id); };
  function newTasks(){
    if(ROLE() !== 'student') return [];
    let seen = null; try{ seen = localStorage.getItem(seenKey()); }catch(e){}
    if(!seen) return [];
    return (D.tasks || []).filter(function(t){ return t.created_at > seen; });
  }
  function markTasksSeen(){ if(ROLE() === 'student') try{ localStorage.setItem(seenKey(), new Date().toISOString()); }catch(e){} }

  VIEWS.home = function(){
    if(ROLE() !== 'student') return;
    const act = activeEnrolls();
    const pending = (D.enrolls || []).filter(function(e){ return e.status === 'pending'; });
    const xp = xpOf(D.act || [], D.subs || []), lv = levelOf(xp);
    let h = '<div class="hello"><div class="grow"><h1>' + esc(T('Hi ' + firstName(me.full_name) + ' 👋', 'أهلاً ' + firstName(me.full_name) + ' 👋')) + '</h1><p class="muted">' +
      esc(act.length ? act.map(function(e){ return courseName(e.course); }).join(' · ') : T('Pick a course to start.', 'اختار كورس عشان تبدأ.')) + '</p>' + cocoBubble() + '</div>' +
      (act.length ? xpRing(lv) : '') + '</div>' + announceStrip();
    if(!act.length){
      h += pending.length ? '<div class="card"><h3>⏳ ' + esc(T('Your request is waiting', 'طلبك مستني التفعيل')) + '</h3><p>' + esc(T('As soon as the payment is confirmed, your teacher activates the course and everything opens here.', 'أول ما الدفع يتأكد، المعلم بيفعّل الكورس وكل حاجة تفتح هنا.')) + '</p><button class="btn main" data-act="go" data-v="join">' + esc(T('See payment details', 'شوف تفاصيل الدفع')) + '</button></div>'
        : '<div class="card hero-join"><span class="mascot">' + (FR ? '🥐' : '🤖') + '</span><h3>' + esc(T('Start your first course', 'ابدأ أول كورس')) + '</h3><p>' + esc(FR ? T('Choose Kids, Teens, Adults or DELF prep.', 'اختار أطفال أو شباب أو كبار أو تحضير DELF.') : T('39 courses: kids coding, languages, web, IoT, IT and Office.', '٣٩ كورس: برمجة أطفال ولغات ومواقع وIoT وIT وOffice.')) + '</p><button class="btn main" data-act="go" data-v="join">' + esc(T('Choose a course', 'اختار كورس')) + '</button></div>';
      main.innerHTML = h; return;
    }
    const days = (D.act || []).map(function(a){ return a.day; }), st = streakOf(days);
    const tasks = myTasks(), done = tasks.filter(function(t){ return isDone(subFor(t.id)); }).length;
    const pts = monthPoints(D.act || [], D.subs || []);
    h += '<div class="stats">' +
      '<div class="stat fire"><i>' + (FR ? '🥐' : '🔥') + '</i><b data-count="' + st + '">' + st + '</b><span>' + esc(T('day streak', 'يوم ورا بعض')) + '</span></div>' +
      '<div class="stat"><i>⭐</i><b data-count="' + pts + '">' + pts + '</b><span>' + esc(T('points this month', 'نقطة الشهر ده')) + '</span></div>' +
      (FR ? '<div class="stat"><i>🛂</i><b data-count="' + (D.stamps || []).length + '" data-suffix="/6">' + (D.stamps || []).length + '/6</b><span>' + esc(T('passport stamps', 'ختم في الباسبور')) + '</span></div>'
        : '<div class="stat"><i>✅</i><b data-count="' + done + '" data-suffix="/' + tasks.length + '">' + done + '/' + tasks.length + '</b><span>' + esc(T('tasks done', 'مهمة خلصت')) + '</span></div>') + '</div>' +
      activityStrip(days);
    h += liveCard(nextLive(D.tasks));
    h += FR ? fiveMinCard() : dailyCard();
    const next = tasks.find(function(t){ return !subFor(t.id); });
    if(next) h += '<div class="card next"><span class="big">' + (KINDS[next.kind] || ['📄'])[0] + '</span><div class="grow"><small class="muted">' + esc(T('Next on your path', 'اللي عليك دلوقتي')) + '</small><b>' + esc(next.title) + '</b>' + (next.due ? '<small class="muted">' + esc(T('Due ', 'آخر ميعاد ') + fmtDate(next.due)) + '</small>' : '') + '</div><button class="btn main" data-act="openTask" data-id="' + next.id + '">' + esc(T('Start', 'ابدأ')) + '</button></div>';
    if(FR){
      const dp = delfParts({ subs: D.subs || [], taskOf: taskOf, pron: D.pron || [], words: D.words || [], level: frLevel() });
      h += '<div class="card row gap"><div class="gauge-wrap">' + gaugeSvg(dp.total, T('Level ', 'المستوى ') + frLevel()) + '</div><div class="grow"><h3>' + esc(T('Your DELF meter', 'مؤشر DELF بتاعك')) + '</h3><p class="muted">' + esc(T('It grows with your mock exams, pronunciation, words and marks.', 'بيكبر مع الامتحانات التجريبية والنطق والكلمات والدرجات.')) + '</p><button class="btn ghost" data-act="go" data-v="delf">' + esc(T('See details', 'التفاصيل')) + '</button></div></div>';
    } else {
      const sk = skillAvg((D.subs || []).filter(function(s){ return s.skills; }));
      if(SKILLS.some(function(k){ return sk[k[0]] != null; })) h += '<div class="card row gap"><div>' + radarSvg(sk, 220) + '</div><div class="grow"><h3>' + esc(T('Your skills radar', 'رادار مهاراتك')) + '</h3><p class="muted">' + esc(T('Your teacher scores each project. The bigger the shape, the stronger you are.', 'المعلم بيقيّم كل مشروع — كل ما الشكل يكبر، كل ما تبقى أقوى.')) + '</p></div></div>';
    }
    const subs = D.subs || [];
    h += '<div class="card"><h3>' + esc(T('Badges', 'الشارات')) + '</h3>' + badgesFor({
      days: days.length, best: bestStreak(days), words: (D.words || []).length, bestPron: Math.max.apply(null, [0].concat((D.pron || []).map(function(p){ return p.score; }))),
      stamps: (D.stamps || []).length, done: done, submitted: subs.filter(function(s){ return s.status !== 'working'; }).length,
      codePass: subs.filter(function(s){ return s.auto_passed; }).length, top: Math.max.apply(null, [0].concat(subs.map(function(s){ return s.score || 0; }))), shared: subs.filter(function(s){ return s.public; }).length }) + '</div>';
    main.innerHTML = h;
  };
  ACT.go = function(b){ go(b.dataset.v); };

  // ----- the daily tech challenge -----
  const dailyIdx = function(){ const d = new Date(todayStr() + 'T00:00:00Z'); return Math.floor(d.getTime() / 86400000) % DAILY.length; };
  const didToday = function(){ return (D.act || []).some(function(a){ return a.day === todayStr(); }); };
  function dailyCard(){
    const q = DAILY[dailyIdx()];
    if(didToday()) return '<div class="card daily done"><span class="big">🔥</span><div><h3>' + esc(T('Today’s challenge: done!', 'تحدي النهارده: خلص!')) + '</h3><p class="muted">' + esc(T('Come back tomorrow to keep your streak alive.', 'ارجع بكرة عشان السلسلة متقطعش.')) + '</p></div></div>';
    const order = [0, 1, 2, 3].sort(function(a, b){ return ((a * 7 + dailyIdx()) % 4) - ((b * 7 + dailyIdx()) % 4); });
    return '<div class="card daily" id="dailyCard"><small class="kick">🔥 ' + esc(T('Daily challenge', 'التحدي اليومي')) + '</small><h3>' + esc(T(q[0], q[1])) + '</h3>' + (q[2] ? '<pre class="code">' + esc(q[2]) + '</pre>' : '') +
      '<div class="opts">' + order.map(function(i){ return '<button type="button" data-act="daily" data-i="' + i + '">' + esc(L(q[3][i])) + '</button>'; }).join('') + '</div><p class="msg" id="dailyMsg"></p></div>';
  }
  ACT.daily = async function(b){
    const q = DAILY[dailyIdx()], i = +b.dataset.i, right = i === q[4];
    document.querySelectorAll('[data-act=daily]').forEach(function(x){ x.disabled = true; if(+x.dataset.i === q[4]) x.classList.add('ok'); });
    if(!right) b.classList.add('no');
    if(right) party(b, { emoji: ['⭐', '🔥'] });
    $('dailyMsg').textContent = (right ? '✅ ' + T('Correct! +3 points. ', 'صح! +٣ نقط. ') : '💡 ' + T('+1 point for trying. ', '+١ نقطة عشان حاولت. ')) + T(q[5], q[6]);
    const r = await sb.rpc('track_checkin', { p_track: TRACK, p_points: right ? 3 : 1 });
    if(r.error) toast(errText(r.error), true); else { await refreshActivity(); setTimeout(function(){ if(view === 'home') render(); }, 2600); }
  };

  // ----- French: five minutes a day -----
  function fiveMinCard(){
    const due = dueWords().length;
    if(didToday()) return '<div class="card daily done"><span class="big">🥐</span><div><h3>' + esc(T('Your 5 minutes: done today!', 'الخمس دقايق بتوعك: خلصوا النهارده!')) + '</h3><p class="muted">' + esc(T('À demain! Come back tomorrow for the next croissant.', 'À demain! ارجع بكرة للكرواسون اللي بعده.')) + '</p></div></div>';
    return '<div class="card daily"><small class="kick">🥐 ' + esc(T('5 minutes a day', '٥ دقايق في اليوم')) + '</small><h3>' + esc(T('Today: review ' + Math.min(5, due) + ' words + say one sentence', 'النهارده: راجع ' + Math.min(5, due) + ' كلمات + قول جملة')) + '</h3><button class="btn main" data-act="fiveStart">' + esc(T('Start my 5 minutes', 'ابدأ الخمس دقايق')) + '</button></div>';
  }
  const dueWords = function(){ const t = todayStr(); return (D.words || []).filter(function(w){ return String(w.due) <= t; }); };
  let five = null;
  ACT.fiveStart = function(){ five = { words: dueWords().slice(0, 5), i: 0, flip: false, phrase: PHRASES[dailyIdx() % PHRASES.length] }; fiveStep(); };
  function fiveStep(){
    if(five.i < five.words.length){
      const w = five.words[five.i];
      openModal('<div class="five"><small class="muted">' + (five.i + 1) + ' / ' + five.words.length + '</small><div class="flash' + (five.flip ? ' flip' : '') + '"><b>' + esc(w.word) + '</b>' + (five.flip ? '<span>' + esc(w.meaning) + '</span>' : '') + '</div>' +
        '<div class="row gap center"><button class="btn ghost" data-act="say" data-t="' + esc(w.word) + '">🔊</button>' + (five.flip ? '<button class="btn bad" data-act="fiveAns" data-k="0">' + esc(T('I forgot', 'نسيتها')) + '</button><button class="btn main" data-act="fiveAns" data-k="1">' + esc(T('I knew it', 'عارفها')) + '</button>' : '<button class="btn main" data-act="fiveFlip">' + esc(T('Show meaning', 'وريني المعنى')) + '</button>') + '</div></div>');
      return;
    }
    const p = five.phrase;
    openModal('<div class="five"><small class="kick">🎙️ ' + esc(T('Say it in French', 'قولها بالفرنساوي')) + '</small><p class="fr-say">' + esc(p[0]) + '</p><p class="muted">' + esc(T(p[1], p[2])) + '</p>' +
      '<div class="row gap center"><button class="btn ghost" data-act="say" data-t="' + esc(p[0]) + '">🔊 ' + esc(T('Listen', 'اسمع')) + '</button><button class="btn main" data-act="speakTry" data-p="' + PHRASES.indexOf(p) + '" data-five="1">🎙️ ' + esc(T('Speak', 'اتكلم')) + '</button></div><p class="msg" id="speakMsg"></p>' +
      '<button class="btn dark wide" data-act="fiveDone">' + esc(T('Finish my 5 minutes', 'خلّصت الخمس دقايق')) + '</button></div>');
  }
  ACT.fiveFlip = function(){ five.flip = true; fiveStep(); };
  ACT.fiveAns = async function(b){ await reviewWord(five.words[five.i], b.dataset.k === '1'); five.i++; five.flip = false; fiveStep(); };
  ACT.fiveDone = async function(b){
    await busy(b, async function(){ const r = await sb.rpc('track_checkin', { p_track: TRACK, p_points: 3 }); if(r.error) throw r.error; });
    closeModal(); await refreshActivity(); party(null, { emoji: ['🥐', '🇫🇷', '⭐'], n: 140, colors: ['#8a1c33', '#c9a227', '#1f3a6e', '#ffffff'] }); toast(T('Bravo! +3 points 🥐', 'برافو! +٣ نقط 🥐')); render();
  };
  ACT.say = function(b){ speak(b.dataset.t, b.dataset.l || 'fr-FR'); };
  async function reviewWord(w, knew){
    const box = knew ? Math.min(5, w.box + 1) : 1, due = addDays(todayStr(), knew ? BOX_DAYS[box] : 0);
    const r = await sb.from('fr_words').update({ box: box, due: due }).eq('id', w.id);
    if(r.error){ toast(errText(r.error), true); return; }
    w.box = box; w.due = due;
  }

  // ----- tech: the skill map -----
  VIEWS.map = function(){
    const tasks = myTasks();
    if(!tasks.length){ main.innerHTML = emptyCard('🗺️', T('Your teacher hasn’t added tasks yet. Your map will grow here.', 'المعلم لسه منزّلش مهام — خريطتك هتكبر هنا.')); return; }
    let nextFound = false;
    main.innerHTML = '<div class="head"><h2>🗺️ ' + esc(T('Your skill map', 'خريطة مهاراتك')) + '</h2><p class="muted">' + esc(T('Every task is a stage. Finish it and it lights up!', 'كل مهمة مرحلة — خلّصها تنوّر!')) + '</p></div><div class="map">' +
      tasks.map(function(t, i){
        const s = subFor(t.id); let st = isDone(s) ? 'done' : s && s.status === 'submitted' ? 'wait' : 'todo';
        if(st === 'todo' && !nextFound){ st = 'next'; nextFound = true; }
        return '<button type="button" class="node s-' + st + (i % 2 ? ' r' : '') + '" data-act="openTask" data-id="' + t.id + '"><span class="dot">' + (st === 'done' ? '⭐' : st === 'wait' ? '⏳' : (KINDS[t.kind] || ['📄'])[0]) + '</span><span class="lbl"><b>' + esc(t.title) + '</b><small>' +
          esc(kindLabel(t.kind) + (st === 'done' && s.score != null ? ' · ' + s.score + '/100' : '')) + '</small></span></button>';
      }).join('') + '<div class="node finish"><span class="dot">🏆</span><span class="lbl"><b>' + esc(T('Certificate', 'الشهادة')) + '</b></span></div></div>';
  };

  // ----- tasks -----
  VIEWS.tasks = function(){
    const tasks = (D.tasks || []).slice().reverse();
    if(!tasks.length){ main.innerHTML = emptyCard('📝', T('No tasks yet. Your teacher will add them here.', 'لسه مفيش مهام — المعلم هينزلها هنا.')); return; }
    const groups = [['todo', '📌', 'To do', 'عليك'], ['wait', '⏳', 'Waiting for your teacher', 'مستني المعلم'], ['done', '✅', 'Done', 'خلصت']];
    const stOf = function(t){ const s = subFor(t.id); return t.kind === 'live' ? 'live' : isDone(s) ? 'done' : s && s.status === 'submitted' ? 'wait' : 'todo'; };
    let h = '<div class="head"><h2>📝 ' + esc(T('Tasks', 'المهام')) + '</h2></div>' + liveCard(nextLive(D.tasks));
    groups.forEach(function(g){
      const list = tasks.filter(function(t){ return stOf(t) === g[0]; });
      if(!list.length) return;
      h += '<h3 class="sec">' + g[1] + ' ' + esc(T(g[2], g[3])) + ' <small>' + list.length + '</small></h3><div class="list">' + list.map(function(t){
        const s = subFor(t.id);
        return '<button type="button" class="item" data-act="openTask" data-id="' + t.id + '"><span class="ic">' + (KINDS[t.kind] || ['📄'])[0] + '</span><span class="grow"><b>' + esc(t.title) + '</b><small>' + esc(kindLabel(t.kind) + (t.course ? ' · ' + courseName(t.course) : '') + (t.due ? ' · ' + T('due ', 'آخر ميعاد ') + fmtDate(t.due) : '')) + '</small></span>' +
          (s && s.score != null ? '<span class="pill good">' + s.score + '</span>' : s && s.auto_passed ? '<span class="pill good">✓</span>' : '') + '</button>';
      }).join('') + '</div>';
    });
    main.innerHTML = h;
  };
  ACT.openTask = function(b){ cur = +b.dataset.id; view = 'task'; renderChrome(); render(); window.scrollTo({ top: 0 }); };
  VIEWS.task = function(){
    const t = taskOf(cur); if(!t){ go('tasks'); return; }
    const s = subFor(t.id), locked = s && s.status === 'graded';
    let h = '<button class="link" data-act="go" data-v="' + (FR ? 'tasks' : 'map') + '">' + esc(T('← Back', 'رجوع →')) + '</button><div class="card task"><small class="kick">' + esc(kindLabel(t.kind)) + '</small><h2>' + esc(t.title) + '</h2>' +
      (t.due ? '<p class="muted small">' + esc(T('Due ', 'آخر ميعاد ') + fmtDate(t.due)) + '</p>' : '') + (t.body ? '<div class="body">' + esc(t.body).replace(/\n/g, '<br>') + '</div>' : '');
    if(s && s.status === 'graded') h += '<div class="graded"><b>' + esc(T('Your mark', 'درجتك')) + ': ' + s.score + '/100</b>' + (s.feedback ? '<p>💬 ' + esc(s.feedback) + '</p>' : '') + (s.skills && !FR ? radarSvg(s.skills, 180) : '') + '</div>';
    if(t.kind === 'live'){
      h += '<p>🕒 ' + esc(fmtDate(t.starts_at, true)) + '</p>' + (isUrl(t.link) ? '<a class="btn main" href="' + esc(t.link) + '" target="_blank" rel="noopener">📡 ' + esc(T('Join the class', 'ادخل الحصة')) + '</a>' : '');
    } else if(t.kind === 'code'){
      h += '<div class="ide"><div class="ide-bar"><span>' + (t.lang === 'js' ? 'JavaScript' : 'Python') + '</span><span class="grow"></span><button class="btn ghost sm" data-act="runCode">▶ ' + esc(T('Run', 'شغّل')) + '</button></div>' +
        '<textarea id="codeIn" class="editor" spellcheck="false" dir="ltr"' + (locked ? ' readonly' : '') + '>' + esc((s && s.content) || t.starter || '') + '</textarea>' +
        '<pre class="console" id="codeOut" dir="ltr">' + esc((s && s.output) || '') + '</pre></div>' +
        (s && s.auto_passed != null ? '<p class="msg ' + (s.auto_passed ? 'okc' : 'noc') + '">' + esc(s.auto_passed ? T('✅ Correct output! Coco checked it.', '✅ الناتج صح! كوكو اتأكد.') : T('❌ Not the expected output yet. Read the task again and try.', '❌ الناتج لسه مش المطلوب. اقرا المهمة تاني وجرّب.')) + '</p>' : '') +
        (locked ? '' : '<div class="row gap"><button class="btn main" data-act="submitCode">' + esc(T('Check & submit', 'اتأكد وسلّم')) + '</button></div>');
    } else if(t.kind === 'quiz'){
      const qs = Array.isArray(t.questions) ? t.questions : [];
      h += (s && s.auto_score != null ? '<p class="msg okc">' + esc(T('Your score: ', 'نتيجتك: ') + s.auto_score + '%') + '</p>' : '') + '<form data-form="quiz" class="quiz">' + qs.map(function(q, i){
        return '<fieldset><legend>' + (i + 1) + '. ' + esc(q.q) + '</legend>' + (q.opts || []).map(function(o, j){ return '<label class="opt"><input type="radio" name="q' + i + '" value="' + j + '"' + (locked ? ' disabled' : '') + '> <span>' + esc(o) + '</span></label>'; }).join('') + '</fieldset>';
      }).join('') + (locked ? '' : '<button class="btn main" type="submit">' + esc(T('Submit my answers', 'سلّم إجاباتي')) + '</button>') + '</form>';
    } else if(t.kind === 'voice'){
      h += (t.phrase ? '<p class="fr-say">' + esc(t.phrase) + ' <button class="btn ghost sm" data-act="say" data-t="' + esc(t.phrase) + '">🔊</button></p>' : '') +
        (s && s.audio_path ? '<p class="muted">✅ ' + esc(T('Recording sent. You can record again before your teacher marks it.', 'التسجيل اتبعت. ممكن تسجّل تاني قبل ما المعلم يصحح.')) + '</p>' : '') +
        (locked ? '' : '<div class="rec"><button class="btn main" data-act="rec" id="recBtn">⏺ ' + esc(T('Record', 'سجّل')) + '</button><audio id="recPlay" controls hidden></audio><button class="btn dark" data-act="sendRec" id="sendRec" hidden>' + esc(T('Send to my teacher', 'ابعت للمعلم')) + '</button></div>');
    } else {
      h += '<form data-form="project" class="form"><label>' + esc(T('Link to your work (Scratch, GitHub, Replit, Figma, Drive…)', 'لينك شغلك (Scratch أو GitHub أو Replit أو Figma أو Drive…)')) + '<input name="link" type="url" dir="ltr" placeholder="https://" value="' + esc(s && isUrl(s.content) ? s.content : '') + '"' + (locked ? ' readonly' : '') + '></label>' +
        '<label>' + esc(T('Or write what you did', 'أو اكتب عملت إيه')) + '<textarea name="notes" rows="4"' + (locked ? ' readonly' : '') + '>' + esc(s && !isUrl(s.content) ? s.content || '' : '') + '</textarea></label>' +
        (locked ? '' : '<div class="row gap"><button class="btn ghost" type="button" data-act="working">🛠️ ' + esc(T('I’m working on it', 'شغال عليه')) + '</button><button class="btn main" type="submit">' + esc(T('Submit', 'سلّم')) + '</button></div>') + '</form>';
    }
    main.innerHTML = h + '</div>';
    const ed = $('codeIn');
    if(ed) ed.addEventListener('keydown', function(e){ if(e.key === 'Tab'){ e.preventDefault(); const p = ed.selectionStart; ed.value = ed.value.slice(0, p) + '    ' + ed.value.slice(ed.selectionEnd); ed.selectionStart = ed.selectionEnd = p + 4; } });
  };
  async function submit(taskId, status, extra){
    const r = await sb.rpc('track_submit', Object.assign({ p_task: taskId, p_status: status }, extra || {}));
    if(r.error) throw r.error;
    const row = Array.isArray(r.data) ? r.data[0] : r.data;
    D.subs = (D.subs || []).filter(function(s){ return s.task_id !== taskId; }); if(row) D.subs.push(row);
    return row;
  }
  ACT.working = function(b){ busy(b, async function(){ await submit(cur, 'working'); toast(T('Your teacher can see you started 💪', 'المعلم شايف إنك بدأت 💪')); render(); }); };
  FORMS.project = function(f){
    const link = f.link.value.trim(), notes = f.notes.value.trim();
    if(!link && !notes){ toast(T('Add a link or a few words first.', 'حط لينك أو اكتب كلمتين الأول.'), true); return; }
    busy(f.querySelector('[type=submit]'), async function(){ await submit(cur, 'submitted', { p_content: link || notes }); toast(T('Submitted! 🎉', 'اتسلّم! 🎉')); render(); });
  };
  FORMS.quiz = function(f){
    const t = taskOf(cur), n = (t.questions || []).length, ans = [];
    for(let i = 0; i < n; i++){ const c = f.querySelector('input[name=q' + i + ']:checked'); ans.push(c ? +c.value : null); }
    if(ans.some(function(a){ return a === null; })){ toast(T('Answer every question first.', 'جاوب على كل الأسئلة الأول.'), true); return; }
    busy(f.querySelector('[type=submit]'), async function(){ const row = await submit(cur, 'submitted', { p_answers: ans }); if(row && row.auto_score >= 80) party(null, { emoji: ['🎉', '⭐'], n: 130 }); toast(T('Score: ', 'النتيجة: ') + (row && row.auto_score != null ? row.auto_score + '%' : '✓')); render(); });
  };

  // ----- running code in the browser (a worker, so a loop can't freeze the page) -----
  const JS_WORKER = 'self.onmessage=function(e){var out=[];var log=function(){out.push(Array.prototype.map.call(arguments,function(x){return typeof x==="object"?JSON.stringify(x):String(x)}).join(" "))};' +
    'try{(new Function("console",e.data))({log:log,error:log,warn:log,info:log});postMessage({out:out.join("\\n")})}catch(err){postMessage({out:out.join("\\n"),err:String(err)})}};';
  const PY_WORKER = 'var py=null;self.onmessage=async function(e){try{if(!py){importScripts("https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js");py=await loadPyodide({indexURL:"https://cdn.jsdelivr.net/pyodide/v0.26.4/full/"});}' +
    'var out=[];py.setStdout({batched:function(s){out.push(s)}});py.setStderr({batched:function(s){out.push(s)}});await py.runPythonAsync(e.data);postMessage({out:out.join("\\n")})}' +
    'catch(err){postMessage({out:"",err:String(err&&err.message||err).trim().split("\\n").slice(-1)[0]})}};';
  let pyWorker = null;
  function runCode(lang, code){
    return new Promise(function(resolve){
      const isPy = lang !== 'js';
      let w = isPy ? pyWorker : null;
      if(!w){ w = new Worker(URL.createObjectURL(new Blob([isPy ? PY_WORKER : JS_WORKER], { type: 'text/javascript' }))); if(isPy) pyWorker = w; }
      const timer = setTimeout(function(){ w.terminate(); if(isPy) pyWorker = null; resolve({ out: '', err: T('It took too long. Is there a loop that never ends?', 'خد وقت طويل — في تكرار مش بيخلص؟') }); }, isPy ? 45000 : 4000);
      w.onmessage = function(e){ clearTimeout(timer); if(!isPy) w.terminate(); resolve(e.data || {}); };
      w.postMessage(code);
    });
  }
  async function runInIde(){
    const t = taskOf(cur), out = $('codeOut');
    out.textContent = t.lang === 'js' ? '…' : T('Starting Python… (the first run takes a few seconds)', 'بيشغّل بايثون… (أول مرة بتاخد ثواني)');
    const r = await runCode(t.lang, $('codeIn').value);
    out.textContent = (r.out || '') + (r.err ? (r.out ? '\n' : '') + '⚠ ' + r.err : '') || T('(nothing printed)', '(مفيش حاجة اتطبعت)');
    return r;
  }
  ACT.runCode = function(b){ busy(b, runInIde); };
  ACT.submitCode = function(b){
    busy(b, async function(){
      const r = await runInIde();
      const row = await submit(cur, 'submitted', { p_content: $('codeIn').value, p_output: r.err ? (r.out || '') + '\n' + r.err : (r.out || '') });
      if(row && row.auto_passed) party(null, { emoji: ['⭐', '💻', '✅'], n: 140 });
      toast(row && row.auto_passed ? T('✅ Correct! Submitted.', '✅ صح! واتسلّم.') : T('Submitted. The output is not the expected one yet.', 'اتسلّم — بس الناتج لسه مش المطلوب.'), !(row && row.auto_passed));
      render();
    });
  };

  // ----- recording a voice task -----
  let rec = null, recBlob = null;
  ACT.rec = async function(b){
    if(rec && rec.state === 'recording'){ rec.stop(); return; }
    if(!navigator.mediaDevices || !window.MediaRecorder){ toast(T('Recording is not supported in this browser.', 'المتصفح ده مش بيدعم التسجيل.'), true); return; }
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const chunks = []; rec = new MediaRecorder(stream);
      rec.ondataavailable = function(e){ if(e.data.size) chunks.push(e.data); };
      rec.onstop = function(){ stream.getTracks().forEach(function(t){ t.stop(); }); recBlob = new Blob(chunks, { type: rec.mimeType || 'audio/webm' });
        const a = $('recPlay'); if(a){ a.src = URL.createObjectURL(recBlob); a.hidden = false; $('sendRec').hidden = false; } b.textContent = '⏺ ' + T('Record again', 'سجّل تاني'); b.classList.remove('rec-on'); };
      rec.start(); b.textContent = '⏹ ' + T('Stop', 'وقّف'); b.classList.add('rec-on');
      setTimeout(function(){ if(rec && rec.state === 'recording') rec.stop(); }, 120000);
    }catch(e){ toast(T('Allow the microphone to record.', 'اسمح بالمايك عشان تسجّل.'), true); }
  };
  ACT.sendRec = function(b){
    if(!recBlob) return;
    busy(b, async function(){
      const ext = /mp4|aac/.test(recBlob.type) ? 'm4a' : 'webm', path = me.id + '/task-' + cur + '-' + Date.now() + '.' + ext;
      const up = await sb.storage.from('voice').upload(path, recBlob, { contentType: recBlob.type });
      if(up.error) throw up.error;
      await submit(cur, 'submitted', { p_audio: path }); recBlob = null; toast(T('Sent to your teacher 🎧', 'اتبعت للمعلم 🎧')); render();
    });
  };

  // ----- tech: portfolio -----
  VIEWS.portfolio = function(){
    const items = (D.subs || []).filter(function(s){ const t = taskOf(s.task_id); return t && (t.kind === 'project' || t.kind === 'code') && s.status !== 'working' && s.content; });
    const link = location.origin + location.pathname + '?portfolio=' + me.id;
    let h = '<div class="head"><h2>🗂️ ' + esc(T('My portfolio', 'معرض مشاريعي')) + '</h2><p class="muted">' + esc(T('Choose which projects to show. Share the link with your family, your school or an employer.', 'اختار المشاريع اللي تظهر، وشارك اللينك مع أهلك أو مدرستك أو أي شركة.')) + '</p></div>' +
      '<div class="card share"><code dir="ltr">' + esc(link) + '</code><div class="row gap"><button class="btn ghost sm" data-act="copy" data-t="' + esc(link) + '">' + esc(T('Copy link', 'انسخ اللينك')) + '</button>' +
      '<a class="btn ghost sm" target="_blank" rel="noopener" href="https://wa.me/?text=' + encodeURIComponent(T('See my projects at Coco Tech Lab: ', 'شوف مشاريعي في Coco Tech Lab: ') + link) + '">WhatsApp</a><a class="btn ghost sm" href="' + esc(link) + '" target="_blank" rel="noopener">' + esc(T('Preview', 'معاينة')) + '</a></div></div>';
    h += items.length ? '<div class="list">' + items.map(function(s){ const t = taskOf(s.task_id);
      return '<label class="item"><span class="ic">' + (KINDS[t.kind] || ['📄'])[0] + '</span><span class="grow"><b>' + esc(t.title) + '</b><small>' + esc(s.score != null ? s.score + '/100' : T('not marked yet', 'لسه متصححش')) + '</small></span><span class="switch"><input type="checkbox" data-pub="' + s.id + '"' + (s.public ? ' checked' : '') + '><i></i></span></label>';
    }).join('') + '</div>' : emptyCard('🛠️', T('Submit a project or a code exercise and it can appear here.', 'سلّم مشروع أو تمرين كود وهيقدر يظهر هنا.'));
    main.innerHTML = h;
  };
  main.addEventListener('change', async function(e){
    const c = e.target.closest('[data-pub]'); if(!c) return;
    const r = await sb.rpc('track_set_public', { p_submission: +c.dataset.pub, p_public: c.checked });
    if(r.error){ toast(errText(r.error), true); c.checked = !c.checked; return; }
    const s = (D.subs || []).find(function(x){ return x.id === +c.dataset.pub; }); if(s) s.public = c.checked;
    toast(c.checked ? T('Shown on your portfolio', 'ظاهر في معرضك') : T('Hidden from your portfolio', 'اتشال من معرضك'));
  });
  ACT.copy = async function(b){ try{ await navigator.clipboard.writeText(b.dataset.t); toast(T('Copied ✓', 'اتنسخ ✓')); }catch(e){ toast(b.dataset.t); } };

  // ----- ranking -----
  VIEWS.rank = async function(){
    main.innerHTML = '<div class="head"><h2>🏆 ' + esc(T('This month’s top 10', 'أحسن ١٠ الشهر ده')) + '</h2><p class="muted">' + esc(T('Points come from daily practice, tasks and marks. A new race every month!', 'النقط من التمرين اليومي والمهام والدرجات — سباق جديد كل شهر!')) + '</p></div><div class="loading">🏆</div>';
    const r = await sb.rpc('track_leaderboard', { p_track: TRACK }), rows = r.data || [];
    if(view !== 'rank') return;
    main.querySelector('.loading').outerHTML = rows.length ? '<ol class="rank">' + rows.map(function(x, i){ return '<li class="' + (x.me ? 'me' : '') + '"><span class="pos">' + (['🥇', '🥈', '🥉'][i] || i + 1) + '</span><b>' + esc(x.name) + (x.me ? ' (' + T('you', 'إنت') + ')' : '') + '</b><span class="pts">' + x.points + ' ⭐</span></li>'; }).join('') + '</ol>'
      : emptyCard('🏁', T('No points yet this month. Be the first!', 'لسه مفيش نقط الشهر ده — خليك الأول!'));
  };

  // ----- certificates -----
  VIEWS.certs = function(){
    const list = D.certs || [];
    main.innerHTML = '<div class="head"><h2>🎓 ' + esc(T('My certificates', 'شهاداتي')) + '</h2><p class="muted">' + esc(T('Each certificate has a QR code anyone can scan to check it.', 'كل شهادة عليها QR أي حد يقدر يمسحه ويتأكد منها.')) + '</p></div>' +
      (list.length ? '<div class="grid2">' + list.map(function(c){ return '<div class="card cert-mini"><span class="big">🎓</span><b>' + esc(courseName(c.course)) + '</b><small class="muted">' + esc(fmtDate(c.issued_at)) + '</small><button class="btn main" data-act="cert" data-id="' + c.id + '">' + esc(T('Open & print', 'افتح واطبع')) + '</button></div>'; }).join('') + '</div>'
        : emptyCard('🎓', T('Finish your course and your teacher will issue your certificate here.', 'خلّص الكورس والمعلم هيطلعلك الشهادة هنا.')));
  };
  ACT.cert = async function(b){
    const c = (D.certs || []).find(function(x){ return x.id === b.dataset.id; }); if(!c) return;
    const url = location.origin + location.pathname + '?verify=' + c.id;
    let qr = '';
    try{ if(!window.qrcode) await loadScript('https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js'); const q = window.qrcode(0, 'M'); q.addData(url); q.make(); qr = q.createSvgTag({ cellSize: 3, margin: 0, scalable: true }); }catch(e){}
    openModal('<div class="certificate" id="certPrint"><img src="assets/img/logo.jpg" alt="" class="cert-logo"><small class="kick">' + (FR ? 'Le Club Français' : 'Coco Tech Lab') + ' · Code Cademy</small>' +
      '<h1>' + esc(T('Certificate of completion', 'شهادة إتمام')) + '</h1><p>' + esc(T('This certifies that', 'نشهد بأن')) + '</p><h2>' + esc(c.student_name) + '</h2><p>' + esc(T('has successfully completed', 'أتمّ بنجاح كورس')) + '</p><h3>' + esc(courseName(c.course)) + '</h3>' +
      '<div class="cert-foot"><div><small>' + esc(T('Date', 'التاريخ')) + '</small><b>' + esc(fmtDate(c.issued_at)) + '</b><small dir="ltr">ID ' + esc(c.id.slice(0, 8).toUpperCase()) + '</small></div><div class="qr">' + qr + '<small>' + esc(T('Scan to verify', 'امسح للتأكد')) + '</small></div></div></div>' +
      '<div class="row gap center noprint"><button class="btn main" data-act="print">🖨️ ' + esc(T('Print / save as PDF', 'اطبع / احفظ PDF')) + '</button><button class="btn ghost" data-close>' + esc(T('Close', 'إغلاق')) + '</button></div>', true);
  };
  ACT.print = function(){ window.print(); };

  // ----- courses & payment -----
  let settings = null;
  async function loadSettings(){
    if(settings) return settings;
    const rows = await sel(sb.from('academy_settings').select('key, value').in('key', ['bank_name', 'bank_holder', 'bank_iban', TRACK + '_price']));
    settings = {}; rows.forEach(function(r){ settings[r.key] = r.value; }); return settings;
  }
  const fmtIban = function(s){ return String(s || '').replace(/\s+/g, '').replace(/(.{4})/g, '$1 ').trim(); };
  VIEWS.join = async function(){
    const st = await loadSettings(); if(view !== 'join') return;
    const price = st[TRACK + '_price'];
    const mine = D.enrolls || [];
    let h = '<div class="head"><h2>➕ ' + esc(T('Courses & payment', 'الكورسات والدفع')) + '</h2></div>' + announceStrip().replace(/data-act="go" data-v="join"/g, 'data-act="pickCourse"');
    if(mine.length) h += '<div class="list">' + mine.map(function(e){
      const badge = { pending: ['⏳', 'Waiting for payment', 'مستني الدفع', 'warn'], active: ['✅', 'Active', 'شغال', 'good'], done: ['🎓', 'Completed', 'خلص', 'good'] }[e.status || 'pending'] || ['⏳', 'Waiting for payment', 'مستني الدفع', 'warn'];
      if(!e.status) e.status = 'pending';
      let x = '<div class="item col"><div class="row between"><b>' + esc(courseName(e.course)) + '</b><span class="pill ' + badge[3] + '">' + badge[0] + ' ' + esc(T(badge[1], badge[2])) + '</span></div>';
      if(e.status === 'pending'){
        x += e.method === 'bank' ? bankBox(st, price) + (e.receipt_path ? '<p class="msg okc">🧾 ' + esc(T('Receipt received. We’ll activate your course soon.', 'الإيصال وصل — هنفعّل الكورس قريب.')) + '</p>' : '') +
          '<label class="btn ghost sm file">🧾 ' + esc(e.receipt_path ? T('Replace receipt', 'غيّر الإيصال') : T('Upload the transfer receipt', 'ارفع إيصال التحويل')) + '<input type="file" accept="image/*,application/pdf" data-receipt="' + e.id + '" hidden></label>'
          : '<a class="btn ghost sm" target="_blank" rel="noopener" href="https://wa.me/' + WA + '?text=' + encodeURIComponent(T('Hello! I asked to join ' + courseName(e.course) + '. My name: ' + me.full_name, 'السلام عليكم، طلبت أشترك في ' + courseName(e.course) + '. اسمي: ' + me.full_name)) + '">💬 ' + esc(T('Finish on WhatsApp', 'كمّل على واتساب')) + '</a>';
        x += '<button class="link danger" data-act="cancelReq" data-id="' + e.id + '">' + esc(T('Cancel request', 'إلغاء الطلب')) + '</button>';
      }
      return x + '</div>';
    }).join('') + '</div>';
    h += '<div class="card"><h3>' + esc(T('Join a new course', 'اشترك في كورس جديد')) + '</h3>' + (price ? '<p class="price">' + esc(price) + ' <small>' + esc(T('SAR / month', 'ريال / شهر')) + '</small></p>' : '') +
      '<form data-form="enroll" class="form"><label>' + esc(T('Course', 'الكورس')) + '<select name="course" required>' + courseOptions('', false, true) + '</select></label>' +
      '<fieldset class="pay"><legend>' + esc(T('How will you pay?', 'هتدفع إزاي؟')) + '</legend><label><input type="radio" name="method" value="bank" checked> 🏦 ' + esc(T('Bank transfer (Al Rajhi)', 'تحويل بنكي (الراجحي)')) + '</label><label><input type="radio" name="method" value="whatsapp"> 💬 ' + esc(T('Talk to us on WhatsApp', 'نتكلم على واتساب')) + '</label></fieldset>' +
      '<button class="btn main" type="submit">' + esc(T('Send my request', 'ابعت طلبي')) + '</button></form></div>';
    main.innerHTML = h;
  };
  function bankBox(st, price){
    if(!st.bank_iban) return '<p class="muted small">' + esc(T('Message us on WhatsApp and we’ll send you the bank details.', 'كلّمنا على واتساب وهنبعتلك بيانات الحساب.')) + '</p>';
    return '<div class="bank"><div><span>' + esc(T('Bank', 'البنك')) + '</span><b>' + esc(st.bank_name || 'Al Rajhi Bank') + '</b></div>' + (st.bank_holder ? '<div><span>' + esc(T('Account holder', 'صاحب الحساب')) + '</span><b>' + esc(st.bank_holder) + '</b></div>' : '') +
      '<div><span>IBAN</span><b dir="ltr">' + esc(fmtIban(st.bank_iban)) + '</b><button class="btn ghost sm" data-act="copy" data-t="' + esc(String(st.bank_iban).replace(/\s+/g, '')) + '">' + esc(T('Copy', 'نسخ')) + '</button></div>' + (price ? '<div><span>' + esc(T('Amount', 'المبلغ')) + '</span><b>' + esc(price) + ' ' + esc(T('SAR', 'ريال')) + '</b></div>' : '') + '</div>';
  }
  FORMS.enroll = function(f){
    const course = f.course.value, method = f.querySelector('input[name=method]:checked').value;
    if((D.enrolls || []).some(function(e){ return e.course === course; })){ toast(T('You already asked for this course.', 'إنت طلبت الكورس ده قبل كده.'), true); return; }
    busy(f.querySelector('[type=submit]'), async function(){
      const r = await sb.from('track_enrollments').insert({ track: TRACK, course: course, method: method }).select().single();
      if(r.error) throw r.error;
      D.enrolls.push(Object.assign({ status: 'pending', method: method, course: course }, r.data)); toast(T('Request sent ✓', 'الطلب اتبعت ✓'));
      if(method === 'whatsapp') window.open('https://wa.me/' + WA + '?text=' + encodeURIComponent(T('Hello! I would like to join ' + courseName(course) + '. My name: ' + me.full_name, 'السلام عليكم، عايز أشترك في ' + courseName(course) + '. اسمي: ' + me.full_name)), '_blank');
      render();
    });
  };
  ACT.cancelReq = function(b){
    if(!confirm(T('Cancel this request?', 'تلغي الطلب ده؟'))) return;
    busy(b, async function(){ const r = await sb.from('track_enrollments').delete().eq('id', +b.dataset.id); if(r.error) throw r.error; D.enrolls = D.enrolls.filter(function(e){ return e.id !== +b.dataset.id; }); render(); });
  };
  main.addEventListener('change', async function(e){
    const inp = e.target.closest('[data-receipt]'); if(!inp || !inp.files[0]) return;
    const f = inp.files[0];
    if(f.size > 10 * 1024 * 1024){ toast(T('The file is bigger than 10 MB.', 'الملف أكبر من ١٠ ميجا.'), true); return; }
    toast(T('Uploading…', 'بيرفع…'));
    const ext = (f.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) || 'jpg';
    const path = me.id + '/track-' + inp.dataset.receipt + '-' + Date.now() + '.' + ext;
    const up = await sb.storage.from('receipts').upload(path, f, { contentType: f.type || undefined });
    if(up.error){ toast(errText(up.error), true); return; }
    const r = await sb.rpc('track_attach_receipt', { p_enrollment: +inp.dataset.receipt, p_path: path });
    if(r.error){ toast(errText(r.error), true); return; }
    const en = D.enrolls.find(function(x){ return x.id === +inp.dataset.receipt; }); if(en) en.receipt_path = path;
    toast(T('Receipt sent ✓', 'الإيصال اتبعت ✓')); render();
  });

  // ----- French: the passport -----
  function passportHtml(stamps, level, name){
    return '<div class="passport"><div class="pp-cover"><span>🇫🇷</span><div><small>PASSEPORT · Le Club Français</small><b>' + esc(name) + '</b></div></div><div class="pp-pages">' + FR_LEVELS.map(function(l, i){
      const s = stamps.find(function(x){ return x.level === i + 1; }), isCur = !s && level === i + 1;
      return '<div class="stamp' + (s ? ' got' : '') + (isCur ? ' cur' : '') + '" style="--r:' + ((i * 37) % 17 - 8) + 'deg"><span class="em">' + (s ? l[1] : isCur ? '✈️' : '🔒') + '</span><b>' + l[0] + '</b><small>' + esc(T('Level ' + (i + 1), 'المستوى ' + (i + 1))) + '</small>' +
        (s ? '<i>' + esc(fmtDate(s.awarded_at)) + '</i>' : isCur ? '<i>' + esc(T('You are here', 'إنت هنا')) + '</i>' : '') + '</div>';
    }).join('') + '</div></div>';
  }
  VIEWS.passport = function(){
    const lv = frLevel(), L1 = FR_LEVELS[lv - 1];
    main.innerHTML = '<div class="head"><h2>🛂 ' + esc(T('My French passport', 'باسبوري الفرنسي')) + '</h2><p class="muted">' + esc(T('Every level you finish earns the stamp of a French city. Collect all six!', 'كل مستوى تخلّصه تاخد ختم مدينة فرنسية — جمّع الستة!')) + '</p></div>' +
      passportHtml(D.stamps || [], lv, me.full_name) +
      '<div class="card"><small class="kick">✈️ ' + esc(T('Next stop', 'المحطة الجاية')) + '</small><h3>' + L1[1] + ' ' + L1[0] + ' · ' + esc(T('Level ' + lv, 'المستوى ' + lv)) + '</h3><p>' + esc(T(L1[5], L1[6])) + '</p></div>';
  };

  // ----- French: my words (spaced repetition) -----
  VIEWS.words = function(){
    const words = D.words || [], due = dueWords();
    let h = '<div class="head"><h2>📒 ' + esc(T('My word notebook', 'كشكول كلماتي')) + '</h2><p class="muted">' + esc(T('Coco brings back each word right before you forget it. Words you know come back less often.', 'كوكو بيرجّعلك الكلمة قبل ما تنساها بالظبط — والكلمة اللي بتعرفها بتيجي أقل.')) + '</p></div>' +
      '<div class="stats"><div class="stat"><i>📚</i><b>' + words.length + '</b><span>' + esc(T('words', 'كلمة')) + '</span></div><div class="stat"><i>🧠</i><b>' + wordsMastered(words) + '</b><span>' + esc(T('mastered', 'متقنة')) + '</span></div><div class="stat fire"><i>🔁</i><b>' + due.length + '</b><span>' + esc(T('to review today', 'للمراجعة النهارده')) + '</span></div></div>' +
      (due.length ? '<button class="btn main wide" data-act="review">🔁 ' + esc(T('Review ' + due.length + ' words now', 'راجع ' + due.length + ' كلمات دلوقتي')) + '</button>' : '') +
      '<form data-form="word" class="card form inline"><input name="word" required maxlength="120" placeholder="' + esc(T('French word or phrase', 'كلمة أو جملة بالفرنساوي')) + '" lang="fr" dir="ltr"><input name="meaning" maxlength="200" placeholder="' + esc(T('Meaning', 'المعنى')) + '"><button class="btn main" type="submit">' + esc(T('Add', 'ضيف')) + '</button></form>';
    if(!words.length) h += '<div class="card center"><p>' + esc(T('Start with 12 everyday words?', 'نبدأ بـ١٢ كلمة من الحياة اليومية؟')) + '</p><button class="btn ghost" data-act="starter">✨ ' + esc(T('Add the starter pack', 'ضيف الكلمات الأساسية')) + '</button></div>';
    else h += '<div class="list">' + words.map(function(w){ return '<div class="item"><button class="btn ghost sm" data-act="say" data-t="' + esc(w.word) + '">🔊</button><span class="grow"><b lang="fr" dir="ltr">' + esc(w.word) + '</b><small>' + esc(w.meaning) + '</small></span><span class="boxes" title="' + esc(T('Memory level ', 'مستوى الحفظ ') + w.box + '/5') + '">' + [1, 2, 3, 4, 5].map(function(i){ return '<i class="' + (i <= w.box ? 'on' : '') + '"></i>'; }).join('') + '</span><button class="link danger" data-act="delWord" data-id="' + w.id + '" aria-label="' + esc(T('Delete', 'حذف')) + '">✕</button></div>'; }).join('') + '</div>';
    main.innerHTML = h;
  };
  FORMS.word = function(f){
    busy(f.querySelector('[type=submit]'), async function(){
      const r = await sb.from('fr_words').insert({ word: f.word.value.trim(), meaning: f.meaning.value.trim() }).select().single();
      if(r.error) throw r.error; D.words.unshift(r.data); render(); speak(r.data.word);
    });
  };
  ACT.starter = function(b){ busy(b, async function(){ const r = await sb.from('fr_words').insert(STARTER_WORDS.map(function(w){ return { word: w[0], meaning: w[1] }; })).select(); if(r.error) throw r.error; D.words = (r.data || []).concat(D.words || []); render(); }); };
  ACT.delWord = function(b){ busy(b, async function(){ const r = await sb.from('fr_words').delete().eq('id', +b.dataset.id); if(r.error) throw r.error; D.words = D.words.filter(function(w){ return w.id !== +b.dataset.id; }); render(); }); };
  let rv = null;
  ACT.review = function(){ rv = { list: dueWords().slice(0, 20), i: 0, flip: false, ok: 0 }; reviewStep(); };
  function reviewStep(){
    if(rv.i >= rv.list.length){ if(rv.ok) party(null, { emoji: ['🧠', '📒'], colors: ['#8a1c33', '#c9a227', '#1f3a6e', '#ffffff'] }); openModal('<div class="five center"><span class="big">🎉</span><h3>' + esc(T('Done! ' + rv.ok + ' of ' + rv.list.length + ' remembered.', 'خلصت! افتكرت ' + rv.ok + ' من ' + rv.list.length + '.')) + '</h3><button class="btn main" data-close>' + esc(T('Close', 'إغلاق')) + '</button></div>'); if(view === 'words') render(); return; }
    const w = rv.list[rv.i];
    openModal('<div class="five"><small class="muted">' + (rv.i + 1) + ' / ' + rv.list.length + '</small><div class="flash' + (rv.flip ? ' flip' : '') + '"><b lang="fr">' + esc(w.word) + '</b>' + (rv.flip ? '<span>' + esc(w.meaning) + '</span>' : '') + '</div><div class="row gap center"><button class="btn ghost" data-act="say" data-t="' + esc(w.word) + '">🔊</button>' +
      (rv.flip ? '<button class="btn bad" data-act="rvAns" data-k="0">' + esc(T('I forgot', 'نسيتها')) + '</button><button class="btn main" data-act="rvAns" data-k="1">' + esc(T('I knew it', 'عارفها')) + '</button>' : '<button class="btn main" data-act="rvFlip">' + esc(T('Show meaning', 'وريني المعنى')) + '</button>') + '</div></div>');
  }
  ACT.rvFlip = function(){ rv.flip = true; reviewStep(); };
  ACT.rvAns = async function(b){ const knew = b.dataset.k === '1'; await reviewWord(rv.list[rv.i], knew); if(knew) rv.ok++; rv.i++; rv.flip = false; reviewStep(); };

  // ----- French: pronunciation score -----
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  const normFr = function(s){ return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[’']/g, ' ').replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim(); };
  function lev(a, b){ const m = a.length, n = b.length; let prev = Array.from({ length: n + 1 }, function(_, j){ return j; }); for(let i = 1; i <= m; i++){ const row = [i]; for(let j = 1; j <= n; j++) row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = row; } return prev[n]; }
  function pronScore(heard, target){ const a = normFr(heard), b = normFr(target); if(!a) return 0; return Math.max(0, Math.round(100 * (1 - lev(a, b) / Math.max(a.length, b.length)))); }
  let soundFilter = '';
  VIEWS.speak = function(){
    const mine = D.pron || [], bySound = {};
    mine.forEach(function(p){ (p.sounds || []).forEach(function(s){ (bySound[s] = bySound[s] || []).push(p.score); }); });
    const weak = Object.keys(bySound).map(function(s){ return [s, avg(bySound[s])]; }).sort(function(a, b){ return a[1] - b[1]; });
    const list = PHRASES.map(function(p, i){ return [p, i]; }).filter(function(x){ return !soundFilter || x[0][3].indexOf(soundFilter) !== -1; });
    main.innerHTML = '<div class="head"><h2>🎙️ ' + esc(T('Pronunciation coach', 'مدرب النطق')) + '</h2><p class="muted">' + esc(T('Listen, then say the sentence. Coco listens and gives you a score.', 'اسمع، وبعدين قول الجملة — كوكو بيسمعك ويديك درجة.')) + '</p></div>' +
      (SR ? '' : '<p class="note">' + esc(T('Scoring works in Chrome (Android or computer). You can still listen and repeat here.', 'التقييم شغال على Chrome (موبايل أندرويد أو كمبيوتر). تقدر برضه تسمع وتكرر هنا.')) + '</p>') +
      '<div class="stats"><div class="stat"><i>🎯</i><b>' + (avg(mine.slice(0, 20).map(function(p){ return p.score; })) || 0) + '%</b><span>' + esc(T('average (last 20)', 'المتوسط (آخر ٢٠)')) + '</span></div><div class="stat"><i>🗣️</i><b>' + mine.length + '</b><span>' + esc(T('tries', 'محاولة')) + '</span></div>' +
      (weak.length ? '<div class="stat fire"><i>💪</i><b>' + esc(weak[0][0]) + '</b><span>' + esc(T('sound to practise', 'الصوت اللي محتاج تمرين')) + '</span></div>' : '') + '</div>' +
      (weak.length ? '<div class="card tip"><b>' + esc(weak[0][0]) + '</b> · ' + esc(L(SOUND_TIPS[weak[0][0]] || ['', ''])) + '</div>' : '') +
      '<div class="chips">' + [''].concat(Object.keys(SOUND_TIPS)).map(function(s){ return '<button type="button" data-act="sound" data-s="' + esc(s) + '" class="' + (soundFilter === s ? 'on' : '') + '">' + esc(s || T('All sounds', 'كل الأصوات')) + (bySound[s] ? ' · ' + avg(bySound[s]) + '%' : '') + '</button>'; }).join('') + '</div>' +
      '<div class="list">' + list.map(function(x){ const p = x[0], last = mine.find(function(m){ return m.phrase === p[0]; });
        return '<div class="item phrase"><span class="grow"><b lang="fr" dir="ltr">' + esc(p[0]) + '</b><small>' + esc(T(p[1], p[2])) + ' · ' + esc(p[3].join(' · ')) + '</small><span class="msg" id="pm' + x[1] + '">' + (last ? esc(T('Last: ', 'آخر مرة: ') + last.score + '%') : '') + '</span></span>' +
          '<button class="btn ghost sm" data-act="say" data-t="' + esc(p[0]) + '">🔊</button>' + (SR ? '<button class="btn main sm" data-act="speakTry" data-p="' + x[1] + '">🎙️</button>' : '') + '</div>'; }).join('') + '</div>';
  };
  ACT.sound = function(b){ soundFilter = b.dataset.s; render(); };
  ACT.speakTry = function(b){
    if(!SR){ toast(T('Use Chrome for pronunciation scoring.', 'استخدم Chrome لتقييم النطق.'), true); return; }
    const p = PHRASES[+b.dataset.p], out = b.dataset.five ? $('speakMsg') : $('pm' + b.dataset.p);
    const r = new SR(); r.lang = 'fr-FR'; r.interimResults = false; r.maxAlternatives = 3;
    let got = false;
    b.classList.add('rec-on'); if(out) out.textContent = T('Listening… speak now', 'بسمعك… اتكلم دلوقتي');
    r.onresult = async function(e){
      got = true;
      const alts = Array.prototype.map.call(e.results[0], function(a){ return a.transcript; });
      const score = Math.max.apply(null, alts.map(function(a){ return pronScore(a, p[0]); }));
      if(score >= 85) party(b, { emoji: ['🎯', '🇫🇷'], colors: ['#8a1c33', '#c9a227', '#1f3a6e', '#ffffff'] });
      if(out) out.innerHTML = '<b class="' + (score >= 80 ? 'okc' : score >= 55 ? 'mid' : 'noc') + '">' + score + '%</b> · ' + esc(T('Coco heard: ', 'كوكو سمع: ')) + '<i dir="ltr">' + esc(alts[0]) + '</i>' + (score < 70 ? ' · ' + esc(T('Tip: ', 'نصيحة: ') + L(SOUND_TIPS[p[3][0]] || ['', ''])) : ' 🎉');
      const ins = await sb.from('fr_pron').insert({ phrase: p[0], score: score, sounds: p[3] }).select().single();
      if(!ins.error && ins.data){ D.pron = [ins.data].concat(D.pron || []); if(score >= 70) sb.rpc('track_checkin', { p_track: TRACK, p_points: 1 }).then(function(){ refreshActivity(); }); }
    };
    r.onerror = function(e){ if(out) out.textContent = e.error === 'not-allowed' ? T('Allow the microphone first.', 'اسمح بالمايك الأول.') : T('I didn’t catch that. Try again.', 'مسمعتكش كويس — جرّب تاني.'); };
    r.onend = function(){ b.classList.remove('rec-on'); if(!got && out && /Listening|بسمعك/.test(out.textContent)) out.textContent = T('I didn’t hear anything. Try again.', 'مسمعتش حاجة — جرّب تاني.'); };
    try{ r.start(); }catch(e){ b.classList.remove('rec-on'); }
  };

  // ----- French: DELF readiness -----
  VIEWS.delf = function(){
    const lv = frLevel(), target = T('level ' + lv, 'المستوى ' + lv);
    const dp = delfParts({ subs: D.subs || [], taskOf: taskOf, pron: D.pron || [], words: D.words || [], level: lv });
    const weakest = dp.parts.slice().sort(function(a, b){ return (a[3] || 0) - (b[3] || 0); })[0];
    const tips = { 'Mock exams': ['Do the DELF mock exams in Tasks.', 'حل امتحانات DELF التجريبية في المهام.'], 'Pronunciation': ['Practise 3 sentences a day in the pronunciation coach.', 'اتمرن على ٣ جمل كل يوم في مدرب النطق.'],
      'Vocabulary': ['Add new words and review them every day.', 'ضيف كلمات جديدة وراجعها كل يوم.'], 'Teacher marks': ['Hand in your tasks: your teacher’s marks count.', 'سلّم مهامك — درجات المعلم بتفرق.'] };
    const quizzes = (D.tasks || []).filter(function(t){ return t.kind === 'quiz'; });
    main.innerHTML = '<div class="head"><h2>📈 ' + esc(T('DELF readiness meter', 'مؤشر الجاهزية لـDELF')) + '</h2><p class="muted">' + esc(T('Your ' + target + '. Four things count:', target + ' بتاعك. في ٤ حاجات بتتحسب:')) + '</p></div>' +
      '<div class="card delf"><div class="gauge-wrap big">' + gaugeSvg(dp.total, T('ready for DELF', 'جاهز لـDELF')) + '</div><div class="bars">' + dp.parts.map(function(p){
        return '<div class="bar"><span>' + p[0] + ' ' + esc(T(p[1], p[2])) + ' <small>' + Math.round(p[4] * 100) + '%</small></span><div class="track"><i style="width:' + (p[3] || 0) + '%"></i></div><b>' + (p[3] == null ? esc(T('not started', 'لسه')) : p[3] + '%') + '</b></div>';
      }).join('') + '</div></div>' +
      '<div class="card tip">💡 ' + esc(L(tips[weakest[1]])) + '</div>' +
      (quizzes.length ? '<h3 class="sec">🧪 ' + esc(T('Mock exams', 'الامتحانات التجريبية')) + '</h3><div class="list">' + quizzes.map(function(t){ const s = subFor(t.id); return '<button class="item" data-act="openTask" data-id="' + t.id + '"><span class="ic">🧪</span><span class="grow"><b>' + esc(t.title) + '</b></span>' + (s && s.auto_score != null ? '<span class="pill good">' + s.auto_score + '%</span>' : '') + '</button>'; }).join('') + '</div>' : '');
  };

  // =====================================================================
  // TEACHER
  // =====================================================================
  const pname = function(id){ const p = (D.people || {})[id]; return p ? p.full_name : T('Student', 'طالب'); };
  const studentStats = function(id){
    const act = (D.act || []).filter(function(a){ return a.student_id === id; }), subs = (D.subs || []).filter(function(s){ return s.student_id === id; });
    return { streak: streakOf(act.map(function(a){ return a.day; })), pts: monthPoints(act, subs), done: subs.filter(isDone).length, subs: subs };
  };
  let stFilter = 'pending', stSearch = '';
  VIEWS.students = function(){
    const counts = { pending: 0, active: 0, done: 0 }; (D.enrolls || []).forEach(function(e){ counts[e.status]++; });
    if(stFilter === 'pending' && !counts.pending && counts.active) stFilter = 'active';
    const q = normFr(stSearch);
    const rows = (D.enrolls || []).filter(function(e){ return (stFilter === 'all' || e.status === stFilter) && (!q || normFr(pname(e.student_id)).indexOf(q) !== -1); });
    let h = '<div class="head row between"><h2>👥 ' + esc(T('Students', 'الطلاب')) + '</h2><input class="search" type="search" id="stSearch" value="' + esc(stSearch) + '" placeholder="' + esc(T('Search by name', 'دوّر بالاسم')) + '"></div>' +
      '<div class="chips">' + [['pending', '⏳', 'Waiting', 'مستنيين'], ['active', '✅', 'Active', 'شغالين'], ['done', '🎓', 'Completed', 'خلصوا'], ['all', '📋', 'All', 'الكل']].map(function(c){ return '<button type="button" data-act="stF" data-f="' + c[0] + '" class="' + (stFilter === c[0] ? 'on' : '') + '">' + c[1] + ' ' + esc(T(c[2], c[3])) + (counts[c[0]] != null ? ' · ' + counts[c[0]] : '') + '</button>'; }).join('') + '</div>';
    if(!rows.length){ main.innerHTML = h + emptyCard('👥', stFilter === 'pending' ? T('No new requests.', 'مفيش طلبات جديدة.') : T('No students here yet.', 'لسه مفيش طلاب هنا.')); bindSearch(); return; }
    h += '<div class="list">' + rows.map(function(e){
      const p = (D.people || {})[e.student_id] || {}, s = studentStats(e.student_id), cert = (D.certs || []).find(function(c){ return c.student_id === e.student_id && c.course === e.course; });
      let x = '<div class="item col st-row"><div class="row between wrap"><span><b>' + esc(p.full_name || '—') + '</b> <small class="muted">' + esc(courseName(e.course)) + '</small></span>' +
        (p.phone ? '<a class="pill" dir="ltr" target="_blank" rel="noopener" href="https://wa.me/' + esc(p.phone) + '">💬 +' + esc(p.phone) + '</a>' : '') + '</div>';
      if(e.status === 'pending'){
        x += '<div class="row gap wrap"><span class="pill warn">' + esc(e.method === 'bank' ? T('Bank transfer', 'تحويل بنكي') : 'WhatsApp') + '</span>' + (e.receipt_path ? '<button class="btn ghost sm" data-act="receipt" data-p="' + esc(e.receipt_path) + '">🧾 ' + esc(T('See receipt', 'شوف الإيصال')) + '</button>' : '<small class="muted">' + esc(T('no receipt yet', 'لسه مفيش إيصال')) + '</small>') +
          '<button class="btn main sm" data-act="activate" data-id="' + e.id + '">✅ ' + esc(T('Activate', 'فعّل')) + '</button><button class="link danger" data-act="delEnroll" data-id="' + e.id + '">' + esc(T('Delete', 'حذف')) + '</button></div>';
      } else {
        x += '<div class="row gap wrap mini-stats"><span>' + (FR ? '🥐' : '🔥') + ' ' + s.streak + '</span><span>⭐ ' + s.pts + '</span><span>✅ ' + s.done + '/' + (D.tasks || []).filter(function(t){ return t.kind !== 'live' && (!t.course || t.course === e.course); }).length + '</span>';
        if(FR){
          const stamps = (D.stamps || []).filter(function(x){ return x.student_id === e.student_id; });
          x += '<label class="lvl">' + esc(T('Level', 'المستوى')) + ' <select data-level="' + e.id + '">' + FR_LEVELS.map(function(l, i){ return '<option value="' + (i + 1) + '"' + (e.level === i + 1 ? ' selected' : '') + '>' + (i + 1) + ' · ' + l[0] + '</option>'; }).join('') + '</select></label>' +
            '<span class="stamp-row">' + FR_LEVELS.map(function(l, i){ const got = stamps.some(function(x){ return x.level === i + 1; }); return '<button type="button" class="st' + (got ? ' got' : '') + '" title="' + esc(l[0]) + '" data-act="stamp" data-s="' + e.student_id + '" data-l="' + (i + 1) + '">' + l[1] + '</button>'; }).join('') + '</span>';
        } else x += '<button class="btn ghost sm" data-act="radar" data-s="' + e.student_id + '">🕸️ ' + esc(T('Skills', 'المهارات')) + '</button>';
        x += cert ? '<span class="pill good">🎓 ' + esc(T('Certificate issued', 'الشهادة طلعت')) + '</span>' : '<button class="btn ghost sm" data-act="issue" data-id="' + e.id + '">🎓 ' + esc(T('Issue certificate', 'طلّع الشهادة')) + '</button>';
        x += '</div>';
      }
      return x + '</div>';
    }).join('') + '</div>';
    main.innerHTML = h; bindSearch();
  };
  function bindSearch(){ const s = $('stSearch'); if(s) s.addEventListener('input', function(){ stSearch = s.value; const pos = s.selectionStart; render(); const n = $('stSearch'); n.focus(); n.setSelectionRange(pos, pos); }); }
  ACT.stF = function(b){ stFilter = b.dataset.f; render(); };
  ACT.receipt = async function(b){ const r = await sb.storage.from('receipts').createSignedUrl(b.dataset.p, 600); if(r.error){ toast(errText(r.error), true); return; } window.open(r.data.signedUrl, '_blank', 'noopener'); };
  async function updEnroll(id, patch){ const r = await sb.from('track_enrollments').update(patch).eq('id', id); if(r.error) throw r.error; const e = D.enrolls.find(function(x){ return x.id === id; }); if(e) Object.assign(e, patch); }
  ACT.activate = function(b){ busy(b, async function(){ await updEnroll(+b.dataset.id, { status: 'active' }); toast(T('Activated ✓ The student can start now.', 'اتفعّل ✓ الطالب يقدر يبدأ.')); render(); }); };
  ACT.delEnroll = function(b){ if(!confirm(T('Delete this request?', 'تحذف الطلب ده؟'))) return; busy(b, async function(){ const r = await sb.from('track_enrollments').delete().eq('id', +b.dataset.id); if(r.error) throw r.error; D.enrolls = D.enrolls.filter(function(e){ return e.id !== +b.dataset.id; }); render(); }); };
  main.addEventListener('change', function(e){
    const s = e.target.closest('[data-level]'); if(!s) return;
    busy(null, async function(){ await updEnroll(+s.dataset.level, { level: +s.value }); toast(T('Level saved ✓', 'المستوى اتحفظ ✓')); });
  });
  ACT.stamp = function(b){
    const sid = b.dataset.s, lv = +b.dataset.l, has = (D.stamps || []).some(function(x){ return x.student_id === sid && x.level === lv; });
    busy(b, async function(){
      if(has){ const r = await sb.from('fr_stamps').delete().eq('student_id', sid).eq('level', lv); if(r.error) throw r.error; D.stamps = D.stamps.filter(function(x){ return !(x.student_id === sid && x.level === lv); }); }
      else { const r = await sb.from('fr_stamps').insert({ student_id: sid, level: lv }).select().single(); if(r.error) throw r.error; D.stamps.push(r.data); party(b, { emoji: [FR_LEVELS[lv - 1][1]] }); toast(FR_LEVELS[lv - 1][1] + ' ' + T('Stamp given!', 'الختم اتدّى!')); }
      render();
    });
  };
  ACT.issue = function(b){
    const e = D.enrolls.find(function(x){ return x.id === +b.dataset.id; }); if(!e) return;
    if(!confirm(T('Issue the certificate for ' + pname(e.student_id) + ' and mark the course completed?', 'تطلّع شهادة لـ' + pname(e.student_id) + ' وتعلّم الكورس إنه خلص؟'))) return;
    busy(b, async function(){
      const r = await sb.from('track_certificates').insert({ student_id: e.student_id, track: TRACK, course: e.course, student_name: pname(e.student_id) }).select().single();
      if(r.error) throw r.error; D.certs.push(r.data); await updEnroll(e.id, { status: 'done' }); party(null, { emoji: ['🎓'] }); toast(T('Certificate issued 🎓', 'الشهادة طلعت 🎓')); render();
    });
  };
  ACT.radar = function(b){
    const s = studentStats(b.dataset.s), sk = skillAvg(s.subs.filter(function(x){ return x.skills; }));
    openModal('<h3>🕸️ ' + esc(pname(b.dataset.s)) + '</h3>' + (SKILLS.some(function(k){ return sk[k[0]] != null; }) ? '<div class="center">' + radarSvg(sk, 260) + '</div><p class="muted small center">' + SKILLS.map(function(k){ return esc(T(k[1], k[2])) + ' ' + (sk[k[0]] != null ? sk[k[0]] : '–') + '/5'; }).join(' · ') + '</p>'
      : '<p class="muted">' + esc(T('Score skills when you mark a project and the radar appears here.', 'قيّم المهارات وإنت بتصحح المشروع والرادار هيظهر هنا.')) + '</p>') + '<button class="btn ghost" data-close>' + esc(T('Close', 'إغلاق')) + '</button>');
  };

  // ----- teacher: tasks -----
  let newKind = 'project';
  VIEWS.ttasks = function(){
    const k = newKind;
    let h = '<div class="head"><h2>📝 ' + esc(T('Tasks', 'المهام')) + '</h2><p class="muted">' + esc(T('Projects, code that checks itself, quizzes and DELF mocks, voice tasks and live classes.', 'مشاريع، وكود بيتصحح لوحده، واختبارات وامتحانات DELF، وتسجيلات صوتية، وحصص لايف.')) + '</p></div>' +
      '<div class="card"><div class="chips">' + Object.keys(KINDS).filter(function(x){ return FR ? x !== 'code' : true; }).map(function(x){ return '<button type="button" data-act="kind" data-k="' + x + '" class="' + (x === k ? 'on' : '') + '">' + esc(kindLabel(x)) + '</button>'; }).join('') + '</div>' +
      '<form data-form="task" class="form"><div class="grid2"><label>' + esc(T('Title', 'العنوان')) + '<input name="title" required maxlength="140"></label><label>' + esc(T('For', 'لـ')) + '<select name="course">' + courseOptions('', true) + '</select></label></div>' +
      '<label>' + esc(k === 'live' ? T('Notes (optional)', 'ملاحظات (اختياري)') : T('What should the student do?', 'الطالب يعمل إيه؟')) + '<textarea name="body" rows="3"></textarea></label>';
    if(k === 'code') h += '<div class="grid2"><label>' + esc(T('Language', 'اللغة')) + '<select name="lang"><option value="python">Python</option><option value="js">JavaScript</option></select></label><span></span></div>' +
      '<label>' + esc(T('Starter code (optional)', 'كود البداية (اختياري)')) + '<textarea name="starter" rows="4" class="mono" dir="ltr" spellcheck="false"></textarea></label>' +
      '<label>' + esc(T('Expected output: what the program must print (hidden from students)', 'الناتج المطلوب: اللي البرنامج لازم يطبعه (مخفي عن الطلاب)')) + '<textarea name="expected" rows="3" class="mono" dir="ltr" required spellcheck="false"></textarea></label>';
    if(k === 'quiz') h += '<label>' + esc(T('Questions: one block per question, the right answer starts with *', 'الأسئلة: كل سؤال في فقرة، والإجابة الصح تبدأ بـ*')) + '<textarea name="quiz" rows="8" required class="mono" placeholder="' + esc(FR ? 'Comment dit-on « thank you » ?\n*Merci\nBonjour\nPardon\n\nLa tour Eiffel est à…\nLyon\n*Paris\nNice' : 'What does print(2 + 3) show?\n*5\n23\nError\n\nWhich tag makes a link?\n*<a>\n<p>\n<img>') + '"></textarea></label>';
    if(k === 'voice') h += '<label>' + esc(T('Sentence or question to answer', 'الجملة أو السؤال')) + '<input name="phrase" maxlength="300" lang="fr" dir="ltr" placeholder="Présente-toi en 30 secondes."></label>';
    if(k === 'live') h += '<div class="grid2"><label>' + esc(T('Meeting link (Zoom, Meet…)', 'لينك الحصة (Zoom أو Meet…)')) + '<input name="link" type="url" required dir="ltr" placeholder="https://"></label><label>' + esc(T('Date & time', 'اليوم والساعة')) + '<input name="starts" type="datetime-local" required></label></div>';
    else h += '<label class="short">' + esc(T('Due date (optional)', 'آخر ميعاد (اختياري)')) + '<input name="due" type="date"></label>';
    h += '<button class="btn main" type="submit">' + esc(T('Publish to students', 'انشر للطلاب')) + '</button></form></div>';
    const list = (D.tasks || []).slice().reverse();
    h += list.length ? '<h3 class="sec">' + esc(T('Published', 'اللي اتنشر')) + ' <small>' + list.length + '</small></h3><div class="list">' + list.map(function(t){
      const n = (D.subs || []).filter(function(s){ return s.task_id === t.id && s.status !== 'working'; }).length;
      return '<div class="item"><span class="ic">' + (KINDS[t.kind] || ['📄'])[0] + '</span><span class="grow"><b>' + esc(t.title) + '</b><small>' + esc(courseName(t.course) + (t.kind === 'live' ? ' · ' + fmtDate(t.starts_at, true) : t.due ? ' · ' + T('due ', 'آخر ميعاد ') + fmtDate(t.due) : '')) + '</small></span>' +
        (t.kind !== 'live' ? '<span class="pill">' + n + ' 📥</span>' : '') + '<button class="link danger" data-act="delTask" data-id="' + t.id + '" aria-label="' + esc(T('Delete', 'حذف')) + '">✕</button></div>';
    }).join('') + '</div>' : '';
    main.innerHTML = h;
  };
  ACT.kind = function(b){ newKind = b.dataset.k; render(); };
  function parseQuiz(text){
    const blocks = String(text).replace(/\r/g, '').split(/\n\s*\n/).map(function(b){ return b.split('\n').map(function(l){ return l.trim(); }).filter(Boolean); }).filter(function(b){ return b.length; });
    const questions = [], answers = [];
    for(let i = 0; i < blocks.length; i++){
      const b = blocks[i], opts = b.slice(1), right = opts.filter(function(o){ return o.charAt(0) === '*'; });
      if(opts.length < 2 || right.length !== 1) throw new Error(T('Question ' + (i + 1) + ' needs at least 2 answers and exactly one starting with *', 'السؤال ' + (i + 1) + ' محتاج إجابتين على الأقل، وواحدة بس تبدأ بـ*'));
      questions.push({ q: b[0], opts: opts.map(function(o){ return o.replace(/^\*\s*/, ''); }) }); answers.push(opts.findIndex(function(o){ return o.charAt(0) === '*'; }));
    }
    if(!questions.length) throw new Error(T('Write at least one question.', 'اكتب سؤال واحد على الأقل.'));
    return { questions: questions, answers: answers };
  }
  FORMS.task = function(f){
    busy(f.querySelector('[type=submit]'), async function(){
      const k = newKind, row = { track: TRACK, kind: k, title: f.title.value.trim(), body: f.body.value.trim(), course: f.course.value || null };
      let key = null;
      if(k === 'code'){ row.lang = f.lang.value; row.starter = f.starter.value; key = { expected: f.expected.value }; }
      if(k === 'quiz'){ const q = parseQuiz(f.quiz.value); row.questions = q.questions; key = { answers: q.answers }; }
      if(k === 'voice') row.phrase = f.phrase.value.trim() || null;
      if(k === 'live'){ row.link = f.link.value.trim(); row.starts_at = new Date(f.starts.value).toISOString(); }
      else if(f.due && f.due.value) row.due = f.due.value;
      const r = await sb.from('track_tasks').insert(row).select().single();
      if(r.error) throw r.error;
      if(key){ const kr = await sb.from('track_task_keys').insert(Object.assign({ task_id: r.data.id }, key)); if(kr.error){ await sb.from('track_tasks').delete().eq('id', r.data.id); throw kr.error; } D.keys[r.data.id] = key; }
      D.tasks.push(r.data); toast(T('Published ✓', 'اتنشر ✓')); render();
    });
  };
  ACT.delTask = function(b){
    if(!confirm(T('Delete this task and everything students handed in for it?', 'تحذف المهمة دي وكل تسليمات الطلاب عليها؟'))) return;
    busy(b, async function(){ const id = +b.dataset.id, r = await sb.from('track_tasks').delete().eq('id', id); if(r.error) throw r.error; D.tasks = D.tasks.filter(function(t){ return t.id !== id; }); D.subs = D.subs.filter(function(s){ return s.task_id !== id; }); render(); });
  };

  // ----- teacher: the board (drag cards between columns) -----
  let boardTask = '';
  VIEWS.board = function(){
    const subs = (D.subs || []).filter(function(s){ return !boardTask || s.task_id === +boardTask; });
    const cols = [['working', '🛠️', 'Working on it', 'شغالين'], ['submitted', '📥', 'To mark', 'محتاج تصحيح'], ['graded', '✅', 'Marked', 'اتصحح']];
    main.innerHTML = '<div class="head row between wrap"><h2>🗂️ ' + esc(T('Board', 'لوحة التسليمات')) + '</h2><select id="boardTask"><option value="">' + esc(T('All tasks', 'كل المهام')) + '</option>' + (D.tasks || []).filter(function(t){ return t.kind !== 'live'; }).map(function(t){ return '<option value="' + t.id + '"' + (String(t.id) === boardTask ? ' selected' : '') + '>' + esc(t.title) + '</option>'; }).join('') + '</select></div>' +
      '<p class="muted small">' + esc(T('Tap a card to mark it. On a computer you can also drag it to another column.', 'دوس على الكارت عشان تصححه — وعلى الكمبيوتر تقدر تسحبه لعمود تاني.')) + '</p>' +
      '<div class="kanban">' + cols.map(function(c){
        const list = subs.filter(function(s){ return s.status === c[0]; });
        return '<section class="col" data-col="' + c[0] + '"><h3>' + c[1] + ' ' + esc(T(c[2], c[3])) + ' <small>' + list.length + '</small></h3>' + list.map(function(s){
          const t = taskOf(s.task_id) || {};
          return '<button type="button" class="kcard" draggable="true" data-sub="' + s.id + '" data-act="grade" data-id="' + s.id + '"><b>' + esc(pname(s.student_id)) + '</b><small>' + esc((KINDS[t.kind] || ['📄'])[0] + ' ' + (t.title || '')) + '</small><span class="row gap">' +
            (s.auto_passed != null ? '<span class="pill ' + (s.auto_passed ? 'good' : 'bad') + '">' + (t.kind === 'quiz' ? (s.auto_score + '%') : s.auto_passed ? '✓ ' + T('output', 'الناتج') : '✗ ' + T('output', 'الناتج')) + '</span>' : '') +
            (s.audio_path ? '<span class="pill">🎧</span>' : '') + (s.score != null ? '<span class="pill good">' + s.score + '</span>' : '') + '<small class="muted">' + esc(fmtDate(s.updated_at)) + '</small></span></button>';
        }).join('') + '</section>';
      }).join('') + '</div>';
    $('boardTask').addEventListener('change', function(e){ boardTask = e.target.value; render(); });
    main.querySelectorAll('.kcard').forEach(function(c){ c.addEventListener('dragstart', function(e){ e.dataTransfer.setData('text/plain', c.dataset.sub); }); });
    main.querySelectorAll('.col').forEach(function(col){
      col.addEventListener('dragover', function(e){ e.preventDefault(); col.classList.add('over'); });
      col.addEventListener('dragleave', function(){ col.classList.remove('over'); });
      col.addEventListener('drop', function(e){ e.preventDefault(); col.classList.remove('over'); const id = +e.dataTransfer.getData('text/plain'); if(col.dataset.col === 'graded') ACT.grade({ dataset: { id: id } }); else moveSub(id, col.dataset.col); });
    });
  };
  async function moveSub(id, status){
    const r = await sb.from('track_submissions').update({ status: status, updated_at: new Date().toISOString() }).eq('id', id);
    if(r.error){ toast(errText(r.error), true); return; }
    const s = D.subs.find(function(x){ return x.id === id; }); if(s) s.status = status; render();
  }
  ACT.grade = async function(b){
    const s = D.subs.find(function(x){ return x.id === +b.dataset.id; }); if(!s) return;
    const t = taskOf(s.task_id) || {}, key = D.keys[t.id] || {};
    let audio = '';
    if(s.audio_path){ const r = await sb.storage.from('voice').createSignedUrl(s.audio_path, 3600); if(r.data) audio = '<audio controls src="' + esc(r.data.signedUrl) + '"></audio>'; }
    let work = '';
    if(t.kind === 'quiz' && Array.isArray(t.questions)) work = '<p><b>' + esc(T('Score: ', 'النتيجة: ') + (s.auto_score != null ? s.auto_score + '%' : '—')) + '</b></p>';
    else if(isUrl(s.content)) work = '<a class="btn ghost" href="' + esc(s.content.trim()) + '" target="_blank" rel="noopener nofollow">🔗 ' + esc(T('Open the work', 'افتح الشغل')) + '</a>';
    else if(s.content) work = '<pre class="code' + (t.kind === 'code' ? '' : ' prose') + '">' + esc(s.content) + '</pre>';
    if(t.kind === 'code') work += '<div class="grid2"><div><small class="muted">' + esc(T('Their output', 'ناتج الطالب')) + '</small><pre class="console">' + esc(s.output || '') + '</pre></div><div><small class="muted">' + esc(T('Expected', 'المطلوب')) + '</small><pre class="console">' + esc(key.expected || '') + '</pre></div></div>' +
      '<p class="msg ' + (s.auto_passed ? 'okc' : 'noc') + '">' + esc(s.auto_passed ? T('✓ Output matches', '✓ الناتج مطابق') : T('✗ Output does not match', '✗ الناتج مش مطابق')) + '</p>';
    openModal('<small class="kick">' + esc(kindLabel(t.kind)) + '</small><h3>' + esc(t.title || '') + ' · ' + esc(pname(s.student_id)) + '</h3>' + (t.phrase ? '<p class="fr-say">' + esc(t.phrase) + '</p>' : '') + audio + work +
      '<form data-form="grade" data-id="' + s.id + '" class="form"><div class="grid2"><label>' + esc(T('Mark (0–100)', 'الدرجة (٠–١٠٠)')) + '<input name="score" type="number" min="0" max="100" required value="' + (s.score != null ? s.score : s.auto_score != null ? s.auto_score : '') + '"></label><span></span></div>' +
      (FR ? '' : '<div class="sliders">' + SKILLS.map(function(k){ const v = s.skills && s.skills[k[0]] != null ? s.skills[k[0]] : 3; return '<label>' + esc(T(k[1], k[2])) + ' <output>' + v + '</output><input type="range" min="0" max="5" step="1" name="sk_' + k[0] + '" value="' + v + '" oninput="this.previousElementSibling.textContent=this.value"></label>'; }).join('') + '</div>') +
      '<label>' + esc(T('Feedback for the student', 'رسالة للطالب')) + '<textarea name="feedback" rows="3">' + esc(s.feedback || '') + '</textarea></label>' +
      '<div class="row gap"><button class="btn main" type="submit">' + esc(T('Save mark', 'احفظ الدرجة')) + '</button>' + (s.status === 'graded' ? '<button class="btn ghost" type="button" data-act="reopen" data-id="' + s.id + '">' + esc(T('Let them resubmit', 'خليه يسلّم تاني')) + '</button>' : '') + '<button class="btn ghost" type="button" data-close>' + esc(T('Close', 'إغلاق')) + '</button></div></form>', true);
  };
  FORMS.grade = function(f){
    const id = +f.dataset.id, skills = FR ? null : {};
    if(skills) SKILLS.forEach(function(k){ skills[k[0]] = +f['sk_' + k[0]].value; });
    busy(f.querySelector('[type=submit]'), async function(){
      const patch = { status: 'graded', score: Math.max(0, Math.min(100, +f.score.value)), feedback: f.feedback.value.trim() || null, skills: skills, updated_at: new Date().toISOString() };
      const r = await sb.from('track_submissions').update(patch).eq('id', id); if(r.error) throw r.error;
      Object.assign(D.subs.find(function(x){ return x.id === id; }) || {}, patch); closeModal(); toast(T('Saved ✓', 'اتحفظ ✓')); render();
    });
  };
  ACT.reopen = function(b){ closeModal(); moveSub(+b.dataset.id, 'submitted'); };

  // ----- teacher (French): the sounds heat map -----
  VIEWS.sounds = function(){
    const pr = D.pron || [], agg = {};
    pr.forEach(function(p){ (p.sounds || []).forEach(function(s){ const a = agg[s] = agg[s] || { scores: [], people: {} }; a.scores.push(p.score); (a.people[p.student_id] = a.people[p.student_id] || []).push(p.score); }); });
    const list = Object.keys(agg).map(function(s){ return { s: s, avg: avg(agg[s].scores), n: agg[s].scores.length, people: agg[s].people }; }).sort(function(a, b){ return a.avg - b.avg; });
    main.innerHTML = '<div class="head"><h2>🔥 ' + esc(T('Sounds map: last 30 days', 'خريطة الأصوات: آخر ٣٠ يوم')) + '</h2><p class="muted">' + esc(T('Which French sounds your students find hardest, from their pronunciation tries. Red = needs a lesson.', 'أصعب أصوات فرنساوي على طلابك من محاولات النطق بتاعتهم. الأحمر = محتاج درس.')) + '</p></div>' +
      (list.length ? '<div class="heat">' + list.map(function(x){ return '<div class="tile" style="--h:' + Math.round(x.avg * 1.2) + '"><b>' + esc(x.s) + '</b><span>' + x.avg + '%</span><small>' + x.n + ' ' + esc(T('tries', 'محاولة')) + ' · ' + Object.keys(x.people).length + ' ' + esc(T('students', 'طالب')) + '</small></div>'; }).join('') + '</div>' +
        list.filter(function(x){ return x.avg < 75; }).map(function(x){
          const weak = Object.keys(x.people).map(function(id){ return [id, avg(x.people[id])]; }).filter(function(p){ return p[1] < 65; }).sort(function(a, b){ return a[1] - b[1]; });
          return weak.length ? '<div class="card"><h3>' + esc(x.s) + ' · ' + esc(T('who needs help', 'مين محتاج مساعدة')) + '</h3><p class="muted small">💡 ' + esc(L(SOUND_TIPS[x.s] || ['', ''])) + '</p><div class="chips">' + weak.map(function(p){ return '<span class="pill bad">' + esc(pname(p[0])) + ' · ' + p[1] + '%</span>'; }).join('') + '</div></div>' : '';
        }).join('')
        : emptyCard('🎙️', T('When students practise pronunciation, the map appears here.', 'لما الطلاب يتمرنوا على النطق، الخريطة هتظهر هنا.')));
  };

  // ----- teacher (tech): skills radar for the whole class -----
  VIEWS.skills = function(){
    const ids = Array.from(new Set((D.enrolls || []).filter(function(e){ return e.status !== 'pending'; }).map(function(e){ return e.student_id; })));
    const all = skillAvg((D.subs || []).filter(function(s){ return s.skills; }));
    const has = SKILLS.some(function(k){ return all[k[0]] != null; });
    main.innerHTML = '<div class="head"><h2>🕸️ ' + esc(T('Skills radar', 'رادار المهارات')) + '</h2><p class="muted">' + esc(T('Built from the skills you score when marking. See the class shape, then each student.', 'بيتبني من المهارات اللي بتقيّمها وإنت بتصحح — شوف شكل الفصل وبعدين كل طالب.')) + '</p></div>' +
      (has ? '<div class="card row gap"><div>' + radarSvg(all, 240) + '</div><div class="grow"><h3>' + esc(T('The whole class', 'الفصل كله')) + '</h3><p class="muted">' + SKILLS.map(function(k){ return esc(T(k[1], k[2])) + ': ' + (all[k[0]] != null ? all[k[0]] : '–') + '/5'; }).join('<br>') + '</p></div></div>' +
        '<div class="grid3">' + ids.map(function(id){ const sk = skillAvg((D.subs || []).filter(function(s){ return s.student_id === id && s.skills; })); return SKILLS.some(function(k){ return sk[k[0]] != null; }) ? '<div class="card center"><b>' + esc(pname(id)) + '</b>' + radarSvg(sk, 170) + '</div>' : ''; }).join('') + '</div>'
        : emptyCard('🕸️', T('Mark a project with the skill sliders and the radar appears.', 'صحح مشروع بشرائط المهارات والرادار هيظهر.')));
  };

  // ----- admin: price -----
  VIEWS.settings = async function(){
    const st = await loadSettings(); if(view !== 'settings') return;
    main.innerHTML = '<div class="head"><h2>⚙️ ' + esc(T('Settings', 'الإعدادات')) + '</h2></div><form data-form="price" class="card form"><label>' + esc(FR ? T('French course price (SAR / month)', 'سعر كورس الفرنساوي (ريال / شهر)') : T('Tech Lab course price (SAR / month)', 'سعر كورسات Tech Lab (ريال / شهر)')) +
      '<input name="price" inputmode="decimal" maxlength="20" value="' + esc(st[TRACK + '_price'] || '') + '"></label><p class="muted small">' + esc(T('The bank details (Al Rajhi IBAN) come from Code Cademy admin dashboard.', 'بيانات البنك (آيبان الراجحي) بتيجي من لوحة المدير في موقع Code Cademy.')) + '</p><button class="btn main" type="submit">' + esc(T('Save', 'حفظ')) + '</button></form>';
  };
  FORMS.price = function(f){
    busy(f.querySelector('[type=submit]'), async function(){
      const r = await sb.from('academy_settings').upsert({ key: TRACK + '_price', value: f.price.value.trim(), updated_at: new Date().toISOString() }); if(r.error) throw r.error;
      settings = null; toast(T('Saved ✓', 'اتحفظ ✓'));
    });
  };

  // =====================================================================
  // PARENT
  // =====================================================================
  VIEWS.children = function(){
    const kids = D.kids || [];
    if(!kids.length){ main.innerHTML = emptyCard('👨‍👩‍👧', T('Link your child first: in Code Cademy dashboard, enter your child’s link code.', 'اربط ابنك الأول: من لوحة الإنجليزي اكتب كود الربط بتاع ابنك.'), '<a class="btn main" href="english.html?signin=1">' + esc(T('Open Code Cademy dashboard', 'افتح لوحة الإنجليزي')) + '</a>'); return; }
    main.innerHTML = '<div class="head"><h2>👨‍👩‍👧 ' + esc(T('My children', 'أولادي')) + '</h2></div>' + kids.map(function(k){
      const en = (D.enrolls || []).filter(function(e){ return e.student_id === k.id; });
      const act = (D.act || []).filter(function(a){ return a.student_id === k.id; }), subs = (D.subs || []).filter(function(s){ return s.student_id === k.id; });
      const tasks = (D.tasks || []).filter(function(t){ return t.kind !== 'live' && en.some(function(e){ return !t.course || t.course === e.course; }); });
      let h = '<div class="card child"><div class="row between wrap"><h3>' + esc(k.full_name) + '</h3><span>' + (en.length ? en.map(function(e){ return '<span class="pill ' + (e.status === 'pending' ? 'warn' : 'good') + '">' + esc(courseName(e.course)) + '</span>'; }).join(' ') : '<span class="muted small">' + esc(T('Not in a course yet', 'لسه مش مشترك في كورس')) + '</span>') + '</span></div>';
      if(!en.some(function(e){ return e.status !== 'pending'; })) return h + '</div>';
      h += '<div class="stats"><div class="stat fire"><i>' + (FR ? '🥐' : '🔥') + '</i><b>' + streakOf(act.map(function(a){ return a.day; })) + '</b><span>' + esc(T('day streak', 'يوم ورا بعض')) + '</span></div><div class="stat"><i>⭐</i><b>' + monthPoints(act, subs) + '</b><span>' + esc(T('points this month', 'نقطة الشهر ده')) + '</span></div><div class="stat"><i>✅</i><b>' + subs.filter(isDone).length + '/' + tasks.length + '</b><span>' + esc(T('tasks done', 'مهمة خلصت')) + '</span></div></div>';
      if(FR){
        const words = (D.words || []).filter(function(w){ return w.student_id === k.id; }), pron = (D.pron || []).filter(function(p){ return p.student_id === k.id; });
        const lv = Math.max.apply(null, [1].concat(en.map(function(e){ return e.level || 1; })));
        const dp = delfParts({ subs: subs, taskOf: taskOf, pron: pron, words: words, level: lv });
        h += '<div class="row gap wrap"><div class="gauge-wrap">' + gaugeSvg(dp.total, T('Level ', 'المستوى ') + lv) + '</div><div class="grow">' + passportHtml((D.stamps || []).filter(function(s){ return s.student_id === k.id; }), lv, k.full_name) + '</div></div>' +
          '<p class="muted small">🎙️ ' + esc(T('Pronunciation average: ', 'متوسط النطق: ') + (avg(pron.slice(0, 20).map(function(p){ return p.score; })) || 0) + '%') + ' · 📒 ' + esc(T('Words mastered: ', 'كلمات متقنة: ') + wordsMastered(words) + '/' + words.length) + '</p>';
      } else {
        const sk = skillAvg(subs.filter(function(s){ return s.skills; }));
        if(SKILLS.some(function(x){ return sk[x[0]] != null; })) h += '<div class="center">' + radarSvg(sk, 200) + '</div>';
        if(subs.some(function(s){ return s.public; })) h += '<a class="btn ghost sm" target="_blank" rel="noopener" href="?portfolio=' + k.id + '">🗂️ ' + esc(T('See their portfolio', 'شوف معرض مشاريعه')) + '</a>';
      }
      const graded = subs.filter(function(s){ return s.status === 'graded'; }).sort(function(a, b){ return String(b.updated_at).localeCompare(String(a.updated_at)); }).slice(0, 5);
      if(graded.length) h += '<h4>' + esc(T('Latest marks', 'آخر الدرجات')) + '</h4><div class="list">' + graded.map(function(s){ const t = taskOf(s.task_id) || {}; return '<div class="item"><span class="ic">' + (KINDS[t.kind] || ['📄'])[0] + '</span><span class="grow"><b>' + esc(t.title || '') + '</b>' + (s.feedback ? '<small>💬 ' + esc(s.feedback) + '</small>' : '') + '</span><span class="pill good">' + s.score + '</span></div>'; }).join('') + '</div>';
      const live = nextLive(D.tasks);
      if(live) h += '<p class="muted small">📡 ' + esc(T('Next live class: ', 'الحصة الجاية: ') + live.title + ' · ' + fmtDate(live.starts_at, true)) + '</p>';
      return h + '</div>';
    }).join('');
  };

  // =====================================================================
  // MESSAGES: one conversation per student, with their parents and the teachers
  // =====================================================================
  let thread = null, privNote = false;
  function threadsForTeacher(){
    const ids = new Set((D.enrolls || []).map(function(e){ return e.student_id; }));
    (D.msgs || []).forEach(function(m){ ids.add(m.student_id); });
    return Array.from(ids).map(function(id){
      const ms = (D.msgs || []).filter(function(m){ return m.student_id === id; }), last = ms[ms.length - 1];
      return { id: id, name: pname(id), last: last, unread: unreadIn(id) };
    }).sort(function(a, b){ return String(b.last ? b.last.created_at : '').localeCompare(String(a.last ? a.last.created_at : '')); });
  }
  VIEWS.msgs = function(){
    const r = ROLE();
    if(r === 'student') thread = me.id;
    if(r === 'parent' && (!thread || !(D.kids || []).some(function(k){ return k.id === thread; }))) thread = (D.kids || [])[0] ? D.kids[0].id : null;
    let side = '';
    if(r === 'teacher'){
      if(!thread){ const l0 = threadsForTeacher(); if(l0.length) thread = l0[0].id; }
      if(thread) D.reads[thread] = new Date().toISOString();
      const list = threadsForTeacher();
      side = '<aside class="inbox">' + (list.length ? list.map(function(x){
        return '<button type="button" class="ib' + (x.id === thread ? ' on' : '') + '" data-act="thread" data-id="' + x.id + '"><span class="av">' + esc(firstName(x.name).charAt(0)) + '</span><span class="grow"><b>' + esc(x.name) + '</b><small dir="auto">' + esc(x.last ? (x.last.private ? '🔒 ' : '') + x.last.body.slice(0, 60) : T('No messages yet', 'لسه مفيش رسايل')) + '</small></span>' + (x.unread ? '<i class="nb">' + x.unread + '</i>' : '') + '</button>';
      }).join('') : '<p class="muted small">' + esc(T('Students appear here once they join a course.', 'الطلاب بيظهروا هنا أول ما يشتركوا.')) + '</p>') + '</aside>';
    }
    if(r === 'parent' && (D.kids || []).length > 1) side = '<div class="chips">' + D.kids.map(function(k){ return '<button type="button" data-act="thread" data-id="' + k.id + '" class="' + (k.id === thread ? 'on' : '') + '">' + esc(k.full_name) + (unreadIn(k.id) ? ' · ' + unreadIn(k.id) : '') + '</button>'; }).join('') + '</div>';
    if(r === 'parent' && !(D.kids || []).length){ main.innerHTML = emptyCard('💬', T('Link your child first from Code Cademy dashboard.', 'اربط ابنك الأول من لوحة الإنجليزي.'), '<a class="btn main" href="english.html?signin=1">' + esc(T('Open Code Cademy dashboard', 'افتح لوحة الإنجليزي')) + '</a>'); return; }
    const who = r === 'teacher' ? pname(thread) : r === 'parent' ? (D.kids.find(function(k){ return k.id === thread; }) || {}).full_name : T('Your teachers', 'المعلمين');
    const canPrivate = r !== 'student';
    main.innerHTML = '<div class="head"><h2>💬 ' + esc(T('Messages', 'الرسايل')) + '</h2><p class="muted">' + esc(r === 'student' ? T('Talk to your teachers. Your parents can read this conversation too.', 'اتكلم مع المعلمين — وأهلك يقدروا يشوفوا المحادثة كمان.') : T('One conversation per student, with the student, their parents and the teachers.', 'محادثة لكل طالب، بينه وبين أهله والمعلمين.')) + '</p></div>' +
      '<div class="chat-wrap' + (r === 'teacher' ? ' with-inbox' : '') + '">' + (r === 'teacher' ? side : '') + '<section class="chat">' + (r === 'parent' ? side : '') +
      (thread ? '<header class="chat-h"><b>' + esc(who || '') + '</b><small class="muted">' + esc(FR ? 'Le Club Français' : 'Coco Tech Lab') + '</small></header><div class="bubbles" id="bubbles">' + bubblesHtml(thread) + '</div>' +
        '<form data-form="msg" class="composer">' + (canPrivate ? '<label class="priv" title="' + esc(T('Only parents and teachers see it', 'الأهل والمعلمين بس يشوفوها')) + '"><input type="checkbox" name="priv"' + (privNote ? ' checked' : '') + '> 🔒 ' + esc(T('Private note', 'ملاحظة خاصة')) + '</label>' : '') +
        '<div class="quick">' + quickReplies().map(function(q){ return '<button type="button" data-act="quick" data-t="' + esc(q) + '">' + esc(q) + '</button>'; }).join('') + '</div>' +
        '<div class="row gap"><textarea name="body" rows="1" maxlength="4000" required placeholder="' + esc(T('Write a message…', 'اكتب رسالة…')) + '"></textarea><button class="btn main" type="submit" aria-label="' + esc(T('Send', 'إرسال')) + '">➤</button></div></form>'
        : emptyCard('💬', T('No conversation yet.', 'لسه مفيش محادثات.'))) + '</section></div>';
    scrollChat(); markRead(thread);
    const ta = main.querySelector('.composer textarea');
    if(ta){ ta.addEventListener('keydown', function(e){ if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); ta.form.requestSubmit(); } }); ta.addEventListener('input', function(){ ta.style.height = 'auto'; ta.style.height = Math.min(140, ta.scrollHeight) + 'px'; }); }
  };
  function quickReplies(){
    const r = ROLE();
    if(r === 'teacher') return [T('Great work! 🌟', 'شغل ممتاز! 🌟'), T('Please hand in your task 📝', 'سلّم المهمة لو سمحت 📝'), T('See you in the live class 📡', 'أشوفك في الحصة 📡')];
    if(r === 'parent') return [T('Thank you! 🙏', 'شكراً! 🙏'), T('How is my child doing?', 'ابني عامل إيه؟')];
    return [T('I need help 🙋', 'محتاج مساعدة 🙋'), T('I finished! ✅', 'خلّصت! ✅'), T('Thank you! 🙏', 'شكراً! 🙏')];
  }
  function bubblesHtml(sid){
    const ms = (D.msgs || []).filter(function(m){ return m.student_id === sid; });
    if(!ms.length) return '<p class="muted center small chat-empty">' + esc(T('Say hello 👋', 'قول أهلاً 👋')) + '</p>';
    let lastDay = '';
    return ms.map(function(m){
      const day = String(m.created_at).slice(0, 10), mine = m.sender_id === me.id;
      const sep = day !== lastDay ? '<div class="day">' + esc(fmtDate(m.created_at)) + '</div>' : ''; lastDay = day;
      const role = { teacher: T('Teacher', 'معلم'), parent: T('Parent', 'ولي أمر'), student: T('Student', 'طالب') }[m.sender_role] || '';
      return sep + '<div class="bub-row' + (mine ? ' me' : '') + '"><div class="bubble' + (m.private ? ' private' : '') + ' r-' + esc(m.sender_role || '') + '">' + (mine ? '' : '<small class="from">' + esc(firstName(m.sender_name) + ' · ' + role) + '</small>') +
        (m.private ? '<small class="from">🔒 ' + esc(T('private: parents & teachers', 'خاصة: الأهل والمعلمين')) + '</small>' : '') + '<p dir="auto">' + esc(m.body).replace(/\n/g, '<br>') + '</p><time>' + esc(new Date(m.created_at).toLocaleTimeString(ar() ? 'ar-EG' : 'en-GB', { hour: 'numeric', minute: '2-digit' })) + '</time></div></div>';
    }).join('');
  }
  function scrollChat(){ const b = $('bubbles'); if(b) b.scrollTop = b.scrollHeight; }
  async function markRead(sid){
    if(!sid) return;
    const now = new Date().toISOString(); D.reads[sid] = now;
    await sb.from('track_chat_reads').upsert({ user_id: me.id, track: TRACK, student_id: sid, last_read_at: now });
    renderChrome();
  }
  ACT.thread = function(b){ thread = b.dataset.id; render(); };
  ACT.quick = function(b){ const ta = main.querySelector('.composer textarea'); if(ta){ ta.value = b.dataset.t; ta.focus(); } };
  FORMS.msg = function(f){
    const body = f.body.value.trim(); if(!body || !thread) return;
    privNote = !!(f.priv && f.priv.checked);
    busy(f.querySelector('[type=submit]'), async function(){
      const r = await sb.from('track_messages').insert({ track: TRACK, student_id: thread, body: body, private: privNote }).select().single();
      if(r.error) throw r.error;
      if(!D.msgs.some(function(m){ return m.id === r.data.id; })) D.msgs.push(Object.assign({ sender_id: me.id, sender_name: me.full_name, sender_role: ROLE(), created_at: new Date().toISOString() }, r.data));
      f.body.value = ''; $('bubbles').innerHTML = bubblesHtml(thread); scrollChat(); markRead(thread);
    });
  };
  // live: new messages arrive without reloading
  let live = null;
  function startLive(){
    try{
      if(live) sb.removeChannel(live);
      live = sb.channel('track-msgs-' + TRACK).on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'track_messages', filter: 'track=eq.' + TRACK }, function(p){
        const m = p.new; if(!m || (D.msgs || []).some(function(x){ return x.id === m.id; })) return;
        D.msgs.push(m);
        if(view === 'msgs' && m.student_id === thread){ const b = $('bubbles'); if(b){ b.innerHTML = bubblesHtml(thread); scrollChat(); markRead(thread); } }
        else { renderChrome(); if(m.sender_id !== me.id) toast('💬 ' + firstName(m.sender_name) + ': ' + m.body.slice(0, 60)); }
      }).subscribe();
    }catch(e){}
  }

  // the bell: unread messages and new tasks
  $('bell').addEventListener('click', function(){
    const items = [];
    const ids = new Set((D.msgs || []).map(function(m){ return m.student_id; }));
    ids.forEach(function(id){ const n = unreadIn(id); if(n) items.push(['💬', T(n + ' new message' + (n > 1 ? 's' : ''), n + ' رسالة جديدة') + (ROLE() === 'student' ? '' : ' · ' + (ROLE() === 'parent' ? ((D.kids || []).find(function(k){ return k.id === id; }) || {}).full_name : pname(id))), 'msgs', id]); });
    newTasks().forEach(function(t){ items.push([(KINDS[t.kind] || ['📄'])[0], T('New: ', 'جديد: ') + t.title, 'tasks', null]); });
    openModal('<h3>🔔 ' + esc(T('Notifications', 'الإشعارات')) + '</h3>' + (items.length ? '<div class="list">' + items.map(function(x){ return '<button type="button" class="item" data-act="bellGo" data-v="' + x[2] + '" data-id="' + (x[3] || '') + '"><span class="ic">' + x[0] + '</span><span class="grow"><b>' + esc(x[1]) + '</b></span></button>'; }).join('') + '</div>'
      : '<p class="muted">' + esc(T('You’re all caught up ✨', 'مفيش جديد ✨')) + '</p>') + '<button class="btn ghost" data-close>' + esc(T('Close', 'إغلاق')) + '</button>');
  });
  ACT.bellGo = function(b){ closeModal(); if(b.dataset.id) thread = b.dataset.id; go(b.dataset.v); };

  // =====================================================================
  // TEACHER: the course manager (open / coming soon / hidden, and announce)
  // =====================================================================
  let cmF = 'all', cmQ = '';
  VIEWS.courses = function(){
    const st = { open: 0, soon: 0, hidden: 0, ann: 0 };
    COURSES.forEach(function(c){ st[cstat(c[0])]++; if(((D.cfg || {})[c[0]] || {}).announce) st.ann++; });
    const groups = FR ? [['fr', '🇫🇷', 'French courses', 'كورسات الفرنساوي']] : TECH_CATS;
    main.innerHTML = '<div class="head"><h2>📣 ' + esc(T('Course manager', 'إدارة الكورسات')) + '</h2><p class="muted">' + esc(T('Choose what visitors see on the course page and what students can join. Announce a course to put it in the spotlight with a note (dates, offers…).', 'اختار الطلاب والزوار يشوفوا إيه في صفحة الكورسات ويشتركوا في إيه. أعلن عن كورس عشان يظهر في الواجهة مع ملاحظة (مواعيد، عروض…).')) + '</p></div>' +
      '<div class="stats"><div class="stat"><i>✅</i><b data-count="' + st.open + '">' + st.open + '</b><span>' + esc(T('open', 'متاح')) + '</span></div><div class="stat"><i>⏳</i><b data-count="' + st.soon + '">' + st.soon + '</b><span>' + esc(T('coming soon', 'قريباً')) + '</span></div><div class="stat"><i>🙈</i><b data-count="' + st.hidden + '">' + st.hidden + '</b><span>' + esc(T('hidden', 'مخفي')) + '</span></div><div class="stat fire"><i>📣</i><b data-count="' + st.ann + '">' + st.ann + '</b><span>' + esc(T('announced', 'معلن عنه')) + '</span></div></div>' +
      (FR ? '' : '<details class="card add-course"' + (addOpen ? ' open' : '') + '><summary>➕ ' + esc(T('Add a new course', 'ضيف كورس جديد')) + '</summary>' + courseForm(null) + '</details>') +
      '<div class="row gap wrap cm-bar"><input type="search" class="search" id="cmSearch" value="' + esc(cmQ) + '" placeholder="' + esc(T('Search a course', 'دوّر على كورس')) + '"><div class="chips">' +
        [['all', '📋', 'All', 'الكل'], ['open', '✅', 'Open', 'متاح'], ['soon', '⏳', 'Soon', 'قريباً'], ['hidden', '🙈', 'Hidden', 'مخفي'], ['ann', '📣', 'Announced', 'معلن عنه']].map(function(c){ return '<button type="button" data-act="cmF" data-f="' + c[0] + '" class="' + (cmF === c[0] ? 'on' : '') + '">' + c[1] + ' ' + esc(T(c[2], c[3])) + '</button>'; }).join('') +
        '</div><a class="btn ghost sm" href="' + (FR ? 'french.html' : 'tech.html#courses') + '" target="_blank" rel="noopener">👀 ' + esc(T('See the course page', 'شوف صفحة الكورسات')) + '</a></div>' +
      groups.map(function(g){
        const q = normFr(cmQ);
        const list = COURSES.filter(function(c){ const f = (D.cfg || {})[c[0]] || {};
          return c[1] === g[0] && (cmF === 'all' || (cmF === 'ann' ? f.announce : (f.status || 'open') === cmF)) && (!q || normFr(c[3] + ' ' + c[4]).indexOf(q) !== -1); });
        if(!list.length) return '';
        return '<h3 class="sec">' + g[1] + ' ' + esc(T(g[2], g[3])) + '</h3><div class="list">' + list.map(function(c){
          const cfg = (D.cfg || {})[c[0]] || {}, s = cfg.status || 'open';
          const n = (D.enrolls || []).filter(function(e){ return e.course === c[0] && e.status !== 'pending'; }).length;
          return '<div class="item col cm s-' + s + '"><div class="row between wrap"><span><b>' + c[2] + ' ' + esc(T(c[3], c[4])) + (cfg.custom ? ' <span class="pill">' + esc(T('added by you', 'إنت ضفته')) + '</span>' : '') + '</b><small>' + n + ' ' + esc(T('students', 'طالب')) + (cfg.custom ? ' · <button type="button" class="link" data-act="editCourse" data-c="' + c[0] + '">✏️ ' + esc(T('Edit', 'تعديل')) + '</button> · <button type="button" class="link danger" data-act="delCourse" data-c="' + c[0] + '">🗑 ' + esc(T('Delete', 'حذف')) + '</button>' : '') + '</small></span>' +
            '<span class="seg3">' + [['open', '✅', 'Open', 'متاح'], ['soon', '⏳', 'Soon', 'قريباً'], ['hidden', '🙈', 'Hidden', 'مخفي']].map(function(o){ return '<button type="button" data-act="cstat" data-c="' + c[0] + '" data-s="' + o[0] + '" class="' + (s === o[0] ? 'on' : '') + '">' + o[1] + ' ' + esc(T(o[2], o[3])) + '</button>'; }).join('') + '</span></div>' +
            '<div class="row gap wrap"><label class="switch-l"><span class="switch"><input type="checkbox" data-ann="' + c[0] + '"' + (cfg.announce ? ' checked' : '') + (s === 'hidden' ? ' disabled' : '') + '><i></i></span> 📣 ' + esc(T('Announce', 'أعلن')) + '</label>' +
            '<input class="note-in grow" data-note="' + c[0] + '" maxlength="200" value="' + esc(cfg.note || '') + '" placeholder="' + esc(T('Note shown with the announcement, e.g. “Starts 1 Dec · 20% off”', 'ملاحظة مع الإعلان، مثلاً «يبدأ ١ ديسمبر · خصم ٢٠٪»')) + '"></div></div>';
        }).join('') + '</div>';
      }).join('');
  };
  ACT.cmF = function(b){ cmF = b.dataset.f; render(); };
  let addOpen = false;
  function courseForm(c){
    c = c || {};
    const v = function(k){ return esc(c[k] || ''); };
    return '<form data-form="course" class="form"' + (c.course ? ' data-id="' + esc(c.course) + '"' : '') + '><div class="grid2">' +
      '<label>' + esc(T('Name (English)', 'الاسم (إنجليزي)')) + '<input name="name_en" maxlength="120" value="' + v('name_en') + '" dir="ltr" placeholder="e.g. AI art for kids"></label>' +
      '<label>' + esc(T('Name (Arabic)', 'الاسم (عربي)')) + '<input name="name_ar" maxlength="120" value="' + v('name_ar') + '" dir="rtl" placeholder="مثلاً: فن الذكاء الاصطناعي للأطفال"></label></div>' +
      '<div class="grid3 tight"><label>' + esc(T('Icon', 'الأيقونة')) + '<input name="icon" maxlength="8" value="' + (v('icon') || '✨') + '"></label>' +
      '<label>' + esc(T('Field', 'المجال')) + '<select name="cat">' + TECH_CATS.map(function(k){ return '<option value="' + k[0] + '"' + ((c.cat || 'it') === k[0] ? ' selected' : '') + '>' + k[1] + ' ' + esc(T(k[2], k[3])) + '</option>'; }).join('') + '</select></label>' +
      '<label>' + esc(T('Level', 'المستوى')) + '<select name="lvl">' + [['b', 'Beginner', 'مبتدئ'], ['m', 'Intermediate', 'متوسط'], ['a', 'Advanced', 'متقدم']].map(function(l){ return '<option value="' + l[0] + '"' + ((c.lvl || 'b') === l[0] ? ' selected' : '') + '>' + esc(T(l[1], l[2])) + '</option>'; }).join('') + '</select></label></div>' +
      '<div class="grid2"><label>' + esc(T('What it is (English)', 'عن الكورس (إنجليزي)')) + '<textarea name="desc_en" rows="2" maxlength="400" dir="ltr">' + v('desc_en') + '</textarea></label>' +
      '<label>' + esc(T('What it is (Arabic)', 'عن الكورس (عربي)')) + '<textarea name="desc_ar" rows="2" maxlength="400" dir="rtl">' + v('desc_ar') + '</textarea></label>' +
      '<label>' + esc(T('Why it matters (English)', 'ليه مهم (إنجليزي)')) + '<input name="why_en" maxlength="300" value="' + v('why_en') + '" dir="ltr"></label>' +
      '<label>' + esc(T('Why it matters (Arabic)', 'ليه مهم (عربي)')) + '<input name="why_ar" maxlength="300" value="' + v('why_ar') + '" dir="rtl"></label>' +
      '<label>' + esc(T('Students will build (English)', 'الطالب هيعمل (إنجليزي)')) + '<input name="build_en" maxlength="200" value="' + v('build_en') + '" dir="ltr"></label>' +
      '<label>' + esc(T('Students will build (Arabic)', 'الطالب هيعمل (عربي)')) + '<input name="build_ar" maxlength="200" value="' + v('build_ar') + '" dir="rtl"></label></div>' +
      '<div class="row gap wrap"><label class="opt"><input type="checkbox" name="kids"' + (c.kids ? ' checked' : '') + '> 🧸 ' + esc(T('Good for kids', 'مناسب للأطفال')) + '</label>' +
      (c.course ? '' : '<label class="opt"><input type="checkbox" name="announce" checked> 📣 ' + esc(T('Announce it on the course page', 'أعلن عنه في صفحة الكورسات')) + '</label>') + '</div>' +
      '<div class="row gap"><button class="btn main" type="submit">' + esc(c.course ? T('Save changes', 'احفظ التعديلات') : T('Add the course', 'ضيف الكورس')) + '</button>' + (c.course ? '<button class="btn ghost" type="button" data-close>' + esc(T('Cancel', 'إلغاء')) + '</button>' : '') + '</div></form>';
  }
  FORMS.course = function(f){
    const val = function(k){ return f[k] ? f[k].value.trim() : ''; };
    if(!val('name_en') && !val('name_ar')){ toast(T('Write the course name first.', 'اكتب اسم الكورس الأول.'), true); return; }
    const id = f.dataset.id || ('c-' + ((val('name_en') || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) || 'course') + '-' + Date.now().toString(36).slice(-4));
    const patch = { custom: true, cat: f.cat.value, icon: val('icon') || '✨', lvl: f.lvl.value, kids: f.kids.checked,
      name_en: val('name_en') || null, name_ar: val('name_ar') || null, desc_en: val('desc_en') || null, desc_ar: val('desc_ar') || null,
      why_en: val('why_en') || null, why_ar: val('why_ar') || null, build_en: val('build_en') || null, build_ar: val('build_ar') || null };
    if(!f.dataset.id){ patch.status = 'open'; patch.announce = !!(f.announce && f.announce.checked); }
    busy(f.querySelector('[type=submit]'), async function(){
      await saveCourse(id, patch); mergeCustom(); addOpen = false; closeModal();
      if(patch.announce) party(null, { emoji: ['📣', '✨'] });
      toast(f.dataset.id ? T('Saved ✓', 'اتحفظ ✓') : T('Course added ✓ It is on the course page now.', 'الكورس اتضاف ✓ وظاهر في صفحة الكورسات دلوقتي.')); render();
    });
  };
  ACT.editCourse = function(b){ const c = (D.cfg || {})[b.dataset.c]; if(c) openModal('<h3>✏️ ' + esc(T('Edit course', 'تعديل الكورس')) + '</h3>' + courseForm(c), true); };
  ACT.delCourse = function(b){
    const id = b.dataset.c, n = (D.enrolls || []).filter(function(e){ return e.course === id; }).length;
    if(!confirm(n ? T('Students are in this course. Hide it instead? (OK = delete anyway)', 'فيه طلاب في الكورس ده. الأحسن تخفيه — موافق = احذفه برضه') : T('Delete this course?', 'تحذف الكورس ده؟'))) return;
    busy(b, async function(){ const r = await sb.from('track_courses').delete().eq('track', TRACK).eq('course', id); if(r.error) throw r.error; delete D.cfg[id]; mergeCustom(); toast(T('Deleted', 'اتحذف')); render(); });
  };

  // ----- teacher (French): a book for each level, downloadable on french.html -----
  const bookUrl = function(path){ return SB_URL + '/storage/v1/object/public/track-books/' + path.split('/').map(encodeURIComponent).join('/'); };
  VIEWS.books = async function(){
    main.innerHTML = '<div class="loading">📘</div>';
    const rows = await sel(sb.from('track_books').select('*').eq('track', TRACK).order('level').order('created_at', { ascending: false }));
    if(view !== 'books') return;
    D.books = rows;
    main.innerHTML = '<div class="head"><h2>📘 ' + esc(T('Level books', 'كتب المستويات')) + '</h2><p class="muted">' + esc(T('Upload a book for each level. It appears on the French page under that level with a Download button.', 'ارفع كتاب لكل مستوى، وهيظهر في صفحة الفرنساوي تحت المستوى ده بزرار «حمّل الكتاب».')) + '</p></div>' +
      '<form data-form="book" class="card form"><div class="grid2"><label>' + esc(T('Level', 'المستوى')) + '<select name="level">' + [1, 2, 3, 4, 5, 6].map(function(n){ return '<option value="' + n + '">' + esc(T('Level ' + n, 'المستوى ' + n)) + '</option>'; }).join('') + '</select></label>' +
      '<label>' + esc(T('Book title', 'اسم الكتاب')) + '<input name="title" maxlength="160" required placeholder="' + esc(T('e.g. Le Club Français · Level 1', 'مثلاً: Le Club Français · المستوى ١')) + '"></label></div>' +
      '<label>' + esc(T('File (PDF, Word, PowerPoint or EPUB, up to 50 MB)', 'الملف (PDF أو Word أو PowerPoint أو EPUB، لحد ٥٠ ميجا)')) + '<input name="file" type="file" required accept=".pdf,.doc,.docx,.ppt,.pptx,.epub,application/pdf"></label>' +
      '<div class="row gap"><button class="btn main" type="submit">⬆️ ' + esc(T('Upload the book', 'ارفع الكتاب')) + '</button><span class="muted small" id="bookProg"></span></div></form>' +
      [1, 2, 3, 4, 5, 6].map(function(n){
        const list = rows.filter(function(r){ return r.level === n; });
        return '<h3 class="sec">📘 ' + esc(T('Level ' + n, 'المستوى ' + n)) + ' <small>' + list.length + '</small></h3>' + (list.length ? '<div class="list">' + list.map(function(r){
          return '<div class="item"><span class="ic">📘</span><span class="grow"><b>' + esc(r.title) + '</b><small>' + esc(fmtDate(r.created_at)) + (r.file_size ? ' · ' + (r.file_size / 1048576).toFixed(1) + ' MB' : '') + '</small></span>' +
            '<a class="btn ghost sm" href="' + esc(bookUrl(r.file_path)) + '" target="_blank" rel="noopener" aria-label="' + esc(T('Download', 'تحميل')) + '">⬇️</a><button class="link danger" data-act="delBook" data-id="' + r.id + '" aria-label="' + esc(T('Delete', 'حذف')) + '">✕</button></div>';
        }).join('') + '</div>' : '<p class="muted small">' + esc(T('No book yet.', 'لسه مفيش كتاب.')) + '</p>');
      }).join('');
  };
  FORMS.book = function(f){
    const file = f.file.files[0]; if(!file) return;
    if(file.size > 50 * 1024 * 1024){ toast(T('The file is bigger than 50 MB.', 'الملف أكبر من ٥٠ ميجا.'), true); return; }
    busy(f.querySelector('[type=submit]'), async function(){
      $('bookProg').textContent = T('Uploading…', 'بيرفع…');
      const ext = (file.name.split('.').pop() || 'pdf').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) || 'pdf';
      const safe = file.name.replace(/\.[^.]+$/, '').normalize('NFKD').replace(/[^\w-]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'book';
      const path = TRACK + '/level-' + f.level.value + '/' + Date.now() + '-' + safe + '.' + ext;
      const up = await sb.storage.from('track-books').upload(path, file, { contentType: file.type || undefined });
      if(up.error) throw up.error;
      const r = await sb.from('track_books').insert({ track: TRACK, level: +f.level.value, title: f.title.value.trim(), file_path: path, file_size: file.size });
      if(r.error){ await sb.storage.from('track-books').remove([path]); throw r.error; }
      toast(T('Book uploaded ✓ It is on the French page now.', 'الكتاب اترفع ✓ وظاهر في صفحة الفرنساوي دلوقتي.')); party(null, { emoji: ['📘'] }); render();
    });
  };
  ACT.delBook = function(b){
    if(!confirm(T('Delete this book?', 'تحذف الكتاب ده؟'))) return;
    const row = (D.books || []).find(function(x){ return x.id === +b.dataset.id; });
    busy(b, async function(){ const r = await sb.from('track_books').delete().eq('id', +b.dataset.id); if(r.error) throw r.error; if(row) await sb.storage.from('track-books').remove([row.file_path]); render(); });
  };

  // ----- teacher (Tech): Coco's question bank -----
  VIEWS.faq = async function(){
    main.innerHTML = '<div class="loading">❓</div>';
    const rows = await sel(sb.from('track_faq').select('*').eq('track', TRACK).order('created_at', { ascending: false }).limit(300));
    if(view !== 'faq') return;
    D.faq = rows;
    const pend = rows.filter(function(r){ return r.status === 'pending'; }), pub = rows.filter(function(r){ return r.status === 'published'; });
    const form = function(r){ return '<form data-form="faq" data-id="' + (r ? r.id : '') + '" class="form"><div class="grid2">' +
      '<label>' + esc(T('Question (English)', 'السؤال (إنجليزي)')) + '<input name="q_en" maxlength="300" dir="ltr" value="' + esc(r ? (r.q_en || (/[a-z]/i.test(r.question) ? r.question : '')) : '') + '"></label>' +
      '<label>' + esc(T('Question (Arabic)', 'السؤال (عربي)')) + '<input name="q_ar" maxlength="300" dir="rtl" value="' + esc(r ? (r.q_ar || (/[\u0600-\u06ff]/.test(r.question) ? r.question : '')) : '') + '"></label>' +
      '<label>' + esc(T('Coco’s answer (English)', 'إجابة كوكو (إنجليزي)')) + '<textarea name="a_en" rows="3" maxlength="1500" dir="ltr">' + esc(r && r.a_en || '') + '</textarea></label>' +
      '<label>' + esc(T('Coco’s answer (Arabic)', 'إجابة كوكو (عربي)')) + '<textarea name="a_ar" rows="3" maxlength="1500" dir="rtl">' + esc(r && r.a_ar || '') + '</textarea></label></div>' +
      '<div class="row gap wrap"><button class="btn main" type="submit">✅ ' + esc(T('Publish', 'انشر')) + '</button>' + (r ? '<button class="btn ghost" type="button" data-act="delFaq" data-id="' + r.id + '">🗑 ' + esc(T('Delete', 'حذف')) + '</button>' + (r.status === 'published' ? '<button class="btn ghost" type="button" data-act="unpubFaq" data-id="' + r.id + '">🙈 ' + esc(T('Unpublish', 'إخفاء')) + '</button>' : '') : '') + '</div></form>'; };
    main.innerHTML = '<div class="head"><h2>❓ ' + esc(T('Coco’s questions', 'أسئلة كوكو')) + '</h2><p class="muted">' + esc(T('Visitors of the Tech Lab page suggest questions. Answer them here: once published, Coco answers them on the page for everyone.', 'زوار صفحة البرمجة بيقترحوا أسئلة. جاوب عليها هنا — وأول ما تنشرها، كوكو بيجاوب عليها في الصفحة للكل.')) + '</p></div>' +
      '<div class="stats"><div class="stat fire"><i>📥</i><b>' + pend.length + '</b><span>' + esc(T('waiting for an answer', 'مستنية إجابة')) + '</span></div><div class="stat"><i>✅</i><b>' + pub.length + '</b><span>' + esc(T('published', 'منشورة')) + '</span></div></div>' +
      '<details class="card add-course"><summary>➕ ' + esc(T('Add a question yourself', 'ضيف سؤال بنفسك')) + '</summary>' + form(null) + '</details>' +
      (pend.length ? '<h3 class="sec">📥 ' + esc(T('Suggested by visitors', 'اقتراحات الزوار')) + '</h3>' + pend.map(function(r){ return '<div class="card faq-q"><p class="fq">“' + esc(r.question) + '” <small class="muted">' + esc(fmtDate(r.created_at)) + '</small></p>' + form(r) + '</div>'; }).join('') : '') +
      (pub.length ? '<h3 class="sec">✅ ' + esc(T('Published', 'المنشورة')) + '</h3><div class="list">' + pub.map(function(r){ return '<details class="item col"><summary><b>' + esc(T(r.q_en || r.q_ar || r.question, r.q_ar || r.q_en || r.question)) + '</b></summary>' + form(r) + '</details>'; }).join('') + '</div>' : '') +
      (!pend.length && !pub.length ? emptyCard('🤖', T('No questions yet. They will appear here when visitors suggest them.', 'لسه مفيش أسئلة — هتظهر هنا لما الزوار يقترحوا.')) : '');
  };
  FORMS.faq = function(f){
    const row = { q_en: f.q_en.value.trim() || null, q_ar: f.q_ar.value.trim() || null, a_en: f.a_en.value.trim() || null, a_ar: f.a_ar.value.trim() || null, status: 'published' };
    if(!(row.q_en || row.q_ar) || !(row.a_en || row.a_ar)){ toast(T('Write the question and Coco’s answer (in at least one language).', 'اكتب السؤال وإجابة كوكو (بلغة واحدة على الأقل).'), true); return; }
    busy(f.querySelector('[type=submit]'), async function(){
      const r = f.dataset.id ? await sb.from('track_faq').update(row).eq('id', +f.dataset.id) : await sb.from('track_faq').insert(Object.assign({ track: TRACK, question: row.q_en || row.q_ar }, row));
      if(r.error) throw r.error; toast(T('Published ✓ Coco knows it now.', 'اتنشر ✓ كوكو بقى عارفه.')); party(null, { emoji: ['🤖', '✅'] }); render();
    });
  };
  ACT.delFaq = function(b){ if(!confirm(T('Delete this question?', 'تحذف السؤال ده؟'))) return; busy(b, async function(){ const r = await sb.from('track_faq').delete().eq('id', +b.dataset.id); if(r.error) throw r.error; render(); }); };
  ACT.unpubFaq = function(b){ busy(b, async function(){ const r = await sb.from('track_faq').update({ status: 'pending' }).eq('id', +b.dataset.id); if(r.error) throw r.error; render(); }); };
  main.addEventListener('input', function(e){ if(e.target.id !== 'cmSearch') return; cmQ = e.target.value; const pos = e.target.selectionStart; render(); const n = $('cmSearch'); n.focus(); n.setSelectionRange(pos, pos); });
  async function saveCourse(course, patch){
    const cur0 = (D.cfg || {})[course] || { track: TRACK, course: course, status: 'open', announce: false, note: null };
    const row = Object.assign({}, cur0, patch, { track: TRACK, course: course, updated_at: new Date().toISOString() });
    if(row.status === 'hidden') row.announce = false;
    const r = await sb.from('track_courses').upsert(row);
    if(r.error) throw r.error;
    D.cfg[course] = row; return row;
  }
  ACT.cstat = function(b){ busy(null, async function(){ await saveCourse(b.dataset.c, { status: b.dataset.s }); toast(T('Saved ✓', 'اتحفظ ✓')); render(); }); };
  main.addEventListener('change', function(e){
    const a = e.target.closest('[data-ann]'), n = e.target.closest('[data-note]');
    if(a) busy(null, async function(){ await saveCourse(a.dataset.ann, { announce: a.checked }); if(a.checked) party(a, { emoji: ['📣'] }); toast(a.checked ? T('Announced 📣', 'اتعلن 📣') : T('Announcement removed', 'الإعلان اتشال')); render(); });
    if(n) busy(null, async function(){ await saveCourse(n.dataset.note, { note: n.value.trim() || null }); toast(T('Note saved ✓', 'الملاحظة اتحفظت ✓')); });
  });
  ACT.pickCourse = function(b){
    const sel0 = main.querySelector('select[name=course]'); if(!sel0) return;
    const o = Array.prototype.find.call(sel0.options, function(x){ return x.value === b.dataset.c; });
    if(!o || o.disabled){ toast(T('This course opens soon. Message us to be the first to know!', 'الكورس ده هيفتح قريب — كلّمنا عشان تعرف أول واحد!')); return; }
    sel0.value = b.dataset.c; sel0.scrollIntoView({ block: 'center', behavior: 'smooth' }); sel0.focus();
  };

  // ---------- go ----------
  (async function boot(){
    renderChrome();
    let qs = null; try{ qs = new URLSearchParams(location.search); }catch(e){}
    if(qs && qs.get('verify')) return showVerify(qs.get('verify'));
    if(qs && qs.get('portfolio')) return showPortfolio(qs.get('portfolio'));
    try{ await start(); }catch(e){ console.error(e); showAuth(errText(e)); }
  })();
  sb.auth.onAuthStateChange(function(ev){ if(ev === 'SIGNED_OUT' && me){ me = null; view = null; renderChrome(); showAuth(); } });
})();
