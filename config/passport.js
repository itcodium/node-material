var LocalStrategy = require('passport-local'),
    crypto = require('crypto');

var mysql      = require('mysql');		
var _mysql=require('../app/utils/MySql.js')



var env = process.env.NODE_ENV || 'desconocido'  ,
    config = require('./config')[env]

module.exports = function (passport, config) {
    // serialize sessions
    passport.serializeUser(function(user, done) {
        done(null, user)
    })

    function signInUserWithLdap(usuario, password, done) {
		return signInUser(usuario, done);
    }

    function signInUser(usuario, done) {
		try {	
				process.database.query('CALL usuarios_logIn(?)', usuario,function (error, user, fields) {
				  console.log("error",error)
				  if (error) throw error;
				  
				  if(user[0].length === 0){
                    return done(null, false, { message: 'No se encontro el usuario o la contraseña es invalida' })
					}
					var idPerfil=user[0][0].idPerfil;
					process.database.query('CALL perfilAccion_traerPorPerfil(?,?)', [idPerfil,undefined],function (error, item, fields) {
						if (error) {
						  throw error;
						}
						user[0][0].permisos = item[0];
						user[0][0].destrabaAgenda = item[0].filter(function (it) { return it.codigo === 'agenda.destrabarAgenda'; }).length > 0;
                        user[0][0].app = 'TEST';
                        console.log("user[0][0]",user[0][0])
						return done(null, user[0][0]);
							
					});
				});
		}
		catch(err) {
			console.log( "Error -> ",err.message);
		}
	/*
        var connection = new sql.Connection(process.config.sql, function(err) {
            new sql.Request(connection)
                .input('usuario', sql.VarChar, usuario)
                .execute('dbo.usuarios_logIn').then(function(user) {
                if(user[0].length === 0){
                    return done(null, false, { message: 'No se encontro el usuario o la contraseña es invalida' })
                }
                log(user[0][0].idUsuario,1,'00');
                new sql.Request(connection)
                    .input('idPerfil', sql.Int, user[0][0].idPerfil)
                    .execute('dbo.perfilAccion_traerPorPerfil').then(function (item) {
                    user[0][0].permisos = item[0];
                    user[0][0].destrabaAgenda = item[0].filter(function (it) { return it.codigo === 'agenda.destrabarAgenda'; }).length > 0;
                    user[0][0].app = config.app.code;
                    return done(null, user[0][0]);
                }).catch(function (err) {
                    return done(err);
                });
            }).catch(function(err) {
                return done(err);
            });
        });
		*/
    }

    passport.deserializeUser(function(user, done) {
        /*
         si esnecesario se pueden traer datos del usuario
         */
        return done(null, user)

    })
	/*
    var log= function(Idusuario,terminal,codEvento){
        var connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('Idusuario', sql.VarChar, Idusuario)
                .input('terminal', sql.VarChar, terminal)
                .input('codEvento', sql.VarChar, codEvento)
                .execute('dbo.usuarioLog_insertar').then(function (item) {
            }).catch(function (err) {

            });
        });
    };
	*/


    // use local strategy
    passport.use(new LocalStrategy({
            usernameField: 'usuario',
            passwordField: 'password'
        },
        function(usuario, password, done) {
            signInUserWithLdap(usuario,password,done);
        }
    ))


}
