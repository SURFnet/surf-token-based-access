<?php
namespace OCA\TokenBaseDav\Controller;

use OCP\AppFramework\{
    Controller,
    Http\TemplateResponse
};


class PageController extends Controller {
    /**
     * @NoCSRFRequired
     */
    public function index() {
        return ['test' => 'hi'];
    }
}