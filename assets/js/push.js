// Class notifications on this phone / computer (Web Push), even when the site is closed.
//   ccPush.box(el, sb)  shows a small card with an "Turn on" button and the current state.
// The public key comes from academy_settings (vapid_public); scripts/reminders.mjs creates the keys
// on its first run and sends the notifications.
(function(){
  'use strict';
  const T = function(en, ar){ return document.documentElement.lang === 'ar' ? ar : en; };
  const ok = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window && window.isSecureContext;
  const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const standalone = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;

  function css(){
    if(document.getElementById('ccPushCss')) return;
    const s = document.createElement('style'); s.id = 'ccPushCss';
    s.textContent = '.pushbox{display:flex;gap:12px;align-items:center;flex-wrap:wrap;background:#fff8ec;border:1px solid #f1dcb4;border-radius:16px;padding:14px 16px;margin:12px 0 18px;color:#3a2a10}' +
      '.pushbox.on{background:#eefaf3;border-color:#bfe8d0;color:#14532d}' +
      '.pushbox>i{font-style:normal;font-size:1.6rem}' +
      '.pushbox div{flex:1;min-width:200px}.pushbox b{display:block}.pushbox small{opacity:.85}' +
      '.pushbox button{border:0;border-radius:12px;padding:10px 16px;font:inherit;font-weight:800;cursor:pointer;background:#d7a03a;color:#2a1f0c}' +
      '.pushbox.on button{background:none;border:1px solid currentColor;color:inherit;font-weight:700}' +
      '.pushbox button:disabled{opacity:.6;cursor:default}';
    document.head.appendChild(s);
  }
  function b64u(s){
    const pad = '='.repeat((4 - s.length % 4) % 4), raw = atob((s + pad).replace(/-/g, '+').replace(/_/g, '/'));
    const out = new Uint8Array(raw.length); for(let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i); return out;
  }
  function k64(buf){ return btoa(String.fromCharCode.apply(null, new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
  async function reg(){ return (await navigator.serviceWorker.getRegistration()) || navigator.serviceWorker.register('sw.js'); }

  function paint(el, st, msg){
    const on = st === 'on';
    el.className = 'pushbox' + (on ? ' on' : '');
    const btn = st === 'off' ? '<button type="button" data-push="on">🔔 ' + T('Turn on', 'فعّل الإشعارات') + '</button>'
      : on ? '<button type="button" data-push="off">' + T('Turn off', 'إيقاف') + '</button>' : '';
    const text = {
      off: [T('Class notifications', 'إشعارات الحصص'), T('Get a notification on this device 3 hours and 15 minutes before each class — even when the site is closed.', 'يصلك إشعار على هذا الجهاز قبل كل حصة بـ٣ ساعات وبـ١٥ دقيقة — حتى لو الموقع مغلق.')],
      on: [T('Notifications are on for this device ✓', 'الإشعارات مفعّلة على هذا الجهاز ✓'), T('You will be reminded before every class.', 'سيصلك تذكير قبل كل حصة.')],
      denied: [T('Notifications are blocked', 'الإشعارات محظورة'), T('Allow notifications for this site from the 🔒 next to the address (or the phone settings), then reload.', 'اسمح بالإشعارات لهذا الموقع من 🔒 بجانب العنوان (أو من إعدادات الهاتف)، ثم أعد تحميل الصفحة.')],
      ios: [T('Notifications on iPhone', 'الإشعارات على الآيفون'), T('First add the site to your Home Screen (Share ⬆️ → Add to Home Screen), open it from the icon, then turn notifications on here.', 'أضف الموقع أولًا إلى الشاشة الرئيسية (زر المشاركة ⬆️ ← إضافة إلى الشاشة الرئيسية)، وافتحه من الأيقونة، ثم فعّل الإشعارات من هنا.')],
      no: [T('Notifications', 'الإشعارات'), T('This browser can’t show notifications. Try Chrome, Edge or Safari.', 'هذا المتصفح لا يدعم الإشعارات. جرّب Chrome أو Edge أو Safari.')]
    }[st];
    el.innerHTML = '<i>' + (on ? '🔔' : st === 'off' ? '🔕' : '⚠️') + '</i><div><b>' + text[0] + '</b><small>' + (msg || text[1]) + '</small></div>' + btn;
  }

  async function box(el, sb){
    if(!el) return;
    css();
    if(!ok){ paint(el, iOS && !standalone ? 'ios' : 'no'); return; }
    if(Notification.permission === 'denied'){ paint(el, 'denied'); return; }
    let sub = null;
    try{ sub = await (await reg()).pushManager.getSubscription(); }catch(e){}
    paint(el, sub && Notification.permission === 'granted' ? 'on' : 'off');
    if(sub && Notification.permission === 'granted') save(sb, sub).catch(function(){}); // keep it linked to whoever is signed in now
    el.onclick = async function(e){
      const b = e.target.closest('[data-push]'); if(!b) return;
      b.disabled = true;
      try{
        if(b.dataset.push === 'on'){
          const perm = await Notification.requestPermission();
          if(perm !== 'granted'){ paint(el, perm === 'denied' ? 'denied' : 'off'); return; }
          const kr = await sb.from('academy_settings').select('value').eq('key', 'vapid_public').maybeSingle();
          const key = kr.data && kr.data.value;
          if(!key){ paint(el, 'off', T('Notifications are being set up — try again in a few minutes.', 'جارٍ تجهيز الإشعارات — حاول مرة أخرى بعد بضع دقائق.')); return; }
          const r = await reg();
          const s = (await r.pushManager.getSubscription()) || await r.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64u(key) });
          await save(sb, s);
          paint(el, 'on');
          r.showNotification('Code Cademy', { body: T('Notifications are on ✓ You will be reminded before every class.', 'تم تفعيل الإشعارات ✓ سيصلك تذكير قبل كل حصة.'), icon: 'assets/img/icon-192.png', badge: 'assets/img/icon-192.png', lang: document.documentElement.lang, dir: document.documentElement.dir });
        } else {
          const s = await (await reg()).pushManager.getSubscription();
          if(s){ await sb.rpc('delete_push_subscription', { p_endpoint: s.endpoint }); await s.unsubscribe(); }
          paint(el, 'off');
        }
      }catch(err){
        paint(el, 'off', T('Could not turn on notifications: ', 'تعذّر تفعيل الإشعارات: ') + (err && err.message || err));
      }
    };
  }
  async function save(sb, s){
    const j = s.toJSON ? s.toJSON() : {};
    const keys = j.keys || { p256dh: k64(s.getKey('p256dh')), auth: k64(s.getKey('auth')) };
    const r = await sb.rpc('save_push_subscription', { p_endpoint: s.endpoint, p_p256dh: keys.p256dh, p_auth: keys.auth, p_ua: navigator.userAgent.slice(0, 200) });
    if(r.error) throw r.error;
  }
  window.ccPush = { box: box };
})();
