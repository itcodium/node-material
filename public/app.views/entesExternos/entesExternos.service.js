(function () {
    'use strict';

    angular
        .module('app')
        .service('EntesExternosService', EntesExternosService);

    function EntesExternosService($http, Global) {
        const URL_ENTESEXTERNOSAJUSTESMAIL = '/api/entesExternos/ajuste/archivoMail';
        const URL_ENTESEXTERNOS = '/api/entesExternos';

        this.obtenerEntesExternos = (esComision,fecDesde, fecHasta) => {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_ENTESEXTERNOS,
                    method: "GET",
                    params: {
                        esComision: esComision,
                        fechaDesde: fecDesde,
                        fechaHasta: fecHasta
                    }
                }).then( function(res) {
                    resolve(res);
                },
                function(err) {
                    reject(err.message);
                });
            });
        };

        this.generarCaratula = () => {
            downloadPdfFromWorkspace();
        };

        this.generarMail = (fechaDesde, fechaHasta) => {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_ENTESEXTERNOSAJUSTESMAIL,
                    method: "GET",
                    params: {
                        fechaDesde: fechaDesde,
                        fechaHasta: fechaHasta
                    }
                }).then( function(res) {
                    resolve(res);
                },
                function(err) {
                    reject(err.message);
                });
            });
        };
    }
})();