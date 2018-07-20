
var CONFIGURACIONCONTABLE_COLUMNS=[
    { id: 10, show: true, name: 'Proceso', field: 'proceso', tip: ''},
    { id: 11, show: false, name: 'idConfiguracionContable', field: 'idConfiguracionContable', tip: ''},
    { id: 12, show: false, name: 'idProceso', field: 'idProceso', tip: ''},
    { id: 13, show: true, name: 'Código', field: 'codigoAsiento', tip: ''},
    { id: 14, show: true, name: 'Cuenta débito', field: 'cuentaDebito', tip: ''},
    { id: 15, show: true, name: 'Cuenta crédito', field: 'cuentaCredito', tip: ''},
]



app.filter('myTableFilter', function(){
    return function(dataArray, searchTerm) {
        if (!dataArray) {
            return;
        }
        if (!searchTerm) {
            return dataArray;
        }
        else {
            if( searchTerm.length>=3) {
                if (typeof searchTerm != 'undefined' && searchTerm.length < 3) {
                    return dataArray;
                }
                var term = searchTerm.toLowerCase();
                return dataArray.filter(function(item){
                    var itemProceso = item.proceso.toLowerCase().indexOf(term.toLowerCase()) ===0;
                    var itemCodigoAsiento = item.codigoAsiento.toLowerCase().indexOf(term.toLowerCase()) ==0;
                    var itemCuentaDebito = item.cuentaDebito .toLowerCase().indexOf(term.toLowerCase()) ===0;
                    var itemCuentaCredito = item.cuentaCredito.toLowerCase().indexOf(term.toLowerCase()) ==0;
                    return itemProceso || itemCodigoAsiento|| itemCuentaDebito||itemCuentaCredito ;
                });
            }else{return dataArray}
        }
    }
});


var ConfiguracionContableControl=function($scope,$resource,$filter,$mdEditDialog,Global,$q,ConfiguracionContable,$mdToast){
    this.getData=function(id) {
        var url='/api/configuracionContable/'+id;
        var _this=this;
        var deferred = $q.defer();
        $scope.promiseConfiguracionContable = deferred.promise;
        $resource(url).query(
            function success(data) {
                $scope.configuracionContable.data = data;
                deferred.resolve();
            },
            function error(err) {
                _this.showErrorToast('error', err.data.message);
                $scope.configuracionContable.data={};
                deferred.resolve();
            }
        );
    }
    this.update=function (data, onError){
        var _this=this;
        var deferred = $q.defer();
        $scope.promise = deferred.promise;
         ConfiguracionContable.update({ idConfiguracionContable: data.idConfiguracionContable },data, function (res) {
            deferred.resolve();
            _this.showToastSuccess ();
         },
         function (err) {
             if (onError) {
                onError();
             }
            deferred.resolve();
            _this.showErrorToast('error', err.data.message);
         });
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
    this.editRow=function(ev,data,row){
        var _this=this;

        _this.dataRow=data;
        var template= (user.app == 'TC'? '<input name="input" ng-required=true ng-model="model.value" md-autofocus type="text" placeholder="Cuenta por" max="99999999999999999999"  ng-minlength="9"  ng-maxlength="20" maxlength="20" ng-pattern="/^[0-9]*$/" />'
                                    :    '<input name="input" ng-model="model.value" md-autofocus type="text" placeholder="Cuenta" max="99999999999999999999"  ng-minlength="9"  ng-maxlength="20" maxlength="20" ng-pattern="/^[0-9]*$/" />') +
            '<div ng-show="editDialog.$submitted || editDialog.input.$touched">' +
            (user.app = 'TC'? '   <div class="md-input-message-animation ng-scope" ng-show="editDialog.input.$error.required">El valor es requerido</div>' : '') +
            '   <div class="md-input-message-animation ng-scope" ng-show="editDialog.input.$error.minlength">Ingresar al menos 9 caracteres.</div>' +
            '   <div class="md-input-message-animation ng-scope" ng-show="editDialog.input.$error.maxlength">Ingresar 20 caracteres como maximo.</div>' +
            '   <div class="md-input-message-animation ng-scope" ng-show="editDialog.input.$error.pattern">Ingresar números enteros</div>' +
            '</div>';
        var originalValue = data[row.field];

        if(row.field =="cuentaDebito" || row.field =="cuentaCredito"){
            data["originalValue"]=  data[row.field];
        }else{
            return;
        }
        _this.editField({
            event: ev,
            data: data,
            initialValue: { hide:"Error", value:data[row.field],type:"text",fieldName:row.field},
            msg: 'cuenta por',
            callback: function (input) {
                data[row.field] = input.$modelValue;
                // Caso para recibir un objeto
                // data[this.initialValue.fieldName]=this.initialValue.value;
            },
            onError: function () {
                data[row.field] = originalValue;
            },
            controlTemplate: template
        });


    }
    // --------------------------------------------------------------------------
    this.editField=function(param){
        const getValorOtraCuenta = () => {
            if (param.initialValue.fieldName === 'cuentaDebito')
                return param.data.cuentaCredito;
            else
                return param.data.cuentaDebito
        };

        var _this=this;

        param.event.stopPropagation();
        var promise = $mdEditDialog.large({
            modelValue: param.initialValue,
            placeholder: 'Ingresar ' + param.msg,
            save: function (input) {
                param.data.modificadoPor = Global.currentUser.name;
                if(typeof param.initialValue.value=='undefined'){
                    _this.showErrorToast("Error","No se ha seleccionado un valor.")
                    return;
                }
                if(param.initialValue.value != '' && isNaN(parseFloat(param.initialValue.value)) && isFinite(param.initialValue.value)){
                    _this.showErrorToast("Error","El valor ingresado no es un numero valido.");
                    return;
                }
                if (param.initialValue.value === '' && (getValorOtraCuenta() || '') == '' ) {
                    _this.showErrorToast("Error","Al menos una de las cuentas debe estar completada");
                    return;
                }
                if (param.callback) {
                    param.callback(input);
                }
                _this.update(param.data, param.onError);
            },
            targetEvent: param.event,
            title: 'Modificar ' + param.msg,
            controlTemplate: param.controlTemplate,
            validators: {
                'ng-required': true
            }
        });

        promise.then(function (ctrl) {
            var input = ctrl.getInput();
            input.$viewChangeListeners.push(function () {
                input.$setValidity('test', input.$modelValue !== 'test');
            });
        });
    };



    // --------------------------------------------------------------------------

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
    this.showErrorToast = function(type, msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
            hideDelay: 3000,
            parent: '#toastSelect',
            position: 'top left'
        });
    };
    this.showToastSuccess = function() {
        $mdToast.show({
            template: '<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>',
            hideDelay: 3000,
            parent: '#toastSelect',
            position: 'top left'
        });
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
    function ($scope,$resource,$filter,$mdEditDialog,Global, $q,ConfiguracionContable,$mdToast ) {
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
                order: 'proceso',
                page: 1,
            }
        };
        $scope.tituloPagina='Contabilidad'
        $scope.config=new ConfiguracionContableControl($scope,$resource,$filter,$mdEditDialog,Global, $q,ConfiguracionContable,$mdToast );
        $scope.config.getData();
    });
