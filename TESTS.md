# Tests

This file lists the automated tests written for the project, focusing on the Audit Engine.

## Running Tests
To run the tests, execute the following command in the `spend-audit` directory:
```bash
npm test
```

## Audit Engine Tests

File: `src/__tests__/audit-engine.test.ts` (Planned)

The following tests cover the core logic of the audit engine:

1.  **Test 1: Cursor Plan Optimization**
    - **Covers**: Verifies that the engine recommends downgrading or upgrading Cursor plans based on seat count.
    - **Scenario**: 2 users on Cursor Teams should be recommended to switch to Cursor Pro if they don't need team features, or vice versa if they need team features.

2.  **Test 2: Claude vs Alternatives**
    - **Covers**: Verifies that the engine suggests cheaper alternatives for Claude if the use case matches.
    - **Scenario**: User on Claude Pro paying $20/mo but with very low usage might be suggested a cheaper option or a credit-based approach if applicable.

3.  **Test 3: Retail vs Credits Math**
    - **Covers**: Verifies that the engine correctly identifies when a user is paying retail and calculates potential savings using Credex credits.
    - **Scenario**: User spending $1,000/mo on OpenAI API at retail price. The engine should calculate savings based on a standard discount.

4.  **Test 4: Plan Fitting (Team Size)**
    - **Covers**: Verifies that plan limits are respected in recommendations.
    - **Scenario**: A team of 10 users cannot be on a plan limited to 5 users.

5.  **Test 5: Zero Spend Handling**
    - **Covers**: Edge case handling.
    - **Scenario**: If the user inputs $0 spend, the engine should return a clean bill of health and not suggest fake savings.
