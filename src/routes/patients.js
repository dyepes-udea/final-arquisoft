const express = require('express');
const router = express.Router();
const Patient = require('../models/patient');

// Documentación con Swagger
/**
 * @swagger
 * /patients/{cedula}:
 *   get:
 *     summary: Get a patient's basic medical record by cedula
 *     parameters:
 *       - name: cedula
 *         in: path
 *         required: true
 *         description: Cedula of the patient
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A patient's basic medical record
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cedula:
 *                   type: string
 *                 nombre:
 *                   type: string
 *                 apellido:
 *                   type: string
 *                 fechaNacimiento:
 *                   type: string
 *                 historiaClinica:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       fecha:
 *                         type: string
 *                       descripcion:
 *                         type: string
 *                       doctor:
 *                         type: object
 *                         properties:
 *                           nombre:
 *                             type: string
 *                           cedula:
 *                             type: string
 *       404:
 *         description: Patient not found
 */

/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Add a new patient's medical record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cedula:
 *                 type: string
 *               nombre:
 *                 type: string
 *               apellido:
 *                 type: string
 *               fechaNacimiento:
 *                 type: string
 *               historiaClinica:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     fecha:
 *                       type: string
 *                     descripcion:
 *                       type: string
 *                     doctor:
 *                       type: object
 *                       properties:
 *                         nombre:
 *                           type: string
 *                         cedula:
 *                           type: string
 *     responses:
 *       201:
 *         description: Medical record created
 *       400:
 *         description: Invalid input
 */

// Obtener historia clínica básica por cédula
router.get('/:cedula', async (req, res) => {
    const { cedula } = req.params;
    try {
        const patient = await Patient.findOne({ cedula });
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        res.json({
            data: patient,
            links: [
                { rel: 'self', method: 'GET', href: `/api/v1/patients/${cedula}` },
                { rel: 'create', method: 'POST', href: `/api/v1/patients` },
            ],
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Añadir historia clínica de un paciente
router.post('/', async (req, res) => {
    const { cedula, nombre, apellido, fechaNacimiento, historiaClinica } = req.body;
    const newPatient = new Patient({
        cedula,
        nombre,
        apellido,
        fechaNacimiento,
        historiaClinica,
    });

    try {
        const savedPatient = await newPatient.save();
        res.status(201).json({
            message: 'Medical record created successfully',
            patient: savedPatient,
            links: [
                { rel: 'self', method: 'POST', href: `/api/v1/patients` },
                { rel: 'get', method: 'GET', href: `/api/v1/patients/${savedPatient.cedula}` },
            ],
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
