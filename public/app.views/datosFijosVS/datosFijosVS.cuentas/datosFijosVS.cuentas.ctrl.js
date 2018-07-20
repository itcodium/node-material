(function () {
    'use strict';

    angular
        .module('app')
        .controller('datosFijosVS.cuentas.ctrl', datosFijosVSCuentas);
    
    function datosFijosVSCuentas($scope, $mdDialog, datosFijosVSCuentasService, Toast) {

        $scope.onSelectRow = onSelectRow;

        $scope.$on('add', dialogShow);
        $scope.$on('edit', dialogShow);
        $scope.$on('del', del);

        activate();
        
        //////////////////////////////////////////////////
        
        function activate() {
            $scope.cuentaGrid = initGrid();
            obtenerCuentas();
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

        function onSelectRow(row, index) {
            if (row.selected) {
                $scope.cuentaGrid.selected.push(row);
            }
            else {
                $scope.cuentaGrid.selected = $scope.cuentaGrid.selected.filter(x => x.idVSDatosFijosCuentas !== row.idVSDatosFijosCuentas);
            }
            $scope.$emit('updateSelected', $scope.cuentaGrid.selected.length);
        }
        /*----------------------------------------------------*/

        function obtenerCuentas() {
            $scope.promiseObj = datosFijosVSCuentasService.obtenerCuentas().then(res => {
                $scope.cuentaGrid.data = res;
            });
        }

        function dialogShow() {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'datosFijosVS.cuentas.edicion.ctrl',
                templateUrl: 'app.views/datosFijosVS/datosFijosVS.cuentas/datosFijosVS.cuentas.edicion/datosFijosVS.cuentas.edicion.html',
                focusOnOpen: false,
                locals: {
                    cuenta: $scope.cuentaGrid.selected[0],
                    cuentas: $scope.cuentaGrid.data
                }
            }).then(function () {
                Toast.showSuccess('La operación se realizó correctamente');
                $scope.cuentaGrid.selected = [];
                $scope.$emit('updateSelected', $scope.cuentaGrid.selected.length);
                obtenerCuentas();
            });
        }

        function del() {
            datosFijosVSCuentasService.eliminarCuentas($scope.cuentaGrid.selected)
                .then(() => {
                    Toast.showSuccess('La operación se realizó correctamente');
                    $scope.cuentaGrid.selected = [];
                    $scope.$emit('updateSelected', $scope.cuentaGrid.selected.length);
                    obtenerCuentas();
                })
                .catch(err => Toast.showError(err));
        }
    }
})();