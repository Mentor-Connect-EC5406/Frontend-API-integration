import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '../../../components/ui/Button'
import { useExpertiseCategories } from '../../expertise/hooks/useExpertiseCategories'
import type { MentorFilters } from '../types'

const numericString = (label: string) =>
  z
    .string()
    .trim()
    .refine((v) => v === '' || (Number.isFinite(Number(v)) && Number(v) >= 0), {
      message: `${label} must be a positive number`,
    })

const filterFormSchema = z.object({
  expertiseId: z.string(),
  industry: z.string().trim().max(100),
  minRating: z.string(),
  maxRate: numericString('Max rate'),
  sort: z.string(),
})

type FilterFormValues = z.infer<typeof filterFormSchema>

const toFormValues = (f: MentorFilters): FilterFormValues => ({
  expertiseId: f.expertiseId ?? '',
  industry: f.industry ?? '',
  minRating: f.minRating?.toString() ?? '',
  maxRate: f.maxRate?.toString() ?? '',
  sort: f.sort ?? '',
})

const toNumber = (v: string) => (v === '' ? undefined : Number(v))

const SORT_OPTIONS = [
  { value: '', label: 'Recommended' },
  { value: 'rating,desc', label: 'Highest rated' },
  { value: 'hourlyRate,asc', label: 'Price: low to high' },
  { value: 'hourlyRate,desc', label: 'Price: high to low' },
  { value: 'experienceYears,desc', label: 'Most experienced' },
]

const fieldClass =
  'mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm focus:border-ink focus:outline-none'

interface Props {
  filters: MentorFilters
  onApply: (f: Partial<MentorFilters>) => void
  onClear: () => void
}

export function MentorFiltersForm({ filters, onApply, onClear }: Props) {
  const { data: categories } = useExpertiseCategories()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    // Re-syncs when the URL changes (back/forward, "clear").
    values: toFormValues(filters),
  })

  const submit = handleSubmit((v) =>
    onApply({
      expertiseId: v.expertiseId || undefined,
      industry: v.industry || undefined,
      minRating: toNumber(v.minRating),
      maxRate: toNumber(v.maxRate),
      sort: v.sort || undefined,
    }),
  )

  return (
    <form
      onSubmit={submit}
      aria-label="Filter mentors"
      className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5 sm:grid-cols-2 lg:grid-cols-6"
    >
      <label className="text-sm font-medium lg:col-span-2">
        Expertise
        <select {...register('expertiseId')} className={fieldClass}>
          <option value="">Any expertise</option>
          {categories?.map((c) => (
            <optgroup key={c.id} label={c.name}>
              {c.expertises.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </label>

      <label className="text-sm font-medium">
        Industry
        <input {...register('industry')} placeholder="e.g. Fintech" className={fieldClass} />
      </label>

      <label className="text-sm font-medium">
        Rating
        <select {...register('minRating')} className={fieldClass}>
          <option value="">Any rating</option>
          <option value="4.5">4.5 & up</option>
          <option value="4">4.0 & up</option>
          <option value="3">3.0 & up</option>
        </select>
      </label>

      <label className="text-sm font-medium">
        Max rate / hr
        <input
          {...register('maxRate')}
          inputMode="decimal"
          placeholder="Any"
          aria-invalid={!!errors.maxRate}
          className={fieldClass}
        />
        {errors.maxRate && (
          <span className="mt-1 block text-xs text-red-600">{errors.maxRate.message}</span>
        )}
      </label>

      <label className="text-sm font-medium">
        Sort by
        <select {...register('sort')} className={fieldClass}>
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </label>

      <div className="flex gap-2 sm:col-span-2 lg:col-span-6 lg:justify-end">
        <Button variant="ghost" onClick={onClear}>
          Clear
        </Button>
        <Button type="submit">Apply filters</Button>
      </div>
    </form>
  )
}
