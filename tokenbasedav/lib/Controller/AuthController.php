<?php
namespace OCA\TokenBaseDav\Controller;

use OCP\AppFramework\{Controller, Http\JSONResponse, Http\TemplateResponse};
use OC\AppFramework\Http;
use OCA\TokenBaseDav\Services\JWTHelper;
use OCP\ILogger;
use OCP\IRequest;


class AuthController extends Controller {

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
     * @NoCSRFRequired
	 * @PublicPage
	 * @NoAdminRequired
     */
    public function login() {
        $payload =  ['test' => 'hi'];
		$token = $this->jwtHelper->issueToken($payload);
		return new JSONResponse(["token" => $token], Http::STATUS_OK);
    }
}