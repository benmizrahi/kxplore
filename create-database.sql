CREATE TABLE `charts_mapping` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `uId` mediumint(9) DEFAULT NULL,
  `cId` mediumint(9) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `charts_properties` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `xAxisFunction` text,
  `yAxisFunction` text,
  `options_drag` json DEFAULT NULL,
  `poolingInterval` bigint(20) DEFAULT NULL,
  `chartType` varchar(100) DEFAULT NULL,
  `chartTitle` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `dim_envierments` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `envName` varchar(100) NOT NULL,
  `props` json DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

CREATE TABLE `dim_topics` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `envId` mediumint(9) NOT NULL,
  `topicName` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8;

CREATE TABLE `map_topics` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `userId` mediumint(9) NOT NULL,
  `topicId` mediumint(9) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8;

CREATE TABLE `users` (
  `id` mediumint(9) NOT NULL AUTO_INCREMENT,
  `email` varchar(100) NOT NULL,
  `isAdmin` tinyint(1) DEFAULT NULL,
  `password` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`id`,`email`),
  UNIQUE KEY `unique_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=124 DEFAULT CHARSET=utf8;

CREATE TABLE `users_profile` (
  `authId` varchar(100) NOT NULL,
  `displayName` varchar(100) DEFAULT NULL,
  `image` varchar(5000) DEFAULT NULL,
  `userId` mediumint(9) NOT NULL,
  PRIMARY KEY (`authId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;