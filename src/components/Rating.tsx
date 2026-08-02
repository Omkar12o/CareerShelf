import { Star } from 'lucide-react'

type RatingProps = {
  rating: number
  reviewCount?: number
  size?: number
  className?: string
}

export function Rating({
  rating,
  reviewCount,
  size = 16,
  className = '',
}: RatingProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Star className="text-amber-400" size={size} fill="currentColor" />
      <span className="text-sm font-semibold text-gray-900">
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined ? (
        <span className="text-sm text-gray-400">
          ({reviewCount} reviews)
        </span>
      ) : null}
    </div>
  )
}
