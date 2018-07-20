

window.angular.module('bp4.services.global', [])

    .factory('Global', ['$http', '$resource', function ($http, $resource) {




        var currentUser = window.user;

        var currentModule = 'TC';
        var appData = {
            title: "Portal de Procesos",
            module: []
        };

        if (!isSignedIn()) {

            if (window.location.pathname != "/signin") {
                goToSignIn();
            }

        }

        var menu = [];


        var global = {
            currentUser: currentUser,
            currentModule: currentModule,
            appData: appData,
            isSignedIn: isSignedIn,
            setModule: setModule,
            goToSignIn: goToSignIn,
            logout: logout,
            marcarDatos: "Altas Masivas - Marcar Datos",
            regenArchivos: 'Altas Masivas - Regen Archivos'
        };


        return global;


        function goToSignIn() {
            window.location.href = "signin"
        }

        function logout() {
            window.location.href = "/signout";
        }

        function isSignedIn() {
            return !!currentUser;
        }

        function setModule(mod) {

            switch (mod) {
                case 'TC':
                    appData.module = menu[0];
                    break;

                case 'PP':
                    appData.module = menu[1];
                    break;

                default:
                    appData.module = [];
            }

        }

    }])

    .factory('menu', ['$location', '$rootScope', '$http', '$resource', '$window', 'Global',
        function ($location, $rootScope, $http, $resource, $window, Global) {

            var self;
            var version = {};

            var sections = [];

            var signIn = Global.isSignedIn();
            if (signIn) {
                var enabledMenu = loadEnabledMenuOptions(Global.currentUser.permisos);

                sections.push({
                    name: 'Portal de Procesos',
                    enabled: enabledMenu.portal,
                    type: 'heading',
                    children: [
                        {
                            name: 'Agenda',
                            enabled: enabledMenu.agenda,
                            type: 'toggle',
                            pages: [
                                {
                                    name: 'Programación',
                                    enabled: enabledMenu.programacion,
                                    url: 'agenda',
                                    type: 'link'
                                },
                                {
                                    name: 'Consulta',
                                    enabled: enabledMenu.consulta,
                                    url: 'consulta.agenda',
                                    type: 'link'
                                },
                                ,
                                {
                                    name: 'Fallecidos',
                                    enabled: enabledMenu.fallecidos,
                                    url: 'fallecidos',
                                    type: 'link'
                                }]
                        }
                    ]
                });

                // ---------------------------------------

                sections.push({
                    name: 'Reportes',
                    enabled: enabledMenu.reportes,
                    type: 'heading',
                    children: [
                        {
                            name: 'Reportes',
                            enabled: enabledMenu.reportes,
                            type: 'toggle',
                            pages: [
                                {
                                    name: 'Padrón Unificado',
                                    enabled: enabledMenu.reporteTC,
                                    url: 'reporteTC',
                                    type: 'link'
                                },
                                {
                                    name: 'Control de Sucursales',
                                    enabled: enabledMenu.controlSucursales,
                                    url: 'controlSucursales',
                                    type: 'link'
                                },
                           
                                {
                                    name: 'Beneficiarios Sin Relación Con Cuenta',
                                    enabled: enabledMenu.sinRelacion,
                                    url: 'sinRelacion',
                                    type: 'link'
                                },
                                
                                {
                                    name: 'Clientes Rechazados',
                                    enabled: enabledMenu.reportesClientesRechazados,
                                    url: 'reportesClientesRechazados',
                                    type: 'link'
                                },
                                {
                                    name: 'Seguros de Vida',
                                    enabled: enabledMenu.masterSeguros,
                                    url: 'masterSeguros',
                                    type: 'link'
                                },
                                {
                                    name: 'Tarjetas En Boletin',
                                    enabled: enabledMenu.reporteTarjetasEnBoletin,
                                    url: 'reporteTarjetasEnBoletin',
                                    type: 'link'
                                },
                                {
                                    name: 'Baja de apoderados',
                                    enabled: enabledMenu.reporteBajaApoderados,
                                    url: 'reportesBajaApoderados',
                                    type: 'link'
                                },
                                {
                                    name: 'Recargables',
                                    enabled: enabledMenu.recargables,
                                    url: 'reporteRecargables',
                                    type: 'link'
                                },
                                {
                                    name: 'Campañas Por Cierre',
                                    enabled: enabledMenu.campaniasPorCierre,
                                    url: 'campaniasPorCierre',
                                    type: 'link'
                                },
                                {
                                    name: 'DGI SICORE',
                                    enabled: enabledMenu.dgiDiferencias,
                                    url: 'dgiDiferencias',
                                    type: 'link'
                                },
                                {
                                    name: 'Comercio',
                                    enabled: enabledMenu.procesoConvenio,
                                    url: 'reportesComercio',
                                    type: 'link'
                                },
                                {
                                    name: 'Movimientos Liquidados',
                                    enabled: enabledMenu.movimientosLiquidados,
                                    url: 'movimientosLiquidados',
                                    type: 'link'
                                },
                                {
                                    name: 'Cuotas Pendientes',
                                    enabled: enabledMenu.cuotasPendientes,
                                    url: 'cuotasPendientes',
                                    type: 'link'
                                }

                            ]
                        }

                    ]
                });
                // ----------------------------------------
                sections.push();
                sections.push({
                    name: 'Administración',
                    enabled: enabledMenu.administracion,
                    type: 'heading',
                    children: [
                        {
                            name: 'Procesos',
                            enabled: enabledMenu.procesos,
                            type: 'toggle',
                            pages: [
                                {
                                    name: 'Configuración',
                                    enabled: enabledMenu.configuracion,
                                    url: 'procesos',
                                    type: 'link'
                                },
                                {
                                    name: 'Cronograma de Cierre',
                                    enabled: enabledMenu.calendario,
                                    url: 'calendario',
                                    type: 'link'
                                },
                                {
                                    name: 'Archivos por Marca',
                                    enabled: enabledMenu.archivosMarca,
                                    url: 'archivosMarca',
                                    type: 'link'
                                },
                                {
                                    name: 'Control de Archivos',
                                    enabled: enabledMenu.controlArchivos,
                                    url: 'controlArchivos',
                                    type: 'link'
                                }
                            ]
                        },
                        {
                            name: 'Tablas Paramétricas',
                            enabled: enabledMenu.tablasParametricas,
                            type: 'toggle',
                            pages: [
                                {
                                    name: 'Caracteres Especiales',
                                    enabled: enabledMenu.caracteres,
                                    url: 'caracteresEspeciales',
                                    type: 'link'
                                },
                                {
                                    name: 'Divisiones',
                                    enabled: enabledMenu.divisiones,
                                    url: 'divisiones',
                                    type: 'link'
                                },
                                {
                                    name: 'Regiones',
                                    enabled: enabledMenu.regiones,
                                    url: 'regiones',
                                    type: 'link'
                                },
                                {
                                    name: 'Mails Configurables',
                                    enabled: enabledMenu.mailsConfigurables,
                                    url: 'mailsConfigurables',
                                    type: 'link'
                                },
                                {
                                    name: 'Retenciones',
                                    enabled: enabledMenu.retenciones,
                                    url: 'retenciones',
                                    type: 'link'
                                },
                                {
                                    name: 'Fallecidos Periodos',
                                    enabled: enabledMenu.fallecidosPeriodo,
                                    url: 'fallecidosPeriodo',
                                    type: 'link'
                                },
                                {
                                    name: 'Contabilidad',
                                    enabled: enabledMenu.contabilidad,
                                    url: 'configuracionContable',
                                    type: 'link'
                                },
                                {
                                    name: 'Digitadores',
                                    enabled: enabledMenu.digitadores,
                                    url: 'digitadores',
                                    type: 'link'
                                },
                                {
                                    name: 'Cotización',
                                    enabled: enabledMenu.cotizacion,
                                    url: 'cotizacion',
                                    type: 'link'
                                }
                            ]
                        },
                        {
                            name: 'Campañas',
                            enabled: enabledMenu.campañas, // siempre es falso
                            type: 'toggle',
                            pages: [
                                {
                                    name: 'Campañas',
                                    enabled: enabledMenu.campañasCampañas, // siempre es falso
                                    url: 'campañas',
                                    type: 'link'
                                },
                                {
                                    name: 'Distribuciones',
                                    enabled: enabledMenu.campañasDistribuciones,
                                    url: 'distribuciones',
                                    type: 'link'
                                },
                                {
                                    name: 'Procesos',
                                    enabled: enabledMenu.campañasProcesos,
                                    url: 'procesosCampañas',
                                    type: 'link'
                                }
                            ]
                        },
                        {
                            name: 'Promociones',
                            enabled: enabledMenu.promociones,
                            type: 'toggle',
                            pages: [
                                {
                                    name: 'Promociones',
                                    enabled: enabledMenu.promocionesABM,
                                    url: 'promociones',
                                    type: 'link'
                                },
                                {
                                    name: 'Motivos De Rechazo',
                                    enabled: enabledMenu.motivosDeRechazo,
                                    url: 'motivosDeRechazo',
                                    type: 'link'
                                },
                                {
                                    name: 'Consultas Promo TC',
                                    enabled: enabledMenu.consultasPromoTC,
                                    url: 'promoTC',
                                    type: 'link'
                                },
                                {
                                    name: 'Consultas Promo TD',
                                    enabled: enabledMenu.consultasPromoTD,
                                    url: 'promoTDConsulta',
                                    type: 'link'
                                },
                                {
                                    name: 'Asociación Promo TD',
                                    enabled: enabledMenu.promoTDAsoc,
                                    url: 'promoTDAsoc',
                                    type: 'link'
                                }
                            ]
                        },
                        {
                            name: 'Conciliaciones',
                            enabled: enabledMenu.conciliaciones,
                            type: 'toggle',
                            pages: [
                                {
                                    name: 'Agrupamientos',
                                    enabled: enabledMenu.agrupamientos,
                                    url: 'agrupamientos',
                                    type: 'link'
                                },
                                {
                                    name: 'Códigos De Ajustes',
                                    enabled: enabledMenu.codigoDeAjustes,
                                    url: 'codigoDeAjustes',
                                    type: 'link'
                                },
                                {
                                    name: 'Porcentaje Comisión',
                                    enabled: enabledMenu.ABMporcentajeComision,
                                    url: 'ABMporcentajeComision',
                                    type: 'link'
                                },
                                {
                                    name: 'Eventos',
                                    enabled: enabledMenu.ABMeventos,
                                    url: 'ABMeventos',
                                    type: 'link'
                                },
                                {
                                    name: 'Asignar Agrupador',
                                    enabled: enabledMenu.asignarAgrupador,
                                    url: 'asignarAgrupador',
                                    type: 'link'
                                },
                                {
                                    name: 'Movimientos Presentados',
                                    enabled: enabledMenu.movimientosPresentados,
                                    url: 'movimientosPresentados',
                                    type: 'link'
                                },
                                {
                                    name: 'Entes Externos',
                                    enabled: enabledMenu.entesExternos,
                                    url: 'entesExternos',
                                    type: 'link'
                                },
                                {
                                    name: 'Conciliación Cobranzas',
                                    enabled: enabledMenu.conciliacionCobranzas,
                                    url: 'conciliacionCobranzas',
                                    type: 'link'
                                }
                            ]
                        }, {
                            name: 'Reclamos',
                            enabled: enabledMenu.reclamos,
                            type: 'toggle',
                            pages: [
                                {
                                    name: 'Visa Electrón',
                                    enabled: enabledMenu.electron,
                                    url: 'visaElectron',
                                    type: 'link'
                                },
                                {
                                    name: 'Cancelaciones',
                                    enabled: enabledMenu.cancelaciones,
                                    url: 'cancelaciones',
                                    type: 'link'
                                },
                                {
                                    name: 'Cruce VISACO',
                                    enabled: enabledMenu.cruceVISACO,
                                    url: 'cruceVISACO',
                                    type: 'link'
                                },
                                {
                                    name: 'Part. Pendientes VI',
                                    enabled: enabledMenu.partPendientesVi,
                                    url: 'partPendientesVi',
                                    type: 'link'
                                }
                            ]
                        },
                        {
                            name: 'Novedades masivas',
                            enabled: enabledMenu.novedadesMasivas,
                            type: 'toggle',
                            pages: [
                                {
                                    name: 'Cantidad Cuentas / Tarjetas',
                                    enabled: enabledMenu.cantidadCuentasTarjetas,
                                    url: 'cantidadCuentasTarjetas',
                                    type: 'link'
                                },
                                {
                                    name: 'Límites de Compras',
                                    enabled: enabledMenu.limitesDeCompras,
                                    url: 'limitesDeCompras'
                                },
                                {
                                    name: 'Datos Fijos VS',
                                    enabled: enabledMenu.datosFijosVS,
                                    url: 'datosFijosVS',
                                    type: 'link'
                                }
                                ,
                                {
                                    name: 'Datos Fijos EDP',
                                    enabled: enabledMenu.datosFijosEDP,
                                    url: 'datosFijosEDP',
                                    type: 'link'
                                },
                                {
                                    name: 'Rechazos Unificado',
                                    enabled: enabledMenu.rechazosUnificado,
                                    url: 'rechazosUnificado',
                                    type: 'link'
                                },
                                {
                                    name: 'Rechazos VS',
                                    enabled: enabledMenu.rechazosVS,
                                    url: 'rechazosVS',
                                    type: 'link'
                                },
                                {
                                    name: 'Unificado',
                                    enabled: enabledMenu.unificado,
                                    url: 'unificado',
                                    type: 'link'
                                }
                            ]
                        }



                    ]
                });

                // -------------------------------------------


                sections.push({
                    name: 'Fallecidos',
                    enabled: enabledMenu.menufallecidos, // Si exite algun item en el menu se muestra visible
                    type: 'heading',
                    children: [

                        {
                            name: 'Fallecidos',
                            enabled: enabledMenu.fallecidos,
                            type: 'toggle',
                            pages: [
                                {
                                    name: 'Riesgo Contingente',
                                    enabled: enabledMenu.itemRiesgoContingente,
                                    url: 'riesgoContingente',
                                    type: 'link'
                                }
                            ]
                        }
                    ]
                });
                // FIN FALLECIDOS ------------------------------------------------------------
                sections.push({
                    name: 'Seguridad',
                    // enabled:  enabledMenu.seguridad,
                    enabled:  false,
                    type: 'heading',
                    children: [

                        {
                            name: 'Usuarios y Permisos',
                            enabled: enabledMenu.usuarios,
                            type: 'toggle',
                            pages: [
                                {
                                    name: 'Usuarios',
                                    enabled: enabledMenu.usuariosList,
                                    url: 'usuariosList',
                                    type: 'link'
                                },
                                {
                                    name: 'Perfiles',
                                    enabled: enabledMenu.perfiles,
                                    url: 'perfiles',
                                    type: 'link'
                                }
                            ]
                        }
                    ]
                });
                // FIN SEGURIDAD --------------------------------------------
                sections.push({
                    name: 'License',
                    url: 'license',
                    type: 'link',

                    // Add a hidden section so that the title in the toolbar is properly set
                    hidden: true
                });

            }
            $rootScope.$on('$locationChangeSuccess', onLocationChange);

            return self = {
                version: version,
                sections: sections,

                selectSection: function (section) {
                    self.openedSection = section;
                },
                toggleSelectSection: function (section) {
                    self.openedSection = (self.openedSection === section ? null : section);
                },
                isSectionSelected: function (section) {
                    return self.openedSection === section;
                },

                selectPage: function (section, page) {
                    self.currentSection = section;
                    self.currentPage = page;
                },
                isPageSelected: function (page) {
                    return self.currentPage === page;
                }
            };

            function loadEnabledMenuOptions(permisos) {
                function tienePermiso(permiso) {
                    function filtrarPorCodigo(permiso) {
                        return permiso.codigo === this.valueOf();
                    }
                    return permisos.filter(filtrarPorCodigo, permiso).length > 0;

                }

                var allCampañas = tienePermiso('campañas');
                var campañasCampañas = allCampañas || tienePermiso('campañas.campañas');
                var campañasDistribuciones = allCampañas || tienePermiso('campañas.distribuciones');
                var campañasProcesos = allCampañas || tienePermiso('campañas.procesos');
                var campañas = campañasCampañas || campañasDistribuciones || campañasProcesos;


                var allAgenda = tienePermiso('agenda');
                var programacion = allAgenda || tienePermiso('agenda.programacion');
                var consulta = allAgenda || tienePermiso('agenda.consulta');
                var fallecidos = allAgenda || tienePermiso('agenda.fallecidos');

                var agenda = programacion || consulta || fallecidos || campañasProcesos;

                var portal = agenda;

                var allProcesos = tienePermiso("procesos");
                var configuracion = allProcesos || tienePermiso('procesos.configuración');
                var calendario = allProcesos || tienePermiso('procesos.calendario');
                var archivosMarca = allProcesos || tienePermiso('procesos.archivosMarca');
                var controlArchivos = allProcesos || tienePermiso('procesos.controlArchivos');

                var allPromociones = tienePermiso("promociones");
                var consultasPromoTC = allPromociones || tienePermiso('promociones.consultasPromoTC');
                var motivosDeRechazo = allPromociones || tienePermiso('promociones.motivosDeRechazo');
                var promoTDAsoc = allPromociones || tienePermiso('promociones.promoTDAsoc');
                var promocionesABM = allPromociones || tienePermiso('promociones.promocionesABM');
                var consultasPromoTD = allPromociones || tienePermiso('promociones.consultasPromoTD');

                var promociones = consultasPromoTC || motivosDeRechazo || promoTDAsoc || promocionesABM || consultasPromoTD;

                var allConciliaciones = tienePermiso("conciliaciones");
                var agrupamientos = allConciliaciones || tienePermiso('conciliaciones.agrupamientos');
                var asignarAgrupador = allConciliaciones || tienePermiso('conciliaciones.asignarAgrupador');
                var movimientosPresentados = allConciliaciones || tienePermiso('conciliaciones.movimientosPresentados');
                var codigoDeAjustes = allConciliaciones || tienePermiso('conciliaciones.codigoDeAjustes');
                var ABMporcentajeComision = allConciliaciones || tienePermiso('conciliaciones.ABMporcentajeComision');
                var entesExternos = allConciliaciones || tienePermiso('conciliaciones.entesExternos');
                var ABMeventos = allConciliaciones || tienePermiso('conciliaciones.ABMeventos');
                var conciliacionCobranzas = allConciliaciones || tienePermiso('conciliaciones.conciliacionCobranzas');
                var conciliaciones = agrupamientos || asignarAgrupador || movimientosPresentados || codigoDeAjustes || ABMporcentajeComision || entesExternos || ABMeventos || conciliacionCobranzas;

                var procesos = configuracion || calendario || archivosMarca || controlArchivos;

                var allTablasParametricas = tienePermiso('tablasParametricas');
                var apoderados = allTablasParametricas || tienePermiso('tablasParametricas.apoderados');
                var categorias = allTablasParametricas || tienePermiso('tablasParametricas.categorias');
                var sucursales = allTablasParametricas || tienePermiso('tablasParametricas.sucursales');
                var sucursal2 = allTablasParametricas || tienePermiso('tablasParametricas.sucursal2');
                
                var caracteres = allTablasParametricas || tienePermiso('tablasParametricas.caracteresEspeciales');
                var divisiones = allTablasParametricas || tienePermiso('tablasParametricas.divisiones');
                var regiones = allTablasParametricas || tienePermiso('tablasParametricas.regiones');
                var ejemplo = allTablasParametricas || tienePermiso('tablasParametricas.ejemplo');
                var mailsConfigurables = allTablasParametricas || tienePermiso('tablasParametricas.mailsConfigurables');
                var retenciones = allTablasParametricas || tienePermiso('tablasParametricas.retenciones');
                var fallecidosPeriodo = allTablasParametricas || tienePermiso('tablasParametricas.fallecidosPeriodo');
                var contabilidad = allTablasParametricas || tienePermiso('tablasParametricas.contabilidad');
                var digitadores = allTablasParametricas || tienePermiso('tablasParametricas.digitadores');
                const cotizacion = allTablasParametricas || tienePermiso('tablasParametricas.cotizacion');

                var tablasParametricas = apoderados || categorias || sucursales || sucursal2 ||  ejemplo || mailsConfigurables || retenciones || fallecidosPeriodo || contabilidad || digitadores || cotizacion;

                var allUsuarios = tienePermiso('usuarios');
                var usuariosList = allUsuarios || tienePermiso('usuarios.usuariosList');
                var perfiles = allUsuarios || tienePermiso('usuarios.perfiles');
                var usuarios = usuariosList || perfiles;




                var administracion = procesos || tablasParametricas;
                var seguridad = usuarios;  


                var allReportes = tienePermiso('reportes');
                var reporteTC = allReportes || tienePermiso('reportes.reportesTC');
                
                
                var masterSeguros = allReportes || tienePermiso('reportes.masterSeguros');
                var controlSucursales = allReportes || tienePermiso('reportes.controlSucursales');
                
                var sinRelacion = allReportes || tienePermiso('reportes.sinRelacion');
                var reporteTarjetasEnBoletin = allReportes || tienePermiso('reportes.reporteTarjetasEnBoletin');
                var reporteBajaApoderados = allReportes || tienePermiso('reportes.bajaApoderados');
                var recargables = allReportes || tienePermiso('reportes.reporteRecargable');
                var campaniasPorCierre = allReportes || tienePermiso('reportes.campaniasPorCierre');
                var dgiDiferencias = allReportes || tienePermiso('reportes.dgiDiferencias');
                var procesoConvenio = allReportes || tienePermiso('reportes.procesoConvenio');
                var movimientosLiquidados = allReportes || tienePermiso('reportes.movimientosLiquidados');
                var cuotasPendientes = allReportes || tienePermiso('reportes.cuotasPendientes');

                var reportes = reporteTC || procesoConvenio || dgiDiferencias || controlSucursales ||   masterSeguros || sinRelacion || reporteBajaApoderados || reporteTarjetasEnBoletin || recargables || campaniasPorCierre || movimientosLiquidados || cuotasPendientes;

                var allReclamos = tienePermiso('reclamos');
                var cruceVISACO = allReclamos || tienePermiso('reclamos.cruceVISACO');
                var cancelaciones = allReclamos || tienePermiso('reclamos.cancelaciones');
                var partPendientesVi = allReclamos || tienePermiso('reclamos.partPendientesVi');
                var electron = allReclamos || tienePermiso('reclamos.electron');

                var reclamos = allReclamos || cruceVISACO || cancelaciones || partPendientesVi || electron;

                var allNovedadesMasivas= tienePermiso('novedadesMasivas');
                var allNovedadesMasivas = tienePermiso('novedadesMasivas');
                var cantidadCuentasTarjetas = allNovedadesMasivas || tienePermiso('novedadesMasivas.cantidadCuentasTarjetas');
                var rechazosUnificado = allNovedadesMasivas || tienePermiso('novedadesMasivas.rechazosUnificado');
                var limitesDeCompras = allNovedadesMasivas || tienePermiso('novedadesMasivas.limitesDeCompras');
                var datosFijosEDP = allNovedadesMasivas || tienePermiso('novedadesMasivas.datosFijosEDP');
                var datosFijosVS = allNovedadesMasivas || tienePermiso('novedadesMasivas.datosFijosVS');
                var rechazosVS = allNovedadesMasivas || tienePermiso('novedadesMasivas.rechazosVS');
                var unificado = allNovedadesMasivas || tienePermiso('novedadesMasivas.unificado');

                var novedadesMasivas = allNovedadesMasivas || cantidadCuentasTarjetas || datosFijosVS || datosFijosEDP || limitesDeCompras || rechazosUnificado || rechazosVS || unificado;

                var menufallecidos = allPermisosFallecidos || itemRiesgoContingente;

                var allPermisosFallecidos = tienePermiso('fallecidos');
                var itemRiesgoContingente = allPermisosFallecidos || tienePermiso('fallecidos.riesgoContingente');
                var menufallecidos = allPermisosFallecidos || itemRiesgoContingente;



                return {
                    portal: portal,
                    agenda: agenda,
                    programacion: programacion,
                    consulta: consulta,
                    controlArchivos: controlArchivos,
                    promociones: promociones,
                    consultasPromoTC: consultasPromoTC,
                    consultasPromoTD: consultasPromoTD,
                    promoTDAsoc: promoTDAsoc,
                    administracion: administracion,
                    seguridad: seguridad,
                    procesos: procesos,
                    configuracion: configuracion,
                    calendario: calendario,
                    archivosMarca: archivosMarca,
                    reporteTarjetasEnBoletin: reporteTarjetasEnBoletin,
                    reporteBajaApoderados: reporteBajaApoderados,
                    procesoConvenio: procesoConvenio,
                    mailsConfigurables: mailsConfigurables,
                    retenciones: retenciones,
                    tablasParametricas: tablasParametricas,
                    campaniasPorCierre: campaniasPorCierre,
                    novedadesMasivas: novedadesMasivas,
                    cantidadCuentasTarjetas: cantidadCuentasTarjetas,
                    rechazosUnificado: rechazosUnificado,
                    limitesDeCompras: limitesDeCompras,
                    datosFijosVS: datosFijosVS,
                    datosFijosEDP: datosFijosEDP,
                    rechazosVS: rechazosVS,
                    unificado: unificado,

                    menufallecidos: menufallecidos,
                    itemRiesgoContingente: itemRiesgoContingente,

                    fallecidosPeriodo: fallecidosPeriodo,
                    contabilidad: contabilidad,
                    motivosDeRechazo: motivosDeRechazo,
                    fallecidos: fallecidos,
                    apoderados: apoderados,
                    categorias: categorias,
                    sucursales: sucursales,
                    sucursal2: sucursal2,
                    
                    caracteres: caracteres,
                    divisiones: divisiones,
                    regiones: regiones,
                    ejemplo: ejemplo,
                    usuarios: usuarios,
                    usuariosList: usuariosList,
                    perfiles: perfiles,
                    reportes: reportes,
                    dgiDiferencias: dgiDiferencias,
                    controlSucursales: controlSucursales,
                    reporteTC: reporteTC,
                    
                    
                    masterSeguros: masterSeguros,
                    sinRelacion: sinRelacion,
                    recargables: recargables,
                    campañas: campañas,
                    campañasCampañas: campañasCampañas,
                    campañasDistribuciones: campañasDistribuciones,
                    campañasProcesos: campañasProcesos,
                    conciliaciones: conciliaciones,
                    agrupamientos: agrupamientos,
                    asignarAgrupador: asignarAgrupador,
                    movimientosPresentados: movimientosPresentados,
                    codigoDeAjustes: codigoDeAjustes,
                    ABMporcentajeComision: ABMporcentajeComision,
                    entesExternos: entesExternos,
                    ABMeventos: ABMeventos,
                    conciliacionCobranzas: conciliacionCobranzas,
                    digitadores: digitadores,
                    cotizacion: cotizacion,
                    promocionesABM: promocionesABM,
                    reclamos: reclamos,
                    cruceVISACO: cruceVISACO,
                    cancelaciones: cancelaciones,
                    partPendientesVi: partPendientesVi,
                    electron:electron,
		    partPendientesVi : partPendientesVi,
                    movimientosLiquidados: movimientosLiquidados,
                    cuotasPendientes: cuotasPendientes
                };
            }

            /* funcion de Debug -- completar lista*/
            function returnFullyEnabled() {
                return {
                    portal: true,
                    agenda: true,
                    programacion: true,
                    consulta: true,
                    administracion: true,
                    procesos: true,
                    configuracion: true,
                    calendario: true,
                    archivosMarca: true,
                    tablasParametricas: true,
                    campañas: true,
                    apoderados: true,
                    categorias: true,
                    sucursales: true,
                    sucursal2: true,
                    
                    ejemplo: true,
                    usuarios: true,
                    usuariosList: true,
                    perfiles: true
                };
            }



            function onLocationChange() {
                var path = $location.path();

                var introLink = {
                    name: "",
                    url: "/",
                    type: "link"
                };

                if (path == '/') {
                    // console.log("GLOBAL",Global.isSignedIn())
                    if (Global.isSignedIn()) {
                        self.selectSection(introLink);
                        self.selectPage(introLink, introLink);
                    }
                    return;
                }

                var matchPage = function (section, page) {
                    if (path.indexOf(page.url) !== -1) {
                        self.selectSection(section);
                        self.selectPage(section, page);
                    }
                };

                sections.forEach(function (section) {
                    if (section.children) {
                        // matches nested section toggles, such as API or Customization
                        section.children.forEach(function (childSection) {
                            if (childSection.pages) {
                                childSection.pages.forEach(function (page) {
                                    matchPage(childSection, page);
                                });
                            }
                        });
                    }
                    else if (section.pages) {
                        // matches top-level section toggles, such as Demos
                        section.pages.forEach(function (page) {
                            matchPage(section, page);
                        });
                    }
                    else if (section.type === 'link') {
                        // matches top-level links, such as "Getting Started"
                        matchPage(section, section);
                    }
                });
            }

        }
    ])

    .factory('datacontext', ['logger', '$timeout', '$filter',
        function (logger, $timeout, $filter) {

            var datacontext = {
                clone: clone,
                extraer: extraer,
                alertar: alertar,
                setModule: setModule,
                substr: substr
            };

            return datacontext;


            /*
             str = substr(str, start);
             str = substr(str, start, end);
             */
            function substr(miben, start, end) {
                if (length(miben) == 0) {
                    return "";
                }
                if (start < 0) {
                    start = 0;
                }
                if (end == undefined) {
                    end = length(miben) - 1;
                }
                if (start >= length(miben) || end < start) {
                    return "";
                }
                if (end > length(miben) - 1) {
                    end = length(miben) - 1;
                }
                return miben.substring(start, end + 1);
            }


            function clone(obj) {
                if (obj === null || typeof obj !== 'object') {
                    return obj;
                }

                var temp = obj.constructor();
                for (var key in obj) {
                    temp[key] = clone(obj[key]);
                }

                return temp;
            }

            function extraer(qfrom, qwhere) {
                return clone($filter('filter')(qfrom, qwhere)[0]);
            }


            function alertar(obj, mensaje, type, timoff, strong, linkText, linkFunc) {

                var len = obj.length;
                if (len > 5) {
                    obj.splice(0, 1);
                    len -= 1;
                }

                var xid = (function () {
                    if (len > 0) {
                        len -= 1;
                        return obj[len].id + 1;
                    } else {
                        return 0;
                    }
                })();

                obj.push({ type: type, msg: mensaje, id: xid, strong: strong, ltext: linkText, lfunc: linkFunc });

                //Tiempo de permanencia default si timoff es cero o undefined
                if (!timoff && type !== 'danger') {
                    switch (type) {
                        case 'default':
                        case 'success':
                            timoff = 8000;
                            break;
                        case 'info':
                            timoff = 6000;
                            break;
                        case 'warning':
                            timoff = 14000;
                            break;
                        default:
                            timoff = 18000;
                    }
                }

                if (timoff) {
                    (function (x) {
                        $timeout(function () {
                            //length esta apropósito dentro del bucle  (caob)
                            for (var i = 0, l = obj.length; i < l; i++) {
                                if (obj[i].id === x) { obj.splice(i, 1); break; };
                            }
                        }, timoff);
                    })(xid);  //funcion atrapada dentro de otra apropósito (caob)
                }
            };

            function setModule(module) {

            }

            //endregion
        }])

    .factory('logger', function () {

        var logEntries = [];
        var cachdb = [];
        var counter = 1;

        var logger = {
            log: log,
            cach: cach,
            logEntries: logEntries,
            cacher: cachdb
        };

        return logger;

        function log(message, type) {

            var logEntry = {
                id: counter++,
                message: message,
                type: type || "info"
            };
            logEntries.push(logEntry);
        }

        function cach(oper, obj, tabla) {


            switch (oper) {
                case '':
                case 'add':
                    cachdb.push(obj);
                    break;
                case 'traer':
                    var a = cachdb[tabla];
                    return a;
                    break;
                case 'buscar':
                    timoff = 8000;
                    break;
                default:
                    timoff = 18000;
            }





        }
    })

    .factory('Excel', function ($window) {
        return {
            tableToExcel: function (tables, spreadSheetName) {

                var csvString = '';
                for (var k = 0; k < tables.length; k++) {
                    var table = $(tables[k])[0];
                    var begin = k === 0 ? 0 : 1;
                    for (var i = begin; i < table.rows.length; i++) {
                        var rowData = table.rows[i].cells;
                        for (var j = 0; j < rowData.length; j++) {
                            if (rowData[j].innerHTML.indexOf('<md-progress-linear') !== -1) {
                                break;
                            }

                            if (!isNaN(parseInt(rowData[j].innerHTML))) {
                                csvString = csvString + '="' + rowData[j].innerText + '";';
                            }
                            else {
                                csvString = csvString + rowData[j].innerText + ";";
                            }
                        }
                        csvString = csvString.substring(0, csvString.length - 1);
                        csvString = csvString + "\n";
                    }
                }

                csvString = csvString.substring(0, csvString.length - 1);
                var a = $('<a/>', {
                    style: 'display:none',
                    href: 'data:application/octet-stream;base64,' + btoa(csvString),
                    download: spreadSheetName + '.csv'
                }).appendTo('body');
                a[0].click();
                a.remove();
            },

            arrayToExcel: function (array, titles, spreadSheetName, properties) {
                var csvString = '';
                for (var i = 0; i < titles.length; i++) {
                    var title = titles[i];
                    csvString = csvString + title + ";";
                }
                csvString = csvString.substring(0, csvString.length - 1);
                csvString = csvString + "\n";
                for (var i = 0; i < array.length; i++) {
                    var rowData = array[i];
                    properties.forEach(function (property) {
                        if (!isNaN(parseInt(rowData[property]))) {
                            csvString = csvString + '="' + (rowData[property] === null ? '' : rowData[property]) + '";';
                        }
                        else {
                            csvString = csvString + (rowData[property] === null ? '' : rowData[property]) + ";";
                        }
                    });
                    csvString = csvString.substring(0, csvString.length - 1);
                    csvString = csvString + "\n";
                }

                csvString = csvString.substring(0, csvString.length - 1);
                var a = $('<a/>', {
                    style: 'display:none',
                    href: 'data:application/octet-stream;base64,' + btoa(csvString),
                    download: spreadSheetName + '.csv'
                }).appendTo('body');
                a[0].click();
                a.remove();
            }
        };

    })

    .factory('redirectInterceptor', function ($q, $location, $window) {
        return {
            responseError: function (rejection) {
                if (rejection.data === "Internal Server Error. Redirecting to /signin") {
                    $window.location.href = "/signin";
                    return $q.reject(rejection);
                }
                else {
                    return $q.reject(rejection);
                }
            }
        }
    })

    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.interceptors.push('redirectInterceptor');
    }])

    .factory('Toast', ['$mdToast', function ($mdToast) {
        return {
            showError: showError,
            showSuccess: showSuccess
        };

        function showError(message, className) {
            var msg = message ? message : 'Hubo un error al realizar la operación';

            $mdToast.show({
                template: '<md-toast class="md-toast' + className + '">' + msg + '</md-toast>',
                hideDelay: 3000,
                parent: '.toastParent',
                position: 'top left'
            });
        }

        function showSuccess(message, hideDelay) {
            var msg = message ? message : 'La operación se realizó correctamente';

            $mdToast.show({
                template: '<md-toast class="md-toast toastSuccess">' + msg + '</md-toast>',
                hideDelay: hideDelay || 3000,
                parent: '#toastSelect',
                position: 'top left'
            });
        }
    }])

    .factory('Perfiles', ['$resource', function ($resource) {
        return $resource('/api/admin/Perfiles/:id', null, {
            'update': { method: 'PUT' }
        });
    }])

    .factory('PerfilesDelete', ['$resource', function ($resource) {
        return $resource('/api/admin/PerfilesDelete/:id', null, {
            'delete': { method: 'PUT' }
        });
    }])

    .factory('UserPrecarga', ['$resource', function ($resource) {
        return $resource('/admin/usuarioprecarga/:idUsuario', null, {
            'update': { method: 'PUT' }
        });
    }])




    .factory('Acciones', ['$resource', function ($resource) {
        return $resource('/admin/acciones/:id', null, {
            'update': { method: 'PUT' }
        });
    }])





    .factory('Usuarios', ['$resource', function ($resource) {
        return $resource('/usuarios/traer/:id', null, {
            'update': { method: 'PUT' }
        });
    }])

     

    .factory('Retenciones', ['$resource', function ($resource) {
        return $resource('/api/retencion/:idRegimen', null, {
            'update': { method: 'PUT' },
            'delete': { method: 'DELETE' }
        });
    }])



    .factory('Provincias', ['$resource', function ($resource) {
        return $resource('/provincia/:idProvincia', null, {
            'update': { method: 'PUT' }
        });
    }])

    .factory('Apoderados', ['$resource', function ($resource) {
        return $resource('/api/apoderado/:idApoderado', null, {
            'update': { method: 'PUT' }
        });
    }])

    .factory('ApoderadosDelete', ['$resource', function ($resource) {
        return $resource('/api/apoderadoDelete/:idApoderado', null, {
            'delete': { method: 'PUT' }
        });
    }])

    .factory('Caracteres', ['$resource', function ($resource) {
        return $resource('/api/caracteresEspeciales', null, {
            'update': { method: 'PUT' }
        });
    }])

    .factory('DivisionesParametric', ['$resource', function ($resource) {
        return $resource('/api/divisionesParametric', null, {
            'get': { method: 'GET' },
            'post': { method: 'POST' },
            'update': { method: 'PUT' }
        });
    }])

    .factory('Regiones', ['$resource', function ($resource) {
        return $resource('/api/region', null, {
            'get': { method: 'GET' },
            'post': { method: 'POST' },
            'update': { method: 'PUT' }
        });
    }])

    .factory('Categorias', ['$resource', function ($resource) {
        return $resource('/api/categoria/:idCodigo', null, {
            'update': { method: 'PUT' }
        });
    }])

    .factory('CategoriasDelete', ['$resource', function ($resource) {
        return $resource('/api/categoriaDelete/:idCodigo', null, {
            'delete': { method: 'PUT' }
        });
    }])
    .factory('CategoriasConvenio', ['$resource', function ($resource) {
        return $resource('/api/CategoriasConvenio/:idCategoriaConvenio', null, {
            'update': { method: 'PUT' }
        });
    }])


    .factory('Sucursales', ['$resource', function ($resource) {
        return $resource('/api/sucursal/:idSucAgen', null, {
            'update': { method: 'PUT' }
        });
    }])

    .factory('SucursalesDelete', ['$resource', function ($resource) {
        return $resource('/api/sucursalDelete/:idSucAgen', null, {
            'delete': { method: 'PUT' }
        });
    }])


    .factory('Procesos', ['$resource', function ($resource) {
        return $resource('/api/procesos/:idProceso', null, {
            'update': { method: 'PUT' },
            'delete': { method: 'DELETE', isArray: false }
        });
    }])

    .factory('ProcesosRun', ['$resource', function ($resource) {
        return $resource('/api/procesos/run', null, {
            'update': { method: 'PUT' }
        });
    }])

    .factory('AgendaProceso', ['$resource', function ($resource) {
        return $resource('/api/procesos/agenda/:idProceso', null, {
            'update': { method: 'PUT' }
        });
    }])

    .factory('Agenda', ['$resource', function ($resource) {
        return $resource('/api/agenda/:idAgenda', null, {
            'update': { method: 'PUT' }
        });
    }])

    .factory('ProcesosPaso', ['$resource', function ($resource) {
        return $resource('/api/procesosPaso/:idProcesoPaso', null, {
            'update': { method: 'PUT' }
        });
    }])


    .factory('Calendarios', ['$resource', function ($resource) {
        return $resource('/api/calendario/:idPeriodo', null, {
            'update': { method: 'PUT' }
        });
    }])

    .factory('ControlArchivos', ['$resource', function ($resource) {
        return $resource('/api/controlArchivos', null, {
            'update': { method: 'PUT' }
        });
    }])

    .factory('Marcas', ['$resource', function ($resource) {
        return $resource('/api/archivosMarca/:idMarca', null, {
            'update': { method: 'PUT' }
        });
    }])

    .factory('MarcasDelete', ['$resource', function ($resource) {
        return $resource('/api/archivosMarca/:idMarca', null, {
            'delete': { method: 'DELETE' }
        });
    }])

    .factory('ReporteRecargables', ['$resource', function ($resource) {
        return $resource('/api/reportes/recargables', {}, {
            query: {
                method: 'GET',
                transformResponse: function (data) {
                    var jsonData = JSON.parse(data);
                    return {
                        header: jsonData[0],
                        details: jsonData[1],
                        detailsRows: jsonData[2][0].rows
                    };
                }
            }
        });
    }])

    .factory('CuentasNoActivas', ['$resource', function ($resource) {
        return $resource('/api/cuentasNoActivas/', {}, {
            query: {
                method: 'GET',
                isArray: true
            }
        });
    }])

    .factory('Campanias', ['$resource', function ($resource) {
        return $resource('/api/campanias/:codigo', {}, {
            save: { method: 'POST' },
            update: { method: 'PUT' }
        })
    }])

    .factory('Distribuciones', ['$resource', function ($resource) {
        return $resource('/api/distribuciones/:codigo', {}, {
            save: { method: 'POST' },
            update: { method: 'PUT' }
        })
    }])

    .factory('SinBeneficiarios', ['$resource', function ($resource) {
        return $resource('/api/reportes/sinRelacionConCuenta', {}, {
            query: {
                method: 'GET'
            }
        });
    }])

    .factory('SinBeneficiariosArchivo', ['$resource', function ($resource) {
        return $resource('/api/reportes/archivoSinRelacion/', {}, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }])

    .factory('BajaApoderadosArchivo', ['$resource', function ($resource) {
        return $resource('/api/reportes/bajaApoderados/', {}, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }])

    .factory('ClientesRechazados', ['$resource', function ($resource) {
        return $resource('/api/reportes/reporteClientesRechazadosDetalle', {}, {
            query: {
                method: 'GET',
                isArray: true
            }
        });
    }])

    /*
    .factory('ClientesRechazadosArchivo', ['$resource', function ($resource) {
        return $resource('/api/reportes/reporteClientesRechazadosDetalleExport', {}, {
            query: {
                method: 'GET',
                isArray: false
            }
        });
    }])
    */


    .factory('ProcesosCampanias', ['$resource', function ($resource) {
        return $resource('/api/procesosCampanias/:codigo', {}, {
            save: { method: 'POST' },
            update: { method: 'PUT' }
        });
    }])

    .factory('MailsConfigurables', ['$resource', function ($resource) {
        return $resource('/api/mailsConfigurables/:idMails', {}, {
            save: { method: 'POST' },
            update: { method: 'PUT' }
        });
    }]);

app.factory('FaPeriodo', ['$resource', function ($resource) {
    return $resource('/api/fallecidos/Periodo/:idPeriodo', null,
        {
            'update': { method: 'PUT' }
        });
}]);
app.factory('Fallecidos', ['$resource', function ($resource) {
    return $resource('/api/fallecidos/:idFallecidos', null,
        {
            'update': { method: 'PUT' }
        });
}]);

app.factory('ConfiguracionContable', ['$resource', function ($resource) {
    return $resource('/api/configuracionContable/:idConfiguracionContable', null,
        {
            'update': { method: 'PUT' }
        });
}]);

app.factory('MotivosDeRechazo', ['$resource', function ($resource) {
    return $resource('/api/MotivosDeRechazo/:idMotivoRechazos', null,
        {
            'update': { method: 'PUT' }
        });
}]);

app.factory('Agrupamientos', ['$resource', function ($resource) {
    return $resource('/api/Agrupamientos/:idcmpAgrupamiento', null,
        {
            'update': { method: 'PUT' }
        });
}]);

app.factory('Digitadores', ['$resource', function ($resource) {
    return $resource('/api/digitadores/:idDigitador', null,
        {
            'update': { method: 'PUT' }
            /*,'delete': { method:'DELETE' }*/
        });
}]);

app.factory('Promociones', ['$resource', function ($resource) {
    return $resource('/api/Promociones/:idPromociones', null,
        {
            'update': { method: 'PUT' }
        });
}]);

app.factory('Cancelaciones', ['$resource', function ($resource) {
    return $resource('/api/cancelaciones/:idPpVisaCis', null,
        {
            /*
                'update': { method:'PUT' },
                'delete': { method:'DELETE' }
            */
        });
}]);


app.factory('DatosFijosEDPCuentas', ['$resource', function ($resource) {
    return $resource('/api/datosFijosEDPCuentas/:idEDPDatosFijosCuentas', null,
        {
            'update': { method: 'PUT' },
            'delete': { method: 'DELETE' }
        });
}]);



app.factory('DatosFijosEDPTarjetas', ['$resource', function ($resource) {
    return $resource('/api/datosFijosEDPTarjetas/:idEDPDatosFijosTarjetas', null,
        {
            'update': { method: 'PUT' },
            'delete': { method: 'DELETE' }
        });
}]);
