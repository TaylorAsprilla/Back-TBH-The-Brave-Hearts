import config from "../config/config";
import { transporter } from "../config/mailer";
import AppMessages from "../constants/messages.enum";

const sendEmail = (to: string, subject: string, html: string) => {
  transporter.sendMail(
    {
      from: `${AppMessages.COMPANY_NAME} <${config.development.email.email}>`,
      to,
      subject,
      html,
    },
    (error: any, info: any) => {
      if (error) {
        console.log(AppMessages.ERROR_SEDING_EMAIL, error);
      } else {
        console.log(AppMessages.EMAIL_SENT_SUCCESSFULLY);
        console.log(AppMessages.ACCEPTED_RECIPIENTS, info.accepted);
      }
    }
  );
};

export default sendEmail;
