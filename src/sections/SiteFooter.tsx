import * as stylex from '@stylexjs/stylex'

import { Box } from '../base/Box'
import { BrandMark } from '../base/BrandMark'
import { Grid } from '../base/Grid'
import { Link } from '../base/Link'
import { List, ListItem } from '../base/List'
import { Prose } from '../base/Prose'
import { Stack } from '../base/Stack'
import { Text } from '../base/Text'
import { darkSurface } from '../styles/theme'
import { m } from '../messages'
import { color, layout, space, text } from '../styles/tokens.stylex'

const styles = stylex.create({
  footer: {
    backgroundColor: color.surfaceInverse,
    paddingBlockEnd: space.s32,
    paddingBlockStart: space.sectionMd,
    paddingInline: space.gutter,
  },
  container: { marginInline: 'auto', maxWidth: layout.containerWide, width: '100%' },
  brand: { alignItems: 'center', display: 'flex', gap: space.s10 },
  wordmark: {
    fontSize: text.lg,
    fontWeight: text.weightBlack,
    letterSpacing: text.trackingTight,
  },
  colTitle: {
    letterSpacing: text.trackingWide,
    textTransform: 'uppercase',
  },
  link: { fontSize: text.md },
  address: { fontStyle: 'normal' },
  bottom: {
    borderBlockStartColor: color.borderDefault,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: '1px',
    marginBlockStart: space.s32,
    paddingBlockStart: space.s24,
  },
  legalLink: { fontSize: text.base },
})

export function SiteFooter() {
  return (
    // Inverse surface: the Dark theme resolves every Role token below to its
    // dark value. No on-dark colour is hard-coded here.
    <Box as="footer" style={[darkSurface, styles.footer]}>
      <Box style={styles.container}>
        <Grid floor="md" gap="s32">
          <Stack gap="s16">
            <Box style={styles.brand}>
              <BrandMark />
              <Text tone="heading" style={styles.wordmark}>
                {m.site.name}
              </Text>
            </Box>
            <Prose>{m.footer.tagline}</Prose>
          </Stack>

          <Box as="nav" aria-label={m.footer.servicesLabel}>
            <Stack gap="s12">
              <Text size="sm" tone="muted" weight="semibold" style={styles.colTitle}>
                {m.footer.servicesLabel}
              </Text>
              <List gap="s10">
                {m.footer.services.map((link) => (
                  <ListItem key={link.text}>
                    <Link href={link.href} variant="nav" style={styles.link}>
                      {link.text}
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Stack>
          </Box>

          <Box as="nav" aria-label={m.footer.specialtiesLabel}>
            <Stack gap="s12">
              <Text size="sm" tone="muted" weight="semibold" style={styles.colTitle}>
                {m.footer.specialtiesLabel}
              </Text>
              <List gap="s10">
                {m.footer.specialties.map((link) => (
                  <ListItem key={link.text}>
                    <Link href={link.href} variant="nav" style={styles.link}>
                      {link.text}
                    </Link>
                  </ListItem>
                ))}
              </List>
            </Stack>
          </Box>

          <Stack gap="s12">
            <Text size="sm" tone="muted" weight="semibold" style={styles.colTitle}>
              {m.footer.contactLabel}
            </Text>
            {/* Region and country only — the registered address is a private
                residence and is not published (issue #30). */}
            <Box as="address" style={styles.address}>
              <Stack gap="s10">
                <Link href={m.footer.emailHref} variant="nav" style={styles.link}>
                  {m.footer.email}
                </Link>
                <Link href={m.site.phoneHref} variant="nav" style={styles.link}>
                  {m.site.phone}
                </Link>
                {m.footer.addressLines.map((line) => (
                  <Text key={line} size="md" tone="prose">
                    {line}
                  </Text>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Grid>

        <Stack
          direction="row"
          justify="between"
          align="center"
          wrap
          gap="s16"
          style={styles.bottom}
        >
          <Text size="base" tone="muted">
            {m.footer.copyright}
          </Text>
          {/* Legal pages are out of scope for v1; these links are inert. */}
          <Box as="nav" aria-label={m.footer.legalLabel}>
            <List direction="row" wrap gap="s16">
              {m.footer.legalLinks.map((link) => (
                <ListItem key={link.text}>
                  <Link href={link.href} variant="nav" style={styles.legalLink}>
                    {link.text}
                  </Link>
                </ListItem>
              ))}
            </List>
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}
