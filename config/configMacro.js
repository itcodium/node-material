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
    /*
        Seguridad: {
            // Producción: path: './../Seguridad/data.txt'
            path: './../../../Seguridad/data.txt'
        },
        Ldap: {
            url: 'ldap://MACRO.COM.AR',
            bindDn:  '{{user}}@macro.com.ar',
            searchDn: 'OU=Usuarios,DC=MACRO,DC=COM,DC=AR'
        },
        Email:{
            config:{
                host: 'smtp.macro.com.ar',
                port: 25,
                ignoreTLS:false,
                tls: { rejectUnauthorized: false }
            },
            from: 'TEST <bp4_notificacion@macro.com.ar>'
        },
        Email_TC:{
            path:'./app/controllers/word',
            template:{file:'/Template.VIAX.html',
                path:'./app/controllers/word'}
        },
    
        Email_PP:{
            path:'./app/controllers/word',
            template:{file:'/Template.MC.html',path:'./app/controllers/word'}
    
        },
    
        devPP: {
            site:"PP",
            port: 5555,
            db: 'mongodb://192.168.5.246:27017/macro_dev',
            root: rootPath,
            notifier: notifier,
            app: {      name: 'Portal de Procesos - Pagos Previsionales - Ambiente de desarrollo',code:"PP"},
            sql : {
                user: 'bp4_sqlusr_admin',
                password: "",
                server: '192.168.5.248',
                database: 'MacroPP_Dev',
                pool: { max: 10, min: 0, idleTimeoutMillis: 10  },
                requestTimeout: 15000
                // , stream: true ,options: {encrypt: true // Use this if you're on Windows Azure}
            }
        },
        devTC: {
            site:"TC",
            port: 3333,
            db: 'mongodb://192.168.5.246:27017/macro_dev',
            root: rootPath,
            notifier: notifier,
            app: {      name: 'Portal de Procesos - Tarjetas de Crédito - Ambiente de desarrollo',code:"TC"},
            sql : {
                user: 'bp4_sqlusr_admin',
                password: '',
                server: '192.168.5.248',
                database: 'MacroTC_Dev',
                pool: { max: 10, min: 0, idleTimeoutMillis: 10  },
                requestTimeout: 140000
            }
        },
    
        testPP: {
            site:"PP",
            port: 5000,
            db: 'mongodb://192.168.5.246:27017/macro_dev',
            root: rootPath,
            notifier: notifier,
            app: {      name: 'Portal de Procesos - Pagos Previsionales - Ambiente de Test', code:"PP"},
            sql : {
                user: 'bp4_sqlusr_admin',
                password: '',
                server: '172.31.7.147',
                port: 7427,
                database: 'MPP_Previsional',
                pool: { max: 10, min: 0, idleTimeoutMillis: 10  },
                requestTimeout: 15000
            }
        },
    
        testTC: {
            site:"TC",
            port: 3000,
            db: 'mongodb://192.168.5.246:27017/macro_dev',
            root: rootPath,
            notifier: notifier,
            app: {      name: 'Portal de Procesos - Tarjetas de Crédito - Ambiente de Test',code:"TC"},
            sql : {
                user: 'bp4_sqlusr_admin',
                password: '',
                server: '172.31.7.147',
                port: 7427,
                database: 'MPP_Tarjetas',
                pool: { max: 10, min: 0, idleTimeoutMillis: 10  },
                requestTimeout: 140000
            }
        },
    
    
        homoPP: {
            site:"PP",
            port: 5050,
            db: 'mongodb://192.168.5.246:27017/macro_dev',
            root: rootPath,
            notifier: notifier,
            app: {      name: 'Portal de Procesos - Pagos Previsionales - Ambiente de Homologación', code:"PP"},
            sql : {
                user: 'bp4_sqlusr_admin_pre',
                password: '',
                server: '172.31.5.211',
                port: 7427,
                database: 'MPP_Previsional',
                pool: { max: 10, min: 0, idleTimeoutMillis: 10  },
                requestTimeout: 15000
            }
        },
    
        homoTC: {
            site:"TC",
            port: 3030,
            db: 'mongodb://192.168.5.246:27017/macro_dev',
            root: rootPath,
            notifier: notifier,
            app: {      name: 'Portal de Procesos - Tarjetas de Crédito - Ambiente de Homologación',code:"TC"},
            sql : {
                user: 'bp4_sqlusr_admin_pre',
                password: '',
                server: '172.31.5.211',
                port: 7427,
                database: 'MPP_Tarjetas',
                pool: { max: 10, min: 0, idleTimeoutMillis: 10  },
                requestTimeout: 140000
            }
        },
    
        prodPP: {
            site:"PP",
            port: 5055,
            db: 'mongodb://192.168.5.246:27017/macro_dev',
            root: rootPath,
            notifier: notifier,
            app: {      name: 'Portal de Procesos - Pagos Previsionales - Ambiente de Producción', code:"PP"},
            sql : {
                user: 'bp4_sqlusr_admin_prod',
                password: '',
                server: '172.31.5.178',
                port: 7427,
                database: 'MPP_Previsional',
                pool: { max: 10, min: 0, idleTimeoutMillis: 10  },
                requestTimeout: 15000
            }
        },
    
        prodTC: {
            site:"TC",
            port: 3033,
            db: 'mongodb://192.168.5.246:27017/macro_dev',
            root: rootPath,
            notifier: notifier,
            app: {      name: 'Portal de Procesos - Tarjetas de Crédito - Ambiente de Producción',code:"TC"},
            sql : {
                user: 'bp4_sqlusr_admin_prod',
                password: '',
                server: '172.31.5.178',
                port: 7427,
                database: 'MPP_Tarjetas',
                pool: { max: 10, min: 0, idleTimeoutMillis: 10  },
                requestTimeout: 140000
            }
        }
    */

};
