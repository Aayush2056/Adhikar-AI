import { useState } from "react";
import "../style/RTIAssistant.css";
import jsPDF from "jspdf";
import axios from "axios";
const API_URL = "http://localhost:3000/api/rti/chat";

function RTIAssistant() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState(null);

  // Current question ko parameter ke taur par pass kiya taaki state delay ki problem na aaye
 const sendQuestion = async (textToSend) => {
    const query = textToSend || question;
    if (!query.trim() || loading) return;

    const userMessage = { role: "user", content: query };
    const newMessages = [...messages, userMessage]; // Yahan nayi array ban gayi
    
    setMessages(newMessages);
    setQuestion("");
    setLoading(true);

    try {
      // FIX: Yahan 'messages' ki jagah 'newMessages' pass karein taaki naya message bhi AI ke paas jaye
      const response = await axios.post(API_URL, {
        message: query,
        conversation: newMessages.map(m => ({ role: m.role, content: m.content }))
      });

      const data = response.data; 
      
      // Assistant ka response bhi messages me add karein
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      
      if (data.draft) {
        setDraft(data.draft);
      }

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
      sendQuestion(question); // Current input ki value pass kar rahe hain
    }
  };

  const startExample = () => {
    const exampleText = "How much was spent on road construction?";
    setQuestion(exampleText);
    sendQuestion(exampleText); // Example click hote hi direct request bhejega
  };

  return (

   
    <div className={`rti-container ${messages.length > 0 ? "chat-active" : "center-active"}`}>

      {messages.length === 0 && (
        <div className="welcome-section">
          <div className="rti-icon-box">⚖</div>
          <h2>Draft a Formal RTI Application</h2>
          <p>Describe your question in your own words. You don't need to know legal terminology.</p>
          
          <button className="example-box" onClick={startExample}>
            <span className="example-title">Try an example</span>
            <p>"How much was spent on road construction?"</p>
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
          {loading && <div className="message-bubble assistant">Thinking...</div>}
        </div>
      )}

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
            onClick={() => sendQuestion(question)} // Button click par bhi safe value bhej rahe hain
            disabled={!question.trim() || loading}
          >
            {loading ? "Sending..." : "Send →"}
          </button>
        </div>
      </div>
{draft && (
  <div className="draft-section-box">
    <h3>Your RTI Application Draft</h3>
    
    {/* Draft preview area */}
    <pre style={{ whiteSpace: 'pre-wrap', background: '#eee', padding: '10px' }}>
      {typeof draft === 'string' ? draft : JSON.stringify(draft, null, 2)}
    </pre>

    {/* Buttons section */}
    <div className="draft-actions">
      <button onClick={() => {
        // PDF Generate karne ka logic
        const doc = new jsPDF();
        const text = typeof draft === 'string' ? draft : JSON.stringify(draft, null, 2);
        
        // Font size aur text wrapping setup
        doc.setFontSize(12);
        const lines = doc.splitTextToSize(text, 180); // 180mm width ke andar wrap karega
        doc.text(lines, 10, 20);
        
        // Download trigger
        doc.save("RTI_Application.pdf");
      }}>
        📥 Download as PDF
      </button>

      <button onClick={() => {
        const textToCopy = typeof draft === 'string' ? draft : JSON.stringify(draft, null, 2);
        navigator.clipboard.writeText(textToCopy);
        alert("Draft copied to clipboard!");
      }}>
        📋 Copy Draft
      </button>
    </div>
  </div>
)}

    </div>
  );
}

export default RTIAssistant;