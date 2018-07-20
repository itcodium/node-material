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
        .controller('dialogDetalleCie.ctrl', dialogDetalleCtrl);

    function dialogDetalleCtrl($scope, partPendientesViService, Toast,nroCie, $filter) {

        activate();

        /////////////////////////////////////////

        function activate() {
           $scope.detalleCieGrid = initGrid();
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
            obtenerDetalleCie();

        }


        function obtenerDetalleCie() {
            $scope.promiseCie = partPendientesViService.obtenerDetalleCie(
                nroCie)
                .then( res => {
                $scope.detalleCieGrid.data = res;
            $scope.detalleCieGrid.count = res.length;
            $scope.detalleCieGrid.totales = "Cant: " + $scope.detalleCieGrid.data[0].cant + '. Importe: ' + $scope.showVal($scope.detalleCieGrid.data[0].total, 'number');
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



    }
})();