import { Router } from "express";
const router = Router();

import apiRouter from "./api/index.js";

router.get("/", (req, res) => {
  return res.send("Server is up and running");
});

router.use("/api", apiRouter);

export default router;
