document.addEventListener('DOMContentLoaded', () => {
    const dayInput = document.getElementById('day');
    const monthInput = document.getElementById('month');
    const yearInput = document.getElementById('year');
    const btnClear = document.getElementById('btnClear');
    const btnCheck = document.getElementById('btnCheck');
    const messageDiv = document.getElementById('message');

    // Constants for validation
    const MIN_YEAR = 1000;
    const MAX_YEAR = 3000;

    btnClear.addEventListener('click', () => {
        dayInput.value = '';
        monthInput.value = '';
        yearInput.value = '';
        messageDiv.textContent = '';
        messageDiv.style.color = '#333';
        dayInput.focus();
    });

    btnCheck.addEventListener('click', () => {
        const dayStr = dayInput.value.trim();
        const monthStr = monthInput.value.trim();
        const yearStr = yearInput.value.trim();

        messageDiv.style.color = '#d00'; // Default error color

        // Check empty fields
        if (!dayStr || !monthStr || !yearStr) {
            messageDiv.textContent = 'Please fill in all fields.';
            return;
        }

        // Check if numeric
        if (!/^\d+$/.test(dayStr) || !/^\d+$/.test(monthStr) || !/^\d+$/.test(yearStr)) {
            messageDiv.textContent = 'Input data for Day, Month, Year must be numbers.';
            return;
        }

        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);

        // Validate year range (typical for these assignments)
        if (year < MIN_YEAR || year > MAX_YEAR) {
            messageDiv.textContent = `Input data for Year is out of range [${MIN_YEAR}...${MAX_YEAR}]`;
            return;
        }

        // Validate month range
        if (month < 1 || month > 12) {
            messageDiv.textContent = 'Input data for Month is out of range [1...12]';
            return;
        }

        // Get max days in month
        const maxDays = getDaysInMonth(month, year);

        // Validate day range
        if (day < 1 || day > maxDays) {
            messageDiv.textContent = `Input data for Day is out of range [1...${maxDays}]`;
            return;
        }

        // Valid date
        messageDiv.style.color = 'green';
        messageDiv.textContent = `${dayStr}/${monthStr}/${yearStr} is a valid date!`;
    });

    function isLeapYear(year) {
        return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
    }

    function getDaysInMonth(month, year) {
        switch (month) {
            case 4: case 6: case 9: case 11:
                return 30;
            case 2:
                return isLeapYear(year) ? 29 : 28;
            default:
                return 31;
        }
    }
});
