(function () {
    'use strict';

    angular
        .module('app')
        .controller('codigoDeAjustes.ctrl', codigoDeAjuste);

    function codigoDeAjuste($scope, $mdDialog, CodigoDeAjustesService, DialogConfirm, Toast) {

        $scope.onSelectRow = onSelectRow;
        $scope.openAddForm = openAddForm;
        $scope.delConfirm = delConfirm;
        $scope.edit = edit;

        activate();

        //////////////////////////////////

        function activate() {
            $scope.codigoAjustesGrid = initGrid();
            obtenerCodigoAjustes();
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

        function obtenerCodigoAjustes() {
            $scope.promisecodigoDeAjustes = CodigoDeAjustesService.obtenerCodigoAjustes()
                .then(res => {
                    $scope.codigoAjustesGrid.data = res;
                });
        }

        function dialogShow() {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'codigoDeAjustes.edicion.ctrl',
                templateUrl: 'app.views/codigoDeAjustes/codigoDeAjustes.edicion/codigoDeAjustes.edicion.html',
                focusOnOpen: false,
                locals: {
                    ajuste: $scope.codigoAjustesGrid.selected[0],
                    ajustes: $scope.codigoAjustesGrid.data
                }
            }).then(function () {
                Toast.showSuccess('La operación se realizó correctamente');
                $scope.codigoAjustesGrid.selected = [];
                obtenerCodigoAjustes();
            });
        }

        /*---------- Eventos -----------------*/

        function openAddForm() {
            dialogShow();
        }

        function delConfirm() {
            DialogConfirm.confirmation({
                message: '¿Está seguro que desea eliminar el/los registro/s seleccionado/s?',
                callback: del,
                context: this
            });
        }

        function del() {
            const vm = this;
            CodigoDeAjustesService.eliminarCodigosAjustes(vm.codigoAjustesGrid.selected)
                .then(() => {
                    Toast.showSuccess('La operación se realizó correctamente');
                    $scope.codigoAjustesGrid.selected = [];
                    obtenerCodigoAjustes();
                })
                .catch(err => Toast.showError(err));
        }

        function onSelectRow(row, index) {
            if (row.selected)
                $scope.codigoAjustesGrid.selected.push(row);
            else
                $scope.codigoAjustesGrid.selected = $scope.codigoAjustesGrid.selected.filter(x => x.entidad != row.entidad);
        }

        function edit() {
            dialogShow();
        }
        /*---------- Fin Eventos -----------------*/
    }
})();





