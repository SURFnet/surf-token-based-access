<?php

namespace OCA\TokenBaseDav\Services;

use OC\OCS\Exception;
use OCP\IConfig;
use OCP\ILogger;

//Todo: this class should be implemented based on design decision that should be make
class CertificateProvider {

	public const RS256_ENCODE_TYPE = "RS256";
	public const HS256_ENCODE_TYPE = "HS256";
	public const AUTO_ENCODE_TYPE = "Auto";
	/**
	 * @var string
	 */
	private $encodingType = "";

	/**
	 * @var string
	 */
	private $selectedEncodingType = "";

	/**
	 * @var ConfigManager
	 */
	private $configManager;

	/**
	 * @var ILogger
	 */
	private $logger;

	/**
	 * @param ConfigManager $configManager
	 * @param ILogger $logger
	 */
	public function __construct(ConfigManager $configManager, $encodingType, \OCP\ILogger $logger)
	{
		$this->configManager = $configManager;
		$this->logger = $logger;
		$this->encodingType = $encodingType;
		if ($encodingType !== self::AUTO_ENCODE_TYPE){
			$this->selectedEncodingType = $encodingType;
		}
	}

	public function getEncodeSecret()
	{
		if ($this->encodingType === self::AUTO_ENCODE_TYPE) {
			$privateKey = $this->readCertificate();
			if ($privateKey !== "") {
				$this->selectedEncodingType = self::RS256_ENCODE_TYPE;
				return $privateKey;
			}
			$this->selectedEncodingType = self::HS256_ENCODE_TYPE;
			return $this->configManager->getEncodeSecret();
		} else if ($this->encodingType === self::HS256_ENCODE_TYPE) {
			return $this->configManager->getEncodeSecret();
		} else if ($this->encodingType === self::RS256_ENCODE_TYPE) {
			return $this->readCertificate();
		} else {

			throw new \Exception("unsupported encoding type. allowed types are: "
				. self::RS256_ENCODE_TYPE . ", " . self::HS256_ENCODE_TYPE . ", " . self::AUTO_ENCODE_TYPE);
		}
	}

	public function getConfigManager(){
		return $this->configManager;
	}
	public function getDecodeSecret()
	{
		if ($this->encodingType == CertificateProvider::AUTO_ENCODE_TYPE) {
			$privateKey = $this->readCertificate();
			if ($privateKey) {
				$publicKey = openssl_pkey_get_details($privateKey)['key'];
				$this->selectedEncodingType = self::RS256_ENCODE_TYPE;
				return $publicKey;
			} else {
				$this->selectedEncodingType = self::HS256_ENCODE_TYPE;
				return $this->configManager->getEncodeSecret();
			}
		} elseif ($this->encodingType == CertificateProvider::HS256_ENCODE_TYPE) {
			return $this->configManager->getEncodeSecret();
		}

		$privateKey = $this->readCertificate();
		if ($privateKey) {
			$publicKey = openssl_pkey_get_details($privateKey)['key'];
			return $publicKey;
		}
		throw new \Exception("Cannot find the certificate private key");
	}

	/**
	 * @return string|null
	 */
	public function getEncodingType()
	{
		return $this->selectedEncodingType;
	}
	
	private function readCertificate()
	{
		$certPass = $this->configManager->getCertPassPhrase();
		$certPath = $this->configManager->getCertPath();
		if (!empty($certPath)) {
			try {
				$privateKey = openssl_pkey_get_private(
					file_get_contents($certPath),
					$certPass
				);
				if ($privateKey) {
					return $privateKey;
				}
				return "";
			} catch (\Exception $ex) {
				$this->logger->error(
					"Unable to read SSL private key file. returning empty string as result.",
					["exception" => $ex, "app" => CertificateProvider::class]
				);
				return "";
			}
		}
		return "";
	}
}
