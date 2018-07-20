var MSSQLError = require('../../utils/MSSQLError.js');
var ErrorSQL = new MSSQLError.MSSQLError();
var sql = require('mssql');
var fs = require('fs');
var json2csv = require('json2csv');
var moment = require('moment');
var mail = require('../email/email.js');
var reportes = require('../reportes/reportes.js');
var BlueBirdPromise = require('bluebird');

exports.traer = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection).execute('dbo.campanias_traer')
            .then(function (resp) {
                res.jsonp(resp[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.alta = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('codigo', sql.VarChar, req.body.codigo)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('esEmpresa', sql.Bit, req.body.esEmpresa)
            .input('usuario', sql.VarChar, req.body.creadoPor)
            .execute('dbo.campanias_insertar')
            .then(function (resp) {
                res.json(resp[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.modificacion = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('codigo', sql.VarChar, req.params.codigo)
            .input('descripcion', sql.VarChar, req.body.descripcion)
            .input('esEmpresa', sql.Bit, req.body.esEmpresa)
            .input('usuario', sql.VarChar, req.body.modificadoPor)
            .execute('dbo.campanias_modificar')
            .then(function (resp) {
                res.json(resp[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

exports.baja = function (req, res) {
    var connection = new sql.Connection(process.config.sql, function (err) {
        new sql.Request(connection)
            .input('codigo', sql.VarChar, req.params.codigo)
            .input('fecBaja', sql.DateTime2, req.body.fecBaja)
            .input('usuario', sql.VarChar, req.body.modificadoPor)
            .execute('dbo.campanias_borrar')
            .then(function (resp) {
                res.json(resp[0]);
            })
            .catch(function (err) {
                res.status(500).send(ErrorSQL.getError(err));
            });
    });
};

function getCampaniasMail (req) {
    return new Promise(function (resolve, reject) {
        var connection = new sql.Connection(process.config.sql, function (err) {
            new sql.Request(connection)
                .input('codigo', sql.VarChar, 'CMP-REPORTE-CIERRE')
                .execute('dbo.repo_campaniasMail')
                .then(function (data) {
                    if(data[0].length === 0) {
                        reject('Mail no configurado');
                    }
                    resolve({
                        pathSalida: data[1][0].pathSalida,
                        attachment: req.query.descripcion +
                        ' cierre ' + moment.utc(req.query.fechaHasta).format('YYYYMMDD') + '.xlsx',
                        asunto: data[0][0].asunto.replace('@descCampania', req.query.descripcion)
                            .replace('@fecha', moment.utc(req.query.fechaHasta).format('DD/MM/YYYY')),
                        cuerpo: data[0][0].cuerpo.replace('@descCampania', req.query.descripcion)
                            .replace('@fecha', moment.utc(req.query.fechaHasta).format('DD/MM/YYYY'))
                            .replace('@fcierreDesc', req.query.fcierreDesc)
                            .replace('@nombreUsuario', req.query.nombreUsuario),
                        para: data[0][0].para,
                        copia: data[0][0].copia,
                        copiaOculta: data[0][0].copiaOculta
                    });
                })
                .catch(function (err) {
                    reject(ErrorSQL.getError(err).message);
                });
        });
    });
}

function writeFile (data) {
    return new Promise(function (resolve, reject) {
        if (!data[0].pathSalida) {
            reject('Debe configurarse el parámetro PathSalida del proceso Seguimiento Campañas - Novacep')
        }
        fs.writeFile(data[0].pathSalida + data[0].attachment, data[1], function (err) {
            if (err) {
                reject(err.message);
            }
            resolve(data[0]);
        });
    });
}

function sendMail (mailConfig) {
    return new Promise(function (resolve, reject) {
        try {
            var email = new mail.Email();
            email.set_callback(function (error) {
                if (error) {
                    reject('Hubo un error al enviar el mail. Verifique configuración');
                }
                resolve()
            });
            console.log(mailConfig);
            email.send(
                mailConfig.para,
                mailConfig.copia,
                mailConfig.asunto,
                mailConfig.cuerpo,
                {
                    filename: mailConfig.attachment,
                    path: mailConfig.pathSalida + mailConfig.attachment
                }
            );
        } catch (e) {
            reject(e.message);
        }
    });
}

exports.envioMailCampaniasPorCierre = function (req, res) {
    BlueBirdPromise.all([getCampaniasMail(req), reportes.reporteCampaniasPorCierreDetalleArchivoMail(req)])
        .then(writeFile)
        .then(sendMail)
        .then(function () {
            res.jsonp([]);
        })
        .catch(function (err) {
            res.status(500).send({ message: err });
        });
};