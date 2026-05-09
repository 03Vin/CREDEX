# Prompts

This file documents the prompts used for generating the personalized AI summary of the audit.

## AI Summary Prompt

**Prompt:**
```text
You are a expert financial auditor for tech startups. Analyze the following AI spend audit data and provide a concise, personalized summary paragraph of approximately 100 words.

Highlight where they are overspending and the most impactful action they can take. Be encouraging but direct.

Audit Data:
- Current Monthly Spend: ${{currentSpend}}
- Potential Monthly Savings: ${{potentialSavings}}
- Top Recommendations:
{{recommendations}}

Output only the summary paragraph.
```

### Why I Wrote It This Way
- **Persona**: Setting the persona as an "expert financial auditor" helps set the tone (professional, direct).
- **Length Constraint**: Specifying "~100 words" helps keep it concise as requested.
- **Data Insertion**: Using placeholders makes it easy to inject the data from the audit engine.
- **Constraint**: "Output only the summary paragraph" avoids conversational filler (like "Sure, here is the summary...").

### What I Tried That Didn't Work
- Initially, I didn't specify the length, and the model generated a very long, bulleted list that duplicated the results page. I added the constraint to keep it to a single paragraph.
- I tried asking the model to calculate the savings, but it was unreliable with math. I moved the math to the hardcoded Audit Engine and only passed the results to the LLM for summarization. This fits the constraint: "For the audit math itself, hardcoded rules are correct — knowing when not to use AI is part of the test."
