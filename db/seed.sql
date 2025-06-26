-- SEED NIDODB ---------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
USE nidodb;

-- Insertar perfiles de aprendizaje
INSERT INTO perfiles_aprendizaje (nombre, descripcion) VALUES
('Visual', 'Aprende observando'),
('Kinestésico', 'Aprende haciendo');

-- Insertar familias
INSERT INTO familia (descripcion) VALUES
('Familia Gómez'),
('Familia Pérez'),
('Familia Bombo');

-- Insertar usuarios
INSERT INTO usuarios (nombre, apellido, nick, email, contrasena, primera_sesion, email_verificado) VALUES
('Lucía', 'Gómez', 'luciag', 'lucia@example.com', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, TRUE),
('Carlos', 'Pérez', 'carlosp', 'carlos@example.com', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, TRUE);

-- Relacionar usuarios con familias
INSERT INTO familia_usuarios (familia_id, usuarios_id, rol) VALUES
(1, 1, 'admin'),
(2, 2, 'admin');

-- Insertar niños con referencia a familia
INSERT INTO ninos (perfiles_aprendizaje_id, familia_id, nombre, apellido, fecha_nacimiento, genero, peso, altura) VALUES
(1, 1, 'Mateo', 'Gómez', DATE_SUB(CURDATE(), INTERVAL 4 YEAR), 'masculino', 18, 105),
(2, 2, 'Sofía', 'Pérez', DATE_SUB(CURDATE(), INTERVAL 5 YEAR), 'femenino', 16, 100);

-- Insertar rutinas
INSERT INTO rutinas (ninos_id, nombre, descripcion) VALUES
(1, 'Rutina de mañana', 'Despertarse, vestirse, desayunar'),
(2, 'Rutina de noche', 'Cena, cepillado y lectura');

-- Insertar diferente tipos de actividades
-- Actividad tipo "Rutina"
INSERT INTO actividades (
  rutina_id, ninos_id, titulo, descripcion, fecha_realizacion,
  hora_inicio, hora_fin, color, tipo,
   usuario_responsable, completado
) VALUES
(1, 1, 'Hora de Dormir', 'Rutina diaria para acostarse',
  '2025-06-15', '20:00:00', '20:30:00', '#3498db',
  'Rutina', 10, FALSE),
(1, 1, 'Hora de Dormir', 'Rutina diaria para acostarse',
  '2025-06-16', '20:00:00', '20:30:00', '#3498db',
  'Rutina', 10, FALSE);





-- Actividad tipo "Objetivo"
INSERT INTO actividades (
  ninos_id, titulo, descripcion, fecha_realizacion,
  hora_inicio, hora_fin, color, tipo, usuario_responsable, completado
) VALUES
(2, 'Aprender a atarse los zapatos', 'Desarrollar autonomía personal',
  '2025-06-15', '17:00:00', '17:30:00', '#2ecc71',
  'Objetivo', 11, FALSE),
(2, 'Aprender a atarse los zapatos', 'Desarrollar autonomía personal',
  '2025-06-22', '17:00:00', '17:30:00', '#2ecc71',
  'Objetivo', 11, FALSE);



-- Insertar objetivos
INSERT INTO objetivos (nombre, ninos_id, color, tipo, fecha_fin) VALUES
('Aprender colores', 1, '#ff0000', 'educativo', DATE_ADD(CURDATE(), INTERVAL 30 DAY)),
('Vestirse solo', 2, '#00ff00', 'autonomía', DATE_ADD(CURDATE(), INTERVAL 30 DAY));

-- Relacionar actividades con objetivos
INSERT INTO objetivos_has_actividades (objetivo_id, actividad_id) VALUES
(1, 1),
(2, 2);

-- Insertar recordatorios
INSERT INTO recordatorios (actividad_id, usuario_id, periodicidad, activo) VALUES
(1, 1, 'daily', TRUE),
(2, 2, 'weekly', TRUE);

-- Insertar notas
INSERT INTO notas (ninos_id, titulo, texto) VALUES
(1, 'Observación del día', 'Mateo ha mejorado en la identificación de colores');

-- Insertar invitaciones
INSERT INTO invitacion_usuario_familia (familia_id, usuario_emisor, email_destinatario, rol) VALUES
(1, 1, 'tio@example.com', 'cuidador'),
(2, 2, 'abuela@example.com', 'cuidador');

-- Insertar Alergias Niños
INSERT INTO alergias (ninos_id, nombre) VALUES
(1, 'Polen'),
(2, 'Gluten');

-- Usuarios
INSERT INTO usuarios (id, nombre, apellido, nick, img_perfil, email, contrasena, primera_sesion, fecha_creacion, borrado, email_verificado) VALUES
(3, 'Caridad', 'Araujo', 'caridad3', NULL, 'titocastell@gmail.com', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE),
(4, 'Georgina', 'Ferrando', 'georgina4', NULL, 'leon14@yahoo.com', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE),
(5, 'Griselda', 'Real', 'griselda5', NULL, 'jmarques@gmail.com', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE),
(6, 'Rodrigo', 'Urrutia', 'rodrigo6', NULL, 'eusebioadan@gmail.com', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE),
(7, 'Saturnino', 'Muro', 'saturnino7', NULL, 'nbarrios@yahoo.com', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE),
(8, 'María', 'Pinilla', 'maría8', NULL, 'finiesta@yahoo.com', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE),
(9, 'Josefina', 'Mata', 'josefina9', NULL, 'oliveraberta@pellicer-bayon.es', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE),
(10, 'Flavia', 'Tudela', 'flavia10', NULL, 'buendiamacario@gmail.com', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE),
(11, 'Salud', 'Alberola', 'salud11', NULL, 'ctejero@yahoo.com', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE),
(12, 'Jennifer', 'Soriano', 'jennifer12', NULL, 'guardiolaluis@hotmail.com', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE),
(13, 'Florinda', 'Salamanca', 'florinda13', NULL, 'delfinaruano@hotmail.com', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE),
(14, 'Nerea', 'Heras', 'nerea14', NULL, 'carmen08@buendia-gomila.com', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE),
(15, 'Edmundo', 'Vallés', 'edmundo15', NULL, 'sacristancornelio@hotmail.com', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE),
(16, 'Tomás', 'Coello', 'tomás16', NULL, 'kescolano@bermudez.es', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE),
(17, 'Isidoro', 'Falcón', 'isidoro17', NULL, 'eusebiacaballero@hotmail.com', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE),
(18, 'Cándido', 'Guillen', 'cándido18', NULL, 'mosquerayolanda@hotmail.com', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE),
(19, 'Gloria', 'Garay', 'gloria19', NULL, 'mugicajose-francisco@fuertes.net', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE),
(20, 'Candelario', 'Berrocal', 'candelario20', NULL, 'blascases@yahoo.com', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE),
(21, 'Maricela', 'Rocha', 'maricela21', NULL, 'eli45@vera.com', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE),
(22, 'Cesar', 'Badía', 'cesar22', NULL, 'mariselaayala@bilbao.es', '$2b$10$yOX5o4L.wK4Z7YfeCPpjIOEpdKiy1ZmBquWtsY/WJQCVMeia1PjDi', FALSE, NOW(), FALSE, TRUE);

-- Familia_Usuarios
INSERT INTO familia_usuarios (familia_id, usuarios_id, rol) VALUES
(2, 3, 'admin'),
(1, 4, 'admin'),
(1, 5, 'cuidador'),
(1, 6, 'admin'),
(1, 7, 'admin'),
(1, 8, 'admin'),
(1, 9, 'admin'),
(1, 10, 'admin'),
(1, 3, 'cuidador'),
(1, 11, 'cuidador'),
(3, 12, 'admin'),
(3, 13, 'cuidador'),
(2, 14, 'cuidador'),
(3, 15, 'cuidador'),
(3, 16, 'admin'),
(3, 17, 'cuidador'),
(3, 18, 'admin'),
(1, 19, 'cuidador'),
(3, 20, 'admin'),
(2, 21, 'cuidador'),
(1, 22, 'cuidador');

-- Niños
INSERT INTO ninos (id, perfiles_aprendizaje_id, familia_id, nombre, apellido, img_perfil, fecha_nacimiento, descripcion, genero, peso, altura) VALUES
(3, 2, 2, 'Encarnita', 'Araujo', NULL, '2020-01-12', NULL, 'femenino', 18, 112),
(4, 2, 1, 'Miguel Ángel', 'Ferrando', NULL, '2020-08-24', NULL, 'femenino', 15, 113),
(5, 2, 1, 'Celia', 'Real', NULL, '2020-04-08', NULL, 'femenino', 25, 110),
(6, 2, 1, 'Reyes', 'Urrutia', NULL, '2020-04-15', NULL, 'femenino', 21, 108),
(7, 2, 1, 'Guiomar', 'Muro', NULL, '2022-04-30', NULL, 'femenino', 17, 108),
(8, 2, 1, 'Agapito', 'Pinilla', NULL, '2021-08-31', NULL, 'femenino', 22, 101),
(9, 1, 1, 'Adolfo', 'Mata', NULL, '2022-02-03', NULL, 'femenino', 24, 118),
(10, 1, 1, 'Hermenegildo', 'Tudela', NULL, '2021-06-03', NULL, 'femenino', 25, 102),
(11, 2, 1, 'Catalina', 'Alberola', NULL, '2018-09-12', NULL, 'femenino', 18, 103),
(12, 2, 3, 'Epifanio', 'Soriano', NULL, '2021-06-21', NULL, 'femenino', 17, 106),
(13, 1, 3, 'Santos', 'Salamanca', NULL, '2020-07-27', NULL, 'femenino', 19, 98),
(14, 1, 2, 'Joaquina', 'Heras', NULL, '2018-12-24', NULL, 'femenino', 16, 115),
(15, 1, 3, 'Xavier', 'Vallés', NULL, '2020-06-03', NULL, 'femenino', 17, 112),
(16, 1, 3, 'Martín', 'Coello', NULL, '2021-05-21', NULL, 'femenino', 20, 119),
(17, 1, 3, 'Mireia', 'Falcón', NULL, '2018-08-25', NULL, 'femenino', 19, 100),
(18, 2, 3, 'Dan', 'Guillen', NULL, '2021-03-27', NULL, 'femenino', 19, 97),
(19, 2, 1, 'Lázaro', 'Garay', NULL, '2019-05-26', NULL, 'femenino', 20, 118),
(20, 1, 3, 'Matilde', 'Berrocal', NULL, '2021-03-04', NULL, 'femenino', 20, 108),
(21, 1, 2, 'Máxima', 'Rocha', NULL, '2020-07-13', NULL, 'femenino', 18, 108),
(22, 2, 1, 'Jose Carlos', 'Badía', NULL, '2021-01-23', NULL, 'femenino', 22, 109);

-- Rutinas
INSERT INTO rutinas (id, ninos_id, nombre, descripcion, fecha_creacion, frecuencia, fecha_fin) VALUES
(3, 3, 'Rutina diaria 3', 'Rutina generada automáticamente', NOW(), NULL, NULL),
(4, 4, 'Rutina diaria 4', 'Rutina generada automáticamente', NOW(), NULL, NULL),
(5, 5, 'Rutina diaria 5', 'Rutina generada automáticamente', NOW(), NULL, NULL),
(6, 6, 'Rutina diaria 6', 'Rutina generada automáticamente', NOW(), NULL, NULL),
(7, 7, 'Rutina diaria 7', 'Rutina generada automáticamente', NOW(), NULL, NULL),
(8, 8, 'Rutina diaria 8', 'Rutina generada automáticamente', NOW(), NULL, NULL),
(9, 9, 'Rutina diaria 9', 'Rutina generada automáticamente', NOW(), NULL, NULL),
(10, 10, 'Rutina diaria 10', 'Rutina generada automáticamente', NOW(), NULL, NULL),
(11, 11, 'Rutina diaria 11', 'Rutina generada automáticamente', NOW(), NULL, NULL),
(12, 12, 'Rutina diaria 12', 'Rutina generada automáticamente', NOW(), NULL, NULL),
(13, 13, 'Rutina diaria 13', 'Rutina generada automáticamente', NOW(), NULL, NULL),
(14, 14, 'Rutina diaria 14', 'Rutina generada automáticamente', NOW(), NULL, NULL),
(15, 15, 'Rutina diaria 15', 'Rutina generada automáticamente', NOW(), NULL, NULL),
(16, 16, 'Rutina diaria 16', 'Rutina generada automáticamente', NOW(), NULL, NULL),
(17, 17, 'Rutina diaria 17', 'Rutina generada automáticamente', NOW(), NULL, NULL),
(18, 18, 'Rutina diaria 18', 'Rutina generada automáticamente', NOW(), NULL, NULL),
(19, 19, 'Rutina diaria 19', 'Rutina generada automáticamente', NOW(), NULL, NULL),
(20, 20, 'Rutina diaria 20', 'Rutina generada automáticamente', NOW(), NULL, NULL),
(21, 21, 'Rutina diaria 21', 'Rutina generada automáticamente', NOW(), NULL, NULL),
(22, 22, 'Rutina diaria 22', 'Rutina generada automáticamente', NOW(), NULL, NULL);


-- Actividades
INSERT INTO actividades (
  id, rutina_id, ninos_id, titulo, descripcion, fecha_creacion, fecha_realizacion, hora_inicio, hora_fin, color, tipo, ubicacion, usuario_responsable, completado
) VALUES
(6, 3, 3, 'Desayuno saludable', 'Comida balanceada con frutas y cereales', NOW(), '2025-06-05 08:00:00', '08:00:00', '08:30:00', '#33c1ff', 'Rutina', NULL, 3, FALSE),
(7, 3, 3, 'Parque con amigos', 'Jugar al aire libre con supervisión', NOW(), '2025-06-12 10:00:00', '10:00:00', '11:30:00', '#85e085', 'Evento', NULL, 3, FALSE),
(8, 3, 3, 'Lectura guiada', 'Leer un cuento corto y conversar sobre él', NOW(), '2025-06-18 17:00:00', '17:00:00', '17:45:00', '#ff5733', 'Objetivo', NULL, 3, FALSE),
(9, 4, 4, 'Vestirse solo', 'Aprender a ponerse la ropa sin ayuda', NOW(), '2025-06-25 09:00:00', '09:00:00', '09:30:00', '#33c1ff', 'Rutina', NULL, 4, FALSE),
(10, 4, 4, 'Visita al pediatra', 'Control de salud regular', NOW(), '2025-06-28 11:00:00', '11:00:00', '12:00:00', '#ff5733', 'Evento', NULL, 4, FALSE),
(11, 4, 4, 'Pintar con acuarelas', 'Actividad artística para expresión libre', NOW(), '2025-07-02 16:00:00', '16:00:00', '17:00:00', '#85e085', 'Objetivo', NULL, 4, FALSE),
(12, 5, 5, 'Recoger juguetes', 'Tarea diaria para mantener el orden', NOW(), '2025-06-03 18:00:00', '18:00:00', '18:20:00', '#33c1ff', 'Rutina', NULL, 5, FALSE),
(13, 5, 5, 'Salir en bici', 'Paseo en bicicleta por el barrio', NOW(), '2025-06-11 10:30:00', '10:30:00', '11:30:00', '#ff5733', 'Evento', NULL, 5, FALSE),
(14, 5, 5, 'Construcción con bloques', 'Jugar armando estructuras', NOW(), '2025-07-06 15:00:00', '15:00:00', '16:00:00', '#85e085', 'Objetivo', NULL, 5, FALSE),
(15, 6, 6, 'Lavarse los dientes', 'Hábitos de higiene después de comer', NOW(), '2025-06-20 14:00:00', '14:00:00', '14:15:00', '#33c1ff', 'Rutina', NULL, 6, FALSE),
(16, 6, 6, 'Juego de memoria', 'Estimulación cognitiva con cartas', NOW(), '2025-06-22 16:00:00', '16:00:00', '16:45:00', '#ff5733', 'Objetivo', NULL, 6, FALSE),
(17, 7, 7, 'Hora del cuento', 'Leer un libro con imágenes', NOW(), '2025-06-07 18:00:00', '18:00:00', '18:30:00', '#33c1ff', 'Rutina', NULL, 7, FALSE),
(18, 7, 7, 'Caminata familiar', 'Paseo al aire libre con familia', NOW(), '2025-06-15 09:00:00', '09:00:00', '10:00:00', '#85e085', 'Evento', NULL, 7, FALSE),
(19, 7, 7, 'Colorear dibujos', 'Actividad de expresión artística', NOW(), '2025-07-03 17:00:00', '17:00:00', '17:30:00', '#33c1ff', 'Objetivo', NULL, 7, FALSE),
(20, 8, 8, 'Regar plantas', 'Aprender responsabilidad con plantas', NOW(), '2025-06-09 08:30:00', '08:30:00', '08:45:00', '#33c1ff', 'Rutina', NULL, 8, FALSE),
(21, 8, 8, 'Salida al zoo', 'Aprender sobre animales', NOW(), '2025-06-14 10:00:00', '10:00:00', '12:30:00', '#ff5733', 'Evento', NULL, 8, FALSE),
(22, 8, 8, 'Modelado con plastilina', 'Actividad sensorial creativa', NOW(), '2025-06-19 16:30:00', '16:30:00', '17:30:00', '#85e085', 'Objetivo', NULL, 8, FALSE),
(23, 9, 9, 'Tender la ropa', 'Ayudar con tareas domésticas', NOW(), '2025-06-13 11:00:00', '11:00:00', '11:20:00', '#33c1ff', 'Rutina', NULL, 9, FALSE),
(24, 9, 9, 'Picnic en el parque', 'Comida al aire libre con juegos', NOW(), '2025-06-21 12:00:00', '12:00:00', '13:30:00', '#ff5733', 'Evento', NULL, 9, FALSE),
(25, 9, 9, 'Puzzles', 'Resolver rompecabezas simples', NOW(), '2025-07-05 15:00:00', '15:00:00', '15:45:00', '#85e085', 'Objetivo', NULL, 9, FALSE),
(26, 10, 10, 'Guardar ropa', 'Ordenar su habitación', NOW(), '2025-06-16 18:00:00', '18:00:00', '18:20:00', '#33c1ff', 'Rutina', NULL, 10, FALSE),
(27, 10, 10, 'Excursión escolar', 'Visita guiada educativa', NOW(), '2025-06-10 09:30:00', '09:30:00', '12:00:00', '#ff5733', 'Evento', NULL, 10, FALSE),
(28, 10, 10, 'Yoga infantil', 'Relajación y ejercicio suave', NOW(), '2025-06-23 17:00:00', '17:00:00', '17:30:00', '#85e085', 'Objetivo', NULL, 10, FALSE),
(29, 11, 11, 'Hacer la cama', 'Fomentar la autonomía', NOW(), '2025-06-04 08:00:00', '08:00:00', '08:10:00', '#33c1ff', 'Rutina', NULL, 11, FALSE),
(30, 11, 11, 'Fiesta de cumpleaños', 'Celebración con amigos', NOW(), '2025-06-26 16:00:00', '16:00:00', '18:00:00', '#ff5733', 'Evento', NULL, 11, FALSE),
(31, 11, 11, 'Música libre', 'Escuchar y moverse con música', NOW(), '2025-06-08 11:00:00', '11:00:00', '11:45:00', '#85e085', 'Objetivo', NULL, 11, FALSE),
(32, 12, 12, 'Preparar mochila', 'Alistar materiales para el cole', NOW(), '2025-06-06 19:00:00', '19:00:00', '19:15:00', '#33c1ff', 'Rutina', NULL, 12, FALSE),
(33, 12, 12, 'Excursión natural', 'Conocer la naturaleza en familia', NOW(), '2025-06-27 10:00:00', '10:00:00', '12:30:00', '#ff5733', 'Evento', NULL, 12, FALSE),
(34, 12, 12, 'Juegos de roles', 'Representar situaciones cotidianas', NOW(), '2025-07-04 17:00:00', '17:00:00', '18:00:00', '#85e085', 'Objetivo', NULL, 12, FALSE),
(35, 13, 13, 'Doblar ropa', 'Participar en el orden del hogar', NOW(), '2025-06-29 18:00:00', '18:00:00', '18:15:00', '#33c1ff', 'Rutina', NULL, 13, FALSE),
(36, 13, 13, 'Visita al acuario', 'Aprender sobre vida marina', NOW(), '2025-07-01 10:30:00', '10:30:00', '12:00:00', '#ff5733', 'Evento', NULL, 13, FALSE),
(37, 13, 13, 'Cocina creativa', 'Hacer galletas con formas divertidas', NOW(), '2025-07-08 15:00:00', '15:00:00', '16:00:00', '#85e085', 'Objetivo', NULL, 13, FALSE),
(38, 14, 14, 'Limpiar juguetes', 'Mantener el espacio ordenado', NOW(), '2025-06-20 17:30:00', '17:30:00', '17:45:00', '#33c1ff', 'Rutina', NULL, 14, FALSE),
(39, 14, 14, 'Día de campo familiar', 'Disfrutar de un día al aire libre', NOW(), '2025-06-24 11:00:00', '11:00:00', '14:00:00', '#ff5733', 'Evento', NULL, 14, FALSE),
(40, 14, 14, 'Manualidades con papel reciclado', 'Crear arte con materiales reciclados', NOW(), '2025-07-07 16:30:00', '16:30:00', '17:30:00', '#85e085', 'Objetivo', NULL, 14, FALSE),
(41, 15, 15, 'Organizar libros infantiles', 'Fomentar el amor por la lectura', NOW(), '2025-06-05 09:30:00', '09:30:00', '09:45:00', '#33c1ff', 'Rutina', NULL, 15, FALSE),
(42, 15, 15, 'Fiesta de disfraces en casa', 'Jugar y socializar con amigos en casa', NOW(), '2025-06-12 16:30:00', '16:30:00', '18:30:00', '#ff5733', 'Evento', NULL, 15, FALSE),
(43, 15, 15, 'Danza libre', 'Expresión corporal a través del baile', NOW(), '2025-06-19 14:00:00', '14:00:00', '14:45:00', '#85e085', 'Objetivo', NULL, 15, FALSE),
(44, 16, 16, 'Recoger la mesa después de comer', 'Fomentar la responsabilidad en las tareas del hogar', NOW(), '2025-06-08 13:30:00', '13:30:00', '13:45:00', '#33c1ff', 'Rutina', NULL, 16, FALSE),
(45, 16, 16, 'Visita al planetario', 'Descubrir el espacio y los planetas', NOW(), '2025-06-15 10:00:00', '10:00:00', '12:30:00', '#ff5733', 'Evento', NULL, 16, FALSE),
(46, 16, 16, 'Juegos de construcción con bloques grandes', 'Estimular la creatividad y la motricidad fina', NOW(), '2025-06-22 15:30:00', '15:30:00', '16:30:00', '#85e085', 'Objetivo', NULL, 16, FALSE),
(47, 17, 17, 'Hacer un dibujo para un familiar lejano', 'Fomentar el cariño y la creatividad a distancia', NOW(), '2025-06-10 11:30:00', '11:30:00', '11:50:00', '#33c1ff', 'Rutina', NULL, 17, FALSE),
(48, 17, 17, 'Día de juegos en familia en casa de abuelos', 'Fortalecer los lazos familiares con juegos tradicionales en casa de los abuelos.', NOW(), '2025-06-18 14:00:00', '14:00:00', '17:30:00', '#ff5733', 'Evento', NULL, 17, FALSE),
(49, 17, 17, 'Juegos de mesa en familia', 'Fomentar la convivencia y el pensamiento estratégico con juegos de mesa familiares.', NOW(), '2025-06-25 16:00:00', '16:00:00', '17:30:00', '#85e085', 'Objetivo', NULL, 17, FALSE),
(50, 18, 18, 'Limpiar el área de juegos', 'Fomentar la responsabilidad y el cuidado del espacio compartido.', NOW(), '2025-06-12 10:30:00', '10:30:00', '10:50:00', '#33c1ff', 'Rutina', NULL, 18, FALSE),
(51, 18, 18, 'Visita a un parque de aventuras', 'Estimular la actividad física y la exploración al aire libre.', NOW(), '2025-06-20 11:00:00', '11:00:00', '13:30:00', '#ff5733', 'Evento', NULL, 18, FALSE),
(52, 18, 18, 'Juegos de agua en el jardín o patio', 'Disfrutar del agua y el juego al aire libre en un ambiente seguro.', NOW(), '2025-06-27 15:30:00', '15:30:00', '16:30:00', '#85e085', 'Objetivo', NULL, 18, FALSE),
(53, 19, 19, 'Recoger hojas secas en el jardín o parque cercano.', 'Fomentar la conexión con la naturaleza y la responsabilidad ambiental.', NOW(), '2025-06-14 09:30:00', '09:30:00', '09:50:00', '#33c1ff', 'Rutina', NULL, 19, FALSE),
(54, 19, 19, 'Día de juegos al aire libre con amigos en casa.', 'Fomentar la socialización y el juego activo con amigos cercanos.', NOW(), '2025-06-21 10:30:00', '10:30:00', '13:00:00', '#ff5733', 'Evento', NULL, 19, FALSE),
(55, 19, 19, 'Juegos de construcción con bloques grandes.', 'Estimular la creatividad y la motricidad fina con bloques grandes.', NOW(), '2025-06-28 15:00:00', '15:00:00', '16:30:00', '#85e085', 'Objetivo', NULL, 19, FALSE),
(56, 20, 20, 'Organizar juguetes después de jugar.', 'Fomentar la responsabilidad y el orden en el espacio de juego.', NOW(), '2025-06-16 11:30:00', '11:30:00', '11:50:00', '#33c1ff', 'Rutina', NULL, 20, FALSE),
(57, 20, 20, 'Visita a un parque temático cercano.', 'Disfrutar de un día lleno de diversión y aprendizaje en un parque temático.', NOW(), '2025-06-23 10:00:00', '10:00:00', '14:30:00', '#ff5733', 'Evento', NULL, 20, FALSE),
(58, 20, 20, 'Juegos de mesa familiares.', 'Fomentar la convivencia y el pensamiento estratégico con juegos de mesa familiares.', NOW(), '2025-06-30 16:30:00', '16:30:00', '18:00:00', '#85e085', 'Objetivo', NULL, 20, FALSE),
(59, 21, 21, 'Hacer una lista de compras para el mercado.', 'Fomentar la planificación y la responsabilidad en las compras familiares.', NOW(), '2025-06-17 09:30:00', '09:30:00', '09:50:00', '#33c1ff', 'Rutina', NULL, 21, FALSE),
(60, 21, 21, 'Día de juegos al aire libre con amigos en el parque local.', 'Fomentar la socialización y el juego activo con amigos cercanos en un entorno seguro.', NOW(), '2025-06-24 10:30:00', '10:30:00', '13:00:00', '#ff5733', 'Evento', NULL, 21, FALSE),
(61, 21, 21, 'Juegos de construcción con bloques grandes.', 'Estimular la creatividad y la motricidad fina con bloques grandes.', NOW(), '2025-07-01 15:00:00', '15:00:00', '16:30:00', '#85e085', 'Objetivo', NULL, 21, FALSE),
(62, 22, 22, 'Recoger hojas secas en el jardín o parque cercano.', 'Fomentar la conexión con la naturaleza y la responsabilidad ambiental.', NOW(), '2025-06-18 11:30:00', '11:30:00', '11:50:00', '#33c1ff', 'Rutina', NULL, 22, FALSE),
(63, 22, 22, 'Día de juegos al aire libre con amigos en casa.', 'Fomentar la socialización y el juego activo con amigos cercanos.', NOW(), '2025-06-25 10:30:00', '10:30:00', '13:00:00', '#ff5733', 'Evento', NULL, 22, FALSE),
(64, 22, 22, 'Juegos de mesa familiares.', 'Fomentar la convivencia y el pensamiento estratégico con juegos de mesa familiares.', NOW(), '2025-07-02 16:30:00', '16:30:00', '18:00:00', '#85e085', 'Objetivo', NULL, 22, FALSE);

-- Objetivos
INSERT INTO objetivos (id, ninos_id, nombre, color, tipo, fecha_fin) VALUES
(3, 3, 'Objetivo 3', '#00ff00', 'emocional', '2025-07-17'),
(4, 4, 'Objetivo 4', '#ff0000', 'educativo', '2025-07-11'),
(5, 5, 'Objetivo 5', '#00ff00', 'autonomía', '2025-06-28'),
(6, 6, 'Objetivo 6', '#0000ff', 'autonomía', '2025-06-28'),
(7, 7, 'Objetivo 7', '#0000ff', 'emocional', '2025-07-13'),
(8, 8, 'Objetivo 8', '#00ff00', 'emocional', '2025-07-13'),
(9, 9, 'Objetivo 9', '#0000ff', 'educativo', '2025-07-06'),
(10, 10, 'Objetivo 10', '#00ff00', 'emocional', '2025-06-27'),
(11, 11, 'Objetivo 11', '#00ff00', 'emocional', '2025-06-28'),
(12, 12, 'Objetivo 12', '#0000ff', 'emocional', '2025-06-26'),
(13, 13, 'Objetivo 13', '#00ff00', 'educativo', '2025-07-16'),
(14, 14, 'Objetivo 14', '#ff0000', 'emocional', '2025-07-14'),
(15, 15, 'Objetivo 15', '#00ff00', 'educativo', '2025-07-09'),
(16, 16, 'Objetivo 16', '#ff0000', 'educativo', '2025-06-27'),
(17, 17, 'Objetivo 17', '#00ff00', 'educativo', '2025-07-14'),
(18, 18, 'Objetivo 18', '#ff0000', 'autonomía', '2025-07-14'),
(19, 19, 'Objetivo 19', '#ff0000', 'emocional', '2025-07-14'),
(20, 20, 'Objetivo 20', '#0000ff', 'autonomía', '2025-07-22'),
(21, 21, 'Objetivo 21', '#0000ff', 'educativo', '2025-07-02'),
(22, 22, 'Objetivo 22', '#ff0000', 'autonomía', '2025-06-28');

-- Objetivos_Actividades
INSERT INTO objetivos_has_actividades (objetivo_id, actividad_id) VALUES
(3, 6),
(4, 9),
(5, 12),
(6, 15),
(7, 18),
(8, 21),
(9, 24),
(10, 27),
(11, 30),
(12, 33),
(13, 36),
(14, 39),
(15, 42),
(16, 45),
(17, 48),
(18, 51),
(19, 54),
(20, 57),
(21, 60),
(22, 63);

-- Recordatorios

-- Notas
INSERT INTO notas (id, ninos_id, titulo, texto, fecha_creacion) VALUES
(2, 3, 'Nota 2', 'Nota de observación para Encarnita', NOW()),
(3, 4, 'Nota 3', 'Nota de observación para Miguel Ángel', NOW()),
(4, 5, 'Nota 4', 'Nota de observación para Celia', NOW()),
(5, 6, 'Nota 5', 'Nota de observación para Reyes', NOW()),
(6, 7, 'Nota 6', 'Nota de observación para Guiomar', NOW()),
(7, 8, 'Nota 7', 'Nota de observación para Agapito', NOW()),
(8, 9, 'Nota 8', 'Nota de observación para Adolfo', NOW()),
(9, 10, 'Nota 9', 'Nota de observación para Hermenegildo', NOW()),
(10, 11, 'Nota 10', 'Nota de observación para Catalina', NOW()),
(11, 12, 'Nota 11', 'Nota de observación para Epifanio', NOW()),
(12, 13, 'Nota 12', 'Nota de observación para Santos', NOW()),
(13, 14, 'Nota 13', 'Nota de observación para Joaquina', NOW()),
(14, 15, 'Nota 14', 'Nota de observación para Xavier', NOW()),
(15, 16, 'Nota 15', 'Nota de observación para Martín', NOW()),
(16, 17, 'Nota 16', 'Nota de observación para Mireia', NOW()),
(17, 18, 'Nota 17', 'Nota de observación para Dan', NOW()),
(18, 19, 'Nota 18', 'Nota de observación para Lázaro', NOW()),
(19, 20, 'Nota 19', 'Nota de observación para Matilde', NOW()),
(20, 21, 'Nota 20', 'Nota de observación para Máxima', NOW()),
(21, 22, 'Nota 21', 'Nota de observación para Jose Carlos', NOW());

-- Invitaciones
INSERT INTO invitacion_usuario_familia (id, familia_id, usuario_emisor, email_destinatario, rol, atentido, aceptado, fecha_envio) VALUES
(3, 2, 3, 'otilia33@gmail.com', 'cuidador', FALSE, FALSE, NOW()),
(4, 1, 4, 'masanunciacion@yahoo.com', 'cuidador', FALSE, FALSE, NOW()),
(5, 1, 5, 'tferreras@hotmail.com', 'cuidador', FALSE, FALSE, NOW()),
(6, 1, 6, 'jeronimopinol@corominas.es', 'cuidador', FALSE, FALSE, NOW()),
(7, 1, 7, 'waltermorillo@yahoo.com', 'cuidador', FALSE, FALSE, NOW()),
(8, 1, 8, 'carlosherrero@gmail.com', 'cuidador', FALSE, FALSE, NOW()),
(9, 1, 9, 'shernandez@yahoo.com', 'cuidador', FALSE, FALSE, NOW()),
(10, 1, 10, 'feliciatudela@gmail.com', 'cuidador', FALSE, FALSE, NOW()),
(11, 1, 11, 'fulgenciobenavides@acedo.es', 'cuidador', FALSE, FALSE, NOW()),
(12, 3, 12, 'diezadoracion@hotmail.com', 'cuidador', FALSE, FALSE, NOW()),
(13, 3, 13, 'andreseva-maria@hotmail.com', 'cuidador', FALSE, FALSE, NOW()),
(14, 2, 14, 'marcela76@cornejo-valbuena.com', 'cuidador', FALSE, FALSE, NOW()),
(15, 3, 15, 'moratanatividad@marcos.es', 'cuidador', FALSE, FALSE, NOW()),
(16, 3, 16, 'maura39@yahoo.com', 'cuidador', FALSE, FALSE, NOW()),
(17, 3, 17, 'brunilda17@juarez-piquer.es', 'cuidador', FALSE, FALSE, NOW()),
(18, 3, 18, 'donatosanz@gmail.com', 'cuidador', FALSE, FALSE, NOW()),
(19, 1, 19, 'trujilloleticia@yahoo.com', 'cuidador', FALSE, FALSE, NOW()),
(20, 3, 20, 'reigpaulino@hotmail.com', 'cuidador', FALSE, FALSE, NOW()),
(21, 2, 21, 'lorena59@hotmail.com', 'cuidador', FALSE, FALSE, NOW()),
(22, 1, 22, 'tquiroga@hotmail.com', 'cuidador', FALSE, FALSE, NOW());

-- Alergias
INSERT INTO alergias (id, ninos_id, nombre) VALUES
(3, 3, 'Nueces'),
(4, 4, 'Gluten'),
(5, 5, 'Lactosa'),
(6, 6, 'Gluten'),
(7, 7, 'Gluten'),
(8, 8, 'Nueces'),
(9, 9, 'Gluten'),
(10, 10, 'Polen'),
(11, 11, 'Gluten'),
(12, 12, 'Gluten'),
(13, 13, 'Polen'),
(14, 14, 'Nueces'),
(15, 15, 'Polen'),
(16, 16, 'Polen'),
(17, 17, 'Lactosa'),
(18, 18, 'Lactosa'),
(19, 19, 'Nueces'),
(20, 20, 'Nueces'),
(21, 21, 'Polen'),
(22, 22, 'Polen');


-- Actividad tipo "Evento"
INSERT INTO actividades (
  ninos_id, titulo, descripcion, fecha_realizacion,
  hora_inicio, hora_fin, color, tipo, usuario_responsable, completado
) VALUES
-- Niño 1
(1, 'Cita con el pediatra', 'Control de salud mensual', '2025-06-05', '10:00:00', '11:00:00', '#e74c3c', 'Evento', 10, FALSE),
(1, 'Revisión dental', 'Chequeo dental de rutina', '2025-06-08', '09:30:00', '10:00:00', '#f39c12', 'Evento', 10, FALSE),
(1, 'Taller de arte', 'Actividad de creatividad en grupo', '2025-06-12', '15:00:00', '16:30:00', '#8e44ad', 'Evento', 10, FALSE),
(1, 'Salida al parque', 'Jugar y explorar la naturaleza', '2025-06-16', '10:30:00', '12:00:00', '#27ae60', 'Evento', 10, FALSE),
(1, 'Charla educativa', 'Actividad en la biblioteca infantil', '2025-06-24', '11:00:00', '12:00:00', '#3498db', 'Evento', 10, FALSE),

-- Niño 2
(2, 'Cita con el pediatra', 'Control de salud mensual', '2025-06-03', '10:00:00', '11:00:00', '#e74c3c', 'Evento', 11, FALSE),
(2, 'Revisión dental', 'Chequeo dental de rutina', '2025-06-06', '09:00:00', '09:30:00', '#f39c12', 'Evento', 11, FALSE),
(2, 'Taller de arte', 'Actividad de creatividad en grupo', '2025-06-10', '14:00:00', '15:00:00', '#8e44ad', 'Evento', 11, FALSE),
(2, 'Salida al parque', 'Jugar y explorar la naturaleza', '2025-06-19', '11:00:00', '12:30:00', '#27ae60', 'Evento', 11, FALSE),
(2, 'Charla educativa', 'Actividad en la biblioteca infantil', '2025-06-27', '13:00:00', '14:00:00', '#3498db', 'Evento', 11, FALSE),

-- Niño 3
(3, 'Cita con el pediatra', 'Control de salud mensual', '2025-06-02', '10:00:00', '11:00:00', '#e74c3c', 'Evento', 12, FALSE),
(3, 'Revisión dental', 'Chequeo dental de rutina', '2025-06-04', '09:00:00', '09:45:00', '#f39c12', 'Evento', 12, FALSE),
(3, 'Taller de arte', 'Actividad de creatividad en grupo', '2025-06-07', '15:00:00', '16:00:00', '#8e44ad', 'Evento', 12, FALSE),
(3, 'Salida al parque', 'Jugar y explorar la naturaleza', '2025-06-15', '10:30:00', '12:00:00', '#27ae60', 'Evento', 12, FALSE),
(3, 'Charla educativa', 'Actividad en la biblioteca infantil', '2025-06-22', '11:00:00', '12:00:00', '#3498db', 'Evento', 12, FALSE),

-- Niño 4
(4, 'Cita con el pediatra', 'Control de salud mensual', '2025-06-01', '10:00:00', '11:00:00', '#e74c3c', 'Evento', 13, FALSE),
(4, 'Revisión dental', 'Chequeo dental de rutina', '2025-06-09', '09:00:00', '09:30:00', '#f39c12', 'Evento', 13, FALSE),
(4, 'Taller de arte', 'Actividad de creatividad en grupo', '2025-06-14', '15:00:00', '16:30:00', '#8e44ad', 'Evento', 13, FALSE),
(4, 'Salida al parque', 'Jugar y explorar la naturaleza', '2025-06-20', '10:30:00', '12:00:00', '#27ae60', 'Evento', 13, FALSE),
(4, 'Charla educativa', 'Actividad en la biblioteca infantil', '2025-06-28', '11:00:00', '12:00:00', '#3498db', 'Evento', 13, FALSE),

-- Niño 5
(5, 'Cita con el pediatra', 'Control de salud mensual', '2025-06-04', '10:00:00', '11:00:00', '#e74c3c', 'Evento', 14, FALSE),
(5, 'Revisión dental', 'Chequeo dental de rutina', '2025-06-06', '09:00:00', '09:30:00', '#f39c12', 'Evento', 14, FALSE),
(5, 'Taller de arte', 'Actividad de creatividad en grupo', '2025-06-11', '15:00:00', '16:00:00', '#8e44ad', 'Evento', 14, FALSE),
(5, 'Salida al parque', 'Jugar y explorar la naturaleza', '2025-06-17', '10:30:00', '12:00:00', '#27ae60', 'Evento', 14, FALSE),
(5, 'Charla educativa', 'Actividad en la biblioteca infantil', '2025-06-26', '11:00:00', '12:00:00', '#3498db', 'Evento', 14, FALSE),

-- Niño 6
(6, 'Cita con el pediatra', 'Control de salud mensual', '2025-06-03', '10:00:00', '11:00:00', '#e74c3c', 'Evento', 15, FALSE),
(6, 'Revisión dental', 'Chequeo dental de rutina', '2025-06-08', '09:00:00', '09:30:00', '#f39c12', 'Evento', 15, FALSE),
(6, 'Taller de arte', 'Actividad de creatividad en grupo', '2025-06-13', '15:00:00', '16:00:00', '#8e44ad', 'Evento', 15, FALSE),
(6, 'Salida al parque', 'Jugar y explorar la naturaleza', '2025-06-21', '10:30:00', '12:00:00', '#27ae60', 'Evento', 15, FALSE),
(6, 'Charla educativa', 'Actividad en la biblioteca infantil', '2025-06-30', '11:00:00', '12:00:00', '#3498db', 'Evento', 15, FALSE);

INSERT INTO vacunas (id,ninos_id,nombre,fecha) VALUES
  (1,1,'Viruela','2023-05-15 00:00:00'),
  (2,2,'Sarampión','2024-01-20 00:00:00');

INSERT INTO enfermedades (id,ninos_id,nombre,doctor)
VALUES (1,2,'Otitis','Dr. Ruiz');


SET FOREIGN_KEY_CHECKS = 1;
