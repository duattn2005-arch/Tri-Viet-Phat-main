import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { api, type EntryRow } from './api';
import { go, useAdmin } from './App';
import { announceSaved } from './Shell';
import { fieldRoles, isDraft, optionLabel, optionsOf, SITE_URL, titleOf, viewPath, vnToIso, words, type Collection } from './schema';
import { PageTitle, Spinner } from './ui';

// "Tất cả bài viết": the WordPress list table with status links, search, month and category
// filters, sortable columns, row actions, bulk actions and pages of 20.

const PER_PAGE = 20;
type SortKey = 'title' | 'date' | 'order';

export function ListView({ collection }: { collection: Collection }) {
  return collection.files ? <FileList collection={collection} /> : <EntryList collection={collection} />;
}

/** "Trang" / "Cài đặt": a fixed set of pages, each opened in the editor. */
function FileList({ collection }: { collection: Collection }) {
  return (
    <div>
      <PageTitle>{words(collection).all}</PageTitle>
      {collection.description && <p className="mt-0">{collection.description}</p>}
      <table className="wp-table">
        <thead>
          <tr>
            <th className="font-semibold">Tên</th>
            <th className="hidden sm:table-cell">Hiện ở</th>
          </tr>
        </thead>
        <tbody>
          {(collection.files ?? []).map((f) => (
            <tr key={f.name}>
              <td>
                <a href={`#/c/${collection.name}/edit/${f.name}`} className="font-semibold text-[15px]">
                  {f.label}
                </a>
                <div className="row-actions">
                  <a href={`#/c/${collection.name}/edit/${f.name}`}>Chỉnh sửa</a>
                </div>
              </td>
              <td className="hidden sm:table-cell text-[var(--wp-muted)]">
                {collection.name === 'pages' ? (
                  <a href={`${SITE_URL}${viewPath(collection, f.name)}`} target="_blank" rel="noreferrer" className="text-[var(--wp-muted)]">
                    {viewPath(collection, f.name)}
                  </a>
                ) : (
                  'Toàn bộ website'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EntryList({ collection }: { collection: Collection }) {
  const { notify } = useAdmin();
  const w = words(collection);
  const fields = collection.fields ?? [];
  const R = useMemo(() => fieldRoles(collection, fields), [collection, fields]);
  const extraCols = useMemo(() => ['model', 'brand', 'location'].filter((n) => fields.some((f) => f.name === n)).slice(0, 2), [fields]);

  const [rows, setRows] = useState<EntryRow[] | null>(null);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'' | 'Published' | 'Pending'>('');
  const [query, setQuery] = useState('');
  const [queryInput, setQueryInput] = useState('');
  const [monthInput, setMonthInput] = useState('');
  const [catInput, setCatInput] = useState('');
  const [month, setMonth] = useState('');
  const [cat, setCat] = useState('');
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>(() =>
    R.date ? { key: 'date', dir: -1 } : R.order ? { key: 'order', dir: 1 } : { key: 'title', dir: 1 }
  );
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [bulk, setBulk] = useState('');
  const [busy, setBusy] = useState('');

  useEffect(() => {
    api.list(collection.name).then(setRows, (e) => setError(e.message));
  }, [collection.name]);

  const months = useMemo(() => {
    const set = new Set<string>();
    rows?.forEach((r) => {
      const iso = vnToIso(r.data.date);
      if (iso) set.add(iso.slice(0, 7));
    });
    return [...set].sort().reverse();
  }, [rows]);

  const visible = useMemo(() => {
    if (!rows) return [];
    const q = query.trim().toLowerCase();
    const list = rows
      .filter((r) => !status || (status === 'Pending') === isDraft(r.data))
      .filter((r) => !month || vnToIso(r.data.date).startsWith(month))
      .filter((r) => !cat || r.data[R.category!.name] === cat)
      .filter((r) => !q || [titleOf(collection, r.data), r.slug, ...extraCols.map((c) => r.data[c])].join(' ').toLowerCase().includes(q));
    const value = (r: EntryRow) =>
      sort.key === 'title' ? titleOf(collection, r.data).toLowerCase() : sort.key === 'date' ? vnToIso(r.data.date) : Number(r.data.order ?? 0);
    return list.sort((a, b) => {
      const x = value(a);
      const y = value(b);
      return (x < y ? -1 : x > y ? 1 : 0) * sort.dir;
    });
  }, [rows, status, month, cat, query, sort, collection, R.category, extraCols]);

  const pages = Math.max(1, Math.ceil(visible.length / PER_PAGE));
  const pageRows = visible.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  useEffect(() => setPage(1), [status, month, cat, query]);

  const counts = {
    all: rows?.length ?? 0,
    published: rows?.filter((r) => !isDraft(r.data)).length ?? 0,
    drafts: rows?.filter((r) => isDraft(r.data)).length ?? 0,
  };

  const toggleSort = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: key === 'date' ? -1 : 1 }));

  const removeOne = async (r: EntryRow) => {
    const t = titleOf(collection, r.data) || r.slug;
    if (!r.sha || !window.confirm(`Xóa vĩnh viễn ${w.singular} “${t}”? Có thể lấy lại từ trang Sao lưu nếu cần.`)) return;
    try {
      await api.remove(collection.name, r.slug, r.sha, t);
      announceSaved();
      setRows((list) => list?.filter((x) => x.slug !== r.slug) ?? null);
      notify({ kind: 'success', text: `Đã xóa ${w.singular} “${t}”.` });
    } catch (e: any) {
      notify({ kind: 'error', text: e.message });
    }
  };

  const applyBulk = async () => {
    const chosen = (rows ?? []).filter((r) => selected.has(r.slug));
    if (!bulk || chosen.length === 0) return;
    if (bulk === 'delete' && !window.confirm(`Xóa vĩnh viễn ${chosen.length} ${w.singular}?`)) return;
    let done = 0;
    const failed: string[] = [];
    for (const r of chosen) {
      setBusy(`Đang xử lý ${done + 1}/${chosen.length}…`);
      try {
        if (bulk === 'delete') {
          await api.remove(collection.name, r.slug, r.sha!, titleOf(collection, r.data));
          setRows((list) => list?.filter((x) => x.slug !== r.slug) ?? null);
        } else {
          // The list holds short fields only: change the status on the full entry
          const full = await api.get(collection.name, r.slug);
          const data = { ...full.data, status: bulk };
          const res = await api.save(collection.name, r.slug, data, full.sha);
          setRows((list) => list?.map((x) => (x.slug === r.slug ? { ...x, sha: res.sha, data: { ...x.data, status: bulk } } : x)) ?? null);
        }
        done++;
      } catch {
        failed.push(titleOf(collection, r.data) || r.slug);
      }
    }
    setBusy('');
    setSelected(new Set());
    if (done) announceSaved();
    const verb = bulk === 'delete' ? 'Đã xóa' : bulk === 'Pending' ? 'Đã chuyển thành bản nháp' : 'Đã xuất bản';
    notify(
      failed.length
        ? { kind: 'error', text: `${verb} ${done} mục. Không xử lý được: ${failed.join(', ')}.` }
        : { kind: 'success', text: `${verb} ${done} ${w.singular}.` }
    );
  };

  const allOnPage = pageRows.length > 0 && pageRows.every((r) => selected.has(r.slug));
  const toggleAll = () =>
    setSelected((s) => {
      const next = new Set(s);
      pageRows.forEach((r) => (allOnPage ? next.delete(r.slug) : next.add(r.slug)));
      return next;
    });

  const statusLink = (value: typeof status, label: string, count: number) => (
    <button type="button" onClick={() => setStatus(value)} className={`cursor-pointer ${status === value ? 'font-semibold text-[var(--wp-text)]' : 'text-[var(--wp-blue)]'}`}>
      {label} <span className="text-[var(--wp-muted)] font-normal">({count})</span>
    </button>
  );

  const SortHead = ({ k, children, className = '' }: { k: SortKey; children: React.ReactNode; className?: string }) => (
    <th className={className}>
      <button type="button" className="inline-flex items-center gap-1 text-[var(--wp-blue)] cursor-pointer" onClick={() => toggleSort(k)}>
        {children}
        {sort.key === k && (sort.dir === 1 ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
      </button>
    </th>
  );

  const pager = (
    <div className="flex items-center gap-1.5 text-[13px]">
      <span className="text-[var(--wp-muted)] mr-1">{visible.length} mục</span>
      {pages > 1 && (
        <>
          <button type="button" className="wp-btn wp-btn-sm" disabled={page === 1} onClick={() => setPage(1)} aria-label="Trang đầu">
            «
          </button>
          <button type="button" className="wp-btn wp-btn-sm" disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Trang trước">
            ‹
          </button>
          <span className="px-1">
            {page} / {pages}
          </span>
          <button type="button" className="wp-btn wp-btn-sm" disabled={page === pages} onClick={() => setPage(page + 1)} aria-label="Trang sau">
            ›
          </button>
          <button type="button" className="wp-btn wp-btn-sm" disabled={page === pages} onClick={() => setPage(pages)} aria-label="Trang cuối">
            »
          </button>
        </>
      )}
    </div>
  );

  return (
    <div>
      <PageTitle
        action={
          collection.create !== false && (
            <a className="wp-btn" href={`#/c/${collection.name}/new`}>
              {w.add}
            </a>
          )
        }
      >
        {w.menu}
      </PageTitle>
      {collection.description && <p className="mt-0 text-[var(--wp-muted)]">{collection.description}</p>}

      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <div className="flex flex-wrap items-center gap-1.5 text-[13px]">
          {statusLink('', 'Tất cả', counts.all)}
          {R.status && (
            <>
              <span className="text-[#a7aaad]">|</span>
              {statusLink('Published', 'Đã xuất bản', counts.published)}
              {counts.drafts > 0 && (
                <>
                  <span className="text-[#a7aaad]">|</span>
                  {statusLink('Pending', 'Bản nháp', counts.drafts)}
                </>
              )}
            </>
          )}
        </div>
        <form
          className="flex gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(queryInput);
          }}
        >
          <input className="wp-input !w-56" type="search" aria-label="Tìm kiếm" value={queryInput} onChange={(e) => setQueryInput(e.target.value)} />
          <button className="wp-btn" type="submit">
            Tìm {w.singular}
          </button>
        </form>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <select className="wp-input !w-auto" value={bulk} onChange={(e) => setBulk(e.target.value)} aria-label="Hành động hàng loạt">
            <option value="">Hành động</option>
            {R.status && <option value="Published">Xuất bản</option>}
            {R.status && <option value="Pending">Chuyển thành bản nháp</option>}
            {collection.delete !== false && <option value="delete">Xóa vĩnh viễn</option>}
          </select>
          <button type="button" className="wp-btn" disabled={!bulk || selected.size === 0 || !!busy} onClick={applyBulk}>
            Áp dụng
          </button>
          {R.date && (
            <select className="wp-input !w-auto ml-2" value={monthInput} onChange={(e) => setMonthInput(e.target.value)} aria-label="Lọc theo tháng">
              <option value="">Tất cả các tháng</option>
              {months.map((m) => (
                <option key={m} value={m}>
                  Tháng {Number(m.slice(5))}/{m.slice(0, 4)}
                </option>
              ))}
            </select>
          )}
          {R.category && (
            <select className="wp-input !w-auto" value={catInput} onChange={(e) => setCatInput(e.target.value)} aria-label="Lọc theo danh mục">
              <option value="">Tất cả danh mục</option>
              {optionsOf(R.category).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}
          {(R.date || R.category) && (
            <button
              type="button"
              className="wp-btn"
              onClick={() => {
                setMonth(monthInput);
                setCat(catInput);
              }}
            >
              Lọc
            </button>
          )}
          {busy && <Spinner label={busy} />}
        </div>
        {pager}
      </div>

      {error ? (
        <div className="wp-notice is-error">{error}</div>
      ) : !rows ? (
        <div className="wp-box p-6">
          <Spinner label="Đang tải danh sách…" />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="wp-table">
            <thead>
              <tr>
                <th className="check">
                  <input type="checkbox" checked={allOnPage} onChange={toggleAll} aria-label="Chọn tất cả" />
                </th>
                {R.image && <th className="w-[62px] hidden sm:table-cell" aria-label="Ảnh" />}
                <SortHead k="title">{R.title?.label || 'Tiêu đề'}</SortHead>
                {extraCols.map((c) => (
                  <th key={c} className="hidden md:table-cell">
                    {fields.find((f) => f.name === c)?.label}
                  </th>
                ))}
                {R.category && <th className="hidden md:table-cell">Danh mục</th>}
                {R.order && <SortHead k="order" className="hidden lg:table-cell w-[90px]">Thứ tự</SortHead>}
                {R.date && <SortHead k="date" className="w-[130px]">Ngày</SortHead>}
              </tr>
            </thead>
            <tbody>
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-6 text-center text-[var(--wp-muted)]">
                    Không tìm thấy {w.singular} nào.
                  </td>
                </tr>
              )}
              {pageRows.map((r) => {
                const title = titleOf(collection, r.data) || '(không có tiêu đề)';
                const draft = isDraft(r.data);
                const edit = `#/c/${collection.name}/edit/${r.slug}`;
                return (
                  <tr key={r.slug}>
                    <td className="check">
                      <input
                        type="checkbox"
                        aria-label={`Chọn ${title}`}
                        checked={selected.has(r.slug)}
                        onChange={() =>
                          setSelected((s) => {
                            const next = new Set(s);
                            if (next.has(r.slug)) next.delete(r.slug);
                            else next.add(r.slug);
                            return next;
                          })
                        }
                      />
                    </td>
                    {R.image && (
                      <td className="hidden sm:table-cell">
                        {r.data[R.image.name] ? (
                          <a href={edit}>
                            <img src={r.data[R.image.name]} alt="" loading="lazy" className="w-[52px] h-[52px] object-cover bg-[#f0f0f1] border border-[var(--wp-line)]" />
                          </a>
                        ) : (
                          <span className="block w-[52px] h-[52px] bg-[#f0f0f1]" />
                        )}
                      </td>
                    )}
                    <td>
                      <a href={edit} className="font-semibold text-[15px] no-underline hover:underline">
                        {title}
                      </a>
                      {draft && <strong className="text-[var(--wp-muted)]"> — Bản nháp</strong>}
                      <div className="row-actions">
                        <a href={edit}>Chỉnh sửa</a>
                        {collection.delete !== false && (
                          <>
                            {' | '}
                            <button type="button" className="wp-link wp-link-danger" onClick={() => removeOne(r)}>
                              Xóa
                            </button>
                          </>
                        )}
                        {!draft && (
                          <>
                            {' | '}
                            <a href={`${SITE_URL}${viewPath(collection, r.slug)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-0.5">
                              Xem <ExternalLink className="w-3 h-3" />
                            </a>
                          </>
                        )}
                      </div>
                    </td>
                    {extraCols.map((c) => (
                      <td key={c} className="hidden md:table-cell text-[13px]">
                        {r.data[c] || '—'}
                      </td>
                    ))}
                    {R.category && (
                      <td className="hidden md:table-cell">
                        {r.data[R.category.name] ? (
                          <button
                            type="button"
                            className="wp-link text-left"
                            onClick={() => {
                              setCatInput(r.data[R.category!.name]);
                              setCat(r.data[R.category!.name]);
                            }}
                          >
                            {optionLabel(R.category, r.data[R.category.name])}
                          </button>
                        ) : (
                          '—'
                        )}
                      </td>
                    )}
                    {R.order && <td className="hidden lg:table-cell">{r.data.order ?? 0}</td>}
                    {R.date && (
                      <td className="text-[13px]">
                        {draft ? 'Bản nháp' : 'Đã xuất bản'}
                        <br />
                        {r.data.date || '—'}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-end mt-2">{rows && pager}</div>
      {rows && collection.create !== false && rows.length === 0 && (
        <p className="mt-4">
          <button type="button" className="wp-btn wp-btn-primary" onClick={() => go(`/c/${collection.name}/new`)}>
            {w.add}
          </button>
        </p>
      )}
    </div>
  );
}
