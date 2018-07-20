(function () {
    'use strict';

    angular
        .module('app')
        .controller('cotizacion.ctrl', cotizacionCtrl);

    function cotizacionCtrl($scope, cotizacionService, Toast, $locale, $mdDialog, DialogConfirm) {
        //Seteo coma como separador de mil y . como separador de decimal
        $locale.NUMBER_FORMATS.GROUP_SEP = ',';
        $locale.NUMBER_FORMATS.DECIMAL_SEP = '.';

        $scope.dialogShow = dialogShow;
        $scope.onSelectRow = onSelectRow;
        $scope.delConfirm = delConfirm;
        $scope.onFilter = onFilter;

        activate();

        /////////////////////////////////////////

        function activate() {
            $scope.cotizacionGrid = initGrid();
            obtenerCotizaciones();
        }

        /**
         * Devuelve object model de grilla
         * @returns {{data: Array, count: number, selected: Array, query: {limit: number, page: number}, message: string}}
         */
        function initGrid() {
            return {
                data: [],
                count: 1,
                selected: [],
                "query": {
                    limit: 5,
                    page: 1
                },
                message: '',
                filtered: false,
                filter: {}
            };
        }

        function obtenerCotizaciones(filters) {
            $scope.promisecotizacion = cotizacionService
                .obtenerCotizaciones(filters)
                .then(res => {
                    $scope.cotizacionGrid.data = res;
                    $scope.cotizacionGrid.count = res.length;
                    $scope.cotizacionGrid.filtered = false;
                })
                .catch(err => Toast.showError(err, 'Error'));
        }

        function dialogShow() {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'cotizacion.edicion.ctrl',
                templateUrl: 'app.views/cotizacion/edicion/edicion.html',
                locals: {
                    cotizacion: $scope.cotizacionGrid.selected[0],
                    cotizaciones: $scope.cotizacionGrid.data
                }
            }).then(function () {
                Toast.showSuccess('La operación se realizó correctamente');
                $scope.cotizacionGrid.selected = [];
                obtenerCotizaciones();
            });
        }

        function onSelectRow(row, index) {
            if (row.selected)
                $scope.cotizacionGrid.selected.push(row);
            else
                $scope.cotizacionGrid.selected = $scope.cotizacionGrid.selected.filter(x => x.idCotizacion != row.idCotizacion);
        }

        function onFilter() {
            const filter = $scope.cotizacionGrid.query.filter;
            $scope.cotizacionGrid.filtered = true;

            obtenerCotizaciones(filter.month.format('YYYYMMDD'))
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
            cotizacionService.eliminarCotizaciones(vm.cotizacionGrid.selected)
                .then(() => {
                    Toast.showSuccess('La operación se realizó correctamente');
                    $scope.cotizacionGrid.selected = [];
                    obtenerCotizaciones();
                })
                .catch(err => Toast.showError(err));
        }
    }
})();