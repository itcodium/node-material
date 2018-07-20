app.controller('reporteRecargables.ctrl', function($scope, $resource, $mdToast, ReporteRecargables) {
    $scope.reports = ['Recargable - Cereo VI', 'Recargable - Ajuste Salta VI'];
    $scope.promiseRecargable = null;
    $scope.grid = {
        filterShow:false,
        data: [],
        count: 0
    };
    $scope.detailGrid = {
        "query": {
            report: 'Recargable - Cereo VI',
            limit: '5',
            order: 'sucursal',
            page: 1
        },
        filterShow:false,
        data: [],
        count: 0,
        message: ''
    };

    $scope.load = function () {
        if ($scope.detailGrid.query.report === 'Recargable - Cereo VI') {
            $scope.tituloSucursalEntidad = 'Sucursal';
            $scope.tituloBancoEntidad = 'Banco';
        } else {
            $scope.tituloSucursalEntidad = 'Entidad';
            $scope.tituloBancoEntidad = 'Entidad';
        }
        $scope.promiseRecargable = ReporteRecargables.query($scope.detailGrid.query, success, error).$promise;

        function success(data) {
            $scope.grid.data = data.header;
            $scope.grid.count = $scope.grid.data.length;
            $scope.detailGrid.data = data.details;
            $scope.detailGrid.count = data.detailsRows;
            $scope.detailGrid.message = data.detailsRows === 0 ? 'No se encontraron datos' : '';
        }

        function error (err) {
            $mdToast.show({
                template: '<md-toast class="md-toast-error">' + err + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        }
    };

    $scope.formatNumber=formatNumber;
    $scope.exportToExcel = function () {
        if ($scope.detailGrid.query.report === 'Recargable - Cereo VI') {

            var csvString = getCSVString($scope.grid.data, angular.element('#grid thead th'));
            csvString = csvString + "\n" + getCSVString($scope.detailGrid.data, angular.element('#detalles thead th'));
            csvString = csvString.substring(0, csvString.length - 1);
            var a = $('<a/>', {
                style: 'display:none',
                href: 'data:application/octet-stream;base64,' + btoa(csvString),
                download: 'reporteRecargables.csv'
            }).appendTo('body');
            a[0].click();
            a.remove();
        }else{
            location.href="/api/reportes/recargablesSaltaExport";
        }

};

function getCSVString(array, titles) {
var csvString = '';
for (var i = 0; i < titles.length; i++) {
var title = titles[i].innerText;
csvString = csvString + title + ";";
}
csvString = csvString.substring(0,csvString.length - 1);
csvString = csvString + "\n";
for(var i = 0; i < array.length; i++){
var rowData = array[i];

    for (property in rowData) {


        if (property === "$$hashKey") {
            continue;
        }
        var columns=["cantRegTotales","cantRegAceptados","cantRegRechazados","cantidad"]

        if (!isNaN(parseInt(rowData[property])))
        {
            if (columns.indexOf(property)>-1 ){
                var val=formatNumber(rowData[property],',','.').replace('.00','')
                csvString = csvString + '' + (rowData[property] === null ? '' : val ) +';'; // convert here
            }
            else{
                csvString = csvString + '' + (rowData[property] === null ? '' : rowData[property]) + ';';
            }
        }
        else{
                csvString = csvString + (rowData[property] === null ? '' : rowData[property]) + ";";
        }
    }
csvString = csvString.substring(0,csvString.length - 1);
csvString = csvString + "\n";
}
return csvString;
}
});