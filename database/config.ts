// getting-started.js
const mongoose = require("mongoose");

// import mongoose from "mongoose";

export const dbConenection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONECTION);

    console.log("DB Online");
  } catch (error) {
    console.log(error);
    console.log("Error a la hora de iniciar la BD ver logs");
  }
};
