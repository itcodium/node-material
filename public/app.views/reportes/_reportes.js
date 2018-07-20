
app.controller('reporteTC.ctrl', function ($scope, $resource, $filter, $http, $mdSidenav) {
    $scope.date = new Date();
    $scope.show = {totales : true , filter: false };
    $scope.columns = [
        { id: 0, show: true,  name: 'Tarjeta',    field: 'tarjeta',		                          tip: 'Tarjeta'          	    },
        { id: 1, show: true,  name: 'Entidad',    field: 'entidad',                               tip: 'Entidad'			    },
        { id: 2, show: true,  name: 'Sucursal',   field: 'suc',			                          tip: 'Sucursal'               },
        { id: 3, show: true,  name: 'Cuenta',     field: 'nroCuenta',                             tip: 'Cuenta TC'              },
        { id: 4, show: true,  name: 'Socio',      field: 'tipoSocio',                             tip: 'Tipo Socio'             },
        { id: 5, show: true,  name: 'DV',		  field: 'digitoVerific',                         tip: 'Digito Verificador'     },
        { id: 6, show: true,  name: 'Nombre',     field: 'apellidoNombre',                        tip: 'Apellido y Nombre de la Cuenta'},
        { id: 7, show: true,  name: 'TipoDoc',    field: 'tipDoc',                                tip: 'Tipo de Documento'      },
        { id: 8, show: true,  name: 'NumDoc',     field: 'numDoc',                                tip: 'Nro. de Documento'      },
        { id: 9, show: true,  name: 'Grupo CC',   field: 'grupoCC',                               tip: 'Grupo o Cartera'        },
        { id: 10, show: true, name: 'CUIT',       field: 'cuit',                                  tip: 'CUIT'                   },
        { id: 11, show: true, name: 'F.Alta',     field: 'fecAlta',       filter: "date",         tip: 'Fecha Alta de la Cuenta'},
        { id: 12, show: true, name: 'F.Vto',      field: 'fecVtoTar',              tip: 'Fecha Vcto de la Tarjeta'},
        { id: 13, show: true, name: 'Estado',     field: 'estCuenta',                             tip: 'Estado de la Cuenta'    },
        { id: 14, show: true, name: 'F.NOEmis',   field: 'fecNoEmisRes',           tip: 'Fecha No Emision de Resumen'},
        { id: 15, show: true, name: 'GAF',        field: 'gaf',                                   tip: 'Grupo Afinidad'         },
        { id: 16, show: true, name: 'ModLiq',     field: 'modLiq',                                tip: 'Modelo de Liquidacion'  },
        { id: 17, show: true, name: 'SMT',        field: 'smt',                                   tip: 'SubModelo Liquidación Tasas'},
        { id: 18, show: true, name: 'SMG',        field: 'smg',                                   tip: 'SubModelo Liquidación Gastos'},
        { id: 19, show: true, name: 'SMP',        field: 'smp',                                   tip: 'SubModelo Liquidación Parametros'},
        { id: 20, show: true, name: 'SegVida',    field: 'cod_SV',                                tip: 'Seguro de Vida'         },
        { id: 21, show: true, name: 'FormaPago',  field: 'formaPago',                             tip: 'Forma de Pago de la Cuenta'},
        { id: 22, show: true, name: 'CambioSuc',  field: 'cambioSuc',                             tip: 'Cambio de Sucursal de Radicación'},
        { id: 23, show: true, name: 'Producto',   field: 'prod',                                  tip: 'Codigo de Producto'     },
        { id: 24, show: true, name: 'TipoIva',    field: 'tipIva',                                tip: 'Tipo de IVA de la Cuenta'},
        { id: 25, show: true, name: 'Saldo ARS',  field: 'saldoPes',      filter: "number",       tip: 'Saldo $ Ult. Liquidación'},
        { id: 26, show: true, name: 'Saldo USD',  field: 'saldoDol',      filter: "number",       tip: 'Saldo U$S Ult. Liquidación'},
        { id: 27, show: true, name: 'LC Coef',    field: 'lcCoef',                 tip: 'Coeficiente Limite de Compra'},
        { id: 28, show: true, name: 'LC Importe', field: 'lcImporte',     filter: "number",       tip: 'Valor en $ Limite de Compra'},
        { id: 29, show: true, name: 'Empresa',    field: 'ctaEmpresa',                            tip: 'Indicador de Cuenta Empresa' }
    ];

    //tamaños:
    $scope.columns[10].width = '85px';  //cuit
    $scope.columns[6].width = '185px'; //nombre

    $scope.grilla = {
        filter: {
            options: { debounce: 500 }
        },
        query: {
            filter: "tarjeta='AX'",
            limit: 10,
            order: 'tarjeta',
            page: 1
        },
        data: [],
        count: 0
    };

    $scope.archivos = [];

    $scope.showVal = function(value, filter) {

        if (filter == 'date') {
            return $filter('date')(new Date(value),'dd/MM/yyyy')
        }
        if (filter == 'number') {
            return $filter('number')(value, 2);
        }
        if (filter == 'coef') {
            return $filter('number')(value, 4);
        }
        return value;
    };

    $scope.load = function (query) {
        $scope.promiseObj = $resource('/api/reportes/reporteTC', {param: 1}).query(query || $scope.grilla.query, bien, mal ).$promise;

        function bien(obj) {
            console.log(obj);

            $scope.chip.selectBuffer = false;

            $scope.grilla.data = obj[0];
            if (obj.length > 1) {
                $scope.grilla.count = obj[1][0].rows;
                //$scope.grilla.totales = obj[1][0];
                $scope.grilla.totales = obj[1][0].saldoPes == null
                                       ?     'No se encontraron datos '
                                       :     'Saldo ARS: ' + $filter('number')(obj[1][0].saldoPes, 2)  +
                                                '\n' +
                                                '... Saldo USD: '  + $filter('number')(obj[1][0].saldoDol, 2);

                $scope.promiseObj = $resource('/api/reportes/archivosPadronUnificado', {}).query(function (data) {
                    $scope.archivos = data;
                }, function (err) {
                    alert('Se produjo error: ' + err.data.name + ': ' +  err.data.message)
                }).$promise;
            }
        }

        function mal(obj) {
            //console.log('bad, very bad', obj);
            alert('Se produjo error: ' + obj.data.name + ': ' +  obj.data.message)
        }
    };

    $scope.onPaginate = function(page, limit) {
        $scope.load(angular.extend($scope.grilla.query, {page: page, limit: limit}));
    };

    $scope.onReorder = function(order) {
        console.log("order -> ",order)
        $scope.load(angular.extend($scope.grilla.query, {order: order}));
    };

    $scope.onFilter = function() {
        var where = '';
        console.log($scope.chip.selectedItems);

        for (var key in $scope.chip.selectedItems) {
            where += (key == 0 ? '' : ' and ') + $scope.chip.selectedItems[key];
        }
        console.log(where);
        $scope.load(angular.extend($scope.grilla.query, {filter: where, page: 1}));
    };

    $scope.exportarExcel = function () {
        $scope.promiseObj = $http({method: 'GET', url: '/api/reportes/archivo/' +
                                                    $scope.grilla.query.filter + '/' +
                                                    $scope.grilla.query.order}).
        success(function(data, status, headers, config) {

            var anchor = angular.element('<a/>');
            var csvData = new Blob([data], { type: 'text/csv' });
            var csvUrl = URL.createObjectURL(csvData);
            anchor.attr({
                href: csvUrl,
                target: '_blank',
                download: 'queryPadron.csv'
            })[0].click();

        }).
        error(function(data, status, headers, config) {
            alert('Se produjo error al extraer el archivo' )
        });
   };

    $scope.chip = function () {
        var self = {};
        self.selectedItem = null;
        self.selecBuffer = false;
        self.searchText = null;
        self.querySearch = querySearch;
        self.items = loadItems();
        self.selectedItems = ["tarjeta='AX'"];
        self.transformChip = transformChip;
        self.remove = sacamarca;
        self.error = '';
        return self;

        function transformChip(chip, txt, elem) {
            elem.$error.chip = false;
            var field = txt.substring(0, txt.indexOf(' ')>0  ? txt.indexOf(' ')
                : txt.indexOf('=')>0 ? txt.indexOf('=')
                : txt.indexOf('<')>0 ? txt.indexOf('<')
                : txt.indexOf('>')>0 ? txt.indexOf('>')
                : txt.indexOf('like')>0 ? txt.indexOf('like')
                : txt.indexOf('between')>0 ? txt.indexOf('between')
                : txt.indexOf(' in ') > 0 ? txt.indexOf(' in ')
                : 100 );

            console.log(field)
            console.log(self.items.filter(createFilterFor(field)));
            console.log($filter('filter')(self.items, {field: field}));

            if ($filter('filter')(self.items, {field: field}).length < 1) {
                this.error = 'No se reconoce el nombre de campo ' +  field;
                elem.$error.chip = true;
            }

            if (field !== 'suc' && field !== 'gaf' && field !== 'modLiq' && txt.indexOf(' in ') > 0 ) {
                this.error = 'Sólo los campos Sucursal, GAF y ModeloLiquidación permiten el operador IN';
                elem.$error.chip = true;
            }

            if  (txt.indexOf('=') == -1 && txt.indexOf('>') == -1
                && txt.indexOf('<') == -1  && txt.indexOf('like') == -1
                && txt.indexOf('between') == -1 && txt.indexOf('in') === -1
                && parseIn(txt)) {
                this.error = 'Error de sintaxis detectado. Operador inválido cerca de ' + field;
                elem.$error.chip = true;
            }

            self.selectBuffer = true;
            if (!elem.$error.chip) {
                checkInclusionTarjeta(elem, field);
            }
            return txt
        }

        function parseIn(txt) {
            if (txt.indexOf(' in ') < 0) {
                return true;
            }
            var inFilter = txt.substring(txt.indexOf(' in ') + ' in '.length);
            var allNumbers = inFilter.match(/^\([0-9]+(,[\s]?[0-9]+)*\)$/);
            var allCharacters = inFilter.match(/^\('[\S]+'(,[\s]?'[\S]+')*\)$/);

            return allNumbers || allCharacters;
        }

        function sacamarca(elem) {
            self.selectBuffer = true;
            elem.$error.chip = false;
            console.log('entró a sacamarca');
            checkInclusionTarjeta(elem);
        }

        function checkInclusionTarjeta(elem, field) {
            if (self.selectedItems.filter(function (el) { return el.indexOf('tarjeta=') > -1 }).length === 0
                && field !== 'tarjeta') {
                self.error = "Debe seleccionar el filtro 'tarjeta'";
                elem.$error.chip = true;
            }
        }

        function querySearch (query) {
            var results = query ? self.items.filter(createFilterFor(query)) : [];
            //console.log(self.items.filter(createFilterFor(query)));
            return results;
        }

        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            return function filterFn(items) {
                return (items._lowername.indexOf(lowercaseQuery) === 0) ||
                    (items._lowertip.indexOf(lowercaseQuery) === 0);
            };
        }
        function loadItems() {

            var items = $scope.columns;

            return items.map(function (obj) {
                obj._lowername = obj.name.toLowerCase();
                obj._lowertip = obj.tip.toLowerCase();
                return obj;
            });
        }
    }();   //ojo, se autoejecuta

    $scope.mostrarArchivos = function () {
        $mdSidenav('rightNavArchivos').toggle();
    };
});

