<?php
return [
'routes' => [
	['name' => "auth#login", 'url' => '/auth/login', 'verb' => 'POST'],
	['name' => "auth#test", 'url' => '/auth/test', 'verb' => 'GET'],
	//['name' => 'author_api#preflighted_cors',    'url' => '/api/1.0/{path}', 'verb' => 'OPTIONS', 'requirements' => array('path' => '.+')]
],
	'resources' => []
];