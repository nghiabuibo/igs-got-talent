<?php

include_once(__DIR__ . '/../config.php');
include_once(__DIR__ . '/../vendor/autoload.php');
require_once(__DIR__ . '/../utils.php');

use Firebase\JWT\JWT;
use Firebase\JWT\Key;

$jwt = $_GET['jwt'] ?? '';

try {
	$fileName;
	$videoFile;

	if (!$jwt) {
		$fileName = 'Participant_IGS_Meetup_Award';
		$videoFile = __DIR__ . "/../assets/videos/template.mp4";
	} else {
		$payload = JWT::decode($jwt, new Key(GG_API_KEY, 'HS256'));
		if (property_exists($payload, 'error')) {
			return 'Error: ' . $payload->error;
		};

		$entry = $payload->entry;
		$stt = $entry[0];
		$name = $entry[3] ?? '';
		$fileName = vn_to_en($name, true) . '_IGS_Meetup_Award';

		// Replace 'your_video.mp4' with the actual path to your MP4 video file
		$videoFile = __DIR__ . "/../assets/videos/generated/$stt.mp4";
	}

	// Open the video file
	$fp = @fopen($videoFile, 'rb');

	// Check if the file was opened successfully
	if ($fp) {
		// Get the file size
		$fileSize = filesize($videoFile);

		// Set the content type to video/mp4
		header('Content-Type: video/mp4');
		header("Accept-Ranges: bytes");
		header("Content-Length: $fileSize");
		header("Content-Disposition: attachment; filename=$fileName.mp4");

		// Read and output the video file in chunks
		while (!feof($fp)) {
			echo fread($fp, 1024 * 1024); // Adjust the chunk size as needed
			flush();
		}

		// Close the file
		fclose($fp);
	} else {
		// Handle the case where the file couldn't be opened
		http_response_code(500);
		echo 'Internal Server Error';
	}
} catch (Exception $e) {
	echo 'Error: ' . $e->getMessage();
}
