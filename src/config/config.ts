require("dotenv").config();

const config: any = {
  development: {
    database: {
      connection:
        process.env.DB_CONNECTION ||
        "mongodb+srv://phpAdminAgency:nKYtzOipZU0LqI78@cluster0.r7e3d3w.mongodb.net/agencydb",
    },
    email: {
      port: process.env.PORT_EMAIL,
      host: process.env.HOST_EMAIL,
      email: process.env.USER_EMAIL,
      password: process.env.PASSWORD_EMAIL,
    },
    jwtSecret: process.env.JWT_SECRET,
    jwtSecretReset: process.env.JWT_SECRET_RESET,
    defaultFilePath: "../uploads/no-file.jpg",
    verifyLink: "http://localhost:4200/auth/new-password/",
    linkApp: "http://localhost:4200/",
    linkProspect: "http://localhost:4200/prospect/add-prospects/",
    emailCreateProspect: process.env.EMAIL_CREATE_PROSPECT,
  },
  production: {
    database: {
      connection:
        process.env.DB_CONNECTION ||
        "mongodb+srv://phpAdminAgency:nKYtzOipZU0LqI78@cluster0.r7e3d3w.mongodb.net/agencydb",
    },
    email: {
      port: process.env.PORT_EMAIL,
      host: process.env.HOST_EMAIL,
      email: process.env.USER_EMAIL,
      password: process.env.PASSWORD_EMAIL,
    },
    jwtSecret: process.env.JWT_SECRET,
    jwtSecretReset: process.env.JWT_SECRET_RESET,
    defaultFilePath: "../uploads/no-file.jpg",
    verifyLink: process.env.VERIFY_LINK,
    linkApp: process.env.LINK_APP,
    linkProspect: process.env.LINK_PROSPECT,
    emailCreateProspect: process.env.EMAIL_CREATE_PROSPECT,
  },
};

export default config;
