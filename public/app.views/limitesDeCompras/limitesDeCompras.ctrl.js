(function(){
    'use strict';

    angular
        .module('app')
        .controller('limitesDeCompras.ctrl', limitesDeComprasCtrl);

    function limitesDeComprasCtrl($scope, DialogConfirm) {
        /* jshint validthis:true */
        $scope.allCompras = [];
        $scope.placeholderName = 'Compras';

        $scope.add = add;
        $scope.delConfirm = delConfirm;
        $scope.edit = edit;
        $scope.$on('updateSelected', updateSelected);
        $scope.removeFilter = removeFilter;

        $scope.limitPurchaseGrilla = {
            "selected": [],

            "filter": {
                show: false,
                options: {
                    debounce: 500
                }
            },
            "query": {
                filter: '',
                limit: '5',
                order: 'nameToLower',
                page: 1
            }
        };


        $scope.$watch('limitPurchaseGrilla.query.filter', function (newVal) {
            $scope.$broadcast('filter', newVal);
        });

        activate();

        function activate() {
            $scope.reports = ['Coeficientes e Importes', 'Productos'];
            $scope.report = $scope.reports[0];
        }

        function add() {
            $scope.$broadcast('add');
        }

        function edit() {
            $scope.$broadcast('edit');
        }

        function del() {
            $scope.$broadcast('del');
        }

        function updateSelected(event, data) {
            $scope.cantSelected = data;
        }

        function delConfirm() {
            DialogConfirm.confirmation({
                message: '¿Está seguro que desea eliminar el/los registro/s seleccionado/s?',
                callback: del
            });
        }

        function removeFilter() {
            $scope.limitPurchaseGrilla.filter.show = false;
            $scope.limitPurchaseGrilla.query.filter = '';
        }

    }
})();

