
var sql = require('mssql');

var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();

exports.sucursalGetAll= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('dbo.Sucursales_Traer').then(function(recordset) {
            res.jsonp(recordset[0])
        }).catch(function(err) {
            res.jsonp(err)
        });
    });
};

exports.sucursalGetEDP= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('dbo.sucursales_traerEDP').then(function(recordset) {
            res.jsonp(recordset[0])
        }).catch(function(err) {
            res.jsonp(err)
        });
    });
};
exports.traerDivisiones = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection).query('SELECT codigo, descripcion FROM divisiones WHERE fecBaja IS NULL')
        .then(function (recordset) {
            res.jsonp(recordset)
        })
        .catch(function (err) {
            res.jsonp(err)
        })
    })
};

exports.GetById= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idSucAgen', sql.Int, req.params.idSucAgen)
            .execute('dbo.Sucursales_TraerSeleccion').then(function(Item) {
            if(Item[0].length==0){
                throw new Error("No se encontro el registro buscado.");
            }
            res.jsonp(Item[0][0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.GetByCodigo= function(req, res){
    console.log("Item",req.query,req.params)
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('codSucursal', sql.Int, req.query.codSucursal)
            .execute('dbo.Sucursales_TraerPorCodigo').then(function(Item) {
                console.log("Item",Item)
                res.jsonp(Item[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};
exports.delete= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idSucAgen', sql.Int, req.params.idSucAgen)
            .input('fecBaja', sql.DateTime2, req.body.fecBaja)
            .execute('dbo.Sucursales_Bajar').then(function(item) {
            res.jsonp(item[0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });

};

exports.update= function(req, res){
    if (req.body.TC) {
        var connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('idSucAgen', sql.Int, req.params.idSucAgen)
                .input('descripSucursal', sql.VarChar, req.body.descripSucursal)
                .input('idLocalidad', sql.Int, req.body.idLocalidad)
                .input('calle', sql.VarChar, req.body.calle)
                .input('numero', sql.VarChar, req.body.numero)
                .input('codPostal', sql.VarChar, req.body.codPostal)
                .input('codRegion', sql.VarChar, req.body.codRegion)
                .input('codDivision', sql.VarChar, req.body.codDivision)
                .input('marcaEDP', sql.VarChar, req.body.marcaEDP ? 1 : 0)
                .input('codGeografico', sql.VarChar, req.body.codGeografico)
                .input('codSucursalFusionada', sql.VarChar, req.body.codSucursalFusionada)
                .input('usuario', sql.VarChar, req.body.usuario)
                .execute('dbo.Sucursales_Actualizar').then(function (item) {
                res.jsonp(item[0])
            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
        });
    } else {
        var connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('idSucAgen', sql.Int, req.params.idSucAgen)
                .input('descripSucursal', sql.VarChar, req.body.descripSucursal)
                .input('idLocalidad', sql.Int, req.body.idLocalidad)
                .input('calle', sql.VarChar, req.body.calle)
                .input('numero', sql.VarChar, req.body.numero)
                .input('codPostal', sql.VarChar, req.body.codPostal)
                .input('codRegion', sql.VarChar, req.body.codRegion)
                .input('usuario', sql.VarChar, req.body.usuario)
                .input('aplicaFallecido', sql.VarChar, req.body.aplicaFallecido)
                .execute('dbo.Sucursales_Actualizar').then(function (item) {
                res.jsonp(item[0])
            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
        });
    }
};

exports.insert= function(req, res){

    if (req.body.TC){
            var connection = new sql.Connection(process.config.sql, function(err) {
                new sql.Request(connection)
                    .input('codAgencia', sql.VarChar, req.body.codAgencia)
                    .input('codSucursal', sql.VarChar, req.body.codSucursal)
                    .execute('dbo.Sucursales_ControlDuplicado').then(function(resp) {
                        new sql.Request(connection)
                            .input('codSucursal', sql.VarChar, req.body.codSucursal)
                            .input('descripSucursal', sql.VarChar, req.body.descripSucursal)
                            .input('idLocalidad', sql.Int, req.body.idLocalidad)
                            .input('calle', sql.VarChar, req.body.calle)
                            .input('numero', sql.VarChar, req.body.numero)
                            .input('codPostal', sql.VarChar, req.body.codPostal)
                            .input('codRegion', sql.VarChar, req.body.codRegion)
                            .input('codDivision', sql.VarChar, req.body.codDivision)
                            .input('marcaEDP', sql.VarChar, req.body.marcaEDP ? 1 : 0)
                            .input('codGeografico', sql.VarChar, req.body.codGeografico)
                            .input('codSucursalFusionada', sql.VarChar, req.body.codSucursalFusionada ? req.body.codSucursalFusionada : req.body.codSucursal)

                            .input('usuario', sql.VarChar, req.body.usuario)
                            .execute('dbo.Sucursales_Insertar').then(function(item) {
                                res.jsonp(item[0][0])
                            }).catch(function(err) {
                                console.log("err",err)
                                res.status(500).send(ErrorSQL.getError(err));
                            })

                    }).catch(function(err) {
                        res.status(500).send(ErrorSQL.getError(err));
                    });
            });
        }else{


        var connection = new sql.Connection(process.config.sql, function(err) {
            new sql.Request(connection)
                .input('codAgencia', sql.VarChar, req.body.codAgencia)
                .input('codSucursal', sql.VarChar, req.body.codSucursal)
                .execute('dbo.Sucursales_ControlDuplicado').then(function(resp) {

                    new sql.Request(connection)
                        .input('codAgencia', sql.VarChar, req.body.codAgencia)
                        .input('codSucursal', sql.VarChar, req.body.codSucursal)
                        .input('descripSucursal', sql.VarChar, req.body.descripSucursal)
                        .input('idLocalidad', sql.Int, req.body.idLocalidad)
                        .input('calle', sql.VarChar, req.body.calle)
                        .input('numero', sql.VarChar, req.body.numero)
                        .input('codPostal', sql.VarChar, req.body.codPostal)
                        .input('codRegion', sql.VarChar, req.body.codRegion)
                        .input('usuario', sql.VarChar, req.body.usuario)
                        .execute('dbo.Sucursales_Insertar').then(function(item) {
                            res.jsonp(item[0][0])
                        }).catch(function(err) {
                            res.status(500).send(ErrorSQL.getError(err));
                        })

                }).catch(function(err) {
                    res.status(500).send(ErrorSQL.getError(err));
                });
        });
    }

};