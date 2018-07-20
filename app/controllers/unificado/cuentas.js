var sql = require('mssql');
var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();

exports.getCuentas = function(req, res){
    const filters = req.query;
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('fecProceso', sql.VarChar, filters.fecProceso)
            .input('tipoArchivo', sql.VarChar, 'CUENTA')
            .input('nroCuenta', sql.VarChar, filters.nroCuenta)
            .input('nroTarjeta', sql.VarChar, filters.nroTarjeta)
            .input('tipoNovedad', sql.VarChar, filters.tipoNovedad)
            .execute('nmUnificadoReporte_Cuenta').then(function(recordsets) {
                res.json(recordsets[0]);
        }).catch(function(err) {
            res.json(err);
        });
    });
};

exports.getTipoCuentas = function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('tiposCtasTarjetas_traer').then(function(recordsets) {
            res.json(recordsets[0]);
        }).catch(function(err) {
            res.json(err);
        });
    });
};

exports.saveCuenta = function(req, res){
    const cuenta = req.body.cuenta;
    const usuario = req.body.usuario;
    const connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('codigoAltaCuenta', sql.Int, cuenta.codigoAltaCuenta)
            .input('banco', sql.VarChar, cuenta.banco)
            .input('tipoCuenta', sql.VarChar, cuenta.tipoCuenta)
            .input('codPromotor', sql.VarChar, cuenta.codPromotor)
            .input('codLC', sql.VarChar, cuenta.codLC)
            .input('porcFinanciacion', sql.VarChar, cuenta.porcFinanciacion)
            .input('modLiq', sql.VarChar, cuenta.modLiq)
            .input('formaPago', sql.VarChar, cuenta.formaPago)
            .input('cartera', sql.VarChar, cuenta.cartera)
            .input('catCajeroAutomatico', sql.VarChar, cuenta.catCajeroAutomatico)
            .input('GAF', sql.VarChar, cuenta.GAF)
            .input('sitIVA', sql.VarChar, cuenta.sitIVA)
            .input('agrupaUsuario', sql.VarChar, cuenta.agrupaUsuario)
            .input('producto', sql.VarChar, cuenta.producto)
            .input('marcaOrigen', sql.VarChar, cuenta.marcaOrigen)
            .input('usuario', sql.VarChar, usuario)
            .input('idVSDatosFijosCuentas', sql.VarChar, cuenta.idVSDatosFijosCuentas)
            .execute('dbo.nm_VSDatosFijosCuentas_ingresar').then(() => {
                res.json({ok:true});
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

module.exports.delCuentas = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('cuentas', sql.VarChar, req.query.cuentas)
            .input('usuario', sql.VarChar, req.query.usuario)
            .execute('nm_VSDatosFijosCuentas_bajar')
            .then(function (recordset) {
                res.json(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};