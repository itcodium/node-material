(function () {
    'use strict';

    angular
        .module('app')
        .service('coeficientesImportesService', coeficientesImportesService);

    function coeficientesImportesService ($http, Global) {
        const URL_COEFICIENTESIMPORTES = '/api/limitesDeCompras/coeficientesImportes';

        this.obtenerCoeficientesImportes = () => {
            return new Promise((resolve, reject) => {

                $http({
                    url: URL_COEFICIENTESIMPORTES,
                    method: 'GET'
                }).then( function(res) {
                    resolve(res.data);
                },
                function(err) {
                    reject(err.message);
                });
            });
        };

        this.guardarCoeficientesImportes = (coeficiente, coeficientes, esModificacion) => {
            const usuario = Global.currentUser.name;
            return new Promise((resolve, reject) => {
                if (esModificacion || validaDuplicado(coeficiente, coeficientes)) {
                    $http({
                        url: URL_COEFICIENTESIMPORTES,
                        method: 'PUT',
                        data: { coeficiente, usuario: usuario }
                    }).then( function(res) {
                            resolve(res.data);
                        },
                        function(err) {
                            reject(err.message);
                        });
                } else {
                    reject('Ya existe un registro para la Marca, Letra y Coeficientes ingresados');
                }
            });
        };

        this.eliminarCoeficientesImportes = (coeficientesImportes) => {
            const ids = coeficientesImportes.reduce((ant, curr) => ant + '|' + curr.idUnifLCCoefImportes, '') + '|';
            const usuario = Global.currentUser.name;

            return new Promise((resolve, reject) => {
                $http({
                    url: URL_COEFICIENTESIMPORTES,
                    method: 'DELETE',
                    params: { coeficientesImportes: ids, usuario: usuario }
                }).then( function(res) {
                        resolve(res.data);
                    },
                    function(err) {
                        reject(err.message);
                    });
            });
        };

        function validaDuplicado(coeficiente, coeficientes) {
            const valid = coeficientes && coeficientes.filter(x => x.marca === coeficiente.marca && 
                                                x.letra.trim() === coeficiente.letra.trim() &&
                                                x.coeficiente === coeficiente.coeficiente).length === 0;
            return valid;
        }
    }
})();