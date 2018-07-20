(function () {
    'use strict';

    angular
        .module('app')
        .controller('cantidadCuentasTarjetas.edicion.ctrl', cantidadCuentasTarjetasEdicion);

    function cantidadCuentasTarjetasEdicion($scope, cuenta, cuentas, Toast, $mdDialog, cantidadCuentasTarjetasService, Global) {
        $scope.cuenta = Object.assign({
            entidad: 67,
            codigoAltaCuenta: 50,
            codigoAltaTarjeta: 51
        },cuenta);
        $scope.cuentas = cuentas;

        function obtenerTipoCuentas() {
            cantidadCuentasTarjetasService.obtenerTipoCuentas()
                .then(function(res)  {
                    $scope.tipoCuentas = res;
                });
        }
        function obtenerSucursalesEDP() {
            cantidadCuentasTarjetasService.obtenerSucursalesEDP()
                .then(function(res)  {
                $scope.sucursales = res.filter(s => $scope.mode === 'Modificacion' || (s.marcaEDP === true && $scope.mode === 'Alta'));
                $scope.cuenta.descSucursal = res.filter(s => s.codSucursal_int === $scope.cuenta.sucursal).shift().descripSucursal;
            });
        }

        $scope.cancel = cancel;
        $scope.submit = submit;

        activate();

        function activate() {
            $scope.mode = ($scope.cuenta && $scope.cuenta.idEDPCant) ? 'Modificacion': 'Alta';
            obtenerSucursalesEDP();
            obtenerTipoCuentas();
        }

        $scope.ValidarSucursal = function (cuenta, cuentas){
            var aCuentas = cuentas.filter(obj => obj.sucursal.toString() === cuenta.sucursal.toString());
            if (aCuentas.length > 0){
                cuenta.NroSolicitudAltaCuenta = aCuentas[0].NroSolicitudAltaCuenta;
                cuenta.NroSolicitudAltaTarjeta = aCuentas[0].NroSolicitudAltaTarjeta;
            } else {
                cuenta.NroSolicitudAltaCuenta = 1;
                cuenta.NroSolicitudAltaTarjeta = 1;
            }
        };

        $scope.ValidarCodigoAltaCuenta = function (cuenta) {
            if (!cuenta.codigoAltaCuenta)
                cuenta.NroSolicitudAltaCuenta = null;
        };

        $scope.ValidarCodigoAltaTarjeta = function (cuenta) {
            if (!cuenta.codigoAltaTarjeta)
                cuenta.NroSolicitudAltaTarjeta = null;
        };

        /*** Eventos  ***/
        function submit() {
            const usuario = Global.currentUser.name;
            const vm = this;
            const cuenta = vm.cuenta;
            const esModificacion = $scope.mode == 'Modificacion';

            cantidadCuentasTarjetasService.guardar(cuenta, cuentas, usuario, esModificacion)
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