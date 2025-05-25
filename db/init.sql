
-- Crear el esquema
CREATE SCHEMA IF NOT EXISTS `crianza_colaborativa` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `crianza_colaborativa`;


CREATE TABLE `crianza_colaborativa`.`usuarios` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `nick` VARCHAR(45) NOT NULL,
  `img_perfil` LONGBLOB,
  `email` VARCHAR(255) NOT NULL,
  `contrasena` VARCHAR(255) NOT NULL,
  `primera_sesion` BOOLEAN DEFAULT 1,
  `fecha_creacion` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `borrado` BOOLEAN DEFAULT 0
);

CREATE TABLE `crianza_colaborativa`.`perfiles_aprendizaje` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `usuarios_id` INT NOT NULL,
  `descripcion` TEXT DEFAULT null
);

CREATE TABLE `crianza_colaborativa`.`ninos` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `perfiles_aprendizaje_id` INT NOT NULL,
  `nombre` VARCHAR(100) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `img_perfil` LONGBLOB,
  `fecha_nacimiento` DATE NOT NULL,
  `descripcion` TEXT
);

CREATE TABLE `crianza_colaborativa`.`intereses` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL
);

CREATE TABLE `crianza_colaborativa`.`perfiles_intereses` (
  `intereses_id` INT NOT NULL,
  `perfiles_aprendizaje_id` INT NOT NULL,
  PRIMARY KEY (`intereses_id`, `perfiles_aprendizaje_id`)
);

CREATE TABLE `crianza_colaborativa`.`objetivos` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `perfil_id` INT DEFAULT null,
  `horas_semana` INT DEFAULT null
);

CREATE TABLE `crianza_colaborativa`.`disponibilidad` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `perfil_id` INT DEFAULT null,
  `dia_semana` TINYINT DEFAULT null,
  `hora_inicio` TIME DEFAULT null,
  `hora_fin` TIME DEFAULT null
);

CREATE TABLE `crianza_colaborativa`.`categorias_actividades` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL
);

CREATE TABLE `crianza_colaborativa`.`rutinas` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100),
  `descripcion` TEXT DEFAULT null,
  `fecha_creacion` DATETIME DEFAULT (CURRENT_TIMESTAMP),
  `ninos_id` INT NOT NULL
);

CREATE TABLE `crianza_colaborativa`.`actividades` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `rutina_id` INT DEFAULT null,
  `categoria_id` INT DEFAULT null,
  `titulo` VARCHAR(100) DEFAULT null,
  `descripcion` TEXT DEFAULT null,
  `dia_semana` TINYINT DEFAULT null,
  `hora_inicio` TIME DEFAULT null,
  `hora_fin` TIME DEFAULT null
);

CREATE TABLE `crianza_colaborativa`.`recordatorios` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `actividad_id` INT DEFAULT null,
  `fecha_envio` DATE DEFAULT null,
  `enviado` BOOLEAN DEFAULT 0,
  `perfiles_aprendizaje_id` INT NOT NULL
);

CREATE TABLE `crianza_colaborativa`.`ubicaciones` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `actividad_id` INT DEFAULT null,
  `nombre_ubicacion` VARCHAR(45) DEFAULT null,
  `direccion` TEXT DEFAULT null
);

CREATE TABLE `crianza_colaborativa`.`sesiones` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `usuario_id` INT NOT NULL,
  `fecha_inicio` DATETIME DEFAULT (CURRENT_TIMESTAMP)
);

CREATE TABLE `crianza_colaborativa`.`tipos` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(100) NOT NULL
);

CREATE TABLE `crianza_colaborativa`.`objetivos_tipos` (
  `objetivos_id` INT NOT NULL,
  `categorias_objetivos_id` INT NOT NULL,
  PRIMARY KEY (`objetivos_id`, `categorias_objetivos_id`)
);

CREATE TABLE `crianza_colaborativa`.`alergias` (
  `id` INT PRIMARY KEY NOT NULL,
  `ninos_id` INT NOT NULL,
  `nombre` VARCHAR(100) NOT NULL
);

CREATE TABLE `crianza_colaborativa`.`rutinas_perfiles_aprendizaje` (
  `rutinas_id` INT NOT NULL,
  `perfiles_aprendizaje_id` INT NOT NULL,
  PRIMARY KEY (`rutinas_id`, `perfiles_aprendizaje_id`)
);

CREATE TABLE `crianza_colaborativa`.`notas` (
  `id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
  `ninos_id` INT NOT NULL,
  `titulo` VARCHAR(45),
  `texto` TEXT,
  `fecha_creacion` DATETIME NOT NULL DEFAULT (CURRENT_TIMESTAMP)
);

CREATE UNIQUE INDEX ``crianza_colaborativa`.usuarios_index_0` ON `crianza_colaborativa`.`usuarios` (`email`);

CREATE INDEX `fk_perfiles_aprendizaje_usuarios1_idx` ON `crianza_colaborativa`.`perfiles_aprendizaje` (`usuarios_id`);

CREATE INDEX `fk_ninos_perfiles_aprendizaje1_idx` ON `crianza_colaborativa`.`ninos` (`perfiles_aprendizaje_id`);

CREATE UNIQUE INDEX `tema_UNIQUE` ON `crianza_colaborativa`.`intereses` (`nombre`);

CREATE INDEX `fk_perfiles_intereses_perfiles_aprendizaje` ON `crianza_colaborativa`.`perfiles_intereses` (`perfiles_aprendizaje_id`);

CREATE INDEX `fk_objetivo_perfil` ON `crianza_colaborativa`.`objetivos` (`perfil_id`);

CREATE INDEX `fk_disponibilidad_perfil` ON `crianza_colaborativa`.`disponibilidad` (`perfil_id`);

CREATE UNIQUE INDEX `nombre_UNIQUE` ON `crianza_colaborativa`.`categorias_actividades` (`nombre`);

CREATE UNIQUE INDEX `id_UNIQUE` ON `crianza_colaborativa`.`rutinas` (`id`);

CREATE INDEX `fk_rutinas_ninos1_idx` ON `crianza_colaborativa`.`rutinas` (`ninos_id`);

CREATE INDEX `fk_actividad_rutina` ON `crianza_colaborativa`.`actividades` (`rutina_id`);

CREATE INDEX `fk_actividad_categoria` ON `crianza_colaborativa`.`actividades` (`categoria_id`);

CREATE INDEX `fk_recordatorio_actividad` ON `crianza_colaborativa`.`recordatorios` (`actividad_id`);

CREATE INDEX `fk_recordatorios_perfiles_aprendizaje1_idx` ON `crianza_colaborativa`.`recordatorios` (`perfiles_aprendizaje_id`);

CREATE INDEX `fk_ubicacion_actividad` ON `crianza_colaborativa`.`ubicaciones` (`actividad_id`);

CREATE INDEX `fk_sesion_usuario` ON `crianza_colaborativa`.`sesiones` (`usuario_id`);

CREATE UNIQUE INDEX `nombre_UNIQUE` ON `crianza_colaborativa`.`tipos` (`nombre`);

CREATE INDEX `fk_objetivos_has_categorias_objetivos_categorias_objetivos1_idx` ON `crianza_colaborativa`.`objetivos_tipos` (`categorias_objetivos_id`);

CREATE INDEX `fk_objetivos_has_categorias_objetivos_objetivos1_idx` ON `crianza_colaborativa`.`objetivos_tipos` (`objetivos_id`);

CREATE INDEX `fk_alergias_ninos1_idx` ON `crianza_colaborativa`.`alergias` (`ninos_id`);

CREATE INDEX `fk_rutinas_has_perfiles_aprendizaje_perfiles_aprendizaje1_idx` ON `crianza_colaborativa`.`rutinas_perfiles_aprendizaje` (`perfiles_aprendizaje_id`);

CREATE INDEX `fk_rutinas_has_perfiles_aprendizaje_rutinas1_idx` ON `crianza_colaborativa`.`rutinas_perfiles_aprendizaje` (`rutinas_id`);

CREATE INDEX `fk_notas_ninos1_idx` ON `crianza_colaborativa`.`notas` (`ninos_id`);

ALTER TABLE `crianza_colaborativa`.`perfiles_aprendizaje` ADD CONSTRAINT `fk_perfiles_aprendizaje_usuarios1` FOREIGN KEY (`usuarios_id`) REFERENCES `crianza_colaborativa`.`usuarios` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `crianza_colaborativa`.`ninos` ADD CONSTRAINT `fk_ninos_perfiles_aprendizaje1` FOREIGN KEY (`perfiles_aprendizaje_id`) REFERENCES `crianza_colaborativa`.`perfiles_aprendizaje` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `crianza_colaborativa`.`perfiles_intereses` ADD CONSTRAINT `fk_perfiles_intereses_intereses` FOREIGN KEY (`intereses_id`) REFERENCES `crianza_colaborativa`.`intereses` (`id`) ON DELETE CASCADE;

ALTER TABLE `crianza_colaborativa`.`perfiles_intereses` ADD CONSTRAINT `fk_perfiles_intereses_perfiles_aprendizaje` FOREIGN KEY (`perfiles_aprendizaje_id`) REFERENCES `crianza_colaborativa`.`perfiles_aprendizaje` (`id`) ON DELETE CASCADE;

ALTER TABLE `crianza_colaborativa`.`objetivos` ADD CONSTRAINT `fk_objetivo_perfil` FOREIGN KEY (`perfil_id`) REFERENCES `crianza_colaborativa`.`perfiles_aprendizaje` (`id`) ON DELETE CASCADE;

ALTER TABLE `crianza_colaborativa`.`disponibilidad` ADD CONSTRAINT `fk_disponibilidad_perfil` FOREIGN KEY (`perfil_id`) REFERENCES `crianza_colaborativa`.`perfiles_aprendizaje` (`id`) ON DELETE CASCADE;

ALTER TABLE `crianza_colaborativa`.`rutinas` ADD CONSTRAINT `fk_rutinas_ninos1` FOREIGN KEY (`ninos_id`) REFERENCES `crianza_colaborativa`.`ninos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `crianza_colaborativa`.`actividades` ADD CONSTRAINT `fk_actividad_rutina` FOREIGN KEY (`rutina_id`) REFERENCES `crianza_colaborativa`.`rutinas` (`id`) ON DELETE CASCADE;

ALTER TABLE `crianza_colaborativa`.`actividades` ADD CONSTRAINT `fk_actividad_categoria` FOREIGN KEY (`categoria_id`) REFERENCES `crianza_colaborativa`.`categorias_actividades` (`id`);

ALTER TABLE `crianza_colaborativa`.`recordatorios` ADD CONSTRAINT `fk_recordatorio_actividad` FOREIGN KEY (`actividad_id`) REFERENCES `crianza_colaborativa`.`actividades` (`id`) ON DELETE CASCADE;

ALTER TABLE `crianza_colaborativa`.`recordatorios` ADD CONSTRAINT `fk_recordatorios_perfiles_aprendizaje1` FOREIGN KEY (`perfiles_aprendizaje_id`) REFERENCES `crianza_colaborativa`.`perfiles_aprendizaje` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `crianza_colaborativa`.`ubicaciones` ADD CONSTRAINT `fk_ubicacion_actividad` FOREIGN KEY (`actividad_id`) REFERENCES `crianza_colaborativa`.`actividades` (`id`) ON DELETE CASCADE;

ALTER TABLE `crianza_colaborativa`.`sesiones` ADD CONSTRAINT `fk_sesion_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `crianza_colaborativa`.`usuarios` (`id`) ON DELETE CASCADE;

ALTER TABLE `crianza_colaborativa`.`objetivos_tipos` ADD CONSTRAINT `fk_objetivos_has_categorias_objetivos_objetivos1` FOREIGN KEY (`objetivos_id`) REFERENCES `crianza_colaborativa`.`objetivos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `crianza_colaborativa`.`objetivos_tipos` ADD CONSTRAINT `fk_objetivos_has_categorias_objetivos_categorias_objetivos1` FOREIGN KEY (`categorias_objetivos_id`) REFERENCES `crianza_colaborativa`.`tipos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `crianza_colaborativa`.`alergias` ADD CONSTRAINT `fk_alergias_ninos1` FOREIGN KEY (`ninos_id`) REFERENCES `crianza_colaborativa`.`ninos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `crianza_colaborativa`.`rutinas_perfiles_aprendizaje` ADD CONSTRAINT `fk_rutinas_has_perfiles_aprendizaje_rutinas1` FOREIGN KEY (`rutinas_id`) REFERENCES `crianza_colaborativa`.`rutinas` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `crianza_colaborativa`.`rutinas_perfiles_aprendizaje` ADD CONSTRAINT `fk_rutinas_has_perfiles_aprendizaje_perfiles_aprendizaje1` FOREIGN KEY (`perfiles_aprendizaje_id`) REFERENCES `crianza_colaborativa`.`perfiles_aprendizaje` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `crianza_colaborativa`.`notas` ADD CONSTRAINT `fk_notas_ninos1` FOREIGN KEY (`ninos_id`) REFERENCES `crianza_colaborativa`.`ninos` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

ALTER TABLE `crianza_colaborativa`.`actividades` ADD FOREIGN KEY (`descripcion`) REFERENCES `crianza_colaborativa`.`actividades` (`categoria_id`);
