import { z } from 'zod'

// Mirrors CreateBookingRequest's @NotBlank/@Size; confirm limits with the backend.
export const bookingTopicSchema = z.object({
  topic: z
    .string()
    .trim()
    .min(5, 'Tell the mentor a bit more (at least 5 characters).')
    .max(255, 'Keep the topic under 255 characters.'),
})

export type BookingTopicForm = z.infer<typeof bookingTopicSchema>
