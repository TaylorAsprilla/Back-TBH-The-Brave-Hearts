// getting-started.js
import mongoose from "mongoose";
import config from "../config/config";

export const dbConnection = async () => {
  const environment = config[process.env.ENVIRONMENT || "development"];

  try {
    const dbUrl = environment.database.connection;

    if (!dbUrl) {
      throw new Error("Missing DB_CONNECTION environment variable");
    }

    await mongoose.connect(dbUrl);
    console.log("DB Online");
  } catch (error) {
    console.log(error);
    console.log("Error when starting the DB see logs");
  }
};
