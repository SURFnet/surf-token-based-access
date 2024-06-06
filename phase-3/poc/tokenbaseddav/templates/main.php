<?php
use OCP\Util;

$appId = OCA\TokenBasedDav\AppInfo\Application::APP_ID;
// Util::addScript($appId, $appId . '-main');

// fontawesome/fortawesome
Util::addStyle($appId, 'fontawesome-free/css/all.min');
Util::addStyle($appId, 'style');
script('tokenbaseddav', 'main');
?>

<div id="app">
	<div id="app-content">
		please pick a folder to share (coming soon)
		<form method="POST" id="form">
			<input type="submit"/>
			<ul>
				<?php foreach($names as $name) { echo "<li>$name</li>"}; ?>
			</ul>
		</form>
	</div>
</div>