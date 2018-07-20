(function () {
    'use strict';

    angular
        .module('app')
        .controller('tarjetas.ctrl', ABMtarjeta);
    
    function ABMtarjeta($scope, $mdDialog, tarjetaService, Toast, DialogConfirm) {

        $scope.onSelectRow = onSelectRow;
        $scope.openAddForm = openAddForm;
        $scope.delConfirm = delConfirm;
        $scope.edit = edit;

        activate();
        
        //////////////////////////////////////////////////
        
        function activate() {
            $scope.tarjetaGrid = initGrid();
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

        /*Eventos -------------------------------
        * */

        function openAddForm() {
            dialogShow();
        }

        function onSelectRow(row, index) {
            if (row.selected)
                $scope.tarjetaGrid.selected.push(row);
            else
                $scope.tarjetaGrid.selected = $scope.tarjetaGrid.selected.filter(x => x.idtarjeta != row.idtarjeta);
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

        function obtenerTarjetas() {
            tarjetaService.obtenerPorcComisiones()
                .then(res => {
                    $scope.tarjetaGrid.data = res;
                })
        }

        function dialogShow() {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'tarjetas.edicion.ctrl',
                templateUrl: 'app.views/datosFijos/tarjetas/tarjetas.edicion/tarjetas.edicion.html',
                focusOnOpen: false,
                locals: {
                    comision: $scope.tarjetaGrid.selected[0],
                    comisiones: $scope.tarjetaGrid.data
                }
            }).then(function () {
                Toast.showSuccess('La operación se realizó correctamente');
                $scope.tarjetaGrid.selected = [];
                obtenerTarjetas();
            });
        }

        function del() {
            const vm = this;
            tarjetaService.eliminarTarjetas(vm.tarjetaGrid.selected)
                .then(() => {
                    Toast.showSuccess('La operación se realizó correctamente');
                    $scope.tarjetaGrid.selected = [];
                    obtenerTarjetas();
                })
                .catch(err => Toast.showError(err));
        }
    }
})();