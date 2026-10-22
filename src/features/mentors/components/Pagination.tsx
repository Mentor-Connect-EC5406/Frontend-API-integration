import { Button } from '../../../components/ui/Button'

interface Props {
  /** Zero-based, as in Spring's Page.number. */
  page: number
  totalPages: number
  onChange: (page: number) => void
  disabled?: boolean
}

export function Pagination({ page, totalPages, onChange, disabled }: Props) {
  if (totalPages <= 1) return null
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-3">
      <Button variant="ghost" disabled={disabled || page === 0} onClick={() => onChange(page - 1)}>
        Previous
      </Button>
      <span className="text-sm text-neutral-600">
        Page {page + 1} of {totalPages}
      </span>
      <Button
        variant="ghost"
        disabled={disabled || page >= totalPages - 1}
        onClick={() => onChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  )
}
