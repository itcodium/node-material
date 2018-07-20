app.controller('usuariosList.ctrl',
    function ($scope, $mdDialog, $mdMedia, $mdToast, $resource, $location, datacontext, $filter, Global) {
        $scope.operac = "";

        $scope.optblah = false;
        $scope.selected = [];
        $scope.allUsuarios = [];
        $scope.fdUsuario = frontDoor();      //frontDoor :: funciones de acción

        $scope.gdUsuario = gridDoor();       //gridDoor :: funciones de la grilla

        //$scope.selected = [];  //aquí van a parar los registros seleccionados
        $scope.usuariosGrilla = {
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

        function usuariosGrillaQueryFilter(newVal) {
            if ($scope.allUsuarios.$resolved == true && newVal.toString() != '') {
                $scope.usuariosGrilla.data = $filter('filter')($scope.allUsuarios, newVal);
                $scope.usuariosGrilla.count = $scope.usuariosGrilla.data.length;
            }else{
                $scope.usuariosGrilla.data = $scope.allUsuarios;
                $scope.usuariosGrilla.count = $scope.usuariosGrilla.data.length;
            }
        }

        $scope.$watch('usuariosGrilla.query.filter',usuariosGrillaQueryFilter );

        $scope.initUsuarios = function(){
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
                $scope.promise = $resource('/api/usuarios/nivel').query(successUsuarios).$promise;
                $scope.selected = [];
                $scope.usuariosGrilla.selected = [];
                function successUsuarios(data) {
                    $scope.usuariosGrilla.count = data.length;
                    $scope.usuariosGrilla.data = data;
                    $scope.allUsuarios = data;
                    usuariosGrillaQueryFilter($scope.usuariosGrilla.query.filter);
                }
            }

            function add(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'usuario.add.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: {
                        scope: $scope,
                    },
                    templateUrl: 'app.views/usuarios/alta.html'
                }).then(getData);
            }

            function edit(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'usuario.edit.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: {
                        selected: $scope.selected[0]
                    },
                    templateUrl: 'app.views/usuarios/modificacion.html'
                }).then(getData);
            }

            function removeFilter() {
                $scope.usuariosGrilla.filter.show = false;
                $scope.usuariosGrilla.query.filter = '';
                if($scope.usuariosGrilla.filter.form.$dirty) {
                    $scope.usuariosGrilla.filter.form.$setPristine();
                }
            }
        }
    });


app.controller('usuario.add.ctrl',
    function ($mdDialog, $mdToast, $resource, $scope, scope, UserPrecarga, Global) {
        'use strict';
        console.log("user",user.nivelSeguridad);

        var vPerfil= $resource('/api/admin/perfilesPorNivel');
        vPerfil.query({},function(res) {
            $scope.perfiles=res;
        },function(err){
            if(err.status==401){
                $scope.showErrorToastUsuario('error', 'No está autorizado a gestionar perfiles');
            }else{
                $scope.showErrorToastUsuario('error', err.data.message);
            }
        });

        $scope.showErrorToastUsuario = function(type, msg) {
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

        $scope.showToastUsuarioSuccess = function() {
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
            $scope.showToastUsuarioSuccess();
            $mdDialog.hide(obj);
        }

        $scope.enviarDatos=function(){
            console.log("Enviar datos usuario.perfil",usuario.perfil);

            if($scope.usuario.perfil==null  ||  $scope.usuario.perfil=='' ||  typeof $scope.usuario.perfil=='undefined'){
                var x = document.getElementById("CboPerfil");
                x.className = "ng-dirty ng-pristine ng-empty ng-invalid ng-invalid-required ng-touched";
                return;
            }

            var iUsuario= new UserPrecarga($scope.usuario);
            iUsuario.$save(function (p, res) {
                success(res);
            }, function (err) {
                console.log("err", err)
                $scope.showErrorToastUsuario('error', err.data.message);
            });
        }
    });

app.controller('usuario.edit.ctrl',
    function ($mdDialog, $mdToast, $resource, $scope, selected, UserPrecarga, Global) {
        'use strict';
        $scope.usuario = angular.copy(selected);;
        $scope.perfilSelecionado = 0;
        var vUsuarios= $resource('/api/users/:userId', {userId:$scope.usuario.idUsuario});
        var vPerfil= $resource('/api/admin/perfilesPorNivel');

        vPerfil.query({},function(res) {
            $scope.perfiles=res;
            console.log($scope.perfiles);
            vUsuarios.query({},function(res) {
                $scope.usuario=res[0];
                $scope.perfilSelecionado = $scope.usuario.idPerfil;
            },function(err){
                $scope.showErrorToastUsuario('error', err.data.message);
            });
        },function(err){
            $scope.showErrorToastUsuario('error', err.data.message);
        });

        $scope.initPopUp = function(){
            $scope.operac = "Modificación";
        };

        $scope.showErrorToastUsuario = function(type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };

        $scope.showToastUsuarioSuccess = function() {
            $mdToast.show({
                template: '<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>',
                hideDelay: 3000,
                parent: '#toastSelect',
                position: 'top left'
            });
        };

        this.cancel = $mdDialog.cancel;

        function success(obj) {
            $scope.showToastUsuarioSuccess();
            $mdDialog.hide(obj);
        }

        $scope.enviarDatos=function(){
            $scope.usuario.idPerfil = $scope.perfilSelecionado;

            UserPrecarga.update({idUsuario: $scope.usuario.idUsuario}, $scope.usuario, function (res) {
                success(res);
            }, function (err) {
                $("#btnGuardar_Perfil").prop("disabled", false);
                $scope.showErrorToastUsuario('error', err.data.message);
            });
        }

    });



