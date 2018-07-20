app.controller('fallecidosPeriodo.ctrl',
    function ($resource,$http,$mdDialog,$mdEditDialog,$mdToast, $scope,Global,Fallecidos,$q,ProcesosRun,$route,$filter) {

        var vFallecidos=new PFallecidos.Fallecidos($resource,$http,$mdDialog,$mdEditDialog,$mdToast, $scope,Global,Fallecidos,$q,ProcesosRun,$route,$filter);

        $scope.changeFechaDesde =vFallecidos.changeFechaDesde;
        $scope.changeFechaHasta =vFallecidos.changeFechaHasta;
        $scope.showErrorToastCalendario =vFallecidos.showErrorToastCalendario;
        $scope.showToastCalendarioSuccess=vFallecidos.showToastCalendarioSuccess;
        $scope.addHorasPopUp=vFallecidos.addHorasPopUp;


        $scope.operac = "";
        $scope.optblah = false;
        $scope.selected = [];
        $scope.allCalendarios = [];
        $scope.fdFallecidosCalendario = frontDoor();      //frontDoor :: funciones de acción

        $scope.gdFallecidosCalendario = gridDoor();       //gridDoor :: funciones de la grilla

        //$scope.selected = [];  //aquí van a parar los registros seleccionados
        $scope.calendarioFallecidosGrilla = {
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

        $scope.$watch('calendarioFallecidosGrilla.query.filter', function (newVal) {
            if ($scope.allCalendarios.$resolved == true && newVal.toString() != '') {
                $scope.calendarioFallecidosGrilla.data = $filter('filter')($scope.allCalendarios, {periodo: newVal});
                $scope.calendarioFallecidosGrilla.count = $scope.calendarioFallecidosGrilla.data.length;
            }else{
                $scope.calendarioFallecidosGrilla.data = $filter('filter')($scope.allCalendarios, {periodo: newVal});
                $scope.calendarioFallecidosGrilla.count = $scope.calendarioFallecidosGrilla.data.length;
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
                getData(angular.extend({}, $scope.query, {page: page, limit: limit}));
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
                $scope.promise = $resource('/api/fallecidos/obtenerPeriodo/').query(success).$promise;
                $scope.allCalendarios = [];
                $scope.calendarioFallecidosGrilla.selected = [];

                function success(data) {
                    console.log("1) data -> ",data);
                    $scope.calendarioFallecidosGrilla.count = data.length;
                    angular.forEach(data, function(key, value){
                        $scope.addHorasPopUp(key);
                        $scope.allCalendarios.push(key);
                    });
                    $scope.calendarioFallecidosGrilla.data = $scope.allCalendarios;
                    $scope.selected = [];
                }
            }

            function add(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'fallecidosPeriodo.add.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: {
                        scope: $scope,
                        allCalendarios: $scope.allCalendarios
                    },
                    templateUrl: 'app.views/fallecidos/popUps.html'
                }).then(getData);
            }

            function edit(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'fallecidosPeriodo.edit.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: {
                        selected: $scope.selected[0]
                    },
                    templateUrl: 'app.views/fallecidos/popUps.html'
                }).then(getData);
            }

            function removeFilter() {
                $scope.calendarioFallecidosGrilla.filter.show = false;
                $scope.calendarioFallecidosGrilla.query.filter = '';
            }
        }

    });


app.controller('fallecidosPeriodo.add.ctrl',
    function ($resource,$http,$mdDialog,$mdEditDialog,$mdToast, $scope,Global,Fallecidos,$q,ProcesosRun,$route, Toast) {
        'use strict';

        $scope.calendario = {};
        $scope.regex="^([0-9]{4})*-([0-9]{2})";
        $scope.regexOnlyNumbers= "^[1-4]{1}$";
        $scope.errorForm = false;
        $scope.minDateControl= null;


        var vFallecidos=new PFallecidos.Fallecidos($resource,$http,$mdDialog,$mdEditDialog,$mdToast, $scope,Global,Fallecidos,$q,ProcesosRun,$route);

        $scope.changeFechaDesde =vFallecidos.changeFechaDesde;
        $scope.changeFechaHasta=vFallecidos.changeFechaHasta;
        $scope.showErrorToastCalendario =vFallecidos.showErrorToastCalendario;
        $scope.showToastCalendarioSuccess=vFallecidos.showToastCalendarioSuccess;
        $scope.addHorasPopUp=vFallecidos.addHorasPopUp;

        $scope.initPopUp = function(){
            $scope.operac = "Alta";
        };

        $scope = scope;
        $scope.errorForm = false;

        this.cancel = $mdDialog.cancel;

        function success(obj) {
            $scope.showToastCalendarioSuccess();
            $mdDialog.hide(obj);
        }

        function getFecha(data){
            if (data!=null){
                var date=moment(data).format('YYYY/MM/DD');
                return new Date(date);
            }
            return null
        }

        this.confirmOperation = function (isValid) {
            if (isValid) {
                $scope.calendario.usuario = Global.currentUser.name;
                $scope.calendario.fecHasta=getFecha($scope.calendario.fecHasta);
                var vPeriodo = new FaPeriodo($scope.calendario);
                vPeriodo.$save(function (p) {
                    if (p.result == "error") {
                        alert(p.result);
                    } else {
                        success(p);
                    }
                }, function (err) {
                    $scope.showErrorToastCalendario('error', err.data.message);
                });
            }
        };
    });

app.controller('fallecidosPeriodo.edit.ctrl',
    function ($resource,$http,$mdDialog,$mdEditDialog,$mdToast, $scope,Global,Fallecidos,$q,ProcesosRun,$route,selected) {
        'use strict';
        function getFecha(data){
            if (data!=null){
                var date=moment(data).format('YYYY/MM/DD');
                return new Date(date);
            }
            return null
        }


        $scope.errorForm = false;
        $scope.initPopUp = function(){
            $scope.operac = "Modificación";
            $scope.calendario = angular.copy(selected);
            $scope.calendario .usuario = Global.currentUser.name;
            $scope.addHorasPopUp($scope.calendario);
            $scope.changeFecha();
        }
        var vFallecidos=new PFallecidos.Fallecidos($resource,$http,$mdDialog,$mdEditDialog,$mdToast, $scope,Global,Fallecidos,$q,ProcesosRun,$route);

        $scope.changeFechaHasta =vFallecidos.changeFechaHasta;
        $scope.changeFechaDesde =vFallecidos.changeFechaDesde;
        $scope.showErrorToastCalendario =vFallecidos.showErrorToastCalendario;
        $scope.showToastCalendarioSuccess=vFallecidos.showToastCalendarioSuccess;
        $scope.addHorasPopUp=vFallecidos.addHorasPopUp;
        this.cancel = $mdDialog.cancel;
        function success(obj) {
            vFallecidos.showToastSuccess();
            $mdDialog.hide(obj);
        }
        this.confirmOperation = function (isValid) {
            if(typeof  $scope.calendario.fecHasta =='undefined') {
                $scope.showErrorToastCalendario('error','La fecha de cierre es requerida.');
                return;
            }
            if(typeof  $scope.calendario.fecDesde =='undefined') {
                $scope.showErrorToastCalendario('error','La fecha de control es requerida.');
                return;
            }
            if (isValid) {
                    var fa_periodo = $resource('/api/fallecidos/Periodo/:idPeriodo',
                        {idPeriodo:$scope.calendario.idPeriodo}, {
                            update: {method:'PUT'}
                        });
                $scope.calendario.fecHasta=getFecha($scope.calendario.fecHasta);

                fa_periodo.update({idPeriodo: $scope.calendario.idPeriodo}, $scope.calendario).$promise
                    .then(function (res) {
                        success(res);
                    })
                    .catch(err => {
                        $scope.loading = false;
                    });
            }
        };
    });


var columnsFallecidos=[{ id: 1, show: false, name: 'idFallecidos', field: 'idFallecidos', tip: '',align:""},
{ id: 2, show: false, name: 'idProceso', field: 'idProceso', tip: ''},
{ id: 3, show: true, name: 'GPO', field: 'grupo', tip: ''},


{ id: 4, show: true, name: 'CUIL', field: 'cuil', tip: ''},
{ id: 6, show: true, name: 'DENOMINACIÓN', field: 'denominacionCuenta', tip: ''},
{ id: 7, show: true, name: 'ESTA. CTA', field: 'estadoCuenta', tip: ''},
{ id: 8, show: true, name: 'FECHA DE FALLECIMIENTO', field: 'fecFallecimiento', tip: '',filter:'date'},
{ id: 9, show: true, name: 'P. LIQUIDACIÓN', field: 'periodoLiquidacion', tip: '',filter:'date'},
{ id: 10, show: true, name: 'P. PAGO', field: 'periodoPago', tip: '',filter:'date'},
{ id: 11, show: false, name: 'nroCarga', field: 'nroCarga', tip: ''},
{ id: 12, show: true, name: 'ARCHIVO', field: 'archivo', tip: ''},
{ id: 13, show: false, name: 'estadoFallecido', field: 'estadoFallecido', tip: ''},
{ id: 14, show: false, name: 'motivo', field: 'motivo', tip: ''},
{ id: 15, show: true, name: 'CPP', field: 'cpp', tip: ''},
{ id: 16, show: true, name: 'NRO BENEF', field: 'nroBeneficio', tip: ''},
{ id: 17, show: false, name: 'nomyApellido', field: 'nomyApellido', tip: ''},
{ id: 18, show: true, name: 'DISPONIBLE CTA', field: 'disponibleCuenta', tip: 'number',align:"right"},
{ id: 19, show: true, name: 'SALDO CUENTA', field: 'saldoCuenta', tip: 'number', align:"right"},  // mod
{ id: 20, show: true, name: 'IMP. BENEFICIO', field: 'importeLiquido', tip: 'number',align:"right"}, // mod
{ id: 21, show: true, name: 'NRO CUENTA', field: 'nroCuenta', tip: ''},
{ id: 22, show: true, name: 'DEBITOS ASOCIADOS', field: 'debitosAsociados', tip: 'number',align:"right"},
{ id: 23, show: true, name: 'CAUSAL', field: 'causal304', tip: ''},
{ id: 5, show: true, name: 'SUC', field: 'sucursal', tip: ''},      // mod
{ id: 24, show: true, name: 'IMPORTEADEBITAR', field: 'importeADebitar', tip: 'number',align:"right"}, // mod
{ id: 25, show: false, name: 'fecProceso', field: 'fecProceso', tip: ''},
{ id: 26, show: false, name: 'periodoDesde', field: 'periodoDesde', tip: ''},
{ id: 27, show: false, name: 'periodoHasta', field: 'periodoHasta', tip: ''},
{ id: 28, show: true, name: 'ESTADO', field: 'estado', tip: ''},                    // mod
{ id: 29, show: true, name: 'ESTADO DATAENTRY', field: 'estadoDataEntry', tip: ''}, // mod
{ id: 30, show: false, name: 'DescripcionEstado', field: 'DescripcionEstado', tip: ''},
{ id: 31, show: false, name: 'nombreArchivo', field: 'nombreArchivo', tip: ''},
{ id: 32, show: false, name: 'creadoPor', field: 'creadoPor', tip: ''},
{ id: 33, show: false, name: 'fecCreacion', field: 'fecCreacion', tip: ''},
{ id: 34, show: false, name: 'modificadoPor', field: 'modificadoPor', tip: ''},
{ id: 35, show: false, name: 'fecModificacion', field: 'fecModificacion', tip: ''}]




app.controller('fallecidos.ctrl',
    function ($resource,$http,$mdDialog,$mdEditDialog,$mdToast, $scope,Global,Fallecidos,$q,ProcesosRun,$route,$filter) {
        'use strict';
        $scope.columns=columnsFallecidos;

        $scope.estados=[{estado:"Seleccionar...",value:null},
            {estado:"A Analizar",value:"A ANALIZAR"},
            {estado:"A Recuperar",value:"A RECUPERAR"},
            {estado:"A Recuperar - Reversa",value:"A Recuperar - Reversa"},
            {estado:"A Recuperar - Fuera de Termino",value:"A Recuperar - Fuera de Termino"}];



        $scope.estadosDataEntry=[
            {estado:"Seleccionar...",value:null},
            {estado:"Ok",value:"OK"},
            {estado:"Error",value:"Error"}];

        $scope.estadosDataEntryEdit=[
            {estado:"Seleccionar...",value:null},
            {estado:"Ok",value:"OK"},
            {estado:"Error",value:"Error"}];

        var vFallecidos=new PFallecidos.Fallecidos($resource,$http,$mdDialog,$mdEditDialog,$mdToast, $scope,Global,Fallecidos,$q,ProcesosRun,$route,$filter);

        $scope.vFallecidos=vFallecidos;
        console.log("$scope.agendas=vFallecidos.agendas;",$scope.agendas,vFallecidos.agendas)


        $scope.showErrorToastCalendario =vFallecidos.showErrorToast;
        $scope.showToastCalendarioSuccess=vFallecidos.showToastSuccess;
        $scope.showVal=vFallecidos.showVal;

        $scope.operac = "";
        $scope.optblah = false;
        $scope.selected = [];
        $scope.loaded = true;
        $scope.filtrado = false;
        $scope.fdFallecidos = frontDoor();      //frontDoor :: funciones de acción
        $scope.gdFallecidos = gridDoor();       //gridDoor :: funciones de la grilla

        $scope.fallecidosGrilla = {
            "selected": [],
            "data": [],
            "count": 0,
            "filter": {
                show: false,
                options: {
                    debounce: 500
                }
            },
            "query": {
                filter: {},
                limit: '1000000',
                order: 'cuil',
                page: 1
            }
        };

        $scope.fallecidosGrilla.query.filter.fecha = new Date();

        $scope.exportarAExcel = function () {
            var obj=$scope.fallecidosGrilla.query.filter;
            var params= "";
            if (obj.estado){
                params= "estado=" +obj.estado;
            }

            if (obj.estadoDataEntry){
                params=params+"&estadoDataEntry="+ obj.estadoDataEntry;
            }

            if (obj.fecha){
                params=params+"&fecha="+ moment(obj.fecha).utc().format('YYYY/MM/DD') ;
            }
            if (obj.nroCuenta){
                params=params+"&nroCuenta="+ obj.nroCuenta;
            }
            return '/api/fallecidos/pantallaExportarExcel?'+params
        }

        $scope.selectEstado= function () {
            console.log("1) Change estado, fallecidosGrilla",$scope.fallecidosGrilla.query);
            // $scope.getData(angular.extend($scope.fallecidosGrilla.query, {page: 1}));
        };

        $scope.selectEstado= function () {
            console.log("1) Change estado, fallecidosGrilla",$scope.fallecidosGrilla.query);
            // $scope.getData(angular.extend($scope.fallecidosGrilla.query, {page: 1}));
        };
        $scope.init = function(){
            gridDoor().getData();
        }

        $scope.onReorder= function(order){
            console.log("Order ",order);
        }

        $scope.getCursor=function(column){
            if(column.field=="disponibleCuenta" || column.field=="estadoDataEntry"){
                return "hand"
            }else{
                return "default"
            }
        }

        $scope.fallecidosUpdate= function(ev,column,row){
            console.log("row -> ",row)
            var data={name:column.field};
            switch(column.field) {
                case "disponibleCuenta":
                    data.type="number"
                    console.log("data",data)
                    vFallecidos.editarDisponibleCuenta(ev,row,data);
                    break;
                case "estadoDataEntry":
                     console.log(" row.estadoDataEntry", row.estadoDataEntry)
                    if( row.estadoDataEntry==null || row.estadoDataEntry.toUpperCase()!="ERROR" ){
                        vFallecidos.showErrorToast("Error","El estado DataEntry solo se puede actualizar si se encuentra en estado de error.");
                        return;
                    }

                    var confirm = $mdDialog.confirm()
                        .title('Desea Cambiar el Estado DataEntry a OK?')
                        .textContent('')
                        .ariaLabel('Lucky day')
                        .targetEvent(ev)
                        .ok('Aceptar')
                        .cancel('Cancelar');

                    $mdDialog.show(confirm).then(function() {
                        row.estadoDataEntry_previo=row.estadoDataEntry;
                        row.estadoDataEntry='OK'
                        vFallecidos.updateField(row, function(res){
                            console.log(res)
                            row.estadoDataEntry=row.estadoDataEntry_previo;
                        });
                    }, function() {});



                    break;
                default:
                    ;
            }
        }


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
                $scope.fallecidosGrilla.query.page = page;
                $scope.fallecidosGrilla.query.limit = limit;
                $scope.load($scope.grilla.query);
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
                console.log("onReorder",order);
                getData(angular.extend({}, $scope.fallecidosGrilla.query, {order: order}));
            }

            function getData(query) {
                console.log("0) getData-> query,fallecidosGrilla",query,$scope.fallecidosGrilla.query)
                $scope.loaded = false;
                $scope.promiseObj = $resource('/api/fallecidos').query(query || $scope.fallecidosGrilla.query, bien, mal).$promise;
                function bien(obj) {
                    $scope.loaded = true;
                    $scope.fallecidosGrilla.data = obj;
                    if (obj.length > 1) {
                        $scope.fallecidosGrilla.count = obj.length;
                    }
                }
                function mal(obj) {
                    $scope.loaded = true;
                    $scope.showErrorToastCalendario ('error','Error al obtener los datos')
                }
            }

            function add(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'fallecidos.add.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: {
                        scope: $scope,
                        allCalendarios: $scope.allCalendarios
                    },
                    templateUrl: 'app.views/fallecidos/popUps.html'
                }).then(getData);
            }

            function edit(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'fallecidos.edit.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: {
                        selected: $scope.selected[0]
                    },
                    templateUrl: 'app.views/fallecidos/popUps.html'
                }).then(getData);
            }

            function removeFilter() {
                $scope.fallecidosGrilla.filter.show = false;
            }
        }
    });


var AgendaFallecidos= (function () {
    function ArchivosAgenda($scope,$mdToast,$mdDialog,$http,$resource,ProcesosRun,Global,$route) {
        this.archivos='undefined';
        this.proceso='undefined';
        this.index='undefined';
        this.confirm='undefined';
        this.listConvenios=[];
        var timer;
        this.ObtenerArchivos=function(){
            var _this=this;

            console.log("AgendaFallecidos.ObtenerArchivos",this.proceso)
            _this.vProcesoArchivos.query({idProceso: this.proceso.idProceso}, function(res) {
                _this.proceso.running = false;
                _this.archivos=res;
                console.log("Res ObtenerArchivos");
                if (user.app=="PP"){
                    console.log("Res ObtenerArchivos PP");
                    _this.getAperturaCuentaConvenios()
                }else{
                    if (user.app=="TC"){
                        console.log("Res ObtenerArchivos TC");
                        _this.ObtenerConveniosDeArchivos();
                    }
                }
            },function(e){
                if(e.data.STATUS=="ERROR"){
                    _this.showErrorToast('Error',e.data.message);
                    _this.proceso.running = false;
                }
                if (e.data.notAll) {
                    mdDialog.show({
                        clickOutsideToClose: true,
                        template:
                        '<md-dialog md-theme="default" ng-class="dialog.css" class="_md md-default-theme md-transition-in">' +
                        '<md-dialog-content class="md-dialog-content">' +
                        '<h2 class="md-title ng-binding">Error</h2>' +
                        '<div class="md-dialog-content-body">' +
                        '<p>Faltan archivos para comenzar el cruce:</p>' +
                        '<p ng-repeat="faltante in faltantes">- {{faltante}}</p>' +
                        '</div>' +
                        '</md-dialog-content>' +
                        '<md-dialog-actions>' +
                        '<md-button ng-click="closeDialog()" class="md-primary">' +
                        'Aceptar' +
                        '</md-button>' +
                        '</md-dialog-actions>' +
                        '</md-dialog>',
                        controller: function DGISicoreMessageController($scope, faltantes, mdDialog) {
                            $scope.closeDialog = mdDialog.hide;
                            $scope.faltantes = faltantes;
                        },
                        locals: { faltantes: e.data.missing, mdDialog: mdDialog }
                    });
                    this.proceso.running = false;
                    return;
                }
            });
        };
        this.getAperturaCuentaConvenios=function(){
            var _this=this;
            console.log("AgendaFallecidos.getAperturaCuentaConvenios")
            _this.vAperturaCuentaConvenios.query({}, function(res){
                _this.aperturaCuentaConvenios=res;
                console.log("AgendaFallecidos.getAperturaCuentaConvenios",res)
                _this.ObtenerConveniosDeArchivos();
            },function(e){
                if(e.data.STATUS=="ERROR"){
                    _this.showErrorToast('Error',e.data.message);
                    return;
                }
            });
        };
        this.ObtenerConveniosDeArchivos=function(){
            var _this=this;
            if (_this.archivos.length > 0) {
                _this.obtenerArchivosProcesar()
                _this.obtenerArchivosProcesarSinCarpeta()
                if (user.app=="PP"){
                    if(_this.proceso.descripcion === "Altas Masivas - Rta.Vinc.Migra"){
                        _this.obtenerConvenios();
                    }
                }
                var confirmPedido3;
                if (_this.files_data.indexOf("PPR_fil_datos_apoderados")<0 && _this.proceso.descripcion=="Altas Masivas - Marcar Datos"){
                    confirmPedido3 = $mdDialog.confirm()
                        .title('')
                        .textContent('No se encuentra el archivo de respuesta de Merlín. No se realizará la normalización de datos. Desea continuar?')
                        .ariaLabel('Lucky day') // modificacion
                        .targetEvent(_this.confirm.event)
                        .ok('Aceptar')
                        .cancel('Cancelar');
                    $mdDialog.show(confirmPedido3).then(function() {
                        _this.confirmarProcesar();
                    }, function() {});

                }else{
                    _this.confirmarProcesar();
                }
            } else {
                _this.showErrorToast('Error',"No se encontraron archivos para este proceso.");
            }

        };
        this.confirmarProcesar=function(){
            var _this=this;
            console.log("AgendaFallecidos.confirmarProcesar")
            switch (_this.proceso.descripcion) {
                case "Altas Masivas - Rta.Vinc.Migra":
                    _this.Template= "agendaConvenios.tmpl.html";
                    break;
                case "Recargable - Ajuste Salta VI":
                    _this.Template= "multicheck.html";
                    break;
                case "Fallecidos - Lectura Cobis":
                    _this.Template= "fallecidosPeriodos.html";
                    break;
                default:
                    _this.Template= "";
            }
            _this.titulo = 'Archivos a procesar, desea continuar?';
            // _this.text = _this.files;

            // Codigo nuevo ----------------------------------------------------------------------
            confirm = $mdDialog.confirm()
                .title(_this.titulo )
                .textContent(_this.files)
                .ariaLabel('Lucky day')
                .targetEvent(this.event)
                .ok('Aceptar')
                .cancel('Cancelar');

            console.log("AgendaFallecidos.confirmarProcesar -> confirm.Template",_this.Template)
            switch (_this.Template) {
                case "agendaConvenios.tmpl.html":
                    console.log("Confirmar: this.show, agendaConvenios.tmpl.html")

                    /*
                    $scope.param=param;
                    $scope.param2=param2;
                    $scope.param3=param3;
                    */
                    // $scope.listConvenios --> convenios de la carpeta
                    var convenios_existen=_this.obtenerConveniosCarpeta_aperturaCuenta();
                    var conveniosProcesados=_this.getConveniosProcesadosString(" -");
                    if(convenios_existen.length<=0){
                        _this.showErrorToast('Error',"No existen archivos para los convenios: "+ conveniosProcesados )
                        return;
                    }

                    $mdDialog.show({
                        clickOutsideToClose: true,
                        scope: $scope,
                        preserveScope: true,
                        templateUrl:"agendaConvenios.tmpl.html",
                        controller: function DialogController($scope, $mdDialog) {
                            $scope.closeDialog = function() {
                                $mdDialog.hide();
                            }
                            $scope.aceptar = function(){

                                var strConvenios= agenda_funcionalidad.getConveniosProcesadosString(";");

                                if(strConvenios==""){
                                    _this.showErrorToast('Error',"No se ha seleccionado convenios.");
                                    return;
                                }

                                // Este parametro los usa  el proceso 'Altas Masivas - Rta.Vinc.Migra'
                                // para saber que convenios procesar.
                                var sendData={  nombreProceso:"Altas Masivas - Rta.Vinc.Migra",
                                    agrupar:1,
                                    paramNombre:"Convenios_Generar",
                                    paramValor:strConvenios}
                                $http({
                                    method: 'POST',
                                    url: '/api/procesos/procesoParamInsertar',
                                    data:sendData
                                }).then(function successCallback(response) {
                                    var res=_this.obtenerArchivosPorConvenioSeleccionado();
                                    if (typeof res!='undefined'){
                                        $scope.param3=res;
                                    }
                                    // $scope.param,$scope.param2,$scope.param3
                                    _this.runConfirm();
                                    $mdDialog.hide();
                                }, function errorCallback(response) {
                                    $mdDialog.hide();
                                });
                            }
                        }
                    });


                    break;
                case "multicheck.html":
                    console.log("Confirmar: this.show, multicheck.html")
                    this.showMulticheck(event);
                    break;
                case "fallecidosPeriodos.html":
                    console.log("Confirmar: this.show, fallecidosPeriodos.html")
                    this.showFallecidos(event);
                    break;
                default:
                    var _this=this;
                    console.log("Confirmar: this.show, default")
                    $mdDialog.show(confirm).then(function(){
                            _this.runConfirm()
                    },function(){
                            console.log("Se cancelo la ejecucion")
                        });
            }

            // ----------------------------------------------------------------------
        };
        this.obtenerArchivosProcesar=function(){
            console.log("AgendaFallecidos.obtenerArchivosProcesar")
            // Los archivos a procesar vienen: NombreCarpeta\nombreArchivo.txt
            this.files_data="";
            for(var i=0;i<this.archivos.length;i++){
                if(typeof this.archivos[i].directorio!='undefined'){
                    if(this.archivos[i].directorio!=""){
                        this.files_data =this.files_data+ this.archivos[i].directorio+ "\\" + this.archivos[i].file+";";
                        this.archivos[i].files_data=this.archivos[i].directorio+ "\\" + this.archivos[i].file;
                    }else{
                        this.files_data =this.files_data+this.archivos[i].file+";";
                        this.archivos[i].files_data=this.archivos[i].file;
                    }
                }else{
                    if(typeof this.archivos[i]!='object') {
                        this.files_data = this.files_data + this.archivos[i] + ";";
                        this.archivos[i].files_data=this.archivos[i];
                    }else{
                        this.files_data = this.files_data + this.archivos[i].file.file+ ";";
                        this.archivos[i].files_data=this.archivos[i].file.file;
                    }
                }
            }
        };
        this.obtenerArchivosProcesarSinCarpeta=function(){
            console.log("AgendaFallecidos.obtenerArchivosProcesarSinCarpeta")
            // Los archivos sin carpeta son los mismos que trae  (obtenerArchivosProcesar)
            // pero sin la carpeta nombreArchivo.txt
            this.files="";
            for(var i=0;i<this.archivos.length;i++){
                if(typeof this.archivos[i].directorio!='undefined'){
                    this.files=this.files+" - "+this.archivos[i].file+" ";
                }else{
                    if(typeof this.archivos[i]!='object') {
                        this.files = this.files + " - " + this.archivos[i] + " ";
                    }else{
                        this.files = this.files + " - " + this.archivos[i].file.file + " ";
                    }
                }
            }
        };
        this.obtenerConvenios=function(){
            console.log("AgendaFallecidos.obtenerConvenios",this)
            _this=this;
            var convenios={};
            var archivos_convenios=this.files.replace('-', '').replace(/ /g, '').split("-")

            for(var i=0;i<archivos_convenios.length;i++){


                if(archivos_convenios[i].indexOf("PPR_fil_datos_apoderados")<0){
                    cvn=this.obtenerConvenioDelArchivo(archivos_convenios[i])
                    convenios[cvn]=isNaN(convenios[cvn])? 0:convenios[cvn]+1;
                    this.archivos[i].convenio=this.obtenerConvenioDelArchivo(this.archivos[i].file)
                }
            }
            console.log("convenios",convenios)
            _this.listConvenios=[]
            Object.keys(convenios).forEach(function(key) {
                _this.listConvenios.push({convenio: key, selected:false})
            });
        };
        this.obtenerArchivosPorConvenioSeleccionado=function(){
            console.log("AgendaFallecidos.obtenerArchivosPorConvenioSeleccionado")
            var files_data_send="";
            if (this.listConvenios.length>0){
                for(var i=0;i<this.listConvenios.length;i++){
                    if(this.listConvenios[i].selected==true){
                        for(var j=0;j<this.archivos.length;j++) {
                            if (this.archivos[j].convenio == this.listConvenios[i].convenio) {
                                files_data_send=files_data_send+this.archivos[j].files_data+";";
                            }
                        }
                    }
                }
                files_data_send = files_data_send.substring(0, files_data_send.length - 1);
            }
            return files_data_send;
        };
        this.obtenerConvenioDelArchivo=function(pFileName){
            console.log("AgendaFallecidos.obtenerConvenioDelArchivo",pFileName)
            return pFileName
                .substring(pFileName.indexOf("_")+1, pFileName.length)
                .substring(0, pFileName.indexOf("_")-1);
        };
        this.obtenerConveniosCarpeta_aperturaCuenta=function(){
            console.log("AgendaFallecidos.obtenerConveniosCarpeta_aperturaCuenta")
            // De los convenios que exiten en la tabla apertura cuentas de la base de datos, busca si exiten los archivos en la carpeta del proceso
            var convenios_existen=[];
            for(var i=0;i<this.listConvenios.length;i++){
                for(var j=0;j<this.aperturaCuentaConvenios.length;j++){
                    if(this.listConvenios[i].convenio==this.aperturaCuentaConvenios[j].convenio){
                        this.listConvenios[i].show=true;
                        convenios_existen.push(this.aperturaCuentaConvenios[j].convenio)
                    }
                }
            }
            return convenios_existen;
        };
        this.getConveniosProcesadosString=function(separador){
            console.log("AgendaFallecidos.getConveniosProcesadosString")
            var conveniosProcesados="";
            for(var i=0;i<this.listConvenios.length;i++){
                if(typeof this.aperturaCuentaConvenios[i]!='undefined'){
                    conveniosProcesados=conveniosProcesados+this.aperturaCuentaConvenios[i].convenio+separador;
                }
            }
            conveniosProcesados = conveniosProcesados.substring(0, conveniosProcesados.length - 1);
            return conveniosProcesados;
        };

        // --------------
        this.showErrorToast = function(type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
                hideDelay: 3000,
                position: 'top left'
            });
        };
        this.showToastSuccess = function(msg) {
            var template="";
            if(typeof msg!='undefined'){
                template='<md-toast class="md-toast toastSuccess">'+msg+'</md-toast>';
            }else{
                template='<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>'
            }
            $mdToast.show({
                template: template,
                hideDelay: 3000,
                position: 'top left'
            });

        };
        this.showFallecidos = function (event) {
            console.log("Confirmar: this.showFallecidos")
            var _this=this;
            $http({
                method: 'GET',
                url: '/api/fallecidos/obtenerPeriodo/',
                data:{}
            }).then(function successCallback(response) {
                if(response.data.length==0){
                    _this.showErrorToast('Error',"No se encontro el periodo de fallecidos.")
                    return;
                }
                var periodos=response.data;
                console.log("this.showFallecidos -> periodos",periodos)
                $mdDialog.show({
                    controller: 'agenda.fallecidosPeriodos.ctrl',
                    templateUrl: 'app.views/agenda/fallecidosPeriodos.html',
                    parent: angular.element(document.body),
                    locals: {
                        archivos: _this.files_data,
                        periodos: periodos
                    },
                    clickOutsideToClose:true
                }).then(function (res) {
                    console.log("res",res);
                    _this.runConfirm()
                }).catch(function () {
                   //  _this.cancel(param, param2, param3);
                });
            }, function(response) {
                if(response.status==500){
                    if(response.data.STATUS=="ERROR"){
                        _this.showErrorToast('Error',response.data.message)
                        return;
                    }
                }
            });

        };
        this.showMulticheck = function (event) {
            // -------------------------------------------------
            //  Para Fallecidos no se utiliza 2017-06-28
            // -------------------------------------------------
            console.log("Confirmar: this.showMulticheck")
            $mdDialog.show({
                controller: 'agenda.elegirArchivos.ctrl',
                templateUrl: 'app.views/agenda/multicheck.html',
                parent: angular.element(document.body),
                locals: {
                    archivos: param3
                },
                clickOutsideToClose:true
            }).then(function (res) {
              //   ok(param, param2, res.map(function (it) { return it.nombreArchivo }).join(';') + ';');
            }).catch(function () {
                cancel(param, param2, param3);
            });

        };
        this.runConfirm=function() {
            console.log("AgendaFallecidos.runConfirm")
            var _this=this;
            var idProceso=this.proceso.idProceso;
            var vProcesoDependienteEstado= $resource('/api/procesos/estadoProcesoDependiente/'+idProceso);
            vProcesoDependienteEstado.query({}, function(res){
                if(res[0].estado.toUpperCase()=='ERROR' ){
                    _this.showErrorToast('Error',res[0].message );
                    return;
                }
                console.log("runConfirm",res)
                if(res.length>0){
                    if(res[0].estado!='OK' && res[0].idProceso!=0 && res[0].nombreProcesoDepende!=null){
                        var reConfirm = $mdDialog.confirm()
                            .title('¿Desea ejecutar  "'+res[0].proceso+'" pese a que "'+ res[0].nombreProcesoDepende +'" no ha sido ejecutado?' )
                            // .textContent(_this.files)
                            .ariaLabel('Lucky day')
                            .targetEvent(this.event)
                            .ok('Aceptar')
                            .cancel('Cancelar');
                        $mdDialog.show(reConfirm).then(function(){
                            _this.runProcessManual()
                        },function(){
                            console.log("Se cancelo la ejecucion")
                        });
                        /*
                        _this.reConfirm.titulo='¿Desea ejecutar  "'+res[0].proceso+'" pese a que "'+ res[0].nombreProcesoDepende +'" no ha sido ejecutado?';
                        _this.reConfirm.text='';
                        _this.reConfirm.param(param,1,param3);
                        _this.reConfirm.show(event);
                        */
                    }else{
                        _this.runProcessManual(0,_this.files_data);
                    }
                }else{
                    // runProcess(param); ????
                }

            },function(error){
                _this.showErrorToast('Error',error.data.message );
            });
        };
        this.runProcessManual = function(validarDependencia,archivos) {
            var _this=this;
            this.proceso.username = user.name;
            this.proceso.validarDependencia = validarDependencia;
            this.proceso.archivos = archivos;
            var iProceso = new ProcesosRun(this.proceso);
            iProceso.$save(function(pepe) {
                _this.proceso.running = false;
                if(pepe.STATUS=='ERROR' ) {
                    _this.showErrorToast('Error',pepe.message);
                    return;
                }else{
                    _this.showToastSuccess ('El proceso ha comenzado a ejecutarse.')
                    _this.refresh();
                     timer = setTimeout( _this.refresh , 10000);
                }
            },function(p){
                _this.proceso.running = false;
                _this.showErrorToast('Error',p.data.message);
            });
        };
         this.refresh=function (){
             $route.reload();
        };

        this.stopTimer=function(){
            clearTimeout(timer);
        };


        this.runMarcarDatos=function () {
            var _this=this;
            var _runProcessWithFile= _this.runProcessWithFile;
            var traerConveniosAperturaCuentas = function () {
                var esRegen = _this.proceso.descripcion === Global.regenArchivos ? 1 : 0;
                return $resource('/api/convenios/conveniosAperturaCuentas/' + esRegen).query().$promise;
            };

            var guardarSistemasEnProcesoParams = function (sistemas) {
                var param = {
                    nombreProceso: _this.proceso.descripcion,
                    agrupar: 1,
                    paramNombre: 'sistemas',
                    paramValor: sistemas.join(',')
                };
                return $resource('/api/procesos/procesoParamInsertar/').save(param)
            };

            var mostrarConveniosAperturaCuentas = function (convenios) {
                if (convenios.length === 0) {
                    if (_this.proceso.descripcion === Global.marcarDatos) {
                        throw new Error('No se encontraron convenios para marcar');
                    } else {
                        throw new Error('No se encontraron archivos para reprocesar');
                    }
                }

                return $mdDialog.show({
                    controller: 'agenda.conveniosMarcarDatos.ctrl',
                    templateUrl: 'app.views/agenda/multicheck.html',
                    parent: angular.element(document.body),
                    locals: {
                        convenios: convenios,
                        proceso: _this.proceso.descripcion
                    },
                    clickOutsideToClose:true
                });
            };

            var correrProcesoConArchivo = function () {
                if (_this.proceso.descripcion === Global.marcarDatos) {
                    // _runProcessWithFile(); // _this.proceso, index
                    _this.ObtenerArchivos();
                } else {
                    _this.runProcessManual();
                }
            };

            var mostrarErrorConvenios = function (err) {
                if (err) {
                    _this.showErrorToast('Error',err.message);
                }
                _this.proceso.running = false;
            };

            traerConveniosAperturaCuentas()
                .then(mostrarConveniosAperturaCuentas)
                .then(guardarSistemasEnProcesoParams)
                .then(correrProcesoConArchivo)
                .catch(mostrarErrorConvenios);
        }
    }
    return { ArchivosAgenda: ArchivosAgenda}
})();



var PFallecidos= (function () {
    function Fallecidos($resource,$http,$mdDialog,$mdEditDialog,$mdToast, $scope,Global,Fallecidos,$q,ProcesosRun,$route,$filter) {
        var _this=this;
        this.archivos='undefined';
        this.proceso='undefined';
        this.index='undefined';
        this.confirm='undefined';
        this.agendas=[];
        /// funcion para ejecutar las agendas

        var vAgendaPorProceso= $resource('/api/agenda/traerPorProceso/');
        var vProcesoArchivos= $resource('/api/procesos/procesosTraerArchivos/');
        var vAperturaCuentaConvenios= $resource('/api/aperturaCuentas/convenioTraer');
        var vAgendaManual= $resource('/api/agendaManual/' + user.idPerfil, {});
        const vFallecidosContabilidad = $resource('/api/fallecidos/Contabilidad/',null, {  method: 'POST', isArray: true });

        var agenda_funcionalidad=new AgendaFallecidos.ArchivosAgenda($scope,$mdToast,$mdDialog,$http,$resource,ProcesosRun,Global,$route);
            agenda_funcionalidad.vProcesoArchivos=vProcesoArchivos;
            agenda_funcionalidad.vAperturaCuentaConvenios=vAperturaCuentaConvenios;

         vAgendaManual.query({}, function(res){
             var searchText = "Fallecidos".toLowerCase();
             console.log("res",res)
             var lectura_dataEntry2;
             angular.forEach(res, function(item) {
                 if( item.descripcion.toLowerCase().indexOf(searchText) >= 0 && item.descripcion!='Fallecidos - Lectura Cobis'
                 ){
                     _this.agendas.push(item);
                     if(item.descripcion.toLowerCase()=="Fallecidos - Lectura DataEntry".toLowerCase() ){
                         item.tooltip="Leer DataEntry resultado A Recuperar"
                         item.order=1;
                     }
                     if(item.descripcion.toLowerCase()=="Fallecidos - Reprocesar".toLowerCase() ){
                         item.tooltip="Reprocesar y Generar DataEntry estado Error"
                         item.order=2;
                     }
                     if(item.descripcion.toLowerCase()=="Fallecidos - Lectura DatEntry2".toLowerCase() ){
                         item.tooltip=" Lectura de nuevo DataEntry"
                         item.order=3;
                     }
                     if(item.descripcion.toLowerCase()=="Fallecidos - Generar Reversa".toLowerCase() ){
                         item.tooltip="Generar archivo Reversa"
                         item.order=4;
                     }

                     if(item.descripcion.toLowerCase()=="Fallecidos - DEntry A Analizar".toLowerCase() ){
                         item.tooltip="Generar Archivo DataEntry A Analizar"
                         item.order=5;
                     }
                 }
             });
            });

        function getEstadoAgenda(proceso) {
            console.log("getEstadoAgenda");
            return vAgendaPorProceso.query({ idAgenda: proceso.idAgenda, idProceso: proceso.idProceso }).$promise;
        }

        this.runProcess = function(agenda, event)
        {
            // INICIO EJECUCION AGENDA
            console.log("this.runProcess (INICIO EJECUCION AGENDA)")
            var _this=this;
            var proceso = agenda;
            proceso.running = true;
            agenda_funcionalidad.proceso=proceso;
            getEstadoAgenda(proceso).then(function (res) {
                if (res[0].estado === "En Curso") {
                    _this.showErrorToast('Error','El proceso se encuentra ejecutando. Aguarde un momento' );
                    return;
                }
                if (proceso.descripcion === Global.marcarDatos || proceso.descripcion === Global.regenArchivos) {
                    agenda_funcionalidad.runMarcarDatos(proceso, index);
                    return;
                }
                if (proceso.tieneArchivo > 0) {
                    agenda_funcionalidad.proceso=proceso;

                    agenda_funcionalidad.ObtenerArchivos(vProcesoArchivos,vAperturaCuentaConvenios);
                    return;
                }
                agenda_funcionalidad.runConfirm(0);
            });
        };

        function generarRobot(idProceso, idContabilidadEnc) {
            let vApi = new vFallecidosContabilidad({idProceso: idProceso, usuario: Global.currentUser.name, idContabilidadEnc: idContabilidadEnc});
            vApi.$save((result) => {
                showToastSuccess(result.data,6000)
            }, (err) => {
                if(typeof  err.data.message!=='undefined'){
                    _this.showErrorToast("Error",err.data.message);
                }else{
                    _this.showErrorToast("Error",err.statusText);
                }

            });
        }

        this.iniciarProcesoGenerarTxt = function () {
            if ($scope.fallecidosGrilla.data.length > 0) {
                let idProceso = $scope.fallecidosGrilla.data[0].idProceso;

                vFallecidosContabilidad.get({idProceso: idProceso}, result => {
                    const idContabilidadEnc = result.idContabilidadEnc;
                    if (!idContabilidadEnc || idContabilidadEnc == 0)
                        generarRobot(idProceso, idContabilidadEnc);
                    else
                        this.showConfirm(this,'La contabilidad del presente proceso ya se ha realizado. ¿Desea generarla nuevamente?', null,()=>{generarRobot(idProceso, idContabilidadEnc)});
                })
            } else {
                this.showErrorToast('Error','No hay datos para generar');
            }
        };
/*
        this.updateAgenda = function(proceso) {
            proceso.updating = true;
            this.getEstadoAgenda(proceso).then(function(res, d){
                proceso.estado = res[0].estado;
                proceso.periodo = res[0].periodo;
                proceso.fecInicioCorrida = res[0].fecInicioCorrida;
                proceso.vencimiento = res[0].vencimiento;
                proceso.updating = false;
            });
        };
*/

        /*Funciones de fallecidos*/
        this.editarDisponibleCuenta=function(ev,data,field){
            console.log($scope.estadosDataEntry);

            this.dataRow=data;
            var originalValue = data[field.name];
            var templateDisponibleCuenta='<input name="input" ng-required="true" ng-model="model.value" md-autofocus type="number" placeholder="disponible en cuenta por" min="1" max="2000000"></input>';

            var templateDataEntry= '<md-select  placeholder="" ng-required="true" id="input" name="input" ng-model="model.value" aria-label="true"> '
                +' <md-option ' +
                '   ng-init="model.value=model.estados_data_entry[0]" ' +
                '   ng-if="estadoDY.estado!=model.hide" ng-repeat="estadoDY in model.estados_data_entry" ng-value="estadoDY.value">{{estadoDY.estado}}</md-option>'
                +'</md-select>';

            var template="";
             if(field.name =="estadoDataEntry"){
                 data["originalValue"]=data[field.name];
                 template=templateDataEntry;
             }

             if(field.name =="disponibleCuenta"){
                template=templateDisponibleCuenta;
             }

            var _this=this;
            _this.editField({
                event: event,
                data: data,
                messages:[{required:"gola ***"}],
                initialValue: {estados_data_entry:$scope.estadosDataEntryEdit, hide:"Error", value:data[field.name],type:field.type,fieldName:field.name},
                msg: 'reemplazar por',
                callback: function (input) {
                    console.log("input",this.initialValue);

                    if(field.name!="estadoDataEntry"){
                        data[field.name] = input.$modelValue;
                    }else{
                        data[this.initialValue.fieldName]=this.initialValue.value;
                    }

                },
                onError: function () {
                    data[field.name] = originalValue;
                },
                controlTemplate: template
            });
        };
        this.editField=function(param){
            var _this=this;
            param.event.stopPropagation();
            var promise = $mdEditDialog.large({
                modelValue: param.initialValue,
                placeholder: 'Ingresar ' + param.msg,
                save: function (input) {
                    if (param.callback) {
                        param.callback(input);
                    }
                    param.data.modificadoPor = Global.currentUser.name;

                    if(typeof param.initialValue.value=='undefined'){
                        _this.showErrorToast("Error","No se ha seleccionado un valor.")
                        return;
                    }

                    if(typeof param.initialValue.value==''){
                        _this.showErrorToast("Error","No se ha ingresado un valor.")
                        return;
                    }

                    // Validacion del estado DataEntry
                    if(param.initialValue.fieldName=="estadoDataEntry"){
                        console.log("param.initialValue.value",param.initialValue.value)
                        if(param.initialValue.value.toUpperCase()!='OK' && param.initialValue.value.toUpperCase()!=""){
                            _this.dataRow[param.initialValue.fieldName]=_this.dataRow["originalValue"]
                            _this.showErrorToast("Error","El valor solo se puede actualizar al estado OK");
                            return;
                        }
                        _this.updateField(param.data, param.onError);
                    }else{
                          if(isNaN(parseFloat(param.initialValue.value)) && isFinite(param.initialValue.value)){
                              _this.showErrorToast("Error","El valor ingresado no es un numero valido.");
                              return;
                          }
                        _this.updateField(param.data, param.onError);
                    }


                },
                targetEvent: param.event,
                title: 'Modificar ' + param.msg,
                controlTemplate: param.controlTemplate,
                validators: {
                    'ng-required': true
                }
            });

            promise.then(function (ctrl) {

                 var input = ctrl.getInput();
               // var input = ctrl.editDialog();

                console.log("ctrl",input.input )
                console.log("ctrl",input.form)

                input.$viewChangeListeners.push(function () {
                    console.log(input.$modelValue ,input)
                     input.$setValidity('test', input.$modelValue !== 'test');
                });
            });
        };
        this.updateField=function (data, onError){

            var _this=this;
            var deferred = $q.defer();
            $scope.promise = deferred.promise;

            Fallecidos.update({ idFallecidos: data.idFallecidos },data, function (res) {
                    deferred.resolve();
                    _this.showToastSuccess ();
                   // getData();
                },
                function (err) {
                    if (onError) {
                        onError();
                    }
                    deferred.resolve();
                    _this.showErrorToast('error', err.data.message);
            });
        };
        this.changeFechaDesde = function (){
            // fecDesde -> primer dia del mes
            // fecHasta -> ultimo dia del mes
            var month   = $scope.calendario.fecDesde.getMonth();
            var year    = $scope.calendario.fecDesde.getFullYear();
            var fecDesde= new Date(
                $scope.calendario.fecDesde.getFullYear(),
                $scope.calendario.fecDesde.getMonth(),
                1
            );
            $scope.calendario.fecHasta = moment(fecDesde).endOf('month').toDate();
            $scope.calendario.fecDesde=fecDesde;
        };
        this.changeFechaHasta = function (){
            var month   = $scope.calendario.fecHasta.getMonth();
            var year    = $scope.calendario.fecHasta.getFullYear();
            var fecHasta = moment([year, month]).endOf('month').toDate();
            $scope.calendario.fecHasta=fecHasta;

        };
        this.showErrorToast = function(type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '#toastSelect',
                position: 'top left'
            });
        };
        this.showToastSuccess = function(msg, delay) {
            $mdToast.show({
                template: '<md-toast class="md-toast toastSuccess">' +  (msg || 'La operación se realizó correctamente.') + '</md-toast>',
                hideDelay: typeof delay!='undefined'? delay:4000,
                parent: '#toastSelect',
                position: 'top left'
            });
        };
        this.addHorasPopUp = function(sendScope){
            var fecDesde= new Date(sendScope.fecDesde);
            var fecHasta = new Date(sendScope.fecHasta);
            fecHasta.setHours(fecHasta.getHours() + 4);
            fecDesde.setHours(fecDesde.getHours() + 4);
            sendScope.fecHasta= fecHasta;
            sendScope.fecDesde = fecDesde;
        };
        this.showVal = function(value, filter) {
            if (filter == 'date') {
                return moment(value).utc().format('DD/MM/YYYY')
            }
            if (filter == 'number') {
                return $filter('number')(value, 2);
            }
            if (filter == 'coef') {
                return $filter('number')(value, 4);
            }
            return value;
        };
        this.showConfirm = function(ev, textContent, title, handler) {
            var confirm = $mdDialog.confirm()
                .title(title || 'Confirmación')
                .textContent(textContent)
                .ariaLabel('Confirmación')
                .targetEvent(ev)
                .ok('Confirmar')
                .cancel('Cancelar');

            $mdDialog.show(confirm).then(function() {
                handler();
            }, function() {

            });
        };

        function showToastSuccess(msg,delay){
            $mdToast.show({
                template: '<md-toast class="md-toast toastSuccess">' +  (msg || 'La operación se realizó correctamente.') + '</md-toast>',
                hideDelay: typeof delay!='undefined' ? delay: 4000 ,
                parent: '#toastSelect',
                position: 'top left'
            });
        }
    }
    return { Fallecidos: Fallecidos}
})()




/*
    <md-edit-dialog><div layout="column" class="md-content"><div ng-if="size === 'large'" class="md-title">{{title || 'Edit'}}</div><form name="editDialog" layout="column" ng-submit="submit(model)"><md-input-container md-no-float>TEMPLATE<div ng-messages="editDialog.input.$error"> <div ng-repeat="(key, message) in messages" ng-message="{{key}}">{{message}}</div></div></md-input-container></form></div><md-dialog-actions layout="row" layout-align="end"><a href="javascript:void(0)" class="md-button md-ink-ripple" ng-click="dismiss()">Cancelar</a><md-button type="button" class="md-raised md-primary md-button md-ink-ripple" ng-click="submit()"><span>Aceptar</span></md-button></md-dialog-actions></md-edit-dialog>
    */