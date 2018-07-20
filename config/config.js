var path = require('path')
    , rootPath = path.normalize(__dirname + '/..')

    , templatePath = path.normalize(__dirname + '/../app/mailer/templates')
    , notifier = {
    APN: false,
    email: false, // true
    actions: ['comment'],
    tplPath: templatePath,
    postmarkKey: 'POSTMARK_KEY',
    parseAppId: 'PARSE_APP_ID',
    parseApiKey: 'PARSE_MASTER_KEY'
}


 
module.exports = {
 
        site:"PP",
        port: 8080,
        db: 'mongodb://192.168.5.246:27017/macro_dev',
        root: rootPath,
        notifier: notifier,
        app: {      name: 'App demo',code:"PP"},
        sqlServer : {
            user: 'root',
            password: "123123",
            server: 'mysql',
            database: 'MacroPP_Dev',
            pool: { max: 10, min: 0, idleTimeoutMillis: 10  },
            requestTimeout: 15000
            // , stream: true ,options: {encrypt: true // Use this if you're on Windows Azure}
        },
		sqlServer_dev : {
            user: 'test',
            password: "root",
            server: 'MYEQ-PC',
            database: 'MacroPP_Dev',
            pool: { max: 10, min: 0, idleTimeoutMillis: 10  },
            requestTimeout: 15000
            // , stream: true ,options: {encrypt: true // Use this if you're on Windows Azure}
        },
		sql : {options:{
            user: 'root',
            password: "123123",
            host: 'localhost',
            database: 'mean'
		}}
 
 
 
           

};




