import { Skeleton } from '@/components/ui/skeleton'

function ColumnSkeleton() {
  return (
    <div className="flex flex-col bg-gray-50 rounded-xl p-4 flex-1">
      <Skeleton className="h-4 w-24 mb-3" />
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-3">
            <Skeleton className="h-4 w-full mb-3" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function BoardSkeleton() {
  return (
    <div className="flex gap-4 mt-6">
      <ColumnSkeleton />
      <ColumnSkeleton />
      <ColumnSkeleton />
    </div>
  )
}
