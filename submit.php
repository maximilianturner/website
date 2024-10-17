<?php
ob_start(); // Start output buffering
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0"); // HTTP 1.1
header("Expires: Thu, 01 Jan 1970 00:00:00 GMT"); // Expired
header("Pragma: no-cache"); // HTTP 1.0

$articleFilePath = './articles/article_data.json'; // Update this path accordingly

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'];
    $content = $_POST['content'];
    $timestamp = date('c');
    
    $article = [
        'title' => $title,
        'content' => [],
        'timestamp' => $timestamp
    ];

    foreach ($content as $index => $item) {
        if ($item['type'] === 'text') {
            $article['content'][] = [
                'type' => 'text',
                'value' => $item['value']
            ];
        } elseif ($item['type'] === 'media' && isset($_FILES["content"]["name"][$index]["file"])) {
            $target_dir = "./uploads/";
            $target_file = $target_dir . basename($_FILES["content"]["name"][$index]["file"]);
            
            if (move_uploaded_file($_FILES["content"]["tmp_name"][$index]["file"], $target_file)) {
                $article['content'][] = [
                    'type' => 'media',
                    'value' => $target_file
                ];
            }
        }
    }

    if (file_exists($articleFilePath)) {
        $fileContents = file_get_contents($articleFilePath);
        $articles = json_decode($fileContents, true);

        if (!is_array($articles)) {
            $articles = [];
        }
    } else {
        $articles = [];
    }

    $articles[] = $article;

    if (file_put_contents($articleFilePath, json_encode($articles, JSON_PRETTY_PRINT)) === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to write to file.']);
        exit();
    }

    $output = ob_get_clean(); // Get the output buffer contents and clean it
    if (!empty($output)) {
        error_log("Unexpected output detected: " . $output); // Log it to the error log
    }

    echo json_encode(['success' => 'Article submitted successfully!']);
    exit();
}

http_response_code(405);
echo json_encode(['error' => 'Invalid request method.']);
