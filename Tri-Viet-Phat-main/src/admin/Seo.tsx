import React, { useMemo, useState } from 'react';
import { SITE_URL, slugify } from './schema';

// A Yoast-style SEO and readability check of one article or product, with the Google preview.
// The rules are simple on purpose: each one says in plain Vietnamese what to change.

export type Rating = 'good' | 'ok' | 'bad' | 'none';

export interface Check {
  rating: Rating;
  text: string;
}

export interface SeoInput {
  keyphrase: string;
  /** The title the website shows on Google (the SEO title, or the entry title + " | Trí Đức"). */
  googleTitle: string;
  description: string;
  slug: string;
  path: string;
  html: string;
  date?: string;
}

const COLORS: Record<Rating, string> = { good: '#00a32a', ok: '#dba617', bad: '#d63638', none: '#a7aaad' };

export function Dot({ rating }: { rating: Rating }) {
  return <span className="inline-block w-3 h-3 rounded-full shrink-0" style={{ background: COLORS[rating] }} aria-hidden="true" />;
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFC')
    .replace(/\s+/g, ' ')
    .trim();

const count = (hay: string, needle: string) => {
  if (!needle) return 0;
  let n = 0;
  let i = hay.indexOf(needle);
  while (i !== -1) {
    n++;
    i = hay.indexOf(needle, i + needle.length);
  }
  return n;
};

const TRANSITIONS = [
  'tuy nhiên', 'ngoài ra', 'vì vậy', 'do đó', 'bên cạnh đó', 'trước hết', 'đầu tiên', 'tiếp theo', 'sau đó', 'cuối cùng',
  'đặc biệt', 'ví dụ', 'chẳng hạn', 'nói cách khác', 'mặt khác', 'hơn nữa', 'tóm lại', 'nhìn chung', 'thêm vào đó',
  'vì thế', 'như vậy', 'trong khi đó', 'thứ nhất', 'thứ hai', 'thứ ba', 'bởi vì', 'cho nên', 'nhờ đó', 'kết quả là', 'ngược lại',
];

function parse(html: string) {
  const doc = new DOMParser().parseFromString(html || '', 'text/html');
  const text = (doc.body.textContent ?? '').replace(/\s+/g, ' ').trim();
  const paragraphs = [...doc.body.querySelectorAll('p, li')].map((p) => (p.textContent ?? '').replace(/\s+/g, ' ').trim()).filter(Boolean);
  const headings = [...doc.body.querySelectorAll('h2, h3, h4')].map((h) => h.textContent ?? '');
  const images = [...doc.body.querySelectorAll('img')].map((i) => i.getAttribute('alt') ?? '');
  const links = [...doc.body.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') ?? '');
  const words = text ? text.split(' ').length : 0;
  const sentences = text.split(/(?<=[.!?…])\s+/).map((s) => s.trim()).filter((s) => s.split(' ').length > 2);
  return { text, paragraphs, headings, images, links, words, sentences };
}

export function analyze(input: SeoInput) {
  const k = norm(input.keyphrase);
  const doc = parse(input.html);
  const text = norm(doc.text);
  const seo: Check[] = [];
  const read: Check[] = [];
  const add = (list: Check[], rating: Rating, t: string) => list.push({ rating, text: t });

  // ---- SEO ----
  const titleLen = input.googleTitle.length;
  if (titleLen < 30) add(seo, 'ok', `Tiêu đề SEO hơi ngắn (${titleLen} ký tự). Nên dài 30–60 ký tự.`);
  else if (titleLen > 60) add(seo, 'ok', `Tiêu đề SEO dài ${titleLen} ký tự, Google sẽ cắt bớt. Nên dưới 60 ký tự.`);
  else add(seo, 'good', `Độ dài tiêu đề SEO tốt (${titleLen} ký tự).`);

  const descLen = input.description.trim().length;
  if (!descLen) add(seo, 'bad', 'Chưa có mô tả trên Google. Hãy viết 1–2 câu (120–160 ký tự) giới thiệu nội dung.');
  else if (descLen < 110) add(seo, 'ok', `Mô tả hơi ngắn (${descLen} ký tự). Nên dài 120–160 ký tự.`);
  else if (descLen > 160) add(seo, 'ok', `Mô tả dài ${descLen} ký tự, Google sẽ cắt bớt. Nên dưới 160 ký tự.`);
  else add(seo, 'good', `Độ dài mô tả tốt (${descLen} ký tự).`);

  if (!k) {
    add(seo, 'none', 'Chưa nhập cụm từ khóa chính: nhập cụm từ khách hay tìm trên Google để phân tích kỹ hơn.');
  } else {
    const inTitle = norm(input.googleTitle).indexOf(k);
    add(
      seo,
      inTitle === 0 ? 'good' : inTitle > 0 ? 'ok' : 'bad',
      inTitle === 0 ? 'Tiêu đề SEO bắt đầu bằng cụm từ khóa. Tốt!' : inTitle > 0 ? 'Tiêu đề SEO có cụm từ khóa; đưa nó lên đầu tiêu đề sẽ tốt hơn.' : 'Tiêu đề SEO chưa có cụm từ khóa.'
    );
    add(seo, norm(input.description).includes(k) ? 'good' : 'bad', norm(input.description).includes(k) ? 'Mô tả có cụm từ khóa.' : 'Mô tả trên Google chưa có cụm từ khóa.');
    const slugHit = slugify(input.slug).includes(slugify(input.keyphrase));
    add(seo, slugHit ? 'good' : 'ok', slugHit ? 'Đường dẫn có cụm từ khóa.' : 'Đường dẫn (URL) chưa có cụm từ khóa.');
    const intro = norm(doc.paragraphs[0] ?? '');
    add(seo, intro.includes(k) ? 'good' : 'bad', intro.includes(k) ? 'Đoạn mở đầu có cụm từ khóa.' : 'Đoạn mở đầu chưa nhắc tới cụm từ khóa.');
    if (doc.words >= 50) {
      const hits = count(text, k);
      const density = (hits * k.split(' ').length * 100) / doc.words;
      add(
        seo,
        hits === 0 ? 'bad' : density > 3.5 ? 'bad' : density < 0.4 ? 'ok' : 'good',
        hits === 0
          ? 'Nội dung chưa có cụm từ khóa.'
          : density > 3.5
            ? `Cụm từ khóa xuất hiện ${hits} lần (${density.toFixed(1)}%), quá dày. Google có thể coi là nhồi từ khóa.`
            : density < 0.4
              ? `Cụm từ khóa chỉ xuất hiện ${hits} lần (${density.toFixed(1)}%). Nên nhắc thêm vài lần.`
              : `Cụm từ khóa xuất hiện ${hits} lần (${density.toFixed(1)}%). Tốt!`
      );
    }
    if (doc.headings.length) {
      const hit = doc.headings.some((h) => norm(h).includes(k));
      add(seo, hit ? 'good' : 'ok', hit ? 'Có tiêu đề phụ chứa cụm từ khóa.' : 'Chưa có tiêu đề phụ (H2, H3) nào chứa cụm từ khóa.');
    }
    if (doc.images.length) {
      const hit = doc.images.some((a) => norm(a).includes(k));
      add(seo, hit ? 'good' : 'ok', hit ? 'Có ảnh mà mô tả ảnh (alt) chứa cụm từ khóa.' : 'Chưa có ảnh nào có mô tả ảnh (alt) chứa cụm từ khóa.');
    }
  }

  add(
    seo,
    doc.words >= 300 ? 'good' : doc.words >= 150 ? 'ok' : 'bad',
    doc.words >= 300 ? `Nội dung dài ${doc.words} từ. Tốt!` : `Nội dung mới có ${doc.words} từ. Nên viết ít nhất 300 từ.`
  );
  if (doc.images.length === 0) add(seo, 'ok', 'Nội dung chưa có ảnh. Thêm ảnh minh họa giúp bài hấp dẫn hơn.');
  else if (doc.images.some((a) => !a.trim())) add(seo, 'ok', 'Có ảnh chưa có mô tả (alt). Bấm vào ảnh → biểu tượng ảnh để nhập mô tả.');
  const internal = doc.links.filter((h) => h.startsWith('/') || h.includes('thietbiytegroup.com')).length;
  add(seo, internal ? 'good' : 'ok', internal ? `Có ${internal} liên kết tới trang khác của website.` : 'Chưa có liên kết tới trang khác của website (ví dụ trang sản phẩm liên quan).');

  // ---- Readability ----
  if (doc.words < 50) {
    add(read, 'none', 'Nội dung quá ngắn để phân tích khả năng đọc.');
  } else {
    const longParas = doc.paragraphs.filter((p) => p.split(' ').length > 150).length;
    add(read, longParas ? 'ok' : 'good', longParas ? `${longParas} đoạn văn dài hơn 150 từ. Nên chia nhỏ.` : 'Độ dài các đoạn văn vừa phải.');
    const longSent = doc.sentences.filter((s) => s.split(' ').length > 25).length;
    const pct = doc.sentences.length ? Math.round((longSent * 100) / doc.sentences.length) : 0;
    add(read, pct > 25 ? 'ok' : 'good', pct > 25 ? `${pct}% câu dài hơn 25 từ. Nên viết câu ngắn hơn.` : 'Độ dài câu tốt.');
    if (doc.words > 300) {
      add(
        read,
        doc.headings.length ? 'good' : 'bad',
        doc.headings.length ? 'Nội dung được chia bằng các tiêu đề phụ.' : 'Bài dài nhưng chưa có tiêu đề phụ. Thêm tiêu đề (Tiêu đề 2, 3) để chia các phần.'
      );
    }
    const withTransition = doc.sentences.filter((s) => TRANSITIONS.some((t) => norm(s).includes(t))).length;
    const tPct = doc.sentences.length ? Math.round((withTransition * 100) / doc.sentences.length) : 0;
    add(read, tPct >= 20 ? 'good' : 'ok', tPct >= 20 ? `${tPct}% câu có từ nối. Tốt!` : `Chỉ ${tPct}% câu có từ nối (tuy nhiên, ngoài ra, vì vậy…). Nên dùng thêm để bài liền mạch.`);
    let repeats = 0;
    for (let i = 2; i < doc.sentences.length; i++) {
      const first = (s: string) => norm(s).split(' ')[0];
      if (first(doc.sentences[i]) === first(doc.sentences[i - 1]) && first(doc.sentences[i]) === first(doc.sentences[i - 2])) repeats++;
    }
    add(read, repeats ? 'ok' : 'good', repeats ? 'Có 3 câu liên tiếp bắt đầu bằng cùng một từ. Nên đổi cách mở câu.' : 'Cách mở câu đa dạng.');
  }

  const score = (list: Check[]): { rating: Rating; label: string } => {
    const rated = list.filter((c) => c.rating !== 'none');
    if (!rated.length) return { rating: 'none', label: 'Chưa phân tích' };
    const good = rated.filter((c) => c.rating === 'good').length / rated.length;
    const bad = rated.filter((c) => c.rating === 'bad').length;
    if (good >= 0.75 && !bad) return { rating: 'good', label: 'Tốt' };
    if (bad >= 2 || good < 0.4) return { rating: 'bad', label: 'Cần cải thiện' };
    return { rating: 'ok', label: 'Tạm được' };
  };

  return { seo, read, seoScore: k ? score(seo) : { rating: 'none' as Rating, label: 'Chưa có từ khóa' }, readScore: score(read) };
}

function Meter({ length, min, max }: { length: number; min: number; max: number }) {
  const pct = Math.min(100, (length / max) * 100);
  const color = length === 0 ? '#dcdcde' : length < min ? '#dba617' : length > max ? '#d63638' : '#00a32a';
  return (
    <div className="h-1.5 bg-[#f0f0f1] mt-1" aria-hidden="true">
      <div className="h-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function Results({ list }: { list: Check[] }) {
  const groups: [Rating[], string][] = [
    [['bad'], 'Vấn đề'],
    [['ok', 'none'], 'Nên cải thiện'],
    [['good'], 'Đã tốt'],
  ];
  return (
    <div className="space-y-3">
      {groups.map(([ratings, label]) => {
        const items = list.filter((c) => ratings.includes(c.rating));
        if (!items.length) return null;
        return (
          <div key={label}>
            <div className="font-semibold mb-1">
              {label} ({items.length})
            </div>
            <ul className="m-0 p-0 list-none space-y-1.5">
              {items.map((c, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="mt-1">
                    <Dot rating={c.rating} />
                  </span>
                  <span>{c.text}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/** The SEO box under the editor: key phrase, Google preview, SEO title and description, results. */
export function SeoBox({
  input,
  values,
  onChange,
  titlePlaceholder,
  descriptionPlaceholder,
}: {
  input: SeoInput;
  values: { seoKeyphrase: string; seoTitle: string; seoDescription: string };
  onChange: (name: 'seoKeyphrase' | 'seoTitle' | 'seoDescription', value: string) => void;
  titlePlaceholder: string;
  descriptionPlaceholder: string;
}) {
  const [tab, setTab] = useState<'seo' | 'read'>('seo');
  const result = useMemo(() => analyze(input), [input]);
  const crumbs = [new URL(SITE_URL).host, ...input.path.split('/').filter(Boolean)].join(' › ');
  const shownTitle = input.googleTitle.length > 60 ? `${input.googleTitle.slice(0, 58)}…` : input.googleTitle;
  const desc = input.description.trim();
  const shownDesc = desc.length > 160 ? `${desc.slice(0, 157)}…` : desc;

  const tabBtn = (t: typeof tab, label: string, rating: Rating) => (
    <button
      type="button"
      onClick={() => setTab(t)}
      className={`flex items-center gap-2 px-3 py-2 -mb-px border-b-2 cursor-pointer ${tab === t ? 'border-[var(--wp-blue)] font-semibold' : 'border-transparent text-[var(--wp-muted)]'}`}
    >
      <Dot rating={rating} /> {label}
    </button>
  );

  return (
    <div>
      <div className="flex gap-2 border-b border-[var(--wp-line)] mb-4">
        {tabBtn('seo', 'SEO', result.seoScore.rating)}
        {tabBtn('read', 'Khả năng đọc', result.readScore.rating)}
      </div>
      {tab === 'seo' ? (
        <div className="space-y-4">
          <div>
            <label className="wp-label" htmlFor="seo-k">
              Cụm từ khóa chính
            </label>
            <input id="seo-k" className="wp-input" placeholder="Ví dụ: máy xét nghiệm sinh hóa" value={values.seoKeyphrase} onChange={(e) => onChange('seoKeyphrase', e.target.value)} />
          </div>

          <div>
            <div className="wp-label">Xem trước trên Google</div>
            <div className="border border-[var(--wp-line)] rounded p-4 max-w-[600px] bg-white" style={{ fontFamily: 'Arial, sans-serif' }}>
              <div className="text-[12px] text-[#4d5156] truncate">{crumbs}</div>
              <div className="text-[20px] leading-snug text-[#1a0dab] mt-0.5">{shownTitle || 'Tiêu đề trang'}</div>
              <div className="text-[14px] leading-[1.58] text-[#4d5156] mt-1">
                {input.date && <span className="text-[#70757a]">{input.date} — </span>}
                {shownDesc || <span className="italic">Google sẽ tự lấy một đoạn trong bài làm mô tả.</span>}
              </div>
            </div>
          </div>

          <div>
            <label className="wp-label" htmlFor="seo-t">
              Tiêu đề SEO <span className="font-normal text-[var(--wp-muted)]">({input.googleTitle.length}/60)</span>
            </label>
            <input id="seo-t" className="wp-input" placeholder={titlePlaceholder} value={values.seoTitle} onChange={(e) => onChange('seoTitle', e.target.value)} />
            <Meter length={input.googleTitle.length} min={30} max={60} />
          </div>
          <div>
            <label className="wp-label" htmlFor="seo-d">
              Mô tả trên Google <span className="font-normal text-[var(--wp-muted)]">({desc.length}/160)</span>
            </label>
            <textarea id="seo-d" className="wp-input" rows={3} placeholder={descriptionPlaceholder} value={values.seoDescription} onChange={(e) => onChange('seoDescription', e.target.value)} />
            <Meter length={desc.length} min={120} max={160} />
            <p className="wp-hint">Bỏ trống thì website dùng phần tóm tắt.</p>
          </div>

          <div className="pt-2 border-t border-[#f0f0f1]">
            <div className="wp-label">Kết quả phân tích</div>
            <Results list={result.seo} />
          </div>
        </div>
      ) : (
        <Results list={result.read} />
      )}
    </div>
  );
}
