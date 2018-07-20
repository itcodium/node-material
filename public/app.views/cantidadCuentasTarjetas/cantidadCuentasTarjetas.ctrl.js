(function () {
    'use strict';

    angular
        .module('app')
        .controller('cantidadCuentasTarjetas.ctrl', ABMcantidadCuentasTarjetas);
    
    function ABMcantidadCuentasTarjetas($scope, $mdDialog, cantidadCuentasTarjetasService, Toast, DialogConfirm) {

        $scope.onSelectRow = onSelectRow;
        $scope.openAddForm = openAddForm;
        $scope.delConfirm = delConfirm;
        $scope.edit = edit;

        activate();
        
        //////////////////////////////////////////////////
        
        function activate() {
            $scope.cantidadCuentasTarjetasGrid = initGrid();
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

        function openAddForm() {
            dialogShow();
        }

        function onSelectRow(row, index) {
            if (row.selected)
                $scope.cantidadCuentasTarjetasGrid.selected.push(row);
            else
                $scope.cantidadCuentasTarjetasGrid.selected = $scope.cantidadCuentasTarjetasGrid.selected.filter(x => x.idEDPCant !== row.idEDPCant);
        }

        function edit() {
            dialogShow();
        }

        function delConfirm() {
            DialogConfirm.confirmation({
                message: '¿Está seguro que desea eliminar el/los registro/s seleccionado/s?',
                callback: del,
                context: this
            })
        }
        /*----------------------------------------------------*/

        function obtenerCuentas() {
            $scope.promiseGrilla = cantidadCuentasTarjetasService.obtenerCantCuentas()
                .then(res => {
                    $scope.cantidadCuentasTarjetasGrid.data = res;
                });
        }

        function dialogShow() {
            var obj = Object.assign({}, $scope.cantidadCuentasTarjetasGrid.selected[0]);
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'cantidadCuentasTarjetas.edicion.ctrl',
                templateUrl: 'app.views/cantidadCuentasTarjetas/cantidadCuentasTarjetas.edicion/cantidadCuentasTarjetas.edicion.html',
                focusOnOpen: false,
                locals: {
                    ParentScope: $scope,
                    cuenta: obj,
                    cuentas: $scope.cantidadCuentasTarjetasGrid.data
                }
            }).then(function () {
                Toast.showSuccess('La operación se realizó correctamente');
                $scope.cantidadCuentasTarjetasGrid.selected = [];
                obtenerCuentas();
            });
        }

        function del() {
            const vm = this;
            cantidadCuentasTarjetasService.eliminarCuentas(vm.cantidadCuentasTarjetasGrid.selected)
                .then(() => {
                    Toast.showSuccess('La operación se realizó correctamente');
                    $scope.cantidadCuentasTarjetasGrid.selected = [];
                    obtenerCuentas();
                })
                .catch(err => Toast.showError(err));
        }
    }
})();