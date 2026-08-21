import PageHero from "../components/PageHero.jsx";
import Reveal from "../components/Reveal.jsx";

export default function PrivacyPolicy({ onBack }) {
  return (
    <div className="min-h-[60vh] pt-36 pb-24 sm:pt-40 lg:pt-44">
      <PageHero
        description="How SipNow collects, uses and protects your information."
        onBack={onBack}
        tag="Legal & Policies"
        title="Privacy Policy"
      />
      <Reveal className="mx-auto max-w-3xl px-margin-mobile md:px-margin-desktop">
        <section className="glass-panel space-y-6 rounded-3xl border border-primary/30 p-8 md:p-12">
          <div>
            <h2 className="font-headline-sm text-2xl">
              Information we collect
            </h2>
            <p className="mt-2 text-on-surface-variant">
              We collect account, contact, delivery and order information needed
              to provide SipNow services.
            </p>
          </div>
          <div>
            <h2 className="font-headline-sm text-2xl">How we use it</h2>
            <p className="mt-2 text-on-surface-variant">
              Your information is used to create your account, verify orders,
              complete delivery or pickup, and provide customer support.
            </p>
          </div>
          <div>
            <h2 className="font-headline-sm text-2xl">Your choices</h2>
            <p className="mt-2 text-on-surface-variant">
              You can review and update your profile and saved addresses from
              your Profile page.
            </p>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
