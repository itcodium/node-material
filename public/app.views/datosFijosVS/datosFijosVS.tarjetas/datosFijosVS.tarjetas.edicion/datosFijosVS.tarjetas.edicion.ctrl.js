(function () {
    'use strict';

    angular
        .module('app')
        .controller('datosFijosVS.tarjetas.edicion.ctrl', tarjetasEdicion);

    function tarjetasEdicion($scope, tarjeta, tarjetas, Toast, $mdDialog, datosFijosVStarjetaService, datosFijosVSService) {

        $scope.cancel = cancel;
        $scope.submit = submit;
        $scope.validateNumber = validateNumber;

        activate();
        //////////////////////////////////////////////
        
        function activate() {
            $scope.mode = tarjeta? 'Modificacion': 'Alta';
            $scope.tarjeta =  Object.assign(
                                { 
                                    codigoAltaTarjeta: 51,
                                    banco: '067'
                                }, tarjeta);
            obtenerTipoCuentas();
            obtenerOcupaciones();
        }

        /*** Eventos  ***/
        function submit() {
            const vm = this;
            const esModificacion = vm.mode === 'Modificacion';

            datosFijosVStarjetaService.guardarTarjeta(vm.tarjeta, tarjetas, esModificacion)
                .then((res) => {
                    $mdDialog.hide();
                })
                .catch(err => Toast.showError(err));
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

        function obtenerTipoCuentas() {
            datosFijosVSService.obtenerTipoCuentas().then(res => {
                $scope.tipoCuentas = res;
            }).catch(err => {
                Toast.showError(err);
            });
        }

        function obtenerOcupaciones() {
            datosFijosVStarjetaService.obtenerOcupaciones().then(res => {
                $scope.ocupaciones = res;
            }).catch(err => {
                Toast.showError(err);
            });
        }
    }
})();