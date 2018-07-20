/**
 * Created by BP4-Admin on 23/05/2016.
 */
var  async = require('async')
    , _ = require('underscore');

var sql = require('mssql');
var http = require('http'),
    fs = require('fs');
var StringDecoder = require('string_decoder').StringDecoder;
var APP_CONFIG=require('../../../config/config.js');
var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();
var mailsConfigurables = require('../mailsConfigurables/mailsConfigurables.js');



var MAIL=require('../email/email.js');


exports.enviarArchivo= function(req, res){
    console.log("-- Enviar Archivo req.body --",req.body);
    /*
    codigo: 'AUTCOBISVIAX3',
    idPeriodo: 2080
    */

    mailsConfigurables.traerPorCodigo(req.body.codigo, res, function (item) {
        console.log("**** item[0] ****", req.body)

        if (item[0].length == 0) {
            throw new Error("No se encontron registros.");
        }
        console.log("**** item[0] ****", req.body.codigo, item[0])

        var config_fileName = item[0][0].archivosAdjuntos;
        var config_asunto = item[0][0].asunto;
        var config_cuerpo = item[0][0].cuerpo;
        var config_para = item[0][0].para;
        var config_copia = item[0][0].copia;

        // res.jsonp(item[0])


        var templatePath = "";
        if (req.body.tipo == 'MC') {
            templatePath = APP_CONFIG.Email_PP.template.path + APP_CONFIG.Email_PP.template.file;
        } else {
            templatePath = APP_CONFIG.Email_TC.template.path + APP_CONFIG.Email_TC.template.file;

        }
        console.log("PATH -> ", templatePath);
        fs.readFile(templatePath, function (err, html) {
            if (err) {
                throw err;
            }

            var decoder = new StringDecoder('utf8');
            var textHtml = decoder.write(html);
            var date = new Date();

            var pad = "00";
            var mes = (date.getMonth() + 1).toString();
            var hora = date.getHours();
            var minutos = date.getMinutes();
            mes = pad.substring(0, pad.length - mes.length) + mes;
            hora = pad.substring(0, pad.length - hora.length) + hora;
            minutos = pad.substring(0, pad.length - minutos.length) + minutos;
            var strDate = date.getDate() + "/" + mes + "/" + date.getFullYear() + " /" + hora + ":" + minutos + " HS";
            var nuevaCadena = textHtml.replace(/@FECHA_HORA/i, "<b'>" + strDate + "</b>");
            var files = req.body.files.split(";")
            var filesHtml = "";
            for (var f in files) {
                filesHtml = filesHtml + "<tr><td>" + files[f] + '<span class="red" > ( archivo procesado y controlado )</span>  </td> </tr>'
            }
            nuevaCadena = nuevaCadena.replace(/@FILES/i, filesHtml);
            var filePath = APP_CONFIG.Email_TC.path + '/' + config_fileName;
            // console.log("File Path: ",filePath);
            fs.writeFile(filePath, nuevaCadena, function (err) {
                if (err) {
                    return console.log(err);
                }

                var m = new MAIL.Email();
                try {
                    m.send(config_para, config_copia, config_asunto, config_cuerpo, {
                        filename: config_fileName,
                        path: filePath
                    });
                    logmail(req.body.codigoLog, req.body.idPeriodo, 1, req.body.usuario, '', res);
                }
                catch (e) {
                    logmail(req.body.codigoLog, req.body.idPeriodo, 0, req.body.usuario, e.message, res)
                    console.log("Error Message: ", e.message);
                }

                //res.setHeader('content-type', 'application/ms-word');
                //res.write('');
                //res.end();
            });
        })
    });
};


var logmail=function(codigo,idPeriodo ,estado,usuario ,errorMessage,res )   {

    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('codigo', sql.VarChar, codigo)
            .input('idPeriodo', sql.VarChar, idPeriodo)
            .input('usuario', sql.VarChar, usuario)
            .input('estado', sql.VarChar, estado)
            .input('errorMessage', sql.VarChar, errorMessage)
            .execute('dbo.logMails_Insertar').then(function (item) {
                //res.jsonp(item[0])
                res.write('');
                res.end();
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });


}

exports.traerPorPeriodo = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {

        if(typeof req.user=='undefined'){
            res.status(500).send(ErrorSQL.getError("La sesion ha expirado."));
            return;
        }

        new sql.Request(connection)
            .input('periodo', sql.VarChar, req.params.periodo)
            .execute('dbo.controlArchivos_traerPorPeriodo').then(function (item) {
                res.jsonp(item[0])
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.traerEncabezado = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('tabla', sql.VarChar, req.query.tabla)
            .input('idEncabezado', sql.Int, req.query.idEncabezado)
            .execute('dbo.controlArchivos_encabezados').then(function (item) {
                res.jsonp(item[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    })
};

exports.editarCobis = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {

        if(typeof req.user=='undefined'){
            res.status(500).send(ErrorSQL.getError("La sesion ha expirado."));
            return;
        }

        new sql.Request(connection)
            .input('idPeriodo', sql.VarChar, req.body.idPeriodo)
            .input('idMarca', sql.VarChar, req.body.idMarca)
            .input('cantRegCobis', sql.VarChar, req.body.cantRegCobis)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.controlArchivos_EditarCobis').then(function (item) {
                res.jsonp(item[0])
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};



