const { app, BrowserWindow, ipcMain } = require("electron");
const { Op } = require("sequelize");
const path = require("path");
const { sequelize, Event } = require("./assets/js/database");

// Create main app window & load index.html
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "./assets/js/preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC handlers for database operations
ipcMain.handle("get-events", async () => {
  try {
    const events = await Event.findAll();
    return events;
  } catch (error) {
    console.error("Error fetching events: ", error);
    throw error;
  }
});

ipcMain.handle("get-events-by-date", async (event, requestedDate) => {
  try {
    const startDate = new Date(requestedDate);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(requestedDate);
    endDate.setHours(23, 59, 59, 999);

    const events = await Event.findAll({
      where: {
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    return events;
  } catch (error) {
    console.error("Error fetching events for date: ", requestedDate);
    throw error;
  }
});

ipcMain.handle(
  "get-events-between-dates",
  async (event, startDate, endDate) => {
    try {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      const events = await Event.findAll({
        where: {
          date: {
            [Op.between]: [start, end],
          },
        },
      });

      return events;
    } catch (error) {
      console.error("Error fetching events for date: ", startDate);
      throw error;
    }
  }
);

ipcMain.handle("add-event", async (event, eventData) => {
  try {
    const newEvent = await Event.create(eventData);
    return newEvent;
  } catch (error) {
    console.error("Error adding event: ", error);
    throw error;
  }
});

ipcMain.handle("get-event-by-id", async (event, id) => {
  try {
    const event = Event.findByPk(id);
    return event;
  } catch (error) {
    console.error("Error fetching event by ID: ", error);
    throw error;
  }
});

ipcMain.handle("update-event", async (event, eventData) => {
  try {
    const existingEvent = await Event.findByPk(eventData.id);
    if (existingEvent) {
      await existingEvent.update(eventData);
      return existingEvent;
    } else {
      throw new Error("Event not found");
    }
  } catch (error) {
    console.error("Error updating event: ", error);
    throw error;
  }
});

ipcMain.handle("delete-event", async (event, id) => {
  try {
    const existingEvent = await Event.findByPk(id);
    if (existingEvent) {
      await existingEvent.destroy();
      return { success: true, message: `Event ${id} deleted.` };
    } else {
      throw new Error("Event not found");
    }
  } catch (error) {
    console.error("Error deleting event: ", error);
    throw error;
  }
});
