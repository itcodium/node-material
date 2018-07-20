var mysql = require('mysql');

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


var mysql      = require('mysql');		
exports.DATABASE_CNN= {
		  host     : 'localhost',
		  user     : 'root',
		  password : '123123',
		  database : 'mean'
	}
	
exports.Usuarios= function () {
	var connection = mysql.createConnection(strDatabase);
    this.getAll=function(){
		connection.connect();
		connection.query('SELECT * from usuarios', function (error, results, fields) {
		  if (error) throw error;
		  console.log('The result is: ', results);
		});
		connection.end();
	}
}