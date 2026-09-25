<?php
// AI chat (api/chat.php). Copy to ai-config.php on the hosting, or let the deploy workflow write it from
// the GEMINI_API_KEY secret. Never commit ai-config.php. Get a key at https://aistudio.google.com/apikey
return [
    'gemini_api_key' => '',
    // Tried in order; the "-latest" aliases follow Google's current Flash models
    'models' => ['gemini-flash-lite-latest', 'gemini-3.8-flash'],
];
