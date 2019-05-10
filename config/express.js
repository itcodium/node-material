/**
 * Module dependencies.
 */

var express = require('express')

  , helpers = require('view-helpers')
var favicon = require('serve-favicon');

var session = require('express-session')
var flash = require('connect-flash')
var methodOverride = require('method-override')
//var mongoStore = require('connect-mongo')(session);
var compress = require('compression')
var cors = require('cors')


module.exports = function (app, config, passport) {



  app.set('showStackError', true)
  // should be placed before express.static
  app.use(compress({
    filter: function (req, res) {
      return /json|text|javascript|css/.test(res.getHeader('Content-Type'));
    },
    level: 9
  }))





  //app.use(favicon(__dirname + '/public/favicon.ico'));
  app.use(express.static(config.root + '/public'))



  //set views path, template engine and default layout
  app.set('views', config.root + '/app/views')
  app.set('view engine', 'jade')

  //  enable jsonp
  app.enable("jsonp callback")

  // ---- Nuevo codigo ----

  app.use(helpers(config.app.name))
  app.use(methodOverride())

  app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'uwotm80088mm0000',
    name: process.env.NODE_ENV,
    cookie: { maxAge: 3600000 }
  }));
  app.use(function (req, res, next) {
    if ('HEAD' == req.method || 'OPTIONS' == req.method) { return next() }
    // console.log('Last expires: ', req.session.cookie._expires);

    req.session._garbage = Date();
    req.session.touch();
    // console.log('Next expires: ', req.session.cookie._expires);

    next();
  });
  /*app.use(session({
      secret: 'hortensia',
      //store: new mongoStore({url: config.db,'db': 'sessions'}),
        resave: false,
        saveUninitialized: false

    }));
  */


  app.use(passport.initialize())
  app.use(passport.session({ secret: '123' }))
  app.use(flash())

  const whitelist = ['http://172.21.34.161', 'http://dev.adm.dlatv.net', 'http://example2.com']
  const corsOptions = {
  origin: function(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
  } 

  app.options('*', cors())
  app.use(cors(corsOptions ));

  /*
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
*/




}
