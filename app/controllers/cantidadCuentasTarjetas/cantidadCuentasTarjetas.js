var sql = require('mssql');
var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();

exports.obtenerTipoCuentas = function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('dbo.tiposCtasTarjetas_traer').then(function(recordset) {
            res.json(recordset[0])
        }).catch(function(err) {
            res.jsonp(err)
        });
    });
};

exports.obtenerTodos = function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('dbo.EDPCantCuentasTarjetas_traer').then(function(recordset) {
            res.json(recordset[0])
        }).catch(function(err) {
            res.jsonp(err)
        });
    });
};

exports.guardar = function(req, res){
    const obj = req.body.cuenta;
    const usuario = req.body.usuario;
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('entidad', sql.Int, obj.entidad)
            .input('sucursal', sql.Int, obj.sucursal)
            .input('codigoAltaCuenta', sql.Int, obj.codigoAltaCuenta)
            .input('codigoAltaTarjeta', sql.Int, obj.codigoAltaTarjeta)
            .input('NroSolicitudAltaCuenta', sql.Int, obj.NroSolicitudAltaCuenta)
            .input('NroSolicitudAltaTarjeta', sql.Int, obj.NroSolicitudAltaTarjeta)
            .input('codigoTipoCuenta', sql.VarChar, obj.codigoTipoCuenta)
            .input('cantidad', sql.Int, obj.cantidad)
            .input('usuario', sql.VarChar, usuario)
            .execute('dbo.EDPCantCuentasTarjetas_insertar')
            .then(function(recordset) {
                res.json(recordset[0])
            })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err))
            });
    });
};

exports.modificar = function(req, res){
    const obj = req.body.cuenta;
    const usuario = req.body.usuario;
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idEDPCant', sql.Int, obj.idEDPCant)
            .input('sucursal', sql.Int, obj.sucursal)
            .input('codigoAltaCuenta', sql.Int, obj.codigoAltaCuenta)
            .input('codigoAltaTarjeta', sql.Int, obj.codigoAltaTarjeta)
            .input('NroSolicitudAltaCuenta', sql.Int, obj.NroSolicitudAltaCuenta)
            .input('NroSolicitudAltaTarjeta', sql.Int, obj.NroSolicitudAltaTarjeta)
            .input('cantidad', sql.Int, obj.cantidad)
            .input('usuario', sql.VarChar, usuario)
            .execute('dbo.EDPCantCuentasTarjetas_actualizar')
            .then(function(recordset) {
                res.json(recordset[0])
            })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err))
            });
    });
};

exports.controlDuplicado = function(req, res){
    const obj = req.body.cuenta;
    const usuario = req.body.usuario;
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('entidad', sql.Int, obj.entidad)
            .input('sucursal', sql.Int, obj.sucursal)
            .input('codigoTipoCuenta', sql.VarChar, obj.codigoTipoCuenta)
            .execute('dbo.EDPCantCuentasTarjetas_controlDuplicado')
            .then(function(recordset) {
                res.json(recordset[0])
            })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err))
            });
    });
};

exports.bajar = function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idEDPCant', sql.VarChar, req.body.idEDPCant)
            .execute('dbo.EDPCantCuentasTarjetas_eliminar')
            .then(function(recordset) {
                res.json(recordset[0])
            })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err))
            });
    });
};
