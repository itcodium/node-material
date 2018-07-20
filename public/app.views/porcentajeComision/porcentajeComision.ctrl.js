(function () {
    'use strict';

    angular
        .module('app')
        .controller('porcentajeComision.ctrl', ABMporcentajeComision);
    
    function ABMporcentajeComision($scope, $mdDialog, PorcentajeComisionService, Toast, DialogConfirm, $timeout) {

        $scope.onSelectRow = onSelectRow;
        $scope.openAddForm = openAddForm;
        $scope.delConfirm = delConfirm;
        $scope.edit = edit;

        activate();
        
        //////////////////////////////////////////////////
        
        function activate() {
            $scope.porcentajeComisionGrid = initGrid();
            obtenerPorcentajeComisiones();
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
                $scope.porcentajeComisionGrid.selected.push(row);
            else
                $scope.porcentajeComisionGrid.selected = $scope.porcentajeComisionGrid.selected.filter(x => x.idPorcentajeComision != row.idPorcentajeComision);
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

        function obtenerPorcentajeComisiones() {
            $scope.promiseEventos = PorcentajeComisionService.obtenerPorcComisiones()
                .then(res => {
                    $timeout(function() {
                        $scope.porcentajeComisionGrid.data = res;
                    }, 100);

                })
        }

        function dialogShow() {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'porcentajeComision.edicion.ctrl',
                templateUrl: 'app.views/porcentajeComision/porcentajeComision.edicion/porcentajeComision.edicion.html',
                focusOnOpen: false,
                locals: {
                    comision: $scope.porcentajeComisionGrid.selected[0],
                    comisiones: $scope.porcentajeComisionGrid.data
                }
            }).then(function () {
                Toast.showSuccess('La operación se realizó correctamente');
                $scope.porcentajeComisionGrid.selected = [];
                obtenerPorcentajeComisiones();
            });
        }

        function del() {
            const vm = this;
            PorcentajeComisionService.eliminarPorcentajeComisiones(vm.porcentajeComisionGrid.selected)
                .then(() => {
                    Toast.showSuccess('La operación se realizó correctamente');
                    $scope.porcentajeComisionGrid.selected = [];
                    obtenerPorcentajeComisiones();
                })
                .catch(err => Toast.showError(err));
        }
    }
})();