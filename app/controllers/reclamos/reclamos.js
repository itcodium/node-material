/**
 * Created by leandro.casarin on 07/04/2017.
 */

var sql = require('mssql');

var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();





exports.borrar= function(req, res){
    console.log("req.body -> ",req.body,req.body.reclamos)
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('reclamos', sql.VarChar, req.body.reclamos)
            .execute('dbo.rve_reclamosElectron_bajar').then(function(Item) {
                res.jsonp(Item[0]);
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.update= function(req, res){
    console.log("req.query",req.body)
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idReclamoElectron', sql.Int, req.body.idReclamoElectron)
            .input('fecContable', sql.VarChar, req.body.fecContable)
            .input('nroReclamo', sql.Int, req.body.nroReclamo)
            .input('nroTarjeta', sql.VarChar, req.body.nroTarjeta)
            .input('cliente', sql.VarChar, req.body.cliente)
            .input('sucTarjeta', sql.VarChar, req.body.sucTarjeta)
            .input('nombreSucTarjeta', sql.VarChar, req.body.nombreSucTarjeta)
            .input('nroCuenta', sql.VarChar, req.body.nroCuenta)
            .input('idMotivo', sql.Int, req.body.idMotivo)
            .input('montoCompra' , sql.VarChar, req.body.montoCompra)
            .input('sucReclamo', sql.Int, req.body.sucReclamo)
            .input('nombreSucReclamo', sql.VarChar, req.body.nombreSucReclamo)
            .input('observaciones', sql.VarChar, req.body.observaciones)
            .input('impTotal', sql.VarChar, req.body.impTotal)
            .input('estado', sql.VarChar, req.body.estado)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.rve_reclamosElectron_modificar').then(function(Item) {
                res.jsonp(Item[0]);
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};



exports.insert= function(req, res){
    console.log("++ Insert req.query +",req.body)
    console.log("++ req.body.nroCuenta.nrocuenta +",req.body.nroCuenta.nrocuenta)
    console.log("++ req.body.estado.estado +",req.body.estado.estado)

    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
           .input('fecContable', sql.VarChar, req.body.fecContable)
           .input('nroReclamo', sql.VarChar, req.body.nroReclamo)
           .input('nroTarjeta', sql.VarChar, req.body.nroTarjeta)
           .input('cliente', sql.VarChar, req.body.cliente)
           .input('sucTarjeta', sql.VarChar, req.body.sucTarjeta)
         //.input('nombreSucTarjeta', sql.VarChar, req.body.nombreSucTarjeta)
           .input('nroCuenta', sql.VarChar, req.body.nroCuenta)
           .input('idSucAgen', sql.Int, req.body.idSucAgen)
           .input('idPadronTDVI', sql.Int, req.body.idPadronTDVI)
           .input('idMotivo', sql.Int, req.body.idMotivo)
           .input('montoCompra' , sql.VarChar, req.body.montoCompra)
           .input('sucReclamo', sql.Int, req.body.sucReclamo)
           .input('nombreSucReclamo', sql.VarChar, req.body.nombreSucReclamo)
           .input('observaciones', sql.VarChar, req.body.observaciones)
           .input('impTotal', sql.VarChar, req.body.impTotal)
           .input('estado', sql.VarChar, req.body.estado)
           .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.rve_reclamosElectron_ingresar').then(function(Item) {
                res.jsonp(Item[0]);
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};



exports.obtenerFechaMaxima= function(req, res){
    console.log("req.query",req.query)
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .execute('dbo.rve_reclamosElectronFechaMaxima_traer').then(function(Item) {
                res.jsonp(Item)
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.motivosReclamo_Traer= function(req, res){
    console.log("req.query",req.query)
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .execute('dbo.rve_motivosReclamo_Traer').then(function(Item) {
                res.jsonp(Item)
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};




exports.GetByFecha= function(req, res){
    console.log("req.query",req.query)
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('fecha', sql.VarChar, req.query.fecha)
            .input('order', sql.VarChar, req.query.order)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('filter', sql.VarChar, req.query.filter)
            .input('export', sql.VarChar, req.query.export)
            .execute('dbo.rve_reclamosElectron_traer').then(function(Item) {
                console.log("rve_reclamosElectron_traer Item",Item)
                res.jsonp(Item)
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};


exports.reclamosCount= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('fecha', sql.VarChar, req.query.fecha)
            .execute('dbo.rve_reclamosCount').then(function(Item) {
                res.jsonp(Item)
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.padronTDTraer= function(req, res){
    console.log("req.query",req.body)
    console.log("req.body",req.body)
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('nroTarjeta', sql.VarChar, req.query.nroTarjeta)
            .execute('dbo.padronTD_traer').then(function(recordset) {
                res.jsonp(recordset[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};


exports.padronTDNroCuentaTraer= function(req, res){
    console.log("req.query",req.body)
    console.log("req.body",req.body)
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('nroTarjeta', sql.VarChar, req.query.nroTarjeta)
            .execute('dbo.padronTD_NroCuenta_traer').then(function(recordset) {
                res.jsonp(recordset[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};









exports.getCuponesPorReclamos= function(req, res){
    console.log("req.query",req.query)
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idReclamoElectron', sql.Int, req.query.idReclamoElectron)
            .input('order', sql.VarChar, req.query.order)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('filter', sql.VarChar, req.query.filter)
            .input('export', sql.VarChar, req.query.export)
            .execute('dbo.rce_reclamosElectron_cuponesTraer').then(function(Item) {
                res.jsonp(Item)
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};



