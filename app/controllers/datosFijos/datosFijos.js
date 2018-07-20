var sql = require('mssql');
var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();

exports.datosFijosGetAllCuentas= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('nm_EDPDatosFijosCuentas_traer').then(function(recordsets) {
            res.jsonp(recordsets[0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.tiposCtasTarjetas= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('tiposCtasTarjetas_traer').then(function(recordsets) {
            res.jsonp(recordsets[0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.datosFijosGetAllTarjetas= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('nm_EDPDatosFijosTarjetas_traer').then(function(recordsets) {
            res.jsonp(recordsets[0])
        }).catch(function(err) {
            res.jsonp(err)
        });
    });
};


exports.cantCuentasValidar= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('entidad', sql.Int, req.query.entidad)
            .input('codigoAlta', sql.Int, req.query.codigoAlta)
            .input('tipoCuenta', sql.VarChar, req.query.tipoCuenta)
            .input('novedad', sql.VarChar, req.query.novedad)
            .execute('nm_cantCuentasValidar').then(function(recordsets) {
                res.jsonp(recordsets[0])
            }).catch(function(err) {
                res.jsonp(err)
            });
    });
};

module.exports.validarDatosFijosCuentas= function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('entidad', sql.Int, req.query.entidad)
            .input('codigoAlta', sql.Int, req.query.codigoAlta)
            .input('tipoCuenta', sql.VarChar, req.query.tipoCuenta)
            .execute('nm_EDPDatosFijosValidarCuentas')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};


module.exports.validarDatosFijosTarjetas= function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('entidad', sql.Int, req.query.entidad)
            .input('codigoAlta', sql.Int, req.query.codigoAlta)
            .input('tipoCuenta', sql.VarChar, req.query.tipoTarjeta)
            .execute('nm_EDPDatosFijosValidarTarjetas')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};

module.exports.EDPCantCuentasTarjetasValidar= function (req, res) {
 var connection = new sql.Connection(process.config.sql, function (err) {
  new sql.Request(connection)
      .input('entidad', sql.Int, req.query.entidad)
      .input('codigoAlta', sql.Int, req.query.codigoAlta)
      .input('tipoCuenta', sql.VarChar, req.query.tipoCuenta || req.query.tipoTarjeta)
      .execute('nm_EDPCantCuentasTarjetas_Validar')
      .then(function (recordset) {
       res.jsonp(recordset[0]);
      })
      .catch(function (err) {
       res.status(500).send(ErrorSQL.getError(err));
      })
 })
};

// ------------------ Cuentas ------------------
module.exports.DatosFijosEDPInsert= function (req, res) {
 var connection = new sql.Connection(process.config.sql, function (err) {
  new sql.Request(connection)
      .input('entidad', sql.Int, req.body.entidad)
      .input('codigoAltaCuenta', sql.Int, req.body.codigoAlta)
      .input('tipoCuenta', sql.VarChar, req.body.tipoCuenta)
      .input('codLC', sql.VarChar, req.body.codLC)
      .input('porcFinanciacion', sql.VarChar, req.body.porcFinanciacion)
      .input('modLiq', sql.VarChar, req.body.modLiq)
      .input('formaPago', sql.VarChar, req.body.formaPago)
      .input('cartera', sql.VarChar, req.body.cartera)
      .input('fpSucursal', sql.VarChar, req.body.fpSucursal)
      .input('fpTipoCta', sql.VarChar, req.body.fpTipoCta)
      .input('fpNroCta', sql.VarChar, req.body.fpNroCta)
      .input('catCajeroAutomatico', sql.VarChar, req.body.catCajeroAutomatico)
      .input('gaf', sql.VarChar, req.body.gaf)
      .input('tipoIva', sql.VarChar, req.body.tipoIva)
      .input('cuit', sql.VarChar, req.body.cuit)
      .input('codAGrupo', sql.VarChar, req.body.codAGrupo)
      .input('usuario', sql.VarChar, req.body.usuario)
      .execute('nm_EDPDatosFijosCuentas_ingresar')
      .then(function (recordset) {
        res.jsonp(recordset[0]);
      })
      .catch(function (err) {
       res.status(500).send(ErrorSQL.getError(err));
      })
 })
};


module.exports.DatosFijosEDPUpdate= function (req, res) {
 var connection = new sql.Connection(process.config.sql, function (err) {
  new sql.Request(connection)
      .input('idEDPDatosFijosCuentas', sql.Int, req.body.idEDPDatosFijosCuentas)
      .input('entidad', sql.Int, req.body.entidad)
      .input('codigoAltaCuenta', sql.Int, req.body.codigoAlta)
      .input('tipoCuenta', sql.VarChar, req.body.tipoCuenta)
      .input('codLC', sql.VarChar, req.body.codLC)
      .input('porcFinanciacion', sql.VarChar, req.body.porcFinanciacion)
      .input('modLiq', sql.VarChar, req.body.modLiq)
      .input('formaPago', sql.VarChar, req.body.formaPago)
      .input('cartera', sql.VarChar, req.body.cartera)
      .input('fpSucursal', sql.VarChar, req.body.fpSucursal)
      .input('fpTipoCta', sql.VarChar, req.body.fpTipoCta)
      .input('fpNroCta', sql.VarChar, req.body.fpNroCta)
      .input('catCajeroAutomatico', sql.VarChar, req.body.catCajeroAutomatico)
      .input('gaf', sql.VarChar, req.body.gaf)
      .input('tipoIva', sql.VarChar, req.body.tipoIva)
      .input('cuit', sql.VarChar, req.body.cuit)
      .input('codAGrupo', sql.VarChar, req.body.codAGrupo)
      .input('usuario', sql.VarChar, req.body.usuario)
      .execute('nm_EDPDatosFijosCuentas_modificar')
      .then(function (recordset) {
       res.jsonp(recordset[0]);
      })
      .catch(function (err) {
       res.status(500).send(ErrorSQL.getError(err));
      })
 })
};


module.exports.DatosFijosEDPDelete= function (req, res) {
 console.log("req.body",req.params)
 console.log("req.query",req.query)
 var connection = new sql.Connection(process.config.sql, function (err) {
  new sql.Request(connection)
      .input('idEDPDatosFijosCuentas', sql.Int, req.params.idEDPDatosFijosCuentas)
      .execute('nm_EDPDatosFijosCuentas_bajar')
      .then(function (recordset) {
       res.jsonp(recordset[0]);
      })
      .catch(function (err) {
       res.status(500).send(ErrorSQL.getError(err));
      })
 })
};

// ------------------------------------ Fin Cuentas ------------------------------------


// ------------------------------------ Tarjetas ------------------------------------
module.exports.DatosFijosTarjetasEDPInsert= function (req, res) {
    console.log("req.body DatosFijosTarjetasEDPInsert *** ",req.body)
    console.log("req.body.entidad",typeof req.body.entidad)



    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('entidad', sql.Int, parseInt(req.body.entidad) )
            .input('codigoAltaTarjeta',sql.Int, req.body.codigoAlta)
            .input('tipoTarjeta',sql.VarChar, req.body.tipoTarjeta)
            .input('vigencia',sql.VarChar, typeof req.body.vigencia!='undefined'?req.body.vigencia: '')
            .input('porcBonificacion',sql.VarChar, typeof req.body.porcBonificacion!='undefined'?req.body.porcBonificacion: '')
            .input('tipoDocumento',sql.VarChar, typeof req.body.tipoDocumento !='undefined'?req.body.tipoDocumento: '')
            .input('nroDocumento',sql.VarChar, typeof req.body.nroDocumento !='undefined'?req.body.nroDocumento: '')
            .input('nacionalidad',sql.VarChar, typeof req.body.nacionalidad !='undefined'?req.body.nacionalidad: '')
            .input('sexo',sql.VarChar, typeof req.body.sexo !='undefined'?req.body.sexo: '')
            .input('estCivil',sql.VarChar, typeof req.body.estCivil !='undefined'?req.body.estCivil :'')
            .input('fecNacimiento',sql.VarChar, typeof req.body.fecNacimiento!='undefined'?req.body.fecNacimiento: '')
            .input('ocupacion',sql.VarChar, typeof req.body.ocupacion !='undefined'?req.body.ocupacion: '')
            .input('habilitacion',sql.VarChar, typeof req.body.habilitacion !='undefined'?req.body.habilitacion: '')
            .input('cargo',sql.VarChar, typeof req.body.cargo !='undefined'?req.body.cargo: '')
            .input('porcLimLC',sql.VarChar, typeof  req.body.porcLimLC !='undefined'?req.body.porcLimLC: '')
            .input('porcLimLCC',sql.VarChar, typeof req.body.porcLimLCC !='undefined'?req.body.porcLimLCC: '')
            .input('porcLimADE',sql.VarChar, typeof req.body.porcLimADE !='undefined'?req.body.porcLimADE: '')
            .input('distribucion',sql.VarChar, typeof req.body.distribucion!='undefined'?req.body.distribucion : '' )
            .input('usuario',sql.VarChar, req.body.usuario )
            .execute('nm_EDPDatosFijosTarjetas_ingresar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })

    })
};


module.exports.DatosFijosTarjetasEDPUpdate= function (req, res) {
    console.log("req.body.entidad",req.body)
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idEDPDatosFijosTarjetas', sql.Int, req.body.idEDPDatosFijosTarjetas)
            .input('entidad', sql.Int, req.body.entidad)
            .input('codigoAltaTarjeta',sql.Int, req.body.codigoAlta)
            .input('tipoTarjeta',sql.VarChar, req.body.tipoTarjeta)
            .input('vigencia',sql.VarChar, typeof req.body.vigencia!='undefined'?req.body.vigencia: '')
            .input('porcBonificacion',sql.VarChar, typeof req.body.porcBonificacion!='undefined'?req.body.porcBonificacion: '')
            .input('tipoDocumento',sql.VarChar, typeof req.body.tipoDocumento !='undefined'?req.body.tipoDocumento: '')
            .input('nroDocumento',sql.VarChar, typeof req.body.nroDocumento !='undefined'?req.body.nroDocumento: '')
            .input('nacionalidad',sql.VarChar, typeof req.body.nacionalidad !='undefined'?req.body.nacionalidad: '')
            .input('sexo',sql.VarChar, typeof req.body.sexo !='undefined'?req.body.sexo: '')
            .input('estCivil',sql.VarChar, typeof req.body.estCivil !='undefined'?req.body.estCivil:'')
            .input('fecNacimiento',sql.VarChar, typeof req.body.fecNacimiento!='undefined'?req.body.fecNacimiento: '')
            .input('ocupacion',sql.VarChar, typeof req.body.ocupacion !='undefined'?req.body.ocupacion: '')
            .input('habilitacion',sql.VarChar, typeof req.body.habilitacion !='undefined'?req.body.habilitacion: '')
            .input('cargo',sql.VarChar, typeof req.body.cargo !='undefined'?req.body.cargo: '')
            .input('porcLimLC',sql.VarChar, typeof  req.body.porcLimLC !='undefined'?req.body.porcLimLC: '')
            .input('porcLimLCC',sql.VarChar, typeof req.body.porcLimLCC !='undefined'?req.body.porcLimLCC: '')
            .input('porcLimADE',sql.VarChar, typeof req.body.porcLimADE !='undefined'?req.body.porcLimADE: '')
            .input('distribucion',sql.VarChar, typeof req.body.distribucion!='undefined'?req.body.distribucion : '' )
            .input('usuario',sql.VarChar, req.body.usuario )
            .execute('nm_EDPDatosFijosTarjetas_modificar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};

module.exports.DatosFijosTarjetasEDPDelete= function (req, res) {
    console.log("req.body",req.params)
    console.log("req.query",req.query)
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idEDPDatosFijosTarjetas', sql.Int, req.params.idEDPDatosFijosTarjetas)
            .execute('nm_EDPDatosFijosTarjetas_bajar')

            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};

// ------------------------------------ Fin Tarjetas ------------------------------------





//

/*
 var sql = require('mssql');

 var MSSQLError=require('../../utils/MSSQLError.js');
 var ErrorSQL=new MSSQLError.MSSQLError();
 var datosFijosData;
 var http = require('http'),
 fs = require('fs');
 //var excelbuilder = require('msexcel-builder');
 var excelNode = require('excel4node');
 var _ = require('underscore');



 exports.traer = function (req, res) {
 var connection = new sql.Connection(process.config.sql, function (err) {
 new sql.Request(connection)
 //  .input('tipo', sql.VarChar, (req.query.tipo == '') ? null : req.query.tipo)
 //  .input('banca', sql.VarChar, null)
 // .input('fechaActual', sql.DateTime2, null)
 .execute('nm_EDPDatosFijosCuentas_traer')
 .then(function (recordset) {
 res.jsonp(recordset[0]);
 })
 .catch(function (err) {
 res.status(500).send(ErrorSQL.getError(err));
 })
 })
 };
 /*
 exports.controlDuplicado = function (req, res) {
 var connection = new sql.Connection(process.config.sql, function (err) {
 new sql.Request(connection)
 .input('tipo', sql.VarChar, req.query.tipo)
 .input('codigoPromo', sql.VarChar, req.query.codigoPromo)
 .input('entidad', sql.VarChar, req.query.entidad)
 .execute('datosFijos_controlDuplicado')
 .then(function (recordset) {
 res.jsonp(recordset[0]);
 })
 .catch(function (err) {
 res.status(500).send(ErrorSQL.getError(err));
 })
 })
 };
 exports.insertar = function (req, res) {
 var connection = new sql.Connection(process.config.sql, function (err) {
 new sql.Request(connection)
 .input('tipo', sql.VarChar, req.body.tipo)
 .input('entidad', sql.VarChar, req.body.entidad)
 .input('codigoPromo', sql.VarChar, req.body.codigoPromo)
 .input('descripcion', sql.VarChar, req.body.descripcion)
 .input('banca', sql.VarChar, req.body.banca)
 .input('segmento', sql.VarChar, req.body.segmento)
 .input('vigenciaDesde', sql.DateTime2, req.body.vigenciaDesde)
 .input('vigenciaHasta', sql.DateTime2, req.body.vigenciaHasta)
 .input('usuario', sql.VarChar, req.body.usuario)
 .execute('datosFijos_insertar')
 .then(function (recordset) {
 res.jsonp(recordset[0]);
 })
 .catch(function (err) {
 res.status(500).send(ErrorSQL.getError(err));
 })
 })
 };
 exports.modificar = function (req, res) {
 var connection = new sql.Connection(process.config.sql, function (err) {
 new sql.Request(connection)
 .input('idDatosFijos', sql.Int, req.body.idDatosFijos)
 .input('descripcion', sql.VarChar, req.body.descripcion)
 .input('banca', sql.VarChar, req.body.banca)
 .input('segmento', sql.VarChar, req.body.segmento)
 .input('vigenciaHasta', sql.DateTime2, req.body.vigenciaHasta)
 .input('usuario', sql.VarChar, req.body.usuario)
 .execute('datosFijos_modificar')
 .then(function (recordset) {
 res.jsonp(recordset[0]);
 })
 .catch(function (err) {
 res.status(500).send(ErrorSQL.getError(err));
 })
 })
 };
 /*
 exports.GenerarArchivoTD = function(req, res) {
 _this = this;
 //Inicializo las variables
 _this.tipo = '';
 _this.idProceso = 0;
 _this.archivo = 'C:\\archivo.txt';
 _this.usuario = req.query.usuario;
 _this.iddatosFijos = req.query.iddatosFijos;
 _this.accion = 'E';
 _this.nombreProceso = '';

 //Esta función graba la cabecera del proceso
 _this.datosFijosProcesos_insertar= function(TC, TD, usuario){
 var connection = new sql.Connection(process.config.sql, function(err) {
 new sql.Request(connection)
 .input('TC', sql.Int, TC)
 .input('TD', sql.Int, TD)
 .input('origen', sql.VarChar, 'Baja de novedades por promoción')
 .input('usuario', sql.VarChar, usuario)
 .execute('datosFijosProcesos_insertar')
 .then(function(recordset) {
 _this.idProceso = recordset[0][0].idProceso;
 _this.tipo = (TD == 1) ? 'TD' : 'TC';
 _this.nombreProceso = 'Promo ' + _this.tipo + ' Inicio VI';
 //_this.GenerarArchivo();
 _this.ObtenerNombreArchivo();

 })
 .catch(function(err) {
 var resp = ErrorSQL.getError(err)
 if(resp.message.includes("bp4_sqlusr_admin"))
 resp.message = "El proceso se encuentra en ejecucion, aguarde un momento para volver a generar archivos. Puede descargarlo desde " + pathSalida;
 res.status(500).send(resp);
 });
 });
 };

 //Obtengo el nombre que se le parametrizó al archivo (y su ubicación)
 _this.ObtenerNombreArchivo = function (nombre, accion) {
 var connection = new sql.Connection(process.config.sql, function(err) {
 new sql.Request(connection)
 .input('nombre', sql.VarChar, _this.nombreProceso)
 .input('accion', sql.VarChar, _this.accion)
 .execute('procesoArchivos_traerNombreArchivo')
 .then(function (recordset) {
 _this.archivo = recordset[0][0].archivo;
 //_this.GenerarArchivoTC();
 if (_this.tipo == 'TD'){
 _this.archivo += 'macroreg0.txt';
 }
 _this.GenerarArchivo();
 })
 .catch(function (err) {
 res.status(500).send(ErrorSQL.getError(err));
 })
 });
 }

 //Inserto los datos y los obtengo para poder generar el archivo
 _this.GenerarArchivo = function () {
 var connection = new sql.Connection(process.config.sql, function(err) {
 new sql.Request(connection)
 .input('idProceso', sql.Int, _this.idProceso)
 .input('iddatosFijos', sql.VarChar, _this.iddatosFijos)
 .input('usuario', sql.VarChar, _this.usuario)
 .input('nombreArchivo', sql.VarChar, 'macroreg0.txt')
 .execute('datosFijosProcesos_obtenerExportacion' + _this.tipo)
 .then(function (recordset) {
 var sReturn = '';
 if (_this.tipo == 'TC'){
 for (var tabla = 0; tabla < recordset.length; tabla++){
 fs.writeFileSync(this.archivo.replace('___', (tabla == 0) ? '067' : '667'), '', {encoding:'utf8', flag: 'w+'}); //, function (err) { if (err) reject(err.message); });
 _this.EscribirArchivo(recordset[tabla], this.archivo.replace('___', (tabla == 0) ? '067' : '667'), "Data");
 }
 sReturn = 'Se han generado los archivos ' + this.archivo.replace('___', '067') + ' y ' + this.archivo.replace('___', '667');
 }
 else if (_this.tipo == 'TD'){

 //Escribo el archivo en blanco
 var line = '0NELSEG  067900' + _this.DateConvert(new Date(), 'yyyymmddhhMM') + ' '.repeat(72) + '*';
 fs.writeFileSync(this.archivo, line  + "\r\n", 'utf8'); //, function (err) { if (err) reject(err.message); });
 //Agrego todas las lineas
 _this.EscribirArchivo(recordset[0], this.archivo, "Data");
 line = line.replace('0NELSEG', '9NELSEG').replace ('067', '   ');
 fs.appendFileSync(this.archivo, line  + "\r\n", 'utf8'); //, function (err) { if (err) reject(err.message); });
 sReturn = 'Se han generado el archivo ' + this.archivo;
 }
 //res.jsonp({"message":"Se está  exportando el archivo, puede descargarlo desde "+ pathSalida});
 res.jsonp({"message": sReturn});
 })
 .catch(function (err) {
 res.status(500).send(ErrorSQL.getError(err));
 })
 });
 }

 _this.DateConvert = function(date, pattern){
 formattedDate = pattern.replace('yyyy', date.getFullYear().toString());
 var mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
 mm = mm.length > 1 ? mm : '0' + mm;
 formattedDate = formattedDate.replace('mm', mm);
 var dd = date.getDate().toString();
 dd = dd.length > 1 ? dd : '0' + dd;
 formattedDate = formattedDate.replace('dd', dd);
 var hh = date.getHours().toString();
 hh = hh.length > 1 ? hh : '0' + hh;
 formattedDate = formattedDate.replace('hh', hh);
 var MM = date.getMinutes().toString();
 MM = MM.length > 1 ? MM : '0' + MM;
 formattedDate = formattedDate.replace('MM', MM);
 var ss = date.getSeconds().toString();
 ss = hh.length > 1 ? ss : '0' + ss;
 formattedDate = formattedDate.replace('ss', ss);
 return formattedDate;
 }

 //genero la grabación del archivo para el array enviado
 _this.EscribirArchivo = function (DataTable, ArchivoDestino, Campo) {
 //fs.appendFileSync(ArchivoDestino, DataTable[row][Campo] + "\r\n", 'utf8', function (err) {
 for (var row = 0; row < DataTable.length; row++)
 fs.appendFileSync(ArchivoDestino, DataTable[row][Campo] + "\r\n", 'utf8'); //, function (err) { if (err) reject(err.message); });
 }

 _this.TD = req.query.TD;
 _this.datosFijosProcesos_insertar(req.query.TC, req.query.TD, req.query.usuario);
 };

 */
/*
 var GuardarParametros=function(req,res,process,sql){
 var _this=this;
 this.params=[];
 this.set=function(value){
 this.params.push(value)
 }

 this.EjecutarReporte= function(pathSalida){
 var connection = new sql.Connection(process.config.sql, function(err) {
 new sql.Request(connection)
 .execute('promoTCCuentas_EjecutarReporte').then(function(recordset) {
 res.jsonp({"message":"Se está  exportando el archivo, puede descargarlo desde "+ pathSalida});
 }).catch(function(err) {
 var resp = ErrorSQL.getError(err)
 if(resp.message.includes("bp4_sqlusr_admin"))
 resp.message = "El proceso se encuentra en ejecucion, aguarde un momento para volver a generar archivos. Puede descargarlo desde " + pathSalida;
 res.status(500).send(resp);
 });
 });
 };


 this.getDatosProceso=function(proceso,codigo){
 var connection = new sql.Connection(process.config.sql, function (err) {
 new sql.Request(connection)
 .input('proceso', sql.VarChar, req.query.proceso)
 .execute('dbo.procesoPasos_traerPorNombreProceso').then(function (rs) {
 if(rs[0].length==0){
 throw new Error("No se encontro el registro buscado.");
 }else{
 if(rs[0][0].length==0){
 throw new Error("No se encontraron datos para las solapas.");
 }
 console.log("rs[0][0]",rs[0])
 _this.EjecutarReporte(rs[0][0].pathSalida)
 }
 _this.pathExcel = rs[0];
 }).catch(function (err) {
 res.status(500).send(ErrorSQL.getError(err));
 });
 });
 }


 this.save=function (index){
 if(typeof index=='undefined'){
 index=0;
 }
 var connection = new sql.Connection(process.config.sql, function (err) {
 new sql.Request(connection)
 .input('proceso', sql.VarChar, _this.params[index].proceso)
 .input('agrupar', sql.Int, _this.params[index].agrupar)
 .input('paramNombre', sql.VarChar, _this.params[index].paramNombre)
 .input('paramValor', sql.VarChar,_this.params[index].paramValor)
 .execute('dbo.procesoParam_insertar')
 .then(function (result) {
 if(index>=(_this.params.length-1)){

 _this.getDatosProceso();
 }else{
 _this.save(index+1);
 }
 })
 .catch(function (err) {
 res.status(500).send(ErrorSQL.getError(err));
 });
 });
 }
 }

 var datosFijosData = function (req, res) {
 var _this=this;
 var codigo="";
 this.informacionUltimoProceso=function(filter){
 codigo=filter.codigo;
 console.log("filter -> ",filter)
 var connection = new sql.Connection(process.config.sql, function (err) {
 new sql.Request(connection)
 .input('codigo', sql.VarChar, filter.codigo)
 .input('fecDesde', sql.VarChar, filter.fecDesde)
 .input('fecHasta', sql.VarChar, filter.fecHasta )
 .execute('dbo.promoTCCuentas_exportar').then(function (rs) {
 try{
 console.log("rs[1]",rs[1])
 _this.cuentas=rs[0];
 _this.DetalleNovedades=rs[1];
 _this.getDatosProceso(filter.proceso,filter.codigo);
 }catch(err){
 console.log(err);
 }

 })
 .catch(function(err) {
 res.status(500).send(ErrorSQL.getError(err));
 });
 });
 }
 this.getDatosProceso=function(proceso,codigo){
 var connection = new sql.Connection(process.config.sql, function (err) {
 new sql.Request(connection)
 .input('proceso', sql.VarChar, proceso)
 .execute('dbo.procesoPasos_traerPorNombreProceso').then(function (rs) {
 if(rs[0].length==0){
 throw new Error("No se encontro el registro buscado.");
 }else{
 if(rs[0][0].length==0 && rsPath[0][1].length==0 && rsPath[0][2].length==0){
 throw new Error("No se encontraron datos para las solapas.");
 }
 }
 _this.pathExcel = rs[0];
 _this.crearExcel(codigo);
 }).catch(function (err) {
 res.status(500).send(ErrorSQL.getError(err));
 });
 });
 }
 this.crearExcel=function(codigo){
 var path= _this.pathExcel[0].pathSalida;
 fs.stat(path, function (err, stats){
 if (err) {
 res.status(500).send(ErrorSQL.getError(new Error("No existe el directorio: "+ path)));
 }

 var mm = new GenerarExceldatosFijos(req, res);

 var file="";
 var cfileName="";
 if(codigo=="Grilla1"){
 cfileName="Resultados_Promo620_";
 }
 if(codigo=="Grilla2"){
 cfileName="Resultados_Promo620_Historico_";
 }
 file=mm.getFileName(cfileName);

 var columnAlign={"Entidad":"right","Prom_FecVigHasta":"right","Cod_Error":"right", "Cant":"right",
 "Cuenta":"right"}
 var fullPathFile=path.trim()+file.trim();
 try{
 var workbook =  new excelNode.Workbook();//excelbuilder.createWorkbook(path, file)
 mm.workbook=workbook;
 mm.setSheet(_this.cuentas,'Resumen')
 mm.setSheet(_this.DetalleNovedades,'Detalle Novedades')


 mm.createSheet(columnAlign)

 if(_this.cuentas.length>0){
 mm.crearEncabezado('Resumen','Banco MACRO','Resumen Nov. Masivas por Ent./Resultado')
 }
 if(_this.DetalleNovedades.length>0) {
 mm.crearEncabezado('Detalle Novedades', 'Banco MACRO', 'Detalle de Novedades Masivas')
 }

 mm.workbook.write(fullPathFile, function(err, status){
 if(err){
 res.status(500).send(err);
 }else{
 try{
 res.setHeader('Content-disposition', 'attachment; filename=' + file);
 res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
 var filestream = fs.createReadStream(fullPathFile);
 filestream.pipe(res);
 }catch(err) {
 res.status(500).send(ErrorSQL.getError(new Error("Error al guardar el archivo.")));
 }
 }
 });
 }catch(err) {
 res.status(500).send(ErrorSQL.getError(err));
 }
 });
 }
 }

 /*
 var GenerarExceldatosFijos = function (req, res) {
 this.workbook=undefined;
 var sheets=[];
 var excel_file={};
 var FILA_INICIO=4;
 var header_style = null;
 var cell_header_style = null;
 var cell_style = null;
 this.setSheet=function(data,name){
 try{
 if(!header_style){
 header_style = this.workbook.createStyle({
 font:{
 sixe: 12,
 bold: true,
 family: 'Tahoma'
 }
 });
 cell_header_style = this.workbook.createStyle({
 font:{
 sixe: 9,
 bold: true,
 family: 'Tahoma'
 }
 });
 cell_style = this.workbook.createStyle({
 font:{
 sixe: 9,
 bold: false,
 family: 'Tahoma'
 }
 });
 }

 var data_values=[];
 if(data.length>0){
 console.log("SAVE 1-1");
 data.forEach(function(data,index) {
 data_values.push(_.values(data))
 });
 sheets.push({config: { name:name },
 columns_name:_.keys(data[0]),
 columns_data:data_values
 });

 }
 }catch(err) {
 res.status(500).send(ErrorSQL.getError(err));
 }
 };
 this.createSheet=function(columnAlign){
 try{
 console.log("createSheet ->",sheets.length);

 for (var i= 0; i< sheets.length;i++ ) { // iterate sheets columns
 var item=sheets[i];
 //   console.log("item.columns_name",item.columns_name)
 excel_file[item.config.name]= this.workbook.addWorksheet(item.config.name);

 // console.log("item.columns_name",item.columns_name)
 for (var col= 0; col< item.columns_name.length;col++ ) { // iterate sheets columns
 excel_file[item.config.name].cell(FILA_INICIO, col+1).string(item.columns_name[col].toString()).style(cell_header_style);
 //  console.log("item.columns_name[col]",item.config.name)
 var width=1;
 if(item.columns_name[col].length<10){
 width=1.7;
 }
 if(item.columns_name[col].length>10){
 width=1.4;
 }
 if(item.columns_name[col].length>20){
 width=1.15;
 }

 excel_file[item.config.name].column(col+1).setWidth(item.columns_name[col].length * width);
 }

 // llenar datos
 for (var colums= 0; colums< item.columns_data.length;colums++ ) {
 for (var fila= 0; fila< item.columns_data[colums].length;fila++ ) {
 excel_file[item.config.name].cell(colums+1+FILA_INICIO, fila+1)
 .string(item.columns_data[colums][fila].toString())
 .style(cell_style);
 if(typeof columnAlign[item.columns_name[fila]]!='undefined'){
 excel_file[item.config.name].cell(colums+1+FILA_INICIO, fila+1).style({alignment:{horizontal: columnAlign[item.columns_name[fila]]}});
 }
 }
 }
 }
 }catch(err) {
 res.status(500).send(ErrorSQL.getError(err));
 }
 };
 this.crearEncabezado=function(name,p1,p2){

 excel_file[name].cell(1,1).string(p1).style(header_style);
 excel_file[name].cell(2,1).string(p2).style(header_style);
 }




 this.getFileName=function(nombre){
 try{
 var date = new Date();
 var separador="";
 var padMonth="00";
 var mes=(date.getMonth() +1).toString();
 var minutos=date.getMinutes();
 mes=padMonth.substring(0, padMonth.length - mes.length)+mes;
 return nombre+mes+ separador + date.getFullYear()+".xlsx";
 }catch(err) {
 res.status(500).send(ErrorSQL.getError(err));
 }
 }
 }

 */