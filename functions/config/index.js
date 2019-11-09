const utils = require("../lib/utils");

module.exports = async function(context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  const login = utils.authorize(req.headers);

  if (login) {
    context.res = {
      // status: 200, /* Defaults to 200 */
      body: { maps_api_key: process.env.MAPS_API_KEY }
    };
  } else {
    context.res = {
      status: 403,
      body: "Pls, provide a valid authentication"
    };
  }
};
