const utils = require("../lib/utils");

module.exports = async function(context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");
  const login = utils.authorize(req.headers);

  if (login) {
    const message = req.body;
    message.sender = login;

    let recipientUserId = "";
    if (message.recipient) {
      recipientUserId = message.recipient;
      message.isPrivate = true;
    }

    context.bindings.signalRMessages = [
      {
        userId: recipientUserId,
        target: "newMessage",
        arguments: [message]
      }
    ];
  } else {
    context.res = {
      status: 403,
      body: "Please provide credentials"
    };
  }
};
