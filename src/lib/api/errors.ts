import { isAxiosError } from 'axios'
import type { ApiErrorBody } from '../../types'

export class ApiError extends Error {
  readonly status: number
  readonly code?: string
  readonly fieldErrors?: Record<string, string>

  constructor(status: number, message: string, code?: string, fieldErrors?: Record<string, string>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.fieldErrors = fieldErrors
  }

  get isNetworkError() {
    return this.status === 0
  }
  get isConflict() {
    return this.status === 409
  }
  get isClientError() {
    return this.status >= 400 && this.status < 500
  }
}

export function toApiError(e: unknown): ApiError {
  if (e instanceof ApiError) return e
  if (isAxiosError<ApiErrorBody>(e)) {
    if (!e.response) return new ApiError(0, 'Network error. Check your connection.')
    const { status, data } = e.response
    return new ApiError(status, data?.message ?? 'Something went wrong', data?.code, data?.errors)
  }
  return new ApiError(0, e instanceof Error ? e.message : 'Something went wrong')
}

export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError
