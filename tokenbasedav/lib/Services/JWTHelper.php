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
	 * @param CertificateProvider $provider
	 * @param ILogger $logger
	 */
	public function __construct(CertificateProvider $provider, ILogger $logger) {
		$this->provider = $provider;
		$this->logger = $logger;
	}

	public function issueToken($payload){
		$key = $this->provider->getEncodeSecret();
		return JWT::encode($payload, $key, $this->provider->getEncodingType());
	}

	public function validateToken($token){
		$key = $this->provider->getDecodeSecret();
		return JWT::decode($token, $key);
	}


}