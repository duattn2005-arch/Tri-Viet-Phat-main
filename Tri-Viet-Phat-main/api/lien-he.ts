// Forwards website form submissions to Telegram (public/api/lien-he.php is the same thing for a PHP host).
// Needs Vercel environment variables
// TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_IDS (comma-separated).

const TITLES: Record<string, string> = {
  'lien-he': '📩 LIÊN HỆ MỚI',
  'tu-van': '💬 YÊU CẦU TƯ VẤN / BÁO GIÁ',
  'bao-gia': '🧾 ĐĂNG KÝ HỢP TÁC / BÁO GIÁ',
  'sua-chua': '🛠 YÊU CẦU BẢO TRÌ / SỬA CHỮA',
  'san-pham': '🛒 BÁO GIÁ SẢN PHẨM',
  'ung-tuyen': '👔 HỒ SƠ ỨNG TUYỂN',
  'dang-ky-tin': '📰 ĐĂNG KÝ NHẬN TIN',
};

const NOT_CONFIGURED = 'Hệ thống nhận yêu cầu chưa được cấu hình. Vui lòng gọi hotline để được hỗ trợ.';
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;

// Best effort only: per function instance, reset on cold start
const hitsByIp = new Map<string, number[]>();

function reply(status: number, body: Record<string, unknown>): Response {
  return Response.json(body, { status });
}

function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function POST(request: Request): Promise<Response> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatIds = (process.env.TELEGRAM_CHAT_IDS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!token || !chatIds.length) return reply(503, { error: NOT_CONFIGURED });

  const raw = await request.text();
  if (raw.length > 20000) return reply(400, { error: 'Dữ liệu không hợp lệ.' });
  let data: { kind?: unknown; fields?: unknown; page?: unknown; website?: unknown };
  try {
    data = JSON.parse(raw);
  } catch {
    return reply(400, { error: 'Dữ liệu không hợp lệ.' });
  }
  if (data.website) return reply(200, { ok: true });

  const kind = String(data.kind ?? '');
  if (!TITLES[kind]) return reply(400, { error: 'Loại yêu cầu không hợp lệ.' });
  if (!Array.isArray(data.fields) || data.fields.length > 20) return reply(400, { error: 'Dữ liệu không hợp lệ.' });

  let phone = '';
  let contact = '';
  const lines: string[] = [];
  for (const field of data.fields as { label?: unknown; value?: unknown }[]) {
    const label = String(field?.label ?? '').trim().slice(0, 60);
    const value = String(field?.value ?? '').trim().slice(0, 2000);
    if (!label || !value) continue;
    if (label === 'Email' || label === 'Email / SĐT') contact = value;
    if (label === 'Số điện thoại') phone = value;
    lines.push(`<b>${escapeHtml(label)}:</b> ${escapeHtml(value)}`);
  }
  // Every form needs a way to call back: a valid phone, or an email / phone in the newsletter box
  const validPhone = /^[0-9 +().-]{8,20}$/.test(phone);
  if ((phone && !validPhone) || (!phone && !contact)) {
    return reply(400, { error: 'Vui lòng nhập số điện thoại hoặc email hợp lệ.' });
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const hits = (hitsByIp.get(ip) ?? []).filter((t) => t > now - RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX) {
    return reply(429, { error: 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau ít phút hoặc gọi hotline.' });
  }
  hits.push(now);
  hitsByIp.set(ip, hits);

  const time = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(now));
  const page = String(data.page ?? '').trim().slice(0, 300);
  const text =
    `<b>${TITLES[kind]}</b>\n\n${lines.join('\n')}\n\n🕒 ${time}` + (page ? `\n🔗 ${escapeHtml(page)}` : '');

  const results = await Promise.all(
    chatIds.map((chatId) =>
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
      })
        .then((res) => res.ok)
        .catch(() => false)
    )
  );

  if (!results.some(Boolean)) {
    return reply(502, { error: 'Không gửi được yêu cầu. Vui lòng thử lại hoặc gọi hotline.' });
  }
  return reply(200, { ok: true });
}
