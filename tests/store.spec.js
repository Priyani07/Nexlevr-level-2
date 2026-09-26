import { test, expect } from '@playwright/test';

test('browse, search, persistent bag, registration, checkout and order history', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('36 products', { exact: true })).toBeVisible();

  await page.getByRole('textbox', { name: 'Search products' })
    .fill('Studio Headphones');
  await expect(page.getByText('1 products', { exact: true })).toBeVisible();

  await page.getByRole('button', {
    name: 'Add Studio Headphones to bag'
  }).click();

  await page.reload();

  await page.getByRole('button', {
    name: 'Shopping bag, 1 items'
  }).click();

  await page.getByRole('button', {
    name: 'Continue to checkout'
  }).click();

  const loginDialog = page.getByRole('dialog', {
    name: 'Welcome back.',
    exact: true
  });

  await expect(loginDialog).toBeVisible();

  await loginDialog.getByRole('button', {
    name: 'Create account',
    exact: true
  }).click();

  const registerDialog = page.getByRole('dialog', {
    name: 'Make yourself at home.',
    exact: true
  });

  await registerDialog.getByLabel('Full name', { exact: true })
    .fill('Browser Customer');
  await registerDialog.getByLabel('Email address')
    .fill(`browser-${Date.now()}@test.com`);
  await registerDialog.getByLabel('Password', { exact: true })
    .fill('BrowserTest123!');

  await registerDialog.getByRole('button', {
    name: 'Create account',
    exact: true
  }).click();

  await expect(registerDialog).not.toBeVisible();

  await page.getByRole('button', {
    name: 'Shopping bag, 1 items'
  }).click();

  await page.getByRole('button', {
    name: 'Continue to checkout'
  }).click();

  await page.getByLabel('Mobile number').fill('9876543210');
  await page.getByLabel('Street address').fill('12 Demo Road');
  await page.getByLabel('City', { exact: true }).fill('Mandsaur');
  await page.getByLabel('PIN code').fill('458001');

  await page.getByRole('button', { name: /Place order/ }).click();

  await expect(page.getByRole('heading', {
    name: 'My orders.'
  })).toBeVisible();

  await expect(page.getByText('Placed', { exact: true })).toBeVisible();
  await expect(page.getByText('Studio Headphones', {
    exact: true
  })).toBeVisible();

  await page.getByRole('button', {
    name: 'Sign out',
    exact: true
  }).click();

  await expect(page.getByRole('button', {
    name: 'Sign in',
    exact: true
  })).toBeVisible();
});

test('mobile collection fits viewport and category filter works', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');

  await expect(page.getByText('36 products', { exact: true })).toBeVisible();

  await page.getByRole('button', {
    name: 'Accessories',
    exact: true
  }).click();

  await expect(page.getByText('9 products', { exact: true })).toBeVisible();

  expect(
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)
  ).toBe(true);
});