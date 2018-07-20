(function () {
    'use strict';

    angular
        .module('app')
        .controller('tarjetas.edicion.ctrl', tarjetasEdicion);

    function tarjetasEdicion($scope, comision, comisiones, Toast, $mdDialog, tarjetasService, Global) {

        $scope.cancel = cancel;
        $scope.submit = submit;
        $scope.validateNumber = validateNumber;

        activate();
        //////////////////////////////////////////////
        
        function activate() {
            $scope.comision =  Object.assign({ codEnte: 'RAP', tipoPago:'' }, comision);
            $scope.comision.tipoPago = $scope.comision.tipoPago.toString();
            $scope.mode = $scope.comision.idtarjetas? 'Modificacion': 'Alta';
            obtenerEntes()
        }

        /*** Eventos  ***/
        function submit() {
            const usuario = Global.currentUser.name;
            const vm = this;
            const comision = vm.comision;
            const esModificacion = $scope.mode == 'Modificacion';

            tarjetasService.guardarComision(comision, comisiones, usuario, esModificacion)
                .then((res) => {
                    $mdDialog.hide();
                })
                .catch(err => Toast.showError(err))
        }

        function cancel() {
            $mdDialog.cancel();
        }

        function validateNumber(event) {
            if (!(event.charCode == 8 || event.charCode == 0 || event.charCode == 13) && 
                !(event.charCode >= 48 && event.charCode <= 57 || event.charCode == 46 || event.charCode == 44))
                event.preventDefault();
        }

        /*****Fin Eventos  ***/

        function obtenerEntes() {
            $scope.entes = [{
                codEnte: 'RAP',
                descripcion: 'RapiPago'
            }]
        }
    }
})();