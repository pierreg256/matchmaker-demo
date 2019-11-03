const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const APP_SECRET = process.env.APP_SECRET || "Tot@lS3crit!";

module.exports = async function(context, req) {
  context.log("Processing signup request");

  const args = req.body || {};
  if (args.login && args.password) {
    const hash = await bcrypt.hash(args.password, 10);
    const newUser = {
      record_type: "user_profile",
      login: args.login,
      password: hash
    };
    context.bindings.userProfile = JSON.stringify(newUser);
    const token = jwt.sign({ login: args.login }, APP_SECRET);
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: { token, user: newUser }
    };
  } else {
    context.res = {
      status: 400,
      body: "Please pass a login and a password in the request body"
    };
  }
};
