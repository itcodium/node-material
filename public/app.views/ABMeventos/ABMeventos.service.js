(function () {
    'use strict';

    angular
        .module('app')
        .service('ABMEventosService', ABMEventosService);

    function ABMEventosService ($http) {
        const URL_EVENTOS = '/api/conciliaciones/eventos';
        const URL_EVENTOGRUPOS = '/api/conciliaciones/eventoGrupos';

        this.obtenerEventos = function () {
            return new Promise((resolve, reject) => {

                $http({
                    url: URL_EVENTOS,
                    method: "GET"
                }).then( function(res) {
                        resolve(res.data)
                    },
                    function(err) {
                        reject(err.message)
                    });
            });
        };

        this.obtenerEventoGrupos = function () {
            return new Promise((resolve, reject) => {

                $http({
                    url: URL_EVENTOGRUPOS,
                    method: "GET"
                }).then( function(res) {
                        resolve(res.data)
                    },
                    function(err) {
                        reject(err.message)
                    });
            });
        };

        this.guardarEvento = function (evento, usuario) {
            return new Promise((resolve, reject) => {

                $http({
                    url: URL_EVENTOS,
                    method: "PUT",
                    data: { evento:evento, usuario:usuario }
                }).then( function(res) {
                        resolve(res.data)
                    },
                    function(err) {
                        reject(err.message)
                    });
            });
        };

        this.bajaEventos = function (eventos, fecBaja, usuario) {
            return new Promise((resolve, reject) => {

                $http({
                    url: URL_EVENTOS,
                    method: "DELETE",
                    params: { eventos: eventos, fecBaja: fecBaja, usuario:usuario }
                }).then( function(res) {
                        resolve(res.data)
                    },
                    function(err) {
                        reject(err.message)
                    });
            });
        }
    }
})();