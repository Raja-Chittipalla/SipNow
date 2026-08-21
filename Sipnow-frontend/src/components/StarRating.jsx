export default function StarRating({ rating, reviewCount }) {
  const rounded = Math.round(rating * 2) / 2;
  const fullStars = Math.floor(rounded);
  const hasHalf = rounded % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1 pt-0.5">
      <div className="flex text-primary">
        {Array.from({ length: fullStars }).map((_, i) => (
          <span
            key={`full-${i}`}
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            star
          </span>
        ))}
        {hasHalf && (
          <span
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            star_half
          </span>
        )}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <span
            key={`empty-${i}`}
            className="material-symbols-outlined text-[20px]"
            style={{ fontVariationSettings: '"FILL" 0' }}
          >
            star
          </span>
        ))}
      </div>
      <span className="text-on-surface-variant text-[10px]">
        {rating.toFixed(1)} ({reviewCount})
      </span>
    </div>
  );
}
