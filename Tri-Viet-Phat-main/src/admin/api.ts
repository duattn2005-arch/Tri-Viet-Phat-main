// Client of public/api/admin.php. Reads are GET; writes are POST with the X-TD-Admin header,
// which the server requires so that a form on another website cannot make changes.

import type { Schema } from './schema';

export interface EntryRow {
  slug: string;
  sha?: string;
  /** Short fields only: long texts such as article bodies are left out of lists. */
  data: Record<string, any>;
  /** Files collections ("Trang", "Cài đặt"): the page's name. */
  label?: string;
}

export interface Entry {
  slug: string;
  sha: string | null;
  data: Record<string, any>;
}

export interface Commit {
  sha: string;
  date: string;
  author: string;
  message: string;
}

export interface MediaItem {
  url: string;
  size: number;
  type: 'image' | 'pdf';
}

export interface Lead {
  id: string;
  time: number;
  read: boolean;
  kind: string;
  title: string;
  name: string;
  phone: string;
  contact: string;
  fields: [string, string][];
  page: string;
}

export interface DeployState {
  status: 'running' | 'success' | 'failure' | 'unknown' | 'none';
  started?: string;
  updated?: string;
  message?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number
  ) {
    super(message);
  }
}

let onSignedOut = () => {};
/** Called when the server says the session has ended (the app then shows the login form). */
export const whenSignedOut = (fn: () => void) => {
  onSignedOut = fn;
};

const ENDPOINT = '/api/admin.php';

async function call<T>(action: string, params: Record<string, string> = {}, body?: unknown): Promise<T> {
  const query = new URLSearchParams({ a: action, ...params }).toString();
  const isForm = body instanceof FormData;
  let res: Response;
  try {
    res = await fetch(`${ENDPOINT}?${query}`, {
      method: body === undefined ? 'GET' : 'POST',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: body === undefined ? {} : { 'X-TD-Admin': '1', ...(isForm ? {} : { 'Content-Type': 'application/json' }) },
      body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
    });
  } catch {
    throw new ApiError('Không kết nối được tới máy chủ. Kiểm tra mạng rồi thử lại.', 0);
  }
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && action !== 'login') onSignedOut();
    throw new ApiError(json.error || `Lỗi máy chủ (${res.status}).`, res.status);
  }
  return json as T;
}

export const api = {
  me: () => call<{ user: string; local: boolean }>('me'),
  login: (username: string, password: string) => call<{ user: string }>('login', {}, { username, password }),
  logout: () => call('logout', {}, {}),
  schema: () => call<Schema>('schema'),

  list: (collection: string) => call<EntryRow[]>('list', { c: collection }),
  get: (collection: string, slug: string) => call<Entry>('get', { c: collection, s: slug }),
  save: (collection: string, slug: string, data: Record<string, any>, sha: string | null) =>
    call<{ slug: string; sha: string }>('save', { c: collection, s: slug }, { data, sha }),
  remove: (collection: string, slug: string, sha: string, title?: string) => call('delete', { c: collection, s: slug }, { sha, title }),
  history: (collection: string, slug: string) => call<Commit[]>('history', { c: collection, s: slug }),
  version: (collection: string, slug: string, ref: string) =>
    call<{ data: Record<string, any>; missing?: boolean }>('version', { c: collection, s: slug, ref }),

  media: (fresh = false) => call<MediaItem[]>('media', fresh ? { fresh: '1' } : {}),
  upload: (file: File, name: string) => {
    const form = new FormData();
    form.append('file', file);
    form.append('name', name);
    return call<MediaItem>('upload', {}, form);
  },

  activity: () => call<Commit[]>('activity'),
  deploy: () => call<DeployState>('deploy'),
  leads: () => call<Lead[]>('leads'),
  updateLeads: (ids: string[], op: 'read' | 'unread' | 'delete') => call<{ changed: number }>('leads-update', {}, { ids, op }),
};
