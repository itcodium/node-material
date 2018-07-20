const sql = require('mssql');
const MSSQLError = require('../../utils/MSSQLError.js');
const ErrorSQL = new MSSQLError.MSSQLError();


module.exports.getRechazosVS = function(req, res){
    const connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .execute('dbo.nm_altasMasivasVS_Traer').then(function(recordsets) {
            res.json(recordsets[0]);
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};
