<?php
namespace OCA\TokenBaseDav\AppInfo;

use OC\AppFramework\DependencyInjection\DIContainer;
use OC\Core\Controller\LoginController;
use OCA\TokenBaseDav\Services\CertificateProvider;
use OCA\TokenBaseDav\Services\ConfigManager;
use OCA\TokenBaseDav\Services\JWTHelper;
use \OCP\AppFramework\App;
use \OCA\TokenBaseDav\Controller\AuthController;

class Application extends App {
	public function __construct(array $urlParams=array()){
		parent::__construct('tokenbasedav', $urlParams);
		$container = $this->getContainer();

		$container->registerService('OCA\TokenBaseDav\Services\CertificateProvider', function($c) {
			$server = $c->getServer();
			$logger = $server->getLogger();
			$config = $server->getConfig();
			$encodingType = $config->getSystemValue('dav.jwtEncodeType', CertificateProvider::AUTO_ENCODE_TYPE);
			$configManager = new ConfigManager($config);
			return new CertificateProvider($configManager, $encodingType, $logger);
		});

		$container->registerService('OCA\TokenBaseDav\Services\JWTHelper', function(DIContainer $c) {
			$server = $c->getServer();
			$logger = $server->getLogger();
			$certificateProvider = $c->query('OCA\TokenBaseDav\Services\CertificateProvider');
			return new JWTHelper($certificateProvider, $logger);
		});

	}
}