var sql = require('mssql');

/*
 https://github.com/patriksimek/node-mssql#connection
 https://www.npmjs.com/package/mssql

 Output Parameter

.output('output_parameter', sql.VarChar(50))

*/


exports.MSSQLError= function () {
    this.error={};

    this.type="ERROR";
    this.name="";
    this.message="";
    this.code="";
    this.number="";
    this.lineNumber="";
    this.state="";
    this.class="";

    this.get=function (){
        this.error.type=this.type;
        this.error.name=this.name;
        this.error.message=this.message;
        this.error.code=this.code;
        this.error.number=this.number;
        this.error.lineNumber=this.lineNumber;
        this.error.state=this.state;
        this.error.class=this.class;
        return this.error;
    }
    this.getError=function (err){
        this.error.message=err.sqlMessage;
        this.error.code=err.code;
        this.error.status="ERROR";
        return this.error;
    }
	 this.getCustomError=function (err){
        this.error.message=err;
        this.error.status="ERROR";
        return this.error;
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