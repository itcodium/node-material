(function () {
    'use strict';

    angular
        .module('app')
        .service('rechazoVSService', rechazoVSService);

    function rechazoVSService($http) {
        const URL_RECHAZOSVS = '/api/rechazosVS/rechazosVS';


        this.obtenerRechazoVS = function (filters) {
            return new Promise((resolve, reject) => {
                $http({
                    url: URL_RECHAZOSVS,
                    method: 'GET',
                    params: {
                    }
                }).then(function (res) {
                        resolve(res.data);
                    },
                    function (err) {
                        reject(err.message);
                    });
            });
        };

    }
})();