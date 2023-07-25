<?php
namespace OCA\TokenBaseDav\Controller;

use OCP\AppFramework\{Controller, Http\JSONResponse, Http\TemplateResponse};
use OC\AppFramework\Http;
use OC\Group\Manager;
use OC\User\Session;
use OCA\TokenBaseDav\Services\JWTHelper;
use OCP\ILogger;
use OCP\IRequest;


class AuthController extends Controller {

	/**
	 * @var Session
	 */
	private $session;

	/**
	 * @var JWTHelper
	 */
	private $jwtHelper;

	/**
	 * @var Manager
	 */
	private $groupManager;

	/**
	 * @var ILogger
	 */
	private $logger;
	public function __construct(
		$appName,
		IRequest $request,
		JWTHelper $jwtHelper,
		ILogger $logger
	) {
		parent::__construct($appName, $request);
		$this->jwtHelper = $jwtHelper;
		$this->logger = $logger;
	}


	/**
     * @NoAdminRequired
     * @NoCSRFRequired
     * @PublicPage
     */
	public function test() {
		return new JSONResponse(["opps"=> "hitted"], Http::STATUS_OK);
    }
}
