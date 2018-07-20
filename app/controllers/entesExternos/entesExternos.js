const sql = require('mssql');
const MSSQLError = require('../../utils/MSSQLError.js');
const ErrorSQL = new MSSQLError.MSSQLError();
const excelNode = require('excel4node');
const fs = require('fs');
const _ = require('underscore');
const mail = require('../email/email.js');
const moment = require('moment');

const traerEntesExternos = (esComision, fecDesde, fecHasta) => {
    return new Promise((resolve, reject) => {
        const connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('esComision', sql.VarChar, esComision)
                .input('fecDesde', sql.VarChar, fecDesde)
                .input('fecHasta', sql.VarChar, fecHasta)
                .execute('dbo.entesExternosTraer').then(function (recordsets) {
                    resolve(recordsets);
                }).catch(function (err) {
                    reject(err);
                });
        });
    });
};


const traerEntesExternosAjustesMail = (fecDesde, fecHasta) => {
    return new Promise(function (resolve, reject) {
        var connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('fecDesde', sql.VarChar, fecDesde)
                .input('fecHasta', sql.VarChar, fecHasta)
                .execute('dbo.repo_entesExternosAjustes_mail')
                .then((recordsets) => {
                    resolve(recordsets[0]);
                }).catch((err) => {
                    reject(err);
                });
        });
    });
};


const traerEntesExternosExcel = (esComision, fecDesde, fecHasta) => {
    return new Promise((resolve, reject) => {
        const connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('fecDesde', sql.VarChar, fecDesde)
                .input('fecHasta', sql.VarChar, fecHasta)
                .execute((esComision ? 'dbo.repo_entesExternosComisiones' : 'dbo.repo_entesExternosAjustes'))
                .then(function (recordsets) {
                    resolve(recordsets);
                }).catch(function (err) {
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
                .then((recordset) => resolve(recordset[0][0].pathSalida))
                .catch((err) => {
                    reject(err);
                });
        });
    });
};

const obtenerEntestExternosTxt = (fecDesde, fecHasta) => {
    return new Promise((resolve, reject) => {
        const connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('fecDesde', sql.VarChar, fecDesde)
                .input('fecHasta', sql.VarChar, fecHasta)
                .execute('dbo.txt_entesExternosAjustes').then(function (recordsets) {
                    resolve(recordsets[0]);
                }).catch(function (err) {
                    reject(err);
                });
        });
    });
};

const generarArchivoTxt = (res) => {
    const getMarca = (entidad) => {
        switch (entidad) {
            case 67:
            case 667:
                return 2;
            case 90:
            case 91:
                return 1;
            default:
                return 1;
        }
    };
    const dateFormatted = (date, format) => {
        let mm = date.getMonth() + 1; // getMonth() is zero-based
        let dd = date.getDate();

        if (format == 'yyyymmddd') {
            return [date.getFullYear(),
                (mm > 9 ? '' : '0') + mm,
                (dd > 9 ? '' : '0') + dd
            ].join('');
        } else {
            return [(dd > 9 ? '' : '0') + dd,
                (mm > 9 ? '' : '0') + mm,
                date.getFullYear()
            ].join('');
        }
    };
    return new Promise((resolve, reject) => {
        const ajustes = res[0];
        const pathSalida = res[1];
        const fileName = `Aj_EntesExternos_ENT_${dateFormatted(new Date(),'yyyymmdd')}.txt`;

        let count = 0;
        if (ajustes.length > 0) {
            try {
                let txt = '';
                ajustes.forEach(function (ajuste) {
                    count++;
                    comprobante = count.toString().padStart(6, '0');
                    txt += `${getMarca(ajuste.entidad)}${ajuste.nroCuenta.toString().padStart(10,'0')}${moment(ajuste.fecCobranza).format('DDMMYYYY')}`;
                    txt += `${ajuste.codAjuste.toString().padStart(4,'0')}${ajuste.impAjuste.toString().split('.')[0].padStart(13,'0')}`;
                    txt += `${ajuste.impAjuste.toString().split('.')[1].padStart(2,'0')}11${comprobante}\r\n`;
                }, this);
                fs.writeFile(pathSalida + fileName, txt, {
                    encoding: 'utf8',
                    flag: 'w+'
                }, (err) => {
                    if (err) {
                        reject(err);
                    }
                    resolve({
                        name: fileName,
                        data: txt,
                        path: pathSalida + fileName
                    });
                });
            } catch (e) {
                reject(e);
            }
        }
    });
};


function Excel() {
    var _this = this;
    this.templateHtml = "";
    this.templateHtmlM = "";
    this.pathRecibidos = "";
    this.rutasArchivosGenerados = [];
    this.workbook = undefined;

    var sheets = [];
    var tablaTemporal = [];
    var excel_file = {};

    var FILA_INICIO = 4;
    var styleNumber;
    var styleRight;
    var styleHead;
    var styleTitulo;
    var styleSubTitulo;

    var styleStringRight;
    var styleStringLeft;
    var styleStringRightDate;


    var COLUMNS_NAMES = {
        "ColumnaDeTabla": "NombreColumnaEnArchivo"
    };

    this.createExcelData = function (data, nombreHojas, titles) {
        for (i = 0; i < data.length; i++) {
            var iTabla = i;
            tablaTemporal = [];
            if (data[i].length > 0) {
                data[i].forEach((row, index) => {
                    tablaTemporal.push(_.values(row));
                });
                var vColumnNames = _.keys(data[iTabla][0]);
                for (var xx = 0; xx < vColumnNames.length; xx++) {
                    vColumnNames[xx] = (typeof COLUMNS_NAMES[vColumnNames[xx]] == 'undefined') ? vColumnNames[xx] : COLUMNS_NAMES[vColumnNames[xx]];
                }
                sheets.push({
                    config: {
                        name: nombreHojas[i],
                        title: titles[i]
                    },
                    columns_name: vColumnNames,
                    columns_data: tablaTemporal
                });
            }
        }
    };

    this.createSheet = function () {

        styleHead = this.workbook.createStyle({
            font: {
                bold: true,
                name: 'Tahoma',
                size: 9
            }
        });


        styleTitulo = this.workbook.createStyle({
            font: {
                bold: true,
                name: 'Tahoma',
                size: 12
            }
        });
        styleSubTitulo = this.workbook.createStyle({
            font: {
                bold: true,
                name: 'Tahoma',
                size: 11
            }
        });

        styleRight = this.workbook.createStyle({
            alignment: {
                wrapText: true,
                horizontal: 'right'
            },
            font: {
                name: 'Tahoma',
                size: 11
            }
        });
        styleStringRight = this.workbook.createStyle({
            alignment: {
                horizontal: 'right'
            },
            font: {
                name: 'Tahoma',
                size: 11
            }
        });

        styleStringRightDate = this.workbook.createStyle({
            numberFormat: 'DD/MM/YYYY',
            alignment: {
                horizontal: 'right'
            },
            font: {
                name: 'Tahoma',
                size: 9
            }
        });

        styleStringLeft = this.workbook.createStyle({
            alignment: {
                horizontal: 'left'
            },
            font: {
                name: 'Tahoma',
                size: 9
            }
        });
        styleNumberDecimal = this.workbook.createStyle({
            numberFormat: '#,##0.00; (#,##0.00); 0',
            font: {
                name: 'Tahoma',
                size: 9
            }
        });

        styleNumberInteger = this.workbook.createStyle({
            font: {
                name: 'Tahoma',
                size: 9
            }
        });

        var styleNull = this.workbook.createStyle({
            font: {
                name: 'Tahoma',
                size: 11
            }
        });

        const StyleByColumn = {
            Imp_Ajuste: styleNumberDecimal,
            Importe: styleNumberDecimal,
            Comision: styleNumberDecimal
        };


        for (var i = 0; i < sheets.length; i++) { // iterate sheets columns

            var inicioSegundaGrilla = 0;
            var item = sheets[i];

            //esto es solamenete porque debemos tener dos grillas en la misma pagina
            if (i == 1) {
                inicioSegundaGrilla = sheets[i - 1].columns_data.length + 2;
            } else {
                excel_file[item.config.name] = this.workbook.addWorksheet(item.config.name);
                if (item.config.title) {
                    excel_file[item.config.name].cell(1, 1).string('Banco MACRO SA').style(styleTitulo);
                    excel_file[item.config.name].cell(2, 1).string(item.config.title).style(styleSubTitulo);
                }
            }

            for (var col = 0; col < item.columns_name.length; col++) { // iterate sheets columns
                if (item.columns_name[col] instanceof Date) {
                    excel_file[item.config.name].cell(FILA_INICIO + inicioSegundaGrilla, col + 1).string(moment(item.columns_name[col]).utc().toString()).style(styleHead);
                } else {
                    excel_file[item.config.name].cell(FILA_INICIO + inicioSegundaGrilla, col + 1).string(item.columns_name[col].toString()).style(styleHead);
                }
            }

            // llenar datos
            for (var colums = 0; colums < item.columns_name.length; colums++) {
                for (var fila = 0; fila < item.columns_data.length; fila++) {

                    if (item.columns_data[fila][colums] != null) {
                        var cell = excel_file[item.config.name].cell(fila + 1 + FILA_INICIO + inicioSegundaGrilla, colums + 1);
                        var data = item.columns_data[fila][colums];
                        _this.getAddColumn(cell, data, StyleByColumn[item.columns_name[colums]]);
                    }
                }
            }
        }
    };

    this.getAddColumn = function (cell, data, styleCell) {
        if (styleCell) {
            cell.number(data).style(styleCell);
        } else {
            switch (typeof data) {
                case 'string':
                    if (Number.isNaN(parseInt(data)))
                        cell.string(data.toString()).style(styleStringLeft);
                    else
                        cell.number(parseInt(data)).style(styleNumberInteger);
                    break;
                case 'number':
                    if (Number.isInteger(data)) {
                        cell.number(data).style(styleNumberInteger);
                    } else {
                        cell.number(data).style(styleNumberDecimal);
                    }
                    break;
                case 'object':
                    if (data instanceof Date) {
                        cell.date(data).style(styleStringRightDate);
                    } else {
                        cell.date(data.toString()).style(styleRight);
                    }
                    break;
                default:
                    cell.date("", data.toString()).style(styleRight);
            }
        }
    };
}


function getDataMail() {
    return new Promise((resolve, reject) => {
        const connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('codigo', sql.VarChar, 'CO-EE-AJUSTES')
                .execute('dbo.mailsConfigurables_TraerPorCodigo').then(function (recordsets) {
                    resolve(recordsets[0]);
                }).catch(function (err) {
                    reject(err);
                });
        });
    });
}


var crearTabla = function (data) {
    var filesHtml = "";
    filesHtml = '<table cellspacing="1" cellpadding="7" border="1" style="font-family:tahoma;font-size:12px;padding:5px;">';
    filesHtml = filesHtml + '<tr style="border:0;background-color: darkgray">    \
                  <th style="border:1px solid #000">Ent</th>\
                  <th style="border:1px solid #000">Nombre</th>\
                  <th style="border:1px solid #000">Fec_Ajuste</th>\
                  <th style="border:1px solid #000">Cant</th>\
                  <th style="border:1px solid #000">Total</th>  \
               </tr> ';
    var Cant = 0;
    var Total = 0;

    data.forEach(function (item) {
        filesHtml = filesHtml + '<tr style="border:1"><td>' + item.Ent.toString() + '</td><td>' + item.Nombre + '</td><td>' + moment(item.Fec_Ajuste).utc().format("DD/MM/YYYY") + '</td><td align="right">' + item.Cant.toString() + '</td><td align="right">' + formatNumber(item.Total, ',', '.') + '</td></tr>';
        Cant = Cant + item.Cant;
        Total = Total + item.Total;
    });
    filesHtml = filesHtml + '<tr style="border:1"><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td align="right">' + Cant.toString() + '</td><td align="right">' + formatNumber(Math.round(Total * 100) / 100, ',', '.') + '</td></tr>';
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
                mailConfig.cuerpo, {
                    filename: mailConfig.nombreArchivo,
                    path: mailConfig.archivosAdjuntos
                }
            );
        } catch (e) {
            reject(e);
        }
    });
}

module.exports.obtenerEntesExternos = function (req, res) {
    traerEntesExternos(req.query.esComision, req.query.fechaDesde, req.query.fechaHasta)
        .then(result => res.json(result))
        .catch(err => res.status(500).send(ErrorSQL.getError(err)));
};

module.exports.generarAjusteMail = function (req, res) {

    console.log("test", "generarAjusteMail")
    const fecDesde = req.query.fechaDesde;
    const fecHasta = req.query.fechaHasta;
    let p1 = obtenerEntestExternosTxt(fecDesde, fecHasta);
    let p2 = traerPathSalida('Conci. Entes Externos');
    let p3 = traerEntesExternosAjustesMail(fecDesde, fecHasta);

    Promise.all([p1, p2])
        .then((result) => {
            Promise.all([generarArchivoTxt(result), getDataMail(), p3])
                .then(values => {
                    let configMail = values[1][0];
                    var tData = crearTabla(values[2]);
                    configMail.cuerpo = configMail.cuerpo.replace(/@TABLA/i, "" + tData + "");
                    if (values[2].length > 0) {
                        var fechaProcesamiento = moment(values[2][0].fechaProcesamiento).utc().format("DD/MM/YYYY")
                        configMail.cuerpo = configMail.cuerpo.replace(/@fecProcesamiento/i, "" + fechaProcesamiento + "");
                        configMail.asunto = configMail.asunto.replace(/@fecProcesamiento/i, "" + fechaProcesamiento + "");
                    }
                    configMail.archivosAdjuntos = values[0].path;
                    configMail.nombreArchivo = values[0].name;
                    sendMail(configMail).then(() => res.json(values[0]));
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        })
        .catch(err => {
            res.status(500).send(err);
        });
};

module.exports.guardarEntesExternos = function (req, res) {
    const entesExternos = req.body.entesExternos;
    const usuario = req.body.usuario;
    const connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('codentesExternosGrupos', sql.Int, entesExternos.codentesExternosGrupos)
            .input('codentesExternos', sql.Int, entesExternos.codentesExternos)
            .input('descripcion', sql.VarChar, entesExternos.descripcion)
            .input('usuario', sql.VarChar, usuario)
            .input('identesExternos', sql.Int, entesExternos.identesExternos)
            .execute('dbo.entesExternos_guardar').then(function (recordsets) {
                res.json({
                    ok: true
                });
            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

module.exports.bajaentesExternos = function (req, res) {
    const entesExternos = req.query.entesExternos;
    const fecBaja = req.query.fecBaja;
    const usuario = req.query.usuario;
    const connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('entesExternos', sql.VarChar, entesExternos)
            .input('fecBaja', sql.VarChar, fecBaja)
            .input('usuario', sql.VarChar, usuario)
            .execute('dbo.entesExternos_baja').then(function (recordsets) {
                res.json({
                    ok: true
                });
            }).catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

module.exports.exportarExcel = (req, res) => {

    const formattedDate = (d, format, separator = '/') => {
        function pad(s) {
            return (s < 10) ? '0' + s : s;
        }

        let dateFormatted;
        switch (format) {
            case 'aaaammdd':
                dateFormatted = [d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join(separator);
                break;
            default:
                dateFormatted = [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join(separator);
                break;
        }
        return dateFormatted;
    };

    const getFileName = (nombre, desde, hasta) => {
        return `${nombre}_${desde}_al_${hasta}.xlsx`;
    };

    const fecDesde = req.query.fechaDesde;
    const fecHasta = req.query.fechaHasta;
    const esComision = req.query.esComision == 1;

    const p1 = traerEntesExternosExcel(esComision, fecDesde, fecHasta);
    const p2 = traerPathSalida('Conci. Entes Externos');

    Promise.all([p1, p2]).then(values => {
            const entesExternosData = values[0];
            const path = values[1];

            fs.stat(path, function (err, stats) {
                if (err) {
                    res.status(500).send(ErrorSQL.getError(new Error("No existe el directorio: " + path)));
                }
                const excel = new Excel();

                const fechasData = entesExternosData[0].map(x => moment(x.Fec_Cobranza).local());
                const fechaDesde = fecDesde ? moment(fecDesde) : moment.min(fechasData);
                const fechaHasta = fecHasta ? moment(fecHasta) : moment.max(fechasData);

                let tituloFechaDesde = fechaDesde.format('YYYYMMDD');
                let tituloFechaHasta = fechaHasta.format('YYYYMMDD');
                const file = getFileName((esComision ? 'Cob_EntesExternos' : 'Aju_EntesExternos'), tituloFechaDesde, tituloFechaHasta);

                var fullPathFile = path + file;

                excel.workbook = new excelNode.Workbook();

                var hojas = [
                    'Hoja1'
                ];

                tituloFechaDesde = fechaDesde.format('DD/MM/YYYY');
                tituloFechaHasta = fechaHasta.format('DD/MM/YYYY');

                const tituloExcel = `${esComision? 'Cobranzas Procesadas': 'Ajustes Cobrados'} desde: ${tituloFechaDesde} al ${tituloFechaHasta}`;
                const titles = [tituloExcel];

                entesExternosData[0] = entesExternosData[0].map(x => {
                    if (esComision) {
                        x.Fec_Proceso = moment(x.Fec_Proceso).toDate();
                        x.Fec_Generacion = moment(x.Fec_Generacion).toDate();
                    } else {
                        x.Fec_Ajuste = moment(x.Fec_Ajuste).toDate();
                    }
                    x.Fec_Cobranza = moment(x.Fec_Cobranza).toDate();
                    return x;
                });

                excel.createExcelData(entesExternosData, hojas, titles);
                excel.createSheet();

                excel.workbook.write(fullPathFile, function (err, status) {
                    if (err) {
                        res.status(500).send({
                            error: "error al crear excel"
                        });
                    } else {
                        res.setHeader('Content-disposition', 'attachment; filename=' + file);
                        res.setHeader('Content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
                        var filestream = fs.createReadStream(fullPathFile);
                        filestream.pipe(res);
                    }
                });

            });
        })
        .catch(err => res.status(500).send(ErrorSQL.getError(err)));
};

function formatNumber(nro, mil, decimal) {
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