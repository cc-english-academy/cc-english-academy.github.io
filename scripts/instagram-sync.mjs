// Copies the academy's latest Instagram videos into Supabase (table instagram_posts).
// Runs every hour from .github/workflows/instagram-sync.yml — no packages needed (Node 20+).
//
// Secrets (GitHub → Settings → Secrets and variables → Actions):
//   SUPABASE_SERVICE_ROLE_KEY  the project's service_role / secret key (never put it in the website)
//   SUPABASE_URL               optional, defaults to the academy's project
// The Instagram access token itself is saved by the admin from the website (Videos → Instagram).

const SUPA = (process.env.SUPABASE_URL || 'https://orpknmkgfwmtroiqljzp.supabase.co').replace(/\/$/, '');
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const GRAPH = (process.env.GRAPH_URL || 'https://graph.instagram.com').replace(/\/$/, '');
const REFRESH_AFTER_DAYS = 7; // tokens last 60 days; renew them well before that

if (!KEY) {
  console.error('Missing the SUPABASE_SERVICE_ROLE_KEY secret — see INSTAGRAM.md.');
  process.exit(1);
}

const headers = { apikey: KEY, 'Content-Type': 'application/json' };
if (KEY.startsWith('eyJ')) headers.Authorization = 'Bearer ' + KEY; // older JWT-style service_role keys

async function rest(path, init = {}) {
  const res = await fetch(SUPA + '/rest/v1/' + path, { ...init, headers: { ...headers, ...(init.headers || {}) } });
  if (!res.ok) throw new Error('Supabase ' + res.status + ': ' + (await res.text()).slice(0, 300));
  return res.status === 204 || res.headers.get('content-length') === '0' ? null : res.json().catch(() => null);
}
async function graph(path) {
  const res = await fetch(GRAPH + path);
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.error) throw new Error('Instagram: ' + ((body.error && body.error.message) || res.status));
  return body;
}
const saveSecret = (key, value) => rest('app_secrets?on_conflict=key', {
  method: 'POST',
  headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
  body: JSON.stringify({ key, value, updated_at: new Date().toISOString() }),
});
const setStatus = (status) => saveSecret('instagram_status', JSON.stringify({ ...status, last_sync_at: new Date().toISOString() }));

async function main() {
  const rows = await rest('app_secrets?key=eq.instagram_token&select=value,updated_at');
  if (!rows || !rows.length || !rows[0].value) {
    await setStatus({ ok: false, error: 'No Instagram token saved yet' });
    console.log('No Instagram token saved yet — nothing to do.');
    return;
  }
  let token = rows[0].value;

  // keep the 60-day token alive
  const ageDays = (Date.now() - new Date(rows[0].updated_at).getTime()) / 864e5;
  if (ageDays > REFRESH_AFTER_DAYS) {
    const r = await graph('/refresh_access_token?grant_type=ig_refresh_token&access_token=' + encodeURIComponent(token));
    if (r.access_token) { token = r.access_token; await saveSecret('instagram_token', token); console.log('Token renewed.'); }
  }

  const media = await graph('/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=50&access_token=' + encodeURIComponent(token));
  const videos = (media.data || []).filter((m) => m.media_type === 'VIDEO');
  const now = new Date().toISOString();
  const posts = videos.map((m) => ({
    id: String(m.id),
    caption: m.caption || null,
    media_url: m.media_url || null,          // missing for some Reels (copyrighted music) — the site links to Instagram instead
    thumbnail_url: m.thumbnail_url || null,
    permalink: m.permalink || null,
    posted_at: m.timestamp || null,
    synced_at: now,
  }));

  if (posts.length) {
    await rest('instagram_posts?on_conflict=id', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify(posts),
    });
    // remove videos that were deleted on Instagram
    const keep = posts.map((p) => '"' + p.id.replace(/"/g, '') + '"').join(',');
    await rest('instagram_posts?id=not.in.(' + keep + ')', { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
  }
  await setStatus({ ok: true, videos: posts.length });
  console.log('Synced ' + posts.length + ' Instagram videos.');
}

main().catch(async (err) => {
  console.error(err.message);
  try { await setStatus({ ok: false, error: err.message.slice(0, 300) }); } catch (e) { /* ignore */ }
  process.exit(1);
});
