

var AgendaMacro= function ArchivosAgenda($scope,$mdDialog,$http,$resource,ProcesosRun,Global,$route,user,$mdToast,$sce) {
    _this=this;
    this.archivos='undefined';
    this.proceso='undefined';
    this.index='undefined';
    this.confirm='undefined';
    this.listConvenios=[];
    this.listAutomatico = [];
    this.listManual = [];
    this.agendasManuales={};

    //console.log("$mdToast",$scope);

    var vAgendaPorProceso= $resource('/api/agenda/traerPorProceso/');
    var vProcesoArchivos= $resource('/api/procesos/procesosTraerArchivos/');
    var vAperturaCuentaConvenios= $resource('/api/aperturaCuentas/convenioTraer');
    var vAgendaManual= $resource('/api/agendaManual/' + user.idPerfil, {});
    var vAgendaAutomatico= $resource('/api/agendaAutomatico/' + user.idPerfil, {});
    if (user.app=="TC") {
        var vPeriodos = $resource('/api/periodos');
    };

    // 01 Codigo nuevo -------------------------------------------------------

    this.initAgenda = function(){
        var _this=this;
        if($scope.signIn) {
            $scope.isLoading = true;
            if (user.app=="TC") {
                vPeriodos.query(function (data) {
                    $scope.periodos = data.map(function (it) {
                        return it.periodo;
                    });
                });
            };
            $scope.agendasManuales.data = vAgendaManual.query({}, function(){
                _this.listManual= $scope.agendasManuales.data;
                $scope.agendasManuales.count = $scope.agendasManuales.data.length;
                $scope.agendaLoaded = true;
                if ($scope.agendasManuales.count > 0) {
                    $scope.agendasManuales.show = true;
                }
            });
            function getFecha(data){
                if (data!=null){
                    var fecha=data.replace("Z"," ").replace("T"," ");
                    return new Date(fecha);
                }
                return null
            }
            $scope.agendasAutomaticas.data = vAgendaAutomatico.query({}, function(res){
                $scope.agendasAutomaticas.count = $scope.agendasAutomaticas.data.length;
                for(var i=0;i<$scope.agendasAutomaticas.data.length;i++){
                    // 2017-07-24 copia codigo HOMO ---------------------
                    if($scope.agendasAutomaticas.data[i].idPeriodo === null) {
                        $scope.agendasAutomaticas.data[i].instancia = "Todas";
                    }else{
                        var date = new Date($scope.agendasAutomaticas.data[i].periodo);
                        $scope.agendasAutomaticas.data[i].periodo = $scope.agendasAutomaticas.data[i].periodo ? date.setDate(date.getDate() + 1) : null;
                    }
                    if($scope.agendasAutomaticas.data[i].estado == 'DESHABILITADO'){
                        $scope.agendasAutomaticas.data[i].deshabilitarAutomatico = false;
                    }else{
                        $scope.agendasAutomaticas.data[i].deshabilitarAutomatico = true;
                    }

                    // --------------------------------------------------
                    $scope.agendasAutomaticas.data[i].fecCorrida=getFecha($scope.agendasAutomaticas.data[i]["fecCorrida"]);
                    $scope.agendasAutomaticas.data[i].fecVencimiento=getFecha($scope.agendasAutomaticas.data[i]["fecVencimiento"]);
                }
                _this.listAutomatico = $scope.agendasAutomaticas.data;
                if ($scope.agendasAutomaticas.count > 0) {
                    $scope.agendasAutomaticas.show = true;
                }
            });

            this.getDataHistoricos();
            $scope.isLoading = false;
        }else{
            Global.goToSignIn();
        }
    };

    this.getDataHistoricos = function (append) {
        if (!append) {
            $scope.agendasHistoricas.query.page = 1;
        }
        var vAgendasHistoricas = $resource('/api/agendaHistorico/' + user.idPerfil,{
            descripcion: $scope.agendasHistoricas.query.filter,
            desde: $scope.agendasHistoricas.query.desde,
            hasta:  $scope.agendasHistoricas.query.hasta,
            page: $scope.agendasHistoricas.query.page
        });

        vAgendasHistoricas.query({}, function (data) {
            angular.forEach(data, function (item, idx) {
                if(item.periodo!=null){
                    var date = new Date(item.periodo);
                    item.periodo = item.periodo ? date.setDate(date.getDate() + 1) : null;
                }
            });

            if (append) {
                $scope.agendasHistoricas.data = $scope.agendasHistoricas.data.concat(data);
            } else {
                $scope.agendasHistoricas.data = data;
            }
            $scope.agendasHistoricas.count = $scope.agendasHistoricas.data.length;
        });
    };

    this.runProcess = function(agenda, event)
    {
        //console.log("Run Process, INICIO EJECUCION AGENDA, this.runProcess")
        var _this=this;
        this.proceso=agenda;
        this.proceso.running = true;
        vAgendaPorProceso.query({ idAgenda: this.proceso.idAgenda, idProceso: this.proceso.idProceso },function(res){
            if (res[0].estado === "En Curso") {
                _this.showErrorToast('Error','El proceso se encuentra ejecutando. Aguarde un momento' );
                return;
            }
            if (agenda.descripcion === Global.marcarDatos || agenda.descripcion === Global.regenArchivos) {
                _this.runMarcarDatos();
                return;
            }
            if (agenda.tieneArchivo > 0) {
                _this.ObtenerArchivos();
                return;
            }
            _this.runConfirm(0);
        })
    };

    this.updateAgenda = function(agenda) {
        var _this=this;
        var param;
        if(!agenda){
            param=_this.proceso;
            param.updating = true;
        }else{
            _this.proceso=agenda;
        }
        this.getEstadoAgenda(param).then(function(res, d){
            _this.proceso.estado = res[0].estado;
            _this.proceso.periodo = res[0].periodo;
            _this.proceso.fecInicioCorrida = res[0].fecInicioCorrida;
            _this.proceso.fecFinCorrida = res[0].fecFinCorrida;
            _this.proceso.vencimiento = res[0].vencimiento;
            _this.proceso.updating = false;
            _this.proceso.modificadoPor=res[0].modificadoPor;

            _this.proceso.periodo= res[0].periodo;
            _this.proceso.error=res[0].error;

            if (_this.proceso.error!=null) {
                if (_this.proceso.error.indexOf('<br>') > -1) {
                    _this.proceso.error= _this.proceso.error.split('<br>').join('\n');
                }
                _this.proceso.error= _this.proceso.error.replace(/^\s+|\s+$/g, '');
            }
        });
    };

    this.getAgendaPasos = function(agenda,idLogAgendaPasos) {
        console.log("agenda",agenda,idLogAgendaPasos)
        var _this=this;
        // var vAgendaPasos = idLogAgendaPasos ? $resource('/api/logAgendaPasos/' + agenda.idLogAgenda) : $resource('/api/agendaPasos/' + agenda.idAgenda);
		var vAgendaPasos;
		if(typeof agenda.idAgenda!='undefined'){
			vAgendaPasos = $resource('/api/agendaPasos/' + agenda.idAgenda);			
		}else{
			vAgendaPasos = $resource('/api/logAgendaPasos/' + agenda.idLogAgenda);	
		}
		
        vAgendaPasos.query({}, function(res,d){
            $scope.pasosAgendas.data = res;
            angular.forEach($scope.pasosAgendas.data, function (paso) {
                if(paso.nombreArchivo!=null && paso.nombreArchivo.length>0){
                    paso.nombreArchivo = $sce.trustAsHtml(paso.nombreArchivo);
                }
                if(paso.observaciones!=null && paso.observaciones.length>0){
                    paso.observaciones = $sce.trustAsHtml(paso.observaciones);
                }
            });


            if(!idLogAgendaPasos){
                _this.updateAgenda(agenda)
            }else{
                if (agenda.error!=null) {
                    if (agenda.error.indexOf('<br>') > -1) {
                        agenda.error= agenda.error.split('<br>').join('\n');
                    }
                    agenda.error= agenda.error.replace(/^\s+|\s+$/g, '');
                }
            }
            $scope.agendaSeleccionada = agenda;
            //console.log("$scope.agendaSeleccionada ",$scope.agendaSeleccionada )

        },function(error){
            _this.showErrorToast('Error',error.data.message );
        });
    }


    this.getEstadoAgenda=function (agenda){
        return vAgendaPorProceso.query({ idAgenda: this.proceso.idAgenda, idProceso: this.proceso.idProceso }).$promise;
    }

    this.getSaveConvenioParam=function (convenios){
        var sendData={  nombreProceso:"Altas Masivas - Rta.Vinc.Migra",
            agrupar:1,
            paramNombre:"Convenios_Generar",
            paramValor:convenios}

        return $http({
            method: 'POST',
            url: '/api/procesos/procesoParamInsertar',
            data:sendData
        });

    }

    this.saveParam=function (data){
        return $http({
            method: 'POST',
            url: '/api/procesos/procesoParamInsertar',
            data:data
        });
    }
    this.valdacionPromoTCRespuestaVI=function(proceso,notAll){
        var confirm = $mdDialog.confirm()
            .textContent('¿Desea continuar aunque no se encuentren todos los archivos esperados?')
            .ariaLabel('Lucky day')
            .ok('Aceptar')
            .cancel('Cancelar');
        $mdDialog.show(confirm).then(function() {
            _this.ObtenerArchivos(true)
        }, function() {
            console.log("Cancelar")
        });

    }

    // 01 Codigo nuevo -------------------------------------------------------

    this.ObtenerArchivos=function(notAll){
        var _this=this;
        console.log("{idProceso: this.proceso.idProceso,notAll:notAll}",{idProceso: this.proceso.idProceso,notAll:notAll})
        vProcesoArchivos.query({idProceso: this.proceso.idProceso,notAll:notAll}, function(res) {
            _this.proceso.running = false;
            _this.archivos=res;
            if (user.app=="PP"){
                _this.getAperturaCuentaConvenios()
            }else{
                if (user.app=="TC"){
                    _this.ObtenerConveniosDeArchivos();
                }
            }
        },function(e){
            if(e.data.STATUS=="ERROR"){
                _this.showErrorToast('Error',e.data.message);
                _this.proceso.running = false;
            }

            if(_this.proceso.descripcion=='Promo TC Respuesta VI'){
                console.log('Promo TC Respuesta VI, e.data.notAll',e.data.notAll)
                if (e.data.notAll) {
                    _this.valdacionPromoTCRespuestaVI(_this.proceso,e.data.notAll);
                }
            }else{
                if (e.data.notAll) {
                    $mdDialog.show({
                        clickOutsideToClose: true,
                        template:
                        '<md-dialog md-theme="default" ng-class="dialog.css" class="_md md-default-theme md-transition-in">' +
                        '<md-dialog-content class="md-dialog-content">' +
                        '<h2 class="md-title ng-binding">Error</h2>' +
                        '<div class="md-dialog-content-body">' +
                        '<p>Faltan archivos para comenzar el cruce:</p>' +
                        '<p ng-repeat="faltante in faltantes">- {{faltante}}</p>' +
                        '</div>' +
                        '</md-dialog-content>' +
                        '<md-dialog-actions>' +
                        '<md-button ng-click="closeDialog()" class="md-primary">Aceptar</md-button>' +
                        '</md-dialog-actions>' +
                        '</md-dialog>',
                        controller: function DGISicoreMessageController($scope, faltantes, mdDialog) {
                            $scope.closeDialog = mdDialog.hide;
                            $scope.faltantes = faltantes;
                        },
                        locals: { faltantes: e.data.missing, mdDialog: $mdDialog }
                    });
                    _this.proceso.running = false;
                    return;
                }
            }
        });


    }
    this.getAperturaCuentaConvenios=function(){
        var _this=this;
        //console.log("AgendaFallecidos.getAperturaCuentaConvenios")
        vAperturaCuentaConvenios.query({}, function(res){
            _this.aperturaCuentaConvenios=res;
            //console.log("AgendaFallecidos.getAperturaCuentaConvenios",res)
            _this.ObtenerConveniosDeArchivos();
        },function(e){
            if(e.data.STATUS=="ERROR"){
                _this.showErrorToast('Error',e.data.message);
                return;
            }
        });
    }
    this.ObtenerConveniosDeArchivos=function(){
        var _this=this;
        if (_this.archivos.length > 0) {
            _this.obtenerArchivosProcesar()
            _this.obtenerArchivosProcesarSinCarpeta()
            if (user.app=="PP"){
                if(_this.proceso.descripcion === "Altas Masivas - Rta.Vinc.Migra"){
                    _this.obtenerConvenios();
                }
            }
            var confirmPedido3;
            //console.log("this.ObtenerConveniosDeArchivos -> _this.files_data",_this.files_data)
            if (_this.files_data.indexOf("PPR_fil_datos_apoderados")<0 && _this.proceso.descripcion=="Altas Masivas - Marcar Datos"){
                confirmPedido3 = $mdDialog.confirm()
                    .title('')
                    .textContent('No se encuentra el archivo de respuesta de Merlín. No se realizará la normalización de datos. Desea continuar?')
                    .ariaLabel('Lucky day') // modificacion
                    .targetEvent(_this.confirm.event)
                    .ok('Aceptar')
                    .cancel('Cancelar');
                $mdDialog.show(confirmPedido3).then(function() {
                    _this.confirmarProcesar();
                }, function() {});

            } else{
                //console.log(" *** ------------------------------------------- ")
                //console.log("this.ObtenerConveniosDeArchivos -> ELSE  confirmarProcesar() ")
                //console.log(" *** ------------------------------------------- ")
                _this.confirmarProcesar();
            }
        } else {
            _this.showErrorToast('Error',"No se encontraron archivos para este proceso.");
        }

    }
    this.confirmarProcesar=function(){
        var _this=this;
        switch (_this.proceso.descripcion) {
            case "Altas Masivas - Rta.Vinc.Migra":
                _this.Template= "agendaConvenios.tmpl.html";
                break;
            case "Recargable - Ajuste Salta VI":
                _this.Template= "multicheck.html";
                break;
            case "Fallecidos - Lectura Cobis":
                _this.Template= "fallecidosPeriodos.html";
                break;
            case "Novedades Masivas Unificado":
                _this.Template= "showTipoProceso.html";
                break;
            case "Conci. Financiacion Resultado":
                _this.Template= "conciFinanciacionResultado.html";
                break;
            case "Novedades Masivas Unif. Rta SO":
                _this.Template= "NovMasUnifRtaSO.tmpl.html";
                break;
            default:
                _this.Template= "";
        }
        _this.titulo = 'Archivos a procesar, desea continuar?';
        // _this.text = _this.files;

        // Codigo nuevo ----------------------------------------------------------------------
        confirm = $mdDialog.confirm()
            .title(_this.titulo )
            .textContent(_this.files)
            .ariaLabel('Lucky day')
            .targetEvent(this.event)
            .ok('Aceptar')
            .cancel('Cancelar');

        // console.log("AgendaFallecidos.confirmarProcesar -> confirm.Template",_this.Template)
        switch (_this.Template) {
            case "agendaConvenios.tmpl.html":
                //console.log("Confirmar: this.show, agendaConvenios.tmpl.html")
                var convenios_existen=_this.obtenerConveniosCarpeta_aperturaCuenta();
                var conveniosProcesados=_this.getConveniosProcesadosString(" -");
                if(convenios_existen.length<=0){
                    _this.showErrorToast('Error',"No existen archivos para los convenios: "+ conveniosProcesados )
                    return;
                }
                $mdDialog.show({
                    clickOutsideToClose: true,
                    scope: $scope,
                    preserveScope: true,
                    templateUrl:"agendaConvenios.tmpl.html",
                    controller: function DialogController($scope, $mdDialog) {
                        $scope.closeDialog = function() {
                            $mdDialog.hide();
                        }
                        $scope.aceptar = function(){
                            var strConvenios="";
                            for(var i=0;i<_this.listConvenios.length;i++){
                                if(_this.listConvenios[i].selected==true){
                                    strConvenios=strConvenios+_this.listConvenios[i].convenio+";";
                                }
                            }
                            if(strConvenios==""){
                                _this.showErrorToast('Error',"No se ha seleccionado un convenio");
                                return;
                            }
                            strConvenios = strConvenios.substring(0, strConvenios.length - 1);

                            _this.getSaveConvenioParam(strConvenios).then(function(res, d){
                                   var archivosConvenio=_this.obtenerArchivosPorConvenioSeleccionado();
                                   if (typeof archivosConvenio!='undefined'){
                                       _this.files_data=archivosConvenio;
                                   }
                               //console.log("!! archivosConvenio", archivosConvenio)
                                _this.runConfirm();
                                $mdDialog.hide();
                            }, function(reason) {
                                $mdDialog.hide();
                           });
                        }
                    }
                });
                break;
            case "multicheck.html":
                this.showMulticheck(event);
                break;
            case "showTipoProceso.html":
                console.log("showTipoProceso.html");
                
                _this.showTipoProceso(event, _this.files)
                .then(guardarOpcionEnProcesoParams)
                .then(function (tipoProceso) {
                    $mdDialog.show(confirm).then(function(){
                        if ((_this.archivos.filter(x => x.file.file.toUpperCase().indexOf('TARJETAS') >=0).length > 1 && tipoProceso == 'tarjetas')
                            || _this.archivos.filter(x => !(x.file.file.toUpperCase().indexOf('TARJETAS') >= 0)).length > 1 && tipoProceso == 'cuentas') {
                                _this.showErrorToast('Error',"Hay mas de un archivo de este tipo para procesar. Solo se permite procesar de a un archivo");
                        } else {
                            let archi;
                            archi = tipoProceso === 'cuentas'? _this.files_data.split(';').find(x => !(x.toUpperCase().indexOf('TARJETAS') >= 0))
                                            : _this.files_data.split(';').find(x => x.toUpperCase().indexOf('TARJETAS') >= 0);
                            _this.runProcessManual(0,archi+';');
                            _this.updateAgenda();
                        }
                    });
                })
                .catch(mostrarErrorConvenios);

                break;

            case "fallecidosPeriodos.html":
                console.log("fallecidosPeriodos.html")
                this.showFallecidos(event);
                break;
            case 'conciFinanciacionResultado.html':
                confirm.title('El proceso realizará la lectura de ' + this.archivos.length + ' archivos existentes en la ruta ' + this.archivos[0].file.fullFile.replace(this.archivos[0].file.file, ''));
                confirm.textContent('');
                //El proceso realizará la lectura de @count archivos existentes en la ruta @path
                $mdDialog.show(confirm).then(function(){
                    _this.runConfirm()
                });
                break;
            case 'NovMasUnifRtaSO.tmpl.html':
                this.showNovMasUnifRtaSO(event);
                break;
            default:
                $mdDialog.show(confirm).then(function(){
                    _this.runConfirm()
                });
        }

        // ----------------------------------------------------------------------
    }
    this.obtenerArchivosProcesar=function(){
        //console.log("AgendaFallecidos.obtenerArchivosProcesar")
        // Los archivos a procesar vienen: NombreCarpeta\nombreArchivo.txt
        this.files_data="";
        for(var i=0;i<this.archivos.length;i++){
            if(typeof this.archivos[i].directorio!='undefined'){
                if(this.archivos[i].directorio!=""){
                    this.files_data =this.files_data+ this.archivos[i].directorio+ "\\" + this.archivos[i].file+";";
                    this.archivos[i].files_data=this.archivos[i].directorio+ "\\" + this.archivos[i].file;
                }else{
                    this.files_data =this.files_data+this.archivos[i].file+";";
                    this.archivos[i].files_data=this.archivos[i].file;
                }
            }else{
                if(typeof this.archivos[i]!='object') {
                    this.files_data = this.files_data + this.archivos[i] + ";";
                    this.archivos[i].files_data=this.archivos[i];
                }else{
                    this.files_data = this.files_data + this.archivos[i].file.file+ ";";
                    this.archivos[i].files_data=this.archivos[i].file.file;
                }
            }
        }
    }
    this.obtenerArchivosProcesarSinCarpeta=function(){
        //console.log("AgendaFallecidos.obtenerArchivosProcesarSinCarpeta")
        // Los archivos sin carpeta son los mismos que trae  (obtenerArchivosProcesar)
        // pero sin la carpeta nombreArchivo.txt
        this.files="";
        for(var i=0;i<this.archivos.length;i++){
            if(typeof this.archivos[i].directorio!='undefined'){
                this.files=this.files+" - "+this.archivos[i].file+" ";
            }else{
                if(typeof this.archivos[i]!='object') {
                    this.files = this.files + " - " + this.archivos[i] + " ";
                }else{
                    this.files = this.files + " - " + this.archivos[i].file.file + " ";
                }
            }
        }
    }
    this.obtenerConvenios=function(){
        _this=this;
        var convenios={};
        var archivos_convenios=this.files.replace('-', '').replace(/ /g, '').split("-")

        for(var i=0;i<archivos_convenios.length;i++){
            if(archivos_convenios[i].indexOf("PPR_fil_datos_apoderados")<0){
                cvn=this.obtenerConvenioDelArchivo(archivos_convenios[i])
                convenios[cvn]=isNaN(convenios[cvn])? 0:convenios[cvn]+1;
                this.archivos[i].convenio=this.obtenerConvenioDelArchivo(this.archivos[i].file)
            }
        }
        _this.listConvenios=[]
        Object.keys(convenios).forEach(function(key) {
            _this.listConvenios.push({convenio: key, selected:false})
        });
    }
    this.obtenerArchivosPorConvenioSeleccionado=function(){
        console.log("AgendaFallecidos.obtenerArchivosPorConvenioSeleccionado")
        var files_data_send="";
        if (this.listConvenios.length>0){
            for(var i=0;i<this.listConvenios.length;i++){
                if(this.listConvenios[i].selected==true){
                    for(var j=0;j<this.archivos.length;j++) {
                        if (this.archivos[j].convenio == this.listConvenios[i].convenio) {
                            files_data_send=files_data_send+this.archivos[j].files_data+";";
                        }
                    }
                }
            }
            files_data_send = files_data_send.substring(0, files_data_send.length - 1);
        }
        return files_data_send;
    }
    this.obtenerConvenioDelArchivo=function(pFileName){
        // //console.log("AgendaFallecidos.obtenerConvenioDelArchivo",pFileName)
        return pFileName
            .substring(pFileName.indexOf("_")+1, pFileName.length)
            .substring(0, pFileName.indexOf("_")-1);
    }
    this.obtenerConveniosCarpeta_aperturaCuenta=function(){
        console.log("AgendaFallecidos.obtenerConveniosCarpeta_aperturaCuenta")
        // De los convenios que exiten en la tabla apertura cuentas de la base de datos, busca si exiten los archivos en la carpeta del proceso
        var convenios_existen=[];
        for(var i=0;i<this.listConvenios.length;i++){
            for(var j=0;j<this.aperturaCuentaConvenios.length;j++){
                if(this.listConvenios[i].convenio==this.aperturaCuentaConvenios[j].convenio){
                    this.listConvenios[i].show=true;
                    convenios_existen.push(this.aperturaCuentaConvenios[j].convenio)
                }
            }
        }
        return convenios_existen;
    }
    this.getConveniosProcesadosString=function(separador){
        console.log("AgendaFallecidos.getConveniosProcesadosString")
        var conveniosProcesados="";
        for(var i=0;i<this.listConvenios.length;i++){
            if(typeof this.aperturaCuentaConvenios[i]!='undefined'){
                conveniosProcesados=conveniosProcesados+this.aperturaCuentaConvenios[i].convenio+separador;
            }
        }
        conveniosProcesados = conveniosProcesados.substring(0, conveniosProcesados.length - 1);
        return conveniosProcesados;
    }

    // --------------
    this.showErrorToast = function(type, msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast' + type +'">' + msg + '</md-toast>',
            hideDelay: 3000,
            position: 'top left'
        });
    };
    this.showToastSuccess = function(msg) {
        var template="";
        if(typeof msg!='undefined'){
            template='<md-toast class="md-toast toastSuccess">'+msg+'</md-toast>';
        }else{
            template='<md-toast class="md-toast toastSuccess">La operación se realizó correctamente.</md-toast>'
        }
        $mdToast.show({
            template: template,
            hideDelay: 3000,
            position: 'top left'
        });

    };



    this.showNovMasUnifRtaSO = function (event) {
        console.log("Confirmar: this.showNovMasUnifRtaSO",_this.files_data);
       var so=new NovedadesMasivasUnifRtaSO($mdDialog,$resource,_this);
        so.show();

/*      $http({
            method: 'GET',
            url: '/api/fallecidos/obtenerPeriodo/',
            data:{}
        }).then(function successCallback(response) {
            if(response.data.length==0){
                _this.showErrorToast('Error',"No se encontro el periodo de fallecidos.")
                return;
            }
            var periodos=response.data;
            console.log("this.showFallecidos -> periodos",periodos)
            $mdDialog.show({
                controller: 'agenda.fallecidosPeriodos.ctrl',
                templateUrl: 'app.views/agenda/fallecidosPeriodos.html',
                parent: angular.element(document.body),
                locals: {
                    archivos: _this.files_data,
                    periodos: periodos
                },
                clickOutsideToClose:true
            }).then(function (res) {
                console.log("res",res);
                _this.runConfirm()
            }).catch(function () {
                //  _this.cancel(param, param2, param3);
            });
        }, function(response) {
            if(response.status==500){
                if(response.data.STATUS=="ERROR"){
                    _this.showErrorToast('Error',response.data.message)
                    return;
                }
            }
        });
*/
    }

    this.showFallecidos = function (event) {
        console.log("Confirmar: this.showFallecidos")
        var _this=this;
        $http({
            method: 'GET',
            url: '/api/fallecidos/obtenerPeriodo/',
            data:{}
        }).then(function successCallback(response) {
            if(response.data.length==0){
                _this.showErrorToast('Error',"No se encontro el periodo de fallecidos.")
                return;
            }
            var periodos=response.data;
            console.log("this.showFallecidos -> periodos",periodos)
            $mdDialog.show({
                controller: 'agenda.fallecidosPeriodos.ctrl',
                templateUrl: 'app.views/agenda/fallecidosPeriodos.html',
                parent: angular.element(document.body),
                locals: {
                    archivos: _this.files_data,
                    periodos: periodos
                },
                clickOutsideToClose:true
            }).then(function (res) {
                console.log("res",res);
                _this.runConfirm()
            }).catch(function () {
                //  _this.cancel(param, param2, param3);
            });
        }, function(response) {
            if(response.status==500){
                if(response.data.STATUS=="ERROR"){
                    _this.showErrorToast('Error',response.data.message)
                    return;
                }
            }
        });

    }
    var guardarOpcionEnProcesoParams = function (tipoProceso) {
        var param = {
            nombreProceso: _this.proceso.descripcion,
            agrupar: 0,
            paramNombre: 'tipoProceso',
            paramValor: tipoProceso
        };
        $resource('/api/procesos/procesoParamInsertar/').save(param)
        return tipoProceso;
    };
    this.showTipoProceso = function (event, files) {
        return $mdDialog.show({
            controller: 'agenda.tipoProcesoImportacionMasiva.ctrl',
            templateUrl: 'app.views/agenda/optionSelect.html',
            parent: angular.element(document.body),
            locals: {
                archivos: files
            },
            clickOutsideToClose:true
        });
    };
    this.showMulticheck = function (event) {
        // -------------------------------------------------
        //  Para Fallecidos no se utiliza 2017-06-28
        // -------------------------------------------------
        $mdDialog.show({
            controller: 'agenda.elegirArchivos.ctrl',
            templateUrl: 'app.views/agenda/multicheck.html',
            parent: angular.element(document.body),
            locals: {
                archivos:  _this.files_data
            },
            clickOutsideToClose:true
        }).then(function (res) {
           _this.runProcessManual(0,res[0].nombreArchivo);
        });

    };
    this.runConfirm=function() {
        console.log("AgendaFallecidos.runConfirm")
        var _this=this;
        var idProceso=this.proceso.idProceso;
        var vProcesoDependienteEstado= $resource('/api/procesos/estadoProcesoDependiente/'+idProceso);
        vProcesoDependienteEstado.query({}, function(res){
            if(res[0].estado.toUpperCase()=='ERROR' ){
                _this.showErrorToast('Error',res[0].message );
                return;
            }
            if(res.length>0){
                if(res[0].estado!='OK' && res[0].idProceso!=0 && res[0].nombreProcesoDepende!=null){
                    var reConfirm = $mdDialog.confirm()
                        .title('¿Desea ejecutar  "'+res[0].proceso+'" pese a que "'+ res[0].nombreProcesoDepende +'" no ha sido ejecutado?' )
                        // .textContent(_this.files)
                        .ariaLabel('Lucky day')
                        .targetEvent(this.event)
                        .ok('Aceptar')
                        .cancel('Cancelar');
                    $mdDialog.show(reConfirm).then(function(){
                        console.log("Run  cancelo la ejecucion")

                        _this.runProcessManual()
                    },function(){
                        console.log("Se cancelo la ejecucion")
                    });
                }else{
                    console.log("1. el, _this.files_data "+_this.files_data)
                    _this.runProcessManual(0,_this.files_data);
                }
            }else{
                console.log("1. el run data")
                // runProcess(param); ????
            }

        },function(error){
            _this.showErrorToast('Error',error.data.message );
        });
    }
    this.runProcessManual = function(validarDependencia,archivos) {

        var _this=this;

        if (_this.proceso.descripcion=='Promo TC Respuesta VI') {
                confirmGenerar = $mdDialog.confirm()
                .title()
                .textContent("Si al finalizar la lectura de archivos existen registros con código de rechazo = 027 ¿Desea generar los correspondientes archivos B067_Promo620 y/o B667_Promo620?")

                .ariaLabel('Lucky day')
                .targetEvent(this.event)
                .ok('Generar')
                .cancel('No Generar');

                     $mdDialog.show(confirmGenerar).then(function () {
                        var data = {
                            nombreProceso: _this.proceso.descripcion,
                            agrupar: 1,
                            paramNombre: "PROMO_TCRESPUESTAVI_GENERAR",
                            paramValor: 'SI'
                        }
                        _this.saveParam(data).then(function (res, d) {
                        _this.procesoSave(validarDependencia,archivos);
                         $mdDialog.hide();
                    }, function (reason) {
                        console.log("_this.procesoSave(validarDependencia,archivos);")
                        $mdDialog.hide();
                    });
                },function(){
                         _this.procesoSave(validarDependencia,archivos);
                     });
        }else{
            _this.procesoSave(validarDependencia,archivos);
        }
    }
    this.refresh=function (){
        $route.reload();
    }

    this.procesoSave=function (validarDependencia,archivos){
        this.proceso.username = user.name;
        this.proceso.validarDependencia = validarDependencia;
        this.proceso.archivos = archivos;
        var iProceso = new ProcesosRun(this.proceso);

        iProceso.$save(function(pepe) {
            _this.proceso.running = false;
            if(pepe.STATUS=='ERROR' ) {
                _this.showErrorToast('Error',pepe.message);
                return;
            }
            _this.updateAgenda();
        },function(p){
            _this.proceso.running = false;
            _this.showErrorToast('Error',p.data.message);
        });
    }

/*
    this.runPromoTCRespuestaVI=function () {
        if (_this.files_data.indexOf("PPR_fil_datos_apoderados")<0 && _this.proceso.descripcion=="Altas Masivas - Marcar Datos"){
            confirmPedido3 = this.mdDialog.confirm()
                .title('')
                .textContent('No se encuentra el archivo de respuesta de Merlín. No se realizará la normalización de datos. Desea continuar?')
                .ariaLabel('Lucky day')
                .targetEvent(_this.confirm.event)
                .ok('Aceptar')
                .cancel('Cancelar');

            this.mdDialog.show(confirmPedido3).then(function() {
                _this.confirmarProcesar();
            }, function() {});
        }else{
            _this.confirmarProcesar();
        }
    }
    */

    this.runMarcarDatos=function () {
        var _this=this;
        // var _runProcessWithFile= _this.runProcessWithFile;
        var traerConveniosAperturaCuentas = function () {
            var esRegen = _this.proceso.descripcion === Global.regenArchivos ? 1 : 0;
            return $resource('/api/convenios/conveniosAperturaCuentas/' + esRegen).query().$promise;
        };

        var guardarSistemasEnProcesoParams = function (sistemas) {
            var param = {
                nombreProceso: _this.proceso.descripcion,
                agrupar: 1,
                paramNombre: 'sistemas',
                paramValor: sistemas.join(',')
            };
            return $resource('/api/procesos/procesoParamInsertar/').save(param)
        };

        var mostrarConveniosAperturaCuentas = function (convenios) {
            if (convenios.length === 0) {
                if (_this.proceso.descripcion === Global.marcarDatos) {
                    throw new Error('No se encontraron convenios para marcar');
                } else {
                    throw new Error('No se encontraron archivos para reprocesar');
                }
            }

            return $mdDialog.show({
                controller: 'agenda.conveniosMarcarDatos.ctrl',
                templateUrl: 'app.views/agenda/multicheck.html',
                parent: angular.element(document.body),
                locals: {
                    convenios: convenios,
                    proceso: _this.proceso.descripcion
                },
                clickOutsideToClose:true
            });
        };

        var correrProcesoConArchivo = function () {
            if (_this.proceso.descripcion === Global.marcarDatos) {
                _this.ObtenerArchivos();
            } else {
                _this.runProcessManual();
            }
        };

        function mostrarErrorConvenios(err) {
            if (err) {
                _this.showErrorToast('Error',err.message);
            }
            _this.proceso.running = false;
        };

        traerConveniosAperturaCuentas()
            .then(mostrarConveniosAperturaCuentas)
            .then(guardarSistemasEnProcesoParams)
            .then(correrProcesoConArchivo)
            .catch(mostrarErrorConvenios);
    }
}

// FIN 2017-07-06 ----------------------------------------------------------------------------------------------


var Agenda= (function () {
    function ArchivosAgenda(scope) {
        this.archivos='undefined';
        this.proceso='undefined';
        this.index='undefined';
        this.confirm='undefined';
        this.listConvenios=[]
        this.setScope=function(p){
            this.scope=p;
        }
        this.setMdDialog=function(p){
            this.mdDialog=p;
        }
        this.ObtenerArchivos=function(vProcesoArchivos,vAperturaCuentaConvenios,pProceso,pIndex,pConfirm){
            var _this=this;
            this.proceso=pProceso;
            this.index=pIndex;
            this.confirm=pConfirm;
            this.aperturaCuentaConvenios=vAperturaCuentaConvenios;
            vProcesoArchivos.query({idProceso: pProceso.idProceso}, function(res) {
                pProceso.running = false;
                _this.archivos=res;
                // _this.ObtenerConveniosDeArchivos()
                if (user.app=="PP"){
                    _this.getAperturaCuentaConvenios()
                }else{
                    if (user.app=="TC"){
                        _this.ObtenerConveniosDeArchivos();
                    }
                }

            },function(e){
                if(e.data.STATUS=="ERROR"){
                    _this.scope.showErrorToastAgenda(e.data.message, 'Error');
                    pProceso.running = false;
                    return;
                }
                if (e.data.notAll) {
                    this.mdDialog.show({
                        clickOutsideToClose: true,
                        template:
                        '<md-dialog md-theme="default" ng-class="dialog.css" class="_md md-default-theme md-transition-in">' +
                        '<md-dialog-content class="md-dialog-content">' +
                        '<h2 class="md-title ng-binding">Error</h2>' +
                        '<div class="md-dialog-content-body">' +
                        '<p>Faltan archivos para comenzar el cruce:</p>' +
                        '<p ng-repeat="faltante in faltantes">- {{faltante}}</p>' +
                        '</div>' +
                        '</md-dialog-content>' +
                        '<md-dialog-actions>' +
                        '<md-button ng-click="closeDialog()" class="md-primary">' +
                        'Aceptar' +
                        '</md-button>' +
                        '</md-dialog-actions>' +
                        '</md-dialog>',
                        controller: function DGISicoreMessageController($scope, faltantes, mdDialog) {
                            $scope.closeDialog = mdDialog.hide;
                            $scope.faltantes = faltantes;
                        },
                        locals: { faltantes: e.data.missing, mdDialog: mdDialog }
                    });
                    pProceso.running = false;
                    return;
                }
            });
        }
        this.getAperturaCuentaConvenios=function(){
            var _this=this;

            this.aperturaCuentaConvenios.query({}, function(res){
                _this.aperturaCuentaConvenios=res;
                _this.ObtenerConveniosDeArchivos();
            },function(e){
                if(e.data.STATUS=="ERROR"){
                    _this.scope.showErrorToastAgenda(e.data.message, 'Error');
                    return;
                }
            });


        }
        this.ObtenerConveniosDeArchivos=function(){
            var _this=this;
            if (_this.archivos.length > 0) {
                _this.obtenerArchivosProcesar()
                _this.obtenerArchivosProcesarSinCarpeta()
                if (user.app=="PP"){
                    if(_this.proceso.descripcion === "Altas Masivas - Rta.Vinc.Migra"){
                        _this.obtenerConvenios();
                    }
                }
                var confirmPedido3;


                if (_this.files_data.indexOf("PPR_fil_datos_apoderados")<0 && _this.proceso.descripcion=="Altas Masivas - Marcar Datos"){
                    confirmPedido3 = this.mdDialog.confirm()
                        .title('')
                        .textContent('No se encuentra el archivo de respuesta de Merlín. No se realizará la normalización de datos. Desea continuar?')
                        .ariaLabel('Lucky day') // modificacion
                        .targetEvent(_this.confirm.event)
                        .ok('Aceptar')
                        .cancel('Cancelar');

                    this.mdDialog.show(confirmPedido3).then(function() {
                        _this.confirmarProcesar();
                    }, function() {});
                } else {
                    _this.confirmarProcesar();
                }
            } else {
                _this.scope.showErrorToastAgenda("No se encontraron archivos para este proceso.", 'Error');
            }

        }
        this.confirmarProcesar=function(){
            var _this=this;
            _this.confirm.titulo = 'Archivos a procesar, desea continuar?';
            _this.confirm.text = _this.files;
            switch (_this.proceso.descripcion) {
                case "Altas Masivas - Rta.Vinc.Migra":
                        _this.confirm.Template= "agendaConvenios.tmpl.html";
                    break;
                case "Recargable - Ajuste Salta VI":
                    _this.confirm.Template= "multicheck.html";
                    break;
                case "Fallecidos - Lectura Cobis":
                    _this.confirm.Template= "fallecidosPeriodos.html";
                    break;

                default:
                    _this.confirm.Template= "";
            }
            _this.confirm.param(_this.index, '', _this.files_data);
            _this.confirm.show(event);
        }
        this.obtenerArchivosProcesar=function(){
            // Los archivos a procesar vienen: NombreCarpeta\nombreArchivo.txt
            this.files_data="";
            console.log("obtenerArchivosProcesar -> this.archivos",this.archivos);

            for(var i=0;i<this.archivos.length;i++){
                if(typeof this.archivos[i].directorio!='undefined'){
                    if(this.archivos[i].directorio!=""){
                        this.files_data =this.files_data+ this.archivos[i].directorio+ "\\" + this.archivos[i].file+";";
                        this.archivos[i].files_data=this.archivos[i].directorio+ "\\" + this.archivos[i].file;
                    }else{
                        this.files_data =this.files_data+this.archivos[i].file+";";
                        this.archivos[i].files_data=this.archivos[i].file;
                    }
                }else{
                    if(typeof this.archivos[i]!='object') {
                        this.files_data = this.files_data + this.archivos[i] + ";";
                        this.archivos[i].files_data=this.archivos[i];
                    }else{
                        this.files_data = this.files_data + this.archivos[i].file.file+ ";";
                        this.archivos[i].files_data=this.archivos[i].file.file;
                    }
                }
            }
        }
        this.obtenerArchivosProcesarSinCarpeta=function(){
            // Los archivos sin carpeta son los mismos que trae  (obtenerArchivosProcesar)
            // pero sin la carpeta nombreArchivo.txt
            console.log("obtenerArchivosProcesarSinCarpeta -> this.archivos",this.archivos);

            this.files="";
            for(var i=0;i<this.archivos.length;i++){
                if(typeof this.archivos[i].directorio!='undefined'){
                    this.files=this.files+" - "+this.archivos[i].file+" ";
                }else{
                    if(typeof this.archivos[i]!='object') {
                        this.files = this.files + " - " + this.archivos[i] + " ";
                    }else{
                        this.files = this.files + " - " + this.archivos[i].file.file + " ";
                    }
                }
            }

            console.log("obtenerArchivosProcesarSinCarpeta -> this.files",this.files);
        }
        this.obtenerConvenios=function(){
            var _this=this;
            var convenios={};
            _this.listConvenios=[];

            console.log("obtenerConvenios -> this.files",this.files);
            var archivos_convenios=this.files.replace('-', '').replace(/ /g, '').split("-")
            for(var i=0;i<archivos_convenios.length;i++){
                if(archivos_convenios[i].indexOf("PPR_fil_datos_apoderados")<0){
                    cvn=this.obtenerConvenioDelArchivo(archivos_convenios[i])
                    convenios[cvn]=isNaN(convenios[cvn])? 0:convenios[cvn]+1;
                    this.archivos[i].convenio=this.obtenerConvenioDelArchivo(this.archivos[i].file)
                }
            }
            console.log("obtenerConvenios -> convenios",convenios);
            _this.listConvenios=[]
            Object.keys(convenios).forEach(function(key) {
                _this.listConvenios.push({convenio: key, selected:false})
            });
            console.log("obtenerConvenios -> convenios",convenios);
        }
        this.obtenerArchivosPorConvenioSeleccionado=function(){
            console.log("obtenerArchivosPorConvenioSeleccionado -> this.listConvenios",this.listConvenios);
            var files_data_send="";
            if (this.listConvenios.length>0){
                for(var i=0;i<this.listConvenios.length;i++){
                    if(this.listConvenios[i].selected==true){
                        for(var j=0;j<this.archivos.length;j++) {
                            if (this.archivos[j].convenio == this.listConvenios[i].convenio) {
                                files_data_send=files_data_send+this.archivos[j].files_data+";";
                            }
                        }
                    }
                }
                files_data_send = files_data_send.substring(0, files_data_send.length - 1);
                console.log("obtenerArchivosPorConvenioSeleccionado -> files_data_send",files_data_send);
            }
            return files_data_send;
        }
        this.obtenerConvenioDelArchivo=function(pFileName){
            console.log("pFileName",pFileName)
            return pFileName
                .substring(pFileName.indexOf("_")+1, pFileName.length)
                .substring(0, pFileName.indexOf("_")-1);
        }
        this.obtenerConveniosCarpeta_aperturaCuenta=function(){
            // De los convenios que exiten en la tabla apertura cuentas de la base de datos, busca si exiten los archivos en la carpeta del proceso
            console.log("obtenerConveniosCarpeta_aperturaCuenta this.listConvenios",this.listConvenios);

            var convenios_existen=[];
            for(var i=0;i<this.listConvenios.length;i++){
                for(var j=0;j<this.aperturaCuentaConvenios.length;j++){
                    if(this.listConvenios[i].convenio==this.aperturaCuentaConvenios[j].convenio){
                        this.listConvenios[i].show=true;
                        convenios_existen.push(this.aperturaCuentaConvenios[j].convenio)
                    }
                }
            }
            console.log("obtenerConveniosCarpeta_aperturaCuenta this.listConvenios",this.listConvenios);

            return convenios_existen;
        }
        this.getConveniosProcesadosString=function(separador){
            console.log("this.getConveniosProcesadosString listConvenios",this.listConvenios);
            var conveniosProcesados="";
            for(var i=0;i<this.listConvenios.length;i++){
                if(typeof this.aperturaCuentaConvenios[i]!='undefined'){
                    conveniosProcesados=conveniosProcesados+this.aperturaCuentaConvenios[i].convenio+separador; //" -"
                }
            }
            conveniosProcesados = conveniosProcesados.substring(0, conveniosProcesados.length - 1);
            return conveniosProcesados;
        }
    }
    return { ArchivosAgenda: ArchivosAgenda}
})()


var agenda_funcionalidad=new Agenda.ArchivosAgenda();

// -----------------------------------------------------------------------------------------------------

app.filter('filtrarAgendasManuales', function() {
    return function (array, value) {
        if (typeof value=='undefined'){
            return array;
        }
        if (value["desdeManualFec"]==null && value["hastaManualFec"]==null ){
            return array;
        }
        var output = [];
        var desde=new Date(value["desdeManualFec"]);
        var hasta=new Date(value["hastaManualFec"]);
        hasta.setDate(hasta.getDate() + 1);
        angular.forEach(array, function (item) {
            itemDate=new Date(item["fecInicioCorrida"]);

            if (value["desdeManualFec"]!=null && value["hastaManualFec"]!=null){
                if (itemDate>= desde && itemDate<=hasta) {
                    output.push(item)
                }
            }else{
                if (value["desdeManualFec"]!=null){
                    if (itemDate>= desde) {
                        output.push(item)
                    }
                }else{
                    if (value["hastaManualFec"]!=null){
                        if (itemDate<=hasta) {
                            output.push(item)
                        }
                    }
                }
            }
        });
        return output;
    }
});



app.controller('agenda.ctrl',
             ['$scope','$http','$mdDialog','$mdSidenav',"$resource",'$filter','Global','ProcesosRun','Toast','$sce','$mdToast','$route',
    function ( $scope,  $http,  $mdDialog,  $mdSidenav,  $resource,  $filter,  Global,  ProcesosRun,  Toast,  $sce,$mdToast,$route) {

        agenda_funcionalidad.setMdDialog($mdDialog);
        $scope.agenda_funcionalidad =agenda_funcionalidad;

        // CODIGO NUEVO 2017-07-06
        var agendaControl=new AgendaMacro(
            $scope,$mdDialog,$http,$resource,ProcesosRun,Global,$route,user,$mdToast,$sce
        )
        $scope.agendaControl=agendaControl;

        $scope.sitio = Global.currentUser.app;
        $scope.signIn=Global.isSignedIn();
        $scope.authorized=false;
        $scope.selected = [];
        $scope.hideCheckboxes = true;
        $scope.gdAgenda = gridDoor();
        $scope.agendaSeleccionada = {};
        $scope.pasosAgendas = [];
        $scope.isLoading = false;
        $scope.agenda = {};
        $scope.dateAgendaManual={};
        $scope.marcas = [
            { valor: "MC", descripcion: "Mastercard"},
            { valor: "AX", descripcion: "American Express"},
            { valor: "VI", descripcion: "Visa"},
            { valor: 'VIAX', descripcion: 'Visa y AmericanExpress' }];
        $scope.periodos = [];
        $scope.estados = [ 'En Curso', 'ERROR', 'PENDIENTE', 'DESHABILITADO' ];
        $scope.agendasAutomaticas = {
            "data": [],
            count: 0,
            show: false,
            "selected": [],
            "filter": {
                show: false,
                options: {
                    debounce: 500
                }
            },
            "calendar": {
                show: false,
                options: {
                    debounce: 500
                }
            },
            "query": {
                filter: '',
                limit: '5',
                order: 'nameToLower',
                page: 1
            },
            "advancedSearch": {
                show: false,
                marca: null,
                proceso: null,
                periodo: null,
                instancia: null,
                fecha: null,
                estado: null
            },
            advancedFilterApplied: false
        };

        $scope.agendasManuales = {
            "data": [],
            count: 0,
            show: false,
            "selected": [],
            "filter": {
                show: false,
                options: {
                    debounce: 500
                }
            },
            "query": {
                filter: '',
                limit: '5',
                order: 'nameToLower',
                page: 1
            }
        };

        $scope.agendasHistoricas = {
            "data": [],
            "selected": [],
            "filter": {
                show: false,
                options: {
                    debounce: 500
                }
            },
            "query": {
                filter: '',
                limit: '5',
                order: 'nameToLower',
                page: 1,
                desde: null,
                hasta: null
            }
        };

        $scope.showErrorToastAgenda = Toast.showError;
        $scope.user=user;





        var vAgendaPorProceso= $resource('/api/agenda/traerPorProceso/');

        $scope.filtroAvanzado = function () {
            $scope.agendasAutomaticas.query.page = 1;
            var output = agendaControl.listAutomatico;
            if ($scope.agendasAutomaticas.advancedSearch.marca) {
                output = output.filter(function (it) { return it.marca === $scope.agendasAutomaticas.advancedSearch.marca; });
            }
            if ($scope.agendasAutomaticas.advancedSearch.proceso) {
                output = $filter('filter')(output, $scope.agendasAutomaticas.advancedSearch.proceso)
            }
            if ($scope.agendasAutomaticas.advancedSearch.periodo) {
                output = output.filter(function (it) {
                    return moment(it.periodo).format('DD/MM/YYYY') ===
                        moment($scope.agendasAutomaticas.advancedSearch.periodo).format('DD/MM/YYYY');
                });
            }
            if ($scope.agendasAutomaticas.advancedSearch.instancia) {
                output = output.filter(function (it) { return it.instancia == $scope.agendasAutomaticas.advancedSearch.instancia; });
            }
            if ($scope.agendasAutomaticas.advancedSearch.fecVencimiento) {

                output = output.filter(function (it) {
                    return moment(it.fecCorrida).format('DD/MM/YYYY') ===
                            moment($scope.agendasAutomaticas.advancedSearch.fecVencimiento).format('DD/MM/YYYY');
                });
            }
            if ($scope.agendasAutomaticas.advancedSearch.estado) {
                output = output.filter(function (it) { return it.estado === $scope.agendasAutomaticas.advancedSearch.estado });
            }
            $scope.agendasAutomaticas.data = output;
            $scope.agendasAutomaticas.count = $scope.agendasAutomaticas.data.length;
            $scope.agendasAutomaticas.advancedFilterApplied = true;
        };

        $scope.undoFiltroAvanzado = function () {
            $scope.agendasAutomaticas.data = agendaControl.listAutomatico;
            $scope.agendasAutomaticas.advancedSearch = {
                show: false,
                marca: null,
                proceso: null,
                periodo: null,
                instancia: null,
                fecha: null,
                estado: null
            };
            $scope.agendasAutomaticas.advancedFilterApplied = false;
            $scope.agendasAutomaticas.query.page = 1;
            $scope.agendasAutomaticas.count = $scope.agendasAutomaticas.data.length;
        };

        agendaControl.initAgenda();
        agendaControl.getDataHistoricos();

        $scope.masHistoricos = function () {
            $scope.agendasHistoricas.query.page++;
            $scope.agendaControl.getDataHistoricos(true);
        };

        $scope.$watch('agendasHistoricas.query.desde', function (newVal) {
            if(newVal){
                if (newVal.toString() != "") {
                    $scope.agendasHistoricas.query.desde=newVal;
                    $scope.agendaControl.getDataHistoricos();
                }
            }
        });

        $scope.$watch('agendasHistoricas.query.hasta', function (newVal) {
            if(newVal){
                if (newVal.toString() != "") {
                    $scope.agendasHistoricas.query.hasta=newVal;
                    $scope.agendaControl.getDataHistoricos();
                }
            }
        });


        $scope.$watch('agendasAutomaticas.query.filter', function (newVal) {
            $scope.agendasAutomaticas.query.page = 1;
            if (newVal.toString() != "") {
                $scope.agendasAutomaticas.data = $filter('filter')(agendaControl.listAutomatico, newVal);
            }else if(agendaControl.listAutomatico.length != 0){
                $scope.agendasAutomaticas.data = agendaControl.listAutomatico;
            }
            $scope.agendasAutomaticas.count = $scope.agendasAutomaticas.data.length;
        });


        $scope.$watch('agendasManuales.query.filter', function (newVal) {
            $scope.agendasManuales.query.page = 1;
            if (newVal.toString() != "") {
                $scope.agendasManuales.data = $filter('filter')(agendaControl.listManual, newVal);
            }else if(agendaControl.listAutomatico.length != 0){
                $scope.agendasManuales.data = agendaControl.listManual;
            }
            $scope.agendasManuales.count = $scope.agendasManuales.data.length;
        });




        $scope.filtrarManualesFecha = function () {
            $scope.agendasManuales.data = $filter('filtrarAgendasManuales')(agendaControl.listManual, $scope.dateAgendaManual);
            $scope.agendasManuales.count = $scope.agendasManuales.data.length;
            $scope.agendasManuales.query.page = 1;
        };

        $scope.$watch('agendasAutomaticas.advancedSearch', function () {
            $scope.agendasAutomaticas.advancedFilterApplied = false;
        }, true);

        function getEstadoAgenda(proceso) {
            return vAgendaPorProceso.query({ idAgenda: proceso.idAgenda, idProceso: proceso.idProceso }).$promise;
        }

        $scope.updateAgendaAutomatica = function(proceso) {
            proceso.updating = true;
            getEstadoAgenda(proceso).then(function(res, d){
                proceso.estado = res[0].estado;
                proceso.error = res[0].error;
                proceso.fecInicioCorrida = res[0].fecInicioCorrida;
                proceso.fecFinCorrida = res[0].fecFinCorrida;
                proceso.vencimiento = res[0].vencimiento;
                proceso.updating = false;
            }, function () {
                proceso.updating = false;
            });
        };

        $scope.destrabarAgenda = function (agenda) {
            agenda.updating = true;
            var promise = $resource('/api/destrabarAgenda/:idAgenda/',
                { idAgenda: agenda.idAgenda},
                { 'update' : { method: 'PUT' } }).update().$promise
                .then(function (data) {
                    agenda.updating = false;
                    agenda.estado = 'PENDIENTE';
                    Toast.showSuccess('La agenda se destrabó exitosamente');
                })
                .catch(function (err) {
                    agenda.updating = false;
                    Toast.showError(err.data.message, 'Error')
                });
        };

      $scope.habilitar = function(agenda){
            var currentDate = new Date();
            if(agenda.fecCorrida  > currentDate && agenda.estado == 'DESHABILITADO') {
                agenda.estado = 'PENDIENTE';
                agenda.deshabilitarAutomatico = true;
                $scope.modificarAgendas(agenda);
            }else if(agenda.estado == 'DESHABILITADO'){
                Toast.showError('La agenda debe superar la fecha del día y no puede rehabilitarse', 'Error');
                agenda.deshabilitarAutomatico = false;
            } else if (agenda.estado == 'PENDIENTE') {
                agenda.estado = 'DESHABILITADO';
                agenda.deshabilitarAutomatico = false;
                $scope.modificarAgendas(agenda);
            } else {
                Toast.showError('No puede deshabilitar una agenda si no se encuentra en estado "PENDIENTE"', 'Error');
                agenda.deshabilitarAutomatico = true;
            }
        };

        $scope.modificarAgendas = function(agenda){
            $scope.agenda.idAgenda = agenda.idAgenda;
            $scope.agenda.estado = agenda.estado;
            $scope.agenda.usuario = user.name;
            Agenda.update({idAgenda: $scope.agenda.idAgenda}, $scope.agenda, function (e, res) {
                Toast.showSuccess("La operación se ha realizado con éxito.");
            }, function (error) {
                
            });
        }

        function gridDoor() {

            var gridDoor = {
                removeFilterAutomatico: removeFilterAutomatico,
                removeFilterManual: removeFilterManual,
                removeFilterHistorico: removeFilterHistorico,
                removeCalendarAutomatico: removeCalendarAutomatico,
                removeCalendarManual: removeCalendarManual,
                removeCalendarHistorico: removeCalendarHistorico,
                runProcess: agendasAutomaticasRun


            };


            return gridDoor;

            function agendasAutomaticasRun(agendaAutomatica)
            {
                // var proceso = $scope.agendasAutomaticas.data[index];
                var proceso =agendaAutomatica
                proceso.running = true;
                proceso.username = user.name;
                getEstadoAgenda(proceso).then(function (res) {

                    proceso.estado = res[0].estado;
                    var iProceso= new ProcesosRun(proceso);
                    iProceso.$save(function(p, res) {
                        proceso.running = false;
                        
                        
                        if (p.class == 14)
                        {
                            Toast.showError(p.message, 'Error');
                        }else{
                            updateAgenda(agendaAutomatica);
                        }
                    },function(error){
                        proceso.running = false;
                        Toast.showError(error.data.message, 'Error');
                    });
                });

            };

            function updateAgenda(agendaAutomatica){
                // var proceso = $scope.agendasAutomaticas.data[index];
                getEstadoAgenda(agendaAutomatica).then(function(res) {
                    agendaAutomatica.estado = res[0].estado;
                });
            }

            function removeFilterAutomatico() {
                $scope.agendasAutomaticas.filter.show = false;
                $scope.agendasAutomaticas.query.filter = '';

                if(typeof  $scope.agendasAutomaticas.filter.form!='undefined'){
                    if($scope.agendasAutomaticas.filter.form.$dirty) {
                        $scope.agendasAutomaticas.filter.form.$setPristine();
                    }
                }

            }

            function removeFilterHistorico() {
                $scope.agendasHistoricas.filter.show = false;
                $scope.agendasHistoricas.query.filter = '';
                $scope.agendaControl.getDataHistoricos();
            }

            function removeCalendarManual() {
                $scope.agendasManuales.calendar.show = false;
                $scope.agendasManuales.data = agendaControl.listManual;
                $scope.dateAgendaManual.hastaManualFec = null;
                $scope.dateAgendaManual.desdeManualFec = null;
                $scope.agendasManuales.query.page = 1;
                $scope.agendasManuales.count = $scope.agendasManuales.data.length;
            }

            function removeCalendarAutomatico() {
                $scope.agendasAutomaticas.calendar.show = false;
                $scope.hastaAutomaticoFec = null;
                $scope.desdeAutomaticoFec = null;
                $scope.agendasAutomaticas.data = agendaControl.listAutomatico;
                if($scope.agendasAutomaticas.calendar.form.$dirty) {
                    $scope.agendasAutomaticas.calendar.form.$setPristine();
                }
            }

            function removeCalendarHistorico() {
                $scope.agendasHistoricas.calendar.show = false;
                $scope.agendasHistoricas.query.desde = null;
                $scope.agendasHistoricas.query.hasta = null;

                $scope.agendaControl.getDataHistoricos();
            }

            function removeFilterManual() {

                $scope.agendasManuales.filter.show = false;
                $scope.agendasManuales.query.filter = '';
                $scope.agendasManuales.query.page = 1;
                $scope.agendasManuales.count = $scope.agendasManuales.data.length;
                if($scope.agendasManuales.filter.form.$dirty) {
                    $scope.agendasManuales.filter.form.$setPristine();
                }

            }
        }

        $scope.toggleRightNavAgenda = buildToggler('rightNavAgenda');
        function buildToggler(navID) {
            return function(agenda, idLogAgendaPasos) {
                $mdSidenav(navID).toggle();
                $scope.agendaControl.getAgendaPasos(agenda, idLogAgendaPasos);
            }}
    }]);

app.controller('agenda.elegirArchivos.ctrl', ['$scope', 'archivos', '$mdDialog', '$mdToast',
    function ($scope, archivos, $mdDialog, $mdToast) {
        $scope.title = 'Elija archivos a importar';

        $scope.items = archivos.split(';').filter(function (file) { return file !== ""}).map(function (it) {
            return {
                nombreArchivo: it,
                checked: false
            }
        });

        $scope.selected = [];

        $scope.toggle = function(file) {
            var index = $scope.selected.findIndex(x => x.nombreArchivo == file.nombreArchivo);
            if (index > -1) {
                $scope.selected.splice(index, 1);
            }
            else {
                $scope.selected.push(file);
            }
        };

        $scope.checked = function (file) {
            return $scope.selected.findIndex(x => x.nombreArchivo == file.nombreArchivo) > -1;
        };

        $scope.aceptar = function () {
            if ($scope.selected.length !== 1) {
                $mdToast.show({
                    template: '<md-toast class="md-toast-error">Debe seleccionar sólo un archivo</md-toast>',
                    hideDelay: 3000,
                    parent: '.toastParent',
                    position: 'top left'
                });
            } else {
                $mdDialog.hide($scope.selected);
            }
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }]);


app.controller('agenda.tipoProcesoImportacionMasiva.ctrl', ['$scope', 'Global', '$mdDialog', 'Toast','$resource',
    function ($scope, Global, $mdDialog, Toast,$resource) {
        $scope.title = 'Elija tipo de archivo a procesar';
        $scope.items=[
            {name:"Cuentas", value:"cuentas"},
            {name:"Tarjetas", value:"tarjetas"}
        ];
        
        $scope.aceptar = function () {
            $mdDialog.hide($scope.selected);
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
}]);

app.controller('agenda.fallecidosPeriodos.ctrl', ['$scope', 'archivos','periodos', '$mdDialog', '$mdToast',
    function ($scope, archivos,periodos, $mdDialog, $mdToast) {
        $scope.periodos=periodos[0];
        $scope.title = 'Archivos a importar';

        // este proceso procesa de un archivo por dia, por defecto de los pone en checked porque desde
        // la interfaz el usuario no selecciona archivos. (la pantalla es una modificacion de otra pantalla donde el usuario si seleccionaba archivos )
        $scope.selected = [];
        $scope.items = archivos.split(';').filter(function (file) { return file !== ""}).map(function (it) {
            return {
                nombreArchivo: it,
                checked: true
            }
        });
        $scope.selected = [];
        $scope.selected.push($scope.items[0]);

        $scope.aceptar = function () {
            if ($scope.selected.length !== 1) {
                $mdToast.show({
                    template: '<md-toast class="md-toast-error">Debe seleccionar sólo un archivo</md-toast>',
                    hideDelay: 3000,
                    parent: '.toastParent',
                    position: 'top left'
                });
                return;
            } else {
                $mdDialog.hide($scope.selected);
            }
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };
    }]);


app.controller('agenda.conveniosMarcarDatos.ctrl', ['$scope', 'convenios', 'proceso', 'Global', '$mdDialog', 'Toast','$resource',
    function ($scope, convenios, proceso, Global, $mdDialog, Toast,$resource) {
        $scope.title = 'Elija convenios a importar';
        $scope.items=[];
        var datosMarcados= $resource('/api/convenios/conveniosAperturaCuentas/1' )
        datosMarcados.query({}, function(res,d){
            // -------------------------------------------------------------------------
                convenios.map(function (it) {
                var existe=false;
                angular.forEach(res, function (convenio_procesado) {
                    if(convenio_procesado.nombreArchivo==it.nombreArchivo){
                        existe=true;
                    }
                });
                //if(existe==false){}
                $scope.items.push({
                     nombreArchivo: it.nombreArchivo,
                     codSistemas: it.sistemas,
                     checked: !existe
                });

            });

            $scope.selected = $scope.items.filter(function (it) { return proceso !== Global.regenArchivos && it.checked; });

            $scope.toggle = function(convenio) {
                var index = $scope.selected.findIndex(x => x.nombreArchivo == convenio.nombreArchivo);
                if (index > -1) {
                    $scope.selected.splice(index, 1);
                }
                else {
                    $scope.selected.push(convenio);
                }
            };

            $scope.checked = function (convenio) {
                return $scope.selected.findIndex(x => x.nombreArchivo == convenio.nombreArchivo) > -1;
            };

            // -------------------------------------------------------------------------------

        },function(error){
            Toast.showError(error.data.message);
        });

        $scope.aceptar = function () {
            if ($scope.selected.length === 0) {
                Toast.showError('Debe seleccionar sólo un archivo', '-error')
            } else {
                $mdDialog.hide($scope.selected.map((it) => {return it.codSistemas}));
            }
        };

        $scope.cancel = function() {
            $mdDialog.cancel();
        };



    }]);


var NovedadesMasivasUnifRtaSO=function($mdDialog,$resource, agenda){
    var _this=this;

    var tipos=[{novedad:"Tarjetas"},{novedad:"Cuentas"}];
    this.controller=function($scope,tipos){
        $scope.tipos=tipos;
        $scope.closeDialog = function() {
            $mdDialog.hide();
        }
        $scope.checked=function(item){
            for(var i=0;i<$scope.tipos.length;i++){
                if(!Object.is($scope.tipos[i], item)){
                    $scope.tipos[i].selected=false;
                }
            }
        }
        $scope.aceptar= function() {
            _this.tipoSeleccionado=_.where($scope.tipos, {selected: true});
            if(_this.tipoSeleccionado.length==0){
                agenda.showErrorToast('Error',"No se ha seleccionado un tipo");
                return;
            }
            _this.saveParam();
            $mdDialog.hide();
        }
    }

    this.saveParam=function(){

        console.log("agenda",_this.tipoSeleccionado)
        var param = {
            nombreProceso: agenda.proceso.descripcion,
            agrupar: 1,
            paramNombre: 'TIPO_ARCHIVO',
            paramValor: _this.tipoSeleccionado[0].novedad
        };

        $resource('/api/procesos/procesoParamInsertar/').save(param,
            function(resp, headers){
                console.log("OK -> ",resp);
                agenda.runConfirm();
            },
            function(err){
                console.log("error -> ",err);
            })




    }

    this.show=function(){
        console.log("Show")
        _this.titulo = 'Archivos a procesar, desea continuar?';
        confirm = $mdDialog.confirm()
            .title(_this.titulo )
            .textContent(agenda.files)
            .ariaLabel('Lucky day')
            .targetEvent(this.event)
            .ok('Aceptar')
            .cancel('Cancelar');

        $mdDialog.show(confirm).then(function(){
            agenda.files_data= agenda.files_data.substring(0, agenda.files_data.length - 1);
            if (agenda.files_data.toUpperCase()=='CONFIRMADA.XLS'){
                _this.inputNovedadUsuario();
            }else{
                agenda.runConfirm();
            }
        });
    }
    this.inputNovedadUsuario=function(){
        $mdDialog.show({
            controller: _this.controller,
            templateUrl: 'NovMasUnifRtaSO.tmpl.html',
            parent: angular.element(document.body),
            locals: {
                tipos:tipos
            },
            clickOutsideToClose:true
        })
    }
}

