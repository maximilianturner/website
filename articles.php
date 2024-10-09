<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0"); // HTTP 1.1
header("Expires: Thu, 01 Jan 1970 00:00:00 GMT"); // Expired
header("Pragma: no-cache"); // HTTP 1.0
header('Content-Type: application/json');

// Path to your articles JSON file
$articleFilePath = './articles/article_data.json'; // Change this path accordingly

// Check if the file exists
if (!file_exists($articleFilePath)) {
    http_response_code(404);
    echo json_encode(['error' => 'File not found']);
    exit();
}

// Read the file contents
$fileContents = file_get_contents($articleFilePath);

// Check if file reading was successful
if ($fileContents === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to read file']);
    exit();
}

// Decode the JSON data
$articles = json_decode($fileContents, true);

// Check for JSON errors
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(500);
    echo json_encode(['error' => 'Invalid JSON format']);
    exit();
}

// Return the articles as JSON
echo json_encode($articles);
?>
