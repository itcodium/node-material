(function () {
    'use strict';

    angular
        .module('app')
        .controller('ABMeventos.delete.ctrl', ABMeventosDeleteCtrl);

    function ABMeventosDeleteCtrl($scope, eventos, DialogConfirm, ABMEventosService, Global, $mdDialog) {

        $scope.cancel = cancel;
        $scope.submit = submit;

        activate();

        /////////////////////////

        function activate() {
            $scope.eventosDelete = initGrid();
            $scope.fecBaja = new Date();
            $scope.eventosDelete.data = eventos;

            $scope.currentDate = new Date()
        }

        function initGrid() {
            let grid = {
                data: [],
                count: 1,
                selected: [],
                "query": {
                    limit: 5,
                    page: 1
                },
                message: ''
            };
            return grid;
        }

        function submit() {
            let vm = this;
            const eventosDelete = vm.eventosDelete.data.reduce((ant, curr) => ant + '|' + curr.idEvento, '') + '|';
            const fecBaja = vm.fecBaja;
            ABMEventosService.bajaEventos(eventosDelete, fecBaja, Global.currentUser.name)
                .then(res => {
                    $mdDialog.hide('Se dio de baja correctamente');
                })
                .catch(err => {
                    Toast.showError(err.message);
                })
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }
})();