import './Next_page.css'

import React from "react";

const AboutUsSection: React.FC = () => {
  const handleNextPage = () => {
    // Navigate to next page
    console.log("Next page clicked");
  };

  return (
    <>
      <section className="about-section">
        {/* Top label */}
        <div className="about-section__top">
          <p className="about-section__label">
            Keep Scrolling<br />To Learn More
          </p>
        </div>

        {/* Middle: title + next page */}
        <div className="about-section__middle">
          <h2 className="about-section__title">ABOUT US</h2>
          <button className="about-section__next" onClick={handleNextPage}>
            <span>Next Page</span>
            <span className="about-section__next-line" />
            <span className="about-section__next-arrow">→</span>
          </button>
        </div>

        {/* Bottom: plus markers */}
        <div className="about-section__bottom">
          {[0, 1, 2, 3, 4].map((i) => (
            <button key={i} className="about-section__plus" aria-label="expand section">
              +
            </button>
          ))}
        </div>
      </section>
    </>
  );
};

export default AboutUsSection;
