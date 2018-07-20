// 2017-03-02 Categoria modificacion 12:28

app.controller('categoria.ctrl',
    function ($scope, $mdDialog, $mdMedia, $mdToast, $resource, $location, datacontext, $filter, Global,$mdSidenav) {

        $scope.showErrorToastCategoria = function(type, msg) {
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
                parent: '#toastSelect',
                position: 'top left'
            });
        };

        $scope.operac = "";

        $scope.optblah = false;
        $scope.selected = [];
        $scope.fdCategoria = frontDoor();      //frontDoor :: funciones de acción

        $scope.gdCategoria = gridDoor();       //gridDoor :: funciones de la grilla

        //$scope.selected = [];  //aquí van a parar los registros seleccionados
        $scope.categoriaGrilla = {
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



        $scope.$watch('categoriaGrilla.query.filter', function (newValue, oldValue) {
            var bookmark = 1;
            if(!oldValue) {
                bookmark = $scope.categoriaGrilla.query.page;
            }

            if(newValue !== oldValue) {
                $scope.categoriaGrilla.query.page = 1;
            }

            if(!newValue) {
                $scope.categoriaGrilla.query.page = bookmark;
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
                editComment: editComment,
                getTypes: getTypes,
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


            function editComment(event, data) {
                event.stopPropagation();

                var promise = $mdEditDialog.large({
                    // messages: {
                    //   test: 'I don\'t like test!'
                    // },
                    modelValue: data.comment,
                    placeholder: 'Add a comment',
                    save: function (input) {
                        data.comment = input.$modelValue;
                    },
                    targetEvent: event,
                    title: ( data.comment ? 'Modificar ' : 'Agregar ') + 'commentario',
                    validators: {
                        'md-maxlength': 30
                    }
                });

                promise.then(function (ctrl) {
                    var input = ctrl.getInput();

                    input.$viewChangeListeners.push(function () {
                        input.$setValidity('test', input.$modelValue !== 'test');
                    });
                });
            }

            function getTypes() {
                return ['Candy', 'Ice cream', 'Other', 'Pastry'];
            }

            function onPaginate(page, limit) {
                // $scope.$broadcast('md.table.deselect');
                getData(angular.extend({}, $scope.query, {page: page, limit: limit}));

              //  console.log('Scope Page: ' + $scope.categoriaGrilla.query.page + ' Scope Limit: ' + $scope.categoriaGrilla.query.limit);
             //   console.log('Page: ' + page + ' Limit: ' + limit);

                //$scope.promise = $timeout(function () {
                //
                //}, 2000);
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

               // console.log('Scope Order: ' + $scope.categoriaGrilla.query.order);
             //   console.log('Order: ' + order);

                $scope.promise = $timeout(function () {

                }, 2000);
            }

            function getData(query) {
                //$scope.promise = $resource('/api/sucursal').get(query || $scope.grilla.query, success).$promise;
                $scope.promise = $resource('/api/categoria/').query(success).$promise;
                $scope.selected = [];
                $scope.categoriaGrilla.selected = [];
                function success(data) {
                    $scope.categoriaGrilla.count = data.length;
                    $scope.categoriaGrilla.data = data;
                }
            }

            function add(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'categoria.add.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: {scope: $scope},
                    templateUrl: 'app.views/categoria/popUps.html'
                }).then(getData);
            }

            function edit(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'categoria.edit.ctrl',
                    controllerAs: 'ctrl',
                   // focusOnOpen: false,
                   // targetEvent: event,
                    locals: {selected: $scope.selected[0]},
                    templateUrl: 'app.views/categoria/popUps.html'
                }).then(getData);
            }

            function del(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'categoria.del.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: { categoriasSeleccionadas: angular.copy($scope.selected) },
                    templateUrl: 'app.views/categoria/deletepopUp.html'
                }).then(getData);
            }
        }
    });


app.controller('categoria.add.ctrl',
    function ($mdDialog, $mdToast, $resource, $scope, scope, Categorias, Global,$mdSidenav) {
        'use strict';
        $scope.initPopUp = function(){
            $scope.operac = "Alta";
            conveniosCategoriaInit($scope);
            getConveniosData($scope,$resource);
            getCategoriaConvenioAll($scope,$resource);
        }

        $scope.toggleRightNavCategoria = buildToggler('rightNavAgenda');



        function buildToggler(navID) {
            console.log("buildToggler",navID)

            return function(a) {
                $mdSidenav(navID)
                    .toggle();
                $scope.convenioSidenav=a.convenio;
                var vCategorias= $resource('/api/categoriaConvenio/porCodigoConvenio/' + a.convenio);
                vCategorias.query({}, function(res,d){
                    $scope.categorias=res;
                },function(error){
                    $scope.showErrorToastAgenda('Error', error.data.message);
                });
            }
        }



        $scope.showErrorToastCategoria = function(type, msg) {
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
                parent: '#toastSelect',
                position: 'top left'
            });
        };
        $scope = scope;
        $scope.errorForm = false;

        this.cancel = $mdDialog.cancel;
        function success(obj) {
            $scope.showToastCategoriaSuccess();
            $mdDialog.hide(obj);
        }

        this.confirmOperation = function (errors) {

            if(typeof errors.required == 'undefined' && $scope.validarConvenio()==true ) {
                $scope.categoria.usuario = Global.currentUser.name;
                $scope.categoria.conveniosPrioridades=_.where($scope.convenioGrilla.data, {selected: true});
                var vCategoria = new Categorias($scope.categoria);
                vCategoria.$save(function (p) {
                    if (p.result == "error") {
                        $scope.loading = false;
                    } else {
                        success($scope.categoria);
                    }
                }, function (err) {
                    console.log(err);
                    if (err.data.class != 14) {
                        $scope.showErrorToastCategoria('error', err.data.message);
                    }else{
                        success($scope.categoria);
                    }
                    if (err.status == 401) {
                    }
                });

            }else{
                $scope.errorForm = true;
            }
        };
    });


function conveniosCategoriaInit(scope){
    scope.convenioGrilla = {
        "selected": [],

        "filter": {
            show: false,
            options: {
                debounce: 500
            }
        },
        "query": {
            filter: '',
            order: 'nameToLower',
            page: 1
        }
    };
    scope.data={};
    scope.categoriaConvenioEditing=false
    scope.data.checkConvenio=false;
    scope.data.prioridadesPorCategoriaFilter=false;
    scope.checkAllConvenios=function(){
       //  console.log("$scope.categoriaConvenio",$scope.categoriaConvenio);
        for(var i=0;i<scope.convenioGrilla.data.length;i++){
            scope.convenioGrilla.data[i].selected=scope.data.checkConvenio;
        }
    }

    scope.prioridadesPorCategoriaFilter= function () {
        console.log("prioridadesPorCategoriaFilter");
    }

    scope.categoriaConvenioAddClick= function (item) {
        scope.categoriaConvenioAdding=true;
        console.log("categoriaConvenioAdd",item);
    }

    scope.categoriaConvenioRemoveClick=function(item){
        console.log("Remove -> ",item);
    }



    scope.validarConvenio=function (){

        var isValid=null;
        // Seleecionar convenios chequeados
        var itemConvenio=_.where(scope.convenioGrilla.data, {selected: true});


        if (itemConvenio.length==0 && scope.operac == 'Alta'){
            scope.showErrorToastCategoria('error', "Debe seleccionar al menos un convenio.");
            return false;
        }

        // Obtener prioridades
        var itemConvenioUndefined = _.filter(itemConvenio, function(v) {
            if (typeof v.prioridad=='undefined' || v.prioridad.length==0){
                return v;
            }
        });

        console.log("VALID ",itemConvenioUndefined ,itemConvenioUndefined.length);
        if(typeof itemConvenioUndefined!=='undefined' && itemConvenioUndefined.length>0 ){
            scope.showErrorToastCategoria('error', "No se han cargado todas las prioridades para los convenios seleccionados.");
            return false;
        }

        // Validar las prioridades
       //  console.log("itemConvenio",itemConvenio)
        _.each(itemConvenio, function(item){
            var prioridades=scope.getPrioridadesConvenio(item.sistema,item.convenio);

            if(_.indexOf(prioridades, parseInt(item.prioridad))>-1){
                item.repetido=true;
                scope.showErrorToastCategoria('error', "La prioridad ya se ha asignado al convenio.");
                isValid=false;
            }else{
                item.repetido=false;
            }
        });
        if(isValid==null){
            return true;
        }
        return isValid;
    }


    scope.validarConvenioUpdate=function (value){
        console.log("value",value)
        var isValid=null;
        value=[value]
        _.each(value, function(item){

              var prioridades=scope.getPrioridadesConvenio(item.codSistema,item.convenio);
           //  console.log("prioridades",prioridades);
            if(_.indexOf(prioridades, parseInt(item.prioridadUpdate))>-1){
                item.repetido=true;
                scope.showErrorToastCategoria('error', "La prioridad ya se ha asignado al convenio.");
                isValid=false;
            }else{
                item.repetido=false;
            }
        });
        if(isValid==null){
            return true;
        }
        return isValid;
    }

    scope.getPrioridadesConvenio=function (sistema,convenio){
        return _.pluck(_.where(scope.categoriaConvenio, {codSistema:sistema,convenio: convenio}), 'prioridad');
    }

    scope.getPrioridadesConvenioItems=function (convenio,sistema){
   //     console.log("+ getPrioridadesConvenioItems value,sistema",convenio,sistema)
        // console.log("getPrioridadesConvenio",_.pluck(_.where(scope.categoriaConvenio, {convenio: value,codSistema:sistema}), 'prioridad'))
        // console.log("scope.categoriaConvenio",scope.categoriaConvenio);
        return _.where(scope.categoriaConvenio, {convenio: convenio,codSistema:sistema});
    }
}



function getConveniosData(scope,resource){
    console.log("scope.categoria +++",scope.categoria);
    scope.promise = resource('/api/convenio/').query(success).$promise;
    scope.convenioGrilla.selected = [];
    function success(data) {
        scope.convenioGrilla.count = data.length;
        scope.convenioGrilla.data = data;
    }
}

function getConveniosDataPorCodCategoria(scope,resource){

    scope.promise = resource('api/categoriaConvenio/porCodigoCategoria/'+scope.categoria.idCodigo).query(success).$promise;
    scope.convenioGrilla.selected = [];
    function success(data) {
        console.log("categoriaConvenio/porCodigoCategoria +++",data);
        scope.convenioGrilla.count = data.length;
        scope.convenioGrilla.data = data;
    }

}


function getCategoriaConvenioAll(scope,resource) {
    scope.promise = resource('/api/categoriaConvenio/').query(success).$promise;


    function success(data) {
        // api/categoriaConvenio/porCodigoCategoria

        scope.categoriaConvenio= data;
        for(var i=0;i<scope.categoriaConvenio.length;i++){
            scope.categoriaConvenio[i].prioridadUpdate=scope.categoriaConvenio[i].prioridad;
            // console.log(scope.categoriaConvenio[i]);
        }
    }
}






app.controller('categoria.edit.ctrl',
    function ($mdDialog, $mdToast, $resource, $scope,$http, selected, Categorias,CategoriasConvenio, Global, $mdSidenav ) {
        'use strict';
        $scope.categoria = angular.copy(selected);
        $scope.operac = "Modificación";
        $scope.errorForm = false;
        $scope.usuario=Global.currentUser.name;

        $scope.toggleRightNavCategoria = buildToggler('rightNavAgenda');

        function buildToggler(navID) {
            return function(a) {
                $mdSidenav(navID)
                    .toggle();
                var vCategorias= $resource('/api/categoriaConvenio/porCodigoConvenio/' + a.convenio);
                $scope.convenioSidenav=a.convenio;
                vCategorias.query({}, function(res,d){
                    $scope.categorias=res;
                },function(error){
                    $scope.showErrorToastAgenda('Error', error.data.message);
                });
            }
        }


        $scope.eliminarCategoria=function($event,rowConvenio){
            var vCate= new Categoria($scope,$http,$mdDialog,$event);
            vCate.confirmarEliminar(rowConvenio);
            console.log("----------------------------------------------");
            console.log("rowConvenio",rowConvenio);
            console.log("$event",$event);
            console.log("----------------------------------------------");
        }

        $scope.editarPrioridad=function(p1,p2){
            p2["editing"]=true;
        }

        $scope.categoriaConvenioAdd=function(data){
            var vCategoriaConvenio={};

            vCategoriaConvenio.categoria=$scope.categoria.codigo;
            vCategoriaConvenio.convenio=data.convenio;
            vCategoriaConvenio.codSistema=data.sistema;
            vCategoriaConvenio.prioridad=data.prioridad;
            vCategoriaConvenio.prioridadUpdate=data.prioridad;
            vCategoriaConvenio.usuario=$scope.usuario;
          //  console.log("vCategoriaConvenio-> usuario ",vCategoriaConvenio)

            if($scope.validarConvenioUpdate(vCategoriaConvenio)){
                /*
                $http.post('/api/CategoriasConvenio', vCategoriaConvenio).then(
                    function(p){console.log("OK",p);},
                    function(err){console.log("ERR",err);});
                */



                var objCategoriasConvenio = new CategoriasConvenio(vCategoriaConvenio);

                objCategoriasConvenio.$save(function (res) {
                   // console.log("INSERTING... RESPUESTA ",res);
                    if (res.result == "error") {
                        $scope.loading = false;
                    }else {
                        $scope.categoriaConvenioAdding=false;
                        data.prioridad='';
                        $scope.categoriaConvenio.push(vCategoriaConvenio);
                        $scope.showErrorToastTest("Se ha insertado el registro.");
                    }
                }, function (err) {
                    console.log(err);
                    if (err.data.class != 14) {
                        $scope.showErrorToastCategoria('error', err.data.message);
                    }else{
                        $scope.showErrorToastTest("Se ha insertado el registro.");
                    }
                    if (err.status == 401) {}
                });

            }

        }


        $scope.editPrioridadChange=function(value){

            if($scope.validarConvenioUpdate(value)){
                var prioridad=value.prioridad;
                value.prioridad=value.prioridadUpdate
                value.usuario=$scope.usuario;
                CategoriasConvenio.update({idCategoriaConvenio: value.idCategoriaConvenio}, value, function (res) {
                    if (res.result == "error") {
                        $scope.loading = false;
                    }
                    else {
                        value.editing=false;
                        $scope.showErrorToastTest("Se ha modificado el registro.");
                    }
                }, function (err) {
                        console.log("ERROR -> ",err)
                });

               //  console.log("VALIDACION -> ",value);
            }


        }

        $scope.initPopUp = function(){
            $scope.operac = "Modificación";
            conveniosCategoriaInit($scope);
            getConveniosDataPorCodCategoria($scope,$resource);
            getCategoriaConvenioAll($scope,$resource);

        }

        $scope.showErrorToastTest= function( msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast toastSuccess">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };

        $scope.showErrorToastCategoria = function(type, msg) {
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
                parent: '#toastSelect',
                position: 'top left'
            });
        };

        this.cancel = $mdDialog.cancel;

        function success(obj) {
            $scope.showToastCategoriaSuccess();
            $mdDialog.hide(obj);
        }

        this.confirmOperation = function (errors) {
            if(typeof errors.required == 'undefined' && $scope.validarConvenio()==true ) {
                if (typeof  $scope.categoria.idCodigo != 'undefined') {
                    $scope.categoria.usuario = Global.currentUser.name;
                    $scope.categoria.conveniosPrioridades=_.where($scope.convenioGrilla.data, {selected: true});
                    console.log("UPDATE $scope.categoria",$scope.categoria);
                    Categorias.update({idCodigo: $scope.categoria.idCodigo}, $scope.categoria, function (res) {
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


app.controller('categoria.del.ctrl',
    function (categoriasSeleccionadas, $mdDialog, $mdToast, $scope, $q, CategoriasDelete, Global) {
        'use strict';

        var date = new Date();
        $scope.currentDate = date;
        $scope.fecBajaAll = new Date();
        $scope.operac = "Baja";
        $scope.categoriaDeleteGrilla = {
            data : angular.copy(categoriasSeleccionadas)
        };

        $scope.showErrorToastCategoria = function(type, msg) {
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
                parent: '#toastSelect',
                position: 'top left'
            });
        };

        this.cancel = $mdDialog.cancel;

        function borrarCategoria(obj, index) {
            obj.usuario = Global.currentUser.name;
            obj.fecBaja = $scope.fecBajaAll;
            CategoriasDelete.delete({idCodigo: obj.idCodigo}, obj, function(res){
                if(res.result=="error"){

                }
            });
        }

        function onComplete() {
            $scope.showToastCategoriaSuccess();
            $mdDialog.hide();
        }


        this.confirmOperation = function(errors){
            if(typeof errors.mindate == 'undefined' && typeof errors.valid == 'undefined' ) {
                if($scope.fecBajaAll != null) {
                    $q.all(categoriasSeleccionadas.forEach(borrarCategoria)).then(onComplete);
                }else{
                    $scope.showErrorToastCategoria('error', 'La Fecha de baja no es válida.');
                }
            }else{
                if(typeof errors.mindate != 'undefined' ) {
                    $scope.showErrorToastCategoria('error', 'La Fecha de baja no puede ser menor a la fecha actual.');
                }else {
                    $scope.showErrorToastCategoria('error', 'La Fecha de baja no es válida.');
                }
            }
        }
    });



var Categoria=function ( $scope,$http,$mdDialog,ev ) {
    this.eliminarCategoriaConvenio=function(idCategoriaConvenio){
        var data = $scope.categoriaConvenio.filter(function(elem, i, array) {
                if (elem.idCategoriaConvenio === idCategoriaConvenio ){
                    $scope.categoriaConvenio[i]={};
                    return i
                }
            }
        );
    }
    this.resetConvenio=function(idCategoriaConvenio){
        _this=this;
        var data = $scope.convenioGrilla.data.filter(function(elem, i, array) {
            if (elem.idCategoriaConvenio === idCategoriaConvenio ){
                var v=$scope.convenioGrilla.data[i].idCategoriaConvenio;
                $scope.convenioGrilla.data[i].idCategoriaConvenio=null;
                $scope.convenioGrilla.data[i].prioridad=null;
                $scope.convenioGrilla.data[i].selected=null;
                if(v!=null){
                    _this.eliminarCategoriaConvenio(v);
                }
                return i
            }
        });
    }

    this.confirmarEliminar= function (rowConvenio) {
        _this=this;
        $mdDialog.show({
            controller: 'CategoriaConfirmDelete.ctrl',
            templateUrl: 'app.views/categoria/CategoriaConfirmDelete.html',
            target:ev,
            preserveScope: true,
            skipHide: true,
            parent: angular.element(document.body)
        }).then(function (res) {

            rowConvenio.usuario=$scope.usuario;
            $http({
                method: 'DELETE',
                url: '/api/categoriaConvenio/'+rowConvenio.idCategoriaConvenio,
                data:   rowConvenio
            }).then(function successCallback(response) {
                _this.resetConvenio(rowConvenio.idCategoriaConvenio)
                $scope.showErrorToastTest("El registro ha sido dado de baja.");
            }, function errorCallback(response) {
                $scope.showErrorToastCategoria('error', 'Ha ocurrido un error al realizar la operacion.');
                console.log(response)
            });
            console.log("OK",rowConvenio);
        }).catch(function () {
            console.log("ERROR");
        });
    };
}


app.controller('CategoriaConfirmDelete.ctrl', ['$scope','$mdDialog',
    function ($scope, $mdDialog) {
        $scope.aceptar = function () {
            $mdDialog.hide();
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }]);



