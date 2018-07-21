var express = require('express'),
    fs = require('fs'),
    passport = require('passport')

var path = require('path')
var http = require('http')
var vEncriptar=require('./config/encriptar.js')

var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var connect = require('connect')
var  crypto = require('crypto')
var _ = require('underscore')
var winston = require('winston')
require('./config/polyfills.js');

var env = process.env.NODE_ENV || 'desconocido'  ,
    config = require('./config/config')
    , auth = require('./config/middlewares/authorization')

require('./config/passport')(passport, config)
var app = express();

var server = http.createServer(app);

server.on('request', function(request, response) {
	
	if(request.url.indexOf("/api")>=0){
		console.log("- Request -",request.url)
	}
});

app.use(bodyParser.json({ limit: '1mb' }));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// levanto las config de express y ruteos
require('./config/express')(app, config, passport)
require('./config/routes')(app, passport, auth)

// donde están los views...
app.set('views', config.root + '/app/views')
app.set('view engine', 'jade')


var port = config.port
process.config.sql = config.sql;



var mysql = require('mysql');

var ldb={
		  connectionLimit : 50,
		  host            : 'localhost',
		  user            : 'root',
		  password        : '123123',
		  database        : 'mean'
		};
		
var pool;

	if(process.env.NODE_ENV=="PRODUCTION"){
		ldb.host="mysql"
		pool= mysql.createPool( ldb);
	}else{
		pool= mysql.createPool(ldb);
	}
process.database=pool;

 // mean.perfilAccion

process.database.query('select * from mean.perfilAccion',  function (error,data, fields) {
          if (error) {
                res.status(500).send(ErrorSQL.getError(error));
            }
            console.log(" - mean.perfilAccion - ",data);
        });


console.log('The db is:', ldb);


/*
var logger = new (winston.Logger)({
    transports: [
        new winston.transports.File({ filename: './all-logs.' + process.env.NODE_ENV + '.log', timestamp: true, maxsize: 1000000})
    ],
    exceptionHandlers: [
        new winston.transports.File({ filename: './exceptions.'+ process.env.NODE_ENV + '.log', timestamp: true, maxsize: 1000000 })
    ],
    exitOnError: false
});

process.config.sql.password="123123";
server.listen(port,function(){
	console.log('Express server se ha iniciado correctamente - port: ',port);
});
 
 
// process.config.ldap = config['Ldap'];

 */
exports = module.exports = app

/*
console.log("Ambiente:", config.app.name)
console.log("Código:", env)
console.log('La aplicación escucha en el puerto #', port)
console.log('Express escucha en el puerto #', port)
console.log('La base de datos es ',process.config.sql.database)

*/

