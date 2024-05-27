<?php
session_start();

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "todolist";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    if (isset($_POST["action"])) {
        $action = $_POST["action"];

        if ($action === "add") {
            if (isset($_POST["text"])) {
                $text = $conn->real_escape_string($_POST["text"]);
                $sql = "INSERT INTO tasks (task_name) VALUES ('$text')";
                if ($conn->query($sql) === TRUE) {
                    echo "Task added successfully";
                } else {
                    echo "Error: " . $sql . "<br>" . $conn->error;
                }
            }
        } elseif ($action === "delete") {
            if (isset($_POST["id"])) {
                $id = intval($_POST["id"]);
                $sql = "DELETE FROM tasks WHERE id=$id";
                if ($conn->query($sql) === TRUE) {
                    echo "Task deleted successfully";
                } else {
                    echo "Error: " . $sql . "<br>" . $conn->error;
                }
            }
        } elseif ($action === "check") {
            if (isset($_POST["id"])) {
                $id = intval($_POST["id"]);
                $sql = "UPDATE tasks SET checked = !checked WHERE id=$id";
                if ($conn->query($sql) === TRUE) {
                    echo "Task status updated successfully";
                } else {
                    echo "Error: " . $sql . "<br>" . $conn->error;
                }
            }
        } elseif ($action === "edit") {
            if (isset($_POST["id"]) && isset($_POST["text"])) {
                $id = intval($_POST["id"]);
                $text = $conn->real_escape_string($_POST["text"]);
                $sql = "UPDATE tasks SET task_name='$text' WHERE id=$id";
                if ($conn->query($sql) === TRUE) {
                    echo "Task edited successfully";
                } else {
                    echo "Error: " . $sql . "<br>" . $conn->error;
                }
            }
        }
    }
} elseif ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["action"]) && $_GET["action"] === "fetch") {
    $result = $conn->query("SELECT id, task_name, checked FROM tasks");
    $tasks = [];
    while ($row = $result->fetch_assoc()) {
        $tasks[] = $row;
    }
    echo json_encode($tasks);
}

$conn->close();
?>
