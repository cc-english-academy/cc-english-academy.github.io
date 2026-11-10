// Sends reminders every hour from .github/workflows/reminders.yml — no packages needed (Node 20+).
//   • a live class starts within 3 hours      → the student, their parents and the teacher
//   • …and again about 15 minutes before it starts (push notification + bell)
//   • French / Tech live classes (track_tasks)  → the course's students, their parents and the teacher
//   • homework is due within 24 hours, not sent → the student
//   • a plan ends within 3 days                → the student and their parents
// Every reminder is a notification in the site (bell + live pop-up), a push notification on every
// device that turned them on (table push_subscriptions; the keys are created here on the first run),
// and, if RESEND_API_KEY is set, an email too. Each one goes out once (table reminders_sent).
//
// Secrets (GitHub → Settings → Secrets and variables → Actions):
//   SUPABASE_SERVICE_ROLE_KEY  required (the same one the Instagram sync uses)
//   SUPABASE_URL               optional, defaults to the academy's project
//   RESEND_API_KEY             optional: also send the reminders by email (resend.com)
//   REMINDER_FROM              optional: sender, e.g. "Code Cademy <no-reply@your-domain.com>"
//   ACADEMY_TZ                 optional: time zone for the times in messages, default Asia/Riyadh

const SUPA = (process.env.SUPABASE_URL || 'https://orpknmkgfwmtroiqljzp.supabase.co').replace(/\/$/, '');
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const RESEND = process.env.RESEND_API_KEY || '';
const FROM = process.env.REMINDER_FROM || 'Code Cademy <onboarding@resend.dev>';
const TZ = process.env.ACADEMY_TZ || 'Asia/Riyadh';
const SITE = process.env.SITE_URL || 'https://ccdemy.com/';
const RESEND_URL = (process.env.RESEND_URL || 'https://api.resend.com').replace(/\/$/, '');

if (!KEY) {
  // not set up yet: hourly runs skip quietly instead of failing (and e-mailing) every hour;
  // a run started by hand still fails so the missing secret is obvious
  const text = 'Missing the SUPABASE_SERVICE_ROLE_KEY secret (GitHub → Settings → Secrets and variables → Actions)';
  if (process.env.GITHUB_EVENT_NAME === 'schedule') { console.log('::warning::' + text + ' — skipped.'); process.exit(0); }
  console.error(text);
  process.exit(1);
}

const headers = { apikey: KEY, 'Content-Type': 'application/json' };
if (KEY.startsWith('eyJ')) headers.Authorization = 'Bearer ' + KEY; // older JWT-style service_role keys

async function rest(path, init = {}) {
  const res = await fetch(SUPA + '/rest/v1/' + path, { ...init, headers: { ...headers, ...(init.headers || {}) } });
  if (!res.ok) throw new Error('Supabase ' + res.status + ': ' + (await res.text()).slice(0, 300));
  return res.status === 204 || res.headers.get('content-length') === '0' ? null : res.json().catch(() => null);
}
const inList = (xs) => '(' + xs.map((x) => '"' + String(x).replace(/"/g, '') + '"').join(',') + ')';
const iso = (ms) => new Date(ms).toISOString();
const time = (d) => new Date(d).toLocaleString('en-US', { timeZone: TZ, weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true });

// recipients already reminded for (kind, ref)
async function alreadySent(kind, refs) {
  if (!refs.length) return new Set();
  const rows = await rest('reminders_sent?select=ref,user_id&kind=eq.' + kind + '&ref=in.' + inList(refs));
  return new Set((rows || []).map((r) => r.ref + '|' + r.user_id));
}
async function parentsOf(studentIds) {
  if (!studentIds.length) return {};
  const rows = await rest('parent_links?select=parent_id,student_id&student_id=in.' + inList(studentIds));
  const out = {};
  (rows || []).forEach((r) => { (out[r.student_id] = out[r.student_id] || []).push(r.parent_id); });
  return out;
}

const emailCache = {};
async function emailOf(userId) {
  if (userId in emailCache) return emailCache[userId];
  let email = null;
  try {
    const res = await fetch(SUPA + '/auth/v1/admin/users/' + userId, { headers });
    if (res.ok) email = (await res.json()).email || null;
    if (email && /\.invalid$/i.test(email)) email = null; // phone accounts have no real email
  } catch (e) { /* no email: the in-site notification is enough */ }
  return (emailCache[userId] = email);
}
async function sendEmail(userId, title, body) {
  if (!RESEND) return false;
  const to = await emailOf(userId);
  if (!to) return false;
  const html = '<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#2b1d21">' +
    '<h2 style="color:#5C1A28;margin:0 0 10px">' + title + '</h2><p>' + body.replace(/\n/g, '<br>') + '</p>' +
    '<p><a href="' + SITE + '" style="color:#5C1A28">Open Code Cademy</a></p></div>';
  const res = await fetch(RESEND_URL + '/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + RESEND, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: FROM, to: [to], subject: title, html }),
  });
  if (!res.ok) console.log('Email to ' + to + ' failed: ' + res.status + ' ' + (await res.text()).slice(0, 200));
  return res.ok;
}

// ---------- push notifications (Web Push) ----------
let webpush = null, pushReady = false;
async function setupPush() {
  try { webpush = (await import('web-push')).default; } catch (e) { console.log('Push is off: the web-push package is not installed.'); return; }
  const pub = ((await rest('academy_settings?select=value&key=eq.vapid_public')) || [])[0];
  const priv = ((await rest('app_secrets?select=value&key=eq.vapid_private')) || [])[0];
  let keys = pub && priv && pub.value && priv.value ? { publicKey: pub.value, privateKey: priv.value } : null;
  if (!keys) { // first run: make the key pair; the private half stays in app_secrets (service role only)
    keys = webpush.generateVAPIDKeys();
    await rest('app_secrets?on_conflict=key', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify([{ key: 'vapid_private', value: keys.privateKey, updated_at: new Date().toISOString() }]) });
    await rest('academy_settings?on_conflict=key', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify([{ key: 'vapid_public', value: keys.publicKey, updated_at: new Date().toISOString() }]) });
    console.log('Created the push notification keys.');
  }
  webpush.setVapidDetails(SITE.replace(/\/$/, ''), keys.publicKey, keys.privateKey);
  pushReady = true;
}
async function sendPush(queue) {
  if (!pushReady || !queue.length) return 0;
  const users = [...new Set(queue.map((q) => q.user))];
  let subs = [];
  try { subs = await rest('push_subscriptions?select=endpoint,user_id,p256dh,auth&user_id=in.' + inList(users)) || []; }
  catch (e) { console.log('Push skipped (run the latest supabase/schema.sql): ' + e.message); return 0; }
  let sent = 0;
  for (const q of queue) {
    for (const sub of subs.filter((x) => x.user_id === q.user)) {
      const payload = JSON.stringify({ title: q.pushTitle || q.title, body: q.pushBody || q.body, url: q.url || SITE, tag: q.kind + '-' + q.ref, lang: 'ar', dir: 'auto' });
      try {
        await webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload, { TTL: 3 * 3600, urgency: 'high' });
        sent++;
      } catch (err) {
        if (err.statusCode === 404 || err.statusCode === 410) { // the device turned them off or the app was removed
          await rest('push_subscriptions?endpoint=eq.' + encodeURIComponent(sub.endpoint), { method: 'DELETE', headers: { Prefer: 'return=minimal' } }).catch(() => {});
        } else console.log('Push failed (' + (err.statusCode || '') + '): ' + String(err.body || err.message).slice(0, 160));
      }
    }
  }
  return sent;
}

// queue: [{ kind, ref, user, title, body, url?, email? }]
async function deliver(queue) {
  if (!queue.length) return { emails: 0, pushes: 0 };
  await rest('notifications', {
    method: 'POST', headers: { Prefer: 'return=minimal' },
    body: JSON.stringify(queue.map((q) => ({ user_id: q.user, club: null, title: q.title, body: q.body }))),
  });
  await rest('reminders_sent?on_conflict=kind,ref,user_id', {
    method: 'POST', headers: { Prefer: 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify(queue.map((q) => ({ kind: q.kind, ref: q.ref, user_id: q.user }))),
  });
  const pushes = await sendPush(queue);
  let emails = 0;
  for (const q of queue) if (q.email !== false && await sendEmail(q.user, q.title, q.body)) emails++;
  return { emails, pushes };
}

// English live classes (sessions + bookings). soon = the "starting in about 15 minutes" reminder.
async function classReminders(now, soon) {
  const kind = soon ? 'class_soon' : 'class';
  const from = soon ? now - 2 * 60000 : now + 5 * 60000, to = soon ? now + 20 * 60000 : now + 3 * 3600000;
  const sessions = await rest('sessions?select=id,title,club,starts_at,teacher_id&starts_at=gte.' + iso(from) +
    '&starts_at=lte.' + iso(to) + '&order=starts_at.asc') || [];
  if (!sessions.length) return [];
  const ids = sessions.map((s) => String(s.id));
  const bookings = await rest('bookings?select=session_id,student_id&session_id=in.' + inList(ids)) || [];
  const parents = await parentsOf([...new Set(bookings.map((b) => b.student_id))]);
  const sent = await alreadySent(kind, ids);
  const queue = [];
  const add = (s, user, who) => {
    if (!user || sent.has(s.id + '|' + user)) return;
    sent.add(s.id + '|' + user);
    const mins = Math.max(1, Math.round((new Date(s.starts_at).getTime() - now) / 60000));
    queue.push(soon ? {
      kind, ref: String(s.id), user, email: false, url: SITE + 'english.html?signin=1',
      title: '🔴 Class starting soon · الحصة تبدأ قريبًا',
      body: '“' + s.title + '” starts in about ' + mins + ' min. Open the site and press Join.\n«' + s.title + '» تبدأ بعد حوالي ' + mins + ' دقيقة. افتح الموقع واضغط «ادخل».',
      pushTitle: '🔴 الحصة تبدأ بعد ' + mins + ' دقيقة',
      pushBody: '«' + s.title + '» (' + s.club + ') — اضغط لفتح الموقع والدخول إلى الحصة.',
    } : {
      kind, ref: String(s.id), user, url: SITE + 'english.html?signin=1',
      title: '⏰ Class reminder · تذكير بالحصة',
      body: (who === 'teacher' ? 'You are teaching' : who === 'parent' ? 'Your child has' : 'You have') +
        ' “' + s.title + '” (' + s.club + ') at ' + time(s.starts_at) + '. The Join button opens 10 minutes before.\n' +
        (who === 'teacher' ? 'لديك حصة' : who === 'parent' ? 'لدى ابنك حصة' : 'لديك حصة') + ' «' + s.title + '» ' + time(s.starts_at) + '. زر الدخول يُفتح قبلها بـ 10 دقائق.',
      pushTitle: '⏰ ' + (who === 'parent' ? 'لدى ابنك حصة' : 'لديك حصة') + ' ' + time(s.starts_at),
      pushBody: '«' + s.title + '» (' + s.club + ') — زر الدخول يُفتح قبلها بـ 10 دقائق.',
    });
  };
  for (const s of sessions) {
    const booked = bookings.filter((b) => String(b.session_id) === String(s.id));
    if (!booked.length) continue;
    booked.forEach((b) => { add(s, b.student_id, 'student'); (parents[b.student_id] || []).forEach((p) => add(s, p, 'parent')); });
    add(s, s.teacher_id, 'teacher');
  }
  return queue;
}

// French / Tech live classes: track_tasks of kind "live" for the course's active students
async function trackLiveReminders(now, soon) {
  const kind = soon ? 'tlive_soon' : 'tlive';
  const from = soon ? now - 2 * 60000 : now + 5 * 60000, to = soon ? now + 20 * 60000 : now + 3 * 3600000;
  const lives = await rest('track_tasks?select=id,track,course,title,starts_at,created_by&kind=eq.live&starts_at=gte.' + iso(from) + '&starts_at=lte.' + iso(to)) || [];
  if (!lives.length) return [];
  const enrolls = await rest('track_enrollments?select=student_id,track,course&status=eq.active&track=in.' + inList([...new Set(lives.map((l) => l.track))])) || [];
  const parents = await parentsOf([...new Set(enrolls.map((e) => e.student_id))]);
  const sent = await alreadySent(kind, lives.map((l) => String(l.id)));
  const queue = [];
  for (const l of lives) {
    const name = l.track === 'french' ? 'Le Club Français' : 'Coco Tech Lab';
    const url = SITE + (l.track === 'french' ? 'french' : 'tech') + '-dashboard.html#schedule';
    const mins = Math.max(1, Math.round((new Date(l.starts_at).getTime() - now) / 60000));
    const students = [...new Set(enrolls.filter((e) => e.track === l.track && (!l.course || e.course === l.course)).map((e) => e.student_id))];
    const users = new Map();
    students.forEach((st) => { users.set(st, 'student'); (parents[st] || []).forEach((p) => { if (!users.has(p)) users.set(p, 'parent'); }); });
    if (l.created_by) users.set(l.created_by, 'teacher');
    for (const [user, who] of users) {
      if (sent.has(l.id + '|' + user)) continue;
      queue.push(soon ? {
        kind, ref: String(l.id), user, email: false, url,
        title: '🔴 ' + name + ' · الحصة تبدأ قريبًا',
        body: '“' + l.title + '” starts in about ' + mins + ' min.\n«' + l.title + '» تبدأ بعد حوالي ' + mins + ' دقيقة.',
        pushTitle: '🔴 الحصة تبدأ بعد ' + mins + ' دقيقة', pushBody: '«' + l.title + '» — ' + name + '. اضغط للدخول.',
      } : {
        kind, ref: String(l.id), user, url,
        title: '⏰ ' + name + ' · تذكير بالحصة',
        body: (who === 'parent' ? 'Your child has' : who === 'teacher' ? 'You are teaching' : 'You have') + ' “' + l.title + '” at ' + time(l.starts_at) + '.\n' +
          (who === 'parent' ? 'لدى ابنك حصة' : 'لديك حصة') + ' «' + l.title + '» ' + time(l.starts_at) + '.',
        pushTitle: '⏰ ' + (who === 'parent' ? 'لدى ابنك حصة' : 'لديك حصة') + ' ' + time(l.starts_at), pushBody: '«' + l.title + '» — ' + name,
      });
    }
  }
  return queue;
}

async function homeworkReminders(now) {
  const due = await rest('assignments?select=id,title,club,due_at&due_at=gte.' + iso(now) + '&due_at=lte.' + iso(now + 24 * 3600000)) || [];
  if (!due.length) return [];
  const ids = due.map((a) => String(a.id));
  const clubs = [...new Set(due.map((a) => a.club))];
  const students = await rest('profiles?select=id,club&role=eq.student&club=in.' + inList(clubs)) || [];
  const subs = await rest('submissions?select=assignment_id,student_id&assignment_id=in.' + inList(ids)) || [];
  const done = new Set(subs.map((s) => s.assignment_id + '|' + s.student_id));
  const sent = await alreadySent('homework', ids);
  const queue = [];
  for (const a of due) {
    for (const st of students.filter((p) => p.club === a.club)) {
      if (done.has(a.id + '|' + st.id) || sent.has(a.id + '|' + st.id)) continue;
      queue.push({
        kind: 'homework', ref: String(a.id), user: st.id,
        title: '📝 Homework due · موعد تسليم الواجب',
        body: '“' + a.title + '” is due ' + time(a.due_at) + '. You can answer with text, a photo or a voice note.\n' +
          'آخر موعد لتسليم «' + a.title + '» ' + time(a.due_at) + '. يمكنك الإجابة كتابةً أو بصورة أو تسجيل صوتي.',
      });
    }
  }
  return queue;
}

async function planReminders(now) {
  const ending = await rest('enrollments?select=id,student_id,plan,ends_at&status=eq.active&ends_at=gte.' + iso(now) +
    '&ends_at=lte.' + iso(now + 3 * 86400000)) || [];
  if (!ending.length) return [];
  const ids = ending.map((e) => String(e.id));
  const parents = await parentsOf([...new Set(ending.map((e) => e.student_id))]);
  const sent = await alreadySent('plan', ids);
  const queue = [];
  for (const e of ending) {
    for (const user of [e.student_id, ...(parents[e.student_id] || [])]) {
      if (sent.has(e.id + '|' + user)) continue;
      queue.push({
        kind: 'plan', ref: String(e.id), user,
        title: '🎟️ Plan ending soon · الخطة تنتهي قريباً',
        body: 'The plan ends on ' + time(e.ends_at) + '. Renew from “My Plan” to keep booking classes.\n' +
          'تنتهي الخطة ' + time(e.ends_at) + '. جدّدها من «خطتي» لتواصل حجز الحصص.',
      });
    }
  }
  return queue;
}

async function main() {
  const now = Date.now();
  await setupPush().catch((e) => console.log('Push setup failed: ' + e.message));
  const parts = [
    ['class', (n) => classReminders(n, false)], ['class soon', (n) => classReminders(n, true)],
    ['track live', (n) => trackLiveReminders(n, false)], ['track live soon', (n) => trackLiveReminders(n, true)],
    ['homework', homeworkReminders], ['plan', planReminders],
  ];
  let total = 0, emails = 0, pushes = 0;
  for (const [name, fn] of parts) {
    try {
      const queue = await fn(now);
      const r = await deliver(queue);
      emails += r.emails; pushes += r.pushes;
      total += queue.length;
      console.log(name + ': ' + queue.length + ' reminder(s)');
    } catch (err) {
      console.error(name + ' reminders failed: ' + err.message); // keep going with the other kinds
      process.exitCode = 1;
    }
  }
  console.log('Done: ' + total + ' reminder(s), ' + pushes + ' push notification(s), ' + emails + ' email(s)' + (RESEND ? '' : ' (email is off — add RESEND_API_KEY to turn it on)'));
}

main().catch((err) => { console.error(err.message); process.exit(1); });
