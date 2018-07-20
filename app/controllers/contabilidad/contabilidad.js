var sql = require('mssql');

var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();

exports.traerCuentas = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('proceso', sql.VarChar, req.params.proceso)
            .execute('contabilidad_traerPorProceso')
            .then(function(recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};



exports.traerProcesoCuenta = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('proceso', sql.VarChar, req.query.proceso)
            .input('cuenta', sql.VarChar, req.query.cuenta)
            .execute('contabilidad_traerProcesoCuenta')
            .then(function(recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};




exports.traerConfiguracionContable = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idProceso', sql.Int, null)
            .execute('configuracionContable_traer')
            .then(function(recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.updateConfiguracionContable = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idConfiguracionContable', sql.VarChar, req.body.idConfiguracionContable)
            .input('cuentaDebito', sql.VarChar, req.body.cuentaDebito)
            .input('cuentaCredito', sql.VarChar, req.body.cuentaCredito)
            .input('modificadoPor', sql.VarChar, req.body.modificadoPor)
            .execute('configuracionContable_modificar')
            .then(function(recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};
