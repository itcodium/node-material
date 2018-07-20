app.controller('datosFijos.ctrl', function ($scope, Toast, $http, $filter) {

    $scope.query = {};
    $scope.showGrids = true;
    $scope.query = { report: 'Seleccione opción' };
    $scope.reports = [ 'Seleccione opción', 'Cuentas', 'Tarjetas'];

    $scope.grillaPromise={};

  /*  $scope.load = function () {
        switch ($scope.query.report) {
            case 'Cuentas':
                $scope.$broadcast('init',{});
                break;
            case 'Tarjetas':
                $scope.$broadcast('init',{});
                break;

        }
    };*/

    $scope.load = () => {
        $scope.$broadcast('init',{});
    };

    activate();

    function activate() {
        $scope.$broadcast('init',{});
    }

});






/*
var datosFijos_cuentas = [
    { show: true,  name: 'codigoAltaCuenta',  field: 'codigoAltaCuenta', tip: ''},
    { show: true,   name: 'entidad',           field: 'entidad',          tip: ''},
    { show: true,   name: 'tipoCuenta',        field: 'tipoCuenta',       tip: ''},
    { show: true,   name: 'LC',         field: 'LC',   tip: ''},
    { show: true,   name: 'PorcFinanciación',    field: 'PorcFinanciación',   tip: '', class: 'row-break'},
    { show: true,   name: 'ModLiq',          field: 'ModLiq',         tip: ''},
    { show: true,   name: 'formaPago',       field: 'formaPago',      tip: ''},
    { show: true,   name: 'cartera',          field: 'cartera', tip: ''},
    { show: true,   name: 'fpSucursal',          field: 'fpSucursal', tip: ''},
    { show: true,   name: 'fpTipoCta',          field: 'fpTipoCta',         tip: ''},
    { show: true,   name: 'catCajeroAutomatico',       field: 'catCajeroAutomatico',      tip: ''},
    { show: true,   name: 'gaf',          field: 'gaf', tip: ''},
    { show: true,   name: 'tipoIva',          field: 'tipoIva', tip: ''},
    { show: true,   name: 'cuit',          field: 'cuit', tip: ''},
    { show: true,   name: 'codAGrupo',          field: 'codAGrupo', tip: ''},
]

var datosFijos_tarjetas = [
    { show: true,  name: 'codigoAltaTarjeta',  field: 'codigoAltaTarjeta', tip: ''},
    { show: true,   name: 'entidad',           field: 'entidad',          tip: ''},
    { show: true,   name: 'tipoTarjeta',        field: 'tipoTarjeta',       tip: ''},
    { show: true,   name: 'vigencia',         field: 'vigencia',   tip: ''},
    { show: true,   name: 'porcBonificacion',    field: 'porcBonificacion',   tip: '', class: 'row-break'},
    { show: true,   name: 'tipoDocumento',          field: 'tipoDocumento',         tip: ''},
    { show: true,   name: 'nacionalidad',       field: 'nacionalidad',      tip: ''},
    { show: true,   name: 'sexo',          field: 'sexo', tip: ''},
    { show: true,   name: 'estCivil',          field: 'estCivil', tip: ''},
    { show: true,   name: 'fecNacimiento',          field: 'fecNacimiento',         tip: ''},
    { show: true,   name: 'ocupacion',       field: 'ocupacion',      tip: ''},
    { show: true,   name: 'habilitacion',          field: 'habilitacion', tip: ''},
    { show: true,   name: 'cargo',          field: 'cargo', tip: ''},
    { show: true,   name: 'porcLimLC',          field: 'porcLimLC', tip: ''},
    { show: true,   name: 'porcLimLCC',          field: 'porcLimLCC', tip: ''},
    { show: true,   name: 'porcLimADE',          field: 'porcLimADE', tip: ''},
    { show: true,   name: 'distribucion',          field: 'distribucion', tip: ''},

]; */

/*
var Comercio= (function () {
    function Padrones($scope,$http,$filter) {
        var _this=this;
        this.$scope=$scope;
        this.$http=$http;

        //Padrones de Comercio
        $scope.sucursalPadrones="";
        $scope.Cuentas="cuentas";
        $scope.Tarjetas="tarjetas";
        $scope.URL_PADRONES="/api/reportes/padronesComercio/"
        $scope.URL_PADRONES_EXPORTAR="/api/reportes/padronesComercio/exportar"
        $scope.grillaFiltered=false;

        var grilla = {
            filter: {
                options: { debounce: 500 }
            },
            query: {
                filter: {
                    codigo:'',
                    entidad: '',
                    sucursal: null
                },
                limit: 5,
                order: '',
                page: 1,
                where: ''
            },
            count: 0,
        };

        $scope.grilla={};
        $scope.grilla[$scope.Cuentas]= angular.copy(grilla);
        $scope.grilla[$scope.Cuentas].columns=datosFijos_cuentas;
        $scope.grilla[$scope.Cuentas].query.filter.codigo=$scope.Cuentas;
        $scope.grilla[$scope.Cuentas].show=false;

        $scope.grilla[$scope.Tarjetas]=angular.copy(grilla);
        $scope.grilla[$scope.Tarjetas].columns=datosFijos_tarjetas;
        $scope.grilla[$scope.Tarjetas].query.filter.codigo=$scope.Tarjetas;
        $scope.grilla[$scope.Tarjetas].show=false;


        this.sucursalChange=function(param){
            console.log("$scope.sucursalPadrones",this.$scope.sucursalPadrones);
        }
        this.onReorderBase=function(order){
            // console.log("order",order)
            var data=order.split(";");
            $scope.filter=angular.copy($scope.grilla[data[1]].query);
            console.log("order",data[0],data[1])
            $scope.filter.order=data[0];

            console.log("filter",$scope.filter)
            // console.log("order",$scope.grilla[data[1]].query.order)

            _this.HttpGet(_this.$scope.URL_PADRONES,data[1]);
        }

        this.onPaginateBase= function(page, limit,codigo) {
            $scope.grilla[codigo].query.page= page;
            $scope.grilla[codigo].query.limit= limit;
            this.HttpGet(_this.$scope.URL_PADRONES,codigo);
        };
        this.onPaginateCuentas = function(page, limit) {
            _this.onPaginateBase(page, limit,$scope.Cuentas)
        };
        this.onPaginateTarjetas= function(page, limit) {
            _this.onPaginateBase(page, limit,$scope.Tarjetas)
        };
        this.onPaginateCabal= function(page, limit) {
            _this.onPaginateBase(page, limit,$scope.CABAL)
        };
        this.exportarAExcelPadrones=function(){
            var exportUrl="";
            if (this.$scope.sucursalPadrones!=null){
                exportUrl=this.$scope.URL_PADRONES_EXPORTAR+"?sucursal="+this.$scope.sucursalPadrones+"&proceso="+$scope.nombreDeProceso;
            }else{
                exportUrl=this.$scope.URL_PADRONES_EXPORTAR+"&proceso="+$scope.nombreDeProceso;
            }
            return exportUrl;
        }
        this.ObtenerPadrones=function(){
            console.log("sucursalPadrones", $scope.sucursalPadrones)
            $scope.filter=undefined;

            if($scope.sucursalPadrones>0)
            {
                this.HttpGet(this.$scope.URL_PADRONES,this.$scope.Cuentas);
                this.HttpGet(this.$scope.URL_PADRONES,this.$scope.Tarjetas);
            }
        }
        this.HttpGet=function(url,codigo){

            var _this=this;

            var filtro;
            if(typeof $scope.filter!='undefined'){
                filtro=$scope.filter;
            }else{
                filtro=_this.$scope.grilla[codigo].query;
            }
            $scope.grillaFiltered=true;
            console.log("filtro -> " ,filtro);// _this.$scope.grilla[codigo].query

            _this.$scope.grilla[codigo].query.filter.sucursal=this.$scope.sucursalPadrones;
            _this.$scope.grilla[codigo].showNoRegister=false;
            _this.$scope.grillaPromise[codigo]=_this.$http({
                url: url,
                method: "GET",
                params: filtro
            }).then(function(res){
                $scope.grilla[codigo].data=res.data[0];
                if (res.data.length > 1) {
                    _this.$scope.grilla[codigo].count = res.data[1][0].rows;
                }
                _this.$scope.grilla[codigo].showNoRegister=true;
            }, function(error){
                console.log("Res",codigo,error)
            });
        }
    }
    return { Padrones: Padrones}
})()








app.controller('reporteProcesoConvenio.ctrl', function ($scope, Toast, $http, $filter) {
    $scope.showGrids = true;
    $scope.query = { report: 'Seleccione opción' };

    $scope.reports = [ 'Seleccione opción', 'Cuentas', 'Tarjetas'];

    $scope.grillaPromise={};

    $scope.load = function () {
        switch ($scope.query.report) {
            case 'Cuentas':
                loadCuentas();
                break;
            case 'Tarjetas':
                loadTarjetas();
                break;
        }
    };




    // $scope.load();
});

*/

