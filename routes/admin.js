import express from 'express';
import {
  getAllCompletedPayments,
  getCompletedPaymentsDoneStatus,
  getCompletedPaymentsPendingStatus,
  getPatientDetailsAdmin,
  generateReport,
  getAllReports,
  getReportById
} from '../controller/admin.js';
import { auth, isAdmin } from '../middlewares/authenticate.js';

const router = express.Router();

// Admin payment routes
router.get("/admin-all", auth, isAdmin, getAllCompletedPayments);
router.get("/admin-done", auth, isAdmin, getCompletedPaymentsDoneStatus);
router.get("/admin-pending", auth, isAdmin, getCompletedPaymentsPendingStatus);

// Admin patient routes
router.get("/admin-patient-details/:patientId", auth, isAdmin, getPatientDetailsAdmin);

// Admin report routes
router.post("/admin-generate-report/:patientId", auth, isAdmin, generateReport);
router.get("/admin-all-reports", auth, isAdmin, getAllReports);
router.get("/admin-report/:reportId", auth, isAdmin, getReportById);

const adminRoutes = router;

export default adminRoutes;