<?php

namespace OCA\TokenBaseDav\Services;

use Firebase\JWT\JWT;
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
	 * @param CertificateProvider $provider
	 * @param ConfigManager $configManager
	 * @param ILogger $logger
	 */
	public function __construct(CertificateProvider $provider, ConfigManager $configManager, ILogger $logger) {
		$this->provider = $provider;
		$this->configManager = $configManager;
		$this->logger = $logger;
	}

	public function issueToken($payload){
		$time = time();
		$payload["iat"] = $time;
		$payload["exp"] = $time + $this->configManager->getTokenTTL();
		$key = $this->provider->getEncodeSecret();
		return JWT::encode($payload, $key, $this->provider->getEncodingType());
	}

	public function validateToken($token){
		$key = $this->provider->getDecodeSecret();
		return JWT::decode($token, $key);
	}


}