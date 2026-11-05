// Small, dependency-free effects shared by the Tech Lab and French pages:
// confetti bursts, numbers that count up, cards that tilt toward the pointer, and reveal-on-scroll.
// Everything is skipped for visitors who ask their device for less motion.
(function(){
  'use strict';
  const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cv = null, ctx = null, parts = [], raf = 0;
  function frame(){
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts = parts.filter(function(p){ return p.life > 0 && p.y < cv.height + 40; });
    parts.forEach(function(p){
      p.vy += .12 * p.g; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life--;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.globalAlpha = Math.min(1, p.life / 40);
      ctx.fillStyle = p.c;
      if(p.s === 'c'){ ctx.beginPath(); ctx.arc(0, 0, p.w / 2, 0, 7); ctx.fill(); }
      else if(p.e){ ctx.font = (p.w * 2.2) + 'px serif'; ctx.fillText(p.e, -p.w, p.w); }
      else ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if(parts.length) raf = requestAnimationFrame(frame); else { raf = 0; cv.style.display = 'none'; }
  }
  // confetti({ x, y } in 0–1 of the window, n pieces, emoji: optional list of emoji to throw too)
  function confetti(o){
    if(calm) return;
    o = o || {};
    if(!cv){ cv = document.createElement('canvas'); cv.setAttribute('aria-hidden', 'true'); cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999'; document.body.appendChild(cv); ctx = cv.getContext('2d'); }
    cv.width = innerWidth; cv.height = innerHeight; cv.style.display = 'block';
    const cols = o.colors || ['#7c5cff', '#21d4b4', '#ffc64a', '#ff6fa5', '#3fa9ff', '#ffffff'];
    const x0 = (o.x == null ? .5 : o.x) * cv.width, y0 = (o.y == null ? .4 : o.y) * cv.height, n = o.n || 90;
    for(let i = 0; i < n; i++){
      const a = Math.random() * Math.PI * 2, sp = 3 + Math.random() * 7;
      parts.push({ x: x0, y: y0, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 4, g: .7 + Math.random() * .6, r: Math.random() * 6, vr: (Math.random() - .5) * .3,
        w: 6 + Math.random() * 6, h: 4 + Math.random() * 4, c: cols[i % cols.length], s: Math.random() < .3 ? 'c' : 'r', life: 110 + Math.random() * 60,
        e: o.emoji && Math.random() < .25 ? o.emoji[i % o.emoji.length] : null });
    }
    if(!raf) raf = requestAnimationFrame(frame);
  }
  // burst from an element (a button that was just pressed)
  function burstFrom(el, o){ if(!el || !el.getBoundingClientRect) return confetti(o); const r = el.getBoundingClientRect(); confetti(Object.assign({ x: (r.left + r.width / 2) / innerWidth, y: (r.top + r.height / 2) / innerHeight, n: 60 }, o || {})); }
  // numbers count up from 0 (elements with data-count="123")
  function countUp(root){
    (root || document).querySelectorAll('[data-count]').forEach(function(el){
      const to = parseFloat(el.dataset.count); if(isNaN(to)) return;
      const suffix = el.dataset.suffix || '';
      if(calm || to === 0){ el.textContent = to + suffix; return; }
      const t0 = performance.now(), dur = 900;
      (function step(t){ const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e) + suffix; if(k < 1) requestAnimationFrame(step); })(t0);
    });
  }
  // cards lean toward the pointer, with a soft light following it (CSS reads --mx/--my/--rx/--ry)
  function tilt(selector, root){
    if(calm || !matchMedia('(hover: hover)').matches) return;
    (root || document).addEventListener('pointermove', function(e){
      const c = e.target.closest && e.target.closest(selector); if(!c) return;
      const r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      c.style.setProperty('--mx', (px * 100) + '%'); c.style.setProperty('--my', (py * 100) + '%');
      c.style.setProperty('--rx', ((.5 - py) * 6).toFixed(2) + 'deg'); c.style.setProperty('--ry', ((px - .5) * 8).toFixed(2) + 'deg');
    });
    (root || document).addEventListener('pointerout', function(e){
      const c = e.target.closest && e.target.closest(selector); if(!c || c.contains(e.relatedTarget)) return;
      c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg');
    });
  }
  window.ccFx = { confetti: confetti, burstFrom: burstFrom, countUp: countUp, tilt: tilt, calm: calm };
})();
