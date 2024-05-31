<?php
return [
	'routes' => [
		['name' => 'auth#main', 'url' => '/', 'verb' => 'GET'],
		['name' => 'auth#main', 'url' => '/pick', 'verb' => 'POST'],
		['name' => 'auth#token', 'url' => '/auth/token', 'verb' => 'POST'],
		['name' => "auth#test", 'url' => '/auth/test', 'verb' => 'POST'],
	],
	'resources' => []
];