const utils = require("../lib/utils");

module.exports = async function(context, req) {
  context.log("Processing signup request");

  const args = req.body || {};
  if (args.login && args.password) {
    const newUser = await utils.generateUser(args.login, args.password);
    context.bindings.userProfile = JSON.stringify(newUser);
    const token = utils.generateToken(newUser); // jwt.sign({ login: args.login }, APP_SECRET);
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
