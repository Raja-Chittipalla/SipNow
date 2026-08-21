import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";

export default function AboutUs({ onBack }) {
  return (
    <div className="pt-36 sm:pt-40 lg:pt-44 pb-24 min-h-[60vh]">
      {/* PAGE HERO */}
      <PageHero
        description="Learn more about SipNow, our vision, and our commitment to curated excellence."
        onBack={onBack}
        tag="Our Story"
        title="About Us"
      />

      {/* OUR STORY MAIN CONTENT PANEL */}
      <Reveal className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop mb-16">
        <div className="glass-panel relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-surface-container-high/90 via-surface/80 to-surface-container-lowest/90 p-8 shadow-2xl md:p-12 space-y-8">
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-tertiary-container/10 blur-3xl" />

          {/* Section Header */}
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              <span className="material-symbols-outlined text-[16px]">
                auto_stories
              </span>
              Our Story
            </div>
            <h2 className="font-display-lg text-3xl sm:text-4xl md:text-5xl leading-tight text-on-surface">
              Our Story
            </h2>
          </div>

          {/* Story Body Paragraphs */}
          <div className="relative z-10 space-y-6 text-on-surface-variant text-base md:text-lg leading-relaxed">
            <p>
              At{" "}
              <strong className="text-on-surface font-semibold">SipNow</strong>,
              we believe great drinks are meant to bring people together. What
              started with a simple idea — making quality beer, spirits, and
              wines easier to discover and enjoy — has grown into a platform
              built around convenience, choice, and a great customer experience.
            </p>

            <p>
              We carefully curate our selection with quality and variety in
              mind, bringing you products from trusted brands and helping you
              find the right drink for every occasion. Whether you&apos;re
              celebrating a special moment, hosting friends, or simply relaxing
              after a long day, we&apos;re here to make every sip a little more
              enjoyable.
            </p>

            {/* Promise Card Callout */}
            <div className="my-8 rounded-2xl border border-primary/40 bg-gradient-to-r from-primary/15 via-primary/5 to-transparent p-6 md:p-8 backdrop-blur-sm relative overflow-hidden">
              <div className="flex items-start gap-4">
                <span className="material-symbols-outlined text-3xl text-primary shrink-0 mt-0.5">
                  workspace_premium
                </span>
                <div>
                  <p className="text-on-surface text-base md:text-lg leading-relaxed">
                    Our promise is simple:{" "}
                    <strong className="text-primary font-bold">
                      quality products, great value, and reliable service.
                    </strong>{" "}
                    We are committed to continuously improving your SipNow
                    experience and making your journey from discovery to
                    delivery as smooth as possible.
                  </p>
                </div>
              </div>
            </div>

            <p>
              Explore our collection, discover your favourites, and let us take
              care of the rest.
            </p>

            {/* Cheers Toast Banner */}
            <div className="pt-6 border-t border-outline-variant/30 flex items-center gap-3">
              <span className="text-2xl md:text-3xl">🥂</span>
              <span className="font-display text-xl sm:text-2xl font-bold text-gradient">
                Cheers to great choices, great moments, and you!
              </span>
            </div>
          </div>
        </div>
      </Reveal>

      {/* THREE CORE PILLARS GRID */}
      <Reveal className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group glass-panel rounded-2xl border border-primary/20 p-6 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
            <span className="material-symbols-outlined inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-3xl text-primary group-hover:bg-primary/20 transition-colors">
              local_shipping
            </span>
            <h3 className="font-headline-sm text-xl text-on-surface group-hover:text-primary transition-colors">
              Convenience
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Seamless browsing, fast ordering, and dependable delivery straight
              to your doorstep.
            </p>
          </div>

          <div className="group glass-panel rounded-2xl border border-primary/20 p-6 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
            <span className="material-symbols-outlined inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-3xl text-primary group-hover:bg-primary/20 transition-colors">
              liquor
            </span>
            <h3 className="font-headline-sm text-xl text-on-surface group-hover:text-primary transition-colors">
              Choice & Variety
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Handpicked craft beers, fine wines, top-shelf spirits, and
              zero-proof alternatives for every taste.
            </p>
          </div>

          <div className="group glass-panel rounded-2xl border border-primary/20 p-6 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
            <span className="material-symbols-outlined inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-3xl text-primary group-hover:bg-primary/20 transition-colors">
              sentiment_very_satisfied
            </span>
            <h3 className="font-headline-sm text-xl text-on-surface group-hover:text-primary transition-colors">
              Great Experience
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Dedicated customer support and curated recommendations to make
              every moment memorable.
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
