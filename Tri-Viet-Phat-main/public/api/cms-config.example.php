<?php
// Login for /admin. The deploy workflow writes cms-config.php from GitHub secrets
// (ADMIN_USERNAME, ADMIN_PASSWORD, CMS_GITHUB_TOKEN); to set it by hand, copy this file to cms-config.php.
// Never commit cms-config.php.
return [
    'admin_username' => '',
    'admin_password' => '',
    // Fine-grained GitHub token: only repository Tri-Viet-Phat-main, "Contents: Read and write"
    'github_token' => '',
];
