<?php
namespace OCA\TokenBaseDav\Controller;

use OCP\AppFramework\{Controller, Http\JSONResponse, Http\TemplateResponse};
use OC\AppFramework\Http;
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
	 * @var ILogger
	 */
	private $logger;
	public function __construct(
		$appName,
		IRequest $request,
		JWTHelper $jwtHelper,
		Session $session,
		ILogger $logger
	) {
		parent::__construct($appName, $request);
		$this->jwtHelper = $jwtHelper;
		$this->logger = $logger;
		$this->session = $session;
	}

	/**
     * @NoAdminRequired
     * @NoCSRFRequired
     * @PublicPage
     */
    public function login() {
		$username = $this->request->getParam("username");
		$pass = $this->request->getParam("password");
		if ($this->session->login($username, $pass)) {
			$payload = ['test' => 'hi', "username" => $username];
			$token = $this->jwtHelper->issueToken($payload);
			return new JSONResponse(["token" => $token], Http::STATUS_OK);
		}
		return new JSONResponse([], Http::STATUS_UNAUTHORIZED);
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
