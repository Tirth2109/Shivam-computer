import { Link } from "react-router-dom";
import HeaderWithDeals from "../components/HeaderWithDeals";
import Footer from "../components/Footer";

interface Props {
  title: string;
  message: string;
}

export default function PlaceholderPage({ title, message }: Props) {
  return (
    <>
      <HeaderWithDeals />
      <main className="section">
        <div className="container">
          <div className="section-heading">
            <h2>{title}</h2>
            <p>{message}</p>
          </div>
          <Link to="/" className="btn primary">Back to Home</Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
