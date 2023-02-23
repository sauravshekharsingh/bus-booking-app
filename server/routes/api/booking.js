import express from "express";
import {
  search,
  create,
  cancel,
  getUserBookings,
  getBusBookings,
} from "../../controllers/api/booking.js";
import verifyAdmin from "../../middlewares/verifyAdmin.js";
import verifyUser from "../../middlewares/verifyUser.js";

const router = express.Router();

router.post("/search", verifyUser, search);
router.post("/create", verifyUser, create);
router.patch("/cancel/:bookingId", verifyUser, cancel);
router.get("/user/:userId", verifyUser, getUserBookings);

router.get("/bus/:busId", verifyAdmin, getBusBookings);

export default router;
