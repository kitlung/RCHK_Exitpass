# ************************************************************
# Sequel Pro SQL dump
# Version 4541
#
# http://www.sequelpro.com/
# https://github.com/sequelpro/sequelpro
#
# Host: 127.0.0.1 (MySQL 5.7.22)
# Database: exitpass
# Generation Time: 2019-04-15 07:07:58 +0000
# ************************************************************


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Dump of table exit_pass
# ------------------------------------------------------------

DROP TABLE IF EXISTS `exit_pass`;

CREATE TABLE `exit_pass` (
  `weblogin` varchar(255) NOT NULL DEFAULT '',
  `permission` int(11) unsigned NOT NULL,
  PRIMARY KEY (`weblogin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `exit_pass` WRITE;
/*!40000 ALTER TABLE `exit_pass` DISABLE KEYS */;

INSERT INTO `exit_pass` (`weblogin`, `permission`)
VALUES
	('lungc4',1);

/*!40000 ALTER TABLE `exit_pass` ENABLE KEYS */;
UNLOCK TABLES;


# Dump of table exit_pass_device
# ------------------------------------------------------------

DROP TABLE IF EXISTS `exit_pass_device`;

CREATE TABLE `exit_pass_device` (
  `device_name` varchar(15) NOT NULL DEFAULT '',
  `device_key` varchar(20) DEFAULT NULL,
  `status` varchar(20) DEFAULT '',
  `location` varchar(100) DEFAULT '',
  PRIMARY KEY (`device_name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table exit_pass_logs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `exit_pass_logs`;

CREATE TABLE `exit_pass_logs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `weblogin` varchar(255) NOT NULL DEFAULT '',
  `status` varchar(255) NOT NULL DEFAULT '',
  `leave_time` datetime DEFAULT NULL,
  `return_time` datetime DEFAULT NULL,
  `lateness` varchar(255) DEFAULT NULL,
  `device_name` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;



# Dump of table exit_pass_permission_logs
# ------------------------------------------------------------

DROP TABLE IF EXISTS `exit_pass_permission_logs`;

CREATE TABLE `exit_pass_permission_logs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `admin` varchar(100) NOT NULL DEFAULT '',
  `student` varchar(100) NOT NULL DEFAULT '',
  `reason` tinytext NOT NULL,
  `created_date` datetime NOT NULL,
  `permission` int(1) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;



# Dump of table exit_pass_temp_access
# ------------------------------------------------------------

DROP TABLE IF EXISTS `exit_pass_temp_access`;

CREATE TABLE `exit_pass_temp_access` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `weblogin` varchar(20) DEFAULT NULL,
  `card_id` varchar(10) DEFAULT NULL,
  `valid_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
