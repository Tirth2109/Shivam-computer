import { Link } from "react-router-dom";

export default function FooterLogo3D() {
  return (
    <Link to="/" aria-label="Shivam Computer home" className="footer-logo3d">
      <img
        src="/shivam-logo1.webp"
        alt="Shivam Computer Logo"
        className="footer-logo3d-image h-auto w-28 object-contain sm:w-36"
      />
    </Link>
  );
}



