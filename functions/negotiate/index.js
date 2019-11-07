module.exports = async function(context, req, connectionInfo) {
  context.log("JavaScript HTTP trigger function processed a request.");
  context.log(req.headers);
  context.res.body = connectionInfo;
};
