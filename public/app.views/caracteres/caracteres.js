/**
 * Created by BP4-Admin on 25/04/2016.
 */
app.controller('caracteres.ctrl', function ($scope, $resource, $mdDialog, $mdEditDialog, $mdToast, Caracteres, Global, $q) {
    $scope.showErrorToastCaracteres = function(type, msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
            hideDelay: 3000,
            parent: '.toastParent',
            position: 'top left'
        });
    };

    $scope.showToastCategoriaSuccess = function() {
        $mdToast.show({
            template: '<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>',
            hideDelay: 3000,
            parent: '.toastParent',
            position: 'top left'
        });
    };

    $scope.operac = "";
    $scope.promise = null;
    $scope.optblah = false;
    $scope.selected = [];
    $scope.gdCaracteres = gridDoor();       //gridDoor :: funciones de la grilla

    //$scope.selected = [];  //aquí van a parar los registros seleccionados
    $scope.caracteresGrilla = {
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


    $scope.$watch('caracteresGrilla.query.filter', function (newValue, oldValue) {
        var bookmark = 1;
        if(!oldValue) {
            bookmark = $scope.caracteresGrilla.query.page;
        }

        if(newValue !== oldValue) {
            $scope.caracteresGrilla.query.page = 1;
        }

        if(!newValue) {
            $scope.caracteresGrilla.query.page = bookmark;
        }

        gridDoor().getData();
    });

    function gridDoor(){

        var gridDoor = {
            getData: getData,
            editCaracEspecial: editCaracEspecial,
            editReemplazarPor: editReemplazarPor,
            editSigno: editSigno,
            onPaginate: onPaginate,
            deselect: deselect,
            log: log,
            loadStuff: loadStuff,
            onReorder: onReorder,
            add: add
        };

        return gridDoor;

        function editField(param) {
            param.event.stopPropagation();
            var promise = $mdEditDialog.large({
                modelValue: param.initialValue,
                placeholder: 'Ingresar ' + param.msg,
                save: function (input) {
                    if (param.callback) {
                        param.callback(input);
                    }
                    param.data.modificadoPor = Global.currentUser.name;
                    updateField(param.data, param.onError);
                },
                targetEvent: param.event,
                title: 'Modificar ' + param.msg,
                controlTemplate: param.controlTemplate,
                validators: {
                    'md-maxlength': 1,
                    'ng-required': true
                }
            });

            promise.then(function (ctrl) {
                var input = ctrl.getInput();

                input.$viewChangeListeners.push(function () {
                    input.$setValidity('test', input.$modelValue !== 'test');
                });
            });
        }

        function editReemplazarPor(event, data) {
            var originalValue = data.remplazarPor;
            editField({
                event: event,
                data: data,
                initialValue: data.remplazarPor,
                msg: 'reemplazar por',
                callback: function (input) {
                    data.remplazarPor = input.$modelValue;
                    data.caracEspecialNuevo = data.caracEspecial;
                },
                onError: function () {
                    data.remplazarPor = originalValue;
                },
                controlTemplate: '<input name="input" ng-model="model"' +
                                 ' md-autofocus md-maxlength="1" placeholder="Reemplazar por"' +
                                 ' maxlength="1">' +
                                 '</input>'
            });
        }

        function editSigno(event, data) {
            var originalValue = data.signo;
            editField({
                event: event,
                data: data,
                initialValue: data.signo,
                msg: 'signo',
                callback: function (input) {
                    data.signo = input.$modelValue;
                    data.caracEspecialNuevo = data.caracEspecial;
                },
                onError: function () {
                    data.signo = originalValue;
                },
                controlTemplate: '<label>Signo</label>' +
                                 '<md-select name="input" ng-model="model">' +
                                 '<md-option value="1" >1</md-option>' +
                                 '<md-option value="-1" >-1</md-option>' +
                                 '</md-select>'
            });
        }

        function editCaracEspecial(event, data) {
            editField({
                event: event,
                data: data,
                initialValue: data.caracEspecial,
                msg: 'caracter especial',
                callback: function (input) {
                    data.caracEspecialNuevo = input.$modelValue;
                },
                controlTemplate: '<input name="input" ng-model="model"' +
                                 ' md-autofocus md-maxlength="1" placeholder="Caracter Especial"' +
                                 ' maxlength="1">' +
                                 '</input>'
            });
        }

        function updateField(data, onError) {
            console.log(data);
            var deferred = $q.defer();
            $scope.promise = deferred.promise;
            Caracteres.update(data, function (res) {
                deferred.resolve();
                $scope.showToastCategoriaSuccess();
                getData();
            },
            function (err) {
                if (onError) {
                    onError();
                }
                deferred.resolve();
                $scope.showErrorToastCaracteres('error', err.data.message);
            });
        }

        function onPaginate(page, limit) {
            getData(angular.extend({}, $scope.query, {page: page, limit: limit}));

            console.log('Scope Page: ' + $scope.caracteresGrilla.query.page + ' Scope Limit: ' + $scope.caracteresGrilla.query.limit);
            console.log('Page: ' + page + ' Limit: ' + limit);
        }

        function deselect(index, item) {
            $scope.selected.splice(index, 1);
        }

        function log(item) {
            if(item.fecBaja != null) {
                var itemBaja = angular.copy(item);
                itemBaja.fecBaja = new Date(itemBaja.fecBaja);
                itemBaja.fecBaja.setDate(itemBaja.fecBaja.getDate() + 1);
                $scope.selected.push(itemBaja);
            }
            else
                $scope.selected.push(item);
        }

        function loadStuff() {
            $scope.promise = $timeout(function () {

            }, 2000);
        }

        function onReorder(order) {

            getData(angular.extend({}, $scope.query, {order: order}));

            console.log('Scope Order: ' + $scope.caracteresGrilla.query.order);
            console.log('Order: ' + order);

            $scope.promise = $timeout(function () {

            }, 2000);
        }

        function getData(query) {
            $scope.promise = $resource('/api/caracteresEspeciales/').query(success).$promise;
            $scope.selected = [];
            $scope.caracteresGrilla.selected = [];
            function success(data) {
                console.log(data)
                $scope.caracteresGrilla.count = data.length;
                $scope.caracteresGrilla.data = data;
            }
        }

        function add(event) {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'caracteres.add.ctrl',
                controllerAs: 'ctrl',
                focusOnOpen: false,
                hasBackdrop: false,
                targetEvent: event,
                locals: {scope: $scope},
                templateUrl: 'app.views/caracteres/addPopUp.html'
            }).then(getData);
        }
    }
});

app.controller('caracteres.add.ctrl', function ($scope, Global, $timeout, scope, $mdDialog, Caracteres, $mdToast) {
    'use strict';
    
    var addButton = angular.element('#addButton')[0].getBoundingClientRect();
    $timeout(function () {
        var dialog = angular.element('md-dialog');
        dialog.css('position', 'fixed');
        dialog.css('top', addButton.top);
        dialog.css('left', addButton.left - dialog.width());
    });
    
    $scope = scope;
    
    $scope.caracter = {
        caracEspecial: '',
        remplazarPor: '',
        signo: '',
        creadoPor: Global.currentUser.name
    };
    $scope.submitted = false;

    $scope.showErrorToastCaracteres = function(type, msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
            hideDelay: 3000,
            parent: '.toastParent',
            position: 'top left'
        });
    };

    $scope.showToastCategoriaSuccess = function() {
        $mdToast.show({
            template: '<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>',
            hideDelay: 3000,
            parent: '.toastParent',
            position: 'top left'
        });
    };

    $scope.dismiss = function() {
        $mdDialog.hide();
    };

    $scope.submit = function () {
        $scope.submitted = true;
        if ($scope.addDialog.$valid) {
            if (scope.caracter.signo === '') {
                scope.caracter.signo = null;
            }
            var vCaracteres = new Caracteres($scope.caracter);
            vCaracteres.$save(function (p) {
                $scope.showToastCategoriaSuccess();
                $mdDialog.hide();
            }, function (err) {
                $scope.showErrorToastCaracteres('error', err.data.message);
            });
        }
    };
});