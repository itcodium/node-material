app.controller('apoderado.ctrl',
    function ($scope, $mdDialog, $mdMedia, $mdToast, $resource, $location, datacontext, $filter, Global) {

        $scope.showErrorToastApoderado = function(type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };

        $scope.showToastApoderadoSuccess = function() {
            $mdToast.show({
                template: '<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>',
                hideDelay: 3000,
                parent: '#toastSelect',
                position: 'top left'
            });
        };

        $scope.operac = "";

        $scope.optblah = false;
        $scope.selected = [];
        $scope.fdApoderado = frontDoor();      //frontDoor :: funciones de acción

        $scope.gdApoderado = gridDoor();       //gridDoor :: funciones de la grilla

        //$scope.selected = [];  //aquí van a parar los registros seleccionados
        $scope.apoderadoGrilla = {
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



        $scope.$watch('apoderadoGrilla.query.filter', function (newValue, oldValue) {
            var bookmark = 1;
            if(!oldValue) {
                bookmark = $scope.apoderadoGrilla.query.page;
            }

            if(newValue !== oldValue) {
                $scope.apoderadoGrilla.query.page = 1;
            }

            if(!newValue) {
                $scope.apoderadoGrilla.query.page = bookmark;
            }

            gridDoor().getData();
        });


        // FUNCIONES PRIVADAS, TODOS LOS MIERCOLES (2x1)

        function frontDoor(){
            return {
                ddd: function (text) {
                    alert('fuuuuuuck! ' + text  );
                },
                adddd: function (event) {
                    alert('fuuuuuuck! ' + event.name  );
                },

            };
        }

        function gridDoor(){

            var gridDoor = {
                getData: getData,
                onPaginate: onPaginate,
                deselect: deselect,
                log: log,
                loadStuff: loadStuff,
                onReorder: onReorder,
                del: del,
                add: add,
                edit: edit

            };

            return gridDoor;

            function onPaginate(page, limit) {
                // $scope.$broadcast('md.table.deselect');
                getData(angular.extend({}, $scope.query, {page: page, limit: limit}));
                //$scope.promise = $timeout(function () {
                //
                //}, 2000);
            }

            function deselect(index ,item) {
                $scope.selected.splice(index, 1);
            }

            function log(item) {
                $scope.selected.push(item);
            }

            function loadStuff() {
                $scope.promise = $timeout(function () {

                }, 2000);
            }

            function onReorder(order) {

                getData(angular.extend({}, $scope.query, {order: order}));
                $scope.promise = $timeout(function () {
                }, 2000);
            }

            function getData(query) {
                console.log(query);
                $scope.promise = $resource('/api/apoderado/').query(success).$promise;
                $scope.selected = [];
                $scope.apoderadoGrilla.selected = [];
                function success(data) {
                    $scope.apoderadoGrilla.count = data.length;
                    $scope.apoderadoGrilla.data = data;
                }
            }

            function add(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'apoderado.add.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: {scope: $scope},
                    templateUrl: 'app.views/apoderado/popUps.html'
                }).then(getData);
            }

            function edit(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'apoderado.edit.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: {selected: $scope.selected[0]},
                    templateUrl: 'app.views/apoderado/popUps.html'
                }).then(getData);
            }

            function del(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'apoderado.del.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: { apoderadosSeleccionados: $scope.selected },
                    templateUrl: 'app.views/apoderado/deletepopUp.html'
                }).then(getData);
            }
        }
    });


app.controller('apoderado.add.ctrl',
    function ($mdDialog, $mdToast, $resource, $scope, scope, Apoderados, Global) {
        'use strict';
        $scope.showErrorToastApoderado = function(type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };
        $scope.initPopUp = function(){
            $scope.operac = "Alta";
        };
        $scope.showToastApoderadoSuccess = function() {
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
            $scope.showToastApoderadoSuccess();
            $mdDialog.hide(obj);
        }

        this.confirmOperation = function (errors) {
            if(typeof errors.required == 'undefined') {
                $scope.apoderado.usuario = Global.currentUser.name;
                var vApoderado = new Apoderados($scope.apoderado);
                vApoderado.$save(function (p) {
                    if (p.result == "error") {
                        $scope.loading = false;
                    } else {
                        success(p);
                    }
                }, function (err) {
                    $scope.showErrorToastApoderado('error', err.data.message);
                    if (err.status == 401) {
                    }
                });
            }else{
                $scope.errorForm = true;
            }
        };

    });

app.controller('apoderado.edit.ctrl',
    function ($mdDialog, $mdToast, $resource, $scope, selected, Apoderados, Global) {
        'use strict';
        $scope.apoderado = angular.copy(selected);;
        console.log($scope.selected);
        $scope.operac = "Modificación";
        $scope.errorForm = false;
        $scope.initPopUp = function(){
            $scope.operac = "Modificación";
        }

        $scope.showErrorToastApoderado = function(type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };

        $scope.showToastApoderadoSuccess = function() {
            $mdToast.show({
                template: '<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>',
                hideDelay: 3000,
                parent: '#toastSelect',
                position: 'top left'
            });
        };

        this.cancel = $mdDialog.cancel;

        function success(obj) {
            $scope.showToastApoderadoSuccess();
            $mdDialog.hide(obj);
        }

        this.confirmOperation = function (errors) {
            if(typeof errors.required == 'undefined') {
                if (typeof  $scope.apoderado.codigo != 'undefined') {
                    $scope.apoderado.usuario = Global.currentUser.name;
                    Apoderados.update({idApoderado: $scope.apoderado.idApoderado}, $scope.apoderado, function (res) {
                        if (res.result == "error") {
                            $scope.loading = false;
                        }
                        else {
                            success(res);
                        }
                    }, function (err) {
                    });
                }
            }else{
                $scope.errorForm = true;
            }
        };

    });


app.controller('apoderado.del.ctrl',
    function (apoderadosSeleccionados, $mdDialog, $mdToast, $scope, $q, ApoderadosDelete, Global) {
        'use strict';

        var date = new Date();
        $scope.currentDate = date;
        $scope.fecBajaAll = new Date();
        $scope.operac = "Baja";
        $scope.apoderadoDeleteGrilla = {
            data : apoderadosSeleccionados
        };

        $scope.showErrorToastApoderado = function(type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };

        $scope.showToastApoderadoSuccess = function() {
            $mdToast.show({
                template: '<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>',
                hideDelay: 3000,
                parent: '#toastSelect',
                position: 'top left'
            });
        };

        this.cancel = $mdDialog.cancel;

        function borrarApoderado(obj, index) {
            obj.usuario = Global.currentUser.name;
            $scope.fecBajaAll.setHours(0);
            obj.fecBaja = $scope.fecBajaAll;
            ApoderadosDelete.delete({idApoderado: obj.idApoderado}, obj, function(res){
                if(res.result=="error"){
                    //alertar(res.message, "warning")
                    console.log("error");
                }
            });
        }

        function onComplete() {
            $scope.showToastApoderadoSuccess();
            $mdDialog.hide();
        }


        this.confirmOperation = function(errors){
            if(typeof errors.mindate == 'undefined' && typeof errors.valid == 'undefined' ) {
                if($scope.fecBajaAll != null) {
                    $q.all(apoderadosSeleccionados.forEach(borrarApoderado)).then(onComplete);
                }else{
                    $scope.showErrorToastApoderado('error', 'La Fecha de Baja no es valida.');
                }
            }else{
                if(typeof errors.mindate != 'undefined' ) {
                    $scope.showErrorToastApoderado('error', 'La Fecha de Baja no puede ser menor a la fecha actual.');
                }else {
                    $scope.showErrorToastApoderado('error', 'La Fecha de Baja no es valida.');
                }
            }
        }
    });