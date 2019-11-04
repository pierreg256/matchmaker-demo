const utils = require("../lib/utils");

module.exports = function(context, req, user) {
  context.log("JavaScript HTTP trigger function processed a request.");

  context.log(req.body);
  const args = req.body || {};

  if (!user) {
    context.log("User not found");
    context.res = { status: 403, body: "Unknown user" };
    context.done();
  } else {
    context.log("found", user.length, "users");
    context.log("Found User, Description=" + JSON.stringify(user));

    utils
      .validateUser(user, args.password)
      .then(valid => {
        if (valid) {
          context.res = {
            body: { user: user, token: utils.generateToken(user) }
          };
        } else {
          context.res = { status: 403, body: "bad password" };
        }
        context.done();
      })
      .catch(e => {
        console.log("error:", e);
        context.res = { status: 403, body: "bad password" };
        context.done();
      });
  }
};
