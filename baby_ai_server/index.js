const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./src/models");
const sizeRoutes = require("./src/routes/sizeRoutes");

const app = express();

app.use(cors());
// app.use(express.json());

app.use(express.json({ limit: "100mb" }));

app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use("/api", sizeRoutes);

async function start() {
  try {
    await db.sequelize.authenticate();
    await db.sequelize.sync();

    console.log("Database Ready");

    app.listen(5000, () => {
      console.log("Server running on port 5000");
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

start();
