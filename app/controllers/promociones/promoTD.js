/**
 * Created by cristian.ovando on 17/08/2017.
 */
const sql = require('mssql');
const MSSQLError = require('../../utils/MSSQLError.js');
const ErrorSQL = new MSSQLError.MSSQLError();
const excel = require('node-excel-export');
const moment = require('moment');

const guardarProceso = (archivos, usuario) => {
    return new Promise(( resolve, reject ) => {
        let connection = new sql.Connection(process.config.sql, function(err) {
            new sql.Request(connection)
                .input('usuario', sql.NVarChar, usuario)
                .execute('promoArchivosTD_GuardarProceso')
                .then( recordset => {
                    resolve(recordset[0][0].idProceso);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    });
};

const asociarArchivos = (idProceso, archivos, usuario) => {
    return new Promise((resolve, reject) => {
        let connection = new sql.Connection(process.config.sql, function(err) {
            const table = new sql.Table('vi_promoTDAsociacion')
            table.create = false
            table.columns.add('IdProceso', sql.Int, {nullable: false})
            table.columns.add('CodPromo', sql.VarChar(3), {nullable: false})
            table.columns.add('VigenciaHasta', sql.Date, {nullable: false})
            table.columns.add('NombreArchivo', sql.VarChar(100), {nullable: false})
            table.columns.add('FecCreacion', sql.Date, {nullable: false})
            table.columns.add('CreadoPor', sql.VarChar(50), {nullable: false})
            for (archivo of archivos) {
                table.rows.add(idProceso, archivo.Promo, 
                    moment(archivo.VigenciaHasta).toDate(),archivo.Archivo,
                    new Date, usuario)
            }

            const request = new sql.Request(connection)
            request.bulk(table, (err, result) => {
                if(err) reject(err);

                resolve(result);
            })
        });
    })
}

const obtenerArchivosExportar = (idProceso) => {
    return new Promise(( resolve, reject ) => {
        let connection = new sql.Connection(process.config.sql, function(err) {
            new sql.Request(connection)
            .input('idProceso', sql.Int, idProceso)
            .execute('promoTD_ObtenerExportar')
            .then( recordset => {
                resolve(recordset);
            })
            .catch(function(err) {
                reject(err);
            });
        });
    });
};

const traerPathSalida = () => {
    return new Promise(function (resolve, reject) {
        var connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('proceso', sql.VarChar, 'Promo TD Respuesta VI')
                .execute('dbo.procesoPasos_traerPorNombreProceso')
                .then((recordset) => resolve(recordset[0][0].pathSalida))
                .catch((err) =>{
                    reject(err);
                });
        });
    });
};

const initExportacion = (proceso) => {
    return new Promise(function (resolve, reject) {
        var connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('jobName', sql.VarChar, 'vi_promoTDArchivoGenerar')
                .execute('dbo.Base_EjecutarJob')
                .then(() => resolve())
                .catch((err) =>{
                    reject(err);
                });
        });
    });
};

exports.ObtenerArchivos = function(req, res){
    let asociadas = req.query.asociadas == null? false : req.query.asociadas;
    let connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .execute( asociadas? 'promoArchivosTD_Asociados_traer' : 'promoArchivosTD_traer')
            .then( recordset => { res.jsonp(recordset) })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.ObtenerPromociones = function (req, res) {
    let connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('tipo', sql.NVarChar, 'TD')
            .input('banca', sql.NVarChar, 'INDIVIDUOS')
            .input('fechaactual', sql.DateTime, new Date())
            .execute('promociones_traer')
            .then( recordset => { res.jsonp(recordset) })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.GenerarArchivo = function(req, res){
    let archivos = req.body.archivos;
    let usuario = req.body.usuario;
    guardarProceso(archivos, usuario)
        .then(idProceso => asociarArchivos(idProceso, archivos, usuario))
        .then(initExportacion)
        .then(traerPathSalida)
        .then((pathSalida)=> res.json({"message":"Se está  generando el archivo, revise la ruta en 5 minutos. " + pathSalida}))
        .catch(err => {
            res.status(500).send(ErrorSQL.getError(err));
        })
};

exports.ObtenerArchivosAsignados = function(req, res){
    const fecDesde = req.query.fecDesde || null;
    const fecHasta = req.query.fecHasta || null;

    let connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('FechaDesde', sql.VarChar, fecDesde)
            .input('FechaHasta', sql.VarChar, fecHasta)
            .execute('promoTD_traerProcesosSumariza')
            .then( recordset => { res.jsonp(recordset) })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.ObtenerPromoTarjetas = function(req, res){
    let connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('nroTarjeta', sql.VarChar, req.query.nroTarjeta)
            .execute('promoTD_traerFiltro')
            .then( recordset => { res.jsonp(recordset) })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.ObtenerPadronTD = function(req, res){
    let connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('nroTarjeta', sql.VarChar, req.query.nroTarjeta)
            .execute('promoTD_traerPadron')
            .then( recordset => { res.jsonp(recordset) })
            .catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.ExportarExcel = function(req, res){
    const excelReport = new Excel();
//Here you specify the export structure
    const specificationPromoMacro = {
        Ent: { // <- the key should match the actual data key
            displayName: 'Ent',
            headerStyle: excelReport.styles.headerTahoma,
            cellStyle: excelReport.styles.cellGrid,
            width: 50 // <- width in pixels
        },
        FecProceso: {
            displayName: 'Fec.Proceso',
            headerStyle: excelReport.styles.headerTahoma,
            cellStyle: excelReport.styles.cellDate,
            width: 100 // <- width in chars (when the number is passed as string)
        },
        CodPromo: {
            displayName: 'Cod',
            headerStyle: excelReport.styles.headerTahoma,
            cellStyle: excelReport.styles.cellGrid,
            width: 50 // <- width in pixels
        },
        VigenciaDesde: {
            displayName: 'Fec.Desde',
            headerStyle: excelReport.styles.headerTahoma,
            cellStyle: excelReport.styles.cellDate,
            width: 100 // <- width in pixels
        },
        VigenciaHasta: {
            displayName: 'Fec.Hasta',
            headerStyle: excelReport.styles.headerTahoma,
            cellStyle: excelReport.styles.cellDate,
            width: 100 // <- width in pixels
        },
        DescrErrorVisa: {
            displayName: 'Error',
            headerStyle: excelReport.styles.headerTahoma,
            cellStyle: excelReport.styles.cellGrid,
            width: 220 // <- width in pixels
        }
    };

    const specificationPadronVisa = {
        NroTarjeta: { // <- the key should match the actual data key
            displayName: 'Nro.TD',
            headerStyle: excelReport.styles.headerTahoma,
            cellStyle: excelReport.styles.cellBigInt,
            width: 120
        },
        CodPromo: {
            displayName: 'Cod',
            headerStyle: excelReport.styles.headerTahoma,
            cellStyle: excelReport.styles.cellDate,
            width: 50 // <- width in chars (when the number is passed as string)
        },
        Segmento: {
            displayName: 'Segm',
            headerStyle: excelReport.styles.headerTahoma,
            cellStyle: excelReport.styles.cellGrid,
            cellFormat: (value, row) => {
                return (Number.isInteger(Number(value))) ? Number(value): value;
            },
            width: 50 // <- width in pixels
        },
        VigenciaDesde: {
            displayName: 'Fec.Desde',
            headerStyle: excelReport.styles.headerTahoma,
            cellStyle: excelReport.styles.cellDate,
            width: 100 // <- width in pixels
        },
        VigenciaHasta: {
            displayName: 'Fec.Hasta',
            headerStyle: excelReport.styles.headerTahoma,
            cellStyle: excelReport.styles.cellDate,
            width: 100 // <- width in pixels
        }
    };

    const dataset = [];
    req.body.promoMacro.forEach((element) => {
        dataset.push({
            Ent: element.Entidad,
            FecProceso: new Date(element.FecProceso),
            CodPromo: element.CodPromo,
            VigenciaDesde: element.VigenciaDesde ? new Date(element.VigenciaDesde): element.VigenciaDesde,
            VigenciaHasta: new Date(element.VigenciaHasta),
            DescrErrorVisa: element.DescrErrorVisa
        });
    });

    const datasetPadron = [];
    req.body.padronVisa.forEach((element) => {
        datasetPadron.push({
            NroTarjeta: element.NroTarjeta,
            CodPromo: element.CodPromo,
            Segmento: element.Segmento,
            VigenciaDesde: new Date(element.FecVigenciaDesde),
            VigenciaHasta: new Date(element.FecVigenciaHasta)
        });
    });

// Create the excel report.
// This function will return Buffer
    const report = excel.buildExport(
        [ // <- Notice that this is an array. Pass multiple sheets to create multi sheet report
            {
                name: 'Promo Banco MACRO', // <- Specify sheet name (optional)
                heading: [], // <- Raw heading array (optional)
                merges: [], // <- Merge cell ranges
                specification: specificationPromoMacro, // <- Report specification
                data: dataset // <-- Report data
            },
            {
                name: 'Padrón VISA', // <- Specify sheet name (optional)
                heading: [], // <- Raw heading array (optional)
                merges: [], // <- Merge cell ranges
                specification: specificationPadronVisa, // <- Report specification
                data: datasetPadron // <-- Report data
            }
        ]
    );

// You can then return this straight
    res.attachment('report.xlsx'); // This is sails.js specific (in general you need to set headers)
    return res.send(report);
};

function Excel() {
    // You can define styles as json object
// More info: https://github.com/protobi/js-xlsx#cell-styles
    const styles = {
        headerTahoma: {
            font: {
                color: {
                    rgb: '000000'
                },
                sz: 9,
                bold: true,
                name: 'Tahoma'
            }
        },
        cellGrid: {
            font: {
                color: {
                    rgb: '000000'
                },
                sz: 9,
                bold: false,
                name: 'Tahoma'
            }
        },
        cellDate: {
            font: {
                color: {
                    rgb: '000000'
                },
                sz: 9,
                bold: false,
                name: 'Tahoma'
            },
            numFmt: 'dd/mm/yyyy'
        },
        cellBigInt: {
            font: {
                color: {
                    rgb: '000000'
                },
                sz: 9,
                bold: false,
                name: 'Tahoma'
            },
            numFmt: 0,
            alignment: {
                horizontal: 'right'
            }
        },
    };

    return {
        styles: styles
    }
}