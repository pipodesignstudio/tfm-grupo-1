-- Crear esquema si no existe
CREATE SCHEMA IF NOT EXISTS `nidodb` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `nidodb`;

-- Eliminar tablas en orden
DROP TABLE IF EXISTS 
  `recordatorios`,
  `actividades`,
  `objetivos`,
  `rutinas`,
  `notas`,
  `alergias`,
  `sesiones`,
  `ninos`,
  `familia_usuarios`,
  `familia`,
  `usuarios`;

-- Crear tablas
CREATE TABLE `usuarios` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100),
  `apellido` VARCHAR(100),
  `nick` VARCHAR(45) NOT NULL,
  `img_perfil` LONGBLOB,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `contrasena` VARCHAR(255) NOT NULL,
  `primera_sesion` BOOLEAN DEFAULT 1,
  `fecha_creacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `borrado` BOOLEAN DEFAULT 0,
  `email_verificado` BOOLEAN DEFAULT 0
);

CREATE TABLE `familia` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `descripcion` TEXT DEFAULT NULL
);

CREATE TABLE `ninos` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `perfiles_aprendizaje_id` INT NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `img_perfil` LONGBLOB,
  `fecha_nacimiento` DATE NOT NULL,
  `descripcion` TEXT,
  `genero` VARCHAR(45),
  `peso` INT,
  `altura` INT
);

CREATE TABLE `rutinas` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100),
  `descripcion` TEXT DEFAULT NULL,
  `fecha_creacion` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `ninos_id` INT NOT NULL,
  `frecuencia` JSON,
  `fecha_fin` DATE
);

CREATE TABLE `objetivos` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `rutinas_id` INT NOT NULL,
  `nombre` VARCHAR(45),
  `color` VARCHAR(45),
  `tipo` VARCHAR(45)
);

CREATE TABLE `actividades` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `rutina_id` INT NOT NULL,
  `titulo` VARCHAR(100) DEFAULT NULL,
  `descripcion` TEXT DEFAULT NULL,
  `dia_semana` TINYINT DEFAULT NULL,
  `hora_inicio` TIME DEFAULT NULL,
  `hora_fin` TIME DEFAULT NULL,
  `ninos_id` INT NOT NULL,
  `color` VARCHAR(45),
  `tipo` ENUM ('Tarea', 'Evento', 'Habito'),
  `ubicacion` VARCHAR(45),
  `responsable` INT
);

CREATE TABLE `recordatorios` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `actividad_id` INT NOT NULL,
  `fecha_envio` DATE DEFAULT NULL,
  `enviado` TINYINT(1) DEFAULT 0
);

CREATE TABLE `sesiones` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `fecha_inicio` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `alergias` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `ninos_id` INT NOT NULL,
  `nombre` VARCHAR(100) NOT NULL
);

CREATE TABLE `notas` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `ninos_id` INT NOT NULL,
  `titulo` VARCHAR(45),
  `texto` TEXT,
  `fecha_creacion` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE `familia_usuarios` (
  `perfiles_aprendizaje_id` INT NOT NULL,
  `usuarios_id` INT NOT NULL,
  `rol` ENUM ('admin', 'cuidador', 'nino'),
  PRIMARY KEY (`perfiles_aprendizaje_id`, `usuarios_id`)
);

-- Índices
CREATE INDEX `fk_ninos_perfiles_aprendizaje1_idx` ON `ninos` (`perfiles_aprendizaje_id`);
CREATE INDEX `fk_rutinas_ninos1_idx` ON `rutinas` (`ninos_id`);
CREATE INDEX `fk_objetivos_rutinas1_idx` ON `objetivos` (`rutinas_id`);
CREATE INDEX `fk_actividad_rutina` ON `actividades` (`rutina_id`);
CREATE INDEX `fk_actividades_ninos1_idx` ON `actividades` (`ninos_id`);
CREATE INDEX `fk_recordatorio_actividad` ON `recordatorios` (`actividad_id`);
CREATE INDEX `fk_sesion_usuario` ON `sesiones` (`usuario_id`);
CREATE INDEX `fk_alergias_ninos1_idx` ON `alergias` (`ninos_id`);
CREATE INDEX `fk_notas_ninos1_idx` ON `notas` (`ninos_id`);
CREATE INDEX `fk_perfiles_aprendizaje_has_usuarios_usuarios1_idx` ON `familia_usuarios` (`usuarios_id`);
CREATE INDEX `fk_perfiles_aprendizaje_has_usuarios_perfiles_aprendizaje1_idx` ON `familia_usuarios` (`perfiles_aprendizaje_id`);

-- Claves foráneas
ALTER TABLE `ninos` ADD CONSTRAINT `fk_ninos_perfiles_aprendizaje1` FOREIGN KEY (`perfiles_aprendizaje_id`) REFERENCES `familia` (`id`);
ALTER TABLE `rutinas` ADD CONSTRAINT `fk_rutinas_ninos1` FOREIGN KEY (`ninos_id`) REFERENCES `ninos` (`id`);
ALTER TABLE `objetivos` ADD CONSTRAINT `fk_objetivos_rutinas1` FOREIGN KEY (`rutinas_id`) REFERENCES `rutinas` (`id`);
ALTER TABLE `actividades` ADD CONSTRAINT `fk_actividad_rutina` FOREIGN KEY (`rutina_id`) REFERENCES `rutinas` (`id`) ON DELETE CASCADE;
ALTER TABLE `actividades` ADD CONSTRAINT `fk_actividades_ninos1` FOREIGN KEY (`ninos_id`) REFERENCES `ninos` (`id`);
ALTER TABLE `recordatorios` ADD CONSTRAINT `fk_recordatorio_actividad` FOREIGN KEY (`actividad_id`) REFERENCES `actividades` (`id`) ON DELETE CASCADE;
ALTER TABLE `sesiones` ADD CONSTRAINT `fk_sesion_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
ALTER TABLE `alergias` ADD CONSTRAINT `fk_alergias_ninos1` FOREIGN KEY (`ninos_id`) REFERENCES `ninos` (`id`);
ALTER TABLE `notas` ADD CONSTRAINT `fk_notas_ninos1` FOREIGN KEY (`ninos_id`) REFERENCES `ninos` (`id`);
ALTER TABLE `familia_usuarios` ADD CONSTRAINT `fk_perfiles_aprendizaje_has_usuarios_perfiles_aprendizaje1` FOREIGN KEY (`perfiles_aprendizaje_id`) REFERENCES `familia` (`id`);
ALTER TABLE `familia_usuarios` ADD CONSTRAINT `fk_perfiles_aprendizaje_has_usuarios_usuarios1` FOREIGN KEY (`usuarios_id`) REFERENCES `usuarios` (`id`);
