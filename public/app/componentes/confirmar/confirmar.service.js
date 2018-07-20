(function () {
    'use strict';

    angular.module("app")
        .factory("DialogConfirm", DialogConfirm);

    function DialogConfirm($mdDialog) {
        const templateUrl = 'app/componentes/confirmar/confirmar.html';
        const controller = 'ConfirmarCtrl';

        const service = {
            confirmation : showConfirmation
        };

        return service;

        //////////////////

        function showConfirmation(options){
            return $mdDialog.show({
                controller: controller,
                templateUrl: templateUrl,
                locals: {
                    message: options.message
                },
                skipHide: true
            }).then(function (res) {
                if (options.callback) options.callback.call(options.context);
            }).catch(function () {

            });
        }
    }
})();