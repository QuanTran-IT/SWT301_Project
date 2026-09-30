# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\visual.spec.js >> Visual Regression Testing with Percy & Playwright >> Check form after entering valid date
- Location: tests\visual.spec.js:18:3

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  955 pixels (ratio 0.01 of all image pixels) are different.

  Snapshot: valid-date-form.png

Call log:
  - Expect "toHaveScreenshot(valid-date-form.png)" with timeout 5000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 955 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 955 pixels (ratio 0.01 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - generic [ref=e3]:
    - generic [ref=e4]: 📅
    - generic [ref=e5]: Form1
    - button "✕" [ref=e7] [cursor=pointer]
  - generic [ref=e8]:
    - img "FPT University" [ref=e10]
    - heading "Date Time Checker" [level=1] [ref=e11]
    - generic [ref=e12]:
      - generic [ref=e13]:
        - text: Day
        - textbox "Day" [ref=e14]: "29"
      - generic [ref=e15]:
        - text: Month
        - textbox "Month" [ref=e16]: "2"
      - generic [ref=e17]:
        - text: Year
        - textbox "Year" [ref=e18]: "2024"
    - generic [ref=e19]:
      - button "Clear" [ref=e20] [cursor=pointer]
      - button "Check" [active] [ref=e21] [cursor=pointer]
    - generic [ref=e22]: 29/2/2024 is correct date time!
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | const percySnapshot = require('@percy/playwright');
  3  | const path = require('path');
  4  | 
  5  | test.describe('Visual Regression Testing with Percy & Playwright', () => {
  6  | 
  7  |   test('Check Date Time form appearance', async ({ page }) => {
  8  |     // Mở file index.html cục bộ (hoặc URL nếu bạn chạy server)
  9  |     await page.goto('http://localhost:3000/index.html');
  10 | 
  11 |     // 1. Chụp ảnh màn hình mặc định bằng Playwright (PW Shots)
  12 |     await expect(page).toHaveScreenshot('default-form.png');
  13 | 
  14 |     // 2. Chụp ảnh màn hình đẩy lên Percy dashboard
  15 |     await percySnapshot(page, 'Date Time Checker - Default State');
  16 |   });
  17 | 
  18 |   test('Check form after entering valid date', async ({ page }) => {
  19 |     await page.goto('http://localhost:3000/index.html');
  20 | 
  21 |     // Điền form
  22 |     await page.locator('#day').fill('29');
  23 |     await page.locator('#month').fill('2');
  24 |     await page.locator('#year').fill('2024'); // Năm nhuận
  25 |     
  26 |     // Bấm check
  27 |     await page.locator('#btnCheck').click();
  28 | 
  29 |     // Chụp lại giao diện sau khi check thành công bằng Playwright
> 30 |     await expect(page).toHaveScreenshot('valid-date-form.png');
     |                        ^ Error: expect(page).toHaveScreenshot(expected) failed
  31 |     
  32 |     // Đẩy lên Percy
  33 |     await percySnapshot(page, 'Date Time Checker - Valid Date');
  34 |   });
  35 | 
  36 |   test('Check form after entering invalid date', async ({ page }) => {
  37 |     await page.goto('http://localhost:3000/index.html');
  38 | 
  39 |     await page.locator('#day').fill('31');
  40 |     await page.locator('#month').fill('2');
  41 |     await page.locator('#year').fill('2023'); 
  42 |     
  43 |     await page.locator('#btnCheck').click();
  44 | 
  45 |     await expect(page).toHaveScreenshot('invalid-date-form.png');
  46 |     await percySnapshot(page, 'Date Time Checker - Invalid Date');
  47 |   });
  48 | 
  49 | });
  50 | 
```