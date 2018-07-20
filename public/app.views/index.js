window.angular.module('bp4.controllers.index', [])
  .controller('IndexController', ['$scope','Global',

    function ($scope, Global) {

        $scope.global = Global;
        $scope.myInterval = 55000;
        $scope.signIn=Global.isSignedIn();
        $scope.submnu1 = 'block';

        Global.setModule('');

        $scope.ctrl = {};
        $scope.ctrl.showMenu = [];


        $scope.mostrarSubMenu = function(index, $event) {

            console.log("IndexController",window.user);
            $event.preventDefault();
            $event.stopPropagation();
            if($scope.ctrl.showMenu[index] != undefined){
                $scope.ctrl.showMenu[index] = !$scope.ctrl.showMenu[index];
            }else{
                $scope.ctrl.showMenu[index] = true;
            }
            $(".submenuList").removeClass("ng-hide").addClass("ng-hide");
        };



        var altura = $scope.altura = [385,385,445,185,385,385, 385, 385, 385, 445,385,385, 385];
        var rightleft = $scope.rightleft = ['left', 'right', 'center', 'right', 'right', 'right', 'right', 'right', 'right', 'left', 'center', 'left', 'right'];
        var cocolor = $scope.cocolor = ['white', 'black', 'black', 'black', '#858a8f', '#efefef', '#858a8f', 'white', 'black', 'white', 'black', 'black', 'black' ];

    }


]);


