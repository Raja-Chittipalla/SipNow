import Reveal from "./Reveal.jsx";

const points = [
  "Never drink and drive",
  "Enjoy alcohol in moderation",
  "Keep alcohol out of reach of children",
  "Pregnant women are advised not to drink alcohol",
];

export default function ResponsibleDrinking() {
  return (
    <Reveal className="py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="glass-panel border border-outline-variant/20 rounded-[2.5rem] p-10 lg:p-16 flex flex-col md:flex-row gap-12 items-center shadow-2xl">
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-full border-2 border-primary/40 flex items-center justify-center text-primary font-display-lg text-4xl">
            18+
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="font-display-lg text-3xl text-white">
              Please Drink Responsibly
            </h2>
            <p className="text-on-surface-variant leading-relaxed">
              SipNow sells alcohol and age-restricted products. By using our
              site you confirm you are 18 years of age or older. It is illegal
              to purchase or attempt to purchase alcohol if you are under 18.
            </p>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-on-surface-variant/80">
            {points.map((point) => (
              <li className="flex items-center gap-2" key={point}>
                <span className="material-symbols-outlined text-primary text-lg">
                  check_circle
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Reveal>
  );
}
