import { runSchemeAgent } from "../agents/schemeAgent.js";

export const chatWithSchemeAgent = async (req, res) => {
  try {
    const { message, conversation = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required",
      });
    }

    const result = await runSchemeAgent({
      message,
      conversation,
    });

    res.status(200).json({
      success: true,
      reply: result,
    });
  } catch (error) {
    console.error("Scheme Controller Error:", error);

    res.status(500).json({
      message: error.message || "Internal Server Error",
    });
  }
};