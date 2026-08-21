import Reveal from "./Reveal.jsx";

// Tailwind's JIT scanner needs complete class strings, so each color variant
// is spelled out in full here rather than built with a template literal.
const COLOR_CLASSES = {
  primary: {
    iconWrap: "bg-primary/10 border-primary/20 group-hover:bg-primary/20",
    icon: "text-primary",
  },
  tertiary: {
    iconWrap: "bg-tertiary/10 border-tertiary/20 group-hover:bg-tertiary/20",
    icon: "text-tertiary",
  },
};

const reasons = [
  {
    icon: "workspace_premium",
    color: "primary",
    title: "Premium Quality",
    desc: "Every product is handpicked from trusted producers who meet our strict quality standards.",
  },
  {
    icon: "bolt",
    color: "tertiary",
    title: "Fast Delivery",
    desc: "Same-day dispatch on orders placed before 2 PM, delivered straight to your door.",
  },
  {
    icon: "sell",
    color: "primary",
    title: "Best Prices",
    desc: "Direct supplier relationships let us cut out the middlemen and pass the savings to you.",
  },
  {
    icon: "liquor",
    color: "tertiary",
    title: "Huge Selection",
    desc: "Thousands of beverages across beer, wine, spirits, premix and zero-proof — all in one cellar.",
  },
];

export default function WhySipNow() {
  return (
    <Reveal
      className="pb-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto"
      id="why-sipnow"
    >
      <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
        <p className="text-primary font-label-md uppercase tracking-[0.3em] text-xs">
          The SipNow Difference
        </p>
        <h2 className="font-display-lg text-4xl md:text-5xl">Why SipNow</h2>
        <p className="text-on-surface-variant font-body-lg">
          Four reasons our inner circle keeps coming back.
        </p>
      </div>
      <div className="glass-panel border border-outline-variant/20 rounded-[2.5rem] p-10 lg:p-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 shadow-2xl backdrop-blur-3xl">
        {reasons.map((reason) => {
          const colors = COLOR_CLASSES[reason.color];
          return (
            <div className="group cursor-default" key={reason.title}>
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-6 group-hover:scale-110 transition-all duration-500 ${colors.iconWrap}`}
              >
                <span
                  className={`material-symbols-outlined text-3xl ${colors.icon}`}
                >
                  {reason.icon}
                </span>
              </div>
              <h3 className="font-headline-md text-xl mb-3">{reason.title}</h3>
              <p className="text-on-surface-variant leading-relaxed text-sm">
                {reason.desc}
              </p>
            </div>
          );
        })}
      </div>
    </Reveal>
  );
}
