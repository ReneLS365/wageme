import { test, expect } from '@playwright/test';

test('forsiden loader', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Tidsregistrering' })).toBeVisible();
});