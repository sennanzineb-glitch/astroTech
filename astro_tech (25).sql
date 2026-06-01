-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : db
-- Généré le : ven. 22 mai 2026 à 10:51
-- Version du serveur : 9.6.0
-- Version de PHP : 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `astro_tech`
--

-- --------------------------------------------------------

--
-- Structure de la table `adresse`
--

CREATE TABLE `adresse` (
  `id` int NOT NULL,
  `adresse` varchar(150) DEFAULT NULL,
  `code_postal` varchar(10) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ville` varchar(100) DEFAULT NULL,
  `province` varchar(100) DEFAULT NULL,
  `pays` varchar(100) DEFAULT NULL,
  `etage` varchar(10) DEFAULT NULL,
  `appartement_local` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `batiment` varchar(50) DEFAULT NULL,
  `interphone_digicode` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `escalier` varchar(50) DEFAULT NULL,
  `porte_entree` varchar(50) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `adresse`
--

INSERT INTO `adresse` (`id`, `adresse`, `code_postal`, `ville`, `province`, `pays`, `etage`, `appartement_local`, `batiment`, `interphone_digicode`, `escalier`, `porte_entree`, `createur_id`, `date_creation`, `date_modification`) VALUES
(2, 'Ipsa sed est corru', 'Pariatur', 'Maiores', 'Placeat', 'Etquo', '5', '8', '7', '4', '7', '6', NULL, '2026-04-27 16:38:57', '2026-04-27 16:38:57');

-- --------------------------------------------------------

--
-- Structure de la table `adresse_email`
--

CREATE TABLE `adresse_email` (
  `id` int NOT NULL,
  `email` varchar(200) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `contact_id` int DEFAULT NULL,
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `adresse_email`
--

INSERT INTO `adresse_email` (`id`, `email`, `type`, `contact_id`, `createur_id`, `date_creation`, `date_modification`) VALUES
(1, 'tatusizehy@mailinator.com', 'autre', 1, 1, '2026-04-29 10:13:09', '2026-04-29 10:13:09'),
(2, 'zymyfoda@mailinator.com', 'professionnel', 2, 1, '2026-04-29 10:15:58', '2026-04-29 10:15:58'),
(3, 'kojepici@mailinator.com', 'personnel', 3, 1, '2026-04-29 10:15:58', '2026-04-29 10:15:58'),
(4, 'vevilokyb@mailinator.com', 'personnel', 4, 1, '2026-04-29 10:18:53', '2026-04-29 10:18:53'),
(5, 'moquv@mailinator.com', 'personnel', 5, 1, '2026-04-29 10:27:07', '2026-04-29 10:27:07'),
(6, 'ziluvejok@mailinator.com', 'professionnel', 6, 1, '2026-04-29 10:27:07', '2026-04-29 10:27:07'),
(7, 'myrazuvu@mailinator.com', 'professionnel', 7, 1, '2026-04-29 12:01:27', '2026-04-29 12:01:27'),
(8, 'fytadax@mailinator.com', 'professionnel', 8, 1, '2026-04-29 12:21:15', '2026-04-29 12:21:15'),
(9, 'fiwazawej@mailinator.com', 'professionnel', 9, 1, '2026-04-29 12:26:22', '2026-04-29 12:26:22'),
(10, 'zabulowiwa@mailinator.com', 'autre', 10, 1, '2026-04-29 12:26:22', '2026-04-29 12:26:22'),
(11, 'juduqebuju@mailinator.com', 'autre', 11, 1, '2026-04-29 12:27:28', '2026-04-29 12:27:28'),
(12, 'modasyhyzo@mailinator.com', 'personnel', 12, 1, '2026-04-29 12:35:10', '2026-04-29 12:35:10'),
(13, 'kugifotere@mailinator.com', 'professionnel', 13, 1, '2026-04-29 12:37:55', '2026-04-29 12:37:55'),
(14, 'wyzegepo@mailinator.com', 'autre', 14, 1, '2026-04-29 12:38:59', '2026-04-29 12:38:59'),
(15, 'ryhomalyb@mailinator.com', 'autre', 15, 1, '2026-04-29 13:08:54', '2026-04-29 13:08:54'),
(16, 'totegoxe@mailinator.com', 'professionnel', 16, 1, '2026-04-29 13:10:10', '2026-04-29 13:10:10'),
(17, 'xacupemyc@mailinator.com', 'personnel', 17, 1, '2026-04-29 13:37:55', '2026-04-29 13:37:55'),
(18, 'vaxyjede@mailinator.com', 'autre', 18, 1, '2026-04-29 13:40:26', '2026-04-29 13:40:26'),
(20, 'nehemefek@mailinator.com', 'personnel', 20, 1, '2026-04-30 08:53:50', '2026-04-30 08:53:50');

-- --------------------------------------------------------

--
-- Structure de la table `affaire`
--

CREATE TABLE `affaire` (
  `id` int NOT NULL,
  `reference` varchar(150) DEFAULT NULL,
  `titre` varchar(100) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `etatLogement` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `technicienId` int DEFAULT NULL,
  `equipeTechnicienId` int DEFAULT NULL,
  `dateDebut` date DEFAULT NULL,
  `dateFin` date DEFAULT NULL,
  `motsCles` varchar(900) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `dureePrevueHeures` int DEFAULT NULL,
  `dureePrevueMinutes` int DEFAULT NULL,
  `memo` text,
  `memoPiecesJointes` text,
  `client_id` int DEFAULT NULL,
  `zone_intervention_client_id` int DEFAULT NULL,
  `type_client_zone_intervention` varchar(250) DEFAULT NULL,
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `affaire_referent`
--

CREATE TABLE `affaire_referent` (
  `id` int NOT NULL,
  `idAffaire` int NOT NULL,
  `idReferent` int NOT NULL,
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `agence`
--

CREATE TABLE `agence` (
  `id` int NOT NULL,
  `client_id` int DEFAULT NULL,
  `nom_agence` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `note` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `adresse_id` int DEFAULT NULL,
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `agence`
--

INSERT INTO `agence` (`id`, `client_id`, `nom_agence`, `note`, `adresse_id`, `createur_id`, `date_creation`, `date_modification`) VALUES
(1, 2, 'Dolore', NULL, 1, 1, '2026-04-29 10:15:58', '2026-04-29 10:15:58'),
(2, 4, 'Recusandae', NULL, 2, 1, '2026-04-29 10:27:07', '2026-04-29 10:27:07'),
(4, 7, 'Aut ducimus', NULL, 1, 1, '2026-04-29 12:21:15', '2026-04-29 12:21:15'),
(5, 15, 'Quisquam', NULL, 3, 1, '2026-04-29 13:37:55', '2026-04-29 13:37:55'),
(6, 16, 'Non', NULL, 1, 1, '2026-04-29 13:40:26', '2026-04-29 13:40:26'),
(8, 18, 'Numquam', NULL, 1, 1, '2026-04-30 09:19:22', '2026-04-30 09:19:22'),
(9, 19, 'Doloremque', NULL, NULL, 1, '2026-04-30 09:24:50', '2026-04-30 09:24:50'),
(11, 21, 'Sequi', NULL, NULL, 1, '2026-04-30 09:57:08', '2026-04-30 09:57:08'),
(12, 22, 'Perferendis', NULL, NULL, 1, '2026-04-30 10:04:06', '2026-04-30 10:04:06'),
(13, 23, 'Eiusmod', NULL, NULL, 1, '2026-04-30 14:10:01', '2026-04-30 14:10:01'),
(14, 24, 'Reprehenderit', NULL, NULL, 1, '2026-04-30 14:10:32', '2026-04-30 14:10:32'),
(15, 25, 'Voluptatem', NULL, NULL, 1, '2026-04-30 14:23:01', '2026-04-30 14:23:01'),
(16, 26, 'Nobis', NULL, NULL, 1, '2026-04-30 16:50:10', '2026-04-30 16:50:10');

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

CREATE TABLE `client` (
  `id` int NOT NULL,
  `numero` varchar(50) DEFAULT NULL,
  `compte` varchar(50) DEFAULT NULL,
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `parent_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `client`
--

INSERT INTO `client` (`id`, `numero`, `compte`, `createur_id`, `date_creation`, `date_modification`, `parent_id`) VALUES
(1, 'C-10025', '411CORR', 1, '2026-04-29 10:13:09', '2026-04-29 10:13:09', NULL),
(2, 'E-2145', '125CDE', 1, '2026-04-29 10:15:58', '2026-04-29 10:15:58', NULL),
(3, 'M-3211552', '21552CDF', 1, '2026-04-29 10:18:53', '2026-04-29 10:18:53', NULL),
(4, 'E-254289', '6254EZF', 1, '2026-04-29 10:27:07', '2026-04-29 10:27:07', NULL),
(5, 'I-5414528', '35445PEE', 1, '2026-04-29 12:01:27', '2026-04-29 12:01:27', NULL),
(7, 'D-2547896', '987662MKD', 1, '2026-04-29 12:21:15', '2026-04-29 12:21:15', NULL),
(8, 'S-247852', '54852QAU', 1, '2026-04-29 12:26:22', '2026-04-29 12:26:22', NULL),
(9, 'A-245882', '5644872KAL', 1, '2026-04-29 12:27:28', '2026-04-29 12:27:28', NULL),
(10, 'Q-2354817', '98412PLD', 1, '2026-04-29 12:35:10', '2026-04-29 12:35:10', NULL),
(11, 'O-5478524', '98742PLK', 1, '2026-04-29 12:37:55', '2026-04-29 12:37:55', NULL),
(12, 'B-987562', '96521MLKJ', 1, '2026-04-29 12:38:59', '2026-04-29 12:38:59', 1),
(13, 'E-26547', '622452PKJ', 1, '2026-04-29 13:08:54', '2026-04-29 13:08:54', NULL),
(14, 'Q-22555', '55828PKL ', 1, '2026-04-29 13:10:10', '2026-04-29 13:10:10', NULL),
(15, 'U-2365897', '98814MLK', 1, '2026-04-29 13:37:55', '2026-04-29 13:37:55', NULL),
(16, 'E-364798', '987562MFD', 1, '2026-04-29 13:40:26', '2026-04-29 13:40:26', NULL),
(18, 'A-365874', '3652QSA', 1, '2026-04-30 09:19:18', '2026-04-30 09:22:30', 2),
(19, 'U-52478', '654215SSQ', 1, '2026-04-30 09:24:48', '2026-04-30 09:24:48', 2),
(21, 'E-25414', '85245PLKJ', 1, '2026-04-30 09:57:08', '2026-04-30 09:57:08', 2),
(22, 'E-42124', '2514HHJ', 1, '2026-04-30 10:04:06', '2026-04-30 10:04:06', 2),
(23, 'Omnis', 'Lorem', 1, '2026-04-30 14:10:01', '2026-04-30 14:10:01', 19),
(24, 'Deserunt', 'Idunde', 1, '2026-04-30 14:10:32', '2026-04-30 14:10:32', 19),
(25, 'Quis', 'Eius', 1, '2026-04-30 14:23:01', '2026-04-30 14:23:01', 12),
(26, 'In-51256', 'Quasi', 1, '2026-04-30 16:50:10', '2026-04-30 16:50:10', 5);

-- --------------------------------------------------------

--
-- Structure de la table `contact`
--

CREATE TABLE `contact` (
  `id` int NOT NULL,
  `nom_complet` varchar(150) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `poste` varchar(100) DEFAULT NULL,
  `date_du` date DEFAULT NULL,
  `date_au` date DEFAULT NULL,
  `memo_note` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `client_id` int DEFAULT NULL,
  `secteur_id` int DEFAULT NULL,
  `habitation_id` int DEFAULT NULL,
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `contact`
--

INSERT INTO `contact` (`id`, `nom_complet`, `poste`, `date_du`, `date_au`, `memo_note`, `client_id`, `secteur_id`, `habitation_id`, `createur_id`, `date_creation`, `date_modification`) VALUES
(1, 'Eos earum', 'Autem', '1979-05-16', '1972-06-13', NULL, 1, NULL, NULL, 1, '2026-04-29 10:13:09', '2026-04-29 10:13:09'),
(2, 'Rerum', 'Enim', '1973-11-18', '1986-01-11', NULL, 2, NULL, NULL, 1, '2026-04-29 10:15:58', '2026-04-29 10:15:58'),
(3, 'Corporis necessitati', 'Corporis', '2022-04-30', '1989-10-31', NULL, 2, NULL, NULL, 1, '2026-04-29 10:15:58', '2026-04-29 10:15:58'),
(4, 'Sunt eius', 'Quidem', '2004-07-25', '1978-03-10', NULL, 3, NULL, NULL, 1, '2026-04-29 10:18:53', '2026-04-29 10:18:53'),
(5, 'Ipsum magni', 'Assumenda', '1982-07-03', '1971-06-21', NULL, 4, NULL, NULL, 1, '2026-04-29 10:27:07', '2026-04-29 10:27:07'),
(6, 'Incidunt autem', 'Impedit', '2001-01-20', '2008-03-17', NULL, 4, NULL, NULL, 1, '2026-04-29 10:27:07', '2026-04-29 10:27:07'),
(7, 'Placeat omnis', 'Nam sed', '1971-08-22', '1973-03-22', NULL, 5, NULL, NULL, 1, '2026-04-29 12:01:27', '2026-04-29 12:01:27'),
(8, 'Animi utmaiores', 'Consequuntur', '2018-08-11', '2022-04-25', NULL, 7, NULL, NULL, 1, '2026-04-29 12:21:15', '2026-04-29 12:21:15'),
(9, 'Consequatur', 'Voluptates', '1970-09-12', '1998-10-01', NULL, 8, NULL, NULL, 1, '2026-04-29 12:26:22', '2026-04-29 12:26:22'),
(10, 'Inventore', 'Corporis', '2023-06-18', '1992-06-22', NULL, 8, NULL, NULL, 1, '2026-04-29 12:26:22', '2026-04-29 12:26:22'),
(11, 'Iste esse', 'Dolor', '1995-05-07', '1980-04-07', NULL, 9, NULL, NULL, 1, '2026-04-29 12:27:28', '2026-04-29 12:27:28'),
(12, 'Itaque accusantium', 'Inincidunt', '1995-07-27', '2021-09-15', NULL, 10, NULL, NULL, 1, '2026-04-29 12:35:10', '2026-04-29 12:35:10'),
(13, 'Culpa aut', 'Deserunt', '1996-08-19', '2011-02-06', NULL, 11, NULL, NULL, 1, '2026-04-29 12:37:55', '2026-04-29 12:37:55'),
(14, 'Et rerum', 'Molestiae', '2009-05-15', '2013-10-01', NULL, 12, NULL, NULL, 1, '2026-04-29 12:38:59', '2026-04-29 12:38:59'),
(15, 'Esse alias', 'Asperiores', '1999-08-04', '2026-03-07', NULL, 13, NULL, NULL, 1, '2026-04-29 13:08:54', '2026-04-29 13:08:54'),
(16, 'Beatae pariatur', 'Et voluptatibus', '2012-07-17', '2013-09-14', NULL, 14, NULL, NULL, 1, '2026-04-29 13:10:10', '2026-04-29 13:10:10'),
(17, 'Sed', 'Eiusmod', '2025-09-18', '2020-03-17', NULL, 15, NULL, NULL, 1, '2026-04-29 13:37:55', '2026-04-29 13:37:55'),
(18, 'Et voluptates', 'Nihil', '1971-02-15', '2010-09-17', NULL, 16, NULL, NULL, 1, '2026-04-29 13:40:26', '2026-04-29 13:40:26'),
(20, 'Eum voluptatum', 'Aut', '2001-03-10', '1989-09-29', NULL, 17, NULL, NULL, 1, '2026-04-30 08:53:50', '2026-04-30 08:53:50');

-- --------------------------------------------------------

--
-- Structure de la table `equipe_technicien`
--

CREATE TABLE `equipe_technicien` (
  `id` int NOT NULL,
  `nom` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text,
  `chefId` int DEFAULT NULL,
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `equipe_technicien`
--

INSERT INTO `equipe_technicien` (`id`, `nom`, `description`, `chefId`, `createur_id`, `date_creation`, `date_modification`) VALUES
(1, 'Placeat', NULL, 2, 1, '2026-04-27 16:11:42', '2026-04-27 16:11:42'),
(2, 'Veniam', NULL, 6, 1, '2026-04-27 16:14:08', '2026-04-27 16:14:08');

-- --------------------------------------------------------

--
-- Structure de la table `fichier`
--

CREATE TABLE `fichier` (
  `id` int NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `chemin` varchar(255) DEFAULT NULL,
  `taille` int DEFAULT NULL,
  `type` varchar(100) DEFAULT NULL,
  `idReferent` int DEFAULT NULL,
  `idAffaire` int DEFAULT NULL,
  `date_upload` datetime DEFAULT CURRENT_TIMESTAMP,
  `createur_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `fichier`
--

INSERT INTO `fichier` (`id`, `nom`, `chemin`, `taille`, `type`, `idReferent`, `idAffaire`, `date_upload`, `createur_id`) VALUES
(1, 'image1.jpeg', '1777306543648-image1.jpeg', 8127, 'image/jpeg', 1, NULL, '2026-04-27 16:15:43', NULL),
(2, 'download.jpeg', '1777306543638-download.jpeg', 7799, 'image/jpeg', 1, NULL, '2026-04-27 16:15:43', NULL),
(3, 'images.jpeg', '1777306565293-images.jpeg', 10818, 'image/jpeg', 1, NULL, '2026-04-27 16:16:05', NULL),
(4, 'images.jpeg', '1777451818066-images.jpeg', 10818, 'image/jpeg', 2, NULL, '2026-04-29 08:36:58', NULL),
(5, 'Capture.PNG', '1779373027381-Capture.PNG', 16541, 'image/png', 3, NULL, '2026-05-21 14:17:07', NULL),
(6, 'Capture4.PNG', '1779373050320-Capture4.PNG', 6421, 'image/png', 3, NULL, '2026-05-21 14:17:30', NULL);

-- --------------------------------------------------------

--
-- Structure de la table `habitation`
--

CREATE TABLE `habitation` (
  `id` int NOT NULL,
  `reference` varchar(100) NOT NULL,
  `surface` decimal(8,2) DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `adresse_id` int DEFAULT NULL,
  `secteur_id` int DEFAULT NULL,
  `agence_id` int DEFAULT NULL,
  `organisation_id` int DEFAULT NULL,
  `particulier_id` int DEFAULT NULL,
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `habitation`
--

INSERT INTO `habitation` (`id`, `reference`, `surface`, `note`, `adresse_id`, `secteur_id`, `agence_id`, `organisation_id`, `particulier_id`, `createur_id`, `date_creation`, `date_modification`) VALUES
(1, 'Voluptate', NULL, NULL, NULL, NULL, 2, NULL, NULL, 1, '2026-04-30 10:07:56', '2026-04-30 10:07:56'),
(2, 'Excepturi', NULL, NULL, NULL, 5, NULL, NULL, NULL, 1, '2026-04-30 14:41:48', '2026-04-30 14:41:48'),
(3, '45155', NULL, NULL, NULL, 9, NULL, NULL, NULL, 1, '2026-04-30 16:54:34', '2026-04-30 16:54:34');

-- --------------------------------------------------------

--
-- Structure de la table `intervention`
--

CREATE TABLE `intervention` (
  `id` int NOT NULL,
  `titre` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `numero` int NOT NULL,
  `type_id` int DEFAULT NULL,
  `priorite` varchar(50) DEFAULT NULL,
  `etat` varchar(100) DEFAULT NULL,
  `date_butoir_realisation` date DEFAULT NULL,
  `date_cloture_estimee` date DEFAULT NULL,
  `mots_cles` varchar(255) DEFAULT NULL,
  `montant_intervention` decimal(10,2) DEFAULT '0.00',
  `montant_main_oeuvre` decimal(10,2) DEFAULT '0.00',
  `montant_fournitures` decimal(10,2) DEFAULT '0.00',
  `date_prevue` datetime DEFAULT NULL,
  `duree_heures` int DEFAULT '0',
  `duree_minutes` int DEFAULT '0',
  `date_debut_prevue` datetime DEFAULT NULL,
  `date_fin_prevue` datetime DEFAULT NULL,
  `duree_prevue_heures` int DEFAULT '0',
  `duree_prevue_minutes` int DEFAULT '0',
  `date_debut_intervention` date DEFAULT NULL,
  `heure_debut_intervention_h` int DEFAULT NULL,
  `heure_debut_intervention_min` int DEFAULT NULL,
  `date_fin_intervention` date DEFAULT NULL,
  `heure_fin_intervention_h` int DEFAULT NULL,
  `heure_fin_intervention_min` int DEFAULT NULL,
  `temps_trajet_estime_heures` int DEFAULT '0',
  `temps_trajet_estime_minutes` int DEFAULT '0',
  `archive` tinyint(1) DEFAULT '0',
  `id_affaire` int DEFAULT NULL,
  `equipe_id` int DEFAULT NULL,
  `client_id` int DEFAULT NULL,
  `zone_intervention_client_id` int DEFAULT NULL,
  `type_client_zone_intervention` varchar(250) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `intervention`
--

INSERT INTO `intervention` (`id`, `titre`, `description`, `numero`, `type_id`, `priorite`, `etat`, `date_butoir_realisation`, `date_cloture_estimee`, `mots_cles`, `montant_intervention`, `montant_main_oeuvre`, `montant_fournitures`, `date_prevue`, `duree_heures`, `duree_minutes`, `date_debut_prevue`, `date_fin_prevue`, `duree_prevue_heures`, `duree_prevue_minutes`, `date_debut_intervention`, `heure_debut_intervention_h`, `heure_debut_intervention_min`, `date_fin_intervention`, `heure_fin_intervention_h`, `heure_fin_intervention_min`, `temps_trajet_estime_heures`, `temps_trajet_estime_minutes`, `archive`, `id_affaire`, `equipe_id`, `client_id`, `zone_intervention_client_id`, `type_client_zone_intervention`, `createur_id`, `date_creation`, `date_modification`) VALUES
(1, 'Odio ipsum', 'Nihil sint iste aut', 1, 18, 'moyenne', 'en_cours', NULL, NULL, NULL, 0.00, 0.00, 0.00, NULL, 0, 0, '2026-05-06 00:00:00', '2026-05-06 00:00:00', 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, 2, 4, 2, 'client', 1, '2026-05-07 05:58:09', '2026-05-07 05:59:02'),
(2, 'Optio ipsam et quia', 'Eu dolore ut aut qui', 2, 30, 'moyenne', 'en_cours', NULL, NULL, NULL, 0.00, 0.00, 0.00, NULL, 0, 0, NULL, NULL, 0, 0, NULL, NULL, NULL, NULL, NULL, NULL, 0, 0, 0, NULL, NULL, 1, 4, 'secteur', 1, '2026-05-21 14:20:41', '2026-05-21 14:20:41');

-- --------------------------------------------------------

--
-- Structure de la table `intervention_interruptions`
--

CREATE TABLE `intervention_interruptions` (
  `id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `intervention_id` int NOT NULL,
  `reason` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `custom_reason` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `started_at` timestamp NOT NULL,
  `ended_at` timestamp NULL DEFAULT NULL,
  `duration_minutes` int DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `intervention_photos`
--

CREATE TABLE `intervention_photos` (
  `id` int NOT NULL,
  `intervention_id` int NOT NULL,
  `photo_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `filename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `file_path` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `drawing_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `photo_context` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `local_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `captured_at` timestamp NULL DEFAULT NULL,
  `uploaded_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `uploaded_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `intervention_planning`
--

CREATE TABLE `intervention_planning` (
  `id` int NOT NULL,
  `intervention_id` int NOT NULL,
  `date` date NOT NULL,
  `heure` time NOT NULL,
  `createur_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `intervention_referent`
--

CREATE TABLE `intervention_referent` (
  `id` int NOT NULL,
  `intervention_id` int DEFAULT NULL,
  `referent_id` int DEFAULT NULL,
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `intervention_signatures`
--

CREATE TABLE `intervention_signatures` (
  `id` int NOT NULL,
  `intervention_id` int NOT NULL,
  `signature_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `signature_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `signed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `signed_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `intervention_technicien`
--

CREATE TABLE `intervention_technicien` (
  `id` int NOT NULL,
  `id_intervention` int NOT NULL,
  `id_technicien` int NOT NULL,
  `role` varchar(100) DEFAULT NULL,
  `createur_id` int DEFAULT NULL,
  `date_affectation` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `intervention_type`
--

CREATE TABLE `intervention_type` (
  `id` int NOT NULL,
  `libelle` varchar(200) NOT NULL,
  `categorie` varchar(100) NOT NULL,
  `actif` tinyint(1) DEFAULT '1',
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `intervention_type`
--

INSERT INTO `intervention_type` (`id`, `libelle`, `categorie`, `actif`, `createur_id`, `date_creation`, `date_modification`) VALUES
(1, 'Carottage', 'Travaux principaux', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(2, 'Montage colonne', 'Travaux principaux', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(3, 'Porte palière', 'Travaux principaux', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(4, 'Descente EP balcon', 'Travaux principaux', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(5, 'MEXT', 'Travaux principaux', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(6, 'Chute WC', 'Travaux principaux', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(7, 'Bascule', 'Travaux principaux', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(8, 'Urgences', 'Travaux principaux', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(9, 'Auto-contrôle Bascule', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(10, 'Auto-contrôle CAROTTAGE', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(11, 'Auto-contrôle Electricité', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(12, 'Auto-contrôle FLOCAGE', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(13, 'Auto-contrôle Faience', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(14, 'Auto-contrôle ISOLATION DES COMBLES', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(15, 'Auto-contrôle Peinture', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(16, 'Auto-contrôle Plomberie Sanitaire', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(17, 'Auto-contrôle Plâtrerie', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(18, 'Auto-contrôle Remplacement colonne WC', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(19, 'Auto-contrôle SCIAGE', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(20, 'Auto-contrôle Sol Souple', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(21, 'Auto-contrôle VMC comble', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(22, 'Auto-contrôle calorifuge logement', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(23, 'Auto-contrôle carrelage hall d’entrée', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(24, 'Auto-contrôle peinture hall d’entrée', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(25, 'Auto-contrôle pose des MEXT', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(26, 'Auto-contrôle réseau sous-sol rcu', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(27, 'Auto-contrôle travaux d’électricité partie commune', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(28, 'Auto-contrôle travaux intratone', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(29, 'Interphonie', 'Auto-contrôle', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(30, 'Quitus (validation finale)', 'Quitus', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(31, 'Quitus plomberie', 'Quitus', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(32, 'Quitus faïence', 'Quitus', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(33, 'Quitus électricité', 'Quitus', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(34, 'Quitus peinture', 'Quitus', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(35, 'Quitus sol souple', 'Quitus', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(36, 'Quitus appareillages', 'Quitus', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(37, 'Quitus calo colonnes', 'Quitus', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(38, 'Quitus flocage', 'Quitus', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14'),
(39, 'Encoffrement WC', 'Quitus', 1, NULL, '2026-01-12 16:47:14', '2026-01-12 16:47:14');

-- --------------------------------------------------------

--
-- Structure de la table `intervention_workflow`
--

CREATE TABLE `intervention_workflow` (
  `id` int NOT NULL,
  `intervention_id` int NOT NULL,
  `security_checklist` json DEFAULT NULL,
  `photos_before_count` int DEFAULT '0',
  `photos_after_count` int DEFAULT '0',
  `comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `client_observations` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `technical_observations` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `quality_control` json DEFAULT NULL,
  `has_technician_signature` tinyint(1) DEFAULT '0',
  `technician_signature_data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `has_client_signature` tinyint(1) DEFAULT '0',
  `client_signature_data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `has_additional_work` tinyint(1) DEFAULT '0',
  `additional_work_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `additional_work_photos_count` int DEFAULT '0',
  `has_additional_work_signature` tinyint(1) DEFAULT '0',
  `quote_comment` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `has_quote_signature` tinyint(1) DEFAULT '0',
  `delivery_note_photos_count` int DEFAULT '0',
  `client_rating` int DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `completed_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `messages`
--

CREATE TABLE `messages` (
  `id` int NOT NULL,
  `sender_id` int NOT NULL,
  `receiver_id` int NOT NULL,
  `content` text,
  `file_url` varchar(255) DEFAULT NULL,
  `file_type` enum('image','audio') DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `messages`
--

INSERT INTO `messages` (`id`, `sender_id`, `receiver_id`, `content`, `file_url`, `file_type`, `is_read`, `created_at`) VALUES
(1, 1, 2, 'Salut ! Est-ce que tu reçois ce message ?', NULL, NULL, 1, '2026-05-07 14:24:45'),
(2, 1, 2, 'Bonjour', NULL, NULL, 1, '2026-05-20 10:37:46'),
(3, 1, 2, '👍🏼', NULL, NULL, 1, '2026-05-20 10:37:57'),
(4, 1, 2, '', '/uploads/vocal_1779273492579.png', 'image', 1, '2026-05-20 10:38:12'),
(5, 1, 2, 'Bonjour', NULL, NULL, 1, '2026-05-20 10:38:37'),
(6, 1, 2, 'Merci', NULL, NULL, 1, '2026-05-20 10:38:42'),
(7, 2, 1, 'Merci', NULL, NULL, 1, '2026-05-20 10:39:46'),
(8, 1, 2, '', '/uploads/vocal_1779273603804.webm', 'audio', 1, '2026-05-20 10:40:03'),
(9, 2, 1, '', '/uploads/vocal_1779274324120.webm', 'audio', 1, '2026-05-20 10:52:04'),
(10, 1, 2, '', '/uploads/vocal_1779275236202.webm', 'audio', 1, '2026-05-20 11:07:16'),
(11, 2, 1, '', '/uploads/vocal_1779275434127.webm', 'audio', 1, '2026-05-20 11:10:34'),
(12, 1, 2, 'Bien', NULL, NULL, 1, '2026-05-20 11:11:00'),
(13, 1, 2, 'Trés bien, bon travaille !', NULL, NULL, 1, '2026-05-20 11:11:52'),
(14, 1, 2, '', '/uploads/vocal_1779276576028.png', 'image', 1, '2026-05-20 11:29:36'),
(15, 2, 1, '', '/uploads/vocal_1779276758841.webm', 'audio', 1, '2026-05-20 11:32:39'),
(16, 1, 2, '', '/uploads/vocal_1779276954311.webm', 'audio', 1, '2026-05-20 11:35:54'),
(17, 2, 1, 'Bonjour Zineb', NULL, NULL, 1, '2026-05-21 10:46:14'),
(18, 1, 2, 'Bonjour', NULL, NULL, 1, '2026-05-21 10:46:57'),
(19, 1, 2, 'Vous êtes bien !', NULL, NULL, 1, '2026-05-21 10:47:41'),
(20, 2, 1, 'tres bien', NULL, NULL, 1, '2026-05-21 10:48:10'),
(21, 2, 1, 'et vous', NULL, NULL, 1, '2026-05-21 10:48:15'),
(22, 2, 1, 'moi je suis trés bien.', NULL, NULL, 1, '2026-05-21 10:48:39'),
(23, 1, 2, 'tres bien Zineb si tu as bien je suis aussi trés bien !', NULL, NULL, 1, '2026-05-21 10:49:19');

-- --------------------------------------------------------

--
-- Structure de la table `mots_cles`
--

CREATE TABLE `mots_cles` (
  `id` bigint UNSIGNED NOT NULL,
  `libelle` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `mots_cles`
--

INSERT INTO `mots_cles` (`id`, `libelle`) VALUES
(1, 'Plomberie'),
(2, 'Électricité'),
(3, 'Menuiserie'),
(4, 'Peinture'),
(5, 'Chauffage'),
(6, 'Serrurerie'),
(7, 'Étanchéité'),
(8, 'Maçonnerie'),
(9, 'Urgence Critique'),
(10, 'Priorité Haute'),
(11, 'Intervention Standard'),
(12, 'Maintenance Préventive'),
(13, 'Logement Occupé'),
(14, 'Logement Vacant'),
(15, 'Parties Communes'),
(16, 'Extérieur'),
(17, 'Sous Garantie'),
(18, 'Sinistre'),
(19, 'Remise en état'),
(20, 'Contrôle Qualité');

-- --------------------------------------------------------

--
-- Structure de la table `mot_cle_liens`
--

CREATE TABLE `mot_cle_liens` (
  `id` bigint UNSIGNED NOT NULL,
  `mot_cle_id` int DEFAULT NULL,
  `target_id` int NOT NULL,
  `libelle_custom` varchar(255) DEFAULT NULL,
  `target_type` enum('AFFAIRE','INTERVENTION') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `mot_cle_liens`
--

INSERT INTO `mot_cle_liens` (`id`, `mot_cle_id`, `target_id`, `libelle_custom`, `target_type`) VALUES
(1, 20, 1, NULL, 'INTERVENTION'),
(2, 11, 1, NULL, 'INTERVENTION');

-- --------------------------------------------------------

--
-- Structure de la table `num_tel`
--

CREATE TABLE `num_tel` (
  `id` int NOT NULL,
  `tel` varchar(20) NOT NULL,
  `type` varchar(50) DEFAULT NULL,
  `contact_id` int DEFAULT NULL,
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `num_tel`
--

INSERT INTO `num_tel` (`id`, `tel`, `type`, `contact_id`, `createur_id`, `date_creation`, `date_modification`) VALUES
(1, '+212 6 45789632', 'fixe', 1, 1, '2026-04-29 10:13:09', '2026-04-29 10:13:09'),
(2, '+212 6 45789558', 'mobile', 2, 1, '2026-04-29 10:15:58', '2026-04-29 10:15:58'),
(3, '+212 6 45789632 ', 'fax', 3, 1, '2026-04-29 10:15:58', '2026-04-29 10:15:58'),
(4, '+212 6 45789632', 'mobile', 4, 1, '2026-04-29 10:18:53', '2026-04-29 10:18:53'),
(5, '+212 6 45789632', 'fax', 5, 1, '2026-04-29 10:27:07', '2026-04-29 10:27:07'),
(6, '+212 6 45789632', 'fax', 6, 1, '2026-04-29 10:27:07', '2026-04-29 10:27:07'),
(7, '+212 6 78965412', 'fixe', 7, 1, '2026-04-29 12:01:28', '2026-04-29 12:01:28'),
(8, '+212 6 87963214', 'fixe', 8, 1, '2026-04-29 12:21:15', '2026-04-29 12:21:15'),
(9, '+212 6 47859632', 'fixe', 9, 1, '2026-04-29 12:26:22', '2026-04-29 12:26:22'),
(10, '+212 6 47859632', 'fixe', 10, 1, '2026-04-29 12:26:22', '2026-04-29 12:26:22'),
(11, '+212 6 45789632', 'mobile', 11, 1, '2026-04-29 12:27:28', '2026-04-29 12:27:28'),
(12, '+212 6 47859632', 'mobile', 12, 1, '2026-04-29 12:35:10', '2026-04-29 12:35:10'),
(13, '+212 6 54789632', 'autre', 13, 1, '2026-04-29 12:37:55', '2026-04-29 12:37:55'),
(14, '+212 6 78542369', 'autre', 14, 1, '2026-04-29 12:38:59', '2026-04-29 12:38:59'),
(15, '+212 6 78965423', 'mobile', 15, 1, '2026-04-29 13:08:54', '2026-04-29 13:08:54'),
(16, '+212 6 78962145', 'fax', 16, 1, '2026-04-29 13:10:10', '2026-04-29 13:10:10'),
(17, 'Qui quibusdam magnam', 'autre', 17, 1, '2026-04-29 13:37:55', '2026-04-29 13:37:55'),
(18, '+212 6 45 78 96 32', 'fax', 18, 1, '2026-04-29 13:40:26', '2026-04-29 13:40:26'),
(20, '+212 6 45 89 65 32', 'fax', 20, 1, '2026-04-30 08:53:50', '2026-04-30 08:53:50');

-- --------------------------------------------------------

--
-- Structure de la table `organisation`
--

CREATE TABLE `organisation` (
  `id` int NOT NULL,
  `client_id` int DEFAULT NULL,
  `nom_entreprise` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `note` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `organisation`
--

INSERT INTO `organisation` (`id`, `client_id`, `nom_entreprise`, `note`, `createur_id`, `date_creation`, `date_modification`) VALUES
(1, 1, 'Corrupti', NULL, 1, '2026-04-29 10:13:09', '2026-04-29 10:13:09'),
(2, 5, 'Esperiores', NULL, 1, '2026-04-29 12:01:27', '2026-04-29 12:01:27'),
(3, 8, 'Laboris harum', NULL, 1, '2026-04-29 12:26:22', '2026-04-29 12:26:22'),
(4, 9, 'Labore', NULL, 1, '2026-04-29 12:27:28', '2026-04-29 12:27:28'),
(5, 10, 'Odit aut', NULL, 1, '2026-04-29 12:35:10', '2026-04-29 12:35:10'),
(6, 11, 'Voluptatem', NULL, 1, '2026-04-29 12:37:55', '2026-04-29 12:37:55'),
(7, 12, 'Temporibus', NULL, 1, '2026-04-29 12:38:59', '2026-04-29 12:38:59'),
(8, 13, 'Autem', NULL, 1, '2026-04-29 13:08:54', '2026-04-29 13:08:54'),
(9, 14, 'Consequatur', NULL, 1, '2026-04-29 13:10:10', '2026-04-29 13:10:10');

-- --------------------------------------------------------

--
-- Structure de la table `particulier`
--

CREATE TABLE `particulier` (
  `id` int NOT NULL,
  `nom_complet` varchar(250) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `email` varchar(150) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `note` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci,
  `adresse_id` int DEFAULT NULL,
  `client_id` int DEFAULT NULL,
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `particulier`
--

INSERT INTO `particulier` (`id`, `nom_complet`, `email`, `telephone`, `note`, `adresse_id`, `client_id`, `createur_id`, `date_creation`, `date_modification`) VALUES
(1, 'Alias fugiat aut si', 'cecy@mailinator.com', '+212 6 45789632', NULL, 3, 3, 1, '2026-04-29 10:18:53', '2026-04-29 10:18:53');

-- --------------------------------------------------------

--
-- Structure de la table `referent`
--

CREATE TABLE `referent` (
  `id` int NOT NULL,
  `nom` varchar(50) NOT NULL,
  `prenom` varchar(50) NOT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `dateNaissance` date DEFAULT NULL,
  `poste` varchar(100) DEFAULT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `referent`
--

INSERT INTO `referent` (`id`, `nom`, `prenom`, `telephone`, `email`, `dateNaissance`, `poste`, `adresse`, `createur_id`, `date_creation`, `date_modification`) VALUES
(1, 'Hicest', 'Deserunt', '+212 6 4789632', 'sedeqoc@mailinator.com', '2018-02-11', 'Mollit in voluptatib', 'Reprehenderit quod a', 1, '2026-04-27 16:15:43', '2026-04-27 16:15:43'),
(2, 'Amporibus', 'Consequatur ', '06 45 78 96 32', 'lygity@mailinator.com', '2014-01-27', 'Voluptatem', 'Architecto possimus', 1, '2026-04-29 08:36:43', '2026-04-29 08:36:43'),
(3, '_Cupidatat', 'Quam', '06457896321', 'mafod@mailinator.com', '1975-08-04', 'Iusto', 'Ad ipsam laborum Re', 1, '2026-05-21 14:17:07', '2026-05-21 14:17:59');

-- --------------------------------------------------------

--
-- Structure de la table `secteur`
--

CREATE TABLE `secteur` (
  `id` int NOT NULL,
  `reference` varchar(100) NOT NULL,
  `nom` varchar(150) DEFAULT NULL,
  `description` text,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `adresse_id` int DEFAULT NULL,
  `agence_id` int DEFAULT NULL,
  `organisation_id` int DEFAULT NULL,
  `parent_id` int DEFAULT NULL,
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `secteur`
--

INSERT INTO `secteur` (`id`, `reference`, `nom`, `description`, `note`, `adresse_id`, `agence_id`, `organisation_id`, `parent_id`, `createur_id`, `date_creation`, `date_modification`) VALUES
(1, 'Numquam', 'N-54752', NULL, NULL, 1, 2, NULL, NULL, 1, '2026-04-30 09:10:14', '2026-04-30 09:15:19'),
(2, 'U-5248', 'Accusamus', NULL, NULL, NULL, 2, NULL, NULL, 1, '2026-04-30 10:15:33', '2026-04-30 10:15:33'),
(3, '__ffuf', 'secteur', NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-04-30 10:17:37', '2026-04-30 10:18:14'),
(4, 'A-55255', '_Amet', NULL, NULL, NULL, NULL, NULL, 1, 1, '2026-04-30 10:19:42', '2026-04-30 10:19:42'),
(5, 'Doloribus', 'Architecto', NULL, NULL, NULL, 23, NULL, NULL, 1, '2026-04-30 14:11:10', '2026-04-30 14:11:10'),
(6, 'hic eu', 'Maiores', NULL, NULL, NULL, 25, NULL, NULL, 1, '2026-04-30 15:19:39', '2026-04-30 15:19:39'),
(7, 'Et ratione', 'Architecto', NULL, NULL, NULL, 4, NULL, NULL, 1, '2026-04-30 16:21:36', '2026-04-30 16:21:36'),
(8, 'Distinctio Nostrud ', 'Aliquip incididunt s', NULL, NULL, NULL, 26, NULL, NULL, 1, '2026-04-30 16:50:47', '2026-04-30 16:50:47'),
(9, 'Eos molestiae aut si', 'Animi velit repreh', NULL, NULL, NULL, NULL, NULL, 8, 1, '2026-04-30 16:50:59', '2026-04-30 16:50:59'),
(10, 'Possimus', 'U-54785', NULL, NULL, NULL, NULL, NULL, 7, 1, '2026-04-30 16:54:03', '2026-04-30 16:54:03'),
(11, 'Deserunt', 'Lorem', NULL, NULL, NULL, 18, NULL, NULL, 1, '2026-05-21 14:19:15', '2026-05-21 14:19:15'),
(12, 'Earum', 'Provident', NULL, NULL, NULL, 4, NULL, NULL, 1, '2026-05-21 14:20:10', '2026-05-21 14:20:10');

-- --------------------------------------------------------

--
-- Structure de la table `technicien`
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
  `statut` varchar(50) DEFAULT NULL,
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `technicien`
--

INSERT INTO `technicien` (`id`, `nom`, `prenom`, `dateNaissance`, `adresse`, `telephone`, `email`, `pwd`, `specialite`, `certifications`, `experience`, `zoneIntervention`, `dateEmbauche`, `typeContrat`, `salaire`, `statut`, `createur_id`, `date_creation`, `date_modification`) VALUES
(1, 'Duis', 'Earum', '1984-11-20', 'Animi id doloribus', '+1 (319) 488-6312', 'xetyhusi@mailinator.com', 'Pa$$w0rd!', 'Estut', 'Cupiditate', 92, 'Nulla voluptates dol', '1973-08-20', 'CDI', 57.00, 'Actif', 1, '2026-04-27 16:00:12', '2026-04-27 16:00:12'),
(2, 'Eosut', 'Nulla', '2010-03-02', 'Aut quo incididunt c', '+1 (487) 904-5469', 'zefeseji@mailinator.com', 'Pa$$w0rd!', 'Tenetur quo et corru', 'Minim iusto nisi sed', 11, 'Alias provident dol', '1977-09-10', 'CDD', 19.00, 'Actif', 1, '2026-04-27 16:00:39', '2026-04-27 16:00:39'),
(3, 'Nisi', 'Aconsectetur', '1988-08-21', 'Accusamus eligendi c', '+1 (875) 618-7275', 'xeny@mailinator.com', 'Pa$$w0rd!', 'Harum', 'Ut cupidatat exceptu', 11, 'Rem quasi rerum itaq', '2010-03-24', 'CDI', 82.00, 'Inactif', 1, '2026-04-27 16:12:57', '2026-04-27 16:12:57'),
(4, 'Voluptate', 'Ullamco', '1996-12-10', 'Hic et a suscipit al', '+1 (895) 901-5735', 'kevahi@mailinator.com', 'Pa$$w0rd!', 'Ut laboris velit vol', 'Magnam sed placeat ', 99, 'Nesciunt mollitia', '1985-07-17', 'Freelance', 63.00, 'Inactif', 1, '2026-04-27 16:13:16', '2026-04-27 16:13:16'),
(5, 'Iure', 'Sit ', '1976-12-16', 'Officia amet est ul', '+1 (878) 537-8029', 'toxek@mailinator.com', 'Pa$$w0rd!', 'Neque qui laboriosam', 'Tempor et officiis d', 89, 'Asperiores', '2013-04-12', 'CDI', 23.00, 'Inactif', 1, '2026-04-27 16:13:37', '2026-04-27 16:13:37'),
(6, 'Nam', 'Perferendis', '1976-05-17', 'Blanditiis qui sed', '+1 (354) 432-5887', 'jugidowa@mailinator.com', 'Pa$$w0rd!', 'Itaque libero fugit', 'Illo consequuntur ne', 27, 'In dolore dolores', '1972-07-14', 'CDI', 99.00, 'Actif', 1, '2026-04-27 16:13:55', '2026-04-27 16:13:55');

-- --------------------------------------------------------

--
-- Structure de la table `technicien_equipe`
--

CREATE TABLE `technicien_equipe` (
  `id` int NOT NULL,
  `technicienId` int NOT NULL,
  `equipeId` int NOT NULL,
  `dateAffectation` datetime DEFAULT CURRENT_TIMESTAMP,
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `technicien_equipe`
--

INSERT INTO `technicien_equipe` (`id`, `technicienId`, `equipeId`, `dateAffectation`, `createur_id`, `date_creation`) VALUES
(1, 1, 1, '2026-04-27 16:11:42', 1, '2026-04-27 16:11:42'),
(2, 2, 1, '2026-04-27 16:11:42', 1, '2026-04-27 16:11:42'),
(3, 3, 2, '2026-04-27 16:14:09', 1, '2026-04-27 16:14:09');

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `role` varchar(50) DEFAULT 'user',
  `createur_id` int DEFAULT NULL,
  `date_creation` datetime DEFAULT CURRENT_TIMESTAMP,
  `date_modification` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_expires` datetime DEFAULT NULL,
  `is_online` tinyint(1) NOT NULL DEFAULT '0',
  `is_active` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `full_name`, `avatar_url`, `role`, `createur_id`, `date_creation`, `date_modification`, `reset_token`, `reset_expires`, `is_online`, `is_active`) VALUES
(1, 'sennan.zineb@gmail.com', '$2b$10$6Myo2dNSIgB0pP1bQ91iCeuwQERQ/GECBE9/DV2iXSDlClDrTC1rC', 'SENNAN Zineb', NULL, 'user', 3, '2025-10-30 16:07:32', '2026-05-22 10:43:32', 'a5721dbdafed381e0f20c60c13fd73f0edfee8d57cf57fdb9ff452ca0221ea64', '2026-05-22 11:43:33', 1, 1),
(2, 'admin1@gmail.com', '$2b$10$6Myo2dNSIgB0pP1bQ91iCeuwQERQ/GECBE9/DV2iXSDlClDrTC1rC', 'Admin 1', NULL, 'admin', 3, '2025-10-30 16:07:32', '2026-05-22 09:47:59', NULL, NULL, 1, 1),
(3, 'admin2@gmail.com', '$2b$10$6Myo2dNSIgB0pP1bQ91iCeuwQERQ/GECBE9/DV2iXSDlClDrTC1rC', 'Admin 2', NULL, 'admin', 3, '2025-10-30 16:07:32', '2026-05-20 11:39:47', NULL, NULL, 0, 1);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `adresse`
--
ALTER TABLE `adresse`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `adresse_email`
--
ALTER TABLE `adresse_email`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `affaire`
--
ALTER TABLE `affaire`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `affaire_referent`
--
ALTER TABLE `affaire_referent`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `agence`
--
ALTER TABLE `agence`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `contact`
--
ALTER TABLE `contact`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `equipe_technicien`
--
ALTER TABLE `equipe_technicien`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `fichier`
--
ALTER TABLE `fichier`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `habitation`
--
ALTER TABLE `habitation`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `intervention`
--
ALTER TABLE `intervention`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `numero` (`numero`);

--
-- Index pour la table `intervention_interruptions`
--
ALTER TABLE `intervention_interruptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_intervention_id` (`intervention_id`);

--
-- Index pour la table `intervention_photos`
--
ALTER TABLE `intervention_photos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `uploaded_by` (`uploaded_by`),
  ADD KEY `idx_intervention_id` (`intervention_id`),
  ADD KEY `idx_photo_type` (`photo_type`);

--
-- Index pour la table `intervention_planning`
--
ALTER TABLE `intervention_planning`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `intervention_referent`
--
ALTER TABLE `intervention_referent`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `intervention_signatures`
--
ALTER TABLE `intervention_signatures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `signed_by` (`signed_by`),
  ADD KEY `idx_intervention_id` (`intervention_id`),
  ADD KEY `idx_signature_type` (`signature_type`);

--
-- Index pour la table `intervention_technicien`
--
ALTER TABLE `intervention_technicien`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `intervention_type`
--
ALTER TABLE `intervention_type`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `intervention_workflow`
--
ALTER TABLE `intervention_workflow`
  ADD PRIMARY KEY (`id`),
  ADD KEY `completed_by` (`completed_by`),
  ADD KEY `idx_intervention_id` (`intervention_id`);

--
-- Index pour la table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_conversation` (`sender_id`,`receiver_id`);

--
-- Index pour la table `mots_cles`
--
ALTER TABLE `mots_cles`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `mot_cle_liens`
--
ALTER TABLE `mot_cle_liens`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `num_tel`
--
ALTER TABLE `num_tel`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `organisation`
--
ALTER TABLE `organisation`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `particulier`
--
ALTER TABLE `particulier`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `referent`
--
ALTER TABLE `referent`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Index pour la table `secteur`
--
ALTER TABLE `secteur`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `technicien`
--
ALTER TABLE `technicien`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `technicien_equipe`
--
ALTER TABLE `technicien_equipe`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `idx_email_unique` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `adresse`
--
ALTER TABLE `adresse`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `adresse_email`
--
ALTER TABLE `adresse_email`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `affaire`
--
ALTER TABLE `affaire`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `affaire_referent`
--
ALTER TABLE `affaire_referent`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `agence`
--
ALTER TABLE `agence`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT pour la table `client`
--
ALTER TABLE `client`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT pour la table `contact`
--
ALTER TABLE `contact`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `equipe_technicien`
--
ALTER TABLE `equipe_technicien`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `fichier`
--
ALTER TABLE `fichier`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `habitation`
--
ALTER TABLE `habitation`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `intervention`
--
ALTER TABLE `intervention`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `intervention_photos`
--
ALTER TABLE `intervention_photos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `intervention_planning`
--
ALTER TABLE `intervention_planning`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `intervention_referent`
--
ALTER TABLE `intervention_referent`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `intervention_signatures`
--
ALTER TABLE `intervention_signatures`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `intervention_technicien`
--
ALTER TABLE `intervention_technicien`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `intervention_type`
--
ALTER TABLE `intervention_type`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT pour la table `intervention_workflow`
--
ALTER TABLE `intervention_workflow`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT pour la table `mots_cles`
--
ALTER TABLE `mots_cles`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `mot_cle_liens`
--
ALTER TABLE `mot_cle_liens`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `num_tel`
--
ALTER TABLE `num_tel`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `organisation`
--
ALTER TABLE `organisation`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `particulier`
--
ALTER TABLE `particulier`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `referent`
--
ALTER TABLE `referent`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `secteur`
--
ALTER TABLE `secteur`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT pour la table `technicien`
--
ALTER TABLE `technicien`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT pour la table `technicien_equipe`
--
ALTER TABLE `technicien_equipe`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `intervention_interruptions`
--
ALTER TABLE `intervention_interruptions`
  ADD CONSTRAINT `intervention_interruptions_ibfk_1` FOREIGN KEY (`intervention_id`) REFERENCES `intervention` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `intervention_interruptions_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `intervention_photos`
--
ALTER TABLE `intervention_photos`
  ADD CONSTRAINT `intervention_photos_ibfk_1` FOREIGN KEY (`intervention_id`) REFERENCES `intervention` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `intervention_photos_ibfk_2` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `intervention_signatures`
--
ALTER TABLE `intervention_signatures`
  ADD CONSTRAINT `intervention_signatures_ibfk_1` FOREIGN KEY (`intervention_id`) REFERENCES `intervention` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `intervention_signatures_ibfk_2` FOREIGN KEY (`signed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Contraintes pour la table `intervention_workflow`
--
ALTER TABLE `intervention_workflow`
  ADD CONSTRAINT `intervention_workflow_ibfk_1` FOREIGN KEY (`intervention_id`) REFERENCES `intervention` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `intervention_workflow_ibfk_2` FOREIGN KEY (`completed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
