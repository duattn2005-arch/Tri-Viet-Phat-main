import React, { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, Eye, History, ImagePlus, KeyRound, Settings2 } from 'lucide-react';
import { api } from './api';
import { go, useAdmin } from './App';
import { announceSaved } from './Shell';
import { FieldControl, FieldRow, problems } from './Fields';
import { MediaPicker } from './Media';
import { RevisionsModal } from './Revisions';
import { analyze, Dot, SeoBox } from './Seo';
import { cleanHtml } from './html';
import {
  defaultsFor,
  fieldRoles,
  hasOwnPage,
  isDraft,
  isoToVn,
  optionsOf,
  plainText,
  SITE_URL,
  SLUG_RE,
  slugify,
  titleOf,
  viewPath,
  vnToIso,
  words,
  type Collection,
  type Field,
} from './schema';
import { Box, Modal, PageTitle, Spinner, useStored } from './ui';

const RichEditor = lazy(() => import('./RichEditor'));

// "Sửa bài viết" / "Viết bài mới": the WordPress classic editor. Title and permalink on top, the
// editor, boxes below it (Tóm tắt, SEO, other fields) and on the right (Xuất bản, Danh mục,
// Ảnh đại diện, Thuộc tính). Pages and settings open as one form with a Publish box.

const SITE_NAME = 'Trí Đức';

/** Page texts may be left empty (the website keeps its own text), so none of their fields is required. */
const optional = (fields: Field[]): Field[] =>
  fields.map((f) => ({ ...f, required: false, fields: f.fields && optional(f.fields), field: f.field && optional([f.field])[0] }));

/** The title Google shows, as the website builds it (src/seo/routes.ts). */
const googleTitle = (seoTitle: string, title: string) => {
  if (seoTitle.trim()) return seoTitle.trim();
  const full = `${title} | ${SITE_NAME}`;
  return full.length <= 60 ? full : title;
};

export function EditView({ collection, slug }: { collection: Collection; slug?: string }) {
  const { notify, setDirty } = useAdmin();
  const isNew = !slug;
  const page = collection.files?.find((f) => f.name === slug);
  const fields: Field[] = useMemo(() => (page ? optional(page.fields ?? []) : (collection.fields ?? [])), [page, collection.fields]);
  const folder = !!collection.folder;
  const w = words(collection);
  const R = useMemo(() => fieldRoles(collection, fields), [collection, fields]);

  const [loaded, setLoaded] = useState<{ sha: string | null; data: Record<string, any> } | null>(null);
  const [data, setData] = useState<Record<string, any>>({});
  const [loadError, setLoadError] = useState('');
  const [newSlug, setNewSlug] = useState('');
  const [slugTouched, setSlugTouched] = useState(false);
  const [editingSlug, setEditingSlug] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editorKey, setEditorKey] = useState(0);
  const [revisions, setRevisions] = useState<number | null>(null);
  const [showRevisions, setShowRevisions] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [invalid, setInvalid] = useState<Set<string>>(new Set());
  const [hidden, setHidden] = useStored<string[]>(`hidden:${collection.name}`, []);

  useEffect(() => {
    if (isNew) {
      const initial = defaultsFor(fields);
      setLoaded({ sha: null, data: initial });
      setData(initial);
      return;
    }
    api.get(collection.name, slug!).then(
      (e) => {
        setLoaded({ sha: e.sha, data: e.data });
        setData(e.data);
      },
      (err) => setLoadError(err.message)
    );
    api.history(collection.name, slug!).then(
      (h) => setRevisions(h.length),
      () => setRevisions(null)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collection.name, slug]);

  const dirty = !!loaded && JSON.stringify(data) !== JSON.stringify(loaded.data);
  useEffect(() => {
    setDirty(dirty);
    return () => setDirty(false);
  }, [dirty, setDirty]);

  const set = useCallback((name: string, value: any) => {
    setData((d) => {
      const next = { ...d };
      if (value === undefined) delete next[name];
      else next[name] = value;
      return next;
    });
    setInvalid((s) => (s.has(name) ? new Set([...s].filter((x) => x !== name)) : s));
  }, []);

  const title = folder ? titleOf(collection, data) : '';
  useEffect(() => {
    if (isNew && !slugTouched) setNewSlug(slugify(title));
  }, [title, isNew, slugTouched]);
  const currentSlug = isNew ? newSlug : slug!;
  const draft = !!R.status && isDraft(data);
  const bodyHtml = R.body ? String(data[R.body.name] ?? '') : '';

  // ---- Saving ------------------------------------------------------------------------------------
  const save = async (status?: 'Published' | 'Pending') => {
    if (!loaded || saving) return;
    const next: Record<string, any> = { ...data };
    if (status && R.status) next[R.status.name] = status;
    for (const f of fields) if (f.widget === 'html' && typeof next[f.name] === 'string') next[f.name] = cleanHtml(next[f.name]);

    if (folder && R.body) {
      const body = String(next[R.body.name] ?? '');
      // Like WordPress: no excerpt = the start of the article; no featured image = its first picture
      if (R.excerpt && !String(next[R.excerpt.name] ?? '').trim() && body) {
        const text = plainText(body);
        if (text) next[R.excerpt.name] = text.length > 220 ? `${text.slice(0, 220).replace(/\s+\S*$/, '')}…` : text;
      }
      if (R.image && !next[R.image.name]) {
        const first = /<img[^>]+src="([^"]+)"/i.exec(body)?.[1];
        if (first) next[R.image.name] = first;
      }
    }

    const isDraftSave = !!R.status && next[R.status.name] === 'Pending';
    // A draft needs only its title
    const issues = isDraftSave ? problems(fields.filter((f) => f === R.title), next) : problems(fields, next);
    if (issues.length) {
      setInvalid(new Set(issues.map((i) => i.name)));
      notify({
        kind: 'error',
        text: (
          <>
            Chưa lưu được, vui lòng kiểm tra:
            <ul className="m-0 mt-1 pl-5 list-disc">
              {issues.map((i) => (
                <li key={i.name}>{i.message}</li>
              ))}
            </ul>
          </>
        ),
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (isNew && !SLUG_RE.test(newSlug)) {
      notify({ kind: 'error', text: 'Đường dẫn chỉ gồm chữ thường không dấu, số và dấu gạch ngang. Hãy nhập tiêu đề hoặc sửa đường dẫn.' });
      return;
    }

    setSaving(true);
    try {
      const res = await api.save(collection.name, currentSlug, next, loaded.sha);
      setLoaded({ sha: res.sha, data: next });
      setData(next);
      setDirty(false);
      setRevisions((n) => (n ?? 0) + 1);
      announceSaved();
      const verb = isDraftSave ? 'Đã lưu bản nháp' : isNew ? `Đã đăng ${w.singular}` : page ? `Đã cập nhật “${page.label}”` : `Đã cập nhật ${w.singular}`;
      notify({
        kind: 'success',
        text: (
          <>
            {verb}.{' '}
            {!isDraftSave && (folder || collection.name === 'pages') && (
              <a href={`${SITE_URL}${viewPath(collection, currentSlug)}`} target="_blank" rel="noreferrer">
                Xem trên website
              </a>
            )}{' '}
            <span className="text-[var(--wp-muted)]">{isDraftSave ? '(bản nháp không hiện trên website)' : '(website cập nhật sau khoảng 3–6 phút)'}</span>
          </>
        ),
      });
      if (isNew) go(`/c/${collection.name}/edit/${currentSlug}`);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      notify({ kind: 'error', text: err.message });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  // Ctrl+S saves, as in WordPress
  const saveRef = useRef(save);
  saveRef.current = save;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        saveRef.current();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const trash = async () => {
    if (!loaded?.sha || !window.confirm(`Xóa vĩnh viễn ${w.singular} “${title || slug}”? Có thể lấy lại từ trang Sao lưu nếu cần.`)) return;
    try {
      await api.remove(collection.name, slug!, loaded.sha, title);
      setDirty(false);
      announceSaved();
      notify({ kind: 'success', text: `Đã xóa ${w.singular} “${title || slug}”.` });
      go(`/c/${collection.name}`);
    } catch (err: any) {
      notify({ kind: 'error', text: err.message });
    }
  };

  // ---- SEO -------------------------------------------------------------------------------------------
  const seoInput = useMemo(
    () => ({
      keyphrase: String(data.seoKeyphrase ?? ''),
      googleTitle: googleTitle(String(data.seoTitle ?? ''), title),
      description: String(data.seoDescription || data.excerpt || data.shortDesc || ''),
      slug: currentSlug,
      path: viewPath(collection, currentSlug || 'duong-dan'),
      html: bodyHtml || (data.fullDesc ? `<p>${String(data.fullDesc)}</p>` : ''),
      date: data.date,
    }),
    [data.seoKeyphrase, data.seoTitle, data.seoDescription, data.excerpt, data.shortDesc, data.fullDesc, data.date, title, currentSlug, collection, bodyHtml]
  );
  const seoResult = useMemo(() => (R.seo ? analyze(seoInput) : null), [R.seo, seoInput]);

  if (loadError) return <div className="wp-notice is-error">{loadError}</div>;
  if (!loaded) return <Spinner label="Đang tải…" />;

  const heading = page ? `Sửa trang: ${page.label}` : isNew ? w.add : `Sửa ${w.singular}`;
  const permalink = `${SITE_URL}${viewPath(collection, currentSlug || '…')}`;

  // ---- Boxes -------------------------------------------------------------------------------------------
  type BoxDef = { id: string; title: string; node: React.ReactNode; flush?: boolean };
  const side: BoxDef[] = [];
  const main: BoxDef[] = [];

  if (folder && R.category) {
    const f = R.category;
    side.push({
      id: 'category',
      title: f.label || 'Danh mục',
      node: (
        <div className="max-h-60 overflow-auto space-y-1.5">
          {optionsOf(f).map((o) => (
            <label key={o.value} className="flex items-start gap-2 cursor-pointer">
              <input type="radio" className="mt-1" name={`cat-${collection.name}`} checked={data[f.name] === o.value} onChange={() => set(f.name, o.value)} />
              <span>{o.label}</span>
            </label>
          ))}
          {invalid.has(f.name) && <p className="m-0 text-[var(--wp-red)] text-[13px]">Hãy chọn một danh mục.</p>}
        </div>
      ),
    });
  }
  if (folder && R.image) {
    side.push({
      id: 'image',
      title: R.body ? 'Ảnh đại diện' : R.image.label || 'Ảnh',
      node: <FeaturedImage value={String(data[R.image.name] ?? '')} onChange={(v) => set(R.image!.name, v)} invalid={invalid.has(R.image.name)} />,
    });
  }
  if (folder && R.order) {
    side.push({
      id: 'attributes',
      title: 'Thuộc tính',
      node: (
        <div>
          <label className="wp-label" htmlFor="attr-order">
            {R.order.label}
          </label>
          <FieldControl field={R.order} value={data[R.order.name]} onChange={(v) => set(R.order!.name, v)} />
          {R.order.hint && <p className="wp-hint">{R.order.hint}</p>}
        </div>
      ),
    });
  }

  if (folder && R.excerpt) {
    main.push({
      id: 'excerpt',
      title: R.excerpt.label || 'Tóm tắt',
      node: (
        <>
          <textarea
            className={`wp-input${invalid.has(R.excerpt.name) ? ' is-invalid' : ''}`}
            rows={4}
            value={data[R.excerpt.name] ?? ''}
            onChange={(e) => set(R.excerpt!.name, e.target.value)}
          />
          <p className="wp-hint">Hiện trong danh sách bài và khi chia sẻ lên Facebook, Zalo. Bỏ trống thì lấy đoạn đầu của bài.</p>
        </>
      ),
    });
  }
  if (folder && R.seo) {
    main.push({
      id: 'seo',
      title: 'SEO',
      node: (
        <SeoBox
          input={seoInput}
          values={{ seoKeyphrase: data.seoKeyphrase ?? '', seoTitle: data.seoTitle ?? '', seoDescription: data.seoDescription ?? '' }}
          onChange={(k, v) => set(k, v || undefined)}
          titlePlaceholder={googleTitle('', title)}
          descriptionPlaceholder={String(data.excerpt || data.shortDesc || 'Bỏ trống thì dùng phần tóm tắt')}
        />
      ),
    });
  }
  const restFields = folder ? R.rest : fields;
  if (restFields.length) {
    main.push({
      id: 'details',
      title: page ? 'Nội dung trang' : `Thông tin ${w.singular}`,
      node: (
        <>
          {page && <p className="mt-0 mb-1 text-[13px] text-[var(--wp-muted)]">Để trống một ô thì website dùng chữ hoặc ảnh có sẵn.</p>}
          {restFields.map((f) => (
            <FieldRow key={f.name} field={f} value={data[f.name]} onChange={(v) => set(f.name, v)} invalid={invalid.has(f.name)} />
          ))}
        </>
      ),
    });
  }

  const shown = (b: BoxDef) => !hidden.includes(b.id);
  const renderBoxes = (list: BoxDef[]) =>
    list.filter(shown).map((b) => (
      <div key={b.id} id={`box-${b.id}`}>
        <Box id={`${collection.name}:${b.id}`} title={b.title} flush={b.flush}>
          {b.node}
        </Box>
      </div>
    ));

  // ---- Xuất bản ------------------------------------------------------------------------------------------
  const row = 'flex items-start gap-2 py-1.5';
  const icon = 'w-4 h-4 mt-0.5 text-[#8c8f94] shrink-0';
  const publishBox = (
    <>
      <div className="p-3 space-y-1">
        <div className="flex items-center justify-between gap-2 pb-2">
          {R.status && (isNew || draft) ? (
            <button type="button" className="wp-btn" disabled={saving} onClick={() => save('Pending')}>
              Lưu nháp
            </button>
          ) : (
            <span />
          )}
          {folder ? (
            <button type="button" className="wp-btn" onClick={() => setShowPreview(true)}>
              Xem trước
            </button>
          ) : collection.name === 'pages' ? (
            <a className="wp-btn" href={`${SITE_URL}${viewPath(collection, slug!)}`} target="_blank" rel="noreferrer">
              Xem trang
            </a>
          ) : null}
        </div>

        {R.status && (
          <InlineEdit
            icon={<KeyRound className={icon} />}
            label="Trạng thái"
            shown={isNew ? 'Bản nháp chưa lưu' : draft ? 'Bản nháp' : 'Đã xuất bản'}
            editor={(close) => (
              <select
                className="wp-input !w-auto mt-1.5 block"
                value={draft ? 'Pending' : 'Published'}
                onChange={(e) => {
                  set(R.status!.name, e.target.value);
                  close();
                }}
              >
                <option value="Published">Đã xuất bản</option>
                <option value="Pending">Bản nháp (ẩn khỏi website)</option>
              </select>
            )}
          />
        )}

        {!isNew && (
          <div className={row}>
            <History className={icon} />
            <div className="flex-1">
              Bản sửa đổi: <strong>{revisions ?? '…'}</strong>
              {!!revisions && (
                <button type="button" className="wp-link ml-1" onClick={() => setShowRevisions(true)}>
                  Xem lại
                </button>
              )}
            </div>
          </div>
        )}

        {R.date && (
          <InlineEdit
            icon={<CalendarDays className={icon} />}
            label={draft || isNew ? 'Ngày đăng' : 'Đã xuất bản ngày'}
            shown={String(data[R.date.name] || 'chưa đặt')}
            editor={(close) => (
              <input
                type="date"
                className="wp-input !w-auto mt-1.5 block"
                value={vnToIso(data[R.date!.name])}
                onChange={(e) => {
                  if (e.target.value) set(R.date!.name, isoToVn(e.target.value));
                  close();
                }}
              />
            )}
          />
        )}

        {seoResult && (
          <>
            <button type="button" className={`${row} w-full text-left cursor-pointer`} onClick={() => document.getElementById('box-seo')?.scrollIntoView({ behavior: 'smooth' })}>
              <span className="mt-1">
                <Dot rating={seoResult.seoScore.rating} />
              </span>
              <span>
                <span className="text-[var(--wp-blue)] underline">Phân tích SEO</span>: <strong>{seoResult.seoScore.label}</strong>
              </span>
            </button>
            <button type="button" className={`${row} w-full text-left cursor-pointer`} onClick={() => document.getElementById('box-seo')?.scrollIntoView({ behavior: 'smooth' })}>
              <span className="mt-1">
                <Dot rating={seoResult.readScore.rating} />
              </span>
              <span>
                <span className="text-[var(--wp-blue)] underline">Phân tích khả năng đọc</span>: <strong>{seoResult.readScore.label}</strong>
              </span>
            </button>
          </>
        )}
      </div>
      <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-[#f6f7f7] border-t border-[var(--wp-line)]">
        {!isNew && folder && collection.delete !== false ? (
          <button type="button" onClick={trash} className="wp-link wp-link-danger text-[13px]">
            Xóa vĩnh viễn
          </button>
        ) : (
          <span />
        )}
        <button type="button" className="wp-btn wp-btn-primary wp-btn-lg" disabled={saving} onClick={() => save(R.status && (isNew || draft) ? 'Published' : undefined)}>
          {saving ? 'Đang lưu…' : R.status && (isNew || draft) ? 'Đăng' : 'Cập nhật'}
        </button>
      </div>
    </>
  );

  const allBoxes = [...side, ...main];

  return (
    <div>
      {allBoxes.length > 1 && <ScreenOptions boxes={allBoxes.map((b) => ({ id: b.id, title: b.title }))} hidden={hidden} setHidden={setHidden} />}
      <PageTitle
        action={
          folder && collection.create !== false && !isNew ? (
            <a className="wp-btn" href={`#/c/${collection.name}/new`}>
              {w.add}
            </a>
          ) : undefined
        }
      >
        {heading}
      </PageTitle>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <div className="flex-1 min-w-0 w-full space-y-5">
          {folder && R.title && (
            <div>
              <input
                className={`wp-input !text-[1.7em] !px-2.5 !py-1 !min-h-[46px]${invalid.has(R.title.name) ? ' is-invalid' : ''}`}
                placeholder={collection.name === 'products' ? 'Tên sản phẩm' : 'Thêm tiêu đề'}
                value={data[R.title.name] ?? ''}
                onChange={(e) => set(R.title!.name, e.target.value)}
                autoFocus={isNew}
                aria-label={R.title.label}
              />
              <div className="mt-2 text-[13px] text-[var(--wp-muted)] flex flex-wrap items-center gap-1.5 break-all">
                <span className="font-semibold">{hasOwnPage(collection) ? 'Đường dẫn:' : 'Tên tệp:'}</span>
                {isNew && editingSlug ? (
                  <>
                    <input
                      className="wp-input !w-72 !min-h-[26px] !py-0 !text-[13px]"
                      value={newSlug}
                      autoFocus
                      onChange={(e) => {
                        setSlugTouched(true);
                        setNewSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'));
                      }}
                    />
                    <button type="button" className="wp-btn wp-btn-sm" onClick={() => setEditingSlug(false)}>
                      OK
                    </button>
                  </>
                ) : (
                  <>
                    {hasOwnPage(collection) ? (
                      isNew || draft ? (
                        <span className="text-[var(--wp-text)]">{permalink}</span>
                      ) : (
                        <a href={permalink} target="_blank" rel="noreferrer">
                          {permalink}
                        </a>
                      )
                    ) : (
                      <span className="text-[var(--wp-text)]">{currentSlug || '…'}.json</span>
                    )}
                    {isNew && (
                      <button type="button" className="wp-btn wp-btn-sm" onClick={() => setEditingSlug(true)}>
                        Chỉnh sửa
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )}

          {folder && R.body && (
            <div>
              {R.body.required === false && <div className="wp-label">{R.body.label}</div>}
              <Suspense fallback={<div className="wp-box min-h-[520px] flex items-center justify-center">{<Spinner label="Đang tải trình soạn thảo…" />}</div>}>
                <RichEditor key={editorKey} value={bodyHtml} onChange={(html) => set(R.body!.name, html)} />
              </Suspense>
              {R.body.hint && <p className="wp-hint">{R.body.hint}</p>}
            </div>
          )}

          {renderBoxes(main)}
        </div>

        <aside className="w-full lg:w-[280px] shrink-0 space-y-5">
          <Box id={`${collection.name}:publish`} title="Xuất bản" flush>
            {publishBox}
          </Box>
          {renderBoxes(side)}
          {dirty && <p className="m-0 text-[12px] text-[var(--wp-muted)]">Có thay đổi chưa lưu. Nhấn Ctrl+S để lưu nhanh.</p>}
        </aside>
      </div>

      {showRevisions && slug && (
        <RevisionsModal
          collection={collection.name}
          slug={slug}
          fields={fields}
          current={data}
          onClose={() => setShowRevisions(false)}
          onRestore={(restored) => {
            setData(restored);
            setEditorKey((k) => k + 1);
            setShowRevisions(false);
            notify({ kind: 'info', text: 'Đã đưa bản cũ vào trình soạn thảo. Bấm “Cập nhật” để lưu lại, hoặc tải lại trang để bỏ qua.' });
          }}
        />
      )}
      {showPreview && <Preview collection={collection} data={data} title={title} body={bodyHtml} onClose={() => setShowPreview(false)} />}
    </div>
  );
}

/** "Trạng thái: Đã xuất bản  Chỉnh sửa" rows of the Publish box. */
function InlineEdit({ icon, label, shown, editor }: { icon: React.ReactNode; label: string; shown: string; editor: (close: () => void) => React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex items-start gap-2 py-1.5">
      {icon}
      <div className="flex-1">
        {label}: <strong>{shown}</strong>
        {open ? (
          <>
            {editor(() => setOpen(false))}
            <button type="button" className="wp-link text-[13px] mt-1" onClick={() => setOpen(false)}>
              Hủy
            </button>
          </>
        ) : (
          <button type="button" className="wp-link ml-1" onClick={() => setOpen(true)}>
            Chỉnh sửa
          </button>
        )}
      </div>
    </div>
  );
}

function FeaturedImage({ value, onChange, invalid }: { value: string; onChange: (v: string) => void; invalid?: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      {value ? (
        <>
          <button type="button" className="block w-full wp-checker border border-[var(--wp-line)] cursor-pointer" onClick={() => setOpen(true)} title="Đổi ảnh">
            <img src={value} alt="" className="block w-full max-h-56 object-contain" />
          </button>
          <p className="wp-hint !not-italic">Bấm vào ảnh để thay đổi.</p>
          <button type="button" className="wp-link wp-link-danger text-[13px]" onClick={() => onChange('')}>
            Xóa ảnh đại diện
          </button>
        </>
      ) : (
        <>
          <button type="button" className="wp-link inline-flex items-center gap-1.5" onClick={() => setOpen(true)}>
            <ImagePlus className="w-4 h-4" /> Đặt ảnh đại diện
          </button>
          {invalid && <p className="m-0 mt-1 text-[var(--wp-red)] text-[13px]">Cần có ảnh.</p>}
        </>
      )}
      {open && (
        <MediaPicker
          title="Ảnh đại diện"
          action="Đặt làm ảnh đại diện"
          onPick={([url]) => {
            onChange(url);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
}

/** "Tùy chọn màn hình": which boxes are shown (remembered per section). */
function ScreenOptions({ boxes, hidden, setHidden }: { boxes: { id: string; title: string }[]; hidden: string[]; setHidden: (h: string[]) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex justify-end -mt-2 mb-2">
      <div className="relative">
        <button type="button" className="wp-btn wp-btn-sm !bg-white !border-[var(--wp-border)] !text-[var(--wp-muted)]" onClick={() => setOpen(!open)} aria-expanded={open}>
          <Settings2 className="w-3.5 h-3.5" /> Tùy chọn màn hình
        </button>
        {open && (
          <div className="absolute right-0 top-full mt-1 z-20 wp-box p-3 w-64 space-y-1.5">
            <div className="font-semibold mb-1">Hiện các hộp</div>
            {boxes.map((b) => (
              <label key={b.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!hidden.includes(b.id)}
                  onChange={() => setHidden(hidden.includes(b.id) ? hidden.filter((h) => h !== b.id) : [...hidden, b.id])}
                />
                {b.title}
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/** What the entry will look like, before saving (the website itself only shows saved content). */
function Preview({ collection, data, title, body, onClose }: { collection: Collection; data: Record<string, any>; title: string; body: string; onClose: () => void }) {
  const html = useMemo(() => cleanHtml(body), [body]);
  return (
    <Modal title="Xem trước" onClose={onClose} wide>
      <article className="max-w-[820px] mx-auto px-5 py-8">
        {data.date && <div className="text-[13px] text-[#777] mb-2">{data.date}</div>}
        <h1 className="text-[28px] font-bold leading-tight mt-0 mb-4 text-[#111]">{title || '(chưa có tiêu đề)'}</h1>
        {collection.name === 'products' ? (
          <div className="grid sm:grid-cols-[260px_1fr] gap-6 mb-6">
            {data.image && <img src={data.image} alt="" className="w-full border border-[#e5e5e5] p-2 object-contain" />}
            <div className="space-y-1.5 text-[14px]">
              {data.model && <p className="m-0"><strong>Model:</strong> {data.model}</p>}
              {data.brand && <p className="m-0"><strong>Hãng:</strong> {data.brand}</p>}
              {data.origin && <p className="m-0"><strong>Xuất xứ:</strong> {data.origin}</p>}
              {data.shortDesc && <p className="mt-3 mb-0 text-[#555]">{data.shortDesc}</p>}
            </div>
          </div>
        ) : (
          <>
            {data.excerpt && <p className="text-[16px] text-[#555] italic">{data.excerpt}</p>}
            {data.image && !body.includes(String(data.image)) && <img src={data.image} alt="" className="w-full max-h-[420px] object-cover mb-5" />}
          </>
        )}
        {html ? <div className="td-prose" dangerouslySetInnerHTML={{ __html: html }} /> : collection.name === 'products' && data.fullDesc ? <p className="td-prose">{data.fullDesc}</p> : null}
      </article>
    </Modal>
  );
}
