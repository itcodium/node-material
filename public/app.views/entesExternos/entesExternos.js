const GRILLA_ENTES_EXTERNOS= [
    { name: 'Ente', show: true,  field: 'ente', filter:"", align: 'left'},
    { name: 'Fec Generación', show: true,  field: 'fecGeneracion', filter: "date", tip: '', align: 'right'},
    { name: 'Cant', show: true,  field: 'Cant', filter:"", tip: '', align: 'right'},
    { name: 'Total Cobrado', show: true,  field: 'totalCobrado', filter: "number", tip: '', align: 'right'},
    { name: 'Total Comisión', show: true,  field: 'totalComision', filter: "number", tip: '', align: 'right'},
    { name: 'IVA', show: true,  field: 'IVA', filter: "number", tip: '', align: 'right'},
];

const GRILLA_AJUSTES= [
    { name: 'Ente', show: true,  field: 'ente', filter: '', align: 'left'},
    { name: 'Ent', show: true,  field: 'entidad', filter: '', align: 'right'},
    { name: 'Nombre', show: true,  field: 'nombre', filter: '', align: 'right'},
    { name: 'FecGeneracion', show: true,  field: 'fecGeneracion', filter: 'date', tip: '', align: 'right'},
    { name: 'Cant', show: true,  field: 'Cant', filter: '', tip: '', align: 'right'},
    { name: 'TotalCobrado',show: true,  field: 'totalCobrado', filter: 'number', tip: '', align: 'right'}
];


app.controller('entesExternos.ctrl',
    function ($scope,$http,Toast,$resource,$filter,Global,$mdDialog, EntesExternosService ) {

        $scope.toolbarComisiones = {
            show_filter: true,
            show_download: true,
            show_caratula: true,
            titulo: 'Grilla de comisiones',
            form: 'entesExternosFilterForm.tmpl.html',
            entes: [{entes:'667',descripcion:'667'},{entes:'067',descripcion:'067'}],
            query: {},
            periodos: {},
            RANGO_FECHAS_NO_VALIDO: "El rango de fechas seleccionado no debe superar los 31 dias.",
           exportar: function(){
               var _this = this;
               const fechaDesde = moment(_this.query.fechaDesde).format('YYYY-MM-DD');
               const fechaHasta = moment(_this.query.fechaHasta).format('YYYY-MM-DD');
                var exportUrl="";
                exportUrl= '/api/entesExternos/archivo?esComision=1&';
                if (_this.filtrado)
                    exportUrl+= `fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
                return exportUrl;
             },
             generarCaratula: () => {
                var _this = this;

                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'entesExternos.caratulas.ctrl',
                    templateUrl: 'app.views/entesExternos/entesExternos.caratulas/entesExternos.caratulas.html',
                    fullscreen: true,
                    parent: document.querySelector('#dialogEntes'),
                    locals: {
                        registros: $scope.grillaEntExternos.data
                    }
                }).then(function () {
                    Toast.showSuccess('La operación se realizó correctamente');
                });
             },
            onFilter: function(form){
                let isValid = validarRango(form.fechaDesde.$viewValue, form.fechaHasta.$viewValue, 31);

                if (form.$valid && isValid) {
                    $scope.toolbarComisiones.filtrado = true;
                    this.filter();
                } else {
                    if (!isValid) Toast.showError('El rango de fechas no puede ser mayor a 31 días');
                }
            },
            filter: function(){
                EntesExternosService.obtenerEntesExternos(1,this.query.fechaDesde, this.query.fechaHasta)
                    .then(res => {
                        const comisiones = res.data[0].map(x => {
                            x.fecGeneracion = x.fecGeneracion.replace('Z','');
                            return x;
                        });

                        $scope.grillaEntExternos.OriginalData = comisiones;
                        $scope.grillaEntExternos.data = comisiones;
                        if ($scope.grillaEntExternos.config.dataFootTable)
                            $scope.grillaEntExternos.footData = res.data[$scope.grillaEntExternos.config.dataFootTable];
                    });
            }
        };

        $scope.toolbarAjustes = {
            titulo: "Ajustes",
            form: "entesExternosFilterForm2.tmpl.html",
            entes: [{entes:"667",descripcion:"667"},{entes:"067",descripcion:"067"}],
            query: {},
            show_filter: true,
            show_download: true,
            show_mail: true,
            tooltipMail: 'Generar Ajustes + Mail',
            periodos: {},
            RANGO_FECHAS_NO_VALIDO: "El rango de fechas seleccionado no debe superar los 31 dias.",
            exportar: function(){
                var _this = this;
                const fechaDesde = moment(_this.query.fechaDesde).format('YYYY-MM-DD');
                const fechaHasta = moment(_this.query.fechaHasta).format('YYYY-MM-DD');
                 var exportUrl="";
                 exportUrl= '/api/entesExternos/archivo?esComision=0&';
                 if (_this.filtrado)
                     exportUrl+= `fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`;
                 return exportUrl;
            },
            onFilter: function(form){
                let isValid = validarRango(form.fechaDesde.$viewValue, form.fechaHasta.$viewValue, 31);

                if(form.$valid && isValid) {
                    $scope.toolbarAjustes.filtrado = true;
                    this.filter();
                } else {
                    if (!isValid) Toast.showError('El rango de fechas no puede ser mayor a 31 días');
                }
            },
            filter: function(){
                EntesExternosService.obtenerEntesExternos(0,this.query.fechaDesde, this.query.fechaHasta)
                .then(res => {
                    const ajustes = res.data[0].map(x => {
                        x.fecGeneracion = x.fecGeneracion.replace('Z','');
                        return x;
                    });

                    $scope.grillaAjustes.OriginalData = ajustes;
                    $scope.grillaAjustes.data = ajustes;
                    if ($scope.grillaAjustes.config.dataFootTable)
                        $scope.grillaAjustes.footData = res.data[$scope.grillaAjustes.config.dataFootTable];
                });
            },
            mail_generar: function() {
                var _this = this;

                if ($scope.grillaAjustes.data.length) {
                    const fechaDesde = _this.filtrado? moment(_this.query.fechaDesde).format('YYYY-MM-DD') : null;
                    const fechaHasta = _this.filtrado? moment(_this.query.fechaHasta).format('YYYY-MM-DD') : null;
    
                    EntesExternosService.generarMail(fechaDesde, fechaHasta)
                        .then((res)=>{ 
                            var anchor = angular.element('<a/>');
                            var txtData = new Blob([res.data.data], { type: 'text/plain' });
                            var txtUrl = URL.createObjectURL(txtData);
                            anchor.attr({
                                href: txtUrl,
                                target: '_blank',
                                download: res.data.name
                            })[0].click();
                        });
                } else {
                    Toast.showError('No existen datos a generar para el período');
                }
            }
        };

        $scope.grillaEntExternos=new Componentes.Grilla($http,$filter,Toast);
        $scope.grillaEntExternos.config.url="/api/entesExternos?esComision=1";
        $scope.grillaEntExternos.config.columns=GRILLA_ENTES_EXTERNOS;
        $scope.grillaEntExternos.config.query.limit=30;
        $scope.grillaEntExternos.data=[];
        $scope.grillaEntExternos.config.dataFootTable=1;
        $scope.grillaEntExternos.config.hideComboPagina=true;
        $scope.grillaEntExternos.config.orderByBD=false;
        $scope.grillaEntExternos.HttpGet((data)=> {
            const comisiones = data.data[0].map(x => {
                x.fecGeneracion = x.fecGeneracion.replace('Z','');
                return x;
            });
            $scope.toolbarComisiones.query.fechaDesde = moment.min(comisiones.map(x => moment(x.fecGeneracion))).toDate();
            $scope.toolbarComisiones.query.fechaHasta = moment.max(comisiones.map(x => moment(x.fecGeneracion))).toDate();
            $scope.grillaEntExternos.OriginalData = comisiones;
            $scope.grillaEntExternos.data = comisiones;
            if ($scope.grillaEntExternos.config.dataFootTable)
                $scope.grillaEntExternos.footData = data.data[$scope.grillaEntExternos.config.dataFootTable];
        });

        $scope.grillaAjustes = new Componentes.Grilla($http,$filter,Toast);
        $scope.grillaAjustes.config.url="/api/entesExternos?esComision=0";
        $scope.grillaAjustes.config.columns=GRILLA_AJUSTES;
        $scope.grillaAjustes.config.query.limit=30;
        $scope.grillaAjustes.data=[];
        $scope.grillaAjustes.config.dataFootTable=1;
        $scope.grillaAjustes.config.hideComboPagina=true;
        $scope.grillaAjustes.config.orderByBD=false;
        $scope.grillaAjustes.HttpGet((data)=> {
            const ajustes = data.data[0].map(x => {
                x.fecGeneracion = x.fecGeneracion.replace('Z','');
                return x;
            });

            $scope.toolbarAjustes.query.fechaDesde = moment.min(ajustes.map(x => moment(x.fecGeneracion))).toDate();
            $scope.toolbarAjustes.query.fechaHasta = moment.max(ajustes.map(x => moment(x.fecGeneracion))).toDate();
            $scope.grillaAjustes.OriginalData = ajustes;
            $scope.grillaAjustes.data = ajustes;
            if ($scope.grillaAjustes.config.dataFootTable)
                $scope.grillaAjustes.footData = data.data[$scope.grillaAjustes.config.dataFootTable];
        });


        ////////////////////////////////////////////////////

        function validarRango(fechaDesde, fechaHasta, cantDias) {
            const fecDesde = moment(fechaDesde);
            const fecHasta = moment(fechaHasta);

            return fecHasta.diff(fecDesde, 'days') <= cantDias;
        }
    });


