import React, { useEffect, useRef, useState } from 'react';
import {
  Briefcase,
  CircleChevronLeft,
  DatabaseBackup,
  ExternalLink,
  FileText,
  Files,
  Gauge,
  Home,
  Image as ImageIcon,
  LogOut,
  Mail,
  Menu,
  Newspaper,
  Package,
  PencilRuler,
  Plus,
  Settings,
  X,
  type LucideIcon,
} from 'lucide-react';
import { api, type DeployState } from './api';
import { useAdmin } from './App';
import { timeAgo, words, type Collection } from './schema';
import { useStored } from './ui';

// Admin bar on top and the dark side menu, around every screen.

const ICONS: Record<string, LucideIcon> = {
  products: Package,
  news: Newspaper,
  documents: FileText,
  jobs: Briefcase,
  pages: Files,
  settings: Settings,
};

interface MenuItem {
  key: string;
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: number;
  sub?: { label: string; href: string }[];
  external?: boolean;
}

/** Tells the admin bar that content was just saved, so it watches the website update. */
export const announceSaved = () => window.dispatchEvent(new Event('td-admin:saved'));

export function Shell({ route, onSignOut, children }: { route: string[]; onSignOut: () => void; children: React.ReactNode }) {
  const { user, local, schema, unreadLeads } = useAdmin();
  const [folded, setFolded] = useStored('menu-folded', false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<'new' | 'user' | null>(null);

  const folder = schema.collections.filter((c) => c.folder);
  const filesCols = schema.collections.filter((c) => c.files);

  const collectionItem = (c: Collection): MenuItem => ({
    key: c.name,
    label: words(c).menu,
    icon: ICONS[c.name] ?? FileText,
    href: `#/c/${c.name}`,
    sub: c.folder
      ? [{ label: words(c).all, href: `#/c/${c.name}` }, ...(c.create !== false ? [{ label: words(c).add, href: `#/c/${c.name}/new` }] : [])]
      : (c.files ?? []).map((f) => ({ label: f.label, href: `#/c/${c.name}/edit/${f.name}` })),
  });

  const groups: MenuItem[][] = [
    [{ key: '#dashboard', label: 'Bảng tin', icon: Gauge, href: '#/' }],
    [
      ...folder.map(collectionItem),
      {
        key: '#media',
        label: 'Thư viện',
        icon: ImageIcon,
        href: '#/media',
        sub: [
          { label: 'Thư viện', href: '#/media' },
          { label: 'Tải tệp lên', href: '#/media/upload' },
        ],
      },
      ...filesCols.map(collectionItem),
    ],
    [
      { key: '#leads', label: 'Liên hệ', icon: Mail, href: '#/leads', badge: unreadLeads },
      { key: '#backup', label: 'Sao lưu', icon: DatabaseBackup, href: '/admin/sao-luu', external: true },
    ],
  ];

  const [section, name] = route;
  const activeKey = !section ? '#dashboard' : section === 'c' ? name : `#${section}`;
  const currentHref = `#/${route.join('/')}`;

  const renderItem = (item: MenuItem) => {
    const active = item.key === activeKey;
    const Icon = item.icon;
    return (
      <li key={item.key}>
        <a
          href={item.href}
          onClick={() => setMobileOpen(false)}
          title={folded ? item.label : undefined}
          className={`flex items-center gap-2.5 px-3 py-[9px] text-[14px] leading-tight ${
            active ? 'bg-[var(--wp-blue)] text-white' : 'text-[#f0f0f1] hover:bg-[var(--wp-sub)] hover:text-[var(--wp-hover)]'
          }`}
        >
          <Icon className="w-5 h-5 shrink-0 opacity-80" />
          {!folded && <span className="flex-1">{item.label}</span>}
          {!!item.badge && (
            <span className={`min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#d63638] text-white text-[11px] font-semibold flex items-center justify-center ${folded ? 'absolute ml-3 -mt-4' : ''}`}>
              {item.badge}
            </span>
          )}
        </a>
        {active && item.sub && !folded && (
          <ul className="bg-[var(--wp-sub)] py-1.5 m-0 list-none">
            {item.sub.map((s) => (
              <li key={s.href}>
                <a
                  href={s.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block pl-[42px] pr-3 py-[5px] text-[13px] hover:text-[var(--wp-hover)] ${
                    currentHref === s.href ? 'text-white font-semibold' : 'text-[#c3c4c7]'
                  }`}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  const barBtn = 'flex items-center gap-1.5 px-3 h-full text-[#f0f0f1] no-underline hover:bg-[var(--wp-sub)] hover:text-[var(--wp-hover)] cursor-pointer';

  return (
    <div className="min-h-screen wp-menu">
      {/* Admin bar */}
      <header className="fixed top-0 inset-x-0 z-50 h-[46px] md:h-8 bg-[var(--wp-bar)] text-[#f0f0f1] flex items-center text-[13px]">
        <button type="button" className="md:hidden px-3 h-full cursor-pointer" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Menu">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <a href="/" target="_blank" rel="noreferrer" className={barBtn}>
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Trí Đức</span>
          <ExternalLink className="w-3 h-3 opacity-60" />
        </a>
        <Dropdown
          open={openMenu === 'new'}
          onOpenChange={(o) => setOpenMenu(o ? 'new' : null)}
          button={
            <>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Mới</span>
            </>
          }
          className={barBtn}
        >
          {folder
            .filter((c) => c.create !== false)
            .map((c) => (
              <DropdownLink key={c.name} href={`#/c/${c.name}/new`} onClick={() => setOpenMenu(null)}>
                {words(c).singular.replace(/^./, (m) => m.toUpperCase())}
              </DropdownLink>
            ))}
          <DropdownLink href="#/media/upload" onClick={() => setOpenMenu(null)}>
            Tệp media
          </DropdownLink>
        </Dropdown>
        {local ? (
          <span className="ml-2 px-2 py-0.5 rounded bg-amber-400 text-black text-[11px] font-semibold">Chạy thử trên máy</span>
        ) : (
          <DeployStatus />
        )}

        <div className="ml-auto h-full">
          <Dropdown
            align="right"
            open={openMenu === 'user'}
            onOpenChange={(o) => setOpenMenu(o ? 'user' : null)}
            button={
              <>
                <span className="hidden sm:inline">Xin chào, {user}</span>
                <span className="w-[18px] h-[18px] rounded-sm bg-[#50575e] flex items-center justify-center text-[11px] font-bold uppercase">{user[0]}</span>
              </>
            }
            className={barBtn}
          >
            <DropdownLink href="/admin/sao-luu">
              <DatabaseBackup className="w-4 h-4" /> Sao lưu & xuất dữ liệu
            </DropdownLink>
            <DropdownLink href="/admin/decap/">
              <PencilRuler className="w-4 h-4" /> Trình soạn cũ (Decap)
            </DropdownLink>
            <li>
              <button type="button" onClick={onSignOut} className="flex items-center gap-2 w-full text-left px-4 py-1.5 text-[#f0f0f1] hover:text-[var(--wp-hover)] cursor-pointer">
                <LogOut className="w-4 h-4" /> Đăng xuất
              </button>
            </li>
          </Dropdown>
        </div>
      </header>

      {/* Side menu */}
      <nav
        aria-label="Menu quản trị"
        className={`fixed z-40 top-[46px] md:top-8 bottom-0 left-0 bg-[var(--wp-menu)] overflow-y-auto transition-transform w-[200px] ${
          folded ? 'md:w-9' : 'md:w-[160px]'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {groups.map((g, i) => (
          <ul key={i} className="m-0 p-0 list-none pt-2.5 pb-1">
            {g.map(renderItem)}
          </ul>
        ))}
        <button
          type="button"
          onClick={() => setFolded(!folded)}
          className="hidden md:flex items-center gap-2.5 w-full px-3 py-2 mt-1 text-[13px] text-[#a7aaad] hover:text-[var(--wp-hover)] cursor-pointer"
        >
          <CircleChevronLeft className={`w-5 h-5 shrink-0 transition-transform ${folded ? 'rotate-180' : ''}`} />
          {!folded && 'Thu gọn menu'}
        </button>
      </nav>
      {mobileOpen && <div className="md:hidden fixed inset-0 z-30 bg-black/40" onClick={() => setMobileOpen(false)} />}

      <main className={`pt-[46px] md:pt-8 transition-[margin] ${folded ? 'md:ml-9' : 'md:ml-[160px]'}`}>
        <div className="px-3 sm:px-5 py-5 max-w-[1600px]">{children}</div>
      </main>
    </div>
  );
}

function Dropdown({
  button,
  children,
  open,
  onOpenChange,
  className,
  align = 'left',
}: {
  button: React.ReactNode;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  className: string;
  align?: 'left' | 'right';
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && onOpenChange(false);
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open, onOpenChange]);
  return (
    <div ref={ref} className="relative h-full" onMouseLeave={() => open && onOpenChange(false)}>
      <button type="button" className={className} aria-expanded={open} onClick={() => onOpenChange(!open)} onMouseEnter={() => onOpenChange(true)}>
        {button}
      </button>
      {open && (
        <ul className={`absolute top-full ${align === 'right' ? 'right-0' : 'left-0'} min-w-[200px] m-0 list-none bg-[var(--wp-sub)] py-1.5 shadow-lg`}>
          {children}
        </ul>
      )}
    </div>
  );
}

function DropdownLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <li>
      <a href={href} onClick={onClick} className="flex items-center gap-2 px-4 py-1.5 text-[#f0f0f1] no-underline hover:text-[var(--wp-hover)]">
        {children}
      </a>
    </li>
  );
}

/**
 * Whether the website has caught up with the last change: every save starts a rebuild of the site
 * (GitHub Actions), which takes a few minutes. Checked often while one runs, rarely otherwise.
 */
function DeployStatus() {
  const [state, setState] = useState<DeployState | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    let stopped = false;
    const check = () => {
      api.deploy().then(
        (s) => {
          if (stopped) return;
          setState(s);
          schedule(s.status === 'running' ? 15000 : 90000);
        },
        () => !stopped && schedule(90000)
      );
    };
    const schedule = (ms: number) => {
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(check, ms);
    };
    // After a save the rebuild takes a few seconds to start
    const onSaved = () => {
      setState((s) => ({ ...(s ?? {}), status: 'running', started: new Date().toISOString() }));
      schedule(8000);
    };
    check();
    window.addEventListener('td-admin:saved', onSaved);
    return () => {
      stopped = true;
      window.clearTimeout(timer.current);
      window.removeEventListener('td-admin:saved', onSaved);
    };
  }, []);

  if (!state || state.status === 'unknown' || state.status === 'none') return null;
  const view =
    state.status === 'running'
      ? { dot: <span className="wp-spinner !w-3 !h-3 !border-[#646970] !border-t-[#f0c33c]" />, text: 'Đang cập nhật website…', title: 'Thay đổi sẽ hiện trên website sau khoảng 3–6 phút.' }
      : state.status === 'success'
        ? { dot: <span className="w-2 h-2 rounded-full bg-[#68de7c]" />, text: 'Website đã cập nhật', title: state.updated ? `Lần cập nhật gần nhất: ${timeAgo(state.updated)}` : '' }
        : { dot: <span className="w-2 h-2 rounded-full bg-[#f86368]" />, text: 'Cập nhật website bị lỗi', title: 'Lần cập nhật gần nhất không thành công. Lưu lại một lần nữa, hoặc báo người quản lý kỹ thuật.' };
  return (
    <span className="hidden md:flex items-center gap-2 px-3 h-full text-[#c3c4c7]" title={view.title}>
      {view.dot}
      {view.text}
      {state.status === 'success' && state.updated && <span className="text-[#8c8f94]">· {timeAgo(state.updated)}</span>}
    </span>
  );
}
