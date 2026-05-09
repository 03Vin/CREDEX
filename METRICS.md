# Metrics

## North Star Metric
**Metric**: Number of Qualified Leads Generated per Week.
**Why**: This tool is explicitly a lead-generation asset for Credex. While traffic and audits completed are important, they are vanity metrics if they don't convert into leads that Credex can actually help (companies with significant savings opportunities). A "qualified lead" is defined as a user who completes the audit, shows >$500/mo in potential savings, and provides their email or books a consultation.

## 3 Input Metrics
These metrics drive the North Star metric:
1.  **Form Completion Rate**: The percentage of visitors who land on the page and actually complete the audit form. If this is low, the form is too long or intimidating.
2.  **High-Savings Percentage**: The percentage of completed audits that show >$500/mo in savings. This tells us if we are reaching the right target audience (startups with high spend) vs individuals or hobbyists.
3.  **Lead Capture Conversion Rate**: The percentage of high-savings users who actually opt-in to be contacted or book a call. This measures the effectiveness of our CTA and value proposition on the results page.

## What to Instrument First
I would instrument **PostHog** or **Plausible** (privacy-focused) to track:
- Page views on the landing page.
- Form field interactions (to see where people drop off).
- Form submissions (Audit completed).
- Clicks on the "Book Credex Consultation" or "Save Report" buttons.

## Pivot Decision Trigger
If after **1,000 completed audits**, the conversion rate from "Audit Completed" to "Qualified Lead" is **less than 1%**, that triggers a pivot decision.
- **Interpretation**: This would mean either the audit logic isn't finding real savings, or the audience reaching the tool is not the target audience (e.g., they are all individuals spending $20/mo), or the value proposition on the results page is not compelling enough. We would need to pivot the targeting or the logic.
