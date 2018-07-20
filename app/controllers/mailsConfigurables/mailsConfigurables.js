var sql = require('mssql');
var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL = new MSSQLError.MSSQLError();

module.exports.traerPorCodigo = function (codigo, res, next) {
    /*
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('codigo', sql.VarChar, codigo)
            .execute('dbo.mailsConfigurables_traerPorCodigo')
            .then(function(item) {
                next(item);
            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
    */

     process.database.query('call mailsConfigurables_traerPorCodigo(?)',codigo,  function (error,data, fields) {
                  if (error) {
                        res.status(500).send(ErrorSQL.getError(error));
                    }else{
                        if(data[0].length==0){
                            res.status(500).send(ErrorSQL.getCustomError('No se encontraron usuarios.'));
                        }else{
                            res.jsonp(data[0]);
                        }
                    }
                });
};

module.exports.traer = function (req, res) {
    process.database.query('call mailsConfigurables_traer()',  function (error,data, fields) {
                  if (error) {
                        res.status(500).send(ErrorSQL.getError(error));
                    }else{
                        if(data[0].length==0){
                            res.status(500).send(ErrorSQL.getCustomError('No se encontraron usuarios.'));
                        }else{
                            res.jsonp(data[0]);
                        }
                    }
                });
};

module.exports.insertar = function (req, res) {
    /*
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('codigo', sql.VarChar, req.body.codigo)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('de', sql.VarChar, req.body.de)
            .input('para', sql.VarChar, req.body.para)
            .input('copia', sql.VarChar, req.body.copia)
            .input('copiaOculta', sql.VarChar, req.body.copiaOculta)
            .input('asunto', sql.VarChar, req.body.asunto)
            .input('cuerpo', sql.VarChar, req.body.cuerpo)
            .input('llevaAdjuntos', sql.Bit, req.body.llevaAdjuntos)
            .input('idProceso', sql.Int, req.body.idProceso)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.mailsConfigurables_insertar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
    */
    var params=[
                    req.body.codigo,
                    req.body.descripcion,
                    req.body.de,
                    req.body.para,
                    req.body.copia,
                    req.body.copiaOculta,
                    req.body.asunto,
                    req.body.cuerpo,
                    req.body.llevaAdjuntos,
                    req.body.idProceso,
                    req.body.usuario
    ]
      process.database.query('call mailsConfigurables_insertar(?,?,?,?,?,?,?,?,?,?,?)',params,  function (error,data, fields) {
                if (error) {
                        res.status(500).send(ErrorSQL.getError(error));
                    }else{
                        res.jsonp({"status":"OK", message:"'Se inserto un registro."})
                    }
                });
    

};

module.exports.modificar = function (req, res) {
    /*
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idMails', sql.Int, req.params.idMails)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('de', sql.VarChar, req.body.de)
            .input('para', sql.VarChar, req.body.para)
            .input('copia', sql.VarChar, req.body.copia)
            .input('copiaOculta', sql.VarChar, req.body.copiaOculta)
            .input('asunto', sql.VarChar, req.body.asunto)
            .input('cuerpo', sql.VarChar, req.body.cuerpo)
            .input('llevaAdjuntos', sql.Bit, req.body.llevaAdjuntos)
            .input('idProceso', sql.Int, req.body.idProceso)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.mailsConfigurables_modificar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
    */


     var params=[   req.params.idMails,
                    req.body.descripcion,
                    req.body.de,
                    req.body.para,
                    req.body.copia,
                    req.body.copiaOculta,
                    req.body.asunto,
                    req.body.cuerpo,
                    req.body.llevaAdjuntos,
                    req.body.idProceso,
                    req.body.usuario
    ]
      process.database.query('call mailsConfigurables_modificar(?,?,?,?,?,?,?,?,?,?,?)',params,  function (error,data, fields) {
                if (error) {
                        res.status(500).send(ErrorSQL.getError(error));
                    }else{
                        res.jsonp({"status":"OK", message:"'Se modifico un registro."})
                    }
                });
};

module.exports.borrar = function (req, res) {
    /*
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idMails', sql.VarChar, req.body.idMails)
            .input('fecBaja', sql.DateTime2, req.body.fecBaja)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.mailsConfigurables_bajar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    })
    */

        var params=[req.body.idMails,
                    req.body.fecBaja.replace('Z',' ').replace('T',' '),
                    req.body.usuario
        ];
        process.database.query('call mailsConfigurables_bajar(?,?,?)',params,  function (error,data, fields) {
                if (error) {
                        res.status(500).send(ErrorSQL.getError(error));
                    }else{
                        res.jsonp({"status":"OK", message:"'Se modifico un registro."})
                    }
                });
};


 