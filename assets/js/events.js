// Render add event view
function renderAddEventView() {
  const app = document.getElementById("app");
  const today = new Date().toISOString().split("T")[0];

  app.innerHTML = `
      <h1>Add Event</h1>
      <form id="add-event-form">
        <label for="event-title">Event:</label>
        <input type="text" id="event-title" name="event-title" required>
        <label for="event-date">Date:</label>
        <input type="date" id="event-date" name="event-date" value="${today}" required>
        <label for="event-time">Time:</label>
        <input type="time" id="event-time" name="event-time" required>
        <label for="event-description">Description:</label>
        <textarea id="event-description" rows="3" name="event-description"></textarea>
        <label for="event-importance">Importance:</label>
        <select name="event-importance" id="event-importance">
          <option value="1" selected>!</option>
          <option value="2">!!</option>
          <option value="3">!!!</option>
        </select>
        <button type="submit">Add Event</button>
      </form>
    `;

  document
    .getElementById("add-event-form")
    .addEventListener("submit", newEvent);
}

// Handle adding a new event
function newEvent(event) {
  event.preventDefault();
  const eventName = document.getElementById("event-title").value;
  const eventDate = document.getElementById("event-date").value;
  const eventTime = document.getElementById("event-time").value;
  const eventDescription = document.getElementById("event-description").value;
  const eventImportance = parseInt(
    document.getElementById("event-importance").value
  );

  addEvent(eventName, eventDescription, eventDate, eventTime, eventImportance);

  // Very lazily reload the app
  location.reload();
}

// Render edit event view
async function renderEditEventView(eventId) {
  const app = document.getElementById("app");
  try {
    const event = await fetchEventById(eventId);
    const eventDate = new Date(event.dataValues.date)
      .toISOString()
      .split("T")[0];

    app.innerHTML = `
        <h1>Edit Event</h1>
        <form id="edit-event-form">
          <input type="number" id="event-id" value="${eventId}" hidden>
          <label for="event-title">Event:</label>
          <input type="text" id="event-title" name="event-title" value="${event.dataValues.title}" required>
          <label for="event-date">Date:</label>
          <input type="date" id="event-date" name="event-date" value="${eventDate}" required>
          <label for="event-time">Time:</label>
          <input type="time" id="event-time" name="event-time" value="${event.dataValues.time}" required>
          <label for="event-description">Description:</label>
          <input type="textarea" id="event-description" name="event-description" rows={3} value="${event.dataValues.description}">
          <label for="event-importance">Importance:</label>
          <select name="event-importance" id="event-importance" value="${event.dataValues.importance}">
            <option value="1">!</option>
            <option value="2">!!</option>
            <option value="3">!!!</option>
          </select>
          <button type="submit">Edit Event</button>
        </form>
      `;

    document
      .getElementById("edit-event-form")
      .addEventListener("submit", editEvent);
  } catch (error) {
    console.log("Error getting event details: ", error);
  }
}

// Handle editing event
function editEvent(event) {
  event.preventDefault();
  const eventId = document.getElementById("event-id").value;
  const eventName = document.getElementById("event-title").value;
  const eventDate = document.getElementById("event-date").value;
  const eventTime = document.getElementById("event-time").value;
  const eventDescription = document.getElementById("event-description").value;
  const eventImportance = parseInt(
    document.getElementById("event-importance").value
  );

  updateEvent(
    eventId,
    eventName,
    eventDescription,
    eventDate,
    eventTime,
    eventImportance
  );

  // So lazy
  location.reload();
}
