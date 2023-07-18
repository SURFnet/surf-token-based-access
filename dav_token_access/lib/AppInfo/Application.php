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
		error_log("inside application const");
        $container = $this->getContainer();
        $container->registerService('AuthController', function($c) {
			error_log("inside registering");

			$server = $c->getServer();
			$logger = $server->getLogger();
			$config = $server->getConfig();
			$encodingType = $config->getSystemValue('dav.jwtEncodeType', CertificateProvider::AUTO_ENCODE_TYPE);
			$configManager = new ConfigManager($config);
			$certificateProvider = new CertificateProvider($configManager, $encodingType, $logger);
			$jwtHelper = new JWTHelper($certificateProvider, $logger);
            $userSession = $server->getUserSession();
            return new AuthController(
                $c->query('AppName'),
                $c->query('Request'),
				$jwtHelper,
				$userSession,
				$logger
            );
        });

		$container->registerService('OCA\TokenBaseDav\Controller\AuthController', function($c) {
			error_log("inside registering2");

			$server = $c->getServer();
			$logger = $server->getLogger();
			$config = $server->getConfig();
			$encodingType = $config->getSystemValue('dav.jwtEncodeType', CertificateProvider::AUTO_ENCODE_TYPE);
			$configManager = new ConfigManager($config);
			$certificateProvider = new CertificateProvider($configManager, $encodingType, $logger);
			$jwtHelper = new JWTHelper($certificateProvider, $logger);
			$userSession = $server->getUserSession();
			return new AuthController(
				$c->query('AppName'),
				$c->query('Request'),
				$jwtHelper,
				$userSession,
				$logger
			);
		});
    }
}