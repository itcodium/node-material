
var sql = require('mssql');

var MSSQLError = require('../../utils/MSSQLError.js');
var ErrorSQL = new MSSQLError.MSSQLError();

exports.regionGetAll = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection).execute('dbo.Regiones_Traer').then(function (recordsets) {
            res.jsonp(recordsets[0])
        }).catch(function (err) {
            res.jsonp(err)
        });
    })
};

exports.addRegion = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('codigo', sql.VarChar, req.body.codigo)
            .execute('regiones_controlDuplicado_traer').then(function (resp) {
                console.log("1 RES Duplicados-> ", resp)
                if (resp[0].length > 0) {
                    throw new Error("El código de región ya está ingresado en el sistema");
                }
                console.log("2 RES Duplicados->  PASS")
                var connectionTwo = new sql.Connection(process.config.sql, function (err) {
                    new sql.Request(connectionTwo)
                        .input('codigo', sql.VarChar, req.body.codigo)
                        .input('descripcion', sql.VarChar, req.body.descripcion)
                        .input('usuario', sql.VarChar, req.body.usuario)
                        .execute('dbo.regiones_insertar').then(function (item) {
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
            .execute('dbo.regiones_actualizar').then(function (item) {
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
            .execute('dbo.regiones_bajar').then(function(item) {
            res.jsonp(item[0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

