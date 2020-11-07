// dependencies
const express = require("express")
const fs = require("fs")

// setup
const app = express()

//app.enable('trust proxy')
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//////////////////////////

app.get("*",(request,response) => {
  let requestedEndpoint = request.url
  console.log(requestedEndpoint)
  // detect if the requested endpoint is for internal api. if it is, check the X-K2C-KEY header
  if(requestedEndpoint.startsWith("/internal")) {
    // if the header is invalid or undefined, respond with 401 unauthorized
    if(request.header("X-K2C-KEY") !== process.env.XK2CKEY) {
      response.sendStatus(401)
      return
    }
  }
  // messy looking on the repl ide
  if(requestedEndpoint.endsWith("/") & fs.existsSync(`${__dirname}/endpoints/GET${requestedEndpoint}handler.js`)) {
    require(`${__dirname}/endpoints/GET${requestedEndpoint}handler.js`).handle(request,response)
  } else {
    if(fs.existsSync(`${__dirname}/endpoints/GET${requestedEndpoint}/handler.js`)) {
      require(`${__dirname}/endpoints/GET${requestedEndpoint}/handler.js`).handle(request,response)
    } else {
      if(requestedEndpoint === "/" || requestedEndpoint === "") {
        response.sendStatus(200)
      } else {
        response.sendStatus(404)
      }
    }
  }
})

app.listen(process.env.PORT || 80)
