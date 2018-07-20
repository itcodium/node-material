/**
 * Created by BP4-Admin on 30/06/2016.
 */
app.controller('controlSucursales.ctrl', function ($scope, $resource,$http, Excel) {
    $scope.controlSucursales = {
        "query": {
            filter: '',
            limit: '5',
            order: 'nameToLower',
            page: 1
        },
        data: [],
        count: 0
    };

    $scope.load = function () {
        $scope.promiseControlSucursal = $resource('/api/controlSucursales').query(function (data) {
            $scope.controlSucursales.data = data;
            $scope.controlSucursales.count = data.length;
        }).$promise;
    };
    /*
    $scope.exportarExcel = function () {
        var name = 'Control de Sucursales';
        Excel.arrayToExcel($scope.controlSucursales.data, ['Sucursal', 'Fecha de Baja', 'Entidad y Archivos'], name, ['sucursal', 'fecBaja', 'entidadArchivo']);
    };
    */

    $scope.exportarExcel = function () {
        $scope.promiseObj = $http({method: 'GET', url: "/api/controlSucursalesPadronUnificado" }).
            success(function(data, status, headers, config) {
                var anchor = angular.element('<a/>');
                var csvData = new Blob([data], { type: 'text/csv' });
                var csvUrl = URL.createObjectURL(csvData);
                anchor.attr({
                    href: csvUrl,
                    target: '_blank',
                    download: 'ControlDeSucursales.csv'
                })[0].click();
            }).
            error(function(data, status, headers, config) {
                alert('Se produjo error al extraer el archivo' )
            });
    };
});