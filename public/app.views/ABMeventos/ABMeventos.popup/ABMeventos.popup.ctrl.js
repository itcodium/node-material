(function () {
    'use strict';

    angular
        .module('app')
        .controller('ABMEventos.popup.ctrl', ABMeventosPopupCtrl);

    function ABMeventosPopupCtrl($scope, ABMEventosService, $mdDialog, Global, evento, eventos, Toast) {

        $scope.cancel = cancel;
        $scope.submit = submit;
        activate();

        ////////////////////////////

        function activate() {
            $scope.evento =  Object.assign({}, evento);
            $scope.mode = $scope.evento.idEvento? 'Modificacion': 'Alta';
            obtenerGrupos()

        }

        function obtenerGrupos() {
            ABMEventosService.obtenerEventoGrupos()
                .then((res) => {
                    $scope.eventoGrupos = res;
                })
        }

        function submit() {
            const usuario = Global.currentUser.name;
            const vm = this;
            const evento = vm.evento;

            if ($scope.mode == 'Modificacion' || validoOk(evento, eventos)) {
                ABMEventosService.guardarEvento(evento, usuario)
                    .then((res) => {
                        $mdDialog.hide();
                    })
                    .catch(err => Toast.showError(err))
            }
            else
                Toast.showError(`Ya existe la asociación del código de evento con ese grupo `);
        }

        function validoOk(evento, eventos) {
            const valid = eventos.filter(x => x.codEvento == evento.codEvento
                                    && x.codEventoGrupos == evento.codEventoGrupos
                                    && x.fecBaja == null).length == 0;
            return valid;
        }

        function cancel() {
            $mdDialog.cancel();
        }
    }
})();