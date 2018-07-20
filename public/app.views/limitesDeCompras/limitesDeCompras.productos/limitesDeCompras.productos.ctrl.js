(function () {
    'use strict';

    angular
        .module('app')
        .controller('limiteCompras.productos.ctrl', ABMproductos);

    function ABMproductos($scope, $mdDialog, limitesDeComprasProductosService, Toast, DialogConfirm) {
        $scope.filtering = '';

        $scope.onSelectRow = onSelectRow;
        $scope.$on('edit', dialogShow);
        $scope.$on('add', dialogShow);
        $scope.$on('del', del);
        $scope.$on('filter', filterTable);

        activate();

        //////////////////////////////////////////////////

        function activate() {
            $scope.productoGrid = initGrid();
            obtenerProductos();
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
                $scope.productoGrid.selected.push(row);
            } else {
                $scope.productoGrid.selected = $scope.productoGrid.selected.filter(x => x.idproducto != row.idproducto);
            }
            $scope.$emit('updateSelected', $scope.productoGrid.selected.length);
        }
        
        function delConfirm() {
            DialogConfirm.confirmation({
                message: '¿Está seguro que desea eliminar el/los registro/s seleccionado/s?',
                callback: del,
                context: this
            })
        }
        /*----------------------------------------------------*/

        function obtenerProductos() {
            $scope.promiseObj = limitesDeComprasProductosService.obtenerProductos()
                .then(res => {
                    $scope.productoGrid.data = res;
                });
            $scope.$emit('updateSelected', $scope.productoGrid.selected.length);
        }

        function dialogShow() {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'limitesDeCompras.productos.edicion.ctrl',
                templateUrl: 'app.views/limitesDeCompras/limitesDeCompras.productos/limitesDeCompras.productos.edicion/limitesDeCompras.productos.edicion.html',
                focusOnOpen: false,
                locals: {
                    producto: $scope.productoGrid.selected[0],
                    productos: $scope.productoGrid.data
                }
            }).then(function () {
                Toast.showSuccess('La operación se realizó correctamente');
                $scope.productoGrid.selected = [];
                obtenerProductos();
            });
        }

        function del() {
            limitesDeComprasProductosService.eliminarProductos($scope.productoGrid.selected)
                .then(() => {
                    Toast.showSuccess('La operación se realizó correctamente');
                    $scope.productoGrid.selected = [];
                    obtenerProductos();
                })
                .catch(err => Toast.showError(err));
        }

        function filterTable(evt, data) {
            //Select attributes needed to filter
            let updateArray = $scope.productoGrid.data.map(value => {
                const mapArray = {
                    marca: value.marca,
                    tipoCuenta: value.tipoCuenta,
                    minimo: value.minimo
                }

                return mapArray;
            });
            $scope.productoGrid.data = updateArray;

            //Replace comma for search
            $scope.filtering = data.replace (/,/g, "");
        }
    }
})();