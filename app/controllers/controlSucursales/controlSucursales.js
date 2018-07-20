/**
 * Created by BP4-Admin on 30/06/2016.
 */

var sql = require('mssql');

var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();

exports.traerControlSucursales = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {

        if(typeof req.user=='undefined'){
            res.status(500).send(ErrorSQL.getError("La sesion ha expirado."));
            return;
        }

        new sql.Request(connection)
            .execute('dbo.controlSucursales_traer').then(function (item) {
            res.jsonp(item[0])
        }).catch(function (err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};


exports.traerControlSucursalesPadronUnificado = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {

        if(typeof req.user=='undefined'){
            res.status(500).send(ErrorSQL.getError("La sesion ha expirado."));
            return;
        }

        new sql.Request(connection)
            .execute('dbo.controlSucursales_PadronUnificado_Traer').then(function (item) {
                var json2csv = require('json2csv');
                var fields = Object.keys(item[0][0]) ;
                try {
                    var result = json2csv({ data: item[0], fields: fields });
                    res.jsonp(result);
                } catch (err) {
                    res.status(500).send(ErrorSQL.getError(err));
                }
            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};