// Coco — the academy's AI conversation tutor (Supabase Edge Function).
// The website sends the student's message; this function checks who is asking, takes one message
// from their daily allowance (ai_take_turn in schema.sql), asks Claude, and returns a short reply
// with a gentle correction and new words. The Anthropic key lives only here, never in the website.
//
// Deploy: see AI-TUTOR.md. Secret needed in Supabase → Edge Functions → Secrets: ANTHROPIC_API_KEY.
import Anthropic from "npm:@anthropic-ai/sdk@1.3.0";
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const MODEL = Deno.env.get("TUTOR_MODEL") || "claude-opus-5-5";
const anthropic = new Anthropic(); // reads ANTHROPIC_API_KEY

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...CORS, "Content-Type": "application/json" } });

const SCENES: Record<string, string> = {
  cafe: "You are a friendly barista at a café in London. The student is the customer ordering.",
  airport: "You are a check-in agent at an airport desk. The student is a traveller checking in.",
  doctor: "You are a kind doctor at a clinic. The student is a patient describing how they feel.",
  shop: "You are a shop assistant in a clothes shop. The student wants to buy something.",
  interview: "You are a friendly interviewer for a summer job. The student is the candidate.",
  friend: "You are a new classmate meeting the student on the first day of school.",
};

const SYSTEM = `You are Coco, a cheerful robot English tutor at Code Cademy, an English academy whose students are mostly Arabic speakers (children, teens and adults).

How you talk:
- Reply in simple, natural English that fits the student's level (given below). Short sentences; at most 3 sentences per reply.
- Keep the conversation going: end with one easy question.
- Be warm and encouraging, never boring. A little humour is welcome.
- Stay on safe, school-appropriate topics. If the student asks for something unsuitable, kindly steer back to practising English.
- If the student writes in Arabic, answer in simple English and help them say it in English.

Corrections:
- Look only at the student's latest message. If it has a real mistake (grammar, word choice, spelling), set has_mistake to true, copy the student's sentence in "original", write the corrected natural sentence in "better", and explain the fix in one short, simple Arabic sentence in "explain_ar".
- If there is no real mistake, set has_mistake to false and leave the other correction fields empty.

Also return:
- reply_ar: an Arabic translation of your reply.
- new_words: up to 3 useful English words or phrases from your reply that suit the student's level, each with a short Arabic meaning. Empty if none.
- mood: the face Coco should show — happy, thinking, proud (the student did well), curious (you asked something), or encouraging (the student struggled).`;

const SCHEMA = {
  type: "object",
  properties: {
    reply: { type: "string" },
    reply_ar: { type: "string" },
    correction: {
      type: "object",
      properties: {
        has_mistake: { type: "boolean" },
        original: { type: "string" },
        better: { type: "string" },
        explain_ar: { type: "string" },
      },
      required: ["has_mistake", "original", "better", "explain_ar"],
      additionalProperties: false,
    },
    new_words: {
      type: "array",
      items: {
        type: "object",
        properties: { word: { type: "string" }, meaning_ar: { type: "string" } },
        required: ["word", "meaning_ar"],
        additionalProperties: false,
      },
    },
    mood: { type: "string", enum: ["happy", "thinking", "proud", "curious", "encouraging"] },
  },
  required: ["reply", "reply_ar", "correction", "new_words", "mood"],
  additionalProperties: false,
};

type Turn = { role: "user" | "assistant"; text: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  // who is asking: the signed-in user's own token, so the allowance and RLS apply to them
  const auth = req.headers.get("Authorization") || "";
  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
    global: { headers: { Authorization: auth } },
  });
  const { data: userData } = await supabase.auth.getUser();
  if (!userData?.user) return json({ error: "signin" }, 401);

  let body: { level?: string; mode?: string; scene?: string; turns?: Turn[] };
  try { body = await req.json(); } catch { return json({ error: "bad_request" }, 400); }
  const turns = (Array.isArray(body.turns) ? body.turns : [])
    .filter((t) => t && (t.role === "user" || t.role === "assistant") && typeof t.text === "string" && t.text.trim())
    .slice(-12)
    .map((t) => ({ role: t.role, text: t.text.slice(0, 1200) }));
  if (!turns.length || turns[turns.length - 1].role !== "user") return json({ error: "bad_request" }, 400);
  while (turns.length && turns[0].role !== "user") turns.shift(); // the conversation must start with the student

  const { data: left, error: quotaErr } = await supabase.rpc("ai_take_turn");
  if (quotaErr) return json({ error: "setup", detail: quotaErr.message }, 500);
  if (left === -1) return json({ error: "limit" }, 429);

  const level = String(body.level || "Level 1").slice(0, 60);
  const scene = body.mode === "roleplay" && body.scene && SCENES[body.scene] ? SCENES[body.scene] : "";
  const context = `Student's level: ${level}.` + (scene ? ` Role-play: ${scene} Stay in the role, but still correct mistakes.` : " Free conversation.");

  try {
    const response = await anthropic.beta.messages.create({
      model: MODEL,
      max_tokens: 4000,
      system: SYSTEM + "\n\n" + context,
      messages: turns.map((t) => ({ role: t.role, content: t.text })),
      output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    } as any);

    if (response.stop_reason === "refusal") {
      return json({ reply: "Let's talk about something else! What did you do today?", reply_ar: "خلّينا نتكلم عن حاجة تانية! عملت إيه النهارده؟",
        correction: { has_mistake: false, original: "", better: "", explain_ar: "" }, new_words: [], mood: "encouraging", left });
    }
    const text = response.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
    const out = JSON.parse(text);
    return json({ ...out, left });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) return json({ error: "busy" }, 503);
    if (err instanceof Anthropic.AuthenticationError) return json({ error: "setup", detail: "ANTHROPIC_API_KEY is missing or wrong" }, 500);
    if (err instanceof Anthropic.APIError) return json({ error: "ai", detail: `${err.status}` }, 502);
    return json({ error: "ai", detail: String((err as Error)?.message || err).slice(0, 200) }, 502);
  }
});
