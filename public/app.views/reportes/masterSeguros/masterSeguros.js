// 2017-06-01 Prueba depues Merge

app.controller('masterSeguros.ctrl', function ($scope, $resource, $filter, $timeout, Excel, $mdToast, $http) {
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

    $scope.show = { filter: false };
    $scope.loaded = true;
    $scope.filtrado = false;
    $scope.columns = [
        { id: 0, show: true, name: 'Entidad', field: 'entidad', tip: 'Entidad'},
        { id: 1, show: true, name: 'Fec Cierre', field: 'fecCierre', tip: 'Fecha de Cierre', filter: 'date' },
        { id: 2, show: true, name: 'Apellido y Nombre', field: 'apellidoYNombre', tip: 'Apellido y Nombre' },
        { id: 3, show: true, name: 'Cuenta', field: 'nroCuenta', tip: 'Número de Cuenta' },
        { id: 4, show: true, name: 'Sucursal', field: 'sucursal', tip: 'Sucursal' },
        { id: 5, show: true, name: 'Saldo Financ<br>$', field: 'saldoFinanPesos', tip: 'Saldo Financiado en Pesos' },
        { id: 6, show: true, name: 'Saldo Financ<br>U$D', field: 'saldoFinanDolar', tip: 'Saldo Financiado en Dolares' },
        { id: 7, show: true, name: 'Cargo SEG<br>$', field: 'cargoSegPesos', tip: 'Importe en Pesos' },
        { id: 8, show: true, name: 'Cargo SEG<br>U$D', field: 'cargoSegDolares', tip: 'Cargo SEG-Dolares' },
        { id: 9, show: true, name: 'Total Car SDO<br>$', field: 'totalCarSdoPesos', tip: 'Total Car-SDO-Pesos' },
        { id: 10, show: true, name: 'Saldo Actual<br>$', field: 'saldoActualPesos', tip: 'Saldo Actual Pesos' },
        { id: 11, show: true, name: 'Saldo Actual<br>U$D', field: 'saldoActualDolar', tip: 'Saldo Actual Dolar' }
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
                sucursal: '',
                fecha: null,
                instancia: null,
                fecDesde: null,
                fecHasta: null,
                sinSeguro: false
            },
            limit: 10,
            order: 'fecCierre',
            page: 1,
            where: ''
        },
        data: [],
        count: 0
    };

    $scope.$watch('grilla.query.filter', function (newValue, oldValue) {
        $scope.filtrado = false;
        if (newValue.nroCuenta !== '' && newValue.nroCuenta !== null) {
            newValue.fecha = null;
            newValue.instancia = null;
        }
        else {
            newValue.fecDesde = null;
            newValue.fecHasta = null;
        }
    }, true);

    $scope.showVal = function(value, filter) {

        if (filter == 'date') {
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

    $scope.init = function () {
        $resource('/api/periodos').query(function (data) {
            $scope.periodos = data.map(function (it) { return it.periodo; });
        });
        $scope.load();
    };

    $scope.entidades=[
        {"tabla":"mc_seguros","entidad":"090"},
        {"tabla":"mc_seguros","entidad":"091"},
        {"tabla":"viax_seguros","entidad":"067"},
        {"tabla":"viax_seguros","entidad":"667"}
    ];
    $scope.filter_entidad=$scope.entidades[0];
    $scope.changeLimit();
    $scope.load = function (query) {
        if ($scope.filtrado) {
            $scope.loaded = false;
            $scope.promiseObj = $resource('/api/reportes/reporteMasterSeguros').query(query || $scope.grilla.query, bien, mal).$promise;
        }
        function bien(obj) {
            $scope.loaded = true;
            console.log(obj);
            $scope.grilla.data = obj[0];
            if (obj.length > 1) {
                $scope.grilla.count = obj[1][0].rows;
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
        $scope.load(angular.extend($scope.grilla.query, {order: order}));

    };


    $scope.onFilter = function() {
        $scope.grilla.query.filter.entidad=$scope.filter_entidad.entidad;
        console.log("$scope.filter_entidad",$scope.filter_entidad)
        if (
            $scope.grilla.query.filter.entidad.entidad='' &&
                $scope.grilla.query.filter.nroCuenta === '' && $scope.grilla.query.filter.sucursal === ''
                && $scope.grilla.query.filter.fecha === null && $scope.grilla.query.filter.instancia === null
                && $scope.grilla.query.filter.fecDesde === null && $scope.grilla.query.filter.fecHasta === null
                && !$scope.grilla.query.filter.sinSeguro)
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

    $scope.exportarAExcel = function () {

        $scope.promise = $http({
            method: 'GET',
            url: '/api/reportes/reporteMasterSeguros/archivo',
            params: $scope.grilla.query
        }).
            success(function(data, status, headers, config) {
                var anchor = angular.element('<a/>');
                var csvData = new Blob([data], { type: 'text/csv' });
                var csvUrl = URL.createObjectURL(csvData);
                anchor.attr({
                    href: csvUrl,
                    target: '_blank',
                    download: 'ReporteSeguroDeVida_'+$scope.filter_entidad.entidad +'.csv'
                })[0].click();
            }).
            error(function(data, status, headers, config) {
                alert('Se produjo error al extraer el archivo' )
            });
    };

    function buildWhere() {
        var where = 'where ';
        if ($scope.grilla.query.filter.nroCuenta !== '' && $scope.grilla.query.filter.nroCuenta !== null) {
            where = where + "CONVERT(varchar, CONVERT(int, nroCuenta)) LIKE '%" + $scope.grilla.query.filter.nroCuenta + "%'";
            // where = where + "nroCuenta LIKE '" + $scope.grilla.query.filter.nroCuenta + "%'";
        }
        if ($scope.grilla.query.filter.sucursal !== ''  && $scope.grilla.query.filter.sucursal !== null) {
            where = where === 'where ' ? (where + 'sucursal = ' + $scope.grilla.query.filter.sucursal) :
                (where + ' and ' + 'sucursal = ' + $scope.grilla.query.filter.sucursal);
        }
        if ($scope.grilla.query.filter.fecDesde !== null) {
            where = where === 'where ' ? (where + "enc.fechaProceso >= '" + $scope.grilla.query.filter.fecDesde + "'") :
                (where + ' and ' + "enc.fechaProceso >= '" + moment($scope.grilla.query.filter.fecDesde).format('YYYYMMDD') + "'");
        }
        if ($scope.grilla.query.filter.fecHasta !== null) {
            where = where === 'where ' ? (where + "enc.fechaProceso <= '" + $scope.grilla.query.filter.fecHasta + "'") :
                (where + ' and ' + "enc.fechaProceso <= '" + moment($scope.grilla.query.filter.fecHasta).format('YYYYMMDD') + "'");
        }
        if ($scope.grilla.query.filter.sinSeguro) {
            where = where === 'where ' ? (where + 'cargoSegPesos = 0') : (where + ' and ' + 'cargoSegPesos = 0');
        }
        if ($scope.grilla.query.filter.fecha !== null || $scope.grilla.query.filter.instancia !== null) {
            where = where === 'where ' ? '' : where;
        }

        return where;
    }
});

