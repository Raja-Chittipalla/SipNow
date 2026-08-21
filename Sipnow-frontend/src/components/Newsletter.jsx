import Reveal from "./Reveal.jsx";
import { useNewsletterForm } from "../hooks/useNewsletterForm.js";
import sipnowClubWhisky from "../assets/sipnow-club-whisky.jpg";

export default function Newsletter() {
  const {
    email,
    isSubscribed,
    status,
    errorMessage,
    handleChange,
    handleSubmit,
    handleUnsubscribe,
  } = useNewsletterForm();

  return (
    <Reveal className="py-16 md:py-24 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-outline-variant/30 bg-[#100e10] shadow-[0_0_50px_rgba(157,80,187,0.15)]">
        {/* Glow backdrop effects */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-primary/15 blur-[120px]" />

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[480px]">
          {/* Left Column: Form & Callouts */}
          <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between space-y-8 relative z-10">
            {/* Header section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.25em] text-primary font-semibold">
                <span className="w-6 h-[1px] bg-primary/60" />
                <span>SipNow Club</span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-on-surface leading-[1.1] tracking-tight">
                Drink Better. <br />
                <span className="text-gradient">Discover More.</span>
              </h2>
              <p className="text-on-surface-variant/80 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
                Join the SipNow Club for rare releases, expert recommendations,
                and member-only offers.
              </p>
            </div>

            {/* Newsletter Form or Subscribed View */}
            {isSubscribed ? (
              <div className="max-w-xl space-y-4 rounded-2xl border border-primary/35 bg-primary/10 p-6 backdrop-blur-md relative z-10">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-2xl text-primary shrink-0 mt-0.5">
                    verified
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-bold text-on-surface text-base sm:text-lg">
                      You're in! Welcome to the list
                    </h3>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-primary/20 text-xs">
                  <span className="text-on-surface-variant/70 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Status:{" "}
                    <strong className="text-primary font-semibold">
                      Active Member
                    </strong>
                  </span>

                  <button
                    className="text-on-surface-variant/80 hover:text-red-400 font-semibold underline transition-colors cursor-pointer disabled:opacity-50"
                    disabled={status === "unsubmitting"}
                    onClick={handleUnsubscribe}
                    type="button"
                  >
                    {status === "unsubmitting"
                      ? "Unsubscribing…"
                      : "Unsubscribe from SipNow Club"}
                  </button>
                </div>
              </div>
            ) : (
              <form
                className="max-w-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10"
                noValidate
                onSubmit={handleSubmit}
              >
                <div className="flex-grow flex flex-col gap-1.5 min-w-0">
                  <div
                    className={`flex items-center gap-3 bg-surface-container border rounded-xl px-4 py-3.5 transition-all ${
                      status === "error"
                        ? "border-red-400 focus-within:ring-1 focus-within:ring-red-400"
                        : "border-outline-variant/30 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/50"
                    }`}
                  >
                    <span className="material-symbols-outlined text-primary/70 text-[20px] shrink-0">
                      mail
                    </span>
                    <input
                      aria-invalid={status === "error"}
                      className="bg-transparent border-none p-0 focus:ring-0 text-sm text-on-surface w-full placeholder:text-on-surface-variant/50"
                      onChange={handleChange}
                      placeholder="Your email address"
                      type="email"
                      value={email}
                    />
                  </div>
                  {status === "error" && (
                    <p className="text-red-400 text-xs px-2">
                      {errorMessage || "Please enter a valid email address."}
                    </p>
                  )}
                </div>

                <button
                  className="primary-gradient text-white font-bold uppercase tracking-wider text-xs px-7 py-4 rounded-xl shadow-lg shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-60 disabled:pointer-events-none cursor-pointer"
                  disabled={status === "submitting"}
                  type="submit"
                >
                  <span>
                    {status === "submitting" ? "JOINING…" : "JOIN THE CLUB"}
                  </span>
                  <span className="material-symbols-outlined text-[16px] font-bold">
                    arrow_forward
                  </span>
                </button>
              </form>
            )}

            {/* Bottom 3 Feature Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6 border-t border-outline-variant/20">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">
                  crown
                </span>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
                    Early Access
                  </h4>
                  <p className="text-[11px] text-on-surface-variant/70">
                    Be the first to know
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:border-l sm:border-outline-variant/20 sm:pl-4">
                <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">
                  inventory_2
                </span>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
                    Rare Releases
                  </h4>
                  <p className="text-[11px] text-on-surface-variant/70">
                    Limited. Curated. Exclusive.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 sm:border-l sm:border-outline-variant/20 sm:pl-4">
                <span className="material-symbols-outlined text-primary text-xl shrink-0 mt-0.5">
                  star
                </span>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-on-surface">
                    Member Pricing
                  </h4>
                  <p className="text-[11px] text-on-surface-variant/70">
                    More value. Always.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image with Overlay */}
          <div className="lg:col-span-5 relative min-h-[320px] lg:min-h-full overflow-hidden flex items-end justify-end p-8">
            <img
              src={sipnowClubWhisky}
              alt="SipNow Club Luxury Whisky"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            {/* Subtle Gradient Overlays for smooth blending */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#100e10] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#100e10] lg:via-transparent lg:to-transparent" />

            {/* Cursive Tagline Accent at Bottom Right */}
            <div className="relative z-10 text-right space-y-1 bg-black/50 backdrop-blur-md p-3 rounded-xl border border-primary/20">
              <p className="font-serif italic text-base sm:text-lg text-primary tracking-wide">
                Better Drinks.
              </p>
              <p className="font-serif italic text-base sm:text-lg text-[#d6baff] tracking-wide">
                A Brighter Tomorrow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
