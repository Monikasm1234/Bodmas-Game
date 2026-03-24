<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $score = $_POST["score"];

    $file = fopen("scores.txt", "a");
    fwrite($file, "Score: " . $score . "\n");
    fclose($file);

    echo "Score saved!";
}
?>