var GRILLA_CONCILIACIONES_SIN_AGRUPAR= [
    { name: 'Cuenta',show: true,  field: 'cuenta',filter:"", align: 'left'},
    { name: 'Descripción',show: true,  field: 'descripcion',filter:"", tip: '', align:'left'},
    { name: 'Digitador',show: true,  field: 'digitador',filter:"", tip: '', align:'left'},
    { name: 'Agrupador',show: true,  field: 'agrupamiento',filter:"", tip: '', align:'left'}
];

var GRILLA_AGRUPAMIENTOS= [
    { name: 'Descripcion',show: true,  field: 'descripcion',filter:"", tip: '', align:'left'},
];

app.controller('asignarAgrupador.ctrl',
    function ($scope,$http,Toast,$resource,$filter,$mdEditDialog,Global, $q,$mdDialog,$route) {
        var fAgrupador =new AsignarAgrupadorControl(Global,Toast,$scope,$http,$mdDialog,$route);
        $scope.config=fAgrupador;

        $scope.toolbar={titulo:"Asignar Agrupador",
            form:"",
            show_asignar:true,
            asignar:function(){
                var conciliaciones= fAgrupador.getConciliacionesSelected();
                if(typeof conciliaciones=='undefined' || conciliaciones.length<=0  ){
                    Toast.showError("Seleccionar al menos un registros de conciliaciones.",'Error');
                    return;
                }
                fAgrupador.openAddForm();
            }
        };



        $scope.cancel=function(){
            $scope.agrupamientos.data={};
        };

        $scope.grillaConciliaciones=new Componentes.Grilla($http,$filter,Toast);
        $scope.grillaConciliaciones.config.url="/api/conciliaciones/sinAgrupar";
        $scope.grillaConciliaciones.config.columns=GRILLA_CONCILIACIONES_SIN_AGRUPAR;
        $scope.grillaConciliaciones.data=[];
        $scope.grillaConciliaciones.config.dataFootTable=0;
        $scope.grillaConciliaciones.config.hideComboPagina=true;
        $scope.grillaConciliaciones.config.orderByBD=true;
        $scope.grillaConciliaciones.HttpGetFromDB();


        $scope.agrupamientos=new Componentes.Grilla($http,$filter,Toast);
        $scope.agrupamientos.config.url="/api/AgrupamientosConciliaciones/paginado";
        $scope.agrupamientos.config.columns=GRILLA_AGRUPAMIENTOS;
        $scope.agrupamientos.data=[];
        $scope.agrupamientos.config.query.nombreProceso='Conci. Financiacion Resultado';
        $scope.agrupamientos.config.query.order = 'descripcion';

        $scope.agrupamientos.config.dataFootTable=0;
        $scope.agrupamientos.config.hideComboPagina=true;
        $scope.agrupamientos.config.orderByBD=true;


    });





var AsignarAgrupadorControl=function(Global,Toast,$scope,$http,$mdDialog,$route){
    var _this=this;
    $scope.titulo="Asignar agrupador";
    this.openAddForm=function(){
        this.submit=this.insert;
        $scope.motivosRechazo={};
        _this.dialogShow();
    };

    this.dialogShow=function(){
        $mdDialog.show({
            clickOutsideToClose: true,
            controller: _this.modalController,
            controllerAs: 'ctrl',
            focusOnOpen: false,
            targetEvent: event,
            locals: {
                ParentScope: $scope
            },
            templateUrl: 'app.views/AsignarAgrupador/popUp.html'
        }).then(function () {});
    };

    this.modalController=function ($scope, $mdDialog,ParentScope) {
        $scope.ParentScope = ParentScope;
        $scope.hide = function() {
            $scope.cancel();
            $mdDialog.hide();
        };
        $scope.cancel = function() {
            _this.resetFilter();
            $mdDialog.cancel();
        };
        $scope.answer = function(answer) {
            $mdDialog.hide(answer);
        };
    };
    this.resetFilter=function(){
        $scope.agrupamientos.config.query.descripcion="";
        $scope.agrupamientos.data={};
    };



    this.selectCheckbox=function(index, row){
        $scope.motivoRechazos.selected=[];
        for(var i=0;i<$scope.motivoRechazos.data.length;i++){
            if($scope.motivoRechazos.data[i].idMotivoRechazos!=row.idMotivoRechazos){
                $scope.motivoRechazos.data[i].selected=false;
            }
        }
        if(row.selected==true){
            $scope.motivoRechazos.selected.push(row);
            $scope.motivosRechazo=row;
        }
    };

    this.traerAgrupamiento=function(form){
        // if (form.$valid) {}
        $scope.agrupamientos.HttpGetFromDB();
    };
    this.getConciliacionesSelected=function(){
        return  _.filter($scope.grillaConciliaciones.data, function(value){
            return value.selected==true;
        });
    };
    this.getAgrupamientosSelected=function(){
        return  _.filter($scope.agrupamientos.data, function(value){
            return value.selected==true;
        });
    };

    this.insert=function(form,data){
        var conciliaciones= _this.getConciliacionesSelected();
        var agrupamientos= _this.getAgrupamientosSelected();

        var strConciliaciones=_.pluck(conciliaciones, 'idConciliacion').toString();
        var strAgrupamientos=_.pluck(agrupamientos, 'idAgrupamiento').toString();



        if(typeof agrupamientos=='undefined' || agrupamientos.length<=0  ){
            Toast.showError("Seleccionar un agrupamiento.",'Error');
            return;
        }
        if (form.$valid) {
            $http({
                method: 'POST',
                url: '/api/conciliaciones/sinAgrupar' ,
                data: {
                    conciliaciones: strConciliaciones,
                    idAgrupamiento: strAgrupamientos,
                    usuario:Global.currentUser.name
                },
                headers: {'Content-Type': 'application/json;charset=utf-8'}
            }).then(function (res) {
                Toast.showSuccess();

                conciliaciones.forEach(function(item, index, arr){
                    if(item.agrupamiento=="" || typeof  item.agrupamiento=='undefined'){
                        item.agrupamiento=agrupamientos[0].descripcion;
                    }
                });
                $scope.grillaConciliaciones.data.forEach(function(item, index, arr){
                    item.selected=false;
                });

                // $route.reload();
                $scope.agrupamientos.config.query.descripcion="";
                $scope.agrupamientos.data={};

                $mdDialog.hide();
            }).catch(function (err) {
                Toast.showError(err.data.message);
            });

        }else{

            Toast.showError("Formulario no valido.",'Error');
        }
    };

    this.ok=function(res){
        _this.showToastSuccess();
        _this.getData();
        $mdDialog.hide();
    };
    this.error=function(err){
        // console.log("err",err)
    };
    this.submit=function(){
        // console.log("Submit")
    };
};
