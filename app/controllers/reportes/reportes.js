var moment = require('moment');
var sql = require('mssql');
var _ = require('underscore');
var json2csv = require('json2csv');
var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();
//var excelbuilder = require('msexcel-builder');
var excelNode = require('excel4node');

const fs = require('fs');
const path = require('path');
const templatePath = path.normalize(__dirname + '/../word')
const StringDecoder = require('string_decoder').StringDecoder;

exports.executesql= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('where', sql.VarChar, req.query.filter)
            .input('sort', sql.VarChar, req.query.order)
            .execute('repo_reporteTC').then(function(rs) {
                res.jsonp(rs);
            }).catch(function(err) {
                //res.status(500).send(ErrorSQL.getError(err));
                res.status(500).jsonp(err);
            });
    });
};

exports.archivosEncabezadoPadronUnificado = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .execute('repo_padronUnificadoArchivos')
            .then(function (rs) {
                res.jsonp(rs[0]);
            })
            .catch(function (err) {
                res.status(500).jsonp(err);
            });
    });
};

exports.archivo = function(req, res){

    var connection = new sql.Connection(process.config.sql, bien, mal);

    function bien() {

        console.log(req.filter, req.order);

        new sql.Request(connection)
            .input('where', sql.VarChar, req.filter)
            .input('sort', sql.VarChar, req.order)
            .execute('repo_padronCSV').then(function(rs) {

                console.log(rs[0].length)

                json2csv( { data: rs[0] }, function(err, data) {
                    if (err) {
                        console.log(err);
                        res.status(500).json(err);
                        return;
                    }
                    res.writeHead(200, {
                        'Content-Type': 'application/csv',
                        'Content-Disposition': 'attachment; filename=queryPadron.csv'
                    });
                    res.end(data);
                });
            }).catch(function(err) {
                res.status(500).jsonp(err);
            });

    }
    function mal(err) {
        console.log('entro a mal 1 ' , err)
        res.status(500).jsonp(err);
    }
};

exports.executeMasterSeguros = function (req, res) {

    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('where', sql.VarChar, req.query.where)
            .input('entidad', sql.VarChar, JSON.parse(req.query.filter).entidad)
            .input('fecha', sql.VarChar, JSON.parse(req.query.filter).fecha)
            .input('instancia', sql.VarChar, JSON.parse(req.query.filter).instancia)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('sort', sql.VarChar, req.query.order)
            .execute('repo_reporteMCSeguros').then(function (rs) {
                res.jsonp(rs);
            })
            .catch(function (err) {
                res.status(500).jsonp(err);
            });
    });
};

exports.masterSegurosArchivo = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('where', sql.VarChar, req.query.where)
            .input('entidad', sql.VarChar, JSON.parse(req.query.filter).entidad)
            .input('fecha', sql.VarChar, JSON.parse(req.query.filter).fecha)
            .input('instancia', sql.VarChar, JSON.parse(req.query.filter).instancia)
            .input('sort', sql.VarChar, req.query.order)
            .execute('repo_reporteMCSegurosArchivo').then(function (rs) {
                json2csv( { data: rs[0] }, function(err, data) {
                    if (err) {
                        console.log(err);
                        res.status(500).json(err);
                        return;
                    }
                    res.writeHead(200, {
                        'Content-Type': 'application/csv',
                        'Content-Disposition': 'attachment; filename=segurosDeVida.csv'
                    });
                    res.end(data);
                });
            })
            .catch(function (err) {
                res.status(500).jsonp(err);
            });
    });
};

exports.executeBeneficiariosSinRelacion = function (req, res) {
    /*
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('periodo', sql.VarChar, req.query.periodo)
            .input('convenio', sql.VarChar, req.query.convenio)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('sort', sql.VarChar, req.query.order).execute('sinRelacionConCuenta_traerPorPeriodo').then(function (rs) {
                var response = { data: rs[0] };
                if (rs.length > 1) {
                    response.rows = rs[1][0].rows;
                }
                if (rs.length > 2) {
                    response.convenios = rs[2];
                }
                res.jsonp(response);
            })
            .catch(function (err) {
                res.status(500).jsonp(err);
            });
    });
    */
 
     var params=[ 
                req.query.periodo,
                typeof req.query.convenio=='undefined'? '':  req.query.convenio,
                 req.query.limit,
                req.query.page,
                req.query.order
            ];
            console.log("-----------------------------------------")
    console.log("param",params)
    console.log("-----------------------------------------")
       process.database.query('call sinRelacionConCuenta_traerPorPeriodo(?,?,?,?,?)', params,function (error,data, fields) {
                  if (error) {
                        res.status(500).send(ErrorSQL.getError(error));
                    }
                    console.log("data[0]",data[0][0].rows)
                    res.jsonp({"rows": data[0][0].rows,
                                "data":data[1],
                                "convenios":data[2]
                                });

                });
      


};

exports.sinRelacionArchivo = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('periodo', sql.VarChar, req.query.periodo)
            .input('convenio', sql.VarChar, req.query.convenio)
            .input('sort', sql.VarChar, req.query.order)
            .execute('sinRelacionConCuenta_traerCSV').then(function (rs) {
                json2csv( { data: rs[0] }, function(err, data) {
                    if (err) {
                        console.log(err);
                        res.status(500).json(err);
                        return;
                    }
                    res.jsonp({ data: data });
                });
            })
            .catch(function(err) {
                res.status(500).jsonp(err);
            });
    });
};

/*
 Reporte Tarjetas Boletin
 */

exports.executeReporteTarjetasBoletin= function (req, res) {
    console.log("res executeReporteTarjetasBoletin",req.query);
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('sort', sql.VarChar, req.query.order)
            .input('export', sql.Int, req.query.export)
            .execute('obtener_ReporteTarjetasBoletin').then(function (rs) {
                console.log("rs",rs[1][0])
                res.jsonp([{data:rs[0],rows:rs[1][0].rows}]);
            })
            .catch(function (err) {
                console.log("err",err)
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.exportReporteTarjetasBoletin = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('sort', sql.VarChar, req.query.order)
            .input('export', sql.Int, req.query.export)
            .execute('obtener_ReporteTarjetasBoletin').then(function (rs) {
                json2csv( { data: rs[0] }, function(err, data) {
                    if (err) {
                        console.log(err);
                        res.status(500).json(err);
                        return;
                    }
                    res.writeHead(200, {
                        'Content-Type': 'application/csv',
                        'Content-Disposition': 'attachment; filename=ReporteTarjetasBoletin.csv'
                    });
                    res.end(data);
                });
            })
            .catch(function(err) {
                res.status(500).jsonp(err);
            });
    });
};

/*
 Reporte Tarjetas Boletin Detalle
 */

exports.reporteTarjetasBoletinDetalle= function (req, res) {
    console.log("res executeReporteTarjetasBoletin",req.query);
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('sort', sql.VarChar, req.query.order)
            .input('nroTarjeta', sql.VarChar, req.query.filter)
            .input('export', sql.Int, req.query.export)
            .execute('obtener_ReporteTarjetasBoletin_Detalle').then(function (rs) {
                console.log("** rs *",rs);
                res.jsonp([{data:rs[0],rows:rs[1][0].rows}]);
            })
            .catch(function (err) {
                console.log("err",err)
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.reporteTarjetasBoletinDetalleExport = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('sort', sql.VarChar, req.query.order)
            .input('nroTarjeta', sql.VarChar, req.query.filter)
            .input('export', sql.Int, req.query.export)
            .execute('obtener_ReporteTarjetasBoletin_Detalle').then(function (rs) {
                json2csv( { data: rs[0] }, function(err, data) {
                    if (err) {
                        console.log(err);
                        res.status(500).json(err);
                        return;
                    }
                    res.writeHead(200, {
                        'Content-Type': 'application/csv',
                        'Content-Disposition': 'attachment; filename=ReporteTarjetasBoletin_Detalle.csv'
                    });
                    res.end(data);
                });
            })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};
// 2017-03-27 ------------------------------------------------
/*
 Reporte Tarjetas Boletin Detalle
 */

exports.reporteClientesRechazadosDetalle= function (req, res) {
    console.log("req.query -> ",req.query);
    console.log("req.query -> ",req.query.filter);

    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('sort', sql.VarChar, req.query.order)
            .input('periodo', sql.VarChar, req.query.periodo)
            .input('export', sql.Int, req.query.export)
            .execute('obtener_ClientesRechazados_Detalle').then(function (rs) {
                res.jsonp([{data:rs[0],rows:rs[1][0].rows}]);
            })
            .catch(function (err) {
                console.log("err",err)
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.reporteClientesRechazadosExport = function (req, res) {
    console.log("reporteClientesRechazadosExport req.query.",req.query)
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('sort', sql.VarChar, req.query.order)
            .input('periodo', sql.VarChar, req.query.periodo)
            .input('export', sql.Int, 1)
            .execute('obtener_ClientesRechazados_Detalle').then(function (rs) {
                json2csv( { data: rs[0] }, function(err, data) {
                    if (err) {
                        console.log(err);
                        res.status(500).json(err);
                        return;
                    }
                    res.writeHead(200, {
                        'Content-Type': 'application/csv',
                        'Content-Disposition': 'attachment; filename=clientesRechazadosDetalle.csv'
                    });
                    res.end(data);
                });
            })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};


exports.reporteRecargablesSaltaExport= function (req, res) {


    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('reporte', sql.VarChar, req.query.report)
            .execute('reporte_recargables').then(function (data) {
            var nombreColumnas=[
                {"Entidad":"ENTIDAD","Fecha":"FECHA","Archivo":"ARCHIVO","Registros Cant. Total":"REGISTROS CANT. TOTAL","Registros Cant. Aceptados":"REGISTROS CANT. ACEPTADOS","Registros Cant. Rechazados/Inhabilitados":"REGISTROS CANT. RECHAZADOS/INHABILITADOS"},
                {"Entidad":"ENTIDAD","Fecha":"FECHA","Grupo de Afinidad":"GRUPO DE AFINIDAD","Detalle":"DETALLE","Moneda":"MONEDA","Importe":"IMPORTE","Cantidad":"CANTIDAD"}
            ]
            var workbook = new excelNode.Workbook();
            var ws = workbook.addWorksheet('Hoja 1');
            ws.column(3).setWidth(25)
            ws.column(4).setWidth(22);
            ws.column(5).setWidth(26);
            ws.column(6).setWidth(42);
            var styleRight = workbook.createStyle({
                alignment:{horizontal: 'right'
                }
            });
            var styleNumber = workbook.createStyle({
                numberFormat: '#,##0.00; (#,##0.00);0'
            });
            var styleInt = workbook.createStyle({
                numberFormat: '#,##0; (#,##0);0'
            });
            var styleHead = workbook.createStyle({
                font: {
                    bold: true
                }
            });
            var iz=0;
            var filas =[]
            let contenido=data[0]

            for (let i in contenido){
                filas.push(contenido[i])
            }
            let contenidoDetalles=data[1]
            for (let i in contenidoDetalles){
                filas.push(contenidoDetalles[i])
            }
            //Cabeceras
            let salto=1
            for(let i=0;i<_.size(nombreColumnas);i++){
                let columns=nombreColumnas[i]
                let indiceExcel=1;
                for(let c in columns){
                        ws.cell(i+salto,indiceExcel).string(columns[c]).style(styleHead);
                        indiceExcel++
                }
                salto=3;
            }
               //Detalles tarjetas
                salto=2
                for(let i=0;i<_.size(contenido);i++){
                   let columns=filas[i]
                   let indiceExcel=1;
                   for(let c in columns){
                       if(typeof columns[c]==="string") {
                           ws.cell(i+salto, indiceExcel).string(columns[c])
                       }else if ( indiceExcel>=3){
                           ws.cell(i+salto,indiceExcel).number(columns[c]).style(styleInt);
                       }else{
                           ws.cell(i+salto, indiceExcel).number(columns[c]);
                       }
                       indiceExcel++
                   }
               }
                salto=4
              //Detalles tarjetas
               for(let i=1;i<=_.size(contenidoDetalles);i++){
                   let columns=filas[i]
                   let indiceExcel=1;
                   for(let c in columns){
                       if(typeof columns[c]==="string"&& indiceExcel!=6 ){
                           ws.cell(i+salto,indiceExcel).string(columns[c])
                       }else if ( indiceExcel==6){
                           ws.cell(i+salto,indiceExcel).number(columns[c]).style(styleNumber);
                       }else{
                           ws.cell(i+salto,indiceExcel).number(parseInt(columns[c])).style(styleInt);
                       }
                       indiceExcel++
                   }
               }

            workbook.write('ReporteRecargable.xlsx',res);
        })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    })





}




// ----------------------------------------------

exports.reporteRecargables = function (req, res) {
     var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('reporte', sql.VarChar, req.query.report)
            .execute('reporte_recargables').then(function (data) {
                res.jsonp(data);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    })
};

exports.reporteCampaniasPorCierre = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('fechaDesde', sql.DateTime2, req.query.fechaDesde)
            .input('fechaHasta', sql.DateTime2, req.query.fechaHasta)
            .execute('dbo.repo_campaniasTotal')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};

exports.reporteCampaniasPorCierreDetalle = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idCampania', sql.Int, req.query.idCampania)
            .input('entidad', sql.Int, req.query.entidad)
            .input('fechaDesde', sql.DateTime2, req.query.fechaDesde)
            .input('fechaHasta', sql.DateTime2, req.query.fechaHasta)
            .input('usuario', sql.VarChar, req.query.usuario)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('sort', sql.VarChar, req.query.order)
            .execute('dbo.repo_campaniasDetalle')
            .then(function (recordset) {
                res.jsonp(recordset);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.reporteCampaniasPorCierreDetalleArchivoMail = function (req, res) {
    return new Promise(function (resolve, reject) {
        campaniasPorCierreDetalleArchivoPromise(req)
            .then(function (data) {
                var connection = new sql.Connection(process.config.sql, function (err) {
                    new sql.Request(connection)
                        .input('proceso', sql.VarChar, 'Padrón campañas')
                        .execute('dbo.procesoPasos_traerPorNombreProceso').then(function (rsPath) {

                        var path=rsPath[0][0].pathSalida;

                        fs.stat(path, function (err, stats){
                            if (err) {
                                reject(ErrorSQL.getError(new Error("No existe el directorio: "+ path)));
                            }
                            var mm = new GenerarExcel.Excel(req, res);
                            var file=mm.getFileName((req.query.descripcion) + '_cierre_');
                            var fullPathFile=path+file;
                            var workbook = new excelNode.Workbook();//excelbuilder.createWorkbook(path, file)
                            mm.workbook=workbook;
                            mm.createExcelData2(data, 'hoja1', 'Altas por Promotores - Campaña: ' + ' ' + (req.query.descripcion))
                            mm.createSheetWithType()
                            mm.workbook.writeToBuffer().then(function(buffer){
                                if (!buffer) {
                                    reject("error al crear excel");
                                }else{
                                    resolve(buffer);
                                }
                            });
                        });
                    })
                    .catch(function (err) {
                        reject(err.message);
                    });
                })
            })
            .catch(function (err) {
                reject(err.message);
            });
    });
};

exports.reporteCampaniasPorCierreDetalleArchivo = function (req, res) {
    campaniasPorCierreDetalleArchivoPromise(req)
        .then(function (data) {
            var connection = new sql.Connection(process.config.sql, function (err) {
                new sql.Request(connection)
                    .input('proceso', sql.VarChar, 'Padrón campañas')
                    .execute('dbo.procesoPasos_traerPorNombreProceso').then(function (rsPath) {

                        var path=rsPath[0][0].pathSalida;

                        fs.stat(path, function (err, stats){
                            if (err) {
                                res.status(500).send(ErrorSQL.getError(new Error("No existe el directorio: "+ path)));
                            }
                            var mm = new GenerarExcel.Excel(req, res);
                            var file=mm.getFileName((req.query.descripcion) + '_cierre_');
                            var fullPathFile=path+file;
                            var workbook = new excelNode.Workbook();//excelbuilder.createWorkbook(path, file)
                            mm.workbook=workbook;
                            mm.createExcelData2(data, 'hoja1', 'Altas por Promotores - Campaña: ' + ' ' + (req.query.descripcion))
                            mm.createSheetWithType()
                            mm.workbook.write(fullPathFile, function(err, status){
                                if (err) {
                                    res.jsonp({error:"error al crear excel"});
                                }else{
                                    res.setHeader('Content-disposition', 'attachment; filename=' + file);
                                    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                                    var filestream = fs.createReadStream(fullPathFile);
                                    filestream.pipe(res);
                                }
                            });
                        });
                })
                .catch(function (err) {
                    res.status(500).send({ message: err.message });
                });
            })
        })
        .catch(function (err) {
            res.status(500).send({ message: err.message });
        });
};

function campaniasPorCierreDetalleArchivoPromise (req) {
    return new Promise(function (resolve, reject) {
        var connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('idCampania', sql.Int, req.query.idCampania)
                .input('entidad', sql.Int, req.query.entidad)
                .input('fechaDesde', sql.DateTime2, req.query.fechaDesde)
                .input('fechaHasta', sql.DateTime2, req.query.fechaHasta)
                .input('sort', sql.VarChar, req.query.order)
                .execute('dbo.repo_campaniasDetalleCSV')
                .then(function (recordset) {
                     resolve(recordset[0])
                })
                .catch(function (err) {
                    reject(ErrorSQL.getError(err).message);
                });
        });
    });
}

exports.reporteDGIDiferencias = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('codRegimen', sql.VarChar, req.query.codRegimen)
            .input('cuenta', sql.VarChar, req.query.cuenta)
            .input('conDiferencias', sql.Bit, req.query.conDiferencias === 'true')
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('sort', sql.VarChar, req.query.order)
            .execute('dbo.repo_dgiSicoreDiferencias')
            .then(function (recordset) {
                res.jsonp(recordset);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });

    });
};

exports.reporteDGIDiferenciasArchivo = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('codRegimen', sql.VarChar, (req.query.codRegimen == "null") ? null : req.query.codRegimen)
            .input('cuenta', sql.VarChar, (req.query.nroCuenta == "null") ? null : req.query.nroCuenta)
            .input('conDiferencias', sql.Bit, req.query.Diff === 'true')
            .input('sort', sql.VarChar, (req.query.orden == "null") ? null : req.query.orden)
            .execute('dbo.repo_dgiSicoreDiferenciasArchivo')
            .then(function (rs) {
                new sql.Request(connection)
                    .input('proceso', sql.VarChar, 'IVA DGI SICORE')
                    .execute('dbo.procesoPasos_traerPorNombreProceso').then(function (rsPath) {

                    var path = (!rsPath[0][0].pathSalida) ? rsPath[0][0].pathEntrada : rsPath[0][0].pathSalida;


                    fs.stat(path, function (err, stats){
                        if (err) {
                            reject(ErrorSQL.getError(new Error("No existe el directorio: "+ path)));
                        }
                        var mm = new GenerarExcel.Excel(req, res);
                        var file = 'DGISICORE.xlsx';
                        var fullPathFile= path+file;
                        var workbook = new excelNode.Workbook();//excelbuilder.createWorkbook(path, file)
                        mm.workbook=workbook;
                        mm.createExcelDataFromDS(rs, 'Datos', 'IVA DGI SICORE')
                        mm.createSheetWithType()
                        mm.workbook.write(fullPathFile, function(err, status){
                            if (err) {
                                res.status(500).send("error al crear excel");
                            }else{
                                res.setHeader('Content-disposition', 'attachment; filename=' + file);
                                res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                                var filestream = fs.createReadStream(fullPathFile);
                                filestream.pipe(res);
                            }
                        });
                    });
                })
                .catch(function (err) {
                    res.status(500).send(err);
                });

            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });

    });
};

// 2017-04-05 ------------------------------------------------
/*
 Reporte Baja Clientes
 */


exports.reporteBajaClientes= function (req, res) {


    if (req.query.export==0){
        console.log("req.query (0) -> ",req.query);
        var connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('pgSize', sql.Int, req.query.limit)
                .input('pg', sql.Int, req.query.page)
                .input('sort', sql.VarChar, req.query.order)
                .input('periodo', sql.VarChar, req.query.periodo)
                .input('convenio', sql.VarChar, req.query.convenio)
                .input('export', sql.Int, req.query.export)
                .execute('bajaClientes_traerBajas').then(function (rs) {
                    res.jsonp({data:rs[0],rows:rs[1][0].rows});
                })
                .catch(function (err) {
                    console.log("err",err)
                    res.status(500).send(ErrorSQL.getError(err));
                });
        });
    }

    if (req.query.export==1){
        console.log("req.query (1) -> ",req.query);
        var connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('pgSize', sql.Int, req.query.limit)
                .input('pg', sql.Int, req.query.page)
                .input('sort', sql.VarChar, req.query.order)
                .input('periodo', sql.VarChar, req.query.periodo)
                .input('convenio', sql.VarChar, req.query.convenio)
                .input('personas_enviar', sql.VarChar, req.query.personas_enviar)
                .execute('BajaApoderados_PrepararArchivos').then(function (rs) {
                    res.jsonp({data:rs[0]});
                })
                .catch(function (err) {
                    console.log("err",err)
                    res.status(500).send(ErrorSQL.getError(err));
                });
        });
    }
};


exports.reporteBajaClientesExport = function (req, res) {
    console.log("BajaClientesExport req.query.",req.query)
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('sort', sql.VarChar, req.query.order)
            .input('periodo', sql.VarChar, req.query.periodo)
            .input('export', sql.Int, 1)
            .execute('obtener_ClientesRechazados_Detalle').then(function (rs) {
                json2csv( { data: rs[0] }, function(err, data) {
                    if (err) {
                        console.log(err);
                        res.status(500).json(err);
                        return;
                    }
                    res.writeHead(200, {
                        'Content-Type': 'application/csv',
                        'Content-Disposition': 'attachment; filename=clientesRechazadosDetalle.csv'
                    });
                    res.end(data);
                });
            })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.reporteProcesoConvenio = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .execute('dbo.repo_procesoConvenio').then(function (rs) {
                res.jsonp(rs);
            })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.reporteRechazosLiquidacion = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .execute('dbo.ra_rechazosLiquidacion_traer')
            .then(function (rs) {
                res.jsonp(rs);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    });
};

exports.reporteRechazosProcesadosLiquidaciones = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .execute('dbo.ra_rechazosProcesadosLiq_traer')
            .then(function (rs) {
                res.jsonp(rs);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    });
};

exports.reporteRechazosConvenio = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .execute('dbo.ra_rechazosConvenio_traer')
            .then(function (rs) {
                res.jsonp(rs);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    });
};

exports.reporteRechazosDetalle = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('cuenta', sql.VarChar, req.query.cuenta)
            .input('fecProceso', sql.DateTime2, req.query.fecProceso)
            .input('pg', sql.Int, req.query.page)
            .input('pgSize', sql.Int, req.query.limit)
            .input('sort', sql.VarChar, req.query.order)
            .execute('dbo.repo_rechazosAcreditacion')
            .then(function (rs) {
                res.jsonp(rs);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    });
};

exports.reporteRechazosDetalleArchivo = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('cuenta', sql.VarChar, req.query.cuenta)
            .input('fecProceso', sql.DateTime2, req.query.fecProceso)
            .input('sort', sql.VarChar, req.query.order)
            .execute('dbo.repo_rechazosAcreditacionCSV')
            .then(function (rs) {
                json2csv( { data: rs[0] }, function(err, data) {
                    if (err) {
                        console.log(err);
                        res.status(500).json(err);
                        return;
                    }
                    res.writeHead(200, {
                        'Content-Type': 'application/csv',
                        'Content-Disposition': 'attachment; filename=clientesRechazadosDetalle.csv'
                    });
                    res.end(data);
                });
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    });
};

exports.reporteRechazosTotalesArchivo = function (req, res) {
    let parameters = req.query;
    let tempPath = path.join(templatePath, '/RechazadosTotales.html');
    leerTemplate(tempPath)
        .then(templateHtml => { return generarArchivo(templateHtml, parameters); })
        .then(templateHtml => { res.end(templateHtml); })
        .catch(err => {
            res.status(500).send(err);
        })
};


/**
 * Lee el archivo template y retorna el html
 * @param {string} templateFile
 * @constructor
 */
const leerTemplate = function(templateFile){
    return new Promise(function (resolve, reject) {
        fs.readFile(templateFile, function (err, html) {
            if (err) reject(err);

            let decoder = new StringDecoder('utf8');
            try {
                let templateHtml = decoder.write(html);
                resolve(templateHtml)
            }
            catch(e){
                return reject(e);
            }
        });
    });
};

/**
 *
 * @param {string} templateHtml
 * @param {Object} parameters
 * @constructor
 */
const generarArchivo = function(templateHtml, parameters){
    return new Promise((resolve, reject) => {
        try {
            templateHtml = templateHtml.replace(/@TITULO/g,"" + parameters.title + "");
            templateHtml = templateHtml.replace(/@SUBTITULO/g,"" + parameters.subtitle + "");
            templateHtml = templateHtml.replace(/@FECPROCESO/g,"" + getFormatDate(getStringDate(parameters.fecProceso)) + "");
            let itemsHtml = '';
            parameters.datosGrid.forEach(element => {
                let item = JSON.parse(element);
                itemsHtml += `<tr>
                                <td style="text-align:right">${item.nroConvenio}</td>
                                <td style="text-align:left">${item.empresa}</td>
                                <td style="text-align:right">${getFormatNumber(item.cantTot)}</td>
                                <td style="text-align:right">${getFormatNumber(item.impTot)}</td>
                                <td style="text-align:right">${getFormatNumber(item.cantNoAplic)}</td>
                                <td style="text-align:right">${getFormatNumber(item.impNoAplic)}</td>
                            </tr>`;
            });
            templateHtml = templateHtml.replace(/@ITEMSGRID/g,"" + itemsHtml + "");
            resolve(templateHtml);
        }
        catch(e){
            reject(e);
        }
    })
};

/**
 * Recibe un string con formato 2016-08-10T00:00:00.000Z
 * @param {string}
 * @return {Date} retorna un date
 */
const getStringDate = (str) => {
    return new Date(str.split('T')[0].replace('-','/'));
};

/**
 * Convierte el string a formato dd/MM/yyy
 * @param date
 * @returns {string}
 */
const getFormatDate = (date) => {
    let dd = date.getDate();
    let mm = date.getMonth()+1;
    let yyyy = date.getFullYear();

    if(dd<10) dd='0'+ dd;
    if(mm<10) mm='0'+ mm;
    return dd+'/'+mm+'/'+yyyy;
};

/**
 * Retorna formato #,##.##
 * @param num
 * @returns {string}
 */
const getFormatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
// ----------------------------------------------

exports.padronesComercio= function (req, res) {
    console.log("typeof req.query -> ",req.query);
    var filter= JSON.parse( req.query.filter);

    console.log("req.query.where",req.query.where);
    console.log("req.query.order",req.query.order);
    console.log("req.query.page",req.query.page);
    console.log("req.query.limit -> ",req.query.limit);


    var connection = new sql.Connection(process.config.sql, function (err) {
        var sucursal= typeof filter.sucursal=='undefined'? null : filter.sucursal
        if (sucursal==""){
            sucursal=null
        }
        new sql.Request(connection)
            .input('codigo', sql.VarChar, filter.codigo)
            .input('sucursal', sql.VarChar, sucursal)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('where', sql.VarChar, req.query.where)
            .input('sort', sql.VarChar, req.query.order)
            .execute('dbo.padronesComercio_traer').then(function (rs) {
                res.jsonp(rs);
            })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.padronesComercioExportar= function (req, res) {
    var sucursal= typeof req.query.sucursal=='undefined'? '' : req.query.sucursal;
    if (sucursal==""){
        sucursal=null
    }
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('sucursal', sql.VarChar, sucursal)
            .execute('dbo.padronesComercio_traerTodo').then(function (rs) {
                console.log("10 padronesComercio_traerTodo",rs.length)
                new sql.Request(connection)
                    .input('proceso', sql.VarChar, req.query.proceso)
                    .execute('dbo.procesoPasos_traerPorNombreProceso').then(function (rsPath) {
                       console.log("12 procesoPasos_traerPorNombreProceso",rs.length)

                            var path=rsPath[0][0].pathSalida;//'\\\\192.168.5.230\\TarjetasDeCredito\\Comercios\\Padrones\\Exportar\\';

                        fs.stat(path, function (err, stats){
                                if (err) {
                                    res.status(500).send(ErrorSQL.getError(new Error("No existe el directorio: "+ path)));
                                }
                                var mm = new GenerarExcel.Excel(req, res);
                                var file=mm.getFileName("Comercios_",sucursal);
                                var fullPathFile=path+file;
                                var workbook = new excelNode.Workbook();//excelbuilder.createWorkbook(path, file)
                                mm.workbook=workbook;
                                mm.createExcelData(rs, sucursal)
                                mm.createSheet()
                                mm.workbook.write(fullPathFile, function(err, status){
                                    if(err){
                                        res.jsonp({error:"error al crear excel"});
                                    }else{
                                        res.setHeader('Content-disposition', 'attachment; filename=' + file);
                                        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                                        var filestream = fs.createReadStream(fullPathFile);
                                        filestream.pipe(res);
                                    }
                                });
                        });
                        /* try{console.log("file ", file)}
                            catch(err) {console.log(err);} */
                    }).catch(function(err) {
                        res.status(500).send(ErrorSQL.getError(err));
                    });
            })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });



};

module.exports.campaniasPorCierreDetalleArchivoPromise = campaniasPorCierreDetalleArchivoPromise;

// Movimientos Liquidados
exports.reporteMovLiquidVISA = function (req, res) {
    var Filtro = JSON.parse(req.query.filter);

    var Entidad = typeof Filtro.entidad == 'undefined'? '' : Filtro.entidad;
    var nroCuenta = typeof Filtro.nroCuenta == 'undefined'? '' : Filtro.nroCuenta;
    var fecDesde = null;
    if(Filtro.fechaDesde && Filtro.fechaDesde != ""){
        fecDesde = new Date(Date.parse(Filtro.fechaDesde));
    }
    var fecHasta = null;
    if(Filtro.fechaHasta && Filtro.fechaHasta != ""){
        fecHasta = new Date(Date.parse(Filtro.fechaHasta));
    }

    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('Entidad', sql.VarChar, Entidad)
            .input('nroCuenta', sql.VarChar, nroCuenta)
            .input('fecDesde', sql.Date, fecDesde)
            .input('fecHasta', sql.Date, fecHasta)
            .execute('dbo.getReporteMovLiquidVISA').then(function (rs) {
                res.jsonp(rs);
            })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    })
};

exports.reporteMovLiquidVISAExcel = function (req, res) {
    var Entidad = typeof req.query.entidad == 'undefined'? '' : req.query.entidad;
    var nroCuenta = typeof req.query.nroCuenta == 'undefined'? '' : req.query.nroCuenta;
    var fecDesde = null;
    if(req.query.fechaDesde && req.query.fechaDesde != ""){
        fecDesde = new Date(Date.parse(req.query.fechaDesde));
    }
    var fecHasta = null;
    if(req.query.fechaHasta && req.query.fechaHasta != ""){
        fecHasta = new Date(Date.parse(req.query.fechaHasta));
    }

    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('Entidad', sql.VarChar, Entidad)
            .input('nroCuenta', sql.VarChar, nroCuenta)
            .input('fecDesde', sql.Date, fecDesde)
            .input('fecHasta', sql.Date, fecHasta)
            .execute('dbo.getReporteMovLiquidVISA').then(function (rs) {
            new sql.Request(connection)
                .input('proceso', sql.VarChar, 'Movimientos Liquidados Visa')
                .execute('dbo.procesoPasos_traerPorNombreProceso').then(function (rsPath) {

                var path = (!rsPath[0][0].pathSalida) ? rsPath[0][0].pathEntrada : rsPath[0][0].pathSalida;


                fs.stat(path, function (err, stats){
                    if (err) {
                        reject(ErrorSQL.getError(new Error("No existe el directorio: "+ path)));
                    }
                    var mm = new GenerarExcel.Excel(req, res);
                    var file = 'MovLiqui_'+Entidad+'.xlsx';
                    var fullPathFile= path+file;
                    var workbook = new excelNode.Workbook();//excelbuilder.createWorkbook(path, file)
                    mm.workbook=workbook;
                    mm.createExcelDataFromDS(rs, 'Datos', 'Movimientos Liquidados');
                    mm.createSheetWithType();
                    mm.workbook.write(fullPathFile, function(err, status){
                        if (err) {
                            res.status(500).send("error al crear excel");
                        }else{
                            res.setHeader('Content-disposition', 'attachment; filename=' + file);
                            res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                            var filestream = fs.createReadStream(fullPathFile);
                            filestream.pipe(res);
                        }
                    });
                });
            })
                .catch(function (err) {
                    res.status(500).send(err);
                });

        })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    })
};

exports.reporteMovLiquidMaster = function (req, res) {
    var Filtro = JSON.parse(req.query.filter);


    var Entidad = typeof Filtro.entidad == 'undefined'? '' : Filtro.entidad;
    var nroCuenta = typeof Filtro.nroCuenta == 'undefined'? '' : Filtro.nroCuenta;
    var fecDesde = null;
    if(Filtro.fechaDesde && Filtro.fechaDesde != ""){
        fecDesde = new Date(Date.parse(Filtro.fechaDesde));
    }
    var fecHasta = null;
    if(Filtro.fechaHasta && Filtro.fechaHasta != ""){
        fecHasta = new Date(Date.parse(Filtro.fechaHasta));
    }

    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('Entidad', sql.VarChar, Entidad)
            .input('nroCuenta', sql.VarChar, nroCuenta)
            .input('fecDesde', sql.Date, fecDesde)
            .input('fecHasta', sql.Date, fecHasta)
            .execute('dbo.getReporteMovLiquidMaster').then(function (rs) {
                res.jsonp(rs);
            })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    })
};

exports.reporteMovLiquidMasterExcel = function (req, res) {
    var Entidad = typeof req.query.entidad == 'undefined'? '' : req.query.entidad;
    var nroCuenta = typeof req.query.nroCuenta == 'undefined'? '' : req.query.nroCuenta;
    var fecDesde = null;
    if(req.query.fechaDesde && req.query.fechaDesde != ""){
        fecDesde = new Date(Date.parse(req.query.fechaDesde));
    }
    var fecHasta = null;
    if(req.query.fechaHasta && req.query.fechaHasta != ""){
        fecHasta = new Date(Date.parse(req.query.fechaHasta));
    }

    var connection = new sql.Connection(process.config.sql, function (err) {
        let column
        new sql.Request(connection)
            .input('Entidad', sql.VarChar, Entidad)
            .input('nroCuenta', sql.VarChar, nroCuenta)
            .input('fecDesde', sql.Date, fecDesde)
            .input('fecHasta', sql.Date, fecHasta)
            .execute('dbo.getReporteMovLiquidMaster').then(function (rs) {
            new sql.Request(connection)
                .input('proceso', sql.VarChar, 'Movimientos Liquidados Master')
                .execute('dbo.procesoPasos_traerPorNombreProceso').then(function (rsPath) {

                var path = (!rsPath[0][0].pathSalida) ? rsPath[0][0].pathEntrada : rsPath[0][0].pathSalida;


                fs.stat(path, function (err, stats){
                    if (err) {
                        reject(ErrorSQL.getError(new Error("No existe el directorio: "+ path)));
                    }
                    var mm = new GenerarExcel.Excel(req, res);
                    var file = 'MovLiqui_'+Entidad+'.xlsx';
                    var fullPathFile= path+file;
                    var workbook = new excelNode.Workbook();//excelbuilder.createWorkbook(path, file)
                    mm.workbook=workbook;
                    column=['Nro. Tarjeta','Entidad','Sucursal','Nro. Cuenta','Tipo Socio','Digito Verificador','Grupo CC','Nro. Establecimiento','Establecimiento','Ramo Establecimiento','Cod. Movimiento','Nro. Caja','Nro. Caratula','Nro. Resumen','Nro. Cupon','Cant. Cuotas','Cuota Vig.','Mot. Contrapartida','Cargo PorServicio','Concepto Ajuste','Fecha Operación','Fecha Clearing','Fecha CC','Moneda Origen','Importe Origen','Moneda','Importe Total','Importe Sin Desc.','Importe Final','Tipo Ajuste','Afecta Saldo','Aplicacion','Compras Mes Anter.','Tipo Movimiento','Deb. Cred.','Tipo Prestamo','Nro. Prestamo','Tipo Amortizacion','Tipo Tasa','TNA','TEA','Interes Cuota','Importe Cotorg.','Cancelacion','Importe Cancel','Importe Seg. Vida','Iva Seg. Vida','Alicuota Iva','Motivo Excep. Iva' ]
                    mm.createExcelDataFromDS2(rs, 'CC120D', 'Movimientos Liquidados',column);
                column=['Entidad','Sucursal','Cuenta','Fec. Cierre','ValorLC','Tipo Tarjeta','Prod','GAF','Mod. Liquidacion','SubMod. Gastos','SubMod. Parametros','SubMod. Tasas','GrupoCC','Cod. Concepto','Moneda','Cupon','Cuota Plan','Cuota Vig.','Cod. Ajuste','FSAC','Imp. Pesos','Imp. Dolar','Tipo Conce' ]
                    mm.createExcelDataFromDS2([rs[2]], 'CC108D', 'Movimientos Liquidados',column);
                    mm.createSheetWithType();
                    mm.workbook.write(fullPathFile, function(err, status){
                        if (err) {
                            res.status(500).send("error al crear excel");
                        }else{
                            res.setHeader('Content-disposition', 'attachment; filename=' + file);
                            res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                            var filestream = fs.createReadStream(fullPathFile);
                            filestream.pipe(res);
                        }
                    });
                });
            })
                .catch(function (err) {
                    res.status(500).send(err);
                });

        })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    })
};

exports.reporteCuotasPendientes = function (req, res) {
    var Filtro = JSON.parse(req.query.filter);


    var Entidad = typeof Filtro.entidad == 'undefined'? '' : Filtro.entidad;
    var nroCuenta = typeof Filtro.nroCuenta == 'undefined'? '' : Filtro.nroCuenta;
    var fecDesde = null;
    if(Filtro.fechaDesde && Filtro.fechaDesde != ""){
        fecDesde = new Date(Date.parse(Filtro.fechaDesde));
    }
    var fecHasta = null;
    if(Filtro.fechaHasta && Filtro.fechaHasta != ""){
        fecHasta = new Date(Date.parse(Filtro.fechaHasta));
    }

    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('Entidad', sql.VarChar, Entidad)
            .input('nroCuenta', sql.VarChar, nroCuenta)
            .input('fecDesde', sql.Date, fecDesde)
            .input('fecHasta', sql.Date, fecHasta)
            .execute('dbo.getReporteCuotasPendientes').then(function (rs) {
                res.jsonp(rs);
            })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    })
};

exports.reporteCuotasPendientesExcel = function (req, res) {

    var Entidad = typeof req.query.entidad == 'undefined'? '' : req.query.entidad;
    var nroCuenta = typeof req.query.nroCuenta == 'undefined'? '' : req.query.nroCuenta;
    var fecDesde = null;
    if(req.query.fechaDesde && req.query.fechaDesde != ""){
        fecDesde = new Date(Date.parse(req.query.fechaDesde));
    }
    var fecHasta = null;
    if(req.query.fechaHasta && req.query.fechaHasta != ""){
        fecHasta = new Date(Date.parse(req.query.fechaHasta));
    }
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('Entidad', sql.VarChar, Entidad)
            .input('nroCuenta', sql.VarChar, nroCuenta)
            .input('fecDesde', sql.Date, fecDesde)
            .input('fecHasta', sql.Date, fecHasta)
            .execute('dbo.getReporteCuotasPendientes').then(function (rs) {
                new sql.Request(connection)
                    .input('proceso', sql.VarChar, 'Padrón Cuotas Visa')
                    .execute('dbo.procesoPasos_traerPorNombreProceso').then(function (rsPath) {

                    var path = (!rsPath[0][0].pathSalida) ? rsPath[0][0].pathEntrada : rsPath[0][0].pathSalida;


                        fs.stat(path, function (err, stats){
                            if (err) {
                                reject(ErrorSQL.getError(new Error("No existe el directorio: "+ path)));
                            }
                            var mm = new GenerarExcel.Excel(req, res);
                            var file = 'CuotasPendientes_'+Entidad+'.xlsx';
                            var fullPathFile= path+file;
                            var workbook = new excelNode.Workbook();//excelbuilder.createWorkbook(path, file)
                            mm.workbook=workbook;
                            mm.createExcelDataFromDS(rs, 'Datos', 'Cuotas Pendientes')
                            mm.createSheetWithType()
                            mm.workbook.write(fullPathFile, function(err, status){
                                if (err) {
                                    res.status(500).send("error al crear excel");
                                }else{
                                    res.setHeader('Content-disposition', 'attachment; filename=' + file);
                                    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                                    var filestream = fs.createReadStream(fullPathFile);
                                    filestream.pipe(res);
                                }
                            });
                        });
                    })
                    .catch(function (err) {
                        res.status(500).send(err);
                    });

           })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    })
};

/*
var sheets=[    {config: { name:'Visa'},
    columns_name:"nombre de las columnas []",
    columns_data:"matris de datos [[]]"
},
    {   config:{name:'Test02'},
        columns_name:['col B0','colB1'],
        columns_data:[['2020','2222']]
    }
    ,
    {   config:{name:'Test03'},
        columns_name:['una dos'],
        columns_data:[['dato de columna']]
    }
];
*/

var GenerarExcel = (function () {
    function Excel(req, res) {
        this.templateHtml = "";
        this.templateHtmlM = "";
        this.pathRecibidos="";
        this.rutasArchivosGenerados = [];
        this.workbook=undefined;

        var sheets=[];
        var visa_values=[];
        var master_values=[];
        var cabal_values=[];
        var excel_file={};

        var FILA_INICIO=4;
        this.createExcelDataFromDS = function(data, nombrehoja, title){
            var DataValue = [];
            if(data[0].length>0){
                data[0].forEach(function(data,index) {
                    DataValue.push(_.values(data))
                });
                if(title=='Cuotas Pendientes' || title=='Movimientos Liquidados'){
                    var columna
                    if(title=='Cuotas Pendientes' ){
                        let filtro =_.keys(data[0][0]);
                        if(filtro[2]=='grupoCC'){
                             columna=['Entidad','Sucursal','GrupoCC','Nro. Cuenta','TS','DV','Nro. Cupon','Nro. Cuota','Cant. Cuotas','Fecha Clearing ','Fecha Cierre Cuota ' ,'Fecha Grupo Cierre','Moneda','Importe','Tipo Plan']
                        }else{
                             columna=['Entidad','Sucursal','Nro. Cuenta','Nro. Tarjeta','Cartera','Establecimiento','Rubro','Código Trx','Nro. Cupon','Nro. Cuota','Cant. Cuotas','Fecha Origen','Periodo Cuota','Fecha Cierre','Moneda','Importe Capital','Importe Intereses','Importe Total']
                        }
                    }else{
                             columna=['Entidad','Administrador','Banco',' Sucursal','Transaccion','Nro. Tarjeta','Nro. Cuenta','Establecimiento','Nro. Comprobante','Fecha Origen','Fecha Cierre','Fecha Intercambio','Moneda','Importe','Moneda Origen','Importe Origen','Importe Origen Dolares','Mod. Liquidacion','Rubro','Banco de Estab.','Cartera','GAF','Tipo de Cuenta','Nro.Comercio','Deb. Automático','Plan Cuotas','Nro. Cuota']
                    }
                    sheets.push({config: { name:nombrehoja, title: title},
                        columns_name:columna,
                        columns_data:DataValue
                    });
                }else{
                    sheets.push({config: { name:nombrehoja, title: title},
                        columns_name:_.keys(data[0][0]),
                        columns_data:DataValue
                    });
                }
            }
        };

        this.createExcelDataFromDS2 = function(data, nombrehoja, title,column){
            var DataValue = [];
            if(data[0].length>0){
                data[0].forEach(function(data,index) {
                    DataValue.push(_.values(data))
                });
                    sheets.push({config: { name:nombrehoja, title: title},
                        columns_name:column,
                        columns_data:DataValue
                    });
                }
        };

        this.createExcelData2=function(data, nombrehoja, title){
            if(data.length>0){
                data.forEach(function(data,index) {
                    visa_values.push(_.values(data))
                });
                sheets.push({config: { name: nombrehoja, title: title},
                    columns_name:_.keys(data[0]),
                    columns_data:visa_values
                });
            }
        };
        this.createExcelData=function(data, sucursal){

            if(data[0].length>0){
                data[0].forEach(function(data,index) {
                    visa_values.push(_.values(data))
                });
                sheets.push({config: { name:'Visa', title: `COMERCIOS VISA - Sucursal:  ${sucursal}`  },
                    columns_name:_.keys(data[0][0]),
                    columns_data:visa_values
                });
            }

            if(data[1].length>0) {
                data[1].forEach(function (data, index) {
                    master_values.push(_.values(data))
                });
                sheets.push({   config:{name:'Mastercard', title: `COMERCIOS MASTERCARD - Sucursal:  ${sucursal}`},
                    columns_name:_.keys(data[1][0]),
                    columns_data:master_values
                });
            }
            if(data[2].length>0) {
                data[2].forEach(function (data, index) {
                    cabal_values.push(_.values(data))
                });
                sheets.push({   config:{name:'Cabal', title: `COMERCIOS CABAL - Sucursal:  ${sucursal}`},
                    columns_name:_.keys(data[2][0]),
                    columns_data:cabal_values
                })
            }
        };
        this.createSheet=function(titles){
            for (var i= 0; i< sheets.length;i++ ) { // iterate sheets columns
                var item=sheets[i];
                excel_file[item.config.name] = this.workbook.addWorksheet(item.config.name);
                var styleHead = this.workbook.createStyle({
                    font: {
                        bold: true,
                        size: 12,
                        name: 'Tahoma'
                    }
                });

                var styleHead2 = this.workbook.createStyle({
                    font: {
                        bold: true,
                        size: 9,
                        name: 'Tahoma'
                    }
                });

                styleNumberDecimal = this.workbook.createStyle({
                    numberFormat: '#,##0.00; (#,##0.00); 0',
                    font: {name: 'Tahoma',size:9}
                });
        
                styleNumberInteger = this.workbook.createStyle({
                    font: {name: 'Tahoma',size:9},numFmt: '0',
                    alignment: {horizontal: 'right'}
                });


                if (item.config.title){
                    excel_file[item.config.name].cell(1,1).string('Banco MACRO SA').style(styleHead);
                    excel_file[item.config.name].cell(2,1).string(item.config.title).style({font: {bold: true, size: 11, name: 'Tahoma'}});
                }


                for (var col= 0; col< item.columns_name.length;col++ ) { // iterate sheets columns
                    excel_file[item.config.name].cell(FILA_INICIO, col+1).string(item.columns_name[col].toString()).style({font: {bold: true, size: 9, name: 'Tahoma'}});
                }

                let initRow = 4;

                // llenar datos
                for (var colums= 0; colums< item.columns_data.length;colums++ ) {
                    for (var fila= 0; fila< item.columns_data[colums].length;fila++ ) {
                        try {
                            if(typeof item.columns_data[colums][fila] == "number"){
                                if (Number.isInteger(item.columns_data[colums][fila])){
                                    if(item.columns_name[fila] == "ImpVtaPes") {
                                        excel_file[item.config.name].cell(colums+1+initRow, fila+1).number(item.columns_data[colums][fila]).style(styleNumberDecimal);
                                    } else {
                                        excel_file[item.config.name].cell(colums+1+initRow, fila+1).number(item.columns_data[colums][fila]).style(styleNumberInteger);
                                    }               
                                }else{
                                    excel_file[item.config.name].cell(colums+1+initRow, fila+1).number(item.columns_data[colums][fila]).style(styleNumberDecimal);
                                }

                            } else if (item.columns_data[colums][fila].indexOf('/') > 0) {
                                excel_file[item.config.name].cell(colums+1+initRow, fila+1).string(item.columns_data[colums][fila].toString()).style({alignment: {horizontal: 'right'}});
                            } else {
                                if (isNaN(item.columns_data[colums][fila])) {
                                    excel_file[item.config.name].cell(colums+1+initRow, fila+1).string(item.columns_data[colums][fila].toString());
                                } else {
                                    if (item.columns_name[fila] == "NroCuentaPesCta" || item.columns_name[fila] == "NroCuentaDolCta" ||
                                    item.columns_name[fila] == "NroCuentaPes" ||  item.columns_name[fila] == "NroCuentaDol" || item.columns_name[fila] == "NroCtaAcredPes" ||
                                    item.columns_name[fila] == "NroCtaAcredDol" || item.columns_name[fila] == "NroCuentaPesSuc" || item.columns_name[fila] == "NroFiscal") {
                                        excel_file[item.config.name].cell(colums+1+initRow, fila+1).string(item.columns_data[colums][fila].toString()).style({alignment: {horizontal: 'right'}});
                                    } else {
                                        excel_file[item.config.name].cell(colums+1+initRow, fila+1).string(item.columns_data[colums][fila].toString());
                                    }
                                   
                                }   
                            }

                        } catch (e){
                            //console.log(e);
                        }
                    }
                }
            }
        };
        this.createSheetWithType=function(titles){
            for (var i= 0; i< sheets.length;i++ ) { // iterate sheets columns
                var item=sheets[i];
                excel_file[item.config.name] = this.workbook.addWorksheet(item.config.name);
                var styleHead = this.workbook.createStyle({
                    font: {
                        bold: true
                    }
                });

                var styleDataRigth = this.workbook.createStyle({
                    alignment: {horizontal: 'right'},
                    font: {name: 'Calibri',size:11},
                });

                var styleDataString = this.workbook.createStyle({
                    font: {name: 'Calibri',size:11},
                });

                styleNumberDecimal = this.workbook.createStyle({
                    numberFormat: '#,##0.00; (#,##0.00); 0',
                    font: {name: 'Calibri',size:11}
                });

                styleNumberBig = this.workbook.createStyle({
                    numberFormat: '000000000000000; (000000000000000); 0',
                    font: {name: 'Calibri', size: 11},
                    alignment: {horizontal: 'right'} ,
                    sheetFormat: {'baseColWidth':15}
                });

                styleNumberInteger = this.workbook.createStyle({
                    font: {name: 'Calibri',size:11},numFmt: '0',
                    alignment: {horizontal: 'right'}
                });


                if (item.config.title){
                    excel_file[item.config.name].cell(1,1).string('Banco Macro').style(styleHead);
                    excel_file[item.config.name].cell(2,1).string(item.config.title).style(styleHead);
                }


                for (var col= 0; col< item.columns_name.length;col++ ) { // iterate sheets columns
                    excel_file[item.config.name].cell(FILA_INICIO, col+1).string(item.columns_name[col].toString()).style(styleHead);
                }
                // llenar datos
                for (var colums= 0; colums< item.columns_data.length;colums++ ) {
                    for (var fila= 0; fila< item.columns_data[colums].length;fila++ ) {
                        if(item.columns_data[colums][fila] || item.columns_data[colums][fila] === 0){
                            if(typeof item.columns_data[colums][fila] == "number"){
                                if (Number.isInteger(item.columns_data[colums][fila])){
                                    if(item.columns_data[colums][fila].toString().length<=10){
                                        excel_file[item.config.name].cell(colums+1+FILA_INICIO, fila+1).number(item.columns_data[colums][fila]).style(styleNumberInteger);
                                    }else{
                                        excel_file[item.config.name].cell(colums+1+FILA_INICIO, fila+1).number(item.columns_data[colums][fila]).style(styleNumberBig);
                                    }
                                }else{
                                    excel_file[item.config.name].cell(colums+1+FILA_INICIO, fila+1).number(item.columns_data[colums][fila]).style(styleNumberDecimal);
                                }

                                //excel_file[item.config.name].cell(colums+1+FILA_INICIO, fila+1).number(item.columns_data[colums][fila]).style({numberFormat: '#,##0.00; (#,##0.00); -'});
                            }else if(typeof item.columns_data[colums][fila].getFullYear == "function") {
                                excel_file[item.config.name].cell(colums+1+FILA_INICIO, fila+1).string(moment(item.columns_data[colums][fila]).utc().format('DD/MM/YYYY'));
                                }else if(isFinite(item.columns_data[colums][fila]) === true){
                                if(item.config.title == "Cuotas Pendientes" && (fila == 1 || fila == 2 || fila == 5 || fila == 6 )  ){
                                    excel_file[item.config.name].cell(colums+1+FILA_INICIO, fila+1).number(parseInt(item.columns_data[colums][fila])).style(styleDataRigth);
                                }else{
                                    excel_file[item.config.name].cell(colums+1+FILA_INICIO, fila+1).string(item.columns_data[colums][fila]).style(styleDataRigth);
                                }
                            }else{
                                excel_file[item.config.name].cell(colums+1+FILA_INICIO, fila+1).string(item.columns_data[colums][fila].toString()).style(styleDataString);
                            }
                        }else{
                            excel_file[item.config.name].cell(colums+1+FILA_INICIO, fila+1).string("");
                        }
                    }
                }
            }
        };
        this.getFileName=function(nombre,sucursal){
                var date = new Date();
                var separador="";
                var padMonth="00";
                var padSucursal="000";
                var mes=(date.getMonth() +1).toString();

                var minutos=date.getMinutes();
                mes=padMonth.substring(0, padMonth.length - mes.length)+mes;
                var file=""
                if(!sucursal){
                    file=nombre+mes+ separador + date.getFullYear()+".xlsx";
                }else{
                    suc=padSucursal.substring(0, padSucursal.length - sucursal.length)+sucursal;
                    file=nombre+"_SUC"+suc+"_"+mes+ separador + date.getFullYear()+".xlsx";
                }
                return file;
        }
    }
    return { Excel: Excel}
})()

