-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Oct 31, 2025 at 10:32 AM
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
-- Table structure for table `affaire`
--

CREATE TABLE `affaire` (
  `id` int NOT NULL,
  `reference` varchar(150) DEFAULT NULL,
  `titre` varchar(100) DEFAULT NULL,
  `zoneIntervention` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `clientId` int DEFAULT NULL,
  `etatLogement` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `technicienId` int DEFAULT NULL,
  `equipeTechnicienId` int DEFAULT NULL,
  `referentId` int DEFAULT NULL,
  `dateDebut` date DEFAULT NULL,
  `dateFin` date DEFAULT NULL,
  `motsCles` varchar(900) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `dureePrevueHeures` int DEFAULT NULL,
  `dureePrevueMinutes` int DEFAULT NULL,
  `memo` text,
  `memoPiecesJointes` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `affaire`
--

INSERT INTO `affaire` (`id`, `reference`, `titre`, `zoneIntervention`, `description`, `clientId`, `etatLogement`, `technicienId`, `equipeTechnicienId`, `referentId`, `dateDebut`, `dateFin`, `motsCles`, `dureePrevueHeures`, `dureePrevueMinutes`, `memo`, `memoPiecesJointes`) VALUES
(1, 'Référence de l\'affaire', 'Titre de l\'affaire', '', 'Description de l\'affaire', 51, NULL, 10, NULL, 5, '2025-10-01', '2025-10-29', NULL, NULL, NULL, NULL, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `affaire`
--
ALTER TABLE `affaire`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `affaire`
--
ALTER TABLE `affaire`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
