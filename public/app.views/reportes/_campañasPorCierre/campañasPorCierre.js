app.controller('campaniasPorCierre.ctrl', function ($scope, Toast, $resource, $http, Global, $q) {
    $scope.grid = {
        data: [],
        selected: [],
        count: 0,
        order: 'descripcion',
        query: {
            fechaHasta: null,
            fechaDesde: null
        }
    };

    $scope.detailGrid = {
        data: [],
        count: 0,
        query: {
            usuario: Global.currentUser.name,
            order: 'nroCuenta',
            limit: 10,
            page: 1
        }
    };

    $scope.periodosInstancias = [];

    $scope.load = function () {
        $resource('/api/calendario').query({}, function (data) {
            $scope.periodosInstancias = data.map(function (pI) {
                return {
                    periodo: pI.periodo,
                    instancia: pI.instancia,
                    fecCierre: pI.fecCierre
                };
            }).sort(orderPeriodoInstancia);

            $scope.grid.query.fechaHasta =
                $scope.periodosInstancias.filter(function (it) {
                    return moment(it.fecCierre).format('YYYYMMDD') >= moment(new Date()).format('YYYYMMDD');
                }).map(function (it) {
                    return it.fecCierre
                }).sort()[0];
            var currentDate = new Date();
            $scope.grid.query.fechaDesde = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        }, function (err) {
            Toast.showError(err.data.message);
        });
    };

    $scope.onFilter = function () {
        $scope.cleanDetails();
        $scope.promise = $resource('/api/reportes/campaniasPorCierre').query($scope.grid.query, function (data) {
            $scope.grid.data = data;
            $scope.grid.count = data.length;
            $scope.filtrado = true;
        }, function (err) {
            Toast.showError(err.data.message);
        }).$promise;
    };

    $scope.onSelectTotal = function (campania) {
        $scope.loadDetailsGrid();
    };

    $scope.loadDetailsGrid = function (query) {
        if (!query) {
            $scope.detailGrid.query.page = 1;
        }
        $scope.promiseDetail = $resource('/api/reportes/campaniasPorCierre/detalle', { param: 1}).query(query || angular.extend({
                idCampania: $scope.grid.selected[0].idCampania,
                entidad: $scope.grid.selected[0].entidad,
                fechaDesde: $scope.grid.query.fechaDesde,
                fechaHasta: $scope.grid.query.fechaHasta
            }, $scope.detailGrid.query), function (data) {
            $scope.detailGrid.data = [];
            $scope.detailGrid.data = data[0];
            if (data.length > 1) {
                $scope.detailGrid.count = data[1][0].rows;
            }
            if ($scope.detailGrid.count === 0) {
                $scope.detailGrid.message = 'No se encontraron datos';
            }else{
                $scope.detailGrid.message = '';
            }
        }, function (err) {
            Toast.showError(err.data.message);
        }).$promise;
    };

    $scope.exportarAExcel = function (query) {
        var exportUrl="";
        exportUrl= '/api/reportes/campaniasPorCierre/archivo?';
        exportUrl+= `idCampania=${$scope.grid.selected[0].idCampania}&entidad=${$scope.grid.selected[0].entidad}&`
        exportUrl+= `fechaDesde=${$scope.grid.query.fechaDesde}&fechaHasta=${$scope.grid.query.fechaHasta}&`;
        exportUrl+= `descripcion=${$scope.grid.selected[0].descripcion}`;
        return exportUrl;
        /*
        $scope.promiseDetail = $http({
            method: 'GET',
            url: '/api/reportes/campaniasPorCierre/archivo',
            params: query || angular.extend({
                idCampania: $scope.grid.selected[0].idCampania,
                entidad: $scope.grid.selected[0].entidad,
                fechaDesde: $scope.grid.query.fechaDesde,
                fechaHasta: $scope.grid.query.fechaHasta,
                descripcion: $scope.grid.selected[0].descripcion
            }, $scope.detailGrid.query)
        }).success(function (data) {
            var anchor = angular.element('<a/>');
            var csvData = new Blob([data], { type: 'application/vnd.openxmlformates' });
            var csvUrl = URL.createObjectURL(csvData);
            anchor.attr({
                href: csvUrl,
                target: '_blank',
                download:   $scope.grid.selected[0].descripcion +
                ' al ' + moment.utc($scope.grid.query.fechaHasta).format('YYYYMMDD') + '.xlsx'
            })[0].click();
        }).error(function (err) {
            Toast.showError(err.data.message);
        });
        */
    };

    $scope.enviarMail = function () {
        var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
        var f= $scope.grid.query.fechaHasta;
        f = new Date(f);
        fcierreDesc = meses[f.getMonth()] + " de " + f.getFullYear();
        console.log(fcierreDesc);
        var query =  angular.extend({
            descripcion: $scope.grid.selected[0].descripcion,
            idCampania: $scope.grid.selected[0].idCampania,
            entidad: $scope.grid.selected[0].entidad,
            fechaDesde: $scope.grid.query.fechaDesde,
            fechaHasta: $scope.grid.query.fechaHasta,
            fcierreDesc: fcierreDesc,
            nombreUsuario: Global.currentUser.nombre
        }, $scope.detailGrid.query)
        console.log(fcierreDesc);
        $scope.promiseDetail = $resource('/api/campanias/mail').query(query).$promise.then(function () {
            Toast.showSuccess('Mail enviado correctamente');
        }).catch(function (err) {
            Toast.showError(err.data.message);
        })
    };

    $scope.onPaginate = function (page, limit) {
        $scope.detailGrid.query.page = page;
        $scope.detailGrid.query.limit = limit;
        $scope.loadDetailsGrid(angular.extend({
            idCampania: $scope.grid.selected[0].idCampania,
            entidad: $scope.grid.selected[0].entidad,
            fechaDesde: $scope.grid.query.fechaDesde,
            fechaHasta: $scope.grid.query.fechaHasta
        }, $scope.detailGrid.query));
    };

    $scope.onReorder = function (order) {
        $scope.detailGrid.query.order = order;
        $scope.detailGrid.query.page = 1;
        $scope.loadDetailsGrid(angular.extend({
            idCampania: $scope.grid.selected[0].idCampania,
            entidad: $scope.grid.selected[0].entidad,
            fechaDesde: $scope.grid.query.fechaDesde,
            fechaHasta: $scope.grid.query.fechaHasta
        }, $scope.detailGrid.query));
    };

    $scope.$watch('grid.query', function () {
        $scope.filtrado = false;
    }, true);

    $scope.cleanDetails = function () {
        $scope.detailGrid.data = [];
        $scope.detailGrid.count = 0;
        $scope.detailGrid.query.page = 1;
    };

    function orderPeriodoInstancia(a,b) {
        if (a.periodo < b.periodo) {
            return 1;
        }
        if (a.periodo > b.periodo) {
            return -1;
        }
        if (a.periodo === b.periodo) {
            if (a.instancia > b.instancia) {
                return 1;
            }
            if (a.instancia < b.instancia) {
                return -1;
            }
            return 0;
        }
    }
});