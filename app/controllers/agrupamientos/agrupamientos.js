var sql = require('mssql');
var MSSQLError=require('../../utils/MSSQLError.js')
var ErrorSQL=new MSSQLError.MSSQLError();

var excelNode = require('excel4node');
var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');



var MESES=['NULL','ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];


module.exports.agrupadorConciliacionesObtenerPorProceso= function(req, res){
    console.log("req.query",req.query)
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('nombreProceso', sql.VarChar, req.query.nombreProceso)
            .input('descripcion', sql.VarChar, req.query.descripcion)
            .execute('dbo.cmpagrupamientoTraer').then(function(recordsets) {
                res.jsonp(recordsets[0])
            }).catch(function(err) {
                res.jsonp(err)
            });
    });
};
module.exports.agrupadorConciliacionesObtenerPorProcesoPaginado= function(req, res){
    console.log("req.query",req.query)
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('nombreProceso', sql.VarChar, req.query.nombreProceso)
            .input('descripcion', sql.VarChar, req.query.descripcion)
            .input('order', sql.VarChar, req.query.order)
            .input('pgSize', sql.VarChar, req.query.limit)
            .input('pg', sql.VarChar, req.query.page)

            .execute('dbo.cmpagrupamientoTraer_paginado').then(function(recordsets) {
                res.jsonp(recordsets)
            }).catch(function(err) {
                res.jsonp(err)
            });
    });
};




module.exports.traer = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('tipo', sql.VarChar, req.query.tipo)
            .input('dadosBaja', sql.Int, req.query.dadosBaja)
            .input('Cuenta', sql.VarChar, req.query.cuenta)
            .input('Descripcion', sql.VarChar, req.query.descripcion)
            .input('Digitador', sql.VarChar, req.query.digitador)
            .input('Agrupador', sql.VarChar, req.query.agrupador)
            .execute('cmpAgrupamiento_traer')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};

module.exports.seleccionar = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idcmpAgrupamiento', sql.Int, req.params.idcmpAgrupamiento)
            .execute('cmpAgrupamiento_traerSeleccion')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};

module.exports.controlDuplicado = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idcmpAgrupamiento', sql.Int, req.query.idcmpAgrupamiento)
            .input('codigo', sql.Int, req.query.codigo)
            .execute('cmpAgrupamiento_controlDuplicado')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};

module.exports.insertar = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('codigo', sql.Int, req.body.codMovimiento)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('idAgrupamiento', sql.Int, req.body.idAgrupamiento)
            .input('signoInventario', sql.Int, ((req.body.signoInventario && req.body.signoInventario != '')? req.body.signoInventario : null))
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('cmpAgrupamiento_ingresar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};

module.exports.modificar = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('idcmpAgrupamiento', sql.Int, req.body.idcmpAgrupamiento)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('idAgrupamiento', sql.Int, req.body.idAgrupamiento)
            .input('signoInventario', sql.VarChar, req.body.signoInventario)
            .input('fecBaja', sql.VarChar, req.body.fecBaja)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('cmpAgrupamiento_modificar')
            .then(function (recordset) {
                res.jsonp(recordset[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            })
    })
};
//            .input('baja', sql.VarChar, req.body.baja)


module.exports.conciliacionesMovPresentados= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('entidad', sql.Int, req.query.entidad)
            .input('codMovimiento', sql.Int, req.query.codMovimiento)
            .input('fecDesde', sql.VarChar, req.query.fechaDesde)
            .input('fecHasta', sql.VarChar, req.query.fechaHasta)
            .input('order', sql.VarChar, req.query.order)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('export', sql.Int, req.query.export)
            .execute('repo_movPresentados').then(function(recordsets) {
                res.jsonp(recordsets)
            }).catch(function(err) {
                res.jsonp(err)
            });
    });
};


module.exports.conciliacionesSinAgrupar= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .execute('conciliacionSinAgrupador_traer').then(function(recordsets) {
                res.jsonp(recordsets)
            }).catch(function(err) {
                res.jsonp(err)
            });
    });
};

module.exports.conciliacionesSinAgruparInsertar= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('conciliaciones', sql.VarChar, req.body.conciliaciones)
            .input('idAgrupamiento', sql.VarChar, req.body.idAgrupamiento)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('cfrAgrupamiento_ingresar').then(function(recordsets) {
                res.jsonp(recordsets)
            }).catch(function(err) {
                res.jsonp(err)
            });
    });
};





module.exports.conciliacionesMovPresentadosExport= function(req, res){
    console.log("req.query 001 ",req.query)

    if(req.query.codMovimiento==""){
        req.query.codMovimiento=null;
    }
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('entidad', sql.Int, req.query.entidad)
            .input('codMovimiento', sql.Int, req.query.codMovimiento)
            .input('fecDesde', sql.VarChar, req.query.fechaDesde)
            .input('fecHasta', sql.VarChar, req.query.fechaHasta)
            .input('order', sql.VarChar, req.query.order)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('export', sql.Int, req.query.export)
            .execute('repo_movPresentados').then(function(data) {
                // ------------------------- EXPORTACION INIT -------------------------
                console.log("EXPORTACION INIT  ")

                // --------------------------------------------------------------------------------------
                console.log("1 -----------------------------------------------------")
                            getPathRiesgoContingenteExcel(req).then(function(path) {
                    console.log("req.query -> 2222 ", req.query)
                    fs.stat(path, function (err, stats){
                        if (err){
                            res.status(500).send(ErrorSQL.getError(new Error("No existe el directorio: "+ path)));
                        }
                        console.log("2")
                        var mm;
                        try{
                            mm = new GenerarExcelConciliaciones.Excel(req, res);
                            }
                        catch(err) {
                            console.log("ERROR -> ",err);
                        }
                        console.log("33")
                        var convertDay=function(day,separador){
                            var fecha=day.replace(/-/g,"");
                            console.log("fecha -> ",fecha)
                            return  fecha.substring(6, 8)+separador+fecha.substring(4, 6)+separador+fecha.substring(0, 4)
                        }



                        var file,tituloFechaDesde,tituloFechaHasta;
                        try{
                            tituloFechaDesde=convertDay(req.query.fechaDesde,"")
                            tituloFechaHasta=convertDay(req.query.fechaHasta,"")
                            console.log("tituloFechaDesde,tituloFechaHasta",tituloFechaDesde,tituloFechaHasta)

                            file=mm.getFileName('MovPres', req.query.entidad, tituloFechaDesde, tituloFechaHasta);
                        }
                        catch(err) {
                            console.log("ERROR -> ",err);
                        }

                        console.log("4",file)
                        var fullPathFile=path+file;
                        console.log("5",fullPathFile)
                        mm.workbook = new excelNode.Workbook();
                        console.log("6")
                        var hojas = [
                            'Hoja1'
                        ];

                        tituloFechaDesde=convertDay(req.query.fechaDesde,"/")
                        tituloFechaHasta=convertDay(req.query.fechaHasta,"/")

                        var tituloPeriodoExcel="Mov. Presentados desde: "+ tituloFechaDesde+" hasta: "+ tituloFechaHasta;
                        console.log("tituloPeriodoExcel ",tituloPeriodoExcel)
                        var titles = [tituloPeriodoExcel]
                        try {
                            console.log("* 7 * DATA -> " )
                            mm.createExcelData(data, hojas, titles);
                        }catch(err) {
                            console.log("ERROR7 -> ",err);
                            res.status(500).send({ message: err.message });
                        }

                        try {
                            mm.createSheet();
                            console.log("8")
                        }
                        catch(err) {
                            console.log("ERROR -> ",err.message);
                            res.status(500).send({ message: err.message });
                        }
                        console.log("9", fullPathFile)

                        mm.workbook.write(fullPathFile, function(err, status){
                            console.log("9")

                            if (err) {
                                res.jsonp({error:"error al crear excel"});
                            }else{
                                console.log("10")
                                res.setHeader('Content-disposition', 'attachment; filename=' + file);
                                res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                                console.log("11")
                                var filestream = fs.createReadStream(fullPathFile);
                                console.log("12")
                                filestream.pipe(res);
                                //res.jsonp([{path: fullPathFile}]);
                            }
                        });
                    });
                }).catch(function (err) {
                        console.log("13",typeof err)
                        if(typeof err=="string"){
                            res.status(500).send({ message: err });
                        }else{
                            res.status(500).send({ message: err.message });
                        }
                    });

                // -----------------------------------------------------------------------------------------------

                // ------------------------- EXPORTACION FIN -------------------------
            }).catch(function(err) {
                res.jsonp(err)
            });
    });


};

/*

module.exports.getRiesgoContingenteExcel = getRiesgoContingenteExcel;
function getRiesgoContingenteExcel(req) {
    return new Promise(function (resolve, reject) {
        var connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('periodo', sql.VarChar, req.query.periodo)
                .execute('dbo.getRiesgoContingenteExcel')
                .then(function (recordset) {
                    resolve(recordset)
                })
                .catch(function (err) {
                    reject(ErrorSQL.getError(err).message);
                });
        });
    });
}
*/

module.exports.getPathRiesgoContingenteExcel = getPathRiesgoContingenteExcel;
function getPathRiesgoContingenteExcel(req) {
    console.log("recordset[0][0]['pathSalida']","getPathRiesgoContingenteExcel")

    return new Promise(function (resolve, reject) {
        var connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('proceso', sql.VarChar, 'Conci. Movimientos Presentados')
                .execute('dbo.procesoPasos_traerPorNombreProceso')
                .then(function (recordset) {
                    console.log("recordset[0][0]['pathSalida']",recordset[0][0]['pathSalida'])
                    resolve(recordset[0][0]['pathSalida']);
                })
                .catch(function (err) {
                    reject(ErrorSQL.getError(err).message);
                });
        });
    });
}







var GenerarExcelConciliaciones = (function () {
    function Excel(req, res) {
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

            console.log("a")
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
                },font: {name: 'Tahoma',size:11}
            });

            styleStringLeft= this.workbook.createStyle({
                alignment: {horizontal: 'left'},
                font: {name: 'Tahoma',size:11}
            });
            styleNumber = this.workbook.createStyle({
                numberFormat: '#,##0.00; (#,##0.00); ()'
                ,font: {name: 'Tahoma',size:11}
            });

            styleNumberInteger = this.workbook.createStyle({
                font: {name: 'Tahoma',size:11}
            });

            var styleNull = this.workbook.createStyle({font: {name: 'Tahoma',size:11}});


            for (var i= 0; i< sheets.length;i++ ) { // iterate sheets columns
                console.log("b",i)
                var inicioSegundaGrilla = 0;
                var item=sheets[i];
                //esto es solamenete porque debemos tener dos grillas en la misma p�gina
                if (i == 1){
                    console.log("c")
                    inicioSegundaGrilla = sheets[i-1].columns_data.length + 2;
                }
                else {
                    console.log("d")
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
                // console.log("* i1 colums * ",' columns_name.length -> ',item.columns_name.length)
                for (var colums= 0; colums< item.columns_name.length;colums++ ) {
                    //  console.log("* i2 fila * ",' columns_data.length -> ',item.columns_data.length)
                    for (var fila= 0; fila< item.columns_data.length;fila++ ) {
                        //  console.log("* fila * ",fila);
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

                        // console.log("item.columns_data[fila][colums]", item.columns_data[fila][colums])
                        if (item.columns_data[fila][colums]!=null){
                            var cell=excel_file[item.config.name].cell(fila + 1 + FILA_INICIO + inicioSegundaGrilla,colums + 1);
                            var data=item.columns_data[fila][colums];
                            console.log("(**) item.config.name -> ", item.config.name)
                            _this.getAddColumn(cell,data);
                        }
                    }

                }
            }
        };

        this.getAddColumn=function(cell,data){

            switch (typeof   data){
                case 'string':
                    cell.string(data.toString()).style(styleStringLeft);

                    break;
                case 'number':

                    if (Number.isInteger(data)){
                        cell.number(data).style(styleNumberInteger);

                    }else{
                        cell.number(data).style(styleNumber);

                    }

                    break;
                case 'object':
                    if(data instanceof Date)
                    {
                        var fecha = data.toISOString().replace("T"," ").replace("Z","");
                        cell.date(fecha).style(styleStringRightDate);

                        // moment(data).utc().format('DD/MM/YYYY')
                    }else{
                        cell.date(data.toString()).style(styleRight);

                    }
                    break;
                default:
                    //cell.date("",data.toString()).style(styleRight);
                    cell.date("",data.toString()).style(styleRight);
            }



        }


        this.getFileName=function(nombre,entidad,desde,hasta){
            var separador="_";
            var desde2 = desde.split('');
            var hasta2 = hasta.split('');
            removerD = desde2.splice(4,2);
            desde2 = desde2.join('');
            removerH = hasta2.splice(4,2);
            hasta2 = hasta2.join('');

            // MovPres_ddmmaa_al_DDMMAA_ENT.xlsx
            return nombre + separador+desde2 +separador+"al"+separador+hasta2 + '.xlsx';
        }
    }
    return { Excel: Excel}
})();



