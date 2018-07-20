app.controller('calendario.ctrl',
    function ($scope, $mdDialog, $mdMedia, $mdToast, $resource, $location, datacontext, $filter, Global) {

        $scope.showErrorToastCalendario = function(type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };

        $scope.showToastCalendarioSuccess = function() {
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
        $scope.allCalendarios = [];
        $scope.fdCalendario = frontDoor();      //frontDoor :: funciones de acción

        $scope.gdCalendario = gridDoor();       //gridDoor :: funciones de la grilla

        //$scope.selected = [];  //aquí van a parar los registros seleccionados
        $scope.calendarioGrilla = {
            "selected": [],
            "data": [],
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

        $scope.$watch('calendarioGrilla.query.filter', function (newVal) {
            //console.log("calendarioGrilla.query.filter newVal",newVal,$scope.allCalendarios);
            if ($scope.allCalendarios.$resolved == true && newVal.toString() != '') {

                $scope.calendarioGrilla.data = $filter('filter')($scope.allCalendarios, {periodo: newVal});
                $scope.calendarioGrilla.count = $scope.calendarioGrilla.data.length;
                console.log("IF calendarioGrilla.query.filter newVal",newVal,$scope.calendarioGrilla.data );
            }else{
                $scope.calendarioGrilla.data = $filter('filter')($scope.allCalendarios, {periodo: newVal});
                //$scope.calendarioGrilla.data = $scope.allCalendarios;
                $scope.calendarioGrilla.count = $scope.calendarioGrilla.data.length;

                console.log("ELSE calendarioGrilla.query.filter newVal",newVal,$scope.calendarioGrilla.data );
            }
        });

        $scope.initCalendario = function(){
            gridDoor().getData();
        }

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
                add: add,
                edit: edit,
                removeFilter: removeFilter

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
                console.log("query",query);
                $scope.promise = $resource('/api/calendario/').query(success).$promise;
                $scope.allCalendarios = [];
                $scope.calendarioGrilla.selected = [];

                function success(data) {
                    $scope.calendarioGrilla.count = data.length;
                    angular.forEach(data, function(key, value){
                        $scope.addHorasPopUp(key);
                        $scope.allCalendarios.push(key);
                    });
                    $scope.calendarioGrilla.data = $scope.allCalendarios;
                    $scope.selected = [];
                }
            }

            function add(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'calendario.add.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: {
                        scope: $scope,
                        allCalendarios: $scope.allCalendarios
                    },
                    templateUrl: 'app.views/calendario/popUps.html'
                }).then(getData);
            }

            function edit(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'calendario.edit.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: {
                        selected: $scope.selected[0]
                    },
                    templateUrl: 'app.views/calendario/popUps.html'
                }).then(getData);
            }

            function removeFilter() {
                $scope.calendarioGrilla.filter.show = false;
                $scope.calendarioGrilla.query.filter = '';
                if($scope.calendarioGrilla.filter.form.$dirty) {
                    $scope.calendarioGrilla.filter.form.$setPristine();
                }
            }
        }

        $scope.addHorasPopUp = function(sendScope){
            var fecControl= new Date(sendScope.fecControl);
            var fecCierre = new Date(sendScope.fecCierre);
            fecCierre.setHours(fecCierre.getHours() + 4);
            fecControl.setHours(fecControl.getHours() + 4);
            sendScope.fecCierre= fecCierre;
            sendScope.fecControl = fecControl;
        };
    });


app.controller('calendario.add.ctrl',
    function ($mdDialog, $mdToast, $resource, $scope, scope, allCalendarios, $filter, Calendarios,  Global) {
        'use strict';

        $scope.calendario = {};
        $scope.regex="^([0-9]{4})*-([0-9]{2})";
        $scope.regexOnlyNumbers= "^[1-4]{1}$";
        $scope.errorForm = false;
        $scope.minDateControl= null;

        $scope.changeFecha = function(){
            $scope.minDateControl = new Date(
                $scope.calendario.fecCierre.getFullYear(),
                $scope.calendario.fecCierre.getMonth(),
                $scope.calendario.fecCierre.getDate() +1);
        };

        $scope.showErrorToastCalendario = function(type, msg) {
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

        $scope.showToastCalendarioSuccess = function() {
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
            $scope.showToastCalendarioSuccess();
            $mdDialog.hide(obj);
        }

        this.confirmOperation = function (errors) {
            if(typeof errors.required == "undefined" && typeof errors.pattern == 'undefined') {
                if (typeof $scope.calendario.fecCierre != 'undefined' && typeof $scope.calendario.fecControl != 'undefined') {
                    var filter = $filter('filter')(allCalendarios, {periodo: $scope.calendario.periodo});
                    filter = $filter('filter')(filter, {instancia: $scope.calendario.instancia});
                    if (filter.length != 0) {
                        $scope.showErrorToastCalendario('error', 'Ya existe un registro con la instancia y el período ingresados.');
                        return;
                    } else {
                        $scope.calendario.usuario = Global.currentUser.name;
                        if ($scope.calendario.fecCierre < $scope.calendario.fecControl) {
                            var vCalendario = new Calendarios($scope.calendario);
                            vCalendario.$save(function (p) {
                                if (p.result == "error") {
                                    alert(p.result);
                                } else {
                                    success(p);
                                }
                            }, function (err) {
                                $scope.showErrorToastCalendario('error', err.data.message);
                                if (err.status == 401) {
                                }
                            });
                        } else {
                            $scope.showErrorToastCalendario('error', 'La Fecha de Control no puede ser menor a la Fecha de Cierre.');
                        }
                    }
                }
            }else{
                $scope.errorForm = true;
            }
        };

    });

app.controller('calendario.edit.ctrl',
    function ($mdDialog, $mdToast, $resource, $scope, selected, Calendarios, Global) {
        'use strict';

        $scope.changeFecha = function(){
            if(typeof $scope.calendario.fecCierre!= 'undefined')
            {
                $scope.minDateControl = new Date(
                    $scope.calendario.fecCierre.getFullYear(),
                    $scope.calendario.fecCierre.getMonth(),
                    $scope.calendario.fecCierre.getDate() +1
                );
            }
        };

        $scope.addHorasPopUp = function(sendScope){
            var fecControl= new Date(sendScope.fecControl);
            var fecCierre = new Date(sendScope.fecCierre);
            fecCierre.setHours(fecCierre.getHours() + 4);
            fecControl.setHours(fecControl.getHours() + 4);
            sendScope.fecCierre= fecCierre;
            sendScope.fecControl = fecControl;
        };

        $scope.errorForm = false;

        $scope.initPopUp = function(){
            $scope.operac = "Modificación";
            $scope.calendario = angular.copy(selected);
            $scope.addHorasPopUp($scope.calendario);
        }

        $scope.showErrorToastCalendario = function(type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };

        $scope.showToastCalendarioSuccess = function() {
            $mdToast.show({
                template: '<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>',
                hideDelay: 3000,
                parent: '#toastSelect',
                position: 'top left'
            });
        };

        this.cancel = $mdDialog.cancel;

        function success(obj) {
            $scope.showToastCalendarioSuccess();
            $mdDialog.hide(obj);
        }

        this.confirmOperation = function (errors) {
            if(typeof  $scope.calendario.fecCierre =='undefined') {
                $scope.showErrorToastCalendario('error','La fecha de cierre es requerida.');
                return;
            }
            if(typeof  $scope.calendario.fecControl =='undefined') {
                $scope.showErrorToastCalendario('error','La fecha de control es requerida.');
                return;
            }

            var fCierre=document.getElementById("fecCierre");
            if(fCierre.attributes['aria-invalid'].value=='true'){
                $scope.showErrorToastCalendario('error','La fecha de cierre no es  válida.');
                return;
            }

            var fControl=document.getElementById("fecControl");
            if(fControl.attributes['aria-invalid'].value=='true'){
                $scope.showErrorToastCalendario('error','La fecha de control no es  válida.');
                return;
            }

            if(typeof  $scope.calendario.idPeriodo !='undefined') {
            $scope.calendario.usuario = Global.currentUser.name;

            if ($scope.calendario.fecCierre < $scope.calendario.fecControl) {
                Calendarios.update({idPeriodo: $scope.calendario.idPeriodo}, $scope.calendario, function (res) {
                    if (res.result == "error") {
                        $scope.loading = false;
                    }
                    else {
                        success(res);
                    }
                }, function (err) {
                });
            }else{
                $scope.showErrorToastCalendario('error','La fecha de control no puede ser menor a la fecha de Cierre.');
            }
        }
        };

    });


