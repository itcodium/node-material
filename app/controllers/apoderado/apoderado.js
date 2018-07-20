
 var async = require('async')
    , _ = require('underscore');

 var sql = require('mssql');


 var MSSQLError=require('../../utils/MSSQLError.js');
 var ErrorSQL=new MSSQLError.MSSQLError();


 
exports.apoderadoGetAll= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('dbo.Apoderados_Traer').then(function(recordset) {
            res.jsonp(recordset[0])
        }).catch(function(err) {
            res.jsonp(err)
        });
    });
};

exports.GetById= function(req, res){
    sql.connect(process.config.sql).then(function() {
        console.log(req.params);
        new sql.Request()
            .input('idApoderado', sql.Int, req.params.idApoderado)
            .execute('dbo.Apoderados_TraerSeleccion').then(function(Item) {
            if(Item[0].length==0){
                throw new Error("No se encontro el registro buscado.");
            }
            res.jsonp(Item[0][0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    }).catch(function(err) {
        res.status(500).send(ErrorSQL.getError(err));
    });
};

exports.delete= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idApoderado', sql.Int, req.params.idApoderado)
            .input('fecBaja', sql.DateTime2, req.body.fecBaja)
            .execute('dbo.Apoderados_Bajar').then(function(item) {
            res.jsonp(item[0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });

};

exports.update= function(req, res){
    sql.connect(process.config.sql).then(function() {
        new sql.Request()
            .input('idApoderado', sql.VarChar, req.body.idApoderado)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.Apoderados_Actualizar').then(function(item) {
            res.jsonp(item[0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    }).catch(function(err) {
        res.status(500).send(ErrorSQL.getError(err));
    });
};

exports.insert= function(req, res){
    sql.connect(process.config.sql).then(function() {
        new sql.Request()
            .input('codigo', sql.VarChar, req.body.codigo)
            .execute('dbo.Apoderados_ControlDuplicado').then(function(item) {
            new sql.Request()
                .input('codigo', sql.VarChar, req.body.codigo)
                .input('descripcion', sql.VarChar, req.body.descripcion)
                .input('usuario', sql.VarChar, req.body.usuario)
                .execute('dbo.Apoderados_Insertar').then(function(item) {
                res.jsonp(item[0][0])
            });
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    }).catch(function(err) {
        res.status(500).send(ErrorSQL.getError(err));
    });

};