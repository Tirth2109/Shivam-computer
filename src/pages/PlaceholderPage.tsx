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
      <main className="py-10">
        <div className="mx-auto w-full max-w-6xl px-5">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-[#ecf3ff]">{title}</h2>
            <p className="mt-1 text-sm text-[#a8b6ca]">{message}</p>
          </div>
          <Link
            to="/"
            className="inline-flex items-center rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-5 py-2.5 text-sm font-semibold text-[#050812] transition hover:bg-[#81d7ff]"
          >
            Back to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
