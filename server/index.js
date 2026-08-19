import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config()
import rtiRoutes from "./src/routes/rtiRoutes.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/rti", rtiRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "CivicAI Backend is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});