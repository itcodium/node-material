
var sql = require('mssql');

var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();

exports.getPorcComisiones = function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('dbo.ee_porcentajeComision_traer').then(function(recordset) {
            res.json(recordset[0])
        }).catch(function(err) {
            res.jsonp(err)
        });
    });
};

exports.guardarComision = function(req, res){
    const comision = req.body.comision;
    const usuario = req.body.usuario;

    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('codEnte', sql.VarChar, comision.codEnte)
            .input('tipoPago', sql.Int, comision.tipoPago)
            .input('porcentaje', sql.Decimal(18,6), comision.porcentaje)
            .input('impMinimo', sql.Decimal(18,6), comision.impMinimo)
            .input('impMaximo', sql.Decimal(18,6), comision.impMaximo)
            .input('IVA', sql.Decimal(18,6), comision.IVA)
            .input('usuario', sql.VarChar, usuario)
            .input('idPorcentajeComision', sql.VarChar, comision.idPorcentajeComision)
            .execute('dbo.ee_porcentajeComision_ingresar')
            .then(function(recordset) {
                res.json(recordset[0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err))
        });
    });
};

exports.bajaComisiones = function(req, res){
    const comisionesId = req.query.ids;
    const usuario = req.query.usuario;

    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('porcentajeComisionesId', sql.VarChar, comisionesId)
            .execute('dbo.ee_porcentajeComision_bajar')
            .then(function(recordset) {
                res.json(recordset[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err))
        });
    });
};