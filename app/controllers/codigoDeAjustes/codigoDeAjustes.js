var sql = require('mssql');
var MSSQLError=require('../../utils/MSSQLError.js')
var ErrorSQL=new MSSQLError.MSSQLError();

module.exports.traer = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .execute('ee_codigoAjustes_traer')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

module.exports.insertar = function (req, res) {
    const ajuste = req.body.codigoAjuste;
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('entidad', sql.Int, ajuste.entidad)
            .input('codigo', sql.Int, ajuste.codAjuste)
            .input('emisor', sql.Int, ajuste.emisor)
            .input('importe', sql.Numeric(18,6), ajuste.ImpAjuste)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('ee_codigoAjustes_ingresar')
            .then(function (recordset) {
                res.json(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

module.exports.eliminar = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('entidades', sql.VarChar, req.query.entidades)
            .input('usuario', sql.VarChar, req.query.usuario)
            .execute('ee_codigoAjustes_bajar')
            .then(function (recordset) {
                res.json(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};