CREATE TABLE `todo` (
	`id` INT(11) NOT NULL DEFAULT NULL,
	`name` VARCHAR(255) NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`description` TEXT NULL DEFAULT NULL COLLATE 'latin1_swedish_ci',
	`created_at` TIMESTAMP NULL DEFAULT NULL COLLATE 'latin1_bin',
	`updated_ad` TIMESTAMP NULL DEFAULT NULL,
	`status` ENUM('Y','N') NOT NULL COLLATE 'latin1_swedish_ci',
	PRIMARY KEY (`id`)
)
COLLATE='latin1_swedish_ci'
ENGINE=InnoDB
;
