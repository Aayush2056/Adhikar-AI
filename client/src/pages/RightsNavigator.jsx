import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import "../style/RightsNavigator.css"

function RightsNavigator() {
  const [category, setCategory] = useState("tenant");
  const [query, setQuery] = useState("");
  
  // Ab hum 'history' ya 'items' ko array banayenge taaki saare purane responses save rahein
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);

  // Naye message ya response par scroll karne ke liye ref
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, loading]);

  const handleResolve = async () => {
    if (!query.trim()) return;
    
    const userQuery = query;
    const selectedCategory = category;
    
    setQuery(""); // Input box turant clear kar do
    setLoading(true);

    // Pehle user ka sawal aur ek temporary loading/empty response add kar do
    const newItem = {
      category: selectedCategory,
      query: userQuery,
      advice: "Analyzing your rights...",
      loading: true
    };

    setConversation(prev => [...prev, newItem]);

    try {
      const res = await axios.post("http://localhost:3000/api/rights/", {
        category: selectedCategory,
        query: userQuery
      });

      // Jaise hi API se response aaye, us specific item ka advice update kar do
      setConversation(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          category: selectedCategory,
          query: userQuery,
          advice: res.data.advice,
          loading: false
        };
        return updated;
      });

    } catch (error) {
      console.error(error);
      setConversation(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          category: selectedCategory,
          query: userQuery,
          advice: "Kuch gadbad ho gayi, kripya dobara koshish karein.",
          loading: false
        };
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rights-container">
      <h2>⚖️ Rights Navigator</h2>
      <p>Apni samasya batayein aur jaanein ki aapke paas kya kanooni vikalp hain.</p>

      {/* Purane aur naye saare conversations yahan ek-ek karke dikhenge */}
      <div className="history-container">
        {conversation.map((item, index) => (
          <div key={index} className="qa-card">
            <div className="user-query-badge">
              <span><b>Category:</b> {item.category.toUpperCase()}</span>
              <p><b>Aapka Sawaal:</b> {item.query}</p>
            </div>
            <div className="advice-box">
              <h3>Aapke Liye Salah & Steps:</h3>
              <pre>{item.advice}</pre>
            </div>
          </div>
        ))}
      </div>

      {/* Scroll target */}
      <div ref={bottomRef} />

      {/* Input Form Section (Niche fixed ya flow me rahega) */}
      <div className="input-section">
        <select value={category} onChange={(e) => setCategory(e.target.value)} disabled={loading}>
          <option value="tenant">Tenant/Property Dispute (Kirayedaar Vivad)</option>
          <option value="consumer">Consumer Dispute (Grahak Shikayat)</option>
          <option value="workplace">Workplace Dispute (Karyalay Vivad)</option>
        </select>

        <textarea 
          rows="3" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Apni samasya yahan vistar se likhein..."
          disabled={loading}
        />

        <button onClick={handleResolve} disabled={loading}>
          {loading ? "Analyzing your rights..." : "Get Actionable Steps"}
        </button>
      </div>
    </div>
  );
}

export default RightsNavigator;