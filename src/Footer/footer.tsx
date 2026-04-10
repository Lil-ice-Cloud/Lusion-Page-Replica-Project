import React, { useState } from "react";
import './footer.css'

const Footer: React.FC = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = () => {
    if (email) {
      console.log("Subscribed:", email);
      setEmail("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubscribe();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>

      <footer className="lusion-footer">
        <div className="lusion-footer-grid">

          {/* Column 1 – Address */}
          <address className="lusion-address" style={{ fontStyle: "normal" }}>
            Suite 2<br />
            9 Marsh Street<br />
            Bristol, BS1 4AA<br />
            United Kingdom
          </address>

          {/* Column 2 – Socials & Contacts */}
          <div className="lusion-col2">
            <nav className="lusion-links">
              <a href="https://twitter.com/lusion" target="_blank" rel="noopener noreferrer">Twitter / X</a>
              <a href="https://instagram.com/lusion" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://linkedin.com/company/lusion" target="_blank" rel="noopener noreferrer">Linkedin</a>
            </nav>

            <div className="lusion-contact-group">
              <span className="lusion-contact-label">General enquires</span>
              <a className="lusion-contact-email" href="mailto:hello@lusion.co">hello@lusion.co</a>
            </div>

            <div className="lusion-contact-group">
              <span className="lusion-contact-label">New business</span>
              <a className="lusion-contact-email" href="mailto:business@lusion.co">business@lusion.co</a>
            </div>
          </div>

          {/* Column 3 – Newsletter */}
          <div className="lusion-newsletter">
            <h2 className="lusion-newsletter-heading">
              Subscribe to<br />our newsletter
            </h2>
            <div className="lusion-input-wrap">
              <input
                className="lusion-input"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button className="lusion-submit-btn" onClick={handleSubscribe} aria-label="Subscribe">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="lusion-bottom">
          <span>©2026 LUSION Creative Studio</span>
          <span>
            R&D: <a href="https://labs.lusion.co" target="_blank" rel="noopener noreferrer">labs.lusion.co</a>
          </span>
          <div className="lusion-built">
            <span>Built by Lusion with</span>
            <span className="lusion-heart">♥</span>
          </div>
        </div>

        {/* Scroll to top */}
        <button className="lusion-scroll-top" onClick={scrollToTop} aria-label="Scroll to top">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
        </button>
      </footer>
    </>
  );
};

export default Footer;
