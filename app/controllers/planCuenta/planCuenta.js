/**
 * Created by marcos.marenna on 29/08/2017.
 */
var sql = require('mssql');
var MSSQLError=require('../../utils/MSSQLError.js')
var ErrorSQL=new MSSQLError.MSSQLError();

module.exports.traer = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('cuenta', sql.VarChar, req.query.cuenta)
            .execute('planCuenta_traer')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};
