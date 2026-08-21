import Reveal from "./Reveal.jsx";

/** Shared header for secondary pages: back link, eyebrow tag, title and description. */
export default function PageHero({
  onBack,
  backLabel = "Back to home",
  tag,
  title,
  description,
  flush = false,
}) {
  return (
    <Reveal
      className={
        flush
          ? "mb-16"
          : "px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto mb-16"
      }
    >
      <button
        className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-8"
        onClick={onBack}
        type="button"
      >
        <span className="material-symbols-outlined text-[18px]">
          chevron_left
        </span>

        {backLabel}
      </button>

      {tag && (
        <div className="mb-6 inline-block rounded-full border border-primary/30 bg-primary/20 px-4 py-1 font-label-md text-[10px] uppercase tracking-[0.2em] text-primary">
          {tag}
        </div>
      )}

      {title && (
        <h1 className="mb-4 font-display-lg text-4xl leading-tight sm:text-5xl md:text-[56px]">
          {title}
        </h1>
      )}

      {description && (
        <p className="max-w-2xl text-lg leading-relaxed text-on-surface-variant">
          {description}
        </p>
      )}
    </Reveal>
  );
}
