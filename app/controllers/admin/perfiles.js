

var  async = require('async')
    , _ = require('underscore')

// var  UserAuthorization= require('../../../config/checkUserAuthorization');


/*  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 EJEMPLOS    https://www.npmjs.com/package/mssql
* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *  * */
var sql = require('mssql');

var MSSQLError = require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();


exports.create = function (req, res) {
    console.log("create  req.body ",req.body);
    //console.log("create  req.body ",req.body.acciones, req.body.acciones.length);
    var acciones="";
    for (var d = 0; d < req.body.acciones.length; d++) {
        acciones+=req.body.acciones[d].idAccion+';';
    }
    acciones = acciones.substring(0, acciones.length - 1);

    var procesos="";
    for (var i = 0; i < req.body.procesos.length; i++) {
        procesos+=req.body.procesos[i].idProceso+';';
    }
    procesos = procesos.substring(0, procesos.length - 1);
    console.log("UPDATE procesos ",procesos);


    sql.connect(process.config.sql).then(function() {
        new sql.Request()
            .input('perfil', sql.VarChar, req.body.perfil)
            .input('nivelSeguridad', sql.Int, req.body.nivelSeguridad)
            .input('codigo', sql.VarChar, req.body.codigo)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('acciones', sql.VarChar, acciones)
            .input('procesos', sql.VarChar, procesos)
            .input('usuario', sql.VarChar, req.user.name)

            .execute('dbo.perfil_insertar').then(function(item) {
                console.log("perfil_insertar",item);
                res.jsonp(item[0])
            }).catch(function(err) {
                console.log("err",err);
                res.status(500).send(ErrorSQL.getError(err));
            });
    }).catch(function(err) {
        console.log("err",err);
        res.status(500).send(ErrorSQL.getError(err));
    });

};

/*
exports.show = function(req, res){
    console.log("exports.show: ",req.perfil);
    res.jsonp(req.perfil);
}
*/



exports.porNivel= function(req, res) {

    // console.log("DADOS BAJA",req.query)
    // console.log("DADOS USER",req.user)

    var connection = new sql.Connection(process.config.sql, function (err) {

        if(typeof req.user=='undefined'){
            res.status(500).send(ErrorSQL.getError("La sesion ha expirado."));
            return;
        }

        new sql.Request(connection)
            .input('nivelSeguridad', sql.Int, req.user.nivelSeguridad)
            .input('dadosBaja', sql.Bit, (req.query.dadosBaja== "true") )
            .execute('dbo.perfil_traerPorNivel').then(function (item) {
                res.jsonp(item[0])
            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
}

exports.all= function(req, res){

    /*
    if(!UserAuthorization.isAuthorized(req,"/perfiles","GET","usuarios.perfiles")){
        return res.status(401).jsonp({error:"No esta autorizado a realizar esta operacion."});
    }
*/
  //   console.log("- PERFIL USER -",req.user)
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .execute('dbo.perfil_traer').then(function(item) {
                res.jsonp(item[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });

    /*
     if(!UserAuthorization.isAuthorized(req,"/perfiles","GET","PERFILES_ABM")){
         return res.status(401).jsonp({error:"No esta autorizado a realizar esta operacion."});
     }

    // Si no se especifica el nivel de seguridad no se devuelven datos
    //   ya que no existe un nivel menor ni igual a cero.

    if(typeof req.query.nivelSeguridad=='undefined'){
        req.query.nivelSeguridad={ $lte: 0};
    }else{
        req.query.nivelSeguridad={ $lte: req.query.nivelSeguridad};
    }


   */
}



exports.acciones = function(req, res){
    console.log("req.query.funcionalidad",req.query.funcionalidad)
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)

            .input('funcionalidad', sql.Int, req.query.funcionalidad)
            .execute('dbo.accion_traer').then(function(item) {
                res.jsonp(item[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });

    /*  if(!UserAuthorization.isAuthorized(req,"/perfiles/acciones","GET","PERFILES_ABM")){
            return res.status(401).jsonp({error:"No esta autorizado a realizar esta operacion."});
        }
    */
}


exports.perfilesAcciones = function(req, res) {
    console.log("- Perfiles_Acciones perfilesAcciones -");
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idPerfil', sql.Int, req.params.perfilId)
            .execute('dbo.perfilAccion_traerPorPerfil').then(function (item) {
               //  console.log(item[0]);
                res.jsonp(item[0])
            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
}

exports.perfilesProcesos = function(req, res) {
    console.log("- Perfiles_Acciones perfilesProcesos -");
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idPerfil', sql.Int, req.params.perfilId)
            .execute('dbo.perfilProceso_traerPorPerfil').then(function (item) {
                // console.log(item[0]);
                res.jsonp(item[0])
            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
}

exports.perfilesFuncionalidades = function(req, res) {
    console.log("- Perfiles_Acciones perfilesFuncionalidades -",req.params);
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idPerfil', sql.Int, req.params.perfilId)
            .input('funcionalidad', sql.Int, 1) // El valor 1 es fijo para obtener los regitros que tienen funcionalidad
            .execute('dbo.perfilAccion_traerPorPerfil').then(function (item) {
              //   console.log(item[0]);
                res.jsonp(item[0])
            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
}







exports.perfil = function(req, res){
    console.log("- PERFIL -");

    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idPerfil', sql.Int, req.params.perfilId)
            .execute('dbo.perfil_traerPorId').then(function(item) {
                res.jsonp(item[0][0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });

    /*  if(!UserAuthorization.isAuthorized(req,"/perfiles","GET","PERFILES_ABM")){
            return res.status(401).jsonp({error:"No esta autorizado a realizar esta operacion."});
        }
   */
};

exports.update = function(req, res){
    console.log("UPDATE req.body ",req.body);
    var acciones="";
    for (var d = 0; d < req.body.acciones.length; d++) {
        acciones+=req.body.acciones[d].idAccion+';';
    }
    acciones = acciones.substring(0, acciones.length - 1);

    var procesos="";
    for (var i = 0; i < req.body.procesos.length; i++) {
        procesos+=req.body.procesos[i].idProceso+';';
    }
    procesos = procesos.substring(0, procesos.length - 1);
    console.log("acciones  - procesos",acciones,procesos );

    sql.connect(process.config.sql).then(function() {
        new sql.Request()
            .input('idPerfil', sql.Int, req.body.idPerfil)
            .input('perfil', sql.VarChar, req.body.perfil)
            .input('nivelSeguridad', sql.Int, req.body.nivelSeguridad)
            .input('codigo', sql.VarChar, req.body.codigo)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('acciones', sql.VarChar, acciones)
            .input('procesos', sql.VarChar, procesos)
            .input('usuario', sql.VarChar, req.user.name)
            .execute('dbo.perfil_modificar').then(function(item) {
                console.log("perfil_modificar",item);
                res.jsonp(item[0])
            }).catch(function(err) {
                console.log("err",err);
                res.status(500).send(ErrorSQL.getError(err));
            });
    }).catch(function(err) {
        console.log("err",err);
        res.status(500).send(ErrorSQL.getError(err));
    });
    console.log("acciones",acciones);


    /*  if(!UserAuthorization.isAuthorized(req,"/perfiles","GET","PERFILES_ABM")){
            return res.status(401).jsonp({error:"No esta autorizado a realizar esta operacion."});
        }
    */

};


exports.destroy = function(req, res){
    console.log("- DELETE -");
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idPerfil', sql.Int, req.params.perfilId)
            .input('fecBaja', sql.VarChar, req.body.fecBaja)
            .execute('dbo.perfil_bajar').then(function(item) {
                res.jsonp(item[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });

    /*
    if(!UserAuthorization.isAuthorized(req,"/perfiles","GET","PERFILES_ABM")){
        return res.status(401).jsonp({error:"No esta autorizado a realizar esta operacion."});
    }

    */
};



