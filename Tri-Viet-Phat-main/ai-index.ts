// Build-time search index for the AI chat (public/api/chat.php): every page of the site — news, documents,
// jobs, products, buying guides, brand pages, company info — split into short passages with a BM25 keyword
// index. chat.php looks up the passages that match a question and gives them to the model, so the assistant
// answers from what the website actually says, and new CMS posts are learnt on the next build.
//
// The tokenizer must stay in step with tokenize() in public/api/chat.php.
import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

export interface AiPassage {
  /** Page title */
  t: string;
  /** Page URL */
  u: string;
  /** Passage text */
  x: string;
}

const STOPWORDS = new Set(
  (
    'và của là có các cho được trong với những một này để khi từ không thì đã như về nên sẽ cũng đến bạn ra tại theo ' +
    'hay hoặc mà nhiều vào rất bị còn do lên nhất ạ ơi gì nào đó đây nếu vì trên dưới sau trước giữa cùng hơn chỉ ' +
    'the and of to in for is on'
  ).split(' ')
);

export function tokenize(text: string): string[] {
  return text
    .normalize('NFC')
    .toLowerCase()
    .split(/[^\p{L}\p{N}]+/u)
    .filter((w) => w && !STOPWORDS.has(w));
}

/** Unigrams plus adjacent-word bigrams ("xét nghiệm", "cs t240") so phrases rank above scattered words. */
export function terms(text: string): string[] {
  const words = tokenize(text);
  const out = [...words];
  for (let i = 0; i + 1 < words.length; i++) out.push(`${words[i]} ${words[i + 1]}`);
  return out;
}

export function htmlToText(htmlOrMarkdown: string): string {
  const html = marked.parse(htmlOrMarkdown || '', { async: false }) as string;
  return html
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/(p|h[1-6]|li|tr|div)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim();
}

/** Splits text into ~900-character passages on paragraph/sentence boundaries. */
function split(text: string, size = 900): string[] {
  const parts = text.split(/\n+/).flatMap((p) => (p.length > size ? p.split(/(?<=[.!?])\s+/) : [p]));
  const chunks: string[] = [];
  let cur = '';
  for (const p of parts) {
    if (cur && cur.length + p.length + 1 > size) {
      chunks.push(cur.trim());
      cur = '';
    }
    cur += (cur ? '\n' : '') + p;
  }
  if (cur.trim()) chunks.push(cur.trim());
  return chunks;
}

export function buildAiIndex(pages: { title: string; url: string; text: string }[]) {
  const docs: AiPassage[] = [];
  for (const page of pages) {
    for (const chunk of split(page.text)) {
      if (chunk.length >= 40) docs.push({ t: page.title, u: page.url, x: chunk });
    }
  }

  // Inverted index: term -> [doc, tf, doc, tf, …]; the page title counts towards every passage of it
  const lens: number[] = [];
  const postings = new Map<string, number[]>();
  docs.forEach((d, i) => {
    const counts = new Map<string, number>();
    const all = terms(`${d.t} ${d.t} ${d.x}`);
    for (const term of all) counts.set(term, (counts.get(term) ?? 0) + 1);
    lens.push(all.length);
    for (const [term, tf] of counts) {
      let list = postings.get(term);
      if (!list) postings.set(term, (list = []));
      list.push(i, tf);
    }
  });

  // Drop terms too common to rank anything (in over 40% of passages) and one-off bigrams
  const idx: Record<string, number[]> = {};
  for (const [term, list] of postings) {
    const df = list.length / 2;
    if (df > docs.length * 0.4) continue;
    if (term.includes(' ') && df < 2) continue;
    idx[term] = list;
  }
  const avg = lens.reduce((a, b) => a + b, 0) / Math.max(1, lens.length);
  return { n: docs.length, avg: Math.round(avg), len: lens, docs, idx };
}

/** Reads the CMS folders the SEO plugin does not load (documents, jobs, about). */
export function readJsonFolder<T>(dir: string): (T & { id: string })[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ ...(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8')) as T), id: f.replace(/\.json$/, '') }));
}
