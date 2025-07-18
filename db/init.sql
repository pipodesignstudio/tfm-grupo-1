-- DROP TABLES en orden para evitar conflictos por claves foráneas
DROP TABLE IF EXISTS `recordatorios`;
DROP TABLE IF EXISTS `actividades`;
DROP TABLE IF EXISTS `objetivos`;
DROP TABLE IF EXISTS `rutinas`;
DROP TABLE IF EXISTS `notas`;
DROP TABLE IF EXISTS `alergias`;
DROP TABLE IF EXISTS `invitacion_usuario_familia`;
DROP TABLE IF EXISTS `familia_usuarios`;
DROP TABLE IF EXISTS `ninos`;
DROP TABLE IF EXISTS `usuarios`;
DROP TABLE IF EXISTS `familia`;
DROP TABLE IF EXISTS `perfiles_aprendizaje`;
DROP TABLE IF EXISTS `vacunas`;
DROP TABLE IF EXISTS `enfermedades`;
DROP TABLE IF EXISTS `objetivos_has_actividades`;
DROP TABLE IF EXISTS `alergias`;
DROP TABLE IF EXISTS `notas`;

-- Crear esquema si no existe
CREATE SCHEMA IF NOT EXISTS `nidodb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `nidodb`;

CREATE TABLE `usuarios` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(100),
  `apellido` VARCHAR(100),
  `nick` VARCHAR(45) NOT NULL UNIQUE,
  `img_perfil` MEDIUMBLOB DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `contrasena` VARCHAR(255) NOT NULL,
  `primera_sesion` BOOLEAN NOT NULL DEFAULT TRUE,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `borrado` BOOLEAN NOT NULL DEFAULT FALSE,
  `email_verificado` BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE `familia` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `descripcion` TEXT DEFAULT NULL
);


CREATE TABLE `perfiles_aprendizaje` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` VARCHAR(100) DEFAULT NULL
);  

CREATE TABLE `ninos` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `perfiles_aprendizaje_id` INT NOT NULL,
  `familia_id` INT NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `img_perfil` MEDIUMBLOB DEFAULT NULL,
  `fecha_nacimiento` DATE NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `genero` VARCHAR(45) DEFAULT NULL,
  `peso` INT DEFAULT NULL,
  `altura` INT DEFAULT NULL,
  CONSTRAINT `fk_ninos_perfiles_aprendizaje1` FOREIGN KEY (`perfiles_aprendizaje_id`) REFERENCES `perfiles_aprendizaje`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_ninos_familia1` FOREIGN KEY (`familia_id`) REFERENCES `familia`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `objetivos` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `ninos_id` INT NOT NULL,
  `color` VARCHAR(45) DEFAULT NULL,
  `tipo` VARCHAR(45) DEFAULT NULL,
  `fecha_fin` DATE NULL,
  CONSTRAINT `fk_objetivos_ninos1` FOREIGN KEY (`ninos_id`) REFERENCES `ninos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `rutinas` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `ninos_id` INT NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `frecuencia` JSON DEFAULT NULL,
  `fecha_fin` TIMESTAMP DEFAULT NULL,
  CONSTRAINT `fk_rutinas_ninos1` FOREIGN KEY (`ninos_id`) REFERENCES `ninos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE `actividades` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `rutina_id` INT DEFAULT NULL,
  `ninos_id` INT NOT NULL,
  `titulo` VARCHAR(100) DEFAULT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fecha_realizacion` TIMESTAMP NOT NULL,
  `hora_inicio` TIME NOT NULL,
  `hora_fin` TIME NOT NULL,
  `color` VARCHAR(45) DEFAULT NULL,
  `tipo` ENUM('Objetivo', 'Rutina', 'Evento') NOT NULL,
  `ubicacion` JSON DEFAULT NULL,
  `usuario_responsable` INT NOT NULL,
  `completado` BOOLEAN DEFAULT FALSE,
  CONSTRAINT `fk_actividad_rutina` FOREIGN KEY (`rutina_id`) REFERENCES `rutinas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_actividades_ninos1` FOREIGN KEY (`ninos_id`) REFERENCES `ninos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `recordatorios` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `actividad_id` INT NOT NULL,
  `usuario_id` INT NOT NULL,
  `periodicidad` ENUM('daily', 'weekly', 'monthly') NOT NULL DEFAULT 'daily',
  `activo` BOOLEAN NOT NULL DEFAULT TRUE,
  `ultimo_envio` TIMESTAMP DEFAULT NULL,
  CONSTRAINT `fk_recordatorio_actividad` FOREIGN KEY (`actividad_id`) REFERENCES `actividades`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_recordatorio_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `alergias` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `ninos_id` INT NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  CONSTRAINT `fk_alergias_ninos1` FOREIGN KEY (`ninos_id`) REFERENCES `ninos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `vacunas` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `ninos_id` INT NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `fecha` TIMESTAMP NOT NULL,
  CONSTRAINT `fk_vacunas_ninos1` FOREIGN KEY (`ninos_id`) REFERENCES `ninos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `enfermedades` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `ninos_id` INT NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `doctor` VARCHAR(100) NOT NULL,
  CONSTRAINT `fk_enfermedades_ninos1` FOREIGN KEY (`ninos_id`) REFERENCES `ninos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);


CREATE TABLE `notas` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `ninos_id` INT NOT NULL,
  `titulo` VARCHAR(45) DEFAULT NULL,
  `texto` TEXT DEFAULT NULL,
  `fecha_creacion` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_notas_ninos1` FOREIGN KEY (`ninos_id`) REFERENCES `ninos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `familia_usuarios` (
  `familia_id` INT NOT NULL,
  `usuarios_id` INT NOT NULL,
  `rol` ENUM('admin', 'cuidador', 'nino') NOT NULL,
  PRIMARY KEY (`familia_id`, `usuarios_id`),
  CONSTRAINT `fk_familia_usuarios_familia1` FOREIGN KEY (`familia_id`) REFERENCES `familia`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_familia_usuarios_usuarios1` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `invitacion_usuario_familia` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `familia_id` INT NOT NULL,
  `usuario_emisor` INT NOT NULL,
  `email_destinatario` VARCHAR(255) NOT NULL,
  `rol` ENUM('admin', 'cuidador', 'nino') NOT NULL,
  `atentido` BOOLEAN DEFAULT FALSE NOT NULL,
  `aceptado` BOOLEAN DEFAULT FALSE NOT NULL,
  `fecha_envio` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  CONSTRAINT `fk_invitacion_usuario_familia_familia1` FOREIGN KEY (`familia_id`) REFERENCES `familia`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE `objetivos_has_actividades` (
  `objetivo_id` INT NOT NULL,
  `actividad_id` INT NOT NULL,
  PRIMARY KEY (`objetivo_id`, `actividad_id`),
  CONSTRAINT `fk_actividad_objetivo_objetivo_id` FOREIGN KEY (`objetivo_id`) REFERENCES `objetivos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_actividad_objetivo_actividad_id` FOREIGN KEY (`actividad_id`) REFERENCES `actividades`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Índices

CREATE UNIQUE INDEX `usuarios_index_0` ON `usuarios` (`email`);
CREATE INDEX `fk_ninos_perfiles_aprendizaje1_idx` ON `ninos` (`perfiles_aprendizaje_id`);
CREATE INDEX `fk_actividades_ninos1_idx` ON `actividades` (`ninos_id`);
CREATE INDEX `fk_recordatorio_actividad` ON `recordatorios` (`actividad_id`);
CREATE INDEX `fk_recordatorio_usuario` ON `recordatorios` (`usuario_id`);
CREATE INDEX `fk_alergias_ninos1_idx` ON `alergias` (`ninos_id`);
CREATE INDEX `fk_notas_ninos1_idx` ON `notas` (`ninos_id`);
CREATE INDEX `fk_familia_usuarios_usuarios_idx` ON `familia_usuarios` (`usuarios_id`);
CREATE INDEX `fk_familia_usuarios_familia_idx` ON `familia_usuarios` (`familia_id`);
CREATE INDEX `fk_invitacion_usuario_familia_familia1_idx` ON `invitacion_usuario_familia` (`familia_id`);
CREATE INDEX `idx_actividad_objetivo_objetivo_id` ON `objetivos_has_actividades` (`objetivo_id`);
CREATE INDEX `idx_actividad_objetivo_actividad_id` ON `objetivos_has_actividades` (`actividad_id`);