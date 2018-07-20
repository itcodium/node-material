

app.controller('sucursal2.ctrl',
    function ($scope, $mdEditDialog, $mdDialog, $mdMedia, $mdToast, $mdSidenav, $resource, $location, datacontext, $filter, Sucursales, SucursalesDelete, Global) {




        $scope.optblah = false;

        $scope.fd = frontDoor();      //frontDoor :: funciones de acción

        $scope.gd = gridDoor();       //gridDoor :: funciones de la grilla


        //$scope.selected = [];  //aquí van a parar los registros seleccionados
        $scope.grilla = {
            "count": 9,

            "selected": [],

            "filter": {
                show: false,
                options: {
                    debounce: 500
                }
            },
            "query": {
                filter: '',
                limit: '5',
                order: 'nameToLower',
                page: 1
            },




            "columns": [
                {
                    name: 'Dessert',
                    orderBy: 'name',
                    tip: '100g serving'
                }, {
                    descendFirst: true,
                    name: 'Type',
                    orderBy: 'type',
                    tooltip: 'this is a beautiful tooltip'

                }, {
                    name: 'Calories',
                    numeric: true,
                    orderBy: 'calories.value'
                }, {
                    name: 'Fat',
                    numeric: true,
                    orderBy: 'fat.value',
                    tip: 'g'
                },      {
                    name: 'Protein',
                    numeric: true,
                    orderBy: 'protein.value',
                    trim: true,
                    tip: 'g'
                }, {
                    name: 'Iron',
                    numeric: true,
                    orderBy: 'iron.value',
                    unit: '%'
                }, {
                    name: 'Comments',
                    orderBy: 'comment'
                }],

            "data": [
                {
                    "name": "Frozen yogurt",
                    "type": "Ice cream",
                    "calories": { "value": 159.0 },
                    "fat": { "value": 6.0 },
                    "carbs": { "value": 24.0 },
                    "protein": { "value": 4.0 },
                    "sodium": { "value": 87.0 },
                    "calcium": { "value": 14.0 },
                    "iron": { "value": 1.0 },
                    "comment": "Not as good as the real thing."
                }, {
                    "name": "Ice cream sandwich",
                    "type": "Ice cream",
                    "calories": { "value": 237.0 },
                    "fat": { "value": 9.0 },
                    "carbs": { "value": 37.0 },
                    "protein": { "value": 4.3 },
                    "sodium": { "value": 129.0 },
                    "calcium": { "value": 8.0 },
                    "iron": { "value": 1.0 }
                }, {
                    "name": "Eclair",
                    "type": "Pastry",
                    "calories": { "value":  262.0 },
                    "fat": { "value": 16.0 },
                    "carbs": { "value": 24.0 },
                    "protein": { "value":  6.0 },
                    "sodium": { "value": 337.0 },
                    "calcium": { "value":  6.0 },
                    "iron": { "value": 7.0 }
                }, {
                    "name": "Cupcake",
                    "type": "Pastry",
                    "calories": { "value":  305.0 },
                    "fat": { "value": 3.7 },
                    "carbs": { "value": 67.0 },
                    "protein": { "value": 4.3 },
                    "sodium": { "value": 413.0 },
                    "calcium": { "value": 3.0 },
                    "iron": { "value": 8.0 }
                }, {
                    "name": "Jelly bean",
                    "type": "Candy",
                    "calories": { "value":  375.0 },
                    "fat": { "value": 0.0 },
                    "carbs": { "value": 94.0 },
                    "protein": { "value": 0.0 },
                    "sodium": { "value": 50.0 },
                    "calcium": { "value": 0.0 },
                    "iron": { "value": 0.0 }
                }, {
                    "name": "Lollipop",
                    "type": "Candy",
                    "calories": { "value": 392.0 },
                    "fat": { "value": 0.2 },
                    "carbs": { "value": 98.0 },
                    "protein": { "value": 0.0 },
                    "sodium": { "value": 38.0 },
                    "calcium": { "value": 0.0 },
                    "iron": { "value": 2.0 }
                }, {
                    "name": "Honeycomb",
                    "type": "Other",
                    "calories": { "value": 408.0 },
                    "fat": { "value": 3.2 },
                    "carbs": { "value": 87.0 },
                    "protein": { "value": 6.5 },
                    "sodium": { "value": 562.0 },
                    "calcium": { "value": 0.0 },
                    "iron": { "value": 45.0 }
                }, {
                    "name": "Donut",
                    "type": "Pastry",
                    "calories": { "value": 452.0 },
                    "fat": { "value": 25.0 },
                    "carbs": { "value": 51.0 },
                    "protein": { "value": 4.9 },
                    "sodium": { "value": 326.0 },
                    "calcium": { "value": 2.0 },
                    "iron": { "value": 22.0 }
                }, {
                    "name": "KitKat",
                    "type": "Candy",
                    "calories": { "value": 518.0 },
                    "fat": { "value": 26.0 },
                    "carbs": { "value": 65.0 },
                    "protein": { "value": 7.0 },
                    "sodium": { "value": 54.0 },
                    "calcium": { "value": 12.0 },
                    "iron": { "value": 6.0 }
                }
            ]
        };



        $scope.$watch('grilla.query.filter', function (newValue, oldValue) {
            var bookmark = 1
            if(!oldValue) {
                bookmark = $scope.grilla.query.page;
            }

            if(newValue !== oldValue) {
                $scope.grilla.query.page = 1;
            }

            if(!newValue) {
                $scope.grilla.query.page = bookmark;
            }

            gridDoor().getData();
        });


        // FUNCIONES PRIVADAS, TODOS LOS MIERCOLES (2x1)

        function frontDoor(){
            return {
                ddd: function (text) {
                    alert('fuuuuuuck! ' + text  );
                },
                adddd: function (event) {
                    alert('fuuuuuuck! ' + event.name  );
                },

            };
        }






        function gridDoor(){

            var gridDoor = {
                getData: getData,
                editComment: editComment,
                getTypes: getTypes,
                onPaginate: onPaginate,
                deselect: deselect,
                log: log,
                loadStuff: loadStuff,
                onReorder: onReorder,
                del: del,
                add: add,
                removeFilter: removeFilter

            };

            return gridDoor;


            function editComment(event, data) {
                event.stopPropagation();

                var promise = $mdEditDialog.large({
                    // messages: {
                    //   test: 'I don\'t like test!'
                    // },
                    modelValue: data.comment,
                    placeholder: 'Add a comment',
                    save: function (input) {
                        data.comment = input.$modelValue;
                    },
                    targetEvent: event,
                    title: ( data.comment ? 'Modificar ' : 'Agregar ') + 'commentario',
                    validators: {
                        'md-maxlength': 30
                    }
                });

                promise.then(function (ctrl) {
                    var input = ctrl.getInput();

                    input.$viewChangeListeners.push(function () {
                        input.$setValidity('test', input.$modelValue !== 'test');
                    });
                });
            }

            function getTypes() {
                return ['Candy', 'Ice cream', 'Other', 'Pastry'];
            }

            function onPaginate(page, limit) {
                // $scope.$broadcast('md.table.deselect');
                getData(angular.extend({}, $scope.query, {page: page, limit: limit}));

                console.log('Scope Page: ' + $scope.grilla.query.page + ' Scope Limit: ' + $scope.grilla.query.limit);
                console.log('Page: ' + page + ' Limit: ' + limit);

                //$scope.promise = $timeout(function () {
                //
                //}, 2000);
            }

            function deselect(item) {
                console.log(item.name, 'was deselected');
            }

            function log(item) {
                console.log(item.name, 'was selected');
            }

            function loadStuff() {
                $scope.promise = $timeout(function () {

                }, 2000);
            }


            function onReorder(order) {

                getData(angular.extend({}, $scope.query, {order: order}));

                console.log('Scope Order: ' + $scope.grilla.query.order);
                console.log('Order: ' + order);

                $scope.promise = $timeout(function () {

                }, 2000);
            }

            function getData(query) {

                //$scope.promise = $resource('/api/sucursal').get(query || $scope.grilla.query, success).$promise;
                console.log(query)
                $scope.promise = $resource('/api/sucursal').query(success).$promise;

                function success(data) {
                    console.log(data);
                    $scope.grilla.count = data.length;
                    $scope.grilla.data = data;
                }
            }

            function add(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'sucursal2.add.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    templateUrl: 'app.views/tablas/sucursal/add.html'
                }).then(getData);
            }

            function del(event) {
                $mdDialog.show({
                    clickOutsideToClose: true,
                    controller: 'sucursal2.del.ctrl',
                    controllerAs: 'ctrl',
                    focusOnOpen: false,
                    targetEvent: event,
                    locals: { desserts: $scope.selected },
                    templateUrl: 'tapp.views/tablas/sucursal/del.html'
                }).then(getData);
            }



            function removeFilter() {
                $scope.grilla.filter.show = false;
                $scope.grilla.query.filter = '';

                if($scope.grilla.filter.form.$dirty) {
                    $scope.grilla.filter.form.$setPristine();
                }
            }





        }

    });







app.controller('sucursal2.add.ctrl',
    function ($mdDialog, $resource, $scope) {
    'use strict';

    this.cancel = $mdDialog.cancel;

    function success(obj) {
        alert('success')
        $mdDialog.hide(obj);
    }

    this.addItem = function () {
        $scope.item.form.$setSubmitted();

        console.log($scope.item.form)
        if($scope.item.form.$valid) {
            $resource('/api/sucursal/:idSucAgen').save( {} , success);

            //$nutrition.desserts.save({dessert: $scope.dessert}, success);
        }
    };

});


app.controller('sucursal2.del.ctrl',
    function (desserts, $mdDialog, $nutrition, $scope, $q) {
    'use strict';

    this.cancel = $mdDialog.cancel;

    //function success(obj) {
    //    alert('cierreii');
    //    $mdDialog.hide(obj);
    //}


    function deleteDessert(obj, index) {
        //var deferred = $nutrition.desserts.remove({id: dessert._id});
        var deferred = $resource('/api/sucursal/:idSucAgen').delete( {id: obj._id} , success);

        deferred.$promise.then(function () {
            obj.splice(index, 1);
        });

        return deferred.$promise;
    }

    function onComplete() {
        $mdDialog.hide();
    }


    function success() {
        alert('x1')
        $q.all(desserts.forEach(deleteDessert)).then(onComplete);
    }



});
