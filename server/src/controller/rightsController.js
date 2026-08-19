import { runRightsAgent } from '../agents/rightsAgent.js'; // Aapke agent ka path

export const getRightsAdvice = async (req, res) => {
  try {
    const { category, query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    // Agent function call karein
    const advice = await runRightsAgent({ category, query });

    res.status(200).json({ advice });
  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};