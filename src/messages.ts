import messages from './messages.json'

/** Every user-facing string. Static import — no hook, no key strings, no
 *  codegen; `resolveJsonModule` infers the shape. See issue #11. */
export const m = messages
