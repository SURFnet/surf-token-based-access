<?php

namespace OCA\TokenBaseDav\Services;

interface ICertificateReader {
	function getPrivateKey($certPath, $certPass);
	function getPublicKey($privateKey);
}