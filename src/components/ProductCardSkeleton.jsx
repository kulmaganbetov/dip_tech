// Loading skeleton matched to ProductCard layout.
export default function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="skeleton aspect-[4/3] !rounded-none" />
      <div className="space-y-3 p-5">
        <div className="skeleton h-4 w-3/4" />
        <div className="skeleton h-3 w-1/2" />
        <div className="flex items-end justify-between pt-5">
          <div className="skeleton h-6 w-24" />
          <div className="skeleton h-9 w-24 !rounded-full" />
        </div>
      </div>
    </div>
  )
}
