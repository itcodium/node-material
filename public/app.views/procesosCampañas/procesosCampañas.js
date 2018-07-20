app.controller('procesosCampañas.ctrl', function($scope, $mdDialog, Toast, $resource) {
    $scope.grid = {
        selected: [],
        data: [],
        query: {
            page: 1,
            limit: 10,
            order: 'codigo',
            showDeleted: false,
            search: false,
            searchText: ''
        },
        count: 0
    };

    $scope.load = function () {
        $scope.grid.selected = [];
        $scope.promise = $resource('/api/procesosCampanias/').query(function (res) {
            $scope.grid.data = res;
            $scope.grid.count = $scope.grid.data.length;
        }, function (err) {
            Toast.showError(err.data.message);
        }).$promise;
    };

    $scope.filtering = function (element) {
        return (element.fecBaja === null || $scope.grid.query.showDeleted) &&
               (!$scope.grid.query.search || hasSearchedString(element));
    };

    $scope.resetPage = function () {
        $scope.grid.query.page = 1;
    };

    $scope.add = function () {
        $mdDialog.show({
            clickOutsideToClose: true,
            controller: 'procesosCampañas.add.ctrl',
            controllerAs: 'ctrl',
            focusOnOpen: false,
            targetEvent: event,
            templateUrl: 'app.views/procesosCampañas/popUp.html'
        }).then(function () {
            $scope.load();
        });
    };

    $scope.edit = function () {
        if ($scope.grid.selected.length > 1) {
            Toast.showError('Sólo se puede editar un proceso por vez');
        } else {
            $mdDialog.show({
                clickOutsideToClose: true,
                controller: 'procesosCampañas.edit.ctrl',
                controllerAs: 'ctrl',
                focusOnOpen: false,
                targetEvent: event,
                templateUrl: 'app.views/procesosCampañas/popUp.html',
                locals: {
                    proceso: $scope.grid.selected[0]
                }
            }).then(function () {
                $scope.load();
            });
        }
    };

    $scope.delete = function () {
        $mdDialog.show({
            clickOutsideToClose: true,
            controller: 'procesosCampañas.delete.ctrl',
            controllerAs: 'ctrl',
            focusOnOpen: false,
            targetEvent: event,
            templateUrl: 'app.views/procesosCampañas/deletePopUp.html',
            locals: {
                procesos: $scope.grid.selected
            }
        }).then(function () {
            $scope.load();
        });
    };

    function hasSearchedString(element) {
        return $scope.grid.query.searchText === '' ||
               element.codigo.toLowerCase().indexOf($scope.grid.query.searchText) > -1 ||
               element.descripcion.toLowerCase().indexOf($scope.grid.query.searchText) > -1
    }
});

app.controller('procesosCampañas.add.ctrl', function ($scope, $mdDialog, Toast, Global, $resource, $mdSidenav, ProcesosCampanias) {
    $scope.operac = "Alta";
    $scope.isSidenavOpen = false;

    $scope.cancel = $mdDialog.cancel;
    $scope.entidades = [{ value: '67', name: 'VI' }, { value: '667', name: 'AX' }];
    $scope.campanias = [];

    $scope.proceso = {
        codigo: null,
        descripcion: null,
        entidad: null,
        idCampania: null,
        usuario: Global.currentUser.name
    };

    $scope.auxCampania = [];

    $scope.init = function () {
        $resource('/api/campanias/').query(function (res) {
            $scope.campanias = res.map(function (campania) {
                return {
                    id: campania.idCampania,
                    code: campania.codigo,
                    text: campania.codigo + " - " + campania.descripcion
                };
            })
        });
    };

    $scope.save = function () {
        ProcesosCampanias.save($scope.proceso, function () {
            Toast.showSuccess();
            $mdDialog.hide();
        }, function (err) {
            Toast.showError(err.data.message);
        });
    };

    $scope.getCampanias = function (text) {
        return $scope.campanias.filter(function (campania) { return campania.code.toLowerCase().indexOf(text) > -1  });
    };

    $scope.updateProcesoCampania = function (campania) {
        $scope.proceso.idCampania = campania.id;
    };

    $scope.openCampaniasList = function () {
        $mdSidenav('rightNavCampaña').toggle();
    };

    $scope.closeNav = function () {
        $scope.auxCampania = [];
        $mdSidenav('rightNavCampaña').close();
    };
    
    $scope.saveCampania = function () {
        if ($scope.auxCampania.length === 0) {
            Toast.showError('Debe elegir una campaña');
        } else {
            $scope.campaniaSelected = $scope.auxCampania[0];
            $scope.proceso.idCampania = $scope.auxCampania[0].id;
            $scope.descripcionCampania = $scope.auxCampania[0].code;
            $scope.closeNav();
        }
    }
});

app.controller('procesosCampañas.edit.ctrl', function ($scope, $mdDialog, Toast, Global, $resource, $mdSidenav, proceso, ProcesosCampanias) {
    $scope.operac = "Modificación";
    $scope.isSidenavOpen = false;

    $scope.cancel = $mdDialog.cancel;
    $scope.entidades = [{ value: '67', name: 'VI' }, { value: '667', name: 'AX' }];
    $scope.campanias = [];

    $scope.auxCampania = [];

    $scope.init = function () {
        $scope.proceso = angular.extend({}, proceso);
        $scope.proceso.usuario = Global.currentUser.name;
        $scope.proceso.entidad = $scope.entidades.filter(function (entidad) {
            return entidad.name === $scope.proceso.entidad.toString()
        })[0].value;

        $resource('/api/campanias/').query(function (res) {
            $scope.campanias = res.map(function (campania) {
                return {
                    id: campania.idCampania,
                    code: campania.codigo,
                    text: campania.codigo + " - " + campania.descripcion
                };
            });
            $scope.campaniaSelected = $scope.campanias.filter(function (campania) { 
                return campania.code === $scope.proceso.codigoCampania; 
            })[0];
        });
    };

    $scope.save = function () {
        ProcesosCampanias.update({ codigo: $scope.proceso.codigo }, $scope.proceso, function () {
            Toast.showSuccess();
            $mdDialog.hide();
        }, function (err) {
            Toast.showError(err.data.message);
        });
    };

    $scope.getCampanias = function (text) {
        return $scope.campanias.filter(function (campania) { return campania.code.toLowerCase().indexOf(text) > -1  });
    };

    $scope.updateProcesoCampania = function (campania) {
        $scope.proceso.idCampania = campania.id;
    };

    $scope.openCampaniasList = function () {
        $mdSidenav('rightNavCampaña').toggle();
    };

    $scope.closeNav = function () {
        $mdSidenav('rightNavCampaña').close();
    };

    $scope.saveCampania = function () {
        if ($scope.auxCampania.length === 0) {
            Toast.showError('Debe elegir una campaña');
        } else {
            $scope.campaniaSelected = $scope.auxCampania[0];
            $scope.proceso.idCampania = $scope.auxCampania[0].id;
            $scope.descripcionCampania = $scope.auxCampania[0].code;
            $scope.closeNav();
        }
    }
});

app.controller('procesosCampañas.delete.ctrl', function ($scope, $mdDialog, Toast, Global, procesos, $http) {
    $scope.campaniasDelete = procesos;
    $scope.cancel = $mdDialog.cancel;
    $scope.currentDate = new Date();
    $scope.fecBaja = $scope.currentDate;
    $scope.save = function () {
        var codigos = $scope.campaniasDelete.map(function (c) { return c.codigo }).join('|');
        $http({
            method: 'DELETE',
            url: '/api/procesosCampanias/',
            data: { codigos: codigos, fecBaja: $scope.fecBaja, usuario: Global.currentUser.name },
            headers: {'Content-Type': 'application/json;charset=utf-8'}
        }).then(function () {
            Toast.showSuccess();
            $mdDialog.hide();
        }).catch(function (err) {
            Toast.showError(err.data.message);
        });
    };
});