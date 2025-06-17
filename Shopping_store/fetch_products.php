<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = ""; // Use your database password
$dbname = "shoppingstore"; // Replace with your database name

$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Retrieve search query and category if provided
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$category = isset($_GET['category']) ? trim($_GET['category']) : '';

// Prepare the base SQL query
if (!empty($search)) {
    // Query for search functionality
    $sql = "
        SELECT DISTINCT p.product_id, p.title, p.description, p.price, p.image
        FROM products p
        INNER JOIN product_tags pt ON p.product_id = pt.product_id
        INNER JOIN tags t ON pt.tag_id = t.tag_id
        WHERE t.tag_name LIKE ? OR p.title LIKE ?
    ";

    $stmt = $conn->prepare($sql);
    $searchParam = "%" . $search . "%";
    $stmt->bind_param("ss", $searchParam, $searchParam);
} elseif (!empty($category)) {
    // Query for category filtering
    $sql = "
        SELECT DISTINCT p.product_id, p.title, p.description, p.price, p.image
        FROM products p
        INNER JOIN product_categories pc ON p.product_id = pc.product_id
        INNER JOIN categories c ON pc.category_id = c.category_id
        WHERE c.category_name = ?
    ";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $category);
} else {
    // Default query to fetch all products
    $sql = "
        SELECT DISTINCT p.product_id, p.title, p.description, p.price, p.image
        FROM products p
        LEFT JOIN product_tags pt ON p.product_id = pt.product_id
        LEFT JOIN tags t ON pt.tag_id = t.tag_id
    ";

    $stmt = $conn->prepare($sql);
}

// Execute the query and get the results
$stmt->execute();
$result = $stmt->get_result();

// Prepare products array
$products = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $products[] = $row;
    }
}

// Return products as JSON
header("Content-Type: application/json");
echo json_encode($products);

$stmt->close();
$conn->close();
