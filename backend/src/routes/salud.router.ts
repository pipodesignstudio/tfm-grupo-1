import { Router } from 'express';
import { authMiddleware, validationMiddleware } from '../middlewares';
import { CreateAlergiaDto } from '../dtos/salud/create-alergia.dto';
import { UpdateAlergiaDto } from '../dtos/salud/update-alergia.dto';
import { SaludController } from '../controllers/salud.controller';
import { asyncMiddlewareWrapper } from '../utils';
import { CreateEnfermedadDto, CreateVacunaDto, UpdateEnfermedadDto, UpdateVacunaDto } from '../dtos/salud';

const controller = new SaludController();
const router = Router({ mergeParams: true });

/**
 * @openapi
 * /api/ninos/{id_nino}/salud/alergias:
 *   get:
 *     summary: Obtiene todas las alergias de un niño
 *     tags:
 *       - Salud
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Listado de alergias
 */
router.get(
  '/alergias',
  asyncMiddlewareWrapper(authMiddleware),
  asyncMiddlewareWrapper(controller.listarAlergias.bind(controller))
);

/**
 * @openapi
 * /api/ninos/{id_nino}/salud/alergias:
 *   post:
 *     summary: Crea una nueva alergia para un niño
 *     tags:
 *       - Salud
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAlergiaDto'
 *     responses:
 *       '201':
 *         description: Alergia creada exitosamente
 */
router.post(
  '/alergias',
  asyncMiddlewareWrapper(authMiddleware),
  validationMiddleware(CreateAlergiaDto),
  asyncMiddlewareWrapper(controller.crearAlergia.bind(controller))
);

/**
 * @openapi
 * /api/ninos/{id_nino}/salud/alergias/{id}:
 *   put:
 *     summary: Actualiza una alergia existente
 *     tags:
 *       -  Salud
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAlergiaDto'
 *     responses:
 *       '200':
 *         description: Alergia actualizada exitosamente
 */
router.put(
  '/alergias/:id',
  asyncMiddlewareWrapper(authMiddleware),
  validationMiddleware(UpdateAlergiaDto, true),
  asyncMiddlewareWrapper(controller.actualizarAlergias.bind(controller))
);

/**
 * @openapi
 * /api/ninos/{id_nino}/salud/alergias/{id}:
 *   delete:
 *     summary: Elimina una alergia
 *     tags:
 *       -  Salud
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Alergia eliminada exitosamente
 */
router.delete(
  '/alergias/:id',
  asyncMiddlewareWrapper(authMiddleware),
  asyncMiddlewareWrapper(controller.borrarAlergias.bind(controller))
);

// ----- 🏥 Enfermedades ----- //

/**
 * @openapi
 * /api/ninos/{id_nino}/salud/enfermedades:
 *   post:
 *     summary: Crea una nueva enfermedad para un niño
 *     tags:
 *       - Salud
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEnfermedadDto'
 *     responses:
 *       '201':
 *         description: Enfermedad creada exitosamente
 */
router.post('/enfermedades', asyncMiddlewareWrapper(authMiddleware), validationMiddleware(CreateEnfermedadDto), controller.crearEnfermedad)

/**
 * @openapi
 * /api/ninos/{id_nino}/salud/enfermedades/{id}:
 *   patch:
 *     summary: Actualiza una enfermedad existente
 *     tags:
 *       - Salud
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEnfermedadDto'
 *     responses:
 *       '200':
 *         description: Enfermedad actualizada exitosamente
 */
router.patch('/enfermedades/:id', asyncMiddlewareWrapper(authMiddleware), validationMiddleware(UpdateEnfermedadDto, true), controller.actualizarEnfermedad)

/**
 * @openapi
 * /api/ninos/{id_nino}/salud/enfermedades:
 *   get:
 *     summary: Obtiene todas las enfermedades de un niño
 *     tags:
 *       - Salud
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Listado de enfermedades
 */
router.get('/enfermedades', asyncMiddlewareWrapper(authMiddleware), controller.listarEnfermedades)

/**
 * @openapi
 * /api/ninos/{id_nino}/salud/enfermedades/{id}:
 *   get:
 *     summary: Obtiene una enfermedad por su ID
 *     tags:
 *       - Salud
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Enfermedad obtenida exitosamente
 */
  router.get('/enfermedades/:id', asyncMiddlewareWrapper(authMiddleware), controller.getEnfermedadById)

/**
 * @openapi
 * /api/ninos/{id_nino}/salud/enfermedades/{id}:
 *   delete:
 *     summary: Elimina una enfermedad
 *     tags:
 *       - Salud
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Enfermedad eliminada exitosamente
 */
router.delete('/enfermedades/:id', asyncMiddlewareWrapper(authMiddleware), controller.borrarEnfermedad)

// ----- 🏥 Vacunas ----- //

/**
 * @openapi
 * /api/ninos/{id_nino}/salud/vacunas:
 *   post:
 *     summary: Crea una nueva vacuna para un niño
 *     tags:
 *       - Salud
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVacunaDto'
 *     responses:
 *       '201':
 *         description: Vacuna creada exitosamente
 */
router.post('/vacunas', asyncMiddlewareWrapper(authMiddleware), validationMiddleware(CreateVacunaDto), controller.crearVacuna)

/**
 * @openapi
 * /api/ninos/{id_nino}/salud/vacunas/{id}:
 *   patch:
 *     summary: Actualiza una vacuna existente
 *     tags:
 *       - Salud
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVacunaDto'
 *     responses:
 *       '200':
 *         description: Vacuna actualizada exitosamente
 */
router.patch('/vacunas/:id', asyncMiddlewareWrapper(authMiddleware), validationMiddleware(UpdateVacunaDto), controller.actualizarVacuna)

/**
 * @openapi
 * /api/ninos/{id_nino}/salud/vacunas/{id}:
 *   delete:
 *     summary: Elimina una vacuna
 *     tags:
 *       - Salud
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Vacuna eliminada exitosamente
 */
  router.delete('/vacunas/:id', asyncMiddlewareWrapper(authMiddleware), controller.borrarVacuna)

/**
 * @openapi
 * /api/ninos/{id_nino}/salud/vacunas:
 *   get:
 *     summary: Obtiene todas las vacunas de un niño
 *     tags:
 *       - Salud
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Listado de vacunas
 */
router.get('/vacunas', asyncMiddlewareWrapper(authMiddleware), controller.listarVacunas)

/**
 * @openapi
 * /api/ninos/{id_nino}/salud/vacunas/{id}:
 *   get:
 *     summary: Obtiene una vacuna por su ID
 *     tags:
 *       - Salud
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id_nino
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Vacuna obtenida exitosamente
 */
router.get('/vacunas/:id', asyncMiddlewareWrapper(authMiddleware), controller.getVacunaById)






export default router;