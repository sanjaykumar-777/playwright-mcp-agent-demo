# Playwright MCP Agents

A demo project showing how to drive an **end-to-end Playwright testing workflow with AI agents** through the Model Context Protocol (MCP) inside VS Code / Cursor.

## Purpose

This project demonstrates a full, agent-assisted test lifecycle:

- **Scaffold** a Playwright + TypeScript project wired to MCP agents.
- **Plan → Generate → Heal** a test suite using three specialized agents that talk to a live browser via the `playwright-test` MCP server:
  - **Planner** (`.github/agents/playwright-test-planner.agent.md`) — explores the target app and produces a step-by-step test plan.
  - **Generator** (`.github/agents/playwright-test-generator.agent.md`) — turns the approved plan into real Playwright TypeScript tests, verifying each interaction live.
  - **Healer** (`.github/agents/playwright-test-healer.agent.md`) — reads failing test output/traces, diagnoses the root cause, and patches the tests to be resilient.

The included example suite tests the public **OrangeHRM** demo dashboard (`https://opensource-demo.orangehrmlive.com`) across Chromium, Firefox, and WebKit.

## Project structure

```
.
├── .github/agents/          # Planner / Generator / Healer agent definitions
├── .vscode/mcp.json         # Registers the playwright-test MCP server for VS Code
├── specs/                   # Test plans (e.g. orangehrm-dashboard-plan.md)
├── tests/dashboard/         # Generated Playwright tests
├── seed.spec.ts             # Seed test used as a starting point by the generator
├── playwright.config.ts     # Runs seed.spec.ts + tests/**/*.spec.ts on 3 browsers
└── tsconfig.json
```

## Getting started

```bash
# Install dependencies
npm install

# Install browser engines
npx playwright install --with-deps

# Run the full suite
npx playwright test

# Run only the dashboard tests
npx playwright test tests/dashboard/dashboard-widgets.spec.ts

# View the HTML report
npx playwright show-report

# Start the MCP server for local testing tools
npm run mcp-server
```

## The three prompts used

This project was built end-to-end using the following three prompts, one per phase of the lifecycle.

### 1. Bootstrap the project

> Initialize a new Playwright project with MCP agents for VS Code integration, install the necessary dependencies including `@playwright/test` and browsers, run the seed test to validate the setup, and start the MCP server for local testing tools.

### 2. Plan & generate a test (Orchestrator lifecycle)

> I need to write a new test for the OrangeHRM dashboard. Please act as the Orchestrator and follow this strict lifecycle:
> First, read the rules in `@playwright-test-planner.agent.md`. Analyze the target page and output a step-by-step strategy for the test. Stop and wait for my approval.
> Once I approve the plan, switch your context to `@playwright-test-generator.agent.md`. Use those specific guidelines to write the actual Playwright TypeScript code based on the plan.
> After you write the code, I will execute the test locally. If the test fails and I paste an error log into this chat, immediately assume the role of `@playwright-test-healer.agent.md` to analyze the trace and patch the code. Before generating tests — ensure a `playwright.config.ts` exists in the project root. If it does not, create one with `testDir` pointing to the test output directory. This is required for the VS Code Playwright Test Explorer to recognize test cases.

### 3. Run & auto-heal on failure

> Please run this test file. If it fails, immediately switch your context to `@playwright-test-healer.agent.md`. Read the terminal error output, analyze what went wrong with the locator, and automatically patch the code with a resilient alternative.

## Notes

- The demo app is a shared public sandbox; credentials (`Admin` / `admin123`) are shown on its login page.
- Tests use role/label-based locators and regex URL assertions for resilience.
