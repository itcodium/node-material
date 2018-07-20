(function () {
    'use strict';

    angular
        .module('app')
        .controller('limitesDeCompras.coeficientesImportes.edicion.ctrl', limitesDeComprasCoeficientesImportesEdicion);

    function limitesDeComprasCoeficientesImportesEdicion($scope, coeficienteImporte, coeficientesImportes, $mdDialog, Global, Toast, coeficientesImportesService) {

        $scope.cancel = cancel;
        $scope.submit = submit;
        $scope.validateNumber = validateNumber;
        activate();

        function activate() {
            $scope.coeficienteImporte = Object.assign({}, coeficienteImporte);
            $scope.mode = ($scope.coeficienteImporte.marca) ? 'Modificacion' : 'Alta';

            $scope.marcas = [1,2];
        }

        /*** Eventos  ***/
        function submit() {
            const usuario = Global.currentUser.name;
            const vm = this;
            const esModificacion = vm.mode === 'Modificacion';

            coeficientesImportesService.guardarCoeficientesImportes(vm.coeficienteImporte, coeficientesImportes, esModificacion)
                .then((res) => {
                    $mdDialog.hide();
                })
                .catch(err => Toast.showError(err));
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function validateNumber(event) {
            if (!(event.keyCode == 8 || event.keyCode == 0 || event.keyCode == 13) && 
                !(event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode == 46 || event.keyCode == 44))
                event.preventDefault();
        }
    }

})();