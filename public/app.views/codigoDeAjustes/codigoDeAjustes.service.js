(function () {
    'use strict';

    angular
        .module('app')
        .service('CodigoDeAjustesService', CodigoDeAjustesService);

    function CodigoDeAjustesService($http, Global) {
        const URL_CODIGOAJUSTES = '/api/CodigoDeAjustes';

        this.obtenerCodigoAjustes = () => {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_CODIGOAJUSTES,
                    method: "GET"
                }).then( function(res) {
                        resolve(res.data)
                    },
                    function(err) {
                        reject(err.message)
                    });
            });
        };

        this.guardarCodigoAjustes = (codigoAjuste, ajustes, esModificacion) => {
            const usuario = Global.currentUser.name;

            return new Promise((resolve, reject) => {
                if (esModificacion || validaDuplicado(codigoAjuste, ajustes)) {
                    $http({
                        url: URL_CODIGOAJUSTES,
                        method: "PUT",
                        data: { codigoAjuste, usuario: usuario }
                    }).then( function(res) {
                            resolve(res.data)
                        },
                        function(err) {
                            reject(err.message)
                        });
                } else {
                    reject('Ya existe un registro con la entidad seleccionada ');
                }
            });
        };

        this.eliminarCodigosAjustes = (codigosAjustes) => {
            const ids = codigosAjustes.reduce((ant, curr) => ant + '|' + curr.entidad, '') + '|';
            const usuario = Global.currentUser.name;

            return new Promise((resolve, reject) => {
                $http({
                    url: URL_CODIGOAJUSTES,
                    method: "DELETE",
                    params: { entidades: ids, usuario: usuario }
                }).then( function(res) {
                        resolve(res.data)
                    },
                    function(err) {
                        reject(err.message)
                    });
            });
        };

        function validaDuplicado(ajuste, ajustes) {
            const valid = ajustes.filter(x => x.entidad == ajuste.entidad).length == 0;
            return valid;
        }
    }
})();