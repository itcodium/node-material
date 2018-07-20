const sql = require('mssql');
const MSSQLError = require('../../utils/MSSQLError.js');
const ErrorSQL = new MSSQLError.MSSQLError();


var excelNode = require('excel4node');
var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');


module.exports.obtenerConciliacionCobranzas = function(req, res){
    const connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('moneda', sql.VarChar, req.query.moneda)
            .execute('dbo.conciliacionCobranzasTraer').then(function(recordsets) {
                console.log("recordsets",recordsets)
                res.json(recordsets);
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

module.exports.obtenerConciliacionCobranzasExportar = function(req, res){
    var cc=new ExportarCobranzas(req, res);
    cc.init();
};


module.exports.obtenerEntesExternos22 = function(req, res){
    const connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)

            .execute('dbo.entesExternos_ingresar').then(function(recordsets) {
                res.json(recordsets[0]);
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

module.exports.guardarEntesExternos = function(req, res){
    const entesExternos = req.body.entesExternos;
    const usuario = req.body.usuario;
    const connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('codentesExternosGrupos', sql.Int, entesExternos.codentesExternosGrupos)
            .input('codentesExternos', sql.Int, entesExternos.codentesExternos)
            .input('descripcion', sql.VarChar, entesExternos.descripcion)
            .input('usuario', sql.VarChar, usuario)
            .input('identesExternos', sql.Int, entesExternos.identesExternos)
            .execute('dbo.entesExternos_guardar').then(function(recordsets) {
                res.json({ok:true});
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

module.exports.bajaentesExternos = function(req, res){
    const entesExternos = req.query.entesExternos;
    const fecBaja = req.query.fecBaja;
    const usuario = req.query.usuario;
    const connection = new sql.Connection(process.config.sql, function(err) {
        new sql.Request(connection)
            .input('entesExternos', sql.VarChar, entesExternos)
            .input('fecBaja', sql.VarChar, fecBaja)
            .input('usuario', sql.VarChar, usuario)
            .execute('dbo.entesExternos_baja').then(function(recordsets) {
                res.json({ok:true});
            }).catch(function(err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};


/*


 */


var ExportarCobranzas=function(req,res){
    var _this=this;

    var e= new require('../../utils/ExportExcel.js');
    var excelCobranza=new e.ExportarExcel();

    const sql = require('mssql');
    const MSSQLError = require('../../utils/MSSQLError.js');
    const ErrorSQL = new MSSQLError.MSSQLError();
    var proceso='Conci. Conciliacion Cobranzas';
    var path_salida;
    var export_data;

    this.obtenerFechaProceso=function(){
        return moment(_this.fechaProceso).utc().format('YYYYMMDD');
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
        var connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('moneda', sql.VarChar, req.query.moneda)
                .input('exportar', sql.VarChar, req.query.exportar)
                .execute('dbo.conciliacionCobranzasTraer')
                .then(function (recordset) {
                    export_data=recordset;
                    _this.fechaProceso = new Date();
                    //_this.fechaProceso = (export_data[0].length > 0) ? export_data[0][0]["Fec Valor"] : null;
                    _this.exportar();
                })
                .catch(function (err) {
                    res.status(500).send(ErrorSQL.getError(err));
                });
        });
    }

    this.exportar=function(){
        try {
            // var hojas = [,];
            //  var titles = ['Titulo solapa 1','Titulo solapa 2']
            var fecha_carga=(_this.fechaProceso == null) ? '' : moment(_this.fechaProceso).utc().format('DD/MM/YYYY');

            m = (req.query.moneda.toUpperCase()=="PESOS") ? "Pesos" : "Dolares";

            var columnsFormat;
            if(m.toUpperCase()=="PESOS"){
                columnsFormat={
                    "Suc":      {format:"",show:true, align:"right"},
                    "Nombre":   {format:"",show:true, align:"left"},
                    "Debito":   {format:'#,##0.00; (#,##0.00); -',show:true} ,
                    "Credito":  {format:'#,##0.00; (#,##0.00); -',show:true} ,
                    "Neto":     {format:'#,##0.00; (#,##0.00); -',show:true} ,
                    "TotalATC": {format:'#,##0,00; (#,##0.00); -',show:true} ,
                    "Dif":      {format:'#,##0.00; (#,##0.00); -',show:true}
                }
            }
            if(m.toUpperCase()=="DOLARES"){
                columnsFormat={
                    "Suc":{format:"",show:true, align:"right"},
                    "Nombre":   {format:"",show:true, align:"left"},
                    "Debito":   {format:'#,##0.00; (#,##0.00); -',show:true} ,
                    "Credito":  {format:'#,##0.00; (#,##0.00); -',show:true} ,
                    "Neto":     {format:'#,##0.00; (#,##0.00); -',show:true} ,
                    "TotalATC": {format:'#,##0,00; (#,##0.00); -',show:true} ,
                    "Dif":      {format:'#,##0.00; (#,##0.00); -',show:true},
                    "DifPes":      {format:'#,##0.00; (#,##0.00); -',show:true}
                }
            }


            var config = [
                {   titulo:'Conciliación Cobranzas - Control Previo - ' + m.toUpperCase() + ' - Fecha: '+ fecha_carga,
                    solapa:m
                    // ,columnsFormat:[columnsFormat]
                }
            ];
            excelCobranza.columnsFormat=[columnsFormat];
            excelCobranza.workbook = new excelNode.Workbook();
            excelCobranza.conTotales = 1;
            excelCobranza.getFileName=function(){
                var file="";
                var data=_this.obtenerFechaProceso();
                var m="MONEDA";
                if(req.query.moneda.toUpperCase()=="PESOS"){
                    m="Pesos"
                }
                if(req.query.moneda.toUpperCase()=="DOLARES"){
                    m="Dolares"
                }
                file= "Control_Previo_"+m+"_"+data+".xlsx";

                return file;
            }

/*
            //La tabla siguiente debe ser exactamente igual a la actual
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

            excelCobranza.path_file=path_salida;
            excelCobranza.createExcelData(export_data,config);
            excelCobranza.createSheet();

            // res.json({ok:true});

            excelCobranza.download(res);
        }catch(err) {
            res.status(500).send({ message: err.message });
        }
    }

    this.init=function(){
        this.obtenerPath();
    }

}




