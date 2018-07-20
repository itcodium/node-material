var Client = require('ftp');
var fs = require('fs');

var APP_CONFIG=require('../../config/URL.js')

exports.PimsFTP= function () {
    var c = new Client();
    c.connect({host:APP_CONFIG.FTP.HOST,
        port:APP_CONFIG.FTP.PORT,
        user:APP_CONFIG.FTP.USUARIO,
        password:APP_CONFIG.FTP.PASSWORD
        }

    );
    // ,:

    this.uploadFile=function (file, destino){

        c.on('ready', function() {
            c.put(file, APP_CONFIG.FTP.PATH+"/"+destino, function(err) {
                if (err){
                    console.log("Copia OK",err)
                    throw err;
                }


                console.log("Copia OK")
                c.end();
            });
        });

     //   console.log("El archivo ingresado es: ",APP_CONFIG.FTP.PATH+"/"+destino)
    }
}

