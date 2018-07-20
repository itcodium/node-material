app.controller('distribuciones.ctrl', ['$scope', '$mdDialog', 'Toast', '$resource', function ($scope, $mdDialog, Toast, $resource) {
    $scope.grid = {
        data: [],
        count: 0,
        selected: [],
        query: {
            page: 1,
            limit: 10,
            order: 'codigo'
        }
    };

    $scope.load = function () {
        $scope.grid.selected = [];
        $scope.promise = $resource('/api/distribuciones/').query(function (res) {
            $scope.grid.data = res;
            $scope.grid.count = $scope.grid.data.length;
        }, function (err) {
            Toast.showError(err.data.message);
        }).$promise;
    };

    $scope.add = function () {
        $mdDialog.show({
            clickOutsideToClose: true,
            controller: 'distribuciones.add.ctrl',
            controllerAs: 'ctrl',
            focusOnOpen: false,
            targetEvent: event,
            templateUrl: 'app.views/distribuciones/popUp.html'
        }).then(function (resp) {
            $scope.load();
        }).catch(function (err) {
            Toast.showError(err.data.message);
        });
    };

    $scope.update = function () {
        $mdDialog.show({
            clickOutsideToClose: true,
            controller: 'distribuciones.edit.ctrl',
            controllerAs: 'ctrl',
            focusOnOpen: false,
            targetEvent: event,
            templateUrl: 'app.views/distribuciones/popUp.html',
            locals: {
                distribucion: $scope.grid.selected[0]
            }
        }).then(function (resp) {
            $scope.load();
        }).catch(function (err) {
            Toast.showError(err.data.message);
        });
    };

    $scope.delete = function () {
        $mdDialog.show({
            clickOutsideToClose: true,
            controller: 'distribuciones.delete.ctrl',
            controllerAs: 'ctrl',
            focusOnOpen: false,
            targetEvent: event,
            templateUrl: 'app.views/distribuciones/deletePopUp.html',
            locals: {
                distribucion: $scope.grid.selected[0]
            }
        }).then(function (resp) {
            $scope.load();
        }).catch(function (err) {
            Toast.showError(err.data.message)
        });
    }
}]);

app.controller('distribuciones.add.ctrl', ['$scope', '$mdDialog', 'Toast', 'Campanias', '$resource', 'Global', 'Distribuciones',
    function ($scope, $mdDialog, Toast, Campanias, $resource, Global, Distribuciones) {
        $scope.campanias = {
            data: [],
            count: 0,
            selected: [],
            query: {
                page: 1,
                limit: 5,
                order: 'codigo'
            }
        };

        $scope.distribucion = {
            codigo: null,
            descripcion: null,
            campanias: [],
            creadoPor: Global.currentUser.name
        };

        $scope.cancel = $mdDialog.cancel;

        $scope.init = function () {
            $scope.operac = "Alta";
            $scope.promise = Campanias.query(function (resp) {
                $scope.campanias.data = resp.filter(function (it) { return it.fecBaja === null; });
                $scope.campanias.count = $scope.campanias.data.length;
            }, function (err) {

            }).$promise;
        };

        $scope.save = function () {
            var alta = angular.extend({}, $scope.distribucion);
            alta.campanias = alta.campanias.map(function (it) { return it.idCampania; }).join('|');
            if (alta.campanias.length === 0) {
                Toast.showError('Debe elegir al menos una campaña');
            } else {
                $resource('/api/controlDuplicado/distribuciones').get({
                    codigo: alta.codigo,
                    campanias: alta.campanias
                }, function (res) {
                    if (res.esDuplicado) {
                        Toast.showError('El código de distribución para esa campaña ya está ingresado en el sistema');
                    } else {
                        Distribuciones.save(alta, function (res) {
                            Toast.showSuccess();
                            $mdDialog.hide();
                        }, function (error) {
                            Toast.showError(error.data.message);
                        });
                    }
                }, function (error) {
                    Toast.showError(error.data.message);
                });
            }
        }
}]);

app.controller('distribuciones.edit.ctrl', ['$scope', 'Distribuciones', '$mdDialog', 'Global', 'distribucion', 'Toast',
    function ($scope, Distribuciones, $mdDialog, Global, distribucion, Toast) {
        $scope.distribucion = angular.extend({}, distribucion);
        $scope.campanias = {
            data: [],
            count: 0,
            query: {
                limit: 5,
                page: 1,
                order: 'codigo'
            }
        };

        $scope.cancel = $mdDialog.cancel;

        $scope.init = function () {
            $scope.campanias.data = [
                {
                    idCampania: distribucion.idCampania,
                    codigo: distribucion.codigoCampania,
                    descripcion: distribucion.descripcionCampania
                }
            ];
            $scope.campanias.count = 1;
            $scope.operac = "Modificación";
        };

        $scope.save = function () {
            var distribucion = {
                codigo: $scope.distribucion.codigo,
                descripcion: $scope.distribucion.descripcion,
                campania: $scope.distribucion.idCampania,
                modificadoPor: Global.currentUser.name
            };
            Distribuciones.update({ codigo: distribucion.codigo }, distribucion, function (res) {
                Toast.showSuccess();
                $mdDialog.hide();
            }, function (err) {
                Toast.showError(err.data.message);
            });
        };
    }]);

app.controller('distribuciones.delete.ctrl', ['$scope', 'Global', 'Toast', '$http', '$mdDialog', 'distribucion',
    function ($scope, Global, Toast, $http, $mdDialog, distribucion) {
        $scope.cancel = $mdDialog.cancel;
        $scope.distribucion = angular.extend({}, distribucion);
        $scope.currentDate = new Date();
        $scope.distribucion.fecBaja = $scope.currentDate;
        $scope.save = function () {
            $scope.distribucion.modificadoPor = Global.currentUser.name;
            $http({
                method: 'DELETE',
                url: '/api/distribuciones/' + $scope.distribucion.codigo,
                data: {
                    fecBaja: $scope.distribucion.fecBaja,
                    modificadoPor: $scope.distribucion.modificadoPor,
                    campania: $scope.distribucion.idCampania
                },
                headers: {'Content-Type': 'application/json;charset=utf-8'}
            }).then(function (res) {
                Toast.showSuccess();
                $mdDialog.hide();
            }).catch(function (err) {
                Toast.showError(err.data.message);
            });
        };
    }]);