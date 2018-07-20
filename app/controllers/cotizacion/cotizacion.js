const sql = require('mssql');

const MSSQLError=require('../../utils/MSSQLError.js');
const ErrorSQL=new MSSQLError.MSSQLError();
const fs = require('fs');
const moment = require('moment');

exports.ObtenerCotizaciones = function(req, res){
    const mes = req.query.mes;
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('fecha', sql.VarChar, mes)
            .execute('cotizacion_traer').then(function(recordset) {
                res.json(recordset[0]);
        }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.ObtenerMonedas = function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .execute('monedas_traer').then(function(recordset) {
                res.json(recordset[0]);
        }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.GuardarCotizacion = function (req, res) {
    const cotizacion = req.body.cotizacion;
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('monedaOrigen', sql.Char, cotizacion.monedaOrigen)
            .input('monedaDestino', sql.Char, cotizacion.monedaDestino)
            .input('dia', sql.VarChar, cotizacion.dia)
            .input('cotizacion', sql.Numeric(18,6), cotizacion.cotizacion)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('cotizacion_ingresar')
            .then(function (recordset) {
                res.json(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.EliminarCotizaciones = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idCotizaciones', sql.VarChar, req.query.cotizaciones)
            .input('usuario', sql.VarChar, req.query.usuario)
            .execute('cotizacion_bajar')
            .then(function (recordset) {
                res.json(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};
