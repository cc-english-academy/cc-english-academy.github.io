// Virtual worlds for the class room: one scene per club / course, used as the room's background and as
// a camera virtual background. Pure SVG drawn here (no image files), 1280×720.
//   ccWorlds.list            [{ id, en, ar, icon }]
//   ccWorlds.svg(id)         the SVG markup of a scene
//   ccWorlds.image(id)       Promise<HTMLImageElement> of the scene (for canvases)
//   ccWorlds.fromClub(name)  'Cinema Club' → 'cinema', 'french' → 'french' …
(function(){
  'use strict';
  const W = 1280, H = 720;
  const rnd = (function(seed){ return function(){ seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }; })(7);
  const rep = function(n, f){ let s = ''; for(let i = 0; i < n; i++) s += f(i); return s; };
  const grad = function(id, a, b, vertical){ return '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (vertical ? 0 : 1) + '" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>'; };
  const wrap = function(defs, body){ return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="xMidYMid slice"><defs>' + defs + '</defs>' + body + '</svg>'; };
  const txt = function(x, y, s, size, fill, extra){ return '<text x="' + x + '" y="' + y + '" font-family="Georgia, \'Times New Roman\', serif" font-weight="700" font-size="' + size + '" fill="' + fill + '"' + (extra || '') + '>' + s + '</text>'; };

  const SCENES = {
    academy: function(){
      return wrap(grad('g', '#2a0b16', '#6e2238') + '<radialGradient id="r" cx=".75" cy=".2" r=".7"><stop offset="0" stop-color="#d7b46a" stop-opacity=".35"/><stop offset="1" stop-color="#d7b46a" stop-opacity="0"/></radialGradient>',
        '<rect width="1280" height="720" fill="url(#g)"/><rect width="1280" height="720" fill="url(#r)"/>' +
        rep(6, function(i){ return '<circle cx="1050" cy="150" r="' + (120 + i * 90) + '" fill="none" stroke="#f3dca4" stroke-opacity="' + (0.16 - i * 0.02) + '" stroke-width="2"/>'; }) +
        txt(90, 640, 'CC', 380, '#ffffff', ' opacity=".06"') + '<circle cx="1180" cy="80" r="26" fill="#5fe0c8" opacity=".55"/>' +
        rep(40, function(){ return '<circle cx="' + (rnd() * W | 0) + '" cy="' + (rnd() * H | 0) + '" r="' + (rnd() * 2 + .6).toFixed(1) + '" fill="#f3dca4" opacity="' + (rnd() * .5 + .2).toFixed(2) + '"/>'; }));
    },
    phonics: function(){
      const cols = ['#ff6b6b', '#ffa94d', '#ffd43b', '#69db7c', '#4dabf7', '#9775fa', '#f783ac'];
      return wrap(grad('g', '#e7f5ff', '#fff4e6', true),
        '<rect width="1280" height="720" fill="url(#g)"/><rect y="560" width="1280" height="160" fill="#c3fae8"/>' +
        rep(26, function(i){ const L = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[i]; return txt(rnd() * 1180 + 20 | 0, rnd() * 520 + 90 | 0, L, rnd() * 70 + 50 | 0, cols[i % 7], ' opacity=".55" transform="rotate(' + ((rnd() * 40 - 20) | 0) + ' 640 360)"'); }) +
        '<g transform="translate(980 470)"><rect width="200" height="110" rx="18" fill="#fff" stroke="#4dabf7" stroke-width="6"/>' + txt(26, 76, '/æ/ /b/', 46, '#1c7ed6') + '</g>' +
        '<g transform="translate(90 470)"><circle r="60" cx="60" cy="60" fill="#ffd43b"/><circle cx="42" cy="50" r="7" fill="#333"/><circle cx="78" cy="50" r="7" fill="#333"/><path d="M36 78 Q60 100 84 78" stroke="#333" stroke-width="6" fill="none" stroke-linecap="round"/></g>');
    },
    reading: function(){
      const cols = ['#8a1c33', '#1f3a6e', '#2f9e44', '#e67700', '#5f3dc4', '#c2255c', '#0b7285', '#d9480f'];
      let shelves = '';
      for(let r = 0; r < 4; r++){
        let x = 40; const y = 70 + r * 160;
        shelves += '<rect x="20" y="' + (y + 120) + '" width="1240" height="16" fill="#6b3f1d"/>';
        while(x < 1240){ const w = 22 + rnd() * 26 | 0, h = 80 + rnd() * 40 | 0; shelves += '<rect x="' + x + '" y="' + (y + 120 - h) + '" width="' + w + '" height="' + h + '" rx="3" fill="' + cols[(rnd() * 8) | 0] + '"/><rect x="' + (x + 4) + '" y="' + (y + 130 - h) + '" width="' + (w - 8) + '" height="4" fill="#f3dca4" opacity=".6"/>'; x += w + 3; }
      }
      return wrap(grad('g', '#3b2414', '#22140b', true) + '<radialGradient id="l" cx=".85" cy=".1" r=".6"><stop offset="0" stop-color="#ffd8a8" stop-opacity=".5"/><stop offset="1" stop-color="#ffd8a8" stop-opacity="0"/></radialGradient>',
        '<rect width="1280" height="720" fill="url(#g)"/>' + shelves + '<rect width="1280" height="720" fill="url(#l)"/>');
    },
    writing: function(){
      return wrap(grad('g', '#fffdf5', '#f3ecdf', true),
        '<rect width="1280" height="720" fill="url(#g)"/>' + rep(17, function(i){ return '<line x1="0" x2="1280" y1="' + (60 + i * 40) + '" y2="' + (60 + i * 40) + '" stroke="#a5d8ff" stroke-width="2"/>'; }) +
        '<line x1="140" x2="140" y1="0" y2="720" stroke="#ff8787" stroke-width="3"/>' +
        txt(190, 175, 'Once upon a time…', 54, '#1c3d8f', ' font-style="italic" opacity=".55"') + txt(190, 255, 'Dear friend,', 46, '#1c3d8f', ' font-style="italic" opacity=".4"') +
        '<g transform="translate(900 300) rotate(-35)"><rect width="330" height="44" rx="6" fill="#ffd43b"/><rect width="60" height="44" rx="6" fill="#ffa8a8"/><rect x="55" width="14" height="44" fill="#adb5bd"/><polygon points="330,0 390,22 330,44" fill="#f8d9a0"/><polygon points="372,15 390,22 372,29" fill="#343a40"/></g>' +
        '<circle cx="1120" cy="610" r="40" fill="#1c3d8f" opacity=".12"/><circle cx="1180" cy="650" r="16" fill="#1c3d8f" opacity=".1"/>');
    },
    grammar: function(){
      const piece = function(x, y, c, w){ return '<g transform="translate(' + x + ' ' + y + ')"><rect width="220" height="110" rx="16" fill="' + c + '"/><circle cx="220" cy="55" r="22" fill="' + c + '"/>' + txt(26, 70, w, 38, '#fff') + '</g>'; };
      return wrap(grad('g', '#f8f0fc', '#e7f5ff'),
        '<rect width="1280" height="720" fill="url(#g)"/>' + rep(30, function(){ return '<rect x="' + (rnd() * W | 0) + '" y="' + (rnd() * H | 0) + '" width="24" height="24" rx="5" fill="#cc5de8" opacity=".12" transform="rotate(' + (rnd() * 90 | 0) + ')"/>'; }) +
        piece(150, 470, '#e64980', 'Subject') + piece(410, 470, '#7950f2', 'Verb') + piece(670, 470, '#1c7ed6', 'Object') +
        txt(150, 200, 'She reads books.', 72, '#5f3dc4', ' opacity=".25"') + txt(900, 140, 'is / am / are', 40, '#e64980', ' opacity=".35"'));
    },
    speaking: function(){
      return wrap(grad('g', '#120c24', '#2b1650', true) + '<radialGradient id="s" cx=".5" cy=".95" r=".55"><stop offset="0" stop-color="#ffe066" stop-opacity=".55"/><stop offset="1" stop-color="#ffe066" stop-opacity="0"/></radialGradient>',
        '<rect width="1280" height="720" fill="url(#g)"/><polygon points="250,0 330,0 720,720 420,720" fill="#fff" opacity=".06"/><polygon points="950,0 1030,0 860,720 560,720" fill="#fff" opacity=".06"/>' +
        '<path d="M0 0 H150 Q120 360 170 720 H0Z" fill="#a61e4d"/><path d="M1280 0 H1130 Q1160 360 1110 720 H1280Z" fill="#a61e4d"/>' +
        '<rect y="600" width="1280" height="120" fill="#3b2a1a"/><rect width="1280" height="720" fill="url(#s)"/>' +
        '<g transform="translate(610 360)"><rect x="18" y="0" width="24" height="70" rx="12" fill="#adb5bd"/><rect x="27" y="70" width="6" height="170" fill="#495057"/><rect x="0" y="240" width="60" height="10" rx="5" fill="#495057"/></g>' +
        rep(30, function(){ return '<circle cx="' + (rnd() * W | 0) + '" cy="' + (rnd() * 300 | 0) + '" r="1.5" fill="#fff" opacity=".6"/>'; }));
    },
    conversation: function(){
      const bub = function(x, y, w, s, c){ return '<g transform="translate(' + x + ' ' + y + ')"><rect width="' + w + '" height="90" rx="40" fill="' + c + '"/><polygon points="40,86 70,86 34,120" fill="' + c + '"/>' + txt(30, 60, s, 40, '#fff') + '</g>'; };
      return wrap(grad('g', '#fff4e6', '#ffe8cc', true),
        '<rect width="1280" height="720" fill="url(#g)"/><rect y="0" width="1280" height="70" fill="#e8590c"/>' + rep(16, function(i){ return '<path d="M' + (i * 80) + ' 70 q40 40 80 0" fill="' + (i % 2 ? '#fff' : '#e8590c') + '"/>'; }) +
        '<rect y="560" width="1280" height="160" fill="#a0522d" opacity=".35"/>' + bub(120, 160, 230, 'Hi there!', '#1c7ed6') + bub(820, 220, 330, 'How are you?', '#2f9e44') + bub(430, 330, 360, 'Nice to meet you', '#e64980') +
        '<g transform="translate(1040 470)"><rect width="110" height="90" rx="10" fill="#fff"/><path d="M110 20 q40 25 0 50" stroke="#fff" stroke-width="12" fill="none"/><path d="M30 -10 q10 -20 0 -40 M60 -10 q10 -20 0 -40" stroke="#adb5bd" stroke-width="5" fill="none"/></g>');
    },
    cinema: function(){
      return wrap(grad('g', '#120208', '#2b0712', true) + '<radialGradient id="sc" cx=".5" cy=".35" r=".45"><stop offset="0" stop-color="#e7f5ff" stop-opacity=".35"/><stop offset="1" stop-color="#e7f5ff" stop-opacity="0"/></radialGradient>',
        '<rect width="1280" height="720" fill="url(#g)"/><rect x="240" y="70" width="800" height="380" rx="8" fill="#dee2e6" opacity=".1"/><rect width="1280" height="720" fill="url(#sc)"/>' +
        rep(9, function(i){ return '<path d="M' + (i * 22) + ' 0 Q' + (i * 22 + 30) + ' 360 ' + (i * 22) + ' 720" stroke="#7a0f25" stroke-width="22" fill="none"/>'; }) +
        rep(9, function(i){ return '<path d="M' + (1280 - i * 22) + ' 0 Q' + (1250 - i * 22) + ' 360 ' + (1280 - i * 22) + ' 720" stroke="#7a0f25" stroke-width="22" fill="none"/>'; }) +
        rep(3, function(r){ return rep(12, function(i){ return '<rect x="' + (170 + i * 80) + '" y="' + (530 + r * 60) + '" width="64" height="70" rx="16" fill="#3d0a16"/>'; }); }) +
        '<g opacity=".5">' + rep(14, function(i){ return '<rect x="' + (i * 92) + '" y="12" width="70" height="40" rx="4" fill="none" stroke="#f3dca4" stroke-width="3"/>'; }) + '</g>');
    },
    french: function(){
      return wrap(grad('g', '#fde3cf', '#f4b6a8', true) + '<radialGradient id="sun" cx=".5" cy=".55" r=".35"><stop offset="0" stop-color="#ffe7c2"/><stop offset="1" stop-color="#ffe7c2" stop-opacity="0"/></radialGradient>',
        '<rect width="1280" height="720" fill="url(#g)"/><rect width="1280" height="720" fill="url(#sun)"/><rect width="1280" height="14" fill="#002654"/><rect x="427" width="426" height="14" fill="#fff"/><rect x="853" width="427" height="14" fill="#ce1126"/>' +
        '<path d="M0 720V560L40 540H140V520H150V540H220L250 560V720ZM980 720V550L1010 530H1110V515H1120V530H1200L1280 560V720Z" fill="#8a3b4c" opacity=".45"/>' +
        '<path fill="#3e0f1b" fill-rule="evenodd" d="M636 60H644L648 150L672 330H686V346H676L712 500H738V520H724L800 720H724Q640 610 556 720H480L556 520H542V500H568L604 346H594V330H608L632 150ZM626 346L640 400L654 346ZM588 500L640 450L692 500Z"/>' +
        txt(90, 200, 'Bonjour', 60, '#7a2236', ' font-style="italic" opacity=".5"') + txt(950, 260, 'Merci ♡', 54, '#7a2236', ' font-style="italic" opacity=".5"'));
    },
    tech: function(){
      return wrap(grad('g', '#0b0820', '#1a1245', true),
        '<rect width="1280" height="720" fill="url(#g)"/>' + rep(25, function(i){ return '<line x1="' + (i * 54 - 40) + '" y1="720" x2="' + (640 + (i - 12) * 18) + '" y2="430" stroke="#7c5cff" stroke-opacity=".35"/>'; }) +
        rep(8, function(i){ return '<line x1="0" x2="1280" y1="' + (440 + i * i * 5) + '" y2="' + (440 + i * i * 5) + '" stroke="#00e5ff" stroke-opacity=".3"/>'; }) +
        '<g font-family="Consolas, monospace" font-size="26" opacity=".55"><text x="80" y="110" fill="#ff7ac6">def <tspan fill="#7fd4ff">learn</tspan>(): </text><text x="110" y="150" fill="#7dffb0">return "future"</text><text x="860" y="120" fill="#ffd27a">&lt;/&gt; { AI }</text><text x="900" y="170" fill="#9ef0ff">01001100</text></g>' +
        rep(18, function(){ const x = rnd() * W | 0, y = rnd() * 380 | 0; return '<circle cx="' + x + '" cy="' + y + '" r="3" fill="#00e5ff" opacity=".6"/><line x1="' + x + '" y1="' + y + '" x2="' + (x + 60) + '" y2="' + y + '" stroke="#00e5ff" stroke-opacity=".25"/>'; }));
    },
    techkids: function(){
      const blk = function(x, y, c, s){ return '<g transform="translate(' + x + ' ' + y + ')"><path d="M0 10 Q0 0 10 0 H40 l8 10 h24 l8 -10 H230 Q240 0 240 10 V60 Q240 70 230 70 H80 l-8 10 h-24 l-8 -10 H10 Q0 70 0 60Z" fill="' + c + '"/>' + txt(20, 46, s, 28, '#fff') + '</g>'; };
      return wrap(grad('g', '#e3fafc', '#fff9db', true),
        '<rect width="1280" height="720" fill="url(#g)"/>' + blk(110, 140, '#ffa94d', 'when ▶ clicked') + blk(110, 220, '#4dabf7', 'move 10 steps') + blk(110, 300, '#9775fa', 'say Hello!') + blk(110, 380, '#69db7c', 'repeat 3') +
        '<g transform="translate(880 300)"><rect width="200" height="180" rx="30" fill="#868e96"/><rect x="30" y="40" width="140" height="70" rx="16" fill="#e9ecef"/><circle cx="70" cy="75" r="16" fill="#1c7ed6"/><circle cx="130" cy="75" r="16" fill="#1c7ed6"/><rect x="95" y="-40" width="10" height="40" fill="#868e96"/><circle cx="100" cy="-46" r="14" fill="#fa5252"/><rect x="60" y="130" width="80" height="16" rx="8" fill="#495057"/></g>' +
        rep(20, function(){ return '<text x="' + (rnd() * W | 0) + '" y="' + (rnd() * H | 0) + '" font-size="30" opacity=".35">⭐</text>'; }));
    }
  };
  const LIST = [
    { id: 'academy', en: 'Code Cademy', ar: 'Code Cademy', icon: '🏛️' },
    { id: 'phonics', en: 'Phonics Club', ar: 'نادي الصوتيات', icon: '🔤' },
    { id: 'reading', en: 'Reading Club', ar: 'نادي القراءة', icon: '📚' },
    { id: 'writing', en: 'Writing Club', ar: 'نادي الكتابة', icon: '✍️' },
    { id: 'grammar', en: 'Grammar Club', ar: 'نادي القواعد', icon: '🧩' },
    { id: 'speaking', en: 'Speaking Club', ar: 'نادي التحدث', icon: '🎤' },
    { id: 'conversation', en: 'Conversation Club', ar: 'نادي المحادثة', icon: '💬' },
    { id: 'cinema', en: 'Cinema Club', ar: 'نادي السينما', icon: '🎬' },
    { id: 'french', en: 'Le Club Français', ar: 'النادي الفرنسي', icon: '🥐' },
    { id: 'tech', en: 'Coco Tech Lab', ar: 'مختبر التقنية', icon: '💻' },
    { id: 'techkids', en: 'Coding for kids', ar: 'برمجة الأطفال', icon: '🤖' }
  ];
  const cache = {}, imgs = {};
  // gradient ids get the scene's name, so several scenes on one page never borrow each other's colours
  function svg(id){ id = SCENES[id] ? id : 'academy'; return cache[id] || (cache[id] = SCENES[id]().replace(/id="(\w+)"/g, 'id="' + id + '-$1"').replace(/url\(#(\w+)\)/g, 'url(#' + id + '-$1)')); }
  function image(id){
    id = SCENES[id] ? id : 'academy';
    if(imgs[id]) return imgs[id];
    return (imgs[id] = new Promise(function(res, rej){ const im = new Image(); im.onload = function(){ res(im); }; im.onerror = rej; im.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg(id)); }));
  }
  function fromClub(name){
    const s = String(name || '').toLowerCase();
    if(SCENES[s]) return s;
    const hit = LIST.find(function(w){ return w.en.toLowerCase() === s || s.indexOf(w.id) === 0; });
    return hit ? hit.id : 'academy';
  }
  window.ccWorlds = { list: LIST, svg: svg, image: image, fromClub: fromClub, get: function(id){ return LIST.find(function(w){ return w.id === id; }) || LIST[0]; } };
})();
