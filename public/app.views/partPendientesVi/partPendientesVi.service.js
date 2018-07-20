/**
 * Created by nicolas.iglesias on 01/11/2017.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .service('partPendientesViService', partPendientesViService);

    function partPendientesViService($http) {
        const URL_ESTVISACO = '/api/cruceVISACO/EstVISACO';
        const URL_TOTCIE = '/api/partPendienteVi/TotCie';
        const URL_TOTCANCELACIONES = '/api/partPendienteVi/TotCancelaciones';
        const URL_HISTORICO = '/api/partPendienteVi/Historico';
        const URL_DETALLECIE = '/api/partPendienteVi/detalleCie';
        const URL_DETALLECIS = '/api/partPendienteVi/detalleCis';
        const URL_EXPORTCIS = '/api/partPendienteVi/exportCis';
        const URL_PROMOTDEXPORTAR = '/api/cruceVISACO/promoTDConsulta/ExportarExcel';

        this.obtenerTotCie = function (filters) {
            return new Promise((resolve, reject) => {
                    const options = {
                        url: URL_TOTCIE,
                        method: "GET"
                    };
            if (filters)
                options.params = {
                    fecDesde: filters.fecDesde,
                    fecHasta: filters.fecHasta
                };

            $http(options).then(function (res) {
                    resolve(res.data[0])
                },
                function (err) {
                    reject(err.message)
                });
        });
        };

        this.obtenerTotCancelaciones = function () {
            return new Promise((resolve, reject) => {
                    $http({
                        url: URL_TOTCANCELACIONES,
                        method: "GET"
                    }).then(function (res) {
                        resolve(res.data[0])
                    },
                    function (err) {
                        reject(err.message)
                    });
        })
        };

        this.obtenerDetalleCie = function (nroCie) {
            return new Promise((resolve, reject) => {
                    $http({
                        url: URL_DETALLECIE,
                        method: "GET",
                        params: {
                            nroCie: nroCie
                        }
                    }).then(function (res) {
                        resolve(res.data[0])
                    },
                    function (err) {
                        reject(err.message)
                    });
        })
        };

        this.obtenerDetalleCis = function (fecPago) {
            return new Promise((resolve, reject) => {
                    $http({
                        url: URL_DETALLECIS,
                        method: "GET",
                        params: {
                            fecPago: fecPago
                        }
                    }).then(function (res) {
                        resolve(res.data[0])
                    },
                    function (err) {
                        reject(err.message)
                    });
        })
        };

        this.obtenerHistorico = function (nroTarjeta) {
            return new Promise((resolve, reject) => {
                    $http({
                        url: URL_HISTORICO,
                        method: "GET",
                        params: {
                            nroTarjeta: nroTarjeta
                        }
                    }).then(function (res) {
                        resolve(res.data)
                    },
                    function (err) {
                        reject(err.message)
                    });
        })
        };


        this.exportExcel = function (fecPago) {
            return new Promise((resolve, reject) => {
                    $http({
                        url: URL_EXPORTCIS,
                        method: "POST",
                        data: {
                            fecPago: fecPago
                        }
                    }).then(function (res) {
                        resolve(res)
                    },
                    function (err) {
                        reject(err.message)
                    });
        })
        }
    }
})();