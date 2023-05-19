import AppMessages from "../constants/messages.enum";
import config from "./config";
import nodemailer from "nodemailer";

const environment = config[process.env.NODE_ENV || "development"];
const { host, port, email, password } = environment.email;

export const transporter = nodemailer.createTransport({
  host,
  port,
  secure: true,
  auth: {
    user: email,
    pass: password,
  },
});

transporter
  .verify()
  .then(() => {
    console.log(AppMessages.READY_FOR_SEDING_EMAILS);
  })
  .catch((error) => {
    console.error(AppMessages.ERROR_VERIFYING_EMAIL_TRANSPORTERS, error);
  });
