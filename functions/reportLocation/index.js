const utils = require("../lib/utils");

module.exports = async function(context, req) {
  context.log("Reporting Location");

  const args = req.body || {};

  const login = utils.authorize(req.headers);
  if (login) {
    const location = utils.generateLocation(login, args);
    if (location) {
      context.bindings.userLocation = location;
      context.res = {
        body: "Ok."
      };
    } else {
      context.res = {
        status: 400,
        body: "Please provide a correct location"
      };
    }
  } else {
    context.res = {
      status: 403,
      body: "Please provide credentials"
    };
  }
};
