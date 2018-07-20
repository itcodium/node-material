(function () {
    'use strict';

    angular
        .module('app')
        .controller('datosFijosVS.tarjetas.ctrl', datosFijosVSTarjeta);
    
    function datosFijosVSTarjeta($scope, $mdDialog, datosFijosVStarjetaService, Toast) {

        $scope.onSelectRow = onSelectRow;
        
        $scope.$on('add', dialogShow);
        $scope.$on('edit', dialogShow);
        $scope.$on('del', del);

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

        function onSelectRow(row, index) {
            if (row.selected) {
                $scope.tarjetaGrid.selected.push(row);
            }
            else {
                $scope.tarjetaGrid.selected = $scope.tarjetaGrid.selected
                                                        .filter(x => x.idVSDatosFijosTarjetas !== row.idVSDatosFijosTarjetas);
            }
            $scope.$emit('updateSelected', $scope.tarjetaGrid.selected.length);
        }
        /*----------------------------------------------------*/

        function obtenerTarjetas() {
            $scope.promiseTarjetas = datosFijosVStarjetaService.obtenerTarjetas()
                .then(res => {
                    $scope.tarjetaGrid.data = res;
                });
        }

        function dialogShow() {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'datosFijosVS.tarjetas.edicion.ctrl',
                templateUrl: 'app.views/datosFijosVS/datosFijosVS.tarjetas/datosFijosVS.tarjetas.edicion/datosFijosVS.tarjetas.edicion.html',
                focusOnOpen: false,
                locals: {
                    tarjeta: $scope.tarjetaGrid.selected[0],
                    tarjetas: $scope.tarjetaGrid.data
                }
            }).then(function () {
                Toast.showSuccess('La operación se realizó correctamente');
                $scope.tarjetaGrid.selected = [];
                $scope.$emit('updateSelected', $scope.tarjetaGrid.selected.length);
                obtenerTarjetas();
            });
        }

        function del() {
            datosFijosVStarjetaService.eliminarTarjetas($scope.tarjetaGrid.selected)
                .then(() => {
                    Toast.showSuccess('La operación se realizó correctamente');
                    $scope.tarjetaGrid.selected = [];
                    $scope.$emit('updateSelected', $scope.tarjetaGrid.selected.length);
                    obtenerTarjetas();
                })
                .catch(err => Toast.showError(err));
        }
    }
})();