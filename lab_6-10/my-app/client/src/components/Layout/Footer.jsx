import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-branding">
          <div style={{ fontWeight: 600 }}>
            Branding stuff
          </div>
          <div className="text-muted">
            Lorem ipsum dolor sit amet, consectetur
            adipiscing elit. Nunc maximus, nulla ut commodo
            commodo.
          </div>
        </div>
        <div className="footer-logo">LOGO</div>
        <div className="footer-social">
          <div className="footer-social-circle" />
          <div className="footer-social-circle" />
          <div className="footer-social-circle" />
          <div className="footer-social-circle" />
        </div>
      </div>
      <div className="footer-bottom">
        2020 IoT © Copyright all rights reserved, bla bla
      </div>
    </footer>
  );
}

export default Footer;
