-- phpMyAdmin SQL Dump
-- version 4.0.10.7
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 13, 2015 at 07:19 PM
-- Server version: 5.1.73
-- PHP Version: 5.3.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `hipermedia`
--

-- --------------------------------------------------------

--
-- Table structure for table `Album`
--

CREATE TABLE IF NOT EXISTS `Album` (
  `Id_album` int(11) NOT NULL AUTO_INCREMENT,
  `url_imatge` varchar(150) DEFAULT NULL,
  `titol_album` varchar(100) CHARACTER SET latin7 DEFAULT NULL,
  PRIMARY KEY (`Id_album`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=69 ;

-- --------------------------------------------------------

--
-- Table structure for table `Artist`
--

CREATE TABLE IF NOT EXISTS `Artist` (
  `Id_artista` int(11) NOT NULL AUTO_INCREMENT,
  `Nom_artista` varchar(100) CHARACTER SET latin7 DEFAULT NULL,
  PRIMARY KEY (`Id_artista`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=32 ;

-- --------------------------------------------------------

--
-- Table structure for table `Relation`
--

CREATE TABLE IF NOT EXISTS `Relation` (
  `Id_relation` int(11) NOT NULL AUTO_INCREMENT,
  `Id_album` int(11) DEFAULT NULL,
  `Id_artista` int(11) DEFAULT NULL,
  `Id_song` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id_relation`),
  KEY `Id_album` (`Id_album`),
  KEY `Id_artista` (`Id_artista`),
  KEY `Id_song` (`Id_song`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=241 ;

-- --------------------------------------------------------

--
-- Table structure for table `Song`
--

CREATE TABLE IF NOT EXISTS `Song` (
  `Id_song` int(11) NOT NULL AUTO_INCREMENT,
  `titol_song` varchar(100) CHARACTER SET latin7 DEFAULT NULL,
  `num_reproduccions` int(11) DEFAULT NULL,
  PRIMARY KEY (`Id_song`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=129 ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Relation`
--
ALTER TABLE `Relation`
  ADD CONSTRAINT `PKFK_Album_Relation` FOREIGN KEY (`Id_album`) REFERENCES `Album` (`Id_album`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `PKFK_Artist_Relation` FOREIGN KEY (`Id_artista`) REFERENCES `Artist` (`Id_artista`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `PKFK_Artist_Song` FOREIGN KEY (`Id_song`) REFERENCES `Song` (`Id_song`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
