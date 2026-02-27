const categories = [
  {
    title: "Laptops",
    copy: "Thin, powerful, and ready for hybrid work."
  },
  {
    title: "Peripherals",
    copy: "Mechanical keyboards, precision mice, and ergonomic stands."
  },
  {
    title: "Components",
    copy: "GPUs, memory, monitors, and every core upgrade."
  },
  {
    title: "Services",
    copy: "On-site setup, warranty, and automated notifications."
  }
];

export default function Categories() {
  return (
    <section className="categories">
      {categories.map((category) => (
        <article key={category.title}>
          <h3>{category.title}</h3>
          <p>{category.copy}</p>
        </article>
      ))}
    </section>
  );
}
