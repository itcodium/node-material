(function () {
  'use strict';

  angular
    .module('app')
    .controller('DeleteRegionesController', DeleteRegionesController);

  DeleteRegionesController.$inject = ['documentosSeleccionados', '$mdDialog', '$mdToast', '$scope', '$q','$http', 'Global'];
  /* @ngInject */
  function DeleteRegionesController(documentosSeleccionados, $mdDialog, $mdToast, $scope, $q, $http,Global) {
    /* jshint validthis: true */
    var vm = this;

    var date = new Date();
    $scope.currentDate = date;
    $scope.fecBajaAll = new Date();
    $scope.operac = "Baja";
    $scope.regionesGrilla = {
      data: documentosSeleccionados,
      selected: []
    };

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

    function borrarDocumento(obj, index) {
      var obj = {};

      //obj.usuario = Global.currentUser.name;
      $scope.fecBajaAll.setHours(0);
      obj.fecBaja = $scope.fecBajaAll;
      $scope.fecBaja = $scope.fecBajaAll;

      obj.codigo = documentosSeleccionados.reduce((ant, curr) => ant + '|' + curr.codigo, '') + '|';

      var req = {
        method: 'PUT',
        url: '/api/region/delete',
        headers: {},
        data: obj
      }

      $http(req).then(function (res) {
        if (res.result == "error") {
          $scope.loading = false;
        }
      }, function (err) {
        $scope.showErrorToastDocumento("error", err.data.message)
      });
    }

    function onComplete() {
      $scope.showToastDocumentoSuccess();
      $mdDialog.hide();
    }


    this.confirmOperation = function (errors) {
      if (typeof errors.mindate == 'undefined' && typeof errors.valid == 'undefined') {
        if ($scope.fecBajaAll != null) {
          $q.all(borrarDocumento()).then(onComplete);
        } else {
          $scope.showErrorToastDocumento('error', 'La Fecha de baja no es valida.');
        }
      } else {
        if (typeof errors.mindate != 'undefined') {
          $scope.showErrorToastDocumento('error', 'La Fecha de baja no puede ser menor a la fecha actual.');
        } else {
          $scope.showErrorToastDocumento('error', 'La Fecha de baja no es valida.');
        }
      }
    }

  }
})();