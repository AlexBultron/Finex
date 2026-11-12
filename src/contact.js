// Vercel serverless function: POST /api/contact
// Receives the contact-form answers and sends them to your WhatsApp through the
// WhatsApp Business Cloud API. The access token lives ONLY in Vercel environment
// variables, never in the website code.
//
// Required environment variables (Vercel > Project > Settings > Environment Variables):
//   WHATSAPP_TOKEN     your access token
//   WHATSAPP_PHONE_ID  the Phone number ID (the number that SENDS the message)
//   WHATSAPP_TO        the number that RECEIVES the inquiries, digits only, e.g. 639171222015
// Optional:
//   WHATSAPP_TEMPLATE  approved template name (default: new_inquiry)
//   WHATSAPP_LANG      template language code (default: en)
//   WHATSAPP_API_VERSION  Graph API version (default: v25.0)

const clean = (value, max = 200) =>
  String(value ?? '')
    .replace(/[\r\n\t]+/g, ' ') // template variables cannot contain new lines or tabs
    .replace(/ {4,}/g, '   ')   // ...or 4+ spaces in a row
    .trim()
    .slice(0, max);

const orDash = (v) => v || '-';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { WHATSAPP_TOKEN, WHATSAPP_PHONE_ID, WHATSAPP_TO } = process.env;
  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID || !WHATSAPP_TO) {
    console.error('Missing WhatsApp environment variables');
    return res.status(500).json({ ok: false, error: 'Server is not configured' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Spam trap: real visitors never fill this hidden field.
  if (body.website) return res.status(200).json({ ok: true });

  const name = clean(body.name, 80);
  const company = clean(body.company, 120);
  const phone = clean(body.phone, 40);
  const inquiry = clean(body.inquiry, 80);
  if (!name || !company || !inquiry || !/^[+()\d\s-]{7,}$/.test(phone)) {
    return res.status(400).json({ ok: false, error: 'Please complete the form.' });
  }

  const details = [
    ['Business', body.business],
    ['Years in business', body.years],
    ['Amount', body.amount],
    ['Use of funds', body.purpose],
    ['Timeline', body.timeline],
    ['Notes', body.notes]
  ]
    .map(([label, v]) => [label, clean(v, 300)])
    .filter(([, v]) => v)
    .map(([label, v]) => `${label}: ${v}`)
    .join(' | ');

  const template = process.env.WHATSAPP_TEMPLATE || 'new_inquiry';
  const payload = {
    messaging_product: 'whatsapp',
    to: String(WHATSAPP_TO).replace(/\D/g, ''),
    type: 'template',
    template: {
      name: template,
      language: { code: process.env.WHATSAPP_LANG || 'en' }
    }
  };

  // "hello_world" (the built-in test template) takes no variables, so only
  // add them for your own template.
  if (template !== 'hello_world') {
    payload.template.components = [{
      type: 'body',
      parameters: [name, company, phone, inquiry, details].map((text) => ({ type: 'text', text: orDash(text) }))
    }];
  }

  try {
    const version = process.env.WHATSAPP_API_VERSION || 'v25.0';
    const r = await fetch(`https://graph.facebook.com/${version}/${WHATSAPP_PHONE_ID}/messages`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!r.ok) {
      const detail = await r.text();
      console.error('WhatsApp API error', r.status, detail); // visible in Vercel logs only
      return res.status(502).json({ ok: false, error: 'Could not send right now.' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('WhatsApp request failed', err);
    return res.status(502).json({ ok: false, error: 'Could not send right now.' });
  }
}