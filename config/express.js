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
    
 

  app.options('*', cors()) 


 



}
