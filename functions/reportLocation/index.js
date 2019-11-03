const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const APP_SECRET = process.env.APP_SECRET || "Tot@lS3crit!";

module.exports = async function(context, req) {
  context.log("Reporting Location");

  const auth = (req.headers && req.headers.authorization) || "";
  const token = auth.replace("Bearer ", "");
  if (token) {
    const { login } = jwt.verify(token, APP_SECRET);
    const user = await db.user.findOne({ where: { id: userId } });
    if (user) return { user: { ...user.dataValues }, db };
    else return { db };
  }

  if (req.query.name || (req.body && req.body.name)) {
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: "Hello " + (req.query.name || req.body.name)
    };
  } else {
    context.res = {
      status: 400,
      body: "Please pass a name on the query string or in the request body"
    };
  }
};
