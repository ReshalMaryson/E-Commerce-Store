-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 16, 2025 at 01:38 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `shopping_store`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `prod_id` int(11) NOT NULL,
  `prod_name` varchar(255) NOT NULL,
  `prod_price` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `user_id`, `prod_id`, `prod_name`, `prod_price`, `quantity`, `added_at`) VALUES
(16, 3, 1, 'Khaki Shirt', 4500, 1, '2025-07-15 18:17:41'),
(19, 3, 4, 'Hamilton Watch.', 270000, 1, '2025-07-15 18:17:45'),
(20, 3, 5, 'Denim Jacket', 7000, 1, '2025-07-15 18:17:48'),
(21, 3, 6, 'Fannel Shirt', 3500, 1, '2025-07-15 18:17:52');

-- --------------------------------------------------------

--
-- Table structure for table `order_products`
--

CREATE TABLE `order_products` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_products`
--

INSERT INTO `order_products` (`id`, `order_id`, `product_id`, `product_name`, `price`, `quantity`) VALUES
(1, 1, 1, 'Khaki Shirt', 4500, 1),
(2, 1, 2, 'Cotton Dress Pant ', 5000, 1),
(3, 2, 1, 'Khaki Shirt', 4500, 1),
(4, 2, 2, 'Cotton Dress Pant ', 5000, 1),
(5, 2, 3, 'Rolex Submariner watch', 200000, 1),
(6, 2, 4, 'Hamilton Watch.', 270000, 1),
(7, 2, 5, 'Denim Jacket', 7000, 1),
(8, 2, 6, 'Fannel Shirt', 3500, 1);

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` int(11) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `category` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `price`, `stock`, `category`, `image`, `created_at`) VALUES
(1, 'Khaki Shirt', 'Khaki Shirt Pure Cotton.', 4500, 18, 'Shirt', '6872a513b5df2.jpg', '2025-07-12 18:10:27'),
(2, 'Cotton Dress Pant ', 'Pure Cotton Formal dress Pant ', 5000, 8, 'Pant', '6872a5604a49a.png', '2025-07-12 18:11:44'),
(3, 'Rolex Submariner watch', 'Rolex Submaeriner Black ref:2363751', 200000, 33, 'Watch', '6872a5a24b88b.png', '2025-07-12 18:12:50'),
(4, 'Hamilton Watch.', 'Pure Gold Hamilton Watch with Leather Strap.', 270000, 4, 'Watch', '6872a5e0f3820.png', '2025-07-12 18:13:52'),
(5, 'Denim Jacket', '100% Pure Blue Denim Jacket ', 7000, 58, 'Jacket', '6872a62322b35.png', '2025-07-12 18:14:59'),
(6, 'Fannel Shirt', 'Casual Cotton Fannel Shirt ', 3500, 39, 'Shirt', '6872a66da865f.jpg', '2025-07-12 18:16:13'),
(7, 'Denim Pants', '100% Pure blue denim Pants', 5300, 25, 'Pant', '6872a69c4271f.png', '2025-07-12 18:17:00');

-- --------------------------------------------------------

--
-- Table structure for table `sales`
--

CREATE TABLE `sales` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `fname` varchar(100) NOT NULL,
  `lname` varchar(100) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `country` varchar(100) NOT NULL,
  `address` text NOT NULL,
  `city` varchar(100) NOT NULL,
  `postal_code` varchar(20) NOT NULL,
  `payment_method` varchar(20) NOT NULL,
  `card_type` varchar(20) DEFAULT NULL,
  `shipping_fee` int(11) NOT NULL DEFAULT 0,
  `subtotal` int(11) NOT NULL,
  `total` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales`
--

INSERT INTO `sales` (`id`, `user_id`, `fname`, `lname`, `email`, `phone`, `country`, `address`, `city`, `postal_code`, `payment_method`, `card_type`, `shipping_fee`, `subtotal`, `total`, `created_at`) VALUES
(1, 1, 'Reshal Maryson', 'Maryson', 'reshal@fake.com', '3452306545', 'pakistan', 'Mission Compound No 2, Hussaini Road Nawabshah', 'Nawabshah', '67450', 'COD', '', 0, 9500, 9500, '2025-07-12 19:14:49'),
(2, 2, 'new', 'user', 'reshalmaryson000@gmail.com', '3452306545', 'pakistan', 'Mission Compound No 2, Hussaini Road Nawabshah', 'Nawabshah', '67450', 'COD', '', 0, 490000, 490000, '2025-07-12 19:29:25');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone_number` varchar(30) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `country` varchar(100) DEFAULT NULL,
  `profile_pic` varchar(255) DEFAULT '67cc4040eb7eb.png',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone_number`, `address`, `country`, `profile_pic`, `created_at`) VALUES
(1, 'Reshal Maryson', 'reshal@fake.com', '$2y$10$9TOChFCQa6rnkksluT.Aeu0KKVbaiabietWoTRMZ/3U746j114P5W', '990-23412421', '7th St, Main Road, District', 'Pakistan', '68769d193b5e8.jpg', '2025-07-15 18:25:29'),
(2, 'newuser', 'newuser@fake.com', '$2y$10$1JcFxf8NP6Fc1FbsynrgYe6tsmDgf2qfU3gF5B.omGrYpXfA0ZOd.', '0323-342222', 'new user address', 'Pakistan', '68729d2e1e8ae.png', '2025-07-12 17:36:46'),
(3, 'admin', 'admin@fake.com', '$2y$10$IsjcO3GM8UBxSmi.luIBSO4xtJrm72gtgfdj5p1klDstOcyVMUS7a', '092-34121382', '7th St, Main Road, Dictrict.', 'Pakistan', '68769e5fd9503.jpg', '2025-07-15 18:30:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `order_products`
--
ALTER TABLE `order_products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_order_products_order` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales`
--
ALTER TABLE `sales`
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
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `order_products`
--
ALTER TABLE `order_products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `sales`
--
ALTER TABLE `sales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `order_products`
--
ALTER TABLE `order_products`
  ADD CONSTRAINT `fk_order_products_order` FOREIGN KEY (`order_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_products_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
