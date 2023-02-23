import express from "express";
import authRouter from "./auth.js";
import busRouter from "./bus.js";
import bookingRouter from "./booking.js";
import couponRouter from "./coupon.js";
import paymentRouter from "./payment.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/bus", busRouter);
router.use("/booking", bookingRouter);
router.use("/coupon", couponRouter);
router.use("/payment", paymentRouter);

export default router;
