(function () {
    'use strict';

    angular
        .module('app')
        .service('datosFijosVSService', DatosFijosVSService);

    function DatosFijosVSService ($http, Global) {
        const URL_TIPOCUENTAS = '/api/datosFijosVS/tipoCuentas';


        this.obtenerTipoCuentas = () => {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_TIPOCUENTAS,
                    method: 'GET'
                }).then( function(res) {
                    const result = res.data.map(x => {
                        return {
                            codigoTipoCuenta: x.codigoTipoCuenta,
                            descripcion: `${x.descCuenta} ${x.codigoTipoTarjeta} ${x.descTarjeta}`,
                            codigoTipoTarjeta: x.codigoTipoTarjeta
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