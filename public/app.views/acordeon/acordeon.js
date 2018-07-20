app.controller('acordeon.ctrl', [    '$scope', '$modal',  '$filter','$resource', '$timeout', 'Global', 'datacontext',
    function ($scope, $modal, $filter,$resource, $timeout, Global, datacontext) {

        $scope.ctrl = {};
        $scope.ctrl.showMenu = [];
        $scope.Menu = [{   Titulo: '(A) MEnu 1 MEnu 1',
                        Icon: 'iso-docs',
                        Link: 'acordeon',
                        SubMenu: [{ Titulo: 'Carga Manual',
                                    Link: 'acordeon',
                                    Module: 'uso'},
                                  { Titulo: 'Carga Masiva',
                                    Link: 'acordeon'}
                                ]},
                    {   Titulo: '(A) MEnu 2 MEnu 2',
                        Icon: 'iso-bank',
                        Link: 'acordeon',
                        SubMenu: [{   Titulo: 'Modelos',
                                      Link: 'acordeon'},
                                  {   Titulo: 'Reportes',
                                      Link: 'acordeon' }]
                    }
                ];

        $scope.mostrarSubMenu = function(index, $event) {
            $event.preventDefault()
            $event.stopPropagation();
            if($scope.ctrl.showMenu[index] != undefined){
                $scope.ctrl.showMenu[index] = !$scope.ctrl.showMenu[index];
            }else{
                $scope.ctrl.showMenu[index] = true;
            }
        };
    }]);