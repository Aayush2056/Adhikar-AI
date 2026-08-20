import { useState } from "react";
import "../style/SchemeAssistant.css";
import axios from "axios";

const API_URL = "http://localhost:3000/api/schemes/chat";

function SchemeAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendQuestion = async (textToSend) => {
    const query = textToSend || question;
    if (!query.trim() || loading) return;

    const userMessage = { role: "user", content: query };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setQuestion("");
    setLoading(true);

    try {
      const response = await axios.post(API_URL, {
        message: query,
        conversation: newMessages.map(m => ({ role: m.role, content: m.content }))
      });

      const data = response.data; 
      
      // Assistant ka response add karein (handling string or object reply safely)
      const replyText = typeof data.reply === 'string' ? data.reply : (data.reply || data.message || "No response received.");
      setMessages((prev) => [...prev, { role: "assistant", content: replyText }]);

    } catch (error) {
      console.error("Axios Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, could not connect to server." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendQuestion(question);
    }
  };

  const startExample = () => {
    const exampleText = "Hello, mujhe apne liye government schemes ke baare mein janna hai.";
    setQuestion(exampleText);
    sendQuestion(exampleText);
  };

  return (
    <div className={`scheme-container ${messages.length > 0 ? "chat-active" : "center-active"}`}>

      {messages.length === 0 && (
        <div className="welcome-section">
          <div className="scheme-icon-box">🏛️</div>
          <h2>Find Government Schemes</h2>
          <p>Discover central and state government schemes tailored to your age, profession, and state.</p>
          
          <button className="example-box" onClick={startExample}>
            <span className="example-title">Try an example</span>
            <p>"Hello, mujhe apne liye government schemes ke baare mein janna hai."</p>
          </button>
        </div>
      )}

      {messages.length > 0 && (
        <div className="chat-stream">
          {messages.map((msg, i) => (
            <div key={i} className={`message-bubble ${msg.role}`}>
              <div className="bubble-content">{msg.content}</div>
            </div>
          ))}
          {loading && <div className="message-bubble assistant">Finding schemes for you...</div>}
        </div>
      )}

      <div className="scheme-input-card">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here (e.g. name, state, age)..."
          rows="3"
          disabled={loading}
        />
        <div className="input-footer">
          <span className="hint-text">Press Enter to send</span>
          <button 
            className="send-button" 
            onClick={() => sendQuestion(question)}
            disabled={!question.trim() || loading}
          >
            {loading ? "Sending..." : "Send →"}
          </button>
        </div>
      </div>

    </div>
  );
}

export default SchemeAssistant;