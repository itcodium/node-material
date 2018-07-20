(function () {
    'use strict';

    angular
        .module('app')
        .controller('cuentas.ctrl', ABMcuentas);
    
    function ABMcuentas($scope, $mdDialog, cuentasService, Toast, DialogConfirm) {

        $scope.onSelectRow = onSelectRow;
        $scope.openAddForm = openAddForm;
        $scope.delConfirm = delConfirm;
        $scope.edit = edit;

        $scope.$on('init', activate);

        activate();
        
        //////////////////////////////////////////////////
        
        function activate(evt, obj) {
            console.log('pasó')
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

        function openAddForm() {
            dialogShow();
        }

        function onSelectRow(row, index) {
            if (row.selected)
                $scope.cuentaGrid.selected.push(row);
            else
                $scope.cuentaGrid.selected = $scope.cuentaGrid.selected.filter(x => x.idCuenta != row.idCuenta);
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
            cuentasService.obtenerPorcComisiones()
                .then(res => {
                    $scope.cuentaGrid.data = res;
                })
        }

        function dialogShow() {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'cuentas.edicion.ctrl',
                templateUrl: 'app.views/datosFijos/cuentas.edicion/cuentas.edicion.html',
                focusOnOpen: false,
                locals: {
                    comision: $scope.cuentaGrid.selected[0],
                    comisiones: $scope.cuentaGrid.data
                }
            }).then(function () {
                Toast.showSuccess('La operación se realizó correctamente');
                $scope.cuentaGrid.selected = [];
                obtenerCuentas();
            });
        }

        function del() {
            const vm = this;
            cuentasService.eliminarCuentas(vm.cuentaGrid.selected)
                .then(() => {
                    Toast.showSuccess('La operación se realizó correctamente');
                    $scope.cuentaGrid.selected = [];
                    obtenerCuentas();
                })
                .catch(err => Toast.showError(err));
        }
    }
})();