var CUENTA_COLUMNS=[
    {show:true,name:'idEDPDatosFijosCuentas',field:'idEDPDatosFijosCuentas', tip: ''},
    {show:true,name:'Entidad',               field:'entidad', tip: ''},
    {show:true,name:'Código Alta Cuenta',      field:'codigoAltaCuenta', tip: ''},
    {show:true,name:'Tipo de Cuenta',            field:'tipoCuenta', tip: ''},
    {show:true,name:'LC',                 field:'codLC', tip: ''},
    {show:true,name:'PorcFinanciación',      field:'porcFinanciacion', tip: ''},
    {show:true,name:'ModLiquidación',                field:'modLiq', tip: ''},
    {show:true,name:'Forma Pago',             field:'formaPago', tip: ''},
    {show:true,name:'Cartera',               field:'cartera', tip: ''},
    {show:true,name:'FPSuc',            field:'fpSucursal', tip: ''},
    {show:true,name:'FPTipoCuenta',             field:'fpTipoCta', tip: ''},
    {show:true,name:'FPNroCuenta',              field:'fpNroCta', tip: ''},
    {show:true,name:'CatCajero',   field:'catCajeroAutomatico', tip: ''},
    {show:true,name:'GAF',                   field:'gaf', tip: ''},
    {show:true,name:'Tipo IVA',               field:'tipoIva', tip: ''},
    {show:true,name:'CUIT',                  field:'cuit', tip: ''},
    {show:true,name:'CodAgrup',             field:'codAGrupo', tip: ''}
]

var TARJETAS_COLUMNS=[
    {show:true,name:'Entidad'          ,field:'entidad', tip: ''},
    {show:true,name:'Código Alta Tarjeta',field:'codigoAltaTarjeta', tip: ''},
    {show:true,name:'Tipo de Tarjeta'      ,field:'tipoTarjeta', tip: ''},
    {show:true,name:'Vigencia'         ,field:'vigencia', tip: ''},
    {show:true,name:'PorcBonificación' ,field:'porcBonificacion', tip: ''},
    {show:true,name:'TipoDocumento'    ,field:'tipoDocumento', tip: ''},
    {show:true,name:'NroDocumento'     ,field:'nroDocumento', tip: ''},
    {show:true,name:'Nacionalidad'     ,field:'nacionalidad', tip: ''},
    {show:true,name:'Sexo'             ,field:'sexo', tip: ''},
    {show:true,name:'EstadoCivil'         ,field:'estCivil', tip: ''},
    {show:true,name:'FecNacimiento'    ,field:'fecNacimiento', tip: ''},
    {show:true,name:'Ocupacion'        ,field:'ocupacion', tip: ''},
    {show:true,name:'Habilitación'     ,field:'habilitacion', tip: ''},
    {show:true,name:'Cargo'            ,field:'cargo', tip: ''},
    {show:true,name:'PorcLimLC'        ,field:'porcLimLC', tip: ''},
    {show:true,name:'PorcLimLCC'       ,field:'porcLimLCC', tip: ''},
    {show:true,name:'PorcLimADE'       ,field:'porcLimADE', tip: ''},
    {show:true,name:'Distribución'     ,field:'distribucion', tip: ''},
]




app.controller('datosFijosEDP.ctrl', function ($scope,$http,$resource,$filter,$mdDialog,Toast,Global,$mdToast,$route,DatosFijosEDPCuentas,DatosFijosEDPTarjetas) {
    $scope.novedades=[  {novedad:'Cuentas', cod:"CUENTAS" },
                        {novedad:'Tarjetas',cod:"TARJETAS"}];
    $scope.novedad=$scope.novedades[0];
    $scope.cboNovedades_onChange=function(){
        if($scope.novedad.cod=="CUENTAS"){
            $scope.grillaCuentas.HttpGet(callback_cuentas);
        }
        console.log("$scope.novedad.cod",$scope.novedad)
        if($scope.novedad.cod=="TARJETAS"){
            $scope.grillaTarjetas.HttpGet(callback_tarjetas);
        }
    }
    $scope.toolbarCuentas={titulo:"Cuentas",
        show_insert:{show:true, tooltip:"Agregar"},
        show_update:{show:false,tooltip:"Modificar"},
        show_delete:{show:false,tooltip:"Eliminar"},
        item:{},
        onChange:function(){
            console.log("Cuentas onchange");
        },
        insert:function(a){
            $scope.datosFijosEdpCtrl.openAddForm();
        },
        update:function(a){
            $scope.datosFijosEdpCtrl.openUpdateForm();
        },
        delete:function(a){
            $scope.datosFijosEdpCtrl.openDeleteForm();
        }
    };
    $scope.grillaCuentas=new Componentes.Grilla($http,$filter,Toast);
    $scope.grillaCuentas.config.url="/api/datosFijos/Cuentas";
    $scope.grillaCuentas.config.columns=CUENTA_COLUMNS;
    $scope.grillaCuentas.config.orderByBD=false;
    $scope.grillaCuentas.onAfterCheck=function(){
        console.log("TEST",$scope.grillaCuentas.selectedItem)
        $scope.model=$scope.grillaCuentas.selectedItem
        $scope.toolbarCuentas.show_update.show=(typeof $scope.grillaCuentas.selectedItem!='undefined') ?true:false;
        $scope.toolbarCuentas.show_delete.show=$scope.toolbarCuentas.show_update.show;
        $scope.toolbarCuentas.show_insert.show=!$scope.grillaCuentas.selectedItem;
    }
    function callback_cuentas(res){
        console.log("res.data -> ", res)
        $scope.grillaCuentas.data=res.data;
        $scope.grillaCuentas.config.showNoRegister=true;
    }
    $scope.toolbarTarjetas={
        titulo:"Tarjetas",
        show_insert:{show:true, tooltip:"Agregar"},
        show_update:{show:false,tooltip:"Modificar"},
        show_delete:{show:false,tooltip:"Eliminar"},
        item:{},
        onChange:function(){
            console.log("Targetas onchange");
        },
        insert:function(a){
            $scope.datosFijosEDPTarjetasCtrl.openAddForm();
        },
        update:function(a){
            $scope.datosFijosEDPTarjetasCtrl.openUpdateForm();
        },
        delete:function(a){
            $scope.datosFijosEDPTarjetasCtrl.openDeleteForm();
        }
    };
    $scope.grillaTarjetas=new Componentes.Grilla($http,$filter,Toast);
    $scope.grillaTarjetas.config.url="/api/datosFijos/Tarjetas";
    $scope.grillaTarjetas.config.columns=TARJETAS_COLUMNS;
    $scope.grillaTarjetas.config.orderByBD=false;
    $scope.grillaTarjetas.config.showNoRegister=true;
    $scope.grillaTarjetas.onAfterCheck=function(){
        $scope.modelTarjeta=$scope.grillaTarjetas.selectedItem;
        $scope.toolbarTarjetas.show_update.show=(typeof $scope.grillaTarjetas.selectedItem!='undefined') ?true:false;
        $scope.toolbarTarjetas.show_delete.show=$scope.toolbarTarjetas.show_update.show;
        $scope.toolbarTarjetas.show_insert.show=!$scope.grillaTarjetas.selectedItem;
    }
    function callback_tarjetas(res){
        $scope.grillaTarjetas.data=res.data;
        $scope.grillaTarjetas.config.showNoRegister=true;
    }
    $scope.callback_tarjetas=callback_tarjetas;
    $http({url: '/api/datosFijos/tiposCtasTarjetas',method: "GET"}).then(
        function(data){
            console.log("data",data)
            $scope.tiposCtasTarjetas=data.data;
            $scope.cboNovedades_onChange();

        },function(error){
            Toast.showError(error.data.message,'Error');
        });
    $scope.model={};
    $scope.modelTarjeta={};
    // DatosFijosEDPControl=function($scope,$resource,$filter,Global,$mdDialog)
    $scope.datosFijosEdpCtrl=new DatosFijosEDPCuentasControl($scope,$resource,$filter,Global,$mdDialog,$mdToast,$route,DatosFijosEDPCuentas);
    $scope.datosFijosEDPTarjetasCtrl=new DatosFijosEDPTarjetasControl($scope,$resource,$filter,Global,$mdDialog,$mdToast,$route,DatosFijosEDPTarjetas);

});


var DatosFijosEDPTarjetasControl=function($scope,$resource,$filter,Global,$mdDialog,$mdToast,$route,DatosFijosEDPTarjetas){
    var _this=this;
    var url="/api/datosFijos/"
    this.openUpdateForm=function(){
        $scope.operac="Modificar";
        $scope.modelTarjeta.codigoAlta=$scope.modelTarjeta.codigoAltaTarjeta;
        this.submit=this.update;
        _this.dialogShow()
    }
    this.openDeleteForm=function(){
        $scope.operac="Baja";
        $scope.modelTarjeta.codigoAlta=$scope.modelTarjeta.codigoAltaTarjeta;
        this.delete();
    }
    this.openAddForm=function(){
        $scope.operac="Alta";
        this.submit=this.insert;
        $scope.modelTarjeta={};
        $scope.modelTarjeta.codigoAlta="51";
        $scope.modelTarjeta.entidad=67;
        _this.dialogShow()
    }
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
            templateUrl: 'app.views/datosFijosEDP/addTarjetas.html'
        }).then(function () {});
    }
    this.modalController=function ($scope, $mdDialog,ParentScope) {
        $scope.ParentScope = ParentScope;
        $scope.modelTarjeta= Object.assign({},$scope.ParentScope.modelTarjeta);
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
    this.insert=function(form,data){
        if($scope.modelTarjeta.datofijocuenta_existe){
            _this.showToast("Error","El tipo de cuenta seleccionada ya existe.");
            return; // La cuenta no se puede insertar porque ya existe
        }
        if (form.$valid) {
            data.usuario= Global.currentUser.name
            DatosFijosEDPTarjetas.save(data, _this.ok,_this.error);
        }
    }
    this.update=function (form,data){
        if (form.$valid) {
            data.usuario= Global.currentUser.name
            DatosFijosEDPTarjetas.update({ idEDPDatosFijosTarjetas: data.idEDPDatosFijosTarjetas },data,_this.ok,_this.error);
        }
    }
    this.delete=function (form,data){

        var confirm = $mdDialog.confirm()
            .textContent('¿Está seguro de que desea eliminar el/los registro/s seleccionado/s?')
            .ariaLabel('Lucky day')
            .ok('Aceptar')
            .cancel('Cancelar');

        $mdDialog.show(confirm).then(function() {
            DatosFijosEDPTarjetas.delete({ idEDPDatosFijosTarjetas: $scope.modelTarjeta.idEDPDatosFijosTarjetas },{}, _this.ok,_this.error);
        }, function() {
            // Se cancela la eliminacion
        });
    }

    this.ok=function(res){
        $scope.modelTarjeta=undefined;
        $scope.grillaTarjetas.selectedItem=undefined;
        $scope.grillaTarjetas.onAfterCheck();
        _this.showToastSuccess();
        $scope.grillaTarjetas.HttpGet($scope.callback_tarjetas)
        $mdDialog.hide();
    }
    this.error=function(err){
        if(typeof err.data.message=='undefined'){
            _this.showToast("Error",err.statusText);
        }else{
            _this.showToast("Error",err.data.message);
        }
    }
    this.submit=function(){}
    this.showToastSuccess = function() {
        _this.showToast('toastSuccess','La operación se realizó correctamente.')
    };
    this.showToast = function(type, msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast ' + type +'">' + msg + '</md-toast>',
            hideDelay: 3000,
            parent: '#toastSelect',
            position: 'top left'
        });
    };

    this.validarDatosFijosTarjetas=function(model){
        if(typeof model.tipoTarjeta=='undefined'  ){
            return;
        }
        $resource(url+"validarDatosFijosTarjetas").query(model,
            function success(res) {
                model.datofijoTarjeta_existe=res.length;  // tipoCuenta_codigo
            },_this.error);
    }

    this.validarCantidadCuentas=function(model){
        model.datofijoTarjeta_existe=false;
        if(typeof model.tipoTarjeta=='undefined') {
            return;
        }
        $resource(url+"EDPCantCuentasTarjetasValidar").query(model,
            function success(res) {
                model.cantCuotasTarjetas_existe=res.length;
                if(res.length>0){
                    _this.validarDatosFijosTarjetas(model);
                }
            },_this.error);
    }
}
// ----------------------------- CUENTAS -----------------------------------
var DatosFijosEDPCuentasControl=function($scope,$resource,$filter,Global,$mdDialog,$mdToast,$route,DatosFijosEDPCuentas){
    var _this=this;
    var url="/api/datosFijos/"
    this.openUpdateForm=function(){
        $scope.operac="Modificar";
        $scope.model.codigoAlta = $scope.model.codigoAltaCuenta;
        this.submit=this.update;
        _this.dialogShow()
    }
    this.openDeleteForm=function(){
        $scope.operac="Baja";
        $scope.model.codigoAlta=$scope.model.codigoAltaCuenta;
        this.delete();

    }
    this.openAddForm=function(){
        $scope.operac="Alta";
        this.submit=this.insert;
        $scope.model={};
        $scope.model.codigoAlta="50";
        $scope.model.entidad=67;
        _this.dialogShow()
    }
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
            templateUrl: 'app.views/datosFijosEDP/addCuentas.html'
        }).then(function () {});
    }
    this.modalController=function ($scope, $mdDialog,ParentScope) {
        $scope.ParentScope = ParentScope;
        $scope.model = Object.assign({}, $scope.ParentScope.model);
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
    this.insert=function(form,data){
        if($scope.model.datofijocuenta_existe){
            _this.showToast("Error","El tipo de cuenta seleccionada ya existe.");
            return; // La cuenta no se puede insertar porque ya existe
        }
        if (form.$valid) {
            data.usuario= Global.currentUser.name
            DatosFijosEDPCuentas.save(data, _this.ok,_this.error);
        }
    }
    this.update=function (form,data){
        if (form.$valid) {
            data.usuario= Global.currentUser.name
            DatosFijosEDPCuentas.update({ idEDPDatosFijosCuentas: data.idEDPDatosFijosCuentas },data,_this.ok,_this.error);
        }
    }
    this.delete=function (form,data){
        var confirm = $mdDialog.confirm()
            .textContent('¿Está seguro de que desea eliminar el/los registro/s seleccionado/s?')
            .ariaLabel('Lucky day')
            .ok('Aceptar')
            .cancel('Cancelar');

        $mdDialog.show(confirm).then(function() {
            DatosFijosEDPCuentas.delete({ idEDPDatosFijosCuentas: $scope.model.idEDPDatosFijosCuentas },{}, _this.ok,_this.error);
        }, function() {
            // Se cancela la eliminacion
        });
    }
    /*
    this.ok=function(res){
        $route.reload();
        $mdDialog.hide();

    }
    */
    this.ok=function(res){
        $scope.model=undefined;
        $scope.grillaCuentas.selectedItem=undefined;
        $scope.grillaCuentas.onAfterCheck();
        _this.showToastSuccess();
        $scope.grillaCuentas.HttpGet($scope.callback_cuentas)
        $mdDialog.hide();
    }
    this.error=function(err){
        if(typeof err.data.message=='undefined'){
            _this.showToast("Error",err.statusText);
        }else{
            _this.showToast("Error",err.data.message);
        }
    }
    this.submit=function(){}
    this.showToastSuccess = function() {
        _this.showToast('toastSuccess','La operación se realizó correctamente.')
    };
    this.showToast = function(type, msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast ' + type +'">' + msg + '</md-toast>',
            hideDelay: 3000,
            parent: '#toastSelect',
            position: 'top left'
        });
    };
    this.validarDatosFijosCuentas=function(model){
        if(typeof model.tipoCuenta=='undefined'  ){
            return;
        }
        $resource(url+"validarDatosFijosCuentas").query(model,
            function success(res) {
                model.datofijocuenta_existe=res.length;  // tipoCuenta_codigo
            },_this.error);
    }
    this.validarCantidadCuentas=function(model){
        model.datofijocuenta_existe=false;
        if(typeof model.tipoCuenta=='undefined'  ){
            return;
        }
        $resource(url+"EDPCantCuentasTarjetasValidar").query(model,
            function success(res) {
                model.cantCuotasTarjetas_existe=res.length;
                if(res.length>0){
                    _this.validarDatosFijosCuentas(model);
                }
            },_this.error);
    }
}



