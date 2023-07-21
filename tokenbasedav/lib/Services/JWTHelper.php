<?php

namespace OCA\TokenBaseDav\Services;

use Error;
use Firebase\JWT\JWT;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\IConfig;
use OCP\ILogger;

class JWTHelper {

	/**
	 * @var CertificateProvider
	 */
	private $provider;

	/**
	 * @var ILogger
	 */
	private $logger;


	/**
	 * @var ConfigManager
	 */
	private $configManager;

	/**
	 * @var ITimeFactory
	 */
	private $timeFactory;
	/**
	 * @param CertificateProvider $provider
	 * @param ITimeFactory $timeFactory
	 * @param ILogger $logger
	 */
	public function __construct(CertificateProvider $provider, ITimeFactory $timeFactory, ILogger $logger) {
		$this->provider = $provider;
		$this->timeFactory = $timeFactory;
		$this->logger = $logger;
	}

	public function issueToken($payload){
		$time = $this->timeFactory->getTime();
		$payload["iat"] = $time;
		$payload["exp"] = $time + $this->provider->getConfigManager()->getTokenTTL();
		$key = $this->provider->getEncodeSecret();
		return JWT::encode($payload, $key, $this->provider->getEncodingType());
	}

	public function validateToken($token){
		$key = $this->provider->getDecodeSecret();
		return JWT::decode($token, $key);
	}


}