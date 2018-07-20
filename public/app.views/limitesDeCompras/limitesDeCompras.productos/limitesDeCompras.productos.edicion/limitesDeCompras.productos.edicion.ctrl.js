(function () {
    'use strict';

    angular
        .module('app')
        .controller('limitesDeCompras.productos.edicion.ctrl', productosEdicion);

    function productosEdicion($scope, producto, productos, $mdDialog, Global, Toast, limitesDeComprasProductosService) {

        $scope.cancel = cancel;
        $scope.submit = submit;
        $scope.validateNumber = validateNumber;

        activate();

        function activate() {
            $scope.producto =  Object.assign({}, producto);
            $scope.marcas = [1,2];
            $scope.mode = ($scope.producto.marca) ? 'Modificacion': 'Alta';
        }


        /*** Eventos  ***/
        function submit() {
            const usuario = Global.currentUser.name;
            const vm = this;
            const esModificacion = vm.mode === 'Modificacion';

            limitesDeComprasProductosService.guardarProducto(vm.producto, productos, esModificacion)
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
    }

})();