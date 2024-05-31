<?php
use OCP\Util;

$appId = OCA\TokenBasedDav\AppInfo\Application::APP_ID;
// Util::addScript($appId, $appId . '-main');

// fontawesome/fortawesome
Util::addStyle($appId, 'fontawesome-free/css/all.min');
Util::addStyle($appId, 'style');

?>

<div id="app">
	<div id="app-content">
			<?php print_unescaped($this->inc('maincontent')); ?>
	</div>
</div>

