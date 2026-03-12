import { z } from "zod"
import { ServiceHoursSchema } from "@/lib/schemas/service"

/**
 * Feedback Types
 */
export const FeedbackTypeEnum = z.enum(["helpful_yes", "helpful_no", "issue", "not_found"])

export type FeedbackType = z.infer<typeof FeedbackTypeEnum>

/**
 * Valid search categories for 'not_found' feedback
 */
export const FeedbackCategoryEnum = z.enum([
  "Food",
  "Crisis",
  "Housing",
  "Health",
  "Legal",
  "Financial",
  "Employment",
  "Education",
  "Transport",
  "Community",
  "Indigenous",
  "Wellness",
])

/**
 * Zod Schema for submitting feedback
 */
export const FeedbackSubmitSchema = z.object({
  service_id: z.string().optional(), // Optional for 'not_found' global feedback
  feedback_type: FeedbackTypeEnum,

  // Message is optional for simple thumbs up/down, required for others might be enforced in UI but schema allows optional
  message: z.string().max(1000, "Message must be 1000 characters or less").optional(),

  // Only relevant for 'not_found'
  category_searched: FeedbackCategoryEnum.optional(),
})

export type FeedbackSubmitPayload = z.infer<typeof FeedbackSubmitSchema>

/**
 * Database Feedback Record Interface
 */
export interface FeedbackRecord {
  id: string
  service_id: string | null
  feedback_type: FeedbackType
  message: string | null
  category_searched: string | null
  status: "pending" | "reviewed" | "resolved" | "dismissed"
  resolved_at: string | null
  resolved_by: string | null
  created_at: string
}

export const SERVICE_UPDATE_FIELDS = [
  "name",
  "name_fr",
  "description",
  "description_fr",
  "phone",
  "email",
  "url",
  "address",
  "hours",
  "hours_text",
  "hours_text_fr",
  "eligibility_notes",
  "eligibility_notes_fr",
  "access_script",
  "access_script_fr",
  "coordinates",
  "status",
] as const

export const NULLABLE_SERVICE_UPDATE_FIELDS = [
  "name_fr",
  "description_fr",
  "phone",
  "email",
  "address",
  "hours",
  "hours_text",
  "hours_text_fr",
  "eligibility_notes",
  "eligibility_notes_fr",
  "access_script",
  "access_script_fr",
  "coordinates",
  "status",
] as const

export const TEXT_SERVICE_UPDATE_FIELDS = [
  "name",
  "name_fr",
  "description",
  "description_fr",
  "phone",
  "email",
  "url",
  "address",
  "hours_text",
  "hours_text_fr",
  "eligibility_notes",
  "eligibility_notes_fr",
  "access_script",
  "access_script_fr",
  "status",
] as const

const nonEmptyString = (max: number) => z.string().trim().min(1).max(max)
const nullableString = (max: number) => nonEmptyString(max).nullable().optional()

export const ServiceUpdateFieldKeySchema = z.enum(SERVICE_UPDATE_FIELDS)

export const ServiceUpdateFieldUpdatesSchema = z
  .object({
    name: nonEmptyString(200).optional(),
    name_fr: nullableString(200),
    description: nonEmptyString(2000).optional(),
    description_fr: nullableString(2000),
    phone: z
      .string()
      .trim()
      .regex(/^[\d\s\-\(\)\+]+$/, "Invalid phone format")
      .nullable()
      .optional(),
    email: z.string().trim().email("Invalid email address").nullable().optional(),
    url: z.string().trim().url("Invalid URL").optional(),
    address: nullableString(500),
    hours: ServiceHoursSchema.nullable().optional(),
    hours_text: nullableString(200),
    hours_text_fr: nullableString(200),
    eligibility_notes: nullableString(500),
    eligibility_notes_fr: nullableString(500),
    access_script: nullableString(2000),
    access_script_fr: nullableString(2000),
    coordinates: z
      .object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180),
      })
      .nullable()
      .optional(),
    status: nullableString(100),
  })
  .strict()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field update is required",
  })

export const ServiceUpdateSubmitSchema = z.object({
  field_updates: ServiceUpdateFieldUpdatesSchema,
  justification: z.string().trim().max(500).optional(),
})

export type ServiceUpdateFieldKey = z.infer<typeof ServiceUpdateFieldKeySchema>
export type ServiceUpdateFieldUpdates = z.infer<typeof ServiceUpdateFieldUpdatesSchema>
export type ServiceUpdateSubmitPayload = z.infer<typeof ServiceUpdateSubmitSchema>

/**
 * Service Update Request Interface
 */
export interface ServiceUpdateRequest {
  id: string
  service_id: string
  requested_by: string // Partner email or ID
  field_updates: ServiceUpdateFieldUpdates
  justification: string | null
  status: "pending" | "approved" | "rejected"
  reviewed_by: string | null
  reviewed_at: string | null
  rejection_reason: string | null
  created_at: string
}

/**
 * API Response Interface
 */
export interface FeedbackApiResponse {
  success: boolean
  message?: string
  id?: string
}
