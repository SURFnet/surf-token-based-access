<?php
namespace OCA\TokenBaseDav\Tests;

use Exception;

class CertificateProviderTest extends \Test\TestCase {

	const HS256Secret = "some-high-secret-random-string";
	/**
	 * @var \OCA\TokenBaseDav\Services\CertificateProvider
	 */
	private $certificateProvider;
	/**
	 * @var \OCA\TokenBaseDav\Services\ConfigManager
	 */
	private $configManager;
	/**
	 * @var \OCP\ILogger
	 */
	private $logger;

	public function setUp(): void {
		parent::setUp();
		$this->logger = $this->createMock(\OCP\ILogger::class);
		$this->configManager = $this->createMock(\OCA\TokenBaseDav\Services\ConfigManager::class);
	}

	public function tearDown(): void {
		parent::tearDown();
	}

	public function testGetEncodeSecretUnsupportedType(){

		$this->expectException(Exception::class);
		$this->expectExceptionMessage("unsupported encoding type. allowed types are: RS256, HS256, Auto");
		

		$this->configManager->expects($this->never())->
		method("getCertPassPhrase")->willReturn("");

		$this->configManager->expects($this->never())->
		method("getCertPath")->willReturn("address\\of\\file.pem");

		$this->configManager->expects($this->never())->
		method("getEncodeSecret")->willReturn(self::HS256Secret);

		$certReader = new FakeCertificateReader(true);
		$this->certificateProvider = new \OCA\TokenBaseDav\Services\CertificateProvider(
			$this->configManager,
			$certReader,
			"Unsupported_type",
			$this->logger);

	}

	public function testGetEncodeSecretAutoModeExistingPEMPath(){
		$this->configManager->expects($this->once())->
			method("getCertPassPhrase")->willReturn("");

		$this->configManager->expects($this->once())->
		method("getCertPath")->willReturn("address\\of\\file.pem");

		$this->configManager->expects($this->never())->
		method("getEncodeSecret")->willReturn(self::HS256Secret);

		$certReader = new FakeCertificateReader(true);
		$this->certificateProvider = new \OCA\TokenBaseDav\Services\CertificateProvider(
			$this->configManager,
			$certReader,
			\OCA\TokenBaseDav\Services\CertificateProvider::AUTO_ENCODE_TYPE,
			$this->logger);

		$result = $this->certificateProvider->getEncodeSecret();

		$this->assertEquals($result, $certReader->getPrivateKey("",""));
		$this->assertEquals($this->certificateProvider->getEncodingType(), \OCA\TokenBaseDav\Services\CertificateProvider::RS256_ENCODE_TYPE);
	}

	public function testGetEncodeSecretAutoModeNonExistingPEMPath(){
		$this->configManager->expects($this->once())->
		method("getCertPassPhrase")->willReturn("");

		$this->configManager->expects($this->once())->
		method("getCertPath")->willReturn("");

		$this->configManager->expects($this->once())->
		method("getEncodeSecret")->willReturn(self::HS256Secret);

		$this->certificateProvider = new \OCA\TokenBaseDav\Services\CertificateProvider(
			$this->configManager,
			new FakeCertificateReader(false),
			\OCA\TokenBaseDav\Services\CertificateProvider::AUTO_ENCODE_TYPE,
			$this->logger);

		$result = $this->certificateProvider->getEncodeSecret();

		$this->assertEquals($result, self::HS256Secret);
		$this->assertEquals($this->certificateProvider->getEncodingType(), \OCA\TokenBaseDav\Services\CertificateProvider::HS256_ENCODE_TYPE);
	}

	public function testGetEncodeSecretHS256Mode(){

		$this->configManager->expects($this->never())->
		method("getCertPassPhrase")->willReturn("");

		$this->configManager->expects($this->never())->
		method("getCertPath")->willReturn("");

		$this->configManager->expects($this->once())->
		method("getEncodeSecret")->willReturn(self::HS256Secret);

		$this->certificateProvider = new \OCA\TokenBaseDav\Services\CertificateProvider(
			$this->configManager,
			new FakeCertificateReader(true),
			\OCA\TokenBaseDav\Services\CertificateProvider::HS256_ENCODE_TYPE,
			$this->logger);

		$result = $this->certificateProvider->getEncodeSecret();

		$this->assertEquals($result, self::HS256Secret);
		$this->assertEquals($this->certificateProvider->getEncodingType(), \OCA\TokenBaseDav\Services\CertificateProvider::HS256_ENCODE_TYPE);
	}

	public function testGetEncodeSecretRS256ModeHappyCase(){

		$this->configManager->expects($this->once())->
		method("getCertPassPhrase")->willReturn("");

		$this->configManager->expects($this->once())->
		method("getCertPath")->willReturn("address\\of\\file.pem");

		$this->configManager->expects($this->never())->
		method("getEncodeSecret")->willReturn(self::HS256Secret);

		$certReader = new FakeCertificateReader(true);
		$this->certificateProvider = new \OCA\TokenBaseDav\Services\CertificateProvider(
			$this->configManager,
			$certReader,
			\OCA\TokenBaseDav\Services\CertificateProvider::RS256_ENCODE_TYPE,
			$this->logger);

		$result = $this->certificateProvider->getEncodeSecret();

		$this->assertEquals($result, $certReader->getPrivateKey("some\\address", "some-pass"));
		$this->assertEquals($this->certificateProvider->getEncodingType(), \OCA\TokenBaseDav\Services\CertificateProvider::RS256_ENCODE_TYPE);
	}

	public function testGetEncodeSecretRS256ModeFailureCase(){

		$this->configManager->expects($this->once())->
		method("getCertPassPhrase")->willReturn("");

		$this->configManager->expects($this->once())->
		method("getCertPath")->willReturn("address\\of\\file.pem");

		$this->configManager->expects($this->never())->
		method("getEncodeSecret")->willReturn(self::HS256Secret);

		$this->certificateProvider = new \OCA\TokenBaseDav\Services\CertificateProvider(
			$this->configManager,
			new FakeCertificateReader(false),
			\OCA\TokenBaseDav\Services\CertificateProvider::RS256_ENCODE_TYPE,
			$this->logger);

		$result = $this->certificateProvider->getEncodeSecret();

		$this->assertEmpty($result);
		$this->assertEquals($this->certificateProvider->getEncodingType(), \OCA\TokenBaseDav\Services\CertificateProvider::RS256_ENCODE_TYPE);
	}

	public function testGetDecodeSecretAutoModeExistingPEMPath(){
		$this->configManager->expects($this->once())->
		method("getCertPassPhrase")->willReturn("");

		$this->configManager->expects($this->once())->
		method("getCertPath")->willReturn("address\\of\\file.pem");

		$this->configManager->expects($this->never())->
		method("getEncodeSecret")->willReturn(self::HS256Secret);

		$fakeCertReader = new FakeCertificateReader(true);
		$this->certificateProvider = new \OCA\TokenBaseDav\Services\CertificateProvider(
			$this->configManager,
			$fakeCertReader,
			\OCA\TokenBaseDav\Services\CertificateProvider::AUTO_ENCODE_TYPE,
			$this->logger);

		$result = $this->certificateProvider->getDecodeSecret();

		$this->assertEquals($result, $fakeCertReader->getPublicKey("not important parameter"));
		$this->assertEquals($this->certificateProvider->getEncodingType(), \OCA\TokenBaseDav\Services\CertificateProvider::RS256_ENCODE_TYPE);
	}

	public function testGetDecodeSecretAutoModeNonExistingPEMPath(){
		$this->configManager->expects($this->once())->
		method("getCertPassPhrase")->willReturn("");

		$this->configManager->expects($this->once())->
		method("getCertPath")->willReturn("address\\of\\file.pem");

		$this->configManager->expects($this->once())->
		method("getEncodeSecret")->willReturn(self::HS256Secret);

		$fakeCertReader = new FakeCertificateReader(false);
		$this->certificateProvider = new \OCA\TokenBaseDav\Services\CertificateProvider(
			$this->configManager,
			$fakeCertReader,
			\OCA\TokenBaseDav\Services\CertificateProvider::AUTO_ENCODE_TYPE,
			$this->logger);

		$result = $this->certificateProvider->getDecodeSecret();

		$this->assertEquals($result, self::HS256Secret);
		$this->assertEquals($this->certificateProvider->getEncodingType(), \OCA\TokenBaseDav\Services\CertificateProvider::HS256_ENCODE_TYPE);
	}

	public function testGetDecodeSecretHS256Mode(){
		$this->configManager->expects($this->never())->
		method("getCertPassPhrase")->willReturn("");

		$this->configManager->expects($this->never())->
		method("getCertPath")->willReturn("address\\of\\file.pem");

		$this->configManager->expects($this->once())->
		method("getEncodeSecret")->willReturn(self::HS256Secret);

		$fakeCertReader = new FakeCertificateReader(true);
		$this->certificateProvider = new \OCA\TokenBaseDav\Services\CertificateProvider(
			$this->configManager,
			$fakeCertReader,
			\OCA\TokenBaseDav\Services\CertificateProvider::HS256_ENCODE_TYPE,
			$this->logger);

		$result = $this->certificateProvider->getDecodeSecret();

		$this->assertEquals($result, self::HS256Secret);
		$this->assertEquals($this->certificateProvider->getEncodingType(), \OCA\TokenBaseDav\Services\CertificateProvider::HS256_ENCODE_TYPE);
	}

	public function testGetDecodeSecretRS256ModeHappy(){
		$this->configManager->expects($this->once())->
		method("getCertPassPhrase")->willReturn("");

		$this->configManager->expects($this->once())->
		method("getCertPath")->willReturn("address\\of\\file.pem");

		$this->configManager->expects($this->never())->
		method("getEncodeSecret")->willReturn(self::HS256Secret);

		$fakeCertReader = new FakeCertificateReader(true);
		$this->certificateProvider = new \OCA\TokenBaseDav\Services\CertificateProvider(
			$this->configManager,
			$fakeCertReader,
			\OCA\TokenBaseDav\Services\CertificateProvider::RS256_ENCODE_TYPE,
			$this->logger);

		$result = $this->certificateProvider->getDecodeSecret();

		$this->assertEquals($result, $fakeCertReader->getPublicKey("random string"));
		$this->assertEquals($this->certificateProvider->getEncodingType(), \OCA\TokenBaseDav\Services\CertificateProvider::RS256_ENCODE_TYPE);
	}

	public function testGetDecodeSecretRS256ModeFailure(){
		$this->expectException(Exception::class);
		$this->expectExceptionMessage("Cannot find the certificate private key");
		$this->configManager->expects($this->once())->
		method("getCertPassPhrase")->willReturn("");

		$this->configManager->expects($this->once())->
		method("getCertPath")->willReturn("address\\of\\file.pem");

		$this->configManager->expects($this->never())->
		method("getEncodeSecret")->willReturn(self::HS256Secret);

		$fakeCertReader = new FakeCertificateReader(false);
		$this->certificateProvider = new \OCA\TokenBaseDav\Services\CertificateProvider(
			$this->configManager,
			$fakeCertReader,
			\OCA\TokenBaseDav\Services\CertificateProvider::RS256_ENCODE_TYPE,
			$this->logger);

		$result = $this->certificateProvider->getDecodeSecret();

		
		$this->assertEquals($this->certificateProvider->getEncodingType(), \OCA\TokenBaseDav\Services\CertificateProvider::RS256_ENCODE_TYPE);
	}

}