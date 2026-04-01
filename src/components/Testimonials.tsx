const testimonials = [
  `“Inventory reflects the latest shipments. Nothing slips through the cracks.”`,
  `“Shivam Computer’s automation let us cut setup time in half.”`,
  `“I can prep accessories and laptops from one screen.”`
];

export default function Testimonials() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-10">
      <h3 className="mb-4 text-xl font-semibold text-[#ecf3ff]">What our clients say</h3>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {testimonials.map((quote) => (
          <blockquote
            key={quote}
            className="rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-5 text-sm leading-6 text-[#d5deec]"
          >
            {quote}
          </blockquote>
        ))}
      </div>
    </section>
  );
}
