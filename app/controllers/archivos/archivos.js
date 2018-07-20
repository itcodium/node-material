
var async = require('async')
    , _ = require('underscore');
var sql = require('mssql');
var fs = require('fs');
var excelNode = require('excel4node');
var moment = require('moment');

var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();

exports.marcasGetAll= function(req, res){
    var os = require('os');
    console.log(os.hostname())
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .execute('dbo.marcas_traer').then(function(recordsets) {
                res.jsonp(recordsets[0])
            }).catch(function(err) {
                res.jsonp(err)
            });
    });
};

exports.insert = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('marca', sql.VarChar, req.body.marca)
            .input('entidad', sql.VarChar, req.body.entidad)
            .input('cartera', sql.VarChar, req.body.cartera)
            .input('archivo', sql.VarChar, req.body.archivo)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('agrupar', sql.Int, req.body.agrupar)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.marcas_crear').then(function (recordset) {
                res.jsonp(recordset[0]);
            }).catch(function (err) {
                res.jsonp(err);
            });
    })
};

exports.delete = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idMarca', sql.Int, req.params.idMarca)
            .input('fecBaja', sql.Date, req.query.fecBaja)
            .input('usuario', sql.VarChar, req.query.usuario)
            .execute('dbo.marcas_borrar').then(function (recordset) {
                res.jsonp(recordset[0]);
            }).catch(function (err) {
                res.jsonp(err);
            });
    });
};

exports.gruposTraer = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .execute('dbo.marcaGrupos_traer').then(function (recordset) {
                res.jsonp(recordset[0]);
            }).catch(function (err) {
                res.jsonp(err);
            })
    });
};

exports.archivoMarcaExportar= function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .execute('dbo.archivoMarcaExport_traer').then(function (response) {
                var mm = new GenerarExcel.Excel(req, res);
                var file=mm.getFileName("Archivos_por_Marca_");
                var fullPathFile = file;
                var workbook = new excelNode.Workbook();//excelbuilder.createWorkbook(path, file)
                mm.workbook=workbook;
                mm.createExcelData(response[0], 'hoja1', 'Archivos por Marca')
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
            })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

var GenerarExcel = (function () {
    function Excel(req, res) {
        this.templateHtml = "";
        this.templateHtmlM = "";
        this.pathRecibidos="";
        this.rutasArchivosGenerados = [];
        this.workbook=undefined;

        var sheets=[];
        var DataValue = [];
        var excel_file={};
        var FILA_INICIO=4;

        this.createExcelData=function(data, nombrehoja, title){
            if(data.length>0){
                data.forEach(function(value,index) {
                    DataValue.push(_.values(value))
                });
                sheets.push({config: { name: nombrehoja, title: title},
                    columns_name:_.keys(data[0]),
                    columns_data:DataValue
                });
            }
        };
        this.createSheet=function(titles){
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
                                    excel_file[item.config.name].cell(colums+1+FILA_INICIO, fila+1).number(item.columns_data[colums][fila]).style(styleNumberInteger);               
                                }else{
                                    excel_file[item.config.name].cell(colums+1+FILA_INICIO, fila+1).number(item.columns_data[colums][fila]).style(styleNumberDecimal);
                                }

                            }else if(typeof item.columns_data[colums][fila].getFullYear == "function") {
                                excel_file[item.config.name].cell(colums+1+FILA_INICIO, fila+1).string(moment(item.columns_data[colums][fila]).utc().format('DD/MM/YYYY'));
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