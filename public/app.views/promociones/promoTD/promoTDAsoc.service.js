/**
 * Created by cristian.ovando on 17/08/2017.
 */
(function () {
    function promoTDAsocService ($http) {
        const URL_ARCHIVOS = '/api/promociones/promoTDAsoc/Archivos';
        const URL_OBTENER_PROMOCIONES = '/api/promociones/promoTDAsoc/Promociones';
        const URL_OBTENER_PROMOCIONES_ASOCIADAS = '/api/promociones/promoTDAsoc/Archivos?asociadas=true';

        this.obtenerArchivos = function () {
            return new Promise((resolve, reject) => {

                $http({
                    url: URL_ARCHIVOS,
                    method: "GET",
                    cache: false
                }).then( function(res) {
                    resolve(res.data[0])
                },
                function(err) {
                    reject(err.message)
                });
            });
        };

        this.obtenerPromociones = function () {
            return new Promise((resolve, reject) => {

                $http({
                    url: URL_OBTENER_PROMOCIONES,
                    method: "GET"
                }).then( function(res) {
                        resolve(res.data[0])
                    },
                    function(err) {
                        reject(err.message)
                    });
            });
        }

        this.obtenerPromocionesAsociadas = function() {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_OBTENER_PROMOCIONES_ASOCIADAS,
                    method: "GET",
                    cache: false
                }).then( function(res) {
                        resolve(res.data[0])
                    },
                    function(err) {
                        reject(err.message)
                    });
            });
        }

        this.generarArchivo = function (data, user) {
            return new Promise((resolve, reject) => {
                $http.post( URL_ARCHIVOS, {archivos: data, usuario: user})
                    .success( function(res) {
                        resolve(res.message);
                    })
                    .error(function (err) {
                        reject(err.message);
                    });
            });
        }
    }

    angular
        .module('app')
        .service('promoTDAsocService', promoTDAsocService);
})();