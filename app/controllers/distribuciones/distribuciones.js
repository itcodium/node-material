var MSSQLError = require('../../utils/MSSQLError.js');
var ErrorSQL = new MSSQLError.MSSQLError();
var sql = require('mssql');

exports.traer = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .execute('distribuciones_traer')
            .then(function (resp) {
                res.jsonp(resp[0].map(function (dist) {
                    if (Array.isArray(dist.idCampania)) {
                        dist.idCampania = dist.idCampania[0];
                    }
                    return dist;
                }));
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    });
};

exports.insert = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('codigo', sql.VarChar, req.body.codigo)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('campanias', sql.VarChar, req.body.campanias)
            .input('usuario', sql.VarChar, req.body.creadoPor)
            .execute('distribuciones_insertar')
            .then(function (resp) {
                res.jsonp(resp[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.controlDuplicado = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('codigo', sql.VarChar, req.query.codigo)
            .input('campanias', sql.VarChar, req.query.campanias)
            .execute('distribuciones_controlDuplicados')
            .then(function (err, rec, value) {
                res.jsonp({ esDuplicado: value === 0 });
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.modificar = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('codigo', sql.VarChar, req.params.codigo)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('campania', sql.Int, req.body.campania)
            .input('modificadoPor', sql.VarChar, req.body.modificadoPor)
            .execute('distribuciones_modificar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    });
};

exports.borrar = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('codigo', sql.VarChar, req.params.codigo)
            .input('campania', sql.Int, req.body.campania)
            .input('fecBaja', sql.DateTime2, req.body.fecBaja)
            .input('modificadoPor', sql.VarChar, req.body.modificadoPor)
            .execute('distribuciones_borrar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};