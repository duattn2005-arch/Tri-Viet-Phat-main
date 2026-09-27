import React, { useState } from 'react';
import { api } from './api';
import { Notice } from './ui';

/** The WordPress login screen: logo, a white card, username and password. */
export function Login({ onSignedIn }: { onSignedIn: () => void }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      await api.login(username, password);
      onSignedIn();
    } catch (err: any) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-[8vh] px-4">
      <a href="/" className="block mb-6" title="Về trang web Trí Đức">
        <img src="/logo-tri-duc.png" alt="Trí Đức" className="h-[84px] w-auto" />
      </a>
      <form onSubmit={submit} className="w-full max-w-[320px] bg-white border border-[var(--wp-border)] shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 space-y-4">
        {error && <Notice kind="error">{error}</Notice>}
        <div>
          <label className="block mb-1" htmlFor="user">
            Tên người dùng
          </label>
          <input id="user" className="wp-input !min-h-[40px] !text-[18px]" autoComplete="username" autoFocus value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label className="block mb-1" htmlFor="pass">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="pass"
              type={show ? 'text' : 'password'}
              className="wp-input !min-h-[40px] !text-[18px] !pr-16"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" className="absolute right-1 top-1 bottom-1 px-2 text-[12px] text-[var(--wp-blue)] cursor-pointer" onClick={() => setShow(!show)}>
              {show ? 'Ẩn' : 'Hiện'}
            </button>
          </div>
        </div>
        <div className="flex justify-end">
          <button type="submit" className="wp-btn wp-btn-primary wp-btn-lg" disabled={busy}>
            {busy ? 'Đang đăng nhập…' : 'Đăng nhập'}
          </button>
        </div>
      </form>
      <p className="mt-5 text-[13px]">
        <a href="/">← Quay về trang web Trí Đức</a>
      </p>
    </div>
  );
}
