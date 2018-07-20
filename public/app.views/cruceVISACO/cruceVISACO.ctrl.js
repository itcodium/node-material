(function () {
    'use strict';

    angular
        .module('app')
        .controller('cruceVISACO.ctrl', cruceVISACOCtrl);

    function cruceVISACOCtrl($scope, cruceVISACOService, Toast, $locale) {
        //Seteo coma como separador de mil y . como separador de decimal
        $locale.NUMBER_FORMATS.GROUP_SEP = ',';
        $locale.NUMBER_FORMATS.DECIMAL_SEP = '.';

        $scope.onFilter = onFilter;
        $scope.exportarExcel = exportarExcel;
        $scope.exportarPDF = exportarPDF;
        $scope.enviarMail = enviarMail;
        activate();

        // formatNumber: es una funcion que se encuentra en public\app\componentes\componentes.js
        $scope.formatNumber=formatNumber;
        // {{formatNumber(row.TotalSO,',','.') }}

        /////////////////////////////////////////

        function activate() {
            $scope.totEstVISACOGrid = initGrid();
            $scope.totReclamosVISAGrid = initGrid();
            $scope.totVisaAsociadosGrid = initGrid();
            $scope.totCambioEstadoGrid = initGrid();
            $scope.detalleGrid = initGrid();
            $scope.filters = {};
            loadTipos();
            Promise.all([loadMonedas(), getLastFecProceso()]).then(() => {
                loadGrids($scope.filters)
            });
        }

        /**
         * Devuelve object model de grilla
         * @returns {{data: Array, count: number, selected: Array, query: {limit: number, page: number}, message: string}}
         */
        function initGrid() {
            return {
                data: [],
                count: 1,
                selected: [],
                "query": {
                    limit: 5,
                    page: 1
                },
                message: '',
                filtered: false,
                filter: {}
            };
        }

        function loadGrids(filters) {
            obtenerTotVISACO(filters);
            obtenerTotReclamosVISA(filters);
            obtenerTotVISAAsociados(filters);
            obtenerTotCambioEstado(filters);
            obtenerVisaDetalles(filters);
        }

        function loadTipos() {
            $scope.tipos = [{
                    codigo: 'tot',
                    descripcion: 'Totales'
                },
                {
                    codigo: 'det',
                    descripcion: 'Detalle'
                }
            ];
            $scope.vistaTotales = true;
            $scope.filters.tipo = $scope.tipos[0].codigo;
        }

        /*
         * Obtiene los datos para cargar la grilla de Totales VISACO
         */
        function obtenerTotVISACO(filters) {
            $scope.promiseEstVISACO = cruceVISACOService
                .obtenerTotVISACO(filters)
                .then(res => {
                    $scope.totEstVISACOGrid.data = res;
                    $scope.totEstVISACOGrid.totImporte = res.reduce((ant, act) => ant + act.sumImporte, 0);
                    $scope.totEstVISACOGrid.totCant = res.reduce((ant, act) => ant + parseInt(act.cant), 0);
                    $scope.totEstVISACOGrid.count = res.length;
                })
                .catch(err => Toast.showError(err, 'Error'));
        }

        /*
         * Obtiene los datos para cargar la grilla de Totales VISACO
         */
        function obtenerTotReclamosVISA(filters) {
            $scope.promiseTotReclamosVISA = cruceVISACOService
                .obtenerTotReclamosVISA(filters)
                .then(res => {
                    $scope.totReclamosVISAGrid.data = res;
                    $scope.totReclamosVISAGrid.totImporte = res.reduce((ant, act) => ant + act.impReclamo, 0);
                    $scope.totReclamosVISAGrid.totCant = res.reduce((ant, act) => ant + parseInt(act.cantidad), 0);
                    $scope.totReclamosVISAGrid.count = res.length;
                })
                .catch(err => Toast.showError(err, 'Error'));
        }

        /*
         * Obtiene los datos para cargar la grilla de Totales VISACO
         */
        function obtenerTotVISAAsociados(filters) {
            $scope.promiseTotVISAAsociados = cruceVISACOService
                .obtenerTotVisaAsociados(filters)
                .then(res => {
                    $scope.totVisaAsociadosGrid.data = res;
                    $scope.totVisaAsociadosGrid.count = res.length;
                })
                .catch(err => Toast.showError(err, 'Error'));
        }

        function obtenerTotCambioEstado(filters) {
            $scope.promiseCambioEstado = cruceVISACOService
                .obtenerTotCambioEstado(filters)
                .then(res => {
                    $scope.totCambioEstadoGrid.data = res;
                    $scope.totCambioEstadoGrid.count = res.length;
                })
                .catch(err => Toast.showError(err, 'Error'));
        }

        function obtenerVisaDetalles(filters) {
            $scope.promiseDetalle = cruceVISACOService
                .obtenerDetalle(filters)
                .then(res => {
                    $scope.detalleGrid.data = res;
                    $scope.detalleGrid.count = res.length;
                })
                .catch(err => Toast.showError(err, 'Error'));
        }

        function loadMonedas() {
            return new Promise((resolve, reject) => {
                cruceVISACOService.obtenerMonedas()
                    .then(res => {
                        $scope.monedas = res;
                        $scope.filters.moneda = $scope.monedas.length > 0? $scope.monedas[0].Moneda: null;
                        resolve();
                    }).catch(err => {
                        Toast.showError(err);
                    });
            })
        }

        function getLastFecProceso() {
            return new Promise((resolve, reject) => {
                cruceVISACOService.obtenerUltimaFechaProceso()
                    .then(fecProceso => {
                        $scope.filters.fecProceso = moment(fecProceso).toDate();
                        resolve();
                    });
            })
        }

        function onFilter() {
            const vm = this;
            loadGrids(vm.filters);
        }

        function exportarExcel() {

            cruceVISACOService.exportarExcel($scope.filters)
                .then(res => {
                    const blob = new Blob([res.data], {
                        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    });
                    const fileName = `Cruce_Visaco_${$scope.filters.moneda == 32? 'Pesos' : 'Dolares'}_${moment($scope.filters.fecProceso).format('YYYYMMDD')}`;
                    saveAs(blob, fileName);
                })
                .catch(err => Toast.showError(err));
        }

        function exportarPDF() {
            const vm = this;
            const columns = [{
                    title: 'Nro.Usuario',
                    dataKey: 'NroUsuario'
                },
                {
                    title: 'Reclamo',
                    dataKey: 'Reclamo'
                },
                {
                    title: 'Tarjeta',
                    dataKey: 'Tarjeta'
                },
                {
                    title: 'Nombre',
                    dataKey: 'Nombre'
                },
                {
                    title: 'Cupón',
                    dataKey: 'Cupon'
                },
                {
                    title: 'Mon',
                    dataKey: 'Mon'
                },
                {
                    title: 'Importe',
                    dataKey: 'Importe'
                },
                {
                    title: 'Est.SO',
                    dataKey: 'EstSO'
                },
                {
                    title: 'Est.Visa',
                    dataKey: 'EstVISA'
                }
            ];

            cruceVISACOService.obtenerTotalesDetalle($scope.filters)
                .then(res => {
                    let rows = [];
                    res.data[0].forEach(element => {
                        if (element.NroUsuario)
                            rows.push({
                                'NroUsuario': element.NroUsuario,
                                'Reclamo': element.Reclamo,
                                'Tarjeta': element.Tarjeta,
                                'Nombre': element.Nombre,
                                'Cupon': element.Cupon,
                                'Mon': element.Mon,
                                'Importe': formatNumber(element.Importe,',','.'),
                                'EstSO': element.Estado,
                                'EstVISA': element.EstVISA
                            });
                    });

                    // Only pt supported (not mm or in)
                    var doc = new jsPDF('p', 'pt');
                    var totalPagesExp = '{total_pages_count_string}';
                    doc.autoTable(columns, rows, {
                        theme: 'striped',
                        styles: {
                            fontSize: 8,
                        },
                        columnStyles:{
                            'NroUsuario': {halign:'right'},
                            'Reclamo': {halign:'right'},
                            'Cupon': {halign:'right'},
                            'Mon': {halign:'right'},
                            'Importe': {halign:'right'}
                        },
                        margin: { top: 60, left: 15, right: 15 },
                        addPageContent: function (data) {
                            doc.setTextColor(34,128,165);
                            doc.setFont("times");
                            doc.text("Reclamos Smart Open", 20, 40);
                            doc.setFontSize(10);
                            doc.text(moment().format('DD/MM/YYYY'), 500, 35);
                            doc.text(moment().format('HH:mm'), 523, 45);

                            // FOOTER
                            var str = 'Página ' + data.pageCount;
                            // Total page number plugin only available in jspdf v1.0+
                            if (typeof doc.putTotalPages === 'function') {
                                str = str + ' de ' + totalPagesExp;
                            }

                            doc.setFontSize(10);
                            doc.text(str, 500, doc.internal.pageSize.height - 20);
                        }
                    });
                    
                    if (typeof doc.putTotalPages === 'function') {
                        doc.putTotalPages(totalPagesExp);
                    }

                    let fileName = `Cruce_Visaco_diferencias_${$scope.filters.moneda == 32? 'Pesos' : 'Dolares'}_${moment(new Date()).format('YYYYMMDD')}.pdf`
                    doc.save(fileName);
                })
        }

        function enviarMail() {
            var _this = this;

            cruceVISACOService.enviarMail($scope.filters)
                .then((res)=>{ 
                    Toast.showSuccess('Mail enviado correctamente');
                })
                .catch(err => {
                    Toast.showError(err);
                });
        }
    }
})();