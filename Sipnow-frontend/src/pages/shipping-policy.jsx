import Reveal from "../components/Reveal.jsx";
import { LOGO_URL } from "../data/images.js";

export default function ShippingPolicy({ onBack }) {
  return (
    <div className="pt-36 sm:pt-40 lg:pt-44 pb-24 min-h-[60vh]">
      {/* HERO SECTION */}
      <Reveal className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop mb-14">
        {/* Back link */}
        <button
          className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-8 cursor-pointer"
          onClick={onBack}
          type="button"
        >
          <span className="material-symbols-outlined text-[18px]">
            chevron_left
          </span>
          Back to home
        </button>

        <div className="space-y-4 max-w-3xl">
          <div className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary border border-primary/30 font-label-md uppercase tracking-[0.2em] text-[10px]">
            SERVICES & DELIVERY
          </div>
          <h1 className="font-display-lg text-4xl sm:text-5xl md:text-6xl text-on-surface leading-tight">
            Shipping Policy
          </h1>
          <div className="space-y-2 text-on-surface-variant text-base sm:text-lg leading-relaxed max-w-xl">
            <p className="text-on-surface font-medium text-xl">
              We pack with care. We deliver with trust.
            </p>
            <p>
              Here&apos;s everything you need to know about shipping with{" "}
              <strong className="text-primary font-semibold">SipNow</strong>.
            </p>
          </div>
        </div>
      </Reveal>

      {/* MAIN POLICY CONTENT PANEL */}
      <Reveal className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop space-y-10">
        <div className="glass-panel relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-surface-container-high/90 via-surface/80 to-surface-container-lowest/90 p-8 shadow-2xl md:p-12 space-y-10">
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-tertiary-container/10 blur-3xl" />

          {/* SECTION 1: DELIVERY */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-secondary-container/50 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-2xl">
                  local_shipping
                </span>
              </div>
              <h2 className="font-headline-sm text-xl md:text-2xl text-on-surface uppercase tracking-wider font-bold">
                1. DELIVERY
              </h2>
            </div>

            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
              <p>
                Shipping rates are determined by your location and the size of
                your shipping package. Cost of shipping will be displayed at
                check-out prior to confirmation and payment of your order.
              </p>
              <p>
                Please confirm before checkout if we can ship to you. If we do
                not ship to your address, your only option will be to arrange
                for{" "}
                <strong className="text-primary font-semibold">
                  in-store pick-up
                </strong>
                . We cannot ship to{" "}
                <strong className="text-primary font-semibold">
                  PO box addresses
                </strong>
                .
              </p>
            </div>

            {/* Location Notice Box */}
            <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 flex items-center gap-4 max-w-3xl">
              <span className="material-symbols-outlined text-2xl text-primary shrink-0">
                location_on
              </span>
              <p className="text-on-surface-variant text-sm md:text-base leading-relaxed">
                <strong className="text-primary font-semibold">
                  We currently ship to
                </strong>{" "}
                most locations across Australia. Enter your address at checkout
                to check availability.
              </p>
            </div>
          </div>

          <hr className="border-outline-variant/30 relative z-10" />

          {/* SECTION 2: PROCESSING AND DELIVERY TIME */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-secondary-container/50 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-2xl">
                  inventory_2
                </span>
              </div>
              <h2 className="font-headline-sm text-xl md:text-2xl text-on-surface uppercase tracking-wider font-bold">
                2. PROCESSING AND DELIVERY TIME
              </h2>
            </div>

            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
              <p>
                Orders received will be processed within{" "}
                <strong className="text-primary font-semibold">
                  4 to 10 business days
                </strong>
                . There are times where this may take longer without notice. You
                will receive a tracking number for your order once it has been
                processed and is ready for packaging.
              </p>
              <p>
                SipNow works with trusted delivery partners to ensure your order
                reaches you safely and on time.
              </p>
              <p>
                Date of delivery may vary due to carrier shipping practices,
                delivery location, method of delivery, and the items ordered.
              </p>

              {/* ID & Age Warning Callout */}
              <div className="rounded-2xl border border-primary/40 bg-primary/10 p-6 space-y-2 mt-4">
                <div className="flex items-center gap-3 text-primary font-semibold mb-1">
                  <span className="material-symbols-outlined text-2xl">
                    badge
                  </span>
                  <span>Age & Delivery Requirements</span>
                </div>
                <p className="text-on-surface text-sm md:text-base leading-relaxed">
                  <strong className="text-primary font-bold">
                    Signature and ID of an adult who is of legal age
                  </strong>{" "}
                  will be required upon delivery. If an adult is not present to
                  receive the order, it will be returned to the nearest postal
                  outlet for signature pick up. Orders{" "}
                  <strong className="text-primary font-bold">
                    cannot be left on the doorstep or unattended
                  </strong>
                  .
                </p>
              </div>
            </div>
          </div>

          <hr className="border-outline-variant/30 relative z-10" />

          {/* SECTION 3: DAMAGED OR LOST SHIPMENTS */}
          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-secondary-container/50 border border-primary/30 flex items-center justify-center text-primary shrink-0">
                <span className="material-symbols-outlined text-2xl">
                  verified_user
                </span>
              </div>
              <h2 className="font-headline-sm text-xl md:text-2xl text-on-surface uppercase tracking-wider font-bold">
                3. DAMAGED OR LOST SHIPMENTS
              </h2>
            </div>

            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
              <p>
                We are unable to cover any losses or damages that may occur
                through third party couriers. We always do our absolute best to
                make sure your order is very well packaged, but once the package
                leaves our warehouse, we are no longer liable for it.
              </p>
              <p>
                Shipping insurance is provided by the third party carrier, which
                is an optional purchase by the customer. Liability is limited to
                the third party carriers own policies.
              </p>
            </div>
          </div>
        </div>

        {/* BOTTOM NEED HELP BANNER */}
        <div className="glass-panel rounded-3xl border border-primary/30 bg-gradient-to-r from-surface-container-high/90 via-surface/80 to-surface-container-lowest/90 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl">
                headset_mic
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-on-surface text-xl">Need help?</h3>
              <p className="text-on-surface-variant text-sm">
                If you have any questions about shipping, feel free to contact
                our support team.
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
              Cheers to convenience.
            </span>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
