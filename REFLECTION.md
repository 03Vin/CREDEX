# Reflection

A structured reflection on the project.

## What I Learned
- **AI Tool Pricing Complexity:** I learned that AI tools have widely varying pricing models (per-seat, usage-based, credit-based) and that many teams likely overspend simply because the "best" plan isn't obvious.
- **Next.js 15+ App Router Patterns:** Working with Server Components for metadata and Client Components for interactive UI in the App Router reinforced best practices for performance and SEO.
- **Graceful Degradation:** Implementing the Supabase fallback taught me how to build resilience into the UX so that database failures don't block the user from seeing value.

## What I Would Do Differently
- **DB First or Mock First?** I started with a mock-first approach for the results page and then added the DB. If I had 7 full days, I would probably set up the DB schema and API routes first to have a more data-driven flow from the start.
- **Interactive Visualizations:** I used CSS and gradients for the UI, but adding dynamic charts (e.g., with Recharts) would make the breakdown even more compelling.
- **More Granular Audit Rules:** The audit engine is currently deterministic. With more time, I would feed the anonymized usage data to an LLM to generate more nuanced, non-obvious optimization strategies.

## What I Am Proud Of
- **The Visual Aesthetic:** I am really proud of the premium dark theme. It feels like a real product, not a school project.
- **The Audit Engine Logic:** I managed to cover all requested tools with realistic pricing rules in a clean, maintainable TypeScript file.
- **Developer Experience:** Setting up the project with Vitest and CI workflows from day 1 ensured that I could iterate with confidence.

## Conclusion
This assignment was a fantastic exercise in "shipping a product" rather than just writing code. It forced me to think about business value (saving money, lead capture) alongside technical implementation.
