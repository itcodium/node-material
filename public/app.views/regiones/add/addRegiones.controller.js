(function () {
  'use strict';

  angular
    .module('app')
    .controller('AddRegionesController', AddRegionesController);

  AddRegionesController.$inject = ['$mdDialog', '$mdToast', '$resource', '$scope', 'scope', 'parseRegiones', 'Regiones', 'Global'];
  /* @ngInject */
  function AddRegionesController($mdDialog, $mdToast, $resource, $scope, scope, parseRegiones, Regiones, Global) {
    /* jshint validthis: true */
    var vm = this;

    $scope.showErrorToastDocumento = function (type, msg) {
      $mdToast.show({
        template: '<md-toast class="md-toast' + type + '">' + msg + '</md-toast>',
        hideDelay: 3000,
        parent: '.toastParent',
        position: 'top left'
      });
    };

    $scope.initPopUp = function () {
      $scope.operac = "Alta";
      $scope.regiones = parseRegiones;
    };

    $scope.showToastDocumentoSuccess = function () {
      $mdToast.show({
        template: '<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>',
        hideDelay: 3000,
        parent: '#toastSelect',
        position: 'top left'
      });
    };

    $scope = scope;
    $scope.errorForm = false;

    this.cancel = $mdDialog.cancel;
    function success(obj) {
      $scope.showToastDocumentoSuccess();
      $mdDialog.hide(obj);
    }

    this.confirmOperation = function (errors) {
      if (typeof errors.required == 'undefined') {
        $scope.dataRegiones.usuario = Global.currentUser.name;
        var vRegiones = new Regiones($scope.dataRegiones);

        vRegiones.$save(function (p) {
          if (p.result == "error") {
            $scope.loading = false;
          } else {
            success(p);
          }
        }, function (err) {
          $scope.showErrorToastDocumento('error', err.data.message);
          if (err.status == 401) {
          }
        });
      } else {
        $scope.errorForm = true;
      }
    };


  }
})();