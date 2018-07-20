/**
 * Module dependencies.
 */

var sql = require('mssql');

var  crypto = require('crypto'),
    _ = require('underscore')
var  UserAuthorization= require('../../config/checkUserAuthorization');
var pimEmail=require('../../app/controllers/email/email.js')
var APP_CONFIG_URL=require('../../config/URL.js')
var vEncriptar=require('../../app/utils/encriptar.js')

var MSSQLError=require('../utils/MSSQLError.js')
var ErrorSQL=new MSSQLError.MSSQLError();

/*
 ---------------------
 Routes
 ---------------------
 .get    -> .all
 .get    -> .show
 .param  -> .itemName
 .post   -> .create
 .put    -> .update
 .delete -> .destroy
 ---------------------
 */



/*
 - DEPRECATED -
exports.initFormPrecarga= function(req, res) {
    if(!UserAuthorization.isAuthorized(req,"","GET","PRECARGA_USUARIO")){
        console.log("NO AUTORIZATION");
        return res.render('401', {error:"No esta autorizado a realizar esta operacion."})
    }
    return res.render('users/precargausuario', {user:req.user ? JSON.stringify(req.user) : null})
};
*/

exports.initPrecargaSignIn= function(req, res) {
    var message= {"data":"El usuario ya existe.", "class":"show",type:"danger"};
    return res.render('users/precargasignin', {result:message})
};



exports.FormPrecargaSignIn= function(req, res) {
    var preCarga=new PrecargaUsuarioBus(req, res);
        preCarga.buscarPrecarga();
};



/*
function makePassword()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$%&#0123456789";
    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
} */

var clave_enviar_mail=function(email, clave){
    console.log("20 userPrecarga 20",email,clave);
    var to=email;
    var subject='PIMS - Acceso al Portal';
    var message="Su clave para el alta en el portal es: "+ clave+"\n"+ "Por favor acceda a la siguiente dirección: " + APP_CONFIG_URL.URL_PRECARGA_SIGNIN;

    pimEmail.Email.send(to,subject,message);

}

exports.create = function(req, res) {
    console.log("req.body",req.body);
    try {
        var connection = new sql.Connection(process.config.sql, function(err) {
            new sql.Request(connection)
                .input('idPerfil', sql.VarChar, req.body.perfil)
                .input('nombre', sql.VarChar, req.body.nombreApellido)
                .input('email', sql.VarChar, req.body.email)
                .input('usuario', sql.VarChar, req.body.usuario)
                .input('creadoPor', sql.VarChar, req.user.name)
                .execute('dbo.usuarios_insertar').then(function(item) {
                    console.log("+ user ins +",item,item.returnValue)
                    return res.jsonp(item[0])
                }).catch(function(err) {
                    console.log("+ user ins ERR +",err)
                    res.status(500).send(ErrorSQL.getError(err));

                });
        });
    }catch(err) {
        res.status(500).send(ErrorSQL.getError(err));
    }
};


exports.update = function(req, res) {
    console.log("+ *** UPDATE *** +",req.body);

    try {
        var connection = new sql.Connection(process.config.sql, function(err) {
            new sql.Request(connection)
                .input('idUsuario', sql.Int, req.body.idUsuario)
                .input('idPerfil', sql.Int, req.body.idPerfil)
                .input('nombre', sql.VarChar, req.body.nombre)
                .input('email', sql.VarChar, req.body.email)
                .input('user', sql.VarChar, req.user.name)
                .execute('dbo.usuarios_modificar').then(function(item) {
                    console.log("+ user ins +",item,item.returnValue)
                    return res.jsonp(item[0])
                }).catch(function(err) {
                    console.log("+ user ins ERR +",err)
                    res.status(500).send(ErrorSQL.getError(err));

                });
        });
    }catch(err) {
        res.status(500).send(ErrorSQL.getError(err));
    }

};



exports.show = function(req, res){
    console.log("-> Poll.show",req.usuarioprecarga );
    if (!req.usuarioprecarga ) {
        res.jsonp({result:"error",msg:"No se encontraron registros para la busqueda."});
    }else{
        res.jsonp({result:"ok",data:req.usuarioprecarga });
    }
}



exports.all= function(req, res){
    console.log("**** Exports.all PRE CARGA",req.query);
    UserPrecarga //
        .find(function(err, items) {
            if (err) {
                res.jsonp({status: 500});
            } else {
                res.jsonp(items);
            }
        }).populate("institucion");
}



exports.usuarioprecarga = function(req, res, next, id){
    UserPrecarga.findById(id).populate("institucion")
        .exec(function (err, item) {
            if (item) {
                req.usuarioprecarga = item;
            }
            return next();
        });
}


exports.destroy = function(req, res){
    var p = req.usuarioprecarga
    p.remove(function(err){
        if (err) {
            res.jsonp({result:"error",msg:err.message});
        }
        res.jsonp({result:"ok",data:"se elimino el registro."});
    })
}

var PrecargaUsuarioBus= function (req,res) {

    this.buscarPrecarga=function(usuario,pPassword){
        console.log("buscarPrecarga");

        UserPrecarga.findOne({  cedula:req.body.cedula,
                                claveSnap:req.body.claveSnap,
                                fechaAltaUsuario: undefined}
            ,''
            ,function(err, item) {
                if (err) {
                    throw (err);
                }else{
                    if(!item){
                        var message= {"data":"Ha ingresado usuario o clave recibida por e-mail no válidos.", "class":"show",type:"danger"};
                        return res.render('users/precargasignin', {cedula:req.body.cedula,message:message})
                    }else{
                        if(req.body.uPassword1!=req.body.uPassword2){
                            var message= {"data":"Las contraseñas del usuario no coinciden.", "class":"show",type:"danger"};
                            return res.render('users/precargasignin', {cedula:req.body.cedula,message:message})
                        }else{
                            save_user_db(item);
                        }
                    }
                }
            }).populate('instituciones')
    }



    var save_user_db=function(item){
        console.log("save_user_db",item);

        var newUser = new User();
        newUser.provider = 'local'
        newUser.cedula=item.cedula;
        newUser.email=item.email;
        newUser.name=item.name;
        newUser.username=item.username;

        //newUser.nombreyapellido=user.nombreyapellido;
        for(var i=0;i<item.instituciones.length;i++){
            newUser.instituciones.push(item.instituciones[i]);
        }
        for(var j=0;j<item.perfiles.length;j++){
            newUser.perfiles.push(item.perfiles[j]);
        }
        newUser.password=req.body.uPassword1;
        var t=new vEncriptar.EncriptarTexto();
        newUser.claveSnap=t.encrypt(req.body.uPassword1);
        newUser.save(function (err,savedUser) {
            if (err) {
                throw (err);
            }else{
                actualizar_precarga(item);

            }
        })

    }

    var actualizar_precarga=function(item){
        item.fechaAltaUsuario=new Date();
        item.save(function(err,user) {
            console.log("actualizar_precarga - Save");
            if (err) {
                var message= {"data": err.message, "class":"show",type:"danger"};
                return res.render('users/precargasignin', { message: message, cedula: item.cedula })
            }else{
                var message= {"data": "Se ha registrado correctamente.", "class":"show",type:"success"};
                return res.render('users/precargasignin', { message: message, cedula: ""})
            }
        });
    }

}
