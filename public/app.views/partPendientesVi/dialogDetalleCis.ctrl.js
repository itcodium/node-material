/**
 * Created by nicolas.iglesias on 05/11/2017.
 */
/**
 * Created by nicolas.iglesias on 01/11/2017.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('dialogDetalleCis.ctrl', dialogDetalleCtrl);

    function dialogDetalleCtrl($scope, partPendientesViService, Toast,fecPago, $filter) {

        activate();

        /////////////////////////////////////////
        function activate() {
           $scope.detalleCisGrid = initGrid();
            loadGrids();
        }


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

        function loadGrids() {
            obtenerDetalleCis();

        }


        function obtenerDetalleCis() {
            $scope.promiseCie = partPendientesViService.obtenerDetalleCis(
                fecPago)
                .then( res => {
                    $scope.detalleCisGrid.data = res;
                    $scope.fecPago = new Date($scope.detalleCisGrid.data[0].fecPago);
                    $scope.fecPago.setDate($scope.fecPago.getDate() + 1 );
                    $scope.detalleCisGrid.count = res.length;
                    $scope.detalleCisGrid.totales = "Cant: " + $scope.detalleCisGrid.data[0].cant + '. Importe: ' + $scope.showVal($scope.detalleCisGrid.data[0].total, 'number');
                })
                .catch( err => Toast.showError(err,'Error'));
        }

        $scope.showVal = function(value, filter) {
            if (filter == 'date' && value != null & value != '')
                return moment(value).utc().format('DD/MM/YYYY');
            if (filter == 'number')
                return formatNumber(parseFloat(value),",","."); //$filter('number')(value, 2);
            if (filter == 'coef')
                return $filter('number')(value, 4);
            return value;
        };
        $scope.dateformat= function(value) {
            if (value!=null){
                var fecha=value.replace("Z"," ").replace("T"," ");
                return moment(fecha).local().format('DD/MM/YYYY');
            }
            return value;
        }
    }
})();