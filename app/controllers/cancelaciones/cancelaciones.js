/**
 * Created by marcos.marenna on 29/10/2017.
 */
var sql = require('mssql');
var MSSQLError=require('../../utils/MSSQLError.js')
var ErrorSQL=new MSSQLError.MSSQLError();

module.exports.traer = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .execute('rc_ppCancelaciones_traer')
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
            .input('fecPago', sql.DateTime2, req.body.fecPago)
            .input('entidad', sql.Int, 67)//req.body.entidad)
            .input('sucursal', sql.Int, req.body.sucursal)
            .input('nroComercio', sql.VarChar, req.body.nroComercio)
            .input('nombreComercio', sql.VarChar, req.body.nombreComercio)
            .input('nroTarjeta', sql.VarChar, req.body.nroTarjeta)
            .input('fecOrigen', sql.DateTime2, req.body.fecOrigen)
            .input('nroExpediente', sql.VarChar, req.body.nroExpediente)
            .input('nroCpte', sql.VarChar, req.body.nroCpte)
            .input('importe', sql.VarChar, req.body.importe)
            .input('observaciones', sql.VarChar, req.body.observaciones)
            .input('nroCIE', sql.Int, req.body.nroCIE)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('rc_ppCancelaciones_ingresar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};

module.exports.controlDuplicado = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idPpVisaCis', sql.Int, req.query.idPpVisaCis)
            .input('nroCpte', sql.VarChar, req.query.nroCpte)
            .input('nroCIE', sql.Int, req.query.nroCIE)
            .execute('rc_ppCancelaciones_controlDuplicado')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};

//No fue solicitado
/*
module.exports.modificar = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idPpVisaCis', sql.Int, req.body.idPpVisaCis)
            .input('fecPago', sql.DateTime2, req.body.fecPago)
            .input('entidad', sql.Int, 67)//req.body.entidad)
            .input('sucursal', sql.Int, req.body.sucursal)
            .input('nroComercio', sql.VarChar, req.body.nroComercio)
            .input('nombreComercio', sql.VarChar, req.body.nombreComercio)
            .input('nroTarjeta', sql.VarChar, req.body.nroTarjeta)
            .input('fecOrigen', sql.DateTime2, req.body.fecOrigen)
            .input('nroExpediente', sql.VarChar, req.body.nroExpediente)
            .input('nroCpte', sql.VarChar, req.body.nroCpte)
            .input('importe', sql.VarChar, req.body.importe)
            .input('observaciones', sql.VarChar, req.body.observaciones)
            .input('nroCIE', sql.Int, req.body.nroCIE)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('rc_ppCancelaciones_modificar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};
*/
//No fue solicitado
/*
module.exports.delete = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idPpVisaCis', sql.VarChar, req.body.idPpVisaCis)
            .input('fecBaja', sql.DateTime2, req.body.fecBaja)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('rc_ppCancelaciones_bajar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};
*/