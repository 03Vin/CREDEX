export interface ToolUsage {
  tool: string;
  plan: string;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolUsage[];
  teamSize: number;
  useCase: 'coding' | 'writing' | 'data' | 'research' | 'mixed';
}

export interface ToolAuditResult {
  tool: string;
  currentSpend: number;
  recommendedAction: string;
  potentialSavings: number;
  reason: string;
}

export interface AuditResult {
  perToolBreakdown: ToolAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  showCredexCall: boolean;
}

export function runAudit(input: AuditInput): AuditResult {
  const perToolBreakdown: ToolAuditResult[] = [];
  let totalMonthlySavings = 0;

  for (const usage of input.tools) {
    let result: ToolAuditResult = {
      tool: usage.tool,
      currentSpend: usage.monthlySpend,
      recommendedAction: 'Keep current plan',
      potentialSavings: 0,
      reason: 'Your plan seems optimal for your usage.'
    };

    switch (usage.tool.toLowerCase()) {
      case 'cursor':
        result = auditCursor(usage, input.teamSize);
        break;
      case 'github copilot':
      case 'copilot':
        result = auditCopilot(usage, input.teamSize);
        break;
      case 'claude':
        result = auditClaude(usage, input.teamSize);
        break;
      case 'chatgpt':
        result = auditChatGPT(usage, input.teamSize);
        break;
      case 'gemini':
        result = auditGemini(usage, input.teamSize);
        break;
      case 'anthropic api':
        result = auditAnthropicAPI(usage, input.teamSize);
        break;
      case 'openai api':
        result = auditOpenAIAPI(usage, input.teamSize);
        break;
      case 'windsurf':
        result = auditWindsurf(usage, input.teamSize);
        break;
    }

    perToolBreakdown.push(result);
    totalMonthlySavings += result.potentialSavings;
  }

  const totalAnnualSavings = totalMonthlySavings * 12;
  const showCredexCall = totalMonthlySavings > 500;

  return {
    perToolBreakdown,
    totalMonthlySavings,
    totalAnnualSavings,
    showCredexCall
  };
}

function auditCursor(usage: ToolUsage, teamSize: number): ToolAuditResult {
  const result: ToolAuditResult = {
    tool: 'Cursor',
    currentSpend: usage.monthlySpend,
    recommendedAction: 'Keep current plan',
    potentialSavings: 0,
    reason: 'Your plan seems optimal for your usage.'
  };

  const plan = usage.plan.toLowerCase();

  // Rule: Team plan for 2 users or less is often overkill if they don't need centralized billing/admin
  if (plan === 'business' || plan === 'teams') {
    if (usage.seats <= 2) {
      const proCost = 20 * usage.seats;
      const currentCost = usage.monthlySpend; // or 40 * usage.seats
      const savings = currentCost - proCost;

      if (savings > 0) {
        result.recommendedAction = 'Downgrade to Pro';
        result.potentialSavings = savings;
        result.reason = 'You have 2 or fewer users. Downgrading to Pro saves costs unless you strictly need team admin features.';
      }
    }
  }

  // Rule: If paying more than standard pricing, flag it
  const expectedMaxCost = plan === 'business' || plan === 'teams' ? 40 * usage.seats : 20 * usage.seats;
  if (usage.monthlySpend > expectedMaxCost) {
    result.recommendedAction = 'Review overages';
    result.potentialSavings = usage.monthlySpend - expectedMaxCost;
    result.reason = 'You are paying more than the base plan cost, likely due to usage overages. Consider plan limits.';
  }

  return result;
}

function auditCopilot(usage: ToolUsage, teamSize: number): ToolAuditResult {
  const result: ToolAuditResult = {
    tool: 'GitHub Copilot',
    currentSpend: usage.monthlySpend,
    recommendedAction: 'Keep current plan',
    potentialSavings: 0,
    reason: 'Your plan seems optimal for your usage.'
  };

  const plan = usage.plan.toLowerCase();

  // Rule: If using Business but seats are very low, might be Individual (though Business has more features)
  if (plan === 'business' && usage.seats === 1) {
    const indCost = 10;
    const savings = usage.monthlySpend - indCost;
    if (savings > 0) {
      result.recommendedAction = 'Switch to Individual';
      result.potentialSavings = savings;
      result.reason = 'You are paying for a Business plan for 1 user. Individual plan covers most features for half the price.';
    }
  }

  return result;
}

function auditClaude(usage: ToolUsage, teamSize: number): ToolAuditResult {
  const result: ToolAuditResult = {
    tool: 'Claude',
    currentSpend: usage.monthlySpend,
    recommendedAction: 'Keep current plan',
    potentialSavings: 0,
    reason: 'Your plan seems optimal for your usage.'
  };

  const plan = usage.plan.toLowerCase();

  // Rule: Team plan for 2 users or less is often overkill
  if (plan === 'team' || plan === 'teams') {
    if (usage.seats <= 2) {
      const proCost = 20 * usage.seats;
      const savings = usage.monthlySpend - proCost;
      if (savings > 0) {
        result.recommendedAction = 'Downgrade to Pro';
        result.potentialSavings = savings;
        result.reason = 'You have 2 or fewer users on a Team plan. Downgrading to Pro saves costs.';
      }
    }
  }

  return result;
}

function auditChatGPT(usage: ToolUsage, teamSize: number): ToolAuditResult {
  const result: ToolAuditResult = {
    tool: 'ChatGPT',
    currentSpend: usage.monthlySpend,
    recommendedAction: 'Keep current plan',
    potentialSavings: 0,
    reason: 'Your plan seems optimal for your usage.'
  };

  const plan = usage.plan.toLowerCase();

  // Rule: Team plan for 2 users or less is often overkill
  if (plan === 'team' || plan === 'business') {
    if (usage.seats <= 2) {
      const plusCost = 20 * usage.seats;
      const savings = usage.monthlySpend - plusCost;
      if (savings > 0) {
        result.recommendedAction = 'Downgrade to Plus';
        result.potentialSavings = savings;
        result.reason = 'You have 2 or fewer users on a Team plan. Downgrading to Plus saves costs.';
      }
    }
  }

  return result;
}

function auditGemini(usage: ToolUsage, teamSize: number): ToolAuditResult {
  const result: ToolAuditResult = {
    tool: 'Gemini',
    currentSpend: usage.monthlySpend,
    recommendedAction: 'Keep current plan',
    potentialSavings: 0,
    reason: 'Your plan seems optimal for your usage.'
  };

  return result;
}

function auditAnthropicAPI(usage: ToolUsage, teamSize: number): ToolAuditResult {
  const result: ToolAuditResult = {
    tool: 'Anthropic API',
    currentSpend: usage.monthlySpend,
    recommendedAction: 'Keep current plan',
    potentialSavings: 0,
    reason: 'Your plan seems optimal for your usage.'
  };

  // Rule: If spend is high, suggest Credex credits
  if (usage.monthlySpend > 500) {
    result.recommendedAction = 'Switch to Credex credits';
    result.potentialSavings = usage.monthlySpend * 0.2; // Assume 20% savings
    result.reason = 'Your spend is high enough to benefit from Credex discounted credits.';
  }

  return result;
}

function auditOpenAIAPI(usage: ToolUsage, teamSize: number): ToolAuditResult {
  const result: ToolAuditResult = {
    tool: 'OpenAI API',
    currentSpend: usage.monthlySpend,
    recommendedAction: 'Keep current plan',
    potentialSavings: 0,
    reason: 'Your plan seems optimal for your usage.'
  };

  // Rule: If spend is high, suggest Credex credits
  if (usage.monthlySpend > 500) {
    result.recommendedAction = 'Switch to Credex credits';
    result.potentialSavings = usage.monthlySpend * 0.2; // Assume 20% savings
    result.reason = 'Your spend is high enough to benefit from Credex discounted credits.';
  }

  return result;
}

function auditWindsurf(usage: ToolUsage, teamSize: number): ToolAuditResult {
  const result: ToolAuditResult = {
    tool: 'Windsurf',
    currentSpend: usage.monthlySpend,
    recommendedAction: 'Keep current plan',
    potentialSavings: 0,
    reason: 'Your plan seems optimal for your usage.'
  };

  return result;
}
