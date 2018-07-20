app.controller('mailsConfigurables.ctrl', function ($scope, $mdDialog, Toast, MailsConfigurables) {
    $scope.grid = {
        data: [],
        count: 0,
        selected: [],
        query: {
            search: false,
            searchText: '',
            order: 'codigo',
            limit: 10,
            page: 1
        }
    };

    $scope.load = function () {
        $scope.grid.selected = [];
        MailsConfigurables.query({}, function (data) {
            $scope.grid.data = data;
            $scope.grid.count = $scope.grid.data.length;
        }, function (err) {
            Toast.showError(err.data.message);
        })
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
            controller: 'mailsConfigurables.add.ctrl',
            controllerAs: 'ctrl',
            focusOnOpen: false,
            targetEvent: event,
            templateUrl: 'app.views/mailsConfigurables/popUp.html'
        }).then(function () {
            $scope.load();
        });
    };

    $scope.update = function () {
        $mdDialog.show({
            clickOutsideToClose: true,
            controller: 'mailsConfigurables.edit.ctrl',
            controllerAs: 'ctrl',
            focusOnOpen: false,
            targetEvent: event,
            templateUrl: 'app.views/mailsConfigurables/popUp.html',
            locals: {
                mail: $scope.grid.selected[0]
            }
        }).then(function () {
            $scope.load();
        });
    };

    $scope.delete = function () {
        $mdDialog.show({
            clickOutsideToClose: true,
            controller: 'mailsConfigurables.del.ctrl',
            controllerAs: 'ctrl',
            focusOnOpen: false,
            targetEvent: event,
            templateUrl: 'app.views/mailsConfigurables/deletePopUp.html',
            locals: {
                mails: $scope.grid.selected
            }
        }).then(function () {
            $scope.load();
        });
    };

    function hasSearchedString(element) {
        return $scope.grid.query.searchText === '' ||
            element.codigo.toLowerCase().indexOf($scope.grid.query.searchText) > -1 ||
            (element.descripcion === null ? '' : element.descripcion).toLowerCase().indexOf($scope.grid.query.searchText) > -1
    }
});

app.controller('mailsConfigurables.add.ctrl', function ($scope, $mdDialog, Toast, Global, MailsConfigurables, $resource) {
    $scope.operac = 'Alta';
    $scope.mail = {
        codigo: '',
        descripcion: '',
        idProceso: null,
        de: location.port === '3030' || location.port === '5050' ? 'BP4-Notificación' : '',
        para: '',
        copia: '',
        copiaOculta: '',
        asunto: '',
        cuerpo: '',
        llevaAdjuntos: false,
        usuario: Global.currentUser.name
    };
    $scope.cancel = $mdDialog.cancel;
    $scope.procesos = [];

    $scope.init = function () {
        setTimeout(function () {

        }, 100);
        $resource('/api/procesos/procesosTraerTodos').query({}, function (data) {
            $scope.procesos = data.filter(function (proceso) { return proceso.fecBaja === null; })
                .map(function (proceso) { return { idProceso: proceso.idProceso, nombre: proceso.nombre } });
        });
    };

    $scope.save = function () {
        var mail = angular.extend({}, $scope.mail);
        if (mail.cuerpo === "") {
            Toast.showError("El campo Cuerpo es obligatorio");
            return;
        }
        mail.cuerpo = mail.cuerpo.split('\n').join('<br>').split('\t').join('&nbsp;&nbsp;&nbsp;&nbsp;');
        MailsConfigurables.save(mail, function () {
            Toast.showSuccess();
            $mdDialog.hide();
        }, function (err) {
            Toast.showError(err.data.message);
        });
    };

    $scope.allowTab = function (e) {
        var text = e.target;
        if(e.keyCode === 9 || e.which === 9) {
            e.preventDefault();
            var s = text.selectionStart;
            text.value = text.value.substring(0,text.selectionStart) + "\t" + text.value.substring(text.selectionEnd);
            text.selectionEnd = s+1;
        }
    };
});

app.controller('mailsConfigurables.edit.ctrl', function ($scope, $mdDialog, Toast, Global, MailsConfigurables, $resource, mail) {
    $scope.operac = 'Modificación';

    $scope.mail = angular.extend({}, mail);
    $scope.mail.llevaAdjuntos = $scope.mail.llevaAdjuntos === 'SI';
    $scope.mail.usuario = Global.currentUser.name;
    $scope.cancel = $mdDialog.cancel;
    $scope.procesos = [];

    $scope.init = function () {
        $resource('/api/procesos/procesosTraerTodos').query({}, function (data) {
            $scope.procesos = data.filter(function (proceso) { return proceso.fecBaja === null; })
                .map(function (proceso) { return { idProceso: proceso.idProceso, nombre: proceso.nombre } });
        });
    };

    $scope.save = function () {
        var mail = angular.extend({}, $scope.mail);
        mail.cuerpo = mail.cuerpo.split('\n').join('<br>').split('\t').join('&nbsp;&nbsp;&nbsp;&nbsp;');
        MailsConfigurables.update({ idMails: $scope.mail.idMails }, mail, function () {
            Toast.showSuccess();
            $mdDialog.hide();
        }, function (err) {
            Toast.showError(err.data.message);
        });
    };

    $scope.allowTab = function (e) {
        var text = e.target;
        if(e.keyCode === 9 || e.which === 9) {
            e.preventDefault();
            var s = text.selectionStart;
            text.value = text.value.substring(0,text.selectionStart) + "\t" + text.value.substring(text.selectionEnd);
            text.selectionEnd = s+1;
        }
    };
});

app.controller('mailsConfigurables.del.ctrl', function ($scope, $mdDialog, Toast, Global, $http, $resource, mails) {
    $scope.mailsDelete = mails;
    $scope.cancel = $mdDialog.cancel;
    $scope.currentDate = new Date();
    $scope.fecBaja = $scope.currentDate;

    $scope.save = function () {
        var codigos = $scope.mailsDelete.map(function (c) { return c.idMails }).join('|');
        $http({
            method: 'DELETE',
            url: '/api/mailsConfigurables/',
            data: { idMails: codigos, fecBaja: $scope.fecBaja, usuario: Global.currentUser.name },
            headers: {'Content-Type': 'application/json;charset=utf-8'}
        }).then(function () {
            Toast.showSuccess();
            $mdDialog.hide();
        }).catch(function (err) {
            Toast.showError(err.data.message);
        });
    };
});