
var async = require('async')
    , _ = require('underscore')
var sql = require('mssql')

var MSSQLError=require('../../utils/MSSQLError.js')
var ErrorSQL=new MSSQLError.MSSQLError()

exports.getAll = function (req, res) {
    /*
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('dbo.caracteresEspeciales_traer').then(function(recordset) {
            res.jsonp(recordset[0])
        }).catch(function(err) {
            res.jsonp(err)
        })
    })
    */

     process.database.query('call caracteresEspeciales_traer();',  function (error,data, fields) {
                  if (error) {
                        res.status(500).send(ErrorSQL.getError(error));
                    }else{
                        if(data[0].length==0){
                            res.status(500).send(ErrorSQL.getCustomError('No se encontraron registros.'));
                        }else{
                            res.jsonp(data[0]);
                        }
                    }
                });
}

exports.insert = function (req, res) {
    /*
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('caracterEspecial', sql.VarChar, req.body.caracEspecial)
            .input('reemplazarPor', sql.VarChar,    req.body.reemplazarPor)
            .input('signo', sql.VarChar,            req.body.signo)
            .input('creadoPor', sql.VarChar,        req.body.creadoPor)
            .execute('dbo.caracteresEspeciales_insertar').then(function(resp) {
                res.jsonp(resp[0])
            })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err))
            })
    })
    */
        var params=[
                req.body.caracEspecial,
                req.body.remplazarPor,
                req.body.signo,
                req.body.creadoPor
        ]
            console.log("params",params)
        process.database.query('call caracteresEspeciales_insertar(?,?,?,?)', params, function (error,data, fields) {
                  if (error) {
                        res.status(500).send(ErrorSQL.getError(error));
                    }else{
                        res.jsonp({"status":"OK", message:"'Se inserto un registro."})
                    }
                });

}

exports.update = function (req, res) {
    /*
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('caracterEspecial', sql.VarChar, req.body.caracEspecial)
            .input('caracterEspecialNuevo', sql.VarChar, req.body.caracEspecialNuevo)
            .input('reemplazarPor', sql.VarChar, req.body.remplazarPor)
            .input('signo', sql.VarChar, req.body.signo)
            .input('modificadoPor', sql.VarChar, req.body.modificadoPor)
            .execute('dbo.caracteresEspeciales_modificar').then(function(resp) {
                res.jsonp(resp[0])
            })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err))
            })
    })
    */
 
    var params=[
                req.body.caracEspecial,
                req.body.caracEspecialNuevo,
                req.body.remplazarPor,
                req.body.signo,
                req.body.modificadoPor
        ]
    
        process.database.query('call caracteresEspeciales_modificar(?,?,?,?,?)', params, function (error,data, fields) {
                  if (error) {
                        res.status(500).send(ErrorSQL.getError(error));
                    }else{
                        res.jsonp({"status":"OK", message:"'Se modifico un registro."})
                    }
                });
}