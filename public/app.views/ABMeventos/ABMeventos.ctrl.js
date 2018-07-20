/**
 * Created by cristian.ovando on 17/08/2017.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('ABMeventos.ctrl', ABMeventosCtrl);


    function ABMeventosCtrl($scope, ABMEventosService, $mdDialog, Toast, DialogConfirm) {

        $scope.openAddForm = openAddForm;
        $scope.update = update;
        $scope.dialogDelete = dialogDelete;

        $scope.onSelectRow = onSelectRow;
        $scope.resetPage = resetPage;
        $scope.filtering = filtering;
        $scope.estaVigente = estaVigente;

        activate();

        /////////////////////////////////

        /**
         * Inicializacion de pantalla
         */
        function activate() {
            $scope.eventosGrid = initGrid();
            obtenerEventos();
        }

        function estaVigente(date) {
            return date? moment().isBefore(date) : true;
        }

        function obtenerEventos() {
            $scope.promiseEventos = ABMEventosService.obtenerEventos()
                .then((res) => {
                    $scope.eventosGrid.data = res;
                    $scope.eventosGrid.count = res.filter(x => x.fecBaja == null || moment().isBefore(x.fecBaja)).length;
                });
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

        function openAddForm() {
            dialogShow();
        }

        function update() {
            dialogShow();
        }

        function dialogShow() {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'ABMEventos.popup.ctrl',
                templateUrl: 'app.views/ABMeventos/ABMeventos.popup/ABMeventos.popup.html',
                focusOnOpen: false,
                targetEvent: event,
                locals: {
                    evento: $scope.eventosGrid.selected[0],
                    eventos: $scope.eventosGrid.data
                }
            }).then(function () {
                Toast.showSuccess('La operación se realizó correctamente');
                $scope.eventosGrid.selected = [];
                obtenerEventos();
            });
        }

        function dialogDelete() {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'ABMeventos.delete.ctrl',
                templateUrl: 'app.views/ABMeventos/ABMeventos.delete/ABMeventos.delete.html',
                focusOnOpen: false,
                targetEvent: event,
                locals: {
                    eventos: $scope.eventosGrid.selected
                }
            }).then(() => {
                Toast.showSuccess('La operación se realizó correctamente');
                $scope.eventosGrid.selected = [];
                obtenerEventos();
            }, () => {
                // cancelar
            });
        }

        function onSelectRow(row, index) {
            if (row.selected)
                $scope.eventosGrid.selected.push(row);
            else
                $scope.eventosGrid.selected = $scope.eventosGrid.selected.filter(x => x.codEvento != row.codEvento);
        }

        function resetPage() {
            $scope.eventosGrid.query.page = 1;
            if (!$scope.eventosGrid.query.showDeleted)
                $scope.eventosGrid.count = $scope.eventosGrid.data.filter(x => x.fecBaja == null || moment().isBefore(x.fecBaja)).length;
            else
                $scope.eventosGrid.count = $scope.eventosGrid.data.length;
        }

        function filtering(element) {
            if ($scope.eventosGrid.query.showDeleted){
                return $scope.eventosGrid.query.showDeleted;
            }
            else {
                return element.fecBaja == null || moment().isBefore(element.fecBaja);
            }
        }
    }
})();