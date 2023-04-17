const jwt = require("jsonwebtoken");

const generateJWT = (
  uid: string,
  login: string = "",
  expiresIn = "12h",
  jwtSecret = process.env.JWT_SECRET
) => {
  return new Promise((resolve, reject) => {
    const payload = {
      uid,
      login,
    };
    jwt.sign(
      payload,
      jwtSecret,
      {
        expiresIn: expiresIn,
      },
      (err: string, token: string) => {
        if (err) {
          console.log(err);
          reject("Cannot generate the JWT");
        } else {
          resolve(token);
        }
      }
    );
  });
};

export default generateJWT;
