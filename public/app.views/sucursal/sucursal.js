app.controller('sucursal.ctrl',
    function ($scope, $mdDialog, $mdMedia, $mdToast, $mdSidenav, $resource, $location, datacontext, $filter, Global) {
        $scope.operac = "";
        $scope.optblah = false;
        $scope.selected = [];
        $scope.allSucursales = [];
        $scope.dataLoad = {
            localidades: [],
            provincias: [],
            regiones: []
        };
        $scope.fdSucursal = frontDoor();      //frontDoor :: funciones de acción
        $scope.gdSucursal = gridDoor();       //gridDoor :: funciones de la grilla
        $scope.sucursalGrilla = {
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

        $scope.filtrarSucursales = function (newVal) {
            if ($scope.allSucursales.$resolved == true && newVal.toString() != '') {
                if($scope.sucursalGrilla.query.page != 1){
                    $scope.sucursalGrilla.query.page = 1;
                }
                $scope.sucursalGrilla.data = $filter('filter')($scope.allSucursales,{ descripSucursal: newVal});
                $scope.sucursalGrilla.count = $scope.sucursalGrilla.data.length;
            }else{
                $scope.sucursalGrilla.data = $scope.allSucursales;
                $scope.sucursalGrilla.count = $scope.sucursalGrilla.data.length;
            }
        }

        $scope.$watch('sucursalGrilla.query.filter', $scope.filtrarSucursales);

        $scope.initSucursales = function(){
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
                $scope.selected.splice($scope.selected.indexOf(index), 1);
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
                $scope.promiseSucursal = $resource('/api/sucursal/').query(successSucursal).$promise;
                $scope.promiseRegion = $resource('/api/region/').query(successRegion).$promise;
                $scope.promiseLocalidad = $resource('/api/localidad/').query(successLocalidad).$promise;
                $scope.promiseProvincia = $resource('/provincia/').query(successProvincia).$promise;
                $scope.selected = [];
                $scope.sucursalGrilla.selected = [];
                function successSucursal(data) {
                    $scope.allSucursales = data;
                    if ($scope.sucursalGrilla.query.filter === "") {
                        $scope.sucursalGrilla.count = data.length;
                        $scope.sucursalGrilla.data = data;
                        $scope.sucursalGrilla.data.forEach(function (it) {
                            it.codSucursal = parseFloat(it.codSucursal);
                        });
                    }
                    else {
                        $scope.filtrarSucursales($scope.sucursalGrilla.query.filter)
                    }
                }
                function successLocalidad(data) {
                    $scope.dataLoad.localidades = data;
                }

                function successProvincia(data) {
                    $scope.dataLoad.provincias = data;
                }
                function successRegion(data) {
                    $scope.dataLoad.regiones = data;
                }
            }

            function add(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'sucursal.add.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: {
                        scope: $scope,
                        dataLoad: $scope.dataLoad,
                    },
                    templateUrl: 'app.views/sucursal/popUps.html'
                }).then(getData);
            }

            function edit(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'sucursal.edit.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: {
                        selected: $scope.selected[0],
                        dataLoad: $scope.dataLoad,
                    },
                    templateUrl: 'app.views/sucursal/popUps.html'
                }).then(getData);
            }

            function del(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'sucursal.del.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: { sucursalesSeleccionadas: $scope.selected },
                    templateUrl: 'app.views/sucursal/deletepopUp.html'
                }).then(getData);
            }

            function removeFilter() {
                $scope.sucursalGrilla.filter.show = false;
                $scope.sucursalGrilla.query.filter = '';
                if($scope.sucursalGrilla.filter.form.$dirty) {
                    $scope.sucursalGrilla.filter.form.$setPristine();
                }
            }
        }
    });


app.controller('sucursal.add.ctrl',
    function ($mdDialog, $mdToast, $resource, $scope, $mdSidenav, $filter, scope, dataLoad, Sucursales, Global) {
        'use strict';

        $scope.regexOnlyNumbers= "^[0-9]{1,3}$";
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1) ;
        $scope.currentDate = currentDate;
        $scope.sucursal = {};
        $scope.localidadElegida = [];
        $scope.countLeg = 0;

        $scope.toggleRightNav = buildToggler('rightNavLocalidad');
        function buildToggler(navID) {
            return function () {
                $mdSidenav(navID)
                    .toggle();
                if ($scope.countLeg == 0) {
                    $scope.localidadGrilla.data = $filter('filter')(dataLoad.localidades, {descProvincia: $scope.filtro.provincia});
                }
                $scope.countLeg = $scope.countLeg +1;
            }
        }

        $scope.hideCheckboxes = false;

        $scope.fdLocalidad = frontDoor();      //frontDoor :: funciones de acción

        $scope.gdLocalidad = gridDoor();       //gridDoor :: funciones de la grilla

        $scope.localidadGrilla = {
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

        $scope.changeGrid = function(){
            if ($scope.filtro.provincia != null) {
                $scope.localidadGrilla.data = $filter('filter')($scope.dataLoad.localidades, {descProvincia: $scope.filtro.provincia});
            }
            if($scope.localidadGrilla.query.filter.toString() != '') {
                $scope.localidadGrilla.data = $filter('filter')($scope.localidadGrilla.data, {descripcion: scope.localidadGrilla.query.filter.toString()});
            }
            $scope.localidadGrilla.count = $scope.localidadGrilla.data.length;
        };

        $scope.$watch('localidadGrilla.query.filter', function (newVal) {
            if($scope.localidadGrilla.query.page != 1){
                $scope.localidadGrilla.query.page = 1;
            }
            if(typeof $scope.filtro != 'undefined') {
                $scope.localidadGrilla.data = $filter('filter')($scope.dataLoad.localidades, {descProvincia: $scope.filtro.provincia});
                $scope.localidadGrilla.count = $scope.localidadGrilla.data.length;
            }
            if (newVal.toString() != '') {
                $scope.localidadGrilla.data = $filter('filter')($scope.localidadGrilla.data, {descripcion: newVal});
                $scope.localidadGrilla.count = $scope.localidadGrilla.data.length;
            }
        });

        function gridDoor() {

            var gridDoor = {
                getData: getData,
                onPaginateLocalidad: onPaginateLocalidad,
                deselect: deselect,
                log: log,
                loadStuff: loadStuff,
                onReorder: onReorder,
                removeFilter: removeFilter

            };

            return gridDoor;

            function onPaginateLocalidad(page, limit) {
                // $scope.$broadcast('md.table.deselect');
                getData(angular.extend({}, $scope.query, {page: page, limit: limit}));
                //$scope.promise = $timeout(function () {
                //
                //}, 2000);
            }

            function getData() {
                $scope.operac = "Alta";
                $scope.dataLoad = dataLoad;
                console.log($mdDialog);
            }

            function deselect(index, item) {
                $scope.localidadElegida.splice(index, 1);
            }

            function log(item) {
                $scope.localidadElegida.push(item);
            }

            function loadStuff() {
                $scope.promise = $timeout(function () {

                }, 2000);
            }

            function onReorder(order) {

                getData(angular.extend({}, $scope.query, {order: order}));
                $scope.promiseLocalidad = $timeout(function () {
                }, 2000);
            }

            function removeFilter() {
                $scope.localidadGrilla.filter.show = false;
                $scope.localidadGrilla.query.filter = '';
                if($scope.localidadGrilla.filter.form.$dirty) {
                    $scope.localidadGrilla.filter.form.$setPristine();
                }
            }
        }

        $scope.getLocalidades = function(item){
            var results = $filter('filter')($scope.dataLoad.localidades, {descripcion: item});
            return results;
        };


        $scope.selectRegion = function(errors){
            var foundRegion  = $filter('filter')($scope.dataLoad.regiones, {codigo: $scope.sucursal.codRegion}, true);
            $scope.sucursal.descripcionRegion = foundRegion[0].descripcion;
            $scope.sucursal.codRegion = foundRegion[0].codigo;
            $("#selectRegion").removeClass("ng-dirty");
        };

        $scope.closeNav = function () {
            $mdSidenav('rightNavLocalidad').close();
        };

        $scope.querySearch = function(query) {
            var results = query ? self.localidades.filter( createFilterFor(query) ) : [];
            return results;
        };

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(localidades) {
                return (localidades.value.indexOf(lowercaseQuery) === 0);
            };
        }

        $scope.selectItem = function(item){
            if(typeof item != 'undefined') {
                $scope.sucursal.idLocalidad = item.idLocalidad;
                $scope.sucursal.descripcionLocalidad = item.descripcion;
            }
        };

        $scope.showErrorToastSucursal = function(type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };

        $scope.removeFilterLocalidad = function() {
            $scope.localidadGrilla.filter.show = false;
            $scope.localidadGrilla.query.filter = '';
            if($scope.localidadGrilla.filter.form.$dirty) {
                $scope.localidadGrilla.filter.form.$setPristine();
            }
        };

        $scope.initPopUp = function(){
            gridDoor().getData();
        };

        $scope.loadLocalidad = function(){
            if($scope.localidadElegida.length > 1)
            {
                $scope.showErrorToastSucursal('error','Solo puede seleccionar una localidad.');
            }else if(typeof $scope.localidadElegida[0].idLocalidad != 'undefined') {
                $scope.sucursal.idLocalidad = $scope.localidadElegida[0].idLocalidad;
                $scope.sucursal.descripcionLocalidad = $scope.localidadElegida[0].descripcion;
                $scope.closeNav();
            }else{
                $scope.showErrorToastSucursal('error','Debe seleccionar al menos una localidad.');
            }
        };

        $scope.showToastSucursalSuccess = function() {
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
            $scope.showToastSucursalSuccess();
            $mdDialog.hide(obj);
        }

        this.confirmOperation = function (errors) {
            var count = $filter('filter')($scope.dataLoad.localidades, {descripcion: $scope.sucursal.descripcionLocalidad});
            if(count.length != 0) {
                if (typeof errors.required == "undefined") {
                    if (typeof errors.pattern == 'undefined') {
                        $scope.loading = true;
                        $scope.sucursal.usuario = Global.currentUser.name;
                        var vSucursal = new Sucursales($scope.sucursal);
                        vSucursal.$save(function (p) {
                            if (p.result == "error") {
                                $scope.loading = false;
                            } else {
                                success(p);
                            }
                        }, function (err) {
                            $scope.showErrorToastSucursal('error', err.data.message);
                            if (err.status == 401) {
                            }
                        });
                    } else
                        $scope.errorForm = true;
                }
                else
                    $scope.errorForm = true;
            }else{
                $scope.showErrorToastSucursal('error', 'La Localidad ingresada no existe.')
            }
        }
    });

app.controller('sucursal.edit.ctrl',
    function ($mdDialog, $mdToast, $resource, $scope, $mdSidenav, $filter, selected, dataLoad, Sucursales, Global) {
        'use strict';
        $scope.regexOnlyNumbers= "^[0-9]{1,3}$";
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - 1) ;
        $scope.currentDate = currentDate;
        $scope.sucursal = {};
        $scope.countLeg = 0;
        $scope.localidadElegida = [];
        $scope.isError = false;

        $scope.toggleRightNav = buildToggler('rightNavLocalidad');
        function buildToggler(navID) {
            return function() {
                $mdSidenav(navID)
                    .toggle();
                if ($scope.countLeg == 0) {
                    $scope.localidadGrilla.data = $filter('filter')(dataLoad.localidades, {descProvincia: $scope.filtro.provincia});
                }
                $scope.countLeg = $scope.countLeg +1;

            }}

        $scope.hideCheckboxes = false;

        $scope.fdLocalidad = frontDoor();      //frontDoor :: funciones de acción

        $scope.gdLocalidad = gridDoor();       //gridDoor :: funciones de la grilla

        $scope.localidadGrilla = {
            "selected": [],

            "filter": {
                show: false,
                options: {
                    debounce: 500
                }
            },
            "query": {
                filter: '',
                limit: '50',
                order: 'nameToLower',
                page: 1
            }
        };

        function frontDoor(){
            return {
                ddd: function (text) {
                    alert( text  );
                },
                adddd: function (event) {
                    alert( event.name  );
                },

            };
        }

        $scope.changeGrid = function(){
            if ($scope.filtro.provincia != null) {
                $scope.localidadGrilla.data = $filter('filter')($scope.dataLoad.localidades, {descProvincia: $scope.filtro.provincia});
            }
            if($scope.localidadGrilla.query.filter.toString() != '') {
                $scope.localidadGrilla.data = $filter('filter')($scope.localidadGrilla.data, {descripcion: scope.localidadGrilla.query.filter.toString()});
            }
            $scope.localidadGrilla.count = $scope.localidadGrilla.data.length;
        };

        $scope.$watch('localidadGrilla.query.filter', function (newVal) {
            if($scope.localidadGrilla.query.page != 1){
                $scope.localidadGrilla.query.page = 1;
            }
            if(typeof $scope.filtro != 'undefined') {
                $scope.localidadGrilla.data = $filter('filter')($scope.dataLoad.localidades, {descProvincia: $scope.filtro.provincia});
                $scope.localidadGrilla.count = $scope.localidadGrilla.data.length;
            }
            if (newVal.toString() != '') {
                $scope.localidadGrilla.data = $filter('filter')($scope.localidadGrilla.data, {descripcion: newVal});
                $scope.localidadGrilla.count = $scope.localidadGrilla.data.length;
            }
        });

        function gridDoor() {

            var gridDoor = {
                getData: getData,
                onPaginateLocalidad: onPaginateLocalidad,
                deselect: deselect,
                log: log,
                loadStuff: loadStuff,
                onReorder: onReorder,
                removeFilter: removeFilter

            };

            return gridDoor;

            function onPaginateLocalidad(page, limit) {
                // $scope.$broadcast('md.table.deselect');
                getData(angular.extend({}, $scope.query, {page: page, limit: limit}));
                //$scope.promise = $timeout(function () {
                //
                //}, 2000);
            }

            function getData() {
                $scope.operac = "Modificación";
                $scope.dataLoad = dataLoad;
            }

            function deselect(index, item) {
                $scope.localidadElegida.splice(index, 1);
            }

            function log(item) {
                $scope.localidadElegida.push(item);
            }

            function loadStuff() {
                $scope.promise = $timeout(function () {

                }, 2000);
            }

            function onReorder(order) {

                getData(angular.extend({}, $scope.query, {order: order}));
                $scope.promiseLocalidad = $timeout(function () {
                }, 2000);
            }

            function removeFilter() {
                $scope.localidadGrilla.filter.show = false;
                $scope.localidadGrilla.query.filter = '';
                if($scope.localidadGrilla.filter.form.$dirty) {
                    $scope.localidadGrilla.filter.form.$setPristine();
                }
            }
        }

        $scope.getLocalidades = function(item){
            var results = $filter('filter')($scope.dataLoad.localidades, {descripcion: item});
            return results;
        };


        $scope.selectRegion = function(errors){
            var foundRegion  = $filter('filter')($scope.dataLoad.regiones, {codigo: $scope.sucursal.codRegion}, true);
            $scope.sucursal.descripcionRegion = foundRegion[0].descripcion;
            $scope.sucursal.codRegion = foundRegion[0].codigo;
            $("#selectRegion").removeClass("ng-dirty");
        };

        $scope.closeNav = function () {
            $mdSidenav('rightNavLocalidad').close();
        };

        $scope.querySearch = function(query) {
            var results = query ? self.localidades.filter( createFilterFor(query) ) : [];
            return results;
        };

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(localidades) {
                return (localidades.value.indexOf(lowercaseQuery) === 0);
            };
        }

        $scope.selectItem = function(item){
            if(typeof item != 'undefined') {
                $scope.sucursal.idLocalidad = item.idLocalidad;
                $scope.sucursal.descripcionLocalidad = item.descripcion;
            }
        };

        $scope.showErrorToastSucursal = function(type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };

        $scope.removeFilterLocalidad = function() {
            $scope.localidadGrilla.filter.show = false;
            $scope.localidadGrilla.query.filter = '';
            if($scope.localidadGrilla.filter.form.$dirty) {
                $scope.localidadGrilla.filter.form.$setPristine();
            }
        };

        $scope.initPopUp = function(){
            gridDoor().getData();
            $scope.sucursal = angular.copy(selected);
        };

        $scope.loadLocalidad = function(){
            if($scope.localidadElegida.length > 1)
            {
                $scope.showErrorToastSucursal('error','Solo puede seleccionar una localidad.');
            }else if(typeof $scope.localidadElegida[0].idLocalidad != 'undefined') {
                $scope.sucursal.idLocalidad = $scope.localidadElegida[0].idLocalidad;
                $scope.sucursal.descripcionLocalidad = $scope.localidadElegida[0].descripcion;
                $scope.closeNav();
            }else{
                $scope.showErrorToastSucursal('error','Debe seleccionar al menos una localidad.');
            }
        };

        $scope.showToastSucursalSuccess = function() {
            $mdToast.show({
                template: '<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>',
                hideDelay: 3000,
                parent: '#toastSelect',
                position: 'top left'
            });
        };
        $scope.errorForm = false;

        this.cancel = $mdDialog.cancel;

        function success(obj) {
            $scope.showToastSucursalSuccess();
            $mdDialog.hide(obj);
        }

        this.confirmOperation = function (errors) {

            var count = $filter('filter')($scope.dataLoad.localidades, {descripcion: $scope.sucursal.descripcionLocalidad});
            if(count.length != 0) {
                if (typeof errors.required == "undefined") {
                    if (typeof errors.pattern == 'undefined') {
                        if (typeof $scope.sucursal.idSucAgen != 'undefined') {
                            $scope.sucursal.usuario = Global.currentUser.name;
                            Sucursales.update({idSucAgen: $scope.sucursal.idSucAgen}, $scope.sucursal, function (res) {
                                if (res.result == "error") {
                                    $scope.loading = false;
                                }
                                else {
                                    success(res);
                                }
                            }, function (err) {
                                $scope.loading = false;
                                console.log(err);
                            });
                        }
                    } else
                        $scope.errorForm = true;
                }
                else
                    $scope.errorForm = true;
            }else{
                $scope.showErrorToastSucursal('error', 'La Localidad ingresada no existe.')
            }
        };

    });


app.controller('sucursal.del.ctrl',
    function (sucursalesSeleccionadas, $mdDialog, $mdToast, $scope, $q, SucursalesDelete, Global) {
        'use strict';

        var date = new Date();
        $scope.currentDate = date;
        $scope.fecBajaAll = new Date();
        $scope.operac = "Baja";
        $scope.sucursalDeleteGrilla = {
            data: sucursalesSeleccionadas,
            count:sucursalesSeleccionadas.length,
            "query": {
                filter: '',
                limit: '5',
                order: 'nameToLower',
                page: 1
            }
        };

        $scope.gdLocalidadDelete = gridDoor();
        function gridDoor() {

            var gridDoor = {
                deselect: deselect,
                log: log,
                loadStuff: loadStuff,
                onReorder: onReorder,
                onPaginateSuc: onPaginateSuc

            };

            return gridDoor;

            function onPaginateSuc(page, limit) {
                // $scope.$broadcast('md.table.deselect');
                getData(angular.extend({}, $scope.query, {page: page, limit: limit}));
                //$scope.promise = $timeout(function () {
                //
                //}, 2000);
            }

            function deselect(index, item) {
                $scope.localidadElegida.splice(index, 1);
            }

            function log(item) {
                $scope.localidadElegida.push(item);
            }

            function loadStuff() {
                $scope.promise = $timeout(function () {

                }, 2000);
            }

            function onReorder(order) {

                getData(angular.extend({}, $scope.query, {order: order}));
                $scope.promiseLocalidad = $timeout(function () {
                }, 2000);
            }
        }


        $scope.showErrorToastSucursales = function (type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type + '">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };

        $scope.showToastSucursalesSuccess = function () {
            $mdToast.show({
                template: '<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>',
                hideDelay: 3000,
                parent: '#toastSelect',
                position: 'top left'
            });
        };

        this.cancel = $mdDialog.cancel;

        function borrarSucursal(obj, index) {
            obj.usuario = Global.currentUser.name;
            $scope.fecBajaAll.setHours(0);
            obj.fecBaja = $scope.fecBajaAll;
            SucursalesDelete.delete({idSucAgen: obj.idSucAgen}, obj, function (res) {
                if (res.result == "error") {
                    //alertar(res.message, "warning")
                    console.log("error");
                }
            });
        }

        function onComplete() {
            $scope.showToastSucursalesSuccess();
            $mdDialog.hide();
        }


        this.confirmOperation = function (errors) {
            if (typeof errors.mindate == 'undefined' && typeof errors.valid == 'undefined') {
                if ($scope.fecBajaAll != null) {
                    $q.all(sucursalesSeleccionadas.forEach(borrarSucursal)).then(onComplete);
                } else {
                    $scope.showErrorToastSucursales('error', 'La Fecha de baja no es válida.');
                }
            } else {
                if (typeof errors.mindate != 'undefined') {
                    $scope.showErrorToastSucursales('error', 'La Fecha de baja no puede ser menor a la fecha actual.');
                } else {
                    $scope.showErrorToastSucursales('error', 'La Fecha de baja no es válida.');
                }
            }
        }

    });

//    $scope.addHorasPopUp = function(sendScope){
//        var fecBaja= new Date(sendScope.fecBaja);
//        fecBaja.setDate(fecBaja.getDate() + 1);
//        sendScope.fecBaja= fecBaja;
//    };

//
