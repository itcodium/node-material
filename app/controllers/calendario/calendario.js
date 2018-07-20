

var async = require('async')
    , _ = require('underscore');

var sql = require('mssql');

var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();

exports.calendarioGetAll= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('dbo.calendario_traer').then(function(recordset) {
            res.jsonp(recordset[0]);
        }).catch(function(err) {
            res.jsonp(err)
        });
    });
};

exports.traerPeriodos = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection).execute('dbo.calendario_traerPeriodos').then(function(recordset) {
            res.jsonp(recordset[0]);
        }).catch(function(err) {
            res.jsonp(err)
        });
    });
};

exports.GetById= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idPeriodo', sql.Int, req.params.idPeriodo)
            .execute('dbo.calendario_traerSeleccion').then(function(Item) {
            if(Item[0].length==0){
                throw new Error("No se encontro el registro buscado.");
            }
            res.jsonp(Item[0][0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.update= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idPeriodo', sql.Int, req.params.idPeriodo)
            .input('fecCierre', sql.Date, req.body.fecCierre)
            .input('fecControl', sql.Date, req.body.fecControl)
            .input('usuario', sql.VarChar, req.body.usuario)
            .input('cotizacion', sql.VarChar, req.body.cotizacion)
            .execute('dbo.calendario_modificar').then(function(item) {
                res.jsonp(item[0])
        }).catch(function(err) {
            console.log(err);
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.insert= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('periodo', sql.VarChar, req.body.periodo)
            .input('instancia', sql.Int, req.body.instancia)
            .input('fecCierre', sql.Date, req.body.fecCierre)
            .input('fecControl', sql.Date, req.body.fecControl)
            .input('usuario', sql.VarChar, req.body.usuario)
            .input('cotizacion',sql.VarChar,req.body.cotizacion)
            .execute('dbo.calendario_ingresar').then(function (item) {
                res.jsonp(item[0][0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });

};
