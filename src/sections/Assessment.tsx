import { useState } from 'react'
import * as stylex from '@stylexjs/stylex'

import { Badge } from '../base/Badge'
import { Button } from '../base/Button'
import { Dot } from '../base/Dot'
import { Field } from '../base/Field'
import { Form } from '../base/Form'
import { Grid } from '../base/Grid'
import { Heading } from '../base/Heading'
import { Input, Select, Textarea } from '../base/Input'
import { List, ListItem } from '../base/List'
import { Prose } from '../base/Prose'
import { Section } from '../base/Section'
import { Stack } from '../base/Stack'
import { Text } from '../base/Text'
import { VisuallyHidden } from '../base/VisuallyHidden'
import { m } from '../messages'
import { color, layout, radius, space, text } from '../styles/tokens.stylex'

const HEADING_ID = 'cta-h'
const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL ?? ''

/** Mirrors the endpoint's discriminated union (issue #12), so the UI maps each
 *  result straight onto a state. The endpoint arrives in #28; until then the
 *  submit handler is a stub that exercises every branch. */
type FailureReason = 'validation' | 'challenge' | 'rate' | 'delivery'
type FormState =
  | { status: 'idle' }
  | { status: 'submitting' }
  | { status: 'success' }
  | { status: 'failure'; reason: FailureReason }

const styles = stylex.create({
  intro: { maxWidth: layout.containerText },
  pair: {
    display: 'grid',
    gap: space.s14,
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  },
  submit: { marginBlockStart: space.s6 },
  disclaimer: { textAlign: 'center' },
  noscript: { display: 'block', marginBlockStart: space.s8 },
  panel: {
    backgroundColor: color.surfaceRaised,
    borderColor: color.borderDefault,
    borderRadius: radius['3xl'],
    borderStyle: 'solid',
    borderWidth: '1px',
    padding: space.s40,
    textAlign: 'center',
  },
  tick: {
    alignItems: 'center',
    backgroundColor: color.textSuccess,
    borderRadius: radius.circle,
    color: color.surfaceRaised,
    display: 'flex',
    fontSize: text.xl,
    height: '44px',
    justifyContent: 'center',
    width: '44px',
  },
  actions: { marginBlockStart: space.s16 },
})

/** Formats the submission as labelled lines for the clipboard fallback.
 *  FormData.get() returns string | File; only string entries are text. */
function formatSubmission(data: FormData): string {
  const fields = m.assessment.form.fields
  return Object.entries(fields)
    .map(([key, field]) => {
      const value = data.get(key)
      return [field.label, typeof value === 'string' ? value : ''] as const
    })
    .filter(([, value]) => value.length > 0)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n')
}

export function Assessment() {
  const [state, setState] = useState<FormState>({ status: 'idle' })
  const [submission, setSubmission] = useState('')
  const [copied, setCopied] = useState(false)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    setSubmission(formatSubmission(data))
    setState({ status: 'submitting' })
    // Stub until the endpoint lands in #28. Every branch is reachable by
    // changing this one line, which is how all four states were verified.
    globalThis.setTimeout(() => {
      setState({ status: 'success' })
    }, 600)
  }

  /** The clipboard write can reject — insecure context, denied permission, or
   *  no user gesture. Confirm only on success, so the label never claims
   *  "Copied" when nothing was. The mailto path still works either way. */
  const copy = () => {
    navigator.clipboard.writeText(submission).then(
      () => {
        setCopied(true)
      },
      () => {
        setCopied(false)
      },
    )
  }

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(m.assessment.failure.subject)}`

  return (
    <Section id="assessment" labelledBy={HEADING_ID} tone="accent" size="lg">
      <Grid floor="lg" gap="s40">
        <Stack gap="s16" style={styles.intro}>
          <Badge tone="accent">{m.assessment.badge}</Badge>
          <Heading level={2} size="displayMd" id={HEADING_ID}>
            {m.assessment.title}
          </Heading>
          <Prose>{m.assessment.lead}</Prose>
          <List gap="s10">
            {m.assessment.bullets.map((bullet) => (
              <ListItem key={bullet}>
                <Dot tone="brand" size="xs" />
                <Text size="md" tone="body">
                  {bullet}
                </Text>
              </ListItem>
            ))}
          </List>
        </Stack>

        {state.status === 'success' ? (
          // Polite: announced without stealing focus. Replaces the form, so
          // there is no submitted-but-still-editable state to resubmit.
          <Stack gap="s8" align="center" style={styles.panel} role="status">
            <Text aria-hidden style={styles.tick}>
              ✓
            </Text>
            <Heading level={3} size="xl">
              {m.assessment.success.title}
            </Heading>
            <Prose>{m.assessment.success.body}</Prose>
          </Stack>
        ) : state.status === 'failure' ? (
          // Assertive, unlike success: a failure the visitor must notice.
          <Stack gap="s8" align="center" style={styles.panel} role="alert">
            <Heading level={3} size="xl">
              {m.assessment.failure.title}
            </Heading>
            <Prose>{m.assessment.failure.body}</Prose>
            <Stack direction="row" gap="s12" justify="center" wrap style={styles.actions}>
              <Button variant="secondary" onClick={() => globalThis.open(mailto)}>
                {m.assessment.failure.openEmail}
              </Button>
              <Button variant="secondary" onClick={copy}>
                {copied ? m.assessment.failure.copied : m.assessment.failure.copyMessage}
              </Button>
            </Stack>
          </Stack>
        ) : (
          <Form label={m.assessment.form.label} onSubmit={handleSubmit}>
            <Grid floor="sm" gap="s14">
              <Field label={m.assessment.form.fields.name.label}>
                <Input name="name" autoComplete="name" required />
              </Field>
              <Field label={m.assessment.form.fields.email.label}>
                <Input name="email" type="email" autoComplete="email" required />
              </Field>
              <Field label={m.assessment.form.fields.phone.label}>
                <Input name="phone" type="tel" autoComplete="tel" />
              </Field>
              <Field label={m.assessment.form.fields.practice.label}>
                <Input name="practice" autoComplete="organization" />
              </Field>
              <Field label={m.assessment.form.fields.specialty.label}>
                <Select
                  name="specialty"
                  options={m.assessment.form.fields.specialty.options}
                  placeholder={m.assessment.form.selectPlaceholder}
                />
              </Field>
              <Field label={m.assessment.form.fields.providers.label}>
                <Select
                  name="providers"
                  options={m.assessment.form.fields.providers.options}
                  placeholder={m.assessment.form.selectPlaceholder}
                />
              </Field>
            </Grid>

            <Field label={m.assessment.form.fields.concern.label}>
              <Select
                name="concern"
                options={m.assessment.form.fields.concern.options}
                placeholder={m.assessment.form.selectPlaceholder}
              />
            </Field>

            <Field
              label={m.assessment.form.fields.message.label}
              hint={m.assessment.form.fields.message.hint}
            >
              <Textarea name="message" rows={3} />
            </Field>

            {/* Honeypot: visually hidden and out of the tab order, NOT
                display:none — that is the pattern bots check for. */}
            <VisuallyHidden>
              <Field label={m.assessment.form.honeypotLabel}>
                <Input name="company_website" autoComplete="off" />
              </Field>
            </VisuallyHidden>

            {/* Enabled from first paint — nothing gates it on a third-party
                script (issue #12). */}
            <Button type="submit" busy={state.status === 'submitting'} style={styles.submit}>
              {state.status === 'submitting'
                ? m.assessment.form.submitting
                : m.assessment.form.submit}
            </Button>

            <Text size="base" tone="muted" style={styles.disclaimer}>
              {m.assessment.form.disclaimer}
            </Text>

            <noscript>
              <Text size="base" tone="muted" style={styles.noscript}>
                {m.assessment.form.noscript}
              </Text>
            </noscript>
          </Form>
        )}
      </Grid>
    </Section>
  )
}
