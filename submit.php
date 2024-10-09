<?
ob_start(); // Start output buffering
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0"); // HTTP 1.1
header("Expires: Thu, 01 Jan 1970 00:00:00 GMT"); // Expired
header("Pragma: no-cache"); // HTTP 1.0
header('Content-Type: application/json');

// Path to your articles JSON file
$articleFilePath = './articles/article_data.json'; // Update this path accordingly

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Gather the article data
    $title = $_POST['title'] ?? 'Untitled Article'; // Get the title from POST data
    $timestamp = date('c'); // Use the current timestamp in ISO 8601 format

    // Create an array for the new article
    $newArticle = [
        'title' => $title,
        'content' => array_filter($_POST['textBlocks'] ?? []), // Filter out empty text blocks
        'media' => [], // Initialize an empty array for media
        'timestamp' => $timestamp
    ];

    // Handle uploaded files
    if (isset($_FILES['mediaAssets']) && is_array($_FILES['mediaAssets']['name'])) {
        foreach ($_FILES['mediaAssets']['name'] as $key => $name) {
            // Check for upload errors
            if ($_FILES['mediaAssets']['error'][$key] === UPLOAD_ERR_OK) {
                $tmpName = $_FILES['mediaAssets']['tmp_name'][$key];
                $uploadDir = './uploads'; // Update this to your actual uploads directory
                $uploadFilePath = $uploadDir . '/' . basename($name); // Make sure to add a '/' before basename

                // Move the uploaded file
                if (move_uploaded_file($tmpName, $uploadFilePath)) {
                    $newArticle['media'][] = $uploadFilePath; // Store the file path
                } else {
                    http_response_code(500); // Internal Server Error
                    echo json_encode(['error' => 'Failed to upload media files.']);
                    exit();
                }
            } else {
                // Handle upload error
                http_response_code(400); // Bad Request
                echo json_encode(['error' => 'Error occurred while uploading file: ' . htmlspecialchars($name)]);
                exit();
            }
        }
    }

    // Read existing articles from the JSON file
    if (file_exists($articleFilePath)) {
        $fileContents = file_get_contents($articleFilePath);
        $articles = json_decode($fileContents, true);
        if (!is_array($articles)) {
            $articles = []; // Create a new array if data is invalid
        }
    } else {
        $articles = []; // Create a new array if the file does not exist
    }

    // Append the new article to the articles array
    $articles[] = $newArticle;

    // Write the updated articles back to the JSON file
    if (file_put_contents($articleFilePath, json_encode($articles, JSON_PRETTY_PRINT)) === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to write to file.']);
        exit();
    }

    $output = ob_get_clean(); // Get the output buffer contents and clean it
    if (!empty($output)) {
        error_log("Unexpected output detected: " . $output); // Log it to the error log
    }

    // Return success message
    echo json_encode(['success' => 'Article submitted successfully!']);
    exit(); // End the script 
}

// Respond with a 405 Method Not Allowed if the request was not POST
http_response_code(405); // Method Not Allowed
echo json_encode(['error' => 'Invalid request method.']);
