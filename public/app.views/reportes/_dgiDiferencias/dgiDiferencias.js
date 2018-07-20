app.controller('dgiDiferencias.ctrl', function ($scope, Toast, $resource, $mdDialog, $http, $filter){
    $scope.proceso = 'IVA DGI SICORE';
    $scope.codigosRegimen = [];
    $scope.cuentas = [];
    $scope.grid = {
        data: [],
        count: 0,
        query: {
            codRegimen: null,
            cuenta: null,
            conDiferencias: false,
            limit: 10,
            order: 'mes',
            page: 1
        }
    };


    $scope.showVal = function(value, filter) {

        if (filter == 'date') {
            if(value!=null){
                var fecha=value.replace("Z"," ").replace("T"," ");
                return $filter('date')(new Date(fecha), 'dd/MM/yyyy')
            }else{
                return value
            }
        }
        if (filter == 'number') {
            return ((value) ? ($filter('number')(value, 2).replace(',', ';').replace(/\./g, ',').replace(';','.')) : value);

        }
        if (filter == 'coef') {
            return $filter('number')(value, 4);
        }
        return value;

    };


    $scope.appliedFilters = {
        codRegimen: null,
        cuenta: null,
        conDiferencias: false
    };

    $scope.load = function () {
        $scope.cerrar = $mdDialog.hide;
        $resource('/api/contabilidad/proceso/:proceso', { proceso: $scope.proceso }).query(function (data) {
            if(data && data.length > 0){
                $scope.cuentas = data.map(function (it) {
                    return {
                        cuentaDesc: it.cuenta + " - " + it.cuentaDesc,
                        cuenta: it.cuenta
                    };
                });
            }
        }, function (err) {
            Toast.showError(err.data.message);
        });

        $resource('/api/retencion').query(function (data) {
            $scope.codigosRegimen = data.map(function (it) { return it.codRegimen });
        }, function (err) {
            Toast.showError(err.data.message);
        });
    };

    $scope.$watch('grid.query.codRegimen', function (newValue, oldValue) {
        $scope.filtrado = false;
    });
    $scope.$watch('grid.query.cuenta', function (newValue, oldValue) {
        $scope.filtrado = false;
    });
    $scope.$watch('grid.query.conDiferencias', function (newValue, oldValue) {
        $scope.filtrado = false;
    });

    $scope.onFilter = function (query) {
        $scope.promise = $resource('/api/reportes/dgiDiferencias')
            .query(query || $scope.grid.query).$promise
            .then(function (data) {
                $scope.grid.data = data[0][0] ? data[0] : [];
                if (data.length > 1) {
                    $scope.grid.count = data[1][0].rows;
                }
                $scope.filtrado = true;
                $scope.appliedFilters = {
                    codRegimen: $scope.grid.query.codRegimen,
                    cuenta: $scope.grid.query.cuenta,
                    conDiferencias: $scope.grid.query.conDiferencias
                };
            })
            .catch(function (err) {
                Toast.showError(err.data.message);
            });
    };

    $scope.onPaginate = function (page, limit) {
        $scope.onFilter(angular.extend($scope.grid.query, { page: page, limit: limit }));
    };

    $scope.onReorder = function (order) {
        $scope.onFilter(angular.extend($scope.grid.query, { order: order }));
    };

    $scope.closeFilter = function () {
        $scope.showFilter = false;
        $scope.grid.query.codRegimen = null;
        $scope.grid.query.cuenta = null;
        $scope.grid.query.conDiferencias = false;
    };

    $scope.exportarExcel = function () {
        if ($scope.grid.count > 0) {
            var exportUrl = "";
            exportUrl += '/api/reportes/dgiDiferencias/archivo?';
            exportUrl += `codRegimen=${$scope.appliedFilters.codRegimen}&`;
            exportUrl += `Diff=${$scope.appliedFilters.conDiferencias}&`;
            exportUrl += `nroCuenta=${$scope.appliedFilters.cuenta}&`;
            exportUrl += `orden=${$scope.grid.query.order}`;


            var anchor = angular.element('<a/>');
            anchor.attr({
                href: exportUrl,
                target: '_blank',
                download: 'DGISICORE.xlsx'
            })[0].click();

        } else {
            Toast.showError('Deben haber resultados en la grilla para poder exportar')
        }
    };

    $scope.detalleDiferencia = function (cuenta) {
        $mdDialog.show({
            clickOutsideToClose: true,
            focusOnOpen: false,
            targetEvent: event,
            templateUrl: 'app.views/reportes/dgiDiferencias/detalleDiferencias.html',
            locals: {
                cuenta: cuenta,
                proceso: $scope.proceso
            },
            controller: function ($scope, $mdDialog, $resource, Toast, cuenta, proceso) {
                $scope.cerrar = $mdDialog.hide;
                $scope.order = "fecAsiento";
                $scope.diferencias = [];
                $scope.promiseDiferencias = $resource('/api/contabilidad/traerProcesoCuenta')
                    .query({ cuenta: cuenta, proceso: proceso }).$promise
                    .then(function (data) {
                        $scope.diferencias = data;
                    })
                    .catch(function (err) {
                        Toast.showError(err.data.message);
                    })
            }
        });
    };
});