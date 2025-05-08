import express from "express";
import { createPayment, verifyPayment } from "../controller/payment.js";
import { auth, isDoctor } from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/create-payment", auth, isDoctor, createPayment);
router.post("/verify-payment", verifyPayment); // No auth needed, called by Razorpay webhook

const paymentRoutes =  router

export default paymentRoutes;