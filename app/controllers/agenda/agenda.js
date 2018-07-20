
var sql = require('mssql');

// var APP_CONFIG=require('../../../config/config.js');
// var connectionMacro=APP_CONFIG.MacroDbCnn(process.env.NODE_ENV);

var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();


exports.agendaTraerPorProceso= function(req, res){
    /*
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idAgenda', sql.Int, req.query.idAgenda ? req.query.idAgenda : req.params.idAgenda)
            .input('idProceso', sql.Int, req.query.idProceso ? req.query.idProceso : req.params.idProceso)
            .execute('dbo.agenda_traer_por_proceso').then(function (recordset) {
            res.jsonp(recordset[0]);
        }).catch(function (err) {
            res.jsonp(err)
        });
    });
    */
        var params=[req.query.idAgenda ? req.query.idAgenda : req.params.idAgenda,
                    req.query.idProceso ? req.query.idProceso : req.params.idProceso
        ]
       process.database.query('call agenda_traer_por_proceso(?,?)',  params,function (error,data, fields) {
                  if (error) {
                        res.status(500).send(ErrorSQL.getError(error));
                    }
                    res.jsonp(data[0]);
                });
       
};


exports.agendaAutomaticoGetAll= function(req, res){
       process.database.query('call agenda_traerAutomatico(?)', req.params.idPerfil,function (error,data, fields) {
                  if (error) {
                        res.status(500).send(ErrorSQL.getError(error));
                    }
                    res.jsonp(data[0].map(function (it) {
                        it.deshabilitarAutomatico = it.deshabilitarAutomatico !== 'DESHABILITADO';
                        return it;
                        }));
                });
};

exports.agendaManualGetAll= function(req, res){
    process.database.query('call agenda_traerManual(?)', req.params.idPerfil,function (error,data, fields) {
                  if (error) {
                        res.status(500).send(ErrorSQL.getError(error));
                    }
                    res.jsonp(data[0]);
                });

};

exports.agendaHistoricoGetAll = function (req, res) {
    /*
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idPerfil', sql.Int, req.params.idPerfil)
            .input('descripcion', sql.VarChar, req.query.descripcion)
            .input('desde', sql.VarChar, req.query.desde ? req.query.desde.substring(0,10) : null)
            .input('hasta', sql.VarChar, req.query.hasta ? req.query.hasta.substring(0,10) : null)
            .input('pg', sql.Int, req.query.page)
            .execute('dbo.agenda_traerHistoricos').then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.jsonp(err);
            });
    });
    */
    var params=[ 
                req.params.idPerfil,
                req.query.descripcion,
                req.query.desde ? req.query.desde.substring(0,10) : null,
                req.query.hasta ? req.query.hasta.substring(0,10) : null,
                req.query.page
            ]

       process.database.query('call agenda_traerHistoricos(?,?,?,?,?)', params,function (error,data, fields) {
                  if (error) {
                        res.status(500).send(ErrorSQL.getError(error));
                    }
                    res.jsonp(data[0]);

                });

};

exports.logAgendaTraer = function (req, res) {
    /*
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idLogAgenda', sql.Int, req.params.idLogAgenda)
            .execute('dbo.agenda_traerLogAgendaPasos').then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
    */

      process.database.query('call agenda_traerLogAgendaPasos(?)',  req.params.idLogAgenda,function (error,data, fields) {
                  if (error) {
                        res.status(500).send(ErrorSQL.getError(error));
                    }
                    res.jsonp(data[0]);

                });
};

exports.delete= function(req, res){
    sql.connect(process.config.sql).then(function() {
        new sql.Request()
            .input('idAgenda', sql.Int, req.params.idAgenda)
            .input('fecBaja', sql.Date, req.body.fecBaja)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.agenda_bajar').then(function(item) {
            res.jsonp(item[0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    }).catch(function(err) {
        res.status(500).send(ErrorSQL.getError(err));
    });
};

exports.update= function(req, res){
    console.log(req.body);
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idAgenda', sql.Int, req.params.idAgenda)
            .input('estado', sql.VarChar, req.body.estado)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.agenda_modificar').then(function (item) {
            res.jsonp(item[0])
        }).catch(function (err) {
            console.log(err);
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.bajarProceso= function(req, res){
    sql.connect(process.config.sql).then(function() {
        new sql.Request()
            .input('idProceso', sql.Int, req.body.idProceso)
            .execute('dbo.proceso_traerAgenda').then(function(resp) {
            res.jsonp(item[0][0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    res.status(500).send(ErrorSQL.getError(err));
    });

};

exports.logAgendaPasosGetLast= function(req, res){
    /*
    console.log(req.params.idAgenda);
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input("idAgenda", sql.Int, req.params.idAgenda)
            .execute('dbo.agenda_traerPasosAgenda').then(function(recordset) {
                //console.log("agenda_traerPasosAgenda",recordset[0]);
                res.jsonp(recordset[0]);
            }).catch(function(err) {
                // res.jsonp(err)
                console.log("err",err);
                res.status(500).send(ErrorSQL.getError(err));
        });
    });
    */

          process.database.query('call agenda_traerPasosAgenda(?)',  req.params.idAgenda,function (error,data, fields) {
                  if (error) {
                        res.status(500).send(ErrorSQL.getError(error));
                    }
                    res.jsonp(data[0]);

                });
};

exports.traerConveniosAperturaCuentas = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('regen', sql.Bit, parseInt(req.params.esRegen))
            .execute('dbo.agenda_traerConveniosAperturaCuentas')
            .then(function (result) {
                res.jsonp(result[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.destrabarAgenda = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idAgenda', sql.Int, req.params.idAgenda)
            .execute('dbo.destrabarCorrida')
            .then(function (response) {
                res.jsonp(response[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};


