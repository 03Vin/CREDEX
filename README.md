# AI Spend Audit Tool

A free web app that helps startups audit their AI tool spend (Cursor, Claude, ChatGPT, etc.) and discover optimization opportunities. It serves as a lead generation tool for Credex by surfacing real overspend and offering discounted credits as a solution.

## Screenshots / Recording
*Place your screenshots or a link to a 30-second screen recording here.*

## Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation
1.  Navigate to the project directory:
    ```bash
    cd spend-audit
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deploy
You can deploy this to Vercel easily by linking your GitHub repository.

## Decisions & Trade-offs

Here are 5 key decisions made during the development of this MVP:

1.  **Project in Subdirectory**: I had to create the Next.js project in a subdirectory (`spend-audit`) because the original workspace name "Credex Assignment" contains spaces and capital letters, which violate npm package naming rules when using `./` with `create-next-app`.
2.  **Hardcoded Audit Math**: I decided to use hardcoded rules and deterministic logic for the audit engine calculations instead of using AI. LLMs are unreliable with math and precise comparisons. AI is used only for the personalized summary.
3.  **Manual Input instead of API Integrations**: To reduce friction for the user and avoid handling sensitive API keys (from OpenAI or Anthropic), the tool relies on manual input of spend data. This ensures high conversion rates as users don't need to trust us with their keys.
4.  **Next.js App Router**: I chose Next.js with the App Router for its full-stack capabilities, allowing me to build the UI and API routes in the same codebase, and for its support for dynamic Open Graph tags.
5.  **Focus on Organic GTM**: I decided to focus the GTM strategy on high-intent organic channels (Hacker News, direct outreach to founders complaining about costs) rather than paid ads, as the CAC is lower and fits the "scrappy founder" mindset.

## Deployed URL
*Insert your live deployed URL here (e.g., Vercel or Netlify link).*
