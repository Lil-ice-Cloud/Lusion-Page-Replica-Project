import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="header">
      <div className="header__logo">
        LUSION
      </div>
      
      <div className="header__actions">
        <button className="circle-btn" aria-label="Minimize">
          <span style={{ fontSize: '1.2rem', letterSpacing: '-0.1em' }}>−−</span>
        </button>
        
        <button className="talk-btn">
          <span className="btn-arrow">
            <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 6H22M22 6L17 1M22 6L17 11" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </span>
          <span className="btn-text">LET&apos;S TALK</span>
          <span className="dot"></span>
        </button>
        
        <button className="menu-btn">
          MENU 
          <div className="dots-container">
            <span className="menu-dot"></span>
            <span className="menu-dot"></span>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
