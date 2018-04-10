DROP TABLE IF EXISTS `ship`;
DROP TABLE IF EXISTS `fought_in`;
DROP TABLE IF EXISTS `battle`;
DROP TABLE IF EXISTS `country`;
DROP TABLE IF EXISTS `classification`;


CREATE TABLE `classification` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`type` VARCHAR(255) NOT NULL,
	`symbol` VARCHAR(255) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE (`type`),
	UNIQUE (`symbol`)
) ENGINE=InnoDB;

CREATE TABLE `country` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	`navypop` int(11),
	PRIMARY KEY (`id`),
	UNIQUE (`name`)
) ENGINE=InnoDB;

CREATE TABLE `ship` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`clid` int(11),
	`coid` int(11),
	`name` VARCHAR(255) NOT NULL,
	`length` INT,
	`tonnage` INT,
	`date` DATE,
	PRIMARY KEY (`id`),
	FOREIGN KEY (`clid`) REFERENCES `classification`(`id`)
		ON DELETE SET NULL
		ON UPDATE CASCADE,
	FOREIGN KEY (`coid`) REFERENCES `country`(`id`)
		ON DELETE SET NULL
		ON UPDATE CASCADE,
	UNIQUE (`name`)
) ENGINE=InnoDB;

CREATE TABLE `battle` (
	`id` int(11) NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(255) NOT NULL,
	`date` DATE,
	PRIMARY KEY (`id`),
	UNIQUE (`name`)
) ENGINE=InnoDB;

CREATE TABLE `fought_in` (
	`sid` int(11) NOT NULL,
	`bid` int(11) NOT NULL,
	FOREIGN KEY (`sid`) REFERENCES `ship` (`id`)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	FOREIGN KEY (`bid`) REFERENCES `battle` (`id`)
		ON DELETE CASCADE
		ON UPDATE CASCADE,
	CONSTRAINT `sid_bid` PRIMARY KEY (`sid`, `bid`)
) ENGINE=InnoDB;


INSERT INTO `country` (name, navypop)
VALUES ('USA', 111), ('Japan', 222), ('Germany', 333), ('England', 444);

INSERT INTO `classification` (type, symbol)
VALUES ('Carrier', 'CV'), ('Battleship', 'BB'), ('Destroyer', 'DD'), ('Light Cruiser', 'CL');

INSERT INTO `ship` (name, length, tonnage, `date`, clid, coid)
VALUES ('Enterprise', 770, 19800, '1934-07-16', (SELECT classification.id FROM classification WHERE classification.symbol='CV' ), (SELECT country.id FROM country WHERE country.name='USA')),
('Bismarck', 793, 41700, '1936-07-01', (SELECT classification.id FROM classification WHERE classification.symbol='BB'), (SELECT country.id FROM country WHERE country.name = 'Germany'));

INSERT INTO `battle` (name, `date`)
VALUES ('Denmark Strait', '1941-05-24'), ('Midway', '1942-06-04');

INSERT INTO `fought_in` (sid, bid)
VALUES ((SELECT ship.id FROM ship WHERE ship.name = 'Enterprise'), (SELECT battle.id FROM battle WHERE battle.name = 'Midway')),
((SELECT ship.id FROM ship WHERE ship.name = 'Bismarck'), (SELECT battle.id FROM battle WHERE battle.name = 'Denmark Strait'));