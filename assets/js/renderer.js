async function fetchEvents() {
  try {
    const events = await window.electron.ipcRenderer.invoke("get-events");
    return events;
  } catch (error) {
    console.error("Error fetching events: ", error);
  }
}

async function addEvent(title, description, date, time, importance) {
  try {
    const event = await window.electron.ipcRenderer.invoke("add-event", {
      title,
      description,
      date,
      time,
      importance,
    });
    fetchEvents();
  } catch (error) {
    console.error("Error adding event: ", error);
  }
}

async function fetchEventById(id) {
  try {
    const event = await window.electron.ipcRenderer.invoke(
      "get-event-by-id",
      id
    );
    return event;
  } catch (error) {
    console.error(`Error fetching event with ID ${id}:`, error);
  }
}

async function fetchEventsByDate(date) {
  try {
    const events = await window.electron.ipcRenderer.invoke(
      "get-events-by-date",
      date
    );
    return events;
  } catch (error) {
    console.error(`Error fetching events for date ${date}: `, error);
  }
}

async function fetchEventsForMonth(year, month) {
  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  try {
    const events = await window.electron.ipcRenderer.invoke(
      "get-events-between-dates",
      startDate,
      endDate
    );
    return events;
  } catch (error) {
    console.error(`Error fetching events for ${year}-${month}: `, error);
    return [];
  }
}

async function updateEvent(id, title, description, date, time, importance) {
  try {
    const event = await window.electron.ipcRenderer.invoke("update-event", {
      id,
      title,
      description,
      date,
      time,
      importance,
    });
    fetchEvents();
  } catch (error) {
    console.error("Error updating event:", error);
  }
}

async function deleteEvent(id) {
  try {
    const result = await window.electron.ipcRenderer.invoke("delete-event", id);
  } catch (error) {
    console.error("Error deleting event: ", error);
  }
}

// Expose functions to window object for access elsewhere
window.addEvent = addEvent;
window.fetchEvents = fetchEvents;
window.fetchEventById = fetchEventById;
window.fetchEventsByDate = fetchEventsByDate;
window.updateEvent = updateEvent;
window.deleteEvent = deleteEvent;

document.addEventListener("DOMContentLoaded", () => {
  const app = document.getElementById("app");

  document
    .getElementById("calendar-link")
    .addEventListener("click", renderCalendarView);
  document
    .getElementById("add-event-link")
    .addEventListener("click", renderAddEventView);

  renderCalendarView();
});
