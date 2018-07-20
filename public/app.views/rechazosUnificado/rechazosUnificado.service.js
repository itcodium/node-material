(function () {
    'use strict';

    angular
        .module('app')
        .service('rechazoUnificadoService', rechazoUnificadoService);

    function rechazoUnificadoService($http) {
        const URL_RECHAZOSCUENTAS = '/api/rechazosUnificados/Cuentas';
        const URL_RECHAZOSTARJETAS = '/api/rechazosUnificados/Tarjetas';

        this.obtenerCuentas = function (filters) {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_RECHAZOSCUENTAS,
                    method: 'GET',
                    params: {
                    }
                }).then(function (res) {
                        resolve(res.data);
                    },
                    function (err) {
                        reject(err.message);
                    });
            });
        };

        this.obtenerTarjetas = function (filters) {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_RECHAZOSTARJETAS,
                    method: 'GET',
                    params: {
                    }
                }).then(function (res) {
                        const result = res.data.map(x => {
                            x.cuenta = Number(x.cuenta);
                            return x;
                        })
                        resolve(result);
                    },
                    function (err) {
                        reject(err.message);
                    });
            });
        };
    }
})();