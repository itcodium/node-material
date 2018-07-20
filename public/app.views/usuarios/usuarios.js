/**
 * Created by AOB on 14/08/2015.
 */
app.controller('usuarios.ctrl', [    '$scope',  '$resource',  '$filter', '$timeout', 'datacontext', 'Usuarios', 'Global',
    function ($scope,  $resource, $filter, $timeout, datacontext, $Usuarios, Global) {
        Global.setModule('user');
        //
        $scope.data= {};
        $scope.params = {};
        $scope.gUsersSelected = [];

        //region BANDONEON - Configuraciones Generales
        $scope.bd = {};
        $scope.bd.isOpen = { b1: true, b2: false};
        $scope.bd.disabled = { b1: false, b2: false};
        $scope.bd.closed = { b1: false, b2: false};
        $scope.bd.keepOpen = { b1: false, b2: false};
        //endregion of BANDONEON

        //region Datos para el DATEPICKER
        //new todos los obj datepicker en scope.dtp (en principal y modal)
        $scope.dtp = {};
        $scope.dtp.open = function ($event, opened) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.dtp[opened] = !$scope.dtp[opened];
        };
        //endregion  (datos de los datepicker)

        $scope.alerts = [];
        $scope.closeAlert = function (index) {
            if (index) {
                $scope.alerts.splice(index, 1);
            } else {
                $scope.alerts = [];
            }
        };

        //region FRONTDOOR functions   + Keypress (control de la navegabilidad)
        $scope.frontDoor = function (action, $event, btn) {

            //matams cualquier otro evento (para que no vaya al bandoneon por el default click, por ejemplo)
            //$event.preventDefault();
            //$event.stopPropagation();

            switch (action) {
                case 'addUser':
                    //window.location.href = "/usuarios";
                    window.location.href = "/precargausuario";

                    break;
                case 'editUser':
                    window.location.href = "/usuarios/"+$scope.gUsersSelected[0]._id;
                    break;
                default:
            }
        };

        //region FUNCIONES PUBLICAS Y PRIVADAS MANEJO BANDONEON
        $scope.btnCancelABM = function() {
            closeUnBandoneon(2);
            //resetForm();  //todo:caob: limpr form
        }

        $scope.closeBandoneon = function(idBd, $event) {
            $event.preventDefault();
            $event.stopPropagation();

            closeUnBandoneon(idBd);
        }
        function closeAllBandoneon(isTree) {
            if (isTree == undefined) {
                isTree = false;
            }

            for (var x in $scope.bd.closed) {
                if (x != "b1") {
                    if (!(isTree && x == "b3")){
                        $scope.bd.closed[x] = true;
                        $scope.bd.isOpen[x] = false;
                    }
                } else {
                    $scope.bd.isOpen[x] = true;
                }
            }
        }
        function openUnBandoneon(IdBD) {

            //$scope.bd.isOpen["b" + IdBD] = true;
            for (var x in $scope.bd.isOpen) {
                if ($scope.bd.isOpen[x]) {
                    $scope.bd.isOpen[x] = false;
                }
            }

            if ($scope.bd.closed["b" + IdBD]) {
                $scope.bd.closed["b" + IdBD] = false;
            }
            $scope.bd.isOpen["b" + IdBD] = true;
        }

        function closeUnBandoneon(IdBD) {
            $scope.bd.isOpen["b" + IdBD] = false;
            $scope.bd.closed["b" + IdBD] = true;
            if (IdBD > 3) {
                if (!$scope.bd.closed["b3"]) {
                    $scope.bd.isOpen["b3"] = true;
                } else {
                    $scope.bd.isOpen["b1"] = true;
                }
            } else {
                $scope.bd.isOpen["b1"] = true;
            }
        }
        //endregion

        //region GRILLAS
        /* Grilla Principal - Lista de Usuarios */
        $scope.gUsers = {
            data: 'gUsersData',
            columnDefs: [
                { field: '_id', displayName: 'Id', width: 50, visible: false },
                { field: 'name', displayName: 'Nombre' },
                { field: 'username', displayName: 'Usuario' },
                { field: 'email', displayName: 'Email' },
                { field: 'dataInst.insInstitucion', displayName: 'Institucion' },
                { field: 'dataPerfil.descripcion', displayName: 'Perfil' },
                { field: 'fecha_creacion', displayName: 'Fecha Carga', cellFilter: 'date :"dd/MM/yyyy"' },
                { field: 'fecha_modificacion', displayName: 'Fecha Ult. Modificación', cellFilter: 'date :"dd/MM/yyyy"' },
                { field: 'modificado_por', displayName: 'Usuario Modificador' }
            ],
            selectedItems: $scope.gUsersSelected,
            multiSelect: false,
            showFooter: false,
            keepLastSelected: false, //si selecciono uno ya no lo puede deseleccionar
            showColumnMenu: false,
            headerRowHeight: 30,
            footerRowHeight: 30,
            rowHeight: 25,
            showOptionMenu: true,
            enableColumnResize: true,
            optionMenu: [
                { accion: 'eliminar',  tecla: 46, opcion: 'Eliminar Seleccionados [Supr/Del]' },
                { accion: '',          tecla:  0, opcion: '' },   /* esto seria un divider*/
                { accion: "multi",     tecla: 77, opcion: 'Selección Múltiple/Simple [M]' },
                { accion: 'select',    tecla: 65, opcion: 'Seleccionar Todos [A]' },
                { accion: 'deselect',  tecla:  0, opcion: 'Desmarcar Todos' }
            ],
            optionCallBack: function (opt) {
                switch (opt){
                    case 'eliminar':
                        if($scope.gUsersSelected.length > 0){
                            if(window.confirm("Esta seguro?")){
                                var Ids = "";
                                for(var x = 0; x < $scope.gUsersSelected.length; x++){
                                    Ids += $scope.gUsersSelected[x]._id +",";
                                }
                                window.location.href = "/usuarios/eliminar/"+Ids;
                            }
                        }else{
                            alertar("Debe seleccionar un usuario", "warning");
                        }
                        break;
                }
            },
        };
        //endregion    GRILLAS

        function traerUsuarios(){
            $("#container_user_header").addClass("loadingContent");
            $Usuarios.query(function(res){
                console.log("USUARIOS res",res)
                $scope.gUsersData = res;
                for(var x = 0; $scope.gUsersData.length > x; x++){
                    var vInst= $resource('/admin/perfiles/'+$scope.gUsersData[x].perfiles[0], {}, {'query':  {method:'GET', isArray:false}});
                    $scope.gUsersData[x].dataPerfil = vInst.query();
                    var vInst= $resource('/institucion/'+$scope.gUsersData[x].instituciones[0], {}, {'query':  {method:'GET', isArray:false}});
                    $scope.gUsersData[x].dataInst = vInst.query();
                }
            });
            $("#container_user_header").removeClass("loadingContent");
        }
        traerUsuarios();

        $scope.blockBarra = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
        }

        //region INICIALIZAR
        inicializar();
        //endregion

        //region FUNCIONES PRIVADAS
        function inicializar() {
        }

        function alertar(mensaje, type, timoff, strong, linkText, linkFunc) {
            datacontext.alertar($scope.alerts, mensaje, type, timoff, strong, linkText, linkFunc);
            refreshView();
        }

        function loguear(error, msj, action, noalertar) {
            datacontext.loguear(error, msj, action, $scope.alerts, noalertar );
            refreshView();
        }

        function gotoElem(id) {
            document.getElementById(id).focus();
            if (!document.getElementById(id).type && document.getElementById(id).type == 'text') {
                document.getElementById(id).select();
            };
        }

        function refreshView(obj) {
            if ($scope.$root.$$phase != '$apply' && $scope.$root.$$phase != '$digest') {
                $scope.$apply();
            }
        }
        //endregion funciones privadas
    }]);
