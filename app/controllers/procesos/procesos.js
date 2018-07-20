
var sql = require('mssql');
var fs = require('fs');
var path = require("path");

var MSSQLError=require('../../utils/MSSQLError.js')
var ErrorSQL=new MSSQLError.MSSQLError();
var esDGISICORE = false;
const moment = require('moment');

exports.procesosTraerPorNombre= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('nombre', sql.VarChar, req.params.nombre)
            .execute('dbo.procesos_traerNombre').then(function(recordset) {
                if(recordset[0].length==0){
                    throw new Error("No se encontro el registro buscado.");
                }
                res.jsonp(recordset[0])
        }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
        });
    });
};


exports.procesosTraerTodos= function(req, res){
    
   // console.log("req.query.dadosBaja",req.query.dadosBaja,(req.query.dadosBaja== "true"));
    /*
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('dadosBaja', sql.Bit, (req.query.dadosBaja== "true") )
            .execute('dbo.procesos_traerTodos').then(function(recordset) {
                if(recordset[0].length==0){
                    throw new Error("No se encontraron registros.");
                }
                res.jsonp(recordset[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
    */
console.log("req.query",req.query)
       process.database.query('call procesos_traerTodos(?,?);',[ (req.query.dadosBaja== "true"),undefined] ,function (error,data, fields) {
                  if (error) {
                        res.status(500).send(ErrorSQL.getError(error));
                    }else{
                        if(data[0].length==0){
                            res.status(500).send(ErrorSQL.getCustomError('No se encontraron procesos.'));
                        }else{
                            res.jsonp(data[0]);
                        }
                    }
                });
};

function archivoProcesado(data,value){
    var res=false;
    for (var i=0;i<data.length;i++){

        if ( data[i].nombreArchivo==value ){ // &&  data[i].estado!='ERROR'
            res=true;
            break;
        }
    }
    return res;
}


function archivosBuscar(data,pre,field ){
    var index=-1;
    for (var i=0;i<data.length;i++){
        if ( data[i][field]==pre ){ // &&  data[i].estado!='ERROR'
            index=i;
            break;
        }
    }
    return index;
}


function archivosBuscarPrefPos(data,pre,pos,field,field2 ){
    var index=-1;
    for (var i=0;i<data.length;i++){
        if ( data[i][field]==pre && data[i][field2]==pos ){
            index=i;
            break;
        }
    }
    return index;
}


function archivosNoProcesados(dirFiles,procFiles){

    var archivosNoprocesados=[];
    for (var i=0;i<dirFiles.length;i++){
        var processed=0;
        for (var j=0;j<procFiles.length;j++) {

            if (dirFiles[i].file.toUpperCase() == procFiles[j].nombreArchivo.toUpperCase() ) {
                processed=1;
                break;
            }
        }
        if(processed==0){
            archivosNoprocesados.push(dirFiles[i]);
        }
    }
    return archivosNoprocesados;
}

function checkMesCorriente(mes, año, result, value, data) {
    var date = new Date();
    if ((date.getMonth() + 1) === parseInt(mes) && date.getFullYear() === parseInt(año)) {
        result.push({file: data, anio: año, mes: mes, prefijo: value.prefijo, postfijo:value.postfijo});
    }

}

function esFormatoCorrecto(formato, valor) {
    let esValido = false;
    
    if (formato.formato.length === valor.length) {
        if (formato.formato.toUpperCase().indexOf('MMM') >= 0) {
            esValido = true;
        } else {
            esValido = moment(valor, formato.formato.replace(/A/g, 'Y')).isValid();
        }
    }
    
    return esValido;
}

function archivosDelProceso(fileFormat,data){
    var result=[];
    log("[3] calback -> archivosDelProceso")
    fileFormat.forEach(function (value) {
        for (var i=0;i<data.length;i++) {
            try{

                value.prefijo=  value.prefijo==null?'':value.prefijo;

                value.postfijo=  value.postfijo==null?'': value.postfijo;
                value.formato=  value.formato==null?'':value.formato;
                value.file=  value.formato==null?'':value.file;
                value.mesPosicionInicial=  value.mesPosicionInicial==null?0:value.mesPosicionInicial;
                value.mesCaracteres=  value.mesCaracteres==null?0:value.mesCaracteres;
                value.anioPosicionInicial=  value.anioPosicionInicial==null?0:value.anioPosicionInicial;
                value.anioCaracteres=  value.anioCaracteres==null?0:value.anioCaracteres;
                value.metodoLectura=  value.metodoLectura==null?'':value.metodoLectura;

                value.delimitadorColumna=  value.delimitadorColumna==null?'':value.delimitadorColumna;
                value.delimitadorFila=  value.delimitadorFila==null?'':value.delimitadorFila;
                value.inicioEnFila=  value.inicioEnFila==null?0:value.inicioEnFila;

                value.diaPosicionInicial=  value.diaPosicionInicial==null?0:value.diaPosicionInicial;
                value.diaCaracteres=  value.diaCaracteres==null? 0:value.diaCaracteres;


                log("(10) buscar",data[i].file.toUpperCase(),value.prefijo.toUpperCase())
                if(data[i].file.toUpperCase().indexOf(value.prefijo.toUpperCase()) === 0 || data[i].file.toUpperCase() == value.archivo.toUpperCase()){
                    var rep = data[i].file.toUpperCase().replace(value.prefijo.toUpperCase(), '').replace(value.postfijo.toUpperCase(), '');
                    log("#111 value.proceso ***", value.proceso,"rep-> ",rep)
                    if (!isNaN(rep) && esFormatoCorrecto(value, rep)) {
                        log("#11-0 Nan")
                        var fmes = rep.substring(value.mesPosicionInicial - 1,
                            (value.mesPosicionInicial - 1) + value.mesCaracteres);
                        var faño = rep.substring(value.anioPosicionInicial - 1,
                            (value.anioPosicionInicial - 1) + value.anioCaracteres);

                        if (value.proceso === 'Historico de Seguros VIAX') {
                            checkMesCorriente(fmes, faño, result, value, data[i]);
                        } else {
                            var index=archivosBuscar(result,data[i].file,"file") // (2)
                            if(index!=-1) {
                                result.splice(index, 1);
                                //delete result[index];
                            }
                            result.push({
                                file: data[i],
                                anio: faño,
                                mes: fmes,
                                prefijo: value.prefijo,
                                postfijo: value.postfijo
                            });
                        }
                    }else if(!isNaN(rep.replace(/-/g, "").replace(/\//g, "").replace(/_/g, "")) && esFormatoCorrecto(value, rep)){
                        log("#11-0 Nan forced")
                        var fmes = rep.substring(value.mesPosicionInicial - 1,
                            (value.mesPosicionInicial - 1) + value.mesCaracteres);
                        var faño = rep.substring(value.anioPosicionInicial - 1,
                            (value.anioPosicionInicial - 1) + value.anioCaracteres);
                        if(fmes != "" && faño != ""){
                            if (value.proceso === 'Historico de Seguros VIAX') {
                                checkMesCorriente(fmes, faño, result, value, data[i]);
                            } else {
                                var index=archivosBuscar(result,data[i].file,"file") // (2)
                                if(index!=-1) {
                                    result.splice(index, 1);
                                    //delete result[index];
                                }
                                result.push({
                                    file: data[i],
                                    anio: faño,
                                    mes: fmes,
                                    prefijo: value.prefijo,
                                    postfijo: value.postfijo
                                });
                            }
                        }else{
                            log("#11-0 ELSE Nan")
                            log("#11-0 ELSE Nan",data[i].file.toUpperCase().indexOf(value.postfijo.toUpperCase()))
                            if(data[i].file.toUpperCase().indexOf(value.postfijo.toUpperCase())>-1){
                                var index=archivosBuscar(result,data[i].file,"file") // (2)
                                if(index==-1){
                                    result.push({fullFile:data[i].fullFile, file: data[i].file,directorio:data[i].directorio, anio: faño, mes: fmes, prefijo: value.prefijo, postfijo:value.postfijo});
                                }
                            }
                        }
                    }else{
                        log("#11-0 ELSE Nan")
                        log("#11-0 ELSE Nan",data[i].file.toUpperCase().indexOf(value.postfijo.toUpperCase()))
                        if(data[i].file.toUpperCase().indexOf(value.postfijo.toUpperCase())>-1){
                            var index=archivosBuscar(result,data[i].file,"file") // (2)
                            if(index==-1 && (value.formato.toUpperCase().includes('MMM') || value.formato == '')){
                                result.push({
                                        fullFile:data[i].fullFile,
                                        file: data[i].file,
                                        directorio:data[i].directorio,
                                        anio: faño, mes: fmes,
                                        prefijo: value.prefijo,
                                        postfijo:value.postfijo
                                });
                            }
                        }
                    }

                    //console.log('+++++++++++result', result);
                }else{
                    log("[3] calback -> archivosDelProceso ELSE ??")
                }



            }
            catch(err) {
                log(err.message) ;
            }
        }// fin for
    });
    log("(22) result -> ",result);
    return result;
}

function archivosDelProcesoObtenerMenor(data){
    log("(40) archivosDelProcesoObtenerMenor ",data);
    var archivos=[];

    var maxReg= {
        anio:-1,
        mes:-1,
        archivo:"",
        prefijo:""
    };

    data.forEach(function (value) {
        log("Files -> ",value);
        if(archivos.length==0){
            archivos.push(value);
        }else{
            var index=archivosBuscarPrefPos(archivos,value.prefijo,value.postfijo ,"prefijo","postfijo") // (1)
            if(index==-1){
                archivos.push(value);
            }else{
               // console.log("ya existe",archivos[index]);
                if (value.anio<archivos[index].anio){
                    archivos[index].anio=value.anio;
                    archivos[index].mes=value.mes;
                    archivos[index].file=value.file;
                    archivos[index].prefijo=value.prefijo;
                }else{
                    if(value.anio==archivos[index].anio){
                        if(value.mes<archivos[index].mes) {
                            archivos[index].mes =value.mes;
                            archivos[index].file=value.file;
                            archivos[index].prefijo=value.prefijo;
                        }
                    }
                }
            }
        }
    });

    log("-------------------------------------------------");
    log("- Archivos - ",archivos);

    var r=[];
    archivos.forEach(function (value) {
        r.push(value.file)
    });
    log("Resultado -> ",r);
    log("----------------- FIN R--------------------------------");
    return r;

}





// -- Leer directorio recursivo ---------------------------------------------------------------

var ReadFolder= function () {
    var folder=[];
    var files=[];

    this.setFolder=function(param) {folder.push(param)}
    this.setFile=function(param){files.push(param)}
    this.getFiles=function(){return files}
    this.setEndCallback=function(p){
        end_callback=p;
    }
    this.setCallbackParams=function(pParams) {callbackParams=pParams;}
    this.init=function() {
        execute();
    }
    var execute=function() {
        if (folder.length==0){
            end_callback(files);
            return;
        }
        var f=folder.pop();
        run(f);
    }
    var run=function(param){
        log("run -> ",param);
        fs.readdir(param, function (err, pfiles) {
            if (err) {
                throw err;
                log(err);
            }

            pfiles.map(function (pfile) {
                return path.join(param, pfile);
            }).filter(function (pfile) {
                if(fs.statSync(pfile).isFile()){
                    return fs.statSync(pfile).isFile();
                }
            }).forEach(function (pfile) {
                files.push(pfile);
            });
            execute();
        });
    }
}
// -- Leer directorio recursivo ---------------------------------------------------------------
var archivos_procesados;
var archivos_procesos;
var archivos_folder;
var archivos_res;

var read_folder;
var NOT_ALL=false;
var cobis_archivos_no_procesados;
function callback_return_files(p){
   log("TEST 22 -> Callback archivos_procesos",archivos_procesos);
    var nombre_del_proceso="";

    // Funcion que se llama cuando se termina de leer todo el directorio
    var filenames=read_folder.getFiles();
    var objFiles={files:[]};

    for(var i=0;i<filenames.length;i++){
        filenames[i]=filenames[i].replace(archivos_folder, "")
        if(filenames[i].indexOf("\\")>-1){
                var obj={  fullFile:archivos_folder+filenames[i]
                            ,directorio:filenames[i].split("\\")[0]
                            ,file:filenames[i].split("\\")[1]
                        }
            objFiles.files.push(obj)
        }else{
            var obj={file:filenames[i]}
            obj.directorio="";
            obj.fullFile=archivos_folder+filenames[i]
            objFiles.files.push(obj)
        }
    }
    log("[0] calback")
    if(objFiles.files.length>0){
        filenames=objFiles.files;
    }
    log("[1] calback")
    //console.log("// filenames,archivos_procesados // ",filenames,archivos_procesados)
    var result=archivosNoProcesados(filenames,archivos_procesados)
    cobis_archivos_no_procesados=result;

    log("[2] calback")
    var procFiles=archivosDelProceso(archivos_procesos,result); // devuelve todos los archivos con el dato del año y mes

    // Modificacion 2017-01-11
    /*console.log("----------------- procFiles ------------------------------")
    console.log(procFiles)
    console.log("--------------------- archivos_procesos --------------------------")
    console.log(archivos_procesos)
    console.log("-----------------------------------------------")*/
    var validar_extensiones=new ValidarExtensionArchivos(procFiles, archivos_procesos);
    procFiles=validar_extensiones.validar();

    /*console.log("----------------- procFiles POST ------------------------------")
    console.log(procFiles)*/


    log("[3] calback")
    log("*** (64) ARCHIVO PROCESADOS  ***",archivos_procesados);

    var data;
    switch (archivos_procesos[0].metodoLectura) {
        case "MENOR":
            log("[4] calback")
            data=archivosDelProcesoObtenerMenor(procFiles);
            break;
        case "TODOS":
            log("[5] calback")
                    var faltantes = [];
                    archivos_procesos.forEach(function (archivoProceso) {
                        log("[5] calback forEach")
                        try {
                                var existe = procFiles.find(function (archivo) {
                                    var file;
                                    if(typeof archivo.file.file!='undefined'){
                                        file=archivo.file.file;
                                    }else{
                                        file=archivo.file;
                                    }
                                    return typeof archivo.mes !== 'undefined' ?
                                            file.prefijo === archivoProceso.prefijo
                                            || (file.indexOf(archivoProceso.prefijo) > -1
                                                && archivoProceso.prefijo !== '')
                                        : file === archivoProceso.archivo;
                                });

                                if (!existe) {
                                    faltantes.push(archivoProceso.archivo);
                                }
                            }
                            catch(err) {
                                log(err)
                                archivos_res.status(500).send(ErrorSQL.getError(err));
                            }
                    });
                    if (faltantes.length === archivos_procesos.length) {
                        archivos_res.status(500).send({ STATUS: 'ERROR', message: 'No se encontraron archivos para leer' });
                    }
                    if (faltantes.length !== 0 && NOT_ALL==false) {
                        archivos_res.status(500).send({ notAll: true, missing: faltantes });
                    }
                    data=procFiles;
            break;
        default:
            log("[6] calback")
            data=procFiles;

    }
    log("[5] calback POS +")

    if(archivos_procesos.length>0){
        log("if(archivos_procesos.length>0){")
        nombre_del_proceso=archivos_procesos[0].nombre;
        log("nombre_del_proceso -> ",nombre_del_proceso)
        if(nombre_del_proceso=='Fallecidos - Lectura Cobis'){
            var cobis=new ValidarArchivo.Fallecidos_Lectura_Cobis()
            var data;
            try {
                data=cobis.obtenerArchivos(archivos_procesos[0])
            }catch(err) {
                log("Error -> COBIS ARCHIVO ",err)
                archivos_res.status(500).send({ STATUS: 'ERROR', message: err.message });
            }
            if (data.length ==0) {
                log("3 data res -> ",nombre_del_proceso)
                archivos_res.status(500).send({ STATUS: 'ERROR', message: 'No se encontraron archivos para leer' });
            }
        }
    }

    console.log("-----------------------------------------------------------------")
    console.log("Resultado Archivos  -> ",data)
    console.log("-----------------------------------------------------------------")

    archivos_res.jsonp(data);
}




var LOG=false;
function log(msg){
    if(LOG==true){
        console.log(msg);
    }
}

function procesosArchivos_traer_porIdProceso(res,idProceso,folder ){
    log("3. Paso");
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idProceso', sql.Int, idProceso)
            .execute('dbo.procesosArchivos_traer').then(function (vProcesosArchivos) {

                if (vProcesosArchivos[0].length == 0) {
                    throw new Error("No se encontraron archivos para este proceso, Configuracion ProcesosArchivos.");
                }
                // INIT validar-leer ----------------------------------------------------------------------------------------
                var connection = new sql.Connection(process.config.sql, function(err) {
                    new sql.Request(connection)
                        .input('idProceso', sql.Int,idProceso )
                        .execute('dbo.logagendaValidaArchivo').then(function(vArchivosProcesados) {
                            log("5. Paso");
                            var p=folder;
                            read_folder=new ReadFolder()
                            read_folder.setEndCallback(callback_return_files)

                            fs.readdir(folder, function (err, files) {
                               log("*1");
                                if (err) {
                                    log(["err",err]);
                                    return res.status(500).send(ErrorSQL.getError(err));
                                }
                                log("*2");
                                files.map(function (file) {
                                    return path.join(p, file);
                                }).filter(function (file) {
                                    log("*3");
                                    if(fs.statSync(file).isFile()){
                                        return fs.statSync(file).isFile();
                                    }else{
                                        read_folder.setFolder(file);
                                    }
                                }).forEach(function (file) {
                                    log("*4");
                                    read_folder.setFile(file);
                                });
                                log("*5");
                                archivos_procesados =vArchivosProcesados[0];
                                log("*6");
                                archivos_procesos   =vProcesosArchivos[0];
                                log("*7");
                                archivos_res=res;
                                log("*8");
                                archivos_folder=folder;
                                log("*9");
                                read_folder.init();
                            });

                        }).catch(function (err) {
                            log("00. Paso");
                            res.status(500).send(ErrorSQL.getError(err));
                        });
                });
                // Fin  validar-leer ----------------------------------------------------------------------------------------


            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    })

}





exports.procesosTraerArchivos= function(req, res){
    console.log("req.query.notall",req.query.notAll);

    if(typeof req.query.notAll=='undefined'){
        req.query.notAll=false;
        NOT_ALL=false;
    }else{
        NOT_ALL=true;
    }
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idProceso', sql.Int, req.query.idProceso )
            .execute('dbo.procesoPasos_traer').then(function(recordset) {
                log("0 traer archivos.");
                if(recordset[0].length==0 && NOT_ALL==false){
                    log("X.Error traer archivos.");
                    throw new Error("No se encontraron datos para el proceso seleccionado.");
                }
                log("1 traer archivos.", recordset);
                procesosArchivos_traer_porIdProceso(res, req.query.idProceso,recordset[0][0]["pathEntrada"])
                log("2 traer archivos.");
            }).catch(function(err) {
                log("3. Paso",err);
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};
exports.getAgendasProceso= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idProceso', sql.Int, req.params.idProceso)
            .execute('dbo.proceso_traerAgenda').then(function (recordset) {
            if (recordset[0].length == 0) {
                throw new Error("No se encontraron registros.");
            }
            res.jsonp(recordset[0]);
        }).catch(function (err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};
/*
var run=function(idAgenda,idProceso,tipo,nombre,paso,user){

    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idAgenda', sql.Int, idAgenda)
            .input('idProceso', sql.Int, idProceso)
            .input('tipo', sql.VarChar, tipo)
            .input('nombre', sql.VarChar,nombre )
            .input('paso', sql.VarChar,paso )
            .input('usuario', sql.VarChar,user)
            .execute('dbo.ejecucionProcesoManual').then(function (recordset) {
                console.log("recordset", nombre,recordset)
                //console.log("3 PROC: RUN -",recordset[0])
              //  res.jsonp(recordset[0]);
            }).catch(function (err) {
                console.log("PROC: RUN -",nombre,err)
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
}

*/
exports.procesoEjecutar= function(req, res){
    console.log("1. Ejecutar proceso"); //,req.body
    // console.log.clean();
    // console.log("Ejecutar proceso");
    insertarArchivosaProcesar(req, res,procesoEjecutar);
};
function insertarArchivosaProcesar(req, res,callback){
    console.log("2. Ejecutar proceso",req.body  )
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idProceso', sql.Int,req.body.idProceso )
            .input('archivos', sql.VarChar,req.body.archivos )
            .execute('dbo.procesoArchivosProcesados_insert').then(function(item) {
                console.log("3. Ejecutar proceso")
                callback(req, res);
                // res.jsonp(item[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
    /**/
}
function procesoEjecutar(req, res){
    console.log("4. Ejecutar proceso")
    var connection = new sql.Connection(process.config.sql, function(err) {

        // Checkeo de procesos dependientes ejecutados
        /* La validacion se hace en el SP ejecucionProcesoManual (Mod PH 2016-06-06)
         El usuario ahora puede decidir desde la interfaz ejetutar el proceso si o no
         para ello envia el parametro: validarDependencia
         -- Se comentaron estas lineas ya que la validacion tambien estaba en el sp  ejecucionProcesoManual
         new sql.Request(connection)
         .input('idProceso', sql.Int, req.body.idProceso)
         .execute('dbo.agenda_checkearDependenciaManual').then(function (data) {
         }).catch(function (err) {
         res.status(500).send(ErrorSQL.getError(err));
         });
         */

        // No hay dependencias a ejecutar
        new sql.Request(connection)
            .input('idProceso', sql.Int, req.body.idProceso)
            .execute('dbo.procesoPasos_traer').then(function (recordset) {
                if (recordset[0].length == 0) {
                    throw new Error("No se encontraron pasos para el proceso.");
                }

                var runPaso=new PasosBus(req,res);
                runPaso.setPasos(recordset[0])
                runPaso.setCallbackParams({});
                runPaso.setEndCallback(function(p){
                   console.log("5. PASOS EndCallback +++",p);
                    res.jsonp({result:"OK"});
                });
                runPaso.init();

            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });


    });
}
exports.procesosAgendaDelete= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idProceso', sql.Int, req.params.idProceso)
            .input('fecBaja', sql.VarChar, req.query.fecBaja.replace('Z',' ').replace('T',' '))
            .input('usuario', sql.VarChar, req.query.usuario)
            .execute('dbo.agenda_bajar_por_proceso').then(function(item) {
            res.jsonp(item[0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};
exports.procesosReactivar= function(req, res){
    console.log("req.query.dadosBaja",req.query.dadosBaja,(req.query.dadosBaja== "true"));
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idProceso', sql.Int, req.query.idProceso)
            .input('idUsuario', sql.Int, req.query.idUsuario)
            .execute('dbo.procesos_reactivar').then(function(recordset) {
                res.jsonp(recordset[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};
exports.procesosBorrar= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idProceso', sql.Int, req.query.id)
            .input('fecBaja', sql.VarChar,req.query.fecBaja ) //new Date(req.query.fecBaja)
            .input('usuario', sql.VarChar, req.query.usuario)
            .execute('dbo.procesos_bajar').then(function(item) {
                res.jsonp('OK')
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};
exports.procesosInsertar= function(req, res){
 //   console.log("procesosInsertar",req.body);
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idUsuario', sql.Int, req.body.idUsuario)
            .input('nombre', sql.VarChar, req.body.nombre)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('tipo', sql.VarChar, req.body.tipo)
            .input('frecuencia', sql.VarChar, req.body.frecuencia)
            .input('vencimiento', sql.Int, req.body.vencimiento)
            .input('usuarioResponsable', sql.Int, req.body.usuarioResponsable)
            .input('accionExito', sql.VarChar, req.body.accionExito)
            .input('parametroExito', sql.VarChar, req.body.parametroExito)
            .input('accionFracaso', sql.VarChar, req.body.accionFracaso)
            .input('parametroFracaso', sql.VarChar, req.body.parametroFracaso)
            .input('depende', sql.Int, req.body.depende)
            .input('visible', sql.Bit, req.body.visible )
            .input('marca', sql.VarChar, req.body.marca)
            .input('fecInicio', sql.Date, req.body.fecInicio)
            .input('intervalo', sql.Int, req.body.intervalo)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.procesos_insertar').then(function(item) {
                console.log("end procesos_insertar end",item[0][0]);
                res.jsonp(item[0][0])
            }).catch(function(err) {
                console.log("err",err);
                //res.status(500).send(ErrorSQL.getError(err));
                if(err.class != 14) {
                    console.log("1", err)
                    res.status(500).send(ErrorSQL.getError(err));
                }else {
                    console.log("1", err)
                    res.status(207).send(ErrorSQL.getError(err));
                }
            });
    });
}
exports.procesosModificar= function(req, res){
    console.log("0","procesosModificar FEC INICIO",req.body.fecInicio)

    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idProceso', sql.Int, req.body.idProceso)
            .input('nombre', sql.VarChar, req.body.nombre)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('tipo', sql.VarChar, req.body.tipo)
            .input('frecuencia', sql.VarChar, req.body.frecuencia)
            .input('vencimiento', sql.Int, req.body.vencimiento)
            .input('usuarioResponsable', sql.Int, req.body.usuarioResponsable)
            .input('accionExito', sql.VarChar, req.body.accionExito)
            .input('parametroExito', sql.VarChar, req.body.parametroExito)
            .input('accionFracaso', sql.VarChar, req.body.accionFracaso)
            .input('parametroFracaso', sql.VarChar, req.body.parametroFracaso)
            .input('depende', sql.Int, req.body.depende)
            .input('visible', sql.Bit, req.body.visible )
            .input('marca', sql.VarChar, req.body.marca)
            .input('fecInicio', sql.VarChar, req.body.fecInicio)
            .input('intervalo', sql.Int, req.body.intervalo)
            .input('usuario', sql.VarChar, req.body.usuario)
            .input('idUsuario', sql.Int, req.body.idUsuario)
            .execute('dbo.procesos_modificar').then(function(item) {
                console.log("1","procesosModificar",item)
                res.jsonp(item[0])

            }).catch(function(err) {
                if(err.class != 14) {
                    console.log("1", err)
                    res.status(500).send(ErrorSQL.getError(err));
                }else {
                    console.log("1", err)
                    res.status(207).send(ErrorSQL.getError(err));
                }
            });
    });
}
exports.procesosTraerDepende= function(req, res){
    console.log("req",req);
    sql.connect(process.config.sql).then(function() {
        new sql.Request()
            .input('idProceso', sql.Int, req.params.idProceso)
            .execute('dbo.procesos_traerDepende').then(function(item) {
                if(item[0].length==0){
                    throw new Error("No se encontro el registro buscado.");
                }
                res.jsonp(item[0][0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    }).catch(function(err) {
        res.status(500).send(ErrorSQL.getError(err));
    });
}
exports.traerEstadoProcesoDependiente= function(req, res){
    console.log("body,params,query",req.params);
    sql.connect(process.config.sql).then(function() {
        new sql.Request()
            .input('idProceso', sql.Int, req.params.idProceso)
            .execute('dbo.procesos_EstadoProcesoDependiente').then(function(item) {
                if(item[0].length==0){
                    throw new Error("No se encontro el registro buscado.");
                }
                // console.log("item[0][0]",item[0]);
                res.jsonp(item[0])
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    }).catch(function(err) {
        res.status(500).send(ErrorSQL.getError(err));
    });
};

exports.procesoParamInsertar = function (req, res) {
    console.log("req.body -> ",req.body.nombreProceso,req.body.agrupar,req.body.paramNombre,req.body.paramValor);
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('proceso', sql.VarChar, req.body.nombreProceso)
            .input('agrupar', sql.Int, req.body.agrupar)
            .input('paramNombre', sql.VarChar, req.body.paramNombre)
            .input('paramValor', sql.VarChar, req.body.paramValor)
            .execute('dbo.procesoParam_insertar')
            .then(function (result) {
                res.jsonp(result[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

var PasosBus= function (req,res) {
    var pasos=[];

    this.setPasos=function(item) {
        console.log("Pasos")
        for(var i = item.length-1;   i>=0; i--){
            pasos.push(item[i]);
            console.log(i,item[i])
        }
    }

    var fin=function() {
        console.log("**** fin ****")
    }

    this.setEndCallback=function(p){
        end_callback=p;
    }
    this.setCallbackParams=function(pParams) {
        callbackParams=pParams;
    }


    this.init=function() {
        console.log("- PASOS INIT -",callbackParams);
        execute();
    }

    var execute=function() {
        if (pasos.length==0){
            console.log("- PASOS END - callbackParams-",callbackParams);
            console.log("end_callback",callbackParams);
            end_callback(callbackParams);
            return;
        }

        var paso=pasos.pop();
        var tipo=paso.tipoProceso
        var nombre=paso.proceso;

        switch (paso.tipoProceso) {
            case 'SERV':
                log("SERV",paso.paso,paso.proceso);
                break;
            case 'PROC':
                run(req.body.idAgenda,req.body.idProceso,tipo,nombre,paso.paso,req.body.username,req.body.validarDependencia);
                log("PROC",paso.paso,paso.proceso);
                break;
            case 'JOB':
                log("JOB",paso.paso,paso.proceso,paso.paso);
                run(req.body.idAgenda,req.body.idProceso,tipo,nombre,paso.paso,req.body.username,req.body.validarDependencia);

                break;
            default:
                log("No se encontro tipo");
        }
    }


    var run=function(idAgenda,idProceso,tipo,nombre,paso,user,validarDependencia){
        log("RUN -> idAgenda,idProceso,tipo,nombre,paso,user,validarDependencia",idAgenda,idProceso,tipo,nombre,paso,user,validarDependencia);
        var connection = new sql.Connection(process.config.sql, function(err) {
            new sql.Request(connection)
                .input('idAgenda', sql.Int, idAgenda)
                .input('idProceso', sql.Int, idProceso)
                .input('tipo', sql.VarChar, tipo)
                .input('nombre', sql.VarChar,nombre )
                .input('paso', sql.VarChar,paso )
                .input('usuario', sql.VarChar,user)
                .input('validarDependencia', sql.VarChar,validarDependencia)

                .execute('dbo.ejecucionProcesoManual').then(function (recordset) {
                    log("END-> ejecucionProcesoManual")
                    execute();
                }).catch(function (err) {
                    //console.log("PROC: RUN -",nombre,err)
                    //res.status(500).send(ErrorSQL.getError(err));
                    if(err.class != 14) {
                        log("1", err)
                        res.status(500).send(ErrorSQL.getError(err));
                    }else {
                        log("1", err)
                        res.status(207).send(ErrorSQL.getError(err));
                    }

                });
        });
    }
}




function convertDateToNumber(value,format){
    if (format.toUpperCase()=="YYMMDD"){
        return parseInt(value.substring(4,6)+value.substring(2,4)+ value.substring(0,2))
    }
    if (format.toUpperCase()=="YYMMDDHHMM"){
        return parseInt(
                value.substring(4,6)+value.substring(2,4)+ value.substring(0,2)+
                value.substring(7,2)+value.substring(9,2)
        )
    }

    return null;
}

var ValidarArchivo= (function () {
    function Fallecidos_Lectura_Cobis(data) {
        var _this=this;
        this.today_files=[];
        this.obtenerArchivos=function(proceso){
            var fecha=this.obtenerDia();

            var config_archivo=proceso.archivo;
            var config_prefijo=proceso.prefijo;
            var config_postfijo=proceso.postfijo;
            cobis_archivos_no_procesados.forEach(function (item) {
                var archivo=item.file;
                archivo=archivo.replace(config_prefijo,"").replace(config_postfijo,"")
                archivo=archivo.replace(/_/g,"")
                item.nro=convertDateToNumber(archivo.substring(0, 6),'yymmdd')+archivo.substring(6,10);
                item.nro=parseInt(item.nro)
            });

            var flag=true;
            var menor;
            cobis_archivos_no_procesados.forEach(function (item) {
                if(flag){
                    menor=item;
                    flag=false;
                }else{
                    if(item.nro<menor.nro){
                        menor=item;
                    }
                }

            });

            if (typeof menor!='undefined'){
                _this.today_files.push(menor);
            }

            if(this.today_files.length==0){
                var archivo_dia_actual_procesado=false;
                archivos_procesados.forEach(function (item) {
                    var fecha_Archivo_procesado=item.nombreArchivo.replace(config_prefijo,"").replace(config_postfijo,"").substring(0, 6);
                    if(fecha_Archivo_procesado==fecha){
                        archivo_dia_actual_procesado=true;
                    }
                });

                if(archivo_dia_actual_procesado){
                    throw new Error("El archivo del día " + this.obtenerDia("/")  + " ya fue leído.");

                }else{
                    throw new Error( "No se encuentra el archivo del día " + this.obtenerDia("/") );
                }
            }

           return this.today_files;
        }
        this.obtenerDia=function(separador){
            separador=(typeof separador =='undefined') ? '' : separador;

            var date = new Date();
            var pad="00";
            var day=date.getDate().toString();
            var mes=(date.getMonth() +1).toString();
            var year=date.getFullYear().toString();

            day=pad.substring(0, pad.length - day.length)+day;
            mes=pad.substring(0, pad.length - mes.length)+mes;
            year=year.substring(2, 4);
            return day+separador+mes+separador+year;
        };
    }
    return { Fallecidos_Lectura_Cobis: Fallecidos_Lectura_Cobis}
})()




var ValidarExtensionArchivos= function (data,archivos_procesos) {
        var postfijos='undefined';
        this.obtenerPrefijosProceso=function (proceso){
            var postfijos= [];
            for (iq = 0; iq < proceso.length; iq++) {
                postfijo=this.splitString(proceso[iq].postfijo,".",'LAST')
                if(typeof postfijo!='undefined'){
                    postfijos.push(postfijo);
                }
            }
            return postfijos;
        }

        this.splitString=function (text,separador,ordinalNumber){
            var words=text.split(separador)
            if(ordinalNumber.toUpperCase()=='FIRST'){
                return words[0];
            }
            if(ordinalNumber.toUpperCase()=='LAST'){
                return words[words.length-1];
            }
            return;
        }
        this.validar=function(){
            try{
                postfijos=this.obtenerPrefijosProceso(archivos_procesos);
                let arr = [...data];
                const count = arr.length;
                for (let iq = 0; iq < count; iq++) {

                    if(typeof arr[iq].postfijo!='undefined'){
                        var fileX=typeof arr[iq].file=='object'? arr[iq].file.file: arr[iq].file;
                        var postFijoFile=this.splitString(fileX,".",'LAST');
                        var postFijo=this.splitString(arr[iq].postfijo,".",'LAST');

                        if(arr[iq].postfijo != '') {
                            if(postFijo.toUpperCase()!=postFijoFile.toUpperCase()){
                                arr.slice(iq, 1)
                            }
                        }

                    }else{
                        var postFijoFile=this.splitString(arr[iq],".",'LAST');
                        if(postfijos.indexOf(postFijoFile)<0){
                            arr.splice(iq, 1)
                        }
                    }
                }
                return arr;
            }catch(err){
                archivos_res.status(500).send({ STATUS: 'ERROR', message: 'Error al filtrar los archivos por extensiòn.' });
            }
        }

}
