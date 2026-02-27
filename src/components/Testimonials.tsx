const testimonials = [
  `“Inventory reflects the latest shipments. Nothing slips through the cracks.”`,
  `“Shivam Computer’s automation let us cut setup time in half.”`,
  `“I can prep accessories and laptops from one screen.”`
];

export default function Testimonials() {
  return (
    <section className="testimonials">
      <h3>What our clients say</h3>
      <div className="testimonial-grid">
        {testimonials.map((quote) => (
          <blockquote key={quote}>{quote}</blockquote>
        ))}
      </div>
    </section>
  );
}
