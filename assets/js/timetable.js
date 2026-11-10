// Weekly class timetable, shared by the English dashboard and the French / Tech dashboards.
//   ccTimetable.render(el, events)   events: [{ id, start, mins, title, sub, url, color }]
// A week from Saturday to Friday, in the visitor's own time zone. Each class has a Join button
// (open 10 minutes before until the end) and an "add to calendar" (.ics) button.
(function(){
  'use strict';
  const T = function(en, ar){ return document.documentElement.lang === 'ar' ? ar : en; };
  const esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  const DAY = 86400000;
  const state = new WeakMap(); // el -> { week: Date (Saturday 00:00), events }

  function css(){
    if(document.getElementById('ccTtCss')) return;
    const s = document.createElement('style'); s.id = 'ccTtCss';
    s.textContent =
      '.tt{--tt-line:rgba(0,0,0,.1);--tt-mut:#7a7385;margin:6px 0 22px}' +
      '.tt-head{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;margin-bottom:12px}' +
      '.tt-nav{display:flex;gap:6px;align-items:center}' +
      '.tt-nav b{font-size:1rem;min-width:170px;text-align:center}' +
      '.tt-btn{border:1px solid var(--tt-line);background:#fff;color:#2a2233;border-radius:10px;padding:7px 12px;font:inherit;font-weight:700;font-size:.85rem;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:6px}' +
      '.tt-btn:hover{border-color:#999}' +
      '.tt-btn.go{background:#2f9e6a;border-color:#2f9e6a;color:#fff}' +
      '.tt-btn.go.off{background:#e9e6ef;border-color:#e9e6ef;color:#8a8496;cursor:default}' +
      '.tt-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:8px}' +
      '.tt-day{background:#faf9fc;border:1px solid var(--tt-line);border-radius:14px;padding:8px;min-height:120px}' +
      '.tt-day.today{border-color:#7c5cff;box-shadow:0 0 0 2px rgba(124,92,255,.15)}' +
      '.tt-day.past{opacity:.6}' +
      '.tt-day h6{margin:0 0 8px;font-size:.8rem;color:var(--tt-mut);display:flex;justify-content:space-between;gap:4px}' +
      '.tt-day h6 b{color:#2a2233;font-size:.95rem}' +
      '.tt-ev{background:#fff;border:1px solid var(--tt-line);border-inline-start:4px solid var(--c,#7c5cff);border-radius:10px;padding:7px 8px;margin-bottom:6px;font-size:.8rem;color:#2a2233}' +
      '.tt-ev.done{opacity:.55}' +
      '.tt-ev.live{box-shadow:0 0 0 2px #2f9e6a}' +
      '.tt-ev time{display:block;font-weight:800;font-size:.78rem;direction:ltr;text-align:start}' +
      '.tt-ev strong{display:block;margin:2px 0;line-height:1.3;word-wrap:break-word}' +
      '.tt-ev small{display:block;color:var(--tt-mut)}' +
      '.tt-ev .tt-acts{display:flex;gap:4px;margin-top:6px;flex-wrap:wrap}' +
      '.tt-ev .tt-btn{padding:4px 8px;font-size:.74rem}' +
      '.tt-none{color:var(--tt-mut);font-size:.78rem;text-align:center;margin-top:18px}' +
      '.tt-empty{text-align:center;color:var(--tt-mut);padding:14px;border:1px dashed var(--tt-line);border-radius:12px;margin-top:10px}' +
      '@media(max-width:900px){.tt-grid{grid-template-columns:1fr}.tt-day{min-height:0}.tt-day.none{display:none}.tt-grid.all-none .tt-day.today{display:block}}';
    document.head.appendChild(s);
  }

  function saturday(d){ const x = new Date(d); x.setHours(0, 0, 0, 0); x.setDate(x.getDate() - ((x.getDay() + 1) % 7)); return x; }
  function sameDay(a, b){ return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(); }
  function loc(){ return document.documentElement.lang === 'ar' ? 'ar-EG' : 'en-GB'; }
  function hm(d){ return d.toLocaleTimeString(loc(), { hour: 'numeric', minute: '2-digit' }); }

  // calendar file (.ics) for one class or many
  function icsDate(d){ return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, ''); }
  function icsText(s){ return String(s || '').replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/([,;])/g, '\\$1'); }
  function ics(list){
    const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Code Cademy//Timetable//EN', 'CALSCALE:GREGORIAN'];
    list.forEach(function(e){
      const s = new Date(e.start), en = new Date(s.getTime() + (e.mins || 45) * 60000);
      lines.push('BEGIN:VEVENT', 'UID:' + icsText(e.id) + '@ccdemy.com', 'DTSTAMP:' + icsDate(new Date()), 'DTSTART:' + icsDate(s), 'DTEND:' + icsDate(en),
        'SUMMARY:' + icsText(e.title), 'DESCRIPTION:' + icsText((e.sub || '') + (e.url ? '\n' + e.url : '') + '\nCode Cademy'),
        'BEGIN:VALARM', 'TRIGGER:-PT15M', 'ACTION:DISPLAY', 'DESCRIPTION:' + icsText(e.title), 'END:VALARM', 'END:VEVENT');
    });
    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }
  function download(name, text){
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'text/calendar;charset=utf-8' }));
    a.download = name; document.body.appendChild(a); a.click();
    setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  function draw(el){
    const st = state.get(el); if(!st) return;
    const now = Date.now(), today = new Date();
    const days = []; for(let i = 0; i < 7; i++) days.push(new Date(st.week.getTime() + i * DAY + 2 * 3600000)); // +2h survives a DST change
    days.forEach(function(d){ d.setHours(0, 0, 0, 0); });
    const end = new Date(days[6].getTime() + DAY);
    const inWeek = st.events.filter(function(e){ const t = new Date(e.start); return t >= days[0] && t < end; })
      .sort(function(a, b){ return new Date(a.start) - new Date(b.start); });
    const range = days[0].toLocaleDateString(loc(), { day: 'numeric', month: 'short' }) + ' – ' + days[6].toLocaleDateString(loc(), { day: 'numeric', month: 'short', year: 'numeric' });
    const upcoming = st.events.filter(function(e){ return new Date(e.start).getTime() + (e.mins || 45) * 60000 > now; });
    let html = '<div class="tt-head"><div class="tt-nav">' +
      '<button type="button" class="tt-btn" data-tt="prev" aria-label="' + T('Previous week', 'الأسبوع السابق') + '">' + (document.documentElement.dir === 'rtl' ? '→' : '←') + '</button>' +
      '<b>' + esc(range) + '</b>' +
      '<button type="button" class="tt-btn" data-tt="next" aria-label="' + T('Next week', 'الأسبوع التالي') + '">' + (document.documentElement.dir === 'rtl' ? '←' : '→') + '</button>' +
      '<button type="button" class="tt-btn" data-tt="today">' + T('This week', 'هذا الأسبوع') + '</button></div>' +
      (upcoming.length ? '<button type="button" class="tt-btn" data-tt="all">📅 ' + T('Add all to my calendar', 'أضف كل الحصص لتقويمي') + '</button>' : '') + '</div>';
    let none = 0;
    html += '<div class="tt-grid">' + days.map(function(d){
      const evs = inWeek.filter(function(e){ return sameDay(new Date(e.start), d); });
      if(!evs.length) none++;
      const isToday = sameDay(d, today), past = d.getTime() + DAY < now;
      return '<div class="tt-day' + (isToday ? ' today' : '') + (past ? ' past' : '') + (evs.length ? '' : ' none') + '"><h6><b>' + esc(d.toLocaleDateString(loc(), { weekday: 'long' })) + '</b><span>' + esc(d.toLocaleDateString(loc(), { day: 'numeric', month: 'short' })) + '</span></h6>' +
        (evs.length ? evs.map(function(e){
          const s = new Date(e.start), fin = new Date(s.getTime() + (e.mins || 45) * 60000);
          const live = now >= s.getTime() - 10 * 60000 && now < fin.getTime(), done = now >= fin.getTime();
          return '<div class="tt-ev' + (live ? ' live' : '') + (done ? ' done' : '') + '" style="--c:' + esc(e.color || '#7c5cff') + '">' +
            '<time>' + esc(hm(s)) + ' – ' + esc(hm(fin)) + '</time><strong>' + esc(e.title) + '</strong>' + (e.sub ? '<small>' + esc(e.sub) + '</small>' : '') +
            (done ? '' : '<div class="tt-acts">' +
              (e.url ? (live ? '<a class="tt-btn go" href="' + esc(e.url) + '" target="_blank" rel="noopener">▶ ' + T('Join', 'ادخل') + '</a>' : '<span class="tt-btn go off" title="' + T('Opens 10 minutes before', 'يُفتح قبل الحصة بـ 10 دقائق') + '">▶ ' + T('Join', 'ادخل') + '</span>') : '') +
              '<button type="button" class="tt-btn" data-tt="ics" data-id="' + esc(e.id) + '" title="' + T('Add to calendar', 'أضف للتقويم') + '">📅</button></div>') +
            '</div>';
        }).join('') : '<p class="tt-none">' + T('No classes', 'لا توجد حصص') + '</p>') + '</div>';
    }).join('') + '</div>';
    if(none === 7) html += '<div class="tt-empty">' + T('No classes this week.', 'لا توجد حصص في هذا الأسبوع.') + (upcoming.length ? ' ' + T('Use the arrows to see other weeks.', 'استخدم الأسهم لرؤية الأسابيع الأخرى.') : '') + '</div>';
    el.innerHTML = html;
    el.querySelector('.tt-grid').classList.toggle('all-none', none === 7);
  }

  function render(el, events){
    if(!el) return;
    css();
    el.classList.add('tt');
    let st = state.get(el);
    if(!st){
      st = { week: saturday(new Date()), events: [] };
      state.set(el, st);
      el.addEventListener('click', function(ev){
        const b = ev.target.closest('[data-tt]'); if(!b) return;
        const k = b.dataset.tt, s = state.get(el);
        if(k === 'prev') s.week = new Date(s.week.getTime() - 7 * DAY + 3 * 3600000);
        if(k === 'next') s.week = new Date(s.week.getTime() + 7 * DAY + 3 * 3600000);
        if(k === 'prev' || k === 'next') s.week = saturday(s.week);
        if(k === 'today') s.week = saturday(new Date());
        if(k === 'ics'){ const e = s.events.find(function(x){ return String(x.id) === b.dataset.id; }); if(e) download('code-cademy-class.ics', ics([e])); return; }
        if(k === 'all'){ const now = Date.now(); download('code-cademy-classes.ics', ics(s.events.filter(function(e){ return new Date(e.start).getTime() + (e.mins || 45) * 60000 > now; }))); return; }
        draw(el);
      });
      // keep the Join buttons current without reloading
      setInterval(function(){ if(document.body.contains(el)) draw(el); }, 60000);
    }
    st.events = (events || []).filter(function(e){ return e && e.start && !isNaN(new Date(e.start)); });
    draw(el);
  }
  window.ccTimetable = { render: render, ics: ics };
})();
