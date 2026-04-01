import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import { brandsWithLogos, getBrandLogoUrl, getLocalBrandLogoPath } from "../data/brands";

export default function BrandsMarquee() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#2a3f5d] bg-[#111b2c] px-4 py-3">
      <div
        className="flex w-max items-center gap-6 motion-safe:animate-[brands-scroll_40s_linear_infinite] hover:[animation-play-state:paused]"
        aria-hidden="true"
      >
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
  const itemClass = `flex h-[70px] min-w-[150px] items-center justify-center rounded-lg border border-[#2a3f5d] bg-[#0f1625] p-2 ${
    isSmallLogo ? "min-w-[120px]" : ""
  }`;

  if (useFallbackText) {
    return (
      <div className={itemClass}>
        <span className="text-sm font-semibold text-[#ecf3ff]">
          {brand.name}
        </span>
      </div>
    );
  }

  if (isLottieBrand && lottieData) {
    return (
      <div className={itemClass}>
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
      <div className={itemClass}>
        <span className="text-sm font-semibold text-[#a8b6ca]">{brand.name}</span>
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className={itemClass}>
        <video
          src={src}
          autoPlay
          loop
          muted
          playsInline
          aria-label={brand.name}
          onError={handleError}
          className="h-full w-full object-contain"
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
        className="h-full w-full object-contain"
      />
      <span className="sr-only">{brand.name}</span>
    </div>
  );
}
