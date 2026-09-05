# Test Plan: OrangeHRM Dashboard

**Target:** https://opensource-demo.orangehrmlive.com
**Credentials:** `Admin` / `admin123`
**Seed:** `seed.spec.ts`
**Output:** `tests/dashboard/dashboard-widgets.spec.ts`
**Starting state:** fresh/blank session (each scenario logs in independently).

## 1. Successful login lands on the Dashboard
**Steps:**
1. Navigate to `/auth/login`
2. Fill `Username` = `Admin`, `Password` = `admin123`, click `Login`

**Expected:** URL contains `/dashboard/index`; `Dashboard` heading (level 6) is visible.

## 2. All dashboard widgets render
**Steps:**
1. Given logged in on the dashboard
2. Assert each widget title is visible: `Time at Work`, `My Actions`, `Quick Launch`, `Buzz Latest Posts`, `Employees on Leave Today`, `Employee Distribution by Sub Unit`, `Employee Distribution by Location`

## 3. Quick Launch shortcuts are present and navigate correctly
**Steps:**
1. Assert the 6 Quick Launch buttons are visible (`Assign Leave`, `Leave List`, `Timesheets`, `Apply Leave`, `My Leave`, `My Timesheet`)
2. Click `Assign Leave`

**Expected:** URL contains `/leave/assignLeave`.

## 4. Sidebar navigation opens the Admin module
**Steps:**
1. Click `Admin` in the sidebar → URL contains `/admin/viewSystemUsers`
2. Click `Dashboard` in the sidebar → URL contains `/dashboard/index`

## 5. User dropdown menu allows logout
**Steps:**
1. Open the `John Doe` user dropdown
2. Assert menu items visible: `About`, `Support`, `Change Password`, `Logout`
3. Click `Logout`

**Expected:** Returns to `/auth/login`; `Login` button visible.

## 6. Invalid login shows an error (negative)
**Steps:**
1. Navigate to login, enter invalid credentials, submit

**Expected:** `Invalid credentials` alert visible; URL stays on `/auth/login`.
