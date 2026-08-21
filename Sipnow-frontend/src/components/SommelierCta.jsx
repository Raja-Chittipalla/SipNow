import Reveal from "./Reveal.jsx";
import { useSiteAssets } from "../hooks/useContent.js";

export default function SommelierCta({ onStart }) {
  const { data: siteAssets } = useSiteAssets();

  return (
    <Reveal className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div
        className="glass-panel border border-outline-variant/20 rounded-[3.5rem] overflow-hidden grid lg:grid-cols-12 lg:min-h-[600px] shadow-2xl"
        id="sommelier-quiz"
      >
        <div className="lg:col-span-7 p-8 sm:p-12 md:p-24 flex flex-col justify-center space-y-8 md:space-y-10 relative">
          <div className="space-y-4">
            <p className="text-primary font-label-md uppercase tracking-[0.3em]">
              Expert's Choice
            </p>
            <h2 className="font-display-lg text-3xl sm:text-4xl md:text-6xl leading-[1.1]">
              Can't decide? <br />
              Let our <span className="italic">Sommelier</span> guide you.
            </h2>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-lg">
              Answer 4 simple questions about your taste preferences and
              occasion, and we'll curate a custom cellar selection just for you.
            </p>
          </div>
          <button
            className="primary-gradient w-fit px-12 py-6 rounded-full font-label-md flex items-center gap-4 group hover:scale-105 transition-all shadow-2xl shadow-primary/40"
            onClick={onStart}
          >
            Start Your Personal Quiz
            <span className="material-symbols-outlined group-hover:rotate-[30deg] transition-transform">
              auto_awesome
            </span>
          </button>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 blur-3xl rounded-full"></div>
        </div>
        <div className="lg:col-span-5 relative hidden lg:block overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={siteAssets.PRESTIGE_COLLECTION_URL}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container to-transparent"></div>
        </div>
      </div>
    </Reveal>
  );
}
