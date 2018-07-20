/**
 * Created by Bruno on 31/08/2016.
 */




app.controller('bajaApoderados.ctrl', function($scope, $http, $resource,$mdDialog,$mdToast, $timeout, BajaApoderadosArchivo) {
    $scope.promise = null;
    $scope.periodos = [];
    $scope.convenios = [];
    $scope.periodoActual = '';
    $scope.periodoHyphen = '';
    $scope.periodo = '';
    $scope.buscarPeriodo = false;
    $scope.columns = [
        { id: 0, show: true,  name: 'Benef 12 Dig',              field: 'benef12Digitos',		tip: 'Benef 12 Dig'          },
        { id: 1, show: true,  name: 'Nombre Apellido Apod',            field: 'apeYNombre',     tip: 'Nombre Apellido Apod'		},
        { id: 2, show: true,  name: 'TD APOD',      field: 'tipoDocumento',  tip: 'TD APOD'  },
        { id: 3, show: true,  name: 'ND APOD',             field: 'nroDocumento',		tip: 'ND APOD'         },
        { id: 4, show: true,  name: 'Nº COBIS',               field: 'nroCliente',        tip: 'Nº COBIS'           },
        { id: 5, show: true,  name: 'CTA',               field: 'nroCuenta',        tip: 'CTA'           }
    ];


    $scope.grilla = {
        "query": {
            periodo: 0,
            convenio: '',
            limit: '5',
            order: 'convenio',
            page: 1,
            export:0,
            personas_enviar:3
        },
        data: [],
        count: 0
    };

    $scope.init = function () {
        var today = new Date();
        $scope.periodoActual = parseInt(today.getFullYear() + ('0' + (today.getMonth() + 1)).slice(-2));
        $resource('/api/periodos/bajaClientes').query(function (data) {
            $scope.periodos = data.map(function (it) { return it.fecLiquid; });
            $scope.periodoHyphen = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2);
            $scope.periodo =  $scope.periodoHyphen;
           // $scope.periodo =  $scope.periodos[0];
            normalizePeriod()
            $scope.grilla.query.periodo = $scope.periodo.replace('-', '');
           // $scope.load();
        });
    };


    $resource('/api/bajaClientes/convenios').query(function (data) {
        $scope.convenios=data;
        $scope.convenios.unshift({"convenio":null})
    });


    $scope.load = function (query) {
        normalizePeriod();
        //console.log("query || $scope.grilla.query",query || $scope.grilla.query);
        $scope.grilla.query.export=0;
        $scope.promise = BajaApoderadosArchivo.query(query || $scope.grilla.query, bien, mal ).$promise;
        function bien(obj) {
            $scope.grilla.data = obj.data;
                if (obj.rows) {
                    $scope.grilla.count = obj.rows;
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

    $scope.exportExcel = function (ev) {
        if ($scope.grilla.count === 0) {
            return;
        }
        normalizePeriod();

        var b=new BajaApoderados($scope,$http,$mdDialog,$mdToast, $timeout,ev,BajaApoderadosArchivo);
            b.ingresarCantidadDestinatarios();


        /*
        $scope.grilla.query.export=1;
        $scope.promise = BajaApoderadosArchivo.query($scope.grilla.query, bien, mal ).$promise;
        function bien(obj) {
            console.log("Bien -> ",obj.data);
        }
        function mal(obj) {
            alert('Se produjo error: ' + obj.data.name + ': ' +  obj.data.message)
        }
        */
    };

    function normalizePeriod() {
        $scope.grilla.query.periodo = $scope.periodo.replace('-', '');
    }
});

var BajaApoderados=function ( $scope,$http,$mdDialog,$mdToast, $timeout,ev,BajaApoderadosArchivo) {
    var cantidad_personas=1;
    this.ingresarCantidadDestinatarios=function(ev){
        var _this=this;
        var confirm = $mdDialog.prompt()
            .title('Cuántos archivos desea generar?')
            // .textContent('Ingresar cantidad de destinatarios:')
            .placeholder('Cantidad')
            .ariaLabel('Dog name')
            .initialValue('')
            .targetEvent(ev)
            .ok('Aceptar')
            .cancel('Cancelar');

        $mdDialog.show(confirm).then(function(result) {
            if(_this.validarNumero(result)){
                _this.cantidad_personas=result;
                _this.GenerarYEnviarArchivos();
                console.log("result ->",result)
            }else{
                _this.showAlert("error","El numero que se ha ingresado no es valido.")
            }

        }, function() {
          //  $scope.status = 'You didn\'t name your dog.';
        });

    }
    this.GenerarYEnviarArchivos= function () {
        var _this=this;
        $scope.grilla.query.export=1;
        $scope.grilla.query.personas_enviar=_this.cantidad_personas;
        $scope.delayButton=true;
        $scope.promise = BajaApoderadosArchivo.query($scope.grilla.query, bien, mal ).$promise;
        function bien(obj) {
            _this.showAlert('toastSuccess','Se ha ejecuiatado el proceso de envio de archivos.')
            $timeout(function() {
                $scope.delayButton=false;
            }, 1000*20);
        }
        function mal(obj) {
            _this.showAlert('error','Se produjo error: ' + obj.data.name + ': ' +  obj.data.message)
            $timeout(function() {
                console.log("OUT");
                $scope.delayButton=false;
            }, 1000*20);
        }
    };
    this.validarNumero= function (value) {
        var result=false;
        if (/^([0-9])*$/.test(value)){
            result=true;
        }
        return result;
    };
    this.showAlert= function (type,msg) {
        var _this=this;
        $mdToast.show({

            template: '<md-toast class="md-toast ' + type +'">' + msg + '</md-toast>',
            hideDelay: 3000,
            parent: '.toastParent',
            position: 'top left'
        });
    };
}
