(function () {
    'use strict';

    angular
        .module('app')
        .controller('rechazosUnificados.ctrl', rechazosUnificados);
    
    function rechazosUnificados($scope, $mdDialog, rechazoUnificadoService, Toast, DialogConfirm, $filter) {
        $scope.closeFilterCard = closeFilterCard;
        $scope.closeFilterAccountNumber = closeFilterAccountNumber;
        $scope.onFilterCard = onFilterCard;
        $scope.onFilterAccountNumber = onFilterAccountNumber;
        $scope.obtenerCuentas = obtenerCuentas;
        $scope.obtenerTarjetas = obtenerTarjetas;

        $scope.grillaAccountNumber = {
            "query": {
                periodo: 0,
                limit: '5',
                order: 'fecVigencia',
                page: 1,
                export:0,
                filterAccountNumber: ''
            },
            filterShow:false,
            data: [],
            count: 0
        };

        $scope.grillaCard = {
            "query": {
                periodo: 0,
                limit: '5',
                order: 'fecVigencia',
                page: 1,
                export:0,
                filterAccountNumber: '',
                filterCardNumber: ''
            },
            filterShow:false,
            data: [],
            count: 0
        };

        activate();
        
        //////////////////////////////////////////////////
        
        function activate(evt, obj) {
            $scope.cuentaGrid = initGrid();
            $scope.tarjetaGrid = initGrid();
            obtenerCuentas();
            obtenerTarjetas();
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

        /*----------------------------------------------------*/

        function obtenerCuentas() {
            $scope.promiseRechazosUnificado = rechazoUnificadoService.obtenerCuentas()
                .then(res => {
                    $scope.cuentaGrid.data = res;
                    $scope.cuentaGrid.count = res.length;
                });
        }

        function obtenerTarjetas() {
            $scope.promiseTarjetas = rechazoUnificadoService.obtenerTarjetas()
                .then(res => {
                    $scope.tarjetaGrid.data = res;
                    $scope.tarjetaGrid.count = res.length;
                });
        }

        function closeFilterCard() {
            $scope.grillaCard.filterShow = false;
            $scope.grillaCard.query.filterAccountNumber = '';
            $scope.grillaCard.query.filterCardNumber = '';
            obtenerTarjetas();
        }

        function closeFilterAccountNumber() {
            $scope.grillaAccountNumber.filterShow = false;
            $scope.grillaAccountNumber.query.filterAccountNumber = '';
            obtenerCuentas();
        }
        
        function onFilterCard(accountNumber, cardNumber) {
            $scope.tarjetaGrid.data = $filter('filter')($scope.tarjetaGrid.data, {cuenta: accountNumber, nroTarjeta: cardNumber});
        }

        function onFilterAccountNumber(accountNumber) {
            $scope.cuentaGrid.data = $filter('filter')($scope.cuentaGrid.data, {cuenta: accountNumber});
        }
    }
})();