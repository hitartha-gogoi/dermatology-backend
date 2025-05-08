import Patient from "../models/patient.js";
import mongoose from "mongoose";
import Report from "../models/report.js";
import { uploadImageToCloudinary } from "../utils/image-uploader.js";
import editImage from "../utils/edit-image.js";
import fs from "fs";

// ✅ Get all patients with paymentStatus: "completed"
export const getAllCompletedPayments = async (req, res) => {
    try {
        const patients = await Patient.find({ paymentStatus: "completed" });

        res.status(200).json({
            success: true,
            message: "Patients with completed payments fetched successfully.",
            data: patients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching patients with completed payments.",
            error: error.message
        });
    }
};

// ✅ Get patients with paymentStatus: "completed" and status: "pending"
export const getCompletedPaymentsPendingStatus = async (req, res) => {
    try {
        const patients = await Patient.find({ paymentStatus: "completed", status: "pending" });

        res.status(200).json({
            success: true,
            message: "Patients with completed payments and pending status fetched successfully.",
            data: patients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching patients with completed payments and pending status.",
            error: error.message
        });
    }
};

// ✅ Get patients with paymentStatus: "completed" and status: "done"
export const getCompletedPaymentsDoneStatus = async (req, res) => {
    try {
        const patients = await Patient.find({ paymentStatus: "completed", status: "done" });

        res.status(200).json({
            success: true,
            message: "Patients with completed payments and done status fetched successfully.",
            data: patients
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching patients with completed payments and done status.",
            error: error.message
        });
    }
};

// ✅ Admin - Get Patient Details by patientId
export const getPatientDetailsAdmin = async (req, res) => {
    try {
        const { patientId } = req.params; // Get patient ID from URL params

        if (!patientId) {
            return res.status(404).json({
                success: false,
                message: "PatientId not passed as parameter.",
            });
        }

        // ✅ Convert patientId to ObjectId
        const objectIdPatientId = new mongoose.Types.ObjectId(patientId);

        // ✅ Fetch patient details (No doctor filter since admin has access to all)
        const patient = await Patient.findOne({ _id: objectIdPatientId });

        if (!patient) {
            return res.status(404).json({
                success: false,
                message: "Patient not found.",
            });
        }

        // ✅ If status is "done", fetch the corresponding report
        let report = null;
        if (patient.status === "done") {
            report = await Report.findOne({ patient: objectIdPatientId });
        }

        return res.status(200).json({
            success: true,
            message: report ? "Patient details with report fetched successfully." : "Patient details fetched successfully.",
            data: { patient, report },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching patient details.",
            error: error.message,
        });
    }
};

export const generateReport = async (req, res) => {
    try {
        const { patientId } = req.params;
        const { dermoscopeFindings, clinicalImpression, digitalSignature } = req.body;
        const { editedNakedEyePhoto, editedDermoscopePhoto } = req.files; // Get edited images from frontend

        console.log("Received Files:", req.files);

        if (!patientId || !dermoscopeFindings || !dermoscopeFindings) {
            return res.status(400).json({ success: false, message: "Please fill all details to generate the report" });
            }


        if (!req.files || !req.files.editedNakedEyePhoto || !req.files.editedDermoscopePhoto) {
            return res.status(400).json({ success: false, message: "Missing required image files." });
            }


        // Convert patientId to ObjectId
        const objectIdPatientId = new mongoose.Types.ObjectId(patientId);

        // ✅ Fetch patient details
        const patient = await Patient.findById(objectIdPatientId);
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found." });
        }

        // ✅ Ensure payment is completed before report generation
        if (patient.paymentStatus !== "completed") {
            return res.status(400).json({ success: false, message: "Payment not completed." });
        }

        // ✅ Upload edited images to Cloudinary
        const uploadedNakedEye = await uploadImageToCloudinary(editedNakedEyePhoto, "reports");
        const uploadedDermoscope = await uploadImageToCloudinary(editedDermoscopePhoto, "reports");


        // ✅ Create Report Entry
        const newReport = new Report({
            doctor: patient.doctor,
            patient: objectIdPatientId,
            dermoscopeFindings,
            clinicalImpression,
            editedNakedEyePhoto: uploadedNakedEye.secure_url,
            editedDermoscopePhoto: uploadedDermoscope.secure_url,
            digitalSignature,
            reportStatus: "completed"
        });

        await newReport.save();
        // ✅ Update Patient Status to "done"
        patient.status = "done";
        await patient.save();

        return res.status(201).json({
            success: true,
            message: "Report generated successfully.",
            data: newReport,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error generating report.",
            error: error.message,
        });
    }
};

export const getAllReports = async (req, res) => {
    try {
        const reports = await Report.find().populate("patient doctor", "firstname lastname age gender");

        if (!reports || reports.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No reports found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Reports fetched successfully.",
            data: reports,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching reports.",
            error: error.message,
        });
    }
};

export const getReportById = async (req, res) => {
    try {
        const { reportId } = req.params;

        if (!reportId) {
            return res.status(404).json({
                success: false,
                message: "ReportId not found.",
            });
        }

        const report = await Report.findById(reportId).populate("patient doctor", "firstname lastname age gender");

        if (!report) {
            return res.status(404).json({
                success: false,
                message: "Report not found.",
            });
        }

        res.status(200).json({
            success: true,
            message: "Report fetched successfully.",
            data: report,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching report.",
            error: error.message,
        });
    }
};