var sql = require('mssql');
var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();

exports.getProductos = function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('nm_unifLCProductos_traer').then(function(recordsets) {
            res.json(recordsets[0]);
        }).catch(function(err) {
            res.json(err);
        });
    });
};

exports.saveProducto = function(req, res){
    const producto = req.body.producto;
    const usuario = req.body.usuario;
    const connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('marca', sql.Int, producto.marca)
            .input('tipoCuenta', sql.VarChar, producto.tipoCuenta)
            .input('minimo', sql.Decimal(18,6), producto.minimo)
            .input('usuario', sql.VarChar, usuario)
            .input('idUnifLCProducto', sql.VarChar, producto.idUnifLCProducto)
            .execute('dbo.nm_unifLCProductos_ingresar').then(() => {
                res.json({ok:true});
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

module.exports.delProducto = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('productos', sql.VarChar, req.query.productos)
            .input('usuario', sql.VarChar, req.query.usuario)
            .execute('nm_unifLCProductos_bajar')
            .then(function (recordset) {
                res.json(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};