-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 17, 2022 at 03:16 PM
-- Server version: 8.0.27
-- PHP Version: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `alchomist`
--

-- --------------------------------------------------------

--
-- Table structure for table `cocktails`
--

CREATE TABLE `cocktails` (
  `cocktailID` int NOT NULL,
  `creatorID` int DEFAULT NULL,
  `cocktailName` tinytext COLLATE utf8mb4_general_ci NOT NULL,
  `ingredients` json NOT NULL,
  `image` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cocktails`
--

INSERT INTO `cocktails` (`cocktailID`, `creatorID`, `cocktailName`, `ingredients`, `image`) VALUES
(1, NULL, 'IBA Cocktail 1', '[{\"Whisky\": \"25ml\", \"category\": \"Chocolate\", \"description\": \"Imported Milk Chocolate\", \"product_name\": \"Hershey\'s Milk Chocolate\"}, {\"category\": \"Cooking Oil\", \"productid\": \"p1235\", \"description\": \"Refined Vegetable Oil\", \"product_name\": \"Saffola Gold\"}]', NULL),
(2, 1, 'Community Cocktail 1', '[{\"Whisky\": \"25ml\", \"category\": \"Chocolate\", \"description\": \"Imported Milk Chocolate\", \"product_name\": \"Hershey\'s Milk Chocolate\"}, {\"category\": \"Cooking Oil\", \"productid\": \"p1235\", \"description\": \"Refined Vegetable Oil\", \"product_name\": \"Saffola Gold\"}]', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `userID` int NOT NULL,
  `userName` tinytext COLLATE utf8mb4_general_ci NOT NULL,
  `email` tinytext COLLATE utf8mb4_general_ci NOT NULL,
  `password` longtext COLLATE utf8mb4_general_ci NOT NULL,
  `preferences` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`userID`, `userName`, `email`, `password`, `preferences`) VALUES
(1, 'Big Timbo', 'timothy_amis@msn.com', '$2y$10$jjPrT6bKRUpIBX3rDgdMLerFqoFGfkybHxnWWu0rt2nT1qNk.hw92', 'null');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cocktails`
--
ALTER TABLE `cocktails`
  ADD PRIMARY KEY (`cocktailID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`userID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cocktails`
--
ALTER TABLE `cocktails`
  MODIFY `cocktailID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `userID` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
