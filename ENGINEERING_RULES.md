# DailySamachar Engineering Rules

**Status:** mandatory project standard  
**Applies to:** every developer, contractor, reviewer, and AI coding assistant  
**Project:** DailySamachar  
**Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, WPGraphQL, Headless WordPress  
**Authority:** this document is normative. If code, a ticket, or a prompt conflicts with it, stop and resolve the conflict in an ADR or with the owning team before merging.

The terms **MUST**, **MUST NOT**, **REQUIRED**, **SHOULD**, **SHOULD NOT**, and **MAY** are normative. An exception is valid only when it is documented, approved by an owner, time-bounded, and covered by a follow-up issue. AI assistants MUST apply these rules to generated code and MUST report any rule they cannot satisfy.

## Contents

1. [Engineering Principles](#engineering-principles)
2. [Code Quality Standards](#code-quality-standards)
3. [Coding Rules](#coding-rules)
4. [Folder Rules](#folder-rules)
5. [Naming Rules](#naming-rules)
6. [Component Rules](#component-rules)
7. [Styling Rules](#styling-rules)
8. [GraphQL Rules](#graphql-rules)
9. [Performance Rules](#performance-rules)
10. [Testing Rules](#testing-rules)
11. [Git Rules](#git-rules)
12. [Forbidden Patterns](#forbidden-patterns)
13. [Definition of Done](#definition-of-done)

---

## Engineering Principles

### 1. Build for readers and maintainers

Production code is read more often than it is written. Prefer explicit names, small units, predictable control flow, and domain vocabulary. A clever abstraction that saves ten lines but costs a reviewer ten minutes is a failed trade.

### 2. SOLID

- **Single Responsibility:** a module has one reason to change. A mapper maps; a repository fetches; a component presents.
- **Open/Closed:** extend behavior through stable interfaces and composition; do not edit a central switch for every new provider.
- **Liskov Substitution:** implementations of `CmsAdapter` must honor the same nullability, error, timeout, and ordering contracts.
- **Interface Segregation:** expose narrow interfaces such as `ArticleReader`, not a 30-method CMS god interface.
- **Dependency Inversion:** UI and use cases depend on domain contracts; transport and WordPress details are injected at the composition root.

### 3. DRY, applied carefully

Do not duplicate a rule, invariant, or security decision. Do duplicate tiny, unrelated markup when premature abstraction would hide intent. Extract only when the repeated concept has the same reason to change and a stable API.

### 4. KISS

Use the simplest design that meets the current reliability, accessibility, and performance requirements. A plain server function is preferable to a state machine when no state machine is needed. Complexity requires an ADR or measurable benefit.

### 5. YAGNI

Do not add future configuration, providers, generic repositories, or feature flags without a current consumer and removal owner. Future mobile, AI, search, and notification plans must not distort today’s reading path.

### 6. Clean code

Functions answer one question. Names reveal intent. Side effects are visible at boundaries. Error paths are first-class. Comments explain _why_ and link to the decision; comments that merely restate code are prohibited.

### 7. Composition over inheritance

Prefer props, slots, hooks, adapters, and small policies. React component inheritance, class hierarchies for domain models, and base “manager” classes are forbidden unless an ADR demonstrates substitutability and a real extension need.

### 8. Separation of concerns

Rendering, data access, domain policy, validation, telemetry, and styling have separate seams. A route can compose them; it cannot own all of them.

### 9. Dependency injection

Inject CMS adapters, clocks, random ID generators, feature flags, and telemetry into services that need them. Do not import a mutable singleton into domain logic. Dependency injection may be a function parameter; a container framework is not required.

### 10. Optimize for safe change

Every change must have a clear owner, test seam, rollback story, and observable outcome. Backwards-compatible contracts are mandatory when multiple deployments or clients can overlap.

---

## Code Quality Standards

### Required gates

Every pull request MUST pass:

1. Prettier format check.
2. ESLint with zero new warnings.
3. TypeScript strict type check.
4. Unit/integration tests relevant to the change.
5. Production build.
6. Accessibility checks for changed UI.
7. Security review for auth, input, secrets, or third-party code.

`any`, `@ts-ignore`, disabled lint rules, skipped tests, and snapshot-only verification require a line-level reason and reviewer approval. They are not acceptable as a way to make CI green.

### Complexity budgets

- File: **≤ 300 lines** preferred, **≤ 450 lines** hard limit without an approved exception.
- Function: **≤ 40 lines** preferred, **≤ 80 lines** hard limit.
- React component: **≤ 250 lines** preferred, **≤ 350 lines** hard limit.
- Cyclomatic complexity: **≤ 10** per function; split policy branches above this.
- Parameter count: **≤ 4** positional parameters; use an input object above that.
- Import count: investigate modules with more than 25 direct imports.
- Nesting: **≤ 3** control-flow levels; use guard clauses or extraction above this.

These are review triggers, not excuses to split coherent code into meaningless fragments. The reviewer must assess cohesion and readability.

### Clean-code example

```ts
// Good: policy is explicit and testable.
export function canPublishArticle(article: Article, actor: Actor): boolean {
  return actor.roles.includes('editor') && article.status === 'ready';
}

// Bad: hidden policy in a UI event handler.
onClick={() => user?.role === 'admin' && fetch('/publish?id=' + id)};
```

---

## Coding Rules

### TypeScript rules

1. `strict: true` is mandatory; do not weaken it at file or project scope.
2. Prefer discriminated unions and branded IDs to stringly typed state.
3. Prefer `unknown` over `any`; narrow at the boundary.
4. Validate external data at runtime with Zod or an equivalent schema.
5. Export types from the owning slice; do not recreate them in consumers.
6. Use `readonly` for values not intended to mutate.
7. Use `satisfies` to validate configuration without widening inferred literals.
8. Never assert a type merely to silence an error. Prove the invariant or change the type.
9. Avoid enums for wire values; use string literal unions unless runtime reverse mapping is required.
10. Use exhaustive `switch` handling with an `assertNever` helper for closed unions.
11. Public service functions declare explicit return types.
12. Do not expose CMS DTOs as UI props.
13. Dates crossing a boundary are ISO strings; domain code converts them to validated date values.
14. Avoid optional properties when absence and `undefined` have different meaning; model the distinction.
15. Do not mutate function arguments, props, or cached query results.

```ts
type LoadState<T> =
  { status: "idle" } | { status: "loading" } | { status: "success"; data: T } | { status: "error"; error: AppError };
```

### React rules

1. Components are pure with respect to render inputs.
2. Hooks are called unconditionally and only from components or hooks.
3. Effects synchronize with external systems; they are not a general-purpose event handler.
4. Prefer derived values during render over state plus synchronization effects.
5. Use stable keys based on domain identity, never array indexes for editorial lists.
6. Event handlers describe user intent (`handleBookmark`) rather than implementation (`handleClick2`).
7. Use semantic HTML before ARIA and native controls before custom controls.
8. Do not put secrets, CMS tokens, or private content in client components.
9. Keep client islands at the leaf; a page-level `'use client'` requires an ADR.
10. Context values are stable, narrow, and dependency-like; Context is not a global event bus.

### Next.js rules

1. Server Components are the default for routes, layouts, and content reads.
2. `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, and `not-found.tsx` follow framework conventions.
3. Route params and `searchParams` are validated before use.
4. Use `generateMetadata` from domain models; never duplicate title logic in JSX.
5. Use route handlers for webhooks and bounded HTTP APIs, not as a second internal service layer.
6. Server Actions require authorization, input validation, idempotency considerations, and explicit revalidation.
7. Use `redirect` and `notFound` for their intended control flow; do not throw string errors.
8. Keep Node-only dependencies out of Edge Runtime modules.
9. Choose `dynamic`, `revalidate`, `force-cache`, and `no-store` intentionally and document why.
10. Do not access `window`, `document`, or storage from Server Components.

### Server Components

Server Components MUST own initial editorial reads, metadata, structured data, and non-interactive composition. They may call services and repositories, but never GraphQL documents directly. Their props to Client Components must be serializable and minimal.

### Client Components

Client Components are reserved for events, local state, browser APIs, and client-only libraries. A Client Component MUST have a clear reason in its module comment when that reason is not obvious. Keep its data contract view-oriented and prevent accidental import of server-only modules.

### Hooks

Hooks MUST be cohesive, deterministic from their inputs, and named `useThing`. A hook that fetches server state must use an approved cache strategy and stable query key. Hooks MUST clean up subscriptions, timers, observers, and abort controllers. Do not create a hook solely to hide a two-line expression.

### Error handling

Errors MUST be typed, logged once at the appropriate boundary, and mapped to a safe user message. Never catch an error and continue with invalid state. Preserve `cause` when wrapping errors. Retry only idempotent operations and only for classified transient failures.

### Performance

Performance is a feature. New code MUST state its rendering mode, cache behavior, client JavaScript impact, image behavior, and loading state. Avoid work in render, unbounded loops, serial network waterfalls, and accidental hydration of static content.

### Accessibility

WCAG 2.2 AA is the minimum. All interactive behavior must work with keyboard and screen reader. Focus must be visible and managed for dialogs, menus, route transitions, and validation errors. Color is never the only signal. Honor reduced motion and zoom to 200%.

### Security

Validate and sanitize at trust boundaries. Treat WordPress HTML, URLs, cookies, headers, query parameters, and third-party responses as untrusted. Secrets are server-only, logs are redacted, and authorization is checked in the service—not only hidden in the UI.

---

## Folder Rules

### Canonical layout

```text
src/
├── app/          # routes, layouts, metadata, route handlers
├── shared/       # domain-neutral UI, API primitives, config, types
├── entities/     # article, author, category, media models
├── features/     # user actions and workflows
├── widgets/      # composed page sections
├── processes/    # cross-cutting initialization and orchestration
├── services/     # external systems and use cases
├── providers/    # React runtime providers
├── hooks/        # truly cross-cutting hooks
├── constants/    # stable primitive constants
├── config/       # validated environment and application config
├── types/        # cross-cutting contracts
├── animations/   # reusable motion definitions
└── styles/       # global and token styles
```

### Import matrix

| From        | May import                            | MUST NOT import                              |
| ----------- | ------------------------------------- | -------------------------------------------- |
| `app`       | every lower layer through public APIs | raw GraphQL, private slice files             |
| `processes` | `providers`, `services`, `shared`     | page-specific UI internals                   |
| `widgets`   | `features`, `entities`, `shared`      | `app`, raw CMS DTOs                          |
| `features`  | `entities`, `shared`                  | sibling features, `app`, route handlers      |
| `entities`  | `shared`                              | features, widgets, routes                    |
| `services`  | `shared`, external SDKs               | React UI, browser globals in server services |
| `shared`    | standard library, approved packages   | all domain layers                            |

Rules:

1. Imports cross layers downward only.
2. Same-layer slices do not import each other; compose in the next layer up.
3. Deep imports into another slice’s `model`, `lib`, or `api` are forbidden.
4. Every slice exposes an intentional `index.ts` public API where consumers exist.
5. Legacy `src/components` imports are transitional and require a migration issue.
6. A path alias does not justify bypassing ownership or layer boundaries.

---

## Naming Rules

| Item       | Required format          | Good                         | Bad               |
| ---------- | ------------------------ | ---------------------------- | ----------------- |
| Files      | lowercase kebab-case     | `article-card.tsx`           | `ArticleCard.tsx` |
| Folders    | lowercase kebab-case     | `breaking-news`              | `BreakingNews`    |
| Functions  | verb-first camelCase     | `mapCmsArticle`              | `doThing`         |
| Variables  | descriptive camelCase    | `publishedArticles`          | `x`               |
| Booleans   | `is/has/can/should`      | `isDraft`                    | `draftFlag`       |
| Types      | PascalCase noun          | `ArticleSummary`             | `article_type`    |
| Interfaces | capability/contract name | `CmsAdapter`                 | `IAdapter`        |
| Enums      | prefer string unions     | `type Locale = 'hi' \| 'en'` | `LocaleEnum`      |
| Constants  | UPPER_SNAKE_CASE         | `MAX_PAGE_SIZE`              | `maxPageSize`     |
| Components | PascalCase               | `ArticleCard`                | `articleCard`     |
| Hooks      | `use` + PascalCase       | `useArticleSearch`           | `articleHook`     |
| Routes     | lowercase nouns          | `/news/[slug]`               | `/getNews`        |
| Query      | `get/list/search` + noun | `GetArticleBySlug`           | `FetchStuff`      |
| Mutation   | verb + noun              | `UpdateBookmark`             | `DoMutation`      |

Names MUST use product vocabulary. Avoid `data`, `item`, `thing`, `misc`, `temp`, `helper`, `manager`, and unexplained acronyms. A name that requires a comment to explain its purpose is a refactoring signal.

---

## Component Rules

### Limits and structure

- Maximum file: 450 lines; split by responsibility before reaching the limit.
- Maximum component: 350 lines; target 150 or fewer.
- Maximum function: 80 lines; target 40 or fewer.
- Maximum component nesting: 6 meaningful DOM/component levels in one render branch; extract sections above this.
- Maximum public props: 8; use a view-model object or composition when more are genuinely required.
- Maximum boolean props: 2; use a variant union or distinct components above this.
- Maximum conditional branches in JSX: 4; move policy to a model/helper above this.

### Memoization

Do not add `memo`, `useMemo`, or `useCallback` by reflex. Add them when profiling, expensive computation, or referential equality demonstrates value. Never use memoization to conceal unstable state design. Server Components do not need client memoization.

### State and composition

1. Keep transient state at the lowest component that owns it.
2. Lift state only to the nearest common owner.
3. Use URL state for shareable filters, pagination, sorting, and search.
4. Use server state tools for server data; never mirror it into multiple local states.
5. Compose widgets from feature/entity public APIs.
6. Prefer slots and `children` over prop flags that alter large layouts.
7. Every component defines loading, empty, error, and disabled behavior where applicable.

```tsx
type CardProps = {
  article: ArticleSummary;
  variant?: "standard" | "compact";
  footer?: React.ReactNode;
};
```

---

## Styling Rules

1. Tailwind utilities and project design tokens are the default.
2. Inline `style` props are forbidden for static styling. They are allowed only for measured runtime values, CSS custom-property injection, or third-party APIs, with a comment.
3. Use the spacing scale; arbitrary values require a documented design need.
4. Use semantic color tokens, not raw hex values in components.
5. Mobile-first responsive classes are mandatory for layout changes.
6. Reserve layout space for images, advertisements, embeds, and async widgets.
7. Reading content uses a constrained measure (`max-w-prose` or equivalent).
8. Focus-visible styles are mandatory for all keyboard-interactive elements.
9. Dark mode changes tokens, surfaces, borders, imagery, and contrast—not only the page background.
10. Animations must be short, purposeful, interruptible, and removed/reduced for `prefers-reduced-motion`.
11. Do not use color alone for status, validation, or navigation state.
12. Use `clsx`/`tailwind-merge` or the project utility for conditional classes; do not concatenate unsafe class fragments.

---

## GraphQL Rules

### Operations and schema

- Query names use `GetArticleBySlug`, `ListArticles`, or `SearchArticles`.
- Mutation names use `CreateBookmark`, `UpdateProfile`, or `DeleteBookmark`.
- Operation files live beside the owning repository or entity API.
- Select explicit fields; broad “everything” fragments are forbidden.
- Fragments describe stable view contracts (`ArticleCardFields`), not arbitrary CMS internals.
- Variables are typed, validated, and never string-interpolated.
- GraphQL DTOs are private to the adapter/repository boundary.
- Schema changes require compatibility analysis and fixture updates.

### Caching and pagination

- Public reads use Next cache tags such as `article:${id}` and `category:${slug}`.
- Personalized, preview, and mutation responses are not publicly cached.
- Lists use cursor pagination with stable ordering and a maximum page size of 50.
- The UI preserves cursors in URL state where a result is shareable.
- Never fetch an unbounded connection or recursively traverse nested content.
- Cache invalidation targets affected entities; blanket purges require an incident or migration reason.

### Errors

Inspect both transport and GraphQL errors. Map them to `NOT_FOUND`, `VALIDATION`, `RATE_LIMITED`, `DEPENDENCY_UNAVAILABLE`, or `INTERNAL`. Log operation name, variables with sensitive fields redacted, latency, status, and correlation ID. Do not expose query text, tokens, or CMS stack traces to readers.

---

## Performance Rules

### Budgets

| Metric                   |                                  Target |
| ------------------------ | --------------------------------------: |
| LCP                      |                          ≤ 2.5 s at p75 |
| INP                      |                         ≤ 200 ms at p75 |
| CLS                      |                           ≤ 0.10 at p75 |
| TTFB                     |                         ≤ 800 ms at p75 |
| Initial route JavaScript | ≤ 150 kB gzip; investigate above 200 kB |
| LCP image                |                        ≤ 250 kB typical |

### Images

Use `next/image` with known dimensions/aspect ratio, correct `sizes`, modern formats, and meaningful alt text. Preload only the actual LCP image. Lazy-load below-the-fold images. Do not use a CMS original when a transformed rendition is available. Never create layout shift by waiting for intrinsic dimensions.

### Loading and rendering

- Use dynamic imports for heavy client-only libraries, editors, charts, and media players.
- Use `loading="lazy"` or framework defaults below the fold; do not lazy-load the primary headline or LCP image.
- Use Suspense around independently slow sections, not around the entire page by default.
- Stream HTML when independent data can arrive separately.
- Avoid client fetching for SEO-critical content.
- Keep third-party scripts after the critical reading path and consent-gated where applicable.
- Measure before and after every bundle-affecting change.

### Caching

Declare cache intent at the service boundary. Use tagged cache for public editorial reads, `no-store` for private or preview data, and bounded revalidation for freshness. Cache headers must prevent private responses from shared storage. A cache hit must still return valid content if the CMS is unavailable.

---

## Testing Rules

### Test pyramid

- **Unit:** pure mappers, parsers, validators, policies, and formatters.
- **Integration:** repository/service contracts using a fake adapter or MSW; include null, timeout, retry, and malformed data.
- **E2E:** critical journeys in Playwright: home reading, article reading, search, navigation, auth, bookmarks, and error recovery.
- **Accessibility:** axe plus keyboard and focus journeys; automated checks do not replace manual review.

### Naming and location

```text
tests/
├── unit/**/*.test.ts
├── integration/**/*.test.ts
├── component/**/*.test.tsx
├── e2e/**/*.spec.ts
├── a11y/**/*.spec.ts
└── fixtures/**/*.json
```

Names describe behavior: `article-repository-timeout.test.ts`, `search-form-announces-error.test.tsx`, `article-reading.spec.ts`. Avoid `misc.test.ts` and tests that describe implementation names only.

### Coverage and quality

- Pure domain logic: **90% line and branch target**.
- Services and repositories: **80% target**, including failure paths.
- UI: meaningful behavior coverage; percentage alone is not a gate.
- No test may depend on wall-clock time, network, random order, or developer machine state.
- Use accessible roles and labels in queries; do not query private CSS classes.
- Tests must assert user-visible outcome, state transition, or contract—not merely that a function was called.
- A flaky test is a defect. Quarantine only with owner, issue, and expiry date.

---

## Git Rules

### Branches

Use `feat/`, `fix/`, `perf/`, `refactor/`, `docs/`, `test/`, or `chore/` plus a short kebab-case name: `feat/article-related-news`. Branches are short-lived and rebased or merged from protected main regularly.

### Commits

Use Conventional Commits: `feat(article): add canonical metadata`, `fix(search): handle empty query`, `docs: define GraphQL cache tags`. Subject is imperative, specific, and ≤72 characters. Do not commit generated secrets, build output, or unrelated formatting.

### Pull request checklist

- [ ] Intent, scope, screenshots, and test evidence included.
- [ ] Architecture/layer boundaries remain valid.
- [ ] Loading, empty, error, offline, and permission states considered.
- [ ] Accessibility and responsive behavior verified.
- [ ] Performance and bundle impact measured where relevant.
- [ ] Security, privacy, analytics, cache, and rollback impacts recorded.
- [ ] Documentation and ADR updated if contracts changed.

### Review checklist

Reviewers MUST inspect correctness, type safety, security, accessibility, performance, data/cache behavior, observability, test quality, and maintainability. “Looks good” is not an adequate review. Review comments distinguish blockers from suggestions. Resolve all blockers before approval.

---

## Forbidden Patterns

The following 120 patterns are prohibited. Each item is independently enforceable; repeated occurrences should be tracked as technical debt with an owner.

1. Business rules embedded in presentational JSX.
2. Direct WordPress calls from a component.
3. GraphQL documents imported by a route page.
4. A page-level `'use client'` without an ADR.
5. Secrets in `NEXT_PUBLIC_*` variables.
6. Secrets committed to the repository.
7. Tokens or cookies written to logs.
8. Unsanitized `dangerouslySetInnerHTML`.
9. User input interpolated into GraphQL text.
10. User input used as an arbitrary sort field.
11. Authorization enforced only by hiding a button.
12. Preview mode enabled by an unsigned query parameter.
13. Public caching of personalized data.
14. Public caching of draft content.
15. Blanket cache purge for a single article update.
16. Unbounded GraphQL connections.
17. Offset pagination for a high-volume feed.
18. Retry loops without a cap.
19. Automatic retries for non-idempotent mutations.
20. Catching an error and returning fake success.
21. Swallowing errors with an empty `catch`.
22. Throwing strings instead of `Error` objects.
23. Exposing stack traces to users.
24. Logging raw CMS responses containing PII.
25. A global mutable singleton for request state.
26. Module-level user/session state.
27. Prop drilling across more than two unrelated layers.
28. Context used as a global event bus.
29. Context used as a server-data cache.
30. Duplicating server data in local state without a reason.
31. Fetching route-critical content in `useEffect`.
32. Effect used to derive a value that can be computed in render.
33. Missing effect cleanup for a subscription or timer.
34. Calling hooks conditionally.
35. Calling hooks inside loops.
36. Calling hooks from ordinary utility functions.
37. Array indexes as keys for reorderable editorial content.
38. Random values as React keys.
39. Mutating props.
40. Mutating React Query cache objects in place.
41. Blind `as` assertions to silence TypeScript.
42. New `any` without an approved boundary exception.
43. `@ts-ignore` without a linked issue.
44. Disabling strict TypeScript.
45. Numeric enums for external wire values.
46. Duplicate domain types in separate slices.
47. CMS DTOs exposed as component props.
48. A “god” service with unrelated responsibilities.
49. A “god” component with fetching, mutation, layout, and analytics.
50. A file over 450 lines without an exception.
51. A function over 80 lines without an exception.
52. Cyclomatic complexity above 10 left unexplained.
53. More than eight public component props without composition.
54. Boolean prop explosion.
55. Inheritance-based React component hierarchies.
56. Generic `Manager`, `Helper`, or `Utils` dumping-ground modules.
57. Circular imports between layers.
58. Same-layer feature imports.
59. Deep imports into another slice’s private files.
60. A second API client for the same CMS.
61. A second cache strategy for the same resource without ownership.
62. REST added solely to avoid learning the existing GraphQL contract.
63. Raw `fetch` scattered through UI files.
64. Network waterfall where requests can run in parallel.
65. `Promise.all` over unbounded user-controlled input.
66. Client-side polling without cancellation and backoff.
67. WebSocket adoption without operational ownership.
68. Dynamic code import for a tiny stable primitive.
69. Eager import of a heavy editor on every route.
70. Entire icon library imported into a client bundle.
71. Raw `<img>` for first-party responsive content.
72. Missing image dimensions or aspect ratio.
73. Preloading every image.
74. Lazy-loading the LCP image.
75. Layout shift from an ad or async widget.
76. Third-party script before the reading path.
77. Animation that blocks interaction.
78. Motion with no reduced-motion fallback.
79. Hover-only interaction.
80. Color-only status indication.
81. Missing visible keyboard focus.
82. Clickable `div` used instead of a button or link.
83. Dialog without focus management.
84. Heading levels chosen for visual size.
85. Duplicate `h1` for one document.
86. Missing alt text on informative images.
87. Placeholder alt text such as “image” or filename.
88. Arbitrary hex colors in component markup.
89. Static inline style for a tokenizable value.
90. Negative-margin layout hacks without an explanation.
91. Fixed pixel layout that fails at 320px or 200% zoom.
92. Hardcoded user-visible strings outside the localization boundary.
93. Hardcoded locale or timezone assumptions.
94. Query parameters read without schema validation.
95. Route segments trusted without normalization.
96. Regex used as a substitute for HTML sanitization.
97. `eval`, `new Function`, or unsafe dynamic code.
98. Unreviewed third-party package added for trivial code.
99. Dependency with known critical vulnerability ignored.
100. Production behavior guarded by an unowned feature flag.
101. Feature flag with no removal date.
102. Analytics event containing email, token, or article body.
103. Analytics script loaded before consent when consent is required.
104. Tests that assert implementation rather than behavior.
105. Tests that rely on live WordPress.
106. Tests that depend on current date without a fake clock.
107. Snapshot used as the only test for a feature.
108. Skipped test without issue and expiry.
109. Flaky test silently retried until green.
110. Coverage threshold reduced to merge unrelated code.
111. E2E test with arbitrary sleeps instead of waiting on state.
112. A test fixture copied from production with PII.
113. Commit that combines unrelated refactor and behavior change.
114. Commit message such as “fix stuff” or “updates”.
115. Force-pushing a shared release branch.
116. Merging with required CI checks bypassed.
117. PR without rollback or migration compatibility notes for risky changes.
118. Generated build artifacts committed without an explicit policy.
119. Documentation that contradicts executable configuration.
120. AI-generated code merged without human review and test evidence.

---

## Definition of Done

No feature, fix, refactor, or AI-generated change is complete until all applicable checks pass:

- [ ] Scope and owner are clear.
- [ ] Correct FSD layer and public API are selected.
- [ ] TypeScript strict check passes without unexplained escape hatches.
- [ ] ESLint and Prettier pass.
- [ ] File, function, component, complexity, and prop budgets are respected or exception documented.
- [ ] Server/client boundary is intentional.
- [ ] Input, output, nullability, authorization, and error contracts are validated.
- [ ] Loading, empty, error, offline, retry, and permission states are implemented.
- [ ] Unit and integration tests cover success and failure paths.
- [ ] Critical E2E journeys pass.
- [ ] Accessibility checks pass, including keyboard and focus behavior.
- [ ] Responsive behavior works from 320px through large desktop and at 200% zoom.
- [ ] Images, fonts, scripts, and dynamic imports meet performance budgets.
- [ ] Cache, revalidation, pagination, and invalidation behavior is documented.
- [ ] SEO metadata, canonical, robots, sitemap, and structured data are correct where relevant.
- [ ] Security and privacy review is complete for sensitive changes.
- [ ] Analytics is consent-aware and contains no sensitive content.
- [ ] Observability includes useful logs/metrics with redaction and correlation IDs.
- [ ] Documentation and ADRs are updated.
- [ ] Rollout, monitoring, migration, and rollback plans are known.
- [ ] A human reviewer has verified the change; AI output is never self-approved.

This document is mandatory reading. A contributor who cannot explain which rules apply to a change is not ready to merge that change.
