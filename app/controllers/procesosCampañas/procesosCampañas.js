var sql = require('mssql');
var MSSQLError=require('../../utils/MSSQLError.js')
var ErrorSQL=new MSSQLError.MSSQLError();

module.exports.traer = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .execute('cmProcesos_traer')
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
            .input('codigo', sql.VarChar, req.body.codigo)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('entidad', sql.Int, req.body.entidad)
            .input('idCampania', sql.Int, req.body.idCampania)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('cmProcesos_insertar')
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
            .input('codigo', sql.VarChar, req.params.codigo)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('entidad', sql.Int, req.body.entidad)
            .input('idCampania', sql.Int, req.body.idCampania)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('cmProcesos_modificar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};

module.exports.borrar = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('codigos', sql.VarChar, req.body.codigos)
            .input('fecBaja', sql.DateTime2, req.body.fecBaja)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('cmProcesos_bajar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};