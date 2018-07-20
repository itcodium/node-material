(function () {
    'use strict';

    angular
        .module('app')
        .service('datosFijosVStarjetaService', TarjetaService);

    function TarjetaService ($http, Global) {
        const URL_TARJETAS = '/api/datosFijosVS/tarjetas';
        const URL_OCUPACIONES = '/api/datosFijosVS/tarjetas/ocupaciones';

        this.obtenerTarjetas = () => {
            return new Promise((resolve, reject) => {

                $http({
                    url: URL_TARJETAS,
                    method: 'GET'
                }).then( function(res) {
                        resolve(res.data);
                    },
                    function(err) {
                        reject(err.message);
                    });
            });
        };

        this.guardarTarjeta = function (tarjeta, tarjetas, esModificacion) {
            const usuario = Global.currentUser.name;
            return new Promise((resolve, reject) => {
                if (esModificacion || validaDuplicado(tarjeta, tarjetas)) {
                    $http({
                        url: URL_TARJETAS,
                        method: 'PUT',
                        data: { tarjeta, usuario: usuario }
                    }).then( function(res) {
                            resolve(res.data);
                        },
                        function(err) {
                            reject(err.message);
                        });
                } else {
                    reject('Ya existe un registro con el banco y tipo de tarjeta seleccionado');
                }
            });
        };

        this.eliminarTarjetas = (tarjetas) => {
            const ids = tarjetas.reduce((ant, curr) => ant + '|' + curr.idVSDatosFijosTarjetas, '') + '|';
            const usuario = Global.currentUser.name;

            return new Promise((resolve, reject) => {
                $http({
                    url: URL_TARJETAS,
                    method: 'DELETE',
                    params: { tarjetas: ids, usuario: usuario }
                }).then( function(res) {
                        resolve(res.data);
                    },
                    function(err) {
                        reject(err.message);
                    });
            });
        };

        this.obtenerOcupaciones = () => {
            return new Promise((resolve, reject) => {

                $http({
                    url: URL_OCUPACIONES,
                    method: 'GET'
                }).then( function(res) {
                        resolve(res.data);
                    },
                    function(err) {
                        reject(err.message);
                    });
            });
        };

        function validaDuplicado(tarjeta, tarjetas) {
            const valid = tarjetas.filter(x => x.banco.trim() === tarjeta.banco.trim() && 
                                              x.tipoTarjeta.trim() === tarjeta.tipoTarjeta.trim()).length === 0;
            return valid;
        }
    }
})();