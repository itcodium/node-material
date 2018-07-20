/***************************************************************
 Listar Perfil
 ***************************************************************/

function searchItem(arr,key, value) {
    for (var d = 0, len = arr.length; d < len; d += 1) {
        if (arr[d][key] === value) {
            return arr[d];
        }
    }
}

function initList(listCompleta,SelectedItems, key) {
    for (var i = 0; i < SelectedItems.length; i++) {
        var item=searchItem(listCompleta,key, SelectedItems[i][key]);
        if (!(typeof item === 'undefined')){
            if(item[key]==SelectedItems[i][key]){
                item.selected=true;
            }
        }
    }
}

function initTree(listCompleta,SelectedItems, key) {
    listCompleta.forEach(function (it) {
        if (it.children && it.children.length > 0) {
            initTree(it.children, SelectedItems, key);
            var selectedChildren = it.children.filter(function (child) { return child.selected; });
            if (selectedChildren.length === it.children.length) {
                it.selected = true;
            }
        }
        else {
            var selected = SelectedItems.filter(function (i) { return i[key] === it[key]; });
            if (selected.length > 0) {
                it.selected = true;
            }
        }
    });
}

function mapActionsForTree(actions) {
    var firstMap = actions.map(function (it) { return { path: it.codigo.split('.'), title: it.descripcion, menu: it.menu.split('/')[1], processed: false, idAccion: it.idAccion } });
    var tree=[];
    tree.push({ title: 'Agenda', codigo: 'agenda', children: [], selected: false });
    tree.push({ title: 'Procesos', codigo: 'procesos', children: [], selected: false });

    if (user.app=="TC") {
        tree.push({title: 'Promociones', codigo: 'promociones', children: [], selected: false});
    }

    if (user.app=="TC") {
        tree.push({title: 'Conciliaciones', codigo: 'conciliaciones', children: [], selected: false});
    }

    if (user.app=="TC") {
        tree.push({title: 'Reclamos', codigo: 'reclamos', children: [], selected: false});
    }
    if (user.app=="TC") {
        tree.push({title: 'Novedades Masivas', codigo: 'novedadesMasivas', children: [], selected: false});
    }
    tree.push({ title: 'Tablas Paramétricas', codigo: 'tablasParametricas', children: [], selected: false });

    if (user.app=="TC"){
        tree.push({ title: 'Campañas', codigo: 'campañas', children: [], selected: false })
    }
    tree.push({ title: 'Usuarios y Permisos', codigo: 'usuarios', children: [], selected: false });

//    tree.push({ title: 'Reclamos', codigo: 'reclamos', children: [], selected: false });

    tree.push({ title: 'Reportes', codigo: 'reportes', children: [], selected: false });
    if (user.app=="PP"){
        tree.push({ title: 'Fallecidos', codigo: 'fallecidos', children: [], selected: false });
    }


    firstMap.forEach(function (it) {
        if (!it.processed) {
            var parent = it.path[0];
            var parentObj = tree.filter(function (i) { return i.codigo === parent })[0];
            if (!parentObj) { return; }
            var menu = it.path[1];
            var menuObj = { title: it.menu, codigo: menu, children: [], selected: false };
            var children = firstMap.filter(function (i) { return i.menu === it.menu });
            children.forEach(function (child) {
                child.processed = true;
                menuObj.children.push({ title: child.title, codigo: child.path.join('.'), children: [], selected: false, idAccion: child.idAccion });
            });
            parentObj.children.push(menuObj);
        }
    });
    return tree;
}

function getSelectedActions(acciones) {
    var selected = [];
    acciones.forEach(function (action) {
        if (action.children && action.children.length > 0) {
            selected = selected.concat(getSelectedActions(action.children));
        }
        else {
            if (action.selected) {
                selected.push(action);
            }
        }
    });
    return selected;
}

function getChildrenActions(acciones) {
    var children = [];
    acciones.forEach(function (action) {
        if (action.children && action.children.length > 0) {
            children = children.concat(getChildrenActions(action.children));
        }
        else {
            children.push(action);
        }
    });
    return children;
}

app.controller('perfilList.ctrl',
    function ($scope, $mdDialog, $mdMedia, $mdToast, $resource, $location, datacontext, $filter, Global) {

        $scope.operac = "";

        $scope.optblah = false;
        $scope.selected = [];
        $scope.allPerfiles = [];
        $scope.fdPerfil = frontDoor();      //frontDoor :: funciones de acción

        $scope.gdPerfil = gridDoor();       //gridDoor :: funciones de la grilla
        // $scope.showDadosBaja=true;
        //$scope.selected = [];  //aquí van a parar los registros seleccionados
        $scope.perfilGrilla = {
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


        function perfilQueryFilter(newVal) {

            if ($scope.allPerfiles.$resolved == true && newVal.toString() != '') {
                $scope.perfilGrilla.data = $filter('filter')($scope.allPerfiles, newVal);
                $scope.perfilGrilla.count = $scope.perfilGrilla.data.length;
            }else{
                $scope.perfilGrilla.data = $scope.allPerfiles;
                $scope.perfilGrilla.count = $scope.perfilGrilla.data.length;
            }
        }

        $scope.$watch('perfilGrilla.query.filter', perfilQueryFilter);





        $scope.initPerfiles = function(){
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

                var bQuery;

                if(typeof query=='undefined' && $scope.showDadosBaja==true){
                    bQuery={dadosBaja:true};
                }else{
                    if(typeof query=='undefined'){
                        bQuery={dadosBaja:false};
                    }else{
                        bQuery={dadosBaja:query};
                    }
                }



                $scope.promise = $resource('/api/admin/perfilesPorNivel').query(bQuery, success).$promise;
                $scope.promiseAcciones=$resource('/api/admin/perfiles/acciones').query(successAcciones).$promise;
                $scope.promiseAccionesPorFuncionalidad=$resource('/api/admin/perfiles/acciones?funcionalidad=1').query(successAccionesFuncionalidad).$promise;
                $scope.promiseProcesos =$resource('/api/procesos/procesosTraerTodos').query(successProcesos).$promise;

                $scope.selected = [];
                $scope.perfilGrilla.selected = [];

                function success(data) {
                    $scope.perfilGrilla.count = data.length;
                    $scope.perfilGrilla.data = data;
                    $scope.allPerfiles = data;
                    $scope.perfilGrilla.data = $filter('filter')($scope.allPerfiles, $scope.perfilGrilla.query.filter);
                    perfilQueryFilter($scope.perfilGrilla.query.filter);
                }



                function successAcciones(data) {
                    $scope.acciones = data;
                    // var a = parseAcciones(data.sort(function (it1, it2) {
                    //     if (it1.codigo > it2.codigo) {
                    //         return 1;
                    //     }
                    //     if (it1.codigo < it2.codigo) {
                    //         return -1;
                    //     }
                    //     return 0;
                    // }));
                }

                function successAccionesFuncionalidad(data) {
                   $scope.funcionalidades = data;
                }
                function successProcesos(data) {
                    $scope.procesos = data;
                }

            }

            function add(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'perfil.add.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: {
                        scope: $scope,
                        acciones : mapActionsForTree($scope.acciones),
                        accionesFuncionalidad : mapActionsForTree($scope.funcionalidades),
                        procesos : $scope.procesos,
                        funcionalidades: $scope.funcionalidades,
                        allPerfiles : $scope.allPerfiles
                    },
                    templateUrl: 'app.views/admin/perfiles/create.html'
                }).then(getData);
            }

            function edit(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'perfil.edit.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: {
                        selected: $scope.selected[0],
                        acciones : mapActionsForTree($scope.acciones),
                        accionesFuncionalidad : mapActionsForTree($scope.funcionalidades),
                        procesos : $scope.procesos,
                        funcionalidades: $scope.funcionalidades,
                        allPerfiles : $scope.allPerfiles
                    },
                    templateUrl: 'app.views/admin/perfiles/update.html'
                }).then(getData);
            }

            function del(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'perfil.del.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: { perfilesSeleccionados: $scope.selected },
                    templateUrl: 'app.views/admin/perfiles/delete.html'
                }).then(getData);
            }

            function removeFilter() {
                $scope.perfilGrilla.filter.show = false;
                $scope.perfilGrilla.query.filter = '';
                if($scope.perfilGrilla.filter.form.$dirty) {
                    $scope.perfilGrilla.filter.form.$setPristine();
                }
            }

        }
    });


app.controller('perfil.add.ctrl',
    function ($mdDialog, $mdToast, $resource, $scope, $filter, scope, acciones,accionesFuncionalidad,procesos,funcionalidades, allPerfiles, Perfiles, Global) {
        'use strict';

        $scope.filtrarShow = false;
        $scope.filtrarShowProcesos = false;
        $scope.acciones = [];
        $scope.perfil = {};
        $scope.perfiles = [];
        $scope.selectAllProcesos = false;
        $scope.toggleProcesos = function () {
            $scope.procesos.forEach(function (proceso) {
                proceso.selected = $scope.selectAllProcesos;
            });
        };

        for (var i = 0; i < funcionalidades.length; i++) {
            funcionalidades[i].selected = false;;
        }



        $scope.cleanAccionesSearch = function () {
            $scope.filtrarShow = false;
            $scope.query = "";
        };
        $scope.cleanProcesSearch = function () {
            $scope.filtrarShowProcesos = false;
            $scope.queryProcesos = "";
        };

        $scope.showErrorToastPerfil = function (type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type + '">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };

        $scope.initPopUp = function () {
            $scope.operac = "Alta";
            $scope.acciones = acciones;
            $scope.procesos = procesos;
            $scope.funcionalidades=funcionalidades;
            $scope.accionesFuncionalidad=accionesFuncionalidad;
            $scope.perfiles = allPerfiles;
        };

        $scope.showToastPerfilSuccess = function () {
            $mdToast.show({
                template: '<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>',
                hideDelay: 3000,
                parent: '#toastSelect',
                position: 'top left'
            });
        };
        $scope = scope;
        $scope.errorForm = false;

        $scope.savePerfil = function () {
            var count = $filter('filter')($scope.perfiles, {perfil: $scope.perfil.perfil}, true);
            if (count.length == 0) {
                $scope.perfil.acciones = getSelectedActions($scope.acciones);
                // mod para agregar
                for (var i = 0; i < funcionalidades.length; i++) {
                    if (funcionalidades[i].selected == true) {
                        $scope.perfil.acciones.push(funcionalidades[i]);
                    }
                }

                $scope.perfil.procesos = [];
                for (var d = 0; d < $scope.procesos.length; d++) {

                    if ($scope.procesos[d].selected == true) {
                        // $scope.perfil.procesos.push($scope.procesos[d]);
                    }
                    $scope.perfil.procesos.push($scope.procesos[d]);
                }
                var perfil = new Perfiles($scope.perfil);
                perfil.$save(function (p) {
                    if (p.result == "error") {
                        $scope.showErrorToastPerfil('error', p.message);
                    } else {
                        success(p);
                    }
                });
            } else {
                $scope.showErrorToastPerfil('error', 'Ya existe el perfil ingresado.');
            }
        };

        this.cancel = $mdDialog.cancel;
        function success(obj) {
            $scope.showToastPerfilSuccess();
            $mdDialog.hide(obj);
        }


        //region CONTROLES DEL TREEVIEW

        $scope.toggle = function (obj) {
            
            obj.toggle();

        };

        $scope.data = acciones;
        $scope.toggleChecks =  function (node) {
            if (node.children) {
                node.children.forEach(function (child) {
                    child.selected = node.selected;
                    if (child.children) {
                        $scope.toggleChecks(child);
                    }
                });
            }
        };

        //endregion

    });

app.controller('perfil.edit.ctrl',
    function ($mdDialog, $mdToast, $resource, $scope, $filter, selected, acciones,accionesFuncionalidad, procesos,funcionalidades, allPerfiles, Perfiles, Global) {
        'use strict';

        $scope.filtrarShow = false;
        $scope.filtrarShowProcesos = false;
        $scope.perfiles = [];
        $scope.selectAllProcesos = false;
        $scope.toggleProcesos = function () {
            $scope.procesos.forEach(function (proceso) {
                proceso.selected = $scope.selectAllProcesos;
            });
        };

        $scope.toggleFuncionalidades = function () {
            $scope.funcionalidades.forEach(function (fn) {
                fn.selected = $scope.selectAllFuncionalidades;
            });
        };

        $scope.cleanAccionesSearch = function () {
            $scope.filtrarShow = false;
            $scope.query = "";
        };
        $scope.cleanProcesSearch = function () {
            $scope.filtrarShowProcesos = false;
            $scope.queryProcesos = "";
        };



        $scope.initPopUp = function(){
            $scope.operac = "Modificación";
            $scope.perfil = angular.copy(selected);
            var vPerfiles = $resource('/api/admin/perfilesPorNivel');
            var vPerfilesProcesos= $resource('/api/admin/perfilesProcesos/:perfilId', {perfilId: $scope.perfil.idPerfil});


            $scope.acciones = acciones;
            $scope.procesos = procesos;
            $scope.funcionalidades=funcionalidades;
            $scope.accionesFuncionalidad=accionesFuncionalidad;

            vPerfilesProcesos.query(function(res) {
                $scope.perfilProcesos = res;
                initList($scope.procesos, $scope.perfilProcesos,"nombre");
            }, function(err) {
                if (err.status == 401) {
                    $scope.authorized=false;
                    $scope.showErrorToastPerfil('error' ,err.data.message);
                }else{
                    $scope.showErrorToastPerfil('error', err.data.message);
                }
            });

            var vPerfilesAcciones= $resource('/api/admin/perfilesAcciones/:perfilId', {perfilId : $scope.perfil.idPerfil});
            vPerfilesAcciones.query(function(res) {
                $scope.perfilAcciones = res;
                initTree($scope.acciones,$scope.perfilAcciones ,"codigo");
            }, function(err) {
                if (err.status == 401) {
                    $scope.authorized=false;
                    $scope.showErrorToastPerfil('error', err.data.message);
                }else{
                    $scope.showErrorToastPerfil('error', err.data.message);
                }
            });

            // Modificaciones -------------------------------------------------------------------


            var vPerfilesFuncionalidades=$resource('/api/admin/perfilesfuncionalidades/:perfilId', {perfilId : $scope.perfil.idPerfil,funcionalidad:1});
            vPerfilesFuncionalidades.query(function successFuncionalidades(data) {
                $scope.perfilFuncionalidad= data;
                        initList($scope.funcionalidades, $scope.perfilFuncionalidad,"nombre");
                    // initTree($scope.funcionalidades,$scope.perfilFuncionalidad ,"codigo");
                }, function(err) {
                if (err.status == 401) {
                    $scope.authorized=false;
                    $scope.showErrorToastPerfil('error', err.data.message);
                }else{
                    $scope.showErrorToastPerfil('error', err.data.message);
                }
            });



        };

        $scope.showErrorToastPerfil = function(type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };

        $scope.showToastPerfilSuccess = function() {
            $mdToast.show({
                template: '<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>',
                hideDelay: 3000,
                parent: '#toastSelect',
                position: 'top left'
            });
        };

        this.cancel = $mdDialog.cancel;

        function success(obj) {
            $scope.showToastPerfilSuccess();
            $mdDialog.hide(obj);
        }

        $scope.savePerfil= function() {
            $scope.perfil.acciones = getSelectedActions($scope.acciones);

            // MOD
            for (var i = 0; i < funcionalidades.length; i++) {
                if (funcionalidades[i].selected == true) {
                    $scope.perfil.acciones.push(funcionalidades[i]);
                }
            }

            $scope.perfil.procesos = [];
            for (var i = 0; i < $scope.procesos.length; i++) {
                if ($scope.procesos[i].selected == true) {
                    $scope.perfil.procesos.push($scope.procesos[i]);
                }
            }

            Perfiles.update({id: $scope.perfil.idPerfil}, $scope.perfil, function (res) {
                success(res);
            }, function (err) {
                if (err.status == 401) {
                    $scope.showErrorToastPerfil('error', 'No está autorizado a manejar perfiles');
                } else {
                    $scope.showErrorToastPerfil('error', err.data.message);
                }
            });
        }

        $scope.toggleChecks =  function (node) {
            if (node.children) {
                node.children.forEach(function (child) {
                    child.selected = node.selected;
                    if (child.children) {
                        $scope.toggleChecks(child);
                    }
                });
            }
        };
    });


app.controller('perfil.del.ctrl',
    function (perfilesSeleccionados, $mdDialog, $mdToast, $scope, $q, PerfilesDelete, Global) {
        'use strict';
        var date = new Date();
        $scope.currentDate = date;
        //date.setDate(date.getDate() - 1);
        $scope.fecBajaAll = new Date();
        $scope.operac = "Baja";
        $scope.perfilesDeleteGrilla = {
            "data" : perfilesSeleccionados
        };


        for (var i=0;i<$scope.perfilesDeleteGrilla.data.length;i++){
            if($scope.perfilesDeleteGrilla.data[i].fecBaja!=null){
                if($scope.perfilesDeleteGrilla.data[i].fecBaja.length>10){
                    var dateAux=$scope.perfilesDeleteGrilla.data[i].fecBaja.substr(0, 10).replace(/-/g ,'/');
                    $scope.perfilesDeleteGrilla.data[i].fecBaja=moment(dateAux).format('DD/MM/YYYY');
                }
            }
        }

        /*
         if($scope.proceso.fecInicio!=null){
         var jdate=$scope.proceso.fecInicio.toJSON().toString();
         $scope.procesoToSave.fecInicio=jdate.substr(0, jdate.indexOf("T"))+'T00:00:00.000Z';
         }
         */

        $scope.showErrorToastPerfil = function(type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };

        $scope.showToastPerfilSuccess = function() {
            $mdToast.show({
                template: '<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>',
                hideDelay: 3000,
                parent: '#toastSelect',
                position: 'top left'
            });
        };

        this.cancel = $mdDialog.cancel;

        function borrarPerfil(obj, index) {

            obj.usuario = Global.currentUser.name;
            /*
             console.log(obj.idPerfil);
             $scope.fecBajaAll.setHours(0);
             $scope.fecBajaAll.setMinutes(0);
             $scope.fecBajaAll.setSeconds(0);
             */


            var date=moment($scope.fecBajaAll).format('YYYY/MM/DD');
            obj.fecBaja = date;


            PerfilesDelete.delete({id: obj.idPerfil}, obj, function(res){
                //$location.path('perfiles');
            }, function(err) {
                $scope.showErrorToastPerfil('error', err.data.message);
                if (err.status == 401) {
                    $scope.showErrorToastPerfil('error', err.data.error)
                }
            });
        }

        function onComplete() {
            $scope.showToastPerfilSuccess();
            $mdDialog.hide();
        }

        this.confirmOperation = function(errors){

            if ($scope.fecBajaAll == null || $scope.fecBajaAll=="") {
                $scope.showErrorToastPerfil('error', 'Ingresar Fecha de baja');
                return;
            }

            var fCierre=document.getElementById("fecBajaAll");
            if(fCierre.attributes['aria-invalid'].value=='true'){
                $scope.showErrorToastPerfil('error','La fecha de baja no es  válida.');
                return;
            }

            if (typeof errors.mindate == 'undefined' && typeof errors.valid == 'undefined') {
                if ($scope.fecBajaAll != null) {
                    $q.all(perfilesSeleccionados.forEach(borrarPerfil)).then(onComplete);
                } else {
                    $scope.showErrorToastPerfil('error', 'La Fecha de Baja no es válida.');
                }
            } else {
                if (typeof errors.mindate != 'undefined') {
                    $scope.showErrorToastPerfil('error', 'La Fecha de Baja no puede ser menor a la fecha actual.');
                } else {
                    $scope.showErrorToastPerfil('error', 'La Fecha de Baja no es valida.');
                }
            }
        }
    });

app.filter('filterAcciones', function () {
    return function (items, query) {
        var filtered = [];
        if (!query || query === '') {
            return items;
        }
        var children = getChildrenActions(items);
        children.forEach(function (child) {
            if (child.title.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                filtered.push(child);
            }
        });
        return filtered;
    }
});

//app.controller('perfilDelete.ctrl', ['$scope','$routeParams','$resource','$location','$mdDialog', '$mdMedia', '$mdToast','datacontext','Perfiles','Acciones', 'Global',
//    function ($scope,$routeParams,$resource,$location,$mdDialog, $mdMedia, $mdToast,datacontext,  Perfiles,  Acciones, Global) {
//
//        Global.setModule('user');
//        $scope.perfil = [];
//        $scope.acciones= [];
//
//        $scope.back=function() {
//            $location.path('perfiles');
//        }
//
//        var vPerfiles= $resource('/admin/perfiles/:perfilId', {perfilId:$routeParams.perfilId});
//        $("#Container_Acciones").addClass("loadingContent");
//        $scope.perfil= vPerfiles.get({perfilId:$routeParams.perfilId}, function(res) {
//             $("#Container_Acciones").removeClass("loadingContent");
//        });
//
//        $scope.deletePerfil= function() {
//
//            var confirm = $mdDialog.confirm()
//                .title('Desea eliminar el perfil?')
//                .textContent('')
//                .ariaLabel('Lucky day')
//                .targetEvent()
//                .ok('Aceptar')
//                .cancel('Cancelar');
//            $mdDialog.show(confirm).then(function() {
//                if(typeof  $routeParams.perfilId!='undefined'){
//                    Perfiles.delete({id: $routeParams.perfilId}, function(res){
//                        $location.path('perfiles');
//                    }, function(err) {
//                        console.log("+ Perfiles.delete Error",err.data.message  );
//                        $mdDialog.show(
//                            $mdDialog.alert()
//                                .parent(angular.element())
//                                .clickOutsideToClose(true)
//                                .textContent(err.data.message)
//                                .ariaLabel('Alert Dialog Demo')
//                                .ok('Aceptar')
//                                .targetEvent()
//                        );
//
//                        if (err.status == 401) {
//                            alert(err.data.error)
//                        }
//                    });
//                }
//            }, function() {
//                // cancelar
//            });
//
//
//        }
//
//    }]);
//
//
//
//
///*
// Ej1: var item=searchItem(array,"key",item);
// Ej2: var item=searchItem($scope.acciones,"code",accion["code"]);
// */
//
//function searchItem(arr,key, value) {
//    for (var d = 0, len = arr.length; d < len; d += 1) {
//        if (arr[d][key] === value) {
//            return arr[d];
//        }
//    }
//}
//
//function initList(listCompleta,SelectedItems, key) {
//    for (var i = 0; i < SelectedItems.length; i++) {
//        var item=searchItem(listCompleta,key, SelectedItems[i][key]);
//        if (!(typeof item === 'undefined')){
//            if(item[key]==SelectedItems[i][key]){
//                item.selected=true;
//            }
//        }
//    }
//}