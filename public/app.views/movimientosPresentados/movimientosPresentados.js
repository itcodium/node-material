var GRILLA_MOVIMIENTOS_PRESENTADOS= [

    { name: 'FecPres',show: true,  field: 'FecPres',filter:"date", tip: 'left'},
    { name: 'Car',show: true,  field: 'Car',filter:"int", tip: '', align:''},
    { name: 'Moneda',show: true,  field: 'Moneda',filter:"", tip: '', align:''},
    { name: 'Cod',show: true,  field: 'Cod',filter:"", tip: '', align:''},
    { name: 'EvGr',show: true,  field: 'EvGr',filter:"int", tip: '', align:''},
    { name: 'Ev',show: true,  field: 'Ev',filter:"int", tip: '', align:''},
    { name: 'EvS',show: true,  field: 'EvS',filter:"", tip: '', align:''},
    { name: 'FecCruce',show: true,  field: 'FecCruce',filter:"date", tip: ''},
    { name: 'Imp',show: true,  field: 'Imp',filter:"number", tip: '', align:''},
    { name: 'ImpCruce',show: true,  field: 'Imp',filter:"number", tip: 'number', align:''},
    { name: 'codMovimiento',show: true,  field: 'codMovimiento',filter:"", tip: '', align:''},
    { name: 'DescripEvento',show: true,  field: 'DescripEvento',filter:"", tip: '', align:''},
    { name: 'Agrupamiento',show: true,  field: 'Agrupamiento',filter:"", tip: '', align:''},
    { name: 'Importe',show: true,  field: 'Importe',filter:"number", tip: '', align:''}
]

var LDate = (function () {

    function restDays(startDate,numberOfDays)
    {
        var returnDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()-numberOfDays,
            startDate.getHours(),
            startDate.getMinutes(),
            startDate.getSeconds());
        return returnDate;
    }
    function addDays(startDate,numberOfDays)
    {
        var returnDate = new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate()+numberOfDays,
            startDate.getHours(),
            startDate.getMinutes(),
            startDate.getSeconds());
        return returnDate;
    }
    function daydiff(first, second) {
        return Math.round((second-first)/(1000*60*60*24));
    }
    function dayFromToday(day,next) {
        var daysUS = {'Sunday':0, 'Monday':1, 'Tuesday':2, 'Wednesday':3, 'Thursday':4, 'Friday':5, 'Saturday':6};
        var daysES = {'Domingo':0, 'Lunes':1, 'Martes':2, 'Miercoles':3, 'Jueves':4, 'Viernes':5, 'Sabado':6};
        var vDay=daysES[day]

        if(typeof vDay=='undefined'){
            vDay=daysUS[day]
        }


        var dayList=[];
        dayList.push(new Date())

        for(var i=1;i<=7;i++){
            var newdate;
            if(next=="-"){
                newdate = restDays(dayList[i-1],1);
            }
            if(next=="+"){
                newdate = addDays(dayList[i-1],1);
            }
            if(newdate.getDay()==vDay){
                return newdate;
            }
            dayList.push(newdate);
        }
    }
    return {
        dayFromToday: dayFromToday,
        daydiff: daydiff
    };
})();



app.controller('movimientosPresentados.ctrl',
    function ($scope,$http,Toast,$resource,$filter,$mdEditDialog,Global, $q,MotivosDeRechazo,$mdDialog ) {

        $scope.toolbar={titulo:"Movimientos Presentados",
            form:"movimientosPresentadosFilterForm.tmpl.html",
            entidades:[{entidad:"667",descripcion:"667"},{entidad:"067",descripcion:"067"}],
            query:{fechaHasta:new Date()},
            periodos:{},
            RANGO_FECHAS_NO_VALIDO:"El rango de fechas seleccionado no debe superar los 31 dias.",
            show_download:{tooltip:"Generar Excel"},
            exportar:function(){



                if(typeof  $scope.toolbar.query.entidad !='undefined'){
                    $scope.grillaMovPresentados.config.query.entidad=$scope.toolbar.query.entidad.entidad;
                }

                if(typeof  $scope.toolbar.query.conciliacion !='undefined'){
                    $scope.grillaMovPresentados.config.query.codMovimiento= $scope.toolbar.query.conciliacion.idAgrupamiento;
                }

                $scope.grillaMovPresentados.config.query.fechaDesde=$scope.toolbar.query.fechaDesde;
                $scope.grillaMovPresentados.config.query.fechaHasta=$scope.toolbar.query.fechaHasta;

                var obj=$scope.grillaMovPresentados.config.query;

                var params=   "limit="+ obj.limit;
                params=params+"&page="+ obj.page;
                params=params+"&order="+ obj.order;
                params=params+"&where="+ obj.where;
                params=params+"&export=1";

                params=params+"&entidad="+ obj.entidad;
                params=params+"&codMovimiento="+((obj.codMovimiento==null) ? '' : obj.codMovimiento);

                var vFd=(moment(obj.fechaDesde).utc()._isValid) ? moment(obj.fechaDesde).toJSON() : moment(obj.fechaDesde).toJSON() ;
                var vFh=(moment(obj.fechaHasta).utc()._isValid) ? moment(obj.fechaHasta).toJSON() : moment(obj.fechaHasta).toJSON() ;

                params=params+"&fechaDesde="+vFd.substring(0, 10);
                params=params+"&fechaHasta="+vFh.substring(0, 10);

                return "/api/conciliaciones/movPresentados/export?" +params ;
            },
            onFilter:function(form){
                $scope.toolbar.filtrado = true;
                if(form.$valid){
                  this.filter();
                }
            },
            filter:function(){
                var valid=$scope.toolbar.validDateRange($scope.toolbar.query.fechaDesde, $scope.toolbar.query.fechaHasta)
                if (!valid){
                    Toast.showError($scope.toolbar.RANGO_FECHAS_NO_VALIDO,'Error');
                    return;
                }

                $scope.grillaMovPresentados.config.query.entidad=$scope.toolbar.query.entidad.entidad;
                $scope.grillaMovPresentados.config.query.codMovimiento=$scope.toolbar.query.conciliacion.idAgrupamiento;
                $scope.grillaMovPresentados.config.query.fechaDesde=$scope.toolbar.query.fechaDesde;
                $scope.grillaMovPresentados.config.query.fechaHasta=$scope.toolbar.query.fechaHasta;
                $scope.grillaMovPresentados.config.query.limit=30;
                $scope.grillaMovPresentados.HttpGetFromDB();
            },
            validDateRange:function(desde,hasta){
                var diff=LDate.daydiff(desde, hasta)
                if (diff>31){
                    return false;
                }
                return true;
            }
        };



        $http({url: '/api/AgrupamientosConciliaciones',method: "GET",params: {nombreProceso:'Conci. Movimientos Presentados'} }).then(
            function(res){
                var todos={idAgrupamiento:null, descripcion:"Todos"};
                res.data.unshift(todos);
                $scope.toolbar.query.conciliacion=todos;
                $scope.toolbar.show_filter=true;
                $scope.toolbar.conciliaciones=res.data;
                $scope.toolbar.query.fechaDesde=LDate.dayFromToday("Lunes","-");
                $scope.toolbar.filter();

            } , function(error){
                Toast.showError("Error al obtener datos de la grilla, "+error.data.message,'Error');
            });

        /*
        $scope.$watch('toolbar.query.fechaDesde', function (newValue, oldValue) {
            var valid=$scope.toolbar.validDateRange($scope.toolbar.query.fechaDesde, $scope.toolbar.query.fechaHasta)
            if (!valid){
                $scope.toolbar.query.fechaDesde=oldValue;
                Toast.showError($scope.toolbar.RANGO_FECHAS_NO_VALIDO,'Error');
            }
        });
        $scope.$watch('toolbar.query.fechaHasta', function (newValue, oldValue) {
            var valid=$scope.toolbar.validDateRange($scope.toolbar.query.fechaDesde, $scope.toolbar.query.fechaHasta)
            if (!valid){
                $scope.toolbar.query.fechaHasta=oldValue;
                Toast.showError($scope.toolbar.RANGO_FECHAS_NO_VALIDO,'Error');
            }
        });
        */

        $scope.grillaMovPresentados=new Componentes.Grilla($http,$filter,Toast);
        $scope.grillaMovPresentados.config.url="/api/conciliaciones/movPresentados";
        $scope.grillaMovPresentados.config.columns=GRILLA_MOVIMIENTOS_PRESENTADOS;
        $scope.grillaMovPresentados.data=[];
        $scope.grillaMovPresentados.config.dataFootTable=0;
        $scope.grillaMovPresentados.config.hideComboPagina=true;
        $scope.grillaMovPresentados.config.orderByBD=true;
    });



