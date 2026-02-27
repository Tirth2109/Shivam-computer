import { Link } from "react-router-dom";

const mapUrl = "https://maps.app.goo.gl/VP5gRbDDmd85NQEo8";
const instagramUrl = "https://www.instagram.com/shivam_computer";
const whatsappUrl = "https://wa.me/919974655284";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-grid">
          <section className="footer-block">
            <h4>About Shivam Computer</h4>
            <p>
              Your trusted store for brand new computers, custom built PCs, laptops,
              components and accessories across India. Genuine products, best prices,
              expert support.
            </p>
            <p>Delivery across India • ₹ INR</p>
          </section>

          <section className="footer-block">
            <h4>Policies</h4>
            <ul>
              <li><Link to="/shipping">Shipping & Delivery</Link></li>
              <li><Link to="/returns">Returns & Replacement</Link></li>
              <li><Link to="/warranty">Warranty</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms of Use</Link></li>
            </ul>
          </section>

          <section className="footer-block">
            <h4>Help</h4>
            <ul>
              <li><Link to="/login">Login / Admin</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/support">Contact & Support</Link></li>
              <li><Link to="/custom-build">Custom PC Builder</Link></li>
            </ul>
          </section>

          <section className="footer-block">
            <h4>Contact</h4>
            <p>F/61, 62, 63, Vatsalya Status, Near Railway Station, Dhaval Plaza, S.V. Road, Kadi – 382715</p>
            <p><a href={mapUrl} target="_blank" rel="noopener noreferrer">View on Google Maps</a></p>
            <ul>
              <li>Jignesh Patel: <a href="tel:9974655284">9974655284</a></li>
              <li>Ajay Khavad: <a href="tel:9925380246">9925380246</a></li>
              <li>Office: <a href="tel:9978680246">9978680246</a></li>
            </ul>
            <p><a href={`mailto:shivam.computer66@gmail.com`}>shivam.computer66@gmail.com</a></p>
            <p><a href={whatsappUrl} target="_blank" rel="noopener noreferrer">WhatsApp Support</a></p>
            <h4>Follow us</h4>
            <ul>
              <li><a href={instagramUrl} target="_blank" rel="noopener noreferrer">Instagram</a></li>
              <li><a href="https://www.facebook.com/search/top?q=Shivam%20Computer" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            </ul>
          </section>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Shivam Computer. All rights reserved. Delivery across India.</p>
        </div>
      </div>
    </footer>
  );
}
