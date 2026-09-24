const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  reporter: 'html', // Bật tính năng tạo HTML Report
});
