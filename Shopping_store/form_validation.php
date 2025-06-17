<?php
$servername = "localhost";
$username = "root"; 
$password = ""; 
$dbname = "shoppingstore"; 

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$response = ['success' => true, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    if ($action === 'register') {
        // Registration
        $firstname = trim($_POST['firstname']);
        $lastname = trim($_POST['lastname']);
        $email = trim($_POST['email']);
        $password = trim($_POST['password']);
        $confirmPassword = trim($_POST['confirmPassword']);

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $response['success'] = false;
            $response['message'] = 'Invalid email format.';
        } elseif ($password !== $confirmPassword) {
            $response['success'] = false;
            $response['message'] = 'Passwords do not match.';
        } else {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $stmt = $conn->prepare("SELECT user_id FROM users WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows > 0) {
                $response['success'] = false;
                $response['message'] = 'Email already registered.';
            } else {
                $stmt->close();

                $stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)");
                $stmt->bind_param("ssss", $firstname, $lastname, $email, $hashedPassword);

                if ($stmt->execute()) {
                    $response['message'] = 'Registration successful.';
                } else {
                    $response['success'] = false;
                    $response['message'] = 'Error: Could not register users.';
                }
                $stmt->close();
            }
        }
    } elseif ($action === 'login') {
        // Login
        $email = trim($_POST['email']);
        $password = trim($_POST['password']);

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $response['success'] = false;
            $response['message'] = 'Invalid email format.';
        } else {
            $stmt = $conn->prepare("SELECT password FROM users WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows > 0) {
                $stmt->bind_result($hashedPassword);
                $stmt->fetch();

                if (password_verify($password, $hashedPassword)) {
                    $response['message'] = 'Login successful.';
                } else {
                    $response['success'] = false;
                    $response['message'] = 'Invalid password.';
                }
            } else {
                $response['success'] = false;
                $response['message'] = 'No account found with this email.';
            }
            $stmt->close();
        }
    }
}

$conn->close();

// Send response as JSON
header('Content-Type: application/json');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
echo json_encode($response);
?>
