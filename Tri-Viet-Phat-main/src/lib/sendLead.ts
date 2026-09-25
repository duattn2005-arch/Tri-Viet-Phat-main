// Sends a form submission to public/api/lien-he.php on the hosting, which forwards it to Telegram.
// VITE_LEAD_ENDPOINT overrides the URL, e.g. when the site is served from a sub-folder.
const LEAD_ENDPOINT = import.meta.env.VITE_LEAD_ENDPOINT || '/api/lien-he.php';

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
