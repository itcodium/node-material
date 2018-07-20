/**
 * Created by marcos.marenna on 30/08/2017.
 */
var PROMOCIONES_COLUMNS = [
    { show: false,  name: 'idPromociones',  field: 'idPromociones', tip: ''},
    { show: true,   name: 'Tipo',           field: 'tipo',          tip: ''},
    { show: true,   name: 'Entidad',        field: 'entidad',       tip: ''},
    { show: true,   name: 'Código',         field: 'codigoPromo',   tip: ''},
    { show: true,   name: 'Descripción',    field: 'descripcion',   tip: '', class: 'row-break'},
    { show: true,   name: 'Banca',          field: 'banca',         tip: ''},
    { show: true,   name: 'Segmento',       field: 'segmento',      tip: ''},
    { show: true,   name: 'Desde',          field: 'vigenciaDesde', tip: '', filter: 'date'},
    { show: true,   name: 'Hasta',          field: 'vigenciaHasta', tip: '', filter: 'date'},
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

var PromocionesControl=function($scope,$resource,$filter,$mdEditDialog,Global,$q,$mdToast,$mdDialog, Promociones){
    var _this=this;
    var url='/api/Promociones';
    this.operac="";
    this.getData=function() {
        function getFecha(data){
            if (data!=null){
                var fecha=data.replace("Z"," ").replace("T"," ");
                return new Date(fecha);
            }
            return null
        }

        $scope.promociones.selected=[];
        var _this=this;
        var deferred = $q.defer();
        $scope.promisePromociones = deferred.promise;
        $resource(url).query(
            {
                tipo: $scope.seleccionado
            },
            function success(data) {
                angular.forEach(data, function (item) {
                    item["fecBaja"]=getFecha(item["fecBaja"]);
                });
                $scope.promociones.data = data;
                deferred.resolve();
            },
            function error(err) {
                _this.showToast('error', err.data.message);
                $scope.promociones.data={};
                deferred.resolve();
            }
        );
    }

    this.openUpdateForm=function(){
        $scope.operac="Modificar";
        this.submit=this.update;
        _this.dialogShow()
    }
    this.FileGenerator = function () {
        if ($scope.promociones.selected.length == 0)
            return
        var contenidoDialog = '';
        var campaniasElegidas = '';
        var idPromociones = '';
        for (var i = 0; i < $scope.promociones.selected.length; i++){
            campaniasElegidas += ((campaniasElegidas == '') ? '' : ', ') + $scope.promociones.selected[i].codigoPromo;
            idPromociones += ((idPromociones == '') ? '' : '|') + $scope.promociones.selected[i].idPromociones;
        }
        //campaniasElegidas += ((campaniasElegidas == '') ? '' : ', ') + $scope.promociones.selected[i].codigoPromo;
        contenidoDialog = 'Está seguro que desea generar el archivo ' + (($scope.promociones.selected[0].tipo == 'TC') ? 'B067_PROMO620 y B667_PROMO620' : 'macroreg0.txt') +  ' para las campañas ' + campaniasElegidas + '?';

        // Appending dialog to document.body to cover sidenav in docs app
        var confirm = $mdDialog.confirm()
            .title('Generar Archivo de Baja')
            .textContent(contenidoDialog)
            .ariaLabel('Lucky day')
            .ok('Aceptar')
            .cancel('Cancelar');

        $mdDialog.show(confirm).then(function() {
            _this.showToast('toastSuccess','Se ha comenzado la generación del archivo.')
            //Generar Archivo
            //$scope.status = 'You decided to get rid of your debt.';
            //Ver si es TC o TD
            var TC = ($scope.promociones.selected[0].tipo == 'TC') ? 1 : 0;
            var TD = ($scope.promociones.selected[0].tipo == 'TD') ? 1 : 0;
            $resource('/api/promociones/promoTDAsoc/GenerarArchivoTD').query(
                {
                    TC: TC,
                    TD: TD,
                    usuario: Global.currentUser.name,
                    idPromociones: idPromociones
                },
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

        }, function() {
            $scope.promociones.selected = [];
            $scope.promociones.data.forEach(x => { x.selected = false});
        });
        /*

         */
    }

    this.openAddForm=function(){
        $scope.operac="Alta";
        this.submit=this.insert;
        $scope.promociones.model={tipo: 'TD'};
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
            templateUrl: 'app.views/promociones/promociones/add.html'
        }).then(function () {});
    }

    this.modalController=function ($scope, $mdDialog,ParentScope) {
        $scope.ParentScope = ParentScope;
        $scope.promociones = {};
        $scope.promociones.model = Object.assign({},$scope.ParentScope.promociones.selected[0]) || $scope.ParentScope.promociones.model;
        if ($scope.promociones.model.vigenciaDesde)
            $scope.promociones.model.vigenciaDesde = new Date(moment($scope.promociones.model.vigenciaDesde).utc().format("MM/DD/YYYY"))
        if ($scope.promociones.model.vigenciaHasta)
            $scope.promociones.model.vigenciaHasta = new Date(moment($scope.promociones.model.vigenciaHasta).utc().format("MM/DD/YYYY"))
        $scope.promociones.codigoExistente = 0;
        $scope.promociones.segmentoInvalido = false;
        $scope.promociones.puedeModificar;
        $scope.promociones.minVigenciaHasta = new Date(); //{{((promociones.model.vigenciaDesde) ? new Date() : promociones.model.vigenciaDesde)}}
        //Combos
        $scope.tipos = [
            {
                codigo: 'TC',
                descripcion: 'Promociones TC'
            },
            {
                codigo: 'TD',
                descripcion: 'Promociones TD'
            }
        ];
        $scope.entidades = [
            {
                codigo: '067',
                descripcion: '067'
            },
            {
                codigo: '667',
                descripcion: '667'
            }
        ];
        $scope.bancas = [
            {
                codigo: 'INDIVIDUOS',
                descripcion: 'INDIVIDUOS'
            },
            {
                codigo: 'PLAN SUELDO',
                descripcion: 'PLAN SUELDO'
            }
        ];
/*
        $scope.newState=function (agrupador) {
            alert("Sorry! You'll need to create a Constituion for " + state + " first!");
        }
        $scope.init=function () {
        }
        $scope.searchTextChange   =function (text) {
            //console.log("searchTextChange",text);
        }
        $scope.selectedItemChange = function (item, data) {
            data.idAgrupamiento = item.idAgrupamiento;
        }
*/
        $scope.promociones.selected=[];
/*
        $scope.test=function(){
            var x = document.getElementById("ProcesoTipo");
            x.className = "ng-dirty ng-pristine ng-empty ng-invalid ng-invalid-required ng-touched";
        }
*/
        $scope.cancel = function() {
            if(!$scope.ParentScope.promociones.model){
                $scope.ParentScope.promociones.model.fecBaja=null;
            }
            $mdDialog.cancel();
        };
        if ($scope.promociones.model.descripcionAgrupador) {
            //$scope.init($scope.querySearch($scope.promociones.model.descripcionAgrupador)[0]);
            $scope.selectedItem = $scope.querySearch($scope.promociones.model.descripcionAgrupador)[0];
        }
    }

    //VALIDACIONES
    this.ValidarSegmento = function(data){
        if(typeof data == 'undefined')
            return;
        data.segmentoInvalido = (data.model.segmento && isNaN(data.model.segmento));
    }

    this.ValidarVigenciaDesde = function(data){
        data.minVigenciaHasta = new Date();
        if(typeof data == 'undefined')
            return;
        data.minVigenciaHasta = (typeof data.model.vigenciaDesde == 'undefined') ? new Date() : ((data.model.vigenciaDesde<new Date()) ? new Date() : data.model.vigenciaDesde);
        if(typeof data.model.vigenciaHasta == 'undefined')
            return;
        data.vigenciaDesdeMayor = (data.model.vigenciaDesde > data.model.vigenciaHasta);
    }

    this.ValidarDuplicidad = function (data){
        data.codigoExistente = 0;
        var req = {
            tipo: data.model.tipo,
            codigoPromo: data.model.codigoPromo,
            entidad: data.model.entidad
        }
        $resource(url+".ControlDuplicado").query(
            req,
            function success(res) {
                data.codigoExistente = res.length;
            },
            _this.error);
    }

    this.selectCheckbox=function(index, row){
        if(row.selected==true)
            $scope.promociones.selected.push(row);
        else
            $scope.promociones.selected.splice($scope.promociones.selected.indexOf(row), 1);

        if ($scope.promociones.selected.length == 1) {
            var fechaLimite = new Date();
            fechaLimite = new Date(fechaLimite.getFullYear(), fechaLimite.getMonth(), fechaLimite.getDate());
            $scope.promociones.puedeModificar = (moment(row.vigenciaDesde).utc() <= fechaLimite && moment(row.vigenciaHasta).utc() >= fechaLimite);
            $scope.promociones.model=row;
        }
        else {
            $scope.promociones.puedeModificar = false;
            $scope.promociones.model={};
        }
        //Verifico que sean del mismo tipo para la generación de archivo
        $scope.promociones.puedeGenerarArchivo = ($scope.promociones.selected.length >= 1);
        var promo = '';
        for (var i = 0; i < $scope.promociones.selected.length; i++) {
            if ($scope.promociones.puedeGenerarArchivo){
                promo = (promo == '') ? $scope.promociones.selected[i].tipo : promo;
                $scope.promociones.puedeGenerarArchivo = (promo == $scope.promociones.selected[i].tipo);
                //Valido que no esten vencido
                if ($scope.promociones.puedeGenerarArchivo)
                    $scope.promociones.puedeGenerarArchivo = (new Date() <= moment($scope.promociones.selected[i].vigenciaHasta).utc());

            }
        }

    }

    this.insert=function(form,data){
        if (form.$valid && data.codigoExistente==0) {
            data.model.usuario= Global.currentUser.name;
            Promociones.save(data.model, _this.ok,_this.error);
        }
    }
    this.update=function (form,data){
        if (form.$valid) {
            data.model.usuario= Global.currentUser.name;
            Promociones.update({ idPromociones: data.model.idPromociones },data.model,_this.ok,_this.error);
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
        $scope.promociones.data =$filter('orderBy')($scope.promociones.data , order,reverse);
    }
    this.removeFilter=function () {
        $scope.promociones.filter.show = true;
        $scope.promociones.query.filter = '';
        if(typeof $scope.promociones.formFilter!='undefined'){
            if ($scope.promociones.formFilter.$dirty) {
                $scope.promociones.formFilter.$setPristine();
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



app.controller('promociones.ctrl', function ($scope,$resource,$filter,$mdEditDialog,Global, $q,$mdToast,$mdDialog, Promociones ) {
        $scope.promociones={};
        $scope.promociones.puedeGenerarArchivo = false;
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
                codigo: '',
                descripcion: 'Todos'
            },
            {
                codigo: 'TC',
                descripcion: 'Promociones TC'
            },
            {
                codigo: 'TD',
                descripcion: 'Promociones TD'
            }
        ];
        $scope.seleccionado = $scope.tipos[0].codigo;



        $scope.promociones= {
            "selected": [],
            "columns": PROMOCIONES_COLUMNS,
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
                    tipo: '',
                },
                limit: '5',
                order: 'proceso',
                page: 1,
            }
        };

        $scope.config=new PromocionesControl($scope,$resource,$filter,$mdEditDialog,Global,$q,$mdToast,$mdDialog, Promociones);
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
            if ($scope.grid.query.showDeleted){
                return ($scope.grid.query.showDeleted) && (!$scope.grid.query.search || hasSearchedString(element));
            }
            else {
                var fechaLimite = new Date();
                fechaLimite = new Date(fechaLimite.getFullYear(), fechaLimite.getMonth(), fechaLimite.getDate());
                //moment(value).utc().format('DD/MM/YYYY')
                return (moment(element.vigenciaDesde).utc() <= fechaLimite && moment(element.vigenciaHasta).utc() >= fechaLimite) && (!$scope.grid.query.search || hasSearchedString(element));
            }
        };

        $scope.cboTipoConsulta_onChange = function () {
            $scope.config.getData();
        }

        this.confirmOperation = function (errors) {
            var count = $filter('filter')($scope.dataLoad.agrupadores, {descripcion: $scope.promociones.model.descripcionAgrupador});
            if(count.length == 0) {
                $scope.showErrorToastSucursal('error', 'La Localidad ingresada no existe.')
            }
        };
    });





