const { test, expect } = require('@playwright/test');
const percySnapshot = require('@percy/playwright');
const path = require('path');

test.describe('Visual Regression Testing with Percy & Playwright', () => {

  test('Check Date Time form appearance', async ({ page }) => {
    // Mở file index.html cục bộ (hoặc URL nếu bạn chạy server)
    await page.goto('http://localhost:3000/index.html');

    // 2. Chụp ảnh màn hình đẩy lên Percy dashboard (Chạy trước để không bị miss)
    await percySnapshot(page, 'Date Time Checker - Default State');

    // 1. Chụp ảnh màn hình mặc định bằng Playwright (PW Shots)
    await expect(page).toHaveScreenshot('default-form.png');
  });

  test('Check form after entering valid date', async ({ page }) => {
    await page.goto('http://localhost:3000/index.html');

    // Điền form
    await page.locator('#day').fill('29');
    await page.locator('#month').fill('2');
    await page.locator('#year').fill('2024'); // Năm nhuận

    // Bấm check
    await page.locator('#btnCheck').click();

    // Đẩy lên Percy (Chạy trước để không bị miss)
    await percySnapshot(page, 'Date Time Checker - Valid Date');

    // Chụp lại giao diện sau khi check thành công bằng Playwright
    await expect(page).toHaveScreenshot('valid-date-form.png');
  });

  test('Check form after entering invalid date', async ({ page }) => {
    await page.goto('http://localhost:3000/index.html');

    await page.locator('#day').fill('31');
    await page.locator('#month').fill('2');
    await page.locator('#year').fill('2023');

    await page.locator('#btnCheck').click();

    await percySnapshot(page, 'Date Time Checker - Invalid Date');
    await expect(page).toHaveScreenshot('invalid-date-form.png');
  });

});
