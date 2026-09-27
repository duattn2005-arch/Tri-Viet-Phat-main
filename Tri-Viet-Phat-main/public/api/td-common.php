<?php
/**
 * Helpers shared by the PHP endpoints: the admin account (cms-config.php), the GitHub API,
 * the login brute-force guard and the private store of form submissions ("Liên hệ" in /admin).
 * Included by admin.php and lien-he.php; requesting this file directly outputs nothing.
 */

if (defined('TD_COMMON')) {
    return;
}
define('TD_COMMON', true);

const TD_REPO = 'duattn2005-arch/Tri-Viet-Phat-main';
const TD_BRANCH = 'main';

/** Admin account and GitHub token, written by the deploy workflow from GitHub secrets. */
function td_cms_config(): array
{
    $file = __DIR__ . '/cms-config.php';
    $c = is_file($file) ? require $file : [];
    return [
        'user' => trim((string)($c['admin_username'] ?? '')),
        'pass' => (string)($c['admin_password'] ?? ''),
        'token' => trim((string)($c['github_token'] ?? '')),
        // Development only: edit the files of a local checkout instead of GitHub
        'local_root' => (string)($c['local_root'] ?? ''),
    ];
}

/**
 * Calls the GitHub REST API (or GraphQL with $path = 'graphql').
 * Returns [HTTP status, decoded JSON body or null].
 */
function td_github(string $method, string $path, $body = null, string $token = '', int $timeout = 30): array
{
    $url = $path === 'graphql' ? 'https://api.github.com/graphql' : 'https://api.github.com/' . ltrim($path, '/');
    $headers = [
        'Accept: application/vnd.github+json',
        'X-GitHub-Api-Version: 2022-11-28',
        'User-Agent: tri-duc-admin',
    ];
    if ($token !== '') {
        $headers[] = 'Authorization: Bearer ' . $token;
    }
    $ch = curl_init($url);
    $opts = [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => $timeout,
        CURLOPT_HTTPHEADER => $headers,
    ];
    if ($body !== null) {
        $opts[CURLOPT_POSTFIELDS] = json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        $opts[CURLOPT_HTTPHEADER][] = 'Content-Type: application/json';
    }
    curl_setopt_array($ch, $opts);
    $raw = curl_exec($ch);
    $status = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    curl_close($ch);
    return [$status, is_string($raw) ? json_decode($raw) : null];
}

/** Same counter as the /admin (auth.php) login: 10 failed attempts per IP per 15 minutes. */
function td_login_blocked(): bool
{
    return count(td_login_failures()) >= 10;
}

function td_login_failures(): array
{
    $file = td_login_lock_file();
    $now = time();
    return array_values(array_filter(
        is_file($file) ? (array)json_decode((string)file_get_contents($file), true) : [],
        fn($t) => is_int($t) && $t > $now - 900
    ));
}

function td_login_failed(): void
{
    $fails = td_login_failures();
    $fails[] = time();
    @file_put_contents(td_login_lock_file(), json_encode($fails));
}

function td_login_succeeded(): void
{
    @unlink(td_login_lock_file());
}

function td_login_lock_file(): string
{
    return sys_get_temp_dir() . '/tvp-cms-login-' . md5($_SERVER['REMOTE_ADDR'] ?? 'unknown');
}

/**
 * A private folder for data the website collects. Outside the public web folder when the hosting
 * allows it (/home/<account>/td-data); otherwise api/td-data, closed to the web by its own .htaccess.
 */
function td_data_dir(): string
{
    static $dir = null;
    if ($dir !== null) {
        return $dir;
    }
    $outside = dirname(__DIR__, 2) . '/td-data';
    if ((is_dir($outside) || @mkdir($outside, 0700, true)) && is_writable($outside)) {
        return $dir = $outside;
    }
    $inside = __DIR__ . '/td-data';
    if (!is_dir($inside)) {
        @mkdir($inside, 0700, true);
    }
    if (!is_file($inside . '/.htaccess')) {
        @file_put_contents($inside . '/.htaccess', "Require all denied\nDeny from all\n");
    }
    return $dir = $inside;
}

/** Form submissions, one JSON object per line, oldest first. */
function td_leads_file(): string
{
    return td_data_dir() . '/leads.jsonl';
}

/** Appends a submission; returns false if the store is not writable. */
function td_leads_add(array $lead): bool
{
    $lead['id'] = bin2hex(random_bytes(8));
    $lead['time'] = time();
    $lead['read'] = false;
    $line = json_encode($lead, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
    return @file_put_contents(td_leads_file(), $line, FILE_APPEND | LOCK_EX) !== false;
}

/** All submissions, newest first. */
function td_leads_all(): array
{
    $file = td_leads_file();
    if (!is_file($file)) {
        return [];
    }
    $out = [];
    foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: [] as $line) {
        $lead = json_decode($line, true);
        if (is_array($lead) && isset($lead['id'])) {
            $out[] = $lead;
        }
    }
    return array_reverse($out);
}

/**
 * Rewrites the store with $change applied to the submissions whose id is in $ids
 * ($change returns the new lead, or null to delete it). Returns how many matched.
 */
function td_leads_change(array $ids, callable $change): int
{
    $file = td_leads_file();
    if (!is_file($file)) {
        return 0;
    }
    $fp = fopen($file, 'c+');
    if (!$fp || !flock($fp, LOCK_EX)) {
        return 0;
    }
    $lines = [];
    $matched = 0;
    rewind($fp);
    while (($line = fgets($fp)) !== false) {
        $lead = json_decode($line, true);
        if (is_array($lead) && in_array($lead['id'] ?? '', $ids, true)) {
            $matched++;
            $lead = $change($lead);
            if ($lead === null) {
                continue;
            }
            $line = json_encode($lead, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
        }
        $lines[] = $line;
    }
    ftruncate($fp, 0);
    rewind($fp);
    fwrite($fp, implode('', $lines));
    fflush($fp);
    flock($fp, LOCK_UN);
    fclose($fp);
    return $matched;
}
