
-- Crear el esquema
CREATE SCHEMA IF NOT EXISTS `crianza_colaborativa` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `crianza_colaborativa`;


CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100),
  `apellido` VARCHAR(100),
  `email` VARCHAR(100) NOT NULL,
  `contrasena` VARCHAR(255) NOT NULL,
  `primera_sesion` BOOLEAN DEFAULT 1,
  `fecha_creacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idx_email` (`email`)
);