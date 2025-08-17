/**
 * Productivity Grade Calendar Script
 *
 * This script dynamically generates a monthly calendar allowing users
 * to grade each day based on their productivity. Grades are stored
 * using the browser's localStorage so that selections persist across
 * sessions. Each day's background is color-coded according to the
 * grade chosen.
 */

// Get references to DOM elements
const calendarBody = document.getElementById('calendarBody');
const monthYearText = document.getElementById('monthYear');
const prevMonthBtn = document.getElementById('prevMonth');
const nextMonthBtn = document.getElementById('nextMonth');

// Array of month names for display
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Current viewed month and year (initialize to today's date)
let currentDate = new Date();

/**
 * Helper to pad single digit numbers with leading zero (e.g., 9 -> '09').
 * @param {number} num
 * @returns {string}
 */
function pad(num) {
  return num.toString().padStart(2, '0');
}

/**
 * Builds the calendar for a given month and year.
 * @param {number} month - 0-based month index (0=January)
 * @param {number} year - full year
 */
function buildCalendar(month, year) {
  // Clear previous calendar content
  calendarBody.innerHTML = '';

  // Set heading
  monthYearText.textContent = `${monthNames[month]} ${year}`;

  // Determine the first day of the month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Keep track of the day number we are placing
  let dayCounter = 1;

  // Determine how many rows are needed to display the month. At least 5 rows,
  // but if the month extends into a sixth week we accommodate it.
  const totalCells = firstDay + daysInMonth;
  const rowCount = Math.ceil(totalCells / 7);

  // For each week row needed
  for (let row = 0; row < rowCount; row++) {
    const tr = document.createElement('tr');

    for (let col = 0; col < 7; col++) {
      const td = document.createElement('td');

      // Calculate if the cell should show a day of the month
      const cellIndex = row * 7 + col;
      if (cellIndex >= firstDay && dayCounter <= daysInMonth) {
        // This cell represents a valid day in the current month
        const day = dayCounter;
        const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;

        // Add day number element
        const dayNumberEl = document.createElement('div');
        dayNumberEl.className = 'day-number';
        dayNumberEl.textContent = day;
        td.appendChild(dayNumberEl);

        // Create select dropdown for grading
        const selectEl = document.createElement('select');
        selectEl.className = 'grade-select';
        selectEl.setAttribute('aria-label', `Select grade for ${dateStr}`);

        // Empty/default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Grade';
        selectEl.appendChild(defaultOption);

        // Grade options
        const grades = ['S', 'A', 'B', 'C', 'D', 'F'];
        grades.forEach((grade) => {
          const option = document.createElement('option');
          option.value = grade;
          option.textContent = grade;
          selectEl.appendChild(option);
        });

        // Load saved grade from localStorage (if any)
        const savedGrade = localStorage.getItem(dateStr);
        if (savedGrade) {
          selectEl.value = savedGrade;
          applyGradeClass(td, savedGrade);
        }

        // On change, update cell color and save to localStorage
        selectEl.addEventListener('change', function (e) {
          const selectedGrade = e.target.value;
          // Remove previous grade classes
          removeGradeClasses(td);
          if (selectedGrade) {
            applyGradeClass(td, selectedGrade);
            localStorage.setItem(dateStr, selectedGrade);
          } else {
            // Remove from storage if no grade selected
            localStorage.removeItem(dateStr);
          }
        });

        td.appendChild(selectEl);

        dayCounter++;
      }

      tr.appendChild(td);
    }

    calendarBody.appendChild(tr);
  }
}

/**
 * Applies a grade-specific class to a table cell to set its background colour.
 * @param {HTMLTableCellElement} cell
 * @param {string} grade - One of 'S', 'A', 'B', 'C', 'D', 'F'
 */
function applyGradeClass(cell, grade) {
  const gradeClass = `grade-${grade.toLowerCase()}`;
  cell.classList.add(gradeClass);
}

/**
 * Removes any grade-related classes from a table cell.
 * @param {HTMLTableCellElement} cell
 */
function removeGradeClasses(cell) {
  cell.classList.remove('grade-s', 'grade-a', 'grade-b', 'grade-c', 'grade-d', 'grade-f');
}

// Event listeners for month navigation buttons
prevMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  buildCalendar(currentDate.getMonth(), currentDate.getFullYear());
});

nextMonthBtn.addEventListener('click', () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  buildCalendar(currentDate.getMonth(), currentDate.getFullYear());
});

// Build initial calendar on page load
document.addEventListener('DOMContentLoaded', () => {
  buildCalendar(currentDate.getMonth(), currentDate.getFullYear());
});