<?php
// Database configuration
$host = 'localhost'; // Replace with your database host if different
$db   = 'your_database_name'; // Replace with your database name
$user = 'your_database_username'; // Replace with your database username
$pass = 'your_database_password'; // Replace with your database password

// Create a database connection
$conn = new mysqli($host, $user, $pass, $db);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch articles from the database
$query = "SELECT * FROM articles ORDER BY submitted_at DESC"; // Get all articles ordered by submission date
$result = $conn->query($query);

// Start HTML output
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Articles</title>
    <link rel="stylesheet" href="styles.css"> <!-- Link to your CSS -->
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .article {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #ccc;
            border-radius: 5px;
            background: white;
        }
    </style>
</head>
<body>
    <h1>Articles</h1>

    <?php
    // Loop through the fetched articles and display them
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            echo "<div class='article'>";
            if (!empty($row['text'])) {
                echo "<p>" . nl2br(htmlspecialchars($row['text'])) . "</p>"; // Display text with new lines
            }
            if (!empty($row['media'])) {
                echo "<img src='path/to/media/" . htmlspecialchars($row['media']) . "' alt='Media Asset' style='max-width: 100%; height: auto;'>"; // Adjust the path as necessary
            }
            echo "</div>";
        }
    } else {
        echo "<p>No articles found.</p>"; // Message if no articles exist
    }

    // Close the database connection
    $conn->close();
    ?>
</body>
</html>
