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
    <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-5 py-10 sm:grid-cols-2 lg:grid-cols-4">
      {categories.map((category) => (
        <article
          key={category.title}
          className="rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-5 shadow-[0_2px_16px_rgba(0,0,0,0.35)]"
        >
          <h3 className="mb-2 text-lg font-semibold text-[#ecf3ff]">{category.title}</h3>
          <p className="text-sm text-[#a8b6ca]">{category.copy}</p>
        </article>
      ))}
    </section>
  );
}
