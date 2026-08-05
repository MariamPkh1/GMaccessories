import { createClient } from 'npm:@supabase/supabase-js@2'

// Emails the shop owner whenever a customer places an order request.
//
// Called by the `order_items_notify_order` Postgres trigger, not by the browser,
// so that an order can never commit without a notification being queued.
//
// verify_jwt is disabled for this function because its caller is a database
// trigger, which has no user session to present. Authentication is instead a
// shared secret held in Vault and checked below -- without that check the
// function URL alone would be enough to send mail on the shop's behalf.

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

// Constant-time compare so a wrong secret can't be recovered by timing how long
// the rejection takes.
function secretsMatch(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

const gel = (n: unknown) => `${Number(n ?? 0).toFixed(2)} ₾`

// Order data is customer-supplied (name, phone, notes), so every value is
// escaped before going into the HTML body.
const esc = (s: unknown) =>
  String(s ?? '').replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string,
  )

interface OrderItem {
  quantity: number
  price_at_order: number
  size: string | null
  products: { title_ka: string | null } | null
}

function buildHtml(
  order: Record<string, unknown>,
  items: OrderItem[],
  customerEmail: string | null,
  siteUrl: string | null,
): string {
  const total = items.reduce((sum, i) => sum + Number(i.price_at_order) * i.quantity, 0)
  const placed = new Date(String(order.created_at)).toLocaleString('ka-GE', {
    timeZone: 'Asia/Tbilisi',
  })

  const rows = items
    .map(
      (i) => `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb">
            ${esc(i.products?.title_ka ?? 'პროდუქტი')}
            ${i.size ? `<br><span style="color:#6b7280;font-size:12px">ზომა: ${esc(i.size)}</span>` : ''}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center">${i.quantity}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right">${gel(i.price_at_order)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600">${gel(Number(i.price_at_order) * i.quantity)}</td>
        </tr>`,
    )
    .join('')

  const contactRow = (label: string, value: unknown) =>
    value
      ? `<tr><td style="padding:4px 0;color:#6b7280;width:150px">${label}</td><td style="padding:4px 0;color:#111827;font-weight:600">${esc(value)}</td></tr>`
      : ''

  return `<!DOCTYPE html>
<html lang="ka">
<body style="margin:0;padding:24px;background:#f3f4f6;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#111827">
  <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:6px;overflow:hidden">
    <div style="background:#1b2a4a;padding:20px 24px">
      <h1 style="margin:0;font-size:18px;color:#ffffff;letter-spacing:.02em">ახალი შეკვეთის მოთხოვნა</h1>
      <p style="margin:6px 0 0;font-size:13px;color:#c7d2e4">G&amp;M აქსესუარები</p>
    </div>

    <div style="padding:24px">
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px">
        ${contactRow('შეკვეთის ნომერი', String(order.id).slice(0, 8))}
        ${contactRow('თარიღი', placed)}
        ${contactRow('სახელი', order.contact_name)}
        ${contactRow('ტელეფონი', order.contact_phone)}
        ${contactRow('ელ. ფოსტა', customerEmail)}
      </table>

      ${
        order.notes
          ? `<div style="margin-bottom:20px;padding:12px;background:#f9fafb;border-left:3px solid #1b2a4a;font-size:14px">
               <strong style="display:block;margin-bottom:4px;font-size:12px;color:#6b7280;text-transform:uppercase">კომენტარი</strong>
               ${esc(order.notes)}
             </div>`
          : ''
      }

      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <thead>
          <tr style="background:#f9fafb">
            <th style="padding:10px 12px;text-align:left;font-size:12px;color:#6b7280;text-transform:uppercase">პროდუქტი</th>
            <th style="padding:10px 12px;text-align:center;font-size:12px;color:#6b7280;text-transform:uppercase">რაოდ.</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;text-transform:uppercase">ფასი</th>
            <th style="padding:10px 12px;text-align:right;font-size:12px;color:#6b7280;text-transform:uppercase">ჯამი</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding:12px;text-align:right;font-weight:700">სულ</td>
            <td style="padding:12px;text-align:right;font-weight:700;font-size:16px">${gel(total)}</td>
          </tr>
        </tfoot>
      </table>

      ${
        siteUrl
          ? `<p style="margin:24px 0 0">
               <a href="${esc(siteUrl)}/#/admin/orders" style="display:inline-block;background:#1b2a4a;color:#ffffff;text-decoration:none;padding:11px 20px;border-radius:4px;font-size:14px;font-weight:600">ადმინ პანელში ნახვა</a>
             </p>`
          : ''
      }

      <p style="margin:24px 0 0;font-size:12px;color:#6b7280;line-height:1.6">
        ეს არის შეკვეთის <strong>მოთხოვნა</strong> — გადახდა არ განხორციელებულა.
        დაუკავშირდით მომხმარებელს ტელეფონით ან ელ. ფოსტით.
      </p>
    </div>
  </div>
</body>
</html>`
}

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405)

  const supabaseUrl = Deno.env.get('SUPABASE_URL')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!supabaseUrl || !serviceKey) return json({ error: 'missing_supabase_env' }, 500)

  const supabase = createClient(supabaseUrl, serviceKey)

  // --- Authenticate the caller against the Vault secret ---------------------
  // Deliberately before any other config check: an unauthenticated caller
  // shouldn't be able to probe which environment variables are set.
  const { data: expectedSecret, error: secretError } = await supabase.rpc('order_webhook_secret')
  if (secretError || !expectedSecret) return json({ error: 'secret_unavailable' }, 500)
  if (!secretsMatch(req.headers.get('x-webhook-secret') ?? '', String(expectedSecret))) {
    return json({ error: 'unauthorized' }, 401)
  }

  const resendKey = Deno.env.get('RESEND_API_KEY')
  const notifyTo = Deno.env.get('ORDER_NOTIFY_TO')
  const fromEmail = Deno.env.get('ORDER_FROM_EMAIL') ?? 'onboarding@resend.dev'
  const siteUrl = Deno.env.get('SITE_URL') ?? null
  if (!resendKey) return json({ error: 'missing_RESEND_API_KEY' }, 500)
  if (!notifyTo) return json({ error: 'missing_ORDER_NOTIFY_TO' }, 500)

  let orderId: string | undefined
  try {
    orderId = (await req.json())?.order_id
  } catch {
    return json({ error: 'invalid_json' }, 400)
  }
  if (!orderId) return json({ error: 'missing_order_id' }, 400)

  // Service role bypasses RLS, which is what lets one function read any
  // customer's order in order to notify the owner.
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(
      'id, created_at, status, contact_name, contact_phone, notes, user_id, order_items(quantity, price_at_order, size, products(title_ka))',
    )
    .eq('id', orderId)
    .single()

  if (orderError || !order) {
    return json({ error: 'order_not_found', detail: orderError?.message }, 404)
  }

  // The customer's email lives in auth.users, not profiles, so the owner gets a
  // second way to reach them if the phone number is wrong.
  let customerEmail: string | null = null
  if (order.user_id) {
    const { data: authData } = await supabase.auth.admin.getUserById(String(order.user_id))
    customerEmail = authData?.user?.email ?? null
  }

  const items = (order.order_items ?? []) as unknown as OrderItem[]
  const shortId = String(order.id).slice(0, 8)

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: `G&M აქსესუარები <${fromEmail}>`,
      to: [notifyTo],
      // Replying to the notification reaches the customer directly.
      reply_to: customerEmail ?? undefined,
      subject: `ახალი შეკვეთა #${shortId} — ${order.contact_name || 'უცნობი'}`,
      html: buildHtml(order as Record<string, unknown>, items, customerEmail, siteUrl),
    }),
  })

  const resendBody = await resendResponse.text()
  if (!resendResponse.ok) {
    // Surfaced in the function logs and in net._http_response so a delivery
    // failure is diagnosable rather than silent.
    console.error('resend_failed', resendResponse.status, resendBody)
    return json({ error: 'resend_failed', status: resendResponse.status, detail: resendBody }, 502)
  }

  console.log('order_notification_sent', shortId, 'items:', items.length)
  return json({ ok: true, order: shortId, items: items.length })
})
