// Get current date, initialise year and month
const now = new Date();
let selectedYear = now.getFullYear();
let selectedMonth = now.getMonth();

// Functions to change months displayed
function previousMonth() {
  if (selectedMonth === 0) {
    selectedMonth = 11;
    selectedYear -= 1;
  } else {
    selectedMonth -= 1;
  }
  updateCalendar();
}

function nextMonth() {
  if (selectedMonth === 11) {
    selectedMonth = 0;
    selectedYear += 1;
  } else {
    selectedMonth += 1;
  }
  updateCalendar();
}

function updateCalendar() {
  generateCalendar(selectedYear, selectedMonth);
  document.getElementById("month-year").textContent = `${getMonthName(
    selectedMonth
  )} ${selectedYear}`;
}

// Rendering the main calendar view
function renderCalendarView() {
  const calBody = document.getElementById("app");
  calBody.innerHTML = `
    <div id="heading">
      <span id="last-month">&#8592; Prev</span>
      <h1 id="month-year"></h1>
      <span id="next-month">Next &#8594;</span>
    </div>
    <table id="calendar">
      <thead>
        <tr>
          <th>Sun</th>
          <th>Mon</th>
          <th>Tue</th>
          <th>Wed</th>
          <th>Thu</th>
          <th>Fri</th>
          <th>Sat</th>
        </tr>
      </thead>
      <tbody id="calendar-body">
      </tbody>
    </table>
  `;

  document
    .getElementById("last-month")
    .addEventListener("click", previousMonth);
  document.getElementById("next-month").addEventListener("click", nextMonth);

  generateCalendar(selectedYear, selectedMonth);
}

// Get and render the days & events for the month
async function generateCalendar(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const today = new Date().getDate();
  const todayMonth = new Date().getMonth();
  const todayYear = new Date().getFullYear();

  const calendarBody = document.getElementById("calendar-body");
  calendarBody.innerHTML = "";

  try {
    const events = await fetchEventsForMonth(year, month);
    let date = 1;
    for (let i = 0; i < 6; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < firstDayOfMonth) {
          const cell = document.createElement("td");
          row.appendChild(cell);
        } else if (date <= daysInMonth) {
          const cell = document.createElement("td");
          const dateDiv = document.createElement("div");
          dateDiv.classList.add("date");

          // Mark off days in the past
          if (
            year < todayYear ||
            (year === todayYear && month < todayMonth) ||
            (year === todayYear && month === todayMonth && date < today)
          ) {
            dateDiv.classList.add("past");
          }
          dateDiv.textContent = date;
          // Event listener to render day view - IIFE to make sure correct date is captured
          (function (capturedDate) {
            dateDiv.addEventListener("click", () => {
              const thisDate = new Date(year, month, capturedDate);
              renderDayView(thisDate);
            });
          })(date);

          cell.appendChild(dateDiv);

          // Getting the events for each day
          const currentDate = new Date(year, month, date);
          const eventsForDay = events.filter((event) => {
            return isSameDay(new Date(event.dataValues.date), currentDate);
          });
          if (eventsForDay.length > 0) {
            for (let event of eventsForDay) {
              const eventDiv = document.createElement("div");
              eventDiv.classList.add("event");
              eventDiv.textContent = event.dataValues.title;
              eventDiv.classList.add(
                `importance-${event.dataValues.importance}`
              );
              cell.appendChild(eventDiv);
            }
          }

          row.appendChild(cell);
          date++;
        }
      }
      calendarBody.appendChild(row);
      if (date > daysInMonth) break;
    }

    document.getElementById("month-year").textContent = `${getMonthName(
      month
    )} ${year}`;
  } catch (error) {
    console.error(`Error fetching events: `, error);
  }
}

function isSameDay(date1, date2) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function getMonthName(month) {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return months[month];
}
