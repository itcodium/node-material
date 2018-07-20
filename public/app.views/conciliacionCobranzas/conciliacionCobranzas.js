var GRILLA_CONCILIACION_COBRANZAS = [
    { name: 'Fec Valor' ,show: true,  field: 'FecValor',filter:"jsondate"   , tip: 'left'},
    { name: 'Suc'       ,show: true,  field: 'Suc'      ,filter:""   , tip: '', align:''},
    { name: 'Nombre'    ,show: true,  field: 'Nombre'   ,filter:""   , tip: '', align:''},
    { name: 'Cta.Conta' ,show: true,  field: 'CtaConta',filter:""   , tip: '', align:''},
    { name: 'Débito'    ,show: true,  field: 'Debito'   ,filter:"number"   , tip: '', align:''},
    { name: 'Crédito'   ,show: true,  field: 'Credito'  ,filter:"number", tip: '', align:''},
    { name: 'Neto'      ,show: true,  field: 'Neto'     ,filter:"number", tip: '', align:''},
    { name: 'Total ATC' ,show: true,  field: 'TotalATC',filter:"number", tip: '', align:''},
    { name: 'Dif'       ,show: true,  field: 'Dif'      ,filter:"number"   , tip: '', align:''},
    { name: 'Moneda'    ,show: true,  field: 'Moneda'   ,filter:"int", tip: '', align:''}
];



var GRILLA_CONCILIACION_COBRANZAS_DOLAR = [
    { name: 'Fec Valor' ,show: true,  field: 'FecValor' ,filter:"jsondate"   , tip: 'left'},
    { name: 'Suc'       ,show: true,  field: 'Suc'      ,filter:""   , tip: '', align:''},
    { name: 'Nombre'    ,show: true,  field: 'Nombre'   ,filter:""   , tip: '', align:''},
    { name: 'Cta.Conta' ,show: true,  field: 'CtaConta' ,filter:""   , tip: '', align:''},
    { name: 'Débito'    ,show: true,  field: 'Debito'   ,filter:"number"   , tip: '', align:''},
    { name: 'Crédito'   ,show: true,  field: 'Credito'  ,filter:"number", tip: '', align:''},
    { name: 'Neto'      ,show: true,  field: 'Neto'     ,filter:"number", tip: '', align:''},
    { name: 'Total ATC' ,show: true,  field: 'TotalATC',filter:"number", tip: '', align:''},

    { name: 'Dif'       ,show: true,  field: 'Dif'      ,filter:"number"   , tip: '', align:''},
    { name: 'DifPes'    ,show: true,  field: 'DifPes'   ,filter:"number"   , tip: '', align:''},
    { name: 'Moneda'    ,show: true,  field: 'Moneda'   ,filter:"int", tip: '', align:''}
];


app.controller('conciliacionCobranzas.ctrl',
    function ($scope,$http,Toast,$resource,$filter,$mdEditDialog,Global, $q,$mdDialog ) {

        $scope.proceso='Conci. Conciliacion Cobranzas'

        $scope.toolbar_pesos={titulo:"Grilla Pesos",
            show_filter:false,
            show_download:{tooltip:"Generar Excel Diferencia $"},
            form:"entesExternosFilterForm.tmpl.html",
            entes:[{entes:"667",descripcion:"667"},{entes:"067",descripcion:"067"}],
            query:{fechaHasta:new Date()},
            periodos:{},
            RANGO_FECHAS_NO_VALIDO:"El rango de fechas seleccionado no debe superar los 31 dias.",
           exportar:function(){
               /*   if(typeof  $scope.toolbar.query.entes !='undefined'){
               //      $scope.grillaEntExternos.config.query.entes=$scope.toolbar.query.ente.ente;
                 }
                 if(typeof  $scope.toolbar.query.conciliacion !='undefined'){
                     $scope.grillaEntExternos.config.query.codMovimiento= $scope.toolbar.query.conciliacion.idAgrupamiento;
                 }
                 $scope.grillaEntExternos.config.query.fechaDesde=$scope.toolbar.query.fechaDesde;
                 $scope.grillaEntExternos.config.query.fechaHasta=$scope.toolbar.query.fechaHasta;

                 var obj=$scope.grillaEntExternos.config.query;
                 var params=   "limit="+ obj.limit;
                 params=params+"&page="+ obj.page;
                 params=params+"&order="+ obj.order;
                 params=params+"&where="+ obj.where;
                 params=params+"&export=1";
                 params=params+"&entes="+ obj.entes;
                 params=params+"&codMovimiento="+((obj.codMovimiento==null) ? '' : obj.codMovimiento);

                 var vFd=(moment(obj.fechaDesde).utc()._isValid) ? moment(obj.fechaDesde).toJSON() : moment(obj.fechaDesde).toJSON() ;
                 var vFh=(moment(obj.fechaHasta).utc()._isValid) ? moment(obj.fechaHasta).toJSON() : moment(obj.fechaHasta).toJSON() ;

                 params=params+"&fechaDesde="+vFd.substring(0, 10);
                 params=params+"&fechaHasta="+vFh.substring(0, 10);
                */
                 return "/api/conciliacionCobranzas/export?moneda=pesos&exportar=1" ;

             },
            onFilter:function(form){
                $scope.toolbar_pesos.filtrado = true;
                if(form.$valid){
                    this.filter();
                }
            },
            filter:function(){
                /*
                $scope.grillaEntExternos.config.query.ente=$scope.toolbar.query.ente.ente;
                $scope.grillaEntExternos.config.query.codMovimiento=$scope.toolbar.query.conciliacion.idAgrupamiento;
                $scope.grillaEntExternos.config.query.fechaDesde=$scope.toolbar.query.fechaDesde;
                $scope.grillaEntExternos.config.query.fechaHasta=$scope.toolbar.query.fechaHasta;
                $scope.grillaEntExternos.config.query.limit=30;
                */

            }
        };

        $scope.toolbar_dolares={titulo:"Grilla Dolares",
            form:"entesExternosFilterForm2.tmpl.html",
            entes:[{entes:"667",descripcion:"667"},{entes:"067",descripcion:"067"}],
            query:{fechaHasta:new Date()},
            periodos:{},
            show_filter:false,
            show_download:{tooltip:"Generar Excel Diferencia U$D"},
            RANGO_FECHAS_NO_VALIDO:"El rango de fechas seleccionado no debe superar los 31 dias.",
            exportar:function(){
                return "/api/conciliacionCobranzas/export?moneda=Dolares&exportar=1" ;
            },
            onFilter:function(form){
                $scope.toolbar.filtrado = true;
                if(form.$valid){
                    this.filter();
                }
            },
            filter:function(){}
        };
/*
        $http({url: '/api/entesExternos',method: "GET",params: {nombreProceso:'Entes Externos'} }).then(
            function(res){
                var todos={idAgrupamiento:null, descripcion:"Todos"};
                res.data.unshift(todos);
                $scope.toolbar.query.conciliacion=todos;
                $scope.toolbar.conciliaciones=res.data;
                $scope.toolbar.query.fechaDesde=LDate.dayFromToday("Lunes","-");
                $scope.toolbar.filter();

            } , function(error){
                Toast.showError("Error al obtener datos de la grilla, "+error.data.message,'Error');
            });
*/
        $scope.grillaPesos=new Componentes.Grilla($http,$filter,Toast);
        $scope.grillaPesos.config.url="/api/conciliacionCobranzas?moneda=PESOS&exportar=0";
        $scope.grillaPesos.config.columns=GRILLA_CONCILIACION_COBRANZAS;
        $scope.grillaPesos.config.query.limit=10;
        $scope.grillaPesos.data=[];
        $scope.grillaPesos.config.dataFootTable=1;
        $scope.grillaPesos.config.hideComboPagina=true;
        $scope.grillaPesos.config.orderByBD=false;
        $scope.grillaPesos.HttpGet();

        $scope.grillaDolares=new Componentes.Grilla($http,$filter,Toast);
        $scope.grillaDolares.config.url="/api/conciliacionCobranzas?moneda=DOLARES&exportar=0";
        $scope.grillaDolares.config.columns=GRILLA_CONCILIACION_COBRANZAS_DOLAR;
        $scope.grillaDolares.config.query.limit=10;
        $scope.grillaDolares.data=[];
        $scope.grillaDolares.config.dataFootTable=1;
        $scope.grillaDolares.config.hideComboPagina=true;
        $scope.grillaDolares.config.ordDolareserByBD=false;
        $scope.grillaDolares.HttpGet();

    });


