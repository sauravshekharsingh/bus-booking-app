import express from "express";
import {
  getBuses,
  addBus,
  removeBus,
  addReview,
  getReview,
} from "../../controllers/api/bus.js";
import verifyAdmin from "../../middlewares/verifyAdmin.js";
import verifyUser from "../../middlewares/verifyUser.js";

const router = express.Router();

router.get("/", verifyAdmin, getBuses);
router.post("/add", verifyAdmin, addBus);
router.delete("/remove/:busId", verifyAdmin, removeBus);

router.post("/review/add/:busId", verifyUser, addReview);
router.get("/review/:busId", verifyAdmin, getReview);

export default router;
