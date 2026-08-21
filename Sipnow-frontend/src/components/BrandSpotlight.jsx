import Reveal from "./Reveal.jsx";
import { useSiteAssets } from "../hooks/useContent.js";
import { scrollToSection } from "../utils/links.js";

export default function BrandSpotlight() {
  const { data: siteAssets } = useSiteAssets();

  return (
    <Reveal className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="grid lg:grid-cols-2 gap-px bg-outline-variant/20 rounded-[3rem] overflow-hidden border border-outline-variant/20">
        <div className="relative min-h-[500px]">
          <img
            className="w-full h-full object-cover"
            src={siteAssets.PENFOLDS_URL}
          />
        </div>
        <div className="bg-surface-container flex flex-col justify-center p-8 sm:p-12 lg:p-24 space-y-8">
          <p className="text-primary font-label-md uppercase tracking-[0.3em] mb-4">
            Featured Producer
          </p>
          <h2 className="font-headline-md text-4xl lg:text-5xl leading-tight">
            Brand Spotlight: <br />
            <span className="text-primary italic">Penfolds Est. 1844</span>
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            From its inception in 1844, Penfolds has played a pivotal role in
            the evolution of winemaking. Their collection of benchmark wines is
            established with a spirit of innovation and quality.
          </p>
          <a
            className="inline-flex items-center gap-3 text-primary font-label-md group"
            href="#best-sellers"
            onClick={scrollToSection("best-sellers")}
          >
            Shop Penfolds Collection
            <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
              arrow_forward
            </span>
          </a>
        </div>
      </div>
    </Reveal>
  );
}
