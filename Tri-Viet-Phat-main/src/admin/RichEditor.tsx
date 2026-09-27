import React, { useEffect, useRef, useState } from 'react';
import { ImagePlus } from 'lucide-react';
import { marked } from 'marked';
import tinymce, { type Editor } from 'tinymce';
import 'tinymce/models/dom';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/image';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/wordcount';
import 'tinymce-i18n/langs6/vi';
import 'tinymce/skins/ui/oxide/skin.min.css';
import uiContentCss from 'tinymce/skins/ui/oxide/content.min.css?inline';
import contentCss from 'tinymce/skins/content/default/content.min.css?inline';
import { api } from './api';
import { MediaPicker } from './Media';
import { looksLikeHtml, slugify } from './schema';

// The WordPress classic editor: TinyMCE with a menu bar, two rows of tools, the "Thêm tệp" button
// and the "Trực quan" / "Mã" tabs. Pictures pasted or dropped into the text are uploaded to the
// library. Old Markdown bodies are turned into HTML when opened (the website shows both the same way).

const BODY_STYLE = `
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-size: 16px; line-height: 1.7; color: #1d2327; margin: 16px 20px; }
  img { max-width: 100%; height: auto; }
  table { border-collapse: collapse; }
  td, th { border: 1px solid #c3c4c7; padding: 4px 8px; }
  blockquote { border-left: 4px solid #c3c4c7; margin-left: 0; padding-left: 16px; color: #50575e; }
`;

type PickRequest = { kind: 'image' | 'any'; multiple: boolean; done: (urls: string[]) => void };

export default function RichEditor({ value, onChange, height = 520 }: { value: string; onChange: (html: string) => void; height?: number }) {
  const host = useRef<HTMLDivElement>(null);
  const editorRef = useRef<Editor | null>(null);
  const change = useRef(onChange);
  change.current = onChange;
  const original = useRef(value);
  const initial = useRef(value && !looksLikeHtml(value) ? (marked.parse(value, { async: false }) as string) : value);
  // The editor tidies the HTML it is given; that tidied copy of the original counts as "unchanged"
  const baseline = useRef<string | null>(null);
  const send = (html: string) => change.current(html === baseline.current ? original.current : html);
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<'visual' | 'code'>('visual');
  const [code, setCode] = useState('');
  const [pick, setPick] = useState<PickRequest | null>(null);
  const openPicker = useRef((req: PickRequest) => setPick(req));

  useEffect(() => {
    let cancelled = false;
    // A fresh textarea each run: StrictMode mounts twice and TinyMCE skips a claimed textarea
    const area = document.createElement('textarea');
    area.value = initial.current;
    host.current!.appendChild(area);
    const emit = () => editorRef.current && !cancelled && send(editorRef.current.getContent());

    tinymce
      .init({
        target: area,
        language: 'vi',
        skin: false,
        content_css: false,
        content_style: `${uiContentCss}\n${contentCss}\n${BODY_STYLE}`,
        branding: false,
        promotion: false,
        elementpath: false,
        min_height: height,
        autoresize_bottom_margin: 30,
        toolbar_sticky: true,
        toolbar_sticky_offset: window.innerWidth >= 768 ? 32 : 46,
        menubar: 'file edit view insert format tools table',
        plugins: 'advlist anchor autolink autoresize charmap code fullscreen image insertdatetime link lists media nonbreaking preview searchreplace table visualblocks wordcount',
        toolbar: [
          'blocks fontsize | bold italic underline | bullist numlist | blockquote | alignleft aligncenter alignright alignjustify | link unlink | undo redo | fullscreen',
          'strikethrough hr forecolor backcolor | removeformat | charmap | outdent indent | table | image media | code',
        ],
        block_formats: 'Đoạn văn=p; Tiêu đề 2=h2; Tiêu đề 3=h3; Tiêu đề 4=h4; Trích dẫn=blockquote; Mã nguồn=pre',
        font_size_formats: '12px 14px 15px 16px 17px 18px 20px 24px 28px',
        convert_urls: false,
        link_default_target: '_blank',
        link_assume_external_targets: 'https',
        image_caption: true,
        image_advtab: true,
        table_default_styles: { width: '100%', 'border-collapse': 'collapse' },
        paste_data_images: true,
        automatic_uploads: true,
        images_upload_handler: async (blob) => {
          const base = blob.filename().replace(/\.[^.]+$/, '');
          const file = new File([blob.blob()], blob.filename(), { type: blob.blob().type });
          const item = await api.upload(file, slugify(base) || 'anh-dan');
          return item.url;
        },
        file_picker_types: 'image file',
        file_picker_callback: (callback, _value, meta) => {
          openPicker.current({
            kind: meta.filetype === 'image' ? 'image' : 'any',
            multiple: false,
            done: ([url]) => url && callback(url, { text: decodeURIComponent(url.split('/').pop() || url) }),
          });
        },
        setup: (editor) => {
          editor.on('input change undo redo ExecCommand SetAttrib', emit);
        },
        init_instance_callback: (editor) => {
          if (cancelled) {
            editor.remove();
            return;
          }
          editorRef.current = editor;
          baseline.current = editor.getContent();
          setReady(true);
        },
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      editorRef.current?.remove();
      editorRef.current = null;
      area.remove();
    };
    // The editor keeps its own state after start; a restored revision remounts it (key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toCode = () => {
    setCode(editorRef.current?.getContent() ?? '');
    setMode('code');
  };
  const toVisual = () => {
    editorRef.current?.setContent(code);
    send(editorRef.current?.getContent() ?? code);
    setMode('visual');
  };

  const insertFiles = (urls: string[]) => {
    const html = urls
      .map((u) => {
        const safe = u.replace(/"/g, '&quot;');
        return /\.pdf$/i.test(u) ? `<p><a href="${safe}" target="_blank">${decodeURIComponent(u.split('/').pop() || u)}</a></p>` : `<p><img src="${safe}" alt=""></p>`;
      })
      .join('');
    if (mode === 'code') {
      const next = `${code}\n${html}`;
      setCode(next);
      change.current(next);
      return;
    }
    editorRef.current?.focus();
    editorRef.current?.insertContent(html);
    send(editorRef.current?.getContent() ?? '');
  };

  const tab = (m: 'visual' | 'code', label: string, onClick: () => void) => (
    <button
      type="button"
      onClick={() => mode !== m && onClick()}
      className={`px-3 py-1.5 text-[13px] border border-b-0 cursor-pointer ${mode === m ? 'bg-[#f6f7f7] border-[var(--wp-line)] text-[var(--wp-text)]' : 'bg-[#ebebeb] border-transparent text-[var(--wp-muted)] hover:text-[var(--wp-text)]'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="td-editor">
      <div className="flex items-end justify-between gap-2">
        <button type="button" className="wp-btn mb-1.5" onClick={() => setPick({ kind: 'any', multiple: true, done: insertFiles })}>
          <ImagePlus className="w-4 h-4" /> Thêm tệp
        </button>
        <div className="flex gap-1">
          {tab('visual', 'Trực quan', toVisual)}
          {tab('code', 'Mã', toCode)}
        </div>
      </div>
      <div className={mode === 'code' ? 'hidden' : ''}>
        <div ref={host} />
        {!ready && <div className="border border-[var(--wp-line)] bg-white flex items-center justify-center text-[var(--wp-muted)]" style={{ minHeight: height }}>Đang tải trình soạn thảo…</div>}
      </div>
      {mode === 'code' && (
        <textarea
          className="w-full border border-[var(--wp-line)] bg-white p-3 font-mono text-[13px] leading-relaxed"
          style={{ minHeight: height }}
          spellCheck={false}
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            change.current(e.target.value);
          }}
        />
      )}
      {pick && (
        <MediaPicker
          kind={pick.kind}
          multiple={pick.multiple}
          title={pick.multiple ? 'Thêm tệp vào bài' : 'Chọn tệp'}
          action={pick.multiple ? 'Chèn vào bài' : 'Chọn'}
          onPick={(urls) => {
            pick.done(urls);
            setPick(null);
          }}
          onClose={() => setPick(null)}
        />
      )}
    </div>
  );
}
