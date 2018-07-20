/**
 * Created by cristian.ovando on 17/08/2017.
 */
(function () {
    'use strict';

    angular
        .module('app')
        .controller('promoTDAsoc.ctrl', promoTSAsocCtrl);

    function PromoAsociada(archivo, promo, descripcion, promovisa, nombrevisa, banca, vigenciahasta, cantidad) {
        this.Archivo = archivo;
        this.Promo = promo;
        this.Descripcion = descripcion;
        this.PromoVisa = promovisa;
        this.NombreVisa = nombrevisa;
        this.Banca = banca;
        this.VigenciaHasta = vigenciahasta;
        this.Cantidad = cantidad;
    }

    function promoTSAsocCtrl($scope, promoTDAsocService, Toast, Global, $mdDialog) {

        $scope.archivos = initGrid();
        $scope.promocionesGrid = initGrid();
        $scope.asociacionesGrid = initGrid();
        $scope.add = add;
        $scope.confirmarGenerar = confirmarGenerar;
        $scope.confirmarEliminar = confirmarEliminar;

        activate();

        /////////////////////////////////

        /**
         * Inicializacion de pantalla
         */
        function activate() {
            obtenerArchivos();
            obtenerPromociones();
            obtenerPromocionesAsociadas();
            $scope.minDate = new Date();
        }

        /**
         * Devuelve object model de grilla
         * @returns {{data: Array, count: number, selected: Array, query: {limit: number, page: number}, message: string}}
         */
        function initGrid() {
            let grid = {
                data: [],
                count: 1,
                selected: [],
                "query": {
                    limit: 5,
                    page: 1
                },
                message: ''
            };
            return grid;
        }

        /**
         * Resetea los checks de las grillas y inicializa en vacio el campo de vigencia
         */
        function resetGrid() {
            $scope.archivos.data.map(x => { x.checked = false; return x });
            $scope.promocionesGrid.data.map(x => { x.checked = false; return x });
            $scope.fechaVigencia = null;
            $scope.archivos.selected = [];
            $scope.promocionesGrid.selected = [];
        }

        /**
         * Obtiene los datos para cargar la grilla de archivos
         */
        function obtenerArchivos() {
            $scope.promiseArchivos = promoTDAsocService
                .obtenerArchivos()
                .then( res => {
                    $scope.archivos.data = res;
                    $scope.archivos.count = res.length;
                })
                .catch( err => Toast.showError(err,'Error'));
        }

        /**
         * Obtiene los datos para cargar la grilla de promociones vigentes
         */
        function obtenerPromociones() {
            $scope.promisePromociones = promoTDAsocService
                .obtenerPromociones()
                .then( res => {
                    $scope.promocionesGrid.data = res;
                    $scope.promocionesGrid.count = res.length;
                })
                .catch( err => Toast.showError(err,'Error'));
        }

        /**
         * Obtiene la grilla de promociones asociadas
         */
        function obtenerPromocionesAsociadas() {
            $scope.promiseAsociaciones = promoTDAsocService
                .obtenerPromocionesAsociadas()
                .then( res => {
                    $scope.asociacionesGrid.data = res;
                    $scope.asociacionesGrid.count = res.length;
                })
                .catch( err => Toast.showError(err,'Error'));
        }

        /**
         * Agregar registro de la asociacion de los archivos seleccionados con las promociones seleccionadas
         */
        function add() {
            let vm = this;

            if (validaciones.call(this)) {
                let huboRepetidos = false;
                for (let archivo of vm.archivos.selected) {
                    for (let promocion of vm.promocionesGrid.selected) {
                        if (vm.asociacionesGrid.data.findIndex(p => p.Archivo === archivo.NombreArchivo && p.Promo === promocion.codigoPromo) < 0)
                            vm.asociacionesGrid.data.push(
                                new PromoAsociada(archivo.NombreArchivo, promocion.codigoPromo, promocion.descripcion,archivo.CodPromoVisa,
                                    archivo.DescripVisa, promocion.banca,vm.fechaVigencia? vm.fechaVigencia : new Date(promocion.vigenciaHasta), archivo.Cantidad)
                            );
                        else {
                            huboRepetidos = true;
                        }
                    }
                }

                if (huboRepetidos) Toast.showSuccess('Se encontró al menos una asociación repetida, las mismas fueron omitidas');
                resetGrid();
            }
            vm.asociacionesGrid.count = vm.asociacionesGrid.data.length;
        }

        function validaciones() {
            let valido = true;
            let vm = this;

            if (!vm.myForm.$valid) {
                Toast.showError('La vigencia ingresada no es una fecha válida');
                valido = false;
                return valido;
            }
            if (vm.archivos.selected.length === 0 || vm.promocionesGrid.selected.length === 0) {
                Toast.showError('Para realizar esta acción debe seleccionar Archivos y Promociones');
                valido = false;
                return valido;
            }

            return valido
        }

        /**
         * Muestra pantalla de confirmacion del eliminar
         */
        function confirmarEliminar() {
            let vm = this;
            abrirPopup('¿Esta seguro que desea eliminar los registros seleccionados?', vm, del);
        }

        /**
         * Elimina asociación seleccionada
         */
        function del() {
            let vm = this;

            for (let item of vm.asociacionesGrid.selected){
                let ind = vm.asociacionesGrid.data.indexOf(item);
                vm.asociacionesGrid.data.splice(ind,1);
            }
            vm.asociacionesGrid.selected = [];
        }

        /**
         * Muestra pantalla de confirmaciond de generación de archivo
         */
        function confirmarGenerar() {
            let vm = this;
            abrirPopup('¿Desea inciar la generación del archivo?', vm, generar);
        }

        /**
         * Genera archivo de asociacion para enviar a VISA
         */
        function generar() {
            let vm = this;

            if (vm.asociacionesGrid.data.length > 0) {
                promoTDAsocService
                    .generarArchivo(vm.asociacionesGrid.data, Global.currentUser.name)
                    .then( res => {
                        Toast.showSuccess(res, 10000);
                    })
                    .catch( err => Toast.showError(err,'Error'));
            }
        }

        /**
         * Abre popup de mensaje de confirmacion
         * @param mensaje
         * @param vm
         * @param callback
         */
        function abrirPopup(mensaje, vm, callback) {
            $mdDialog.show({
                controller: 'promoTDAsoc.Confirmar.ctrl',
                templateUrl: 'app.views/promociones/promoTD/promoTD-Confirmar/promoTD-Confirmar.html',
                locals: {
                    mensaje: mensaje
                },
                skipHide: true
            }).then(function (res) {
                if (callback) callback.call(vm);
            }).catch(function () {

            });
        }
    }
})();