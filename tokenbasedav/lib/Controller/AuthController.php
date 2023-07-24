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
		Manager $manager,
		JWTHelper $jwtHelper,
		Session $session,
		ILogger $logger
	) {
		parent::__construct($appName, $request);
		$this->jwtHelper = $jwtHelper;
		$this->logger = $logger;
		$this->session = $session;
		$this->groupManager = $manager;
	}

	/**
     * @NoAdminRequired
     * @NoCSRFRequired
     * @PublicPage
     */
    public function issueToken() {
		$username = $this->request->getParam("username");
		$pass = $this->request->getParam("password");
		if ($this->session->login($username, $pass)) {
			$user = $this->session->getUser();
			$groups = $this->groupManager->getUserGroupIds($user);
			$payload = [ "username" => $username, "groups" => $groups];
			$token = $this->jwtHelper->issueAccessToken($payload);
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
