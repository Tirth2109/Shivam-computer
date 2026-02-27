import { useLocation } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import DealsStrip from "./DealsStrip";

export default function HeaderWithDeals() {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  return (
    <>
      <SiteHeader />
      {isHomePage && <DealsStrip />}
    </>
  );
}
