﻿const sql = require('mssql');

const MSSQLError=require('../../utils/MSSQLError.js');
const ErrorSQL=new MSSQLError.MSSQLError();
const fs = require('fs');
const excelNode = require('excel4node');
const _ = require('underscore');
const moment = require('moment');
const mail = require('../email/email.js');

const obtenerVisaDetalleExcel = (moneda, fecProceso) => {
    return new Promise((resolve, reject) => {
        var connection = new sql.Connection(process.config.sql, function(err) {
            new sql.Request(connection)
                .input('moneda', sql.Int, moneda)
                .input('fecProceso', sql.VarChar, fecProceso)
                .execute('rc_visacoModDia_TraerDetalleExcel').then(function(recordset) {

                    recordset[0] = recordset[0].map(x => {
                        x.FecProceso = new Date(x.FecProceso.valueOf() + x.FecProceso.getTimezoneOffset() * 60000);
                        return x;
                    });
                    resolve(recordset);
            }).catch(function(err) {
                reject(err);
            });
        });
    })
}

const traerPathSalida = (proceso) => {
    return new Promise(function (resolve, reject) {
        var connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('proceso', sql.VarChar, proceso)
                .execute('dbo.procesoPasos_traerPorNombreProceso')
                .then((recordset) => resolve(recordset[0][0].pathSalida))
                .catch((err) =>{
                    reject(err);
                });
        });
    });
};

const traerTotalesMail = (moneda, fecProceso) => {
    return new Promise((resolve, reject) => {
        var connection = new sql.Connection(process.config.sql, function(err) {
            new sql.Request(connection)
                .input('moneda', sql.Int, moneda)
                .input('fecProceso', sql.VarChar, fecProceso)
                .execute('rc_visacoMovDiaTotales_traerMail').then(function(recordset) {
                    resolve(recordset[0]);
            }).catch(function(err) {
                reject(err);
            });
        });
    })
}

function getDataMail(codigo) {
    return new Promise((resolve, reject) => {
        const connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('codigo', sql.VarChar, codigo)
                .execute('dbo.mailsConfigurables_TraerPorCodigo').then(function (recordsets) {
                    resolve(recordsets[0]);
                }).catch(function (err) {
                    res.status(500).send(ErrorSQL.getError(err));
                });
        });
    });
};

const formatNumber = (nro, mil, decimal) => {
    function paddingRight(s, c, n) {
        s = s.toString();
        if (!s || !c || s.length >= n) {
            return s;
        }
        var max = (n - s.length) / c.length;
        for (var i = 0; i < max; i++) {
            s += c;
        }
        return s;
    }

    var res = nro.toString().replace(/\B(?=(\d{3})+(?!\d))/g, mil);
    var aNro = res.split(decimal);
    var decimalPadding;
    if (typeof aNro[1] == 'undefined') {
        aNro[1] = 0;
    }
    decimalPadding = paddingRight(aNro[1], "0", 2);

    return aNro[0] + decimal + decimalPadding;
}

const crearTabla = function (data) {
    let filesHtml = `<table cellspacing="1" cellpadding="7" border="1" style="font-family:tahoma;font-size:12px;padding:5px;">
                    <tr style="border:0;background-color: #808080; color:white; text-decoration:none !important">
                        <th style="border:1px solid #000; text-align:left"><span style="text-decoration:none !important">Estado</span></th>
                        <th style="border:1px solid #000; text-align:left"><span>Descripción</span></th>
                        <th style="border:1px solid #000; text-align:left"><span>Orden</span></th>
                        <th style="border:1px solid #000; text-align:left"><span>Cant</span></th>
                        <th style="border:1px solid #000; text-align:left"><span>Importe</span></th>
                    </tr>`;
    var Cant = 0;
    var Total = 0;

    data.forEach(function (item) {
        filesHtml += `<tr style="border:1">
                        <td>${item.codigo}</td>
                        <td>${item.descripcion}</td>
                        <td style="text-align:right">${item.orden}</td>
                        <td align="right">${item.cant.toString()}</td>
                        <td align="right">${formatNumber(item.sumImporte, ',', '.')}</td>
                      </tr>`;
    });
    filesHtml = filesHtml + '</table>';
    return filesHtml;
}

function sendMail(mailConfig) {
    return new Promise(function (resolve, reject) {
        try {
            var email = new mail.Email();
            email.set_callback(function (error) {
                if (error) {
                    reject('Hubo un error al enviar el mail. Verifique configuraci�n');
                }
                resolve();
            });

            email.send(
                mailConfig.para,
                mailConfig.copia,
                mailConfig.asunto,
                mailConfig.cuerpo
            );
        } catch (e) {
            reject(e);
        }
    });
}

function Excel() {
    var _this=this;
    this.templateHtml = "";
    this.templateHtmlM = "";
    this.pathRecibidos="";
    this.rutasArchivosGenerados = [];
    this.workbook=undefined;

    var sheets=[];
    var tablaTemporal = [];
    var excel_file={};

    var FILA_INICIO=4;
    var styleNumber;
    var styleRight;
    var styleHead;
    var styleTitulo;
    var styleSubTitulo;

    var styleStringRight;
    var styleStringLeft;
    var styleStringRightDate;


    var COLUMNS_NAMES={"ColumnaDeTabla":"NombreColumnaEnArchivo"};

    this.createExcelData=function(data, nombreHojas, titles){
        for (i = 0; i < data.length; i++){
            var iTabla = i ;
            tablaTemporal = [];
            if(data[i].length>0){
                data[i].forEach((row,index) => {
                    tablaTemporal.push(_.values(row));
                });
                var vColumnNames=_.keys(data[iTabla][0]);
                for (var xx = 0; xx < vColumnNames.length ; xx++){
                    vColumnNames[xx]= (typeof COLUMNS_NAMES[vColumnNames[xx]]=='undefined')?vColumnNames[xx] : COLUMNS_NAMES[vColumnNames[xx]];
                }
                sheets.push({config: { name: nombreHojas[i], title: titles[i]},
                    columns_name: vColumnNames,
                    columns_data: tablaTemporal
                });
            }
        }
    };

    this.createSheet=function(){

        styleHead = this.workbook.createStyle({
            font: {
                bold: true,
                name: 'Tahoma',
                size:9
            }
        });


        styleTitulo=this.workbook.createStyle({
            font: {
                bold: true,
                name: 'Tahoma',
                size:12
            }
        });
        styleSubTitulo=this.workbook.createStyle({
            font: {
                bold: true,
                name: 'Tahoma',
                size:11
            }
        });

        styleRight = this.workbook.createStyle({
            alignment: {
                wrapText: true,
                horizontal: 'right'
            },font: {name: 'Tahoma',size:11}
        });
        styleStringRight= this.workbook.createStyle({
            alignment: {horizontal: 'right'
            },font: {name: 'Tahoma',size:11}
        });

        styleStringRightDate= this.workbook.createStyle({
            numberFormat: 'DD/MM/YYYY' ,
            alignment: {horizontal: 'right'
            },font: {name: 'Tahoma',size:9}
        });

        styleStringLeft= this.workbook.createStyle({
            alignment: {horizontal: 'left'},
            font: {name: 'Tahoma',size:9}
        });
        styleNumberDecimal = this.workbook.createStyle({
            numberFormat: '#,##0.00; (#,##0.00); 0',
            font: {name: 'Tahoma',size:9}
        });

        styleNumberInteger = this.workbook.createStyle({
            font: {name: 'Tahoma',size:9},numFmt: '0'
        });

        styleStringRightNormal = this.workbook.createStyle({
            alignment: {horizontal: 'right'
            },font: {name: 'Tahoma',size:9}
        });

        var styleNull = this.workbook.createStyle({font: {name: 'Tahoma',size:11}});

        const StyleByColumn = {
            Importe: { style: styleNumberDecimal, type: 'decimal' },
            NroTarjeta: { style: styleStringRightNormal, type: 'string' },
            Estado: { style: styleStringLeft, type: 'string' },
            EstVISA: { style: styleStringLeft, type: 'string' }
        };


        for (var i= 0; i< sheets.length;i++ ) { // iterate sheets columns
            
            var inicioSegundaGrilla = 0;
            var item=sheets[i];
            
            //esto es solamenete porque debemos tener dos grillas en la misma pagina
            if (i == 1){
                inicioSegundaGrilla = sheets[i-1].columns_data.length + 2;
            }
            else {
                excel_file[item.config.name] = this.workbook.addWorksheet(item.config.name);
                if (item.config.title){
                    excel_file[item.config.name].cell(1,1).string('Banco MACRO SA').style(styleTitulo);
                    excel_file[item.config.name].cell(2,1).string(item.config.title).style(styleSubTitulo);
                }
            }

            for (var col= 0; col< item.columns_name.length;col++ ) { // iterate sheets columns
                if (item.columns_name[col] instanceof Date) {
                    excel_file[item.config.name].cell(FILA_INICIO + inicioSegundaGrilla, col + 1).string(moment(item.columns_name[col]).utc().toString()).style(styleHead);
                }
                else {
                    excel_file[item.config.name].cell(FILA_INICIO + inicioSegundaGrilla, col + 1).string(item.columns_name[col].toString()).style(styleHead);
                }
            }

            // llenar datos
            for (var colums= 0; colums< item.columns_name.length;colums++ ) {
                for (var fila= 0; fila< item.columns_data.length;fila++ ) {

                    if (item.columns_data[fila][colums]!=null) {
                        var cell=excel_file[item.config.name].cell(fila + 1 + FILA_INICIO + inicioSegundaGrilla,colums + 1);
                        var data=item.columns_data[fila][colums];
                        _this.getAddColumn(cell,data, StyleByColumn[item.columns_name[colums]]);
                    }
                }
            }
        }
    };

    this.getAddColumn=function(cell, data, styleCell){
        if (styleCell) {
            if (styleCell.type == 'string')
                cell.string(data).style(styleCell.style);
            else
                cell.number(data).style(styleCell.style);
        } else {
            switch (typeof data){
                case 'string':
                    if (Number.isNaN(parseInt(data)))
                        cell.string(data.toString()).style(styleStringLeft);
                    else
                        cell.number(parseInt(data)).style(styleNumberInteger);
                    break;
                case 'number':
                    if (Number.isInteger(data)){
                        cell.number(data).style(styleNumberInteger);
                    }else{
                        cell.number(data).style(styleNumberDecimal);
                    }
                    break;
                case 'object':
                    if(data instanceof Date)
                    {
                        cell.date(data).style(styleStringRightDate);
                    }else{
                        cell.date(data.toString()).style(styleRight);
                    }
                    break;
                default:
                    cell.date("",data.toString()).style(styleRight);
            }
        }
    };
}


exports.ObtenerTotalesEstVISACO = function(req, res){
    const moneda = req.query.moneda;
    const fecProceso = req.query.fecProceso;
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('moneda', sql.Int, moneda)
            .input('fecProceso', sql.VarChar, fecProceso)
            .execute('rc_visacoMovDiaTotales_traer').then(function(recordset) {
                res.json(recordset);
        }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.ObtenerTotReclamosVISA = (req, res) => {
    const moneda = req.query.moneda;
    const fecProceso = req.query.fecProceso;
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('moneda', sql.Int, moneda)
            .input('fecProceso', sql.VarChar, fecProceso)
            .execute('rc_reclamosVISA_traer').then(function(recordset) {
                res.json(recordset);
        }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.ObtenerTotVISAAsociados = (req, res) => {
    const moneda = req.query.moneda;
    const fecProceso = req.query.fecProceso;
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('moneda', sql.Int, moneda)
            .input('fecProceso', sql.VarChar, fecProceso)
            .execute('rc_visacoMovDia_traer').then(function(recordset) {
                res.json(recordset);
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.ObtenerTotCambioEstado = (req, res) => {
    const moneda = req.query.moneda;
    const fecProceso = req.query.fecProceso;
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('moneda', sql.Int, moneda)
            .input('fecProceso', sql.VarChar, fecProceso)
            .execute('rc_visacoCambioEstado').then(function(recordset) {
                res.json(recordset);
        }).catch(err => {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.ObtenerVisaDetalle = (req, res) => {
    const moneda = req.query.moneda;
    const fecProceso = req.query.fecProceso;
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('moneda', sql.Int, moneda)
            .input('fecProceso', sql.VarChar, fecProceso)
            .execute('rc_visacoModDia_TraerDetalle').then(function(recordset) {
                res.json(recordset);
        }).catch(err => { 
            res.status(500).send(ErrorSQL.getError(err))
        });
    })
};

exports.ObtenerMonedas = (req, res) => {
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .execute('rc_visacoMonedas').then(function(recordset) {
                res.json(recordset);
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.ObtenerUltimoFecProceso = (req, res) => {
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .execute('rc_reclamosVISA_traerFecProceso').then(function(recordset) {
                res.json(recordset[0]);
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.ObtenerExcelDetalle = (req, res) => {
    const moneda = req.query.moneda;
    const fecProceso = req.query.fecProceso;

    const p1 = obtenerVisaDetalleExcel(moneda, fecProceso) ;
    const p2 = traerPathSalida('Reclamos Cruce Visaco');
    
    Promise.all([p1,p2]).then(values => {
        const visaDetalleData = values[0];
        const path = values[1];

        fs.stat(path, function (err, stats){
            if (err){
                return res.status(500).send(ErrorSQL.getError(new Error("No existe el directorio: "+ path)));
            }
            const excel = new Excel();

            const fecProceso = visaDetalleData[0].map(x => moment(x.FecProceso).local())[0];

            let tituloFecha = fecProceso.utc().format('YYYYMMDD');
            const file = `Cruce_Visaco_${moneda == 32? 'Pesos' : 'Dolares'}_${tituloFecha}.xlsx`;

            var fullPathFile=path+file;
            
            excel.workbook = new excelNode.Workbook();
            
            var hojas = [
                'Hoja1'
            ];

            const tituloExcel = 'Resultado Cruce VISACO con Reclamos VISA';
            const titles = [tituloExcel];

            excel.createExcelData(visaDetalleData, hojas, titles);
            excel.createSheet();

            excel.workbook.write(fullPathFile, function(err, status){
                if (err) {
                    res.status(500).send({ error:"error al crear excel" });
                } else {
                    res.setHeader('Content-disposition', 'attachment; filename=' + file);
                    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    var filestream = fs.createReadStream(fullPathFile);
                    filestream.pipe(res);
                }
            });
            
        });
    });
};

exports.ObtenerTotalesDetalle = (req, res) => {
    const moneda = req.query.moneda;
    const fecProceso = req.query.fecProceso;

    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('moneda', sql.Int, moneda)
            .input('fecProceso', sql.VarChar, fecProceso)
            .execute('rc_visacoModDia_TraerTotalesPDF').then(function(recordset) {
                res.json(recordset);
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.EnviarMail = (req, res) => {
    const moneda = req.query.moneda;
    const fecProceso = req.query.fecProceso;
    Promise.all([traerTotalesMail(moneda, fecProceso), getDataMail('RC-VISACO-CRUCE')]).then(values => {
        try {
            let configMail = values[1][0];
            const tData = crearTabla(values[0]);
            configMail.cuerpo = configMail.cuerpo.replace(/@TABLA/i, "" + tData + "");
            if (values[0].length > 0) {
                var fechaProceso = moment(fecProceso).utc().format("DD/MM/YYYY");
                configMail.cuerpo = configMail.cuerpo.replace(/@fecProceso/i, "" + fechaProceso + "");
                configMail.asunto = configMail.asunto.replace(/@fecProceso/i, "" + fechaProceso + "");
                configMail.asunto = configMail.asunto.replace(/@MONEDA/i, "" + (moneda == 32? 'PESOS': 'DOLARES') + "");
            }
            sendMail(configMail).then(() => res.json({}));
        } catch (error) {
            res.status(500).send(ErrorSQL.getError(error));
        }
    });
};