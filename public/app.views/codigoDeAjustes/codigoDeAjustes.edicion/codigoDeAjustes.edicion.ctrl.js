(function () {
    'use strict';

    angular
        .module('app')
        .controller('codigoDeAjustes.edicion.ctrl', codigoDeAjusteEdicion);

    function codigoDeAjusteEdicion($scope, ajuste, ajustes, Toast, $mdDialog, CodigoDeAjustesService) {

        $scope.cancel = cancel;
        $scope.submit = submit;
        $scope.validateNumber = validateNumber;

        activate();
        //////////////////////////////////////////////
        function activate() {
            $scope.codigoAjustes =  Object.assign({}, ajuste);
            $scope.mode = $scope.codigoAjustes.entidad? 'Modificación': 'Alta';
            obtenerEntidades();
        }

        /*** Eventos  ***/
        function submit() {
            const vm = this;
            const codigoAjustes = vm.codigoAjustes;
            const esModificacion = $scope.mode !== 'Alta';

            CodigoDeAjustesService.guardarCodigoAjustes(codigoAjustes, ajustes, esModificacion)
                .then((res) => {
                    $mdDialog.hide();
                })
                .catch(err => Toast.showError(err))
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function validateNumber(event) {
            if (!(event.keyCode == 8 || event.keyCode == 0 || event.keyCode == 13) && 
                !(event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46 || event.keyCode == 44))
                event.preventDefault();
        }

        /*****Fin Eventos  ***/

        function obtenerEntidades() {
            $scope.entidades = [
                {
                    entidad: 67,
                    descripcion: 'VISA'
                },
                {
                    entidad: 667,
                    descripcion: 'AMEX'
                },
                {
                    entidad: 90,
                    descripcion: 'MASTER'
                },
                {
                    entidad: 91,
                    descripcion: 'MC MAKRO'
                },]
        }
    }

})();