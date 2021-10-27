if (process.env.NODE_ENV !== 'production') require('dotenv').config()

var path = require('path')
var express = require('express')
var session = require('express-session')
var favicon = require('serve-favicon')
var nunjucks = require('nunjucks')
var dateFilter = require('nunjucks-date-filter')
var request = require('request')
var bodyParser = require('body-parser')
var utils = require('./lib/utils.js')
var config = require('./app/config.js')

var index = require('./app/routes/index');


var app = express()

// Grab environment variables specified in Procfile or as Heroku config vars
var username = process.env.USERNAME
var password = process.env.PASSWORD
var appEnvironment = process.env.NODE_ENV || 'development'
var useAuth = process.env.USE_AUTH || config.useAuth
var useHttps = process.env.USE_HTTPS || config.useHttps

appEnvironment = appEnvironment.toLowerCase()
useAuth = useAuth.toLowerCase()
useHttps = useHttps.toLowerCase()

// Force HTTPs on production connections
if (appEnvironment === 'production' && useHttps === 'true') {
  app.use(utils.forceHttps)
}

// Authenticate against the environment-provided credentials, if running
// the app in production (Heroku, effectively)
if (appEnvironment === 'production' && useAuth === 'true') {
  app.use(utils.basicAuth(username, password))
}

// Disallow search index
app.use(function (req, res, next) {
  // Setting headers stops pages being indexed even if indexed pages link to them.
  res.setHeader('X-Robots-Tag', 'noindex')
  next()
})

// Support session data
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: Math.round(Math.random() * 100000).toString()
}))

// Add variables that are available in all views
app.use(function (req, res, next) {
  res.locals.cookieText = config.cookieText
  res.locals.session = req.session
  res.locals.jsNow = new Date();
  next()
})

var myLogger = function (req, res, next) {
  console.log(req.session);
  next();
};
app.use(myLogger);

// Handle form POSTS
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

// Middleware to serve static assets
app.use('/', express.static(path.join(__dirname, '/public')))

// Application settings
app.set('view engine', 'html')

var env = nunjucks.configure('./app/views', {
    autoescape: true,
    express: app,
    noCache: true
});
env.addFilter('date', dateFilter);

// ROUTES
app.use('/', index);

// auto render any view that exists
app.get(/^\/([^.]+)$/, function (req, res) {
  var path = (req.params[0])

  res.render(path, function (err, html) {
    if (err) {
      res.render(path + '/index', function (err2, html) {
        if (err2) {
          console.log(err)
          res.status(404).send(err + '<br>' + err2)
        } else {
          res.end(html)
        }
      })
    } else {
      res.end(html)
    }
  })
});

app.get('/robots.txt', function (req, res) {
  res.type('text/plain')
  res.send('User-agent: *\nDisallow: /')
})


// start the app
utils.findAvailablePort(app, function (port) {
  console.log('Listening on port ' + port + '   url: http://localhost:' + port)
  app.listen(port)
})
