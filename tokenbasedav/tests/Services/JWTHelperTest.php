<?php

namespace OCA\TokenBaseDav\Tests;

use OCA\TokenBaseDav\Services\CertificateProvider;
use OCA\TokenBaseDav\Services\ConfigManager;
use OCA\TokenBaseDav\Services\JWTHelper;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\ILogger;

class JWTHelperTest extends \Test\TestCase {

	/**
	 * @var JWTHelper
	 */
	private $jwtHelper;

	/**
	 * @var CertificateProvider
	 */
	private $certificateProvider;

	/**
	 * @var ITimeFactory
	 */
	private $timeFactory;

	/**
	 * @var ILogger
	 */
	private $logger;

	/**
	 * @var ConfigManager
	 */
	private $configurationManager;

	private $payload = [
		"name" => "my-name",
		"family" => "my-family",
	];

	public function setUp(): void {
		parent::setUp();
		$this->configurationManager = $this->createMock(ConfigManager::class);
		$this->timeFactory = $this->createMock(ITimeFactory::class);
		$this->logger = $this->createMock(ILogger::class);
		$this->certificateProvider = $this->getMockBuilder(CertificateProvider::class)
			->setConstructorArgs($this->configurationManager,
				new FakeCertificateReader(true),
				CertificateProvider::AUTO_ENCODE_TYPE,
				$this->logger);

		$this->jwtHelper = new JWTHelper($this->certificateProvider, $this->timeFactory, $this->logger);
	}

	public function tearDown(): void {
		parent::tearDown();
	}

	private function certProviderFaker(){
		return [
			[CertificateProvider::AUTO_ENCODE_TYPE, [1, 1, 0], true, false],
			[CertificateProvider::AUTO_ENCODE_TYPE, [1, 1, 1], false, false],
			[CertificateProvider::HS256_ENCODE_TYPE, [0, 0, 1], true, false],
			[CertificateProvider::RS256_ENCODE_TYPE, [1, 1, 0], true, false],
			[CertificateProvider::RS256_ENCODE_TYPE, [1, 1, 0], false, true],
			["Invalide_Type", [0, 0, 0], false, true]
		];
	}
	/**
	 * @dataProvider certProviderFaker
	 */

	public function testIssueToken($encodingType ,$funcCalls, $happyCase, $emptyToken){

		if($emptyToken)
		{
			$this->expectException(\Exception::class);
			$this->expectException(\Exception::class);
		}

		$this->configurationManager->expects($this->once())
			->method("getTokenTTL")->willReturn(3600);
		$this->timeFactory->expects($this->once())->method("getTime")->willReturn(1689850644);


		$this->configurationManager->expects($this->exactly($funcCalls[0]))
			->method("getCertPassPhrase")->willReturn("");
		$this->configurationManager->expects($this->exactly($funcCalls[1]))
			->method("getCertPath")->willReturn("path\\to\\file.pem");
		$this->configurationManager->expects($this->exactly($funcCalls[2]))
			->method("getEncodeSecret")->willReturn("8oDCyVLzSyPkvH5muAnnE9TqDquFlwd0jVvOFjnh");

		$this->certificateProvider = $this->getMockBuilder(CertificateProvider::class)
			->setConstructorArgs(
				[
					$this->configurationManager,
					new FakeCertificateReader($happyCase),
					CertificateProvider::AUTO_ENCODE_TYPE,
					$this->logger
				]);

		$this->jwtHelper = new JWTHelper($this->certificateProvider, $this->timeFactory, $this->logger);
		$token = $this->jwtHelper->issueToken($this->payload);
		if ($emptyToken) {
			$this->assertEmpty($token);
		}
		else {
			$this->assertNotEmpty($token);
		}
	}
}