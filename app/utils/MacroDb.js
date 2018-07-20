var sql = require('mssql');

/*
 https://github.com/patriksimek/node-mssql#connection
 https://www.npmjs.com/package/mssql

 Output Parameter

.output('output_parameter', sql.VarChar(50))

*/


exports.SQLErrorMessage= function () {
    this.getError=function (err){
        var error={};
        error.name=err.name;
        error.message=err.message;
        error.code=err.code;
        error.number=err.number;
        error.lineNumber=err.lineNumber;
        error.state=err.state;
        error.class=err.class;
    }
}
exports.MacroDb= function () {
    
    this.selectCanales=function (){
        sql.connect(process.config.sql).then(function() {
            new sql.Request().query('select * from CRM_Canales').then(function(recordset) {
                console.dir(recordset);
            }).catch(function(err) {
                console.log("SQL SELECT Error",err)
            });
        }).catch(function(err) {
            console.log("SQL SERVER",err)
        });
    }

    this.canalesGetById=function (canal){
        sql.connect(process.config.sql).then(function() {
            new sql.Request()
                .input('id', sql.Int, canal)
                .execute('dbo.canalesGetById').then(function(recordset) {
                    console.dir(recordset);
                }).catch(function(err) {
                    console.log("Procedure Error",err)
                });
        }).catch(function(err) {
            console.log(err)
        });
    }
}