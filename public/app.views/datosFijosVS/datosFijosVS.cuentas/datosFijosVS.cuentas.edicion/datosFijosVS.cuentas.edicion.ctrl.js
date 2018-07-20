(function () {
    'use strict';

    angular
        .module('app')
        .controller('datosFijosVS.cuentas.edicion.ctrl', DatosFijosCuentaEdicion);

    function DatosFijosCuentaEdicion($scope, cuenta, cuentas, $mdDialog, datosFijosVSCuentasService, Toast) {

        $scope.cancel = cancel;
        $scope.submit = submit;
        $scope.validateNumber = validateNumber;

        activate();
        //////////////////////////////////////////////
        
        function activate() {
            $scope.cuenta =  Object.assign(
                                { 
                                    codigoAltaCuenta: 50,
                                    banco: '067'
                                }, cuenta);
            $scope.mode = $scope.cuenta.tipoCuenta? 'Modificacion': 'Alta';
            obtenerTipoCuentas();
        }

        /*** Eventos  ***/
        function submit() {
            const vm = this;
            const esModificacion = vm.mode === 'Modificacion';

            datosFijosVSCuentasService.guardarCuenta(vm.cuenta, cuentas, esModificacion)
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
            datosFijosVSCuentasService.obtenerTipoCuentas().then(res => {
                $scope.tipoCuentas = res;
            }).catch(err => {
                Toast.showError(err);
            });
        }
    }
})();