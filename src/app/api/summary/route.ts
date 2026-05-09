import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export async function POST(request: Request) {
  try {
    const { currentSpend, potentialSavings, recommendations } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      console.warn('ANTHROPIC_API_KEY is not set. Falling back to templated summary.');
      return NextResponse.json({ summary: getFallbackSummary(currentSpend, potentialSavings) });
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const prompt = `You are a expert financial auditor for tech startups. Analyze the following AI spend audit data and provide a concise, personalized summary paragraph of approximately 100 words.

Highlight where they are overspending and the most impactful action they can take. Be encouraging but direct.

Audit Data:
- Current Monthly Spend: $${currentSpend}
- Potential Monthly Savings: $${potentialSavings}
- Top Recommendations:
${recommendations}

Output only the summary paragraph.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307', // Using a fast/cheap model for summary
      max_tokens: 200,
      messages: [
        { role: 'user', content: prompt }
      ],
    });

    // Extract text from message
    const content = message.content[0];
    const summary = content.type === 'text' ? content.text : getFallbackSummary(currentSpend, potentialSavings);

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating AI summary:', error);
    // Graceful fallback
    const { currentSpend, potentialSavings } = await request.clone().json().catch(() => ({ currentSpend: 0, potentialSavings: 0 }));
    return NextResponse.json({ 
      summary: getFallbackSummary(currentSpend, potentialSavings),
      error: 'Failed to generate summary'
    });
  }
}

function getFallbackSummary(currentSpend: number, potentialSavings: number): string {
  if (potentialSavings > 500) {
    return `Based on our analysis, your current AI spend of $${currentSpend.toLocaleString()}/mo has significant optimization opportunities. You could potentially save $${potentialSavings.toLocaleString()}/mo by adjusting your plans and utilizing Credex credits. We recommend booking a consultation with Credex to capture these savings.`;
  } else if (potentialSavings > 0) {
    return `You are currently spending $${currentSpend.toLocaleString()}/mo on AI tools. We found some opportunities to optimize your stack and save about $${potentialSavings.toLocaleString()}/mo. Review the recommendations below to see where you can adjust your plans.`;
  } else {
    return `Great news! Your current AI spend of $${currentSpend.toLocaleString()}/mo appears to be well-optimized for your team size and use cases. Keep up the good work monitoring your stack!`;
  }
}
