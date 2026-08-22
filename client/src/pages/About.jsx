import React from "react";
import "../style/About.css"; // Optional: link your stylesheet here

function About() {
  return (
    <div className="about-container">
      <div className="about-hero">
        <div className="about-icon-box">⚖</div>
        <h1>About Adhikaar-AI</h1>
        <p className="about-subtitle">
          Empowering citizens by simplifying the Right to Information (RTI) process using artificial intelligence.
        </p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>Our Mission</h2>
          <p>
            Filing an RTI application can often be intimidating due to complex legal terminology, rigid formats, and bureaucratic procedures. 
            <strong> Adhikaar-AI</strong> bridges this gap by acting as your personal legal companion. We help everyday citizens draft, structure, and understand their RTI queries in simple, conversational language.
          </p>
        </section>

        <section className="about-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>💬 Conversational Guidance</h3>
              <p>Just describe what information you need in your own words. No prior legal knowledge required.</p>
            </div>
            <div className="feature-card">
              <h3>📝 Automated Drafting</h3>
              <p>Our intelligent AI agents generate a formal, legally structured RTI application draft instantly.</p>
            </div>
            <div className="feature-card">
              <h3>🖨️ Easy Export</h3>
              <p>Review your generated draft, make adjustments, and print or save it as a PDF with a single click.</p>
            </div>
          </div>
        </section>

        <section className="about-section vision-section">
          <h2>Why Adhikaar?</h2>
          <p>
            "Adhikaar" means rights. Transparency and accountability are the pillars of a strong democracy. By making the RTI mechanism accessible to everyone, we aim to encourage civic participation and ensure public information is within everyone's reach.
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;