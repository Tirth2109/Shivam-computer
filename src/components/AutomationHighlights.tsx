type AutomationHighlightsProps = {
  restockMessage: string;
};

const highlightCards = [
  {
    title: "Quick order simulation",
    copy: "Place a test order and watch the admin dashboard receive it."
  },
  {
    title: "Support dispatch",
    copy: "Tickets update automatically as orders shift to fulfillment."
  }
];

export default function AutomationHighlights({
  restockMessage
}: AutomationHighlightsProps) {
  return (
    <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-4 px-5 py-10 md:grid-cols-3">
      <article className="rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-5">
        <h4 className="mb-2 text-base font-semibold text-[#ecf3ff]">Automated stock radar</h4>
        <p id="restock-message" className="text-sm text-[#a8b6ca]">{restockMessage}</p>
      </article>
      {highlightCards.map((card) => (
        <article key={card.title} className="rounded-xl border border-[#2a3f5d] bg-[#111b2c] p-5">
          <h4 className="mb-2 text-base font-semibold text-[#ecf3ff]">{card.title}</h4>
          <p className="text-sm text-[#a8b6ca]">{card.copy}</p>
        </article>
      ))}
    </section>
  );
}
