(function(){
    'use strict';

    angular
        .module('app')
        .controller('datosFijosVS.ctrl', datosFijosVSCtrl);

    function datosFijosVSCtrl($scope, DialogConfirm) {
        /* jshint validthis:true */
        $scope.add = add;
        $scope.edit = edit;
        $scope.delConfirm = delConfirm;
        $scope.$on('updateSelected', updateSelected);

        activate();

        function activate() {
            $scope.cantSelected = 0;
            $scope.query = { report: 'Cuentas' };
            $scope.reports = ['Cuentas', 'Tarjetas'];
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
    }
})();

