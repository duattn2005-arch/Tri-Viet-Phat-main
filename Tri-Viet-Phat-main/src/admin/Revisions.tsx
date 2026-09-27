import React, { useEffect, useMemo, useState } from 'react';
import { api, type Commit } from './api';
import { formatDateTime, plainText, timeAgo, type Field } from './schema';
import { Modal, Spinner } from './ui';

// "Bản sửa đổi": every save of an entry is a commit. Pick one to see what differs from the text
// being edited (words removed in red, added in green) and bring it back into the editor.

const MAX_WORDS = 1200;

/** Word-level difference between two texts (longest common subsequence). */
function diffWords(a: string, b: string): { text: string; kind: 'same' | 'del' | 'add' }[] | null {
  const x = a.split(/(\s+)/).filter(Boolean);
  const y = b.split(/(\s+)/).filter(Boolean);
  if (x.length > MAX_WORDS * 2 || y.length > MAX_WORDS * 2) return null;
  const n = x.length;
  const m = y.length;
  const table = new Uint16Array((n + 1) * (m + 1));
  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      table[i * (m + 1) + j] = x[i] === y[j] ? table[(i + 1) * (m + 1) + j + 1] + 1 : Math.max(table[(i + 1) * (m + 1) + j], table[i * (m + 1) + j + 1]);
    }
  }
  const out: { text: string; kind: 'same' | 'del' | 'add' }[] = [];
  const push = (text: string, kind: 'same' | 'del' | 'add') => {
    const last = out[out.length - 1];
    if (last && last.kind === kind) last.text += text;
    else out.push({ text, kind });
  };
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (x[i] === y[j]) {
      push(x[i], 'same');
      i++;
      j++;
    } else if (table[(i + 1) * (m + 1) + j] >= table[i * (m + 1) + j + 1]) push(x[i++], 'del');
    else push(y[j++], 'add');
  }
  while (i < n) push(x[i++], 'del');
  while (j < m) push(y[j++], 'add');
  return out;
}

/** A value as readable text: HTML as its words, lists and groups as lines. */
function readable(v: unknown, field?: Field): string {
  if (v == null) return '';
  if (typeof v === 'string') return field?.widget === 'html' || /<\/?[a-z][\s\S]*>/i.test(v) ? plainText(v) : v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  if (Array.isArray(v)) return v.map((x) => readable(x)).join('\n');
  return Object.entries(v as Record<string, unknown>)
    .map(([k, x]) => `${k}: ${readable(x)}`)
    .join(' · ');
}

export function RevisionsModal({
  collection,
  slug,
  fields,
  current,
  onRestore,
  onClose,
}: {
  collection: string;
  slug: string;
  fields: Field[];
  current: Record<string, any>;
  onRestore: (data: Record<string, any>) => void;
  onClose: () => void;
}) {
  const [commits, setCommits] = useState<Commit[] | null>(null);
  const [error, setError] = useState('');
  const [picked, setPicked] = useState<Commit | null>(null);
  const [version, setVersion] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.history(collection, slug).then(
      (list) => {
        setCommits(list);
        // The newest commit is the saved version; start by comparing with the one before it
        setPicked(list[1] ?? list[0] ?? null);
      },
      (e) => setError(e.message)
    );
  }, [collection, slug]);

  useEffect(() => {
    if (!picked) return;
    setLoading(true);
    setVersion(null);
    api.version(collection, slug, picked.sha).then(
      (v) => {
        setVersion(v.data);
        setLoading(false);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
      }
    );
  }, [collection, slug, picked]);

  const changes = useMemo(() => {
    if (!version) return [];
    const names = [...new Set([...fields.map((f) => f.name), ...Object.keys(version), ...Object.keys(current)])];
    return names
      .map((name) => ({ name, field: fields.find((f) => f.name === name) }))
      .filter(({ name }) => JSON.stringify(version[name] ?? null) !== JSON.stringify(current[name] ?? null))
      .map(({ name, field }) => ({ name, label: field?.label || name, before: readable(version[name], field), after: readable(current[name], field) }));
  }, [version, current, fields]);

  return (
    <Modal
      title="So sánh các bản sửa đổi"
      onClose={onClose}
      wide
      footer={
        <>
          <span className="mr-auto text-[13px] text-[var(--wp-muted)]">Khôi phục chỉ đưa bản cũ vào trình soạn thảo. Bấm “Cập nhật” để lưu lại.</span>
          <button type="button" className="wp-btn" onClick={onClose}>
            Đóng
          </button>
          <button type="button" className="wp-btn wp-btn-primary" disabled={!version || changes.length === 0} onClick={() => version && onRestore(version)}>
            Khôi phục bản này
          </button>
        </>
      }
    >
      {error && <div className="wp-notice is-error m-4">{error}</div>}
      {!commits ? (
        !error && (
          <div className="p-6">
            <Spinner label="Đang tải lịch sử…" />
          </div>
        )
      ) : (
        <div className="grid md:grid-cols-[280px_1fr] min-h-[60vh]">
          <ol className="m-0 p-0 list-none border-r border-[var(--wp-line)] bg-[#f6f7f7] max-h-[70vh] overflow-auto">
            {commits.map((c, i) => (
              <li key={c.sha}>
                <button
                  type="button"
                  onClick={() => setPicked(c)}
                  className={`w-full text-left px-3 py-2.5 border-b border-[var(--wp-line)] cursor-pointer ${picked?.sha === c.sha ? 'bg-white shadow-[inset_4px_0_0_var(--wp-blue)]' : 'hover:bg-white'}`}
                >
                  <div className="font-semibold text-[13px]">
                    {formatDateTime(c.date)} {i === 0 && <span className="font-normal text-[var(--wp-green)]">(bản đang lưu)</span>}
                  </div>
                  <div className="text-[12px] text-[var(--wp-muted)]">
                    {c.author} · {timeAgo(c.date)}
                  </div>
                  <div className="text-[12px] truncate">{c.message}</div>
                </button>
              </li>
            ))}
          </ol>
          <div className="p-4 overflow-auto max-h-[70vh]">
            {loading || !version ? (
              <Spinner label="Đang tải bản sửa đổi…" />
            ) : changes.length === 0 ? (
              <p className="m-0 text-[var(--wp-muted)]">Bản này giống hệt nội dung đang soạn.</p>
            ) : (
              <div className="space-y-5">
                <p className="m-0 text-[13px] text-[var(--wp-muted)]">
                  Khác biệt giữa bản ngày {picked && formatDateTime(picked.date)} và nội dung đang soạn:{' '}
                  <span className="bg-[#fcf0f1] text-[#8a2424] px-1">chữ đỏ</span> là của bản cũ, <span className="bg-[#edfaef] text-[#00450c] px-1">chữ xanh</span> là của bản hiện tại.
                </p>
                {changes.map((ch) => {
                  const parts = diffWords(ch.before, ch.after);
                  return (
                    <section key={ch.name}>
                      <h3 className="text-[14px] font-semibold m-0 mb-1.5">{ch.label}</h3>
                      {parts ? (
                        <div className="border border-[var(--wp-line)] p-3 whitespace-pre-wrap leading-relaxed text-[13.5px] bg-white">
                          {parts.map((p, i) =>
                            p.kind === 'same' ? (
                              <span key={i}>{p.text}</span>
                            ) : p.kind === 'del' ? (
                              <del key={i} className="bg-[#fcf0f1] text-[#8a2424] no-underline">
                                {p.text}
                              </del>
                            ) : (
                              <ins key={i} className="bg-[#edfaef] text-[#00450c] no-underline">
                                {p.text}
                              </ins>
                            )
                          )}
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-2 text-[13px]">
                          <div className="border border-[#f5c2c3] bg-[#fcf0f1] p-2 whitespace-pre-wrap max-h-60 overflow-auto">{ch.before || '(trống)'}</div>
                          <div className="border border-[#b8e6bf] bg-[#edfaef] p-2 whitespace-pre-wrap max-h-60 overflow-auto">{ch.after || '(trống)'}</div>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
