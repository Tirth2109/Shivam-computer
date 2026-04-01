import { Link } from "react-router-dom";

export default function CtaBanner() {
  return (
    <section
      id="contact"
      className="mx-auto my-10 flex w-full max-w-6xl flex-col items-start justify-between gap-4 rounded-2xl border border-[#2a3f5d] bg-[linear-gradient(135deg,#131c33,#0f1629)] px-5 py-6 sm:flex-row sm:items-center"
    >
      <div>
        <h3 className="mb-1 text-xl font-semibold text-[#ecf3ff]">Need help with a bulk order?</h3>
        <p className="text-sm text-[#a8b6ca]">
          Message our team or log in to the admin portal for priority handling.
        </p>
      </div>
      <Link
        className="inline-flex items-center rounded-full border border-[#5ec7ff] bg-[#5ec7ff] px-5 py-2.5 text-sm font-semibold text-[#050812] transition hover:bg-[#81d7ff]"
        to="/login"
      >
        Admin login
      </Link>
    </section>
  );
}
