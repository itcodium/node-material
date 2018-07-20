/**
 * Module dependencies.
 */


var  crypto = require('crypto');
var vEncriptar=require('../../app/utils/encriptar.js')


var pimEmail=require('../../app/controllers/email/email.js')


//exports.signin = function (req, res) {}

/**
 * Auth callback
 */


// SQL -----------------------------------------------------------------

var sql = require('mysql');

var MSSQLError=require('../utils/MSSQLError.js')
var ErrorSQL=new MSSQLError.MSSQLError();


exports.usuariosTraerResponsables= function(req, res){
/*
    sql.connect(process.config.sql).then(function() {
        new sql.Request()
            .execute('dbo.usuarios_traerResponsables').then(function(recordset) {
                if(recordset[0].length==0){
                    throw new Error("No se encontraron registros.");
                }
                res.jsonp(recordset[0])
            }).catch(function(err) {
                res.jsonp(err)
            });
    }).catch(function(err) {
        res.jsonp(err)
    });
    */

    

     
       process.database.query('call usuarios_traerResponsables();',  function (error,data, fields) {
                  if (error) {
                        res.status(500).send(ErrorSQL.getError(error));
                    }else{
                        if(data[0].length==0){
                            res.status(500).send(ErrorSQL.getCustomError('No se encontraron usuarios.'));
                        }else{
                            res.jsonp(data[0]);
                        }
                    }
                });
       
}



exports.getAllByLevel= function(req, res){
    console.log("1 Usuarios All");
    if(typeof req.user=='undefined'){
        res.status(500).send(ErrorSQL.getError("La sesion ha expirado."));
        return;
    }
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('nivelSeguridad', sql.Int, req.user.nivelSeguridad)
            .execute('dbo.usuarios_traerPorNivel').then(function(item) {
                console.log("2 Usuarios All",item);
                res.jsonp(item[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
}


exports.getAll= function(req, res){
    console.log("1 Usuarios All");
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .execute('dbo.usuarios_traer').then(function(item) {
                console.log("2 Usuarios All",item);
                res.jsonp(item[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
}

exports.getById= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idUsuario', sql.Int, req.params.userId)
            .execute('dbo.usuarios_traerPorId').then(function(item) {
                res.jsonp(item[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
}




exports.update= function (req, res) {

}



// SQL END-----------------------------------------------------------------

exports.authCallback = function (req, res, next) {
  res.redirect('/')
}

/**
 * Show login form
 */

exports.signin = function (req, res) {

    res.render('users/signin', {
    title: 'Signin',
    message: req.flash('error')
  })
}

/**
 * Show sign up form
 */

exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up',
    user: new User()
  })
}

/**
 * Logout
 */

exports.signout = function (req, res) {
  req.logout()
  req.session.destroy(function (err) {
        res.redirect('/signin'); //Inside a callback… bulletproof!
  });
}



/**
 * Session
 */

exports.session = function (req, res) {
    req.session.valid = true;
    res.redirect('/')
}

/**
 * Create user
 */

function makePassword(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 20; i++ ){
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}



/**
 *  Show profile
 */

exports.show = function (req, res) {
  console.log("exports.show",req.profile);
  var user = req.profile
  res.render('users/show', {
    title: user.name,
    user: user
  })
}

exports.me = function (req, res) {
  console.log("req.user exports.me",req.user);
  res.jsonp(req.user || null);
}

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
  console.log("exports.user", id);
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user

      next()
    })
}

/**
 * ABM Usuarios
 */

exports.abm = function (req, res, next) {
    req.institucion = [];
    req.perfiles = [];

    Institucion.find({},function(err, items) {
        if (!err) {
            req.institucion = items;
            generarPantalla();
        }
    });
    Perfiles.find({},function(err, items) {
        if (!err) {
            req.perfiles = items;
            generarPantalla();
        }
    });

    function generarPantalla(){
        if(req.institucion.length > 0 && req.perfiles.length > 0){
            if(req.id){
                User
                .findOne({ _id : req.id })
                .exec(function (err, user) {
                    if (err) return next(err);
                    if (!user) return next(new Error('Failed to load User ' + id));
                    var objUser = user;
                    res.render('users/abm', {
                        title: 'ABM Usuarios',
                        action: 'editar',
                        user: req.user ? JSON.stringify(req.user) : null,
                        institucion: req.institucion,
                        perfiles: req.perfiles,
                        objUser: objUser
                    });
                })
            }else{
                res.render('users/abm', {
                    title: 'ABM Usuarios',
                    action: 'alta',
                    user: req.user ? JSON.stringify(req.user) : null,
                    institucion: req.institucion,
                    perfiles: req.perfiles,
                    objUser: new User()
                });
            }
        }
    }
}

exports.deleteUsers = function(req, res, next){
    var x = 0;
    function dUser(){
        if(x < req.ids.length){
            if(req.ids[x] != ""){
                User.findByIdAndRemove(req.ids[x],
                                        function(err){
                                            if (err) return next(err);
                                            dUser();
                                        });
                x++;
            }else{
                x++;
                dUser();
            }
        }else{
            return res.redirect('/#!/usuarios')
        }
    }
    dUser();
}

exports.createABM = function (req, res) {
    if(req.body.action == "editar"){
        var objUser = new User();

        var ObjUpdate = new Object();
        ObjUpdate.name = req.body.name;
        ObjUpdate.email = req.body.email;
        ObjUpdate.instituciones = [];
        if(Array.isArray(req.body.instituciones)){
            for(var x = 0; req.body.instituciones.length > x; x++){
                ObjUpdate.instituciones.push(req.body.instituciones[x]);
            }
        }else{
            ObjUpdate.instituciones.push(req.body.instituciones);
        }

        //ObjUpdate.instituciones.push(req.body.instituciones);
        ObjUpdate.perfiles = [];
        ObjUpdate.perfiles.push(req.body.perfiles);
        ObjUpdate.username = req.body.username;
        ObjUpdate.modificado_por = req.user.username;
        ObjUpdate.fecha_modificacion = new Date();


        User
            .findByIdAndUpdate(req.body._id, ObjUpdate, function (err,itemUser) {
                if (err) {
                    return res.redirect('/usuarios/'+objUser._id);
                }

                Institucion.find({},function(err, items) {
                    if (!err) {

                        var institu=[];
                        console.log ("req.body.instituciones",req.body.instituciones);

                        if (typeof req.body.instituciones!='undefined'){
                            for(var i = 0; (req.body.instituciones.length > i) ; i++){
                                for(var j = 0; items.length > j; j++){
                                    if(items[j]._id==req.body.instituciones[i]){
                                        institu.push(items[j]);
                                        break;
                                    }
                                }
                            }
                        }
                        
                    }
                });
            }).populate("instituciones");

    }else{
        var objUser = new User(req.body)
        objUser.provider = 'local'
        objUser.save(function (err) {
            if (err) {
                return res.redirect('/usuarios/'+objUser._id);
            }
            return res.redirect('/#!/usuarios')
        })
    }


};

exports.getUser = function(req, res){
    var filter= null;//{ 'fechaProceso': undefined};
    User.find(filter,function(err, items) {
        if (err) {
            res.render('error', {status: 500});
        } else {
            res.jsonp(items);
        }
    });
};

