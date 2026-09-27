import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Copy, ExternalLink, FileText, Upload } from 'lucide-react';
import { api, type MediaItem } from './api';
import { useAdmin } from './App';
import { announceSaved } from './Shell';
import { fileName, formatBytes, slugify } from './schema';
import { Modal, PageTitle, Spinner } from './ui';

// "Thư viện": every picture and PDF of the website, uploads first. The same grid opens as a
// picker from image fields and from the editor's "Thêm tệp" button.

let cached: MediaItem[] | null = null;

function useMedia() {
  const [items, setItems] = useState<MediaItem[] | null>(cached);
  const [error, setError] = useState('');
  useEffect(() => {
    api.media().then(
      (list) => {
        cached = list;
        setItems(list);
      },
      (e) => setError(e.message)
    );
  }, []);
  const add = (item: MediaItem) => {
    cached = [item, ...(cached ?? []).filter((x) => x.url !== item.url)];
    setItems(cached);
  };
  return { items, error, add };
}

/** Big phone photos are scaled down to 2400 px before upload; small files and GIFs go as they are. */
async function shrink(file: File): Promise<File> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || file.size < 1.2 * 1024 * 1024) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 2400 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    // PNG may have transparency (logos): WebP keeps it, JPEG would not
    const type = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, type, 0.85));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, type === 'image/webp' ? '.webp' : '.jpg'), { type });
  } catch {
    return file;
  }
}

interface UploadJob {
  id: number;
  name: string;
  state: 'uploading' | 'done' | 'error';
  message?: string;
}

/** Drop zone + queue. Calls onUploaded for each file that made it. */
function Uploader({ onUploaded, accept = 'image/*,application/pdf' }: { onUploaded: (item: MediaItem) => void; accept?: string }) {
  const [jobs, setJobs] = useState<UploadJob[]>([]);
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const seq = useRef(0);

  const start = async (files: FileList | File[]) => {
    for (const original of Array.from(files)) {
      const id = ++seq.current;
      setJobs((j) => [{ id, name: original.name, state: 'uploading' }, ...j]);
      const update = (patch: Partial<UploadJob>) => setJobs((j) => j.map((x) => (x.id === id ? { ...x, ...patch } : x)));
      try {
        const file = await shrink(original);
        if (file.size > 15 * 1024 * 1024) throw new Error('File lớn hơn 15 MB.');
        const item = await api.upload(file, slugify(original.name.replace(/\.[^.]+$/, '')));
        update({ state: 'done' });
        onUploaded(item);
        announceSaved();
      } catch (e: any) {
        update({ state: 'error', message: e.message });
      }
    }
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          if (e.dataTransfer.files.length) start(e.dataTransfer.files);
        }}
        className={`border-4 border-dashed ${over ? 'border-[var(--wp-blue)] bg-[#f0f6fc]' : 'border-[#c3c4c7] bg-white'} py-12 px-4 text-center`}
      >
        <p className="text-[20px] m-0 mb-2">Thả tệp vào đây để tải lên</p>
        <p className="m-0 mb-3 text-[var(--wp-muted)]">hoặc</p>
        <button type="button" className="wp-btn wp-btn-lg" onClick={() => input.current?.click()}>
          <Upload className="w-4 h-4" /> Chọn tệp
        </button>
        <input
          ref={input}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) start(e.target.files);
            e.target.value = '';
          }}
        />
        <p className="mt-4 mb-0 text-[13px] text-[var(--wp-muted)]">Ảnh JPG, PNG, WebP, GIF hoặc file PDF, tối đa 15 MB. Ảnh lớn được tự thu nhỏ.</p>
      </div>
      {jobs.length > 0 && (
        <ul className="m-0 mt-3 p-0 list-none space-y-1">
          {jobs.map((j) => (
            <li key={j.id} className="flex items-center gap-2 bg-white border border-[var(--wp-line)] px-3 py-2 text-[13px]">
              {j.state === 'uploading' ? <span className="wp-spinner" /> : j.state === 'done' ? <Check className="w-4 h-4 text-[var(--wp-green)]" /> : <span className="text-[var(--wp-red)] font-bold">!</span>}
              <span className="truncate flex-1">{j.name}</span>
              <span className={j.state === 'error' ? 'text-[var(--wp-red)]' : 'text-[var(--wp-muted)]'}>
                {j.state === 'uploading' ? 'Đang tải lên…' : j.state === 'done' ? 'Xong' : j.message}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type Filter = 'all' | 'image' | 'pdf' | 'uploads' | 'site';

function useFiltered(items: MediaItem[] | null, filter: Filter, query: string) {
  return useMemo(() => {
    const q = slugify(query);
    return (items ?? []).filter((m) => {
      if (filter === 'image' && m.type !== 'image') return false;
      if (filter === 'pdf' && m.type !== 'pdf') return false;
      if (filter === 'uploads' && !m.url.startsWith('/uploads/')) return false;
      if (filter === 'site' && m.url.startsWith('/uploads/')) return false;
      return !q || slugify(m.url).includes(q);
    });
  }, [items, filter, query]);
}

function Toolbar({ filter, setFilter, query, setQuery, count }: { filter: Filter; setFilter: (f: Filter) => void; query: string; setQuery: (q: string) => void; count: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2 bg-white border border-[var(--wp-border)] px-3 py-2 mb-3">
      <select className="wp-input !w-auto" value={filter} onChange={(e) => setFilter(e.target.value as Filter)} aria-label="Lọc tệp">
        <option value="all">Tất cả tệp</option>
        <option value="image">Hình ảnh</option>
        <option value="pdf">Tài liệu PDF</option>
        <option value="uploads">Đã tải lên</option>
        <option value="site">Ảnh có sẵn của web</option>
      </select>
      <span className="text-[13px] text-[var(--wp-muted)]">{count} tệp</span>
      <input className="wp-input !w-60 ml-auto" type="search" placeholder="Tìm theo tên tệp…" value={query} onChange={(e) => setQuery(e.target.value)} />
    </div>
  );
}

function Tile({ item, selected, onClick }: { item: MediaItem; selected?: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={fileName(item.url)}
      className={`relative aspect-square wp-checker border cursor-pointer overflow-hidden ${
        selected ? 'border-[var(--wp-blue)] shadow-[0_0_0_3px_var(--wp-blue)]' : 'border-[var(--wp-line)] hover:border-[#8c8f94]'
      }`}
    >
      {item.type === 'image' ? (
        <img src={item.url} alt="" loading="lazy" className="w-full h-full object-contain" />
      ) : (
        <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#f6f7f7] p-2">
          <FileText className="w-10 h-10 text-[#8c8f94]" />
          <span className="text-[11px] break-all line-clamp-2 text-[var(--wp-text)]">{fileName(item.url)}</span>
        </span>
      )}
      {selected && (
        <span className="absolute top-1 right-1 w-6 h-6 bg-[var(--wp-blue)] text-white flex items-center justify-center">
          <Check className="w-4 h-4" />
        </span>
      )}
    </button>
  );
}

function CopyUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);
  const full = `${window.location.origin}${url}`;
  return (
    <div className="flex gap-1.5">
      <input className="wp-input !text-[12px]" readOnly value={full} onFocus={(e) => e.target.select()} />
      <button
        type="button"
        className="wp-btn wp-btn-sm shrink-0"
        onClick={() => {
          navigator.clipboard?.writeText(full).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          });
        }}
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? 'Đã chép' : 'Sao chép'}
      </button>
    </div>
  );
}

export function MediaPage({ startWithUpload = false }: { startWithUpload?: boolean }) {
  const { notify } = useAdmin();
  const { items, error, add } = useMedia();
  const [showUpload, setShowUpload] = useState(startWithUpload);
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [detail, setDetail] = useState<MediaItem | null>(null);
  const [limit, setLimit] = useState(120);
  const list = useFiltered(items, filter, query);

  return (
    <div>
      <PageTitle
        action={
          <button type="button" className="wp-btn" onClick={() => setShowUpload(!showUpload)}>
            Thêm tệp mới
          </button>
        }
      >
        Thư viện Media
      </PageTitle>
      {showUpload && (
        <div className="mb-5">
          <Uploader
            onUploaded={(item) => {
              add(item);
              notify({ kind: 'success', text: `Đã tải lên ${fileName(item.url)}.` });
            }}
          />
        </div>
      )}
      <Toolbar filter={filter} setFilter={setFilter} query={query} setQuery={setQuery} count={list.length} />
      {error ? (
        <div className="wp-notice is-error">{error}</div>
      ) : !items ? (
        <Spinner label="Đang tải thư viện…" />
      ) : (
        <>
          <div className="grid gap-2 grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10">
            {list.slice(0, limit).map((m) => (
              <Tile key={m.url} item={m} onClick={() => setDetail(m)} />
            ))}
          </div>
          {list.length > limit && (
            <p className="text-center mt-4">
              <button type="button" className="wp-btn" onClick={() => setLimit(limit + 120)}>
                Xem thêm ({list.length - limit} tệp)
              </button>
            </p>
          )}
        </>
      )}
      {detail && (
        <Modal title="Chi tiết tệp đính kèm" onClose={() => setDetail(null)} wide>
          <div className="grid md:grid-cols-[1fr_320px] min-h-full">
            <div className="wp-checker flex items-center justify-center p-4 min-h-[300px]">
              {detail.type === 'image' ? (
                <img src={detail.url} alt="" className="max-w-full max-h-[70vh] object-contain" />
              ) : (
                <FileText className="w-24 h-24 text-[#8c8f94]" />
              )}
            </div>
            <div className="p-4 border-l border-[var(--wp-line)] bg-[#f6f7f7] space-y-3 text-[13px]">
              <div>
                <strong>Tên tệp:</strong> <span className="break-all">{fileName(detail.url)}</span>
              </div>
              <div>
                <strong>Dung lượng:</strong> {formatBytes(detail.size)}
              </div>
              <div>
                <strong>Thư mục:</strong> {detail.url.replace(/\/[^/]+$/, '') || '/'}
              </div>
              <div>
                <div className="font-semibold mb-1">Đường dẫn tệp:</div>
                <CopyUrl url={detail.url} />
              </div>
              <a href={detail.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1">
                Mở tệp trong tab mới <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/**
 * The media modal of an image field or the editor: upload or choose from the library.
 * `multiple` lets the editor insert several pictures at once.
 */
export function MediaPicker({
  onPick,
  onClose,
  kind = 'image',
  multiple = false,
  title = 'Chọn tệp',
  action = 'Chọn',
}: {
  onPick: (urls: string[], items: MediaItem[]) => void;
  onClose: () => void;
  kind?: 'image' | 'any';
  multiple?: boolean;
  title?: string;
  action?: string;
}) {
  const { items, error, add } = useMedia();
  const [tab, setTab] = useState<'upload' | 'library'>('library');
  const [filter, setFilter] = useState<Filter>(kind === 'image' ? 'image' : 'all');
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState<MediaItem[]>([]);
  const [limit, setLimit] = useState(90);
  const list = useFiltered(items, filter, query);
  const last = picked[picked.length - 1];

  const toggle = (m: MediaItem) =>
    setPicked((p) => (p.some((x) => x.url === m.url) ? p.filter((x) => x.url !== m.url) : multiple ? [...p, m] : [m]));

  const tabBtn = (t: typeof tab, label: string) => (
    <button
      type="button"
      onClick={() => setTab(t)}
      className={`px-3 py-2 -mb-px border-b-4 cursor-pointer ${tab === t ? 'border-[var(--wp-blue)] font-semibold' : 'border-transparent text-[var(--wp-blue)]'}`}
    >
      {label}
    </button>
  );

  return (
    <Modal
      title={title}
      onClose={onClose}
      wide
      footer={
        <>
          {picked.length > 0 && <span className="mr-auto text-[13px] text-[var(--wp-muted)]">Đã chọn {picked.length} tệp</span>}
          <button type="button" className="wp-btn" onClick={onClose}>
            Hủy
          </button>
          <button type="button" className="wp-btn wp-btn-primary" disabled={!picked.length} onClick={() => onPick(picked.map((p) => p.url), picked)}>
            {action}
          </button>
        </>
      }
    >
      <div className="px-4 border-b border-[var(--wp-line)] flex gap-2">
        {tabBtn('upload', 'Tải tệp lên')}
        {tabBtn('library', 'Thư viện media')}
      </div>
      {tab === 'upload' ? (
        <div className="p-4">
          <Uploader
            accept={kind === 'image' ? 'image/*' : 'image/*,application/pdf'}
            onUploaded={(item) => {
              add(item);
              setPicked((p) => (multiple ? [...p, item] : [item]));
              setTab('library');
            }}
          />
        </div>
      ) : (
        <div className="grid md:grid-cols-[1fr_260px]">
          <div className="p-4">
            <Toolbar filter={filter} setFilter={setFilter} query={query} setQuery={setQuery} count={list.length} />
            {error ? (
              <div className="wp-notice is-error">{error}</div>
            ) : !items ? (
              <Spinner label="Đang tải thư viện…" />
            ) : (
              <>
                <div className="grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-6">
                  {list.slice(0, limit).map((m) => (
                    <Tile key={m.url} item={m} selected={picked.some((p) => p.url === m.url)} onClick={() => toggle(m)} />
                  ))}
                </div>
                {list.length > limit && (
                  <p className="text-center mt-4">
                    <button type="button" className="wp-btn" onClick={() => setLimit(limit + 90)}>
                      Xem thêm
                    </button>
                  </p>
                )}
              </>
            )}
          </div>
          <aside className="hidden md:block p-4 bg-[#f6f7f7] border-l border-[var(--wp-line)] text-[13px]">
            {last ? (
              <div className="space-y-2">
                <div className="font-semibold uppercase text-[12px] text-[var(--wp-muted)]">Chi tiết tệp</div>
                {last.type === 'image' && <img src={last.url} alt="" className="max-w-full max-h-40 object-contain wp-checker" />}
                <div className="break-all font-semibold">{fileName(last.url)}</div>
                <div className="text-[var(--wp-muted)]">{formatBytes(last.size)}</div>
                <CopyUrl url={last.url} />
              </div>
            ) : (
              <p className="m-0 text-[var(--wp-muted)]">Bấm vào một tệp để chọn.</p>
            )}
          </aside>
        </div>
      )}
    </Modal>
  );
}
