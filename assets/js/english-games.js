// Six free English games for every age, on the home page (#games). No sign-in, no AI cost.
// Stars stay on the visitor's device. Text follows the page language (html[lang]).
(function(){
  'use strict';
  const root = document.getElementById('enGames'); if(!root) return;
  const html = document.documentElement;
  const ar = function(){ return html.lang === 'ar'; };
  const T = function(en, a){ return ar() ? a : en; };
  const L = function(x){ return Array.isArray(x) ? T(x[0], x[1]) : x; };
  const esc = function(s){ return String(s).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  const shuffle = function(a){ a = a.slice(); for(let i = a.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  function say(text, rate){ try{ if(!window.speechSynthesis) return; speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(text); u.lang = 'en-US'; u.rate = rate || .85; speechSynthesis.speak(u); }catch(e){} }

  const GAMES = [
    { id: 'pics', icon: '🐣', age: ['Age 4+', 'من ٤ سنوات'], t: ['Picture words', 'الصورة والكلمة'] },
    { id: 'scramble', icon: '🔤', age: ['Age 7+', 'من ٧ سنوات'], t: ['Word scramble', 'رتّب الحروف'] },
    { id: 'spell', icon: '🎧', age: ['Age 8+', 'من ٨ سنوات'], t: ['Listen & spell', 'استمع واكتب'] },
    { id: 'grammar', icon: '✏️', age: ['Age 10+', 'من ١٠ سنوات'], t: ['Fix the sentence', 'صحّح الجملة'] },
    { id: 'tense', icon: '⏰', age: ['Easy → Hard', 'سهل ← صعب'], t: ['Tense time', 'وقت الأزمنة'] },
    { id: 'idioms', icon: '💬', age: ['Teens & adults', 'شباب وكبار'], t: ['Idioms & phrasal verbs', 'تعبيرات وأفعال مركّبة'] }
  ];
  const PICS = [['🐱', 'cat', 'قطة'], ['🐶', 'dog', 'كلب'], ['🍎', 'apple', 'تفاحة'], ['🍌', 'banana', 'موزة'], ['🚗', 'car', 'سيارة'], ['🏠', 'house', 'بيت'], ['☀️', 'sun', 'شمس'], ['🌙', 'moon', 'قمر'],
    ['📚', 'book', 'كتاب'], ['⚽', 'ball', 'كرة'], ['🐟', 'fish', 'سمكة'], ['🌳', 'tree', 'شجرة'], ['🥛', 'milk', 'حليب'], ['✈️', 'plane', 'طائرة'], ['🐘', 'elephant', 'فيل'], ['🦁', 'lion', 'أسد'], ['🍕', 'pizza', 'بيتزا'], ['🌧️', 'rain', 'مطر']];
  const SCRAMBLE = [['apple', '🍎'], ['school', '🏫'], ['friend', '🤝'], ['water', '💧'], ['happy', '😊'], ['garden', '🌷'], ['teacher', '👩‍🏫'], ['window', '🪟'], ['orange', '🍊'], ['family', '👨‍👩‍👧'], ['yellow', '💛'], ['summer', '🏖️'], ['rabbit', '🐰'], ['pencil', '✏️']];
  const SPELL = [['because', 'لأن'], ['beautiful', 'جميل'], ['Wednesday', 'الأربعاء'], ['friend', 'صديق'], ['people', 'ناس'], ['science', 'علوم'], ['answer', 'إجابة'], ['Thursday', 'الخميس'], ['February', 'فبراير'], ['different', 'مختلف'], ['library', 'مكتبة'], ['tomorrow', 'غدًا'], ['question', 'سؤال'], ['favourite', 'المفضّل']];
  // [right, wrong, wrong, why en, why ar]
  const GRAMMAR = [
    ['She goes to school every day.', 'She go to school every day.', 'She going to school every day.', 'With he / she / it, add -s in the present simple.', 'مع he / she / it نضيف s في المضارع البسيط.'],
    ['I am ten years old.', 'I have ten years old.', 'I am ten years.', 'In English you ARE an age: I am 10 years old.', 'في الإنجليزية نقول I am للعمر، وليس I have.'],
    ['There are three apples.', 'There is three apples.', 'There are three apple.', 'Many things → there are + plural (-s).', 'أكثر من شيء ← there are والاسم جمع.'],
    ['He didn’t go to the party.', 'He didn’t went to the party.', 'He not go to the party.', 'After didn’t, use the base verb: go.', 'بعد didn’t يعود الفعل إلى أصله: go.'],
    ['I have lived here since 2020.', 'I live here since 2020.', 'I am living here since 2020.', '“since” + a starting point → present perfect.', 'since مع بداية زمن ← المضارع التام.'],
    ['If it rains, we will stay home.', 'If it will rain, we will stay home.', 'If it rains, we stayed home.', 'First conditional: if + present, will + verb.', 'الشرط الأول: if + مضارع، و will + فعل.'],
    ['She is better than me at maths.', 'She is more better than me at maths.', 'She is gooder than me at maths.', 'good → better (never “more better”).', 'good ← better (ولا يصح more better).'],
    ['Can you help me, please?', 'Can you helping me, please?', 'Can you to help me, please?', 'After can, use the base verb with no “to”.', 'بعد can يأتي الفعل دون to ودون ing.'],
    ['I waited for an hour.', 'I waited for a hour.', 'I waited for hour.', '“hour” starts with a vowel sound (the h is silent) → an.', 'hour تبدأ بصوت حرف متحرك (الـh لا تُنطق) ← an.'],
    ['They’re playing in their garden.', 'Their playing in there garden.', 'There playing in they’re garden.', 'they’re = they are · their = belongs to them · there = a place.', 'they’re = they are · their = خاصتهم · there = هناك.']
  ];
  // [sentence with ___, options (first is right), why en, why ar]
  const TENSES = {
    easy: [['I ___ breakfast every morning.', ['eat', 'eats', 'eating', 'to eat'], 'Every morning = a habit → present simple: I eat.', 'كل صباح = عادة ← مضارع بسيط: I eat.'],
      ['She ___ a cat.', ['has', 'have', 'having', 'haves'], 'She + have → has.', 'مع She تصبح have ‏has.'],
      ['Look! The baby ___.', ['is sleeping', 'sleeps', 'sleep', 'slept'], 'Look! = happening now → present continuous.', 'Look! = يحدث الآن ← مضارع مستمر.'],
      ['They ___ happy.', ['are', 'is', 'am', 'be'], 'They → are.', 'They يأتي معها are.'],
      ['Yesterday we ___ to the park.', ['went', 'go', 'goes', 'going'], 'Yesterday → past: go → went.', 'Yesterday ← ماضي: go ← went.']],
    medium: [['I ___ my homework already.', ['have finished', 'finish', 'am finishing', 'finishes'], '“already” → present perfect.', 'already ← المضارع التام.'],
      ['When I called, she ___ TV.', ['was watching', 'watches', 'is watching', 'watch'], 'An action in progress in the past → past continuous.', 'شيء كان مستمرًا في الماضي ← ماضٍ مستمر.'],
      ['Look at those clouds! It ___ rain.', ['is going to', 'goes to', 'went to', 'is go to'], 'You can see the evidence → going to.', 'ترى الدليل أمامك ← going to.'],
      ['He ___ football since he was six.', ['has played', 'plays', 'played', 'is play'], '“since” → present perfect.', 'since ← المضارع التام.'],
      ['Did you ___ the film?', ['see', 'saw', 'seen', 'seeing'], 'After did, the base verb: see.', 'بعد did يأتي الفعل في أصله: see.']],
    hard: [['By next year, I ___ my degree.', ['will have finished', 'will finish already', 'have finished', 'finished'], '“By next year” → future perfect.', 'By next year ← المستقبل التام.'],
      ['If I ___ rich, I would travel the world.', ['were', 'am', 'will be', 'have been'], 'Second conditional: if + past (were), would + verb.', 'الشرط الثاني: if + ماضٍ (were)، و would + فعل.'],
      ['She ___ for two hours when the bus finally came.', ['had been waiting', 'has waited', 'was wait', 'waits'], 'A long action before another past action → past perfect continuous.', 'شيء استمر طويلًا قبل شيء آخر في الماضي ← ماضٍ تام مستمر.'],
      ['I wish I ___ more time yesterday.', ['had had', 'have', 'had', 'would have'], 'A wish about the past → wish + past perfect.', 'أمنية عن الماضي ← wish + ماضٍ تام.'],
      ['The letter ___ by the manager right now.', ['is being written', 'is writing', 'writes', 'has write'], 'Passive + happening now → is being + past participle.', 'مبني للمجهول ويحدث الآن ← is being + التصريف الثالث.']]
  };
  // [phrase, meanings (first is right) as [en, ar], example]
  const IDIOMS = [
    ['break the ice', [['start a friendly conversation', 'يبدأ حديثًا وديًا'], ['break something', 'يكسر شيئًا'], ['feel cold', 'يشعر بالبرد'], ['stop talking', 'يتوقف عن الكلام']], 'A joke helps to break the ice.'],
    ['a piece of cake', [['very easy', 'سهل جدًا'], ['a dessert', 'حلويات'], ['a small part', 'قطعة صغيرة'], ['a party', 'حفلة']], 'The test was a piece of cake!'],
    ['under the weather', [['a little sick', 'متعب قليلًا'], ['outside in the rain', 'في الخارج تحت المطر'], ['very happy', 'سعيد جدًا'], ['late', 'متأخر']], 'I’m feeling under the weather today.'],
    ['hit the books', [['study hard', 'يذاكر بجدّ'], ['throw books', 'يرمي الكتب'], ['buy books', 'يشتري كتب'], ['sleep', 'ينام']], 'Exams are next week. Time to hit the books!'],
    ['give up', [['stop trying', 'يستسلم'], ['give a present', 'يقدّم هدية'], ['go upstairs', 'يصعد إلى الأعلى'], ['wake up', 'يستيقظ']], 'Never give up on your dreams.'],
    ['look after', [['take care of', 'يعتني بـ'], ['look behind', 'ينظر إلى الخلف'], ['search for', 'يبحث عن'], ['visit', 'يزور']], 'Can you look after my cat this weekend?'],
    ['find out', [['discover information', 'يعرف معلومة'], ['go outside', 'يخرج'], ['lose something', 'يضيّع شيئًا'], ['be angry', 'يغضب']], 'I found out the answer online.'],
    ['once in a blue moon', [['very rarely', 'نادرًا جدًا'], ['every night', 'كل ليلة'], ['at the weekend', 'في عطلة نهاية الأسبوع'], ['when it is cold', 'عندما يكون الجو باردًا']], 'I eat fast food once in a blue moon.'],
    ['cost an arm and a leg', [['be very expensive', 'غالٍ جدًا'], ['hurt a lot', 'يؤلم بشدة'], ['be cheap', 'رخيص'], ['need a doctor', 'يحتاج إلى طبيب']], 'That phone cost an arm and a leg.'],
    ['run out of', [['have no more left', 'يتخلّص منه'], ['run outside', 'يركض إلى الخارج'], ['be fast', 'سريع'], ['leave a room', 'يغادر الغرفة']], 'We ran out of milk.']
  ];

  let game = 'pics', stars = 0, st = {};
  try{ stars = parseInt(localStorage.getItem('cc_en_stars'), 10) || 0; }catch(e){}
  const RANKS = [[0, '🌱', 'Beginner', 'مبتدئ'], [10, '🗣️', 'Speaker', 'متحدّث'], [25, '📖', 'Storyteller', 'راوٍ'], [50, '🌟', 'Fluent star', 'نجم الطلاقة'], [100, '👑', 'English champion', 'بطل الإنجليزية']];
  const rank = function(){ let r = RANKS[0]; RANKS.forEach(function(x){ if(stars >= x[0]) r = x; }); return r; };
  function tone(good){
    try{ const A = window.AudioContext || window.webkitAudioContext; if(!A) return; const c = tone.c || (tone.c = new A()), o = c.createOscillator(), g = c.createGain();
      o.frequency.value = good ? 880 : 220; o.type = good ? 'triangle' : 'sine'; g.gain.setValueAtTime(.12, c.currentTime); g.gain.exponentialRampToValueAtTime(.001, c.currentTime + .25);
      o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + .26); }catch(e){}
  }
  function win(el){
    stars++; try{ localStorage.setItem('cc_en_stars', String(stars)); }catch(e){}
    tone(true);
    if(window.ccFx){ if(el) ccFx.burstFrom(el, { emoji: ['⭐'], colors: ['#5C1A28', '#5FE0C8', '#F7E4D4', '#f0c44a', '#ffffff'] }); }
    if(RANKS.some(function(x){ return x[0] === stars; }) && window.ccFx){ ccFx.confetti({ n: 160, emoji: [rank()[1], '⭐'], colors: ['#5C1A28', '#5FE0C8', '#f0c44a', '#ffffff'] }); const s = root.querySelector('.eg-stars'); if(s){ s.classList.remove('lvlup'); void s.offsetWidth; s.classList.add('lvlup'); } }
  }
  function deal(len){ if(!st.deck || !st.deck.length) st.deck = shuffle(Array.from({ length: len }, function(_, i){ return i; })); st.cur = st.deck.pop(); st.done = false; st.ans = null; }
  function newRound(){
    if(game === 'pics'){ deal(PICS.length); st.opts = shuffle([st.cur].concat(shuffle(PICS.map(function(_, i){ return i; }).filter(function(i){ return i !== st.cur; })).slice(0, 3))); }
    else if(game === 'scramble'){ deal(SCRAMBLE.length); const w = SCRAMBLE[st.cur][0]; let letters; do { letters = shuffle(w.split('')); } while(letters.join('') === w && w.length > 1); st.letters = letters; st.picked = []; }
    else if(game === 'spell'){ deal(SPELL.length); st.hint = 0; }
    else if(game === 'grammar'){ deal(GRAMMAR.length); st.opts = shuffle([0, 1, 2]); }
    else if(game === 'tense'){ const pool = TENSES[st.lv]; if(st.deckLv !== st.lv){ st.deck = null; st.deckLv = st.lv; } deal(pool.length); st.opts = shuffle([0, 1, 2, 3]); }
    else if(game === 'idioms'){ deal(IDIOMS.length); st.opts = shuffle([0, 1, 2, 3]); }
  }
  const next = function(){ return '<button type="button" class="eg-btn" data-act="next">' + esc(T('Next →', 'التالي ←')) + '</button>'; };
  const cls = function(i, right){ return st.done ? (i === right ? ' ok' : (i === st.ans ? ' no' : '')) : ''; };
  function render(){
    const r = rank();
    let h = '<div class="eg-top"><div><div class="kicker">' + esc(T('Play & learn', 'العب وتعلّم')) + '</div><h2>' + esc(T('English games for every age', 'ألعاب إنجليزية لكل الأعمار')) + '</h2><p>' + esc(T('Six free games: from first words to idioms. Collect ⭐ and level up!', '٦ ألعاب مجانية: من الكلمة الأولى حتى التعبيرات — اجمع ⭐ وترقَّ!')) + '</p></div>' +
      '<div class="eg-stars">⭐ ' + stars + ' <small>· ' + r[1] + ' ' + esc(T(r[2], r[3])) + '</small></div></div>' +
      '<div class="eg-tabs" role="tablist">' + GAMES.map(function(g){ return '<button type="button" role="tab" aria-selected="' + (g.id === game) + '" data-game="' + g.id + '" class="' + (g.id === game ? 'on' : '') + '"><span class="ic">' + g.icon + '</span><b>' + esc(L(g.t)) + '</b><small>' + esc(L(g.age)) + '</small></button>'; }).join('') + '</div><div class="eg-stage">';
    if(game === 'pics'){
      const p = PICS[st.cur];
      h += '<h3>' + esc(T('What is this?', 'ما اسم هذا؟')) + '</h3><p class="hint">' + esc(T('Tap the right word. Tap 🔊 to hear it.', 'اضغط على الكلمة الصحيحة — واضغط 🔊 لتسمعها.')) + '</p><div class="eg-big" aria-hidden="true">' + p[0] + '</div>' +
        '<div class="eg-opts">' + st.opts.map(function(i){ return '<button type="button" class="en-txt' + cls(i, st.cur) + '" data-act="pick" data-k="' + i + '">' + esc(PICS[i][1]) + '</button>'; }).join('') + '</div>' +
        '<p class="eg-msg">' + (st.done ? (st.ans === st.cur ? '⭐ ' + esc(T('Great! ', 'أحسنت! ')) : '💡 ') + esc(p[1] + ' = ' + p[2]) : '') + '</p><div class="eg-foot"><button type="button" class="eg-btn ghost" data-act="say" data-t="' + esc(p[1]) + '">🔊 ' + esc(T('Listen', 'استمع')) + '</button>' + (st.done ? next() : '') + '</div>';
    } else if(game === 'scramble'){
      const w = SCRAMBLE[st.cur], full = st.picked.length === w[0].length, good = full && st.picked.map(function(i){ return st.letters[i]; }).join('') === w[0];
      h += '<h3>' + w[1] + ' ' + esc(T('Unscramble the word', 'رتّب حروف الكلمة')) + '</h3><p class="hint">' + esc(T('Tap the letters in the right order.', 'اضغط على الحروف بالترتيب الصحيح.')) + '</p>' +
        '<div class="eg-slots' + (full ? (good ? ' good' : ' bad') : '') + '">' + w[0].split('').map(function(_, i){ return '<span>' + (st.picked[i] != null ? esc(st.letters[st.picked[i]]) : '') + '</span>'; }).join('') + '</div>' +
        '<div class="eg-tiles">' + st.letters.map(function(l, i){ return '<button type="button" class="eg-tile" data-act="tile" data-k="' + i + '"' + (st.picked.indexOf(i) !== -1 || full ? ' disabled' : '') + '>' + esc(l) + '</button>'; }).join('') + '</div>' +
        '<p class="eg-msg">' + (full ? (good ? '⭐ ' + esc(T('Yes! “' + w[0] + '”', 'صحيح! «' + w[0] + '»')) : '🤔 ' + esc(T('Not quite. Try again!', 'ليس تمامًا — جرّب مرة أخرى!'))) : '') + '</p>' +
        '<div class="eg-foot">' + (full ? (good ? next() : '<button type="button" class="eg-btn" data-act="clear">' + esc(T('Try again', 'جرّب مرة أخرى')) + '</button>') : (st.picked.length ? '<button type="button" class="eg-btn ghost" data-act="undo">↩ ' + esc(T('Undo', 'رجوع')) + '</button>' : '')) + '</div>';
    } else if(game === 'spell'){
      const w = SPELL[st.cur];
      h += '<h3>' + esc(T('Listen, then type the word', 'استمع واكتب الكلمة')) + '</h3><p class="hint">' + esc(T('Tap the button to hear it again, slower if you like.', 'اضغط الزر لتسمعها مرة أخرى — ويمكن بشكل أبطأ.')) + '</p>' +
        '<button type="button" class="eg-btn listen" data-act="say" data-t="' + esc(w[0]) + '" aria-label="' + esc(T('Listen', 'استمع')) + '">🔊</button>' +
        '<form class="eg-input" data-form="spell"><input name="w" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="' + esc(T('type here', 'اكتب هنا')) + '"' + (st.done ? ' disabled' : '') + '><button class="eg-btn" type="submit"' + (st.done ? ' disabled' : '') + '>' + esc(T('Check', 'تحقّق')) + '</button></form>' +
        '<p class="eg-msg">' + (st.done ? (st.ans ? '⭐ ' + esc(T('Perfect spelling! ', 'إملاء صحيح! ')) : '💡 ' + esc(T('It is spelled: ', 'تُكتب هكذا: '))) + '<b dir="ltr">' + esc(w[0]) + '</b> · ' + esc(w[1]) : st.hint ? '💡 ' + esc(T('It starts with ', 'تبدأ بـ ')) + '<b dir="ltr">' + esc(w[0].slice(0, st.hint)) + '…</b> (' + w[0].length + ' ' + esc(T('letters', 'حروف')) + ')' : '') + '</p>' +
        '<div class="eg-foot"><button type="button" class="eg-btn ghost" data-act="slow" data-t="' + esc(w[0]) + '">🐢 ' + esc(T('Slower', 'أبطأ')) + '</button>' + (st.done ? next() : '<button type="button" class="eg-btn ghost" data-act="hint">💡 ' + esc(T('Hint', 'مساعدة')) + '</button>') + '</div>';
    } else if(game === 'grammar'){
      const g = GRAMMAR[st.cur];
      h += '<h3>' + esc(T('Which sentence is correct?', 'أي جملة صحيحة؟')) + '</h3><p class="hint">' + esc(T('Only one is right. Read them carefully!', 'واحدة فقط صحيحة — اقرأها جيدًا!')) + '</p>' +
        '<div class="eg-opts col">' + st.opts.map(function(i){ return '<button type="button" class="en-txt' + cls(i, 0) + '" data-act="pick" data-k="' + i + '">' + esc(g[i]) + '</button>'; }).join('') + '</div>' +
        '<p class="eg-msg">' + (st.done ? (st.ans === 0 ? '⭐ ' + esc(T('Correct! ', 'صحيح! ')) : '💡 ') + esc(T(g[3], g[4])) : '') + '</p><div class="eg-foot">' + (st.done ? next() : '') + '</div>';
    } else if(game === 'tense'){
      const q = TENSES[st.lv][st.cur];
      h += '<div class="eg-diff">' + [['easy', '🟢', 'Easy', 'سهل'], ['medium', '🟡', 'Medium', 'متوسط'], ['hard', '🔴', 'Hard', 'صعب']].map(function(d){ return '<button type="button" data-act="lv" data-k="' + d[0] + '" class="' + (st.lv === d[0] ? 'on' : '') + '">' + d[1] + ' ' + esc(T(d[2], d[3])) + '</button>'; }).join('') + '</div>' +
        '<h3>' + esc(T('Fill the gap', 'أكمل الفراغ')) + '</h3><div class="eg-sent">' + esc(q[0]).replace('___', '<u>' + (st.done ? esc(q[1][0]) : '&nbsp;?&nbsp;') + '</u>') + '</div>' +
        '<div class="eg-opts">' + st.opts.map(function(i){ return '<button type="button" class="en-txt' + cls(i, 0) + '" data-act="pick" data-k="' + i + '">' + esc(q[1][i]) + '</button>'; }).join('') + '</div>' +
        '<p class="eg-msg">' + (st.done ? (st.ans === 0 ? '⭐ ' + esc(T('Correct! ', 'صحيح! ')) : '💡 ') + esc(T(q[2], q[3])) : '') + '</p><div class="eg-foot">' + (st.done ? next() : '') + '</div>';
    } else if(game === 'idioms'){
      const q = IDIOMS[st.cur];
      h += '<h3>' + esc(T('What does it mean?', 'ما معناها؟')) + '</h3><p class="eg-phrase">“' + esc(q[0]) + '”</p>' + (st.done ? '<p class="eg-ex">' + esc(q[2]) + '</p>' : '<p class="hint" style="text-align:center">' + esc(T('Native speakers say this all the time.', 'يقولها أهل اللغة كثيرًا.')) + '</p>') +
        '<div class="eg-opts col">' + st.opts.map(function(i){ return '<button type="button" class="' + cls(i, 0).trim() + '" data-act="pick" data-k="' + i + '">' + esc(L(q[1][i])) + '</button>'; }).join('') + '</div>' +
        '<p class="eg-msg">' + (st.done ? (st.ans === 0 ? '⭐ ' + esc(T('You got it!', 'أحسنت!')) : '💡 ' + esc(T('It means: ', 'معناها: ') + L(q[1][0]))) : '') + '</p><div class="eg-foot"><button type="button" class="eg-btn ghost" data-act="say" data-t="' + esc(q[0]) + '">🔊</button>' + (st.done ? next() : '') + '</div>';
    }
    root.innerHTML = h + '</div>';
  }
  root.addEventListener('click', function(e){
    const tab = e.target.closest('[data-game]');
    if(tab){ if(tab.dataset.game !== game){ game = tab.dataset.game; st = { lv: 'easy' }; newRound(); render(); } return; }
    const b = e.target.closest('[data-act]'); if(!b) return;
    const act = b.dataset.act;
    if(act === 'say'){ say(b.dataset.t); return; }
    if(act === 'slow'){ say(b.dataset.t, .55); return; }
    if(act === 'next'){ newRound(); render(); if(game === 'spell') setTimeout(function(){ say(SPELL[st.cur][0]); const i = root.querySelector('input[name=w]'); if(i) i.focus(); }, 150); if(game === 'pics') say(PICS[st.cur][1]); return; }
    if(act === 'lv'){ st.lv = b.dataset.k; newRound(); render(); return; }
    if(act === 'hint'){ st.hint = Math.min(SPELL[st.cur][0].length - 1, st.hint + 1); render(); return; }
    if(act === 'undo'){ st.picked.pop(); render(); return; }
    if(act === 'clear'){ st.picked = []; render(); return; }
    if(act === 'tile'){
      st.picked.push(+b.dataset.k);
      const w = SCRAMBLE[st.cur][0];
      if(st.picked.length === w.length){ const ok = st.picked.map(function(i){ return st.letters[i]; }).join('') === w; render(); if(ok){ say(w); win(root.querySelector('.eg-slots')); render(); } else tone(false); return; }
      render(); return;
    }
    if(act === 'pick' && !st.done){
      st.ans = +b.dataset.k; st.done = true;
      const right = game === 'pics' ? st.ans === st.cur : st.ans === 0;
      if(game === 'pics') say(PICS[st.cur][1]);
      render();
      if(right) win(root.querySelector('.eg-opts .ok')); else tone(false);
      render();
    }
  });
  root.addEventListener('submit', function(e){
    e.preventDefault();
    const f = e.target; if(f.dataset.form !== 'spell' || st.done) return;
    const v = f.w.value.trim(); if(!v) return;
    st.ans = v.toLowerCase() === SPELL[st.cur][0].toLowerCase(); st.done = true;
    render(); if(st.ans) win(root.querySelector('.eg-msg')); else tone(false); render();
  });
  st = { lv: 'easy' }; newRound(); render();
  // follow the page language (the language button changes html[lang])
  new MutationObserver(function(){ render(); }).observe(html, { attributes: true, attributeFilter: ['lang'] });
})();
