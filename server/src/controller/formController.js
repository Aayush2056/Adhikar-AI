import { validateAndGetSchema, processInterviewTurn } from '../agents/formAgent.js';

// In-memory session store (Session tracking)
const activeSessions = {};

export const startInterview = async (req, res) => {
  try {
    const { formName } = req.body;
    if (!formName) return res.status(400).json({ error: "Form name is required" });

    // Step 1: Validate form name and filter greetings
    const validationResult = await validateAndGetSchema(formName);

    if (!validationResult.exists) {
      return res.json({ success: false, reply: validationResult.message });
    }

    const sessionId = Date.now().toString();

    // Store active session details
    activeSessions[sessionId] = {
      formName: validationResult.formTitle,
      requiredFields: validationResult.fields,
      collectedData: {},
      currentIndex: 0
    };

    const firstField = validationResult.fields[0];
    res.json({
      success: true,
      sessionId,
      reply: `Theek hai, hum "${validationResult.formTitle}" bharenge. Sabse pehle, kripya apna **${firstField.label}** batayein.`
    });

  } catch (error) {
    console.error("Error starting form interview:", error);
    res.status(500).json({ error: "Failed to start form interview" });
  }
};

export const continueInterview = async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    const session = activeSessions[sessionId];

    if (!session) return res.status(404).json({ error: "Session expired or invalid" });

    const currentField = session.requiredFields[session.currentIndex];

    // Step 2: Process turn through AI agent with context & validation
    const aiResult = await processInterviewTurn(
      session.formName,
      session.requiredFields,
      session.collectedData,
      currentField,
      message
    );

    session.collectedData = aiResult.updatedData;

    // Check if interview is complete
    if (aiResult.isComplete) {
      delete activeSessions[sessionId]; // Clear session on completion
      return res.json({
        reply: aiResult.reply,
        isComplete: true,
        finalTemplate: aiResult.finalTemplate,
        collectedData: session.collectedData
      });
    }

    // If answer was valid, advance to the next field index
    if (aiResult.isAnswerValid) {
      const nextIndex = session.requiredFields.findIndex(f => f.key === aiResult.nextFieldKey);
      if (nextIndex !== -1) {
        session.currentIndex = nextIndex;
      } else {
        session.currentIndex++;
      }
    }

    res.json({
      reply: aiResult.reply,
      isComplete: false
    });

  } catch (error) {
    console.error("Error continuing form interview:", error);
    res.status(500).json({ error: "Failed to process interview step" });
  }
};