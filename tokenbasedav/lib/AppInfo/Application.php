<?php
namespace OCA\TokenBaseDav\AppInfo;

use OCA\TokenBaseDav\Services\CertificateProvider;
use OCA\TokenBaseDav\Services\CertificateReader;
use OCA\TokenBaseDav\Services\ConfigManager;
use OCA\TokenBaseDav\Services\JWTHelper;
use \OCP\AppFramework\App;
use \OCA\TokenBaseDav\Controller\AuthController;

class Application extends App {
	public function __construct(array $urlParams=array()) {
		parent::__construct('tokenbasedav', $urlParams);
		$container = $this->getContainer();

		$container->registerService('OCA\TokenBaseDav\Services\ConfigManager', function ($c) {
			$server = $c->getServer();
			$config = $server->getConfig();
			return new ConfigManager($config);
		});

		$container->registerService('OCA\TokenBaseDav\Services\CertificateProvider', function ($c) {
			$server = $c->getServer();
			$logger = $server->getLogger();
			$config = $server->getConfig();
			$encodingType = $config->getSystemValue('dav.JWTEncodeType', CertificateProvider::AUTO_ENCODE_TYPE);
			$configManager = $c->query('OCA\TokenBaseDav\Services\ConfigManager');
			$certificateReader = new CertificateReader();
			return new CertificateProvider($configManager, $certificateReader, $encodingType, $logger);
		});

		$container->registerService('OCA\TokenBaseDav\Services\JWTHelper', function ($c) {
			$server = $c->getServer();
			$logger = $server->getLogger();
			$certificateProvider = $c->query('OCA\TokenBaseDav\Services\CertificateProvider');
			return new JWTHelper($certificateProvider, $logger);
		});

		$container->registerService('OCA\TokenBaseDav\Controller\AuthController', function ($c) {
			$server = $c->getServer();
			$logger = $server->getLogger();
			$session = $server->getUserSession();
			$groupManager = $server->getGroupManager();
			$jwtHelper = $c->query('OCA\TokenBaseDav\Services\JWTHelper');
			return new AuthController(
				$c->query('AppName'),
				$c->query('Request'),
				$groupManager,
				$jwtHelper,
				$session,
				$logger
			);
		});
	}
}