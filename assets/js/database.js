const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

// Create sequalize instace & connect to SQLite db
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: path.join(__dirname, "../data", "database.sqlite"),
});

// Event model
const Event = sequelize.define("Event", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  time: {
    type: DataTypes.TIME,
    allowNull: false,
  },
  importance: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

sequelize.sync().then(() => {
  console.log("Database & tables created!");
});

module.exports = { sequelize, Event };
