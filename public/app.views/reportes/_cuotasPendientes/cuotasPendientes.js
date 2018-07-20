// 2017-06-01 Prueba depues Merge

app.controller('cuotasPendientes.ctrl', function ($scope, $resource, $filter, $timeout, Excel, $mdToast, $http) {
    $scope.changeLimit= function () {
        $scope.LimitNroCuentaEntidad= ($scope.filter_entidad.entidad === '067' || $scope.filter_entidad.entidad === '667') ? 10 : 7;
        console.log("filter_entidad",$scope.filter_entidad)
    }

    $scope.showError = function (msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast-error">' + msg + '</md-toast>',
            hideDelay: 3000,
            parent: '.toastParent',
            position: 'top left'
        });
    };

    $scope.isOpen = function(index, $event) {

        console.log("IndexController",window.user);
        $event.preventDefault();
        $event.stopPropagation();
        if($scope.ctrl.showMenu[index] != undefined){
            $scope.ctrl.showMenu[index] = !$scope.ctrl.showMenu[index];
        }else{
            $scope.ctrl.showMenu[index] = true;
        }
        $(".submenuList").removeClass("ng-hide").addClass("ng-hide");
    };

    $scope.show = { filter: false };
    $scope.loaded = true;
    $scope.filtrado = false;
    $scope.columns = [];
    $scope.columnsVISA = [
        { id: 0, show: true, name: 'Entidad', field: 'entidad', tip: 'Entidad'},
        { id: 1, show: true, name: 'Sucursal', field: 'sucursal', tip: 'Sucursal'},
        { id: 2, show: true, name: 'Nro. Cuenta', field: 'nroUsuario', tip: 'Número de cuenta'},
        { id: 3, show: true, name: 'Nro. Tarjeta', field: 'nroTarjeta', tip: 'Número de tarjeta'},
        { id: 4, show: true, name: 'Cartera', field: 'cartera', tip: 'cartera'},
        { id: 5, show: true, name: 'Establecimiento', field: 'establecimiento', tip: 'Establecimiento'},
        { id: 6, show: true, name: 'Rubro', field: 'rubro', tip: 'rubro'},
        { id: 7, show: true, name: 'Código Trx', field: 'codTrx', tip: 'código trx'},
        { id: 8, show: true, name: 'Nro. Cupon', field: 'nroCupon', tip: 'Número de cupon'},
        { id: 9, show: true, name: 'Nro. Cuota', field: 'nroCuota', tip: 'Número de cuota'},
        { id: 10, show: true, name: 'Cant. Cuotas', field: 'nroCuotasPlan', tip: 'Cantidad de cuotas'},
        { id: 11, show: true, name: 'Fecha Origen', field: 'fechaOrigen', tip: 'Fecha de Origen', filter: 'date' },
        { id: 12, show: true, name: 'Periodo Cuota', field: 'periodoCuota', tip: 'Periodo de cuota'},
        { id: 13, show: true, name: 'Fecha Cierre', field: 'fecCierre', tip: 'Fecha de Cierre', filter: 'date' },
        { id: 14, show: true, name: 'Moneda', field: 'codMoneda', tip: 'Moneda'},
        { id: 15, show: true, name: 'Importe Capital', field: 'impCapital', tip: 'Importe Capital', filter: 'number'},
        { id: 16, show: true, name: 'Importe Intereses', field: 'impIntereses', tip: 'Importe Intereses', filter: 'number'},
        { id: 17, show: true, name: 'Importe Total', field: 'impTotal', tip: 'Importe', filter: 'number'}
    ];
    $scope.columnsMaster = [
        { id: 0, show: true, name: 'Entidad', field: 'entidad', tip: 'Entidad' },
        { id: 1, show: true, name: 'Sucursal', field: 'sucursal', tip: 'Sucursal' },
        { id: 2, show: true, name: 'GrupoCC', field: 'grupoCC', tip: 'grupoCC' },
        { id: 3, show: true, name: 'Nro. Cuenta', field: 'nrocuenta', tip: 'Número de cuenta' },
        { id: 4, show: true, name: 'TS', field: 'TS', tip: 'TS' },
        { id: 5, show: true, name: 'DV', field: 'DV', tip: 'DV' },
        { id: 6, show: true, name: 'Nro. Cupon', field: 'nroCupon', tip: 'Número de cupón'  },
        { id: 7, show: true, name: 'Nro. Cuota', field: 'cuotaVigente', tip: 'Cantidad de Cuotas'  },
        { id: 8, show: true, name: 'Cant. Cuotas', field: 'cuotasPlan', tip: 'Número de cuota'  },
        { id: 11, show: true, name: 'Fecha Clearing', field: 'fecClearing', tip: 'Fecha de clearing', filter: 'date' },
        { id: 10, show: true, name: 'Fecha Cierre Cuota', field: 'fecCuota', tip: 'Fecha de Cierre Cuotas', filter: 'date' },
        { id: 12, show: true, name: 'Fecha Grupo Cierre', field: 'fecCierre', tip: 'Fecha de Cierre', filter: 'date' },
        { id: 13, show: true, name: 'Moneda', field: 'codMoneda', tip: 'Moneda' },
        { id: 14, show: true, name: 'Importe', field: 'importe', tip: 'Importe', filter: 'number'},
        { id: 15, show: true, name: 'Tipo Plan', field: 'marcaTipoPlan', tip: 'marcaTipoPlan'}
    ];

    $scope.instancias = [ '1', '2', '3', '4' ];
    $scope.periodos = [];
    $scope.grilla = {
        filter: {
            options: { debounce: 500 }
        },

        query: {
            filter: {
                entidad: '090',
                nroCuenta: '',
                fechaHasta: new Date(new Date().getFullYear(), 11, 31),
                fechaDesde: new Date(new Date().getFullYear(), 0, 1)
            },
            limit: 10,
            order: 'fecCierre',
            page: 1,
            where: ''
        },
        data: [],
        count: 0,
        nohayDatos: ""
    };

    $scope.showVal = function(value, filter) {

        if (filter == 'date') {
            return moment(value).utc().format('DD/MM/YYYY')
        }
        if (filter == 'number') {
            return ((value) ? ($filter('number')(value, 2).replace(',', ';').replace(/\./g, ',').replace(';','.')) : value);
        }
        if (filter == 'coef') {
            return $filter('number')(value, 4);
        }



        return value;
    };

    $scope.init = function () {
        $scope.load();
    };

    $scope.entidades=[
        {"tabla":"Master","entidad":"090"},
        {"tabla":"Master","entidad":"091"},
        {"tabla":"VISA","entidad":"067"},
        {"tabla":"VISA","entidad":"667"}
    ];
    $scope.filter_entidad=$scope.entidades[0];

    $scope.changeLimit();
    $scope.load = function (query) {
        if ($scope.filtrado) {
            $scope.loaded = false;
            $scope.EntidadShow = $scope.filter_entidad.tabla;
            $scope.grilla.query.filter.nroCuenta = formatCuenta($scope.grilla.query.filter.nroCuenta);
            $scope.promiseObj = $resource('/api/reportes/reporteCuotasPendientes').query(query || $scope.grilla.query, getDatos, mal).$promise;
        }

        function getDatos(obj) {
            $scope.loaded = true;
            if($scope.filter_entidad.tabla == "VISA"){
                $scope.columns = $scope.columnsVISA;
            }else{
                $scope.columns = $scope.columnsMaster;
            }
            console.log(obj);
            $scope.grilla.data = [];
            for(var x in obj[0]){
                if(!$.isFunction(obj[0][x])){
                    $scope.grilla.data.push(obj[0][x])
                }
            };
            if (obj.length > 1) {
                $scope.grilla.nohayDatos = '';
                $scope.grilla.count = obj[1][0].rows;
                if(!$scope.grilla.count || $scope.grilla.count == 0){
                    $scope.grilla.nohayDatos = 'No se encontraron datos';
                }
            }else{
                $scope.grilla.nohayDatos = 'No se encontraron datos';
            }
        }
        function mal(obj) {
            //console.log('bad, very bad', obj);
            console.log(obj.data.name ,obj.data.message)
            $scope.loaded = true;
            $scope.showError ('Se produjo error: ' + obj.data.name + ': ' +  obj.data.message)
        }

    };

    $scope.onPaginate = function(page, limit) {
        $scope.grilla.query.page = page;
        $scope.grilla.query.limit = limit;
        $scope.load($scope.grilla.query);
    };

    $scope.onReorder = function(order) {
        angular.extend($scope.grilla.query, {order: order});
    };


    $scope.onFilter = function() {
        $scope.grilla.query.filter.entidad=$scope.filter_entidad.entidad;
        console.log("$scope.filter_entidad",$scope.filter_entidad)
        if ($scope.grilla.query.filter.entidad.entidad='' && $scope.grilla.query.filter.nroCuenta === '')
        {
            $scope.filtrado = false;
        }else {
            $scope.filtrado = true;
        }

        if (!$scope.filtrado) {
            $scope.filterApplied = false;
            return;
        }

        $scope.grilla.query.where = buildWhere();
        $scope.load(angular.extend($scope.grilla.query, { page: 1}));
        $scope.filterApplied = true;
    };

    $scope.checkHasData = function(){
        if((!$scope.grilla.count || $scope.grilla.count == 0) && (!$scope.grilla.countMC || $scope.grilla.countMC == 0)) {
            return false;
        }
        return true;
    }

    $scope.exportarAExcel = function () {
        if( $scope.checkHasData()){
            var exportUrl = "";
            exportUrl += '/api/reportes/reporteCuotasPendientes/Excel?';
            exportUrl += `entidad=${$scope.grilla.query.filter.entidad}&`;
            exportUrl += `nroCuenta=${formatCuenta($scope.grilla.query.filter.nroCuenta)}&`;
            exportUrl += `fechaHasta=${$scope.grilla.query.filter.fechaHasta}&`;
            exportUrl += `fechaDesde=${$scope.grilla.query.filter.fechaDesde}`;

            var anchor = angular.element('<a/>');
            anchor.attr({
                href: exportUrl,
                target: '_blank',
                download: 'CuotasPendientes_'+$scope.filter_entidad.entidad +'.xlsx'
            })[0].click();
        }else{
            $scope.showError ('No hay datos para exportar');
        }
    };


    function buildWhere() {
        var where = 'where ';
        if ($scope.grilla.query.filter.nroCuenta !== '' && $scope.grilla.query.filter.nroCuenta !== null) {
            where = where + "CONVERT(varchar, CONVERT(int, nroCuenta)) LIKE '%" + $scope.grilla.query.filter.nroCuenta + "%'";
            // where = where + "nroCuenta LIKE '" + $scope.grilla.query.filter.nroCuenta + "%'";
        }
        return where;
    }

    function formatCuenta(txtCuenta){
        return (new Array($scope.LimitNroCuentaEntidad + 1).join('0') + txtCuenta).slice(-$scope.LimitNroCuentaEntidad);
    }
});

