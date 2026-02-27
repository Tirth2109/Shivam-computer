import { Link } from "react-router-dom";

export default function CtaBanner() {
  return (
    <section id="contact" className="cta-banner">
      <div>
        <h3>Need help with a bulk order?</h3>
        <p>
          Message our team or log in to the admin portal for priority handling.
        </p>
      </div>
      <Link className="btn primary" to="/login">
        Admin login
      </Link>
    </section>
  );
}
