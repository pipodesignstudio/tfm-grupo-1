-- Insertar perfiles de aprendizaje
INSERT INTO perfiles_aprendizaje (nombre, descripcion) VALUES
('Visual', 'Aprende observando'),
('Kinestésico', 'Aprende haciendo');

-- Insertar familias
INSERT INTO familia (descripcion) VALUES
('Familia Gómez'),
('Familia Pérez');

-- Insertar usuarios
INSERT INTO usuarios (nombre, apellido, nick, email, contrasena, primera_sesion, email_verificado) VALUES
('Lucía', 'Gómez', 'luciag', 'lucia@example.com', 'hashedpass1', FALSE, TRUE),
('Carlos', 'Pérez', 'carlosp', 'carlos@example.com', 'hashedpass2', FALSE, TRUE);

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
  rutina_id, ninos_id, titulo, descripcion, fechas_realizacion,
  dia_semana, hora_inicio, hora_fin, color, tipo,
  ubicacion, usuario_responsable, completado
)
VALUES (
  1, 1, 'Hora de Dormir', 'Rutina diaria para acostarse',
  JSON_ARRAY('2025-06-15', '2025-06-16'), 0, '20:00:00', '20:30:00', '#3498db',
  'Rutina',
  JSON_OBJECT('lugar', 'Habitación', 'piso', '2'), 10, FALSE
);

-- Actividad tipo "Evento"
INSERT INTO actividades (
  rutina_id, ninos_id, titulo, descripcion, fechas_realizacion,
  dia_semana, hora_inicio, hora_fin, color, tipo,
  ubicacion, usuario_responsable, completado
)
VALUES (
  2, 1, 'Cita con el pediatra', 'Control de salud mensual',
  JSON_ARRAY('2025-06-18'), NULL, '10:00:00', '11:00:00', '#e74c3c',
  'Evento',
  JSON_OBJECT('direccion', 'Calle Falsa 123', 'ciudad', 'Madrid'), 10, FALSE
);

-- Actividad tipo "Objetivo"
INSERT INTO actividades (
  rutina_id, ninos_id, titulo, descripcion, fechas_realizacion,
  dia_semana, hora_inicio, hora_fin, color, tipo,
  ubicacion, usuario_responsable, completado
)
VALUES (
  3, 2, 'Aprender a atarse los zapatos', 'Desarrollar autonomía personal',
  JSON_ARRAY('2025-06-15', '2025-06-22'), 2, '17:00:00', '17:30:00', '#2ecc71',
  'Objetivo',
  JSON_OBJECT('entorno', 'Casa', 'zona', 'Salón'), 11, FALSE
);


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

-- Insertar alergias
INSERT INTO alergias (ninos_id, nombre) VALUES
(2, 'Lácteos');

-- Insertar invitaciones
INSERT INTO invitacion_usuario_familia (familia_id, usuario_emisor, email_destinatario, rol) VALUES
(1, 1, 'tio@example.com', 'cuidador'),
(2, 2, 'abuela@example.com', 'cuidador');