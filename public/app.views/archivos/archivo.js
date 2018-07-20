app.controller('archivosMarca.ctrl',
    function ($scope, $mdDialog, $mdMedia, $mdToast, $resource, $location, datacontext, $filter, Global) {

        $scope.operac = "";

        $scope.optblah = false;
        $scope.fdArchivo = frontDoor();      //frontDoor :: funciones de acción
        $scope.allArchivos = [];
        $scope.gdArchivo = gridDoor();       //gridDoor :: funciones de la grilla

        //$scope.selected = [];  //aquí van a parar los registros seleccionados
        $scope.archivosGrilla = {

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
            },
            selected: null
        };

        $scope.selectMarca = function(index, row){
            $('#marcas md-checkbox').not($("#Marca_"+ index + "")).removeClass('md-checked');
            if( !($('#Marca_'+ index + '').hasClass("md-checked")))
            {
                $("#Marca_" + index + "").addClass("md-checked");
                $scope.archivosGrilla.selected = row;
            }else{
                $scope.archivosGrilla.selected = null;
                $('#marcas md-checkbox').removeClass('md-checked');
            }
        };

        $scope.$watch('archivosGrilla.query.filter', function (newVal) {
            if ($scope.allArchivos.$resolved == true && newVal.toString() != '') {
                $scope.archivosGrilla.data = $filter('filter')($scope.allArchivos, newVal);
                $scope.archivosGrilla.count = $scope.archivosGrilla.data.length;
            }else{
                $scope.archivosGrilla.data = $scope.allArchivos;
                $scope.archivosGrilla.count = $scope.archivosGrilla.data.length;
            }
        });

        $scope.initGrid = function(){
            gridDoor().getData();
        };

        $scope.add = function (event) {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'archivosMarca.abm.ctrl',
                controllerAs: 'ctrl',
                focusOnOpen: false,
                targetEvent: event,
                locals: { gridDoor: $scope.gdArchivo, selected: undefined },
                templateUrl: 'app.views/archivos/popUp.html',
                onRemoving: $scope.gdArchivo.getData()
            }).then($scope.gdArchivo.getData());
        };

        $scope.del = function (event) {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'archivosMarca.abm.ctrl',
                controllerAs: 'ctrl',
                focusOnOpen: false,
                targetEvent: event,
                locals: { gridDoor: $scope.gdArchivo, selected: $scope.archivosGrilla.selected },
                templateUrl: 'app.views/archivos/popUp.html',
                onRemoving: $scope.gdArchivo.getData()
            }).then($scope.gdArchivo.getData());
        };

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
                removeFilter: removeFilter,
                exportarExcel: exportarExcel
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
                $scope.promise = $resource('/api/archivosMarca/').query(success).$promise;
                $scope.archivosGrilla.selected = null;
                function success(data) {
                    $scope.archivosGrilla.count = data.length;
                    $scope.archivosGrilla.data = data;
                    $scope.allArchivos = data;
                }
            }

            function removeFilter() {
                $scope.archivosGrilla.filter.show = false;
                $scope.archivosGrilla.query.filter = '';
                if($scope.archivosGrilla.filter.form.$dirty) {
                    $scope.archivosGrilla.filter.form.$setPristine();
                }
            }
            
            function exportarExcel() {
                var urlExport = '/api/reportes/archivosMarca/exportar';
                
                return urlExport;
            }
        }
    });

app.controller('archivosMarca.abm.ctrl', function ($scope, selected, gridDoor, $resource, $mdDialog, $mdToast, Global, Marcas, MarcasDelete) {
    'use strict';

    $scope.currentDate = new Date();
    $scope.marca = {};
    $scope.marcas = [
        { nombre: 'MasterCard', valor: 'MC' },
        { nombre: 'Visa', valor: 'VI' },
        { nombre: 'American Express', valor: 'AX' }
    ];
    $scope.carteras = ['1', '2', '3', '4'];
    $scope.grupos = [];
    $scope.operac = "Alta";
    $scope.errorForm = false;
    this.cancel = $mdDialog.cancel;

    $scope.initPopUp = function () {
        $scope.operac = "Alta";
        if (selected) {
            $scope.marca = selected;
            $scope.marca.fecBaja = $scope.currentDate;
            $scope.operac = "Baja";
        }
        $scope.grupos = $resource('/api/archivosMarca/grupos').query(function (data) {
            $scope.grupos = data;
        });
    };

    this.confirmOperation = function (errors) {
        if(errors.required === undefined) {
            if ($scope.marca.idMarca !== undefined) {
                $scope.marca.usuario = Global.currentUser.name;
                MarcasDelete.delete({ idMarca: $scope.marca.idMarca, usuario: Global.currentUser.name, fecBaja: $scope.marca.fecBaja }, $scope.marca,
                    function (res) {
                        if (res.name === "RequestError") {
                            $scope.loading = false;
                            $scope.showErrorToastMarcas('error', res.message);
                        }
                        else {
                            success(res);
                        }
                    },
                    function (err) {
                        $scope.showErrorToastMarcas('error', err.data.message);
                    });
            }
            else {
                $scope.marca.usuario = Global.currentUser.name;
                var vMarca = new Marcas($scope.marca);
                vMarca.$save(function (p) {
                    if (p.name === "RequestError") {
                        $scope.loading = false;
                        $scope.showErrorToastMarcas('error', p.message);
                    } else {
                        success(p);
                    }
                }, function (err) {
                    $scope.showErrorToastMarcas('error', err.data.message);
                });
            }
        }
        else{
            $scope.errorForm = true;
        }
    };

    function success(obj) {
        $scope.showToastMarcasSuccess();
        $mdDialog.hide(obj);
        gridDoor.getData();
    }

    $scope.showErrorToastMarcas = function(type, msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
            hideDelay: 3000,
            parent: '.toastParent',
            position: 'top left'
        });
    };

    $scope.showToastMarcasSuccess = function() {
        $mdToast.show({
            template: '<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>',
            hideDelay: 3000,
            parent: '#toastSelect',
            position: 'top left'
        });
    };



});