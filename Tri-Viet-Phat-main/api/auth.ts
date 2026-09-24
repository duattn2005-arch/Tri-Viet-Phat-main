// Step 1 of the Decap CMS GitHub login: send the admin's popup to GitHub's consent screen.
// Needs GITHUB_CLIENT_ID / GITHUB_CLIENT_SECRET from a GitHub OAuth App whose callback URL is
// https://<your-domain>/api/callback (set both in Vercel → Project → Settings → Environment Variables).

const STATE_COOKIE = 'decap_oauth_state';

export function GET(request: Request): Response {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return new Response('Chưa cấu hình GITHUB_CLIENT_ID trên Vercel.', { status: 500 });
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
