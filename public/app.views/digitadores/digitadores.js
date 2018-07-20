var DIGITADORES_COLUMNS=[
    { show: false,  name: 'idDigitador',    field: 'idDigitador',   tip: ''},
    { show: true,   name: 'Cuenta',         field: 'cuenta',        tip: ''},
    { show: false,  name: 'idProceso',      field: 'idProceso',     tip: ''},
    { show: true,   name: 'Proceso',        field: 'Nombre',        tip: ''},
    { show: true,   name: 'Digitador',      field: 'digitador',     tip: ''},
    { show: true,   name: 'Acción',         field: 'accion',        tip: ''},
    { show: true,   name: 'Fecha de baja',  field: 'fecBaja',       tip: '', filter: 'date'}
]
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

var DigitadoresControl=function($scope,$resource,$filter,$mdEditDialog,Global,$q,Digitadores,$mdToast,$mdDialog, $http){
    var _this=this;
    var url='/api/digitadores';
    this.operac="";
    this.getData=function() {
        function getFecha(data){
            if (data!=null){
                var fecha=data.replace("Z"," ").replace("T"," ");
                return new Date(fecha);
            }
            return null
        }

        $scope.digitadores.selected=[];
        var _this=this;
        var deferred = $q.defer();
        $scope.promiseDigitadores = deferred.promise;
        $resource(url).query(
            {
            },
            function success(data) {
                angular.forEach(data, function (item) {
                    item["fecBaja"]=getFecha(item["fecBaja"]);
                });
                $scope.digitadores.data = data;
                deferred.resolve();
            },
            function error(err) {
                _this.showToast('error', err.data.message);
                $scope.digitadores.data={};
                deferred.resolve();
            }
        );
    }


    //Obtener los procesos para el combo
    //Lo obtengo ahora porque luego demora para la carga
    $scope.promiseDigitador = $resource('/api/procesos/procesosTraerTodos').query(successProcesos).$promise;
    function successProcesos(data) {
        $scope.procesos = data;
    }
    $scope.acciones = ['Eliminar', 'Guardar'];


    this.selectCheckbox=function(index, row){
        $scope.digitadores.model = {};
        if(row.selected==true)
            $scope.digitadores.selected.push(row);
        else
            $scope.digitadores.selected.splice($scope.digitadores.selected.indexOf(row), 1);

        if ($scope.digitadores.selected.length == 1) {
            $scope.digitadores.puedeModificar = ($scope.digitadores.selected[0].fecBaja == null || $scope.digitadores.selected[0].fecBaja >= new Date());
            for (var propiedad in row) { $scope.digitadores.model[propiedad] = row[propiedad]; }
        }
        else
            $scope.digitadores.puedeModificar = false;
    }
    this.openUpdateForm=function(){
        $scope.operac="Modificar";
        for (var propiedad in $scope.digitadores.selected[0]) { $scope.digitadores.model[propiedad] = $scope.digitadores.selected[0][propiedad]; }
        this.submit=this.update;
        _this.dialogShow()
    }
    this.openDeleteForm=function(){
        $scope.operac="Baja";
        this.submit=this.delete;
        _this.dialogShowDelete()
    }
    this.openAddForm=function(){
        $scope.operac="Alta";
        this.submit=this.insert;
        $scope.digitadores.model={
            idProceso: 0,
            cuenta: '',
            digitador: '',
            accion: ''
        };
        _this.dialogShow()
    }
    this.dialogShow=function(){
        $mdDialog.show({
            clickOutsideToClose: true,
            controller: _this.modalController,
            controllerAs: 'ctrl',
            focusOnOpen: false,
            targetEvent: event,
            locals: { ParentScope: $scope },
            templateUrl: 'app.views/digitadores/add.html'
        }).then(function () {});
    }
    this.dialogShowDelete=function(){
        $mdDialog.show({
            clickOutsideToClose: true,
            controller: _this.modalController,
            controllerAs: 'ctrl',
            focusOnOpen: false,
            targetEvent: event,
            locals: { ParentScope: $scope },
            templateUrl: 'app.views/digitadores/delete.html'
        }).then(function () {});
    }


    this.modalController=function ($scope, $mdDialog,ParentScope) {
        console.log("modalController ParentScope",ParentScope );
        $scope.ParentScope = ParentScope;

        $scope.digitadores = {};
        $scope.digitadores.query = $scope.ParentScope.digitadores.query;
        $scope.digitadores.selected = $scope.ParentScope.digitadores.selected;

        $scope.digitadores.model = $scope.ParentScope.digitadores.model;
        $scope.digitadores.codigoExistente = 0;
        $scope.digitadores.SignoInvalido = false;
        //$scope.digitadoresList = $scope.ParentScope.digitadoresList;
        $scope.currentDate = new Date();
        console.log($scope.digitadores.model);

        $scope.proceso={};

        $scope.test=function(){
            var x = document.getElementById("ProcesoTipo");
            x.className = "ng-dirty ng-pristine ng-empty ng-invalid ng-invalid-required ng-touched";
        }

        $scope.cancel = function() {
            /*
            if(!$scope.ParentScope.digitadores.model)
                $scope.ParentScope.digitadores.model.fecBaja=null;
            */
            $mdDialog.cancel();
        };

    }


    //Funciones de validación de formulario ABM
    this.ValidarDigitador = function(data){
        if(typeof data == 'undefined')
            return;
        if (data.model.digitador && data.model.digitador != '')
            this.ValidarDuplicidad(data);
        else
            data.codigoExistente = 0;
    }
    this.accionChange = function (data) {
        this.ValidarCuenta(data);
    }
    this.ValidarCuenta = function(data){
        if(typeof data == 'undefined')
            return;
        if (data.model.accion && data.model.accion != ''){
            data.cuentaObligatoria = (data.model.accion == 'Eliminar' && (!data.model.cuenta || data.model.cuenta == ''));
        }
        if (!data.model.cuenta || data.model.cuenta == '')
            data.cuentaInexistente = false;
        else {
            //valido si la cuenta es existente
            $resource('/api/planCuenta/').query(
                { cuenta: data.model.cuenta },
                function success(response) {
                    data.cuentaInexistente = (response.length == 0);
                    //deferred.resolve();
                },
                function error(err) {
                    _this.showToast('error', err.data.message);
                    data.cuentaInexistente = true;
                    //deferred.resolve();
                }
            );
        }
        this.ValidarDuplicidad(data);
    }

    this.ValidarDuplicidad = function(data){
        var req = {
            idDigitador: data.model.idDigitador,
            idProceso: data.model.idProceso,
            cuenta: data.model.cuenta,
            digitador: data.model.digitador
        }
        $resource(url+".ControlDuplicado").query(req,
            function success(res) {
                data.codigoExistente = res.length;
            },_this.error);
    }


    $scope.digitadores.selected=[];
    this.insert=function(form,data){
        if (form.$valid && data.codigoExistente==0) {
            if (data.cuentaObligatoria && (!data.model.cuenta || data.model.cuenta.trim() == ''))
                return;
            data.model.usuario= Global.currentUser.name
            Digitadores.save(data.model, _this.ok,_this.error);
        }
    }
    this.update=function (form,data){
        if (form.$valid && data.codigoExistente==0) {
            data.model.usuario = Global.currentUser.name;
            Digitadores.update({ idDigitador: data.model.idDigitador },data.model,_this.ok,_this.error);
        }
    }
    this.delete=function (form,data){
        if (form.$valid) {
            data.model.usuario= Global.currentUser.name
            var obj = {
                idDigitador: '',
                fecBaja: data.fecBajaAll,
                usuario: Global.currentUser.name
            };
            for (i = 0; i < $scope.digitadores.selected.length; i++)
                obj.idDigitador += ((obj.idDigitador == '') ? '' : '|') + $scope.digitadores.selected[i].idDigitador;

            $http({
                method: 'DELETE',
                url: '/api/digitadores/',
                data: obj,
                headers: {'Content-Type': 'application/json;charset=utf-8'}
            }).then(_this.ok).catch(_this.error);
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
        console.log("Submit")
    }

    this.onReorder=function(order) {
        var reverse=order[0]=='-'?true:false;
        if(order[0]=='-'){
            order=order.replace("-","")
        }
        $scope.digitadores.data =$filter('orderBy')($scope.digitadores.data , order,reverse);
    }
    this.removeFilter=function () {
        $scope.digitadores.filter.show = true;
        $scope.digitadores.query.filter = '';
        if(typeof $scope.digitadores.formFilter!='undefined'){
            if ($scope.digitadores.formFilter.$dirty) {
                $scope.digitadores.formFilter.$setPristine();
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


app.controller('digitadores.ctrl',
    function ($scope,$resource,$filter,$mdEditDialog,Global,$q, Digitadores,$mdToast,$mdDialog, $http ) {
        $scope.digitadores={};
/*
        $scope.promiseDigitador = $resource('/api/digitadores/').query(successDigitadores).$promise;
        function successDigitadores(data) {
            $scope.digitadoresList = data;
        }
*/
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

        $scope.digitadores= {
            "selected": [],
            "columns": DIGITADORES_COLUMNS,
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
                page: 1,
            }
        };

       $scope.config=new DigitadoresControl($scope,$resource,$filter,$mdEditDialog,Global,$q, Digitadores,$mdToast,$mdDialog, $http);
        $scope.dataLoad = {
            digitadores: []
        };
/*
        $scope.querySearch = function(query) {
            var results = query ? self.digitadores.filter( createFilterFor(query) ) : [];
            return results;
        }
*/
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

    });

/**
 * Created by marcos.marenna on 28/08/2017.
 */
