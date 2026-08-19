import { Link } from "react-router-dom";
import "../style/Home.css";

function Home() {
  return (
    <div className="home">

      {/* Hero Section */}
      <section className="hero">

        <div className="hero-content">

          <div className="badge">
            🇮🇳 AI for Citizen Rights
          </div>

          <h1>
            Know Your Rights.
            <br />
            <span>Take Action.</span>
          </h1>

          <p>
            Understand your legal and civic rights
            in simple language.
          </p>

          <Link to="/rights" className="hero-btn">
            Find My Rights →
          </Link>

        </div>


        {/* AI Preview Card */}
        <div className="hero-card">

          <div className="card-top">
            <span className="dot"></span>
            CivicAI Assistant
          </div>

          <div className="question">
            My landlord hasn't returned my deposit.
          </div>

          <div className="answer">

            <strong>You may have legal options.</strong>

            <p>
              Let's understand your rights
              and what you can do next.
            </p>

            <div>✓ Understand your rights</div>
            <div>✓ Know the next steps</div>

          </div>

        </div>

      </section>


      {/* Services */}
      <section className="services">

        <div className="section-title">
          <span>WHAT CAN WE HELP WITH?</span>

          <h2>
            Your problem.
            <span> Our guidance.</span>
          </h2>
        </div>


        <div className="service-grid">

          {/* Rights Navigator */}
          <Link to="/rights" className="service-card">

            <div className="service-icon blue">
              ⚖️
            </div>

            <div>
              <h3>Rights Navigator</h3>

              <p>
                Understand your rights and
                discover what to do next.
              </p>

              <span>
                Explore Rights →
              </span>
            </div>

          </Link>


          {/* RTI Assistant */}
          <Link to="/rti" className="service-card">

            <div className="service-icon orange">
              📄
            </div>

            <div>
              <h3>RTI Assistant</h3>

              <p>
                Turn your question into a
                clear RTI application.
              </p>

              <span>
                Draft an RTI →
              </span>
            </div>

          </Link>

        </div>

      </section>


      {/* Bottom CTA */}
      <section className="bottom-cta">

        <h2>
          Don't let bureaucracy
          <span> stop you.</span>
        </h2>

        <p>
          Start with your problem.
        </p>

        <Link to="/rights">
          Get Started →
        </Link>

      </section>

    </div>
  );
}

export default Home;