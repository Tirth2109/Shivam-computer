import { Link } from "react-router-dom";
import FooterLogo3D from "./FooterLogo3D";

const mapUrl = "https://maps.app.goo.gl/VP5gRbDDmd85NQEo8";
const instagramUrl = "https://www.instagram.com/shivam_computer";
const whatsappUrl = "https://wa.me/919974655284";

export default function Footer() {
  const linkClass = "text-[#b4c1d3] transition hover:text-[#5ec7ff]";
  return (
    <footer className="border-t border-[#2a3f5d] bg-[#050812]">
      <div className="mx-auto w-full max-w-7xl px-5 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          <section>
            <div className="mb-4">
              <FooterLogo3D />
            </div>
            <h4 className="mb-3 text-base font-semibold text-[#ecf3ff]">About Shivam Computer</h4>
            <p className="text-sm leading-6 text-[#a8b6ca]">
              Your trusted store for brand new computers, custom built PCs, laptops,
              components and accessories across India. Genuine products, best prices,
              expert support.
            </p>
            <p className="mt-3 text-sm text-[#a8b6ca]">Delivery across India • ₹ INR</p>
          </section>

          <section>
            <h4 className="mb-3 text-base font-semibold text-[#ecf3ff]">Policies</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shipping" className={linkClass}>Shipping & Delivery</Link></li>
              <li><Link to="/returns" className={linkClass}>Returns & Replacement</Link></li>
              <li><Link to="/warranty" className={linkClass}>Warranty</Link></li>
              <li><Link to="/privacy" className={linkClass}>Privacy Policy</Link></li>
              <li><Link to="/terms" className={linkClass}>Terms of Use</Link></li>
            </ul>
          </section>

          <section>
            <h4 className="mb-3 text-base font-semibold text-[#ecf3ff]">Help</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/login" className={linkClass}>Login / Admin</Link></li>
              <li><Link to="/faq" className={linkClass}>FAQ</Link></li>
              <li><Link to="/support" className={linkClass}>Contact & Support</Link></li>
              <li><Link to="/custom-build" className={linkClass}>Custom PC Builder</Link></li>
            </ul>
          </section>

          <section>
            <h4 className="mb-3 text-base font-semibold text-[#ecf3ff]">Contact</h4>
            <p className="text-sm leading-6 text-[#a8b6ca]">F/61, 62, 63, Vatsalya Status, Near Railway Station, Dhaval Plaza, S.V. Road, Kadi – 382715</p>
            <p className="mt-2 text-sm"><a href={mapUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>View on Google Maps</a></p>
            <ul className="mt-2 space-y-1 text-sm text-[#a8b6ca]">
              <li>Jignesh Patel: <a href="tel:9974655284" className={linkClass}>9974655284</a></li>
              <li>Ajay Khavad: <a href="tel:9925380246" className={linkClass}>9925380246</a></li>
              <li>Office: <a href="tel:9978680246" className={linkClass}>9978680246</a></li>
            </ul>
            <p className="mt-2 text-sm"><a href={`mailto:shivam.computer66@gmail.com`} className={linkClass}>shivam.computer66@gmail.com</a></p>
            <p className="mt-1 text-sm"><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>WhatsApp Support</a></p>
            <h4 className="mb-2 mt-4 text-base font-semibold text-[#ecf3ff]">Follow us</h4>
            <ul className="space-y-1 text-sm">
              <li><a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>Instagram</a></li>
              <li><a href="https://www.facebook.com/search/top?q=Shivam%20Computer" target="_blank" rel="noopener noreferrer" className={linkClass}>Facebook</a></li>
            </ul>
          </section>
        </div>

        <div className="mt-10 border-t border-[#2a3f5d] pt-5">
          <p className="text-xs text-[#a8b6ca]">© {new Date().getFullYear()} Shivam Computer. All rights reserved. Delivery across India.</p>
        </div>
      </div>
    </footer>
  );
}
