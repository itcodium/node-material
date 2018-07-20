app.controller('reporteTarjetasEnBoletin.ctrl', function($scope, $http, $resource) {
    $scope.promise = null;
    $scope.grilla = {
        "query": {
            periodo: 0,
            limit: '5',
            order: 'fecVigencia',
            page: 1,
            export:0
        },
        filterShow:false,
        data: [],
        count: 0
    };
    $scope.grillaDetalle = {
        "query": {
            periodo: 0,
            limit: '5',
            order: '1 ',
            page: 1,
            export:0
        },
        filterShow:false,
        data: [],
        count: 0
    };


    $scope.toolbarToogle=function(){
        $scope.grilla.filterShow=!$scope.grilla.filterShow;
    }

    $scope.onFilter=function(){
        console.log("Filter",$scope.grillaDetalle.query.filter);
        $scope.loadDetalle();
    }

    $scope.onKeyUp=function($event){
        $scope.onKeyPressResult = window.event ? $event.keyCode : $event.which;
        var digit=parseInt(String.fromCharCode($scope.onKeyPressResult));
        if(isNaN(digit)){
            $event.stopImmediatePropagation();
            $event.preventDefault();
        }
    }

    $scope.init = function () {
        $scope.load();
    };

    $scope.load = function (query) {
        $scope.grilla.query.export=0
        $scope.promise = $resource('/api/reportes/executeReporteTarjetasBoletin').query($scope.grilla.query, bien, mal ).$promise;
        function bien(obj) {
            $scope.grilla.data = obj[0].data;
            if (obj.length >= 1) {
                $scope.grilla.count = obj[0].rows;
            }
        }
        function mal(obj) {
            alert('Se produjo error: ' + obj.data.name + ': ' +  obj.data.message)
        }
    };

$scope.loadDetalle=function(query){
    $scope.grillaDetalle.query.export=0
    $scope.promiseTarjetasBoletinDetalle = $resource('/api/reportes/reporteTarjetasBoletinDetalle').query($scope.grillaDetalle.query, bien, mal).$promise;
    function bien(obj) {
        console.log("obj",obj[0]);
        if (obj.length== 0) {
            alert("No se encontraron datos.");
            return;
        }
        $scope.grillaDetalle.data = obj[0].data;
        if (obj.length >= 1) {
            $scope.grillaDetalle.count = obj[0].rows;
        }
    }
    function mal(obj) {
        alert('Erro Grilla Detalle: ' + obj.data.name + ': ' +  obj.data.message)
    }
}

    $scope.removeFilter = function () {
        $scope.buscarPeriodo = false;
        $scope.periodo = $scope.periodoHyphen;
        $scope.load();
    };

    $scope.onPaginate = function(page, limit) {
        $scope.load(angular.extend($scope.grilla.query, {page: page, limit: limit}));
    };

    $scope.onPaginateDetalle = function(page, limit) {
        $scope.loadDetalle(angular.extend($scope.grillaDetalle.query, {page: page, limit: limit}));
    };

    $scope.onReorder = function(order) {
        console.log("order",order);
        $scope.grilla.query.order=order;
        $scope.load(angular.extend($scope.grilla.query, {order: order}));
    };

    $scope.onReorderDetalle = function(order) {
        console.log("order",order);
        $scope.grillaDetalle.query.order=order;
        $scope.loadDetalle(angular.extend($scope.grillaDetalle.query, {order: order}));
    };

    $scope.selectPeriodo = function () {
        $scope.load();
    };

    /*
    $scope.exportarExcel = function () {
        var name = 'Tarjetas en boletin';
        Excel.arrayToExcel($scope.controlSucursales.data, ['Sucursal', 'Fecha de Baja', 'Entidad y Archivos'], name, ['sucursal', 'fecBaja', 'entidadArchivo']);
    };
    */

    $scope.exportarExcel = function () {
        $scope.grilla.query.export=1;
        $scope.promise = $http({
            method: 'GET',
            url: '/api/reportes/exportReporteTarjetasBoletin', //+ $scope.grilla.query.periodo + '/' + $scope.grilla.query.order
            params: $scope.grilla.query
        }).
            success(function(data, status, headers, config) {
                console.log("** ",data);
                var anchor = angular.element('<a/>');
                anchor.attr({
                    href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
                    target: '_blank',
                    download: 'tarjetasBoletin.csv'
                })[0].click();
            }).
            error(function(data, status, headers, config) {
                alert('Se produjo error al extraer el archivo' )
            });
    };




    $scope.exportarExcelDetalle = function () {
        $scope.grillaDetalle.query.export=1;
        $scope.promise = $http({
            method: 'GET',
            url: '/api/reportes/reporteTarjetasBoletinDetalleExport', //+ $scope.grilla.query.periodo + '/' + $scope.grilla.query.order
            params: $scope.grillaDetalle.query
        }).success(function(data, status, headers, config) {
                console.log("** ",data);
                var anchor = angular.element('<a/>');
                anchor.attr({
                    href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data),
                    target: '_blank',
                    download: 'tarjetasBoletinDetalle.csv'
                })[0].click();
            }).
            error(function(data, status, headers, config) {
                alert('Se produjo error al extraer el archivo' )
            });
    };
/*
    function normalizePeriod() {
        $scope.grilla.query.periodo = $scope.periodo.replace('-', '');
    }
    */
});
