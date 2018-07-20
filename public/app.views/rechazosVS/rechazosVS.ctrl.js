(function () {
    'use strict';

    angular
        .module('app')
        .controller('rechazosVS.ctrl', rechazosVS);

    function rechazosVS($scope, rechazoVSService) {

        activate();

       //////////////////////////////////////////////////

        function activate(evt, obj) {
            $scope.rechazoVSGrid = initGrid();

            obtenerRechazoVS();

        }


        function initGrid() {
            let grid = {
                data: [],
                count: 1,
                selected: [],
                query: {
                    limit: 5,
                    page: 1
                },
                message: ''
            };
            return grid;
        }


       function obtenerRechazoVS() {
            $scope.promiseRechazosUnificado = rechazoVSService.obtenerRechazoVS()
                .then(res => {
                    $scope.rechazoVSGrid.data = res;
                    $scope.rechazoVSGrid.count = res.length;
                });
        }


    }
})();