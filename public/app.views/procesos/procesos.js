app.filter('getUserById', function() {
    return function(input, id) {
        var i=0, len=input.length;
        for (; i<len; i++) {
            if (+input[i].idUsuario == +id) {
                return input[i];
            }
        }
        return null;
    }
});
app.filter('getProcesoById', function() {
    return function(input, id) {
        var i=0, len=input;
        for (; i<len; i++) {
            if (+input[i].idProceso== +id) {
                return input[i];
            }
        }
        return null;
    }
});

app.filter('filterYesNo',function() {
    return function(input) {
        if (input == true) {
            return 'Si';
        }else{
            return 'No';
        }
    }
});

// $filter('getProcesoPaso')(array, dato)
app.filter('getProcesoPaso', function() {
    return function(input, id) {
        var i=0, len=input.length;
        for (; i<len; i++) {
            if (+input[i].paso== +id) {
                return input[i];
            }
        }
        return null;
    }
});

app.filter('mapProcesoVisible', function() {
    return function(input) {
        if (input==null)
            return "";
        if (input==true)
            return "Si";
        if (input==false)
            return "No"
    };
});


var Pasos = function ($scope,$mdDialog,$mdMedia,$filter,$resource,ProcesosPaso) {
    $scope.tipoProcesoPaso= [
        {tipo:"SERV",descripcion:"Servicio"},
        {tipo:"PROC",descripcion:"Proc"},
        {tipo:"JOB",descripcion:"Job"},
        {tipo:"",descripcion:""}];

    $scope.metodos= [
        {metodo: 'GET'},
        {metodo:'POST'}];
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1) ;
    $scope.currentDate = currentDate;

    var gridDoorPaso;

    this.setGridDoorPaso=function(data){
        gridDoorPaso=data;
    }
    this.borrar=function(close,ev){
        $scope.paso.usuario=user.name;
        console.log("Baja Paso");
        var iProcesoPaso= new ProcesosPaso($scope.paso);

        iProcesoPaso.$delete({idProcesoPaso: $scope.paso.idProcesoPaso},function(p){
            if(p.result=="error"){
                $scope.showErrorToastProcesos('error', p.message);
            }else{
                $scope.showToastProcesosSuccess();
                $scope.procesoPasoGrilla.selected = [];
                $scope.procesoPasoGrilla.selected.length = 0;
                $scope.paso=null;
            }
            $scope.rowPaso={};
            $scope.paso=null;
            close('useful');
        },function(error){
            $scope.showErrorToastProcesos('error', error.data.message);
        });


    }

    this.guardarPaso=function(close){
        if ($scope.proceso.idProceso==null){
            $scope.showErrorToastProcesos('error',"No ha seleccionado un proceso");
        }
        $scope.paso.usuario=user.name;

        var iProcesoPaso= new ProcesosPaso($scope.paso);
        if($scope.pasoOperacion=='ALTA'){
            console.log("ALTA 1");
            var pasoFilter= $filter('getProcesoPaso')($scope.procesoPasoGrilla.data, $scope.paso.paso);
            if(pasoFilter!=null){
                $scope.showErrorToastProcesos('error',"El paso "+$scope.paso.paso +" para el proceso seleccionado ya existe.")
                return 0;
            }
            iProcesoPaso.$save(function(p, res) {
                if(p.result=="error"){
                    $scope.showErrorToastProcesos('error', p.message);
                }
                gridDoorPaso().getData();
                $scope.showToastProcesosSuccess();
                close('useful');
            },function(error){
                $scope.showErrorToastProcesos('error', error.data.message);
            });
        }

        if($scope.pasoOperacion=='MODIFICACION'){
            iProcesoPaso.$update(function(p){
                if(p.result=="error"){
                    $scope.showErrorToastProcesos('error', p.message);
                }
                $scope.showToastProcesosSuccess();
                $scope.rowPaso=null;
                $scope.paso=null;
                $scope.selectedPaso=null;
                close("Cerrar");
            },function(error){
                $scope.showErrorToastProcesos('error', error.data.message);
            });
        }
    };

    this.editarPaso=function(ev,operacion){
        if(typeof $scope.proceso== 'undefined' || $scope.proceso== null){
            $scope.showErrorToastProcesos('error', 'Debe seleccionar un proceso.');
            return;
        }

        $scope.pasoOperacion = operacion;
        if (operacion == "ALTA") {

            $scope.frmProcesosPasos.titulo = "Alta de pasos";
            $scope.rowPaso = null;
            $scope.paso = {};
            $scope.paso.idProceso = $scope.selected.idProceso;
            if($scope.selected.fecBaja != null){
                $scope.showErrorToastProcesos('error', 'No puede crear un paso si el proceso se encuentra dado de baja.');
                return;
            }
        }

        if (operacion == "BAJA") {
            $scope.paso = angular.copy($scope.selectedPaso);
            if(typeof $scope.paso=='undefined' || $scope.paso.idProcesoPaso== null ){
                $scope.showErrorToastProcesos('error', 'Debe seleccionar un paso.');
                return;
            }
            $scope.paso.disabled = true;
            $scope.frmProcesosPasos.titulo = "Baja de pasos";
        }


        if (operacion == "MODIFICACION") {

            if($scope.selectedPaso== null){
                $scope.showErrorToastProcesos('error', 'Debe seleccionar un paso.');
                return;
            }
            $scope.paso = angular.copy($scope.selectedPaso);
            $scope.paso.disabled = true;
            $scope.frmProcesosPasos.titulo = "Modificacion de pasos";

            if(typeof $scope.paso.idProcesoPaso == 'undefined'){
                $scope.showErrorToastProcesos('error', 'Debe seleccionar un paso.');
                return;
            }
        }

        var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
        $mdDialog.show({
            controller: ProcesoPasosController,
            templateUrl: 'ProcesosPasos.html',
            targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: useFullScreen,
            locals: {
                ParentScope: $scope
            }
        }).then(function (answer) {
            // gridDoorPaso().getData();
        }, function () {
        });
        $scope.$watch(function () {
            return $mdMedia('xs') || $mdMedia('sm');
        }, function (wantsFullScreen) {
            $scope.customFullscreen = (wantsFullScreen === true);
        });


    };

    function ProcesoPasosController($scope, $mdDialog,ParentScope) {
        $scope.ParentScope = ParentScope;
        $scope.hide = function() {
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    }

};

app.controller('procesos.ctrl', [ '$scope', '$filter','$resource','$http', '$timeout','$mdDialog', '$mdMedia', '$mdSelect', '$mdToast',
                                  '$document', 'Global', 'datacontext','Procesos','ProcesosPaso', 'AgendaProceso', 
    function ($scope, $filter,$resource,$http, $timeout,$mdDialog, $mdMedia, $mdSelect, $mdToast, $document, Global,
              datacontext,Procesos,ProcesosPaso, AgendaProceso) {

        $scope.fdProceso = frontDoor();      //frontDoor :: funciones de acción
        $scope.selected = null;
        $scope.todosProcesos =[];
        $scope.isDisabledPaso = true;
        $scope.gdProceso = gridDoor();       //gridDoor :: funciones de la grilla
        $scope.procesosAll = [];
        $scope.allPasos = [];

        $scope.procesoGrilla = {
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

        $scope.fdPaso = frontDoorPaso();      //frontDoor :: funciones de acción
        $scope.selectedPaso = null;
        $scope.gdPaso = gridDoorPaso();       //gridDoor :: funciones de la grilla

        $scope.allPaso = [];
        var vUsuarios= $resource('/usuarios/traerResponsables');
        var vProcesos= $resource('/api/procesos/procesosTraerTodos');
        var vProcesosReactivar= $resource('/api/procesos/reactivar');

        $scope.procesoPasoGrilla = {
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


        $scope.filtrarProcesosGrilla=function(newVal){
            if ($scope.todosProcesos.length > 0 && newVal.toString() != '') {
                if($scope.procesoGrilla.query.page !== 1){
                    $scope.procesoGrilla.query.page = 1;
                }
                $scope.procesoGrilla.data = $filter('filter')($scope.todosProcesos, newVal);
                $scope.procesoGrilla.count = $scope.procesoGrilla.data.length;
            }else{
                $scope.procesoGrilla.data = $scope.todosProcesos;
                $scope.procesoGrilla.count = $scope.procesoGrilla.data.length;
            }
            console.log("procesoGrilla.selected",$scope.procesoGrilla.selected);
        };



        $scope.$watch('procesoGrilla.query.filter',$scope.filtrarProcesosGrilla );


        $scope.$watch('procesoPasoGrilla.query.filter', function (newVal) {
            if ($scope.allPasos.length > 0 && newVal.toString() != '') {
                $scope.procesoPasoGrilla.data = $filter('filter')($scope.allPasos, newVal);
                $scope.procesoPasoGrilla.count = $scope.procesoPasoGrilla.data.length;
            }else{
                $scope.procesoPasoGrilla.data = $scope.allPasos;
                $scope.procesoPasoGrilla.count = $scope.procesoPasoGrilla.data.length;
            }
        });

        $scope.flagAccionExito=false;
        $scope.flagAccionFracaso=false;
        $scope.$watch('proceso.accionExito', function (newVal) {
            if($scope.flagAccionExito==true){
                if($scope.proceso!=null){
                    $scope.proceso.parametroExito='';
                    $scope.proceso.parametroExitoTexto='';
                    $scope.proceso.parametroExito_ira='';
                    $scope.accionExitoSearchText='';
                    $scope.accionExitoSelectedItem=null;
                }
            }
            $scope.flagAccionExito=true;
            // console.log("Proceso flagAccionExito",$scope.proceso,$scope.flagAccionExito);
        });


        $scope.$watch('proceso.accionFracaso', function (newVal) {
            if($scope.flagAccionFracaso==true){
                if($scope.proceso!=null){
                    $scope.proceso.parametroFracaso='';
                    $scope.proceso.parametroFracasoTexto='';
                    $scope.proceso.parametroFracaso_reintento='';
                    $scope.accionFracasoSearchText='';
                    $scope.accionFracasoSelectedItem=null;
                }
            }
            $scope.flagAccionFracaso=true;

        });
/*
        $scope.$watch('proceso.accionFracaso',function(){
            console.log("TEST 0101",$scope.proceso.accionFracaso);
        } );
      */



        function frontDoor(){
            return {
                ddd: function (text) {
                    alert('mal! ' + text  );
                },
                adddd: function (event) {
                    alert('! ' + event.name  );
                },

            };
        }

        function gridDoor() {

            var gridDoor = {
                getData: getData,
                onPaginate: onPaginate,
                loadStuff: loadStuff,
                onReorder: onReorder,
                removeFilter: removeFilter

            };

            return gridDoor;

            function onPaginate(page, limit) {
                // console.log("onPaginate",page,$scope.procesoGrilla.selected);

                if($scope.procesoGrilla.selected.length>0){
                    console.log("selectCheckbox",$scope.procesoGrilla.selected[0].index,$("#" + $scope.procesoGrilla.selected[0].index));
                  //  $scope.selectCheckbox($scope.procesoGrilla.selected[0].index,$scope.procesoGrilla.selected[0])
                }

                //$scope.$broadcast('md.table.deselect');
                //getData(angular.extend({}, $scope.query, {page: page, limit: limit}));
                //$scope.promise = $timeout(function () {
                //
                //}, 2000);
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

            function getData(v) {
                console.log("GetData",$scope.procesoGrilla.selected);
                vUsuarios.query({},function(res) {
					console.log("res,error",res)
					$scope.usuariosResponsables= res;
					
					
                    
                }, function(error) {
					console.log("error",error)
					if(error.status==500) {
					    $scope.showErrorToastProcesos('error',error.data.message);
                    }
				});
                vProcesos.query({dadosBaja:v},function(resc) {
                    $scope.procesoGrilla.data = resc;
                    $scope.todosProcesos = resc;

                    $scope.procesoGrilla.count = resc.length;
                    console.log("GetData",$scope.proceso,$scope.procesoGrilla.query.filter);
                    $scope.filtrarProcesosGrilla($scope.procesoGrilla.query.filter);
                });


            }

            function removeFilter() {
                $scope.procesoGrilla.filter.show = false;
                $scope.procesoGrilla.query.filter = '';
                if(typeof $scope.procesoGrilla.filter.form!='undefined'){
                    if ($scope.procesoGrilla.filter.form.$dirty) {
                        $scope.procesoGrilla.filter.form.$setPristine();
                    }
                }
            }
        }

        function frontDoorPaso(){
            return {
                ddd: function (text) {
                    alert('fuuuuuuck! ' + text  );
                },
                adddd: function (event) {
                    alert('fuuuuuuck! ' + event.name  );
                },

            };
        }


        function gridDoorPaso() {

            var gridDoorPaso = {
                getData: getData,
                onPaginate: onPaginate,
                deselect: deselect,
                log: log,
                loadStuff: loadStuff,
                onReorder: onReorder,
                removeFilter: removeFilter

            };

            return gridDoorPaso;

            function onPaginate(page, limit) {
                // $scope.$broadcast('md.table.deselect');
                getData(angular.extend({}, $scope.query, {page: page, limit: limit}));
                //$scope.promise = $timeout(function () {
                //
                //}, 2000);
            }

            function deselect(index, item) {
                $scope.selectedPaso = item;
            }

            function log(item) {
                $scope.selectedPaso = item;
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



            function getData() {
                    $scope.flagAccionExito=false;
                    $scope.flagAccionFracaso=false;
                    $scope.operacion = '';
                    // $scope.proceso = angular.copy($scope.selected);
                    $scope.proceso = $scope.selected;
                    console.log("1. Onclick Item GetData",$scope.proceso.fecBaja );

                    if ($scope.proceso.fecBaja != null) {
                        $scope.proceso.fecBaja = new Date($scope.proceso.fecBaja);
                        $scope.procesoReactivar=false;
                    }else{
                        $scope.procesoReactivar=true;
                    }

                    if ($scope.proceso.fecInicio != null) {
                        $scope.proceso.fecInicio =new Date($scope.proceso.fecInicio);
                    }

                    console.log("1. Onclick Item GetData",$scope.proceso.fecBaja );
                    // EDIT_PRO

                    $scope.paso = {};
                    $scope.paso.usuario = user.name;

                    $scope.paso.idProceso = $scope.proceso.idProceso;

                   $scope.proceso.parametroExito = parseInt($scope.selected.parametroExito);
                   $scope.proceso.parametroFracaso = parseInt($scope.selected.parametroFracaso);


                    //mod
                    // console.log("$scope.proceso.usuarioResponsable",$scope.proceso.usuarioResponsable);
                    $scope.usuarioResponsableSelectedItem= $scope.usuarioResponsableQuerySearch(String($scope.proceso.usuarioResponsable))[0];
                    $scope.usuarioResponsableItem=$scope.usuarioResponsableQuerySearch(String($scope.proceso.usuarioResponsable))[0];

             //       console.log("+++ usuarioResponsableSelectedItem-usuarioResponsableItem +++",$scope.usuarioResponsableSelectedItem,$scope.usuarioResponsableItem);
                    $scope.accionExitoSelectedItem = $filter('getUserById')($scope.usuariosResponsables, String($scope.proceso.parametroExito));
                    $scope.accionFracasoSelectedItem = $filter('getUserById')($scope.usuariosResponsables, String($scope.proceso.parametroFracaso));
                    //$scope.dependeSelectedItem=$filter('getUserById')($scope.gridOptions.data, 1);
                    $scope.dependeSelectedItem = $filter('getProcesoById')($scope.todosProcesos, $scope.proceso.depende);

					console.log("$scope.selected",$scope.selected)
					console.log("$scope.selected",$scope.selected.idProceso)
					var ppp=$scope.selected.idProceso;
					console.log("$scope.selected",ppp)
					console.log("$scope.selected",'/api/procesosPaso/' + $scope.selected.idProceso)
					
                    var vProcesos = $resource('/api/procesosPaso/' + $scope.selected.idProceso);
                     vProcesos.query({}, function (res) {
                        $scope.procesoPasoGrilla.data = res;
                         $scope.procesoPasoGrilla.count = res.length;
                        $scope.allPasos = res;
                    });

            }

            function removeFilter() {
                $scope.procesoGrilla.filter.show = false;
                $scope.procesoGrilla.query.filter = '';
                if ($scope.procesoGrilla.filter.form.$dirty) {
                    $scope.procesoGrilla.filter.form.$setPristine();
                }
            }
        }
        // Procesos
        $scope.selectCheckbox= function(index, row){
            for(var i=0;i<$scope.procesoGrilla.data.length;i++){
                if(row.nombre!=$scope.procesoGrilla.data[i].nombre){
                    $scope.procesoGrilla.data[i].selected=false;
                }
                /*if(i!=index){
                    $scope.procesoGrilla.data[i].selected=false;
                }*/
            }

           if(!row.selected){
                /*
                $scope.proceso=null;
                $scope.selectedPaso = null;
                $scope.procesoPasoGrilla.data = [];
                $scope.procesoGrilla.selected.length=0;
                $scope.isDisabledPaso = true;
               */
               $scope.resetProcesoItem();

               $scope.selected = row;
               $scope.procesoGrilla.selected.push(row);
                gridDoorPaso().getData();
               console.log($scope.selected);
            }else{
               $scope.resetProcesoItem();
               /*
               $scope.proceso=null;
               $scope.selectedPaso = null;
               $scope.procesoPasoGrilla.data = [];
               $scope.procesoGrilla.selected.length=0;
               $scope.isDisabledPaso = true;

               $scope.selected = null;
               */
            }


        };
        $scope.resetProcesoItem=function(){
            $scope.selected = null;
            $scope.proceso=null;
            $scope.selectedPaso = null;
            $scope.procesoPasoGrilla.data = [];
            $scope.procesoGrilla.selected.length=0;
            $scope.isDisabledPaso = true;
        }
        //paso

        $scope.selectCheckboxPaso= function(index, row){
            $('#grillaPaso md-checkbox').not($("#paso"+ index + "")).removeClass('md-checked');
            if( !($('#paso'+ index + '').hasClass("md-checked")))
            {
                $scope.promise = $timeout(function () {
                    $("#paso" + index + "").addClass("md-checked");
                    $scope.selectedPaso = row;
                    $scope.procesoPasoGrilla.selected.length=0;
                    $scope.procesoPasoGrilla.selected = [];
                    $scope.procesoPasoGrilla.selected.push(row);
                    console.log($scope.selectedPaso ,  row);
                }, 100);
            }else{
                $scope.selectedPaso = null;
                $scope.procesoPasoGrilla.selected.length=0;
                $scope.procesoPasoGrilla.selected = [];
                $('#grillaPaso md-checkbox').removeClass('md-checked');
            }
        };

        if(user==null){
            window.location.href = '/signin';
        }

        $scope.frmProcesos={};
        $scope.frmProcesos.titulo="";
        $scope.frmProcesosPasos={};
        $scope.frmProcesosPasos.titulo="";
        $scope.today=new Date();
        $scope.fecBajaMinDate = new Date(
            $scope.today.getFullYear(),
            $scope.today.getMonth(),
            $scope.today.getDate());

        $scope.showHints = false;

        $scope.operacion='ALTA';
        $scope.procesoTemp=null;
        $scope.proceso=null;
        $scope.paso={};
        $scope.filtro={};
        $scope.isDisabled = true;
        $scope.filtro.procesos=false;
        $scope.filtro.paso=false;
        $scope.c=new Pasos($scope,$mdDialog, $mdMedia,$filter,$resource,ProcesosPaso)

        $scope.savePaso= function(close,ev) {
            console.log("$scope.savePaso",event);
            console.log("paso.tipoProceso",$scope.paso);
            if($scope.paso.tipoProceso==null  ||  $scope.paso.tipoProceso==''){
                var x = document.getElementById("ProcesoPasoTipo");
                x.className = "ng-dirty ng-pristine ng-empty ng-invalid ng-invalid-required ng-touched";
                console.log("paso.tipoProceso",x);
                return;
            }


            if($scope.pasoOperacion=='ALTA'){

                $scope.c.setGridDoorPaso(gridDoorPaso)
                $scope.c.guardarPaso(close);
                /*console.log("res ALTA",res);
                if(res!=0){
                    gridDoorPaso().getData();
                }
                */
            }
            if($scope.pasoOperacion=='MODIFICACION'){
                $scope.c.guardarPaso(close);
                gridDoorPaso().getData();
            }

            if($scope.pasoOperacion=='BAJA'){
              //  showToastConfirm($event,"Hola que tal?");
                var confirm = $mdDialog.confirm()
                    .title("" + "Eliminar paso"  +" . ¿Desea continuar?")
                    .textContent('')
                    .ariaLabel('Lucky day')
                    .targetEvent(ev)
                    .ok('Si')
                    .cancel('No');
                $mdDialog.show(confirm).then(function() {
                    $scope.c.borrar(close);
                    gridDoorPaso().getData();
                }, function() {
                    // $scope.showAdvanced([], 'BAJA');
                    $scope.c.editarPaso(ev,'BAJA');
                    // CANCELAR
                });


            }
        };


        $scope.tipoProceso= [{tipo:"M",descripcion:"Manual"},{tipo:"A",descripcion:"Automático"},{tipo: undefined ,descripcion:""}]
        $scope.frecuencia= [{tipo:"",descripcion:"Seleccionar"},{tipo:"C",descripcion:"Calendario de corrida"}
            ,{tipo:"M",descripcion:"Mensual"},{tipo:"S",descripcion:"Semanal"},{tipo:"D",descripcion:"Diario"}
        ];
        $scope.accionExito= [{tipo:null, descripcion:null} ,{tipo:"AVISO",descripcion:"Aviso"},{tipo:"IR_A",descripcion:"Ir a"}]


        $scope.accionFracaso= [{tipo:null, descripcion:null}, {tipo:"AVISO",descripcion:"Aviso"},{tipo:"REINTENTO",descripcion:"Reintento"}]
        $scope.marca= [{tipo:"MC",descripcion:"Mastercard"},{tipo:"AX",descripcion:"American Express"}
            ,{tipo:"VI",descripcion:"Visa"}, { tipo: 'VIAX', descripcion: 'Visa y AmericanExpress' }]

        $scope.usuariosResponsables={};


        $scope.showDadosBaja=false;
        $scope.traerProcesos=function(v){
            console.log("$scope.traerProcesos",$scope.traerProcesos,v);
            if(v == false)
            {
                $scope.isDisabled = true;
                $scope.proceso=null;
            }else{
                $scope.isDisabled = false;
            }
            gridDoor().getData(v);
        };

        gridDoor().getData(false);

        // ---- Filter ----
        $scope.dependeSelectedItem  = null;
        $scope.dependeTextSearch    = null;
        $scope.querySearch=function  (query) {
            var results = query ? $scope.todosProcesos.filter( $scope.createFilterFor(query) ) : [];
            return results;
        }
        $scope.createFilterFor=function (query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(proceso) {
                return (proceso.nombre.toLocaleLowerCase().indexOf(lowercaseQuery) == 0);
            };
        }
        // --- Fracaso aviso ---
        // Determinar los usuarios a enviar aviso

        $scope.accionFracasoSelectedItem  = null;
        $scope.accionFracasoSearchText = null;
        $scope.accionFracasoQuerySearch=function  (query) {
            var results = query ? $scope.usuariosResponsables.filter( $scope.accionFracasoCreateFilterFor(query) ) : [];
            return results;
        }

        $scope.accionFracasoCreateFilterFor=function (query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(proceso) {
                return (proceso.nombre.toLocaleLowerCase().indexOf(lowercaseQuery) == 0);
            };
        }
        // --- Exito aviso ---
        // Determinar los usuarios a enviar aviso

        $scope.accionExitoSelectedItem  = {nombre: null};
        $scope.accionExitoSearchText    = null;
        $scope.accionExitoQuerySearch=function  (query) {
            var results = query ? $scope.usuariosResponsables.filter( $scope.usuarioResponsableFilter(query) ) : [];
            return results;
        }

        $scope.usuarioResponsableFilter=function (query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(user) {
                return (user.nombre.toLocaleLowerCase().indexOf(lowercaseQuery) == 0);
            };
        }

        // -- Vencimientos --

        $scope.usuarioResponsableSelectedItem  = null;
        $scope.usuarioResponsableSearchText    = "";
        $scope.usuarioResponsableQuerySearch=function  (query) {
            var results = query ? $scope.usuariosResponsables.filter( $scope.usuarioResponsableFilter(query) ) : $scope.usuariosResponsables;
            return results;
        }


        // accionExitoCreateFilterFor --> usuarioResponsableFilter


        // -------------------------------------------------------------------------

        $scope.reactivarProcesoConfirm = function(ev) {
            if ($scope.proceso==null){
                $scope.checkProcesoSeleccionado();
                return;
            }

            var confirm = $mdDialog.confirm()
                .title("Este proceso y todos sus pasos relacionados se reactivarán. ¿Desea continuar?")
                .textContent('')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Si')
                .cancel('No');
            $mdDialog.show(confirm).then(function() {

                vProcesosReactivar.query({idProceso: $scope.proceso.idProceso, idUsuario: user.idUsuario},function(res) {
                    $scope.showToastProcesosSuccess();
                    $scope.proceso.fecBaja=null;
                    //gridDoor().getData($scope.showDadosBaja);
                    close('useful');
                },function(error){
                    $scope.showErrorToastProcesos('error', error.data.message);
                });
            }, function() {
                // CANCELAR
               // $scope.procesoReactivar=false;

            });
        };

        $scope.showToastProcesosSuccess = function () {
            $mdToast.show({
                template: '<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>',
                hideDelay: 3000,
                parent: '#toastSelect',
                position: 'top left'
            });
        };

        $scope.showErrorToastProcesos = function (type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type + '">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };

        $scope.bajaProceso = function(){
            var currentDate = new Date();
            currentDate.setHours(3);
            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs')) && $scope.customFullscreen;
            var vProcesosAgenda = $resource('/api/procesos/agenda/' + $scope.proceso.idProceso);
            var procesoSeleccionado = $scope.proceso;
            $scope.logCount = vProcesosAgenda.query({}, function () {
                if($scope.logCount[0]==null ||  typeof $scope.logCount[0]=='undefined'){
                    return;
                }
                if ($scope.logCount[0].contador != 0) {
                    var popUpAgenda = $mdDialog;
                    popUpAgenda.show({
                        controller: DialogControllerConfirmarAgenda,
                        templateUrl: 'confirmarAgendaBaja.html',
                        clickOutsideToClose: false,
                        fullscreen: useFullScreen,
                        locals: {
                            ParentScope: $scope,
                            countAgendas: $scope.logCount[0].contador
                        }
                    }).then(function (answer) {
                        $scope.proceso = procesoSeleccionado;
                        //mod
                        // $scope.usuarioResponsableSelectedItem = $filter('getUserById')($scope.usuariosResponsables, $scope.proceso.usuarioResponsable);
                        $scope.usuarioResponsableSelectedItem= $scope.usuarioResponsableQuerySearch(String($scope.proceso.usuarioResponsable))[0];
                        console.log("$scope.usuarioResponsableSelectedItem",$scope.usuarioResponsableSelectedItem);
                        if (answer == 'SI') {
                            $scope.bajaFunction();
                            AgendaProceso.delete({
                                idProceso: $scope.proceso.idProceso,
                                fecBaja: $scope.today,
                                usuario: user.name
                            }, function (e, res) {
                                $scope.showToastProcesosSuccess();
                                $scope.proceso.usuarioResponsable=$scope.usuarioResponsableSearchText;
                                gridDoor().getData();
                                $scope.procesoGrilla.selected = [];
                                $scope.selected = null;
                                close('useful');
                            }, function (error) {
                                $scope.showErrorToastProcesos('error', error.data.message);
                            });
                        } else {
                            $scope.accionExitoSelectedItem.nombre = $scope.proceso.parametroExitoTexto;
                            $scope.accionFracasoSelectedItem.nombre = $scope.proceso.parametroFracasoTexto;
                            $scope.showAdvanced([], 'BAJA');
                        }

                    }, function () {
                    });
                    $scope.$watch(function () {
                        return $mdMedia('xs') || $mdMedia('sm');
                    }, function (wantsFullScreen) {
                        $scope.customFullscreen = (wantsFullScreen === true);
                    });
                } else {
                    $scope.bajaFunction();
                }
            });

        }



        $scope.onKeyUp=function($event){
            $scope.onKeyPressResult = window.event ? $event.keyCode : $event.which;
            var digit=parseInt(String.fromCharCode($scope.onKeyPressResult));
            if(isNaN(digit)){
                $event.stopImmediatePropagation();
                $event.preventDefault();
            }
        }

        $scope.showToastConfirm = function (ev, msg) {
            var confirm = $mdDialog.confirm()
                .title("" + msg  +" . ¿Desea continuar?")
                .textContent('')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Si')
                .cancel('No');
            $mdDialog.show(confirm).then(function() {
                $scope.bajaProceso();
            }, function() {
                $scope.showAdvanced([], 'BAJA');
            });

        };

        $scope.confirmBajaPaso= function (ev, msg) {
            var confirm = $mdDialog.confirm()
                .title("" + msg  +" . ¿Desea continuar?")
                .textContent('')
                .ariaLabel('Lucky day')
                .targetEvent(ev)
                .ok('Si')
                .cancel('No');
            $mdDialog.show(confirm).then(function() {
                $scope.bajaProceso();
            }, function() {
                $scope.showAdvanced([], 'BAJA');
            });
        };

        $scope.enviarProcesoServer= function(iProceso,close,ev){
            // console.log("7. proceso.visible",$scope.proceso.visible);
            if ($scope.operacion=="ALTA"){
                iProceso.$save(function(p) {
                    console.log("*** *** *** ", p ," - ", p.STATUS);

                    if(p.STATUS!='ERROR') {
                       if(p.name== "RequestError"){
                            $scope.showErrorToastProcesos('error',p.message);
                            $scope.showFormAlta(ev,$scope.proceso );
                            return;
                        }
                        $scope.proceso.usuarioResponsable=$scope.usuarioResponsableSearchText;
                        gridDoor().getData();
                        $scope.showToastProcesosSuccess();


                        close('useful');
                    }else{
                        $scope.showErrorToastProcesos('error',p.message);
                    }
                },function(error){
                    $scope.showErrorToastProcesos('error',error.data.message);
                });
            }
            if ($scope.operacion=="MODIFICACION"){
                iProceso.$update(function(p) {
                    if (p.class == 14)
                    {
                        $scope.showErrorToastProcesos('error', p.message);
                    }
                    gridDoor().getData();
                    $scope.proceso.selected = false;
                    $scope.procesoGrilla.selected = [];
                    $scope.selected = null;
                    $scope.proceso.usuarioResponsable=$scope.usuarioResponsableSearchText;
                    $scope.showToastProcesosSuccess();
                    close('useful');
                },function(error){
                    $scope.showErrorToastProcesos(error.data.message);
                });
            }
        }


        $scope.saveProceso= function(close,ev) {
            console.log("1. tipo, proceso.",$scope.proceso.tipo,$scope.proceso);
            if(typeof $scope.proceso.tipo=='undefined'){
                var x = document.getElementById("ProcesoTipo");
                    x.className = "ng-dirty ng-pristine ng-empty ng-invalid ng-invalid-required ng-touched";
                return;
            }

            if($scope.proceso.tipo == 'M' && $scope.proceso.accionFracaso=="REINTENTO")
            {
                $scope.showErrorToastProcesos('error', "Si el proceso es Manual, no puede seleccionarse Reintento");
                return;
            }

            if($scope.proceso.tipo == 'A' && $scope.proceso.frecuencia == null)
            {
                $scope.showErrorToastProcesos('error', "La frecuencia no puede estar vacía si el proceso es Automático.");
                return;
            }




            // validar vencimiento
            if ($scope.proceso.vencimiento!='' && $scope.proceso.vencimiento>0){
                if ($scope.usuarioResponsableSelectedItem==null){
                    $scope.showErrorToastProcesos('error', "El valor de usuario responsable no es valido.");
                    return;
                }
                  $scope.proceso.usuarioResponsable=$scope.usuarioResponsableSelectedItem.idUsuario;
                    console.log("SAVE proceso.usuarioResponsable",$scope.proceso.usuarioResponsable);
            }else{
                $scope.proceso.usuarioResponsable=0;
            }

            // Validar parametro exito
            if($scope.proceso.accionExito=='AVISO'){
                if ($scope.accionExitoSelectedItem==null){
                    $scope.showErrorToastProcesos('error', "El parametro exito no es valido.");
                    return;
                }
                $scope.proceso.parametroExito=$scope.accionExitoSelectedItem.idUsuario;
            }else{
               // $scope.proceso.parametroExito='';
                if($scope.proceso.accionExito=='IR_A'){
                    $scope.proceso.parametroExito=$scope.proceso.parametroExito_ira;
                    $scope.proceso.parametroExitoTexto=$scope.proceso.parametroExito_ira.toString();
                }else{
                    $scope.proceso.parametroExito='';
                    $scope.proceso.parametroExitoTexto=$scope.proceso.parametroExito;
                }
            }



            // Validar parametro Fracaso
            if($scope.proceso.accionFracaso=='AVISO'){
                if ($scope.accionFracasoSelectedItem==null){
                    $scope.showErrorToastProcesos('error', "El parametro fracaso no es valido.");
                    return;
                }
                $scope.proceso.parametroFracaso=$scope.accionFracasoSelectedItem.idUsuario;
            }

            if($scope.proceso.accionFracaso=='REINTENTO'){
                $scope.proceso.parametroFracaso=$scope.proceso.parametroFracaso_reintento;
                $scope.proceso.parametroFracasoTexto=$scope.proceso.parametroFracaso_reintento.toString();
            }



            if ($scope.dependeSelectedItem== null){
                $scope.proceso.depende=0;
            }else{
                $scope.proceso.depende=$scope.dependeSelectedItem.idProceso;
            }

            $scope.proceso.usuario=user.name;
            $scope.proceso.idUsuario = user.idUsuario;
            if($scope.proceso.visible == null || typeof $scope.proceso.visible == 'undefined')
            {
                $scope.proceso.visible = false;
            }

            console.log("UPDATE $scope.proceso",$scope.proceso);
          //  $scope.procesoToSave = angular.copy($scope.proceso);
          //  $scope.procesoToSave.usuarioResponsable=$scope.usuarioResponsableSelectedItem.idUsuario;
            //console.log("proceso",$scope.procesoToSave);

            console.log("usuarioResponsableSelectedItem",$scope.usuarioResponsableSelectedItem);
            console.log("usuarioResponsableItem",$scope.usuarioResponsableItem );
            console.log("usuarioResponsableSearchText",$scope.usuarioResponsableSearchText );


            //return;
            $scope.procesoToSave = angular.copy($scope.proceso);
            if($scope.proceso.fecInicio!=null){
                var jdate=$scope.proceso.fecInicio.toJSON().toString();
                $scope.procesoToSave.fecInicio=jdate.substr(0, jdate.indexOf("T"))+'T00:00:00.000Z';
            }

            var iProceso= new Procesos($scope.procesoToSave );

            if($scope.proceso.descripcion==null){
                $scope.proceso.descripcion="";
            }



            if($scope.operacion=='MODIFICACION'){


                if($scope.proceso.accionExito == 'IR_A' && $scope.proceso.parametroExito != null )
                {
                    console.log("$scope.procesoPasoGrilla.data",$scope.procesoPasoGrilla.data)
                    var pso=$filter('getProcesoPaso')( $scope.procesoPasoGrilla.data,$scope.proceso.parametroExito)
                    console.log("pso",pso);
                    if(pso==null){
                        var confirm = $mdDialog.confirm()
                            .title("" + "El paso derivado en Acción Éxito no existe."  +" . ¿Desea continuar?")
                            .textContent('')
                            .ariaLabel('Lucky day')
                            .targetEvent(ev)
                            .ok('Si')
                            .cancel('No');
                        $mdDialog.show(confirm).then(function() {
                            if(typeof $scope.errors.valid == 'undefined'){
                                $scope.enviarProcesoServer(iProceso,close,ev);
                            }else{
                                $scope.showErrorToastProcesos('error','La fecha de inicio no es válida.');
                            }
                        }, function() {
                            $scope.showFormAlta(ev,$scope.proceso );
                        });
                    }else{
                        $scope.enviarProcesoServer(iProceso,close,ev);
                    }
                }else{
                    $scope.enviarProcesoServer(iProceso,close,ev);
                }
            }

            if($scope.operacion=='ALTA'){
                if($scope.proceso.accionExito == 'IR_A' && $scope.proceso.parametroExito != null )
                {
                    var confirm = $mdDialog.confirm()
                        .title("" + "El paso derivado en Acción Éxito no existe."  +" . ¿Desea continuar?")
                        .textContent('')
                        .ariaLabel('Lucky day')
                        .targetEvent(ev)
                        .ok('Si')
                        .cancel('No');
                    $mdDialog.show(confirm).then(function() {
                        if(typeof $scope.errors.valid == 'undefined'){
                            $scope.enviarProcesoServer(iProceso,close,ev);
                        }else{
                            $scope.showErrorToastProcesos('error','La fecha de inicio no es válida.');
                        }

                    }, function() {
                        $scope.showFormAlta(ev,$scope.proceso );
                    });
                }else{
                    $scope.enviarProcesoServer(iProceso,close,ev);
                }
            }

            if($scope.operacion=='BAJA'){
                if(typeof $scope.errors.mindate != 'undefined') {
                    $scope.showErrorToastProcesos('error','La fecha de baja no puede ser menor a la fecha actual.');
                    return;
                }

                if(typeof $scope.errors.valid == 'undefined') {
                        var timeout = 0;
                        if ($scope.proceso.dependeNombre != null) {
                            $scope.showToastConfirm([], 'Este proceso depende del proceso "' + $scope.proceso.dependeNombre + '" que sigue activo.');
                        } else if ($scope.dependeSelectedItem != null) {
                            $scope.showToastConfirm([], 'Este proceso depende del proceso "' + $scope.dependeSelectedItem.nombre + '" que sigue activo.');
                        } else {
                            $scope.bajaProceso();
                        }
                }else{
                    $scope.showErrorToastProcesos('error','La fecha de baja no es válida.');
                }
            }
        };

        $scope.usuarioResponsableSearchTextChange   =function (text) {
            console.log("usuarioResponsableSearchTextChange",text);
        }

        $scope.usuarioResponsableSelectedItemChange = function (item) {
            if (typeof item!='undefined'){
                $scope.proceso.usuarioResponsable=item.idUsuario;
                console.log("usuarioResponsableSelectedItemChange",JSON.stringify(item));
                console.log("$scope.proceso",$scope.proceso);
            }else{
                $scope.usuarioResponsableSearchText="";
                console.log("usuarioResponsableSelectedItemChange",item);
            }
        }



        $scope.setError = function(errors){
            $scope.errors = errors;
        }

        $scope.bajaFunction = function(){
            console.log("1. proceso.fecBaja ",$scope.today,$scope.proceso.fecBaja );
            if ($scope.today==null || $scope.today=='undefined'){
                $scope.showErrorToastProcesos('error','Ingresar fecha de baja.');
                return;
            }

            var date=moment($scope.today).format('YYYY/MM/DD');
            $scope.proceso.fecBaja = date;

            Procesos.delete({
                idProceso: $scope.proceso.idProceso,
                id: $scope.proceso.idProceso,
                fecBaja:date  ,
                usuario: user.name
            },
            {},
            function (e, res) {

                if ($scope.showDadosBaja != true) {
                    $scope.resetProcesosValue();
                }

                if (!e.error) {
                    $mdDialog.hide();
                    $scope.showToastProcesosSuccess();
                    $scope.procesoReactivar=($scope.proceso.fecBaja==null);
                    if($scope.showDadosBaja!=true){
                        gridDoor().getData($scope.showDadosBaja);

                        $scope.resetProcesoItem();
                        $scope.procesoPasoGrilla.data = [];
                    }


                    close('useful');
                } else {
                    $scope.showErrorToastProcesos('error',"Error");
                }
            }, function (error) {
                console.log("error.data",error);
                $scope.showErrorToastProcesos('error',error.data.message);
            });
        };

        $scope.checkProcesoSeleccionado=function(p){
            $scope.showErrorToastProcesos('error','Seleccionar un proceso.');
        };




        $scope.showAdvanced = function(ev,operacion) {
            console.log("ACEPTAR",user);
            
            console.log("PRoceso",$scope.proceso)
            $scope.operacion=operacion;

            if(operacion == 'ALTA'){
                $scope.frmProcesos.titulo="Alta de procesos";
                $scope.resetProcesosValue();
                $scope.resetProcesosValueMod();
                $scope.proceso={};
              //  $scope.proceso.idUsuario=user.idUsuario; -- MOD 1804
                $scope.proceso.descripcion="";
                $scope.proceso.visible=true;
            }

            if(operacion=='MODIFICACION'){
                $scope.proceso = $scope.selected; // MOD15 angular.copy();
                // $scope.usuarioResponsableSelectedItem.nombre = $scope.proceso.usuarioResponsable;
                if ($scope.proceso.idProceso==null){
                    $scope.checkProcesoSeleccionado();
                    return 0;
                }
                $scope.frmProcesos.titulo="Modificacion de procesos";

            }

            if(operacion=='REACTIVAR'){
                $scope.proceso = $scope.selected;//angular.copy();
                if ($scope.proceso.idProceso==null){
                    $scope.checkProcesoSeleccionado();
                    return 0;
                }else{
                    if ($scope.proceso.fecBaja==null){
                        alert("Para reactivar el proceso primero debe darlo de baja.");
                        return 0;
                    }
                    $scope.frmProcesos.titulo="Reactivacion de procesos";

                }
            }
            console.log("OPERACION ",operacion);
            if(operacion=='BAJA'){
                $scope.today = new Date();
                $scope.proceso = $scope.selected;//angular.copy();
                if ($scope.proceso.idProceso==null){
                    $scope.checkProcesoSeleccionado();
                    return 0;
                }
                $scope.frmProcesos.titulo="Baja de procesos";
            }
            $scope.showFormAlta(ev,$scope.proceso );
        };


        $scope.showFormAlta=function(ev,p){

            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;
            $mdDialog.show({
                controller: DialogControllerProcesos,
                templateUrl: 'ProcesosAlta.html',
                //   parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:false,
                fullscreen: useFullScreen,
                locals: {
                    ParentScope: $scope
                }
            })
                .then(function(answer) {
                    if(answer == 'useful') {
                      //  $scope.resetProcesosValue();
                      //  gridDoor().getData($scope.showDadosBaja);

                    }
                }, function() {
                    // $scope.resetProcesosValue();
                    console.log("Cancel operation",$scope.operation);
                });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });
        }

        $scope.showFrmBajaProceso= function(ev) {
            if($scope.proceso==null){
                $scope.showErrorToastProcesos('error', "Seleccionar un proceso.");
                return;
            }
            $scope.proceso.fecBaja = new Date();
            $scope.today = new Date();


            var useFullScreen = ($mdMedia('sm') || $mdMedia('xs'))  && $scope.customFullscreen;

            $mdDialog.show({
                controller: DialogControllerPasoBaja,
                templateUrl: 'ProcesosBaja.html',
                targetEvent: ev,
                clickOutsideToClose:false,
                fullscreen: useFullScreen,
                locals: {
                    ParentScope: $scope
                }
            })
                .then(function(answer) {
                    // $scope.status = 'You said the information was "' + answer + '".';
                }, function() {
                    // $scope.status = 'You cancelled the dialog.';
                });
            $scope.$watch(function() {
                return $mdMedia('xs') || $mdMedia('sm');
            }, function(wantsFullScreen) {
                $scope.customFullscreen = (wantsFullScreen === true);
            });

        };
        // -------------------------------------------------------------------------

        $scope.rowPaso=null;

        $scope.row=null;

        $scope.resetProcesosValue=function(){
            $scope.usuarioResponsableSelectedItem=null;
            $scope.usuarioResponsableItem=null;
            $scope.usuarioResponsableSearchText="";
           


        }
        $scope.resetProcesosValueMod=function(){

            console.log("RESET proceso");
            $scope.proceso=null;
            $scope.selected=null;
            $scope.procesoGrilla.selected.length=0;
            $scope.procesoPasoGrilla.data=null;
            $scope.procesoPaso=null;
            //$scope.procesoTemp=null;
            $scope.paso=null;
            $scope.operacion='ALTA';

            // Usuario responsable

            $scope.usuarioResponsableSelectedItem=null;
            $scope.usuarioResponsableItem=null;
            $scope.usuarioResponsableSearchText="";


            $scope.accionFracasoSearchText=null;
            $scope.accionFracasoSelectedItem={nombre: ''};
            $scope.accionFracasoItem=null;

            $scope.accionExitoSelectedItem={nombre: ''};
            $scope.accionExitoSearchText=null;
            $scope.accionExitoItem=null;


            // Proceso depende
            $scope.dependeTextSearch="";
            $scope.dependeItem=undefined;
            $scope.dependeSelectedItem=null;

            $scope.usuarioResponsableItem=null;
            $scope.accionFracasoItem=null;
            $scope.accionFracasoSelectedItem={nombre: ''};

        }


    }]).config(function($mdThemingProvider) {
    $mdThemingProvider.theme('docs-dark', 'default')
        .primaryPalette('yellow')
        .dark();
});

function DialogControllerProcesos($scope, $mdDialog,ParentScope) {

    $scope.ParentScope = ParentScope;

    if(ParentScope.proceso.accionExito=="IR_A"){
        ParentScope.proceso.parametroExito_ira= parseInt(ParentScope.proceso.parametroExito);
    }else{
        ParentScope.proceso.parametroExito_ira=null;
    }

    if(ParentScope.proceso.accionFracaso=="REINTENTO"){
        ParentScope.proceso.parametroFracaso_reintento=parseInt(ParentScope.proceso.parametroFracaso);
    }else{
        ParentScope.proceso.parametroFracaso_reintento=null;
    }

    ParentScope.proceso.visible=ParentScope.proceso.visible;
    if($scope.ParentScope.proceso.fecInicio != null)
    {
        console.log("FECHA INICIO", $scope.ParentScope.proceso.fecInicio);


        //var temp=new Date($scope.ParentScope.proceso.fecInicio);

        //var _utc = new Date(temp.getUTCFullYear(), temp.getUTCMonth(), temp.getUTCDate()).toUTCString(); //, date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()

        $scope.ParentScope.proceso.fecInicio =new Date($scope.ParentScope.proceso.fecInicio);
        var fecInicio=$scope.ParentScope.proceso.fecInicio
        var offSet=fecInicio.getTimezoneOffset();
        // console.log("FECHA INICIO getTimezoneOffset", offSet);
        // console.log("DATE",moment(fecInicio).add(offSet/60, 'hours').toDate());

        if(offSet>0){
            console.log("DATE ADD",moment(fecInicio).add(offSet/60, 'hours').toDate());
            $scope.ParentScope.proceso.fecInicio=moment(fecInicio).add(offSet/60, 'hours').toDate()
        }

        if(offSet<0){
            console.log("DATE SUBSTRACT",moment(fecInicio).subtract(offSet/60, 'hours').toDate());
            $scope.ParentScope.proceso.fecInicio=moment(fecInicio).subtract(offSet/60, 'hours').toDate()
        }

        //var test= moment($scope.ParentScope.proceso.fecInicio ).add($scope.ParentScope.proceso.fecInicio .getTimezoneOffset()/60, 'hours').toDate();
        //console.log("**** test *******",test);
        //console.log("**** utc *******",_utc);
        console.log("**** fecInicio ******",$scope.ParentScope.proceso.fecInicio);
    }

    if($scope.ParentScope.accionFracasoSelectedItem == null) {
        $scope.ParentScope.accionFracasoSelectedItem = null;
    }

    if($scope.ParentScope.accionExitoSelectedItem == null) {
        $scope.ParentScope.accionExitoSelectedItem = null;
    }

    if($scope.ParentScope.operacion != 'ALTA'){
        //$scope.ParentScope.usuarioResponsableSelectedItem= {nombre:null};
        // $scope.ParentScope.usuarioResponsableSelectedItem.nombre = $scope.ParentScope.proceso.usuarioResponsable;
        if($scope.ParentScope.proceso.dependeNombre != null) {
            $scope.ParentScope.dependeSelectedItem = {nombre: null};
            $scope.ParentScope.dependeSelectedItem.nombre = $scope.ParentScope.proceso.dependeNombre;
        }

            $scope.ParentScope.proceso.parametroExito = parseInt($scope.ParentScope.proceso.parametroExito);

            $scope.ParentScope.proceso.parametroFracaso = parseInt($scope.ParentScope.proceso.parametroFracaso);
    }else{
        $scope.ParentScope.proceso.parametroExito = null;
        $scope.ParentScope.accionExitoSelectedItem = null;
        $scope.ParentScope.accionFracasoSelectedItem = null
        $scope.ParentScope.proceso.parametroFracaso = null;
    }

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}



function DialogControllerConfirmarAgenda($scope, $mdDialog, ParentScope, countAgendas) {
    $scope.ParentScope = ParentScope;
    $scope.agendasAsociadas = countAgendas;

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}

function DialogControllerPasoBaja($scope, $mdDialog,ParentScope) {
    $scope.ParentScope = ParentScope;
    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };
    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
    };
}

