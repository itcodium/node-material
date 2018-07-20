(function () {
    'use strict';

    angular
        .module('app')
        .controller('coeficientesImportes.ctrl', ABMcoeficientesImportes);
    
    function ABMcoeficientesImportes($scope, $mdDialog, coeficientesImportesService, Toast, DialogConfirm, $locale, $filter) {
        $scope.filtering = '';

        $scope.onSelectRow = onSelectRow;
        $scope.$on('edit', dialogShow);
        $scope.$on('add', dialogShow);
        $scope.$on('del', del);
        $scope.$on('filter', filterTable);

        $locale.NUMBER_FORMATS.GROUP_SEP = ',';
        $locale.NUMBER_FORMATS.DECIMAL_SEP = '.';

        activate();
        
        //////////////////////////////////////////////////
        
        function activate() {
            $scope.coeficienteImporteGrid = initGrid();
            obtenerCoeficientesImportes();
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
                $scope.coeficienteImporteGrid.selected.push(row);
            } else {
                $scope.coeficienteImporteGrid.selected = $scope.coeficienteImporteGrid.selected
                                                                .filter(x => x.idcoeficienteImporte !== row.idcoeficienteImporte);
            }

            $scope.$emit('updateSelected', $scope.coeficienteImporteGrid.selected.length);
        }

        /*----------------------------------------------------*/

        function obtenerCoeficientesImportes() {
            $scope.promiseObj = coeficientesImportesService.obtenerCoeficientesImportes()
                .then(res => {
                    $scope.coeficienteImporteGrid.data = res;
                    $scope.$emit('updateSelected', $scope.coeficienteImporteGrid.selected.length);
                });
        }

        function dialogShow() {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'limitesDeCompras.coeficientesImportes.edicion.ctrl',
                templateUrl: 'app.views/limitesDeCompras/limitesDeCompras.coeficientesImportes/limitesDeCompras.coeficientesImportes.edicion/limitesDeCompras.coeficientesImportes.edicion.html',
                focusOnOpen: false,
                locals: {
                    coeficienteImporte: $scope.coeficienteImporteGrid.selected[0],
                    coeficientesImportes: $scope.coeficienteImporteGrid.data
                }
            }).then(function () {
                Toast.showSuccess('La operación se realizó correctamente');
                $scope.coeficienteImporteGrid.selected = [];
                obtenerCoeficientesImportes();
            });
        }

        function del() {
            coeficientesImportesService.eliminarCoeficientesImportes($scope.coeficienteImporteGrid.selected)
                .then(() => {
                    Toast.showSuccess('La operación se realizó correctamente');
                    $scope.coeficienteImporteGrid.selected = [];
                    $scope.$emit('updateSelected', $scope.coeficienteImporteGrid.selected.length);
                    obtenerCoeficientesImportes();
                })
                .catch(err => Toast.showError(err));
        }

        function filterTable(evt, data) {
            //Select attributes needed to filter
            let updateArray = $scope.coeficienteImporteGrid.data.map(value => {
                const mapArray = {
                    marca: value.marca,
                    letra: value.letra,
                    coeficiente: value.coeficiente,
                    importe: value.importe
                }

                return mapArray;
            });
            $scope.coeficienteImporteGrid.data = updateArray;

            //Replace comma for search
            $scope.filtering = data.replace(/,/g, "");
        }
    }
})();