<?php
$dirPaths = [
	'Đã đăng ký' => __DIR__ . '/registered/*.json',
	'Chưa đăng ký' => __DIR__ . '/non-registered/*.json',
];

function tableHead()
{
	ob_start();
?>
	<tr>
		<th>STT</th>
		<th>Bảng thi</th>
		<th></th>
		<th>HỌ VÀ TÊN</th>
		<th>NGÀY THÁNG NĂM SINH</th>
		<th>TỈNH THÀNH</th>
		<th>SỐ ĐIỆN THOẠI</th>
		<th>THÀNH TÍCH</th>
		<th>HỆ HỌC BỔNG (tiếng Việt)</th>
		<th>HỆ HỌC BỔNG (tiếng Anh)</th>
		<th>MỨC HỌC BỔNG</th>
		<th>THỜI HẠN</th>
	</tr>
<?php
	$html = ob_get_clean();
	return $html;
}

foreach ($dirPaths as $key => $dirPath) {
	$entries = glob($dirPath);

	echo "<h2>$key</h2>";
	echo '<table border="1" cellpadding="10" cellspacing="0">';
	echo tableHead();

	foreach ($entries as $entry) {
		$entry = json_decode(file_get_contents(($entry)));
		echo '<tr>';
		foreach ($entry as $info) {
			echo '<td>';
			echo $info;
			echo '</td>';
		}
		echo '</tr>';
	}

	echo '</table>';

	echo '<br/>';
}
