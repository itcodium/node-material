var sql = require('mssql');
var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();

exports.getCoeficientesImportes = function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('nm_unifLCCoefImportes_traer').then(function(recordsets) {
            res.json(recordsets[0]);
        }).catch(function(err) {
            res.json(err);
        });
    });
};

exports.saveCoeficientesImporte = function(req, res){
    const coeficienteImporte = req.body.coeficiente;
    const usuario = req.body.usuario;
    const connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('marca', sql.Int, coeficienteImporte.marca)
            .input('letra', sql.VarChar, coeficienteImporte.letra)
            .input('coeficiente', sql.Int, coeficienteImporte.coeficiente)
            .input('importe', sql.Decimal(18,6), coeficienteImporte.importe)
            .input('usuario', sql.VarChar, usuario)
            .input('idUnifLCCoefImportes', sql.VarChar, coeficienteImporte.idUnifLCCoefImportes)
            .execute('dbo.nm_unifLCCoefImportes_ingresar').then(() => {
                res.json({ok:true});
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

module.exports.delCoeficientesImportes = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('coeficientesImportes', sql.VarChar, req.query.coeficientesImportes)
            .input('usuario', sql.VarChar, req.query.usuario)
            .execute('nm_unifLCCoefImportes_bajar')
            .then(function (recordset) {
                res.json(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};