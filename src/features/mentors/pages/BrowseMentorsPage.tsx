import { EmptyState, ErrorState, PageLoader } from '../../../components/feedback/States'
import { Button } from '../../../components/ui/Button'
import { cn } from '../../../lib/utils/cn'
import { MentorCard } from '../components/MentorCard'
import { MentorFiltersForm } from '../components/MentorFiltersForm'
import { Pagination } from '../components/Pagination'
import { useMentorFilterParams } from '../hooks/useMentorFilterParams'
import { useMentors } from '../hooks/useMentors'

export default function BrowseMentorsPage() {
  const { filters, setFilters, clearFilters } = useMentorFilterParams()
  const { data, isPending, isError, error, refetch, isPlaceholderData, isFetching } =
    useMentors(filters)

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header>
        <h1 className="text-2xl font-bold">Find a mentor</h1>
        <p className="text-neutral-600">
          Verified academic and industry mentors, filtered by what you need.
        </p>
      </header>

      <MentorFiltersForm filters={filters} onApply={setFilters} onClear={clearFilters} />

      {isPending ? (
        <PageLoader label="Loading mentors…" />
      ) : isError ? (
        <ErrorState error={error} onRetry={() => refetch()} />
      ) : data.content.length === 0 ? (
        <EmptyState title="No mentors match these filters">
          <Button variant="ghost" className="mt-2" onClick={clearFilters}>
            Clear filters
          </Button>
        </EmptyState>
      ) : (
        <>
          <p className="text-sm text-neutral-600" aria-live="polite">
            {data.totalElements} mentor{data.totalElements === 1 ? '' : 's'} found
          </p>
          <ul
            className={cn(
              'grid gap-4 sm:grid-cols-2 lg:grid-cols-3',
              isPlaceholderData && 'opacity-60 transition-opacity',
            )}
          >
            {data.content.map((m) => (
              <li key={m.id} className="flex">
                <div className="flex-1">
                  <MentorCard mentor={m} />
                </div>
              </li>
            ))}
          </ul>
          <Pagination
            page={data.number}
            totalPages={data.totalPages}
            disabled={isFetching}
            onChange={(page) => setFilters({ page })}
          />
        </>
      )}
    </div>
  )
}
