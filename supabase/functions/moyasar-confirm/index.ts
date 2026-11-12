// Moyasar card payments → switch the plan / course on (Supabase Edge Function "moyasar-confirm").
// Called two ways, both safe because the payment is always fetched again from Moyasar with the secret key:
//   • by the website after Moyasar sends the student back:   POST { id: "<payment id>" }
//   • by Moyasar's webhook (Dashboard → Settings → Webhooks):   POST { type: "payment_paid", data: { id, … } }
// Checks: status "paid", currency SAR, the amount equals the plan / course price, and one payment
// activates one request only (payment_ref is unique).
//
// Deploy: see MOYASAR.md. Secret needed in Supabase → Edge Functions → Secrets: MOYASAR_SECRET_KEY.
// Turn OFF "Verify JWT" for this function, so Moyasar's webhook can reach it.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const SECRET = Deno.env.get("MOYASAR_SECRET_KEY") || "";
const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });

async function payment(id: string) {
  const res = await fetch("https://api.moyasar.com/v1/payments/" + encodeURIComponent(id), {
    headers: { Authorization: "Basic " + btoa(SECRET + ":") },
  });
  if (!res.ok) throw new Error("Moyasar " + res.status);
  return await res.json();
}
const halalas = (sar: unknown) => Math.round(Number(String(sar ?? "").replace(/[^\d.]/g, "")) * 100);

async function notify(user: string, title: string, body: string) {
  await db.from("notifications").insert({ user_id: user, club: null, title, body }).then(() => {}, () => {});
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ ok: false, message: "POST only" }, 405);
  if (!SECRET) return json({ ok: false, message: "MOYASAR_SECRET_KEY is not set" }, 500);

  let body: any = {};
  try { body = await req.json(); } catch { /* empty */ }
  const id = String(body?.id || body?.data?.id || "").trim();
  if (!/^[0-9a-f-]{20,64}$/i.test(id)) return json({ ok: false, message: "Missing payment id" }, 400);

  let p: any;
  try { p = await payment(id); } catch (e) { return json({ ok: false, message: "Could not reach Moyasar: " + (e as Error).message }, 502); }
  if (p.status !== "paid") return json({ ok: false, message: "Payment status: " + p.status + (p.source?.message ? " — " + p.source.message : "") });
  if (p.currency !== "SAR") return json({ ok: false, message: "Wrong currency" });

  const kind = p.metadata?.kind, ref = Number(p.metadata?.ref);
  if (!Number.isInteger(ref) || ref <= 0) return json({ ok: false, message: "Unknown order" });

  if (kind === "plan") {
    const { data: e } = await db.from("enrollments").select("id, student_id, plan, amount, status, payment_ref").eq("id", ref).maybeSingle();
    if (!e) return json({ ok: false, message: "Order not found" });
    if (e.payment_ref === id) return json({ ok: true, kind, already: true }); // confirmed before (site + webhook)
    if (e.status !== "pending") return json({ ok: false, message: "This request is no longer waiting for payment" });
    if (halalas(e.amount) !== p.amount) return json({ ok: false, message: "The amount does not match the plan price" });
    const { error } = await db.from("enrollments").update({ status: "active", method: "card", payment_ref: id }).eq("id", ref).eq("status", "pending");
    if (error) return json({ ok: false, message: /duplicate|unique/i.test(error.message) ? "This payment was already used" : error.message });
    await notify(e.student_id, "✅ Payment received · تم الدفع", "Your plan is active — book your classes now.\nخطتك مفعّلة الآن — احجز حصصك.");
    return json({ ok: true, kind });
  }

  if (kind === "track") {
    const { data: e } = await db.from("track_enrollments").select("id, student_id, track, course, status, payment_ref").eq("id", ref).maybeSingle();
    if (!e) return json({ ok: false, message: "Order not found" });
    if (e.payment_ref === id) return json({ ok: true, kind, already: true });
    if (e.status !== "pending") return json({ ok: false, message: "This request is no longer waiting for payment" });
    const { data: s } = await db.from("academy_settings").select("value").eq("key", e.track + "_price").maybeSingle();
    const price = halalas(s?.value);
    if (!price || price !== p.amount) return json({ ok: false, message: "The amount does not match the course price" });
    const { error } = await db.from("track_enrollments").update({ status: "active", method: "card", payment_ref: id }).eq("id", ref).eq("status", "pending");
    if (error) return json({ ok: false, message: /duplicate|unique/i.test(error.message) ? "This payment was already used" : error.message });
    await notify(e.student_id, "✅ Payment received · تم الدفع", "Your course is active.\nدورتك مفعّلة الآن.");
    return json({ ok: true, kind });
  }
  return json({ ok: false, message: "Unknown order type" });
});
