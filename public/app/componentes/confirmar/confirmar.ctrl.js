(function () {
    'use strict';

    angular
        .module('app')
        .controller('ConfirmarCtrl', ConfirmarCtrl);

    function ConfirmarCtrl($scope, $mdDialog, message) {
        $scope.message = message;
        $scope.aceptar = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }
})();