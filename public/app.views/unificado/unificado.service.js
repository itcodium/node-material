(function () {
    'use strict';

    angular
        .module('app')
        .service('UnificadoService', UnificadoService);

    function UnificadoService ($http, Global) {
        const URL_TIPONOVEDADES = '/api/unificado/tipoNovedades';
        const URL_FECPROCESO = '/api/unificado/fecProceso';
        const URL_EXPORTAREXCEL = '/api/unificado/excel';


        this.obtenerTipoNovedades = () => {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_TIPONOVEDADES,
                    method: 'GET'
                }).then( function(res) {
                    resolve(res.data);
                },
                function(err) {
                    reject(err.message);
                });
            });
        };

        this.obtenerFecProceso = (tipoArchivo) => {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_FECPROCESO,
                    method: 'GET',
                    params: {tipoArchivo: tipoArchivo}
                }).then( function(res) {
                    resolve(res.data);
                },
                function(err) {
                    reject(err.message);
                });
            });
        };

        this.exportarExcel = function (filters, tipoArchivo) {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_EXPORTAREXCEL,
                    method: "GET",
                    params: {
                        fecProceso: filters.fecProceso,
                        nroCuenta: filters.nroCuenta,
                        nroTarjeta: filters.nroTarjeta,
                        tipoNovedad: filters.tipoNovedad,
                        tipoArchivo: tipoArchivo
                    }
                }).then((res) => resolve(res.data)
                    ,(err) => reject(err.message));
            })
        };
    }
})();