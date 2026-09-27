import DOMPurify from 'dompurify';

// What an article body may contain once saved: text formatting, headings, lists, links,
// images, tables and embedded videos from YouTube. Anything else (scripts, forms…) is removed.
const ALLOWED = {
  ADD_TAGS: ['iframe'],
  ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'target'],
  FORBID_TAGS: ['script', 'style', 'form', 'input', 'button', 'object', 'embed'],
};

export function cleanHtml(html: string): string {
  const clean = DOMPurify.sanitize(html, ALLOWED) as string;
  // Keep only YouTube / Google Maps embeds
  return clean.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, (tag) =>
    /src="https:\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|google\.com\/maps)\//i.test(tag) ? tag : ''
  );
}
