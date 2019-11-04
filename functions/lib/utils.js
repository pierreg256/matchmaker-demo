const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const APP_SECRET = process.env.APP_SECRET || "Tot@lS3crit!";

module.exports.generateToken = user => {
  return jwt.sign({ login: user.login }, APP_SECRET);
};

module.exports.validateUser = (user, password) => {
  console.log("user:", user.password, "password:", password);
  return bcrypt.compare(password, user.password);
};

module.exports.generateUser = async (login, password) => {
  const hash = await bcrypt.hash(password, 10);
  const newUser = {
    record_type: "user_profile",
    id: login,
    login: login,
    password: hash
  };
  return newUser;
};

module.exports.generateLocation = (login, args) => {
  if (typeof args.longitude !== "number") return null;
  console.log("long ok");
  if (typeof args.latitude !== "number") return null;
  console.log("lat ok");

  console.log("je suis dedans");
  const newLocation = {
    record_type: "user_location",
    id: login + "-location",
    login: login,
    date: new Date().toISOString(),
    location: {
      type: "Point",
      coordinates: [args.longitude, args.latitude]
    }
  };
  return newLocation;
};

module.exports.authorize = headers => {
  const auth = (headers && headers.authorization) || "";
  console.log("auth:", auth);
  const token = auth.replace("Bearer ", "");
  console.log("token:", token);
  if (token) {
    try {
      const { login } = jwt.verify(token, APP_SECRET);
      return login;
    } catch {
      return null;
    }
  } else {
    return null;
  }
};
