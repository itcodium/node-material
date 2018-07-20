(function () {
    'use strict';

    angular
        .module('app')
        .service('limitesDeComprasProductosService', ProductoService);

    function ProductoService ($http, Global) {
        const URL_PRODUCTOS = '/api/limitesDeCompras/productos';

        this.obtenerProductos = () => {
            return new Promise((resolve, reject) => {

                $http({
                    url: URL_PRODUCTOS,
                    method: 'GET'
                }).then( function(res) {
                        resolve(res.data);
                    },
                    function(err) {
                        reject(err.message);
                    });
            });
        };

        this.guardarProducto = (producto, productos, esModificacion) => {
            const usuario = Global.currentUser.name;
            return new Promise((resolve, reject) => {
                if (esModificacion || validaDuplicado(producto, productos)) {
                    $http({
                        url: URL_PRODUCTOS,
                        method: 'PUT',
                        data: { producto, usuario: usuario }
                    }).then( function(res) {
                            resolve(res.data);
                        },
                        function(err) {
                            reject(err.message);
                        });
                } else {
                    reject('Ya existe un registro para la Marca y Tipo de Cuenta ingresados');
                }
            });
        };

        this.eliminarProductos = (productos) => {
            const ids = productos.reduce((ant, curr) => ant + '|' + curr.idUnifLCProducto, '') + '|';
            const usuario = Global.currentUser.name;

            return new Promise((resolve, reject) => {
                $http({
                    url: URL_PRODUCTOS,
                    method: 'DELETE',
                    params: { productos: ids, usuario: usuario }
                }).then( function(res) {
                        resolve(res.data);
                    },
                    function(err) {
                        reject(err.message);
                    });
            });
        };

        function validaDuplicado(producto, productos) {
            const valid = productos && productos.filter(x => x.marca === producto.marca && 
                                                x.tipoCuenta.trim() === producto.tipoCuenta.trim()).length === 0;
            return valid;
        }
    }
})();