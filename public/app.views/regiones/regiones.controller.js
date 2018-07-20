(function () {
  'use strict';

  angular
    .module('app')
    .controller('RegionesController', RegionesController);

  RegionesController.$inject = ['$scope', '$resource', '$filter', '$mdDialog'];
  /* @ngInject */
  function RegionesController($scope, $resource, $filter, $mdDialog) {
    /* jshint validthis: true */
    var vm = this;

    $scope.operac = "";
    $scope.optblah = false;
    $scope.selected = [];
    $scope.allDocumentos = [];
    $scope.provincias = [];

    $scope.gdDocumento = gridDoor();       //gridDoor :: funciones de la grilla

    $scope.documentoGrilla = {
      "selected": [],

      "filter": {
        show: false,
        options: {
          debounce: 500
        }
      },
      "query": {
        filter: '',
        limit: '5',
        order: 'nameToLower',
        page: 1
      }
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

    $scope.filtrarDocumentos = function (newVal) {
      if ($scope.allDocumentos.$resolved == true && newVal.toString() != '') {
        if ($scope.documentoGrilla.query.page != 1) {
          $scope.documentoGrilla.query.page = 1;
        }
        $scope.documentoGrilla.data = $filter('filter')($scope.allDocumentos, newVal);
        $scope.documentoGrilla.count = $scope.documentoGrilla.data.length;
      } else {
        $scope.documentoGrilla.data = $scope.allDocumentos;
        $scope.documentoGrilla.count = $scope.documentoGrilla.data.length;
      }
    };

    $scope.$watch('documentoGrilla.query.filter', $scope.filtrarDocumentos);

    $scope.initDocumentos = function () {
      gridDoor().getData();
    };


    //////////////////////////////////////////////////

    function gridDoor() {

      var gridDoor = {
        getData: getData,
        onPaginate: onPaginate,
        deselect: deselect,
        log: log,
        loadStuff: loadStuff,
        onReorder: onReorder,
        del: del,
        add: add,
        edit: edit,
        resetPage: resetPage,
        removeFilter: removeFilter

      };

      return gridDoor;

      function onPaginate(page, limit) {
        getData(angular.extend({}, $scope.query, { page: page, limit: limit }));
      }

      function deselect(index, item) {
        $scope.selected.splice($scope.selected.indexOf(index), 1);
      }

      function log(item) {
        if (item.fecBaja == null) {
          $scope.showEdit = true;
          $scope.selected.push(item);
        } else {
          $scope.showEdit = false;
        }

      }

      function loadStuff() {
        $scope.promise = $timeout(function () {

        }, 2000);
      }

      function onReorder(order) {

        getData(angular.extend({}, $scope.query, { order: order }));
        $scope.promise = $timeout(function () {
        }, 2000);
      }

      function getData(query) {
        $scope.promiseDocumento = $resource('/api/region').query(successRegiones).$promise;

        $scope.selected = [];
        $scope.documentoGrilla.selected = [];
        function successRegiones(data) {

          $scope.allDocumentos = data;
          if ($scope.documentoGrilla.query.filter === "") {
            $scope.documentoGrilla.count = data.length;
            $scope.documentoGrilla.data = data;

            if (!$scope.documentoGrilla.query.showDeleted) {
              $scope.gdDocumento.resetPage();
            }

          } else {
            $scope.filtrarDocumentos($scope.documentoGrilla.query.filter);
          }
        }

      }

      function add(event) {
        $mdDialog.show({
          clickOutsideToClose: true,
          controller: 'AddRegionesController',
          controllerAs: 'ctrl',
          focusOnOpen: false,
          targetEvent: event,
          locals: {
            scope: $scope,
            parseRegiones: $scope.regiones
          },
          templateUrl: 'app.views/regiones/modal.html'
        }).then(getData);
      }

      function edit(event) {
        $mdDialog.show({
          clickOutsideToClose: true,
          controller: 'EditRegionesController',
          controllerAs: 'ctrl',
          focusOnOpen: false,
          targetEvent: event,
          locals: {
            selected: $scope.selected[0],
            parseRegiones: $scope.regiones
          },
          templateUrl: 'app.views/regiones/modal.html'
        }).then(getData);
      }

      function del(event) {
        $mdDialog.show({
          clickOutsideToClose: true,
          controller: 'DeleteRegionesController',
          controllerAs: 'ctrl',
          focusOnOpen: false,
          targetEvent: event,
          locals: { documentosSeleccionados: $scope.selected },
          templateUrl: 'app.views/regiones/modalDelete.html'
        }).then(getData);
      }

      function removeFilter() {
        $scope.documentoGrilla.filter.show = false;
        $scope.documentoGrilla.query.filter = '';
      }

      function resetPage() {
        $scope.documentoGrilla.query.page = 1;

        if (!$scope.documentoGrilla.query.showDeleted) {
          $scope.documentoGrilla.data = $scope.documentoGrilla.data.filter(element => element.fecBaja == null);
          $scope.documentoGrilla.count = $scope.documentoGrilla.data.length;
        } else {
          $scope.gdDocumento.getData();
        }

      };
    }


  }
})();