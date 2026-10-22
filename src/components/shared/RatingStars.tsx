export function RatingStars({ rating, count }: { rating: number; count?: number }) {
  const rounded = Math.round(rating)
  return (
    <span className="inline-flex items-center gap-1 text-sm" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      <span aria-hidden className="tracking-tight text-amber-500">
        {'★'.repeat(rounded)}
        <span className="text-neutral-300">{'★'.repeat(5 - rounded)}</span>
      </span>
      <span className="font-medium">{rating.toFixed(1)}</span>
      {count !== undefined && <span className="text-neutral-500">({count})</span>}
    </span>
  )
}
