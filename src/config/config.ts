require("dotenv").config();

const config: any = {
  development: {
    database: {
      connection:
        process.env.DB_CONNECTION ||
        "mongodb+srv://phpAdminAgency:nKYtzOipZU0LqI78@cluster0.r7e3d3w.mongodb.net/agencydb",
    },
    email: {
      email: process.env.EMAIL,
      password: process.env.EMAIL_PASSWORD,
    },
    jwtSecret: process.env.JWT_SECRET,
  },
  production: {
    database: {
      connection:
        process.env.DB_CONNECTION ||
        "mongodb+srv://phpAdminAgency:nKYtzOipZU0LqI78@cluster0.r7e3d3w.mongodb.net/agencydb",
    },
    email: {
      email: process.env.EMAIL,
      password: process.env.EMAIL_PASSWORD,
    },
    jwtSecret: process.env.JWT_SECRET,
  },
};

export default config;
