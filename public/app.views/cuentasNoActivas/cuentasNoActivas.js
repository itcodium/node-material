/**
 * Created by BP4-Admin on 02/06/2016.
 */
app.controller('cuentasNoActivas.ctrl', ['$scope', '$mdToast', 'Global', '$resource', '$timeout', 'Excel', 'CuentasNoActivas',
    function ($scope, $mdToast, Global, $resource, $timeout, Excel, CuentasNoActivas) {
        var today = new Date();
        $scope.promise = null;
        $scope.columnTitles = ['N° de Beneficiario', 'CUIL', 'N° Caja de Ahorro', 'Categoría', 'Estado de Cuenta', 'Producto Bancario', 'Convenio'];
        $scope.convenios = [];
        $scope.cuentasNoActivas = {
            query: {
                periodo: parseInt(today.getFullYear() + ('0' + (today.getMonth() + 1)).slice(-2)),
                convenio: null,
                limit: '5',
                order: 'nameToLower',
                page: 1
            },
            data: [],
            count: 0
        };
        
        $scope.periodoActual = '';
        $scope.periodo = '';
        $scope.loading = true;
        $scope.controlData = {
            buscarPeriodo: false
        };

        $scope.exportarAExcel = function(){
            var filteredArray = $scope.cuentasNoActivas.data.filter($scope.filtroConvenio);
            if (filteredArray.length > 0) {
                var properties = ['nroBenef', 'CUIL', 'nroCajaAhorro', 'categoria', 'estadoCuenta', 'prodBancario', 'convenio'];
                Excel.arrayToExcel(filteredArray, $scope.columnTitles, 'Cuentas No Activas Periodo: ' + ($scope.periodo !== '' ? $scope.periodo : $scope.periodoActual), properties);
            }
        };

        $scope.init = function () {
            $resource('/api/periodos/cuentasNoActivas').query(function (data) {
                $scope.periodos = data.map(function (it) {
                    return {
                        val: it.fecLiquid.replace('-', ''),
                        text: it.fecLiquid
                    }
                });
            });
            $scope.getData();
        };

        $scope.removerFiltro = function () {
            $scope.controlData.buscarPeriodo = false;
            $scope.getData();
        };

        $scope.selectPeriodo = function () {
            $scope.getData(angular.extend($scope.cuentasNoActivas.query, {page: 1}));
        };

        $scope.selectConvenio = function () {
            $scope.cuentasNoActivas.query.page = 1;
        };

        $scope.filtroConvenio = function (elemento) {
            return (elemento.convenio === $scope.cuentasNoActivas.query.convenio) || $scope.cuentasNoActivas.query.convenio === null;
        };

        $scope.getData = function (query) {
            $scope.loading = true;
            $scope.convenios = [];
            $scope.promise = CuentasNoActivas.query(query || $scope.cuentasNoActivas.query, success, error).$promise;
            function success(data) {
                $scope.cuentasNoActivas.data = data;
                if ($scope.cuentasNoActivas.data.length > 1) {
                    $scope.cuentasNoActivas.data.forEach(function (cuenta) {
                       if ($scope.convenios.indexOf(cuenta.convenio) < 0) {
                           $scope.convenios.push(cuenta.convenio)
                       }
                    });
                }
                $scope.loading = false;
                $scope.cuentasNoActivas.count = data.length;
                $scope.cuentasNoActivas.query.page = 1;
            }

            function error (err) {
                $scope.showErrorToast('Error', err.data.message);
            }
        };

        $scope.showErrorToast = function(type, msg) {
            $mdToast.show({
                template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        };

        $scope.init();
    }]);