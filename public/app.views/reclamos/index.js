/*
    Pantalla principal
*/

app.factory('ReclamosVisaElectron', ['$resource', function($resource) {
    return $resource('/api/reclamos/:idReclamoElectron', null,
        {
            'update': { method:'PUT' },
            'delete': { method:'DELETE' }
        });
}]);


app.factory("ReclamosFecha", function() {
    return {
        page: null,
        grilla: null,

        date: new Date(),
        getdate:function(){

            return (moment(this.date).utc()._isValid) ? moment(this.date).local().format('YYYY/MM/DD') : this.date;
        }
    };
});

app.controller('reclamoselectron.ctrl', function($scope, $http,$window,Toast,ReclamosFecha) {
    $scope.menu=true;
    $scope.ReclamosFecha=ReclamosFecha;

    $scope.ReclamosFecha.page=null;
    $http({url: '/api/reclamos/obtenerFechaMaxima',method: "GET"}).then(
        function(data){
            var date=new Date(data.data[0][0].fecProceso.substring(0, 10));
            var dateOffSet=new Date(date.valueOf() + date.getTimezoneOffset() * 60000);
            $scope.ReclamosFecha.date=dateOffSet;
            reclamosCount();
        },function(error){
            Toast.showError(error.data.message,'Error');
        });

    var reclamosCount =function(){
        var date=moment($scope.ReclamosFecha.date).format('YYYY/MM/DD');
        $http({url: '/api/reclamos/reclamosCount?fecha='+date,method: "GET"}).then(
        function(res){
            $scope.totalReclamos= res.data[0][0].reclamos;
        },function(error){
            Toast.showError(error.data.message,'Error');
        });

    }



    $scope.showPage=function(param){
        console.log("$scope.ReclamosFecha.date",$scope.ReclamosFecha.date);
        if($scope.ReclamosFecha.date){
            $scope.page=param;
            $scope.ReclamosFecha.page=$scope.page;
            $scope.refresh();
        }else{
            var fecCarga = $window.document.getElementById('fecCarga');
            fecCarga.focus();
        }
    }

    $scope.rReclamos       ={"description":"Reclamos", "page":"RECLAMOS",order: 1};
    $scope.rResoluciones   ={"description":"Resoluciones", "page":"RESOLUCIONES",order:2};
    $scope.rAnticipaciones ={"description":"Anticipaciones", "page":"ANTICIPACIONES",order:3};
    $scope.rAcreditaciones ={"description":"Acreditaciones", "page":"ACREDITACIONES",order:4};
    $scope.rContabilidad   ={"description":"Contabilidad", "page":"CONTABILIDAD",order:5};

    $scope.reports=[
        {"description":"", "page":""},
        $scope.rReclamos,
        $scope.rResoluciones,
        $scope.rAnticipaciones,
        $scope.rContabilidad,
        $scope.rAcreditaciones
    ]

    $scope.refresh=function(valid){

        reclamosCount();
        if(typeof  $scope.ReclamosFecha.date!='undefined'){
            console.log("- REFRESH - ");
            if( $scope.ReclamosFecha.page && $scope.ReclamosFecha.page.page=="RECLAMOS"){
                $scope.ReclamosFecha.grilla.config.query.fecha=ReclamosFecha.getdate();
                $scope.ReclamosFecha.grilla.HttpGetFromDB();
                $scope.ReclamosFecha.grillaCupones.data=[];
            }
            /*if( $scope.ReclamosFecha.page && $scope.ReclamosFecha.page.page=="XXXXX"){
                $scope.XXXXFecha.grilla.config.query.fecha=ReclamosFecha.getdate();
                $scope.XXXXFecha.grilla.HttpGetFromDB();
            }*/


        }else{
            var fecCarga = $window.document.getElementById('fecCarga');
            fecCarga.focus();
        }
    }

})




/* Tomar ejemplo

    mpp/public/app.views/datosFijosEDP/datosFijosEDP.js

    Pasar parametros entre controladores

 idReclamoElectron,fecProceso,fecContable,nroReclamo,nroTarjeta,cliente,sucTarjeta,nombreSucTarjeta,nroCuenta,idMotivo,montoCompra,sucReclamo,nombreSucReclamo,observaciones,impTotal,estado,fecCreacion,creadoPor,fecModificacion,modificadoPor


*/

var RECLAMOS_COLUMNS=[
    {show:false,name:'idReclamoElectron'  , field:'idReclamoElectron', tip: ''},
    {show:false,name:'fecProceso'          , field:'fecProceso', tip: '',filter:"date"},
    {show:false,name:'fecContable'         , field:'fecContable', tip: '',filter:"date"},
    {show:true,name:'NroReclamo'          , field:'nroReclamo', tip: '',filter:"", align:"right"},
    {show:true,name:'Nro.Tarjeta'         , field:'nroTarjeta', tip: ''},
    {show:true,name:'Cliente'             , field:'cliente', tip: ''},
    {show:true,name:'Suc'                 , field:'sucTarjeta', tip: '',filter:"int"},
    {show:false,name:'nombreSucTarjeta'    , field:'nombreSucTarjeta', tip: ''},
    {show:true,name:'Nro.Cuenta'          , field:'nroCuenta', tip: ''},
    {show:false,name:'idMotivo'            , field:'idMotivo', tip: ''},
    {show:false,name:'montoCompra'         , field:'montoCompra', tip: '',filter:"number"},
    {show:false,name:'sucReclamo'          , field:'sucReclamo', tip: ''},
    {show:false,name:'nombreSucReclamo'    , field:'nombreSucReclamo', tip: ''},
    {show:false,name:'observaciones'       , field:'observaciones', tip: ''},
    {show:true,name:'ImpTotal'            , field:'impTotal', tip: '',filter:"number"},
    {show:true,name:'Estado'              , field:'estado', tip: ''}
]



var CUPONES_COLUMNS=[
    {show:true,name:'Fec.Operación'  , field:'fecOperacion', tip: '',filter:"date", align:"right"},
    {show:true,name:'Comercio'  , field:'comercio', tip: ''},
    {show:true,name:'Ref/Cupón'  , field:'nroCupon', tip: '',filter:"", align:"right"},
    {show:true,name:'Mon.'  , field:'moneda', tip: '', align:"right"},
    {show:true,name:'Importe $ '  , field:'impPesos', tip: '',filter:"number"},
    {show:true,name:'Importe U$D'  , field:'impUSD', tip: '',filter:"number"},
]



app.controller('reclamos.ctrl', function($scope, $resource,$filter,Global, $mdDialog,$mdToast,$route, Toast,$http,ReclamosFecha,ReclamosVisaElectron,) {

    $scope.model={};
    $scope.tiposCtasTarjetas=[{codigoTipoCuenta:"123123" ,tipoCT:"123123"},{codigoTipoCuenta:"456456" ,tipoCT:"456456"}]
    $scope.reclamoEstados=[{estado:"PENDIENTE" },{estado:"RESUELTO" }]


    $scope.recviCtrl=new ReclamosVisaElectronControl($scope,$resource,$filter,Global,$mdDialog,$mdToast,$route,$http,ReclamosVisaElectron,ReclamosFecha);

    $scope.ReclamosFecha=ReclamosFecha;
    $scope.grillaReclamos=new Componentes.Grilla($http,$filter,Toast);

    $scope.toolbarReclamos={
        ReclamosFecha:ReclamosFecha,
        titulo:"Reclamos",
        customButtons:"reclamosBotones.tmpl.html",
        form:"reclamosFilter.tmpl.html",
        show_insert:{show:true, tooltip:"Agregar"},
        show_update:{show:false,tooltip:"Modificar"},
        show_delete:{show:false,tooltip:"Eliminar"},
        show_filter:{show:true,tooltip:"Buscar"},
        show_print:{show:true,tooltip:"Imprimir"},
        item:{},
        exportar:function(){
            console.log("Exportar ++")
        },
        mail_generar:function(){
            console.log("mail_generar")
        },
        onChange:function(){
            console.log("Cuentas onchange");
        },
        insert:function(a){
           $scope.recviCtrl.openAddForm();
        },
        update:function(a){
            $scope.recviCtrl.openUpdateForm();
        },
        delete:function(a){
            $scope.recviCtrl.openDeleteForm();
        },
        caratulaReclamos:function(){
            console.log("+ caratulaReclamos");
        },
        generarFUT:function(){
            console.log("+ generarFUT");
        },
        generarArchivoVisa:function(){
            console.log("+ generarArchivoVisa");
        },
            /*
        onFilter:function(param){
                console.log("+ onFilter",ReclamosFecha.grilla.config.query);
            if(ReclamosFecha.grilla.config.query.filter.length>=3 ){
                $scope.ReclamosFecha.grilla.HttpGetFromDB();
            }
        },*/
        onKeyUp:function($event){
            console.log("+ onFilter",ReclamosFecha.grilla.config.query.fecha);
            console.log("+ onFilter",ReclamosFecha.grilla.config.query.filter);
            if(typeof ReclamosFecha.grilla.config.query.filter!='undefined' == ReclamosFecha.grilla.config.query.filter.length>=3){
                $scope.ReclamosFecha.grilla.HttpGetFromDB();
            }
        }

    };


    $scope.reclamosMultiSelect=true;

    $scope.ReclamosFecha.grilla=$scope.grillaReclamos;
    $scope.grillaReclamos.config.url="/api/reclamos/reclamos";
    $scope.grillaReclamos.config.columns=RECLAMOS_COLUMNS;
    $scope.grillaReclamos.data=[];
    $scope.grillaReclamos.config.orderByBD=true;
    $scope.grillaReclamos.config.query.limit=1000000;
    $scope.grillaReclamos.config.query.fecha=ReclamosFecha.getdate();
    // $scope.grillaReclamos.HttpGetFromDB();


    $scope.grillaReclamos.onAfterCheck=function(param){
        if (param.selected){
            $scope.grillaReclamos.selectedItem=param;
        }else{
            $scope.grillaReclamos.selectedItem=undefined;
        }
        $scope.reclamosSelected =_.where($scope.grillaReclamos.data, {"selected": true});

        console.log("$scope.reclamosSelected",$scope.reclamosSelected)

        if($scope.reclamosMultiSelect ){

            if ($scope.reclamosSelected.length==1){
                $scope.toolbarReclamos.show_update.show=(typeof $scope.grillaReclamos.selectedItem!='undefined') ?true:false;
                $scope.toolbarReclamos.show_update.show=($scope.reclamosSelected.length==1);

                $scope.toolbarReclamos.show_delete.show=$scope.toolbarReclamos.show_update.show;
                $scope.toolbarReclamos.show_insert.show=false;
                $scope.grillaReclamos.selectedItem=$scope.reclamosSelected[0];
                $scope.grillaCupones.config.query.idReclamoElectron=$scope.grillaReclamos.selectedItem.idReclamoElectron;
                $scope.grillaCupones.HttpGetFromDB();
            }
            if ($scope.reclamosSelected.length>1) {
                $scope.toolbarReclamos.show_update.show = false;
                $scope.toolbarReclamos.show_insert.show=false;
            }
        }

        if ($scope.reclamosSelected.length==0){
                $scope.toolbarReclamos.show_update.show = false;
                $scope.toolbarReclamos.show_delete.show = false;
                $scope.toolbarReclamos.show_insert.show=true;
        }

    }
    // Cupones

    $scope.grillaCupones=new Componentes.Grilla($http,$filter,Toast);
    $scope.grillaCupones.config.url="/api/reclamos/cupones";
    $scope.grillaCupones.config.columns=CUPONES_COLUMNS;
    $scope.grillaCupones.data=[];
    $scope.grillaCupones.config.orderByBD=true;
    $scope.grillaCupones.config.query.limit=1000000;
    $scope.ReclamosFecha.grillaCupones=$scope.grillaCupones;


    // Cupones
    $scope.toolbarCupones={titulo:"Cupones",
        grilla:$scope.grillaCupones,
        form:"reclamosCuponesFilter.tmpl.html",
        show_insert:{show:true, tooltip:"Agregar"},
        show_update:{show:false,tooltip:"Modificar"},
        show_delete:{show:false,tooltip:"Eliminar"},
        show_filter:{show:true,tooltip:"Buscar"},
        show_print:{show:true,tooltip:"Imprimir"},
        item:{},
        exportar:function(){
            console.log("Exportar ++")
        },
        mail_generar:function(){
            console.log("mail_generar")
        },
        onChange:function(){
            console.log("Cuentas onchange");
        },
        insert:function(a){
            // $scope.datosFijosEdpCtrl.openAddForm();
            console.log("Cuentas insert");
        },
        update:function(a){
            // $scope.datosFijosEdpCtrl.openUpdateForm();
            console.log("Cuentas update");
        },
        delete:function(a){
            // $scope.datosFijosEdpCtrl.openDeleteForm();
            console.log("Cuentas delete");
        },
        caratulaReclamos:function(){
            console.log("+ caratulaReclamos");
        },
        generarFUT:function(){
            console.log("+ generarFUT");
        },
        generarArchivoVisa:function(){
            console.log("+ generarArchivoVisa");
        },
        onKeyUp:function($event){
            console.log("+ onFilter",ReclamosFecha.grillaCupones.config.query);
            if(typeof ReclamosFecha.grillaCupones.config.query.filter!='undefined' == ReclamosFecha.grillaCupones.config.query.filter.length>=1){
                $scope.ReclamosFecha.grillaCupones.HttpGetFromDB();
                console.log("+ in onFilter");
            }
        }

    };
    $scope.grillaCupones.onAfterCheck=function(){
        $scope.toolbarCupones.show_update.show=(typeof $scope.grillaCupones.selectedItem!='undefined') ?true:false;
        $scope.toolbarCupones.show_delete.show=$scope.toolbarCupones.show_update.show;
        $scope.toolbarCupones.show_insert.show=!$scope.grillaCupones.selectedItem;
    }
    ReclamosFecha.grillaReclamos= $scope.grillaReclamos;
    ReclamosFecha.grillaCupones= $scope.grillaCupones;


    $scope.getParonTD=function(nroCta){
        recviCtrl.getParonTD(nroCta,
            function(res){console.log("err",res)},
            function(err){console.log("Err",err)}
        )
    }

    $scope.isUndefined=function(value){
        var res=(typeof value=='undefined');
        return res;
    }

});




app.controller('resoluciones.ctrl', function($scope, $resource ) {
    /*
    Contenido del controlador es solo de prueba.
    */
    $scope.student = {
        firstName: "Mahesh",
        lastName: "Parashar",
        fees:500,

        subjects:[
            {name:'Physics',marks:70},
            {name:'Chemistry',marks:80},
            {name:'Math',marks:65},
            {name:'English',marks:75},
            {name:'Hindi',marks:67}
        ],

        fullName: function() {
            var studentObject;
            studentObject = $scope.student;
            return studentObject.firstName + " " + studentObject.lastName;
        }
    };
});



var ReclamosVisaElectronControl=function($scope,$resource,$filter,Global,$mdDialog,$mdToast,$route,$http,ReclamosVisaElectron,ReclamosFecha){
    var _this=this;
    var url="/api/reclamos/"
    $scope.regexInt = '\\d+';

    // model_aux Temporal para Desarrollo
/*
    $scope.model_aux={}
    $scope.model_aux.fecContable=new Date();
    $scope.model_aux.nroReclamo=123123;
    $scope.model_aux.nroTarjeta=123123;
    $scope.model_aux.cliente=123123;
    $scope.model_aux.sucTarjeta=$scope.tiposCtasTarjetas[0];
    $scope.model_aux.nombreSucTarjeta=$scope.tiposCtasTarjetas[0];
    $scope.model_aux.nroCuenta=$scope.tiposCtasTarjetas[0];
    $scope.model_aux.idMotivo=$scope.tiposCtasTarjetas[0];
    $scope.model_aux.montoCompra=123123;
    $scope.model_aux.sucReclamo=123123;
    $scope.model_aux.nombreSucReclamo=123123;
    $scope.model_aux.observaciones=123123;
    $scope.model_aux.impTotal=123123;
    $scope.model_aux.estado=123123;
*/
    this.openDeleteForm=function(){
        $scope.operac="Baja";
        //$scope.model.codigoAlta=$scope.model.codigoAltaCuenta;
        this.delete();

    }
    this.openUpdateForm=function(){
        $scope.operac="Modificar";
        $scope.model={};
        $scope.model = Object.assign({}, $scope.grillaReclamos.selectedItem);
        $scope.model.fecContable=ReclamosFecha.date;

        this.submit=this.update;
        _this.dialogShow()
    }
    this.openAddForm=function(){
        console.log("ReclamosFecha.date", ReclamosFecha.date)

        $scope.operac="Alta";
        this.submit=this.insert;

        $scope.model={};
        $scope.model.fecContable=ReclamosFecha.date;
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
            templateUrl: 'app.views/reclamos/addReclamos.html'
        }).then(function () {});
    }
    this.modalController=function ($scope, $mdDialog,ParentScope,ReclamosFecha) {
        _this.ParentScope =ParentScope;
        $scope.ParentScope = ParentScope;

        ParentScope.nroCuentas=[];
        $scope.model=ParentScope.model;


        $scope.model.fecContable =ReclamosFecha.date;

        _this.getMotivosReclamo();

        if(ParentScope.operac.toUpperCase() == 'ALTA'){
            $scope.model.estado=ParentScope.reclamoEstados[0].estado;
        }
        if(ParentScope.operac.toUpperCase() == 'MODIFICAR'){
            _this.getClientData($scope.model);
        }

        console.log("Model Control -> ", $scope.model)

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
        console.log("form,data -> ",data)
        /*
        if($scope.model.datofijocuenta_existe){
            _this.showToast("Error","El tipo de cuenta seleccionada ya existe.");
            return; // La cuenta no se puede insertar porque ya existe
        }
        */
        if (form.$valid) {
            data.usuario= Global.currentUser.name
            ReclamosVisaElectron.save(data, _this.ok,_this.error);
        }
    }
    this.update=function (form,data){
        if (form.$valid) {
            data.usuario= Global.currentUser.name
            ReclamosVisaElectron.update({ idReclamoElectron: data.idReclamoElectron },data,_this.ok,_this.error);
        }
    }

    this.delete=function (form,data){

        console.log("DELETE",$scope.grillaCupones )
        var confirm = $mdDialog.confirm()
            .textContent('¿Está seguro de que desea eliminar el/los registro/s seleccionado/s?')
            .ariaLabel('Lucky day')
            .ok('Aceptar')
            .cancel('Cancelar');

        $mdDialog.show(confirm).then(function() {

            // ParentScope.grillaReclamos
            var aBorrar=_.pluck($scope.reclamosSelected, 'idReclamoElectron');
            console.log("test", aBorrar)

            $http.post("/api/reclamos/eliminar", {reclamos: aBorrar.join(";")},{})
                .success(_this.ok)
                .error(_this.error);

            // ReclamosVisaElectron.post(}, _this.ok,_this.error);
        }, function() {
            // Se cancela la eliminacion
            console.log("Se Cancela")
        });
    }

    this.ok=function(res){
        $scope.model=undefined;
        $scope.grillaReclamos.selectedItem=undefined;
        _this.showToastSuccess();
        $scope.grillaReclamos.HttpGetFromDB();
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


    /*
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

    */



    // ReclamosVisaElectron.post(}, _this.ok,_this.error);

    this.getParonTD= function(nroCta,ok, error) {
        $http.post("/api/reclamos/padronTD", {nroTarjeta: ""},{})
            .success(ok)
            .error(error);
    };

    this.getClientData= function(model) {
        console.log("getClientData")
        if(model.nroTarjeta && model.nroTarjeta.toString().length==16){
            if(_this.ParentScope.operac.toUpperCase() == 'ALTA'){
                model.nroCuenta="";
            }

            $http({
                method: 'GET',
                url: '/api/reclamos/padronTD'+'?nroTarjeta='+ model.nroTarjeta.toString(),

            }).success(function(data){
                $scope.nroCuentas=data;
                if(_this.ParentScope.operac.toUpperCase() == 'MODIFICAR'){
                    _this.getSucursalPorCodigo(model);
                }

                if(_this.ParentScope.operac.toUpperCase() == 'ALTA'){
                    if(data.length==1) {
                        model.nroCuenta = data[0].nroCuenta;
                    }
                }

                if(data.length>0){
                    model.cliente= data[0].nombre;
                   // _this.getPadronNroCuenta(model);
                }
            }).error(function(){
            });

        }
    };



    this.getPadronNroCuenta= function(model) {
        if(_this.ParentScope.operac.toUpperCase() == 'ALTA'){
            $scope.model.nroCuenta={};
        }



            $http({
                method: 'GET',
                url: '/api/reclamos/padronTDNroCuenta'+'?nroTarjeta='+ model.nroTarjeta.toString(),

            }).success(function(data){
                console.log("/api/reclamos/padronTDNroCuenta -> ",data)
                $scope.nroCuentas=data;

                if(data.length==0 && _this.ParentScope.operac.toUpperCase() == 'ALTA'){
                    model.nroCuenta={};

                }

                if(data.length==1){
                    console.log("_this.ParentScope.operac.toUpperCase()", _this.ParentScope.operac.toUpperCase());
                    if(_this.ParentScope.operac.toUpperCase() !== 'MODIFICAR'){
                        $scope.model.nroCuenta=data[0].nrocuenta;
                    }
                    if(_this.ParentScope.operac.toUpperCase() == 'MODIFICAR'){
                        $scope.model.nroCuenta=data[0].nrocuenta;
                    }
                }

                _this.getSucursalPorCodigo(model);

            }).error(function(){
                $scope.model.nroCuenta={};
            });

       // }
    };


    this.getSucursalPorCodigo= function(model) {


        var cta=_.where($scope.nroCuentas, {"nroCuenta": $scope.model.nroCuenta});

        console.log("getSucursalPorCodigo MODEL , cta",model.nroCuenta, cta)

        if (typeof model.nroCuenta=='undefined' && cta.length==0){
            return;
        }
        if (typeof model.nroCuenta.oficina=='undefined' && cta.length==0){
            return;
        }

        var xOficina;
        if(cta.length>0){
            xOficina=cta[0].oficina;
        }else{
            xOficina=model.nroCuenta.oficina.toString();
        }
        console.log("2. MODEL , cta",model.nroCuenta, cta)
        if(model.nroTarjeta && model.nroTarjeta.toString().length==16){
            $http({
                method: 'GET',
                url: '/api/sucursal/get/byCodigo?codSucursal='+ xOficina
            }).success(function(data){
                $scope.sucTarjetas=data;
                console.log("3. MODEL -  data",data)
                if(_this.ParentScope.operac.toUpperCase() !== 'ALTA'){
                    if($scope.sucTarjetas.length>0){
                        $scope.model.nombreSucTarjeta=data[0];
                        $scope.nomTar=data[0];
                    }
                    if($scope.sucTarjetas.length==0) {
                        _this.showToast("Error", 'La sucursal '+model.nroCuenta.oficina.toString()+' no existe en la tabla de Sucursales' );
                    }
                }
            }).error(function(){
            });

        }
    };



    this.checkSucursalPorCodigo= function(model) {
            console.log("VALID CHECK -> model.sucReclamo ", model.sucReclamo )
            model.sucReclamoNoExiste=0;
            model.nombreSucReclamo="";

            if(!model.sucReclamo){
                return;
            }

            $http({
                method: 'GET',
                url: '/api/sucursal/get/byCodigo?codSucursal='+ model.sucReclamo
            }).success(function(data){
                console.log("data",data)
                if(data.length==0){
                    model.sucReclamoNoExiste=1;
                    _this.showToast("Error", 'La sucursal '+model.sucReclamo +' no existe en la tabla de Sucursales' );

                }else{
                    model.nombreSucReclamo=data[0].descripSucursal;

                }
            }).error(function(err){
                _this.showToast("Error", err.message );
            });


    };


    this.getMotivosReclamo= function(model) {

        console.log("GET-MOTIVOS-RECLAMO")
            $http({
                method: 'GET',
                url: '/api/reclamos/motivos'
            }).success(function(data){
                    _this.ParentScope.reclamosMotivos=data[0];
            }).error(function(){
            });

    };





}









app.controller('XXX0001.ctrl', function ($scope,$http,$resource,$filter,$mdDialog,Toast,Global,$mdToast,$route,DatosFijosEDPCuentas,DatosFijosEDPTarjetas) {
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

