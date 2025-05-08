import express from 'express';
import {
  createPatient,
  getAllPatients,
  getPendingPatients,
  getDonePatients,
  getPatientDetails
} from '../controller/patient.js';
import { auth, isDoctor } from '../middlewares/authenticate.js';

const router = express.Router();

// Patient CRUD Routes (Doctor Access Only)
router.post('/', auth, isDoctor, createPatient);              // Create patient
router.get('/', auth, isDoctor, getAllPatients);              // Get all patients
router.get('/pending', auth, isDoctor, getPendingPatients);   // Get pending patients
router.get('/completed', auth, isDoctor, getDonePatients);    // Get completed cases
router.get('/:patientId', auth, isDoctor, getPatientDetails); // Get patient details

const patientRoutes = router;

export default patientRoutes;