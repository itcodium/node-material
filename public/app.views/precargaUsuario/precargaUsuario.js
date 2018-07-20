app.controller('ctrlPrecargaUsuario', ['$scope',  'datacontext', 'Global','$location',
	function ($scope, datacontext, Global, $location) {

}]);

function emailEsValido(email)
{
    var domain=email.split('@')
    var domain_extention=domain[1].split('.')

    var dominios_permitidos_2= "gob;com;info;net;fin;edu;dir;org".split(';');
    var dominios_permitidos_3="gob.ec;com.ec;net.ec;edu.ec;fin.ec;dir.ec".split(';');

    var index=-1
    var result=false;
    if (domain_extention.length==2){
        index=dominios_permitidos_2.indexOf(domain_extention[1])
    }
    if (domain_extention.length==3){
        index=dominios_permitidos_3.indexOf(domain_extention[1]+"."+domain_extention[2]);
    }

    if(index!=-1){
        result=true;
    }
    return result;
}


app.controller('app.confirm.ctrl', [
    '$scope', '$modal', '$modalInstance', 'datacontext', '$timeout', 'items',
    function ($scope, $modal, $modalInstance, datacontext, $timeout, items) {

        $scope.items = items;

        $scope.params = {}
        $scope.params.titulo = ($scope.items.titulo) ? $scope.items.titulo : 'Confirmación';
        $scope.params.motivo = ($scope.items.mensaje) ? $scope.items.mensaje : 'Desea continuar?';

        $scope.ok = function (id) {
            $modalInstance.close($scope.items);
        };

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

    }]);
/*

app.controller('perfilDelete.ctrl', ['$scope','$routeParams','$resource','$location','datacontext','Perfiles','Acciones',
	function ($scope,$routeParams,$resource,$location,datacontext,  Perfiles,  Acciones) {
		$scope.perfil = {};
		$scope.acciones= {};


	}]);

*/

