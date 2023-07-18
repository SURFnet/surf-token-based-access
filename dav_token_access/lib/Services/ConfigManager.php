<?php

namespace OCA\TokenBaseDav\Services;

use OCP\IConfig;

class ConfigManager {
	private const appName= "tokenbasedav";

	private const certPassPhraseKey = "ssl_pass_phrase";
	private const certPathKey="ssl_cert_path";
	private const simpleEncodeSecretKey="encoding_secret";

	/**
	 * @var IConfig
	 */
	private $config;

	public function __construct(IConfig $config) {
		$this->config = $config;
	}


	public function setCertPath($certPath) {
		$this->config->setAppValue(self::appName, self::certPathKey, $certPath);
	}

	public function getCertPath() {
		return $this->config->getAppValue(self::appName, self::certPathKey, "");
	}

	public function setCertPassPhrase($phrase) {
		$this->config->setAppValue(self::appName, self::certPassPhraseKey, $phrase);
	}

	public function getCertPassPhrase() {
		return $this->config->getAppValue(self::appName, self::certPassPhraseKey, null);
	}

	public function getEncodeSecret(){
		$secret = $this->config->getAppValue(self::appName, self::simpleEncodeSecretKey, "");
		if ($secret === ""){
			$secret = $this->generateRandomString(40);
			$this->config->setAppValue(self::appName, self::simpleEncodeSecretKey, $secret);
		}
		return $secret;
	}

	private function generateRandomString($length = 40){
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = strlen($characters);
		$randomString = '';
		for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[random_int(0, $charactersLength - 1)];
		}
		return $randomString;
	}
}