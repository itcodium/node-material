 /*

app.controller('test_date.ctrl', ['$mdDialog', '$$nutrition', '$scope','TestDate',
    function ($mdDialog, $$nutrition, $scope,TestDate) {
        'use strict';
        $scope.fecha= new Date();

        $scope.validDate= function(date) {
            return true;
        }

        $scope.addItem = function () {
            var test= new TestDate({fecha: moment($scope.fecha).subtract($scope.fecha.getTimezoneOffset()/60, 'hours') });
            test.$save(function(p, res) {
                console.log("Res Save",p);
            },function(error){
                console.log(error.data.message);
            });
        };

    }]);

     */




 app.controller('test_autocomplete', ['$scope',
     function ($scope) {
         'use strict';
         $scope.isDisabled    = false;
         $scope.states= [{"value":"alabama","display":"Alabama"},{"value":"alaska","display":"Alaska"},{"value":"arizona","display":"Arizona"},{"value":"arkansas","display":"Arkansas"},{"value":"california","display":"California"},{"value":"colorado","display":"Colorado"},{"value":"connecticut","display":"Connecticut"},{"value":"delaware","display":"Delaware"},{"value":"florida","display":"Florida"},{"value":"georgia","display":"Georgia"},{"value":"hawaii","display":"Hawaii"},{"value":"idaho","display":"Idaho"},{"value":"illinois","display":"Illinois"},{"value":"indiana","display":"Indiana"},{"value":"iowa","display":"Iowa"},{"value":"kansas","display":"Kansas"},{"value":"kentucky","display":"Kentucky"},{"value":"louisiana","display":"Louisiana"},{"value":"maine","display":"Maine"},{"value":"maryland","display":"Maryland"},{"value":"massachusetts","display":"Massachusetts"},{"value":"michigan","display":"Michigan"},{"value":"minnesota","display":"Minnesota"},{"value":"mississippi","display":"Mississippi"},{"value":"missouri","display":"Missouri"},{"value":"montana","display":"Montana"},{"value":"nebraska","display":"Nebraska"},{"value":"nevada","display":"Nevada"},{"value":"new hampshire","display":"New Hampshire"},{"value":"new jersey","display":"New Jersey"},{"value":"new mexico","display":"New Mexico"},{"value":"new york","display":"New York"},{"value":"north carolina","display":"North Carolina"},{"value":"north dakota","display":"North Dakota"},{"value":"ohio","display":"Ohio"},{"value":"oklahoma","display":"Oklahoma"},{"value":"oregon","display":"Oregon"},{"value":"pennsylvania","display":"Pennsylvania"},{"value":"rhode island","display":"Rhode Island"},{"value":"south carolina","display":"South Carolina"},{"value":"south dakota","display":"South Dakota"},{"value":"tennessee","display":"Tennessee"},{"value":"texas","display":"Texas"},{"value":"utah","display":"Utah"},{"value":"vermont","display":"Vermont"},{"value":"virginia","display":"Virginia"},{"value":"washington","display":"Washington"},{"value":"west virginia","display":"West Virginia"},{"value":"wisconsin","display":"Wisconsin"},{"value":"wyoming","display":"Wyoming"}];

         $scope.newState=function (state) {
             alert("Sorry! You'll need to create a Constituion for " + state + " first!");
         }

         $scope.init=function (state) {
             $scope.selectedItem=state;
         }

         $scope.searchTextChange   =function (text) {
             console.log("searchTextChange",text);
         }
         $scope.selectedItemChange = function (item) {
             console.log("selectedItemChange",JSON.stringify(item));
         }

         $scope.querySearch= function (query) {
             var results = query ? $scope.states.filter( $scope.filter(query) ) : $scope.states;
             return results;
         }

         $scope.filter =function (query) {
             var lowercaseQuery = angular.lowercase(query);
             return function filterFn(state) {
                 return (state.value.indexOf(lowercaseQuery) === 0);
             };
         }

         $scope.init($scope.querySearch("colorado")[0]);

         // SELECT
         $scope.proceso={};

         $scope.tipoProceso= [{tipo:"M",descripcion:"Manual"},{tipo:"A",descripcion:"Automático"}]

         $scope.test=function(){
             console.log("TEST",$scope.proceso.tipo);
             var x = document.getElementById("ProcesoTipo");
             x.className = "ng-dirty ng-pristine ng-empty ng-invalid ng-invalid-required ng-touched";
             console.log("$scope.tipoProceso[1]",x)

         }




     }]);

 /*
     Autocomplete

        Datos
            0. SetDatos
        Funciones
            1. Search()
            2. filtro()

        Eventos
            textChange()
            itemChange()
            nuevo()

 */