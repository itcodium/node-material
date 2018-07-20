/**
 * Created by josmeiker.diaz on 06/02/2018.
 */

var sql = require('mssql');

var MSSQLError = require('../../utils/MSSQLError.js');
var ErrorSQL = new MSSQLError.MSSQLError();


exports.divisionesGetAll = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection).execute('dbo.divisiones_traer').then(function (recordset) {
            res.json(recordset[0]);
        }).catch(function (err) {
            res.jsonp(err)
        });
    });
};

exports.addDivision = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('codigo', sql.VarChar, req.body.codigo)
            .execute('divisiones_controlDuplicado_traer').then(function (resp) {
                console.log("1 RES Duplicados-> ", resp)
                if (resp[0].length > 0) {
                    throw new Error("El código de división ya está ingresado en el sistema");
                }
                console.log("2 RES Duplicados->  PASS")
                var connectionTwo = new sql.Connection(process.config.sql, function (err) {
                    new sql.Request(connectionTwo)
                        .input('codigo', sql.VarChar, req.body.codigo)
                        .input('descripcion', sql.VarChar, req.body.descripcion)
                        .input('usuario', sql.VarChar, req.body.usuario)
                        .execute('dbo.divisiones_insertar').then(function (item) {
                            res.jsonp(item[0])
                        }).catch(function (err) {
                            res.status(500).send(ErrorSQL.getError(err));
                        });
                });


            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.update = function (req, res) {
    var connectionTwo = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connectionTwo)
            .input('codigo', sql.VarChar, req.body.codigo)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.divisiones_actualizar').then(function (item) {
                res.jsonp(item[0])
            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.delete= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('codigo', sql.VarChar, req.body.codigo)
            .input('fecBaja', sql.DateTime2, req.body.fecBaja)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.division_bajar').then(function(item) {
            res.jsonp(item[0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};





