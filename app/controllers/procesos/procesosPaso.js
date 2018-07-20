
var sql = require('mssql');

var MSSQLError=require('../../utils/MSSQLError.js')
var ErrorSQL=new MSSQLError.MSSQLError();



exports.procesosPasosInsertar= function(req, res){
    console.log("req procesosPasosInsertar",req)
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idProceso', sql.Int, req.body.idProceso)
            .input('paso', sql.Int, req.body.paso)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('tipoProceso', sql.VarChar, req.body.tipoProceso)
            .input('proceso', sql.VarChar, req.body.proceso)
            .input('metodo', sql.VarChar, req.body.metodo)
            .input('pathEntrada', sql.VarChar, req.body.pathEntrada)
            .input('pathSalida', sql.VarChar, req.body.pathSalida)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.procesoPasos_insertar').then(function(item) {

                //console.log("+ INSERT +",item)
                res.jsonp(item[0][0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
}

exports.procesosPasosModificar= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idProcesoPaso', sql.Int, req.body.idProcesoPaso)
            .input('idProceso', sql.Int, req.body.idProceso)
            .input('paso', sql.Int, req.body.paso)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('metodo', sql.VarChar, req.body.metodo)
            .input('tipoProceso', sql.VarChar, req.body.tipoProceso)
            .input('proceso', sql.VarChar, req.body.proceso)
            .input('pathEntrada', sql.VarChar, req.body.pathEntrada)
            .input('pathSalida', sql.VarChar, req.body.pathSalida)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.procesosPaso_modificar').then(function(item) {
                res.jsonp(item[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
}



exports.procesosPasosBorrar= function(req, res){
    console.log("req.body",req);
    console.log("req.body",req.params);
    sql.connect(process.config.sql).then(function() {
        new sql.Request()
            .input('idProcesoPaso', sql.Int, req.params.idProcesoPaso)
            .execute('dbo.procesoPasos_bajar').then(function(item) {
                res.jsonp(item[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    }).catch(function(err) {
        res.status(500).send(ErrorSQL.getError(err));
    });
}


exports.procesosPasosTraer= function(req, res){
    /*
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idProceso', sql.Int, req.params.idProceso)
            .execute('dbo.procesoPasos_traer').then(function(Item) {
                
                res.jsonp(Item[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
*/console.log("req.params.idProceso",req.params)
       process.database.query('call procesoPasos_traer(?)', req.params.idProceso, function (error,data, fields) {
                  if (error) {
                        res.status(500).send(ErrorSQL.getError(error));
                    }else{
                        if(data[0].length==0){
                            res.status(500).send(ErrorSQL.getCustomError('No se encontraron registros.'));
                        }else{
                            res.jsonp(data[0]);
                        }
                    }
                });

}




exports.usuariosTraer= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('usuario', sql.VarChar, req.params.usuario)
            .execute('dbo.usuarios_traerNombre').then(function(Item) {
                if(Item[0].length==0){
                    throw new Error("No se encontro el registro buscado.");
                }
                res.jsonp(Item[0][0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
}



