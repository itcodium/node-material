(function () {
    'use strict';

    angular
        .module('app')
        .controller('promoTDConsulta.ctrl', promoTDConsultaCtrl);

    function promoTDConsultaCtrl($scope, promoTDConsultaService, Toast) {

        $scope.onSearch = onSearch;
        $scope.onFilter = onFilter;
        $scope.onChange = onChange;
        $scope.exportarExcel = exportarExcel;
        activate();

        /////////////////////////////////////////

        function activate() {
            $scope.archivosAsignadosGrid = initGrid();
            $scope.promoTarjetasGrid = initGrid();
            $scope.padronTDGrid = initGrid();
            obtenerArchivos();
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

        /**
         * Obtiene los datos para cargar la grilla de archivos asignados
         */
        function obtenerArchivos(filters) {
            $scope.promiseArchivosAsignados = promoTDConsultaService
                .obtenerArchivos(filters)
                .then( res => {
                    if (res) {
                        $scope.archivosAsignadosGrid.data = res;
                        $scope.archivosAsignadosGrid.count = res.length;
                    }
                })
                .catch( err => Toast.showError(err,'Error'));
        }

        function onSearch() {
            $scope.promoTarjetasGrid.count = 1;
            $scope.promisePromoTarjetas = promoTDConsultaService.obtenerPromotarjetas($scope.nroTarjeta)
                .then( res => {
                    if (res) {
                        $scope.promoTarjetasGrid.data = res;
                        $scope.promoTarjetasGrid.count = res.length;
                    }
                });

            $scope.padronTDGrid.count = 1;
            $scope.promisePadronTD = promoTDConsultaService.obtenerPadronTD($scope.nroTarjeta)
                .then( res => {
                    if (res) {
                        $scope.padronTDGrid.data = res;
                        $scope.padronTDGrid.count = res.length;
                    }
                });
            $scope.frmPromo.filtered = true;
        }

        function onFilter() {
            const vm = this;
            let fecDesde = vm.archivosAsignadosGrid.filter.fecDesde;
            let fecHasta = vm.archivosAsignadosGrid.filter.fecHasta;

            if ((fecDesde && fecHasta) || (!fecDesde && !fecHasta))
                if (moment(fecDesde).isSameOrBefore(moment(fecHasta))){
                    obtenerArchivos({fecDesde, fecHasta});
                    vm.archivosAsignadosGrid.filtered = true;
                }
                else
                    Toast.showError('La fecha desde debe ser menor o igual a la fecha hasta');
            else {
                Toast.showError('Favor de seleccionar un rango de fechas a filtrar');
            }
        }
        
        function exportarExcel() {
            if ($scope.promoTarjetasGrid.data.length > 0 || $scope.padronTDGrid.data.length > 0) {
                let data = {
                    promoMacro: $scope.promoTarjetasGrid.data,
                    padronVisa: $scope.padronTDGrid.data
                };
                promoTDConsultaService.exportarExcel(data)
                    .then((res) => {
                        const blob = new Blob([res.data],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                        const fileName = 'consulta_TD_' + moment(new Date).format('DDMMYYYYhhmmss');
                        saveAs(blob, fileName);
                    })
            }
            else
                Toast.showError('No existen datos para exportar');
        }

        function onChange() {
            const vm = this;
            vm.frmPromo.filtered = false;
        }
    }
})();