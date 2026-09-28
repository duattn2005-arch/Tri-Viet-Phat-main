#!/usr/bin/env bash
# Stop hook: when local main has commits that origin/main doesn't, push them.
# A push to main runs the deploy workflow, so this is what puts finished work on the live site.
input=$(cat)
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0

[ "$(git rev-parse --abbrev-ref HEAD 2>/dev/null)" = main ] || exit 0
ahead=$(git rev-list --count origin/main..main 2>/dev/null) || exit 0
[ "$ahead" -gt 0 ] || exit 0

# Never wait on a login window: the push must work with the saved GitHub login.
if err=$(GCM_INTERACTIVE=never GIT_TERMINAL_PROMPT=0 git push origin main 2>&1); then
  printf '{"systemMessage":"Đã tự đẩy %s commit lên GitHub, web đang deploy."}\n' "$ahead"
  exit 0
fi

msg=$(printf '%s' "$err" | tail -n 3 | tr '\n"\\\t' '    ')
if printf '%s' "$input" | grep -q '"stop_hook_active": *true'; then
  # Already asked Claude once this turn: just tell the user, don't loop.
  printf '{"systemMessage":"Tự đẩy lên GitHub thất bại: %s"}\n' "$msg"
else
  printf '{"decision":"block","reason":"Tự push main lên GitHub thất bại: %s. Nếu GitHub có commit mới thì chạy git pull --rebase origin main rồi push lại; nếu lỗi đăng nhập hoặc mạng thì báo người dùng bấm Sync Changes trong VS Code."}\n' "$msg"
fi
exit 0
