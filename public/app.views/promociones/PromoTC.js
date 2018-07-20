
var COLUMNS_PROCESO= [
    { id: 2, show: true, name: 'Ent.', field: 'entidad', tip: ''},
    { id: 2, show: true, name: 'Nombre', field: 'Nombre', tip: ''},
    { id: 3, show: true, name: 'CodPromo', field: 'codigoPromo', tip: ''},
    { id: 4, show: true, name: 'Descripción', field: 'Descripcion', tip: ''},
    { id: 5, show: true, name: 'Acción', field: 'accion', tip: ''},
    { id: 6, show: true, name: 'Vigencia Hasta', field: 'vigenciaHasta', tip: '',filter:''},
    { id: 7, show: true, name: 'Estado Cuenta', field: 'estadoCuenta', tip: ''},
    { id: 8, show: true, name: 'Pre Validación', field: 'descrValidacion', tip: ''},
    { id: 9, show: true, name: 'Cantidad', field: 'Cant', tip: ''},
    { id: 10, show: true, name: 'Estado Visa', field: 'estadoVisa', tip: ''},
    { id: 11, show: true, name: 'CodError', field: 'codError', tip: ''},
];



// 1. Información del último proceso
// 2. Información agrupada de Promociones


var ConsultasPromoTC= (function () {
    function Padrones($scope,$http,$filter,Toast) {
        var _this=this;
        this.$scope=$scope;
        this.$http=$http;

        //Padrones de Comercio
        $scope.sucursalPadrones="";
        $scope.ULTIMO_PROCESO_GRILLA1="Grilla1";
        $scope.AGRUPACION_PROMOCIONES_GRILLA2="Grilla2";
        $scope.URL_CONSULTASPROMO_TC="/api/promociones/ConsultasPromoTC/"
        $scope.URL_PROMOCIONES_EXPORTAR="/api/promociones/ConsultasPromoTC/exportar" //  "/api/reportes/padronesComercio/exportar"
        $scope.grillaFiltered=false;

        var grilla = {
            filter: {
                options: { debounce: 500 }
            },
            query: {
                limit: 5,
                order: '',
                page: 1,
                where: ''
            },
            queryParams:function(){
                var params="";
                var data={};
                var obj=this.query;
                var params=        "codigo="+ obj.codigo;
                    params=params+"&limit="+ obj.limit;
                    params=params+"&page="+ obj.page;
                    params=params+"&order="+ obj.order;
                    params=params+"&where="+ obj.where;

                data.codigo=obj.codigo;
                data.limit=obj.limit;
                data.page=obj.page;
                data.order= obj.order;
                data.where= obj.where;

                if(obj.fecHasta){
                    data.fecHasta= getDateYYMMDD(obj.fecHasta);
                }
                if(obj.fecDesde){
                    data.fecDesde= getDateYYMMDD(obj.fecDesde);
                }

                return data;
            },
            queryParamsExport:function(){
                var params= "codigo="+ this.query.codigo;
                if(typeof this.query.fecHasta!='undefined'){
                    params= params+"&fecHasta= "+getDateYYMMDD(this.query.fecHasta);
                }
                if(typeof this.query.fecDesde!='undefined'){
                    params=params+"&fecDesde= "+getDateYYMMDD(this.query.fecDesde);
                }
                return params;
            },

            count: 0,
        };



        function getDateYYMMDD(obj){
            if(obj){
                var day   = obj.getDate().toString();
                var month   = (obj.getMonth()+1).toString();
                var year    = obj.getFullYear().toString();
                day   ="00".substring(0, "00".length - day.length) + day
                month   ="00".substring(0, "00".length - month.length) + month
                year    = "0000".substring(0, "0000".length - year.length) + year
                return year+month+day;
            }else{return ""}
        }
        $scope.grilla={};
        $scope.grillaPromise={};

        $scope.grilla[$scope.ULTIMO_PROCESO_GRILLA1]=angular.copy(grilla);
        $scope.grilla[$scope.ULTIMO_PROCESO_GRILLA1].columns=COLUMNS_PROCESO;
        $scope.grilla[$scope.ULTIMO_PROCESO_GRILLA1].query.codigo=$scope.ULTIMO_PROCESO_GRILLA1;
        $scope.grilla[$scope.ULTIMO_PROCESO_GRILLA1].query.order='entidad';
        $scope.grilla[$scope.ULTIMO_PROCESO_GRILLA1].show=false;

        angular.copy(grilla)

        $scope.grilla[$scope.AGRUPACION_PROMOCIONES_GRILLA2]=angular.copy(grilla); //Object.assign({}, grilla)
        $scope.grilla[$scope.AGRUPACION_PROMOCIONES_GRILLA2].columns=COLUMNS_PROCESO;
        $scope.grilla[$scope.AGRUPACION_PROMOCIONES_GRILLA2].query.codigo=$scope.AGRUPACION_PROMOCIONES_GRILLA2;
        $scope.grilla[$scope.AGRUPACION_PROMOCIONES_GRILLA2].query.order='entidad';
        $scope.grilla[$scope.AGRUPACION_PROMOCIONES_GRILLA2].show=false;

        this.sucursalChange=function(param){
            console.log("$scope.sucursalPadrones",this.$scope.sucursalPadrones);
        }
        this.onReorderBase=function(order){
            var data=order.split(";");
            var grilla=data[1];
            var fieldOrder=data[0];
            $scope.grilla[grilla].query.order=fieldOrder;
            _this.HttpGet(_this.$scope.URL_CONSULTASPROMO_TC,grilla,_this.$scope.grilla[grilla].queryParams());
        }

        this.onPaginateBase= function(page, limit,codigo) {
            $scope.grilla[codigo].query.page= page;
            $scope.grilla[codigo].query.limit= limit;
            $scope.grilla[codigo].query.codigo=codigo;
            _this.HttpGet(_this.$scope.URL_CONSULTASPROMO_TC,codigo,_this.$scope.grilla[codigo].queryParams());
        };
        this.onPaginateGrilla1= function(page, limit) {
            _this.onPaginateBase(page, limit,$scope.ULTIMO_PROCESO_GRILLA1)
        };

        this.onPaginateGrilla2= function(page, limit) {
           _this.onPaginateBase(page, limit,$scope.AGRUPACION_PROMOCIONES_GRILLA2)
        };

        this.exportarGrilla=function(codigo){

            if(typeof  codigo!='undefined'){
                var exportUrl=this.$scope.URL_PROMOCIONES_EXPORTAR+'?'+this.$scope.grilla[codigo].queryParamsExport()+"&proceso="+"Promo TC Inicio VI";
                _this.$http({url:exportUrl ,method: "GET"}).then(function(res){
                    console.log("EXPORT -> ",res.data.message)
                    Toast.showSuccess(res.data.message);
                }, function(error){
                    if(error.data.message.includes("bp4_sqlusr_admin")){
                        Toast.showError("El proceso se encuentra en ejecucion, aguarde un momento para volver a generar archivos.",'Error');
                    }else{
                        Toast.showError(error.data.message,'Error');
                    }
                    // e SQLServerAgent: Petición de ejecución del trabajo ExportarArchivos_Test (de Usuario bp4_sqlusr_admin) rechazada porque el trabajo ya se está ejecutando a petición de Usuario bp4_sqlusr_admin.
                });
            }


        }

        this.getFecha=function (data){
            if (data!=null){
                var fecha=data.replace("Z"," ").replace("T"," ");
                return new Date(fecha);
            }
            return null
        }

        this.actualizarFechaDesde=function(pDate){
            var date=new Date(pDate)
            date.setDate(date.getDate() - 30);
            $scope.grilla[_this.$scope.AGRUPACION_PROMOCIONES_GRILLA2].query.fecDesde=date;
        }


        this.ObtenerPadrones=function(){
            _this.$http({url: $scope.URL_CONSULTASPROMO_TC+"maxFecProceso",method: "GET"}).then(function(res){
                if(res.data[0].length>0){
                    $scope.grilla[_this.$scope.AGRUPACION_PROMOCIONES_GRILLA2].query.fecHasta = res.data[0][0].FecProceso? moment(res.data[0][0].FecProceso ).toDate(): undefined;
                    var date=new Date(res.data[0][0].FecProceso)
                        date.setDate(date.getDate() - 30);
                    $scope.grilla[_this.$scope.AGRUPACION_PROMOCIONES_GRILLA2].query.fecDesde = res.data[0][0].FecProceso? date : undefined;

                    _this.HttpGet(_this.$scope.URL_CONSULTASPROMO_TC,_this.$scope.ULTIMO_PROCESO_GRILLA1,$scope.grilla[_this.$scope.ULTIMO_PROCESO_GRILLA1].queryParams());
                    _this.HttpGet(_this.$scope.URL_CONSULTASPROMO_TC,_this.$scope.AGRUPACION_PROMOCIONES_GRILLA2,$scope.grilla[_this.$scope.AGRUPACION_PROMOCIONES_GRILLA2].queryParams());
                }else{
                    Toast.showError("No se encontre la maxima fecha de proceso.",'Error');
                }

            }, function(error){
                Toast.showError(error.data.message,'Error');
            });
        }

        this.onFilter=function(codigo){
            console.log("this.onFilter -> ",codigo,$scope.grilla[codigo].queryParams())
            _this.HttpGet(_this.$scope.URL_CONSULTASPROMO_TC,codigo,$scope.grilla[codigo].queryParams());
        }


        this.HttpGet=function(url,codigo,sendData){
            $scope.grillaFiltered=true;
            _this.$scope.grilla[codigo].showNoRegister=false;
            _this.$scope.grillaPromise[codigo]=_this.$http({url: url,method: "GET",params: sendData}).then(function(res){
                console.log("res.data[0]",res.data[0])
                $scope.grilla[codigo].data=res.data[0];
                if (res.data.length > 1) {
                   _this.$scope.grilla[codigo].count = res.data[1][0].rows;
                }
                _this.$scope.grilla[codigo].showNoRegister=true;
            }, function(error){
                console.log("error",error)
                Toast.showError(error.data.message,'Error');
            });
        }

        this.showVal = function(value, filter) {
            if(value==null || typeof value=='undefined'){
                return "";
            }

            if (filter == 'date') {
                var fecha=value.replace("Z"," ").replace("T"," ");
                return $filter('date')(new Date(fecha), 'dd/MM/yyyy')
            }
            if (filter == 'number') {
                return $filter('number')(value, 2);

            }
            if (filter == 'coef') {
                return $filter('number')(value, 4);
            }

            return value;

        };
    }
    return { Padrones: Padrones}
})()

app.controller('promoTC.ctrl', function ($scope, Toast, $http, Excel,$filter) {
    $scope.grillaFiltered= true;
    $scope.consultasTC=new ConsultasPromoTC.Padrones($scope,$http,$filter,Toast);
    $scope.consultasTC.ObtenerPadrones();
    $scope.nombreDeProceso="Consultas Promo TC";



});


