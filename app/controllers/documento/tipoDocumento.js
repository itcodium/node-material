
var sql = require('mssql');

var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();

exports.tipoDocumentoGetAll= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
            new sql.Request(connection).execute('dbo.tipoDocumento_traer').then(function(recordset) {
                res.jsonp(recordset[0]);
            }).catch(function(err) {
                res.jsonp(err)
            });
    });
};

exports.GetById= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idTipoDocumento', sql.Int, req.params.idTipoDocumento)
            .execute('dbo.tipoDocumento_traerSeleccion').then(function(Item) {
            if(Item[0].length==0){
                throw new Error("No se encontro el registro buscado.");
            }
            res.jsonp(Item[0][0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.delete= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idTipoDocumento', sql.Int, req.params.idTipoDocumento)
            .input('fecBaja', sql.DateTime2, req.body.fecBaja)
            .execute('dbo.tipoDocumento_bajar').then(function(item) {
            res.jsonp(item[0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.update= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idTipoDocumento', sql.Int, req.params.idTipoDocumento)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('codProvincia', sql.VarChar, req.body.codProvincia)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.tipoDocumento_actualizar').then(function (item) {
            res.jsonp(item[0])
        }).catch(function (err) {
            console.log(err);
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.insert= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('codigo', sql.VarChar, req.body.codigo)
            .input('codProvincia', sql.VarChar, req.body.codProvincia)
            .execute('dbo.tipoDocumento_controlDuplicado').then(function(resp) {
            var connectionTwo = new sql.Connection(process.config.sql, function(err) {
                new sql.Request(connectionTwo)
                    .input('codigo', sql.VarChar, req.body.codigo)
                    .input('descripcion', sql.VarChar, req.body.descripcion)
                    .input('codProvincia', sql.VarChar, req.body.codProvincia)
                    .input('usuario', sql.VarChar, req.body.usuario)
                    .execute('dbo.tipoDocumento_insertar').then(function (item) {
                    res.jsonp(item[0][0])
                })
            });
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};
