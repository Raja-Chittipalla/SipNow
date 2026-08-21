import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";
import { LOGO_URL } from "../data/images.js";

export default function ReturnsRefunds({ onBack }) {
  return (
    <div className="pt-36 sm:pt-40 lg:pt-44 pb-24 min-h-[60vh]">
      {/* PAGE HERO */}
      <PageHero
        description="At SipNow, we want you to be happy with every purchase. If something isn't right with your order or a product doesn't meet the required standards, our team is here to help."
        onBack={onBack}
        tag="Customer Care"
        title="Returns & Refunds Policy"
      />

      {/* HIGHLIGHT CARDS GRID */}
      <Reveal className="mx-auto max-w-container-max px-margin-mobile md:px-margin-desktop mb-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group glass-panel rounded-2xl border border-primary/20 p-6 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
            <span className="material-symbols-outlined inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-3xl text-primary group-hover:bg-primary/20 transition-colors">
              published_with_changes
            </span>
            <h3 className="font-headline-sm text-xl text-on-surface group-hover:text-primary transition-colors">
              90-Day Returns
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Unopened and unused items in original packaging can be returned
              within 90 days.
            </p>
          </div>

          <div className="group glass-panel rounded-2xl border border-primary/20 p-6 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
            <span className="material-symbols-outlined inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-3xl text-primary group-hover:bg-primary/20 transition-colors">
              verified
            </span>
            <h3 className="font-headline-sm text-xl text-on-surface group-hover:text-primary transition-colors">
              Consumer Guarantees
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Full coverage under Australian Consumer Law for faulty, damaged,
              or misdescribed products.
            </p>
          </div>

          <div className="group glass-panel rounded-2xl border border-primary/20 p-6 space-y-3 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10">
            <span className="material-symbols-outlined inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-3xl text-primary group-hover:bg-primary/20 transition-colors">
              support_agent
            </span>
            <h3 className="font-headline-sm text-xl text-on-surface group-hover:text-primary transition-colors">
              Fast Resolution
            </h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Our Customer Care Team is ready to assist with refunds,
              replacements, or repairs.
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

          {/* Intro Paragraph */}
          <div className="relative z-10 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
            <p>
              At{" "}
              <strong className="text-on-surface font-semibold">SipNow</strong>,
              we want you to be happy with every purchase. If something
              isn&apos;t right with your order or a product doesn&apos;t meet
              the required standards, our team is here to help.
            </p>
          </div>

          <hr className="border-outline-variant/30 relative z-10" />

          {/* Section 1 */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="font-headline-sm text-xl md:text-2xl text-on-surface font-bold">
                Faulty, Damaged or Incorrect Products
              </h2>
            </div>
            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
              <p>
                If a product purchased from SipNow is faulty, damaged due to an
                issue that was not caused by misuse, incorrectly described, or
                otherwise does not meet applicable consumer guarantees, please
                contact us as soon as possible.
              </p>
              <p>
                Depending on the circumstances, we may provide an appropriate
                remedy such as a{" "}
                <strong className="text-primary font-semibold">
                  refund, replacement, exchange or repair
                </strong>
                , where applicable.
              </p>
              <p>
                SipNow may need to assess the product before determining the
                appropriate remedy, particularly for higher-value products or
                where the nature of the issue requires further investigation.
              </p>
              <div className="rounded-2xl border border-primary/30 bg-surface-container/60 p-6 space-y-3">
                <p className="text-on-surface font-semibold text-base">
                  To make a return or faulty-product claim, please contact our
                  Customer Care Team and provide:
                </p>
                <ul className="list-disc list-inside space-y-2 text-on-surface-variant text-sm md:text-base">
                  <li>Your order number or proof of purchase</li>
                  <li>Details of the issue</li>
                  <li>
                    Photographs of the product and packaging, where relevant
                  </li>
                  <li>
                    Any other information reasonably required to assess the
                    claim
                  </li>
                </ul>
              </div>
              <p>
                If the product is confirmed to be faulty or otherwise covered by
                an applicable consumer guarantee, SipNow will work with you to
                provide the appropriate remedy.
              </p>
              <div className="rounded-2xl border border-primary/40 bg-primary/10 p-5">
                <p className="text-on-surface text-sm md:text-base leading-relaxed">
                  Your rights under the{" "}
                  <strong className="text-primary font-bold">
                    Australian Consumer Law are not excluded or limited by this
                    policy
                  </strong>
                  .
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
                Damaged Products on Delivery
              </h2>
            </div>
            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
              <p>
                We take care to package every order securely before dispatch.
              </p>
              <p>
                If your order arrives damaged, please contact us as soon as
                possible with your order details and clear photographs of the
                damaged product and packaging.
              </p>
              <p>
                Our team will review the issue and work with you to determine
                the appropriate resolution.
              </p>
              <p>
                Please retain the original packaging and damaged product until
                we have advised you on the next steps.
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
                Incorrect or Missing Items
              </h2>
            </div>
            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
              <p>
                If you receive an item that is different from what you ordered,
                or an item is missing from your order, please contact SipNow
                Customer Care as soon as possible.
              </p>
              <p>
                We will review your order and, where appropriate, arrange for
                the correct item to be supplied or provide another suitable
                resolution.
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
                Change of Mind Returns
              </h2>
            </div>
            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
              <p>
                SipNow may accept change-of-mind returns where the product meets
                all applicable return conditions.
              </p>
              <div className="rounded-2xl border border-primary/30 bg-surface-container/60 p-6 space-y-3">
                <p className="text-on-surface font-semibold text-base">
                  For a change-of-mind return, the product must generally:
                </p>
                <ul className="list-disc list-inside space-y-2 text-on-surface-variant text-sm md:text-base">
                  <li>
                    Be returned within{" "}
                    <strong className="text-primary font-bold">
                      90 days of purchase
                    </strong>
                  </li>
                  <li>Be unopened and unused</li>
                  <li>Be in its original packaging</li>
                  <li>Be in a clean and re-saleable condition</li>
                  <li>
                    Be within its use-by or best-before date, where applicable
                  </li>
                  <li>Be accompanied by valid proof of purchase</li>
                </ul>
              </div>
              <p>
                Because alcohol and other beverages can be affected by storage
                and temperature conditions, products that have been opened,
                damaged, improperly stored, or otherwise made unsuitable for
                resale may not be eligible for a change-of-mind return.
              </p>
              <p className="font-semibold text-on-surface">
                Delivery or shipping fees are generally non-refundable for
                change-of-mind returns.
              </p>
              <p>
                This change-of-mind policy does not affect any rights you may
                have under the Australian Consumer Law.
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
                Proof of Purchase
              </h2>
            </div>
            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
              <p>
                To help us process your return quickly, please provide valid
                proof of purchase.
              </p>
              <div className="rounded-2xl border border-primary/30 bg-surface-container/60 p-6 space-y-3">
                <p className="text-on-surface font-semibold text-base">
                  Acceptable proof may include:
                </p>
                <ul className="list-disc list-inside space-y-2 text-on-surface-variant text-sm md:text-base">
                  <li>Original receipt</li>
                  <li>Tax invoice</li>
                  <li>Order confirmation</li>
                  <li>Order history from your SipNow account</li>
                  <li>Other reasonable evidence of purchase</li>
                </ul>
              </div>
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
                How to Return or Exchange an Item
              </h2>
            </div>
            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
              <p>
                To start a return or exchange, please contact our{" "}
                <strong className="text-primary font-semibold">
                  Customer Care Team
                </strong>{" "}
                with your order number and the reason for your request.
              </p>
              <p>
                Our team will provide instructions based on your order and the
                type of return requested.
              </p>
              <p>
                Where a product needs to be returned to our fulfilment centre,
                please allow{" "}
                <strong className="text-primary font-semibold">
                  2–3 business days after receipt of the returned product
                </strong>{" "}
                for us to process the refund, subject to the outcome of the
                return assessment.
              </p>
              <p>
                Refund processing times may also depend on your payment provider
                or financial institution.
              </p>
            </div>
          </div>

          <hr className="border-outline-variant/30 relative z-10" />

          {/* Section 7 */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                7
              </div>
              <h2 className="font-headline-sm text-xl md:text-2xl text-on-surface font-bold">
                Refunds
              </h2>
            </div>
            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
              <p>
                Where a refund is approved, the refund will generally be issued
                to the{" "}
                <strong className="text-primary font-semibold">
                  original payment method
                </strong>{" "}
                used for the purchase.
              </p>
              <p>
                The time taken for the funds to appear in your account may vary
                depending on your bank or payment provider.
              </p>
              <p>
                Where a consumer is entitled to a refund under the Australian
                Consumer Law, SipNow will provide the applicable remedy in
                accordance with those rights.
              </p>
            </div>
          </div>

          <hr className="border-outline-variant/30 relative z-10" />

          {/* Section 8 */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                8
              </div>
              <h2 className="font-headline-sm text-xl md:text-2xl text-on-surface font-bold">
                Promotional and Sale Items
              </h2>
            </div>
            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
              <p>
                Promotional or sale products may be subject to specific terms
                and conditions.
              </p>
              <p>
                However, promotional pricing does not remove or limit your
                rights under the Australian Consumer Law. Consumer guarantees
                continue to apply where applicable.
              </p>
            </div>
          </div>

          <hr className="border-outline-variant/30 relative z-10" />

          {/* Section 9 */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                9
              </div>
              <h2 className="font-headline-sm text-xl md:text-2xl text-on-surface font-bold">
                SipNow Marketplace Returns
              </h2>
            </div>
            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
              <p>
                If SipNow offers products through third-party marketplace
                sellers, return procedures may vary depending on the seller and
                product.
              </p>
              <p>
                Please contact our Customer Care Team with your order details so
                we can advise you of the appropriate return process.
              </p>
            </div>
          </div>

          <hr className="border-outline-variant/30 relative z-10" />

          {/* Section 10 */}
          <div className="relative z-10 space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                10
              </div>
              <h2 className="font-headline-sm text-xl md:text-2xl text-on-surface font-bold">
                Need Help?
              </h2>
            </div>
            <div className="space-y-4 text-on-surface-variant text-base md:text-lg leading-relaxed max-w-4xl">
              <p>
                We&apos;re here to help make your SipNow experience as easy as
                possible.
              </p>
              <p>
                If you have questions about a return, refund, exchange or
                damaged order, please contact our Customer Care Team.
              </p>

              <div className="pt-6 border-t border-outline-variant/30">
                <p className="font-headline-sm text-xl md:text-2xl text-on-surface font-bold">
                  SipNow — great products, great service, and a better way to
                  shop.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM CONTACT SUPPORT CARD */}
        <div className="glass-panel rounded-3xl border border-primary/30 bg-gradient-to-r from-surface-container-high/90 via-surface/80 to-surface-container-lowest/90 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex items-center gap-5">
            <div className="h-14 w-14 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-3xl">
                support_agent
              </span>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-on-surface text-xl">
                Customer Care Team
              </h3>
              <p className="text-on-surface-variant text-sm">
                Have questions about a return or refund claim? Get in touch with
                our team.
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
              Curated Excellence.
            </span>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
