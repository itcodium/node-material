var sql = require('mssql');
var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();

exports.getOcupaciones = function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('nmOcupacionesTraer').then(function(recordsets) {
            res.json(recordsets[0]);
        }).catch(function(err) {
            res.json(err);
        });
    });
};

exports.getTarjetas = function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('nm_VSDatosFijosTarjetas_traer').then(function(recordsets) {
            res.json(recordsets[0]);
        }).catch(function(err) {
            res.json(err);
        });
    });
};

exports.saveTarjeta = function(req, res){
    const tarjeta = req.body.tarjeta;
    const usuario = req.body.usuario;
    const connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('codigoAltaTarjeta', sql.Int, tarjeta.codigoAltaTarjeta)
            .input('banco', sql.VarChar, tarjeta.banco)
            .input('tipoTarjeta', sql.VarChar, tarjeta.tipoTarjeta)
            .input('categoriaTarjeta', sql.VarChar, tarjeta.categoriaTarjeta || '')
            .input('bonificacion', sql.VarChar, tarjeta.bonificacion || '')
            .input('ocupacion', sql.VarChar, tarjeta.ocupacion || '')
            .input('habilitacion', sql.VarChar, tarjeta.habilitacion || '')
            .input('cargo', sql.VarChar, tarjeta.cargo || '')
            .input('distribucion', sql.VarChar, tarjeta.distribucion || '')
            .input('codProducto', sql.VarChar, tarjeta.codProducto || '')
            .input('ctaEmpresa', sql.VarChar, tarjeta.ctaEmpresa || '')
            .input('tipoTarjetaProducto', sql.VarChar, tarjeta.tipoTarjetaProducto || '')
            .input('marcaOrigen', sql.VarChar, tarjeta.marcaOrigen || '')
            .input('cuartaLinea', sql.VarChar, tarjeta.cuartaLinea || '')
            .input('usuario', sql.VarChar, usuario)
            .input('idVSDatosFijosTarjetas', sql.VarChar, tarjeta.idVSDatosFijosTarjetas)
            .execute('dbo.nm_VSDatosFijosTarjetas_ingresar').then(() => {
                res.json({ok:true});
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

module.exports.delTarjetas = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('tarjetas', sql.VarChar, req.query.tarjetas)
            .input('usuario', sql.VarChar, req.query.usuario)
            .execute('nm_VSDatosFijosTarjetas_bajar')
            .then(function (recordset) {
                res.json(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};