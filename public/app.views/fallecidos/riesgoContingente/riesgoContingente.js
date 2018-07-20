var COLUMNS_LLAMADA_RIEGO_CONTINGENTE_POR_DIA= [
    { name: 'Fecha',show: true,  field: 'Fecha',filter:"", tip: ''},
    { name: 'Recuperado',show: true,  field: 'Recuperado',filter:"number", tip: '', align:''},
    { name: 'Cantidad',show: true,  field: 'CantRecuperado',filter:"int", tip: '', align:''},
    { name: 'Analizado',show: true,  field: 'Analizado',filter:"number", tip: '', align:''},
    { name: 'Cantidad',show: true,  field: 'CantAnalizado',filter:"int", tip: '', align:''},
    { name: 'Total',show: true,  field: 'Total',filter:"number", tip: '', align:''},
    { name: 'Cantidad Total',show: true,  field: 'Cantidad Total',filter:"int", tip: '', align:''}
]

/*
 var COLUMNS_LLAMADA_RIEGO_CONTINGENTE_POR_DIA= [
 { name: 'Fecha',show: true,  field: 'Fecha',filter:"date", tip: ''},
 { name: 'Recuperado',show: true,  field: 'Recuperado',filter:"", tip: '', align:'right'},
 { name: 'Cantidad',show: true,  field: 'CantRecuperado',filter:"", tip: '', align:'right'},
 { name: 'Analizado',show: true,  field: 'Analizado',filter:"number", tip: '', align:'right'},
 { name: 'Cantidad',show: true,  field: 'CantAnalizado',filter:"", tip: '', align:'right'},
 { name: 'Total',show: true,  field: 'Total',filter:"number", tip: '', align:'right'},
 { name: 'Cantidad Total',show: true,  field: 'Cantidad Total',filter:"", tip: '', align:'right'}
 ]
 */

var RIESGO_CONTINGENTE_TRAER_POR_REGION= [
    // { name: 'Código',show: true,  filter: '',field:"codigo", tip: ''},
    { name: 'Región',show: true,  filter: '',field:"region", tip: ''},
    { name: 'Cantidad Recuperar',show: true,  field:  'cantidad recuperar',filter:"int", tip: '', align:'right'},
    { name: 'Importe Recuperar',show: true,  field: 'importe recuperar',filter:"number", tip: '', align:'right'},
    { name: '% Recuperar',show: true,  field: '% recuperar',filter:"number", tip: '', align:'right'},
    { name: 'Cantidad Analizar',show: true,  field: 'cantidad analizar',filter:"int", tip: '', align:'right'},
    { name: 'Importe Analizar',show: true,  field: 'importe analizar',filter:"number", tip: '', align:'right'},
    { name: '% Analizar',show: true,  field: '% analizar',filter:"number", tip: '', align:'right'},
    { name: 'Importe Total',show: true,  field: 'importe total',filter:"number",type:'', tip: '', align:'right'},
    { name: '% Total',show: true,  field: '% total',filter:"number",type:'', tip: '', align:'right'}
]

var BCO_RECUPERADO= [
    {field:"Grupo",name: 'Grupo',show: true,   tip: '',filter: ''},
    {field:"CUIL",name: 'CUIL',show: true,   tip: '',filter: ''},
    {field:"denominacionCuenta",name: 'Denominación Cuenta',show: true,   tip: '',filter: ''},
    {field:"estadoCuenta",name: 'Estado Cuenta',show: true,   tip: '',filter: ''},
    {field:"fecFallecimiento",name: 'Fec Fallecimiento',show: true,   tip: '',filter: 'date'},
    {field:"periodoLiquidacion",name: 'Periodo Liquidación',show: true,   tip: '',filter: 'date'},
    {field:"periodoPago",name: 'Periodo Pago',show: true,   tip: '',filter: 'date'},
    {field:"nroCarga",name: 'Nro Carga',show: true,   tip: '',filter: ''},
    {field:"archivo",name: 'Archivo',show: true,   tip: '',filter: ''},
    {field:"EstadoFallecido",name: 'Estado Fallecido',show: true,   tip: '',filter: ''},
    {field:"Motivo",name: 'Motivo',show: true,   tip: '',filter: ''},
    {field:"CPP",name: 'CPP',show: true,   tip: '',filter: ''},
    {field:"nroBeneficio",name: 'Nro Beneficio',show: true,   tip: '',filter: ''},
    {field:"nomyApellido",name: 'Nom y Apellido',show: true,   tip: '',filter: ''},
    {field:"disponibleCuenta",name: 'Disponible Cuenta',show: true,   tip: '',filter: 'number'},
    {field:"saldoCuenta",name: 'Saldo Cuenta',show: true,   tip: '',filter: 'number'},
    {field:"importeLiquido",name: 'Importe Liquido',show: true,   tip: '',filter: 'number'},
    {field:"nroCuenta",name: 'Nro Cuenta',show: true,   tip: '',filter: ''},
    {field:"debitosAsociados",name: 'Débitos Asociados',show: true,   tip: '',filter: 'number'},
    {field:"causal304",name: 'Causal 304',show: true,   tip: '',filter: ''},
    {field:"SucRadica",name: 'Suc Radica',show: true,   tip: '',filter: ''}
]

app.controller('riesgoContingente.ctrl',function ($scope,$http,$filter,Toast, $resource) {

    var test=$filter('number')(23101909.5, 2);
    var nro=test.split(",");
    console.log("test",test,typeof  test);

    $scope.tipos = [
        {
            codigo: 'RC',
            descripcion: 'Riesgo Contingente',
            estado : 'Riesgo Contingente'
        },
        {
            codigo: 'TBRECUP',
            descripcion: 'T - BCO - RECUP',
            estado : 'A Recuperar'
        },
        {
            codigo: 'TBRIESGO',
            descripcion: 'T - BCO - RIESGO',
            estado : 'A Analizar'
        },
        {
            codigo: 'NIG',
            descripcion: 'NO INFORMAR A GESTIVA',
            estado : 'NO ENVIAR A GESTIVA'
        }
    ];
    $scope.solapa = 'RC';
    $scope.query={};
    $scope.query.periodo = {};
    $scope.query.periodo.periodo = '';
    $scope.url_periodos="/api/fallecidos/riesgoContingentePeriodos";
    $http({url: $scope.url_periodos,method: "GET"}).then(
        function(data){
            $scope.periodos=data.data[0];
            if($scope.periodos.length>0){
                $scope.query.periodo=$scope.periodos[0];
                $scope.changeParam();
            }
        },function(error){
            Toast.showError(error.data.message,'Error');
        });

    $scope.changeParam=function (){
        //Primer solapa
        $scope.grillaPorDia.config.query.periodo=$scope.query.periodo;
        $scope.grillaPorDia.config.query.limit=31;
        $scope.grillaPorDia.HttpGet(callback_grillaPorDia);
        $scope.grillaPorRegion.config.query.periodo=$scope.query.periodo;
        $scope.grillaPorRegion.config.query.limit=10000;
        $scope.grillaPorRegion.HttpGet(callback_grillaPorRegion);

        //segunda solapa
        $scope.grillaBcoRecuperado.config.query.periodo=$scope.query.periodo;
        $scope.grillaBcoRecuperado.config.query.limit=50;
        $scope.grillaBcoRecuperado.config.query.estado='A RECUPERAR';
        $scope.grillaBcoRecuperado.HttpGet();
        //tercera solapa
        $scope.grillaBcoRiesgo.config.query.periodo=$scope.query.periodo;
        $scope.grillaBcoRiesgo.config.query.estado='A ANALIZAR';
        $scope.grillaBcoRiesgo.config.query.limit=50;
        $scope.grillaBcoRiesgo.HttpGet();
        //cuarta solapa
        $scope.grillaNoInformarAGestiva.config.query.periodo=$scope.query.periodo;
        $scope.grillaNoInformarAGestiva.config.query.estado = 'NO ENVIAR A GESTIVA';
        $scope.grillaNoInformarAGestiva.config.query.limit=50;
        $scope.grillaNoInformarAGestiva.HttpGet();
    }

    $scope.exportarAExcel = function () { return '/api/fallecidos/generarExcelRiesgoContingente?periodo=' + $scope.query.periodo.periodo; }


    onReorder = function(order) {
        var reverse=order[0]=='-'?true:false;
        if(order[0]=='-'){
            order=order.replace("-","")
        }
        $scope.grillaPorDia.data =$filter('orderBy')($scope.grillaPorDia.data , order,reverse);
    }

    function callback_grillaPorDia(res){
        if (res.data.length>1){
            /*
             $scope.grillaPorDia.onReorder = function(order) {
             debugger
             var reverse=order[0]=='-'?true:false;
             if(order[0]=='-'){
             order=order.replace("-","")
             }
             $scope.grillaPorDia.data =$filter('orderBy')($scope.grillaPorDia.data , order,reverse);
             };*/

            console.log("res.data", res.data)
            $scope.grillaPorDia.data=res.data[0];
            $scope.grillaPorDia.footData=res.data[1];
        }
    }


    function callback_grillaPorRegion(res){
        if (res.data.length==2){
            $scope.grillaPorRegion.data=res.data[0];
            $scope.grillaPorRegion.footData=res.data[1];
        }else if (res.data.length==3){
            $scope.grillaPorRegion.data=res.data[0];
            $scope.grillaPorRegion.footData=res.data[1];
            for ( let i in res.data[2]){
                for ( let z in res.data[2][i]){
                    Toast.showError(res.data[2][i][z],"Warning");
                }
            }
        }
    }

    function callback_grillaBcoRecuperado(res){
        console.log("callback_grillaBcoRecuperado res",res.data[0])
        $scope.grillaBcoRecuperado.data=res.data[0];
        $scope.grillaBcoRecuperado.footData=res.data[1];
    }

    $scope.actualizarDatos=function(){}

    $scope.grillaPorDia=new Componentes.Grilla($http,$filter,Toast);
    $scope.grillaPorDia.config.url="/api/fallecidos/riesgoContingentePorDia"; //
    $scope.grillaPorDia.config.columns=COLUMNS_LLAMADA_RIEGO_CONTINGENTE_POR_DIA;
    $scope.grillaPorDia.config.orderByBD=false;
    $scope.grillaPorDia.config.dataFootTable=1;

    $scope.grillaPorRegion=new Componentes.Grilla($http,$filter,Toast);
    $scope.grillaPorRegion.config.url="/api/fallecidos/riesgoContingentePorRegion"; //
    $scope.grillaPorRegion.config.columns=RIESGO_CONTINGENTE_TRAER_POR_REGION;
    $scope.grillaPorRegion.config.orderByBD=false;
    $scope.grillaPorRegion.config.dataFootTable=1;

    $scope.grillaBcoRecuperado=new Componentes.Grilla($http,$filter,Toast);
    $scope.grillaBcoRecuperado.config.url="/api/fallecidos/riesgoContingentePorDetalle"; //
    $scope.grillaBcoRecuperado.config.columns=BCO_RECUPERADO;
    $scope.grillaBcoRecuperado.config.orderByBD=true;
    $scope.grillaBcoRecuperado.config.hideComboPagina=true;
    $scope.grillaBcoRecuperado.config.dataFootTable=1;

    $scope.grillaBcoRiesgo=new Componentes.Grilla($http,$filter,Toast);
    $scope.grillaBcoRiesgo.config.url="/api/fallecidos/riesgoContingentePorDetalle"; //
    $scope.grillaBcoRiesgo.config.columns=BCO_RECUPERADO;
    $scope.grillaBcoRiesgo.config.orderByBD=true;
    $scope.grillaBcoRiesgo.config.hideComboPagina=true;
    $scope.grillaBcoRiesgo.config.dataFootTable=1;

    $scope.grillaNoInformarAGestiva=new Componentes.Grilla($http,$filter,Toast);
    $scope.grillaNoInformarAGestiva.config.url="/api/fallecidos/riesgoContingentePorDetalle"; //
    $scope.grillaNoInformarAGestiva.config.columns=BCO_RECUPERADO;
    $scope.grillaNoInformarAGestiva.config.orderByBD=false;
    $scope.grillaNoInformarAGestiva.config.dataFootTable=1;
    $scope.grillaNoInformarAGestiva.config.hideComboPagina=true;
});
