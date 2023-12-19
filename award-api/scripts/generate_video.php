<pre>
<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include_once(__DIR__ . '/../config.php');
require_once(__DIR__ . '/../classes.php');

$ggData = new GGSheetData(GG_API_KEY, GG_API_URL, GG_SPREADSHEET_ID, GG_SHEET_NAME, GG_SHEET_RANGE);
$entries = $ggData->entries;

foreach ($entries as $index => $entry) {
	$stt = $entry[0] ?? null;
	if (!$stt) continue;

	$name = $entry[3] ? mb_strtoupper($entry[3]) : '';
	$group = $entry[2] ?? '';
	$prize = $entry[7] ?? '';
	$prize_en;
	switch ($prize) {
		case 'Vô địch':
			$prize_en = 'CHAMPION';
			break;
		case 'Nhất':
			$prize_en = '1ST PLACE';
			break;
		case 'Nhì':
			$prize_en = '2ND PLACE';
			break;
		case 'Ba':
			$prize_en = '3RD PLACE';
			break;
		case 'Khuyến khích':
			$prize_en = 'CONSOLATION PRIZE';
			break;

		default:
			$prize_en = '';
			break;
	}

	$src = '../assets/videos/template.mp4';
	$targetPath = '../assets/videos/generated';
	$fontPath = '../assets/fonts';
	$fadeInStart = 16;
	$fadeInDuration = 1;
	$fadeInEnd = $fadeInStart + $fadeInDuration;
	// $displayDuration = 5;
	// $displayEnd = $fadeInEnd + $displayDuration;
	$displayEnd = 27;
	$fadeOutDuration = 2;
	$fadeOutEnd = $displayEnd + $fadeOutDuration;
	$alpha = "if(lt(t,$fadeInStart),0,if(lt(t,$fadeInEnd),(t-$fadeInStart)/$fadeInDuration,if(lt(t,$displayEnd),1,if(lt(t,$fadeOutEnd),($fadeOutDuration-(t-$displayEnd))/$fadeOutDuration,0))))";
	$vf = [
		"drawtext=text='$name':fontfile=$fontPath/Montserrat-SemiBold.ttf:fontsize=90:fontcolor=white:x=(w-text_w)/2:y=310:alpha='$alpha'",
		"drawtext=text='$group':fontfile=$fontPath/Montserrat-LightItalic.ttf:fontsize=80:fontcolor=white:x=(w-text_w)/2:y=435:alpha='$alpha'",
		"drawtext=text='$prize_en':fontfile=$fontPath/Montserrat-Bold.ttf:fontsize=110:fontcolor=white:x=(w-text_w)/2:y=630:alpha='$alpha'",
	];
	$vf = implode(',', $vf);
	$command = "ffmpeg -y -i $src -vf \"$vf\" -codec:a copy $targetPath/$stt.mp4 2>&1";
	// echo $command;
	// continue;

	if (($fp = popen($command, "r"))) {
		while (!feof($fp)) {
			echo fread($fp, 1024);
			flush();    // Flush the output buffer
			ob_flush(); // Flush the output buffer
		}
		fclose($fp);
	}
}
?>
</pre>