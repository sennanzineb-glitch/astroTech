-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Nov 04, 2025 at 09:04 AM
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

CREATE TABLE `adresse` (
  `id` int NOT NULL,
  `adresse` varchar(150) DEFAULT NULL,
  `codePostal` varchar(10) DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `pays` varchar(100) DEFAULT NULL,
  `etage` varchar(10) DEFAULT NULL,
  `appartementLocal` varchar(50) DEFAULT NULL,
  `batiment` varchar(50) DEFAULT NULL,
  `interphoneDigicode` varchar(50) DEFAULT NULL,
  `escalier` varchar(50) DEFAULT NULL,
  `porteEntree` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `adresse_email`
--

CREATE TABLE `adresse_email` (
  `id` int NOT NULL,
  `email` varchar(200) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `idContact` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

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
  `etatLogement` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `technicienId` int DEFAULT NULL,
  `equipeTechnicienId` int DEFAULT NULL,
  `dateDebut` date DEFAULT NULL,
  `dateFin` date DEFAULT NULL,
  `motsCles` varchar(900) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `dureePrevueHeures` int DEFAULT NULL,
  `dureePrevueMinutes` int DEFAULT NULL,
  `memo` text,
  `memoPiecesJointes` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `affaire_referent`
--

CREATE TABLE `affaire_referent` (
  `id` int NOT NULL,
  `idAffaire` int NOT NULL,
  `idReferent` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `agence`
--

CREATE TABLE `agence` (
  `id` int NOT NULL,
  `idClient` int DEFAULT NULL,
  `nomAgence` varchar(150) NOT NULL,
  `idAdresse` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `client`
--

CREATE TABLE `client` (
  `id` int NOT NULL,
  `numero` varchar(50) DEFAULT NULL,
  `compte` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `contact`
--

CREATE TABLE `contact` (
  `id` int NOT NULL,
  `nomComplet` varchar(150) NOT NULL,
  `poste` varchar(100) DEFAULT NULL,
  `dateDu` date DEFAULT NULL,
  `dateAu` date DEFAULT NULL,
  `memoNote` text,
  `idClient` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `equipe_technicien`
--

CREATE TABLE `equipe_technicien` (
  `id` int NOT NULL,
  `nom` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text,
  `chefId` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `equipe_technicien`
--

INSERT INTO `equipe_technicien` (`id`, `nom`, `description`, `chefId`) VALUES
(1, 'ddd', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `fichier`
--

CREATE TABLE `fichier` (
  `id` int NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `chemin` varchar(255) DEFAULT NULL,
  `taille` int DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `date_upload` datetime DEFAULT CURRENT_TIMESTAMP,
  `idReferent` int DEFAULT NULL,
  `idAffaire` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `num_tel`
--

CREATE TABLE `num_tel` (
  `id` int NOT NULL,
  `tel` varchar(20) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `idContact` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `organisation`
--

CREATE TABLE `organisation` (
  `id` int NOT NULL,
  `idClient` int DEFAULT NULL,
  `nomEntreprise` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `particulier`
--

CREATE TABLE `particulier` (
  `id` int NOT NULL,
  `nomComplet` varchar(250) NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `idAdresse` int DEFAULT NULL,
  `idClient` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Table structure for table `referent`
--

CREATE TABLE `referent` (
  `id` int NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `dateNaissance` date DEFAULT NULL,
  `poste` varchar(100) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `referent`
--

INSERT INTO `referent` (`id`, `nom`, `prenom`, `telephone`, `email`, `dateNaissance`, `poste`, `adresse`) VALUES
(1, 'SENNAN', 'Zineb', '064578963214', 'sennan.zineb@gmail.com', NULL, NULL, NULL),
(2, 'senn', 'Lorem', 'Enim aut sint quia ', 'narymibeli@mailinator.com', '2025-11-03', 'Et sit nesciunt qu', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `technicien`
--

CREATE TABLE `technicien` (
  `id` int NOT NULL,
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `dateNaissance` date DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `pwd` varchar(255) NOT NULL,
  `specialite` varchar(100) DEFAULT NULL,
  `certifications` text,
  `experience` int DEFAULT NULL,
  `zoneIntervention` varchar(100) DEFAULT NULL,
  `dateEmbauche` date DEFAULT NULL,
  `typeContrat` varchar(50) DEFAULT NULL,
  `salaire` decimal(10,2) DEFAULT NULL,
  `statut` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `technicien`
--

INSERT INTO `technicien` (`id`, `nom`, `prenom`, `dateNaissance`, `adresse`, `telephone`, `email`, `pwd`, `specialite`, `certifications`, `experience`, `zoneIntervention`, `dateEmbauche`, `typeContrat`, `salaire`, `statut`) VALUES
(1, 'mmm', 'mmm', NULL, NULL, '06457896321', NULL, '123456789', 'mmm', NULL, NULL, NULL, NULL, NULL, NULL, 'Actif'),
(2, 'SENNAN', 'fff', NULL, NULL, '0645789632', NULL, '987654321', 'zzz', NULL, NULL, NULL, NULL, NULL, NULL, 'Actif');

-- --------------------------------------------------------

--
-- Table structure for table `technicien_equipe`
--

CREATE TABLE `technicien_equipe` (
  `id` int NOT NULL,
  `technicienId` int NOT NULL,
  `equipeId` int NOT NULL,
  `dateAffectation` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `technicien_equipe`
--

INSERT INTO `technicien_equipe` (`id`, `technicienId`, `equipeId`, `dateAffectation`) VALUES
(1, 2, 1, '2025-11-03 21:02:58');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'user',
  `date_creation` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `role`, `date_creation`) VALUES
(3, 'user@example.com', '$2b$10$z874c9g0wr7a8Kezbvv.suA/A/A86Jedi7colIGIhku5DbRV0vXoW', 'SENNAN Zineb', 'user', '2025-10-30 16:07:32');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `adresse`
--
ALTER TABLE `adresse`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `adresse_email`
--
ALTER TABLE `adresse_email`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `affaire`
--
ALTER TABLE `affaire`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `affaire_referent`
--
ALTER TABLE `affaire_referent`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `agence`
--
ALTER TABLE `agence`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `equipe_technicien`
--
ALTER TABLE `equipe_technicien`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `fichier`
--
ALTER TABLE `fichier`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `num_tel`
--
ALTER TABLE `num_tel`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `organisation`
--
ALTER TABLE `organisation`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `particulier`
--
ALTER TABLE `particulier`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `referent`
--
ALTER TABLE `referent`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `technicien`
--
ALTER TABLE `technicien`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `technicien_equipe`
--
ALTER TABLE `technicien_equipe`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `adresse`
--
ALTER TABLE `adresse`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `adresse_email`
--
ALTER TABLE `adresse_email`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `affaire`
--
ALTER TABLE `affaire`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `affaire_referent`
--
ALTER TABLE `affaire_referent`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `agence`
--
ALTER TABLE `agence`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `client`
--
ALTER TABLE `client`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `equipe_technicien`
--
ALTER TABLE `equipe_technicien`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `fichier`
--
ALTER TABLE `fichier`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `num_tel`
--
ALTER TABLE `num_tel`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `organisation`
--
ALTER TABLE `organisation`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `particulier`
--
ALTER TABLE `particulier`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `referent`
--
ALTER TABLE `referent`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `technicien`
--
ALTER TABLE `technicien`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `technicien_equipe`
--
ALTER TABLE `technicien_equipe`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
