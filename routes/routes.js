var async = require('async')
    , http = require('http')
    , fs = require('fs');

module.exports = function (app, passport, auth) {

  /*
   ---------------------
   Routes
   ---------------------
   .get    -> .all
   .get    -> .show
   .param  -> .itemName
   .post   -> .create
   .put    -> .update
   .delete -> .destroy
   ---------------------
   */

 
  var index = require('../app/controllers/index');
  app.get('/', index.render);
 
  /**
   * top constrain: 
   * Esta linea permite pedir autenticación a lo que tenga "api" en la dirección.
   * Cosas como paginas de errores o el de login, obviamente no tienen "api" en la dirección.
   */
  //app.all('/api/*', auth.requiresLogin)
  //todo caob falta el next()

  /**
   * middleware
   * este es un test para rutas especificas com opor ejemplo "pepe"
   * es para usar una funcion hasRightTo y aplicar seguridad específica y ver si dejar seguir o no
   */
  app.use('/pepe', function(req, res, next) {
    // GET 'http://www.example.com/admin/new'
    console.log(req.originalUrl); // '/admin/new'
    console.log(req.baseUrl); // '/admin'
    console.log(req.path); // '/new'
    console.log('Time: %d', Date.now());
    next();
  });


  
  
  /** <editor-fold desc="USERS & LOGIN"> */
  var users = require('../app/controllers/users')
  app.get('/signin', users.signin)
  app.get('/signup', users.signup)
  app.get('/signout', users.signout)

  app.get('/usuarios/traer', users.getUser)
  app.get('/usuarios/traerResponsables',auth.requiresLogin, users.usuariosTraerResponsables)

  app.get('/usuarios/eliminar/:usersIds', users.deleteUsers)
  app.post('/saveuser', auth.requiresLogin, users.createABM)

  // app.post('/users', users.create)
  
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/signin', failureFlash: 'Invalid email or password.'}), users.session)
  app.get('/users/me', users.me)
  app.get('/api/users/:userId', auth.requiresLogin, users.getById)
  app.get('/api/usuarios', auth.requiresLogin, users.getAll)
  app.get('/api/usuarios/nivel', auth.requiresLogin, users.getAllByLevel)
  app.get('/usuarios/:userId', auth.requiresLogin, users.abm)

  app.param('userId', function (req, res, next, id) {
    req.id = id;
    next();
  });
  app.param('usersIds', function (req, res, next, id) {
    req.ids = id.split(",");
    next();
  });
  /**</editor-fold>*/




  /** <editor-fold desc="SEGURIDAD - ACCIONES PERFILES"> */

  // Perfiles
  var vPerfiles= require('../app/controllers/admin/perfiles')
  app.get('/api/admin/perfiles',  auth.requiresLogin,vPerfiles.all)
  app.get('/api/admin/perfiles/acciones',  auth.requiresLogin,vPerfiles.acciones)
  app.get('/api/admin/perfiles/:perfilId',  auth.requiresLogin,vPerfiles.perfil)
  app.get('/api/admin/perfilesAcciones/:perfilId',  auth.requiresLogin,vPerfiles.perfilesAcciones)
  app.get('/api/admin/perfilesProcesos/:perfilId',  auth.requiresLogin,vPerfiles.perfilesProcesos)
  app.get('/api/admin/perfilesfuncionalidades/:perfilId',  auth.requiresLogin,vPerfiles.perfilesFuncionalidades)

  app.get('/api/admin/perfilesPorNivel',  auth.requiresLogin,vPerfiles.porNivel)

  //app.param('perfilId', vPerfiles.none)
  app.post('/api/admin/perfiles', auth.requiresLogin,vPerfiles.create)
  app.put('/api/admin/perfiles/:perfilId', auth.requiresLogin,  vPerfiles.update)
  app.delete('/api/admin/perfiles/:perfilId', auth.requiresLogin, vPerfiles.destroy)
  app.put('/api/admin/PerfilesDelete/:perfilId', auth.requiresLogin, vPerfiles.destroy);
  // Usuario Precarga

  var vUsuarioPrecarga= require('../app/controllers/userPrecarga')
  app.get('/admin/usuarioprecarga', auth.requiresLogin, vUsuarioPrecarga.all)
  //app.get('/admin/usuarioprecarga/:usuarioprecargaId', vUsuarioPrecarga.show)
  // app.param('usuarioprecargaId', vUsuarioPrecarga.usuarioprecarga)
  app.post('/admin/usuarioprecarga', auth.requiresLogin,vUsuarioPrecarga.create)
  app.put('/admin/usuarioprecarga/:idUsuario', auth.requiresLogin,  vUsuarioPrecarga.update)
  //app.delete('/admin/usuarioprecarga/:usuarioprecargaId', auth.requiresLogin, vUsuarioPrecarga.destroy)
  // deprecated app.get('/precargausuario', auth.requiresLogin, vUsuarioPrecarga.initFormPrecarga)

  /**</editor-fold>*/

  /** <editor-fold desc="TABLAS PARAMETRICAS"> */
  //Canales
  var vCanales= require('../app/controllers/canales/canales');
  app.get('/api/canales', auth.requiresLogin, vCanales.canalesGetAll);
  app.get('/api/canales/:idCanal', auth.requiresLogin, vCanales.GetById);
  app.post('/api/canales', auth.requiresLogin, vCanales.insert);
  app.put('/api/canales/:idCanal', auth.requiresLogin, vCanales.update);
  app.delete('/api/canales/:idCanal', auth.requiresLogin, vCanales.delete);

  //Tipo de Documentos
  var vTipoDocumentos= require('../app/controllers/documento/tipoDocumento');
  app.get('/api/tipoDocumento', auth.requiresLogin, vTipoDocumentos.tipoDocumentoGetAll);
  app.get('/api/tipoDocumento/:idTipoDocumento', auth.requiresLogin, vTipoDocumentos.GetById);
  app.post('/api/tipoDocumento', auth.requiresLogin, vTipoDocumentos.insert);
  app.put('/api/tipoDocumento/:idTipoDocumento', auth.requiresLogin, vTipoDocumentos.update);
  app.put('/api/tipoDocumentoDelete/:idTipoDocumento', auth.requiresLogin, vTipoDocumentos.delete);

  //Provincia
  var vProvincia= require('../app/controllers/provincia/provincia');
  app.get('/provincia', auth.requiresLogin, vProvincia.provinciaGetAll);

  //Apoderados
  var vApoderados= require('../app/controllers/apoderado/apoderado');
  app.get('/api/apoderado', auth.requiresLogin, vApoderados.apoderadoGetAll);
  app.get('/api/apoderado/:idApoderado', auth.requiresLogin, vApoderados.GetById);
  app.post('/api/apoderado', auth.requiresLogin, vApoderados.insert);
  app.put('/api/apoderado/:idApoderado', auth.requiresLogin, vApoderados.update);
  app.put('/api/apoderadoDelete/:idApoderado', auth.requiresLogin, vApoderados.delete);

  //Categorias
  var vCategoria= require('../app/controllers/categoria/categoria');
  app.get('/api/categoria', auth.requiresLogin, vCategoria.categoriasGetAll);
  app.get('/api/categoria/:idCodigo', auth.requiresLogin, vCategoria.GetById);
  app.post('/api/categoria', auth.requiresLogin, vCategoria.insert);
  app.delete('/api/categoriaConvenio/:idCategoriaConvenio', auth.requiresLogin, vCategoria.deleteConvenioCategoria);

  app.put('/api/categoria/:idCodigo', auth.requiresLogin, vCategoria.update);
  app.put('/api/categoriaDelete/:idCodigo', auth.requiresLogin, vCategoria.delete);

  app.get('/api/convenio', auth.requiresLogin, vCategoria.conveniosGetAll);
  app.get('/api/categoriaConvenio', auth.requiresLogin,vCategoria.categoriaConvenioGetAll);
  app.get('/api/categoriaConvenio/porCodigoCategoria/:idCodigo', auth.requiresLogin,vCategoria.traerPorCategoriaCod);
  app.get('/api/categoriaConvenio/porCodigoConvenio/:convenio', auth.requiresLogin,vCategoria.traerPorConvenio);




  app.put('/api/CategoriasConvenio/:idCategoriaConvenio', auth.requiresLogin,vCategoria.updateCategoriaConvenio);


  app.post('/api/CategoriasConvenio', auth.requiresLogin,vCategoria.insertCategoriaConvenio);



  //Sucursales
  var vSucursal= require('../app/controllers/sucursal/sucursal');
  app.get('/api/sucursal', auth.requiresLogin, vSucursal.sucursalGetAll);
  app.get('/api/sucursal/:idSucAgen', auth.requiresLogin, vSucursal.GetById);
  app.get('/api/sucursal/get/byCodigo', auth.requiresLogin, vSucursal.GetByCodigo);

  app.get('/api/divisiones', auth.requiresLogin, vSucursal.traerDivisiones);
  app.post('/api/sucursal', auth.requiresLogin, vSucursal.insert);
  app.put('/api/sucursal/:idSucAgen', auth.requiresLogin, vSucursal.update);
  app.put('/api/sucursalDelete/:idSucAgen', auth.requiresLogin, vSucursal.delete);
  //test todo CAOB
  app.delete('/api/sucursal/:idSucAgen', auth.requiresLogin, vSucursal.delete);
  app.get('/api/sucursalesEDP', auth.requiresLogin, vSucursal.sucursalGetEDP);

  //ABM porcentaje
  var vPorcentajeComision = require('../app/controllers/porcentajeComision/porcentajeComision');
  app.get('/api/porcentajeComision', auth.requiresLogin, vPorcentajeComision.getPorcComisiones);
  app.put('/api/porcentajeComision/', auth.requiresLogin, vPorcentajeComision.guardarComision);
  app.delete('/api/porcentajeComision/', auth.requiresLogin, vPorcentajeComision.bajaComisiones);

    //ABM codigo de ajustes
    var vCodigoDeAjustes = require('../app/controllers/codigoDeAjustes/codigoDeAjustes');
    app.get ('/api/CodigoDeAjustes',auth.requiresLogin, vCodigoDeAjustes.traer);
    app.put('/api/CodigoDeAjustes', auth.requiresLogin,vCodigoDeAjustes.insertar);
    app.delete('/api/CodigoDeAjustes', auth.requiresLogin,vCodigoDeAjustes.eliminar);

    //ABM cantidad cuentas
  var vCantidadCuentas = require('../app/controllers/cantidadCuentasTarjetas/cantidadCuentasTarjetas');
  app.get('/api/CantidadCuentasTarjetas/', auth.requiresLogin, vCantidadCuentas.obtenerTodos);
  app.get('/api/TipoCuentas', auth.requiresLogin, vCantidadCuentas.obtenerTipoCuentas);
  app.get('/api/CantidadCuentasTarjetas/controlDuplicado', auth.requiresLogin, vCantidadCuentas.controlDuplicado);
  app.post('/api/CantidadCuentasTarjetas/', auth.requiresLogin, vCantidadCuentas.guardar);
  app.put('/api/CantidadCuentasTarjetas/', auth.requiresLogin, vCantidadCuentas.modificar);
  app.delete('/api/CantidadCuentasTarjetas/', auth.requiresLogin, vCantidadCuentas.bajar);

    //Caracteres Especiales
  var vCaracteres = require('../app/controllers/caracteresEspeciales/caracteresEspeciales');
  app.get('/api/caracteresEspeciales', auth.requiresLogin, vCaracteres.getAll);
  app.post('/api/caracteresEspeciales', auth.requiresLogin, vCaracteres.insert);
  app.put('/api/caracteresEspeciales', auth.requiresLogin, vCaracteres.update);

  //Regiones
  var vRegion= require('../app/controllers/region/region');
  app.get('/api/region', auth.requiresLogin, vRegion.regionGetAll);
  app.post('/api/region', auth.requiresLogin, vRegion.addRegion);
  app.put('/api/region/delete', auth.requiresLogin, vRegion.delete);
  app.put('/api/region/:codigo', auth.requiresLogin, vRegion.update);

  //Localidades
  var vLocalidad= require('../app/controllers/localidad/localidad');
  app.get('/api/localidad', auth.requiresLogin, vLocalidad.localidadGetAll);
  /**</editor-fold>*/

  //Agrupador (Usado para el menú agrupamientos
  var vAgrupador= require('../app/controllers/agrupador/agrupador');
  app.get('/api/agrupador', auth.requiresLogin, vAgrupador.agrupadorGetAll);


  /** <editor-fold desc="PROCESOS"> */
  // var vWord= require('../app/controllers/word/word');
  // app.get('/api/word.doc', vWord.getWordFile);


  var vProcesosRun= require('../app/controllers/procesos/procesos');
    app.post('/api/procesos/run', auth.requiresLogin, vProcesosRun.procesoEjecutar);

  var vProcesos= require('../app/controllers/procesos/procesos');
  app.get('/api/procesos/procesosTraerTodos',auth.requiresLogin, vProcesos.procesosTraerTodos);
  app.get('/api/procesos/procesosTraerArchivos',auth.requiresLogin, vProcesos.procesosTraerArchivos);
  app.post('/api/procesos/procesoParamInsertar', auth.requiresLogin, vProcesos.procesoParamInsertar)


  app.get('/api/procesos/reactivar', auth.requiresLogin,vProcesos.procesosReactivar);

  app.get('/api/procesos/procesosTraerPorNombre/:nombre',auth.requiresLogin, vProcesos.procesosTraerPorNombre);
  app.get('/api/procesos/estadoProcesoDependiente/:idProceso', auth.requiresLogin,vProcesos.traerEstadoProcesoDependiente);
  app.get('/api/procesos/:idProceso',auth.requiresLogin, vProcesos.procesosTraerDepende);
  app.post('/api/procesos', auth.requiresLogin,vProcesos.procesosInsertar);


  app.put('/api/procesos', vProcesos.procesosModificar);
  app.delete('/api/procesos/:idProceso', auth.requiresLogin,vProcesos.procesosBorrar);

  // Procesos - Agenda
  app.get('/api/procesos/agenda/:idProceso', auth.requiresLogin, vProcesos.getAgendasProceso);
  app.delete('/api/procesos/agenda/:idProceso', vProcesos.procesosAgendaDelete);

  var vProcesosPaso= require('../app/controllers/procesos/procesosPaso');
  app.get('/api/procesosPaso/:idProceso',auth.requiresLogin, vProcesosPaso.procesosPasosTraer);
  // app.get('/api/procesosPaso/:idProceso/:paso', vProcesosPaso.procesosPasosTraer);
  app.post('/api/procesosPaso', auth.requiresLogin,vProcesosPaso.procesosPasosInsertar);
  app.put('/api/procesosPaso', auth.requiresLogin,vProcesosPaso.procesosPasosModificar);
  app.delete('/api/procesosPaso/:idProcesoPaso', auth.requiresLogin,vProcesosPaso.procesosPasosBorrar);

  // Reportes > Control de Sucursales
  var vControlSucursales = require('../app/controllers/controlSucursales/controlSucursales');
  app.get('/api/controlSucursales', auth.requiresLogin,vControlSucursales.traerControlSucursales);
  app.get('/api/controlSucursalesPadronUnificado', auth.requiresLogin,vControlSucursales.traerControlSucursalesPadronUnificado);

  //Reportes > Reporte Dinámico de Padron Unificado
  var vReportes = require('../app/controllers/reportes/reportes');
  app.get('/api/reportes/reporteTC', auth.requiresLogin, vReportes.executesql);
  app.get('/api/reportes/archivosPadronUnificado', auth.requiresLogin, vReportes.archivosEncabezadoPadronUnificado);
  app.get('/api/reportes/reporteMasterSeguros', auth.requiresLogin, vReportes.executeMasterSeguros);
  app.get('/api/reportes/archivo/:filter/:order', auth.requiresLogin, vReportes.archivo);
  app.get('/api/reportes/sinRelacionConCuenta', auth.requiresLogin, vReportes.executeBeneficiariosSinRelacion);
  app.get('/api/reportes/archivoSinRelacion/', auth.requiresLogin, vReportes.sinRelacionArchivo);
  app.get('/api/reportes/bajaApoderados/', auth.requiresLogin, vReportes.reporteBajaClientes);

  app.get('/api/reportes/reporteMasterSeguros/archivo', auth.requiresLogin, vReportes.masterSegurosArchivo);

  app.get('/api/reportes/executeReporteTarjetasBoletin', auth.requiresLogin, vReportes.executeReporteTarjetasBoletin);
  app.get('/api/reportes/exportReporteTarjetasBoletin', auth.requiresLogin, vReportes.exportReporteTarjetasBoletin);

  app.get('/api/reportes/reporteTarjetasBoletinDetalle', auth.requiresLogin, vReportes.reporteTarjetasBoletinDetalle);
  app.get('/api/reportes/reporteTarjetasBoletinDetalleExport', auth.requiresLogin, vReportes.reporteTarjetasBoletinDetalleExport);

  app.get('/api/reportes/reporteClientesRechazadosDetalle', auth.requiresLogin,       vReportes.reporteClientesRechazadosDetalle);
  app.get('/api/reportes/reporteClientesRechazadosDetalleExport', auth.requiresLogin, vReportes.reporteClientesRechazadosExport);

  app.get('/api/reportes/recargablesSaltaExport', auth.requiresLogin, vReportes.reporteRecargablesSaltaExport);
  app.get('/api/reportes/recargables', auth.requiresLogin, vReportes.reporteRecargables);

  app.get('/api/reportes/campaniasPorCierre', auth.requiresLogin, vReportes.reporteCampaniasPorCierre);
  app.get('/api/reportes/campaniasPorCierre/detalle', auth.requiresLogin, vReportes.reporteCampaniasPorCierreDetalle);
  app.get('/api/reportes/campaniasPorCierre/archivo', auth.requiresLogin, vReportes.reporteCampaniasPorCierreDetalleArchivo);

  app.get('/api/reportes/dgiDiferencias', auth.requiresLogin, vReportes.reporteDGIDiferencias);
  app.get('/api/reportes/dgiDiferencias/archivo', auth.requiresLogin, vReportes.reporteDGIDiferenciasArchivo);

  app.get('/api/reportes/procesoConvenio', auth.requiresLogin, vReportes.reporteProcesoConvenio);
  app.get('/api/reportes/rechazosLiquidacion', auth.requiresLogin, vReportes.reporteRechazosLiquidacion);
  app.get('/api/reportes/rechazosProcesadosLiquidaciones', auth.requiresLogin, vReportes.reporteRechazosProcesadosLiquidaciones);
  app.get('/api/reportes/rechazosConvenio', auth.requiresLogin, vReportes.reporteRechazosConvenio);
  app.get('/api/reportes/rechazosDetalle', auth.requiresLogin, vReportes.reporteRechazosDetalle);
  app.get('/api/reportes/rechazosDetalleCSV', auth.requiresLogin, vReportes.reporteRechazosDetalleArchivo);
  app.get('/api/reportes/rechazosTotalesRTF', auth.requiresLogin, vReportes.reporteRechazosTotalesArchivo);

  //Reportes > Movimientos Liquidados
    app.get('/api/reportes/reporteMovLiquidVISA', auth.requiresLogin, vReportes.reporteMovLiquidVISA);
    app.get('/api/reportes/reporteMovLiquidMaster', auth.requiresLogin, vReportes.reporteMovLiquidMaster);
    app.get('/api/reportes/reporteMovLiquidVISA/Excel', auth.requiresLogin, vReportes.reporteMovLiquidVISAExcel);
    app.get('/api/reportes/reporteMovLiquidMaster/Excel', auth.requiresLogin, vReportes.reporteMovLiquidMasterExcel);
  //Reportes > Cuotas Pendientes
    app.get('/api/reportes/reporteCuotasPendientes', auth.requiresLogin, vReportes.reporteCuotasPendientes);
    app.get('/api/reportes/reporteCuotasPendientes/Excel', auth.requiresLogin, vReportes.reporteCuotasPendientesExcel);
  //Reportes > Comercio
  app.get('/api/reportes/padronesComercio', auth.requiresLogin, vReportes.padronesComercio);
  app.get('/api/reportes/padronesComercio/exportar',auth.requiresLogin, vReportes.padronesComercioExportar);



  // Contabilidad
  var vContabilidad = require('../app/controllers/contabilidad/contabilidad');
  app.get('/api/contabilidad/proceso/:proceso', auth.requiresLogin, vContabilidad.traerCuentas);
  app.get('/api/contabilidad/traerProcesoCuenta', auth.requiresLogin, vContabilidad.traerProcesoCuenta);
  app.get('/api/configuracionContable/:idProceso', auth.requiresLogin, vContabilidad.traerConfiguracionContable);
  app.put('/api/configuracionContable/:idProceso', auth.requiresLogin, vContabilidad.updateConfiguracionContable);

  app.param('filter', function (req, res, next, id) {
    req.filter = id;
    next();
  });
  app.param('order', function (req, res, next, id) {
    req.order = id;
    next();
  });


  /**</editor-fold>*/







  /** <editor-fold desc="CALENDARIO"> */
  var vCalendario= require('../app/controllers/calendario/calendario');
  app.get('/api/calendario', auth.requiresLogin, vCalendario.calendarioGetAll);
  app.get('/api/calendario/:idPeriodo', auth.requiresLogin, vCalendario.GetById);
  app.post('/api/calendario', auth.requiresLogin, vCalendario.insert);
  app.put('/api/calendario/:idPeriodo', auth.requiresLogin, vCalendario.update);
  app.get('/api/periodos', auth.requiresLogin, vCalendario.traerPeriodos);

  /**</editor-fold>*/


  /** <editor-fold desc="Agenda"> */
  var vAgenda= require('../app/controllers/agenda/agenda');
  app.get('/api/convenios/conveniosAperturaCuentas/:esRegen', auth.requiresLogin, vAgenda.traerConveniosAperturaCuentas);

  app.get('/api/agendaAutomatico/:idPerfil', auth.requiresLogin, vAgenda.agendaAutomaticoGetAll);
  app.get('/api/agendaManual/:idPerfil', auth.requiresLogin, vAgenda.agendaManualGetAll);
  app.get('/api/agenda/traerPorProceso', auth.requiresLogin, vAgenda.agendaTraerPorProceso);
  app.get('/api/agendaHistorico/:idPerfil', auth.requiresLogin, vAgenda.agendaHistoricoGetAll);
  
  // var registro = require('../app/utils/registry');
  // app.get('/api/registro', registro.leerRegistro);

  app.get('/api/agenda/:idProceso', auth.requiresLogin, vAgenda.bajarProceso);
  app.put('/api/agenda/:idAgenda', auth.requiresLogin, vAgenda.update);
  app.put('/api/agendaDelete/:idAgenda', auth.requiresLogin, vAgenda.delete);
  app.delete('/api/agenda/:idAgenda', auth.requiresLogin, vAgenda.update);
  app.get('/api/agendaPasos/:idAgenda', auth.requiresLogin, vAgenda.logAgendaPasosGetLast);
  app.get('/api/logAgendaPasos/:idLogAgenda', auth.requiresLogin, vAgenda.logAgendaTraer);
  app.put('/api/destrabarAgenda/:idAgenda/', auth.requiresLogin, vAgenda.destrabarAgenda);
  /**</editor-fold>*/


  //Regiones
  var vMarca= require('../app/controllers/archivos/archivos');
  app.get('/api/archivosMarca', auth.requiresLogin, vMarca.marcasGetAll);
  app.get('/api/archivosMarca/grupos', auth.requiresLogin, vMarca.gruposTraer);
  app.get('/api/reportes/archivosMarca/exportar',auth.requiresLogin, vMarca.archivoMarcaExportar);
  app.post('/api/archivosMarca', auth.requiresLogin, vMarca.insert);
  app.delete('/api/archivosMarca/:idMarca', auth.requiresLogin, vMarca.delete);

  //Control de Archivos
  var vControlArchivos = require('../app/controllers/controlArchivos/controlArchivos');
  app.get('/api/controlArchivos/:periodo', auth.requiresLogin, vControlArchivos.traerPorPeriodo);
  app.post('/api/controlArchivos/enviarArchivo',auth.requiresLogin, vControlArchivos.enviarArchivo);
  app.put('/api/controlArchivos', auth.requiresLogin, vControlArchivos.editarCobis);
  app.get('/api/controlArchivosEncabezado', auth.requiresLogin, vControlArchivos.traerEncabezado);



  //Cuentas No Activas
  var vCuentasNoActivas = require('../app/controllers/cuentasNoActivas/cuentasNoActivas');
  app.get('/api/cuentasNoActivas/', auth.requiresLogin, vCuentasNoActivas.traerPorPeriodo);
  app.get('/api/periodos/cuentasNoActivas', auth.requiresLogin, vCuentasNoActivas.traerPeriodos);
  app.get('/api/periodos/clientesRechazados', auth.requiresLogin, vCuentasNoActivas.clientesRechazados_TraerPeriodos);
  app.get('/api/periodos/bajaClientes', auth.requiresLogin, vCuentasNoActivas.bajaClientes_TraerPeriodos);
  app.get('/api/bajaClientes/convenios', auth.requiresLogin, vCuentasNoActivas.bajaClientes_TraerConvenios);




  var vCuentasApertura= require('../app/controllers/cuentasApertura/aperturaCuentas');

  app.get('/api/aperturaCuentas/porperiodo', auth.requiresLogin, vCuentasApertura.periodoTraer);
  app.get('/api/aperturaCuentas/convenioTraer', auth.requiresLogin, vCuentasApertura.convenioTraer);

  app.get('/api/migraConvenio/getAll', auth.requiresLogin, vCuentasApertura.getMigraConvenio);
  app.get('/api/migraConvenio/envioMail/:usarAlt', auth.requiresLogin,vCuentasApertura.envioMail); //auth.requiresLogin
  app.get('/api/migraConvenio/viewMigraFile/:id', auth.requiresLogin,vCuentasApertura.viewMigraFile);
  app.get('/api/parametros/obtener', auth.requiresLogin,vCuentasApertura.obtenerParametro);


  //Retenciones
    var vRtenciones= require('../app/controllers/retencion/retencion');
    app.get('/api/retencion', auth.requiresLogin, vRtenciones.tipoRetencionGetAll);
    app.get('/api/retencionPlanCuenta', auth.requiresLogin, vRtenciones.planCuentaGetAll);
    app.get('/api/retencion/:idRegimen', auth.requiresLogin, vRtenciones.GetById);
    app.post('/api/retencion', auth.requiresLogin, vRtenciones.insert);
    app.put('/api/retencion/:idRegimen', auth.requiresLogin, vRtenciones.update);
    app.post('/api/retencion/delete/:idRegimen', auth.requiresLogin, vRtenciones.delete);

    //Divisiones
     var vDivisiones= require('../app/controllers/divisiones/divisiones');
     app.get('/api/divisionesParametric', auth.requiresLogin, vDivisiones.divisionesGetAll);
     app.post('/api/divisionesParametric', auth.requiresLogin, vDivisiones.addDivision);
     app.put('/api/divisionesParametric/delete', auth.requiresLogin, vDivisiones.delete);
     app.put('/api/divisionesParametric/:codigo', auth.requiresLogin, vDivisiones.update);


  /**/
  /**
   *
   *
   * SQL Authentication
   *
   * */

  //var basicAuth = require('basic-auth-connect');
  //
  //app.all('/sql/*', basicAuth('semtest','test1'));

  app.all('/sql/*', auth.requiresLoginSql);
  
  
  //Apoderados
  app.get('/sql/apoderado', auth.requiresLogin, vApoderados.apoderadoGetAll);
  app.get('/sql/apoderado/:idApoderado', auth.requiresLogin, vApoderados.GetById);
  app.post('/sql/apoderado', auth.requiresLogin, vApoderados.insert);
  app.put('/sql/apoderado/:idApoderado', auth.requiresLogin,  vApoderados.update);
  app.put('/sql/apoderadoDelete/:idApoderado', auth.requiresLogin, vApoderados.delete);

  // Campañas
  var vCampañas = require('../app/controllers/campañas/campañas');
  app.get('/api/campanias/', auth.requiresLogin, vCampañas.traer);
  app.post('/api/campanias/', auth.requiresLogin, vCampañas.alta);
  app.put('/api/campanias/:codigo', auth.requiresLogin, vCampañas.modificacion);
  app.delete('/api/campanias/:codigo', auth.requiresLogin, vCampañas.baja);
  app.get('/api/campanias/mail', auth.requiresLogin, vCampañas.envioMailCampaniasPorCierre);
  

  // Distribuciones
  var vDistribuciones = require('../app/controllers/distribuciones/distribuciones');
  app.get('/api/distribuciones/', auth.requiresLogin, vDistribuciones.traer);
  app.get('/api/controlDuplicado/distribuciones', auth.requiresLogin, vDistribuciones.controlDuplicado);
  app.post('/api/distribuciones/', auth.requiresLogin, vDistribuciones.insert);
  app.put('/api/distribuciones/:codigo', auth.requiresLogin, vDistribuciones.modificar);
  app.delete('/api/distribuciones/:codigo', auth.requiresLogin, vDistribuciones.borrar);


  // asignarAgrupador
  var vasignarAgrupador = require('../app/controllers/asignarAgrupador/asignarAgrupador');
  app.get('/api/asignarAgrupador/', auth.requiresLogin, vDistribuciones.traer);
  app.get('/api/controlDuplicado/asignarAgrupador', auth.requiresLogin, vDistribuciones.controlDuplicado);
  app.post('/api/asignarAgrupador/', auth.requiresLogin, vDistribuciones.insert);
  app.put('/api/asignarAgrupador/:codigo', auth.requiresLogin, vDistribuciones.modificar);
  app.delete('/api/asignarAgrupador/:codigo', auth.requiresLogin, vDistribuciones.borrar);

  
  // Procesos Campañas
  var vProcesosCampanias = require('../app/controllers/procesosCampañas/procesosCampañas');
  app.get('/api/procesosCampanias/', auth.requiresLogin, vProcesosCampanias.traer);
  app.post('/api/procesosCampanias/', auth.requiresLogin, vProcesosCampanias.insertar);
  app.put('/api/procesosCampanias/:codigo', auth.requiresLogin, vProcesosCampanias.modificar);
  app.delete('/api/procesosCampanias/', auth.requiresLogin, vProcesosCampanias.borrar);

  // Mails Configurables
  var vMailsConfigurables = require('../app/controllers/mailsConfigurables/mailsConfigurables');
  app.get('/api/mailsConfigurables/', auth.requiresLogin, vMailsConfigurables.traer);
  app.post('/api/mailsConfigurables/', auth.requiresLogin, vMailsConfigurables.insertar);
  app.put('/api/mailsConfigurables/:idMails', auth.requiresLogin, vMailsConfigurables.modificar);
  app.delete('/api/mailsConfigurables/', auth.requiresLogin, vMailsConfigurables.borrar);

  //Fallecidos
  var vFallecidos= require('../app/controllers/fallecidos/fallecidos');
  app.get('/api/fallecidos/obtenerPeriodo', auth.requiresLogin, vFallecidos.obtenerPeriodo);
  app.get('/api/fallecidos/riesgoContingentePeriodos', auth.requiresLogin, vFallecidos.getRiesgoContingentePeriodo);

  app.get('/api/fallecidos/riesgoContingente', auth.requiresLogin, vFallecidos.getRiesgoContingente);
  app.get('/api/fallecidos/riesgoContingentePorDia', auth.requiresLogin, vFallecidos.getRiesgoContingentePorDia);
  app.get('/api/fallecidos/riesgoContingentePorRegion', auth.requiresLogin, vFallecidos.getRiesgoContingentePorRegion);
  app.get('/api/fallecidos/riesgoContingentePorDetalle', vFallecidos.getRiesgoContingentePorDetalle);
  app.get('/api/fallecidos/generarExcelRiesgoContingente', auth.requiresLogin, vFallecidos.generarExcelRiesgoContingente);




      app.get('/api/fallecidos', auth.requiresLogin, vFallecidos.getAll);
  app.post('/api/fallecidos/Periodo', auth.requiresLogin, vFallecidos.insert);
  app.put('/api/fallecidos/Periodo/:idPeriodo', auth.requiresLogin, vFallecidos.updatePeriodo);
  app.put('/api/fallecidos/:idFallecidos', auth.requiresLogin, vFallecidos.update);
  app.post('/api/fallecidos/Contabilidad', auth.requiresLogin, vFallecidos.Contabilidad);
  app.get('/api/fallecidos/Contabilidad', auth.requiresLogin, vFallecidos.ObtenerContabilidadEnc);
  app.get('/api/fallecidos/pantallaExportarExcel',  vFallecidos.fallecidosPantallaExportar);

// auth.requiresLogin,


  var vMotivosDeRechazo= require('../app/controllers/MotivosDeRechazo/MotivosDeRechazo');
  app.get ('/api/MotivosDeRechazo',auth.requiresLogin, vMotivosDeRechazo.traer);
  app.get ('/api/MotivosDeRechazo/:idMotivoRechazos',auth.requiresLogin, vMotivosDeRechazo.seleccionar);
  app.get ('/api/MotivosDeRechazo.ControlDuplicado/',auth.requiresLogin, vMotivosDeRechazo.controlDuplicado);
  app.post('/api/MotivosDeRechazo', auth.requiresLogin,vMotivosDeRechazo.insertar);
  app.put('/api/MotivosDeRechazo/:idMotivoRechazos', auth.requiresLogin,vMotivosDeRechazo.modificar);

  var vAgrupamientos= require('../app/controllers/agrupamientos/agrupamientos');
  app.get ('/api/Agrupamientos',auth.requiresLogin, vAgrupamientos.traer);
  app.get ('/api/AgrupamientosConciliaciones',auth.requiresLogin, vAgrupamientos.agrupadorConciliacionesObtenerPorProceso);
  app.get ('/api/AgrupamientosConciliaciones/paginado',auth.requiresLogin, vAgrupamientos.agrupadorConciliacionesObtenerPorProcesoPaginado);
  app.get ('/api/conciliaciones/movPresentados',auth.requiresLogin, vAgrupamientos.conciliacionesMovPresentados);
  app.get ('/api/conciliaciones/movPresentados/export',auth.requiresLogin, vAgrupamientos.conciliacionesMovPresentadosExport);
  app.get ('/api/conciliaciones/sinAgrupar',auth.requiresLogin, vAgrupamientos.conciliacionesSinAgrupar);
  app.post('/api/conciliaciones/sinAgrupar',auth.requiresLogin, vAgrupamientos.conciliacionesSinAgruparInsertar);
  // auth.requiresLogin,

  var vEntesExternos = require('../app/controllers/entesExternos/entesExternos');
    app.get ('/api/entesExternos',auth.requiresLogin, vEntesExternos.obtenerEntesExternos);
    app.get ('/api/entesExternos/archivo',auth.requiresLogin, vEntesExternos.exportarExcel);
    app.get ('/api/entesExternos/ajuste/archivoMail',auth.requiresLogin, vEntesExternos.generarAjusteMail);
  //
    //app.get ('/api/entesExternos',auth.requiresLogin, vEntesExternos.conciliacionesMovPresentados);
    //app.get ('/api/entesExternos/export',auth.requiresLogin, vEntesExternos.conciliacionesMovPresentadosExport);



  app.get ('/api/Agrupamientos/:idAgrupamiento',auth.requiresLogin, vAgrupamientos.seleccionar);
  app.get ('/api/Agrupamientos.ControlDuplicado/',auth.requiresLogin, vAgrupamientos.controlDuplicado);
  app.post('/api/Agrupamientos', auth.requiresLogin,vAgrupamientos.insertar);
  app.put('/api/Agrupamientos/:idAgrupamiento', auth.requiresLogin,vAgrupamientos.modificar);

  var vDigitadores= require('../app/controllers/digitadores/digitadores');
  app.get ('/api/digitadores',auth.requiresLogin, vDigitadores.traer);
  app.get ('/api/digitadores/:idDigitador',auth.requiresLogin, vDigitadores.seleccionar);
  app.get ('/api/digitadores.ControlDuplicado/',auth.requiresLogin, vDigitadores.controlDuplicado);
  app.post('/api/digitadores', auth.requiresLogin,vDigitadores.insertar);
  app.put( '/api/digitadores/:idDigitador', auth.requiresLogin,vDigitadores.modificar);
  //app.put( '/api/digitadorDelete/:idDigitador', auth.requiresLogin, vDigitadores.delete);
  //app.delete('/api/digitadores/:idDigitador', auth.requiresLogin, vDigitadores.delete);
  app.delete('/api/digitadores/', auth.requiresLogin, vDigitadores.delete);

  var vPlanCuenta= require('../app/controllers/planCuenta/planCuenta');
  app.get ('/api/planCuenta', auth.requiresLogin, vPlanCuenta.traer);

  var vPromociones= require('../app/controllers/promociones/promociones');
  app.get('/api/promociones/ConsultasPromoTC', auth.requiresLogin,vPromociones.ConsultasPromoTC);
  app.get('/api/promociones/ConsultasPromoTC/exportar', auth.requiresLogin,vPromociones.ConsultasPromoTCExportar);
  app.get('/api/promociones/ConsultasPromoTC/maxFecProceso', auth.requiresLogin,vPromociones.maxFecProceso);

  //ABM promociones
  app.get ('/api/promociones',auth.requiresLogin, vPromociones.traer);
  //app.get ('/api/promociones/:idPromociones',auth.requiresLogin, vPromociones.seleccionar);
  app.get ('/api/promociones.ControlDuplicado/',auth.requiresLogin, vPromociones.controlDuplicado);
  app.post('/api/promociones', auth.requiresLogin,vPromociones.insertar);
  app.put('/api/promociones/:idPromociones', auth.requiresLogin,vPromociones.modificar);
  app.get('/api/promociones/promoTDAsoc/GenerarArchivoTD', auth.requiresLogin, vPromociones.GenerarArchivoTD);



  var vPromoTD = require('../app/controllers/promociones/promoTD');
  app.get('/api/promociones/promoTDAsoc/Archivos', auth.requiresLogin, vPromoTD.ObtenerArchivos);
  app.post('/api/promociones/promoTDAsoc/Archivos', auth.requiresLogin, vPromoTD.GenerarArchivo);
  app.get('/api/promociones/promoTDAsoc/Promociones', auth.requiresLogin, vPromoTD.ObtenerPromociones);
  app.get('/api/promociones/promoTDConsulta/ArchivosAsignados', auth.requiresLogin, vPromoTD.ObtenerArchivosAsignados);
  app.get('/api/promociones/promoTDConsulta/PromoTarjetas', auth.requiresLogin, vPromoTD.ObtenerPromoTarjetas);
  app.get('/api/promociones/promoTDConsulta/PadronTD', auth.requiresLogin, vPromoTD.ObtenerPadronTD);
  app.post('/api/promociones/promoTDConsulta/ExportarExcel', auth.requiresLogin, vPromoTD.ExportarExcel);

  const vEventos = require('../app/controllers/eventos/eventos');
  app.get('/api/conciliaciones/eventos', auth.requiresLogin, vEventos.obtenerEventos);
  app.put('/api/conciliaciones/eventos', auth.requiresLogin, vEventos.guardarEvento);
  app.delete('/api/conciliaciones/eventos', auth.requiresLogin, vEventos.bajaEvento);
  app.get('/api/conciliaciones/eventoGrupos', auth.requiresLogin, vEventos.obtenerEventoGrupos);

  var vConciliacionCobranzas = require('../app/controllers/conciliacionCobranzas/conciliacionCobranzas');
  app.get ('/api/conciliacionCobranzas',auth.requiresLogin, vConciliacionCobranzas.obtenerConciliacionCobranzas);
  app.get ('/api/conciliacionCobranzas/export', vConciliacionCobranzas.obtenerConciliacionCobranzasExportar);
  // auth.requiresLogin,

  var vCruceVisaco = require('../app/controllers/cruceVISACO/cruceVISACO');
  app.get('/api/cruceVISACO/EstVISACO', auth.requiresLogin,vCruceVisaco.ObtenerTotalesEstVISACO);
  app.get('/api/cruceVISACO/TotReclamosVISA', auth.requiresLogin,vCruceVisaco.ObtenerTotReclamosVISA);
  app.get('/api/cruceVISACO/TotVISAAsociados', auth.requiresLogin,vCruceVisaco.ObtenerTotVISAAsociados);
  app.get('/api/cruceVISACO/TotCambioEstado', auth.requiresLogin,vCruceVisaco.ObtenerTotCambioEstado);
  app.get('/api/cruceVISACO/VISADetalle', auth.requiresLogin,vCruceVisaco.ObtenerVisaDetalle);
  app.get('/api/cruceVISACO/Monedas', auth.requiresLogin,vCruceVisaco.ObtenerMonedas);
  app.get('/api/cruceVISACO/FecProceso', auth.requiresLogin,vCruceVisaco.ObtenerUltimoFecProceso);
  app.get('/api/cruceVISACO/ExcelDetalle', auth.requiresLogin,vCruceVisaco.ObtenerExcelDetalle);
  app.get('/api/cruceVISACO/TotalesDetalle', auth.requiresLogin,vCruceVisaco.ObtenerTotalesDetalle);
  app.get('/api/cruceVISACO/EnviarMail', auth.requiresLogin,vCruceVisaco.EnviarMail);

  var vRechazoUnificado = require('../app/controllers/rechazoUnificado/rechazoUnificado');
  app.get('/api/rechazosUnificados/Cuentas', auth.requiresLogin,vRechazoUnificado.ObtenerCuentas);
  app.get('/api/rechazosUnificados/Tarjetas', auth.requiresLogin,vRechazoUnificado.ObtenerTarjetas);


  var vPartPendientes = require('../app/controllers/partPendienteVi/partPendientesVi');
  app.get('/api/partPendienteVi/TotCie', auth.requiresLogin,vPartPendientes.ObtenerTotalesCie);
  app.get('/api/partPendienteVi/TotCancelaciones', auth.requiresLogin,vPartPendientes.ObtenerTotalesCancelaciones);
  app.get('/api/partPendienteVi/Historico', auth.requiresLogin,vPartPendientes.ObtenerHistorico);
  app.get('/api/partPendienteVi/detalleCie', auth.requiresLogin,vPartPendientes.ObtenerRegNroCie);
  app.get('/api/partPendienteVi/detalleCis', auth.requiresLogin,vPartPendientes.ObtenerRegNroCis);
  app.get('/api/partPendienteVi/exportCis', auth.requiresLogin,vPartPendientes.exportCis);



  var vCancelaciones = require('../app/controllers/cancelaciones/cancelaciones');
  app.get ('/api/cancelaciones',auth.requiresLogin, vCancelaciones.traer);
  //app.get ('/api/cancelaciones/:idPpVisaCis',auth.requiresLogin, vCancelaciones.seleccionar);
  app.get ('/api/cancelaciones.ControlDuplicado/',auth.requiresLogin, vCancelaciones.controlDuplicado);
  app.post('/api/cancelaciones', auth.requiresLogin,vCancelaciones.insertar);
  //app.put( '/api/cancelaciones/:idPpVisaCis', auth.requiresLogin,vCancelaciones.modificar);
  //app.delete('/api/cancelaciones/', auth.requiresLogin, vCancelaciones.delete);


    // datos fijos
    var vDatosFijos= require('../app/controllers/datosFijos/datosFijos');
    app.get('/api/datosFijos/Tarjetas', auth.requiresLogin, vDatosFijos.datosFijosGetAllTarjetas);
    app.get('/api/datosFijos/Cuentas', auth.requiresLogin, vDatosFijos.datosFijosGetAllCuentas);
    app.get('/api/datosFijos/tiposCtasTarjetas', auth.requiresLogin, vDatosFijos.tiposCtasTarjetas);

    app.get('/api/datosFijos/EDPCantCuentasTarjetasValidar', auth.requiresLogin, vDatosFijos.EDPCantCuentasTarjetasValidar);
    app.get('/api/datosFijos/validarDatosFijosCuentas', auth.requiresLogin, vDatosFijos.validarDatosFijosCuentas);
    app.get('/api/datosFijos/validarDatosFijosTarjetas', auth.requiresLogin, vDatosFijos.validarDatosFijosTarjetas);

   app.post('/api/datosFijosEDPCuentas', auth.requiresLogin, vDatosFijos.DatosFijosEDPInsert);
   app.put ('/api/datosFijosEDPCuentas/:idEDPDatosFijosCuentas', auth.requiresLogin, vDatosFijos.DatosFijosEDPUpdate);
   app.delete('/api/datosFijosEDPCuentas/:idEDPDatosFijosCuentas', auth.requiresLogin, vDatosFijos.DatosFijosEDPDelete);

   app.post('/api/datosFijosEDPTarjetas', auth.requiresLogin, vDatosFijos.DatosFijosTarjetasEDPInsert);
   app.put ('/api/datosFijosEDPTarjetas/:idEDPDatosFijosTarjetas', auth.requiresLogin, vDatosFijos.DatosFijosTarjetasEDPUpdate);
   app.delete('/api/datosFijosEDPTarjetas/:idEDPDatosFijosTarjetas', auth.requiresLogin, vDatosFijos.DatosFijosTarjetasEDPDelete);

  /*nm_EDP
    app.get('/api/datosFijos/cantCuentasValidar', auth.requiresLogin, vDatosFijos.cantCuentasValidar);
*/

  /**
   * Datos Fijos VS
   */
  var vDatosFijosVSCuentas = require('../app/controllers/datosFijosVS/cuentas');
  app.get('/api/datosFijosVS/cuentas', auth.requiresLogin, vDatosFijosVSCuentas.getCuentas);
  app.put('/api/datosFijosVS/cuentas', auth.requiresLogin, vDatosFijosVSCuentas.saveCuenta);
  app.delete('/api/datosFijosVS/cuentas', auth.requiresLogin, vDatosFijosVSCuentas.delCuentas);
  app.get('/api/datosFijosVS/tipoCuentas', auth.requiresLogin, vDatosFijosVSCuentas.getTipoCuentas);
  var vDatosFijosVSTarjetas= require('../app/controllers/datosFijosVS/tarjetas');
  app.get('/api/datosFijosVS/tarjetas', auth.requiresLogin, vDatosFijosVSTarjetas.getTarjetas);
  app.put('/api/datosFijosVS/tarjetas', auth.requiresLogin, vDatosFijosVSTarjetas.saveTarjeta);
  app.delete('/api/datosFijosVS/tarjetas', auth.requiresLogin, vDatosFijosVSTarjetas.delTarjetas);
  app.get('/api/datosFijosVS/tarjetas/ocupaciones', auth.requiresLogin, vDatosFijosVSTarjetas.getOcupaciones);

  var vLcCoeficientesImportes = require('../app/controllers/limitesDeCompras/coeficientesImportes');
  app.get('/api/limitesDeCompras/coeficientesImportes', auth.requiresLogin, vLcCoeficientesImportes.getCoeficientesImportes);
  app.put('/api/limitesDeCompras/coeficientesImportes', auth.requiresLogin, vLcCoeficientesImportes.saveCoeficientesImporte);
  app.delete('/api/limitesDeCompras/coeficientesImportes', auth.requiresLogin, vLcCoeficientesImportes.delCoeficientesImportes);
  var vLcProductos= require('../app/controllers/limitesDeCompras/productos');
  app.get('/api/limitesDeCompras/productos', auth.requiresLogin, vLcProductos.getProductos);
  app.put('/api/limitesDeCompras/productos', auth.requiresLogin, vLcProductos.saveProducto);
  app.delete('/api/limitesDeCompras/productos', auth.requiresLogin, vLcProductos.delProducto);

  // rechazos VS
  var vRechazosVS = require('../app/controllers/rechazosVS/rechazosVS');
  app.get('/api/rechazosVS/rechazosVS', auth.requiresLogin, vRechazosVS.getRechazosVS);

// unificado

  var vUnificadoCuentas = require('../app/controllers/unificado/cuentas');
  app.get('/api/unificado/cuentas', auth.requiresLogin, vUnificadoCuentas.getCuentas);
  var vUnificadoTarjetas = require('../app/controllers/unificado/tarjetas');
  app.get('/api/unificado/tarjetas', auth.requiresLogin, vUnificadoTarjetas.getTarjetas);
  app.get('/api/unificado/tipoNovedades', auth.requiresLogin, vUnificadoTarjetas.getTipoNovedades);
  app.get('/api/unificado/excel', auth.requiresLogin, vUnificadoTarjetas.getExcel);
  app.get('/api/unificado/fecProceso', auth.requiresLogin, vUnificadoTarjetas.getMaxFecProceso);



  //Regiones
  var vReclamos= require('../app/controllers/reclamos/reclamos');
  app.get('/api/reclamos/reclamos', auth.requiresLogin, vReclamos.GetByFecha);
  app.get('/api/reclamos/cupones', auth.requiresLogin, vReclamos.getCuponesPorReclamos);
  app.get('/api/reclamos/obtenerFechaMaxima', auth.requiresLogin, vReclamos.obtenerFechaMaxima);
  app.get('/api/reclamos/reclamosCount', auth.requiresLogin, vReclamos.reclamosCount);
  app.get('/api/reclamos/padronTD', auth.requiresLogin, vReclamos.padronTDTraer);
  app.get('/api/reclamos/padronTDNroCuenta', auth.requiresLogin, vReclamos.padronTDNroCuentaTraer);
  app.get('/api/reclamos/motivos', auth.requiresLogin, vReclamos.motivosReclamo_Traer);



  app.post('/api/reclamos', auth.requiresLogin, vReclamos.insert);
  app.post('/api/reclamos/eliminar', auth.requiresLogin, vReclamos.borrar);
  app.put('/api/reclamos/:idReclamoElectron', auth.requiresLogin, vReclamos.update);



  const vCotizacion = require('../app/controllers/cotizacion/cotizacion');
  app.get('/api/cotizacion/cotizacion', auth.requiresLogin, vCotizacion.ObtenerCotizaciones);
  app.get('/api/cotizacion/moneda', auth.requiresLogin, vCotizacion.ObtenerMonedas);
  app.post('/api/cotizacion/cotizacion', auth.requiresLogin, vCotizacion.GuardarCotizacion);
  app.delete('/api/cotizacion/cotizacion', auth.requiresLogin, vCotizacion.EliminarCotizaciones);

  // exceptions: si es "lib" y no "api" no sigue (no tiene next(); )
  app.use('/lib/*',  function(req, res, next) {
    //next();  
  });

  // catch 404 and forward
  app.use('/api/*',  function(req, res, next) {
    var err = new Error('No se encontró la funcionalidad ' + req.originalUrl);
    err.status = 404;
    next(err);
    
  });


  // Lo que no haya sido cacheado antes
  // (como /api/* por ejemplo)
  // se va por este redirect, que asumimos es de front-end
  app.use(function(req, res, next) {
    res.redirect("/#" + req.originalUrl);
    next();
  });

  // development error handler
  // will print stacktrace
  //if (process.env.NODE_ENV  === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('500.jade', {
      message: err.message,
      error: err
    });
  });
  //}

  // production error handler
  // no stacktraces leaked to user
  //app.use(function(err, req, res, next) {
  //  res.status(err.status || 500);
  //  res.render('500.jade', {
  //    message: err.message,
  //    error: {}
  //  });
  //});
  /**</editor-fold>*/


};

