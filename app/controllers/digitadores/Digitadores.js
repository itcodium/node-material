var sql = require('mssql');
var MSSQLError=require('../../utils/MSSQLError.js')
var ErrorSQL=new MSSQLError.MSSQLError();

module.exports.traer = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .execute('digitadores_traer')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};

module.exports.seleccionar = function (req, res) { };

module.exports.controlDuplicado = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idDigitador', sql.VarChar, req.query.idDigitador)
            .input('idProceso', sql.VarChar, req.query.idProceso)
            .input('cuenta', sql.VarChar, req.query.cuenta)
            .input('digitador', sql.VarChar, req.query.digitador)
            .execute('digitadores_controlDuplicado')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};


module.exports.insertar = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idProceso', sql.VarChar, req.body.idProceso)
            .input('cuenta', sql.VarChar, req.body.cuenta)
            .input('digitador', sql.VarChar, req.body.digitador)
            .input('accion', sql.VarChar, req.body.accion)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('digitadores_ingresar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};

module.exports.modificar = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idDigitador', sql.Int, req.body.idDigitador)
            .input('cuenta', sql.VarChar, req.body.cuenta)
            .input('accion', sql.VarChar, req.body.accion)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('digitadores_modificar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};

module.exports.delete = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idDigitador', sql.VarChar, req.body.idDigitador)
            .input('fecBaja', sql.DateTime2, req.body.fecBaja)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('digitadores_bajar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};
