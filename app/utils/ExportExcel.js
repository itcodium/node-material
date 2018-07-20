var excelNode = require('excel4node');
var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');

exports.ExportarExcel=  function () {
        var _this=this;
        this.conTotales = 0;
        this.templateHtml = "";
        this.templateHtmlM = "";
        this.pathRecibidos="";
        this.columnsFormat="";
        this.rutasArchivosGenerados = [];
        this.workbook=undefined;
        this.file=undefined;

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
        this.download=function(res){
            _this.file=_this.getFileName();
            var path_file=_this.path_file+ _this.file;
            console.log("9 file: ",path_file)
            this.workbook.write(path_file, function(err, status){

                if (err) {
                    res.jsonp({error:"error al crear excel"});
                }else{
                    console.log("10")
                    res.setHeader('Content-disposition', 'attachment; filename=' + _this.file);
                    res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                    console.log("11")
                    var filestream = fs.createReadStream(path_file);
                    console.log("12")
                    filestream.pipe(res);
                    //res.jsonp([{path: fullPathFile}]);
                }
            });
        }
        this.createExcelData=function(data, config){
            tablaTemporal = [];
            for (i = 0; i < data.length; i += (this.conTotales)? 2 : 1){
            //if(data[i].length>0){
                data[i].forEach(function(row, index) {
                    tablaTemporal.push(_.values(row))
                });
                var vColumnNames = _.keys(data[i][0]);

                //La tabla siguiente debe ser exactamente igual a la actual
                /*
                if (this.conTotales) {
                    if (data[i + 1].length > 0) {
                        data[i + 1].forEach(function (row, index) {
                            tablaTemporal.push(_.values(row))
                        });
                    }
                    if (vColumnNames.length == 0)
                        vColumnNames = _.keys(data[i+1][0]);
                }
                */
                for (var xx = 0; xx < vColumnNames.length ; xx++){
                    vColumnNames[xx] = (typeof COLUMNS_NAMES[vColumnNames[xx]]=='undefined')?vColumnNames[xx] : COLUMNS_NAMES[vColumnNames[xx]];
                }

                /*
                var columnsFormat;
                if(config[i].columnsFormat.length>0){
                    columnsFormat=config[i].columnsFormat[i];
                }
                */

                sheets.push({config: { name: config[i].solapa, title: config[i].titulo},
                    // columnsFormat: columnsFormat,
                    columns_name: vColumnNames,
                    columns_data: tablaTemporal
                });
            //}
            }
        };
        this.createSheet=function(){

            console.log("a")
            styleHead = this.workbook.createStyle({
                font: {
                    bold: true,
                    name: 'Tahoma',
                    size:9
                }
            });
            styleHeadRight = this.workbook.createStyle({
                font: {
                    bold: true,
                    name: 'Tahoma',
                    size:9
                },
                alignment: {horizontal: 'right'},
            });

            styleHeadLeft= this.workbook.createStyle({
                font: {
                    bold: true,
                    name: 'Tahoma',
                    size:9
                },
                alignment: {horizontal: 'left'},
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
                },font: {name: 'Tahoma',size:9}
            });
            styleStringRight= this.workbook.createStyle({
                alignment: {horizontal: 'right'
                },font: {name: 'Tahoma',size:9}
            });

            styleStringRightDate= this.workbook.createStyle({
                numberFormat: 'DD/MM/YYYY' ,
                alignment: {horizontal: 'right'},
                font: {name: 'Tahoma',size:9}
            });



            styleStringLeft= this.workbook.createStyle({
                alignment: {horizontal: 'left'},
                font: {name: 'Tahoma',size:9}
            });
            styleNumber = this.workbook.createStyle({
                numberFormat: '#,##0.00; (#,##0.00); ()'
                ,font: {name: 'Tahoma',size:9}
            });

            styleNumberInteger = this.workbook.createStyle({
                numberFormat: '#,##0; -#,##0; -'
                ,font: {name: 'Tahoma',size:9}
            });

            var styleNull = this.workbook.createStyle({font: {name: 'Tahoma',size:9}});


            for (var i= 0; i< sheets.length;i++ ) { // iterate sheets columns
                console.log("b",i)
                var inicioSegundaGrilla = 0;
                var item=sheets[i];

                //esto es solamenete porque debemos tener dos grillas en la misma pgina
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
                    var cellFormat=this.columnsFormat[i][item.columns_name[col]];
                    var style=styleHead;
                    console.log("cellFormat ***", cellFormat)
                    if (typeof cellFormat !='undefined' && typeof cellFormat.align!='undefined'  ){
                        // if(cellFormat.align=='right'){
                       if(cellFormat.align=='right' && cellFormat.alignHead==true){
                            style=styleHeadRight;
                        }
                        //if(cellFormat.align=='left'){
                        if(cellFormat.align=='left' && cellFormat.alignHead==true){
                            style=styleHeadLeft;
                        }
                    }

                    if (item.columns_name[col] instanceof Date) {
                        excel_file[item.config.name].cell(FILA_INICIO + inicioSegundaGrilla, col + 1).string(moment(item.columns_name[col]).utc().toString()).style(style);
                    }
                    else {
                        excel_file[item.config.name].cell(FILA_INICIO + inicioSegundaGrilla, col + 1).string(item.columns_name[col].toString()).style(style);
                    }
                }


                for (var colums= 0; colums< item.columns_name.length;colums++ ) {
                    for (var fila= 0; fila< item.columns_data.length;fila++ ) {

                        var styleCell = styleNull;
                        if (item.columns_data[fila][colums] == 'Totales')
                            styleCell = styleHead;
                        else if (item.columns_name[colums].toUpperCase().indexOf('CANT') > 0)
                            styleCell = styleRight;
                        else if (item.columns_name[colums].toUpperCase().indexOf('IMPORT') > 0)
                            styleCell = styleRight;
                        else if (item.columns_name[colums].toUpperCase().indexOf('%') > 0)
                            styleCell = styleRight;
                        else if (item.columns_name[colums].toUpperCase().indexOf('ANALIZADO') > 0)
                            styleCell = styleRight;
                        else if (item.columns_name[colums].toUpperCase().indexOf('RECUPERADO') > 0)
                            styleCell = styleRight;
                        else if (item.columns_name[colums].toUpperCase().indexOf('SALDO') > 0)
                            styleCell = styleRight;
                        else if (item.columns_name[colums].toUpperCase().indexOf('DISPONIBLE') > 0)
                            styleCell = styleRight;


                        if (item.columns_data[fila][colums]!=null){
                            var cell=excel_file[item.config.name].cell(fila + 1 + FILA_INICIO + inicioSegundaGrilla,colums + 1);
                            var data=item.columns_data[fila][colums];
                            var cellName=item.columns_name[colums];
                            _this.getAddColumn(cell,data,_this.columnsFormat[i][cellName]);
                        }
                    }

                }

            }
        };
        this.getAddColumn=function(cell,data,cellFormat){
            switch (typeof   data){
                case 'string':
                    var style=styleStringLeft;
                    if (typeof cellFormat !='undefined' && typeof cellFormat.align!='undefined'){
                        if(cellFormat.align=='right'){
                            style=styleStringRight;
                        }
                    }
                    cell.string(data.toString()).style(style);
                    break;
                case 'number':

                    if (Number.isInteger(data)){
                        var style;
                        if(typeof cellFormat!='undefined'){
                            style = _this.workbook.createStyle({
                                numberFormat: cellFormat.format
                                ,font: {name: 'Tahoma',size:9}
                            });

                            if (typeof cellFormat !='undefined' && typeof cellFormat.align!='undefined'){
                                style = _this.workbook.createStyle({
                                    numberFormat: cellFormat.format
                                    ,font: {name: 'Tahoma',size:9},
                                    alignment: {horizontal: cellFormat.align}
                                });
                            }
                        }else{
                            style=styleNumberInteger;
                        }
                        cell.number(data).style(style);
                    }else{
                        var style;
                        if(typeof cellFormat!='undefined'){
                            style = _this.workbook.createStyle({
                                numberFormat: cellFormat.format
                                ,font: {name: 'Tahoma',size:9}
                            });
                        }else{
                            style=styleNumber;
                        }
                        cell.number(data).style(style);
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
                default:{
                    cell.date("",data.toString()).style(styleRight);
                }
            }

        }
        this.getFileName=function(){
            return 'definir_nombre.xlsx';
        }
}








