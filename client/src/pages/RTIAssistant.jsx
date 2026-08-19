import { useState } from "react";
import "../style/RTIAssistant.css";
import axios from "axios"
const API_URL = "http://localhost:3000/api/rti/chat";

function RTIAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(null);

const sendQuestion = async () => {
    if (!question.trim() || loading) return;

    const userMessage = { role: "user", content: question };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setQuestion("");
    setLoading(true);

    try {
      // Axios ke sath API call
      const response = await axios.post(API_URL, {
        message: question,
        conversation: messages.map(m => ({ role: m.role, content: m.content }))
      });

      // Axios me data seedha `response.data` me mil jata hai
      const data = response.data; 
      
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      if (data.draft) setDraft(data.draft);

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
      sendQuestion();
    }
  };

  const startExample = () => {
    setQuestion("How much was spent on road construction?");
  };

  return (
    <div className={`rti-container ${messages.length > 0 ? "chat-active" : "center-active"}`}>
      
      {/* Jab koi message na ho toh Center me Heading aur Input dikhega */}
      {messages.length === 0 && (
        <div className="welcome-section">
          <div className="rti-icon-box">⚖</div>
          <h2>What information do you need?</h2>
          <p>Describe your question in your own words. You don't need to know legal terminology.</p>
          
          <button className="example-box" onClick={startExample}>
            <span className="example-title">Try an example</span>
            <p>"How much was spent on road construction?"</p>
          </button>
        </div>
      )}

      {/* Chat Messages List (Jab chat start ho jaye) */}
      {messages.length > 0 && (
        <div className="chat-stream">
          {messages.map((msg, i) => (
            <div key={i} className={`message-bubble ${msg.role}`}>
              <div className="bubble-content">{msg.content}</div>
            </div>
          ))}
          {loading && <div className="message-bubble assistant">Thinking...</div>}
        </div>
      )}

      {/* Main Input Box (Yeh wahi same theme rakhega jo screenshot me hai) */}
      <div className="rti-input-card">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe what information you want..."
          rows="3"
          disabled={loading}
        />
        <div className="input-footer">
          <span className="hint-text">Press Enter to send</span>
          <button 
            className="send-button" 
            onClick={sendQuestion} 
            disabled={!question.trim() || loading}
          >
            {loading ? "Sending..." : "Send →"}
          </button>
        </div>
      </div>

      {/* Generated Draft Section */}
      {draft && (
        <div className="draft-section-box">
          <h3>Your RTI Application Draft</h3>
          <pre>{typeof draft === 'string' ? draft : JSON.stringify(draft, null, 2)}</pre>
          <button onClick={() => window.print()}>Print / Save PDF</button>
        </div>
      )}

    </div>
  );
}

export default RTIAssistant;