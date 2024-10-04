<?php
// Database configuration
$host = 'localhost'; // Your database host
$db   = 'your_database_name';
$user = 'your_database_username';
$pass = 'your_database_password';

// Create a connection
$conn = new mysqli($host, $user, $pass, $db);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Get data
$articleData = json_decode(file_get_contents('php://input'), true);
foreach ($articleData as $article) {
    if ($article[0] === 'text') {
        $text = $conn->real_escape_string($article[1]);
        $sql = "INSERT INTO articles (text) VALUES ('$text')";
        $conn->query($sql);
    } elseif ($article[0] === 'media') {
        $media = $conn->real_escape_string($article[1]);
        $sql = "INSERT INTO articles (media) VALUES ('$media')";
        $conn->query($sql);
    }
}

$conn->close();
?>
