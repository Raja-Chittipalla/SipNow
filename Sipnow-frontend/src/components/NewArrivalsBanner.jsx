import Reveal from "./Reveal.jsx";
import { useSiteAssets } from "../hooks/useContent.js";

export default function NewArrivalsBanner() {
  const { data: siteAssets } = useSiteAssets();

  return (
    <Reveal className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="relative rounded-[3rem] overflow-hidden group h-[420px] md:h-[600px] flex items-center">
        <img
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
          src={siteAssets.PRESTIGE_COLLECTION_URL}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
        <div className="relative p-8 md:p-24 max-w-2xl space-y-6 md:space-y-8">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-label-md uppercase tracking-[0.2em] text-[10px]">
            Seasonal Curations
          </div>
          <h2 className="font-display-lg text-4xl sm:text-5xl md:text-[64px] leading-tight">
            The 2024 <br />
            <span className="italic text-primary">Prestige Collection</span>
          </h2>
          <p className="text-on-surface-variant text-lg leading-relaxed">
            A handpicked selection of this season's most awarded wines and
            limited edition spirits, curated by our head sommelier.
          </p>
          <button className="primary-gradient px-12 py-5 rounded-full font-label-md flex items-center gap-3 hover:gap-5 transition-all shadow-xl shadow-primary/20">
            Shop Collection
            <span className="material-symbols-outlined">trending_flat</span>
          </button>
        </div>
      </div>
    </Reveal>
  );
}
