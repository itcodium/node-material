const sql = require('mssql');
const MSSQLError = require('../../utils/MSSQLError.js');
const ErrorSQL = new MSSQLError.MSSQLError();


module.exports.obtenerEventos = function(req, res){
    const connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .execute('dbo.evento_traer').then(function(recordsets) {
                res.json(recordsets[0]);
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

module.exports.obtenerEventoGrupos = function(req, res){
    const connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .execute('dbo.evento_ingresar').then(function(recordsets) {
            res.json(recordsets[0]);
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

module.exports.guardarEvento = function(req, res){
    const evento = req.body.evento;
    const usuario = req.body.usuario;
    const connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('codEventoGrupos', sql.Int, evento.codEventoGrupos)
            .input('codEvento', sql.Int, evento.codEvento)
            .input('descripcion', sql.VarChar, evento.descripcion)
            .input('usuario', sql.VarChar, usuario)
            .input('idEvento', sql.Int, evento.idEvento)
            .execute('dbo.evento_guardar').then(function(recordsets) {
            res.json({ok:true});
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

module.exports.bajaEvento = function(req, res){
    const eventos = req.query.eventos;
    const fecBaja = req.query.fecBaja;
    const usuario = req.query.usuario;
    const connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('eventos', sql.VarChar, eventos)
            .input('fecBaja', sql.VarChar, fecBaja)
            .input('usuario', sql.VarChar, usuario)
            .execute('dbo.evento_baja').then(function(recordsets) {
            res.json({ok:true});
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};