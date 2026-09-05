import * as stylex from '@stylexjs/stylex'

/**
 * Markers for stylex.when.* contextual styles. Like defineVars, defineMarker()
 * must be a named export from a .stylex file -- binding it to a local const
 * fails the build with "must be bound to a named export".
 */

/** On <summary>, so the +/x pill can react to the summary being hovered. */
export const summaryMarker = stylex.defineMarker()
