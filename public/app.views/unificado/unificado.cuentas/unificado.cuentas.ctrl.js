(function () {
    'use strict';

    angular
        .module('app')
        .controller('cuentas.ctrl', unificadoCuentas);
    
    function unificadoCuentas($scope, $mdDialog, unificadoCuentasService, Toast, UnificadoService) {

        $scope.$on('onFilter', onFilter);
        $scope.$on('exportarAExcel', exportarAExcel);
        activate();

        //////////////////////////////////////////////////

        function activate() {
            $scope.cuentaGrid = initGrid();
            setFecProceso();
        }

        /**
         * Devuelve object model de grilla
         * @returns {{data: Array, count: number, selected: Array, query: {limit: number, page: number}, message: string}}
         */
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

        /*Eventos -------------------------------
        * */
        function onFilter(event, filters) {
            $scope.cuentaGrid.query.filters = filters;
            obtenerCuentas(filters);
        }
        /*----------------------------------------------------*/

        function obtenerCuentas(filters) {
            $scope.promiseCuentas = unificadoCuentasService.obtenerCuentas(filters)
                .then(res => {
                    $scope.cuentaGrid.data = res;
                    $scope.cuentaGrid.count = res.length;
                });
        }

        function setFecProceso() {
            UnificadoService.obtenerFecProceso('CUENTA')
                .then(res => {
                    $scope.$emit('setFecProceso', new Date(res[0].FecProceso));
                });
        }

        function exportarAExcel() {
            UnificadoService.exportarExcel($scope.cuentaGrid.query.filters,'CUENTAS')
                .then(res => {
                    Toast.showSuccess(res.message);
                })
                .catch(err => Toast.showError(err));
        }
    }
})();