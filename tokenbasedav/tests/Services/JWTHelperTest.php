<?php

namespace OCA\TokenBaseDav\Tests;

use OCA\TokenBaseDav\Services\CertificateProvider;
use OCA\TokenBaseDav\Services\ConfigManager;
use OCA\TokenBaseDav\Services\JWTHelper;
use OCP\AppFramework\Utility\ITimeFactory;
use OCP\ILogger;

class JWTHelperTest extends \Test\TestCase {

	const HSSecret = "8oDCyVLzSyPkvH5muAnnE9TqDquFlwd0jVvOFjnh";
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
	}

	public function tearDown(): void {
		parent::tearDown();
	}

	public function certProviderFaker(){
		return [
			[self::HSSecret, CertificateProvider::HS256_ENCODE_TYPE ],
			[(new FakeCertificateReader(true))->getPrivateKey("", ""), CertificateProvider::RS256_ENCODE_TYPE],
			
		];
	}
	/**
	 * @dataProvider certProviderFaker
	 */

	 public function testIssueToken($secret, $encodingType){

		$this->configurationManager->expects($this->once())
			->method("getTokenTTL")->willReturn(3600);
		$this->timeFactory->expects($this->once())->method("getTime")->willReturn(1689850644);

	
		$this->certificateProvider = $this->createMock(CertificateProvider::class);

		$this->certificateProvider->expects($this->once())->method("getConfigManager")
			->willReturn($this->configurationManager);

		$this->certificateProvider->expects($this->once())->method("getEncodingType")
			->willReturn($encodingType);

		$this->certificateProvider->expects($this->once())->method("getEncodeSecret")
			->willReturn($secret);

		
		$this->jwtHelper = new JWTHelper($this->certificateProvider, $this->timeFactory, $this->logger);
		$token = $this->jwtHelper->issueToken($this->payload);
		$this->assertNotEmpty($token);
	}
}