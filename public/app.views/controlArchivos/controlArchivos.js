/**
 * Created by BP4-Admin on 23/05/2016.
 */
app.controller('controlArchivos.ctrl', ['$scope', '$mdToast','$mdDialog', 'Global', '$resource', '$mdEditDialog', 'ControlArchivos', '$q', 'Excel', '$mdSidenav',
function ($scope, $mdToast,$mdDialog , Global, $resource, $mdEditDialog, ControlArchivos, $q, Excel, $mdSidenav) {
    $scope.promise = null;

    $scope.periodoActual = '';
    $scope.periodo = '';
    $scope.periodos = [];
    $scope.archivos = [];
    $scope.archivosMCMK = [];
    $scope.archivosVIAX = [];
    $scope.instanciasData = {};
    $scope.controlData = {
        instancia1: false,
        instancia2: false,
        instancia3: false,
        instancia4: false,
        grupo1: false,
        grupo2: false,
        grupo3: false,
        grupo4: false,
        buscarPeriodo: false
    };

    $scope.init = function () {
        var today = new Date();
        $scope.periodoActual = today.getFullYear() + "-" + ('0' + (today.getMonth() + 1)).slice(-2);
        $resource('/api/periodos').query(function (data) {
            $scope.periodos = data;
            if (data.filter(function (it) { return it.periodo === $scope.periodoActual; }).length === 0) {
                $scope.periodos.unshift({periodo: $scope.periodoActual});
            }
            $scope.periodo = $scope.periodoActual;
        });
        $scope.getData();
    };

    $scope.removerFiltro = function () {
        $scope.controlData.buscarPeriodo = false;
        $scope.getData();
    };

    $scope.selectPeriodo = function () {
        $scope.getData($scope.periodo);
    };

    $scope.exportarAExcel = function () {
        var name = 'Control de Archivos, Periodo ' + ($scope.periodo !== '' ? $scope.periodo : $scope.periodoActual);
        Excel.tableToExcel(['#archivosMC', '#archivosVI'], name);
    };

    $scope.getData = function (period) {
        if (!period) {
            period = $scope.periodoActual;
        }
        $scope.promise = $resource('/api/controlArchivos/' + period).query(success).$promise;
        function success(data) {
            $scope.archivos = data;
            parsearArchivos();
        }
    };


    $scope.enviarEmail = function (index,tipo) {

        var codigo=""
        var codigoLog=""

        var idPeriodo="";
        if(tipo=='MC'){
            codigo='AUTCOBISMC';
            $scope.I2= $scope.archivosMCMK.filter(function (it) { return it.instancia == index });
        }

        if(tipo=='VIAX'){
            codigo='AUTCOBISVIAX';
            $scope.I2= $scope.archivosVIAX.filter(function (it) { return it.instancia == index });
        }

        console.log("Tipo: ",tipo,$scope.I2);

        if ($scope.I2.length>0){

            var VI=0;
            var AX=0;
            var MC=0;

            for(var i=0; i < $scope.I2.length; i++) {
                if($scope.I2[i].marca=='MC'){
                    MC=1;
                }
                if($scope.I2[i].marca=='VI'){
                    VI=1;
                }
                if($scope.I2[i].marca=='AX'){
                    AX=1;
                }
            }

            var listFiles="";
            var vInstancia=$scope.I2[0].instancia;
            codigo=codigo+vInstancia;
            idPeriodo=$scope.I2[0].idPeriodo;
            if (MC==1){
                codigoLog='MC';
            }
            if(AX==1 & VI==1){
                codigoLog='VIAX';
            }

            for(var i=0;i<$scope.I2.length;i++){
                // 2017-03-21 se filtra la entidad 567 para que no se envie por email
                if($scope.I2[i].entidad!="567"){
                    listFiles=listFiles+$scope.I2[i].nombre+";";
                }
            }
            listFiles = listFiles.substring(0, listFiles.length - 1);

            $scope.promise = $resource('/api/controlArchivos/enviarArchivo').save(
                {   files:listFiles,
                    codigo:codigo,
                    tipo:tipo,
                    instancia:vInstancia,
                    idPeriodo:idPeriodo,
                    codigoLog:codigoLog,
                    usuario: user.nombre
                },success_word,error_word).$promise;

            function success_word(data) {
                console.log(data, data.tipo,data.instancia);
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .textContent('Se ha enviado la solicitud de procesamiento.')
                        .ariaLabel('Alert Dialog Demo')
                        .ok('Aceptar')
                );
                $scope.actualizarEmailIcon(data.instancia,data.tipo);
            }

            function error_word(err) {
                $mdDialog.show(
                    $mdDialog.alert()
                        .clickOutsideToClose(true)
                        .textContent('Se produjo un error al procesar la solicitud:  '+err.data.message)
                        .ariaLabel('Alert Dialog Demo')
                        .ok('Aceptar')
                );

            }
        }
        // enviar datos
    };



    $scope.actualizarEmailIcon= function(instancia,tipo){
        console.log("tipo,instancia",instancia,tipo);
        if(tipo=='MC'){
            switch(instancia) {
                case '1':
                    $scope.instanciasData.envioMail1= true;
                    break;
                case '2':
                    $scope.instanciasData.envioMail2= true;
                   break;
                case '3':
                    $scope.instanciasData.envioMail3= true;
                    break;
                case '4':
                    $scope.instanciasData.envioMail4= true;
                    break;
                default:
                // default code block
            }
        }

        if(tipo=='VIAX'){
            switch(instancia) {
                case '1':
                    $scope.instanciasData.viax1.envioMail= true;
                    break;
                case '2':
                    $scope.instanciasData.viax2.envioMail= true;
                    break;
                case '3':
                    $scope.instanciasData.viax3.envioMail= true;
                    break;
                case '4':
                    $scope.instanciasData.viax4.envioMail= true;
                    break;
                default:
                // default code block
            }
        }

    }

    var f = new Date();
    var dato="6";
    var pad="00";

    $scope.showToastSuccess = function() {
        $mdToast.show({
            template: '<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>',
            hideDelay: 3000,
            parent: '.toastParent',
            position: 'top left'
        });
    };

    $scope.showErrorToast = function(type, msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
            hideDelay: 3000,
            parent: '.toastParent',
            position: 'top left'
        });
    };

    $scope.editarCobis = function (event, archivo) {
        event.stopPropagation();
        var originalValue = archivo.cantRegCobis;

        var promise = $mdEditDialog.large({
            modelValue: archivo.cantRegCobis,
            placeholder: 'Ingresar Cantidad de Registros Cobis',
            numeric: true,
            save: function (input) {
                archivo.cantRegCobis = input.$modelValue;
                archivo.modificadoPor = Global.currentUser.name;
                var deferred = $q.defer();
                $scope.promise = deferred.promise;
                ControlArchivos.update({
                    idPeriodo: archivo.idPeriodo,
                    idMarca: archivo.idMarca,
                    cantRegCobis: archivo.cantRegCobis,
                    usuario: archivo.modificadoPor
                }, function (res) {
                    deferred.resolve();
                    $scope.showToastSuccess();
                },
                function (err) {
                    archivo.cantRegCobis = originalValue;
                    deferred.resolve();
                    $scope.showErrorToast('error', err.data.message);
                });
            },
            targetEvent: event,
            title: 'Modificar Cantidad de Registros Cobis',
            validators: {
                'ng-required': true,
                'min': '0'
            }
        });

        promise.then(function (ctrl) {
            var input = ctrl.getInput();
        });
    };




    $scope.showRow=function(list,tabla){

        if(typeof tabla=='undefined')
        {
            return false;
        }
        console.log('Tabla ->',tabla);
        var result= _.find(list, function(item){ return item.toUpperCase()== tabla.trim().toUpperCase(); });
        if(typeof result=='undefined'){
            result=false;
            console.log('list->',list);

        }else{
            console.log('Result->',result);
        }
        return result;
    }


    $scope.mostrarEncabezado = function (tabla, idEncabezado, nombreArchivo) {

        $scope.tabla = tabla;
        // console.log("$scope.tabla ,tabla",$scope.tabla ,tabla)
        $scope.nombreArchivoEncabezado = nombreArchivo;
        $mdSidenav('rightNavEncabezado').toggle();
        $scope.promiseEncabezado =
            $resource('/api/controlArchivosEncabezado')
                                    .query({ tabla: tabla, idEncabezado: idEncabezado }, success).$promise;

        function success(data) {

            $scope.encabezado = data[0];
            console.log("$scope.encabezado ",$scope.encabezado );
        }
    };

    $scope.init();

    function parsearArchivos() {
        $scope.archivosMCMK = $scope.archivos.filter(function (it) { return it.marca !== 'VI' && it.marca !== 'AX'; });
        $scope.archivosVIAX = $scope.archivos.filter(function (it) { return it.marca === 'VI' || it.marca === 'AX'; });
        actualizarEstructurasControl();
    }

    function actualizarEstructurasControl() {
        actualizarEstructuraControlMKMC();
        actualizarEstructuraControlVIAX();
    }

    function actualizarEstructuraControlMKMC() {

        var inst1 = {};
        if ((inst1 = $scope.archivosMCMK.filter(function (it) { return it.instancia === "1"; })[0])) {
            $scope.instanciasData.fechaCierre1 = parseDate(inst1.fecCierre);
            $scope.instanciasData.fechaControl1 = parseDate(inst1.fecControl);
            $scope.controlData.instancia1 = true;
            $scope.instanciasData.envioMail1= inst1.envioMail;
        }
        else {
            $scope.controlData.instancia1 = false;
        }

        var inst2 = {};
        if ((inst2 = $scope.archivosMCMK.filter(function (it) { return it.instancia === "2"; })[0])) {
            $scope.instanciasData.fechaCierre2 = parseDate(inst2.fecCierre);
            $scope.instanciasData.fechaControl2 = parseDate(inst2.fecControl);
            $scope.controlData.instancia2 = true;
            $scope.instanciasData.envioMail2 = inst2.envioMail;
        }
        else {
            $scope.controlData.instancia2 = false;
        }

        console.log("actualizarEstructuraControlMKMC",$scope.instanciasData.envioMail2,inst2);
        var inst3 = {};
        if ((inst3 = $scope.archivosMCMK.filter(function (it) { return it.instancia === "3"; })[0])) {
            $scope.instanciasData.fechaCierre3 = parseDate(inst3.fecCierre);
            $scope.instanciasData.fechaControl3 = parseDate(inst3.fecControl);
            $scope.controlData.instancia3 = true;
            $scope.instanciasData.envioMail3 = inst3.envioMail;
        }
        else {
            $scope.controlData.instancia3 = false;
        }

        var inst4 = {};
        if ((inst4 = $scope.archivosMCMK.filter(function (it) { return it.instancia === "4"; })[0])) {
            $scope.instanciasData.fechaCierre4 = parseDate(inst4.fecCierre);
            $scope.instanciasData.fechaControl4 = parseDate(inst4.fecControl);
            $scope.controlData.instancia4 = true;
            $scope.instanciasData.envioMail4 = inst4.envioMail;
        }
        else {
            $scope.controlData.instancia4 = false;
        }

    }




    function actualizarEstructuraControlVIAX() {
        var grupo1 = {};
        if ((grupo1 = $scope.archivosVIAX.filter(function (it) { return it.instancia === "1"; })[0])) {
            $scope.controlData.grupo1 = true;
            $scope.instanciasData.viax1 = {};
            $scope.instanciasData.viax1.envioMail = grupo1.envioMail;
        }
        else {
            $scope.controlData.grupo1 = false;
        }

        var grupo2 = {};
        if ((grupo2 = $scope.archivosVIAX.filter(function (it) { return it.instancia === "2"; })[0])) {
            $scope.controlData.grupo2 = true;
            $scope.instanciasData.viax2 = {};
            $scope.instanciasData.viax2.envioMail = grupo2.envioMail;
        }
        else {
            $scope.controlData.grupo2 = false;
        }

        var grupo3 = {};
        if ((grupo3 = $scope.archivosVIAX.filter(function (it) { return it.instancia === "3"; })[0])) {
            $scope.controlData.grupo3 = true;
            $scope.instanciasData.viax3 = {};
            $scope.instanciasData.viax3.envioMail = grupo3.envioMail;
        }
        else {
            $scope.controlData.grupo3 = false;
        }

        var grupo4 = {};
        if ((grupo4 = $scope.archivosVIAX.filter(function (it) { return it.instancia === "4"; })[0])) {
            $scope.controlData.grupo4 = true;
            $scope.instanciasData.viax4 = {};
            $scope.instanciasData.viax4.envioMail = grupo4.envioMail;
        }
        else {
            $scope.controlData.grupo4 = false;
        }
    }

    function parseDate(datetime)
    {
        var date = datetime.split('T')[0];
        var dateParts = date.split('-');

        return dateParts[2] + '/' + dateParts[1] + '/' + dateParts[0];
    }
}]);