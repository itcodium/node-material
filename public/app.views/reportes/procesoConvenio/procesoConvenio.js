var COLUMNS_VISA= [
    { id: 1, show: true, name: 'CodSis', field: 'CodSis', tip: '', align: 'right'},
    { id: 2, show: true, name: 'CodTar', field: 'CodTar', tip: '', align: 'right'},
    { id: 3, show: true, name: 'CodAdm', field: 'CodAdm', tip: '', align: 'right'},
    { id: 4, show: true, name: 'NroComercio', field: 'NroComercio', tip: '', align: 'right'},
    { id: 5, show: true, name: 'Entidad', field: 'Entidad', tip: '', align: 'right'},
    { id: 6, show: true, name: 'Sucursal', field: 'Sucursal', tip: '', align: 'right'},
    { id: 7, show: true, name: 'NroCuenta', field: 'NroCuenta', tip: '',  align: 'right'},
    { id: 8, show: true, name: 'FechaProc', field: 'FechaProc',  filter:'date',  align: 'right'},
    { id: 9, show: true, name: 'CodSubAdm', field: 'CodSubAdm', tip: '', align: 'right'},
    { id: 10, show: true, name: 'Moneda', field: 'Moneda', tip: ''},
    { id: 11, show: true, name: 'Nombre', field: 'Nombre', tip: ''},
    { id: 12, show: true, name: 'LiqAnticip', field: 'LiqAnticip', tip: ''},
    { id: 13, show: true, name: 'PlanCuotas', field: 'PlanCuotas', tip: '', align: 'right'},
    { id: 14, show: true, name: 'CantCuotas', field: 'CantCuotas', tip: '', align: 'right'},
    { id: 15, show: true, name: 'Calle', field: 'Calle', tip: ''},
    { id: 16, show: true, name: 'Nro', field: 'Nro', tip: '', align: 'right'},
    { id: 17, show: true, name: 'Piso', field: 'Piso', tip: '', align: 'right'},
    { id: 18, show: true, name: 'Local', field: 'Local', tip: ''},
    { id: 19, show: true, name: 'NroLocal', field: 'NroLocal', tip: ''},
    { id: 20, show: true, name: 'CodPos', field: 'CodPos', tip: '', align: 'right'},
    { id: 21, show: true, name: 'Localidad', field: 'Localidad', tip: ''},
    { id: 22, show: true, name: 'DiasPago', field: 'DiasPago', tip: '', align: 'right'},
    { id: 23, show: true, name: 'Telefono', field: 'Telefono', tip: ''},
    { id: 24, show: true, name: 'Pcia', field: 'Pcia', tip: ''},
    { id: 25, show: true, name: 'CodLocalidad', field: 'CodLocalidad', tip: '', align: 'right'},
    { id: 36, show: true, name: 'Beneficiario', field: 'Beneficiario', tip: ''},
    { id: 27, show: true, name: 'FormaPagoPesos', field: 'FormaPagoPesos', tip: '', align: 'right'},
    { id: 28, show: true, name: 'SucCuentaPes', field: 'SucCuentaPes', tip: '', align: 'right'},
    { id: 20, show: true, name: 'TipCuentaPes', field: 'TipCuentaPes', tip: ''},
    { id: 30, show: true, name: 'NroCuentaPes', field: 'NroCuentaPes', tip: '', align: 'right'},
    { id: 31, show: true, name: 'FormaPagoDol', field: 'FormaPagoDol', tip: '', align: 'right'},
    { id: 32, show: true, name: 'SucCuentaDol', field: 'SucCuentaDol', tip: '', align: 'right'},
    { id: 33, show: true, name: 'TipCuentaDol', field: 'TipCuentaDol', tip: ''},
    { id: 34, show: true, name: 'NroCuentaDol', field: 'NroCuentaDol', tip: '', align: 'right'},
    { id: 35, show: true, name: 'PersFisJur', field: 'PersFisJur', tip: ''},
    { id: 36, show: true, name: 'Rubro', field: 'Rubro', tip: '', align: 'right'},
    { id: 37, show: true, name: 'NroProceso', field: 'NroProceso', tip: '', align: 'right'},
    { id: 38, show: true, name: 'DebitAuto', field: 'DebitAuto', tip: '', align: 'right'},
    { id: 39, show: true, name: 'LimiteVta', field: 'LimiteVta', tip: '', align: 'right'},
    { id: 40, show: true, name: 'PorcDcto', field: 'PorcDcto', tip: '', align: 'right'},
    { id: 41, show: true, name: 'FechaAlta', field: 'FechaAlta', tip: '',filter:'date'},
    { id: 42, show: true, name: 'POS', field: 'POS', tip: ''},
    { id: 43, show: true, name: 'GAF', field: 'GAF', tip: '', align: 'right'},
    { id: 44, show: true, name: 'Estado', field: 'Estado', tip: '', align: 'right'},
    { id: 45, show: true, name: 'FechaBaja', field: 'FechaBaja', tip: '',filter:'date', align: 'right'},
    { id: 56, show: true, name: 'CicloPago', field: 'CicloPago', tip: '', align: 'right'},
    { id: 47, show: true, name: 'Bandera', field: 'Bandera', tip: '', align: 'right'},
    { id: 48, show: true, name: 'FormaPago', field: 'FormaPago', tip: '', align: 'right'},
    { id: 49, show: true, name: 'FechaUltPres', field: 'FechaUltPres', tip: '',filter:'date', align: 'right'},
    { id: 50, show: true, name: 'ImpVtaPes', field: 'ImpVtaPes', tip: '',  filter:'number', align: 'right'},
    { id: 51, show: true, name: 'PciaIIBB', field: 'CodProvIIBBRad', tip: ''},
    { id: 52, show: true, name: 'NroIIBB', field: 'NroIIBB', tip: '', align: 'right'},
    { id: 53, show: true, name: 'TipoIIBB', field: 'TipoIIBB', tip: ''},
    { id: 54, show: true, name: 'PciaIVA', field: 'PciaIVA', tip: ''},
    { id: 55, show: true, name: 'NroIVA', field: 'NroIVA', tip: '', align: 'right'},
    { id: 56, show: true, name: 'TipoIVA', field: 'TipoIVA', tip: ''},
    { id: 57, show: true, name: 'PciaCUIT', field: 'PciaCUIT', tip: '', align: 'right'},
    { id: 58, show: true, name: 'NroCUIT', field: 'NroCUIT', tip: '', align: 'right'},
    { id: 59, show: true, name: 'TipoCUIT', field: 'TipoCUIT', tip: ''},
    { id: 60, show: true, name: 'Modalidad', field: 'Modalidad', tip: '', align: 'right'},
    { id: 61, show: true, name: 'TelefDDN', field: 'TelefDDN', tip: '', },
    { id: 62, show: true, name: 'Captura', field: 'Captura', tip: ''},
    { id: 63, show: true, name: 'MarcaAgro', field: 'MarcaAgro', tip: ''},
    { id: 64, show: true, name: 'PciaPOS', field: 'PciaPOS', tip: '', align: 'right'},
    { id: 65, show: true, name: 'CodEquipoPOS', field: 'CodEquipoPOS', tip: '', align: 'right'},
    { id: 66, show: true, name: 'CantPOS', field: 'CantPOS', tip: '', align: 'right'},
    { id: 67, show: true, name: 'FechaInstPOS', field: 'FechaInstPOS', tip: '',filter:'date', align: 'right'},
    { id: 68, show: true, name: 'FechaIniPOS', field: 'FechaIniPOS', tip: '',filter:'date', align: 'right'},
    { id: 69, show: true, name: 'FechaUltPOS', field: 'FechaUltPOS', tip: '',filter:'date', align: 'right'},
    { id: 70, show: true, name: 'FechaBajPOS', field: 'FechaBajPOS', tip: '',filter:'date', align: 'right'},
    { id: 71, show: true, name: 'ImpPendPOS', field: 'ImpPendPOS', tip: '', align: 'right'},
    { id: 72, show: true, name: 'BolMaxRec', field: 'BolMaxRec', tip: '', align: 'right'}
    //{ id: 72, show: true, name: 'nombreArchivo', field: 'nombreArchivo', tip: ''}
];

var COLUMNS_MASTER= [
    { id: 1, show: true, name: 'Entidad', field: 'Entidad', tip: '', align: 'right'},
    { id: 2, show: true, name: 'Sucursal', field: 'Sucursal', tip: '', align: 'right'},
    { id: 3, show: true, name: 'NroComercio', field: 'NroComercio', tip: '', align: 'right'},
    { id: 4, show: true, name: 'NroEstabCentral', field: 'NroEstabCentral', tip: '', align: 'right'},
    { id: 5, show: true, name: 'Nombre', field: 'Nombre', tip: ''},
    { id: 6, show: true, name: 'RazonSocial', field: 'RazonSocial', tip: ''},
    { id: 7, show: true, name: 'Direccion', field: 'Direccion', tip: ''},
    { id: 8, show: true, name: 'Calle', field: 'Calle', tip: ''},
    { id: 9, show: true, name: 'Nro', field: 'Nro', tip: '', align: 'right'},
    { id: 10, show: true, name: 'Piso', field: 'Piso', tip: ''},
    { id: 11, show: true, name: 'CodPos', field: 'CodPos', tip: '', align: 'right'},
    { id: 12, show: true, name: 'Localidad', field: 'Localidad', tip: ''},
    { id: 13, show: true, name: 'Pcia', field: 'Pcia', tip: ''},
    { id: 14, show: true, name: 'Zona', field: 'Zona', tip: '', align: 'right'},
    { id: 15, show: true, name: 'Telefono', field: 'Telefono', tip: ''},
    { id: 16, show: true, name: 'PlazoPago', field: 'PlazoPago', tip: '', align: 'right'},
    { id: 17, show: true, name: 'PorcDcto', field: 'PorcDcto', tip: '', align: 'right'},
    { id: 18, show: true, name: 'PlanCuotas', field: 'PlanCuotas', tip: ''},
    { id: 19, show: true, name: 'IndicVigencia', field: 'IndicVigencia', tip: ''},
    { id: 20, show: true, name: 'Ramo', field: 'Ramo', tip: '', align: 'right'},
    { id: 21, show: true, name: 'SicCode', field: 'SicCode', tip: '', align: 'right'},
    { id: 22, show: true, name: 'LimiteVtaAct', field: 'LimiteVtaAct', tip: ''},
    { id: 23, show: true, name: 'LimiteVtaAnt', field: 'LimiteVtaAnt', tip: ''},
    { id: 24, show: true, name: 'FechaVigLimiteAnt', field: 'FechaVigLimiteAnt', tip: '',filter:'date'},
    { id: 25, show: true, name: 'TipoVale', field: 'TipoVale', tip: '', align: 'right'},
    { id: 26, show: true, name: 'FormaPagoPes', field: 'FormaPagoPes', tip: '', align: 'right'},
    { id: 27, show: true, name: 'nroCuentaLocal', field: 'nroCuentaLocal', tip: '', align: 'right'},
    { id: 28, show: true, name: 'formaPagoBanco', field: 'formaPagoBanco', tip: '', align: 'right'},
    { id: 29, show: true, name: 'FormaPagoBcoPesSuc', field: 'FormaPagoBcoPesSuc', tip: '', align: 'right'},
    { id: 30, show: true, name: 'TratamientoSuc', field: 'TratamientoSuc', tip: '', align: 'right'  },
    { id: 31, show: true, name: 'NroIIBB', field: 'NroIIBB', tip: '', align: 'right'},
    { id: 32, show: true, name: 'NroCUIT', field: 'NroCUIT', tip: '', align: 'right'},
    { id: 33, show: true, name: 'ExcepIIBB', field: 'ExcepIIBB', tip: '', align: 'right'},
    { id: 34, show: true, name: 'FechaAlta', field: 'FechaAlta', tip: '',filter:'date'},
    { id: 35, show: true, name: 'FechaBaja', field: 'FechaBaja', tip: '',filter:'date'},
    { id: 36, show: true, name: 'CentroAutoriz', field: 'CentroAutoriz', tip: '', align: 'right'},
    { id: 37, show: true, name: 'FormaPagoDol', field: 'FormaPagoDol', tip: ''},
    { id: 38, show: true, name: 'nroCuentaD', field: 'nroCuentaD', tip: '', align: 'right'},
    { id: 39, show: true, name: 'FormaPagoBcoDolEnt', field: 'FormaPagoBcoDolEnt', tip: '', align: 'right'},
    { id: 40, show: true, name: 'FormaPagoBcoDolSuc', field: 'FormaPagoBcoDolSuc', tip: '', align: 'right'},
    { id: 41, show: true, name: 'NvoPlazoPago', field: 'NvoPlazoPago', tip: '', align: 'right'},
    { id: 42, show: true, name: 'VigNvoPlazoPago', field: 'VigNvoPlazoPago', tip: '', align: 'right'},
    { id: 43, show: true, name: 'TipoPlazoPago', field: 'TipoPlazoPago', tip: '', },
    { id: 44, show: true, name: 'NvoTipoPlazoPago', field: 'NvoTipoPlazoPago', tip: '', align: 'right'},
    { id: 45, show: true, name: 'TipoIVA', field: 'TipoIVA', tip: '', align: 'right'},
    { id: 46, show: true, name: 'ExcepIVA', field: 'ExcepIVA', tip: '', align: 'right'},
    { id: 47, show: true, name: 'MarcaMaestro', field: 'MarcaMaestro', tip: '', align: 'right'},
    { id: 48, show: true, name: 'POS', field: 'POS', tip: '', align: 'right'},
    { id: 49, show: true, name: 'OperMayorista', field: 'OperMayorista', tip: ''},
];

var COLUMNS_CABAL=[
    { id: 2, show: true, name: 'NroComercio', field: 'NroComercio', tip: '', align: 'right'},
    { id: 3, show: true, name: 'Capitulo', field: 'Capitulo', tip: '', align: 'right'},
    { id: 4, show: true, name: 'Rubro', field: 'Rubro', tip: '', align: 'right'},
    { id: 5, show: true, name: 'NroAsociacion', field: 'NroAsociacion', tip: '', align: 'right'},
    { id: 6, show: true, name: 'Entidad', field: 'Entidad', tip: '', align: 'right'},
    { id: 7, show: true, name: 'Sucursal', field: 'Sucursal', tip: '', align: 'right'},
    { id: 8, show: true, name: 'Nombre', field: 'Nombre', tip: ''},
    { id: 9, show: true, name: 'RazonSocial', field: 'RazonSocial', tip: ''},
    { id: 10, show: true, name: 'Calle', field: 'Calle', tip: ''},
    { id: 11, show: true, name: 'Nro', field: 'Nro', tip: '', align: 'right'},
    { id: 12, show: true, name: 'Piso', field: 'Piso', tip: ''},
    { id: 13, show: true, name: 'Dpto', field: 'Dpto', tip: ''},
    { id: 14, show: true, name: 'Localidad', field: 'Localidad', tip: ''},
    { id: 15, show: true, name: 'Pcia', field: 'Pcia', tip: ''},
    { id: 16, show: true, name: 'CodPos', field: 'CodPos', tip: ''},
    { id: 17, show: true, name: 'Telefono', field: 'Telefono', tip: ''},
    { id: 18, show: true, name: 'Moneda', field: 'Moneda', tip: ''},
    { id: 19, show: true, name: 'PromotorCabal', field: 'PromotorCabal', tip: '', align: 'right'},
    { id: 20, show: true, name: 'PromotorEnt', field: 'PromotorEnt', tip: '', align: 'right'},
    { id: 21, show: true, name: 'TipoDescuento', field: 'TipoDescuento', tip: ''},
    { id: 22, show: true, name: 'PorcDescuento', field: 'PorcDescuento', tip: '', align: 'right'},
    { id: 23, show: true, name: 'Temporada', field: 'Temporada', tip: ''},
    { id: 24, show: true, name: 'NroCuentaPesTip', field: 'NroCuentaPesTip', tip: '', align: 'right'},
    { id: 25, show: true, name: 'NroCuentaPesBco', field: 'NroCuentaPesBco', tip: '', align: 'right'},
    { id: 26, show: true, name: 'NroCuentaPesSuc', field: 'NroCuentaPesSuc', tip: '', align: 'right'},
    { id: 27, show: true, name: 'NroCuentaPesCta', field: 'NroCuentaPesCta', tip: '', align: 'right'},
    { id: 28, show: true, name: 'NroCuentaDolTip', field: 'NroCuentaDolTip', tip: '', align: 'right'},
    { id: 29, show: true, name: 'NroCuentaDolBco', field: 'NroCuentaDolBco', tip: '', align: 'right'},
    { id: 30, show: true, name: 'NroCuentaDolSuc', field: 'NroCuentaDolSuc', tip: '', align: 'right'},
    { id: 31, show: true, name: 'NroCuentaDolCta', field: 'NroCuentaDolCta', tip: ''},
    { id: 32, show: true, name: 'CondicionPago', field: 'CondicionPago', tip: '', align: 'right'},
    { id: 33, show: true, name: 'TipoAdhesion', field: 'TipoAdhesion', tip: ''},
    { id: 34, show: true, name: 'POS', field: 'POS', tip: '', align: 'right'},
    { id: 35, show: true, name: 'PlanCuotas', field: 'PlanCuotas', tip: ''},
    { id: 36, show: true, name: 'ModalidadVenta', field: 'ModalidadVenta', tip: ''},
    { id: 37, show: true, name: 'FormasLiqui', field: 'FormasLiqui', tip: '', align: 'right'},
    { id: 38, show: true, name: 'SenalRechazo', field: 'SenalRechazo', tip: '', align: 'right'},
    { id: 39, show: true, name: 'SenalPago', field: 'SenalPago', tip: ''},
    { id: 40, show: true, name: 'CausaDesactivacion', field: 'CausaDesactivacion', tip: ''},
    { id: 41, show: true, name: 'SenalComercio', field: 'SenalComercio', tip: ''},
    { id: 42, show: true, name: 'CodigoShopping', field: 'CodigoShopping', tip: '', align: 'right'},
    { id: 43, show: true, name: 'CantTarjShopping', field: 'CantTarjShopping', tip: '', align: 'right'},
    { id: 44, show: true, name: 'MesesExcep', field: 'MesesExcep', tip: '', align: 'right'},
    { id: 45, show: true, name: 'FechaAlta', field: 'FechaAlta', tip: '',filter:'date', align: 'right'},
    { id: 46, show: true, name: 'FechaPraVta', field: 'FechaPraVta', tip: '',filter:'date', align: 'right'},
    { id: 47, show: true, name: 'FechaUltVta', field: 'FechaUltVta', tip: '',filter:'date', align: 'right'},
    { id: 48, show: true, name: 'FechaPraVtaPOS', field: 'FechaPraVtaPOS', tip: '',filter:'date', align: 'right'},
    { id: 49, show: true, name: 'FechaDesactivacion', field: 'FechaDesactivacion', tip: '',filter:'date', align: 'right'},
    { id: 50, show: true, name: 'FechaSenalPago', field: 'FechaSenalPago', tip: '',filter:'date', align: 'right'},
    { id: 51, show: true, name: 'FechaVigLimiteAnt', field: 'FechaVigLimiteAnt', tip: '',filter:'date', align: 'right'},
    { id: 52, show: true, name: 'FechaVigLimiteAct', field: 'FechaVigLimiteAct', tip: '',filter:'date', align: 'right'},
    { id: 53, show: true, name: 'LimiteVtaAct', field: 'LimiteVtaAct', tip: '', align: 'right'},
    { id: 54, show: true, name: 'LimiteVtaAnt', field: 'LimiteVtaAnt', tip: '', align: 'right'},
    { id: 55, show: true, name: 'CantVtaPes', field: 'CantVtaPes', tip: '', align: 'right'},
    { id: 56, show: true, name: 'ImpVtaPes', field: 'ImpVtaPes', tip: '', align: 'right'},
    { id: 57, show: true, name: 'ComVtaPes', field: 'ComVtaPes', tip: '', align: 'right'},
    { id: 58, show: true, name: 'CantVtaDol', field: 'CantVtaDol', tip: '', align: 'right'},
    { id: 59, show: true, name: 'ImpVtaDol', field: 'ImpVtaDol', tip: '', align: 'right'},
    { id: 60, show: true, name: 'ComVtaDol', field: 'ComVtaDol', tip: '', align: 'right'},
    { id: 61, show: true, name: 'CantCuotas', field: 'CantCuotas', tip: '', align: 'right'},
    { id: 62, show: true, name: 'SenalCantCuotas', field: 'SenalCantCuotas', tip: ''},
    { id: 63, show: true, name: 'SenalAutorizar', field: 'SenalAutorizar', tip: '', align: 'right'},
    { id: 64, show: true, name: 'Coeficiente', field: 'Coeficiente', tip: '', align: 'right'},
    { id: 65, show: true, name: 'SenalDisponible', field: 'SenalDisponible', tip: ''},
    { id: 66, show: true, name: 'RazonSocialAcred', field: 'RazonSocialAcred', tip: ''},
    { id: 67, show: true, name: 'NroCtaAcredPes', field: 'NroCtaAcredPes', tip: '', align: 'right'},
    { id: 68, show: true, name: 'NroCtaAcredDol', field: 'NroCtaAcredDol', tip: '', align: 'right'},
    { id: 69, show: true, name: 'CUIT', field: 'CUIT', tip: ''},
    { id: 70, show: true, name: 'NroIIBB', field: 'NroIIBB', tip: ''},
    { id: 71, show: true, name: 'CalleFiscal', field: 'CalleFiscal', tip: ''},
    { id: 72, show: true, name: 'NroFiscal', field: 'NroFiscal', tip: '', align: 'right'},
    { id: 73, show: true, name: 'PisoFiscal', field: 'PisoFiscal', tip: ''},
    { id: 74, show: true, name: 'DptoFiscal', field: 'DptoFiscal', tip: ''},
    { id: 75, show: true, name: 'LocalidadFiscal', field: 'LocalidadFiscal', tip: ''},
    { id: 76, show: true, name: 'PciaFiscal', field: 'PciaFiscal', tip: '', align: 'right'},
    { id: 77, show: true, name: 'CodPosFiscal', field: 'CodPosFiscal', tip: ''},
    { id: 78, show: true, name: 'ExcepRG3337', field: 'ExcepRG3337', tip: '', align: 'right'},
    { id: 79, show: true, name: 'ExcepIIBB', field: 'ExcepIIBB', tip: '', align: 'right'},
    { id: 80, show: true, name: 'TipoIIBB', field: 'TipoIIBB', tip: '', align: 'right'},
    { id: 81, show: true, name: 'EncuadreIIBB', field: 'EncuadreIIBB', tip: '', align: 'right'},
    { id: 82, show: true, name: 'TipoIVA', field: 'TipoIVA', tip: '', align: 'right'},
    { id: 83, show: true, name: 'EncuadreIVA', field: 'EncuadreIVA', tip: '', align: 'right'},
    { id: 84, show: true, name: 'TipoGCIA', field: 'TipoGCIA', tip: '', align: 'right'},
    { id: 85, show: true, name: 'EncuadreGCIA', field: 'EncuadreGCIA', tip: '', align: 'right'},
    { id: 86, show: true, name: 'SenalCabal24', field: 'SenalCabal24', tip: '', align: 'right'},
    { id: 87, show: true, name: 'PlazoPagoCabal24', field: 'PlazoPagoCabal24', tip: '', align: 'right'},
    { id: 88, show: true, name: 'PorcDctoCabal24', field: 'PorcDctoCabal24', tip: '', align: 'right'},

]

var Comercio= (function () {
    function Padrones($scope,$http,$filter) {
        var _this=this;
        this.$scope=$scope;
        this.$http=$http;

        //Padrones de Comercio
        $scope.sucursalPadrones="";
        $scope.VISA="visa";
        $scope.MASTER="master";
        $scope.CABAL="cabal";
        $scope.URL_PADRONES="/api/reportes/padronesComercio/"
        $scope.URL_PADRONES_EXPORTAR="/api/reportes/padronesComercio/exportar"
        $scope.grillaFiltered=false;

        var grilla = {
            filter: {
                options: { debounce: 500 }
            },
            query: {
                filter: {
                    codigo:'',
                    entidad: '',
                    sucursal: null
                },
                limit: 5,
                order: '',
                page: 1,
                where: ''
            },
            count: 0,
        };

        $scope.grilla={};
        $scope.grilla[$scope.VISA]= angular.copy(grilla);
        $scope.grilla[$scope.VISA].columns=COLUMNS_VISA;
        $scope.grilla[$scope.VISA].query.filter.codigo=$scope.VISA;
        $scope.grilla[$scope.VISA].show=false;

        $scope.grilla[$scope.MASTER]=angular.copy(grilla);
        $scope.grilla[$scope.MASTER].columns=COLUMNS_MASTER;
        $scope.grilla[$scope.MASTER].query.filter.codigo=$scope.MASTER;
        $scope.grilla[$scope.MASTER].show=false;

        $scope.grilla[$scope.CABAL]=angular.copy(grilla); //Object.assign({}, grilla)
        $scope.grilla[$scope.CABAL].columns=COLUMNS_CABAL;
        $scope.grilla[$scope.CABAL].query.filter.codigo=$scope.CABAL;
        $scope.grilla[$scope.CABAL].show=false;

        this.sucursalChange=function(param){
            console.log("$scope.sucursalPadrones",this.$scope.sucursalPadrones);
        }
        this.onReorderBase=function(order){
            // console.log("order",order)
            var data=order.split(";");
            $scope.filter=angular.copy($scope.grilla[data[1]].query);
            console.log("order",data[0],data[1])
            $scope.filter.order=data[0];

            console.log("filter",$scope.filter)
            // console.log("order",$scope.grilla[data[1]].query.order)

            _this.HttpGet(_this.$scope.URL_PADRONES,data[1]);
        }

        this.onPaginateBase= function(page, limit,codigo) {
            $scope.grilla[codigo].query.page= page;
            $scope.grilla[codigo].query.limit= limit;
            this.HttpGet(_this.$scope.URL_PADRONES,codigo);
        };
        this.onPaginateVisa = function(page, limit) {
            _this.onPaginateBase(page, limit,$scope.VISA)
        };
        this.onPaginateMaster= function(page, limit) {
            _this.onPaginateBase(page, limit,$scope.MASTER)
        };
        this.onPaginateCabal= function(page, limit) {
            _this.onPaginateBase(page, limit,$scope.CABAL)
        };
        this.exportarAExcelPadrones=function(){
            var exportUrl="";
            if (this.$scope.sucursalPadrones!=null){
                exportUrl=this.$scope.URL_PADRONES_EXPORTAR+"?sucursal="+this.$scope.sucursalPadrones+"&proceso="+$scope.nombreDeProceso;
            }else{
                exportUrl=this.$scope.URL_PADRONES_EXPORTAR+"&proceso="+$scope.nombreDeProceso;
            }
            return exportUrl;
        }
        this.ObtenerPadrones=function(){
        console.log("sucursalPadrones", $scope.sucursalPadrones)
            $scope.filter=undefined;

            if($scope.sucursalPadrones>0)
            {
                this.HttpGet(this.$scope.URL_PADRONES,this.$scope.VISA);
                this.HttpGet(this.$scope.URL_PADRONES,this.$scope.MASTER);
                this.HttpGet(this.$scope.URL_PADRONES,this.$scope.CABAL);
            }
        }
        this.HttpGet=function(url,codigo){

            var _this=this;

            var filtro;
            if(typeof $scope.filter!='undefined'){
                filtro=$scope.filter;
            }else{
                filtro=_this.$scope.grilla[codigo].query;
            }
            $scope.grillaFiltered=true;
            //console.log("filtro -> " ,filtro);// _this.$scope.grilla[codigo].query

            _this.$scope.grilla[codigo].query.filter.sucursal=this.$scope.sucursalPadrones;
            _this.$scope.grilla[codigo].showNoRegister=false;
            _this.$scope.grillaPromise[codigo]=_this.$http({
                url: url,
                method: "GET",
                params: filtro
            }).then(function(res){
                console.log(res.data[0]);
                $scope.grilla[codigo].data=res.data[0];
                if (res.data.length > 1) {
                    _this.$scope.grilla[codigo].count = res.data[1][0].rows;
                }
                _this.$scope.grilla[codigo].showNoRegister=true;
            }, function(error){
                console.log("Res",codigo,error)
            });
        }
    }
    return { Padrones: Padrones}
})()

app.controller('reporteProcesoConvenio.ctrl', function ($scope, Toast, $http, Excel,$filter) {
    $scope.showGrids = true;
    $scope.query = { report: 'Seleccione Reporte' };
    //$scope.query = { report: 'Proceso Convenios' };
    $scope.reports = [ 'Seleccione Reporte', 'Proceso Convenios', 'Rechazos y Acreditaciones', 'Padrones de Comercio' ];
    $scope.creditosGrid = {
        data: [],
        count: 0,
        "query": {
            limit: 100,
            order: 'convenio',
            page: 1
        },
        message: '',
        exportar: () => {
            $scope.creditosGrid.data.length > 0 ?
                exportar('#creditos', 'Créditos') : Toast.showError('Debe haber resultados en la grilla para poder exportar');
        }
    };



    $scope.debitosGrid = {
        "query": {
            limit: 100,
            order: 'convenio',
            page: 1
        },
        data: [],
        count: 0,
        message: '',
        exportar: function () {
            $scope.debitosGrid.data.length > 0 ?
                exportar('#debitos', 'Débitos') : Toast.showError('Debe haber resultados en la grilla para poder exportar');
        }
    };

    $scope.rechazosGrid = {
        query: {
            limit: 10,
            page: 1,
            order: 'convenio'
        },
        data: [],
        count: 1
    };

    $scope.liquidacionesGrid = {
        query: {
            limit: 10,
            page: 1,
            order: 'marca'
        },
        data: [],
        count: 1
    };

    $scope.procesadosRechazadosGrid = {
        query: {
            limit: 10,
            page: 1,
            order: 'nroConvenio',
            exportarWord: function () {
                if ($scope.procesadosRechazadosGrid.count === 0) {
                    Toast.showError('Debe haber resultados en la grilla para poder exportar');
                    return;
                }
                debugger;
                $scope.promiseRechDetalle = $http({
                    url: '/api/reportes/rechazosTotalesRTF',
                    method: 'GET',
                    params: {
                        title: 'Rechazos de Acreditación a Comercios',
                        subtitle: 'Totales Procesados y Rechazados',
                        fecProceso: $scope.procesadosRechazadosGrid.data.filter(e => e.fecProceso !== null)[0].fecProceso,
                        datosGrid: $scope.procesadosRechazadosGrid.data
                    }
                })
                .then(function (data) {
                    let anchor = angular.element('<a/>');
                    let rtfData = new Blob([data.data], { type: 'text/richtext' });
                    let rtfUrl = URL.createObjectURL(rtfData);
                    anchor.attr({
                        href: rtfUrl,
                        target: '_blank',
                        download: 'Totales.rtf'
                    })[0].click();
                })
                .catch(function (err) {
                    console.log(err);
                    Toast.showError(err.data.message);
                });
            }
        },
        data: [],
        count: 1
    };

    $scope.detalleRechazadosGrid = {
        query: {
            cuenta: null,
            fecProceso: null,
            limit: 10,
            page: 1,
            order: 'convenio',
            onPaginate: function (page, limit) {
                $scope.detalleRechazadosGrid.query.page = page;
                $scope.detalleRechazadosGrid.query.limit = limit;
                loadRechazosProcesadosDetalle($scope.detalleRechazadosGrid.query);
            },
            onReorder: function (order) {
                loadRechazosProcesadosDetalle(angular.extend($scope.detalleRechazadosGrid.query, { order: order }));
            },
            exportarExcel: function () {
                if ($scope.detalleRechazadosGrid.count === 0) {
                    Toast.showError('Debe haber resultados en la grilla para poder exportar');
                    return;
                }
                $scope.promiseRechDetalle = $http({
                    url: '/api/reportes/rechazosDetalleCSV',
                    method: 'GET',
                    params: {
                        cuenta: $scope.detalleRechazadosGrid.query.cuenta,
                        fecProceso: $scope.detalleRechazadosGrid.query.fecProceso,
                        sort: $scope.detalleRechazadosGrid.query.order
                    }
                })
                .then(function (data) {
                    var anchor = angular.element('<a/>');
                    var csvData = new Blob([data.data], { type: 'text/csv' });
                    var csvUrl = URL.createObjectURL(csvData);
                    anchor.attr({
                        href: csvUrl,
                        target: '_blank',
                        download: 'rechazosDetalle.csv'
                    })[0].click();
                })
                .catch(function (err) {
                    Toast.showError(err.data.message);
                });
            }
        },
        filter: {
            filterApplied: false,
            loaded: true,
            apply: aplicarFiltroProcesados
        },
        data: [],
        count: 0
    };
    $scope.grillaPromise={};
    $scope.load = function () {
        switch ($scope.query.report) {
            case 'Proceso Convenios':
                loadProcesoConvenios();
                break;
            case 'Rechazos y Acreditaciones':
                loadRechazosAcreditaciones();
                break;
            case 'Padrones de Comercio':

                $scope.comercio_padrones=new Comercio.Padrones($scope,$http,$filter);
                $scope.comercio_padrones.ObtenerPadrones();
                $scope.nombreDeProceso="Padrones de Comercio";
                break;
        }
    };

    function loadProcesoConvenios() {
        $scope.promiseCreditos = $http.get('/api/reportes/procesoConvenio').then(function (data) {
            $scope.creditosGrid.data = data.data[0];
            $scope.creditosGrid.count = $scope.creditosGrid.data.length;
            $scope.debitosGrid.data = data.data[1];
            $scope.debitosGrid.count = $scope.debitosGrid.data.length;
            $scope.creditosGrid.cantidad = data.data[2][0].cantidadCredito;
            $scope.creditosGrid.importe = data.data[2][0].importeCredito;
            $scope.debitosGrid.cantidad = data.data[2][0].cantidadDebito;
            $scope.debitosGrid.importe = data.data[2][0].importeDebito;
            $scope.creditosGrid.message = "TOTAL NETO: " + $scope.showVal(data.data[2][0].total, 'number');
            $scope.debitosGrid.message = $scope.creditosGrid.message;

            if ($scope.creditosGrid.count === 0 && $scope.debitosGrid.count === 0) {
                $scope.showGrids = false;
            } else {
                $scope.showGrids = true;
            }
        })
        .catch(function (err) {
            Toast.showError(err.data.message);
        });

        $scope.promiseDebitos = $scope.promiseCreditos;
    }

    function loadRechazosAcreditaciones() {
        $scope.promiseTotalRechazos = $http.get('/api/reportes/rechazosConvenio').then(function (data) {
            $scope.rechazosGrid.data = data.data[0];
            $scope.rechazosGrid.count = $scope.rechazosGrid.data.length;
        })
        .catch(function (err) {
            Toast.showError(err.data.message);
        });

        $scope.promiseTotalLiquidaciones = $http.get('/api/reportes/rechazosLiquidacion').then(function (data) {
            $scope.liquidacionesGrid.data = data.data[0];
            $scope.liquidacionesGrid.count = $scope.liquidacionesGrid.data.filter(x => x.cant > 0).length;
        })
        .catch(function (err) {
            Toast.showError(err.data.message);
        });

        $scope.promiseTotalProcesados = $http.get('/api/reportes/rechazosProcesadosLiquidaciones').then(function (data) {
            $scope.procesadosRechazadosGrid.data = data.data[0];
            $scope.procesadosRechazadosGrid.count = $scope.procesadosRechazadosGrid.data.length;
        })
        .catch(function (err) {
            Toast.showError(err.data.message);
        });

    }

    function loadRechazosProcesadosDetalle(query) {
        if ($scope.filtrado) {
            $scope.loaded = false;

            $scope.promiseRechDetalle = $http({
                url: '/api/reportes/rechazosDetalle',
                method: 'GET',
                params: query
            })
            .then(function (data) {
                $scope.loaded = true;
                $scope.detalleRechazadosGrid.data = data.data[0];
                if (data.data.length > 1) {
                    $scope.detalleRechazadosGrid.count = data.data[1][0].rows;
                }
            })
            .catch(function (err) {
                Toast.showError(err.data.message);
            });
        }
    }

    function exportar(table, spreadsheetName) {
        Excel.tableToExcel([table], spreadsheetName);
    }

    function aplicarFiltroProcesados() {
        if ($scope.detalleRechazadosGrid.query.cuenta === null && $scope.detalleRechazadosGrid.query.fecProceso === null) {
            $scope.filtrado = false;
        } else {
            $scope.filtrado = true;
        }

        if (!$scope.filtrado) {
            $scope.detalleRechazadosGrid.filter.filterApplied = false;
            return;
        }
        loadRechazosProcesadosDetalle(angular.extend($scope.detalleRechazadosGrid.query, { page: 1}));
        $scope.detalleRechazadosGrid.filter.filterApplied = true;
    }

    $scope.$watch('detalleRechazadosGrid.query', function (newValue, oldValue) {
        if (newValue.cuenta !== oldValue.cuenta || ( newValue.fecProceso != null
                                                    && oldValue.fecProceso != null
                                                    && newValue.fecProceso.getTime() !== oldValue.fecProceso.getTime())) {
            $scope.filtrado = false;
        }
    }, true);

    $scope.showVal = function(value, filter) {

        if (filter == 'date') {

            if(value!=null){
                if(value.indexOf("/") >= 1) {
                    return value;
                } else {
                    var fecha=value.replace("Z"," ").replace("T"," ");
                    return $filter('date')(new Date(fecha), 'dd/MM/yyyy')
                }
            } else{
                return value
            }
        }
        if (filter == 'number') {
            return ((value) ? ($filter('number')(value, 2).replace(',', ';').replace(/\./g, ',').replace(';','.')) : value);

        }
        if (filter == 'coef') {
            return $filter('number')(value, 4);
        }
        return value;

    };

    // $scope.load();
});



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