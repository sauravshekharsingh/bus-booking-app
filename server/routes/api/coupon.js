import express from "express";
import { verifyCoupon } from "../../controllers/api/coupon.js";
import verifyUser from "../../middlewares/verifyUser.js";

const router = express.Router();

router.post("/", verifyUser, verifyCoupon);

export default router;
