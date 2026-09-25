// Sends a form submission to the server, which forwards it to Telegram.
// The site runs on Vercel (trivp.vercel.app and thietbiytegroup.com), where that is the function
// api/lien-he.ts. On a PHP host, build with VITE_LEAD_ENDPOINT=/api/lien-he.php instead.
const LEAD_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT || '/api/lien-he';

export type LeadKind =
  | 'lien-he'
  | 'tu-van'
  | 'bao-gia'
  | 'sua-chua'
  | 'san-pham'
  | 'ung-tuyen'
  | 'dang-ky-tin';

export async function sendLead(kind: LeadKind, fields: Record<string, string>): Promise<void> {
  let res: Response;
  try {
    res = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        kind,
        page: window.location.href,
        fields: Object.entries(fields).map(([label, value]) => ({ label, value })),
      }),
    });
  } catch {
    throw new Error('Không kết nối được máy chủ. Vui lòng thử lại hoặc gọi hotline.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.ok) {
    throw new Error(data.error || 'Gửi yêu cầu thất bại. Vui lòng thử lại hoặc gọi hotline.');
  }
}
