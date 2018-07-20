(function () {
    'use strict';

    angular
        .module('app')
        .service('unificadoCuentasService', CuentasService);

    function CuentasService ($http, Global) {
        const URL_CUENTAS = '/api/unificado/cuentas';
        const URL_TIPOCUENTAS = '/api/unificado/tipoCuentas';

        this.obtenerCuentas = (filters) => {
            return new Promise((resolve, reject) => {

                $http({
                    url: URL_CUENTAS,
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
    }
})();