(function () {
    'use strict';

    angular
        .module('app')
        .service('cotizacionService', cruceVISACOService);

    function cruceVISACOService($http, Global) {
        const URL_COTIZACION = '/api/cotizacion/cotizacion';
        const URL_MONEDA = '/api/cotizacion/moneda';

        this.obtenerCotizaciones = function (filters) {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_COTIZACION,
                    method: "GET",
                    params: { mes: filters }
                }).then(function (res) {
                        resolve(res.data);
                    },
                    function (err) {
                        reject(err.message);
                    });
            });
        };

        this.obtenerMonedas = function (filters) {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_MONEDA,
                    method: "GET"
                }).then(function (res) {
                        resolve(res.data);
                    },
                    function (err) {
                        reject(err.message);
                    });
            });
        };

        this.guardarCotizacion = function (cotizacion, cotizaciones, esModificacion) {
            const usuario = Global.currentUser.name;
            return new Promise((resolve, reject) => {
                if (esModificacion || validaDuplicado(cotizacion, cotizaciones)) {
                    $http({
                        url: URL_COTIZACION,
                        method: "POST",
                        data: { cotizacion, usuario: usuario }
                    }).then( res => {
                            resolve(res.data)
                        },
                        err => {
                            reject(err.message)
                        });
                } else {
                    reject('Ya existe un registro con la entidad seleccionada ');
                }
            });
        };

        this.eliminarCotizaciones = (cotizaciones) => {
            const ids = cotizaciones.reduce((ant, curr) => ant + '|' + curr.idCotizacion, '') + '|';
            const usuario = Global.currentUser.name;

            return new Promise((resolve, reject) => {
                $http({
                    url: URL_COTIZACION,
                    method: "DELETE",
                    params: { cotizaciones: ids, usuario: usuario }
                }).then( function(res) {
                        resolve(res.data)
                    },
                    function(err) {
                        reject(err.message)
                    });
            });
        };

        function validaDuplicado(cotizacion, cotizaciones) {
            const valid = cotizaciones.filter(x => x.monedaOrigen == cotizacion.monedaOrigen
                                                && x.monedaDestino == cotizacion.monedaDestino
                                                && moment(x.dia).diff(cotizacion.dia, 'day') == 0).length == 0;
            return valid;
        }
    }
})();