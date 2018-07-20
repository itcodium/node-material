var sql = require('mssql');
var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();

exports.asignarAgrupadorGetAll= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('dbo.conciliacionSinAgrupador_Traer').then(function(recordsets) {
            res.jsonp(recordsets[0])
        }).catch(function(err) {
            res.jsonp(err)
        });
    });
};
