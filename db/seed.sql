SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET FOREIGN_KEY_CHECKS=0; -- Deshabilita la verificación de claves foráneas temporalmente para permitir la inserción en cualquier orden

-- Usuarios
-- Hemos añadido un usuario "admin" por familia para tener un punto de partida
INSERT INTO usuarios (nombre, apellido, nick, email, contrasena, primera_sesion, fecha_creacion, borrado, email_verificado) VALUES
('Ana', 'García', 'anag', 'ana.garcia@email.com', 'hashedpass_ana', 0, NOW(), 0, 1),      -- id: 1 (Familia 1 - Admin)
('Pedro', 'Martínez', 'pedrom', 'pedro.martinez@email.com', 'hashedpass_pedro', 0, NOW(), 0, 1), -- id: 2 (Familia 1 - Cuidador)
('Laura', 'Ruiz', 'laurar', 'laura.ruiz@email.com', 'hashedpass_laura', 0, NOW(), 0, 1),    -- id: 3 (Familia 2 - Admin)
('Carlos', 'López', 'carlosl', 'carlos.lopez@email.com', 'hashedpass_carlos', 0, NOW(), 0, 1), -- id: 4 (Familia 2 - Cuidador)
('Sofía', 'Pérez', 'sofiap', 'sofia.perez@email.com', 'hashedpass_sofia', 0, NOW(), 0, 1),    -- id: 5 (Familia 3 - Admin)
('Juan', 'Díaz', 'juand', 'juan.diaz@email.com', 'hashedpass_juan', 0, NOW(), 0, 1);       -- id: 6 (Familia 3 - Cuidador)


-- Familias
INSERT INTO familia (descripcion) VALUES
('La familia feliz de los García-Martínez.'),
('Los Ruiz-López, siempre organizados.'),
('La casa de los Pérez-Díaz, llena de vida.');

-- Perfiles de Aprendizaje
INSERT INTO perfiles_aprendizaje (nombre, descripcion) VALUES
('Visual', 'Aprende mejor viendo imágenes, diagramas y videos.'),
('Auditivo', 'Aprende mejor escuchando explicaciones y debates.'),
('Kinestésico', 'Aprende mejor a través de la experiencia y la práctica.'),
('Lógico-Matemático', 'Aprende mejor con la lógica, patrones y resolución de problemas.'),
('Interpersonal', 'Aprende mejor interactuando con otros y en grupo.'),
('Intrapersonal', 'Aprende mejor de forma independiente y reflexionando.');

-- Niños (Asignamos perfiles de aprendizaje y los vinculamos a familias ficticias por suposicion)
-- NOTA: Aunque no hay FK directa de ninos a familia en el esquema, el sentido es que los niños pertenecen a la familia de los usuarios que los gestionan.
INSERT INTO ninos (perfiles_aprendizaje_id, nombre, apellido, fecha_nacimiento, descripcion, genero, peso, altura) VALUES
(1, 'Leo', 'García', '2019-03-15', 'Un niño muy creativo, le encanta dibujar y los cuentos con imágenes.', 'M', 28, 110), -- Hijo de Familia 1
(3, 'Mía', 'Martínez', '2020-07-22', 'Muy activa, aprende rápido cuando puede tocar y experimentar.', 'F', 25, 105), -- Hija de Familia 1
(2, 'Pablo', 'Ruiz', '2018-11-01', 'Disfruta escuchando historias y explicando sus ideas.', 'M', 30, 115),  -- Hijo de Familia 2
(1, 'Clara', 'López', '2021-01-08', 'Prefiere los libros ilustrados y los juegos visuales.', 'F', 22, 98),  -- Hija de Familia 2
(4, 'Diego', 'Pérez', '2017-09-10', 'Le encanta resolver rompecabezas y entender cómo funcionan las cosas.', 'M', 33, 120); -- Hijo de Familia 3

-- Familia_Usuarios (Roles en las familias)
INSERT INTO familia_usuarios (familia_id, usuarios_id, rol) VALUES
(1, 1, 'admin'),     -- Ana es administradora de la Familia 1
(1, 2, 'cuidador'),  -- Pedro es cuidador de la Familia 1
(2, 3, 'admin'),     -- Laura es administradora de la Familia 2
(2, 4, 'cuidador'),  -- Carlos es cuidador de la Familia 2
(3, 5, 'admin'),     -- Sofía es administradora de la Familia 3
(3, 6, 'cuidador');  -- Juan es cuidador de la Familia 3

-- Rutinas
INSERT INTO rutinas (ninos_id, nombre, descripcion, frecuencia, fecha_fin) VALUES
(1, 'Rutina Mañana Leo', 'Actividades matutinas de Leo antes de ir al colegio.', '{"tipo": "diaria"}', '2025-12-31'),
(2, 'Rutina Noche Mía', 'Preparación para dormir de Mía.', '{"tipo": "semanal", "dias": [1,2,3,4,5]}', '2026-06-30'), -- L-V
(3, 'Rutina Estudio Pablo', 'Horario de estudio y lectura de Pablo.', '{"tipo": "semanal", "dias": [1,3,5]}', '2025-12-31'),
(4, 'Rutina Fines Semana Clara', 'Actividades de fin de semana para Clara.', '{"tipo": "semanal", "dias": [6,0]}', '2026-03-31'), -- S-D
(5, 'Rutina Hábitos Diego', 'Rutina para fomentar buenos hábitos en Diego.', '{"tipo": "diaria"}', '2025-11-30');

-- Objetivos
INSERT INTO objetivos (rutinas_id, nombre, color, tipo) VALUES
(1, 'Desarrollar autonomía al vestirse', '#FFC300', 'habilidad'), -- Amarillo
(1, 'Terminar desayuno a tiempo', '#DAF7A6', 'comportamiento'),  -- Verde claro
(2, 'Cepillarse los dientes solo', '#C70039', 'habilidad'),     -- Rojo
(2, 'Contar cuento antes de dormir', '#3498DB', 'comportamiento'), -- Azul
(3, 'Leer 15 minutos diarios', '#8E44AD', 'habilidad'),         -- Morado
(3, 'Hacer tareas de matemáticas', '#1ABC9C', 'habilidad'),     -- Turquesa
(4, 'Jugar al aire libre', '#F4D03F', 'comportamiento'),       -- Dorado
(4, 'Ordenar juguetes', '#5DADE2', 'habilidad'),               -- Azul claro
(5, 'Ayudar en la mesa', '#2ECC71', 'comportamiento'),         -- Verde
(5, 'Practicar vocabulario inglés', '#E74C3C', 'habilidad');    -- Naranja rojizo

-- Actividades
INSERT INTO actividades (rutina_id, ninos_id, titulo, descripcion, dia_semana, hora_inicio, hora_fin, color, tipo, ubicacion, usuario_responsable) VALUES
(1, 1, 'Vestirse solo', 'Leo debe elegir su ropa y vestirse sin ayuda.', 1, '07:30:00', '07:45:00', '#FFC300', 'Tarea', '{"lugar": "Dormitorio de Leo"}', 1), -- Lunes
(1, 1, 'Desayunar', 'Comer el desayuno en 15 minutos.', 1, '07:45:00', '08:00:00', '#DAF7A6', 'Habito', '{"lugar": "Cocina"}', 2), -- Lunes
(2, 2, 'Preparar pijama', 'Mía debe escoger su pijama para la noche.', 3, '20:00:00', '20:10:00', '#C70039', 'Tarea', '{"lugar": "Dormitorio de Mía"}', 1), -- Miércoles
(2, 2, 'Cuento de buenas noches', 'Un adulto leerá un cuento a Mía.', 3, '20:30:00', '20:45:00', '#3498DB', 'Evento', '{"lugar": "Dormitorio de Mía"}', 2), -- Miércoles
(3, 3, 'Lectura diaria', 'Pablo leerá su libro favorito.', 5, '18:00:00', '18:30:00', '#8E44AD', 'Habito', '{"lugar": "Sala de estar"}', 3), -- Viernes
(3, 3, 'Ejercicios de mates', 'Resolver 10 problemas de matemáticas.', 5, '18:30:00', '19:00:00', '#1ABC9C', 'Tarea', '{"lugar": "Escritorio de Pablo"}', 4), -- Viernes
(4, 4, 'Parque', 'Ir al parque a jugar con otros niños.', 6, '11:00:00', '12:30:00', '#F4D03F', 'Evento', '{"lugar": "Parque infantil"}', 3), -- Sábado
(4, 4, 'Recoger cuarto', 'Clara debe ordenar sus juguetes y libros.', 0, '17:00:00', '17:30:00', '#5DADE2', 'Tarea', '{"lugar": "Dormitorio de Clara"}', 4), -- Domingo (0 es domingo)
(5, 5, 'Poner la mesa', 'Diego ayudará a poner los cubiertos y platos.', 2, '13:30:00', '13:45:00', '#2ECC71', 'Habito', '{"lugar": "Comedor"}', 5), -- Martes
(5, 5, 'Repasar inglés', 'Practicar 5 palabras nuevas de inglés.', 4, '17:00:00', '17:15:00', '#E74C3C', 'Tarea', '{"lugar": "Escritorio de Diego"}', 6); -- Jueves

-- Alergias
INSERT INTO alergias (ninos_id, nombre) VALUES
(1, 'Polen'),
(2, 'Frutos secos'),
(3, 'Ácaros'),
(4, 'Lactosa');

-- Notas
INSERT INTO notas (ninos_id, titulo, texto, fecha_creacion) VALUES
(1, 'Avance en lectura', 'Leo ha empezado a reconocer más palabras. ¡Gran progreso!', NOW()),
(2, 'Día de piscina', 'Mía disfrutó mucho en la piscina hoy, menos resistencia al agua.', NOW()),
(3, 'Comportamiento en clase', 'Pablo se concentró muy bien en las tareas de grupo.', NOW()),
(4, 'Nueva comida', 'Clara probó las lentejas por primera vez y le gustaron.', NOW()),
(5, 'Dificultad con sumas', 'Diego necesita más práctica con las sumas de dos cifras.', NOW());

-- Invitaciones de Usuarios a Familias
-- Estas serían invitaciones pendientes o ya aceptadas que podrías simular
-- Suponemos que el usuario 1 (Ana) invita a un nuevo usuario (futuro id 7) a su familia 1
INSERT INTO invitacion_usuario_familia (familia_id, usuario_emisor, email_destinatario, rol, atentido, aceptado, fecha_envio) VALUES
(1, 1, 'nuevo.miembro@email.com', 'cuidador', 0, 0, NOW()),
(2, 3, 'amigo.laura@email.com', 'cuidador', 1, 1, '2025-05-20 10:00:00'); -- Una invitación ya aceptada

SET FOREIGN_KEY_CHECKS=1; -- Vuelve a habilitar la verificación de claves foráneas