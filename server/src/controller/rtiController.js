import { runRTIAgent } from "../agents/rtiAgent.js";

export const chatWithRTIAgent = async (req, res) => {
  try {
    const { message, conversation = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const result = await runRTIAgent({
      message,
      conversation,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("RTI Controller Error:", error);

  res.status(500).json({
    message: error.message,
  });
  }
};