import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import { LOGO_URL } from "../data/images.js";

export default function TermsConditions({ onBack }) {
  return (
    <div className="pt-36 sm:pt-40 lg:pt-44 pb-24 min-h-[60vh]">
      {/* PAGE HERO */}
      <PageHero
        description="Please read these Terms & Conditions carefully before using our website or placing an order with SipNow."
        onBack={onBack}
        tag="Legal & Policies"
        title="Terms & Conditions"
      />

      {/* HIGHLIGHT CARDS GRID */}
      <Reveal className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop mb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group glass-panel rounded-2xl border border-primary/20 p-6 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
            <span className="material-symbols-outlined inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-3xl text-primary group-hover:bg-primary/20 transition-colors">
              badge
            </span>
            <h3 className="font-headline-sm text-xl text-on-surface group-hover:text-primary transition-colors">
              18+ Age Requirement
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Valid government photo identification is required for purchasing
              and receiving alcohol.
            </p>
          </div>

          <div className="group glass-panel rounded-2xl border border-primary/20 p-6 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
            <span className="material-symbols-outlined inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-3xl text-primary group-hover:bg-primary/20 transition-colors">
              gavel
            </span>
            <h3 className="font-headline-sm text-xl text-on-surface group-hover:text-primary transition-colors">
              Consumer Protections
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Full compliance with Australian Consumer Law and liquor licensing
              regulations.
            </p>
          </div>

          <div className="group glass-panel rounded-2xl border border-primary/20 p-6 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
            <span className="material-symbols-outlined inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-3xl text-primary group-hover:bg-primary/20 transition-colors">
              lock
            </span>
            <h3 className="font-headline-sm text-xl text-on-surface group-hover:text-primary transition-colors">
              Secure Shopping
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Transparent AUD pricing, authorized payment methods, and trusted
              ordering.
            </p>
          </div>
        </div>
      </Reveal>

      {/* MAIN POLICY CONTENT */}
      <Reveal className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop space-y-10">
        <div className="glass-panel relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-surface-container-high/90 via-surface/80 to-surface-container-lowest/90 p-8 shadow-2xl md:p-12 space-y-10">
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-tertiary-container/10 blur-3xl" />

          {/* Section 1 */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="font-headline-sm text-xl md:text-2xl text-on-surface font-bold">
                Age Requirement
              </h2>
            </div>
            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
              <p>
                You must be of the legal drinking age applicable in your
                location to purchase or receive alcoholic products from SipNow.
                Valid ID may be required upon delivery.
              </p>
              <div className="rounded-2xl border border-primary/40 bg-primary/10 p-5 flex items-start gap-4">
                <span className="material-symbols-outlined text-2xl text-primary shrink-0 mt-0.5">
                  verified
                </span>
                <p className="text-on-surface text-sm md:text-base leading-relaxed">
                  <strong className="text-primary font-bold">
                    Liquor Control Notice:
                  </strong>{" "}
                  Alcohol will not be delivered to persons under 18 years of age
                  or individuals who appear intoxicated.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-outline-variant/30 relative z-10" />

          {/* Section 2 */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h2 className="font-headline-sm text-xl md:text-2xl text-on-surface font-bold">
                Orders & Availability
              </h2>
            </div>
            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
              <p>
                All orders are subject to product availability. SipNow reserves
                the right to cancel or modify an order if a product is
                unavailable, incorrectly priced, or cannot legally be delivered.
              </p>
            </div>
          </div>

          <hr className="border-outline-variant/30 relative z-10" />

          {/* Section 3 */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h2 className="font-headline-sm text-xl md:text-2xl text-on-surface font-bold">
                Prices & Payment
              </h2>
            </div>
            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
              <p>
                All prices displayed on SipNow are in Australian dollars unless
                otherwise stated. Prices and promotions may change without
                notice. By placing an order, you confirm that you are authorised
                to use the selected payment method.
              </p>
            </div>
          </div>

          <hr className="border-outline-variant/30 relative z-10" />

          {/* Section 4 */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h2 className="font-headline-sm text-xl md:text-2xl text-on-surface font-bold">
                Delivery
              </h2>
            </div>
            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
              <p>
                Delivery times and availability depend on your location and our
                delivery partners. An adult of legal drinking age may be
                required to provide valid identification and a signature when
                receiving an order.
              </p>
            </div>
          </div>

          <hr className="border-outline-variant/30 relative z-10" />

          {/* Section 5 */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                5
              </div>
              <h2 className="font-headline-sm text-xl md:text-2xl text-on-surface font-bold">
                Returns & Refunds
              </h2>
            </div>
            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
              <p>
                Returns, exchanges and refunds are handled according to our{" "}
                <strong className="text-primary font-semibold">
                  Returns & Refunds Policy
                </strong>
                . Nothing in these Terms limits your rights under applicable
                Australian Consumer Law.
              </p>
            </div>
          </div>

          <hr className="border-outline-variant/30 relative z-10" />

          {/* Section 6 */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                6
              </div>
              <h2 className="font-headline-sm text-xl md:text-2xl text-on-surface font-bold">
                Website Use & Changes
              </h2>
            </div>
            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
              <p>
                You agree to use the SipNow website only for lawful purposes. We
                may update our website, products, prices and these Terms &
                Conditions from time to time. Continued use of the website means
                you accept the updated terms.
              </p>

              <div className="pt-6 border-t border-outline-variant/30">
                <p className="font-headline-sm text-xl md:text-2xl text-on-surface font-bold">
                  SipNow — Great drinks. Simple shopping. Better experiences.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SUPPORT CARD */}
        <div className="glass-panel rounded-3xl border border-primary/30 bg-gradient-to-r from-surface-container-high/90 via-surface/80 to-surface-container-lowest/90 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl">gavel</span>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-on-surface text-xl">
                Questions about our Terms?
              </h3>
              <p className="text-on-surface-variant text-sm">
                Our support team is available to help clarify any terms or
                policies.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-primary pt-1">
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">
                    mail
                  </span>
                  hello@sipnow.com.au
                </span>
                <span className="text-outline">|</span>
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-base">
                    call
                  </span>
                  (02) 1234 5678
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end shrink-0 border-t md:border-t-0 md:border-l border-outline-variant/30 pt-4 md:pt-0 md:pl-8">
            <img
              src={LOGO_URL}
              alt="SipNow Logo"
              className="h-10 object-contain brightness-110 mb-1"
            />
            <span className="text-xs text-primary font-display font-medium tracking-wide">
              Responsibility is our standard.
            </span>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
