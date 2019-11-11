const utils = require("../lib/utils");
const fetch = require("node-fetch");

module.exports = function(context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  const login = utils.authorize(req.headers);

  if (login) {
    const url = process.env.SPEECH_ENDPOINT;
    const options = {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": process.env.SPEECH_KEY
      }
    };
    fetch(url, options)
      .then(result => result.text())
      .then(token => {
        context.log(token);
        context.res = {
          status: 200,
          body: token
        };
        context.done();
      })
      .catch(e => {
        context.res = {
          status: 403,
          body: e
        };
        context.done();
      });
  } else {
    context.res = {
      status: 403,
      body: "Please pass correct credentials"
    };
    context.done();
  }
};
