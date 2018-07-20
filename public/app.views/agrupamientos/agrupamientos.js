var AGRUPAMIENTOS_COLUMNS=[
    { id: 11, show: false, name: 'idcmpAgrupamiento', field: 'idcmpAgrupamiento', tip: ''},
    { id: 13, show: true, name: 'Código',       field: 'codMovimiento',        tip: ''},
    { id: 14, show: true, name: 'Descripción',  field: 'descripcion',   tip: ''},
    { id: 15, show: true, name: 'Agrupamiento',   field: 'descripcionAgrupador',    tip: ''},
    { id: 12, show: true,name: 'Signo Inventario',         field: 'signoInventario',          tip: ''},
    { id: 15, show: true, name: 'Fecha de baja',field: 'fecBaja', filter: 'date',      tip: ''},
]
var AGRUPAMIENTOS_COLUMNSCFR=[
    { id: 13, show: true, name: 'Cuenta',       field: 'cuenta',        tip: ''},
    { id: 14, show: true, name: 'Descripción',  field: 'descripcion',   tip: ''},
    { id: 11, show: true, name: 'Digitador', field: 'digitador', tip: ''},
    { id: 15, show: true, name: 'Agrupamiento',   field: 'descripcionAgrupador',    tip: ''},
    { id: 15, show: true, name: 'Fecha de baja',field: 'fecBaja', filter: 'date',       tip: ''},
]
app.filter('filterFieldsStartBy', function(){
    return function(dataArray, searchTerm,columns) {
        if (!dataArray) {
            return;
        }
        if (!searchTerm) {
            return dataArray;
        }
        else {
            if (typeof searchTerm == 'undefined') {
                return dataArray;
            }

            var term = searchTerm.toLowerCase();
            return dataArray.filter(function(item){
                var res=0;
                for (var i = 0; i < columns.length; i++) {
                    if(typeof item[columns[i]]!='undefined' && item[columns[i]]!=null){
                        res =res +item[columns[i]].toLowerCase().indexOf(term.toLowerCase()) ===0;
                        if(res){
                            break;
                        }
                    }
                }
                return res;
            });
        }
    }
});

var AgrupamientosControl=function($scope,$resource,$filter,$mdEditDialog,Global,$q,Agrupamientos,$mdToast,$mdDialog){
    var _this=this;
    var url='/api/Agrupamientos';
    this.operac="";
    this.getData=function() {
        function getFecha(data){
            if (data!=null){
                var fecha=data.replace("Z"," ").replace("T"," ");
                return new Date(fecha);
            }
            return null
        }

        $scope.agrupamientos.selected=[];
        $scope.agrupamientos.selectedCFR=[];
        $scope.agrupamientos.puedeModificar = false;
        var _this=this;
        var deferred = $q.defer();
        $scope.promiseAgrupamientos = deferred.promise;
        $scope.promiseAgrupamientosCFR = deferred.promise;
        $resource(url).query(
            {
                tipo:'CMP',
                dadosBaja: 0,
                Cuenta: '',
                Descripcion: '',
                Digitador:'',
                Agrupador: ''
            },
            function success(data) {
                angular.forEach(data, function (item) {
                    item["fecBaja"]=getFecha(item["fecBaja"]);
                });
                $scope.agrupamientos.data = data;
                deferred.resolve();
            },
            function error(err) {
                _this.showToast('error', err.data.message);
                $scope.agrupamientos.data={};
                deferred.resolve();
            }
        );
    }

    this.openUpdateForm=function(){
        $scope.operac="Modificar";
        this.submit=this.update;
        _this.dialogShow()
    }
    this.openDeleteForm=function(){
        $scope.operac="Baja";
        this.submit=this.delete;
        _this.dialogShow()
    }
    this.openAddForm=function(){
        $scope.operac="Alta";
        this.submit=this.insert;
        $scope.agrupamientos.model={};
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
            templateUrl: 'app.views/agrupamientos/add.html'
        }).then(function () {});
    }

    this.modalController=function ($scope, $mdDialog,ParentScope) {
        $scope.ParentScope = ParentScope;
        $scope.agrupamientos = {};
        $scope.agrupamientos.model = $scope.ParentScope.agrupamientos.model;
        $scope.agrupamientos.codigoExistente = 0;
        $scope.agrupamientos.signoInvalido = false;
        $scope.agrupamientos.agrupadorInvalido = false;
        if ($scope.agrupamientos.model.signoInventario)
            $scope.agrupamientos.signoInvalido = !($scope.agrupamientos.model.signoInventario == '' || $scope.agrupamientos.model.signoInventario == '-1' || $scope.agrupamientos.model.signoInventario == '0' || $scope.agrupamientos.model.signoInventario == '1');
        $scope.agrupadoresList = $scope.ParentScope.agrupadoresList;
        console.log($scope.agrupamientos.model);

        $scope.loadLocalidad = function(){
            if($scope.localidadElegida.length > 1)
            {
                $scope.showErrorToastSucursal('error','Solo puede seleccionar una localidad.');
            }else if(typeof $scope.localidadElegida[0].idLocalidad != 'undefined') {
                $scope.sucursal.idLocalidad = $scope.localidadElegida[0].idLocalidad;
                $scope.sucursal.descripcionLocalidad = $scope.localidadElegida[0].descripcion;
                $scope.closeNav();
            }else{
                $scope.showErrorToastSucursal('error','Debe seleccionar al menos una localidad.');
            }
        };

        $scope.newState=function (agrupador) {
            alert("Sorry! You'll need to create a Constituion for " + state + " first!");
        }

        $scope.init=function () {
        }

        $scope.searchTextChange   =function (text) {
            //console.log("searchTextChange",text);
        }

        $scope.selectedItemChange = function (item, data, searchText) {
            if (item) {
                data.model.idAgrupamiento = item.idAgrupamiento;
                data.agrupadorInvalido = false;
            }
            else {
                data.model.idAgrupamiento = null;
                data.agrupadorInvalido = (searchText != '');
            }
        }

        $scope.querySearch= function (query) {
            var results = query ? $scope.agrupadoresList.filter( $scope.filter(query) ) : $scope.agrupadoresList;
            return results;
        }

        $scope.filter =function (query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(agrupadoresList) {
                return (agrupadoresList.descripcion.toLowerCase().indexOf(lowercaseQuery) === 0);
            };
        }

        $scope.proceso={};

        $scope.test=function(){
            var x = document.getElementById("ProcesoTipo");
            x.className = "ng-dirty ng-pristine ng-empty ng-invalid ng-invalid-required ng-touched";
        }

        $scope.cancel = function() {
            if(!$scope.ParentScope.agrupamientos.model){
                $scope.ParentScope.agrupamientos.model.fecBaja=null;
            }
            $mdDialog.cancel();
        };
        if ($scope.agrupamientos.model.descripcionAgrupador) {
            //$scope.init($scope.querySearch($scope.agrupamientos.model.descripcionAgrupador)[0]);
            $scope.selectedItem = $scope.querySearch($scope.agrupamientos.model.descripcionAgrupador)[0];
        }
    }

    this.ValidarSigno = function(data){
        if(typeof data == 'undefined'){
            return;
        }
        if (data == '' || data == '-1' || data == '0' || data == '1') {
            return;
        }
        else {
            return
        }
    }
    this.ValidarCodigo = function(data){
        if(typeof data == 'undefined')
            return;
        if(typeof data.model.codMovimiento == 'undefined')
            data.codigoInvalido = false;
        else
        data.codigoInvalido = isNaN(data.model.codMovimiento);
        if (!data.codigoInvalido) {
            var req = {
                idcmpAgrupamiento: data.model.idcmpAgrupamiento ? data.model.idcmpAgrupamiento : -1,
                codigo: data.model.codMovimiento,
            }
            $resource(url+".ControlDuplicado").query(req,
                function success(res) {
                    data.codigoExistente = res.length;
                },_this.error);
        }
    }

    this.ValidarSigno = function (data) {
        if(typeof data == 'undefined'){
            return;
        }
        if(typeof data == 'undefined')
            data.signoInvalido = false;
        else
            data.signoInvalido = !(data.model.signoInventario == '' || data.model.signoInventario == '-1' || data.model.signoInventario == '0' || data.model.signoInventario == '1');
    }

    $scope.agrupamientos.selected=[];
    $scope.agrupamientos.selectedCFR=[];
    this.selectCheckbox=function(index, row){
        $scope.agrupamientos.model = {};
        if(row.selected==true) {
            $scope.agrupamientos.selected.push(row);
        }
        else
            $scope.agrupamientos.selected.splice($scope.agrupamientos.selected.indexOf(row), 1);
        if ($scope.agrupamientos.selected.length ===1){
            for (var propiedad in $scope.agrupamientos.selected[0]) { $scope.agrupamientos.model[propiedad] = $scope.agrupamientos.selected[0][propiedad]; }
        }
        $scope.agrupamientos.puedeModificar = ($scope.agrupamientos.selected.length ===1 && ($scope.agrupamientos.model.fecBaja == null || moment($scope.agrupamientos.model.fecBaja).utc() >= new Date()));
    }

   this.insert=function(form,data){
        if (form.$valid && data.codigoExistente==0 && !data.codigoInvalido && !data.signoInvalido && !data.agrupadorInvalido) {
            data.model.usuario= Global.currentUser.name
            Agrupamientos.save(data.model, _this.ok,_this.error);
        }
    }
    this.update=function (form,data){
        if (form.$valid && !data.codigoInvalido && !data.signoInvalido && !data.agrupadorInvalido) {
            data.model.usuario= Global.currentUser.name
            Agrupamientos.update({ idcmpAgrupamiento: data.model.idcmpAgrupamiento },data.model,_this.ok,_this.error);
        }
    }
    this.delete=function (form,data){
        if (form.$valid) {
            data.model.usuario= Global.currentUser.name
            //data.baja=1;
            Agrupamientos.update({ idcmpAgrupamiento: data.model.idcmpAgrupamiento },data.model, _this.ok,_this.error);
        }
    }

    this.ok=function(res){
        _this.showToastSuccess();
        _this.getData();
        $mdDialog.hide();
    }

    this.error=function(err){
        if(typeof err.data.message=='undefined'){
            _this.showToast("Error",err.statusText);
        }else{
            _this.showToast("Error",err.data.message);
        }
    }
    this.submit=function(){
        //console.log("Submit")
    }

    this.onReorder=function(order) {
        var reverse=order[0]=='-'?true:false;
        if(order[0]=='-'){
            order=order.replace("-","")
        }
        $scope.agrupamientos.data =$filter('orderBy')($scope.agrupamientos.data , order,reverse);
    }
    this.removeFilter=function () {
        $scope.agrupamientos.filter.show = true;
        $scope.agrupamientos.query.filter = '';
        if(typeof $scope.agrupamientos.formFilter!='undefined'){
            if ($scope.agrupamientos.formFilter.$dirty) {
                $scope.agrupamientos.formFilter.$setPristine();
            }
        }
    }

     this.showVal = function(value, filter) {
        if (filter == 'date' && value != null & value != '') {
            return moment(value).utc().format('DD/MM/YYYY')
        }
        if (filter == 'number') {
            return $filter('number')(value, 2);
        }
        if (filter == 'coef') {
            return $filter('number')(value, 4);
        }
        return value;
    };

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
}


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



app.controller('agrupamientos.ctrl',
    function ($scope,$resource,$filter,$mdEditDialog,Global, $q,Agrupamientos,$mdToast,$mdDialog ) {
        $scope.agrupamientos={};

        $scope.promiseAgrupador = $resource('/api/agrupador/').query(successAgrupador).$promise;
        function successAgrupador(data) {
            $scope.agrupadoresList = data;
        }

        $scope.seleccionado = 'CMP';//'CFR';
        $scope.grid = {
            selected: [],
            data: [],
            query: {
                page: 1,
                limit: 10,
                tipo: '',
                order: 'codigo',
                showDeleted: false,
                search: false,
                searchText: ''
            },
            count: 0
        };


        $scope.tipos = [
            {
                codigo: 'CFR',
                descripcion: 'Conci. Financiacion Resultado'
            },
            {
                codigo: 'CMP',
                descripcion: 'Conci. Movimientos Presentados'
            }
        ]

        $scope.agrupamientosCFR = {
            "selected": [],
            "columns":AGRUPAMIENTOS_COLUMNSCFR,
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
                    tipo:'CFR',
                    dadosBaja: 0,
                    cuenta: '',
                    descripcion: '',
                    digitador: '',
                    agrupador: ''
                },
                limit: '5',
                order: 'proceso',
                page: 1,
            }
        };

        $scope.agrupamientos= {
            "selected": [],
            "columns":AGRUPAMIENTOS_COLUMNS,
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
                    tipo:'CMP',
                    dadosBaja: 0,
                    cuenta: '',
                    descripcion: '',
                    digitador: '',
                    agrupador: ''
                },
                limit: '5',
                order: 'proceso',
                page: 1,
            }
        };

        $scope.config=new AgrupamientosControl($scope,$resource,$filter,$mdEditDialog,Global,$q,Agrupamientos,$mdToast,$mdDialog );
        $scope.dataLoad = {
            agrupadores: []
        };

        $scope.querySearch = function(query) {
            var results = query ? self.agrupadores.filter( createFilterFor(query) ) : [];
            return results;
        }

        var minDate=new Date();
        var day   = minDate.getDate();
        var month   = minDate.getMonth();
        var year    = minDate.getFullYear();
        $scope.minFecBaja=new Date(year, month, day);

        $scope.config.getData();


        $scope.resetPage = function () {
            $scope.grid.query.page = 1;
        };


        $scope.filtering = function (element) {
            return (element.fecBaja === null || $scope.grid.query.showDeleted) &&
                (!$scope.grid.query.search || hasSearchedString(element));
        };


        $scope.cboTipoConsulta_onChange = function () {
            if ($scope.seleccionado == 'CFR')
                $scope.agrupamientos.filter.show = false;
        }

        $scope.BuscarCFR = function () {
            $scope.MostrarAlerta = $scope.agrupamientosCFR.query.filter.cuenta == '' && $scope.agrupamientosCFR.query.filter.descripcion == '' && $scope.agrupamientosCFR.query.filter.digitador == '' && $scope.agrupamientosCFR.query.filter.agrupador == '';
            if ($scope.MostrarAlerta)
                return;

            var deferred = $q.defer();
            $scope.promiseAgrupamientosCFR = deferred.promise;
            var url='/api/Agrupamientos';
            $resource(url).query(
                $scope.agrupamientosCFR.query.filter,
                function success(data) {
                    function getFecha(data){
                        if (data!=null){
                            var fecha=data.replace("Z"," ").replace("T"," ");
                            return new Date(fecha);
                        }
                        return null
                    }
                    angular.forEach(data, function (item) {
                        item["fecBaja"]=getFecha(item["fecBaja"]);
                    });
                    $scope.agrupamientosCFR.data = data;
                    deferred.resolve();
                },
                function error(err) {
                    _this.showToast('error', err.data.message);
                    $scope.agrupamientos.data={};
                    deferred.resolve();
                }
            );





        }


        this.confirmOperation = function (errors) {
            var count = $filter('filter')($scope.dataLoad.agrupadores, {descripcion: $scope.agrupamientos.model.descripcionAgrupador});
            if(count.length == 0) {
                $scope.showErrorToastSucursal('error', 'La Localidad ingresada no existe.')
            }
        };

    });





