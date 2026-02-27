import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { brandsWithLogos, getBrandLogoUrl, getLocalBrandLogoPath } from "../data/brands";

export default function BrandsMarquee() {
  return (
    <div className="brands-marquee-wrap">
      <div className="brands-marquee" aria-hidden="true">
        {[...brandsWithLogos, ...brandsWithLogos].map((brand, i) => (
          <BrandLogoItem key={`${brand.slug}-${i}`} brand={brand} />
        ))}
      </div>
    </div>
  );
}

function BrandLogoItem({
  brand,
}: {
  brand: (typeof brandsWithLogos)[number];
}) {
  // Try local files first; use logoFile if set (e.g. "Asus Brand Logo.mp4"), else SVG
  const hasLogoFile = "logoFile" in brand && typeof brand.logoFile === "string";
  const initialSrc = hasLogoFile
    ? `/brands/${encodeURIComponent(brand.logoFile!)}`
    : getLocalBrandLogoPath(brand.slug, "webp");
  const [src, setSrc] = useState<string>(() => initialSrc);
  const [useFallbackText, setUseFallbackText] = useState(false);
  const [lottieData, setLottieData] = useState<object | null>(null);

  const isLottieBrand = "lottie" in brand && brand.lottie === true;

  useEffect(() => {
    if (!isLottieBrand) return;
    fetch(`/brands/${brand.slug}.json`)
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then(setLottieData)
      .catch(() => setUseFallbackText(true));
  }, [brand.slug, isLottieBrand]);

  const titleCase = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  const nameMp4 = `/brands/${brand.name}.mp4`;
  const titleCaseMp4 = `/brands/${titleCase(brand.name)}.mp4`;

  const logoFileSrc = hasLogoFile ? `/brands/${encodeURIComponent(brand.logoFile!)}` : null;

  const handleError = () => {
    if (logoFileSrc && src === logoFileSrc) {
      setSrc(getLocalBrandLogoPath(brand.slug, "webp"));
    } else if (src === getLocalBrandLogoPath(brand.slug, "webp")) {
      setSrc(getLocalBrandLogoPath(brand.slug, "svg"));
    } else if (src === getLocalBrandLogoPath(brand.slug, "svg")) {
      setSrc(getLocalBrandLogoPath(brand.slug, "png"));
    } else if (src === getLocalBrandLogoPath(brand.slug, "png")) {
      setSrc(getLocalBrandLogoPath(brand.slug, "mp4"));
    } else if (src === getLocalBrandLogoPath(brand.slug, "mp4")) {
      setSrc(nameMp4);
    } else if (src === nameMp4) {
      setSrc(titleCaseMp4);
    } else if (src === titleCaseMp4) {
      setSrc(getBrandLogoUrl(brand.domain));
    } else {
      setUseFallbackText(true);
    }
  };

  const isVideo = src.endsWith(".mp4");
  const isSmallLogo = "logoSize" in brand && brand.logoSize === "small";
  const itemClass = `brands-marquee-item${isSmallLogo ? " brands-marquee-item--small" : ""}`;

  if (useFallbackText) {
    return (
      <div className={itemClass}>
        <span className="brands-marquee-fallback brands-marquee-fallback-visible">
          {brand.name}
        </span>
      </div>
    );
  }

  if (isLottieBrand && lottieData) {
    return (
      <div className={`brands-marquee-item brands-marquee-item--lottie${isSmallLogo ? " brands-marquee-item--small" : ""}`}>
        <Lottie
          animationData={lottieData}
          loop
          style={{ width: 150, height: 60 }}
          aria-label={brand.name}
        />
      </div>
    );
  }

  if (isLottieBrand && !lottieData) {
    return (
      <div className="brands-marquee-item">
        <span className="brands-marquee-fallback">{brand.name}</span>
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className="brands-marquee-item brands-marquee-item--video">
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          aria-label={brand.name}
          onError={handleError}
        />
      </div>
    );
  }

  return (
    <div className={itemClass}>
      <img
        src={src}
        alt={brand.name}
        loading="lazy"
        onError={handleError}
      />
      <span className="brands-marquee-fallback">{brand.name}</span>
    </div>
  );
}
