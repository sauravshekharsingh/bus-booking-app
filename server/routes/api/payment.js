import express from "express";
import { createPayment } from "../../controllers/api/payment.js";
import verifyUser from "../../middlewares/verifyUser.js";

const router = express.Router();

router.post("/create", verifyUser, createPayment);

export default router;
