<?php
/**
 * Sitemap fallback with a forced XML content type.
 * Use this in GSC if sitemap.xml fails: https://realgroupindia.com/sitemap.php
 */
header('Content-Type: application/xml; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: public, max-age=3600');

$file = __DIR__ . DIRECTORY_SEPARATOR . 'sitemap.xml';
if (!is_readable($file)) {
  http_response_code(500);
  echo '<?xml version="1.0" encoding="UTF-8"?><error>sitemap.xml missing</error>';
  exit;
}

readfile($file);
