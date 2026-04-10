import HomeHeroVisual from "./Animetion/Home-hero/home_hero_visual";
import "./App.css";
import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        } else {
          entry.target.classList.remove('is-visible');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(el => observer.observe(el));

    return () => {
      revealElements.forEach(el => observer.unobserve(el));
    };
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero__tagline">
          We create 3D visual storytelling<br />
          and interactive web experiences<br />
          that help brands stand out
        </div>

        <div className="hero__container">
          <div className="hero__visual">
            <div className="hero__visual-frame">
              <HomeHeroVisual />
            </div>
          </div>
        </div>

        <div className="hero__footer">
          <div className="hero__footer-left">
            <span>+</span>
            <span>+</span>
          </div>
          <div className="hero__footer-center">SCROLL TO EXPLORE</div>
          <div className="hero__footer-right">
            <span>+</span>
            <span>+</span>
          </div>
        </div>
      </section>

      <section className="featured-work">
        <h2 className="featured-work__title reveal-on-scroll">Featured Work</h2>
        <p className="featured-work__description reveal-on-scroll">
          A selection of immersive digital experiences created for ambitious brands and forward thinking teams.
        </p>
      </section>

      <section className="featured-work__grid">
        <div className="featured-work__item reveal-on-scroll">
          <div className="featured-work__image-wrapper">
            <div className="featured-work__image-placeholder" style={{ backgroundColor: '#ccc' }}></div>
          </div>
          <div className="featured-work__item-info">
            <p className="featured-work__item-tags">CONCEPT • WEB • DESIGN • DEVELOPMENT • 3D • ANIMATION</p>
            <h3 className="featured-work__item-title">
              <svg className="featured-work__item-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Oryzo AI
            </h3>
          </div>
        </div>
        <div className="featured-work__item reveal-on-scroll">
          <div className="featured-work__image-wrapper">
            <div className="featured-work__image-placeholder" style={{ backgroundColor: '#222' }}></div>
          </div>
          <div className="featured-work__item-info">
            <p className="featured-work__item-tags">WEB • DESIGN • DEVELOPMENT • 3D • ANIMATION</p>
            <h3 className="featured-work__item-title">
              <svg className="featured-work__item-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Of The Oak
            </h3>
          </div>
        </div>
        <div className="featured-work__item reveal-on-scroll">
          <div className="featured-work__image-wrapper">
            <div className="featured-work__image-placeholder" style={{ backgroundColor: '#ccc' }}></div>
          </div>
          <div className="featured-work__item-info">
            <p className="featured-work__item-tags">VR • EXPERIENCE • DESIGN</p>
            <h3 className="featured-work__item-title">
              <svg className="featured-work__item-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Virtual Space
            </h3>
          </div>
        </div>
        <div className="featured-work__item reveal-on-scroll">
          <div className="featured-work__image-wrapper">
            <div className="featured-work__image-placeholder" style={{ backgroundColor: '#222' }}></div>
          </div>
          <div className="featured-work__item-info">
            <p className="featured-work__item-tags">WEB • DESIGN • 3D</p>
            <h3 className="featured-work__item-title">
              <svg className="featured-work__item-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Digital Product
            </h3>
          </div>
        </div>
        <div className="featured-work__item reveal-on-scroll">
          <div className="featured-work__image-wrapper">
            <div className="featured-work__image-placeholder" style={{ backgroundColor: '#ccc' }}></div>
          </div>
          <div className="featured-work__item-info">
            <p className="featured-work__item-tags">INNOVATION • WEBGL</p>
            <h3 className="featured-work__item-title">
              <svg className="featured-work__item-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Future Experiences
            </h3>
          </div>
        </div>
        <div className="featured-work__item reveal-on-scroll">
          <div className="featured-work__image-wrapper">
            <div className="featured-work__image-placeholder" style={{ backgroundColor: '#222' }}></div>
          </div>
          <div className="featured-work__item-info">
            <p className="featured-work__item-tags">BRANDING • DESIGN</p>
            <h3 className="featured-work__item-title">
              <svg className="featured-work__item-arrow" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
              Creative Lab
            </h3>
          </div>
        </div>
      </section>
    </>
  );
};

export default App;
