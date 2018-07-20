/**
 * Created by marcos.marenna on 29/10/2017.
 */
var CANCELACIONES_COLUMNS=[
    { show: true,   name: 'Nro CIE',        field: 'nroCIE',        tip: '', filter: '', align:'right'},
    { show: true,   name: 'Fecha de Pago',  field: 'fecPago',       tip: '', filter: 'date'},
    { show: true,   name: 'Suc',        field: 'sucursal',        tip: '', filter: 'int'},
    { show: true,   name: 'Establecimiento',      field: 'nroComercio',     tip: '', filter: '', align:'right'},
    { show: true,   name: 'Denominación',         field: 'nombreComercio',        tip: '', width: 300},
    { show: true,   name: 'Nro. Tarjeta',        field: 'nroTarjeta',        tip: '', width: 200},
    { show: true,   name: 'Fec. Origen',        field: 'fecOrigen',        tip: '', filter: 'date'},
    { show: true,   name: 'Expediente',        field: 'nroExpediente',        tip: ''},
    { show: true,   name: 'Comprobante',        field: 'nroCpte',        tip: ''},
    { show: true,   name: 'Importe',        field: 'importe',        tip: '', filter: 'number'},
    { show: true,   name: 'Motivo',        field: 'observaciones',        tip: '', width: 200},

    { show: false,  name: 'idPpVisaCis',    field: 'idPpVisaCis',   tip: ''},
    { show: false,  name: 'Entidad',        field: 'entidad',        tip: ''},
    { show: false,  name: 'creadoPor',      field: 'creadoPor',     tip: ''},
    { show: false,  name: 'fecCreacion',  field: 'fecCreacion',       tip: '', filter: 'date'},
    { show: false,  name: 'modificadoPor',      field: 'modificadoPor',     tip: ''},
    { show: false,  name: 'fecModificacion',  field: 'fecModificacion',       tip: '', filter: 'date'}
];
app.filter('filterFieldsStartBy', function(){
    return function(dataArray, searchTerm,columns) {
        if (!dataArray)
            return;
        if (!searchTerm)
            return dataArray;
        else {
            if (typeof searchTerm == 'undefined')
                return dataArray;
            var term = searchTerm.toLowerCase();
            return dataArray.filter(function(item){
                var res=0;
                for (var i = 0; i < columns.length; i++) {
                    if(typeof item[columns[i]]!='undefined' && item[columns[i]]!=null){
                        res =res +item[columns[i]].toLowerCase().indexOf(term.toLowerCase()) ===0;
                        if(res)
                            break;
                    }
                }
                return res;
            });
        }
    }
});

var CancelacionesControl=function($scope,$resource,$filter,$mdEditDialog,Global,$q,Cancelaciones,$mdToast,$mdDialog, $http){
    var _this=this;
    var url='/api/cancelaciones';
    this.operac="";
    this.getData=function() {
        $scope.gillaBusqueda.HttpGet(function(res){ if (res.data.length>1) $scope.gillaBusqueda.data=res.data; });
    };


    //Obtener los procesos para el combo
    //Lo obtengo ahora porque luego demora para la carga
    $scope.promiseDigitador = $resource('/api/procesos/procesosTraerTodos').query(successProcesos).$promise;
    function successProcesos(data) {
        $scope.procesos = data;
    }
    $scope.acciones = ['Eliminar', 'Guardar'];


    this.selectCheckbox=function(index, row){
        $scope.cancelaciones.model = {};
        if(row.selected==true)
            $scope.cancelaciones.selected.push(row);
        else
            $scope.cancelaciones.selected.splice($scope.cancelaciones.selected.indexOf(row), 1);

        if ($scope.cancelaciones.selected.length == 1) {
            $scope.cancelaciones.puedeModificar = ($scope.cancelaciones.selected[0].fecBaja == null || $scope.cancelaciones.selected[0].fecBaja >= new Date());
            for (var propiedad in row) { $scope.cancelaciones.model[propiedad] = row[propiedad]; }
        }
        else
            $scope.cancelaciones.puedeModificar = false;
    };
    this.openUpdateForm=function(){
        $scope.operac="Modificar";
        for (var propiedad in $scope.cancelaciones.selected[0]) { $scope.cancelaciones.model[propiedad] = $scope.cancelaciones.selected[0][propiedad]; }
        $scope.cancelaciones.model.fecPago = moment($scope.cancelaciones.model.fecPago)._d;
        $scope.cancelaciones.model.fecOrigen = moment($scope.cancelaciones.model.fecOrigen)._d;
        this.submit=this.update;
        _this.dialogShow();
    };
    this.openDeleteForm=function(){
        $scope.operac="Baja";
        this.submit=this.delete;
        _this.dialogShowDelete();
    };
    this.openAddForm=function(){
        $scope.operac="Alta";
        this.submit=this.insert;
        $scope.cancelaciones.model={
            idPpVisaCis: null
        };
        _this.dialogShow();
    };
    this.dialogShow=function(){
        $mdDialog.show({
            clickOutsideToClose: true,
            controller: _this.modalController,
            controllerAs: 'ctrl',
            focusOnOpen: false,
            targetEvent: event,
            locals: { ParentScope: $scope },
            templateUrl: 'app.views/cancelaciones/popUp.html'
        }).then(function () {});
    };

    this.modalController=function ($scope, $mdDialog,ParentScope) {
        console.log("modalController ParentScope",ParentScope );
        $scope.ParentScope = ParentScope;

        $scope.cancelaciones = {};
        $scope.cancelaciones.query = $scope.ParentScope.cancelaciones.query;
        $scope.cancelaciones.selected = $scope.ParentScope.cancelaciones.selected;

        $scope.cancelaciones.model = $scope.ParentScope.cancelaciones.model;
        $scope.cancelaciones.codigoExistente = 0;
        $scope.cancelaciones.SignoInvalido = false;
        $scope.currentDate = new Date();
        console.log($scope.cancelaciones.model);

        $scope.proceso={};

        $scope.test=function(){
            var x = document.getElementById("ProcesoTipo");
            x.className = "ng-dirty ng-pristine ng-empty ng-invalid ng-invalid-required ng-touched";
        };

        $scope.cancel = function() {
            /*
             if(!$scope.ParentScope.cancelaciones.model)
             $scope.ParentScope.cancelaciones.model.fecBaja=null;
             */
            $mdDialog.cancel();
        };

    };

    //Funciones de validación de formulario ABM
    this.ValidarDuplicidad = function(data){
        if(typeof data == 'undefined')
            return;
        var req = {
            idPpVisaCis: null,
            nroCpte: data.model.nroCpte,
            nroCIE: data.model.nroCIE
        };
        $resource(url+".ControlDuplicado").query(req,
            function success(res) {
                data.codigoExistente = res.length;
            },_this.error);
    };

    $scope.cancelaciones.selected=[];
    this.insert=function(form,data){
        if (form.$valid && data.codigoExistente==0) {
            if (data.cuentaObligatoria && (!data.model.cuenta || data.model.cuenta.trim() == ''))
                return;
            data.model.usuario= Global.currentUser.name;
            Cancelaciones.save(data.model, _this.ok,_this.error);
        }
    };
    /*
    this.update=function (form,data){
        if (form.$valid && data.codigoExistente==0) {
            data.model.usuario = Global.currentUser.name;
            Cancelaciones.update({ idPpVisaCis: data.model.idPpVisaCis },data.model,_this.ok,_this.error);
        }
    }
    */

    this.ok=function(res){
        console.log('this.ok');
        console.log(res);
        _this.showToastSuccess();
        _this.getData();
        $mdDialog.hide();
    };

    this.error=function(err){
        if(typeof err.data.message=='undefined'){
            _this.showToast("Error",err.statusText);
        }else{
            _this.showToast("Error",err.data.message);
        }
    };
    this.submit=function(){
        console.log("Submit")
    };

    this.onReorder=function(order) {
        var reverse= (order[0]=='-');
        if(order[0]=='-'){
            order=order.replace("-","")
        }
        $scope.cancelaciones.data =$filter('orderBy')($scope.cancelaciones.data , order,reverse);
    };

    this.removeFilter=function () {
        $scope.cancelaciones.filter.show = true;
        $scope.cancelaciones.query.filter = '';
        if(typeof $scope.cancelaciones.formFilter!='undefined'){
            if ($scope.cancelaciones.formFilter.$dirty) {
                $scope.cancelaciones.formFilter.$setPristine();
            }
        }
    };

    this.showVal = function(value, filter) {
        if(value==null || typeof value=='undefined'){
            return "";
        }
        if (filter == 'date')
            return (moment(value).utc()._isValid) ? moment(value).local().format('DD/MM/YYYY') : value;

        if (filter == 'jsondate'){

            if (value!=null){
                var fecha=value.replace("Z"," ").replace("T"," ");
                return moment(fecha).local().format('DD/MM/YYYY');
            }
            return null
        }
        if (filter == 'number'){
            return formatNumber(parseFloat(value),",",".");
        }
        if (filter == 'int'){
            return $filter('number')(value, 0); //$filter('number')(value, 2);
        }
        if (filter == 'currency'){
            return $filter('number')(value, 2);
        }
        if (filter == 'coef'){
            return $filter('number')(value, 4);
        }
        return value;
    };

    this.showToastSuccess = function() {
        _this.showToast('toastSuccess','La operación se realizó correctamente.');
    };

    this.showToast = function(type, msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast ' + type +'">' + msg + '</md-toast>',
            hideDelay: 3000,
            parent: '#toastSelect',
            position: 'top left'
        });
    };
};


app.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if(reverse) filtered.reverse();
        return filtered;
    };
});


app.controller('cancelaciones.ctrl',
    function ($scope,$resource,$filter,$mdEditDialog,Global,$q, Cancelaciones,$mdToast,$mdDialog, $http, Toast) {
        $scope.cancelaciones={};
        $scope.grid = {
            selected: [],
            data: [],
            query: {
                page: 1,
                limit: 10,
                order: 'digitador',
                showDeleted: false,
                search: false,
                searchText: ''
            },
            count: 0
        };

        $scope.cancelaciones= {
            "selected": [],
            "columns": CANCELACIONES_COLUMNS,
            "data": [],
            "count": 0,
            "filter": {
                show: true,
                options: {
                    debounce: 500
                }
            },
            "query": {
                filter: {
                },
                limit: '5',
                order: 'proceso',
                page: 1
            }
        };

        $scope.config=new CancelacionesControl($scope,$resource,$filter,$mdEditDialog,Global,$q, Cancelaciones,$mdToast,$mdDialog, $http, Toast);
        $scope.dataLoad = {
            cancelaciones: []
        };
        var minDate=new Date();
        var day   = minDate.getDate();
        var month   = minDate.getMonth();
        var year    = minDate.getFullYear();
        $scope.minFecBaja=new Date(year, month, day);


        function callback_gillaBusqueda(res){
            if (res.data.length>1)
                $scope.gillaBusqueda.data=res.data;
        }

        $scope.gillaBusqueda=new Componentes.Grilla($http,$filter,Toast);
        $scope.gillaBusqueda.config.url="/api/cancelaciones";
        $scope.gillaBusqueda.config.columns=CANCELACIONES_COLUMNS;
        $scope.gillaBusqueda.config.orderByBD=false;
        $scope.gillaBusqueda.config.dataFootTable=0;
        $scope.gillaBusqueda.config.search=true;

        //cancelaciones.query.filter.value
        $scope.gillaBusqueda.filtering = function (element) {
            return (!$scope.cancelaciones.query.filter.value || ($scope.cancelaciones.query.filter.value && (
                element.nroCIE.toString().toLowerCase().indexOf($scope.cancelaciones.query.filter.value) > -1 ||
                element.nroTarjeta.toLowerCase().indexOf($scope.cancelaciones.query.filter.value) > -1 ||
                element.nroExpediente.toLowerCase().indexOf($scope.cancelaciones.query.filter.value) > -1 ||
                element.nroComercio.toLowerCase().indexOf($scope.cancelaciones.query.filter.value) > -1)));
        }
        $scope.gillaBusqueda.HttpGet(callback_gillaBusqueda);

        $scope.resetPage = function () {
            $scope.grid.query.page = 1;
        };

        $scope.filtering = function (element) {
            return true;
        };

    });