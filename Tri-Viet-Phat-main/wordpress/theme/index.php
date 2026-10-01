<?php
/**
 * The website's pages are written by td_route_request() (inc/frontend.php) before WordPress picks a template.
 * WordPress only gets here for a draft preview or a page made in Trang (Pages) that the app has no screen for.
 */

defined('ABSPATH') || exit;

td_render_simple_page();
