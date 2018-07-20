/**
 * Created by Bruno on 31/08/2016.
 */
app.controller('sinRelacionConCuenta.ctrl', function($scope, $http, $resource, SinBeneficiarios, SinBeneficiariosArchivo) {
    $scope.promise = null;
    $scope.periodos = [];
    $scope.convenios = [];
    $scope.periodoActual = '';
    $scope.periodoHyphen = '';
    $scope.periodo = '';
    $scope.buscarPeriodo = false;
    $scope.columns = [
        { id: 0, show: true,  name: 'Agencia',              field: 'agencia',		tip: 'Agencia'          },
        { id: 1, show: true,  name: 'Beneficio',            field: 'beneficio',     tip: 'Beneficio'		},
        { id: 2, show: true,  name: 'N° de Beneficio',      field: 'nroBeneficio',  tip: 'N° de Beneficio'  },
        { id: 3, show: true,  name: 'Tipo DNI',             field: 'tipoDNI',		tip: 'Tipo DNI'         },
        { id: 4, show: true,  name: 'N° DNI',               field: 'nroDNI',        tip: 'N° DNI'           },
        { id: 5, show: true,  name: 'Cuenta',               field: 'cuenta',        tip: 'Cuenta'           },
        { id: 6, show: true,  name: 'Categoría',            field: 'categoria',     tip: 'Categoría'        },
        { id: 7, show: true,  name: 'Convenio',		        field: 'convenio',      tip: 'Convenio'         }
    ];

    $scope.grilla = {
        "query": {
            periodo: 0,
            convenio: null,
            limit: '10',
            order: 'agencia',
            page: 1
        },
        data: [],
        count: 0
    };

    $scope.init = function () {
        var today = new Date();
        $scope.periodoActual = parseInt(today.getFullYear() + ('0' + (today.getMonth() + 1)).slice(-2));
        $resource('/api/periodos/cuentasNoActivas').query(function (data) {
			console.log("- periodos -",data)
            $scope.periodos = data.map(function (it) { return it.fecLiquid; });
            $scope.periodoHyphen = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2);
            //$scope.periodos.unshift( $scope.periodoHyphen);
            $scope.periodo =  $scope.periodos[0];
			$scope.load();
        });
        
    };



    $scope.load = function (query) {
        normalizePeriod();
        $scope.promise = SinBeneficiarios.query(query || $scope.grilla.query, bien, mal ).$promise;

        function bien(obj) {
			console.log("*** obj *** ",obj)
            $scope.grilla.data = obj.data;
            if (obj.rows) {
                $scope.grilla.count = obj.rows;
                $scope.convenios = obj.convenios.map(function (convenio) { return convenio.convenio });
            }
			
			if (obj.data.length==0) {
				$scope.grilla.count = 0;
			}
        }

        function mal(obj) {
            alert('Se produjo error: ' + obj.data.name + ': ' +  obj.data.message)
        }
    };

    $scope.removeFilter = function () {
        $scope.buscarPeriodo = false;
        $scope.periodo = $scope.periodoHyphen;
        $scope.convenio = null;
        $scope.load();
    };

    $scope.onPaginate = function(page, limit) {
        $scope.load(angular.extend($scope.grilla.query, {page: page, limit: limit}));
    };

    $scope.onReorder = function(order) {
        $scope.load(angular.extend($scope.grilla.query, {order: order}));
    };

    $scope.selectConvenio = function () {
        $scope.load(angular.extend($scope.grilla.query, {page: 1}));
    };

    $scope.selectPeriodo = function () {
        $scope.load(angular.extend($scope.grilla.query, {page: 1}));
    };

    $scope.exportExcel = function () {
        if ($scope.grilla.count === 0) {
            return;
        }
        normalizePeriod();
        $scope.promise = SinBeneficiariosArchivo.query($scope.grilla.query, function(data, status, headers, config) {
            var anchor = angular.element('<a/>');
            anchor.attr({
                href: 'data:attachment/csv;charset=utf-8,' + encodeURI(data.data),
                target: '_blank',
                download: 'sinRelacion.csv'
            })[0].click();
        }, function(data, status, headers, config) {
            alert('Se produjo error al extraer el archivo' )
        });
    };

    function normalizePeriod() {
        $scope.grilla.query.periodo = $scope.periodo.replace('-', '');
    }
});
