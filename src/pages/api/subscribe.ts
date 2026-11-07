// Newsletter signup → beehiiv. Runs as a Vercel Function so the API key never reaches the browser.
// Env vars (set in Vercel → Settings → Environment Variables):
//   BEEHIIV_API_KEY         secret API key from beehiiv → Settings → API
//   BEEHIIV_PUBLICATION_ID  looks like pub_xxxxxxxx
import type { APIRoute } from 'astro';

export const prerender = false;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const POST: APIRoute = async ({ request, redirect }) => {
  const isJson = (request.headers.get('accept') || '').includes('application/json');
  const respond = (status: number, body: Record<string, unknown>) =>
    isJson ? new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }) : redirect(body.ok ? '/thanks/' : '/thanks/?error=1', 303);

  let email = '';
  let source = 'website';
  let honeypot = '';
  try {
    const form = await request.formData();
    email = String(form.get('email') || '').trim().toLowerCase();
    source = String(form.get('source') || 'website').slice(0, 50);
    honeypot = String(form.get('company') || '');
  } catch {
    return respond(400, { ok: false, error: 'Bad request' });
  }

  if (honeypot) return respond(200, { ok: true }); // bots fill the hidden field; pretend success
  if (!EMAIL_RE.test(email) || email.length > 254) return respond(400, { ok: false, error: 'Please enter a valid email address.' });

  const key = import.meta.env.BEEHIIV_API_KEY ?? process.env.BEEHIIV_API_KEY;
  const pub = import.meta.env.BEEHIIV_PUBLICATION_ID ?? process.env.BEEHIIV_PUBLICATION_ID;
  if (!key || !pub) {
    console.error('subscribe: BEEHIIV_API_KEY or BEEHIIV_PUBLICATION_ID is not set');
    return respond(500, { ok: false, error: 'Signups are not set up yet. Please try again soon.' });
  }

  try {
    const res = await fetch(`https://api.beehiiv.com/v2/publications/${encodeURIComponent(pub)}/subscriptions`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        reactivate_existing: true,
        send_welcome_email: true,
        utm_source: 'vegasvetted.com',
        utm_medium: 'website',
        utm_campaign: source,
        referring_site: 'https://vegasvetted.com',
      }),
    });
    if (!res.ok) {
      console.error('subscribe: beehiiv error', res.status, await res.text());
      return respond(502, { ok: false, error: 'Something went wrong. Please try again.' });
    }
    return respond(200, { ok: true });
  } catch (err) {
    console.error('subscribe: request failed', err);
    return respond(502, { ok: false, error: 'Something went wrong. Please try again.' });
  }
};
