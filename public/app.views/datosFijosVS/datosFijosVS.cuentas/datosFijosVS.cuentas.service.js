(function () {
    'use strict';

    angular
        .module('app')
        .service('datosFijosVSCuentasService', CuentasService);

    function CuentasService ($http, Global) {
        const URL_CUENTAS = '/api/datosFijosVS/cuentas';
        const URL_TIPOCUENTAS = '/api/datosFijosVS/tipoCuentas';

        this.obtenerCuentas = () => {
            return new Promise((resolve, reject) => {

                $http({
                    url: URL_CUENTAS,
                    method: 'GET'
                }).then( function(res) {
                    resolve(res.data);
                },
                function(err) {
                    reject(err.message);
                });
            });
        };

        this.obtenerTipoCuentas = () => {
            return new Promise((resolve, reject) => {

                $http({
                    url: URL_TIPOCUENTAS,
                    method: 'GET'
                }).then( function(res) {
                    const result = res.data.map(x => {
                        return {
                            codigoTipoCuenta: x.codigoTipoCuenta,
                            descripcion: `${x.descCuenta} ${x.codigoTipoTarjeta} ${x.descTarjeta}`
                        }
                    });
                    resolve(result);
                },
                function(err) {
                    reject(err.message);
                });
            });
        };

        this.guardarCuenta = function (cuenta, cuentas, esModificacion) {
            const usuario = Global.currentUser.name;
            return new Promise((resolve, reject) => {
                if (esModificacion || validaDuplicado(cuenta, cuentas)) {
                    $http({
                        url: URL_CUENTAS,
                        method: 'PUT',
                        data: { cuenta, usuario: usuario }
                    }).then( function(res) {
                            resolve(res.data);
                        },
                        function(err) {
                            reject(err.message);
                        });
                } else {
                    reject('Ya existe un registro con el banco y tipo de cuenta seleccionado');
                }
            });
        };

        this.eliminarCuentas = (cuentas) => {
            const ids = cuentas.reduce((ant, curr) => ant + '|' + curr.idVSDatosFijosCuentas, '') + '|';
            const usuario = Global.currentUser.name;

            return new Promise((resolve, reject) => {
                $http({
                    url: URL_CUENTAS,
                    method: 'DELETE',
                    params: { cuentas: ids, usuario: usuario }
                }).then( function(res) {
                        resolve(res.data);
                    },
                    function(err) {
                        reject(err.message);
                    });
            });
        };

        function validaDuplicado(cuenta, cuentas) {
            const valid = cuentas.filter(x => x.banco.trim() === cuenta.banco.trim() && 
                                              x.tipoCuenta.trim() === cuenta.tipoCuenta.trim()).length === 0;
            return valid;
        }
    }
})();