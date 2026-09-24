// Step 2 of the Decap CMS GitHub login: trade GitHub's code for a token and hand it back to
// the admin window through postMessage (the handshake Decap's GitHub backend expects).
// Same cookie name as api/auth.ts (kept local: Vercel runs these files as separate ESM modules)
const STATE_COOKIE = 'decap_oauth_state';

function reply(origin: string, status: 'success' | 'error', payload: object): Response {
  const message = `authorization:github:${status}:${JSON.stringify({ provider: 'github', ...payload })}`;
  const html = `<!doctype html><html><body><script>
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
  </script></body></html>`;
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Set-Cookie': `${STATE_COOKIE}=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0`,
    },
  });
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const cookieState = request.headers
    .get('cookie')
    ?.split(';')
    .map((c) => c.trim().split('='))
    .find(([name]) => name === STATE_COOKIE)?.[1];

  if (!code || !state || state !== cookieState) {
    return reply(url.origin, 'error', { message: 'Phiên đăng nhập không hợp lệ, vui lòng thử lại.' });
  }

  const res = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: `${url.origin}/api/callback`,
    }),
  });
  const data = (await res.json()) as { access_token?: string; error_description?: string };

  if (!data.access_token) {
    return reply(url.origin, 'error', { message: data.error_description || 'GitHub từ chối đăng nhập.' });
  }
  return reply(url.origin, 'success', { token: data.access_token });
}
