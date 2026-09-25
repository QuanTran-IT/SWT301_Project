const { test, expect } = require('@playwright/test');
const path = require('path');

const FILE_URL = 'file:///' + path.resolve(__dirname, '../index.html').replace(/\\/g, '/');
const BASE_URL = process.env.BASE_URL || FILE_URL;

test.describe('SWT301 - Date Time Checker Test Suite', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  // =========================================================================
  // 1. FUNCTION: USER INTERFACE (LAYOUT)
  // =========================================================================
  test.describe('Function: User Interface (Layout)', () => {
    test('TC_UI_01: Check Form title bar buttons - displayed without Maximize and Minimize box', async ({ page }) => {
      await expect(page.locator('.window-minimize')).toHaveCount(0);
      await expect(page.locator('.window-maximize')).toHaveCount(0);
      await expect(page.locator('.window-close')).toBeVisible();
    });

    test('TC_UI_02: Check FU Logo display - displayed at top-left corner', async ({ page }) => {
      const logo = page.locator('.logo-container img');
      await expect(logo).toBeVisible();
      await expect(logo).toHaveAttribute('src', 'logo.png');
    });

    test('TC_UI_03: Check Title Text - Text "Date Time Checker" is Blue forecolor, Arial font, size 26', async ({ page }) => {
      const title = page.locator('.main-title');
      await expect(title).toHaveText('Date Time Checker');
      await expect(title).toHaveCSS('font-size', '26px');
      await expect(title).toHaveCSS('font-family', /Arial/i);
    });

    test('TC_UI_04: Check Labels alignment - Labels "Day", "Month", "Year" are left-aligned', async ({ page }) => {
      const labels = page.locator('.form-group label');
      await expect(labels.nth(0)).toHaveText('Day');
      await expect(labels.nth(1)).toHaveText('Month');
      await expect(labels.nth(2)).toHaveText('Year');
    });

    test('TC_UI_05: Check Controls presence & layout - 3 Textboxes and 2 Buttons', async ({ page }) => {
      await expect(page.locator('#day')).toBeVisible();
      await expect(page.locator('#month')).toBeVisible();
      await expect(page.locator('#year')).toBeVisible();
      await expect(page.locator('#btnClear')).toBeVisible();
      await expect(page.locator('#btnCheck')).toBeVisible();
    });
  });

  // =========================================================================
  // 2. FUNCTION: "CLEAR" FUNCTION
  // =========================================================================
  test.describe('Function: "Clear" Function', () => {
    test('TC_CL_06: Check Clear button - All text in 3 textboxes are cleared', async ({ page }) => {
      await page.locator('#day').fill('15');
      await page.locator('#month').fill('8');
      await page.locator('#year').fill('2023');

      await page.locator('#btnClear').click();

      await expect(page.locator('#day')).toHaveValue('');
      await expect(page.locator('#month')).toHaveValue('');
      await expect(page.locator('#year')).toHaveValue('');
    });
  });

  // =========================================================================
  // 3. FUNCTION: "CLOSE" FUNCTION
  // =========================================================================
  test.describe('Function: "Close" Function', () => {
    test('TC_CS_07: Check Close dialog - Select No (Message box closes and application remains open)', async ({ page }) => {
      page.once('dialog', async dialog => {
        await dialog.dismiss();
      });

      await page.locator('.window-close').click();
      await expect(page.locator('.window')).toBeVisible();
    });

    test('TC_CS_08: Check Close dialog - Select Yes (Application exits completely)', async ({ page }) => {
      page.once('dialog', async dialog => {
        await dialog.accept();
      });

      await page.locator('.window-close').click();
      await expect(page.locator('.window')).toBeHidden();
    });
  });

  // =========================================================================
  // 4. FUNCTION: NUMERIC FORMAT VALIDATION
  // =========================================================================
  test.describe('Function: Numeric Format Validation', () => {
    test('TC_NF_01: Day input is non-numeric format', async ({ page }) => {
      await page.locator('#day').fill('abc');
      await page.locator('#month').fill('5');
      await page.locator('#year').fill('2020');
      await page.locator('#btnCheck').click();

      await expect(page.locator('#message')).toHaveText('Input data for Day is incorrect format!');
    });

    test('TC_NF_02: Month input is non-numeric format', async ({ page }) => {
      await page.locator('#day').fill('15');
      await page.locator('#month').fill('xyz');
      await page.locator('#year').fill('2020');
      await page.locator('#btnCheck').click();

      await expect(page.locator('#message')).toHaveText('Input data for Month is incorrect format!');
    });

    test('TC_NF_03: Year input is non-numeric format', async ({ page }) => {
      await page.locator('#day').fill('15');
      await page.locator('#month').fill('5');
      await page.locator('#year').fill('abcd');
      await page.locator('#btnCheck').click();

      await expect(page.locator('#message')).toHaveText('Input data for Year is incorrect format!');
    });
  });

  // =========================================================================
  // 5. FUNCTION: RANGE VALIDATION
  // =========================================================================
  test.describe('Function: Range Validation', () => {
    test('TC_RV_04: Day input below range (< 1)', async ({ page }) => {
      await page.locator('#day').fill('0');
      await page.locator('#month').fill('5');
      await page.locator('#year').fill('2020');
      await page.locator('#btnCheck').click();

      await expect(page.locator('#message')).toHaveText('Input data for Day is out of range!');
    });

    test('TC_RV_05: Day input above range (> 31)', async ({ page }) => {
      await page.locator('#day').fill('32');
      await page.locator('#month').fill('5');
      await page.locator('#year').fill('2020');
      await page.locator('#btnCheck').click();

      await expect(page.locator('#message')).toHaveText('Input data for Day is out of range!');
    });

    test('TC_RV_06: Month input below range (< 1)', async ({ page }) => {
      await page.locator('#day').fill('15');
      await page.locator('#month').fill('0');
      await page.locator('#year').fill('2020');
      await page.locator('#btnCheck').click();

      await expect(page.locator('#message')).toHaveText('Input data for Month is out of range!');
    });

    test('TC_RV_07: Month input above range (> 12)', async ({ page }) => {
      await page.locator('#day').fill('15');
      await page.locator('#month').fill('13');
      await page.locator('#year').fill('2020');
      await page.locator('#btnCheck').click();

      await expect(page.locator('#message')).toHaveText('Input data for Month is out of range!');
    });

    test('TC_RV_08: Year input below range (< 1000)', async ({ page }) => {
      await page.locator('#day').fill('15');
      await page.locator('#month').fill('5');
      await page.locator('#year').fill('999');
      await page.locator('#btnCheck').click();

      await expect(page.locator('#message')).toHaveText('Input data for Year is out of range!');
    });

    test('TC_RV_09: Year input above range (> 3000)', async ({ page }) => {
      await page.locator('#day').fill('15');
      await page.locator('#month').fill('5');
      await page.locator('#year').fill('3001');
      await page.locator('#btnCheck').click();

      await expect(page.locator('#message')).toHaveText('Input data for Year is out of range!');
    });
  });

  // =========================================================================
  // 6. FUNCTION: VALID DATE VERIFICATION
  // =========================================================================
  test.describe('Function: Valid Date Verification', () => {
    test('TC_VD_01: Months have 31 days (Day: "31", Month: "1", Year: "2023")', async ({ page }) => {
      await page.locator('#day').fill('31');
      await page.locator('#month').fill('1');
      await page.locator('#year').fill('2023');
      await page.locator('#btnCheck').click();

      await expect(page.locator('#message')).toHaveText('31/1/2023 is correct date time!');
    });

    test('TC_VD_02: Months have 30 days (Day: "30", Month: "4", Year: "2023")', async ({ page }) => {
      await page.locator('#day').fill('30');
      await page.locator('#month').fill('4');
      await page.locator('#year').fill('2023');
      await page.locator('#btnCheck').click();

      await expect(page.locator('#message')).toHaveText('30/4/2023 is correct date time!');
    });

    test('TC_VD_03: Non-leap year has Feb 28 (Day: "28", Month: "2", Year: "2023")', async ({ page }) => {
      await page.locator('#day').fill('28');
      await page.locator('#month').fill('2');
      await page.locator('#year').fill('2023');
      await page.locator('#btnCheck').click();

      await expect(page.locator('#message')).toHaveText('28/2/2023 is correct date time!');
    });

    test('TC_VD_04: Leap year has Feb 29 (Day: "29", Month: "2", Year: "2024")', async ({ page }) => {
      await page.locator('#day').fill('29');
      await page.locator('#month').fill('2');
      await page.locator('#year').fill('2024');
      await page.locator('#btnCheck').click();

      await expect(page.locator('#message')).toHaveText('29/2/2024 is correct date time!');
    });

    test('TC_VD_05: Year input is min number (Day: "1", Month: "1", Year: "1000")', async ({ page }) => {
      await page.locator('#day').fill('1');
      await page.locator('#month').fill('1');
      await page.locator('#year').fill('1000');
      await page.locator('#btnCheck').click();

      await expect(page.locator('#message')).toHaveText('1/1/1000 is correct date time!');
    });

    test('TC_VD_06: Year input is max number (Day: "31", Month: "12", Year: "3000")', async ({ page }) => {
      await page.locator('#day').fill('31');
      await page.locator('#month').fill('12');
      await page.locator('#year').fill('3000');
      await page.locator('#btnCheck').click();

      await expect(page.locator('#message')).toHaveText('31/12/3000 is correct date time!');
    });
  });

  // =========================================================================
  // 7. FUNCTION: INVALID DATE VERIFICATION
  // =========================================================================
  test.describe('Function: Invalid Date Verification', () => {
    test('TC_IVD_07: Day 31 in 30-day month is invalid (Day: "31", Month: "4", Year: "2023")', async ({ page }) => {
      await page.locator('#day').fill('31');
      await page.locator('#month').fill('4');
      await page.locator('#year').fill('2023');
      await page.locator('#btnCheck').click();

      await expect(page.locator('#message')).toHaveText('31/4/2023 is NOT correct date time!');
    });

    test('TC_IVD_08: Feb 29 in non-leap year is invalid (Day: "29", Month: "2", Year: "2023")', async ({ page }) => {
      await page.locator('#day').fill('29');
      await page.locator('#month').fill('2');
      await page.locator('#year').fill('2023');
      await page.locator('#btnCheck').click();

      await expect(page.locator('#message')).toHaveText('29/2/2023 is NOT correct date time!');
    });

    test('TC_IVD_09: Feb 30 in leap year is invalid (Day: "30", Month: "2", Year: "2024")', async ({ page }) => {
      await page.locator('#day').fill('30');
      await page.locator('#month').fill('2');
      await page.locator('#year').fill('2024');
      await page.locator('#btnCheck').click();

      await expect(page.locator('#message')).toHaveText('30/2/2024 is NOT correct date time!');
    });

    test('TC_IVD_10: Feb 31 is invalid (Day: "31", Month: "2", Year: "2024")', async ({ page }) => {
      await page.locator('#day').fill('31');
      await page.locator('#month').fill('2');
      await page.locator('#year').fill('2024');
      await page.locator('#btnCheck').click();

      await expect(page.locator('#message')).toHaveText('31/2/2024 is NOT correct date time!');
    });
  });

});
