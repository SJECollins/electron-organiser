// Initialize displayedDate to update later and avoid weirdness
let displayedDate = new Date();

// Render day view for specific date
function renderDayView(date) {
  displayedDate = new Date(date);
  const displayDate = displayedDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });
  const app = document.getElementById("app");

  app.innerHTML = `
  <div id="heading">
    <span id="last-day">&#8592; Prev</span>
    <h1 id="date">${displayDate}</h1>
    <span id="next-day">Next &#8594;</span>
  </div>
  <section id="events-layout">
    <div id="left-col">
    <h2>Events</h2>
      <ul id="event-list">
      <!-- Here we'll list the events -->
      </ul>
    </div>
    <div id="right-col">
      <h2>Details:</h2>
      <div id="event-details">
        <p>No event selected.</p>
      </div>    
    </div>
  </section>
  <div popover id="delete-popover">
  </div>
    `;

  document.getElementById("last-day").addEventListener("click", previousDay);
  document.getElementById("next-day").addEventListener("click", nextDay);

  renderEventList(displayedDate);
}

// Navigating between days
function previousDay() {
  displayedDate.setDate(displayedDate.getDate() - 1);
  renderDayView(displayedDate);
}

function nextDay() {
  displayedDate.setDate(displayedDate.getDate() + 1);
  renderDayView(displayedDate);
}

// Fetch and render list of events for specific date
async function renderEventList(date) {
  const eventList = document.getElementById("event-list");
  eventList.innerHTML = "";
  try {
    const events = await fetchEventsByDate(date);
    if (events) {
      events.sort((a, b) => {
        return new Date(a.time) - new Date(b.time);
      });

      for (let event of events) {
        const eventDiv = document.createElement("li");
        eventDiv.textContent = `${event.dataValues.time}: ${event.dataValues.title}`;
        eventDiv.classList.add(
          `importance-${event.dataValues.importance}`,
          `id-${event.dataValues.id}`,
          "clickable"
        );
        eventDiv.addEventListener("click", () => {
          renderEventDetails(event.dataValues.id);
        });
        eventList.appendChild(eventDiv);
      }
    } else {
      const eventDiv = document.createElement("li");
      eventDiv.textContent = "No events today";
      eventList.appendChild(eventDiv);
    }
  } catch (error) {
    console.error(`Error rendering event list for date ${date}: `, error);
    const eventDiv = document.createElement("li");
    eventDiv.textContent = "Error loading events";
    eventList.appendChild(eventDiv);
  }
}

// Fetch and render details of selected event
async function renderEventDetails(eventId) {
  const eventDetails = document.getElementById("event-details");
  eventDetails.innerHTML = "";

  try {
    const event = await fetchEventById(eventId);

    const eventTitle = document.createElement("h3");
    eventTitle.textContent = `${event.dataValues.title} ${"!".repeat(
      event.dataValues.importance
    )}`;

    const eventTime = document.createElement("p");
    eventTime.textContent = `Time: ${event.dataValues.time}`;

    const eventDescription = document.createElement("p");
    eventDescription.textContent = `Description: ${event.dataValues.description}`;

    const editButton = document.createElement("button");
    editButton.textContent = "Edit";
    editButton.addEventListener("click", () => {
      renderEditEventView(event.dataValues.id);
    });

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("popovertarget", "delete-popover");
    deleteButton.textContent = "Delete";
    const popover = document.getElementById("delete-popover");
    popover.innerHTML = `<h4>Delete ${event.dataValues.title}?</h4>`;
    const confirmDeleteButton = document.createElement("button");
    confirmDeleteButton.innerHTML = "Yes";
    popover.appendChild(confirmDeleteButton);
    confirmDeleteButton.addEventListener("click", () => {
      deleteEvent(eventId);
      popover.innerHTML = "";
      location.reload();
    });

    eventDetails.appendChild(eventTitle);
    eventDetails.appendChild(eventTime);
    eventDetails.appendChild(eventDescription);
    eventDetails.appendChild(editButton);
    eventDetails.appendChild(deleteButton);
  } catch (error) {
    console.error(
      `Error rendering event details for event ID ${eventId}: `,
      error
    );
    const errorDiv = document.createElement("div");
    errorDiv.textContent = "Error loading event details";
    eventDetails.appendChild(errorDiv);
  }
}
