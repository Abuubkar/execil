import type { AssessmentResult } from '../routes/api/assessment'

/**
 * The endpoint's own error union, so an event can never report a reason the
 * API is not capable of returning. Widening the API widens this automatically.
 */
type AssessmentFailureReason = Extract<AssessmentResult, { ok: false }>['error']

/**
 * Only the places these controls actually exist. Listing a location the page
 * does not render would make the data look complete when it is not — the
 * footer and the legal pages carry a phone link but are deliberately not
 * instrumented, so they are absent here rather than silently empty.
 */
type CtaLocation = 'hero' | 'header' | 'mobile_menu'
type PhoneLocation = 'header' | 'mobile_menu'

/**
 * Every event this site can send. Adding one means editing this file, and that
 * is the point: this union is the review surface for issue #31's rule that no
 * event carries a field value, an email, a name, a phone number, or any free
 * text a visitor typed.
 *
 * Props are named exactly. There is deliberately no index signature and no
 * `Record<string, unknown>` escape hatch — a handler cannot reach for one
 * without changing this file first.
 */
export type AnalyticsEvent =
  | { name: 'cta_clicked'; props: { location: CtaLocation; variant: 'primary' | 'secondary' } }
  | { name: 'phone_clicked'; props: { location: PhoneLocation } }
  | { name: 'nav_clicked'; props: { target: string } }
  | { name: 'faq_opened'; props: { question_id: string } }
  | { name: 'form_started'; props?: undefined }
  | { name: 'assessment_submitted'; props?: undefined }
  | { name: 'assessment_submission_failed'; props: { reason: AssessmentFailureReason } }
  | { name: 'assessment_details_copied'; props?: undefined }
  | { name: 'assessment_email_fallback_opened'; props?: undefined }
