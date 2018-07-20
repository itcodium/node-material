(function () {
    'use strict';

    angular
        .module('app')
        .controller('tarjetas.ctrl', unificadoTarjeta);
    
    function unificadoTarjeta($scope, $mdDialog, unificadotarjetaService, Toast, UnificadoService) {

        $scope.$on('onFilter', onFilter);
        $scope.$on('exportarAExcel', exportarAExcel);

        activate();

        //////////////////////////////////////////////////

        function activate() {
            $scope.tarjetaGrid = initGrid();
            setFecProceso();
            //obtenerTarjetas();
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
                    page: 1,
                    filters: {}
                },
                filters: {},
                message: ''
            };
            return grid;
        }

        /*Eventos -------------------------------
        * */
        function onFilter(event, filters) {
            $scope.tarjetaGrid.query.filters = filters;
            obtenerTarjetas(filters);
        }

        // function filtering(element) {
        //     let filters = $scope.tarjetaGrid.query.filters;
        //     return (!filters.fecProceso || moment(element.fecIngresoRespuesta).utc().diff(moment(filters.fecProceso), 'days') == 0)
        //         && (!filters.nroCuenta || element.Cuenta == filters.nroCuenta)
        //         && (!filters.nroTarjeta || element.NroTarjeta == filters.nroTarjeta)
        //         && (!filters.tipoNovedad || element.tipoNovedad == filters.tipoNovedad) ? true : false
        // }
        /*----------------------------------------------------*/

        function obtenerTarjetas(filters) {
            $scope.promiseTarjetas = unificadotarjetaService.obtenerTarjetas(filters)
                .then(res => {
                    $scope.tarjetaGrid.data = res;
                    $scope.tarjetaGrid.count = res.length;
                });
        }

        function setFecProceso() {
            UnificadoService.obtenerFecProceso('TARJETA')
                .then(res => {
                    $scope.$emit('setFecProceso', new Date(res[0].FecProceso));
                });
        }

        function exportarAExcel() {
            UnificadoService.exportarExcel($scope.tarjetaGrid.query.filters,'TARJETAS')
                .then(res => {
                    Toast.showSuccess(res.message);
                })
                .catch(err => Toast.showError(err));
        }
    }
})();