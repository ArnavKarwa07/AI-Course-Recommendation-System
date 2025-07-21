  import "./Footer.css";

  export default function Footer() {
    return (
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <h3 className="footer-brand">SkillSense AI</h3>
            <p className="footer-powered">Powered by Harbinger Group</p>
          </div>
          <div className="footer-center">
            <h2 className="footer-tagline">Sensing Skills, Shaping Futures</h2>
            <p className="footer-copyright">
              © 2025 Harbinger Group. All rights reserved.
            </p>
          </div>
          <div className="footer-right">
            <p className="footer-version">AI-Powered Learning Platform</p>
            <p className="footer-version">Version 1.0</p>
          </div>
        </div>
      </footer>
    );
  }
