import React, { useEffect, useState } from 'react';
import { FilePen, Mail, PenLine } from 'lucide-react';
import { api, type Commit, type EntryRow, type Lead } from './api';
import { go, useAdmin } from './App';
import { announceSaved } from './Shell';
import { isDraft, slugify, timeAgo, todayVn, vnToIso, words } from './schema';
import { Box, PageTitle, Spinner } from './ui';

// "Bảng tin": welcome panel, counts, recent activity, quick draft and the latest messages.

export function Dashboard() {
  const { schema, notify, unreadLeads } = useAdmin();
  const folders = schema.collections.filter((c) => c.folder);
  const [lists, setLists] = useState<Record<string, EntryRow[]>>({});
  const [activity, setActivity] = useState<Commit[] | null>(null);
  const [leads, setLeads] = useState<Lead[] | null>(null);

  useEffect(() => {
    folders.forEach((c) =>
      api.list(c.name).then(
        (rows) => setLists((l) => ({ ...l, [c.name]: rows })),
        () => setLists((l) => ({ ...l, [c.name]: [] }))
      )
    );
    api.activity().then(setActivity, () => setActivity([]));
    api.leads().then(setLeads, () => setLeads([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const news = lists.news;
  const recentNews = [...(news ?? [])]
    .filter((e) => !isDraft(e.data))
    .sort((a, b) => vnToIso(b.data.date).localeCompare(vnToIso(a.data.date)))
    .slice(0, 6);
  const drafts = folders.flatMap((c) => (lists[c.name] ?? []).filter((e) => isDraft(e.data)).map((e) => ({ c, e })));

  return (
    <div>
      <PageTitle>Bảng tin</PageTitle>

      <section className="wp-box p-6 mb-5">
        <h2 className="text-[21px] font-normal mt-0 mb-1">Chào mừng đến trang quản trị Trí Đức!</h2>
        <p className="mt-0 mb-5 text-[var(--wp-muted)]">Mọi thay đổi được lưu lên GitHub và website tự cập nhật sau vài phút. Không cần làm gì thêm.</p>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h3 className="text-[15px] font-semibold mt-0 mb-3">Bắt đầu</h3>
            <button type="button" className="wp-btn wp-btn-primary wp-btn-lg" onClick={() => go('/c/news/new')}>
              <PenLine className="w-4 h-4" /> Viết bài mới
            </button>
            <p className="mb-0 mt-3 text-[13px]">
              hoặc{' '}
              <a href="/" target="_blank" rel="noreferrer">
                xem website
              </a>
            </p>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold mt-0 mb-3">Việc thường làm</h3>
            <ul className="m-0 p-0 list-none space-y-1.5">
              <li>
                <a href="#/c/products/new">Thêm sản phẩm mới</a>
              </li>
              <li>
                <a href="#/c/pages/edit/trang-chu">Đổi ảnh bìa và chữ ở trang chủ</a>
              </li>
              <li>
                <a href="#/c/settings/edit/company">Sửa thông tin công ty, hotline, logo</a>
              </li>
              <li>
                <a href="#/c/settings/edit/partners">Sửa logo các hãng đối tác</a>
              </li>
              <li>
                <a href="#/c/pages/edit/seo">Sửa tiêu đề và mô tả trên Google</a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-[15px] font-semibold mt-0 mb-3">Khác</h3>
            <ul className="m-0 p-0 list-none space-y-1.5">
              <li>
                <a href="#/media">Quản lý thư viện ảnh</a>
              </li>
              <li>
                <a href="#/leads">Xem yêu cầu báo giá, liên hệ</a>
              </li>
              <li>
                <a href="/admin/sao-luu">Sao lưu toàn bộ website</a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2 items-start">
        <div className="space-y-5">
          <Box id="dash:glance" title="Sơ lược">
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 m-0 p-0 list-none">
              {folders.map((c) => {
                const rows = lists[c.name];
                const published = rows?.filter((e) => !isDraft(e.data)).length;
                return (
                  <li key={c.name}>
                    <a href={`#/c/${c.name}`} className="no-underline">
                      {rows ? published : '…'} {words(c).menu.toLowerCase()}
                    </a>
                  </li>
                );
              })}
              <li>
                <a href="#/leads" className="no-underline">
                  {unreadLeads} yêu cầu liên hệ chưa đọc
                </a>
              </li>
              {drafts.length > 0 && <li className="text-[var(--wp-muted)]">{drafts.length} bản nháp</li>}
            </ul>
          </Box>

          <Box id="dash:activity" title="Hoạt động">
            <h3 className="text-[14px] font-normal text-[var(--wp-muted)] mt-0 mb-2">Bài viết mới đăng</h3>
            {!news ? (
              <Spinner />
            ) : (
              <ul className="m-0 p-0 list-none space-y-1.5">
                {recentNews.map((e) => (
                  <li key={e.slug} className="flex gap-3">
                    <span className="w-24 shrink-0 text-[var(--wp-muted)]">{e.data.date}</span>
                    <a href={`#/c/news/edit/${e.slug}`}>{e.data.title}</a>
                  </li>
                ))}
              </ul>
            )}
            <h3 className="text-[14px] font-normal text-[var(--wp-muted)] mt-4 pt-3 mb-2 border-t border-[#f0f0f1]">Thay đổi gần đây</h3>
            {!activity ? (
              <Spinner />
            ) : activity.length === 0 ? (
              <p className="m-0 text-[var(--wp-muted)]">Chưa có dữ liệu.</p>
            ) : (
              <ul className="m-0 p-0 list-none space-y-1.5">
                {activity.slice(0, 8).map((c) => (
                  <li key={c.sha} className="flex gap-3">
                    <span className="w-24 shrink-0 text-[var(--wp-muted)]">{timeAgo(c.date)}</span>
                    <span>{c.message.replace(/^(cms|feat|fix|chore|content)(\([^)]*\))?:\s*/i, '')}</span>
                  </li>
                ))}
              </ul>
            )}
          </Box>
        </div>

        <div className="space-y-5">
          <QuickDraft
            onSaved={(row) => {
              setLists((l) => ({ ...l, news: [row, ...(l.news ?? [])] }));
              notify({
                kind: 'success',
                text: (
                  <>
                    Đã lưu bản nháp. <a href={`#/c/news/edit/${row.slug}`}>Sửa tiếp bản nháp</a>
                  </>
                ),
              });
            }}
            drafts={drafts.filter((d) => d.c.name === 'news').map((d) => d.e)}
          />

          <Box id="dash:leads" title="Yêu cầu liên hệ mới">
            {!leads ? (
              <Spinner />
            ) : leads.length === 0 ? (
              <p className="m-0 text-[var(--wp-muted)]">Chưa có yêu cầu nào. Các form trên website (báo giá, tư vấn, liên hệ…) sẽ hiện ở đây.</p>
            ) : (
              <ul className="m-0 p-0 list-none divide-y divide-[#f0f0f1]">
                {leads.slice(0, 5).map((l) => (
                  <li key={l.id} className="py-2 flex gap-3 items-start">
                    <Mail className={`w-4 h-4 mt-0.5 shrink-0 ${l.read ? 'text-[#a7aaad]' : 'text-[var(--wp-blue)]'}`} />
                    <div className="flex-1 min-w-0">
                      <a href="#/leads" className={l.read ? '' : 'font-semibold'}>
                        {l.name || l.phone || l.contact || 'Khách'}
                      </a>{' '}
                      <span className="text-[var(--wp-muted)]">— {l.title}</span>
                      <div className="text-[12px] text-[var(--wp-muted)]">{timeAgo(l.time)}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Box>
        </div>
      </div>
    </div>
  );
}

function QuickDraft({ onSaved, drafts }: { onSaved: (row: EntryRow) => void; drafts: EntryRow[] }) {
  const { collection, notify } = useAdmin();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [busy, setBusy] = useState(false);
  const newsCol = collection('news');
  if (!newsCol) return null;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    const paragraphs = body
      .trim()
      .split(/\n{2,}/)
      .filter(Boolean)
      .map((p) => `<p>${p.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]!).replace(/\n/g, '<br>')}</p>`);
    const data = {
      title: title.trim(),
      order: 0,
      status: 'Pending',
      date: todayVn(),
      categorySlug: 'tin-noi-bo',
      image: '',
      excerpt: body.trim().slice(0, 220),
      content: paragraphs.join('\n'),
    };
    const slug = slugify(title) || `ban-nhap-${Date.now().toString(36)}`;
    try {
      const res = await api.save('news', slug, data, null);
      announceSaved();
      setTitle('');
      setBody('');
      onSaved({ slug, sha: res.sha, data });
    } catch (err: any) {
      notify({ kind: 'error', text: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box id="dash:draft" title="Bản nháp nhanh">
      <form onSubmit={save} className="space-y-3">
        <div>
          <label className="block mb-1" htmlFor="qd-title">
            Tiêu đề
          </label>
          <input id="qd-title" className="wp-input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block mb-1" htmlFor="qd-body">
            Nội dung
          </label>
          <textarea id="qd-body" className="wp-input" rows={4} placeholder="Bạn đang nghĩ gì?" value={body} onChange={(e) => setBody(e.target.value)} />
        </div>
        <button type="submit" className="wp-btn wp-btn-primary" disabled={busy || !title.trim()}>
          {busy ? 'Đang lưu…' : 'Lưu bản nháp'}
        </button>
      </form>
      {drafts.length > 0 && (
        <div className="mt-5 pt-3 border-t border-[#f0f0f1]">
          <h3 className="text-[14px] font-semibold mt-0 mb-2">Bản nháp của bạn</h3>
          <ul className="m-0 p-0 list-none space-y-1.5">
            {drafts.slice(0, 5).map((e) => (
              <li key={e.slug} className="flex items-start gap-2">
                <FilePen className="w-4 h-4 mt-0.5 text-[#8c8f94] shrink-0" />
                <span>
                  <a href={`#/c/news/edit/${e.slug}`}>{e.data.title}</a> <span className="text-[13px] text-[var(--wp-muted)]">{e.data.date}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Box>
  );
}
