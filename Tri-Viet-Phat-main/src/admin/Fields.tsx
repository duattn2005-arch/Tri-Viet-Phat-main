import React, { lazy, Suspense, useState } from 'react';
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, FileText, ImagePlus, Plus, Trash2 } from 'lucide-react';
import { MediaPicker } from './Media';
import { defaultsFor, fileName, isImage, isRequired, optionsOf, summarize, type Field } from './schema';

const RichEditor = lazy(() => import('./RichEditor'));

// Form controls for the field types of the content config: string, text, number, boolean,
// select, image, file, html, object and list (of values or of groups of fields).

type OnChange = (value: any) => void;

export function FieldRow({ field, value, onChange, invalid }: { field: Field; value: any; onChange: OnChange; invalid?: boolean }) {
  if (field.widget === 'hidden') return null;
  const grouped = field.widget === 'object' || (field.widget === 'list' && !!field.fields);
  return (
    <div className="py-3 border-b border-[#f0f0f1] last:border-b-0">
      {!grouped && (
        <label className="wp-label">
          {field.label || field.name}
          {isRequired(field) && <span className="text-[var(--wp-red)]"> *</span>}
        </label>
      )}
      <FieldControl field={field} value={value} onChange={onChange} invalid={invalid} />
      {field.hint && <p className="wp-hint">{field.hint}</p>}
    </div>
  );
}

export function FieldControl({ field, value, onChange, invalid }: { field: Field; value: any; onChange: OnChange; invalid?: boolean }) {
  const cls = `wp-input${invalid ? ' is-invalid' : ''}`;
  switch (field.widget) {
    case 'text':
      return <AutoTextarea className={cls} value={value ?? ''} onChange={onChange} />;
    case 'number':
      return (
        <input
          type="number"
          className={`${cls} !w-40`}
          value={value ?? ''}
          min={field.min}
          max={field.max}
          step={field.value_type === 'float' ? 'any' : 1}
          onChange={(e) => {
            const v = e.target.value;
            onChange(v === '' ? undefined : field.value_type === 'float' ? parseFloat(v) : parseInt(v, 10));
          }}
        />
      );
    case 'boolean':
      return (
        <label className="inline-flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          <span>{value ? 'Bật' : 'Tắt'}</span>
        </label>
      );
    case 'select':
      return (
        <select className={`${cls} !w-auto max-w-full`} value={value ?? ''} onChange={(e) => onChange(e.target.value || undefined)}>
          <option value="">— Chọn —</option>
          {optionsOf(field).map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      );
    case 'image':
      return <MediaField kind="image" value={value ?? ''} onChange={onChange} />;
    case 'file':
      return <MediaField kind="file" value={value ?? ''} onChange={onChange} />;
    case 'html':
      return (
        <Suspense fallback={<AutoTextarea className={cls} value={value ?? ''} onChange={onChange} />}>
          <RichEditor value={value ?? ''} onChange={onChange} height={360} />
        </Suspense>
      );
    case 'object':
      return <ObjectField field={field} value={value} onChange={onChange} />;
    case 'list':
      return field.fields ? (
        <GroupList field={field} value={value} onChange={onChange} />
      ) : field.field ? (
        <ValueList field={field} value={value} onChange={onChange} />
      ) : (
        <input
          className={cls}
          value={Array.isArray(value) ? value.join(', ') : ''}
          placeholder="Các mục cách nhau bằng dấu phẩy"
          onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))}
        />
      );
    default:
      return <input className={cls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />;
  }
}

export function AutoTextarea({ value, onChange, className = 'wp-input', rows }: { value: string; onChange: OnChange; className?: string; rows?: number }) {
  const lines = String(value).split('\n').length + Math.floor(String(value).length / 95);
  return <textarea className={className} rows={rows ?? Math.min(14, Math.max(3, lines))} value={value} onChange={(e) => onChange(e.target.value)} />;
}

/** An image or file: preview, "Chọn ảnh" from the library (or upload), remove, or paste a link. */
export function MediaField({ value, onChange, kind = 'image' }: { value: string; onChange: OnChange; kind?: 'image' | 'file' }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-2">
      {value &&
        (isImage(value) ? (
          <button type="button" onClick={() => setOpen(true)} className="block wp-checker border border-[var(--wp-line)] cursor-pointer" title="Đổi ảnh">
            <img src={value} alt="" className="block max-h-40 max-w-full object-contain" />
          </button>
        ) : (
          <a href={value} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 break-all">
            <FileText className="w-4 h-4 shrink-0" /> {fileName(value)}
          </a>
        ))}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="wp-btn wp-btn-sm" onClick={() => setOpen(true)}>
          <ImagePlus className="w-3.5 h-3.5" /> {value ? 'Thay đổi' : kind === 'file' ? 'Chọn tệp' : 'Chọn ảnh'}
        </button>
        {value && (
          <button type="button" className="wp-link wp-link-danger text-[13px]" onClick={() => onChange('')}>
            Gỡ bỏ
          </button>
        )}
      </div>
      <input className="wp-input !text-[12px] text-[var(--wp-muted)]" placeholder="…hoặc dán đường dẫn" value={value} onChange={(e) => onChange(e.target.value)} />
      {open && (
        <MediaPicker
          kind={kind === 'file' ? 'any' : 'image'}
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

function ObjectField({ field, value, onChange }: { field: Field; value: any; onChange: OnChange }) {
  const [open, setOpen] = useState(!field.collapsed);
  const data = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
  return (
    <fieldset className="border border-[var(--wp-line)] bg-[#fbfbfc]">
      <legend className="sr-only">{field.label}</legend>
      <button type="button" onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 px-3 py-2 text-left font-semibold cursor-pointer">
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        {field.label || field.name}
        {!open && <span className="font-normal text-[var(--wp-muted)] truncate">{summarize(field.summary, data) || data.title || ''}</span>}
      </button>
      {open && (
        <div className="px-3 pb-1 border-t border-[var(--wp-line)] bg-white">
          {(field.fields ?? []).map((f) => (
            <FieldRow key={f.name} field={f} value={data[f.name]} onChange={(v) => onChange(setKey(data, f.name, v))} />
          ))}
        </div>
      )}
    </fieldset>
  );
}

const setKey = (obj: Record<string, any>, key: string, v: any) => {
  const next = { ...obj };
  if (v === undefined) delete next[key];
  else next[key] = v;
  return next;
};

const move = <T,>(list: T[], i: number, j: number) => {
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
};

function ItemTools({ i, count, onMove, onRemove }: { i: number; count: number; onMove: (i: number, j: number) => void; onRemove: () => void }) {
  const btn = 'w-7 h-7 flex items-center justify-center text-[#787c82] hover:text-[var(--wp-blue)] disabled:opacity-30 cursor-pointer';
  return (
    <div className="flex items-center shrink-0">
      <button type="button" className={btn} disabled={i === 0} onClick={() => onMove(i, i - 1)} aria-label="Lên trên" title="Lên trên">
        <ArrowUp className="w-4 h-4" />
      </button>
      <button type="button" className={btn} disabled={i === count - 1} onClick={() => onMove(i, i + 1)} aria-label="Xuống dưới" title="Xuống dưới">
        <ArrowDown className="w-4 h-4" />
      </button>
      <button type="button" className={`${btn} hover:!text-[var(--wp-red)]`} onClick={onRemove} aria-label="Xóa" title="Xóa">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

/** A list of single values: bullet points, image galleries… */
function ValueList({ field, value, onChange }: { field: Field; value: any; onChange: OnChange }) {
  const items: any[] = Array.isArray(value) ? value : [];
  const inner = field.field!;
  const label = field.label_singular || inner.label || 'mục';
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          <div className="flex-1 min-w-0">
            <FieldControl field={inner} value={item} onChange={(v) => onChange(items.map((x, j) => (j === i ? v : x)))} />
          </div>
          <ItemTools i={i} count={items.length} onMove={(a, b) => onChange(move(items, a, b))} onRemove={() => onChange(items.filter((_, j) => j !== i))} />
        </div>
      ))}
      <button type="button" className="wp-btn wp-btn-sm" onClick={() => onChange([...items, inner.widget === 'object' ? defaultsFor(inner.fields) : ''])}>
        <Plus className="w-3.5 h-3.5" /> Thêm {label}
      </button>
    </div>
  );
}

/** A list of groups (slides, specifications, FAQs…): folded cards showing a one-line summary. */
function GroupList({ field, value, onChange }: { field: Field; value: any; onChange: OnChange }) {
  const items: Record<string, any>[] = Array.isArray(value) ? value : [];
  const [open, setOpen] = useState<number | null>(null);
  const label = field.label_singular || 'mục';
  const summaryOf = (item: Record<string, any>, i: number) => {
    const s = summarize(field.summary, item);
    if (s) return s;
    const first = (field.fields ?? []).find((f) => (f.widget ?? 'string') === 'string' && item[f.name]);
    return first ? String(item[first.name]) : `${label.replace(/^./, (m) => m.toUpperCase())} ${i + 1}`;
  };
  const thumb = (item: Record<string, any>) => {
    const img = (field.fields ?? []).find((f) => f.widget === 'image' && item[f.name]);
    return img ? String(item[img.name]) : '';
  };
  return (
    <div>
      <div className="wp-label">
        {field.label || field.name} <span className="font-normal text-[var(--wp-muted)]">({items.length})</span>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <div key={i} className="border border-[var(--wp-line)] bg-white">
            <div className="flex items-center gap-2 pl-2 pr-1 bg-[#f6f7f7]">
              <button type="button" onClick={() => setOpen(open === i ? null : i)} className="flex-1 min-w-0 flex items-center gap-2 py-2 text-left cursor-pointer">
                {open === i ? <ChevronDown className="w-4 h-4 shrink-0" /> : <ChevronRight className="w-4 h-4 shrink-0" />}
                {thumb(item) && <img src={thumb(item)} alt="" className="w-8 h-8 object-cover shrink-0 border border-[var(--wp-line)]" />}
                <span className="truncate">{summaryOf(item, i)}</span>
              </button>
              <ItemTools
                i={i}
                count={items.length}
                onMove={(a, b) => {
                  onChange(move(items, a, b));
                  setOpen(open === a ? b : open === b ? a : open);
                }}
                onRemove={() => {
                  if (!window.confirm(`Xóa ${label} “${summaryOf(item, i)}”?`)) return;
                  onChange(items.filter((_, j) => j !== i));
                  setOpen(null);
                }}
              />
            </div>
            {open === i && (
              <div className="px-3">
                {(field.fields ?? []).map((f) => (
                  <FieldRow key={f.name} field={f} value={item[f.name]} onChange={(v) => onChange(items.map((x, j) => (j === i ? setKey(x, f.name, v) : x)))} />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <button
        type="button"
        className="wp-btn wp-btn-sm mt-2"
        onClick={() => {
          onChange([...items, defaultsFor(field.fields)]);
          setOpen(items.length);
        }}
      >
        <Plus className="w-3.5 h-3.5" /> Thêm {label}
      </button>
    </div>
  );
}

/** Required fields left empty and values that do not match their pattern, as readable messages. */
export function problems(fields: Field[], data: Record<string, any>): { name: string; message: string }[] {
  const out: { name: string; message: string }[] = [];
  for (const f of fields) {
    const v = data[f.name];
    const empty = v == null || (typeof v === 'string' && v.trim() === '');
    if (isRequired(f) && empty) out.push({ name: f.name, message: `Chưa nhập “${f.label || f.name}”.` });
    else if (!empty && f.pattern && typeof v === 'string') {
      try {
        if (!new RegExp(f.pattern[0]).test(v)) out.push({ name: f.name, message: `“${f.label || f.name}”: ${f.pattern[1]}.` });
      } catch {
        /* an invalid pattern in the config is ignored */
      }
    }
  }
  return out;
}
