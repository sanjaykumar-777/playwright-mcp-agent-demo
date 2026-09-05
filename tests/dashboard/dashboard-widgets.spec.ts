// spec: specs/orangehrm-dashboard-plan.md
// seed: seed.spec.ts

import { test, expect, Page } from '@playwright/test';

const BASE_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php';
const LOGIN_URL = `${BASE_URL}/auth/login`;

/**
 * Log in with the given credentials starting from a fresh session.
 * Does not assert the outcome (used for negative tests too).
 */
async function login(page: Page, username: string, password: string): Promise<void> {
  await page.goto(LOGIN_URL);
  await page.getByRole('textbox', { name: 'Username' }).fill(username);
  await page.getByRole('textbox', { name: 'Password' }).fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
}

/**
 * Log in as Admin and wait until the dashboard is reached.
 */
async function loginAsAdmin(page: Page): Promise<void> {
  await login(page, 'Admin', 'admin123');
  await expect(page).toHaveURL(/\/dashboard\/index/);
}

test.describe('OrangeHRM Dashboard', () => {
  test('successful login lands on the Dashboard', async ({ page }) => {
    // Log in with valid Admin credentials
    await loginAsAdmin(page);

    // Expect to land on the dashboard with its heading visible
    await expect(page).toHaveURL(/\/dashboard\/index/);
    await expect(page.getByRole('heading', { name: 'Dashboard', level: 6 })).toBeVisible();
  });

  test('all dashboard widgets render', async ({ page }) => {
    // Given a logged-in user on the dashboard
    await loginAsAdmin(page);

    // Assert each dashboard widget title is visible
    const widgets = [
      'Time at Work',
      'My Actions',
      'Quick Launch',
      'Buzz Latest Posts',
      'Employees on Leave Today',
      'Employee Distribution by Sub Unit',
      'Employee Distribution by Location',
    ];
    for (const widget of widgets) {
      await expect(page.getByText(widget, { exact: true })).toBeVisible();
    }
  });

  test('Quick Launch shortcuts are present and navigate correctly', async ({ page }) => {
    // Given a logged-in user on the dashboard
    await loginAsAdmin(page);

    // Assert the six Quick Launch buttons are visible
    const quickLaunch = [
      'Assign Leave',
      'Leave List',
      'Timesheets',
      'Apply Leave',
      'My Leave',
      'My Timesheet',
    ];
    for (const name of quickLaunch) {
      await expect(page.getByRole('button', { name })).toBeVisible();
    }

    // Click "Assign Leave" and expect navigation to the Assign Leave page
    await page.getByRole('button', { name: 'Assign Leave' }).click();
    await expect(page).toHaveURL(/\/leave\/assignLeave/);
  });

  test('sidebar navigation opens the Admin module', async ({ page }) => {
    // Given a logged-in user on the dashboard
    await loginAsAdmin(page);

    // Click the "Admin" link in the sidebar
    await page.getByRole('link', { name: 'Admin' }).click();
    await expect(page).toHaveURL(/\/admin\/viewSystemUsers/);

    // Navigate back to the Dashboard via the sidebar
    await page.getByRole('link', { name: 'Dashboard' }).click();
    await expect(page).toHaveURL(/\/dashboard\/index/);
  });

  test('user dropdown menu allows logout', async ({ page }) => {
    // Given a logged-in user on the dashboard
    await loginAsAdmin(page);

    // Open the user dropdown menu
    await page.locator('.oxd-userdropdown-name').click();

    // Assert the menu items are visible
    for (const item of ['About', 'Support', 'Change Password', 'Logout']) {
      await expect(page.getByRole('menuitem', { name: item })).toBeVisible();
    }

    // Click "Logout" and expect to return to the login page
    await page.getByRole('menuitem', { name: 'Logout' }).click();
    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('invalid login shows an error and stays on the login page', async ({ page }) => {
    // Attempt to log in with invalid credentials
    await login(page, 'WrongUser', 'wrongpass');

    // Expect an "Invalid credentials" error and to remain on the login page
    await expect(page.getByRole('alert')).toContainText('Invalid credentials');
    await expect(page).toHaveURL(/\/auth\/login/);
  });
});
