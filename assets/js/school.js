// Shared behaviour of the school pages (Français, Tech Lab): header, mobile menu, current section,
// mobile action bar, a light that follows the pointer in the hero, buttons that lean toward it, counting stats.
(function(){
  'use strict';
  const nav = document.querySelector('.sc-nav'); if(!nav) return;
  const calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const burger = nav.querySelector('.sc-burger'), panel = nav.querySelector('.sc-panel');
  if(burger) burger.addEventListener('click', function(){ const open = !panel.classList.contains('open'); panel.classList.toggle('open', open); burger.setAttribute('aria-expanded', String(open)); });
  if(panel) panel.addEventListener('click', function(e){ if(e.target.closest('a')){ panel.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); } });
  const links = Array.prototype.slice.call(nav.querySelectorAll('.sc-links a[href^="#"]'));
  const secs = links.map(function(a){ return document.querySelector(a.getAttribute('href')); });
  const mcta = document.querySelector('.sc-mcta'), hero = document.querySelector('.hero');
  function onScroll(){
    const y = window.scrollY;
    nav.classList.toggle('scrolled', y > 8);
    let cur = -1; secs.forEach(function(s, i){ if(s && s.getBoundingClientRect().top < 140) cur = i; });
    links.forEach(function(a, i){ a.classList.toggle('active', i === cur); });
    if(mcta && hero) mcta.classList.toggle('show', hero.getBoundingClientRect().bottom < 0);
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if(!calm && hero && matchMedia('(hover: hover)').matches){
    hero.classList.add('sc-spot');
    hero.addEventListener('pointermove', function(e){ const r = hero.getBoundingClientRect(); hero.style.setProperty('--hx', ((e.clientX - r.left) / r.width * 100) + '%'); hero.style.setProperty('--hy', ((e.clientY - r.top) / r.height * 100) + '%'); });
    document.addEventListener('pointermove', function(e){
      const b = e.target.closest && e.target.closest('.btn.main, .btn.ghost, .sc-cta');
      document.querySelectorAll('[data-mag]').forEach(function(x){ if(x !== b){ x.style.setProperty('--bx', '0px'); x.style.setProperty('--by', '0px'); x.removeAttribute('data-mag'); } });
      if(!b) return; const r = b.getBoundingClientRect();
      b.setAttribute('data-mag', ''); b.style.setProperty('--bx', ((e.clientX - r.left - r.width / 2) * .18).toFixed(1) + 'px'); b.style.setProperty('--by', ((e.clientY - r.top - r.height / 2) * .25).toFixed(1) + 'px');
    });
  }
  const stats = document.querySelector('.sc-stats');
  if(stats && 'IntersectionObserver' in window){
    const io = new IntersectionObserver(function(es){ es.forEach(function(en){ if(en.isIntersecting){ if(window.ccFx) ccFx.countUp(stats); io.disconnect(); } }); }, { threshold: .4 });
    io.observe(stats);
  }
})();
