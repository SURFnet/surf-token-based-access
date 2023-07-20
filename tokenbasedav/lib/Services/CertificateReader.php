<?php

namespace OCA\TokenBaseDav\Services;

class CertificateReader implements ICertificateReader {

	function getPrivateKey($certPath, $certPass) {
		$privateKey = openssl_pkey_get_private(
			file_get_contents($certPath),
			$certPass
		);
		if ($privateKey) {
			return $privateKey;
		}
		return "";
	}

	function getPublicKey($privateKey) {
		return openssl_pkey_get_details($privateKey)['key'];
	}
}