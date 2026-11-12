// Card payments with Moyasar (mada, Visa, Mastercard), shared by the English page and the French / Tech dashboards.
//   ccPay.key(sb)                          → the publishable key the admin saved (academy_settings.moyasar_pk) or ''
//   ccPay.form(el, sb, { kind, ref, amount, description })   shows the Moyasar card form in el
//   ccPay.handleReturn(sb, done)           after Moyasar sends the student back: confirms the payment
// The card is typed into Moyasar's own form (never stored here). The server (Edge Function "moyasar-confirm")
// asks Moyasar whether the payment really succeeded, checks the amount, and only then switches the plan on.
(function(){
  'use strict';
  const MPF = 'https://cdn.jsdelivr.net/npm/moyasar-payment-form@2.2.14/dist/';
  const T = function(en, ar){ return document.documentElement.lang === 'ar' ? ar : en; };
  let keyCache = null, loading = null;
  (function css(){
    const st = document.createElement('style');
    st.textContent = '.pay-test{background:#fff6dd;border:1px solid #f0d58a;color:#6b4e00;border-radius:10px;padding:8px 12px;font-size:.85rem;margin:6px 0}' +
      '.pay-secure{color:#2f6b4f;font-size:.82rem;margin:6px 0 10px}.pay-err{color:#b42318;font-weight:700}.pay-wait{color:#777}' +
      '.mysr-form{max-width:420px;margin:0 auto 10px}';
    document.head.appendChild(st);
  })();

  async function key(sb){
    if(keyCache !== null) return keyCache;
    try{
      const r = await sb.from('academy_settings').select('value').eq('key', 'moyasar_pk').maybeSingle();
      keyCache = (r.data && r.data.value || '').trim();
    }catch(e){ keyCache = ''; }
    return keyCache;
  }
  function load(){
    if(window.Moyasar) return Promise.resolve();
    if(loading) return loading;
    loading = new Promise(function(res, rej){
      const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = MPF + 'moyasar.css'; document.head.appendChild(l);
      const s = document.createElement('script'); s.src = MPF + 'moyasar.umd.js'; s.onload = res; s.onerror = function(){ loading = null; rej(new Error('Moyasar did not load')); };
      document.head.appendChild(s);
    });
    return loading;
  }
  // where Moyasar sends the student back (it adds ?id=…&status=…&message=…)
  function backUrl(){ const u = new URL(location.href); u.search = ''; u.hash = ''; u.searchParams.set('mpay', '1'); return u.toString(); }

  async function form(el, sb, o){
    const pk = await key(sb);
    if(!pk){ el.innerHTML = '<p class="pay-err">' + T('Card payment is not set up yet.', 'الدفع بالبطاقة غير مفعّل بعد.') + '</p>'; return; }
    el.innerHTML = '<p class="pay-wait">' + T('Loading the secure payment form…', 'جارٍ تحميل نموذج الدفع الآمن…') + '</p>';
    try{ await load(); }catch(e){ el.innerHTML = '<p class="pay-err">' + T('The payment form could not load. Check your internet and try again.', 'تعذّر تحميل نموذج الدفع. تأكد من الإنترنت وحاول مرة أخرى.') + '</p>'; return; }
    const box = document.createElement('div'); box.className = 'mysr-form';
    el.innerHTML = (pk.indexOf('pk_test_') === 0 ? '<p class="pay-test">🧪 ' + T('Test mode: use a Moyasar test card — no real money is taken.', 'وضع التجربة: استخدم بطاقة تجربة من ميسر — لا تُخصم أموال حقيقية.') + '</p>' : '') +
      '<p class="pay-secure">🔒 ' + T('Secure payment by Moyasar. Your card details go straight to Moyasar, not to this site.', 'دفع آمن عبر ميسر. بيانات بطاقتك تذهب مباشرة إلى ميسر وليس إلى هذا الموقع.') + '</p>';
    el.appendChild(box);
    try{ sessionStorage.setItem('cc_pay_back', location.pathname + location.hash); }catch(e){}
    window.Moyasar.init({
      element: box,
      amount: Math.round(Number(o.amount) * 100),   // in halalas
      currency: 'SAR',
      description: String(o.description || 'Code Cademy').slice(0, 250),
      publishable_api_key: pk,
      callback_url: backUrl(),
      methods: ['creditcard'],
      supported_networks: ['mada', 'visa', 'mastercard'],
      language: document.documentElement.lang === 'ar' ? 'ar' : 'en',
      metadata: { kind: o.kind, ref: String(o.ref) }
    });
  }

  // the student is back from Moyasar (or its 3-D Secure page): confirm on the server, then tidy the address
  async function handleReturn(sb, done){
    const q = new URLSearchParams(location.search);
    if(!q.get('mpay') || !q.get('id')) return false;
    const id = q.get('id'), status = q.get('status'), message = q.get('message') || '';
    const clean = function(){ const u = new URL(location.href); ['mpay', 'id', 'status', 'message'].forEach(function(k){ u.searchParams.delete(k); }); history.replaceState(null, '', u.pathname + u.search + u.hash); };
    if(status && status !== 'paid'){ clean(); done({ ok: false, message: message || T('The payment did not go through.', 'لم تتم عملية الدفع.') }); return true; }
    let res = null;
    try{
      const r = await sb.functions.invoke('moyasar-confirm', { body: { id: id } });
      res = r.error ? { ok: false, message: r.error.message } : r.data;
    }catch(e){ res = { ok: false, message: e.message }; }
    clean();
    done(res && res.ok ? { ok: true, kind: res.kind, message: T('Payment received ✓ Your subscription is active now.', 'تم الدفع ✓ اشتراكك مفعّل الآن.') }
      : { ok: false, message: (res && res.message) || T('We could not confirm the payment yet. If money was taken, message us and we will activate it.', 'لم نتمكن من تأكيد الدفع بعد. إذا خُصم المبلغ، راسلنا وسنفعّل اشتراكك.') });
    return true;
  }
  window.ccPay = { key: key, form: form, handleReturn: handleReturn };
})();
