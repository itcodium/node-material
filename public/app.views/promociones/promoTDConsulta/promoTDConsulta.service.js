(function () {
    'use strict';

    angular
        .module('app')
        .service('promoTDConsultaService', promoTDConsultaService);

    function promoTDConsultaService ($http) {
        const URL_ARCHIVOSASIGNADOS = '/api/promociones/promoTDConsulta/ArchivosAsignados';
        const URL_PROMOTARJETAS = '/api/promociones/promoTDConsulta/PromoTarjetas';
        const URL_PADRONTD = '/api/promociones/promoTDConsulta/PadronTD';
        const URL_PROMOTDEXPORTAR = '/api/promociones/promoTDConsulta/ExportarExcel';

        this.obtenerArchivos = function (filters) {
            return new Promise((resolve, reject) => {

                const options = {
                    url: URL_ARCHIVOSASIGNADOS,
                    method: "GET"
                };
                if (filters)
                    options.params = { fecDesde: filters.fecDesde, fecHasta: filters.fecHasta };

                $http(options).then(function (res) {
                        resolve(res.data[0])
                    },
                    function (err) {
                        reject(err.message)
                    });
            });
        };

        this.obtenerPromotarjetas = function (nroTarjeta, idProceso) {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_PROMOTARJETAS,
                    method: "GET",
                    params: { nroTarjeta: nroTarjeta }
                }).then(function (res) {
                        resolve(res.data[0])
                    },
                    function (err) {
                        reject(err.message)
                    });
            })
        };

        this.obtenerPadronTD = function (nroTarjeta) {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_PADRONTD,
                    method: "GET",
                    params: { nroTarjeta: nroTarjeta }
                }).then(function (res) {
                        resolve(res.data[0])
                    },
                    function (err) {
                        reject(err.message)
                    });
            })
        };

        this.exportarExcel = function (data) {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_PROMOTDEXPORTAR,
                    method: "POST",
                    data: data,
                    responseType: "arraybuffer"
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