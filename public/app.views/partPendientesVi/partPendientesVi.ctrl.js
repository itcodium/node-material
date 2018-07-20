/**
 * Created by nicolas.iglesias on 01/11/2017.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('partPendientesVi.ctrl', partPendientesViCtrl);

    function partPendientesViCtrl($scope, partPendientesViService, Toast,$mdDialog, $filter) {

        $scope.onSearch = onSearch;
        $scope.onFilter = onFilter;
        $scope.onChange = onChange;
        //$scope.exportarExcel = exportarExcel;
        activate();

        /////////////////////////////////////////

        function activate() {

            $scope.totCieGrid = initGrid();
            $scope.totCancelacionesGrid = initGrid();
            $scope.HistoricoGrid = initGrid();
            $scope.totEstVISACOGrid = initGrid();
            loadGrids();
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
                columns:  { id: 11, show: false, name: 'rownum', field: 'rownum', tip: ''},
                "query": {
                    limit: 5,
                    page: 1
                },
                message: '',
                filtered: false,
                filter: {}
            };
        }

        function loadGrids() {
            obtenerTotCie();
            obtenerTotCancelaciones();
            obtenerHistorico();
        }

        /*
         /*
         * Obtiene los datos para cargar la grilla de Totales VISACO
         */
        function obtenerTotCie(filters) {
            $scope.promiseCie = partPendientesViService
                .obtenerTotCie(filters)
                .then( res => {
                    $scope.totCieGrid.data = res;
                    $scope.totCieGrid.count = res.length;
                    //$scope.totCieGrid.cantidadTotal = 0;
                    //$scope.totCieGrid.importeTotal = 0;
                    //res.forEach(function(obj){$scope.totCieGrid.cantidadTotal+=obj.cant;$scope.totCieGrid.importeTotal+=obj.importe; });
                    $(".md-head md-checkbox").hide();
        })
        .catch( err => Toast.showError(err,'Error'));
        }

        /*
         * Obtiene los datos para cargar la grilla de Totales VISACO
         */
        function obtenerTotCancelaciones(filters) {
            $scope.promiseTotReclamosVISA = partPendientesViService
                .obtenerTotCancelaciones(filters)
                .then( res => {
                $scope.totCancelacionesGrid.data = res;
            $scope.totCancelacionesGrid.count = res.length;
        })
        .catch( err => Toast.showError(err,'Error'));
        }

        /*
         * Obtiene los datos para cargar la grilla de Totales VISACO
         */
        function obtenerHistorico(filters) {
            $scope.promiseTotVISAAsociados = partPendientesViService
                .obtenerHistorico(filters)
                .then( res => {
                    console.log("res historico -> ", res[1].total)
                $scope.HistoricoGrid.data = res[0];
                $scope.HistoricoGrid.count = res.length;
                $scope.HistoricoGrid.totalPendiente=res[1][0].total; // res[1].total

        })
        .catch( err => Toast.showError(err,'Error'));
        }



        $scope.appFormatNumber= function (nro,mil,decimal){
            if(typeof nro=='undefined' || nro==null){
                return nro;
            }
            function paddingRight(s, c, n) {
                s=s.toString();
                if (! s || ! c || s.length >= n) {
                    return s;
                }
                var max = (n - s.length)/c.length;
                for (var i = 0; i < max; i++) {
                    s += c;
                }
                return s;
            }
            mil=",";
            decimal=".";
            var res= nro.toString().replace(/\B(?=(\d{3})+(?!\d))/g, mil);
            var aNro=res.split(decimal)
            var decimalPadding;
            if(typeof aNro[1]=='undefined'){
                aNro[1]=0
            }
            decimalPadding=paddingRight(aNro[1],"0",2)
            return aNro[0]+decimal+decimalPadding;
        }


        function onSearch() {

            $scope.promisePromoTarjetas = partPendientesViService.obtenerPromotarjetas($scope.nroTarjeta)
                .then( res => {
                $scope.promoTarjetasGrid.data = res;
            $scope.promoTarjetasGrid.count = res.length;
        });

            $scope.promisePadronTD = partPendientesViService.obtenerPadronTD($scope.nroTarjeta)
                .then( res => {
                $scope.padronTDGrid.data = res;
            $scope.padronTDGrid.count = res.length;
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

/*
        function exportarExcel() {
            if ($scope.promoTarjetasGrid.data.length > 0 || $scope.padronTDGrid.data.length > 0) {
                let data = {
                    promoMacro: $scope.totCancelacionesGrid.data
                };
                partPendientesViService.exportarExcel(data)
                    .then((res) => {
                    const blob = new Blob([res.data],{type:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                const fileName = 'consulta_TD_' + moment(new Date).format('DDMMYYYYhhmmss');
                saveAs(blob, fileName);
            })
            }
            else
                Toast.showError('No existen datos para exportar');
        }
*/
        function onChange() {
            const vm = this;
            vm.frmPromo.filtered = false;
        }

        $scope.showVal = function(value, filter) {
            if (filter == 'date' && value != null & value != '') {
                return moment(value).utc().format('DD/MM/YYYY')
            }
            if (filter == 'number') {
                return formatNumber(parseFloat(value),",","."); //$filter('number')(value, 2);
            }
            if (filter == 'coef') {
                return $filter('number')(value, 4);
            }
            return value;
        };


        $scope.selectCheckbox=function(index, row){
            $scope.totCieGrid.selected=[];
            for(var i=0;i<$scope.totCieGrid.data.length;i++){
                if($scope.totCieGrid.data[i].rownum!=row.rownum){
                    $scope.totCieGrid.data[i].selected=false;
                }
            }
            if(row.selected==true){
                $scope.totCieGrid.selected.push(row);
            }
        };

        $scope.selectCheckboxCancelaciones=function(index, row){
            $scope.totCancelacionesGrid.selected=[];
            for(var i=0;i<$scope.totCancelacionesGrid.data.length;i++){
                if($scope.totCancelacionesGrid.data[i].rownum!=row.rownum){
                    $scope.totCancelacionesGrid.data[i].selected=false;
                }
            }
            if(row.selected==true){
                $scope.totCancelacionesGrid.selected.push(row);
            }
        };


        $scope.showAdvanced = function(ev) {
            $mdDialog.show({
                controller: 'dialogDetalleCie.ctrl',
                templateUrl: 'app.views/partPendientesVi/detalleCie.tmpl.html',
                targetEvent: ev,
                locals: {
                    nroCie: $scope.totCieGrid.selected[0].nroCie
                },
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then(function(
                ) {
                }, function() {
                });
        };

        $scope.convertToDate = function (stringDate){
            var dateOut = new Date(stringDate);
            dateOut.setDate(dateOut.getDate() + 1);
            return dateOut;
        };


        $scope.showDetailCis = function(ev) {
            var selectDate = new Date($scope.totCancelacionesGrid.selected[0].fecha);
            selectDate.setDate(selectDate.getDate() + 1);
            var day = '';
            var month = '';

            if(selectDate.getDate() < 10){
                day = '0'+selectDate.getDate();
            }else{
                day = selectDate.getDate();
            }
            if(selectDate.getMonth() < 9){
                month = selectDate.getMonth()+1;
                month = "0"+month;
            }else{
                month = selectDate.getMonth()+1;
            }
            var data = selectDate.getFullYear().toString()+month.toString()+day.toString();
            $mdDialog.show({
                controller: 'dialogDetalleCis.ctrl',
                templateUrl: 'app.views/partPendientesVi/detalleCis.tmpl.html',
                targetEvent: ev,
                locals: {
                    fecPago: data.toString()
                },
                clickOutsideToClose:true,
                fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
            })
                .then(function(
                ) {
                }, function() {
                });
        };

        $scope.dateformat= function(value) {
            if (value!=null){
                var fecha=value.replace("Z"," ").replace("T"," ");
                return moment(fecha).local().format('DD/MM/YYYY');
            }
            return value;
        }
        $scope.exportarExcel = function () {

            var url =  (!$scope.totCancelacionesGrid.selected[0]) ? "" : ('/api/partPendienteVi/exportCis?fecPago=' + moment($scope.totCancelacionesGrid.selected[0].fecha).utc().format('YYYYMMDD'));
            return url;
        }
    }
})();