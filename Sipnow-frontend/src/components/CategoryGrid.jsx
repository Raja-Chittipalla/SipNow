import Reveal from "./Reveal.jsx";
import { useCategories } from "../hooks/useContent.js";
import { Link } from "react-router-dom";

export default function CategoryGrid({ onNavigate }) {
  const { data: categories } = useCategories();

  return (
    <Reveal className="pt-20 pb-16 md:pt-32 md:pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="space-y-2">
          <h2 className="font-display-lg text-4xl">Our Range</h2>
          <p className="text-on-surface-variant font-body-lg">
            Sophistication across every category.
          </p>
        </div>
        <Link
          to="/shop-all"
          // state={{ skipHero: true }}
          className="text-primary font-label-md flex items-center gap-2.5 group border-b border-primary/30 pb-1"
        >
          View Full Collection
          <span className="w-7 h-7 rounded-full bg-surface-container-high border border-outline-variant/40 flex items-center justify-center text-on-surface group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all shrink-0 shadow-sm">
            <span className="material-symbols-outlined text-[16px] group-hover:translate-x-0.5 transition-transform">
              chevron_right
            </span>
          </span>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {categories.map((category) => (
          <a
            className="group relative aspect-[3/4] rounded-3xl overflow-hidden glass-panel glow-border block"
            href="#best-sellers"
            key={category.name}
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.(`category:${category.key}`);
            }}
          >
            <img
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
              src={category.image}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="font-headline-md text-2xl mb-1">
                {category.name}
              </h3>
              <p className="text-primary text-[10px] uppercase font-bold tracking-widest">
                {category.tag}
              </p>
            </div>
          </a>
        ))}
      </div>
    </Reveal>
  );
}
