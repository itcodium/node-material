const sql = require('mssql');
const MSSQLError=require('../../utils/MSSQLError.js');
const ErrorSQL=new MSSQLError.MSSQLError();
const fs = require('fs');
const excelNode = require('excel4node');
const _ = require('underscore');

const initExportacion = (proceso) => {
    return new Promise(function (resolve, reject) {
        var connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('jobName', sql.VarChar, 'nm_ExportarExcelUnificado')
                .execute('dbo.Base_EjecutarJob')
                .then(() => resolve())
                .catch((err) =>{
                    reject(err);
                });
        });
    });
};

const setFiltrosExcel = (filters) => {
    return new Promise((resolve, reject) => {
        var connection = new sql.Connection(process.config.sql, function(err) {
            new sql.Request(connection)
                .input('fecProceso', sql.VarChar, filters.fecProceso)
                .input('tipoArchivo', sql.VarChar, filters.tipoArchivo)
                .input('nroCuenta', sql.VarChar, filters.nroCuenta)
                .input('nroTarjeta', sql.VarChar, filters.nroTarjeta)
                .input('tipoNovedad', sql.VarChar, filters.tipoNovedad)
                .execute('nmUnificadoReporte_SetFiltrosExcel').then(function(recordsets) {
                    resolve();
            }).catch(function(err) {
                    reject(err);
            });
        });
    });
};

const traerPathSalida = () => {
    return new Promise(function (resolve, reject) {
        var connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('proceso', sql.VarChar, 'Novedades Masivas Unif. Rta SO')
                .execute('dbo.procesoPasos_traerPorNombreProceso')
                .then((recordset) => resolve(recordset[0][0].pathSalida))
                .catch((err) =>{
                    reject(err);
                });
        });
    });
};

exports.getTarjetas = function(req, res){
    const filters = req.query;
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('fecProceso', sql.VarChar, filters.fecProceso)
            .input('tipoArchivo', sql.VarChar, 'TARJETA')
            .input('nroCuenta', sql.VarChar, filters.nroCuenta)
            .input('nroTarjeta', sql.VarChar, filters.nroTarjeta)
            .input('tipoNovedad', sql.VarChar, filters.tipoNovedad)
            .execute('nmUnificadoReporte_Tarjeta').then(function(recordsets) {
                res.json(recordsets[0]);
            }).catch(function(err) {
                res.json(err);
            });
    });
};

exports.getTipoNovedades = (req, res) => {
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .execute('nmUnificadoReporte_ObtenerTipoNovedades').then(function(recordsets) {
            res.json(recordsets[0]);
        }).catch(function(err) {
            res.json(err);
        });
    });
};

exports.getMaxFecProceso = (req, res) => {
    var connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('tipoArchivo', sql.VarChar, req.query.tipoArchivo)
            .execute('nmUnificadoReporte_ObtenerFecProceso').then(function(recordsets) {
            res.json(recordsets[0]);
        }).catch(function(err) {
            res.json(err);
        });
    });
};

exports.getExcel = (req, res) => {
    setFiltrosExcel(req.query)
        .then(initExportacion)
        .then(traerPathSalida)
        .then((pathSalida)=> res.json({"message":"Se está  exportando el archivo, puede descargarlo desde "+ pathSalida}))
        .catch(err => {
            res.json(err);
        });
};