/**
 * The ten events this page fires. NONE carries a field value, an email, a name,
 * a phone number, or any free text a visitor typed. See issue #31.
 *
 * Two of these exist to audit earlier decisions rather than to measure
 * visitors: `email_fallback_used` tests whether #12's manual recovery panel
 * actually recovers leads, and `assessment_failed` with reason "delivery" is
 * the tripwire for Cloudflare Email Service's Beta status becoming a real
 * problem rather than a noted risk.
 */
export type AnalyticsEvent =
  | { name: 'cta_clicked'; props: { location: CtaLocation; variant: 'primary' | 'secondary' } }
  | { name: 'phone_clicked'; props: { location: CtaLocation } }
  | { name: 'nav_clicked'; props: { target: string } }
  | { name: 'faq_opened'; props: { question_id: string } }
  | { name: 'form_started'; props?: undefined }
  | { name: 'assessment_submitted'; props?: undefined }
  | { name: 'assessment_failed'; props: { reason: string } }
  | { name: 'email_fallback_used'; props: { method: 'open_email' | 'copy_message' } }

export type CtaLocation = 'header' | 'hero' | 'mobile_menu' | 'assessment' | 'footer'
