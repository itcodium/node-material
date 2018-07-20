// 2017-06-01 Prueba depues Merge

app.controller('movimientosLiquidados.ctrl', function ($scope, $resource, $filter, $timeout, Excel, $mdToast, $http) {
    $scope.changeLimit= function () {
        $scope.LimitNroCuentaEntidad= ($scope.filter_entidad.entidad === '067' || $scope.filter_entidad.entidad === '667') ? 10 : 7;
        console.log("filter_entidad",$scope.filter_entidad)
    }

    $scope.showError = function (msg) {
        $mdToast.show({
            template: '<md-toast class="md-toast-error">' + msg + '</md-toast>',
            hideDelay: 3000,
            parent: '.toastParent',
            position: 'top left'
        });
    };

    $scope.isOpen = function(index, $event) {

        console.log("IndexController",window.user);
        $event.preventDefault();
        $event.stopPropagation();
        if($scope.ctrl.showMenu[index] != undefined){
            $scope.ctrl.showMenu[index] = !$scope.ctrl.showMenu[index];
        }else{
            $scope.ctrl.showMenu[index] = true;
        }
        $(".submenuList").removeClass("ng-hide").addClass("ng-hide");
    };

    $scope.show = { filter: false };
    $scope.loaded = true;
    $scope.filtrado = false;
    $scope.columns = [
        { id: 1, show: true, name: 'Entidad', field: 'entidad', tip: 'Entidad' },
        { id: 2, show: true, name: 'Administrador', field: 'codAdministrador', tip: 'Codigo de Administrador'},
        { id: 3, show: true, name: 'Banco', field: 'codBanco', tip: 'Codigo de Banco'},
        { id: 4, show: true, name: 'Sucursal', field: 'codSucursal', tip: 'Codigo de Sucursal'},
        { id: 5, show: true, name: 'Transaccion', field: 'codTransaccion', tip: 'Codigo de Transaccion'},
        { id: 6, show: true, name: 'Nro. Tarjeta', field: 'nroTarjeta', tip: 'Numero de Tarjeta'},
        { id: 7, show: true, name: 'Nro. Cuenta', field: 'nroUsuario', tip: 'Numero de Cuenta'},
        { id: 8, show: true, name: 'Establecimiento', field: 'denomEstablecimiento', tip: 'Establecimiento'},
        { id: 9, show: true, name: 'Nro. Comprobante', field: 'nroComprobante', tip: 'Numero de Comprobante'},
        { id: 10, show: true, name: 'Fecha Origen', field: 'fecOrigen', tip: 'Fecha Origen', filter: 'date'},
        { id: 11, show: true, name: 'Fecha Cierre', field: 'fecCierre', tip: 'Fecha Cierre', filter: 'date'},
        { id: 12, show: true, name: 'Fecha Intercambio', field: 'fecIntercambio', tip: 'Fecha Intercambio', filter: 'date'},
        { id: 13, show: true, name: 'Moneda', field: 'moneda', tip: 'Moneda'},
        { id: 14, show: true, name: 'Importe', field: 'importe', tip: 'Importe', filter: 'number'},
        { id: 15, show: true, name: 'Moneda Origen', field: 'monOrigen', tip: 'Moneda de Origen'},
        { id: 17, show: true, name: 'Importe Origen', field: 'impMonOrigen', tip: 'Importe en la moneda de origen', filter: 'number'},
        { id: 18, show: true, name: 'Importe Origen Dolares', field: 'impOrigDolares', tip: 'Importe en dolares ', filter: 'number'},
        { id: 19, show: true, name: 'Mod. Liquidacion', field: 'modLiq', tip: 'Mod. Liquidacion'},
        { id: 20, show: true, name: 'Rubro', field: 'rubro', tip: 'Rubro'},
        { id: 21, show: true, name: 'Banco de Estab.', field: 'codBancoEstab', tip: 'Codigo del Banco del Establecimiento'},
        { id: 22, show: true, name: 'Cartera', field: 'cartera', tip: 'Cartera'},
        { id: 23, show: true, name: 'GAF', field: 'gaf', tip: 'GAF'},
        { id: 24, show: true, name: 'Tipo de Cuenta', field: 'tipoCuenta', tip: 'Tipo de Cuenta'},
        { id: 25, show: true, name: 'Nro.Comercio', field: 'nroComercio', tip: 'Nro. Comercio'},
        { id: 26, show: true, name: 'Deb. Automático', field: 'debAutomatico', tip: 'Débito Automatico'},
        { id: 27, show: true, name: 'Plan Cuotas', field: 'planCuotas', tip: 'Plan de Cuotas'},
        { id: 28, show: true, name: 'Nro. Cuota', field: 'nroCuotas', tip: 'Numero de Cuota'}
    ];

    $scope.columnsMC = [
        { id: 1, show: true, name: 'Entidad', field: 'Entidad', tip: 'Entidad'},
        { id: 2, show: true, name: 'Sucursal', field: 'sucursal', tip: 'Sucursal'},
        { id: 3, show: true, name: 'Cuenta', field: 'nroSocio', tip: 'Cuenta'},
        { id: 4, show: true, name: 'Fec. Cierre', field: 'fecCierre', tip: 'Fecha Cierre', filter: 'date'},
        { id: 5, show: true, name: 'ValorLC', field: 'ValorLC', tip: 'ValorLC'},
        { id: 6, show: true, name: 'Tipo Tarjeta', field: 'tipo', tip: 'Tipo de Tarjeta'},
        { id: 7, show: true, name: 'Prod', field: 'codProducto', tip: 'Codigo Producto'},
        { id: 8, show: true, name: 'GAF', field: 'codAfinidadGrupo', tip: 'GAF'},
        { id: 9, show: true, name: 'Mod. Liquidacion', field: 'modLiquidacion', tip: 'Mod. Liquidacion'},
        { id: 10, show: true, name: 'SubMod. Gastos', field: 'subModeloGastos', tip: 'SubMod. Gastos'},
        { id: 11, show: true, name: 'SubMod. Parametros', field: 'subModeloParametros', tip: 'SubMod. Parametros'},
        { id: 12, show: true, name: 'SubMod. Tasas', field: 'subModeloTasas', tip: 'SubMod. Tasas'},
        { id: 13, show: true, name: 'GrupoCC', field: 'grupo', tip: 'GrupoCC'},
        { id: 14, show: true, name: 'Cod. Concepto', field: 'conceptoCC', tip: 'Cod. Concepto'},
        { id: 15, show: true, name: 'Moneda', field: 'moneda', tip: 'Codigo Moneda'},
        { id: 16, show: true, name: 'Cupon', field: 'cupon', tip: 'Cupon'},
        { id: 17, show: true, name: 'Cuota Plan', field: 'cuotasPlan', tip: 'Cuota Plan'},
        { id: 18, show: true, name: 'Cuota Vig.', field: 'cuotasVigente', tip: 'Cuota Vigente'},
        { id: 19, show: true, name: 'Cod. Ajuste', field: 'CodAjuste', tip: 'Codigo de Ajuste'},
        { id: 20, show: true, name: 'FSAC', field: 'FSAC', tip: 'FSAC'},
        { id: 21, show: true, name: 'Imp. Pesos', field: 'Imp_Pesos', tip: 'Importe Pesos', filter: 'number'},
        { id: 22, show: true, name: 'Imp. Dolar', field: 'Imp_Dolar', tip: 'Importe Dolares', filter: 'number'},
        { id: 23, show: true, name: 'Tipo Conce.', field: 'TipConce', tip: 'Tipo Conce.'}
    ];

    $scope.columnsMC120 = [
        { id: 1, show: true, name: 'Nro. Tarjeta', field: 'nroTarjeta', tip: ''},
        { id: 2, show: true, name: 'Entidad', field: 'entidad', tip: ''},
        { id: 3, show: true, name: 'Sucursal', field: 'sucursal', tip: ''},
        { id: 4, show: true, name: 'Nro. Cuenta', field: 'nroCuenta', tip: ''},
        { id: 5, show: true, name: 'Tipo Socio', field: 'tipoSocio', tip: ''},
        { id: 6, show: true, name: 'Digito Verificador', field: 'digitoVerif', tip: ''},
        { id: 7, show: true, name: 'Grupo CC', field: 'grupoCtaCte', tip: ''},
        { id: 8, show: true, name: 'Nro. Establecimiento', field: 'nroComercio', tip: ''},
        { id: 9, show: true, name: 'Establecimiento', field: 'nombreFantasia', tip: ''},
        { id: 10, show: true, name: 'Ramo Establecimiento', field: 'ramoComercio', tip: ''},
        { id: 11, show: true, name: 'Cod. Movimiento', field: 'codMovimiento', tip: ''},
        { id: 12, show: true, name: 'Nro. Caja', field: 'nroCaja', tip: ''},
        { id: 13, show: true, name: 'Nro. Caratula', field: 'nroCaratula', tip: ''},
        { id: 14, show: true, name: 'Nro. Resumen', field: 'nroResumen', tip: ''},
        { id: 15, show: true, name: 'Nro. Cupon', field: 'nroCupon', tip: ''},
        { id: 16, show: true, name: 'Cant. Cuotas', field: 'cantCuotas', tip: ''},
        { id: 17, show: true, name: 'Cuota Vig.', field: 'cuotaVigente', tip: ''},
        { id: 18, show: true, name: 'Mot. Contrapartida', field: 'motContrapartida', tip: ''},
        { id: 19, show: true, name: 'Cargo PorServicio', field: 'cargoPorServicio', tip: ''},
        { id: 20, show: true, name: 'Concepto Ajuste', field: 'conceptoAjuste', tip: ''},
        { id: 21, show: true, name: 'Fecha Operación', field: 'fechaOperacion', tip: '', filter: 'date'},
        { id: 22, show: true, name: 'Fecha Clearing', field: 'fechaClearing', tip: '', filter: 'date'},
        { id: 23, show: true, name: 'Fecha CC', field: 'fechaCtaCte', tip: '', filter: 'date'},
        { id: 24, show: true, name: 'Moneda Origen', field: 'codMonedaOrigen', tip: ''},
        { id: 25, show: true, name: 'Importe Origen', field: 'impMonedaOrigen', tip: '', filter: 'number'},
        { id: 26, show: true, name: 'Moneda', field: 'codMoneda', tip: ''},
        { id: 27, show: true, name: 'Importe Total', field: 'importeTotal', tip: '', filter: 'number'},
        { id: 28, show: true, name: 'Importe Sin Desc.', field: 'importSinDescto', tip: '', filter: 'number'},
        { id: 29, show: true, name: 'Importe Final', field: 'importeFinal', tip: '', filter: 'number'},
        { id: 30, show: true, name: 'Tipo Ajuste', field: 'tipoAjuste', tip: ''},
        { id: 31, show: true, name: 'Afecta Saldo', field: 'afectaSaldo', tip: ''},
        { id: 32, show: true, name: 'Aplicacion', field: 'aplicacion', tip: ''},
        { id: 33, show: true, name: 'Compras Mes Anter.', field: 'comprasMesAnter', tip: ''},
        { id: 34, show: true, name: 'Tipo Movimiento', field: 'tipoMovimiento', tip: ''},
        { id: 35, show: true, name: 'Deb. Cred.', field: 'mcaDebCred', tip: ''},
        { id: 36, show: true, name: 'Tipo Prestamo', field: 'tipoPrestamo', tip: ''},
        { id: 37, show: true, name: 'Nro. Prestamo', field: 'nroPrestamo', tip: ''},
        { id: 38, show: true, name: 'Tipo Amortizacion', field: 'tipoAmortizacion', tip: ''},
        { id: 39, show: true, name: 'Tipo Tasa', field: 'tipoTasa', tip: ''},
        { id: 40, show: true, name: 'TNA', field: 'tna', tip: '', filter: 'number'},
        { id: 41, show: true, name: 'TEA', field: 'tea', tip: '', filter: 'number'},
        { id: 42, show: true, name: 'Interes Cuota', field: 'interesCuota', tip: '', filter: 'number'},
        { id: 43, show: true, name: 'Importe Cotorg.', field: 'importeCotorg', tip: '', filter: 'number'},
        { id: 44, show: true, name: 'Cancelacion', field: 'marcaCancelacion', tip: ''},
        { id: 45, show: true, name: 'Importe Cancel', field: 'importeCancel', tip: '', filter: 'number'},
        { id: 46, show: true, name: 'Importe Seg. Vida', field: 'importeSegVida', tip: '', filter: 'number'},
        { id: 47, show: true, name: 'Iva Seg. Vida', field: 'marcaIvaSegVida', tip: ''},
        { id: 48, show: true, name: 'Alicuota Iva', field: 'porcAlicuotaIva', tip: ''},
        { id: 49, show: true, name: 'Motivo Excep. Iva', field: 'MotivoExcepIva', tip: ''}
    ];

    $scope.instancias = [ '1', '2', '3', '4' ];
    $scope.periodos = [];
    $scope.grilla = {
        filter: {
            options: { debounce: 500 }
        },

        query: {
            filter: {
                entidad: '090',
                nroCuenta: '',
                fechaHasta: new Date(new Date().getFullYear(), 11, 31),
                fechaDesde: new Date(new Date().getFullYear(), 0, 1)
            },
            limit: 10,
            order: 'fecCierre',
            page: 1,
            where: ''
        },
        queryMC:{
            limit: 10,
            order: 'fecCierre',
            page: 1,
            where: ''
        },
        data: [],
        dataMC: [],
        count: 0,
        countMC: 0,
        nohayDatosMC: "",
        nohayDatos: ""
    };

    $scope.showVal = function(value, filter) {

        if (filter == 'date') {
            return moment(value).utc().format('DD/MM/YYYY')
        }
        if (filter == 'number') {
            return ((value) ? ($filter('number')(value, 2).replace(',', ';').replace(/\./g, ',').replace(';','.')) : value);
        }
        if (filter == 'coef') {
            return $filter('number')(value, 4);
        }

        return value;
    };

    $scope.init = function () {
        $scope.load();
    };

    $scope.entidades=[
        {"tabla":"Master","entidad":"090"},
        {"tabla":"Master","entidad":"091"},
        {"tabla":"VISA","entidad":"067"},
        {"tabla":"VISA","entidad":"667"}
    ];
    $scope.filter_entidad=$scope.entidades[0];
    $scope.EntidadShow = "";
    $scope.changeLimit();
    $scope.load = function (query) {
        if ($scope.filtrado) {
            $scope.loaded = false;
            $scope.EntidadShow = $scope.filter_entidad.tabla;
            $scope.grilla.query.filter.nroCuenta = formatCuenta($scope.grilla.query.filter.nroCuenta);
            if($scope.filter_entidad.tabla == 'VISA'){
                $scope.promiseObj = $resource('/api/reportes/reporteMovLiquidVISA').query(query || $scope.grilla.query, getDatosVISA, mal).$promise;
            }else{
                $scope.promiseObj = $resource('/api/reportes/reporteMovLiquidMaster').query(query || $scope.grilla.query, getDatosMaster, mal).$promise;
            }
        }

        function getDatosVISA(obj) {
            $scope.loaded = true;
            $scope.grilla.data = [];
            for(var x in obj[0]){
                if(!$.isFunction(obj[0][x])){
                    $scope.grilla.data.push(obj[0][x])
                }
            };
            if (obj.length > 1) {
                $scope.grilla.count = obj[1][0].rows;
                if(!$scope.grilla.count || $scope.grilla.count == 0){
                    $scope.grilla.nohayDatos = 'No se encontraron datos';
                }else{
                    $scope.grilla.nohayDatos = '';
                }
            }
        }

        function getDatosMaster(obj){
            $scope.loaded = true;
            console.log(obj);
            $scope.grilla.data = [];
            for(var x in obj[0]){
                if(!$.isFunction(obj[0][x])){
                    $scope.grilla.data.push(obj[0][x])
                }
            };

            $scope.grilla.count = obj[1][0].rows;
            if(!$scope.grilla.count || $scope.grilla.count == 0){
                $scope.grilla.nohayDatos = 'No se encontraron datos';
            }else{
                $scope.grilla.nohayDatos = '';
            }
            $scope.grilla.dataMC = [];
            for(var x in obj[2]){
                if(!$.isFunction(obj[2][x])){
                    $scope.grilla.dataMC.push(obj[2][x])
                }
            };
            $scope.grilla.countMC = obj[3][0].rows;
            if(!$scope.grilla.countMC || $scope.grilla.countMC == 0){
                $scope.grilla.nohayDatosMC = 'No se encontraron datos';
            }else{
                $scope.grilla.nohayDatosMC = '';
            }
        }

        function mal(obj) {
            //console.log('bad, very bad', obj);
            console.log(obj.data.name ,obj.data.message)
            $scope.loaded = true;
            $scope.showError ('Se produjo error: ' + obj.data.name + ': ' +  obj.data.message)
        }

    };

    $scope.onPaginate = function(page, limit) {
        $scope.grilla.query.page = page;
        $scope.grilla.query.limit = limit;
    };

    $scope.onPaginateMC = function(page, limit) {
        $scope.grilla.queryMC.page = page;
        $scope.grilla.queryMC.limit = limit;
    };

    $scope.onReorder = function(order) {
        angular.extend($scope.grilla.query, {order: order});
    };
    $scope.onReorderMC = function(order) {
        angular.extend($scope.grilla.queryMC, {order: order});
    };


    $scope.onFilter = function() {
        $scope.grilla.query.filter.entidad=$scope.filter_entidad.entidad;
        console.log("$scope.filter_entidad",$scope.filter_entidad)
        if ($scope.grilla.query.filter.entidad.entidad='' && $scope.grilla.query.filter.nroCuenta === '')
        {
            $scope.filtrado = false;
        }else {
            $scope.filtrado = true;
        }

        if (!$scope.filtrado) {
            $scope.filterApplied = false;
            return;
        }

        $scope.grilla.query.where = buildWhere();
        $scope.load(angular.extend($scope.grilla.query, { page: 1}));
        $scope.filterApplied = true;
    };

    $scope.checkHasData = function(){
        if((!$scope.grilla.count || $scope.grilla.count == 0) && (!$scope.grilla.countMC || $scope.grilla.countMC == 0)) {
            return false;
        }
        return true;
    }
    $scope.exportarAExcel = function () {
        if( $scope.checkHasData()){
            var exportUrl = "";
            if($scope.filter_entidad.tabla == 'VISA'){
                exportUrl = '/api/reportes/reporteMovLiquidVISA/Excel?';
            }else{
                exportUrl = '/api/reportes/reporteMovLiquidMaster/Excel?';
            }
            exportUrl += `entidad=${$scope.grilla.query.filter.entidad}&`;
            exportUrl += `nroCuenta=${formatCuenta($scope.grilla.query.filter.nroCuenta)}&`;
            exportUrl += `fechaHasta=${$scope.grilla.query.filter.fechaHasta}&`;
            exportUrl += `fechaDesde=${$scope.grilla.query.filter.fechaDesde}`;

            var anchor = angular.element('<a/>');
            anchor.attr({
                href: exportUrl,
                target: '_blank',
                download: 'MovLiqui_'+$scope.filter_entidad.entidad +'.xlsx'
            })[0].click();
        }else{
            $scope.showError ('No hay datos para exportar');
        }
    };

    function buildWhere() {
        var where = 'where ';
        if ($scope.grilla.query.filter.nroCuenta !== '' && $scope.grilla.query.filter.nroCuenta !== null) {
            where = where + "CONVERT(varchar, CONVERT(int, nroCuenta)) LIKE '%" + $scope.grilla.query.filter.nroCuenta + "%'";
            // where = where + "nroCuenta LIKE '" + $scope.grilla.query.filter.nroCuenta + "%'";
        }
        return where;
    }

    function formatCuenta(txtCuenta){
        return (new Array($scope.LimitNroCuentaEntidad + 1).join('0') + txtCuenta).slice(-$scope.LimitNroCuentaEntidad);
    }
});

