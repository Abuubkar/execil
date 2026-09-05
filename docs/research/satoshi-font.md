# Satoshi (Fontshare): self-hosting and shift-free loading

Research for ticket `06-satoshi-font`. Sources read on 2026-09-05. Primary sources only; secondary write-ups were not used for any claim.

## Summary and recommendation

1. **Self-host.** The ITF Free Font License v2.0 (17 Aug 2026) permits self-hosting and calls it "recommended"; the Fontshare API is "optional and is not required for web use" and carries no availability guarantee. No attribution is required. (Section 1)
2. **Ship the official files unmodified.** The licence prohibits subsetting and format conversion. So: no English-only subset, no re-encoding. Serve the WOFF2 files from the Fontshare kit exactly as supplied. (Sections 1, 2)
3. **Use the variable font, upright only unless italics are designed in.** `Satoshi-Variable` covers wght 300–900 in one ~43 KB WOFF2; each static weight is ~25 KB, so variable wins as soon as two weights are used. (Section 2)
4. **Loading: `font-display: swap` + a metric-matched local fallback + one preload.** Declare `@font-face` for Satoshi with `font-display: swap`; declare a second `@font-face` ("Satoshi Fallback") that maps `local("Arial")` (plus a Roboto variant for Android) with `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` derived from Satoshi's metrics; preload the variable WOFF2 from the root route's `head().links` with `as="font" type="font/woff2" crossorigin`. Set the font stack to `Satoshi, "Satoshi Fallback", Arial, sans-serif`. (Section 3)
5. **Compute the override values at build time from the font file.** Neither `@capsizecss/metrics` nor `fontaine` publishes Satoshi's metrics. Generate them with `fontaine`'s Vite plugin or a one-off `@capsizecss/unpack` + `@capsizecss/core` `createFontStack` script. Indicative metrics from the Fontshare API are listed below, but they are not enough to compute shipping values. (Section 3.4)
6. **StyleX cannot declare `@font-face`.** Put the `@font-face` rules in the plain CSS entry file that the StyleX Vite plugin already requires and that the root route imports; expose the family name via `stylex.defineVars`. (Section 4)
7. **Caveat:** Safari has shipped `size-adjust` but not `ascent-override`/`descent-override`/`line-gap-override` (Technology Preview only per MDN's compat data), so vertical matching does not apply there. Preloading a small file on a static, CDN-served page makes a swap after first paint unlikely; if measured CLS still exceeds 0 on Safari, switch to `font-display: optional`. (Section 3.5)

## 1. Licence: self-hosting, CDN, attribution

Satoshi is listed on Fontshare as "Closed Source / ITF Free Font License" (Fontshare Satoshi page, Details panel, https://www.fontshare.com/fonts/satoshi). The Fontshare API reports `"license_type": "itf_ffl"` for the family (https://api.fontshare.com/v2/fonts?search=satoshi).

The licence text is at https://www.fontshare.com/licenses/itf-ffl, headed "Version 2.0 - 17 Aug 2026". It is also reproduced in full on the Satoshi page's License tab.

**Self-hosting is expressly permitted and recommended.** Section 01 "Grant of License" (quoted verbatim):

> You may self-host the Font Software on your own servers or infrastructure for use on your own websites and applications, including through standard webfont technologies such as CSS @font-face. Self-hosting by end users is permitted and recommended for greater control, reliability and performance. Use of the Fontshare API is optional and is not required for web use.

Section 02 "Limitations of Usage" closes with:

> For the avoidance of doubt, nothing in this Section 02 restricts the self-hosting, embedding or other use of the Font Software by the Licensee for the Licensee's own websites, applications or other permitted uses under Section 01.

**The Fontshare CDN is not the only sanctioned delivery, and it is not guaranteed.** Section 06 states in capitals that the API "IS PROVIDED AS A CONVENIENCE AND DOES NOT FORM PART OF THE RIGHTS GRANTED" and that ITF "MAY, AT ITS SOLE DISCRETION AND WITHOUT PRIOR NOTICE, MODIFY, RESTRICT, SUSPEND OR DISCONTINUE ACCESS TO THE FONTSHARE API". The FAQ (https://www.fontshare.com/faq, "Self hosting vs Fontshare API?") says the choice "is entirely up to you", and notes the one trade-off: self-hosted files "will not be updated automatically if newer versions with bug fixes or improvements are released".

**Attribution is optional.** Section 01: "You may, but are not required to, identify or credit Indian Type Foundry or Fontshare in works created using the Font Software." FAQ: "You are not obliged to, but we'd welcome any mentions or credits".

**Modification, subsetting and format conversion are prohibited.** Section 02:

> You may not modify, edit, adapt, translate, reverse engineer, decompile, disassemble or otherwise alter the Font Software or the typeface designs embodied therein, in whole or in part, without the prior written consent of the Licensor. This includes modifying or replacing glyphs, subsetting, format conversion, or altering font names, copyright information, ownership information or other metadata.

The Definitions section lists "subsetting, format conversion" as Derivative Work, and Section 05 forbids creating Derivative Work without written consent. The FAQ ("Can I modify a Fontshare font?") restates it for web use: "You must use only the official font files supplied by Fontshare, both for desktop (OTF) and web use (WOFF, WOFF2), exactly as they are provided."

**Redistribution is prohibited; who downloads matters.** Section 02: the files may not be "distributed ... or otherwise made available to any other person or entity", including via "publicly accessible servers" (this targets redistribution of the files, not serving them to browsers via `@font-face`, which Section 01 allows). Also: "You may not provide the Font Software directly to external designers, agencies, contractors, printers or other service providers. Any third party wishing to use the Font Software must obtain their own copy directly from Fontshare". The FAQ adds: "Closed Source fonts must always be downloaded directly from Fontshare." Within an organisation, internal sharing is allowed (Section 01).

Practical consequence for this project (an agency build for a client): the licence binds whoever downloads. The cleanest reading is that the party operating the site downloads the kit from Fontshare and it lives in that party's repository; the developer should not hand the files across organisations. The licence does not spell out the agency-builds-for-client case beyond the clauses above; treat this as a nuance to raise with the client, not a blocker.

Governing law is India (Section 09). No page-view limits, no separate web licence, and "no additional license or fee" for permitted uses (Section 09).

## 2. Weights, formats, variable font, subset

**Styles.** The Satoshi page lists "10 Styles" static (Light, Light Italic, Regular, Italic, Medium, Medium Italic, Bold, Bold Italic, Black, Black Italic) and "2 Variables" (Variable, Variable Italic); Details: "Available Styles: 10 Static, 2 Variable", "Version 1.0", "Fontshare Debut 13 Mar 2021", designer Deni Anggara for ITF (https://www.fontshare.com/fonts/satoshi). The API confirms the static weights are 300/400/500/700/900 and the variable font has one axis, `wght` 300–900 (`"axes": [{"name": "wght", "range_left": 300, "range_right": 900}]`, https://api.fontshare.com/v2/fonts?search=satoshi). There is no 600 static weight; 600 is only reachable through the variable font.

**Formats.** FAQ, "What font formats do Fontshare provide?": "Fontshare provides a kit that includes fonts for both desktop use (OTF) and web use (TTF, WOFF, WOFF2). In addition, fonts with more than one style are also offered as variable fonts, where available." The download endpoint responds `content-type: application/zip`, `content-disposition: filename=Satoshi_Complete.zip` (HEAD https://api.fontshare.com/v2/fonts/download/satoshi). The Fontshare API's own CSS serves each style as `woff2`, `woff`, `truetype` with `font-display: swap`, and for the variable font `font-weight: 300 900` (https://api.fontshare.com/v2/css?f[]=satoshi@1,2&display=swap).

**Sizes** (from `content-length` on HEAD requests to the CDN URLs the API CSS references, 2026-09-05):

| File | WOFF2 | WOFF | TTF |
| --- | --- | --- | --- |
| Variable (wght 300–900, upright) | 42,588 B | 35,160 B | 127,420 B |
| Variable Italic | 43,844 B | 36,472 B | 129,748 B |
| Regular 400 | 25,516 B | 33,024 B | 73,476 B |
| Medium 500 | 25,596 B | 33,272 B | 73,756 B |
| Bold 700 | 25,328 B | 32,972 B | 73,368 B |

(The variable WOFF is smaller than its WOFF2, which is unusual; the numbers are as served. Only WOFF2 matters: web.dev quotes Bram Stein, "Use only WOFF2 and forget about everything else" and notes "WOFF2 is now supported everywhere", https://web.dev/articles/font-best-practices.) The CDN sends `access-control-allow-origin: *` and `cache-control: public, max-age=604800`.

**Recommended set for this site:** `Satoshi-Variable.woff2` only, `font-weight: 300 900`, plus `Satoshi-VariableItalic.woff2` only if the design uses italics. Two static weights already cost more bytes than the variable file.

**Subset for English-only text: none.** Subsetting is a prohibited modification (Section 1 above); web.dev's own advice is "Always check the font licenses to confirm they allow subsetting and self-hosting" (https://web.dev/articles/font-best-practices). The font is Latin-only anyway (`"script": "latin"`, 135 Latin-based languages, 504 glyphs per the Satoshi page), so there is no non-Latin payload to trim. A `unicode-range` descriptor is legal CSS and does not touch the file, but MDN notes "if it uses at least one, the whole font is downloaded" (https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range), so it buys nothing for a single Latin file.

## 3. Loading without layout shift

### 3.1 `font-display`

MDN defines the values (https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display): `swap` "Gives the font face an extremely small block period and an infinite swap period"; `optional` "Gives the font face an extremely small block period and no swap period"; `fallback` a short swap period; `block` a short block period. During the swap period text renders in the fallback and is replaced when the web font arrives, which is where the shift comes from.

web.dev (https://web.dev/articles/font-best-practices) sets out the trade-off:

> Performance: Use `font-display: optional`. This is the most "performant" approach: text render is delayed for no longer than 100ms and there's assurance that there isn't font-swap related layout shifts. The downside is that the web font won't be used if it arrives late.

> Quickly display text and still use a web-font: Use `font-display: swap` but make sure to deliver the font early enough that it does not cause a layout shift.

and suggests combining them: "use `font-display: swap` for branding and other visually distinctive page elements. Use `font-display: optional` for fonts used in body text."

Chrome's font-fallbacks article describes why `swap` alone is not enough and what fixes it: "layout shifts commonly occur when a fallback font is swapped out for the web font. However, the new APIs discussed below can reduce or eliminate this issue by making it possible to create fallback font faces that take up the same amount of space as their web font counterpart." (https://developer.chrome.com/blog/font-fallbacks/)

Recommendation: `swap` plus the metric-matched fallback in 3.3 plus preload. This keeps the brand font on a single-page site where a slow first visit has no second navigation on which `optional` would finally show it. If measured CLS from font swap is not 0, `optional` is the strict fallback: with the matched fallback it is invisible when it kicks in.

### 3.2 Preload

MDN (https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload): fonts "have to be fetched using anonymous-mode CORS", so the `<link>` needs `crossorigin` even for same-origin files. Example from MDN:

```html
<link rel="preload" href="fonts/cicle_fina-webfont.woff2" as="font" type="font/woff2" crossorigin />
```

web.dev adds the cautions: "preload ignores unicode-range declarations, and if used prudently, should only be used to load a single font format", and "when using external stylesheets, preloading the most important fonts can be very effective since the browser won't otherwise discover whether the font is needed until much later" (https://web.dev/articles/font-best-practices). This site uses an external stylesheet (the StyleX-appended CSS asset, Section 4), so the preload is justified. Preload exactly one file: the variable upright WOFF2.

web.dev also conditions self-hosting on infrastructure: "If you are considering using self-hosted fonts, confirm that your site uses a Content Delivery Network (CDN) and HTTP/2." Cloudflare satisfies both.

In TanStack Start the preload goes in the root route's `head()`; TanStack's document-head guide shows `createRootRoute({ head: () => ({ links: [{ rel: 'icon', href: '/favicon.ico' }] }) })` and requires `<HeadContent />` in the root layout's `<head>` (https://tanstack.com/router/v1/docs/framework/react/guide/document-head-management). A preload entry is the same shape with `rel: 'preload', as: 'font', type: 'font/woff2', crossOrigin: 'anonymous'`.

### 3.3 Metric-compatible fallback

The four descriptors, per MDN:

- `size-adjust` "defines a multiplier for glyph outlines and metrics associated with this font"; initial value 100%; Baseline widely available since September 2023 (https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust).
- `ascent-override` "defines the ascent metric for the font. The ascent metric is the height above the baseline that CSS uses to lay out line boxes"; default `normal` (from the font file) (https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/ascent-override).
- `descent-override` "defines the descent metric ... the height below the baseline" (https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/descent-override).
- `line-gap-override` "defines the line-gap metric for the font. The line-gap metric is the font recommended line-gap or external leading" (https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/line-gap-override).

Chrome's article gives the formulas (https://developer.chrome.com/blog/font-fallbacks/):

Overrides only (vertical match, values independent of the fallback font):

```
ascent-override   = ascent   / unitsPerEm
descent-override  = descent  / unitsPerEm
line-gap-override = line-gap / unitsPerEm
```

Overrides plus `size-adjust` (horizontal and vertical match; values depend on the fallback font):

```
size-adjust       = avgCharacterWidth of web font / avgCharacterWidth of fallback font
ascent-override   = web font ascent   / (web font UPM * size-adjust)
descent-override  = web font descent  / (web font UPM * size-adjust)
line-gap-override = web font line-gap / (web font UPM * size-adjust)
```

The article's guidance on which: overrides alone are "typically powerful enough to noticeably reduce the magnitude of font-related layout shifts"; adding `size-adjust` "can effectively eliminate font-related layout-shifts." Rule 6 says "must not cause layout shift", so use both. It also warns against faking it with `line-height`: "this practice is not recommended. Font metric overrides and size-adjust address the root issue".

Fallback font choice, same article: "Arial is the recommended fallback font for sans-serif fonts ... However, neither of these fonts is available on Android (Roboto is the only system font on Android)." Its pattern is three fallbacks:

```css
body { font-family: "Poppins", poppins-fallback, poppins-fallback-android, sans-serif; }
@font-face { font-family: poppins-fallback;         src: local("Arial");  size-adjust: ...; ascent-override: ...; descent-override: ...; line-gap-override: ...; }
@font-face { font-family: poppins-fallback-android; src: local("Roboto"); size-adjust: ...; ascent-override: ...; descent-override: ...; line-gap-override: ...; }
```

Which metrics the browser reads (hhea vs typo vs win) differs by OS; the article says for "~90% of the fonts hosted by Google Fonts" the overrides are the same on all platforms, and gives the check (`hheaLineGap == 0` and equal OS X / Windows line heights). This must be checked for Satoshi from its tables; see 3.4.

### 3.4 Computed values for Satoshi

**No tool publishes Satoshi's metrics.** `@capsizecss/metrics` 4.2.0 describes itself as a "Font metrics library for system and Google fonts" (https://github.com/seek-oss/capsize/blob/master/packages/metrics/README.md); the package's file listing on unpkg contains no `satoshi` entry (https://unpkg.com/@capsizecss/metrics@4.2.0/?meta). `fontaine` ships no metrics of its own; it reads them from your font file at build time through `@capsizecss/unpack` (dependency listed in https://github.com/unjs/fontaine/blob/main/packages/fontaine/package.json; README: "fontaine will scan your @font-face rules and generate fallback rules with the correct metrics", https://github.com/unjs/fontaine/blob/main/packages/fontaine/README.md). Chrome's framework-tools article describes the same two routes, Fontaine (Vite/Webpack plugin) or Capsize's `createFontStack` (https://developer.chrome.com/blog/framework-tools-font-fallback/).

**So the values must be computed from the downloaded font file at build time.** Two ways:

- **One-off script (recommended, values are visible in the repo):** `@capsizecss/unpack` `fromFile('public/fonts/Satoshi-Variable.woff2')` returns `ascent`, `descent`, `lineGap`, `unitsPerEm`, `xWidthAvg` (https://github.com/seek-oss/capsize/blob/master/packages/unpack/README.md); pass it with `@capsizecss/metrics/arial` and `@capsizecss/metrics/roboto` to `createFontStack` from `@capsizecss/core`, which returns the `fontFamily` string and the fallback `@font-face` rules (https://developer.chrome.com/blog/framework-tools-font-fallback/). Paste the output into the global CSS. Re-run only if the font file changes (it is pinned at Satoshi 1.0).
- **`fontaine` Vite plugin:** `FontaineTransform.vite({ fallbacks: ['Arial', 'Roboto'], resolvePath: id => new URL(`./public${id}`, import.meta.url) })` generates a `'Satoshi fallback'` face automatically. Note the README's caveat that when the family is referenced through a variable rather than a literal `font-family` in CSS, you must append `'Satoshi fallback'` to the stack yourself; that applies here because the stack lives in a StyleX `defineVars` token, not in the CSS fontaine scans.

**Indicative metrics from the Fontshare API** (`styles[].properties`, https://api.fontshare.com/v2/fonts?search=satoshi). The API does not expose `unitsPerEm` or say which table (hhea/typo/win) these come from, so they cannot be turned into shipping percentages; they are recorded here only so a build-time result can be sanity-checked:

| Style | ascending_leading | descending_leading | cap_height | x_height | y_max | y_min |
| --- | --- | --- | --- | --- | --- | --- |
| Variable | 1010 | -240 | 740 | 500 | 1129 | -256 |
| Regular 400 | 1010 | -211 | 716 | 484 | 1026 | -240 |
| Medium 500 | 1010 | -219 | 723 | 489 | 1056 | -240 |
| Bold 700 | 1010 | -229 | 731 | 494 | 1090 | -244 |

If `unitsPerEm` is 1000 (the common value; Chrome's article says 1000 or 2048 "are by far the most popular"), the overrides-only figures for the variable font would be `ascent-override: 101%; descent-override: 24%`; the `size-adjust` figure additionally needs Satoshi's `xWidthAvg` against Arial's. Do not ship these unverified.

### 3.5 Browser support caveat

MDN's compat data (`@mdn/browser-compat-data` 8.1.0, fetched 2026-09-05): `size-adjust` Chrome 92, Firefox 92, Safari 17 / iOS 17; `ascent-override`, `descent-override`, `line-gap-override` Chrome 87, Firefox 89, Safari "preview" only, iOS Safari not supported. MDN's descriptor pages mark the three overrides "Limited availability — This feature is not Baseline because it does not work in some of the most widely-used browsers." In Safari the fallback will therefore be width-matched only; its line boxes use Arial's own vertical metrics. The mitigations are the preload (the font is usually in before first paint on a static, CDN-served page with a 43 KB file) and, if needed, `font-display: optional`.

## 4. Declaring `@font-face` in a StyleX project

**StyleX has no `@font-face` API.** Its API index lists `create`, `props`, `attrs`, `defineConsts`, `defineVars`, `createTheme`, `keyframes`, `viewTransitionClass`, `positionTry`, `firstThatWorks`, `types.*`, `when.*`, `env.*`; none covers `@font-face` or global rules (https://stylexjs.com/docs/api/). "Thinking in StyleX" says only that "We're looking into ways to make other CSS identifiers such as `container-name` and `@font-face` type-safe as well" (https://stylexjs.com/docs/learn/thinking-in-stylex/). Asked for global styles, maintainer nmn answered on 9 Jan 2024: "Use a CSS file for this. StyleX is encapsulated component styles only." (https://github.com/facebook/stylex/discussions/324).

**The StyleX Vite setup already requires a plain CSS file, which is where `@font-face` goes.** The Vite installation guide says to have "at least one CSS file that is imported by a component that is part of every route, such as the root layout component", and "The StyleX unplugin package's vite plugin will inject the generated CSS in the existing CSS asset" (https://stylexjs.com/docs/learn/installation/vite/; unplugin reference: "It compiles StyleX modules, aggregates the generated CSS, and appends the result to an emitted CSS asset (or creates `stylex.css` as a fallback)", https://stylexjs.com/docs/api/configuration/unplugin/). In dev the plugin serves `/virtual:stylex.css`, and the guide shows a `DevStyleXInject` component that links that in development and the production `cssHref` otherwise.

TanStack Start's CSS guide shows how that file is attached to the root route (https://tanstack.com/start/latest/docs/framework/react/guide/css-styling):

```tsx
import appCss from '../styles/app.css?url'

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
})
```

and says side-effect CSS imports are "a good fit for app-wide CSS resets, design tokens, global utility classes, and route-level global styles" placed "in the root route or app shell to apply it to every page."

**Resulting shape:**

```css
/* src/styles/app.css — the one global stylesheet; StyleX appends its output to this asset */
@font-face {
  font-family: "Satoshi";
  src: url("/fonts/Satoshi-Variable.woff2") format("woff2");
  font-weight: 300 900;
  font-style: normal;
  font-display: swap;
}
/* Generated by the capsize/fontaine step; values come from the font file. */
@font-face {
  font-family: "Satoshi Fallback";
  src: local("Arial");
  size-adjust: <computed>%;
  ascent-override: <computed>%;
  descent-override: <computed>%;
  line-gap-override: <computed>%;
}
@font-face {
  font-family: "Satoshi Fallback Android";
  src: local("Roboto");
  /* same four descriptors, computed against Roboto */
}
```

```ts
// tokens.stylex.ts
export const fonts = stylex.defineVars({
  sans: 'Satoshi, "Satoshi Fallback", "Satoshi Fallback Android", Arial, sans-serif',
});
```

`stylex.defineVars` "creates global CSS Custom Properties (variables) that can be imported and used within `create` calls anywhere within a codebase" (https://stylexjs.com/docs/api/javascript/defineVars/), which is the sanctioned way to share the stack. The font files sit in `public/fonts/` (unmodified from the kit) and the root route's `head().links` carries both the stylesheet link and the single font preload.

## 5. Not confirmed from a primary source

- **The exact contents of `Satoshi_Complete.zip`** (file names, whether the kit's WOFF2 bytes are identical to the CDN files sized above). The FAQ states the formats (OTF, TTF, WOFF, WOFF2, plus variable) and the endpoint identifies the zip, but the archive was not downloaded in this session.
- **Satoshi's `unitsPerEm`, hhea/typo/win table values, `USE_TYPO_METRICS` flag and `xWidthAvg`.** The API metrics in 3.4 are unlabelled; the real values must be read from the font file with `@capsizecss/unpack` or fontaine. Consequently no shipping `size-adjust`/override percentages are given here.
- **Agency-for-client licensing.** The FFL and FAQ say the licensee must download from Fontshare and may not pass files to external parties; they do not address a contractor committing the kit into a client-owned repository. Raise with the client; the safe path is for the site owner's organisation to be the downloader.
- **ITF's own announcement post** (https://www.indiantypefoundry.com/news/introducing-fontshare) could not be fetched (DNS failure); nothing above depends on it.
- **TanStack Start early-hints behaviour for `?url` stylesheets** was seen only in search snippets, not read on the page; the `head().links` pattern itself is quoted from the docs.

## Sources

- Fontshare, Satoshi family page: https://www.fontshare.com/fonts/satoshi
- Fontshare, ITF Free Font License v2.0 (17 Aug 2026): https://www.fontshare.com/licenses/itf-ffl
- Fontshare FAQ: https://www.fontshare.com/faq
- Fontshare API, family metadata: https://api.fontshare.com/v2/fonts?search=satoshi
- Fontshare API, generated CSS: https://api.fontshare.com/v2/css?f[]=satoshi@1,2&display=swap
- Fontshare API, download endpoint (HEAD only): https://api.fontshare.com/v2/fonts/download/satoshi
- MDN, `font-display`: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display
- MDN, `size-adjust`: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/size-adjust
- MDN, `ascent-override`: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/ascent-override
- MDN, `descent-override`: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/descent-override
- MDN, `line-gap-override`: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/line-gap-override
- MDN, `unicode-range`: https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range
- MDN, `rel="preload"`: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/rel/preload
- MDN browser-compat-data 8.1.0 (`css.at-rules.font-face.*`): https://unpkg.com/@mdn/browser-compat-data/data.json
- Chrome for Developers, "Improved font fallbacks": https://developer.chrome.com/blog/font-fallbacks/
- Chrome for Developers, "Framework tools for font fallbacks": https://developer.chrome.com/blog/framework-tools-font-fallback/
- web.dev, "Best practices for fonts": https://web.dev/articles/font-best-practices
- fontaine README and package.json: https://github.com/unjs/fontaine/tree/main/packages/fontaine
- Capsize `@capsizecss/metrics` README: https://github.com/seek-oss/capsize/blob/master/packages/metrics/README.md
- Capsize `@capsizecss/unpack` README: https://github.com/seek-oss/capsize/blob/master/packages/unpack/README.md
- StyleX API index: https://stylexjs.com/docs/api/
- StyleX, Thinking in StyleX: https://stylexjs.com/docs/learn/thinking-in-stylex/
- StyleX, Vite installation: https://stylexjs.com/docs/learn/installation/vite/
- StyleX, `@stylexjs/unplugin`: https://stylexjs.com/docs/api/configuration/unplugin/
- StyleX, `defineVars`: https://stylexjs.com/docs/api/javascript/defineVars/
- StyleX discussion #324 (global styles): https://github.com/facebook/stylex/discussions/324
- TanStack Router, Document Head Management: https://tanstack.com/router/v1/docs/framework/react/guide/document-head-management
- TanStack Start, CSS Styling: https://tanstack.com/start/latest/docs/framework/react/guide/css-styling
