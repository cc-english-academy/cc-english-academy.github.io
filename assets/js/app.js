
// video lessons — files live in the videos/ folder next to index.html
window.LESSONS = [
  {id:"farm-animals",title:"Farm Animals",tag:"Vocabulary",level:"Level 1",dur:"0:16",words:["My uncle has a big farm", "The cows give fresh milk", "The sheep have soft wool"],src:"assets/video/farm-animals.mp4",poster:"assets/img/poster-farm-animals.webp"},
  {id:"zoo-animals",title:"Zoo Animals",tag:"Vocabulary",level:"Level 1",dur:"0:08",words:["elephant", "lion", "giraffe"],src:"assets/video/zoo-animals.mp4",poster:"assets/img/poster-zoo-animals.webp"},
  {id:"fruits-1",title:"Fruits",tag:"Vocabulary",level:"Level 1",dur:"0:08",words:["strawberry", "grapes", "blueberry"],src:"assets/video/fruits-1.mp4",poster:"assets/img/poster-fruits-1.webp"},
  {id:"fruits-2",title:"More Fruits",tag:"Vocabulary",level:"Level 1",dur:"0:08",words:["pear", "peach", "mango"],src:"assets/video/fruits-2.mp4",poster:"assets/img/poster-fruits-2.webp"},
  {id:"getting-around",title:"Getting Around",tag:"Vocabulary",level:"Level 1",dur:"0:08",words:["car", "bus", "bicycle"],src:"assets/video/getting-around.mp4",poster:"assets/img/poster-getting-around.webp"},
  {id:"saudi-national-day",title:"Saudi National Day",tag:"Culture",level:"Level 1",dur:"0:08",words:["I love Saudi Arabia", "This is my country", "I am proud of my country", "Happy Saudi National Day"],src:"assets/video/saudi-national-day.mp4",poster:"assets/img/poster-saudi-national-day.webp"}
];

// ===== Video lessons: hero phone + Watch & Learn =====
(function(){
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const PLAY_SVG = '<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
  const BUILTIN = (window.LESSONS || []).slice();
  let L = BUILTIN.slice();              // teacher-uploaded lessons are added in front of these
  const blobCache = {};

  // built-in lessons are stored inside this file as data, so they work with no extra files to upload
  function lessonSrc(l){
    if(!l.src || l.src.indexOf('data:') !== 0) return l.src;
    if(blobCache[l.id]) return blobCache[l.id];
    const bin = atob(l.src.split(',')[1]);
    const arr = new Uint8Array(bin.length);
    for(let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
    return (blobCache[l.id] = URL.createObjectURL(new Blob([arr], { type: 'video/mp4' })));
  }
  function esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  // ---- hero phone: muted, looping through the lessons ----
  const hv = document.getElementById('heroVideo');
  const dots = document.getElementById('heroDots');
  const cap = document.getElementById('heroCapTitle');
  let hi = 0, userPaused = false;
  function hRenderDots(){
    if(dots) dots.innerHTML = L.map(function(l, i){ return '<i data-i="' + i + '"></i>'; }).join('');
  }
  function hLoad(i, play){
    hi = (i + L.length) % L.length;
    const l = L[hi];
    if(l.poster) hv.poster = l.poster; else hv.removeAttribute('poster');
    hv.src = lessonSrc(l);
    cap.textContent = l.title;
    Array.prototype.forEach.call(dots.children, function(d, k){ d.classList.toggle('on', k === hi); });
    if(play) hv.play().catch(function(){});
  }
  if(hv){
    const snd = document.getElementById('heroSound');
    const phone = document.getElementById('heroPhone');
    hRenderDots();
    hLoad(0, !reduce);
    hv.addEventListener('ended', function(){ hLoad(hi + 1, true); });
    dots.addEventListener('click', function(e){
      const d = e.target.closest('i');
      if(d){ e.stopPropagation(); userPaused = false; hLoad(parseInt(d.dataset.i, 10), true); }
    });
    snd.addEventListener('click', function(e){
      e.stopPropagation();
      hv.muted = !hv.muted;
      snd.classList.toggle('on', !hv.muted);
      if(hv.paused){ userPaused = false; hv.play().catch(function(){}); }
    });
    phone.addEventListener('click', function(){
      if(hv.paused){ userPaused = false; hv.play().catch(function(){}); }
      else { userPaused = true; hv.pause(); }
    });
    if('IntersectionObserver' in window){
      new IntersectionObserver(function(es){
        es.forEach(function(e){
          if(!e.isIntersecting) hv.pause();
          else if(!reduce && !userPaused) hv.play().catch(function(){});
        });
      }, { threshold: 0.25 }).observe(phone);
    }
  }

  // ---- Watch & Learn: lesson library ----
  const list = document.getElementById('watchList');
  const wv = document.getElementById('wpVideo');
  const wTitle = document.getElementById('wpTitle');
  const wTag = document.getElementById('wpTag');
  const wLevel = document.getElementById('wpLevel');
  const wWords = document.getElementById('wpWords');
  let wi = 0;
  let wPicked = false; // the visitor chose a lesson themselves

  function renderCards(){
    list.innerHTML = L.map(function(l, i){
      const thumb = l.poster
        ? '<img src="' + l.poster + '" alt="" loading="lazy"><video muted loop playsinline preload="none"></video>'
        : '<video class="lc-main" muted loop playsinline preload="metadata" src="' + esc(l.src) + '#t=0.6"></video>';
      return '<button class="lesson-card" type="button" data-i="' + i + '">' +
        '<span class="lc-thumb">' + thumb +
        '<span class="lc-now">Now playing</span>' +
        '<span class="lc-play">' + PLAY_SVG + '</span>' + (l.dur ? '<span class="lc-dur">' + esc(l.dur) + '</span>' : '') + '</span>' +
        '<span class="lc-body"><b>' + esc(l.title) + '</b><span>' + esc(l.tag) + '</span></span></button>';
    }).join('');
    // hovering a card previews it, muted
    if(window.matchMedia('(hover:hover)').matches){
      Array.prototype.forEach.call(list.querySelectorAll('.lesson-card'), function(c){
        const v = c.querySelector('video');
        c.addEventListener('mouseenter', function(){
          const l = L[parseInt(c.dataset.i, 10)];
          if(!v.getAttribute('src')) v.src = lessonSrc(l);
          v.currentTime = 0;
          v.play().catch(function(){});
          c.classList.add('previewing');
        });
        c.addEventListener('mouseleave', function(){ v.pause(); c.classList.remove('previewing'); });
      });
    }
  }

  function speak(text, btn){
    if(!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US';
    u.rate = 0.85;
    if(btn){
      btn.classList.add('speaking');
      u.onend = u.onerror = function(){ btn.classList.remove('speaking'); };
    }
    window.speechSynthesis.speak(u);
  }

  function select(i, play){
    wi = (i + L.length) % L.length;
    const l = L[wi];
    if(l.poster) wv.poster = l.poster; else wv.removeAttribute('poster');
    wv.src = lessonSrc(l);
    wTitle.textContent = l.title;
    wTag.textContent = l.tag;
    wLevel.textContent = window.__levelLabel ? window.__levelLabel(l.level) : l.level;
    wWords.innerHTML = (l.words || []).map(function(w){ return '<button type="button">' + esc(w) + '</button>'; }).join('');
    wWords.hidden = !(l.words && l.words.length);
    let ig = document.getElementById('wpInsta');
    if(!ig){
      ig = document.createElement('a');
      ig.id = 'wpInsta'; ig.className = 'wp-insta'; ig.target = '_blank'; ig.rel = 'noopener';
      ig.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/></svg><span>Watch on Instagram</span>';
      wWords.parentNode.insertBefore(ig, wWords.nextSibling);
    }
    ig.hidden = !l.permalink;
    if(l.permalink) ig.href = l.permalink;
    Array.prototype.forEach.call(list.querySelectorAll('.lesson-card'), function(c, k){ c.classList.toggle('active', k === wi); });
    if(play) wv.play().catch(function(){});
  }

  if(list && wv){
    renderCards();
    wWords.addEventListener('click', function(e){
      const b = e.target.closest('button');
      if(b) speak(b.textContent, b);
    });
    list.addEventListener('click', function(e){
      const c = e.target.closest('.lesson-card');
      if(!c) return;
      wPicked = true;
      select(parseInt(c.dataset.i, 10), true);
      if(window.matchMedia('(max-width:1000px)').matches){
        wv.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      }
    });
    document.getElementById('wpPrev').addEventListener('click', function(){ wPicked = true; select(wi - 1, true); });
    document.getElementById('wpNext').addEventListener('click', function(){ wPicked = true; select(wi + 1, true); });
    wv.addEventListener('ended', function(){ select(wi + 1, true); }); // keeps learning going
    select(0, false);
  }

  // teacher-uploaded videos (loaded from Supabase) are put in front of the built-in ones
  window.__setRemoteLessons = function(remote){
    const curW = L[wi] && L[wi].id, curH = L[hi] && L[hi].id;
    L = (remote || []).concat(BUILTIN);
    if(hv){
      hRenderDots();
      const k = L.findIndex(function(l){ return l.id === curH; });
      hi = k < 0 ? 0 : k;
      Array.prototype.forEach.call(dots.children, function(d, n){ d.classList.toggle('on', n === hi); });
    }
    if(list && wv){
      renderCards();
      const k = L.findIndex(function(l){ return l.id === curW; });
      const playing = !wv.paused;
      if(!wPicked && !playing){
        select(0, false); // show the newest video (e.g. the latest Instagram post) first
      } else if(k >= 0){
        wi = k;
        Array.prototype.forEach.call(list.querySelectorAll('.lesson-card'), function(c, n){ c.classList.toggle('active', n === wi); });
      } else if(!playing){
        select(0, false);
      }
    }
  };
})();

document.querySelectorAll('img[data-club-photo]').forEach(function(img){
  const s = document.querySelector('.club-card[data-club="' + img.dataset.clubPhoto + '"] .club-photo img');
  if(s) img.src = s.src;
});

// ===== nav: highlight the section being read + show the mobile CTA bar =====
(function(){
  const links = Array.prototype.slice.call(document.querySelectorAll('nav.links .nav-link'));
  const map = {};
  links.forEach(function(a){ const id = (a.getAttribute('href') || '').replace('#', ''); if(id) map[id] = a; });
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting && map[e.target.id]){
          links.forEach(function(a){ a.classList.remove('active'); });
          map[e.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(function(id){ const s = document.getElementById(id); if(s) io.observe(s); });
  }
  const bar = document.getElementById('mobileCta');
  if(bar){
    window.addEventListener('scroll', function(){ bar.classList.toggle('show', window.scrollY > 520); }, { passive: true });
  }
})();

// hero rotating word — types letter by letter, then a highlight sweeps under it
const HERO_WORDS = {
  en: ['confidence.', 'fluency.', 'friendships.', 'a superpower.'],
  ar: ['ثقة.', 'طلاقة.', 'صداقات.', 'قوة خارقة.']
};
let heroWords = HERO_WORDS[document.documentElement.lang === 'ar' ? 'ar' : 'en'];
let heroWordIdx = 0;
const hwLetters = document.getElementById('hwLetters');
const hwHighlight = document.getElementById('hwHighlight');

function typeWord(word){
  hwHighlight.classList.remove('show');
  hwLetters.innerHTML = '';
  if(document.documentElement.lang === 'ar'){
    // Arabic letters must stay connected, so no per-letter spans
    hwLetters.textContent = word;
    setTimeout(()=> hwHighlight.classList.add('show'), 420);
    return;
  }
  [...word].forEach((ch,i)=>{
    const span = document.createElement('span');
    span.className = 'ch';
    span.textContent = ch;
    span.style.animationDelay = (i*38) + 'ms';
    hwLetters.appendChild(span);
  });
  const typeTime = word.length*38 + 320;
  setTimeout(()=> hwHighlight.classList.add('show'), typeTime);
}

window.__refreshHeroWords = function(lang){
  heroWords = HERO_WORDS[lang === 'ar' ? 'ar' : 'en'];
  heroWordIdx = 0;
  if(hwLetters && hwHighlight) typeWord(heroWords[0]);
};
if(hwLetters && hwHighlight){
  typeWord(heroWords[0]);
  setInterval(()=>{
    hwHighlight.classList.remove('show');
    setTimeout(()=>{
      heroWordIdx = (heroWordIdx+1) % heroWords.length;
      typeWord(heroWords[heroWordIdx]);
    }, 400);
  }, 3400);
}

// floaters parallax on mouse move
const floaters = document.getElementById('floaters');
if(floaters && window.matchMedia('(pointer:fine)').matches){
  document.querySelector('.hero').addEventListener('mousemove', (e)=>{
    const x = (e.clientX / window.innerWidth - 0.5) * 24;
    const y = (e.clientY / window.innerHeight - 0.5) * 24;
    floaters.style.transform = `translate(${x}px, ${y}px)`;
    floaters.style.transition = 'transform .3s ease-out';
  });
}

// Accounts, dashboard, materials, progress & notifications — backed by Supabase
(function(){
  if(typeof supabase === 'undefined'){
    console.warn('Supabase library did not load; accounts and the dashboard are disabled.');
    return;
  }
  const SUPABASE_URL = 'https://orpknmkgfwmtroiqljzp.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_x7AQ0xQl8qqOH3iDKqxddg_-7fbStUh';
  const sb = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
  window.__sb = sb; // handy for debugging in the browser console
  loadRemoteLessons(); // teacher-uploaded video lessons (public)

  // ---------- small helpers ----------
  function isAr(){ return document.documentElement.lang === 'ar'; }
  function t(en, ar){ return isAr() ? ar : en; }
  // Supabase Storage only accepts plain ASCII keys, so "·", Arabic letters,
  // brackets, emoji etc. in a file name make it fail with "Invalid key".
  // The real file name is kept in the database (file_name) and reused on download.
  function storageSlug(str, fallback){
    const out = String(str || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Za-z0-9._-]+/g, '_').replace(/_+/g, '_').replace(/^[_.-]+|[_.-]+$/g, '').slice(0, 60);
    return out || fallback;
  }
  function buildStoragePath(club, level, fileName){
    const m = String(fileName).match(/\.([A-Za-z0-9]{1,8})$/);
    const ext = m ? '.' + m[1].toLowerCase() : '';
    const base = m ? fileName.slice(0, -m[0].length) : fileName;
    const rand = Math.random().toString(36).slice(2, 8);
    return storageSlug(club, 'club') + '/' + storageSlug(level, 'level') + '/' +
      Date.now() + '_' + rand + '_' + storageSlug(base, 'file') + ext;
  }
  function fileExt(name){ const m = String(name || '').match(/\.([a-z0-9]+)$/i); return m ? m[1].toLowerCase() : ''; }
  function fileIcon(ext){
    if(ext === 'pdf') return '📕';
    if(ext === 'epub') return '📘';
    if(ext === 'doc' || ext === 'docx') return '📝';
    if(ext === 'ppt' || ext === 'pptx') return '📊';
    if(['png','jpg','jpeg','webp','gif'].indexOf(ext) !== -1) return '🖼️';
    if(ext === 'mp3') return '🎧';
    if(ext === 'mp4') return '🎬';
    return '📄';
  }
  function fmtSize(bytes){
    if(!bytes) return '';
    if(bytes < 1024 * 1024) return Math.max(1, Math.round(bytes / 1024)) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  }
  function publicUrl(path){ return sb.storage.from('materials').getPublicUrl(path).data.publicUrl; }
  function downloadUrl(item){
    return sb.storage.from('materials').getPublicUrl(item.file_path, { download: item.file_name || true }).data.publicUrl;
  }
  // Books: the full file sits in the private 'books' bucket (students with an active plan, and teachers);
  // everyone in the club can read a free preview of the first pages. Older books still in the public
  // 'materials' bucket stay open until a teacher protects them.
  const PREVIEW_PAGES = 5;
  let bookAccess = true;  // false for a student without an active plan
  const bookUrls = {};    // file_path -> signed link to the full book
  function isProtected(item){ return item.bucket === 'books'; }
  function canReadFull(item){ return !isProtected(item) || bookAccess; }
  function bookSrc(item){
    if(!isProtected(item)) return publicUrl(item.file_path);
    if(bookAccess) return bookUrls[item.file_path] || '';
    return item.preview_path ? publicUrl(item.preview_path) : '';
  }
  function bookDownload(item){
    if(!isProtected(item)) return downloadUrl(item);
    const u = bookAccess && bookUrls[item.file_path];
    return u ? u + '&download=' + encodeURIComponent(item.file_name || item.title) : '';
  }
  async function refreshBookAccess(items){
    if(isTeacher()) bookAccess = true;
    else {
      const { data, error } = await sb.from('enrollments').select('status, ends_at').eq('student_id', currentProfile.id);
      bookAccess = !error && (data || []).some(function(e){ return e.status === 'active' && (!e.ends_at || new Date(e.ends_at).getTime() > Date.now()); });
    }
    const paths = bookAccess ? items.filter(isProtected).map(function(m){ return m.file_path; }).filter(function(p){ return !bookUrls[p]; }) : [];
    if(paths.length){
      const { data } = await sb.storage.from('books').createSignedUrls(paths, 6 * 3600);
      (data || []).forEach(function(r){ if(r && r.signedUrl) bookUrls[r.path] = r.signedUrl; });
    }
  }
  // the first pages of a PDF as a new, small PDF (pdf-lib is loaded only when a teacher needs it)
  let pdfLibLoading = null;
  function loadPdfLib(){
    if(window.PDFLib) return Promise.resolve(window.PDFLib);
    if(!pdfLibLoading) pdfLibLoading = new Promise(function(resolve, reject){
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js';
      s.onload = function(){ resolve(window.PDFLib); };
      s.onerror = function(){ pdfLibLoading = null; reject(new Error('Could not load the PDF tool')); };
      document.head.appendChild(s);
    });
    return pdfLibLoading;
  }
  async function makePdfPreview(blob){
    try{
      const PDFLib = await loadPdfLib();
      const src = await PDFLib.PDFDocument.load(await blob.arrayBuffer(), { ignoreEncryption: true });
      const total = src.getPageCount();
      const out = await PDFLib.PDFDocument.create();
      const n = Math.min(PREVIEW_PAGES, total);
      const pages = await out.copyPages(src, Array.from({ length: n }, function(_, i){ return i; }));
      pages.forEach(function(pg){ out.addPage(pg); });
      return { blob: new Blob([await out.save()], { type: 'application/pdf' }), pages: total, previewPages: n };
    }catch(e){ return null; } // not a readable PDF: the book is simply locked without a preview
  }
  // store a book: full file → private bucket, preview → public bucket
  async function storeBook(path, file, name){
    const { error } = await sb.storage.from('books').upload(path, file, {
      contentType: file.type || 'application/octet-stream', cacheControl: '3600', upsert: true
    });
    if(error) throw error;
    const out = { bucket: 'books', preview_path: null, pages: null, preview_pages: null };
    if(fileExt(name) === 'pdf'){
      const pv = await makePdfPreview(file);
      if(pv){
        const pvPath = 'previews/' + path;
        const { error: pvErr } = await sb.storage.from('materials').upload(pvPath, pv.blob, { contentType: 'application/pdf', upsert: true });
        if(!pvErr) Object.assign(out, { preview_path: pvPath, pages: pv.pages, preview_pages: pv.previewPages });
      }
    }
    return out;
  }
  // a database feature from supabase/schema.sql that hasn't been installed yet
  function isMissing(err){
    return !!err && (err.code === 'PGRST202' || err.code === 'PGRST205' || err.code === '42P01' || err.code === '42883' ||
      /could not find the (function|table)|does not exist|schema cache/i.test(err.message || ''));
  }
  const toastsEl = document.getElementById('toasts');
  function toast(title, body, isErr){
    if(!toastsEl) return;
    const el = document.createElement('div');
    el.className = 'toast' + (isErr ? ' err' : '');
    el.innerHTML = '<b>' + esc(title) + '</b>' + (body ? esc(body) : '');
    toastsEl.appendChild(el);
    setTimeout(function(){ el.classList.add('out'); }, 5200);
    setTimeout(function(){ el.remove(); }, 5600);
  }


  // full-page auth screen
  const authPage = document.getElementById('authPage');
  const authBackLink = document.getElementById('authBackLink');
  const authTabButtons = document.querySelectorAll('.auth-tab');
  const authPageTitle = document.getElementById('authPageTitle');
  const authPageSub = document.getElementById('authPageSub');
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const suRole = document.getElementById('suRole');
  const suClubWrap = document.getElementById('suClubWrap');

  // dashboard
  const dashboardPage = document.getElementById('dashboardPage');
  const dashAvatar = document.getElementById('dashAvatar');
  const dashName = document.getElementById('dashName');
  const dashRoleClub = document.getElementById('dashRoleClub');
  const dashSignOutBtn = document.getElementById('dashSignOutBtn');
  const backToSiteBtn = document.getElementById('backToSiteBtn');
  const dashTabs = document.querySelectorAll('.dash-tab');
  const dashViews = document.querySelectorAll('.dash-view');
  const tabStudents = document.getElementById('tabStudents');
  const tabProgress = document.getElementById('tabProgress');

  const ovName = document.getElementById('ovName');
  const ovSub = document.getElementById('ovSub');
  const ovStats = document.getElementById('ovStats');
  const ovNotifPreview = document.getElementById('ovNotifPreview');

  const libForm = document.getElementById('libForm');
  const libGrid = document.getElementById('libGrid');
  const libTabs = document.getElementById('libTabs');
  const matHeading = document.getElementById('matHeading');
  const matSub = document.getElementById('matSub');

  const levelTabs = document.getElementById('levelTabs');
  const levelLockedMsg = document.getElementById('levelLockedMsg');
  const examCTA = document.getElementById('examCTA');
  const examCTAText = document.getElementById('examCTAText');
  const startExamBtn = document.getElementById('startExamBtn');
  const examPanel = document.getElementById('examPanel');
  const examTitle = document.getElementById('examTitle');
  const examQuestionsEl = document.getElementById('examQuestions');
  const submitExamBtn = document.getElementById('submitExamBtn');
  const examResult = document.getElementById('examResult');
  const examAdmin = document.getElementById('examAdmin');
  const examQForm = document.getElementById('examQForm');
  const examQList = document.getElementById('examQList');

  const progressList = document.getElementById('progressList');
  const progressForm = document.getElementById('progressForm');
  const progStudent = document.getElementById('progStudent');
  const studentsList = document.getElementById('studentsList');

  const notifForm = document.getElementById('notifForm');
  const notifList = document.getElementById('notifList');
  const notifSub = document.getElementById('notifSub');

  const profileForm = document.getElementById('profileForm');
  const profName = document.getElementById('profName');
  const profEmail = document.getElementById('profEmail');
  const profRole = document.getElementById('profRole');
  const profClub = document.getElementById('profClub');
  const profileMsg = document.getElementById('profileMsg');

  if(!authPage || !dashboardPage) return; // section not on this page

  let currentProfile = null;
  let currentEmail = '';
  let materialsFilter = 'all';
  let wantDashboard = true; // remembers whether a signed-in visitor asked to "view website"
  let pendingClub = null; // a club clicked on the public page before signing in
  // 9 levels (Level 1 … Level 9); a student opens the next level by passing the exam of the one before.
  // Behind the scenes each level has an English grade, used only to pitch Coco's lessons and the AI at the right difficulty.
  const LEVEL_ICONS = ['🌱', '🌿', '🍀', '🌳', '🌲', '⛰️', '🏔️', '🚀', '🏆'];
  const LEVEL_CEFR = ['A1', 'A1', 'A2', 'A2', 'B1', 'B1', 'B2', 'B2', 'C1'];
  const LESSON_GROUP = [0, 0, 1, 1, 2, 3, 4, 4, 5]; // which of Coco's 6 lesson groups fits each level
  const GROUP_LEVEL = [1, 3, 5, 6, 7, 9];           // and the first level of each group
  const LEVELS = [], LEVEL_INFO = {};
  LEVEL_ICONS.forEach(function(icon, i){
    LEVELS.push('Level ' + (i + 1));
    LEVEL_INFO['Level ' + (i + 1)] = { n: i + 1, icon: icon, cefr: LEVEL_CEFR[i], lessons: LESSON_GROUP[i] };
  });
  // names used before the 9 levels (old rows are moved by schema.sql; this keeps old links readable)
  const OLD_LEVEL = { 'Beginner (A1-A2)': 'Level 1', 'Intermediate (B1-B2)': 'Level 5', 'Advanced (C1-C2)': 'Level 9' };
  function levelName(l){
    const i = LEVEL_INFO[OLD_LEVEL[l] || l];
    return i ? t('Level ' + i.n, 'المستوى ' + i.n) : (l || '');
  }
  window.__levelLabel = levelName;
  function levelNameEn(l){ const i = LEVEL_INFO[OLD_LEVEL[l] || l]; return i ? 'Level ' + i.n : (l || ''); } // certificates are printed in English
  // what the AI is told: the level and the English grade it stands for
  function levelForAi(l){ const i = LEVEL_INFO[l]; return i ? 'Level ' + i.n + ' of 9 (about CEFR ' + i.cefr + ')' : 'Level 1 of 9 (about CEFR A1)'; }
  // "Level 1–2": the levels a group of Coco's lessons is for
  function groupLabel(g){
    const ns = LESSON_GROUP.map(function(x, i){ return x === g ? i + 1 : 0; }).filter(Boolean);
    const r = ns[0] + (ns.length > 1 ? '–' + ns[ns.length - 1] : '');
    return t('Level ' + r, 'المستوى ' + r);
  }
  // every level picker (upload, videos) lists the 9 levels; the book upload can also be for every level
  function levelOptionsHtml(any){
    return (any ? '<option value="">' + esc(t('All levels', 'كل المستويات')) + '</option>' : '') + LEVELS.map(function(l){
      return '<option value="' + l + '">' + esc(levelName(l)) + '</option>';
    }).join('');
  }
  function fillLevelPickers(){
    document.querySelectorAll('select[data-levels]').forEach(function(sel){
      const v = sel.value;
      sel.innerHTML = levelOptionsHtml(sel.hasAttribute('data-any-level'));
      if(v && LEVEL_INFO[v]) sel.value = v;
    });
    const home = document.getElementById('homeLevels');
    if(home) home.innerHTML = LEVELS.map(function(l){
      const i = LEVEL_INFO[l];
      return '<div class="lv-stage"><span class="lv-ico">' + i.icon + '</span><b>' + esc(levelName(l)) + '</b></div>';
    }).join('');
    const tabs = document.getElementById('levelTabs');
    if(tabs) tabs.innerHTML = LEVELS.map(function(l){
      return '<button class="level-tab" data-level="' + l + '" type="button"><span class="lv-dot"></span>' + LEVEL_INFO[l].n + '</button>';
    }).join('');
  }
  let currentLevel = LEVELS[0];
  let passedLevels = []; // levels the signed-in student has already passed, in their club
  let currentExamQuestions = [];

  function isTeacher(){ return !!currentProfile && (currentProfile.role === 'teacher' || currentProfile.role === 'admin'); }
  function isAdmin(){ return !!currentProfile && currentProfile.role === 'admin'; }
  function isParent(){ return !!currentProfile && currentProfile.role === 'parent'; }
  function isStudent(){ return !!currentProfile && !isTeacher() && !isParent(); }
  function roleName(role){
    return ({ admin: t('Admin', 'مدير'), teacher: t('Teacher', 'معلم'), parent: t('Parent', 'ولي أمر'), student: t('Student', 'طالب') })[role] || role;
  }
  let recoveryMode = false; // true while the visitor is choosing a new password from a reset link

  // ---------- full-page auth screen ----------
  const forgotForm = document.getElementById('forgotForm');
  const resetForm = document.getElementById('resetForm');
  function showAuthForm(mode){
    loginForm.hidden = mode !== 'login';
    signupForm.hidden = mode !== 'signup';
    forgotForm.hidden = mode !== 'forgot';
    resetForm.hidden = mode !== 'reset';
    document.querySelector('.auth-tabs').hidden = mode === 'forgot' || mode === 'reset';
    authTabButtons.forEach(function(b){ b.classList.toggle('active', b.dataset.tab === mode); });
    authPageTitle.textContent = ({ login: t('Welcome back', 'مرحباً بعودتك'), signup: t('Create your account', 'أنشئ حسابك'),
      forgot: t('Reset your password', 'استعادة كلمة المرور'), reset: t('Choose a new password', 'اختر كلمة مرور جديدة') })[mode];
    authPageSub.textContent = ({ login: t('Sign in to reach your dashboard.', 'سجّل الدخول للوصول إلى لوحة التحكم.'),
      signup: t('Join as a student, a parent or a teacher — it takes a minute.', 'انضم كطالب أو ولي أمر أو معلم — الأمر يستغرق دقيقة.'),
      forgot: t('The academy will set a new one for you.', 'الأكاديمية هتعملك كلمة مرور جديدة.'),
      reset: t('Almost done — pick a password you’ll remember.', 'خطوة أخيرة — اختر كلمة مرور تتذكرها.') })[mode];
  }
  function openAuth(mode){
    authPage.hidden = false;
    document.body.style.overflow = 'hidden';
    showAuthForm(mode || 'login');
  }
  function closeAuth(){
    authPage.hidden = true;
    document.body.style.overflow = '';
  }

  document.getElementById('navSignInBtn') && document.getElementById('navSignInBtn').addEventListener('click', ()=> currentProfile ? openDashboard() : openAuth('login'));
  document.getElementById('navSignInBtnMobile') && document.getElementById('navSignInBtnMobile').addEventListener('click', ()=> currentProfile ? openDashboard() : openAuth('login'));
  document.getElementById('openAuthBtnTeaser') && document.getElementById('openAuthBtnTeaser').addEventListener('click', ()=> currentProfile ? openDashboard() : openAuth('login'));
  document.getElementById('mcSignIn') && document.getElementById('mcSignIn').addEventListener('click', ()=> currentProfile ? openDashboard() : openAuth('login'));
  document.getElementById('sessSignInBtn') && document.getElementById('sessSignInBtn').addEventListener('click', ()=> currentProfile ? (openDashboard(), showDashView('sessions')) : openAuth('login'));
  document.getElementById('sessSignupBtn') && document.getElementById('sessSignupBtn').addEventListener('click', ()=> openAuth('signup'));
  document.getElementById('openSignupBtnTeaser') && document.getElementById('openSignupBtnTeaser').addEventListener('click', ()=> openAuth('signup'));
  authBackLink.addEventListener('click', closeAuth);

  authTabButtons.forEach(function(tab){
    tab.addEventListener('click', function(){ showAuthForm(tab.dataset.tab); });
  });

  suRole.addEventListener('change', ()=>{
    suClubWrap.hidden = suRole.value !== 'student';
    document.getElementById('suTeacherHint').hidden = suRole.value !== 'teacher';
  });
  document.querySelectorAll('.role-opt').forEach(function(btn){
    btn.addEventListener('click', function(){
      document.querySelectorAll('.role-opt').forEach(function(x){
        x.classList.toggle('active', x === btn);
        x.setAttribute('aria-checked', x === btn ? 'true' : 'false');
      });
      suRole.value = btn.dataset.role;
      suRole.dispatchEvent(new Event('change'));
    });
  });

  // ---------- forgot / reset password ----------
  // accounts have no email, so a forgotten password goes through the academy: the admin sets a new one
  document.getElementById('forgotLink').addEventListener('click', function(){
    const ph = normPhone(document.getElementById('loginEmail').value);
    document.getElementById('forgotWa').href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(
      t('Hello! I forgot my Code Cademy password. My phone number: ', 'السلام عليكم، نسيت كلمة المرور في Code Cademy. رقمي: ') + (ph ? '+' + ph : ''));
    showAuthForm('forgot');
  });
  document.getElementById('forgotBack').addEventListener('click', function(){ showAuthForm('login'); });
  forgotForm.addEventListener('submit', function(e){ e.preventDefault(); });
  resetForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const msg = document.getElementById('resetMsg');
    const p1 = document.getElementById('resetPassword').value, p2 = document.getElementById('resetPassword2').value;
    msg.style.color = '';
    if(p1 !== p2){ msg.textContent = t('The two passwords don’t match.', 'كلمتا المرور غير متطابقتين.'); return; }
    const { error } = await sb.auth.updateUser({ password: p1 });
    if(error){ msg.textContent = friendlyErrorMessage(error); return; }
    recoveryMode = false;
    resetForm.reset();
    closeAuth();
    toast('✅ ' + t('Password changed', 'تم تغيير كلمة المرور'), t('You are signed in with your new password.', 'تم تسجيل دخولك بكلمة المرور الجديدة.'));
    if(location.hash.indexOf('type=recovery') !== -1) history.replaceState(null, '', location.pathname);
    wantDashboard = true;
    await refreshSession();
  });

  // "Failed to fetch" from supabase-js almost always means the page can't reach
  // the network at all — usually because it was opened as a local file
  // (file://...) instead of through a real web address. Browsers block that kind
  // of cross-origin request for security. This turns the raw browser message
  // into something that actually tells the person what to do about it.
  function friendlyErrorMessage(err){
    const msg = (err && err.message) || String(err || '');
    if(/failed to fetch|networkerror|load failed/i.test(msg)){
      return "Can't reach the server. If you opened this page by double-clicking the file on your computer, that won't work — please host it on a real web address (e.g. Netlify, GitHub Pages, or any web server) and open it from there. If it's already hosted, check your internet connection and make sure the Supabase project isn't paused (Supabase dashboard → look for a \"Restore project\" button).";
    }
    if(/active plan to book/i.test(msg)){
      return t('You need an active plan to book a seat — choose a plan first.', 'تحتاج خطة مفعّلة لحجز مقعد — اختر خطة أولاً.');
    }
    if(/session is full/i.test(msg)){ return t('This session is full — pick another time.', 'هذه الحصة ممتلئة — اختر موعداً آخر.'); }
    if(/already started/i.test(msg)){ return t('This session has already started.', 'هذه الحصة بدأت بالفعل.'); }
    if(/no classes left/i.test(msg)){ return t('No classes left in your plan — renew your plan to book more.', 'لا توجد حصص متبقية في خطتك — جدّد خطتك لحجز المزيد.'); }
    if(/already have a class booked/i.test(msg)){ return t('You already have a class at this time — pick another time.', 'لديك حصة أخرى في نفس الوقت — اختر موعداً آخر.'); }
    if(/invalid login credentials/i.test(msg)){
      return t('Wrong phone number or password. Try again, or use “Forgot your password?”.', 'رقم الهاتف أو كلمة المرور غير صحيحة. حاول مرة أخرى أو استخدم «نسيت كلمة المرور؟».');
    }
    if(/email not confirmed/i.test(msg)){
      return t('Please confirm your email first — open the link we sent you, then sign in.', 'من فضلك أكّد بريدك أولاً — افتح الرابط الذي أرسلناه لك ثم سجّل الدخول.');
    }
    if(/already has an account/i.test(msg)){
      return t('This phone number already has an account — sign in instead.', 'رقم الهاتف ده عليه حساب بالفعل — سجّل الدخول.');
    }
    if(/valid phone number/i.test(msg)){ return t('Please enter a valid phone number, e.g. 05xxxxxxxx or 01xxxxxxxxx.', 'اكتب رقم هاتف صحيح، مثلاً 05xxxxxxxx أو 01xxxxxxxxx.'); }
    if(/at least 6 characters/i.test(msg)){ return t('The password needs at least 6 characters.', 'كلمة المرور لازم تكون ٦ حروف أو أرقام على الأقل.'); }
    if(/user already registered|already been registered/i.test(msg)){
      return t('This email already has an account — sign in instead, or reset your password.', 'هذا البريد مسجّل بالفعل — سجّل الدخول أو استعد كلمة المرور.');
    }
    if(/rate limit|too many/i.test(msg)){
      return t('Too many attempts — please wait a minute and try again.', 'محاولات كثيرة — انتظر دقيقة ثم حاول مرة أخرى.');
    }
    if(/invalid key/i.test(msg)){
      return t('The file name has characters storage can\'t accept. Please refresh the page (Ctrl+F5) so the latest version of the site loads, then try again.',
               'اسم الملف يحتوي على رموز لا يقبلها التخزين. حدّث الصفحة (Ctrl+F5) لتحميل أحدث نسخة من الموقع ثم حاول مرة أخرى.');
    }
    if(/bucket not found/i.test(msg)){
      return t('A storage bucket is missing — run the latest supabase/schema.sql in the Supabase SQL editor.',
               'أحد مخازن الملفات غير موجود — شغّل أحدث ملف supabase/schema.sql في محرر SQL في Supabase.');
    }
    if(/row-level security|violates.*policy|unauthorized|not allowed/i.test(msg)){
      return t('Your account isn\'t allowed to do this. Uploading needs a teacher account (and supabase/schema.sql installed).',
               'حسابك غير مسموح له بهذا الإجراء. الرفع يحتاج حساب معلم (مع تثبيت ملف supabase/schema.sql).');
    }
    if(/payload too large|maximum allowed size|exceeded/i.test(msg)){
      return t('The file is too big — the limit is 50 MB.', 'الملف كبير جداً — الحد الأقصى 50 ميجابايت.');
    }
    return msg;
  }

  loginForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const ident = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    const errEl = document.getElementById('loginError');
    errEl.textContent = '';
    let email = ident, result;
    try{
      if(ident.indexOf('@') === -1){
        // a phone number: the database checks the password and only then returns the account's email
        const { data, error } = await sb.rpc('phone_login_email', { p_phone: normPhone(ident) || ident, p_password: password });
        if(error){ errEl.textContent = friendlyErrorMessage(error); return; }
        if(!data){ errEl.textContent = t('Wrong phone number or password. Try again, or use “Forgot your password?”.', 'رقم الهاتف أو كلمة المرور غير صحيحة. حاول مرة أخرى أو استخدم «نسيت كلمة المرور؟».'); return; }
        email = data;
      }
      result = await sb.auth.signInWithPassword({ email, password });
    } catch(err){
      errEl.textContent = friendlyErrorMessage(err);
      return;
    }
    if(result.error){ errEl.textContent = friendlyErrorMessage(result.error); return; }
    loginForm.reset();
    wantDashboard = true;
    closeAuth();
    await refreshSession();
  });

  // phone numbers are kept as digits only; a local Saudi/Egyptian number gets its country code
  function normPhone(v){
    let d = String(v || '').replace(/\D/g, '');
    if(!d) return '';
    if(d.indexOf('00') === 0) d = d.slice(2);
    if(/^05\d{8}$/.test(d)) d = '966' + d.slice(1);       // Saudi mobile 05xxxxxxxx
    else if(/^01\d{9}$/.test(d)) d = '20' + d.slice(1);   // Egyptian mobile 01xxxxxxxxx
    return d.length >= 8 ? d : '';
  }
  signupForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const full_name = document.getElementById('suName').value.trim();
    const phone = normPhone(document.getElementById('suPhone').value);
    const password = document.getElementById('suPassword').value;
    // a teacher signs up as an applicant: a student account with teacher_request until the admin approves
    const asked = suRole.value === 'parent' ? 'parent' : suRole.value === 'teacher' ? 'teacher' : 'student';
    const role = asked === 'parent' ? 'parent' : 'student';
    const club = asked === 'student' ? document.getElementById('suClub').value : null;
    const errEl = document.getElementById('signupError');
    errEl.textContent = '';

    if(!phone){ errEl.textContent = friendlyErrorMessage('valid phone number'); return; }
    // the database creates the account for the phone number (no email) and it is ready at once
    try{
      const { data: email, error } = await sb.rpc('phone_signup', { p_phone: phone, p_password: password, p_full_name: full_name, p_role: asked, p_club: club });
      if(error){ errEl.textContent = friendlyErrorMessage(error); return; }
      const res = await sb.auth.signInWithPassword({ email: email, password: password });
      if(res.error){ errEl.textContent = friendlyErrorMessage(res.error); return; }
    } catch(err){
      errEl.textContent = friendlyErrorMessage(err);
      return;
    }
    signupForm.reset();
    wantDashboard = true;
    closeAuth();
    await refreshSession();
  });

  dashSignOutBtn.addEventListener('click', async function(){
    await sb.auth.signOut();
    dashboardPage.hidden = true;
    await refreshSession();
  });

  // ---------- dashboard shell ----------
  function openDashboard(){
    wantDashboard = true;
    authPage.hidden = true;
    dashboardPage.hidden = false;
    document.body.style.overflow = '';
  }
  backToSiteBtn.addEventListener('click', function(){
    wantDashboard = false;
    dashboardPage.hidden = true;
  });

  function showDashView(view){
    dashTabs.forEach(t=>t.classList.toggle('active', t.dataset.view === view));
    dashViews.forEach(v=>{ v.hidden = v.dataset.view !== view; });
    if(view === 'students') loadStudentsForProgress();
    if(view === 'notifications') loadNotifications();
    if(view === 'sessions') loadSessions();
    if(view === 'videos'){ loadMyVideos(); loadInstagramStatus(); }
    if(view === 'homework') loadHomework();
    if(view === 'messages') loadInbox();
    if(view === 'users') loadUsers();
    if(view === 'certdesign') openCertDesigner();
    if(view === 'children') loadChildren();
    if(view === 'myplan') loadMyPlan();
    if(view === 'enroll') loadEnrollments();
    if(view === 'progress' && !isTeacher()) loadCertificates();
    dashboardPage.scrollTop = 0;
  }
  dashTabs.forEach(tab=>{
    tab.addEventListener('click', function(){ showDashView(tab.dataset.view); });
  });

  // ---------- "click a club on the public page → open its materials" ----------
  function applyClubFilter(clubName){
    if(isTeacher()){
      materialsFilter = clubName;
      if(libTabs){
        libTabs.querySelectorAll('.lib-tab').forEach(function(t){
          t.classList.toggle('active', t.dataset.filter === clubName);
        });
      }
      const libClubSelect = document.getElementById('libClub');
      if(libClubSelect) libClubSelect.value = clubName;
    }
    loadMaterials();
  }
  function goToClub(clubName){
    if(!clubName) return;
    if(currentProfile){
      openDashboard();
      showDashView('materials');
      applyClubFilter(clubName);
    } else {
      pendingClub = clubName;
      openAuth('login');
    }
  }
  document.querySelectorAll('.club-card[data-club]').forEach(function(card){
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('click', function(){ goToClub(card.dataset.club); });
    card.addEventListener('keydown', function(e){
      if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); goToClub(card.dataset.club); }
    });
  });

  function setAuthLabels(signedIn){
    ['navSignInBtn', 'mcSignIn'].forEach(function(id){
      const b = document.getElementById(id);
      if(b) b.textContent = signedIn ? 'My Dashboard' : 'Sign in';
    });
  }

  async function loadProfile(userId){
    const { data } = await sb.from('profiles').select('*').eq('id', userId).single();
    return data;
  }

  async function refreshSession(){
    const { data: { session } } = await sb.auth.getSession();
    if(!session){
      currentProfile = null;
      currentEmail = '';
      dashboardPage.hidden = true;
      setAuthLabels(false);
      stopRealtime();
      resetChat(); // never leave the last account's conversation on screen for the next person
      if(window.__cocoReset) window.__cocoReset();
      return;
    }
    if(recoveryMode) return; // finish choosing the new password first

    currentEmail = session.user.email || '';
    setAuthLabels(true);
    const switched = !currentProfile || currentProfile.id !== session.user.id;
    if(currentProfile && currentProfile.id !== session.user.id) resetChat(); // switched accounts
    currentProfile = await loadProfile(session.user.id);
    if(!currentProfile){
      // e.g. "confirm email" was on: build the profile from the sign-up details
      const md = session.user.user_metadata || {};
      if(md.full_name){
        await sb.from('profiles').upsert({
          id: session.user.id, full_name: md.full_name,
          role: md.role === 'parent' ? 'parent' : 'student', club: md.role === 'student' ? (md.club || null) : null,
          teacher_request: md.role === 'teacher'
        }, { onConflict: 'id', ignoreDuplicates: true });
        currentProfile = await loadProfile(session.user.id);
      }
      if(!currentProfile) return; // signup row still being written — onAuthStateChange will fire again
    }

    const role = currentProfile.role === 'admin' || currentProfile.role === 'teacher' || currentProfile.role === 'parent' ? currentProfile.role : 'student';
    const roleLabel = roleName(role);
    dashAvatar.textContent = (currentProfile.full_name || '?').trim().charAt(0).toUpperCase();
    dashName.textContent = currentProfile.full_name;
    dashRoleClub.textContent = roleLabel + (currentProfile.club ? ' · ' + currentProfile.club : '');
    ovName.textContent = (currentProfile.full_name || '').split(' ')[0];
    dashboardPage.dataset.role = role;

    ['overview', 'messages', 'notifications', 'profile'].forEach(function(v){ document.querySelector('.dash-tab[data-view="' + v + '"]').hidden = false; }); // shown again after an applicant signs out
    tabStudents.hidden = !isTeacher();
    document.getElementById('tabCertDesign').hidden = !isTeacher();
    if(tabVideos) tabVideos.hidden = !isTeacher();
    document.getElementById('tabMyPlan').hidden = !isStudent();
    document.getElementById('tabEnroll').hidden = !isTeacher();
    tabProgress.hidden = !isStudent();
    document.getElementById('tabMaterials').hidden = isParent();
    document.getElementById('tabSessions').hidden = isParent();
    document.getElementById('tabHomework').hidden = isParent();
    document.getElementById('tabChildren').hidden = !isParent();
    document.getElementById('tabUsers').hidden = !isAdmin();
    document.querySelector('#tabMaterials span').textContent = isStudent() ? t('My learning', 'تعلّمي') : t('Materials', 'المواد');
    libForm.hidden = !isTeacher();
    libTabs.hidden = !isTeacher();
    notifForm.hidden = !isTeacher();
    if(sessForm) sessForm.hidden = !isTeacher();

    if(isParent()){
      notifSub.textContent = t('Announcements for your children’s clubs.', 'إعلانات نوادي أبنائك.');
      ovSub.textContent = t('Here’s how your children are doing.', 'إليك أحوال أبنائك.');
    } else if(isTeacher()){
      matHeading.textContent = t('Upload & manage books and materials', 'ارفع وأدر الكتب والمواد');
      matSub.textContent = t('Pick a club, attach a file, and every student in that club sees it right away.', 'اختر نادياً، وأرفق ملفاً، وسيراه كل طالب في هذا النادي فوراً.');
      notifSub.textContent = t('Send an announcement to one club or to everyone.', 'أرسل إعلاناً لنادٍ واحد أو للجميع.');
      ovSub.textContent = t('Here’s a quick look at your classes.', 'نظرة سريعة على فصولك.');
    } else {
      matHeading.textContent = t('My learning path', 'مسار تعلّمي');
      matSub.textContent = t('1. Pick your level  ·  2. Read its books  ·  3. Pass the exam to move up', '١. اختر مستواك  ·  ٢. اقرأ كتبه  ·  ٣. انجح في الامتحان لتنتقل للمستوى التالي');
      notifSub.textContent = t('Announcements from your teachers.', 'إعلانات من معلميك.');
      ovSub.textContent = t('Here’s what’s new in ', 'إليك الجديد في ') + (currentProfile.club || t('your club', 'ناديك')) + '.';
    }

    if(switched && window.__cocoReset) window.__cocoReset();
    profName.value = currentProfile.full_name || '';
    document.getElementById('profPhone').value = currentProfile.phone ? '+' + currentProfile.phone : '';
    if(profEmail) profEmail.value = currentEmail;
    profRole.value = roleLabel;
    profClub.value = currentProfile.club || '—';
    document.getElementById('profCodeWrap').hidden = !currentProfile.link_code;
    document.getElementById('profCode').value = currentProfile.link_code || '';
    document.getElementById('ovLinkCard').hidden = !(isStudent() && currentProfile.link_code);
    document.getElementById('ovLinkCode').textContent = currentProfile.link_code || '';

    const applicant = isStudent() && currentProfile.teacher_request;
    document.getElementById('dashboardPage').classList.toggle('applicant', !!applicant);
    if(applicant){
      // waiting for the admin to approve the teacher account: nothing to do yet but wait
      profRole.value = t('Teacher (waiting for approval)', 'معلم (بانتظار الموافقة)');
      dashRoleClub.textContent = profRole.value;
      document.querySelectorAll('.dash-tab').forEach(function(tab){ tab.hidden = ['overview', 'profile'].indexOf(tab.dataset.view) === -1; });
      ovSub.textContent = '';
      ['ovStats', 'ovNextSession', 'ovChildren'].forEach(function(id){ document.getElementById(id).innerHTML = ''; });
      document.getElementById('ovNext').hidden = true;
      document.getElementById('ovLinkCard').hidden = true;
      readingHub.hidden = true;
      if(planBanner) planBanner.innerHTML = '<div class="plan-banner"><div><span class="kick">' + t('Teacher account', 'حساب معلم') + '</span><h4>' +
        t('Waiting for the academy to approve you', 'بانتظار موافقة الأكاديمية') + '</h4><p>' +
        t('The admin has your request. Once approved, sign in again and your teacher tools (books, classes, homework, students) will be here.',
          'طلبك وصل للمدير. بعد الموافقة سجّل الدخول مرة أخرى وستجد أدوات المعلم هنا (الكتب، الحصص، الواجبات، الطلاب).') + '</p></div></div>';
      if(wantDashboard) openDashboard();
      return;
    }

    if(isParent()){
      readingHub.hidden = true;
      if(planBanner) planBanner.innerHTML = '';
      if(ovNextSession) ovNextSession.innerHTML = '';
      await Promise.all([loadOverviewStats(), loadNotifications(), loadChildren()]);
    } else {
      document.getElementById('ovChildren').innerHTML = '';
      await loadPassedLevels();
      if(isStudent()) currentLevel = currentStudentLevel();
      await Promise.all([loadReadingHub(), loadClubBooks()]); // readIds + all club books for the path
      await Promise.all([loadMaterials(), loadOverviewStats(), loadNotifications(), loadSessions()]);
      if(isTeacher()) await loadStudentsForProgress(); else await loadMyProgress();
      await Promise.all([loadPayLinks(), loadMyPlan(), loadCertificates()]);
      if(isTeacher()) loadEnrollments();
    }
    refreshUnread();
    startRealtime();
    renderNextStep();

    if(pendingPlan && isStudent()){ // a plan was picked before signing in — carry on to checkout
      const p = pendingPlan; setPendingPlan(null);
      wantDashboard = false; dashboardPage.hidden = true; authPage.hidden = true; document.body.style.overflow = '';
      const el = document.getElementById('plans'); if(el) el.scrollIntoView();
      openCheckout(p);
      return;
    }

    if(wantDashboard) openDashboard();

    if(pendingClub){
      const club = pendingClub;
      pendingClub = null;
      showDashView('materials');
      applyClubFilter(club);
    }
  }

  if(ovStats) ovStats.addEventListener('click', function(e){
    const b = e.target.closest('[data-goto]');
    if(b && document.querySelector('.dash-tab[data-view="' + b.dataset.goto + '"]:not([hidden])')) showDashView(b.dataset.goto);
  });
  async function loadOverviewStats(){
    if(isParent()){
      ovStats.innerHTML = '';
      return;
    }
    if(isTeacher()){
      const st = await sb.rpc('academy_stats');
      if(!st.error && st.data){
        const s = st.data;
        const tile = function(v, label, view, warn){ return '<button type="button" class="dash-stat' + (warn ? ' warn' : '') + '"' + (view ? ' data-goto="' + view + '"' : '') + '><b>' + v + '</b><span>' + label + '</span></button>'; };
        ovStats.innerHTML =
          tile(s.active_students + ' / ' + s.students, t('Students with an active plan', 'طلاب بخطة مفعّلة'), 'students') +
          tile(s.pending, t('Payments to confirm', 'مدفوعات تنتظر التأكيد'), 'enroll', s.pending > 0) +
          tile('$' + fmtMoney(usd(s.revenue_month)) + ' <small>(' + fmtMoney(s.revenue_month) + ' ' + t('SAR', 'ريال') + ')</small>', t('Plans activated this month', 'اشتراكات هذا الشهر'), 'enroll') +
          tile(s.classes_week, t('Classes in the next 7 days', 'حصص خلال ٧ أيام'), 'sessions') +
          tile(s.attendance_30d == null ? '—' : s.attendance_30d + '%', t('Attendance (30 days)', 'نسبة الحضور (٣٠ يوماً)'), 'sessions') +
          tile(s.to_grade, t('Homework to grade', 'واجبات تنتظر التصحيح'), 'homework', s.to_grade > 0) +
          (isAdmin() && s.teacher_requests ? tile(s.teacher_requests, t('Teacher requests to approve', 'طلبات معلمين تنتظر الموافقة'), 'users', true) : '');
        const follow = (s.expiring || []).map(function(x){ return '<li><b>' + esc(x.name) + '</b> · ' + esc(planName(x.plan)) + ' · ' + t('ends ', 'تنتهي ') + esc(fmtDay(x.ends_at)) + '</li>'; })
          .concat((s.low_credit || []).map(function(x){ return '<li><b>' + esc(x.name) + '</b> · ' + (x.left === 0 ? t('no classes left', 'لا توجد حصص متبقية') : t('1 class left', 'باقي حصة واحدة')) + '</li>'; }));
        if(follow.length) ovStats.insertAdjacentHTML('beforeend', '<div class="follow-up"><b>' + t('Renewals to follow up', 'تجديدات تحتاج متابعة') + '</b><ul>' + follow.join('') + '</ul></div>');
        return;
      }
      const [{ count: studentCount }, { count: matCount }, { count: progCount }] = await Promise.all([
        sb.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
        sb.from('materials').select('id', { count: 'exact', head: true }),
        sb.from('progress').select('id', { count: 'exact', head: true })
      ]);
      ovStats.innerHTML =
        '<div class="dash-stat"><b>' + (studentCount || 0) + '</b><span>Students</span></div>' +
        '<div class="dash-stat"><b>' + (matCount || 0) + '</b><span>Materials uploaded</span></div>' +
        '<div class="dash-stat"><b>' + (progCount || 0) + '</b><span>Progress entries logged</span></div>';
    } else {
      const info = LEVEL_INFO[currentStudentLevel()];
      ovStats.innerHTML =
        '<div class="dash-stat"><b>📚 ' + readIds.size + '</b><span>' + t('Books read', 'كتب قرأتها') + '</span></div>' +
        '<div class="dash-stat"><b>🎓 ' + passedLevels.length + ' / ' + LEVELS.length + '</b><span>' + t('Levels passed', 'مستويات نجحت فيها') + '</span></div>' +
        '<div class="dash-stat"><b>' + info.icon + ' ' + info.n + '</b><span>' + esc(t('Current level · ' + info.en + ' (' + info.cefr + ')', 'مستواك الحالي · ' + info.ar + ' (' + info.cefr + ')')) + '</span></div>';
    }
  }

  // ---------- live Zoom sessions (teacher opens times first, students book seats) ----------
  const sessForm = document.getElementById('sessForm');
  const sessList = document.getElementById('sessList');
  const myBookings = document.getElementById('myBookings');
  const sessListHeading = document.getElementById('sessListHeading');
  const myBookingsHeading = document.getElementById('myBookingsHeading');
  const sessHeading = document.getElementById('sessHeading');
  const sessSub = document.getElementById('sessSub');
  const sessNotice = document.getElementById('sessNotice');
  const sessStartInput = document.getElementById('sessStart');
  const tzName = document.getElementById('tzName');
  const ovNextSession = document.getElementById('ovNextSession');
  const sessView = document.querySelector('.dash-view[data-view="sessions"]');
  const sessPlan = document.getElementById('sessPlan');
  const sessDays = document.getElementById('sessDays');
  let sessDay = null; // the day picked in the student's day strip

  function esc(s){
    return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function safeUrl(u){ return /^https?:\/\//i.test(u || '') ? u : '#'; }
  function uiLocale(){ return document.documentElement.lang === 'ar' ? 'ar-EG' : 'en-US'; }
  function fmtTime(iso){
    return new Date(iso).toLocaleTimeString(uiLocale(), { hour: 'numeric', minute: '2-digit' });
  }
  function fmtRelative(iso){
    const diffMin = Math.round((new Date(iso).getTime() - Date.now()) / 60000);
    const rtf = new Intl.RelativeTimeFormat(document.documentElement.lang === 'ar' ? 'ar' : 'en', { numeric: 'auto' });
    if(Math.abs(diffMin) < 60) return rtf.format(diffMin, 'minute');
    if(Math.abs(diffMin) < 1440) return rtf.format(Math.round(diffMin / 60), 'hour');
    return rtf.format(Math.round(diffMin / 1440), 'day');
  }
  function dateBlock(iso){
    const d = new Date(iso);
    return '<div class="sess-date"><b>' + d.toLocaleDateString(uiLocale(), { day: 'numeric' }) + '</b><span>' +
      d.toLocaleDateString(uiLocale(), { month: 'short' }) + '</span></div>';
  }
  function whenLine(s){
    const d = new Date(s.starts_at);
    return d.toLocaleDateString(uiLocale(), { weekday: 'long' }) + ' · ' + fmtTime(s.starts_at);
  }
  function gcalLink(s, zoom){
    const pad = function(n){ return String(n).padStart(2, '0'); };
    const f = function(d){
      return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' +
        pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + pad(d.getUTCSeconds()) + 'Z';
    };
    const start = new Date(s.starts_at);
    const end = new Date(start.getTime() + s.duration_min * 60000);
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE' +
      '&text=' + encodeURIComponent('Code Cademy · ' + s.club + ' — ' + s.title) +
      '&dates=' + f(start) + '/' + f(end) +
      '&details=' + encodeURIComponent('Join Zoom Meeting: ' + (zoom || ''));
  }
  function setNotice(msg, ok){
    sessNotice.textContent = msg || '';
    sessNotice.classList.toggle('ok', !!ok);
  }
  function sessionsFriendlyError(err){
    const m = (err && err.message) || String(err || '');
    if(/schema cache|does not exist|relation|function .*book_session/i.test(m)){
      return "Zoom Meetings aren't set up in the database yet — run the new SQL block (live Zoom sessions) in the Supabase SQL Editor.";
    }
    return friendlyErrorMessage(err);
  }

  async function loadSessions(){
    if(!currentProfile || !sessList) return;
    const teacher = isTeacher();
    tzName.textContent = Intl.DateTimeFormat().resolvedOptions().timeZone || 'local';
    sessStartInput.min = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16);

    sessHeading.textContent = teacher ? 'Zoom Meetings you host' : 'Zoom Meetings';
    sessSub.textContent = teacher
      ? 'Open times for your students to book. Your Zoom Meeting link stays private until a student books a seat.'
      : 'Book a Zoom Meeting with your teacher.';
    sessListHeading.textContent = teacher ? 'Your upcoming sessions' : 'Open times in your club';
    myBookingsHeading.hidden = teacher;
    myBookings.hidden = teacher;
    if(teacher){ sessPlan.innerHTML = ''; sessDays.hidden = true; }

    // keep sessions that started within the last hour so people can still join a call in progress
    const cutoff = new Date(Date.now() - 60 * 60000).toISOString();
    const { data, error } = await sb.from('sessions').select('*').gte('starts_at', cutoff).order('starts_at', { ascending: true });
    if(error){
      const msg = sessionsFriendlyError(error);
      sessList.innerHTML = '<div class="lib-empty">' + esc(msg) + '</div>';
      myBookings.innerHTML = '';
      ovNextSession.innerHTML = '';
      return;
    }
    let all = data || [];
    if(teacher && currentProfile.role !== 'admin') all = all.filter(function(s){ return s.teacher_id === currentProfile.id; });

    const ids = all.map(function(s){ return s.id; });
    const links = {}, bySession = {}, mine = {}, names = {};
    if(ids.length){
      const [lr, br] = await Promise.all([
        sb.from('session_links').select('session_id, zoom_url').in('session_id', ids),
        sb.from('bookings').select('id, session_id, student_id, attendance').in('session_id', ids)
      ]);
      (lr.data || []).forEach(function(r){ links[r.session_id] = r.zoom_url; });
      (br.data || []).forEach(function(b){
        (bySession[b.session_id] = bySession[b.session_id] || []).push(b);
        if(b.student_id === currentProfile.id) mine[b.session_id] = b.id;
      });
      if(teacher){
        const sids = Array.from(new Set((br.data || []).map(function(b){ return b.student_id; })));
        if(sids.length){
          const { data: ps } = await sb.from('profiles').select('id, full_name').in('id', sids);
          (ps || []).forEach(function(p){ names[p.id] = p.full_name; });
        }
      }
    }

    function seatsHtml(s){
      const pct = Math.min(100, Math.round((s.booked / s.capacity) * 100));
      return '<div class="seat-bar"><i style="width:' + pct + '%"></i></div>';
    }
    function metaHtml(s){
      return esc(s.club) + ' · ' + s.duration_min + ' <span>min</span> · <span class="sess-rel">' + esc(fmtRelative(s.starts_at)) + '</span>';
    }

    if(teacher){
      sessList.innerHTML = all.length ? all.map(function(s){
        const people = (bySession[s.id] || []).map(function(b){
          return '<div class="att-row"><span>' + esc(names[b.student_id] || '—') + '</span><span class="att-btns">' +
            '<button type="button" class="att-btn' + (b.attendance === 'present' ? ' on' : '') + '" data-att="' + b.id + '" data-v="present">Present</button>' +
            '<button type="button" class="att-btn' + (b.attendance === 'absent' ? ' on' : '') + '" data-att="' + b.id + '" data-v="absent">Absent</button></span></div>';
        });
        return '<div class="sess-card">' + dateBlock(s.starts_at) +
          '<div class="sess-info"><h5>' + esc(s.title) + '</h5>' +
          '<div class="meta">' + esc(whenLine(s)) + '</div>' +
          '<div class="meta">' + metaHtml(s) + '</div>' +
          seatsHtml(s) +
          '<div class="meta">' + s.booked + ' / ' + s.capacity + ' <span>booked</span></div>' +
          '<div class="sess-people att">' + (people.length ? people.join('') : '<span>No bookings yet</span>') + '</div></div>' +
          '<div class="sess-actions">' +
          (links[s.id] ? '<a class="sess-btn" href="' + esc(safeUrl(links[s.id])) + '" target="_blank" rel="noopener">Start Zoom Meeting</a>' : '') +
          '<button class="sess-btn ghost" type="button" data-del="' + s.id + '">Delete</button></div></div>';
      }).join('') : '<div class="lib-empty">You have no upcoming sessions — open a time above and your students can book it.</div>';
      myBookings.innerHTML = '';
    } else {
      const now = Date.now();
      // plan status decides whether the Book button books or leads to the plans page
      let planState = 'active';
      const en = await sb.from('enrollments').select('status, ends_at').eq('student_id', currentProfile.id);
      if(!en.error){
        const rows = en.data || [];
        planState = rows.some(function(e){ return e.status === 'active' && (!e.ends_at || new Date(e.ends_at).getTime() > now); })
          ? 'active' : rows.some(function(e){ return e.status === 'pending'; }) ? 'pending' : 'none';
      }
      let left = null;
      if(planState === 'active'){
        const r = await sb.rpc('plan_status');
        if(!r.error && r.data && r.data.total != null) left = r.data.left;
        if(left === 0) planState = 'empty';
      }
      sessPlan.innerHTML = planState === 'empty'
        ? '<div class="sess-plan"><span>🎟️</span><div><b>' + t('No classes left in your plan', 'لا توجد حصص متبقية في خطتك') + '</b><p>' +
          t('Renew your plan to keep booking live classes.', 'جدّد خطتك لتواصل حجز الحصص المباشرة.') + '</p></div>' +
          '<button class="sess-btn" type="button" data-goto-myplan="1">' + t('Renew my plan', 'جدّد خطتي') + '</button></div>'
        : planState === 'active' && left != null
        ? '<div class="sess-plan ok"><span>🎟️</span><div><b>' + t(left + (left === 1 ? ' class left' : ' classes left') + ' in your plan', 'باقي ' + left + ' حصة في خطتك') + '</b></div></div>'
        : planState === 'none'
        ? '<div class="sess-plan"><span>🎟️</span><div><b>' + t('Choose a plan to book live classes', 'اختر خطة لحجز الحصص المباشرة') + '</b><p>' +
          t('You can look at the times now — booking opens as soon as your plan is active.', 'يمكنك رؤية المواعيد الآن — والحجز يُفتح بمجرد تفعيل خطتك.') + '</p></div>' +
          '<button class="sess-btn" type="button" data-goto-myplan="1">' + t('Choose a plan', 'اختر خطة') + '</button></div>'
        : planState === 'pending'
        ? '<div class="sess-plan wait"><span>⏳</span><div><b>' + t('Your plan is waiting for activation', 'خطتك في انتظار التفعيل') + '</b><p>' +
          t('You can book as soon as the academy confirms your payment.', 'يمكنك الحجز بمجرد أن تؤكد الأكاديمية الدفع.') + '</p></div></div>'
        : '';

      const open = all.filter(function(s){ return !mine[s.id] && new Date(s.starts_at).getTime() > now; });
      // a strip of days (today → the last day with an open time, at least a week, at most 30 days)
      const dayKey = function(d){ d = new Date(d); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); };
      const byDay = {};
      open.forEach(function(s){ (byDay[dayKey(s.starts_at)] = byDay[dayKey(s.starts_at)] || []).push(s); });
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const last = open.length ? new Date(open[open.length - 1].starts_at) : today;
      const nDays = Math.min(30, Math.max(7, Math.round((last - today) / 86400000) + 1));
      const days = [];
      for(let k = 0; k < nDays; k++){ const d = new Date(today); d.setDate(today.getDate() + k); days.push(d); }
      if(!sessDay || !byDay[sessDay]){
        const first = days.find(function(d){ return byDay[dayKey(d)]; });
        sessDay = first ? dayKey(first) : dayKey(today);
      }
      sessDays.hidden = !open.length;
      sessDays.innerHTML = days.map(function(d, k){
        const key = dayKey(d), n = (byDay[key] || []).length;
        return '<button type="button" class="day-chip' + (key === sessDay ? ' on' : '') + (n ? '' : ' empty') + '" data-day="' + key + '"' + (n ? '' : ' disabled') + '>' +
          '<small>' + (k === 0 ? t('Today', 'اليوم') : esc(d.toLocaleDateString(uiLocale(), { weekday: 'short' }))) + '</small>' +
          '<b>' + d.getDate() + '</b><i>' + (n ? n + ' ' + t(n === 1 ? 'time' : 'times', 'موعد') : '·') + '</i></button>';
      }).join('');
      const dayList = byDay[sessDay] || [];
      sessList.innerHTML = dayList.length ? dayList.map(function(s){
        const left = s.capacity - s.booked;
        const cancelBy = new Date(new Date(s.starts_at).getTime() - 2 * 3600000);
        const action = left <= 0 ? '<span class="sess-badge">' + t('Full', 'ممتلئة') + '</span>'
          : planState === 'none' ? '<button class="sess-btn ghost" type="button" data-goto-myplan="1">' + t('Choose a plan to book', 'اختر خطة للحجز') + '</button>'
          : planState === 'empty' ? '<button class="sess-btn ghost" type="button" data-goto-myplan="1">' + t('Renew to book', 'جدّد للحجز') + '</button>'
          : planState === 'pending' ? '<span class="sess-badge">' + t('Plan not active yet', 'الخطة لم تُفعّل بعد') + '</span>'
          : '<button class="sess-btn" type="button" data-book="' + s.id + '">' + t('Book', 'احجز') + '</button>';
        return '<div class="sess-card slot" data-slot="' + s.id + '"><div class="slot-time"><b>' + esc(fmtTime(s.starts_at)) + '</b><span>' + s.duration_min + ' ' + t('min', 'دقيقة') + '</span></div>' +
          '<div class="sess-info"><h5>' + esc(s.title) + '</h5>' +
          '<div class="meta"><span class="sess-rel">' + esc(fmtRelative(s.starts_at)) + '</span> · ' +
          (left > 0 ? left + ' ' + t(left === 1 ? 'seat left' : 'seats left', 'مقعد متاح') : t('Full', 'ممتلئة')) + '</div>' + seatsHtml(s) + '</div>' +
          '<div class="sess-actions">' + action + '</div>' +
          '<div class="sess-confirm" hidden><p>' + t('Book', 'حجز') + ' <b>' + esc(s.title) + '</b> — ' + esc(whenLine(s)) + '?<br><small>' +
          t('Free cancellation until ', 'إلغاء مجاني حتى ') + esc(cancelBy.toLocaleString(uiLocale(), { weekday: 'short', hour: 'numeric', minute: '2-digit' })) + '</small></p>' +
          '<button class="sess-btn" type="button" data-confirm="' + s.id + '">' + t('Yes, book my seat', 'نعم، احجز مقعدي') + '</button>' +
          '<button class="sess-btn ghost" type="button" data-unconfirm="1">' + t('Back', 'رجوع') + '</button></div></div>';
      }).join('') : '<div class="lib-empty">' + t('No open times yet — your teacher will add new times soon. You can also ask in Messages.', 'لا توجد مواعيد متاحة الآن — سيضيف المعلم مواعيد جديدة قريباً. يمكنك أيضاً السؤال من الرسائل.') + '</div>';

      const booked = all.filter(function(s){ return mine[s.id]; });
      myBookings.innerHTML = booked.length ? booked.map(function(s){
        const z = links[s.id];
        const st = new Date(s.starts_at).getTime(), end = st + s.duration_min * 60000;
        const live = now >= st - 10 * 60000 && now < end;
        const canCancel = st - now > 2 * 3600000;
        return '<div class="sess-card' + (live ? ' live' : '') + '">' + dateBlock(s.starts_at) +
          '<div class="sess-info"><h5>' + esc(s.title) + (live ? ' <span class="live-dot">' + t('Live now', 'مباشر الآن') + '</span>' : '') + '</h5>' +
          '<div class="meta">' + esc(whenLine(s)) + '</div>' +
          '<div class="meta">' + metaHtml(s) + '</div>' +
          (canCancel ? '' : '<small class="sess-note">' + t("Less than 2 hours to go — if you can't come, message your teacher.", 'باقي أقل من ساعتين — لو لن تحضر، راسل معلمك.') + '</small>') + '</div>' +
          '<div class="sess-actions">' +
          (z ? (live ? '<a class="sess-btn" href="' + esc(safeUrl(z)) + '" target="_blank" rel="noopener">' + t('Join now', 'ادخل الآن') + '</a>'
                     : '<span class="sess-btn ghost wait" title="' + t('The Join button opens 10 minutes before the class', 'زر الدخول يُفتح قبل الحصة بـ 10 دقائق') + '">🔒 ' + t('Join opens 10 min before', 'الدخول قبلها بـ 10 دقائق') + '</span>') : '') +
          '<a class="sess-btn ghost" href="' + esc(gcalLink(s, z)) + '" target="_blank" rel="noopener">' + t('Add to calendar', 'أضف للتقويم') + '</a>' +
          (canCancel ? '<button class="sess-btn ghost" type="button" data-cancel="' + mine[s.id] + '">' + t('Cancel', 'إلغاء') + '</button>' : '') +
          '</div></div>';
      }).join('') : '<div class="lib-empty">' + t('No bookings yet — pick a day above and book a time.', 'لا توجد حجوزات بعد — اختر يوماً من الأعلى واحجز موعداً.') + '</div>';
    }

    // overview card: the next session this person is attending (student) or hosting (teacher)
    const upcoming = all.filter(function(s){
      const endsAt = new Date(s.starts_at).getTime() + s.duration_min * 60000;
      return endsAt > Date.now() && (teacher || mine[s.id]);
    });
    if(upcoming.length){
      const s = upcoming[0];
      const z = links[s.id];
      const live = Date.now() >= new Date(s.starts_at).getTime() - 10 * 60000;
      ovNextSession.innerHTML = '<div class="next-card"><div><span class="kick">Next Zoom Meeting</span>' +
        '<h4>' + esc(s.title) + '</h4><p>' + esc(s.club) + ' · ' + esc(whenLine(s)) + ' · ' + esc(fmtRelative(s.starts_at)) + '</p></div>' +
        (z && (teacher || live) ? '<a class="sess-btn" href="' + esc(safeUrl(z)) + '" target="_blank" rel="noopener">' + (teacher ? 'Start Zoom Meeting' : 'Join Zoom Meeting') + '</a>'
          : '<a class="sess-btn" href="' + esc(gcalLink(s, z)) + '" target="_blank" rel="noopener">' + t('Add to calendar', 'أضف للتقويم') + '</a>') +
        '</div>';
    } else {
      ovNextSession.innerHTML = '<div class="next-card"><div><span class="kick">Zoom Meetings</span>' +
        '<h4>No sessions yet</h4><p>' + (teacher ? 'Open a time so your students can book a seat.' : 'Book your first Zoom Meeting with your teacher.') + '</p></div>' +
        '<button class="sess-btn" type="button" data-goto-sessions="1">' + (teacher ? 'Open a time' : 'See open times') + '</button></div>';
    }
  }

  if(sessView){
    sessView.addEventListener('click', async function(e){
      const bookBtn = e.target.closest('[data-book]');
      const confirmBtn = e.target.closest('[data-confirm]');
      const cancelBtn = e.target.closest('[data-cancel]');
      const delBtn = e.target.closest('[data-del]');
      const dayBtn = e.target.closest('[data-day]');
      if(dayBtn){
        sessDay = dayBtn.dataset.day;
        loadSessions();
      } else if(e.target.closest('[data-goto-myplan]')){
        showDashView('myplan');
      } else if(e.target.closest('[data-unconfirm]')){
        const card = e.target.closest('.slot');
        card.querySelector('.sess-confirm').hidden = true;
        card.querySelector('.sess-actions').hidden = false;
      } else if(bookBtn){
        // one tap shows a short confirmation inside the card
        sessList.querySelectorAll('.slot').forEach(function(c){ c.querySelector('.sess-confirm').hidden = true; c.querySelector('.sess-actions').hidden = false; });
        const card = bookBtn.closest('.slot');
        card.querySelector('.sess-actions').hidden = true;
        card.querySelector('.sess-confirm').hidden = false;
      } else if(confirmBtn){
        confirmBtn.disabled = true;
        setNotice('');
        const { error } = await sb.rpc('book_session', { p_session: confirmBtn.dataset.confirm });
        if(error){ setNotice(sessionsFriendlyError(error)); }
        else {
          setNotice(t('Seat booked ✓ — it is under My bookings. The Join button opens 10 minutes before the class.', 'تم الحجز ✓ — ستجده في حجوزاتي. زر الدخول يُفتح قبل الحصة بـ 10 دقائق.'), true);
          toast('✅ ' + t('Seat booked', 'تم الحجز'), t('See you in class!', 'نراك في الحصة!'));
        }
        await loadSessions();
        if(!error && myBookingsHeading.scrollIntoView) myBookingsHeading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if(cancelBtn){
        if(!confirm(t('Cancel this booking? Your seat goes back to other students.', 'إلغاء هذا الحجز؟ سيعود المقعد لطلاب آخرين.'))) return;
        cancelBtn.disabled = true;
        const { data: gone, error } = await sb.from('bookings').delete().eq('id', cancelBtn.dataset.cancel).select('id');
        setNotice(error ? sessionsFriendlyError(error)
          : (gone && gone.length) ? t('Booking cancelled.', 'تم إلغاء الحجز.')
          : t("Bookings can only be cancelled up to 2 hours before the class — message your teacher instead.", 'لا يمكن إلغاء الحجز قبل الحصة بأقل من ساعتين — راسل معلمك بدلاً من ذلك.'), !error && gone && gone.length);
        await loadSessions();
      } else if(delBtn){
        if(!confirm('Delete this session? Students who booked it will lose their seat.')) return;
        delBtn.disabled = true;
        const { error } = await sb.from('sessions').delete().eq('id', delBtn.dataset.del);
        setNotice(error ? sessionsFriendlyError(error) : 'Session deleted.', !error);
        await loadSessions();
      }
    });
  }

  if(ovNextSession){
    ovNextSession.addEventListener('click', function(e){
      if(e.target.closest('[data-goto-sessions]')) showDashView('sessions');
    });
  }

  if(sessForm){
    sessForm.addEventListener('submit', async function(e){
      e.preventDefault();
      setNotice('');
      const start = new Date(sessStartInput.value);
      if(isNaN(start.getTime()) || start.getTime() < Date.now() + 60000){
        setNotice('Please pick a time in the future.');
        return;
      }
      const zoom = document.getElementById('sessZoom').value.trim();
      if(!/^https?:\/\//i.test(zoom)){
        setNotice('Please paste the full Zoom Meeting link (it starts with https://).');
        return;
      }
      const weeks = parseInt(document.getElementById('sessRepeat').value, 10) || 1;
      const base = {
        club: document.getElementById('sessClub').value,
        title: document.getElementById('sessTitle').value.trim(),
        duration_min: parseInt(document.getElementById('sessDuration').value, 10),
        capacity: parseInt(document.getElementById('sessSeats').value, 10)
      };
      const btn = sessForm.querySelector('[type=submit]');
      btn.disabled = true;
      let made = 0, failed = null;
      for(let w = 0; w < weeks && !failed; w++){
        const when = new Date(start); when.setDate(when.getDate() + 7 * w); // same local time each week, even across DST
        const row = Object.assign({ starts_at: when.toISOString() }, base);
        const { data: s, error } = await sb.from('sessions').insert(row).select().single();
        if(error){ failed = error; break; }
        const { error: linkErr } = await sb.from('session_links').insert({ session_id: s.id, zoom_url: zoom });
        if(linkErr){
          await sb.from('sessions').delete().eq('id', s.id); // don't leave a bookable session with no Zoom Meeting link
          failed = linkErr;
          break;
        }
        made++;
      }
      btn.disabled = false;
      if(failed && !made){ setNotice(sessionsFriendlyError(failed)); return; }
      try{ localStorage.setItem('cc_zoom', zoom); }catch(err){}
      sessForm.reset();
      sessPrefill();
      setNotice(failed
        ? t(made + ' of ' + weeks + ' times opened — ', 'تم فتح ' + made + ' من ' + weeks + ' مواعيد — ') + sessionsFriendlyError(failed)
        : made > 1 ? t(made + ' weekly times opened — students in that club can book them now.', 'تم فتح ' + made + ' مواعيد أسبوعية — يمكن لطلاب النادي حجزها الآن.')
        : t('Time opened — students in that club can book it now.', 'تم فتح الموعد — يمكن لطلاب النادي حجزه الآن.'), !failed);
      await loadSessions();
    });
  }
  // a sensible default: tomorrow at the next full hour, with the teacher's usual Zoom link
  function sessPrefill(){
    if(!sessForm) return;
    const d = new Date(Date.now() + 86400000);
    d.setMinutes(0, 0, 0); d.setHours(d.getHours() + 1);
    sessStartInput.value = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    let z = '';
    try{ z = localStorage.getItem('cc_zoom') || ''; }catch(err){}
    if(z) document.getElementById('sessZoom').value = z;
  }
  sessPrefill();
  // keep times, the Join button and the 2-hour rule current while the page stays open
  setInterval(function(){
    if(currentProfile && sessView && !sessView.hidden && !sessView.querySelector('.sess-confirm:not([hidden])')) loadSessions();
  }, 60000);

  // ---------- video lessons: teachers upload, the public Watch & Learn section shows them ----------
  const vidForm = document.getElementById('vidForm');
  const vidList = document.getElementById('vidList');
  const vidNotice = document.getElementById('vidNotice');
  const vidSubmit = document.getElementById('vidSubmit');
  const tabVideos = document.getElementById('tabVideos');

  function setVidNotice(msg, ok){
    vidNotice.textContent = msg || '';
    vidNotice.classList.toggle('ok', !!ok);
  }
  function fmtDuration(sec){
    if(!sec || !isFinite(sec)) return '';
    return Math.floor(sec / 60) + ':' + String(Math.round(sec % 60)).padStart(2, '0');
  }
  function probeDuration(file){
    return new Promise(function(resolve){
      const v = document.createElement('video');
      const url = URL.createObjectURL(file);
      v.preload = 'metadata';
      v.onloadedmetadata = function(){ resolve(v.duration); URL.revokeObjectURL(url); };
      v.onerror = function(){ resolve(0); URL.revokeObjectURL(url); };
      v.src = url;
    });
  }

  // anyone can read these rows (the public site needs them); they're merged into the lesson library
  function igTitle(caption){
    const line = String(caption || '').split('\n').map(function(x){ return x.replace(/#[^\s#]+/g, '').trim(); }).find(Boolean) || '';
    return line ? (line.length > 60 ? line.slice(0, 57) + '…' : line) : 'Instagram video';
  }
  async function loadRemoteLessons(){
    if(!window.__setRemoteLessons) return;
    // newest Instagram videos first (copied every hour by the GitHub Action), then the teachers' uploads
    const [ig, up] = await Promise.all([
      sb.from('instagram_posts').select('*').order('posted_at', { ascending: false }).limit(24),
      sb.from('lesson_videos').select('*').order('created_at', { ascending: false })
    ]);
    const insta = ig.error ? [] : (ig.data || []).filter(function(r){ return r.media_url; }).map(function(r){
      return {
        id: 'ig' + r.id, remote: true, insta: true, title: igTitle(r.caption), tag: 'Instagram',
        level: r.posted_at ? new Date(r.posted_at).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '',
        dur: '', words: [], src: r.media_url, poster: r.thumbnail_url || '', permalink: r.permalink || ''
      };
    });
    const uploads = up.error ? [] : (up.data || []).map(function(r){
      return {
        id: 'r' + r.id, rid: r.id, remote: true, title: r.title, tag: r.tag,
        level: r.level || 'Level 1', dur: r.duration || '', words: r.words || [],
        src: sb.storage.from('materials').getPublicUrl(r.file_path).data.publicUrl, poster: ''
      };
    });
    if(insta.length || uploads.length) window.__setRemoteLessons(insta.concat(uploads));
  }

  async function loadMyVideos(){
    if(!currentProfile || !vidList) return;
    let q = sb.from('lesson_videos').select('*').order('created_at', { ascending: false });
    if(currentProfile.role !== 'admin') q = q.eq('created_by', currentProfile.id);
    const { data, error } = await q;
    if(error){
      vidList.innerHTML = '<div class="lib-empty">' + esc(/schema cache|does not exist|relation/i.test(error.message)
        ? "Video lessons aren't set up in the database yet — run the new SQL block (lesson videos) in the Supabase SQL Editor."
        : friendlyErrorMessage(error)) + '</div>';
      return;
    }
    vidList.innerHTML = (data && data.length) ? data.map(function(r){
      return '<div class="sess-card"><div class="sess-info"><h5>' + esc(r.title) + '</h5>' +
        '<div class="meta">' + esc(r.tag) + (r.duration ? ' · ' + esc(r.duration) : '') + ' · ' + esc(levelName(r.level)) + '</div>' +
        ((r.words && r.words.length) ? '<div class="sess-people">' + r.words.map(esc).join(', ') + '</div>' : '') + '</div>' +
        '<div class="sess-actions"><button class="sess-btn ghost" type="button" data-vdel="' + r.id + '" data-path="' + esc(r.file_path) + '">Delete</button></div></div>';
    }).join('') : '<div class="lib-empty">You have not added any videos yet.</div>';
  }

  if(vidForm){
    vidForm.addEventListener('submit', async function(e){
      e.preventDefault();
      setVidNotice('');
      const file = document.getElementById('vidFile').files[0];
      if(!file) return;
      if(file.size > 50 * 1024 * 1024){ setVidNotice('This file is over 50 MB — please compress it or choose a shorter video.'); return; }
      vidSubmit.disabled = true;
      const label = vidSubmit.textContent;
      vidSubmit.textContent = 'Uploading…';
      try {
        const duration = fmtDuration(await probeDuration(file));
        const extMatch = file.name.match(/\.[a-zA-Z0-9]+$/);
        const ext = extMatch ? extMatch[0].toLowerCase() : '.mp4';
        const base = (extMatch ? file.name.slice(0, -extMatch[0].length) : file.name)
          .normalize('NFKD').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '_').slice(0, 50) || 'video';
        const path = 'videos/' + Date.now() + '_' + base + ext;
        const { error: upErr } = await sb.storage.from('materials').upload(path, file, { contentType: file.type || 'video/mp4' });
        if(upErr){ setVidNotice(friendlyErrorMessage(upErr)); return; }
        const words = document.getElementById('vidWords').value.split(',').map(function(w){ return w.trim(); }).filter(Boolean);
        const { error: insErr } = await sb.from('lesson_videos').insert({
          title: document.getElementById('vidTitle').value.trim(),
          tag: document.getElementById('vidTag').value,
          level: document.getElementById('vidLevel').value,
          words: words, file_path: path, duration: duration
        });
        if(insErr){
          await sb.storage.from('materials').remove([path]);
          setVidNotice(/schema cache|does not exist|relation/i.test(insErr.message)
            ? "Video lessons aren't set up in the database yet — run the new SQL block (lesson videos) in the Supabase SQL Editor."
            : friendlyErrorMessage(insErr));
          return;
        }
        vidForm.reset();
        setVidNotice('Video added — it is now on the website in Watch & Learn.', true);
        await Promise.all([loadMyVideos(), loadRemoteLessons()]);
      } catch(err){
        setVidNotice(friendlyErrorMessage(err));
      } finally {
        vidSubmit.disabled = false;
        vidSubmit.textContent = label;
      }
    });
    vidList.addEventListener('click', async function(e){
      const btn = e.target.closest('[data-vdel]');
      if(!btn) return;
      if(!confirm('Delete this video from the website?')) return;
      btn.disabled = true;
      await sb.storage.from('materials').remove([btn.dataset.path]);
      const { error } = await sb.from('lesson_videos').delete().eq('id', btn.dataset.vdel);
      setVidNotice(error ? friendlyErrorMessage(error) : 'Video deleted.', !error);
      await Promise.all([loadMyVideos(), loadRemoteLessons()]);
    });
  }

  // =====================================================================
  // v6: plans & checkout, enrollments, homework, messages, certificates,
  //     parent report, attendance, free level test
  // =====================================================================
  const WA_NUMBER = '966538840330';
  const PLANS = {
    lesson:    { name: 'Single lesson', amount: 25,   desc: 'One live lesson with a teacher' },
    level1:    { name: '1 Level',       amount: 300,  desc: 'One full level of the program' },
    level2:    { name: '2 Levels',      amount: 500,  desc: 'Two levels' },
    level3:    { name: '3 Levels',      amount: 800,  desc: 'Three levels of the program' },
    immersion: { name: 'Language Immersion Program', amount: 1500, desc: '18 months of learning English by living it' }
  };
  const PLAN_ORDER = ['lesson', 'level1', 'level2', 'level3', 'immersion'];
  const STATUS_LABEL = { pending: 'Waiting for payment', active: 'Active', stopped: 'Stopped', rejected: 'Rejected' };
  let payLinks = {};            // { plan: { tamara: url, visa: url } } — pasted by the teacher in the dashboard
  let myEnrollments = [];
  let pendingPlan = null;
  try { pendingPlan = sessionStorage.getItem('cc_plan') || null; } catch(e){}
  function setPendingPlan(p){
    pendingPlan = p;
    try { if(p) sessionStorage.setItem('cc_plan', p); else sessionStorage.removeItem('cc_plan'); } catch(e){}
  }
  function planName(p){ return (PLANS[p] && PLANS[p].name) || p; }
  function fmtMoney(n){ return Number(n).toLocaleString('en-US'); }
  // prices are kept in riyals (what the payment links charge); visitors see dollars with riyals beside them
  const SAR_PER_USD = 3.75;
  function usd(sar){ return Math.round(Number(sar) / SAR_PER_USD); }
  function fmtPrice(sar){ return '$' + fmtMoney(usd(sar)) + ' (' + fmtMoney(sar) + ' ' + t('SAR', 'ريال') + ')'; }
  function fmtDay(iso){ return iso ? new Date(iso).toLocaleDateString(uiLocale(), { day: 'numeric', month: 'short', year: 'numeric' }) : ''; }
  function waLink(text){ return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(text); }
  function isActiveEnrollment(e){ return e.status === 'active' && (!e.ends_at || new Date(e.ends_at) > new Date()); }

  // home page Zoom card: the real open times (no links) when teachers have opened any; the example stays otherwise
  let publicSessions = [];
  async function loadPublicSessions(){
    const { data, error } = await sb.rpc('public_open_sessions', { p_limit: 3 });
    if(!error) publicSessions = data || [];
    renderPublicSessions();
  }
  function renderPublicSessions(){
    const box = document.getElementById('sessMock');
    if(!box) return;
    let live = box.querySelector('.mock-live');
    if(!publicSessions.length){ if(live) live.remove(); document.getElementById('sessMockDemo').hidden = false; return; }
    document.getElementById('sessMockDemo').hidden = true;
    box.removeAttribute('aria-hidden');
    box.querySelector('.sess-mock-head b').textContent = t('Next open times', 'أقرب المواعيد المتاحة');
    box.querySelector('.sess-mock-head span').textContent = t('Live', 'مباشر');
    box.querySelector('.sess-mock-head span').classList.add('live');
    box.querySelector('.sess-mock-sub').textContent = t('Real times your teachers opened · in your time zone', 'مواعيد حقيقية فتحها المعلمون · بتوقيتك المحلي');
    if(!live){ live = document.createElement('div'); live.className = 'mock-live'; box.appendChild(live); }
    live.innerHTML = publicSessions.map(function(s){
      const d = new Date(s.starts_at), left = Number(s.seats_left);
      return '<div class="mock-slot' + (left <= 0 ? ' booked' : '') + '"><div class="md"><b>' + esc(d.toLocaleDateString(uiLocale(), { weekday: 'short' })) + '</b><span>' + esc(fmtTime(s.starts_at)) + '</span></div>' +
        '<div class="mi"><b>' + esc(s.title) + '</b><span>' + esc(s.club) + ' · ' + s.duration_min + ' ' + t('min', 'دقيقة') + ' · ' +
          (left > 0 ? left + ' ' + t(left === 1 ? 'seat left' : 'seats left', 'مقعد متاح') : t('Full', 'ممتلئة')) + '</span></div>' +
        (left > 0 ? '<button type="button" class="mb" data-mock-book="1">' + t('Book', 'احجز') + '</button>' : '<div class="mb">' + t('Full', 'ممتلئة') + '</div>') + '</div>';
    }).join('');
  }
  document.getElementById('sessMock') && document.getElementById('sessMock').addEventListener('click', function(e){
    if(!e.target.closest('[data-mock-book]')) return;
    if(currentProfile){ openDashboard(); showDashView('sessions'); } else openAuth('login');
  });

  // prices, number of classes and validity come from plan_settings (the admin edits them)
  let planSettings = {};
  function planTerms(p){
    const s = planSettings[p];
    if(!s) return '';
    const months = s.valid_days ? Math.round(s.valid_days / 30) : 0;
    return (s.sessions ? t(s.sessions + (s.sessions === 1 ? ' live class' : ' live classes'), s.sessions + (s.sessions === 1 ? ' حصة مباشرة' : ' حصة مباشرة')) : t('Unlimited live classes', 'حصص مباشرة غير محدودة')) +
      (s.valid_days ? ' · ' + (months >= 1 ? t(months + (months === 1 ? ' month' : ' months'), months + (months === 1 ? ' شهر' : ' شهور')) : t(s.valid_days + ' days', s.valid_days + ' يوماً')) : '');
  }
  async function loadPlanSettings(){
    const { data, error } = await sb.from('plan_settings').select('*');
    if(error || !data || !data.length) return;
    planSettings = {};
    data.forEach(function(r){
      planSettings[r.plan] = r;
      if(PLANS[r.plan]) PLANS[r.plan].amount = Number(r.price);
    });
    // keep the public price cards in step with the database
    document.querySelectorAll('[data-plan]').forEach(function(btn){
      const p = btn.dataset.plan, s = planSettings[p];
      const card = btn.closest('.price-card, .immersion');
      if(!s || !card) return;
      const b = card.querySelector('.pc-price b'), cur = card.querySelector('.pc-price span');
      if(b) b.textContent = '$' + fmtMoney(usd(s.price));
      if(cur) cur.textContent = '(' + fmtMoney(s.price) + ' ' + t('SAR', 'ريال') + ')';
      const per = card.querySelector('.im-per');
      if(per && p === 'immersion') per.textContent = t('about $' + Math.round(usd(s.price) / 18) + ' a month', 'حوالي ' + Math.round(usd(s.price) / 18) + '$ في الشهر');
      // "Save …" compared with buying single levels
      const save = card.querySelector('.pc-save'), one = planSettings.level1;
      const n = { level2: 2, level3: 3 }[p];
      if(save && one && n){
        const diff = n * Number(one.price) - Number(s.price);
        save.hidden = diff <= 0;
        save.textContent = t('Save $' + fmtMoney(usd(diff)), 'وفّر ' + fmtMoney(usd(diff)) + '$');
      }
    });
  }
  window.__refreshPlanTerms = loadPlanSettings;

  async function loadPayLinks(){
    const { data, error } = await sb.from('payment_links').select('*');
    if(error || !data) return;
    payLinks = {};
    data.forEach(function(r){ (payLinks[r.plan] = payLinks[r.plan] || {})[r.method] = r.url; });
  }

  // ---------- checkout ----------
  const coModal = document.getElementById('checkoutModal');
  let coPlan = null;
  function coShow(step){
    document.getElementById('coStep1').hidden = step !== 1;
    document.getElementById('coStep2').hidden = step !== 2;
  }
  function openCheckout(plan){
    if(!PLANS[plan]) return;
    if(!currentProfile){
      setPendingPlan(plan);
      openAuth('signup');
      authPageTitle.textContent = 'Create your account';
      authPageSub.textContent = "Create your account first — then we'll take you straight to checkout.";
      return;
    }
    if(!isStudent()){ alert(t('Plans are for student accounts. Your child can choose a plan from their own account.', 'الخطط لحسابات الطلاب. يمكن لابنك اختيار خطة من حسابه.')); return; }
    coPlan = plan;
    document.getElementById('coPlan').textContent = PLANS[plan].name;
    document.getElementById('coDesc').textContent = PLANS[plan].desc;
    document.getElementById('coAmount').textContent = '$' + fmtMoney(usd(PLANS[plan].amount));
    document.getElementById('coAmountSar').textContent = '(' + fmtMoney(PLANS[plan].amount) + ' ' + t('SAR', 'ريال') + ')';
    document.getElementById('coError').textContent = '';
    document.getElementById('coPay').disabled = false;
    coShow(1);
    coModal.hidden = false;
    document.body.style.overflow = 'hidden';
  }
  function closeCheckout(){
    coModal.hidden = true;
    if(authPage.hidden && dashboardPage.hidden) document.body.style.overflow = '';
  }
  document.getElementById('coClose').addEventListener('click', closeCheckout);
  document.getElementById('coDone').addEventListener('click', closeCheckout);
  coModal.addEventListener('click', function(e){ if(e.target === coModal) closeCheckout(); });

  document.getElementById('coPay').addEventListener('click', async function(){
    const btn = this;
    const err = document.getElementById('coError');
    err.textContent = '';
    const method = (document.querySelector('input[name="coMethod"]:checked') || {}).value || 'tamara';
    if(!document.getElementById('coAgree').checked){
      err.textContent = t('Please accept the terms & refund policy first.', 'من فضلك وافق على الشروط وسياسة الاسترجاع أولاً.');
      return;
    }
    btn.disabled = true;
    const { error } = await sb.rpc('request_enrollment', { p_plan: coPlan, p_method: method });
    if(error){
      btn.disabled = false;
      err.textContent = /function|schema cache|does not exist/i.test(error.message)
        ? "Plans aren't set up in the database yet — the school needs to run the new SQL block."
        : friendlyErrorMessage(error);
      return;
    }
    const link = (payLinks[coPlan] || {})[method];
    const p = PLANS[coPlan];
    const text = 'Hello Code Cademy, I would like to activate: ' + p.name + ' (' + fmtPrice(p.amount) + ') — paying with ' +
      (method === 'tamara' ? 'Tamara' : 'Visa') + '. Name: ' + (currentProfile.full_name || '');
    const payA = document.getElementById('coPayLink');
    payA.hidden = !link;
    if(link) payA.href = safeUrl(link);
    document.getElementById('coWa').href = waLink(text);
    document.getElementById('coMsg').textContent = link
      ? 'Your request is saved. Finish the payment on the secure page — your plan is switched on as soon as your teacher confirms it.'
      : "Your request is saved. We'll send your secure payment link on WhatsApp shortly — your plan is switched on as soon as payment is confirmed.";
    setPendingPlan(null);
    coShow(2);
    await loadMyPlan();
  });

  // every "Choose" button on the public page
  document.querySelectorAll('[data-plan]').forEach(function(b){
    b.addEventListener('click', function(){ openCheckout(b.dataset.plan); });
  });

  // ---------- student: my plan ----------
  const planBanner = document.getElementById('planBanner');
  const myPlanBox = document.getElementById('myPlanBox');
  async function loadMyPlan(){
    if(!currentProfile || !isStudent()){ myEnrollments = []; if(planBanner) planBanner.innerHTML = ''; return; }
    const { data, error } = await sb.from('enrollments').select('*').eq('student_id', currentProfile.id).order('created_at', { ascending: false });
    if(error){
      myEnrollments = [];
      if(planBanner) planBanner.innerHTML = '';
      if(myPlanBox) myPlanBox.innerHTML = '<div class="lib-empty">' + esc(/schema cache|does not exist|relation/i.test(error.message)
        ? "Plans aren't set up in the database yet — run the new SQL block in Supabase." : friendlyErrorMessage(error)) + '</div>';
      return;
    }
    myEnrollments = data || [];
    const active = myEnrollments.find(isActiveEnrollment);
    const pending = myEnrollments.find(function(e){ return e.status === 'pending'; });
    let ps = null;
    if(active){ const r = await sb.rpc('plan_status'); if(!r.error) ps = r.data; }
    const leftTxt = ps && ps.total != null
      ? t(ps.left + ' of ' + ps.total + ' classes left', 'باقي ' + ps.left + ' من ' + ps.total + ' حصة') : '';
    if(planBanner){
      if(active && ps && ps.left === 0){
        planBanner.innerHTML = '<div class="plan-banner"><div><span class="kick">' + t('Your plan', 'خطتك') + '</span><h4>' + esc(planName(active.plan)) +
          '</h4><p>' + t('You have used all your classes. Renew to keep booking.', 'استخدمت كل حصصك. جدّد خطتك لتواصل الحجز.') + '</p></div>' +
          '<button class="sess-btn" type="button" data-browse-plans="1">' + t('Renew my plan', 'جدّد خطتي') + '</button></div>';
      } else if(active){
        const pct = ps && ps.total ? Math.round(ps.left / ps.total * 100) : 100;
        planBanner.innerHTML = '<div class="plan-banner ok"><div><span class="kick">Your plan</span><h4>' + esc(planName(active.plan)) +
          '</h4><p>' + (leftTxt ? '<b>' + esc(leftTxt) + '</b> · ' : '') + t('Active', 'مفعّلة') + (active.ends_at ? ' · ' + t('until ', 'حتى ') + esc(fmtDay(active.ends_at)) : '') + '</p>' +
          (ps && ps.total ? '<div class="credit-bar"><i style="width:' + pct + '%"></i></div>' : '') + '</div>' +
          '<button class="sess-btn" type="button" data-goto-sessions="1">Book a Zoom Meeting</button></div>';
      } else if(pending){
        planBanner.innerHTML = '<div class="plan-banner"><div><span class="kick">Your plan</span><h4>' + esc(planName(pending.plan)) +
          '</h4><p>Waiting for payment confirmation.</p></div><button class="sess-btn" type="button" data-goto-myplan="1">See details</button></div>';
      } else {
        planBanner.innerHTML = '<div class="plan-banner"><div><span class="kick">Your plan</span><h4>No active plan yet</h4>' +
          '<p>Choose a plan to start booking Zoom Meetings with your teacher.</p></div><button class="sess-btn" type="button" data-browse-plans="1">Browse plans</button></div>';
      }
    }
    if(myPlanBox){
      myPlanBox.innerHTML = myEnrollments.length ? myEnrollments.map(function(e){
        const link = (payLinks[e.plan] || {})[e.method];
        const text = 'Hello Code Cademy, about my request: ' + planName(e.plan) + ' (' + fmtPrice(e.amount) + '). Name: ' + (currentProfile.full_name || '');
        return '<div class="sess-card"><div class="sess-info"><h5>' + esc(planName(e.plan)) + '</h5>' +
          '<div class="meta">' + esc(fmtPrice(e.amount)) + ' · ' + (e.method === 'tamara' ? 'Tamara' : e.method === 'visa' ? 'Visa' : 'WhatsApp') + ' · ' + esc(fmtDay(e.created_at)) + '</div>' +
          (e.ends_at ? '<div class="meta"><span>Valid until</span> ' + esc(fmtDay(e.ends_at)) + '</div>' : '') +
          (isActiveEnrollment(e) && leftTxt ? '<div class="meta"><b>' + esc(leftTxt) + '</b></div>' : !isActiveEnrollment(e) && planTerms(e.plan) ? '<div class="meta">' + esc(planTerms(e.plan)) + '</div>' : '') + '</div>' +
          '<div class="sess-actions"><span class="sess-badge ' + (e.status === 'active' ? 'ok' : '') + '">' + esc(STATUS_LABEL[e.status] || e.status) + '</span>' +
          (e.status === 'pending' && link ? '<a class="sess-btn" href="' + esc(safeUrl(link)) + '" target="_blank" rel="noopener">Open the payment page</a>' : '') +
          (e.status === 'pending' ? '<a class="sess-btn ghost" href="' + esc(waLink(text)) + '" target="_blank" rel="noopener">Message us on WhatsApp</a>' : '') +
          '</div></div>';
      }).join('') : '<div class="lib-empty">You have not chosen a plan yet.</div>';
    }
  }
  function goToPlans(){
    wantDashboard = false;
    dashboardPage.hidden = true;
    document.body.style.overflow = '';
    setTimeout(function(){ const el = document.getElementById('plans'); if(el) el.scrollIntoView({ behavior: 'smooth' }); }, 60);
  }
  document.getElementById('browsePlansBtn') && document.getElementById('browsePlansBtn').addEventListener('click', goToPlans);
  if(planBanner){
    planBanner.addEventListener('click', function(e){
      if(e.target.closest('[data-browse-plans]')) goToPlans();
      else if(e.target.closest('[data-goto-sessions]')) showDashView('sessions');
      else if(e.target.closest('[data-goto-myplan]')) showDashView('myplan');
    });
  }

  // ---------- teacher: enrollments + payment links ----------
  const enList = document.getElementById('enList');
  const enNotice = document.getElementById('enNotice');
  const plForm = document.getElementById('plForm');
  function setEnNotice(msg, ok){ enNotice.textContent = msg || ''; enNotice.classList.toggle('ok', !!ok); }

  async function loadEnrollments(){
    if(!isTeacher() || !enList) return;
    const { data, error } = await sb.from('enrollments').select('*').order('created_at', { ascending: false });
    if(error){
      enList.innerHTML = '<div class="lib-empty">' + esc(/schema cache|does not exist|relation/i.test(error.message)
        ? "Plans aren't set up in the database yet — run the new SQL block in Supabase." : friendlyErrorMessage(error)) + '</div>';
      return;
    }
    const ids = Array.from(new Set((data || []).map(function(r){ return r.student_id; })));
    const names = {};
    if(ids.length){
      const { data: ps } = await sb.from('profiles').select('id, full_name, club').in('id', ids);
      (ps || []).forEach(function(p){ names[p.id] = p; });
    }
    enList.innerHTML = (data && data.length) ? data.map(function(r){
      const who = names[r.student_id] || {};
      const act = [];
      if(r.status === 'pending'){
        act.push('<button class="sess-btn" type="button" data-en="active" data-id="' + r.id + '">Activate</button>');
        act.push('<button class="sess-btn ghost" type="button" data-en="rejected" data-id="' + r.id + '">Reject</button>');
      } else if(r.status === 'active'){
        act.push('<button class="sess-btn ghost" type="button" data-en="stopped" data-id="' + r.id + '">Stop</button>');
      } else {
        act.push('<button class="sess-btn" type="button" data-en="active" data-id="' + r.id + '">Activate again</button>');
      }
      return '<div class="sess-card"><div class="sess-info"><h5>' + esc(who.full_name || '—') + '</h5>' +
        '<div class="meta">' + esc(planName(r.plan)) + ' · ' + esc(fmtPrice(r.amount)) + ' · ' + (r.method === 'tamara' ? 'Tamara' : r.method === 'visa' ? 'Visa' : 'WhatsApp') + '</div>' +
        '<div class="meta">' + esc(who.club || '') + ' · ' + esc(fmtDay(r.created_at)) + (r.ends_at ? ' · <span>until</span> ' + esc(fmtDay(r.ends_at)) : '') +
          (r.status === 'active' && r.sessions_total ? ' · ' + r.sessions_total + ' ' + t('classes', 'حصة') : '') + '</div></div>' +
        '<div class="sess-actions"><span class="sess-badge ' + (r.status === 'active' ? 'ok' : '') + '">' + esc(STATUS_LABEL[r.status] || r.status) + '</span>' + act.join('') + '</div></div>';
    }).join('') : '<div class="lib-empty">No one has chosen a plan yet.</div>';

    // plan settings (admin only)
    const psBox = document.getElementById('psBox');
    psBox.hidden = !isAdmin();
    if(isAdmin()){
      await loadPlanSettings();
      document.getElementById('psFields').innerHTML = '<div class="ps-row ps-head"><b>' + t('Plan', 'الخطة') + '</b><span>' + t('Price (SAR)', 'السعر') + '</span><span>' + t('Classes', 'عدد الحصص') + '</span><span>' + t('Valid (days)', 'المدة (أيام)') + '</span></div>' +
        PLAN_ORDER.map(function(p){
          const s = planSettings[p] || {};
          return '<div class="ps-row"><b>' + esc(PLANS[p].name) + '</b>' +
            '<input type="number" min="0" step="1" data-ps="' + p + '|price" value="' + (s.price != null ? s.price : PLANS[p].amount) + '" required>' +
            '<input type="number" min="1" step="1" data-ps="' + p + '|sessions" value="' + (s.sessions != null ? s.sessions : '') + '" placeholder="∞">' +
            '<input type="number" min="1" step="1" data-ps="' + p + '|valid_days" value="' + (s.valid_days != null ? s.valid_days : '') + '" placeholder="∞"></div>';
        }).join('');
    }

    // payment link form
    const fields = document.getElementById('plFields');
    if(fields && !fields.dataset.ready){
      fields.dataset.ready = '1';
      fields.innerHTML = PLAN_ORDER.map(function(p){
        return '<div class="pl-row"><b>' + esc(PLANS[p].name) + '</b>' +
          '<input type="url" data-pl="' + p + '|tamara" placeholder="Tamara link — https://…">' +
          '<input type="url" data-pl="' + p + '|visa" placeholder="Visa link — https://…"></div>';
      }).join('');
    }
    await loadPayLinks();
    document.querySelectorAll('[data-pl]').forEach(function(inp){
      const k = inp.dataset.pl.split('|');
      inp.value = (payLinks[k[0]] || {})[k[1]] || '';
    });
  }

  if(enList){
    enList.addEventListener('click', async function(e){
      const b = e.target.closest('[data-en]');
      if(!b) return;
      b.disabled = true;
      setEnNotice('');
      const st = b.dataset.en;
      const patch = { status: st };
      // switching a plan on: the server fills in its classes and end date from the plan settings
      const { error } = await sb.from('enrollments').update(patch).eq('id', b.dataset.id);
      setEnNotice(error ? friendlyErrorMessage(error) : (st === 'active' ? 'Plan switched on.' : st === 'stopped' ? 'Plan stopped.' : 'Request rejected.'), !error);
      await loadEnrollments();
    });
  }
  const psForm = document.getElementById('psForm');
  if(psForm){
    psForm.addEventListener('submit', async function(e){
      e.preventDefault();
      setEnNotice('');
      const rows = {};
      psForm.querySelectorAll('[data-ps]').forEach(function(inp){
        const k = inp.dataset.ps.split('|');
        rows[k[0]] = rows[k[0]] || { plan: k[0], updated_at: new Date().toISOString() };
        rows[k[0]][k[1]] = inp.value === '' ? null : Number(inp.value);
      });
      const { error } = await sb.from('plan_settings').upsert(Object.values(rows));
      setEnNotice(error ? friendlyErrorMessage(error) : t('Plans saved — the website shows the new prices now.', 'تم حفظ الخطط — الموقع يعرض الأسعار الجديدة الآن.'), !error);
      if(!error) await loadPlanSettings();
    });
  }
  if(plForm){
    plForm.addEventListener('submit', async function(e){
      e.preventDefault();
      setEnNotice('');
      const inputs = Array.from(plForm.querySelectorAll('[data-pl]'));
      for(const inp of inputs){
        const k = inp.dataset.pl.split('|');
        const v = inp.value.trim();
        if(v && !/^https:\/\//i.test(v)){ setEnNotice('Each payment link must start with https://'); return; }
      }
      let failed = null;
      for(const inp of inputs){
        const k = inp.dataset.pl.split('|');
        const v = inp.value.trim();
        const had = (payLinks[k[0]] || {})[k[1]];
        if(v){
          const { error } = await sb.from('payment_links').upsert({ plan: k[0], method: k[1], url: v }, { onConflict: 'plan,method' });
          if(error) failed = error;
        } else if(had){
          const { error } = await sb.from('payment_links').delete().eq('plan', k[0]).eq('method', k[1]);
          if(error) failed = error;
        }
      }
      setEnNotice(failed ? friendlyErrorMessage(failed) : 'Payment links saved.', !failed);
      await loadPayLinks();
    });
  }

  // ---------- homework ----------
  const hwForm = document.getElementById('hwForm');
  const hwList = document.getElementById('hwList');
  const hwNotice = document.getElementById('hwNotice');
  const hwView = document.querySelector('.dash-view[data-view="homework"]');
  function setHwNotice(msg, ok){ hwNotice.textContent = msg || ''; hwNotice.classList.toggle('ok', !!ok); }
  function hwError(err){
    return /schema cache|does not exist|relation|bucket not found|attachments/i.test(err.message || '')
      ? t("Homework files aren't set up in the database yet — run supabase/schema.sql again in Supabase.", 'ملفات الواجبات غير مفعّلة في قاعدة البيانات بعد — شغّل ملف supabase/schema.sql مرة أخرى في Supabase.')
      : friendlyErrorMessage(err);
  }
  function dueChip(a, submitted){
    if(!a.due_at) return '';
    const late = new Date(a.due_at).getTime() < Date.now();
    return '<span class="sess-badge ' + (late && !submitted ? '' : 'ok') + '">' + (late && !submitted ? t('Past due', 'انتهى الموعد') : t('Due', 'التسليم')) + ' ' + esc(fmtDay(a.due_at)) + '</span>';
  }

  // files on homework (photos, videos, voice notes, documents) live in the private 'homework' bucket:
  // teacher/...        files a teacher adds to an assignment or to feedback
  // <student id>/...   files a student adds to an answer
  const HW_MAX = 50 * 1024 * 1024;
  const HW_ACCEPT = 'image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt';
  const hwDrafts = {}; // composer key -> { orig: [saved], keep: [saved], add: [File] }
  let hwRec = null;    // the voice note being recorded
  let hwData = { as: [], subs: [] };

  function hwKind(a){
    const type = String(a.type || ''), ext = fileExt(a.name);
    if(/^image\//.test(type) || ['png', 'jpg', 'jpeg', 'webp', 'gif'].indexOf(ext) !== -1) return 'image';
    if(/^audio\//.test(type) || ['mp3', 'm4a', 'ogg', 'wav', 'aac'].indexOf(ext) !== -1) return 'audio';
    if(/^video\//.test(type) || ['mp4', 'mov', 'webm', 'm4v'].indexOf(ext) !== -1) return 'video';
    return 'doc';
  }
  function hwIcon(a){ const k = hwKind(a); return k === 'image' ? '🖼️' : k === 'audio' ? '🎤' : k === 'video' ? '🎬' : fileIcon(fileExt(a.name)); }
  function hwAtt(list){ return Array.isArray(list) ? list : []; }

  function hwComposer(key, saved){
    hwDrafts[key] = { orig: hwAtt(saved).slice(), keep: hwAtt(saved).slice(), add: [] };
    return '<div class="hw-att" data-att="' + key + '"><div class="hw-att-list"></div><div class="hw-att-btns">' +
      '<label class="hw-att-btn"><input type="file" multiple accept="' + HW_ACCEPT + '" data-attin="' + key + '" hidden>📎 <span>' + t('Attach files', 'إرفاق ملفات') + '</span></label>' +
      '<label class="hw-att-btn"><input type="file" accept="image/*" capture="environment" data-attin="' + key + '" hidden>📷 <span>' + t('Take a photo', 'التقاط صورة') + '</span></label>' +
      (window.MediaRecorder && navigator.mediaDevices ? '<button type="button" class="hw-att-btn" data-rec="' + key + '">🎤 <span>' + t('Record voice', 'تسجيل صوتي') + '</span></button>' : '') +
      '</div><small class="hw-att-hint">' + t('Photos, videos, voice notes, PDF or Word · up to 50 MB each', 'صور، فيديو، تسجيل صوتي، PDF أو Word · حتى 50 ميجا للملف') + '</small></div>';
  }
  function hwDrawComposer(key){
    const box = document.querySelector('[data-att="' + key + '"] .hw-att-list'), d = hwDrafts[key];
    if(!box || !d) return;
    const items = d.keep.map(function(a, k){ return { a: a, rm: 'k' + k }; })
      .concat(d.add.map(function(f, k){ return { a: f, rm: 'a' + k, isNew: true }; }));
    box.innerHTML = items.map(function(it){
      return '<span class="hw-chip' + (it.isNew ? ' new' : '') + '">' + hwIcon(it.a) + ' <b>' + esc(it.a.name) + '</b> <small>' + fmtSize(it.a.size) + '</small>' +
        '<button type="button" data-attrm="' + key + '|' + it.rm + '" aria-label="' + t('Remove', 'إزالة') + '">×</button></span>';
    }).join('');
  }
  function hwAddFiles(key, files){
    const d = hwDrafts[key];
    if(!d) return;
    let skipped = 0;
    Array.from(files || []).forEach(function(f){
      if(f.size > HW_MAX){ skipped++; return; }
      d.add.push(f);
    });
    setHwNotice(skipped ? t('A file bigger than 50 MB was skipped — try a shorter video.', 'تم تخطي ملف أكبر من 50 ميجا — جرّب فيديو أقصر.') : '');
    hwDrawComposer(key);
  }
  function hwResetComposer(key){ if(hwDrafts[key]){ hwDrafts[key] = { orig: [], keep: [], add: [] }; hwDrawComposer(key); } }

  async function hwToggleRec(btn){
    if(hwRec){ hwRec.rec.stop(); return; }
    const key = btn.dataset.rec;
    let stream;
    try{ stream = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch(e){ setHwNotice(t('Allow the microphone to record a voice note.', 'اسمح باستخدام الميكروفون لتسجيل رسالة صوتية.')); return; }
    const type = ['audio/webm', 'audio/mp4', 'audio/ogg'].find(function(x){ return MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(x); }) || '';
    const rec = new MediaRecorder(stream, type ? { mimeType: type } : undefined);
    const chunks = [], started = Date.now();
    const label = function(){ return '🎤 <span>' + t('Record voice', 'تسجيل صوتي') + '</span>'; };
    const tick = function(){
      const s = Math.round((Date.now() - started) / 1000);
      btn.innerHTML = '⏹ <span>' + t('Stop', 'إيقاف') + ' ' + Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0') + '</span>';
      if(s >= 300 && rec.state === 'recording') rec.stop(); // 5 minutes is plenty
    };
    const timer = setInterval(tick, 500);
    hwRec = { rec: rec };
    rec.ondataavailable = function(e){ if(e.data && e.data.size) chunks.push(e.data); };
    rec.onstop = function(){
      clearInterval(timer);
      stream.getTracks().forEach(function(tr){ tr.stop(); });
      hwRec = null;
      btn.classList.remove('rec');
      btn.innerHTML = label();
      if(!chunks.length) return;
      const mime = rec.mimeType || type || 'audio/webm';
      const ext = /mp4/.test(mime) ? 'm4a' : /ogg/.test(mime) ? 'ogg' : 'webm';
      const secs = Math.max(1, Math.round((Date.now() - started) / 1000));
      hwAddFiles(key, [new File(chunks, 'voice-note-' + secs + 's.' + ext, { type: mime })]);
    };
    rec.start(1000);
    btn.classList.add('rec');
    tick();
  }

  // phone photos are often 5–10 MB; a 1600px JPEG is plenty for homework and uploads fast
  function hwShrinkImage(f){
    if(!/^image\/(jpeg|png|webp)$/.test(f.type) || f.size < 1.5 * 1048576) return Promise.resolve(f);
    return new Promise(function(resolve){
      const img = new Image(), url = URL.createObjectURL(f);
      img.onload = function(){
        const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function(b){
          resolve(b && b.size < f.size ? new File([b], f.name.replace(/\.[^.]+$/, '') + '.jpg', { type: 'image/jpeg' }) : f);
        }, 'image/jpeg', 0.85);
      };
      img.onerror = function(){ URL.revokeObjectURL(url); resolve(f); };
      img.src = url;
    });
  }
  // uploads the new files of a composer; returns the full attachment list to save
  async function hwUpload(key, folder){
    const d = hwDrafts[key] || { orig: [], keep: [], add: [] };
    const out = d.keep.slice();
    for(let k = 0; k < d.add.length; k++){
      setHwNotice(t('Uploading file ' + (k + 1) + ' of ' + d.add.length + '…', 'جارٍ رفع الملف ' + (k + 1) + ' من ' + d.add.length + '…'), true);
      const f = await hwShrinkImage(d.add[k]);
      const m = String(f.name).match(/\.([A-Za-z0-9]{1,8})$/);
      const path = folder + '/' + Date.now() + '_' + Math.random().toString(36).slice(2, 8) + '_' +
        storageSlug(m ? f.name.slice(0, -m[0].length) : f.name, 'file') + (m ? '.' + m[1].toLowerCase() : '');
      const { error } = await sb.storage.from('homework').upload(path, f, { contentType: f.type || 'application/octet-stream' });
      if(error) throw error;
      out.push({ path: path, name: f.name, size: f.size, type: f.type || '' });
    }
    return out;
  }
  // files the user removed from a saved list are deleted from storage (best effort)
  function hwDropRemoved(key){
    const d = hwDrafts[key];
    if(!d) return;
    const kept = d.keep.map(function(a){ return a.path; });
    const gone = d.orig.map(function(a){ return a.path; }).filter(function(p){ return kept.indexOf(p) === -1; });
    if(gone.length) sb.storage.from('homework').remove(gone);
  }
  function hwHasContent(key){ const d = hwDrafts[key]; return !!d && (d.keep.length + d.add.length) > 0; }

  function hwFileInner(name, size, kind, url){
    if(!url) return '<span class="hw-file-doc">' + hwIcon({ name: name, type: kind + '/' }) + ' <b>' + esc(name) + '</b><small>' + fmtSize(size) + '</small></span>';
    if(kind === 'image') return '<a href="' + esc(url) + '" target="_blank" rel="noopener"><img src="' + esc(url) + '" alt="' + esc(name) + '" loading="lazy"></a>';
    if(kind === 'video') return '<video controls playsinline preload="metadata" src="' + esc(url) + '"></video>';
    if(kind === 'audio') return '<audio controls preload="metadata" src="' + esc(url) + '"></audio>';
    return '<a class="hw-file-doc" href="' + esc(url + '&download=' + encodeURIComponent(name)) + '" target="_blank" rel="noopener">' +
      fileIcon(fileExt(name)) + ' <b>' + esc(name) + '</b><small>' + fmtSize(size) + ' · ' + t('Download', 'تحميل') + '</small></a>';
  }
  function hwFilesView(list){
    list = hwAtt(list);
    if(!list.length) return '';
    return '<div class="hw-files">' + list.map(function(a){
      const kind = hwKind(a);
      return '<div class="hw-file ' + kind + '" data-sign="' + esc(a.path) + '" data-name="' + esc(a.name) + '" data-size="' + (a.size || 0) + '" data-kind="' + kind + '">' +
        hwFileInner(a.name, a.size, kind, null) + '</div>';
    }).join('') + '</div>';
  }
  // private files open through short-lived signed links (one request for the whole page)
  async function hwSignAll(root){
    const els = Array.from(root.querySelectorAll('[data-sign]'));
    if(!els.length) return;
    const paths = Array.from(new Set(els.map(function(el){ return el.dataset.sign; })));
    const { data, error } = await sb.storage.from('homework').createSignedUrls(paths, 3600);
    if(error || !data) return;
    const urls = {};
    data.forEach(function(r){ if(r && r.signedUrl) urls[r.path] = r.signedUrl; });
    els.forEach(function(el){
      const u = urls[el.dataset.sign];
      if(u) el.innerHTML = hwFileInner(el.dataset.name, +el.dataset.size, el.dataset.kind, u);
    });
  }

  function hwStatus(a, s){
    if(s && s.grade != null) return { n: 2, html: '<span class="hw-status done">✓ ' + t('Graded', 'تم التصحيح') + '</span>' };
    if(s) return { n: 1, html: '<span class="hw-status sent">' + t('Submitted', 'تم التسليم') + '</span>' };
    return { n: 0, html: '<span class="hw-status todo">' + t('To do', 'مطلوب') + '</span>' };
  }
  function hwSentLine(a, s){
    const late = a.due_at && new Date(s.created_at).getTime() > new Date(a.due_at).getTime();
    return '<small class="hw-when">' + t('Sent', 'أُرسل') + ' ' + esc(fmtDay(s.updated_at || s.created_at)) + (late ? ' · <b>' + t('late', 'متأخر') + '</b>' : '') + '</small>';
  }

  async function loadHomework(){
    if(!currentProfile || !hwList) return;
    const teacher = isTeacher();
    hwForm.hidden = !teacher;
    if(teacher && !hwDrafts.new) document.getElementById('hwFormAtt').innerHTML = hwComposer('new');
    document.getElementById('hwSub').textContent = teacher
      ? t('Give homework to a club with photos, videos or files, then grade answers with a note or a voice message.', 'أعطِ واجباً للنادي مع صور أو فيديو أو ملفات، ثم صحّح الإجابات بملاحظة أو رسالة صوتية.')
      : t('Answer in writing, with a photo of your notebook, a video or a voice note.', 'أجب كتابةً، أو بصورة من كراستك، أو فيديو، أو تسجيل صوتي.');
    const { data: as, error } = await sb.from('assignments').select('*').order('created_at', { ascending: false });
    if(error){ hwList.innerHTML = '<div class="lib-empty">' + esc(hwError(error)) + '</div>'; return; }
    const list = as || [];
    const ids = list.map(function(a){ return a.id; });
    let subs = [];
    if(ids.length){
      const { data: sd } = await sb.from('submissions').select('*').in('assignment_id', ids).order('created_at', { ascending: true });
      subs = sd || [];
    }
    hwData = { as: list, subs: subs };
    Object.keys(hwDrafts).forEach(function(k){ if(k !== 'new') delete hwDrafts[k]; });
    if(teacher){
      const sids = Array.from(new Set(subs.map(function(s){ return s.student_id; })));
      const names = {};
      if(sids.length){
        const { data: ps } = await sb.from('profiles').select('id, full_name').in('id', sids);
        (ps || []).forEach(function(p){ names[p.id] = p.full_name; });
      }
      hwList.innerHTML = list.length ? list.map(function(a){
        const mine = subs.filter(function(s){ return s.assignment_id === a.id; });
        const waiting = mine.filter(function(s){ return s.grade == null; }).length;
        return '<div class="sess-card hw-card"><div class="sess-info"><h5>' + esc(a.title) + '</h5>' +
          '<div class="meta">' + esc(a.club) + ' · ' + esc(fmtDay(a.created_at)) + '</div>' +
          (a.instructions ? '<div class="hw-text">' + esc(a.instructions) + '</div>' : '') + hwFilesView(a.attachments) +
          '<div class="meta"><b>' + mine.length + '</b> ' + t('answers', 'إجابة') + (waiting ? ' · <b>' + waiting + '</b> ' + t('waiting for a grade', 'بانتظار التصحيح') : '') + '</div></div>' +
          '<div class="sess-actions">' + dueChip(a, false) + '<button class="sess-btn ghost" type="button" data-hwdel="' + a.id + '">' + t('Delete', 'حذف') + '</button></div>' +
          (mine.length ? '<div class="hw-subs">' + mine.map(function(s){
            return '<div class="hw-sub"><div class="hw-sub-head"><b>' + esc(names[s.student_id] || '—') + '</b>' +
              (s.grade != null ? '<span class="sess-badge ok">' + s.grade + ' / 100</span>' : '<span class="sess-badge">' + t('Not graded', 'لم يُصحح') + '</span>') + '</div>' +
              hwSentLine(a, s) +
              (s.answer ? '<p class="hw-answer">' + esc(s.answer) + '</p>' : '') + hwFilesView(s.attachments) +
              '<div class="hw-grade"><input type="number" min="0" max="100" placeholder="' + t('Grade 0–100', 'الدرجة 0–100') + '" value="' + (s.grade != null ? s.grade : '') + '" data-g="' + s.id + '">' +
              '<input type="text" placeholder="' + t('Feedback for the student', 'ملاحظة للطالب') + '" value="' + esc(s.feedback || '') + '" data-f="' + s.id + '"></div>' +
              hwComposer('fb-' + s.id, s.feedback_attachments) +
              '<div class="hw-grade"><button class="sess-btn" type="button" data-grade="' + s.id + '">' + t('Save grade', 'حفظ الدرجة') + '</button></div></div>';
          }).join('') + '</div>' : '') + '</div>';
      }).join('') : '<div class="lib-empty">' + t('No homework yet — give your first assignment above.', 'لا توجد واجبات بعد — أضف أول واجب من الأعلى.') + '</div>';
    } else {
      const rows = list.map(function(a){
        const s = subs.find(function(x){ return x.assignment_id === a.id && x.student_id === currentProfile.id; });
        return { a: a, s: s, st: hwStatus(a, s) };
      }).sort(function(x, y){
        if(x.st.n !== y.st.n) return x.st.n - y.st.n; // to do first, then submitted, then graded
        const dx = x.a.due_at ? new Date(x.a.due_at).getTime() : Infinity, dy = y.a.due_at ? new Date(y.a.due_at).getTime() : Infinity;
        return dx - dy;
      });
      const count = [0, 0, 0];
      rows.forEach(function(r){ count[r.st.n]++; });
      const summary = rows.length ? '<div class="hw-summary"><span class="todo"><b>' + count[0] + '</b> ' + t('to do', 'مطلوب') + '</span>' +
        '<span class="sent"><b>' + count[1] + '</b> ' + t('submitted', 'تم تسليمه') + '</span><span class="done"><b>' + count[2] + '</b> ' + t('graded', 'تم تصحيحه') + '</span></div>' : '';
      hwList.innerHTML = rows.length ? summary + rows.map(function(r){
        const a = r.a, s = r.s;
        let body;
        if(s && s.grade != null){
          body = '<div class="hw-sub"><div class="hw-sub-head"><b>' + t('Your answer', 'إجابتك') + '</b><span class="sess-badge ok">' + s.grade + ' / 100</span></div>' +
            (s.answer ? '<p class="hw-answer">' + esc(s.answer) + '</p>' : '') + hwFilesView(s.attachments) +
            ((s.feedback || hwAtt(s.feedback_attachments).length) ? '<div class="hw-fb"><b>' + t('Teacher', 'المعلم') + ':</b> ' + esc(s.feedback || '') + hwFilesView(s.feedback_attachments) + '</div>' : '') + '</div>';
        } else {
          body = '<div class="hw-sub"><textarea rows="3" data-ans="' + a.id + '" placeholder="' + t('Write your answer here… or just attach a photo, video or voice note.', 'اكتب إجابتك هنا… أو أرفق صورة أو فيديو أو تسجيلاً صوتياً.') + '">' + esc(s ? (s.answer || '') : '') + '</textarea>' +
            hwComposer('ans-' + a.id, s ? s.attachments : []) +
            '<div class="hw-grade"><button class="sess-btn" type="button" data-hwsend="' + a.id + '">' + (s ? t('Update my answer', 'تحديث إجابتي') : t('Submit homework', 'تسليم الواجب')) + '</button>' +
            (s ? hwSentLine(a, s) : '') + '</div></div>';
        }
        return '<div class="sess-card hw-card st-' + r.st.n + '"><div class="sess-info"><h5>' + esc(a.title) + ' ' + r.st.html + '</h5>' +
          '<div class="meta">' + esc(fmtDay(a.created_at)) + '</div>' +
          (a.instructions ? '<div class="hw-text">' + esc(a.instructions) + '</div>' : '') + hwFilesView(a.attachments) + '</div>' +
          '<div class="sess-actions">' + dueChip(a, !!s) + '</div>' + body + '</div>';
      }).join('') : '<div class="lib-empty">' + t('No homework right now. 🎉', 'لا توجد واجبات الآن. 🎉') + '</div>';
    }
    Object.keys(hwDrafts).forEach(hwDrawComposer);
    hwSignAll(hwList);
  }

  if(hwForm){
    hwForm.addEventListener('submit', async function(e){
      e.preventDefault();
      setHwNotice('');
      const btn = hwForm.querySelector('[type=submit]');
      const due = document.getElementById('hwDue').value;
      btn.disabled = true;
      try{
        const files = await hwUpload('new', 'teacher/assignments');
        const row = {
          club: document.getElementById('hwClub').value,
          title: document.getElementById('hwTitle').value.trim(),
          instructions: document.getElementById('hwText').value.trim(),
          due_at: due ? new Date(due + 'T23:59:00').toISOString() : null
        };
        if(files.length) row.attachments = files;
        const { error } = await sb.from('assignments').insert(row);
        if(error) throw error;
        hwForm.reset();
        hwResetComposer('new');
        setHwNotice(t('Homework sent to the club.', 'تم إرسال الواجب للنادي.'), true);
        await loadHomework();
      }catch(err){ setHwNotice(hwError(err)); }
      btn.disabled = false;
    });
  }
  if(hwView){
    hwView.addEventListener('change', function(e){
      const inp = e.target.closest('[data-attin]');
      if(!inp) return;
      hwAddFiles(inp.dataset.attin, inp.files);
      inp.value = '';
    });
    hwView.addEventListener('click', function(e){
      const rm = e.target.closest('[data-attrm]'), rec = e.target.closest('[data-rec]');
      if(rm){
        const parts = rm.dataset.attrm.split('|'), d = hwDrafts[parts[0]];
        if(!d) return;
        const which = parts[1].charAt(0), k = parseInt(parts[1].slice(1), 10);
        (which === 'k' ? d.keep : d.add).splice(k, 1);
        hwDrawComposer(parts[0]);
      } else if(rec){
        hwToggleRec(rec);
      }
    });
  }
  if(hwList){
    hwList.addEventListener('click', async function(e){
      const send = e.target.closest('[data-hwsend]');
      const grade = e.target.closest('[data-grade]');
      const del = e.target.closest('[data-hwdel]');
      if(send){
        const id = send.dataset.hwsend, key = 'ans-' + id;
        const answer = hwList.querySelector('[data-ans="' + id + '"]').value.trim();
        if(!answer && !hwHasContent(key)){ setHwNotice(t('Write an answer or attach a photo, video or voice note first.', 'اكتب إجابة أو أرفق صورة أو فيديو أو تسجيلاً صوتياً أولاً.')); return; }
        send.disabled = true;
        setHwNotice('');
        try{
          const files = await hwUpload(key, currentProfile.id + '/' + storageSlug(String(id), 'hw'));
          const row = { answer: answer || null, attachments: files, updated_at: new Date().toISOString() };
          const existing = hwData.subs.find(function(x){ return String(x.assignment_id) === String(id) && x.student_id === currentProfile.id; });
          const res = existing
            ? await sb.from('submissions').update(row).eq('id', existing.id)
            : await sb.from('submissions').insert(Object.assign({ assignment_id: id, student_id: currentProfile.id }, row));
          if(res.error) throw res.error;
          hwDropRemoved(key);
          setHwNotice(t('Homework sent — your teacher will grade it soon. ✓', 'تم تسليم الواجب — سيصححه معلمك قريباً. ✓'), true);
          await loadHomework();
        }catch(err){ setHwNotice(hwError(err)); send.disabled = false; }
      } else if(grade){
        const id = grade.dataset.grade, key = 'fb-' + id;
        const g = hwList.querySelector('[data-g="' + id + '"]').value;
        const f = hwList.querySelector('[data-f="' + id + '"]').value.trim();
        const n = parseInt(g, 10);
        if(isNaN(n) || n < 0 || n > 100){ setHwNotice(t('Enter a grade between 0 and 100.', 'اكتب درجة من 0 إلى 100.')); return; }
        grade.disabled = true;
        try{
          const s = hwData.subs.find(function(x){ return String(x.id) === String(id); });
          const files = await hwUpload(key, 'teacher/feedback/' + storageSlug(String(s ? s.student_id : id), 'student'));
          const { error } = await sb.from('submissions').update({ grade: n, feedback: f || null, feedback_attachments: files, graded_at: new Date().toISOString() }).eq('id', id);
          if(error) throw error;
          hwDropRemoved(key);
          setHwNotice(t('Grade saved.', 'تم حفظ الدرجة.'), true);
          await loadHomework();
        }catch(err){ setHwNotice(hwError(err)); grade.disabled = false; }
      } else if(del){
        if(!confirm(t('Delete this homework and all its answers?', 'حذف هذا الواجب وكل إجاباته؟'))) return;
        del.disabled = true;
        const id = del.dataset.hwdel;
        const a = hwData.as.find(function(x){ return String(x.id) === String(id); });
        const paths = hwAtt(a && a.attachments).map(function(x){ return x.path; });
        hwData.subs.filter(function(s){ return String(s.assignment_id) === String(id); }).forEach(function(s){
          hwAtt(s.attachments).concat(hwAtt(s.feedback_attachments)).forEach(function(x){ paths.push(x.path); });
        });
        const { error } = await sb.from('assignments').delete().eq('id', id);
        if(!error && paths.length) sb.storage.from('homework').remove(paths);
        setHwNotice(error ? hwError(error) : t('Homework deleted.', 'تم حذف الواجب.'), !error);
        await loadHomework();
      }
    });
  }

  // ---------- shared helpers for the new views ----------
  function initials(name){
    return String(name || '?').trim().split(/\s+/).slice(0, 2).map(function(w){ return w.charAt(0); }).join('').toUpperCase() || '?';
  }
  function hueOf(str){
    let h = 0; String(str || '').split('').forEach(function(c){ h = (h * 31 + c.charCodeAt(0)) % 360; });
    return h;
  }
  function avatar(name, cls){
    return '<span class="av ' + (cls || '') + '" style="--h:' + hueOf(name) + '">' + esc(initials(name)) + '</span>';
  }
  function fmtWhen(iso){
    if(!iso) return '';
    const d = new Date(iso), now = new Date();
    const locale = isAr() ? 'ar' : 'en';
    if(d.toDateString() === now.toDateString()) return d.toLocaleTimeString(locale, { hour: 'numeric', minute: '2-digit' });
    if(now - d < 6 * 864e5) return d.toLocaleDateString(locale, { weekday: 'short' });
    return d.toLocaleDateString(locale, { day: 'numeric', month: 'short' });
  }
  function fmtDate(iso){
    return iso ? new Date(iso).toLocaleDateString(isAr() ? 'ar' : 'en', { day: 'numeric', month: 'long', year: 'numeric' }) : '';
  }

  // ---------- student: copy the parent link code ----------
  document.getElementById('ovLinkCode').addEventListener('click', function(){
    const code = currentProfile && currentProfile.link_code;
    if(!code) return;
    try{ navigator.clipboard.writeText(code); }catch(e){}
    toast(t('Code copied', 'تم نسخ الكود'), t('Send it to your parent: ', 'أرسله لولي أمرك: ') + code);
  });

  // ---------- parents: children ----------
  const childrenList = document.getElementById('childrenList');
  const ovChildren = document.getElementById('ovChildren');
  let childrenCache = [];

  function childCard(rep){
    const st = rep.student || {};
    const days = new Set(rep.read_days || []);
    let streak = 0, off = days.has(isoDay(0)) ? 0 : -1;
    while(days.has(isoDay(off))){ streak++; off--; }
    const lastExam = (rep.exams || [])[0];
    const lastNote = (rep.progress || [])[0];
    const passedLevels = (rep.exams || []).filter(function(e){ return e.passed; }).map(function(e){ return e.level; })
      .filter(function(l, i, a){ return a.indexOf(l) === i; });
    return '<article class="child-card">' +
      '<header>' + avatar(st.full_name, 'lg') + '<div><b>' + esc(st.full_name) + '</b><span>' + esc(st.club || '') + '</span></div></header>' +
      '<div class="child-stats">' +
        '<div><b>' + streak + '🔥</b><span>' + t('day streak', 'أيام متتالية') + '</span></div>' +
        '<div><b>' + (rep.books_week || 0) + '</b><span>' + t('books this week', 'كتب هذا الأسبوع') + '</span></div>' +
        '<div><b>' + passedLevels.length + '</b><span>' + t('levels passed', 'مستويات ناجحة') + '</span></div>' +
      '</div>' +
      '<ul class="child-facts">' +
        '<li><i>📝</i>' + (lastExam ? esc(levelName(lastExam.level)) + ' — ' + lastExam.score + '% ' + (lastExam.passed ? '✅' : '') + ' <small>' + fmtWhen(lastExam.at) + '</small>'
                                    : t('No exams taken yet', 'لم يؤدِّ أي امتحان بعد')) + '</li>' +
        '<li><i>👩‍🏫</i>' + (lastNote ? '<b>' + esc(lastNote.status || '') + '</b> ' + esc(lastNote.note || '') + ' <small>' + fmtWhen(lastNote.at) + '</small>'
                                     : t('No teacher notes yet', 'لا توجد ملاحظات من المعلم بعد')) + '</li>' +
      '</ul>' +
      (passedLevels.length ? '<div class="child-certs">' + passedLevels.map(function(l){
        return '<button type="button" data-childcert="' + esc(st.id) + '" data-level="' + esc(l) + '">🎓 ' + esc(l) + ' ⬇</button>';
      }).join('') + '</div>' : '') +
      '<footer>' +
        '<button class="btn-primary" type="button" data-chat="' + esc(st.id) + '">💬 ' + t('Message teachers', 'راسل المعلمين') + '</button>' +
      '</footer>' +
    '</article>';
  }

  async function loadChildren(){
    if(!isParent()) return;
    const { data: links, error } = await sb.from('parent_links').select('student_id').eq('parent_id', currentProfile.id);
    if(error){
      const msg = isMissing(error) ? t('Run the latest supabase/schema.sql to enable parent accounts.', 'شغّل أحدث نسخة من supabase/schema.sql لتفعيل حسابات أولياء الأمور.') : friendlyErrorMessage(error);
      childrenList.innerHTML = ovChildren.innerHTML = '<div class="lib-empty">' + esc(msg) + '</div>';
      return;
    }
    const reports = await Promise.all((links || []).map(function(l){
      return sb.rpc('student_report', { p_student: l.student_id }).then(function(r){ return r.data; });
    }));
    childrenCache = reports.filter(Boolean);
    const empty = '<div class="empty-state"><div>👨‍👩‍👧</div><b>' + t('Link your first child', 'اربط أول ابن لك') + '</b><span>' +
      t('Ask your child for the 6-character code on their dashboard, then add it under “My children”.',
        'اطلب من ابنك الكود المكوّن من ٦ رموز من لوحة التحكم الخاصة به، ثم أضفه في قسم «أبنائي».') + '</span></div>';
    const html = childrenCache.length ? childrenCache.map(childCard).join('') : empty;
    childrenList.innerHTML = html;
    ovChildren.innerHTML = '<div class="children-grid">' + html + '</div>';
  }

  [childrenList, ovChildren].forEach(function(el){
    el.addEventListener('click', function(e){
      const chatBtn = e.target.closest('[data-chat]');
      const certBtn = e.target.closest('[data-childcert]');
      if(chatBtn){ showDashView('messages'); openThread(chatBtn.dataset.chat); }
      if(certBtn) downloadChildCertificate(certBtn);
    });
  });

  document.getElementById('linkChildForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const input = document.getElementById('linkCode');
    const msg = document.getElementById('linkMsg');
    const { data, error } = await sb.rpc('link_child', { p_code: input.value.trim() });
    if(error){
      msg.style.color = '#B4213D';
      msg.textContent = /no student/i.test(error.message) ? t('No student has this code — check it with your child.', 'لا يوجد طالب بهذا الكود — تأكد منه مع ابنك.') : friendlyErrorMessage(error);
      return;
    }
    const child = Array.isArray(data) ? data[0] : data;
    msg.style.color = '#2e7d32';
    msg.textContent = t('Linked! You can now follow ' + child.full_name + '.', 'تم الربط! يمكنك الآن متابعة ' + child.full_name + '.');
    input.value = '';
    await loadChildren();
    refreshUnread();
  });

  // ---------- chat ----------
  const chatEl = document.getElementById('chat');
  const chatInbox = document.getElementById('chatInbox');
  const chatSearch = document.getElementById('chatSearch');
  const chatMsgs = document.getElementById('chatMsgs');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatPrivate = document.getElementById('chatPrivate');
  const chatPrivateWrap = document.getElementById('chatPrivateWrap');
  const msgBadge = document.getElementById('msgBadge');
  let inboxCache = [];
  let openStudent = null;
  let chatAvailable = true;

  function renderInbox(){
    const q = (chatSearch.value || '').trim().toLowerCase();
    const rows = inboxCache.filter(function(r){
      return !q || (r.student_name + ' ' + (r.club || '')).toLowerCase().indexOf(q) !== -1;
    });
    chatInbox.innerHTML = rows.length ? rows.map(function(r){
      const title = isStudent() ? t('My teachers & parents', 'معلميّ وولي أمري') : r.student_name;
      return '<button type="button" class="inbox-row' + (r.student_id === openStudent ? ' active' : '') + (r.unread ? ' unread' : '') + '" data-thread="' + esc(r.student_id) + '">' +
        avatar(r.student_name) +
        '<span class="ib-main"><b>' + esc(title) + '</b><span>' +
          (r.last_body ? esc((r.last_sender ? r.last_sender.split(' ')[0] + ': ' : '') + r.last_body) : esc(r.club || t('No messages yet', 'لا توجد رسائل بعد'))) +
        '</span></span>' +
        '<span class="ib-side"><small>' + fmtWhen(r.last_at) + '</small>' + (r.unread ? '<i>' + r.unread + '</i>' : '') + '</span>' +
      '</button>';
    }).join('') : '<div class="lib-empty">' + esc(t('No conversations yet.', 'لا توجد محادثات بعد.')) + '</div>';
  }

  async function loadInbox(){
    if(!currentProfile || !chatAvailable) return;
    const { data, error } = await sb.rpc('chat_inbox');
    if(error){
      if(isMissing(error)){
        chatAvailable = false;
        chatInbox.innerHTML = '<div class="lib-empty">' + esc(t('Run the latest supabase/schema.sql to turn on messages.', 'شغّل أحدث نسخة من supabase/schema.sql لتفعيل الرسائل.')) + '</div>';
      }
      return;
    }
    inboxCache = data || [];
    chatEl.classList.toggle('solo', isStudent());
    document.getElementById('msgSub').textContent = isStudent()
      ? t('Your conversation with your teachers and parents.', 'محادثتك مع معلميك وولي أمرك.')
      : isParent() ? t('One conversation per child — with their teachers.', 'محادثة لكل ابن — مع معلميه.')
                   : t('One conversation per student — the student, their parents and the teachers.', 'محادثة لكل طالب — مع الطالب وولي أمره والمعلمين.');
    renderInbox();
    updateBadge();
    if(isStudent() && inboxCache[0] && !openStudent) openThread(inboxCache[0].student_id);
  }

  function updateBadge(){
    const total = inboxCache.reduce(function(n, r){ return n + Number(r.unread || 0); }, 0);
    msgBadge.hidden = !total;
    msgBadge.textContent = total > 99 ? '99+' : total;
  }
  async function refreshUnread(){
    if(!currentProfile || !chatAvailable) return;
    const { data, error } = await sb.rpc('chat_inbox');
    if(error){ if(isMissing(error)) chatAvailable = false; return; }
    inboxCache = data || [];
    updateBadge();
    if(!document.querySelector('.dash-view[data-view="messages"]').hidden) renderInbox();
  }

  // students never see private parent–teacher messages (the database already hides them; this is a second guard)
  function canSee(m){ return !(m.private && isStudent()); }
  function resetChat(){
    inboxCache = [];
    openStudent = null;
    chatAvailable = true;
    chatMsgs.innerHTML = '';
    chatInbox.innerHTML = '';
    chatEl.classList.remove('open');
    chatPrivate.checked = false;
    msgBadge.hidden = true;
  }

  function bubble(m){
    const mine = m.sender_id === currentProfile.id;
    return '<div class="msg' + (mine ? ' mine' : '') + (m.private ? ' private' : '') + '">' +
      (mine ? '' : avatar(m.sender_name, 'sm')) +
      '<div class="bubble">' +
        (mine ? '' : '<b>' + esc(m.sender_name || '') + ' <em>' + esc(roleName(m.sender_role)) + '</em></b>') +
        '<p>' + esc(m.body).replace(/\n/g, '<br>') + '</p>' +
        '<small>' + (m.private ? '🔒 ' : '') + fmtWhen(m.created_at) + '</small>' +
      '</div></div>';
  }

  async function markRead(studentId){
    await sb.from('chat_reads').upsert({ user_id: currentProfile.id, student_id: studentId, last_read_at: new Date().toISOString() });
    const row = inboxCache.find(function(r){ return r.student_id === studentId; });
    if(row){ row.unread = 0; updateBadge(); renderInbox(); }
  }

  async function openThread(studentId){
    openStudent = studentId;
    chatEl.classList.add('open');
    let row = inboxCache.find(function(r){ return r.student_id === studentId; });
    if(!row){ await loadInbox(); row = inboxCache.find(function(r){ return r.student_id === studentId; }) || {}; }
    document.getElementById('chatTitle').textContent = isStudent() ? t('My teachers & parents', 'معلميّ وولي أمري') : (row.student_name || '');
    document.getElementById('chatMeta').textContent = isStudent() ? t('Everyone here can read your messages', 'كل المشاركين يرون رسائلك')
                                                                  : (row.club || '') + ' · ' + t('student, parents & teachers', 'الطالب وولي الأمر والمعلمون');
    document.getElementById('chatAvatar').outerHTML = '<div class="chat-avatar" id="chatAvatar">' + avatar(row.student_name || '?') + '</div>';
    chatPrivateWrap.hidden = isStudent();
    chatForm.hidden = false;
    chatMsgs.innerHTML = '<div class="chat-empty"><span>' + esc(t('Loading…', 'جارٍ التحميل…')) + '</span></div>';
    renderInbox();
    const { data, error } = await sb.from('messages').select('*').eq('student_id', studentId).order('created_at', { ascending: true }).limit(300);
    if(openStudent !== studentId) return;
    if(error){ chatMsgs.innerHTML = '<div class="lib-empty">' + esc(friendlyErrorMessage(error)) + '</div>'; return; }
    const shown = (data || []).filter(canSee);
    chatMsgs.innerHTML = shown.length ? shown.map(bubble).join('')
      : '<div class="chat-empty">👋<span>' + esc(t('Say hello — this is the start of the conversation.', 'ابدأ المحادثة بتحية!')) + '</span></div>';
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
    markRead(studentId);
    chatInput.focus();
  }

  chatInbox.addEventListener('click', function(e){
    const row = e.target.closest('[data-thread]');
    if(row) openThread(row.dataset.thread);
  });
  chatSearch.addEventListener('input', renderInbox);
  document.getElementById('chatBack').addEventListener('click', function(){ chatEl.classList.remove('open'); });
  chatInput.addEventListener('input', function(){
    chatInput.style.height = 'auto';
    chatInput.style.height = Math.min(chatInput.scrollHeight, 140) + 'px';
  });
  chatInput.addEventListener('keydown', function(e){
    if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); chatForm.requestSubmit(); }
  });
  chatForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const body = chatInput.value.trim();
    if(!body || !openStudent) return;
    const isPrivate = !isStudent() && chatPrivate.checked;
    chatInput.value = '';
    chatInput.style.height = 'auto';
    const { data, error } = await sb.from('messages').insert({ student_id: openStudent, body: body, private: isPrivate }).select().single();
    if(error){ chatInput.value = body; toast(t('Message not sent', 'لم تُرسل الرسالة'), friendlyErrorMessage(error), true); return; }
    appendMessage(data);
    markRead(openStudent);
  });

  function appendMessage(m){
    if(chatMsgs.querySelector('[data-mid="' + m.id + '"]')) return;
    const empty = chatMsgs.querySelector('.chat-empty');
    if(empty) empty.remove();
    const wrap = document.createElement('div');
    wrap.innerHTML = bubble(m);
    const el = wrap.firstChild;
    el.dataset.mid = m.id;
    chatMsgs.appendChild(el);
    chatMsgs.scrollTop = chatMsgs.scrollHeight;
  }

  function onNewMessage(m){
    if(!currentProfile || !m.id || !canSee(m)) return;
    const viewing = openStudent === m.student_id && !document.querySelector('.dash-view[data-view="messages"]').hidden;
    if(viewing){ appendMessage(m); markRead(m.student_id); }
    else if(m.sender_id !== currentProfile.id){
      toast('💬 ' + (m.sender_name || t('New message', 'رسالة جديدة')), m.body.length > 90 ? m.body.slice(0, 90) + '…' : m.body);
    }
    refreshUnread();
  }

  // ---------- admin: users & roles ----------
  const usersTable = document.getElementById('usersTable');
  const usersSearch = document.getElementById('usersSearch');
  const usersFilter = document.getElementById('usersFilter');
  let usersCache = [];
  let usersRole = 'all';

  function renderUsers(){
    const q = (usersSearch.value || '').trim().toLowerCase();
    const rows = usersCache.filter(function(u){
      return (usersRole === 'all' || u.role === usersRole || (usersRole === 'teacher' && u.role === 'admin')) &&
             (!q || ((u.full_name || '') + ' ' + (u.phone || '') + ' ' + contactOf(u)).toLowerCase().indexOf(q) !== -1);
    });
    usersTable.innerHTML = rows.length ? rows.map(function(u){
      const me = u.id === currentProfile.id;
      return '<div class="user-row" data-uid="' + esc(u.id) + '">' +
        avatar(u.full_name) +
        '<div class="ur-main"><b>' + esc(u.full_name || '—') + (me ? ' <em>(' + t('you', 'أنت') + ')</em>' : '') + '</b><span dir="ltr">' + esc(contactOf(u)) + (u.club ? ' · ' + esc(u.club) : '') + '</span></div>' +
        '<span class="role-pill role-' + esc(u.role) + '">' + esc(roleName(u.role)) + '</span>' +
        '<select class="ur-role" aria-label="Role"' + (me ? ' disabled' : '') + '>' +
          ['student', 'parent', 'teacher', 'admin'].map(function(r){
            return '<option value="' + r + '"' + (r === u.role ? ' selected' : '') + '>' + roleName(r) + '</option>';
          }).join('') +
        '</select>' +
        '<button type="button" class="ur-pass" data-setpass title="' + esc(t('Set a new password', 'كلمة مرور جديدة')) + '" aria-label="' + esc(t('Set a new password', 'كلمة مرور جديدة')) + '">🔑</button>' +
      '</div>';
    }).join('') : '<div class="lib-empty">' + esc(t('No users match.', 'لا يوجد مستخدمون مطابقون.')) + '</div>';
  }
  // what identifies an account: its phone number (the hidden email of a phone account is never shown)
  function contactOf(u){ return u.phone ? '+' + u.phone : /\.invalid$/.test(u.email || '') ? '' : (u.email || ''); }
  usersTable.addEventListener('click', async function(e){
    const b = e.target.closest('[data-setpass]');
    if(!b) return;
    const u = usersCache.find(function(x){ return x.id === b.closest('[data-uid]').dataset.uid; });
    const pw = prompt(t('New password for ' + (u.full_name || '') + ' (6+ characters):', 'كلمة مرور جديدة لـ ' + (u.full_name || '') + ' (٦ حروف أو أرقام على الأقل):'));
    if(pw == null) return;
    const { error } = await sb.rpc('admin_set_password', { p_user: u.id, p_password: pw.trim() });
    if(error){ toast(t('Not saved', 'لم يُحفظ'), friendlyErrorMessage(error), true); return; }
    toast('🔑 ' + t('Password changed', 'تم تغيير كلمة المرور'), t('Send it to ' + (u.full_name || '') + ' on WhatsApp.', 'ابعتها لـ ' + (u.full_name || '') + ' على واتساب.'));
  });

  async function loadUsers(){
    if(!isAdmin()) return;
    const { data, error } = await sb.rpc('admin_list_users');
    if(error){ usersTable.innerHTML = '<div class="lib-empty">' + esc(friendlyErrorMessage(error)) + '</div>'; return; }
    usersCache = data || [];
    renderUsers();
    renderTeacherRequests();
  }
  // people who signed up as teachers and wait for the admin
  const teacherRequests = document.getElementById('teacherRequests');
  function renderTeacherRequests(){
    const reqs = usersCache.filter(function(u){ return u.teacher_request && u.role === 'student'; });
    teacherRequests.innerHTML = reqs.length ? '<div class="treq"><b>🧑‍🏫 ' + t('Teacher requests', 'طلبات المعلمين') + ' (' + reqs.length + ')</b>' +
      reqs.map(function(u){
        return '<div class="treq-row" data-uid="' + esc(u.id) + '"><span><b>' + esc(u.full_name || '—') + '</b><small dir="ltr">' + esc(contactOf(u)) + ' · ' + esc(fmtDay(u.created_at)) + '</small></span>' +
          '<button class="sess-btn" type="button" data-treq="teacher">' + t('Approve as teacher', 'اعتماد كمعلم') + '</button>' +
          '<button class="sess-btn ghost" type="button" data-treq="student">' + t('Decline', 'رفض') + '</button></div>';
      }).join('') + '</div>' : '';
  }
  teacherRequests.addEventListener('click', async function(e){
    const b = e.target.closest('[data-treq]');
    if(!b) return;
    const u = usersCache.find(function(x){ return x.id === b.closest('[data-uid]').dataset.uid; });
    b.disabled = true;
    const { error } = await sb.rpc('set_user_role', { p_user: u.id, p_role: b.dataset.treq });
    if(error){ b.disabled = false; toast(t('Not saved', 'لم يُحفظ'), friendlyErrorMessage(error), true); return; }
    toast('✅ ' + (b.dataset.treq === 'teacher' ? t('Teacher approved', 'تم اعتماد المعلم') : t('Request declined', 'تم رفض الطلب')), u.full_name || '');
    await loadUsers();
  });
  usersSearch.addEventListener('input', renderUsers);
  usersFilter.addEventListener('click', function(e){
    const b = e.target.closest('[data-role]');
    if(!b) return;
    usersFilter.querySelectorAll('.lib-tab').forEach(function(x){ x.classList.toggle('active', x === b); });
    usersRole = b.dataset.role;
    renderUsers();
  });
  usersTable.addEventListener('change', async function(e){
    const sel = e.target.closest('.ur-role');
    if(!sel) return;
    const row = sel.closest('[data-uid]');
    const u = usersCache.find(function(x){ return x.id === row.dataset.uid; });
    const role = sel.value;
    if(role === 'admin' && !confirm(t('Give ' + u.full_name + ' full admin access?', 'منح ' + u.full_name + ' صلاحيات المدير الكاملة؟'))){ sel.value = u.role; return; }
    const { error } = await sb.rpc('set_user_role', { p_user: u.id, p_role: role });
    if(error){ sel.value = u.role; toast(t('Role not changed', 'لم يتم تغيير الدور'), friendlyErrorMessage(error), true); return; }
    u.role = role;
    renderUsers();
    toast('✅ ' + t('Role updated', 'تم تحديث الدور'), u.full_name + ' → ' + roleName(role));
  });

  async function downloadChildCertificate(btn){
    btn.disabled = true;
    try{
      const { data, error } = await sb.rpc('my_certificates', { p_student: btn.dataset.childcert });
      if(error) throw error;
      const row = (data || []).find(function(c){ return c.level === btn.dataset.level; });
      if(!row) throw new Error(t('Certificate not found', 'لم يتم العثور على الشهادة'));
      const cv = await drawCertificate({ id: row.id, full_name: row.full_name, club: row.club, level: row.level, score: row.score, created_at: row.issued_at });
      cv.toBlob(function(blob){
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'Code-Cademy-certificate-' + String(row.full_name || '').replace(/\s+/g, '-') + '.png';
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function(){ URL.revokeObjectURL(a.href); }, 4000);
      }, 'image/png');
    } catch(err){
      toast(t('Couldn’t make the certificate', 'تعذّر إنشاء الشهادة'), friendlyErrorMessage(err), true);
    } finally { btn.disabled = false; }
  }

  // ---------- attendance (teacher marks each booking) ----------
  if(sessView){
    sessView.addEventListener('click', async function(e){
      const b = e.target.closest('[data-att]');
      if(!b) return;
      b.disabled = true;
      const next = b.classList.contains('on') ? null : b.dataset.v;
      const { error } = await sb.from('bookings').update({ attendance: next }).eq('id', b.dataset.att);
      if(error) setNotice(sessionsFriendlyError(error));
      await loadSessions();
    });
  }

  // ---------- certificates (student, after passing a level exam) ----------
  const certList = document.getElementById('certList');
  let certData = [];
  async function loadCertificates(){
    if(!certList || !currentProfile || isTeacher()) return;
    const { data } = await sb.from('exam_attempts').select('*').eq('student_id', currentProfile.id).eq('passed', true).order('created_at', { ascending: true });
    const seen = {};
    certData = (data || []).filter(function(r){
      const k = r.club + '|' + r.level;
      if(seen[k]) return false;
      seen[k] = true; return true;
    });
    certList.innerHTML = certData.length ? certData.map(function(r, i){
      return '<div class="sess-card cert-card"><div class="cert-ico"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="9" r="6"/><path d="M8.5 14L7 22l5-3 5 3-1.5-8"/></svg></div>' +
        '<div class="sess-info"><h5>' + esc(r.club) + ' — ' + esc(levelName(r.level)) + '</h5><div class="meta">' + esc(fmtDay(r.created_at)) + ' · ' + esc(String(r.score)) + '%</div></div>' +
        '<div class="sess-actions"><button class="sess-btn" type="button" data-cert="' + i + '">Download certificate</button></div></div>';
    }).join('') : '<div class="lib-empty">Pass a level exam (70% or more) and your certificate appears here.</div>';
  }

  const CERT_BG = 'assets/img/certificate-bg.jpg';
  // where the text goes, as fractions of the artwork (the built-in design's layout)
  const CERT_LAYOUT = { name: [0.389, 0.687], date: [0.748, 0.687], info: [0.389, 0.729], id: [0.5, 0.968], color: '#5C1A28' };
  let certTemplates = null; // rows of certificate_templates, cached
  const certImgCache = {};

  async function loadCertTemplates(force){
    if(certTemplates && !force) return certTemplates;
    const { data, error } = await sb.from('certificate_templates').select('*');
    certTemplates = error ? [] : (data || []);
    return certTemplates;
  }
  function certTemplateFor(club){
    const list = certTemplates || [];
    return list.find(function(t){ return t.club === club; }) || list.find(function(t){ return t.club === '*'; }) || null;
  }
  function certSrc(tpl){
    return tpl && tpl.file_path ? sb.storage.from('materials').getPublicUrl(tpl.file_path).data.publicUrl : CERT_BG;
  }
  function loadImg(src){
    if(certImgCache[src]) return Promise.resolve(certImgCache[src]);
    return new Promise(function(res, rej){
      const i = new Image();
      if(/^https?:/.test(src)) i.crossOrigin = 'anonymous'; // so the canvas can still be saved as an image
      i.onload = function(){ certImgCache[src] = i; res(i); };
      i.onerror = function(){ rej(new Error(t('The certificate image could not be loaded.', 'تعذّر تحميل صورة الشهادة.'))); };
      i.src = src;
    });
  }
  // r = { full_name, club, level, score, created_at, id }; design = { src, layout } to preview a design that isn't saved yet
  async function drawCertificate(r, design){
    try { await document.fonts.ready; } catch(e){}
    let src, layout;
    if(design){ src = design.src; layout = design.layout; }
    else {
      await loadCertTemplates();
      const tpl = certTemplateFor(r.club);
      src = certSrc(tpl);
      layout = Object.assign({}, CERT_LAYOUT, tpl && tpl.layout);
    }
    let bg;
    try { bg = await loadImg(src); } catch(e){ bg = await loadImg(CERT_BG); layout = CERT_LAYOUT; }
    const W = bg.naturalWidth, H = bg.naturalHeight;
    const k = W / 1280;                       // text sizes follow the image width
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const x = c.getContext('2d');
    const SER = '"Fraunces", Georgia, "Times New Roman", serif';
    const at = function(key){ return [layout[key][0] * W, layout[key][1] * H]; };
    x.drawImage(bg, 0, 0, W, H);
    x.textAlign = 'center'; x.textBaseline = 'alphabetic';
    x.fillStyle = layout.color || CERT_LAYOUT.color;
    // student's name
    const name = r.full_name || (currentProfile && currentProfile.full_name) || '';
    let size = 38 * k; x.font = 'italic 600 ' + size + 'px ' + SER;
    while(x.measureText(name).width > 410 * k && size > 16 * k){ size -= 2 * k; x.font = 'italic 600 ' + size + 'px ' + SER; }
    let p = at('name'); x.fillText(name, p[0], p[1]);
    // date
    x.font = 'italic 600 ' + (25 * k) + 'px ' + SER;
    p = at('date'); x.fillText(new Date(r.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }), p[0], p[1]);
    // what was completed
    x.globalAlpha = 0.8; x.font = 'italic ' + (19 * k) + 'px ' + SER;
    p = at('info'); x.fillText('Completed: ' + r.club + ' — ' + levelNameEn(r.level) + ' · ' + r.score + '%', p[0], p[1]);
    // certificate id
    x.globalAlpha = 0.55; x.font = (13 * k) + 'px ' + SER;
    p = at('id'); x.fillText('Certificate ID: ' + String(r.id || '').replace(/[^a-z0-9]/gi, '').slice(0, 8).toUpperCase(), p[0], p[1]);
    x.globalAlpha = 1;
    return c;
  }

  // ---------- Instagram connection (admin) ----------
  const igCard = document.getElementById('igCard');
  async function loadInstagramStatus(){
    igCard.hidden = !isAdmin();
    if(!isAdmin()) return;
    const box = document.getElementById('igStatus');
    const { data, error } = await sb.rpc('instagram_status');
    if(error){
      box.className = 'ig-status bad';
      box.textContent = isMissing(error) ? t('Run the latest supabase/schema.sql to turn this on.', 'شغّل أحدث نسخة من supabase/schema.sql لتفعيل هذه الميزة.') : friendlyErrorMessage(error);
      return;
    }
    const st = (data && data.status) || null;
    const when = st && st.last_sync_at ? new Date(st.last_sync_at).toLocaleString(isAr() ? 'ar' : 'en', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' }) : '';
    if(!data || !data.connected){
      box.className = 'ig-status';
      box.textContent = t('Not connected yet — paste the token below.', 'غير متصل بعد — الصق الرمز بالأسفل.');
    } else if(!st){
      box.className = 'ig-status wait';
      box.textContent = t('Token saved ✓ — the first sync runs within the hour (or run it now from GitHub → Actions → Instagram sync).',
                          'تم حفظ الرمز ✓ — أول مزامنة خلال ساعة (أو شغّلها الآن من GitHub ← Actions ← Instagram sync).');
    } else if(st.ok){
      box.className = 'ig-status ok';
      box.textContent = t('Connected ✓ · ' + (data.videos || 0) + ' videos on the website · last sync ' + when,
                          'متصل ✓ · ' + (data.videos || 0) + ' فيديو على الموقع · آخر مزامنة ' + when);
    } else {
      box.className = 'ig-status bad';
      box.textContent = t('Last sync failed (' + when + '): ', 'فشلت آخر مزامنة (' + when + '): ') + (st.error || '');
    }
  }
  document.getElementById('igForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const msg = document.getElementById('igMsg');
    msg.style.color = ''; msg.textContent = '';
    const { error } = await sb.rpc('set_instagram_token', { p_token: document.getElementById('igToken').value.trim() });
    if(error){ msg.textContent = friendlyErrorMessage(error); return; }
    document.getElementById('igToken').value = '';
    msg.style.color = '#2e7d32';
    msg.textContent = t('Saved. New Instagram videos will show on the website automatically.', 'تم الحفظ. ستظهر فيديوهات إنستجرام الجديدة على الموقع تلقائياً.');
    loadInstagramStatus();
  });

  // ---------- certificate designer (teachers) ----------
  const cdClub = document.getElementById('cdClub');
  const cdFile = document.getElementById('cdFile');
  const cdColor = document.getElementById('cdColor');
  const cdStage = document.getElementById('cdStage');
  const cdCanvas = document.getElementById('cdCanvas');
  const cdMsg = document.getElementById('cdMsg');
  let cdLayout = Object.assign({}, CERT_LAYOUT);
  let cdSrc = CERT_BG;        // what the preview shows
  let cdPath = null;          // stored file of the saved design (null = built-in artwork)
  let cdNewFile = null;       // a picked file that isn't uploaded yet
  let cdBusy = false;

  function cdSetMsg(text, ok){ cdMsg.textContent = text || ''; cdMsg.style.color = ok ? '#2e7d32' : '#B4213D'; }
  function cdPlacePins(){
    cdStage.querySelectorAll('.cd-pin').forEach(function(pin){
      const v = cdLayout[pin.dataset.pin];
      pin.style.left = (v[0] * 100) + '%';
      pin.style.top = (v[1] * 100) + '%';
    });
  }
  async function cdRender(){
    try{
      const sample = { full_name: (currentProfile && currentProfile.full_name) || 'Student Name', club: cdClub.value === '*' ? 'Conversation Club' : cdClub.value,
                       level: 'Level 2', score: 95, created_at: new Date().toISOString(), id: 'SAMPLE01' };
      const c = await drawCertificate(sample, { src: cdSrc, layout: cdLayout });
      cdCanvas.width = c.width; cdCanvas.height = c.height;
      cdCanvas.getContext('2d').drawImage(c, 0, 0);
      cdPlacePins();
    } catch(err){ cdSetMsg(friendlyErrorMessage(err)); }
  }
  async function openCertDesigner(){
    cdSetMsg('');
    await loadCertTemplates(true);
    const tpl = (certTemplates || []).find(function(t){ return t.club === cdClub.value; });
    cdNewFile = null;
    cdPath = tpl ? tpl.file_path : null;
    cdSrc = certSrc(tpl);
    cdLayout = Object.assign({}, CERT_LAYOUT, tpl && tpl.layout);
    ['name', 'date', 'info', 'id'].forEach(function(k){ cdLayout[k] = cdLayout[k].slice(); });
    cdColor.value = cdLayout.color || CERT_LAYOUT.color;
    document.getElementById('cdReset').hidden = !tpl;
    await cdRender();
  }
  cdClub.addEventListener('change', openCertDesigner);
  cdColor.addEventListener('input', function(){ cdLayout.color = cdColor.value; cdRender(); });
  cdFile.addEventListener('change', function(){
    const f = cdFile.files[0];
    cdFile.value = '';
    if(!f) return;
    if(!/^image\/(png|jpeg)$/.test(f.type)){ cdSetMsg(t('Please choose a JPG or PNG image.', 'اختر صورة JPG أو PNG.')); return; }
    if(f.size > 8 * 1024 * 1024){ cdSetMsg(t('The image is over 8 MB — please use a smaller one.', 'الصورة أكبر من ٨ ميجابايت — استخدم صورة أصغر.')); return; }
    cdNewFile = f;
    cdSrc = URL.createObjectURL(f);
    cdSetMsg(t('New image loaded — drag the labels into place, then press Save.', 'تم تحميل الصورة — اسحب العناوين لأماكنها ثم اضغط حفظ.'), true);
    cdRender();
  });
  // drag the Name / Date / Details / ID labels
  cdStage.querySelectorAll('.cd-pin').forEach(function(pin){
    pin.addEventListener('pointerdown', function(e){
      e.preventDefault();
      pin.setPointerCapture(e.pointerId);
      pin.classList.add('dragging');
      const move = function(ev){
        const r = cdStage.getBoundingClientRect();
        const fx = Math.min(0.98, Math.max(0.02, (ev.clientX - r.left) / r.width));
        const fy = Math.min(0.99, Math.max(0.03, (ev.clientY - r.top) / r.height));
        cdLayout[pin.dataset.pin] = [Math.round(fx * 1000) / 1000, Math.round(fy * 1000) / 1000];
        pin.style.left = (fx * 100) + '%'; pin.style.top = (fy * 100) + '%';
      };
      const up = function(){
        pin.classList.remove('dragging');
        pin.removeEventListener('pointermove', move);
        pin.removeEventListener('pointerup', up);
        cdRender();
      };
      pin.addEventListener('pointermove', move);
      pin.addEventListener('pointerup', up);
    });
    // keyboard: arrow keys nudge the label
    pin.addEventListener('keydown', function(e){
      const step = e.shiftKey ? 0.02 : 0.005, v = cdLayout[pin.dataset.pin];
      const d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
      if(!d) return;
      e.preventDefault();
      cdLayout[pin.dataset.pin] = [Math.min(0.98, Math.max(0.02, v[0] + d[0])), Math.min(0.99, Math.max(0.03, v[1] + d[1]))];
      cdRender();
    });
  });
  document.getElementById('cdSave').addEventListener('click', async function(){
    if(cdBusy) return;
    cdBusy = true; this.disabled = true;
    cdSetMsg(t('Saving…', 'جارٍ الحفظ…'), true);
    try{
      let path = cdPath;
      if(cdNewFile){
        const ext = cdNewFile.type === 'image/png' ? '.png' : '.jpg';
        path = 'certificates/' + storageSlug(cdClub.value === '*' ? 'all-clubs' : cdClub.value, 'club') + '_' + Date.now() + ext;
        const { error: upErr } = await sb.storage.from('materials').upload(path, cdNewFile, { contentType: cdNewFile.type, upsert: false });
        if(upErr) throw upErr;
      }
      const { error } = await sb.from('certificate_templates').upsert({
        club: cdClub.value, file_path: path, layout: cdLayout, updated_by: currentProfile.id, updated_at: new Date().toISOString()
      }, { onConflict: 'club' });
      if(error) throw error;
      if(cdNewFile && cdPath && cdPath !== path) sb.storage.from('materials').remove([cdPath]); // tidy up the old artwork
      cdPath = path; cdNewFile = null;
      await loadCertTemplates(true);
      document.getElementById('cdReset').hidden = false;
      cdSetMsg(t('Saved — every new certificate uses this design now.', 'تم الحفظ — كل الشهادات الجديدة ستستخدم هذا التصميم.'), true);
    } catch(err){
      cdSetMsg(isMissing(err) ? t('Run the latest supabase/schema.sql to turn on certificate designs.', 'شغّل أحدث نسخة من supabase/schema.sql لتفعيل تصميم الشهادات.') : friendlyErrorMessage(err));
    } finally { cdBusy = false; this.disabled = false; }
  });
  document.getElementById('cdReset').addEventListener('click', async function(){
    if(!confirm(t('Go back to the default certificate design for this choice?', 'الرجوع للتصميم الافتراضي للشهادة لهذا الاختيار؟'))) return;
    const { error } = await sb.from('certificate_templates').delete().eq('club', cdClub.value);
    if(error){ cdSetMsg(friendlyErrorMessage(error)); return; }
    if(cdPath) sb.storage.from('materials').remove([cdPath]);
    await openCertDesigner();
    cdSetMsg(t('Back to the default design.', 'تم الرجوع للتصميم الافتراضي.'), true);
  });
  if(certList){
    certList.addEventListener('click', async function(e){
      const b = e.target.closest('[data-cert]');
      if(!b) return;
      b.disabled = true;
      try {
        const cv = await drawCertificate(certData[parseInt(b.dataset.cert, 10)]);
        cv.toBlob(function(blob){
          const a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = 'Code-Cademy-certificate.png';
          document.body.appendChild(a); a.click(); a.remove();
          setTimeout(function(){ URL.revokeObjectURL(a.href); }, 4000);
        }, 'image/png');
      } finally { b.disabled = false; }
    });
  }

  // ---------- parent report (teacher) ----------
  const reportModal = document.getElementById('reportModal');
  const reportSheet = document.getElementById('reportSheet');
  let reportText = '';
  async function openReport(studentId){
    reportSheet.innerHTML = '<p class="lib-empty">Loading…</p>';
    reportModal.hidden = false;
    document.body.style.overflow = 'hidden';
    const [pr, en, ex, bk, sb2, pg] = await Promise.all([
      sb.from('profiles').select('id, full_name, club').eq('id', studentId).single(),
      sb.from('enrollments').select('*').eq('student_id', studentId).order('created_at', { ascending: false }),
      sb.from('exam_attempts').select('*').eq('student_id', studentId).order('created_at', { ascending: true }),
      sb.from('bookings').select('id, attendance').eq('student_id', studentId),
      sb.from('submissions').select('grade').eq('student_id', studentId),
      sb.from('progress').select('*').eq('student_id', studentId).order('created_at', { ascending: false }).limit(5)
    ]);
    const st = pr.data || {};
    const club = st.club || '';
    const asg = club ? await sb.from('assignments').select('id', { count: 'exact', head: true }).eq('club', club) : { count: 0 };
    const active = (en.data || []).find(isActiveEnrollment);
    const passed = []; const seen = {};
    (ex.data || []).filter(function(r){ return r.passed; }).forEach(function(r){ const k = r.club + r.level; if(!seen[k]){ seen[k] = 1; passed.push(r); } });
    const best = {};
    (ex.data || []).forEach(function(r){ best[r.level] = Math.max(best[r.level] || 0, r.score || 0); });
    const books = bk.data || [];
    const present = books.filter(function(b){ return b.attendance === 'present'; }).length;
    const absent = books.filter(function(b){ return b.attendance === 'absent'; }).length;
    const marked = present + absent;
    const rate = marked ? Math.round(present / marked * 100) : null;
    const subs = sb2.data || [];
    const graded = subs.filter(function(s){ return s.grade != null; });
    const avg = graded.length ? Math.round(graded.reduce(function(a, s){ return a + s.grade; }, 0) / graded.length) : null;
    const notes = pg.data || [];
    const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const lvls = passed.length ? passed.map(function(r){ return r.level; }).join(', ') : 'No level passed yet';
    reportText = 'Code Cademy — progress report for ' + (st.full_name || '') + ' (' + today + ')\n' +
      'Club: ' + (club || '—') + '\n' +
      'Plan: ' + (active ? planName(active.plan) : 'No active plan') + '\n' +
      'Levels passed: ' + lvls + '\n' +
      'Attendance: ' + (rate == null ? 'not recorded yet' : present + ' present, ' + absent + ' absent (' + rate + '%)') + '\n' +
      'Homework: ' + subs.length + ' of ' + (asg.count || 0) + ' submitted' + (avg == null ? '' : ', average grade ' + avg + '/100') +
      (notes.length ? '\nLatest note: ' + (notes[0].status || '') + (notes[0].note ? ' — ' + notes[0].note : '') : '');
    reportSheet.innerHTML =
      '<div class="rp-head"><div><span class="rp-brand">Code Cademy</span><h3>Progress report</h3></div><span class="rp-date">' + esc(today) + '</span></div>' +
      '<div class="rp-student"><b>' + esc(st.full_name || '') + '</b><span>' + esc(club || '—') + '</span></div>' +
      '<div class="rp-grid">' +
        '<div><span>Plan</span><b>' + esc(active ? planName(active.plan) : 'No active plan') + '</b></div>' +
        '<div><span>Levels passed</span><b>' + esc(lvls) + '</b></div>' +
        '<div><span>Attendance</span><b>' + (rate == null ? '—' : rate + '%') + '</b><i>' + (rate == null ? 'not recorded yet' : present + ' present · ' + absent + ' absent') + '</i></div>' +
        '<div><span>Homework</span><b>' + subs.length + ' / ' + (asg.count || 0) + '</b><i>' + (avg == null ? 'no grades yet' : 'average ' + avg + ' / 100') + '</i></div>' +
      '</div>' +
      (Object.keys(best).length ? '<h4>Exam scores</h4><ul>' + Object.keys(best).map(function(l){ return '<li>' + esc(l) + ' — best ' + best[l] + '%</li>'; }).join('') + '</ul>' : '') +
      (notes.length ? '<h4>Teacher notes</h4><ul>' + notes.map(function(n){ return '<li><b>' + esc(n.status || '') + '</b>' + (n.note ? ' — ' + esc(n.note) : '') + '</li>'; }).join('') + '</ul>' : '') +
      '<p class="rp-foot">Prepared by your Code Cademy teacher.</p>';
  }
  function closeReport(){ reportModal.hidden = true; if(authPage.hidden && dashboardPage.hidden) document.body.style.overflow = ''; }
  document.getElementById('rpClose').addEventListener('click', closeReport);
  reportModal.addEventListener('click', function(e){ if(e.target === reportModal) closeReport(); });
  document.getElementById('rpPrint').addEventListener('click', function(){ document.body.classList.add('printing-report'); window.print(); setTimeout(function(){ document.body.classList.remove('printing-report'); }, 500); });
  document.getElementById('rpWa').addEventListener('click', function(){
    const num = (prompt("Parent's WhatsApp number with the country code (for example 9665XXXXXXXX):") || '').replace(/\D/g, '');
    if(num.length < 8) return;
    window.open('https://wa.me/' + num + '?text=' + encodeURIComponent(reportText), '_blank', 'noopener');
  });
  if(studentsList){
    studentsList.addEventListener('click', function(e){
      const b = e.target.closest('[data-report]');
      if(b) openReport(b.dataset.report);
    });
  }

  // ---------- free level test (public): adaptive, new questions every time ----------
  // The first option of each item is the correct one; options are shuffled when shown.
  const PT_BANK = {
    A1: [
      { q: "She ___ a teacher.", o: ["is", "am", "are", "be"] },
      { q: "I ___ two brothers.", o: ["have", "has", "am", "is"] },
      { q: "___ you like pizza?", o: ["Do", "Does", "Are", "Is"] },
      { q: "There ___ a cat on the sofa.", o: ["is", "are", "am", "be"] },
      { q: "My birthday is ___ May.", o: ["in", "on", "at", "to"] },
      { q: "They ___ football every Saturday.", o: ["play", "plays", "playing", "is play"] },
      { q: "This is ___ apple.", o: ["an", "a", "two", "many"] },
      { q: "He ___ like coffee.", o: ["doesn't", "don't", "isn't", "not"] },
      { q: "What is the opposite of “hot”?", o: ["cold", "warm", "big", "fast"] },
      { q: "I'm hungry. Can I have ___ sandwich?", o: ["a", "an", "any", "much"] },
      { q: "We ___ at home now.", o: ["are", "is", "am", "be"] },
      { q: "Where ___ your parents live?", o: ["do", "does", "are", "is"] },
      { q: "Look! The children ___ in the garden.", o: ["are playing", "plays", "play", "is playing"] },
      { q: "I ___ to school by bus yesterday.", o: ["went", "go", "goes", "going"] },
      { q: "How ___ is this bag? It's 20 riyals.", o: ["much", "many", "old", "long"] },
      { q: "Her name ___ Sara.", o: ["is", "are", "am", "be"] },
      { q: "I get up ___ 7 o'clock.", o: ["at", "in", "on", "to"] },
      { q: "Can you ___ English?", o: ["speak", "speaks", "speaking", "to speak"] },
      { q: "Which word is a day?", o: ["Monday", "March", "Morning", "Summer"] },
      { q: "My sister is ___ than me.", o: ["older", "old", "oldest", "more old"] },
      { q: "___ is your teacher? Mr. Ali.", o: ["Who", "What", "Where", "When"] }
    ],
    A2: [
      { q: "Yesterday we ___ to the beach.", o: ["went", "go", "goes", "gone"] },
      { q: "She is ___ than her sister.", o: ["taller", "more tall", "tallest", "tall"] },
      { q: "I ___ TV when you called.", o: ["was watching", "watched", "am watching", "watch"] },
      { q: "There isn't ___ milk left.", o: ["any", "some", "many", "a"] },
      { q: "How ___ apples do you need?", o: ["many", "much", "more", "lot"] },
      { q: "I'm going ___ my grandmother this weekend.", o: ["to visit", "visit", "visiting", "visited"] },
      { q: "You ___ wear a helmet on a bike — it's important.", o: ["should", "would", "might", "can't"] },
      { q: "Did you ___ the email?", o: ["send", "sent", "sends", "sending"] },
      { q: "This is the ___ film I have ever seen.", o: ["best", "better", "good", "most good"] },
      { q: "We usually have lunch ___ 1 pm.", o: ["at", "in", "on", "by"] },
      { q: "Choose the correct question.", o: ["Where did you go?", "Where you went?", "Where did you went?", "Where you go did?"] },
      { q: "My phone is ___ the table, next to the keys.", o: ["on", "in", "at", "of"] },
      { q: "I have never ___ to London.", o: ["been", "went", "go", "being"] },
      { q: "She was cooking when the phone ___.", o: ["rang", "rings", "was ring", "ringed"] },
      { q: "If it rains, we ___ at home.", o: ["will stay", "stayed", "would stay", "stay will"] },
      { q: "He is good ___ maths.", o: ["at", "in", "on", "for"] },
      { q: "I ___ my homework yet.", o: ["haven't finished", "didn't finish", "don't finish", "not finished"] },
      { q: "This is the ___ film I have ever seen.", o: ["best", "better", "good", "most good"] },
      { q: "We ___ go to school on Fridays.", o: ["don't have to", "mustn't to", "haven't", "not must"] },
      { q: "Choose the correct question.", o: ["How long have you lived here?", "How long do you live here since?", "How long you have lived here?", "How long are you living here since?"] },
      { q: "The film was so ___ that I fell asleep.", o: ["boring", "bored", "bore", "boringly"] },
      { q: "I'll call you ___ I arrive.", o: ["when", "while", "during", "until that"] }
    ],
    B1: [
      { q: "I have lived here ___ 2019.", o: ["since", "for", "from", "during"] },
      { q: "If it rains tomorrow, we ___ at home.", o: ["will stay", "would stay", "stayed", "staying"] },
      { q: "She asked me where I ___.", o: ["lived", "live", "am living", "have lived"] },
      { q: "The book ___ by millions of people.", o: ["has been read", "has read", "is reading", "read"] },
      { q: "I'm not used to ___ up so early.", o: ["getting", "get", "got", "have got"] },
      { q: "You ___ finish it today — tomorrow is fine.", o: ["don't have to", "mustn't", "can't", "shouldn't to"] },
      { q: "He's the man ___ car was stolen.", o: ["whose", "who", "which", "who's"] },
      { q: "I wish I ___ more free time.", o: ["had", "have", "will have", "am having"] },
      { q: "By the time we arrived, the film ___.", o: ["had started", "started", "has started", "starts"] },
      { q: "Could you tell me what time ___?", o: ["the shop opens", "does the shop open", "opens the shop", "the shop does open"] },
      { q: "Which phrasal verb means “postpone”?", o: ["put off", "put on", "put up", "put out"] },
      { q: "She has been studying English ___ three years.", o: ["for", "since", "during", "from"] },
      { q: "I wish I ___ more time to travel.", o: ["had", "have", "will have", "would had"] },
      { q: "The meeting has been ___ until next week.", o: ["put off", "put out", "put up", "put on"] },
      { q: "You ___ have told me! I would have helped.", o: ["should", "must", "can", "will"] },
      { q: "He denied ___ the window.", o: ["breaking", "to break", "break", "broke"] },
      { q: "By the time we arrived, the film ___.", o: ["had started", "has started", "started", "was start"] },
      { q: "She is used to ___ early.", o: ["getting up", "get up", "got up", "gets up"] },
      { q: "The man ___ car was stolen called the police.", o: ["whose", "who", "which", "that's"] }
    ],
    B2: [
      { q: "If I had known, I ___ you.", o: ["would have told", "would tell", "will tell", "had told"] },
      { q: "The report ___ by the time the manager arrived.", o: ["had been finished", "finished", "was finishing", "has finished"] },
      { q: "It's high time we ___ home.", o: ["went", "go", "will go", "are going"] },
      { q: "He denied ___ the window.", o: ["breaking", "to break", "break", "broken"] },
      { q: "Not only ___ late, but he also forgot the tickets.", o: ["was he", "he was", "he is", "did he"] },
      { q: "I'd rather you ___ smoke in here.", o: ["didn't", "don't", "won't", "not"] },
      { q: "The meeting was called ___ because of the storm.", o: ["off", "out", "up", "over"] },
      { q: "She always tells the truth — she's very ___.", o: ["honest", "honesty", "honestly", "dishonest"] },
      { q: "You'd better ___ a doctor.", o: ["see", "to see", "seeing", "saw"] },
      { q: "Despite ___ tired, she kept working.", o: ["being", "she was", "be", "to be"] },
      { q: "Had I left earlier, I ___ the train.", o: ["would have caught", "would catch", "will catch", "caught"] },
      { q: "The new rules will ___ next month.", o: ["come into effect", "come into affect", "come in effect", "take into effect"] }
    ],
    C1: [
      { q: "Hardly ___ the door when the phone rang.", o: ["had I opened", "I had opened", "did I open", "I opened"] },
      { q: "He is said ___ a fortune abroad.", o: ["to have made", "having made", "to make", "that he made"] },
      { q: "Little ___ that he was being watched.", o: ["did he know", "he knew", "he did know", "knew he"] },
      { q: "Choose the closest meaning of “meticulous”.", o: ["extremely careful", "very fast", "rather lazy", "quite loud"] },
      { q: "Should you need any help, ___ hesitate to contact us.", o: ["don't", "not", "won't", "no"] },
      { q: "The plan, ___ seemed simple, proved impossible.", o: ["which at first", "that at first", "what at first", "who at first"] },
      { q: "She takes ___ her mother — they're very alike.", o: ["after", "over", "up", "in"] },
      { q: "Had it not been for your help, I ___.", o: ["would have failed", "will fail", "would fail", "failed"] },
      { q: "The results were ___, to say the least.", o: ["disappointing", "disappointed", "disappoint", "disappointment"] },
      { q: "Choose the correct sentence.", o: ["Rarely have I seen such talent.", "Rarely I have seen such talent.", "Rarely seen I have such talent.", "Rarely have seen I such talent."] },
      { q: "He was on the ___ of giving up when the call came.", o: ["verge", "edge", "side", "end"] },
      { q: "Her argument doesn't hold ___.", o: ["water", "rain", "air", "ground"] }
    ]
  };
  const PT_BANDS = ['A1', 'A2', 'B1', 'B2', 'C1'];
  const PT_TOTAL = 12;
  const PT_SITE_LEVEL = { A1: 'Level 1', A2: 'Level 3', B1: 'Level 5', 'B1+': 'Level 6', B2: 'Level 7', C1: 'Level 9' };
  const PT_RESULT_BANDS = ['A1', 'A2', 'B1', 'B1+', 'B2', 'C1']; // the 6 levels; the questions use 5 bands, the AI-marked writing all 6
  let ptAiOff = false; // the AI placement test isn't switched on: use the written question bank
  const ptStart = document.getElementById('ptStart'), ptRun = document.getElementById('ptRun'), ptDone = document.getElementById('ptDone');
  let pt = null; // { band, asked: [{band, q, opts, correct, chosen}], used: {band: [indexes]} }
  const ptWrite = document.getElementById('ptWrite');
  function ptShow(which){ ptStart.hidden = which !== 'start'; ptRun.hidden = which !== 'run'; ptDone.hidden = which !== 'done'; ptWrite.hidden = which !== 'write'; }
  function ptPick(band){
    // fresh questions written by the AI for this test come first
    const ai = pt.pool && pt.pool[band], aiUsed = pt.used['ai' + band] = pt.used['ai' + band] || [];
    if(ai && aiUsed.length < ai.length){
      const k = aiUsed.length; aiUsed.push(k);
      return { band: band, q: ai[k].q, opts: shuffleArr(ai[k].o.map(function(text, n){ return { text: text, ok: n === 0 }; })) };
    }
    const pool = PT_BANK[band], used = pt.used[band] = pt.used[band] || [];
    const free = pool.map(function(_, k){ return k; }).filter(function(k){ return used.indexOf(k) === -1; });
    // prefer questions this visitor has not seen in earlier attempts, so a retake feels new
    const fresh = free.filter(function(k){ return pt.seen.indexOf(band + k) === -1; });
    const from = fresh.length ? fresh : free;
    const k = from[Math.floor(Math.random() * from.length)];
    used.push(k);
    pt.seen.push(band + k);
    try{ localStorage.setItem('cc_pt_seen', JSON.stringify(pt.seen.slice(-50))); }catch(e){}
    const item = pool[k];
    const opts = shuffleArr(item.o.map(function(text, n){ return { text: text, ok: n === 0 }; }));
    return { band: band, q: item.q, opts: opts };
  }
  async function ptBegin(){
    let seen = [];
    try{ seen = JSON.parse(localStorage.getItem('cc_pt_seen') || '[]') || []; }catch(e){}
    const test = pt = { band: 1, asked: [], used: {}, seen: seen, pool: null }; // start at A2
    ptShow('run');
    if(!ptAiOff){
      // ask the AI for today's questions; if it is off or slow, the written bank is used
      document.getElementById('ptCount').textContent = t('Preparing your test…', 'بجهّزلك الامتحان…');
      document.getElementById('ptQ').textContent = '✨ ' + t('Coco is writing fresh questions for you', 'كوكو بيكتبلك أسئلة جديدة');
      document.getElementById('ptOpts').innerHTML = '<span class="pt-wait"><i></i><i></i><i></i></span>';
      const out = await Promise.race([cocoCall({ mode: 'placement' }), new Promise(function(r){ setTimeout(function(){ r({ err: 'slow' }); }, 15000); })]);
      if(pt !== test) return; // restarted meanwhile
      if(out.data && out.data.pool) pt.pool = out.data.pool;
      else if(out.err === 'setup') ptAiOff = true;
    }
    ptNext();
  }
  function ptNext(){
    const cur = ptPick(PT_BANDS[pt.band]);
    pt.current = cur;
    const n = pt.asked.length + 1;
    document.getElementById('ptCount').textContent = t('Question ' + n + ' of ' + PT_TOTAL, 'السؤال ' + n + ' من ' + PT_TOTAL);
    document.getElementById('ptBar').style.width = Math.round((n - 1) / PT_TOTAL * 100) + '%';
    document.getElementById('ptLvl').textContent = cur.band;
    document.getElementById('ptQ').textContent = cur.q;
    document.getElementById('ptOpts').innerHTML = cur.opts.map(function(o, k){ return '<button type="button" data-o="' + k + '">' + esc(o.text) + '</button>'; }).join('');
  }
  function ptEstimate(){
    // highest level answered well (at least 2 questions, 60% or more right); otherwise A1
    let best = 0;
    PT_BANDS.forEach(function(b, k){
      const a = pt.asked.filter(function(x){ return x.band === b; });
      const ok = a.filter(function(x){ return x.right; }).length;
      if(a.length >= 2 && ok / a.length >= 0.6) best = k;
      else if(a.length === 1 && ok === 1 && k > best && k === PT_BANDS.length - 1) best = k; // got the single hardest one right
    });
    return PT_BANDS[best];
  }
  // with the AI on, the test ends with a few sentences of writing that the AI marks
  function ptAskWriting(){
    document.getElementById('ptBar').style.width = '100%';
    document.getElementById('ptText').value = '';
    document.getElementById('ptWriteErr').textContent = '';
    ptShow('write');
  }
  document.getElementById('ptWriteForm').addEventListener('submit', async function(e){
    e.preventDefault();
    const text = document.getElementById('ptText').value.trim(), btn = this.querySelector('[type=submit]'), err = document.getElementById('ptWriteErr');
    if(text.split(/\s+/).length < 8){ err.textContent = t('Write at least two full sentences (8 words or more).', 'اكتب جملتين كاملتين على الأقل (٨ كلمات أو أكتر).'); return; }
    btn.disabled = true; err.textContent = '⏳ ' + t('Coco is reading your writing…', 'كوكو بيقرا اللي كتبته…');
    const out = await cocoCall({ mode: 'placement_write', text: text });
    btn.disabled = false; err.textContent = '';
    ptFinish(out.data && out.data.cefr ? out.data : null);
  });
  document.getElementById('ptSkip').addEventListener('click', function(){ ptFinish(null); });
  function ptFinish(writing){
    // the questions give one level; the marked writing (when there is one) pulls it up or down
    const mcq = PT_RESULT_BANDS.indexOf(ptEstimate());
    const w = writing ? PT_RESULT_BANDS.indexOf(writing.cefr) : -1;
    const cefr = PT_RESULT_BANDS[w === -1 ? mcq : Math.round((mcq + w) / 2)];
    const right = pt.asked.filter(function(x){ return x.right; }).length;
    const level = PT_SITE_LEVEL[cefr];
    const MSG = {
      A1: t('A perfect place to start. You will build vocabulary, sounds and your first sentences step by step.', 'بداية ممتازة. ستبني المفردات والأصوات وجملك الأولى خطوة بخطوة.'),
      A2: t('You know the basics. Beginner lessons will make everyday English feel easy and natural.', 'تعرف الأساسيات. دروس المستوى المبتدئ ستجعل الإنجليزية اليومية سهلة وطبيعية.'),
      B1: t('A solid base. Intermediate lessons will build fluency and confidence in real conversations.', 'أساس قوي. دروس المستوى المتوسط ستبني الطلاقة والثقة في المحادثات الحقيقية.'),
      'B1+': t('Confident everyday English. Intermediate practice will grow your range and make you sound more natural.', 'إنجليزي يومي واثق. التدريب المتوسط هيوسّع كلماتك ويخليك تتكلم بشكل طبيعي أكتر.'),
      B2: t('Strong English. Intermediate-to-advanced practice will polish accuracy and natural expressions.', 'إنجليزية قوية. التدريب المتوسط إلى المتقدم سيصقل الدقة والتعبيرات الطبيعية.'),
      C1: t('Excellent English. Advanced lessons will stretch you with debate, nuance and fluent speaking.', 'إنجليزية ممتازة. الدروس المتقدمة ستتحداك بالنقاش والدقة والتحدث بطلاقة.')
    };
    document.getElementById('ptCefr').textContent = LEVEL_INFO[level].n;
    document.getElementById('ptLevel').textContent = levelName(level);
    document.getElementById('ptScore').textContent = t(right + '/' + PT_TOTAL + ' correct', right + '/' + PT_TOTAL + ' إجابة صحيحة');
    document.getElementById('ptMsg').textContent = MSG[cefr];
    document.getElementById('ptScale').innerHTML = LEVELS.map(function(l){ return '<i class="' + (l === level ? 'on' : '') + '">' + LEVEL_INFO[l].n + '</i>'; }).join('');
    const fb = document.getElementById('ptWriteFb');
    fb.hidden = !writing;
    if(writing) fb.innerHTML = '<b>✍️ ' + esc(t('Your writing', 'كتابتك')) + '</b><p dir="rtl">' + esc(writing.feedback_ar) + '</p>' +
      (writing.fix && writing.fix.better ? '<p dir="ltr"><s>' + esc(writing.fix.original) + '</s> → <em>' + esc(writing.fix.better) + '</em></p>' : '');
    const wrong = pt.asked.filter(function(x){ return !x.right; });
    document.getElementById('ptReviewWrap').hidden = !wrong.length;
    document.getElementById('ptReviewSum').textContent = t('Review your mistakes (' + wrong.length + ')', 'راجع أخطاءك (' + wrong.length + ')');
    document.getElementById('ptReview').innerHTML = wrong.map(function(x){
      return '<li><span>' + esc(x.q) + '</span><s>' + esc(x.chosen) + '</s><b>✓ ' + esc(x.correct) + '</b></li>';
    }).join('');
    document.getElementById('ptBar').style.width = '100%';
    try{ localStorage.setItem('cc_placement', JSON.stringify({ cefr: cefr, level: level, at: new Date().toISOString() })); }catch(e){}
    ptShow('done');
  }
  document.getElementById('ptBegin').addEventListener('click', ptBegin);
  document.getElementById('ptRetry').addEventListener('click', ptBegin);
  document.getElementById('ptJoin').addEventListener('click', function(){
    if(currentProfile){ openDashboard(); showDashView(isStudent() ? 'materials' : 'overview'); }
    else openAuth('signup');
  });
  document.getElementById('ptOpts').addEventListener('click', function(e){
    const b = e.target.closest('button[data-o]');
    if(!b || !pt || b.disabled) return;
    const cur = pt.current, o = cur.opts[parseInt(b.dataset.o, 10)];
    const correct = cur.opts.find(function(x){ return x.ok; }).text;
    pt.asked.push({ band: cur.band, q: cur.q, right: o.ok, chosen: o.text, correct: correct });
    // quick feedback, then move up or down a level
    document.querySelectorAll('#ptOpts button').forEach(function(x){ x.disabled = true; });
    b.classList.add(o.ok ? 'right' : 'wrong');
    pt.band = o.ok ? Math.min(PT_BANDS.length - 1, pt.band + 1) : Math.max(0, pt.band - 1);
    setTimeout(function(){ if(pt.asked.length >= PT_TOTAL) (pt.pool ? ptAskWriting() : ptFinish()); else ptNext(); }, 450);
  });

  fillLevelPickers();
  loadPublicSessions();
  loadPayLinks(); // public: so the checkout knows each plan's payment link
  loadPlanSettings();

  // ---------- level ladder: Beginner → Intermediate → Advanced, gated by exam ----------
  function isLevelUnlocked(level){
    if(isTeacher()) return true;
    const idx = LEVELS.indexOf(level);
    if(idx <= 0) return true;
    return idx <= highestPassed() + 1; // every level up to the one after the highest passed
  }
  function isLevelPassed(level){ return passedLevels.indexOf(level) !== -1; }
  function highestPassed(){ return LEVELS.reduce(function(top, l, i){ return isLevelPassed(l) ? i : top; }, -1); }

  async function loadPassedLevels(){
    if(isTeacher() || !currentProfile){ passedLevels = []; return; }
    const { data } = await sb.from('exam_attempts').select('level')
      .eq('student_id', currentProfile.id).eq('club', currentProfile.club).eq('passed', true);
    const seen = {};
    passedLevels = (data || []).map(r => r.level).filter(function(l){
      if(seen[l]) return false;
      seen[l] = true;
      return true;
    });
  }

  // ---------- student learning path: levels → books → exam ----------
  const learnPath = document.getElementById('learnPath');
  const shelfHead = document.getElementById('shelfHead');
  let clubBooks = []; // every material of the student's club, all levels

  async function loadClubBooks(){
    if(!isStudent()) return;
    const { data } = await sb.from('materials').select('*').eq('club', currentProfile.club).order('created_at', { ascending: true });
    clubBooks = data || [];
  }
  function levelStats(level){
    const books = clubBooks.filter(function(b){ return !b.level || b.level === level; }); // a book without a level is for every level
    return { total: books.length, read: books.filter(function(b){ return readIds.has(b.id); }).length, books: books };
  }
  // the level the student should be working on now
  function currentStudentLevel(){
    return LEVELS[Math.min(highestPassed() + 1, LEVELS.length - 1)];
  }

  function renderPath(){
    if(!isStudent()){ learnPath.hidden = true; return; }
    learnPath.hidden = false;
    const working = currentStudentLevel();
    const wi = LEVEL_INFO[working], ws = levelStats(working);
    const wpct = ws.total ? Math.round(ws.read * 100 / ws.total) : 0;
    const passedCount = LEVELS.filter(isLevelPassed).length;
    const now = '<div class="path-now"><span class="ps-badge">' + wi.icon + '</span><div><small>' + t('You are here', 'أنت هنا') + ' · ' +
        t(passedCount + ' of ' + LEVELS.length + ' levels passed', 'نجحت في ' + passedCount + ' من ' + LEVELS.length + ' مستويات') + '</small>' +
        '<b>' + esc(levelName(working)) + '</b>' +
        '<span class="ps-bar"><i style="width:' + wpct + '%"></i></span>' +
        '<em>' + esc(ws.total ? t(ws.read + ' of ' + ws.total + ' books read — take the level exam whenever you’re ready', 'قرأت ' + ws.read + ' من ' + ws.total + ' كتب — وادخل امتحان المستوى وقت ما تكون جاهز')
                              : t('Practise with Coco, then take the level exam whenever you’re ready', 'اتمرّن مع كوكو، وادخل امتحان المستوى وقت ما تكون جاهز')) + '</em></div></div>';
    const chips = LEVELS.map(function(l){
      const passed = isLevelPassed(l), unlocked = isLevelUnlocked(l);
      return '<button type="button" class="lv-chip' + (passed ? ' passed' : !unlocked ? ' locked' : '') + (l === currentLevel ? ' active' : '') + (l === working ? ' working' : '') +
        '" data-level="' + l + '" title="' + esc(levelName(l)) + '"' + (unlocked ? '' : ' aria-disabled="true"') + '>' + (passed ? '✓ ' : !unlocked ? '🔒 ' : '') + LEVEL_INFO[l].n + '</button>';
    }).join('');
    learnPath.innerHTML = now + '<div class="path-levels">' + chips + '</div>';
  }
  learnPath.addEventListener('click', function(e){
    const b = e.target.closest('[data-level]');
    if(!b) return;
    const lv = b.dataset.level;
    if(!isLevelUnlocked(lv)){
      toast('🔒 ' + t('Locked level', 'مستوى مغلق'), t('Pass the exam of the level before it first.', 'انجح أولاً في امتحان المستوى السابق.'));
      return;
    }
    currentLevel = lv;
    examPanel.hidden = true;
    loadMaterials();
  });

  function renderShelfHead(){
    if(!isStudent()){ shelfHead.hidden = true; return; }
    const st = levelStats(currentLevel);
    shelfHead.hidden = false;
    document.getElementById('shelfTitle').textContent = t('Books — ', 'كتب — ') + levelName(currentLevel);
    document.getElementById('shelfMeta').textContent = st.total
      ? t('Open a book to read it here. ' + st.read + ' of ' + st.total + ' read.', 'افتح أي كتاب لقراءته هنا. قرأت ' + st.read + ' من ' + st.total + '.')
      : '';
  }

  // overview "what to do next" card for students
  function renderNextStep(){
    const box = document.getElementById('ovNext');
    if(!isStudent()){ box.hidden = true; return; }
    const lv = currentStudentLevel();
    const st = levelStats(lv);
    const unread = st.books.find(function(b){ return !readIds.has(b.id); });
    let icon, title, text, btn, action;
    if(isLevelPassed(LEVELS[LEVELS.length - 1])){
      icon = '🏆'; title = t('You finished every level!', 'أنهيت كل المستويات!');
      text = t('Amazing work. Your certificates are ready to print.', 'عمل رائع. شهاداتك جاهزة للطباعة.');
      btn = t('My certificates', 'شهاداتي'); action = 'certs';
    } else if(unread){
      icon = '📖'; title = t('Continue reading', 'تابع القراءة');
      text = '“' + unread.title + '” · ' + levelName(lv);
      btn = t('Open the book', 'افتح الكتاب'); action = 'read:' + unread.id;
    } else if(st.total){
      icon = '📝'; title = t('You read every book in this level', 'قرأت كل كتب هذا المستوى');
      text = t('Take the ' + levelName(lv) + ' exam to move up.', 'ادخل امتحان ' + levelName(lv) + ' لتنتقل للمستوى التالي.');
      btn = t('Start the exam', 'ابدأ الامتحان'); action = 'exam';
    } else {
      icon = '📝'; title = t('Ready to move up?', 'جاهز تطلع مستوى؟');
      text = t('Practise with Coco, then take the ' + levelName(lv) + ' exam.', 'اتمرّن مع كوكو، وبعدين ادخل امتحان ' + levelName(lv) + '.');
      btn = t('Start the exam', 'ابدأ الامتحان'); action = 'exam';
    }
    box.hidden = false;
    box.innerHTML = '<div class="ns-icon">' + icon + '</div><div class="ns-text"><small>' + t('Your next step', 'خطوتك التالية') + '</small><b>' + esc(title) + '</b><span>' + esc(text) + '</span></div>' +
      '<button class="btn-primary" type="button" data-next="' + esc(action) + '">' + esc(btn) + ' →</button>';
  }
  document.getElementById('ovNext').addEventListener('click', async function(e){
    const b = e.target.closest('[data-next]');
    if(!b) return;
    const a = b.dataset.next;
    if(a === 'certs'){ showDashView('progress'); return; }
    currentLevel = currentStudentLevel();
    showDashView('materials');
    await loadMaterials();
    if(a.indexOf('read:') === 0){
      const book = clubBooks.find(function(x){ return String(x.id) === a.slice(5); });
      if(book) openReader(book);
    } else if(a === 'exam'){
      startExamBtn.click();
    }
  });

  function updateLevelTabsUI(){
    if(!levelTabs) return;
    levelTabs.querySelectorAll('.level-tab').forEach(function(btn){
      const lv = btn.dataset.level;
      btn.classList.toggle('active', lv === currentLevel);
      btn.classList.toggle('locked', !isLevelUnlocked(lv));
      btn.classList.toggle('passed', isLevelPassed(lv));
    });
  }

  if(levelTabs){
    levelTabs.addEventListener('click', function(e){
      const btn = e.target.closest('.level-tab');
      if(!btn) return;
      const lv = btn.dataset.level;
      if(!isLevelUnlocked(lv)) return;
      currentLevel = lv;
      examPanel.hidden = true;
      updateLevelTabsUI();
      loadMaterials();
    });
  }

  async function loadMaterials(){
    const libLevelSelect = document.getElementById('libLevel');
    if(libLevelSelect) libLevelSelect.value = currentLevel;
    updateLevelTabsUI();
    levelTabs.hidden = isStudent();
    renderPath();
    renderShelfHead();

    const locked = !isTeacher() && !isLevelUnlocked(currentLevel);
    levelLockedMsg.hidden = !locked;
    libGrid.hidden = locked;
    if(locked){
      const prev = LEVELS[LEVELS.indexOf(currentLevel) - 1];
      document.getElementById('lockedTitle').textContent = t('Level ' + LEVEL_INFO[currentLevel].n + ' is locked', 'المستوى ' + LEVEL_INFO[currentLevel].n + ' مغلق');
      document.getElementById('lockedText').textContent = t('Pass the ' + levelName(prev) + ' exam to open this level.',
                                                            'انجح في امتحان ' + levelName(prev) + ' عشان يفتحلك المستوى ده.');
      shelfHead.hidden = true;
      examCTA.hidden = true;
      examPanel.hidden = true;
      if(examAdmin) examAdmin.hidden = true;
      return;
    }

    // this level's books plus the books meant for every level
    let query = sb.from('materials').select('*').or('level.is.null,level.eq."' + currentLevel + '"').order('created_at', { ascending: false });
    if(!isTeacher()){
      query = query.eq('club', currentProfile.club);
    } else if(materialsFilter !== 'all'){
      query = query.eq('club', materialsFilter);
    }
    const { data, error } = await query;
    if(error){
      materialsCache = [];
      libGrid.innerHTML = '<div class="lib-empty">' + esc(friendlyErrorMessage(error)) + '</div>';
    } else {
      materialsCache = data || [];
      await refreshBookAccess(materialsCache);
      renderMaterials();
    }
    if(isTeacher()) checkUnprotected();

    // exam call-to-action / admin, scoped to the level now showing
    const isLastLevel = LEVELS.indexOf(currentLevel) === LEVELS.length - 1;
    if(isTeacher()){
      examCTA.hidden = true;
      examPanel.hidden = true;
      if(examAdmin){
        const scopedClub = materialsFilter !== 'all' ? materialsFilter : null;
        examAdmin.hidden = !scopedClub;
        if(scopedClub) await loadExamQuestionsAdmin(scopedClub, currentLevel);
      }
    } else {
      if(examAdmin) examAdmin.hidden = true;
      if(!examPanel.hidden) return; // keep an exam in progress on screen
      examCTA.hidden = !isStudent();
      const passedHere = isLevelPassed(currentLevel);
      examCTA.classList.toggle('passed', passedHere);
      examCTA.dataset.state = passedHere ? 'passed' : 'open';
      document.getElementById('examCTAIcon').textContent = passedHere ? '🎓' : '📝';
      document.getElementById('examCTATitle').textContent = passedHere
        ? t('You passed this level!', 'نجحت في هذا المستوى!')
        : t('Level exam — ', 'امتحان المستوى — ') + levelName(currentLevel);
      examCTAText.textContent = passedHere
        ? (isLastLevel ? t('You completed the final level. Your certificate is ready.', 'أكملت المستوى الأخير. شهادتك جاهزة.')
                       : t('Your certificate is ready and ' + levelName(LEVELS[LEVELS.indexOf(currentLevel) + 1]) + ' is open.', 'شهادتك جاهزة ومستوى ' + levelName(LEVELS[LEVELS.indexOf(currentLevel) + 1]) + ' مفتوح.'))
        : t('Ready? Score 70% or more to ' + (isLastLevel ? 'earn your final certificate.' : 'unlock ' + levelName(LEVELS[LEVELS.indexOf(currentLevel) + 1]) + ' and get a certificate.'),
            'جاهز؟ احصل على ٧٠٪ أو أكثر ' + (isLastLevel ? 'لتحصل على شهادتك النهائية.' : 'لتفتح مستوى ' + levelName(LEVELS[LEVELS.indexOf(currentLevel) + 1]) + ' وتحصل على شهادة.'));
      startExamBtn.textContent = passedHere ? t('View certificate', 'عرض الشهادة') : t('Start the exam', 'ابدأ الامتحان');
    }
  }

  // ---------- material cards ----------
  const libSearch = document.getElementById('libSearch');
  let materialsCache = [];

  function renderMaterials(){
    const q = (libSearch && libSearch.value || '').trim().toLowerCase();
    const items = !q ? materialsCache : materialsCache.filter(function(m){
      return (m.title + ' ' + (m.file_name || '') + ' ' + m.club).toLowerCase().indexOf(q) !== -1;
    });
    libGrid.classList.toggle('shelf', isStudent());
    if(materialsCache.length === 0){
      libGrid.innerHTML = isStudent()
        ? '<div class="empty-state"><div>📚</div><b>' + t('No books here yet', 'لا توجد كتب هنا بعد') + '</b><span>' + t('Your teacher will add the books for this level soon.', 'سيضيف معلمك كتب هذا المستوى قريباً.') + '</span></div>'
        : '<div class="lib-empty">No materials for this level yet.</div>';
      return;
    }
    if(items.length === 0){
      libGrid.innerHTML = '<div class="lib-empty">' + esc(t('Nothing matches “' + q + '”.', 'لا توجد نتائج لـ «' + q + '».')) + '</div>';
      return;
    }
    const newSince = Date.now() - 3 * 86400000; // "NEW" badge for 3 days
    libGrid.innerHTML = items.map(function(item){
      const ext = fileExt(item.file_name || item.file_path);
      const isNew = new Date(item.created_at).getTime() > newSince;
      const isRead = readIds.has(item.id);
      const badges = (isNew ? '<span class="badge-new">' + t('NEW', 'جديد') + '</span>' : '') +
                     (isRead ? '<span class="badge-read">✓ ' + t('READ', 'قرأته') + '</span>' : '');
      if(isStudent()){
        const full = canReadFull(item), dl = bookDownload(item);
        const readLabel = full ? (isRead ? t('Read again', 'اقرأ مرة أخرى') : t('Read', 'اقرأ'))
          : item.preview_path ? t('Free preview', 'معاينة مجانية') : t('Unlock', 'افتح الكتاب');
        return '<div class="book' + (isRead ? ' is-read' : '') + (full ? '' : ' locked') + '" style="--h:' + hueOf(item.title) + '">' +
          '<button class="book-cover" type="button" data-open="' + item.id + '" aria-label="' + esc(t('Read ', 'اقرأ ') + item.title) + '">' +
            '<span class="bc-spine"></span>' +
            '<span class="bc-icon">' + fileIcon(ext) + '</span>' +
            '<span class="bc-title">' + esc(item.title) + '</span>' +
            (full ? '' : '<span class="bc-lock">🔒 ' + (item.preview_path ? t((item.preview_pages || PREVIEW_PAGES) + ' free pages', (item.preview_pages || PREVIEW_PAGES) + ' صفحات مجانية') : t('With a plan', 'مع الاشتراك')) + '</span>') +
            (isRead ? '<span class="bc-done">✓</span>' : isNew ? '<span class="bc-new">' + t('NEW', 'جديد') + '</span>' : '') +
          '</button>' +
          '<div class="book-actions">' +
            '<button class="book-read" type="button" data-open="' + item.id + '">' + readLabel + '</button>' +
            (dl ? '<a class="book-dl" data-dl="' + item.id + '" href="' + esc(dl) + '" target="_blank" rel="noopener" title="' + t('Download', 'تحميل') + '" aria-label="' + t('Download', 'تحميل') + '">⬇</a>' : '') +
          '</div>' +
        '</div>';
      }
      return '<div class="lib-card' + (isRead ? ' is-read' : '') + '">' +
        (isTeacher() ? '<button class="rm" type="button" data-del="' + item.id + '" title="Delete" aria-label="Delete">✕</button>' : '') +
        (badges ? '<div class="lib-badges">' + badges + '</div>' : '') +
        '<span class="ftype">' + fileIcon(ext) + '</span>' +
        '<h5>' + esc(item.title) + '</h5>' +
        '<div class="meta">' + esc(item.club) + ' · ' + esc(item.level ? levelName(item.level) : t('All levels', 'كل المستويات')) +
          (item.file_size ? ' · <span class="size">' + fmtSize(item.file_size) + '</span>' : '') + '</div>' +
        '<div class="meta lib-guard">' + (isProtected(item)
          ? '🔒 ' + (item.preview_path ? t('Protected · ' + (item.preview_pages || PREVIEW_PAGES) + '-page free preview', 'محمي · معاينة مجانية ' + (item.preview_pages || PREVIEW_PAGES) + ' صفحات') : t('Protected · plan only', 'محمي · بالاشتراك فقط'))
          : '<span class="warn">⚠ ' + t('Open to everyone', 'مفتوح للجميع') + '</span>') + '</div>' +
        '<div class="lib-actions">' +
          '<button class="lib-read" type="button" data-open="' + item.id + '">' + t('Read', 'اقرأ') + '</button>' +
          (isTeacher() ? '<button class="lib-read lib-guide" type="button" data-guide="' + item.id + '" title="' + esc(t('Coco explains this book to the students', 'كوكو يشرح الكتاب للطلاب')) + '">🤖 ' + (item.guide ? t('Edit guide', 'عدّل الشرح') : t('Coco guide', 'شرح كوكو')) + '</button>' : '') +
          '<a class="lib-download" data-dl="' + item.id + '" href="' + esc(bookDownload(item)) + '" target="_blank" rel="noopener">' + t('Download', 'تحميل') + '</a>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  function findMaterial(id){
    return materialsCache.find(function(m){ return String(m.id) === String(id); });
  }

  if(libSearch) libSearch.addEventListener('input', renderMaterials);

  libGrid.addEventListener('click', function(e){
    const openBtn = e.target.closest('[data-open]');
    const delBtn = e.target.closest('[data-del]');
    const dl = e.target.closest('[data-dl]');
    const guideBtn = e.target.closest('[data-guide]');
    if(guideBtn){ window.__cocoGuide(guideBtn.dataset.guide); return; }
    if(openBtn){ const m = findMaterial(openBtn.dataset.open); if(m) openReader(m); }
    else if(delBtn){ const m = findMaterial(delBtn.dataset.del); if(m) deleteMaterial(m); }
    else if(dl){ const m = findMaterial(dl.dataset.dl); if(m && canReadFull(m)) logRead(m); }
  });

  async function deleteMaterial(item){
    if(!confirm(t('Delete “' + item.title + '”? Students will no longer see it.', 'حذف «' + item.title + '»؟ لن يراه الطلاب بعد الآن.'))) return;
    const { data, error } = await sb.from('materials').delete().eq('id', item.id).select('id');
    if(error || !data || data.length === 0){
      toast(t('Couldn’t delete', 'تعذّر الحذف'), error ? friendlyErrorMessage(error) : t('You don’t have permission to delete this.', 'ليست لديك صلاحية حذف هذا الملف.'), true);
      return;
    }
    await sb.storage.from(isProtected(item) ? 'books' : 'materials').remove([item.file_path]);
    if(item.preview_path) await sb.storage.from('materials').remove([item.preview_path]);
    toast(t('Deleted', 'تم الحذف'), item.title);
    await loadMaterials();
    await loadOverviewStats();
  }

  // ---------- protect books uploaded before the preview system ----------
  const protectBox = document.getElementById('protectBox');
  let unprotected = [];
  async function checkUnprotected(){
    if(!protectBox) return;
    const { data, error } = await sb.from('materials').select('id, title, file_path, file_name, mime_type').eq('bucket', 'materials');
    unprotected = error ? [] : (data || []);
    protectBox.hidden = !unprotected.length;
    if(unprotected.length) document.getElementById('protectText').textContent = t(
      unprotected.length + (unprotected.length === 1 ? ' book is' : ' books are') + ' still open to every student. Protect them so students read a ' + PREVIEW_PAGES + '-page preview and the whole book opens with a plan.',
      unprotected.length + ' كتاب ما زال مفتوحاً لكل الطلاب. احمِها ليقرأ الطالب معاينة ' + PREVIEW_PAGES + ' صفحات ويُفتح الكتاب كاملاً مع الاشتراك.');
  }
  if(protectBox) document.getElementById('protectBtn').addEventListener('click', async function(){
    const btn = this;
    btn.disabled = true;
    let done = 0, failed = 0;
    for(const m of unprotected){
      btn.textContent = t('Protecting ' + (done + failed + 1) + ' of ' + unprotected.length + '…', 'جارٍ حماية ' + (done + failed + 1) + ' من ' + unprotected.length + '…');
      try{
        const res = await fetch(publicUrl(m.file_path));
        if(!res.ok) throw new Error('download ' + res.status);
        const blob = await res.blob();
        const file = new File([blob], m.file_name || m.file_path.split('/').pop(), { type: m.mime_type || blob.type || 'application/octet-stream' });
        const stored = await storeBook(m.file_path, file, file.name);
        const { error } = await sb.from('materials').update(stored).eq('id', m.id);
        if(error) throw error;
        await sb.storage.from('materials').remove([m.file_path]); // the open copy is gone; only the private one is left
        done++;
      }catch(err){ failed++; }
    }
    btn.disabled = false;
    btn.textContent = t('Protect books', 'احمِ الكتب');
    toast(t('Books protected', 'تمت حماية الكتب'), t(done + ' done' + (failed ? ', ' + failed + ' failed — try again' : ''), 'تم ' + done + (failed ? '، وفشل ' + failed + ' — حاول مرة أخرى' : '')), !!failed);
    await loadMaterials();
  });

  // ---------- in-site book reader ----------
  const reader = document.getElementById('reader');
  const readerTitle = document.getElementById('readerTitle');
  const readerBody = document.getElementById('readerBody');
  const readerDownload = document.getElementById('readerDownload');

  const readerLock = document.getElementById('readerLock');
  function openReader(item){
    const full = canReadFull(item);
    const ext = full ? fileExt(item.file_name || item.file_path) : (item.preview_path ? 'pdf' : '');
    const url = bookSrc(item);
    readerTitle.textContent = item.title;
    const dl = bookDownload(item);
    readerDownload.hidden = !dl;
    readerDownload.href = dl || '#';
    readerLock.hidden = full;
    if(!full){
      document.getElementById('readerLockText').textContent = item.preview_path
        ? t('Free preview: the first ' + (item.preview_pages || PREVIEW_PAGES) + (item.pages ? ' of ' + item.pages : '') + ' pages. Choose a plan to read the whole book.',
            'معاينة مجانية: أول ' + (item.preview_pages || PREVIEW_PAGES) + ' صفحات' + (item.pages ? ' من ' + item.pages : '') + '. اختر خطة لقراءة الكتاب كاملاً.')
        : t('This book opens with a plan. Choose a plan to read it.', 'هذا الكتاب متاح مع الاشتراك. اختر خطة لقراءته.');
    }
    let html;
    if(!url){
      html = '<div class="reader-msg reader-locked">🔒<br>' + esc(t('This book is part of the plans.', 'هذا الكتاب ضمن الاشتراك.')) + '</div>';
    } else if(ext === 'pdf'){
      html = '<iframe src="' + esc(url) + '#view=FitH" title="' + esc(item.title) + '"></iframe>';
    } else if(['png','jpg','jpeg','webp','gif'].indexOf(ext) !== -1){
      html = '<img src="' + esc(url) + '" alt="' + esc(item.title) + '">';
    } else if(ext === 'mp4'){
      html = '<video src="' + esc(url) + '" controls playsinline></video>';
    } else if(ext === 'mp3'){
      html = '<audio src="' + esc(url) + '" controls></audio>';
    } else if(['doc','docx','ppt','pptx'].indexOf(ext) !== -1){
      html = '<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=' + encodeURIComponent(url) + '" title="' + esc(item.title) + '"></iframe>';
    } else {
      html = '<p class="reader-msg">' + esc(t('This file type can’t be previewed in the browser — use Download to open it.',
        'لا يمكن عرض هذا النوع من الملفات داخل المتصفح — استخدم زر التحميل لفتحه.')) + '</p>';
    }
    readerBody.innerHTML = html;
    reader.hidden = false;
    document.body.style.overflow = 'hidden';
    if(full) logRead(item); // the streak counts real reading, not previews
  }
  document.getElementById('readerPlan').addEventListener('click', function(){
    closeReader();
    if(typeof showDashView === 'function') showDashView('myplan');
  });
  function closeReader(){
    reader.hidden = true;
    readerBody.innerHTML = ''; // stops audio / video
    document.body.style.overflow = '';
  }
  document.getElementById('readerClose').addEventListener('click', closeReader);
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && !reader.hidden) closeReader(); });

  // ---------- reading tracker: streaks + club leaderboard ----------
  const readingHub = document.getElementById('readingHub');
  const streakCard = document.getElementById('streakCard');
  const streakDays = document.getElementById('streakDays');
  const streakLabel = document.getElementById('streakLabel');
  const streakWeek = document.getElementById('streakWeek');
  const leaderTitle = document.getElementById('leaderTitle');
  const leaderList = document.getElementById('leaderList');
  let readIds = new Set();
  let readDays = new Set();
  let readsAvailable = true;

  function isoDay(offset){
    const d = new Date();
    d.setUTCDate(d.getUTCDate() + (offset || 0));
    return d.toISOString().slice(0, 10); // the database stores read_on in UTC
  }

  async function logRead(item){
    if(!readsAvailable || !currentProfile || isTeacher()) return;
    const today = isoDay(0);
    if(readIds.has(item.id) && readDays.has(today)) return;
    const { error } = await sb.from('material_reads').upsert(
      { student_id: currentProfile.id, material_id: item.id, club: currentProfile.club, read_on: today },
      { onConflict: 'student_id,material_id,read_on', ignoreDuplicates: true });
    if(error){ if(isMissing(error)) readsAvailable = false; return; }
    const firstToday = !readDays.has(today);
    readIds.add(item.id);
    readDays.add(today);
    renderMaterials();
    renderPath();
    renderShelfHead();
    renderNextStep();
    loadOverviewStats();
    await loadReadingHub();
    if(firstToday){
      toast('🔥 ' + t('Streak: ' + streakDays.textContent + ' day(s)', 'سلسلة القراءة: ' + streakDays.textContent + ' يوم'),
            t('Nice — keep reading every day!', 'رائع — استمر في القراءة كل يوم!'));
    }
  }

  function renderStreak(){
    let streak = 0;
    let offset = readDays.has(isoDay(0)) ? 0 : -1; // today not read yet → the streak is still alive from yesterday
    while(readDays.has(isoDay(offset))){ streak++; offset--; }
    const readToday = readDays.has(isoDay(0));
    streakDays.textContent = streak;
    streakCard.classList.toggle('hot', streak > 0 && readToday);
    streakCard.classList.toggle('cold', streak === 0);
    streakLabel.textContent = streak === 0
      ? t('Open any book to start a reading streak', 'افتح أي كتاب لتبدأ سلسلة القراءة')
      : (readToday ? t('day reading streak — keep it up!', 'يوم متتالٍ من القراءة — واصل!')
                   : t('day streak — read today to keep it alive', 'يوم متتالٍ — اقرأ اليوم حتى لا تنقطع السلسلة'));
    const locale = isAr() ? 'ar' : 'en';
    let cells = '';
    for(let i = -6; i <= 0; i++){
      const day = isoDay(i);
      const label = new Date(day + 'T12:00:00Z').toLocaleDateString(locale, { weekday: 'narrow', timeZone: 'UTC' });
      cells += '<i class="' + (readDays.has(day) ? 'on' : '') + '" title="' + day + '">' + esc(label) + '</i>';
    }
    streakWeek.innerHTML = cells;
  }

  async function loadReadingHub(){
    if(!readingHub || !currentProfile || !readsAvailable || isParent()) return;
    if(!isTeacher()){
      const { data, error } = await sb.from('material_reads').select('material_id, read_on')
        .eq('student_id', currentProfile.id).order('read_on', { ascending: false }).limit(1000);
      if(error){ if(isMissing(error)){ readsAvailable = false; readingHub.hidden = true; } return; }
      readIds = new Set((data || []).map(function(r){ return r.material_id; }));
      readDays = new Set((data || []).map(function(r){ return r.read_on; }));
      renderStreak();
    }
    streakCard.hidden = isTeacher();
    const { data: board, error: lbErr } = await sb.rpc('club_leaderboard', { p_club: isTeacher() ? null : currentProfile.club, p_days: 7 });
    if(lbErr){ if(isMissing(lbErr)){ readsAvailable = false; readingHub.hidden = true; } return; }
    readingHub.hidden = false;
    readingHub.classList.toggle('solo', isTeacher());
    leaderTitle.textContent = isTeacher()
      ? t('Top readers this week — all clubs', 'أكثر الطلاب قراءةً هذا الأسبوع — كل النوادي')
      : t('Top readers in ' + currentProfile.club + ' this week', 'الأكثر قراءةً في ' + currentProfile.club + ' هذا الأسبوع');
    const medals = ['🥇', '🥈', '🥉'];
    leaderList.innerHTML = (board && board.length) ? board.map(function(r, i){
      return '<li class="' + (r.student_id === currentProfile.id ? 'me' : '') + '">' +
        '<span class="rank">' + (medals[i] || (i + 1)) + '</span>' +
        '<span class="nm">' + esc(r.full_name || '—') + (isTeacher() && r.club ? '<small>' + esc(r.club) + '</small>' : '') + '</span>' +
        '<span class="ct">' + r.books + ' ' + t(r.books === 1 ? 'book' : 'books', 'كتاب') + '</span>' +
      '</li>';
    }).join('') : '<li class="empty">' + esc(t('No one has opened a book this week yet — be the first!', 'لم يفتح أحد كتاباً هذا الأسبوع بعد — كن الأول!')) + '</li>';
  }

  // ---------- live updates (Supabase Realtime) ----------
  let rtChannel = null;
  function startRealtime(){
    if(rtChannel || !sb.channel) return;
    rtChannel = sb.channel('cc-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'materials' }, function(payload){
        const m = payload.new || {};
        if(!currentProfile || m.uploaded_by === currentProfile.id) return;
        if(isParent() || (!isTeacher() && m.club !== currentProfile.club)) return;
        toast('📚 ' + t('New book added', 'تمت إضافة كتاب جديد'), m.title + (m.level ? ' · ' + levelName(m.level) : ''));
        loadClubBooks().then(function(){ loadMaterials(); renderNextStep(); });
        loadOverviewStats();
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'materials' }, function(){
        if(currentProfile){ loadMaterials(); loadOverviewStats(); }
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, function(payload){
        const n = payload.new || {};
        if(!currentProfile || n.created_by === currentProfile.id) return;
        if(isStudent() && n.club && n.club !== currentProfile.club) return;
        toast('🔔 ' + n.title, n.body);
        loadNotifications();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'assignments' }, function(payload){
        const a = payload.new || {};
        if(!isStudent() || a.club !== currentProfile.club) return;
        toast('📝 ' + t('New homework', 'واجب جديد'), a.title || '');
        if(!document.querySelector('.dash-view[data-view="homework"]').hidden) loadHomework();
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, function(payload){
        onNewMessage(payload.new || {});
      })
      .subscribe();
  }
  function stopRealtime(){
    if(rtChannel){ sb.removeChannel(rtChannel); rtChannel = null; }
  }

  if(libTabs){
    libTabs.addEventListener('click', function(e){
      const btn = e.target.closest('.lib-tab');
      if(!btn) return;
      libTabs.querySelectorAll('.lib-tab').forEach(function(t){ t.classList.remove('active'); });
      btn.classList.add('active');
      materialsFilter = btn.dataset.filter;
      const libClubSelect = document.getElementById('libClub');
      if(libClubSelect && materialsFilter !== 'all') libClubSelect.value = materialsFilter; // upload goes to the club being viewed
      loadMaterials();
    });
  }

  // ---------- upload (drag & drop, progress, safe storage keys) ----------
  const MAX_UPLOAD = 50 * 1024 * 1024;
  const libFile = document.getElementById('libFile');
  const libTitle = document.getElementById('libTitle');
  const libSubmit = document.getElementById('libSubmit');
  const dropzone = document.getElementById('dropzone');
  const dzText = document.getElementById('dzText');
  const uploadStatus = document.getElementById('uploadStatus');
  const upMsg = document.getElementById('upMsg');
  const upBar = uploadStatus.querySelector('.up-bar');
  const upBarFill = document.getElementById('upBarFill');

  function setUploadStatus(state, msg){
    uploadStatus.hidden = !state;
    uploadStatus.classList.toggle('ok', state === 'ok');
    uploadStatus.classList.toggle('err', state === 'err');
    upBar.classList.toggle('busy', state === 'busy');
    upBarFill.style.width = state === 'ok' ? '100%' : '0';
    upMsg.textContent = msg || '';
  }
  function showPickedFile(){
    const f = libFile.files[0];
    dropzone.classList.toggle('has-file', !!f);
    dzText.textContent = f ? f.name + ' · ' + fmtSize(f.size) : t('Drag a book here, or click to choose a file', 'اسحب كتاباً هنا أو اضغط لاختيار ملف');
  }
  libFile.addEventListener('change', function(){
    const f = libFile.files[0];
    showPickedFile();
    setUploadStatus(null);
    if(f && !libTitle.value.trim()) libTitle.value = f.name.replace(/\.[^.]+$/, '').replace(/[_\s]+/g, ' ').trim();
  });
  ['dragenter', 'dragover'].forEach(function(ev){
    dropzone.addEventListener(ev, function(e){ e.preventDefault(); dropzone.classList.add('drag'); });
  });
  ['dragleave', 'drop'].forEach(function(ev){
    dropzone.addEventListener(ev, function(e){ e.preventDefault(); dropzone.classList.remove('drag'); });
  });
  dropzone.addEventListener('drop', function(e){
    const files = e.dataTransfer && e.dataTransfer.files;
    if(!files || !files.length) return;
    libFile.files = files;
    libFile.dispatchEvent(new Event('change'));
  });

  libForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const club = document.getElementById('libClub').value;
    const level = document.getElementById('libLevel').value || null; // empty = for every level
    const title = libTitle.value.trim();
    const file = libFile.files[0];
    if(!title || !file){ setUploadStatus('err', t('Add a title and choose a file first.', 'أضف عنواناً واختر ملفاً أولاً.')); return; }
    if(file.size > MAX_UPLOAD){ setUploadStatus('err', t('The file is too big — the limit is 50 MB.', 'الملف كبير جداً — الحد الأقصى 50 ميجابايت.')); return; }

    const path = buildStoragePath(club, level || 'All levels', file.name);
    libSubmit.disabled = true;
    setUploadStatus('busy', t('Uploading “' + file.name + '”…', 'جارٍ رفع «' + file.name + '»…'));
    try{
      const stored = await storeBook(path, file, file.name);
      const row = Object.assign({ club: club, level: level, title: title, file_path: path, uploaded_by: currentProfile.id,
                    file_name: file.name, file_size: file.size, mime_type: file.type || null }, stored);
      let { error: insErr } = await sb.from('materials').insert(row);
      if(insErr){
        await sb.storage.from('books').remove([path]); // don't leave an orphan file behind
        if(stored.preview_path) await sb.storage.from('materials').remove([stored.preview_path]);
        throw insErr;
      }

      libForm.reset();
      document.getElementById('libClub').value = club;
      showPickedFile();
      setUploadStatus('ok', stored.preview_path
        ? t('Uploaded! Students in ' + club + ' can read the first ' + stored.preview_pages + ' pages free; the whole book opens with a plan.',
            'تم الرفع! يقرأ طلاب ' + club + ' أول ' + stored.preview_pages + ' صفحات مجاناً، والكتاب كامل مع الاشتراك.')
        : t('Uploaded! “' + title + '” opens for students in ' + club + ' who have a plan.', 'تم الرفع! «' + title + '» متاح لطلاب ' + club + ' المشتركين.'));
      // jump to where the new book lives so the teacher sees it straight away
      currentLevel = level;
      if(materialsFilter !== 'all' && materialsFilter !== club) applyClubFilter(club);
      else await loadMaterials();
      await loadOverviewStats();
    } catch(err){
      setUploadStatus('err', friendlyErrorMessage(err));
    } finally {
      libSubmit.disabled = false;
    }
  });

  // ---------- taking the exam (student) ----------
  function shuffleArr(arr){
    for(let i = arr.length - 1; i > 0; i--){
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  // 'server' = get_exam()/submit_exam() from schema.sql (answers never reach the browser);
  // 'client' = older database without those functions.
  let examMode = 'server';

  // one question at a time, with a progress bar
  let quizIndex = 0;
  const quizPrev = document.getElementById('quizPrev');
  const quizNext = document.getElementById('quizNext');
  const quizNav = document.getElementById('quizNav');
  function answered(qi){ return !!document.querySelector('input[name="examQ' + qi + '"]:checked'); }
  function showQuestion(i){
    quizIndex = Math.max(0, Math.min(i, currentExamQuestions.length - 1));
    examQuestionsEl.querySelectorAll('.exam-q').forEach(function(el){ el.hidden = +el.dataset.q !== quizIndex; });
    const total = currentExamQuestions.length, last = quizIndex === total - 1;
    document.getElementById('quizCount').textContent = t('Question ' + (quizIndex + 1) + ' of ' + total, 'السؤال ' + (quizIndex + 1) + ' من ' + total);
    document.getElementById('quizBar').style.width = Math.round((quizIndex + 1) * 100 / total) + '%';
    quizNav.hidden = false;
    quizPrev.hidden = quizIndex === 0;
    quizNext.hidden = last;
    submitExamBtn.hidden = !last;
    quizNext.disabled = !answered(quizIndex);
    submitExamBtn.disabled = !answered(quizIndex);
  }
  examQuestionsEl.addEventListener('change', function(){
    quizNext.disabled = !answered(quizIndex);
    submitExamBtn.disabled = !answered(quizIndex);
    // small pause so the choice is visible, then move on
    if(quizIndex < currentExamQuestions.length - 1) setTimeout(function(){ showQuestion(quizIndex + 1); }, 350);
  });
  quizPrev.addEventListener('click', function(){ showQuestion(quizIndex - 1); });
  quizNext.addEventListener('click', function(){ showQuestion(quizIndex + 1); });
  function closeExam(){
    examPanel.hidden = true;
    loadMaterials();
  }
  document.getElementById('examCancel').addEventListener('click', function(){
    const res = document.getElementById('quizResult');
    if(res.hidden && !confirm(t('Leave the exam? Your answers will not be saved.', 'الخروج من الامتحان؟ لن يتم حفظ إجاباتك.'))) return;
    closeExam();
  });
  document.getElementById('quizResult').addEventListener('click', function(e){
    const b = e.target.closest('[data-res]');
    if(!b) return;
    const a = b.dataset.res;
    if(a === 'certs'){ examPanel.hidden = true; showDashView('progress'); }
    else if(a === 'retry'){ startExamBtn.click(); }
    else if(a === 'next'){ currentLevel = currentStudentLevel(); closeExam(); }
    else closeExam();
  });

  if(startExamBtn){
    startExamBtn.addEventListener('click', async function(){
      if(examCTA.dataset.state === 'passed'){ showDashView('progress'); return; }
      const rpc = await sb.rpc('get_exam', { p_club: currentProfile.club, p_level: currentLevel });
      if(!rpc.error){
        examMode = 'server';
        currentExamQuestions = (rpc.data || []).map(function(q){
          return { id: q.id, question: q.question, options: (q.options || []).map(function(o){ return { text: o }; }) };
        });
      } else if(isMissing(rpc.error)){
        examMode = 'client';
        const { data, error } = await sb.from('exam_questions').select('*')
          .eq('club', currentProfile.club).eq('level', currentLevel).order('created_at');
        if(error){ alert(friendlyErrorMessage(error)); return; }
        currentExamQuestions = (data || []).map(function(q){
          const options = shuffleArr([
            { text: q.option_a, correct: true },
            { text: q.option_b, correct: false },
            { text: q.option_c, correct: false },
            { text: q.option_d, correct: false }
          ]);
          return { id: q.id, question: q.question, options: options };
        });
      } else {
        alert(friendlyErrorMessage(rpc.error));
        return;
      }
      if(currentExamQuestions.length === 0){ alert(t('No exam questions yet for this level — ask your teacher to add some.', 'لا توجد أسئلة امتحان لهذا المستوى بعد — اطلب من معلمك إضافتها.')); return; }
      examTitle.textContent = t('Level exam — ', 'امتحان المستوى — ') + levelName(currentLevel);
      examQuestionsEl.innerHTML = currentExamQuestions.map(function(q, qi){
        return '<div class="exam-q" data-q="' + qi + '"><p>' + esc(q.question) + '</p><div class="exam-opts">' +
          q.options.map(function(o, oi){
            return '<label class="exam-opt"><input type="radio" name="examQ' + qi + '" value="' + oi + '"><span class="eo-key">' + 'ABCD'.charAt(oi) + '</span><span>' + esc(o.text) + '</span></label>';
          }).join('') +
          '</div></div>';
      }).join('');
      examResult.textContent = '';
      document.getElementById('quizResult').hidden = true;
      examQuestionsEl.hidden = false;
      examCTA.hidden = true;
      examPanel.hidden = false;
      showQuestion(0);
      examPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  if(submitExamBtn){
    submitExamBtn.addEventListener('click', async function(){
      let scorePct, passed;
      if(examMode === 'server'){
        const answers = {};
        currentExamQuestions.forEach(function(q, qi){
          const sel = document.querySelector('input[name="examQ' + qi + '"]:checked');
          if(sel) answers[q.id] = q.options[parseInt(sel.value, 10)].text;
        });
        submitExamBtn.disabled = true;
        const { data, error } = await sb.rpc('submit_exam', { p_club: currentProfile.club, p_level: currentLevel, p_answers: answers });
        submitExamBtn.disabled = false;
        if(error){ examResult.textContent = friendlyErrorMessage(error); return; }
        const r = Array.isArray(data) ? data[0] : data;
        scorePct = r.score;
        passed = r.passed;
      } else {
        let correctCount = 0;
        currentExamQuestions.forEach(function(q, qi){
          const sel = document.querySelector('input[name="examQ' + qi + '"]:checked');
          if(sel && q.options[parseInt(sel.value, 10)].correct) correctCount++;
        });
        const total = currentExamQuestions.length;
        scorePct = total ? Math.round((correctCount / total) * 100) : 0;
        passed = scorePct >= 70;
        const { error } = await sb.from('exam_attempts').insert({
          student_id: currentProfile.id, club: currentProfile.club, level: currentLevel, score: scorePct, passed: passed
        });
        if(error){ examResult.textContent = friendlyErrorMessage(error); return; }
      }
      examResult.textContent = '';
      await loadPassedLevels();
      updateLevelTabsUI();
      const isLast = LEVELS.indexOf(currentLevel) === LEVELS.length - 1;
      const res = document.getElementById('quizResult');
      examQuestionsEl.hidden = true;
      quizNav.hidden = true;
      document.getElementById('quizCount').textContent = '';
      document.getElementById('quizBar').style.width = '100%';
      res.hidden = false;
      res.className = 'quiz-result ' + (passed ? 'win' : 'try');
      res.innerHTML =
        '<div class="qr-ring" style="--p:' + scorePct + '"><b>' + scorePct + '%</b></div>' +
        '<h4>' + (passed ? t('Congratulations! 🎉', 'مبروك! 🎉') : t('Almost there!', 'قربت جداً!')) + '</h4>' +
        '<p>' + (passed
          ? (isLast ? t('You passed the final level. Your certificate is ready.', 'نجحت في المستوى الأخير. شهادتك جاهزة.')
                    : t('You passed and unlocked the next level. Your certificate is ready.', 'نجحت وفتحت المستوى التالي. شهادتك جاهزة.'))
          : t('You need 70% to pass. Read the books again and try once more — you can retake it anytime.', 'تحتاج ٧٠٪ للنجاح. راجع الكتب وحاول مرة أخرى — يمكنك إعادة الامتحان في أي وقت.')) + '</p>' +
        '<div class="qr-actions">' + (passed
          ? '<button class="btn-primary" type="button" data-res="certs">🎓 ' + t('View certificate', 'عرض الشهادة') + '</button>' +
            (isLast ? '' : '<button class="btn-ghost" type="button" data-res="next">' + t('Go to the next level →', 'انتقل للمستوى التالي ←') + '</button>')
          : '<button class="btn-primary" type="button" data-res="retry">' + t('Try again', 'حاول مرة أخرى') + '</button>' +
            '<button class="btn-ghost" type="button" data-res="books">' + t('Back to the books', 'العودة للكتب') + '</button>') +
        '</div>';
      if(passed){
        loadOverviewStats();
        renderNextStep();
        confetti();
        toast('🎓 ' + t('Certificate unlocked!', 'حصلت على شهادة!'), t('Find it under Certificates.', 'ستجدها في قسم الشهادات.'));
      }
    });
  }

  // a short burst of confetti for passed exams
  function confetti(){
    if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const colors = ['#5FE0C8', '#C9A227', '#8A2E43', '#F7E4D4', '#3E0F1B'];
    const wrap = document.createElement('div');
    wrap.className = 'confetti';
    for(let i = 0; i < 70; i++){
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + '%';
      p.style.background = colors[i % colors.length];
      p.style.animationDelay = Math.random() * 0.6 + 's';
      p.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
      p.style.setProperty('--r', (Math.random() * 720) + 'deg');
      wrap.appendChild(p);
    }
    document.body.appendChild(wrap);
    setTimeout(function(){ wrap.remove(); }, 3200);
  }

  // ---------- exam question admin (teacher) ----------
  async function loadExamQuestionsAdmin(club, level){
    if(!examQList) return;
    const { data, error } = await sb.from('exam_questions').select('*').eq('club', club).eq('level', level).order('created_at');
    if(error){ examQList.innerHTML = '<div class="lib-empty">' + esc(friendlyErrorMessage(error)) + '</div>'; return; }
    if(!data || data.length === 0){ examQList.innerHTML = '<div class="lib-empty">' + esc(t('No questions yet for this level.', 'لا توجد أسئلة لهذا المستوى بعد.')) + '</div>'; return; }
    examQList.innerHTML = '<p class="lib-note">' + esc(t(data.length + ' questions in this exam', 'عدد أسئلة هذا الامتحان: ' + data.length)) + '</p>' +
      data.map(function(q){
        return '<div class="exam-q-row"><span>' + esc(q.question) + ' <small>✓ ' + esc(q.option_a) + '</small></span>' +
          '<button type="button" data-qdel="' + esc(q.id) + '" title="' + t('Delete', 'حذف') + '" aria-label="' + t('Delete', 'حذف') + '">✕</button></div>';
      }).join('');
  }
  if(examQList){
    examQList.addEventListener('click', async function(e){
      const b = e.target.closest('[data-qdel]');
      if(!b || !confirm(t('Delete this question?', 'حذف هذا السؤال؟'))) return;
      const { error } = await sb.from('exam_questions').delete().eq('id', b.dataset.qdel);
      if(error){ toast(t('Couldn’t delete', 'تعذّر الحذف'), friendlyErrorMessage(error), true); return; }
      loadExamQuestionsAdmin(materialsFilter, currentLevel);
    });
  }

  // ---------- add many exam questions from a CSV file (Excel → Save as CSV UTF-8) ----------
  function parseCSV(text){
    text = text.replace(/^\uFEFF/, '');
    const firstLine = text.split(/\r?\n/)[0] || '';
    const sep = (firstLine.split(';').length > firstLine.split(',').length) ? ';' : ',';
    const rows = []; let row = [], cell = '', q = false;
    for(let i = 0; i < text.length; i++){
      const c = text[i];
      if(q){
        if(c === '"' && text[i + 1] === '"'){ cell += '"'; i++; }
        else if(c === '"') q = false;
        else cell += c;
      } else if(c === '"') q = true;
      else if(c === sep){ row.push(cell); cell = ''; }
      else if(c === '\n' || c === '\r'){
        if(c === '\r' && text[i + 1] === '\n') i++;
        row.push(cell); rows.push(row); row = []; cell = '';
      } else cell += c;
    }
    if(cell !== '' || row.length){ row.push(cell); rows.push(row); }
    return rows.map(function(r){ return r.map(function(x){ return x.trim(); }); }).filter(function(r){ return r.some(Boolean); });
  }
  const eqCsv = document.getElementById('eqCsv');
  const eqCsvMsg = document.getElementById('eqCsvMsg');
  document.getElementById('eqCsvSample').href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(
    '\uFEFFquestion,correct answer,wrong 1,wrong 2,wrong 3\n' +
    'She ___ a student.,is,am,are,be\n' +
    'Which word rhymes with "cat"?,hat,cup,pen,sun\n');
  if(eqCsv){
    eqCsv.addEventListener('change', async function(){
      const file = eqCsv.files[0];
      eqCsv.value = '';
      if(!file) return;
      const club = materialsFilter !== 'all' ? materialsFilter : null;
      eqCsvMsg.style.color = '#B4213D';
      if(!club){ eqCsvMsg.textContent = t('Pick one specific club tab above first.', 'اختر نادياً محدداً من الأعلى أولاً.'); return; }
      let rows = parseCSV(await file.text());
      if(rows.length && /question|سؤال/i.test(rows[0][0])) rows = rows.slice(1);
      const bad = rows.filter(function(r){ return r.length < 5 || r.slice(0, 5).some(function(x){ return !x; }); });
      rows = rows.filter(function(r){ return bad.indexOf(r) === -1; });
      if(!rows.length){ eqCsvMsg.textContent = t('No complete rows found — each row needs 5 filled columns.', 'لا توجد صفوف مكتملة — كل صف يحتاج ٥ أعمدة ممتلئة.'); return; }
      const payload = rows.map(function(r){
        return { club: club, level: currentLevel, question: r[0], option_a: r[1], option_b: r[2], option_c: r[3], option_d: r[4], created_by: currentProfile.id };
      });
      const { error } = await sb.from('exam_questions').insert(payload);
      if(error){ eqCsvMsg.textContent = friendlyErrorMessage(error); return; }
      eqCsvMsg.style.color = '#2e7d32';
      eqCsvMsg.textContent = t(payload.length + ' questions added to ' + club + ' · ' + currentLevel + (bad.length ? ' (' + bad.length + ' incomplete rows skipped)' : '') + '.',
                               'تمت إضافة ' + payload.length + ' سؤال إلى ' + club + ' · ' + currentLevel + (bad.length ? ' (تم تخطي ' + bad.length + ' صف غير مكتمل)' : '') + '.');
      loadExamQuestionsAdmin(club, currentLevel);
    });
  }

  if(examQForm){
    examQForm.addEventListener('submit', async function(e){
      e.preventDefault();
      const club = materialsFilter !== 'all' ? materialsFilter : null;
      if(!club){ alert('Pick one specific club tab above first.'); return; }
      const question = document.getElementById('eqQuestion').value.trim();
      const option_a = document.getElementById('eqOpt0').value.trim();
      const option_b = document.getElementById('eqOpt1').value.trim();
      const option_c = document.getElementById('eqOpt2').value.trim();
      const option_d = document.getElementById('eqOpt3').value.trim();
      if(!question || !option_a || !option_b || !option_c || !option_d) return;
      const { error } = await sb.from('exam_questions').insert({
        club: club, level: currentLevel, question: question,
        option_a: option_a, option_b: option_b, option_c: option_c, option_d: option_d,
        created_by: currentProfile.id
      });
      if(error){ alert(error.message); return; }
      examQForm.reset();
      await loadExamQuestionsAdmin(club, currentLevel);
    });
  }

  async function loadStudentsForProgress(){
    const { data } = await sb.from('profiles').select('id, full_name, club').eq('role', 'student').order('full_name');
    progStudent.innerHTML = (data || []).map(function(s){
      return '<option value="' + esc(s.id) + '">' + esc(s.full_name) + ' — ' + esc(s.club || '') + '</option>';
    }).join('');
    if(studentsList){
      if(!data || data.length === 0){
        studentsList.innerHTML = '<div class="lib-empty">No students registered yet.</div>';
      } else {
        studentsList.innerHTML = data.map(function(s){
          return '<div class="student-row"><div><b>' + esc(s.full_name) + '</b><span>' + esc(s.club || '—') + '</span></div>' +
            '<button class="sess-btn ghost" type="button" data-report="' + esc(s.id) + '">Report</button></div>';
        }).join('');
      }
    }
  }

  progressForm.addEventListener('submit', async function(e){
    e.preventDefault();
    const student_id = progStudent.value;
    const status = document.getElementById('progStatus').value;
    const note = document.getElementById('progNote').value.trim();
    if(!student_id) return;
    const { error } = await sb.from('progress').insert({ student_id: student_id, status: status, note: note });
    if(error){ alert(error.message); return; }
    progressForm.reset();
    await loadOverviewStats();
    alert('Progress entry added.');
  });

  async function loadMyProgress(){
    const { data, error } = await sb.from('progress').select('*').eq('student_id', currentProfile.id).order('created_at', { ascending: false });
    if(error){ progressList.innerHTML = '<div class="lib-empty">' + esc(friendlyErrorMessage(error)) + '</div>'; return; }
    if(!data || data.length === 0){ progressList.innerHTML = '<div class="lib-empty">No progress entries yet.</div>'; return; }
    progressList.innerHTML = data.map(function(p){
      return '<div class="progress-item"><b>' + esc(p.status || '') + '</b><span>' + new Date(p.created_at).toLocaleDateString() + '</span><p>' + esc(p.note || '') + '</p></div>';
    }).join('');
  }

  // ---------- notifications ----------
  async function loadNotifications(){
    let query = sb.from('notifications').select('*').order('created_at', { ascending: false }).limit(30);
    if(isStudent()){
      query = query.or('club.is.null,club.eq."' + currentProfile.club + '"');
    }
    const { data, error } = await query;
    const render = function(target, items, empty){
      if(error){ target.innerHTML = '<div class="lib-empty">' + esc(friendlyErrorMessage(error)) + '</div>'; return; }
      if(!items || items.length === 0){ target.innerHTML = '<div class="lib-empty">' + empty + '</div>'; return; }
      target.innerHTML = items.map(function(n){
        return '<div class="notif-item"><b>' + esc(n.title) + '</b><p>' + esc(n.body) + '</p><span>' +
          esc(n.user_id ? t('For you', 'لك') : (n.club || 'All clubs')) + ' · ' + new Date(n.created_at).toLocaleDateString() + '</span></div>';
      }).join('');
    };
    render(notifList, data, 'No notifications yet.');
    if(ovNotifPreview) render(ovNotifPreview, data ? data.slice(0,3) : data, 'No notifications yet.');
  }

  if(notifForm){
    notifForm.addEventListener('submit', async function(e){
      e.preventDefault();
      const club = document.getElementById('notifClub').value || null;
      const title = document.getElementById('notifTitle').value.trim();
      const body = document.getElementById('notifBody').value.trim();
      if(!title || !body) return;
      const { error } = await sb.from('notifications').insert({ club: club, title: title, body: body, created_by: currentProfile.id });
      if(error){ alert(error.message); return; }
      notifForm.reset();
      await loadNotifications();
    });
  }

  // ---------- profile ----------
  if(profileForm){
    profileForm.addEventListener('submit', async function(e){
      e.preventDefault();
      profileMsg.textContent = '';
      const full_name = profName.value.trim();
      if(!full_name) return;
      const phone = normPhone(document.getElementById('profPhone').value);
      if(!phone){ profileMsg.style.color = ''; profileMsg.textContent = friendlyErrorMessage('valid phone number'); return; }
      const { error } = await sb.from('profiles').update({ full_name: full_name, phone: phone }).eq('id', currentProfile.id);
      if(error){
        profileMsg.style.color = '';
        profileMsg.textContent = /duplicate|unique/i.test(error.message || '') ? t('This phone number is already used by another account.', 'رقم الهاتف مستخدم في حساب آخر.') : friendlyErrorMessage(error);
        return;
      }
      currentProfile.phone = phone || null;
      currentProfile.full_name = full_name;
      dashName.textContent = full_name;
      ovName.textContent = full_name.split(' ')[0];
      dashAvatar.textContent = full_name.trim().charAt(0).toUpperCase();
      profileMsg.style.color = '#2e7d32';
      profileMsg.textContent = 'Saved.';
    });
  }

  // =====================================================================
  //  Coco — the robot English buddy. Talk and role-play go through the "tutor" Edge Function
  //  (Claude); "Say it" (pronunciation) runs in the browser only, so it works for everyone.
  // =====================================================================
  const coco = document.getElementById('coco');
  const cocoBtn = document.getElementById('cocoLauncher');
  const cocoLog = document.getElementById('cocoLog');
  const cocoInput = document.getElementById('cocoInput');
  const cocoMic = document.getElementById('cocoMic');
  const cocoBot = document.getElementById('cocoBot');
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  const COCO_SCENES = [
    { id: 'cafe',      icon: '☕', en: 'At the café',      ar: 'في الكافيه',      open: "Hi there, welcome to Sunny Café! What can I get for you today?" },
    { id: 'airport',   icon: '✈️', en: 'At the airport',   ar: 'في المطار',       open: "Good morning! May I see your passport, please? Where are you flying today?" },
    { id: 'doctor',    icon: '🩺', en: 'At the doctor',    ar: 'عند الطبيب',      open: "Hello, come in and sit down. How are you feeling today?" },
    { id: 'shop',      icon: '👕', en: 'In a shop',        ar: 'في المحل',        open: "Hi! Are you looking for anything special today?" },
    { id: 'interview', icon: '💼', en: 'Job interview',    ar: 'مقابلة عمل',      open: "Nice to meet you! Thanks for coming. Can you tell me a little about yourself?" },
    { id: 'friend',    icon: '🎒', en: 'A new friend',     ar: 'صديق جديد',       open: "Hey! I'm new here too. What's your name? Which class are you in?" }
  ];
  // sentences to say aloud, by stage (Beginner … Advanced)
  const COCO_SAY = [
    ['I like apples and bananas.', 'My cat is under the table.', 'This is my red bag.', 'I can swim and run.', 'Good morning, teacher!', 'We play football on Friday.'],
    ['I usually walk to school.', 'Can I have some water, please?', 'Yesterday I visited my grandma.', 'There are three windows in my room.', 'She is taller than her brother.', 'What time does the shop open?'],
    ['I have never been to London.', 'If it rains, we will stay at home.', 'Could you tell me where the station is?', 'I have been learning English for two years.', 'He was reading when the phone rang.', 'I am looking forward to the weekend.'],
    ['I would rather stay in than go out tonight.', 'The film was much better than I expected.', 'Would you mind opening the window?', 'I wish I had more time to travel.', 'She asked me whether I liked the book.', 'It was such a beautiful day that we went to the beach.'],
    ['Had I known about the traffic, I would have left earlier.', 'The meeting has been postponed until further notice.', 'Not only is she talented, but she is also hard-working.', 'I can hardly believe how quickly the year has gone by.', 'It is worth considering every option before deciding.', 'He denied having taken the money.'],
    ['Rarely have I seen such a remarkable performance.', 'The proposal was met with considerable scepticism.', 'She is on the verge of a major breakthrough.', 'Whatever the outcome, we should be proud of our effort.', 'His argument, though persuasive, does not hold water.', 'The novel explores the subtle tension between duty and desire.']
  ];
  // lesson topics for each stage; the student can also type any topic
  const COCO_TOPICS = [
    ['The verb to be: am / is / are', 'Present simple: I play / she plays', 'a / an / the', 'Plurals: cat → cats, child → children', 'There is / There are', 'Can / can’t'],
    ['Past simple: played, went, saw', 'Present continuous: I am playing', 'Comparing: bigger / more beautiful', 'much / many / a lot of', 'Going to: future plans', 'in / on / at for time'],
    ['Present perfect: I have been', 'First conditional: If it rains, …', 'Past continuous: I was reading', 'will or going to?', 'should / must / have to', 'who / which / that'],
    ['Second conditional: If I were…', 'The passive: It was made…', 'Reported speech: She said that…', 'used to / be used to', 'Gerund or infinitive: enjoy doing / want to do', 'Phrasal verbs for everyday life'],
    ['Third conditional: If I had known…', 'Past perfect: I had already eaten', 'I wish / If only', 'however / although / despite', 'must have / can’t have', 'make or do?'],
    ['Inversion: Never have I…', 'Cleft sentences: What I need is…', 'Mixed conditionals', 'Discourse markers for essays', 'Idioms in context', 'Formal and informal English']
  ];
  let cocoLesson = null; // { topic, step, history: [{title, correct}], data, builtIn, examples }
  let cocoSayCustom = null; // sentences to say from the lesson just finished
  // the 36 listed lessons are written in advance (assets/data/lessons) — free, instant, no AI needed
  const cocoLibrary = {};
  async function cocoBuiltIn(topic){
    const si = COCO_TOPICS.findIndex(function(list){ return list.indexOf(topic) !== -1; });
    if(si === -1) return null;
    try{
      if(!cocoLibrary[si]){
        const res = await fetch('assets/data/lessons/stage-' + (si + 1) + '.json');
        if(!res.ok) return null;
        cocoLibrary[si] = await res.json();
      }
      return cocoLibrary[si][topic] || null;
    }catch(e){ return null; }
  }
  let cocoMode = 'learn', cocoScene = null, cocoTurns = [], cocoBusy = false, cocoSpeak = true, cocoSayIdx = 0, cocoRec = null;

  function cocoStore(key, fallback){
    try{ const v = JSON.parse(localStorage.getItem('coco_' + key + '_' + (currentProfile ? currentProfile.id : 'guest')) || 'null'); return v == null ? fallback : v; }catch(e){ return fallback; }
  }
  function cocoSave(key, v){ try{ localStorage.setItem('coco_' + key + '_' + (currentProfile ? currentProfile.id : 'guest'), JSON.stringify(v)); }catch(e){} }
  function cocoLevel(){
    if(isStudent && currentProfile && isStudent()) return levelNameEn(currentStudentLevel());
    try{ const pl = JSON.parse(localStorage.getItem('cc_placement') || 'null'); if(pl && LEVEL_INFO[pl.level]) return levelNameEn(pl.level); }catch(e){}
    return levelNameEn('Level 1');
  }
  function cocoStage(){ const m = /Level (\d+)/.exec(cocoLevel()); const info = m && LEVEL_INFO['Level ' + m[1]]; return info ? info.lessons : 0; }
  function cocoLevelKey(){ const m = /Level (\d+)/.exec(cocoLevel()); return m && LEVEL_INFO['Level ' + m[1]] ? 'Level ' + m[1] : 'Level 1'; }

  // ---- the robot's face ----
  function cocoMood(m){
    cocoBot.dataset.mood = m || 'happy';
  }
  function cocoState(s, on){ cocoBot.classList.toggle(s, !!on); }

  // ---- speaking (browser voice) ----
  let cocoVoice = null;
  function pickVoice(){
    const vs = (window.speechSynthesis && speechSynthesis.getVoices()) || [];
    cocoVoice = vs.find(function(v){ return /en[-_]US/i.test(v.lang) && /Google|Samantha|Jenny|Aria|Natural/i.test(v.name); }) ||
                vs.find(function(v){ return /^en/i.test(v.lang); }) || null;
  }
  if(window.speechSynthesis){ pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
  function cocoSay(text, force){
    if(!window.speechSynthesis || (!cocoSpeak && !force) || !text) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = 0.95; u.pitch = 1.15;
    if(cocoVoice) u.voice = cocoVoice;
    u.onstart = function(){ cocoState('talking', true); };
    u.onend = u.onerror = function(){ cocoState('talking', false); };
    speechSynthesis.speak(u);
  }

  // ---- listening (browser speech recognition) ----
  function cocoListen(onText){
    if(!SpeechRec){ toast('🎤 ' + t('Voice is not available here', 'الصوت غير متاح هنا'), t('Try Chrome, Edge or Safari, or type instead.', 'جرّب Chrome أو Edge أو Safari، أو اكتب بدلاً من ذلك.'), true); return; }
    if(cocoRec){ cocoRec.stop(); return; }
    if(window.speechSynthesis) speechSynthesis.cancel();
    const rec = new SpeechRec();
    rec.lang = 'en-US'; rec.interimResults = true; rec.maxAlternatives = 1;
    let final = '';
    rec.onresult = function(e){
      let txt = '';
      for(let i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript;
      final = txt;
      if(cocoMode !== 'say') cocoInput.value = txt;
    };
    rec.onerror = function(e){ if(e.error === 'not-allowed') toast('🎤 ' + t('Allow the microphone', 'اسمح باستخدام الميكروفون'), t('Coco needs the microphone to hear you.', 'كوكو يحتاج الميكروفون ليسمعك.'), true); };
    rec.onend = function(){
      cocoRec = null; cocoState('listening', false);
      document.querySelectorAll('.coco-mic, .coco-rec').forEach(function(b){ b.classList.remove('on'); });
      if(final.trim()) onText(final.trim());
    };
    cocoRec = rec;
    cocoState('listening', true); cocoMood('curious');
    document.querySelectorAll(cocoMode === 'say' ? '.coco-rec' : '.coco-mic').forEach(function(b){ b.classList.add('on'); });
    rec.start();
  }

  // ---- chat log ----
  function cocoBubble(who, html){
    const el = document.createElement('div');
    el.className = 'cmsg ' + who;
    el.innerHTML = html;
    cocoLog.appendChild(el);
    cocoLog.scrollTop = cocoLog.scrollHeight;
    return el;
  }
  function cocoReplyHtml(r){
    let h = '<p dir="ltr">' + esc(r.reply) + '</p>' +
      '<div class="cmsg-tools"><button type="button" data-coco-play="' + esc(r.reply) + '" title="' + t('Listen', 'استمع') + '">🔊</button>' +
      (r.reply_ar ? '<button type="button" data-coco-ar>' + t('Arabic', 'عربي') + '</button>' : '') + '</div>' +
      (r.reply_ar ? '<p class="cmsg-ar" hidden>' + esc(r.reply_ar) + '</p>' : '');
    const c = r.correction || {};
    if(c.has_mistake && c.better){
      h += '<div class="ccorr"><b>✏️ ' + t('Say it like this', 'قلها كده') + '</b>' +
        (c.original ? '<s dir="ltr">' + esc(c.original) + '</s>' : '') + '<em dir="ltr">' + esc(c.better) + '</em>' +
        (c.explain_ar ? '<small dir="rtl">' + esc(c.explain_ar) + '</small>' : '') + '</div>';
    }
    if(r.new_words && r.new_words.length){
      h += '<div class="cwords">' + r.new_words.map(function(w){
        return '<button type="button" data-coco-word="' + esc(w.word) + '" data-ar="' + esc(w.meaning_ar || '') + '">＋ <bdi>' + esc(w.word) + '</bdi> <small>' + esc(w.meaning_ar || '') + '</small></button>';
      }).join('') + '</div>';
    }
    return h;
  }
  function cocoStars(n){
    const s = cocoStore('stars', 0) + n;
    cocoSave('stars', s);
    document.getElementById('cocoStars').textContent = '⭐ ' + s;
    if(n > 0){ cocoState('spark', true); setTimeout(function(){ cocoState('spark', false); }, 900); }
  }
  function cocoJarCount(){ document.getElementById('cocoJarN').textContent = cocoStore('jar', []).length; }

  // ---- calling the tutor function; returns { data } or { err } ----
  async function cocoCall(body){
    try{
      const res = await sb.functions.invoke('tutor', { body: body });
      if(!res.error) return { data: res.data };
      // 404 = the "tutor" function isn't deployed yet; no response at all = can't reach it
      const ctx = res.error.context;
      let code = ctx && ctx.status === 404 ? 'setup' : 'ai';
      if(code === 'ai'){
        try{ const b = await ctx.json(); code = b.error || code; }catch(e){ if(!ctx || !ctx.status) code = 'setup'; }
      }
      return { err: code };
    }catch(e){ return { err: 'setup' }; }
  }
  function cocoErrText(err){
    return err === 'limit' ? t("That's all for today — you used today's messages. Come back tomorrow! You can still practise in “Say it”.", 'خلصت رسائل النهارده — ارجع بكرة! وتقدر تتدرب على النطق في «قلها».')
      : err === 'signin' ? t('Please sign in again.', 'من فضلك سجّل الدخول مرة أخرى.')
      : err === 'busy' ? t('Coco is very busy right now. Try again in a minute.', 'كوكو مشغول جداً الآن. حاول بعد دقيقة.')
      : err === 'topic' ? t('Coco can only teach English topics — try another one!', 'كوكو بيشرح مواضيع الإنجليزي بس — جرّب موضوع تاني!')
      : err === 'setup' ? (cocoMode === 'learn'
          ? t('Pick one of the lessons in the list 👆 — I explain each one step by step, with questions.', 'اختار درس من القائمة 👆 — بشرح كل درس خطوة بخطوة وبأسئلة.')
          : t('Let’s practise together: pick a chat, a scene or a lesson 🧑‍🏫', 'يلا نتمرّن سوا: اختار محادثة أو موقف أو درس 🧑‍🏫')) +
          (isAdmin() ? ' — ' + t('Admin: see AI-TUTOR.md to switch Coco on.', 'للمدير: افتح ملف AI-TUTOR.md لتفعيل كوكو.') : '')
      : t('Oops, Coco lost the thread. Please try again.', 'حصل خطأ بسيط، حاول مرة أخرى.');
  }
  function cocoShowLeft(left){
    if(typeof left === 'number') document.getElementById('cocoLeft').textContent = t(left + ' left today', 'متبقٍ ' + left + ' اليوم');
  }

  // ---- lessons: Coco explains a topic in four whiteboard steps ----
  function cocoLessonHome(){
    cocoLesson = null;
    coco.classList.remove('lesson-active');
    cocoLog.innerHTML = '';
    const topics = COCO_TOPICS[cocoStage()] || COCO_TOPICS[0];
    const done = cocoStore('lessons', []);
    const home = topics.map(function(tp){
      const seen = done.indexOf(tp) !== -1;
      return '<button type="button" data-coco-topic="' + esc(tp) + '"' + (seen ? ' class="done"' : '') + '><bdi>' + esc(tp) + '</bdi>' + (seen ? ' ✓' : '') + '</button>';
    }).join('');
    const el = cocoBubble('bot', '<p>' + esc(t('What shall we learn today? Pick a lesson for your level, or search 👇', 'نتعلم إيه النهارده؟ اختار درس على قد مستواك، أو دوّر 👇')) + '</p>' +
      '<input type="search" class="csearch" data-coco-search dir="auto" autocomplete="off" placeholder="🔎 ' + esc(t('Search lessons… e.g. past, if, plural, الماضي', 'دوّر على درس… مثلاً past أو الماضي أو الجمع')) + '">' +
      '<div class="ctopics" data-topic-list></div>');
    const list = el.querySelector('[data-topic-list]');
    list.dataset.home = home; list.innerHTML = home;
    cocoMood('happy');
    cocoShowTasks().then(cocoShowBooks);
  }
  async function cocoStartLesson(topic){
    topic = (topic || '').trim();
    if(!topic || cocoBusy) return;
    const builtIn = await cocoBuiltIn(topic);
    if(!builtIn && !currentProfile){
      cocoBubble('bot', '<p>' + esc(t('Sign in and I’ll try to explain that. Or pick one of the free lessons above!', 'سجّل الدخول وهحاول أشرحلك ده. أو اختار درس من الدروس المجانية اللي فوق!')) + '</p>');
      cocoInput.value = '';
      return;
    }
    cocoInput.value = '';
    cocoLesson = { topic: topic, step: 0, history: [], builtIn: builtIn, examples: [] };
    coco.classList.add('lesson-active');
    cocoLog.innerHTML = '';
    cocoBubble('scene', '🧑‍🏫 <bdi>' + esc(topic) + '</bdi>');
    cocoLessonStep();
  }
  async function cocoLessonStep(){
    if(!cocoLesson || cocoBusy) return;
    cocoLesson.step++;
    let out;
    if(cocoLesson.builtIn){
      out = { data: JSON.parse(JSON.stringify(cocoLesson.builtIn[cocoLesson.step - 1])) };
    } else {
      cocoBusy = true; cocoMood('thinking'); cocoState('busy', true);
      const wait = cocoBubble('bot typing', '<span></span><span></span><span></span>');
      out = await cocoCall({ mode: 'lesson', level: levelForAi(cocoLevelKey()), topic: cocoLesson.topic, step: cocoLesson.step, history: cocoLesson.history });
      wait.remove();
      cocoBusy = false; cocoState('busy', false);
    }
    const d = out.data;
    if(d && d.check && Array.isArray(d.check.options)){
      // shuffle the answers so the right one isn't always in the same place
      const right = d.check.options[d.check.answer_index];
      d.check.options = shuffleArr(d.check.options.slice());
      d.check.answer_index = d.check.options.indexOf(right);
    }
    if(out.err || !d || !d.check){
      cocoLesson.step--;
      cocoMood('encouraging');
      cocoBubble('bot err', '<p>' + esc(cocoErrText(out.err)) + '</p>' +
        (out.err === 'limit' || out.err === 'setup' ? '' : '<div class="cmsg-cta"><button type="button" class="cbtn" data-coco-retry>' + t('Try again', 'حاول مرة أخرى') + '</button></div>'));
      return;
    }
    cocoLesson.data = d;
    (d.examples || []).forEach(function(x){ if(x && x.en) cocoLesson.examples.push(x.en); });
    cocoShowLeft(d.left);
    const n = cocoLesson.step;
    const card = cocoBubble('bot board', '<div class="cboard">' +
      '<div class="cb-top"><span>' + t('Step', 'الخطوة') + ' <bdi dir="ltr">' + n + ' / 4</bdi></span><i>' + [1, 2, 3, 4].map(function(k){ return '<b class="' + (k < n ? 'done' : k === n ? 'now' : '') + '"></b>'; }).join('') + '</i></div>' +
      '<h4 dir="ltr">' + esc(d.step_title) + '</h4>' +
      '<p dir="ltr" class="cb-explain">' + esc(d.explain_en) + '</p>' +
      '<div class="cmsg-tools"><button type="button" data-coco-play="' + esc(d.explain_en) + '" data-force="1">🔊 ' + t('Listen', 'استمع') + '</button>' +
        '<button type="button" data-coco-ar>' + t('Arabic', 'عربي') + '</button></div>' +
      '<p class="cmsg-ar" hidden>' + esc(d.explain_ar) + '</p>' +
      (d.board ? '<div class="cb-rule" dir="ltr">' + esc(d.board).replace(/\n/g, '<br>') + '</div>' : '') +
      (d.examples && d.examples.length ? '<ul class="cb-ex">' + d.examples.map(function(x){
        return '<li><button type="button" data-coco-play="' + esc(x.en) + '" data-force="1" aria-label="' + t('Listen', 'استمع') + '">🔊</button><span><b dir="ltr">' + esc(x.en) + '</b><small>' + esc(x.ar) + '</small></span></li>';
      }).join('') + '</ul>' : '') +
      '</div>' +
      '<div class="cquiz"><b>✋ ' + t('Quick check', 'سؤال سريع') + '</b><p dir="ltr">' + esc(d.check.question) + '</p>' +
      '<div class="copts">' + d.check.options.map(function(o, k){ return '<button type="button" dir="ltr" data-coco-opt="' + k + '">' + esc(o) + '</button>'; }).join('') + '</div>' +
      '<div class="cwhy" hidden></div></div>');
    card.scrollIntoView({ block: 'start', behavior: 'smooth' });
    cocoMood('happy');
    cocoSay(d.explain_en);
  }
  function cocoAnswer(btn){
    const quiz = btn.closest('.cquiz'), d = cocoLesson && cocoLesson.data;
    if(!d || quiz.dataset.answered) return;
    quiz.dataset.answered = '1';
    const k = parseInt(btn.dataset.cocoOpt, 10), right = k === d.check.answer_index;
    quiz.querySelectorAll('[data-coco-opt]').forEach(function(b){
      b.disabled = true;
      if(parseInt(b.dataset.cocoOpt, 10) === d.check.answer_index) b.classList.add('right');
    });
    if(!right) btn.classList.add('wrong');
    cocoLesson.history.push({ title: d.step_title, correct: right });
    const last = cocoLesson.step >= 4;
    const why = quiz.querySelector('.cwhy');
    why.hidden = false;
    why.innerHTML = '<p>' + (right ? '✅ ' + esc(t('Correct!', 'صح!')) : '💡 ' + esc(t('Not quite.', 'مش بالظبط.'))) + ' <span>' + esc(d.check.why_ar) + '</span></p>' +
      '<button type="button" class="cbtn" data-coco-' + (last ? 'finish' : 'nextstep') + '>' + (last ? t('Finish the lesson 🎓', 'إنهاء الدرس 🎓') : t('Next step →', 'الخطوة التالية ←')) + '</button>';
    cocoMood(right ? 'proud' : 'encouraging');
    if(right) cocoStars(1);
    cocoSay(right ? 'Correct! Well done.' : "Not quite. Let's look at it again.");
  }
  function cocoFinishLesson(){
    const L = cocoLesson, d = L.data;
    const score = L.history.filter(function(x){ return x.correct; }).length;
    const done = cocoStore('lessons', []);
    if(done.indexOf(L.topic) === -1){ done.push(L.topic); cocoSave('lessons', done); }
    if(score === 4) cocoStars(2);
    if(L.task && currentProfile) sb.from('coco_results').insert({ task_id: L.task.id, student_id: currentProfile.id, score: score, total: 4, answers: L.history }).then(function(){});
    cocoBubble('bot done', '<div class="cdone"><span>🎓</span><b>' + esc(t('Lesson complete!', 'خلصت الدرس!')) + '</b><bdi>' + esc(L.topic) + '</bdi>' +
      '<em dir="ltr">' + '★'.repeat(score) + '☆'.repeat(4 - score) + ' ' + score + ' / 4</em>' +
      (d.recap_en ? '<p dir="ltr">' + esc(d.recap_en) + '</p>' : '') + '</div>' +
      '<div class="cmsg-cta"><button type="button" class="cbtn" data-coco-sayex>🎤 ' + t('Say the examples', 'انطق الأمثلة') + '</button>' +
      '<button type="button" class="cbtn ghost" data-coco-sheet="' + esc(L.topic) + '">🖨️ ' + t('Worksheet', 'ورقة تمارين') + '</button>' +
      (currentProfile ? '<button type="button" class="cbtn ghost" data-coco-practise>💬 ' + t('Practise in a chat', 'اتمرّن في محادثة') + '</button>' : '') +
      '<button type="button" class="cbtn ghost" data-coco-mode="learn">' + t('Another lesson', 'درس تاني') + '</button></div>');
    coco.classList.remove('lesson-active');
    cocoMood(score >= 3 ? 'proud' : 'encouraging');
    cocoSay(score >= 3 ? 'Amazing work! Lesson complete.' : 'Lesson complete! Practice makes perfect.');
  }

  // ---- talking to Coco (AI) ----
  async function cocoSend(text){
    text = (text || '').trim();
    if(!text || cocoBusy) return;
    if(!currentProfile){ cocoSignin(); return; }
    cocoInput.value = '';
    cocoBubble('me', '<p dir="auto">' + esc(text) + '</p>');
    cocoTurns.push({ role: 'user', text: text });
    cocoBusy = true; cocoMood('thinking'); cocoState('busy', true);
    const wait = cocoBubble('bot typing', '<span></span><span></span><span></span>');
    const out = await cocoCall({ level: levelForAi(cocoLevelKey()), mode: cocoMode === 'play' ? 'roleplay' : 'talk', scene: cocoScene, turns: cocoTurns });
    const r = out.data, err = out.err;
    wait.remove();
    cocoBusy = false; cocoState('busy', false);
    if(err === 'setup'){ cocoAiOff = true; cocoAiOn = false; cocoSetMode(cocoMode); return; }
    if(err || !r || !r.reply){
      cocoTurns.pop();
      cocoMood('encouraging');
      cocoBubble('bot err', '<p>' + esc(cocoErrText(err)) + '</p>');
      return;
    }
    cocoTurns.push({ role: 'assistant', text: r.reply });
    cocoMood(r.mood || 'happy');
    cocoBubble('bot', cocoReplyHtml(r));
    cocoShowLeft(r.left);
    if(r.correction && !r.correction.has_mistake) cocoStars(1);
    cocoSay(r.reply);
  }
  function cocoSignin(){
    cocoLog.innerHTML = '';
    cocoBubble('bot', '<p>' + esc(t('Hi! I’m Coco 🤖 your English teacher. Sign in to chat with me, act out real-life scenes and get your mistakes fixed. Lessons and “Say it” are free for everyone — try them now!',
      'أهلاً! أنا كوكو 🤖 مدرّس الإنجليزي بتاعك. سجّل الدخول عشان نتكلم ونمثّل مواقف وأصحح أخطاءك. والدروس و«قلها» مجانيين للكل — جربهم دلوقتي!')) + '</p>' +
      '<div class="cmsg-cta"><button type="button" class="cbtn" data-coco-login>' + t('Sign in', 'تسجيل الدخول') + '</button><button type="button" class="cbtn ghost" data-coco-mode="learn">🧑‍🏫 ' + t('Free lesson', 'درس مجاني') + '</button><button type="button" class="cbtn ghost" data-coco-mode="say">🎤 ' + t('Say it', 'قلها') + '</button></div>');
  }

  // ---- Coco as the teacher's assistant: the teacher gives an order, Coco carries it out (no AI needed) ----
  const COCO_CLUBS = ['Phonics Club', 'Reading Club', 'Writing Club', 'Grammar Club', 'Speaking Club', 'Conversation Club', 'Cinema Club'];
  const COCO_CLUB_WORDS = { 'Phonics Club': ['phonics', 'فونكس', 'الصوتيات', 'صوتيات'], 'Reading Club': ['reading', 'القراءة', 'قراءة'], 'Writing Club': ['writing', 'الكتابة', 'كتابة'],
    'Grammar Club': ['grammar', 'القواعد', 'قواعد', 'جرامر'], 'Speaking Club': ['speaking', 'التحدث', 'تحدث'], 'Conversation Club': ['conversation', 'المحادثة', 'محادثة'], 'Cinema Club': ['cinema', 'السينما', 'سينما'] };
  // Arabic and English words a teacher might use for each lesson
  const COCO_TOPIC_WORDS = {
    'The verb to be: am / is / are': ['to be', 'am is are', 'فعل يكون', 'verb to be'], 'Present simple: I play / she plays': ['present simple', 'المضارع البسيط'],
    'a / an / the': ['a an the', 'articles', 'أدوات التعريف', 'أداة'], 'Plurals: cat → cats, child → children': ['plural', 'الجمع', 'جمع'],
    'There is / There are': ['there is', 'there are', 'يوجد'], 'Can / can’t': ['can', 'يستطيع', 'القدرة'],
    'Past simple: played, went, saw': ['past simple', 'الماضي البسيط'], 'Present continuous: I am playing': ['present continuous', 'المضارع المستمر'],
    'Comparing: bigger / more beautiful': ['comparative', 'comparing', 'المقارنة', 'التفضيل'], 'much / many / a lot of': ['much', 'many', 'a lot of', 'المعدود'],
    'Going to: future plans': ['going to', 'المستقبل', 'خطط'], 'in / on / at for time': ['in on at', 'prepositions', 'حروف الجر'],
    'Present perfect: I have been': ['present perfect', 'المضارع التام'], 'First conditional: If it rains, …': ['first conditional', 'الشرط الأول', 'الشرطية الأولى'],
    'Past continuous: I was reading': ['past continuous', 'الماضي المستمر'], 'will or going to?': ['will', 'will or going'],
    'should / must / have to': ['should', 'must', 'have to', 'النصيحة', 'الإلزام'], 'who / which / that': ['who which', 'relative', 'الموصول', 'أسماء الموصول'],
    'Second conditional: If I were…': ['second conditional', 'الشرط التاني', 'الشرط الثاني'], 'The passive: It was made…': ['passive', 'المبني للمجهول', 'المجهول'],
    'Reported speech: She said that…': ['reported speech', 'الكلام المنقول', 'المنقول'], 'used to / be used to': ['used to', 'اعتاد'],
    'Gerund or infinitive: enjoy doing / want to do': ['gerund', 'infinitive', 'المصدر'], 'Phrasal verbs for everyday life': ['phrasal', 'الأفعال المركبة'],
    'Third conditional: If I had known…': ['third conditional', 'الشرط التالت', 'الشرط الثالث'], 'Past perfect: I had already eaten': ['past perfect', 'الماضي التام'],
    'I wish / If only': ['wish', 'if only', 'التمني'], 'however / although / despite': ['however', 'although', 'despite', 'التناقض'],
    'must have / can’t have': ['must have', 'can’t have', 'الاستنتاج'], 'make or do?': ['make or do', 'make do'],
    'Inversion: Never have I…': ['inversion', 'القلب'], 'Cleft sentences: What I need is…': ['cleft', 'what i need'],
    'Mixed conditionals': ['mixed conditional', 'الشرط المختلط'], 'Discourse markers for essays': ['discourse', 'linking', 'أدوات الربط'],
    'Idioms in context': ['idiom', 'المصطلحات', 'التعبيرات'], 'Formal and informal English': ['formal', 'informal', 'الرسمي']
  };
  let cocoStudents = null; // [{id, full_name, club}] for the teacher's forms
  async function cocoLoadStudents(){
    if(cocoStudents) return cocoStudents;
    const { data } = await sb.from('profiles').select('id, full_name, club').eq('role', 'student').order('full_name');
    cocoStudents = data || [];
    return cocoStudents;
  }
  function cocoTopicOptions(sel){
    return COCO_TOPICS.map(function(list, si){
      return '<optgroup label="' + esc(groupLabel(si)) + '">' + list.map(function(tp){
        return '<option value="' + esc(tp) + '"' + (tp === sel ? ' selected' : '') + '>' + esc(tp) + '</option>';
      }).join('') + '</optgroup>';
    }).join('');
  }
  function cocoTargetOptions(sel){
    return '<optgroup label="' + esc(t('Whole club', 'نادي كامل')) + '">' + COCO_CLUBS.map(function(c){
      return '<option value="club:' + esc(c) + '"' + (sel === 'club:' + c ? ' selected' : '') + '>' + esc(c) + '</option>';
    }).join('') + '</optgroup><optgroup label="' + esc(t('One student', 'طالب واحد')) + '">' + (cocoStudents || []).map(function(s){
      return '<option value="student:' + esc(s.id) + '"' + (sel === 'student:' + s.id ? ' selected' : '') + '>' + esc(s.full_name || '—') + (s.club ? ' · ' + esc(s.club) : '') + '</option>';
    }).join('') + '</optgroup>';
  }
  const COCO_CMDS = [
    { id: 'lesson',   icon: '🧑‍🏫', en: 'Teach a lesson',            ar: 'اشرح درس' },
    { id: 'quiz',     icon: '📝', en: 'Quiz (marked by Coco)',       ar: 'اختبار يتصحح لوحده' },
    { id: 'homework', icon: '✍️', en: 'Written homework',            ar: 'واجب كتابي' },
    { id: 'report',   icon: '📊', en: 'Report to students & parents', ar: 'تقرير للطلاب وأولياء الأمور' },
    { id: 'remind',   icon: '🔔', en: 'Send a reminder',             ar: 'ابعت تذكير' },
    { id: 'book',     icon: '📚', en: 'Explain a book',              ar: 'اشرح كتاب' },
    { id: 'sheet',    icon: '🖨️', en: 'Worksheet to print',          ar: 'ورقة تمارين للطباعة' },
    { id: 'results',  icon: '📋', en: 'Results',                     ar: 'النتائج' }
  ];
  async function cocoAssistHome(){
    cocoLog.innerHTML = '';
    cocoMood('happy');
    cocoBubble('bot', '<p>' + esc(t('I’m your assistant 🤖 Give me an order — type it, or pick one below. For example: “explain the past simple to Reading Club”.',
      'أنا مساعدك 🤖 ادّيني أمر — اكتبه أو اختار من تحت. مثلاً: «اشرح الماضي البسيط لنادي القراءة».')) + '</p>' +
      '<div class="ccmds">' + COCO_CMDS.map(function(c){ return '<button type="button" data-coco-cmd="' + c.id + '"><span>' + c.icon + '</span>' + esc(t(c.en, c.ar)) + '</button>'; }).join('') + '</div>');
    cocoLoadStudents();
  }
  // understand a typed order well enough to fill in the form for the teacher to confirm
  function cocoParse(text){
    const s = ' ' + String(text || '').toLowerCase() + ' ';
    const kind = /تقرير|report/.test(s) ? 'report' : /نتائج|نتيجة|results|مين خلص|who finished/.test(s) ? 'results'
      : /اختبار|امتحان|كويز|quiz|test/.test(s) ? 'quiz' : /واجب|homework/.test(s) ? 'homework'
      : /ذكّر|ذكر|فكّر|فكر|remind/.test(s) ? 'remind' : /ورقة|ورقه|تمارين|تدريبات|worksheet|exercise/.test(s) ? 'sheet' : /كتاب|الكتب|book/.test(s) ? 'book' : /اشرح|شرح|درس|علّم|علم|explain|teach|lesson/.test(s) ? 'lesson' : null;
    let target = null;
    COCO_CLUBS.forEach(function(c){ if(!target && COCO_CLUB_WORDS[c].some(function(w){ return s.indexOf(w) !== -1; })) target = 'club:' + c; });
    if(!target && cocoStudents) cocoStudents.forEach(function(st){
      const first = String(st.full_name || '').trim().split(/\s+/)[0];
      if(!target && first.length > 1 && s.indexOf(' ' + first.toLowerCase()) !== -1) target = 'student:' + st.id;
    });
    let topic = null, best = 0;
    Object.keys(COCO_TOPIC_WORDS).forEach(function(tp){
      const score = COCO_TOPIC_WORDS[tp].reduce(function(n, w){ return n + (s.indexOf(w.toLowerCase()) !== -1 ? w.length : 0); }, 0);
      if(score > best){ best = score; topic = tp; }
    });
    return { kind: kind, target: target, topic: topic };
  }
  async function cocoAssistCommand(text){
    text = (text || '').trim();
    if(!text) return;
    cocoInput.value = '';
    cocoBubble('me', '<p dir="auto">' + esc(text) + '</p>');
    await cocoLoadStudents();
    const p = cocoParse(text);
    if(!p.kind){
      cocoMood('thinking');
      cocoBubble('bot', '<p>' + esc(t('I didn’t get that order 🤔 Try “explain…”, “quiz…”, “homework…”, “report…”, “remind…” — or pick a button.', 'مافهمتش الأمر 🤔 جرّب «اشرح…» أو «اختبار…» أو «واجب…» أو «تقرير…» أو «ذكّر…» — أو اختار زرار.')) + '</p>' +
        '<div class="ccmds">' + COCO_CMDS.map(function(c){ return '<button type="button" data-coco-cmd="' + c.id + '"><span>' + c.icon + '</span>' + esc(t(c.en, c.ar)) + '</button>'; }).join('') + '</div>');
      return;
    }
    cocoForm(p.kind, p, true);
  }
  async function cocoForm(kind, pre, understood){
    pre = pre || {};
    await cocoLoadStudents();
    if(kind === 'results'){ cocoResults(); return; }
    if(kind === 'book'){ cocoGuideForm(pre.book); return; }
    if(kind === 'sheet'){ cocoSheetForm(pre); return; }
    const c = COCO_CMDS.find(function(x){ return x.id === kind; });
    const due = '<label>' + t('Due date (optional)', 'آخر ميعاد (اختياري)') + '<input type="date" name="due"></label>';
    let fields = '<label>' + t('For', 'لمين') + '<select name="target">' + cocoTargetOptions(pre.target || ('club:' + COCO_CLUBS[1])) + '</select></label>';
    if(kind === 'lesson' || kind === 'quiz'){
      fields += '<label>' + t('Lesson', 'الدرس') + '<select name="topic">' + cocoTopicOptions(pre.topic) + '</select></label>' + due +
        '<label>' + t('Message to the students (optional)', 'رسالة للطلاب (اختياري)') + '<input name="note" maxlength="200" placeholder="' + esc(t('e.g. Focus on the examples!', 'مثلاً: ركزوا في الأمثلة!')) + '"></label>';
    } else if(kind === 'homework'){
      fields += '<label>' + t('Title', 'العنوان') + '<input name="title" required maxlength="120" placeholder="' + esc(t('e.g. Write 5 sentences about your weekend', 'مثلاً: اكتب ٥ جمل عن إجازتك')) + '"></label>' +
        '<label>' + t('Instructions', 'التعليمات') + '<textarea name="text" rows="2" maxlength="600"></textarea></label>' + due;
    } else if(kind === 'report'){
      fields += '<label>' + t('Period', 'الفترة') + '<select name="days"><option value="7">' + t('Last 7 days', 'آخر ٧ أيام') + '</option><option value="30" selected>' + t('Last 30 days', 'آخر ٣٠ يوم') + '</option></select></label>';
    } else if(kind === 'remind'){
      fields += '<label>' + t('Reminder', 'التذكير') + '<textarea name="text" rows="2" required maxlength="300" placeholder="' + esc(t('e.g. Don’t forget tomorrow’s class at 6 pm!', 'مثلاً: ماتنسوش حصة بكرة الساعة ٦!')) + '"></textarea></label>';
    }
    cocoMood('curious');
    const el = cocoBubble('bot', (understood ? '<p>' + esc(t('Got it 👍 Check the details and confirm:', 'فهمت 👍 راجع التفاصيل وأكّد:')) + '</p>' : '') +
      '<form class="cform" data-coco-form="' + kind + '"><b>' + c.icon + ' ' + esc(t(c.en, c.ar)) + '</b>' + fields +
      '<div class="cmsg-cta"><button type="submit" class="cbtn">✅ ' + t('Do it', 'نفّذ') + '</button><button type="button" class="cbtn ghost" data-coco-cancel>' + t('Cancel', 'إلغاء') + '</button></div></form>');
    el.scrollIntoView({ block: 'nearest' });
  }
  function cocoTargetInfo(v){
    if(v.indexOf('club:') === 0){
      const club = v.slice(5), n = (cocoStudents || []).filter(function(s){ return s.club === club; }).length;
      return { club: club, label: club, students: (cocoStudents || []).filter(function(s){ return s.club === club; }), count: n };
    }
    const st = (cocoStudents || []).find(function(s){ return s.id === v.slice(8); }) || {};
    return { studentId: st.id, club: st.club, label: st.full_name || '—', students: st.id ? [st] : [], count: 1 };
  }
  async function cocoRun(form){
    const kind = form.dataset.cocoForm, f = form.elements, tg = cocoTargetInfo(f.target.value);
    const btn = form.querySelector('[type=submit]');
    btn.disabled = true;
    const dueVal = f.due && f.due.value ? new Date(f.due.value + 'T23:59:00').toISOString() : null;
    const done = function(html){ form.closest('.cmsg').classList.add('cdone-form'); cocoMood('proud'); cocoStars(0); cocoBubble('bot', html); };
    const fail = function(err){ btn.disabled = false; cocoMood('encouraging'); cocoBubble('bot err', '<p>' + esc(friendlyErrorMessage(err)) + '</p>'); };
    try{
      if(kind === 'lesson' || kind === 'quiz'){
        const row = { kind: kind, topic: f.topic.value, note: f.note.value.trim() || null, due_at: dueVal };
        if(tg.studentId) row.student_id = tg.studentId; else row.club = tg.club;
        const { error } = await sb.from('coco_tasks').insert(row);
        if(error) throw error;
        const note = { title: kind === 'quiz' ? t('📝 New quiz from your teacher', '📝 اختبار جديد من معلمك') : t('🧑‍🏫 New lesson from your teacher', '🧑‍🏫 درس جديد من معلمك'),
          body: 'Coco: ' + row.topic + (row.note ? ' — ' + row.note : '') };
        if(tg.studentId) note.user_id = tg.studentId; else note.club = tg.club;
        await sb.from('notifications').insert(note);
        done('<p>✅ ' + esc(kind === 'quiz'
          ? t('Done! The quiz on “' + row.topic + '” is waiting for ' + tg.label + '. I’ll mark it as soon as they finish.', 'تم! اختبار «' + row.topic + '» مستني ' + tg.label + '. هصححه أول ما يخلصوا.')
          : t('Done! I’ll teach “' + row.topic + '” to ' + tg.label + ' and tell you how they did.', 'تم! هشرح «' + row.topic + '» لـ ' + tg.label + ' وأقولك عملوا إيه.')) +
          (tg.club && !tg.studentId ? ' (' + tg.count + ' ' + t('students', 'طالب') + ')' : '') + '</p>' +
          '<div class="cmsg-cta"><button type="button" class="cbtn ghost" data-coco-cmd="results">📋 ' + t('See results', 'شوف النتائج') + '</button></div>');
      } else if(kind === 'homework'){
        if(!tg.club) throw new Error(t('This student has no club yet.', 'الطالب ده مالوش نادي لسه.'));
        const { error } = await sb.from('assignments').insert({ club: tg.club, title: f.title.value.trim(), instructions: f.text.value.trim(), due_at: dueVal });
        if(error) throw error;
        done('<p>✅ ' + esc(t('Homework sent to ' + tg.club + '. Students can answer with text, a photo or a voice note — you’ll find their answers in Homework.', 'تم إرسال الواجب لـ ' + tg.club + '. الطلاب يقدروا يجاوبوا كتابة أو بصورة أو تسجيل صوتي — هتلاقي الإجابات في الواجبات.')) +
          (tg.studentId ? ' ' + esc(t('(Homework goes to the whole club.)', '(الواجب بيروح للنادي كله.)')) : '') + '</p>');
      } else if(kind === 'report'){
        const list = tg.students, days = parseInt(f.days.value, 10) || 30;
        if(!list.length) throw new Error(t('No students in ' + tg.label + ' yet.', 'مفيش طلاب في ' + tg.label + ' لسه.'));
        const prog = cocoBubble('bot', '<p>' + esc(t('Writing reports…', 'بكتب التقارير…')) + ' <b>0 / ' + list.length + '</b></p>');
        let sent = 0, sample = '';
        for(const st of list){
          const { data: r, error } = await sb.rpc('coco_report', { p_student: st.id, p_days: days });
          if(error) throw error;
          const body = cocoReportText(r, days);
          const res = await sb.from('messages').insert({ student_id: st.id, body: body });
          if(res.error) throw res.error;
          sent++; if(!sample) sample = body;
          prog.querySelector('b').textContent = sent + ' / ' + list.length;
        }
        done('<p>✅ ' + esc(t('Sent ' + sent + ' report(s). Each student and their parents can read it in Messages.', 'اتبعت ' + sent + ' تقرير. كل طالب وولي أمره يقدروا يقروه في الرسائل.')) + '</p><pre class="creport" dir="rtl">' + esc(sample) + '</pre>');
      } else if(kind === 'remind'){
        const note = { title: t('🔔 Reminder from your teacher', '🔔 تذكير من معلمك'), body: f.text.value.trim() };
        if(tg.studentId) note.user_id = tg.studentId; else note.club = tg.club;
        const { error } = await sb.from('notifications').insert(note);
        if(error) throw error;
        done('<p>✅ ' + esc(t('Reminder sent to ' + tg.label + '. It pops up for them right away.', 'التذكير اتبعت لـ ' + tg.label + '. هيظهرلهم على طول.')) + '</p>');
      }
    }catch(err){ fail(err); }
  }
  // a short, friendly report in Arabic (the academy's parents) with the key numbers
  function cocoReportText(r, days){
    const L = [];
    L.push('📊 تقرير كوكو — ' + (r.name || '') + ' (آخر ' + days + ' يوم)');
    L.push('📚 القراءة: ' + (r.books || 0) + ' كتاب في ' + (r.read_days || 0) + ' يوم');
    L.push('🧑‍🏫 دروس واختبارات كوكو: ' + (r.coco_done || 0) + ' خلصها' + (r.coco_pct != null ? ' — متوسط ' + r.coco_pct + '%' : '') + (r.coco_todo ? ' · ' + r.coco_todo + ' لسه مستنياه' : ''));
    L.push('✍️ الواجبات: ' + (r.hw_done || 0) + ' اتسلّم' + (r.hw_avg != null ? ' — متوسط الدرجة ' + r.hw_avg + '/100' : '') + (r.hw_missing ? ' · ' + r.hw_missing + ' ماتسلّمش' : ''));
    if((r.present || 0) + (r.absent || 0)) L.push('🎥 الحصص: حضر ' + (r.present || 0) + ' · غاب ' + (r.absent || 0));
    (r.exams || []).slice(0, 2).forEach(function(e){ L.push('🎓 امتحان ' + levelName(e.level) + ': ' + e.score + '% ' + (e.passed ? '✅' : '')); });
    const good = (r.coco_pct || 0) >= 75 || (r.hw_avg || 0) >= 75, todo = (r.coco_todo || 0) + (r.hw_missing || 0);
    L.push(todo ? '💡 مطلوب: ' + todo + ' مهمة لسه ما اتعملتش — يلا نخلصها! 💪' : good ? '🌟 مستوى ممتاز، استمر!' : '👍 شغل كويس، ونقدر نتحسن أكتر مع التمرين.');
    return L.join('\n');
  }
  async function cocoResults(){
    cocoMood('thinking');
    const wait = cocoBubble('bot typing', '<span></span><span></span><span></span>');
    const { data: tasks, error } = await sb.from('coco_tasks').select('*').order('created_at', { ascending: false }).limit(15);
    const ids = (tasks || []).map(function(x){ return x.id; });
    const { data: res } = ids.length ? await sb.from('coco_results').select('*').in('task_id', ids) : { data: [] };
    wait.remove();
    if(error){ cocoBubble('bot err', '<p>' + esc(friendlyErrorMessage(error)) + '</p>'); return; }
    if(!ids.length){ cocoBubble('bot', '<p>' + esc(t('No tasks yet — give me an order first!', 'مفيش مهام لسه — ادّيني أمر الأول!')) + '</p>'); return; }
    const name = function(id){ const s = (cocoStudents || []).find(function(x){ return x.id === id; }); return s ? s.full_name : '—'; };
    cocoMood('happy');
    cocoBubble('bot', '<p><b>📋 ' + esc(t('Results', 'النتائج')) + '</b></p>' + tasks.map(function(tk){
      const who = tk.student_id ? (cocoStudents || []).filter(function(s){ return s.id === tk.student_id; }) : (cocoStudents || []).filter(function(s){ return s.club === tk.club; });
      const rs = (res || []).filter(function(r){ return r.task_id === tk.id; });
      const missing = who.filter(function(s){ return !rs.some(function(r){ return r.student_id === s.id; }); });
      return '<details class="cres"><summary><span>' + (tk.kind === 'quiz' ? '📝' : '🧑‍🏫') + ' <bdi>' + esc(tk.topic) + '</bdi></span><small>' + esc(tk.student_id ? name(tk.student_id) : tk.club) + ' · ' +
        rs.length + '/' + who.length + ' ' + t('done', 'خلصوا') + '</small></summary><ul>' +
        rs.map(function(r){ return '<li>✅ ' + esc(name(r.student_id)) + ' — <b>' + r.score + '/' + r.total + '</b></li>'; }).join('') +
        missing.map(function(s){ return '<li class="miss">⏳ ' + esc(s.full_name || '—') + '</li>'; }).join('') + '</ul>' +
        '<button type="button" class="cbtn ghost" data-coco-deltask="' + tk.id + '">' + t('Delete task', 'حذف المهمة') + '</button></details>';
    }).join(''));
  }

  // ---- the student's side: tasks from the teacher ----
  async function cocoMyTasks(){
    if(!currentProfile || !isStudent()) return [];
    const [{ data: tasks }, { data: res }] = await Promise.all([
      sb.from('coco_tasks').select('*').order('created_at', { ascending: false }).limit(20),
      sb.from('coco_results').select('*').eq('student_id', currentProfile.id)
    ]);
    return (tasks || []).map(function(tk){ return Object.assign({}, tk, { result: (res || []).find(function(r){ return r.task_id === tk.id; }) || null }); });
  }
  async function cocoStartQuiz(task){
    const steps = await cocoBuiltIn(task.topic);
    if(!steps){ cocoBubble('bot err', '<p>' + esc(t('I couldn’t find this quiz.', 'مش لاقي الاختبار ده.')) + '</p>'); return; }
    const qs = steps.map(function(s){
      const right = s.check.options[s.check.answer_index];
      const opts = shuffleArr(s.check.options.slice());
      return { q: s.check.question, opts: opts, ans: opts.indexOf(right), why: s.check.why_ar };
    });
    cocoLesson = { quiz: true, task: task, qs: qs, i: 0, answers: [] };
    coco.classList.add('lesson-active');
    cocoLog.innerHTML = '';
    cocoBubble('scene', '📝 <bdi>' + esc(task.topic) + '</bdi>');
    if(task.note) cocoBubble('bot', '<p>💬 ' + esc(t('Your teacher says: ', 'معلمك بيقولك: ')) + '<span dir="auto">' + esc(task.note) + '</span></p>');
    cocoQuizNext();
  }
  function cocoQuizNext(){
    const L = cocoLesson, q = L.qs[L.i];
    cocoBubble('bot', '<div class="cquiz" data-quiz="1"><b>' + t('Question', 'سؤال') + ' <bdi dir="ltr">' + (L.i + 1) + ' / ' + L.qs.length + '</bdi></b><p dir="ltr">' + esc(q.q) + '</p>' +
      '<div class="copts">' + q.opts.map(function(o, k){ return '<button type="button" dir="ltr" data-coco-qopt="' + k + '">' + esc(o) + '</button>'; }).join('') + '</div></div>');
    cocoMood('curious');
  }
  async function cocoQuizAnswer(btn){
    const L = cocoLesson, q = L.qs[L.i], quiz = btn.closest('.cquiz');
    if(quiz.dataset.answered) return;
    quiz.dataset.answered = '1';
    const k = parseInt(btn.dataset.cocoQopt, 10), right = k === q.ans;
    quiz.querySelectorAll('[data-coco-qopt]').forEach(function(b){ b.disabled = true; if(parseInt(b.dataset.cocoQopt, 10) === q.ans) b.classList.add('right'); });
    if(!right) btn.classList.add('wrong');
    L.answers.push({ q: q.q, chosen: q.opts[k], right: right });
    cocoMood(right ? 'proud' : 'encouraging');
    L.i++;
    if(L.i < L.qs.length){ setTimeout(cocoQuizNext, 700); return; }
    const score = L.answers.filter(function(a){ return a.right; }).length;
    // a teacher's task saves the score; a book's practice questions don't
    const { error } = L.task.id ? await sb.from('coco_results').insert({ task_id: L.task.id, student_id: currentProfile.id, score: score, total: L.qs.length, answers: L.answers }) : { error: null };
    if(score) cocoStars(score);
    cocoBubble('bot done', '<div class="cdone"><span>' + (score === L.qs.length ? '🏆' : '📝') + '</span><b>' + esc(t('Quiz marked!', 'الاختبار اتصحح!')) + '</b><bdi>' + esc(L.task.topic) + '</bdi>' +
      '<em dir="ltr">' + score + ' / ' + L.qs.length + '</em><p>' + esc(error ? t('(Couldn’t save the result — tell your teacher.)', '(ماقدرتش أحفظ النتيجة — بلّغ معلمك.)') : L.task.id ? t('Your teacher can see your result.', 'معلمك يقدر يشوف نتيجتك.') : t('Great practice!', 'تمرين ممتاز!')) + '</p></div>' +
      L.qs.map(function(q2, i){ const a = L.answers[i]; return a.right ? '' : '<div class="ccorr"><b>✏️ <span dir="ltr">' + esc(q2.q) + '</span></b><em dir="ltr">' + esc(q2.opts[q2.ans]) + '</em><small>' + esc(q2.why) + '</small></div>'; }).join('') +
      '<div class="cmsg-cta"><button type="button" class="cbtn ghost" data-coco-mode="learn">' + t('Back', 'رجوع') + '</button></div>');
    coco.classList.remove('lesson-active');
    cocoLesson = null;
  }


  // ---- the assistant tab: Coco carries out orders (teachers) and helps with anything (students, parents) ----
  // With the AI switched on (AI-TUTOR.md) Coco understands any request and acts through the server.
  // Without it, the buttons and forms below still do every teacher order for free, and students still get their tasks.
  let cocoAiOff = false; // set once the AI turns out not to be set up
  function cocoAssistHello(){
    cocoLog.innerHTML = '';
    cocoTurns = [];
    cocoMood('happy');
    const first = (currentProfile.full_name || '').split(' ')[0];
    if(isTeacher()){
      cocoAssistHome();
    } else if(isParent()){
      cocoBubble('bot', '<p>' + esc(t('Hi ' + first + '! I’m Coco 🤖 Ask me how your children are doing — homework, grades, Coco lessons, attendance or their plan.',
        'أهلاً ' + first + '! أنا كوكو 🤖 اسألني عن ولادك — الواجبات والدرجات ودروس كوكو والحضور والخطة.')) + '</p>' + cocoChips([
        t('How are my children doing?', 'ولادي عاملين إيه؟'), t('Any homework not handed in?', 'فيه واجبات ماتسلمتش؟')]));
    } else {
      cocoBubble('bot', '<p>' + esc(t('Hi ' + first + '! I’m your assistant 🤖 Ask me anything — explain a rule, help with homework, or what’s waiting for you.',
        'أهلاً ' + first + '! أنا مساعدك 🤖 اسألني في أي حاجة — أشرحلك قاعدة، أساعدك في الواجب، أو أقولك إيه اللي مستنيك.')) + '</p>' + cocoChips([
        t('What do I have to do?', 'إيه المطلوب مني؟'), t('Explain the present perfect', 'اشرحلي المضارع التام'), t('Check my sentence: I go to school yesterday', 'صحّحلي: I go to school yesterday')]));
      cocoShowTasks();
    }
  }
  function cocoChips(list){
    return '<div class="cchips">' + list.map(function(q){ return '<button type="button" data-coco-ask="' + esc(q) + '" dir="auto">' + esc(q) + '</button>'; }).join('') + '</div>';
  }
  function cocoAssistReplyHtml(r){
    let h = '<div class="cassist" dir="auto">' + esc(r.reply).replace(/\n/g, '<br>') + '</div>';
    if(r.actions && r.actions.length) h += '<ul class="cacts">' + r.actions.map(function(a){ return '<li><span>' + esc(a.icon || '✅') + '</span><bdi>' + esc(a.text) + '</bdi></li>'; }).join('') + '</ul>';
    if(r.offers && r.offers.length) h += '<div class="ctopics">' + r.offers.map(function(tp){ return '<button type="button" data-coco-topic="' + esc(tp) + '">🧑‍🏫 <bdi>' + esc(tp) + '</bdi></button>'; }).join('') + '</div>';
    if(r.sheets && r.sheets.length) h += '<div class="ctopics">' + r.sheets.map(function(x){ return '<button type="button" data-coco-sheet="' + esc(x.topic) + '" data-level="' + esc(x.level) + '">🖨️ <bdi>' + esc(x.topic) + '</bdi> <small>· ' + esc(levelName(x.level)) + '</small></button>'; }).join('') + '</div>';
    return h;
  }
  async function cocoAssistSend(text){
    text = (text || '').trim();
    if(!text || cocoBusy) return;
    if(!currentProfile){ cocoSignin(); return; }
    if(cocoAiOff){ cocoAssistFree(text); return; }
    cocoInput.value = '';
    const mine = cocoBubble('me', '<p dir="auto">' + esc(text) + '</p>');
    cocoTurns.push({ role: 'user', text: text });
    cocoBusy = true; cocoMood('thinking'); cocoState('busy', true);
    const wait = cocoBubble('bot typing', '<span></span><span></span><span></span>');
    const out = await cocoCall({ mode: 'assistant', level: levelForAi(cocoLevelKey()), turns: cocoTurns });
    wait.remove();
    cocoBusy = false; cocoState('busy', false);
    const r = out.data;
    if(out.err === 'setup'){
      cocoTurns.pop();
      cocoAiOff = true;
      mine.remove(); // the free assistant shows the message again itself
      cocoAssistFree(text, true);
      return;
    }
    if(out.err || !r || !r.reply){
      cocoTurns.pop();
      cocoMood('encouraging');
      cocoBubble('bot err', '<p>' + esc(cocoErrText(out.err)) + '</p>');
      return;
    }
    cocoTurns.push({ role: 'assistant', text: r.reply + (r.actions && r.actions.length ? '\n[done: ' + r.actions.map(function(a){ return a.text; }).join('; ') + ']' : '') });
    cocoMood(r.actions && r.actions.length ? 'proud' : 'happy');
    cocoBubble('bot', cocoAssistReplyHtml(r));
    cocoShowLeft(r.left);
    if(r.actions && r.actions.length){ cocoStars(0); if(isTeacher()) cocoStudents = null; }
  }
  // no AI: understand the order with simple rules and show the form to confirm
  function cocoAssistFree(text, first){
    if(isTeacher()){
      if(first && isAdmin()) cocoBubble('bot', '<p><small>' + esc(t('(Free mode — the AI isn’t switched on, see AI-TUTOR.md. Buttons and forms work fully.)', '(وضع مجاني — الذكاء الاصطناعي مش متفعّل، شوف AI-TUTOR.md. الأزرار والنماذج شغالة كلها.)')) + '</small></p>');
      cocoAssistCommand(text);
      return;
    }
    cocoInput.value = '';
    cocoBubble('me', '<p dir="auto">' + esc(text) + '</p>');
    cocoMood('encouraging');
    if(isParent()){
      cocoBubble('bot', '<p>' + esc(t('Your children’s homework, grades, attendance and plan are all in “My children” 👨‍👩‍👧 — and you can message the teacher any time in Messages.',
        'واجبات ولادك ودرجاتهم وحضورهم وخطتهم كلها في «أبنائي» 👨‍👩‍👧 — وتقدر تكلم المعلم في أي وقت من الرسائل.')) + '</p>');
      return;
    }
    const p = cocoParse(text);
    cocoBubble('bot', '<p>' + esc(p.topic ? t('I have a lesson on that! 👇', 'عندي درس عن كده! 👇') : t('Here’s how I can help you 👇', 'ده اللي أقدر أساعدك بيه 👇')) + '</p>' +
      (p.topic ? '<div class="ctopics"><button type="button" data-coco-topic="' + esc(p.topic) + '">🧑‍🏫 <bdi>' + esc(p.topic) + '</bdi></button></div>' : '') +
      '<div class="cmsg-cta"><button type="button" class="cbtn ghost" data-coco-mode="learn">🧑‍🏫 ' + t('Lessons & books', 'الدروس والكتب') + '</button><button type="button" class="cbtn ghost" data-coco-mode="talk">💬 ' + t('Chat', 'محادثة') + '</button><button type="button" class="cbtn ghost" data-coco-mode="say">🎤 ' + t('Say it', 'قلها') + '</button></div>');
  }
  // the student's tasks from the teacher, as buttons
  async function cocoShowTasks(){
    if(!isStudent()) return;
    const mode = cocoMode;
    const list = (await cocoMyTasks()).filter(function(tk){ return !tk.result; });
    if(!list.length || cocoMode !== mode || cocoLesson || !coco.querySelector('.cmsg')) return;
    cocoBubble('bot tasks', '<p><b>📌 ' + esc(t('From your teacher', 'من معلمك')) + '</b></p><div class="ctopics">' + list.slice(0, 6).map(function(tk){
      return '<button type="button" data-coco-task="' + tk.id + '">' + (tk.kind === 'quiz' ? '📝 ' : '🧑‍🏫 ') + '<bdi>' + esc(tk.topic) + '</bdi>' +
        (tk.due_at ? ' <small>· ' + esc(t('due ', 'آخر ميعاد ')) + new Date(tk.due_at).toLocaleDateString(document.documentElement.lang === 'ar' ? 'ar-EG' : 'en-GB', { day: 'numeric', month: 'short' }) + '</small>' : '') + '</button>';
    }).join('') + '</div>');
    cocoTaskCache = list;
  }
  let cocoTaskCache = [];
  async function cocoStartTask(id){
    const tk = cocoTaskCache.find(function(x){ return String(x.id) === String(id); });
    if(!tk) return;
    if(tk.kind === 'quiz') cocoStartQuiz(tk);
    else { await cocoStartLesson(tk.topic); if(cocoLesson) cocoLesson.task = tk; }
  }


  // ---- free conversations: ready-made dialogues when the AI isn't switched on (assets/data/dialogs.json) ----
  const COCO_CHATS = ['day', 'family', 'food', 'hobbies', 'weekend', 'dreams'];
  let cocoDialogs = null, cocoDlg = null; // cocoDlg: { id, i, stars }
  async function cocoLoadDialogs(){
    if(cocoDialogs) return cocoDialogs;
    try{ const res = await fetch('assets/data/dialogs.json'); if(res.ok) cocoDialogs = await res.json(); }catch(e){}
    return cocoDialogs;
  }
  // is the AI tutor switched on? Asked once: an empty request is refused with "bad_request" when the function is deployed
  let cocoAiOn = false;
  async function cocoAiReady(){
    if(!currentProfile || cocoAiOff) return false;
    if(cocoAiOn) return true;
    const out = await cocoCall({ mode: 'talk', turns: [] });
    if(out.err === 'bad_request' || out.err === 'busy' || out.err === 'limit'){ cocoAiOn = true; return true; }
    cocoAiOff = true;
    return false;
  }
  function cocoChatPicker(){
    const D = cocoDialogs || {};
    cocoBubble('bot', '<p>' + esc(t('Let’s chat! Pick a topic 👇 Choose an answer or say it with the mic.', 'يلا نتكلم! اختار موضوع 👇 واختار الرد أو قوله بالمايك.')) + '</p><div class="cscenes">' +
      COCO_CHATS.filter(function(id){ return D[id]; }).map(function(id){ return '<button type="button" data-coco-dlg="' + id + '"><span>' + D[id].icon + '</span>' + esc(t(D[id].en, D[id].ar)) + '</button>'; }).join('') + '</div>');
  }
  async function cocoStartDialog(id){
    const D = await cocoLoadDialogs();
    if(!D || !D[id]){ cocoBubble('bot err', '<p>' + esc(t('Oops, Coco lost the thread. Please try again.', 'حصل خطأ بسيط، حاول مرة أخرى.')) + '</p>'); return; }
    cocoDlg = { id: id, i: 0, stars: 0 };
    cocoLog.innerHTML = '';
    const sc = COCO_SCENES.find(function(s){ return s.id === id; }) || D[id];
    cocoBubble('scene', '<span>' + sc.icon + '</span>' + esc(t(sc.en, sc.ar)));
    cocoDlgTurn();
  }
  function cocoDlgTurn(){
    const d = cocoDialogs[cocoDlg.id], turn = d.turns[cocoDlg.i];
    const order = shuffleArr([0, 1, 2]);
    cocoBubble('bot', cocoReplyHtml({ reply: turn.coco, reply_ar: turn.ar, new_words: turn.words }) +
      '<div class="cquiz dlg"><b>💬 ' + t('Your answer — tap or say it', 'ردّك — اختار أو قوله') + '</b><div class="copts">' +
      order.map(function(k){ return '<button type="button" dir="ltr" data-coco-dopt="' + k + '">' + esc(turn.options[k].t) + '</button>'; }).join('') + '</div></div>');
    cocoMood('curious');
    cocoSay(turn.coco);
  }
  // the student typed or said something: use the answer it is closest to
  function cocoDlgMatch(text){
    const words = function(s){ return s.toLowerCase().replace(/[^a-z' ]/g, ' ').split(/\s+/).filter(Boolean); };
    const said = words(text), turn = cocoDialogs[cocoDlg.id].turns[cocoDlg.i];
    let best = -1, score = 0;
    turn.options.forEach(function(o, k){
      const ws = words(o.t), hit = ws.filter(function(w){ return said.indexOf(w) !== -1; }).length;
      const s = hit / Math.max(ws.length, said.length, 1);
      if(s > score){ score = s; best = k; }
    });
    return score >= 0.5 ? best : -1;
  }
  function cocoDlgAnswer(k, own){
    const d = cocoDialogs[cocoDlg.id], turn = d.turns[cocoDlg.i], o = turn.options[k];
    const quiz = [...cocoLog.querySelectorAll('.cquiz.dlg:not([data-answered])')].pop();
    if(!quiz) return;
    quiz.dataset.answered = '1';
    quiz.querySelectorAll('[data-coco-dopt]').forEach(function(b){ b.disabled = true; if(parseInt(b.dataset.cocoDopt, 10) === k) b.classList.add(o.k === 'best' ? 'right' : o.k === 'ok' ? 'meh' : 'wrong'); });
    cocoBubble('me', '<p dir="ltr">' + esc(own || o.t) + '</p>');
    if(o.k === 'best'){
      cocoDlg.stars++; cocoStars(1); cocoMood('proud');
      cocoBubble('bot', '<p>✅ ' + esc(t('Perfect!', 'ممتاز!')) + '</p>');
    } else {
      cocoMood('encouraging');
      cocoBubble('bot', '<div class="ccorr"><b>✏️ ' + (o.k === 'ok' ? t('Good! Even better:', 'كويس! والأحلى:') : t('Say it like this', 'قلها كده')) + '</b>' +
        '<em dir="ltr">' + esc(o.fix) + '</em><small dir="rtl">' + esc(o.why) + '</small>' +
        '<div class="cmsg-tools"><button type="button" data-coco-play="' + esc(o.fix) + '" data-force="1">🔊 ' + t('Listen', 'استمع') + '</button></div></div>');
    }
    cocoDlg.i++;
    if(cocoDlg.i < d.turns.length){ setTimeout(cocoDlgTurn, o.k === 'best' ? 700 : 1600); return; }
    const n = d.turns.length, s = cocoDlg.stars, id = cocoDlg.id;
    cocoDlg = null;
    setTimeout(function(){
      cocoBubble('bot done', '<div class="cdone"><span>' + (s === n ? '🏆' : '🎉') + '</span><b>' + esc(t('Well done!', 'برافو!')) + '</b>' +
        '<p dir="ltr">' + esc(d.end) + '</p><small>' + esc(d.end_ar) + '</small><em dir="ltr">' + '★'.repeat(s) + '☆'.repeat(n - s) + ' ' + s + ' / ' + n + '</em></div>' +
        '<div class="cmsg-cta"><button type="button" class="cbtn" data-coco-dlg="' + id + '">🔁 ' + t('Again', 'تاني') + '</button>' +
        '<button type="button" class="cbtn ghost" data-coco-mode="' + cocoMode + '">' + t('Another one', 'واحد تاني') + '</button></div>');
      cocoMood(s >= n - 1 ? 'proud' : 'happy');
      cocoSay(d.end);
    }, 900);
  }
  function cocoDlgSubmit(text){
    text = (text || '').trim();
    if(!text) return;
    cocoInput.value = '';
    const k = cocoDlgMatch(text);
    if(k === -1){
      cocoBubble('me', '<p dir="auto">' + esc(text) + '</p>');
      cocoMood('thinking');
      cocoBubble('bot', '<p>' + esc(t('Hmm, I didn’t catch that 🤔 Try one of the answers above — tap it or say it.', 'مش فاهم قصدك 🤔 جرّب رد من الردود اللي فوق — اضغط عليه أو قوله.')) + '</p>');
      return;
    }
    cocoDlgAnswer(k, text);
  }

  // ---- books: Coco explains the club's books — the teacher's guide (summary, words, sentences, questions)
  // plus reading the book's own text aloud, sentence by sentence. Free; the paywall still decides how many pages.
  let cocoBooks = [], cocoBook = null; // cocoBook: { item, pages: [[sentences]], p }
  function cocoGuide(item){ const g = item && item.guide; return g && (g.summary_ar || g.summary_en || (g.words || []).length || (g.sentences || []).length || (g.questions || []).length) ? g : null; }
  async function cocoShowBooks(){
    if(!isStudent() || !currentProfile.club) return;
    const mode = cocoMode;
    const level = currentStudentLevel();
    const { data } = await sb.from('materials').select('*').eq('club', currentProfile.club).order('created_at', { ascending: false });
    const all = data || [], here = all.filter(function(m){ return !m.level || m.level === level; });
    cocoBooks = (here.length ? here : all).slice(0, 8);
    if(!cocoBooks.length || cocoMode !== mode || cocoLesson || cocoBook) return;
    cocoBubble('bot books', '<p><b>📚 ' + esc(t('Books of your club', 'كتب ناديك')) + '</b> — ' + esc(t('I’ll explain them for you', 'هشرحهالك')) + '</p><div class="ctopics">' +
      cocoBooks.map(function(m){ return '<button type="button" data-coco-book="' + m.id + '">' + (cocoGuide(m) ? '🤖 ' : '📖 ') + '<bdi>' + esc(m.title) + '</bdi></button>'; }).join('') + '</div>');
  }
  async function cocoOpenBook(id){
    const item = cocoBooks.find(function(m){ return String(m.id) === String(id); });
    if(!item) return;
    cocoBook = null;
    const g = cocoGuide(item);
    cocoLog.innerHTML = '';
    coco.classList.add('lesson-active');
    cocoBubble('scene', '📚 <bdi>' + esc(item.title) + '</bdi>');
    const btn = function(attr, label){ return '<button type="button" class="cbtn ghost" ' + attr + '>' + label + '</button>'; };
    cocoBubble('bot', '<p>' + esc(g ? t('What would you like to do with this book?', 'تحب نعمل إيه مع الكتاب ده؟')
        : t('Your teacher hasn’t written my guide for this book yet, but I can read it with you!', 'معلمك لسه ماكتبش شرحي للكتاب ده، بس أقدر أقراه معاك!')) + '</p>' +
      '<div class="cmsg-cta cbook-menu">' +
      (g && (g.summary_ar || g.summary_en) ? btn('data-coco-bk="summary"', '📖 ' + t('Explain the book', 'اشرحلي الكتاب')) : '') +
      (g && (g.words || []).length ? btn('data-coco-bk="words"', '🔤 ' + t('Key words', 'الكلمات المهمة')) : '') +
      (g && (g.sentences || []).length ? btn('data-coco-bk="say"', '🎤 ' + t('Say the sentences', 'انطق الجمل')) : '') +
      (g && (g.questions || []).length ? btn('data-coco-bk="quiz"', '✅ ' + t('Questions', 'أسئلة')) : '') +
      (fileExt(item.file_name || item.file_path) === 'pdf' || item.preview_path ? btn('data-coco-bk="read"', '🎧 ' + t('Read it with Coco', 'اقراه مع كوكو')) : '') +
      btn('data-coco-bk="open"', '📕 ' + t('Open the book', 'افتح الكتاب')) +
      btn('data-coco-mode="learn"', t('Back', 'رجوع')) + '</div>');
    cocoBook = { item: item };
    cocoMood('happy');
  }
  async function cocoBookAction(kind){
    const item = cocoBook && cocoBook.item, g = cocoGuide(item);
    if(!item) return;
    if(kind === 'open'){ await refreshBookAccess([item]); cocoClose(); openReader(item); return; }
    if(kind === 'summary'){
      cocoBubble('bot', (g.summary_en ? '<p dir="ltr">' + esc(g.summary_en).replace(/\n/g, '<br>') + '</p><div class="cmsg-tools"><button type="button" data-coco-play="' + esc(g.summary_en) + '" data-force="1">🔊 ' + t('Listen', 'استمع') + '</button></div>' : '') +
        (g.summary_ar ? '<p dir="rtl">' + esc(g.summary_ar).replace(/\n/g, '<br>') + '</p>' : ''));
      if(g.summary_en) cocoSay(g.summary_en);
    } else if(kind === 'words'){
      cocoBubble('bot', '<p><b>🔤 ' + esc(t('Key words — tap ＋ to keep a word', 'الكلمات المهمة — اضغط ＋ عشان تحفظ الكلمة')) + '</b></p><div class="cwords">' + g.words.map(function(w){
        return '<button type="button" data-coco-word="' + esc(w.en) + '" data-ar="' + esc(w.ar || '') + '">＋ <bdi>' + esc(w.en) + '</bdi> <small>' + esc(w.ar || '') + '</small></button>';
      }).join('') + '</div><div class="cmsg-tools">' + g.words.slice(0, 12).map(function(w){ return '<button type="button" data-coco-play="' + esc(w.en) + '" data-force="1">🔊 ' + esc(w.en) + '</button>'; }).join('') + '</div>');
    } else if(kind === 'say'){
      const list = g.sentences.slice();
      cocoSetMode('say');
      cocoSayCustom = list; cocoSayIdx = 0; cocoRenderSay();
      return;
    } else if(kind === 'quiz'){
      const qs = g.questions.map(function(q){ const right = q.options[0], opts = shuffleArr(q.options.slice()); return { q: q.q, opts: opts, ans: opts.indexOf(right), why: t('The answer: ', 'الإجابة: ') + right }; });
      cocoLesson = { quiz: true, task: { id: null, topic: item.title, note: null }, qs: qs, i: 0, answers: [] };
      cocoQuizNext();
      return;
    } else if(kind === 'read'){
      await cocoReadBook(item);
      return;
    }
    cocoMood('happy');
  }
  // the PDF's own text, read with pdf.js (loaded only when needed)
  let pdfJsLoading = null;
  function loadPdfJs(){
    if(window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if(!pdfJsLoading) pdfJsLoading = new Promise(function(resolve, reject){
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
      s.onload = function(){ window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js'; resolve(window.pdfjsLib); };
      s.onerror = function(){ pdfJsLoading = null; reject(new Error('Could not load the PDF reader')); };
      document.head.appendChild(s);
    });
    return pdfJsLoading;
  }
  async function cocoReadBook(item){
    const wait = cocoBubble('bot typing', '<span></span><span></span><span></span>');
    cocoMood('thinking'); cocoState('busy', true);
    let pages = [];
    try{
      await refreshBookAccess([item]);
      const full = canReadFull(item), url = bookSrc(item);
      if(!url) throw new Error('locked');
      if(full && fileExt(item.file_name || item.file_path) !== 'pdf') throw new Error('notpdf');
      const pdfjs = await loadPdfJs();
      const doc = await pdfjs.getDocument({ url: url }).promise;
      for(let n = 1; n <= Math.min(doc.numPages, 60); n++){
        const tc = await (await doc.getPage(n)).getTextContent();
        const text = tc.items.map(function(x){ return x.str + (x.hasEOL ? '\n' : ' '); }).join('').replace(/[ \t]+/g, ' ');
        const sentences = text.replace(/\s*\n\s*/g, ' ').split(/(?<=[.!?])\s+(?=[A-Z"“‘'])/).map(function(x){ return x.trim(); })
          .filter(function(x){ return /[a-z]{2}/i.test(x); }).map(function(x){ return x.length > 220 ? x.slice(0, 217) + '…' : x; });
        pages.push(sentences);
      }
    }catch(e){ pages = e && e.message === 'locked' ? null : e && e.message === 'notpdf' ? 'notpdf' : []; }
    wait.remove(); cocoState('busy', false);
    if(pages === null){ cocoMood('encouraging'); cocoBubble('bot', '<p>🔒 ' + esc(t('This book opens with a plan.', 'الكتاب ده بيفتح مع الاشتراك.')) + '</p>'); return; }
    if(pages === 'notpdf' || !pages.some(function(p){ return p.length; })){
      cocoMood('encouraging');
      cocoBubble('bot', '<p>' + esc(t('This book is mostly pictures, so I can’t read its words aloud 🙈 Open it and read along, and ask your teacher to write my guide for it.',
        'الكتاب ده أغلبه صور، فمش هقدر أقرا كلامه بصوت 🙈 افتحه واقرا معاه، واطلب من معلمك يكتب شرحي ليه.')) + '</p>' +
        '<div class="cmsg-cta"><button type="button" class="cbtn ghost" data-coco-bk="open">📕 ' + t('Open the book', 'افتح الكتاب') + '</button></div>');
      return;
    }
    cocoBook.pages = pages; cocoBook.p = pages.findIndex(function(p){ return p.length; });
    cocoBook.preview = !canReadFull(item);
    cocoBookPage();
  }
  function cocoBookPage(){
    const B = cocoBook, list = B.pages[B.p], more = B.pages.slice(B.p + 1).some(function(p){ return p.length; });
    cocoBubble('bot board', '<div class="cboard"><div class="cb-top"><span>' + t('Page', 'صفحة') + ' <bdi dir="ltr">' + (B.p + 1) + ' / ' + B.pages.length + '</bdi></span></div>' +
      '<ul class="cb-ex">' + list.map(function(x){ return '<li><button type="button" data-coco-play="' + esc(x) + '" data-force="1" aria-label="' + t('Listen', 'استمع') + '">🔊</button><span><b dir="ltr">' + esc(x) + '</b></span></li>'; }).join('') + '</ul></div>' +
      '<div class="cmsg-cta"><button type="button" class="cbtn" data-coco-bkall>▶️ ' + t('Read the page', 'اقرا الصفحة') + '</button>' +
      '<button type="button" class="cbtn ghost" data-coco-bksay>🎤 ' + t('Say these sentences', 'انطق الجمل دي') + '</button>' +
      (more ? '<button type="button" class="cbtn ghost" data-coco-bknext>' + t('Next page', 'الصفحة الجاية') + ' →</button>' : '') + '</div>' +
      (!more && B.preview ? '<p><small>🔒 ' + esc(t('That’s the end of the free pages — the whole book opens with a plan.', 'كده خلصت الصفحات المجانية — الكتاب كله بيفتح مع الاشتراك.')) + '</small></p>' : ''));
    cocoMood('happy');
  }
  // reads the sentences one after another
  function cocoReadAll(list){
    if(!window.speechSynthesis || !list.length) return;
    speechSynthesis.cancel();
    list.forEach(function(x){
      const u = new SpeechSynthesisUtterance(x);
      u.lang = 'en-US'; u.rate = 0.9; if(cocoVoice) u.voice = cocoVoice;
      u.onstart = function(){ cocoState('talking', true); };
      u.onend = u.onerror = function(){ cocoState('talking', false); };
      speechSynthesis.speak(u);
    });
  }

  // ---- teachers: write Coco's guide for a book ----
  async function cocoGuideForm(id){
    cocoMood('thinking');
    const { data: books, error } = await sb.from('materials').select('*').order('club').order('level').limit(300);
    if(error){ cocoBubble('bot err', '<p>' + esc(friendlyErrorMessage(error)) + '</p>'); return; }
    if(!(books || []).length){ cocoBubble('bot', '<p>' + esc(t('There are no books yet — upload one from Materials first.', 'مفيش كتب لسه — ارفع كتاب من المواد الأول.')) + '</p>'); return; }
    cocoBooks = books;
    const item = books.find(function(m){ return String(m.id) === String(id); }) || books[0];
    const g = item.guide || {};
    const lines = function(arr, f){ return esc((arr || []).map(f).join('\n')); };
    cocoMood('curious');
    const el = cocoBubble('bot', '<form class="cform" data-coco-guide><b>📚 ' + esc(t('Coco’s guide for a book', 'شرح كوكو لكتاب')) + '</b>' +
      '<p><small>' + esc(t('Write it once — every student in the club gets it in Coco: the explanation, key words, sentences to say aloud and questions that mark themselves.',
        'اكتبيه مرة واحدة — وكل طلاب النادي هيلاقوه في كوكو: الشرح، والكلمات المهمة، وجمل ينطقوها، وأسئلة بتتصحح لوحدها.')) + '</small></p>' +
      '<label>' + t('Book', 'الكتاب') + '<select name="book" dir="auto">' + books.map(function(m){ return '<option value="' + m.id + '"' + (m.id === item.id ? ' selected' : '') + '>' + esc(m.title + ' · ' + m.club + ' · ' + levelName(m.level)) + '</option>'; }).join('') + '</select></label>' +
      '<label>' + t('Explanation in Arabic', 'الشرح بالعربي') + '<textarea name="sum_ar" rows="3" maxlength="2000" dir="rtl">' + esc(g.summary_ar || '') + '</textarea></label>' +
      '<label>' + t('Explanation in English (optional — Coco reads it aloud)', 'الشرح بالإنجليزي (اختياري — كوكو بيقراه بصوت)') + '<textarea name="sum_en" rows="3" maxlength="2000" dir="ltr">' + esc(g.summary_en || '') + '</textarea></label>' +
      '<label>' + t('Key words — one per line: word = meaning', 'الكلمات المهمة — كل سطر: الكلمة = المعنى') + '<textarea name="words" rows="3" maxlength="3000" dir="ltr" placeholder="lion = أسد">' + lines(g.words, function(w){ return w.en + ' = ' + (w.ar || ''); }) + '</textarea></label>' +
      '<label>' + t('Sentences to say aloud — one per line', 'جمل ينطقوها — كل جملة في سطر') + '<textarea name="sentences" rows="3" maxlength="3000" dir="ltr" placeholder="The lion is very big.">' + lines(g.sentences, function(x){ return x; }) + '</textarea></label>' +
      '<label>' + t('Questions — one per line: question | right answer | wrong | wrong', 'أسئلة — كل سطر: السؤال | الإجابة الصح | غلط | غلط') + '<textarea name="questions" rows="3" maxlength="4000" dir="ltr" placeholder="Where does the lion live? | In Africa | In the sea | On the moon">' + lines(g.questions, function(q){ return [q.q].concat(q.options).join(' | '); }) + '</textarea></label>' +
      '<div class="cmsg-cta"><button type="submit" class="cbtn">💾 ' + t('Save the guide', 'احفظ الشرح') + '</button><button type="button" class="cbtn ghost" data-coco-cancel>' + t('Cancel', 'إلغاء') + '</button></div></form>');
    el.scrollIntoView({ block: 'nearest' });
  }
  // picking another book in the form shows that book's guide
  cocoLog.addEventListener('change', function(e){
    const f = e.target.closest('[data-coco-guide]');
    if(!f || e.target.name !== 'book') return;
    const item = cocoBooks.find(function(m){ return String(m.id) === e.target.value; }), g = (item && item.guide) || {};
    f.sum_ar.value = g.summary_ar || ''; f.sum_en.value = g.summary_en || '';
    f.words.value = (g.words || []).map(function(w){ return w.en + ' = ' + (w.ar || ''); }).join('\n');
    f.sentences.value = (g.sentences || []).join('\n');
    f.questions.value = (g.questions || []).map(function(q){ return [q.q].concat(q.options).join(' | '); }).join('\n');
  });
  function cocoParseGuide(f){
    const rows = function(v){ return String(v || '').split('\n').map(function(x){ return x.trim(); }).filter(Boolean); };
    return {
      summary_ar: f.sum_ar.value.trim(), summary_en: f.sum_en.value.trim(),
      words: rows(f.words.value).map(function(x){ const p = x.split(/\s*[=:]\s*/); return { en: p[0], ar: p.slice(1).join(' = ') }; }).filter(function(w){ return w.en; }).slice(0, 40),
      sentences: rows(f.sentences.value).slice(0, 30),
      questions: rows(f.questions.value).map(function(x){ const p = x.split('|').map(function(y){ return y.trim(); }).filter(Boolean); return p.length >= 3 ? { q: p[0], options: p.slice(1, 4) } : null; }).filter(Boolean).slice(0, 20),
      updated_at: new Date().toISOString()
    };
  }
  async function cocoSaveGuide(form){
    const f = form.elements, btn = form.querySelector('[type=submit]');
    const guide = cocoParseGuide(f), bad = (String(f.questions.value || '').split('\n').filter(function(x){ return x.trim(); }).length) - guide.questions.length;
    btn.disabled = true;
    const { error } = await sb.from('materials').update({ guide: guide }).eq('id', f.book.value);
    if(error){ btn.disabled = false; cocoMood('encouraging'); cocoBubble('bot err', '<p>' + esc(friendlyErrorMessage(error)) + '</p>'); return; }
    const item = cocoBooks.find(function(m){ return String(m.id) === String(f.book.value); });
    if(item) item.guide = guide;
    form.closest('.cmsg').classList.add('cdone-form');
    cocoMood('proud'); cocoStars(0);
    cocoBubble('bot', '<p>✅ ' + esc(t('Saved! Students of ' + (item ? item.club : 'the club') + ' now find “' + (item ? item.title : '') + '” in Coco with: ',
      'اتحفظ! طلاب ' + (item ? item.club : 'النادي') + ' هيلاقوا «' + (item ? item.title : '') + '» في كوكو وفيه: ')) +
      esc([guide.summary_ar || guide.summary_en ? t('explanation', 'شرح') : '', guide.words.length ? guide.words.length + ' ' + t('words', 'كلمة') : '',
        guide.sentences.length ? guide.sentences.length + ' ' + t('sentences', 'جملة') : '', guide.questions.length ? guide.questions.length + ' ' + t('questions', 'سؤال') : ''].filter(Boolean).join(' · ')) + '</p>' +
      (bad > 0 ? '<p><small>⚠️ ' + esc(t(bad + ' question line(s) skipped — each needs: question | right | wrong.', 'اتساب ' + bad + ' سطر أسئلة — كل سطر محتاج: السؤال | الصح | غلط.')) + '</small></p>' : ''));
  }

  // ---- worksheets: printable exercises for a lesson, with the academy's logo and colours ----
  // With the AI on, Claude writes a fresh worksheet on any topic; otherwise it is built from the 36 written lessons.
  async function cocoWorksheetData(topic, level){
    if(!cocoAiOff && currentProfile){
      const out = await cocoCall({ mode: 'worksheet', topic: topic, level: levelForAi(level) });
      if(out.data && out.data.sections) return { data: out.data, ai: true, left: out.data.left };
      if(out.err === 'setup') cocoAiOff = true;
      else if(out.err === 'limit' || out.err === 'topic') return { err: out.err };
    }
    const steps = await cocoBuiltIn(topic);
    if(!steps) return { err: 'notopic' };
    const ex = []; steps.forEach(function(s){ (s.examples || []).forEach(function(x){ ex.push(x); }); });
    return { data: {
      title: topic, intro_ar: steps[0].explain_ar,
      sections: [
        { title_en: 'Choose the right answer', instructions_ar: 'اختار الإجابة الصحيحة.', kind: 'choose',
          items: steps.map(function(s){ return { prompt: s.check.question, options: shuffleArr(s.check.options.slice()), answer: s.check.options[s.check.answer_index] }; }) },
        { title_en: 'The rule', instructions_ar: 'اكتب القاعدة بخط واضح وحاول تحفظها.', kind: 'write',
          items: [{ prompt: steps.map(function(s){ return s.board; }).filter(Boolean).join('  ·  '), options: [], answer: steps.map(function(s){ return s.board; }).filter(Boolean).join('  ·  ') }] },
        { title_en: 'Translate into English', instructions_ar: 'ترجم الجمل دي للإنجليزي.', kind: 'translate',
          items: shuffleArr(ex.slice()).slice(0, 6).map(function(x){ return { prompt: x.ar, options: [], answer: x.en }; }) },
        { title_en: 'Your turn', instructions_ar: 'اكتب ٣ جمل عن نفسك باستخدام الدرس ده.', kind: 'write',
          items: [{ prompt: 'Write three sentences about you using: ' + topic, options: [], answer: ex.slice(0, 3).map(function(x){ return x.en; }).join(' ') }] }
      ] }, ai: false };
  }
  function cocoWorksheetHtml(ws, meta){
    const logo = new URL('assets/img/logo.jpg', location.href).href, year = new Date().getFullYear();
    const e = function(x){ return esc(String(x == null ? '' : x)); };
    const LETTERS = 'abcdefgh';
    let n = 0;
    const sections = ws.sections.map(function(sec, si){
      const items = (sec.items || []).map(function(it){
        n++;
        if(sec.kind === 'choose') return '<li><p>' + e(it.prompt) + '</p><div class="opts">' + (it.options || []).map(function(o, k){ return '<span><b>' + LETTERS[k] + ')</b> ' + e(o) + '</span>'; }).join('') + '</div></li>';
        if(sec.kind === 'write') return '<li><p>' + e(it.prompt) + '</p><div class="lines"><i></i><i></i><i></i><i></i></div></li>';
        return '<li><p' + (sec.kind === 'translate' ? ' dir="rtl" class="ar"' : '') + '>' + e(it.prompt) + '</p><div class="lines"><i></i></div></li>';
      }).join('');
      return '<section><h3><span>' + (si + 1) + '</span>' + e(sec.title_en) + '</h3>' + (sec.instructions_ar ? '<p class="ins" dir="rtl">' + e(sec.instructions_ar) + '</p>' : '') + '<ol>' + items + '</ol></section>';
    }).join('');
    const key = ws.sections.map(function(sec, si){
      return '<div class="key"><b>' + (si + 1) + '. ' + e(sec.title_en) + '</b><ol>' + (sec.items || []).map(function(it){ return '<li>' + e(it.answer) + '</li>'; }).join('') + '</ol></div>';
    }).join('');
    const foot = '<footer><img src="' + logo + '" alt=""><span>© ' + year + ' Code Cademy — All rights reserved · جميع الحقوق محفوظة لأكاديمية Code Cademy</span></footer>';
    return '<!doctype html><html lang="en"><head><meta charset="utf-8"><title>' + e(ws.title) + ' — Code Cademy</title>' +
      '<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@600;700&family=Inter:wght@400;600&family=Cairo:wght@400;600&display=swap" rel="stylesheet">' +
      '<style>' +
      '@page{size:A4;margin:14mm 14mm 18mm;}*{box-sizing:border-box}body{margin:0;font:14px/1.55 Inter,Cairo,sans-serif;color:#2b1d21;-webkit-print-color-adjust:exact;print-color-adjust:exact}' +
      '.page{max-width:780px;margin:0 auto;padding:22px;position:relative}' +
      '.page::before{content:"";position:fixed;inset:0;background:url(' + logo + ') center 55%/46% no-repeat;opacity:.05;pointer-events:none}' +
      'header{display:flex;align-items:center;gap:16px;border-bottom:4px solid #5C1A28;padding-bottom:12px}header img{width:74px;height:58px;object-fit:contain}' +
      'header div{flex:1}header small{display:block;color:#5C1A28;font-weight:600;letter-spacing:.12em;text-transform:uppercase;font-size:11px}' +
      'h1{font-family:Fraunces,serif;color:#3E0F1B;margin:2px 0 0;font-size:25px}header em{font-style:normal;background:#5C1A28;color:#FBEFE3;border-radius:999px;padding:6px 12px;font-size:12px;white-space:nowrap}' +
      '.who{display:grid;grid-template-columns:2fr 1fr 1fr;gap:14px;margin:14px 0 8px;font-size:12px;color:#6a5057}.who span{border-bottom:1px solid #c9b3b8;padding-bottom:16px}' +
      '.intro{background:#FBEFE3;border-inline-start:5px solid #5C1A28;border-radius:10px;padding:10px 14px;margin:12px 0;font-family:Cairo,sans-serif}' +
      'section{margin:18px 0;break-inside:avoid}h3{display:flex;align-items:center;gap:10px;color:#3E0F1B;font-family:Fraunces,serif;margin:0 0 4px;font-size:18px}' +
      'h3 span{width:28px;height:28px;border-radius:50%;background:#5C1A28;color:#fff;display:grid;place-items:center;font:600 14px Inter,sans-serif}' +
      '.ins{margin:0 0 8px;color:#6a5057;font-family:Cairo,sans-serif;font-size:13px}ol{margin:0;padding-inline-start:22px}li{margin:0 0 10px;break-inside:avoid}li p{margin:0}' +
      '.ar{font-family:Cairo,sans-serif;text-align:right}.opts{display:flex;flex-wrap:wrap;gap:6px 22px;margin-top:4px}.opts b{color:#5C1A28}' +
      '.lines i{display:block;border-bottom:1px dashed #b89aa1;height:26px}' +
      'footer{display:flex;align-items:center;gap:10px;border-top:2px solid #5C1A28;margin-top:22px;padding-top:8px;font-size:11px;color:#5C1A28}footer img{width:30px;height:24px;object-fit:contain}' +
      '.answers{break-before:page;margin-top:30px}.answers h2{font-family:Fraunces,serif;color:#3E0F1B}.key{margin:10px 0}.key b{color:#5C1A28}' +
      '.bar{position:sticky;top:0;background:#3E0F1B;color:#fff;padding:10px 16px;display:flex;gap:10px;align-items:center;justify-content:center;font:600 14px Inter,sans-serif;z-index:5}' +
      '.bar button{border:0;border-radius:10px;padding:8px 16px;font:700 14px Inter,sans-serif;background:#FBEFE3;color:#3E0F1B;cursor:pointer}' +
      '@media print{.bar{display:none}.page{padding:0}}' +
      '</style></head><body>' +
      '<div class="bar">Code Cademy · ' + e(ws.title) + ' <button onclick="print()">🖨️ Print / Save as PDF · اطبع</button></div>' +
      '<div class="page"><header><img src="' + logo + '" alt="Code Cademy"><div><small>Code Cademy · English Worksheet</small><h1>' + e(ws.title) + '</h1></div><em>' + e(meta.level) + '</em></header>' +
      '<div class="who"><span>Name / الاسم:</span><span>Class / الفصل:</span><span>Date / التاريخ:</span></div>' +
      (ws.intro_ar ? '<div class="intro" dir="rtl">💡 ' + e(ws.intro_ar) + '</div>' : '') + sections + foot +
      '<div class="answers"><h2>Answer key · الإجابات</h2>' + key + foot + '</div></div></body></html>';
  }
  async function cocoMakeWorksheet(topic, level, btn){
    topic = String(topic || '').trim();
    if(!topic) return;
    const si = COCO_TOPICS.findIndex(function(l){ return l.indexOf(topic) !== -1; });
    level = LEVEL_INFO[level] ? level : si !== -1 ? 'Level ' + GROUP_LEVEL[si] : cocoLevelKey();
    const win = window.open('', '_blank'); // opened now, while the click still counts, so pop-up blockers allow it
    if(win) win.document.write('<p style="font:16px sans-serif;padding:30px;color:#5C1A28">⏳ Code Cademy — preparing your worksheet… جاري تجهيز ورقة التمارين…</p>');
    if(btn) btn.disabled = true;
    cocoMood('thinking'); cocoState('busy', true);
    const res = await cocoWorksheetData(topic, level);
    cocoState('busy', false);
    if(btn) btn.disabled = false;
    if(res.err){
      if(win) win.close();
      cocoMood('encouraging');
      cocoBubble('bot err', '<p>' + esc(res.err === 'notopic'
        ? t('I can make worksheets for the 36 written lessons — pick one from the list. (Any topic works once the AI is switched on.)', 'أقدر أعمل أوراق تمارين لدروس القائمة الـ٣٦ — اختار واحد منها. (وأي موضوع هيشتغل لما الذكاء الاصطناعي يتفعّل.)')
        : cocoErrText(res.err)) + '</p>');
      return;
    }
    const html = cocoWorksheetHtml(res.data, { level: levelNameEn(level) });
    if(win){ win.document.open(); win.document.write(html); win.document.close(); }
    else { const u = URL.createObjectURL(new Blob([html], { type: 'text/html' })); location.assign(u); }
    cocoMood('proud');
    cocoBubble('bot', '<p>🖨️ ' + esc(t('Your worksheet “' + res.data.title + '” is open in a new tab — print it or save it as PDF. The answer key is on the last page.',
      'ورقة التمارين «' + res.data.title + '» اتفتحت في تبويب جديد — اطبعها أو احفظها PDF. الإجابات في آخر صفحة.')) + (res.ai ? ' ✨' : '') + '</p>');
    if(res.left != null) cocoShowLeft(res.left);
  }
  function cocoSheetForm(pre){
    const el = cocoBubble('bot', '<form class="cform" data-coco-sheet><b>🖨️ ' + esc(t('Worksheet', 'ورقة تمارين')) + '</b>' +
      '<p><small>' + esc(t('Printable exercises with the Code Cademy logo and an answer key.', 'تمارين للطباعة بلوجو Code Cademy ومعاها الإجابات.')) + '</small></p>' +
      '<label>' + t('Lesson', 'الدرس') + '<select name="topic">' + cocoTopicOptions(pre && pre.topic) + '</select></label>' +
      '<label>' + t('…or any topic (needs the AI)', '…أو أي موضوع (محتاج الذكاء الاصطناعي)') + '<input name="custom" maxlength="140" dir="auto" placeholder="' + esc(t('e.g. Animals vocabulary', 'مثلاً: كلمات الحيوانات')) + '"></label>' +
      '<label>' + t('Level', 'المستوى') + '<select name="level">' + levelOptionsHtml() + '</select></label>' +
      '<div class="cmsg-cta"><button type="submit" class="cbtn">🖨️ ' + t('Make it', 'اعملها') + '</button><button type="button" class="cbtn ghost" data-coco-cancel>' + t('Cancel', 'إلغاء') + '</button></div></form>');
    const f = el.querySelector('form');
    f.level.value = 'Level ' + GROUP_LEVEL[Math.max(0, COCO_TOPICS.findIndex(function(l){ return l.indexOf(f.topic.value) !== -1; }))];
    f.topic.addEventListener('change', function(){ const si = COCO_TOPICS.findIndex(function(l){ return l.indexOf(f.topic.value) !== -1; }); if(si !== -1) f.level.value = 'Level ' + GROUP_LEVEL[si]; });
    el.scrollIntoView({ block: 'nearest' });
  }

  // ---- lesson search: matching lessons and books show up while typing ----
  function cocoSearchResults(q){
    const norm = function(x){ return String(x || '').toLowerCase().replace(/[^\p{L}\p{N} ]/gu, ' ').replace(/\s+/g, ' ').trim(); };
    const words = norm(q).split(' ').filter(Boolean);
    if(!words.length) return null;
    const hit = function(hay){ return words.every(function(w){ return hay.indexOf(w) !== -1; }); };
    const lessons = [];
    COCO_TOPICS.forEach(function(list, si){
      list.forEach(function(tp){
        const hay = norm(tp + ' ' + (COCO_TOPIC_WORDS[tp] || []).join(' ') + ' ' + LESSON_GROUP.map(function(x, i){ return x === si ? 'level ' + (i + 1) + ' المستوى ' + (i + 1) : ''; }).join(' '));
        if(hit(hay)) lessons.push({ topic: tp, si: si });
      });
    });
    const books = (cocoBooks || []).filter(function(m){ return hit(norm(m.title)); });
    return { lessons: lessons, books: books };
  }
  function cocoRenderSearch(box, q){
    const list = box.parentNode.querySelector('[data-topic-list]');
    const r = cocoSearchResults(q);
    if(!r){ list.innerHTML = list.dataset.home; return; }
    list.innerHTML = r.lessons.map(function(x){
      return '<button type="button" data-coco-topic="' + esc(x.topic) + '"><bdi>' + esc(x.topic) + '</bdi> <small>· ' + esc(groupLabel(x.si)) + '</small></button>';
    }).join('') + r.books.map(function(m){
      return '<button type="button" data-coco-book="' + m.id + '">📚 <bdi>' + esc(m.title) + '</bdi></button>';
    }).join('') + (r.lessons.length || r.books.length ? '' : '<p class="cnone">' + esc(cocoAiOff || !currentProfile
      ? t('No lesson with that name 🤔 Try another word.', 'مفيش درس بالاسم ده 🤔 جرّب كلمة تانية.')
      : t('No ready lesson with that name — press Enter and I’ll explain it for you ✨', 'مفيش درس جاهز بالاسم ده — اضغط Enter وأنا أشرحهولك ✨')) + '</p>');
  }

  // ---- modes ----
  function cocoSetMode(m){
    cocoMode = m;
    if(cocoRec) cocoRec.stop();
    coco.querySelectorAll('[data-coco-mode]').forEach(function(b){ if(b.closest('.coco-tabs')) b.classList.toggle('on', b.dataset.cocoMode === m); });
    coco.classList.toggle('say-mode', m === 'say');
    coco.classList.remove('lesson-active');
    cocoLesson = null;
    cocoSayCustom = null;
    cocoDlg = null; cocoBook = null;
    cocoLog.innerHTML = '';
    cocoTurns = []; cocoScene = null;
    cocoMood('happy');
    if(m === 'say'){ cocoRenderSay(); return; }
    cocoInput.dir = m === 'assist' ? 'auto' : 'ltr';
    if(m === 'learn'){ cocoInput.placeholder = t('Type a topic… e.g. past simple', 'اكتب موضوع… مثلاً past simple'); cocoLessonHome(); return; }
    if(!currentProfile && m === 'assist'){ cocoSignin(); return; }
    if(m === 'assist'){
      cocoInput.placeholder = isTeacher() ? t('Give Coco an order…', 'ادّي كوكو أمر…') : t('Ask Coco anything…', 'اسأل كوكو في أي حاجة…');
      cocoAssistHello();
      return;
    }
    cocoInput.placeholder = t('Write or speak in English…', 'اكتب أو اتكلم بالإنجليزي…');
    if(m === 'play'){
      cocoBubble('bot', '<p>' + esc(t('Pick a scene and we’ll act it out together!', 'اختار موقف ونمثّله سوا!')) + '</p><div class="cscenes">' +
        COCO_SCENES.map(function(s){ return '<button type="button" data-coco-scene="' + s.id + '"><span>' + s.icon + '</span>' + esc(t(s.en, s.ar)) + '</button>'; }).join('') + '</div>');
      return;
    }
    cocoTalkHome();
  }
  // Talk: a free chat with the AI, or ready-made chats when it isn't switched on
  async function cocoTalkHome(){
    const wait = cocoBubble('bot typing', '<span></span><span></span><span></span>');
    const [ai] = await Promise.all([cocoAiReady(), cocoLoadDialogs()]);
    wait.remove();
    if(cocoMode !== 'talk' || cocoLog.querySelector('.cmsg:not(.typing)')) return;
    if(!ai){ cocoChatPicker(); return; }
    const first = (currentProfile.full_name || '').split(' ')[0];
    const hello = 'Hi' + (first ? ' ' + first : '') + "! I'm Coco, your English teacher. Let's chat! What did you do today?";
    cocoBubble('bot', cocoReplyHtml({ reply: hello, reply_ar: 'أهلاً! أنا كوكو، مدرّس الإنجليزي بتاعك. يلا نتكلم! عملت إيه النهارده؟' }));
    cocoTurns.push({ role: 'assistant', text: hello });
    cocoSay(hello);
  }
  function cocoRenderSay(){
    const list = cocoSayCustom || COCO_SAY[cocoStage()] || COCO_SAY[0];
    const s = list[cocoSayIdx % list.length];
    cocoLog.innerHTML = '';
    cocoBubble('bot say', '<small>' + esc(t('Read this aloud:', 'اقرأ الجملة دي بصوت عالي:')) + '</small><p class="ctarget" dir="ltr">' +
      s.split(' ').map(function(w){ return '<span>' + esc(w) + '</span>'; }).join(' ') + '</p>' +
      '<div class="cmsg-cta"><button type="button" class="cbtn ghost" data-coco-play="' + esc(s) + '" data-force="1">🔊 ' + t('Hear it', 'اسمعها') + '</button>' +
      '<button type="button" class="cbtn coco-rec big" data-coco-sayrec>🎤 ' + t('Now you', 'دورك') + '</button>' +
      '<button type="button" class="cbtn ghost" data-coco-next>' + t('Next', 'التالي') + ' →</button></div><div class="cscore" id="cocoScore"></div>');
    if(!SpeechRec) document.getElementById('cocoScore').innerHTML = '<small>' + esc(t('Your browser can’t hear you — try Chrome, Edge or Safari.', 'المتصفح لا يدعم سماعك — جرّب Chrome أو Edge أو Safari.')) + '</small>';
  }
  function cocoScoreSay(heard){
    const target = coco.querySelector('.ctarget');
    if(!target) return;
    const norm = function(w){ return w.toLowerCase().replace(/[^a-z']/g, ''); };
    const said = heard.split(/\s+/).map(norm).filter(Boolean);
    const spans = Array.from(target.querySelectorAll('span'));
    let ok = 0;
    spans.forEach(function(sp){
      const w = norm(sp.textContent), hit = said.indexOf(w) !== -1;
      sp.className = hit ? 'ok' : 'miss';
      if(hit) ok++;
    });
    const pct = Math.round(ok * 100 / spans.length);
    const stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0;
    cocoMood(stars >= 2 ? 'proud' : 'encouraging');
    document.getElementById('cocoScore').innerHTML = '<b>' + '★'.repeat(stars) + '☆'.repeat(3 - stars) + ' ' + pct + '%</b><small>' + esc(t('I heard: “', 'سمعت: «') + heard + t('”', '»')) + '</small>' +
      '<em>' + esc(stars === 3 ? t('Perfect! You sound great.', 'ممتاز! نطقك رائع.') : stars ? t('Good! Try the red words again.', 'جيد! جرّب الكلمات الحمراء مرة أخرى.') : t('Let’s try again — listen first, then speak slowly.', 'يلا نحاول تاني — اسمع الأول، وبعدين اتكلم ببطء.')) + '</em>';
    if(stars) cocoStars(stars);
    cocoSay(stars === 3 ? 'Perfect!' : stars ? 'Good job! Try again.' : "Let's try again.");
  }

  // ---- open / close ----
  // teachers and parents start with the assistant; students and visitors with a lesson
  function cocoHomeMode(){ return currentProfile && (isTeacher() || isParent()) ? 'assist' : 'learn'; }
  function cocoOpen(){
    coco.hidden = false;
    cocoBtn.classList.add('hide');
    document.getElementById('cocoStars').textContent = '⭐ ' + cocoStore('stars', 0);
    document.getElementById('cocoLevel').textContent = cocoLevel().replace(/ \(.*\)/, '');
    document.getElementById('cocoLeft').textContent = '';
    cocoJarCount();
    coco.querySelector('.coco-tabs [data-coco-mode="assist"]').hidden = !currentProfile;
    if(!cocoLog.children.length) cocoSetMode(cocoHomeMode());
    setTimeout(function(){ if(cocoMode !== 'say') cocoInput.focus(); }, 50);
  }
  function cocoClose(){
    coco.hidden = true;
    cocoBtn.classList.remove('hide');
    if(window.speechSynthesis) speechSynthesis.cancel();
    if(cocoRec) cocoRec.stop();
  }
  cocoBtn.addEventListener('click', cocoOpen);
  document.getElementById('cocoClose').addEventListener('click', cocoClose);
  document.getElementById('cocoSound').addEventListener('click', function(){
    cocoSpeak = !cocoSpeak;
    this.textContent = cocoSpeak ? '🔊' : '🔇';
    if(!cocoSpeak && window.speechSynthesis) speechSynthesis.cancel();
  });
  function cocoSubmit(text){
    if(cocoMode === 'learn') cocoStartLesson(text);
    else if(cocoMode === 'assist') cocoAssistSend(text);
    else if(cocoDlg) cocoDlgSubmit(text);
    else if(cocoTurns.length) cocoSend(text);
    else { cocoInput.value = ''; cocoMood('curious'); }
  }
  document.getElementById('cocoForm').addEventListener('submit', function(e){ e.preventDefault(); cocoSubmit(cocoInput.value); });
  cocoInput.addEventListener('keydown', function(e){ if(e.key === 'Enter' && !e.shiftKey){ e.preventDefault(); cocoSubmit(cocoInput.value); } });
  cocoMic.addEventListener('click', function(){ cocoListen(cocoSubmit); });
  if(!SpeechRec) cocoMic.hidden = true;
  document.getElementById('cocoJar').addEventListener('click', function(){
    const jar = cocoStore('jar', []);
    cocoBubble('bot', '<p><b>🫙 ' + esc(t('My word jar', 'برطمان كلماتي')) + '</b> (' + jar.length + ')</p>' + (jar.length
      ? '<div class="cwords">' + jar.slice(-30).reverse().map(function(w){ return '<button type="button" data-coco-play="' + esc(w.word) + '" data-force="1">🔊 ' + esc(w.word) + ' <small>' + esc(w.ar || '') + '</small></button>'; }).join('') + '</div>'
      : '<p>' + esc(t('Tap ＋ on a new word Coco teaches you to keep it here.', 'اضغط ＋ على أي كلمة جديدة يعلّمهالك كوكو عشان تتحفظ هنا.')) + '</p>'));
  });
  coco.addEventListener('click', function(e){
    const b = e.target.closest('button');
    if(!b) return;
    if(b.dataset.cocoMode){ cocoSetMode(b.dataset.cocoMode); }
    else if(b.hasAttribute('data-coco-play')){ cocoSay(b.dataset.cocoPlay, true); }
    else if(b.hasAttribute('data-coco-ar')){ const p = b.closest('.cmsg').querySelector('.cmsg-ar'); if(p) p.hidden = !p.hidden; }
    else if(b.dataset.cocoWord){
      const jar = cocoStore('jar', []);
      if(!jar.some(function(w){ return w.word.toLowerCase() === b.dataset.cocoWord.toLowerCase(); })){ jar.push({ word: b.dataset.cocoWord, ar: b.dataset.ar }); cocoSave('jar', jar); }
      b.classList.add('saved'); b.disabled = true; cocoJarCount();
    }
    else if(b.dataset.cocoDlg){ cocoStartDialog(b.dataset.cocoDlg); }
    else if(b.hasAttribute('data-coco-dopt')){ if(cocoDlg) cocoDlgAnswer(parseInt(b.dataset.cocoDopt, 10)); }
    else if(b.dataset.cocoScene){
      const id = b.dataset.cocoScene;
      b.disabled = true;
      Promise.all([cocoAiReady(), cocoLoadDialogs()]).then(function(r){ b.disabled = false; if(r[0]) cocoStartScene(id); else cocoStartDialog(id); });
    }
  });
  function cocoStartScene(id){
    const s = COCO_SCENES.find(function(x){ return x.id === id; });
    cocoScene = s.id; cocoTurns = [];
    cocoLog.innerHTML = '';
    cocoBubble('scene', '<span>' + s.icon + '</span>' + esc(t(s.en, s.ar)));
    cocoBubble('bot', cocoReplyHtml({ reply: s.open }));
    cocoTurns.push({ role: 'assistant', text: s.open });
    cocoMood('curious');
    cocoSay(s.open);
  }
  coco.addEventListener('click', function(e){
    const b = e.target.closest('button');
    if(!b) return;
    if(b.hasAttribute('data-coco-sayrec')){ cocoListen(cocoScoreSay); }
    else if(b.hasAttribute('data-coco-next')){ cocoSayIdx++; cocoRenderSay(); cocoMood('happy'); }
    else if(b.hasAttribute('data-coco-login')){ cocoClose(); openAuth('login'); }
    else if(b.dataset.cocoTopic){ cocoStartLesson(b.dataset.cocoTopic); }
    else if(b.dataset.cocoCmd){ cocoForm(b.dataset.cocoCmd); }
    else if(b.dataset.cocoBook){ cocoOpenBook(b.dataset.cocoBook); }
    else if(b.dataset.cocoSheet){ cocoMakeWorksheet(b.dataset.cocoSheet, b.dataset.level || null, b); }
    else if(b.dataset.cocoBk){ cocoBookAction(b.dataset.cocoBk); }
    else if(b.hasAttribute('data-coco-bkall')){ cocoReadAll(cocoBook && cocoBook.pages ? cocoBook.pages[cocoBook.p] : []); }
    else if(b.hasAttribute('data-coco-bksay')){ const list = cocoBook.pages[cocoBook.p].slice(0, 20); cocoSetMode('say'); cocoSayCustom = list; cocoSayIdx = 0; cocoRenderSay(); }
    else if(b.hasAttribute('data-coco-bknext')){
      b.disabled = true;
      do { cocoBook.p++; } while(cocoBook.p < cocoBook.pages.length - 1 && !cocoBook.pages[cocoBook.p].length);
      cocoBookPage();
    }
    else if(b.hasAttribute('data-coco-cancel')){ b.closest('.cmsg').remove(); }
    else if(b.dataset.cocoDeltask){
      if(!confirm(t('Delete this task and its results?', 'حذف المهمة ونتائجها؟'))) return;
      b.disabled = true;
      sb.from('coco_tasks').delete().eq('id', b.dataset.cocoDeltask).then(function(r){ if(r.error){ b.disabled = false; toast(friendlyErrorMessage(r.error), '', true); } else b.closest('.cres').remove(); });
    }
    else if(b.hasAttribute('data-coco-qopt')){ cocoQuizAnswer(b); }
    else if(b.dataset.cocoTask){ cocoStartTask(b.dataset.cocoTask); }
    else if(b.dataset.cocoAsk){ cocoAssistSend(b.dataset.cocoAsk); }
    else if(b.hasAttribute('data-coco-opt')){ cocoAnswer(b); }
    else if(b.hasAttribute('data-coco-nextstep')){ b.disabled = true; cocoLessonStep(); }
    else if(b.hasAttribute('data-coco-retry')){ b.closest('.cmsg').remove(); cocoLessonStep(); }
    else if(b.hasAttribute('data-coco-finish')){ b.disabled = true; cocoFinishLesson(); }
    else if(b.hasAttribute('data-coco-sayex')){
      const list = cocoLesson && cocoLesson.examples.length ? cocoLesson.examples.slice() : null;
      cocoSetMode('say');
      if(list){ cocoSayCustom = list; cocoSayIdx = 0; cocoRenderSay(); }
    }
    else if(b.hasAttribute('data-coco-practise')){
      const topic = cocoLesson ? cocoLesson.topic : '';
      cocoSetMode('talk');
      cocoLog.innerHTML = ''; cocoTurns = [];
      const hello = "Let's practise " + topic.replace(/:.*$/, '') + "! Tell me something about your week and try to use it.";
      cocoBubble('bot', cocoReplyHtml({ reply: hello }));
      cocoTurns.push({ role: 'assistant', text: hello });
      cocoSay(hello);
    }
  });
  cocoLog.addEventListener('input', function(e){ if(e.target.matches('[data-coco-search]')) cocoRenderSearch(e.target, e.target.value); });
  cocoLog.addEventListener('keydown', function(e){
    if(e.key !== 'Enter' || !e.target.matches('[data-coco-search]')) return;
    e.preventDefault();
    const first = e.target.parentNode.querySelector('[data-topic-list] button');
    if(first && e.target.value.trim()) first.click(); else if(e.target.value.trim()) cocoStartLesson(e.target.value);
  });
  cocoLog.addEventListener('submit', function(e){
    const f = e.target.closest('[data-coco-form]'), g = e.target.closest('[data-coco-guide]'), w = e.target.closest('[data-coco-sheet]');
    if(w){ e.preventDefault(); cocoMakeWorksheet(w.custom.value.trim() || w.topic.value, w.level.value, w.querySelector('[type=submit]')); }
    if(f){ e.preventDefault(); cocoRun(f); }
    if(g){ e.preventDefault(); cocoSaveGuide(g); }
  });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && !coco.hidden) cocoClose(); });
  // a new person signs in or out: start Coco fresh
  window.__cocoGuide = function(id){ cocoOpen(); cocoSetMode('assist'); cocoGuideForm(id); };
  window.__cocoReset = function(){
    cocoLog.innerHTML = ''; cocoTurns = []; cocoLesson = null; cocoStudents = null;
    coco.querySelector('.coco-tabs [data-coco-mode="assist"]').hidden = !currentProfile;
    if(!coco.hidden) cocoSetMode(cocoHomeMode());
  };

  // re-render text built in JavaScript when the visitor switches language
  window.__refreshDynamicText = function(){
    loadPlanSettings(); // prices and savings on the price cards
    renderPublicSessions();
    fillLevelPickers();
    if(typeof updateLevelTabsUI === 'function') updateLevelTabsUI();
    if(!currentProfile) return;
    renderMaterials();
    showPickedFile();
    loadReadingHub();
    if(isParent()) loadChildren();
    renderInbox();
    if(isStudent()){ renderNextStep(); loadMaterials(); }
  };

  sb.auth.onAuthStateChange(function(event){
    if(event === 'PASSWORD_RECOVERY'){ // arrived from the "reset password" email
      recoveryMode = true;
      dashboardPage.hidden = true;
      openAuth('reset');
      return;
    }
    refreshSession();
  });
  if(/type=recovery/.test(location.hash)){ recoveryMode = true; openAuth('reset'); }
  refreshSession();
})();
const counters = document.querySelectorAll('.count');
const counterObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const el = entry.target;
      const target = parseInt(el.dataset.target,10);
      const suffix = el.dataset.suffix || '';
      const duration = 1100;
      const start = performance.now();
      function tick(now){
        const p = Math.min((now-start)/duration,1);
        el.textContent = Math.floor(p*target) + suffix;
        if(p<1) requestAnimationFrame(tick);
        else el.textContent = target + suffix;
      }
      requestAnimationFrame(tick);
      counterObserver.unobserve(el);
    }
  });
},{threshold:0.5});
counters.forEach(c=>counterObserver.observe(c));

// reading-progress bar
(function(){
  const bar = document.getElementById('scrollProgress');
  if(!bar) return;
  function upd(){
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 0) + '%';
  }
  window.addEventListener('scroll', upd, {passive:true});
  upd();
})();

// reveal on scroll — headers reveal once; grouped items (clubs, journey steps, video list) stagger by data-i
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      const i = parseInt(entry.target.dataset.i || '0',10);
      entry.target.style.transitionDelay = (i*90) + 'ms';
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:0.2});
revealEls.forEach(el=>revealObserver.observe(el));

// keep the site's files on the device so the next visit opens fast (see sw.js)
if('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')){
  window.addEventListener('load', function(){ navigator.serviceWorker.register('sw.js').catch(function(){}); });
}

// looping animations only run while their part of the page is on screen
if('IntersectionObserver' in window){
  const restIo = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ en.target.classList.toggle('offscreen', !en.isIntersecting); });
  }, { rootMargin: '200px 0px' });
  document.querySelectorAll('body > section:not(.coco), body > footer').forEach(function(s){ restIo.observe(s); });
}
