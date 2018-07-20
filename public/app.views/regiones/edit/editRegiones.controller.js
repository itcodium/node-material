(function () {
  'use strict';

  angular
    .module('app')
    .controller('EditRegionesController', EditRegionesController);

  EditRegionesController.$inject = ['$mdDialog', '$mdToast', '$resource', '$scope', 'selected', 'parseRegiones', 'Regiones', 'Global', '$http'];
  /* @ngInject */
  function EditRegionesController($mdDialog, $mdToast, $resource, $scope, selected, parseRegiones, Regiones, Global, $http) {
    /* jshint validthis: true */
    var vm = this;

    $scope.regionSelected = angular.copy(selected);
    $scope.errorForm = false;
    $scope.initPopUp = function () {
      $scope.operac = "Modificación";
      $scope.dataRegiones = $scope.regionSelected;
    }

    $scope.showErrorToastDocumento = function (type, msg) {
      $mdToast.show({
        template: '<md-toast class="md-toast' + type + '">' + msg + '</md-toast>',
        hideDelay: 3000,
        parent: '.toastParent',
        position: 'top left'
      });
    };

    $scope.showToastDocumentoSuccess = function () {
      $mdToast.show({
        template: '<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>',
        hideDelay: 3000,
        parent: '#toastSelect',
        position: 'top left'
      });
    };

    this.cancel = $mdDialog.cancel;

    function success(obj) {
      $scope.showToastDocumentoSuccess();
      $mdDialog.hide(obj);
    }

    this.confirmOperation = function (errors) {
      var parameters = {
        codigo: $scope.dataRegiones.codigo,
        descripcion: $scope.dataRegiones.descripcion
      }

      if (typeof errors.required == 'undefined') {
        if (typeof $scope.dataRegiones.codigo != 'undefined') {
          parameters.usuario = Global.currentUser.name;

          var req = {
            method: 'PUT',
            url: '/api/region/' + parameters.codigo,
            headers: {},
            data: parameters
          }

          $http(req).then(function (res) {
            if (res.result == "error") {
              $scope.loading = false;
            }
            else {
              success(res);
            }
          }, function (err) {
            console.log("error -> ", err)
            $scope.showErrorToastDocumento("error", err.data.message)
          });
        }
      } else {
        $scope.errorForm = true;
      }
    };


  }
})();