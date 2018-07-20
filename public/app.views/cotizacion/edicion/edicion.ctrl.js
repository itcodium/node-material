(function () {
    'use strict';

    angular
        .module('app')
        .controller('cotizacion.edicion.ctrl', cotizacionEdicion);

    function cotizacionEdicion($scope, cotizacion, cotizaciones, Toast, $mdDialog, cotizacionService) {

        $scope.cancel = cancel;
        $scope.submit = submit;
        $scope.validateNumber = validateNumber;

        activate();
        //////////////////////////////////////////////
        function activate() {
            $scope.cotizacion =  Object.assign({}, cotizacion);
            $scope.cotizacion.dia = $scope.cotizacion.dia? new Date() : moment($scope.cotizacion.dia).toDate();
            $scope.mode = $scope.cotizacion.cotizacion? 'Modificación': 'Alta';
            obtenerMonedas();
        }

        /*** Eventos  ***/
        function submit() {
            const vm = this;
            const cotizacion = vm.cotizacion;
            const esModificacion = $scope.mode !== 'Alta';

            cotizacionService.guardarCotizacion(cotizacion, cotizaciones, esModificacion)
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

        function obtenerMonedas() {
            cotizacionService.obtenerMonedas()
            .then(res => {
                $scope.monedas = res;
            })
        }
    }

})();