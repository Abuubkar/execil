# 10 — What is the shape of messages.json, and how is rule 7 enforced?

Type: grilling
Status: open
Blocked by: 01

## Question

Every user-facing string comes from one English `messages.json`. Decide:

- Structure: nested by section and component, or flat keys; how lists (FAQ pairs, specialties, systems, comparison rows, trust points) are represented.
- Rich text: the hero heading has highlighted spans; how emphasis is encoded without HTML in JSON.
- Typed access: generated types or `as const` import, and the accessor components use.
- Placeholders: how bracketed placeholder values are marked so the client can find them later.
- Enforcement: which lint rule from the Vite+ tooling flags string literals in JSX outside `base/`, or whether review is the only guard.

Produce the schema and an excerpt as the resolution.
