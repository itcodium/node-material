(function () {
    'use strict';
    angular
        .module('app')
        .service('cantidadCuentasTarjetasService', cantidadCuentasTarjetasService);

    function cantidadCuentasTarjetasService ($http, Global) {
        const URL_CantidadCuentasTarjetas = '/api/cantidadCuentasTarjetas/';

        this.obtenerCantCuentas = function() {
            return new Promise(function(resolve, reject) {
                $http({
                    url: URL_CantidadCuentasTarjetas,
                    method: "GET"
                }).then( function(res) {
                        resolve(res.data)
                    },
                    function(err) {
                        reject(err.message)
                    });
            });
        };

        this.obtenerTipoCuentas = function () {
            return new Promise(function(resolve, reject) {
                $http({
                    url: '/api/TipoCuentas',
                    method: "GET"
                }).then( function(res) {
                    resolve(res.data)
                },
                function(err) {
                    reject(err.message)
                });
            });
        };

        this.obtenerSucursalesEDP = function () {
            return new Promise(function (resolve, reject){
                $http({
                    url: '/api/sucursalesEDP',
                    method: "GET"
                }).then( function(res) {
                    resolve(res.data)
                },
                function(err) {
                    reject(err.message)
                });
            });
        };

        this.guardar = function (cuenta, cuentas, usuario, esModificacion) {
            return new Promise(function (resolve, reject) {
                if (esModificacion || validaDuplicado(cuenta, cuentas)) {
                    $http({
                        url: URL_CantidadCuentasTarjetas,
                        method: esModificacion ? "PUT" : "POST",
                        data: { cuenta: cuenta, usuario: usuario }
                    }).then( function(res) {
                            resolve(res.data)
                        },
                        function(err) {
                            reject(err.message)
                        });
                } else {
                    reject('Ya existe la asociación del código de Ente con ese tipo de pago')
                }
            });
        };

        this.eliminarCuentas = function (cuentas) {
            const ids = cuentas.reduce((ant, curr) =>
                ant + '|' + curr.idEDPCant, '') + '|';

            return new Promise(function (resolve, reject) {
                $http({
                    url: URL_CantidadCuentasTarjetas,
                    method: "DELETE",
                    data: { idEDPCant: ids },
                    headers: {'Content-Type': 'application/json;charset=utf-8'}
                }).then( function(res) {
                        resolve(res.data)
                    },
                    function(err) {
                        reject(err.message)
                    });
            });
        };

        function validaDuplicado(cuenta, cuentas) {
            const valid = cuentas.filter(x => x.entidad == cuenta.entidad
                && x.sucursal == cuenta.sucursal && x.codigoTipoCuenta == cuenta.codigoTipoCuenta).length == 0;
            return valid;
        }
    }
})();