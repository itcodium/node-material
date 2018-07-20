/**
 * Created by leandro.casarin on 07/04/2017.
 */

var sql = require('mssql');

var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();


exports.insert= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('codigo', sql.Int, req.body.codRegimen)
            .input('idCuenta', sql.Int, req.body.idCuenta)
            .execute('codRegimen_controlDuplicado_traer').then(function(resp) {
                console.log("1 RES Duplicados-> ",resp)
                if(resp[0].length>0){
                    throw new Error("El código de retención ya está ingresado en el sistema para otra cuenta.");
                }
                console.log("2 RES Duplicados->  PASS")
                var connectionTwo = new sql.Connection(process.config.sql, function(err) {
                    new sql.Request(connectionTwo)
                        .input('codigo', sql.VarChar, req.body.codRegimen)
                        .input('descripcion', sql.VarChar, req.body.descripcion)
                        .input('idCuenta', sql.VarChar, req.body.idCuenta)
                        .input('usuario', sql.VarChar, req.body.usuario)
                        .execute('dbo.codRegimen_insertar').then(function (item) {
                            res.jsonp(item[0])
                    }).catch(function(err) {
                            res.status(500).send(ErrorSQL.getError(err));
                    });
                });


        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};


exports.tipoRetencionGetAll= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('dbo.codRegimen_traer').then(function(recordset) {
            res.jsonp(recordset[0]);
        }).catch(function(err) {
            res.jsonp(err)
        });
    });
};

exports.planCuentaGetAll= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('dbo.planCuenta_traer').then(function(recordset) {
            res.jsonp(recordset[0]);
        }).catch(function(err) {
            res.jsonp(err)
        });
    });
};


exports.GetById= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idRegimen', sql.Int, req.params.idRegimen)
            .execute('dbo.codRegimen_traerSeleccion').then(function(Item) {
            if(Item[0].length==0){
                throw new Error("No se encontro el registro buscado.");
            }
            res.jsonp(Item[0][0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.delete= function(req, res){
    console.log("DELETE req.body",req.body)
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idRegimen', sql.Int, req.params.idRegimen)
            .input('fecBaja', sql.DateTime2, req.body.fecBaja)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.codRegimen_bajar').then(function(item) {
            res.jsonp(item[0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};


exports.update= function(req, res){
    console.log("UPDATE  -> ",req.body)

    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('codigo', sql.Int, req.body.codRegimen)
            .input('idCuenta', sql.Int, req.body.idCuenta)
            .input('idRegimen', sql.Int, req.body.idCuenta)
            .execute('codRegimen_controlDuplicado_traer').then(function(resp) {
                console.log("UPDATE  RES Duplicados-> ",resp)
                if(resp[0].length>0){
                    throw new Error("El código de retención ya está ingresado en el sistema para otra cuenta.");
                }
                console.log("2 RES Duplicados->  PASS")
                var connectionTwo = new sql.Connection(process.config.sql, function(err) {
                    console.log("3 RES Duplicados->  IN")
                    new sql.Request(connectionTwo)
                        .input('idRegimen', sql.VarChar, req.body.idRegimen)
                        .input('codigo', sql.VarChar, req.body.codRegimen)
                        .input('descripcion', sql.VarChar, req.body.descripcion)
                        .input('idCuenta', sql.VarChar, req.body.idCuenta)
                        .input('usuario', sql.VarChar, req.body.usuario)
                        .execute('dbo.codRegimen_actualizar').then(function (item) {
                            console.log("3 RES Duplicados->  PASS")
                            res.jsonp(item[0])
                        }).catch(function(err) {
                            res.status(500).send(ErrorSQL.getError(err));
                        });
                });


            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });

    /*
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('codigo', sql.Int, req.params.codigo)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('idCuenta', sql.VarChar, req.body.idCuenta)
            .input('idRegimen', sql.VarChar, req.body.idRegimen)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.codRegimen_actualizar').then(function (item) {
            res.jsonp(item[0])
        }).catch(function (err) {
            console.log(err);
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
    */
};

