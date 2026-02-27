import { useEffect, useState } from "react";
import { headlineAlerts } from "../data/products";

export function useHeadlineRotation() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % headlineAlerts.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  return headlineAlerts[index];
}
