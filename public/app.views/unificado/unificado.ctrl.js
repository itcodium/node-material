(function(){
    'use strict';

    angular
        .module('app')
        .controller('unificado.ctrl', unificadoCtrl);

    function unificadoCtrl($scope, $locale, UnificadoService) {
        /* jshint validthis:true */
        $locale.NUMBER_FORMATS.GROUP_SEP = ',';
        $locale.NUMBER_FORMATS.DECIMAL_SEP = '.';

        $scope.add = add;
        $scope.onFilter = onFilter;
        $scope.exportarAExcel = exportarAExcel;
        $scope.refresh = refresh;
        $scope.$on('updateSelected', updateSelected);
        $scope.$on('setFecProceso', setFecProceso);

        activate();

        function activate() {
            $scope.cantSelected = 0;
            $scope.query = { report: 'Tarjetas' };
            $scope.reports = [ 'Cuentas', 'Tarjetas'];
            $scope.filters = {};

            obtenerTipoNovedades();
        }

        function refresh() {
            obtenerTipoNovedades();
        }

        function obtenerTipoNovedades() {
            UnificadoService.obtenerTipoNovedades()
                .then((res) => {

                    $scope.tipoNovedades = res.filter(element => $scope.query.report.toUpperCase().includes(element.novedad));
                    $scope.tipoNovedades = $scope.tipoNovedades.map(n => {
                        n.value = n.descripcion;
                        return n;
                    })
                    $scope.tipoNovedades.unshift({descripcion: 'Todas', value: null});
                    $scope.filters.tipoNovedad = $scope.tipoNovedades[0].value;
                })
        }

        function add() {
            $scope.$broadcast('add');
        }

        function updateSelected(event, data) {
            $scope.cantSelected = data;
        }

        function setFecProceso(event, fecha) {
            $scope.filters.fecProceso = fecha;
            onFilter();
        }

        function onFilter() {
            $scope.$broadcast('onFilter', $scope.filters);
        }

        function exportarAExcel() {
            $scope.$broadcast('exportarAExcel');
        }
    }
})();

