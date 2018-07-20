
var sql = require('mssql');

var MSSQLError=require('../../utils/MSSQLError.js');
var ErrorSQL=new MSSQLError.MSSQLError();
// para generar el xls hace falta estas librerias
var excelNode = require('excel4node');
var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');

var MESES=['NULL','ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];


exports.obtenerPeriodo= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('dbo.fallecidos_ObtenerPeriodo').then(function(recordset) {
            if(recordset[0].length==0){
                res.jsonp([])
            }
            res.jsonp(recordset[0])
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};
exports.insert= function(req, res){

    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('fecDesde', sql.Date, req.body.fecDesde)
            .input('fecHasta', sql.Date, req.body.fecHasta)
            .input('margenPerdida', sql.VarChar, req.body.margenPerdida)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.fa_periodo_insertar').then(function (item) {
                res.jsonp(item[0])
            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};
exports.update= function(req, res){

    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idFallecidos', sql.Int, req.body.idFallecidos)
            .input('disponibleCuenta', sql.Numeric(18,2), req.body.disponibleCuenta)
            .input('estadoDataEntry', sql.VarChar, req.body.estadoDataEntry)
            .input('usuario', sql.VarChar, req.body.modificadoPor)
            .execute('dbo.fallecidos_actualizar').then(function (item) {
                res.jsonp(item[0])
            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};
exports.updatePeriodo= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idPeriodo', sql.Int, req.params.idPeriodo)
            .input('fecDesde', sql.Date, req.body.fecDesde)
            .input('fecHasta', sql.Date, req.body.fecHasta)
            .input('margenPerdida', sql.VarChar, req.body.margenPerdida)
            .input('usuario', sql.VarChar, req.body.usuario)
            .execute('dbo.fa_periodo_modificar').then(function (item) {
                res.send(200);
            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};
exports.getAll= function(req, res){



    try {
        var query=JSON.parse(req.query.filter)
        var fecha=null;

        if (typeof  query.fecha!='undefined' && query.fecha!=null){
            fecha= query.fecha.replace('Z',' ').replace('T',' ').substr(0, 10);
        }
        var connection = new sql.Connection(process.config.sql, function(err) {
            new sql.Request(connection)
                .input('fecha', sql.VarChar,fecha )
                .input('estado', sql.VarChar, typeof  query.estado=='undefined'?null:query.estado)
                .input('estadoDataEntry', sql.VarChar,  typeof  query.estadoDataEntry=='undefined'?null:query.estadoDataEntry )
                .input('nroCuenta', sql.VarChar,  (typeof  query.nroCuenta=='undefined' || query.nroCuenta=="")?null:query.nroCuenta )
                .execute('dbo.fallecidos_traer').then(function(recordset) {
                    if(recordset[0].length==0){
                        res.jsonp([])
                    }
                    console.log("*** 999 ", recordset[0])
                    res.jsonp(recordset[0])
                }).catch(function(err) {
                    console.log("*** 000 ")
                    res.status(500).send(ErrorSQL.getError(err));
                });
        });

    }
    catch(err) {
        console.log("*** 222 ")
        res.status(500).send(ErrorSQL.getError(err));

    }



};

exports.getRiesgoContingentePorDia= function(req, res){
    var query=JSON.parse(req.query.periodo)
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('periodo', sql.VarChar, query.periodo)
            .execute('fa_riesgoContingenteTraerPorDia').then(function(recordset) {
            res.jsonp(recordset)
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.getRiesgoContingentePeriodo= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('fa_PeriodosObtener').then(function(recordset) {
            res.jsonp(recordset)
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};


exports.getLlamadaRiesgoContingente= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('where', sql.VarChar, req.query.where)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('sort', sql.VarChar, req.query.order)
            .execute('fa_LlamadaRiesgoContingente').then(function(recordset) {
            if(recordset[0].length==0){
                res.jsonp([])
            }
            res.jsonp(recordset)
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.generarExcelRiesgoContingente = function (req, res) {

    getRiesgoContingenteExcel(req)
        .then(function (data) {
            getPathRiesgoContingenteExcel(req).then(function(path) {
                fs.stat(path, function (err, stats){
                    if (err){
                        res.status(500).send(ErrorSQL.getError(new Error("No existe el directorio: "+ path)));
                    }
                    var mm = new GenerarExcel.Excel(req, res);
                    var lPeriodo=req.query.periodo.split("-");
                    var lMes=parseInt(lPeriodo[1])


                    var file=mm.getFileNameRiesgoContingente('Riesgo Contingente', req.query.periodo);
                    var fullPathFile=path+file;
                    mm.workbook = new excelNode.Workbook();//excelbuilder.createWorkbook(path, file)
                    var hojas = [
                        'Riesgo Conting',
                        'Riesgo Conting',
                        'T-BCO RECUP',
                        'T-BCO RIESGO',
                        'NO INFORMAR A GESTIVA'
                    ];
                    var tituloPeriodoExcel=MESES[lMes]+"-"+lPeriodo[0].substring(2,4);
                    var titles = [
                        tituloPeriodoExcel,
                        tituloPeriodoExcel,
                        tituloPeriodoExcel,
                        tituloPeriodoExcel,
                        tituloPeriodoExcel
                    ]
                    mm.createExcelData(data, hojas, titles);

                    try {

                        mm.createSheet();
                    }
                    catch(err) {
                        res.status(500).send({ message: err.message });
                    }

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
        .catch(function (err) {
            res.status(500).send({ message: err.message });
        });
};

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
                    reject(err);
                });
        });
    });
}

module.exports.getPathRiesgoContingenteExcel = getPathRiesgoContingenteExcel;
function getPathRiesgoContingenteExcel(req) {
    return new Promise(function (resolve, reject) {
        var connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('proceso', sql.VarChar, 'Fallecidos - Generar Reversa')
                .execute('dbo.procesoPasos_traerPorNombreProceso')
                .then(function (recordset) {
                    resolve(recordset[0][0]['pathSalida']);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    });
}

exports.getLlamadaRiesgoContingentePorDia= function(req, res){
    var query=JSON.parse(req.query.periodo)
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('periodo', sql.VarChar, query.periodo)
            .execute('fa_riesgoContingenteTraerPorDia').then(function(recordset) {
                res.jsonp(recordset)
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.getRiesgoContingente= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('where', sql.VarChar, req.query.where)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('sort', sql.VarChar, req.query.order)
            .execute('fa_LlamadaRiesgoContingente').then(function(recordset) {
            if(recordset[0].length==0){
                res.jsonp([])
            }
            res.jsonp(recordset)
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

exports.getRiesgoContingentePorRegion= function(req, res){
    var query=JSON.parse(req.query.periodo)
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('periodo', sql.VarChar, query.periodo)
            .execute('fa_riesgoContingenteTraerPorRegion').then(function(recordset) {
                res.jsonp(recordset)
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.getRiesgoContingentePorDetalle= function(req, res){
    var periodo=JSON.parse(req.query.periodo);
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('periodo', sql.VarChar, periodo.periodo)
            .input('estado', sql.VarChar, req.query.estado)
            .input('where', sql.VarChar, req.query.where)
            .input('pgSize', sql.Int, req.query.limit)
            .input('pg', sql.Int, req.query.page)
            .input('sort', sql.VarChar, req.query.order)
            .execute('fa_riesgoContingenteTraerDetalle').then(function(recordset) {
                res.jsonp(recordset)
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });

};






exports.getLlamadaRiesgoContingentePeriodo= function(req, res){
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection).execute('fa_PeriodosObtener').then(function(recordset) {
            res.jsonp(recordset)
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err));
        });
    });
};

/*---------  Contabilidad  ---------*/

const guardarContabilidadEnc = (connection, idProceso, usuario) => {
    return new Promise((resolve, reject) => {
        new sql.Request(connection)
            .input('idProceso', sql.Int, idProceso)
            .input('usuario', sql.VarChar, usuario)
            .execute('fa_ContabilidadEnc_Guardar').then(function(recordset) {
            resolve(recordset[0][0].IdContabilidadEnc);
        }).catch(function(err) {
            reject(err);
        });
    });
};

const eliminarContabilidadEnc = (connection, idContabilidadEnc) => {
    return new Promise((resolve, reject) => {
        new sql.Request(connection)
        .input('idContabilidadEnc', sql.Int, idContabilidadEnc)
        .execute('fa_ContabilidadEnc_Eliminar').then(function(recordset) {
        resolve(recordset);
        }).catch(function(err) {
            reject(err);
        });
    });
};

const guardarContabilidad = (connection, idContabilidadEnc, usuario, sp) => {
    return new Promise((resolve, reject) => {
        new sql.Request(connection)
            .input('idContabilidadEnc', sql.Int, idContabilidadEnc)
            .input('usuario', sql.VarChar, usuario)
            .execute(sp).then(function(recordset) {
            resolve(recordset);
        }).catch(function(err) {
            reject(err);
        });
    })
};

const obtenerContabilidad = (connection, idContabilidadEnc, archivo) => {
    return new Promise((resolve, reject) => {
        new sql.Request(connection)
            .input('idContabilidadEnc', sql.Int, idContabilidadEnc)
            .input('archivo', sql.VarChar, archivo)
            .execute('fa_Contabilidad_Obtener').then(function(recordset) {
            resolve(recordset);
        }).catch(function(err) {
            reject(err);
        });
    })
};

const obtenerPathSalida = (connection) => {
    return new Promise((resolve, reject) => {
        new sql.Request(connection)
            .input('proceso', sql.VarChar, 'Fallecidos - Generar Reversa')
            .execute('procesoPasos_traerPorNombreProceso').then(function(rs) {
            if(rs[0].length==0){
                throw new Error("No se encontro el registro buscado.");
            }else{
                if(rs[0][0].length==0 && rsPath[0][1].length==0 && rsPath[0][2].length==0){
                    throw new Error("No se encontraron datos para las solapas.");
                }
            }
            resolve(rs[0][0].pathSalida);
        })
    });
};

const generarTxt = (nombreArchivo, registros, pathSalida) => {
    let text = '';
    for (let registro of registros) {
        text+= registro.Registro + '\r\n';
    }
    fs.writeFile(pathSalida + nombreArchivo, text,{encoding:'utf8', flag:'w+'});
};

const generarTxtContabilidad = (pathSalida, registros) => {
    return new Promise((resolve, reject) => {
        const lstRobotCui = registros[0][0];
        const lstRobotPagosPrevisionales = registros[1][0];

        generarTxt('RobotCui.txt', lstRobotCui, pathSalida);
        generarTxt('RobotComisionesPagosPrevisionales.txt', lstRobotPagosPrevisionales, pathSalida);
        resolve(1);
    });
};

const guardarContabilidades = (connection, idContabilidadEnc, usuario) => {
    return new Promise((resolve, reject) => {
        /*Se guarda la contabilidad, contabilidad sucursal y contrapartida */
        guardarContabilidad(connection, idContabilidadEnc, usuario, 'fa_Contabilidad_Guardar')
        .then(guardarContabilidad(connection, idContabilidadEnc, usuario, 'fa_ContabilidadSucursal_Guardar')
            .then(guardarContabilidad(connection, idContabilidadEnc, usuario, 'fa_ContabilidadContrapartidas_Guardar')
                .then(result => {
                    const p4 = obtenerContabilidad(connection, idContabilidadEnc, 'RobotCui.txt');
                    const p5 = obtenerContabilidad(connection, idContabilidadEnc, 'RobotComisionesPagosPrevisionales.txt');
        
                    Promise.all([p4, p5]).then((values) => {
                        actualiarContabilidadEnc(connection, idContabilidadEnc).then(() => {
                            obtenerPathSalida(connection)
                                .then( pathSalida => {
                                    generarTxtContabilidad(pathSalida, values);
                                    resolve({data: `Se inició la generación contable para el presente proceso. Los archivos quedarán en la ruta ${pathSalida}`});
                                });
                        })
                    }).catch(err => {
                        reject(reason)
                    });

                })
                .catch(err => {
                    eliminarContabilidadEnc(connection, idContabilidadEnc);
                    reject(err);
                }))
            .catch(err => {
                eliminarContabilidadEnc(connection, idContabilidadEnc);
                reject(err);
            }))
        .catch(err => {
            eliminarContabilidadEnc(connection, idContabilidadEnc);
            reject(err);
        });
        // const p1 = guardarContabilidad(connection, idContabilidadEnc, usuario, 'fa_Contabilidad_Guardar');
        // const p2 = guardarContabilidad(connection, idContabilidadEnc, usuario, 'fa_ContabilidadSucursal_Guardar');
        // const p3 = guardarContabilidad(connection, idContabilidadEnc, usuario, 'fa_ContabilidadContrapartidas_Guardar');

    });
};

const actualiarContabilidadEnc = (connection, idContabilidadEnc) => {
    return new Promise((resolve, reject) => {
        new sql.Request(connection)
            .input('idContabilidadEnc', sql.Int, idContabilidadEnc)
            .execute('fa_ContabilidadEnc_actualizar').then(function(rs) {
                resolve();
        })
            .catch(err => reject(err))
    });
}

exports.Contabilidad= function(req, res){

    const idProceso = req.body.idProceso;
    const usuario = req.body.usuario;
    const idContabilidadEnc = req.body.idContabilidadEnc;

    const connection = new sql.Connection(process.config.sql, function(err) {
        if (idContabilidadEnc) {

            const p4 = obtenerContabilidad(connection, idContabilidadEnc, 'RobotCui.txt');
            const p5 = obtenerContabilidad(connection, idContabilidadEnc, 'RobotComisionesPagosPrevisionales.txt');

            Promise.all([p4, p5]).then((values) => {
                actualiarContabilidadEnc(connection, idContabilidadEnc).then(() => {
                    obtenerPathSalida(connection)
                        .then( pathSalida => {
                            generarTxtContabilidad(pathSalida, values);
                            res.json({data: `Los archivos quedarán en la ruta ${pathSalida}`});
                        });
                });
            }).catch(err => res.status(500).send(ErrorSQL.getError(err)));
        }
        else {

            guardarContabilidadEnc(connection, idProceso, usuario)
                .then(idContabilidadEnc => guardarContabilidades(connection, idContabilidadEnc, usuario))
                .then((result) => {res.json(result);})
                .catch(err =>  {
                    res.status(500).send(ErrorSQL.getError(err))
                })
        }
    });
};

exports.ObtenerContabilidadEnc = (req, res) => {
    const idProceso = req.query.idProceso;
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('idProceso', sql.Int, idProceso)
            .execute('fa_ContabilidadEnc_Obtener').then(function(recordset) {
                res.json(recordset[0][0]);
        }).catch(function(err) {
            res.status(500).send(ErrorSQL.getError(err))
        });
    });
};

var GenerarExcel = (function () {
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
        var styleStringRight;
        var styleStringLeft;


        var COLUMNS_NAMES={"Grupo":"GRUPO",
            "CUIL":"CUIL",
            "denominacionCuenta":"DENOMINACION DE LA CUENTA",
            "estadoCuenta":"ESTADO DE CUENTA",
            "fecFallecimiento":"FECHA DE FALLECIMIENTO (DDMMAAAA)",
            "periodoLiquidacion":"PERIODO DE LIQUIDACION",
            "periodoPago":"PERIODO DE PAGO",
            "nroCarga":"NUMERO DE CARGA	ARCHIVO",
            "archivo":"(NOMBRE ARCHIVO DE CARGA)",
            "EstadoFallecido":"ESTADO",
            "Motivo":"MOTIVO",
            "CPP":"CPP (NUMERO)",
            "nroBeneficio":"NUMERO DE BENEFICIO",
            "nomyApellido":"NOMBRE Y APELLIDO",
            "disponibleCuenta":"DISPONIBLE CTA",
            "saldoCuenta":"SALDO CUENTA",
            "importeLiquido":"IMPORTE LIQUIDO",
            "nroCuenta":"NUMERO DE CUENTA",
            "debitosAsociados":"PRESTAMOS Y/O DEBITOS ASOCIADOS",
            "causal304":"(CAUSALES Nｰ 304 - 361 - 1059 - 1380)	CAUSAL 304",
            "SucRadica":"SucRadica",
            "fecProceso":"FECHA PROCESO",
            "CantRecuperado":"Cant",
            "CantAnalizado":"Cant",
            "region":"Region",
            "cantidad recuperar":"Cant. Recuperar",
            "importe recuperar":"Importe Recuperar",
            "% recuperar":"% Recuperar",
            "cantidad analizar":"Cantidad Analizar",
            "importe analizar":"Importe Analizar",
            "% analizar":"% Analizar",
            "importe total":"Importe Total",
            "% total":"% Total"
        };


        this.createExcelData=function(data, nombreHojas, titles){
            //Creo la hoja segun lo solicitado
            for (i = 0; i < data.length/2; i++){
                var iTabla = i * 2; //0-1;2-3;4-5;6-7
                tablaTemporal = [];
                if(data[iTabla].length>0){
                    data[iTabla].forEach(function(row,index) {
                        tablaTemporal.push(_.values(row))
                    });
                    if (i == 0 || i == 1 || i == 2 || i == 3 || i == 4 ) {
                        data[iTabla + 1].forEach(function(row,index) {
                            tablaTemporal.push(_.values(row));
                        });
                    }

                    var vColumnNames=_.keys(data[iTabla][0]);
                    // Mapeo del nombre de las columnas.
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
                    bold: true
                }
            });
            styleRight = this.workbook.createStyle({
                alignment: {
                    wrapText: true,
                    horizontal: 'right'
                }
            });
            styleStringRight= this.workbook.createStyle({
                alignment: {
                    horizontal: 'right'
                }
            });
            styleStringLeft= this.workbook.createStyle({
                alignment: {
                    horizontal: 'left'
                }
            });
            styleNumber = this.workbook.createStyle({
                numberFormat: '#,##0.00; -#,##0.00; -'
            });

            var styleNull = this.workbook.createStyle({});


            for (var i= 0; i< sheets.length;i++ ) { // iterate sheets columns
                var inicioSegundaGrilla = 0;
                var item=sheets[i];
                //esto es solamenete porque debemos tener dos grillas en la misma página
                if (i == 1){
                    inicioSegundaGrilla = sheets[i-1].columns_data.length + 2;
                }
                else {
                    excel_file[item.config.name] = this.workbook.addWorksheet(item.config.name);
                    if (item.config.title){
                        // excel_file[item.config.name].cell(1,1).string('Banco Macro*****').style(styleHead);
                        excel_file[item.config.name].cell(2,3).string(item.config.title).style(styleHead);
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


                        if (item.columns_data[fila][colums]!=null){
                            var cell=excel_file[item.config.name].cell(fila + 1 + FILA_INICIO + inicioSegundaGrilla,colums + 1);
                            var data=item.columns_data[fila][colums];
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
                    cell.number(data).style(styleNumber);
                    break;
                case 'object':
                    if(data instanceof Date)
                    {
                        cell.date(data).style({ numberFormat: 'DD/MM/YYYY' });
                    }else{
                        cell.date(data.toString()).style(styleRight);
                    }
                    break;
                default:
                    cell.date("",data.toString()).style(styleRight);
            }



        }

        this.getFileNameRiesgoContingente=function(nombre, periodo){
            var separador="_";
            var sPeriodo = '';
            switch (periodo.substring(periodo.length-2)){
                case '01':
                    sPeriodo = 'ENE';
                    break;
                case '02':
                    sPeriodo = 'FEB';
                    break;
                case '03':
                    sPeriodo = 'MAR';
                    break;
                case '04':
                    sPeriodo = 'ABR';
                    break;
                case '05':
                    sPeriodo = 'MAY';
                    break;
                case '06':
                    sPeriodo = 'JUN';
                    break;
                case '07':
                    sPeriodo = 'JUL';
                    break;
                case '08':
                    sPeriodo = 'AGO';
                    break;
                case '09':
                    sPeriodo = 'SEP';
                    break;
                case '10':
                    sPeriodo = 'OCT';
                    break;
                case '11':
                    sPeriodo = 'NOV';
                    break;
                case '12':
                    sPeriodo = 'DIC';
                    break;
            }
            sPeriodo += periodo.substring(2, 4);
            return nombre + separador + sPeriodo + separador + moment(new Date).format('DDMMYYYY') + '.xlsx';
            //(((date.getDay()) <10) ? '0' : '') + date.getDay().toString() + (((date.getMonth() + 1) <10) ? '0' : '') + (date.getMonth() +1).toString() + date.getFullYear() + '.xlsx';
        }
    }
    return { Excel: Excel}
})();




/*
    ---------------------------------------------------------------------------------------
        Exportar fallecidos

        Es una copia de sucursales cobranzas
    ---------------------------------------------------------------------------------------
*/

module.exports.fallecidosPantallaExportar = function(req, res){
    var cc=new ExportarFallecidosPantalla(req, res);
    cc.init();
};


var ExportarFallecidosPantalla=function(req,res){
    var _this=this;

    var e= new require('../../utils/ExportExcel.js');
    var excelCobranza=new e.ExportarExcel();

    const sql = require('mssql');
    const MSSQLError = require('../../utils/MSSQLError.js');
    const ErrorSQL = new MSSQLError.MSSQLError();
    var proceso='Fallecidos - Lectura Cobis';
    var path_salida;
    var export_data;
    var fecha=null;

    this.obtenerFechaProceso=function(){
        return moment(_this.fechaProceso).utc().format('YYYYMMDDmmss');
    }

    this.obtenerPath=function(){

        var connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('proceso', sql.VarChar, proceso)
                .execute('dbo.procesoPasos_traerPorNombreProceso')
                .then(function (recordset) {
                    path_salida=recordset[0][0]['pathSalida'];
                    _this.obtenerDatos();
                })
                .catch(function (err) {
                    res.status(500).send(ErrorSQL.getError(err));
                });
        });
    }
    this.obtenerDatos=function(){
            var query;
            try{
                query=req.query
                if (query.fecha){
                    fecha= query.fecha.replace('Z',' ').replace('T',' ').substr(0, 10);
                    _this.fechaProceso=fecha;
                }else{
                    _this.fechaProceso=Date();
                }
            }catch(err) {
                res.status(500).send({ message: err.message });
            }
        try{

            var connection = new sql.Connection(process.config.sql, function(err) {

                new sql.Request(connection)
                    .input('fecha', sql.VarChar,typeof  fecha =='undefined' ?null:fecha )
                    .input('estado', sql.VarChar, typeof  query.estado=='undefined'?null:query.estado)
                    .input('estadoDataEntry', sql.VarChar,  typeof  query.estadoDataEntry=='undefined'?null:query.estadoDataEntry )
                    .input('nroCuenta', sql.VarChar,  (typeof  query.nroCuenta=='undefined' || query.nroCuenta=="")?null:query.nroCuenta )
                    .execute('dbo.fallecidos_traer_exportar').then(function(recordset) {
                        export_data=recordset;
                        _this.exportar();
                    }).catch(function(err) {
                        res.status(500).send(ErrorSQL.getError(err));
                    });


            })
    }catch(err) {
        res.status(500).send({ message: err.message });
    }
    }

    this.exportar=function(){
        try {
            columnsFormat={
                "SALDO CUENTA":        {format:"#,##0.00; (#,##0.00); 0",show:true, align:"right"},
                "DISPONIBLE CTA":      {format:"#,##0.00; (#,##0.00); 0",show:true, align:"right"},
                "IMP. BENEFICIO":      {format:"#,##0.00; (#,##0.00); 0",show:true, align:"right"},
                "DEBITOS ASOCIADOS":   {format:"#,##0.00; (#,##0.00); 0",show:true, align:"right"},
                "IMPORTEADEBITAR":   {format:"#,##0.00; (#,##0.00); 0",show:true, align:"right"}
            }

            var titulo=""
            if(fecha){
                titulo='Fallecidos  '+ fecha
            }else{
                titulo='Fallecidos '
            }
            var config = [
                {   titulo:titulo,
                    solapa:"Fallecidos",
                    columnsFormat:[columnsFormat]
                }
            ];

            excelCobranza.columnsFormat=[columnsFormat];
            excelCobranza.workbook = new excelNode.Workbook();
            excelCobranza.conTotales = 1;
            excelCobranza.getFileName=function(){
                var file="";
                var data=_this.obtenerFechaProceso();
                file= "Fallecidos_"+data+".xlsx";

                return file;
            }
            excelCobranza.path_file=path_salida;
            excelCobranza.createExcelData(export_data,config);
            excelCobranza.createSheet();
            excelCobranza.download(res);
        }catch(err) {
            res.status(500).send({ message: err.message });
        }
    }

    this.init=function(){
        this.obtenerPath();
    }

}


