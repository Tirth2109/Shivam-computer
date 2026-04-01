import { Link } from "react-router-dom";

export default function FooterLogo3D() {
  return (
    <Link to="/" aria-label="Shivam Computer home" className="footer-logo3d">
      <span className="footer-logo3d-glow" aria-hidden="true" />
      <span className="footer-logo3d-stage" aria-hidden="true">
        <span className="footer-logo3d-cube">
          <span className="footer-logo3d-face footer-logo3d-face-front">
            <img
              src="/shivam-logo1.webp"
              alt=""
              className="h-8 w-8 object-contain sm:h-9 sm:w-9"
            />
          </span>
          <span className="footer-logo3d-face footer-logo3d-face-right" />
          <span className="footer-logo3d-face footer-logo3d-face-top" />
        </span>
      </span>
      <span className="footer-logo3d-text">
        <span className="footer-logo3d-title">Shivam</span>
        <span className="footer-logo3d-subtitle">Computer</span>
      </span>
    </Link>
  );
}
