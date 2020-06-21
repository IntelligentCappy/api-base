module.exports.handle = function(request,response) {
  response.send(request.header("X-K2C-REQUEST") == process.env.PANELKEY)
}
