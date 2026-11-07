// Code Cademy room: a video class inside the site (like Zoom / Google Meet).
// Video and audio go straight between the browsers (WebRTC, one connection per pair: best for up to ~8 people).
// Supabase Realtime only passes the small "how do I reach you" messages, the chat and who is in the room.
(function(){
  'use strict';
  const SB_URL = 'https://orpknmkgfwmtroiqljzp.supabase.co';
  const SB_KEY = 'sb_publishable_x7AQ0xQl8qqOH3iDKqxddg_-7fbStUh';
  // Public STUN servers find each browser's address. Some strict networks also need a TURN relay:
  // put its details in TURN below (for example from metered.ca or Cloudflare Calls) and every room uses it.
  const TURN = null; // { urls: ['turn:…:443?transport=tcp'], username: '…', credential: '…' }
  const ICE = [{ urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302', 'stun:stun.cloudflare.com:3478'] }].concat(TURN ? [TURN] : []);

  const html = document.documentElement;
  const $ = function(id){ return document.getElementById(id); };
  const T = function(en, ar){ return html.lang === 'ar' ? ar : en; };
  const esc = function(s){ return String(s == null ? '' : s).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  const store = { get: function(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }, set: function(k, v){ try{ localStorage.setItem(k, v); }catch(e){} } };
  const hex = function(n){ const a = new Uint8Array(n); crypto.getRandomValues(a); return Array.prototype.map.call(a, function(b){ return ('0' + b.toString(16)).slice(-2); }).join(''); };

  // ---------- room id ----------
  const params = new URLSearchParams(location.search);
  let roomId = (params.get('r') || '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 64);
  if(!roomId){ roomId = hex(9); history.replaceState(null, '', location.pathname + '?r=' + roomId); }
  const inviteLink = location.origin + location.pathname + '?r=' + roomId;
  const me = { id: hex(8), name: '', mic: true, cam: true, hand: false, screen: false };

  // ---------- local media ----------
  let local = null, camTrack = null, screenTrack = null, mediaReady = null;
  async function getMedia(){
    try{
      local = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true }, video: { width: { ideal: 640 }, height: { ideal: 360 }, frameRate: { ideal: 24 } } });
    }catch(e){
      try{ local = await navigator.mediaDevices.getUserMedia({ audio: true }); me.cam = false; }
      catch(e2){ local = new MediaStream(); me.mic = false; me.cam = false; $('lobbyNote').textContent = T('No camera or microphone allowed — you can still watch, listen and chat.', 'لم يُسمح بالكاميرا أو الميكروفون — يمكنك المشاهدة والاستماع والدردشة.'); }
    }
    camTrack = local.getVideoTracks()[0] || null;
    $('preview').srcObject = local;
    syncButtons();
  }

  // ---------- signalling (Supabase Realtime, or a local test transport) ----------
  function supabaseTransport(onMsg, onPeers){
    const sb = supabase.createClient(SB_URL, SB_KEY);
    const ch = sb.channel('cc-room-' + roomId, { config: { broadcast: { self: false }, presence: { key: me.id } } });
    ch.on('broadcast', { event: 'm' }, function(p){ onMsg(p.payload); });
    ch.on('presence', { event: 'sync' }, function(){ onPeers(Object.keys(ch.presenceState())); });
    return new Promise(function(res, rej){
      ch.subscribe(async function(status){
        if(status === 'SUBSCRIBED'){ await ch.track({ name: me.name }); res({ send: function(m){ ch.send({ type: 'broadcast', event: 'm', payload: m }); }, leave: function(){ ch.untrack(); sb.removeChannel(ch); } }); }
        else if(status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') rej(new Error(status));
      });
    });
  }
  const transport = window.__ccRoomTransport || supabaseTransport;
  let net = null;

  // ---------- peers ----------
  const peers = {}; // id -> { pc, stream, name, mic, cam, hand, screen, queue: [] }
  function peer(id){
    if(peers[id]) return peers[id];
    const pc = new RTCPeerConnection({ iceServers: ICE });
    const p = peers[id] = { pc: pc, stream: new MediaStream(), name: '…', mic: true, cam: true, hand: false, screen: false, queue: [], polite: me.id > id, making: false, ignore: false };
    local.getTracks().forEach(function(t){ pc.addTrack(t, local); });
    if(!local.getAudioTracks().length) pc.addTransceiver('audio', { direction: 'recvonly' });
    if(!local.getVideoTracks().length) pc.addTransceiver('video', { direction: 'recvonly' });
    pc.ontrack = function(e){ if(!p.stream.getTracks().includes(e.track)) p.stream.addTrack(e.track); render(); watchVoice(id, p.stream); };
    pc.onicecandidate = function(e){ if(e.candidate) net.send({ t: 'ice', from: me.id, to: id, c: e.candidate }); };
    pc.onnegotiationneeded = async function(){
      try{ p.making = true; await pc.setLocalDescription(); net.send({ t: 'sdp', from: me.id, to: id, d: pc.localDescription }); }
      catch(e){ console.warn(e); } finally{ p.making = false; }
    };
    pc.onconnectionstatechange = function(){ if(pc.connectionState === 'failed') pc.restartIce(); render(); };
    setTimeout(function(){ sendState(id); }, 0); // tell every new peer our name and mic/camera state
    render();
    return p;
  }
  function drop(id){ const p = peers[id]; if(!p) return; try{ p.pc.close(); }catch(e){} delete peers[id]; stopVoice(id); render(); }

  async function onMsg(m){
    if(!m || m.from === me.id) return;
    if(m.to && m.to !== me.id) return;
    if(m.t === 'hello' || m.t === 'state'){
      const p = peer(m.from); p.name = m.name || p.name; p.mic = m.mic; p.cam = m.cam; p.hand = m.hand; p.screen = m.screen;
      if(m.t === 'hello') sendState(m.from);
      render(); return;
    }
    if(m.t === 'chat'){ addChat(m.name, m.text, false); return; }
    if(m.t === 'sdp'){
      const p = peer(m.from), pc = p.pc, d = m.d;
      const collision = d.type === 'offer' && (p.making || pc.signalingState !== 'stable');
      p.ignore = !p.polite && collision;
      if(p.ignore) return;
      await pc.setRemoteDescription(d);
      while(p.queue.length) await pc.addIceCandidate(p.queue.shift()).catch(function(){});
      if(d.type === 'offer'){ await pc.setLocalDescription(); net.send({ t: 'sdp', from: me.id, to: m.from, d: pc.localDescription }); }
      return;
    }
    if(m.t === 'ice'){
      const p = peer(m.from);
      if(!p.pc.remoteDescription) p.queue.push(m.c);
      else await p.pc.addIceCandidate(m.c).catch(function(e){ if(!p.ignore) console.warn(e); });
    }
  }
  function onPeers(ids){
    ids.forEach(function(id){ if(id !== me.id && !peers[id]) peer(id); });
    Object.keys(peers).forEach(function(id){ if(ids.indexOf(id) < 0) drop(id); });
  }
  function sendState(to){ net && net.send({ t: 'state', from: me.id, to: to || null, name: me.name, mic: me.mic, cam: me.cam, hand: me.hand, screen: me.screen }); }

  // ---------- who is speaking ----------
  let actx = null; const meters = {};
  function watchVoice(id, stream){
    if(meters[id] || !stream.getAudioTracks().length) return;
    try{
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      const src = actx.createMediaStreamSource(stream), an = actx.createAnalyser(); an.fftSize = 512; src.connect(an);
      meters[id] = { an: an, buf: new Uint8Array(an.frequencyBinCount) };
    }catch(e){}
  }
  function stopVoice(id){ delete meters[id]; }
  setInterval(function(){
    Object.keys(meters).forEach(function(id){
      const m = meters[id]; m.an.getByteFrequencyData(m.buf); let s = 0; for(let i = 0; i < m.buf.length; i++) s += m.buf[i];
      const tile = document.querySelector('.tile[data-id="' + id + '"]'); if(tile) tile.classList.toggle('talk', s / m.buf.length > 18);
    });
  }, 200);

  // ---------- render ----------
  function initials(n){ return (n || '?').trim().split(/\s+/).map(function(w){ return w[0]; }).slice(0, 2).join('').toUpperCase(); }
  function tileHTML(id, name, mic, cam, hand, mine, screen){
    return '<div class="tile' + (mine ? ' me' : '') + (screen ? ' share' : '') + '" data-id="' + id + '"><video autoplay playsinline' + (mine ? ' muted' : '') + '></video>' +
      '<div class="ava"' + (cam ? ' hidden' : '') + '><b>' + esc(initials(name)) + '</b></div>' +
      '<div class="tag">' + (hand ? '<i class="hand">✋</i>' : '') + (mic ? '' : '<i class="muted">🔇</i>') + '<span><bdi>' + esc(name) + '</bdi>' + (mine ? ' (' + T('you', 'أنت') + ')' : '') + '</span></div></div>';
  }
  function render(){
    const grid = $('grid'); if(!grid) return;
    const ids = Object.keys(peers);
    const want = ['me'].concat(ids);
    // rebuild only the tiles whose details changed, so the videos keep playing
    want.forEach(function(id){
      const mine = id === 'me', p = mine ? me : peers[id];
      const key = [p.name, p.mic, p.cam, p.hand, p.screen].join('|');
      let el = grid.querySelector('.tile[data-id="' + id + '"]');
      if(!el || el.dataset.key !== key){
        const tmp = document.createElement('div'); tmp.innerHTML = tileHTML(id, p.name, p.mic, mine ? (me.cam || me.screen) : p.cam || p.screen, p.hand, mine, p.screen);
        const nu = tmp.firstChild; nu.dataset.key = key;
        if(el) grid.replaceChild(nu, el); else grid.appendChild(nu);
        el = nu;
      }
      const v = el.querySelector('video'), src = mine ? local : p.stream;
      if(v.srcObject !== src) v.srcObject = src;
    });
    Array.prototype.slice.call(grid.querySelectorAll('.tile')).forEach(function(el){ if(want.indexOf(el.dataset.id) < 0) el.remove(); });
    const n = want.length;
    grid.style.setProperty('--cols', n <= 1 ? 1 : n <= 4 ? 2 : n <= 9 ? 3 : 4);
    grid.classList.toggle('has-share', !!grid.querySelector('.tile.share'));
    $('count').textContent = n;
    $('people').innerHTML = want.map(function(id){ const p = id === 'me' ? me : peers[id]; return '<li>' + (p.hand ? '✋ ' : '') + esc(p.name) + (id === 'me' ? ' (' + T('you', 'أنت') + ')' : '') + '<span>' + (p.mic ? '🎙️' : '🔇') + (p.cam ? '📷' : '🚫') + '</span></li>'; }).join('');
  }

  // ---------- controls ----------
  function syncButtons(){
    const set = function(id, on, onTxt, offTxt){ const b = $(id); if(!b) return; b.classList.toggle('off', !on); b.setAttribute('aria-pressed', String(on)); const s = b.querySelector('span'); if(s) s.textContent = on ? onTxt : offTxt; };
    set('btnMic', me.mic, T('Mute', 'كتم'), T('Unmute', 'تشغيل الصوت'));
    set('btnCam', me.cam, T('Stop video', 'إيقاف الكاميرا'), T('Start video', 'تشغيل الكاميرا'));
    set('lbMic', me.mic, T('Mic on', 'الميكروفون يعمل'), T('Mic off', 'الميكروفون مغلق'));
    set('lbCam', me.cam, T('Camera on', 'الكاميرا تعمل'), T('Camera off', 'الكاميرا مغلقة'));
    const hb = $('btnHand'); if(hb){ hb.classList.toggle('on', me.hand); }
    const sb = $('btnShare'); if(sb){ sb.classList.toggle('on', me.screen); sb.querySelector('span').textContent = me.screen ? T('Stop sharing', 'إيقاف المشاركة') : T('Share screen', 'مشاركة الشاشة'); }
  }
  function toggleMic(){ me.mic = !me.mic; local.getAudioTracks().forEach(function(t){ t.enabled = me.mic; }); syncButtons(); sendState(); render(); }
  function toggleCam(){ if(!camTrack){ toast(T('No camera found.', 'لا توجد كاميرا.')); return; } me.cam = !me.cam; camTrack.enabled = me.cam; syncButtons(); sendState(); render(); }
  function videoSenders(){ return Object.keys(peers).map(function(id){ return peers[id].pc.getSenders().find(function(s){ return s.track && s.track.kind === 'video'; }) || peers[id].pc.getSenders().find(function(s){ return !s.track; }); }).filter(Boolean); }
  async function toggleShare(){
    if(me.screen){ stopShare(); return; }
    if(!navigator.mediaDevices.getDisplayMedia){ toast(T('Screen sharing works on a computer browser.', 'مشاركة الشاشة تعمل من متصفح الحاسوب.')); return; }
    try{ screenTrack = (await navigator.mediaDevices.getDisplayMedia({ video: { frameRate: 15 } })).getVideoTracks()[0]; }catch(e){ return; }
    screenTrack.onended = stopShare;
    if(camTrack){ videoSenders().forEach(function(s){ s.replaceTrack(screenTrack); }); local.removeTrack(camTrack); }
    else Object.keys(peers).forEach(function(id){ peers[id].pc.addTrack(screenTrack, local); });
    local.addTrack(screenTrack);
    me.screen = true; syncButtons(); sendState(); render();
  }
  function stopShare(){
    if(!screenTrack) return;
    const st = screenTrack; screenTrack = null; st.onended = null; st.stop();
    local.removeTrack(st);
    if(camTrack){ local.addTrack(camTrack); videoSenders().forEach(function(s){ s.replaceTrack(camTrack); }); }
    me.screen = false; syncButtons(); sendState(); render();
  }
  function toggleHand(){ me.hand = !me.hand; syncButtons(); sendState(); render(); }

  // ---------- chat ----------
  let unread = 0;
  function addChat(name, text, mine){
    const box = $('msgs'); const at = new Date().toLocaleTimeString(html.lang === 'ar' ? 'ar' : 'en', { hour: '2-digit', minute: '2-digit' });
    box.insertAdjacentHTML('beforeend', '<div class="msg' + (mine ? ' mine' : '') + '"><b>' + esc(mine ? T('You', 'أنت') : name) + ' <small>' + at + '</small></b><p>' + esc(text).replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>') + '</p></div>');
    box.scrollTop = box.scrollHeight;
    if(!mine && !document.body.classList.contains('chat-open')){ unread++; $('unread').textContent = unread; $('unread').hidden = false; }
  }
  function openPanel(which){
    const cur = document.body.dataset.panel;
    const next = cur === which ? '' : which;
    document.body.dataset.panel = next;
    document.body.classList.toggle('chat-open', next === 'chat');
    if(next === 'chat'){ unread = 0; $('unread').hidden = true; setTimeout(function(){ $('chatIn').focus(); }, 50); }
  }

  let toastT = 0;
  function toast(msg){ const t = $('toast'); t.textContent = msg; t.hidden = false; clearTimeout(toastT); toastT = setTimeout(function(){ t.hidden = true; }, 2600); }

  // ---------- join / leave ----------
  async function join(){
    me.name = ($('nameIn').value || '').trim().slice(0, 40) || T('Guest', 'ضيف');
    if(mediaReady) await mediaReady;
    store.set('cc_room_name', me.name);
    $('joinBtn').disabled = true; $('joinBtn').textContent = T('Joining…', 'جارٍ الدخول…');
    try{ net = await transport(onMsg, onPeers); }
    catch(e){ $('joinBtn').disabled = false; $('joinBtn').textContent = T('Join now', 'ادخل الآن'); $('lobbyNote').textContent = T('Could not reach the room. Check your internet and try again.', 'تعذّر الوصول إلى الغرفة. تأكد من الإنترنت وحاول مرة أخرى.'); return; }
    document.body.classList.add('in-room');
    $('preview').srcObject = null;
    net.send({ t: 'hello', from: me.id, name: me.name, mic: me.mic, cam: me.cam, hand: me.hand, screen: me.screen });
    render(); syncButtons();
    window.addEventListener('beforeunload', leaveQuiet);
  }
  function leaveQuiet(){ try{ net && net.leave(); }catch(e){} Object.keys(peers).forEach(drop); }
  function leave(){
    leaveQuiet();
    if(local) local.getTracks().forEach(function(t){ t.stop(); });
    if(screenTrack) screenTrack.stop();
    document.body.classList.remove('in-room'); document.body.classList.add('left');
  }

  // ---------- language ----------
  function applyLang(l){ html.lang = l; html.dir = l === 'ar' ? 'rtl' : 'ltr'; syncButtons(); render(); }
  const savedLang = store.get('cc_ui_lang'); applyLang(savedLang === 'en' ? 'en' : 'ar');

  // ---------- wire up ----------
  $('roomCode').textContent = roomId;
  $('nameIn').value = store.get('cc_room_name') || '';
  $('lbMic').onclick = function(){ if(local) toggleMic(); };
  $('lbCam').onclick = function(){ if(local) toggleCam(); };
  $('joinForm').onsubmit = function(e){ e.preventDefault(); join(); };
  $('btnMic').onclick = toggleMic; $('btnCam').onclick = toggleCam; $('btnShare').onclick = toggleShare; $('btnHand').onclick = toggleHand;
  $('btnChat').onclick = function(){ openPanel('chat'); };
  $('btnPeople').onclick = function(){ openPanel('people'); };
  Array.prototype.forEach.call(document.querySelectorAll('[data-close]'), function(b){ b.onclick = function(){ openPanel(''); }; });
  $('btnLeave').onclick = leave;
  $('rejoin').onclick = function(){ location.reload(); };
  Array.prototype.forEach.call(document.querySelectorAll('[data-copy]'), function(b){ b.onclick = async function(){
    try{ await navigator.clipboard.writeText(inviteLink); toast(T('Invite link copied ✓', 'تم نسخ رابط الدعوة ✓')); }
    catch(e){ prompt(T('Copy this link:', 'انسخ هذا الرابط:'), inviteLink); }
  }; });
  $('chatForm').onsubmit = function(e){ e.preventDefault(); const v = $('chatIn').value.trim(); if(!v || !net) return; net.send({ t: 'chat', from: me.id, name: me.name, text: v.slice(0, 1000) }); addChat(me.name, v, true); $('chatIn').value = ''; };
  $('langBtn').onclick = function(){ const l = html.lang === 'ar' ? 'en' : 'ar'; store.set('cc_ui_lang', l); applyLang(l); };
  document.addEventListener('keydown', function(e){
    if(!document.body.classList.contains('in-room') || e.target.closest('input,textarea')) return;
    if(e.key === 'm' || e.key === 'M') toggleMic();
    if(e.key === 'v' || e.key === 'V') toggleCam();
  });
  if(!window.RTCPeerConnection || !navigator.mediaDevices){ $('lobbyNote').textContent = T('This browser cannot join video rooms. Use Chrome, Edge, Safari or Firefox.', 'هذا المتصفح لا يدعم غرف الفيديو. استخدم Chrome أو Edge أو Safari أو Firefox.'); $('joinBtn').disabled = true; }
  else mediaReady = getMedia();
})();
