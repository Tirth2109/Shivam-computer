import { useLocation } from "react-router-dom";
import SiteHeader from "./SiteHeader";
import DealsStrip from "./DealsStrip";

type HeaderWithDealsProps = {
  showNav?: boolean;
};

export default function HeaderWithDeals({ showNav = true }: HeaderWithDealsProps) {
  const { pathname } = useLocation();
  const isHomePage = pathname === "/";

  return (
    <>
      <SiteHeader showNav={showNav} />
      {isHomePage && <DealsStrip />}
    </>
  );
}
