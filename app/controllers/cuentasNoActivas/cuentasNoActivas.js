
var sql = require('mssql');

var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();

exports.traerPorPeriodo = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {

        if(typeof req.user=='undefined'){
            res.status(500).send(ErrorSQL.getError("La sesion ha expirado."));
            return;
        }
        new sql.Request(connection)
            .input('periodo', sql.VarChar, req.query.periodo)
            .execute('dbo.cuentasNoActivas_traerPorPeriodo').then(function (item) {
                res.jsonp(item[0]);
            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.traerPeriodos = function (req, res) {
    /*
    var connection = new sql.Connection(process.config.sql, function (err) {
        if(typeof req.user=='undefined'){
            res.status(500).send(ErrorSQL.getError("La sesion ha expirado."));
            return;
        }
        new sql.Request(connection)
            .execute('dbo.cuentasNoActivas_traerPeriodos').then(function (item) {
            res.jsonp(item[0])
        }).catch(function (err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
    */

      process.database.query('call cuentasNoActivas_traerPeriodos()', function (error,data, fields) {
                  if (error) {
                        res.status(500).send(ErrorSQL.getError(error));
                    }
                    res.jsonp(data[0]);

                });
};

exports.clientesRechazados_TraerPeriodos = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        if(typeof req.user=='undefined'){
            res.status(500).send(ErrorSQL.getError("La sesion ha expirado."));
            return;
        }
        new sql.Request(connection)
            .execute('dbo.clientesRechazados_traerPeriodos').then(function (item) {
                res.jsonp(item[0])
            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};


exports.bajaClientes_TraerPeriodos = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        if(typeof req.user=='undefined'){
            res.status(500).send(ErrorSQL.getError("La sesion ha expirado."));
            return;
        }
        new sql.Request(connection)
            .execute('dbo.bajaClientes_traerPeriodos').then(function (item) {
                res.jsonp(item[0])
            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};


exports.bajaClientes_TraerConvenios= function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        if(typeof req.user=='undefined'){
            res.status(500).send(ErrorSQL.getError("La sesion ha expirado."));
            return;
        }
        new sql.Request(connection)
            .execute('dbo.bajaClientes_traerConvenios').then(function (item) {
                res.jsonp(item[0])
            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};
