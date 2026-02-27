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
    <section className="automation-cards">
      <article>
        <h4>Automated stock radar</h4>
        <p id="restock-message">{restockMessage}</p>
      </article>
      {highlightCards.map((card) => (
        <article key={card.title}>
          <h4>{card.title}</h4>
          <p>{card.copy}</p>
        </article>
      ))}
    </section>
  );
}
