/**
 * Created by nicolas.iglesias on 02/11/2017.
 */

const excelNode = require('excel4node');
﻿var sql = require('mssql');
var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();
var http = require('http'),
    fs = require('fs');

//var excelbuilder = require('msexcel-builder');
var _ = require('underscore');


exports.ObtenerTotalesCie = function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            //.execute('rc_totalesVisaCie_traer').then(function(recordset) {
            .execute('rc_totalesVisaCie_traer').then(function(recordset) {
            res.jsonp(recordset);
        }).catch(function(err) {
            console.log("err",err)
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};
exports.ObtenerTotalesCancelaciones = function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .execute('rc_totalesVisaCancelaciones_traer').then(function(recordset) {
            //.execute('rc_reclamosVISA_traer').then(function(recordset) {
            res.jsonp(recordset);
        }).catch(function(err) {
            console.log("err",err)
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};
exports.ObtenerHistorico = function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .execute('rc_PartidasPendientesHistorico_traer').then(function(recordset) {
            //.execute('rc_visacoMovDia_traer').then(function(recordset) {
            res.jsonp(recordset);
        }).catch(function(err) {
            console.log("err",err)
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};



exports.ObtenerRegNroCie= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('nroCie', sql.Int, req.param("nroCie"))
            .execute('rc_partidasPendientes_agrup_nroCie').then(function(recordset) {
            //.execute('rc_visacoMovDia_traer').then(function(recordset) {
            res.jsonp(recordset);
        }).catch(function(err) {
            console.log("err",err)
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.ObtenerRegNroCis= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('fecPago', sql.VarChar, req.param("fecPago"))
            .execute('rc_partidasPendientes_agrup_fecPago').then(function(recordset) {
            //.execute('rc_visacoMovDia_traer').then(function(recordset) {
            res.jsonp(recordset);
        }).catch(function(err) {
            console.log("err",err)
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};


/// EXPORTACION EXCEL  //


const traerCisExcel = (fecPago) => {
    return new Promise((resolve, reject) => {
            const connection = new sql.Connection(process.config.sql, function(err) {
                new sql.Request(connection)
                    .input('fecPago', sql.VarChar, fecPago)
                    .execute('rc_partidasPendientes_exportCIS') // traer datos que van a ir al excel
                    .then(function(recordsets) {
                        if(recordsets[0].length==0){
                            throw new Error("No se encontraron datos para generar el archivo.");
                        }
                        resolve(recordsets);
                    }).catch(function(err) {
                     reject(err);
                });
            });
});
};

const traerPathSalida = (proceso) => {
    return new Promise(function (resolve, reject) {
        var connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('proceso', sql.VarChar, proceso)
                .execute('dbo.procesoPasos_traerPorNombreProceso')
                .then((recordset) => resolve(recordset[0][0]['pathSalida']))  // trae el path de salida
            .catch((err) => reject(err));
        });
    });
};


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
                data[i].forEach(function(row,index) {
                    tablaTemporal.push(_.values(row))
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
            font: {name: 'Tahoma',size:9}
        });

        var styleNull = this.workbook.createStyle({font: {name: 'Tahoma',size:11}});

        const StyleByColumn = {
            Imp_Ajuste: styleNumberDecimal,
            Importe: styleNumberDecimal,
            Comision: styleNumberDecimal
        };


        for (var i= 0; i< sheets.length;i++ ) { // iterate sheets columns

            var inicioSegundaGrilla = 0;
            var item=sheets[i];

            //esto es solamenete porque debemos tener dos grillas en la misma p�gina
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
            cell.number(data).style(styleCell);
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

module.exports.exportCis= (req, res) => {
    console.log("1");
    const formattedDate = (d, format, separator = '/') => {
        function pad(s) { return (s < 10) ? '0' + s : s; }

        let dateFormatted;
        switch (format) {
            case 'aaaammdd':
                dateFormatted = [d.getFullYear(), pad(d.getMonth()+1), pad(d.getDate())].join(separator);
                break;
            default:
                dateFormatted = [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join(separator);
                break;
        }
        return dateFormatted;
    };


    const fecPago = req.query.fecPago;

    console.log("fecPago",fecPago);
    const p1 = traerCisExcel(fecPago) ;
    const p2 = traerPathSalida('Reclamos Part. Pendientes VI');

    Promise.all([p1,p2]).then(values => {
        const entesExternosData = values[0];
    const path = values[1];
    fs.stat(path, function (err, stats){
        if (err){
            res.status(500).send(ErrorSQL.getError(new Error("No existe el directorio: "+ path)));
        }
        const excel = new Excel();

        //const fechaPagoData = fecPago || new Date(Math.min.apply(null, fechasData));
        console.log("data", entesExternosData.length);
        let tituloFecha = fecPago;

        const file = `Cancelaciones_${tituloFecha}.xlsx`;

        var fullPathFile=path+file;


        try {
            excel.workbook = new excelNode.Workbook();
        }catch(err) {
            res.status(500).send({ message: err.message });
        }

        var hojas = [
            'Hoja1'
        ];

        var v1 = fecPago.substr(6,2)+"/"+fecPago.substr(4,2)+"/"+fecPago.substr(0,4);

        const tituloExcel = `Cancelaciones del día: ${v1}`;
        const titles = [tituloExcel];

        try {
            excel.createExcelData(entesExternosData, hojas, titles);
            excel.createSheet();
        }
        catch(err) {
            res.status(500).send({ message: err.message });
        }

        console.log("fullPathFile",file, fullPathFile)
        excel.workbook.write(fullPathFile, function(err, status){
            if (err) {
                console.log(111);
                res.status(500).send({ error:"error al crear excel" });
            } else {
                res.setHeader('Content-disposition', 'attachment; filename=' + file);
                res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                var filestream = fs.createReadStream(fullPathFile);
                filestream.pipe(res);
            }
        });
    });
})
.catch(err => res.status(500).send(
    ErrorSQL.getError(err))
);
};



