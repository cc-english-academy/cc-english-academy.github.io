// Cinema Club → "Real cinema": real English film scenes and shows on YouTube, with English subtitles.
// The admin chooses the videos in the English dashboard (academy_settings.cinema_youtube, JSON
// [{ t: title, url: YouTube link, level }]). Videos play here in a theatre window (youtube-nocookie).
(function(){
  'use strict';
  const SB_URL = 'https://orpknmkgfwmtroiqljzp.supabase.co';
  const SB_KEY = 'sb_publishable_x7AQ0xQl8qqOH3iDKqxddg_-7fbStUh';
  let lang = 'ar'; try{ lang = localStorage.getItem('cc_ui_lang') || 'ar'; }catch(e){}
  const ar = lang !== 'en';
  const T = function(en, a){ return ar ? a : en; };
  const esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  function ytId(u){
    const m = String(u || '').match(/(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/);
    return m ? m[1] : (/^[A-Za-z0-9_-]{11}$/.test(String(u || '').trim()) ? String(u).trim() : '');
  }
  const SEARCH = [
    ['🎬', 'Movie scenes with English subtitles', 'مشاهد أفلام بترجمة إنجليزية', 'english movie scenes with english subtitles'],
    ['🧒', 'Kids cartoons in English', 'كرتون أطفال بالإنجليزي', 'kids cartoons in english with subtitles'],
    ['🗣️', 'Learn English with movies', 'تعلّم الإنجليزية من الأفلام', 'learn english with movies'],
    ['🎤', 'Short films in easy English', 'أفلام قصيرة بإنجليزية سهلة', 'short animated film english subtitles']
  ];

  const css = document.createElement('style');
  css.textContent =
    '.rc{position:relative;margin:18px auto 6px;max-width:1180px;padding:0 16px}' +
    '.rc-in{position:relative;border-radius:22px;overflow:hidden;padding:26px 24px 22px;color:#fff;box-shadow:0 24px 50px -26px #000;border:1px solid rgba(242,179,61,.35)}' +
    '.rc-bg{position:absolute;inset:-30px;background:#1a0f14 url(assets/img/club-cinema.webp) center 55%/cover;filter:blur(3px) saturate(1.1);transform:scale(1.04)}' +
    '.rc-in::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(26,15,20,.92),rgba(26,15,20,.55))}' +
    '.rc-c{position:relative;z-index:1}' +
    '.rc h2{margin:0 0 4px;font:400 1.6rem "Bungee","Fredoka",system-ui,sans-serif;color:#FFD77A;letter-spacing:.02em}' +
    '.rc p{margin:0 0 14px;color:#f3e3e8;max-width:720px}' +
    '.rc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-top:6px}' +
    '.rc-v{border:0;padding:0;background:#26161D;border-radius:14px;overflow:hidden;cursor:pointer;text-align:start;color:#FBEFF2;box-shadow:0 10px 24px -14px #000;transition:transform .15s}' +
    '.rc-v:hover{transform:translateY(-2px)}' +
    '.rc-v span{display:block;position:relative;aspect-ratio:16/9;background:#000 center/cover}' +
    '.rc-v span::after{content:"▶";position:absolute;inset:0;display:grid;place-items:center;font-size:2rem;color:#fff;text-shadow:0 2px 12px #000}' +
    '.rc-v b{display:block;padding:9px 11px 3px;font:700 .95rem "Fredoka",system-ui,sans-serif}' +
    '.rc-v small{display:block;padding:0 11px 10px;color:#C9AEB6}' +
    '.rc-s{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}' +
    '.rc-s a{display:inline-flex;gap:6px;align-items:center;text-decoration:none;color:#1A0F14;background:#F2B33D;border-radius:999px;padding:8px 14px;font:800 .85rem Nunito,system-ui,sans-serif}' +
    '.rc-s a.yt{background:#ff0033;color:#fff}' +
    '.rc-m{position:fixed;inset:0;z-index:200;background:rgba(10,5,8,.88);display:grid;place-items:center;padding:16px}' +
    '.rc-m[hidden]{display:none}' +
    '.rc-m .box{width:min(1000px,100%)}' +
    '.rc-m .scr{position:relative;aspect-ratio:16/9;border-radius:14px;overflow:hidden;border:4px solid #F2B33D;box-shadow:0 0 60px rgba(242,179,61,.35)}' +
    '.rc-m iframe{position:absolute;inset:0;width:100%;height:100%;border:0}' +
    '.rc-m .row{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-top:10px;color:#fff}' +
    '.rc-m button{border:0;border-radius:999px;padding:9px 16px;font:800 .9rem Nunito,system-ui,sans-serif;cursor:pointer;background:#F2B33D;color:#1A0F14}' +
    '.rc-m a{color:#FFD77A;font-weight:700}';
  document.head.appendChild(css);

  const sec = document.createElement('section'); sec.className = 'rc'; sec.dir = ar ? 'rtl' : 'ltr';
  sec.innerHTML = '<div class="rc-in"><div class="rc-bg"></div><div class="rc-c">' +
    '<h2>🎞️ ' + T('Real cinema', 'السينما الحقيقية') + '</h2>' +
    '<p>' + T('Real English film scenes, shows and short films on YouTube — with English subtitles. Watch, pause, repeat the lines, then act them out!', 'مشاهد حقيقية من أفلام وبرامج وأفلام قصيرة بالإنجليزي على يوتيوب — مع ترجمة إنجليزية. شاهد، وأوقف، وكرّر الجمل، ثم مثّلها!') + '</p>' +
    '<div class="rc-grid" id="rcGrid"></div>' +
    '<div class="rc-s">' + SEARCH.map(function(x){ return '<a class="yt" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(x[3]) + '&sp=EgIoAQ%253D%253D">' + x[0] + ' ' + esc(T(x[1], x[2])) + '</a>'; }).join('') + '</div>' +
    '</div></div>';
  const modal = document.createElement('div'); modal.className = 'rc-m'; modal.hidden = true;
  modal.innerHTML = '<div class="box"><div class="scr" id="rcScr"></div><div class="row"><b id="rcT"></b><span><a id="rcYt" target="_blank" rel="noopener">YouTube ↗</a> &nbsp; <button type="button" id="rcX">' + T('Close', 'إغلاق') + '</button></span></div></div>';
  function close(){ modal.hidden = true; document.getElementById('rcScr').innerHTML = ''; }
  modal.addEventListener('click', function(e){ if(e.target === modal || e.target.id === 'rcX') close(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && !modal.hidden) close(); });

  function play(id, title){
    document.getElementById('rcScr').innerHTML = '<iframe allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin" src="https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1&cc_load_policy=1&cc_lang_pref=en&hl=en&playsinline=1"></iframe>';
    document.getElementById('rcT').textContent = title;
    document.getElementById('rcYt').href = 'https://www.youtube.com/watch?v=' + id;
    modal.hidden = false;
  }
  function render(list){
    const g = document.getElementById('rcGrid');
    const vids = (list || []).map(function(v){ return { id: ytId(v.url), t: v.t || 'Video', level: v.level || '' }; }).filter(function(v){ return v.id; });
    if(!vids.length){ g.outerHTML = '<p style="opacity:.85">⭐ ' + T('Your teacher will add movie scenes here soon. Meanwhile, explore YouTube:', 'سيضيف معلمك مشاهد أفلام هنا قريبًا. وحتى ذلك الحين، استكشف يوتيوب:') + '</p>'; return; }
    g.innerHTML = vids.map(function(v, i){ return '<button type="button" class="rc-v" data-i="' + i + '"><span style="background-image:url(https://i.ytimg.com/vi/' + v.id + '/hqdefault.jpg)"></span><b>' + esc(v.t) + '</b>' + (v.level ? '<small>' + esc(T('Level ', 'المستوى ') + v.level) + '</small>' : '<small>YouTube · CC</small>') + '</button>'; }).join('');
    g.onclick = function(e){ const b = e.target.closest('.rc-v'); if(b){ const v = vids[+b.dataset.i]; play(v.id, v.t); } };
  }
  function mount(){
    const nav = document.querySelector('nav.bar') || document.querySelector('header');
    if(nav && nav.parentNode) nav.parentNode.insertBefore(sec, nav.nextSibling); else document.body.prepend(sec);
    document.body.appendChild(modal);
    // only on the cinema lobby, not while a scene is playing
    const sync = function(){ sec.hidden = /^#scene-/.test(location.hash); };
    window.addEventListener('hashchange', sync); sync();
    if(!window.supabase){ render([]); return; }
    window.supabase.createClient(SB_URL, SB_KEY).from('academy_settings').select('value').eq('key', 'cinema_youtube').maybeSingle()
      .then(function(r){ let list = []; try{ list = JSON.parse((r.data && r.data.value) || '[]'); }catch(e){} render(list); }, function(){ render([]); });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();
  window.ccCinemaYtId = ytId;
})();
