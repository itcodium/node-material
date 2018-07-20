var sql = require('mssql');
var MSSQLError=require('../../utils/MSSQLError.js')
var ErrorSQL=new MSSQLError.MSSQLError();

module.exports.traer = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .execute('vi_PromoMotivoRechazos_traer')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};

module.exports.seleccionar = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idMotivoRechazos', sql.Int, req.params.idMotivoRechazos)
            .execute('vi_PromoMotivoRechazos_seleccionar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};
module.exports.controlDuplicado = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('tipo', sql.VarChar, req.query.tipo)
            .input('codigo', sql.VarChar, req.query.codigo)
            .execute('vi_PromoMotivoRechazos_controlDuplicado')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};


module.exports.insertar = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('tipo', sql.VarChar, req.body.tipo)
            .input('codigo', sql.VarChar, req.body.codigo)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('validacion', sql.VarChar, req.body.validacion)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('vi_PromoMotivoRechazos_insertar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};

module.exports.modificar = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idMotivoRechazos', sql.Int, req.body.idMotivoRechazos)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('validacion', sql.VarChar, req.body.validacion)
            .input('fecBaja', sql.VarChar, req.body.fecBaja)
            .input('usuario', sql.VarChar, req.body.usuario)
            .input('baja', sql.VarChar, req.body.baja)
            .execute('vi_PromoMotivoRechazos_modificar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};