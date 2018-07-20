var async = require('async')
    , _ = require('underscore');

var sql = require('mssql'),
    fs = require('fs');
var StringDecoder = require('string_decoder').StringDecoder;

var path = require('path')
    , templatePath = path.normalize(__dirname + '/../word')


var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();

var email = require('../email/email.js');
var mailsConfigurables = require('../mailsConfigurables/mailsConfigurables.js');

exports.periodoTraer= function (req, res) {

    if(typeof req.user=='undefined'){
        res.status(500).send(ErrorSQL.getError("La sesion ha expirado."));
        return;
    }
    var connection = new sql.Connection(process.config.sql, function (err) {

        new sql.Request(connection)
            .execute('dbo.aperturaCuentas_periodos_traer').then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};


exports.convenioTraer= function (req, res) {
    if(typeof req.user=='undefined'){
        res.status(500).send(ErrorSQL.getError("La sesion ha expirado."));
        return;
    }
    var connection = new sql.Connection(process.config.sql, function (err) {
    new sql.Request(connection)
            .execute('dbo.aperturaCuentas_Convenios_traer').then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};



exports.getMigraConvenio= function (req, res) {
    if(typeof req.user=='undefined'){
        res.status(500).send(ErrorSQL.getError("La sesion ha expirado."));
        return;
    }
    var connection = new sql.Connection(process.config.sql, function (err) {

        new sql.Request(connection)
        // periodo: '201605', tipo: 'C'
            .input('periodo', sql.Int, req.query.periodo )
            .input('tipo', sql.VarChar, req.query.tipo)
            .execute('dbo.migras_traer').then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};


exports.viewMigraFile= function (req, res) {

    if(typeof req.user=='undefined'){
        res.status(500).send(ErrorSQL.getError("La sesion ha expirado."));
        return;
    }
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idMigras', sql.Int, req.params.id )
            .execute('dbo.migras_traer_porId').then(function (recordset) {
                // res.setHeader('content-type', 'application/ms-word',"test.txt");
                res.setHeader('Content-disposition', 'attachment; filename='+recordset[0][0].nombre);
                res.sendFile(recordset[0][0].filePath);

            })
            .catch(function (err) {
                return res.status(500).send(ErrorSQL.getError(err));
            });
    });


};



exports.obtenerParametro= function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('proceso', sql.VarChar,req.query.proceso )
            .input('paramNombre', sql.VarChar, req.query.paramNombre )
            .execute('dbo.procesoParam_obtener').then(function (recordset) {
                if(recordset[0].length==0){
                    throw new Error("No se encontro el parametro de inicio.");
                }
                return res.jsonp(  [recordset[0][0]]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};


var config_template={
    "C":{ "template":templatePath+"\\PP\\convenio\\Solicitud de Proceso Carga CONVENIOS (002).htm",
        "codigo":'CONVE_REPORT_VINC'
    },
    "M": {
        "template": templatePath + "\\PP\\convenio\\Solicitud de Proceso Migracion Masiva- Pagos Previsionales (002).htm",
        "codigo": "MIGRA_REPORT_VINC"
    },
    "A":{"template":templatePath+"\\PP\\convenio\\Solicitud de Proceso Altas Masivas de Apoderados.htm",
        "codigo":"APODE_REPORT_VINC"
    }
}



exports.envioMail= function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .execute('dbo.vinculaciones_traerPaths').then(function (recordset) {
                if(recordset[0].length === 0){
                    throw new Error("No se encontraron los parámetros de inicio");
                }
                console.log("------------------------------------------------------------");
                console.log("TIPO -> ",req.query.tipo);
                console.log("------------------------------------------------------------");
                var mm = new EnvioMail.Mail(req, res);

                mm.setData(JSON.parse(req.query.data), req.query.tipo);
                mm.templateFile = config_template[req.query.tipo].template;
                mm.pathDestinoOperaciones = recordset[0][0].pathOperaciones;
                mm.pathDestinoSolicitudes = recordset[0][0].pathSolicitudes;
                mm.pathRecibidos = recordset[0][0].pathRecibidos;
                mm.pathDestinoOperacionesAlt = recordset[0][0].pathOperacionesAlt;
                mm.usarAlt = req.params.usarAlt === "true";
                mm.Paso1_ObtenerConfiguracion(config_template[req.query.tipo].codigo);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

var EnvioMail = (function () {
    function Mail(req, res) {
        this.templateHtml = "";
        this.templateHtmlM = "";
        this.pathDestinoOperaciones = "";
        this.pathDestinoSolicitudes = "";
        this.pathDestinoOperacionesAlt = "";
        this.pathRecibidos="";
        this.rutasArchivosGenerados = [];
        this.usarAlt = false;
        var mail_files;

        this.setData = function(param, pTipo){
            mail_files = param;
            this.files = param;
            this.tipo = pTipo
        };

        this.getHora=function(){
            var date = new Date();
            var pad="00";
            var hora=date.getHours();
            var minutos=date.getMinutes();

            hora=pad.substring(0, pad.length - hora.length)+hora;
            minutos=pad.substring(0, pad.length - minutos.length)+minutos;

            return hora+":"+ minutos +" HS";
        };

        this.getDate=function(separador){
            var date = new Date();
            var pad="00";
            var mes=(date.getMonth() +1).toString();
            var hora=date.getHours();
            var minutos=date.getMinutes();


            mes=pad.substring(0, pad.length - mes.length)+mes;
            if(typeof this.hora=='undefined'){
                this.hora=pad.substring(0, pad.length - hora.length)+hora;
                this.minutos=pad.substring(0, pad.length - minutos.length)+minutos;
            }
            return date.getDate() + separador + mes+ separador + date.getFullYear();
        };

        var exec = require("child_process").exec;

        this.Paso1_ObtenerConfiguracion = function(codigo) {
            var _this = this;
            mailsConfigurables.traerPorCodigo(codigo, res, function(item) {

                if(item[0].length==0){
                    return res.jsonp([{errors: "No se encontraron datos para el codigo: " +codigo }]);
                }
                console.log("CODIGO -> ",codigo,"ITEM",item,item[0][0].archivosAdjuntos)
                _this.config_fileName = item[0][0].archivosAdjuntos;
                _this.config_asunto = item[0][0].asunto;
                _this.config_cuerpo = item[0][0].cuerpo;
                _this.config_para = item[0][0].para;
                _this.config_copia = item[0][0].copia;


                try {
                    _this.Paso2_LeerTemplate();
                }
                catch (e) {
                    console.log("e",e);
                    return res.jsonp([{errors: "Error al leer template de envio mail.", detail: e}]);
                }
            });
        };

        this.Paso2_LeerTemplate=function(){
            console.log(" Paso2_LeerTemplate ")
             var _this=this;
             fs.readFile(this.templateFile, function (err, html) {
                if (err) {
                    var error="";
                    if (typeof err.message!='undefined'){
                        error=err.message;
                    }else{
                        error="Error al leer archivos."
                    }
                    return res.jsonp([{errors: error,detail:err}])
                }
                 var decoder = new StringDecoder('utf8');
                try{
                    _this.templateHtml= decoder.write(html);
                 }
                catch(e){
                    return res.jsonp([{errors: e.message, detail:e}]);
                }

                 console.log("_this.tipo",_this.tipo);

                 if(_this.tipo=="C"){
                    _this.Paso3_GenerarArchivo_Tipo_C();
                 }
                 if(_this.tipo=="M") {
                     _this.Paso3_GenerarArchivos_Tipo_M();
                 }
                 if(_this.tipo=="A") {
                     _this.Paso3_GenerarArchivos_Tipo_A();
                 }
             });
        }
        this.Paso3_GenerarArchivos_Tipo_M=function(){
            var strDateHora=this.getDate(".")+ " /"+ this.getHora();
            var strDate=this.getDate('.')
            this.guardarArchivoPromises = [];
            this.templateHtml=this.templateHtml.replace(/@FECHA_HORA/g,""+strDateHora+"");
            this.templateHtml=this.templateHtml.replace(/@FECHA/g,""+strDate+"");


            var filesHtml= "";
            for (var index in this.files) {
                filesHtml='<table  border="0" cellspacing=0 cellpadding=0 style="font-family:tahoma;border:0;">    \
                                        <tr style="border:0"><td  style="border:0"><b>Lote:</b> 28254 - MIGRACION DE RELACIONES JUB CTA - ANSES</td></tr> \
                                    <tr style="border:0"><td  style="border:0"><b>Proceso:</b> 28284- RECEPCION DE RELACIONES</td></tr> \
                                    <tr style="border:0"><td  style="border:0"><b>Parámetros:</b></td></tr> \
                                    <tr style="border:0"><td style="border:0">	<b>Fecha:</b> <b style="color:red;">'+strDate+'</b></td></tr> \
                                    <tr style="border:0"><td style="border:0">	<b>Archivo:</b> <b style="color:red;">'+this.files[index].nombre+'</b></td></tr> \
                                    <tr style="border:0"><td style="border:0">	<b>Cant. Registros a procesar:</b> <b style="color:red;">'+this.files[index].cantRegistros +'</b></td></tr> \
                                    <tr style="border:0"><td style="border:0">	<b>Cant. Registros del archivo:</b> <b style="color:red;">'+this.files[index].cantRegistros+'</b></td></tr> \
                                    </table>    \
                                    <p>&nbsp;</p>'

                var convenio= this.files[index].nombre.split("_")[1];
                var content=this.templateHtml;
                // Este codigo esta asi porque sino no se actualizaban los archivos y si el ente_convenio
                this.templateHtmlM=content.replace(/@ARCHIVOS/i,""+filesHtml+"");
                content=this.templateHtmlM;
                this.templateHtmlM=content.replace(/@ENTE_CONVENIO/i,""+convenio+"");

                this.guardarArchivoPromises.push(this.Paso4_GuardarArchivoMPromise(index));
            }
            this.Paso4_GuardarArchivoM();
        }

        this.Paso3_GenerarArchivos_Tipo_A=function(){
            var _this=this;
            console.log("<- Paso3_GenerarArchivos_Tipo_A - >");
            var strDateHora=this.getDate(".")+ " /"+ this.getHora();
            var strDate=this.getDate('.')
            var filesHtml= "";


            try{
                this.templateHtml=this.templateHtml.replace(/@FECHA_HORA/g,""+strDateHora+"");
                this.templateHtml=this.templateHtml.replace(/@FECHA/g,""+strDate+"");
                for (var index in this.files) {
                    filesHtml=filesHtml+this.files[index].nombre;
                }

                this.templateHtml=this.templateHtml.replace(/@ARCHIVO/g,""+filesHtml+"");
                this.templateHtml=this.templateHtml.replace(/@PATH_SOLICITUDES/g,""+_this.pathDestinoSolicitudes+"");
                this.templateHtml=this.templateHtml.replace(/@PATH_OPERACIONES/g,""+_this.pathDestinoOperaciones+"");
                this.templateHtml=this.templateHtml.replace(/@PATH_OPERACIONES_RECIBIDO/g,""+_this.pathRecibidos+"");
                _this.Paso4_GuardarArchivo();

            }
            catch(e){
                return res.jsonp([{errors: e.message, detail:e}]);
            }

        }

        this.Paso4_GuardarArchivoMPromise = function (index) {
            var _this = this;
            var nro = index + "_" + this.getDate("") + this.getHora().replace("HS","").replace(":","");
            var currentConfig_fileName = _this.config_fileName.replace(/@NRO/i, "" + nro + "");
            var templateHtml = _this.templateHtmlM;
            return new Promise(function (resolve, reject) {
                fs.writeFile(_this.pathDestinoSolicitudes + currentConfig_fileName, templateHtml, function (err) {
                    if (err) {
                        reject(err);
                    }
                    _this.rutasArchivosGenerados.push(currentConfig_fileName);
                    resolve();
                });
            });
        };

        this.Paso4_GuardarArchivoM = function (index) {
            var _this = this;
            Promise.all(this.guardarArchivoPromises).then(function () {
                _this.Paso5_CopiarArchivos();
            }).catch(function (err) {
                return res.status(500).send(ErrorSQL.getError(err));
            });
        };




        this.Paso3_GenerarArchivo_Tipo_C=function(){

            var strDate=this.getDate(".");
            this.templateHtml=this.templateHtml.replace(/@FECHA/i,""+strDate+"");

            var filesHtml= "";
            for (var index in this.files) {
                filesHtml=filesHtml+'<tr style="color:blue;font-size: 8.5pt;"><td>'+this.files[index].nombre +'</td><td>'+this.files[index].cantRegistros+'</td><td>'+this.files[index].cantRegistros+'</td></tr>';
            }
            this.templateHtml=this.templateHtml.replace(/@DATA_FILES/i,""+filesHtml+"");
            this.Paso4_GuardarArchivo();
        }

        this.Paso4_GuardarArchivo=function(){
            var _this=this;
            var nro=this.getDate("");
            nro=nro+ this.getHora().replace("HS","").replace(":","");
            _this.config_fileName=_this.config_fileName.replace(/@NRO/i,""+nro+"");
            // console.log("this.pathDestinoSolicitudes + _this.config_fileName, this.templateHtml",this.pathDestinoSolicitudes + _this.config_fileName, this.templateHtml)
            fs.writeFile(this.pathDestinoSolicitudes + _this.config_fileName, this.templateHtml, function (err) {
                if (err) {
                    res.status(500).send(ErrorSQL.getError(err));
                }
                _this.Paso5_CopiarArchivos();
            });
        }
        this.Paso5_CopiarArchivos=function(){
            var _this=this;
            var files= "";
            var path = _this.usarAlt ? this.pathDestinoOperacionesAlt : this.pathDestinoOperaciones;
            console.log("*** path Copiar Archivos***" );
            for (var index in this.files) {
                files=files+'"'+this.files[index].filePath+'" ';
                // console.log("*** files ***",files);
            }
            exec('for %I in ('+files +') do copy %I "'+ path+'"', function (error, stdout, stderr) {
                console.log("------------------------------------------------------------------------------");
                console.log(stdout);
                console.log("------------------------------------------------------------------------------");
                /*
                console.log("------------------------------------------------------------------------------");
                console.log(error);
                console.log("------------------------------------------------------------------------------");
                console.log(stderr);
                console.log("------------------------------------------------------------------------------");
                */

                var no_file="";

                if (error instanceof Error) {
                    console.log("**00**00**00**",typeof stdout)
                    try{
                        if (stdout.indexOf("El sistema no puede encontrar el archivo especificado.")>-1)
                        {
                            no_file=" No se encontro el/los archivos."
                        }

                    }
                    catch(e){
                        return res.jsonp([{errors: e.message, detail:e}]);
                    }

                    if (!_this.usarAlt) {
                        console.log("**00**00**00**",no_file)
                        return res.jsonp(
                            [
                                {
                                    errors: "Error al copiar los archivos. Los mismos se copiarán en una ruta alternativa: " +
                                    _this.pathDestinoOperacionesAlt+" (*) "+no_file,
                                    askRetry: true
                                }
                            ]
                        );
                    } else {
                        return res.jsonp(
                            [
                                {
                                    errors: "Error al copiar los archivos"
                                }
                            ]
                        );
                    }
                }
                _this.enviarEmail();
            });
        }

        this.enviarEmail=function(){
            console.log("this.enviarEmail=function()... ")
            var _this=this;
            // Asignar nombre de archivo como asunto
            this.config_asunto=this.config_fileName;
            try {
                var vMail= new email.Email();
                vMail.set_callback(_this.logEnviados);


                var manana = new Date();
                manana.setDate(manana.getDate() + 1);
                var pad="00";
                var mes=(manana.getMonth() +1).toString();
                mes=pad.substring(0, pad.length - mes.length)+mes;
                var strManana=manana.getDate() + "/" + mes+ "/" + manana.getFullYear();

                console.log("vMail.send ...",this)
                if (this.tipo === 'M') {
                    for (var i = 0; i < this.rutasArchivosGenerados.length; i++) {
                        var rutaArchivo = this.rutasArchivosGenerados[i];
                        vMail.send(this.config_para,
                            this.config_copia,
                            rutaArchivo,
                            this.config_cuerpo.replace(/@fecha/g, "" + strManana + " "),
                            {
                                filename: rutaArchivo,
                                path: this.pathDestinoSolicitudes + rutaArchivo
                            });
                        vMail.mailOptions.attachments = [];
                    }
                } else {
                    vMail.send(this.config_para,
                        this.config_copia,
                        this.config_asunto,
                        this.config_cuerpo.replace(/@fecha/g, "" + strManana + " "),
                        {
                            filename: this.config_fileName,
                            path: this.pathDestinoSolicitudes + this.config_fileName
                        });
                }
            }
            catch( e ){
                console.log("Error Message: " ,e.message );
                return res.jsonp([{errors: e.message, detail:e}]);
            }
        }
        this.logEnviados=function(error){
            if (error instanceof Error)
                res.status(500).send([{ error: error.message }]);
            var _this=this;
            var ids= "";
            for (var index in mail_files) {
                ids=ids+mail_files[index].idMigras+';';
            }
            ids=ids.slice(0, -1);
            var connection = new sql.Connection(process.config.sql, function (err) {
                new sql.Request(connection)
                    .input('list_id_migras', sql.VarChar, ids)
                    .execute('dbo.logMails_Convenios').then(function(item){
                        res.jsonp(item);
                    })
                    .catch(function (err) {
                        return res.status(500).send(ErrorSQL.getError(err));
                    });
            });
        }
    }
    return { Mail: Mail}
})()


