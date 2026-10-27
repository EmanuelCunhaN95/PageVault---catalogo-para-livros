-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 27/10/2026 às 23:20
-- Versão do servidor: 10.11.16-MariaDB
-- Versão do PHP: 8.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `vault`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `livros`
--

CREATE TABLE `livros` (
  `id` int(11) NOT NULL,
  `nome` varchar(100) NOT NULL,
  `autor` varchar(100) DEFAULT NULL,
  `idioma` varchar(100) NOT NULL,
  `gênero` varchar(50) DEFAULT NULL,
  `status` enum('Quero Ler','Lendo','Lido','Abandonado') NOT NULL DEFAULT 'Quero Ler',
  `nota` decimal(3,1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `livros`
--

INSERT INTO `livros` (`id`, `nome`, `autor`, `idioma`, `gênero`, `status`, `nota`) VALUES
(1, 'Dracula', 'Bram Stoker', 'Português', 'Romance Gótico', 'Lido', 10.0),
(2, 'Neuromancer', 'William Gibson', 'Português', 'Cyberpunk', 'Lido', 9.0),
(3, 'Count Zero', 'William Gibson', 'Português', 'Cyberpunk', 'Lido', 7.0),
(4, 'Monalisa:Overdrive', 'William Gibson', 'Português', 'Cyberpunk', 'Quero Ler', NULL);

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `livros`
--
ALTER TABLE `livros`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `livros`
--
ALTER TABLE `livros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
