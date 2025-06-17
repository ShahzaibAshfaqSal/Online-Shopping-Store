<?php
$servername = "localhost";
$username = "root"; // Your database username
$password = ""; // Your database password
$dbname = "shoppingstore"; // Your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$response = ['success' => true, 'message' => ''];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($_POST['action'] === 'register') {
        // Registration
        $firstname = mysqli_real_escape_string($conn, $_POST['firstname']);
        $lastname = mysqli_real_escape_string($conn, $_POST['lastname']);
        $email = mysqli_real_escape_string($conn, $_POST['email']);
        $password = mysqli_real_escape_string($conn, $_POST['password']);
        $confirmPassword = mysqli_real_escape_string($conn, $_POST['confirmPassword']);

        if ($password !== $confirmPassword) {
            $response['success'] = false;
            $response['message'] = 'Passwords do not match.';
        } else {
            $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

            $checkEmailQuery = "SELECT * FROM user WHERE email = '$email'";
            $result = $conn->query($checkEmailQuery);

            if ($result->num_rows > 0) {
                $response['success'] = false;
                $response['message'] = 'Email already registered.';
            } else {
                $insertQuery = "INSERT INTO user (first_name, last_name, email, password) 
                                VALUES ('$firstname', '$lastname', '$email', '$hashedPassword')";

                if ($conn->query($insertQuery) === TRUE) {
                    $response['message'] = 'Registration successful.';
                } else {
                    $response['success'] = false;
                    $response['message'] = 'Error: ' . $conn->error;
                }
            }
        }
    } elseif ($_POST['action'] === 'login') {
        // Login
        $email = mysqli_real_escape_string($conn, $_POST['email']);
        $password = mysqli_real_escape_string($conn, $_POST['password']);

        $checkUserQuery = "SELECT * FROM user WHERE email = '$email'";
        $result = $conn->query($checkUserQuery);

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            if (password_verify($password, $user['password'])) {
                $response['message'] = 'Login successful.';
            } else {
                $response['success'] = false;
                $response['message'] = 'Invalid password.';
            }
        } else {
            $response['success'] = false;
            $response['message'] = 'No account found with this email.';
        }
    }
}

// Send response as JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
