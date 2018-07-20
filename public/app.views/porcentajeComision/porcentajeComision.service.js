(function () {
    'use strict';

    angular
        .module('app')
        .service('PorcentajeComisionService', PorcentajeComisionService);

    function PorcentajeComisionService ($http, Global) {
        const URL_PORCCOMISION = '/api/porcentajeComision';

        this.obtenerPorcComisiones = () => {
            return new Promise((resolve, reject) => {

                $http({
                    url: URL_PORCCOMISION,
                    method: "GET"
                }).then( function(res) {
                        resolve(res.data)
                    },
                    function(err) {
                        reject(err.message)
                    });
            });
        };

        this.guardarComision = (comision, comisiones, usuario, esModificacion) => {
            return new Promise((resolve, reject) => {
                if (esModificacion || validaDuplicado(comision, comisiones)) {
                    $http({
                        url: URL_PORCCOMISION,
                        method: "PUT",
                        data: { comision: comision, usuario: usuario }
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

        this.eliminarPorcentajeComisiones = (comisiones) => {
            const ids = comisiones.reduce((ant, curr) => ant + '|' + curr.idPorcentajeComision, '') + '|';
            const usuario = Global.currentUser.name;

            return new Promise((resolve, reject) => {
                $http({
                    url: URL_PORCCOMISION,
                    method: "DELETE",
                    params: { ids: ids, usuario: usuario }
                }).then( function(res) {
                        resolve(res.data)
                    },
                    function(err) {
                        reject(err.message)
                    });
            });
        };

        function validaDuplicado(comision, comisiones) {
            const valid = comisiones.filter(x => x.codEnte == comision.codEnte
                && x.tipoPago == comision.tipoPago).length == 0;
            return valid;
        }
    }
})();