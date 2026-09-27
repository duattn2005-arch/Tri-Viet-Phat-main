import React, { createContext, lazy, Suspense, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { api, whenSignedOut } from './api';
import type { Collection, Schema } from './schema';
import { Login } from './Login';
import { Shell } from './Shell';
import { Dashboard } from './Dashboard';
import { ListView } from './ListView';
import { MediaPage } from './Media';
import { Leads } from './Leads';
import { Notice, type NoticeKind, Spinner } from './ui';

// The editor (TinyMCE) is the heavy part: it loads when an entry is opened
const EditView = lazy(() => import('./EditView').then((m) => ({ default: m.EditView })));

// WordPress-style admin. Screens live in the address hash (#/c/news/edit/<slug>), so /admin/ is one static page.

export interface NoticeState {
  kind: NoticeKind;
  text: React.ReactNode;
}

interface AdminState {
  user: string;
  local: boolean;
  schema: Schema;
  collection: (name: string) => Collection | undefined;
  notify: (notice: NoticeState | null) => void;
  /** An editor with unsaved changes sets this, so that leaving the screen asks first. */
  setDirty: (dirty: boolean) => void;
  unreadLeads: number;
  refreshLeads: () => void;
}

const AdminContext = createContext<AdminState>(null!);
export const useAdmin = () => useContext(AdminContext);

export const go = (path: string) => {
  window.location.hash = path;
};

const parseHash = () =>
  window.location.hash
    .replace(/^#\/?/, '')
    .split('/')
    .filter(Boolean)
    .map((p) => decodeURIComponent(p));

let dirty = false;

export function App() {
  const [session, setSession] = useState<{ user: string; local: boolean } | null | undefined>(undefined);
  const [schema, setSchema] = useState<Schema | null>(null);
  const [schemaError, setSchemaError] = useState('');
  const [route, setRoute] = useState(parseHash);
  const [notice, setNotice] = useState<NoticeState | null>(null);
  const noticeAt = useRef(0);
  const [unreadLeads, setUnreadLeads] = useState(0);

  useEffect(() => {
    whenSignedOut(() => setSession(null));
    api.me().then(setSession, () => setSession(null));
  }, []);

  const refreshLeads = useCallback(() => {
    api.leads().then((l) => setUnreadLeads(l.filter((x) => !x.read).length), () => {});
  }, []);

  useEffect(() => {
    if (!session) return;
    api.schema().then(setSchema, (e) => setSchemaError(e.message));
    refreshLeads();
  }, [session, refreshLeads]);

  // Screen changes, asking first when an editor has unsaved changes (like WordPress)
  useEffect(() => {
    let current = window.location.hash;
    const onHash = () => {
      if (dirty && !window.confirm('Các thay đổi chưa được lưu sẽ bị mất. Rời khỏi trang này?')) {
        history.replaceState(null, '', current);
        return;
      }
      dirty = false;
      current = window.location.hash;
      setRoute(parseHash());
      // A notice set just before the move ("Đã xóa…") stays; older ones go
      if (Date.now() - noticeAt.current > 1500) setNotice(null);
      window.scrollTo(0, 0);
    };
    const onUnload = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener('hashchange', onHash);
    window.addEventListener('beforeunload', onUnload);
    return () => {
      window.removeEventListener('hashchange', onHash);
      window.removeEventListener('beforeunload', onUnload);
    };
  }, []);

  const notify = useCallback((n: NoticeState | null) => {
    noticeAt.current = Date.now();
    setNotice(n);
  }, []);

  const setDirty = useCallback((d: boolean) => {
    dirty = d;
  }, []);

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner label="Đang tải…" />
      </div>
    );
  }
  if (session === null) {
    return <Login onSignedIn={() => api.me().then(setSession, () => setSession(null))} />;
  }
  if (!schema) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        {schemaError ? <Notice kind="error">{schemaError}</Notice> : <Spinner label="Đang tải cấu hình…" />}
      </div>
    );
  }

  const collection = (name: string) => schema.collections.find((c) => c.name === name);
  const [section, name, action, slug] = route;
  const col = section === 'c' ? collection(name) : undefined;

  let screen: React.ReactNode;
  if (!section) screen = <Dashboard />;
  else if (section === 'media') screen = <MediaPage startWithUpload={name === 'upload'} />;
  else if (section === 'leads') screen = <Leads />;
  else if (col && action === 'new' && col.folder) screen = <EditView key={`${col.name}/new`} collection={col} />;
  else if (col && action === 'edit' && slug) screen = <EditView key={`${col.name}/${slug}`} collection={col} slug={slug} />;
  else if (col) screen = <ListView key={col.name} collection={col} />;
  else screen = <Notice kind="warning">Không tìm thấy trang này. Chọn một mục ở menu bên trái.</Notice>;

  const signOut = () => {
    if (dirty && !window.confirm('Các thay đổi chưa được lưu sẽ bị mất. Vẫn đăng xuất?')) return;
    dirty = false;
    api.logout().finally(() => setSession(null));
  };

  return (
    <AdminContext.Provider value={{ ...session, schema, collection, notify, setDirty, unreadLeads, refreshLeads }}>
      <Shell route={route} onSignOut={signOut}>
        {notice && (
          <div className="mb-4">
            <Notice kind={notice.kind} onDismiss={() => setNotice(null)}>
              {notice.text}
            </Notice>
          </div>
        )}
        <ScreenBoundary key={route.join('/')}>
          <Suspense
            fallback={
              <div className="py-10">
                <Spinner label="Đang mở trình soạn thảo…" />
              </div>
            }
          >
            {screen}
          </Suspense>
        </ScreenBoundary>
      </Shell>
    </AdminContext.Provider>
  );
}

/** A screen that crashes shows an error instead of blanking the admin; the menu keeps working. */
class ScreenBoundary extends React.Component<{ children: React.ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error) {
    console.error('[admin]', error);
  }
  render() {
    if (!this.state.error) return this.props.children;
    return (
      <Notice kind="error">
        <strong>Màn hình này gặp lỗi.</strong> Bạn vẫn có thể chọn mục khác ở menu bên trái.
        <div className="mt-1 text-[12px] text-[var(--wp-muted)]">Chi tiết: {this.state.error.message}</div>
      </Notice>
    );
  }
}
