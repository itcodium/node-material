
var CONFIGURACIONCONTABLE_COLUMNS=[
    { id: 2, show: true, name: 'idProceso', field: 'idProceso', tip: ''},
    { id: 3, show: true, name: 'Codigo Asiento', field: 'codigoAsiento', tip: ''},
    { id: 4, show: true, name: 'Cuenta Debito', field: 'cuentaDebito', tip: ''},
    { id: 5, show: true, name: 'Cuenta Credito', field: 'cuentaCredito', tip: ''}
]

var ConfiguracionContable=function($scope,$resource,$filter){

    this.getData=function(id) {
        var url='/api/configuracionContable/'+id;
        $scope.promiseConfiguracionContable= $resource(url).query(
            function success(data) {
                $scope.configuracionContable.data = data;
            },
            function error(error) {
                console.log("Success Data", error)
            }
        ).$promise;
    }

    this.onReorder=function(order) {
        var reverse=order[0]=='-'?true:false;
        $scope.configuracionContable.data =$filter('orderObjectBy')($scope.configuracionContable.data , order,reverse);
    }
    this.removeFilter=function () {
        $scope.configuracionContable.filter.show = true;
        $scope.configuracionContable.query.filter = '';
        if(typeof $scope.configuracionContable.formFilter!='undefined'){
            if ($scope.configuracionContable.formFilter.$dirty) {
                $scope.configuracionContable.formFilter.$setPristine();
            }
        }
    }

    this.configuracionContableUpdate=function($event,column,row){
        this.getData(3289);
        console.log("$event,column,row",$event,column,row)
    }

    this.showVal = function(value, filter) {
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


app.controller('configuracionContable.ctrl',
    function ($scope,$resource,$filter) {
        $scope.configuracionContable= {
            "selected": [],
            "columns":CONFIGURACIONCONTABLE_COLUMNS,
            "data": [],
            "count": 0,
            "filter": {
                show: true,
                options: {
                    debounce: 500
                }
            },
            "query": {
                filter: '',
                limit: '5',
                order: 'idProceso',
                page: 1,
            }
        };
        $scope.config=new ConfiguracionContable($scope,$resource,$filter);
        $scope.config.getData(5302);
    });

