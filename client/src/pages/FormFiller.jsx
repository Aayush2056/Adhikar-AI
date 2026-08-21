import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import '../style/FormFiller.css'; // Apne path ke mutabiq CSS import karein

function FormFiller() {
  const [formInput, setFormInput] = useState("");
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]); // Chat history [{ sender: 'ai'/'user', text: '' }]
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [finalTemplate, setFinalTemplate] = useState("");

  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Step 1: Start Interview (Form Name submit karne par)
  const handleStartInterview = async (e) => {
    e.preventDefault();
    if (!formInput.trim()) return;

    const requestedForm = formInput;
    setFormInput("");
    setLoading(true);

    // User ka message history me add karo
    setMessages(prev => [...prev, { sender: 'user', text: requestedForm }]);

    try {
      console.log("hlw");
      const res = await axios.post("http://localhost:3000/api/form/start", {
        formName: requestedForm
      });

      if (res.data.success) {
        setSessionId(res.data.sessionId);
        setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
      } else {
        // Agar AI ne kaha ki form valid nahi hai (jaise "hlw" par)
        setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);
      }
    } catch (error) {
      console.error("Start Error:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: "Server error ho gaya. Kripya dobara koshish karein." }]);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Continue Interview (Chat answers dene par)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim() || !sessionId) return;

    const currentAnswer = userInput;
    setUserInput("");
    setLoading(true);

    // User ka answer chat me dikhao
    setMessages(prev => [...prev, { sender: 'user', text: currentAnswer }]);

    try {
      const res = await axios.post("http://localhost:3000/api/form/continue", {
        sessionId,
        message: currentAnswer
      });

      setMessages(prev => [...prev, { sender: 'ai', text: res.data.reply }]);

      if (res.data.isComplete) {
        setIsCompleted(true);
        setFinalTemplate(res.data.finalTemplate);
      }

    } catch (error) {
      console.error("Continue Error:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: "Kuch gadbad ho gayi, kripya apna jawab dobara bhejein." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-filler-container">
      <h2>📝 Conversational Form-Filler</h2>
      <p>Sarkari ya legal form ka naam batayein aur AI ke sath baat karke use aasaani se bharein.</p>

      {/* Chat Messages Window */}
      <div className="chat-window">
        {messages.length === 0 && (
          <div className="welcome-prompt">
            <p>Shuru karne ke liye niche form ka naam likhein (Jaise: <b>Income Certificate</b> ya <b>Ration Card</b>).</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`chat-bubble ${msg.sender}`}>
            <span className="sender-label">{msg.sender === 'ai' ? '🤖 AI Assistant' : '👤 Aap'}</span>
            <p>{msg.text}</p>
          </div>
        ))}

        {loading && <div className="chat-bubble ai typing"><i>AI soch raha hai...</i></div>}
        <div ref={chatEndRef} />
      </div>

      {/* Completed Form Template Preview */}
      {isCompleted && (
        <div className="template-preview-box">
          <h3>🎉 Aapka Form Tayar Hai!</h3>
          <pre>{finalTemplate}</pre>
        </div>
      )}

      {/* Input Section */}
      {!isCompleted && (
        <div className="form-input-section">
          {!sessionId ? (
            /* Form Name Input Form */
            <form onSubmit={handleStartInterview} className="input-row">
              <input 
                type="text" 
                value={formInput} 
                onChange={(e) => setFormInput(e.target.value)} 
                placeholder="Form ka naam likhein (jaise: Income Certificate)..."
                disabled={loading}
              />
              <button type="submit" disabled={loading}>Start Interview</button>
            </form>
          ) : (
            /* Interview Chat Input Form */
            <form onSubmit={handleSendMessage} className="input-row">
              <input 
                type="text" 
                value={userInput} 
                onChange={(e) => setUserInput(e.target.value)} 
                placeholder="Apna jawab ya sawaal yahan likhein..."
                disabled={loading}
              />
              <button type="submit" disabled={loading}>Send</button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

export default FormFiller;