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

    const closeBtn = document.querySelector('.window-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const confirmed = window.confirm('Are you sure you want to exit?');
            if (confirmed) {
                const win = document.querySelector('.window');
                if (win) win.style.display = 'none';
            }
        });
    }

    btnCheck.addEventListener('click', () => {
        const dayStr = dayInput.value.trim();
        const monthStr = monthInput.value.trim();
        const yearStr = yearInput.value.trim();

        messageDiv.style.color = '#d00'; // Default error color

        // 1. Numeric format validation
        if (!/^\d+$/.test(dayStr)) {
            messageDiv.textContent = 'Input data for Day is incorrect format!';
            return;
        }

        if (!/^\d+$/.test(monthStr)) {
            messageDiv.textContent = 'Input data for Month is incorrect format!';
            return;
        }

        if (!/^\d+$/.test(yearStr)) {
            messageDiv.textContent = 'Input data for Year is incorrect format!';
            return;
        }

        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10);
        const year = parseInt(yearStr, 10);

        // 2. Range validation
        if (day < 1 || day > 31) {
            messageDiv.textContent = 'Input data for Day is out of range!';
            return;
        }

        if (month < 1 || month > 12) {
            messageDiv.textContent = 'Input data for Month is out of range!';
            return;
        }

        if (year < MIN_YEAR || year > MAX_YEAR) {
            messageDiv.textContent = 'Input data for Year is out of range!';
            return;
        }

        // 3. Date validity check
        const maxDays = getDaysInMonth(month, year);
        if (day > maxDays) {
            messageDiv.textContent = `${day}/${month}/${year} is NOT correct date time!`;
            return;
        }

        // Valid date
        messageDiv.style.color = 'green';
        messageDiv.textContent = `${day}/${month}/${year} is correct date time!`;
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
