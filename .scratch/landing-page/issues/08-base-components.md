# 08 — Which base components exist, and what is each one's interface?

Type: grilling
Status: open
Blocked by: 07, 09

## Question

Rules 8 and 9: feature and page code never touches raw HTML; every element comes through a reusable base component that renders the right semantic tag from day 1. Decide:

- The inventory: containers (Section, Container, Stack, Grid), text (Heading with level, Text, VisuallyHidden), interactive (Link, Button, IconButton), lists, Table, form fields (Input, Select, Textarea, Field with label), Icon (inline SVG), Disclosure (FAQ), Nav, Footer, Address.
- Each component's props: how it takes tokens (variant props, not raw values), how it takes messages, polymorphic `as` or fixed elements, ref forwarding.
- The deep-module boundary: what stays inside a base component versus what a feature composes. Consult `codebase-design`.
- Directory layout: `base/` versus `features/` versus routes.

Produce the inventory with interfaces as the resolution.
