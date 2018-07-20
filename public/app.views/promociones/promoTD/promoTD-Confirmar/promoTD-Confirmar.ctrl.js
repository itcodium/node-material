/**
 * Created by cristian.ovando on 30/08/2017.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('promoTDAsoc.Confirmar.ctrl', promoTDAsocConfirmarCtrl);

    function promoTDAsocConfirmarCtrl($scope, $mdDialog, mensaje) {
        $scope.mensaje = mensaje;
        $scope.aceptar = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }
})();