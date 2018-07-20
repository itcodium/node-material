app.controller('campañas.ctrl', ['$scope', '$mdDialog', 'Toast', '$resource', function ($scope, $mdDialog, Toast, $resource) {
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
        $scope.promise = $resource('/api/campanias/').query(function (res) {
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
            controller: 'campañas.add.ctrl',
            controllerAs: 'ctrl',
            focusOnOpen: false,
            targetEvent: event,
            templateUrl: 'app.views/campañas/popUp.html'
        }).then(function () {
            $scope.load();
        });
    };

    $scope.update = function () {
        $mdDialog.show({
            clickOutsideToClose: true,
            controller: 'campañas.edit.ctrl',
            controllerAs: 'ctrl',
            focusOnOpen: false,
            targetEvent: event,
            templateUrl: 'app.views/campañas/popUp.html',
            locals: {
                campania: $scope.grid.selected[0]
            }
        }).then(function () {
            $scope.load();
        });
    };

    $scope.delete = function () {
        $mdDialog.show({
            clickOutsideToClose: true,
            controller: 'campañas.del.ctrl',
            controllerAs: 'ctrl',
            focusOnOpen: false,
            targetEvent: event,
            templateUrl: 'app.views/campañas/deletePopUp.html',
            locals: {
                campania: $scope.grid.selected[0]
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
}]);

app.controller('campañas.add.ctrl', ['$scope', '$mdDialog', 'Global', 'Toast', 'Campanias',
    function ($scope, $mdDialog, Global, Toast, Campanias) {
    $scope.campania = {
        codigo: null,
        descripcion: null,
        esEmpresa: false,
        creadoPor: Global.currentUser.name
    };

    $scope.cancel = $mdDialog.cancel;

    $scope.init = function() {
        $scope.operac = "Alta";
    };

    $scope.save = function () {
        Campanias.save($scope.campania, function (res) {
            Toast.showSuccess();
            $mdDialog.hide();
        }, function (error) {
            Toast.showError(error.data.message);
        });
    };
}]);

app.controller('campañas.edit.ctrl', ['$scope', '$mdDialog', 'Global', 'Toast', 'campania', 'Campanias',
    function ($scope, $mdDialog, Global, Toast, campania, Campanias) {
        $scope.campania = {
            codigo: campania.codigo,
            descripcion: campania.descripcion,
            esEmpresa: campania.esEmpresa === 'SI',
            modificadoPor: Global.currentUser.name
        };

        $scope.cancel = $mdDialog.cancel;

        $scope.init = function() {
            $scope.operac = "Modificación";
        };

        $scope.save = function () {
            Campanias.update({ codigo: $scope.campania.codigo }, $scope.campania, function (res) {
                Toast.showSuccess();
                $mdDialog.hide();
            }, function (error) {
                Toast.showError(error.data.message);
            });
        };
    }]);

app.controller('campañas.del.ctrl', ['$scope', '$mdDialog', 'Global', 'Toast', 'campania', '$http',
    function ($scope, $mdDialog, Global, Toast, campania, $http) {
        $scope.campania = {
            codigo: campania.codigo,
            descripcion: campania.descripcion,
            modificadoPor: Global.currentUser.name,
            fecBaja: new Date()
        };

        $scope.cancel = $mdDialog.cancel;

        $scope.currentDate = new Date();

        $scope.save = function () {
            $http({
                method: 'DELETE',
                url: '/api/campanias/' + $scope.campania.codigo,
                data: { fecBaja: $scope.campania.fecBaja, modificadoPor: $scope.campania.modificadoPor },
                headers: {'Content-Type': 'application/json;charset=utf-8'}
            }).then(function () {
                Toast.showSuccess();
                $mdDialog.hide();
            }).catch(function (err) {
                Toast.showError(error.data.message);
            });
        }
    }]);