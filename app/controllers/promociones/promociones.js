﻿﻿/**
 * Created by leandro.casarin on 07/04/2017.
 */

var sql = require('mssql');

var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();
var PromocionesData;
var http = require('http'),
    fs = require('fs');
//var excelbuilder = require('msexcel-builder');
var excelNode = require('excel4node');
var _ = require('underscore');

exports.ConsultasPromoTC= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('codigo', sql.VarChar, req.query.codigo)
            .input('fecDesde', sql.VarChar, req.query.fecDesde)
            .input('fecHasta', sql.VarChar, req.query.fecHasta)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('where', sql.VarChar, req.query.where)
            .input('sort', sql.VarChar, req.query.order)
            .execute('promoTCCuentas_traer').then(function(recordset) {
                res.jsonp(recordset);
        }).catch(function(err) {
                console.log("err",err)
                res.status(500).send(ErrorSQL.getError(err));
        });
    })
};

exports.maxFecProceso= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .execute('promoTCCuentas_max_fecProceso').then(function(recordset) {
                res.jsonp(recordset);
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.ConsultasPromoTCExportar= function (req, res) {
    var saveParams=new GuardarParametros(req, res,process,sql);
    saveParams.set({proceso:req.query.proceso,
        agrupar:2,
        paramNombre:"PARAM_CODIGO",
        paramValor:req.query.codigo})
    saveParams.set({proceso:req.query.proceso,
        agrupar:2,
        paramNombre:"PARAM_FECHA_DESDE",
        paramValor:req.query.fecDesde})
    saveParams.set({proceso:req.query.proceso,
        agrupar:2,
        paramNombre:"PARAM_FECHA_HASTA",
        paramValor:req.query.fecHasta})
    saveParams.save();
}

/*
#############################################################
#                                                           #
#               Promociones/Promociones                     #
#                                                           #
#############################################################
*/

exports.traer = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('tipo', sql.VarChar, (req.query.tipo == '') ? null : req.query.tipo)
            .input('banca', sql.VarChar, null)
            .input('fechaActual', sql.DateTime2, null)
            .execute('promociones_traer')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};
exports.controlDuplicado = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('tipo', sql.VarChar, req.query.tipo)
            .input('codigoPromo', sql.VarChar, req.query.codigoPromo)
            .input('entidad', sql.VarChar, req.query.entidad)
            .execute('promociones_controlDuplicado')
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
            .execute('promociones_insertar')
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
            .input('idPromociones', sql.Int, req.body.idPromociones)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('banca', sql.VarChar, req.body.banca)
            .input('segmento', sql.VarChar, req.body.segmento)
            .input('vigenciaHasta', sql.DateTime2, req.body.vigenciaHasta)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('promociones_modificar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};

exports.GenerarArchivoTD = function(req, res) {
    _this = this;
    //Inicializo las variables
    _this.tipo = '';
    _this.idProceso = 0;
    _this.archivo = 'C:\\archivo.txt';
    _this.usuario = req.query.usuario;
    _this.idPromociones = req.query.idPromociones;
    _this.accion = 'E';
    _this.nombreProceso = '';

    //Esta función graba la cabecera del proceso
    _this.promocionesProcesos_insertar= function(TC, TD, usuario){
        var connection = new sql.Connection(process.config.sql, function(err) {
            new sql.Request(connection)
                .input('TC', sql.Int, TC)
                .input('TD', sql.Int, TD)
                .input('origen', sql.VarChar, 'Baja de novedades por promoción') /*req.body.origen*/
                .input('usuario', sql.VarChar, usuario)
                .execute('promocionesProcesos_insertar')
                .then(function(recordset) {
                    _this.idProceso = recordset[0][0].idProceso;
                    _this.tipo = (TD == 1) ? 'TD' : 'TC';
                    _this.nombreProceso = 'Promo ' + _this.tipo + ' Inicio VI';
                    //_this.GenerarArchivo();
                    _this.ObtenerNombreArchivo();
                    /*
                    if (TD == 1)
                        _this.GenerarArchivoTD();
                    if (TC == 1)
                        _this.ObtenerNombreArchivo('Promo TC Inicio VI', 'E');
                    */
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
                .input('idPromociones', sql.VarChar, _this.idPromociones)
                .input('usuario', sql.VarChar, _this.usuario)
                .input('nombreArchivo', sql.VarChar, 'macroreg0.txt')
                .execute('promocionesProcesos_obtenerExportacion' + _this.tipo)
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
    _this.promocionesProcesos_insertar(req.query.TC, req.query.TD, req.query.usuario);
};



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

var PromocionesData = function (req, res) {
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

                var mm = new GenerarExcelPromociones(req, res);

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

var GenerarExcelPromociones = function (req, res) {
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
/*
            excel_file[sheets[0].config.name].set(1,1,'Banco MACRO');
            excel_file[sheets[0].config.name].font(1,1, header_style);
            excel_file[sheets[0].config.name].set(1,2,'Resumen Nov. Masivas por Ent./Resultado');
            excel_file[sheets[0].config.name].font(1,2, header_style);
            */
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