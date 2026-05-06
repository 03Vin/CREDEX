import { describe, it, expect } from 'vitest';
import { runAudit, AuditInput } from '../lib/audit-engine';

describe('Audit Engine', () => {
  it('should recommend downgrade for Cursor Team plan with <= 2 seats', () => {
    const input: AuditInput = {
      tools: [
        {
          tool: 'Cursor',
          plan: 'business', // or teams
          monthlySpend: 80, // 2 seats * 40
          seats: 2
        }
      ],
      teamSize: 2,
      useCase: 'coding'
    };

    const result = runAudit(input);

    expect(result.totalMonthlySavings).toBe(40); // (40 - 20) * 2
    expect(result.perToolBreakdown[0].recommendedAction).toBe('Downgrade to Pro');
  });

  it('should flag overages for Cursor', () => {
    const input: AuditInput = {
      tools: [
        {
          tool: 'Cursor',
          plan: 'pro',
          monthlySpend: 50, // base is 20
          seats: 1
        }
      ],
      teamSize: 1,
      useCase: 'coding'
    };

    const result = runAudit(input);

    expect(result.totalMonthlySavings).toBe(30); // 50 - 20
    expect(result.perToolBreakdown[0].recommendedAction).toBe('Review overages');
  });

  it('should recommend switch to Individual for Copilot Business with 1 seat', () => {
    const input: AuditInput = {
      tools: [
        {
          tool: 'Copilot',
          plan: 'business',
          monthlySpend: 19,
          seats: 1
        }
      ],
      teamSize: 1,
      useCase: 'coding'
    };

    const result = runAudit(input);

    expect(result.totalMonthlySavings).toBe(9); // 19 - 10
    expect(result.perToolBreakdown[0].recommendedAction).toBe('Switch to Individual');
  });

  it('should calculate total savings correctly', () => {
    const input: AuditInput = {
      tools: [
        {
          tool: 'Cursor',
          plan: 'business',
          monthlySpend: 80,
          seats: 2
        },
        {
          tool: 'Copilot',
          plan: 'business',
          monthlySpend: 19,
          seats: 1
        }
      ],
      teamSize: 2,
      useCase: 'coding'
    };

    const result = runAudit(input);

    expect(result.totalMonthlySavings).toBe(49); // 40 + 9
    expect(result.totalAnnualSavings).toBe(49 * 12);
  });

  it('should handle empty tools list', () => {
    const input: AuditInput = {
      tools: [],
      teamSize: 5,
      useCase: 'mixed'
    };

    const result = runAudit(input);

    expect(result.totalMonthlySavings).toBe(0);
    expect(result.perToolBreakdown.length).toBe(0);
  });

  it('should recommend downgrade for Claude Team plan with <= 2 seats', () => {
    const input: AuditInput = {
      tools: [
        {
          tool: 'Claude',
          plan: 'team',
          monthlySpend: 60,
          seats: 2
        }
      ],
      teamSize: 2,
      useCase: 'coding'
    };

    const result = runAudit(input);

    expect(result.totalMonthlySavings).toBe(20);
    expect(result.perToolBreakdown[0].recommendedAction).toBe('Downgrade to Pro');
  });

  it('should recommend downgrade for ChatGPT Team plan with <= 2 seats', () => {
    const input: AuditInput = {
      tools: [
        {
          tool: 'ChatGPT',
          plan: 'team',
          monthlySpend: 60,
          seats: 2
        }
      ],
      teamSize: 2,
      useCase: 'coding'
    };

    const result = runAudit(input);

    expect(result.totalMonthlySavings).toBe(20);
    expect(result.perToolBreakdown[0].recommendedAction).toBe('Downgrade to Plus');
  });

  it('should recommend Credex credits for high spend on Anthropic API', () => {
    const input: AuditInput = {
      tools: [
        {
          tool: 'Anthropic API',
          plan: 'pay-as-you-go',
          monthlySpend: 1000,
          seats: 1
        }
      ],
      teamSize: 5,
      useCase: 'coding'
    };

    const result = runAudit(input);

    expect(result.totalMonthlySavings).toBe(200);
    expect(result.perToolBreakdown[0].recommendedAction).toBe('Switch to Credex credits');
  });

  it('should recommend Credex credits for high spend on OpenAI API', () => {
    const input: AuditInput = {
      tools: [
        {
          tool: 'OpenAI API',
          plan: 'pay-as-you-go',
          monthlySpend: 1000,
          seats: 1
        }
      ],
      teamSize: 5,
      useCase: 'coding'
    };

    const result = runAudit(input);

    expect(result.totalMonthlySavings).toBe(200);
    expect(result.perToolBreakdown[0].recommendedAction).toBe('Switch to Credex credits');
  });

  it('should return 0 savings for optimal stack', () => {
    const input: AuditInput = {
      tools: [
        {
          tool: 'Cursor',
          plan: 'pro',
          monthlySpend: 20,
          seats: 1
        }
      ],
      teamSize: 1,
      useCase: 'coding'
    };

    const result = runAudit(input);

    expect(result.totalMonthlySavings).toBe(0);
    expect(result.perToolBreakdown[0].recommendedAction).toBe('Keep current plan');
  });
});
