import express from "express";
import db from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import router from "./routes/index.js";

const app = express();

// CORS
app.use(cors());

// Cookie parser
app.use(cookieParser());

// Form parser
app.use(express.json());

// Routes setup
app.use("/", router);

// Error middleware
app.use(errorMiddleware);

// Server listens on specified PORT
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(
    `Server is up and listening on PORT: ${PORT || 8000}.`
  );
});
