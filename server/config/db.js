import mongoose from "mongoose";
const { connect, connection, set } = mongoose;
import dotenv from "dotenv";

dotenv.config();

set("strictQuery", false);

connect(process.env.MONGO_URL, {})
  .then(() => console.log(`Connected to MongoDB database.`))
  .catch((error) => console.log(`${error} did not connect`));

const db = connection;

export default db;
