<?php
$url = 'http://61.211.241.239/nphMotionJpeg?resolution=640x480'; // External URL

header('Content-Type: multipart/x-mixed-replace; boundary=--myboundary'); // Set proper headers

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_HTTPHEADER, array('Content-Type: multipart/x-mixed-replace; boundary=--myboundary'));
curl_exec($ch);
curl_close($ch);
?>