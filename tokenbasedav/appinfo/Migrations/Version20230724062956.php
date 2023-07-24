<?php
namespace OCA\tokenbasedav\Migrations;

use Doctrine\DBAL\Schema\Schema;
use OCP\Migration\ISchemaMigration;
use OCP\Migration\IOutput;

/**
 * Auto-generated migration step: Please modify to your needs!
 */
class Version20230724062956 implements ISchemaMigration {

	/** @var string */
	private $tablePrefix;

	/** @var string */
	private $tableName = "tbdav_refresh_tokens";


	public function changeSchema(Schema $schema, array $options) {
		$this->prefix = $options['tablePrefix'];

		if (!$schema->hasTable("{$this->prefix}{$this->tableName}")) {
			$table = $schema->createTable("{$this->prefix}{$this->tableName}");
			$table->addColumn('id', 'integer', [
				'autoincrement' => true,
				'unsigned' => true,
				'notnull' => true,
				'length' => 11,
			]);
			$table->addColumn('token', 'string', [
				'length' => 255,
				'notnull' => false,
			]);
			$table->addColumn('user_id', 'string', [
				'length' => 255,
				'notnull' => true,
			]);

			$table->addColumn('expire_time', 'integer', [
				'unsigned' => true,
				'notnull' => true,
				'default' => 1,
			]);
			$table->setPrimaryKey(['id']);
			$table->addUniqueIndex(['token', 'user_id'], 'dav_refresh_token_index');
		}
	}
}
