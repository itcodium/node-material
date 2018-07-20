(function () {
    'use strict';

    angular
        .module('app')
        .service('unificadotarjetaService', TarjetaService);

    function TarjetaService ($http, Global) {
        const URL_TARJETAS = '/api/unificado/tarjetas';

        this.obtenerTarjetas = (filters) => {
            return new Promise((resolve, reject) => {

                $http({
                    url: URL_TARJETAS,
                    method: 'GET',
                    params: {
                        fecProceso: filters.fecProceso,
                        nroCuenta: filters.nroCuenta,
                        nroTarjeta: filters.nroTarjeta,
                        tipoNovedad: filters.tipoNovedad
                    }
                }).then( function(res) {
                        resolve(res.data);
                    },
                    function(err) {
                        reject(err.message);
                    });
            });
        };
    }
})();