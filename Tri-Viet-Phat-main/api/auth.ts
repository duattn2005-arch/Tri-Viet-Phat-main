// Login popup for the Decap CMS admin (/admin). Two modes, picked by Vercel environment variables:
//
// 1. Password (preferred): ADMIN_PASSWORD + GITHUB_TOKEN. The popup asks for the shared admin
//    password; on a match it hands Decap GITHUB_TOKEN, a fine-grained personal access token limited
//    to this repository with "Contents: Read and write".
// 2. GitHub OAuth (fallback): GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET from a GitHub OAuth App whose
//    redirect URI is https://<your-domain>/api/callback; each editor signs in with their own account.
import { createHash, timingSafeEqual } from 'node:crypto';

const STATE_COOKIE = 'decap_oauth_state';
const FAILED_LOGIN_DELAY_MS = 1500;

function passwordMode(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.GITHUB_TOKEN);
}

function page(body: string, status = 200): Response {
  const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" /><meta name="robots" content="noindex" />
<title>Đăng nhập quản trị</title>
<style>
  body { font-family: system-ui, sans-serif; background: #f3f7fb; color: #111; margin: 0;
         display: flex; min-height: 100vh; align-items: center; justify-content: center; padding: 16px; }
  form { background: #fff; border: 1px solid #e3ebf3; border-radius: 12px; padding: 28px; width: 100%; max-width: 340px;
         box-shadow: 0 8px 24px rgba(10,37,64,.08); }
  h1 { font-size: 18px; margin: 0 0 4px; } p { font-size: 13px; color: #555; margin: 0 0 18px; }
  input { width: 100%; box-sizing: border-box; padding: 11px 12px; font-size: 15px; border: 1px solid #cfd8e3;
          border-radius: 8px; margin-bottom: 12px; }
  button { width: 100%; padding: 11px; font-size: 15px; font-weight: 600; color: #fff; background: #0a2540;
           border: 0; border-radius: 8px; cursor: pointer; }
  .error { color: #b91c1c; font-size: 13px; margin: -4px 0 12px; }
</style></head><body>${body}</body></html>`;
  return new Response(html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' } });
}

function passwordForm(error = ''): Response {
  return page(`<form method="post" action="/api/auth">
  <h1>Quản trị nội dung</h1>
  <p>Trí Việt Phát — nhập mật khẩu quản trị để tiếp tục.</p>
  <input type="password" name="password" placeholder="Mật khẩu" autocomplete="current-password" autofocus required />
  ${error ? `<div class="error">${error}</div>` : ''}
  <button type="submit">Đăng nhập</button>
</form>`);
}

/** Hands the token to the admin window using the postMessage handshake Decap's GitHub backend expects. */
function handOver(origin: string, token: string): Response {
  const message = `authorization:github:success:${JSON.stringify({ provider: 'github', token })}`;
  return page(`<p style="text-align:center">Đăng nhập thành công, đang quay lại trang quản trị…</p><script>
  (function () {
    var message = ${JSON.stringify(message)};
    var origin = ${JSON.stringify(origin)};
    function receive(e) {
      if (e.origin !== origin) return;
      window.removeEventListener('message', receive);
      window.opener.postMessage(message, origin);
    }
    window.addEventListener('message', receive);
    window.opener.postMessage('authorizing:github', origin);
  })();
</script>`);
}

function samePassword(given: string, expected: string): boolean {
  const a = createHash('sha256').update(given).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

export function GET(request: Request): Response {
  if (passwordMode()) return passwordForm();

  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response('Chưa cấu hình đăng nhập: cần ADMIN_PASSWORD + GITHUB_TOKEN trên Vercel.', { status: 500 });
  }

  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('redirect_uri', `${url.origin}/api/callback`);
  authorize.searchParams.set('scope', url.searchParams.get('scope') || 'repo');
  authorize.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorize.toString(),
      'Set-Cookie': `${STATE_COOKIE}=${state}; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
}

export async function POST(request: Request): Promise<Response> {
  if (!passwordMode()) return new Response('Đăng nhập bằng mật khẩu chưa được bật.', { status: 404 });

  const form = await request.formData();
  const password = String(form.get('password') ?? '');

  if (!samePassword(password, process.env.ADMIN_PASSWORD!)) {
    // Slow down guessing; each attempt costs the caller a full request plus this wait.
    await new Promise((resolve) => setTimeout(resolve, FAILED_LOGIN_DELAY_MS));
    return passwordForm('Sai mật khẩu, vui lòng thử lại.');
  }
  return handOver(new URL(request.url).origin, process.env.GITHUB_TOKEN!);
}
