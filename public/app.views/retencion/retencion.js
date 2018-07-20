/**
 * Created by leandro.casarin on 06/04/2017.
 */
app.controller('Retenciones.ctrl',
    function ($scope, $mdDialog, $mdMedia, $mdToast, $resource, $location, datacontext, $filter, Global) {

        $scope.showErrorToastDocumento = function(type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };

        $scope.showToastDocumentoSuccess = function() {
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
        $scope.allDocumentos = [];
        $scope.provincias = [];
        $scope.fdDocumento = frontDoor();      //frontDoor :: funciones de acción

        $scope.gdDocumento = gridDoor();       //gridDoor :: funciones de la grilla

        //$scope.selected = [];  //aquí van a parar los registros seleccionados
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

        $scope.filtrarDocumentos = function (newVal) {
            if ($scope.allDocumentos.$resolved == true && newVal.toString() != '') {
                if($scope.documentoGrilla.query.page != 1){
                    $scope.documentoGrilla.query.page = 1;
                }
                $scope.documentoGrilla.data = $filter('filter')($scope.allDocumentos, {descripcionProv: newVal});
                $scope.documentoGrilla.count = $scope.documentoGrilla.data.length;
            }else{
                $scope.documentoGrilla.data = $scope.allDocumentos;
                $scope.documentoGrilla.count = $scope.documentoGrilla.data.length;
            }
        };

        $scope.$watch('documentoGrilla.query.filter', $scope.filtrarDocumentos);

        $scope.initDocumentos = function(){
            gridDoor().getData();
        };

        // FUNCIONES PRIVADAS, TODOS LOS MIERCOLES (2x1)

        function frontDoor(){
            return {
                ddd: function (text) {
                    alert('fuuuuuuck! ' + text  );
                },
                adddd: function (event) {
                    alert('fuuuuuuck! ' + event.name  );
                }
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
                console.log(query);
                $scope.promiseDocumento = $resource('/api/retencion/').query(successRetenciones).$promise;
                $scope.promisePlanCuenta= $resource('/api/retencionPlanCuenta/').query(successPlanCuenta).$promise;
                $scope.selected = [];
                $scope.documentoGrilla.selected = [];
                function successRetenciones(data) {
                    console.log("successRetenciones",data);
                    $scope.allDocumentos = data;
                    if ($scope.documentoGrilla.query.filter === "") {
                        $scope.documentoGrilla.count = data.length;
                        $scope.documentoGrilla.data = data;
                    }
                    else {
                        $scope.filtrarDocumentos($scope.documentoGrilla.query.filter);
                    }
                }

                function successPlanCuenta(pc) {
                    console.log("successPlanCuenta",pc);
                    $scope.cuentas = pc;
                }

            }

            function add(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'retencion.add.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: {
                        scope: $scope,
                        cuentas: $scope.cuentas
                    },
                    templateUrl: 'app.views/retencion/popUps.html'
                }).then(getData);
            }

            function edit(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'retencion.edit.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: {
                        selected: $scope.selected[0],
                        cuentas: $scope.cuentas
                    },
                    templateUrl: 'app.views/retencion/popUps.html'
                }).then(getData);
            }

            function del(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'retencion.del.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: { documentosSeleccionados: $scope.selected },
                    templateUrl: 'app.views/retencion/deletepopUp.html'
                }).then(getData);
            }

            function removeFilter() {
                $scope.documentoGrilla.filter.show = false;
                $scope.documentoGrilla.query.filter = '';
                if($scope.documentoGrilla.filter.form.$dirty) {
                    $scope.documentoGrilla.filter.form.$setPristine();
                }
            }
        }
    });


app.controller('retencion.add.ctrl',
    function ($mdDialog, $mdToast, $resource, $scope, scope, cuentas, Retenciones, Global) {
        'use strict';
        $scope.showErrorToastDocumento = function(type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };

        $scope.initPopUp = function(){
            $scope.operac = "Alta";
            $scope.cuentas = cuentas;
        };

        $scope.showToastDocumentoSuccess = function() {
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
            if(typeof errors.required == 'undefined') {
                $scope.retencion.usuario = Global.currentUser.name;
                console.log("vRetenciones",$scope.retencion.cuenta.idCuenta);
                $scope.retencion.idCuenta=$scope.retencion.cuenta.idCuenta;
                var vRetenciones = new Retenciones($scope.retencion);

                vRetenciones.$save(function (p) {
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
            }else{
                $scope.errorForm = true;
            }
        };

    });

app.controller('retencion.edit.ctrl',
    function ($mdDialog, $mdToast, $resource, $scope, selected, cuentas, Retenciones, Global,$http) {
        'use strict';
        $scope.retencion = angular.copy(selected); //
        console.log("Edit Retencion",$scope.retencion );
        $scope.errorForm = false;

        $scope.initPopUp = function(){
            $scope.operac = "Modificación";
            $scope.cuentas = cuentas;
            $scope.cuenta=_.findWhere($scope.cuentas , {idCuenta : $scope.retencion.idCuenta});
            $scope.retencion.cuenta=$scope.cuenta;
            console.log("resultado -> ",$scope.retencion.cuenta)
        }

        $scope.showErrorToastDocumento = function(type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };

        $scope.showToastDocumentoSuccess = function() {
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
            $scope.retencion.idCuenta=$scope.retencion.cuenta.idCuenta;
            console.log("confirmOperation",$scope.retencion );
            if(typeof errors.required == 'undefined') {
                console.log("typeof errors.required ==",errors.required );
                if (typeof  $scope.retencion.codRegimen != 'undefined') {
                   // console.log("$scope.retencion.codRegimen  ",$scope.retencion.codRegimen );
                    $scope.retencion.usuario = Global.currentUser.name;

                    var req = {
                        method: 'PUT',
                        url: '/api/retencion/'+$scope.retencion.idRegimen,
                        headers: {},
                        data: $scope.retencion
                    }

                    $http(req).then(function(res){
                        if (res.result == "error") {
                            $scope.loading = false;
                        }
                        else {
                            success(res);
                        }
                    }, function(err){
                        console.log("error -> ",err)
                        $scope.showErrorToastDocumento("error", err.data.message)
                    });
                }
            }else{
                $scope.errorForm = true;
            }
        };

    });


app.controller('retencion.del.ctrl',
    function (documentosSeleccionados, $mdDialog, $mdToast, $scope, $q, Retenciones, Global,$http) {
        'use strict';

        var date = new Date();
        $scope.currentDate = date;
        $scope.fecBajaAll = new Date();
        $scope.operac = "Baja";
        $scope.retencionGrilla = {
            data : documentosSeleccionados
        };

        $scope.showErrorToastDocumento = function(type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };

        $scope.showToastDocumentoSuccess = function() {
            $mdToast.show({
                template: '<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>',
                hideDelay: 3000,
                parent: '#toastSelect',
                position: 'top left'
            });
        };

        this.cancel = $mdDialog.cancel;

        function borrarDocumento(obj, index) {
            obj.usuario = Global.currentUser.name;
            $scope.fecBajaAll.setHours(0);
            obj.fecBaja = $scope.fecBajaAll;
            $scope.fecBaja=$scope.fecBajaAll;
            console.log("$scope.retencion[0]",documentosSeleccionados[0]);

            var req = {
                method: 'Post',
                url: '/api/retencion/delete/'+documentosSeleccionados[0].idRegimen,
                headers: {},
                data: documentosSeleccionados[0]
            }

            $http(req).then(function(res){
                if (res.result == "error") {
                    $scope.loading = false;
                }
            }, function(err){
                $scope.showErrorToastDocumento("error", err.data.message)
            });


            /*
            var c=documentosSeleccionados[0];
                c.fecBaja=obj.fecBaja;
            console.log("c",c);
            var data = $.param({
                fechaBaja: obj.fecBaja,
                test: "777"
            });
            Retenciones.delete({idRegimen: c.idRegimen},data ,function(res){
                if(res.result=="error"){
                    //alertar(res.message, "warning")
                    console.log("error");
                }
            });
            */

        }

        function onComplete() {
            $scope.showToastDocumentoSuccess();
            $mdDialog.hide();
        }


        this.confirmOperation = function(errors){
            if(typeof errors.mindate == 'undefined' && typeof errors.valid == 'undefined' ) {
                if($scope.fecBajaAll != null) {
                    $q.all(documentosSeleccionados.forEach(borrarDocumento)).then(onComplete);
                }else{
                    $scope.showErrorToastDocumento('error', 'La Fecha de baja no es valida.');
                }
            }else{
                if(typeof errors.mindate != 'undefined' ) {
                    $scope.showErrorToastDocumento('error', 'La Fecha de baja no puede ser menor a la fecha actual.');
                }else {
                    $scope.showErrorToastDocumento('error', 'La Fecha de baja no es valida.');
                }
            }
        }
    });
