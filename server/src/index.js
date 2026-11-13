
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const configureApp = require("./settings/config.js");
const seedAdmin = require("./seeders/seedAdmin.js");

process.env.NODE_ENV = process.env.NODE_ENV || "development";

console.log(`Current Environment: ${process.env.NODE_ENV}`);

const envFile = `.env.${process.env.NODE_ENV}`;
console.log(`Loading environment variables from: ${envFile}`);

dotenv.config({ path: envFile });

const app = express();
const port = parseInt(process.env.PORT) || 3001;

app.use(express.json());
configureApp(app);

async function bootstrap() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is missing in .env.development");
    }

    await mongoose.connect(process.env.DATABASE_URL, {
      dbName: process.env.DATABASE_NAME,
    });

    console.log("Connected to MongoDB successfully");

    await seedAdmin();

    app.listen(port, () => {
      console.log(`App listening on port ${port}`);
    });

  } catch (error) {
    console.error("Backend startup failed:", error);
    process.exit(1);
  }
}

bootstrap();
