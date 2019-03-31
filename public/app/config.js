window.app.config(['$routeProvider', '$mdThemingProvider', '$mdDateLocaleProvider',
    function ($routeProvider, $mdThemingProvider, $mdDateLocaleProvider) {

        $mdDateLocaleProvider.formatDate = function (date) {
            return date ? moment(date).format('DD/MM/YYYY') : '';
        };

        $mdDateLocaleProvider.parseDate = function (dateString) {
            var m = moment(dateString, 'DD/MM/YYYY', true);
            return m.isValid() ? m.toDate() : new Date(NaN);
        };

        var SUCURSAL_URL = "";
        var SUCURSAL_CONTROLLER = "";
        if (typeof user != 'undefined') {
            console.log("user", user)
        }

        try {

            if (typeof user != 'undefined' && user != null) {
                if (user.app == "TC") {
                    SUCURSAL_URL = "app.views/sucursalTC/list.html";
                    SUCURSAL_CONTROLLER = "sucursalTC.ctrl";
                } else {
                    SUCURSAL_URL = "app.views/sucursal/list.html";
                    SUCURSAL_CONTROLLER = "sucursal.ctrl";
                }
            }
        }
        catch (err) {
            console.log("Inicio de sucursales -> ", err.message);
        }

        tienePermiso = function (permiso, $location) {
            function filtrarPorCodigo (permiso) {
                return permiso.codigo === this.valueOf();
            }
            if (window.user.permisos.filter(filtrarPorCodigo, permiso).length == 0)
                $location.path('/');
        }

        $routeProvider
            .when('/', { templateUrl: 'app.views/index.html' })
            .when('/acciones', { templateUrl: 'app.views/admin/acciones/list.html', controller: 'accionesList.ctrl' })
            .when('/acciones.create', { templateUrl: 'app.views/admin/acciones/create.html', controller: 'accionesCreate.ctrl' })
            .when('/acciones.delete', { templateUrl: 'app.views/admin/acciones/delete.html', controller: 'accionesDelete.ctrl' })
            .when('/usuarios', { templateUrl: "app.views/usuarios/usuarios.html", controller: 'usuarios.ctrl' })
            .when('/acordeon', { templateUrl: "app.views/acordeon/acordeon.html", controller: 'acordeon.ctrl' })
            .when('/perfiles', { templateUrl: 'app.views/admin/perfiles/list.html', controller: 'perfilList.ctrl' })
            .when('/usuariosList', { templateUrl: 'app.views/usuarios/list.html', controller: 'usuariosList.ctrl' })

            .when('/tipoDocumento', { templateUrl: "app.views/documento/list.html", controller: 'tipoDocumento.ctrl' })
            .when('/apoderado', { templateUrl: "app.views/apoderado/list.html", controller: 'apoderado.ctrl' })
            .when('/categoria', { templateUrl: "app.views/categoria/list.html", controller: 'categoria.ctrl' })
            .when('/caracteresEspeciales', { templateUrl: "app.views/caracteres/list.html", controller: 'caracteres.ctrl' })
            .when('/sucursal', { templateUrl: SUCURSAL_URL, controller: SUCURSAL_CONTROLLER })
            // .when('/sucursal2',     {    templateUrl: "app.views/tablas/sucursal/ABMeventos.html" , controller: 'sucursal2.ctrl'  })
            .when('/calendario', { templateUrl: "app.views/calendario/list.html", controller: 'calendario.ctrl' })
            .when('/archivosMarca', { templateUrl: "app.views/archivos/list.html", controller: 'archivosMarca.ctrl' })
            .when('/procesos', { templateUrl: "app.views/procesos/procesos.html", controller: 'procesos.ctrl' })
            .when('/ejemplo', { templateUrl: "app.views/tablas/ejemplo/list.html", controller: 'ejemplo.ctrl' })
            .when('/agenda', { templateUrl: "app.views/agenda/list.html", controller: 'agenda.ctrl' })
            .when('/testdate', { templateUrl: "app.views/tablas/date/add.html", controller: 'test_date.ctrl' })
            .when('/autocomplete', { templateUrl: "app.views/tablas/date/autocomplete.html", controller: 'test_autocomplete' })
            .when('/controlArchivos', { templateUrl: "app.views/controlArchivos/list.html", controller: 'controlArchivos.ctrl' })
            .when('/cuentasNoActivas', { templateUrl: "app.views/cuentasNoActivas/list.html", controller: 'cuentasNoActivas.ctrl' })
            .when('/controlSucursales', { templateUrl: "app.views/controlSucursales/list.html", controller: 'controlSucursales.ctrl' })

            .when('/reporteTC', { templateUrl: "app.views/reportes/reporteTC.html", controller: 'reporteTC.ctrl' })
            .when('/reportesVinculacion', { templateUrl: "app.views/reportes/reportesVinculacion/reportesVinculacion.html", controller: 'reportesVinculacion.ctrl' })
            .when('/masterSeguros', { templateUrl: "app.views/reportes/masterSeguros/masterSeguros.html", controller: 'masterSeguros.ctrl' })
            .when('/sinRelacion', { templateUrl: "app.views/reportes/sinRelacionConCuenta/list.html", controller: 'sinRelacionConCuenta.ctrl' })
            .when('/reporteTarjetasEnBoletin', { templateUrl: "app.views/reportes/reporteTarjetasEnBoletin/reporteTarjetasEnBoletin.html", controller: 'reporteTarjetasEnBoletin.ctrl' })
            .when('/reporteRecargables', { templateUrl: "app.views/reportes/recargables/recargables.html", controller: 'reporteRecargables.ctrl' })
            .when('/reportesClientesRechazados', { templateUrl: "app.views/reportes/clientesRechazados/list.html", controller: 'clientesRechazados.ctrl' })
            .when('/reportesBajaApoderados', { templateUrl: "app.views/reportes/bajaApoderados/list.html", controller: 'bajaApoderados.ctrl' })
            .when('/dgiDiferencias', { templateUrl: "app.views/reportes/dgiDiferencias/list.html", controller: 'dgiDiferencias.ctrl' })
            .when('/movimientosLiquidados', { templateUrl: "app.views/reportes/movimientosLiquidados/movimientosLiquidados.html", controller: 'movimientosLiquidados.ctrl' })
            .when('/cuotasPendientes', { templateUrl: "app.views/reportes/cuotasPendientes/cuotasPendientes.html", controller: 'cuotasPendientes.ctrl' })

            .when('/campañas', { templateUrl: 'app.views/campañas/list.html', controller: 'campañas.ctrl' })
            .when('/distribuciones', { templateUrl: 'app.views/distribuciones/list.html', controller: 'distribuciones.ctrl' })
            .when('/procesosCampañas', { templateUrl: 'app.views/procesosCampañas/list.html', controller: 'procesosCampañas.ctrl' })
            .when('/mailsConfigurables', { templateUrl: 'app.views/mailsConfigurables/list.html', controller: 'mailsConfigurables.ctrl' })
            .when('/campaniasPorCierre', { templateUrl: 'app.views/reportes/campañasPorCierre/list.html', controller: 'campaniasPorCierre.ctrl' })
            .when('/retenciones', { templateUrl: 'app.views/retencion/list.html', controller: 'Retenciones.ctrl' })
            .when('/divisiones', { templateUrl: 'app.views/divisiones/divisiones.html', controller: 'DivisionesController', controllerAs: 'vm' })
            .when('/regiones', { templateUrl: 'app.views/regiones/regiones.html', controller: 'RegionesController', controllerAs: 'vm' })
            .when('/reportesComercio', { templateUrl: 'app.views/reportes/procesoConvenio/list.html', controller: 'reporteProcesoConvenio.ctrl' })
            .when('/fallecidosPeriodo', {
                templateUrl: 'app.views/fallecidos/fallecidosPeriodo.html',
                controller: 'fallecidosPeriodo.ctrl',
                resolve: { app: function ($location) { tienePermiso('tablasParametricas.fallecidosPeriodo', $location); } }
            })
            .when('/fallecidos', { templateUrl: 'app.views/fallecidos/fallecidos.html', controller: 'fallecidos.ctrl' })
            .when('/configuracionContable', { templateUrl: 'app.views/configuracionContable/list.html', controller: 'configuracionContable.ctrl' })
            .when('/digitadores', {
                templateUrl: 'app.views/digitadores/list.html',
                controller: 'digitadores.ctrl',
                resolve: { app: function ($location) { tienePermiso('tablasParametricas.digitadores', $location); } }
            })
            .when('/motivosDeRechazo', { templateUrl: 'app.views/motivosDeRechazo/list.html', controller: 'motivosDeRechazo.ctrl' })
            .when('/promoTC', { templateUrl: 'app.views/promociones/promoTC.html', controller: 'promoTC.ctrl' })
            .when('/promoTDAsoc', { templateUrl: 'app.views/promociones/promoTD/promoTDAsoc.html', controller: 'promoTDAsoc.ctrl' })

            .when('/agrupamientos', {
                templateUrl: 'app.views/agrupamientos/list.html',
                controller: 'agrupamientos.ctrl',
                resolve: { app: function ($location) { tienePermiso('conciliaciones.agrupamientos', $location); } }
            })
            .when('/asignarAgrupador', {
                templateUrl: 'app.views/asignarAgrupador/list.html',
                controller: 'asignarAgrupador.ctrl',
                resolve: { app: function ($location) { tienePermiso('conciliaciones.asignarAgrupador', $location); } }
            })
            .when('/movimientosPresentados', {
                templateUrl: 'app.views/movimientosPresentados/list.html',
                controller: 'movimientosPresentados.ctrl',
                resolve: { app: function ($location) { tienePermiso('conciliaciones.movimientosPresentados', $location); } }
            })
            .when('/codigoDeAjustes', {
                templateUrl: 'app.views/codigoDeAjustes/codigoDeAjustes.html',
                controller: 'codigoDeAjustes.ctrl',
                resolve: { app: function ($location) { tienePermiso('conciliaciones.codigoDeAjustes', $location); } }
            })
            .when('/ABMporcentajeComision', {
                templateUrl: 'app.views/porcentajeComision/porcentajeComision.html',
                controller: 'porcentajeComision.ctrl',
                resolve: { app: function ($location) { tienePermiso('conciliaciones.ABMporcentajeComision', $location); } }
            })
            .when('/entesExternos', {
                templateUrl: 'app.views/entesExternos/list.html',
                controller: 'entesExternos.ctrl',
                resolve: { app: function ($location) { tienePermiso('conciliaciones.entesExternos', $location); } }
            })
            .when('/ABMeventos', {
                templateUrl: 'app.views/ABMeventos/ABMeventos.html',
                controller: 'ABMeventos.ctrl',
                resolve: { app: function ($location) { tienePermiso('conciliaciones.ABMeventos', $location); } }
            })
            .when('/conciliacionCobranzas', {
                templateUrl: 'app.views/conciliacionCobranzas/list.html',
                controller: 'conciliacionCobranzas.ctrl',
                resolve: { app: function ($location) { tienePermiso('conciliaciones.conciliacionCobranzas', $location); } }
            })
            .when('/cruceVISACO', {
                templateUrl: 'app.views/cruceVISACO/cruceVISACO.html',
                controller: 'cruceVISACO.ctrl',
                resolve: { app: function ($location) { tienePermiso('reclamos.cruceVISACO', $location); } }
            })




            .when('/partPendientesVi', {
                templateUrl: 'app.views/partPendientesVi/partPendientesVi.html',
                controller: 'partPendientesVi.ctrl',
                resolve: { app: function ($location) { tienePermiso('reclamos.partPendientesVi', $location); } }
            })
            .when('/cancelaciones', {
                templateUrl: 'app.views/cancelaciones/list.html',
                controller: 'cancelaciones.ctrl',
                resolve: { app: function ($location) { tienePermiso('reclamos.cancelaciones', $location); } }
            })

            .when('/visaElectron', {
                templateUrl: 'app.views/reclamos/index.html',
                controller: 'reclamoselectron.ctrl',
                resolve: { app: function ($location) { tienePermiso('reclamos.electron', $location); } }
            })

            .when('/cantidadCuentasTarjetas', {
                templateUrl: 'app.views/cantidadCuentasTarjetas/cantidadCuentasTarjetas.html',
                controller: 'cantidadCuentasTarjetas.ctrl',
                resolve: { app: function ($location) { tienePermiso('novedadesMasivas.cantidadCuentasTarjetas', $location); } }
            })

            .when('/datosFijosEDP', {
                templateUrl: 'app.views/datosFijosEDP/list.html',
                controller: 'datosFijosEDP.ctrl',
                resolve: { app: function ($location) { tienePermiso('novedadesMasivas.datosFijosEDP', $location); } }
            })
            .when('/rechazosUnificado', {
                templateUrl: 'app.views/rechazosUnificado/rechazosUnificado.html',
                controller: 'rechazosUnificados.ctrl',
                resolve: { app: function ($location) { tienePermiso('novedadesMasivas.rechazosUnificado', $location); } }
            })

            .when('/limitesDeCompras', {
                templateUrl: 'app.views/limitesDeCompras/limitesDeCompras.html',
                controller: 'limitesDeCompras.ctrl',
                resolve: { app: function ($location) { tienePermiso('novedadesMasivas.limitesDeCompras', $location); } }
            })

            .when('/datosFijosVS', {
                templateUrl: 'app.views/datosFijosVS/datosFijosVS.html',
                controller: 'datosFijosVS.ctrl',
                resolve: { app: function ($location) { tienePermiso('novedadesMasivas.datosFijosVS', $location); } }
            })

            .when('/rechazosVS', {
                templateUrl: 'app.views/rechazosVS/rechazosVS.html',
                controller: 'rechazosVS.ctrl',
                resolve: { app: function ($location) { tienePermiso('novedadesMasivas.rechazosVS', $location); } }
            })

            .when('/unificado', {
                templateUrl: 'app.views/unificado/unificado.html',
                controller: 'unificado.ctrl',
                resolve: { app: function ($location) { tienePermiso('novedadesMasivas.unificado', $location); } }
            })

            .when('/riesgoContingente', { templateUrl: 'app.views/fallecidos/RiesgoContingente/list.html', controller: 'riesgoContingente.ctrl' })

            //.when('/test',{ templateUrl:'app.views/tablas/date/autocomplete.html',controller:'agrupamientos.ctrl'})
            .when('/promociones', {
                templateUrl: 'app.views/promociones/promociones/list.html',
                controller: 'promociones.ctrl',
                resolve: { app: function ($location) { tienePermiso('promociones.promocionesABM', $location); } }
            })
            .when('/promoTDConsulta', { templateUrl: 'app.views/promociones/promoTDConsulta/promoTDConsulta.html', controller: 'promoTDConsulta.ctrl' })

            .when('/cotizacion', {
                templateUrl: 'app.views/cotizacion/cotizacion.html',
                controller: 'cotizacion.ctrl'
            })

            .otherwise({ redirectTo: '/' });

        $mdThemingProvider.definePalette('docs-blue', $mdThemingProvider.extendPalette('blue', {
            '50': '#DCEFFF',
            '100': '#AAD1F9',
            '200': '#7BB8F5',
            '300': '#4C9EF1',
            '400': '#1C85ED',
            '500': '#106CC8',
            '600': '#0159A2',
            '700': '#025EE9',
            '800': '#014AB6',
            '900': '#013583',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': '50 100 200 A100',
            'contrastStrongLightColors': '300 400 A200 A400'
        }));
        $mdThemingProvider.definePalette('docs-red', $mdThemingProvider.extendPalette('red', {
            'A100': '#DE3641'
        }));

        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('yellow')
            .dark();

        $mdThemingProvider.theme('default')
            .primaryPalette('docs-blue')
            .accentPalette('docs-red');


    }]);



//Removing tomcat unsupported headers
/* todo caob -- removed 20160308
window.app.config(['$httpProvider', function($httpProvider, Configuration) {
    //delete $httpProvider.defaults.headers.common["X-Requested-With"];
}]);
*/

// todo caob -- test
//window.app.config(['$mdIconProvider', function($mdIconProvider) {
//    $mdIconProvider
//        .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
//        .defaultIconSet('img/icons/sets/core-icons.svg', 24);
//}]);


//Setting HTML5 Location Mode
window.app.config(['$locationProvider', function ($locationProvider) {

    // $locationProvider.html5Mode(true);
    //
    // $locationProvider.hashPrefix("!");

    $locationProvider.html5Mode({
        enabled: true,
        hashPrefix: "!",
        requireBase: true,
        rewriteLinks: true
    });


}]);
