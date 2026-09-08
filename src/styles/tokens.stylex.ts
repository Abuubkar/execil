import * as stylex from '@stylexjs/stylex'

/**
 * Design system tokens. See issue #8 for the normalisation rule and ADR 0001.
 *
 * Each category is ONE defineVars group holding both Ramp keys (raw values,
 * named by hue and step) and Role keys (named for their job, derived from a
 * Ramp key in the same group). A two-file palette/semantic split compiles but
 * breaks under subtree theming: chained var() is substituted where it is
 * declared, so a createTheme on the palette group is silently ignored.
 *
 * Components import ROLES ONLY. Ramp keys exist to derive Roles.
 */
export const palette = stylex.defineVars({
  // --- ink
  ink900: '#0F1B2D',
  ink800: '#1F2933',
  ink700: '#3E4C59',
  ink600: '#4B5A68',
  ink500: '#5B6B7A',
  ink400: '#9AA5B1',
  ink300: '#B4BFCC',
  ink200: '#D5DDE3',
  ink100: '#E7ECEF',
  ink50: '#F7F9FA',
  white: '#FFFFFF',

  // --- Ramp: teal. teal800 is new (issue #8) — the canvas had no accessible
  // hover step once teal700 became the base for AA contrast.
  teal800: '#085252',
  teal700: '#0A6B6B',
  teal600: '#0E8A8A',
  teal100: '#CDE7E7',
  teal50: '#E6F4F4',
  teal25: '#EEF6F6',

  // --- Ramp: accents
  green600: '#2E9E5B',
  green200: '#9FD4A3',
  red600: '#C0392B',
  red50: '#FFF0F0',
  clay700: '#964533',
  amber300: '#FFD166',
})

/**
 * Roles. Components import THESE and never `palette`.
 *
 * NOTE — deviation from issue #8, which specified one group with roles derived
 * inside it via `palette.ink900`. That form compiles under Babel but does
 * not typecheck: a self-referential defineVars produces TS7022 ("implicitly has
 * type 'any' because it ... is referenced directly or indirectly in its own
 * initializer"), and the only way to silence it loses key-level type safety.
 *
 * Two groups in one file is equivalent for how theming is actually used here.
 * The rejected arrangement in #8 was two separate FILES; the failure mode it
 * described — a createTheme on the palette group not flowing into roles — still
 * applies, but the Dark theme overrides ROLES, never ramp keys, so it is not
 * reachable. Roles still compile to chained var(), and createTheme on this
 * group re-emits and re-resolves them. Verified in the built CSS.
 */
export const color = stylex.defineVars({
  // --- Roles: text
  textHeading: palette.ink900,
  textBody: palette.ink800,
  textSecondary: palette.ink700,
  textProse: palette.ink600,
  textMuted: palette.ink500,
  /** Decorative only — 2.50:1 on white. Never put text in this. */
  textSubtle: palette.ink400,
  textLink: palette.teal700,
  textLinkHover: palette.teal800,
  textDanger: palette.red600,
  /** 3.41:1 — large display text only. */
  textSuccess: palette.green600,
  /** teal600, 4.18:1 on white. Passes AA for LARGE text (3:1) and fails for
   *  normal text. Issue #8 demoted teal600 to exactly this use: the hero
   *  headline emphasis at clamp(34px, 5.4vw, 64px). Never use it below 24px. */
  textAccentDisplay: palette.teal600,
  textStat: palette.clay700,
  /** surfaceRaised goes translucent in the Dark theme; this does not. */
  textOnBrand: palette.white,

  // --- Roles: surface
  surfacePage: palette.ink50,
  surfaceRaised: palette.white,
  surfaceAccent: palette.teal50,
  surfaceAccentSoft: palette.teal25,
  surfaceBrand: palette.teal700,
  surfaceBrandHover: palette.teal800,
  surfaceDanger: palette.red50,
  surfaceNotice: palette.amber300,
  surfaceInverse: palette.ink900,

  // --- Roles: border
  borderDefault: palette.ink100,
  borderStrong: palette.ink200,
  borderAccent: palette.teal100,
  borderDashed: palette.ink300,

  // --- Roles: focus. WCAG 1.4.11 wants 3:1 for the indicator; teal700 is 6.31:1.
  focusRing: palette.teal700,
})

export const text = stylex.defineVars({
  // Fixed scale: 22 raw canvas sizes collapsed to 8 steps.
  xs: '11px',
  sm: '12px',
  base: '13px',
  md: '15px',
  lg: '18px',
  xl: '20px',
  '2xl': '24px',
  '3xl': '28px',

  // Fluid: 5 canvas clamps collapsed to 3.
  displayLg: 'clamp(34px, 5.4vw, 64px)',
  displayMd: 'clamp(28px, 3.4vw, 40px)',
  lead: 'clamp(16px, 1.6vw, 19px)',

  // Satoshi replaces both canvas families; weight carries the distinction.
  // The fallback family names are computed by scripts/font-metrics.mjs and
  // must be listed explicitly — fontaine cannot rewrite a stack held in a var.
  familySans:
    '"Satoshi Variable", "Satoshi Variable Fallback: Arial", "Satoshi Variable Fallback: Roboto", Arial, Roboto, sans-serif',

  weightRegular: '400',
  weightMedium: '500',
  weightSemibold: '600',
  weightBold: '700',
  weightBlack: '800',

  leadingTight: '1.1',
  leadingHeading: '1.15',
  leadingSnug: '1.25',
  leadingBody: '1.5',

  trackingTight: '-0.02em',
  trackingNormal: '0',
  trackingWide: '0.08em',
})

export const space = stylex.defineVars({
  s4: '4px',
  s6: '6px',
  s8: '8px',
  s10: '10px',
  s12: '12px',
  s14: '14px',
  s16: '16px',
  s18: '18px',
  s20: '20px',
  s24: '24px',
  s28: '28px',
  s32: '32px',
  s40: '40px',
  s48: '48px',

  // Section padding: 8 canvas clamp patterns collapsed to 4, plus the gutter.
  sectionLg: 'clamp(56px, 7vw, 96px)',
  sectionMd: 'clamp(48px, 6vw, 80px)',
  sectionSm: 'clamp(40px, 5vw, 64px)',
  /** Hero negates this to bleed the picture to the top edge. */
  heroTop: 'clamp(48px, 6vw, 80px)',
  gutter: '24px',
})

export const radius = stylex.defineVars({
  sm: '6px',
  md: '8px',
  lg: '10px',
  xl: '12px',
  '2xl': '14px',
  '3xl': '16px',
  full: '9999px',
  circle: '50%',
})

export const shadow = stylex.defineVars({
  sm: '0 1px 2px rgba(15, 27, 45, 0.04)',
  md: '0 2px 6px rgba(15, 27, 45, 0.05)',
  lg: '0 10px 24px rgba(15, 27, 45, 0.08)',
  xl: '0 20px 50px rgba(15, 27, 45, 0.25)',
  brand: '0 14px 30px rgba(10, 107, 107, 0.14)',
  brandSm: '0 6px 18px rgba(14, 138, 138, 0.25)',
  glowSuccess: '0 0 0 4px rgba(46, 158, 91, 0.16), 0 0 10px rgba(46, 158, 91, 0.5)',
  glowBrand: '0 0 0 4px rgba(10, 107, 107, 0.16), 0 0 10px rgba(10, 107, 107, 0.5)',
})

/**
 * defineConsts: inlined at build time, no CSS variable, never themed.
 * NOTE: defineConsts cannot reference defineVars (hard compiler error, and
 * facebook/stylex#1549 is open). The reverse works.
 */
export const motion = stylex.defineConsts({
  fast: '150ms',
  base: '250ms',
  pulse: '1300ms',
  ease: 'ease',
})

/**
 * Breakpoints, as COMPLETE media query strings.
 *
 * StyleX 0.19 cannot interpolate a const into a media-query key — a template
 * literal like `@media (min-width: ${screen.nav})` fails the build with
 * "Invalid media query syntax". The whole query has to be the const, used
 * directly as a computed key: `{ default: 'none', [screen.navUp]: 'flex' }`.
 * The raw widths are exported too, for anything that needs the number.
 */
export const screen = stylex.defineConsts({
  /** Nav and Hero layout. HERO_SIZES repeats this number; change both. */
  nav: '1040px',
  navUp: '@media (min-width: 1040px)',
  navDown: '@media (max-width: 1039.98px)',
  /** Comparison table only — stacks below this. Issue #17. */
  table: '600px',
  tableUp: '@media (min-width: 600px)',
  tableDown: '@media (max-width: 599.98px)',
})

export const layout = stylex.defineConsts({
  headerHeight: '68px',
  containerWide: '1280px',
  containerHero: '880px',
  containerText: '640px',
  containerNarrow: '440px',
  heroBandMax: '480px',
  gridFloorSm: '200px',
  gridFloorMd: '250px',
  gridFloorLg: '300px',
})
