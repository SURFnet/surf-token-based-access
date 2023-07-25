<?php
namespace OCA\TokenBaseDav\AppInfo;

use OC\AppFramework\DependencyInjection\DIContainer;
use OCA\TokenBaseDav\Services\ConfigManager;
use OCA\TokenBaseDav\Services\JWTHelper;
use \OCP\AppFramework\App;
use \OCA\TokenBaseDav\Controller\AuthController;

class Application extends App {
	public function __construct(array $urlParams=array()) {
		parent::__construct('tokenbasedav', $urlParams);
		$container = $this->getContainer();

		$container->registerService('OCA\TokenBaseDav\Services\ConfigManager', function (DIContainer $c) {
			$server = $c->getServer();
			$config = $server->getConfig();
			return new ConfigManager($config);
		});

		$container->registerService('OCA\TokenBaseDav\Services\JWTHelper', function ($c) {
			$server = $c->getServer();
			$logger = $server->getLogger();
			$configManager = $c->query('OCA\TokenBaseDav\Services\ConfigManager');
			return new JWTHelper($configManager, $logger);
		});

		$container->registerService('OCA\TokenBaseDav\Controller\AuthController', function ($c) {
			$server = $c->getServer();
			$logger = $server->getLogger();
			$jwtHelper = $c->query('OCA\TokenBaseDav\Services\JWTHelper');
			return new AuthController(
				$c->query('AppName'),
				$c->query('Request'),
				$jwtHelper,
				$logger
			);
		});
	}
}