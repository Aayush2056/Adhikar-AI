import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config()
import rtiRoutes from "./src/routes/rtiRoutes.js"
import rightsRoutes from "./src/routes/rightsRoutes.js"
<<<<<<< HEAD
import schemeRoutes from "./src/routes/schemeRoutes.js"

dotenv.config();
=======
import formRoutes from "./src/routes/formRoutes.js"
>>>>>>> upstream/main

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/rti", rtiRoutes);
app.use("/api/rights", rightsRoutes);
<<<<<<< HEAD
app.use("/api/schemes", schemeRoutes);

=======
app.use("/api/form",formRoutes)
>>>>>>> upstream/main

app.get("/", (req, res) => {
  res.json({
    message: "CivicAI Backend is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});