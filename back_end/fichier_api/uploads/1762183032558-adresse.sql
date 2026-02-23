-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Oct 30, 2025 at 03:03 PM
-- Server version: 9.4.0
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `astro_tech`
--

-- --------------------------------------------------------

--
-- Table structure for table `adresse`
--

CREATE TABLE `affaire` (
  `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `reference` varchar(150) DEFAULT NULL,
  `titre` varchar(10) DEFAULT NULL,
  `zone_intervention` varchar(100) DEFAULT NULL,
  `titre` varchar(100) DEFAULT NULL,
  `description` varchar(100) DEFAULT NULL,
  `client_id` varchar(10) DEFAULT NULL,
  `etat` varchar(50) DEFAULT NULL,
  `technicien_id` varchar(50) DEFAULT NULL,
  `equipe_technicien_id` varchar(50) DEFAULT NULL,
  `referent_id` varchar(50) DEFAULT NULL,
  `date_debut` varchar(50) DEFAULT NULL,
  `date_fin` varchar(50) DEFAULT NULL,
  'mots_cles_id' varchar(50) DEFAULT NULL,
  'duree_heures' varchar(50) DEFAULT NULL,
  'duree_minutes' varchar(50) DEFAULT NULL
)

--
-- Dumping data for table `adresse`
--

INSERT INTO `adresse` (`id`, `adresse`, `codePostal`, `ville`, `province`, `pays`, `etage`, `appartementLocal`, `batiment`, `interphoneDigicode`, `escalier`, `porteEntree`) VALUES
(11, 'Nisi placeat dolor', 'Quam ex ar', 'Libero et dolorum qu', 'Et eligendi quidem t', 'Sunt optio cillum ', '2', '23', '87', '+1 (166) 584-4513', '58', '10'),
(12, 'Quod lorem sit venia', 'Nulla magn', 'Rerum dolorem ipsum', 'Porro voluptates vol', 'Alias eius nobis qua', '12', '50', '2', '+1 (649) 339-7599', '12', '10'),
(13, 'Fugiat aliquip ', 'Elit eos s', 'Similique ut qui sed', 'Et labore nulla Nam ', 'Vitae in laudantium', '10', '23', '9', '+1 (492) 791-5697', '12', '20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adresse`
--
ALTER TABLE `adresse`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adresse`
--
ALTER TABLE `adresse`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
