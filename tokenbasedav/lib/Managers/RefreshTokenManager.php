<?php

namespace OCA\TokenBaseDav\Managers;

use OCP\IDBConnection;

class RefreshTokenManager {

	const tableName = "tbdav_refresh_tokens";
	/**
	 * @var IDBConnection
	 */
	private $dbConnection;

	public function __construct(IDBConnection $connection) {
		$this->dbConnection = $connection;
	}

	public function getToken($key){

	}

	public function insertToken($token, $userId, $expireAt){
		$rowCount = $this->dbConnection->insertIfNotExist('*PREFIX*'.self::tableName, [
			"token" => $token,
			"user_id" => $userId,
			"expire_time" => $expireAt
		], ["token", "user_id"]);
		return $rowCount > 0;
	}

	public function removeToken($token, $userId){
		$qb = $this->dbConnection->getQueryBuilder();

		$qb->delete(self::tableName)
			->where($qb->where())
	}


}