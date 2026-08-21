import { useState } from "react";
import { LOGO_URL } from "../data/images.js";

export default function AgeVerification({ onConfirm }) {
  const [birthYear, setBirthYear] = useState("");
  const [error, setError] = useState("");

  const handleVerify = (e) => {
    e.preventDefault();
    const year = Number(birthYear);
    const currentYear = new Date().getFullYear();

    if (!/^\d{4}$/.test(birthYear)) {
      setError("Please enter a valid four-digit birth year.");
      return;
    }

    if (year <= 1900 || year > currentYear) {
      setError("Please enter a valid birth year.");
      return;
    }

    if (currentYear - year < 18) {
      setError("You must be 18 years or older to enter this website");
      return;
    }

    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-[200] flex min-h-screen items-center justify-center overflow-y-auto bg-background px-5 py-10 text-on-surface">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_85%,rgba(131,93,192,0.16),transparent_38%)]" />
      <section className="relative w-full max-w-sm rounded-3xl border border-outline-variant/70 bg-surface-container/95 p-7 text-center shadow-2xl md:p-9">
        <img
          alt="SipNow"
          className="mx-auto mb-5 h-16 w-16 object-contain"
          src={LOGO_URL}
        />
        <h1
          className="text-2xl leading-tight md:text-3xl"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Age Verification
        </h1>
        <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-on-surface-variant">
          You must be of legal drinking age to access this website.
        </p>

        <form className="mt-7" noValidate onSubmit={handleVerify}>
          <label className="sr-only" htmlFor="birth-year">
            Birth year
          </label>
          <input
            aria-describedby={error ? "birth-year-error" : "age-privacy"}
            aria-invalid={Boolean(error)}
            className="w-full rounded-xl border border-outline-variant/50 bg-surface-container-high px-5 py-3.5 text-center font-body-md text-on-surface outline-none transition-colors placeholder:text-on-surface-variant/70 focus:border-primary focus:ring-1 focus:ring-primary"
            id="birth-year"
            inputMode="numeric"
            maxLength={4}
            onChange={(e) => {
              setBirthYear(e.target.value.replace(/\D/g, "").slice(0, 4));
              setError("");
            }}
            placeholder="Enter Birth Year"
            value={birthYear}
          />
          {error && (
            <p
              className="mt-3 text-sm text-error"
              id="birth-year-error"
              role="alert"
            >
              {error}
            </p>
          )}
          <button
            className="mt-5 w-full rounded-xl primary-gradient px-6 py-3.5 font-label-md text-white shadow-xl shadow-primary/20 transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-container"
            type="submit"
          >
            Enter Website
          </button>
        </form>

        <p
          className="mt-5 flex items-center justify-center gap-2 text-xs leading-relaxed text-on-surface-variant/80"
          id="age-privacy"
        >
          <span aria-hidden="true">🔒</span>
          Your information is only used to verify your age.
        </p>
      </section>
    </div>
  );
}
