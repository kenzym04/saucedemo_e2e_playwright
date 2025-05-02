/**
 * Login Page Test Suite
 *
 * This suite verifies the login functionality for all user types on saucedemo.com.
 * It covers both positive and negative scenarios, including:
 * - Successful login for each user type (standard, problem, performance, error, visual)
 * - Error handling for locked out users
 * - Error messages for invalid credentials and empty fields
 * Test data is managed centrally for maintainability and scalability.
 */
import * as dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = [
  'STANDARD_USER',
  'LOCKED_USER',
  'PROBLEM_USER',
  'PERFORMANCE_USER',
  'ERROR_USER',
  'VISUAL_USER',
  'SAUCE_PASSWORD',
  'SAUCE_USERNAME',
  'RESPONSE_TIME_THRESHOLD'
];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

import { test, expect } from '@playwright/test';
import { login } from '../../utils/login';
import { users } from '../../data/users';

const DASHBOARD_SELECTOR = '.inventory_list';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the correct title', async ({ page }) => {
    await expect(page).toHaveTitle('Swag Labs');
  });

  test('should display login form', async ({ page }) => {
    const loginForm = page.locator('.login_wrapper-inner');
    await expect(loginForm).toBeVisible();
  });

  test('should show error message on invalid credentials', async ({ page }) => {
    await page.fill('#user-name', 'invalidUser');
    await page.fill('#password', 'invalidPass');
    await page.click('#login-button');
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toHaveText('Epic sadface: Username and password do not match any user in this service');
  });

  test('should successfully log in with standard_user', async ({ page }) => {
    await login(page, users.standard.username ?? '', users.standard.password ?? '');
    const dashboard = page.locator(DASHBOARD_SELECTOR);
    await expect(dashboard).toBeVisible();
  });

  test('should show error for locked_out_user', async ({ page }) => {
    await login(page, users.locked.username ?? '', users.locked.password ?? '');
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toHaveText('Epic sadface: Sorry, this user has been locked out.');
  });

  test('should successfully log in with problem_user', async ({ page }) => {
    await login(page, users.problem.username ?? '', users.problem.password ?? '');
    const dashboard = page.locator(DASHBOARD_SELECTOR);
    await expect(dashboard).toBeVisible();
  });

  test('should successfully log in with performance_glitch_user', async ({ page }) => {
    await login(page, users.performance.username ?? '', users.performance.password ?? '');
    const dashboard = page.locator(DASHBOARD_SELECTOR);
    await expect(dashboard).toBeVisible();
  });

  test('should successfully log in with error_user', async ({ page }) => {
    await login(page, users.error.username ?? '', users.error.password ?? '');
    const dashboard = page.locator(DASHBOARD_SELECTOR);
    await expect(dashboard).toBeVisible();
  });

  test('should successfully log in with visual_user', async ({ page }) => {
    await login(page, users.visual.username ?? '', users.visual.password ?? '');
    const dashboard = page.locator(DASHBOARD_SELECTOR);
    await expect(dashboard).toBeVisible();
  });

  test('should show error on empty username field', async ({ page }) => {
    await page.fill('#user-name', '');
    await page.fill('#password', users.standard.password ?? '');
    await page.click('#login-button');
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toHaveText('Epic sadface: Username is required');
  });

  test('should show error on empty password field', async ({ page }) => {
    await page.fill('#user-name', users.standard.username ?? '');
    await page.fill('#password', '');
    await page.click('#login-button');
    const errorMessage = page.locator('[data-test="error"]');
    await expect(errorMessage).toHaveText('Epic sadface: Password is required');
  });
});