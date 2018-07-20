
var sql = require('mssql')

var MSSQLError=require('../../utils/MSSQLError.js')
var ErrorSQL=new MSSQLError.MSSQLError()

exports.canalesGetAll= function(req, res){
    sql.connect(process.config.sql).then(function() {
        new sql.Request().execute('dbo.CategoriesGetAll').then(function(recordset) {
            res.jsonp(recordset)
        }).catch(function(err) {
            res.jsonp(err)
        });
    }).catch(function(err) {
        res.jsonp(err)
    });
}

exports.GetById= function(req, res){
    console.log("*** GetById  ***",req.params.idCanal);
    sql.connect(process.config.sql).then(function() {
        new sql.Request()
            .input('id', sql.Int, req.params.idCanal)
            .execute('dbo.CategoriesGetById').then(function(Item) {
                if(Item[0].length==0){
                    throw new Error("No se encontro el registro buscado.");
                }
                res.jsonp(Item[0][0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    }).catch(function(err) {
        res.status(500).send(ErrorSQL.getError(err));
    });
}

exports.delete= function(req, res){
    sql.connect(process.config.sql).then(function() {
        new sql.Request()
            .input('CategoryID', sql.Int, req.params.idCanal)
            .execute('dbo.CategoriesDelete').then(function(item) {
                res.jsonp(item)
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    }).catch(function(err) {
        res.status(500).send(ErrorSQL.getError(err));
    });

}

exports.update= function(req, res){
    sql.connect(process.config.sql).then(function() {
        new sql.Request()
            .input('CategoryID', sql.Int, req.params.idCanal)
            .input('CategoryName', sql.VarChar, req.body.CategoryName)
            .input('Description', sql.VarChar, req.body.Description)
            .execute('dbo.CategoriesUpdate').then(function(item) {
                res.jsonp(item)
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    }).catch(function(err) {
        res.status(500).send(ErrorSQL.getError(err));
    });
}

exports.insert= function(req, res){
    sql.connect(process.config.sql).then(function() {
        new sql.Request()
            .input('CategoryName', sql.VarChar, req.body.CategoryName)
            .input('Description', sql.VarChar, req.body.Description)
            .execute('dbo.CategoriesInsert').then(function(item) {
                res.jsonp(item)
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    }).catch(function(err) {
        res.status(500).send(ErrorSQL.getError(err));
    });

}





