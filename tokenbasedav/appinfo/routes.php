<?php
return [
	'routes' => [
		['name' => "auth#issueToken", 'url' => '/auth/token', 'verb' => 'POST'],
		['name' => "auth#test", 'url' => '/auth/test', 'verb' => 'GET'],
	],
	'resources' => []
];